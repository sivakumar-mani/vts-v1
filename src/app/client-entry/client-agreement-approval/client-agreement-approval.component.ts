import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AgentEntryMasterService } from 'src/app/common-methods/services/agent-entry-master.service';

import { CommonService } from 'src/app/common-methods/services/common.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ScreenAuth } from 'src/app/common-methods/models/screen-auth';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table'
@Component({
  standalone: false,
  selector: 'app-client-agreement-approval',
  templateUrl: './client-agreement-approval.component.html',
  styleUrls: ['./client-agreement-approval.component.css'],
  providers: [DatePipe],
})
export class ClientAgreementApprovalComponent implements OnInit {
  itemperpage;
  clientAgreementStatusList: any[] = [];
  approverDocList: any[] = [];
  requestorDocList: any[] = [];
  // tslint:disable-next-line: no-use-before-declare
  model = new ClientAgreeApproval();
  ClientAgreementApproval: any;
  filedname = [
    { field: 'clientName', header: 'Client Name' },
    { field: 'agreementAvailable', header: 'Agreement Availability' },
    { field: 'reason', header: 'Reason for non-availability' },
    { field: 'requestedByFirstName', header: 'Requested By' },
    { field: 'created', header: 'Requested Date and Time' },
    { field: 'approvalFlag', header: 'Status' },
  ];
  frozenCols = [
    { field: 'action', header: 'Action' },
  ];
  totalpages: number;
   @ViewChild('dt', { static: false }) dt!: Table;
 @ViewChild('global', { static: true }) global!: ElementRef<any>;
  @ViewChild('reasonCtl', { static: true }) reasonCtl: ElementRef<any>;
  currentPage = 1;
  tempCurrentPage = 1;
  pathParameters: string[];
  routePath = 'Client / Client Agreement Approval';
  showGrid: boolean;
  userData: any;
  agreementId: number;
  ClientAgreementForm: UntypedFormGroup;
  dupClientAgreementApproveDoc: any[] = [];
  dupclientAgreementStatusList: any[] = [];
  fromDate = '';
  toDate = '';
  minDate: any;
  maxDate: any;
  btnResetTbl = true;
  btnBack = false;
  btnApprove = false;
  @ViewChild('statusCtrlTrigger', { static: true }) statusCtrlTrigger: MatMenuTrigger;
  statusFilteredOptions: Observable<string[]>;
  statusControl = new UntypedFormControl();

  @ViewChild('reasonCtrlTrigger', { static: true }) reasonCtrlTrigger: MatMenuTrigger;

  @ViewChild('requestByCtrlTrigger', { static: true }) requestByCtrlTrigger: MatMenuTrigger;
  requestByFilteredOptions: Observable<string[]>;
  requestByControl = new UntypedFormControl();

  @ViewChild('createdDateCtrlTrigger', { static: true }) createdDateCtrlTrigger: MatMenuTrigger;
  createdFilteredOptions: Observable<string[]>;
  createdControl = new UntypedFormControl();

  @ViewChild('agreementAvailableCtrlTrigger', { static: true }) agreementAvailableCtrlTrigger: MatMenuTrigger;

  @ViewChild('clientNameCtrlTrigger', { static: true }) clientNameCtrlTrigger: MatMenuTrigger;
  clientNameFilteredOptions: Observable<string[]>;
  clientNameControl = new UntypedFormControl();
  screenAuth = new ScreenAuth();
  clientId: number;
  parameter: any;
  constructor(private agentEntryMasterService: AgentEntryMasterService, private common: CommonService, private authService: AuthService,
    private fb: UntypedFormBuilder, public commonService: CommonService, private message: MessageService,
    private dateP: DatePipe, private route: ActivatedRoute, private router: Router, ) {

  }

