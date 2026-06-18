import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, TemplateRef } from '@angular/core';
import { ScreenAuth } from 'src/app/common-methods/models/screen-auth';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { Router } from '@angular/router';
import { QualityCheckService } from 'src/app/common-methods/services/quality-check.service';
import { MatDialog } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { VerificationService } from 'src/app/common-methods/services/verification.service';
import { runInThisContext } from 'vm';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';
import { InvoiceService } from 'src/app/common-methods/services/invoice.service';
import { DomSanitizer } from '@angular/platform-browser';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { base64StringToBlob } from 'blob-util';
import { DatePipe } from '@angular/common';
// import { NullAstVisitor } from '@angular/compiler';
import { SubmissionService } from 'src/app/common-methods/services/submission.service';
export class AssignCloseDate {
  finalQcTranId: number;
  CloseDate: any;
  loggedIn: number;
}
@Component({
  standalone: false,
  selector: 'app-qualitycheck-details',
  templateUrl: './qualitycheck-details.component.html',
  styleUrls: ['./qualitycheck-details.component.css'],
  providers: [DatePipe],
  animations: [
    trigger('rotatedState', [
      state('reset', style({ transform: 'rotate(0deg)' })),
      state('right', style({ transform: 'rotate(90deg)' })),
      state('down', style({ transform: 'rotate(180deg)' })),
      state('left', style({ transform: 'rotate(270deg)' })),
      state('up', style({ transform: 'rotate(360deg)' })),
      transition('rotated => default', animate('1500ms ease-out')),
      transition('default => rotated', animate('400ms ease-in'))
    ])
  ]
})

export class QualitycheckDetailsComponent implements OnInit, OnDestroy {
  checkPackVm = new CheckPackVm();
  state: string = 'default';
  compsData: any;
  dir: string;
  responseDatam: any;
  url: any;
  imageSource: any;
  downid: any;
  downname: any;
  downmethod: any;
  zoomval: number;
  rvalue: number;
  @ViewChild('pdfDialog', { static: true }) pdfDialog!: TemplateRef<any>;
  @ViewChild('OverLabPopUp', { static: true }) OverLabPopUp: TemplateRef<any>;
  @ViewChild('domainPopUp', { static: true }) domainPopUp: TemplateRef<any>;
  @ViewChild('imgprDialog', { static: true }) imgprDialog: TemplateRef<any>;
  @ViewChild('RedColorcodeChangePopUp', { static: true }) RedColorcodeChangePopUp: TemplateRef<any>;
  screenAuth = new ScreenAuth();
  userData: any;
  Message: string = "";
  routePath = 'Qc / Final Qc Approval';
  btnBack = true;
  btnReject = true;
  btnApprove = true;
  showHide = true;
  qcDetails: any;
  empEduFlag: boolean;
  empinsIDs: any;
  clientCategoryId: any;
  qcApproveForm: UntypedFormGroup;
  clientPolicy: any[] = [];
  doclist: any[] = [];
  getdatelist: any[] = [];
  errorType = new UntypedFormControl(null, Validators.required);
  errorTypeList: any[] = [
  ];
  bDEVElst: any;
  DEVElst: any;
  compList: any[] = [
    { compId: 1, compName: 'Education', verifyId: 'ADS-244' },
    { compId: 2, compName: 'Passport', verifyId: 'SSD-343' },
    { compId: 3, compName: 'Missing Component', verifyId: '' }
  ];
  selectedCompList: QcRejectComponentVm[] = [];
  @ViewChild('dt', { static: false }) dt!: Table;
  currentPage = 1;
  tempCurrentPage = 1;
  totalpages: number;
  page = new UntypedFormControl();
  cols = [
    { field: 'verificationId', header: 'Verification Id' },
    { field: 'compName', header: 'Component Name' },
    { field: 'remark', header: 'Remarks' },
  ];
  colsPackChoose = [
    { field: 'screeningCompId', header: 'Verification Id' },
    { field: 'receivedDate', header: 'Received Date' },
    { field: 'compName', header: 'Component' },
    { field: 'rptType', header: 'Package' },
    { field: 'sourceCountry', header: 'Country' },
    { field: 'qcApproveFlag', header: 'QC Approved' },
    { field: 'allotFlag', header: 'Allot' },
  ];
  colsFQC = [
    { field: 'verificationId', header: 'Verification Id' },
    { field: 'receivedDate', header: 'Received Date & Time' },
    { field: 'compName', header: 'Component' },
    { field: 'Package', header: 'Package' },
    { field: 'Country', header: 'Country' },
    { field: 'QCApproval', header: 'QC Approval' },
    { field: 'Allot', header: 'Allot' },
  ];
  colsHistory = [
    { field: 'verificationId', header: 'Verification Id' },
    { field: 'compName', header: 'Component Name' },
    { field: 'receivedDate', header: 'Received Date & Time' },
    { field: 'approvedDate', header: 'Individual Approved Date & Time' },
    { field: 'screeningOwnerFname', header: 'Screening Owner' },
    { field: 'qcOwnerFname', header: 'Qc By' },
  ];
  colsRejectedHistory = [
    { field: 'verificationId', header: 'Verification Id' },
    { field: 'compName', header: 'Component Name' },
    { field: 'rejectDate', header: 'Rejected Date & Time' },
    { field: 'remark', header: 'Rejected Reason' },
    { field: 'rejectClearedStatus', header: 'Reject Cleared Status' },
    { field: 'rejectClearedDate', header: 'Cleared Date' },
  ];
  isReject = false;
  @ViewChild('confirmation', { static: true }) confirmation;
  @ViewChild('FQC', { static: true }) FQC;
  @ViewChild('history', { static: true }) history!: any;;
  @ViewChild('choosePackage', { static: true }) choosePackage;
  @ViewChild('approve', { static: true }) approve;
  @ViewChild('reject', { static: true }) reject;
  @ViewChild('alertPopUp', { static: true }) alertPopUp;
  @ViewChild('pdfReportTitle', { static: true }) pdfReportTitle;
  @ViewChild('changeColorCode', { static: true }) changeColorCode;
  @ViewChild('DateAlertPopUp1', { static: true }) DateAlertPopUp1;
  dialogRef: any;
  remark = new UntypedFormControl();
  comment = new UntypedFormControl('', Validators.required);
  compHistoryList: QcRejectComponentVm[] = [];
  CloneData: any;
  jdcflag: boolean = false;
  rejectedHistoryList: QcRejectComponentVm[] = [];
  qcReject = new QcRejectVm();
  compNameList: CompNameVm[] = [];
  count: any;
  screeningId: any;
  individualQc: any;
  screeningCompId: any;
  indQCDetailedDoc: any;
  packageflag = new UntypedFormControl(null);
  pdfType = '';
  functioanlEntity: string;
  historyFlag: boolean;
  compHistoryCommentList: any[] = [];
  addFeeList: any[] = [];
  packageInvoiceList: any;
  packageIdCtrl = new UntypedFormControl(null, Validators.required);
  spinnerShows: boolean;
  JoiningDate: any;
  domainCreationDate: any;
  empfromDate: any
  CloseDate: any;
  UpdateClosedDate: any;
  finalQcTransactionId: number;
  CTSFlag: boolean;
  AssignCloseDateList: AssignCloseDate = new AssignCloseDate();
  showWarning: boolean = false;
  ReportTitle: any;
  isColorCancelFlag: any = false;
  IscloseddateSelected: any
  ReportTypeList: any;
  colorStatus: string;
  domaincreatedDate: any;
  empFromDate: any;
  type: string = '';
  stopcolorCode: boolean = false;
  messageText: any;
  lastEmpComment: string;
  lastEduComment: string;
  headerText: string;
  finalAlert: any[] = [];
  finalAlertMessage: any;
  messages: string[];
  colorStatuslist: any;
  twoColorSatus: any;
  redCompData: any;
  editRedCompData: any[] = [];
  redcolorCloseFlag: boolean = false;
  enableAutoIqc: boolean = false;
  enableAutoFqc: boolean = false;
  getFinalReportFlag: boolean = false;
  isSuspicious: boolean = false;
  findEmpList: any[] = [];
  findCurrentEmpList: any[] = [];
  findPreviousEmpList: any[] = [];

  findcurrentEmpList: any;
  // [] = [
  //   { reportId: 1, reportTitle: 'Final' },
  //   { reportId: 2, reportTitle: 'Interim' }
  // ];

