import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { MasterService } from 'src/app/common-methods/services/master.service';

// import { MessageService } from 'primeng/api';
// import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { Observable } from 'rxjs';
import {  MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatChipInputEvent } from '@angular/material/chips';
import { UntypedFormControl, Validators } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { TableHeaderCheckbox } from 'primeng/table';
import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';

import { VerificationService } from 'src/app/common-methods/services/verification.service';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { base64StringToBlob } from 'blob-util';
import { DomSanitizer } from '@angular/platform-browser';
export interface PeriodicElement {
  position: number;
  empname: string;
  address: string;
  created: string;
  cdate: string;
  empstatus: string;
}
@Component({
  standalone: false,
  selector: 'app-red-case-approval',
  templateUrl: './red-case-approval.component.html',
  styleUrls: ['./red-case-approval.component.css']
})
export class RedCaseApprovalComponent implements OnInit {
  
  header : RedCaseApprovalVM = null;
  @ViewChild('global', { static: true }) global!: ElementRef;
  @ViewChild('dt', { static: false }) dt: any;
  dashboardCountVm = new RedCaseVm();  
  itemperpage;
 
  currentPage = 1;
  tempCurrentPage = 1;
  totalpages: number;
  isGridPage = true;
  btnApprove = false;
  empFlag = false;
   researchStatusLookUpValue: any;
  redCaseApprovalValue: RedCaseApprovalVM[] = [];
  //verificationMoveToTl : VerificationMoveToTl[] =[]
  assignControl = new UntypedFormControl('Not Assigned');
  private table: Table;
  private headerCheckBox: TableHeaderCheckbox;
  @ViewChild('verifiedList', { static: true }) verifiedList;
  @ViewChild('assignPopUp', { static: true }) assignPopUp!: any;;
  @ViewChild('rem', { static: true }) Textarea;
  screeningOwner = new UntypedFormControl('', Validators.required);
  filterOwnerName = new UntypedFormControl();
  selectedQAIndex = 0;
  gridColumnsAll = [
    
    { field: 'candidateFirstName', header: 'Candidate Name' },
    { field: 'clientName', header: 'Client Name' },
    { field: 'siteName', header: 'Site Name' },
    { field: 'clientRefNo', header: 'Client Ref No' },
    { field: 'componentStatus', header: 'Status' },
    { field: 'screeningCompId', header: 'Verification ID' },
    // { field: 'assignToFirstName', header: 'Assigned Owner' },
    // { field: 'assignByFirstName', header: 'Assigned By' },
    // { field: 'updatedByFirstName', header: 'Submitted By' },
    // { field: 'assignedDate', header: 'Assigned Date' },
  ];
  gridFrozenCols = [
    { field: 'action', header: 'Action' },
  ];
  screenAuth: any = {}; currentPath = ''; 
  routePath =  'Configure / Verification / Red Case Approval';;
  
