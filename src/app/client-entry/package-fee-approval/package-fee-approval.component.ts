import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ScreenAuth } from 'src/app/common-methods/models/screen-auth';
import { AgentEntryMasterService } from 'src/app/common-methods/services/agent-entry-master.service';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { AuthService } from 'src/app/common-methods/services/auth.service';

import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';
import { PackFeeApproveVm } from 'src/app/common-methods/models/package';
import { Observable } from 'rxjs';
import { MatMenuTrigger } from '@angular/material/menu';
import { startWith, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table'

@Component({
  standalone: false,
  selector: 'app-package-fee-approval',
  templateUrl: './package-fee-approval.component.html',
  styleUrls: ['./package-fee-approval.component.css']
})

export class PackageFeeApprovalComponent implements OnInit, OnDestroy {
  itemperpage;
  routePath = 'Client / Package Fee Approval';
  screenAuth = new ScreenAuth();
  breadcrumbFlag = new BreadcrumbFlags();
  packApproveVm = new PackFeeApproveVm();
  userData: any;
  feeStatusList: any[] = [];
  filterFeeStatusList: any[] = [];
  packFeeApproval: any;
  packageReqDocList: any[] = [];
  packageApproverDocList: any[] = [];
  fileNameList: any[] = [];
  packageFeeDocumentList: any[] = [];
  btnApprove = false;
  showFlag = false;
  totalpages: number;
  currentPage = 1;
  tempCurrentPage = 1;
  packageFeeForm: UntypedFormGroup;
  columnName = [
    { field: 'clientName', header: 'Client Name' },
    { field: 'packageName', header: 'Package Name' },
    { field: 'requestAmount', header: 'Requested Amount' },
    { field: 'requestedBy', header: 'Requested By' },
    { field: 'status', header: 'Status' }
  ];
  frozenCols = [
    { field: 'action', header: 'Action' }
  ];
   @ViewChild('dt', { static: false }) dt!: Table;
 @ViewChild('global', { static: true }) global!: ElementRef<any>;

  @ViewChild('clientNameCtrlTrigger', { static: true }) clientNameCtrlTrigger: MatMenuTrigger;
  clientNameFilteredOptions: Observable<string[]>;
  clientNameControl = new UntypedFormControl();

  @ViewChild('packageNameCtrlTrigger', { static: true }) packageNameCtrlTrigger: MatMenuTrigger;
  packageFilteredOptions: Observable<string[]>;
  packageNameControl = new UntypedFormControl();

  @ViewChild('statusCtrlTrigger', { static: true }) statusCtrlTrigger: MatMenuTrigger;
  statusFilteredOptions: Observable<string[]>;
  statusControl = new UntypedFormControl();

  @ViewChild('requestByCtrlTrigger', { static: true }) requestByCtrlTrigger: MatMenuTrigger;
  requestByFilteredOptions: Observable<string[]>;
  requestByControl = new UntypedFormControl();

  @ViewChild('requestAmountCtrlTrigger', { static: true }) requestAmountCtrlTrigger: MatMenuTrigger;
  requestAmountFilteredOptions: Observable<string[]>;
  requestAmountControl = new UntypedFormControl();
  statusType: any;

  constructor(private fb: UntypedFormBuilder, private agentEntryMasterService: AgentEntryMasterService, private common: CommonService,
    private authService: AuthService, private message: MessageService, private router: Router, ) { }

  ngOnInit() {
    this.breadcrumbFlag = this.common.breadcrumbFlags(true);
    this.screenAuth = this.authService.getScreenAuth(this.router.url);
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.getPackageFeeStausDetails();
    this.initFormGroup();
    this.itemperpage = 10;
  }
  initFormGroup() {
    this.packageFeeForm = this.fb.group({
      packFeeId: [],
      comments: ['', Validators.required],
      status: [],
      loggedIn: [],
      FileName: ['', Validators.required]
    });
  }
  getPackageFeeStausDetails() {
    if (this.common.approvalType === 'Pending') {
      this.statusType = 'Pending';
    } else if (this.common.approvalType === 'Approved') {
      this.statusType = 'Approved';
    } else {
      this.statusType = '';
    }
    this.agentEntryMasterService.GetPackageFeeDetails(this.userData.teamName, this.statusType).subscribe((resp) => {
      if (resp) {
        this.feeStatusList = resp;
        resp.forEach((ele) => {
          const lastName = ele.requestedByLastName ? ele.requestedByLastName : '';
          ele.requestedBy = ele.requestedByFirstName + ' ' + lastName
            + ' - ' + ele.requestedByDesignation;
        });
        this.filterFeeStatusList = resp;
        this.TblAutoFilters();
      }
    });
  }
  getFeeDetails(data: any) {
    this.showFlag = true;
    this.breadcrumbFlag.btnBack = true;
    this.breadcrumbFlag.btnResetTbl = false;
    if (data.status === 'Pending') {
      this.btnApprove = true;
    } else {
      this.btnApprove = false;
      this.agentEntryMasterService.GetPackageFeeDocument(data.packFeeId).subscribe(res => {
        if (res) {
          this.packageReqDocList = res.requesterDocument;
          this.packageApproverDocList = res.approverDocument;
        }
      });
    }
    this.breadcrumbFlag.btnResetTbl = false;
    this.packFeeApproval = data;
    const lastName = data.requestedByLastName ? data.requestedByLastName : '';
    data.requestedBy = data.requestedByFirstName + ' ' + lastName
      + ' - ' + data.requestedByDesignation;
  }
  openUploadDoc(event: any) {
    const docArrayName: any[] = [];
    // tslint:disable-next-line: no-use-before-declare
    const packApp = new PackageDocument();
    packApp.document = event.target.files[0];
    packApp.fileName = event.target.files[0].name;
    this.fileNameList.push(packApp.fileName);
    docArrayName.push(packApp.fileName);
    this.packageFeeDocumentList.push(packApp);
    this.packageFeeForm.get('FileName')?.setValue(this.fileNameList);
  }
  removeDocument(data, index) {
    if (data.documentId === 0) {
      this.packageFeeDocumentList.splice(index, 1);
    }
    this.packageFeeForm.get('FileName')?.setValue(null);
  }
  packageFeeApproval() {
    if (this.packageFeeForm.get('comments')?.value && this.packageFeeDocumentList.length > 0) {
      this.packageFeeForm.get('FileName')?.setErrors(null);
      this.packApproveVm.packFeeId = this.packFeeApproval.packFeeId;
      this.packApproveVm.status = 'Approved';
      this.packApproveVm.comments = this.packageFeeForm.get('comments')?.value;
      this.packApproveVm.loggedIn = this.userData.userId;
      this.packApproveVm.FileName = this.packageFeeForm.get('FileName')?.value;
      const formData = new FormData();
      for (let i = 0; i < this.packageFeeDocumentList.length; i++) {
        formData.append('ClientPackFeesApprovedDoc_' + i, this.packageFeeDocumentList[i].document);
      }
      formData.append('ClientPackFeeApprove', JSON.stringify(this.packApproveVm));
      this.agentEntryMasterService.SavePackageApproval(formData).subscribe((res) => {
        if (res) {
          this.showTopCenter('success', 'Success Message', 'Approved Successfully');
          this.getPackageFeeStausDetails();
          this.showFlag = false;
          this.breadcrumbFlag.btnBack = false;
          this.btnApprove = false;
          this.breadcrumbFlag.btnResetTbl = true;
        }
      });
    } else {
      this.packageFeeForm.get('FileName')?.setErrors({ incorrect: true });
    }
  }
  downloadDoc(data: any) {
    this.common.downloadDocument(data.compFeeDocId, data.document, data.fileName);
  }
  downloadFile(data, filename) {
    const blob = new Blob([data.document], { type: 'application/octet-stream' });
    if (window.navigator && (window.navigator as any).msSaveOrOpenBlob) { // for IE
      (window.navigator as any).msSaveOrOpenBlob(blob, filename);
    } else {
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display:none;');
      const csvUrl = URL.createObjectURL(blob);
      a.href = csvUrl;
      a.download = filename;
      a.click();
      a.remove();
    }
  }
  closeForm() {
    this.showFlag = false;
    this.breadcrumbFlag.btnBack = !this.breadcrumbFlag.btnBack;
    this.btnApprove = false;
    this.breadcrumbFlag.btnResetTbl = !this.breadcrumbFlag.btnResetTbl;
    this.currentPage = 1;
    this.packageFeeDocumentList = [];
  }
  resetTbl() {
    this.dt.reset();
    this.global.nativeElement.value = '';
    this.TblAutoFilters();
  }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
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
  showall() {
    if (this.feeStatusList.length > 0) {
      this.itemperpage = this.feeStatusList.length;
    }
  }
  private TblAutoFilters(): void {
    this.clientNameFilteredOptions = this.clientNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.filterFeeStatusList.map(x => x.clientName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.packageFilteredOptions = this.packageNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.filterFeeStatusList.map(x => x.packageName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.statusFilteredOptions = this.statusControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.filterFeeStatusList.map(x => x.status).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.requestAmountFilteredOptions = this.requestAmountControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.filterFeeStatusList.map(x => x.requestAmount).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.requestByFilteredOptions = this.requestByControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.filterFeeStatusList.map(x => x.requestedBy).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
  }
  ngOnDestroy(): void {
    this.common.approvalType = '';
  }

}

export class PackageDocument {
  fileName: string;
  document;
}