  constructor(private sanitizer: DomSanitizer, public verification: VerificationService, private screen: ScreeningService, public dialog: MatDialog, private fb: UntypedFormBuilder, private invoice: InvoiceService,
    // tslint:disable-next-line:align
    public submissionService: SubmissionService, private quality: QualityCheckService, private auth: AuthService, private router: Router, private message: MessageService,
    public common: CommonService, private dateP: DatePipe) { }

  ngOnInit() {
    this.verification.ReportTitleID = 0;
    this.verification.ReportTitle = '';
    this.verification.isReportColorChanged = false;
    this.verification.isFinalReport = false;
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.screenAuth = this.auth.getScreenAuth(this.common.QUALITYCHECK_ROUTER);
    this.quality.currentMessage.subscribe(message => this.qcDetails = message);
    if (this.userData.teamName === 'CTS-CRTTeam') {
      this.btnApprove = false;
      this.btnReject = false;
    }
    if (this.qcDetails?.finalQcFlag !== true) {
      const isCloseInsuff = this.qcDetails?.screeningStatus?.toLowerCase() === this.common.CLOSEINSUFFICIENCY.toLowerCase() && this.qcDetails?.insuffRaisedFlag === true;
      if (isCloseInsuff === true) {
        this.btnReject = true;
      }
    }
    this.initFormGroup();
    if (this.qcDetails) {
      this.GetScreeningDocumentClientPolicy();
      this.GetQcErrorType(this.qcDetails.invitationFlag, this.qcDetails.deqcFlag);
      this.GetQcComponentHistory();
      this.report();
      this.GetReportType();
      this.spinnerShows = true;
      this.pdfType = this.auth.getpdfType('pdfType');
    } else {
      if (this.quality.qcOrFqc === 'FQC') {
        this.router.navigate(['dashboard/qc/FinalQcCheckDetail']);
      } else {
        this.router.navigate(['dashboard/qc/qualitycheck']);
      }
      //this.router.navigate(['/dashboard/qc/qualitycheck']);
    }
    this.eduempIdandFlag();
  }
  eduempIdandFlag() {
    if (this.qcDetails.compId === this.common.EMPLOYMENT_HRId || this.qcDetails.compId === this.common.EDUCATIONId) {
      if (this.qcDetails.compId === this.common.EMPLOYMENT_HRId) {
        this.empinsIDs = this.qcDetails.employerId;
        this.clientCategoryId = this.qcDetails.clientCategoryId
        this.empEduFlag = true;
      } else {
        this.clientCategoryId = this.qcDetails.clientCategoryId
        this.empinsIDs = this.qcDetails.instutionId;
        this.empEduFlag = false;
      }
    }
  }

