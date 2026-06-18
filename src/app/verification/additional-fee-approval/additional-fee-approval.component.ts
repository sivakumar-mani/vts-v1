import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ScreenAuth } from 'src/app/common-methods/models/screen-auth';
import { UntypedFormGroup, Validators, UntypedFormBuilder, UntypedFormControl } from '@angular/forms';
// import { DataTable, MessageService, DataTableModule } from 'primeng/primeng';
// import { VerificationService } from 'src/app/common-methods/services/verification.service';
// import { MatDialog, MatMenuTrigger } from '@angular/material';
// import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';

import { VerificationService } from 'src/app/common-methods/services/verification.service';

import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ClientApprovalFeeVm } from 'src/app/common-methods/models/verification';
import { TableHeaderCheckbox, Table } from 'primeng/table';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { AnyMxRecord } from 'dns';

@Component({
  standalone: false,
  selector: 'app-additional-fee-approval',
  templateUrl: './additional-fee-approval.component.html',
  styleUrls: ['./additional-fee-approval.component.css']
})
export class AdditionalFeeApprovalComponent implements OnInit {
  itemperpage:any;
  screenAuth = new ScreenAuth();
  userData: any;
  routePath = 'Verification / Additional Fee Approval';
  btnBack = false;
  btnReject = false;
  btnApprove = false;
  btnHold = false;
  btnRejectDisabled = true;
  btnHoldDisabled = true;
  btnApproveDisabled = true;
  btnResetTbl = false;
  clientAddFeeApproveForm: UntypedFormGroup;
  cols = [
    { field: 'firstName', header: 'Candidate Name' },
    { field: 'clientRefNo', header: 'Client Reference Number' },
    { field: 'componentName', header: 'Component Name' },
    { field: 'fees', header: 'Fees' },
    { field: 'comments', header: 'Comments' },
    { field: 'requestDate', header: 'Requested Date & Time' },
    { field: 'feesStatus', header: 'Status' }
  ];
  currentPage = 1;
  tempCurrentPage = 1;
  totalpages: number;
  
  feeApprovalData: ClientApprovalFeeVm[] = [];
  selectedData: ClientApprovalFeeVm[] = [];
  isGridPage = true;
  page = new UntypedFormControl();
  dialogRef: any;
  feeStatus = [];
  saveList = [];
  type: any;
  firstNameFormCtrl = new UntypedFormControl();
  // firstNameFilteredOptions: Observable<string[]>;
  // @ViewChild('dt', null) dt: DataTable;
  // @ViewChild('global', null) global: ElementRef<any>;
  // @ViewChild('confirmation', null) confirmation;
  // @ViewChild('firstNameTrigger', null) firstNameTrigger: MatMenuTrigger;
  // clientRefNoFormCtrl = new UntypedFormControl();
  // clientRefNoFilteredOptions: Observable<string[]>;
  // @ViewChild('clientRefNoTrigger', null) clientRefNoTrigger: MatMenuTrigger;
  // componentNameFormCtrl = new UntypedFormControl();
  // componentNameFilteredOptions: Observable<string[]>;
  // @ViewChild('componentNameTrigger', null) componentNameTrigger: MatMenuTrigger;
  // feesFormCtrl = new UntypedFormControl();
  // feesFilteredOptions: Observable<string[]>;
  // @ViewChild('feesTrigger', null) feesTrigger: MatMenuTrigger;
  // commentsFormCtrl = new UntypedFormControl();
  // commentsFilteredOptions: Observable<string[]>;
  // @ViewChild('commentsTrigger', null) commentsTrigger: MatMenuTrigger;
  // feesStatusFormCtrl = new UntypedFormControl();
  // feesStatusFilteredOptions: Observable<string[]>;
  // @ViewChild('feesStatusTrigger', null) feesStatusTrigger: MatMenuTrigger;
  // @ViewChild('headerCheckBox', null)
  // private headerCheckBox: TableHeaderCheckbox;
  // @ViewChild('dt', null)
  // private table: Table;
  firstNameFilteredOptions!: Observable<string[]>;

@ViewChild('dt') dt!: Table;

@ViewChild('global') global!: ElementRef<any>;

@ViewChild('confirmation') confirmation: any;

@ViewChild('firstNameTrigger')
firstNameTrigger!: MatMenuTrigger;

clientRefNoFormCtrl = new UntypedFormControl();

clientRefNoFilteredOptions!: Observable<string[]>;

@ViewChild('clientRefNoTrigger')
clientRefNoTrigger!: MatMenuTrigger;

componentNameFormCtrl = new UntypedFormControl();

componentNameFilteredOptions!: Observable<string[]>;

@ViewChild('componentNameTrigger')
componentNameTrigger!: MatMenuTrigger;

feesFormCtrl = new UntypedFormControl();

feesFilteredOptions!: Observable<string[]>;

@ViewChild('feesTrigger')
feesTrigger!: MatMenuTrigger;

commentsFormCtrl = new UntypedFormControl();

commentsFilteredOptions!: Observable<string[]>;

@ViewChild('commentsTrigger')
commentsTrigger!: MatMenuTrigger;

feesStatusFormCtrl = new UntypedFormControl();

feesStatusFilteredOptions!: Observable<string[]>;

@ViewChild('feesStatusTrigger')
feesStatusTrigger!: MatMenuTrigger;

@ViewChild('headerCheckBox')
private headerCheckBox!: TableHeaderCheckbox;

@ViewChild('dt')
private table!: Table;

