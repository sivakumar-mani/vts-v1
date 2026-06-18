import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ScreeningService } from '../../common-methods/services/screening.service';
import { SharedService } from '../../common-methods/services/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion, MatExpansionPanel } from '@angular/material/expansion';
import { CommonService } from '../../common-methods/services/common.service';
import { DashboardCountVm } from '../../common-methods/models/login';
import { VerificationService } from 'src/app/common-methods/services/verification.service';
import { QualityCheckService } from 'src/app/common-methods/services/quality-check.service';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { VerificationDetFilterVm, FilterVm } from 'src/app/common-methods/models/verification';
import { DatePipe } from '@angular/common';

@Component({
  standalone: false,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // insuffCountFlag = false;
  // caseFlag = false;
  // VeCountFlag = false;
  // qcCountFlag = false;
  showdbfilter = false;
  show_dialog = false;
  hideToggle;
  usermailId: string; lastLogIn: Date;
  submissionCount: any;
  subcheckCount = 0;
  dAsubcheckCount = 0;
  userData: any;
  preQcCases: any = 0;
  insufficiencyRaisedCount = 0;
  preQcReject: any = 0;
  caseCount: any;
  reverifyConcluded: any;
  scopeAssignedCount: any;
  scopeNotAssignedCount: any;
  scopeLOAApprovedCount: any;
  scopeLOAPendingCount: any;
  allcasecount = 0;
  caseHistorycount = 0;
  dashboardCountVm = new DashboardCountVm();
  dashBoardData = new dashBoardChart();
  // getPriorityVm: VerificationDetFilterVm = new VerificationDetFilterVm();
  // pendingDashBoardDetailVm: PendingDashBoardDetailVm = new PendingDashBoardDetailVm();
  mspPending: any;
  mspApproved: any;
  mspRejected: any;
  mspstatusApprove = 'Approved';
  mspstatusPending = 'Pending';
  mspstatusReject = 'Rejected';

  tatApproved = 0;
  tatPending = 0;
  clientAgreementApprovedCount = 0;
  clientAgreementPendingCount = 0;
  focCount = 0;
  tatRejected = 0;
  insuffClearCount = 0;
  notSendToQc = 0;
  pendingChecks = 0;
  normalChecks = 0;
  singlePendingChecks = 0;
  veReOpenCount = 0;
  reopenstatus = 4;
  verificationCaseCount = 0;
  verificationAssignedCaseCount = 0;
  forResearchPendingCount = 0;
  empInsClientSuspectCount = 0;
  empInsApprovalPendingCount = 0;
  empInsRejectedCount = 0;
  empInsUnderReviewCount = 0;
  verificationNotAssignedCaseCount = 0;
  getComponentQcRejectCount = 0;
  verificationInsuffRaisedCount = 0;
  verificationInsuffClearedCount = 0;
  getInsufficiencyCAMCount = 0;
  automationInsuffCount = 0;
  getClearCAMCount = 0;
  insuffAppPendingCount = 0;
  qcRejectCount = 0;
  notApplicableFlagCount = 0;
  closeCancelledInternallyFlagCount = 0;
  seventhdayReportCount = 0;
  submissionHistoryCount = 0;
  preQcSubmissionHistoryCount = 0;
  scopeHistoryCount = 0;
  mspApprovedCount = 0;
  mspPendingCount = 0;
  mspRejectedCount = 0;
  status = "";
  flag = false;
  priorityCount: any[];
  priorityLookup: { lookupId: number; langId: number; lookupName: string }[];
  categoryType: any;
  multiGraph: any[] = [];
  LinechartSizeview = [1024, 380];
  // options for the chart
  showAnnimation = true;
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Call Back Day';
  yAxisLabel = 'Number of CallBack';
  xAxisLabel1 = 'Status';
  yAxisLabel1 = 'Verification Count';
  xAxisLabelLine = 'BGV Companies';
  yAxisLabelLine = 'Sales';
  showYAxisLabel = true;

  timeline = true;
  //pie
  showLabels = true;

  // Chart Test

  @ViewChild('dashboardsearch', { static: true }) dashboardsearch!: MatExpansionPanel;
  loaApprovedCount: any;
  loaPendingCount = 0;
  loaRejectCount = 0;
  insuffDetails: any[] = [];
  verificationCaseCountList: any[] = [];
  raiseInsufficiencyScreeningDetails: any;
  individualQcCount: number;
  finalQcCount: number;
  iqcFinalCompCnt = 0;
  partialIQCCount = 0;
  callbackValue: KeyValPair[];
  callbackSumValue: number;
  callbackKey: any;
  pendingStatusValue: any[];
  pendingStatusSumValue: number;
  pendingStatusKey: any;
  priorityValue: KeyValPair[];
  prioritySumValue: number;
  packFeeApprovedCount: any;
  packFeeReviewCount: any;
  reOpneList: any[];
  othersList: any[];
  routePath = 'Home';
  getQcApprovedRejectedCount: any;
  getClientCommentCaseCount: any;
  screeningStatus: any;
  pendingStatusValueChart: KeyValPair[] = [];
  getComponentVERejectCount: any;
  getComponentFRRejectCount: any;
  dayWiseCount: any;
  dateRange: Date[] = [];
  maxDate = new Date();
  pDateRange: any[] = [1, new Date().getDate()];
  getVerificationCompletedCount = 0;
  bTpopupcount = 0;
  nTpopupcount = 0;
  cTpopupcount = 0;
  wTpopupcount = 0;
  stopCheckCount: any;
  currentEmpCnt = 0;
  redCaseCnt = 0;
  reAssignCaseCnt = 0;
  colors: any;
  // Added By Megala - For (sprint -22) VTS2-2024-CRT-0195
  camRejectionCnt = 0;
  closureAdviceCnt = 0;
  // verificationFilter: VerificationDetFilterVm = new VerificationDetFilterVm();
  subcheckVerificationCount = 0;
  subCheckQcCount = 0;
  toClose = 0;
  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  skipfirst: boolean;
  colorForStatus: { domain: any[]; };
  casePriorityLookup: { lookupId: number; langId: number; lookupName: string }[];
  // completedCassClient = 0;
  // pendingCassClient = 0;
  completedCasesClient = 0;
  pendingCasesClient = 0;
  submittedCasesClient = 0;
  closedCase = false;
  reOpenCount: any;
  directAppCaseHistoryCount = 0;
  levelOneInsuffRaiseCount = 0;
  levelOneInsuffClearCount = 0;
  TATCrossedInsuffCount = 0;

  levelTwoInsuffRaiseCount = 0;
  levelTwoInsuffClearCount = 0;
  reOpenChecksCount = 0;
  getOtherLoginFrCount: any;
  empforResearchPendingCount: 0;
  eduforResearchPendingCount: 0;
  empClientSuspectCount: 0;
  eduClientSuspectCount: 0;
  empUnderReviewCount: 0;
  eduUnderReviewCount: 0;
  empApprovalPendingCount: 0;
  eduApprovalPendingCount: 0;
  eduRejectedCount: 0;
  empRejectedCount: 0;
  empVerifiedCount: 0;
  eduVerifiedCount: 0;
  empInsResearchVerifiedCount = 0;
  LevelTwoTATCrossedInsuffCount: 0;
  getIndividualQcApprovedCount: any;
  getIndividualQcApprovedTodayCount: any;
  getIndividualQcRejectedCount: any;
  getFinalQcApprovedCount: any;
  getFinalQcApprovedTodayCount: any;
  getFinalQcRejectedCount: any;
  getFinalReportNotSentCount: any;

  constructor(private router: Router, private screeningService: ScreeningService, private qcService: QualityCheckService,
    public master: MasterService, private sharedService: SharedService, public common: CommonService,
    private verificationService: VerificationService, public datePipe: DatePipe, public dialog: MatDialog) { }

  ngOnInit() {
    // window.scroll(0, 0);
    this.sharedService.emitChengesecDrawer();
    this.screeningService.caseFlagType = '';
    this.screeningService.caseFlag = false;
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.usermailId = this.userData.emailId;
    this.lastLogIn = new Date(this.userData.lastLogIn);
    this.verificationService.closedCheck = false;
    this.verificationService.globalSearchFlag = false;
    if (this.common.insuffCountFlag === true) {
      this.getdashboardcnwise(true, false, false, false, false);
    } else if (this.common.VeCountFlag === true) {
      this.getdashboardcnwise(false, true, false, true, false);
    } else if (this.common.qcCountFlag === true) {
      this.getdashboardcnwise(false, false, true, false, false);
    } else if (this.common.caseFlag == true && this.userData.teamName !== 'AddressTeam' &&
      this.userData.teamName !== 'CriminalTeam' &&
      this.userData.teamName !== 'IdentityTeam' && this.userData.teamName !== 'CTS-AddressTeam' && this.userData.teamName !== 'CTS-IdentityTeam' && this.userData.teamName !== 'CTS-CriminalTeam') {
      this.getdashboardcnwise(false, false, false, true, false);
    }
    else {
      this.common.isDEFlag = (this.userData.teamName === 'DataEntry' || this.userData.teamName === 'CTS-SubmissionTeam')
      if (this.userData.teamName === 'AddressTeam' ||
        this.userData.teamName === 'CriminalTeam' ||
        this.userData.teamName === 'IdentityTeam' || this.userData.teamName === 'CTS-AddressTeam' || this.userData.teamName === 'CTS-IdentityTeam' || this.userData.teamName === 'CTS-CriminalTeam') {
        this.getdashboardcnwise(true, false, false, false, false);
      } else if (this.userData.teamName === 'InternationalQCTeam' || this.userData.teamName === 'QCTeam' || this.userData.teamName === 'CTS-QCTeam' || this.userData.teamName === 'TechMQCTeam') {
        this.getdashboardcnwise(false, false, true, false, false);
      } else {
        this.getdashboardcnwise(false, false, false, true, false);
      }
    }
    // this.verificationService.GetCaseDetailsClient(this.userData).subscribe(resp => {
    //   if (resp) {
    //     this.pendingCassClient = resp.clientVerificationDet.filter(x => !x.caseStatus).length;
    //     this.completedCassClient = resp.clientVerificationDet.filter(x => x.caseStatus && x.caseStatus.toLowerCase() === 'completed').length;
    //     this.verificationService.allCasesListForClient = resp;
    //   }
    // });
    // if (this.userData.team === 'Admin Team') {
    //   this.master.GetAllCaseDetails().subscribe(resp => {
    //     if (resp) {
    //     this.allcasecount = resp;
    //     }
    //   });
    // }
    // this.preQcCasesCount();
    // this.getRaiseInsufficiencyScreeningCount();
    // this.preQcRejectCount();
    // this.getInsuffClearCount();
    // this.getRaiseinsuff();
    this.clearfilterList();
  }
  
  public clearfilterList() {
    this.common.vendorDDList = [];
    this.common.clientDDList = [];
    this.common.statusDDList = [];
    this.common.priorityDDList = [];
    this.common.componentDDList = [];
    this.common.clientScreeningIdDDList = [];
    this.common.ScreeningOwnerDDList = [];
    this.common.candidateDDList = [];
  }
  pendingStatusCount() {
    // if (this.isVerification()) {
    this.screeningService.GetPendingStatusCount(this.userData.userId).subscribe(ins => {
      if (ins) {
        ins.forEach(ele => {
          if (this.screeningStatus) {
            this.screeningStatus.forEach(e => {
              if (e.screeningStatusId === ele.screeningStatusId && e.statusLookUpName === 'Insufficiency') {
                e.createUserId = e.createUserId + ele.count;
              }
            });
          }
        });
        this.filterData();
      }
    });
    // }
  }
  getDashboardData() {
    if (((((this.userData.teamName === 'CRTIndia' || this.userData.teamName === 'CRTTechMahindra' || this.userData.teamName === 'CRTAbroad')
      && (this.userData.subTeamName === 'CRTScopeCreation' || this.userData.subTeamName === null)) ||
      (this.userData.teamName === 'ManagingDirector' || this.userData.teamName === 'ApprovalManager'))) || this.userData.teamName === 'CTS-CRTTeam') {
      this.dashBoardData.header = 'Scope';
      let content: { value: number; name: string; method: string; param?; param1?; }[] =
        [{ value: this.scopeHistoryCount, name: 'Scope History', method: 'openScopeHistory' },
        { value: this.scopeNotAssignedCount, name: 'Scope Not Assigned', method: 'openCreatedScopes', param: 'NotAssigned' },
        { value: this.scopeAssignedCount, name: 'Scope Assigned', method: 'openCreatedScopes', param: 'Assigned' },
        { value: this.scopeLOAApprovedCount, name: ' Scope LOA Approved', method: 'openCreatedScopes', param: 'LOAApproved' },
        { value: this.scopeLOAPendingCount, name: 'Scope LOA Pending', method: 'openCreatedScopes', param: 'LOAPending' }];
      const teamLead = [{ value: this.caseCount, name: 'Case Creation', method: 'openCreatedCases' },
        // Added closureAdviceCnt - For (sprint -22) VTS2-2024-CRT-0195
        { value: this.closureAdviceCnt, name: 'Closure Advice Approval', method: 'openClosureAdvice' },
      { value: this.getInsufficiencyCAMCount, name: 'Insufficiency Pending', method: 'openinsuffRaiseCount' },
      { value: this.getClearCAMCount, name: 'Insufficiency Clearance', method: 'openinsuffClearCount' },
      { value: this.verificationCaseCount, name: 'Verification Checks', method: 'openVerificationCaseCount' }];
      if (this.userData.subTeamName === null) { this.dashBoardData.header = 'Case and Scope'; content.unshift(...teamLead); }
      if (this.userData.teamName === 'ManagingDirector' || this.userData.teamName === 'ApprovalManager') {
        this.dashBoardData.header = 'Approval & Pending';
        content = [{ value: this.mspApproved, name: 'MSP Approved', method: 'openMspcount', param: this.mspApproved, param1: null },
        { value: this.mspPending, name: 'MSP Pending', method: 'openMspcount', param: this.mspPending, param1: null },
        { value: this.mspRejected, name: 'MSP Reject', method: 'openMspcount', param: this.mspRejected, param1: null }];
        const am = [{ value: this.loaApprovedCount, name: 'LOA/BGV Approved', method: 'openCreatedLOA', param: this.loaApprovedCount, param1: 1 },
        { value: this.tatApproved, name: 'TAT Approved', method: 'openTatApprovedCount' },
        { value: this.tatPending, name: 'TAT Pending', method: 'openTatPendingCount' },
        { value: this.tatRejected, name: 'TAT Reject', method: 'openTatRejectCount' }];
        const md = [{ value: this.packFeeApprovedCount, name: 'Package Approved', method: 'openPackageApprovedcount' },
        { value: this.packFeeReviewCount, name: 'Package Pending', method: 'openPackagePendingcount' }];
        this.userData.teamName === 'ManagingDirector' ? content.push(...md) : content.push(...am);
      }
      this.dashBoardData.content = content;
    } else if (((this.userData.teamName === 'DataEntry' && (this.userData.subTeamName === 'DESubmission' ||
      this.userData.subTeamName === null))) || this.userData.teamName === 'CTS-SubmissionTeam') {
      this.dashBoardData.header = 'Case';
      const content: { value: number; name: string; method: string; }[] =
        [{ value: this.submissionCount, name: 'Open Cases', method: 'openCases' },
        { value: this.submissionCount, name: 'Sub Checks', method: 'openSubchecks' },
        { value: this.levelOneInsuffRaiseCount, name: 'Level 1 Insufficiency Raised', method: 'openraiseInsufficiency' },
        { value: this.preQcReject, name: 'Pre - QC Reject', method: 'openPreQCReject' },
        { value: this.levelOneInsuffClearCount, name: 'Level 1 Insufficiency Cleared', method: 'openinsuffClear' },
        { value: this.qcRejectCount, name: 'QC Reject', method: 'openQCRejectcases' },
        { value: this.notApplicableFlagCount, name: 'Cancelled', method: 'openNotApplicableCases' },
        { value: this.submissionHistoryCount, name: 'submission History', method: 'opensubmissionHistory' }];
      this.dashBoardData.content = content;
    } else if ((((this.userData.teamName === 'EmploymentIndia' ||
      this.userData.teamName === 'EducationTeam' ||
      this.userData.teamName === 'AddressTeam' ||
      this.userData.teamName === 'CriminalTeam' ||
      this.userData.teamName === 'IdentityTeam')) || this.userData.teamName === 'CTS-AddressTeam' || this.userData.teamName === 'CTS-EducationTeam' || this.userData.teamName === 'CTS-EmploymentTeam' || this.userData.teamName === 'CTS-IdentityTeam' || this.userData.teamName === 'CTS-CriminalTeam') &&
      this.userData.applicationId !== 2) {
      this.dashBoardData.header = 'Verification Case';
      const content: { value: number; name: string; method: string; }[] =
        [{ value: this.verificationCaseCount, name: 'Verification Checks', method: 'openVerificationCaseCount' },
        { value: this.getComponentQcRejectCount, name: 'QC Rejected Checks', method: 'openQcRejectedVerificationCount' },
        { value: this.levelTwoInsuffRaiseCount, name: 'Level 2 Insufficiency Raised', method: 'openVerificationInsuffRaisedCount' },
        { value: this.levelTwoInsuffClearCount, name: 'Level 2 Insufficiency Cleared', method: 'openVerificationInsuffClearedCount' },
        { value: this.closeCancelledInternallyFlagCount, name: 'Cancel', method: 'getClosedComponentDetails' },
        { value: this.seventhdayReportCount, name: '7th Day Tracker', method: 'getSeventhdayDetails' },
        ];
      this.dashBoardData.content = content;
      this.priorityLookup.forEach(element => {
        const val: { value: number; name: string; method: string; } = {
          value: element.langId,
          name: element.lookupName,
          method: ''
        };
        this.dashBoardData.content.push(val);
      });
      // this.priorityCount.forEach(element => {
      //   const val: { value: number; name: string; } = {
      //     value: element.value,
      //     name: element.name === 'normalCount' ? 'Normal' : element.name === 'highCount'
      //       ? 'Delta & High Priority' : element.name === 'verizonCount' ? 'Verizon Priority' : element.name === 'clientCmtdCasesCount'
      //         ? 'Client Cmtd Cases' : 'Response Pending'
      //   };
      //   this.dashBoardData.content.push(val);
      // });
    }
  }
  // @HostListener('document:click', ['$event'])
  // documentClick(event: MouseEvent) {
  //   if (this.dashboardsearch.expanded === true) {
  //     this.dashboardsearch.open();
  //     // this.dashboardsearch.expanded = false;
  //   } else {
  //     if (this.dashboardsearch.opened) {
  //       this.dashboardsearch.expanded = true;
  //     }
  //   }
  // }
  // @HostListener('document:click', ['$event'])
  // documentClick(event: MouseEvent) {
  //   if (this.flag === true) {
  //     this.dashboardsearch.close();
  //     this.flag = false;
  //   } else {
  //     if (this.dashboardsearch.expanded) {
  //       this.flag = true;
  //     }
  //   }
  // }
  // tslint:disable-next-line: whitespace
  openFinalQc() {
    if (this.finalQcCount > 0) {
      if (this.userData.teamLeadFlag === true || this.userData.subTeamName === 'CRTCAMTeam' || this.userData.subTeamName === 'SeniorExecutiveQC') {
        this.common.qcOrFqcFlag = false;

      }
      this.common.Fqc = 'FQ';
      this.sharedService.emitChengesecDrawer();
      this.router.navigate(['dashboard/qc/FinalQcCheckDetail']);
    }
  }
  openQCApprovedRejected(count, type) {
    if (count > 0) {
      this.qcService.approveOrRejectType = type;
      this.sharedService.emitChengesecDrawer();
      this.router.navigate(['dashboard/qc/qcApprovedRejected']);
    }
  }
  openIndividualQC() {
    if (this.individualQcCount > 0) {
      if (this.userData.teamLeadFlag === true || this.userData.subTeamName === 'CRTCAMTeam' || this.userData.subTeamLeadFlag === true || this.userData.subTeamName === 'SeniorExecutiveQC') {
        this.common.qcOrFqcFlag = true;
      }
      this.common.Fqc = '';
      this.sharedService.emitChengesecDrawer();
      this.router.navigate(['dashboard/qc/qualitycheck']);
    }
  }
  openFinalComponent(count: any) {
    if (count > 0) {
      this.common.qcOrFqcFlag = null;
      this.sharedService.emitChengesecDrawer();
      this.router.navigate(['dashboard/qc/qualitycheck']);
    }
  }
  openFqcFinalCasePending(count, type) {
    if (count > 0) {
      this.qcService.approveOrRejectType = type;
      this.sharedService.emitChengesecDrawer();
      this.router.navigate(['dashboard/qc/qcApprovedRejected']);
    }
  }
  openCases() {
    if (this.submissionCount > 0) {
      this.screeningService.caseFlag = true;
      this.sharedService.emitChengesecDrawer();
      this.router.navigate(['dashboard/screening/caselist']);
    }
  }
  openSubchecks() {
    if (this.subcheckCount > 0) {
      this.screeningService.caseFlag = false;
      this.screeningService.caseFlagType = this.common.SUBCHECK;
      this.sharedService.emitChengesecDrawer();
      this.router.navigate(['dashboard/screening/caselist']);
    }
  }
  openDASubchecks() {
    if (this.dAsubcheckCount > 0) {
      this.screeningService.caseFlag = false;
      this.screeningService.caseFlagType = this.common.DASUBCHECK;
      this.sharedService.emitChengesecDrawer();
      this.router.navigate(['dashboard/screening/caselist']);
    }
  }
  openSubCheckQC(count: any) {
    if (count > 0) {
      this.common.qcOrFqcFlag = null;
      this.common.commonQcFlag = 'subCheckQc';
      this.sharedService.emitChengesecDrawer();
      this.router.navigate(['dashboard/qc/qualitycheck']);
    }
  }
  openVerificationSubchecks(count: any) {
    if (count > 0) {
      this.common.redcaseFlag = false;
      this.common.reassigned = false;
      // Added camRejection - For (sprint -22) VTS2-2024-CRT-0195
      this.common.camRejection = false;
      this.common.commonVeFlag = 'subChecks';
      this.verificationService.veType = 'subChecks'
      this.sharedService.emitChengesecDrawer();
      this.router.navigate(['dashboard/verification/verification']);
    }
  }
  openQCRejectcases() {
    if (this.qcRejectCount > 0) {
      this.screeningService.caseFlag = false;
      this.screeningService.caseFlagType = this.common.QCREJECT;
      this.sharedService.emitChengesecDrawer();
      this.router.navigate(['dashboard/screening/caselist']);
    }
  }
  openVERejectcases() {
    if (this.getComponentVERejectCount > 0) {
      this.screeningService.caseFlag = false;
      this.screeningService.caseFlagType = this.common.VEREJECT;
      this.sharedService.emitChengesecDrawer();
      this.router.navigate(['dashboard/screening/caselist']);
    }
  }
  openFRRejectcases() {
    if (this.getComponentFRRejectCount > 0) {
      this.screeningService.caseFlag = false;
      this.screeningService.caseFlagType = this.common.FRREJECT;
      this.sharedService.emitChengesecDrawer();
      this.router.navigate(['dashboard/screening/caselist']);
    }
  }
  openReOpenChecks() {
    if (this.reOpenChecksCount > 0) {
      this.screeningService.caseFlag = false;
      this.screeningService.caseFlagType = this.common.REOPEN;

      this.sharedService.emitChengesecDrawer();
      this.router.navigate(['dashboard/screening/caselist']);
    }
  }
  openStopCheckcases() {
    this.screeningService.caseFlag = false;
    this.screeningService.caseFlagType = this.common.STOPCHECK;
    this.sharedService.emitChengesecDrawer();
    this.router.navigate(['dashboard/case/stopcheck']);
  }

  // dashboard count functionality - By Naveen - Start
  getAllDashboardCount(caseFlag, insuFlag, veFlag, qcFlag, caseHistoryFlag?: any) {
    if (this.userData.team === 'Admin Team' || this.userData.team === 'Super Admin Team'
      || (this.userData.teamName === null && this.userData.applicationId !== 2)) {
      if (caseFlag == true) {
        this.getSubmissionCount(true, false, false, false);
        this.getSubcheckCount(true, false, false, false);
        this.getPreQcReject(true, false, false, false);
        this.getDAsubcheckCount(true, false, false, false);
        this.getPreQcCases(true, false, false, false);
        this.getVERejectCount(true, false, false, false);
        this.getFRRejectCount(true, false, false, false);
        this.getReOpenChecksCount(true, false, false, false);
        this.eduForResearchPending(true, false, false, false);
        this.eduClientSuspect(true, false, false, false);
        this.eduFRUnderReview(true, false, false, false);
        this.eduFRApprovalPending(true, false, false, false);
        this.eduFRReject(true, false, false, false);
        this.eduFRVerified(true, false, false, false);
        this.empForResearchPending(true, false, false, false);
        this.empClientSuspect(true, false, false, false);
        this.empFRUnderReview(true, false, false, false);
        this.empFRApprovalPending(true, false, false, false);
        this.empFRReject(true, false, false, false);
        this.empFRVerified(true, false, false, false);
        this.getNotApplicableFlagCount(true, false, false, false);
        // Added By Megala - For (sprint -22) VTS2-2024-CRT-0195
        this.GetClosureAdviceCount(true, false, false, false);        
        this.GetSixMonthEmployerDetailsCount(true, false, false, false);
        this.getCaseCreationCount(true, false, false, false);
        // this.getOtherLoginFRCount(true, false, false, false);
        this.empForResearchPending(true, false, false, false);
        this.empClientSuspect(true, false, false, false);
        this.empFRUnderReview(true, false, false, false);
        this.empFRApprovalPending(true, false, false, false);
        this.empFRReject(true, false, false, false);
        this.eduForResearchPending(true, false, false, false);
        this.eduClientSuspect(true, false, false, false);
        this.eduFRApprovalPending(true, false, false, false);
        this.eduFRReject(true, false, false, false);
        this.getScopeCreationNotAssignedCount(true, false, false, false);
        this.getScopeCreationAssignedCount(true, false, false, false);
        this.getScopeCreationLoaApprovedCount(true, false, false, false);
        this.getScopeCreationLoaPendingCount(true, false, false, false);
        this.getLoaRejectedCount(true, false, false, false);
        this.getScopeHistoryCount(true, false, false, false);
        this.getMSPRateApprovalCount(true, false, false, false);
        this.getMSPRatePendingCount(true, false, false, false);
        this.getMSPRateRejectedCount(true, false, false, false);
        this.GetFOCCount(true, false, false, false);
        this.getTATApprovalCount(true, false, false, false);
        this.getTATPendingCount(true, false, false, false);
        this.getTATRejectedCount(true, false, false, false);
        this.getLoaApprovedCount(true, false, false, false);
        this.getLoaPendingCount(true, false, false, false);
        this.getClientAgreementPendingCount(true, false, false, false);
        this.getClientAgreementApprovedCount(true, false, false, false);
        this.getNotApplicableFlagCount(true, false, false, false);
        this.getSubmissionHistoryCount(true, false, false, false);
        this.getPreQcSubmHisCount(true, false, false, false);
        this.getCaseHistorycount(true, false, false, false);
        this.GetStopCheckCount(true, false, false, false);
        this.GetDirectAppCaseHistoryCount(true, false, false, false);
      }
      else if (caseHistoryFlag == true) {
        this.getNotApplicableFlagCount(true, false, false, false);
        this.getSubmissionHistoryCount(true, false, false, false);
        this.getPreQcSubmHisCount(true, false, false, false);
        this.getCaseHistorycount(true, false, false, false);
      }
      else if (insuFlag == true) {
        this.getInsuffCAMCount(false, true, false, false);
        this.getinsuffAppPendingCount(false, true, false, false);
        this.getAutomationInsuffCount(false, true, false, false);
        this.getClearanceCAMCount(false, true, false, false);
        this.getL1RaiseInsuffCount(false, true, false, false);
        this.getL1ClearInsuffCount(false, true, false, false);
        this.getL1TATCrossedCount(false, true, false, false);
        this.getL2RaiseInsuffCount(false, true, false, false);
        this.getL2ClearInsuffCount(false, true, false, false);
        this.getL2TATCrossedCount(false, true, false, false);
      }
      else if (veFlag == true) {
         // Added GetCAMRejectionCount - For (sprint -22) VTS2-2024-CRT-0195
        this.GetCAMRejectionCount(false,false,true,false);
        this.getAssignNotAssignCount(false, false, true, false);
        this.Getpriority(false, false, true, false);
        this.GetReAssignedCheckCount(false, false, true, false);
        this.getClosedCheckcount(false, false, true, false);
        this.GetCurrentEmploymentCount(false, false, true, false);
        this.CloseCancelledInternallyFlag(false, false, true, false);
        this.GetPendingchecks(false, false, true, false);
        this.GetSinglePendingchecks(false, false, true, false);
        this.GetReopencountchecks(false, false, true, false);
        this.GetBTPopupCnt(false, false, true, false);
        this.GetCTPopupCnt(false, false, true, false);
        this.GetNTPopupCnt(false, false, true, false);
        this.GetWTPopupCnt(false, false, true, false);
        this.GetNormalCount(false, false, true, false);
        this.GetRedcaseApprovalCount(false, false, true, false);
        this.GetClientCommentCaseCount(false, false, true, false);
      }
      else if (qcFlag == true) {
        this.GetComponentQcCount(false, false, false, true);
        this.GetFinalQcCount(false, false, false, true);
        //this.GetQcApprovedRejectedCount(false, false, false, true);
        this.GetIQCFinalCompCnt(false, false, false, true);
        this.GetDERejectCount(false, false, false, true);
        this.GetQCRejectCount(false, false, false, true);
        this.GetIndividualQcApprovedCountAsync(false, false, false, true);
        this.GetIndividualQcApprovedTodayCountAsync(false, false, false, true);
        this.GetIndividualQcRejectedCountAsync(false, false, false, true);
        this.GetFinalQcApprovedCountAsync(false, false, false, true);
        this.GetFinalQcApprovedTodayCountAsync(false, false, false, true);
        this.GetFinalQcRejectedCountAsync(false, false, false, true);
        this.GetFinalReportNotSentCountAsync(false, false, false, true);
      } else {
        this.getDashboardCount(caseFlag, insuFlag, veFlag, qcFlag);
      }
      this.getDashboardData();
      if (this.isGraph()) {
        this.getGraph(0, 'GetColorCodeWiseClosedCount');
      }
    }
    else if (this.userData.teamName == this.verificationService.DataEntry || this.userData.teamName === this.verificationService.InternationalDataEntry || this.userData.teamName === this.verificationService.TechMDataEntry || this.userData.teamName == this.verificationService.DEPreQC || this.userData.teamName == this.verificationService.CTSSubmissionTeam) {
      if (caseFlag == true) {
        //VTS2-2023-DE-0107 - Ajith :-The new department for DE Pre-QC should allow users to configured in both DE and DE Pre-QC departments
        if (this.userData.teamName == this.verificationService.DataEntry || this.userData.teamName == this.verificationService.CTSSubmissionTeam || this.userData.teamName === this.verificationService.InternationalDataEntry || this.userData.teamName === this.verificationService.TechMDataEntry) {
          this.getSubmissionCount(true, false, false, false);
          this.getSubcheckCount(true, false, false, false);
          this.getPreQcReject(true, false, false, false);
        }
        this.getDAsubcheckCount(true, false, false, false);
        this.getPreQcCases(true, false, false, false);
        this.getVERejectCount(true, false, false, false);
        this.getFRRejectCount(true, false, false, false);
        this.getReOpenChecksCount(true, false, false, false);
      } else if (caseHistoryFlag == true) {
        this.getNotApplicableFlagCount(true, false, false, false);
        this.getSubmissionHistoryCount(true, false, false, false);
        this.getPreQcSubmHisCount(true, false, false, false);
        this.getCaseHistorycount(true, false, false, false);
      } else if (insuFlag == true) {
        this.getL1RaiseInsuffCount(false, true, false, false);
        this.getL1ClearInsuffCount(false, true, false, false);
        this.getL1TATCrossedCount(false, true, false, false);
      } else if (qcFlag == true) {
        this.GetDERejectCount(false, false, false, true);
      } else {
        this.getDashboardCount(caseFlag, insuFlag, veFlag, qcFlag);
      }
    } else if (this.userData.teamName == this.verificationService.CrtIndia ||
      this.userData.teamName == this.verificationService.CrtTechM ||
      this.userData.teamName == this.verificationService.CTSCRTTeam ||
      this.userData.teamName == this.verificationService.CRTAbroad) {
      if (insuFlag == true) {
        this.getInsuffCAMCount(false, true, false, false);
        this.getinsuffAppPendingCount(false, true, false, false);
        this.getAutomationInsuffCount(false, true, false, false);
        this.getClearanceCAMCount(false, true, false, false);
      } else
       if (caseFlag == true && this.userData.teamName == this.verificationService.CRTAbroad) { 
        // Added GetClosureAdviceCount - For (sprint -22) VTS2-2024-CRT-0195
        this.GetClosureAdviceCount(true, false, false, false);                  
        this.getCaseCreationCount(true, false, false, false);     
        this.getSubmissionHistoryCount(true, false, false, false);
        this.getNotApplicableFlagCount(true, false, false, false);
        this.getCaseHistorycount(true, false, false, false);
        this.GetStopCheckCount(true, false, false, false);
      } else if (caseFlag == true) {
        // Added GetClosureAdviceCount - For (sprint -22) VTS2-2024-CRT-0195
        this.GetClosureAdviceCount(true, false, false, false);        
        this.getCaseCreationCount(true, false, false, false);        
        this.getSubmissionHistoryCount(true, false, false, false);
        // this.getOtherLoginFRCount(true, false, false, false);
        this.empForResearchPending(true, false, false, false);
        this.empClientSuspect(true, false, false, false);
        this.empFRUnderReview(true, false, false, false);
        this.empFRApprovalPending(true, false, false, false);
        this.empFRReject(true, false, false, false);
        this.eduForResearchPending(true, false, false, false);
        this.eduClientSuspect(true, false, false, false);
        this.eduFRApprovalPending(true, false, false, false);
        this.eduFRReject(true, false, false, false);
        this.getScopeCreationNotAssignedCount(true, false, false, false);
        this.getScopeCreationAssignedCount(true, false, false, false);
        this.getScopeCreationLoaApprovedCount(true, false, false, false);
        this.getScopeCreationLoaPendingCount(true, false, false, false);
        this.getScopeHistoryCount(true, false, false, false);
        this.getLoaApprovedCount(true, false, false, false);
        this.getLoaPendingCount(true, false, false, false);
        this.getClientAgreementPendingCount(true, false, false, false);
        this.getClientAgreementApprovedCount(true, false, false, false);
        this.getNotApplicableFlagCount(true, false, false, false);
        this.getCaseHistorycount(true, false, false, false);
        this.GetStopCheckCount(true, false, false, false);
        this.GetDirectAppCaseHistoryCount(true, false, false, false);
      } else if (veFlag == true) {
         // Added GetCAMRejectionCount - For (sprint -22) VTS2-2024-CRT-0195
        this.GetCAMRejectionCount(false,false,true,false);
        this.getAssignNotAssignCount(false, false, true, false);
        this.Getpriority(false, false, true, false);
        this.GetReAssignedCheckCount(false, false, true, false);
        this.getClosedCheckcount(false, false, true, false);
        this.GetCurrentEmploymentCount(false, false, true, false);
        this.CloseCancelledInternallyFlag(false, false, true, false);
        this.GetPendingchecks(false, false, true, false);
        this.GetSinglePendingchecks(false, false, true, false);
        this.GetReopencountchecks(false, false, true, false);
        this.GetBTPopupCnt(false, false, true, false);
        this.GetCTPopupCnt(false, false, true, false);
        this.GetNTPopupCnt(false, false, true, false);
        this.GetWTPopupCnt(false, false, true, false);
        this.GetNormalCount(false, false, true, false);
        // this.GetRedcaseApprovalCount(false, false, true, false);
        this.GetClientCommentCaseCount(false, false, true, false);
      } else if (qcFlag == true) {
        this.GetComponentQcCount(false, false, false, true);
        this.GetFinalQcCount(false, false, false, true);
        this.getSubcheckCount(true, false, false, false);
        //this.GetQcApprovedRejectedCount(false, false, false, true);
        this.GetIQCFinalCompCnt(false, false, false, true);
        this.GetDERejectCount(false, false, false, true);
        this.GetQCRejectCount(false, false, false, true);
        this.GetIndividualQcApprovedCountAsync(false, false, false, true);
        this.GetIndividualQcApprovedTodayCountAsync(false, false, false, true);
        this.GetIndividualQcRejectedCountAsync(false, false, false, true);
        this.GetFinalQcApprovedCountAsync(false, false, false, true);
        this.GetFinalQcApprovedTodayCountAsync(false, false, false, true);
        this.GetFinalQcRejectedCountAsync(false, false, false, true);
        this.GetFinalReportNotSentCountAsync(false, false, false, true);
      } else {
        this.getDashboardCount(caseFlag, insuFlag, veFlag, qcFlag);
      }
    } else if (this.userData.teamName == this.verificationService.EmploymentIndia || this.userData.teamName == this.verificationService.ForResearchEducationTeam ||
      this.userData.teamName == this.verificationService.ForResearchEmploymentTeam || this.userData.teamName == this.verificationService.EducationTeam ||
      this.userData.teamName == this.verificationService.CriminalTeam || this.userData.teamName == this.verificationService.AddressTeam ||
      this.userData.teamName == this.verificationService.IdentityTeam || this.userData.teamName == this.verificationService.EmploymentAbroad ||
      this.userData.teamName == this.verificationService.EmploymentTechM || this.userData.teamName == this.verificationService.EducationOverseas ||
      this.userData.teamName == this.verificationService.CTSEducationTeam || this.userData.teamName == this.verificationService.CTSEmploymentTeam ||
      this.userData.teamName == this.verificationService.CTSAddressTeam || this.userData.teamName == this.verificationService.CTSCriminalTeam ||
      this.userData.teamName == this.verificationService.CTSIdentityTeam) {
      if (caseFlag == true) {
        if (this.userData.teamName == this.verificationService.EducationTeam || this.userData.teamName == this.verificationService.CTSEducationTeam || this.userData.teamName == this.verificationService.ForResearchEducationTeam) {
          this.eduForResearchPending(true, false, false, false);
          this.eduClientSuspect(true, false, false, false);
          this.eduFRUnderReview(true, false, false, false);
          this.eduFRApprovalPending(true, false, false, false);
          this.eduFRReject(true, false, false, false);
          this.eduFRVerified(true, false, false, false);
        } else if (this.userData.teamName == this.verificationService.EmploymentIndia || this.userData.teamName == this.verificationService.CTSEmploymentTeam || this.userData.teamName == this.verificationService.ForResearchEmploymentTeam) {
          this.empForResearchPending(true, false, false, false);
          this.empClientSuspect(true, false, false, false);
          this.empFRUnderReview(true, false, false, false);
          this.empFRApprovalPending(true, false, false, false);
          this.empFRReject(true, false, false, false);
          this.empFRVerified(true, false, false, false);
        }
        // this.getOtherLoginFRCount(true, false, false, false);
        this.getNotApplicableFlagCount(true, false, false, false);
        this.GetSixMonthEmployerDetailsCount(true, false, false, false);
      } else if (veFlag == true) {
        // for graph by naveen start
        this.getScreeningStatus();
        this.getverificationCaseCount();
        // for graph by naveen end 
        if (this.userData.applicationId === 2) {
          this.getAssignNotAssignCount(false, false, true, false);
          this.PendingComponentCount(false, false, true, false);
          this.Getpriority(false, false, true, false);
        } else {
          this.getAssignNotAssignCount(false, false, true, false);
          this.Getpriority(false, false, true, false);
          // Added By Megala - For (sprint -22) VTS2-2024-CRT-0195
          this.GetCAMRejectionCount(false,false,true,false);
          this.GetReAssignedCheckCount(false, false, true, false);
          this.getClosedCheckcount(false, false, true, false);
          this.GetCurrentEmploymentCount(false, false, true, false);
          this.CloseCancelledInternallyFlag(false, false, true, false);
          this.GetPendingchecks(false, false, true, false);
          this.GetSinglePendingchecks(false, false, true, false);
          this.GetReopencountchecks(false, false, true, false);
          this.GetBTPopupCnt(false, false, true, false);
          this.GetCTPopupCnt(false, false, true, false);
          this.GetNTPopupCnt(false, false, true, false);
          this.GetWTPopupCnt(false, false, true, false);
          this.GetNormalCount(false, false, true, false);
          this.GetRedcaseApprovalCount(false, false, true, false);
          this.GetClientCommentCaseCount(false, false, true, false);
        }
        // for graph by naveen start
        if (this.isVeReopenChecks() || this.getQuickLinkCondition()) {
          this.pendingStatusCount();
        }
        // for graph by naveen end
      } else if (insuFlag == true) {
        this.getL2RaiseInsuffCount(false, true, false, false);
        this.getL2ClearInsuffCount(false, true, false, false);
        this.getL2TATCrossedCount(false, true, false, false);
      } else if (qcFlag == true) {
        this.GetQCRejectCount(false, false, false, true);
      } else {
        this.getDashboardCount(caseFlag, insuFlag, veFlag, qcFlag);
      }
    } else if (qcFlag == true) {
      this.GetComponentQcCount(false, false, false, true);
      this.GetQcSubCheckCount(false, false, false, true);
      this.GetFinalQcCount(false, false, false, true);
      //this.GetQcApprovedRejectedCount(false, false, false, true);
      this.GetIQCFinalCompCnt(false, false, false, true);
      // this.GetDERejectCount(false, false, false, true);
      // this.GetQCRejectCount(false, false, false, true);
      this.GetIndividualQcApprovedCountAsync(false, false, false, true);
      this.GetIndividualQcApprovedTodayCountAsync(false, false, false, true);
      this.GetIndividualQcRejectedCountAsync(false, false, false, true);
      this.GetFinalQcApprovedCountAsync(false, false, false, true);
      this.GetFinalQcApprovedTodayCountAsync(false, false, false, true);
      this.GetFinalQcRejectedCountAsync(false, false, false, true);
      this.GetFinalReportNotSentCountAsync(false, false, false, true);
    } else {
      this.getDashboardCount(caseFlag, insuFlag, veFlag, qcFlag);
    }
  }

  getScreeningStatus() {
    this.screeningStatus = [];
    this.screeningService.getScreeningStatus().subscribe(res => {
      if (res) {
        if (res) {
          res.forEach(el => {
            el.createUserId = 0;
          });
        }
        this.screeningStatus = res;
      }
    })
  }
  getverificationCaseCount() {
    this.verificationCaseCountList = [];
    this.dashboardCountVmData(false, false, true, false);
    this.screeningService.getverificationCaseCount(this.dashboardCountVm).subscribe(res => {
      if (res) {
        this.verificationCaseCountList = res;
        if (this.verificationCaseCountList) {
          this.verificationCaseCountList.forEach(element => {
            if (this.userData.applicationId === 2) {
              if (this.casePriorityLookup) {
                this.casePriorityLookup.forEach(ele => {
                  if (ele.lookupId === element.casePriorityLookupId) {
                    ele.langId = ele.langId + element.count;
                  }
                });
              }
            }
            else {
              if (this.priorityLookup) {
                this.priorityLookup.forEach(ele => {
                  if (ele.lookupId === element.priorityLookupId) {
                    ele.langId = ele.langId + element.count;
                  }
                });
              }
            }
            if (this.casePriorityLookup) {
              this.casePriorityLookup.forEach(ele => {
                if (ele.lookupId === element.casePriorityLookupId) {
                  ele.langId = ele.langId + element.count;
                }
              });
            }
            if (this.screeningStatus) {
              this.screeningStatus.forEach(elem => {
                if (elem.screeningStatusId === element.screeningStatusId) {
                  if (!(elem.statusLookUpName === 'Insufficiency')) {
                    elem.createUserId = elem.createUserId + element.count;
                  }
                }
              });
            }
          });
        }
      }
    })
  }

  dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVm.applicationId = this.userData.applicationId;
    this.dashboardCountVm.userId = this.userData.userId;
    this.dashboardCountVm.deptId = this.userData.deptId;
    this.dashboardCountVm.DeptName = this.userData.DeptName;
    this.dashboardCountVm.teamName = (this.userData.team === 'Admin Team' || this.userData.team === 'Super Admin Team') ? this.userData.team : this.userData.teamName;
    this.dashboardCountVm.teamId = this.userData.teamId;
    this.dashboardCountVm.subTeamId = this.userData.subTeamId;
    this.dashboardCountVm.subTeamName = this.userData.subTeamName;
    this.dashboardCountVm.clientId = this.userData.clientId;
    this.dashboardCountVm.teamLeadFlag = this.userData.teamLeadFlag;
    this.dashboardCountVm.subTeamLeadFlag = this.userData.subTeamLeadFlag;
    this.dashboardCountVm.workFlowLookupId = this.userData.workFlowLookupId;
    this.dashboardCountVm.siteId = this.userData.siteId;
    this.dashboardCountVm.caseCreationFlag = caseFlag;
    this.dashboardCountVm.verificationFlag = veFlag;
    this.dashboardCountVm.qcFlag = qcFlag;
    this.dashboardCountVm.insufficiencyFlag = insuFlag;
    this.dashboardCountVm.team = this.userData.team;
    this.dashboardCountVm.adminFlag = (this.userData.team === 'Admin Team' || this.userData.team === 'Super Admin Team' || this.userData.teamName === null) ? true : false;
  }
  // VE Count Start

  public getAssignNotAssignCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.dashboardCountVm.veCaseFlag = true;
    this.screeningService.getAssignNotAssign(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        if (resp) {
          this.verificationCaseCnt = resp;
          resp.forEach(ve => {
            if (ve.screeningOwnerId > 0) {
              this.verificationAssignedCaseCount = this.verificationAssignedCaseCount + ve.count;
            } else {
              this.verificationNotAssignedCaseCount = this.verificationNotAssignedCaseCount + ve.count;
            }
            if (ve.subCheckFlag === true) {
              this.subcheckVerificationCount = this.subcheckVerificationCount + ve.count;
            }
          });
        }
      }
    })
  }
  //Added by megala SRS - (sprint -22) VTS2-2024-CRT-0195 
  public GetCAMRejectionCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.GetCamRejetionCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.camRejectionCnt = resp;
      }
    })
  }
  public GetClosureAdviceCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.GetClosureAdviceCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.closureAdviceCnt = resp;
      }
    })
  }
    //ended by megala SRS -  (sprint -22) VTS2-2024-CRT-0195 

  public GetReAssignedCheckCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.GetReAssignedCheckCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.reAssignCaseCnt = resp;
      }
    })
  }
  public getClosedCheckcount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.getClosedCheckcount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.getVerificationCompletedCount = resp;
      }
    })
  }
  public GetCurrentEmploymentCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.GetCurrentEmploymentCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.currentEmpCnt = resp;
      }
    })
  }
  public CloseCancelledInternallyFlag(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.CloseCancelledInternallyFlagCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.closeCancelledInternallyFlagCount = resp;
      }
    })
  }
  public GetPendingchecks(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.GetPendingchecks(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.pendingChecks = resp;
      }
    })
  }
  public PendingComponentCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.PendingComponentCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.pendingChecks = resp;
      }
    })
  }
  public GetClientCommentCaseCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.GetClientCommentCaseCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.getClientCommentCaseCount = resp;
      }
    })
  }
  public GetSinglePendingchecks(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.GetSinglePendingchecks(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.singlePendingChecks = resp;
      }
    })
  }
  public GetReopencountchecks(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.GetReopencountchecks(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.veReOpenCount = resp;
      }
    })
  }
  public GetBTPopupCnt(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.GetBTCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.bTpopupcount = resp;
      }
    })
  }
  public GetCTPopupCnt(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.GetCTCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.cTpopupcount = resp;
      }
    })
  }
  public GetNTPopupCnt(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.GetNTCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.nTpopupcount = resp;
      }
    })
  }
  public GetWTPopupCnt(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.GetWTCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.wTpopupcount = resp;
      }
    })
  }
  public GetNormalCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.GetNormalCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.normalChecks = resp;
      }
    })
  }
  public GetRedcaseApprovalCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.GetRedcaseApproval(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.redCaseCnt = resp;
      }
    })
  }
  // Start QC bashboard individual count
  public GetComponentQcCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.GetComponentQcCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.individualQcCount = resp;
      }
    })
  }
  public GetQcSubCheckCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.GetQcSubCheckCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.subCheckQcCount = resp;
      }
    })
  }
  public GetFinalQcCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.GetFinalQcCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.finalQcCount = resp;
      }
    })
  }
  public GetQcApprovedRejectedCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.GetQcApprovedRejectedCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.getQcApprovedRejectedCount = resp;
      }
    })
  }
  public GetIQCFinalCompCnt(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.GetIQCFinalCompCnt(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.iqcFinalCompCnt = resp;
      }
    })
  }
  public GetComponentQcRejectCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.GetComponentQcRejectCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.qcRejectCount = resp;
      }
    })
  }
  public GetDERejectCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.GetDERejectCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.qcRejectCount = resp;
      }
    })
  }
  public GetQCRejectCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.GetQCRejectCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.getComponentQcRejectCount = resp;
      }
    })
  }