  public getStopColorCode(data: any) {
    data.executiveDetail.forEach(element => {
      element.component.forEach((compElement) => {
        compElement.component.forEach((comp: any) => {
          if (comp.status == 'Stop') {
            this.stopcolorCode = true;
          }
        });
      });
    });
  }
  previewReportDownload() {
    this.verification.fromQC = true;
    if (this.qcDetails.finalQcFlag === true) {
      this.screeningId = this.qcDetails.screeningId;
      this.verification.screeningId = this.qcDetails.screeningId;
      this.screeningCompId = 0;
      this.verification.individualQc = 0;
      this.getFinalReprt(this.screeningId, this.screeningCompId, this.qcDetails.clientId, 'preview');
    } else {
      this.screeningId = 0;
      this.verification.individualQc = 1;
      this.verification.screeningCompId = this.qcDetails.screeningCompId;
      this.screeningCompId = this.qcDetails.screeningCompId;
      this.getFinalReprt(this.screeningId, this.screeningCompId, this.qcDetails.clientId, 'preview');
    }
    //  alert('Security Alerts. You cannot open this site in multiple tabs. This window will now close.');
    // this.router.navigate(['/dashboard/qc/qualitycheck'])
    const url = 'http://localhost:4300/dashboard/qc/qualityCheckDetail';
    window.open(url);
  }
  report() {
    this.verification.fromQC = true;
    if (this.qcDetails.finalQcFlag === true || (this.enableAutoFqc == true && this.enableAutoIqc == false)) {
      this.screeningId = this.qcDetails.screeningId;
      this.verification.screeningId = this.qcDetails.screeningId;
      this.screeningCompId = 0;
      this.verification.individualQc = 0;
      this.getFinalReprt(this.screeningId, this.screeningCompId, this.qcDetails.clientId, 'download');
      // this.quality.GetFinalQCReportDocument(this.common.screenName, this.screeningId, this.userData.userId).subscribe(res => {
      //   if (res) {
      //     this.downloadFile(res.document, res.fileName);
      //   }
      // });
    } else {
      this.screeningId = 0;
      this.verification.individualQc = 1;
      this.verification.screeningCompId = this.qcDetails.screeningCompId;
      this.screeningCompId = this.qcDetails.screeningCompId;
      this.getFinalReprt(this.screeningId, this.screeningCompId, this.qcDetails.clientId, 'download');
      // this.quality.GetIndividualQCReportDocument(this.screeningCompId, this.userData.userId).subscribe(res => {
      //   if (res) {
      //     this.downloadFile(res.document, res.fileName);
      //   }
      // });
    }
  }
  downloadFile(doc, filename) {
    if (doc || filename) {
      const sampleArr = this.common.base64ToArrayBuffer(doc);
      this.common.saveByteArray(filename, sampleArr);
    }
  }
  GetQcComponentHistory() {
    this.quality.GetQcComponentHistory(this.qcDetails.screeningId).subscribe(resp => {
      const dummyList = resp;
      this.compHistoryList = [];
      resp.forEach(ele => {
        if ((ele.enableAutoFQC === false && ele.enableAutoIqc === true) || (ele.enableAutoFQC === false && ele.enableAutoIqc === false)) {
          this.compHistoryList.push(ele);
        }
      })

      this.CloneData = this.common.CloneObject(this.compHistoryList);
      if (this.qcDetails.finalQcFlag == true && this.CloneData.length > 0) {
        const jdclst = this.CloneData.filter(f => f.compName == "Judis Court Record")
        if (jdclst.length > 0) {
          this.jdcflag = true;
        } else {
          this.jdcflag = true;
        }
      }

      if (this.qcDetails.finalQcFlag === true) {

        this.compHistoryList.forEach(element => {
          if (element.subCompName) {
            element.compName = (element.compName) + ' - ' + (element.subCompName);
          }
        });
      }
      const IQCList = dummyList.filter(x => x.screeningCompId === this.qcDetails.screeningCompId);
      if (IQCList.length > 0) {
        this.functioanlEntity = IQCList[0].functionalEntity;
      }
      if (this.qcDetails.finalQcFlag === true) {
        this.rejectedHistoryList = this.compHistoryList.filter(x => x.rejectFlag === true);
        this.compHistoryList = this.compHistoryList.filter(x => x.rejectFlag === false);
      } else {
        this.rejectedHistoryList = dummyList.filter(x => x.rejectFlag === true && x.screeningCompId ===
          this.qcDetails.screeningCompId);
      }
    });
  }
  //ClientRefNo added By Megala - for VTS2-2023-DEV-0141 (Comment History Added In Global Search)
  getComponentComments() {
    this.verification.getComponentComments(this.qcDetails.finalQcFlag === true ? 0 : this.qcDetails.screeningCompId,
      this.qcDetails.screeningId, null).subscribe(resp => {
        if (resp) {
          this.compHistoryCommentList = resp;
          this.addFeeList = [];
          this.compHistoryCommentList.forEach(element => {
            if (element.subCompName) {
              element.compName = (element.compName) + ' - ' + (element.subCompName);
            }
            if (element.comments.includes('Additional Fees') || (element.comments.includes('Component Fees') && this.qcDetails.iqcByPassFlag === true)) {
              this.addFeeList.push(element);
            }
          });
        }
      });
  }
  GetQcErrorType(invitationFlag, deqcFlag) {
    this.quality.GetQcErrorType().subscribe(resp => {
      //Modify By Megala 27/12/2023
      if (invitationFlag === true) {
        // if (this.qcDetails.finalQcFlag === true) {
        //   this.errorTypeList = resp.filter(f => f.lookUpName !== this.common.BOTH_DE_PREQC_Error)
        // } else {
        // Changed by Vignesh M - 09/02/2024 - Case not showing in appropriate queue | Live environment
        if (this.qcDetails.componentName.includes('Gap Verification')) {
          this.errorTypeList = resp.filter(f => f.lookUpName === this.common.DE_QC_Error);
        }
        else if (this.qcDetails.componentName.includes('CV Validation')) {
          this.errorTypeList = resp.filter(f => f.lookUpName === this.common.DE_QC_Error);
        }
        else {
          this.errorTypeList = resp.filter(f => f.lookUpName === this.common.DE_QC_Error || f.lookUpName === this.common.OT_VE_Error || f.lookUpName === this.common.BOTH_DE_PREQC_Error);
        }
        // }
      } else {

        if (deqcFlag === true) {
          this.errorTypeList = resp.filter(f => f.lookUpName !== this.common.BOTH_DE_PREQC_Error);
          // this.errorTypeList = resp;
        } else if (this.qcDetails.finalQcFlag === true && this.jdcflag != true) {
          this.bDEVElst = resp.filter(f => f.lookUpName == this.common.BOTH_Error);
          this.DEVElst = resp.filter(f => f.lookUpName == this.common.DE_Error);
          if (this.qcDetails.clientCategoryId != 2) {
            this.errorTypeList = resp.filter(f => f.lookUpName !== this.common.DE_QC_Error && f.lookUpName !== this.common.BOTH_DE_PREQC_Error);
          } else {
            this.errorTypeList = resp.filter(f => f.lookUpName !== this.common.DE_QC_Error && f.lookUpName !== this.common.BOTH_DE_PREQC_Error);
          }
        } else {
          this.errorTypeList = resp.filter(f => f.lookUpName !== this.common.DE_QC_Error && f.lookUpName !== this.common.BOTH_DE_PREQC_Error);
        }
        if (this.qcDetails.componentName.includes('CV Validation')) {
          this.errorTypeList = resp.filter(f => f.lookUpName === 'DE Error');
        }
        if (this.qcDetails.componentName.includes('Gap Verification')) {
          this.errorTypeList = resp.filter(f => f.lookUpName === 'DE Error');
        }
      }


    });
  }
  GetReportType() {
    this.quality.GetReportType().subscribe(resp => {
      this.ReportTypeList = resp;
    });
  }
  GetScreeningDocumentClientPolicy() {
    this.quality.GetScreeningDocumentClientPolicy(this.qcDetails.screeningId, this.qcDetails.clientId,
      this.qcDetails.screeningCompId, this.qcDetails.finalQcFlag).subscribe(resp => {
        if (resp) {
          this.enableAutoIqc = resp.enableAutoIqc;
          this.enableAutoFqc = resp.enableAutoFqc;
          // VTS2-2023-CRT-0123 , VTS2-2023-CRT-0120 - Edu, Emp overlap and Gap Alert Validation
          if (this.clientCategoryId !== 2) {
            this.finalAlert = [];
            if (resp.getOverlapSixMonthEduEmpVms.length > 0) {
              if (resp.getOverlapSixMonthEduEmpVms[0].finalQcFlag == true) {
                resp.getOverlapSixMonthEduEmpVms.forEach(ele => {
                  this.finalAlert.push(ele.sixMonthComment ? ele.sixMonthComment : '');
                  if (ele.compId == 18) {
                    this.lastEmpComment = ''; this.lastEmpComment = ele.eduEmpSixMonthComment;
                  }
                  if (ele.compId == 15) {
                    this.lastEduComment = ''; this.lastEduComment = ele.eduEmpSixMonthComment;
                  }
                })
                this.headerText = 'Alert !';
                this.messageText = this.finalAlert ? this.finalAlert.join(', ') : '';
                this.finalAlertMessage = (this.messageText ? (this.messageText + ', ') : '') + (this.lastEmpComment ? (this.lastEmpComment + ', ') : '') + (this.lastEduComment ? this.lastEduComment : '');
                this.messages = this.finalAlertMessage.split('--').map(message => message.trim()).filter(str => str && str !== ',');
                const dialogRef = this.dialog.open(this.DateAlertPopUp1, {
                  width: '500px',
                  disableClose: true
                });
              } else {
                if (resp.getOverlapSixMonthEduEmpVms[0].overlapComment) {
                  this.headerText = 'Alert !';
                  this.messageText = resp.getOverlapSixMonthEduEmpVms[0].overlapComment;
                  this.messages = this.messageText.split('--').map(message => message.trim());
                  const dialogRef = this.dialog.open(this.DateAlertPopUp1, {
                    width: '500px',
                    disableClose: true
                  });
                }
              }
            }
          }
          //End
          this.doclist = resp.screeningDocument;
          let compList: any[] = [];
          this.doclist.forEach(element => {
            element.compName = element.compName ? (element.compName + (element.subCompName ? (' - ' + element.subCompName) : '')) : null;
            compList.push(element.compName ? (element.compName) : 'Supporting');
          });
          // compList = compList.filter(w => w !== null);
          compList = compList.filter((el, i, a) => i === a.indexOf(el));
          compList.forEach(ele => {
            const A = new CompNameVm();
            A.compName = ele;
            // A.Document = this.doclist.filter(x => x.compName === ele);
            A.Document = ele === 'Supporting' ? this.doclist.filter(x => x.compName === null) : this.doclist.filter(x => x.compName === ele);
            this.compNameList.push(A);
          });
          this.clientPolicy = resp.clientPolicy;
          this.indQCDetailedDoc = resp.qcDocument;
          if (resp.researchDocument.length > 0) {
            this.getFRDocs(resp.researchDocument);
            this.getdatelist = resp.researchDocument;
            this.domaincreatedDate = this.getdatelist[0].domaincreatedDate;
            this.empFromDate = this.getdatelist[0].empFromDate
          }
          // this.getFRDocs(resp.researchDocument);
          // this.getdatelist=resp.researchDocument;
          // this.domaincreatedDate =this.getdatelist[0].domaincreatedDate;
          // this.empFromDate =this.getdatelist[0].empFromDate

          if (resp.researchDocument.length > 0) {
            this.getFRDocs(resp.researchDocument);
            this.getdatelist = resp.researchDocument;
            this.domaincreatedDate = this.getdatelist[0].domaincreatedDate;
            this.empFromDate = this.getdatelist[0].empFromDate
          }
          // this.getFRDocs(resp.researchDocument);
          // this.getdatelist=resp.researchDocument;
          // this.domaincreatedDate =this.getdatelist[0].domaincreatedDate;
          // this.empFromDate =this.getdatelist[0].empFromDate

        }
      });
  }
  getFRDocs(list: any) {
    // this.domaincreatedDate = list[0].domaincreatedDate;
    // this.empFromDate = list[0].empFromDate;
    let listVal: any[] = [];
    list.forEach(element => {
      element.researchDocumentTrans.forEach(ele => {
        ele.docTypeName = this.common.FOR_RE;
        const i = this.compNameList.findIndex(x => x.compName === element.compName);
        if (i > -1) {
          this.compNameList[i].Document.push(ele);
        }
        else {
          const ind = listVal.findIndex(x => x.compName === element.compName);
          if (ind > -1) {
            listVal[ind].Document.push(ele);
          } else {
            const listOne = new CompNameVm();
            listOne.compName = element.compName;
            listOne.Document = [];
            listOne.Document.push(ele);
            listVal.push(listOne);
          }
        }
      });
    });
    if (listVal.length > 0) {
      this.compNameList.push(...listVal);
    }
  }
  initFormGroup() {
    this.qcApproveForm = this.fb.group({
      rejectFlag: [false],
      approvedFlag: [false],
      screeningCompId: [0],
      screeningId: [0],
      finalQcFlag: [false],
      qcCompTransId: [0],
      finalQcTransId: [this.qcDetails.finalQcTransId],
      loggedIn: [this.userData.userId],
      remarks: [''], // Validators.required
      clientId: [0],
      clientName: [''],
      referenceNo: [''],
      candidateName: [''],
      colorCode: [''],
      iQcByPassFlag: [],
      caseNo: [0],
      document: null
    });
  }
  //Cmd By Megala
  // rmvBerror() {
  //   this.errorTypeList = this.errorTypeList.filter(f => f.lookUpName !== this.common.BOTH_Error);
  // }
  submitForm(data, i) {
    if (this.qcDetails.finalQcFlag == true && data.compName == "Judis Court Record") {
      this.errorTypeList.push(this.bDEVElst[0]);
      this.errorTypeList = this.errorTypeList.filter(f => f.lookUpName !== this.common.DE_Error);
    } else {
      //Cmd by Megala 19-01-2024
      // if (this.qcDetails.clientCategoryId == 2) {
      //   this.errorTypeList = this.errorTypeList.filter(f => f.lookUpName !== this.common.BOTH_Error);
      // }

      if (!this.errorTypeList.filter(f => f.lookUpName == this.common.DE_Error)) {
        this.errorTypeList.push(this.DEVElst[0]);
      }

    }
    this.count = i;
    this.dialogRef = this.dialog.open(this.confirmation, {
      width: '510px',
      disableClose: true
    });
  }
  openDialog(data: any) {
    this.historyFlag = data;
    this.getComponentComments();
    this.dialogRef = this.dialog.open(this.history, {
      width: '900px',
      disableClose: true
    });
  }
  openDialogInsuff(data: any) {
    this.historyFlag = data;
    this.getComponentComments();
    this.dialogRef = this.dialog.open(this.history, {
      width: '900px',
      disableClose: true
    });
  }
  addRemarks() {
    if (this.remark.value && this.errorType.value) {
      this.compHistoryList[this.count].remark = this.remark.value;
      this.compHistoryList[this.count].errorTypeLookUpId = this.errorType.value;
      //this.rmvBerror();
      this.dialogRef.close();
      this.showTopCenter('success', 'Success Message', 'Remarks Added Successfully');
      this.remark.setValue('');
    }
  }
  openEmpDialog() {
    this.dialogRef = this.dialog.open(this.OverLabPopUp, {
      width: '350px',
      disableClose: true
    });
  }
  OpenEmpDomainDialog() {
    this.dialogRef = this.dialog.open(this.domainPopUp, {
      width: '450px',
      disableClose: true
    });
  }

