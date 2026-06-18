import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { ReportService } from 'src/app/common-methods/services/report.service';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { InvoiceService } from 'src/app/common-methods/services/invoice.service';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { Router } from '@angular/router';
import { MatDialog,  } from '@angular/material/dialog';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';

import { EmailHistorySearchVm, FileLevelTrackerVm } from 'src/app/common-methods/models/verification';
import { DatePipe } from '@angular/common';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Status } from 'src/app/common-methods/models/status';

@Component({
  standalone: false,
  selector: 'app-file-level-tracker',
  templateUrl: './file-level-tracker.component.html',
  styleUrls: ['./file-level-tracker.component.css']
})
export class FileLevelTrackerComponent implements OnInit {
  screenAuth: any = {};
  userData: any;
  routePath = 'Reports / Report Tracker / File Level Tracker';
  maxDate = new Date();
  iQCApprovedDateInFLTFlaglst :any;
  reportList: any[] = [];
  fileLevelTrackerFilterForm: UntypedFormGroup;
  clientNameList: any[] = [];
  componentControl!: AutoCompleteDropDown;
  clientNameControl!: AutoCompleteDropDown;
  caseStatusControl!: AutoCompleteDropDown;
  caseRefNoControl:AutoCompleteDropDown;
  candidateControl!: AutoCompleteDropDown;
  searchValueArr: any[] = [];
  clientList: any[] = [];
  components: any[] = [];
  caseRefList: any[] = [];
  reportCandidateList: any[] = [];
  requestFileLevelTrackerVm:any = new FileLevelTrackerVm();
  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  EXCEL_EXTENSION = '.xlsx';
  btnExcelExport = true;
 @ViewChild('global', { static: true }) global!: ElementRef<any>;
  skipfirst: Boolean;
  excelDataList: any[] = [];
  status=[
    {value: 'Open', viewValue: 'Open'},
    {value: 'Pending', viewValue: 'Pending'},
    {value: 'Completed', viewValue: 'Completed'},
  ];
  defaultColumnOne = [
    { field: 'candidateName', header: 'CANDIDATE NAME' },
    { field: 'clientName', header: 'Client Name' },
    { field: 'siteName', header: 'Site Name' },
    { field: 'package', header: 'PACKAGE' },
    { field: 'clientRefNo', header: 'REFERENCE NO' },
    { field: 'emailId', header: 'EmailId' },
    { field: 'contactNumber', header: 'Contact Number' },
    { field: 'applicantId', header: 'APPLICANT ID' },
    { field: 'dob', header: 'DOB' },
    { field: 'caseReceivedDate', header: 'RECEIVED DATE' },
    { field: 'caseInititationDate', header: 'INITIATION DATE' },
    { field: 'caseDueDate', header: 'CASE DUE DATE' },
    { field: 'lastInsuffClearedDate', header: 'LAST INSUFF CLEARED DATE' },
    { field: 'component', header: 'COMPONENT' },
    { field: 'userName', header: 'USER NAME' },
  ];
  defaultColumnTwo = [
    { field: 'caseStatus', header: 'CASE STATUS' },
    { field: 'ClientScreeningId', header: 'ScreeningId' },
    { field: 'submissionOwner', header: 'Submitted By' },
    { field: 'dePreqcOwner', header: 'De Preqc Owner' },
    { field: 'screeningOwner', header: 'Screening Owner' },

    { field: 'finalReportStatus', header: 'FR STATUS' },
    { field: 'finalReportColorcode', header: 'FR COLOR CODE' },
    // { field: 'finalReportRemarks', header: 'FR REMARKS' },
    { field: 'finalReportSendDate', header: 'FR SEND DATE' },
    { field: 'finalReportTat', header: 'FR TAT' },
    { field: 'finalReportTatStatus', header: 'FR TAT STATUS' },
    { field: 'finalReportDelayReason', header: 'FR DELAY REASON' },
    { field: 'supplementaryReportStatus', header: 'SR STATUS' },
    { field: 'supplementaryColorCode', header: 'SR COLOR CODE' },
    // { field: 'supplementaryRemarks', header: 'SR REMARKS' },
    { field: 'supplementarySendDate', header: 'SR SEND DATE' },
    { field: 'supplementaryTatDay', header: 'SR TAT DAY' },
    { field: 'supplementaryTatStatus', header: 'SR TAT STATUS' },
    { field: 'supplementaryDelayReason', header: 'SR DELAY REASON' },
    { field: 'invoiceNumber', header: 'INVOICE NUMBER' },
    { field: 'invoiceDate', header: 'INVOICE DATE' },
    { field: 'ReOpenDate', header: 'RE OPEN DATE' },
    { field: 'SubCheckDueDate', header: 'SUB CHECK DUE DATE' },
    { field: 'siteName', header: 'BGV TYPE' },
    { field: 'vendorRequestID', header: 'VENDOR REQUEST ID' },
    { field: 'candidateID', header: 'CANDIDATE ID' },
    { field: 'employeeID', header: 'EMPLOYEE ID' },
    { field: 'location', header: 'LOCATION' },
    { field: 'invoiceAmount', header: 'Invoice Amount' },
    { field: 'country', header: 'Country' },
  ];
  fileLevelTrackerlist: any[] = [];
  selectedRow: any;
  screeningId: number;
  frozenCols = [{ field: 'clientName', header: 'CLIENT NAME' }, { field: 'siteName', header: 'SITE' }];
 @ViewChild('dtSeventhDayTracker', { static: true }) dtSeventhDayTracker: Table;
  extraCols: any[];
  pageSize: number = 10;
  pageNo: number = 1;
  totalPages: any;
  needTotal: boolean = true;
  filelevelcandidateList: any;
  filelevelClientno: any;
  constructor(public screeningService: ScreeningService, public master: MasterService, public auth: AuthService, private authService: AuthService, public common: CommonService,
    public router: Router, public dialog: MatDialog, private reportService: ReportService,
    public invoiceService: InvoiceService, private datePipe: DatePipe,private message: MessageService) {
  }
  ngOnInit() {
    this.screenAuth = this.authService.getScreenAuth(this.router.url);
    this.userData = this.auth.userdata;
    this.getInvoiceClient();
    this.initFormGroup();
    this.getFileLevelTrackerList();
  }
  onChange(pageIndex: number | null) {
    console.log(pageIndex);
    this.getFileLevelTrackerList();
  }
  onPageChange(event: any) {
    this.needTotal = true;
    this.pageNo = event.pageIndex + 1;
    this.getFileLevelTrackerList();
  }

