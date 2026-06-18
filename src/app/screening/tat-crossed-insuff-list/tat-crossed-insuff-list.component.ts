import { OnDestroy, Input } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { ScreeningService } from '../../common-methods/services/screening.service';
import { VerificationService } from 'src/app/common-methods/services/verification.service';
import { UntypedFormControl, UntypedFormGroup, UntypedFormBuilder, UntypedFormArray, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { User } from 'src/app/common-methods/models/user';
import { RaiseInsufficiencyComponent } from '../DynamicComponents/raise-insufficiency/raise-insufficiency.component';
import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { AssignScreeningOwnerVm, AssignCaseVm, AssignDEView } from '../../common-methods/models/caseCreationView';
import { MasterService } from '../../common-methods/services/master.service';
import { UserData } from 'src/app/common-methods/models/user';
import { forEach } from 'jszip';
//export class DeleteInsuff {
  export class MoveTatinsuffList{
  // screeningCompId: number;
  // clientRefNo : string;
  // sreeningId : number;
  tatCrossedInsuffDetails : any[];
  logginId : any;
}
export class AssignOwner {
  assignScreeningCompId: any[] = [];
  screeningOwnerId: number;
  loginUserDetVm: UserData;
}
@Component({
  standalone: false,
  selector: 'app-tat-crossed-insuff-list',
  templateUrl: './tat-crossed-insuff-list.component.html',
  styleUrls: ['./tat-crossed-insuff-list.component.css']
})
export class tatcrossedInsuffListComponent implements OnInit, OnDestroy {
  @ViewChild('assignPopUp', { static: true }) assignPopUp!: any;;
  
  status = 'Not Assigned';
  routePath = 'Tat Crossed Insufficiencies';
  assiginownerList: AssignOwner = new AssignOwner();
  depn: string
  assignflag: boolean;
  currentPage = 1;
  AssignedDEList: any[] = [];
  AssignedDEListExport: any[] = [];
  menubar = [{ menuName: 'Not Assigned' }, { menuName: 'Assigned' }];
  menubarUser = [{ menuName: 'Assigned' }];
  assignDE = new AssignDEView();
  deptId: any;
  index: number;
  scope: AssignCaseVm;
  array: any;
  ownerflag = false;
  screeningOwnerId = new UntypedFormControl();
  assignCase: AssignCaseVm[] = [];
  subTeamName: string;
  filterOwnerName = new UntypedFormControl();
  assignScreeningOwner = new AssignScreeningOwnerVm();
  screeningOwnerList: any[] = [];
  screenowner = new UntypedFormControl('', Validators.required);
  userData: UserData;
  raiseInsuffCompList: any[] = [];
  raiseInsuffCompListExport: any[] = [];
  headerName: string;
  btnDelete: boolean;
  btnTatInsuff: boolean;
  btnExcelExport:boolean;
  btnBack:boolean;
  selectall = new UntypedFormControl();
  //deleteRaiseInsuff = new DeleteInsuff();
  moveTatinsuffList = new MoveTatinsuffList();
 // moveTatinsuffList : any;
  dialogRef: any;
  @ViewChild('insufficiency', { static: true }) insufficiency;
  insufficiencyForm: UntypedFormGroup;
  docList: any[] = [];
  searchValueArr: any[] = [];
  itemPerPage = 10;
  pageNo = 1;
  isDesc: boolean;
  column: any;
  direction: number;
  insuffSearchForm: UntypedFormGroup;
  //componentControl!: AutoCompleteDropDown;
  VerificationControl !: AutoCompleteDropDown;
 // caseRefNoControl!: AutoCompleteDropDown;
 ClientRefNoControl!: AutoCompleteDropDown;
  clientControl!: AutoCompleteDropDown;
  statusControl!: AutoCompleteDropDown;
  clientNameControl!: AutoCompleteDropDown;
  delayHoursControl!: AutoCompleteDropDown;
  candidateControl!: AutoCompleteDropDown;
  screeningIdControl:AutoCompleteDropDown;
  clientRefControl!: AutoCompleteDropDown;
  empInsControl!: AutoCompleteDropDown;
  clientList: any;
  vendorList: any;
  componentList: any;
  statusList: any;
  userList: any;
  VerificationList : any;
  screeningIdlist:any;
  clientRefNoList: any[] = [];
  searchcandidateList: any[] = [];
  @Input() filterLength: number;
  @ViewChild('insuff', { static: true }) insuff: RaiseInsufficiencyComponent;
  shieveTotalCount = 0;
  shievePageNo = 1;
  shievePageSize = 5;
  PagingApply = true;
  caseStatusFlag: boolean;

  tabIndex = 1;
  constructor(public master: MasterService, public screeningService: ScreeningService, public common: CommonService, public dialog: MatDialog, private fb: UntypedFormBuilder,
    private verificationService: VerificationService, private route: Router, private messageService: MessageService
  ) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.initFormGroup();
    this.userData.page = this.shievePageNo;
    // if (this.screeningService.caseFlagType === this.common.INSUFFCLEARANCE) {
    //   this.headerName = 'Insufficiency Clearance';
    //   this.routePath = 'Insufficiency Cleared';
    //    if (this.userData.teamLeadFlag === true || this.userData.subTeamLeadFlag === true) {
    //     this.getClearInsufficiencyList(0);
    //     this.ownerflag = false;
    //     this.caseStatusFlag = false
    //   } else {
    //     this.getClearInsufficiencyList(1);
    //     this.ownerflag = true;
    //   }      
    //   this.btnExcelExport =true;
    //   this.btnBack = true;

    // } else {
      //if (this.screeningService.raiseInsufficiencyScreeningDetails.length === 0) {
        this.getTatInsufficiencyList();
        //this.getRaiseInsufficiencyScreeningList();
        this.headerName = 'Tat Crossed Insufficiencies';
        this.routePath = 'Tat Crossed Insufficiencies';
       // this.btnDelete = true;
       this.btnTatInsuff = true;
        this.btnExcelExport =true;
        this.btnBack = true;
      //} 
      // else {
      //   this.raiseInsuffCompList = this.screeningService.raiseInsufficiencyScreeningDetails;
      // }
    //}
    this.itemPerPage = 10;
  }
  initFormGroup() {
    this.insuffSearchForm = new UntypedFormGroup({
      clientName: new UntypedFormControl(null),
      clientRefNo: new UntypedFormControl(null),
      candidateName: new UntypedFormControl(null),
      empInsName: new UntypedFormControl(null),
      compName: new UntypedFormControl(null),
      vendorName: new UntypedFormControl(null),
      statusName: new UntypedFormControl(null),
      ownerName: new UntypedFormControl(null),
      receivedFromDate: new UntypedFormControl(null),
      receivedToDate: new UntypedFormControl(null),
      assignStatus: new UntypedFormControl(null),
      screeningId : new UntypedFormControl(null),
      insuffStatus : new UntypedFormControl(null),
      verificationId : new UntypedFormControl(null),

    });
    this.initautoCompleteCtrl();
  }
  getRaiseInsufficiencyScreeningList() {
    this.userData.levelOneFlag = this.screeningService.leveloneflag?this.screeningService.leveloneflag:false;
    
    this.screeningService.getRaiseInsufficiencyScreeningList(this.userData).subscribe(resp => {
      this.raiseInsuffCompList = resp ;
      // ? (this.screeningService.verificationPage === true ? resp.filter(x => x.workFlow === 'VE' || x.workFlow === 'QC' ) : resp.filter(x => x.workFlow !== 'VE')) : [];
      this.raiseInsuffCompList.forEach(ele => {
        ele.selected = false;
        ele.candidateFullName = ele.candidateFirstName + (ele.candidateMiddleName ? (' ' + ele.candidateMiddleName) : '') +
          (ele.candidateLastName ? (' ' + ele.candidateLastName) : '');
      });
      this.autocompleteData();
    });
  }
  initautoCompleteCtrl() {
    // if(this.screeningService.caseFlagType === this.common.INSUFFCLEARANCE) {
    //   this.componentControl = new AutoCompleteDropDown('Component Name', 'compName', 'id', 'name', this.componentList,
    //   '', this.insuffSearchForm, false, false, false, 'standard');
    //   this.clientControl = new AutoCompleteDropDown('Client Name', 'clientName', 'id', 'name', this.clientList,
    //   '', this.insuffSearchForm, false, false, false, 'standard');
    // } else {
      // this.componentControl = new AutoCompleteDropDown('Component Name', 'compName', 'compName', 'compName', this.componentList,
      // '', this.insuffSearchForm, false, false, false, 'standard');
      this.VerificationControl = new AutoCompleteDropDown('Verification Id', 'verificationId', 'verificationId', 'verificationId', this.VerificationList,
      '', this.insuffSearchForm, false, false, false, 'standard');
      this.clientControl = new AutoCompleteDropDown('Client Name', 'clientName', 'clientName', 'clientName', this.clientList,
      '', this.insuffSearchForm, false, false, false, 'standard');
      this.statusControl = new AutoCompleteDropDown('Status Name', 'statusName', 'insuffStatus', 'insuffStatus', this.statusList,
      '', this.insuffSearchForm, false, false, false, 'standard');
      this.ClientRefNoControl = new AutoCompleteDropDown('Client Reference No.', 'clientRefNo', 'clientReferenceNo', 'clientReferenceNo',
      this.clientRefNoList, '', this.insuffSearchForm, false, false, false, 'standard');
      this.candidateControl = new AutoCompleteDropDown('Candidate Name', 'candidateName', 'candidateName',
      'candidateName', this.searchcandidateList, '', this.insuffSearchForm, false, false, false, 'standard');
      this.screeningIdControl = new AutoCompleteDropDown('Screening Id', 'screeningId', 'clientScreeningId',
      'clientScreeningId', this.screeningIdlist, '', this.insuffSearchForm, false, false, false, 'standard');
    //}
  }
  resetFilterSort(type: any) {
    this.insuffSearchForm.reset();
    this.searchValueArr = [];
    this.column = '';
    //if (this.screeningService.caseFlagType === this.common.INSUFFCLEARANCE) {
      this.getTatInsufficiencyList();
    //}
  }
  sortBy(type: any) {
    this.isDesc = !this.isDesc;
    this.column = type;
    this.direction = this.isDesc ? 1 : -1;
  }
  getFilterLen(c): string {
    this.filterLength = c;
    return 'listrow';
  }
  getDisable() {
    return this.raiseInsuffCompList.some(x => x.insuffStatus.toLowerCase() === this.common.RAISED.toLowerCase());
  }
  selectAll(e: any) {
    if (e.checked === true) {
      this.raiseInsuffCompList.forEach(x => {
        x.selected = x.insuffStatus.toLowerCase() === this.common.RAISED.toLowerCase() ? true : false;
      });
    } else {
      this.raiseInsuffCompList.forEach(x => {
        x.selected = x.insuffStatus.toLowerCase() === this.common.RAISED.toLowerCase() ? false : false;
      });
    }
  }
  checkChanged(e, data, i) {
    e.checked ? data.selected = true : data.selected = false; this.selectall.setValue(false);
    if (this.raiseInsuffCompList.filter(x => x.selected === false).length === 0) {
      this.selectall.setValue(true);
    }
  }
  //deleteInsuff() 
  moveTatInsuff(){
    const MoveTatList = this.raiseInsuffCompList.filter(x => x.selected === true);
    MoveTatList.forEach(element => {
      delete element.selected;
    });  
    //const data = MoveTatList.map(x => x.screeningCompId);
    //this.moveTatinsuffList.screeningCompId = Object.assign(data.map(x => x));
    //this.moveTatinsuffList.screeningCompId = MoveTatList.map(x => x.screeningCompId);
    this.moveTatinsuffList.logginId = this.userData.userId;
    this.moveTatinsuffList.tatCrossedInsuffDetails = Array.from(new Map
      (MoveTatList.map(x => ({ screeningCompId: x.screeningCompId,clientRefNo: x.clientRefNo,screeningId : x.screeningId,compId:x.compId }))
        .map(e => [e.screeningCompId, e])).values());
    if (this.moveTatinsuffList.tatCrossedInsuffDetails.length > 0) {
      this.openMovetatInsuffDialog();
    } else {
      this.showNotification('warn', 'Failure Message', 'No cases selected');
    }
  }
  openMovetatInsuffDialog() {
    const popupData = {
      action: this.common.DELETECONFIRMATION,
      headerText: 'Confirmation',
      bodyText: 'The selected cases will be moved to Insufficiency Queue, would you like to continue?'
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
            this.MoveInsuffList();
          }
        }
      });
    }
  }
  MoveInsuffList() {
    //this.deleteRaiseInsuff.loggedIn = this.userData.userId;
    this.screeningService.TatOutMoveToInsufficiency(this.moveTatinsuffList).subscribe(resp => {
      if (resp) {
        this.showNotification('success', 'Success', 'Moved Successfully');
        this.getTatInsufficiencyList();
      }
    });
  }
  getTatInsufficiencyList() {
    //this.applyPagination();
    this.userData.levelOneFlag = this.screeningService.leveloneflag?this.screeningService.leveloneflag:false;
        this.screeningService.getTatInsufficiencyList(this.userData).subscribe(resp => {
      this.raiseInsuffCompList = resp ;
      //this.shieveTotalCount = resp.headers.get('X-Total-Count');
      //this.raiseInsuffCompList = resp.body;
      // ? (this.screeningService.verificationPage === true ? resp.filter(x => x.workFlow === 'VE' || x.workFlow === 'QC' ) : resp.filter(x => x.workFlow !== 'VE')) : [];
      this.raiseInsuffCompList.forEach(ele => {
        ele.selected = false;
        ele.candidateFName = ele.candidateFName + (ele.candidateMName ? (' ' + ele.candidateMName) : '') +
          (ele.candidateLName ? (' ' + ele.candidateLName) : '');
      });
     this.autocompleteData();
    });
  }
  
  getClearInsufficiencyList(cat: number) {
    this.userData.levelOneFlag = this.screeningService.leveloneflag ? this.screeningService.leveloneflag : false;
    this.applyPagination();
    this.screeningService.getClearInsufficiencyList(this.userData).subscribe(res => {
      if (res) {
        this.shieveTotalCount = res.headers.get('X-Total-Count');
        const resp = res.body;
        this.raiseInsuffCompList = resp ? (this.screeningService.verificationPage === true ? resp.filter(x => x.workFlow === 'VE') : resp.filter(x => x.workFlow !== 'VE')) : [];
        this.AssignedDEList = resp ? resp : [];
        this.raiseInsuffCompList.forEach(ele => {
          ele.candidateFullName = ele.candidateFirstName + (ele.candidateMiddleName ? (' ' + ele.candidateMiddleName) : '') +
            (ele.candidateLastName ? (' ' + ele.candidateLastName) : '');
        });
        this.filterAssignedCase(cat);
      }
    });
  }
  
  shieveFilter(ctrl: any) {
    if (this.insuffSearchForm.get(ctrl).valid) {
      this.getClearInsufficiencyList(this.index);
    }
  }
  removeValue(value: any) {
    if (value === '') {
      this.getClearInsufficiencyList(this.index);
    }
  }
  search() {
    if (this.insuffSearchForm.value.clientName || this.insuffSearchForm.value.clientRefNo || this.insuffSearchForm.value.compName || this.insuffSearchForm.value.candidateName) {
      this.getClearInsufficiencyList(this.index);
    } else {
      this.showTopCenter('warn', 'Failure Message', 'Choose filter values to search');
    }
  }
  shievePagination(event: any) {
    this.shievePageNo = event;
    this.getClearInsufficiencyList(this.index);
  }
  shieveShowall() {
    if (this.shieveTotalCount > 0) {
      this.shievePageSize = this.shieveTotalCount;
      this.getClearInsufficiencyList(this.index);
    }
  }
  applyPagination() {   
    let filter = '';
    if (this.insuffSearchForm.value.clientName && this.insuffSearchForm.get('clientName')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'clientName@=' + this.insuffSearchForm.value.clientName;
    } if (this.insuffSearchForm.value.clientRefNo && this.insuffSearchForm.get('clientRefNo')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'ClientRefNo@=' + this.insuffSearchForm.value.clientRefNo;
    } if (this.insuffSearchForm.value.candidateName && this.insuffSearchForm.get('candidateName')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'candidateName@=' + this.insuffSearchForm.value.candidateName;
    }  if (this.insuffSearchForm.value.verificationId && this.insuffSearchForm.get('verificationId')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'verificationId@=' + this.insuffSearchForm.value.verificationId;
    } 
   
    // this.userData.pageSize = this.shievePageSize;
    // this.userData.page = this.shievePageNo;
    // this.userData.filters = filter
    // this.userData.sorts = '';
    // this.userData.applyPaging = false;//this.PagingApply;
    // this.userData.needTotal = true;
  }
  autocompleteData() {
    if (this.screeningService.caseFlagType === this.common.INSUFFCLEARANCE) {
      // const data = { needTotal: true, applyPaging: true, pageSize: this.shievePageSize, page: this.shievePageNo, filters: '', sort: '' };
      this.screeningService.getClients(this.userData).subscribe(res => {
        if (res) {
          this.clientList = res;
        }
      });
      this.screeningService.getComponents(this.userData).subscribe(res => {
        if (res) {
          this.componentList = res;
        }
      });
    } else {
      this.clientList = Array.from(new Map
        (this.raiseInsuffCompList.map(x => ({ clientName: x.clientName }))
          .map(e => [e.clientName, e])).values());
      this.clientRefNoList = Array.from(new Map
        (this.raiseInsuffCompList.map(x => ({ clientReferenceNo: x.clientRefNo })).filter(f => f.clientReferenceNo !== null)
          .map(e => [e.clientReferenceNo, e])).values());
      this.searchcandidateList = Array.from(new Map
        (this.raiseInsuffCompList.map(x => ({ candidateName: x.candidateName  }))
          .map(e => [e.candidateName, e])).values());
     
      this.VerificationList = Array.from(new Map
        (this.raiseInsuffCompList.map(x => ({ verificationId: x.verificationId }))
          .map(e => [e.verificationId, e])).values());
      this.screeningIdlist = Array.from(new Map
        (this.raiseInsuffCompList.map(x => ({ clientScreeningId: x.clientScreeningId }))
          .map(e => [e.clientScreeningId, e])).values());
          if(this.screeningIdlist.length>0){            
            this.screeningIdlist = this.screeningIdlist.filter(f=>f.clientScreeningId !=null)
          }
    }
    this.initautoCompleteCtrl();
  }
  openFileSubmission(data: any) {
    if (data) {
       if (this.screeningService.verificationPage === true) {
        if (this.screeningService.insuffClear === false) {
          this.openEditInsuff(data.screeningCompId, data.compId);
        } else if (this.screeningService.insuffClear === true) {
          this.verificationService.changeMessage(data.screeningCompId);
          this.route.navigate(['dashboard/verification/verificationDetail']);
        }
        this.screeningService.verificationPage = null;
        this.screeningService.insuffClear = null;
      } else {
        if (this.screeningService.caseFlag === true) {
          this.openEditInsuff(data.screeningCompId, data.compId);
        } else {
          this.screeningService.caseFlagType = this.common.INSUFFCLEARANCE;
          const screeningCompId = data.screeningCompId;
          this.screeningService.screeningCompId = screeningCompId;
          this.route.navigate(['dashboard/screening/india']);
          this.screeningService.StatusDeFlag =true;

        }
      }
    }
  }
  openEditInsuff(screeningCompId, compId) {
    this.initInsufficiencyForm(screeningCompId);
    this.GetInsuffByScreeningCompId(screeningCompId, compId);
  }
  initInsufficiencyForm(screeningCompId: any) {
    this.insufficiencyForm = this.fb.group({
      screeningInsufficiency: new UntypedFormGroup({
        insufficiencyId: new UntypedFormControl(),
        screeningCompId: new UntypedFormControl(screeningCompId),
        screeningStatusId: new UntypedFormControl(null),
        levelLookupId: new UntypedFormControl(null),
        requiredLookupId: new UntypedFormControl(null, Validators.required),
        raisedDate: new UntypedFormControl(null),
        compId: new UntypedFormControl(),
        subCompId: new UntypedFormControl(),
        loggedIn: new UntypedFormControl(this.userData.userId),
        createdUserId: new UntypedFormControl(this.userData.userId),
        insuffDocument: new UntypedFormControl([]),
        insuffDetail: this.createInsuff(),
      })
    });
  }
  createInsuff() {
    const frmArray = new UntypedFormArray([]);
    frmArray.push(new UntypedFormGroup({
      insuffDetailId: new UntypedFormControl(0),
      insufficiencyId: new UntypedFormControl(0),
      insuffDate: new UntypedFormControl(null),
      comments: new UntypedFormControl(null),
      createdUserId: new UntypedFormControl(this.userData.userId),
      infoReqFlag: new UntypedFormControl(false),
      docReqFlag: new UntypedFormControl(true)
    }));
    return frmArray;
  }
  initInsufCommentForm(array: UntypedFormArray, data) {
    if (array.length > 0) {
      let ind = array.length;
      while (ind >= 0) {
        array.removeAt(ind);
        ind--;
      }
    }
    const frmArray = new UntypedFormArray([]);
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < data.length; i++) {
      array.push(new UntypedFormGroup({
        insuffDetailId: new UntypedFormControl(0),
        insufficiencyId: new UntypedFormControl(0),
        insuffDate: new UntypedFormControl(null),
        comments: new UntypedFormControl(null),
        createdUserId: new UntypedFormControl(this.userData.userId),
        infoReqFlag: new UntypedFormControl(false),
        docReqFlag: new UntypedFormControl(false)
      }));
    }
  }
  GetInsuffByScreeningCompId(screeningCompId, compId) {
    this.screeningService.getInsuffDocument(compId).subscribe(resp => {
      this.docList = resp;
    });
    this.insufficiencyForm.get('screeningInsufficiency.compId')?.setValue(compId);
    this.screeningService.GetInsuffByScreeningCompId(screeningCompId).subscribe(res => {
      if (res) {
        this.initInsufCommentForm(this.insufficiencyForm.get('screeningInsufficiency.insuffDetail') as UntypedFormArray,
          res.insuffDetail);
        this.insufficiencyForm.get('screeningInsufficiency')?.patchValue(res);
        this.insufficiencyForm.get('screeningInsufficiency.insuffDetail')?.patchValue(res.insuffDetail);
        if (res.insuffReqType === this.common.INFO_REQ) {
          this.insufficiencyForm.get('screeningInsufficiency.insuffDocument')?.setValue([]);
        }
        this.openDialog();
      }
    });
  }
  openDialog() {
    this.dialogRef = this.dialog.open(this.insufficiency, {
      width: '800px',
      disableClose: true
    });
  }
  SaveInsuff() {
    if (this.insufficiencyForm.valid) {
      const value = this.insuff.insuffReqType.find(x => x.lookUpId ===
        this.insufficiencyForm.get('screeningInsufficiency.requiredLookupId')?.value).lookUpName;
      if (value.toLowerCase() !== this.common.INFO_REQ.toLowerCase()) {
        if (this.insufficiencyForm.get('screeningInsufficiency.insuffDocument')?.value.length > 0) {
          this.submitRaiseInsuff();
        } else {
          this.showNotification('warn', 'Failure Message', 'Please add atleast one insufficiency document');
        }
      } else {
        this.insufficiencyForm.get('screeningInsufficiency.insuffDocument')?.setValue([]);
        this.submitRaiseInsuff();
      }
    } else {
      this.insufficiencyForm.markAllAsTouched();
    }
  }
  submitRaiseInsuff() {
    this.insufficiencyForm.get('screeningInsufficiency.createdUserId')?.setValue(this.userData.userId);
    this.screeningService.AddRaiseInsufficiency(this.insufficiencyForm.getRawValue().screeningInsufficiency).subscribe(res => {
      if (res.success) {
        this.dialogRef.close();
        this.showNotification('success', 'success Message', 'Insufficiency updated Successfully');
      } else if (!res.success) {
        this.showNotification('warn', 'Failure Message', res.message);
      }
    });
  }
  getPage(event: any) {
    this.pageNo = event;
  }
  getTotalPage(): number {
    if (this.raiseInsuffCompList.length) {
      return Math.ceil(this.raiseInsuffCompList.length / this.itemPerPage);
    }
  }
  preventInfinite() {
    if (!this.itemPerPage) {
      this.itemPerPage = 1;
    }
  }
  showall() {
    if (this.raiseInsuffCompList.length > 0) {
      this.itemPerPage = this.raiseInsuffCompList.length;
    }
  }
  showNotification(severity1, summary1, message) {
    this.messageService.add({ severity: severity1, summary: summary1, detail: message });
  }
  ngOnDestroy() {
    this.screeningService.raiseInsufficiencyScreeningDetails = [];
  }
  getPropertyValue(event: any) {
    this.PagingApply = true;
    this.getTatInsufficiencyList();
    // if (event.value !== '' && event.value !== null) {
    //   if (this.searchValueArr.length > 0) {
    //     if (this.searchValueArr.filter(x => x.propertyName === event.propertyName && x.value === event.value).length === 0) {
    //       if (this.searchValueArr.filter(x => x.propertyName === event.propertyName).length > 0) {
    //         const index = this.searchValueArr.findIndex(f => f.propertyName === event.propertyName);
    //         this.searchValueArr.splice(index, 1, { propertyName: event.propertyName, value: event.value });
    //       } else {
    //         this.searchValueArr.push({ propertyName: event.propertyName, value: event.value });
    //       }
    //     }
    //   } else {
    //     this.searchValueArr.push({ propertyName: event.propertyName, value: event.value });
    //   }
    // } else {
    //   for (const ctrl in this.insuffSearchForm.controls) {
    //     if (ctrl === event.propertyName) {
    //       const index = this.searchValueArr.findIndex(x => x.propertyName === ctrl);
    //       if (index > -1) {
    //         this.searchValueArr.splice(index, 1);
    //       }

    //     }
    //   }
    // }
  }
  showTopCenter(level: string, info: string, message: string) {
    this.messageService.add({ severity: level, summary: info, detail: message });
  }
  GetScreeningOwner() {
    this.deptId = this.userData.deptId;
    this.subTeamName = 'DESubmission';
    this.depn = this.userData.deptName;
    if (this.depn === "Data Entry Department") {
      this.screeningService.getScreeningOwner(this.deptId, this.userData.teamId, this.subTeamName).subscribe(resp => {
        if (resp) {
          this.screeningOwnerList = resp.screeningOwner;
          const ind = this.screeningOwnerList.findIndex(x => x.screeningOwnerId === this.userData.userId);
          ind > -1 ? this.screeningOwnerList.splice(ind, 1) : this.screeningOwnerList;
        }
      });
    } else if (this.depn !== "Data Entry Department") {
      this.verificationService.GetUserList(this.userData).subscribe(res => {
        if (res) {
          this.screeningOwnerList = res;
          const ind = this.screeningOwnerList.findIndex(x => x.screeningOwnerId === this.userData.userId);
          ind > -1 ? this.screeningOwnerList.splice(ind, 1) : this.screeningOwnerList;
        }
      });
    }
  }
  opendialogassign() {
    if (this.assignCase.length >= 1) {
      this.dialogRef = this.dialog.open(this.assignPopUp, {
        width: '400px',
        disableClose: true
      });
      this.GetScreeningOwner();
    } else {
      this.showTopCenter('error', 'Failure Message', 'Choose atleast one Candidate');
    }
  }
  dialogClose() {
    this.dialogRef.close();
  }
  assignScope(e, i, data) {
    this.scope = new AssignCaseVm();
    if (e === true) {
      data.assignFlag = true;
      const caselist = this.raiseInsuffCompList.filter(x => x.caseNo === data.caseNo && x.assignFlag === true);
      if (caselist) {
        this.scope.ScreeningCompId = data.screeningCompId;
        this.scope.caseNo = data.caseNo;
        this.scope.clientReferenceNo = data.clientRefNo;
        this.assignCase.push(this.scope);

      } else {
        data.assignFlag = false;
      }
    } else {
      data.assignFlag = false;
      if (this.selectall.value) {
        this.selectall.setValue(false);
      }
      const ind = this.assignCase.findIndex(x => x.caseNo === data.caseNo);
      this.assignCase.splice(ind, 1);
    }
  }
  assignallScope(e: any) {

    if (e === true) {
      // this.checkGroup.get('checkcase')?.setValue(true);
      this.raiseInsuffCompList.forEach((e) => {
        e.assignFlag = true;
      });
      this.assignCase = [];
      // tslint:disable-next-line:no-shadowed-variable
      this.AssignedDEList.forEach((element, i) => {
        this.scope = new AssignCaseVm();
        this.scope.caseNo = element.caseNo;
        this.scope.clientReferenceNo = element.clientReferenceNo;
        this.assignCase.push(this.scope);
      });
    } else {
      this.AssignedDEList.forEach((e) => {
        e.assignFlag = false;
      });
      this.assignCase = [];
      this.screeningOwnerId.clearValidators();
      this.screeningOwnerId.updateValueAndValidity();
    }
  }

  assignOwner() {
    if (this.assignCase.length > 0) {
      this.depn = this.userData.deptName;
      this.screeningOwnerId.setValidators(Validators.required);
      this.screeningOwnerId.markAsTouched();
      this.screeningOwnerId.updateValueAndValidity();
      if (this.screeningOwnerId.valid) {
        this.assignScreeningOwner.screeningOwnerId = this.screeningOwnerId.value.screeningOwnerId;
        this.assignScreeningOwner.assignCase = this.assignCase;
        this.assignScreeningOwner.deptId = this.userData.deptId;
        this.assignScreeningOwner.teamName = this.userData.teamName;
        this.assignScreeningOwner.subTeamName = 'DESubmission';
        this.assignScreeningOwner.loggedIn = this.userData.userId;
        this.assignScreeningOwner.loginName = this.userData.lastName ?
          this.userData.firstName + ' ' + this.userData.lastName : this.userData.firstName;
        this.assignScreeningOwner.screeningOwnerName = this.screeningOwnerId.value.screeningOwnerFName + this.screeningOwnerId.value.screeningOwnerLName;
        this.assiginownerList = new AssignOwner();
        const ownerList = this.raiseInsuffCompList.filter(x => x.selected === true);
        ownerList.forEach(item => {
          this.assiginownerList.assignScreeningCompId.push(item.screeningCompId);
        });
        this.assiginownerList.screeningOwnerId = this.screeningOwnerId.value.userId;
        this.assiginownerList.loginUserDetVm = this.userData;
        if (this.depn !== this.common.DATA_ENTRY_DEPARTMENT) {
          this.verificationService.addVerificationOwner(this.assiginownerList).subscribe(res => {
            if (res.success === true) {
              this.showTopCenter('success', 'Success Message', 'Saved Successfully');
              this.raiseInsuffCompList = [];
              this.dialogRef.close();
              this.screeningOwnerId.setValue('');
              this.screeningOwnerId.clearValidators();
              this.screeningOwnerId.updateValueAndValidity();
            }
          });
        } else if (this.screeningService.caseFlagType === this.common.PREQCCASE) {
          this.master.AssignDEPreQCInsuffClearScreeningOwner(this.assignScreeningOwner).subscribe(resp => {
            if (resp) {
              this.showTopCenter('success', 'Success Message', 'Saved Successfully');
              this.raiseInsuffCompList = [];
              this.dialogRef.close();
              this.status = 'Assigned'
              this.assignCase = [];
              this.assignflag = false;
              this.screeningOwnerId.setValue('');
              this.screeningOwnerId.clearValidators();
              this.screeningOwnerId.updateValueAndValidity();
              this.getClearInsufficiencyList(1);
              if (this.index === 1) {
                const cout = this.index;

              } else {
                if (this.screeningService.caseFlagType === this.common.PREQCCASE) {

                } else {
                  this.getAssignedCaseDetails('NotAssigned');
                }
              }
            }
          });
        } else {
          this.master.AssignDEInsuffClearScreeningOwner(this.assignScreeningOwner).subscribe(resp => {
            if (resp) {
              this.showTopCenter('success', 'Success Message', 'Saved Successfully');
              this.assignCase = [];
              this.assignflag = false;
              this.screeningOwnerId.setValue('');
              this.screeningOwnerId.clearValidators();
              this.screeningOwnerId.updateValueAndValidity();
              if (this.index === 1) {
                const cout = this.index;
                this.filterAssignedCase(cout);
              } else {
                this.getAssignedCaseDetails('NotAssigned');
              }
              this.dialogRef.close();
            }
          });
        }
      }
    } else {
      this.screeningOwnerId.clearValidators();
      this.screeningOwnerId.markAsTouched();
      this.screeningOwnerId.updateValueAndValidity();
    }
    this.getClearInsufficiencyList(1);
  }
  assignScrnOwner(data, index) {
    this.screeningOwnerId.setValue('');
    const ownerList = this.screeningOwnerList.filter(x => x.name === data.name);
    if (ownerList.length > 0) {
      this.screenowner.setValue(data)
    }
    const ind = this.screeningOwnerList.findIndex(x => x.screeningOwnerFName === data.screeningOwnerFName);
    if (ind > -1) {
      this.screeningOwnerId.setValue(data);
      const ele = document.getElementsByClassName('ownven-list');
      const eleScroll = document.getElementsByClassName('scrollCls');
      if (eleScroll.length > 0) {
        eleScroll[0].scrollTop = 0;
      }
      [this.screeningOwnerList[0], this.screeningOwnerList[ind]] =
        [this.screeningOwnerList[ind], this.screeningOwnerList[0]];
      const indCls = this.screeningOwnerList.findIndex(x => x.screeningOwnerFName === data.screeningOwnerFName);
      if (ele.length > 0) {
        for (let i = 0; i < this.screeningOwnerList.length; i++) {
          if (index === i) {
            ele[i].classList.add('active');
          } else {
            if (ele[i]) {
              ele[i].classList.remove('active');
            }
          }
        }
      }
      this.screeningOwnerList = Object.assign([], this.screeningOwnerList);
    } else {
      this.showTopCenter('error', 'Choose Active User', 'Owner name is In-active');
    }

  }
  getAssignedCaseDetails(caseStatus: any) {
    this.getClearInsufficiencyList(1);
    const screenid1: any[] = [];
    if (this.screeningService.caseFlag === true) {
      this.assignDE.userId = this.userData.userId;
      this.assignDE.deptId = this.userData.deptId;
      this.assignDE.teamId = this.userData.teamId;
      this.assignDE.subTeamId = this.userData.subTeamId;
      this.assignDE.teamName = this.userData.teamName;
      this.assignDE.subTeamName = this.userData.subTeamName;
      this.assignDE.caseNo = 0;
      this.assignDE.caseStatus = caseStatus;
      this.assignDE.applicationId = this.userData.applicationId;
      if (this.userData.teamLeadFlag === true || this.userData.subTeamLeadFlag === true) {
        this.ownerflag = false;
      } else {
        this.assignDE.caseStatus = 'Assigned';
        this.status = 'Assigned';
        this.assignDE.screeningOwnerId = this.userData.userId;
        this.ownerflag = true;
      }
      this.screeningService.getAssignedCaseDetails(this.assignDE)
        .subscribe(resp => {
          if (resp) {
            this.AssignedDEList = resp;
            this.raiseInsuffCompList = resp;
            this.array = resp;
            this.autocompleteData();
          }
        });
    }
  }
  filterAssignedCase(caseStatus: any) {
     if (this.userData.teamLeadFlag === true || this.userData.subTeamLeadFlag === true) {
      this.ownerflag = false;
    } else {
      this.ownerflag = true;
    }
    if (this.ownerflag === false) {
      if (caseStatus === 1) {
        this.index = caseStatus;
        this.assignflag = true;
        this.assignDE.userId = this.userData.userId;
        this.assignDE.deptId = this.userData.deptId;
        this.assignDE.caseStatus = 'Assigned';
        this.status = 'Assigned';
        this.selectall.setValue(false);
        this.assignCase = [];
        this.raiseInsuffCompList = this.AssignedDEList.filter(x => x.screeningOwnerId !== 0);
        this.autocompleteData();
        this.currentPage = 0;
      } else if (caseStatus === 0) {
        this.index = caseStatus;
        this.assignflag = false;
        this.assignDE.caseStatus = 'NotAssigned';
        this.status = 'Not Assigned';
        this.assignDE.screeningOwnerId = null;
        this.raiseInsuffCompList = this.AssignedDEList.filter(x => x.screeningOwnerId === 0);
      }
     
      this.selectall.setValue(false);
      this.assignCase = [];

    } else {
      if (caseStatus === 1) {
        this.index = caseStatus;
        this.assignflag = true;
        this.assignDE.userId = this.userData.userId;
        this.assignDE.deptId = this.userData.deptId;
        this.raiseInsuffCompList = this.AssignedDEList.filter(x => x.screeningOwnerId !== 0);
        this.assignDE.caseStatus = 'Assigned';
        this.status = 'Assigned';
      }
    }
    this.raiseInsuffCompList.forEach(ele => {
      ele.candidateFullName = ele.candidateFirstName + (ele.candidateMiddleName ? (' ' + ele.candidateMiddleName) : '') +
        (ele.candidateLastName ? (' ' + ele.candidateLastName) : '');
    });
    this.autocompleteData();
  }
  
  back() {
    this.route.navigate(['dashboard/home']);
  }
  // Request for column addition | Live environment | DE department
  DownloadExcel(){
     const insuffcColumn = [
      { field: 'sno', header: 'S No' },
        { field: 'candidateName', header: 'Candidate Name' },
        { field: 'clientRefNo', header: 'Client Reference No' },
        { field: 'verificationId', header: 'Verification ID' },
        { field: 'functionalEntity', header: 'Functional Entity' },
        { field: 'clientName', header: 'Client Name' },
        { field: 'siteName', header: 'Site Name' },
        { field: 'clientScreeningId', header: 'Screening Id' },        
        { field: 'componentName', header: 'Component Name' },
        { field: 'raisedDate', header: 'Raised Date & Time' },
        { field: 'insuffRaisedBy', header: 'Raised in Level-1 by' },
        { field: 'insuffReqType', header: 'Required Type' },
        { field: 'insuffStatus', header: 'Status' },
        { field: 'screeningStatus', header: 'Component Status' }];   
   
      this.common.exportToExcel(insuffcColumn, this.raiseInsuffCompListExport, 'Tat Crossed Insufficiencies',true);
    }
  
  exportAsExcelFile(){        
    if (this.raiseInsuffCompList.length === 0) {   
        this.userData.levelOneFlag = this.screeningService.leveloneflag?this.screeningService.leveloneflag:false;
        this.screeningService.getTatInsufficiencyList(this.userData).subscribe(resp => {
      this.raiseInsuffCompListExport = resp ;
      this.raiseInsuffCompListExport.forEach((ele,i) => {
        ele.sno = i + 1;       
      });
      this.DownloadExcel();
    });       
          
      } else {
        this.raiseInsuffCompListExport = this.raiseInsuffCompList;    
        this.raiseInsuffCompListExport.forEach((ele,i) => {
          ele.sno = i + 1;     
        });
        this.DownloadExcel();   
      }         
  }
}