  dateRangeOverlaps(a_start, a_end, b_start, b_end) {
    if (a_start <= b_start && b_start <= a_end) { return true; } // b starts in a
    if (a_start <= b_end && b_end <= a_end) { return true; } // b ends in a
    if (b_start < a_start && a_end < b_end) { return true; } // a in b
    return false;
  }
  // multipleDateRangeOverlaps(arguments: any) {
  //   var i, j;
  //   // if (arguments.length % 2 !== 0)
  //   //   throw new TypeError('Arguments length must be a multiple of 2');
  //   for (i = 0; i < arguments.length - 2; i += 2) {
  //     for (j = i + 2; j < arguments.length; j += 2) {
  //       if (
  //         dateRangeOverlaps(
  //           arguments[i], arguments[i + 1],
  //           arguments[j], arguments[j + 1]
  //         )
  //       ) return true;
  //     }
  //   }
  //   return false;
  // }

  approveOrOverlap() {
    let employerData: any[] = [];
    let docnull: any;
    docnull = this.verification?.pdfvalue?.document;
    if (this.qcDetails.finalQcFlag === true) {
      const empData = this.responseDatam.filter(s => s.compId == this.common.EMPLOYMENT_HRId);
      if (empData.length > 0) {
        this.submissionService
          .getEmpGapReasonDetail(this.qcDetails.screeningId, this.common.EMPLOYMENT_HRId)
          .subscribe((resp) => {
            this.compsData = resp;
            employerData = this.compsData;
            const [overlapExists, errorMessage] = this.checkEmploymentOverLapping(employerData, true);
            if (overlapExists) {
              this.Message = errorMessage;
              this.openEmpDialog();
              return false;
            }
            //if (docnull != null) {
            // this.openApprove();
            this.DomainPopupalert();
            //  } else {
            //    this.showTopCenter('warn', 'Failure Message', 'pdf Report is not generated');
            //  }
          });
      } else {
        //if (docnull != null) {
        //this.openApprove();
        this.DomainPopupalert();
        //}
        // else {
        //   this.showTopCenter('warn', 'Failure Message', 'pdf Report is not generated');
        // }
      }
    }
    else if (this.qcDetails.finalQcFlag !== true) {
      if (this.qcDetails.compId === this.common.EMPLOYMENT_HRId) {
        this.submissionService
          .getEmpGapReasonDetail(this.qcDetails.screeningId, this.qcDetails.compId)
          .subscribe((resp) => {
            this.compsData = resp;
            const curDateDetail = this.compsData.filter(s => s.screeningCompId == this.qcDetails.screeningCompId);
            const empDateDetail = this.compsData.filter(s => s.screeningCompId != this.qcDetails.screeningCompId);
            // employerData.push(curDateDetail);
            curDateDetail.forEach(element => {
              employerData.push(element);
            });
            empDateDetail.forEach(element => {
              employerData.push(element);
            });
            const [overlapExists, errorMessage] = this.checkEmploymentOverLapping(employerData, false);
            if (overlapExists) {
              this.Message = errorMessage;
              this.openEmpDialog();
              return false;
            }

            // this.openApprove();
            this.DomainPopupalert();
          });
      } else {
        //this.openApprove();
        this.DomainPopupalert();
      }
    }
  }
  //Ajith:- Start - VTS2-2023-FR-0138 :- employment checks they want to change the color code based on the employer verification outcome.
  selectedColor: string[] = [];

  RedColorCodeChange() {
    const clientId = this.qcDetails.clientId;
    this.quality.GetColorSatus(clientId).subscribe(resp => {
      this.colorStatuslist = resp;
      this.twoColorSatus = this.colorStatuslist.filter(w => w.lookUpName === 'Green' || w.lookUpName === 'Orange' || w.lookUpName === 'Positive' || w.lookUpName === 'Positive-Review')
    })
  }
  // UpdatecolorCodeChange(selecolorId, rowdata: any[]) {
  //   this.editRedCompData = [];
  //    for (let i = 0; i < Math.min(selecolorId.length, rowdata.length); i++) {
  //     if (selecolorId[i] != undefined && selecolorId[i] != null) {
  //       this.editRedCompData.push({
  //         screeningCompId: rowdata[i].screeningCompId,
  //         colorLookupId: selecolorId[i],
  //         LogginId : this.userData.userId,
  //         screeningRptContactId: rowdata[i].screeningRptContactId
  //       });
  //     }        
  //   }
  //   if (this.editRedCompData.length === rowdata.length ) {
  //     this.quality.UpdateRedColorCodeComp(this.editRedCompData).subscribe(resp => {
  //       if(resp: any) {
  //         this.getFinalReprt(this.screeningId, this.screeningCompId, this.qcDetails.clientId, 'download');
  //         this.closeDialogref();
  //         this.showTopCenter('success', 'Update Successfully', ' ColorCode Update Successfully');
  //       }
  //     })

  //   }
  //  else {
  //     this.showTopCenter('warn', 'Failure Message', 'Please Select DropDown ColorCode');  
  //   }
  // }

  UpdatecolorCodeChange(selecolorId, rowdata: any[]) {
    this.editRedCompData = [];

    for (let i = 0; i < Math.min(selecolorId.length, rowdata.length); i++) {
      if (selecolorId[i] != undefined && selecolorId[i] != null) {
        this.editRedCompData.push({
          screeningCompId: rowdata[i].screeningCompId,
          colorLookupId: selecolorId[i],
          LogginId: this.userData.userId,
          screeningRptContactId: rowdata[i].screeningRptContactId
        });
      }
    }

    if (this.editRedCompData.length === rowdata.length) {
      this.quality.UpdateRedColorCodeComp(this.editRedCompData)
        .subscribe((resp: any) => {

          if (resp) {
            this.getFinalReprt(
              this.screeningId,
              this.screeningCompId,
              this.qcDetails.clientId,
              'download'
            );

            this.closeDialogref();

            this.showTopCenter(
              'success',
              'Update Successfully',
              'ColorCode Update Successfully'
            );
          }
        });
    } else {
      this.showTopCenter(
        'warn',
        'Failure Message',
        'Please Select DropDown ColorCode'
      );
    }
  }

  closeDialogref() {
    this.dialogRef.close();
    this.redcolorCloseFlag = true;
  }

  onCancelClick(): void {
    this.selectedColor = [];
    this.dialogRef.close();
    this.redcolorCloseFlag = true;
  }
  //End - VTS2-2023-FR-0138 

