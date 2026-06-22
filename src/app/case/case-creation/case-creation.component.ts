import { Component, OnInit, ElementRef, ViewChild, TemplateRef } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';
import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';
import { CommonService } from 'src/app/common-methods/services/common.service';
// import { DataTable, MessageService, LazyLoadEvent } from 'primeng/primeng';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { Observable } from 'rxjs';
import { ScreeningService } from '../../common-methods/services/screening.service';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { CaseEntry, CaseCreation } from '../../common-methods/models/case-creation';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatChipInputEvent } from '@angular/material/chips';
// import { MatDialog, MatMenuTrigger, MatChipInputEvent } from '@angular/material/dialog';

import { map, startWith } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { MailTemplate } from 'src/app/common-methods/mail-templates/mail-template';
import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';
// import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { CaseComponentVm, CaseCreationView, CaseSubComponentVm } from 'src/app/common-methods/models/caseCreationView';
import { Router } from '@angular/router';
import { Workbook } from 'exceljs';
import { UserData } from 'src/app/common-methods/models/user';
import * as fs from 'file-saver';
// import * as FileSaver from 'file-saver';
import { Table } from 'primeng/table';
import { LazyLoadEvent } from 'primeng/api';
import { MessageService } from 'primeng/api';

export class BulkUploadDoc {
  fileName: string;
  clientId: number;
  clientName: string;
  siteId: number;
  siteName: string;
  autoAssignFlag: boolean;
  loggedId: number;
  bulkUploadDoc: any;
  uploadStatus: boolean;
  verflag: boolean;
  deptId: number;
  teamId: number;
  applicationId: number;
}
@Component({
  standalone: false,
  selector: 'app-case-creation',
  templateUrl: './case-creation.component.html',
  styleUrls: ['./case-creation.component.css']
})
export class CaseCreationComponent implements OnInit {
  searchValue: string = '';
  excelData: any;
  private skipFirstLazyLoad = false;
  itemperpage;
  shieveTotalCount = 0;
  shievePageNo = 1;
  shievePageSize = 10;
  ExcelFlag: boolean = false;
  clientRefDetail;
  showFlag = false;
  showGrid = false;
  currencyId: number = 0;
  caseCreation = new CaseCreation();
  casePriority: any[] = [];
  country: any;
  caseLists: any[] = [];
  caseCreationList: CaseEntry[] = [];
  refNumnList: any[] = [];
  caseCreationDupList: any[] = [];
  btnType: boolean;
  routePath = 'Screening / Clients Case Creation / Case Creation';
  isEdit: boolean;
  screenAuth: any = {};
  userData: UserData;
  clientControls!: AutoCompleteDropDown;
  // siteControls!: AutoCompleteDropDown;
  compControl = new UntypedFormControl();
  compFilteredOptions: Observable<string[]>;
  siteNoControl = new UntypedFormControl();
  siteNoFilteredOptions: Observable<string[]>;
  public dateTime: Date;
  caseCreationFormGroup: UntypedFormGroup;
  //  @ViewChild('dt', { static: false }) dt!: Table;
  // @ViewChild('dtable', { static: true }) dtable!: Table;
  // @ViewChild('history', { static: true }) history!: TemplateRef<any>;
  currentPage = 1;
  tempCurrentPage = 1;
  emailControl = new UntypedFormControl();
  totalpages: number;
  filednames: any[];
  docList: any[] = [];
 @ViewChild('amountCtl') amountCtl!: ElementRef;
@ViewChild('global') global!: ElementRef;

@ViewChild('dt') dt!: Table;
@ViewChild('dtable') dtable!: Table;

@ViewChild('history') history!: TemplateRef<any>;

@ViewChild('caseReceivedDateTrigger')
caseReceivedDateTrigger!: MatMenuTrigger;

@ViewChild('mailDialog', { static: true })
mailDialog!: TemplateRef<any>;

@ViewChild('actionTrigger')
actionTrigger!: MatMenuTrigger;
  displayedColumns = [
    { field: 'candidateName', header: 'Candidate Name', value: true, disabled: true },
    { field: 'userName', header: 'Submitted By', value: true, disabled: true },
    { field: 'clientReferenceNo', header: 'Case Ref No.', value: true, disabled: true },
    // { field: 'tat', header: 'TAT', value: true, disabled: true },
    { field: 'clientName', header: 'Client Name', value: true, disabled: true },
    { field: 'siteName', header: 'Site Name', value: true, disabled: true },
    { field: 'countryName', header: 'Country Name', value: true, disabled: true },
    { field: 'applicantId', header: 'Applicant Id', value: true },
    { field: 'caseReceivedDate', header: 'Case Received Date And Time', value: true },
    { field: 'caseInititationDate', header: 'Case Initiation Date', value: true },
    { field: 'chargeCode', header: 'Charge Code', value: true },
  ];
  displayedimportCol: any[] = [];
  @ViewChild('uploadConfirm')
  uploadConfirm!: TemplateRef<any>;

  chargeCodeFormCtrl = new UntypedFormControl();
  chargeCodeFilteredOptions!: Observable<string[]>;
  @ViewChild('chargeCodeTrigger')
  chargeCodeTrigger!: MatMenuTrigger;

  caseInititationDateFormCtrl = new UntypedFormControl();
  caseInititationDateFilteredOptions!: Observable<string[]>;
  @ViewChild('caseInititationDateTrigger')
  caseInititationDateTrigger!: MatMenuTrigger;
  fromDate = '';
  toDate = '';
  dupCaseLists: any[] = [];
  dupErrorList: any[] = [];
  docErrorList: any[] = [];
  model = new BulkUploadDoc();
  minDate: Date;
  maxDate: Date;
  caseReceivedDateFormCtrl = new UntypedFormControl();
  caseReceivedDateFilteredOptions: Observable<string[]>;

  toDateTime = '';
  fromDateTime = '';
  dupCaseListForTime: any[] = [];
  minDateTime: Date;
  maxDateTime: Date;
  candidateNameFormCtrl = new UntypedFormControl();
  candidateNameFilteredOptions!: Observable<string[]>;
  @ViewChild('candidateNameTrigger')
  candidateNameTrigger!: MatMenuTrigger;

  userNameFormCtrl = new UntypedFormControl();
  userNameFilteredOptions!: Observable<string[]>;
  @ViewChild('userNameTrigger')
  userNameTrigger!: MatMenuTrigger;

  clientReferenceNoFormCtrl = new UntypedFormControl();
  clientReferenceNoFilteredOptions!: Observable<string[]>;
  @ViewChild('clientReferenceNoTrigger')
  clientReferenceNoTrigger!: MatMenuTrigger;

  clientNameFormCtrl = new UntypedFormControl();
  clientNameFilteredOptions!: Observable<string[]>;
  @ViewChild('clientNameTrigger')
  clientNameTrigger!: MatMenuTrigger;

  siteNameFormCtrl = new UntypedFormControl();
  siteNameFilteredOptions!: Observable<string[]>;
  @ViewChild('siteNameTrigger')
  siteNameTrigger!: MatMenuTrigger;

  applicantIdFormCtrl = new UntypedFormControl();
  applicantIdFilteredOptions!: Observable<string[]>;
  @ViewChild('applicantIdTrigger')
  applicantIdTrigger!: MatMenuTrigger;
  applicantIdColumnName = '';
  caseCreationColumns = [
    { field: 'sno', header: 'S.No' },
    { field: 'chargeCode', header: 'Charge Code' },
    { field: 'applicantId', header: 'ApplicantId' },
    { field: 'candidateFirstName', header: 'First Name' },
    { field: 'candidateMiddleName', header: ' Middle Name' },
    { field: 'candidateLastName', header: 'Last Name' },
    // { field: 'action', header: 'Action'}
    // { field: 'tat', header: 'Tat' },
  ];
  frozenCols = [
    { field: 'action', header: 'Action' },
  ];
  breadcrumbFlags = new BreadcrumbFlags();
  // @ViewChild('ediInput', { static: true }) ediInput: ElementRef;
  isShowAll: boolean = false;
  isExport: boolean = false;
  invitation = true;
  siteList: [] = [];
  sitefilterlist: any[] = [];
  sitekeyUp = false;
  SendCaseMailList: SendCaseMail;
  clients: any[] = [];
  sites: Site[] = [];
  mailList: any[] = [];
  caseDetails: any;
  btnAddUpload = true;
  isMailIdSave = false;
  pathParameters: string[];
  isFocused = false;
  mailType = 'TO';
  currentDate: Date = new Date();
  invitationExpiryDays: LookUpValue[] = [];


  invitationFlag: boolean;
  mailTemplateList: any[] = [];
  clientHasSite: boolean;
  IqcByPassFlag: boolean;
  referenceNumber: any;
  mailSendFlag: any;
  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  EXCEL_EXTENSION = '.xlsx';
  addFlag: boolean;
  addMailCtrl: UntypedFormControl;
  checkFlag = true;
  ccFlag: boolean;
  ccMailCtrl: UntypedFormControl;
  tovalue: any;
  ccvalue: any;
  toList: any[] = [];
  ccList: any[] = [];
  uploadFlag = false;
  btnValidate = false;
  btnExport = false;
  bulkUploadDoc: any;
  btnExcelExport = true;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  // packCompList: any;
  packAndCompList: any;
  event: LazyLoadEvent;
  loading: boolean;
  viewError: any;
  // tslint:disable-next-line: max-line-length
  constructor(private fb: UntypedFormBuilder, public common: CommonService, private master: MasterService, private message: MessageService, private auth: AuthService,
    public screeningService: ScreeningService, private dialog: MatDialog, private datePipe: DatePipe,
    private router: Router) {
    this.addMailCtrl = new UntypedFormControl(null, [Validators.pattern(this.common.EmailRegX)]);
    this.ccMailCtrl = new UntypedFormControl(null, [Validators.pattern(this.common.EmailRegX)]);
  }

  ngOnInit() {
    this.breadcrumbFlags = this.common.breadcrumbFlags(true);
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.screenAuth = this.auth.getScreenAuth(this.router.url);
    this.initFormGroup();
    this.getClients();
    this.filednames = [{ field: 'action', header: 'Action', value: true, disabled: true }, ...this.displayedColumns.filter(e => e.disabled)];
    this.itemperpage = 10;
    this.userData.page = this.shievePageNo;
    this.userData.pageSize = this.shievePageSize;
    this.userData.needTotal = true;
    this.userData.applyPaging = true;
    this.skipFirstLazyLoad = true;
    this.bindCaseCreation();
  }
  LoadHistory(event: LazyLoadEvent) {
    this.loading = true;
    this.event = event;

    this.userData.page = (event.first + event.rows) / 10;
    this.userData.pageSize = 10;
    const sort = event.sortField == 'candidateName' ? 'candidateFirstName' : event.sortField
    this.userData.sorts = event.sortOrder == -1 ? "-" + sort : sort;
    this.userData.applyPaging = true;
    this.userData.needTotal = true;
    if (this.skipFirstLazyLoad && this.userData.page === 1 && !event.sortField && Object.keys(event.filters).length === 0) {
      this.skipFirstLazyLoad = false;
      return;
    }
    if (Object.keys(event.filters).length > 0 || event.sortField || this.userData.page) {
      this.bindCaseCreation();
    }
  }