  ngOnInit() {
    this.screenAuth = this.authService.getScreenAuth(this.router.url);
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.getSearchClientAgreementApproval();
    this.initFormGroup();
    this.parameter = this.route.snapshot.queryParams;
    if (this.parameter.ClientId !== undefined) {
      this.agentEntryMasterService.getSearchClientAgreementApproval(this.parameter.ClientId, this.parameter.AgreementId, this.common.agreementapproveFlag, this.userData.userId).subscribe(res => {
        if (res) {
          this.showGrid = true;
          this.btnBack = true;
          this.btnApprove = true;
          this.btnResetTbl = false;
          this.requestorDocList = res.agreementReqDocuments;
          this.ClientAgreementApproval = res.agreementDetails[0];
        }
      });
    }
    this.itemperpage = 10;
  }
  initFormGroup() {
    this.ClientAgreementForm = this.fb.group({
      logginId: [this.userData.userId],
      approvalComments: ['', Validators.required],
    });
  }
  ngOnDestroy() {
    this.common.agreementapproveFlag = null;
  }
  getSearchClientAgreementApproval() {
    this.agentEntryMasterService.getSearchClientAgreementApproval(0, 0, this.common.agreementapproveFlag, this.userData.userId).subscribe(res => {
      this.clientAgreementStatusList = res.agreementDetails;
      this.clientAgreementStatusList.forEach(element => {
        element.requestedByFirstName = (element.requestedByLastName ? (element.requestedByFirstName + ' ' + element.requestedByLastName) :
          element.requestedByFirstName) + (' - ' + element.requestedByDesignation);
      });
      this.clientAgreementStatusList.filter(x => x.approvalFlag === true).map(y => y.approvalFlag = 'APPROVED');
      this.clientAgreementStatusList.filter(x => x.approvalFlag === false).map(y => y.approvalFlag = 'Pending');
      this.clientAgreementStatusList.filter(x => x.agreementAvailable === true).map(y => y.agreementAvailable = 'Yes');
      this.clientAgreementStatusList.filter(x => x.agreementAvailable === false).map(y => y.agreementAvailable = 'No');
      this.dupclientAgreementStatusList = this.common.CloneObject(res.agreementDetails);
      this.userTblAutoFilters();
      this.currentPage = 1;
    });
  }
  getClientAgreementApprovalByID(data: any) {
    this.btnBack = !this.btnBack;
    if (data.approvalFlag === 'Pending') {
      this.btnApprove = true;
    }
    this.btnResetTbl = !this.btnResetTbl;
    this.showGrid = true;
    this.scrollToTop();
    this.agreementId = data.agreementId;
    this.clientId = data.clientId;
    // this.ClientAgreementApproval = data;
    this.agentEntryMasterService.getClientAgreementApprovalById(data.clientId, data.agreementId,this.common.agreementapproveFlag).subscribe(res => {
      if (res) {
        this.requestorDocList = res.agreementReqDocuments;
        this.ClientAgreementApproval = res.agreementDetails;
        this.ClientAgreementApproval.forEach(element => {
          element.requestedByFirstName = (element.requestedByLastName ? (element.requestedByFirstName + ' ' + element.requestedByLastName) :
            element.requestedByFirstName);
        });
        this.ClientAgreementApproval.filter(x => x.approvalFlag === true).map(y => y.approvalFlag = 'APPROVED');
        this.ClientAgreementApproval.filter(x => x.approvalFlag === false).map(y => y.approvalFlag = 'Pending');
        this.ClientAgreementApproval.filter(x => x.agreementAvailable === true).map(y => y.agreementAvailable = 'Yes');
        this.ClientAgreementApproval.filter(x => x.agreementAvailable === false).map(y => y.agreementAvailable = 'No');
        this.ClientAgreementApproval = this.ClientAgreementApproval[0];
      }
    });
  }

  saveClientAgreementApproval() {
    if (this.ClientAgreementForm.controls.approvalComments.valid) {
      this.model.logginId = this.userData.userId;
      this.model.approvalComments = this.ClientAgreementForm.controls.approvalComments.value;
      this.model.agreementId = this.agreementId;
      this.model.clientId = this.clientId;
      this.agentEntryMasterService.saveClientAgreementApproval(this.model).subscribe(resp => {
        if (resp) {
          this.showTopCenter('success', 'Success Message', 'Approved Successfully');
        }
        this.getSearchClientAgreementApproval();
        this.showGrid = false;
        this.btnBack = false;
        this.btnApprove = false;
        this.btnResetTbl = true;
      });
    }

  }

  downloadDoc(data: any) {
    this.common.downloadDocument(data.compFeeDocId, data.document, data.fileName);
  }
  private userTblAutoFilters(): void {
    this.statusFilteredOptions = this.statusControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.clientAgreementStatusList.map(x => x.approvalFlag).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.clientNameFilteredOptions = this.clientNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.clientAgreementStatusList.map(x => x.clientName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.requestByFilteredOptions = this.requestByControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.clientAgreementStatusList.map(x => x.requestedByFirstName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

  }
  getRecordBydate(fDate, tDate) {
    this.clientAgreementStatusList = this.dupclientAgreementStatusList;
    const FromDate = this.dateP.transform(fDate, 'yyyy-MM-dd');
    const ToDate = this.dateP.transform(tDate, 'yyyy-MM-dd');
    this.clientAgreementStatusList.map(d => d.created = this.dateP.transform(d.created, 'yyyy-MM-dd'));
    this.clientAgreementStatusList = this.clientAgreementStatusList.filter(x =>
      x.created >= FromDate && x.created <= ToDate);
  }
  closeMenu(col: any) {
    switch (col) {
      case 'reason': this.reasonCtrlTrigger.closeMenu(); break;
      case 'approvalFlag': this.statusCtrlTrigger.closeMenu(); break;
      case 'clientName': this.clientNameCtrlTrigger.closeMenu(); break;
      case 'requestedByFirstName': this.requestByCtrlTrigger.closeMenu(); break;
      case 'agreementAvailable': this.requestByCtrlTrigger.closeMenu(); break;
      case 'created': this.createdDateCtrlTrigger.closeMenu(); break;
      default: break;
    }
  }
  tblReset() {
    this.dt.reset();
    this.resetDate();
    this.global.nativeElement.value = '';
    this.reasonCtl.nativeElement.value = '';
    this.statusControl.reset();
    this.clientNameControl.reset();
    this.requestByControl.reset();
    this.userTblAutoFilters();
  }
  resetDate() {
    this.fromDate = '';
    this.toDate = '';
    this.clientAgreementStatusList = this.dupclientAgreementStatusList;
  }
  scrollToTop() {
    window.scroll(0, 0);
  }
  backToSearch() {
    this.ClientAgreementForm.reset();
    this.btnBack = !this.btnBack;
    this.btnApprove = false;
    this.btnResetTbl = !this.btnResetTbl;
    this.showGrid = false;
    this.currentPage = 1;
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
  showall() {
    if (this.clientAgreementStatusList.length > 0) {
      this.itemperpage = this.clientAgreementStatusList.length;
    }
  }

}
export class ClientAgreeApproval {
  logginId: number;
  approvalComments: string;
  agreementId: number;
  clientId: number;
}