  // added by Vignesh M - Issue with recent Live release | VTS2-2023-CRT-0121 not working as expected | Critical issue
  DomainPopupalert() {
    const dDate = (this.common.getTimezoneOffset(this.domaincreatedDate, false));
    const fqc = this.qcDetails.finalQcFlag;
    this.domainCreationDate = this.dateP.transform(dDate, 'yyyy-MM-dd');
    this.empfromDate = this.dateP.transform(this.empFromDate, 'yyyy-MM-dd');
    if (this.empfromDate != null && this.domainCreationDate > this.empfromDate && this.domainCreationDate !== null) {
      if (this.qcDetails.finalQcFlag !== true) {
        this.Message = "Domain Disconnect found basis Period of Employment, as the domain creation date  " + this.dateP.transform(this.domainCreationDate, 'dd/MMM/yyyy') + " is greater than employment starting date " + this.dateP.transform(this.empfromDate, 'dd/MMM/yyyy');
      }
      // else {
      //   this.Message = "Domain Disconnect found basis Period of Employment, as the domain creation date  " + this.dateP.transform(this.DomainCreationDate, 'dd/MMM/yyyy') + " is greater than employment starting date " + this.dateP.transform(this.empFromDate, 'dd/MMM/yyyy');
      // }
      this.OpenEmpDomainDialog();
      return false;
    }
    else {
      this.openApprove();
    }
  }
  convertToDateFromString(dateValue: string): any {
    // let invalidArray = ["NOT APPLICABLE", "NOT PROVIDED", "TILL DATE"];
    if (this.checkNullAndUndefine(dateValue)) {
      let convertedDate = this.common.convertDate(dateValue)
      if (convertedDate != '' && convertedDate != 'Invalid Date') {
        return convertedDate;
      }
    }
    return dateValue;
  }

  checkNullAndUndefine(value: any): boolean {
    return (value != null && value != undefined);
  }

  checkEmploymentOverLapping(employments: any, isFqc: boolean = true): [boolean, string] {
    if (employments.length <= 1) {
      return [false, ""];
    }

    //const duplicateEmploymemnt = employments;
    const currentEmployement = employments[0];
    const remainingEmployments = employments.slice(1);
    //const remainingEmployments = isFqc ? employments.slice(1) : duplicateEmploymemnt.slice(1);

    for (const employment of remainingEmployments) {

      let fqcMessage = "There is an overlap in the Employment period for this case, kindly check and proceed.";
      let iqcMessage = "Period of Employment for this Employment (HR) " + currentEmployement.fromDate + " and " + currentEmployement.toDate + " is Overlapping with Previous Employment (HR) " + employment.fromDate + " and " + employment.toDate + "!";

      // if (this.checkNullAndUndefine(currentEmployement.toDate) && currentEmployement.toDate != null && currentEmployement.toDate.toUpperCase().includes('TILL DATE'))
      //   currentEmployement.toDate = new Date();

      if (currentEmployement.toDate === "TILL DATE") {
        if (this.checkNullAndUndefine(currentEmployement.toDate) && currentEmployement.toDate != null && currentEmployement.toDate.toUpperCase().includes('TILL DATE'))
          currentEmployement.toDate = new Date();
      }

      if (this.checkNullAndUndefine(employment.toDate) && employment.toDate.toUpperCase().includes('TILL DATE'))
        employment.toDate = new Date();

      let currentFromDate = this.convertToDateFromString(currentEmployement.fromDate);
      let currentToDate = this.convertToDateFromString(currentEmployement.toDate);

      let compareFromDate = this.convertToDateFromString(employment.fromDate);
      let compareToDate = this.convertToDateFromString(employment.toDate);
      //if(currentFromDate <= compareToDate && compareFromDate <= currentFromDate){
      //console.log(currentFromDate + " and "+currentToDate + " overlap with " + compareFromDate + " and "+compareToDate)
      //return [true,  (isFqc? fqcMessage : iqcMessage)];
      //}

      if (currentFromDate <= compareFromDate && compareFromDate <= currentToDate) {
        //console.log(currentFromDate + " and "+currentToDate + " overlap with " + compareFromDate + " and "+compareToDate)
        return [true, (isFqc ? fqcMessage : iqcMessage)];
      }
      if (currentFromDate <= compareToDate && compareToDate <= currentToDate) {
        //console.log(currentFromDate + " and "+currentToDate + " overlap with " + compareFromDate + " and "+compareToDate)
        return [true, (isFqc ? fqcMessage : iqcMessage)];
      }
      if (compareFromDate < currentFromDate && currentToDate < compareToDate) {
        //console.log(currentFromDate + " and "+currentToDate + " overlap with " + compareFromDate + " and "+compareToDate)
        return [true, (isFqc ? fqcMessage : iqcMessage)];
      }
    }
    if (!isFqc)
      return [false, ""];

    return this.checkEmploymentOverLapping(remainingEmployments, isFqc);
  }