  constructor(private verificationService: VerificationService, private fb: UntypedFormBuilder,
     public dialog: MatDialog,public authService :AuthService, public common:CommonService,
    // tslint:disable-next-line:align
    private message: MessageService) { }

  filterGlobal(value) {
    this.dt['filterGlobal'](value, 'contains');
  }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data'));
    this.screenAuth = this.authService.getScreenAuth(this.common.VERIFICATION_ROUTER);
    this.initFormGroup();
    this.getClientFeeApproval();
    this.itemperpage=10;
  }
  initFormGroup() {
    this.clientAddFeeApproveForm = this.fb.group({
      logginId: [this.userData.userId],
      comments: ['', Validators.required],
      checkFlag: [false],
    });
  }
  getClientFeeApproval() {
    this.verificationService.GetClientFeeApproval(this.userData.clientId).subscribe(resp => {
      this.feeApprovalData = resp.clientFeeApproval;
      this.feeApprovalData.forEach(element => {
        element.firstName = element.firstName + ' ' + element.middleName + ' ' + element.lastName;
      });
      this.feeStatus = resp.feeStatus;
    });
  }
  submitForm(type) {
    this.dialogRef = this.dialog.open(this.confirmation, {
      width: '510px',
      disableClose: true
    });
    this.type = type;
  }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }
  close() {
    this.dialogRef.close();
  }
  tblReset() {
    this.dt.reset();
    this.global.nativeElement.value = '';
    this.TblAutoFilters();
  }
  submit(type) {
    this.type = type;
    if (this.clientAddFeeApproveForm.get('comments').valid) {
      this.dialogRef.close();
      if (this.clientAddFeeApproveForm.get('comments').value) {
        const val = this.feeStatus.find(x => x.lookUpName === type);
        if (val && val.lookUpId) {
          this.selectedData.forEach(ele => {
            const list = this.feeApprovalData.find(x => x.screeningCompFeeId === ele.screeningCompFeeId);
            list.comments = this.clientAddFeeApproveForm.get('comments').value;
            list.feeStatusId = val.lookUpId;
            list.requestDate = new Date();
            list.createdUserId = this.userData.userId;
            this.saveList.push(list);
          });
        }
        this.verificationService.AddClientFeeApproval(this.saveList).subscribe(res => {
          if (res.success) {
            this.showTopCenter('success', 'Success Message', (type === 'Approved' ? 'Approv' : type) + 'ed' + ' ' + 'Successfully');
            this.clientAddFeeApproveForm.reset();
            this.saveList = [];
            this.selectedData = [];
            this.getClientFeeApproval();
          }
        });
      }
    }
  }
  editAddFeeApprove(data) { }
  backToTable() { }
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
  getTotalPages(totalRecords, rows) {
    this.totalpages = Math.ceil((totalRecords) / rows);
    return Math.ceil((totalRecords) / rows);
  }
  private TblAutoFilters(): void {

    this.firstNameFilteredOptions = this.firstNameFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.feeApprovalData.map(x => x.firstName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.clientRefNoFilteredOptions = this.clientRefNoFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.feeApprovalData.map(x => x.clientRefNo).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.componentNameFilteredOptions = this.componentNameFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.feeApprovalData.map(x => x.componentName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    // this.feesFilteredOptions = this.feesFormCtrl.valueChanges.pipe(startWith(''),
    //   map(value =>
    //     (Array.from(new Set(this.feeApprovalData.map(x => x.fees).filter(x => x))).sort())
    //       .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.commentsFilteredOptions = this.commentsFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.feeApprovalData.map(x => x.comments).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.feesStatusFilteredOptions = this.feesStatusFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.feeApprovalData.map(x => x.feesStatus[0]).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

  }
  isRowDisabled(data: any): boolean {
    return data.feesStatus.length > 0;
  }
  onSelectionChange(selection: any[]) {
    for (let i = selection.length - 1; i >= 0; i--) {
      const data = selection[i];
      if (this.isRowDisabled(data)) {
        selection.splice(i, 1);
      }
    }
    this.selectedData = selection;
  }
  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit(): void {
    // const origupdateCheckedState = this.headerCheckBox.updateCheckedState;
    const feeApp = this;
    // tslint:disable-next-line:only-arrow-functions
    this.headerCheckBox.updateCheckedState = function () {
      const fees: any[] = feeApp.table.filteredValue || feeApp.table.value;
      const selection: any[] = feeApp.table.selection;
      for (const fee of fees) {
        if (!feeApp.isRowDisabled(fee)) {
          const selected = selection && selection.indexOf(fee) >= 0;
          if (!selected) { return false; }
        }
      }
      return true;
    };
  }
  showall(){
    if(this.feeApprovalData.length>0){
      this.itemperpage=this.feeApprovalData.length;
    }
  }
}