public GetIndividualQcApprovedCountAsync(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.GetIndividualQcApprovedCountAsync(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.getIndividualQcApprovedCount = resp;
      }
    })
  }
  public GetIndividualQcApprovedTodayCountAsync(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.GetIndividualQcApprovedTodayCountAsync(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.getIndividualQcApprovedTodayCount = resp;
      }
    })
  }
  public GetIndividualQcRejectedCountAsync(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.GetIndividualQcRejectedCountAsync(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.getIndividualQcRejectedCount = resp;
      }
    })
  }
  public GetFinalQcApprovedCountAsync(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.GetFinalQcApprovedCountAsync(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.getFinalQcApprovedCount = resp;
      }
    })
  }
  public GetFinalQcApprovedTodayCountAsync(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.GetFinalQcApprovedTodayCountAsync(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.getFinalQcApprovedTodayCount = resp;
      }
    })
  }
  public GetFinalQcRejectedCountAsync(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.GetFinalQcRejectedCountAsync(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.getFinalQcRejectedCount = resp;
      }
    })
  }
  public GetFinalReportNotSentCountAsync(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.GetFinalReportNotSentCountAsync(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.getFinalReportNotSentCount = resp;
      }
    })
  }
  //  end of the QC dash board counts

  // Start CRT Dashboard count methods
  public getCaseCreationCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.dashboardCountVm.caseHistoryFlag = false;
    this.screeningService.getCaseCreationCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.caseCount = resp;
      }
    })
  }
  public GetSixMonthEmployerDetailsCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.GetSixMonthEmployerDetailsCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.reverifyConcluded = resp;
      }
    })
  }
  public getOtherLoginFRCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.dashboardCountVm.caseHistoryFlag = false;
    this.screeningService.getOtherLoginFrCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.getOtherLoginFrCount = resp;
      }
    })
  }


  empForResearchPending(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.getEmpForResearchPending(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.empforResearchPendingCount = resp.empForResearchPendingCount;
      }
    })
  }
  eduForResearchPending(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.getEduForResearchPending(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.eduforResearchPendingCount = resp.insForResearchPendingCount;
      }
    })
  }
  empClientSuspect(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.getempClientSuspect(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.empClientSuspectCount = resp.empClientSuspectCount;
      }
    })
  }
  eduClientSuspect(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.geteduClientSuspect(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.eduClientSuspectCount = resp.insClientSuspectCount;
      }
    })
  }
  empFRUnderReview(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.getempFRUnderReview(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.empUnderReviewCount = resp.empUnderReviewCount;
      }
    })
  }
  eduFRUnderReview(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.geteduFRUnderReview(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.eduUnderReviewCount = resp.insUnderReviewCount;
      }
    })
  }
  empFRApprovalPending(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.getempFRApprovalPending(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.empApprovalPendingCount = resp.empApprovalPendingCount;
      }
    })
  }
  eduFRApprovalPending(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.geteduFRApprovalPending(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.eduApprovalPendingCount = resp.insApprovalPendingCount;
      }
    })
  }
  empFRReject(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.getempFRReject(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.empRejectedCount = resp.empRejectedCount;
      }
    })
  }
  eduFRReject(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.geteduFRReject(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.eduRejectedCount = resp.insRejectedCount;
      }
    })
  }
  empFRVerified(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.getempFRVerified(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.empVerifiedCount = resp.empVerifiedCount;
      }
    })
  }
  eduFRVerified(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.geteduFRVerified(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.eduVerifiedCount = resp.insVerifiedCount;
      }
    })
  }


  public getScopeCreationNotAssignedCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.dashboardCountVm.caseHistoryFlag = false;
    this.screeningService.getScopeCreationNotAssignedCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.scopeNotAssignedCount = resp;
      }
    })
  }
  public getScopeCreationAssignedCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.getScopeCreationAssignedCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.scopeAssignedCount = resp;
      }
    })
  }
  public getScopeCreationLoaApprovedCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.getScopeCreationLoaApprovedCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.scopeLOAApprovedCount = resp;
      }
    })
  }
  public getScopeCreationLoaPendingCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.getScopeCreationLoaPendingCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.scopeLOAPendingCount = resp;
      }
    })
  }
  public getScopeHistoryCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.getScopeHistoryCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.scopeHistoryCount = resp;
      }
    })
  }
  public getMSPRateApprovalCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.dashboardCountVm.status = this.mspstatusApprove;
    this.screeningService.getMSPRateApprovalCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.mspApproved = resp;
      }
    })
  }
  public getMSPRatePendingCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.dashboardCountVm.status = this.mspstatusPending;
    this.screeningService.getMSPRatePendingCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.mspPending = resp;
      }
    })
  }
  public getMSPRateRejectedCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.dashboardCountVm.status = this.mspstatusReject;
    this.screeningService.getMSPRateRejectedCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.mspRejected = resp;
      }
    })
  }
  public getTATApprovalCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.dashboardCountVm.status = this.mspstatusApprove;
    this.screeningService.getTATApprovalCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.tatApproved = resp;
      }
    })
  }
  public getTATPendingCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.dashboardCountVm.status = this.mspstatusPending;
    this.screeningService.getTATPendingCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.tatPending = resp;
      }
    })
  }
  public getTATRejectedCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.dashboardCountVm.status = this.mspstatusReject;
    this.screeningService.getTATRejectedCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.tatRejected = resp;
      }
    })
  }
  public GetFOCCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.GetFOCCount().subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.focCount = resp;
      }
    })
  }
  public getLoaApprovedCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.getLoaApprovedCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.loaApprovedCount = resp;
      }
    })
  }
  public getLoaPendingCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.getLoaPendingCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.loaPendingCount = resp;
      }
    })
  }
  public getLoaRejectedCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.getLoaRejectedCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.loaRejectCount = resp;
      }
    })
  }

  public getClientAgreementPendingCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.getClientAgreementPendingCount(this.dashboardCountVm.userId).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.clientAgreementPendingCount = resp;
      }
    })
  }
  public getClientAgreementApprovedCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.getClientAgreementApprovedCount(this.dashboardCountVm.userId).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.clientAgreementApprovedCount = resp;
      }
    })
  }
  public GetStopCheckCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.GetStopCheckCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.stopCheckCount = resp;
      }
    })
  }
  public GetDirectAppCaseHistoryCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.GetDirectAppCaseHistoryCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.directAppCaseHistoryCount = resp;
      }
    })
  }

  public getL1RaiseInsuffCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.GetLevelOneInsufficiencyRaiseCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.levelOneInsuffRaiseCount = resp;
      }
    })
  }
  public getL1ClearInsuffCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.GetLevelOneInsufficiencyClearCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.levelOneInsuffClearCount = resp;
      }
    })
  }
  public getL1TATCrossedCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.GetLevelOneTATCrossedInsuffCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.TATCrossedInsuffCount = resp;
      }
    })
  }
  public getL2RaiseInsuffCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.GetLevelTwoInsufficiencyRaiseCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.levelTwoInsuffRaiseCount = resp;
      }
    })
  }
  public getL2ClearInsuffCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.GetLevelTwoInsufficiencyClearCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.levelTwoInsuffClearCount = resp;
      }
    })
  }
  public getL2TATCrossedCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.GetLevelTwoTATCrossedInsuffCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.LevelTwoTATCrossedInsuffCount = resp;
      }
    })
  }


  // End CRT Dashboard count methods

  //this.partialIQCCount = resp.partialIQCCount;
  //this.subCheckQcCount = resp.subCheckQcCount;

  verificationCaseCnt: any = 0;
  public Getpriority(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    // this.screeningService.getAssignNotAssign(this.dashboardCountVm).subscribe(resp1 => {
    //   if (resp1 != null || resp1 != undefined) {
    //    this.verificationCaseCnt = resp1;
    //   }
    // });
    this.screeningService.GetPrioritylookup(this.dashboardCountVm).subscribe((resp2: any) => {
      if (resp2 != null || resp2 != undefined) {
       if (this.userData.applicationId === 2) {
  this.casePriorityLookup = resp2 === null ? [] : resp2;

  this.casePriorityLookup = this.casePriorityLookup
    .filter(x => x.lookupName.toLowerCase().includes('normal') || 
                 x.lookupName.toLowerCase().includes('rush'))
    .map(x => ({
      ...x,
      lookupName: x.lookupName.toLowerCase().includes('normal') 
        ? 'Standard Priority' 
        : 'High Priority'
    }));
}
        else {
          this.priorityLookup = resp2 === null ? [] : resp2;
        }
      }
    })

  }

  // end
  public getInsuffCAMCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.dashboardCountVm.flag = true;
    this.screeningService.getInsufficiencyCAMCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.getInsufficiencyCAMCount = resp;
      }
    })
  }
  public getinsuffAppPendingCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.dashboardCountVm.flag = false;
    this.screeningService.getInsufficiencyCAMCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.insuffAppPendingCount = resp;
      }
    })
  }
  public getAutomationInsuffCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.automationInsuffCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.automationInsuffCount = resp;
      }
    })
  }
  public getClearanceCAMCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.getClearCAMCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.getClearCAMCount = resp;
      }
    })
  }
  public getSubmissionCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.dashboardCountVm.caseHistoryFlag = false;
    this.screeningService.getSubmissionCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.submissionCount = resp;
      }
    })
  }
  public getCaseHistorycount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.dashboardCountVm.caseHistoryFlag = true;
    this.screeningService.getCaseHistorycount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.caseHistorycount = resp;
      }
    })
  }
  public getSubcheckCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.dashboardCountVm.subCheckFlag = false;
    this.screeningService.getSubcheckCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.subcheckCount = resp;
      }
    })
  }
  public getPreQcCases(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.getPreQcCases(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.preQcCases = resp;
      }
    })
  }
  public getPreQcReject(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.getPreQcReject(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.preQcReject = resp;
      }
    })
  }
  public getDAsubcheckCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.getDAsubcheckCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.dAsubcheckCount = resp;
      }
    })
  }
  public getNotApplicableFlagCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.getNotApplicableFlagCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.notApplicableFlagCount = resp;
      }
    })
  }
  public getSubmissionHistoryCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.dashboardCountVm.submissionHistoryFlag = true;
    this.screeningService.getSubmissionHistoryCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.submissionHistoryCount = resp;
      }
    })
  }
  public getPreQcSubmHisCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.dashboardCountVm.PreQcSubHistoryFlag = false;
    this.screeningService.getPreQcSubmHisCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.preQcSubmissionHistoryCount = resp;
      }
    })
  }
  public getVERejectCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.getVERejectCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.getComponentVERejectCount = resp;
      }
    })
  }
  public getFRRejectCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.getFRRejectCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.getComponentFRRejectCount = resp;
      }
    })
  }
  public getReOpenChecksCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVmData(caseFlag, insuFlag, veFlag, qcFlag);
    this.screeningService.getReOpenChecksCount(this.dashboardCountVm).subscribe(resp => {
      if (resp != null || resp != undefined) {
        this.reOpenChecksCount = resp;
      }
    })
  }
  getDashboardCount(caseFlag, insuFlag, veFlag, qcFlag) {
    this.dashboardCountVm.applicationId = this.userData.applicationId;
    this.dashboardCountVm.userId = this.userData.userId;
    this.dashboardCountVm.deptId = this.userData.deptId;
    this.dashboardCountVm.DeptName = this.userData.DeptName;
    this.dashboardCountVm.teamName = this.userData.teamName;
    this.dashboardCountVm.teamId = this.userData.teamId;
    this.dashboardCountVm.subTeamId = this.userData.subTeamId;
    this.dashboardCountVm.subTeamName = this.userData.subTeamName;
    this.dashboardCountVm.clientId = this.userData.clientId;
    this.dashboardCountVm.teamLeadFlag = this.userData.teamLeadFlag;
    this.dashboardCountVm.subTeamLeadFlag = this.userData.subTeamLeadFlag;
    this.dashboardCountVm.workFlowLookupId = this.userData.workFlowLookupId;
    this.dashboardCountVm.siteId = this.userData.siteId;
    this.dashboardCountVm.caseCreationFlag = caseFlag;
    // this.dashboardCountVmdataSubmissionFlag: boolean;
    this.dashboardCountVm.verificationFlag = veFlag;
    this.dashboardCountVm.qcFlag = qcFlag;
    this.dashboardCountVm.insufficiencyFlag = insuFlag;
    this.screeningService.getDashboardCount(this.dashboardCountVm).subscribe(resp => {
      if (resp) {
        this.callbackValue = this.getAsKeyVal(resp.callbackCount);
        this.callbackSumValue = this.sumofOb(resp.callbackCount);
        this.callbackKey = resp.callbackValue;
        // this.pendingStatusValue = this.getAsKeyVal(resp.pendingStatusCount);
        // this.pendingStatusSumValue = this.sumofOb(resp.pendingStatusCount);
        // this.pendingStatusKey = resp.pendingStatusValue;
        if (resp.screeningStatus) {
          resp.screeningStatus.forEach(el => {
            el.createUserId = 0;
          });
        }
        this.getOtherLoginFrCount = resp.getOtherLoginFrCount;
        this.forResearchPendingCount = resp.forResearchPendingCount,
          this.empInsApprovalPendingCount = resp.empInsApprovalPendingCount,
          this.empInsRejectedCount = resp.empInsRejectedCount,
          this.empInsUnderReviewCount = resp.empInsUnderReviewCount,
          this.empInsClientSuspectCount = resp.empInsClientSuspectCount,
          this.empInsResearchVerifiedCount = resp.empInsResearchVerifiedCount,
          this.screeningStatus = resp.screeningStatus;
        this.priorityCount = resp.verificationCaseCount;
        this.caseCount = resp.caseCreationCount;
        // Added By Megala - For (sprint -22) VTS2-2024-CRT-0195
        this.closureAdviceCnt = resp.caseCreationCount;
        this.caseHistorycount = resp.caseHistoryCount;
        this.directAppCaseHistoryCount = resp.directAppCaseHistoryCount;
        this.loaApprovedCount = resp.loaApprovedCount;
        this.loaPendingCount = resp.loaPendingCount;
        this.loaRejectCount = resp.loaRejectCount;
        this.submissionCount = resp.submissionCount;
        this.dAsubcheckCount = resp.daSubCheckCount;
        this.subcheckCount = resp.subCheckCount;
        this.scopeNotAssignedCount = resp.scopeCreationNotAssignedCount;
        this.scopeLOAApprovedCount = resp.scopeCreationLoaApprovedCount;
        this.scopeAssignedCount = resp.scopeCreationAssignedCount;
        this.scopeLOAPendingCount = resp.scopeCreationLoaPendingCount;
        this.mspApproved = resp.mspRateApprovedCount;
        this.mspPending = resp.mspRateReceivedCount;
        this.mspRejected = resp.mspRateReviewCount;
        this.packFeeApprovedCount = resp.packFeeApprovedCount;
        this.packFeeReviewCount = resp.packFeeReviewCount;
        this.getClientCommentCaseCount = resp.getClientCommentCaseCount;
        this.getComponentQcRejectCount = resp.getComponentQcRejectCount;
        this.notSendToQc = resp.notSendToQc;
        this.pendingChecks = resp.pendingChecks;
        this.toClose = resp.toClose;
        this.singlePendingChecks = resp.singlePendingChecks;
        this.normalChecks = resp.normalChecks;
        this.veReOpenCount = resp.veReOpenCount;
        this.allcasecount = resp.allCaseCnt;
        this.pendingCasesClient = resp.pendingCasesClient;
        this.submittedCasesClient = resp.submittedCasesClient;
        this.completedCasesClient = resp.completedCasesClient;
        if (this.userData.applicationId === 2) {
          this.pendingChecks = resp.pendingChecksClient;
        }
        this.currentEmpCnt = resp.currentEmpCnt;
        this.redCaseCnt = resp.teamLeadApprovedCount;
        this.reAssignCaseCnt = resp.reAssignChecksCnt;
        this.getComponentVERejectCount = resp.getComponentVERejectCount;
        this.getComponentFRRejectCount = resp.getComponentFRRejectCount;
        this.reOpenChecksCount = resp.reOpenChecksCount;
        this.tatApproved = resp.tatApprovedCount;
        this.tatPending = resp.tatPendingCount;
        this.tatRejected = resp.tatRejectedCount;
        this.clientAgreementApprovedCount = resp.clientAgreementApprovedCount;
        this.clientAgreementPendingCount = resp.clientAgreementPendingCount;
        this.focCount = resp.focCount;
        this.getInsufficiencyCAMCount = resp.getInsufficiencyCAMCount;
        this.insuffAppPendingCount = resp.insuffAppPendingCount;
        this.automationInsuffCount = resp.automationInsuffCount;
        this.getClearCAMCount = resp.getClearedInsuffCAMCount;
        this.finalQcCount = resp.getFinalQcCount;
        this.iqcFinalCompCnt = resp.iqcFinalCompCnt;
        this.partialIQCCount = resp.partialIQCCount;
        this.individualQcCount = resp.getComponentQcCount;
        this.subCheckQcCount = resp.subCheckQcCount;
        this.qcRejectCount = resp.getSubmissionQcRejectCount;
        this.priorityLookup = resp.priorityLookup === null ? [] : resp.priorityLookup;
        this.casePriorityLookup = resp.casePriorityLookup === null ? [] : resp.casePriorityLookup;
        if (this.userData.applicationId === 2) {
  this.casePriorityLookup = this.casePriorityLookup
    .filter(x => x.lookupName.toLowerCase().includes('normal') || 
                 x.lookupName.toLowerCase().includes('rush'))
    .map(x => ({
      ...x,
      lookupName: x.lookupName.toLowerCase().includes('normal') 
        ? 'Standard Priority' 
        : 'High Priority'
    }));
}
        this.insuffDetails = resp.getInsufficiencyDetailsCount;
        // this.insuffClearCount = resp.getClearInsufficiencyCount;
        // this.insufficiencyRaisedCount = resp.getRaiseInsufficiencyScreeningCount;
        this.levelOneInsuffRaiseCount = resp.levelOneInsuffRaiseCount;
        this.levelOneInsuffClearCount = resp.levelOneInsuffClearCount;
        this.TATCrossedInsuffCount = resp.tatCrossedInsuffCount;
        this.levelTwoInsuffRaiseCount = resp.levelTwoInsuffRaiseCount;
        this.levelTwoInsuffClearCount = resp.levelTwoInsuffClearCount;
        this.preQcCases = resp.preQCScreeningCount;
        this.preQcReject = resp.preQCScreeningRejectCount;
        this.notApplicableFlagCount = resp.notApplicableFlagCount;
        this.closeCancelledInternallyFlagCount = resp.closeCancelledInternallyFlagCount;
        this.getVerificationCompletedCount = resp.getVerificationCompletedCount;
        this.seventhdayReportCount = resp.seventhdayReportCount;
        this.submissionHistoryCount = resp.submissionHistoryCount;
        this.preQcSubmissionHistoryCount = resp.preQcSubmissionHistoryCount;
        this.scopeHistoryCount = resp.scopeHistoryCount;
        this.getQcApprovedRejectedCount = resp.getQcApprovedRejectedCount;
        this.stopCheckCount = resp.stopCheckCount;
        this.bTpopupcount = resp.bTpopupcount;
        this.wTpopupcount = resp.wTpopupcount;
        this.nTpopupcount = resp.nTpopupcount;
        this.cTpopupcount = resp.cTpopupcount;
        if (resp.veCount) {
          resp.veCount.forEach(ve => {
            if (ve.screeningOwnerId > 0) {
              this.verificationAssignedCaseCount = this.verificationAssignedCaseCount + ve.count;
            } else {
              this.verificationNotAssignedCaseCount = this.verificationNotAssignedCaseCount + ve.count;
            }
            if (ve.subCheckFlag === true) {
              this.subcheckVerificationCount = this.subcheckVerificationCount + ve.count;
            }
          });
        }
        if (resp.verificationCaseCount) {
          resp.verificationCaseCount.forEach(element => {
            // this.verificationCaseCount = this.verificationCaseCount + element.count;
            // if (element.screeningOwnerId > 0) {
            //   this.verificationAssignedCaseCount = this.verificationAssignedCaseCount + element.count;
            // } else {
            //   this.verificationNotAssignedCaseCount = this.verificationNotAssignedCaseCount + element.count;
            // }
            // if (element.subCheckFlag === true) {
            //   //this.subcheckVerificationCount = this.subcheckVerificationCount + element.count;
            // }
            if (this.priorityLookup) {
              this.priorityLookup.forEach(ele => {
                if (ele.lookupId === element.priorityLookupId) {
                  ele.langId = ele.langId + element.count;
                }
              });
            }
            if (this.casePriorityLookup) {
              this.casePriorityLookup.forEach(ele => {
                if (ele.lookupId === element.casePriorityLookupId) {
                  ele.langId = ele.langId + element.count;
                }
              });
            }
            if (this.screeningStatus) {
              this.screeningStatus.forEach(elem => {
                if (elem.screeningStatusId === element.screeningStatusId) {
                  // if (this.isVerification()) {
                  if (!(elem.statusLookUpName === 'Insufficiency')) {
                    elem.createUserId = elem.createUserId + element.count;
                  }
                  // } else {
                  //   elem.createUserId = elem.createUserId + element.count;
                  // }
                }
              });
            }
          });
        }
        if (this.isVeReopenChecks() || this.getQuickLinkCondition()) {
          this.pendingStatusCount();
        }
      }
    }, err => { }, () => {
      this.getDashboardData();
      if (this.isGraph()) {
        this.getGraph(0, 'GetColorCodeWiseClosedCount');
      }
      // this.filterData();
      const da = this.dateChange(1);
      this.dateRange.push(da); this.dateRange.push(new Date());
      this.dateWiseCount();
    });
  }

  // dashboard count functionality - By Naveen - End
  isVerification() {
    return this.userData.teamName === 'EmploymentIndia' || this.userData.teamName === 'EmploymentAbroad' || this.userData.teamName
      === 'EmploymentTechM' || this.userData.teamName === 'EducationTeam' || this.userData.teamName === 'EducationOverseas' || this.
        userData.teamName === 'AddressTeam' || this.userData.teamName === 'CriminalTeam' || this.userData.teamName === 'IdentityTeam' || this.userData.teamName === 'CTS-AddressTeam' ||
      this.userData.teamName === 'CTS-EducationTeam' || this.userData.teamName === 'CTS-EmploymentTeam' || this.userData.teamName === 'CTS-IdentityTeam' || this.userData.teamName === 'CTS-CriminalTeam';
  }
  isVeReopenChecks() {
    return ((((this.userData.teamName === 'EmploymentIndia' || this.userData.teamName === 'EmploymentAbroad' || this.userData.teamName ===
      'EmploymentTechM' || this.userData.teamName === 'EducationTeam' || this.userData.teamName === 'EducationOverseas' || this.userData.
        teamName === 'AddressTeam' || this.userData.teamName === 'CriminalTeam' || this.userData.teamName === 'IdentityTeam' || this.userData.
          subTeamName === 'CRTCAMTeam' || ((this.userData.teamLeadFlag === true || this.userData.subTeamName == null) && (this.userData.teamName === 'CRTIndia' || this.userData.
            teamName === 'CRTTechMahindra' || this.userData.teamName === 'CRTAbroad'))) || ((this.userData.teamName === null || this.userData.teamName
              === 'SeniorManager')))) || this.userData.teamName === 'CTS-CRTTeam' || this.userData.teamName === 'CTS-AddressTeam' || this.userData.teamName === 'CTS-EducationTeam' || this.userData.teamName === 'CTS-EmploymentTeam' || this.userData.teamName === 'CTS-IdentityTeam' || this.userData.teamName === 'CTS-CriminalTeam') && this.userData.applicationId === 1
  }
  isGraph() {
    return ((((this.userData.subTeamName === 'CRTCAMTeam' || (this.userData.teamName === null || this.userData.
      teamName === 'SeniorManager') || ((this.userData.teamName === 'CRTIndia' || this.userData.teamName ===
        'CRTTechMahindra' || this.userData.teamName === 'CRTAbroad') && this.userData.teamLeadFlag === true) ||
      this.userData.applicationId === 2) || this.userData.teamName === 'ManagingDirector' || this.userData.
        teamName === 'ApprovalManager' || this.userData.teamName === 'SeniorManager')) || this.userData.teamName === 'CTS-CRTTeam');
  }
  getGraph(i, method) {
    if (i < 3) {
      this.screeningService.GetGraphCount(this.userData, method).subscribe(res => {
        if (res) {
          this.multiGraph.push(i === 2 ? (res.some(x => x.value > 0) ? res : []) : res);
          this.getGraph(i + 1, i === 0 ? 'GetCaseStatusWiseCount' : 'GetWIPCasesCount');
          this.getColors(this.multiGraph[0]);
          this.colorForStatus = this.getColorForStatus(this.multiGraph[1]);
        }
      });
    }
  }
  getColors(list: any) {
    const colors = { domain: [] };
    list.forEach(element => {
      colors.domain.push(element.name.toLowerCase() === 'amber' ? '#FFBD04' : element.name.toLowerCase() === 'green' ?
        '#008000' : element.name.toLowerCase() === 'red' ? '#ff0000' : element.name.toLowerCase() === 'orange' ? '#ffa500'
          : element.name.toLowerCase() === 'yellow' ? '#ffff00' : '#ff00ff');
    });
    this.colors = colors;;
  }
  onSelectGraph(event, method) {
    const data = { loginUserDetVm: this.userData, colorCode: '', caseStatusLookupId: 0, lookUpValue: [] };
    method === 'GetCaseStatusWiseCaseDetails' ? data.caseStatusLookupId = (this.getExtraValue(event, this.multiGraph[1])) : (method === 'GetColorCodeWiseCaseDetails' ?
      data.colorCode = event.name : data.caseStatusLookupId = (this.getExtraValue(event, this.multiGraph[2])));
    this.screeningService.GetGraphCount(data, method).subscribe(res => {
      if (res) {
        res = method === 'GetWIPCases' ? res.find(x => x.reportType === event.name).caseDetails : res;
        res.forEach(element => {
          element.candiateName = element.candiateName.firstName ? (element.candiateName.firstName + (element.candiateName.middleName ? (' '
            + element.candiateName.middleName) : '') + (element.candiateName.lastName ? (' ' + element.candiateName.lastName) : '')) : 'N/A';
        });
        this.exportToExcel(this.downExcelCols(), res, (event.name + ' Details'));
      }
    });
  }
  downExcelCols() {
    return [{ field: 'candiateName', header: 'Candiate Name' }, { field: 'clientName', header: 'Client Name' },
    { field: 'siteName', header: 'Site Name' },
    { field: 'component', header: 'Component Name' }, { field: 'component', header: 'Status' },
    { field: 'clientRefNo', header: 'Client Reference Number' },
    { field: 'casePriority', header: 'Case Priority' }, { field: 'applicantId', header: 'Applicant Id' },
    { field: 'colorCode', header: 'Color Code' }, { field: 'caseInitiationDate', header: 'Case Initiation Date' }, { field: 'caseReceivedDate', header: 'Case Received Date' },
    { field: 'caseDueDate', header: 'Case Due Date' }, { field: 'reportSendDate', header: 'Report Send Date' },
    { field: 'insuffRaisedDate', header: 'Insufficiency Raised Date' }, { field: 'insuffRemarks', header: 'Insufficiency Remarks' }];
  }
  getExtraValue(event, list) {
    return (event.value > 0) ? (list.find(x => x.name === event.name).extra) : (event.extra);
  }
  exportToExcel(dataExcelCols, excelDataList, excelName) {
    let tabtext = '<table border="1px">';
    let j = 0;
    const header = dataExcelCols;
    const filteredValue = excelDataList;
    const lines = filteredValue.length;
    let headerColos = '';
    let objRow = '';
    let subRow = '';
    if (lines > 0) {
      header.forEach(h => {
        headerColos = headerColos + '<th bgcolor="#0E4872" style="font-size:15px;color:white">' + h.header + '</th>';
      });
      tabtext = tabtext + '<tr>' + headerColos + '</tr>';
    }
    for (j = 0; j < lines; j++) {
      // changed components to single list // start
      excelDataList[j].component = [];
      if (dataExcelCols.some(x => x.field === 'component')) {
        for (let m = 0; m < excelDataList[j].componentName.length; m++) {
          excelDataList[j].component.push({ name: excelDataList[j].componentName[m], sts: excelDataList[j].screeningStatus[m] });
        }
      }
      // end
      subRow = filteredValue[j]['component'].length;
      headerColos = '';
      header.forEach(h => {
        if (h.field.includes('Date')) {
          filteredValue[j][h.field] = this.datePipe.transform((this.common.getTimezoneOffset(filteredValue[j][h.field], false)), 'dd/MM/yyyy hh:mm:ss a');
        }
        // if (h.field === 'caseInitiationDate') {
        //   filteredValue[j][h.field] = this.datePipe.transform((this.common.getTimezoneOffset(filteredValue[j][h.field], false)), 'dd/MMM/yyyy');
        // }
        objRow = '';
        if (h.field !== 'component' && Array.isArray(filteredValue[j][h.field])) {
          for (const row of filteredValue[j][h.field]) {
            objRow = ((objRow !== '') ? objRow + ', ' : '') + row;
          }
          headerColos = headerColos + '<td style="font-size:12px; text-align: left; vertical-align: middle;" rowspan="' + subRow + '">' + objRow + ' </td>';
        } else if (h.field === 'component' && Array.isArray(filteredValue[j][h.field])) {
          const row = filteredValue[j][h.field];
          if ('Component Name' === h.header) {
            objRow = row[0] ? row[0].name : 'N/A';
          } else if ('Status' === h.header) {
            objRow = row[0] ? row[0].sts : 'N/A';
          }
          headerColos = headerColos + '<td style="font-size:12px;text-align: left; vertical-align: middle;">' + objRow + ' </td>';
        } else {
          headerColos = headerColos + '<td style="font-size:12px;text-align: left; vertical-align: middle;" rowspan="' + subRow + '">' +
            (filteredValue[j][h.field] ? (filteredValue[j][h.field]) : 'N/A') + ' </td>';
        }
      });
      tabtext = tabtext + '<tr>' + headerColos + '</tr>';
      if (Array.isArray(filteredValue[j]['component']) && Number(subRow) > 1) {
        this.skipfirst = false;
        for (const row of filteredValue[j]['component']) {
          if (this.skipfirst) {
            objRow = row.name;
            tabtext = tabtext + '<tr><td style="font-size:12px;text-align: left; vertical-align: middle;">' + objRow + ' </td>';
            objRow = row.sts;
            tabtext = tabtext + '<td style="font-size:12px;text-align: left; vertical-align: middle;">' + objRow + ' </td>';
            tabtext = tabtext + '</tr>';
          }
          this.skipfirst = true;
        }
      }
    }
    tabtext = tabtext + '</table>';
    tabtext = tabtext.replace(/<A[^>]*>|<\/A>/g, '');
    tabtext = tabtext.replace(/<img[^>]*>/gi, '');
    tabtext = tabtext.replace(/<input[^>]*>|<\/input>/gi, '');
    const fileName = excelName + ' List.xls';
    const exceldata = new Blob([tabtext], { type: this.EXCEL_TYPE });
    if ((window.navigator as any).msSaveBlob) {
      (window.navigator as any).msSaveOrOpenBlob(exceldata, fileName);
    } else {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(exceldata);
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
  getDiv(id: any) {
    if (id == "0DashBoard" || "1DashBoard" || "2DashBoard" || "3DashBoard") {
      const html = document.getElementById(id).innerText.length > 0;
      return html;
    }
  }
  dateChange(value: any) {
    return new Date((new Date().getFullYear()), (new Date().getMonth()), value);
  }
  dateWiseCount() {
    if ((this.userData.teamName === 'ManagingDirector' || this.userData.teamName === 'ApprovalManager' ||
      this.userData.teamName === 'SeniorManager') && this.dateRange[0] && this.dateRange[1]) {
      this.qcService.GetDaywiseActivityCount({
        fromDate: this.common.getTimezoneOffset(this.dateRange[0], false), // this.dateChange(this.pDateRange[0]
        toDate: this.common.getTimezoneOffset(this.dateRange[1], false)
      }).subscribe(dayWise => { // this.dateChange(this.pDateRange[1])
        const val = [{ name: 'Case Creation', series: dayWise.caseCreationCount },
        { name: 'Invitation Closed', series: dayWise.invitationClosedCount },
        { name: 'File Submisstion', series: dayWise.fileSubmisstionCount },
        { name: 'Iqc Closed', series: dayWise.iqcClosedCount },
        { name: 'Fqc Closed', series: dayWise.fqcClosedCount },
        { name: 'Verification Closed', series: dayWise.verificationClosedCount }];
        this.dayWiseCount = val;
        this.dayWiseCount.forEach(element => {
          element.series.map(x => x.name = this.datePipe.transform(x.name, 'yyyy-MM-dd'));
        });
      });
    }
  }
  // //count load
  // getDateGraphClick(event: any) {
  //   let data;
  //   if (event && event.value) {
  //     data = {type: event.series, dateValue: this.common.getTimezoneOffset(new Date(event.name), false), fromDate: this.common.getTimezoneOffset(this.dateRange[0], false), toDate: this.common.getTimezoneOffset(this.dateRange[1], false)};
  //   } else {
  //     data = {type: event, dateValue: null, fromDate: this.common.getTimezoneOffset(this.dateRange[0], false), toDate: this.common.getTimezoneOffset(this.dateRange[1], false)};
  //   }
  //   this.qcService.GetDateWiseList(data).subscribe(res => {

  getDateGraphClick(event: any) {
    let data;
    if (event && event.value) {
      data = { type: event.series, dateValue: this.common.getTimezoneOffset(new Date(event.name), false), fromDate: this.common.getTimezoneOffset(this.dateRange[0], false), toDate: this.common.getTimezoneOffset(this.dateRange[1], false) };
    } else {
      data = { type: event, dateValue: null, fromDate: this.common.getTimezoneOffset(this.dateRange[0], false), toDate: this.common.getTimezoneOffset(this.dateRange[1], false) };
    }
    this.qcService.GetDateWiseList(data).subscribe(res => {
      if (res) {
        res.forEach(element => {
          element.candiateName = element.candiateName.firstName ? (element.candiateName.firstName + (element.candiateName.middleName ? (' '
            + element.candiateName.middleName) : '') + (element.candiateName.lastName ? (' ' + element.candiateName.lastName) : '')) : 'N/A';
        });
        let cols;
        if (data.type === 'Case Creation' || data.type === 'Invitation Closed') {
          cols = [{ field: 'candiateName', header: 'Candiate Name' }, { field: 'clientName', header: 'Client Name' }, {
            field: 'siteName',
            header: 'Site Name'
          }, { field: 'clientRefNo', header: 'Client Reference Number' }, { field: 'applicantId', header: 'Applicant Id' },
          { field: 'caseInitiationDate', header: 'Case Initiation Date' }, { field: 'caseReceivedDate', header: 'Case Received Date' }];
        } else {
          cols = this.downExcelCols();
        }
        this.exportToExcel(cols, res, (data.type + ' Details'));
      }
    });
  }
  filterData() {

    // this.verificationFilter = new VerificationDetFilterVm();
    // this.verificationFilter.loginUserDetVm = this.userData;
    // this.verificationFilter.FilterVm = new FilterVm();
    // this.verificationService.getVerificationSearchDetails(this.verificationFilter).subscribe(res => {
    //   if (res) {
    //     if (this.userData.applicationId !== 2) {
    //       this.pendingChecks = res.verificationDet.filter(x => x.insuffRaisedFlag === false).length;
    //       const spendingChecks = res.verificationDet.filter(
    //         (thing, i, arr) => arr.filter(t => t.screeningId === thing.screeningId).length === 1
    //       );
    //       this.singlePendingChecks = spendingChecks.filter(x => x.insuffRaisedFlag === false).length;
    //     }
    //     this.toClose = res.verificationDet.filter(x => !(x.qcStatus === 'Not Sent To QC' && x.generatedPdfFlag === true)
    //       && x.insuffRaisedFlag !== true && x.qcStatus.toLowerCase() !== 'rejected' && x.componentStatus.toLowerCase()
    //       !== 'open' && x.componentStatus.toLowerCase() !== 'for (de - qc)').length;
    //     this.notSendToQc = res.verificationDet.filter(x => x.qcStatus === 'Not Sent To QC' && x.generatedPdfFlag === true).length;
    //   }
    // });
    if (this.screeningStatus) {
      this.reOpneList = this.screeningStatus.filter(x => x.statusLookUpName === 'Open' || x.statusLookUpName === 'WIP');
      this.reOpenCount = this.reOpneList.find(t => t.statusName === 'Re-Open');
      // this.othersList = this.screeningStatus.filter(x => x.statusLookUpName === 'WIP');
      this.pendingStatusValue = this.screeningStatus.filter(x => x.statusLookUpName === 'Insufficiency');
      this.screeningStatus.forEach(element => {
        const val: { value: number; name: string; } = {
          value: element.createUserId,
          name: element.statusName,
        };
        this.pendingStatusValueChart.push(val);
      });
      this.pendingStatusValueChart.push({ value: this.getVerificationCompletedCount, name: 'Closed Checks' });
      this.pendingStatusValueChart.push({ value: this.getComponentQcRejectCount, name: 'Qc Rejected' });
      this.pendingStatusValueChart.push({ value: this.notSendToQc, name: 'Not Sent to Qc' });
      this.pendingStatusValueChart.push({ value: this.toClose, name: 'To Close' });
      this.pendingStatusValueChart = this.pendingStatusValueChart.some(x => x.value > 0) ? this.pendingStatusValueChart : [];
    }
  }
  // GetCaseCreationDetailsCount() {
  //   this.screeningService.GetCaseCreationDetailsCount().subscribe(resp => {
  //     if (resp) {
  //       this.caseCount = resp;
  //     }
  //   });
  // }
  // getRaiseinsuff() {
  //   this.screeningService.getInsufficiencyDetailsCount(this.userData.userId).subscribe(resp => {
  //     if (resp) {
  //       setTimeout(() => {
  //         this.insuffDetails = resp;
  //       }, 0);
  //     }
  //   });
  // }
  // }
  // filterData() {
  //   // this.verificationFilter = new VerificationDetFilterVm();
  //   // this.verificationFilter.loginUserDetVm = this.userData;
  //   // this.verificationFilter.FilterVm = new FilterVm();
  //   // this.verificationService.getVerificationSearchDetails(this.verificationFilter).subscribe(res => {
  //   //   if (res) {
  //   //     if (this.userData.applicationId !== 2) {
  //   //       this.pendingChecks = res.verificationDet.filter(x => x.insuffRaisedFlag === false).length;
  //   //       const spendingChecks = res.verificationDet.filter(
  //   //         (thing, i, arr) => arr.filter(t => t.screeningId === thing.screeningId).length === 1
  //   //       );
  //   //       this.singlePendingChecks = spendingChecks.filter(x => x.insuffRaisedFlag === false).length;
  //   //     }
  //   //     this.toClose = res.verificationDet.filter(x => !(x.qcStatus === 'Not Sent To QC' && x.generatedPdfFlag === true)
  //   //       && x.insuffRaisedFlag !== true && x.qcStatus.toLowerCase() !== 'rejected' && x.componentStatus.toLowerCase()
  //   //       !== 'open' && x.componentStatus.toLowerCase() !== 'for (de - qc)').length;
  //   //     this.notSendToQc = res.verificationDet.filter(x => x.qcStatus === 'Not Sent To QC' && x.generatedPdfFlag === true).length;
  //   //   }
  //   // });
  //   if (this.screeningStatus) {
  //     this.reOpneList = this.screeningStatus.filter(x => x.statusLookUpName === 'Open' || x.statusLookUpName === 'WIP');
  //     this.reOpenCount = this.reOpneList.find(t => t.statusName === 'Re-Open');
  //     // this.othersList = this.screeningStatus.filter(x => x.statusLookUpName === 'WIP');
  //     this.pendingStatusValue = this.screeningStatus.filter(x => x.statusLookUpName === 'Insufficiency');
  //     this.screeningStatus.forEach(element => {
  //       const val: { value: number; name: string; } = {
  //         value: element.createUserId,
  //         name: element.statusName,
  //       };
  //       this.pendingStatusValueChart.push(val);
  //     });
  //     this.pendingStatusValueChart.push({ value: this.getVerificationCompletedCount, name: 'Closed Checks' });
  //     this.pendingStatusValueChart.push({ value: this.getComponentQcRejectCount, name: 'Qc Rejected' });
  //     this.pendingStatusValueChart.push({ value: this.notSendToQc, name: 'Not Sent to Qc' });
  //     this.pendingStatusValueChart.push({ value: this.toClose, name: 'To Close' });
  //     this.pendingStatusValueChart = this.pendingStatusValueChart.some(x => x.value > 0) ? this.pendingStatusValueChart : [];
  //   }
  // }
  // // GetCaseCreationDetailsCount() {
  // //   this.screeningService.GetCaseCreationDetailsCount().subscribe(resp => {
  // //     if (resp) {
  // //       this.caseCount = resp;
  // //     }
  // //   });
  // // }
  // // getRaiseinsuff() {
  // //   this.screeningService.getInsufficiencyDetailsCount(this.userData.userId).subscribe(resp => {
  // //     if (resp) {
  // //       setTimeout(() => {
  // //         this.insuffDetails = resp;
  // //       }, 0);
  // //     }
  // //   });
  // // }
  openCreatedCases() {
    if (this.caseCount > 0) {
      this.screeningService.caseFlag = false;
      this.screeningService.caseFlagType = this.common.SUBMISSION;
      this.sharedService.emitChengesecDrawer();
      this.router.navigate(['dashboard/case/case-creation']);
    }
  }
  openNotApplicableCases() {
    if (this.notApplicableFlagCount > 0) {
      this.screeningService.caseFlag = false;
      this.screeningService.caseFlagType = this.common.NOTAPPLICABLE;
      this.sharedService.emitChengesecDrawer();
      this.router.navigate(['dashboard/screening/caselist']);
    }
  }
  opensubmissionHistory() {
    if (this.submissionHistoryCount > 0) {
      // this.screeningService.caseFlag = false;
      this.screeningService.caseFlagType = this.common.SUBMISSION_HISTORY;
      this.screeningService.flagType = true;
      this.sharedService.emitChengesecDrawer();
      this.router.navigate(['dashboard/screening/caselist']);
    }
  }

  openPreQcSubmissionHistory(count: any) {
    if (count > 0) {
      this.screeningService.caseFlagType = this.common.SUBMISSION_HISTORY;
      this.screeningService.flagType = false;
      this.sharedService.emitChengesecDrawer();
      this.router.navigate(['dashboard/screening/caselist']);
    }
  }
  getClosedComponentDetails() {
    if (this.closeCancelledInternallyFlagCount > 0) {
      this.screeningService.caseFlagType = this.common.CLOSED;
      this.sharedService.emitChengesecDrawer();
      this.router.navigate(['dashboard/screening/caselist']);
    }
  }
  getVerificationClosedDetails() {
    if (this.getVerificationCompletedCount > 0) {
      this.screeningService.caseFlagType = this.common.VE_HISTORY;
      this.sharedService.emitChengesecDrawer();
      this.router.navigate(['dashboard/screening/caselist']);
    }
  }
  getBTpopupDetails() {
    if (this.bTpopupcount > 0) {
      this.screeningService.caseFlagType = this.common.BT_POPUP;
      this.sharedService.emitChengesecDrawer();
      this.router.navigate(['dashboard/screening/caselist']);
    }
  }
  getWTpopupDetails() {
    if (this.wTpopupcount > 0) {
      this.screeningService.caseFlagType = this.common.WT_POPUP;
      this.sharedService.emitChengesecDrawer();
      this.router.navigate(['dashboard/screening/caselist']);
    }
  }
  getNTpopupDetails() {
    if (this.nTpopupcount > 0) {
      this.screeningService.caseFlagType = this.common.NT_POPUP;
      this.sharedService.emitChengesecDrawer();
      this.router.navigate(['dashboard/screening/caselist']);
    }
  }
  getCTpopupDetails() {
    if (this.cTpopupcount > 0) {
      this.screeningService.caseFlagType = this.common.CT_POPUP;
      this.sharedService.emitChengesecDrawer();
      this.router.navigate(['dashboard/screening/caselist']);
    }
  }
  getSeventhdayDetails() {
    if (this.seventhdayReportCount > 0) {
      this.common.hide = true;
      this.screeningService.caseFlagType = this.common.SEVENTHDAYTRACKER;
      this.sharedService.emitChengesecDrawer();
      this.router.navigate(['dashboard/reports/seventhDayReport']);
    }
  }
  openCreatedLOA(count, index) {
    if (count > 0) {
      this.common.loaActiveTabindex = index;
      this.sharedService.emitChengesecDrawer();
      this.router.navigate(['dashboard/case/loastatus']);
    }
  }
  openMspApproved() {
    this.sharedService.emitChengesecDrawer();
    this.router.navigate(['dashboard/client/msp-nrp-FeeApproval']);
  }
  openCloseInsuffQueryAndAppPending(count, flag) {
    if (count > 0) {
      this.common.fullyClearTab = flag;
      this.sharedService.emitChengesecDrawer();
      this.router.navigate(['dashboard/screening/Insufficiency']);
    }
  }
  openinsuffRaiseCount() {
    if (this.getInsufficiencyCAMCount > 0) {
      this.sharedService.emitChengesecDrawer();
      this.router.navigate(['dashboard/screening/Insufficiency']);
    }
  }
  openinsuffClearCount() {
    if (this.getClearCAMCount > 0) {
      this.common.fullyClearTab = true;
      this.sharedService.emitChengesecDrawer();
      this.router.navigate(['dashboard/screening/Insufficiencyclearance']);
    }
  }
  // GetScopeCreationDetailsCount() {
  //   this.screeningService.GetScopeCreationDetailsCount().subscribe(resp => {
  //     if (resp) {
  //       this.scopeCount = resp;
  //     }
  //   });
  // }
  openScopeHistory() {
    if (this.scopeHistoryCount > 0) {
      this.router.navigate(['dashboard/case/crt-case-creation']);
      this.screeningService.historyFlag = true;
    }
  }
  openCreatedScopes(type: any) {
    this.screeningService.caseFlag = false;
    this.sharedService.emitChengesecDrawer();
    if (type === 'Assigned') {
      if (this.scopeAssignedCount > 0) {
        this.router.navigate(['dashboard/case/crt-case-creation']);
        this.screeningService.assignedflag = true;
        this.screeningService.countflag = true;
        this.screeningService.loaapprovedflag = false;
        this.screeningService.notassignedflag = false;
        this.screeningService.loapendingflag = false;
      }
    }
    if (type === 'NotAssigned') {
      if (this.scopeNotAssignedCount > 0) {
        this.router.navigate(['dashboard/case/crt-case-creation']);
        this.screeningService.countflag = true;
        this.screeningService.notassignedflag = true;
        this.screeningService.loaapprovedflag = false;
        this.screeningService.assignedflag = false;
        this.screeningService.loapendingflag = false;
      }
    }
    if (type === 'LOAApproved') {
      if (this.scopeLOAApprovedCount > 0) {
        this.router.navigate(['dashboard/case/crt-case-creation']);
        this.screeningService.loaapprovedflag = true;
        this.screeningService.countflag = true;
        this.screeningService.assignedflag = false;
        this.screeningService.notassignedflag = false;
        this.screeningService.loapendingflag = false;
      }
    }
    if (type === 'LOAPending') {
      if (this.scopeLOAPendingCount > 0) {
        this.router.navigate(['dashboard/case/crt-case-creation']);
        this.screeningService.loapendingflag = true;
        this.screeningService.loaapprovedflag = false;
        this.screeningService.notassignedflag = false;
        this.screeningService.assignedflag = false;
        this.screeningService.countflag = true;
      }
    }
  }

  // preQcCasesCount() {
  //   this.screeningService.preQcCasesCount(this.userData.userId, this.userData.deptId).subscribe(resp => {
  //     if (resp) {
  //       this.preQcCases = resp;
  //     }
  //   });
  // }
  // preQcRejectCount() {
  //   this.screeningService.preQcRejectCount(this.userData.userId, this.userData.deptId).subscribe(resp => {
  //     if (resp) {
  //       this.preQcReject = resp;
  //     }
  //   });
  // }
  // getInsuffClearCount() {
  //   this.screeningService.getInsuffClearCount(this.userData.userId).subscribe(resp => {
  //     if (resp) {
  //       this.insuffClearCount = resp;
  //     }
  //   });
  // }
  openPreQCReject() {
    if (this.preQcReject > 0) {
      this.screeningService.caseFlag = false;
      this.screeningService.caseFlagType = this.common.PREQCREJECT;
      this.sharedService.emitChengesecDrawer();
      this.router.navigate(['dashboard/screening/caselist']);
    }
  }
  openPreQCCases() {
    if (this.preQcCases > 0) {
      this.screeningService.caseFlag = false;
      this.sharedService.emitChengesecDrawer();
      this.router.navigate(['dashboard/screening/caselist']);
      this.screeningService.caseFlagType = this.common.PREQCCASE;
      // this.screeningService.preQcflag = true;
    }
  }
  // getRaiseInsufficiencyScreeningCount() {
  //   this.screeningService.getRaiseInsufficiencyScreeningCount(this.userData.userId).subscribe(resp => {
  //     if (resp) {
  //       this.insufficiencyRaisedCount = resp;
  //     }
  //   });
  // }
  getQuickLinkCondition() {
    // remove cam
    // ((this.userData.teamName === 'CRTIndia' ||
    //     this.userData.teamName === 'CRTTechMahindra' || this.userData.teamName === 'CRTAbroad') &&
    //     this.userData.teamLeadFlag === true)
    // ||
    // this.userData.subTeamName === 'CRTCAMTeam'
    const isCtsFlag = (this.userData.deptName !== null && this.userData.deptName.includes('CTS')) ? true : false;
    const bool = (((this.userData.teamName === 'EmploymentIndia' || this.userData.teamName === 'EmploymentAbroad' ||
      this.userData.teamName === 'EmploymentTechM' || this.userData.teamName === 'EducationTeam' ||
      this.userData.teamName === 'EducationOverseas' || this.userData.teamName === 'AddressTeam' ||
      this.userData.teamName === 'CriminalTeam' || this.userData.teamName === 'IdentityTeam' || this.userData.teamName === 'CTS-AddressTeam' || this.userData.teamName === 'CTS-EducationTeam' || this.userData.teamName === 'CTS-EmploymentTeam' || this.userData.teamName === 'CTS-IdentityTeam' || this.userData.teamName === 'CTS-CriminalTeam')) ||
      (this.userData.teamName === null)) && this.userData.applicationId === 1 && !isCtsFlag;
    return bool;
  }
  openraiseInsufficiency() {
    if (this.levelOneInsuffRaiseCount > 0) {
      this.screeningService.insuffClear = false;
      this.screeningService.leveloneflag = true;
      this.screeningService.caseFlag = true;
      this.screeningService.caseFlagType = this.common.RAISEDINSUFFICIENCY;
      this.sharedService.emitChengesecDrawer();
      this.router.navigate(['dashboard/screening/insufflist']);
    }
  }
  openraiseInsuffDetails(screeningStatusId: any) {
    this.screeningService.openraiseInsuffDetails(screeningStatusId, this.userData.userId).subscribe(resp => {
      if (resp) {
        this.screeningService.raiseInsufficiencyScreeningDetails = resp;
        this.sharedService.emitChengesecDrawer();
        this.router.navigate(['dashboard/screening/insufflist']);
      }
    });
  }
  openMspcount(count, flag, status) {
    if (count > 0) {
      this.common.agreementapproveFlag = flag;
      this.common.MspApprovestatus = status;
      this.sharedService.emitChengesecDrawer();
      this.router.navigate(['dashboard/client/msp-nrp-FeeApproval']);
    }
  }
  openAgreementApprovalPending(flag, count) {
    if (count > 0) {
      this.common.agreementapproveFlag = flag;
      this.sharedService.emitChengesecDrawer();
      this.router.navigate(['dashboard/client/clientAgreementApproval']);
    }
  }
  openForResearch(count, status) {
    if (count > 0) {
      let type = this.userData.subTeamName;
      this.common.commonFrFlag = status;
      var route;
      // if (this.userData.subTeamName === 'For Research CTS Employment India Team' || this.userData.subTeamName === 'For Research CTS institution India Team') {
      //   route = type === 'For Research CTS Employment India Team' ? 'dashboard/master/empResearch' : 'dashboard/master/insResearch';
      // } else if (this.userData.subTeamName !== 'For Research CTS Employment India Team' && this.userData.subTeamName !== 'For Research CTS institution India Team') {
      //   route = (type === 'ForResearchEmployment' || this.userData.teamName === 'EmploymentIndia' || this.userData.teamName === 'CTS-EmploymentTeam')
      //     ? 'dashboard/master/empResearch' : 'dashboard/master/insResearch';
      // }
      switch (type) {
        case "For Research CTS Employment India Team": {
          route = 'dashboard/master/empResearch/' + status.toLowerCase().replace(/\s/g, '');
          break;
        }
        case "For Research CTS institution India Team": {
          route = 'dashboard/master/insResearch/' + status.toLowerCase().replace(/\s/g, '');
          break;
        }
        default: {
          if (type === 'ForResearchEmployment' ||
            this.userData.teamName === 'EmploymentIndia' ||
            this.userData.teamName === 'CTS-EmploymentTeam' || this.userData.teamName === 'ForResearchEmploymentTeam') {
            route = 'dashboard/master/empResearch/' + status.toLowerCase().replace(/\s/g, '');
          } else {
            route = 'dashboard/master/insResearch/' + status.toLowerCase().replace(/\s/g, '');
          }
          break;
        }

      }
      this.sharedService.emitChengesecDrawer();
      this.router.navigate([route]);
    }
  }
  openForResearchOtherLogin(count, type, status) {
    if (count && count > 0) {
      this.common.commonFrFlag = status;
       // Add camRejection- For (sprint -22) VTS2-2024-CRT-0195
      this.common.camRejection = false;
      this.sharedService.emitChengesecDrawer();
      this.router.navigate(['dashboard/master/' + type + '/' + status.replace(' ', '').toLowerCase()]);
    }
  }
  openVerificationCaseCount(count, type) {
    if (count > 0) {
      this.common.redcaseFlag = false;
      this.common.reassigned = false;
      this.common.verifyOrQcRejected = null;
      this.verificationService.veType = type
      this.common.currentEmp = false
      this.verificationService.assignedOrNotAssigned = type;
      this.sharedService.emitChengesecDrawer();
      this.router.navigate(['dashboard/verification/verification']);
    }
  }
  isForResearchOtherLogin() {
    const adminSenMan = (this.userData.teamName === null || this.userData.teamName === 'SeniorManager') && this.userData.applicationId === 1;
    return adminSenMan || this.isCam();
  }
  isForResearch(userFlag: any) {
    const forRes = (((this.userData.teamName !== 'CRTAbroad' && (this.userData.subTeamName === 'ForResearchEducation' || this.userData.subTeamName === 'For Research CTS Employment India Team' || this.userData.subTeamName === 'For Research CTS institution India Team' || this.userData.subTeamName === 'ForResearchEmployment' || this.userData.teamName === 'ForResearchEducationTeam' || this.userData.teamName === 'ForResearchEmploymentTeam') &&
      (userFlag === true ? this.userData.subTeamLeadFlag === true : true))
      || (this.userData.subTeamName === null && (
        (this.userData.teamName === 'EducationTeam' && (this.userData.teamLeadFlag === true || this.userData.subTeamName === null)) || (this.userData.teamName === 'CTS-EducationTeam' && (this.userData.teamLeadFlag === true || this.userData.subTeamName === null))
        || (this.userData.teamName === 'EmploymentIndia' && (this.userData.teamLeadFlag === true || this.userData.subTeamName === null)) || (this.userData.teamName === 'CTS-EmploymentTeam' && (this.userData.teamLeadFlag === true || this.userData.subTeamName === null))))));
    return forRes;
  }
  isCam() {
    return (((this.userData.teamName === 'CRTIndia' || this.userData.teamName === 'CRTTechMahindra' || this.userData
      .teamName === 'CRTAbroad') && (this.userData.subTeamName === 'CRTCAMTeam' || this.userData.subTeamName === null)) || this.userData.teamName === 'CTS-CRTTeam');
  }
  openQcRejectedVerificationCount() {
    if (this.getComponentQcRejectCount > 0) {
      this.common.commonVeFlag = null;
      this.verificationService.veType = null;
      this.common.currentEmp = false;
      this.common.verifyOrQcRejected = true;
      this.sharedService.emitChengesecDrawer();
      this.common.redcaseFlag = false;
      this.common.reassigned = false;
      // Add camRejection- For (sprint -22) VTS2-2024-CRT-0195
      this.common.camRejection = false;
      this.router.navigate(['dashboard/verification/verification']);
    }
  }
  openNotSentToQc() {
    if (this.notSendToQc > 0) {
      this.common.commonVeFlag = 'notSentToQc';
      this.verificationService.veType = 'notSentToQc'
      this.common.redcaseFlag = false;
      this.common.currentEmp = false;
      this.common.reassigned = false;
      // Add camRejection- For (sprint -22) VTS2-2024-CRT-0195
      this.common.camRejection = false;
      this.sharedService.emitChengesecDrawer();
      this.router.navigate(['dashboard/verification/verification']);
    }
  }
  openToClose() {
    if (this.toClose > 0) {
      this.common.commonVeFlag = 'toClose';
      this.verificationService.veType = 'toClose'
      this.sharedService.emitChengesecDrawer()
      this.common.redcaseFlag = false;
      this.common.reassigned = false;
       // Add camRejection- For (sprint -22) VTS2-2024-CRT-0195
       this.common.camRejection = false;
    }
    this.router.navigate(['dashboard/verification/verification']);
  }
  openAllCases() {
    if (this.allcasecount > 0) {
      this.router.navigate(['dashboard/reports/allcases']);
    }
  }
  openpendingChecks() {
    if (this.pendingChecks > 0) {
      this.common.commonVeFlag = 'pendingChecks';
      this.common.currentEmp = false;
      this.verificationService.veType = 'pendingChecks'
      this.verificationService.assignedOrNotAssigned = null;
      this.sharedService.emitChengesecDrawer();
      this.common.currentEmp = false;
      this.common.verifyOrQcRejected = null;
      this.common.redcaseFlag = false;
      this.common.reassigned = false;
       // Add camRejection- For (sprint -22) VTS2-2024-CRT-0195
       this.common.camRejection = false;
      this.router.navigate(['dashboard/verification/verification']);
    }
  }
  openReassignChecks() {
    if (this.reAssignCaseCnt > 0) {
      this.common.commonVeFlag = 'ReassignChecks';
      this.common.currentEmp = false;
      this.common.reassigned = true;
      this.verificationService.veType = 'ReassignChecks'
      this.verificationService.assignedOrNotAssigned = null;
      this.sharedService.emitChengesecDrawer();
      this.common.currentEmp = false;
      this.common.verifyOrQcRejected = null;
      this.common.redcaseFlag = false;
       // Add camRejection- For (sprint -22) VTS2-2024-CRT-0195
       this.common.camRejection = false;
      this.router.navigate(['dashboard/verification/verification']);
    }
  }
  //Added by megala SRS - VTS2-2024-CRT-0195 
  openCAMRejectionChecks() {
    if (this.camRejectionCnt > 0) {
      this.common.commonVeFlag = 'CamRejection';
      this.common.currentEmp = false;
      this.common.reassigned = false;
      this.common.camRejection = true;   
      this.common.MVCamRjFlag = true;   
      this.verificationService.veType = 'CamRejection';
      this.verificationService.assignedOrNotAssigned = null;
      this.sharedService.emitChengesecDrawer();
      this.common.currentEmp = false;
      this.common.verifyOrQcRejected = null;
      this.common.redcaseFlag = false;
      this.router.navigate(['dashboard/verification/verification']);
    }
  }
  openClosureAdvice() {
    if (this.closureAdviceCnt > 0) {
      this.screeningService.caseFlag = false;
      this.screeningService.caseFlagType = this.common.SUBMISSION;
      this.sharedService.emitChengesecDrawer();
      this.router.navigate(['dashboard/verification/colorCodeApproval']);
    }
  }
   //ended by megala SRS - VTS2-2024-CRT-0195 

  getNormalCountDetails() {
    if (this.normalChecks > 0) {
      this.common.commonVeFlag = 'normalChecks';
      this.common.currentEmp = false;
      this.verificationService.veType = 'normalChecks'
      this.verificationService.assignedOrNotAssigned = null;
      this.sharedService.emitChengesecDrawer();
      this.common.currentEmp = false;
      this.common.verifyOrQcRejected = null;
      this.common.redcaseFlag = false;
      this.common.reassigned = false;
       // Add camRejection- For (sprint -22) VTS2-2024-CRT-0195
       this.common.camRejection = false;
      this.router.navigate(['dashboard/verification/verification']);
    }
  }
  opensinglependingChecks() {
    if (this.singlePendingChecks > 0) {
      this.common.redcaseFlag = false;
      this.common.currentEmp = false;
      this.common.reassigned = false;
      this.verificationService.assignedOrNotAssigned = null;
      this.common.verifyOrQcRejected = null;
       // Add camRejection- For (sprint -22) VTS2-2024-CRT-0195
       this.common.camRejection = false;
      this.common.commonVeFlag = 'singlePendingChecks';
      this.verificationService.veType = 'singlePendingChecks'
      this.sharedService.emitChengesecDrawer();
      this.router.navigate(['dashboard/verification/verification']);
    }
  }
  openmoveToPending() {
    if (this.veReOpenCount > 0) {
      this.common.redcaseFlag = false;
      this.common.reassigned = false;
      this.common.currentEmp = false;
       // Add camRejection- For (sprint -22) VTS2-2024-CRT-0195
       this.common.camRejection = false;
      this.verificationService.assignedOrNotAssigned = null;
      this.common.verifyOrQcRejected = null;
      this.verificationService.filters = 'componentStatusId==' + this.reopenstatus;
      this.common.commonVeFlag = 'reOpenChecks';
      this.verificationService.veType = 'reOpenChecks';
      this.sharedService.emitChengesecDrawer();
      this.router.navigate(['dashboard/verification/verification']);
    }
  }
  openRedCase(count: any) {
    if (count > 0) {
      this.common.redcaseFlag = true;
      this.common.reassigned = false;
      this.common.verifyOrQcRejected = null;
      this.common.currentEmp = false;
       // Add camRejection- For (sprint -22) VTS2-2024-CRT-0195
       this.common.camRejection = false;
      this.sharedService.emitChengesecDrawer();
      this.router.navigate(['dashboard/verification/verification']);
    }
  }
  openCurrentEmployement(count: any) {
    if (count > 0) {
      this.common.redcaseFlag = false;
      this.common.reassigned = false;
      this.common.verifyOrQcRejected = false;
      this.common.currentEmp = true;
      this.common.commonVeFlag = null;
       // Add camRejection- For (sprint -22) VTS2-2024-CRT-0195
       this.common.camRejection = false;
      this.sharedService.emitChengesecDrawer();
      this.router.navigate(['dashboard/verification/verification']);
    }
  }
  openVerificationInsuffRaisedCount() {
    if (this.levelTwoInsuffRaiseCount > 0) {
      this.screeningService.caseFlag = true;
      this.common.currentEmp = false;
      this.screeningService.insuffClear = false;
      this.screeningService.verificationPage = true;
      this.screeningService.leveloneflag = false;
      this.sharedService.emitChengesecDrawer();
      this.router.navigate(['dashboard/screening/insufflist']);
    }
  }
  openinsuffClear() {
    if (this.levelOneInsuffClearCount > 0) {
      this.screeningService.caseFlag = false;
      // this.screeningService.insuffClear = true;
      this.screeningService.caseFlagType = this.common.INSUFFCLEARANCE;
      this.screeningService.verificationPage = false;
      this.screeningService.leveloneflag = true;
      this.sharedService.emitChengesecDrawer();
      this.router.navigate(['dashboard/screening/insufflist']);
    }
  }

  openTatCrossedInsufflist() {
    if (this.TATCrossedInsuffCount > 0) {
      this.screeningService.insuffClear = false;
      this.screeningService.leveloneflag = true;
      this.screeningService.caseFlag = true;
      this.screeningService.caseFlagType = this.common.RAISEDINSUFFICIENCY;
      this.sharedService.emitChengesecDrawer();
      this.router.navigate(['dashboard/screening/tatCrossedinsufflist']);
    }
  }
  openTatCrossedInsufflistLevelTwo() {
    if (this.LevelTwoTATCrossedInsuffCount > 0) {
      this.screeningService.insuffClear = false;
      this.screeningService.leveloneflag = false;
      this.screeningService.caseFlag = true;
      this.screeningService.caseFlagType = this.common.RAISEDINSUFFICIENCY;
      this.sharedService.emitChengesecDrawer();
      this.router.navigate(['dashboard/screening/tatCrossedinsufflist']);
    }
  }
  openVerificationInsuffClearedCount() {
    if (this.levelTwoInsuffClearCount > 0) {
      this.screeningService.caseFlag = false;
      this.screeningService.insuffClear = true;
      this.screeningService.leveloneflag = false;
      this.screeningService.caseFlagType = this.common.INSUFFCLEARANCE;
      this.screeningService.verificationPage = true;
      this.sharedService.emitChengesecDrawer();
      this.router.navigate(['dashboard/screening/insufflist']);
    }
  }
  openTatApprovedCount() {
    if (this.tatApproved > 0) {
      this.common.TatApprovestatus = 'Approved';
      this.sharedService.emitChengesecDrawer();
      this.router.navigate(['dashboard/client/tatApproval']);
    }
  }
  openTatPendingCount() {
    if (this.tatPending > 0) {
      this.common.TatApprovestatus = 'Pending';
      this.sharedService.emitChengesecDrawer();
      this.router.navigate(['dashboard/client/tatApproval']);
    }
  }
  openTatRejectCount() {
    if (this.tatRejected > 0) {
      this.common.TatApprovestatus = 'Rejected';
      this.sharedService.emitChengesecDrawer();
      this.router.navigate(['dashboard/client/tatApproval']);
    }
  }
  openPackagePendingcount() {
    if (this.packFeeReviewCount > 0) {
      this.sharedService.emitChengesecDrawer();
      this.common.approvalType = 'Pending';
      this.router.navigate(['dashboard/client/package-FeeApproval']);
    }
  }
  openPackageApprovedcount() {
    if (this.packFeeApprovedCount > 0) {
      this.sharedService.emitChengesecDrawer();
      this.common.approvalType = 'Approved';
      this.router.navigate(['dashboard/client/package-FeeApproval']);
    }
  }
  toggle(data: any) {
    this.show_dialog = !this.show_dialog;
    if (this.show_dialog) {
      this.showdbfilter = true;
    } else {
      this.showdbfilter = false;
    }
  }
  moveToUrl(e: any) {
    if (e.value > 0) {
      if (this.priorityLookup.some(s => s.lookupName === e.name)) {
        const lookUpId = this.priorityLookup.find(x => x.lookupName === e.name).lookupId;
        this.priorityNavigate(e.value, lookUpId);
        // this.priorityCount.forEach(item => {
        //   if ((item.name === 'normalCount' && e.name === 'Normal') || (item.name === 'verizonCount' && e.name === 'Verizon Priority')
        //     || (item.name === 'clientCmtdCasesCount' && e.name === 'Client Cmtd Cases')
        //     || (item.name === 'highCount' && e.name === 'Delta & High Priority')) {
        //     this.priorityNavigate(item);
        //   }
        // });
      }
      this.dashBoardData.content.forEach(element => { if (element.name === e.name) { this[element.method](element.param); } });
    }
  }
  moveToVerification(e: KeyValPair) {
    if (+(e.value) > 0) {
      this.verificationService.GetDashboardCallBackList(e.name, this.userData.userId, this.userData.teamName).subscribe(res => {
        this.verificationService.verificationSearchData = res;
        this.common.redcaseFlag = false;
        this.common.reassigned = false;
         // Add camRejection- For (sprint -22) VTS2-2024-CRT-0195
       this.common.camRejection = false;
      }, err => { }, () => {
        if (e.name === 'forResearch' && (this.userData.teamName === 'EducationTeam' || this.userData.teamName === 'CTS-EducationTeam')) {
          // this.router.navigateByUrl('/dashboard/master/insResearch');
          this.router.navigateByUrl('/dashboard/verification/verification');
        } else if (e.name === 'forResearch' && (this.userData.teamName === 'EmploymentIndia' || this.userData.teamName === 'CTS-EmploymentTeam')) {
          // this.router.navigateByUrl('/dashboard/master/empResearch');
          this.router.navigateByUrl('/dashboard/verification/verification');
        } else {
          this.router.navigateByUrl('/dashboard/verification/verification');
        }
      });
    }
  }
  moveToPendingChart(count: any) {
    if (count.value > 0) {
      const id = this.screeningStatus.find(x => x.statusName === count.name).screeningStatusId;
      // const data = new VerificationDetFilterVm();
      this.userData.filters = id > 0 ? 'componentStatusId==' + id : '';
      // data.loginUserDetVm = this.userData;
      // data.FilterVm.componentStatus.push(id);
      // data.FilterVm = new FilterVm();
      this.getVerificationSearchDetails(this.userData);
    }
  }
  moveToPendingPieChart(event: any) {
    if (event.name === 'Closed Checks' && event.value > 0) {
      this.getVerificationClosedDetails();
    } else if (event.name === 'To Close' && event.value > 0) {
      this.openToClose();
    } else if (event.name === 'Qc Rejected' && event.value > 0) {
      this.openQcRejectedVerificationCount();
    } else if (event.name === 'Not Sent to Qc' && event.value > 0) {
      this.openNotSentToQc();
    } else if (event.value > 0) {
      const screeningStatusId = this.screeningStatus.find(x => x.statusName === event.name).screeningStatusId;
      // const data = new VerificationDetFilterVm();
      this.userData.filters = screeningStatusId > 0 ? 'componentStatusId==' + screeningStatusId : '';
      // data.loginUserDetVm = this.userData;
      // data.FilterVm.componentStatus.push(screeningStatusId);
      // data.FilterVm = new FilterVm();
      this.getVerificationSearchDetails(this.userData);
    }
  }
  moveToPending(count: any) {
    if (count.createUserId > 0) {
      // const data = new VerificationDetFilterVm();
      this.verificationService.filters = count.screeningStatusId > 0 ? 'componentStatusId==' + count.screeningStatusId : '';
      // data.loginUserDetVm = this.userData;
      // data.FilterVm.componentStatus.push(count.screeningStatusId);
      // data.FilterVm = new FilterVm();
      this.common.currentEmp = false;
      this.common.commonVeFlag = 'reOpenChecks';
      this.verificationService.veType = 'reOpenChecks';
      this.common.redcaseFlag = false;
      this.common.reassigned = false;
       // Add camRejection- For (sprint -22) VTS2-2024-CRT-0195
       this.common.camRejection = false;
      this.router.navigateByUrl('/dashboard/verification/verification');
      // this.getVerificationSearchDetails(this.userData);
    }
  }
  getVerificationSearchDetails(data: any) {
    this.verificationService.getVerificationSearchDetails(data).subscribe(res => {
      if (res) {
        if (this.userData.applicationId === 2) {
          this.verificationService.verificationSearchData = res.clientVerificationDet === null ? [] : res.clientVerificationDet;
        } else {
          this.verificationService.verificationSearchData = res.verificationDet === null ? [] : res.verificationDet;
        }
        if (this.verificationService.verificationSearchData.length > 0) {
          this.common.redcaseFlag = false;
          this.common.reassigned = false;
           // Add camRejection- For (sprint -22) VTS2-2024-CRT-0195
       this.common.camRejection = false;
          this.router.navigateByUrl('/dashboard/verification/verification');
        }
      }
    });
  }
  priorityNavigate(count, lookUpId) {
    if (count > 0) {
      // let lookUpName = ''; let lookUpId = 0;
      // if (event.name === 'highCount') { lookUpName = 'High'; }
      // if (event.name === 'verizonCount') { lookUpName = 'Verizon'; }
      // if (event.name === 'normalCount') { lookUpName = 'Normal'; }
      // if (lookUpName) { lookUpId = this.getLookUpId(lookUpName); }
      // if (event.name === 'responsePending') { lookUpId = 0; }
      // this.getPriorityVm = new GetPriorityVm();
      // this.getPriorityVm.FilterVm = new FilterVm();
      // this.getPriorityVm.FilterVm.priority.push(lookUpId);
      this.verificationService.filters = lookUpId > 0 ? 'priorityLookUpId==' + lookUpId : '';
      // this.getPriorityVm.loginUserDetVm = this.userData;
      // tslint:disable-next-line: prefer-const
      this.common.commonVeFlag = 'reOpenChecks';
      this.verificationService.veType = 'reOpenChecks'
      this.common.redcaseFlag = false;
      this.common.reassigned = false;
       // Add camRejection- For (sprint -22) VTS2-2024-CRT-0195
       this.common.camRejection = false;
      this.router.navigateByUrl('/dashboard/verification/verification');
      // this.getVerificationSearchDetails(this.userData);
    }
  }
  casePriorityNavigate(count, lookUpId) {
    if (count > 0) {
      this.verificationService.casePriorityLookupId = lookUpId;
      this.router.navigateByUrl('/dashboard/verification/clientCases');
    }
  }
  casesNavigate(count, flag) {
    if (count > 0) {
      // this.verificationService.allCasesListForClient.clientVerificationDet = flag === true ? this.verificationService.allCasesListForClient.
      // clientVerificationDet.filter(x => !x.caseStatus) : this.verificationService.allCasesListForClient.clientVerificationDet.filter(x =>
      // x.caseStatus && x.caseStatus.toLowerCase() === 'completed');
      this.verificationService.commonCasesFlag = flag;
      this.router.navigateByUrl('/dashboard/verification/clientCases');
    }
  }
  SubmittedCasesNavigate(count, flag) {
    if (count > 0) {      
      this.verificationService.commonCasesFlag = false;
      this.userData.submittedCaseDetFlag = flag;
      sessionStorage.setItem('user_data', JSON.stringify(this.userData));
      this.router.navigateByUrl('/dashboard/verification/clientCases');
    }
  }
  goToCaseHistory(count, flag) {
    if (count > 0) {
      this.common.commonHistoryflag = flag;
      this.router.navigateByUrl('/dashboard/case/casehistory');
    }
  }
  getdashboardcnwise(insfFlag, veFlag, qcFlag, caseFlag, caseHistoryFlag) {
    this.verificationAssignedCaseCount = 0;
    this.verificationNotAssignedCaseCount = 0;
    this.subcheckVerificationCount = 0;
    this.pendingStatusValueChart = [];
    if (insfFlag) {
      this.common.insuffCountFlag = true;
      this.common.VeCountFlag = false;
      this.common.qcCountFlag = false;
      this.common.caseFlag = false;
      this.common.caseHistoryFlag = false;
      //this.getDashboardCount(false, true, false, false);
      this.getAllDashboardCount(false, true, false, false, false);
    } else if (veFlag) {
      this.common.insuffCountFlag = false;
      this.common.VeCountFlag = true;
      this.common.qcCountFlag = false;
      this.common.caseFlag = false;
      this.common.caseHistoryFlag = false;
      //this.getDashboardCount(false, false, true, false);
      this.getAllDashboardCount(false, false, true, false, false);
    } else if (qcFlag) {
      this.common.insuffCountFlag = false;
      this.common.VeCountFlag = false;
      this.common.qcCountFlag = true;
      this.common.caseFlag = false;
      this.common.caseHistoryFlag = false;
      //this.getDashboardCount(false, false, false, true);
      this.getAllDashboardCount(false, false, false, true);
    }
    else if (caseFlag) {
      this.common.insuffCountFlag = false;
      this.common.VeCountFlag = false;
      this.common.qcCountFlag = false;
      this.common.caseFlag = true;
      this.common.caseHistoryFlag = false;
      //this.getDashboardCount(true, false, false, false);
      this.getAllDashboardCount(true, false, false, false, false);
    }
    else if (caseHistoryFlag) {
      this.common.insuffCountFlag = false;
      this.common.VeCountFlag = false;
      this.common.qcCountFlag = false;
      this.common.caseFlag = false;
      this.common.caseHistoryFlag = true;
      this.getAllDashboardCount(false, false, false, false, true);
    }

  }
  GetClientCommentCases() {
    if (this.getClientCommentCaseCount > 0) {
      const getPriorityVm = new VerificationDetFilterVm();
      getPriorityVm.loginUserDetVm = this.userData;
      this.verificationService.GetClientCommentCases(getPriorityVm).subscribe(res => {
        if (res) {
          if (this.userData.applicationId === 2) {
            this.verificationService.verificationSearchData = res.clientVerificationDet === null ? [] : res.clientVerificationDet;
          } else {
            this.verificationService.verificationSearchData = res.verificationDet === null ? [] : res.verificationDet;
          }
          if (this.verificationService.verificationSearchData.length > 0) {
            this.common.redcaseFlag = false;
            this.common.reassigned = false;
             // Add camRejection- For (sprint -22) VTS2-2024-CRT-0195
       this.common.camRejection = false;
            this.router.navigateByUrl('/dashboard/verification/verification');
          }
        }
      });
    }
  }
  caseviFlag() {
    const adminSenMan = (this.userData.teamName !== 'AddressTeam' && this.userData.teamName !== 'EmploymentTechM' &&
      this.userData.teamName !== 'CriminalTeam' &&
      this.userData.teamName !== 'IdentityTeam' && this.userData.teamName !== 'CTS-AddressTeam' && this.userData.teamName !== 'CTS-IdentityTeam' && this.userData.teamName !== 'CTS-CriminalTeam' && this.userData.teamName !== 'QCTeam' && this.userData.teamName !== 'CTS-QCTeam' && this.userData.teamName !== 'TechMQCTeam' && this.userData.teamName !== 'InternationalQCTeam')
    return adminSenMan;
  }
  // dashboard count functionality - By Naveen - Start
  caseHistoryviFlag() {
    const adminSenMan = (this.userData.teamName !== 'AddressTeam' && this.userData.teamName !== 'DEPre-QC' &&
      this.userData.teamName !== 'CriminalTeam' && this.userData.teamName !== 'EducationTeam' && this.userData.teamName !== 'EmploymentIndia' && this.userData.teamName !== 'CRTIndia' && this.userData.teamName !== 'CTS-CRTTeam' &&
      this.userData.teamName !== 'IdentityTeam' && this.userData.teamName !== 'CTS-EducationTeam' && this.userData.teamName !== 'CTS-EmploynammentIndia' && this.userData.teamName !== 'CTS-AddressTeam' && this.userData.teamName !== 'CTS-IdentityTeam' && this.userData.teamName !== 'CTS-CriminalTeam' && this.userData.teamName !== 'QCTeam' && this.userData.teamName !== 'CTS-QCTeam' && this.userData.teamName !== 'TechMQCTeam' &&
      this.userData.teamName !== 'CRTAbroad' && this.userData.teamName !== 'CRTTechMahindra' && this.userData.teamName !== 'EmploymentAbroad' && this.userData.teamName !== 'CTS-EmploymentTeam' && this.userData.teamName !== 'EducationOverseas' && this.userData.teamName !== 'ForResearchEducationTeam' && this.userData.teamName !== 'ForResearchEmploymentTeam' && this.userData.teamName !== 'InternationalQCTeam' && this.userData.teamName !== 'EmploymentTechM' && this.userData.applicationId !== 2)
    return adminSenMan;
  }
  // dashboard count functionality - By Naveen - End
  veCountFlag() {
    const adminSenMan = (this.userData.teamName !== 'InternationalDataEntry' && this.userData.teamName !== 'TechMDataEntry' && this.userData.teamName !== 'DataEntry' && this.userData.teamName !== 'DEPre-QC' && this.userData.teamName !== 'CTS-SubmissionTeam' && this.userData.subTeamName !== 'CRTCaseCreation' && this.userData.teamName !== 'QCTeam' && this.userData.teamName !== 'CTS-QCTeam' && this.userData.teamName !== 'ManagingDirector' && this.userData.teamName !== 'TechMQCTeam' && this.userData.teamName !== 'InternationalQCTeam')
    return adminSenMan;

  }
  inCountFlag() {
    const adminSenMan = (this.userData.teamName !== 'QCTeam' && this.userData.teamName !== 'CTS-QCTeam' && this.userData.subTeamName !== 'CRTCaseCreation' && this.userData.teamName !== 'ApprovalManager' && this.userData.teamName !== 'ManagingDirector' && this.userData.teamName !== 'TechMQCTeam' && this.userData.teamName !== 'InternationalQCTeam')
    return adminSenMan;

  }
  getLookUpId(name): number {
    return this.priorityLookup.filter(e => e.lookupName === name)[0].lookupId;
  }

  getColorForStatus(data: any) {
    const list: any[] = [];
    if (data) {
      data.forEach(element => {
        if (element.name.toLowerCase() === 'open') {
          list.push('#3a3af3'); // blue
        } else if (element.name.toLowerCase() === 'wip') {
          list.push('#f3f305'); // yellow
        } else if (element.name.toLowerCase() === 'completed') {
          list.push('#008000'); // green
        } else if (element.name.toLowerCase() === 'insufficiency') {
          list.push('#ff8100'); // orange
        }
      });
    }
    return { domain: list };
  }
  // Chart Test

  colorScheme = {
    domain: [
      '#bf8809b0', '#e937e4', '#33691E', '#097bbe', '#bf8809b0', '#E91E63',
      '#455A64', '#B71C1C', '#D500F9', '#FF4081', '#536DFE', '#795548',
      '#20AA57', '#689F38', '#009688', '#9C27B0', '#FFCA28', '#757575',
      '#4A148C', '#7C4DFF', '#33691E', '#8D6E63', '#FF1744', '#E53935',
    ]
  };

  // data goes here
  // tslint:disable-next-line: member-ordering
  public single = [
    {
      key: 'DSSI',
      value: 1250055
    },
    {
      key: 'ACG',
      value: 1126000
    },
    {
      key: 'Infosys',
      value: 296215
    },
    {
      key: 'CTS',
      value: 257363
    },
    {
      key: 'TCS',
      value: 196750
    },
    {
      key: 'IBM',
      value: 204617
    }
  ];

  // tslint:disable-next-line:member-ordering
  public linechart = [
    {
      "name": "DSSI",
      "series": [
        {
          "value": 4844,
          "name": "2016"
        },
        {
          "value": 6313,
          "name": "2017"
        },
        {
          "value": 6387,
          "name": "2018"
        },
        {
          "value": 4564,
          "name": "2019"
        },
        {
          "value": 2973,
          "name": "2020"
        }
      ]
    },
    {
      "name": "ACG",
      "series": [
        {
          "value": 5634,
          "name": "2016"
        },
        {
          "value": 4754,
          "name": "2017"
        },
        {
          "value": 6871,
          "name": "2018"
        },
        {
          "value": 2209,
          "name": "2019"
        },
        {
          "value": 5621,
          "name": "2020"
        }
      ]
    },
    {
      "name": "CTS",
      "series": [
        {
          "value": 3832,
          "name": "2016"
        },
        {
          "value": 6725,
          "name": "2017"
        },
        {
          "value": 6186,
          "name": "2018"
        },
        {
          "value": 2843,
          "name": "2019"
        },
        {
          "value": 4232,
          "name": "2020"
        }
      ]
    },
    {
      "name": "Infosys",
      "series": [
        {
          "value": 1211,
          "name": "2016"
        },
        {
          "value": 2323,
          "name": "2017"
        },
        {
          "value": 4343,
          "name": "2018"
        },
        {
          "value": 5445,
          "name": "2019"
        },
        {
          "value": 5533,
          "name": "2020"
        }
      ]
    },
    {
      "name": "IBM",
      "series": [
        {
          "value": 1211,
          "name": "2016"
        },
        {
          "value": 2323,
          "name": "2017"
        },
        {
          "value": 4343,
          "name": "2018"
        },
        {
          "value": 5445,
          "name": "2019"
        },
        {
          "value": 5533,
          "name": "2020"
        }
      ]
    }
  ];

  getAsKeyVal(value): KeyValPair[] {
    if (value) {
      return Object.entries(value).map(([name, value]) => ({ name, value })) as any;
    }

  }
  sumofOb(obj: any) {
    if (obj) {
      return Object.keys(obj).reduce((sum, key) => sum + parseFloat(obj[key] || 0), 0);
    }
  }

}

class KeyValPair {
  name: string;
  value: number;
}
class dashBoardChart {
  header: string; content: { value: number; name: string; method: string; param?; param1?; }[];
}
// class GetPriorityVm {
//   priorityLookupId: number;
//   loginUserDetVm: any;
// }
// class PendingDashBoardDetailVm {
//   statusName: string;
//   loginUserDetVm: any;
// }
