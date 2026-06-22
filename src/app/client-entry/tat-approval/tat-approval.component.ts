import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';

import { AuthService } from '../../common-methods/services/auth.service';
import { CommonService } from '../../common-methods/services/common.service';
import { ScreenAuth } from '../../common-methods/models/screen-auth';
import { AgentEntryMasterService } from '../../common-methods/services/agent-entry-master.service';
import { Observable } from 'rxjs';
import { MatMenuTrigger } from '@angular/material/menu';
import { startWith, map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { ClientCompTATStatusTrans, ClientTATApproveDoc } from 'src/app/common-methods/models/clientTatApproval';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table'

@Component({
  standalone: false,
  selector: 'app-tat-approval',
  templateUrl: './tat-approval.component.html',
  styleUrls: ['./tat-approval.component.css'],
  providers: [DatePipe],
})
export class TatApprovalComponent implements OnInit {
  itemperpage;
  routePath = 'Client / TAT Approval';
  currentPage = 1;
  tempCurrentPage = 1;
  totalpages: number;
  pathParameters: string[];
  showGrid: boolean;
  userData: any;
  compTATId: number;
  tatFormGroup: UntypedFormGroup;
  fromDate = '';
  toDate = '';
  minDate: any;
  maxDate: any;
  btnResetTbl = true;
  btnBack = false;
  btnSave = false;
  btnReject = false;
  btnApprove = false;
  toolTip: string;
  screenAuth = new ScreenAuth();
  tatApprovalGridList: any[] = [];
  dupTatApprovalGridList: any[] = [];
  approverDocList: any[] = [];
  requestorDocList: any[] = [];
  tatApprovalobj: any;
  model = new ClientCompTATStatusTrans();
  filedname = [
    { field: 'action', header: 'Action', value: true, disabled: true },
    { field: 'clientName', header: 'Client Name' },
    { field: 'componentName', header: 'Component Name' },
    { field: 'requestTat', header: 'Request TAT' },
    { field: 'requestedByFirstName', header: 'Request By' },
    { field: 'reqEffectiveDate', header: 'Requested Date' },
    { field: 'status', header: 'Status' },
  ];
  frozenCols = [
    { field: 'action', header: 'Action' },
  ];

   @ViewChild('dt', { static: false }) dt!: Table;
 @ViewChild('global', { static: true }) global!: ElementRef<any>;
 @ViewChild('amountCtl', { static: true }) 
amountCtl!: ElementRef<any>;


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

  @ViewChild('requestTatCtrlTrigger', { static: true }) requestTatCtrlTrigger: MatMenuTrigger;
  requestTatFilteredOptions: Observable<string[]>;
  requestTatControl = new UntypedFormControl();

  @ViewChild('clientNameCtrlTrigger', { static: true }) clientNameCtrlTrigger: MatMenuTrigger;
  clientNameFilteredOptions: Observable<string[]>;
  clientNameControl = new UntypedFormControl();
  dupclientCompTatApproveDoc: any[] = [];

  constructor(private message: MessageService, private common: CommonService, private authService: AuthService,
    private agentEntryMasterService: AgentEntryMasterService, private fb: UntypedFormBuilder,
    private router: Router, ) { }

  ngOnInit() {
    this.showGrid = true;
    this.screenAuth = this.authService.getScreenAuth(this.router.url);
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.getTatApprovalGridList();
    this.itemperpage = 10;
  }
  initFormGroup() {
    this.tatFormGroup = this.fb.group({
      loggedIn: [this.userData.userId],
      comments: ['', Validators.required],
      status: [''],
      compTatId: [''],
      tatApproval: [],
    });
  }
  getTatApprovalGridList() {
    this.agentEntryMasterService.getApprovalList(this.userData.userId, this.userData.teamName,this.common.TatApprovestatus).subscribe(res => {
      if (res) {
        this.tatApprovalGridList = res;
        this.tatApprovalGridList.forEach(element => {
          element.requestedByFirstName = element.requestedByFirstName + ' ' + element.requestedByLastName +
            ' - ' + element.requestedByDesignation;
        });
        this.dupTatApprovalGridList = this.common.CloneObject(res);
        this.maxDate = new Date(Math.max.apply(null, this.dupTatApprovalGridList.map(e =>
          new Date(e.reqEffectiveDate))));
        this.minDate = new Date(Math.min.apply(null, this.dupTatApprovalGridList.map(y =>
          new Date(y.reqEffectiveDate))));
        this.tatTblAutoFilters();
        this.currentPage = 1;
      }
    });
    // if (this.tatApprovalGridList.length > 0) {

    // this.tatApprovalGridList = [{
    //   approvalFlag: false,
    //   approveComments: null,
    //   clientId: 12,
    //   clientName: "DL Tech",
    //   compTATId: 16,
    //   componentName: "CREDIT VERIFICATION",
    //   reason: "test",
    //   reqEffectiveDate: "2019-09-19T07:16:32.947",
    //   requestTat: 600,
    //   requestedByFirstName: "karthick-Managing Director",
    //   status: "Received",
    //   userName: "karthick"
    // }];

    // }
  }
  editTatApprovalByID(data: any) {
    this.btnBack = true;
    if (data.status === 'Pending') {
      this.btnApprove = true;
      this.btnReject = true;
    } else {
      this.toolTip = 'Update';
      this.btnSave = false;
    }
    this.btnResetTbl = false;
    this.initFormGroup();
    this.showGrid = false;
    this.tatApprovalobj = data;
    this.compTATId = data.compTatid;
    this.agentEntryMasterService.GetClientTATDocument(data.compTatid).subscribe(res => {
      if (res) {
        this.requestorDocList = res.requesterDocument;
        this.model.clientCompTatApproveDoc = this.common.CloneObject(res.approverDocument);
        this.dupclientCompTatApproveDoc = this.common.CloneObject(res.approverDocument);
        this.approverDocList = res.approverDocument;
      }
    });
  }
  saveTatApproval(status: any) {
    if (this.tatFormGroup.get('comments')?.valid || status === 'Update') {
      const formData = new FormData();
      this.model.comments = this.tatFormGroup.controls.comments.value;
      this.model.status = status;
      if (status === 'Update') {
        this.model.status = this.tatApprovalobj.status;
        this.model.comments = this.tatApprovalobj.approveComments;
      }
      this.model.loggedIn = this.userData.userId;
      this.model.compTATId = this.compTATId;
      if (this.model !== null) {
        this.model.clientCompTatApproveDoc.forEach(ele => {
          if (this.dupclientCompTatApproveDoc.filter(e => e.documentId === ele.documentId).length === 0) {
            ele.active = false;
          }
        });

        for (let i = 0; i < this.model.clientCompTatApproveDoc.length; i++) {
          if (this.model.clientCompTatApproveDoc[i].fileName && this.model.clientCompTatApproveDoc[i].documentId === 0) {
            formData.append('ClientCompTATApprovedDoc_' + i, this.model.clientCompTatApproveDoc[i].document);
          }
        }
        formData.append('ClientCompTATApprove', JSON.stringify(this.model));
      }
      this.agentEntryMasterService.ClientApproveDocument(formData).subscribe(resp => {
        if (resp) {
          if (this.model.status === 'Rejected' && status !== 'Update') {
            this.showTopCenter('success', 'Success Message', 'Reviewd Successfully');
          }
          if (this.model.status === 'Approved' && status !== 'Update') {
            this.showTopCenter('success', 'Success Message', 'Approved Successfully');
          }
          if (status === 'Update') {
            this.showTopCenter('success', 'Success Message', 'Updated Successfully');
          }
        }
        this.getTatApprovalGridList();
        this.showGrid = true;
        this.btnBack = false;
        this.btnApprove = false;
        this.btnSave = false;
        this.btnReject = false;
        this.btnResetTbl = true;
      });
      this.tatFormGroup.get('comments')?.clearValidators();
      this.tatFormGroup.get('comments')?.updateValueAndValidity();
    } else {
      this.tatFormGroup.get('comments')?.setValidators(Validators.required);
      this.tatFormGroup.get('comments')?.markAsTouched();
      this.tatFormGroup.get('comments')?.updateValueAndValidity();
    }
  }
  openUploadDoc(event: any) {
    const clientTATDoc = new ClientTATApproveDoc();
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < event.target.files.length; i++) {
      clientTATDoc.fileName = event.target.files[i].name;
      clientTATDoc.document = event.target.files[i];
      clientTATDoc.active = true;
      clientTATDoc.documentId = 0;
      if (this.dupclientCompTatApproveDoc.filter(x => x.fileName === clientTATDoc.fileName).length > 0) {
        this.showTopCenter('warn', 'Failure Message', 'File already exists');
      } else {
        this.model.clientCompTatApproveDoc.push(clientTATDoc);
        this.dupclientCompTatApproveDoc.push(clientTATDoc);
      }
    }
  }
  removeDocument(data, index) {
    if (data.documentId === 0) {
      this.model.clientCompTatApproveDoc.splice(index, 1);
    }
    this.dupclientCompTatApproveDoc.splice(index, 1);
  }
  downloadDoc(data: any) {
    this.common.downloadDocument(data.compFeeDocId, data.document, data.fileName);
  }
  private tatTblAutoFilters(): void {
    this.statusFilteredOptions = this.statusControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.tatApprovalGridList.map(x => x.status).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.compFilteredOptions = this.componentNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.tatApprovalGridList.map(x => x.componentName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.clientNameFilteredOptions = this.clientNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.tatApprovalGridList.map(x => x.clientName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.requestByFilteredOptions = this.requestByControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.tatApprovalGridList.map(x => x.requestedByFirstName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.requestTatFilteredOptions = this.requestTatControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.tatApprovalGridList.map(x => x.requestTat).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

  }
  tblReset() {
    this.dt.reset();
    // this.resetDate();
    this.global.nativeElement.value = '';
    this.amountCtl.nativeElement.value = '';
    // this.statusControl.reset();
    // this.componentNameControl.reset();
    // this.clientNameControl.reset();
    // this.requestByControl.reset();
    // this.userTblAutoFilters();
  }
  backToSearch() {
    this.tatFormGroup.reset();
    this.btnBack = !this.btnBack;
    this.btnApprove = false;
    this.btnSave = false;
    this.btnReject = false;
    this.btnResetTbl = !this.btnResetTbl;
    this.showGrid = true;
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
    if (this.tatApprovalGridList.length > 0) {
      this.itemperpage = this.tatApprovalGridList.length;
    }
  }
}
