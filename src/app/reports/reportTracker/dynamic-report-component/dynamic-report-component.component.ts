import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { ReportService } from 'src/app/common-methods/services/report.service';
import { MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { process } from '@progress/kendo-data-query';
import { GridComponent } from '@progress/kendo-angular-grid';
import * as XLSX from 'xlsx';
import * as fs from 'file-saver';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { Workbook } from 'exceljs';
import { InvoiceService } from 'src/app/common-methods/services/invoice.service';
import { Verification } from '../../../common-methods/models/verification';
import { LazyLoadEvent } from 'primeng/api';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import moment, { Moment } from 'moment';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
export const MY_FORMATS = {
  parse: {
    dateInput: null,
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  standalone: false,
  selector: 'app-dynamic-report-component',
  templateUrl: './dynamic-report-component.component.html',
  styleUrls: ['./dynamic-report-component.component.css'],
  // providers: [
  //   { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  // ]

})
export class DynamicReportComponentComponent implements OnInit {
  month:number;
  days:number;
  years:number;
  dateFlag: boolean = false;
  //pagination
  totalpages: number;
  totalpages1: number;
  shievePageNo = 1;
  shievePageSize = 10;
  Hitemperpage: number = 10;
  event: LazyLoadEvent;
  virtualDatabase: any;
  loading: boolean;
  public gridView: any;
  public buttonCount = 7;
  public info = true;
  reportSearchVm = new ReportSearchVm();
  public type: 'numeric' | 'input' = 'numeric';
  public pageSizes = true;
  public previousNext = true;
  public skip = 0;
  searchCriFilter = false;
  userData: any;
  showdSearch = true;
  showSearch = true;
  isDesc: boolean;
  column: any;
  direction: number;
  menuData: any;
  itemPerPage;
  page = 1;
  mindate: any;
  maxDate = new Date();
  isEmptyRec = false;
  routePath: any;
  reportHeaderName: any;
  componentList: any[] = [];
  verificationIdList: any[] = [];
  verifyId: any[] = [];
  clientList: any[] = [];
  statusList: any[] = [];
  vendorList: any[] = [];
  clientNameControl!: AutoCompleteDropDown;
  statusControl!: AutoCompleteDropDown;
  componentControl!: AutoCompleteDropDown;
  verifyIdControl!: AutoCompleteDropDown;
  vendorControl!: AutoCompleteDropDown;
  searchValueArr: any[] = [];
  dynamicReportForm: UntypedFormGroup;
  isClientCntrl = false;
  isCompCntrl = false;
  isVeriCtrl = false;
  isStatusCntrl = false;
  isVendorIdCntrl = false;
  isFrmDateCntrl = false;
  isToDateCntrl = false;
  isFrmDateMonthAndYearCntrl = false;
  isToDateMonthAndYearCntrl = false;
  isShowMore = true;
  isveriIdCntrlReq = false
  isClientCntrlReq = false;
  isCompCntrlReq = false;
  isStatusCntrlReq = false;
  isVendorCntrlReq = false;
  outputDataReportList: any[] = [];
  outputDataExcel: any[] = [];
  reportModuleName: any;
  screenName: any;
  searchValue: any = '';
  excelColumns: any;
  isRefreshIcon = false;
  currentDate: Date = new Date();
  displayColumns: Array<{ field: string, header: string }> = [{ field: 'a', header: 'Candidate Name' }, {
    field: 'b',
    header: 'Client Name'
  }, { field: 'c', header: 'Site Name' }, { field: 'd', header: 'Client Ref No' }, {
    field: 'e',
    header: 'Applicant Id'
  }];
  // displayClosureColumns: Array<{ field: string, header: string }> = [
  //   { field: 'TransactionId', header: 'Transaction ID' }, { field: 'ScreeningOrFile', header: 'Screening/File #' },
  //   { field: 'ClientName', header: 'Client Name' }, { field: 'CaseReceivedDate', header: 'Case Received Date' },
  //   { field: 'ClosedDate', header: 'Closed Date (Response sent to client)' }, { field: 'Status', header: 'Status' },
  //   { field: 'CaseOwnerName', header: 'Case Owner Name' }, { field: 'ServiceType', header: 'Service Type' },
  //   { field: 'WTAndBT', header: 'WT/BT' }
  // ];
 @ViewChild('dtHistory', { static: true }) dtHistory!: Table;
  @ViewChild('global', { static: true }) global!: ElementRef;
  //totalpages: number;
  currentPage = 1;
  tempCurrentPage = 1;
  isShowSearch = true;
  compId = 0;
  isClientRefListCntrl = false;
  isApplicantIdCntrl = false;
  clientRefNoList: any[] = [];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  isRepType = false;
  repType = new UntypedFormControl(0);
  applicantId = new UntypedFormControl('');
  repTypeList: any[] = [];
  rejectTypeList: any[] = [];
  outputDataReportCopyList: any[] = [];
  searchText: any;
  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  EXCEL_EXTENSION = '.xlsx';
  copyOutputDataReportList: any[] = [];
  isShowAll: boolean = false;

  status = [
    { value: 'Open', viewValue: 'Open' },
    { value: 'Pending', viewValue: 'Pending' },
    { value: 'Completed', viewValue: 'Completed' },
  ];
  modifiedDate: String;
  screenAuth: any = {};
  // tslint:disable-next-line: max-line-length
  constructor(private reportService: ReportService, public invoiceService: InvoiceService,
    public common: CommonService, private message: MessageService, private datepipe: DatePipe, private auth: AuthService,
    private router: Router) { }

  screenName1: any;
  ngOnInit() {
    this.screenAuth = this.auth.getScreenAuth(this.router.url);
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    // this.getInvoiceClient();
    const mData = JSON.parse(sessionStorage.getItem('curMenu_data'));
    this.menuData = JSON.parse(sessionStorage.getItem('curMenu_data'));
    this.screenName1 = mData.screenName;
    if (this.screenName1 === 'Monthly Cumulative Final Report Completed') {
      this.displayColumns = [
        { field: 'a', header: 'Month' },
        { field: 'b', header: 'Domestic' },
        { field: 'c', header: 'Tech-M' },
        { field: 'd', header: 'Cognizant' },
        { field: 'e', header: 'Oversease' }];
    } else if (this.screenName1 === 'Monthly cumulative Cases and checks created') {
      this.displayColumns = [
        { field: 'monthYear', header: 'Month Year' },
        { field: 'casesDomestic', header: 'Cases Creation Indian' },
        { field: 'checksDomestic', header: 'Checks created Indian' },
        { field: 'casesTechM', header: 'Cases Creation TechM' },
        { field: 'checksTechM', header: 'Checks created TechM' },
        { field: 'casesCognizant', header: 'Cases Creation Cognizant' },
        { field: 'checksCognizant', header: 'Checks created Cognizant' },
        { field: 'checksOverseas', header: 'Checks created Overseas' },
        { field: 'totalCasesCreated', header: 'Total Cases Created' },
        { field: 'totalChecksCreated', header: 'Total Checks Created' },
      ];
    }
    else if (this.screenName1 == 'Closure Report') {
      this.displayColumns = [
        { field: 'TransactionId', header: 'Transaction ID' }, { field: 'ScreeningOrFile', header: 'Screening/File #' },
        { field: 'ClientName', header: 'Client Name' }, { field: 'CaseReceivedDate', header: 'Case Received Date' },
        { field: 'ClosedDate', header: 'Closed Date (Response sent to client)' }, { field: 'Status', header: 'Status' },
        { field: 'CaseOwnerName', header: 'Case Owner Name' }, { field: 'ServiceType', header: 'Service Type' },
        { field: 'WTAndBT', header: 'WT/BT' }
      ];
    }
    this.isClientCntrl = false;
    this.isCompCntrl = false;
    this.isVeriCtrl = false;
    this.isStatusCntrl = false;
    this.isVendorIdCntrl = false;
    this.isFrmDateCntrl = false;
    this.isToDateCntrl = false;
    this.isFrmDateMonthAndYearCntrl = false;
    this.isToDateMonthAndYearCntrl = false;
    this.isShowMore = true;
    this.isClientCntrlReq = false;
    this.isCompCntrlReq = false;
    this.isStatusCntrlReq = false;
    this.isVendorCntrlReq = false;
    this.isveriIdCntrlReq = false;
    this.initFormGroup();
    this.initReportDetails();
    this.itemPerPage = 10;
  }

  initFormGroup() {
    this.dynamicReportForm = new UntypedFormGroup({
      //clientids: new UntypedFormControl([], Validators.required),
      clientids: new UntypedFormControl(null),
      screeningStatusId: new UntypedFormControl(null),
      caseStatus: new UntypedFormControl(null),
      compId: new UntypedFormControl(0),
      teamName: new UntypedFormControl(this.userData.teamName),
      vendorId: new UntypedFormControl(null),
      fromDate: new UntypedFormControl(null),
      toDate: new UntypedFormControl(null),
      reportModuleName: new UntypedFormControl(null),
      verificationId: new UntypedFormControl(null),
      monthly: new UntypedFormControl(),
      loginUserId: new UntypedFormControl(this.userData.userId),
    });
  }
  //Individual api call for all report by megala -17-04-2024
  initReportDetails() {
    const menuData = JSON.parse(sessionStorage.getItem('curMenu_data'));
    this.screenName = menuData.screenName;
    switch (menuData.screenName) {
      case 'Address - MIS':
        this.routePath = 'Report / MIS - Report Tracker / Address - MIS';
        this.reportHeaderName = 'Address - MIS Tracker';
        this.isClientCntrl = true;
        this.isCompCntrl = true;
        this.isStatusCntrl = true;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isShowMore = true;
        this.isCompCntrlReq = true;
        this.isRefreshIcon = false;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.checkCRT() ? 2 : 22;
        this.reportService.getAddressMisDropdown(this.userData).subscribe(res => {
          this.componentList = res.componentRptAddressCmpntList;
          this.getAllClient();
          this.getStatus();
        })
        break;
      case 'Education - MIS':
        this.routePath = 'Report / MIS - Report Tracker / Education - MIS';
        this.reportHeaderName = 'Education Tracker Report';
        this.isClientCntrl = true;
        this.isCompCntrl = true;
        this.isStatusCntrl = true;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isShowMore = true;
        this.isCompCntrlReq = true;
        this.isRefreshIcon = false;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        this.reportService.getEducationMisDropdown(this.userData).subscribe(res => {
          this.componentList = res.componentList.filter(f => f.compName === 'Education' || f.compName === 'Gap Verification');
          this.getAllClient();
          this.getStatus();
        })
        break;
      case 'Employment - MIS':
        this.routePath = 'Report / MIS - Report Tracker / Employment - MIS';
        this.reportHeaderName = 'Employment - MIS';
        this.isClientCntrl = true;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isStatusCntrl = true;
        this.isCompCntrl = true;
        this.isCompCntrlReq = true;
        this.isRefreshIcon = false;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.checkCRT() ? 7 : 19;
        this.reportService.getEmploymentMisDropdown(this.userData).subscribe(res => {
          this.componentList = res.componentRptEmpCmpntList;
          this.getAllClient();
          this.getStatus();
        })
        break;
      case 'Criminal Check - MIS':
        this.routePath = 'Report / MIS - Report Tracker / Criminal Check - MIS';
        this.reportHeaderName = 'Criminal Tracker Report';
        this.isClientCntrl = true;
        this.isCompCntrl = true;
        this.isStatusCntrl = true;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isShowMore = true;
        this.isCompCntrlReq = true;
        this.isRefreshIcon = false;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.checkCRT() ? 3 : 15;
        this.reportService.getCriminalMisDropdown(this.userData).subscribe(res => {
          this.componentList = res.componentRptCriminalCmpntList;
          this.getAllClient();
          this.getStatus();
        })
        break;
      case 'Identity - MIS':
        this.routePath = 'Report / MIS - Report Tracker / Identity - MIS';
        this.reportHeaderName = 'Identity Tracker Report';
        this.isClientCntrl = true;
        this.isCompCntrl = true;
        this.isStatusCntrl = true;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isShowMore = true;
        this.isCompCntrlReq = true;
        this.isRefreshIcon = false;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.checkCRT() ? 8 : 18;
        this.reportService.getIdendityMisDropdown(this.userData).subscribe(res => {
          this.componentList = res.componentRptIdentityCmpntList;
          this.getAllClient();
          this.getStatus();
        })
        break;
      case 'Not Sent To Qc List':
        this.routePath = 'Report / Report Tracker / Not Sent To Qc List';
        this.reportHeaderName = 'Not Sent To Qc List';
        this.isClientCntrl = true;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isCompCntrl = true;
        this.isClientCntrlReq = true;
        this.isShowMore = false;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        this.reportService.getCommonLookUpData(this.userData).subscribe(res => {
          if (res != null) {
            this.componentList = res.componentList;
            this.getAllClient();
          }
        });
        break;
      case ' Rejected History QCList':
        this.routePath = 'Report / Report Tracker / QC Rejected History List';
        this.reportHeaderName = 'QC Rejected History List';
        this.isClientCntrl = true;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isCompCntrl = true;
        this.isClientCntrlReq = true;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        break;
      case 'QC Rejected History List':
        this.routePath = 'Report / Report Tracker / QC Rejected History List';
        this.reportHeaderName = 'QC Rejected History List';
        this.isClientCntrl = true;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isCompCntrl = true;
        this.isClientCntrlReq = true;
        this.isShowMore = false;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        this.reportService.getCommonLookUpData(this.userData).subscribe(res => {
          if (res != null) {
            this.componentList = res.componentList.filter(x => x.cancelFlag === false);
            this.getAllClient();
            this.qcReject();
          }
        });
        break;
      case 'Call Back Details':
        this.routePath = 'Report / Report Tracker / Call Back Details';
        this.reportHeaderName = 'Call Back Details';
        this.isClientCntrl = true;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isShowMore = false;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        this.getAllClient();
        break;
      case 'Tech - M Client Report':
        this.routePath = 'Report / Tech - M Report Tracker / Tech - M Client Report';
        this.reportHeaderName = 'Tech - M Client Report';
        this.isClientRefListCntrl = true;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isShowMore = false;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        break;
      case 'Tech - M Closed Checks History':
        this.routePath = 'Report / Tech - M Report Tracker / Tech - M Closed Checks History';
        this.reportHeaderName = 'Tech - M Closed Checks History';
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isShowMore = false;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        break;
      case 'Tech - M Interim/Final Report':
        this.routePath = 'Report / Tech - M Report Tracker / Tech - M Interim/Final Report';
        this.reportHeaderName = 'Tech - M Interim/Final Report';
        this.isClientRefListCntrl = true;
        this.isRepType = true;
        this.isShowMore = false;
        this.isShowSearch = false;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        break;
      case 'Tech - M Client Specific Report':
        this.routePath = 'Report / Tech - M Report Tracker / Tech - M Client Specific Report';
        this.reportHeaderName = 'Tech - M Client Specific Report';
        this.isClientRefListCntrl = true;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isShowMore = false;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        break;
      case 'Tech - M Applicant Details':
        this.routePath = 'Report / Tech - M Report Tracker / Tech - M Applicant Details';
        this.reportHeaderName = 'Tech - M Applicant Details';
        this.isApplicantIdCntrl = true;
        this.isShowMore = false;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        break;
      case 'Tech - M QC Error Details':
        this.routePath = 'Report / Tech - M Report Tracker / Tech - M QC Error Details';
        this.reportHeaderName = 'Tech - M QC Error Details';
        this.isClientCntrl = true;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isShowMore = false;
        this.isClientCntrlReq = true;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        this.getAllClient();
        break;
      // case 'Tech - M CEA Details':
      //   this.routePath = 'Report / Tech - M Report Tracker / Tech - M CEA Details';
      //   this.reportHeaderName = 'Tech - M CEA Details';
      //   this.isClientRefListCntrl = true;
      //   this.isShowMore = false;
      //   this.reportModuleName = menuData.screenName;
      //   this.userData.deptId = this.userData.deptId;
      //   break;
      case 'Tech - M Pending Component List':
        this.routePath = 'Report / Tech - M Report Tracker / Tech - M Pending Component List';
        this.reportHeaderName = 'Tech - M Pending Component List';
        this.isClientCntrl = false;
        this.isCompCntrl = true;
        this.isStatusCntrl = true;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isVendorIdCntrl = true;
        // this.isStatusCntrlReq = true;
        this.isShowMore = true;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        break
      // start Data Entry Department Reports
      case 'Submission Pending List':
        this.routePath = 'Report / Report Tracker / Submission Pending List';
        this.reportHeaderName = 'Submission Pending List';
        this.isClientCntrl = true;
        this.isCompCntrl = true;
        this.isStatusCntrl = false;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isShowMore = true;
        this.isShowSearch = true;
        this.isCompCntrlReq = false;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        this.getAllClient();
        break;
      case 'Submission List':
        this.routePath = 'Report / Report Tracker / Submission List';
        this.reportHeaderName = 'Submission List';
        this.isClientCntrl = true;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isShowMore = false;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        this.getAllClient();
        break;
      case 'Submission DE - QC Pending List':
        this.routePath = 'Report / Report Tracker / Submission DE - QC Pending List';
        this.reportHeaderName = 'Submission DE - QC Pending List';
        this.isClientCntrl = true;
        this.isCompCntrl = true;
        this.isStatusCntrl = false;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isShowMore = true;
        this.isShowSearch = true;
        this.isCompCntrlReq = false;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        this.getAllClient();
        break;
      case 'Pre-QC & DA Case Completion MIS':
        this.routePath = 'Report / Report Tracker / Pre-QC & DA Case Completion MIS';
        this.reportHeaderName = 'Pre-QC & DA Case Completion MIS';
        this.isClientCntrl = true;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isShowMore = true;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        this.getAllClient();
        break;
      //End Data Entry Depaertment Reports
      //CAM MIS Reports
      case 'Daily Tracker Report':
        this.routePath = 'Report / Report Tracker / Daily Tracker Report';
        this.reportHeaderName = 'Daily Tracker Report';
        this.isClientCntrl = true;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isShowMore = false;
        this.isClientCntrlReq = true;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        this.getAllClient();
        break;
      case 'Client Closure Report MIS':
        this.routePath = 'Report / MIS - Report Tracker / Client Closure Report MIS';
        this.reportHeaderName = 'Client Closure Report';
        this.isClientCntrl = true;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isShowMore = false;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        this.getAllClient();
        break;
      case 'Insufficiency Tracker':
        this.routePath = 'Report / Report Tracker / Insufficiency Tracker';
        this.reportHeaderName = 'Insufficiency Tracker';
        this.isClientCntrl = true;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isShowMore = false;
        this.isClientCntrlReq = true;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        this.getAllClient();
        break;

      case 'Pending Component List':
        this.routePath = 'Report / Report Tracker / Pending Component List';
        this.reportHeaderName = 'Pending Component';
        this.isClientCntrl = true;
        this.isCompCntrl = true;
        this.isStatusCntrl = true;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isVendorIdCntrl = true;
        // this.isStatusCntrlReq = true;
        this.isShowMore = true;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        this.reportService.getCommonLookUpData(this.userData).subscribe(res => {
          if (res != null) {
            this.vendorList = res.vendorList;
            this.statusList = res.pndngLstStatus;
            this.componentList = res.componentList.filter(x => x.cancelFlag === false);
            this.getAllClient();
          }
        });
        break;

      case 'Closed Checks History':
        this.routePath = 'Report / Report Tracker / Closed Checks History';
        this.reportHeaderName = 'Closed Checks History';
        this.isClientCntrl = true;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isShowMore = false;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        this.getAllClient();
        break;
      //Start QC Department MIS Reports
      case 'Individual QC Approved List':
        this.routePath = 'Report / QC Report / Individual QC Approved List';
        this.reportHeaderName = 'Individual QC Approved List';
        this.isClientCntrl = true;
        this.isCompCntrl = true;
        this.isVeriCtrl = true;
        this.isStatusCntrl = true;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isShowMore = true;
        this.isCompCntrlReq = false;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        this.reportService.getCommonLookUpData(this.userData).subscribe(res => {
          if (res != null) {
            this.statusList = res.lstStatus;
            this.componentList = res.componentList.filter(x => x.cancelFlag === false);
            this.getAllClient();
          }
        });
        break;
      case 'FQC Not Assigned List':
        this.routePath = 'Report / QC Report / FQC Not Assigned List';
        this.reportHeaderName = 'FQC Not Assigned List';
        this.isClientCntrl = true;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isShowMore = true;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        this.getAllClient();
        break;
      case 'FQC Approved List':
        this.routePath = 'Report / QC Report / FQC Approved List';
        this.reportHeaderName = 'FQC Approved List';
        this.isClientCntrl = true;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isShowMore = true;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        this.getAllClient();
        break;
      case 'QC Rejected History':
        this.routePath = 'Report / QC Report / QC Rejected History';
        this.reportHeaderName = 'QC Rejected History';
        this.isClientCntrl = true;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isShowMore = false;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        this.getAllClient();
        break;
      case 'FQC Pending List':
        this.routePath = 'Report / QC Report / FQC Pending List';
        this.reportHeaderName = 'FQC Pending List';
        this.isClientCntrl = true;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isShowMore = true;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        this.getAllClient();
        break;
      case 'Individual QC Pending List':
        this.routePath = 'Report / QC Report / Individual QC Pending List';
        this.reportHeaderName = 'Individual QC Pending List';
        this.isClientCntrl = true;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isShowMore = true;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        this.getAllClient();
        break;
        // Added By Megala - For VTS2-2023-Pre-QC-0112
        case 'Pre-QC Rejection History':
          this.routePath = 'Report / Report Tracker / Pre-QC Rejection History';
          this.reportHeaderName = 'Pre-QC Rejection History';
          this.isClientCntrl = true;
          this.isFrmDateCntrl = true;
          this.isToDateCntrl = true;
          this.isShowMore = true;
          this.reportModuleName = menuData.screenName;
          this.userData.deptId = this.userData.deptId;
          this.getAllClient();
          break;
      //End QC department MIS Reports

      case 'Cancel Component MIS':
        this.routePath = 'Report / QC Report / Cancel Component MIS';
        this.reportHeaderName = 'Cancel Component MIS';
        this.isClientCntrl = true;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isShowMore = true;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        this.getAllClient();
        break;
      case 'All Qc Pending List':
        this.routePath = 'Report / QC Report / All Qc Pending List';
        this.reportHeaderName = 'All Qc Pending List';
        this.isClientCntrl = true;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isShowMore = true;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        this.getAllClient();
        break;
      case 'Pre Final Cases':
        this.routePath = 'Report / QC Report / Pre Final Cases';
        this.reportHeaderName = 'Pre Final Cases';
        this.isClientCntrl = true;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isShowMore = true;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        this.getAllClient();
        break;
      case 'Insufficiency History':
        this.routePath = 'Report / Report Tracker / Insufficiency History';
        this.reportHeaderName = 'Insufficiency History';
        this.isClientCntrl = true;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isShowMore = true;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        this.getAllClient();
        break;
      case 'Closure Report':
        this.routePath = 'Report / QC Report / Closure Report';
        this.reportHeaderName = 'Closure Report';
        this.isClientCntrl = true;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isShowMore = true;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        this.getAllClient();
        break;
      case 'BGV Report Tracker':
        this.routePath = 'Report / QC Report / BGV Report Tracker';
        this.reportHeaderName = 'BGV Report Tracker';
        this.isClientCntrl = true;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isShowMore = true;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        this.getAllClient();
        break;

      case 'Vendor Case List':
        this.routePath = 'Report / Report Tracker / Vendor Case List';
        this.reportHeaderName = 'Vendor Case List Report';
        this.isVendorIdCntrl = true;
        this.isCompCntrl = true;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isShowMore = true;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        this.reportService.getCommonLookUpData(this.userData).subscribe(res => {
          if (res != null) {
            this.vendorList = res.vendorList;
            this.componentList = res.componentList;
            this.initautoCompleteCtrl();
          }
        });
        break;
      case 'Final Report Generated List':
        this.routePath = 'Report / Report Tracker / Final Report Generated List';
        this.reportHeaderName = 'Final Report Generated List';
        this.isClientCntrl = true;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isShowMore = true;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        this.getAllClient();
        break;
      case 'Today Comments':
        this.routePath = 'Report / Report Tracker / Today Comments';
        this.reportHeaderName = 'Today Comments Report';
        this.isClientCntrl = true;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isShowMore = true;
        this.isClientCntrlReq = true;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        this.getAllClient();
        break;
      case 'Client Commented Cases':
        this.routePath = 'Report / Report Tracker / Client Commented Cases';
        this.reportHeaderName = 'Client Commented Cases';
        this.isClientCntrl = true;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isShowMore = true;
        this.isClientCntrlReq = true;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        this.getAllClient();
        break;
      case 'File Level Tracker':
        this.routePath = 'Report / File Level Tracker';
        this.reportHeaderName = 'File Level Tracker';
        this.isClientCntrl = true;
        this.isCompCntrl = true;
        this.isStatusCntrl = true;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isVendorIdCntrl = true;
        this.isStatusCntrlReq = true;
        this.isShowMore = true;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        break;
      //Start Performance MIS Reports
      case 'Monthly Cumulative Final Report Completed':
        this.routePath = 'Report / Performance Tracker / Monthly Cumulative Final Report Completed';
        this.reportHeaderName = 'Monthly Cumulative Final Report Completed';
        this.isFrmDateMonthAndYearCntrl = true;
        this.isToDateMonthAndYearCntrl = true;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        break;
      case 'Monthly cumulative Cases and checks created':
        this.routePath = 'Report / Performance Tracker / Monthly cumulative Cases and checks created';
        this.reportHeaderName = 'Monthly cumulative Cases and checks created';
        this.isFrmDateMonthAndYearCntrl = true;
        this.isToDateMonthAndYearCntrl = true;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        break;
      case 'Components Completed Monthly list':
        this.routePath = 'Report / Performance Tracker / Components Completed Monthly list';
        this.reportHeaderName = 'Components Completed Monthly list';
        this.isFrmDateMonthAndYearCntrl = true;
        this.isToDateMonthAndYearCntrl = true;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        break;
      case 'Monthly SLA with color code':
        this.routePath = 'Report / Performance Tracker / Monthly SLA with color code';
        this.reportHeaderName = 'Monthly SLA with color code';
        this.isClientCntrl = true;
        this.isFrmDateMonthAndYearCntrl = true;
        this.isToDateMonthAndYearCntrl = true;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        this.getAllClient();
        break;
      case 'Client Summary':
        this.routePath = 'Report / Performance Tracker / Client Summary';
        this.reportHeaderName = 'Client Summary';
        this.isClientCntrl = true;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        this.getAllClient();
        break;
      //Added By Megala 02-02-2024
      case 'Monthly completed cases with component details':
        this.routePath = 'Report / Performance Tracker / Monthly completed cases with component details';
        this.reportHeaderName = 'Monthly completed cases with component details';
        this.isClientCntrl = true;
        this.isFrmDateMonthAndYearCntrl = true;
        this.isToDateMonthAndYearCntrl = true;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        this.getAllClient();
        break;
      //End Performance MIS Reports
      case 'Tech - M Submission Pending List':
        this.routePath = 'Report / Tech - M Report Tracker / Tech - M Submission Pending List';
        this.reportHeaderName = 'Tech - M Submission Pending List';
        this.isClientCntrl = false;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isShowMore = false;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        break;
      case 'For Research Employment Reject History':
        this.routePath = 'Report / Report Tracker / For Research Employment Reject History';
        this.reportHeaderName = 'For Research Employment Reject History';
        this.isClientCntrl = true;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isShowMore = false;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        break;
      //Strat Denormalization MIS Reports Set-1
      case 'Pending Component Tracker':
        this.routePath = menuData.moduleName + ' / ' + menuData.subModuleName + ' / ' + menuData.screenName;
        this.reportHeaderName = menuData.screenName;
        this.isClientCntrl = true;
        this.isCompCntrl = true;
        this.isStatusCntrl = false;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isVendorIdCntrl = true;
        // this.isStatusCntrlReq = true;
        this.isShowMore = true;
        this.isRefreshIcon = true;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        this.reportService.getCommonLookUpData(this.userData).subscribe(res => {
          if (res != null) {
            this.vendorList = res.vendorList;
            this.componentList = res.componentList;
            this.initautoCompleteCtrl();
            this.getAllClient();
          }
        });
        break;
      case 'Daily Tracker':
        this.routePath = menuData.moduleName + ' / ' + menuData.subModuleName + ' / ' + menuData.screenName;
        this.reportHeaderName = menuData.screenName;
        this.isClientCntrl = true;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isShowMore = false;
        this.isClientCntrlReq = true;
        this.isRefreshIcon = true;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        this.getAllClient();
        break;
      case 'Submission Pending Tracker':
        this.routePath = menuData.moduleName + ' / ' + menuData.subModuleName + ' / ' + menuData.screenName;
        this.reportHeaderName = menuData.screenName;
        this.isClientCntrl = true;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isShowMore = false;
        this.isClientCntrlReq = true;
        this.isRefreshIcon = true;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        this.getAllClient();
        break;
      //Added By Megala - for VTS2-2024-DEV-0197
      case 'TAT Report':
        this.routePath = menuData.moduleName + ' / ' + menuData.subModuleName + ' / ' + menuData.screenName;
        this.reportHeaderName = menuData.screenName;
        this.isClientCntrl = true;
        this.isStatusCntrl = true;
        this.isFrmDateCntrl = true;
        this.isShowMore = false;
        this.isToDateCntrl = true;
        this.isRefreshIcon = true;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        this.reportService.getStatus().subscribe(res => {
          if (res) {
            this.statusList = res.filter(f => f.statusName.toLowerCase() != 'open');
          }
          this.getAllClient();
        })
        break;
      case 'Submission DE - QC Pending Tracker':
        this.routePath = menuData.moduleName + ' / ' + menuData.subModuleName + ' / ' + menuData.screenName;
        this.reportHeaderName = menuData.screenName;
        this.isClientCntrl = true;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isShowMore = false;
        this.isClientCntrlReq = true;
        this.isRefreshIcon = true;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        this.getAllClient();
        break;
      case 'Pre-QC & DA Completion - MIS':
        this.routePath = menuData.moduleName + ' / ' + menuData.subModuleName + ' / ' + menuData.screenName;
        this.reportHeaderName = menuData.screenName;
        this.isClientCntrl = true;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isShowMore = false;
        this.isClientCntrlReq = true;
        this.isRefreshIcon = true;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        this.getAllClient();

        break;
      case 'Closed Checks History - MIS':
        this.routePath = menuData.moduleName + ' / ' + menuData.subModuleName + ' / ' + menuData.screenName;
        this.reportHeaderName = menuData.screenName;
        this.isClientCntrl = true;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isShowMore = false;
        this.isClientCntrlReq = true;
        this.isRefreshIcon = true;
        this.userData.deptId = this.userData.deptId;
        this.reportModuleName = menuData.screenName;
        this.getAllClient();

        break;
      case 'QC Rejection Instance - MIS':
        this.routePath = menuData.moduleName + ' / ' + menuData.subModuleName + ' / ' + menuData.screenName;
        this.reportHeaderName = menuData.screenName;
        this.isClientCntrl = true;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isShowMore = false;
        this.isClientCntrlReq = true;
        this.isRefreshIcon = true;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        this.getAllClient();

        break;
      case 'Individual QC Approved - MIS':
        this.routePath = menuData.moduleName + ' / ' + menuData.subModuleName + ' / ' + menuData.screenName;
        this.reportHeaderName = menuData.screenName;
        this.isClientCntrl = true;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isShowMore = false;
        this.isClientCntrlReq = true;
        this.isRefreshIcon = true;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        this.getAllClient();

        break;
      //Added By Megala 22-10-2024 Denormalization MIS Reports Set-2
      case 'Address Report - MIS':
        this.routePath = menuData.moduleName + ' / ' + menuData.subModuleName + ' / ' + menuData.screenName;
        this.reportHeaderName = menuData.screenName;
        this.isClientCntrl = true;
        this.isCompCntrl = true;
        this.isStatusCntrl = true;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isShowMore = true;
        this.isCompCntrlReq = true;
        this.isRefreshIcon = true;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.checkCRT() ? 2 : 22;
        this.reportService.getAddressMisDropdown(this.userData).subscribe(res => {
          this.componentList = res.componentRptAddressCmpntList;
          this.getAllClient();
          this.getStatus();
        })
        break;
      case 'Education Report - MIS':
        this.routePath = menuData.moduleName + ' / ' + menuData.subModuleName + ' / ' + menuData.screenName;
        this.reportHeaderName = menuData.screenName;
        this.isClientCntrl = true;
        this.isCompCntrl = true;
        this.isStatusCntrl = true;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isShowMore = true;
        this.isCompCntrlReq = true;
        this.isRefreshIcon = true;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.userData.deptId;
        this.reportService.getEducationMisDropdown(this.userData).subscribe(res => {
          this.componentList = res.componentList.filter(f => f.compName === 'Education' || f.compName === 'Gap Verification');
          this.getAllClient();
          this.getStatus();
        })
        break;
      case 'Employment Report - MIS':
        this.routePath = menuData.moduleName + ' / ' + menuData.subModuleName + ' / ' + menuData.screenName;
        this.reportHeaderName = menuData.screenName;
        this.isClientCntrl = true;
        this.isCompCntrl = true;
        this.isStatusCntrl = true;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isShowMore = true;
        this.isCompCntrlReq = true;
        this.isRefreshIcon = true;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.checkCRT() ? 7 : 19;
        this.reportService.getEmploymentMisDropdown(this.userData).subscribe(res => {
          this.componentList = res.componentRptEmpCmpntList;
          this.getAllClient();
          this.getStatus();
        })
        break;
      case 'Criminal Report - MIS':
        this.routePath = menuData.moduleName + ' / ' + menuData.subModuleName + ' / ' + menuData.screenName;
        this.reportHeaderName = menuData.screenName;
        this.isClientCntrl = true;
        this.isCompCntrl = true;
        this.isStatusCntrl = true;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isShowMore = true;
        this.isCompCntrlReq = true;
        this.isRefreshIcon = true;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.checkCRT() ? 3 : 15;
        this.reportService.getCriminalMisDropdown(this.userData).subscribe(res => {
          this.componentList = res.componentRptCriminalCmpntList;
          this.getAllClient();
          this.getStatus();
        })
        break;
      case 'Identity Report - MIS':
        this.routePath = menuData.moduleName + ' / ' + menuData.subModuleName + ' / ' + menuData.screenName;
        this.reportHeaderName = menuData.screenName;
        this.isClientCntrl = true;
        this.isCompCntrl = true;
        this.isStatusCntrl = true;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isShowMore = true;
        this.isCompCntrlReq = true;
        this.isRefreshIcon = true;
        this.reportModuleName = menuData.screenName;
        this.userData.deptId = this.checkCRT() ? 8 : 18;
        this.reportService.getIdendityMisDropdown(this.userData).subscribe(res => {
          this.componentList = res.componentRptIdentityCmpntList;
          this.getAllClient();
          this.getStatus();
        })
        break;
        // Added By Megala - For (sprint -22) VTS2-2024-CRT-0195
        case 'Color Code CAM Approval Tracker':
        this.routePath = menuData.moduleName + ' / ' + menuData.subModuleName + ' / ' + menuData.screenName;
        this.reportHeaderName = menuData.screenName;
        this.isClientCntrl = true;
        this.isFrmDateCntrl = true;
        this.isToDateCntrl = true;
        this.isRefreshIcon = true;
        this.reportModuleName = menuData.screenName;
         this.getAllClient();
        break;
      default: return 'N/A';
    }
    this.submitSearchValue(false);
    if (this.isRefreshIcon) {
      this.reportService.GetModifiedDate().subscribe(res => {
        if (res) {
          //Added By Megala - For Refresh Date Capture    
          const rDate = this.datepipe.transform(res.modifiedDate, 'dd/MMM/yyyy');
          this.modifiedDate = res.lastModDate + ' ( ' + rDate + ' ) ';
        }
      });
    }
  }

  fdate() {
    if (
      this.menuData.screenName === 'Address - MIS' || this.menuData.screenName === 'Criminal Check - MIS' ||
      this.menuData.screenName === 'Employment - MIS' || this.menuData.screenName === 'Education - MIS' || this.menuData.screenName === 'Identity - MIS' ||
      this.menuData.screenName === 'Address Report - MIS' || this.menuData.screenName === 'Education Report - MIS' || this.menuData.screenName === 'Employment Report - MIS' || this.menuData.screenName === 'Criminal Report - MIS' || this.menuData.screenName === 'Identity Report - MIS') {
      this.mindate = this.dynamicReportForm.get('fromDate')?.value;
      if (!(this.mindate instanceof Date)) {
        this.mindate = new Date(this.mindate);
      }
      this.maxDate = new Date(this.mindate);
      this.maxDate.setDate(this.maxDate.getDate() + 119);
      if (this.maxDate >= this.currentDate) {
        this.dynamicReportForm.get('toDate')?.setValue(this.currentDate);
      }
      else {
        this.dynamicReportForm.get('toDate')?.setValue(this.maxDate);
      }
    } else {
      this.mindate = this.dynamicReportForm.get('fromDate')?.value;
    }
  }
  tdate() {
    if (
      this.menuData.screenName === 'Address - MIS' || this.menuData.screenName === 'Criminal Check - MIS' ||
      this.menuData.screenName === 'Employment - MIS' || this.menuData.screenName === 'Education - MIS' || this.menuData.screenName === 'Identity - MIS' ||
      this.menuData.screenName === 'Address Report - MIS' || this.menuData.screenName === 'Education Report - MIS' || this.menuData.screenName === 'Employment Report - MIS' || this.menuData.screenName === 'Criminal Report - MIS' || this.menuData.screenName === 'Identity Report - MIS') {
      this.maxDate = this.dynamicReportForm.get('toDate')?.value;
      if (!(this.maxDate instanceof Date)) {
        this.maxDate = new Date(this.maxDate);
      }
      this.mindate = new Date(this.maxDate);
      this.mindate.setDate(this.mindate.getDate() - 119);
      this.dynamicReportForm.get('fromDate')?.setValue(this.mindate);
    } else {
      this.maxDate = this.dynamicReportForm.get('toDate')?.value;
    }
  }

  setMonthAndYearFrom(normalizedMonthAndYear: Date, datepicker: MatDatepicker<Moment>) {
    const newDate = moment(normalizedMonthAndYear).set({
      month: normalizedMonthAndYear.getMonth(),
      year: normalizedMonthAndYear.getFullYear(),
    });
    this.dynamicReportForm.get('fromDate')?.setValue(newDate.toDate());
    datepicker.close();
  }
  setMonthAndYearTo(normalizedMonthAndYear: Date, datepicker: MatDatepicker<Moment>) {
    const newDate = moment(normalizedMonthAndYear).set({
      month: normalizedMonthAndYear.getMonth(),
      year: normalizedMonthAndYear.getFullYear(),
    });
    const lastDayOfMonth = new Date(newDate.toDate().getFullYear(), newDate.toDate().getMonth() + 1, 0);
    this.dynamicReportForm.get('toDate')?.setValue(lastDayOfMonth);
    datepicker.close();
  }
  qcReject() {
    this.reportService.GetQcReportType().subscribe(res => {
      const qcType = res;
      this.rejectTypeList = qcType.filter(f => f.lookUpName === 'FinalQC' || f.lookUpName === 'IndividualQC');
    });
  }
  //remove 120 days,30 days functionality By Megala
  // getDays() {
  //   var casestatusId =this.dynamicReportForm.get("screeningStatusId").value;
  //   if(casestatusId>0){    
  //   var casestatus = this.statusList.filter(f=>f.screeningStatusId == casestatusId);     
  //   if(casestatus !=null && casestatus[0].statusName ==  this.common.COMPLETED_STATUS){
  //     this.dateFlag = true;
  //   }else{
  //     this.dateFlag = false;
  //   }
  // }
  //   if (this.menuData.screenName === 'Pre-QC & DA Case Completion MIS' || this.menuData.screenName === 'QC Rejected History List' || 
  //   this.menuData.screenName === 'Individual QC Approved List' || this.menuData.screenName === 'Daily Tracker Report' ||
  //   this.menuData.screenName === 'Pre-QC & DA Completion - MIS' || this.menuData.screenName === 'QC Rejected History - MIS' || 
  //   this.menuData.screenName === 'Individual QC Approved - MIS' || this.menuData.screenName === 'Daily Tracker' 
  //   // this.menuData.screenName === 'Address - MIS' || this.menuData.screenName === 'Criminal Check - MIS' || 
  //   // this.menuData.screenName === 'Employment - MIS' || this.menuData.screenName === 'Education - MIS' || this.menuData.screenName === 'Identity - MIS' ||
  //   // (this.menuData.screenName === 'Address' && this.dateFlag != true) || (this.menuData.screenName === 'Education' && this.dateFlag != true) || (this.menuData.screenName === 'Employment' && this.dateFlag != true)
  //   ) {
  //     return '30 Days';
  //   } else {
  //     return '120 Days';
  //   }
  // }
  //Added By Megala 18-01-2024
  // Add 120 days Required Functionality
  getScreeningStatus() {
    if (this.menuData.screenName === 'Address - MIS' || this.menuData.screenName === 'Criminal Check - MIS' ||
      this.menuData.screenName === 'Employment - MIS' || this.menuData.screenName === 'Education - MIS' || this.menuData.screenName === 'Identity - MIS' ||
      this.menuData.screenName === 'Address Report - MIS' || this.menuData.screenName === 'TAT Report' || this.menuData.screenName === 'Education Report - MIS' || this.menuData.screenName === 'Employment Report - MIS'
      || this.menuData.screenName === 'Criminal Report - MIS' || this.menuData.screenName === 'Identity Report - MIS'|| this.menuData.screenName === 'QC Rejected History') {
      return true;
    } else {
      return false;
    }
  }
  getdateFlag() {
    if (this.menuData.screenName === 'Address - MIS' || this.menuData.screenName === 'Criminal Check - MIS' ||
      this.menuData.screenName === 'Employment - MIS' || this.menuData.screenName === 'Education - MIS' || this.menuData.screenName === 'Identity - MIS' ||
      this.menuData.screenName === 'Address Report - MIS' || this.menuData.screenName === 'TAT Report' || this.menuData.screenName === 'Education Report - MIS' || this.menuData.screenName === 'Employment Report - MIS' || this.menuData.screenName === 'Criminal Report - MIS' ||this.menuData.screenName === 'QC Rejected History'
      || this.menuData.screenName === 'Identity Report - MIS') {
      var casestatusId = this.dynamicReportForm.get("screeningStatusId").value;
      // Added By Megala -for VTS2-2024-QC-0181 - sprint 20
      if (casestatusId > 0 && this.menuData.screenName != 'QC Rejected History') {
        var casestatus = this.statusList.filter(f => f.screeningStatusId == casestatusId);
        // Added By Megala -for VTS2-2024-QC-0181 - sprint 20
        if (casestatus != null && casestatus[0].statusName == this.common.COMPLETED_STATUS) {
          if (this.menuData.screenName != 'TAT Report') {
            this.isShowMore = true;
          }
          return true;
        }
        else {
          this.isShowMore = false;
          return false;
        }
        // Added By Megala -for VTS2-2024-QC-0181 - sprint 20
      }else if(this.menuData.screenName === 'QC Rejected History') {
        return true;
      }
      else {
        this.isShowMore = false;
      }
    }
  }
  getdFlag() {
    if (this.menuData.screenName === 'Address - MIS' || this.menuData.screenName === 'Criminal Check - MIS' ||
      this.menuData.screenName === 'Employment - MIS' || this.menuData.screenName === 'Education - MIS' || this.menuData.screenName === 'Identity - MIS' ||
      this.menuData.screenName === 'Address Report - MIS' || this.menuData.screenName === 'TAT Report' || this.menuData.screenName === 'Education Report - MIS' || this.menuData.screenName === 'Employment Report - MIS' || this.menuData.screenName === 'Criminal Report - MIS'
      || this.menuData.screenName === 'Identity Report - MIS' || this.menuData.screenName === 'QC Rejected History' || this.screenName === 'Color Code CAM Approval Tracker') {
      return false;
    }
    else {
      return true;
    }
  }
  monthlyChange(event, days) {
    var casestatusId = this.dynamicReportForm.get("screeningStatusId").value;
    if (casestatusId > 0) {
      var casestatus = this.statusList.filter(f => f.screeningStatusId == casestatusId);
      if (casestatus != null && casestatus[0].statusName == this.common.COMPLETED_STATUS) {
        this.dateFlag = true;
      } else {
        this.dateFlag = false;
      }
    }
    // this.maxDate = new Date();
    // if (event === true && (this.menuData.screenName === 'Pre-QC & DA Case Completion MIS' || this.menuData.screenName === 'QC Rejected History List' || 
    // this.menuData.screenName === 'Individual QC Approved List' || this.menuData.screenName === 'Daily Tracker Report' ||
    // this.menuData.screenName === 'Pre-QC & DA Completion - MIS' || this.menuData.screenName === 'QC Rejected History - MIS' || 
    // this.menuData.screenName === 'Individual QC Approved - MIS' || this.menuData.screenName === 'Daily Tracker' 
    // this.menuData.screenName === 'Address - MIS' || this.menuData.screenName === 'Criminal Check - MIS' || 
    // this.menuData.screenName === 'Employment - MIS' || this.menuData.screenName === 'Education - MIS' || this.menuData.screenName === 'Identity - MIS' ||
    // (this.menuData.screenName === 'Address' && this.dateFlag != true) || (this.menuData.screenName === 'Education' && this.dateFlag != true) || (this.menuData.screenName === 'Employment' &&this.dateFlag != true)
    // )) {
    //   // this.dynamicReportForm.get('fromDate')?.setValue(new Date(new Date().setDate(new Date().getDate() - (days - 1))));
    //   this.dynamicReportForm.get('fromDate')?.setValue(new Date(new Date().setDate(new Date().getDate() - 29)));
    //   this.dynamicReportForm.get('toDate')?.setValue(new Date());
    // } else 
    if (event === true) {
      this.dynamicReportForm.get('fromDate')?.setValue(new Date(new Date().setDate(new Date().getDate() - 119)));
      this.dynamicReportForm.get('toDate')?.setValue(new Date());
    } else {
      this.dynamicReportForm.get('fromDate')?.setValue('');
      this.dynamicReportForm.get('toDate')?.setValue('');
    }

  }
  GetDataList(methodName, value) {
    this.reportService[methodName](value).subscribe(res => {
      if (res) {
        this.searchCriFilter = false;
        this.outputDataReportList = res;
        if ((this.reportHeaderName === 'Closed Checks History' || this.reportHeaderName === 'Submission Pending Tracker' || this.reportModuleName === 'TAT Report' || this.reportModuleName ==='Color Code CAM Approval Tracker'
          || this.reportHeaderName === 'Address Report - MIS' || this.reportHeaderName === 'Employment Report - MIS' || this.reportHeaderName === 'Education Report - MIS' || this.reportHeaderName === 'Submission DE - QC Pending Tracker' || this.reportHeaderName === 'Pre-QC & DA Completion - MIS' || this.reportHeaderName === 'Closed Checks History - MIS' || this.reportHeaderName === 'Tech - M Closed Checks History') || this.reportHeaderName === 'Not Sent To Qc List' || this.reportHeaderName === 'Insufficiency Tracker' || this.reportHeaderName == 'Tech - M Submission Pending List'
          || this.reportHeaderName === 'For Research Employment Reject History' || this.menuData.screenName === 'Address - MIS' || this.menuData.screenName === 'Criminal Check - MIS' ||
          this.menuData.screenName === 'Employment - MIS' || this.menuData.screenName === 'Education - MIS' || this.menuData.screenName === 'Identity - MIS' ||
          this.menuData.screenName === 'Address Report - MIS' || this.menuData.screenName === 'Education Report - MIS' || this.menuData.screenName === 'Employment Report - MIS' || this.menuData.screenName === 'Criminal Report - MIS' || this.menuData.screenName === 'Identity Report - MIS' || this.reportHeaderName === 'Monthly completed cases with component details') {
          this.totalpages = res.headers.get('X-Total-Count');
          this.outputDataReportList = res.body;
        } else if (this.reportHeaderName === 'Individual QC Approved - MIS') {
          this.totalpages = res.headers.get('X-Total-Count');
          this.outputDataReportList = res.body.outputData;
        }
        this.outputDataReportList = this.getList(this.outputDataReportList);
        this.getColumns(this.outputDataReportList);
        this.loadReport();
        this.isShowAll = false;
        this.copyOutputDataReportList = this.common.CloneObject(this.outputDataReportList);

      }
    });
  }
  GetDataListQcReject(methodName, value) {
    this.applyPagination();
    this.reportService[methodName](value).subscribe(res => {
      if (res) {
        this.totalpages = res.headers.get('X-Total-Count');
        const resp = res.body;
        this.outputDataReportList = resp;
        this.outputDataReportList = this.getList(this.outputDataReportList);
        this.getColumns(this.outputDataReportList);
        this.loadReport();
        this.copyOutputDataReportList = this.common.CloneObject(this.outputDataReportList);
      }
    });
  }
  GetDataListQcRejectTracker(methodName, value) {
    this.applyPagination();
    this.reportService[methodName](value).subscribe(res => {
      if (res) {
        this.totalpages = res.headers.get('X-Total-Count');
        const resp = res.body;
        this.outputDataReportList = resp;
        this.outputDataReportList = this.getList(this.outputDataReportList);
        this.getColumns(this.outputDataReportList);
        this.loadReport();
        this.copyOutputDataReportList = this.common.CloneObject(this.outputDataReportList);
      }
    });
  }
  GetDataListWithHeader(methodName, value) {
    this.reportService[methodName](value).subscribe(res => {
      this.totalpages = res.headers.get('X-Total-Count');
      const resp = res.body;
      this.outputDataReportList = resp;
      this.outputDataReportList = this.getList(this.outputDataReportList);
      this.getColumns(this.outputDataReportList);
      this.loadReport();
      this.copyOutputDataReportList = this.common.CloneObject(this.outputDataReportList);

    });
  }
  GetListofQcReject(methodName, value) {
    this.applyPagination();
    this.reportService[methodName](value).subscribe(res => {
      if (res) {
        this.totalpages = res.headers.get('X-Total-Count');
        const resp = res.body;
        this.outputDataReportList = resp;
        this.outputDataReportList = this.getList(this.outputDataReportList);
        this.getColumns(this.outputDataReportList);
        this.loadReport();
        this.copyOutputDataReportList = this.common.CloneObject(this.outputDataReportList);
      }
    });
  }
  getList(list: any) {
    if (this.userData.applicationId === 2) {
      let flag = false;
      if (list && list.length > 0) {
        for (const ctrl in list[0]) {
          if (ctrl === 'clientId') {
            flag = true;
          }
        }
      }
      list = flag === true ? list.filter(x => this.userData.clientId.some(s => s === x.clientId.toString())) : list;
      return list;
    } else {
      return list;
    }
  }
  public checkCRT() {
    if (this.userData.teamName != 'CTS-IdentityTeam' &&
      this.userData.teamName != 'CTS-CRTTeam' && this.userData.teamName != 'CTS-CriminalTeam' &&
      this.userData.teamName != 'CTS-EmploymentTeam' && this.userData.teamName != 'CTS-EducationTeam' &&
      this.userData.teamName != 'CTS-SubmissionTeam' && this.userData.teamName != 'CTS-AddressTeam' &&
      this.userData.teamName != 'CTS-QCTeam') {
      return true;
    } else {
      return false;
    }
  }
  // cmd By megala -for individual api call -17/04/2024
  // getCommonLookUpDrpDwnDatas() {
  //   // Added by Naveen - Temporary work based on CRT and CST  department ID for getting componentList dropdown - Start
  //   // const mData = JSON.parse(sessionStorage.getItem('curMenu_data'));
  //   // if (mData.screenName == 'Address - MIS' || mData.screenName == 'Address Report - MIS') {
  //   //   this.userData.deptId = this.checkCRT() ? 2 : 22;
  //   // } else if (mData.screenName == 'Identity - MIS' || mData.screenName == 'Identity Report - MIS') {
  //   //   this.userData.deptId = this.checkCRT() ? 8 : 18;
  //   // } else if (mData.screenName == 'Criminal Check - MIS' || mData.screenName == 'Criminal Report - MIS') {
  //   //   this.userData.deptId = this.checkCRT() ? 3 : 15;
  //   // } else if (mData.screenName == 'Employment - MIS' || mData.screenName == 'Employment Report - MIS') {
  //   //   this.userData.deptId = this.checkCRT() ? 7 : 19;
  //   // } else {
  //   //   this.userData.deptId = this.userData.deptId;
  //   // }
  //   // End
  //   // this.reportService.getCommonLookUpData(this.userData).subscribe(res => {
  //   //   if (res != null) {
  //   //     this.vendorList = res.vendorList;
  //   //     const menuData = JSON.parse(sessionStorage.getItem('curMenu_data'));
  //   //     switch (menuData.screenName) {
  //   //       case 'Not Sent To Qc List':
  //   //         // this.componentList = res.componentList;
  //   //         // this.getAllClient();
  //   //         break;
  //   //       case 'QC Rejected History List':
  //   //         //this.componentList = res.componentList;
  //   //         //this.clientList = res.clientList;
  //   //         break;
  //   //       case 'Call Back Details':
  //   //         //this.statusList = res.lstStatus;
  //   //         //this.componentList = res.componentList;
  //   //         //this.clientList = res.clientList;
  //   //         break;

  //   //       case 'Pending Component List':
  //   //         // this.statusList = res.pndngLstStatus;
  //   //         // this.componentList = res.componentList.filter(x => x.cancelFlag === false);
  //   //         // //this.clientList = res.clientList;
  //   //         // this.getAllClient();
  //   //         break;
  //   //       case 'Today Comments':
  //   //         // this.statusList = res.lstStatus;
  //   //         // this.componentList = res.componentList;
  //   //         //this.getAllClient();
  //   //         break;
  //   //       case 'Client Commented Cases':
  //   //         //this.statusList = res.lstStatus;
  //   //         //this.componentList = res.componentList;
  //   //         //this.clientList = res.clientList.filter((item) => item.clientId !== 0);
  //   //         //this.getAllClient();
  //   //         break;
  //   //       case 'File Level Tracker':
  //   //         this.statusList = res.lstStatus;
  //   //         this.componentList = res.componentList;
  //   //         //this.clientList = res.clientList.filter((item) => item.clientId !== 0);
  //   //         break;
  //   //       case 'Submission Pending List':
  //   //         this.statusList = res.lstStatus;
  //   //         this.componentList = res.componentList;
  //   //         //this.clientList = res.clientList;
  //   //         break;
  //   //       case 'Submission DE - QC Pending List':
  //   //         this.statusList = res.lstStatus;
  //   //         this.componentList = res.componentList;
  //   //         //this.clientList = res.clientList;
  //   //         break;
  //   //       case 'Insufficiency Tracker':
  //   //         //this.clientList = res.clientList;
  //   //         //this.getAllClient();
  //   //         break;
  //   //       case 'Client Closure Report MIS':
  //   //         //this.clientList = res.clientList;
  //   //         //this.getAllClient();
  //   //         break;
  //   //       case 'Daily Tracker Report':
  //   //         //this.getAllClient();
  //   //         //this.clientList = res.clientList;
  //   //         break;
  //   //       case 'BGV Report Tracker':
  //   //         //this.clientList = res.clientList;
  //   //         //this.getAllClient();
  //   //         break;
  //   //       case 'Submission List':
  //   //         //this.clientList = res.clientList;
  //   //         //this.getAllClient();
  //   //         break;
  //   //       case 'Closed Checks History':
  //   //         //this.clientList = res.clientList;
  //   //         //this.getAllClient();
  //   //         break;
  //   //       default:
  //   //         // this.clientList = res.clientList;
  //   //         this.componentList = res.componentList;
  //   //         this.statusList = res.lstStatus;
  //   //         // do not use this method in dropdown control
  //   //         // this.verificationIdList = res.verificationIdList;
  //   //         // this.initautoCompleteCtrl();
  //   //         this.getAllClient();
  //   //     }
  //   //     this.submitSearchValue(false);
  //   //   }
  //   // });

  // }
  sortBy(type: any) {
    this.isDesc = !this.isDesc;
    this.column = type;
    this.direction = this.isDesc ? 1 : -1;
  }
  getPage(event: any) {
    this.page = event;
  }
  getTotalPage(): number {
    if (this.outputDataReportList.length) {
      return Math.ceil(this.outputDataReportList.length / this.Hitemperpage);
    }
  }
  getAllClient() {
    this.reportService.getMISClient(this.userData.clientId).subscribe(res => {
      if (res) {
        this.clientList = res;
        this.initautoCompleteCtrl();
      }
    });
  }
  getStatus() {
    this.reportService.getStatus().subscribe(res => {
      if (res) {
        this.statusList = res
        this.initautoCompleteCtrl();
      }
    });

  }
  preventInfinite() {
    if (!this.Hitemperpage) {
      this.Hitemperpage = 1;
    }
  }
  toggle(data: any) {
    this.showSearch = !this.showSearch;

    if (this.showSearch) {
      this.showdSearch = true;
    } else {
      this.showdSearch = false;
    }
  }
  getTotalPages(totalRecords, rows) {
    //this.totalpages = Math.ceil((totalRecords) / rows);
    return Math.ceil((totalRecords) / rows);
  }
  navigateNxtPrevPage(pageNo, rows) {
    this.currentPage = pageNo / rows;
    this.tempCurrentPage = this.currentPage;
    this.submitSearchValue(true);
  }
  navigatePage(pageNo, rowscount) {
    if (+pageNo > this.totalpages || +pageNo <= 0) {
      this.currentPage = this.tempCurrentPage;
    } else {
      this.dtHistory.onPageChange({ first: ((pageNo - 1) * rowscount), rows: rowscount });
      this.tempCurrentPage = this.currentPage;
      this.submitSearchValue(true);

    }
  }
  //resetTable() {
  //this.currentPage = 1;
  // if (this.dtHistory) {
  //   this.dtHistory.reset();
  //   this.global.nativeElement.value = '';
  // }
  //}
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }
  resetForm() {
    this.dynamicReportForm.reset();
    this.dynamicReportForm.markAsPristine();
    this.initFormGroup();
    this.dynamicReportForm.controls.reportModuleName.setValue(this.reportModuleName);
    this.searchValueArr = [];
    this.outputDataReportList = [];
    this.page = 1;
    this.isEmptyRec = false;
    this.clientRefNoList = [];
    this.applicantId.setValue('');
    this.repType.setValue(0);
    this.currentPage = 1;
    this.searchValue = '';
    this.maxDate = this.currentDate;
    this.dynamicReportForm.get('fromDate')?.setValue('');
    this.dynamicReportForm.get('toDate')?.setValue('');
    // this.totalpages = 0;
    this.dtHistory.reset();
    this.Hitemperpage = 10;
    this.initautoCompleteCtrl();
    this.dynamicReportForm.get('monthly')?.setValue('');
    if (this.screenName === 'Today Comments') {
      this.reportHeaderName = 'Today Comments Report';
    }
    if (this.screenName === 'Address - MIS') {
      this.reportHeaderName = 'Address - MIS Tracker';
    }
    if (this.screenName === 'Address Report - MIS') {
      this.reportHeaderName = 'Address Report - MIS';
    }
    if (this.screenName === 'Education Report - MIS') {
      this.reportHeaderName = 'Education Report - MIS';
    }
    if (this.screenName === 'Employment Report - MIS') {
      this.reportHeaderName = 'Employment Report - MIS';
    }
    if (this.screenName === 'Criminal  Report - MIS') {
      this.reportHeaderName = 'Criminal Report - MIS';
    }
    if (this.screenName === 'Identity  Report - MIS') {
      this.reportHeaderName = 'Identity  Report - MIS';
    }
    if (this.screenName === 'Education - MIS') {
      this.reportHeaderName = 'Education - MIS Tracker';
      // this.dynamicReportForm.controls.compId.setValue(this.compId);
    }
    this.isShowAll = false;
  }

  initautoCompleteCtrl() {
    this.verifyIdControl = new AutoCompleteDropDown('Verification Id', 'verificationId', 'verificationId', 'verificationId',
      this.verificationIdList, '', this.dynamicReportForm, false, false, this.isveriIdCntrlReq, 'standard');
    this.componentControl = new AutoCompleteDropDown('Component Name', 'compId', 'compId', 'compName',
      this.componentList, '', this.dynamicReportForm, false, false, this.isCompCntrlReq, 'standard');
    this.clientNameControl = new AutoCompleteDropDown('Client Name', 'clientId', 'clientId', 'clientName', this.clientList,
      '', this.dynamicReportForm, false, false, this.isClientCntrlReq, 'standard');
    // tslint:disable-next-line: max-line-length
    // if (this.menuData.screenName === 'Address - MIS' || this.menuData.screenName === 'Criminal Check - MIS' || 
    // this.menuData.screenName === 'Employment - MIS' || this.menuData.screenName === 'Education - MIS' || this.menuData.screenName === 'Identity - MIS' ||
    // this.menuData.screenName === 'Address' || this.menuData.screenName === 'Education' || this.menuData.screenName === 'Employment') {
    //   // this.statusControl = new AutoCompleteDropDown('Screening Status', 'screeningStatusId', 'screeningStatusId', 'statusName', this.status,
    //   // '', this.dynamicReportForm, false, false, this.isStatusCntrlReq, 'standard');
    //   this.statusControl = new AutoCompleteDropDown('Case Status', 'caseStatus', 'value', 'value', this.status,
    //   '', this.dynamicReportForm, false, false, false, 'standard');
    // } else {
    this.statusControl = new AutoCompleteDropDown('Screening Status', 'screeningStatusId', 'screeningStatusId', 'statusName', this.statusList,
      '', this.dynamicReportForm, false, false, this.isStatusCntrlReq, 'standard');
    // }
    this.vendorControl = new AutoCompleteDropDown('Vendor', 'vendorId', 'vendorId', 'vendorName', this.vendorList,
      '', this.dynamicReportForm, false, false, this.isVendorCntrlReq, 'standard');
  }
  public removeValidator() {
    // tslint:disable-next-line:forin

    this.dynamicReportForm.get('fromDate')?.clearValidators();
    this.dynamicReportForm.get('fromDate')?.updateValueAndValidity();
    this.dynamicReportForm.get('toDate')?.clearValidators();
    this.dynamicReportForm.get('toDate')?.updateValueAndValidity();

  }
  public clearDate() {
    this.dynamicReportForm.get('fromDate')?.setValue(null);
    this.dynamicReportForm.get('fromDate')?.updateValueAndValidity();
    this.dynamicReportForm.get('toDate')?.setValue(null);
    this.dynamicReportForm.get('toDate')?.updateValueAndValidity();
    this.dynamicReportForm.get('monthly')?.setValue(false);
    this.dynamicReportForm.get('monthly')?.updateValueAndValidity();
  }
  removeSearchValue(key, index) {
    if (index > -1) {
      this.searchValueArr.splice(index, 1);
    }
    for (const ctrl in this.dynamicReportForm.controls) {
      if (ctrl === key) {
        this.dynamicReportForm.get(ctrl).setValue('');
      }
    }
  }
  // Added By Megala - for choose less than 120 days check box uncheck functionality // 30-04-2024 
  checkPeriod() {
    if (this.dynamicReportForm.get('monthly')?.value == true ||this.menuData.screenName === 'QC Rejected History') {
      const fromDate = moment(this.dynamicReportForm.get('fromDate')?.value);
      const todate = moment(this.dynamicReportForm.get('toDate')?.value);
      var dfDays = todate.diff(fromDate, 'days') + 1;
      // Added By Megala -for VTS2-2024-QC-0181 - sprint 20
      if (dfDays != 120 && this.menuData.screenName != 'QC Rejected History') {
        
        this.dynamicReportForm.get('monthly')?.setValue(false);
        
      }
      // Added By Megala -for VTS2-2024-QC-0181 - sprint 20
      else if(dfDays > 120 && (this.menuData.screenName === 'QC Rejected History')){
        this.dynamicReportForm.get('toDate')?.setErrors({incorrect:true});
        this.showTopCenter('warn', 'Failure Message', 'Date should less than 120 days');
      }else{
        if(dfDays <= 120 && (this.menuData.screenName === 'QC Rejected History')){
          this.dynamicReportForm.get('toDate')?.setErrors(null);
        }
      }
    }
  }

  getPropertyValue(event: any) {

    if (event.value !== '' && event.value !== null && Number(event.value)) {
      if (event.propertyName === 'clientId') {
        event.value = this.clientList.filter(x => x.clientId === event.value)[0].clientName;
        if (this.screenName === 'Today Comments') {
          this.reportHeaderName = event.value + ' Details';
        }
      } else if (event.propertyName === 'compId') {
        event.value = this.componentList.filter(x => x.compId === event.value)[0].compName;
        if (this.screenName === 'Address - MIS' && this.screenName === 'Criminal Check - MIS' && this.screenName === 'Education - MIS'
          && this.screenName === 'Identity - MIS' && this.screenName === 'Employment - MIS' && this.menuData.screenName === 'Address Report - MIS' && this.menuData.screenName === 'Education Report - MIS'
          && this.menuData.screenName === 'Employment Report - MIS' && this.menuData.screenName === 'Criminal Report - MIS' && this.menuData.screenName === 'Identity Report - MIS') {
          this.reportHeaderName = event.value + ' Tracker Report';
        }
      } else if (event.propertyName === 'screeningStatusId') {
        event.value = this.statusList.filter(x => x.screeningStatusId === event.value)[0].statusName;
      }
      else if (event.propertyName === 'verificationId') {

        event.value = this.verificationIdList.filter(x => x.vendorId === event.value)[0].verificationId;
      } else if (event.propertyName === 'vendorId') {
        event.value = this.vendorList.filter(x => x.vendorId === event.value)[0].vendorName;
      }
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
      for (const ctrl in this.dynamicReportForm.controls) {
        if (ctrl === event.propertyName) {
          const index = this.searchValueArr.findIndex(x => x.propertyName === ctrl);
          if (index > -1) {
            this.searchValueArr.splice(index, 1);
          }
        }
      }
    }
  }
  removeRefNo(refNo: any) {
    const index = this.clientRefNoList.indexOf(refNo);
    if (index >= 0) {
      this.clientRefNoList.splice(index, 1);
    }
  }
  addRefNo(input, value) {
    if ((value || '').trim()) {
      this.clientRefNoList.push(value.trim());
    }
    if (input) {
      input.value = '';
    }
  }
  searchListvalue() {
    // const clientIdlist = this.dynamicReportForm.controls.clientId.value.filter(m => m.clientId > 0);
    let clientId: any;
    // if (clientIdlist.length > 0) {
    clientId = this.dynamicReportForm.controls.clientids.value.map(m => m.clientId);
    this.dynamicReportForm.get('reportModuleName')?.setValue(this.reportModuleName);
    // }
    this.dynamicReportForm.controls.clientids.setValue(clientId);
    this.reportService.GetAllPendingComponentListMultipleClientId(this.dynamicReportForm.getRawValue()).subscribe(res => {
      if (res !== null) {
        this.outputDataReportList = res.component[0].outputData ? res.component[0].outputData : [];

        this.dynamicReportForm.controls.clientId.setValue([]);
        this.outputDataReportList = this.getList(this.outputDataReportList);
        this.getColumns(this.outputDataReportList);
        this.searchCriFilter = false;
        //this.resetTable();
      }
    });
  }

 //Added By Megala - for only choose 3month date restriction //27-05-2024
//  dateChaangeValidator(type: any) {
//   if(this.dynamicReportForm.get('monthly')?.value != true){
//   const fromDate = this.dynamicReportForm.get('fromDate')?.value;
//   const toDate = this.dynamicReportForm.get('toDate')?.value;  
//    if (fromDate && toDate) {    
//     this.month = 0;
//     this.days = 0;
//     this.years = 0;
//     var firstDate = moment(fromDate);
//     var secondDate =moment(toDate);    
//     const years = secondDate.diff(firstDate, 'years');
//     const months = secondDate.diff(firstDate, 'months') - (years * 12);
//     firstDate.add(years, 'years').add(months, 'months');
//           const days = secondDate.diff(firstDate, 'days');
//     if(months>0){
//     this.month = months;
//     }
//     if(years>0){
//     this.years = years;
//     }
//     if(days>0){
//     this.days = days;
//     }       
//     if ( (this.years == 0 && this.month == 3 && this.days>0)||(this.years == 0 && this.month > 3) ) {
//        this.dynamicReportForm.get('toDate')?.setErrors({ invalidRange: true });
//       } else {
//         this.dynamicReportForm.get('toDate')?.setErrors(null);
//     }    
//   }
// }
// }
 
  
  RefreshReportDetails() {
    this.reportSearchVm.compId = this.dynamicReportForm.get('compId')?.value;
    if (this.reportSearchVm.compId === null) {
      this.reportSearchVm.compId = 0;
    }
    // if ( this.screenName == 'TAT Report'||(this.dynamicReportForm.get('compId')?.value !== null && typeof this.dynamicReportForm.get('compId')?.value !== 'string' && this.dynamicReportForm.get('compId')?.value !== '' &&  this.dynamicReportForm.get('compId')?.value !== undefined && this.dynamicReportForm.get('compId')?.value !== 0))
    //  {
    if (this.screenName1 == 'File Level Tracker - MIS') {
      this.reportService.fileLevelTrackerReportDetails(this.reportSearchVm.compId).subscribe(res => {
        const response = res;
        if (res) {
          this.getModifiedDate();
          this.submitReSearchValue(true);
        }
      });
    } else if (this.screenName1 == 'QC Rejection Instance - MIS' || this.screenName1 == 'Individual QC Approved - MIS' || this.screenName1 == 'Closed Checks History - MIS') {
      this.reportService.SaveCommonIQcReportDetails(this.reportSearchVm.compId).subscribe(res => {
        const response = res;
        if (res) {
          this.getModifiedDate();
          this.submitReSearchValue(true);
        }
      });
    }
    // else {
    //   this.reportService.RefreshReportDetails(this.reportSearchVm.compId).subscribe(res => {
    //     const response = res;
    //     if(res: any) {this.getModifiedDate();}
    //   });
    // }
    else {
      this.reportService.RefreshReportDetails((this.screenName == 'TAT Report') ? 0 : this.dynamicReportForm.get('compId')?.value).subscribe(res => {
        const response = res;
        if (res) {
          this.getModifiedDate();
          this.submitReSearchValue(true);
        }
      });
    }
    //}
  }
  submitReSearchValue(flag, pageFlag?: any) {

    if (!this.getdFlag()) {
      var dateflag = this.getdateFlag();
      if (dateflag == false) {
        this.removeValidator();
      }
    }
    if (this.isShowMore && (this.isStatusCntrl || this.isCompCntrl || this.isVendorIdCntrl || this.isVeriCtrl)) {
      this.searchCriFilter = true;
    }
    this.menuData = JSON.parse(sessionStorage.getItem('curMenu_data'));

    let clientId: any;
    if (this.dynamicReportForm.valid && flag != false) {
      this.dynamicReportForm.controls.reportModuleName.setValue(this.reportModuleName);
      const fromDate = this.datepipe.transform(this.dynamicReportForm.controls.fromDate.value, 'yyyy-MM-dd');
      const toDate = this.datepipe.transform(this.dynamicReportForm.controls.toDate.value, 'yyyy-MM-dd');
      this.dynamicReportForm.controls.fromDate.reset(fromDate);
      this.dynamicReportForm.controls.toDate.reset(toDate);
      const form = this.dynamicReportForm.getRawValue();
      const data = { clientId: form.clientId, fromDate: form.fromDate, toDate: form.toDate, compId: form.compId, loginUserDetVm: this.userData };
      this.reportSearchVm.compId = this.dynamicReportForm.get('compId')?.value;
      this.reportSearchVm.clientids = this.dynamicReportForm.get('clientids')?.value ?
        this.dynamicReportForm.controls.clientids.value.map(m => m.clientId) : [];
      if (this.menuData.screenName === 'Address - MIS' || this.menuData.screenName === 'Criminal Check - MIS' ||
        this.menuData.screenName === 'Employment - MIS' || this.menuData.screenName === 'Education - MIS' || this.menuData.screenName === 'Identity - MIS' ||
        this.menuData.screenName === 'Address Report - MIS' || this.menuData.screenName === 'Education Report - MIS' || this.menuData.screenName === 'Employment Report - MIS'
        || this.menuData.screenName === 'Criminal Report - MIS' || this.menuData.screenName === 'Identity Report - MIS') {
        this.reportSearchVm.screeningStatusId = null;
      } else {
        this.reportSearchVm.screeningStatusId = this.dynamicReportForm.get('screeningStatusId')?.value;
      }
      // this.reportSearchVm.screeningStatusId = this.dynamicReportForm.get('screeningStatusId')?.value;
      this.reportSearchVm.teamName = this.dynamicReportForm.get('teamName')?.value;
      this.reportSearchVm.vendorId = this.dynamicReportForm.get('vendorId')?.value;
      this.reportSearchVm.fromDate = this.dynamicReportForm.get('fromDate')?.value;
      this.reportSearchVm.toDate = this.dynamicReportForm.get('toDate')?.value;
      this.reportSearchVm.reportModuleName = this.dynamicReportForm.get('reportModuleName')?.value;
      this.reportSearchVm.verificationId = this.dynamicReportForm.get('verificationId')?.value;
      this.reportSearchVm.monthly = this.dynamicReportForm.get('monthly')?.value;
      this.reportSearchVm.loginUserId = this.dynamicReportForm.get('loginUserId')?.value;
      this.reportSearchVm.statusGroupId = this.dynamicReportForm.get('screeningStatusId')?.value;

      if (this.reportHeaderName === 'Insufficiency Tracker') {
        this.applyPagination();
        this.GetDataList('GetInsufficiencyRaisedList', this.reportSearchVm);
      } else if (this.reportHeaderName === 'Not Sent To Qc List') {
        this.reportSearchVm.loginUserDetVm = this.userData;
        this.applyPagination();
        this.GetDataList('GetClosedCasedNotSendQc', this.reportSearchVm);
      }
      else if (this.reportHeaderName === 'QC Rejected History List') {
        this.reportSearchVm.rejectType = this.repType.value.lookUpName;
        this.reportSearchVm.loginUserDetVm = this.userData;
        if (this.repType.value.lookUpName === 'FinalQC') {
          this.GetDataListQcReject('GetFQcRejectHistory', this.reportSearchVm);
        }
        else {
          this.GetDataListQcReject('GetQcRejectHistory', this.reportSearchVm);
        }

      } else if (this.reportHeaderName === 'Tech - M QC Error Details') {
        this.GetDataList('GetMQCErrorReports', data);
      } else if (this.reportHeaderName === 'Tech - M Client Specific Report') {
        this.GetDataList('GetClientWiseTracker', { loginUserDetVm: this.userData, clientRefNo: this.clientRefNoList, fromDate: fromDate, toDate: toDate });
      } else if (this.reportHeaderName === 'Tech - M Applicant Details') {
        if (this.applicantId.valid) {
          this.GetDataList('GetTechMApplicationDetailsReport', this.applicantId.value);
        } else {
          if (flag === true) {
            this.applicantId.markAsTouched();
          }
        }
      }
      else if (this.reportHeaderName === 'Tech - M Submission Pending List') {
        this.reportSearchVm.applyPaging = flag;
        this.GetDataList('GetTechmSubmissionPendingList', this.reportSearchVm);
      }
      else if (this.reportHeaderName === 'QC Rejected History') {
        this.reportSearchVm.loginUserDetVm = this.userData;
        this.reportSearchVm.loginUserDetVm.clientId = this.dynamicReportForm.get('clientids')?.value ?
          this.dynamicReportForm.controls.clientids.value.map(m => m.clientId) : [];
        this.GetListofQcReject('GetallQcRejectHistory', this.reportSearchVm);
      } //Added By Megala - for VTS2-2023-Pre-QC-0112
      else if (this.reportHeaderName === 'Pre-QC Rejection History') {
        this.reportSearchVm.loginUserDetVm = this.userData;
        this.reportSearchVm.loginUserDetVm.clientId = this.dynamicReportForm.get('clientids')?.value ?
          this.dynamicReportForm.controls.clientids.value.map(m => m.clientId) : [];
        this.GetListofQcReject('getPreQCRejectReport', this.reportSearchVm);
      }
      //  else if (this.reportHeaderName === 'Tech - M CEA Details') {
      //   this.GetDataList('GetCEADetails', { loginUserDetVm: this.userData, clientRefNo: this.clientRefNoList });
      // } 
      else if (this.reportHeaderName === 'Tech - M Interim/Final Report') {
        this.reportService.GetQcReportType().subscribe(res => {
          this.repTypeList = res;
        });
        this.GetDataList('GetInterimFinalReportByReferenceNo', {
          loginUserDetVm: this.userData, clientRefNo: this.clientRefNoList,
          reportTypeId: this.repType.value.lookUpId, reportTypeName: (this.repType.value.lookUpName ? this.repType.value.lookUpName : '')
        });
      } else if (this.reportHeaderName === 'Submission List') {
        this.applyPagination();
        this.GetDataListWithHeader('GetSubmissionHistory', this.reportSearchVm);
        this.isShowAll = false;
        // this.GetDataList('GetSubmissionHistory', this.reportSearchVm);
      } else if (this.reportHeaderName === 'Components Completed Monthly list') {
        this.applyPagination();
        this.GetDataListWithHeader('GetComponentsCompletedMonthlylist', this.reportSearchVm);
        this.isShowAll = false;
      }
      //Added By Megala 02-02-2024
      else if (this.reportHeaderName === 'Monthly completed cases with component details') {
        this.applyPagination();
        this.GetDataList('GetMonthlyCompletedCasesComponentReport', this.reportSearchVm);
        this.isShowAll = false;
      }
      else if (this.reportHeaderName === 'Monthly SLA with color code') {
        this.applyPagination();
        this.GetDataList('GetMonthlySLAWithColorCodeCompleted', this.reportSearchVm);
        this.isShowAll = false;
      }
      else if (this.reportHeaderName === 'Closed Checks History') {
        this.reportSearchVm.applyPaging = flag;
        this.GetDataList('GetOpenAndClosedChecksHistory', this.reportSearchVm);
      }
      else if (this.reportHeaderName === 'Closed Checks History') {
        this.reportSearchVm.applyPaging = flag;
        this.GetDataList('GetOpenAndClosedChecksHistory', this.reportSearchVm);
      }
      else if (this.reportHeaderName === 'Client Summary') {
        this.applyPagination();
        this.GetDataListWithHeader('GetclientSummaryDetails', this.reportSearchVm);
        this.isShowAll = false;
      }
      else if (this.reportHeaderName === 'Tech - M Closed Checks History') {
        this.reportSearchVm.applyPaging = flag;
        this.GetDataList('GetTechMOpenAndClosedChecksHistory', this.reportSearchVm);
      }
      else if (this.reportHeaderName === 'Tech - M Client Report') {
        this.GetDataList('GetTechMClient', { loginUserDetVm: this.userData, clientRefNo: this.clientRefNoList, fromDate: fromDate, toDate: toDate });
      }
      else if (this.reportHeaderName === 'For Research Employment Reject History') {
        this.reportSearchVm.applyPaging = flag;
        this.GetDataList('GetAllFrRejectDetails', this.reportSearchVm);
      }
      else if (this.reportHeaderName === 'Submission Pending Tracker') {
        this.applyPagination();
        this.GetDataList('GetSubmissionPendingTracker', this.reportSearchVm);
      }
      else if (this.reportHeaderName === 'Submission DE - QC Pending Tracker') {
        this.applyPagination();
        this.GetDataList('GetSubmissionDEQCPendingTracker', this.reportSearchVm);
      }
      else if (this.reportHeaderName === 'Closed Checks History - MIS') {
        this.applyPagination();
        this.GetDataList('GetClosedChecksHistoryTracker', this.reportSearchVm);
      } // Added By Megala - For (sprint -22) VTS2-2024-CRT-0195
      else if (this.reportHeaderName === 'Color Code CAM Approval Tracker') {
        this.reportSearchVm.loginUserDetVm = this.userData;
        this.reportSearchVm.loginUserDetVm.clientId = this.dynamicReportForm.get('clientids')?.value ?
          this.dynamicReportForm.controls.clientids.value.map(m => m.clientId) : [];
        this.applyPagination();
        this.GetDataList('GetColourCodeCamApproval', this.reportSearchVm);
      }
      
      else if (this.reportHeaderName === 'Pre-QC & DA Completion - MIS') {
        this.applyPagination();
        this.GetDataList('GetPreQCDACaseCompletionMIS', this.reportSearchVm);
      }
      else if (this.reportHeaderName === 'Individual QC Approved - MIS') {
        this.applyPagination();
        this.GetDataList('GetIqcApprovedListMIS', this.reportSearchVm);
      }
      else if (this.reportHeaderName === 'QC Rejection Instance - MIS') {
        this.reportSearchVm.rejectType = this.repType.value.lookUpName;
        this.reportSearchVm.loginUserDetVm = this.userData;
        this.reportSearchVm.loginUserDetVm.clientId = this.dynamicReportForm.get('clientids')?.value ?
          this.dynamicReportForm.controls.clientids.value.map(m => m.clientId) : [];
        this.GetListofQcReject('GetallQcRejectHistoryMIS', this.reportSearchVm);
      }
      else if (this.reportHeaderName === 'Address Report - MIS' || this.reportHeaderName === 'Education Report - MIS' || this.reportHeaderName === 'Employment Report - MIS' ||
        // this.menuData.screenName === 'Address - MIS' || this.menuData.screenName === 'Criminal Check - MIS' || 
        // this.menuData.screenName === 'Employment - MIS' || this.menuData.screenName === 'Education - MIS' || this.menuData.screenName === 'Identity - MIS' ||
        this.menuData.screenName === 'Address Report - MIS' || this.menuData.screenName === 'Education Report - MIS' || this.menuData.screenName === 'Employment Report - MIS'
        || this.menuData.screenName === 'Criminal Report - MIS' || this.menuData.screenName === 'Identity Report - MIS') {
        this.applyPagination();
        this.GetDataList('GetAllMISReport', this.reportSearchVm);
      }
      else if (this.reportHeaderName === 'Monthly cumulative Cases and checks created') {
        // this.applyPagination(pageFlag);
        this.reportService.GetCummulativeMonthly(this.reportSearchVm).subscribe(resp => {
          if (resp) {
            const res = resp;
            this.getResp(res);
            if (!flag) {
              this.dynamicReportForm.get('monthly')?.setValue('');
            }
          }
        });
        // this.resetTable();
        this.reportSearchVm.globalSearch = false;
      }
      //Added By Megala
      else if (this.reportHeaderName == 'Submission Pending Tracker') {
        this.reportService.GetSubmissionPendingTracker(this.reportSearchVm).subscribe(resp => {
          if (resp) {
            const res = resp;
            this.getRespnew(res);
            if (!flag) {
              this.dynamicReportForm.get('monthly')?.setValue('');
            }
          }
        });
        // this.resetTable();
        this.reportSearchVm.globalSearch = false;
      }

      //Added By Megala -VTS2-2024-DEV-0197
      else if (this.reportHeaderName === 'TAT Report') {
        this.applyPagination();
        const statusData = this.statusList.filter(s => s.screeningStatusId == this.reportSearchVm.screeningStatusId);
        if (statusData != null && statusData[0].statusName == 'Completed') {
          this.reportSearchVm.PendingOrCompleted = 1;
        } else {
          this.reportSearchVm.PendingOrCompleted = 0;
        }
        this.GetDataList('GetTatReport', this.reportSearchVm);
      }

      else if (this.reportHeaderName == 'Submission DE - QC Pending Tracker') {
        this.reportService.GetSubmissionDEQCPendingTracker(this.reportSearchVm).subscribe(resp => {
          if (resp) {
            const res = resp;
            this.getRespnew(res);
            if (!flag) {
              this.dynamicReportForm.get('monthly')?.setValue('');
            }
          }
        });
        // this.resetTable();
        this.reportSearchVm.globalSearch = false;
      }
      else if (this.reportHeaderName == 'Pre-QC & DA Completion - MIS') {
        this.reportService.GetPreQCDACaseCompletionMIS(this.reportSearchVm).subscribe(resp => {
          if (resp) {
            const res = resp;
            this.getRespnew(res);
            if (!flag) {
              this.dynamicReportForm.get('monthly')?.setValue('');
            }
          }
        });
        // this.resetTable();
        this.reportSearchVm.globalSearch = false;
      }
      else if (this.reportHeaderName == 'Individual QC Approved - MIS') {
        this.reportService.GetIqcApprovedListMIS(this.reportSearchVm).subscribe(resp => {
          if (resp) {
            const res = resp;
            this.getRespnew(res);
            if (!flag) {
              this.dynamicReportForm.get('monthly')?.setValue('');
            }
          }
        });
        // this.resetTable();
        this.reportSearchVm.globalSearch = false;
      }
      else if (this.reportHeaderName == 'Closed Checks History - MIS') {
        this.reportService.GetClosedChecksHistoryTracker(this.reportSearchVm).subscribe(resp => {
          if (resp) {
            const res = resp;
            this.getRespnew(res);
            if (!flag) {
              this.dynamicReportForm.get('monthly')?.setValue('');
            }
          }
        });
        // this.resetTable();
        this.reportSearchVm.globalSearch = false;
      }
      // Added By Megala - For (sprint -22) VTS2-2024-CRT-0195
      else if (this.reportHeaderName == 'Color Code CAM Approval Tracker') {
        this.reportSearchVm.loginUserDetVm = this.userData;
        this.reportSearchVm.loginUserDetVm.clientId = this.dynamicReportForm.get('clientids')?.value ?
          this.dynamicReportForm.controls.clientids.value.map(m => m.clientId) : [];
        this.reportService.GetColourCodeCamApproval(this.reportSearchVm).subscribe(resp => {
          if (resp) {
            const res = resp;
            this.getRespnew(res);
            if (!flag) {
              this.dynamicReportForm.get('monthly')?.setValue('');
            }
          }
        });
        // this.resetTable();
        this.reportSearchVm.globalSearch = false;
      }
      else if (this.menuData.reportHeaderName === 'Address Report - MIS' || this.menuData.reportHeaderName === 'Education Report - MIS' || this.menuData.reportHeaderName === 'Employment Report - MIS'
        || this.menuData.reportHeaderName === 'Criminal Report - MIS' || this.menuData.reportHeaderName === 'Identity Report - MIS') {
        this.reportService.GetAllMISReport(this.reportSearchVm).subscribe(resp => {
          if (resp) {
            const res = resp;
            this.getRespnew(res);
            if (!flag) {
              this.dynamicReportForm.get('monthly')?.setValue('');
            }
          }
        });
        // this.resetTable();
        this.reportSearchVm.globalSearch = false;
      }
      else {
        this.applyPagination(pageFlag);
        this.reportService.getCommonReportOutputDetails(this.reportSearchVm).subscribe(resp => {
          if (resp) {
            this.totalpages = resp.headers.get('X-Total-Count');
            const res = resp.body;
            this.getResp(res);
            if (!flag) {
              this.dynamicReportForm.get('monthly')?.setValue('');
            }
          }
        });
        // this.resetTable();
        this.reportSearchVm.globalSearch = false;
      }
    }
  }
  getModifiedDate() {
    this.reportService.GetModifiedDate().subscribe(res => {
      if (res) {
        const rDate = this.datepipe.transform(res.modifiedDate, 'dd/MMM/yyyy');
        this.modifiedDate = res.lastModDate + ' ( ' + rDate + ' ) ';
      }
    })
  }
  submitSearchValue(flag, pageFlag?: any) {

    if (!this.getdFlag()) {
      var dateflag = this.getdateFlag();
      if (dateflag == false) {
        this.removeValidator();
      }
    }
    if (this.isShowMore && (this.isStatusCntrl || this.isCompCntrl || this.isVendorIdCntrl || this.isVeriCtrl)) {
      this.searchCriFilter = true;
    }
    this.menuData = JSON.parse(sessionStorage.getItem('curMenu_data'));
    if (this.menuData.screenName === 'Address - MIS' || this.menuData.screenName === 'Employment - MIS' || this.menuData.screenName === 'Criminal Check - MIS' || this.menuData.screenName === 'Identity - MIS'
      || this.menuData.screenName === 'Education - MIS' || this.menuData.screenName === 'Vendor Case List' || this.menuData.screenName === 'Address Report - MIS' || this.menuData.screenName === 'Education Report - MIS' || this.menuData.screenName === 'Employment Report - MIS'
      || this.menuData.screenName === 'Criminal Report - MIS' || this.menuData.screenName === 'Identity Report - MIS') {
      if (!this.dynamicReportForm.valid || (this.dynamicReportForm.get('compId')?.value === null)) {
        if (flag === true) {
          this.showTopCenter('warn', 'Failure Message', 'Please Fill Required Fields.');
        } else {
          this.searchCriFilter = false;
        }
        return;
      }
    }
    else if (this.reportHeaderName === 'QC Rejected History List') {
      if (!this.dynamicReportForm.valid) {
        if (flag === true) {
          this.showTopCenter('warn', 'Failure Message', 'Please Fill Required Fields.');
        } else {
          this.searchCriFilter = false;
        }
        return;
      }
      if (this.repType.value === 0) {
        if (flag === true) {
          this.showTopCenter('warn', 'Failure Message', 'Please Select Report Type');
        } else {
          this.searchCriFilter = false;
        }
        return;
      }
    }
    else {
      if (!this.dynamicReportForm.valid) {
        if (flag === true) {
          this.showTopCenter('warn', 'Failure Message', 'Please Fill Required Fields.');
        } else {
          this.searchCriFilter = false;
        }
        return;
      }
    }
    let clientId: any;
    if (this.dynamicReportForm.valid && flag != false) {
      this.dynamicReportForm.controls.reportModuleName.setValue(this.reportModuleName);
      const fromDate = this.datepipe.transform(this.dynamicReportForm.controls.fromDate.value, 'yyyy-MM-dd');
      const toDate = this.datepipe.transform(this.dynamicReportForm.controls.toDate.value, 'yyyy-MM-dd');
      this.dynamicReportForm.controls.fromDate.reset(fromDate);
      this.dynamicReportForm.controls.toDate.reset(toDate);
      const form = this.dynamicReportForm.getRawValue();
      const data = { clientId: form.clientId, fromDate: form.fromDate, toDate: form.toDate, compId: form.compId, loginUserDetVm: this.userData };
      this.reportSearchVm.compId = this.dynamicReportForm.get('compId')?.value;
      this.reportSearchVm.clientids = this.dynamicReportForm.get('clientids')?.value ?
        this.dynamicReportForm.controls.clientids.value.map(m => m.clientId) : [];
      if (this.menuData.screenName === 'Address - MIS' || this.menuData.screenName === 'Criminal Check - MIS' ||
        this.menuData.screenName === 'Employment - MIS' || this.menuData.screenName === 'Education - MIS' || this.menuData.screenName === 'Identity - MIS' ||
        this.menuData.screenName === 'Address Report - MIS' || this.menuData.screenName === 'Education Report - MIS' || this.menuData.screenName === 'Employment Report - MIS'
        || this.menuData.screenName === 'Criminal Report - MIS' || this.menuData.screenName === 'Identity Report - MIS') {
        this.reportSearchVm.screeningStatusId = null;
      } else {
        this.reportSearchVm.screeningStatusId = this.dynamicReportForm.get('screeningStatusId')?.value;
      }
      // this.reportSearchVm.screeningStatusId = this.dynamicReportForm.get('screeningStatusId')?.value;
      this.reportSearchVm.teamName = this.dynamicReportForm.get('teamName')?.value;
      this.reportSearchVm.vendorId = this.dynamicReportForm.get('vendorId')?.value;
      this.reportSearchVm.fromDate = this.dynamicReportForm.get('fromDate')?.value;
      this.reportSearchVm.toDate = this.dynamicReportForm.get('toDate')?.value;
      this.reportSearchVm.reportModuleName = this.dynamicReportForm.get('reportModuleName')?.value;
      this.reportSearchVm.verificationId = this.dynamicReportForm.get('verificationId')?.value;
      this.reportSearchVm.monthly = this.dynamicReportForm.get('monthly')?.value;
      this.reportSearchVm.loginUserId = this.dynamicReportForm.get('loginUserId')?.value;
      this.reportSearchVm.statusGroupId = this.dynamicReportForm.get('screeningStatusId')?.value;

      if (this.reportHeaderName === 'Insufficiency Tracker') {
        this.applyPagination();
        this.GetDataList('GetInsufficiencyRaisedList', this.reportSearchVm);
      }
      // else if (this.reportHeaderName === 'Employment - MIS') {n
      //   this.GetDataList('getEmploymentReportDetails', form);
      // }
      else if (this.reportHeaderName === 'Not Sent To Qc List') {
        this.reportSearchVm.loginUserDetVm = this.userData;
        this.applyPagination();
        this.GetDataList('GetClosedCasedNotSendQc', this.reportSearchVm);
      }
      else if (this.reportHeaderName === 'QC Rejected History List') {
        this.reportSearchVm.rejectType = this.repType.value.lookUpName;
        this.reportSearchVm.loginUserDetVm = this.userData;
        if (this.repType.value.lookUpName === 'FinalQC') {
          this.GetDataListQcReject('GetFQcRejectHistory', this.reportSearchVm);
        }
        else {
          this.GetDataListQcReject('GetQcRejectHistory', this.reportSearchVm);
        }

      } else if (this.reportHeaderName === 'Tech - M QC Error Details') {
        this.GetDataList('GetMQCErrorReports', data);
        // } else if (this.reportHeaderName === 'Call Back Details') {
        //   this.GetDataList('GetCompletedStatus', this.userData);
      } else if (this.reportHeaderName === 'Tech - M Client Specific Report') {
        this.GetDataList('GetClientWiseTracker', { loginUserDetVm: this.userData, clientRefNo: this.clientRefNoList, fromDate: fromDate, toDate: toDate });
      } else if (this.reportHeaderName === 'Tech - M Applicant Details') {
        if (this.applicantId.valid) {
          this.GetDataList('GetTechMApplicationDetailsReport', this.applicantId.value);
        } else {
          if (flag === true) {
            this.applicantId.markAsTouched();
          }
        }
      }
      else if (this.reportHeaderName === 'Tech - M Submission Pending List') {
        this.reportSearchVm.applyPaging = flag;
        this.GetDataList('GetTechmSubmissionPendingList', this.reportSearchVm);
      }
      else if (this.reportHeaderName === 'QC Rejected History') {
        this.reportSearchVm.loginUserDetVm = this.userData;
        this.reportSearchVm.loginUserDetVm.clientId = this.dynamicReportForm.get('clientids')?.value ?
          this.dynamicReportForm.controls.clientids.value.map(m => m.clientId) : [];
        this.GetListofQcReject('GetallQcRejectHistory', this.reportSearchVm);
      } //Added By Megala -For  VTS2-2023-Pre-QC-0112
      else if (this.reportHeaderName === 'Pre-QC Rejection History') {
        this.reportSearchVm.loginUserDetVm = this.userData;
        this.reportSearchVm.loginUserDetVm.clientId = this.dynamicReportForm.get('clientids')?.value ?
          this.dynamicReportForm.controls.clientids.value.map(m => m.clientId) : [];
        this.GetListofQcReject('getPreQCRejectReport', this.reportSearchVm);
      }
      // else if (this.reportHeaderName === 'Tech - M CEA Details') {
      //   this.GetDataList('GetCEADetails', { loginUserDetVm: this.userData, clientRefNo: this.clientRefNoList });
      // } 
      else if (this.reportHeaderName === 'Tech - M Interim/Final Report') {
        this.reportService.GetQcReportType().subscribe(res => {
          this.repTypeList = res;
        });
        this.GetDataList('GetInterimFinalReportByReferenceNo', {
          loginUserDetVm: this.userData, clientRefNo: this.clientRefNoList,
          reportTypeId: this.repType.value.lookUpId, reportTypeName: (this.repType.value.lookUpName ? this.repType.value.lookUpName : '')
        });
      } else if (this.reportHeaderName === 'Submission List') {
        this.applyPagination();
        this.GetDataListWithHeader('GetSubmissionHistory', this.reportSearchVm);
        this.isShowAll = false;
        // this.GetDataList('GetSubmissionHistory', this.reportSearchVm);
      } else if (this.reportHeaderName === 'Components Completed Monthly list') {
        this.applyPagination();
        this.GetDataListWithHeader('GetComponentsCompletedMonthlylist', this.reportSearchVm);
        this.isShowAll = false;
      }
      //Added By Megala 02-02-2024
      else if (this.reportHeaderName === 'Monthly completed cases with component details') {
        this.applyPagination();
        this.GetDataList('GetMonthlyCompletedCasesComponentReport', this.reportSearchVm);
        this.isShowAll = false;
      }
      else if (this.reportHeaderName === 'Monthly SLA with color code') {
        this.applyPagination();
        this.GetDataList('GetMonthlySLAWithColorCodeCompleted', this.reportSearchVm);
        this.isShowAll = false;
      }
      else if (this.reportHeaderName === 'Closed Checks History') {
        this.reportSearchVm.applyPaging = flag;
        this.GetDataList('GetOpenAndClosedChecksHistory', this.reportSearchVm);
      }
      else if (this.reportHeaderName === 'Client Summary') {
        this.applyPagination();
        this.GetDataListWithHeader('GetclientSummaryDetails', this.reportSearchVm);
        this.isShowAll = false;
      }
      else if (this.reportHeaderName === 'Tech - M Closed Checks History') {
        this.reportSearchVm.applyPaging = flag;
        this.GetDataList('GetTechMOpenAndClosedChecksHistory', this.reportSearchVm);
      }
      else if (this.reportHeaderName === 'Tech - M Client Report') {
        this.GetDataList('GetTechMClient', { loginUserDetVm: this.userData, clientRefNo: this.clientRefNoList, fromDate: fromDate, toDate: toDate });
      }
      else if (this.reportHeaderName === 'For Research Employment Reject History') {
        this.reportSearchVm.applyPaging = flag;
        this.GetDataList('GetAllFrRejectDetails', this.reportSearchVm);
      }

      //Add By Megala

      // else if (this.reportHeaderName === 'MIS - Report Tracker') {
      //   this.reportSearchVm.loginUserDetVm = this.userData;
      //   this.applyPagination();
      //   this.GetDataList('GetAllFrRejectDetails', this.reportSearchVm);
      // }
      else if (this.reportHeaderName === 'Submission Pending Tracker') {
        this.applyPagination();
        this.GetDataList('GetSubmissionPendingTracker', this.reportSearchVm);
      }
      else if (this.reportHeaderName === 'TAT Report') {
        this.applyPagination();
        this.GetDataList('GetTatReport', this.reportSearchVm);
      }
      else if (this.reportHeaderName === 'Submission DE - QC Pending Tracker') {
        this.applyPagination();
        this.GetDataList('GetSubmissionDEQCPendingTracker', this.reportSearchVm);
      }
      else if (this.reportHeaderName === 'Closed Checks History - MIS') {
        this.applyPagination();
        this.GetDataList('GetClosedChecksHistoryTracker', this.reportSearchVm);
      } // Added By Megala - For (sprint -22) VTS2-2024-CRT-0195
      else if (this.reportHeaderName === 'Color Code CAM Approval Tracker') {
        this.reportSearchVm.loginUserDetVm = this.userData;
        this.reportSearchVm.loginUserDetVm.clientId = this.dynamicReportForm.get('clientids')?.value ?
          this.dynamicReportForm.controls.clientids.value.map(m => m.clientId) : [];
        this.applyPagination();
        this.GetDataList('GetColourCodeCamApproval', this.reportSearchVm);
      }
      else if (this.reportHeaderName === 'Pre-QC & DA Completion - MIS') {
        this.applyPagination();
        this.GetDataList('GetPreQCDACaseCompletionMIS', this.reportSearchVm);
      }
      else if (this.reportHeaderName === 'Individual QC Approved - MIS') {
        this.applyPagination();
        this.GetDataList('GetIqcApprovedListMIS', this.reportSearchVm);
      }
      else if (this.reportHeaderName === 'QC Rejection Instance - MIS') {
        this.reportSearchVm.rejectType = this.repType.value.lookUpName;
        this.reportSearchVm.loginUserDetVm = this.userData;
        this.reportSearchVm.loginUserDetVm.clientId = this.dynamicReportForm.get('clientids')?.value ?
          this.dynamicReportForm.controls.clientids.value.map(m => m.clientId) : [];
        this.GetListofQcReject('GetallQcRejectHistoryMIS', this.reportSearchVm);

        // this.reportSearchVm.rejectType = this.repType.value.lookUpName;
        // this.reportSearchVm.loginUserDetVm = this.userData;
        // if (this.repType.value.lookUpName === 'FinalQC') {
        //   this.GetDataListQcRejectTracker('GetFQcRejectHistoryTracker', this.reportSearchVm);
        // }
        // else {
        //   this.GetDataListQcRejectTracker('GetIQcRejectHistoryTracker', this.reportSearchVm);
        // }
      }
      else if (this.reportHeaderName === 'Address Report - MIS' || this.reportHeaderName === 'Education Report - MIS' || this.reportHeaderName === 'Employment Report - MIS' ||
        // this.menuData.screenName === 'Address - MIS' || this.menuData.screenName === 'Criminal Check - MIS' || 
        // this.menuData.screenName === 'Employment - MIS' || this.menuData.screenName === 'Education - MIS' || this.menuData.screenName === 'Identity - MIS' ||
        this.menuData.screenName === 'Address Report - MIS' || this.menuData.screenName === 'Education Report - MIS' || this.menuData.screenName === 'Employment Report - MIS'
        || this.menuData.screenName === 'Criminal Report - MIS' || this.menuData.screenName === 'Identity Report - MIS') {
        this.applyPagination();
        this.GetDataList('GetAllMISReport', this.reportSearchVm);
      }
      else if (this.reportHeaderName === 'Monthly cumulative Cases and checks created') {
        // this.applyPagination(pageFlag);
        this.reportService.GetCummulativeMonthly(this.reportSearchVm).subscribe(resp => {
          if (resp) {
            const res = resp;
            this.getResp(res);
            if (!flag) {
              this.dynamicReportForm.get('monthly')?.setValue('');
            }
          }
        });
        // this.resetTable();
        this.reportSearchVm.globalSearch = false;
      }
      //Added By Megala
      else if (this.reportHeaderName == 'Submission Pending Tracker') {
        this.reportService.GetSubmissionPendingTracker(this.reportSearchVm).subscribe(resp => {
          if (resp) {
            const res = resp;
            this.getRespnew(res);
            if (!flag) {
              this.dynamicReportForm.get('monthly')?.setValue('');
            }
          }
        });
        // this.resetTable();
        this.reportSearchVm.globalSearch = false;
      }

      //Added By Megala -VTS2-2024-DEV-0197
      else if (this.reportHeaderName === 'TAT Report') {
        this.applyPagination();
        const statusData = this.statusList.filter(s => s.screeningStatusId == this.reportSearchVm.screeningStatusId);
        if (statusData != null && statusData[0].statusName == 'Completed') {
          this.reportSearchVm.PendingOrCompleted = 1;
        } else {
          this.reportSearchVm.PendingOrCompleted = 0;
        }
        this.GetDataList('GetTatReport', this.reportSearchVm);
      }

      else if (this.reportHeaderName == 'Submission DE - QC Pending Tracker') {
        this.reportService.GetSubmissionDEQCPendingTracker(this.reportSearchVm).subscribe(resp => {
          if (resp) {
            const res = resp;
            this.getRespnew(res);
            if (!flag) {
              this.dynamicReportForm.get('monthly')?.setValue('');
            }
          }
        });
        // this.resetTable();
        this.reportSearchVm.globalSearch = false;
      }
      else if (this.reportHeaderName == 'Pre-QC & DA Completion - MIS') {
        this.reportService.GetPreQCDACaseCompletionMIS(this.reportSearchVm).subscribe(resp => {
          if (resp) {
            const res = resp;
            this.getRespnew(res);
            if (!flag) {
              this.dynamicReportForm.get('monthly')?.setValue('');
            }
          }
        });
        // this.resetTable();
        this.reportSearchVm.globalSearch = false;
      }
      else if (this.reportHeaderName == 'Individual QC Approved - MIS') {
        this.reportService.GetIqcApprovedListMIS(this.reportSearchVm).subscribe(resp => {
          if (resp) {
            const res = resp;
            this.getRespnew(res);
            if (!flag) {
              this.dynamicReportForm.get('monthly')?.setValue('');
            }
          }
        });
        // this.resetTable();
        this.reportSearchVm.globalSearch = false;
      }
      else if (this.reportHeaderName == 'Closed Checks History - MIS') {
        this.reportService.GetClosedChecksHistoryTracker(this.reportSearchVm).subscribe(resp => {
          if (resp) {
            const res = resp;
            this.getRespnew(res);
            if (!flag) {
              this.dynamicReportForm.get('monthly')?.setValue('');
            }
          }
        });
        // this.resetTable();
        this.reportSearchVm.globalSearch = false;
      }
      // Added By Megala - For (sprint -22) VTS2-2024-CRT-0195
      else if (this.reportHeaderName == 'Color Code CAM Approval Tracker') {
        this.reportSearchVm.loginUserDetVm = this.userData;
        this.reportSearchVm.loginUserDetVm.clientId = this.dynamicReportForm.get('clientids')?.value ?
          this.dynamicReportForm.controls.clientids.value.map(m => m.clientId) : [];
        this.reportService.GetColourCodeCamApproval(this.reportSearchVm).subscribe(resp => {
          if (resp) {
            const res = resp;
            this.getRespnew(res);
            if (!flag) {
              this.dynamicReportForm.get('monthly')?.setValue('');
            }
          }
        });
        // this.resetTable();
        this.reportSearchVm.globalSearch = false;
      }
      else if (this.menuData.reportHeaderName === 'Address Report - MIS' || this.menuData.reportHeaderName === 'Education Report - MIS' || this.menuData.reportHeaderName === 'Employment Report - MIS'
        || this.menuData.reportHeaderName === 'Criminal Report - MIS' || this.menuData.reportHeaderName === 'Identity Report - MIS') {
        this.reportService.GetAllMISReport(this.reportSearchVm).subscribe(resp => {
          if (resp) {
            const res = resp;
            this.getRespnew(res);
            if (!flag) {
              this.dynamicReportForm.get('monthly')?.setValue('');
            }
          }
        });
        // this.resetTable();
        this.reportSearchVm.globalSearch = false;
      }
      
      else {
        this.applyPagination(pageFlag);
        this.reportService.getCommonReportOutputDetails(this.reportSearchVm).subscribe(resp => {
          if (resp) {
            this.totalpages = resp.headers.get('X-Total-Count');
            const res = resp.body;
            this.getResp(res);
            if (!flag) {
              this.dynamicReportForm.get('monthly')?.setValue('');
            }
          }
        });
        // this.resetTable();
        this.reportSearchVm.globalSearch = false;
      }
    }
  }
  shievePagination(event: any) {
    this.shievePageNo = event;
    this.submitSearchValue(true);
  }

  globalSearch(searchvalue: any, pageFlag: any) {
    this.reportSearchVm.needTotal = true;
    if (searchvalue != '') {
      this.reportSearchVm.globalSearch = true;
    }
    // else {
    //   this.currentPage = 1;
    //   this.tempCurrentPage = 1;
    // }
    this.reportSearchVm.filters = searchvalue ? "(TransactionId|ServiceType)@=" + searchvalue : '';
    this.submitSearchValue(true, pageFlag);
  }

  LoadHistory(event: LazyLoadEvent) {

    this.loading = true;
    this.event = event;
    this.reportSearchVm.filters = '';
    this.reportSearchVm.page = (event.first + event.rows) / 10;
    this.reportSearchVm.pageSize = 10;
    this.reportSearchVm.applyPaging = true;
    this.reportSearchVm.needTotal = true;
    if (this.screenName1 == 'Closure Report' || this.screenName1 == 'Closed Checks History') {
      const sort = event.sortField;
      this.reportSearchVm.sorts = sort ? (event.sortOrder == -1 ? '-' : '') + sort : '';
      if (event.sortField) {
        this.searchValue = '';
        this.currentPage = 1;
        this.submitSearchValue(true);
      }
    }
  }
  getResp(res: any) {
    this.initautoCompleteCtrl();
    if (this.menuData.screenName == 'Monthly cumulative Cases and checks created') {
      this.outputDataReportList = res;
    } else if (res.component.length > 0) {
      if (this.menuData.screenName === 'Insufficiency History' || this.menuData.screenName === 'Submission Pending List' || this.menuData.screenName === 'Client Closure Report MIS' ||
        this.menuData.screenName === 'Submission DE - QC Pending List' || this.menuData.screenName === 'Call Back Details' || this.menuData.screenName === 'Daily Tracker Report'
        || this.menuData.screenName === 'Daily Tracker' || this.menuData.screenName === 'Color Code CAM Approval Tracker' 
        || this.menuData.screenName === 'All Qc Pending List' || this.menuData.screenName === 'Pre-QC & DA Case Completion MIS' || this.menuData.screenName === 'Pre Final Cases'
        || this.menuData.screenName === 'BGV Report Tracker' || this.menuData.screenName == 'Closure Report' || this.menuData.screenName == 'For Research Employment Reject History') {
        this.outputDataReportList = res.component[0];
      } else {
        this.outputDataReportList = res.component[0].outputData ? res.component[0].outputData : [];
      }

      this.outputDataReportList = this.getList(this.outputDataReportList);
      this.getColumns(this.outputDataReportList);
    }

    this.searchCriFilter = false;
  }
  //newgetresponse
  getRespnew(res: any) {
    this.initautoCompleteCtrl();
    if (this.menuData.screenName == 'Monthly cumulative Cases and checks created') {
      this.outputDataReportList = res;
    } else if (res.component.length > 0) {
      if (this.menuData.screenName === 'Insufficiency History' || this.menuData.screenName === 'Submission Pending List' || this.menuData.screenName === 'Client Closure Report MIS' ||
        this.menuData.screenName === 'Submission DE - QC Pending List' || this.menuData.screenName === 'Call Back Details' || this.menuData.screenName === 'Daily Tracker Report'
        || this.menuData.screenName === 'Daily Tracker' || this.menuData.screenName === 'Color Code CAM Approval Tracker' 
        || this.menuData.screenName === 'All Qc Pending List' || this.menuData.screenName === 'Pre-QC & DA Case Completion MIS' || this.menuData.screenName === 'Pre Final Cases'
        || this.menuData.screenName === 'BGV Report Tracker' || this.menuData.screenName == 'Closure Report' || this.menuData.screenName == 'For Research Employment Reject History') {
        this.outputDataReportList = res.component[0];
      } else {
        this.outputDataReportList = res.component[0].outputData ? res.component[0].outputData : [];
      }

      this.outputDataReportList = this.getList(this.outputDataReportList);
      this.getColumns(this.outputDataReportList);
    }

    this.searchCriFilter = false;
  }
  typeOfReject(value: any) {
    if (value === 'FQC') {
      this.outputDataReportList = this.copyOutputDataReportList.filter(x => x.errorType.toLowerCase() === 'Final Qc Reject'.toLowerCase());
    } else {
      this.outputDataReportList = this.copyOutputDataReportList.filter(x => x.errorType.toLowerCase() !== 'Final Qc Reject'.toLowerCase());
    }
    this.loadReport();
  }
  applyPagination(pageFlag?: any) {
    let filter = this.userData.filters;
    if (this.dynamicReportForm.value.clientName && this.dynamicReportForm.get('clientName')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'clientName@=' + this.dynamicReportForm.value.clientName;
    }
    // if (this.dynamicReportForm.value.verificationId && this.dynamicReportForm.get('verificationId')?.valid) {
    //   filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'verificationId@=' + this.dynamicReportForm.value.verificationId;
    // }
    if (this.dynamicReportForm.value.compName && this.dynamicReportForm.get('compName')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'compName@=' + this.dynamicReportForm.value.compName;
    } if (this.dynamicReportForm.value.statusName && this.dynamicReportForm.get('statusName')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'statusName@=' + this.dynamicReportForm.value.statusName;
    } if (this.dynamicReportForm.value.vendorName && this.dynamicReportForm.get('vendorName')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'vendorName@=' + this.dynamicReportForm.value.vendorName;
    } if (this.dynamicReportForm.value.from) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'from>=' + new DatePipe('en-Us').transform(this.dynamicReportForm.value.from, 'yyyy-MM-dd');
    } if (this.dynamicReportForm.value.to) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'to<=' + new DatePipe('en-Us').transform(this.dynamicReportForm.value.to, 'yyyy-MM-dd');
    }
    this.reportSearchVm.pageSize = this.shievePageSize;
    this.reportSearchVm.page = (pageFlag == false || pageFlag == undefined) ? this.currentPage : 1;
    // this.reportSearchVm.filters = filter
    this.reportSearchVm.filters = (this.reportSearchVm.filters == '' || this.reportSearchVm.filters == undefined) ? filter : this.reportSearchVm.filters;
    // this.reportSearchVm.sorts = '';
    this.reportSearchVm.sorts = this.reportSearchVm.sorts != '' ? this.reportSearchVm.sorts : '';
    this.reportSearchVm.applyPaging = true;
    this.reportSearchVm.needTotal = true;
  }
  showallH() {
    this.isShowAll = true;
    if (this.reportHeaderName === 'Submission List') {
      this.reportSearchVm.applyPaging = false;
      this.reportService.GetSubmissionHistory(this.reportSearchVm).subscribe(resp => {
        if (resp) {
          this.totalpages = resp.headers.get('X-Total-Count');
          const res = resp.body;
          // this.getResp(res);
          this.outputDataReportList = res;
          if (this.outputDataReportList.length > 0) {
            this.Hitemperpage = this.outputDataReportList.length;

          }
          this.getColumns(this.outputDataReportList);

        }
      })
    }
    else if (this.reportHeaderName === 'Components Completed Monthly list') {
      this.reportSearchVm.applyPaging = false;
      this.reportService.GetComponentsCompletedMonthlylist(this.reportSearchVm).subscribe(resp => {
        if (resp) {
          this.totalpages = resp.headers.get('X-Total-Count');
          const res = resp.body;
          // this.getResp(res);
          this.outputDataReportList = res;
          if (this.outputDataReportList.length > 0) {
            this.Hitemperpage = this.outputDataReportList.length;

          }
          this.getColumns(this.outputDataReportList);

        }
      })

    }
    //Added By Megala 02-02-2024
    else if (this.reportHeaderName === 'Monthly completed cases with component details') {
      this.reportSearchVm.applyPaging = false;
      this.reportService.GetMonthlyCompletedCasesComponentReport(this.reportSearchVm).subscribe(resp => {
        if (resp) {
          this.totalpages = resp.headers.get('X-Total-Count');
          const res = resp.body;
          // this.getResp(res);
          this.outputDataReportList = res;
          if (this.outputDataReportList.length > 0) {
            this.Hitemperpage = this.outputDataReportList.length;

          }
          this.getColumns(this.outputDataReportList);

        }
      })

    }
    else if (this.reportHeaderName === 'Monthly SLA with color code') {
      this.reportSearchVm.applyPaging = false;
      this.reportService.GetMonthlySLAWithColorCodeCompleted(this.reportSearchVm).subscribe(resp => {
        if (resp) {
          this.totalpages = resp;
          const res = resp;
          // this.getResp(res);
          this.outputDataReportList = res;
          if (this.outputDataReportList.length > 0) {
            this.Hitemperpage = this.outputDataReportList.length;

          }
          this.getColumns(this.outputDataReportList);

        }
      })

    } else if (this.menuData.screenName === 'QC Rejected History') {
      this.reportSearchVm.applyPaging = false;
      this.reportService.GetallQcRejectHistory(this.reportSearchVm).subscribe(resp => {
        if (resp) {
          this.totalpages = resp.headers.get('X-Total-Count');
          const res = resp.body;
          this.outputDataReportList = res;
          if (this.outputDataReportList.length > 0) {
            this.Hitemperpage = this.outputDataReportList.length;
          }
          this.getColumns(this.outputDataReportList);
        }
      });
    } //Added By Megala - For VTS2-2023-Pre-QC-0112
    else if (this.menuData.screenName === 'Pre-QC Rejection History') {
      this.reportSearchVm.applyPaging = false;
      this.reportService.getPreQCRejectReport(this.reportSearchVm).subscribe(resp => {
        if (resp) {
          this.totalpages = resp.headers.get('X-Total-Count');
          const res = resp.body;
          this.outputDataReportList = res;
          if (this.outputDataReportList.length > 0) {
            this.Hitemperpage = this.outputDataReportList.length;
          }
          this.getColumns(this.outputDataReportList);
        }
      });
    }
    else if (this.reportHeaderName === 'Client Summary') {
      this.reportSearchVm.applyPaging = false;
      this.reportService.GetclientSummaryDetails(this.reportSearchVm).subscribe(resp => {
        if (resp) {
          this.totalpages = resp.headers.get('X-Total-Count');
          const res = resp.body;
          // this.getResp(res);
          this.outputDataReportList = res;
          if (this.outputDataReportList.length > 0) {
            this.Hitemperpage = this.outputDataReportList.length;

          }
          this.getColumns(this.outputDataReportList);

        }
      })
    }
    // Added by megha
    else if (this.menuData.screenName === 'Submission Pending Tracker') {
      this.reportSearchVm.applyPaging = false;
      this.reportService.GetSubmissionPendingTracker(this.reportSearchVm).subscribe(resp => {
        if (resp) {
          this.totalpages = resp.headers.get('X-Total-Count');
          const res = resp.body;
          this.outputDataReportList = res;
          if (this.outputDataReportList.length > 0) {
            this.Hitemperpage = this.outputDataReportList.length;
          }
          this.getColumns(this.outputDataReportList);
        }
      });
    }
    // ADded By Megala -VTS2-2024-DEV-0197
    else if (this.menuData.screenName === 'TAT Report') {
      this.reportSearchVm.applyPaging = false;
      this.reportService.GetTatReport(this.reportSearchVm).subscribe(resp => {
        if (resp) {
          this.totalpages = resp.headers.get('X-Total-Count');
          const res = resp.body;
          this.outputDataReportList = res;
          if (this.outputDataReportList.length > 0) {
            this.Hitemperpage = this.outputDataReportList.length;
          }
          this.getColumns(this.outputDataReportList);
        }
      });
    }
    else if (this.menuData.screenName === 'Submission DE - QC Pending Tracker') {
      this.reportSearchVm.applyPaging = false;
      this.reportService.GetSubmissionDEQCPendingTracker(this.reportSearchVm).subscribe(resp => {
        if (resp) {
          this.totalpages = resp.headers.get('X-Total-Count');
          const res = resp.body;
          this.outputDataReportList = res;
          if (this.outputDataReportList.length > 0) {
            this.Hitemperpage = this.outputDataReportList.length;
          }
          this.getColumns(this.outputDataReportList);
        }
      });
    }
    else if (this.menuData.screenName === 'Pre-QC & DA Completion - MIS') {
      this.reportSearchVm.applyPaging = false;
      this.reportService.GetPreQCDACaseCompletionMIS(this.reportSearchVm).subscribe(resp => {
        if (resp) {
          this.totalpages = resp.headers.get('X-Total-Count');
          const res = resp.body;
          this.outputDataReportList = res;
          if (this.outputDataReportList.length > 0) {
            this.Hitemperpage = this.outputDataReportList.length;
          }
          this.getColumns(this.outputDataReportList);
        }
      });
    }
    else if (this.menuData.screenName === 'Individual QC Approved - MIS') {
      this.reportSearchVm.applyPaging = false;
      this.reportService.GetIqcApprovedListMIS(this.reportSearchVm).subscribe(resp => {
        if (resp) {
          this.totalpages = resp.headers.get('X-Total-Count');
          const res = resp.body.outputData;
          this.outputDataReportList = res;
          if (this.outputDataReportList.length > 0) {
            this.Hitemperpage = this.outputDataReportList.length;
          }
          this.getColumns(this.outputDataReportList);
        }
      });
    }
    else if (this.menuData.screenName === 'Closed Checks History - MIS') {
      this.reportSearchVm.applyPaging = false;
      this.reportService.GetClosedChecksHistoryTracker(this.reportSearchVm).subscribe(resp => {
        if (resp) {
          this.totalpages = resp.headers.get('X-Total-Count');
          const res = resp.body;
          this.outputDataReportList = res;
          if (this.outputDataReportList.length > 0) {
            this.Hitemperpage = this.outputDataReportList.length;
          }
          this.getColumns(this.outputDataReportList);
        }
      });
    }
    else if (this.menuData.screenName === 'Color Code CAM Approval Tracker') {
      this.reportSearchVm.loginUserDetVm = this.userData;
        this.reportSearchVm.loginUserDetVm.clientId = this.dynamicReportForm.get('clientids')?.value ?
          this.dynamicReportForm.controls.clientids.value.map(m => m.clientId) : [];
      this.reportSearchVm.applyPaging = false;
      this.reportService.GetColourCodeCamApproval(this.reportSearchVm).subscribe(resp => {
        if (resp) {
          this.totalpages = resp.headers.get('X-Total-Count');
          const res = resp.body;
          this.outputDataReportList = res;
          if (this.outputDataReportList.length > 0) {
            this.Hitemperpage = this.outputDataReportList.length;
          }
          this.getColumns(this.outputDataReportList);
        }
      });
    }
    
    else if (this.menuData.screenName === 'Address Report - MIS' || this.menuData.screenName === 'Education Report - MIS' || this.menuData.screenName === 'Employment Report - MIS'
      || this.menuData.screenName === 'Criminal Report - MIS' || this.menuData.screenName === 'Identity Report - MIS') {
      this.reportSearchVm.applyPaging = false;
      this.reportService.GetAllMISReport(this.reportSearchVm).subscribe(resp => {
        if (resp) {
          this.totalpages = resp.headers.get('X-Total-Count');
          const res = resp.body;
          this.outputDataReportList = res;
          if (this.outputDataReportList.length > 0) {
            this.Hitemperpage = this.outputDataReportList.length;
          }
          this.getColumns(this.outputDataReportList);
        }
      });
    }
    else {
      this.reportSearchVm.applyPaging = false;
      this.reportService.getCommonReportOutputDetails(this.reportSearchVm).subscribe(resp => {
        if (resp) {
          this.totalpages = resp.headers.get('X-Total-Count');
          const res = resp.body;
          this.getResp(res);
          if (this.outputDataReportList.length > 0) {
            this.Hitemperpage = this.outputDataReportList.length;

          }
        }
      });
    }

  }

  saveIFReport() {
    if (this.clientRefNoList.length > 0 && this.repType.value) {
      this.reportService.GetInterimFinalReportByReferenceNo({
        loginUserDetVm: this.userData, clientRefNo: this.clientRefNoList,
        reportTypeId: this.repType.value.lookUpId, reportTypeName: this.repType.value.lookUpName
      }).subscribe(res => {
        if (res) {
          this.outputDataReportList = res;
          this.outputDataReportList = this.getList(this.outputDataReportList);
          this.getColumns(this.outputDataReportList);
          this.showTopCenter('success', 'Success Message', 'Report saved successfully');
          this.clientRefNoList = [];
          this.repType.reset();
        } else {
          this.showTopCenter('warn', 'Failure Message', 'Report not saved');
        }
      });
    } else {
      this.showTopCenter('warn', 'Failure Message', 'Please Give Client Ref Number & Report Type');
    }
  }
  public onFilter(inputValue: string): void {
    const list: any[] = [];
    this.displayColumns.forEach(element => {
      list.push({ field: element.field, operator: 'contains', value: inputValue });
    });
    this.outputDataReportList = process(this.outputDataReportCopyList, { filter: { logic: 'or', filters: list } }).data;
    this.gridView = this.outputDataReportList;
  }
  getColumns(outputDataReportList: any) {
    if (outputDataReportList.length > 0) {
      const obj = outputDataReportList[0];
      // tslint:disable-next-line: only-arrow-functions
      const columnList = Object.keys(obj).filter(function (key) {
        if (obj.hasOwnProperty(key) && typeof key === 'string' ) {
          return key;
        }
      });
      //
      const compDetFlag = this.reportModuleName === 'QC Rejection Instance - MIS' || this.reportModuleName === 'Tech - M Client Specific Report' || this.reportModuleName === 'Tech - M Client Report';
      //
      // outputDataReportList.forEach(element => {
      //   columnList.forEach(ele => {
      //     if (ele.includes('Date') && element[ele] && element[ele].includes('-' && 'T')) {
      //       element[ele] = this.datepipe.transform(element[ele], 'dd/MM/yyyy hh:mm:ss a');
      //     }
      //     if ((element[ele] === null || element[ele] === '' || element[ele] === undefined)) {
      //       element[ele] = 'N/A';
      //     }
      //   });
      // });
      outputDataReportList.forEach(element => {
        columnList.forEach(ele => {
          if ((  this.reportHeaderName !== 'Monthly completed cases with component details' &&  this.reportModuleName !== 'Submission Pending List' && this.reportModuleName !== 'Submission Pending List' && this.reportModuleName !== 'Submission Pending Tracker' && this.reportModuleName !== 'TAT Report' && this.reportModuleName !== 'Tech - M Submission Pending List') && element[ele] && (ele === 'forResearchMemberName' || ele === 'dePreqcOwner' || ele === 'dePreQcOwner' || ele === 'candidateName'  || ele === 'qcOwner' || ele === 'screeningOwner' || ele === 'associateName' || ele === 'submissionOwner' || ele === 'deSubmittedBy' || ele === 'closedBy' || ele === 'frOwnerName'
            || ele === 'caseOwnerName' ||  ele === 'veOwnerName'|| ele === 'frOwnerName'||ele === 'dePreQcSubmittedBy' || ele === 'submissionOwnerName'||ele === 'rejectedBy' || ele === 'iqcOwnerName' || ele === 'closureName' || ele === 'deOwner' || ele === 'dePreQCOwner' || ele === 'requestedBy' || ele === 'insuffRaisedBy' || ele === 'insuffClosedBy' ||  ele === 'camMemberName'|| ele === 'veMemberName')) {
            element[ele] = element[ele].firstName ? (element[ele].firstName + (element[ele].middleName ?
              (' ' + element[ele].middleName) : '') + (element[ele].lastName ? (' ' + element[ele].lastName) : '')) : 'N/A';
          }
          if (ele === 'bvType' || ele === 'updatedToClient') {
            element[ele] = this.datepipe.transform(element[ele], 'dd/MM/yyyy hh:mm:ss a');
          }
          // if (ele === 'dateOfJoining') {
          //   element[ele] = this.datepipe.transform(element[ele], 'dd/MMM/yyyy');
          //   }
          if ((ele === 'componentDetail' && !compDetFlag) || (ele === 'componentName' && this.reportModuleName === 'Tech - M Client Report')) {
            const v: any[] = [];
            if (element[ele === 'componentName' ? 'componentDetail' : ele]) {
              element[ele === 'componentName' ? 'componentDetail' : ele].forEach((e, i) => {
                v.push(ele === 'componentName' ? e.componentName : ele === 'componentDetail'
                  ? (((i === 0 ? '' : '') + ' ' + (i + 1) + ').') + e.componentName + (e.subCompName ? (' ( ' + e.subCompName + ' ) ') : '') + // (e.status ? (' - ' + e.status) : '') +
                    (e.componentColorCode ? (' - ' + e.componentColorCode) : '')) : e.status);
              });
            }
            element[ele] = v.filter(x => x);
            element[ele] = element[ele].length > 0 ? element[ele] : 'N/A';
          }

          //RejectRemark
          if (ele === 'veRejectionRemarks' || ele === 'deRejectionRemarks' || ele === 'deQcRejectionRemarks' || ele === 'bothDeVeRejectionRemarks') {
            let QcReject: any[] = [];
            QcReject = element['qcRejectRemarks'].filter(x => x[ele]).map((el, index) => {
              return ((index + 1) + '). ' + el[ele]);
            });
            element[ele.replace('Remarks', 'Instance')] = QcReject[0] == undefined ? 0 : QcReject.length;
            element[ele] = QcReject[0] == undefined ? "N/A" : QcReject.join(' ');
          }

          //Court Details
          if (ele === 'courtName' || ele === 'courtLocation' || ele === 'jurisdiction' || ele === 'remarks') {
            let CourtDetails: any[] = [];
            CourtDetails = element['courtDetails'].filter(x => x[ele]).map((el, index) => {
              return ((index + 1) + '). ' + el[ele]);
            });
            element[ele] = CourtDetails[0] == undefined ? "N/A" : CourtDetails.join(' ');
          }

          //Closed check Insuff
          if (this.reportHeaderName === 'Closed Checks History') {
            if (ele === 'insuffStatus' || ele === 'insuffRemarks' || ele === 'insuffRaisedDate' || ele === 'insuffRaisedRemarks' || ele === 'insuffClearDate' || ele === 'insuffClearedRemarks') {
              let ClosedCheckDetails = null;
              if (element['compWiseInsufficiencyDetails'] !== null && element['compWiseInsufficiencyDetails'] !== undefined) {
                ClosedCheckDetails = element['compWiseInsufficiencyDetails'][ele];
              }
              let isDate = (ele === 'insuffRaisedDate' || ele === 'insuffClearDate');
              element[ele] = ClosedCheckDetails == null && !isDate ? "N/A" : ClosedCheckDetails;
            }
          }
          // if (this.reportHeaderName === 'Closed Checks History') {
          //   if (ele === 'insuffStatus' || ele === 'insuffRemarks' || ele === 'insuffRaisedDate' || ele === 'insuffRaisedRemarks' || ele === 'insuffClearDate' || ele === 'insuffClearedRemarks') {
          //     let ClosedCheckDetails = null;
          //     if (element['compWiseInsufficiencyDetails'] !== null && element['compWiseInsufficiencyDetails'] !== undefined)
          //       ClosedCheckDetails = element['compWiseInsufficiencyDetails'][ele];
          //     element[ele] = ClosedCheckDetails == null ? "N/A" : ClosedCheckDetails;
          //   }
          // }

          // Issue in new MIS report | Live environment | Critical issue
          if (element['addressPos'] !== null && ele === 'periodOfStay' && this.reportHeaderName != 'Address Report - MIS') {
            let addressPos = null;
            let addressId = 0;
            if (element['addressPos'] !== null && element['addressPos'] !== undefined) {
              if (element['addressInfo'] !== null && element['addressInfo'] !== undefined) {
                addressId = this.getAddressInfo(element['addressInfo'], "addressId");
              }
              if (addressId != null && addressId != undefined && addressId != 0) {
                let seperator = " & ";
                addressPos = '';
                element["addressPos"].forEach(e => {
                  addressPos += (addressPos ? seperator : "") + (e.periodOfStay ? e.periodOfStay : "") + (e.periodOfStayTo ? ((e.periodOfStay ? ' - ' : '') + e.periodOfStayTo) : '');
                });
                addressPos = addressPos ? "<center>" + addressPos + " </center>" : 'N/A'
              }
            }
            element[ele] = addressPos == null || addressPos == "" ? "N/A" : addressPos;
          }
          if (ele === 'address' && this.menuData.screenName !== 'Client Summary') {

            let address = null;
            if (element['addressInfo'] !== null && element['addressInfo'] !== undefined) {
              let addressId = this.getAddressInfo(element['addressInfo'], "addressId");
              if (addressId != null && addressId != undefined && addressId != 0) {
                let array: any[] = [];
                array.push(this.getAddressInfo(element['addressInfo'], "addLine1"));
                array.push(this.getAddressInfo(element['addressInfo'], "addLine2"));
                array.push(this.getAddressInfo(element['addressInfo'], "addLine3"));
                array.push(this.getAddressInfo(element['addressInfo'], "place"));
                array.push(this.getAddressInfo(element['addressInfo'], "city"));
                array.push(this.getAddressInfo(element['addressInfo'], "district"));
                array.push(this.getAddressInfo(element['addressInfo'], "state"));
                array.push(this.getAddressInfo(element['addressInfo'], "country"));
                address = array.filter(f => f != null && f != undefined && f != "").join(", ");
                let postalCode = this.getAddressInfo(element['addressInfo'], "postalCode");
                if (postalCode != null && postalCode != undefined && postalCode != '')
                  address = address + ' - ' + postalCode

                element['location'] = this.getAddressInfo(element['addressInfo'], "place");
                element['state'] = this.getAddressInfo(element['addressInfo'], "state");
                element['pincode'] = this.getAddressInfo(element['addressInfo'], "postalCode");
                element['landmark'] = this.getAddressInfo(element['addressInfo'], "addLine3");
                element['district'] = this.getAddressInfo(element['addressInfo'], "district");

                // let addLine1 = element['addressInfo']["addLine1"];
                // let addLine2 = element['addressInfo']["addLine2"];
                // let addLine3 = element['addressInfo']["addLine3"];
                // let place = element['addressInfo']["place"];
                // let city = element['addressInfo']["city"];
                // let district = element['addressInfo']["district"];
                // let state = element['addressInfo']["state"];
                // let country = element['addressInfo']["country"];
                // let postalCode = element['addressInfo']["postalCode"];
              }

            }
            element[ele] = address == null || address == "" ? "N/A" : address;
          }

          // //Insuff for MIS
          // if (this.reportHeaderName != 'Closed Checks History') {
          //   // || ele === 'insuffDays'
          //   if (ele === 'insuffLevel' || ele === 'insuffRaisedDate' || ele === 'insuffRaisedRemarks' || ele === 'insuffClearedDate' || ele === 'insuffClearedRemarks') {
          //     let insufficiencyDetails = null;
          //     if (element['insufficiencyDetails'] !== null && element['insufficiencyDetails'] !== undefined)
          //       insufficiencyDetails = element['insufficiencyDetails'][ele];
          //     // element[ele] = insufficiencyDetails == null ? "N/A" : insufficiencyDetails;
          //     let isDate = (ele === 'insuffRaisedDate' || ele === 'insuffClearedDate');
          //     element[ele] = insufficiencyDetails == null && !isDate ? "N/A" : insufficiencyDetails;
          //   }
          // }

          // if (ele === 'bvType' || ele === 'updatedToClient') {
          //   element[ele] = this.datepipe.transform(element[ele], 'dd/MM/yyyy hh:mm:ss a');
          // }

          // row as column
          if (ele === 'clientCustomFields') {
            if (element[ele]) {
              element[ele].forEach(e => {
                const property = e.fieldName;
                element[property] = e.fieldValue;
                if (!columnList.some(s => s === property)) {
                  columnList.push(property);
                }
              });
            }
          }
          if (ele === 'componentDetail' && compDetFlag && this.reportModuleName !== 'QC Rejection Instance - MIS') {
            if (element[ele]) {
              element[ele].forEach(e => {
                const property = e.componentName + (e.subCompName ? (' ( ' + e.subCompName + ' ) ') : '');
                element[property] = e.status;
                columnList.push(property);
              });
            }
          }
          if (ele === 'periodOfStay') {
            if (element[ele]) {
              element[ele] = element[ele].replace('<center>', '');
              element[ele] = element[ele].replace('</center>', '');
              element[ele] = element[ele].replace('<br>', '');
              element[ele] = element[ele].replace('</br>', '');
              element[ele] = element[ele].replace('<br/> & <br/>', '&');
            }
          }
        });
      });
      this.outputDataReportCopyList = this.common.CloneObject(this.outputDataReportList);
      this.displayColumns = [];
      // this.displayClosureColumns = [];

      let isCts: boolean = false;
      if (this.outputDataReportCopyList.length > 0)
        isCts = this.outputDataReportCopyList[0].ctsFlag;
      let excludedColums = ['individualComponentsCount','clientCatgoryId', 'vEmemberId','caMmemberId','caseNo', 'candidateId', 'workflowlookupId', 'sno', 'sNo', 'clientId', 'clientApprovalFlag', 'inivitionFlag','qcRejectRemarks', 'compId', 'screeningCompId', 'screeningId', 'addressId', 'vendorId', 'statusId', 'levelLookupId', 'addressTypeId', 'calendarDaysTatflag', 'levelLookup', 'colorStatusID', 'addressTypeCheckLookupId', 'genderLookupId', 'caseStatusLookupId', 'screenStatusId', 'colourStatusLookupId', 'createUserId', 'statusLookupId', 'clientCustomFields', 'screeningStatusId', 'errorTypeLookupId', 'ctsFlag', 'courtDetails', 'compWiseInsufficiencyDetails', 'insufficiencyDetails', 'addressInfo', 'addressPos'];
      if (!isCts) {
        excludedColums.push("modeofVerificationName");
        excludedColums.push("confirmationReceivedDate");
      }
      //Ajith : VTS2-2024-INT-0200
      if(this.outputDataReportCopyList[0].clientCatgoryId !== 2 ){
        excludedColums.push("country");
      }
      for (let col of columnList) {
        if (excludedColums.findIndex(c => c == col) == -1) {
          const spacedCol = col.split(/(?=[A-Z])/).join(' ');
          if (col == 'clientScreeningId') {
            this.displayColumns.push({ field: col, header: 'screeningId' });
          } else {
            this.displayColumns.push({ field: col, header: spacedCol });
          }
          // if (this.screenName1 == 'Closure Report') {
          //   this.displayClosureColumns.push({ field: col, header: spacedCol })
          // } else {
          //   this.displayColumns.push({ field: col, header: spacedCol });
          // }
        }
      }
      // for (const col of columnList) {
      //   if (col !== 'individualComponentsCount' && col !== 'workflowlookupId' && col !== 'clientId' && col !== 'clientApprovalFlag' && col !== 'inivitionFlag' && col !== 'qcRejectRemarks' && col !== 'compId' && col !== 'screeningCompId' && col !== 'screeningId' && col !== 'addressId' && col !== 'vendorId' && col !== 'statusId'
      //     && col !== 'levelLookupId' && col !== 'addressTypeId' && col !== 'calendarDaysTatflag' && col !== 'compInitiationDate' && col !== 'levelLookup' && col !== 'colorStatusID'
      //     && col !== 'addressTypeCheckLookupId' && col !== 'genderLookupId' && col !== 'caseStatusLookupId' && col !== 'screenStatusId' && col !== 'colourStatusLookupId' && col !== 'createUserId' && col !== 'statusLookupId' && col !== 'clientCustomFields' && col !== 'screeningStatusId' && col !== 'errorTypeLookupId') {
      //     const spacedCol = col.split(/(?=[A-Z])/).join(' ');
      //     if (this.screenName1 == 'Closure Report') {
      //       this.displayClosureColumns.push({ field: col, header: spacedCol })
      //     } else {
      //       this.displayColumns.push({ field: col, header: spacedCol });
      //     }
      //   }
      // }

      const isCAM = ((this.userData.teamName === 'CRTIndia' || this.userData.teamName === 'CRTTechMahindra' || this.userData.teamName
        === 'CRTAbroad') && (this.userData.subTeamName === 'CRTCAMTeam' || this.userData.subTeamName === null)) ||
        ((this.userData.teamName === null || this.userData.teamName === 'SeniorManager') && this.userData.applicationId === 1);
      //
      const fqc = this.reportModuleName === 'FQC Approved List' || this.reportModuleName === 'FQC Not Assigned List' ||
        this.reportModuleName === 'FQC Pending List';
      const iqc = this.reportModuleName === 'Individual QC Pending List' || this.reportModuleName === 'Individual QC Approved List';
      // if (this.screenName1 == 'Closure Report') {
      //   if (iqc || compDetFlag) {
      //     const i = this.displayClosureColumns.findIndex(x => x.field === 'componentDetail');
      //     if (i > -1) {
      //       this.displayClosureColumns.splice(i, 1);
      //     }
      //   } else if (fqc) {
      //     const i = this.displayClosureColumns.findIndex(x => x.field === 'component');
      //     if (i > -1) {
      //       this.displayClosureColumns.splice(i, 1);
      //     }
      //   } else if (!isCAM) {
      //     //
      //     const i = this.displayClosureColumns.findIndex(x => x.field === 'clientTat');
      //     if (i > -1) {
      //       this.displayClosureColumns.splice(i, 1);
      //     }
      //     //
      //   } else {
      //     if (this.userData.applicationId !== 1) {
      //       const ind = this.displayClosureColumns.findIndex(x => x.field === 'tatDays');
      //       if (ind > -1) {
      //         this.displayClosureColumns.splice(ind, 1);
      //       }
      //       const index = this.displayClosureColumns.findIndex(x => x.field === 'inProgressDays');
      //       if (index > -1) {
      //         this.displayClosureColumns.splice(index, 1);
      //       }
      //     }
      //   }
      // }
      // else {
      //   if (iqc || compDetFlag) {
      //     const i = this.displayColumns.findIndex(x => x.field === 'componentDetail');
      //     if (i > -1) {
      //       this.displayColumns.splice(i, 1);
      //     }
      //   } else if (fqc) {
      //     const i = this.displayColumns.findIndex(x => x.field === 'component');
      //     if (i > -1) {
      //       this.displayColumns.splice(i, 1);
      //     }
      //   } else if (!isCAM) {
      //     //
      //     const i = this.displayColumns.findIndex(x => x.field === 'clientTat');
      //     if (i > -1) {
      //       this.displayColumns.splice(i, 1);
      //     }
      //     //
      //   }
      //   if (this.userData.applicationId !== 1) {
      //     const ind = this.displayColumns.findIndex(x => x.field === 'tatDays');
      //     if (ind > -1) {
      //       this.displayColumns.splice(ind, 1);
      //     }
      //     const index = this.displayColumns.findIndex(x => x.field === 'inProgressDays');
      //     if (index > -1) {
      //       this.displayColumns.splice(index, 1);
      //     }
      //   }
      // }
      if (iqc || compDetFlag) {
        const i = this.displayColumns.findIndex(x => x.field === 'componentDetail');
        if (i > -1) {
          this.displayColumns.splice(i, 1);
        }
      } else if (fqc) {
        const i = this.displayColumns.findIndex(x => x.field === 'component');
        if (i > -1) {
          this.displayColumns.splice(i, 1);
        }
      } else if (!isCAM) {
        //
        const i = this.displayColumns.findIndex(x => x.field === 'clientTat');
        if (i > -1) {
          this.displayColumns.splice(i, 1);
        }
        //
      }
      if (this.userData.applicationId !== 1) {
        const ind = this.displayColumns.findIndex(x => x.field === 'tatDays');
        if (ind > -1) {
          this.displayColumns.splice(ind, 1);
        }
        const index = this.displayColumns.findIndex(x => x.field === 'inProgressDays');
        if (index > -1) {
          this.displayColumns.splice(index, 1);
        }
      }
      this.isEmptyRec = false;
    } else {
      this.isEmptyRec = true;
    }
    this.loadReport();
  }

  insuffSheets(insuffList: any) {
    const list = this.common.CloneObject(this.outputDataReportList);
    let sheets: any[] = [];
    for (const insuff of insuffList) {
      const data = list.filter(x => x.status === insuff);
      for (const d of data) {
        for (const w in d) {
          if (d[w]) {
            if (w.endsWith('Date')) {
              d[w] = this.datepipe.transform(this.common.getTimezoneOffset(d[w], false), 'dd/MM/yyyy hh:mm:ss a');
            }
            if (Array.isArray(d[w])) {
              d[w] = d[w].join(',');
            }
          } else {
            d[w] = 'N/A';
          }
        }
      }
      if (data.length > 0) {
        sheets.push({ name: insuff, data: data })
      }
    }
    return sheets;
  }

  getAddressInfo(element, item) {
    let value = null;
    if (element != null && element != undefined) {
      // let addressId = element['addressInfo']["addressId"];
      value = element[item];
    }
    return value;
  }

  showall() {
    if (this.outputDataReportList.length > 0) {
      this.Hitemperpage = this.outputDataReportList.length;
      this.loadReport();
    }
  }
  pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.Hitemperpage = take;
    this.loadReport();
  }

  private loadReport(): void {
    this.gridView = {
      data: this.outputDataReportList.slice(this.skip, this.skip + this.Hitemperpage),
      total: this.outputDataReportList.length
    };
  }
  exportExcel() {
    this.reportSearchVm.applyPaging = false;
    if (this.screenName === 'Daily Tracker Report') {
      this.reportService.dailyTrackerReportExcel(this.reportSearchVm).subscribe(resp => {
        if (resp) {
          this.outputDataExcel = resp;
          this.getExcelResp(this.outputDataExcel)
        }
      });
    }
    //added By Megala -04/06/2024
    // if (this.screenName === 'Daily Tracker') {
    //   this.reportService.dailyTrackerExcel(this.reportSearchVm).subscribe(resp => {
    //     if (resp) {
    //       this.outputDataExcel = resp;
    //       this.getExcelResp(this.outputDataExcel)
    //     }
    //   });
    // }
    else
      if (this.menuData.screenName === 'QC Rejected History') {
        this.reportService.GetallQcRejectHistory(this.reportSearchVm).subscribe(resp => {
          if (resp) {
            this.outputDataExcel = resp.body;
            this.getExcelResp(this.outputDataExcel)
            this.isShowAll = false;
          }
        });
      }
      else if (this.menuData.screenName === 'Individual QC Pending List') {
        this.reportService.getIqcPendingExcelReport(this.reportSearchVm).subscribe(resp => {
          if (resp) {
            this.outputDataExcel = resp.outputData;
            this.getExcelResp(this.outputDataExcel)
          }
        });
      }
      // Added By Megala - for VTS2-2023-Pre-QC-0112
      else if (this.menuData.screenName === 'Pre-QC Rejection History') {
        this.reportService.getPreQCRejectReport(this.reportSearchVm).subscribe(resp => {
          if (resp) {
            this.outputDataExcel = resp.body;
            this.getExcelResp(this.outputDataExcel)
          }
        });
      }
      else if (this.menuData.screenName === 'Submission List') {
        this.reportService.GetSubmissionHistory(this.reportSearchVm).subscribe(resp => {
          if (resp) {
            this.outputDataExcel = resp.body;
            this.getExcelResp(this.outputDataExcel)
            this.isShowAll = false;
          }
        });
      }
      else if (this.menuData.screenName === 'Components Completed Monthly list') {
        this.reportService.GetComponentsCompletedMonthlylist(this.reportSearchVm).subscribe(resp => {
          if (resp) {
            this.outputDataExcel = resp.body;
            this.getExcelResp(this.outputDataExcel)
            this.isShowAll = false;
          }
        });
      }
      //Added BY Megala 02-02-2024 
      else if (this.menuData.screenName === 'Monthly completed cases with component details') {
        this.reportService.GetMonthlyCompletedCasesComponentReport(this.reportSearchVm).subscribe(resp => {
          if (resp) {
            this.outputDataExcel = resp.body;
            this.getExcelResp(this.outputDataExcel)
            this.isShowAll = false;
          }
        });
      }
      else if (this.menuData.screenName === 'Monthly SLA with color code') {
        this.reportService.GetMonthlySLAWithColorCodeCompleted(this.reportSearchVm).subscribe(resp => {
          if (resp) {
            this.outputDataExcel = resp;
            this.getExcelResp(this.outputDataExcel)
            this.isShowAll = false;
          }
        });
      }
      else if (this.menuData.screenName === 'Monthly cumulative Cases and checks created') {
        this.GetCumulativeMonthlyCasesAndChecksReportList();

      }
      else if (this.menuData.screenName === 'Client Summary') {
        this.reportService.GetclientSummaryDetails(this.reportSearchVm).subscribe(resp => {
          if (resp) {
            this.outputDataExcel = resp.body;
            this.getExcelResp(this.outputDataExcel)
            this.isShowAll = false;
          }
        });
      }
      else if (this.menuData.screenName === 'QC Rejected History List') {
        if (this.repType.value.lookUpName === 'FinalQC') {
          this.reportService.GetFQcRejectHistory(this.reportSearchVm).subscribe(resp => {
            if (resp) {
              this.outputDataExcel = resp.body;
              this.getExcelResp(this.outputDataExcel)
              this.isShowAll = false;
            }
          });
        }
        else {
          this.reportService.GetQcRejectHistory(this.reportSearchVm).subscribe(resp => {
            if (resp) {
              this.outputDataExcel = resp.body;
              this.getExcelResp(this.outputDataExcel)
              this.isShowAll = false;
            }
          });
        }

      }
      else if (this.menuData.screenName === 'Closed Checks History') {
        this.reportService.GetOpenAndClosedChecksHistory(this.reportSearchVm).subscribe(resp => {
          if (resp) {
            this.outputDataExcel = resp.body;
            this.getExcelResp(this.outputDataExcel)
            this.isShowAll = false;
          }
        });
      }
      else if (this.menuData.screenName === 'Tech - M Closed Checks History') {
        this.reportService.GetTechMOpenAndClosedChecksHistory(this.reportSearchVm).subscribe(resp => {
          if (resp) {
            this.outputDataExcel = resp.body;
            this.getExcelResp(this.outputDataExcel)
            this.isShowAll = false;
          }
        });
      }
      else if (this.menuData.screenName === ' QC Rejected History List') {
        const fromDate = this.datepipe.transform(this.dynamicReportForm.controls.fromDate.value, 'yyyy-MM-dd');
        const toDate = this.datepipe.transform(this.dynamicReportForm.controls.toDate.value, 'yyyy-MM-dd');
        this.dynamicReportForm.controls.fromDate.reset(fromDate);
        this.dynamicReportForm.controls.toDate.reset(toDate);
        const form = this.dynamicReportForm.getRawValue();
        const data = { clientId: form.clientId, fromDate: form.fromDate, toDate: form.toDate, compId: form.compId, loginUserDetVm: this.userData };
        this.reportService.GetQcRejectHistory(data).subscribe(resp => {
          if (resp) {
            this.outputDataExcel = resp;
            this.getExcelResp(this.outputDataExcel)
          }
        });
      }

      else if (this.menuData.screenName === 'Insufficiency Tracker') {
        this.reportService.GetInsufficiencyRaisedList(this.reportSearchVm).subscribe(resp => {
          if (resp) {
            this.outputDataExcel = resp.body;
            this.getExcelResp(this.outputDataExcel)
          }
        });
      }

      else if (this.menuData.screenName === 'Not Sent To Qc List') {
        const fromDate = this.datepipe.transform(this.dynamicReportForm.controls.fromDate.value, 'yyyy-MM-dd');
        const toDate = this.datepipe.transform(this.dynamicReportForm.controls.toDate.value, 'yyyy-MM-dd');
        this.dynamicReportForm.controls.fromDate.reset(fromDate);
        this.dynamicReportForm.controls.toDate.reset(toDate);
        const form = this.dynamicReportForm.getRawValue();
        const data = { clientId: form.clientId, fromDate: form.fromDate, toDate: form.toDate, compId: form.compId, loginUserDetVm: this.userData };
        this.reportService.GetClosedCasedNotSendQc(this.reportSearchVm).subscribe(resp => {
          this.applyPagination();
          if (resp) {
            this.outputDataExcel = resp.body;
            this.getExcelResp(this.outputDataExcel)
          }
        });
      }

      else if (this.menuData.screenName === 'FQC Pending List') {
        this.reportService.getFqcPendingExcelReport(this.reportSearchVm).subscribe(resp => {
          if (resp) {
            this.outputDataExcel = resp.outputData;
            this.getExcelResp(this.outputDataExcel)
          }
        });
      }
      else if (this.reportHeaderName === 'For Research Employment Reject History') {
        this.reportService.GetAllFrRejectDetails(this.reportSearchVm).subscribe(resp => {
          if (resp) {
            this.outputDataExcel = resp.body;
            this.getExcelResp(this.outputDataExcel)
            this.isShowAll = false;
          }
        });
      }
      //Add by Megala
      // else if (this.reportHeaderName === 'MIS - Report Tracker') {
      //   this.reportService.GetAllFrRejectDetails(this.reportSearchVm).subscribe(resp => {
      //     if (resp) {
      //       this.outputDataExcel = resp.body;
      //       this.getExcelResp(this.outputDataExcel)
      //       this.isShowAll = false;
      //     }
      //   });
      // }
      else if (this.reportHeaderName === 'Submission Pending Tracker') {
        this.reportService.GetSubmissionPendingTracker(this.reportSearchVm).subscribe(resp => {
          if (resp) {
            this.outputDataExcel = resp.body;
            this.getExcelResp(this.outputDataExcel)
            this.isShowAll = false;
          }
        });
      }
      // Added By Megala -VTS2-2024-DEV-0197
      else if (this.reportHeaderName === 'TAT Report') {
        this.reportService.GetTatReport(this.reportSearchVm).subscribe(resp => {
          if (resp) {
            this.outputDataExcel = resp.body;
            this.getExcelResp(this.outputDataExcel)
            this.isShowAll = false;
          }
        });
      }
      else if (this.reportHeaderName === 'Submission DE - QC Pending Tracker') {
        this.reportService.GetSubmissionDEQCPendingTracker(this.reportSearchVm).subscribe(resp => {
          if (resp) {
            this.outputDataExcel = resp.body;
            this.getExcelResp(this.outputDataExcel)
            this.isShowAll = false;
          }
        });
      }
      else if (this.reportHeaderName === 'Pre-QC & DA Completion - MIS') {
        this.reportService.GetPreQCDACaseCompletionMIS(this.reportSearchVm).subscribe(resp => {
          if (resp) {
            this.outputDataExcel = resp.body;
            this.getExcelResp(this.outputDataExcel)
            this.isShowAll = false;
          }
        });
      }
      else if (this.reportHeaderName === 'Individual QC Approved - MIS') {
        this.reportService.GetIqcApprovedListMIS(this.reportSearchVm).subscribe(resp => {
          if (resp) {
            this.outputDataExcel = resp.body.outputData;
            this.getExcelResp(this.outputDataExcel)
            this.isShowAll = false;
          }
        });
      } 
      else if (this.reportHeaderName === 'Closed Checks History - MIS') {
        this.reportService.GetClosedChecksHistoryTracker(this.reportSearchVm).subscribe(resp => {
          if (resp) {
            this.outputDataExcel = resp.body;
            this.getExcelResp(this.outputDataExcel)
            this.isShowAll = false;
          }
        });
      }
      // Added By Megala - For (sprint -22) VTS2-2024-CRT-0195
    if (this.screenName === 'Color Code CAM Approval Tracker') {
      this.reportSearchVm.loginUserDetVm = this.userData;
        this.reportSearchVm.loginUserDetVm.clientId = this.dynamicReportForm.get('clientids')?.value ?
          this.dynamicReportForm.controls.clientids.value.map(m => m.clientId) : [];
      this.reportSearchVm.applyPaging = false;
      this.reportService.GetColourCodeCamApproval(this.reportSearchVm).subscribe(resp => {
        if (resp) {
          this.outputDataExcel = resp.body;
          this.getExcelResp(this.outputDataExcel)
          this.isShowAll = false;
        }
      });
    }
      else if (this.menuData.screenName === 'Address Report - MIS' || this.menuData.screenName === 'Education Report - MIS' || this.menuData.screenName === 'Employment Report - MIS' || this.menuData.screenName === 'Criminal Report - MIS'
        || this.menuData.screenName === 'Identity Report - MIS') {
        this.reportService.GetAllMISReport(this.reportSearchVm).subscribe(resp => {
          if (resp) {
            this.outputDataExcel = resp.body;
            this.getExcelResp(this.outputDataExcel)
            this.isShowAll = false;
          }
        });
      }
      else if (this.menuData.screenName === 'QC Rejection Instance - MIS') {
        if (this.repType.value.lookUpName === 'FinalQC') {
          this.reportService.GetFQcRejectHistoryTracker(this.reportSearchVm).subscribe(resp => {
            if (resp) {
              this.outputDataExcel = resp.body;
              this.getExcelResp(this.outputDataExcel)
              this.isShowAll = false;
            }
          });
        }
        else {
          this.reportService.GetIQcRejectHistoryTracker(this.reportSearchVm).subscribe(resp => {
            if (resp) {
              this.outputDataExcel = resp.body;
              this.getExcelResp(this.outputDataExcel)
              this.isShowAll = false;
            }
          });
        }

      }
      else if (this.menuData.screenName === 'QC Rejection Instance - MIS') {
        const fromDate = this.datepipe.transform(this.dynamicReportForm.controls.fromDate.value, 'yyyy-MM-dd');
        const toDate = this.datepipe.transform(this.dynamicReportForm.controls.toDate.value, 'yyyy-MM-dd');
        this.dynamicReportForm.controls.fromDate.reset(fromDate);
        this.dynamicReportForm.controls.toDate.reset(toDate);
        const form = this.dynamicReportForm.getRawValue();
        const data = { clientId: form.clientId, fromDate: form.fromDate, toDate: form.toDate, compId: form.compId, loginUserDetVm: this.userData };
        this.reportService.GetIQcRejectHistoryTracker(data).subscribe(resp => {
          if (resp) {
            this.outputDataExcel = resp;
            this.getExcelResp(this.outputDataExcel)
          }
        });
      }
      else {
        this.reportService.getCommonReportOutputDetails(this.reportSearchVm).subscribe(resp => {
          if (resp) {
            const res = resp.body;
            this.outputDataExcel = res.component[0]?.outputData == undefined ? res.component[0] : (res.component[0].outputData ? res.component[0].outputData : []);
            this.getExcelResp(this.outputDataExcel)
          }
        });
      }
  }
  getExcelResp(outputDataExcel: any) {
    if (outputDataExcel) {
      this.getColumnsExport(outputDataExcel);
      // const upper = this.screenName1 == 'Closure Report' ? this.common.CloneObject(this.displayClosureColumns)
      //   : this.common.CloneObject(this.displayColumns);
      const upper = this.common.CloneObject(this.displayColumns);
      upper.forEach(e => {
        e.header = e.header.toUpperCase();
      });
      if (this.reportHeaderName === 'Insufficiency Tracker') {
        const header = upper;
        const data = outputDataExcel;
        const workbook = new Workbook();
        this.getWorkSheet(workbook, header, data.filter(x => x.status === this.common.RAISED && !x.automationFlag), this.common.RAISED);
        this.getWorkSheet(workbook, header, data.filter(x => x.status === this.common.FULLY_CLE), this.common.FULLY_CLE);
        this.getWorkSheet(workbook, header, data.filter(x => x.status === this.common.PAR_CLE), this.common.PAR_CLE);
        this.getWorkSheet(workbook, header, data.filter(x => x.status === this.common.HOLD_CLE), this.common.HOLD_CLE);
        this.getWorkSheet(workbook, header, data.filter(x => x.status === this.common.RAISED && x.automationFlag === true), this.common.CLO_INS_QUERY);
        workbook.xlsx.writeBuffer().then((data1) => {
          const blob = new Blob([data1], { type: this.EXCEL_TYPE });
          fs.saveAs(blob, this.screenName);
        });
      } else {
        if (this.reportHeaderName === 'Submission List') {
          this.common.exportToExcel(upper, outputDataExcel, this.screenName, true);
        }
        else if (this.reportHeaderName === 'Monthly SLA with color code') {
          this.common.exportToExcel(upper, outputDataExcel, this.screenName, false, this.reportSearchVm.fromDate, this.reportSearchVm.toDate);
        }
        else {
          this.common.exportToExcel(upper, outputDataExcel, this.screenName);
        }
      }

    }
  }
  getColumnsExport(outputDataExcel: any) {
    if (outputDataExcel.length > 0) {
      const obj = outputDataExcel[0];
      // tslint:disable-next-line: only-arrow-functions
      const columnList = Object.keys(obj).filter(function (key) {
        if (obj.hasOwnProperty(key) && typeof key === 'string') {
          return key;
        }
      });

      const compDetFlag = this.reportModuleName === 'QC Rejection Instance - MIS' || this.reportModuleName === 'Tech - M Client Specific Report' || this.reportModuleName === 'Tech - M Client Report';

      outputDataExcel.forEach(element => {
        columnList.forEach(ele => {
          
          if ((this.reportModuleName !== 'Submission Pending List' && this.reportModuleName !== 'Monthly completed cases with component details' && this.reportModuleName !== 'Submission Pending Tracker' && this.reportModuleName !== 'TAT Report' && this.reportModuleName !== 'Tech - M Submission Pending List') && element[ele] && (ele === 'forResearchMemberName' || ele === 'candidateName' || ele === 'dePreqcOwner' || ele === 'dePreQcOwner' || ele === 'qcOwner' || ele === 'screeningOwner' || ele === 'associateName' || ele === 'submissionOwner' || ele === 'deSubmittedBy' || ele === 'closedBy' || ele === 'frOwnerName'
            || ele === 'caseOwnerName'|| ele === 'veOwnerName' || ele === 'frOwnerName' ||ele === 'dePreQcSubmittedBy' || ele === 'submissionOwnerName' ||ele === 'rejectedBy'|| ele === 'iqcOwnerName'|| ele === 'closureName' || ele === 'requestedBy' || ele === 'insuffRaisedBy' || ele === 'insuffClosedBy'||  ele === 'camMemberName'|| ele === 'veMemberName' )) {
            element[ele] = element[ele].firstName ? (element[ele].firstName + (element[ele].middleName ?
              (' ' + element[ele].middleName) : '') + (element[ele].lastName ? (' ' + element[ele].lastName) : '')) : 'N/A';
          }
          if (ele === 'bvType' || ele === 'updatedToClient') {
            element[ele] = this.datepipe.transform(element[ele], 'dd/MM/yyyy hh:mm:ss a');
          }
          // if (ele === 'dateOfJoining') {
          //   element[ele] = this.datepipe.transform(element[ele], 'dd/MMM/yyyy');
          //   }
          if ((ele === 'componentDetail' && !compDetFlag) || (ele === 'componentName' && this.reportModuleName === 'Tech - M Client Report')) {
            const v: any[] = [];
            if (element[ele === 'componentName' ? 'componentDetail' : ele]) {
              element[ele === 'componentName' ? 'componentDetail' : ele].forEach((e, i) => {
                v.push(ele === 'componentName' ? e.componentName : ele === 'componentDetail'
                  ? (((i === 0 ? '' : '') + ' ' + (i + 1) + ').') + e.componentName + (e.subCompName ? (' ( ' + e.subCompName + ' ) ') : '') + // (e.status ? (' - ' + e.status) : '') +
                    (e.componentColorCode ? (' - ' + e.componentColorCode) : '')) : e.status);
              });
            }
            element[ele] = v.filter(x => x);
            element[ele] = element[ele].length > 0 ? element[ele] : 'N/A';
          }

          //Excel
          if (ele === 'veRejectionRemarks' || ele === 'deRejectionRemarks' || ele === 'deQcRejectionRemarks' || ele === 'bothDeVeRejectionRemarks') {
            let QcReject: any[] = [];
            QcReject = element['qcRejectRemarks'].filter(x => x[ele]).map((el, index) => {
              return ((index + 1) + '). ' + el[ele]);
            });
            element[ele.replace('Remarks', 'Instance')] = QcReject[0] == undefined ? 0 : QcReject.length;
            element[ele] = QcReject[0] == undefined ? "N/A" : QcReject.join('<br> ');
          }

          //Court Details
          if (ele === 'courtName' || ele === 'courtLocation' || ele === 'jurisdiction' || ele === 'remarks') {
            let CourtDetails: any[] = [];
            CourtDetails = element['courtDetails'].filter(x => x[ele]).map((el, index) => {
              return ((index + 1) + '). ' + el[ele]);
            });
            element[ele] = CourtDetails[0] == undefined ? "N/A" : CourtDetails.join(' ');
          }

          //Closed check Insuff
          if (this.reportHeaderName === 'Closed Checks History') {
            if (ele === 'insuffStatus' || ele === 'insuffRemarks' || ele === 'insuffRaisedDate' || ele === 'insuffRaisedRemarks' || ele === 'insuffClearDate' || ele === 'insuffClearedRemarks') {
              let ClosedCheckDetails = null;
              if (element['compWiseInsufficiencyDetails'] !== null && element['compWiseInsufficiencyDetails'] !== undefined) {
                ClosedCheckDetails = element['compWiseInsufficiencyDetails'][ele];
              }
              let isDate = (ele === 'insuffRaisedDate' || ele === 'insuffClearDate');
              element[ele] = ClosedCheckDetails == null && !isDate ? "N/A" : ClosedCheckDetails;
            }
          }
          //Closed check Insuff
          // if (this.reportHeaderName === 'Closed Checks History') {
          //  if (ele === 'insuffStatus' || ele === 'insuffRemarks'  || ele === 'insuffRaisedDate' || ele === 'insuffRaisedRemarks' || ele === 'insuffClearDate'  || ele === 'insuffClearedRemarks') {
          //      let ClosedCheckDetails: any[] = [];
          //      ClosedCheckDetails = element['compWiseInsufficiencyDetails'].ele;
          //     element[ele] = ClosedCheckDetails == null ? "N/A" : ClosedCheckDetails;
          //  }
          // }

          if (element['addressPos'] !== null && ele === 'periodOfStay' && this.reportHeaderName != 'Address Report - MIS') {
            let addressPos = null;
            let addressId = 0;
            if (element['addressPos'] !== null && element['addressPos'] !== undefined) {
              if (element['addressInfo'] !== null && element['addressInfo'] !== undefined) {
                addressId = this.getAddressInfo(element['addressInfo'], "addressId");
              }
              if (addressId != null && addressId != undefined && addressId != 0) {
                let seperator = "<br/> & <br/>";
                let formater = "<center> {0} </center>";
                addressPos = '';
                element["addressPos"].forEach(e => {
                  addressPos += (addressPos ? seperator : "") + (e.periodOfStay ? e.periodOfStay : "") + (e.periodOfStayTo ? ((e.periodOfStay ? ' - ' : '') + e.periodOfStayTo) : '');
                });
                addressPos = addressPos ? "<center>" + addressPos + " </center>" : 'N/A'
              }
            }
            element[ele] = addressPos == null || addressPos == "" ? "N/A" : addressPos;
          }
          if (ele === 'address' && this.menuData.screenName !== 'Client Summary') {
            let address = null;
            if (element['addressInfo'] !== null && element['addressInfo'] !== undefined) {
              let addressId = this.getAddressInfo(element['addressInfo'], "addressId");
              if (addressId != null && addressId != undefined && addressId != 0) {
                let array: any[] = [];
                array.push(this.getAddressInfo(element['addressInfo'], "addLine1"));
                array.push(this.getAddressInfo(element['addressInfo'], "addLine2"));
                array.push(this.getAddressInfo(element['addressInfo'], "addLine3"));
                array.push(this.getAddressInfo(element['addressInfo'], "place"));
                array.push(this.getAddressInfo(element['addressInfo'], "city"));
                array.push(this.getAddressInfo(element['addressInfo'], "district"));
                array.push(this.getAddressInfo(element['addressInfo'], "state"));
                array.push(this.getAddressInfo(element['addressInfo'], "country"));
                address = array.filter(f => f != null && f != undefined && f != "").join(", ");
                let postalCode = this.getAddressInfo(element['addressInfo'], "postalCode");
                if (postalCode != null && postalCode != undefined && postalCode != '')
                  address = address + ' - ' + postalCode

                element['location'] = this.getAddressInfo(element['addressInfo'], "place");
                element['state'] = this.getAddressInfo(element['addressInfo'], "state");
                element['pincode'] = this.getAddressInfo(element['addressInfo'], "postalCode");
                element['landmark'] = this.getAddressInfo(element['addressInfo'], "addLine3");
                element['district'] = this.getAddressInfo(element['addressInfo'], "district");

                // let addLine1 = element['addressInfo']["addLine1"];
                // let addLine2 = element['addressInfo']["addLine2"];
                // let addLine3 = element['addressInfo']["addLine3"];
                // let place = element['addressInfo']["place"];
                // let city = element['addressInfo']["city"];
                // let district = element['addressInfo']["district"];
                // let state = element['addressInfo']["state"];
                // let country = element['addressInfo']["country"];
                // let postalCode = element['addressInfo']["postalCode"];
              }

            }
            element[ele] = address == null || address == "" ? "N/A" : address;
          }

          // //Insuff for MIS
          // if (this.reportHeaderName != 'Closed Checks History') {
          //   // || ele === 'insuffDays'
          //   if (ele === 'insuffLevel' || ele === 'insuffRaisedDate' || ele === 'insuffRaisedRemarks' || ele === 'insuffClearedDate' || ele === 'insuffClearedRemarks') {
          //     let insufficiencyDetails = null;
          //     if (element['insufficiencyDetails'] !== null && element['insufficiencyDetails'] !== undefined)
          //       insufficiencyDetails = element['insufficiencyDetails'][ele];
          //     // element[ele] = insufficiencyDetails == null ? "N/A" : insufficiencyDetails;
          //     let isDate = (ele === 'insuffRaisedDate' || ele === 'insuffClearedDate');
          //     element[ele] = insufficiencyDetails == null && !isDate ? "N/A" : insufficiencyDetails;
          //   }
          // }

          // row as column
          if (ele === 'clientCustomFields') {
            if (element[ele]) {
              element[ele].forEach(e => {
                const property = e.fieldName;
                element[property] = e.fieldValue;
                if (!columnList.some(s => s === property)) {
                  columnList.push(property);
                }
              });
            }
          }
          if (ele === 'componentDetail' && compDetFlag && this.reportModuleName !== 'QC Rejection Instance - MIS') {
            if (element[ele]) {
              element[ele].forEach(e => {
                const property = e.componentName + (e.subCompName ? (' ( ' + e.subCompName + ' ) ') : '');
                element[property] = e.status;
                columnList.push(property);
              });
            }
          }
        });
      });
      this.outputDataReportCopyList = this.common.CloneObject(this.outputDataExcel);
      this.displayColumns = [];
      // this.displayClosureColumns = [];
      let isCts: boolean = false;
      if (this.outputDataReportCopyList.length > 0)
        isCts = this.outputDataReportCopyList[0].ctsFlag;
      let excludedColums = ['workflowlookupId', 'caseNo','vEmemberId','caMmemberId','clientCatgoryId', 'candidateId', 'clientId', 'sNo', 'clientApprovalFlag', 'inivitionFlag', 'qcRejectRemarks', 'compId', 'screeningCompId', 'screeningId', 'addressId', 'vendorId', 'statusId', 'levelLookupId', 'addressTypeId', 'calendarDaysTatflag', 'levelLookup', 'colorStatusID', 'addressTypeCheckLookupId', 'genderLookupId', 'caseStatusLookupId', 'screenStatusId', 'colourStatusLookupId', 'createUserId', 'statusLookupId', 'clientCustomFields', 'screeningStatusId', 'errorTypeLookupId', 'ctsFlag', 'courtDetails', 'compWiseInsufficiencyDetails', 'insufficiencyDetails', 'addressInfo', 'addressPos'];

      if (!isCts) {
        excludedColums.push("modeofVerificationName");
        excludedColums.push("confirmationReceivedDate");
      }
      //Ajith : VTS2-2024-INT-0200
      if(this.outputDataReportCopyList[0].clientCatgoryId !== 2 ){
        excludedColums.push("country");
      }
      for (let col of columnList) {
        if (excludedColums.findIndex(c => c == col) == -1) {
          const spacedCol = col.split(/(?=[A-Z])/).join(' ');
          if (col == 'clientScreeningId') {
            this.displayColumns.push({ field: col, header: 'screeningId' });
          } else {
            this.displayColumns.push({ field: col, header: spacedCol });
          }
          // if (this.screenName1 == 'Closure Report') {
          //   this.displayClosureColumns.push({ field: col, header: spacedCol });
          // } else {
          //   this.displayColumns.push({ field: col, header: spacedCol });
          // }
        }
      }
      // for (const col of columnList) {
      //   if (col !== 'workflowlookupId' && col !== 'clientId' && col !== 'clientApprovalFlag' && col !== 'inivitionFlag' && col !== 'compId' && col !== 'qcRejectRemarks' && col !== 'screeningCompId' && col !== 'screeningId' && col !== 'addressId' && col !== 'vendorId' && col !== 'statusId'
      //     && col !== 'levelLookupId' && col !== 'addressTypeId' && col !== 'calendarDaysTatflag' && col !== 'compInitiationDate' && col !== 'levelLookup' && col !== 'colorStatusID'
      //     && col !== 'addressTypeCheckLookupId' && col !== 'genderLookupId' && col !== 'caseStatusLookupId' && col !== 'screenStatusId' && col !== 'colourStatusLookupId' && col !== 'createUserId' && col !== 'statusLookupId' && col !== 'clientCustomFields' && col !== 'screeningStatusId' && col !== 'errorTypeLookupId') {
      //     const spacedCol = col.split(/(?=[A-Z])/).join(' ');
      //     if (this.screenName1 == 'Closure Report') {
      //       this.displayClosureColumns.push({ field: col, header: spacedCol });
      //     } else {
      //       this.displayColumns.push({ field: col, header: spacedCol });
      //     }
      //   }
      // }

      const isCAM = ((this.userData.teamName === 'CRTIndia' || this.userData.teamName === 'CRTTechMahindra' || this.userData.teamName
        === 'CRTAbroad') && (this.userData.subTeamName === 'CRTCAMTeam' || this.userData.subTeamName === null)) ||
        ((this.userData.teamName === null || this.userData.teamName === 'SeniorManager') && this.userData.applicationId === 1);

      const fqc = this.reportModuleName === 'FQC Approved List' || this.reportModuleName === 'FQC Not Assigned List' ||
        this.reportModuleName === 'FQC Pending List';
      const iqc = this.reportModuleName === 'Individual QC Pending List' || this.reportModuleName === 'Individual QC Approved List';
      if (iqc || compDetFlag) {
        const i = this.displayColumns.findIndex(x => x.field === 'componentDetail');
        if (i > -1) {
          this.displayColumns.splice(i, 1);
        }
      } else if (fqc) {
        const i = this.displayColumns.findIndex(x => x.field === 'component');
        if (i > -1) {
          this.displayColumns.splice(i, 1);
        }
      } else if (!isCAM) {
        //
        const i = this.displayColumns.findIndex(x => x.field === 'clientTat');
        if (i > -1) {
          this.displayColumns.splice(i, 1);
        }

      }
      if (this.userData.applicationId !== 1) {
        const ind = this.displayColumns.findIndex(x => x.field === 'tatDays');
        if (ind > -1) {
          this.displayColumns.splice(ind, 1);
        }
        const index = this.displayColumns.findIndex(x => x.field === 'inProgressDays');
        if (index > -1) {
          this.displayColumns.splice(index, 1);
        }
      }
      // if (this.screenName1 == 'Closure Report') {
      //   if (iqc || compDetFlag) {
      //     const i = this.displayClosureColumns.findIndex(x => x.field === 'componentDetail');
      //     if (i > -1) {
      //       this.displayClosureColumns.splice(i, 1);
      //     }
      //   } else if (fqc) {
      //     const i = this.displayClosureColumns.findIndex(x => x.field === 'component');
      //     if (i > -1) {
      //       this.displayClosureColumns.splice(i, 1);
      //     }
      //   } else if (!isCAM) {
      //     //
      //     const i = this.displayClosureColumns.findIndex(x => x.field === 'clientTat');
      //     if (i > -1) {
      //       this.displayClosureColumns.splice(i, 1);
      //     }

      //   }
      //   if (this.userData.applicationId !== 1) {
      //     const ind = this.displayClosureColumns.findIndex(x => x.field === 'tatDays');
      //     if (ind > -1) {
      //       this.displayClosureColumns.splice(ind, 1);
      //     }
      //     const index = this.displayClosureColumns.findIndex(x => x.field === 'inProgressDays');
      //     if (index > -1) {
      //       this.displayClosureColumns.splice(index, 1);
      //     }
      //   }
      // } else {
      //   if (iqc || compDetFlag) {
      //     const i = this.displayColumns.findIndex(x => x.field === 'componentDetail');
      //     if (i > -1) {
      //       this.displayColumns.splice(i, 1);
      //     }
      //   } else if (fqc) {
      //     const i = this.displayColumns.findIndex(x => x.field === 'component');
      //     if (i > -1) {
      //       this.displayColumns.splice(i, 1);
      //     }
      //   } else if (!isCAM) {

      //     const i = this.displayColumns.findIndex(x => x.field === 'clientTat');
      //     if (i > -1) {
      //       this.displayColumns.splice(i, 1);
      //     }

      //   }
      //   if (this.userData.applicationId !== 1) {
      //     const ind = this.displayColumns.findIndex(x => x.field === 'tatDays');
      //     if (ind > -1) {
      //       this.displayColumns.splice(ind, 1);
      //     }
      //     const index = this.displayColumns.findIndex(x => x.field === 'inProgressDays');
      //     if (index > -1) {
      //       this.displayColumns.splice(index, 1);
      //     }
      //   }
      // }
      this.isEmptyRec = false;
    } else {
      this.isEmptyRec = true;
    }
  }
  // Added By Megala -for VTS2-2024-QC-0181 - sprint 20
  //new Excel download
  getExcelRespQcReject(outputDataExcel: any[]) {
    if (outputDataExcel) {
      this.getColumnsExport(outputDataExcel);
      
      outputDataExcel.forEach(ele=>{
        ele.componentName = ele.subCompName ? ele.componentName + '-' +ele.subCompName : (ele.componentName ? ele.componentName : 'N/A')
      });
      const upper = this.common.CloneObject(this.displayColumns);
      upper.forEach(e => {
        e.header = e.header.toUpperCase();
      });
      this.exportAsExcel(outputDataExcel, upper);
    }
  }

  exportAsExcel(outputDataExcel: any[], headers: any[]) {
    // Extract only the fields mentioned in headers
    const filteredData = outputDataExcel.map(row => {
      const filteredRow: any = {};
      headers.forEach(header => {
        filteredRow[header.header] = row[header.field];
      });
      return filteredRow;
    });
    this.exportMergedData(filteredData)
  }

  exportMergedData(filteredData): void {
    const mergedData = this.mergeData(filteredData);
    console.log(mergedData, 'test');
    this.exportToExcelFinal(mergedData)
  }
  exportToExcelFinal(mergedDataList: any[]) {
    const candidateData = mergedDataList.map(mergedData => {
      const length = mergedData['REJECTED DATE'].length;
      return Array.from({ length }, (_, index) => ({
        verficationId: mergedData['VERIFICATION ID'] || 'N/A',
        screeningId: mergedData['SCREENINGID'] || 'N/A',
        screeningFile: mergedData['CASE REFERENCE ID'] || 'N/A',
        applicantId: mergedData['APPLICANT ID'] || 'N/A',
        clientName: mergedData['CLIENT NAME'] || 'N/A',
        submissionOwnerName: mergedData['SUBMISSION OWNER NAME'] || 'N/A',
        frOwnerName: mergedData['FR OWNER NAME'] || 'N/A',
        veOwnerName: mergedData['VE OWNER NAME'] || 'N/A',
        componentName: mergedData['COMPONENT NAME'] || 'N/A',
        subComponentName: mergedData['SUB COMPONENT NAME'] || 'N/A',
        rejectedFrom: (mergedData['REJECTED FROM'] && mergedData['REJECTED FROM'][index] && mergedData['REJECTED FROM'][index]['REJECTED FROM']) || 'N/A',
        rejectedTo: (mergedData['REJECTED TO'] && mergedData['REJECTED TO'][index] && mergedData['REJECTED TO'][index]['REJECTED TO']) || 'N/A',
        iqcOwnerName: (mergedData['IQC OWNER NAME'] && mergedData['IQC OWNER NAME'][index] && mergedData['IQC OWNER NAME'][index]['IQC OWNER NAME']) || 'N/A',
        rejectedBy: (mergedData['REJECTED BY'] && mergedData['REJECTED BY'][index] && mergedData['REJECTED BY'][index]['REJECTED BY']) || 'N/A',
        rejectedDate: (mergedData['REJECTED DATE'] && mergedData['REJECTED DATE'][index] && mergedData['REJECTED DATE'][index]['REJECTED DATE']) || 'N/A',
        rejectedRemarks: (mergedData['REJECTED REMARKS'] && mergedData['REJECTED REMARKS'][index] && mergedData['REJECTED REMARKS'][index]['REJECTED REMARKS']) || 'N/A',
        
      }));
    }).reduce((acc, val) => acc.concat(val), []);
    // Create a worksheet from the rows of data
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(candidateData);
    // Set headers
    const headers = [
      ["VERIFICATION ID", "SCREENINGID", "CASE REFERENCE ID","APPLICANT ID", "CLIENT NAME",
        "SUBMISSION OWNER NAME", "FR OWNER NAME", "VE OWNER NAME", "COMPONENT NAME", "SUB COMPONENT NAME", "REJECTED FROM",
        "REJECTED TO", "IQC OWNER NAME", "REJECTED BY","REJECTED DATE","REJECTED REMARKS"]
    ];
  
  XLSX.utils.sheet_add_aoa(ws, headers, { origin: "A1" });

  // Apply styling to all header columns (A, B, C, D, E, F, etc.)
  const range = XLSX.utils.decode_range(ws['!ref']!);
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const cellRef = XLSX.utils.encode_cell({ r: 0, c: C });
    if (!ws[cellRef]) continue;

    ws[cellRef].s = {
      font: {
        name: 'Calibri',
        sz: 9,
        color: { rgb: '00FFFFFF' },
        bold: true
      },
      alignment: {
        vertical: 'center',
        horizontal: 'center',
        wrapText: '1',
      },
      fill: {
        patternType: 'solid',
        fgColor: { rgb: 'ff0e4872' },
        bgColor: { rgb: 'ff0e4872' },
      },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } }
      }
    };
  }
  
  // Apply border to all cells, but keep header styling intact
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
      if (!ws[cellRef]) continue;

      // Only apply the border if it's not already applied by the header styling
      if (!ws[cellRef].s) {
        ws[cellRef].s = {};
      }

      ws[cellRef].s.border = {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } }
      };
    }
  }

    // Define column sizes
    ws['!cols'] = [
      { wch: 25 }, 
      { wch: 15 }, 
      { wch: 30 }, 
      { wch: 25 }, 
      { wch: 15 }, 
      { wch: 15 }, 
      { wch: 15 }, 
      { wch: 30 }, 
      { wch: 50 }, 
      { wch: 30 }, 
      { wch: 15 }, 
      { wch: 15 }, 
      { wch: 15 }, 
      { wch: 50 }  
    ];
    // Initialize the merge array
    ws['!merges'] = [];
    // Merging cells for each unique candidate data
    let startRow = 1;  // Considering 1-based index and header row
    mergedDataList.forEach(mergedData => {
      const length = mergedData['REJECTED DATE'].length;
      ws['!merges'].push(
        { s: { r: startRow, c: 0 }, e: { r: startRow + length - 1, c: 0 } }, // Merge A2:A{startRow + length}
        { s: { r: startRow, c: 1 }, e: { r: startRow + length - 1, c: 1 } }, // Merge B2:B{startRow + length}
        { s: { r: startRow, c: 2 }, e: { r: startRow + length - 1, c: 2 } }, // Merge C2:C{startRow + length}
        { s: { r: startRow, c: 3 }, e: { r: startRow + length - 1, c: 3 } }, // Merge D2:D{startRow + length}
        { s: { r: startRow, c: 4 }, e: { r: startRow + length - 1, c: 4 } }, // Merge E2:E{startRow + length}
        { s: { r: startRow, c: 5 }, e: { r: startRow + length - 1, c: 5 } },  // Merge F2:F{startRow + length}
        { s: { r: startRow, c: 6 }, e: { r: startRow + length - 1, c: 6 } }, // Merge G2:A{startRow + length}
        { s: { r: startRow, c: 7 }, e: { r: startRow + length - 1, c: 7 } }, // Merge H2:B{startRow + length}
        { s: { r: startRow, c: 8 }, e: { r: startRow + length - 1, c: 8 } }, // Merge I2:C{startRow + length}
        { s: { r: startRow, c: 9 }, e: { r: startRow + length - 1, c: 9 } }, // Merge J2:D{startRow + length}
        { s: { r: startRow, c: 10 }, e: { r: startRow + length - 1, c: 10 } }, // Merge K2:E{startRow + length}
        { s: { r: startRow, c: 11 }, e: { r: startRow + length - 1, c: 10 } }, // Merge L2:E{startRow + length}
        
      );
      startRow += length;
    });
    // Create a new workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, this.menuData.screenName);
    // Write the workbook to a binary string
    const wbout: ArrayBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    // Save the file
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), this.menuData.screenName+'.xlsx');
    
  }
  mergeData(data: any[]): any[] {
    // Group and merge data by CLIENT REFERENCE NUMBER
    const groupedData = data.reduce((acc, item) => {
      const refNumber = item['VERIFICATION ID'];
            if (!acc[refNumber]) {
        acc[refNumber] = {
          'VERIFICATION ID': item['VERIFICATION ID'].trim(),
          'SCREENINGID': item['SCREENINGID'] ? item['SCREENINGID'].trim():'N/A',
          'CASE REFERENCE ID': item['CASE REFERENCE ID'] ? item['CASE REFERENCE ID'].trim() : 'N/A',
          'APPLICANT ID': item['APPLICANT ID'] ? item['APPLICANT ID'].trim() : 'N/A',
          'CLIENT NAME': item['CLIENT NAME'].trim(),
          'SUBMISSION OWNER NAME': item['SUBMISSION OWNER NAME'] ? item['SUBMISSION OWNER NAME'].trim():'N/A',
          'FR OWNER NAME': item['FR OWNER NAME'].trim(),
          'VE OWNER NAME': item['VE OWNER NAME'].trim(),
          'COMPONENT NAME': item['COMPONENT NAME'].trim(),
          'SUB COMPONENT NAME': item['SUB COMPONENT NAME'].trim(),
          'REJECTED FROM': [],
          'REJECTED TO': [],
          'IQC OWNER NAME': [],
          'REJECTED BY': [],  
          'REJECTED DATE':[],
          'REJECTED REMARKS': []
        };
      }
      acc[refNumber]['REJECTED FROM'].push({ 'REJECTED FROM': item['REJECTED FROM'] })
      acc[refNumber]['REJECTED TO'].push({ 'REJECTED TO': item['REJECTED TO'] })
      acc[refNumber]['IQC OWNER NAME'].push({ 'IQC OWNER NAME': item['IQC OWNER NAME'] })
      acc[refNumber]['REJECTED BY'].push({ 'REJECTED BY': item['REJECTED BY'] })
      acc[refNumber]['REJECTED DATE'].push({ 'REJECTED DATE': (item['REJECTED DATE'] ? this.datepipe.transform(item['REJECTED DATE'], 'dd/MMM/yyyy') : null) })
      acc[refNumber]['REJECTED REMARKS'].push({ 'REJECTED REMARKS': item['REJECTED REMARKS'] })
      
      
      return acc;
    }, {});

    const finalDate: any = Object.values(groupedData);
    return finalDate;
  }
  // Added By Megala -for VTS2-2024-QC-0181 - sprint 20 Ended
  //excel data end
  getWorkSheet(workbook, header, data, name) {
    if (data.length) {
      const worksheet = workbook.addWorksheet(name);
      const headerRow = worksheet.addRow(header.map(x => x = x.header));
      headerRow.eachCell((cell, number) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '0E4872' },
           bgColor: { argb: '#0E4872' },
        };
        cell.font = { name: 'Verdana', size: 9, bold: true, color: { argb: 'ffffff' } };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });
      data.forEach((element) => {
        const eachRow: any[] = [];
        header.forEach((headers) => {
          const value = element[headers.field] ? (headers.field.includes('Date') ? (this.datepipe.transform((this.common.
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
  exportExcel1() {
    // const objd = this.common.ConvertKeysToLowerCase(this.outputDataReportList);
    // if (objd) {
    //   this.outputDataExcel = objd;
    // }
    // if (this.outputDataExcel.length > 0) {
    //   const ws = XLSX.utils.json_to_sheet(this.outputDataExcel);
    // const colm: any[] = [];
    // // tslint:disable-next-line:prefer-for-of
    // for (let i = 0; i < this.displayColumns.length; i++) {
    //   let wid: any[] = [];
    //   wid = [
    //     { wch: 40 }
    //   ];
    //   colm.push(wid[0]);
    // }
    // ws['!cols'] = colm;
    //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
    //   XLSX.utils.book_append_sheet(wb, ws, this.screenName);
    //   XLSX.writeFile(wb, this.screenName + '.xlsx');
    // }
    const colm: any[] = [];
    // const upper = this.screenName1 == 'Closure Report' ? this.common.CloneObject(this.displayClosureColumns)
    //   : this.common.CloneObject(this.displayColumns);
    const upper = this.common.CloneObject(this.displayColumns);
    upper.forEach(e => {
      e.header = e.header.toUpperCase();
      colm.push({ wch: 40 });
    });
    if (this.reportHeaderName === 'Insufficiency Tracker') {
      const list = this.insuffSheets([this.common.RAISED, this.common.FULLY_CLE, this.common.PAR_CLE, this.common.HOLD_CLE]);
      let wb = XLSX.utils.book_new();
      for (var i = 0; i < list.length; i++) {
        let ws = XLSX.utils.json_to_sheet(list[i].data);
        ws['!cols'] = colm; // design for column width
        for (const w in ws) {
          if (w.includes('1') && w.length === 2) {
            ws[w].v = ws[w].v.split(/(?=[A-Z])/).join(' ').toUpperCase();
            // ws[w].v = '<th bgcolor="#D2691E" style="font-size:15px;color:white">' + ws[w].v + '</th>';
          }
        }
        XLSX.utils.book_append_sheet(wb, ws, list[i].name);
      }
      XLSX.writeFile(wb, (this.screenName + ' List.xls'));
    } else {
      this.common.exportToExcel(upper, this.outputDataReportList, this.screenName);
    }
  }

  //MonthlyCumulative
  GetCumulativeMonthlyCasesAndChecksReportList() {

    if (this.outputDataReportList) {
      this.excelColumns = [
        { field: 'monthYear', header: 'Month Year' },
        { field: 'casesDomestic', header: 'Cases Creation' },
        { field: 'checksDomestic', header: 'Checks created' },
        { field: 'casesTechM', header: 'Cases Creation' },
        { field: 'checksTechM', header: 'Checks created' },
        { field: 'casesCognizant', header: 'Cases Creation' },
        { field: 'checksCognizant', header: 'Checks created' },
        { field: 'checksOverseas', header: 'Checks created' },
        { field: 'totalCasesCreated', header: 'Total Cases' },
        { field: 'totalChecksCreated', header: 'Total Checks' },
      ];

      let tabtext = '<table border="1px">';
      let j = 0;
      const header = this.excelColumns;
      const lines = this.outputDataReportList.length;
      const filteredValue = this.outputDataReportList;
      let headerColos = '';
      let PheaderColos = ''
      PheaderColos = '<tr><th bgcolor="#0E4872" style="font-size:15px;color:white" colspan="1"> </th><th bgcolor="#0E4872" style="font-size:15px;color:white" colspan="2">Indian Clients </th><th bgcolor="#0E4872" style="font-size:15px;color:white" colspan="2">TechM </th><th bgcolor="#0E4872" style="font-size:15px;color:white" colspan="2">CTS Client </th><th bgcolor="#0E4872" style="font-size:15px;color:white" colspan="1">Overseas </th><th bgcolor="#0E4872" style="font-size:15px;color:white" colspan="2">Total </th></tr>'
      tabtext = tabtext + PheaderColos;

      header.forEach(h => {
        {
          headerColos = headerColos + '<th bgcolor="#0E4872" style="font-size:15px;color:white">' + h.header + '</th>';
        }
      });
      tabtext = tabtext + '<tr>' + headerColos + '</tr>';

      for (j = 0; j < lines; j++) {
        headerColos = '';
        header.forEach(h => {
          headerColos = headerColos + '<td style="font-size:12px">' + (filteredValue[j][h.field] === 0 ? 0 : filteredValue[j][h.field]) + '</td>';
        });
        tabtext = tabtext + '<tr>' + headerColos + '</tr>';
      }

      tabtext = tabtext + '</table>';
      tabtext = tabtext.replace(/<A[^>]*>|<\/A>/g, '');          // remove if u want links in your table
      tabtext = tabtext.replace(/<img[^>]*>/gi, '');             // remove if u want images in your table
      tabtext = tabtext.replace(/<input[^>]*>|<\/input>/gi, ''); // reomves input params
      const fileName = 'Cumulative Monthly Cases And Checks Report List.xls';
      const exceldata = new Blob([tabtext], { type: this.EXCEL_TYPE });
      if ((window.navigator as any).msSaveBlob) { // IE 10+
        (window.navigator as any).msSaveOrOpenBlob(exceldata, fileName);
      } else {
        const link = document.createElement('a'); // create link download file
        link.href = window.URL.createObjectURL(exceldata); // set url for link download
        link.setAttribute('download', fileName); // set attribute for link created
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }
  
}
export class ReportSearchVm {
  clientids: any[] = [];
  screeningStatusId: number;
  compId: number;
  teamName: string;
  vendorId: number;
  fromDate: any;
  toDate: any;
  reportModuleName: string;
  verificationId: number;
  monthly: any;
  loginUserDetVm: any;
  loginUserId: number;
  PendingOrCompleted: any;

  filters: string;
  page: number;
  pageSize: number;
  sorts: string;
  applyPaging: boolean;
  needTotal: boolean;
  globalSearch: boolean
  rejectType: string;
  caseStatus: string;
  statusGroupId: number;
}
