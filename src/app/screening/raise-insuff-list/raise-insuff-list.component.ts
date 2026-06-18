import { OnDestroy, Input } from '@angular/core';
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
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

export class DeleteInsuff {
  screeningCompId: any[] = [];
  loggedIn: number;
}
export class AssignOwner {
  assignScreeningCompId: any[] = [];
  screeningOwnerId: number;
  loginUserDetVm: UserData;
}

@Component({
  standalone: false,
  selector: 'app-raise-insuff-list',
  templateUrl: './raise-insuff-list.component.html',
  styleUrls: ['./raise-insuff-list.component.css']
})
export class RaiseInsuffListComponent implements OnInit, OnDestroy {

  @ViewChild('assignPopUp', { static: true }) assignPopUp!: any;
  @ViewChild('insufficiency', { static: true }) insufficiency: any;
  @ViewChild('insuff', { static: true }) insuff: RaiseInsufficiencyComponent;
  @Input() filterLength: number;

  status = 'Not Assigned';
  routePath = 'Raise Insufficiency';
  assiginownerList: AssignOwner = new AssignOwner();
  depn: string;
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
  btnExcelExport: boolean;
  btnBack: boolean;
  selectall = new UntypedFormControl();
  deleteRaiseInsuff = new DeleteInsuff();
  dialogRef: any;
  insufficiencyForm: UntypedFormGroup;
  docList: any[] = [];
  searchValueArr: any[] = [];
  itemPerPage = 10;
  page = 1;
  isDesc: boolean;
  column: any;
  direction: number;
  insuffSearchForm: UntypedFormGroup;
  componentControl!: AutoCompleteDropDown;
  caseRefNoControl!: AutoCompleteDropDown;
  clientControl!: AutoCompleteDropDown;
  statusControl!: AutoCompleteDropDown;
  clientNameControl!: AutoCompleteDropDown;
  delayHoursControl!: AutoCompleteDropDown;
  candidateControl!: AutoCompleteDropDown;
  clientRefControl!: AutoCompleteDropDown;
  empInsControl!: AutoCompleteDropDown;
  sreeningIdControl!: AutoCompleteDropDown;
  clientList: any;
  vendorList: any;
  componentList: any;
  statusList: any;
  screeningIdList: any;
  userList: any;
  clientRefNoList: any[] = [];
  searchcandidateList: any[] = [];
  shieveTotalCount = 0;
  shievePageNo = 1;
  shievePageSize = 10;
  PagingApply = true;
  caseStatusFlag: boolean;

