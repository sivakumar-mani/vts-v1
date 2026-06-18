import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AgentEntryMasterService } from '../../common-methods/services/agent-entry-master.service';

import { CommonService } from 'src/app/common-methods/services/common.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { ClientFeeApproveDoc, ClientCompFeeStatusTrans } from 'src/app/common-methods/models/clientFeeApproval';
import { MatMenuTrigger } from '@angular/material/menu';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { ScreenAuth } from 'src/app/common-methods/models/screen-auth';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table'

@Component({
  standalone: false,
  selector: 'app-client-fee-approval',
  templateUrl: './client-fee-approval.component.html',
  styleUrls: ['./client-fee-approval.component.css'],
  providers: [DatePipe],
})
export class ClientFeeApprovalComponent implements OnInit {
  itemperpage;
  clientCompFeeStatusTransList: any[] = [];
  approverDocList: any[] = [];
  requestorDocList: any[] = [];
  model = new ClientCompFeeStatusTrans();
  clientFeeApproval: any;
  filedname = [
    { field: 'clientName', header: 'Client Name' },
    { field: 'componentName', header: 'Component Name' },
    { field: 'requestAmount', header: 'Request Amount' },
    { field: 'requestedByFirstName', header: 'Request By' },
    { field: 'reqEffectiveDate', header: 'Requested Date' },
    { field: 'status', header: 'Status' },
  ];
  frozenCols = [
    { field: 'action', header: 'Action' },
  ];
  totalpages: number;
   @ViewChild('dt', { static: false }) dt!: Table;
 @ViewChild('global', { static: true }) global!: ElementRef<any>;
 @ViewChild('amountCtl', { static: true }) 
amountCtl!: ElementRef<any>;
  currentPage = 1;
  tempCurrentPage = 1;
  pathParameters: string[];
  routePath = 'Client / MSP & NRP Fee Approval';
  showGrid: boolean;
  userData: any;
  compFeeId: number;
  clientFeeForm: UntypedFormGroup;
  dupclientFeeApproveDoc: any[] = [];
  dupclientCompFeeStatusTransList: any[] = [];
  fromDate = '';
  toDate = '';
  minDate: any;
  maxDate: any;
  btnResetTbl = true;
  btnBack = false;
  btnSave = false;
  btnReject = false;
  btnApprove = false;

  @ViewChild('statusCtrlTrigger', { static: true }) statusCtrlTrigger: MatMenuTrigger;
  statusFilteredOptions: Observable<string[]>;
  statusControl = new UntypedFormControl();

 @ViewChild('componentNameCtrlTrigger', { static: true }) 
componentNameCtrlTrigger!: MatMenuTrigger;
  compFilteredOptions: Observable<string[]>;
  componentNameControl = new UntypedFormControl();

  @ViewChild('requestByCtrlTrigger', { static: true }) requestByCtrlTrigger: MatMenuTrigger;
  requestByFilteredOptions: Observable<string[]>;
  requestByControl = new UntypedFormControl();

  @ViewChild('reqEffectiveDateCtrlTrigger', { static: true }) reqEffectiveDateCtrlTrigger: MatMenuTrigger;
  reqEffectiveDateFilteredOptions: Observable<string[]>;
  reqEffectiveDateControl = new UntypedFormControl();

  @ViewChild('requestAmountCtrlTrigger', { static: true }) requestAmountCtrlTrigger: MatMenuTrigger;

  @ViewChild('clientNameCtrlTrigger', { static: true }) clientNameCtrlTrigger: MatMenuTrigger;
  clientNameFilteredOptions: Observable<string[]>;
  clientNameControl = new UntypedFormControl();
  screenAuth = new ScreenAuth();
  toolTip: string;
  constructor(private agentEntryMasterService: AgentEntryMasterService, public common: CommonService, private authService: AuthService,
    // tslint:disable-next-line: align
    private fb: UntypedFormBuilder, private message: MessageService, private dateP: DatePipe, private router: Router, ) { }