  exportAsExcelFile() {
    // export to excel file
    let tabtext = '<table border="1px">';
    // var textRange;
    let j = 0;
    this.ExcelFlag = true;
    const data = new CaseCreationView();
    data.applicationId = this.userData.applicationId;
    data.teamId = this.userData.teamId;
    data.deptId = this.userData.deptId;
    data.userId = this.userData.userId;
    data.clientId = this.userData.clientId;
    data.teamName = (this.userData.team === 'Admin Team' || this.userData.team === 'Super Admin Team') ? this.userData.team : this.userData.teamName;
    data.subTeamName = this.userData.subTeamName;
    this.userData.filters = '';
    let userDetails = this.userData;
    userDetails.applyPaging = false;
    data.loginUserDetVm = userDetails;
    this.screeningService.getCaseCreationDetails(data).subscribe(resp => {
      if (resp) {
        this.excelData = resp.body;
        this.excelData.map(m => m.candidateName = m.candidateFirstName + ' ' + m.candidateMiddleName + ' '
          + m.candidateLastName);
        this.ExcelFlag = false;
        const header = this.displayedColumns;
        const filteredValue = this.excelData;
        const lines = this.excelData.length;
        let headerColos = '';
        // the first headline of the table
        if (lines > 0) {
          header.forEach(h => {
            headerColos = headerColos + '<th bgcolor="#0E4872" style="font-size:15px;color:white">' + h.header + '</th>';
          });
          tabtext = tabtext + '<tr>' + headerColos + '</tr>';

        }
        for (j = 0; j < lines; j++) {
          headerColos = '';
          header.forEach(h => {
            headerColos = headerColos + '<td style="font-size:12px">' + filteredValue[j][h.field] + '</td>';
          });
          tabtext = tabtext + '<tr>' + headerColos + '</tr>';
        }
        tabtext = tabtext + '</table>';
        tabtext = tabtext.replace(/<A[^>]*>|<\/A>/g, '');          // remove if u want links in your table
        tabtext = tabtext.replace(/<img[^>]*>/gi, '');             // remove if u want images in your table
        tabtext = tabtext.replace(/<input[^>]*>|<\/input>/gi, ''); // reomves input params
        const fileName = 'caseCreation.xls';
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
    });

    // this.exportAsExcelFile1(filteredValue, 'testreport', header);
  }
  // checkDT(dt: any) {
  // }
  // retnDate(): Date {
  //   const val = new Date(this.caseCreationFormGroup.controls.receivedDateTime.value);
  //   let retDate = new Date(new Date().setFullYear(1200));
  //   // new Date(2019, 09, 12);
  //   if (typeof (val) === typeof this.currentDate) {
  //     retDate = new Date(val);
  //     return retDate;
  //   }
  // }
  initFormGroup() {
    // const currentDateAndTime = new Date().toJSON().split('T')[0] + 'T' + this.getASMul(new Date().getHours())
    //   + ':' + this.getASMul(new Date().getMinutes());
    this.caseCreationFormGroup = this.fb.group({
      clientId: ['', Validators.required],
      noOfCases: [0,
        [Validators.required, Validators.min(1)]],
      caseNo: [0],
      docFolderPath: ['', Validators.required],
      siteNo: [, Validators.required],
      receivedDateTime: [this.userData.applicationId === 1 ? new Date() : null,
      this.userData.applicationId === 1 ? Validators.required : null],
      //Changed By Megala -  For  VTS2-2023-CRT-0133 revoke the automatic validation we have applied in the Case creation field 
      caseInitiationDateTime: [null, this.userData.applicationId === 1 ? new Date() : null,
        this.userData.applicationId === 1 ? Validators.required : null],
      autoAssign: [true],
      companySiteVisitFlag: [false]
    });
    this.clientControls =
      new AutoCompleteDropDown('Client Name', 'clientId', 'clientId', 'clientName', this.clients,
        '', this.caseCreationFormGroup, false, false, true);
    this.caseCreationFormGroup.controls.siteNo.disable();
    this.caseCreationFormGroup.controls.noOfCases.disable();
  }
  // getASMul(value: number): number {
  //   if (value.toString().length === 1) { return +('0' + value); } else { return value; }
  // }
  // getClients() {
  // tslint:disable-next-line:max-line-length
  //   this.screeningService.getClientName(this.userData.teamName, this.userData.applicationId, this.userData.clientId[0]).subscribe(resp => {
  //     if (resp) {
  //       if (this.userData.applicationId === 2) {
  //         this.clients = resp.filter(f => f.clientId.toString() === this.userData.clientId[0]);
  //       } else {
  //         this.clients = resp;
  //       }
  //       this.clientControls =
  //         new AutoCompleteDropDown('Client Name', 'clientId', 'clientId', 'clientName', this.clients,
  //           '', this.caseCreationFormGroup, false, false, true);
  //     }
  //   });
  // }
  getClients() {
    const data = new CaseCreationView();
    data.teamId = this.userData.teamId;
    data.applicationId = this.userData.applicationId;
    data.clientId = this.userData.clientId;
    data.teamName = this.userData.teamName;
    this.screeningService.getClientName(data).subscribe(resp => {
      if (resp) {
        this.clients = resp;
        this.clientControls =
          new AutoCompleteDropDown('Client Name', 'clientId', 'clientId', 'clientName', this.clients,
            '', this.caseCreationFormGroup, false, false, true);
      }
    });
  }
  getClientId(clientId: any) {
    if (clientId) {
      if (this.clients.find(x => x.clientId === clientId).agreementPendingFlag === true) {
        this.showTopCenter('warn', 'Failure Message', 'The client has pending in agreement approval...');
        this.caseCreationFormGroup.get('clientId')?.setValue(null); return;
      } else {
        this.sites = [];
        this.caseCreationFormGroup.controls.siteNo.setValue(undefined);
        this.caseCreationFormGroup.controls.noOfCases.setValue(undefined);
        setTimeout(() => {
          this.getSiteLocation(clientId);
        }, 20);
        this.getCaseDetailsByClientId(clientId);
        this.caseCreationFormGroup.controls.siteNo.enable();
      }
    }
  }
  getSiteLocation(clientId: any) {
    this.screeningService.getSiteNoByClientId(clientId).subscribe((resp: Site[]) => {
      if (resp) {
        resp.map(e => {
          e.siteNoWithsiteName = e.siteNo + '-' + e.siteName;
        });
        this.sites = resp;
      }
    }, err => {
    }, () => {
      if (this.sites.length === 0 && this.clientHasSite === false) {
        this.caseCreationFormGroup.controls.siteNo.disable();
      } else {
        this.caseCreationFormGroup.controls.siteNo.enable();
        this.siteItems('');
      }
      // this.siteControls =
      //   new AutoCompleteDropDown('Site No', 'siteNo', 'siteNo', 'siteName', this.sites,
      //     '', this.caseCreationFormGroup, false, false, true);
    });
  }
  getCaseDetailsByClientId(clientId: any) {
    this.screeningService.getDetailsByClientId(clientId).subscribe(resp => {
      if (resp) {
        this.caseDetails = resp;
        this.invitationFlag = resp.invitationFlag;
        this.clientHasSite = resp.clientHasSite;
        this.IqcByPassFlag = resp.iqcByPassFlag;
        if (this.IqcByPassFlag == true && this.caseCreationList.length > 0 && this.breadcrumbFlags.toolTip === 'Update') {
          this.caseCreationList.map(e => e.countryId = e.preComponentList[0].countryId);
        }
        this.applicantIdColumnName = this.caseDetails.applicantIdColumnName;
        this.caseCreationColumns = [
          { field: 'sno', header: 'S.No' },
          { field: 'chargeCode', header: 'Charge Code' },
          { field: 'applicantId', header: this.applicantIdColumnName },
          { field: 'candidateFirstName', header: 'First Name' },
          { field: 'candidateMiddleName', header: 'Middle Name' },
          { field: 'candidateLastName', header: 'Last Name' },
          // { field: 'action', header: 'Action' },
          // { field: 'tat', header: 'Tat' },
        ];
        if (this.IqcByPassFlag) {
          this.caseCreationColumns = [
            { field: 'sno', header: 'S.No' },
            { field: 'chargeCode', header: 'Charge Code' },
            { field: 'applicantId', header: this.applicantIdColumnName },
            { field: 'candidateFirstName', header: 'First Name' },
            { field: 'candidateMiddleName', header: 'Middle Name' },
            { field: 'candidateLastName', header: 'Last Name' },
            //     { field: 'packageId', header: 'Package' },
            // { field: 'packDetails', header: 'Package Details' },
            { field: 'indComp', header: 'Components' },
            { field: 'casePriorityLookupId', header: 'Screening/File Priority' },
            { field: 'countryId', header: 'Country' },
            { field: 'remarks', header: 'Remarks' },
          ];
          if (this.caseDetails.chargeCodeFlag !== true) {
            this.caseCreationColumns.splice(1, 1);
          }
          this.getIqcPriority();
          this.getCountry();
          if (this.breadcrumbFlags.toolTip === 'Update') {
            this.caseCreationColumns.push({ field: 'preComps', header: 'Previous Components' });

            //this.caseCreationColumns.splice(9, 1);

            this.caseCreationList.forEach(element => {
              if (element.packageId > 0) {
                this.packageName(element.packageId, element);
              }
            });
          }
          this.screeningService.getCasePackageComponent(clientId, false, 0).subscribe(res => {
            if (res) {
              this.packAndCompList = res; // noOfComponent
            }
          });
          if (this.caseDetails.refNoFlag === true) {
            if (this.IqcByPassFlag) {
              this.caseCreationColumns.splice(1, 0, { field: 'clientReferenceNo', header: 'Transaction ID' });
            } else {
              this.caseCreationColumns.splice(1, 0, { field: 'clientReferenceNo', header: 'Client Ref. #' });
            }
          }
        } else {
          this.caseCreationColumns = [
            { field: 'sno', header: 'S.No' },
            { field: 'chargeCode', header: 'Charge Code' },
            { field: 'applicantId', header: this.applicantIdColumnName },
            { field: 'candidateFirstName', header: 'First Name' },
            { field: 'candidateMiddleName', header: 'Middle Name' },
            { field: 'candidateLastName', header: 'Last Name' },
          ];

          if (this.caseDetails.chargeCodeFlag !== true) {
            this.caseCreationColumns.splice(1, 1);
          } else {
            this.caseCreationColumns = [
              { field: 'sno', header: 'S.No' },
              { field: 'chargeCode', header: 'Charge Code' },
              { field: 'applicantId', header: this.applicantIdColumnName },
              { field: 'candidateFirstName', header: 'First Name' },
              { field: 'candidateMiddleName', header: 'Middle Name' },
              { field: 'candidateLastName', header: 'Last Name' }
            ];
          }
          if (this.caseDetails.refNoFlag === true) {

            this.caseCreationColumns.splice(1, 0, { field: 'clientReferenceNo', header: 'Client Ref. #' });

          }
          this.scopeByPass(clientId);
          // if (this.caseDetails.chargeCodeFlag === true) {
          //   this.caseCreationColumns.splice(1, 0, { field: 'chargeCode', header: 'Charge Code' });
          // }
          // if (this.caseCreationFormGroup.controls.invitation.value) {
          //   this.invitationChange(true);
          // }
        }
      }
    });
  }
  scopeByPass(clientId: any) {
    if (this.caseDetails.scopeByPassFlag === true || this.caseDetails.ctsFlag === true) {
      const scopeByPass = [
        { field: 'employeeId', header: 'Employee ID' },
        { field: 'packageId', header: 'Package' },
        { field: 'packDetails', header: 'Package Details' },
        { field: 'indComp', header: 'Components' },
        { field: 'remarks', header: 'Remarks' }];
      this.caseCreationColumns.push(...scopeByPass);
      if (this.breadcrumbFlags.toolTip === 'Update') {
        this.caseCreationColumns.push({ field: 'preComps', header: 'Previous Components' });
        if (this.IqcByPassFlag != true) {
          this.caseCreationList.forEach(element => {
            if (element.packageId > 0) {
              this.packageName(element.packageId, element);
            }
          });
        }
      }
      this.screeningService.getCasePackageComponent(clientId, false, 0).subscribe(res => {
        if (res) {
          this.packAndCompList = res; // noOfComponent
        }
      });
    }
  }
  packageName(val, data) {
    this.screeningService.getComponentByPackageId(val).subscribe(res => {
      if (res) {
        data.packCompList = res;
      }
    });
  }
  casePriorityName(val, data) {

    if (this.casePriority) {
      var priorityId = this.casePriority.filter(s => s.lookUpId == val);
      data.casePriorityLookupId = priorityId[0].lookUpId;
    }

  }
  caseCountryName(val, data) {

    if (this.country) {
      var countryId = this.country.filter(s => s.countryId == val);
      data.countryId = countryId[0].countryId;
      this.currencyId = countryId[0].currencyId;
    }

  }
  setSubCompValue(value, main, sub) {
    if (value) {
      const val = this.common.CloneObject(main);
      val.packageSubComponent = [];
      val.packageSubComponent.push(sub);
      return val;
    }
  }
  selectSite(e: any) {
    if (e) {
      const siteName = this.sites.filter(x => x.siteId === e);
      const locationName = siteName[0].siteNoWithsiteName;
      this.caseCreationFormGroup.get('siteNo')?.setValue(locationName);
    }
  }
  addCaseCreation() {
    this.initFormGroup();
    this.caseCreationColumns = [
      { field: 'sno', header: 'S.No' },
      { field: 'chargeCode', header: 'Charge Code' },
      { field: 'applicantId', header: 'ApplicantId' },
      { field: 'candidateFirstName', header: 'First Name' },
      { field: 'candidateMiddleName', header: ' Middle Name' },
      { field: 'candidateLastName', header: 'Last Name' },
      // { field: 'action', header: 'Action' },
      // { field: 'tat', header: 'Tat' },
    ];
    this.currentDate = new Date();
    this.invitationFlag = false;
    if (this.userData.applicationId === 2) {
      this.caseCreationFormGroup.get('clientId')?.setValue(this.clients[0].clientId);
      this.getClientId(this.caseCreationFormGroup.get('clientId')?.value);
      this.enableNoCases();
    }
    this.breadcrumbFlags.toolTip = 'Save';
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.btnAddUpload = false;
    this.btnValidate = false;
    this.btnExport = false;
    this.btnExcelExport = false;
    // this.caseCreationList = [];
    this.caseCreationDupList = [];
    this.showFlag = !this.showFlag;
    // this.getInvitationExpiryDays();
  }
  getInvitationExpiryDays() {
    this.screeningService.GetInvitationExpiryDays().subscribe(res => {
      this.invitationExpiryDays = res;
    });
  }
  caseCountCreate() {
    const currval = +(this.caseCreationFormGroup.controls.noOfCases.value);
    const listLength = this.caseCreationList.length;
    if (currval === listLength) { return false; }
    if (currval === 0) { this.caseCreationList = []; }
    const ifAdd = currval > listLength ? true : false;
    if (currval > listLength) {
      for (let index = 0; index < +(currval - listLength); index++) {
        this.caseCreationList.push({
          applicantId: this.IqcByPassFlag != true ? 'N/A' : '',
          candidateFirstName: '',
          candidateLastName: '',
          candidateMiddleName: '',
          clientReferenceNo: '',
          caseRefNo: '',
          candidateId: 0,
          casePriorityLookupId: 0,
          countryId: 0,
          contactId: 0,
          chargeCode: '',
          employeeId: '',
          //  emailId: '',
          // invitationExpireLookupId: 0,
          screeningOwnerId: 0,
          clientName: '',
          siteName: '',
          tat: 0,
          caseNo: 0,
          invitationExpiryLookupId: 0,
          consentLookupId: 0,
          emailId: '',
          packageId: 0,
          caseComponent: [],
          indComponentList: [],
          preComponentList: [],
          remarks: ''
        });
      }
    } else { this.caseCreationList.length = currval; }
    if (this.caseCreationList.length > 0) {
      const getElementsByClassName: any = document.getElementsByClassName('p-edit');
      if (getElementsByClassName) {
        if (getElementsByClassName.length > 0) {
          getElementsByClassName[0].click();
        }
      }
    }
  }
  // ngDoCheck() {
  //   if (this.isFocused && this.caseCreationFormGroup.controls['noOfCases'].value !== 0) {
  //     if (this.caseCreationList.length > 0) {
  //       const getElementsByClassName: any = document.getElementsByClassName('p-edit');
  //       if (getElementsByClassName) {
  //         if (getElementsByClassName.length > 0) {
  //           getElementsByClassName[0].focus(); this.isFocused = false;
  //         }
  //       }
  //     }
  //   }
  // }

  applyPagination() {

    this.userData.pageSize = this.ExcelFlag === true ? Number(this.shieveTotalCount) : this.shievePageSize;
    this.userData.page = this.userData.page > 0 ? this.userData.page : this.shievePageNo;
    this.userData.needTotal = true;
    this.userData.applyPaging = (this.ExcelFlag === true || this.isShowAll === true) ? false : true;

  }
  globalSearch(searchvalue: any) {
    this.userData.needTotal = true;
    this.userData.filters = searchvalue ? "(name|userName|clientReferenceNo|clientName|siteName)@=" + searchvalue : '';
    this.userData.page = 1;
    this.bindCaseCreation();
  }
  bindCaseCreation() {
    this.applyPagination();
    const data = new CaseCreationView();
    data.applicationId = this.userData.applicationId;
    data.teamId = this.userData.teamId;
    data.deptId = this.userData.deptId;
    data.userId = this.userData.userId;
    data.clientId = this.userData.clientId;
    data.teamName = (this.userData.team === 'Admin Team' || this.userData.team === 'Super Admin Team') ? this.userData.team : this.userData.teamName;
    data.subTeamName = this.userData.subTeamName;
    let userDetails = this.userData;
    if (this.isExport || this.isShowAll) {
      userDetails.applyPaging = false;
    } else {
      userDetails.applyPaging = true;
      userDetails.pageSize = this.shievePageSize;
      userDetails.page = this.userData.page > 0 ? this.userData.page : this.shievePageNo;
      userDetails.needTotal = true;
    }
    data.loginUserDetVm = userDetails;

    // this.screeningService.getCaseCreationDetails(this.userData.applicationId, this.userData.teamId, this.userData.userId)
    this.screeningService.getCaseCreationDetails(data)
      .subscribe((resp) => {
        if (resp) {
          resp.body.forEach(element => {
            element.candidateName = element.candidateFirstName + ' ' + element.candidateMiddleName + ' ' + element.candidateLastName;
          });
          this.caseLists = resp.body;
          this.loading = false;
          this.totalpages = resp.headers.get('X-Total-Count');
          this.dupCaseLists = this.common.CloneObject(resp.body);
          //  this.maxDate = new Date(Math.max.apply(null, this.dupCaseLists.map(e =>
          //    new Date(e.reqEffectiveDate))));
          //  this.minDate = new Date(Math.min.apply(null, this.dupCaseLists.map(y =>
          //    new Date(y.reqEffectiveDate))));
          this.dupCaseListForTime = this.common.CloneObject(resp.body);
          //  this.maxDateTime = new Date(Math.max.apply(null, this.dupCaseListForTime.map(e =>
          //    new Date(e.reqEffectiveDate))));
          //  this.minDateTime = new Date(Math.min.apply(null, this.dupCaseListForTime.map(y =>
          //    new Date(y.reqEffectiveDate))));
          // this.TblAutoFilters();
          this.currentPage = this.userData.page;
        }
      }, err => { }, () => {
        // this.TblAutoFilters();
      });
  }
  private TblAutoFilters(): void {
    this.candidateNameFilteredOptions = this.candidateNameFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.caseLists.map(x => x.candidateName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
    this.userNameFilteredOptions = this.userNameFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.caseLists.map(x => x.userName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
    this.clientReferenceNoFilteredOptions = this.clientReferenceNoFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.caseLists.map(x => x.clientReferenceNo).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
    this.clientNameFilteredOptions = this.clientNameFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.caseLists.map(x => x.clientName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
    this.siteNameFilteredOptions = this.siteNameFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.caseLists.map(x => x.siteName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
    this.applicantIdFilteredOptions = this.applicantIdFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.caseLists.map(x => x.applicantId).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
    this.chargeCodeFilteredOptions = this.chargeCodeFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.caseLists.map(x => x.chargeCode).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
  }
  resetDate() {
    this.fromDate = '';
    this.toDate = '';
    this.caseLists = this.dupCaseLists;
  }
  getRecordBydate(fDate, tDate) {
    this.caseLists = this.dupCaseLists;
    const FromDate = this.datePipe.transform(fDate, 'yyyy-MM-dd');
    const ToDate = this.datePipe.transform(tDate, 'yyyy-MM-dd');
    this.caseLists.map(d => d.caseInititationDate = this.datePipe.transform(d.caseInititationDate, 'yyyy-MM-dd'));
    this.caseLists = this.dupCaseLists.filter(x =>
      x.caseInititationDate >= FromDate && x.caseInititationDate <= ToDate);
  }
  resetDateTime() {
    this.fromDateTime = '';
    this.toDateTime = '';
    this.caseLists = this.dupCaseListForTime;
  }
  getRecordBydateTime(fDateTime, tDateTime) {
    this.caseLists = this.dupCaseListForTime;
    const FromDateTime = this.datePipe.transform(fDateTime, 'yyyy-MM-ddThh:mm');
    const ToDateTime = this.datePipe.transform(tDateTime, 'yyyy-MM-ddThh:mm');
    this.caseLists.map(d => d.caseReceivedDate = this.datePipe.transform(d.caseReceivedDate, 'yyyy-MM-ddThh:mm'));
    this.caseLists = this.dupCaseListForTime.filter(x =>
      x.caseReceivedDate >= FromDateTime && x.caseReceivedDate <= ToDateTime);
  }
  saveCaseCreation() {
    let controlNames;
    if (this.userData.applicationId === 1) {
      controlNames = ['docFolderPath', 'receivedDateTime', 'caseInitiationDateTime'];
    } else if (this.userData.applicationId === 2) {
      controlNames = ['docFolderPath'];
    }
    for (const ctrl in this.caseCreationFormGroup.controls) {
      if (controlNames.indexOf(ctrl) > -1) {
        if (this.caseCreationFormGroup.get(ctrl).value) {
          this.caseCreationFormGroup.get(ctrl).clearValidators();
          this.caseCreationFormGroup.get(ctrl).updateValueAndValidity();
        } else {
          this.caseCreationFormGroup.get(ctrl).setValidators(Validators.required);
          this.caseCreationFormGroup.get(ctrl).updateValueAndValidity();
        }
      }
    }
    if (this.caseCreationFormGroup.valid) {
      // if (this.caseCreationList.filter(e => ('' + e.applicantId.trim()).length === 0).length > 0) {
      //   this.showTopCenter('warn', 'Failure Message', 'Please add Applicant ID'); return;
      // }
      if (this.IqcByPassFlag === true) {
        // if (this.caseCreationList.filter(e => ('' + e.clientReferenceNo.trim()).length === 0).length > 0) {
        //   this.showTopCenter('warn', 'Failure Message', 'Please add Transaction ID'); return;
        // }
        if (this.caseCreationList.filter(e => ('' + e.applicantId.trim()).length === 0).length > 0) {
          this.showTopCenter('warn', 'Failure Message', 'Please add Screening ID'); return;
        }

      }
      if (this.caseDetails.refNoFlag === true && this.IqcByPassFlag !== true) {
        if (this.caseCreationList.filter(e => ('' + e.clientReferenceNo.trim()).length === 0).length > 0) {
          this.showTopCenter('warn', 'Failure Message', 'Please add Client Reference No'); return;
        }
      }
      if (this.caseCreationList.filter(e => ('' + e.candidateFirstName.trim()).length < 3).length > 0) {
        this.showTopCenter('warn', 'Failure Message', 'Candidate first name should have atleast 3 characters'); return;
      }

      if (this.caseDetails.ctsFlag === true) {
        if (this.caseCreationList.filter(e => (e.employeeId.trim()).length === 0).length > 0) {
          this.showTopCenter('warn', 'Failure Message', 'Please add Employee ID'); return;
        }
      }

      if (this.caseDetails.scopeByPassFlag === true || this.caseDetails.ctsFlag === true || this.IqcByPassFlag === true) {
        if ((this.caseCreationList.filter(e => (e.indComponentList.length === 0 && e.packageId < 1)).length > 0)
          && !(this.caseCreationFormGroup.controls.caseNo.value > 0)) {
          this.showTopCenter('warn', 'Failure Message', 'Please Select Components or Package...'); return;
        }
        if (this.IqcByPassFlag === true) {

          if (this.caseCreationList.filter(e => (e.casePriorityLookupId) === 0).length > 0) {
            this.showTopCenter('warn', 'Failure Message', 'Please add Screening/File Priority'); return;
          }

        }
        let mainFlag = true;
        this.caseCreationList.forEach(element => {
          if (this.IqcByPassFlag === true) {
            var countryId = this.country.filter(s => s.countryId == element.countryId);
            this.currencyId = countryId[0].currencyId;
          }
          element.caseComponent = [];
          if ((this.IqcByPassFlag) || (this.IqcByPassFlag == false && this.userData.teamName == 'CRTAbroad')) {
            const compList: any[] = [];
            compList.push(element.indComponentList);
            if (compList[0].compId > 0) {
              element.indComponentList = compList;
            }
          }
          element.indComponentList.forEach(ele => {
            // validation
            const comp = element.packCompList && element.packCompList.length > 0 && element.packCompList.some(x => x.componentId
              === ele.componentId && !ele.subCompFlag === true);
            const preComp = element.preComponentList.length > 0 && element.preComponentList.some(x => x.compId
              === ele.componentId && !ele.subCompFlag === true) && this.caseCreationFormGroup.controls.caseNo.value > 0;
            if ((ele.maxNoOfComp && ele.maxNoOfComp < 2) && (preComp || comp)) {
              mainFlag = false;
            }
            if (mainFlag === true) {
              const caseComponet = new CaseComponentVm();
              caseComponet.caseComponentId = 0;
              caseComponet.compId = ele.componentId;
              caseComponet.noOfComponent = 1;
              caseComponet.subCompFlag = ele.subCompFlag ? ele.subCompFlag : false;
              caseComponet.currencyId = (this.currencyId > 0) ? this.currencyId : ele.currencyId;
              caseComponet.active = true;
              caseComponet.compName = ele.compName;
              if (ele.subCompFlag === true) {
                // validation
                element.packCompList = element.packCompList ? element.packCompList : [];
                const val = element.packCompList.find(x => x.componentId === ele.componentId);
                const valPre = element.preComponentList.find(x => x.compId === ele.componentId);
                const subComp = element.packCompList.length > 0 && val && val.packageSubComponent.length > 0
                  && val.packageSubComponent.some(x => x.subCompId === ele.packageSubComponent[0].subCompId);
                const preSubComp = element.preComponentList.length > 0 && valPre && valPre.caseSubComponent.length > 0
                  && valPre.caseSubComponent.some(x => x.subCompId === ele.packageSubComponent[0].subCompId) &&
                  this.caseCreationFormGroup.controls.caseNo.value > 0;
                if ((ele.packageSubComponent[0].maxNoOfComp && ele.packageSubComponent[0].maxNoOfComp < 2) && (preSubComp || subComp)) {
                  mainFlag = false;
                }
                const caseSubComponet = new CaseSubComponentVm();
                caseSubComponet.caseSubCompId = 0;
                caseSubComponet.subCompId = ele.packageSubComponent[0].subCompId;
                caseSubComponet.noOfComponent = 1;
                caseSubComponet.currencyId = (this.currencyId > 0) ? this.currencyId : ele.packageSubComponent[0].currencyId;
                caseSubComponet.active = true;
                caseSubComponet.subCompName = ele.subCompName;
                caseComponet.caseSubComponent.push(caseSubComponet);
              } else {
                caseComponet.caseSubComponent  = [];
              }
              const index = element.caseComponent.findIndex(x => x.compId === caseComponet.compId);
              if (index > -1) {
                element.caseComponent[index].caseSubComponent.push(caseComponet.caseSubComponent[0]);
              } else {
                element.caseComponent.push(caseComponet);
              }
            }
          });
          element.packageId = (this.caseCreationFormGroup.controls.caseNo.value > 0 && element.packageId) ? null : element.packageId;
        });
        if (!mainFlag) {
          this.showTopCenter('warn', 'Failure Message', 'Please Remove the Additional Component, If It is Already in Package,Components');
          return;
        }
      }
      this.caseCreation.clientId = this.caseCreationFormGroup.controls.clientId.value;
      this.caseCreation.caseNo = +this.caseCreationFormGroup.controls.caseNo.value;
      this.caseCreation.siteId = this.caseCreationFormGroup.controls.siteNo.value;
      if (this.caseCreation.clientId > 0 && this.clients.length > 0) {
        const clientName = this.clients.filter(x => x.clientId === this.caseCreation.clientId);
        this.caseCreation.clientName = clientName[0].clientName;
      }
      if (this.caseCreation.siteId > 0 && this.sitefilterlist.length > 0) {
        const siteName = this.sitefilterlist.filter(x => x.siteId === this.caseCreation.siteId);
        this.caseCreation.siteName = siteName[0].siteNoWithsiteName;
      }
      // tslint:disable-next-line: max-line-length  // Changed by salman For Bug Fixing
      // this.caseCreation.caseReceivedDate = this.datePipe.transform(this.caseCreationFormGroup.controls.receivedDateTime.value, 'yyyy-MM-ddTHH:mm');
      // tslint:disable-next-line: max-line-length  // Changed by salman For Bug Fixing
      // this.caseCreation.caseInitiationDate = this.datePipe.transform(this.caseCreationFormGroup.controls.caseInitiationDateTime.value, 'yyyy-MM-ddTHH:mm');

      this.caseCreation.caseReceivedDate = this.userData.applicationId === 2 ? new Date() : this.caseCreationFormGroup.controls.receivedDateTime.value;
      this.caseCreation.caseInitiationDate = this.userData.applicationId === 2 ? new Date() : this.caseCreationFormGroup.controls.caseInitiationDateTime.value;

      // this.caseCreation.caseReceivedDate = this.common.getTimezoneOffsetV2(this.userData.applicationId === 2 ? new Date().getUTCDate() : this.caseCreationFormGroup.controls.receivedDateTime.value, true);
      // this.caseCreation.caseInitiationDate = this.common.getTimezoneOffsetV2(this.userData.applicationId === 2 ? new Date().getUTCDate() : this.caseCreationFormGroup.controls.caseInitiationDateTime.value, true);
      this.caseCreation.urlName = this.caseCreationFormGroup.controls.docFolderPath.value;
      this.caseCreation.autoAssign = (this.caseDetails.scopeByPassFlag === true && this.IqcByPassFlag !== true) ? false : (this.caseDetails.scopeByPassFlag === true && this.IqcByPassFlag === true) ? true : this.caseCreationFormGroup.controls.autoAssign.value;
      this.caseCreation.caseEntry = this.caseCreationList;
      this.caseCreation.loggedIn = this.userData.userId;
      this.caseCreation.deptId = this.userData.deptId;
      this.caseCreation.teamId = this.userData.teamId;
      this.caseCreation.applicationId = this.userData.applicationId;
      this.caseCreation.companySiteVisitFlag = this.caseCreationFormGroup.controls.companySiteVisitFlag.value;
      if (this.caseDetails) {
        if (this.caseDetails.refNo) {
          this.caseCreation.caseEntry.map(e => e.clientReferenceNo = this.caseDetails.refNo + e.clientReferenceNo);
        }
      }
      this.screeningService.addCaseCreation(this.caseCreation).subscribe(resp => {
        if (resp.success === true) {
          this.referenceNumber = resp.message;
          if (this.caseCreationFormGroup.controls.caseNo.value > 0) {
            this.showTopCenter('success', 'success Message', 'Updated Successfully');
          } else {
            this.showTopCenter('success', 'success Message', 'Saved Successfully');
          }
          if (this.caseCreationFormGroup.controls.caseNo.value === 0 && !(this.caseDetails.scopeByPassFlag === true || this.caseDetails.ctsFlag === true)) {
            this.getMailList();
            this.isMailIdSave = true;
            if (this.userData.applicationId === 1) {
              this.openMailDialog();
            } else {
              this.closeForm();
              this.isMailIdSave = false;
              this.bindCaseCreation();
            }
          } else {
            this.closeForm();
            this.bindCaseCreation();
          }
        } else if (resp.success === false) {
          this.showTopCenter('error', 'Failed', 'Failed to Add');
          if (!this.isMailIdSave) { this.removeRefNo(); }
        }
      }, err => {
        if (!this.isMailIdSave) { this.removeRefNo(); }
        this.showTopCenter('error', 'Failed', 'Failed to Add');
      });

      this.pathParameters = [this.common.SHOW, this.routePath];
      this.common.FlagEvent(this.pathParameters);
    } else {
      this.caseCreationFormGroup.markAllAsTouched();
    }
  }
  getMailList() {
    // tslint:disable-next-line: no-use-before-declare
    this.SendCaseMailList = new SendCaseMail();
    // this.caseCreationColumns = this.caseCreationColumns.filter(e => e.field !== 'action');
    let refList: any[] = [];
    let checkList: any[] = [];
    let caseNo: any[] = [];
    caseNo = this.referenceNumber.split(',').map(Number);
    if (this.caseDetails.refNoFlag === false) {
      checkList = this.caseCreationList;
      this.screeningService.getCaseReferenceDetails(this.referenceNumber).subscribe(res => {
        if (res) {
          refList = res;
          checkList.forEach((ele, i) => {
            ele.caseNo = caseNo[i];
          });
          refList.forEach(el => {
            const caseCreationList = checkList.filter(e => e.caseNo === el.caseNo);
            caseCreationList.map(e => e.clientReferenceNo = el.clientReferenceNo);
            this.refNumnList.push(caseCreationList[0]);
            this.caseCreationList = this.refNumnList;
          });
        }
      });
      this.refNumnList = [];
    }
    this.caseCreationList.map(e => e.clientName = this.caseCreation.clientName);
    this.caseCreationList.map(e => e.siteName = this.caseCreation.siteName);
    this.caseCreationColumns.splice(1, 0, { field: 'clientName', header: 'Client' });
    this.caseCreationColumns.splice(1, 0, { field: 'siteName', header: 'Site' });
    this.caseCreationColumns.splice(1, 0, { field: 'clientReferenceNo', header: 'Client Reference No' });
    this.screeningService.bindCaseCreation(this.caseCreationFormGroup.controls.clientId.value,
      this.caseCreationFormGroup.controls.siteNo.value, this.userData.applicationId).subscribe(res => {
        if (res) {
          if (res.caseCreation) {
            res.caseCreation = res.caseCreation.filter(x => caseNo.some(s => s === x.caseNo));
            res.caseCreation.forEach((element, index) => {
              if (index === 0) {
                this.SendCaseMailList.clientName = element.clientName;
              }
              const rDate = this.common.getTimezoneOffset(element.caseReceivedDate, false);
              const IDate = this.common.getTimezoneOffset(element.caseInititationDate, false);
              const CaseDetailT: CaseDetail = {
                candidateName: element.candidateFirstName +
                  (element.candidateMiddleName ? ' ' + element.candidateMiddleName : '') +
                  (element.candidateLastName ? ' ' + element.candidateLastName : ''),
                clientReferenceNo: element.clientReferenceNo,
                sno: index + 1,
                caseNo: element.caseNo,
                applicantId: element.applicantId,
                siteName: element.siteName ? element.siteName : 'N/A',
                caseReceivedDate: this.datePipe.transform(rDate, 'yyyy-MM-dd hh:mm:ss a'),
                caseInitiationDate: this.datePipe.transform(IDate, 'yyyy-MM-dd hh:mm:ss a')
              };
              this.SendCaseMailList.caseDetails.push(CaseDetailT);
            });
          }
          this.SendCaseMailList.clientMailId = res.clientMailId;
          this.SendCaseMailList.loggedIn = this.userData.userId;
          this.SendCaseMailList.clientMailId.map(e => {
            e.selected = true;
          });
          this.SendCaseMailList.noOfCase = (res.caseCreation).length;
        }
      });
  }
  removeEmail(index: any) {
    this.SendCaseMailList.clientMailId.splice(index, 1);
  }
  async sendMail() {
    // if (this.SendCaseMailList.clientMailId.length === 0) {
    //   this.showTopCenter('error', 'Failure', 'Add atleast one Mail');
    //   return;
    // }
    this.SendCaseMailList.loggedIn = this.userData.userId;
    this.SendCaseMailList.clientMailId = this.SendCaseMailList.clientMailId.filter(e => e.selected === true);
    this.SendCaseMailList.applicantIdHeader = this.applicantIdColumnName ? this.applicantIdColumnName : 'Applicant id';
    if (this.toList && this.toList.length > 0) {
      this.toList.forEach(ele => {
        const defaultMailList: CaseCreationMail = {
          clientId: this.caseCreationFormGroup.get('clientId')?.value,
          emailAddress: ele,
          emailType: 'To',
          selected: true
        };
        this.SendCaseMailList.clientMailId.push(defaultMailList);
      });
      this.toList = [];
    }
    if (this.ccList && this.ccList.length > 0) {
      this.ccList.forEach(ele => {
        const defaultMailList: CaseCreationMail = {
          clientId: this.caseCreationFormGroup.get('clientId')?.value,
          emailAddress: ele,
          emailType: 'CC',
          selected: true
        };
        this.SendCaseMailList.clientMailId.push(defaultMailList);
      });
      this.ccList = [];
    }
    if (this.SendCaseMailList.clientMailId.length > 0) {
      this.screeningService.SendCaseCreationMail(this.SendCaseMailList)
      //.subscribe(resp=>{
      // if (resp.success === true) {
      this.showTopCenter('success', 'Success', 'Mail send Successfully');
      // this.getMailList();
      // } else if (resp.success === false) {
      //   this.showTopCenter('error', 'Failure', 'Failed to send Mail');
      // }
      //},
      //  err => { }, () => {
      this.dialog.closeAll();
      this.closeForm();
      this.isMailIdSave = false;
      this.bindCaseCreation();
    } else {
      this.showTopCenter('warn', 'Info message', 'Please add MailId');
    }
    //  });
  }
  sendMail1() {
    this.getEmailTemplate(this.common.CASE_CREATION, this.SendCaseMailList);
  }
  getEmailTemplate(templateName: string, data: any) {
    const emailTemplate = this.common.mailTemplates.find(x => x.templateName.toLowerCase() === templateName).htmlTemplateBody;
    const mailTemp = new MailTemplate();

    mailTemp.totalCaseDone = '3';
    mailTemp.clientName = ' data.clientName',
      mailTemp.clientRefID = 'data.caseDetails[0].clientReferenceNo';
    mailTemp.candidateName = 'data.caseDetails[0].candidateNam';
    const mailData = {
      htmlTemplate: this.common.mailTemp(emailTemplate, mailTemp), fileAttachments: [{
        filename: 'logo.png',
        path: '../assets/images/logo.png',
        cid: 'logo' // html tag img src
      }]
    };
    this.master.sendEmail(mailData).subscribe(resp => {
      this.showTopCenter('success', 'Success', resp.message);
      this.dialog.closeAll();
      this.closeForm();
      this.isMailIdSave = false;
      this.bindCaseCreation();
    }, errmsg => {
    }
    );
  }
  removeRefNo() {
    if (this.caseDetails) {
      if (this.caseDetails.refNo) {
        this.caseCreation.caseEntry.map(e => e.clientReferenceNo = e.clientReferenceNo.replace(this.caseDetails.refNo, ''));
      }
    }
  }
  resetForm() {
    if (this.caseCreationFormGroup.controls.caseNo.value > 0) {
      this.caseCreationFormGroup.controls.noOfCases.disable();
      this.caseCreationFormGroup.controls.clientId.disable();
      this.caseCreationFormGroup.patchValue({
        clientId: this.common.tempResetData.clientId,
        noOfCases: this.common.tempResetData.caseEntry.length,
        docFolderPath: this.common.tempResetData.urlName,
        caseNo: this.common.tempResetData.caseNo,
        siteNo: this.common.tempResetData.siteId,
        receivedDateTime: this.common.getTimezoneOffsetV2(this.common.tempResetData.caseReceivedDate, false),
        caseInitiationDateTime: this.common.getTimezoneOffsetV2(this.common.tempResetData.caseInitiationDate, false),
        autoAssign: this.common.tempResetData.autoAssign,
        companySiteVisitFlag: this.common.tempResetData.companySiteVisitFlag,
      });
      this.pathParameters = [this.common.UPDATE, this.routePath];
      this.caseCreationFormGroup.controls.siteNo.setValue(this.common.tempResetData.siteId);
      this.caseCreationList = this.common.CloneObject(this.common.tempResetData.caseEntry);
      if (this.caseDetails) {
        if (this.caseDetails.refNo) {
          this.caseCreationList.map(e => e.clientReferenceNo = e.clientReferenceNo.replace(this.caseDetails.refNo, ''));
        }
      }
      this.caseCreationFormGroup.controls.siteNo.enable();
    } else {
      const controlNames = ['clientId', 'noOfCases', 'caseNo', 'docFolderPath', 'siteNo', 'receivedDateTime',
        'caseInitiationDateTime', 'autoAssign'];
      for (const ctrl in this.caseCreationFormGroup.controls) {
        if (controlNames.indexOf(ctrl) > -1) {
          this.caseCreationFormGroup.get(ctrl).clearValidators();
          this.caseCreationFormGroup.get(ctrl).updateValueAndValidity();
        }
      }
      this.caseCreationFormGroup.controls.clientId.setValue(undefined);
      this.caseCreationFormGroup.controls.noOfCases.setValue(undefined);
      this.caseCreationFormGroup.reset();
      this.caseCountCreate();
      this.caseCreationFormGroup.markAsPristine();
      this.caseCreationFormGroup.markAllAsTouched();
      this.pathParameters = [this.common.SHOW, this.routePath];
      this.initFormGroup();
    }
    this.common.FlagEvent(this.pathParameters);
  }

  isExist(colField, index, value, header, value2) {
    if (value.length === 0) { return; }
    let isExist: boolean = (colField === 'applicantId' && !this.IqcByPassFlag) ? ('' + (value).trim() === 'N/A') : false;
    if (!isExist) {
      isExist = this.caseCreationList.filter(e => e[colField] === '' + (value).trim()).length > 1;
      if (isExist) {
        if (colField === 'applicantId') {
          this.openDialogApp(value, index, colField);
        } else if (!this.IqcByPassFlag) {
          this.caseCreationList[index][colField] = '';
          this.openDialogApp(value, index, colField);
          this.showTopCenter('warn', 'Exist', value + ' ' + 'already exist in ' + header);
        }
        return;
      }
      if (!isExist) {
        if (colField === 'applicantId' && !this.IqcByPassFlag) {
          this.screeningService.CheckApplicantId(value, this.caseCreationFormGroup.controls.clientId.value).subscribe(e => {
            if (e) { isExist = (!e.success); }

            if (isExist && value != (this.breadcrumbFlags.toolTip == 'Update' ? this.common.tempResetData.caseEntry[0].applicantId : '')) {
              this.openDialogApp(value, index, colField);
              return;
            }
          });
        } else if (colField === 'applicantId' && this.IqcByPassFlag == true) {
          this.screeningService.checkClientScreeningId(value, this.caseCreationFormGroup.controls.clientId.value).subscribe(e => {


            if (e == true && value != (this.breadcrumbFlags.toolTip == 'Update' ? this.common.tempResetData.caseEntry[0].applicantId : '')) {
              this.openDialogApp(value, index, colField);
              return;
            }
          });
        }
        else if (colField === 'candidateFirstName' && this.IqcByPassFlag == true || colField === 'candidateMiddleName' && this.IqcByPassFlag == true || colField === 'candidateLastName' && this.IqcByPassFlag == true) {
          if (this.clientRefDetail != undefined) {
            if (this.clientRefDetail.candidateFirstName != null) {
              if (this.caseCreationList[index].candidateFirstName != this.clientRefDetail.candidateFirstName || this.caseCreationList[index].candidateMiddleName != this.clientRefDetail.candidateMiddleName || this.caseCreationList[index].candidateLastName != this.clientRefDetail.candidateLastName) {
                this.caseCreationList[index].clientReferenceNo = '';
              }
            }
          }
        } else if (colField === 'clientReferenceNo' && !this.IqcByPassFlag) {
          this.screeningService.CheckReferenceNo(value2, this.caseCreationFormGroup.controls.clientId.value).subscribe(e => {
            if (e) { isExist = (!e.success); }
            if (isExist) {
              this.caseCreationList[index][colField] = '';
              // this.showTopCenter('warn', 'Exist', value + ' ' + 'already exist in ' + header);
              if (this.IqcByPassFlag) {
                console.log(e)
              } else {
                this.showTopCenter('warn', 'Exist', value + ' already exist Next available ' + header + ' is ' + e.value);
              }
              return;
            }
          });
          const refNoList = this.caseLists.filter(x => x.clientId === this.caseCreationFormGroup.get('clientId')?.value &&
            x.clientReferenceNo === value);
          if (refNoList.length > 0) {
            this.caseCreationList[index][colField] = '';
            this.showTopCenter('warn', 'Exist', value + ' ' + 'already exist in CaseList For this Client' + header);
            return;
          }
        } else if (colField === 'clientReferenceNo' && this.IqcByPassFlag == true) {
          this.screeningService.CheckClientRef(value2, this.caseCreationFormGroup.controls.clientId.value).subscribe(e => {

            if (e) {
              if (e.candidateFirstName != null && e.candidateFirstName != '') {
                this.caseCreationList[index].candidateFirstName = e.candidateFirstName;

                this.caseCreationList[index].candidateMiddleName = e.candidateMiddleName;

                this.caseCreationList[index].candidateLastName = e.candidateLastName;
              }
              if (this.IqcByPassFlag) {
                this.clientRefDetail = e;
              }
              return;
            }
          });

        } else if (colField === 'chargeCode') {
          this.screeningService.CheckChargeCode(value, this.caseCreationFormGroup.controls.clientId.value).subscribe(e => {
            if (e === true) {
              this.caseCreationList[index][colField] = '';
              this.showTopCenter('warn', 'Exist', value + ' ' + 'already exist in ' + header);
              return;
            }
          });
        }
      }
    }
  }

  openDialogApp(src, ind, col) {
    const popupData = {
      action: this.IqcByPassFlag ? this.common.OPEN_NNAVIGATE : this.common.OPEN_NAVIGATE,
      id: src,
      headerText: 'Confirmation',
      bodyText: this.IqcByPassFlag ? 'Your Screening ID Already Exist ' : 'Are you sure, you want to Use the Same Applicant Id?'
    };
    const dialogRef = this.dialog.open(CommonAlertsComponent, {
      width: '320px',
      data: popupData,
      disableClose: true
    });
    if (dialogRef) {
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const action = String(result.type);
          if (action === this.common.OPEN_NAVIGATE) {
            this.caseCreationList[ind][col] = src;
          } else if (action === this.common.OPEN_ANOTHER) {
            this.caseCreationList[ind][col] = '';
            dialogRef.close();
          }
        }
      });
    }
  }
  closeForm() {
    this.caseCreationFormGroup.reset();
    this.showFlag = !this.showFlag;
    this.isEdit = false;
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.common.tempResetData  = [];
    this.caseCreationDupList = [];
    this.caseCreationList = [];
    this.caseDetails = undefined;
    this.IqcByPassFlag = undefined;
    this.common.tempResetData.component = [];
    this.breadcrumbFlags.btnReset = false;
    this.breadcrumbFlags.btnSave = false;
    this.btnAddUpload = true;
    this.btnValidate = false;
    this.btnExport = false;
    this.uploadFlag = false;
    this.showGrid = false;
    this.bulkUploadDoc = '';
    this.btnExcelExport = true;
    this.docErrorList = [];
    this.bindCaseCreation();
    // this.caseCreationColumns = this.caseCreationColumns = this.caseCreationColumns.filter(e => e.field !== 'clientReferenceNo');
  }
  resetTable() {
    this.dt.reset();
    this.resetDate();
    this.userData.filters = '';
    this.searchValue = '';
    this.ExcelFlag = false;
    this.isShowAll = false;
    this.global.nativeElement.value = '';
    this.userData.page = 1;
    this.userData.pageSize = 10;
    this.userData.needTotal = true;


  }
  // SiteNo AC
  siteKeyupFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        const comp = this.sites.filter(e =>
          e.siteNoWithsiteName.toLowerCase() === value.toLowerCase());
        if (comp.length > 0) {
          this.sitekeyUp = true;
        } else {
          this.sitekeyUp = true;
        }
      } else {
        this.sitekeyUp = false;
      }
    }
  }
  get displaySiteFn() {
    const compNew = (comp) => {
      if (comp == null || comp === undefined) {
        return null;
      } else {
        if (comp && this.sitefilterlist && this.sitefilterlist.length > 0) {
          comp = this.sitefilterlist.find(x => x.siteId === comp);
          if (comp.siteNoWithsiteName) {
            return comp.siteNoWithsiteName;
          }
        } else {
          return null;
        }
      }
    };
    return compNew;
  }
  siteItems(value: any) {
    if (!value) { this.assignCompCopy(); }
    if (value) {
      this.sitefilterlist = Object.assign([], this.sites).filter(
        item => ((item.siteNoWithsiteName.toLowerCase().indexOf(value.toLowerCase()) > -1)));
    }

  }
  assignCompCopy() {
    this.sitefilterlist = Object.assign([], this.sites);
  }
  // SiteNo AC End
  enableNoCases() {
    if (this.caseCreationFormGroup.controls.clientId.value === null ||
      this.caseCreationFormGroup.controls.siteNo.value === null) {
      this.caseCreationFormGroup.controls.noOfCases.disable();
    } else if (this.caseCreationFormGroup.controls.clientId.value !== null &&
      this.caseCreationFormGroup.controls.siteNo.value !== null) {
      this.caseCreationFormGroup.controls.noOfCases.enable();
    }
    this.caseCreationList = [];
  }
  public openDialog(src: any) {
    const popupData = {
      action: this.common.DELETECONFIRMATION,
      id: src,
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
        if (result) {
          const action = String(result.type);
          if (action === this.common.DELETECONFIRMATION) {
            this.deleteCase(src);
          }
        }
      });
    }
  }
  deleteCase(src: any) {
    this.screeningService.CaseCreationDelete(src.caseNo, this.userData.userId).subscribe(res => {
      if (res) {
        this.showTopCenter('warn', 'Success Message', 'Deleted Successfully');
        this.bindCaseCreation();
      }
    });
  }
  editCase(src: any) {
    this.btnAddUpload = false;
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.breadcrumbFlags.toolTip = 'Update';
    this.btnExcelExport = false;
    this.initFormGroup();
    this.caseCreationFormGroup.get('autoAssign')?.setValue(false); // added by salman For Bug Fixing
    // this.caseCreationFormGroup.controls.caseInitiationDateTime.disable();
    this.caseCreationFormGroup.controls.noOfCases.disable();
    this.caseCreationFormGroup.controls.clientId.disable();
    this.screeningService.GetCaseCreationByCaseNo(src.caseNo).subscribe(res => {
      if (res) {
        this.common.tempResetData = res;
        this.getSiteLocation(this.common.tempResetData.clientId);
        this.getCaseDetailsByClientId(this.common.tempResetData.clientId);
        let caseEntry = this.common.tempResetData.caseEntry;
        let preComponentList = (this.common.tempResetData.caseEntry.length > 0) ? this.common.tempResetData.caseEntry[0].preComponentList : null;
        setTimeout(() => {
          this.caseCreationFormGroup.patchValue({
            clientId: this.common.tempResetData.clientId,
            noOfCases: this.common.tempResetData.caseEntry.length,
            docFolderPath: this.common.tempResetData.urlName,
            caseNo: this.common.tempResetData.caseNo,
            siteNo: this.common.tempResetData.siteId,
            receivedDateTime: this.common.getTimezoneOffsetV2(this.common.tempResetData.caseReceivedDate, false),
            caseInitiationDateTime: this.common.getTimezoneOffsetV2(this.common.tempResetData.caseInitiationDate, false),
            // caseInitiationDateTime: this.common.tempResetData.caseInitiationDate,
            autoAssign: this.common.tempResetData.autoAssign,
            casePriorityLookupId: this.common.tempResetData.casePriorityLookupId,
            countryId: (preComponentList != null && preComponentList.length > 0) ? preComponentList[0].countryId : 0,
            companySiteVisitFlag: this.common.tempResetData.companySiteVisitFlag,

          });
          if (this.common.tempResetData && this.common.tempResetData.siteId > 0) {
            this.caseCreationFormGroup.controls.siteNo.enable();
          } else {
            this.caseCreationFormGroup.controls.siteNo.disable();
          }
        }, 100);
      }
    }, err => {

    }, () => {
      // this.caseCreationFormGroup.controls.siteNo.enable();

      this.caseCreationFormGroup.controls.siteNo.setValue(this.common.tempResetData.siteId);
      this.caseCreationFormGroup.controls.autoAssign.setValue(this.common.tempResetData.autoAssign);
      this.caseCreationFormGroup.controls.autoAssign.disable();
      this.common.tempResetData.caseEntry.forEach(e => { e.preComponentList = e.caseComponent; e.caseComponent  = []; e.indComponentList = []; });
      this.caseCreationList = this.common.CloneObject(this.common.tempResetData.caseEntry);
      if (this.caseDetails) {
        if (this.caseDetails.refNo) {
          this.caseCreationList.map(e => e.clientReferenceNo = e.clientReferenceNo.replace(this.caseDetails.refNo, ''));
        }
      } else if (!this.caseDetails) {
        this.caseCreationList.map(e => e.clientReferenceNo = e.clientReferenceNo.replace(/\D/g, ''));
      }   // this.caseCreationFormGroup.controls.siteNo.enable();
    });
    this.showFlag = !this.showFlag;
    this.isEdit = true;
  }
  getTotalPages(totalRecords, rows) {
    //this.totalpages = Math.ceil((totalRecords) / rows);
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
  navigatePage1(pageNo, rowscount) {
    if (+pageNo > this.totalpages || +pageNo <= 0) {
      this.currentPage = this.tempCurrentPage;
    } else {
      this.dtable.onPageChange({ first: ((pageNo - 1) * rowscount), rows: rowscount });
      this.tempCurrentPage = this.currentPage;
    }
  }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }
  openMailDialog() {
    this.dialog.open(this.mailDialog,
      { disableClose: true, width: '1400px' });
    const index = this.caseCreationColumns.findIndex(x => x.field === 'indComp');
    if (this.isMailIdSave === true && index > -1) {
      this.caseCreationColumns[index].field = 'comps';
      const ind = this.caseCreationColumns.findIndex(x => x.field === 'packageId');
      ind > -1 ? this.caseCreationColumns.splice(ind, 1) : this.caseCreationColumns = this.caseCreationColumns;
    }
    if (this.isMailIdSave === true && this.caseCreationColumns.filter(x => x.field === 'clientReferenceNo').length > 1) {
      const i = this.caseCreationColumns.findIndex(x => x.header === 'Client Ref. #');
      i > -1 ? this.caseCreationColumns.splice(i, 1) : this.caseCreationColumns = this.caseCreationColumns;
    }
  }
  mailChange(mail, assign) {
    this.SendCaseMailList.clientMailId.filter(e => e.emailAddress === mail)[0].selected = assign;
  }
  invitationChange(event: any) {
    const ctrl = ['receivedDateTime', 'caseInitiationDateTime'];
    if (event === true) {
      ctrl.forEach(control => {
        this.caseCreationFormGroup.controls[control].clearValidators();
        this.caseCreationFormGroup.controls[control].updateValueAndValidity();
      });
      // this.caseCreationColumns.splice(1, 0, { field: 'invitationExpireLookupId', header: 'Invitation Expiry Day' });
      // this.caseCreationColumns.splice(1, 0, { field: 'emailId', header: 'Email' });
      this.caseCreationColumns = this.caseCreationColumns.filter(e => e.field !== 'clientReferenceNo');
    } else if (event === false) {
      ctrl.forEach(control => {
        this.caseCreationFormGroup.controls[control].setValidators(Validators.required);
        this.caseCreationFormGroup.controls[control].updateValueAndValidity();
      });
      // this.caseCreationColumns = this.caseCreationColumns.filter(e => e.field !== 'emailId' && e.field !== 'invitationExpireLookupId');
      if (this.caseDetails.refNoFlag === true) {
        this.caseCreationColumns.splice(1, 0, { field: 'clientReferenceNo', header: 'client Ref. #' });
      }
      if (this.caseDetails.ChargeCodeFlag === true) {
        this.caseCreationColumns.splice(1, 0, { field: 'chargeCode', header: 'Charge Code' });
      }
    }
  }
  checkIsExist(type: 'ToInc' | 'ToDec' | 'CCInc' | 'CCDec'): boolean {
    let returnVal = true;
    if (type === 'ToInc') {
      if (this.SendCaseMailList.clientMailId.length > 0) {
        return returnVal = this.SendCaseMailList.clientMailId.filter(e => e.emailType === 'To' && e.selected === false).length === 0;
      }
    }
    if (type === 'ToDec') {
      if (this.SendCaseMailList.clientMailId.length > 0) {
        return returnVal = this.SendCaseMailList.clientMailId.filter(e => e.emailType === 'To' && e.selected === true).length === 0;
      }
    }
    if (type === 'CCInc') {
      if (this.SendCaseMailList.clientMailId.length > 0) {
        return returnVal = this.SendCaseMailList.clientMailId.filter(e => e.emailType === 'CC' && e.selected === false).length === 0;
      }
    }
    if (type === 'CCDec') {
      if (this.SendCaseMailList.clientMailId.length > 0) {
        return returnVal = this.SendCaseMailList.clientMailId.filter(e => e.emailType === 'CC' && e.selected === true).length === 0;
      }
    }
    return returnVal;
  }
  checkVal(value: any) {
    const data: any = this.sitefilterlist.filter(e => e.siteNoWithsiteName.toLowerCase().trim() ===
      value.toLowerCase().trim());
    if (data.length > 0) {
      const datax = data[0];
      this.caseCreationFormGroup.controls.siteNo.setValue(datax.siteId);
      this.caseCreationFormGroup.controls.siteNo.setErrors(null);
    } else {
      this.caseCreationFormGroup.controls.siteNo.setErrors({ incorrect: true });
    }
  }
  // addMail(type: any) {
  //   if (type === 'To') {
  //     if (this.addMailCtrl.valid && this.addMailCtrl.value) {
  //       this.addFlag = false;
  //       this.tovalue = this.addMailCtrl.value;
  //       this.toList.push(this.tovalue);
  //       this.addMailCtrl.setValue('');
  //     }
  //   } else if (type === 'CC') {
  //     if (this.ccMailCtrl.valid && this.ccMailCtrl.value) {
  //       this.ccFlag = false;
  //       this.ccvalue = this.ccMailCtrl.value;
  //       this.ccList.push(this.ccvalue);
  //       this.ccMailCtrl.setValue('');
  //     }
  //   }
  // }
  addMail(event: MatChipInputEvent, type) {
    const input = event.input;
    const value = event.value;
    if (type === 'To') {
      if ((value || '').trim()) {
        if (this.common.EmailRegX.test(value)) {
          this.addFlag = false;
          this.tovalue = value;
          this.toList.push(value);
          if (input) {
            input.value = '';
          }
        } else {
          this.showTopCenter('warn', 'Failure Message', 'Please enter valid Email');
        }
        if (input) {
          input.value = '';
        }
      }
    } else if (type === 'CC') {
      if ((value || '').trim()) {
        if (this.common.EmailRegX.test(value)) {
          this.ccFlag = false;
          this.ccvalue = value;
          this.ccList.push(this.ccvalue);
        } else {
          this.showTopCenter('warn', 'Failure Message', 'Please enter valid Email');
        }
        if (input) {
          input.value = '';
        }
      }
    }
  }
  bulkUpload() {
    if (this.showFlag === false) {
      this.initFormGroup();
    }
    this.showFlag = true;
    this.breadcrumbFlags.btnAdd = false;
    this.breadcrumbFlags.btnBack = true;
    this.breadcrumbFlags.btnSave = false;
    this.breadcrumbFlags.btnReset = false;
    this.breadcrumbFlags.btnResetTbl = false;
    this.btnAddUpload = true;
    this.btnValidate = true;
    this.btnExport = true;
    this.btnExcelExport = false;
    // this.caseCreationFormGroup.controls.noOfCases.enable();
    // this.caseCreationFormGroup.controls.clientId.enable();
    this.caseCreationFormGroup.get('docFolderPath')?.setValidators(null);
    this.caseCreationFormGroup.get('noOfCases')?.setValidators(null);
    this.caseCreationFormGroup.get('receivedDateTime')?.setValidators(null);
    this.caseCreationFormGroup.get('caseInitiationDateTime')?.setValidators(null);
    this.uploadDialog(false);
    this.uploadFlag = true;
  }
  openUploadDoc(event: any) {
    this.bulkUploadDoc = '';
    const fileName = event.target.files[0].name;
    const fileExtn = fileName.split('.').pop();
    if (fileExtn === 'xls' || fileExtn === 'xlsx') {
      this.bulkUploadDoc = event.target.files[0];
    } else {
      this.showTopCenter('warn', 'Failure Message', 'Please upload a file with Extensions: xlsx,xls');
    }
  }
  removeDocument() {
    this.bulkUploadDoc = '';
    this.bulkUploadDoc = [];
    this.docErrorList = [];
    this.docErrorList = [];
    this.showGrid = false;
  }
  exportAsExcelFile1(json: any[], excelFileName: string, headersArray: any[]): void {
    // // Excel Title, Header, Data
    // const header = headersArray;
    // const data = json;
    // // Create workbook and worksheet
    // const workbook = new Workbook();
    // const worksheet = workbook.addWorksheet(excelFileName);
    // // Add Header Row
    // const headerRow = worksheet.addRow(header);
    // // Cell Style : Fill and Border
    // headerRow.eachCell((cell, number) => {
    //   cell.fill = {
    //     type: 'pattern',
    //     pattern: 'solid',
    //     fgColor: { argb: 'FFFFFF00' },
    //     bgColor: { argb: 'FF0000FF' }
    //   };
    //   cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    // });
    // // Add Data and Conditional Formatting
    // data.forEach((element) => {
    //   const eachRow: any[] = [];
    //   headersArray.forEach((headers) => {
    //     eachRow.push(element[headers.field]);
    //   });
    //   if (element.isDeleted === 'Y') {
    //     const deletedRow = worksheet.addRow(eachRow);
    //     deletedRow.eachCell((cell, number) => {
    //       cell.font = { name: 'Calibri', family: 4, size: 11, bold: false, strike: true };
    //     })
    //   } else {
    //     worksheet.addRow(eachRow);
    //   }
    // });
    // worksheet.getColumn(3).width = 15;
    // worksheet.getColumn(4).width = 20;
    // worksheet.getColumn(5).width = 30;
    // worksheet.getColumn(6).width = 30;
    // worksheet.getColumn(7).width = 10;
    // worksheet.addRow([]);
    // // Generate Excel File with given name
    // workbook.xlsx.writeBuffer().then((data1) => {
    //   const blob = new Blob([data1], { type: this.EXCEL_TYPE });
    //   fs.saveAs(blob, excelFileName + '_export_' + new Date().getTime() + this.EXCEL_EXTENSION);
    // });
  }
  removeControl(ind, type) {
    if (type === 'CC') {
      this.ccList.splice(ind, 1);
    }
    if (type === 'To') {
      this.toList.splice(ind, 1);
    }
  }
  dialogClose() {
    this.dialog.closeAll();
  }
  validateUploadFile(option: any) {
    if (this.bulkUploadDoc === '' || this.bulkUploadDoc === undefined || this.bulkUploadDoc.length === 0) {
      this.showTopCenter('error', 'Failure Message', 'Please upload a file to validate');
    } else {
      this.caseCreationFormGroup.markAllAsTouched();
      this.saveCaseBulkUpload(option);
    }
  }
  saveCaseBulkUpload(option: any) {
    const formData = new FormData();
    this.model.clientId = this.caseCreationFormGroup.controls.clientId.value;
    this.model.siteId = this.caseCreationFormGroup.controls.siteNo.value;
    if (this.clients.length > 0) {
      const clientName = this.clients.filter(x => x.clientId === this.model.clientId);
      this.model.clientName = clientName[0].clientName;
    }
    if (this.sitefilterlist.length > 0) {
      const siteName = this.sitefilterlist.filter(x => x.siteId === this.model.siteId);
      this.model.siteName = siteName[0].siteName;
    }
    this.model.autoAssignFlag = this.caseDetails.scopeByPassFlag === true ? false : this.caseCreationFormGroup.controls.autoAssign.value;
    this.model.loggedId = this.userData.userId;
    this.model.fileName = this.bulkUploadDoc.name;
    this.model.bulkUploadDoc = this.bulkUploadDoc;
    this.model.uploadStatus = option;
    this.model.deptId = this.userData.deptId;
    this.model.teamId = this.userData.teamId;
    this.model.applicationId = this.userData.applicationId;
    formData.append('CaseCreationImport', this.bulkUploadDoc);
    formData.append('CaseCreation', JSON.stringify(this.model));
    const displayedimportColCopy = [
      { field: 'excelRow', header: 'Row Number' },
      { field: 'name', header: 'Reference Number' },
      { field: 'detail', header: 'Error Details' },
      { field: 'status', header: 'Status' },
    ];
    if ((this.caseDetails.scopeByPassFlag === true && this.IqcByPassFlag != true) || this.caseDetails.ctsFlag === true) {
      this.displayedimportCol = displayedimportColCopy;
      this.displayedimportCol.splice(2, 0, { field: 'applicantId', header: 'applicantIdHeader' });
      this.master.ScopeByPassCaseCreationImport(formData).subscribe(resp => {
        this.afterBulkSave(resp);
      });
    } else if (this.IqcByPassFlag === true) {
      this.displayedimportCol = displayedimportColCopy;
      this.displayedimportCol.splice(2, 0, { field: 'applicantId', header: 'applicantIdHeader' });
      this.master.IqcByPassCaseCreationImportBulkNew(formData).subscribe(resp => {
        this.afterBulkSave(resp);
      });
    } else {
      this.displayedimportCol = displayedimportColCopy;
      this.screeningService.caseCreationImport(formData).subscribe(resp => {
        this.afterBulkSave(resp);
      });
    }
  }
  getIqcPriority() {
    this.master.GetAllLookupValue(this.common.ScreeningCasePriority).subscribe(res => {
      if (res.length > 0) {
        this.casePriority = res[0].lookupValue;
      }
    });
  }
  getCountry() {
    this.master.getCountry().subscribe(res => {
      if (res.length > 0) {
        this.country = res;
      }
    });
  }
  afterBulkSave(resp: any) {
    if (resp.fakeMasValidResponse.length > 0) {
      this.showGrid = true;
      this.docErrorList = resp.fakeMasValidResponse;
      this.dupErrorList = this.docErrorList.filter(x => x.status === 'Success');
      if (this.dupErrorList.length === this.docErrorList.length) {
        this.showTopCenter('success', 'Success Message', 'Uploaded Successfully');
        this.bulkUploadDoc = '';
        this.closeForm();
      } else if (!resp.response.success === true && resp.response.message) {
        this.showTopCenter('warn', 'Failure Message', resp.response.message);
      }
    } else {
      if (resp.response.success === true) {
        this.showTopCenter('success', 'Success Message', 'Uploaded Successfully');
      } else {
        this.showTopCenter('error', 'Failure Message', resp.response.message);
      }
    }
    this.dialogClose();
  }
  uploadDialog(value: any) {
    this.btnType = value;
    if (this.uploadFlag) {
      if (this.bulkUploadDoc !== undefined) {
        if (this.caseCreationFormGroup.valid) {
          this.dialog.open(this.uploadConfirm, {
            width: '320px',
            disableClose: true
          });
        } else {
          this.caseCreationFormGroup.markAllAsTouched();
        }
      } else {
        this.showTopCenter('error', 'Failure Message', 'Please upload a file');
      }
    }
  }
  getCaseImportTemplete(scopeByPassFlag, ctsFlag) {
    if (scopeByPassFlag) {
      this.ExcelFlag = scopeByPassFlag;
    } else if (ctsFlag) {
      this.ExcelFlag = ctsFlag;
    }
    if (this.caseCreationFormGroup.controls.clientId.value) {
      this.screeningService.getCaseImportTemplete(this.IqcByPassFlag, false, this.ExcelFlag, this.caseDetails.refNoFlag, false, false).subscribe(res => {
        if (res) {
          const sampleArr = this.common.base64ToArrayBuffer(res.document);

          if (this.ExcelFlag) {
            this.scopeByPassExcel(sampleArr, res.fileName);
          } else {
            this.common.saveByteArray(res.fileName, sampleArr);
          }
        }
      });
    } else {
      this.showTopCenter('warn', 'Failure Message', 'Please Select Client');
    }
  }
  scopeByPassExcel(sampleArr, filename) {
    let comp: any[] = []; let pack: any[] = []; let compDrop: any[] = []; let packDrop: any[] = [];
    this.packAndCompList.component.forEach((element, index) => {
      comp.push((index + 1) + ').' + (element.subCompFlag === true ? element.compName + ' - ' +
        (element.packageSubComponent.map(x => x = x.subCompName).join(',')) : element.compName));

      if (element.subCompFlag == true) {
        element.packageSubComponent.forEach(subele => {
          compDrop.push(element.compName + ' - ' + subele.subCompName);
        });
      } else {
        compDrop.push(element.compName);
      }
    });
    this.packAndCompList.package.forEach((e, i) => {
      pack.push((i + 1) + ').' + (e.packageName));
      packDrop.push(e.packageName);
    });
    const blob = new Blob([sampleArr], { type: 'application/octet-stream' });
    let arrayBuffer;
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(blob);
    fileReader.onload = (e) => {
      arrayBuffer = fileReader.result;
      var data = new Uint8Array(arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      const list1 = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: true, });
      this.exportScopeByPassExcel(comp, pack, list1[1], filename, list1[0], compDrop, packDrop);
    }
  }
  exportScopeByPassExcel(comp, pack, json, excelFileName: string, headersArray, compDrop, packDrop) {
    const i1 = headersArray.findIndex(x => x === 'Client Components List');
    const i2 = headersArray.findIndex(x => x === 'Client Packages List');
    json[i1] = comp.join(', ');
    json[i2] = pack.join(', ');
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet(excelFileName);
    // Add Header Row
    const headerRow = worksheet.addRow(headersArray);
    // Cell Style : Fill and Border
    headerRow.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'bed6fa' }, bgColor: { argb: 'b570f5' } };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });
    headersArray.forEach((headers, i) => {
      if ((i === i1 || i === i2) && (json[i].length > 270)) {
        worksheet.getColumn(i + 1).width = json[i].length / 8;
      } else {
        worksheet.getColumn(i + 1).width = 27;
      }
    });
    worksheet.getCell('C1').note = 'Reference number prefix empty then only allow numeric';
    worksheet.getCell('F1').note = 'Date format must be follow:17/10/2020 08:10:00 PM';
    worksheet.getCell('G1').note = 'Date format must be follow:17/10/2020 08:10:00 PM';
    worksheet.getCell('M1').note = 'D://filepath';
    worksheet.getCell('W1').note = 'Date format must be follow:17/10/2020 08:10:00 PM';
    worksheet.addRow(json);
    for (var i = 0; i <= 1000; i++) {
      worksheet.getCell('K' + (+i + 2)).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: ['"' + compDrop + '"']
        //formulae: ['"1).Address - Current Address,Permanent Address,Previous Address, 2).Address - Geo - Previous Address,Permanent Address,Current Address, 3).Bank Statement, 4).Company Site Visit, 5).Credit Verification, 6).Criminal - Federal Nationwide 5 Years, 8).Criminal (Court Record), 9).Criminal Check (PCC1), 10).Criminal Check (PCC2), 11).Criminal Check (PCC3), 12).Criminal Check (PCC3E), 13).Criminal Database, 14).CV Validation, 15).Directorship, 16).Drug Test - 5 Panel, 17).Education, 18).Emergency Contact Verification, 20).EMPLOYEMENT (UAN), 21).Employment (HR), 22).Employment (Supervisor), 23).Gap Verification, 24).Judis Court Record, 25).License, 26).National Identity Check, 27).Nationwide Sex Offender 5 Years, 28).NDOT Drug Screen, 30).Online CRC, 31).Online CRC (Internal), 32).PAN Card, 33).PAN India Online Court Record Verification - Current Address,Previous Address, 34).Passport, 35).Reference Check, 36).Reference Self-employed, 37).SSN Trace, 38).Voter ID"']
      };
    };
    if (json[i2] != null && json[i2] != "") {
      for (var i = 0; i <= 1000; i++) {
        worksheet.getCell('J' + (+ i + 2)).dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: ['"' + packDrop + '"']
        };
      }
    }
    worksheet.getCell('H2').alignment = { wrapText: true };
    worksheet.getCell('I2').alignment = { wrapText: true };
    workbook.xlsx.writeBuffer().then((data1) => {
      const blob = new Blob([data1], { type: this.EXCEL_TYPE });
      fs.saveAs(blob, excelFileName);
    });
  }
  showall() {
    if (this.caseLists.length > 0) {
      this.itemperpage = this.caseLists.length;
      this.isShowAll = true;
      this.bindCaseCreation();
    }
  }
  openEdetails(error: any) {
    this.viewError = error
    this.dialog.open(this.history, {
      width: '800px',
      disableClose: true
    });
  }
  // deleteRow(ind: any) {
  //   this.caseCreationList.splice(ind, 1);
  //   this.showTopCenter('success', 'success Message', 'Deleted Successfully');
  // }
}
class Site {
  clientUserName: string;
  siteId: number;
  siteName: string;
  siteNo: string;
  siteNoWithsiteName: string;
}
class SendCaseMail {
  clientMailId: CaseCreationMail[] = [];
  caseDetails: CaseDetail[] = [];
  clientName: string;
  noOfCase: number;
  loggedIn: number;
  siteName: string;
  applicantId: string;
  applicantIdHeader: string;
}
class CaseCreationMail {
  clientId: number;
  emailType: string;
  emailAddress: string;
  selected = false;
}
class CaseDetail {
  sno: number;
  caseNo: number;
  candidateName: string;
  clientReferenceNo: string;
  applicantId: string;
  siteName: string;
  caseReceivedDate: any;
  caseInitiationDate: any;
}
class LookUpValue {
  contactId: number;
  lookUpCatId: number;
  lookUpId?: number;
  lookUpName: string;
  active?: boolean;
  lookUpValue: string;
  lookUpDesc: string;
}
