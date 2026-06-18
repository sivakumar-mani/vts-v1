import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { ReportService } from 'src/app/common-methods/services/report.service';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { InvoiceService } from 'src/app/common-methods/services/invoice.service';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
import { EmailHistorySearchVm } from 'src/app/common-methods/models/verification';
import { DatePipe } from '@angular/common';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

// class ExcelModel {
//   candidateName: string;
//   clientName: any;
//   package: any;
//   component: ListOne[];
//   clientRefNo: any;
//   applicantId: any;
//   dob: any;
//   caseReceivedDate: any;
//   caseInititationDate: any;
//   caseDueDate: any;
//   caseStatus: any;
//   finalReportStatus: any;
//   finalReportColorcode: any;
//   finalReportRemarks: any;
//   finalReportSendDate: any;
//   finalReportTat: any;
//   finalReportTatStatus: any;
//   finalReportDelayReason: any;
//   supplementaryReportStatus: any;
//   supplementaryColorCode: any;
//   supplementaryRemarks: any;
//   supplementarySendDate: any;
//   supplementaryTatDay: any;
//   supplementaryTatStatus: any;
//   supplementaryDelayReason: any;
//   invoiceNumber: any;
//   invoiceDate: any;
//   componentSeventhDayReportVm: ListTwo[];
// }
// class ListOne {
//   componentName: any;
//   subCompName: any;
// }
// class ListTwo {
//   functionalEntity: any;
//   status: any;
//   // insuffSeventhDayReportVm: ListTwoOne[];
// }
// class ListTwoOne {
//   raisedDate: any;
//   clearedDate: any;
//   insuffLevel: any;
//   remarks: any;
// }

@Component({
  standalone: false,
  selector: 'app-seventh-day-report',
  templateUrl: './seventh-day-report.component.html',
  styleUrls: ['./seventh-day-report.component.css']
})
export class SeventhDayReportComponent implements OnInit {
  screenAuth: any = {};
  userData: any;
  routePath = 'Reports / Report Tracker / File Level Tracker';
  maxDate = new Date();
  reportList: any[] = [];
  sevendayReportForm: UntypedFormGroup;
  clientNameList: any[] = [];
  componentControl!: AutoCompleteDropDown;
  clientNameControl!: AutoCompleteDropDown;
  caseRefNoControl!: AutoCompleteDropDown;
  candidateControl!: AutoCompleteDropDown;
  searchValueArr: any[] = [];
  clientList: any[] = [];
  components: any[] = [];
  caseRefList: any[] = [];
  reportCandidateList: any[] = [];
  emailHistorySearchVm = new EmailHistorySearchVm();
  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  EXCEL_EXTENSION = '.xlsx';
 @ViewChild('global', { static: true }) global!: ElementRef<any>;
  skipfirst: Boolean;
  excelDataList: any[] = [];
  defaultColumnOne = [
    { field: 'candidateName', header: 'CANDIDATE NAME' },
    { field: 'clientName', header: 'Client Name' },
    { field: 'package', header: 'PACKAGE' },
    { field: 'clientRefNo', header: 'REFERENCE NO' },
    { field: 'emailId', header: 'EmailId'},
    { field: 'contactNumber', header: 'Contact Number'},
    { field: 'applicantId', header: 'APPLICANT ID' },
    { field: 'dob', header: 'DOB' },
    { field: 'caseReceivedDate', header: 'RECEIVED DATE' },
    { field: 'caseInititationDate', header: 'INITIATION DATE' },
    { field: 'caseDueDate', header: 'CASE DUE DATE' },
    { field: 'lastInsuffClearedDate', header: 'LAST INSUFF CLEARED DATE' },
    { field: 'component', header: 'COMPONENT' },
  ];
  defaultColumnTwo = [
    { field: 'caseStatus', header: 'CASE STATUS' },
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
  ];
  OtheClientdefaultColumns = [
    { field: 'caseStatus', header: 'CASE STATUS' },
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
    { field: 'invoiceAmount', header: 'Invoice Amount' },
  ];