  constructor(
    public master: MasterService,
    public screeningService: ScreeningService,
    public common: CommonService,
    public dialog: MatDialog,
    private fb: UntypedFormBuilder,
    private verificationService: VerificationService,
    private route: Router,
    private messageService: MessageService,
    // FIX: inject ChangeDetectorRef to manually trigger CD after deferred state changes
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.initFormGroup();
    this.userData.page = this.shievePageNo;

    if (this.screeningService.caseFlagType === this.common.INSUFFCLEARANCE) {
      this.headerName = 'Insufficiency Clearance';
      this.routePath = 'Insufficiency Cleared';
      if (this.userData.teamLeadFlag === true || this.userData.subTeamLeadFlag === true) {
        this.getClearInsufficiencyList(0);
        this.ownerflag = false;
        this.caseStatusFlag = false;
      } else {
        this.getClearInsufficiencyList(1);
        this.ownerflag = true;
      }
      this.btnExcelExport = true;
      this.btnBack = true;
    } else {
      if (this.screeningService.raiseInsufficiencyScreeningDetails.length === 0) {
        this.getRaiseInsufficiencyScreeningList();
        this.headerName = 'Raise Insufficiency';
        this.routePath = 'Insufficiency Raised';
        this.btnDelete = true;
        this.btnExcelExport = true;
        this.btnBack = true;
      } else {
        this.raiseInsuffCompList = this.screeningService.raiseInsufficiencyScreeningDetails;
      }
    }
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
      screeningId: new UntypedFormControl(null)
    });
    this.initautoCompleteCtrl();
  }

  initautoCompleteCtrl() {
    if (this.screeningService.caseFlagType === this.common.INSUFFCLEARANCE) {
      this.componentControl = new AutoCompleteDropDown('Component Name', 'compName', 'id', 'name',
        this.componentList, '', this.insuffSearchForm, false, false, false, 'standard');
      this.clientControl = new AutoCompleteDropDown('Client Name', 'clientName', 'id', 'name',
        this.clientList, '', this.insuffSearchForm, false, false, false, 'standard');
    } else {
      this.componentControl = new AutoCompleteDropDown('Component Name', 'compName', 'compName', 'compName',
        this.componentList, '', this.insuffSearchForm, false, false, false, 'standard');
      this.clientControl = new AutoCompleteDropDown('Client Name', 'clientName', 'clientName', 'clientName',
        this.clientList, '', this.insuffSearchForm, false, false, false, 'standard');
      this.statusControl = new AutoCompleteDropDown('Status Name', 'statusName', 'caseStatus', 'caseStatus',
        this.statusList, '', this.insuffSearchForm, false, false, false, 'standard');
      this.sreeningIdControl = new AutoCompleteDropDown('Screening Id', 'screeningId', 'clientScreeningId',
        'clientScreeningId', this.screeningIdList, '', this.insuffSearchForm, false, false, false, 'standard');
      this.caseRefNoControl = new AutoCompleteDropDown('Case Ref No.', 'clientRefNo', 'clientReferenceNo',
        'clientReferenceNo', this.clientRefNoList, '', this.insuffSearchForm, false, false, false, 'standard');
      this.candidateControl = new AutoCompleteDropDown('Candidate Name', 'candidateName', 'candidateFullName',
        'candidateFullName', this.searchcandidateList, '', this.insuffSearchForm, false, false, false, 'standard');
    }
  }

  // FIX 1: removed side effect (this.filterLength = c) from template binding method.
  // Setting @Input inside a [class] binding mutates state during rendering → NG0100.
  // filterLength is now updated separately via updateFilterLength().
  getFilterLen(c): string {
    return 'listrow';
  }

  // FIX 1 (cont): Call this after list data is set, not inside the template expression.
  private updateFilterLength(count: number) {
    Promise.resolve().then(() => {
      this.filterLength = count;
      this.cdr.markForCheck();
    });
  }

  resetFilterSort(type: any) {
    this.insuffSearchForm.reset();
    this.searchValueArr = [];
    this.column = '';
    if (this.screeningService.caseFlagType === this.common.INSUFFCLEARANCE) {
      this.getClearInsufficiencyList(this.index);
    }
  }

  sortBy(type: any) {
    this.isDesc = !this.isDesc;
    this.column = type;
    this.direction = this.isDesc ? 1 : -1;
    if (this.screeningService.caseFlagType === this.common.INSUFFCLEARANCE) {
      this.getClearInsufficiencyList(this.index);
    }
  }

  getDisable() {
    return this.raiseInsuffCompList.some(
      x => x.insuffStatus?.toLowerCase() === this.common.RAISED?.toLowerCase()
    );
  }

  selectAll(e: any) {
    this.raiseInsuffCompList.forEach(x => {
      x.selected = e.checked
        ? x.insuffStatus?.toLowerCase() === this.common.RAISED?.toLowerCase()
        : false;
    });
  }

  // FIX 5/6: removed unused `i` param — template only passes 2 args
  checkChanged(e: any, data: any) {
    data.selected = e.checked ? true : false;
    this.selectall.setValue(false);
    if (this.raiseInsuffCompList.filter(x => x.selected === false).length === 0) {
      this.selectall.setValue(true);
    }
  }

  deleteInsuff() {
    const deletedList = this.raiseInsuffCompList.filter(x => x.selected === true);
    deletedList.forEach(element => { delete element.selected; });
    const data = deletedList.map(x => x.screeningCompId);
    this.deleteRaiseInsuff.screeningCompId = [...data];
    if (this.deleteRaiseInsuff.screeningCompId.length > 0) {
      this.openDeleteInsuffDialog();
    } else {
      this.showNotification('warn', 'Failure Message', 'Please select atleast one case');
    }
  }

  openDeleteInsuffDialog() {
    const popupData = {
      action: this.common.DELETECONFIRMATION,
      headerText: 'Confirmation',
      bodyText: 'Are you sure you want to delete this record?'
    };
    const dialogRef = this.dialog.open(CommonAlertsComponent, {
      width: '320px',
      data: popupData,
      disableClose: true
    });
    if (dialogRef) {
      dialogRef.afterClosed().subscribe(result => {
        if (result && String(result.type) === this.common.DELETECONFIRMATION) {
          this.deleteInsuffList();
        }
      });
    }
  }

  deleteInsuffList() {
    this.deleteRaiseInsuff.loggedIn = this.userData.userId;
    this.screeningService.deleteInsuffList(this.deleteRaiseInsuff).subscribe(resp => {
      if (resp) {
        this.showNotification('success', 'Success', 'Deleted Successfully');
        this.getRaiseInsufficiencyScreeningList();
      }
    });
  }

  getRaiseInsufficiencyScreeningList() {
    this.userData.levelOneFlag = this.screeningService.leveloneflag
      ? this.screeningService.leveloneflag : false;
    this.screeningService.getRaiseInsufficiencyScreeningList(this.userData).subscribe(resp => {
      this.raiseInsuffCompList = resp ?? [];
      this.raiseInsuffCompList.forEach(ele => {
        ele.selected = false;
        ele.candidateFullName = ele.candidateFirstName
          + (ele.candidateMiddleName ? (' ' + ele.candidateMiddleName) : '')
          + (ele.candidateLastName ? (' ' + ele.candidateLastName) : '');
      });
      // FIX 1: update filterLength outside of template binding
      this.updateFilterLength(this.raiseInsuffCompList.length);
      this.autocompleteData();
    });
  }

  getClearInsufficiencyList(cat: number) {
    this.userData.levelOneFlag = this.screeningService.leveloneflag
      ? this.screeningService.leveloneflag : false;
    this.applyPagination();
    this.screeningService.getClearInsufficiencyList(this.userData).subscribe(res => {
      if (res) {
        this.shieveTotalCount = res.headers.get('X-Total-Count');
        const resp = res.body;
        this.raiseInsuffCompList = resp
          ? (this.screeningService.verificationPage === true
            ? resp.filter((x: any) => x.workFlow === 'VE')
            : resp.filter((x: any) => x.workFlow !== 'VE'))
          : [];
        this.AssignedDEList = resp ?? [];
        this.raiseInsuffCompList.forEach(ele => {
          ele.candidateFullName = ele.candidateFirstName
            + (ele.candidateMiddleName ? (' ' + ele.candidateMiddleName) : '')
            + (ele.candidateLastName ? (' ' + ele.candidateLastName) : '');
        });
        // FIX 1: update filterLength after data is set, not inside template
        this.updateFilterLength(this.raiseInsuffCompList.length);
        this.filterAssignedCase(cat);
      }
    });
  }

  shieveFilter(ctrl: any) {
    if (this.insuffSearchForm.get(ctrl)?.valid) {
      this.getClearInsufficiencyList(this.index);
    }
  }

  removeValue(value: any) {
    if (value === '') {
      this.getClearInsufficiencyList(this.index);
    }
  }

  search() {
    const v = this.insuffSearchForm.value;
    if (v.clientName || v.clientRefNo || v.compName || v.candidateName || v.screeningId) {
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
    // FIX 3: was using else-if — only one filter was ever applied.
    // Now uses separate if blocks so multiple filters can combine.
    let filter = '';
    const v = this.insuffSearchForm.value;

    if (v.clientName && this.insuffSearchForm.get('clientName')?.valid) {
      filter += (filter ? ',' : '') + 'clientId==' + v.clientName;
    }
    if (v.clientRefNo) {
      filter += (filter ? ',' : '') + 'clientRefNo@=*' + v.clientRefNo;
    }
    if (v.compName && this.insuffSearchForm.get('compName')?.valid) {
      filter += (filter ? ',' : '') + 'compId==' + v.compName;
    }
    if (v.candidateName) {
      filter += (filter ? ',' : '') + 'candidateName@=*' + v.candidateName;
    }
    if (v.screeningId) {
      filter += (filter ? ',' : '') + 'clientScreeningId@=*' + v.screeningId;
    }

    this.userData.pageSize = this.shievePageSize;
    this.userData.page = this.shievePageNo;
    this.userData.filters = filter;
    this.userData.sorts = '';
    this.userData.applyPaging = this.PagingApply;
    this.userData.needTotal = true;
  }

  autocompleteData() {
    if (this.screeningService.caseFlagType === this.common.INSUFFCLEARANCE) {
      this.screeningService.getClients(this.userData).subscribe(res => {
        if (res) { this.clientList = res; }
      });
      this.screeningService.getComponents(this.userData).subscribe(res => {
        if (res) { this.componentList = res; }
      });
    } else {
      this.clientList = Array.from(new Map(
        this.raiseInsuffCompList.map(x => ({ clientName: x.clientName }))
          .map(e => [e.clientName, e])).values());
      this.clientRefNoList = Array.from(new Map(
        this.raiseInsuffCompList.map(x => ({ clientReferenceNo: x.clientRefNo }))
          .filter(f => f.clientReferenceNo !== null)
          .map(e => [e.clientReferenceNo, e])).values());
      this.searchcandidateList = Array.from(new Map(
        this.raiseInsuffCompList.map(x => ({ candidateFullName: x.candidateFullName }))
          .map(e => [e.candidateFullName, e])).values());
      this.componentList = Array.from(new Map(
        this.raiseInsuffCompList.map(x => ({ compName: x.componentName }))
          .map(e => [e.compName, e])).values());
      this.statusList = Array.from(new Map(
        this.raiseInsuffCompList.map(x => ({ caseStatus: x.caseStatus }))
          .map(e => [e.caseStatus, e])).values());
      this.screeningIdList = Array.from(new Map(
        this.raiseInsuffCompList.map(x => ({ clientScreeningId: x.clientScreeningId }))
          .map(e => [e.clientScreeningId, e])).values())
        .filter((w: any) => w.clientScreeningId != null);
    }
    this.initautoCompleteCtrl();
  }

  openFileSubmission(data: any) {
    if (!data) return;
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
        this.screeningService.screeningCompId = data.screeningCompId;
        this.route.navigate(['dashboard/screening/india']);
        this.screeningService.StatusDeFlag = true;
      }
    }
  }

  openEditInsuff(screeningCompId: any, compId: any) {
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

  initInsufCommentForm(array: UntypedFormArray, data: any[]) {
    let ind = array.length;
    while (ind >= 0) {
      array.removeAt(ind);
      ind--;
    }
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

  GetInsuffByScreeningCompId(screeningCompId: any, compId: any) {
    this.screeningService.getInsuffDocument(compId).subscribe(resp => {
      this.docList = resp;
    });
    this.insufficiencyForm.get('screeningInsufficiency.compId')?.setValue(compId);
    this.screeningService.GetInsuffByScreeningCompId(screeningCompId).subscribe(res => {
      if (res) {
        this.initInsufCommentForm(
          this.insufficiencyForm.get('screeningInsufficiency.insuffDetail') as UntypedFormArray,
          res.insuffDetail
        );
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
      const value = this.insuff?.insuffReqType?.find(
        x => x.lookUpId === this.insufficiencyForm.get('screeningInsufficiency.requiredLookupId')?.value
      )?.lookUpName;
      if (value?.toLowerCase() !== this.common.INFO_REQ?.toLowerCase()) {
        if (this.insufficiencyForm.get('screeningInsufficiency.insuffDocument')?.value?.length > 0) {
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
    this.screeningService.AddRaiseInsufficiency(
      this.insufficiencyForm.getRawValue().screeningInsufficiency
    ).subscribe(res => {
      if (res.success) {
        this.dialogRef.close();
        this.showNotification('success', 'success Message', 'Insufficiency updated Successfully');
      } else {
        this.showNotification('warn', 'Failure Message', res.message);
      }
    });
  }

  getPage(event: any) { this.page = event; }

  getTotalPage(): number {
    if (this.raiseInsuffCompList.length) {
      return Math.ceil(this.raiseInsuffCompList.length / this.itemPerPage);
    }
    return 0;
  }

  preventInfinite() {
    if (!this.itemPerPage) { this.itemPerPage = 1; }
  }

  showall() {
    if (this.raiseInsuffCompList.length > 0) {
      this.itemPerPage = this.raiseInsuffCompList.length;
    }
  }

  showNotification(severity1: string, summary1: string, message: string) {
    this.messageService.add({ severity: severity1, summary: summary1, detail: message });
  }

  ngOnDestroy() {
    this.screeningService.raiseInsufficiencyScreeningDetails = [];
  }

  getPropertyValue(event: any) {
    if (event.value !== '' && event.value !== null) {
      if (this.searchValueArr.length > 0) {
        if (this.searchValueArr.filter(
          x => x.propertyName === event.propertyName && x.value === event.value).length === 0) {
          if (this.searchValueArr.filter(x => x.propertyName === event.propertyName).length > 0) {
            const index = this.searchValueArr.findIndex(f => f.propertyName === event.propertyName);
            this.searchValueArr.splice(index, 1, { propertyName: event.propertyName, value: event.value });
          } else {
            this.searchValueArr.push({ propertyName: event.propertyName, value: event.value });
          }
        }
      } else {
        this.searchValueArr.push({ propertyName: event.propertyName, value: event.value });
      }
    } else {
      for (const ctrl in this.insuffSearchForm.controls) {
        if (ctrl === event.propertyName) {
          const index = this.searchValueArr.findIndex(x => x.propertyName === ctrl);
          if (index > -1) { this.searchValueArr.splice(index, 1); }
        }
      }
    }
  }

  showTopCenter(level: string, info: string, message: string) {
    this.messageService.add({ severity: level, summary: info, detail: message });
  }

  GetScreeningOwner() {
    this.deptId = this.userData.deptId;
    this.subTeamName = 'DESubmission';
    this.depn = this.userData.deptName;
    if (this.depn === 'Data Entry Department') {
      this.screeningService.getScreeningOwner(this.deptId, this.userData.teamId, this.subTeamName)
        .subscribe(resp => {
          if (resp) {
            this.screeningOwnerList = resp.screeningOwner;
            const ind = this.screeningOwnerList.findIndex(x => x.screeningOwnerId === this.userData.userId);
            if (ind > -1) { this.screeningOwnerList.splice(ind, 1); }
          }
        });
    } else {
      this.verificationService.GetUserList(this.userData).subscribe(res => {
        if (res) {
          this.screeningOwnerList = res;
          const ind = this.screeningOwnerList.findIndex(x => x.screeningOwnerId === this.userData.userId);
          if (ind > -1) { this.screeningOwnerList.splice(ind, 1); }
        }
      });
    }
  }

  opendialogassign() {
    if (this.assignCase.length >= 1) {
      this.dialogRef = this.dialog.open(this.assignPopUp, { width: '400px', disableClose: true });
      this.GetScreeningOwner();
    } else {
      this.showTopCenter('error', 'Failure Message', 'Choose atleast one Candidate');
    }
  }

  dialogClose() { this.dialogRef.close(); }

  assignScope(e: boolean, i: number, data: any) {
    this.scope = new AssignCaseVm();
    if (e === true) {
      data.assignFlag = true;
      const caselist = this.raiseInsuffCompList.filter(
        x => x.caseNo === data.caseNo && x.assignFlag === true);
      if (caselist.length > 0) {
        this.scope.ScreeningCompId = data.screeningCompId;
        this.scope.caseNo = data.caseNo;
        this.scope.clientReferenceNo = data.clientRefNo;
        this.assignCase.push(this.scope);
      } else {
        data.assignFlag = false;
      }
    } else {
      data.assignFlag = false;
      if (this.selectall.value) { this.selectall.setValue(false); }
      const ind = this.assignCase.findIndex(x => x.caseNo === data.caseNo);
      if (ind > -1) { this.assignCase.splice(ind, 1); }
    }
  }

  assignallScope(e: boolean) {
    if (e === true) {
      this.raiseInsuffCompList.forEach(item => { item.assignFlag = true; });
      this.assignCase = [];
      this.AssignedDEList.forEach((element) => {
        this.scope = new AssignCaseVm();
        this.scope.caseNo = element.caseNo;
        this.scope.clientReferenceNo = element.clientReferenceNo;
        this.assignCase.push(this.scope);
      });
    } else {
      this.AssignedDEList.forEach(item => { item.assignFlag = false; });
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
        this.assignScreeningOwner.loginName = this.userData.lastName
          ? this.userData.firstName + ' ' + this.userData.lastName
          : this.userData.firstName;
        this.assignScreeningOwner.screeningOwnerName =
          this.screeningOwnerId.value.screeningOwnerFName + this.screeningOwnerId.value.screeningOwnerLName;

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
              this.status = 'Assigned';
              this.assignCase = [];
              this.assignflag = false;
              this.screeningOwnerId.setValue('');
              this.screeningOwnerId.clearValidators();
              this.screeningOwnerId.updateValueAndValidity();
              this.getClearInsufficiencyList(1);
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
              this.dialogRef.close();
              if (this.index === 1) {
                this.filterAssignedCase(this.index);
              } else {
                this.getAssignedCaseDetails('NotAssigned');
              }
            }
          });
        }
      }
    } else {
      this.screeningOwnerId.clearValidators();
      this.screeningOwnerId.markAsTouched();
      this.screeningOwnerId.updateValueAndValidity();
    }
    // FIX 4: removed unconditional getClearInsufficiencyList(1) call here.
    // It was firing on every assignOwner() call regardless of outcome,
    // triggering state changes mid-CD → NG0100.
    // Each branch above now calls it explicitly only when needed.
  }

  assignScrnOwner(data: any, index: number) {
    this.screeningOwnerId.setValue('');

    // FIX 7: unified lookup — check both name (non-DE) and screeningOwnerFName (DE dept)
    // so screenowner.setValue works correctly for both department types
    const matchByName = this.screeningOwnerList.find(x => x.name === data.name);
    const matchByFName = this.screeningOwnerList.find(
      x => x.screeningOwnerFName === data.screeningOwnerFName);

    if (matchByName || matchByFName) {
      this.screenowner.setValue(data);
    }

    const ind = this.screeningOwnerList.findIndex(
      x => x.screeningOwnerFName === data.screeningOwnerFName);

    if (ind > -1) {
      this.screeningOwnerId.setValue(data);
      const ele = document.getElementsByClassName('ownven-list');
      const eleScroll = document.getElementsByClassName('scrollCls');
      if (eleScroll.length > 0) { eleScroll[0].scrollTop = 0; }
      [this.screeningOwnerList[0], this.screeningOwnerList[ind]] =
        [this.screeningOwnerList[ind], this.screeningOwnerList[0]];
      if (ele.length > 0) {
        for (let i = 0; i < this.screeningOwnerList.length; i++) {
          if (index === i) {
            ele[i].classList.add('active');
          } else if (ele[i]) {
            ele[i].classList.remove('active');
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
      this.screeningService.getAssignedCaseDetails(this.assignDE).subscribe(resp => {
        if (resp) {
          this.AssignedDEList = resp;
          this.raiseInsuffCompList = resp;
          this.array = resp;
          this.autocompleteData();
        }
      });
    }
  }

  // FIX 2: filterAssignedCase used to be called directly from (selectedTabChange)
  // which fires during Angular's CD cycle → NG0100.
  // Now wrapped in setTimeout to defer state changes to next tick.
  onTabChange(index: number) {
    setTimeout(() => {
      this.filterAssignedCase(index);
      this.cdr.detectChanges();
    }, 0);
  }

  filterAssignedCase(caseStatus: any) {
    this.ownerflag = !(this.userData.teamLeadFlag === true || this.userData.subTeamLeadFlag === true);

    if (!this.ownerflag) {
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
      ele.candidateFullName = ele.candidateFirstName
        + (ele.candidateMiddleName ? (' ' + ele.candidateMiddleName) : '')
        + (ele.candidateLastName ? (' ' + ele.candidateLastName) : '');
    });
    this.autocompleteData();
  }

  back() { this.route.navigate(['dashboard/home']); }

  DownloadExcel() {
    const insuffrColumn = [
      { field: 'sno', header: 'S No' },
      { field: 'candidateFullName', header: 'Candidate Name' },
      { field: 'screeningCompId', header: 'Verification Id' },
      { field: 'clientRefNo', header: 'Client Reference No' },
      { field: 'clientScreeningId', header: 'Screening Id' },
      { field: 'clientName', header: 'Client Name' },
      { field: 'siteName', header: 'Site Name' },
      { field: 'componentName', header: 'Component Name' },
      { field: 'functionalEntity', header: 'Functional Entity' },
      { field: 'raisedBy', header: 'Insuff Raised By' },
      { field: 'raisedDate', header: 'Raised Date & Time' },
      { field: 'screeningStatus', header: 'Screening Status' },
      { field: 'workFlow', header: 'Work Flow' }
    ];
    const insuffcColumn = [
      { field: 'sno', header: 'S No' },
      { field: 'clientRefNo', header: 'Client Reference No' },
      { field: 'clientScreeningId', header: 'Screening Id' },
      { field: 'screeningCompId', header: 'Verification Id' },
      { field: 'candidateFullName', header: 'Candidate Name' },
      { field: 'clientName', header: 'Client Name' },
      { field: 'siteName', header: 'Site Name' },
      { field: 'componentName', header: 'Component Name' },
      { field: 'functionalEntity', header: 'Functional Entity' },
      { field: 'screeningOwner', header: 'Screen Owner Name' },
      { field: 'clearedBy', header: 'Insuff Cleared By' },
      { field: 'clearedDate', header: 'Cleared Date & Time' },
      { field: 'screeningStatus', header: 'Screening Status' },
      { field: 'workFlow', header: 'Work Flow' }
    ];
    if (this.screeningService.caseFlagType === this.common.INSUFFCLEARANCE) {
      this.common.exportToExcel(insuffcColumn, this.raiseInsuffCompListExport, 'Insufficiency Clearance List', true);
    } else {
      this.common.exportToExcel(insuffrColumn, this.raiseInsuffCompListExport, 'Raise Insufficiency List', true);
    }
  }

  exportAsExcelFile() {
    this.PagingApply = false;
    if (this.screeningService.caseFlagType === this.common.INSUFFCLEARANCE) {
      this.ownerflag = !(this.userData.teamLeadFlag === true || this.userData.subTeamLeadFlag === true);
      this.userData.levelOneFlag = this.screeningService.leveloneflag ?? false;
      this.applyPagination();
      this.screeningService.getClearInsufficiencyList(this.userData).subscribe(res => {
        if (res) {
          this.shieveTotalCount = res.headers.get('X-Total-Count');
          const resp = res.body;
          this.raiseInsuffCompListExport = resp
            ? (this.screeningService.verificationPage === true
              ? resp.filter((x: any) => x.workFlow === 'VE')
              : resp.filter((x: any) => x.workFlow !== 'VE'))
            : [];
          this.AssignedDEListExport = resp ?? [];

          const buildName = (ele: any) => {
            ele.candidateFullName = ele.candidateFirstName
              + (ele.candidateMiddleName ? (' ' + ele.candidateMiddleName) : '')
              + (ele.candidateLastName ? (' ' + ele.candidateLastName) : '');
            ele.screeningOwner = ele.screeningOwnerFName
              + (ele.screeningOwnerMName ? (' ' + ele.screeningOwnerMName) : '')
              + (ele.screeningOwnerLName ? (' ' + ele.screeningOwnerLName) : '');
          };

          this.raiseInsuffCompListExport.forEach(buildName);

          if (!this.ownerflag) {
            this.raiseInsuffCompListExport = this.assignflag
              ? this.AssignedDEListExport.filter((x: any) => x.screeningOwnerId !== 0)
              : this.AssignedDEListExport.filter((x: any) => x.screeningOwnerId === 0);
            this.raiseInsuffCompListExport.forEach(buildName);
          } else {
            this.raiseInsuffCompList = this.AssignedDEList.filter(x => x.screeningOwnerId !== 0);
            this.raiseInsuffCompListExport.forEach(buildName);
          }

          this.raiseInsuffCompListExport.forEach((ele, i) => {
            ele.sno = i + 1;
            ele.screeningCompId = 'ACG' + ele.screeningCompId;
          });
          this.DownloadExcel();
        }
      });
    } else {
      this.userData.levelOneFlag = this.screeningService.leveloneflag ?? false;
      this.screeningService.getRaiseInsufficiencyScreeningList(this.userData).subscribe(resp => {
        this.raiseInsuffCompListExport = resp ?? [];
        this.raiseInsuffCompListExport.forEach(ele => {
          ele.selected = false;
          ele.candidateFullName = ele.candidateFirstName
            + (ele.candidateMiddleName ? (' ' + ele.candidateMiddleName) : '')
            + (ele.candidateLastName ? (' ' + ele.candidateLastName) : '');
          ele.screeningOwner = ele.screeningOwnerFName
            + (ele.screeningOwnerMName ? (' ' + ele.screeningOwnerMName) : '')
            + (ele.screeningOwnerLName ? (' ' + ele.screeningOwnerLName) : '');
        });
        this.raiseInsuffCompListExport.forEach((ele, i) => {
          ele.sno = i + 1;
          ele.screeningCompId = 'ACG' + ele.screeningCompId;
        });
        this.DownloadExcel();
      });
    }
  }
}