  ngOnInit() {
    this.screenAuth = this.authService.getScreenAuth(this.router.url);
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.getSearchClientFeeApproval();
    this.initFormGroup();
    this.itemperpage = 10;
  }
  initFormGroup() {
    this.clientFeeForm = this.fb.group({
      loggedIn: [this.userData.userId],
      comments: ['', Validators.required],
      status: [''],
      compFeeId: [''],
      clientFeeApproval: [],
    });
  }
  // dataDate: any[] = [];
  getSearchClientFeeApproval() {
    if (this.common.agreementapproveFlag === true) {
      this.agentEntryMasterService.GetFOCDetail().subscribe(resp => {
        if (resp) {
          this.fetchResp(resp);
        }
      });
    } else {
      this.agentEntryMasterService.GetSearchClientFeeApprovalFiles(this.userData.userId, 
        this.userData.teamName,this.common.MspApprovestatus).subscribe(res => {
        if (res) {
          this.fetchResp(res);
        }
      });
    }
  }
  fetchResp(res: any) {
    this.clientCompFeeStatusTransList = res;
    this.clientCompFeeStatusTransList.forEach(element => {
      element.requestedByFirstName = (element.requestedByLastName ? (element.requestedByFirstName + ' ' + element.requestedByLastName) :
        element.requestedByFirstName) + (' - ' + element.requestedByDesignation);
      element.requestAmount = element.currencyShortName ? (element.requestAmount + ' ' + element.currencyShortName)
        : element.requestAmount;
    });
    this.dupclientCompFeeStatusTransList = this.common.CloneObject(res);
    this.maxDate = new Date(Math.max.apply(null, this.dupclientCompFeeStatusTransList.map(e =>
      new Date(e.reqEffectiveDate))));
    this.minDate = new Date(Math.min.apply(null, this.dupclientCompFeeStatusTransList.map(y =>
      new Date(y.reqEffectiveDate))));
    this.userTblAutoFilters();
    this.currentPage = 1;
  }
  ngOnDestroy() {
    this.common.agreementapproveFlag = null;
  }
  getClientFeeApprovalByID(data: any) {
    this.btnBack = true;
    if (data.status === 'Pending') {
      this.btnApprove = true;
      this.btnReject = true;
    } else {
      this.toolTip = 'Update';
      this.btnSave = false;
    }
    this.model.clientFeeApproveDoc = [];
    this.dupclientFeeApproveDoc = [];
    this.requestorDocList = [];
    this.approverDocList = [];
    this.btnResetTbl = false;
    this.showGrid = true;
    this.scrollToTop();
    this.compFeeId = data.compFeeId;
    this.clientFeeApproval = data;
    this.agentEntryMasterService.GetClientFeeDocument(data.clientId, data.compFeeId).subscribe(res => {
      if (res) {
        this.requestorDocList = res.requesterDocument;
        this.approverDocList = res.approverDocument;
        // this.dupclientFeeApproveDoc = this.common.CloneObject(res.approverDocument);
      }
    });
  }