  // Column = [
  //   { field: 'candidateName', header: 'CANDIDATE NAME' },
  //   { field: 'clientName', header: 'Client Name' },
  //   { field: 'package', header: 'PACKAGE' },
  //   { field: 'component', header: 'COMPONENT' },
  //   { field: 'clientRefNo', header: 'REFERENCE NO' },
  //   { field: 'applicantId', header: 'APPLICANT ID' },
  //   { field: 'dob', header: 'DOB' },
  //   { field: 'caseReceivedDate', header: 'RECEIVED DATE' },
  //   { field: 'caseInititationDate', header: 'INITIATION DATE' },
  //   { field: 'caseDueDate', header: 'CASE DUE DATE' },
  //   // { field: 'componentSeventhDayReportVm', header: 'COMPONENT NAME' },
  //   // { field: 'componentSeventhDayReportVm', header: 'FUNCTIONAL ENTITY' },
  //   // { field: 'componentSeventhDayReportVm', header: 'COMPONENT STATUS' },
  //   // { field: 'componentSeventhDayReportVm', header: 'INSUFFICIENCY RAISED DATE & TIME' },
  //   // { field: 'componentSeventhDayReportVm', header: 'INSUFFICIENCY CLEARED DATE & TIME' },
  //   // { field: 'componentSeventhDayReportVm', header: 'INSUFFICIENCY LEVEL' },
  //   // { field: 'componentSeventhDayReportVm', header: 'INSUFFICIENCY LATEST REMARKS' },
  //   { field: 'caseStatus', header: 'CASE STATUS' },
  //   { field: 'finalReportStatus', header: 'FR STATUS' },
  //   { field: 'finalReportColorcode', header: 'FR COLOR CODE' },
  //   { field: 'finalReportRemarks', header: 'FR REMARKS' },
  //   { field: 'finalReportSendDate', header: 'FR SEND DATE' },
  //   { field: 'finalReportTat', header: 'FR TAT' },
  //   { field: 'finalReportTatStatus', header: 'FR TAT STATUS' },
  //   { field: 'finalReportDelayReason', header: 'FR DELAY REASON' },
  //   { field: 'supplementaryReportStatus', header: 'SR STATUS' },
  //   { field: 'supplementaryColorCode', header: 'SR COLOR CODE' },
  //   { field: 'supplementaryRemarks', header: 'SR REMARKS' },
  //   { field: 'supplementarySendDate', header: 'SR SEND DATE' },
  //   { field: 'supplementaryTatDay', header: 'SR TAT DAY' },
  //   { field: 'supplementaryTatStatus', header: 'SR TAT STATUS' },
  //   { field: 'supplementaryDelayReason', header: 'SR DELAY REASON' },
  //   { field: 'invoiceNumber', header: 'INVOICE NUMBER' },
  //   { field: 'invoiceDate', header: 'INVOICE DATE' }];
  seventhDayTrackerlist: any[] = [];
  selectedRow: any;
  frozenCols = [{ field: 'clientName', header: 'CLIENT NAME' }, { field: 'siteName', header: 'SITE' }];
 @ViewChild('dtSeventhDayTracker', { static: true }) dtSeventhDayTracker: Table;
  extraCols: any[];
  constructor(public screeningService: ScreeningService, public master: MasterService, public auth: AuthService, private authService: AuthService, public common: CommonService,
    public router: Router, public dialog: MatDialog, private reportService: ReportService,
    public invoiceService: InvoiceService, private datePipe: DatePipe) {
  }
  ngOnInit() {
    this.screenAuth = this.authService.getScreenAuth(this.router.url);
    this.userData = this.auth.userdata;
    this.getInvoiceClient();
    this.initFormGroup();
    this.getReportList();
  }
  initFormGroup() {
    this.sevendayReportForm = new UntypedFormGroup({
      clientName: new UntypedFormControl(null),
      fromDate: new UntypedFormControl(),
      toDate: new UntypedFormControl(),
      candidateName: new UntypedFormControl(null),
      clientRefNo: new UntypedFormControl(null),
      component: new UntypedFormControl(null)
    });
    //this.sevendayReportForm.get('fromDate')?.setValue(new Date(this.sevendayReportForm.get('toDate')?.value.getFullYear(),
    //this.sevendayReportForm.get('toDate')?.value.getMonth(), this.sevendayReportForm.get('toDate')?.value.getDate() - 7));
    this.initautoCompleteCtrl();
  }
  ngOnDestroy(): void {
    this.common.hide = false;
  }
  initautoCompleteCtrl() {
    this.clientNameControl = new AutoCompleteDropDown('Client Name', 'clientId', 'clientId', 'clientName', this.clientList,
      '', this.sevendayReportForm, false, false, false, 'standard');
    this.componentControl = new AutoCompleteDropDown('Component Name', 'component', 'id', 'name', this.components,
      '', this.sevendayReportForm, false, false, false, 'standard');
    this.caseRefNoControl = new AutoCompleteDropDown('Client Ref Number', 'clientRefNo', 'clientRefNo', 'clientRefNo', this.caseRefList,
      '', this.sevendayReportForm, false, false, false, 'standard');
    this.candidateControl = new AutoCompleteDropDown('Candidate Name', 'candidateName', 'candidateName',
      'candidateName', this.reportCandidateList, '', this.sevendayReportForm, false, false, false, 'standard');
  }
  getInvoiceClient() {
    this.invoiceService.getInvoiceClient(this.userData.clientId).subscribe(res => {
      if (res) {
        this.clientList = res;
        this.initautoCompleteCtrl();
      }
    });
    this.screeningService.getComponents(this.userData).subscribe(res => {
      if (res) {
        this.components = res;
        this.initautoCompleteCtrl();
      }
    });

  }
  resetfrom() {
    this.sevendayReportForm.reset();
    this.initFormGroup();
    this.sevendayReportForm.get('fromDate')?.setValue(new Date())
    this.sevendayReportForm.get('toDate')?.setValue(new Date())
    // if(this.sevendayReportForm.get('fromDate')?.value !=null &&this.sevendayReportForm.get('toDate')?.value!=null){
    // this.sevendayReportForm.get('sampledatePicker')?.reset()
    // this.sevendayReportForm.get('sampledatePicker1')?.reset()
    // }

    if (this.sevendayReportForm.get('fromDate')?.value != null && this.sevendayReportForm.get('toDate')?.value != null) {
      this.sevendayReportForm.get('fromDate')?.setValue(new Date(this.sevendayReportForm.get('toDate')?.value.getFullYear(),
        this.sevendayReportForm.get('toDate')?.value.getMonth(), this.sevendayReportForm.get('toDate')?.value.getDate() - 7));
    }
    this.emailHistorySearchVm.clientId = 0;
    this.getReportList();
  }
  searchValue() {
    if (this.sevendayReportForm.valid) {
      this.getReportList();
    }
  }
  getReportList() {
    const currentDateTime = new Date();
    const fromDate = this.sevendayReportForm.get('fromDate')?.value ? new Date(this.sevendayReportForm.get('fromDate')?.value) : null;
    // fromDate.setHours(currentDateTime.getHours());
    // fromDate.setMinutes(currentDateTime.getMinutes());
    // fromDate.setSeconds(currentDateTime.getSeconds());
    if (this.sevendayReportForm.get('fromDate')?.value != null) {
      fromDate.setHours(5, 0, 0, 0);
    }
    const toDate = this.sevendayReportForm.get('toDate')?.value ? new Date(this.sevendayReportForm.get('toDate')?.value) : null;
    // toDate.setHours(currentDateTime.getHours());
    // toDate.setMinutes(currentDateTime.getMinutes());
    // toDate.setSeconds(currentDateTime.getSeconds());
    if (this.sevendayReportForm.get('toDate')?.value != null) {
      toDate.setHours(22, 59, 59, 999);
    }

    this.emailHistorySearchVm.fromDate = this.datePipe.transform(fromDate, 'yyyy-MM-dd');;
    this.emailHistorySearchVm.toDate = this.datePipe.transform(toDate, 'yyyy-MM-dd');;

    this.emailHistorySearchVm.compId = this.sevendayReportForm.get('component')?.value ?
      this.sevendayReportForm.controls.component.value.map(m => m.id) : [];
    this.emailHistorySearchVm.clientId = this.sevendayReportForm.get('clientName')?.value ?
      this.sevendayReportForm.controls.clientName.value.map(m => m.clientId) : [];
    this.emailHistorySearchVm.loginUserDetVm = this.userData;
    this.reportService.GetSeventhDayTracker(this.emailHistorySearchVm).subscribe(resp => {
      this.selectedRow = resp.length > 0 ? resp[0] : null;
      // tslint:disable-next-line:max-line-length
      resp.map(m => m.candidateName = (m.firstName ? m.firstName : '') + (m.middleName ? (' ' + m.middleName) : '') + (m.lastName ? (' ' + m.lastName) : ''));
      this.seventhDayTrackerlist = this.common.CloneObject(resp);
      // this.seventhDayTrackerlist.map(m => m.finalReportTatStatus = (m.finalReportTatStatus === true ?
      // (m.caseDueDate < new Date()) ? 'BeyondTAT' : 'WithinTAT' : ''));
      this.excelDataList = this.common.CloneObject(resp);
      this.excelDataList.forEach(element => {
        element.caseReceivedDate = this.datePipe.transform(this.common.getTimezoneOffset(element.caseReceivedDate, false), 'dd/MMM/yyyy')
        element.caseInititationDate = this.datePipe.transform(this.common.getTimezoneOffset(element.caseInititationDate, false), 'dd/MMM/yyyy')
        element.caseDueDate = this.datePipe.transform(this.common.getTimezoneOffset(element.caseDueDate, false), 'dd/MMM/yyyy')
        element.componentSeventhDayReportVm.map(m => m.componentName = (this.getCompNameByIndex((m.componentName +
          (m.subCompName ? (' - ' + m.subCompName) : '')), m.compIndex, m.compMaxNo, m.subCompMaxNo)));
        // tslint:disable-next-line:max-line-length
        // element.component = element.component.map(m => m = (m.componentName + (m.subCompName ? m.subCompName : '')).trim().replace(/\s/g, ""));
        element.component = element.component.map(m => m = (m.subCompName ? (m.componentName + ' - ' + m.subCompName + ' - ' + m.count)
          : m.componentName + ' - ' + m.count)).join(',');
      });
      this.searchControl();
    });
  }
  getCompNameByIndex(name, index, comp, sub) {
    let compName = '';
    if (name.toLowerCase() === this.common.EMPLOYMENT_HR.toLowerCase()) {
      compName = name + ' ( ' + (index === 1 ? 'Current/Last Employment' : ('Previous Employment ' + (index - 1))) + ' ) ';
    } else {
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
      (this.seventhDayTrackerlist.map(x => ({ clientRefNo: x.clientRefNo }))
        .map(e => [e.clientRefNo, e])).values());
    this.reportCandidateList = Array.from(new Map
      (this.seventhDayTrackerlist.map(x => ({ candidateName: x.candidateName }))
        .map(e => [e.candidateName, e])).values());
    this.caseRefNoControl = new AutoCompleteDropDown('Client Ref Number', 'clientRefNo', 'clientRefNo', 'clientRefNo', this.caseRefList,
      '', this.sevendayReportForm, false, false, false, 'standard');
    this.candidateControl = new AutoCompleteDropDown('Candidate Name', 'candidateName', 'candidateName',
      'candidateName', this.reportCandidateList, '', this.sevendayReportForm, false, false, false, 'standard');
  }
  selectDetail(screeningId: any) {
    this.selectedRow = this.seventhDayTrackerlist.find(f => f.screeningId === screeningId);
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
      for (const ctrl in this.sevendayReportForm.controls) {
        if (ctrl === event.propertyName) {
          const index = this.searchValueArr.findIndex(x => x.propertyName === ctrl);
          this.searchValueArr.splice(index, 1);
        }
      }
    }
  }
  // exportAsExcelFile1() {
  //   // export to excel file
  //   let tabtext = '<table border="1px">';
  //   // var textRange;
  //   let j = 0;
  //   const header = this.Column;
  //   const filteredValue = this.seventhDayTrackerlist;
  //   const lines = filteredValue.length;
  //   let headerColos = '';
  //   let objRow = '';
  //   let subRow = '';
  //   // the first headline of the table
  //   if (lines > 0) {
  //     header.forEach(h => {
  //       headerColos = headerColos + '<th bgcolor="#D2691E" style="font-size:15px;color:white">' + h.header + '</th>';
  //     });
  //     tabtext = tabtext + '<tr>' + headerColos + '</tr>';
  //   }
  //   for (j = 0; j < lines; j++) {
  //     //
  //     for (let m = 0; m < filteredValue[j].componentSeventhDayReportVm.length; m++) {
  //       const val = filteredValue[j].componentSeventhDayReportVm[m].insuffSeventhDayReportVm.length > 0 ?
  //         filteredValue[j].componentSeventhDayReportVm[m].insuffSeventhDayReportVm[0] : null;
  //       filteredValue[j].componentSeventhDayReportVm[m].raisedDate = val ? val.raisedDate : null;
  //       filteredValue[j].componentSeventhDayReportVm[m].clearedDate = val ? val.clearedDate : null;
  //       filteredValue[j].componentSeventhDayReportVm[m].insuffLevel = val ? val.insuffLevel : null;
  //       filteredValue[j].componentSeventhDayReportVm[m].remarks = val ? val.remarks : null;
  //     }
  //     //
  //     subRow = filteredValue[j]['componentSeventhDayReportVm'].length;
  //     headerColos = '';
  //     header.forEach(h => {
  //       objRow = '';
  //       if (h.field !== 'componentSeventhDayReportVm' && Array.isArray(filteredValue[j][h.field])) {
  //         for (const row of filteredValue[j][h.field]) {
  //           objRow = ((objRow !== '') ? objRow + ', ' : '') +
  //             (row.subCompName ? row.componentName + ' - ' + row.subCompName + ' - ' + row.count : row.componentName + ' - ' + row.count);
  //         }
  //         headerColos = headerColos + '<td style="font-size:12px; text-align: left; vertical-align: middle;" rowspan="' + subRow + '">' + objRow + ' </td>';
  //       } else if (h.field === 'componentSeventhDayReportVm' && Array.isArray(filteredValue[j][h.field])) {
  //         const row = filteredValue[j][h.field];
  //         const insuff = row[0].insuffSeventhDayReportVm;
  //         if ('COMPONENT NAME' === h.header) {
  //           objRow = row[0].subCompName ? row[0].componentName + ' - ' + row[0].subCompName : row[0].componentName;
  //         } else if ('FUNCTIONAL ENTITY' === h.header) {
  //           objRow = row[0].functionalEntity ? row[0].functionalEntity : 'NA';
  //         } else if ('COMPONENT STATUS' === h.header) {
  //           objRow = row[0].status ? row[0].status : 'NA';
  //         } else if ('INSUFFICIENCY RAISED DATE & TIME' === h.header) {
  //           objRow = row[0].raisedDate ? this.datePipe.transform(this.common.getTimezoneOffset(row[0].raisedDate, false), 'dd/MM/yyyy hh:mm:ss a') : 'NA';
  //         } else if ('INSUFFICIENCY CLEARED DATE & TIME' === h.header) {
  //           objRow = row[0].clearedDate ? this.datePipe.transform(this.common.getTimezoneOffset(row[0].clearedDate, false), 'dd/MM/yyyy hh:mm:ss a') : 'NA';
  //         } else if ('INSUFFICIENCY LEVEL' === h.header) {
  //           objRow = row[0].insuffLevel ? row[0].insuffLevel : 'NA';
  //         } else if ('INSUFFICIENCY LATEST REMARKS' === h.header) {
  //           objRow = row[0].remarks ? row[0].remarks : 'NA';
  //         }
  //         headerColos = headerColos + '<td style="font-size:12px;text-align: left; vertical-align: middle;">' + (objRow ? objRow : 'NA') + ' </td>';
  //       } else {
  //         headerColos = headerColos + '<td style="font-size:12px;text-align: left; vertical-align: middle;" rowspan="' + subRow + '">' +
  //           (filteredValue[j][h.field] == null ? '' : (h.field.endsWith('Date') || h.field === 'dob' ?
  //             this.datePipe.transform(filteredValue[j][h.field], 'dd/MM/yyyy') : filteredValue[j][h.field])) + ' </td>';
  //       }
  //     });
  //     tabtext = tabtext + '<tr>' + headerColos + '</tr>';
  //     if (Array.isArray(filteredValue[j]["componentSeventhDayReportVm"]) && Number(subRow) > 1) {
  //       this.skipfirst = false;
  //       for (const row of filteredValue[j]["componentSeventhDayReportVm"]) {
  //         if (this.skipfirst) {
  //           objRow = row.subCompName ? row.componentName + ' - ' + row.subCompName : row.componentName;
  //           tabtext = tabtext + '<td style="font-size:12px;text-align: left; vertical-align: middle;">' + objRow + ' </td>';
  //           objRow = row.functionalEntity ? row.functionalEntity : 'NA';
  //           tabtext = tabtext + '<td style="font-size:12px;text-align: left; vertical-align: middle;">' + objRow + ' </td>';
  //           objRow = row.functionalEntity ? row.status : 'NA';
  //           tabtext = tabtext + '<td style="font-size:12px;text-align: left; vertical-align: middle;">' + objRow + ' </td>';
  //           //
  //           objRow = row.raisedDate ? this.datePipe.transform(this.common.getTimezoneOffset(row.raisedDate, false), 'dd/MM/yyyy hh:mm:ss a') : 'NA';
  //           tabtext = tabtext + '<td style="font-size:12px;text-align: left; vertical-align: middle;">' + objRow + ' </td>';
  //           objRow = row.clearedDate ? this.datePipe.transform(this.common.getTimezoneOffset(row.clearedDate, false), 'dd/MM/yyyy hh:mm:ss a') : 'NA';
  //           tabtext = tabtext + '<td style="font-size:12px;text-align: left; vertical-align: middle;">' + objRow + ' </td>';
  //           objRow = row.insuffLevel ? row.insuffLevel : 'NA';
  //           tabtext = tabtext + '<td style="font-size:12px;text-align: left; vertical-align: middle;">' + objRow + ' </td>';
  //           objRow = row.remarks ? row.remarks : 'NA';
  //           tabtext = tabtext + '<td style="font-size:12px;text-align: left; vertical-align: middle;">' + objRow + ' </td>';
  //           //
  //           tabtext = '<tr>' + tabtext + '</tr>';
  //         }
  //         this.skipfirst = true;
  //       }
  //     }
  //   }
  //   tabtext = tabtext + '</table>';
  //   tabtext = tabtext.replace(/<A[^>]*>|<\/A>/g, '');          // remove if u want links in your table
  //   tabtext = tabtext.replace(/<img[^>]*>/gi, '');             // remove if u want images in your table
  //   tabtext = tabtext.replace(/<input[^>]*>|<\/input>/gi, ''); // reomves input params
  //   const fileName = 'File Level Tracker.xls';
  //   const exceldata = new Blob([tabtext], { type: this.EXCEL_TYPE });
  //   if ((window.navigator as any).msSaveBlob) { // IE 10+
  //     (window.navigator as any).msSaveOrOpenBlob(exceldata, fileName);
  //   } else {
  //     const link = document.createElement('a'); // create link download file
  //     link.href = window.URL.createObjectURL(exceldata); // set url for link download
  //     link.setAttribute('download', fileName); // set attribute for link created
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   }
  // }
  getclass(status: string): string {
    return status.startsWith('Close') ? 'green' : 'red';
  }
  exportAsExcelFile() {
    const dataOriginal = this.common.CloneObject(this.excelDataList);
    this.extraCols = [];
    const newData = this.getDynamicColumns(this.common.CloneObject(dataOriginal));
    this.extraCols = this.extraCols.filter((e, i, a) => i === a.indexOf(e));
    let cols: any[] = [];
    this.extraCols.forEach(element => {
      // cols.push({field: element.trim().replace(/\s/g, ''), header: element.split(/(?=[A-Z])/).join(' ').toUpperCase()});
      cols.push({ field: element.trim().replace(/\s/g, ''), header: element.split(/(?=[A-Z])/).join(' ') });
    });
    let header: any[] = [];
    if (this.userData.clientId === 32) {
      header = this.defaultColumnOne.concat(cols).concat(this.defaultColumnTwo);
    } else {
      header = this.defaultColumnOne.concat(cols).concat(this.OtheClientdefaultColumns);
    }
    const workbook = new Workbook();
    this.getWorkSheet(workbook, header, newData, 'File Level Tracker');
    workbook.xlsx.writeBuffer().then((data1) => {
      const blob = new Blob([data1], { type: this.EXCEL_TYPE });
      fs.saveAs(blob, 'File Level Tracker');
    });
  }
  getDynamicColumns(data: any) {
    const list1 = ['FunctionalEntity', 'Status'];
    const list2 = ['InsuffRaisedDate', 'InsuffClearedDate', 'InsuffLevel', 'InsuffRemarks'];
    data.forEach(element => {
      element.componentSeventhDayReportVm.forEach(ele => {
        const properties = Object.getOwnPropertyNames(ele);
        properties.forEach(prop => {
          if (list1.some(s => s.toLowerCase() === prop.toLowerCase())) {
            const comp = ele.componentName.trim().replace(/\s/g, '');
            element[comp + prop] = ele[prop];
            // tslint:disable-next-line:max-line-length
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
              // tslint:disable-next-line:max-line-length
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
          });
        } else {
          worksheet.addRow(eachRow).eachCell((cell, number) => {
            cell.font = { name: 'Verdana', size: 8, bold: false };
          });
        }
      });
      worksheet.columns.forEach(column => {
        column.width = 25;
      });
      worksheet.addRow([]);
    }
  }
}