  fromDate = '';
  toDate = '';
  assignedFromDate = '';
  assignedToDate = '';
  statusId = new UntypedFormControl(null);
  researchEmpInsCloneValue: any[] = [];
  @ViewChild('siteVisit', { static: true }) siteVisit;
  @ViewChild('businessType', { static: true }) businessType;
  @ViewChild('moveToFileSub', { static: true }) moveToFileSub;
  @ViewChild('confirmation', { static: true }) confirmation;
  dialogRef: any;
  businessCategory: any[] = [];
  businessCategoryId = new UntypedFormControl();
  arrangedFlag: any;
  owner: any[] = [];
  updatedByFirstNameFormCtrl = new UntypedFormControl();
  updatedByFirstNameFilteredOptions: Observable<string[]>;
  @ViewChild('updatedByFirstNameTrigger', { static: true }) updatedByFirstNameTrigger: MatMenuTrigger;
  nameFormCtrl = new UntypedFormControl();
  nameFilteredOptions: Observable<string[]>;
  @ViewChild('nameTrigger', { static: true }) nameTrigger: MatMenuTrigger;
  referenceNoFormCtrl = new UntypedFormControl();
  referenceNoFilteredOptions: Observable<string[]>;
  @ViewChild('referenceNoTrigger', { static: true }) referenceNoTrigger: MatMenuTrigger;
  countryNameFormCtrl = new UntypedFormControl();
  countryNameFilteredOptions: Observable<string[]>;
 @ViewChild('countryNameTrigger', { static: true }) 
countryNameTrigger!: MatMenuTrigger;
  researchStatusFormCtrl = new UntypedFormControl();
  researchStatusFilteredOptions: Observable<string[]>;
  @ViewChild('researchStatusTrigger', { static: true }) researchStatusTrigger: MatMenuTrigger;
  assignToFirstNameFormCtrl = new UntypedFormControl();
  assignToFirstNameFilteredOptions: Observable<string[]>;
  @ViewChild('assignToFirstNameTrigger', { static: true }) assignToFirstNameTrigger: MatMenuTrigger;
  researchResultFormCtrl = new UntypedFormControl();
  researchResultFilteredOptions: Observable<string[]>;
  @ViewChild('researchResultTrigger', { static: true }) researchResultTrigger: MatMenuTrigger;
  @ViewChild('createdDateTrigger', { static: true }) createdDateTrigger: MatMenuTrigger;
  @ViewChild('assignedDateTrigger', { static: true }) assignedDateTrigger: MatMenuTrigger;
  dupList: any[] = [];
  assignedDupList: any[] = [];
  rejectedRemarks = new UntypedFormControl();
  verificationIdList: any;
  userData:any;
  constructor(private sanitizer: DomSanitizer, public screeningService: ScreeningService, public masterService: MasterService, public common: CommonService, private router: Router,
    // tslint:disable-next-line: align
    private message: MessageService, private dateP: DatePipe, public dialog: MatDialog, public verification: VerificationService) { }
  ngOnInit() {
    this.itemperpage = 10;
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.getRedCaseDetail();
  }
  getRedApprovalCase(data,flag){
this.isGridPage = false;
this.btnApprove = true;

  }
  getRedCaseDetail(){

   
    this.verification.GetVerificationRedEduDetails(this.userData).subscribe(resp => {
      if (resp) {
        this.redCaseApprovalValue = resp;
        this.redCaseApprovalValue.forEach(element => {
        element.screeningCompId ='ACG'+element.screeningCompId ;
          element.candidateFirstName = element.candidateFirstName ? (element.candidateFirstName + (element.candidateMiddleName
            ? (' ' + element.candidateMiddleName) : '') + (element.candidateLastName ? (' ' + element.candidateLastName) : '')) : null;
        
        });
        
      }
    });
  }
  private TblAutoFilters(): void {
    this.nameFilteredOptions = this.nameFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.redCaseApprovalValue.map(x => x.candidateFirstName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
    
    
    this.dupList = this.common.CloneObject(this.redCaseApprovalValue);
    this.assignedDupList = this.common.CloneObject(this.redCaseApprovalValue);
  }
  getFilterValue(value: any) {
    if (this.userData.teamLeadFlag === true || this.userData.subTeamLeadFlag === true) {
      if (value === 'Assigned' && this.common.commonFrFlag != this.common.underReviewStatus) {
        this.redCaseApprovalValue = this.researchEmpInsCloneValue.filter(x => x.assignToUserId > 0 && (this.statusId.value ?
          (x.researchStatusId === this.statusId.value.lookUpId) : true));
      } else if (this.common.commonFrFlag != this.common.underReviewStatus) {
        this.redCaseApprovalValue = this.researchEmpInsCloneValue.filter(x => !(x.assignToUserId > 0) && (this.statusId.value ?
          (x.researchStatusId === this.statusId.value.lookUpId) : true));
      }
      if (value === 'Assigned' && this.common.commonFrFlag == this.common.underReviewStatus) {
        this.redCaseApprovalValue = this.researchEmpInsCloneValue.filter(x => x.assignToUserId > 0 &&
          x.researchResult == this.common.underReviewStatus);
      } else if (this.common.commonFrFlag == this.common.underReviewStatus) {
        this.redCaseApprovalValue = this.researchEmpInsCloneValue.filter(x => !(x.assignToUserId > 0) &&
          x.researchResult == this.common.underReviewStatus);
      }
      
    }
    this.TblAutoFilters();
  }
 
  resetTbl() {
    this.dt.reset();
    this.global.nativeElement.value = '';
    this.resetDate();
  }
  
  ngOnDestroy() {
    this.common.commonFrFlag = undefined;
  }
  
  getTotalPages(totalRecords, rows) {
    this.totalpages = Math.ceil((totalRecords) / rows);
    return Math.ceil((totalRecords) / rows);
  }
  navigateNxtPrevPage(pageNo, rows) {
    this.currentPage = pageNo / rows;
    this.tempCurrentPage = this.currentPage;
  }
  navigatePage(pageNo, rowscount) {
    if (+pageNo > this.totalpages || +pageNo <= 0) {
      this.currentPage = this.tempCurrentPage;
    } else {
      this.dt.onPageChange({ first: ((pageNo - 1) * rowscount), rows: rowscount });
      this.tempCurrentPage = this.currentPage;
    }
  }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }
  resetDate() {
    this.fromDate = '';
    this.toDate = '';
    this.redCaseApprovalValue = this.dupList;
  }
  showall() {
    if (this.redCaseApprovalValue.length > 0) {
      this.itemperpage = this.redCaseApprovalValue.length;
    }
  }
  
  
  
