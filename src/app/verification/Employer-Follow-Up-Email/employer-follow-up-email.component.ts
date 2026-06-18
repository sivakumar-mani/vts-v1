import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { VerificationService } from 'src/app/common-methods/services/verification.service';
import { MessageService } from 'primeng/api';
import moment from 'moment';

export class CallbackDetails {
  lstScreeningComp: any[] = [];
  callbackDate: any;
  loggedIn: number;
  teamName: any;
}
@Component({
  standalone: false,
  selector: 'app-employer-follow-up-email',
  templateUrl: './employer-follow-up-email.component.html',
  styleUrls: ['./employer-follow-up-email.component.css']
})
export class EmployerFollowUpEmailComponent implements OnInit {
  filterFlag = false;
  column: any;
  direction: number;
  currentPage = 0;
  totalSize = 0;
  itemPerPage;
  page = 1;
  assiginCallBaackList: CallbackDetails = new CallbackDetails();
  searchPage: boolean = false;
  userData: any;
  screenAuth: any = {};
  isDesc: boolean;
  btnAddUpload: boolean;
  minDate = new Date();
  maxDate = new Date();
  verificationList: any[] = [];
  routePath = 'Verification / Employer Follow-Up Email';
  VerificationSearchForm: UntypedFormGroup;
  clientControl!: AutoCompleteDropDown;
  searchValueArr: any;
  @ViewChild('EmployerFollowPopUp', { static: true }) EmployerFollowPopUp;
  verificationControl!: AutoCompleteDropDown;
  dialogRef: any;
  clientList: any[] = [];
  verificationId: any[] = [];
  clientReList: any[] = [];
  clientRefControl!: AutoCompleteDropDown;
  veCols = [{ header: 'Candidate Name', field: 'candidateFullName' }, { header: 'Client Ref No', field: 'clientRefNo' },
  { header: 'Transaction Id', field: 'transactionId' },
  { header: 'Client Name', field: 'clientName' }, { header: 'Verification Id', field: 'verificationId' }, { header: 'Screening Id', field: 'clientScreeningId' },
  { header: 'Vendor Name', field: 'vendorName' }, { header: 'Component Name', field: 'componentName' },
  { header: 'Screening Owner', field: 'screeningOwnerName' },
  { header: 'Component Status', field: 'componentStatus' }, { header: 'Functional Entity', field: 'functionalEntity' },
  { header: 'Case Status', field: 'caseStatus' }, { header: 'Case Initiation Date', field: 'requestDate' }, { header: 'DE Submitted By', field: 'createdName' }, { header: 'Call Back Date', field: 'callbackDate' },
  { header: 'Country', field: 'country' }, { header: 'InprogressDays', field: 'inProgressDays' }, { header: 'TatDays', field: 'tatDays' }];