  saveClientFeeApproval(status: any) {
    if ((this.clientFeeForm.get('comments')?.valid && this.model.clientFeeApproveDoc.length > 0) || status === 'Update') {
      const formData = new FormData();
      this.model.comments = this.clientFeeForm.controls.comments.value;
      this.model.status = status;
      if (status === 'Update') {
        this.model.status = this.clientFeeApproval.status;
        this.model.comments = this.clientFeeApproval.approveComments;
      }
      this.model.loggedIn = this.userData.userId;
      this.model.compFeeId = this.compFeeId;
      if (this.model !== null) {
        this.model.clientFeeApproveDoc.forEach(ele => {
          if (this.dupclientFeeApproveDoc.filter(e => e.documentId === ele.documentId).length === 0) {
            ele.active = false;
          }
        });

        for (let i = 0; i < this.model.clientFeeApproveDoc.length; i++) {
          if (this.model.clientFeeApproveDoc[i].fileName && this.model.clientFeeApproveDoc[i].documentId === 0) {
            formData.append('ClientFeesApprovedDoc_' + i, this.model.clientFeeApproveDoc[i].document);
          }
        }
        formData.append('ClientFeeApprove', JSON.stringify(this.model));
      }
      this.agentEntryMasterService.saveClientFeeApproveDocument(formData).subscribe(resp => {
        if (resp) {
          if (this.model.status === 'Rejected' && status !== 'Update') {
            this.showTopCenter('success', 'Success Message', 'Rejected Successfully');
          }
          if (this.model.status === 'Approved' && status !== 'Update') {
            this.showTopCenter('success', 'Success Message', 'Approved Successfully');
          }
          if (status === 'Update') {
            this.showTopCenter('success', 'Success Message', 'Updated Successfully');
          }
        }
        this.getSearchClientFeeApproval();
        this.showGrid = false;
        this.btnBack = false;
        this.btnApprove = false;
        this.btnSave = false;
        this.btnReject = false;
        this.btnResetTbl = true;
      });
      this.clientFeeForm.get('comments')?.clearValidators();
      this.clientFeeForm.get('comments')?.updateValueAndValidity();
      this.clientFeeForm.get('clientFeeApproval')?.setErrors(null);
    } else {
      this.clientFeeForm.get('comments')?.setValidators(Validators.required);
      this.clientFeeForm.get('comments')?.markAsTouched();
      this.clientFeeForm.get('comments')?.updateValueAndValidity();
      this.clientFeeForm.get('clientFeeApproval')?.setErrors({ incorrect: true });
    }
  }
  openUploadDoc(event: any) {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < event.target.files.length; i++) {
      const clientFeeDoc = new ClientFeeApproveDoc();
      clientFeeDoc.fileName = event.target.files[i].name;
      clientFeeDoc.document = event.target.files[i];
      clientFeeDoc.active = true;
      clientFeeDoc.documentId = 0;
      if (this.dupclientFeeApproveDoc.filter(x => x.fileName === clientFeeDoc.fileName).length > 0) {
        this.showTopCenter('warn', 'Failure Message', 'File already exists');
      } else {
        this.model.clientFeeApproveDoc.push(clientFeeDoc);
        this.dupclientFeeApproveDoc.push(clientFeeDoc);
      }
    }
  }
  removeDocument(data, index) {
    if (data.documentId === 0) {
      this.model.clientFeeApproveDoc.splice(index, 1);
    }
    this.dupclientFeeApproveDoc.splice(index, 1);
    this.clientFeeForm.get('clientFeeApproval')?.setValue(null);
  }
  downloadDoc(data: any) {
    this.common.downloadDocument(data.compFeeDocId, data.document, data.fileName);
  }
  private userTblAutoFilters(): void {
    this.statusFilteredOptions = this.statusControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.clientCompFeeStatusTransList.map(x => x.status).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.compFilteredOptions = this.componentNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.clientCompFeeStatusTransList.map(x => x.componentName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.clientNameFilteredOptions = this.clientNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.clientCompFeeStatusTransList.map(x => x.clientName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.requestByFilteredOptions = this.requestByControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.clientCompFeeStatusTransList.map(x => x.requestedByFirstName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

  }
  getRecordBydate(fDate, tDate) {
    this.clientCompFeeStatusTransList = this.dupclientCompFeeStatusTransList;
    const FromDate = this.dateP.transform(fDate, 'yyyy-MM-dd');
    const ToDate = this.dateP.transform(tDate, 'yyyy-MM-dd');
    this.clientCompFeeStatusTransList.map(d => d.reqEffectiveDate = this.dateP.transform(d.reqEffectiveDate, 'yyyy-MM-dd'));
    this.clientCompFeeStatusTransList = this.clientCompFeeStatusTransList.filter(x =>
      x.reqEffectiveDate >= FromDate && x.reqEffectiveDate <= ToDate);
  }
  closeMenu(col: any) {
    switch (col) {
      case 'componentName': this.componentNameCtrlTrigger.closeMenu(); break;
      case 'status': this.statusCtrlTrigger.closeMenu(); break;
      case 'clientName': this.clientNameCtrlTrigger.closeMenu(); break;
      case 'requestedByFirstName': this.requestByCtrlTrigger.closeMenu(); break;
      case 'requestAmount': this.requestAmountCtrlTrigger.closeMenu(); break;
      case 'reqEffectiveDate': this.reqEffectiveDateCtrlTrigger.closeMenu(); break;
      default: break;
    }
  }
  tblReset() {
    this.dt.reset();
    this.resetDate();
    this.global.nativeElement.value = '';
    this.amountCtl.nativeElement.value = '';
    this.statusControl.reset();
    this.componentNameControl.reset();
    this.clientNameControl.reset();
    this.requestByControl.reset();
    this.userTblAutoFilters();
  }
  resetDate() {
    this.fromDate = '';
    this.toDate = '';
    this.clientCompFeeStatusTransList = this.dupclientCompFeeStatusTransList;
  }
  scrollToTop() {
    window.scroll(0, 0);
  }
  backToSearch() {
    this.clientFeeForm.reset();
    this.btnBack = !this.btnBack;
    this.btnApprove = false;
    this.btnSave = false;
    this.btnReject = false;
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
    if (this.clientCompFeeStatusTransList.length > 0) {
      this.itemperpage = this.clientCompFeeStatusTransList.length;
    }
  }
}