  initFormGroup() {
    this.fileLevelTrackerFilterForm = new UntypedFormGroup({
      clientName: new UntypedFormControl(null),
      fromDate: new UntypedFormControl(null, Validators.required),
      toDate: new UntypedFormControl(null, Validators.required),
      candidateName: new UntypedFormControl(null),
      clientRefNo: new UntypedFormControl(null),
      component: new UntypedFormControl(null),
      caseStatus:new UntypedFormControl(null, Validators.required)
    });
    this.selectedRow = null;
    this.fileLevelTrackerlist = null;
    this.initautoCompleteCtrl();
  }
  ngOnDestroy(): void {
    this.common.hide = false;
  }
  initautoCompleteCtrl() {
    this.clientNameControl = new AutoCompleteDropDown('Client Name', 'clientId', 'clientId', 'clientName', this.clientList,
      '', this.fileLevelTrackerFilterForm, false, false, false, 'standard');
    this.componentControl = new AutoCompleteDropDown('Component Name', 'component', 'id', 'name', this.components,
      '', this.fileLevelTrackerFilterForm, false, false, false, 'standard');
    this.caseRefNoControl = new AutoCompleteDropDown('Client Ref Number', 'clientRefNo', 'name', 'name', this.filelevelClientno,
      '', this.fileLevelTrackerFilterForm, false, false, false, 'standard');
    this.candidateControl = new AutoCompleteDropDown('Candidate Name', 'candidateName', 'id',
      'name', this.filelevelcandidateList, '', this.fileLevelTrackerFilterForm, false, false, false, 'standard');
      this.caseStatusControl = new AutoCompleteDropDown('Case Status', 'caseStatus', 'value', 'value', this.status,
      '', this.fileLevelTrackerFilterForm, false, false, false, 'standard');
  }
  getInvoiceClient() {
    this.invoiceService.getInvoiceClient(this.userData.clientId).subscribe(res => {
      if (res) {
        this.clientList = res;
      }
    });
    this.screeningService.getComponents(this.userData).subscribe(res => {
      if (res) {
        this.components = res;
      }
    });
  }
  resetfrom() {
    this.fileLevelTrackerFilterForm.reset();
    this.initFormGroup();
    this.pageNo = 1;
    this.totalPages = 0;
    if (this.fileLevelTrackerFilterForm.get('fromDate')?.value != null && this.fileLevelTrackerFilterForm.get('toDate')?.value != null) {
      this.fileLevelTrackerFilterForm.get('fromDate')?.setValue(new Date(this.fileLevelTrackerFilterForm.get('toDate')?.value.getFullYear(),
        this.fileLevelTrackerFilterForm.get('toDate')?.value.getMonth(), this.fileLevelTrackerFilterForm.get('toDate')?.value.getDate() - 7));
    }
    this.requestFileLevelTrackerVm.clientId = 0;
    this.screeningId = 0;
    this.getFileLevelTrackerList();
  }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }
  searchValue() {
    this.screeningId = 0;
    if (this.fileLevelTrackerFilterForm.valid) {
      this.getFileLevelTrackerList();

    }
    else {
    
     this.showTopCenter('warn', 'Failure Message', 'Choose filter values to search');
      this.fileLevelTrackerFilterForm.markAllAsTouched();

    }
  }
  applyPagination() {
    this.requestFileLevelTrackerVm.pageSize = this.pageSize;
    this.requestFileLevelTrackerVm.page = this.pageNo;
    this.requestFileLevelTrackerVm.filters = "";
    this.requestFileLevelTrackerVm.sorts = '';
    this.requestFileLevelTrackerVm.applyPaging = true;
    this.requestFileLevelTrackerVm.needTotal = this.needTotal;
  }
  getFileLevelTrackerList() {
    this.screeningId = 0;
    const currentDateTime = new Date();
    const fromDate = this.fileLevelTrackerFilterForm.get('fromDate')?.value ? new Date(this.fileLevelTrackerFilterForm.get('fromDate')?.value) : null;

    if (this.fileLevelTrackerFilterForm.get('fromDate')?.value != null) {
      fromDate.setHours(5, 0, 0, 0);
    }
    const toDate = this.fileLevelTrackerFilterForm.get('toDate')?.value ? new Date(this.fileLevelTrackerFilterForm.get('toDate')?.value) : null;

    if (this.fileLevelTrackerFilterForm.get('toDate')?.value != null) {
      toDate.setHours(22, 59, 59, 999);
    }
    
    this.iQCApprovedDateInFLTFlaglst = this.fileLevelTrackerFilterForm.get('clientName')?.value ?
    this.fileLevelTrackerFilterForm.controls.clientName.value : [];
    if(this.iQCApprovedDateInFLTFlaglst.length>0){
    this.iQCApprovedDateInFLTFlaglst = this.iQCApprovedDateInFLTFlaglst.filter(w=>w.iqcApprovedDateInFLTFlag == true);
    }else if (this.iQCApprovedDateInFLTFlaglst ==0){
     this.iQCApprovedDateInFLTFlaglst = this.clientList;
     this.iQCApprovedDateInFLTFlaglst = this.iQCApprovedDateInFLTFlaglst.filter(w=>w.iqcApprovedDateInFLTFlag == true);
    }
    this.requestFileLevelTrackerVm.fromDate = this.datePipe.transform(fromDate, 'yyyy-MM-dd');
    this.requestFileLevelTrackerVm.toDate = this.datePipe.transform(toDate, 'yyyy-MM-dd');
    this.requestFileLevelTrackerVm.compId = this.fileLevelTrackerFilterForm.get('component')?.value ?
      this.fileLevelTrackerFilterForm.controls.component.value.map(m => m.id) : [];
    this.requestFileLevelTrackerVm.clientId = this.fileLevelTrackerFilterForm.get('clientName')?.value ?
      this.fileLevelTrackerFilterForm.controls.clientName.value.map(m => m.clientId) : [];
      this.requestFileLevelTrackerVm.caseStatus= this.fileLevelTrackerFilterForm.get('caseStatus')?.value ? 
      this.fileLevelTrackerFilterForm.get('caseStatus')?.value:"";  
    this.requestFileLevelTrackerVm.loginUserDetVm = this.userData;
    this.requestFileLevelTrackerVm.screeningId = 0;
    this.applyPagination();
    this.reportService.GetFileLevelTrackerList(this.requestFileLevelTrackerVm).subscribe(resp => {
      if (resp) {
        this.totalPages = resp.headers.get('X-Total-Count');
        const res = resp.body;
        this.reportService.getDropDownFileLevelTracker(this.requestFileLevelTrackerVm).subscribe(res => {
          if (res) {
            this.filelevelcandidateList = res.candiadateName;
            this.filelevelClientno = res.clientReferenceId;
          }
        })
        this.getResp(res);
      }
    });
  }
  getResp(res: any) {
    this.screeningId = res.length > 0 ? res[0].screeningId : 0;
    res.map(m => m.candidateName = (m.firstName ? m.firstName : '') + (m.middleName ? (' ' + m.middleName) : '') + (m.lastName ? (' ' + m.lastName) : ''));
    this.fileLevelTrackerlist = this.common.CloneObject(res);
    this.getFileLevelTrackerDetails(this.screeningId);
    this.searchControl();
  }
  getFileLevelTrackerDetails(screeningId: number) {
    this.screeningId = 0;
    if (screeningId != 0) {
      const currentDateTime = new Date();
      const fromDate = this.fileLevelTrackerFilterForm.get('fromDate')?.value ? new Date(this.fileLevelTrackerFilterForm.get('fromDate')?.value) : null;
      if (this.fileLevelTrackerFilterForm.get('fromDate')?.value != null)
        fromDate.setHours(5, 0, 0, 0);
      const toDate = this.fileLevelTrackerFilterForm.get('toDate')?.value ? new Date(this.fileLevelTrackerFilterForm.get('toDate')?.value) : null;
      if (this.fileLevelTrackerFilterForm.get('toDate')?.value != null)
        toDate.setHours(22, 59, 59, 999);

      this.requestFileLevelTrackerVm.fromDate = this.datePipe.transform(fromDate, 'yyyy-MM-dd');
      this.requestFileLevelTrackerVm.toDate = this.datePipe.transform(toDate, 'yyyy-MM-dd');

      this.requestFileLevelTrackerVm.compId = this.fileLevelTrackerFilterForm.get('component')?.value ?
        this.fileLevelTrackerFilterForm.controls.component.value.map(m => m.id) : [];
      this.requestFileLevelTrackerVm.clientId = this.fileLevelTrackerFilterForm.get('clientName')?.value ?
        this.fileLevelTrackerFilterForm.controls.clientName.value.map(m => m.clientId) : [];
      this.requestFileLevelTrackerVm.loginUserDetVm = this.userData;
      this.requestFileLevelTrackerVm.screeningId = screeningId;
      this.reportService.GetFileLevelTrackerDetails(this.requestFileLevelTrackerVm).subscribe(resp => {
        resp.map(m => m.candidateName = (m.firstName ? m.firstName : '') + (m.middleName ? (' ' + m.middleName) : '') + (m.lastName ? (' ' + m.lastName) : ''));
        var fileLevelTrackerlist = this.common.CloneObject(resp);
        this.selectedRow = fileLevelTrackerlist.find(f => f.screeningId === screeningId);

        // this.selectedRow = this.common.CloneObject(resp);
      });
    }
  }

  getFileLevelTrackerListExport() {
    const currentDateTime = new Date();
    const fromDate = this.fileLevelTrackerFilterForm.get('fromDate')?.value ? new Date(this.fileLevelTrackerFilterForm.get('fromDate')?.value) : null;
    if (this.fileLevelTrackerFilterForm.get('fromDate')?.value != null)
      fromDate.setHours(5, 0, 0, 0);

    const toDate = this.fileLevelTrackerFilterForm.get('toDate')?.value ? new Date(this.fileLevelTrackerFilterForm.get('toDate')?.value) : null;
    if (this.fileLevelTrackerFilterForm.get('toDate')?.value != null)
      toDate.setHours(22, 59, 59, 999);

    this.requestFileLevelTrackerVm.fromDate = this.datePipe.transform(fromDate, 'yyyy-MM-dd');
    this.requestFileLevelTrackerVm.toDate = this.datePipe.transform(toDate, 'yyyy-MM-dd');


    this.requestFileLevelTrackerVm.compId = this.fileLevelTrackerFilterForm.get('component')?.value ?
      this.fileLevelTrackerFilterForm.controls.component.value.map(m => m.id) : [];
    this.requestFileLevelTrackerVm.clientId = this.fileLevelTrackerFilterForm.get('clientName')?.value ?
      this.fileLevelTrackerFilterForm.controls.clientName.value.map(m => m.clientId) : [];
      this.requestFileLevelTrackerVm.caseStatus= this.fileLevelTrackerFilterForm.get('caseStatus')?.value ? 
      this.fileLevelTrackerFilterForm.get('caseStatus')?.value:"";  
    this.requestFileLevelTrackerVm.loginUserDetVm = this.userData;
    this.reportService.GetSeventhDayTracker(this.requestFileLevelTrackerVm).subscribe(resp => {
      this.selectedRow = resp.length > 0 ? resp[0] : null;
      resp.map(m => m.candidateName = (m.firstName ? m.firstName : '') + (m.middleName ? (' ' + m.middleName) : '') + (m.lastName ? (' ' + m.lastName) : ''));
      this.fileLevelTrackerlist = this.common.CloneObject(resp);
      this.excelDataList = this.common.CloneObject(resp);
      const columnList=['dePreqcOwner','screeningOwner','submissionOwner']
      this.excelDataList.forEach(element => {
        
        //element.caseReceivedDate=this.datePipe.transform(this.common.getTimezoneOffset(element.caseReceivedDate,true),'dd/MMM/yyyy')
        //element.caseInititationDate=this.datePipe.transform(this.common.getTimezoneOffset(element.caseInititationDate,true),'dd/MMM/yyyy')
        element.caseReceivedDate = this.datePipe.transform(this.common.getTimezoneOffset(element.caseReceivedDate, false), 'dd/MMM/yyyy')
        element.caseInititationDate = this.datePipe.transform(this.common.getTimezoneOffset(element.caseInititationDate, false), 'dd/MMM/yyyy')
        element.caseDueDate = this.datePipe.transform(this.common.getTimezoneOffset(element.caseDueDate, false), 'dd/MMM/yyyy')
        //Ajith:-Request to add columns to File level tracker | CTS client
        element.doj = element.doj !== "" ? this.datePipe.transform(this.common.getTimezoneOffset(element.doj, false), 'dd/MMM/yyyy') :'N/A';
       
          columnList.forEach(ele => {
            if (ele === 'dePreqcOwner' || ele === 'screeningOwner' || ele === 'submissionOwner' ) {
              element[ele] = element[ele].firstName ? (element[ele].firstName + (element[ele].middleName ?
                (' ' + element[ele].middleName) : '') + (element[ele].lastName ? (' ' + element[ele].lastName) : '')) : 'N/A';
            }
          });
        element.componentSeventhDayReportVm.map(m => m.componentName = (this.getCompNameByIndex((m.componentName +
          (m.subCompName ? (' - ' + m.subCompName) : '')), m.compIndex, m.compMaxNo, m.subCompMaxNo)));
        element.component = element.component.map(m => m = (m.subCompName ? (m.componentName + ' - ' + m.subCompName + ' - ' + m.count)
          : m.componentName + ' - ' + m.count)).join(',');
          
      });

      const dataOriginal = this.common.CloneObject(this.excelDataList);
      this.extraCols = [];
      const newData = this.getDynamicColumns(this.common.CloneObject(dataOriginal));
      this.extraCols = this.extraCols.filter((e, i, a) => i === a.indexOf(e));
      let cols: any[] = [];
      this.extraCols.forEach(element => {
        cols.push({ field: element.trim().replace(/\s/g, ''), header: element.split(/(?=[A-Z])/).join(' ') });
      });
      if(this.selectedRow.clientCategoryId===4){
      this.defaultColumnTwo.push({ field: 'bvspocName', header: 'BV SPOC Name' },
      { field: 'joiningLocation', header: 'Joining Location' },
      { field: 'recruiter', header: 'Recruiter' });
      };
      //Ajith:-Request to add columns to File level tracker | CTS client
      if (this.selectedRow !== null && this.selectedRow.clientCategoryId === 3) {
        this.defaultColumnTwo.push({ field: 'projectId', header: 'Project ID' },
          { field: 'projectName', header: 'Project Name' },
          { field: 'accountName', header: 'Account name' },
          { field: 'doj', header: 'DOJ' });
      };
      const header = this.defaultColumnOne.concat(cols).concat(this.defaultColumnTwo);
      const workbook = new Workbook();
      this.getWorkSheet(workbook, header, newData, 'File Level Tracker');
      workbook.xlsx.writeBuffer().then((data1) => {
        const blob = new Blob([data1], { type: this.EXCEL_TYPE });
        fs.saveAs(blob, 'File Level Tracker');
      });

    });
  }

  getCompNameByIndex(name, index, comp, sub) {
    let compName = '';
    if (name.toLowerCase() === this.common.EMPLOYMENT_HR.toLowerCase()) {
      compName = name + ' ( ' + (index === 1 ? 'Current/Last Employment' : ('Previous Employment ' + (index - 1))) + ' ) ';
    } 
    else if(name.toLowerCase() === this.common.CURRENT_EMPLOYMENT_HR.toLowerCase() || name.toLowerCase() === this.common.PREVIOUS_EMPLOYMENT_HR.toLowerCase()) {
      compName = name + ' ' + index;
    }
    else {
      if (!(comp > 0) && !(sub > 0)) {
        compName = name + ' ' + index;
      } else {
        compName = name;
      }
    }
    return compName;
  }

  searchControl() {
    this.caseRefList = Array.from(new Map
      (this.fileLevelTrackerlist.map(x => ({ clientRefNo: x.clientRefNo }))
        .map(e => [e.clientRefNo, e])).values());
    this.reportCandidateList = Array.from(new Map
      (this.fileLevelTrackerlist.map(x => ({ candidateName: x.candidateName }))
        .map(e => [e.candidateName, e])).values());
    this.caseRefNoControl = new AutoCompleteDropDown('Client Ref Number', 'clientRefNo', 'name', 'name', this.filelevelClientno,
      '', this.fileLevelTrackerFilterForm, false, false, false, 'standard');
    this.candidateControl = new AutoCompleteDropDown('Candidate Name', 'candidateName', 'id', 'name', this.filelevelcandidateList, '', this.fileLevelTrackerFilterForm, false, false, false, 'standard');
  }

  selectDetail(screeningId: any) {
    this.screeningId = 0;
    this.getFileLevelTrackerDetails(screeningId);
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
      for (const ctrl in this.fileLevelTrackerFilterForm.controls) {
        if (ctrl === event.propertyName) {
          const index = this.searchValueArr.findIndex(x => x.propertyName === ctrl);
          this.searchValueArr.splice(index, 1);
        }
      }
    }
  }

  getclass(status: string): string {
    return status.startsWith('Close') ? 'green' : 'red';
  }


  exportAsExcelFile() {
    this.getFileLevelTrackerListExport();

  }

  getDynamicColumns(data: any) {
    const list1 = ['FunctionalEntity', 'Status'];
    const list2 = ['InsuffRaisedDate', 'InsuffClearedDate', 'InsuffLevel', 'InsuffRemarks'];
    if(this.iQCApprovedDateInFLTFlaglst.length>0){
      list1.push('ApprovedDate');
    }

    data.forEach(element => {
      element.componentSeventhDayReportVm.forEach(ele => {
        const properties = Object.getOwnPropertyNames(ele);
        properties.forEach(prop => {
          if (list1.some(s => s.toLowerCase() === prop.toLowerCase())) {
            const comp = ele.componentName.trim().replace(/\s/g, '');
            element[comp + prop] = ele[prop];
            // this.extraCols.push({field : comp + prop, header: (comp.split(/(?=[A-Z])/).join(' ') + ' ' + prop.split(/(?=[A-Z])/).join(' ')).toUpperCase()});
            this.extraCols.push(ele.componentName + ' ' + prop);
          }
        });

        ele.insuffSeventhDayReportVm.forEach(e => {
          const propertyNames = Object.getOwnPropertyNames(e);
          propertyNames.forEach(p => {
            if (list2.some(s => s.toLowerCase() === p.toLowerCase())) {
              const compName = ele.componentName.trim().replace(/\s/g, '');
              element[compName + p] = e[p];
              // this.extraCols.push({field : compName + p, header: (compName.split(/(?=[A-Z])/).join(' ') + ' ' + p.split(/(?=[A-Z])/).join(' ')).toUpperCase()});
              this.extraCols.push(ele.componentName + ' ' + p);
            }
          });
        });
      });
    });
    return data;
  }

  getWorkSheet(workbook, header, data, name) {
    if (data.length) {
      const worksheet = workbook.addWorksheet(name);
      const headerRow = worksheet.addRow(header.map(x => x = x.header));
      headerRow.eachCell((cell, number) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'D2691E' },
          bgColor: { argb: 'FF0000FF' },
        };
        cell.font = { name: 'Verdana', size: 9, bold: true, color: { argb: 'ffffff' } };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });
      data.forEach((element) => {
        const eachRow: any[] = [];
        header.forEach((headers) => {
          const value = element[headers.field] ? ((headers.field.includes('Date') && headers.field != 'dob' && headers.field != 'caseReceivedDate' && headers.field != 'caseInititationDate' && headers.field != 'caseDueDate') ? (this.datePipe.transform((this.common.
            getTimezoneOffset(element[headers.field], false)), 'dd/MM/yyyy hh:mm:ss a')) : element[headers.field]) : 'N/A';
          eachRow.push(value);
        });
        if (element.isDeleted === 'Y') {
          const deletedRow = worksheet.addRow(eachRow);
          deletedRow.eachCell((cell, number) => {
            cell.font = { name: 'Calibri', family: 4, size: 11, bold: false, strike: true };
          })
        } else {
          worksheet.addRow(eachRow).eachCell((cell, number) => {
            cell.font = { name: 'Verdana', size: 8, bold: false };
          });
        }
      });
      worksheet.columns.forEach(column => {
        column.width = 25;
      })
      worksheet.addRow([]);
    }
  }

}