  callBackDate: Date;
  selectall = new UntypedFormControl();
  domNewExportFlag: boolean = false;
  selectAllCheckBox: boolean = false;
  sortFlag: boolean = false;
  commentsFollowUpForm: UntypedFormGroup;
  totalCount = 0;
  @Input() filterLength: number;
  constructor(private authService: AuthService, public commonService: CommonService, private verificationService: VerificationService,
    private datePipe: DatePipe, public router: Router, public screeningService: ScreeningService, private message: MessageService, public dialog: MatDialog,) {

  }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.userData.callBackDate = null;
    this.screenAuth = this.authService.getScreenAuth(this.router.url);
    this.btnAddUpload = false;
    this.itemPerPage = 10;
    this.initFormGroup();
    this.GetScreeningEmployerFollowupHistory();
    this.initCommentFollowUpForm();

  }

  initDefaultData() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.userData.callBackDate = null;
    this.screenAuth = this.authService.getScreenAuth(this.router.url);
    // this.userData.needTotal = false;
    // this.userData.applyPaging = true;
    // this.screeningService.getClients(this.userData).subscribe(res => {
    //   if (res) {
    //     this.clientList = res;
    //     this.initautoCompleteCtrl();
    //   }
    // });

    // this.screeningService.getVerificationId(this.userData).subscribe(res => {
    //   if (res) {
    //     this.verificationId = res;
    //     this.initautoCompleteCtrl();
    //   }
    // });

    // this.screeningService.getClientRef(this.userData).subscribe(res => {
    //   if (res) {
    //     this.clientReList = res;
    //     this.initautoCompleteCtrl();
    //   }
    // });
    if (this.verificationList != null && this.verificationList.length>0) {
      this.clientList = Array.from(new Map
        (this.verificationList.map(x => ({ clientName: x.clientName }))
          .map(e => [e.clientName, e])).values());
      this.verificationId = Array.from(new Map
        (this.verificationList.map(x => ({ verificationId: x.verificationId }))
          .map(e => [e.verificationId, e])).values());
      this.clientReList = Array.from(new Map
        (this.verificationList.map(x => ({ clientRefNo: x.clientRefNo }))
          .map(e => [e.clientRefNo, e])).values());
          
    }
    this.initautoCompleteCtrl();
    
  }
  initFormGroup() {
    this.VerificationSearchForm = new UntypedFormGroup({
      clientName: new UntypedFormControl(null),
      verificationId: new UntypedFormControl(null),
      clientRefNo: new UntypedFormControl(null),
      callBackDate: new UntypedFormControl(''),

    });

  }
  filter() {
    let filter = this.userData.filters;
    if (this.VerificationSearchForm.value.clientName && this.VerificationSearchForm.get('clientName')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'clientName@=' + this.VerificationSearchForm.value.clientName;
    }
    if (this.VerificationSearchForm.value.verificationId && this.VerificationSearchForm.get('verificationId')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'verificationId@=*' + this.VerificationSearchForm.value.verificationId;
    }
    if (this.VerificationSearchForm.value.clientRefNo && this.VerificationSearchForm.get('clientRefNo')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'clientRefNo@=*' + this.VerificationSearchForm.value.clientRefNo;
    }
    this.userData.filters = filter;
  }
  getFilterLen(c): string {
    this.filterFlag = true;
    this.filterLength = c;
    return 'listrow';
  }
  initCommentFollowUpForm() {
    this.commentsFollowUpForm = new UntypedFormGroup({
      callBack: new UntypedFormControl()
    });
  }
  initautoCompleteCtrl() {
    this.clientControl = new AutoCompleteDropDown('Client Name', 'clientName', 'clientName', 'clientName', this.clientList,
      '', this.VerificationSearchForm, false, false, false, 'standard');
    this.verificationControl = new AutoCompleteDropDown('Verification ID', 'verificationId', 'verificationId', 'verificationId',
      this.verificationId, '', this.VerificationSearchForm, false, false, false, 'standard');
    this.clientRefControl = new AutoCompleteDropDown('Client Ref ID', 'clientRefNo', 'clientRefNo', 'clientRefNo',
      this.clientReList, '', this.VerificationSearchForm, false, false, false, 'standard');

  }

  search() {
   // if (this.VerificationSearchForm.valid) {
      this.filter();
      this.GetScreeningEmployerFollowupHistory()
    //} 
    // else {
    //   this.showTopCenter('warn', 'Failure Message', 'Please Fill all required field')
    // }
  }
  sortBy(type: any) {
    this.isDesc = !this.isDesc;
    this.column = type;
    this.direction = this.isDesc ? 1 : -1;
  }
  getPage(event: any) {
    this.page = event;
  }
  preventInfinite() {
    if (!this.itemPerPage) {
      this.itemPerPage = 1;
    }
  }
  getTotalPage(): number {
    if (this.verificationList.length) {
      return Math.ceil(this.verificationList.length / this.itemPerPage);
    }
  }

  //start :Api Bind Method
  GetScreeningEmployerFollowupHistory(excelFlag = false, refresh = true) {
    this.userData.callBackDate = (this.VerificationSearchForm.controls.callBackDate.value != null) ? this.datePipe.transform(this.VerificationSearchForm.controls.callBackDate.value, 'yyyy-MM-dd') : this.VerificationSearchForm.controls.callBackDate.value;
     this.verificationService.GetScreeningEmployerFollowupHistory(this.userData).subscribe(resp => {
            
      const historyList = resp;     
      this.totalCount = historyList.length;
      this.userData.filters = '';
      if (historyList.length > 0) {
        this.verificationList = historyList;
        this.initDefaultData();
      }
      else {
        this.verificationList = [];
        this.initDefaultData();
        if (refresh === true)
          this.showTopCenter('warn', 'Info Message', 'No Record Found')
      }
    })

    if (excelFlag === true) {
      this.shieveExcel(this.verificationList);
    }
  }
  //end :Api Bind Method
  // start :-reset code 
  resetFilterSort() {
    this.selectall.setValue(false);
    this.userData.filters = '';
    this.VerificationSearchForm.value.callBackDate = null;
    this.VerificationSearchForm.reset();
    this.verificationList = [];
    this.GetScreeningEmployerFollowupHistory();
  }
  // End
  // Start:- sorting code  
  sortAll(Name, sortFlag) {
    this.column = Name;
    if (Name === 'candidateName') {
      if (sortFlag === true) {
        this.verificationList.sort((a, b) => a.candidateFirstName.localeCompare(b.candidateFirstName));
        this.sortFlag = false;
        this.isDesc = false;
      }
      else {
        this.verificationList.sort((a, b) => b.candidateFirstName.localeCompare(a.candidateFirstName));
        this.sortFlag = true;
        this.isDesc = true;
      }
    }
    else if (Name === 'verId') {
      if (sortFlag === true) {
        this.verificationList.sort((a, b) => a.screeningCompId - b.screeningCompId);
        this.sortFlag = false;
        this.isDesc = false;
      }
      else {
        this.verificationList.sort((a, b) => b.screeningCompId - a.screeningCompId);
        this.sortFlag = true;
        this.isDesc = true;
      }
    }
    // else if (Name === 'tatdays') {
    //   if (sortFlag === true) {
    //     this.verificationList.sort((a, b) => a.tatStatus.localeCompare(b.tatStatus));
    //     this.sortFlag = false;
    //     this.isDesc = false;
    //   }
    //   else {
    //     this.verificationList.sort((a, b) => b.tatStatus.localeCompare(a.tatStatus));
    //     this.sortFlag = true;
    //     this.isDesc = true;
    //   }
    // }
    else {
      if (this.sortFlag) {
        this.verificationList.sort((a, b) => {
          const dateA = new Date(a.callbackDate);
          const dateB = new Date(b.callbackDate);
          return dateA.getTime() - dateB.getTime();
        });
        this.sortFlag = false;
        this.isDesc = false;
      } else {
        this.verificationList.sort((a, b) => {
          const dateA = new Date(a.callbackDate);
          const dateB = new Date(b.callbackDate);
          return dateB.getTime() - dateA.getTime();
        });
        this.sortFlag = true;
        this.isDesc = true;
      }
    }

  }
  //ENd:- sorting code 

  // selectVerification(screeningCompId: any) {
  //   this.verificationService.changeMessage(screeningCompId);
  //   this.verificationService.searchValue = this.VerificationSearchForm.value;
  //   this.verificationService.searchArray = this.searchValueArr;
  // }
  //checkbox code start
  selectAll(e: any) {
    if (e.checked === true) {
      this.verificationList.forEach(vd => {
        vd.dummyFlags = true;
      });
    } else {
      this.verificationList.forEach(vd => {
        vd.dummyFlags = false;
      });
    }
  }
  selectcheckBox(e, data) {
    if (e.checked === true) {
      data.dummyFlags = true;
    } else {
      data.dummyFlags = false;
      this.selectall.setValue(false);
    }
    let totalList = this.verificationList.length;
    const selList = this.verificationList.filter(x => x.dummyFlags === true);
    if (selList.length !== totalList) {
      this.selectall.setValue(false);
    } else {
      this.selectall.setValue(true);
    }
  }
  // checkbox code end
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }
  // start : INITIATE FOLLOW-UP EMAIL Arrow Icon code 
  onIconClick() {
    const callbackList = this.verificationList.filter(x => x.dummyFlags === true);
    if (callbackList.length === 0) {
      this.showTopCenter('warn', 'Failure Message', 'Please select atleast One Candidate');
      return;
    }
    this.dialogRef = this.dialog.open(this.EmployerFollowPopUp, {
      width: '400px',
      disableClose: true
    });
  }
  dialogClose() {
    this.dialogRef.close();
    this.selectall.setValue(false);
    this.commentsFollowUpForm.reset()
  }
  // end : INITIATE FOLLOW-UP EMAIL Arrow Icon code 

  //start: call back date update
  updateCallbackDate() {
    this.assiginCallBaackList = new CallbackDetails();

    const callbackList = this.verificationList.filter(x => x.dummyFlags === true);
    if (callbackList.length === 0) {
      this.showTopCenter('warn', 'Failure Message', 'Please select atleast One Candidate');
      return;
    }
    if (this.commentsFollowUpForm.value.callBack == null) {
      this.showTopCenter('warn', 'Failure Message', 'Please provide call back date to proceed further.');
      return;
    }
    callbackList.forEach(item => {
      this.assiginCallBaackList.lstScreeningComp.push(item.screeningCompId);
    });
    // this.commentsFollowUpForm.controls.callBack.value
    // this.assiginCallBaackList.callbackDate = this.commonService.getTimezoneOffset(this.commentsFollowUpForm.value.callBack.value, false);
    // this.assiginCallBaackList.callbackDate = this.commonService.getTimezoneOffset(this.commentsFollowUpForm.controls.callBack.value, false);
    this.assiginCallBaackList.callbackDate = this.commentsFollowUpForm.controls.callBack.value;
    this.assiginCallBaackList.loggedIn = this.userData.userId;
    this.assiginCallBaackList.teamName = this.userData.teamName;
    console.log(this.assiginCallBaackList);

    this.verificationService.SendBulkFollowupMail(this.assiginCallBaackList).subscribe(res => {
      if (res.success === true) {
        this.dialogClose();
        this.showTopCenter('success', 'Success Message', 'Follow-up Mail sent successfully');

        this.GetScreeningEmployerFollowupHistory(false, false);
      }
      else {
        this.showTopCenter('warn', 'Failure Message', 'Please provide call back date to proceed further');
      }
    });
  }
  //start: call back date update
  closeSearch() {
    this.router.navigate(['dashboard/home']);
  }
  //start:- excel download code
  downloadExcel() {
    this.userData.sorts = ''
    if (this.verificationList.length > 0) {
      this.GetScreeningEmployerFollowupHistory(true);
    }
  }
  shieveExcel(verificationDetails: any) {
    const verificationLists = verificationDetails;

    verificationLists.map(m => m.fqcByFN = m.fqcByName ? (m.fqcByName.firstName ? (m.fqcByName.firstName + (m.fqcByName.middleName ? (' ' + m.fqcByName.middleName) : '')
      + (m.fqcByName.lastName ? (' ' + m.fqcByName.lastName) : '')) : null) : null);
    verificationLists.map(m => m.frOwnerFN = m.frOwnerFN ? (m.frOwnerFN + (m.frOwnerMN ? (' ' + m.frOwnerMN) : '')
      + (m.frOwnerLN ? (' ' + m.frOwnerLN) : '')) : null);
    verificationLists.map(m =>
      m.candidateFullName = m.candidateFirstName + ' ' + m.candidateMiddleName + ' ' + m.candidateLastName);


    this.commonService.exportToExcel(this.veCols, verificationLists, 'Employer Follow-Up Email')

  }

  
openOrginalOwerdialog(): void {
    // TODO: add logic later
  }

  showBulk(): void {
    // TODO: add logic later
  }

  checkPeriod(): void {
    // TODO: add logic later
  }

  
}