  exportAsExcelFile() {
    const column = [    { field: 'candidateFirstName', header: 'Candidate Name' },
    { field: 'clientName', header: 'Client Name' },
    { field: 'siteName', header: 'Site Name' },
    { field: 'clientRefNo', header: 'Client Ref No' },
    { field: 'componentStatus', header: 'Status' },
    { field: 'screeningCompId', header: 'Verification ID' },];
   
    this.common.exportToExcel(column, this.redCaseApprovalValue, 'Red Case Approval List');
  }
  
  
  back(){
    if(this.isGridPage == true){
      this.router.navigate(['dashboard/home']);
    }else{
     this.isGridPage = true;
     this.btnApprove = false;
    
     
    }
  }
  openPopuprej(Flag: any) {
    if (Flag === true || (Flag === false )) {
      const popupData = {
        action: this.common.DELETECONFIRMATION,
        headerText: 'Confirmation',
        bodyText: 'Are you sure,Do you want to ' + (Flag === true ? 'approve?' : 'reject?')
      };
      const dialogRef = this.dialog.open(CommonAlertsComponent, {
        width: '320px',
        data: popupData,
        disableClose: true
      });
      if (dialogRef) {
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            const action = String(result.type);
            if (action === this.common.DELETECONFIRMATION) {
              this.approveOrRejectTL(false,true);
            }
          }
        });
      }
    } else {
      this.rejectedRemarks.markAsTouched();
    }
  }
  
  openPopup(Flag: any) {

    if (Flag === true || (Flag === false )) {
      const popupData = {
        action: this.common.DELETECONFIRMATION,
        headerText: 'Confirmation',
        bodyText: 'Are you sure,Do you want to ' + (Flag === true ? 'approve?' : 'reject?')
      };
      const dialogRef = this.dialog.open(CommonAlertsComponent, {
        width: '320px',
        data: popupData,
        disableClose: true
      });
      if (dialogRef) {
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            const action = String(result.type);
            if (action === this.common.DELETECONFIRMATION) {
              this.approveOrRejectTL(true,false);
            }
          }
        });
      }
    } else {
      this.rejectedRemarks.markAsTouched();
    }
  }
  approveOrRejectTL(apflag,reflag) {
    
    
    const TlApproveData: VerificationMoveToTl = {
      tLApprovedFlag :apflag == true?true:false,
      teamName:this.userData.teamName,
      candidateName: this.header.candidateFirstName,
      screeningCompId: Number(this.header.screeningCompId.split('ACG')[1]),
      screeningId: this.header.screeningId,
      clientRefNo: this.header.clientRefNo,
      clientId: this.header.clientId,
      clientName: this.header.clientName,
      verificationId: 0,
      componentName: this.header.componentName,
      serviceType: '',
      fees: 0,
      remarks: '',
      applicationId: 0,
      loggedIn: this.userData.userId,
    };

    this.verification.TeamLeadApprovedOrRejected(TlApproveData) .subscribe(res => {
      if (res) {
        
        
          this.showTopCenter('success', 'Success', ((apflag === true ? 'Approved' : 'Rejected') + ' Successfully'));
          this.isGridPage = true;
          this.btnApprove = false;
        
          this.getRedCaseDetail();
      } else {
        this.showTopCenter('warn', 'Failure Message', 'Failed');
      }
    });
  } 
  dialogClose() {
    this.dialog.closeAll();
  }
}


class RedCaseApprovalVM {
  screeningId:number;
  clientId:number;
  screeningCompId: string;
  siteName: string;
  clientRefNo: string;
  componentName: string;
  componentStatus: string;
  candidateFirstName: string;
  candidateMiddleName: string;
  candidateLastName: string;
  clientName: string;
  
}
export class LoginUserDetVm {
  teamId: number;
  teamName: string;
  userId: number;
  deptId: number;
  DeptName: string;
  applicationId: number;
  subTeamId: number;
  subTeamName: string;
  clientId: string[];
  teamLeadFlag: boolean;
  subTeamLeadFlag: boolean;
  workFlowLookupId: number;
  siteId: number[];
  SubmissionFlag: boolean;
  caseCreationFlag: boolean;
  dataSubmissionFlag: boolean;
  verificationFlag: boolean;
  qcFlag: boolean;
  insufficiencyFlag: boolean;
}


export class RedCaseVm {
  userId: number;
  deptId: number;
  deptName: string;
  applicationId: number;
  teamId: number;
  subTeamId: number;
  subTeamName: string;
  teamName: string;
  clientId: any[];
  teamLeadFlag: boolean;
  subTeamLeadFlag: boolean;
  workFlowLookupId: number;
  siteId: any[];
  firstName: string;
  lastName: string;
  levelOneFlag : boolean;
  Fqc: string;
  pageSize: number;
  page: number;
  filters: string;
  sorts: string;
  applyPaging: boolean;
  needTotal: boolean;
  // sieveModel: any;
}

export class VerificationMoveToTl {
  tLApprovedFlag:boolean;
  teamName:string;
  candidateName: string;
  screeningCompId: number;
  screeningId: number;
  clientRefNo: string;
  clientId: number;
  clientName: string;
  verificationId: number;
  componentName: string;
  serviceType: string;
  fees: number;
  remarks: string;
  applicationId: number;
  loggedIn: number;
}