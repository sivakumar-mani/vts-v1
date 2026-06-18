import { Component, OnInit, Input } from '@angular/core';
import { QualityCheckService } from 'src/app/common-methods/services/quality-check.service';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder } from '@angular/forms';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { DatePipe } from '@angular/common';
import { ScreeningService } from '../../common-methods/services/screening.service';
import { MessageService } from 'primeng/api';
import { VerificationService } from 'src/app/common-methods/services/verification.service';


@Component({
  standalone: false,
  selector: 'app-qc-approved-rejected-details',
  templateUrl: './qc-approved-rejected-details.component.html',
  styleUrls: ['./qc-approved-rejected-details.component.css']
})
export class QcApprovedRejectedDetailsComponent implements OnInit {
  showallFlag = false;
  qcForm: UntypedFormGroup;
  qcApproveForm: UntypedFormGroup;
  userData: any;
  qcDetails: any;
  qcExDetails: any;
  componentControl!: AutoCompleteDropDown;
  vendorControl!: AutoCompleteDropDown;
  clientControl!: AutoCompleteDropDown;
  statusControl!: AutoCompleteDropDown;
  userControl!: AutoCompleteDropDown;
  verificationControl!: AutoCompleteDropDown;
  clientRefControl!: AutoCompleteDropDown;
  candidateControl!: AutoCompleteDropDown;
  componentList: any;
  vendorList: any;
  clientList: any;
  statusList: any;
  userList: any;
  verificationIdList: any;
  clientReferenceIdList: any;
  candidateList: any;
  searchValueArr: any[] = [];
  SearchCriFilter = false;
  isDesc: boolean;
  column: any;
  direction: number;
  itemPerPage = 10;
  page = 1;
  @Input() filterLength: number;
  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  qcColumn = [
    { field: 'candidateFullName', header: 'Candidate Name' },
    { field: 'clientName', header: 'Client Name' },
    { field: 'clientRefNo', header: 'Client Reference No' },
    { field: 'siteName', header: 'Site Name' },
    { field: 'status', header: 'Status' },
    { field: 'ownerName', header: 'QC Owner' },
    { field: 'tatDays', header: 'TAT Days' },
    { field: 'colourCode', header: 'Color Code' }];
  fromDate = '';
  toDate = '';
  dupList: any[] = [];
  shieveTotalCount = 0;
  shievePageNo = 1;
  shievePageSize = 10;
  constructor(public screeningService: ScreeningService, public qcService: QualityCheckService, private fb: UntypedFormBuilder, private router: Router, public commonservice: CommonService,
    private datePipe: DatePipe, private message: MessageService, public verification: VerificationService) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.initFormGroup();
    this.getQcDetails(this.qcService.approveOrRejectType, false);
    this.userData.page = this.shievePageNo;
  }
  // tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy() {
    this.qcService.approveOrRejectType = null;
  }
  getQcDetails(type, exFlag) {
    if (type === 'Individual QC Approved' || type === 'Today Individual QC Approved') {
      const flag = type === 'Today Individual QC Approved' ? true : false;
      this.getDataList('GetIQcApprovedList', { todayCountFlag: flag, loginUserDetVm: this.userData }, exFlag);
    } else if (type === 'Individual QC Rejected') {
      this.getDataList('GetIQcRejectedList', this.userData, exFlag);
    } else if (type === 'Final QC Approved' || type === 'Today Final QC Approved') {
      const flag = type === 'Today Final QC Approved' ? true : false;
      this.getDataList('GetFQcApprovedList', { todayCountFlag: flag, loginUserDetVm: this.userData }, exFlag);
    } else if (type === 'Final QC Rejected') {
      this.getDataList('GetFQcRejectedList', this.userData, exFlag);
    } else if (type === 'Pre-Final Cases') {
      this.getDataList('GetIQCPartialDetails', this.userData, exFlag);
    }
    else if (type === 'Final Report Not Sent') {
      this.getDataList('GetFinalReportNotSentList', { loginUserDetVm: this.userData }, exFlag);
    }
  }
  getFinalReportDocument(screeningId: any) {
    this.qcService.GetFinalQCReportDocument('Final Report', screeningId, this.userData.userId).subscribe(res => {
      if (res) {
        this.downloadFile(res.document, res.fileName);
      }
    });

  }
  sendFinalReportMail(iqcByPassFlag, clientId, siteId, screeningId, candidateFullName, clientRefNo, colourCode) {


    this.qcApproveForm.get('iQcByPassFlag')?.setValue(iqcByPassFlag);
    this.qcApproveForm.get('clientId')?.setValue(clientId);
    this.qcApproveForm.get('siteId')?.setValue(siteId);
    this.qcApproveForm.get('screeningId')?.setValue(screeningId);
    this.qcApproveForm.get('candidateName')?.setValue(candidateFullName);
    this.qcApproveForm.get('referenceNo')?.setValue(clientRefNo);
    this.qcApproveForm.get('colorCode')?.setValue(colourCode);
    this.qcService.FinalQCApprovalSentToClientMail(this.qcApproveForm.value).subscribe(res => {
      if (res) {
        this.showTopCenterNew('success', 'Success Message', 'Final Report Mail sent successfully')
          .then(() => {
            this.getQcDetails(this.qcService.approveOrRejectType, false);
          });
      }
      else {
        this.showTopCenterNew('error', 'Error Message', 'Final Report Mail not sent');
      }
    });
  }
  downloadFile(doc, filename) {
    if (doc || filename) {
      const sampleArr = this.commonservice.base64ToArrayBuffer(doc);
      this.commonservice.saveByteArray(filename, sampleArr);
    }
  }
  getDataList(methhod, data, exFlag) {

    this.applyPagination(exFlag);

    // this.screeningService.getClients(this.userData).subscribe(res => {
    //   if (res) {
    //     this.clientList = res;
    //   }
    // });

    // this.screeningService.getComponents(this.userData).subscribe(res => {
    //   if (res) {
    //     this.componentList = res;
    //   }
    // });

    if (exFlag) {

      this.qcService[methhod](data)
        .subscribe({

          next: (res: any) => {

            if (res) {

              this.shieveTotalCount = res.headers.get('X-Total-Count');

              const resp = res.body;

              this.qcExDetails = resp;

              this.mapQcdetails(exFlag);
            }
          },

          error: (err) => {

            console.error(err);
          }
        });

    } else {

      this.qcService[methhod](data)
        .subscribe({

          next: (res: any) => {

            if (res) {

              this.shieveTotalCount = res.headers.get('X-Total-Count');

              const resp = res.body;

              this.qcDetails = resp;

              this.mapQcdetails(exFlag);
            }
          },

          error: (err) => {

            console.error(err);
          }
        });
    }
  }
  shieveFilter(ctrl: any) {
    if (this.qcForm.get(ctrl).valid) {
      this.getQcDetails(this.qcService.approveOrRejectType, false);
    }
  }
  removeValue(value: any) {
    if (value === '') {
      this.getQcDetails(this.qcService.approveOrRejectType, false);
    }
  }
  ngDestroy() {
    this.showallFlag = false;
  }
  shievePagination(event: any) {
    this.shievePageNo = event;
    this.getQcDetails(this.qcService.approveOrRejectType, false);
  }
  Qclimit() {
    if (this.shievePageSize > 200) {
      this.shievePageSize = 200;
    }
    this.getQcDetails(this.qcService.approveOrRejectType, false);
  }

  shieveShowall() {
    if (this.shieveTotalCount > 0) {
      this.showallFlag = true;
      this.shievePageSize = this.shieveTotalCount;
      this.getQcDetails(this.qcService.approveOrRejectType, false);
    }
  }
  applyPagination(exFlag: any) {
    let filter = this.userData.filters;;
    if (this.qcForm.value.verificationId) {
      filter = filter + ',' + 'verificationId @=' + this.qcForm.value.verificationId;
    } if (this.qcForm.value.ownerName) {
      filter = filter + ',' + 'qcPersonFirstName @=' + this.qcForm.value.ownerName;
    } if (this.qcForm.value.clientName) {// && this.qcForm.get('clientName')?.valid) {
      filter = filter + ',' + 'clientName @=' + this.qcForm.value.clientName;
    } if (this.qcForm.value.clientRefNo) {
      filter = filter + ',' + 'clientRefNo @=' + this.qcForm.value.clientRefNo;
    } if (this.qcForm.value.compName) {// && this.qcForm.get('compName')?.valid) {
      filter = filter + ',' + 'ComponentName @=' + this.qcForm.value.compName;
    } if (this.qcForm.value.candidateName) {
      filter = filter + ',' + 'firstName @=' + this.qcForm.value.candidateName;
    }
    if (exFlag == true || this.showallFlag == true) {
      this.userData.applyPaging = false;
    } else {
      this.userData.applyPaging = true;
    }
    this.userData.pageSize = this.shievePageSize;
    this.userData.page = this.shievePageNo;
    this.userData.filters = filter
    this.userData.sorts = '';

    this.userData.needTotal = true;
  }
  mapQcdetails(exFlag: any) {
    this.userData.filters = '';
    if (exFlag) {
      this.qcExDetails.map(m => m.status = m.rejectFlag === true ? 'Rejected' : m.approvedFlag === true ? 'Approved' : 'Received');
      this.qcExDetails.map(m => m.componentName = (this.commonservice.getCompNameByIndex((m.componentName +
        (m.subCompName ? (' - ' + m.subCompName) : '')), m.compIndex, m.compMaxNo, m.subCompMaxNo)));
      this.qcExDetails.map(m => m.submittedBy = m.submittedByFirstName ? (m.submittedByFirstName + (m.submittedByMiddleName ?
        (' ' + m.submittedByMiddleName) : '') + (m.submittedByLastName ? (' ' + m.submittedByLastName) : '')) : null);
      this.qcExDetails.map(m =>
        m.ownerName = m.qcPersonFirstName ? (m.qcPersonFirstName + (m.qcPersonMiddleName ? (' ' + m.qcPersonMiddleName) : '') +
          (m.qcPersonLastName ? (' ' + m.qcPersonLastName) : '')) : null);
      this.qcExDetails.map(m =>
        m.candidateFullName = m.firstName + (m.middleName ? (' ' + m.middleName) : '') +
        (m.lastName ? (' ' + m.lastName) : ''));
      this.exportData();
    } else {
      this.qcDetails.map(m => m.status = m.rejectFlag === true ? 'Rejected' : m.approvedFlag === true ? 'Approved' : 'Received');
      this.qcDetails.map(m => m.componentName = (this.commonservice.getCompNameByIndex((m.componentName +
        (m.subCompName ? (' - ' + m.subCompName) : '')), m.compIndex, m.compMaxNo, m.subCompMaxNo)));
      this.qcDetails.map(m => m.submittedBy = m.submittedByFirstName ? (m.submittedByFirstName + (m.submittedByMiddleName ?
        (' ' + m.submittedByMiddleName) : '') + (m.submittedByLastName ? (' ' + m.submittedByLastName) : '')) : null);
      this.qcDetails.map(m =>
        m.ownerName = m.qcPersonFirstName ? (m.qcPersonFirstName + (m.qcPersonMiddleName ? (' ' + m.qcPersonMiddleName) : '') +
          (m.qcPersonLastName ? (' ' + m.qcPersonLastName) : '')) : null);
      this.qcDetails.map(m =>
        m.candidateFullName = m.firstName + (m.middleName ? (' ' + m.middleName) : '') +
        (m.lastName ? (' ' + m.lastName) : ''));
      this.initautoCompleteCtrl();
      // this.clientList = Array.from(new Map
      //   (this.qcDetails.map(x => ({ clientName: x.clientName }))
      //     .map(e => [e.clientName, e])).values());
      //   this.componentList = Array.from(new Map
      //     (this.qcDetails.map(x => ({ compName: x.componentName }))
      //       .map(e => [e.compName, e])).values());
      // this.candidateList = Array.from(new Map
      //   (this.qcDetails.map(x => ({ candidateFullName: x.candidateFullName })).filter(f => f.candidateFullName)
      //     .map(e => [e.candidateFullName, e])).values());
      // this.verificationIdList = Array.from(new Map
      //   (this.qcDetails.map(x => ({ verificationId: x.verificationId }))
      //     .map(e => [e.verificationId, e])).values());
      // this.clientReferenceIdList = Array.from(new Map
      //   (this.qcDetails.map(x => ({ clientRefNo: x.clientRefNo }))
      //     .map(e => [e.clientRefNo, e])).values());
      // this.userList = Array.from(new Map
      //   (this.qcDetails.map(x => ({ ownerName: x.ownerName })).filter(f => f.ownerName !== null)
      //     .map(e => [e.ownerName, e])).values());
      // this.getDelayHours();
    }
    this.dupList = this.commonservice.CloneObject(this.qcDetails);
  }
  getDelayHours() {
    this.qcDetails.forEach(element => {
      const todayDate = new Date();
      element.receivedDate = new Date(element.receivedDate);
      const day = element.receivedDate.getDay();
      const hrs = element.receivedDate.getHours();
      const min = element.receivedDate.getMinutes();
      const val = Math.floor((Date.UTC(todayDate.getDay(), todayDate.getHours(), todayDate.getMinutes()) - Date.UTC(element.
        receivedDate.getDay(), element.receivedDate.getHours(), element.receivedDate.getMinutes())) / (1000 * 60 * 60 * 24));
    });
  }
  removeSearchValue(key, index) {
    // tslint:disable-next-line: forin
    this.searchValueArr.splice(index, 1);
    // tslint:disable-next-line: forin
    for (const ctrl in this.qcForm.controls) {
      if (ctrl === key) {
        this.qcForm.get(ctrl).setValue('');
      }
    }
  }
  getFilterLen(c): string {
    this.filterLength = c;
    return 'listrow';
  }
  backToDashboard() {
    this.router.navigate(['dashboard/home']);
  }
  sortBy(type: any) {
    this.isDesc = !this.isDesc;
    this.column = type;
    this.direction = this.isDesc ? 1 : -1;
  }
  getPage(event: any) {
    this.page = event;
  }
  getTotalPage(): number {
    if (this.qcDetails.length) {
      return Math.ceil(this.qcDetails.length / this.itemPerPage);
    }
  }
  preventInfinite() {
    if (!this.itemPerPage) {
      this.itemPerPage = 1;
    }
  }
  initFormGroup() {
    this.qcForm = new UntypedFormGroup({
      clientName: new UntypedFormControl(null),
      verificationId: new UntypedFormControl(null),
      clientRefNo: new UntypedFormControl(null),
      candidateName: new UntypedFormControl(null),
      compName: new UntypedFormControl(null),
      vendorName: new UntypedFormControl(null),
      statusName: new UntypedFormControl(null),
      ownerName: new UntypedFormControl(null),
      receivedFromDate: new UntypedFormControl(null),
      receivedToDate: new UntypedFormControl(null),
    });
    this.initautoCompleteCtrl();
    this.qcApproveForm = this.fb.group({
      rejectFlag: [false],
      approvedFlag: [false],
      screeningCompId: [0],
      screeningId: [0],
      finalQcFlag: [false],
      qcCompTransId: [0],
      //finalQcTransId: [this.qcDetails.finalQcTransId],
      loggedIn: [this.userData.userId],
      remarks: [''], // Validators.required
      clientId: [0],
      siteId: [0],
      clientName: [''],
      referenceNo: [''],
      candidateName: [''],
      colorCode: [''],
      iQcByPassFlag: [],
      caseNo: [0],
      document: null
    });
  }
  initautoCompleteCtrl() {
    // this.componentControl = new AutoCompleteDropDown('Component Name', 'compName', 'id', 'name', this.componentList,
    //   '', this.qcForm, false, false, false, 'standard');
    // this.clientControl = new AutoCompleteDropDown('Client Name', 'clientName', 'id', 'name', this.clientList,
    //   '', this.qcForm, false, false, false, 'standard');

    // // this.componentControl = new AutoCompleteDropDown('Component Name', 'compName', 'componentName', 'componentName', this.componentList,
    // //   '', this.qcForm, false, false, false, 'standard');
    // this.vendorControl = new AutoCompleteDropDown('Vendor Name', 'vendorName', 'vendorName', 'vendorName', this.vendorList,
    //   '', this.qcForm, false, false, false);
    // // this.clientControl = new AutoCompleteDropDown('Client Name', 'clientName', 'clientName', 'clientName', this.clientList,
    // //   '', this.qcForm, false, false, false, 'standard');
    // this.statusControl = new AutoCompleteDropDown('Status Name', 'statusName', 'statusName', 'statusName', this.statusList,
    //   '', this.qcForm, false, false, false);
    // this.userControl = new AutoCompleteDropDown('QC Person Name', 'ownerName', 'ownerName', 'ownerName', this.userList,
    //   '', this.qcForm, false, false, false, 'standard');
    // this.verificationControl = new AutoCompleteDropDown('Verification ID', 'verificationId', 'verificationId', 'verificationId',
    //   this.verificationIdList, '', this.qcForm, false, false, false, 'standard');
    // this.clientRefControl = new AutoCompleteDropDown('Client Ref ID', 'clientRefNo', 'clientRefNo', 'clientRefNo',
    //   this.clientReferenceIdList, '', this.qcForm, false, false, false, 'standard');
    // this.candidateControl = new AutoCompleteDropDown('Candidate Name', 'candidateName', 'candidateFullName', 'candidateFullName',
    //   this.candidateList, '', this.qcForm, false, false, false, 'standard');
  }
  getPropertyValue(event: any) {
    if (event.value !== '' && event.value !== null) {
      if (this.searchValueArr.length > 0) {
        if (this.searchValueArr.filter(x => x.propertyName === event.propertyName && x.value === event.value).length === 0) {
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
      for (const ctrl in this.qcForm.controls) {
        if (ctrl === event.propertyName) {
          const index = this.searchValueArr.findIndex(x => x.propertyName === ctrl);
          if (index > -1) {
            this.searchValueArr.splice(index, 1);
          }
        }
      }
    }
  }
  resetFilterSort() {
    this.qcForm.reset();
    this.searchValueArr = [];
    this.fromDate = '';
    this.toDate = '';
    this.shievePageNo = 1;
    this.qcDetails = this.dupList;
    this.getQcDetails(this.qcService.approveOrRejectType, false);
    // this.column = '';
  }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }
  showTopCenterNew(level: string, info: string, message: string): Promise<void> {
    return new Promise((resolve) => {
      this.message.add({
        severity: level,
        summary: info,
        detail: message,
        life: 4000 // 2 seconds toast life
      });

      setTimeout(() => resolve(), 2000); // Resolve after toast disappears
    });
  }

  search() {
    if (this.qcForm.value.clientName || this.qcForm.value.clientRefNo || this.qcForm.value.compName
      || this.qcForm.value.candidateName || this.qcForm.value.componentStatus ||
      this.qcForm.value.vendorName || this.qcForm.value.verificationId || this.qcForm.value.ownerName) {
      this.shievePageNo = 1;
      this.getQcDetails(this.qcService.approveOrRejectType, false);

    } else {
      this.showTopCenter('warn', 'Failure Message', 'Choose filter values to search');
    }
  }
  getRecordBydate(fDate, tDate) {
    if (fDate && tDate) {
      this.qcDetails = this.dupList;
      const FromDate = this.datePipe.transform(fDate, 'yyyy-MM-dd');
      const ToDate = this.datePipe.transform(tDate, 'yyyy-MM-dd');
      this.qcDetails.map(d => d.receivedDate = this.datePipe.transform(d.receivedDate, 'yyyy-MM-dd'));
      this.qcDetails = this.dupList.filter(x => x.receivedDate >= FromDate && x.receivedDate <= ToDate);
    }
  }
  exportExcel() {
    this.getQcDetails(this.qcService.approveOrRejectType, true);

  }
  exportData() {
    if (this.qcService.approveOrRejectType.includes('Individual QC Approved') ||
      (this.qcService.approveOrRejectType.includes('Today Individual QC Approved'))) {
      this.qcColumn.push({ field: 'componentName', header: 'Component Name' },
        // { field: 'functionalEntity', header: 'Functional Entity' },
        { field: 'verificationId', header: 'Verification Id' },
        { field: 'submittedBy', header: 'Approved By' },
        { field: 'receivedDate', header: 'Approved Date & Time' });
    }
    else if (this.qcService.approveOrRejectType.includes('Final QC Rejected')) {
      this.qcColumn.push({ field: 'submittedBy', header: 'Rejected By' },
        { field: 'inProgressDays', header: 'In Progress Days ' },
        { field: 'tatStatus', header: 'TAT Status' },
        { field: 'receivedDate', header: 'Rejected Date & Time' });
    }
    else if (this.qcService.approveOrRejectType.includes('Individual QC Rejected')) {
      this.qcColumn.push({ field: 'submittedBy', header: 'Rejected By' },
        { field: 'componentName', header: 'Component Name' },
        // { field: 'functionalEntity', header: 'Functional Entity' },
        { field: 'verificationId', header: 'Verification Id' },
        { field: 'receivedDate', header: 'Rejected Date & Time' });
    }
    else if (this.qcService.approveOrRejectType.includes('Final QC Approved') ||
      (this.qcService.approveOrRejectType.includes('Today Final QC Approved'))
      ||
      (this.qcService.approveOrRejectType.includes('Final Report Not Sent'))

    ) {
      this.qcColumn.push({ field: 'submittedBy', header: 'Approved By' },
        { field: 'inProgressDays', header: 'In Progress Days ' },
        { field: 'tatStatus', header: 'TAT Status' },
        { field: 'receivedDate', header: 'Approved Date & Time' });
    }
    this.commonservice.exportToExcel(this.qcColumn, this.qcExDetails, this.qcService.approveOrRejectType);
  }
  showall() {
    this.itemPerPage = this.qcDetails.length;
  }
}