  /*

  approveOverlap() {
    if (this.qcDetails.finalQcFlag === true) {
      const empData = this.responseDatam.filter(s => s.compId == this.common.EMPLOYMENT_HRId)
      if (empData.length > 0) {
        this.submissionService
        .getEmpGapReasonDetail(this.qcDetails.screeningId, this.common.EMPLOYMENT_HRId)
        .subscribe((resp) => {
          if (resp) {
            this.compsData = resp;
            if (this.compsData.length > 1) {
              for (let j = 0; j <= (this.compsData.length - 1); j++) {
                const curDateDetail = this.compsData.filter(s => s.screeningCompId == this.compsData[j].screeningCompId);
                const empDateDetail = this.compsData.filter(s => s.screeningCompId != this.compsData[j].screeningCompId);
                let startdate: any;
                let enddate: any;
                let fromdate: any = curDateDetail[0].fromDate;
                let todate: any = curDateDetail[0].toDate;
                if ((fromdate !== null && fromdate !== undefined && fromdate !== 'NOT PROVIDED' && fromdate != '') || (todate !== null && todate !== undefined && todate !== 'NOT PROVIDED' && todate != '')) {
                  let compArr: any[] = [];
                  compArr = empDateDetail;
                  if (empDateDetail.length > 0) {
                    if (fromdate != '') {
                      startdate = this.common.convertDate(fromdate);
                    }

                    if (todate != '') {
                      enddate = this.common.convertDate(todate);
                    }

                    if (todate.toUpperCase().includes('TILL DATE')) {
                      let secondDate = new Date(new Date());
                    }
                    for (let i = 0; i <= (compArr.length - 1); i++) {

                      if (compArr[i] != null && compArr[i].toDate != null && compArr[i].toDate != "") {
                        if (compArr[i].toDate.toUpperCase().includes('TILL DATE')) {
                          var tlDate = new Date();

                        } else {
                          tlDate = null;
                        }
                        if (todate.toUpperCase().includes('TILL DATE')) {
                          var totlDate = new Date();

                        }
                        else {
                          totlDate = null;
                        }
                        if (compArr[i] != null && compArr[i].fromDate != null && compArr[i].toDate != null && compArr[i].fromDate != "" && compArr[i].toDate != "") {
                          var frompDate = new Date(fromdate);
                          var topDate = totlDate != null ? totlDate : new Date(todate);
                          var firstDate = new Date(compArr[i].fromDate);
                          var secondate = tlDate != null ? tlDate : new Date(compArr[i].toDate)

                          if ((frompDate >= firstDate && frompDate <= secondate) || (topDate >= firstDate && topDate <= secondate)) {
                            this.Message = "There is an overlap in the Employment period for this case, kindly check and proceed.";
                            this.openEmpDialog();
                            return false;

                          }
                          if (i == (empDateDetail.length - 1) && j == (this.compsData.length - 1)) {
                            if ((frompDate >= firstDate && frompDate <= secondate) || (topDate >= firstDate && topDate <= secondate)) {
                              this.Message = "There is an overlap in the Employment period for this case, kindly check and proceed.";
                              this.openEmpDialog();
                              return false;

                            } else {
                              this.openApprove();
                            }
                          }
                        } else if (i == (empDateDetail.length - 1) && j == (this.compsData.length - 1)) {
                          this.openApprove();
                        }

                      }
                    }

                  }
                } else if (j == (this.compsData.length - 1)) {
                  this.openApprove();
                }
              }
            } else {
              this.openApprove();
            }
          }
        });

      } else {
        this.openApprove();
      }

    } else if (this.qcDetails.finalQcFlag !== true) {
      if (this.qcDetails.compId === this.common.EMPLOYMENT_HRId) {
        this.submissionService
        .getEmpGapReasonDetail(this.qcDetails.screeningId, this.qcDetails.compId)
        .subscribe((resp) => {
          if (resp) {
            this.compsData = resp;
            const curDateDetail = this.compsData.filter(s => s.screeningCompId == this.qcDetails.screeningCompId);
            const empDateDetail = this.compsData.filter(s => s.screeningCompId != this.qcDetails.screeningCompId);
            let startdate: any;
            let enddate: any;
            let fromdate: any = curDateDetail[0].fromDate;
            let todate: any = curDateDetail[0].toDate;
            if ((fromdate !== 'NOT PROVIDED' && fromdate !== '' && fromdate !== null) || (todate !== 'NOT PROVIDED' && todate !== '' && todate !== null)) {
              let compArr: any[] = [];
              compArr = empDateDetail;
              if (empDateDetail.length > 0) {
                if (fromdate != '') {
                  startdate = this.common.convertDate(fromdate);
                }

                if (todate != '') {
                  enddate = this.common.convertDate(todate);
                }

                if (todate.toUpperCase().includes('TILL DATE')) {
                  let secondDate = new Date(new Date());
                }
                for (let i = 0; i <= (compArr.length - 1); i++) {

                  if (compArr[i].toDate != null && compArr[i].toDate != "") {
                    if (compArr[i].toDate.toUpperCase().includes('TILL DATE')) {
                      var tlDate = new Date();

                    }
                    else {
                      tlDate = null;
                    }
                    if (todate.toUpperCase().includes('TILL DATE')) {
                      var totlDate = new Date();

                    }
                    else {
                      totlDate = null;
                    }
                    if (compArr[i].fromDate != null && compArr[i].fromDate != "" && compArr[i].toDate != null && compArr[i].toDate != "") {
                      var frompDate = new Date(fromdate);
                      var topDate = totlDate != null ? totlDate : new Date(todate);
                      var firstDate = new Date(compArr[i].fromDate);
                      var secondate = tlDate != null ? tlDate : new Date(compArr[i].toDate)

                      if ((frompDate >= firstDate && frompDate <= secondate) || (topDate >= firstDate && topDate <= secondate)) {
                        this.Message = "Period of Employement for this Employement (HR) " + fromdate + " and " + todate + " is Overlapping with Previous Employement (HR) " + compArr[i].fromDate + " and " + compArr[i].toDate + "!";
                        this.openEmpDialog();
                        return false;

                      }
                      if (i == (empDateDetail.length - 1)) {
                        if ((frompDate >= firstDate && frompDate <= secondate) || (topDate >= firstDate && topDate <= secondate)) {
                          this.Message = "Period of Employement for this Employement (HR) " + fromdate + " and " + todate + " is Overlapping with Previous Employement (HR) " + compArr[i].fromDate + " and " + compArr[i].toDate + "!";
                          this.openEmpDialog();
                          return false;

                        }
                        else {
                          this.openApprove();
                        }
                      }
                    } else if (i == (empDateDetail.length - 1)) {
                      this.openApprove();

                    }

                  } else if (i == (empDateDetail.length - 1)) {
                    this.openApprove();

                  }

                }
              } else {
                this.openApprove();
              }
            } else {
              this.openApprove();
            }
          }
        });

      } else {
        this.openApprove();
      }
    }
  }

  */
  openApprove() {
    if (this.isReject === false) {
      if (this.qcApproveForm.get('remarks')?.valid) {
        this.JoiningDate = this.dateP.transform(this.qcDetails.joiningDate, 'yyyy-MM-dd');
        this.CloseDate = this.dateP.transform(this.qcDetails.closeDate, 'yyyy-MM-dd');;
        this.IscloseddateSelected = this.qcDetails.isClosedDateSelected;
        this.finalQcTransactionId = this.qcDetails.finalQcTransId;
        this.CTSFlag = this.qcDetails.ctsFlag;
        if (this.qcDetails.finalQcFlag === true && this.CTSFlag === true && this.JoiningDate != null && this.JoiningDate > this.CloseDate && this.IscloseddateSelected !== true) {
          this.dialogRef = this.dialog.open(this.alertPopUp, {
            width: '400px',
            disableClose: true
          });
          this.showWarning = true;
        }
        else if (this.qcDetails.finalQcFlag === true && this.verification.ReportTitleID === 0 && this.qcDetails.pdfReportChangeFlag) {
          this.dialogRef = this.dialog.open(this.pdfReportTitle, {
            width: '400px',
            disableClose: true
          });
        }
        else if (this.qcDetails.enablescenariobasedcolorcode && this.qcDetails.finalQcFlag === true && this.verification.isReportColorChanged === false && this.stopcolorCode === true
          && this.isColorCancelFlag === false) {
          this.dialogRef = this.dialog.open(this.changeColorCode, {
            width: '400px',
            disableClose: true
          });
        }
        //VTS2-2023-FR-0138 :- employment checks they want to change the color code based on the employer verification outcome.
        else if (this.qcDetails.editcolorcodeFRreportcompbasis == true && this.redcolorCloseFlag === false) {

          this.RedColorCodeChange();
          const screeningId = this.qcDetails.screeningId;
          this.quality.GetRedColorComponent(screeningId).subscribe(res => {
            this.redCompData = res;
            if (this.qcDetails.editcolorcodeFRreportcompbasis == true && this.redcolorCloseFlag === false && (this.redCompData.length !== 0 && this.redCompData !== undefined)) {
              this.dialogRef = this.dialog.open(this.RedColorcodeChangePopUp, {
                width: '650px',
                disableClose: true
              });
            }
            else {
              this.openPopup('Are you sure,Do you want to approve the case?');
            }
          })
        }
        else {
          this.openPopup('Are you sure,Do you want to approve the case?');
        }
      }
    }
  }
  dialogCloseAlert() {
    this.CTSFlag = false;
    this.dialogRef.close();
    this.finalQcTransactionId = 0;
    this.CloseDate = null;
    this.JoiningDate = null;
    this.UpdateClosedDate = null;
  }
  dialogPdfTilte() {
    this.dialogRef.close();
    this.ReportTitle = 0;
  }
  dialogColorCodeChange() {
    this.dialogRef.close();
    this.isColorCancelFlag = true;
  }
  submitCloseDate() {
    this.AssignCloseDateList = new AssignCloseDate();
    this.AssignCloseDateList.CloseDate = this.dateP.transform(this.UpdateClosedDate, 'yyyy-MM-dd');
    this.AssignCloseDateList.finalQcTranId = this.finalQcTransactionId;
    this.AssignCloseDateList.loggedIn = this.userData.userId;
    // if(this.AssignCloseDateList.CloseDate < this.JoiningDate){
    //    this.showTopCenter('warn', 'Failure Message', 'DOJ is greater than Closed date, Cannot Update.');
    //    this.UpdateClosedDate = null;
    // }
    // else{
    this.quality.UpdateClosedDate(this.AssignCloseDateList).subscribe(res => {
      if (res.success === true) {
        if (this.screeningId != 0)
          this.getFinalReprt(this.screeningId, this.screeningCompId, this.qcDetails.clientId, 'download');
        this.dialogCloseAlert();
        this.qcDetails.closeDate = this.UpdateClosedDate;
        this.dialogCloseAlert();
        this.qcDetails.isClosedDateSelected = true;
        this.showTopCenter('success', 'Success Message', 'The selected closed date has been updated in the report');
      }
    });
    //}
  }
  submitReportTitle() {
    this.verification.ReportTitleID = this.ReportTitle;
    const ReportTileName = this.ReportTypeList.filter(x => x.lookUpId === this.verification.ReportTitleID);//.map(m => m.lookUpName);
    this.verification.ReportTitle = ReportTileName[0].lookUpName;
    if (this.verification.ReportTitleID > 0) {
      //if(this.screeningId != 0)
      this.getFinalReprt(this.screeningId, this.screeningCompId, this.qcDetails.clientId, 'download');
      this.dialogRef.close();
      this.showTopCenter('success', 'Success Message', 'Report Title Changed Successfully');
    }
  }
  submitColorCode() {
    this.type = 'colorStop';
    this.verification.isReportColorChanged = true;
    if (this.verification.isReportColorChanged === true) {
      this.verification.GetColorCode(this.screeningId, this.screeningCompId).subscribe(res => {
        this.colorStatus = res;
      })
      if (this.ReportTitle != undefined) {
        this.verification.ReportTitleID = this.ReportTitle;
        const ReportTileName = this.ReportTypeList.filter(x => x.lookUpId === this.verification.ReportTitleID);
        this.verification.ReportTitle = ReportTileName[0].lookUpName;
      }
      this.getFinalReprt(this.screeningId, this.screeningCompId, this.qcDetails.clientId, 'download', this.type);
      this.dialogPdfTilte();
      this.showTopCenter('success', 'Success Message', 'Color Code Changed Successfully');
    }
  }
  openReject() {
    this.openPopup('Are you sure,Do you want to reject the case?');
  }
  openPopup(textBody: any) {
    this.getFinalReportFlag = false;
    const popupData = {
      action: this.common.DELETECONFIRMATION,
      headerText: 'Confirmation',
      bodyText: textBody
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
            if (textBody.includes('approve')) {
              if (this.qcDetails.finalQcFlag === true) {
                this.choosePackagePopup(); // choose package
                // } else {
                // if (this.verification.isFinalReport === true) {
                //   this.approveForm();
                // }
              } else {
                this.verification.suppReportType = '';
                if (this.enableAutoFqc == true && this.enableAutoIqc == false) {
                  this.getFinalReportFlag = true;
                }
                this.report();
                setTimeout(() => {
                  this.approveForm();
                }, 500);
              }
              //}
            } else if (textBody.includes('reject')) {
              this.rejectFunc();
            }
          }
        } else if (result === undefined) {
          if (textBody.includes('reject')) {
            this.qcReject.qcRejectComponent = [];
          }
        }
      });
    }
  }
  getCompList() {
    return this.packageInvoiceList.packageList.filter(x => x.packageId === this.packageIdCtrl.value)[0].packComp;
  }
  choosePackagePopup() {
    this.invoice.getInvoicePackageList(this.qcDetails.clientId, this.qcDetails.clientRefNo, this.qcDetails.screeningId).
      subscribe(res => {
        if (res) {
          this.packageInvoiceList = res[0];
          this.packageInvoiceList.screeningDetail.forEach(element => {
            element.qcApproveFlag = true;
            element.allotFlag = false;
          });
          if (res[0].packageList && res[0].packageList.length && res[0].packageList.length > 0) {
            this.dialogRef = this.dialog.open(this.choosePackage, {
              width: '1200px',
              disableClose: true
            });
          } else {
            this.approveForm();
          }
        }
      });
  }
  generateReport() {
    if (this.packageIdCtrl.value !== null) {
      if (this.packageIdCtrl.value > 0) {
        const individualList = this.packageInvoiceList.screeningDetail.filter(m => m.rptType === 'Individual');
        if (individualList.length > 1) {
          this.checkPackVm.compId = [];
          this.checkPackVm.subCompId = [];
          this.checkPackVm.packageId = this.packageIdCtrl.value;
          this.checkPackVm.screeningId = this.packageInvoiceList.screeningId;
          this.invoice.CheckCaseIndivdualCompMatchPackComp(this.checkPackVm
          ).subscribe(resp => {
            if (resp === true) {
              this.showTopCenter('success', 'Success Message', 'QC Approved and Report Generated Successfully');
              this.dialogRef.close();
              this.updatePackage();
              this.approveForm();
            } else {
              this.showTopCenter('warn', 'Information', 'Your Package & Individual Component does not match, please choose individual');
            }
          });
        } else {
          this.showTopCenter('warn', 'Information', 'Atleast One Individual Component have this Reference number');
        }
      } else {
        this.approveForm();
        this.dialogRef.close();
      }
    } else {
      this.packageIdCtrl.markAsTouched();
    }
  }
  updatePackage() {
    const compId = this.packageInvoiceList.screeningDetail.filter(m => m.rptType === 'Individual').map(m => m.screeningCompId);
    this.invoice.UpdateComponentFeeType({ screeningCompId: compId, loggedIn: this.userData.userId, packageId: this.packageIdCtrl.value }).subscribe(resp => {
      if (resp === true) {
        this.packageInvoiceList = [];
      }
    });
  }
  approveForm() {
    // this.approveQCForm(this.qcDetails);
    if (this.enableAutoFqc === true && this.enableAutoIqc === false) {
      this.approveQCForm(this.qcDetails);
    } else if (this.qcDetails.finalQcFlag === true) {
      this.approveQCForm(this.qcDetails);
      this.verification.copyDataForPwd.loggedIn = this.userData.userId;
      this.verification.QCApproveGeneratePdf(this.verification.copyDataForPwd).subscribe(res => {
        if (this.enableAutoFqc === false && this.enableAutoIqc === false) {
          this.showTopCenter('success', 'Success Message', res.message);
        }
        // if (res) {
        //   this.approveQCForm(res);
        // }
      });
    } else {
      this.approveQCForm(null);
    }
  }
  leave(i: any) {
    this.qcDetails.remarks = this.qcApproveForm.get('remarks')?.value;
    if (this.qcDetails.remarks !== "") {
      this.quality.QcApproveRemarks(this.qcApproveForm.value).subscribe(resp => {
        if (resp.success) {
          if (this.screeningId != 0)
            this.getFinalReprt(this.screeningId, this.screeningCompId, this.qcDetails.clientId, 'download');
        }
      });
    }
  }
  approveQCForm(data: any) {
    this.qcDetails.remarks = this.qcApproveForm.get('remarks')?.value;
    this.qcDetails.approvedFlag = true;
    this.qcApproveForm.patchValue(this.qcDetails);
    this.qcApproveForm.get('iQcByPassFlag')?.setValue(this.qcDetails.iqcByPassFlag);
    this.qcApproveForm.get('candidateName')?.setValue((this.qcDetails.firstName ? this.qcDetails.firstName : ' ')
      + " " + (this.qcDetails.middleName ? this.qcDetails.middleName : ' ') + " " +
      (this.qcDetails.lastName ? this.qcDetails.lastName : ' '));
    this.qcApproveForm.get('referenceNo')?.setValue(this.qcDetails.clientRefNo);
    this.qcApproveForm.get('loggedIn')?.setValue(this.userData.userId);
    this.qcApproveForm.get('document')?.setValue(data);
    this.quality.QcApprove(this.qcApproveForm.value).subscribe(resp => {
      if (resp.success) {
        // this.getFinalReprt(this.screeningId, this.screeningCompId, this.qcDetails.clientId);
        if (resp.message !== null) {
          this.showTopCenter('success', 'Success Message', resp.message);
        }
        this.verification.pdfvalue.fileName = '';
        this.verification.ReportTitleID = 0;
        this.verification.ReportTitle = '';
        this.verification.isReportColorChanged = false;
        //this.router.navigate(['/dashboard/qc/qualitycheck']);
        if (this.quality.qcOrFqc === 'FQC') {
          this.router.navigate(['dashboard/qc/FinalQcCheckDetail']);
        } else {
          this.router.navigate(['dashboard/qc/qualitycheck']);
        }
      }
    });
  }
  rejectForm() {
    if (this.isReject === true) {
      this.qcReject.finalQcFlag = this.qcDetails.finalQcFlag;
      this.qcReject.finalQcTransId = this.qcDetails.finalQcTransId;
      this.qcReject.screeningId = this.qcDetails.screeningId;
      this.qcReject.loggedIn = this.userData.userId;
      if (this.qcReject.finalQcFlag === false) {
        if (this.comment.value && this.errorType.value) {
          this.qcReject.qcRejectComponent.push(this.qcDetails);
          this.qcReject.qcRejectComponent.forEach(ele => {
            ele.remark = this.comment.value;
            ele.errorTypeLookUpId = this.errorType.value;
          });
          this.openReject();
        } else {
          this.comment.markAsTouched();
          this.errorType.markAsTouched();
          this.common.scrollToTop();
        }
      } else if (this.qcReject.finalQcFlag === true) {
        this.qcReject.qcRejectComponent = this.selectedCompList;
        if (this.qcReject.qcRejectComponent.length > 0) {
          // this.qcReject.qcRejectComponent.forEach(ele => {
          //   ele.errorTypeLookUpId = this.errorType.value;
          // });
          const errorType = this.qcReject.qcRejectComponent.some(x => x.errorTypeLookUpId === 0 || x.errorTypeLookUpId === null);
          const remark = this.qcReject.qcRejectComponent.some(x => x.remark === null || x.remark === '');
          if (remark && errorType) {
            this.showTopCenter('warn', 'Failure Message', 'Add Remarks for selected component and Select Error Type');
          } else if (errorType) {
            this.showTopCenter('warn', 'Failure Message', 'Please Select Error Type');
          } else {
            this.openReject();
          }
        } else {
          this.showTopCenter('warn', 'Failure Message', 'Select atleast one component');
        }
      }
    } else {
      this.comment.markAsUntouched();
      this.errorType.markAsUntouched();
      this.common.scrollToTop();
    }
  }
  rejectFunc() {
    this.quality.QcReject(this.qcReject).subscribe(resp => {
      if (resp.success) {
        this.showTopCenter('success', 'Success Message', 'Rejected Successfully');
        this.verification.pdfvalue.fileName = '';
        //this.router.navigate(['/dashboard/qc/qualitycheck']);
        if (this.quality.qcOrFqc === 'FQC') {
          this.router.navigate(['dashboard/qc/FinalQcCheckDetail']);
        } else {
          this.router.navigate(['dashboard/qc/qualitycheck']);
        }
      }
    });
  }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }
  backToTable() {
    this.quality.backFlag = true;

    this.verification.showsnp = false;
    if (this.quality.qcOrFqc === 'FQC') {
      this.router.navigate(['dashboard/qc/FinalQcCheckDetail']);
    } else {
      this.router.navigate(['dashboard/qc/qualitycheck']);
    }
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
  getTotalPages(totalRecords, rows) {
    this.totalpages = Math.ceil((totalRecords) / rows);
    return Math.ceil((totalRecords) / rows);
  }

  getFinalReprt(screeningId, screeningCompId, clientId, reportType, type?: any) {
    this.findEmpList = [];
    this.findCurrentEmpList = [];
    this.findPreviousEmpList = [];
    this.verification.reportType = reportType;
    this.findEmpList = [];
    this.findcurrentEmpList = [];
    this.findPreviousEmpList = [];
    this.verification.reportType = reportType;
    this.verification.GetResponseDocument(screeningId, screeningCompId, type).subscribe(res => {
      if (this.verification.isReportColorChanged === true)
        res.candidateDetail.colorCode = this.colorStatus;
      this.verification.finalReportvalue = res;
      this.getStopColorCode(this.verification.finalReportvalue);
      this.responseDatam = this.common.CloneObject(this.verification.finalReportvalue.summaryDetail)
      this.responseDatam.forEach(ele => {
        if (ele.compId === this.common.EMPLOYMENT_HRId) {
          this.findEmpList = ele.component[0].employeeApplicantDet;
        } else if (ele.compId === this.common.CURRENT_EMPLOYMENT_HRId) {
          this.findCurrentEmpList = ele.component[0].currentemployeeApplicantDet;
        } else if (ele.compId === this.common.PREVIOUS_EMPLOYMENT_HRId) {
          this.findPreviousEmpList = ele.component[0].previousemployeeApplicantDet;
        }
      })
      this.qcApproveForm.get('colorCode')?.setValue(res.candidateDetail.colorCode ? res.candidateDetail.colorCode : '');
      this.responseDatam.forEach(ele => {
        if (ele.compId == this.common.EMPLOYMENT_HRId) {
          this.findEmpList = ele.component[0].employeeApplicantDet;
        } else if (ele.compId == this.common.CURRENT_EMPLOYMENT_HRId) {
          this.findcurrentEmpList = ele.component[0].currentemployeeApplicantDet;
        } else if (ele.compId == this.common.PREVIOUS_EMPLOYMENT_HRId) {
          this.findPreviousEmpList = ele.component[0].previousemployeeApplicantDet;
        }
      })
      this.qcApproveForm.get('colorCode')?.setValue(res.candidateDetail.colorCode ? res.candidateDetail.colorCode : '');
      if (this.verification.isReportColorChanged === true)
        this.qcApproveForm.get('colorCode')?.setValue(this.colorStatus);
      this.verification.getClientReportHeaderFooter(clientId).
        subscribe(resp => {
          if (resp) {
            this.verification.clientLogoaddress = resp;
          }
        });
      this.verification.getOrganizationLogo(clientId).subscribe(resp => {
        if (resp) {
          this.verification.fileLogo = resp;
        }
        if (this.qcDetails.compId === this.common.EMPLOYMENT_HRId) {
          if (this.responseDatam[0].component[0].employeeApplicantDet.forResearchStatus ===
            this.common.suspicious) {
            this.isSuspicious = true;
          }

        } else if (this.qcDetails.compId === this.common.CURRENT_EMPLOYMENT_HRId) {
          if (this.responseDatam[0].component[0].currentemployeeApplicantDet.forResearchStatus ===
            this.common.suspicious) {
            this.isSuspicious = true;
          }

        }
        else if (this.qcDetails.compId === this.common.PREVIOUS_EMPLOYMENT_HRId) {
          if (this.responseDatam[0].component[0].previousemployeeApplicantDet.forResearchStatus ===
            this.common.suspicious) {
            this.isSuspicious = true;
          }

        }
      }, err => { }, () => {
        if (this.getFinalReportFlag === true) {
          this.verification.individualQc = 0;
          this.verification.isFinalReport = true;
          this.verification.reportType = 'download'; // download
          this.verification.dataBaseFlag = false;
          this.verification.ReportTitle = 'FinalReport';
          this.verification.isFinalQCConfig = false;
          this.verification.isBothConfig = true;
        } else {
          this.verification.isFinalReport = true;
          this.verification.isFinalQCConfig = true;
          this.verification.isBothConfig = false;
        }
      });
    }, err => {
    }, () => {
    });
  }
  ngOnDestroy(): void {
    this.verification.screeningId = 0;
    this.verification.isFinalReport = false;
    this.verification.fromQC = false;
    this.verification.copyDataForPwd = null;
  }
  openFQC() {
    this.dialogRef = this.dialog.open(this.FQC, {
      width: '900px',
      disableClose: true
    });
  }
  downloadDoc(method, id, fileName) {
    this.screen[method](id).subscribe(resp => {
      if (resp) {
        this.common.downloadDocument(0, resp.document, fileName);
        this.spinnerShows = false;
      }
    });

  }

  preview(method, id, fileName) {
    this.screen[method](id).subscribe(resp => {
      if (resp) {
        this.pdftool('reset');
        this.rotateimg('reset');
        this.downid = id;
        this.downname = fileName;
        this.downmethod = method;
        const ext = fileName.split('.').pop();
        if (ext === 'png' || ext === 'jpg' || ext === 'JPG' || ext === 'gif' || ext === 'jpeg' || ext === 'psd' || ext === 'bmp') {
          this.imageSource = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + resp.document);
          this.dialog.open(this.imgprDialog, {
            panelClass: 'myClass',
            disableClose: true
          });
        } else if (ext == 'pdf' || ext === 'PDF') {
          const blob = base64StringToBlob(resp.document, 'application/octet-stream');
          const csvUrl = window.URL.createObjectURL(blob);
          this.url = csvUrl;
          this.dialog.open(this.pdfDialog, {
            panelClass: 'myClass',
            disableClose: true
          });
        } else {
          this.downloadDoc(method, id, fileName);
        }
      }
    });
  }
  pdftool(type: any) {
    switch (type) {
      case 'right':
        this.rvalue += 90;
        break;
      case 'left':
        this.rvalue -= 90;
        break;
      case 'zoomin':
        this.zoomval += 0.1;
        break;
      case 'zoomout':
        this.zoomval -= 0.1;
        break;
      case 'reset':
        this.zoomval = 1;
        this.rvalue = 0;
        break;
      case 'download':
        this.downloadDoc(this.downmethod, this.downid, this.downname);
        break;
      default:
        break;

    }
  }
  zoomin() {

    var myImg = document.getElementById("imgpre");
    var currWidth = myImg.clientWidth;
    if (currWidth == 1500) return false;
    else {
      myImg.style.width = (currWidth + 100) + "px";
    }
  }

  zoomout() {
    var myImg = document.getElementById("imgpre");
    var currWidth = myImg.clientWidth;

    if (currWidth == 100) return false;
    else {
      myImg.style.width = (currWidth - 100) + "px";
    }
  }
  rotateimg(route: any) {
    this.dir = route;
    this.state = (this.state === 'default' ? 'rotated' : this.dir);
  }

}
export class CompNameVm {
  compName: string;
  subCompName: string;
  Document: any[];
}
export class QcRejectVm {
  screeningId: number;
  finalQcFlag: boolean;
  finalQcTransId: number;
  loggedIn: number;
  qcRejectComponent: QcRejectComponentVm[] = [];
}
export class QcRejectComponentVm {
  qcCompTransId: number;
  screeningCompId: number;
  verificationId: string;
  compName: string;
  subCompName: string;
  compId: number;
  remark: string;
  errorTypeLookUpId: number;
  compIndex: number;
  rejectFlag: boolean;
  rejectDate: Date;
  receivedDate: Date;
  approvedDate: Date;
  rejectClearedDate: Date;
  screeningOwnerFname: string;
  screeningOwnerMname: string;
  screeningOwnerLname: string;
  qcOwnerFname: string;
  qcOwnerMname: string;
  qcOwnerLname: string;
  comments: string;
  enteredBy: string;
  functionalEntity: string;
  enableAutoFQC: boolean;
  enableAutoIqc: boolean;
}
export class CheckPackVm {
  compId: any[] = [];
  subCompId: any[] = [];
  screeningId: number;
  packageId: number;
}