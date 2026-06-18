import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  HostListener,
  TemplateRef,
  OnDestroy,
  ElementRef,
  ChangeDetectorRef,
} from "@angular/core";
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
  UntypedFormBuilder,
  UntypedFormArray,
} from "@angular/forms";
import { SubmissionService } from '../../common-methods/services/submission.service';
import { BreadcrumbFlags } from "src/app/common-methods/models/breadcrumb-flags";
import { CommonService } from "src/app/common-methods/services/common.service";
import { ScreeningService } from "../../common-methods/services/screening.service";
import { ClientAppScreeningComponentComponent } from "./client-app-screening-component/client-app-screening-component.component";
import { ClientAppClientDetailsComponent } from "./client-app-client-details/client-app-client-details.component";
import { Router } from "@angular/router";

import {
  ScreeningDetails,
  ScreeningComponent,
  ScreeningDocument,
  ScreeningInsufficiency,
  PreQCRejectVm,
} from "src/app/common-methods/models/screening-details";
import { SharedService } from "src/app/common-methods/services/shared.service";
// import {  MatDialog } from "@angular/material";
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { CommonAlertsComponent } from "src/app/common-methods/common-alerts/common-alerts.component";
import { AuthService } from "src/app/common-methods/services/auth.service";
import { MessageService } from "primeng/api";
import { CommonAddress } from "src/app/common-methods/models/common-address";
import { QualityCheckService } from "src/app/common-methods/services/quality-check.service";
import { User } from "src/app/common-methods/models/user";
import { VerificationService } from "src/app/common-methods/services/verification.service";
import { ScrollToErrorDirective } from "src/app/common-methods/directive/scroll-to-error.directive";
import { InvoiceService } from "src/app/common-methods/services/invoice.service";
import { DatePipe } from "@angular/common";
import { timer } from "rxjs";
import { MasterService } from "src/app/common-methods/services/master.service";
import { FSCandidateClientVm, FSClientDetailsVm } from 'src/app/common-methods/models/screening-detail';
import { AutomationService } from "src/app/common-methods/services/automation.service";

@Component({
  standalone: false,
  selector: 'app-client-app-submission',
  templateUrl: './client-app-submission.component.html',
  styleUrls: ['./client-app-submission.component.css']
})
export class ClientAppSubmissionComponent
  implements OnInit, AfterViewInit, OnDestroy {
  CurData: any;
  eduFlag: boolean = false;
  nxtFlag: boolean = false;
  @ViewChild(ClientAppClientDetailsComponent)
  viewClient: ClientAppClientDetailsComponent;
  previousTab: number = 0;
  pendingCnt: number = 0;
  finalPopupFlag: boolean = false;
  multicaseFlag: boolean = false;
  snFlag = false;
  stepperFlag = false;
  empFresherFlag: boolean = false;
  addressposFlag = false;
  fresherFlag = false;
  screeningId: any;
  compData = {
    isSubComp: null,
    subCompId: null,
    onInit: true,
    compName: "",
  };
  @ViewChild("alertTemplate", { static: true }) alertTemplate: TemplateRef<any>;
  checkList: any[] = [];
  screenRespFlag = false;
  downloadflag: any;
  TodayDate: any;
  extractedDate = new Date();
  btnDownLoad = false;
  data: any;
  lastFlag: any;
  pdfname: any;
  isLinear = false;
  step1 = 0;
  fileSubmission: UntypedFormGroup;
  componentForm: UntypedFormGroup;
  breadcrumbFlags = new BreadcrumbFlags();
  screeningDetails = new ScreeningDetails();
  screeningReviewDetails = new ScreeningDetails();
  screeningDetails1 = new ScreeningDetails();
  candidateDetails = new FSCandidateClientVm();
  candidateDetails1 = new FSCandidateClientVm();
  clientDetails = new FSClientDetailsVm();
  screeningComponent: ScreeningComponent[];
  screeningDocument: ScreeningDocument[] = [];
  bindScreeningDocument: ScreeningDocument[] = [];
  preQCRejectVm = new PreQCRejectVm();
  routePath = "Screening / Clients File Submission / File Submission";
  price = 0;
  userData = new User();
  clientList: any[] = [];
  clientComponents: any[] = [];
  clientVendors: any[] = [];
  rejectedCommentsList: any[] = [];
  caseNo: any;
  caseSubmissionList: any;
  showGrid = false;
  applicationId = 0;
  editFlag = false;
  popHide = true;
  Address: any;
  paymenFlag: any;
  compLength: any;
  paymentKey: any;
  @ViewChild("drawer", { static: true }) drawer: MatSidenav;
  @ViewChild("downloadData", { static: true }) downloadData: TemplateRef<any>;
  @ViewChild("generalIns", { static: true }) generalIns: TemplateRef<any>;
  @ViewChild("canGeneralIns", { static: true }) canGeneralIns: TemplateRef<any>;
  @ViewChild(ClientAppScreeningComponentComponent)
  viewScreeningComp: ClientAppScreeningComponentComponent;
  @ViewChild("dlgReject", { static: true }) dlgReject: TemplateRef<any>;
  @ViewChild("cancelOrder", { static: true }) cancelOrder: TemplateRef<any>;
  flag = false;
  isdashboard = false;
  rejectComments = new UntypedFormControl("", Validators.required);
  cancelReason = new UntypedFormControl("", Validators.required);
  screenningCompList: any[] = [];
  color: string;
  btnApprove: boolean;
  tipsFlag = true;
  singleCompReject: boolean;
  btnlabel = "Save";
  screeningCompId = 0;
  miscDataForm: UntypedFormArray;
  compAddress: any;
  componentName = "education";
  compBaseDetails: any;
  pdfType = "";
  tabIndex = 0;
  stepHiddenFlag = true;
  manualFilesubmissionRE = false;
  compSplRemarks = "";
  gapYears: any[] = [];
  changeCom;
  comstep = 0;
  statusgetFlag: boolean = false;
  previewStep = false;
  nxtstep = true;
  stperFlag = false;
  @ViewChild("viewInvoice", { static: true }) viewInvoice: TemplateRef<any>;
  @ViewChild("pdf", { static: true }) pdf: any;
  demo1TabIndex = 0;
  constructor(
    public common: CommonService,
    public submissionService: SubmissionService,
    public master: MasterService,
    public screeningService: ScreeningService,
    private fb: UntypedFormBuilder,
    private scroll: ScrollToErrorDirective,
    private authService: AuthService,
    private shared: SharedService,
    private dialog: MatDialog,
    private router: Router,
    private invoice: InvoiceService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    public datePipe: DatePipe,
    private QcService: QualityCheckService,
    public verification: VerificationService,
    public automation :AutomationService
  ) { }
  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem("user_data"));
    this.screeningService.StatusDeFlag === true;
    window.scroll(0, 0);
    this.statusgetFlag = true;
    this.caseNo = this.screeningService.screenCaseId;
    this.applicationId = this.userData.applicationId;
    this.breadcrumbFlags.btnBack = false;
    this.pdfType = this.authService.getpdfType("pdfType");
    this.shared.emitChengesecDrawer();
    this.initFormGroup();
    if (this.caseNo > 0) {
      this.downloadflag = true;
      this.TodayDate = this.extractedDate;
    }

    if (this.applicationId !== 3) {
      if (this.caseNo > 0) {
        this.isdashboard = true;
        this.breadcrumbFlags.btnBack = true;
        //this.breadcrumbFlags.btnSave = true;
        this.breadcrumbFlags.btnReset = true;
        this.getCandidateDetails(this.caseNo);
        if (
          this.screeningService.caseFlag === true ||
          this.screeningService.caseFlagType === this.common.PREQCREJECT
        ) {
          this.btnApprove = false;
          //this.breadcrumbFlags.btnSave = true;
        } else {
          this.btnApprove = true;
          this.breadcrumbFlags.btnSave = false;
        }
        this.manualFilesubmissionRE = false;
      } else if (this.screeningService.screeningCompId > 0) {
        this.showFileSubmission(this.screeningService.screeningCompId);
      } else if (
        this.screeningService.caseFlagType === this.common.QCREJECT ||
        this.screeningService.caseFlagType === this.common.INSUFFCLEARANCE
      ) {
        this.showGrid = false;
        this.showFileSubmission(this.screeningService.screeningCompId);
      } else if (this.screeningService.caseFlagType === this.common.NEWCASE) {
        this.breadcrumbFlags.btnBack = true;
        //this.breadcrumbFlags.btnSave = true;
        this.showGrid = false;
        this.manualFilesubmissionRE = false;
      } else {
        this.isdashboard = true;
        this.showGrid = false;
        //this.breadcrumbFlags.btnSave = true;
        this.screeningService.caseFlag = false;
        this.screeningService.caseFlagType = this.common.NEWCASE;
        this.manualFilesubmissionRE = false;
        this.initFormGroup();
      }
    }
    this.getCandidateComplist();
    this.GetcommonDetail();
  }

  saveCanSubmission() {
    this.stepperFlag = true;
    if (this.fileSubmission.get('candidate')?.valid) {
      this.saveCandidateSubmission();
    } else {
      this.fileSubmission.get('candidate')?.markAllAsTouched();
    }
  }

  getGapReason(data: any) {
    this.CurData = data;
    this.submissionService.getGapReasonDetail(this.fileSubmission.get('candidate.screeningId')?.value).subscribe(resp => {
      if (resp) {
        this.bindGapDetail(resp)
      }
    });
  }
  bindGapDetail(resp: any) {
    this.screeningService.gapReason  = [];
    resp.gapReasonTypeVms = resp.gapReasonTypeVms ? resp.gapReasonTypeVms : [];

    const gapreasonForm = this.fileSubmission.get("gapReason") as UntypedFormArray;
    if (gapreasonForm.controls.length > 0) {
      while (gapreasonForm.controls.length !== 0) {
        gapreasonForm.removeAt(0);
      }
    }
    this.screeningDetails1.gapReason = resp.screeningGapReasonVms;
    this.screeningService.gapReason = resp.gapReasonTypeVms;

    this.screeningService.gapReason.forEach((element) => {
      const gapFormArray = this.fileSubmission.get("gapReason") as UntypedFormArray;
      gapFormArray.push(this.initGapReasonForm(element));
    });
    if (
      this.screeningDetails1.gapReason &&
      this.screeningDetails1.gapReason.length > 0 && this.screeningService.caseFlagType === this.common.PREQCCASE) {
      const frmarr = this.fileSubmission.get("gapReason") as UntypedFormArray;

      if (this.screeningDetails1.gapReason.length > 0) {
        for (let i = 0; frmarr.controls.length > i; i++) {
          const gapreason = frmarr.controls[i] as UntypedFormGroup;
          if (this.screeningDetails1.gapReason[i]) {
            this.createDocForm(
              gapreason.get("reasonDoument") as UntypedFormArray,
              this.screeningDetails1.gapReason[i].reasonDoument
            );
            gapreason
              .get("screeningId")
              .setValue(this.fileSubmission.get('candidate.screeningId')?.value);

          }
        }
      }
      frmarr.patchValue(this.screeningDetails1.gapReason);
    }
  }
  saveCandidateSubmission() {
    this.candidateDetails = this.fileSubmission.get('candidate')?.value;
    if (this.candidateDetails.dob != null) {
      const date = this.datePipe.transform(this.candidateDetails.dob, 'yyyy-MM-dd');
      this.candidateDetails.dob = date;
    }
    this.candidateDetails.loginUserId = this.userData.userId;
    const formData = new FormData();

    for (let i = 0; i < this.candidateDetails.document.length; i++) {
      if (this.candidateDetails.document[i].fileName) {
        formData.append(
          "ScreeningDocument_" + i,
          this.candidateDetails.document[i].document
        );
      }
    }
    formData.append('CandidateInfo', JSON.stringify(this.candidateDetails));

    this.submissionService.saveCandidateClientDetails(formData).subscribe(resp => {
      if (resp) {
        if (resp.success == true) {
          this.showNotification('success', 'Success Message', 'Save Successfully');
          this.screeningService.screeningId = resp.value;
          this.fileSubmission.get('candidate.screeningId')?.setValue(resp.value);
          this.getClientDetails();
        }
      }
    });

  }

  saveClientSubmission() {
    this.clientDetails = this.fileSubmission.get('screening')?.value;
    const formData = new FormData();
    this.clientDetails.screeningId = this.fileSubmission.get('candidate.screeningId')?.value > 0 ? this.fileSubmission.get('candidate.screeningId')?.value : this.screeningService.screeningId;
    this.clientDetails.caseNo = this.caseNo;
    this.clientDetails.applicationId = this.userData.applicationId;

    this.submissionService.addClientDetails(this.clientDetails).subscribe(resp => {
      if (resp) {
        if (resp) {
          this.showNotification('success', 'Success Message', 'Save Successfully');
          if (this.nxtFlag == true) {
            this.step1 = 2;
            this.stepperChange(this.step1);
          }
        }
      }
    });

  }
  bindCaseDetail(resp: any) {

  }
  saveScreenSubmission() {
    this.stepperFlag = true;
    if (this.fileSubmission.get('candidate')?.valid) {
      this.screeningDetails = this.fileSubmission.getRawValue();
      const formData = new FormData();

      formData.append('ScreeningDetails', JSON.stringify(this.screeningDetails));
      if (this.screeningService.caseFlag === true || this.screeningService.caseFlagType === this.common.INSUFFCLEARANCE || this.screeningService.caseFlagType === this.common.FRREJECT || this.screeningService.caseFlagType === this.common.VEREJECT) {
        this.screeningService.addScreeningDetails(formData).subscribe(resp => {
          if (resp) {
            this.bindCaseDetail(resp);
          }
        });
      }
    } else {
      this.fileSubmission.get('candidate')?.markAllAsTouched();
    }
  }

  openGeneralIns() {
    this.dialog.open(this.generalIns, { width: "700px", disableClose: true });
  }
  opendownload() {
    this.dialog.open(this.downloadData, { width: "1000", disableClose: true });
  }
  openCandidateGeneralIns() {
    this.dialog.open(this.canGeneralIns, {
      width: "700px",
      disableClose: true,
    });
  }
  dialogClose() {
    this.dialog.closeAll();
  }
  getCompId(event: any) {
    if (
      this.caseSubmissionList &&
      this.caseSubmissionList.screeningCaseComponent
    ) {
      this.compSplRemarks = "";
      const component = this.caseSubmissionList.screeningCaseComponent.find(
        (x) => x.compId === event
      );
      this.componentName = component.compName;
      if (component.subCompFlag) {
        component.screeningSubComponent.forEach((f) => {
          this.compSplRemarks =
            this.compSplRemarks +
            "<b>" +
            f.subCompName +
            " </b><br>" +
            f.remarks +
            "<br><br>";
          this.drawerToggle();
        });
      } else {
        this.compSplRemarks = component.remarks;
        this.drawerToggle();
      }
    }
  }
  showFileSubmission(screeningCompId: any) {
    setTimeout(() => {
      this.goToStep(0, 'nxt');
    }, 0);
    this.screeningService
      .getScreeningComponentEntryDetails(screeningCompId, this.userData.userId)
      .subscribe((resp) => {
        if (resp) {
          this.common.Socialcompid = resp.screeningCaseComponent[0].compId;
          this.common.instatusId =
            resp[0].component[0].screeningComponentInfo.eduEmpScreenStatusId;
          if (
            resp[0].component &&
            resp[0].component[0].screeningComponentInfo
              .caseByPassFlag === true
          ) {
            resp.screening.component = resp.screeningCaseComponent[0].compId;
            if (resp.screeningCaseComponent[0].subCompFlag) {
            }
            resp.screening.component = resp.screeningCaseComponent[0].compId;

            this.manualFilesubmissionRE = true;
          } else {
            this.manualFilesubmissionRE = false;
          }
          this.initFormGroup();
          //  this.bindCaseDetail(resp);
          this.showGrid = false;
          this.breadcrumbFlags.btnBack = true;
          if (!(this.screeningService.caseFlagType === this.common.QCREJECT)) {
            //this.breadcrumbFlags.btnSave = true;
          }
          this.breadcrumbFlags.btnReset = true;
          this.btnApprove = false;
        }
      });
  }
  getCandidateComplist() {
    const clist = JSON.parse(
      JSON.stringify(this.screeningService.componentList)
    );

    if (this.screeningService.caseFlagType === this.common.NEWCASE) {
      this.stepHiddenFlag = clist.length > 0 ? true : false;

    }
  }
  backToList() {
    this.breadcrumbFlags.btnBack = false;
    this.breadcrumbFlags.btnSave = false;
    this.breadcrumbFlags.btnReset = false;
    this.btnApprove = false;
    if (this.screeningService.caseFlagType === this.common.NEWCASE) {
      this.router.navigate(["dashboard/home"]);
    } else if (
      this.isdashboard ||
      this.screeningService.caseFlagType === this.common.QCREJECT ||
      this.screeningService.caseFlagType === this.common.FRREJECT ||
      this.screeningService.caseFlagType === this.common.VEREJECT ||
      this.screeningService.caseFlagType === this.common.REOPEN
    ) {
      this.router.navigate(["dashboard/screening/caselist"]);
    } else if (
      this.screeningService.screeningCompId > 0 &&
      this.screeningService.insuffClear
    ) {
      this.router.navigate(["dashboard/home"]);
    } else if (
      this.screeningService.caseFlagType === this.common.INSUFFCLEARANCE
    ) {
      this.router.navigate(["dashboard/screening/insufflist"]);
    } else {
      this.showGrid = !this.showGrid;
    }
  }
  getAssignedCaseDetails(caseNo: any) {
    this.screeningService
      .getScreeningCaseDetails(
        caseNo,
        this.userData.userId,
        this.userData.applicationId
      )
      .subscribe((resp) => {
        if (resp) {
          this.screeningService.Dedata = resp;
          if (
            this.screeningService.caseFlagType === this.common.PREQCCASE &&
            !resp.invitationFlag
          ) {
            resp.screeningCaseComponent = resp.screeningCaseComponent.sort(
              (a, b) => {
                return b.deqcFlag - a.deqcFlag;
              }
            );
            resp = resp.sort((a, b) => {
              return b.criminalCheckCount - a.criminalCheckCount;
            });
          }
          this.bindCaseDetail(resp);
          if (this.snFlag == true) {
            const tets = this.viewScreeningComp.selectedComponent;
            const compList = this.screeningService.componentList;
            let noofComp = 0;
            const comindex = compList.findIndex(
              (f) => f.compName.toUpperCase() === tets.compName.toUpperCase()
            );
            const selectedChecks = compList.find(
              (f) => f.compName.toUpperCase() === tets.compName.toUpperCase()
            );
            if (selectedChecks.subCompFlag && this.applicationId != 3) {
              noofComp =
                this.screeningService.compData.screeningSubComponent.length;
            } else {
              noofComp = this.screeningService.compData.noOfComponent;
            }

            this.screenRespFlag = true;

            const type = compList[comindex].compName.toUpperCase();
            const formgroup = this.viewScreeningComp.getformGroup(
              type,
              this.viewScreeningComp.currentCompTabIndex
            ) as UntypedFormGroup;
            const docForm = formgroup.get(
              "screeningComponentInfo.componentDocument"
            ) as UntypedFormControl;
            if (
              type.toLowerCase() === this.common.EMPLOYMENT_HR.toLowerCase()
            ) {
              this.fresherFlag = formgroup.get("compRef.fresherFlag").value;
            }

            const indexc = this.viewScreeningComp.currentCompTabIndex;
            if (noofComp <= indexc + 1) {
              const index = comindex;
              const indexs = index + 1;

              if (
                this.screeningService.componentList[
                  this.screeningService.componentList.length - 1
                ].compName === compList[index].compName &&
                noofComp === indexc + 1
              ) {
                if (
                  this.applicationId !== 3 &&
                  this.screeningService.caseFlagType !== this.common.NEWCASE &&
                  !this.manualFilesubmissionRE
                ) {
                  this.goToStep(this.step1 + 1, 'nxt');
                } else if (

                  this.screeningService.caseFlagType === this.common.NEWCASE ||
                  this.manualFilesubmissionRE
                ) {
                  this.goToStepcan(this.step1 + 1, "next");
                }
              } else {
                this.viewScreeningComp.getComponentForm(
                  compList[index + 1],
                  indexs
                );
                this.viewScreeningComp.getformGroup(type, indexs) as UntypedFormGroup;
              }

              this.popHide = false;
            } else if (noofComp > indexc + 1) {
              const index = comindex;
              const indexs = index + 1;

              this.viewScreeningComp.demo1TabIndex++;
            }

            window.scroll({ top: 0, left: 0, behavior: "smooth" });
            this.snFlag = false;
          }
        }
      });
  }

  getstatus(value: any) {
    if (this.screeningService.StatusDeFlag === true) {
      this.master.GetCountryList().subscribe((res) => {
        if (res) {
          this.common.countryList = Object.assign([], res);
          this.screeningService.countryList = Object.assign([], res);
        }
      });
      this.statusgetFlag = false;
      this.master.GetStatesList(0).subscribe((res) => {
        if (res) {
          this.common.stateList = Object.assign([], res);
        }
      });
      this.master.GetDistrictList(0).subscribe((res) => {
        if (res) {
          this.common.districtList = Object.assign([], res);
        }
      });

      const eduflag = value.filter(
        (f) => f.compName.toLowerCase() === "education"
      );
      const eduInpflag = value.filter(
        (f) =>
          f.compName.toLowerCase() === this.common.EDUCATION_INTERNATIONAL.toLowerCase()
      );
      if (eduflag.length > 0 || eduInpflag.length > 0) {
        this.GetInstitutioInfo();
        this.GetInstituteInfo();
        this.getDegreeLkpList();
        this.getUniversity();
        this.GetNotProvidedReasonList();
        this.common.getEducationType();
        this.master.GetClientbyId(this.screeningService.clientId).subscribe((res: any) => {
          if (res) {
            this.screeningService.eduCatflag = res.removeEducationCategoryFlag;
            this.screeningService.instypflag = res.removeInstitutionTypeFlag;
          }
        });
        this.screeningService.StatusDeFlag = false;
      }
      const empflag = value.filter(
        (f) =>
          f.compName.toLowerCase() === this.common.EMPLOYMENT_HR.toLowerCase()
      );
      const empInflag = value.filter(
        (f) =>
          f.compName.toLowerCase() === this.common.EMPLOYMENT_INTERNATIONAL.toLowerCase()
      );
      const empcflag = value.filter(
        (f) =>
          f.compName.toLowerCase() === this.common.CURRENT_EMPLOYMENT_HR.toLowerCase()
      );
      const emppflag = value.filter(
        (f) =>
          f.compName.toLowerCase() === this.common.PREVIOUS_EMPLOYMENT_HR.toLowerCase()
      );
      const gapreason = this.screeningService.componentList.filter(
        (f) => f.compName.toLowerCase() === "gap reason");
      if ((empflag.length > 0 || eduflag.length > 0 ||empcflag.length > 0 || emppflag.length > 0) && gapreason.length == 0 && this.screeningService.invitationFlag === true && this.screeningService.caseFlagType === this.common.PREQCCASE) {
        this.screeningService.componentList.push({
          compDesc: "GapReason",
          compId: 0,
          compName: "Gap Reason",
          compType: "",
          componentCustomFields: [],
          criminalCheckCount: 1,
          currencyId: 0,
          cvValidationFields: [],
          deqcFlag: false,
          instruction: "",
          noOfComponent: 1,
          question: [],
          screeningSubComponent: [],
          caseSubComponent: [],
          subCompFlag: false,
          subCompId: 0,
        });

      }
      const data = {
        compName: 'Gap Reason'
      }
      const gapreasond = this.screeningService.componentList.filter(
        (f) => f.compName.toLowerCase() === "gap reason");
      if (this.screeningService.invitationFlag === true && gapreasond.length > 0 && this.screeningService.caseFlagType === this.common.PREQCCASE) {
        this.getGapReason(data);
      }
      if (empflag.length > 0 || empInflag.length > 0 || empcflag.length>0 || emppflag.length>0) {
        this.GetCompanyInfo();
        this.screeningService.StatusDeFlag = false;
      }
      const ndrugFlag = value.filter(
        (f) => f.compName.toLowerCase() === this.common.NDOT_DRUG_SCREEN.toLowerCase()
      );
      const drugFlag = value.filter(
        (f) => f.compName.toLowerCase() === this.common.DRUG_TEST.toLowerCase()
      );
      if (drugFlag.length > 0 || ndrugFlag.length > 0) {
        this.getdrugStatus();
        this.screeningService.StatusDeFlag = false;
      }
      this.screeningService.getScreeningAddressType(this.userData.applicationId).subscribe((res) => {
        if (res) {
          this.screeningService.addressType = Object.assign(
            [],
            res.addressType
          );
          this.screeningService.addressTypelst = Object.assign(
            [],
            res.addressTypeCheck
          );
        }
      });
      const databaseFlag = value.filter( (f) => (f.compName.toLowerCase() === this.common.CRIMINAL_DATABASE.toLowerCase()) || (f.compName.toLowerCase() === this.common.DATABASE_CONDUCT.toLowerCase()) || (f.compName.toLowerCase() === this.common.DATABASE_ADVERSE_MEDIA.toLowerCase()) );
      if (databaseFlag.length > 0) {
        this.getDatabase();
        this.screeningService.StatusDeFlag = false;
      }
    }
  }
  getdrugStatus() {
    this.master.GetDrugKitList().subscribe((resp) => {
      this.screeningService.drugKitList = resp;
    });
  }

  getDatabase() {
    this.screeningService.getDatabaseType().subscribe((res) => {
      this.screeningService.DatabaseType = Object.assign([], res);
    });
  }

  getCandidateDetails(caseNo: any) {
    this.common.dateRestrictionInPOS = false;
    this.btnDownLoad = false;
    this.submissionService.getCandidateClientDetails(caseNo)
      .subscribe((resp) => {
        if (resp) {
          this.screeningService.Dedata = resp;
          this.screeningService.enableNAFlag = resp.enableNAFlag;
          this.screeningService.IqcByPassFlag = resp.iqcByPassFlag;
          this.screeningService.defaultAddressId = resp.defaultAddressId;
          this.screeningService.indianClientFlag = resp.indianClientFlag;
          this.screeningService.screeningId = resp.screeningId;
          this.screeningService.forResearchByPassFlag = resp.forResearchByPassFlag;
          this.screeningService.invitationFlag = resp.invitationFlag;
          this.screeningService.clientId = resp.clientId;
          this.screeningService.clientName = resp.clientName;
          this.screeningService.ClientCategoryId = resp.clientCategoryId;
          this.screeningService.EnableClientDOJ = resp.enableClientDOJ;
          this.screeningService.ctsflag = resp.ctsFlag;
          // tslint:disable-next-line:max-line-length
          this.screeningService.showClientSuspectFlag = !resp.invitationFlag ? resp.showClientSuspectFlag : this.userData.applicationId != 3 ? resp.showClientSuspectFlag : '';
          this.common.manualClientDetails = this.common.CloneObject(resp);
          this.screeningService.enableMutiJcrFlag = resp.enbMultiJCRFlag;            
          // VTS2-2024-CRT-0206 - Need to set condition in period of stay from date field based on DOB - By Naveen        
          this.common.dateRestrictionInPOS = resp.dateRestrictionInPOS;
          this.bindCandidateDetail(resp);
        }

      });
  }

  getSubmissionFile() {

    if (this.step1 == 0) {
      this.getCandidateDetails(this.caseNo);
    } else if (this.step1 == 1) {
      this.getClientDetails();
    } else if (this.step1 == 2) {
      this.getSaveScreeningCompIdDetails(this.CurData);
      this.getComponentDetail();
    }
  }
  mergeIndPackComp(compData: any) {
    const sum: any[] = [];
    let subSum = [];
    let data: any;
    compData.forEach((el) => {
      if (sum.length === 0) {
        if (el.subCompFlag) {
          el.screeningSubComponent.forEach((element) => {
            if (el.compType === "Package") {
              Object.assign(element, { packageCount: element.noOfComponent });
            } else {
              Object.assign(element, {
                individualCount: element.noOfComponent,
              });
            }
          });
        } else {
          if (el.compType === "Package") {
            Object.assign(el, { packageCount: el.noOfComponent });
          } else {
            Object.assign(el, { individualCount: el.noOfComponent });
          }
        }

        sum.push(el);
      } else {
        const get = () => {
          for (let i = 0; i < sum.length; i++) {
            if (sum[i].compId === el.compId) {
              subSum = [];
              if (el.subCompFlag) {
                data = sum[i].screeningSubComponent.concat(
                  el.screeningSubComponent
                );
                data.forEach((x) => {
                  if (subSum.length === 0) {
                    if (x.subCompType === "Package") {
                      Object.assign(x, { packageCount: x.noOfComponent });
                    } else {
                      Object.assign(x, { individualCount: x.noOfComponent });
                    }
                    subSum.push(x);
                  } else {
                    const getSub = () => {
                      // tslint:disable-next-line: prefer-for-of
                      for (let j = 0; j < subSum.length; j++) {
                        if (subSum[j].subCompId === x.subCompId) {
                          return { subCompId: x.subCompId };
                        }
                      }
                    };
                    const subcompId = getSub();
                    if (subcompId && subcompId.subCompId > 0) {
                      const subCompIndex = sum[
                        i
                      ].screeningSubComponent.findIndex(
                        (f) => f.subCompId === subcompId.subCompId
                      );
                      sum[i].screeningSubComponent[
                        subCompIndex
                      ].noOfComponent += x.noOfComponent;
                      if (x.subCompType === "Package") {
                        Object.assign(
                          sum[i].screeningSubComponent[subCompIndex],
                          { packageCount: x.noOfComponent }
                        );
                      } else {
                        Object.assign(
                          sum[i].screeningSubComponent[subCompIndex],
                          { individualCount: x.noOfComponent }
                        );
                      }
                    } else {
                      if (x.subCompType === "Package") {
                        Object.assign(x, { packageCount: x.noOfComponent });
                      } else {
                        Object.assign(x, { individualCount: x.noOfComponent });
                      }
                      subSum.push(x);
                    }
                  }
                });
              } else {
                return { id: i };
              }
              sum[i].screeningSubComponent = subSum;
            } else {
              if (el.subCompFlag) {
                data = el.screeningSubComponent;
                data.forEach((x) => {
                  if (subSum) {
                    if (x.subCompType === "Package") {
                      Object.assign(x, { packageCount: x.noOfComponent });
                    } else {
                      Object.assign(x, { individualCount: x.noOfComponent });
                    }
                  }
                });
              }
            }
          }
        };
        let i = get();
        if (i) {
          sum[i.id].noOfComponent += el.noOfComponent;
          if (el.compType === "Package") {
            Object.assign(sum[i.id], { packageCount: el.noOfComponent });
          } else {
            Object.assign(sum[i.id], { individualCount: el.noOfComponent });
          }
        } else {
          if (sum.filter((x) => x.compId === el.compId).length < 1) {
            if (el.compType === "Package") {
              Object.assign(el, { packageCount: el.noOfComponent });
            } else {
              Object.assign(el, { individualCount: el.noOfComponent });
            }
            sum.push(el);
          }
        }
      }
    });
    return sum;
  }

  bindCandidateDetail(resp: any) {
    this.common.candidateCountryId = resp.countryNameId;
    this.clearFormArray((this.fileSubmission.get('candidate.document') as UntypedFormArray));
    this.common.addressflag = true;
    this.screeningService.gapReason  = [];
    // important
    // if (resp.candidate.companySiteVisitFlag == true) {
    //   this.fileSubmission.get("candidate.genderLookupId").clearValidators();
    // }
    this.caseSubmissionList = resp;
    this.screeningDocument = resp.document;
    this.bindScreeningDocument = this.common.CloneObject(resp.document);
    this.candidateDetails1 = resp;
    this.screeningService.dob = this.candidateDetails1.dob
      ? this.candidateDetails1.dob
      : '';
    this.screeningDetails1.document = resp.document;
    // this.screeningDetails1.candidate.infoceptDocument = resp.infoceptDocument;
    resp.dob = this.datePipe.transform(resp.dob, "dd/MMM/yyyy");
    const docFormGroup = this.fileSubmission.get("candidate.document") as UntypedFormArray;
    this.createDocForm(docFormGroup, this.caseSubmissionList.document);
    const insDocFormGroup = this.fileSubmission.get("candidate.infoceptDocument") as UntypedFormArray;
    this.createDocForm(insDocFormGroup, this.caseSubmissionList.infoceptDocument);
    const caseDocFromGroup = this.fileSubmission.get("candidate.clientBulkCaseDocument") as UntypedFormArray;
    if (this.caseSubmissionList.clientBulkCaseDocument != null && 
    this.caseSubmissionList.clientBulkCaseDocument.length > 0) {
    this.createCaseDocForm(caseDocFromGroup, this.caseSubmissionList.clientBulkCaseDocument);
    }
    this.bindbulkcase();
    this.fileSubmission.patchValue({
      candidate: this.caseSubmissionList,
    });

    this.getComponentDetail();
  }
  getInsuffDoc(compId: any) {
    this.screeningService.getInsuffDocument(compId).subscribe(resp => {
      this.viewScreeningComp.insuffDocArr = this.common.CloneObject(resp);
      this.screeningService.insuffDocList = Object.assign([], resp);
    });
  }
  bindScreeningDetail(resp, compId) {
    // this.screeningService.getdataFlag = false;
    if (this.eduFlag == true) {
      this.eduFlag = false;
      this.GetInstituteInfo();
    }
    this.clientChangeEmit(compId);
    this.common.addressflag = true;
    this.screeningDocument = resp.document;
    this.screeningDetails1.screeningComponent = [];
    if (resp.component == null) {
      resp.component = [];
    }
    this.screeningDetails1.screeningComponent.push(resp);
    if (resp !== null) {
      if (compId === 1 && this.screeningDetails1.screeningComponent[0].component.length >= 1) {
        for (let i = 0; i < this.screeningDetails1.screeningComponent[0].component.length; i++) {
          if (this.screeningDetails1.screeningComponent[0].component[i].compRef.address.addTypeLookName === "Permanent Address") {
            this.screeningService.permnAddress = this.screeningDetails1.screeningComponent[0].component[i].compRef.address;
            if (this.screeningService.permnAddress != undefined && this.screeningService.permnAddress.addressPos != undefined && this.screeningService.permnAddress.addressPos.length > 0) {
              var peradd = {
                addressId: 0,
                addressPosId: 0,
                periodOfStay: this.screeningService.permnAddress.addressPos[0].periodOfStay,
                periodOfStayTo: this.screeningService.permnAddress.addressPos[0].periodOfStayTo,
                reportFlag: false,
                screeningCompId: 0,
                validationString: ["SINCE BIRTH", "TILL DATE"]
              }
              this.screeningService.permnAddress.addressPos[0] = peradd;

            }
          }
        }
      }
    }

    let price = 0;
    this.bindbulkcase();
    this.screeningService.getdataFlag = true;

    const selectComp = this.screeningService.componentList.filter(s => s.compId == compId)
    for (let i = 0; selectComp.length > i; i++) {
      if (this.screeningDetails1.screeningComponent[0].component.length > 0) {
        const frmIndex = this.screeningDetails1.screeningComponent.findIndex(
          (f) => f.compId === compId
        );
        const scrCompfrmArray = this.fileSubmission.get(
          "screeningComponent"
        ) as UntypedFormArray;
        if (frmIndex > -1 && this.screeningDetails1.screeningComponent[0].component.length > 0) {
          const mainfrmGroup = scrCompfrmArray.controls[0] as UntypedFormGroup;
          const compFrmArray = mainfrmGroup.get("component") as UntypedFormArray;
          const compFrmArrayData = compFrmArray.getRawValue();

          this.screeningDetails1.screeningComponent[frmIndex].component.forEach(
            (elememnt, ei) => {
              if (elememnt.compRef) {
                if (elememnt.compRef.fromDate != undefined && elememnt.compRef.fromDate.toString().toLowerCase().replace(/\s+/g, '') != 'notprovided' && elememnt.compRef.fromDate != null) {
                  elememnt.compRef.fromDate = elememnt.compRef.fromDate.toString().toLowerCase().replace(/\s+/g, '') == 'tilldate' ? elememnt.compRef.fromDate : this.datePipe.transform(elememnt.compRef.fromDate, 'dd/MMM/yyyy');  elememnt.compRef.fromDate = elememnt.compRef.fromDate.toUpperCase();               
                }
                if (elememnt.compRef.toDate != undefined && elememnt.compRef.toDate.toString().toLowerCase().replace(/\s+/g, '') != 'notprovided' && elememnt.compRef.toDate != null) {
                  elememnt.compRef.toDate = elememnt.compRef.toDate.toString().toLowerCase().replace(/\s+/g, '') == 'tilldate' ? elememnt.compRef.toDate : this.datePipe.transform(elememnt.compRef.toDate, 'dd/MMM/yyyy');                
                  elememnt.compRef.toDate = elememnt.compRef.toDate.toUpperCase();
                }
              }
              if (elememnt.screeningComponentInfo) {
                if (this.screeningService.invitationFlag == true && (this.screeningService.caseFlagType == this.common.PREQCREJECT || this.screeningService.caseFlagType == this.common.PREQCCASE) && (selectComp[0].compName.toUpperCase() == this.common.ADDRESS || selectComp[0].compName.toUpperCase() == this.common.CRIMINAL_CHECK_PCC3E)) {
                  const compinfo = compFrmArray.controls[ei] as UntypedFormGroup;
                  if (compinfo) {
                    compinfo
                      .get("screeningComponentInfo.compIndex")
                      .setValue(elememnt.screeningComponentInfo.compIndex);
                  }
                }
                if (
                  compFrmArrayData &&
                  !compFrmArrayData.some(
                    (s) =>
                      s.screeningComponentInfo.compIndex ===
                      elememnt.screeningComponentInfo.compIndex
                  )
                ) {
                  const compinfo = compFrmArray.controls[ei] as UntypedFormGroup;
                  if (compinfo) {
                    compinfo
                      .get("screeningComponentInfo.compIndex")
                      .setValue(elememnt.screeningComponentInfo.compIndex);
                  }
                }
              }
            }
          );
          const compFrmArrayVal = compFrmArray.value;
          if (selectComp[0].subCompFlag) {
            for (
              let k = 0;
              selectComp[0].screeningSubComponent
                .length > k;
              k++
            ) {
              const indexs: any[] = [];
              let subComp: any[] = [];
              compFrmArrayVal.map((f1, index) => {
                if (
                  f1.screeningComponentInfo.subCompId ===
                  selectComp[0].screeningSubComponent[k]
                    .subCompId
                ) {
                  indexs.push(index);
                }
              });
              subComp = this.screeningDetails1.screeningComponent[
                frmIndex
              ].component.filter(
                (elm) =>
                  elm.screeningComponentInfo.subCompId ===
                  selectComp[0].screeningSubComponent[k]
                    .subCompId
              );

              if (subComp.length > 0) {
                for (let l = 0; subComp.length > l; l++) {
                  //const ind = indexs[l];
				  //Added condition for values binded incorrectly 
                  const subCompdata = subComp[l];
                  let ind = compFrmArrayVal.findIndex(
                    (f) =>
                      f.screeningComponentInfo.compIndex === subCompdata.screeningComponentInfo.compIndex &&
                      f.screeningComponentInfo.subCompId === subCompdata.screeningComponentInfo.subCompId
                  );
                  if (ind === -1) {
                    const fallbackInd = compFrmArrayVal.findIndex(
                      (f) => f.screeningComponentInfo.subCompId === subCompdata.screeningComponentInfo.subCompId
                    );
                    if (fallbackInd === -1) {
                      console.warn("No matching form group found for subCompId:", subCompdata.screeningComponentInfo.subCompId);
                      continue;
                    }
                    ind = fallbackInd;
                  }
                  const compFrmGroup = compFrmArray.controls[ind] as UntypedFormGroup;
                  const scrCompInfo = compFrmGroup.get(
                    "screeningComponentInfo"
                  ) as UntypedFormGroup;
                  const scrInsuff = compFrmGroup.get(
                    "screeningInsufficiency"
                  ) as UntypedFormGroup;
                  const scrcompDoc = compFrmGroup.get(
                    "screeningComponentInfo.componentDocument"
                  ) as UntypedFormArray;
                  //const subCompdata = subComp[l];
                  subCompdata.compRef.screeningCompId = subCompdata
                    .screeningComponentInfo.compId
                    ? subCompdata.screeningComponentInfo.compId
                    : subCompdata.compRef.screeningCompId;
                  if (subCompdata.compRef.screeningCompId !== null) {
                    subCompdata.screeningInsufficiency =
                      subCompdata.screeningInsufficiency === null
                        ? new ScreeningInsufficiency()
                        : subCompdata.screeningInsufficiency;
                    this.createDocForm(
                      scrcompDoc,
                      subCompdata.screeningComponentInfo.componentDocument
                    );
                    scrCompInfo.patchValue({
                      compId: subCompdata.screeningComponentInfo.compId,
                      insuffRaisedFlag:
                        subCompdata.screeningComponentInfo.insuffRaisedFlag,
                      priorityId: subCompdata.screeningComponentInfo.priorityId,
                      ownerId: subCompdata.screeningComponentInfo.ownerId,
                      compInitiationDate: this.compIniDate(subCompdata.screeningComponentInfo.compInitiationDate),
                      reportSource:
                        subCompdata.screeningComponentInfo.reportSource,
                      countryTypeLookUpId:
                        subCompdata.screeningComponentInfo.countryTypeLookUpId,
                      caseTypeLookUpId:
                        subCompdata.screeningComponentInfo.caseTypeLookUpId,
                      screenStatusId:
                        subCompdata.screeningComponentInfo.screenStatusId,
                      screeningCompId:
                        subCompdata.screeningComponentInfo.screeningCompId,
                      screeningId: subCompdata.screeningComponentInfo.screeningId,
                      subCompId: subCompdata.screeningComponentInfo.subCompId,
                      tatDays: subCompdata.screeningComponentInfo.tatDays,
                      deqcFlag: subCompdata.screeningComponentInfo.deqcFlag,
                      vendorId:
                        subCompdata.screeningComponentInfo.vendorId === 0
                          ? null
                          : subCompdata.screeningComponentInfo.vendorId,
                      currencyId: subCompdata.screeningComponentInfo.currencyId,
                      componentDocument:
                        subCompdata.screeningComponentInfo.componentDocument,
                      notApplicableFlag:
                        subCompdata.screeningComponentInfo.notApplicableFlag,
                      remark: subCompdata.screeningComponentInfo.remark,
                      insuffRemark:
                        subCompdata.screeningComponentInfo.insuffRemark,
                      insuffRaiseRemark:
                        subCompdata.screeningComponentInfo.insuffRaiseRemark,
                      invitationFlag: subCompdata.screeningComponentInfo.invitationFlag,
                      qcRejectFlag:
                        subCompdata.screeningComponentInfo.qcRejectFlag,
                      verificationRejectFlag:
                        subCompdata.screeningComponentInfo.verificationRejectFlag,
                      forResearchRejectFlag:
                        subCompdata.screeningComponentInfo.forResearchRejectFlag,
                      clientScreeningId:
                        subCompdata.screeningComponentInfo.clientScreeningId,
                      clientApprovalFlag:
                        subCompdata.screeningComponentInfo.clientApprovalFlag,
                      subCheckFlag: subCompdata.screeningComponentInfo.subCheckFlag
                    });
                    this.initInsufCommentForm(
                      scrInsuff.get("insuffDetail") as UntypedFormArray,
                      subCompdata.screeningInsufficiency.insuffDetail
                        ? subCompdata.screeningInsufficiency.insuffDetail
                        : []
                    );
                    scrInsuff.patchValue({
                      clearedDate: subCompdata.screeningInsufficiency.clearedDate,
                      createdUserId: 0,
                      insuffDetail: subCompdata.screeningInsufficiency
                        .insuffDetail
                        ? subCompdata.screeningInsufficiency.insuffDetail
                        : [],
                      insuffDocument:
                        subCompdata.screeningInsufficiency.insuffDocument,
                      insufficiencyId:
                        subCompdata.screeningInsufficiency.insufficiencyId,
                      levelLookupId:
                        subCompdata.screeningInsufficiency.levelLookupId,
                      raisedDate: subCompdata.screeningInsufficiency.raisedDate,
                      requiredLookupId:
                        subCompdata.screeningInsufficiency.requiredLookupId,
                      screeningCompId:
                        subCompdata.screeningInsufficiency.screeningCompId,
                      screeningStatusId:
                        subCompdata.screeningInsufficiency.screeningStatusId,
                    });
                    if (selectComp[0].compName.toString().toUpperCase() == 'ADDRESS' && this.screeningService.ClientCategoryId == 4) {
                      if (
                        this.screeningDetails1.screeningComponent[frmIndex].component[
                          k
                        ].hasOwnProperty("miscQuestion")
                      ) {
                        if (!compFrmGroup.contains("miscQuestion")) {
                          if (
                            this.screeningDetails1.screeningComponent[frmIndex].component[
                              k
                            ].miscQuestion
                          ) {
                            compFrmGroup.addControl(
                              "miscQuestion",
                              this.common.initMiscForm(
                                this.screeningDetails1.screeningComponent[frmIndex]
                                  .component[k].miscQuestion
                              )
                            );
                          }
                        } else {
                          const miscQues = compFrmGroup.get("miscQuestion") as UntypedFormArray;
                          if (
                            this.screeningDetails1.screeningComponent[frmIndex].component[
                              k
                            ].miscQuestion !== null
                          ) {
                            this.createMiscForm(
                              miscQues,
                              this.screeningDetails1.screeningComponent[frmIndex]
                                .component[k].miscQuestion
                            );
                          }
                        }
                      }
                    }
                    if (subCompdata.compRef.address !== null) {
                      const addressFrmGroup = compFrmGroup.get("compRef") as UntypedFormGroup;
                      const address = addressFrmGroup.get("address0") as UntypedFormGroup;
                      const address1 = addressFrmGroup.get("address") as UntypedFormGroup;
                      //  if (this.addressposFlag) {

                      if (
                        subComp[l].compRef.address != undefined && subCompdata.screeningComponentInfo.notApplicableFlag != true
                      ) {
                        if (subComp[l].compRef.address != undefined) {

                          const addredata = subComp[l].compRef.address[0] != undefined ? subComp[l].compRef.address[0].addressPos :
                            subComp[l].compRef.address.addressPos ? subComp[l].compRef.address.addressPos : 0;
                          if (addredata.length == 0 ||
                            addredata.length == undefined || addredata.length > 0
                          ) {

                            if (address != null) {
                              if (addredata.length > 0) {
                                address.removeControl("addressPos");
                              }

                              address.addControl(
                                "addressPos",
                                this.common.initCliPosForm(
                                  subComp[l].compRef.address[0] != undefined ? subComp[l].compRef.address[0].addressPos : subComp[l].compRef.address.addressPos
                                ))

                            } else if (address1 != null) {
                              if (addredata.length > 0) {
                                address1.removeControl("addressPos");
                              }

                              address1.addControl(
                                "addressPos",
                                this.common.initCliPosForm(
                                  subComp[l].compRef.address[0] != undefined ? subComp[l].compRef.address[0].addressPos : subComp[l].compRef.address.addressPos
                                )
                              )

                            }
                          }

                        }
                        if ((compId == this.common.EMPLOYMENT_HRId ||compId == this.common.CURRENT_EMPLOYMENT_HRId ||compId == this.common.PREVIOUS_EMPLOYMENT_HRId || compId == this.common.EDUCATIONId) && subCompdata.compRef.isVerified == false) {
                          addressFrmGroup.addControl('isClientSuspectFlag', new UntypedFormControl())
                        }
                        compFrmGroup.patchValue({
                          active: false,
                          compRef: subCompdata.screeningComponentInfo.notApplicableFlag != true ? subCompdata.compRef : [],
                          submittedFlag: subCompdata.submittedFlag,
                          preQCApproveFlag: subCompdata.preQCApproveFlag,
                          preQCRejectFlag: subCompdata.preQCRejectFlag,
                          rejectComments: subCompdata.rejectComments,
                          qcRejectComments: subCompdata.qcRejectComments,
                          addedByCandidateFlag: subCompdata.addedByCandidateFlag,
                          componentCustomFields: subCompdata.componentCustomFields,
                        });

                        //compFrmGroup = compFrmGroup;
                        // let ssnCompRef = addressFrmGroup.get('dob');
                        // if (ssnCompRef.value != null) {
                        //   ssnCompRef.setValue(this.datePipe.transform(ssnCompRef.value, 'dd/MMM/yyyy'))
                        // }
                        let ssnCompRef = addressFrmGroup.get('dob') as UntypedFormControl;
                        if (subCompdata.compRef.dob && subCompdata.compRef.dob != null) {
                          ssnCompRef.setValue((this.datePipe.transform(new Date(subCompdata.compRef.dob), 'dd/MMM/yyyy')))
                        }
                        let nationCompRef = addressFrmGroup.get('dateOfBirth') as UntypedFormControl;
                        if (subCompdata.compRef.dateOfBirth && subCompdata.compRef.dateOfBirth != null) {
                          nationCompRef.setValue(this.datePipe.transform(new Date(subCompdata.compRef.dateOfBirth), 'dd/MMM/yyyy'))
                        }

                      }
                    }
                  }
                }
              }
            }
          } else {
            for (
              let j = 0;
              this.screeningDetails1.screeningComponent[frmIndex].component
                .length > j;
              j++
            ) {

              let compIndex = j;

              if (this.componentName.toUpperCase() == this.common.BANK_STATEMENT) {
                if (this.screeningDetails1.screeningComponent[frmIndex].component[j].compRef.statementFrom != null) {
                  this.screeningDetails1.screeningComponent[frmIndex].component[j].compRef.statementFrom = this.common.getTimezoneOffset(this.screeningDetails1.screeningComponent[frmIndex].component[j].compRef.statementFrom, false);
                }
                if (this.screeningDetails1.screeningComponent[frmIndex].component[j].compRef.statementTo != null) {
                  this.screeningDetails1.screeningComponent[frmIndex].component[j].compRef.statementTo = this.common.getTimezoneOffset(this.screeningDetails1.screeningComponent[frmIndex].component[j].compRef.statementTo, false);
                }
              }
              if (
                this.screeningDetails1.screeningComponent[frmIndex].component
                  .length > 0
              ) {
                if (
                  this.screeningDetails1.screeningComponent[frmIndex].component[j]
                    .screeningComponentInfo
                ) {
                  const compind =
                    this.screeningDetails1.screeningComponent[frmIndex].component[
                      j
                    ].screeningComponentInfo.compIndex;
                  compIndex = compFrmArrayVal.findIndex(
                    (f) => f.screeningComponentInfo.compIndex === compind
                  );
                }
              }

              const compFrmGroup = compFrmArray.controls[compIndex] as UntypedFormGroup;
              const addressFrmGroup = compFrmGroup.get("compRef") as UntypedFormGroup;
              const address = addressFrmGroup.get("address0") as UntypedFormGroup;
              const address1 = addressFrmGroup.get("address") as UntypedFormGroup;
              const scrCompInfo = compFrmGroup.get(
                "screeningComponentInfo"
              ) as UntypedFormGroup;
              const scrInsuff = compFrmGroup.get(
                "screeningInsufficiency"
              ) as UntypedFormGroup;
              if (
                this.screeningDetails1.screeningComponent[frmIndex].component[
                  j
                ].hasOwnProperty("miscQuestion")
              ) {
                if (!compFrmGroup.contains("miscQuestion")) {
                  if (
                    this.screeningDetails1.screeningComponent[frmIndex].component[
                      j
                    ].miscQuestion
                  ) {
                    compFrmGroup.addControl(
                      "miscQuestion",
                      this.common.initMiscForm(
                        this.screeningDetails1.screeningComponent[frmIndex]
                          .component[j].miscQuestion
                      )
                    );
                  }
                } else {
                  const miscQues = compFrmGroup.get("miscQuestion") as UntypedFormArray;
                  if (
                    this.screeningDetails1.screeningComponent[frmIndex].component[
                      j
                    ].miscQuestion !== null
                  ) {
                    this.createMiscForm(
                      miscQues,
                      this.screeningDetails1.screeningComponent[frmIndex]
                        .component[j].miscQuestion
                    );
                  }
                }
              }
              ;
              if (this.componentName.toUpperCase() == this.common.JUDIS_COURT_RECORD) {
                if (this.screeningDetails1.screeningComponent[frmIndex].component[j].compRef.jCRCourctDetailsVm != undefined && this.screeningDetails1.screeningComponent[frmIndex].component[j].compRef.jCRCourctDetailsVm != null) {
                  const judisFrmGroup = compFrmGroup.get("compRef") as UntypedFormGroup;
                  const judisCourtrcd = this.screeningDetails1.screeningComponent[frmIndex].component[j].compRef.jCRCourctDetailsVm;
                  if (judisFrmGroup != null) {
                    judisFrmGroup.removeControl("jCRCourctDetailsVm")
                  }
                  judisFrmGroup.addControl("jCRCourctDetailsVm", this.common.initCourtForm(this.screeningDetails1.screeningComponent[frmIndex].component[j].compRef.jCRCourctDetailsVm))
                }
              }
              if (
                this.screeningDetails1.screeningComponent[frmIndex].component[j].screeningComponentInfo.notApplicableFlag != true && this.screeningDetails1.screeningComponent[frmIndex].component[j].compRef.address != undefined
              ) {
                if (this.screeningDetails1.screeningComponent[frmIndex].component[j].compRef.address != undefined) {

                  const addredata = this.screeningDetails1.screeningComponent[frmIndex].component[j].compRef.address[0] != undefined ? this.screeningDetails1.screeningComponent[frmIndex].component[j].compRef.address[0].addressPos :
                    this.screeningDetails1.screeningComponent[frmIndex].component[j].compRef.address.addressPos ? this.screeningDetails1.screeningComponent[frmIndex].component[j].compRef.address.addressPos : 0;
                  if (addredata.length == 0 ||
                    addredata.length == undefined || addredata.length > 0
                  ) {
                    if (address != null) {
                      if (addredata.length > 0) {
                        address.removeControl("addressPos");
                      }
                      address.addControl(
                        "addressPos",
                        this.common.initCliPosForm(
                          this.screeningDetails1.screeningComponent[frmIndex]
                            .component[j].compRef.address[0] != undefined ? this.screeningDetails1.screeningComponent[frmIndex]
                              .component[j].compRef.address[0].addressPos : this.screeningDetails1.screeningComponent[frmIndex]
                                .component[j].compRef.address.addressPos
                        ))
                    } else if (address1 != null) {
                      if (addredata.length > 0) {
                        address1.removeControl("addressPos");
                      }
                      address1.addControl(
                        "addressPos",
                        this.common.initCliPosForm(
                          this.screeningDetails1.screeningComponent[frmIndex]
                            .component[j].compRef.address[0] != undefined ? this.screeningDetails1.screeningComponent[frmIndex]
                              .component[j].compRef.address[0].addressPos : this.screeningDetails1.screeningComponent[frmIndex]
                                .component[j].compRef.address.addressPos
                        )
                      )
                    }
                  }
                }
              }
              if (this.componentName.toUpperCase() == this.common.GAP_VERIFICATION && this.screeningService.ClientCategoryId == 4 && this.screeningDetails1.screeningComponent[frmIndex].component[j].gapDetails.length > 0) {
                compFrmGroup.removeControl("gapDetails")
                compFrmGroup.addControl("gapDetails", this.common.initGapVeriForm(this.screeningDetails1.screeningComponent[frmIndex].component[j].gapDetails))
              }

              const scrcompDoc = compFrmGroup.get(
                "screeningComponentInfo.componentDocument"
              ) as UntypedFormArray;
              if (
                this.screeningDetails1.screeningComponent[frmIndex].component[j]
                  .screeningComponentInfo
              ) {
                const screeningComponentInfo =
                  this.screeningDetails1.screeningComponent[frmIndex].component[j]
                    .screeningComponentInfo;
                let screeningInsufficiency =
                  this.screeningDetails1.screeningComponent[frmIndex].component[j]
                    .screeningInsufficiency;
                this.createDocForm(
                  scrcompDoc,
                  screeningComponentInfo.componentDocument
                );
                screeningInsufficiency =
                  screeningInsufficiency === null
                    ? new ScreeningInsufficiency()
                    : screeningInsufficiency;
                scrCompInfo.patchValue({
                  compId: screeningComponentInfo.compId,
                  insuffRaisedFlag: screeningComponentInfo.insuffRaisedFlag,
                  priorityId: screeningComponentInfo.priorityId,
                  ownerId: screeningComponentInfo.ownerId,
                  countryTypeLookUpId: screeningComponentInfo.countryTypeLookUpId,
                  compInitiationDate: this.compIniDate(screeningComponentInfo.compInitiationDate),
                  reportSource: screeningComponentInfo.reportSource,
                  caseTypeLookUpId: screeningComponentInfo.caseTypeLookUpId,
                  screenStatusId: screeningComponentInfo.screenStatusId,
                  screeningStatusId: screeningComponentInfo.screeningStatusId,
                  screeningCompId: screeningComponentInfo.screeningCompId,
                  screeningId: screeningComponentInfo.screeningId,
                  subCompId: screeningComponentInfo.subCompId,
                  tatDays: screeningComponentInfo.tatDays,
                  deqcFlag: screeningComponentInfo.deqcFlag,
                  vendorId:
                    screeningComponentInfo.vendorId === 0
                      ? null
                      : screeningComponentInfo.vendorId,
                  currencyId: screeningComponentInfo.currencyId,
                  componentDocument: screeningComponentInfo.componentDocument,
                  notApplicableFlag: screeningComponentInfo.notApplicableFlag,
                  remark: screeningComponentInfo.remark,
                  insuffRemark: screeningComponentInfo.insuffRemark,
                  insuffRaiseRemark: screeningComponentInfo.insuffRaiseRemark,
                  invitationFlag: screeningComponentInfo.invitationFlag,
                  qcRejectFlag: screeningComponentInfo.qcRejectFlag,
                  verificationRejectFlag:
                    screeningComponentInfo.verificationRejectFlag,
                  forResearchRejectFlag:
                    screeningComponentInfo.forResearchRejectFlag,
                  clientScreeningId: screeningComponentInfo.clientScreeningId,
                  clientApprovalFlag: screeningComponentInfo.clientApprovalFlag,
                  reOpenFlag: screeningComponentInfo.reOpenFlag,
                  subCheckFlag: screeningComponentInfo.subCheckFlag,
                  verificationModeId: screeningComponentInfo.verificationModeId,
                dateOfVerification: screeningComponentInfo.dateOfVerification,
                });
                this.initInsufCommentForm(
                  scrInsuff.get("insuffDetail") as UntypedFormArray,
                  screeningInsufficiency.insuffDetail
                    ? screeningInsufficiency.insuffDetail
                    : []
                );
                scrInsuff.patchValue({
                  clearedDate: screeningInsufficiency.clearedDate,
                  createdUserId: 0,
                  insuffDetail: screeningInsufficiency.insuffDetail
                    ? screeningInsufficiency.insuffDetail
                    : [],
                  insuffDocument: screeningInsufficiency.insuffDocument,
                  insufficiencyId: screeningInsufficiency.insufficiencyId,
                  levelLookupId: screeningInsufficiency.levelLookupId,
                  raisedDate: screeningInsufficiency.raisedDate,
                  requiredLookupId: screeningInsufficiency.requiredLookupId,
                  screeningCompId: screeningInsufficiency.screeningCompId,
                  screeningStatusId: screeningInsufficiency.screeningStatusId,
                });
                if (this.screeningDetails1.screeningComponent[frmIndex].component[j].screeningComponentInfo.notApplicableFlag != true &&
                  this.screeningDetails1.screeningComponent[frmIndex].component[j]
                    .compRef.address === null
                ) {
                  this.screeningDetails1.screeningComponent[frmIndex].component[
                    j
                  ].compRef.address = "";
                }
                if ((compId == this.common.EMPLOYMENT_HRId ||compId == this.common.CURRENT_EMPLOYMENT_HRId ||compId == this.common.PREVIOUS_EMPLOYMENT_HRId || compId == this.common.EDUCATIONId) && this.screeningDetails1.screeningComponent[frmIndex].component[j].compRef.isVerified == false) {
                  addressFrmGroup.addControl('isClientSuspectFlag', new UntypedFormControl())
                }
                compFrmGroup.patchValue({
                  active: false,
                  compRef: this.screeningDetails1.screeningComponent[frmIndex].component[j].screeningComponentInfo.notApplicableFlag != true ?
                    this.screeningDetails1.screeningComponent[frmIndex].component[
                      j
                    ].compRef : [],

                  submittedFlag:
                    this.screeningDetails1.screeningComponent[frmIndex].component[
                      j
                    ].submittedFlag,
                  preQCApproveFlag:
                    this.screeningDetails1.screeningComponent[frmIndex].component[
                      j
                    ].preQCApproveFlag,
                  preQCRejectFlag:
                    this.screeningDetails1.screeningComponent[frmIndex].component[
                      j
                    ].preQCRejectFlag,
                  rejectComments:
                    this.screeningDetails1.screeningComponent[frmIndex].component[
                      j
                    ].rejectComments,
                  qcRejectComments:
                    this.screeningDetails1.screeningComponent[frmIndex].component[
                      j
                    ].qcRejectComments,
                  addedByCandidateFlag:
                    this.screeningDetails1.screeningComponent[frmIndex].component[
                      j
                    ].addedByCandidateFlag,
                  componentCustomFields:
                    this.screeningDetails1.screeningComponent[frmIndex].component[
                      j
                    ].componentCustomFields,
                  periodOfStayAddress: this.screeningDetails1.screeningComponent[
                    frmIndex
                  ].component[j].periodOfStayAddress
                    ? this.screeningDetails1.screeningComponent[frmIndex]
                      .component[j].periodOfStayAddress
                    : [],
                });
                // if(this.fileSubmission..hasError())
                let ssnCompRefdob = addressFrmGroup.get('dob') as UntypedFormControl;
                if (this.screeningDetails1.screeningComponent[frmIndex].component[j].screeningComponentInfo.notApplicableFlag != true && this.screeningDetails1.screeningComponent[frmIndex].component[j].compRef.dob && this.screeningDetails1.screeningComponent[frmIndex].component[j].compRef.dob != null) {
                  ssnCompRefdob.setValue((this.datePipe.transform(new Date(ssnCompRefdob.value), 'dd/MMM/yyyy')))
                }
                let nationCompRef = addressFrmGroup.get('dateOfBirth') as UntypedFormControl;
                if (this.screeningDetails1.screeningComponent[frmIndex].component[j].screeningComponentInfo.notApplicableFlag != true && this.screeningDetails1.screeningComponent[frmIndex].component[j].compRef.dateOfBirth && this.screeningDetails1.screeningComponent[frmIndex].component[j].compRef.dateOfBirth != null) {
                  nationCompRef.setValue(this.datePipe.transform(new Date(this.screeningDetails1.screeningComponent[frmIndex].component[j].compRef.dateOfBirth), 'dd/MMM/yyyy'))
                }
              } else {
                compFrmGroup["controls"]["compRef"]["controls"][
                  "screeningCompId"
                ].setValue(
                  this.screeningDetails1.screeningComponent[frmIndex].component[j]
                    .compRef.screeningCompId
                );
                compFrmGroup["controls"]["compRef"]["controls"][
                  "screeningEmployeeId"
                ].setValue(
                  this.screeningDetails1.screeningComponent[frmIndex].component[j]
                    .compRef.screeningEmployeeId
                );
                compFrmGroup["controls"]["compRef"]["controls"][
                  "fresherFlag"
                ].setValue(
                  this.screeningDetails1.screeningComponent[frmIndex].component[j]
                    .compRef.fresherFlag
                );
                compFrmGroup["controls"]["active"].setValue(
                  this.screeningDetails1.screeningComponent[frmIndex].component[j]
                    .active
                );
                compFrmGroup["controls"]["submittedFlag"].setValue(
                  this.screeningDetails1.screeningComponent[frmIndex].component[j]
                    .submittedFlag
                );
                compFrmGroup["controls"]["preQCApproveFlag"].setValue(
                  this.screeningDetails1.screeningComponent[frmIndex].component[j]
                    .preQCApproveFlag
                );
                compFrmGroup["controls"]["preQCRejectFlag"].setValue(
                  this.screeningDetails1.screeningComponent[frmIndex].component[j]
                    .preQCRejectFlag
                );
                compFrmGroup["controls"]["screeningComponentInfo"]["controls"][
                  "screeningCompId"
                ].setValue(
                  this.screeningDetails1.screeningComponent[frmIndex].component[j]
                    .compRef.screeningCompId
                );
              }
              if (
                this.screeningDetails1.screeningComponent[frmIndex]
                  .criminalCheckCount > 0
              ) {
                const count =
                  this.screeningDetails1.screeningComponent[frmIndex]
                    .criminalCheckCount;
                for (let c = 0; count > c; c++) {
                  const criminaForm = compFrmGroup.get(
                    "compRef.address" + c
                  ) as UntypedFormGroup;
                  if (this.screeningDetails1.screeningComponent[frmIndex].component[j].screeningComponentInfo.notApplicableFlag != true) {
                    const addres =
                      this.screeningDetails1.screeningComponent[frmIndex].component[
                        j
                      ].compRef.address;
                    if (criminaForm && addres) {

                      if (addres[c]) {
                        criminaForm.patchValue({
                          addressId: addres[c].addressId,
                          addLine1: addres[c].addLine1,
                          addLine2: addres[c].addLine2,
                          addLine3: addres[c].addLine3,
                          city: addres[c].city,
                          cityId: addres[c].cityId,
                          district: addres[c].district,
                          districtId: addres[c].districtId,
                          state: addres[c].state,
                          stateId: addres[c].stateId,
                          country: addres[c].country,
                          countryId: addres[c].countryId,
                          postalCode: addres[c].postalCode,
                          place: addres[c].place,
                          addressPos: addres[c].addressPos,
                          locationId: addres[c].locationId,
                          periodOfStay: addres[c].periodOfStay,
                          addressTypeLookupId: addres[c].addressTypeLookupId,
                          addressType: addres[c].addressType,
                        });
                      }
                    }
                  }
                }
              }
              if (
                this.screeningDetails1.screeningComponent[frmIndex].compId === 13
              ) {
                const selectComp = this.screeningService.componentList.filter(s => s.compId == this.screeningDetails1.screeningComponent[frmIndex].compId)
                compFrmGroup.removeControl("compRefDetail");
                compFrmGroup.addControl(
                  "compRefDetail",
                  this.initcvValidation(
                    (this.screeningDetails1.screeningComponent[frmIndex].component[j
                    ].compRef.length == 0) ? selectComp[0].cvValidationFields : this.screeningDetails1.screeningComponent[frmIndex].component[
                      j
                    ].compRef
                  )
                );
                this.createCvValidationForm(
                  compFrmGroup.get("compRefDetail") as UntypedFormGroup,
                  (this.screeningDetails1.screeningComponent[frmIndex].component[j
                  ].compRef.length == 0) ? selectComp[0].cvValidationFields : this.screeningDetails1.screeningComponent[frmIndex].component[
                    j
                  ].compRef,
                  true
                );
              }
            }
          }
        }
      }
      if (compId == this.common.EMPLOYMENT_HRId || compId ==  this.common.CURRENT_EMPLOYMENT_HRId) {
        this.screeningService.fresherFlag = this.screeningDetails1.screeningComponent[0].component.length > 0 ? this.screeningDetails1.screeningComponent[0].component[0]
          .compRef.fresherFlag : false
      } else {
        this.screeningService.fresherFlag == false;
      }
      this.screeningService.getdataFlag = true;

      if (
        this.screeningDetails1.gapReason &&
        this.screeningDetails1.gapReason.length > 0 &&
        (this.screeningService.caseFlagType === this.common.PREQCCASE ||
          this.userData.applicationId === 3)
      ) {
        const frmarr = this.fileSubmission.get("gapReason") as UntypedFormArray;

        if (this.screeningDetails1.gapReason.length > 0) {
          for (let i = 0; frmarr.controls.length > i; i++) {
            const gapreason = frmarr.controls[i] as UntypedFormGroup;
            if (this.screeningDetails1.gapReason[i]) {
              this.createDocForm(
                gapreason.get("reasonDoument") as UntypedFormArray,
                this.screeningDetails1.gapReason[i].reasonDoument
              );
              gapreason
                .get("screeningId")
                .setValue(this.screeningService.screeningId);
            }
          }
        }
      }
    }
    if (this.common.statuscFlag == true) {
      this.getInsuffDoc(compId);
    }
    setTimeout(() => {

      this.formEnableDisable();
    }, 0);
    this.screeningService.formFlag = true;
    this.screeningService.caseSubmissionList = this.fileSubmission.getRawValue();
  }
  compIniDate(date: any) {
    let compDate;
    if (this.screeningService.invitationFlag == true) {
      if (date == null) {
        compDate = new Date();
      } else {
        compDate = this.common.getTimezoneOffset(date, false);
      }
    } else {
      if (date == null) {
        compDate = new Date()
      } else {
        compDate = this.common.getTimezoneOffset(date, false)
      }
    }
    return compDate
  }
  bindbulkcase() {
    if (this.screeningDetails1.bulkCaseFlag) {
      const compFormarray = this.fileSubmission.get(
        "screeningComponent"
      ) as UntypedFormArray;
      if (
        this.screeningService.componentList.some(
          (s) => s.compName.toUpperCase() === this.common.EMPLOYMENT_HR
        )
      ) {
        const index = this.screeningService.componentList.findIndex(
          (fi) => fi.compName.toUpperCase() === this.common.EMPLOYMENT_HR
        );
        if (index > -1) {
          const empformgroup = compFormarray.controls[index] as UntypedFormGroup;
          const emparray = empformgroup.get("component") as UntypedFormArray;
        }
      }
    }
  }
  initFormGroup() {
    this.fileSubmission = this.fb.group({
      loggedIn: new UntypedFormControl(this.userData.userId),
      applicantId: new UntypedFormControl(this.applicationId),
      candidate: this.initCandidateForm(),
      screening: this.initClientDetailForm(),
      screeningComponent: new UntypedFormArray([]),

      qcRejectFlag: new UntypedFormControl(false),
      preQCRejectApproveFlag: new UntypedFormControl(false),
      invitationFlag: new UntypedFormControl(false),
      ctsFlag: new UntypedFormControl(false),
      verificationRejectFlag: new UntypedFormControl(
        this.screeningService.caseFlagType === this.common.VEREJECT
          ? true
          : false
      ),
      forResearchRejectFlag: new UntypedFormControl(
        this.screeningService.caseFlagType === this.common.FRREJECT
          ? true
          : false
      ),
      gapReason: new UntypedFormArray([]),
      bulkCaseFlag: new UntypedFormControl(false),
      educationDet: new UntypedFormControl([]),
      employerDet: new UntypedFormControl([]),
      gapReasonType: new UntypedFormControl([]),
    });
  }
  initCommonFormGroup(
    isSubComp,
    comptype,
    compId,
    subCompId,
    criminalCheckCount,
    deqcFlag: boolean,
    addedByCandidateFlag: boolean,
    currencyId,
    countryId,
    priorityId,
    compIndex,
    subCheckFlag,
    compInitiationDate
  ): UntypedFormGroup {
    return new UntypedFormGroup({
      active: new UntypedFormControl(false),
      loginId: new UntypedFormControl(this.userData.userId),
      applicantId: new UntypedFormControl(this.userData.applicationId),
      preQCApproveFlag: new UntypedFormControl(false),
      preQCRejectFlag: new UntypedFormControl(false),
      submittedFlag: new UntypedFormControl(false),
      compType: new UntypedFormControl(comptype),
      screeningComponentInfo: this.initComponentForm(
        compId,
        subCompId,
        deqcFlag,
        currencyId,
        countryId,
        priorityId,
        compIndex,
        subCheckFlag,
        compInitiationDate
      ),
      screeningInsufficiency: this.initInsufficiencyForm(compId, subCompId),
      rejectComments: new UntypedFormControl(""),
      qcRejectComments: new UntypedFormControl(""),
      criminalCheckCount: new UntypedFormControl(criminalCheckCount),
      addedByCandidateFlag: new UntypedFormControl(addedByCandidateFlag),
      periodOfStayAddress: new UntypedFormControl([]),
    });
  }
  initcomponentFormGroup(component): UntypedFormGroup {
    return new UntypedFormGroup({
      compId: new UntypedFormControl(component.compId),
      component: new UntypedFormArray([]),
    });
  }
  initCandidateForm(): UntypedFormGroup {
    const required = null;
    const candiadtevalidation = [this.validateInputDate];
    const othervalidation = [this.validatedateInputStayFromwithBirt];
    const date = [this.validateTillDate];
    const validation = [this.validatedateInputwitTilldate];
    return this.fb.group(
      {
        candidateId: new UntypedFormControl(),
        firstName: new UntypedFormControl(
          "",
          Validators.compose([Validators.required, Validators.minLength(3)])
        ),
        middleName: new UntypedFormControl(null),
        lastName: new UntypedFormControl(null),
        fatherName: new UntypedFormControl(null, required),
        dob: new UntypedFormControl(null, this.validatedate),
        candidateAliasId: new UntypedFormControl(0),
        aliasFirstName: new UntypedFormControl(null),
        aliasMiddleName: new UntypedFormControl(null),
        siteId: new UntypedFormControl(0),
        siteName: new UntypedFormControl({ value: "", disabled: true }),
        clientName: new UntypedFormControl(""),
        urlName: new UntypedFormControl(""),
        siteNo: new UntypedFormControl(""),
        aliasLastName: new UntypedFormControl(null),
        clientRefNo: new UntypedFormControl(null),
        document: new UntypedFormArray([]),
        infoceptDocument: new UntypedFormArray([]),
        clientBulkCaseDocument: new UntypedFormArray([]),
        screeningId: new UntypedFormControl(0),
        countryId: new UntypedFormControl(null),
        alternativeCountryId: new UntypedFormControl(null),
        email: new UntypedFormControl(
          "",
          Validators.compose([
            Validators.email,
            Validators.pattern(
              this.common.EmailRegX
            ),
            required,
          ])
        ),
        phoneNo: new UntypedFormControl(
          "",
          Validators.compose([
            Validators.pattern(/^(0|[1-9][0-9]*)$/),
            required,
          ])
        ),
        remarks: new UntypedFormControl(""),
        pan: new UntypedFormControl(null, this.validatePanCardInput),
        econsentFlag: new UntypedFormControl(false),
        iagreeFlag: new UntypedFormControl(false),
        consentLookupId: new UntypedFormControl(),
        consentLookupName: new UntypedFormControl(),
        consentSignature: new UntypedFormControl(),
        scopeByPassFlag: new UntypedFormControl(false),
        loadocumentHtml: new UntypedFormControl(""),
        address: new UntypedFormControl(null),
        genderLookupId: new UntypedFormControl(0, Validators.required),
        maritalStatusLookupId: new UntypedFormControl(),
        spouseName: new UntypedFormControl(),
        uan: new UntypedFormControl(),
        ssn: new UntypedFormControl(),
        ssnFlag: new UntypedFormControl(false),
        clientId: new UntypedFormControl(0),
        companySiteVisitFlag: new UntypedFormControl(false),
        ctsFlag: new UntypedFormControl(false),
        periodOfStay: new UntypedFormControl(
          "", othervalidation
        ),
        periodOfStayTo: new UntypedFormControl(
          "", validation
        ),
        caseInititationDate: new UntypedFormControl(null),
        alternativeContactNo: new UntypedFormControl(
          "",
          Validators.compose([Validators.pattern(/^(0|[1-9][0-9]*)$/)])
        ),
        bestVisitAddress: new UntypedFormControl(""),
        validationString: new UntypedFormControl([
          "NOT PROVIDED",
          "Not Provided",
          "SINCE BIRTH",
          "TILL DATE",
        ]),
      },
      { validator: this.dateCompare("periodOfStay", "periodOfStayTo") }
    );
  }

  initClientDetailForm(): UntypedFormGroup {
    const required = Validators.required;
    return new UntypedFormGroup({
      screeningId: new UntypedFormControl(0),
      candidateId: new UntypedFormControl(0),
      applicantId: new UntypedFormControl(null, required),
      clientId: new UntypedFormControl(""),
      clientRefNo: new UntypedFormControl("", []),
      caseReceivedDate: new UntypedFormControl(null),
      caseInititationDate: new UntypedFormControl(null),
      clientDateOfJoining: new UntypedFormControl(null),
      caseStatusId: new UntypedFormControl("", required),
      casePeriorityId: new UntypedFormControl("", required),
      siteId: new UntypedFormControl(0),
      siteName: new UntypedFormControl({ value: "", disabled: true }),
      clientName: new UntypedFormControl(""),
      urlName: new UntypedFormControl(""),
      siteNo: new UntypedFormControl(""),
      applicantIdLabel: new UntypedFormControl("Applicant Id"),
      chargeCode: new UntypedFormControl("", required),
      chargeCodeFlag: new UntypedFormControl(),
      invitationFlag: new UntypedFormControl(),
      clientCustomFields: new UntypedFormArray([]),
      // clientDumCustomFields: new UntypedFormArray([]),
      scopeByPassFlag: new UntypedFormControl(false),
      ctsFlag: new UntypedFormControl(false),
      forResearchByPassFlag: new UntypedFormControl(false),
      firstName: new UntypedFormControl(""),
      middleName: new UntypedFormControl(""),
      lastName: new UntypedFormControl(""),
      employeeId: new UntypedFormControl(""),
      caseNo: new UntypedFormControl(0),
      loginUserId: new UntypedFormControl(""),
      applicationId: new UntypedFormControl(""),
      caseComponent: new UntypedFormControl(),
      component: new UntypedFormControl(""),
      subcompId: new UntypedFormControl(""),
    });
  }

  initmanualClientDetailForm(): UntypedFormGroup {
    return new UntypedFormGroup({
      screeningId: new UntypedFormControl(0),
      siteName: new UntypedFormControl(""),
      siteNo: new UntypedFormControl(""),
      urlName: new UntypedFormControl(""),
      applicantId: new UntypedFormControl(null),
      applicantIdLabel: new UntypedFormControl("Applicant Id"),
      clientId: new UntypedFormControl("", Validators.required),
      clientName: new UntypedFormControl(""),
      clientRefNo: new UntypedFormControl("", Validators.required),
      caseReceivedDate: new UntypedFormControl(null),
      caseInititationDate: new UntypedFormControl(new Date()),
      flag: new UntypedFormControl(false),
      caseStatusId: new UntypedFormControl(),
      casePeriorityId: new UntypedFormControl(),
      chargeCode: new UntypedFormControl(),
      chargeCodeFlag: new UntypedFormControl(false),
      component: new UntypedFormControl("", Validators.required),
      subcompId: new UntypedFormControl(""),
      scopeByPassFlag: new UntypedFormControl(false),
      clientDateOfJoining: new UntypedFormControl(null),
      enableClientDOJ: new UntypedFormControl(false),
    });
  }
  initComponentForm(
    compId,
    subCompId,
    deqcFlag,
    currencyId,
    countryId,
    priorityId,
    compIndex,
    subCheckFlag,
    compInitiationDate
  ): UntypedFormGroup {
    const required = Validators.required;
    const min = Validators.min(1);
    let validFlag: any;
    if (this.screeningService.componentList.length > 0) {
      const subCompNameList = this.screeningService.componentList.filter(
        (x) => x.compId === compId && x.screeningSubComponent.length > 0
      );
      const compNameList = this.screeningService.componentList.filter(
        (x) => x.compId === compId
      );
      let subName: any[] = [];
      if (subCompNameList.length > 0) {
        subCompNameList.forEach((ele) => {
          const currName = ele.screeningSubComponent.filter(
            (x) => x.subCompName === "Current Address"
          );
          subName.push(currName[0]);
        });
      }
      if (compNameList.length > 0) {

        validFlag = null;

      }
    }
    return new UntypedFormGroup({
      screeningCompId: new UntypedFormControl(0),
      screeningId: new UntypedFormControl(0),
      compId: new UntypedFormControl(compId),
      subCompId: new UntypedFormControl(subCompId),
      vendorId: new UntypedFormControl(null),
      ownerId: new UntypedFormControl(null),
      requestedDate: new UntypedFormControl(null),
      statusModifiedDate: new UntypedFormControl(null),
      tatDays: new UntypedFormControl(0, required),
      deqcFlag: new UntypedFormControl(deqcFlag),
      screenStatusId: new UntypedFormControl(
        0, [required, min]
      ),
      priorityId: new UntypedFormControl(priorityId > 0 ? priorityId : 0, required),
      insuffRaisedFlag: new UntypedFormControl(false),
      notApplicableFlag: new UntypedFormControl(false),
      remark: new UntypedFormControl(),
      insuffRemark: new UntypedFormControl([]),
      invitationFlag: new UntypedFormControl(),
      screeningStatusId: new UntypedFormControl(null),
      insuffRaiseRemark: new UntypedFormControl([]),
      componentDocument: this.fb.array([], validFlag),
      currencyId: new UntypedFormControl(currencyId),
      compIndex: new UntypedFormControl(compIndex + 1),
      qcRejectFlag: new UntypedFormControl(false),
      compInitiationDate: new UntypedFormControl(compInitiationDate),
      reportSource: new UntypedFormControl(),
      caseTypeLookUpId: new UntypedFormControl(0),
      dateTypeLookupId: new UntypedFormControl(0),
      countryTypeLookUpId: new UntypedFormControl(countryId),
      clientScreeningId: new UntypedFormControl(null),
      caseByPassFlag: new UntypedFormControl(
        this.screeningService.caseFlagType === this.common.NEWCASE
          ? true
          : false
      ),
      verificationRejectFlag: new UntypedFormControl(false),
      addNewScreenFlag: new UntypedFormControl(false),
      forResearchRejectFlag: new UntypedFormControl(false),
      subCheckFlag: new UntypedFormControl(subCheckFlag),
      clientApprovalFlag: new UntypedFormControl(false),
      reOpenFlag: new UntypedFormControl(false),
      caseNo: new UntypedFormControl(this.caseNo),
      commonAlertMsg: new UntypedFormControl(null),
      sixMonthComment: new UntypedFormControl(null),
      eduEmpSixMonthComment: new UntypedFormControl(null),
      // this form cts client 
      verificationModeId:new UntypedFormControl(),
      dateOfVerification:new UntypedFormControl()
    });
  }
  initInsufficiencyForm(compId, subCompId): UntypedFormGroup {
    return new UntypedFormGroup({
      insufficiencyId: new UntypedFormControl(0),
      compId: new UntypedFormControl(compId),
      subCompId: new UntypedFormControl(subCompId),
      raisedDate: new UntypedFormControl(null),
      requiredLookupId: new UntypedFormControl([]),
      screeningStatusId: new UntypedFormControl(null),
      levelLookupId: new UntypedFormControl(null),
      loggedIn: new UntypedFormControl(this.userData.userId),
      createdUserId: new UntypedFormControl(this.userData.userId),
      insuffDetail: this.createInsuff(),
      insuffDocument: new UntypedFormControl([]),
    });
  }
  createInsuff() {
    const frmArray = new UntypedFormArray([]);
    frmArray.push(
      new UntypedFormGroup({
        insuffDetailId: new UntypedFormControl(0),
        insufficiencyId: new UntypedFormControl(0),
        insuffDate: new UntypedFormControl(null),
        comments: new UntypedFormControl(null),
        createdUserId: new UntypedFormControl(this.userData.userId),
        infoReqFlag: new UntypedFormControl(false),
        docReqFlag: new UntypedFormControl(true),
      })
    );
    return frmArray;
  }
  initInsufCommentForm(array: UntypedFormArray, data) {
    if (data.length > 0 && array.length > 0) {
      let ind = array.length;
      while (ind >= 0) {
        array.removeAt(ind);
        ind--;
      }
    }
    const frmArray = new UntypedFormArray([]);
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < data.length; i++) {
      array.push(
        new UntypedFormGroup({
          insuffDetailId: new UntypedFormControl(0),
          insufficiencyId: new UntypedFormControl(0),
          insuffDate: new UntypedFormControl(null),
          comments: new UntypedFormControl(null),
          createdUserId: new UntypedFormControl(this.userData.userId),
          infoReqFlag: new UntypedFormControl(false),
          docReqFlag: new UntypedFormControl(false),
        })
      );
    }
  }
  initPanForm(): UntypedFormGroup {
    const candiadtevalidation = [Validators.required, this.validatePanInput];
    const othervalidation = [Validators.required, this.validatePanCardInput];
    return new UntypedFormGroup({
      screeningCompId: new UntypedFormControl(),
      screeningPanId: new UntypedFormControl(0),
      pan: new UntypedFormControl(
        "", othervalidation
      ),
      screeningCreditId: new UntypedFormControl(0),
    });
  }
  initCredForm(): UntypedFormGroup {
    const candiadtevalidation = [Validators.required, this.validatePanInput];
    const othervalidation = [Validators.required, this.validatePanCardInput];
    return new UntypedFormGroup({
      screeningCompId: new UntypedFormControl(),
      screeningPanId: new UntypedFormControl(0),
      address: this.initCommonAddress(),
      pan: new UntypedFormControl(
        "", othervalidation
      ),
      screeningCreditId: new UntypedFormControl(0),
    });
  }
  initUanForm(): UntypedFormGroup {
    return new UntypedFormGroup({
      screeningCompId: new UntypedFormControl(),
      screeningUanid: new UntypedFormControl(0),
      uanAvailability: new UntypedFormControl(true),
      uan: new UntypedFormControl("", Validators.required),
      fullName: new UntypedFormControl(""),
      remarks: new UntypedFormControl("", Validators.required),
    });
  }
  initGsaForm(): UntypedFormGroup {
    return new UntypedFormGroup({
      screeningCompId: new UntypedFormControl(),
      screeningGsaid: new UntypedFormControl(0),
      sourceused: new UntypedFormControl("", Validators.required),
    });
  }
  initFdaForm(): UntypedFormGroup {
    return new UntypedFormGroup({
      screeningCompId: new UntypedFormControl(),
      screeningFdaid: new UntypedFormControl(0),
      sourceused: new UntypedFormControl("", Validators.required),
    });
  }

  initNsrForm(): UntypedFormGroup {
    return new UntypedFormGroup({
      screeningCompId: new UntypedFormControl(),
      screeningNsrid: new UntypedFormControl(0),
      sourceused: new UntypedFormControl("", Validators.required),
    });
  }
  initNdotDrugForm(): UntypedFormGroup {
    return new UntypedFormGroup({
      screeningCompId: new UntypedFormControl(),
      kitId: new UntypedFormControl("", Validators.required),
      kitType: new UntypedFormControl(),
      screeningNDOTDrugScreenId: new UntypedFormControl(0),
    });
  }
  initCommonAddress(required = true): UntypedFormGroup {
    return new UntypedFormGroup({
      addressId: new UntypedFormControl(0),
      addLine1: new UntypedFormControl("", required ? Validators.required : null),
      addLine2: new UntypedFormControl(null),
      addLine3: new UntypedFormControl(null),
      cityId: new UntypedFormControl(null),
      districtId: new UntypedFormControl(null),
      stateId: new UntypedFormControl("", required ? Validators.required : null),
      countryId: new UntypedFormControl("", required ? Validators.required : null),
      postalCode: new UntypedFormControl(null),
      locationId: new UntypedFormControl(null),
      country: new UntypedFormControl(""),
      state: new UntypedFormControl(""),
      district: new UntypedFormControl(""),
      city: new UntypedFormControl(""),
      place: new UntypedFormControl(""),
      addressPos: this.fb.array([
        this.fb.group({
          addressId: new UntypedFormControl(0),
          periodOfStay: new UntypedFormControl('', Validators.required),
          periodOfStayTo: new UntypedFormControl('', Validators.required),
          addressPosId: new UntypedFormControl(0),
          screeningCompId: new UntypedFormControl(0),
          reportFlag: new UntypedFormControl(false),
          validationString: new UntypedFormControl([
            "NOT PROVIDED",
            "Not Provided",
            "SINCE BIRTH",
            "TILL DATE",
          ]),
        }),
      ]),
    });
  }
  initCommonNAddress(required = true): UntypedFormGroup {
    return new UntypedFormGroup({
      addressId: new UntypedFormControl(0),
      addLine1: new UntypedFormControl("", required ? Validators.required : null),
      addLine2: new UntypedFormControl(null),
      addLine3: new UntypedFormControl(null),
      cityId: new UntypedFormControl(null),
      districtId: new UntypedFormControl(null),
      stateId: new UntypedFormControl("", required ? Validators.required : null),
      countryId: new UntypedFormControl("", required ? Validators.required : null),
      postalCode: new UntypedFormControl(null),
      locationId: new UntypedFormControl(null),
      country: new UntypedFormControl(""),
      state: new UntypedFormControl(""),
      district: new UntypedFormControl(""),
      city: new UntypedFormControl(""),
      place: new UntypedFormControl(""),

    });
  }
  initAddressForm(): UntypedFormGroup {
    const candiadtevalidation = [this.validateInputDate];
    const othervalidation = [
      Validators.required,
      this.validatedateInputStayFromwithBirt,
    ];
    const date = [this.validateTillDate];
    const validation = [Validators.required, this.validatedateInputwitTilldate];
    return this.fb.group({
      address: this.initCommonAddress(),
      screeningAddressId: new UntypedFormControl(0),
      screeningCriminalCheckId: new UntypedFormControl(0),

      screeningPanIndiaOCRVId: new UntypedFormControl(0),
      overallStayYears: new UntypedFormControl(""),
      checkPermanentAddress: new UntypedFormControl(),
    });
  }

  initNiciForm(): UntypedFormGroup {
    return new UntypedFormGroup({
      screeningCompId: new UntypedFormControl(),
      aadhaarNumber: new UntypedFormControl(
        "",
        Validators.compose([
          Validators.pattern(/^(0|[1-9][0-9]*)$/),
          Validators.required,
        ])
      ),
      screeningNICId: new UntypedFormControl(0),
    });
  }
  initDirectorshipForm(): UntypedFormGroup {
    return new UntypedFormGroup({
      screeningCompId: new UntypedFormControl(),
      identificationNumber: new UntypedFormControl(
        "",
        Validators.compose([
          Validators.pattern(/^(0|[1-9][0-9]*)$/),
          Validators.required,
        ])
      ),
      organizationName: new UntypedFormControl("", Validators.required),
      screeningDirectorshipId: new UntypedFormControl(0),
    });
  }
  initEmpSupervisorForm(isrequired): UntypedFormGroup {
    const mailvalidation = [this.validateMailInput];
    const contactvalidation = [this.validateContactInput];
    return this.fb.group({
      supervisorId: new UntypedFormControl(0),
      supervisorName: new UntypedFormControl(""),
      supervisorEmail: this.initContactForm(Validators.compose(mailvalidation)),
      supervisorDesignation: new UntypedFormControl(),
      supervisorContactNo: this.initContactForm(
        Validators.compose(contactvalidation)
      ),
      countryId: new UntypedFormControl(""),
      country: new UntypedFormControl(),
      city: new UntypedFormControl(),
      loggedIn: new UntypedFormControl(this.userData.userId),
    });
  }
  initEmployerForm(index, compId): UntypedFormGroup {
    const required = null;
    const candiadtevalidation = [Validators.required, this.validateInput];
    const othervalidation = [this.validatedateInput];
    const tilldatevalidation = [this.validatedateInputwitTilldate];
    const candidatetilldatevalidation = [
      Validators.required,
      this.validateTillDate,
    ];
    return this.fb.group({
      address: this.initempeduCommonAddress(),
      screeningEmployeeId: new UntypedFormControl(0),
      screeningCompId: new UntypedFormControl(0),
      employerId: new UntypedFormControl(null),
      companyId: new UntypedFormControl(0),
      employerName: new UntypedFormControl(null, Validators.required),
      empInsAddressId: new UntypedFormControl(0),
      currentEmployerFlag: new UntypedFormControl(false),
      employeeId: new UntypedFormControl(null, required),
      designation: new UntypedFormControl(null, required),
      fromDate: new UntypedFormControl(
        null, othervalidation
      ),
      toDate: new UntypedFormControl(
        null, tilldatevalidation
      ),
      ctc: new UntypedFormControl(null, Validators.required),
      rocRegistration: new UntypedFormControl(null),
      gapReason: new UntypedFormControl(null),
      genuineDocFlag: new UntypedFormControl(true),
      remarks: new UntypedFormControl(null),
      officialName: new UntypedFormControl(null),
      holdFlag: new UntypedFormControl(null),
      empInitiationDate: new UntypedFormControl(null),
      validationString: new UntypedFormControl(["NOT PROVIDED", "Not Provided"]),
      fresherFlag: new UntypedFormControl(false),
      reverifyFlag: new UntypedFormControl(false),
      reasonForLeaving: new UntypedFormControl(""),
      isVerified: new UntypedFormControl(null),
      hrName: new UntypedFormControl(""),
      hrEmail: new UntypedFormControl(
        "",
        Validators.compose([
          Validators.email,
          Validators.pattern(
            this.common.EmailRegX
          ),
        ])
      ),
      hrContactNo: new UntypedFormControl(
        "",
        Validators.compose([
          Validators.pattern(/^(0|[1-9][0-9]*)$/),
          Validators.minLength(10),
          Validators.maxLength(10),
        ])
      ),
      npRemarks: new UntypedFormControl(),
      npReasonLookupId: new UntypedFormControl(),
      employmentNumber: new UntypedFormControl(null),
    });
  }
  initsupervisorDetForm(isrequired): UntypedFormGroup {

    const mailvalidation = [this.validateMailInput];
    const contactvalidation = [this.validateContactInput];
    return this.fb.group({
      supervisorId: new UntypedFormControl(0),
      supervisorName: new UntypedFormControl(
        "",
        isrequired ? Validators.required : null
      ),
      supervisorEmail: this.initContactForm(mailvalidation),
      supervisorDesignation: new UntypedFormControl(),
      supervisorContactNo: this.initContactForm(contactvalidation),
      countryId: new UntypedFormControl(""),
      country: new UntypedFormControl(),
      city: new UntypedFormControl(),
      loggedIn: new UntypedFormControl(this.userData.userId),
    });
  }
  initContactForm(validators: Validators) {
    return this.fb.group({
      transContactId: new UntypedFormControl(0),
      destLookupId: new UntypedFormControl(0),
      destName: new UntypedFormControl(""),
      contactId: new UntypedFormControl(0),
      contactData: new UntypedFormControl("", validators),
      lookupId: new UntypedFormControl(0),
    });
  }
  initempeduCommonAddress(required = true): UntypedFormGroup {
    return new UntypedFormGroup({
      addressId: new UntypedFormControl(0),
      addTypeLookName: new UntypedFormControl(""),
      addTypeLookupId: new UntypedFormControl(0),
      addLine1: new UntypedFormControl(""),
      addLine2: new UntypedFormControl(""),
      addLine3: new UntypedFormControl(""),
      addressType: new UntypedFormControl(""),
      addressTypeLookupId: new UntypedFormControl(0),
      cityId: new UntypedFormControl(0),
      city: new UntypedFormControl(""),
      stateId: new UntypedFormControl(0),
      countryId: new UntypedFormControl(""),
      districtId: new UntypedFormControl(0),
      postalCode: new UntypedFormControl(""),
      place: new UntypedFormControl(),
      active: new UntypedFormControl(true),
      stateCode: new UntypedFormControl(0),
      phoneCode: new UntypedFormControl(0),
      locationName: new UntypedFormControl(""),
      createdUserId: new UntypedFormControl(this.userData.userId),
      locationId: new UntypedFormControl(0),
      country: new UntypedFormControl(""),
      clientId: new UntypedFormControl(0),
      periodOfStay: new UntypedFormControl(""),
      state: new UntypedFormControl(""),
      district: new UntypedFormControl(""),
    });
  }
  initEducationForm(index, compId): UntypedFormGroup {
    const required = null;
    const candiadtevalidation = [Validators.required, this.validatedateInput];
    const othervalidation = [this.validatedateInput];

    return this.fb.group({
      screeningEducationId: new UntypedFormControl(0),
      removeInstitutionTypeFlag: new UntypedFormControl(0),
      removeEducationCategoryFlag: new UntypedFormControl(0),
      institutionName: new UntypedFormControl("", Validators.required),
      empInsAddressId: new UntypedFormControl(0),
      institutionId: new UntypedFormControl(0),
      instituteName: new UntypedFormControl(null),
      fakeinstitution: new UntypedFormControl(""),
      registrationNumber: new UntypedFormControl(null, required),
      rollNumber: new UntypedFormControl(null),
      degree: new UntypedFormControl(null),
      major: new UntypedFormControl(null),
      courseCompletion: new UntypedFormControl(
        null, othervalidation
      ),
      yearOfPassing: new UntypedFormControl(
        null, othervalidation
      ),
      certificateIssue: new UntypedFormControl(
        null, othervalidation
      ),
      gpa: new UntypedFormControl(null, required),
      gapReason: new UntypedFormControl(null),
      higherEduFlag: new UntypedFormControl(false),
      isVerified: new UntypedFormControl(null),
      educationTypeLookupId: new UntypedFormControl(0),
      universityTypeLookupId: new UntypedFormControl(""),
      institutionType: new UntypedFormControl(""),
      educationCategoryName: new UntypedFormControl(""),
      educationType: new UntypedFormControl(""),
      otherCertificationCourse: new UntypedFormControl(""),
      screeningCompId: new UntypedFormControl(0),
      address: this.initempeduCommonAddress(true),
      nameAsPerProof: new UntypedFormControl(null),
      insLocation: new UntypedFormControl(""),
      npRemarks: new UntypedFormControl(),
      npReasonLookupId: new UntypedFormControl(),
      npReason: new UntypedFormControl(),
      courseStart: new UntypedFormControl(
        null, othervalidation
      ),
      validationString: new UntypedFormControl(["NOT PROVIDED", "Not Provided"]),
    });
  }
  initDrugForm(): UntypedFormGroup {
    return new UntypedFormGroup({
      screeningCompId: new UntypedFormControl(),
      kitId: new UntypedFormControl("", Validators.required),
      kitType: new UntypedFormControl(),
      screeningDrugTestId: new UntypedFormControl(0),
      address: this.initCommonNAddress(),
    });
  }
  initLicenseForm(): UntypedFormGroup {
    const othervalidation = [this.validatedateInput];
    return this.fb.group({
      address: this.initCommonNAddress(),
      periodOfStay: new UntypedFormControl(""),
      screeningLicenseId: new UntypedFormControl(0),
      issuingAuthority: new UntypedFormControl("", Validators.required),
      licenseNo: new UntypedFormControl("", Validators.required),
      regNo: new UntypedFormControl(""),
      validFrom: new UntypedFormControl(
        "", othervalidation
      ),
      validTo: new UntypedFormControl(
        "", othervalidation
      ),
      validationString: new UntypedFormControl(["NOT PROVIDED", "Not Provided"]),
    });
  }
  initVoterIdForm(): UntypedFormGroup {
    return new UntypedFormGroup({
      screeningVoterId: new UntypedFormControl(0),
      screeningCompId: new UntypedFormControl(),
      voterId: new UntypedFormControl("", [
        Validators.required,
        this.validateVoterIdInput,
      ]),
      voterName: new UntypedFormControl("", Validators.required),
      genderLookupId: new UntypedFormControl(0, Validators.required),
      gender: new UntypedFormControl(),
      address: this.initCommonNAddress(),
    });
  }
  initEmployeementSupForm(required): UntypedFormGroup {
    const mailvalidation = [this.validateMailInput];
    const contactvalidation = [this.validateContactInput];
    return new UntypedFormGroup({
      screeningEmpSupervisorId: new UntypedFormControl(0),
      professionalId: new UntypedFormControl(0),
      screeningCompId: new UntypedFormControl(),
      professionalName: new UntypedFormControl("", Validators.required),
      supervisorEmail: this.initContactForm(mailvalidation),
      supervisorDesignation: new UntypedFormControl("", Validators.required),
      supervisorContactNo: this.initContactForm(contactvalidation),
      supervisorCompanyName: new UntypedFormControl(),
      countryId: new UntypedFormControl(),
      country: new UntypedFormControl(),
      city: new UntypedFormControl(),
    });
  }
  initScreeningDocForm() {
    return new UntypedFormGroup({
      screeningDocId: new UntypedFormControl(0),
      cvDocId: new UntypedFormControl(0),
      document: new UntypedFormControl([]),
      docId : new UntypedFormControl(0),
      fileName: new UntypedFormControl(""),
      docName: new UntypedFormControl(""),
      filePath: new UntypedFormControl(""),
      docTypeId: new UntypedFormControl(0),
      docSubTypeId: new UntypedFormControl(0),
      insuffDocFlag: new UntypedFormControl(false),
    });
  }
  initPassportForm(): UntypedFormGroup {
    const candiadtevalidation = [this.PassportInput];
    const othervalidation = [this.PassportValidateInput];
    const date = [this.validateInput];
    const validation = [this.validatedateInput];
    return new UntypedFormGroup({
      address: this.initCommonNAddress(),
      screeningPassportId: new UntypedFormControl(0),
      placeOfResidence: new UntypedFormControl(""),
      expiryDate: new UntypedFormControl(),
      passportNumber: new UntypedFormControl(""),
      // passportNumber: new UntypedFormControl(
      //   "", othervalidation
      // ),
      dateOfIssue: new UntypedFormControl(
        "", validation
      ),
      placeOfIssue: new UntypedFormControl("", Validators.required),
      machineReadableZone: new UntypedFormControl(""),
    });
  }

  initCompanySiteVisitForm(): UntypedFormGroup {
    return new UntypedFormGroup({
      companyName: new UntypedFormControl("", Validators.required),
      screeningCompanySiteVisitId: new UntypedFormControl(0),
      address: this.initCommonAddress(),
    });
  }
  initSocialMediaForm(): UntypedFormGroup {
    return new UntypedFormGroup({
      screeningSocialMediaId: new UntypedFormControl(0),
    });
  }
  initOigForm(): UntypedFormGroup {
    return new UntypedFormGroup({
      screeningOigId: new UntypedFormControl(0),
      sourceUsed: new UntypedFormControl(),
    });
  }
  initFACIS1Form(): UntypedFormGroup {
    return new UntypedFormGroup({
      screeningFACIS1Id: new UntypedFormControl(0),
      sourceUsed: new UntypedFormControl(),
    });
  }
  initFACIS2Form(): UntypedFormGroup {
    return new UntypedFormGroup({
      screeningFACIS2Id: new UntypedFormControl(0),
      sourceUsed: new UntypedFormControl(),
    });
  }
  initFACIS3Form(): UntypedFormGroup {
    return new UntypedFormGroup({
      screeningFACIS3Id: new UntypedFormControl(0),
      sourceUsed: new UntypedFormControl(),
    });
  }
  initFACISMForm(): UntypedFormGroup {
    return new UntypedFormGroup({
      screeningFACISMId: new UntypedFormControl(0),
      sourceUsed: new UntypedFormControl(),
    });
  }
  initTENNESSEEForm(): UntypedFormGroup {
    return new UntypedFormGroup({
      screeningTENNESSEEId: new UntypedFormControl(0),
      sourceUsed: new UntypedFormControl(),
    });
  }
  initRefCheckForm(): UntypedFormGroup {
    return new UntypedFormGroup({
      professionalName: new UntypedFormControl("", Validators.required),
      screeningRefCheckId: new UntypedFormControl(0),
      reportFlagLookupId: new UntypedFormControl(""),
      refPhoneNo: new UntypedFormControl(""),
      refEmail: new UntypedFormControl(
        "",
        Validators.compose([
          Validators.email,
          Validators.pattern(
            this.common.EmailRegX
          ),
        ])
      ),
      refDesignation: new UntypedFormControl(),
      refCompanyName: new UntypedFormControl(),
      countryId: new UntypedFormControl(),
      city: new UntypedFormControl(),
      country: new UntypedFormControl(),
    });
  }
  initSelftEmpForm(): UntypedFormGroup {
    return new UntypedFormGroup({
      screeningRefSelfEmpId: new UntypedFormControl(0),
      screeningCompId: new UntypedFormControl(),
      professionalId: new UntypedFormControl(0),
      professionalName: new UntypedFormControl("", Validators.required),
      supervisorEmail: this.initContactForm(
        Validators.compose([
          Validators.email,
          Validators.pattern(
            this.common.EmailRegX
          ),
        ])
      ),
      supervisorDesignation: new UntypedFormControl(),
      supervisorContactNo: this.initContactForm(
        Validators.compose([Validators.pattern(/^(0|[1-9][0-9]*)$/)])
      ),
      supervisorCompanyName: new UntypedFormControl(),
      countryId: new UntypedFormControl(""),
      city: new UntypedFormControl(),
      country: new UntypedFormControl(),
    });
  }
  initCriminalDatabaseForm(type): UntypedFormGroup {
    const required =
      type === this.common.CRIMINAL_DATABASE ? Validators.required : null;
    const candiadtevalidation = [this.validateInputDate];
    const othervalidation = [this.validatedateInputStayFromwithBirt];
    const date = [this.validateTillDate];
    const validation = [this.validatedateInputwitTilldate];
    if (type === this.common.DATABASE_CONDUCT || type === this.common.DATABASE_ADVERSE_MEDIA) {
      return this.fb.group({
        screeningCriminalDatabaseId: new UntypedFormControl(0),
        addressTypeCheckLookupId: new UntypedFormControl("", null),
        sourceName: new UntypedFormControl("", Validators.required),
      });
    } else if (type === this.common.CRIMINAL_DATABASE) {
      return this.fb.group({
        screeningCriminalDatabaseId: new UntypedFormControl(0),
        addressTypeCheckLookupId: new UntypedFormControl("", null),
        sourceName: new UntypedFormControl(""),
      });
    } else {
      return this.fb.group({
        screeningCriminalDatabaseId: new UntypedFormControl(0),
        address: this.initCommonAddress(),
        addressTypeLookupId: new UntypedFormControl("", Validators.required),
        addressType: new UntypedFormControl(),
        addressTypeCheckLookupId: new UntypedFormControl("", null),
        sourceName: new UntypedFormControl(""),
        addressTypeCheckLookupName: new UntypedFormControl(),
        addressTypeCheck: new UntypedFormControl(),
        periodOfStay: new UntypedFormControl(
          "", othervalidation
        ),
        periodOfStayTo: new UntypedFormControl(
          "", validation
        ),
        validationString: new UntypedFormControl([
          "NOT PROVIDED",
          "Not Provided",
          "SINCE BIRTH",
          "TILL DATE",
        ]),
        checkPermanentAddress: new UntypedFormControl(),
      });
    }
  }
  initCrcForm(): UntypedFormGroup {
    const candiadtevalidation = [this.validateInputDate];
    const othervalidation = [this.validatedateInputStayFromwithBirt];
    const date = [this.validateTillDate];
    const validation = [this.validatedateInputwitTilldate];
    return this.fb.group({
      screeningCRCId: new UntypedFormControl(0),
      screeningCompId: new UntypedFormControl(),
      addresscheck: new UntypedFormControl(""),
      addressTypeCheckLookupId: new UntypedFormControl(""),
      addressTypeCheckLookupName: new UntypedFormControl(),
      address: this.initCommonAddress(),
      periodOfStayFrom: new UntypedFormControl(
        "",
        othervalidation
      ),
      periodOfStayTo: new UntypedFormControl(
        "",
        validation
      ),
      gapDuration: new UntypedFormControl(),
      checkPermanentAddress: new UntypedFormControl(),
      validationString: new UntypedFormControl([
        "NOT PROVIDED",
        "Not Provided",
        "SINCE BIRTH",
        "TILL DATE",
      ]),
    });
  }
  initCriminalCheckPcc2Form(): UntypedFormGroup {
    const candiadtevalidation = [this.validateInputDate];
    const othervalidation = [this.validatedateInputStayFromwithBirt];
    const date = [this.validateTillDate];
    const validation = [this.validatedateInputwitTilldate];
    return this.fb.group({
      screeningCriminalCheckPCCId: new UntypedFormControl(0),
      screeningCompId: new UntypedFormControl(),
      addressTypeCheckLookupId: new UntypedFormControl("", Validators.required),
      addressTypeCheckLookupName: new UntypedFormControl(),
      address: new UntypedFormArray([]),
      periodOfStayFrom: new UntypedFormControl(
        "", othervalidation
      ),
      periodOfStayTo: new UntypedFormControl(
        "", validation
      ),
      validationString: new UntypedFormControl([
        "NOT PROVIDED",
        "Not Provided",
        "SINCE BIRTH",
        "TILL DATE",
      ]),
      checkPermanentAddress: new UntypedFormControl(),
    });
  }

  initCriminalCheckPcc3Form(): UntypedFormGroup {
    const candiadtevalidation = [this.validateInputDate];
    const othervalidation = [this.validatedateInputStayFromwithBirt];
    const date = [this.validateTillDate];
    const validation = [this.validatedateInputwitTilldate];
    return this.fb.group({
      screeningCriminalCheckId: new UntypedFormControl(0),
      screeningCompId: new UntypedFormControl(),
      addressTypeCheckLookupId: new UntypedFormControl(""),
      addressTypeCheckLookupName: new UntypedFormControl(),
      addressTypeLookupId: new UntypedFormControl("", Validators.required),
      addressType: new UntypedFormControl(),
      periodOfStayFrom: new UntypedFormControl(
        "",
        othervalidation
      ),
      periodOfStayTo: new UntypedFormControl(
        "",
        validation
      ),
      address: this.initCommonAddress(),
      validationString: new UntypedFormControl([
        "NOT PROVIDED",
        "Not Provided",
        "SINCE BIRTH",
        "TILL DATE",
      ]),
      checkPermanentAddress: new UntypedFormControl(),
    });
  }
  initEmpHREmpSupForm(index, compId): UntypedFormGroup {

    return new UntypedFormGroup({
      screeningEmpHRandSupId: new UntypedFormControl(0),
      employmentHR: this.initEmployerForm(index, compId),
      screeningCompId: new UntypedFormControl(0),
      employmentSupervisor: this.initEmployeementSupForm(true),
    });
  }
  initGapVerificationForm(): UntypedFormGroup {
    const candiadtevalidation = [this.validateInput];
    const othervalidation = [this.validatedateInput];
    return this.fb.group({
      screeningStatusId: new UntypedFormControl(null),
      screeningGapVerifyId: new UntypedFormControl(0),
      screeningCompId: new UntypedFormControl(),
      gapType: new UntypedFormControl(),
      gapTypeLookupId: new UntypedFormControl(null, this.screeningService.ClientCategoryId !== this.common.techmcatId ? [Validators.required] : null),
      gapFrom: new UntypedFormControl(null, othervalidation),
      gapTo: new UntypedFormControl(null, othervalidation),
      validationString: new UntypedFormControl(["NOT PROVIDED", "Not Provided"]),
    });
  }
  initEmergencyContactVerificationForm(): UntypedFormGroup {
    return new UntypedFormGroup({
      screeningECVId: new UntypedFormControl(0),
      screeningCompId: new UntypedFormControl(),
      contactPersonName: new UntypedFormControl(null, Validators.required),
      contactNumber: new UntypedFormControl(null, Validators.required),
    });
  }
  initJudisCourtForm(): UntypedFormGroup {
    return this.fb.group(
      {
        screeningJCRId: new UntypedFormControl(0),
        screeningCompId: new UntypedFormControl(),
        address: this.initCommonAddress(),
        periodOfStay: new UntypedFormControl(
          "",
          this.validatedateInputStayFromwithBirt
        ),
        periodOfStayTo: new UntypedFormControl("", this.validatedateInputwitTilldate),
        jCRCourctDetailsVm: this.fb.array([
          this.fb.group({
            screeningJcrdetailsId: new UntypedFormControl(0),
            ScreeningJcrid: new UntypedFormControl(0),
            courtName: new UntypedFormControl(''),
            jurisdiction: new UntypedFormControl(''),
            location: new UntypedFormControl(''),
            remarks: new UntypedFormControl(''),
            active: new UntypedFormControl(true),
            deleteFlag: new UntypedFormControl(false),
            createdUserId: new UntypedFormControl(0),
          }),
        ]),
        validationString: new UntypedFormControl([
          "NOT PROVIDED",
          "Not Provided",
          "SINCE BIRTH",
          "TILL DATE",
        ]),
      }
    );
  }
  initBankStatementForm(): UntypedFormGroup {
    const candiadtevalidation = [this.validateInput];
    const othervalidation = [this.validatedateInput];
    return this.fb.group(
      {
        screeningBankStatementId: new UntypedFormControl(0),
        screeningCompId: new UntypedFormControl(),
        employerId: new UntypedFormControl(null),
        employerName: new UntypedFormControl(null, Validators.required),
        fromDate: new UntypedFormControl(
          "",
          othervalidation
        ),
        toDate: new UntypedFormControl(
          "",
          othervalidation
        ),
        bankName: new UntypedFormControl(null, Validators.required),
        branchName: new UntypedFormControl(null, Validators.required),
        accountNo: new UntypedFormControl(null, Validators.required),
        statementFrom: new UntypedFormControl(null, Validators.required),
        statementTo: new UntypedFormControl(null, Validators.required),
        validationString: new UntypedFormControl(["NOT PROVIDED", "Not Provided"]),
      }

    );
  }
  initclientCustomFieldsForm(fieadData): UntypedFormArray {
    const arr = this.fb.array([]);
    if (fieadData) {
      if (fieadData.length > 0) {
        for (let i = 0; fieadData.length > i; i++) {
          const data = fieadData[i];
          arr.push(this.customFiled(data));
        }
      }
    }
    return arr;
  }
  customFiled(data): UntypedFormGroup {
    return new UntypedFormGroup({
      clientCustomFieldId: new UntypedFormControl(data.clientCustomFieldId),
      fieldName: new UntypedFormControl(data.fieldName),
      fieldType: new UntypedFormControl(data.fieldType),
      fieldValue: new UntypedFormControl(
        data.fieldValue,
        data.mandatoryFlag ? Validators.required : null
      ),
      screeningClientCustomFieldId: new UntypedFormControl(
        data.screeningClientCustomFieldId
      ),
    });
  }
  cvValidationForm(field, isbind) {
    return new UntypedFormGroup({
      screeningCVId: new UntypedFormControl(isbind ? field.screeningCVId : 0),
      screeningCompId: new UntypedFormControl(isbind ? field.screeningCompId : 0),
      cvCatFieldMapId: new UntypedFormControl(field.cvCatFieldMapId),
      fieldValue: new UntypedFormControl(
        isbind ? field.fieldValue : "",
        field.mandatoryFlag ? Validators.required : null
      ),
      cvFlag: new UntypedFormControl(isbind ? field.cvFlag : false),
      cvRemarks: new UntypedFormControl(isbind ? field.cvRemarks : ""),
      bgvFlag: new UntypedFormControl(isbind ? field.bgvFlag : false),
      bgvRemarks: new UntypedFormControl(isbind ? field.bgvRemarks : ""),
      supportDocFlag: new UntypedFormControl(isbind ? field.supportDocFlag : false),
      supportDocRemarks: new UntypedFormControl(isbind ? field.supportDocRemarks : ""),
      remaks: new UntypedFormControl(isbind ? field.remaks : ""),
      categoryName: new UntypedFormControl(field.categoryName),
      displayOrder: new UntypedFormControl(field.displayOrder),
      fieldName: new UntypedFormControl(field.fieldName),
      fieldType: new UntypedFormControl(field.fieldType),
    });
  }
  initAbroad() {
    return this.fb.group({
      screeningCompId: new UntypedFormControl(0),
      screeningAbroadCompId: new UntypedFormControl(0),
      informationSource: new UntypedFormControl("", Validators.required),
    });
  }
  initSsn() {
    return this.fb.group({
      screeningCompId: new UntypedFormControl(0),
      screeningAbroadCompId: new UntypedFormControl(0),
      fullName: new UntypedFormControl('', Validators.required),
      fatherName: new UntypedFormControl('', Validators.required),
      dob: new UntypedFormControl('', Validators.required),
      ssnNo: new UntypedFormControl('', Validators.required),
      address: this.common.isAdditionalPos ? this.initCommonAddress() : this.initCommonNAddress(),
    });
  }
  initNationCriminal() {
    return this.fb.group({
      screeningCompId: new UntypedFormControl(0),
      screeningAbroadCompId: new UntypedFormControl(0),
      fullName: new UntypedFormControl('', Validators.required),
      fatherName: new UntypedFormControl('', Validators.required),
      dateOfBirth: new UntypedFormControl('', Validators.required),
      documentTypeLookupId: new UntypedFormControl(0, Validators.required),
      idProofNumber: new UntypedFormControl(''),
      issuedBy: new UntypedFormControl(''),
      address: this.common.isAdditionalPos ? this.initCommonAddress() : this.initCommonNAddress(),
    });
  }
  createGapReason(data: any) {
    const frmArray = this.fb.array([]);
    for (let i = 0; data.length > i; i++) {
      frmArray.push(this.initGapReasonForm(data[i]));
    }
    return frmArray;
  }
  initGapReasonForm(data): UntypedFormGroup {
    return this.fb.group({
      gapReasonId: new UntypedFormControl(0),
      screeningId: new UntypedFormControl(0),
      typeLookupId: new UntypedFormControl(data.typeLookupId),
      remarks: new UntypedFormControl(null),
      reasonFlag: new UntypedFormControl(null, Validators.required),
      loggedIn: new UntypedFormControl(this.userData.userId),
      reasonDoument: new UntypedFormArray([]),
      gapTypeName: new UntypedFormControl(data.typeName),
    });
  }
  initcvValidation(data): UntypedFormGroup {
    const cvList: any[] = [];
    if (data) {
      data.map((m) => {
        if (!cvList.some((s) => s === m.categoryName)) {
          cvList.push(m.categoryName);
        }
      });
    }
    const group: any = {};
    cvList.forEach((question) => {
      group[question] = new UntypedFormArray([]);
    });
    return new UntypedFormGroup(group) as UntypedFormGroup;
  }

  createCvValidationForm(form: UntypedFormGroup, data = [], isEdit) {
    const cvValidationList: any[] = [];
    const cvList: any[] = [];
    if (data) {
      data.map((m) => {
        if (!cvList.some((s) => s === m.categoryName)) {
          cvList.push(m.categoryName);
        }
      });
    }
    cvList.forEach((m) => {
      const singlefrmArray = form.get(m) as UntypedFormArray;
      const dummy: any[] = [];
      const address = data.filter((f) => f.categoryName === m);
      const indexs = address.reduce((a, e, i) => {
        if (e.displayOrder === 1) {
          a.push(i);
          dummy.push([]);
          singlefrmArray.push(new UntypedFormArray([]));
        }
        return a;
      }, []);
      for (let j = 0; indexs.length > j; j++) {
        dummy[j] = address.slice(indexs[j], indexs[j + 1]);
      }
      for (let k = 0; dummy.length > k; k++) {
        const particularfrArray = singlefrmArray.controls[k] as UntypedFormArray;
        for (let l = 0; dummy[k].length > l; l++) {
          particularfrArray.push(this.cvValidationForm(dummy[k][l], isEdit));
          cvValidationList.push(dummy[k][l]);
        }
      }
    });
  }
  addNewCV(event: any) {
    const particularfrArray = event.form as UntypedFormArray;
    const newFormArray = new UntypedFormArray([]);
    const dummy = event.form.value;
    for (let l = 0; dummy[0].length > l; l++) {
      newFormArray.push(this.cvValidationForm(dummy[0][l], false));
    }
    particularfrArray.push(newFormArray);
  }
  validatePassportInput(c: UntypedFormControl) {
    const notREGEX = /([A-Z]){1}([0-9]){7}?$/;
    const notProviedREGEX = /^(NOT PROVIDED)$/;
    const value = c.value ? c.value.toUpperCase() : c.value;
    return notProviedREGEX.test(value) || notREGEX.test(value)
      ? null
      : {
        validateInput: {
          valid: false,
        },
      };
  }
  PassportValidateInput(c: UntypedFormControl) {
    const notREGEX = /([A-Z]){1}([0-9]){7}?$/;
    const notProviedREGEX = /^(NOT PROVIDED)$/;
    if (c.value) {
      const value = c.value ? c.value.toUpperCase() : c.value;
      return notProviedREGEX.test(value) || notREGEX.test(value)
        ? null
        : {
          passportvalidate: {
            invalidPattern: true,
          },
        };
    }
  }
  PassportInput(c: UntypedFormControl) {
    const notREGEX = /([A-Z]){1}([0-9]){7}?$/;
    if (c.value) {
      const value = c.value ? c.value.toUpperCase() : c.value;
      return notREGEX.test(value)
        ? null
        : {
          passportvalidate: {
            invalidPattern: true,
          },
        };
    }
  }
  validatePanInput(c: UntypedFormControl) {
    const panREGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (c.value) {
      const value = c.value ? c.value.toUpperCase() : c.value;
      return panREGEX.test(value)
        ? null
        : {
          panvalidate: {
            invalidPattern: true,
          },
        };
    }
  }
  validatePanCardInput(c: UntypedFormControl) {
    const panREGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const notProviedREGEX = /^(NOT PROVIDED)$/;
    if (c.value) {
      const value = c.value ? c.value.toUpperCase() : c.value;
      return notProviedREGEX.test(value) || panREGEX.test(value)
        ? null
        : {
          panvalidate: {
            invalidPattern: true,
          },
        };
    }
  }
  validateVoterIdInput(c: UntypedFormControl) {
    const voterREGEX1 = /^[A-Z]{3}[0-9]{7}$/;
    const voterREGEX2 = /^([A-Z]){2}\/([0-9]{2})\/([0-9]{3})\/([0-9]{7})$/;
    if (c.value) {
      const value = c.value ? c.value.toUpperCase() : c.value;
      return voterREGEX1.test(value) || voterREGEX2.test(value)
        ? null
        : {
          voter: {
            invalidPattern: true,
          },
        };
    }
  }
  validateInput(c: UntypedFormControl) {
    const ddmmyyyyREGEX =
      /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
    const ddmmmyyyyREGEX =
      /^(0[1-9]|1\d|2\d|3[01])\/(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const mmmyyyyREGEX =
      /^(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const yyyyREGEX = /^(19|20)\d{2}$/;
    if (c.value) {
      const value = c.value.toUpperCase();
      return ddmmyyyyREGEX.test(value) ||
        ddmmmyyyyREGEX.test(value.toUpperCase()) ||
        mmmyyyyREGEX.test(value.toUpperCase()) ||
        yyyyREGEX.test(value.toUpperCase())
        ? null
        : {
          date: {
            invalidPattern: true,
          },
        };
    }
  }
  validateMailInput(c: UntypedFormControl) {
    const notProvidedREGX1 = /^(Not Provided)$/;
    const notProviedREGEX = /^(NOT PROVIDED)$/;
    const emailREGX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,100}$/;

    if (c.value) {
      const value = c.value ? c.value.toUpperCase() : c.value;
      return notProviedREGEX.test(value) ||
        notProvidedREGX1.test(value) ||
        emailREGX.test(value)
        ? null
        : {
          panvalidate: {
            invalidPattern: true,
          },
        };
    }
  }
  validateContactInput(c: UntypedFormControl) {
    const notProvidedREGX1 = /^(Not Provided)$/;
    const contREGEX = /^(0|[1-9][0-9]*)$/;
    const notProviedREGEX = /^(NOT PROVIDED)$/;
    if (c.value) {
      const value = c.value ? c.value.toUpperCase() : c.value;
      return notProviedREGEX.test(value) ||
        notProvidedREGX1.test(value) ||
        contREGEX.test(value)
        ? null
        : {
          panvalidate: {
            invalidPattern: true,
          },
        };
    }
  }
  validatedateInput(c: UntypedFormControl) {
    const ddmmyyyyREGEX =
      /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
    const ddmmmyyyyREGEX =
      /^(0[1-9]|1\d|2\d|3[01])\/(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const mmmyyyyREGEX =
      /^(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const notProvidedREGX1 = /^(Not Provided)$/;
    const yyyyREGEX = /^(19|20)\d{2}$/;
    const notProviedREGEX = /^(NOT PROVIDED)$/;

    if (c.value) {
      const value = c.value.toUpperCase();
      return notProviedREGEX.test(value) ||
        notProvidedREGX1.test(value) ||
        ddmmyyyyREGEX.test(value) ||
        ddmmmyyyyREGEX.test(value.toUpperCase()) ||
        mmmyyyyREGEX.test(value.toUpperCase()) ||
        yyyyREGEX.test(value.toUpperCase())
        ? null
        : {
          date: {
            invalidPattern: true,
          },
        };
    }
  }
  validatedate(c: UntypedFormControl) {
    const ddmmyyyyREGEX =
      /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
    const ddmmmyyyyREGEX =
      /^(0[1-9]|1\d|2\d|3[01])\/(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;

    //Remove Year only allow validation for DOB Vignesh Pandian P 13/10/2023 
    //  const yyyyREGEX = /^(19|20)\d{2}$/;
    if (c.value) {
      const value = c.value.toUpperCase();
      return ddmmyyyyREGEX.test(value) ||

        ddmmmyyyyREGEX.test(value.toUpperCase())
        // ||  yyyyREGEX.test(value.toUpperCase())
        ? null
        : {
          date: {
            invalidPattern: true,
          },
        };
    }
  }
  validatedateInputwitTilldate(c: UntypedFormControl) {
    const ddmmyyyyREGEX =
      /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
    const ddmmmyyyyREGEX =
      /^(0[1-9]|1\d|2\d|3[01])\/(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const mmmyyyyREGEX =
      /^(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const yyyyREGEX = /^(19|20)\d{2}$/;
    const notProviedREGEX = /^(NOT PROVIDED)$/;
    const tillDateREGEX = /^(TILL DATE)$/;
    if (c.value) {
      const value = c.value.toUpperCase();
      return notProviedREGEX.test(value) ||
        tillDateREGEX.test(value) ||
        ddmmyyyyREGEX.test(value) ||
        ddmmmyyyyREGEX.test(value) ||
        mmmyyyyREGEX.test(value) ||
        yyyyREGEX.test(value)
        ? null
        : {
          date: {
            invalidPattern: true,
          },
        };
    }
  }
  validateTillDate(c: UntypedFormControl) {
    const ddmmyyyyREGEX =
      /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
    const ddmmmyyyyREGEX =
      /^(0[1-9]|1\d|2\d|3[01])\/(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const mmmyyyyREGEX =
      /^(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const tillDateREGEX = /^(TILL DATE)$/;
    const yyyyREGEX = /^(19|20)\d{2}$/;
    if (c.value) {
      const value = c.value.toUpperCase();
      return tillDateREGEX.test(value) ||
        ddmmyyyyREGEX.test(value) ||
        ddmmmyyyyREGEX.test(value) ||
        mmmyyyyREGEX.test(value) ||
        yyyyREGEX.test(value)
        ? null
        : {
          date: {
            invalidPattern: true,
          },
        };
    }
  }
  validateInputDate(c: UntypedFormControl) {
    const ddmmyyyyREGEX =
      /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
    const ddmmmyyyyREGEX =
      /^(0[1-9]|1\d|2\d|3[01])\/(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const mmmyyyyREGEX =
      /^(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const yyyyREGEX = /^(19|20)\d{2}$/;
    const sincebrithREGEX = /^(SINCE BIRTH)?$/;
    if (c.value) {
      const value = c.value.toUpperCase();
      return sincebrithREGEX.test(value) ||
        ddmmyyyyREGEX.test(value) ||
        ddmmmyyyyREGEX.test(value) ||
        mmmyyyyREGEX.test(value) ||
        yyyyREGEX.test(value)
        ? null
        : {
          date: {
            invalidPattern: true,
          },
        };
    }
  }
  validatedateInputStayFromwithBirt(c: UntypedFormControl) {
    const ddmmyyyyREGEX =
      /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
    const ddmmmyyyyREGEX =
      /^(0[1-9]|1\d|2\d|3[01])\/(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const mmmyyyyREGEX =
      /^(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const yyyyREGEX = /^(19|20)\d{2}$/;
    const notProviedREGEX =
      /([Nn]){1}([Oo]){1}([Tt]){1}([ ]){1}([Pp]){1}([Rr]){1}([Oo]){1}([Vv]){1}([Ii]){1}([Dd]){1}([Ee]){1}([Dd]){1}?$/;
    const sincebrithREGEX = /^(SINCE BIRTH)?$/;
    if (c.value) {
      const value = c.value.toUpperCase();
      return sincebrithREGEX.test(value) ||
        notProviedREGEX.test(value) ||
        ddmmyyyyREGEX.test(value) ||
        ddmmmyyyyREGEX.test(value) ||
        mmmyyyyREGEX.test(value) ||
        yyyyREGEX.test(value)
        ? null
        : {
          date: {
            invalidPattern: true,
          },
        };
    }
  }
  dateCompare(
    fromDate: string,
    toDate: string,
    index?: number,
    compId?: number
  ) {
    return (form: any): { [key: string]: any } => {
      let startdate: any;
      let enddate: any;
      form = form.get("UntypedFormGroup") ? form.get("UntypedFormGroup") : form;
      const validationString = form.get("validationString").value;

      if (form.controls[fromDate].value && form.controls[toDate].value) {
        if (
          form.controls[fromDate].valid &&
          !validationString.some(
            (s) =>
              s ===
              (form.controls[fromDate].value
                ? form.controls[fromDate].value.toUpperCase()
                : form.controls[fromDate].value)
          )
        ) {
          startdate = this.common.convertDate(form.controls[fromDate].value);
          if (
            startdate !== "Invalid Date" &&
            Object.prototype.toString.call(startdate) === "[object Date]"
          ) {
            if (
              (form.controls[toDate].valid ||
                form.controls[toDate].errors.comparison === true) &&
              !validationString.some((s) => s === form.controls[toDate].value)
            ) {
              enddate = this.common.convertDate(form.controls[toDate].value);

              if (
                enddate !== "Invalid Date" &&
                Object.prototype.toString.call(enddate) === "[object Date]"
              ) {
                // it is a date
                if (isNaN(startdate.getTime())) {
                  // d.valueOf() could also work
                  // date is not valid
                  form
                    .get(toDate)
                    .setErrors({ date: { invalidPattern: true } });
                  return { date: { invalidPattern: true } };
                } else {
                  // date is valid
                  if (
                    startdate.setHours(0, 0, 0, 0) <=
                    enddate.setHours(0, 0, 0, 0)
                  ) {
                    if (index > 0 && compId > 0) {
                      let compArr: any[] = [];
                      const formRawValue = this.fileSubmission.getRawValue();
                      compArr = formRawValue.screeningComponent.find(
                        (x) => x.compId === compId
                      ).component;
                      for (let i = index; i >= 0; i--) {
                        if (i > 0) {
                          const validation =
                            compArr[i - 1].compRef["validationString"];
                          const validstring = validation
                            ? validation.some(
                              (s) => s === compArr[i - 1].compRef[fromDate]
                            )
                            : "";
                          if (
                            !validstring &&
                            compArr[i - 1].compRef[fromDate]
                          ) {
                            if (
                              i > 0 &&
                              this.common.convertDate(
                                compArr[i - 1].compRef[fromDate]
                              ) <=
                              this.common.convertDate(
                                compArr[index].compRef[fromDate]
                              )
                            ) {
                              form.get(fromDate).setErrors(null);
                              form.get(fromDate).clearValidators();
                              form
                                .get(fromDate)
                                .setErrors({ date: { overLap: true } });
                              return { date: { overLap: true } };
                            } else {
                              if (
                                !isNaN(
                                  this.common
                                    .convertDate(
                                      compArr[i - 1].compRef[fromDate]
                                    )
                                    .getTime()
                                )
                              ) {
                                form.get(fromDate).setErrors(null);
                                form.get(fromDate).clearValidators();
                                return {};
                              }
                            }
                          }
                        }
                      }
                    } else {
                      form.get(toDate).setErrors(null);
                      form.get(toDate).clearValidators();
                      form.get(fromDate).clearValidators();

                      return {};
                    }
                    form.get(toDate).setErrors({ comparison: false });
                    return { comparison: false };
                  } else {
                    form.get(toDate).setErrors({ comparison: true });
                    form.get(toDate).markAllAsTouched();
                    return { comparison: true };
                  }
                }
              } else {
                // not a date
                form.get(toDate).setErrors({ date: { invalidPattern: true } });
                form.get(toDate).markAllAsTouched();
                return { date: { invalidPattern: true } };
              }
            }
          } else {
            if (form.get(fromDate).value !== "SINCE BIRTH") {
              form.get(fromDate).setErrors({ date: { invalidPattern: true } });
              return { date: { invalidPattern: true, overLap: null } };
            } else {
              form.get(fromDate).setErrors(null);
              return {};
            }
          }
        }
      } else if (
        index > 0 &&
        compId > 0 &&
        this.common.convertDate(form.controls[fromDate].value) !==
        "Invalid date" &&
        Object.prototype.toString.call(
          this.common.convertDate(form.controls[fromDate].value)
        ) === "[object Date]"
      ) {
        if (form.get(fromDate).value) {
          let compArr: any[] = [];
          const formRawValue = this.fileSubmission.getRawValue();
          compArr = formRawValue.screeningComponent.find(
            (x) => x.compId === compId
          ).component;
          for (let i = index; i >= 0; i--) {
            if (i > 0) {
              const validation = compArr[i - 1].compRef["validationString"];
              const validstring = validation.some(
                (s) => s === compArr[i - 1].compRef[fromDate]
              );
              if (!validstring && compArr[i - 1].compRef[fromDate]) {
                if (
                  i > 0 &&
                  this.common.convertDate(compArr[i - 1].compRef[fromDate]) <=
                  this.common.convertDate(compArr[index].compRef[fromDate])
                ) {
                  form.get(fromDate).setErrors({ date: { overLap: true } });
                  form.get(fromDate).markAllAsTouched();
                  return { date: { overLap: true } };
                } else {
                  if (
                    !isNaN(
                      this.common
                        .convertDate(compArr[i - 1].compRef[fromDate])
                        .getTime()
                    )
                  ) {
                    form.get(fromDate).setErrors(null);
                    return {};
                  }
                }
              }
            }
          }
        }
      }
    };
  }

  ngAfterViewInit() {
    this.stepperChange(0);
  }
  stepperChange(index: number) {
    const data = document.getElementsByClassName("list");
    if (data.length > 0) {
      data[index].classList.add("active");
      data[index].classList.add("completed");
      for (let i = 0; i < data.length; i++) {
        if (index === i) {
          data[i].classList.add("active");
        } else {
          data[i].classList.remove("active");
        }
      }
    }
    window.scrollTo(0, 0);
  }

  previewInvoice() {
    this.verification
      .getOrganizationLogo(this.screeningDetails1.screening.clientId)
      .subscribe((resp) => {
        if (resp) {
          this.invoice.getPaymentInvoice(this.caseSubmissionList, this.price);
          this.verification.fileLogo = resp;
          this.dialog.open(this.viewInvoice, {
            width: "1200px",
            disableClose: true,
            autoFocus: false,
          });
        }
      });
  }
  saveSubmission() {
    this.stepperFlag = true;
    if (this.fileSubmission.get("candidate").valid) {
      if (this.fileSubmission.get("screening").valid || (this.fileSubmission.get("candidate.screeningId").valid && this.fileSubmission.get("candidate.clientRefNo").valid)) {
        this.saveScreeningFileSubmission();
      } else {
        this.fileSubmission.get("screening").markAllAsTouched();
      }
    } else {
      this.fileSubmission.get("candidate").markAllAsTouched();
    }
  }
  savecase() {
    if (this.applicationId !== 3 && this.step1 == 3) {
      if (this.fileSubmission.get("candidate").dirty) {
        if (this.fileSubmission.get("candidate").valid) {
          this.saveCandidateSubmission();
          if (this.pendingCnt == 0 || this.screeningService.caseFlagType == this.common.PREQCCASE || this.screeningService.caseFlagType === this.common.INSUFFCLEARANCE || this.screeningService.caseFlagType === this.common.FRREJECT || this.screeningService.caseFlagType === this.common.VEREJECT || this.screeningService.IqcByPassFlag === true) {
            this.backToList();
          } else if (
            this.pendingCnt != 0 &&
            this.screeningService.caseFlag === true
          ) {
            this.openAlertDialog();
          }
        }
      }
      if (this.fileSubmission.get("screeningComponent").dirty) {
        if (this.fileSubmission.get("screening").valid) {
          this.saveClientSubmission();

          if (this.pendingCnt == 0 || this.screeningService.caseFlagType == this.common.PREQCCASE || this.screeningService.caseFlagType === this.common.INSUFFCLEARANCE || this.screeningService.caseFlagType === this.common.FRREJECT || this.screeningService.caseFlagType === this.common.VEREJECT || this.screeningService.IqcByPassFlag === true) {
            this.backToList();
          } else if (
            this.pendingCnt != 0 &&
            this.screeningService.caseFlag === true
          ) {
            this.openAlertDialog();
          }
        }
      }
      if (this.fileSubmission.get("screeningComponent").dirty) {
        if (this.fileSubmission.get("candidate").valid) {
          if (this.fileSubmission.get("screening").valid || (this.fileSubmission.get("candidate.screeningId").valid && this.fileSubmission.get("candidate.clientRefNo").valid)) {
            this.multicaseFlag = true;
            const frmGroup = this.viewScreeningComp.getformGroup(this.CurData.compName, this.viewScreeningComp.currentCompTabIndex) as UntypedFormGroup;
            if (frmGroup.valid) {
              const sendToQC = this.screeningService.caseFlagType === this.common.QCREJECT ? true : false;
              const data = { formValue: frmGroup.getRawValue(), compName: this.CurData.compName, sendToQC }
              this.saveScreeningComp(data);
            } else {
              frmGroup.markAllAsTouched();
              frmGroup.updateValueAndValidity();
            }
          } else {
            this.fileSubmission.get("screening").markAllAsTouched();
          }
        } else {
          this.fileSubmission.get("candidate").markAllAsTouched();
        }
      }
      if (!this.fileSubmission.get("screeningComponent").dirty && !this.fileSubmission.get("screeningComponent").dirty && !this.fileSubmission.get("candidate").dirty) {
        this.showNotification(
          "success",
          "Success Message",
          "Save Successfully"
        );
        if (this.pendingCnt == 0 || this.screeningService.caseFlagType == this.common.PREQCCASE || this.screeningService.caseFlagType === this.common.INSUFFCLEARANCE || this.screeningService.caseFlagType === this.common.FRREJECT || this.screeningService.caseFlagType === this.common.VEREJECT || this.screeningService.IqcByPassFlag === true) {
          this.backToList();
        } else if (
          this.pendingCnt != 0 &&
          this.screeningService.caseFlag === true
        ) {
          this.openAlertDialog();
        }
      }
    } else if (this.step1 == 0) {
      if (this.fileSubmission.get("candidate").valid) {
        this.saveCandidateSubmission();
        if (this.pendingCnt == 0 || this.screeningService.caseFlagType == this.common.PREQCCASE || this.screeningService.caseFlagType === this.common.INSUFFCLEARANCE || this.screeningService.caseFlagType === this.common.FRREJECT || this.screeningService.caseFlagType === this.common.VEREJECT || this.screeningService.IqcByPassFlag === true) {
          this.backToList();
        } else if (
          this.pendingCnt != 0 &&
          this.screeningService.caseFlag === true
        ) {
          this.openAlertDialog();
        }
      }
    } else if (this.step1 == 1) {
      if (this.fileSubmission.get("screening").valid) {
        this.saveClientSubmission();

        if (this.pendingCnt == 0 || this.screeningService.caseFlagType == this.common.PREQCCASE || this.screeningService.caseFlagType === this.common.INSUFFCLEARANCE || this.screeningService.caseFlagType === this.common.FRREJECT || this.screeningService.caseFlagType === this.common.VEREJECT || this.screeningService.IqcByPassFlag === true) {
          this.backToList();
        } else if (
          this.pendingCnt != 0 &&
          this.screeningService.caseFlag === true
        ) {
          this.openAlertDialog();
        }
      }
    }
    else {
      this.multicaseFlag = true;
      const frmGroup = this.viewScreeningComp.getformGroup(this.CurData.compName, this.viewScreeningComp.currentCompTabIndex) as UntypedFormGroup;
      if (frmGroup.valid || frmGroup.status == "DISABLED") {
        const sendToQC = this.screeningService.caseFlagType === this.common.QCREJECT ? true : false;
        const data = { formValue: frmGroup.getRawValue(), compName: this.CurData.compName, sendToQC }
        this.saveCommonScreeningComp(data);
      } else {
        frmGroup.markAllAsTouched();
        frmGroup.updateValueAndValidity();
      }
    }
  }
  validationExp(compId, i) {
    let checkFlag: boolean;
    const compList =
      this.screeningService.caseSubmissionList &&
        this.screeningService.caseSubmissionList.screeningCaseComponent.length > 0
        ? this.screeningService.caseSubmissionList.screeningCaseComponent.filter(
          (x) =>
            x.compId === compId &&
            x.daCompValidYear > 0 &&
            x.screeningSubComponent.length === 0
        )
        : [];
    let dayList: any[] = [];
    const count1 = this.fileSubmission.value.screeningComponent[
      i
    ].component.filter((x) => x.active === true).length;
    const count2 = this.fileSubmission.value.screeningComponent[
      i
    ].component.filter((x) => x.active !== true).length;
    if (compList.length > 0) {
      let totCount = compList
        .map((x) => x.daCompValidYear)
        .reduce((a, b) => a + b, 0);
      this.fileSubmission["controls"]["screeningComponent"]["controls"][i][
        "controls"
      ]["component"]["controls"].forEach((element, j) => {
        if (
          compList[0].compId === compId &&
          element["controls"]["active"].value === true
        ) {
          if (
            element["controls"]["compRef"] &&
            element["controls"]["compRef"]["controls"]
          ) {
            if (
              element["controls"]["compRef"]["controls"]["periodOfStayFrom"]
                ? element["controls"]["compRef"]["controls"]["periodOfStayFrom"]
                  .value
                : (element["controls"]["compRef"]["controls"]["periodOfStay"]
                  ? element["controls"]["compRef"]["controls"]["periodOfStay"]
                    .value
                  : element["controls"]["compRef"]["controls"]["fromDate"]
                    ? element["controls"]["compRef"]["controls"]["fromDate"]
                      .value
                    : "") &&
                  element["controls"]["compRef"]["controls"]["periodOfStayTo"]
                  ? element["controls"]["compRef"]["controls"]["periodOfStayTo"]
                    .value
                  : element["controls"]["compRef"]["controls"]["toDate"]
                    ? element["controls"]["compRef"]["controls"]["toDate"].value
                    : ""
            ) {
              const days = this.common.getDateCaluculationDiff(
                element["controls"]["compRef"]["controls"]["periodOfStayFrom"]
                  ? element["controls"]["compRef"]["controls"][
                    "periodOfStayFrom"
                  ].value
                  : element["controls"]["compRef"]["controls"]["periodOfStay"]
                    ? element["controls"]["compRef"]["controls"]["periodOfStay"]
                      .value
                    : element["controls"]["compRef"]["controls"]["fromDate"]
                      .value,
                element["controls"]["compRef"]["controls"]["periodOfStayTo"]
                  ? element["controls"]["compRef"]["controls"]["periodOfStayTo"]
                    .value
                  : element["controls"]["compRef"]["controls"]["toDate"].value,
                this.fileSubmission.value.candidate.dob
              );
              dayList.push(days);
              if (days.includes("Years") || days.includes("year")) {
                const str = days.split(" ")[0];
                const year = str.replace(/\D/g, "");
                if (
                  this.fileSubmission.value.screeningComponent[i].component
                    .length === 1
                ) {
                  if (totCount <= Number(year)) {
                    checkFlag = true;
                    this.checkList.push(checkFlag);
                  } else {
                    checkFlag = false;
                    this.checkList.push(checkFlag);
                    return this.showNotification(
                      "warn",
                      "Alert",
                      "Overall Experience is" +
                      " " +
                      totCount +
                      " ," +
                      "kindly add remaining experience" +
                      " " +
                      compList[0].compName
                    );
                  }
                }
              }
            } else {
              this.checkList.push(true);
            }
          } else {
            this.checkList.push(true);
          }
        } else {
          this.checkList.push(true);
        }
      });
      if (count1 >= 1 && count2 > 0) {
        this.checkList.push(true);
      } else if (count1 >= 1 && dayList.length === count1 && count2 === 0) {
        if (dayList.length > 0) {
          const dList = dayList.filter(
            (x) => x.includes("Years") || x.includes("year")
          );
          const numList: any[] = [];
          if (dList.length > 0) {
            dList.forEach((ele) => {
              const str = ele.split(" ")[0];
              const year = str.replace(/\D/g, "");
              numList.push(year !== "N/A" ? Number(year) : "");
            });
            const finalCount = numList.reduce((a, b) => a + b, 0);
            const remaingcount = totCount - finalCount;
            if (totCount <= finalCount) {
              this.checkList.push(checkFlag);
            } else {
              checkFlag = false;
              this.checkList.push(checkFlag);
              return this.showNotification(
                "warn",
                "Alert",
                "Overall Experience is" +
                " " +
                totCount +
                " ," +
                "kindly add remaining experience" +
                " " +
                remaingcount +
                " " +
                compList[0].compName
              );
            }
          } else {
            checkFlag = false;
            this.checkList.push(checkFlag);
            return this.showNotification(
              "warn",
              "Alert",
              "Overall Experience is" +
              " " +
              totCount +
              " ," +
              "kindly add remaining experience" +
              " " +
              compList[0].compName
            );
          }
        }
      } else {
        this.checkList.push(true);
      }
    } else {
      let subCompList: any[] = [];
      let copysubCompList: any[] = [];
      let aacount = 0;
      if (
        this.screeningService.caseSubmissionList &&
        this.screeningService.caseSubmissionList.screeningCaseComponent.length >
        0
      ) {
        copysubCompList =
          this.screeningService.caseSubmissionList.screeningCaseComponent;
        copysubCompList.forEach((element) => {
          const subComp = element.screeningSubComponent.filter(
            (x) => x.compId === compId && x.daCompValidYear > 0
          );
          if (subComp.length > 0) {
            subComp.forEach((el, i) => {
              subCompList.push(subComp[i]);
            });
          }

          const aList = element.screeningSubComponent.filter(
            (x) =>
              (x.subCompDesc === this.common.ADDRESS &&
                x.subCompName === "Current Address") ||
              (element.compName === this.common.ADDRESS_GEO &&
                x.subCompName === "Current Address") ||
              (x.subCompDesc ===
                this.common.PAN_INDIA_ONLINE_COURT_RECORD_VERIFICATION &&
                x.subCompName === "Current Address" &&
                x.daCompValidYear > 0)
          );
          if (aList.length > 0) {
            aacount = aacount + aList[0].daCompValidYear;
          }
        });
      }
      let subIdList: any[] = [];

      if (subCompList.length > 0) {
        this.fileSubmission["controls"]["screeningComponent"]["controls"][i][
          "controls"
        ]["component"]["controls"].forEach((element, j) => {
          subIdList = subCompList.filter(
            (x) =>
              x.subCompId ===
              element["controls"]["screeningComponentInfo"]["controls"][
                "subCompId"
              ].value
          );
          if (
            element["controls"]["active"].value === true &&
            subIdList.length > 0
          ) {
            if (
              element["controls"]["compRef"] &&
              element["controls"]["compRef"]["controls"]
            ) {
              if (
                element["controls"]["compRef"]["controls"]["periodOfStayFrom"]
                  ? element["controls"]["compRef"]["controls"][
                    "periodOfStayFrom"
                  ].value
                  : (element["controls"]["compRef"]["controls"]["periodOfStay"]
                    ? element["controls"]["compRef"]["controls"][
                      "periodOfStay"
                    ].value
                    : "") &&
                    element["controls"]["compRef"]["controls"]["periodOfStayTo"]
                    ? element["controls"]["compRef"]["controls"]["periodOfStayTo"]
                      .value
                    : ""
              ) {
                this.fileSubmission["controls"]["screeningComponent"][
                  "controls"
                ][i]["controls"]["component"]["controls"][0]["controls"][
                  "screeningComponentInfo"
                ]["controls"]["subCompId"].value;

                const days = this.common.getDateCaluculationDiff(
                  element["controls"]["compRef"]["controls"]["periodOfStayFrom"]
                    ? element["controls"]["compRef"]["controls"][
                      "periodOfStayFrom"
                    ].value
                    : element["controls"]["compRef"]["controls"]["periodOfStay"]
                      .value,
                  element["controls"]["compRef"]["controls"]["periodOfStayTo"]
                    .value,
                  this.fileSubmission.value.candidate.dob
                );
                dayList.push({
                  days: days,
                  id: subIdList[0].subCompId,
                  name: subIdList[0].subCompName,
                  year: subIdList[0].daCompValidYear,
                  cname: subIdList[0].subCompDesc,
                });
                if (subIdList[0].subCompName === "Current Address") {
                  if (days.includes("Years") || days.includes("year")) {
                    const str = days.split(" ")[0];
                    const year = str.replace(/\D/g, "");
                    if (aacount > 0 && aacount <= Number(year)) {
                      checkFlag = true;
                      this.checkList.push(checkFlag);
                    } else {
                      checkFlag = false;
                      this.checkList.push(checkFlag);
                      return this.showNotification(
                        "warn",
                        "Alert",
                        "Overall Experience is" +
                          " " +
                          subIdList[0].subCompName ===
                          "Current Address" && aacount > 0
                          ? aacount
                          : subIdList[0].daCompValidYear +
                          " ," +
                          "kindly add remaining experience" +
                          " " +
                          subIdList[0].subCompDesc +
                          " - " +
                          subIdList[0].subCompName
                      );
                    }
                  } else {
                    checkFlag = false;
                    this.checkList.push(checkFlag);
                    return this.showNotification(
                      "warn",
                      "Alert",
                      "Overall Experience is" +
                      " " +
                      subIdList[0].daCompValidYear +
                      " ," +
                      "kindly add remaining experience" +
                      " " +
                      subIdList[0].subCompDesc +
                      " - " +
                      subIdList[0].subCompName
                    );
                  }
                }
              }
            } else {
              this.checkList.push(true);
            }
          } else {
            this.checkList.push(true);
          }
        });
        if (subIdList.length > 0) {
          const count1 = this.fileSubmission.value.screeningComponent[
            i
          ].component.filter(
            (x) =>
              x.active === true &&
              x.screeningComponentInfo.subCompId === subIdList[0].subCompId
          ).length;
          const count2 = this.fileSubmission.value.screeningComponent[
            i
          ].component.filter(
            (x) =>
              x.active !== true &&
              x.screeningComponentInfo.subCompId === subIdList[0].subCompId
          ).length;

          if (count1 >= 1 && count2 > 0) {
            this.checkList.push(true);
          } else if (count1 >= 1 && subIdList.length > 0) {
            let prList: any[] = [];
            dayList.forEach((ee) => {
              let peList: any[] = [];
              if (ee.name === "Previous Address") {
                prList = this.fileSubmission.value.screeningComponent[
                  i
                ].component.filter(
                  (x) =>
                    x.active === true &&
                    x.screeningComponentInfo.subCompId === ee.id
                );
              }
              if (ee.name === "Permanent Address") {
                peList = this.fileSubmission.value.screeningComponent[
                  i
                ].component.filter(
                  (x) =>
                    x.active === true &&
                    x.screeningComponentInfo.subCompId === ee.id
                );
              }
              if (peList.length > 0 && peList.length === 1) {
                if (ee.days.includes("Years") || ee.days.includes("year")) {
                  const str = ee.days.split(" ")[0];
                  const year = str.replace(/\D/g, "");
                  if (ee.year <= Number(year)) {
                    checkFlag = true;
                    this.checkList.push(checkFlag);
                  } else {
                    checkFlag = false;
                    this.checkList.push(checkFlag);
                    return this.showNotification(
                      "warn",
                      "Alert",
                      "Overall Experience is" +
                      " " +
                      ee.year +
                      " ," +
                      "kindly add remaining experience" +
                      " " +
                      ee.cname +
                      " - " +
                      ee.name
                    );
                  }
                } else {
                  checkFlag = false;
                  this.checkList.push(checkFlag);
                  return this.showNotification(
                    "warn",
                    "Alert",
                    "Overall Experience is" +
                    " " +
                    ee.year +
                    " ," +
                    "kindly add remaining experience" +
                    " " +
                    ee.cname +
                    " - " +
                    ee.name
                  );
                }
              }
            });
            let arrcount = 0;
            const preList = dayList.filter(
              (x) => x.name === "Previous Address"
            );
            if (preList.length > 0) {
              arrcount = this.fileSubmission.value.screeningComponent[
                i
              ].component.filter(
                (x) => x.screeningComponentInfo.subCompId === preList[0].id
              ).length;
            }
            if (prList.length > 0 && prList.length === arrcount) {
              const multiList = dayList.filter(
                (x) => x.id === prList[0].screeningComponentInfo.subCompId
              );
              const dList = multiList.filter(
                (x) => x.days.includes("Years") || x.days.includes("year")
              );
              const numList: any[] = [];
              if (dList.length > 0) {
                dList.forEach((ele) => {
                  const str = ele.days.split(" ")[0];
                  const year = str.replace(/\D/g, "");
                  numList.push(year !== "N/A" ? Number(year) : "");
                });
                const finalCount = numList.reduce((a, b) => a + b, 0);
                const remaingcount = subIdList[0].daCompValidYear - finalCount;
                if (dList[0].year <= finalCount) {
                  this.checkList.push(checkFlag);
                } else {
                  checkFlag = false;
                  this.checkList.push(checkFlag);
                  return this.showNotification(
                    "warn",
                    "Alert",
                    "Overall Experience is" +
                    " " +
                    dList[0].year +
                    " ," +
                    "kindly add remaining experience" +
                    " " +
                    remaingcount +
                    " " +
                    dList[0].cname +
                    " - " +
                    dList[0].name
                  );
                }
              } else {
                checkFlag = false;
                this.checkList.push(checkFlag);
                return this.showNotification(
                  "warn",
                  "Alert",
                  "Overall Experience is" +
                  " " +
                  multiList[0].year +
                  " ," +
                  "kindly add remaining experience" +
                  " " +
                  " " +
                  multiList[0].cnane +
                  " - " +
                  multiList[0].name
                );
              }
            } else {
              this.checkList.push(true);
            }
          }
        }
      }
    }
  }
  public openconfirmationDialog(bodyText, flag) {
    const popupData = {
      action: this.common.DELETECONFIRMATION,
      headerText: "Alert",
      bodyText: flag
        ? "Do you want to submit the application?\n Once you submit, you will be navigate to Payment process."
        : bodyText,
    };
    const dialogRef = this.dialog.open(CommonAlertsComponent, {
      width: "320px",
      data: popupData,
      disableClose: true,
    });
    if (dialogRef) {
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          const action = String(result.type);
          if (action === this.common.DELETECONFIRMATION) {
            this.saveScreeningFileSubmission();
          }
        }
      });
    }
  }
  saveScreeningFileSubmission() {
    this.screeningDetails = this.fileSubmission.getRawValue();
    this.screeningComponent =
      this.fileSubmission.get("screeningComponent").value;
    this.screeningDetails.document = this.screeningDocument;

    if (this.pendingCnt == 0) {
      this.screeningDetails.screening.flag = true;
      this.btnlabel = "Save & Submit";
    } else {
      this.screeningDetails.screening.flag = false;
    }

    this.screeningDetails.gapReason = this.screeningDetails.gapReason.filter(
      (f) => f.reasonFlag !== null
    );

    this.commonSave(true);
  }

  saveScreeningComp(event: any) {
    this.multicaseFlag = false;
    if (event) {
      if (this.screeningService.caseFlagType === this.common.QCREJECT) {
        this.fileSubmission.get("qcRejectFlag").setValue(true);
        this.fileSubmission.get("verificationRejectFlag").setValue(false);
        this.fileSubmission.get("forResearchRejectFlag").setValue(false);
      } else if (this.screeningService.caseFlagType === this.common.VEREJECT) {
        this.fileSubmission.get("qcRejectFlag").setValue(false);
        this.fileSubmission.get("verificationRejectFlag").setValue(true);
        this.fileSubmission.get("forResearchRejectFlag").setValue(false);
      } else if (this.screeningService.caseFlagType === this.common.FRREJECT) {
        this.fileSubmission.get("qcRejectFlag").setValue(false);
        this.fileSubmission.get("verificationRejectFlag").setValue(false);
        this.fileSubmission.get("forResearchRejectFlag").setValue(true);
      } else {
        this.fileSubmission.get("qcRejectFlag").setValue(false);
        this.fileSubmission.get("verificationRejectFlag").setValue(false);
        this.fileSubmission.get("forResearchRejectFlag").setValue(false);
      }

      this.screeningDetails = this.fileSubmission.getRawValue();
      this.screeningComponent =
        this.fileSubmission.get("screeningComponent").value;
      this.screeningService.compId =
        event.formValue.screeningComponentInfo.compId;
      this.screeningDetails.screeningComponent =
        this.screeningDetails.screeningComponent.filter(
          (f) => f.compId === event.formValue.screeningComponentInfo.compId
        );
      this.screeningDetails.document = this.screeningDocument;
      this.empFresherFlag =
        event.compName.toLowerCase() ===
        this.common.EMPLOYMENT_HR.toLowerCase() &&
        event.formValue.compRef.fresherFlag === true &&
        this.screeningDetails.screeningComponent[0].component.length > 1 &&
        ((event.formValue.screeningComponentInfo.screeningCompId === 0 &&
          this.userData.applicationId !== 3));
      if (this.empFresherFlag === true) {
        this.screeningDetails.screeningComponent[0].component = [];
        this.screeningDetails.screeningComponent[0].component.push(
          event.formValue
        );
        const cancelCompList = this.fileSubmission
          .getRawValue()
          .screeningComponent.find(
            (f) => f.compId === event.formValue.screeningComponentInfo.compId
          )
          .component.filter(
            (a) => !(a.compRef && a.compRef.fresherFlag === true)
          );
        this.screeningDetails.screeningComponent[0].component.push(
          ...cancelCompList
        );
      } else {
        this.screeningDetails.screeningComponent[0].component = [];
        this.screeningDetails.screeningComponent[0].component.push(
          event.formValue
        );
      }
      if (this.screeningService.caseFlagType === this.common.PREQCREJECT) {
        this.screeningDetails.screeningComponent[0].component[0].screeningComponentInfo.preQCRejectApproveFlag = true;
      }
      this.componentName = event.compName;
      if (this.multicaseFlag) {
        this.commonSave(true, event.commonSaveclick);
      } else {
        this.commonSave(false, event.commonSaveclick);
      }
    }
  }
  saveCommonScreeningComp(event: any) {

    if (event) {
      if (this.screeningService.caseFlagType === this.common.QCREJECT) {
        this.fileSubmission.get("qcRejectFlag").setValue(true);
        this.fileSubmission.get("verificationRejectFlag").setValue(false);
        this.fileSubmission.get("forResearchRejectFlag").setValue(false);
      } else if (this.screeningService.caseFlagType === this.common.VEREJECT) {
        this.fileSubmission.get("qcRejectFlag").setValue(false);
        this.fileSubmission.get("verificationRejectFlag").setValue(true);
        this.fileSubmission.get("forResearchRejectFlag").setValue(false);
      } else if (this.screeningService.caseFlagType === this.common.FRREJECT) {
        this.fileSubmission.get("qcRejectFlag").setValue(false);
        this.fileSubmission.get("verificationRejectFlag").setValue(false);
        this.fileSubmission.get("forResearchRejectFlag").setValue(true);
      } else {
        this.fileSubmission.get("qcRejectFlag").setValue(false);
        this.fileSubmission.get("verificationRejectFlag").setValue(false);
        this.fileSubmission.get("forResearchRejectFlag").setValue(false);
      }
      this.screeningDetails = this.fileSubmission.getRawValue();
      this.screeningComponent =
        this.fileSubmission.get("screeningComponent").value;
      this.screeningService.compId =
        event.formValue.screeningComponentInfo.compId;
      this.screeningDetails.screeningComponent =
        this.screeningDetails.screeningComponent.filter(
          (f) => f.compId === event.formValue.screeningComponentInfo.compId
        );
      this.screeningDetails.document = this.screeningDocument;
      this.empFresherFlag =
        event.compName.toLowerCase() ===
        this.common.EMPLOYMENT_HR.toLowerCase() &&
        event.formValue.compRef.fresherFlag === true &&
        this.screeningDetails.screeningComponent[0].component.length > 1 &&
        ((event.formValue.screeningComponentInfo.screeningCompId === 0 &&
          this.userData.applicationId !== 3));
      if (this.empFresherFlag === true) {
        this.screeningDetails.screeningComponent[0].component = [];
        this.screeningDetails.screeningComponent[0].component.push(
          event.formValue
        );
        const cancelCompList = this.fileSubmission
          .getRawValue()
          .screeningComponent.find(
            (f) => f.compId === event.formValue.screeningComponentInfo.compId
          )
          .component.filter(
            (a) => !(a.compRef && a.compRef.fresherFlag === true)
          );
        this.screeningDetails.screeningComponent[0].component.push(
          ...cancelCompList
        );
      } else {
        this.screeningDetails.screeningComponent[0].component = [];
        this.screeningDetails.screeningComponent[0].component.push(
          event.formValue
        );
      }
      if (this.screeningService.caseFlagType === this.common.PREQCREJECT) {
        this.screeningDetails.screeningComponent[0].component[0].screeningComponentInfo.preQCRejectApproveFlag = true;
      }
      this.componentName = event.compName;
      this.commonSave(true);
    }
  }
  commonSave(isMultiCompSubmit, saveFlag?: any) {

    if (this.step1 == 0) {
      this.candidateDetails = this.fileSubmission.get('candidate')?.value;
      this.candidateDetails.loginUserId = this.userData.userId;
      const formData = new FormData();

      for (let i = 0; i < this.candidateDetails.document.length; i++) {
        if (this.candidateDetails.document[i].fileName) {
          formData.append(
            "ScreeningDocument_" + i,
            this.candidateDetails.document[i].document
          );
        }
      }
      formData.append('CandidateInfo', JSON.stringify(this.candidateDetails));
      if (this.screeningService.caseFlag === true || this.screeningService.caseFlagType == this.common.PREQCCASE || this.screeningService.caseFlagType === this.common.INSUFFCLEARANCE || this.screeningService.caseFlagType === this.common.FRREJECT || this.screeningService.caseFlagType === this.common.VEREJECT) {
        this.submissionService.saveCandidateClientDetails(formData).subscribe(resp => {
          if (resp) {
            if (resp.success == true) {
              this.screeningService.screeningId = resp.value;
              this.fileSubmission.get('candidate.screeningId')?.setValue(resp.value);
              this.commonResp("case", true, this.screeningDetails);
            }
          }
        });
      }
    } else if (this.step1 == 1) {
      this.clientDetails = this.fileSubmission.get('screening')?.value;
      const formData = new FormData();
      this.clientDetails.screeningId = this.screeningService.screeningId != null ? this.screeningService.screeningId : this.fileSubmission.get('candidate.screeningId')?.value;
      this.clientDetails.caseNo = this.caseNo;
      this.clientDetails.applicationId = this.userData.applicationId;
      if (this.screeningService.caseFlag === true || this.screeningService.caseFlagType === this.common.PREQCCASE || this.screeningService.caseFlagType === this.common.INSUFFCLEARANCE || this.screeningService.caseFlagType === this.common.FRREJECT || this.screeningService.caseFlagType === this.common.VEREJECT) {
        this.submissionService.addClientDetails(this.clientDetails).subscribe(resp => {
          if (resp) {
            if (resp) {
              this.commonResp("case", true, this.screeningDetails);
            }
          }
        });
      }

    } else if (this.step1 == 2) {
      let inSuffCount = 0;
      let documentUploadCount = 0;
      if (this.screeningService.caseFlagType === this.common.NEWCASE) {
        this.screeningDetails.screening.CaseComponent =
          this.screeningService.componentList;
        this.screeningService.componentList.map(
          (m) => (m.caseSubComponent = m.screeningSubComponent)
        );
        this.screeningDetails.screening.clientRefNo =
          this.common.clientRefNoPrefix +
          this.screeningDetails.screening.clientRefNo;
        this.screeningDetails.screening.CaseComponent =
          this.screeningService.componentList.filter((f) =>
            this.screeningDetails.screeningComponent.some(
              (s) => s.compId === f.compId
            )
          );
        if (isNaN(this.screeningDetails.candidate.candidateId)) {
          this.screeningDetails.candidate.candidateId = 0;
        }
      }
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.screeningDetails.screeningComponent.length; i++) {
        // tslint:disable-next-line: prefer-for-of
        for (
          let j = 0;
          j < this.screeningDetails.screeningComponent[i].component.length;
          j++
        ) {
          const compNameDet = this.screeningService.componentList.find(
            (f) => f.compId === this.screeningDetails.screeningComponent[i].compId
          );
          if (
            this.screeningDetails.screeningComponent[i].component[j]
              .screeningInsufficiency &&
            this.screeningDetails.screeningComponent[i].component[j]
              .screeningInsufficiency.requiredLookupId === 226 &&
            this.screeningDetails.screeningComponent[i].component[j]
              .screeningComponentInfo.insuffRaisedFlag
          ) {
            inSuffCount++;
            if (
              this.screeningDetails.screeningComponent[i].component[j]
                .screeningInsufficiency.insuffDocument.length > 0
            ) {
              documentUploadCount++;
            } else {
              const insuffCompName = this.screeningService.componentList.find(
                (x) =>
                  x.compId === this.screeningDetails.screeningComponent[i].compId
              ).compName;
              this.showNotification(
                "warn",
                "Failed to save",
                "Please add  atleast one insufficiency document for " +
                insuffCompName +
                " component"
              );
            }
          }
        }
      }
      if (inSuffCount === documentUploadCount) {
        const formData = new FormData();

        for (
          let i = 0;
          this.screeningDetails.screeningComponent.length > i;
          i++
        ) {
          for (
            let j = 0;
            this.screeningDetails.screeningComponent[i].component.length > j;
            j++
          ) {
            if (
              this.screeningDetails.screeningComponent[i].component[j]
                .criminalCheckCount > 0
            ) {
              const count =
                this.screeningDetails.screeningComponent[i].component[j]
                  .criminalCheckCount;
              for (let c = 0; count > c; c++) {
                const paddress1 =
                  this.screeningDetails.screeningComponent[i].component[j]
                    .compRef;
                if (paddress1 && paddress1.hasOwnProperty("address" + c)) {
                  this.screeningDetails.screeningComponent[i].component[
                    j
                  ].compRef.address.push(paddress1["address" + c]);
                }
              }
            }
          }
        }
        for (
          let i = 0;
          this.screeningDetails.screeningComponent.length > i;
          i++
        ) {
          for (
            let j = 0;
            this.screeningDetails.screeningComponent[i].component.length > j;
            j++
          ) {
            if (
              !this.screeningDetails.screeningComponent[i].component[j]
                .screeningComponentInfo.insuffRaisedFlag
            ) {
              this.screeningDetails.screeningComponent[i].component[
                j
              ].screeningInsufficiency = null;
            }
            const paddress1 =
              this.screeningDetails.screeningComponent[i].component[j].compRef;
            if (paddress1 && paddress1.hasOwnProperty("permanentAddress")) {
              const paddress =
                this.screeningDetails.screeningComponent[i].component[j].compRef
                  .permanentAddress;
              if (
                paddress1.permanentAddress &&
                !(paddress.addLine1 || paddress.postalCode || paddress.countryId)
              ) {
                this.screeningDetails.screeningComponent[i].component[
                  j
                ].compRef.permanentAddress = null;
              } else {
                this.screeningDetails.screeningComponent[i].component[
                  j
                ].compRef.permanentAddress = paddress;
              }
            }
          }
        }
        const cvcomp = this.screeningDetails.screeningComponent.filter(
          (f) => f.compId === 13
        );
        cvcomp.forEach((element, index) => {
          const cvCompRef: any[] = [];
          const dummy: any[] = [];
          const cvContent = this.common.CloneObject(
            element.component[index].compRefDetail
          );
          const category = Object.keys(cvContent);
          for (let i = 0; category.length > i; i++) {
            for (let j = 0; cvContent[category[i]].length > j; j++) {
              const data = cvContent[category[i]][j];
              for (let k = 0; data.length > k; k++) {
                cvCompRef.push(data[k]);
              }
            }
          }
          element.component[index].compRef = cvCompRef;

        });
        let scrnCompData: any[] = [];
        // tslint:disable-next-line: prefer-for-of
        for (
          let j = 0;
          j < this.screeningDetails.screeningComponent.length;
          j++
        ) {
          scrnCompData = this.screeningDetails.screeningComponent[j].component;
          // tslint:disable-next-line: prefer-for-of
          for (let k = 0; k < scrnCompData.length; k++) {
            if (
              scrnCompData[k].screeningComponentInfo.componentDocument &&
              scrnCompData[k].screeningComponentInfo.componentDocument.length > 0
            ) {
              let l = 0;
              for (
                l;
                l <
                scrnCompData[k].screeningComponentInfo.componentDocument.length;
                l++
              ) {
                if (
                  scrnCompData[k].screeningComponentInfo.componentDocument[l]
                    .fileName
                ) {
                  formData.append(
                    "ScreeningComponentDocument_" +
                    scrnCompData[k].screeningComponentInfo.compId +
                    "_" +
                    l,
                    scrnCompData[k].screeningComponentInfo.componentDocument[l]
                      .document
                  );
                }
              }
            }
          }
        }
        this.screeningDetails.screeningComponent.map((m) =>
          m.component.map((m2) => {
            if (m2.screeningComponentInfo.notApplicableFlag) {
              m2.compRef = null;
              m2.compRefDetail = null;
              m2.screeningInsufficiency = null;
            }
          })
        );
        //DAValidYearFlagStart
        if (this.screeningDetails.screeningComponent[0].component[0].screeningComponentInfo.notApplicableFlag != true && this.CurData != undefined && ((this.componentName.toUpperCase() == this.common.EMPLOYMENT_HR && !this.empFresherFlag) || this.componentName.toUpperCase() == this.common.EDUCATION || this.componentName.toUpperCase() == this.common.CRIMINAL_CHECK_PCC1 || this.componentName.toUpperCase() == this.common.CRIMINAL_CHECK_PCC2 || this.componentName.toUpperCase() == this.common.CRIMINAL_CHECK_PCC3 || this.componentName.toUpperCase() == this.common.CRIMINAL_CHECK_PCC3E)) {
          const sData = this.screeningService.componentList.filter(s => s.compId === this.CurData.compId)
          if (sData[0].noOfComponent == this.screeningDetails.screeningComponent[0].component[0].screeningComponentInfo.compIndex) {
            this.screeningDetails.screeningComponent[0].component[0].compRef.finalCompFlag = true;
            this.finalPopupFlag = true;
          } else {
            this.screeningDetails.screeningComponent[0].component[0].compRef.finalCompFlag = false;
            this.finalPopupFlag = false;
          }

        } else {
          this.finalPopupFlag = false;
        }
        //DAValidYearFlagEnd
        //DAValidYearStart
        if ((this.componentName.toUpperCase() == this.common.EMPLOYMENT_HR && this.screeningDetails.screeningComponent[0].component[0].screeningComponentInfo.notApplicableFlag != true)||(this.componentName.toUpperCase() == this.common.CURRENT_EMPLOYMENT_HR && this.screeningDetails.screeningComponent[0].component[0].screeningComponentInfo.notApplicableFlag != true)) {
          if (this.screeningDetails.screeningComponent[0].component[0].compRef.fromDate != null && this.screeningDetails.screeningComponent[0].component[0].compRef.fromDate != 'TILL DATE' && this.screeningDetails.screeningComponent[0].component[0].compRef.fromDate != 'Not Provided' && this.screeningDetails.screeningComponent[0].component[0].compRef.fromDate != 'NOT PROVIDED' && !this.empFresherFlag) {
            this.screeningDetails.screeningComponent[0].component[0].compRef.fromDateVal = this.datePipe.transform(this.screeningDetails.screeningComponent[0].component[0].compRef.fromDate, 'yyyy-MM-dd');
          }
          else {
            this.screeningDetails.screeningComponent[0].component[0].compRef.fromDateVal = this.screeningDetails.screeningComponent[0].component[0].compRef.fromDate;
          }
          if (this.screeningDetails.screeningComponent[0].component[0].compRef.toDate != null && this.screeningDetails.screeningComponent[0].component[0].compRef.toDate != 'TILL DATE' && this.screeningDetails.screeningComponent[0].component[0].compRef.toDate != 'NOT PROVIDED' && this.screeningDetails.screeningComponent[0].component[0].compRef.toDate != 'Not Provided' && !this.empFresherFlag) {
            this.screeningDetails.screeningComponent[0].component[0].compRef.toDateVal = this.datePipe.transform(this.screeningDetails.screeningComponent[0].component[0].compRef.toDate, 'yyyy-MM-dd');
          } else {
            this.screeningDetails.screeningComponent[0].component[0].compRef.toDateVal = this.screeningDetails.screeningComponent[0].component[0].compRef.toDate;
          }
        }

        //DAValidYearEnd
        if (this.screeningDetails.screeningComponent[0].component[0].screeningComponentInfo.compInitiationDate != null) {
          this.screeningDetails.screeningComponent[0].component[0].screeningComponentInfo.compInitiationDate =
            this.common.getTimezoneOffset(this.screeningDetails.screeningComponent[0].component[0].screeningComponentInfo.compInitiationDate, false);
        }
        if (this.empFresherFlag == true) {
          for (let i = 0; i < this.screeningDetails.screeningComponent[0].component.length; i++) {
            if (this.screeningDetails.screeningComponent[0].component[i].screeningComponentInfo.screeningId == 0) {
              this.screeningDetails.screeningComponent[0].component[i].screeningComponentInfo.screeningId = this.fileSubmission.get(
                "candidate.screeningId"
              ).value;
              this.screeningDetails.screeningComponent[0].component[i].screeningComponentInfo.caseNo = this.caseNo
                ? this.caseNo
                : this.screeningService.screenCaseNo;
            }
          }
        } else {
          this.screeningDetails.screening.caseNo = this.caseNo
            ? this.caseNo
            : this.screeningService.screenCaseNo;
          this.screeningDetails.screeningComponent[0].component[0].screeningComponentInfo.screeningId = this.fileSubmission.get('candidate.screeningId')?.value;
          this.screeningDetails.screeningComponent[0].component[0].applicationId = this.userData.applicationId;
        }
        if (this.componentName.toUpperCase() === this.common.EDUCATION && this.screeningDetails.screeningComponent[0].component[0].screeningComponentInfo.notApplicableFlag !== true) {
          if (this.screeningDetails.screeningComponent[0].component[0].compRef.institutionId == 0) {
            this.eduFlag = true;
          } else {
            this.eduFlag = false;
          }
        } else {
          this.eduFlag = false;
        }
        if (this.componentName != "") {
          this.common.getCompsave(this.componentName);
          formData.append(
            "ScreeningDetails",
            JSON.stringify(this.empFresherFlag == true ? this.screeningDetails.screeningComponent[0].component : this.screeningDetails.screeningComponent[0].component[0])
          );
          // this.screenRespFlag = false;
          if (this.screeningDetails.screeningComponent[0].component[0].screeningComponentInfo.screeningCompId > 0 && this.screeningService.caseFlag === true &&
            this.screeningService.caseFlagType !== this.common.PREQCREJECT && isMultiCompSubmit == true) {
            this.commonResp("case", isMultiCompSubmit, this.screeningDetails);
          } else {
            //Save And Submit Next tap call for Pre-Qc Checkscase
            if(this.screeningService.caseFlagType != null && this.screeningService.caseFlagType === this.common.PREQCCASE && this.snFlag ==true && !isMultiCompSubmit){
              this.getReviewDetail();
              this.snFlag = false;
            }else{
            this.submissionService.addScreeningCompDetails(formData, this.empFresherFlag != true ? this.common.saveType : 'SaveEmployeeFresher')
              .subscribe((resp) => {

                if (resp) {
                  if (resp.message != null && resp.message != 'Success') {
                    // if (this.finalPopupFlag === true) {
                    //   this.showNotification("warn",
                    //     "Failure Message", resp.message);
                    // }
                    this.showNotification("warn", "Failure Message", resp.message);
                  }
                  //Added By Megala - 20/04/2024
                 if(resp.value >0){
                  this.automation.CalculateInprogressDays(resp.value).subscribe(resp =>{   
                  });
                 }
                  this.getComponentDetail();
                  if (this.snFlag == true && !isMultiCompSubmit) {
                    this.getReviewDetail();
                    this.snFlag = false;
                  }
                  if (resp.success == true) {
                    this.commonResp("case", isMultiCompSubmit, this.screeningDetails, saveFlag);
                  }
                }
              });
            }
          }
        }
      }
    }
  }
  saveCurrentTab(previousTab: any) {

    switch (this.previousTab) {
      case 0: {
        this.previousTab = previousTab;
        const docsave = this.fileSubmission.get('candidate')?.get('document')?.value;
        const bdocsave = this.bindScreeningDocument;
        if (this.fileSubmission.get('candidate')?.touched || this.fileSubmission.get('candidate')?.dirty || (bdocsave.length < docsave.length) || this.fileSubmission.get('candidate')?.get('screeningId')?.value == 0) {
          if (this.fileSubmission.get('candidate')?.valid) {
            this.candidateDetails = this.fileSubmission.get('candidate')?.value;
            if (this.candidateDetails.dob != null) {
              const date = this.datePipe.transform(this.candidateDetails.dob, 'yyyy-MM-dd');
              this.candidateDetails.dob = date;
            }
            this.candidateDetails.loginUserId = this.userData.userId;
            const formData = new FormData();

            for (let i = 0; i < this.candidateDetails.document.length; i++) {
              if (this.candidateDetails.document[i].fileName) {
                formData.append(
                  "ScreeningDocument_" + i,
                  this.candidateDetails.document[i].document
                );
              }
            }
            formData.append('CandidateInfo', JSON.stringify(this.candidateDetails));

            this.submissionService.saveCandidateClientDetails(formData).subscribe(resp => {
              if (resp) {
                if (resp.success == true) {
                  this.showNotification('success', 'Success Message', 'Save Successfully');
                  if (this.screeningService.screeningdata == undefined || this.screeningService.screeningdata.caseStatusId == null) {
                    this.showNotification("warn", "Alert", 'Please Update Client Details');
                    this.fileSubmission.get('candidate.screeningId')?.setValue(resp.value);
                    this.screeningService.screeningId = resp.value;
                    this.getClientDetails();
                    this.step1 = 1;
                  }
                  this.screeningService.screeningId = resp.value;
                  this.fileSubmission.get('candidate.screeningId')?.setValue(resp.value);

                }
              }
            });
          }
          else {
            this.fileSubmission.get('candidate')?.markAllAsTouched();
          }
        }
        if (previousTab == 3) {
          this.getReviewDetail()
        }
        break;
      }
      case 1: {
        this.previousTab = previousTab;
        if (this.fileSubmission.get('screening')?.valid) {
          this.clientDetails = this.fileSubmission.get('screening')?.value;
          const formData = new FormData();
          this.clientDetails.screeningId = this.fileSubmission.get('candidate.screeningId')?.value > 0 ? this.fileSubmission.get('candidate.screeningId')?.value : this.screeningService.screeningId;
          this.clientDetails.caseNo = this.caseNo;
          this.clientDetails.applicationId = this.userData.applicationId;

          this.submissionService.addClientDetails(this.clientDetails).subscribe(resp => {
            if (resp) {
              if (resp) {
                this.showNotification('success', 'Success Message', 'Save Successfully');

              }
            }
          });
        } else {
          this.fileSubmission.get('screening')?.markAllAsTouched();
        }
        if (previousTab == 3) {
          this.getReviewDetail()
        }
        break;
      }
      case 2: {
        this.previousTab = previousTab;
        if (this.fileSubmission.get('screeningComponent')?.touched || this.fileSubmission.get('screeningComponent')?.dirty) {
          if (this.fileSubmission.get('screeningComponent')?.valid) {
            this.saveScreeningFileSubmission();
          } else {
            this.showNotification("warn", "Alert", "Please Save the Component");
          }
          if (previousTab == 3) {
            this.getReviewDetail()
          }
        }
        break;
      }
      case 3: {
        this.previousTab = previousTab;
      }
    }
    if (previousTab == 3) {
      this.getReviewDetail()
    }
  }
  rejectedCompQcApproval() {
    this.QcService.RejectedCompQcApproval(
      this.screeningService.screeningCompId,
      this.userData.userId
    ).subscribe((resp) => {
      if (resp) {
        this.showNotification(
          "success",
          "Success Message",
          "Approved Successfully"
        );
        this.router.navigate(["/dashboard/screening/caselist"]);
      }
    });
  }
  public openDialog() {
    const popupData = {
      action: this.common.CANDIDATECONFIRM,
      headerText: "Confirmation!",
      bodyText:
        "Thank you for using our portal for online application for background verification," +
        "You have pending components to submit to proceed your background verification,if you click <strong>Ok</strong> then session will be end or else click <strong>Stay</strong> to Continue the session.",
    };
    const dialogRef = this.dialog.open(CommonAlertsComponent, {
      width: "400px",
      data: popupData,
      disableClose: true,
    });
    if (dialogRef) {
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          const action = String(result.type);
          if (action === this.common.CANDIDATECONFIRMNO) {
            this.logout();
          }
        }
      });
    }
  }
  commonResp(fileSubmissionType, isMultiCompSubmit, details, saveFlag?: any) {
    if (this.stepperFlag) {
      if (this.applicationId !== 3) {
        const msg =
          this.screeningService.caseFlagType === this.common.PREQCREJECT ||
            fileSubmissionType === "case" ||
            this.screeningService.caseFlagType === this.common.INSUFFCLEARANCE ||
            this.screeningService.caseFlagType === "QCREJECT"
            ? "Submitted"
            : "Approved";
        this.showNotification(
          "success",
          "Success Message",
          msg + " Successfully"
        );

        if (
          this.screeningService.caseFlagType === this.common.INSUFFCLEARANCE
        ) {
          this.router.navigate(["dashboard/screening/insufflist"]);
        } else if (this.screeningService.caseFlagType === "QCREJECT") {
          this.getFinalReprt(
            this.screeningDetails1.screening.screeningId,
            this.screeningService.screeningCompId
          );
        } else if (
          this.screeningService.caseFlagType === this.common.FRREJECT ||
          this.screeningService.caseFlagType === this.common.VEREJECT
        ) {
          this.router.navigate(["/dashboard/screening/caselist"]);
        } else if (this.screeningService.caseFlagType === this.common.REOPEN) {
          this.router.navigate(["/dashboard/screening/caselist"]);
        }
        this.getAssignedCaseDetails(this.caseNo);
      }
      this.stepperFlag = false;
    } else {
      if (this.applicationId !== 3) {
        const msg =
          this.screeningService.caseFlagType === this.common.PREQCREJECT ||
            fileSubmissionType === "case" ||
            this.screeningService.caseFlagType === this.common.INSUFFCLEARANCE ||
            this.screeningService.caseFlagType === "QCREJECT"
            ? "Submitted"
            : "Approved";
        this.showNotification(
          "success",
          "Success Message",
          msg + " Successfully"
        );
        if (
          this.screeningService.caseFlagType === this.common.INSUFFCLEARANCE
        ) {
          this.router.navigate(["dashboard/screening/insufflist"]);
        } else if (this.screeningService.caseFlagType === "QCREJECT") {
          this.getFinalReprt(
            this.screeningDetails1.screening.screeningId,
            this.screeningService.screeningCompId
          );
        } else if (
          this.screeningService.caseFlagType === this.common.FRREJECT ||
          this.screeningService.caseFlagType === this.common.VEREJECT
        ) {
          this.router.navigate(["/dashboard/screening/caselist"]);
        } else if (this.screeningService.caseFlagType === this.common.REOPEN) {
          this.router.navigate(["/dashboard/screening/caselist"]);
        } else {
          if (this.multicaseFlag == true) {

            let backList: any[] = [];

            if (this.pendingCnt == 0 || this.screeningService.IqcByPassFlag === true
            ) {
              this.backToList();
            } else if (
              this.pendingCnt != 0 &&
              this.screeningService.caseFlag === true
            ) {
              this.openAlertDialog();
            }
          } else {
            if (!this.multicaseFlag && !this.screenRespFlag || saveFlag == true)

              this.getSaveScreeningCompIdDetails(this.CurData);
          }
        }
      }
    }
  }
  getAssignedCompDetails(caseNo: any) {
    this.screeningService
      .getScreeningCompDetails(
        caseNo,
        this.userData.userId,
        this.screeningService.compId,
        this.userData.applicationId
      )
      .subscribe((resp) => {
        if (resp) {
          this.screeningService.Dedata.candidate =
            this.fileSubmission.get("candidate").value;
          this.screeningService.Dedata.screening = resp.screening;
          const Ndata = this.screeningService.Dedata.screeningComponent.filter(
            (s) => s.compId === this.screeningService.compId
          );
          if (resp && Ndata.length != 0) {
            this.screeningService.Dedata.screeningComponent.forEach((e) => {
              if (e.compId == this.screeningService.compId) {
                e.component = resp[0].component;
              }
            });
          }
          if (Ndata.length == 0) {
            this.screeningService.Dedata.screeningComponent.push(
              resp[0]
            );
          }
          this.screeningService.Dedata.screeningCaseComponent =
            resp.screeningCaseComponent;
          this.bindCaseDetail(this.screeningService.Dedata);
          if (this.snFlag == true) {
            this.getReviewDetail();
            window.scroll({ top: 0, left: 0, behavior: "smooth" });
            this.snFlag = false;
          }
        }
      });
  }
  openAlertDialog() {
    this.dialog.open(this.alertTemplate, {
      width: "400px",
      disableClose: true,
    });
  }
  getFinalReprt(screeningId, screeningCompId) {
    this.verification.reportType = "download";
    this.verification.GetResponseDocument(0, screeningCompId).subscribe(
      (res) => {
        this.verification.finalReportvalue = res;
        this.verification.isFinalReport = true;
        this.verification.screeningId = 0;
        this.verification.clientId =
          this.fileSubmission.get("screening.clientId").value;
        this.verification.tempData = {
          verificationScreeningDet: { screeningCompId: screeningCompId },
        };
      },
      (err) => { },
      () => {
        this.verification
          .getOrganizationLogo(
            this.fileSubmission.get("screening.clientId").value
          )
          .subscribe(
            (resp) => {
              if (resp) {
                this.verification.fileLogo = resp;
              }
            },
            (err) => { },
            () => {
              this.verification.isFinalReport = true;
            }
          );
        setTimeout(() => {
          this.router.navigate(["/dashboard/screening/caselist"]);
        }, 100);
      }
    );
  }

  getScreeningComponentStatusDetails(compId: any) {

    if (
      (this.componentName.toUpperCase() !== this.common.EMPLOYMENT_HR &&
      this.componentName.toUpperCase() !== this.common.CURRENT_EMPLOYMENT_HR &&
      this.componentName.toUpperCase() !== this.common.PREVIOUS_EMPLOYMENT_HR &&
        this.componentName.toUpperCase() !== this.common.ADDRESS &&
        this.componentName.toUpperCase() !== this.common.CRIMINAL_CHECK_PCC3 &&
        this.componentName.toUpperCase() !== this.common.CRIMINAL_CHECK_PCC3E &&
        this.componentName.toUpperCase() !== this.common.CRIMINAL_CHECK_PCC1 &&
        this.componentName.toUpperCase() !== this.common.CRIMINAL_CHECK_PCC2 &&
        this.componentName.toUpperCase() !== this.common.ONLINE_CRC &&
        this.componentName.toUpperCase() !== this.common.ONLINE_CRC_INTERNAL &&
        this.componentName.toUpperCase() !== this.common.CRIMINAL_COURT_RECORD &&
        this.componentName.toUpperCase() !== this.common.DRUG_TEST &&
        this.componentName.toUpperCase() != this.common.CRIMINAL_DATABASE &&
        this.componentName.toUpperCase() != this.common.DATABASE_CONDUCT &&
        this.componentName.toUpperCase() != this.common.DATABASE_ADVERSE_MEDIA &&
        this.componentName.toUpperCase() !== this.common.EDUCATION)

    ) {
      if (this.common.statuscFlag == true) {
        this.screeningService
          .screeningComponentStatusDetails(
            compId,
            this.userData.deptId ? this.userData.deptId : 0,
            this.userData.applicationId
          )
          .subscribe((res) => {
            if (res) {
              if (
                this.componentName.toUpperCase() ===
                this.common.COMPANY_SITE_VISIT
              ) {
                this.screeningService.companyList = Object.assign(
                  [],
                  res.company
                );
              }
              if (this.componentName === this.common.LICENSE) {
                this.screeningService.issuingAuthorityList = Object.assign(
                  [],
                  res.issuingAuthorityName
                );
              }
              if (
                this.componentName.toUpperCase() ===
                this.common.EMPLOYMENT_SUPERVISOR ||
                this.componentName.toUpperCase() === this.common.EMPHR_EMPSUP ||
                this.componentName.toUpperCase() ===
                this.common.REFERENCE_SELF_EMPLOYED
              ) {
                this.screeningService.employerSupList = Object.assign(
                  [],
                  res.professionalReference
                );
              }
              if (
                this.componentName.toUpperCase() === this.common.REFERENCE_CHECK
              ) {
                this.screeningService.profNameList = Object.assign(
                  [],
                  res.professionalName
                );
              }
              if (

                this.componentName.toUpperCase() === this.common.OFAC_SDN ||
                this.componentName.toUpperCase() === this.common.ONLINE_CRC ||
                this.componentName.toUpperCase() ===
                this.common.ONLINE_CRC_INTERNAL ||
                this.componentName.toUpperCase() ===
                this.common.CriminalCheckGap
              ) {
                this.screeningService.addressType = Object.assign(
                  [],
                  res.addressType
                );
              }
              this.compBaseDetails = res;
              this.compBaseDetails.screeningStatus =
                this.screeningService.screeningDetail.screeningStatus;
              this.compBaseDetails.vendor =
                this.screeningService.screeningDetail.vendor;
              this.compBaseDetails.dEScreeningStatus =
                this.screeningService.screeningDetail.dEScreeningStatus;
              this.compBaseDetails.currency =
                this.screeningService.screeningDetail.currency;
              this.compBaseDetails.screeningPriority =
                this.screeningService.screeningDetail.screeningPriority;
            }
          });
      }
    } else {
      this.compBaseDetails = this.screeningService.screeningDetail;
      if (this.compBaseDetails != undefined) {
        this.compBaseDetails.addressType = this.screeningService.addressType;
        this.compBaseDetails.addressTypeCheck = this.screeningService.addressTypelst;
      }
    }
  }
  GetCompanyInfo() {
    const values = this.getPaginationValues();
    this.screeningService.GetCompanyInfo(values).subscribe((resp) => {
      if (resp) {
        this.screeningService.employerList = Object.assign([], resp);
      }

    });
  }
  GetInstitutioInfo() {
    const values = this.getPaginationValues();
    this.screeningService.GetInstitutioInfo(values).subscribe((resp) => {
      if (resp) {
        this.screeningService.institutionList = Object.assign([], resp);
      }
    });
  }
  GetInstituteInfo() {
    if (this.componentName.toUpperCase() === this.common.EDUCATION || this.componentName.toUpperCase() === this.common.EDUCATION_INTERNATIONAL) {
      const values = this.getPaginationValues();
      this.screeningService.GetInstituteInfo(values).subscribe((resp) => {
        if (resp) {
          this.screeningService.instituteList = Object.assign([], resp);
        }
      });
    }
  }
  getDegreeLkpList() {
    this.master.getAllDegreeLookup().subscribe((res) => {
      this.screeningService.degreeList = res;
    });
  }
  getUniversity() {
    this.screeningService.getUniversity().subscribe((resp) => {
      if (resp) {
        this.screeningService.Institution = resp;
      }
    });
  }
  GetNotProvidedReasonList() {
    this.screeningService.GetNotProvidedReasonList().subscribe((res) => {
      if (res) {
        this.screeningService.npReasonList = res;
      }
    });
  }

  getPaginationValues() {
    return {
      pageSize: 3150,
      page: 1,
      filters: "",
      sorts: "-empInsId",
      applyPaging: false,
      empInsId: 0,
      department: this.userData.deptName,
      clientIds:this.screeningService.clientId,
      indianClientFlag: this.screeningService.indianClientFlag || this.screeningService.ClientCategoryId == 1 ? true : false,
      clientCategoryId: this.screeningService.ClientCategoryId
    };
  }
  buttonvalue(): string {
    let scount = 0;
    let nscount = 0;
    scount = scount + this.screeningService.submiscomponentList.length;
    for (let i = 0; i < this.screeningService.componentList.length; i++) {
      if (this.screeningService.componentList[i].subCompFlag != true) {
        if (this.screeningService.componentList[i].compName.toUpperCase() != 'GAP REASON') {
          nscount = nscount + this.screeningService.componentList[i].noOfComponent;
        }
      } else if (this.screeningService.componentList[i].subCompFlag == true) {
        for (let j = 0; j < this.screeningService.componentList[i].screeningSubComponent.length; j++) {
          nscount = nscount + this.screeningService.componentList[i].screeningSubComponent[j].noOfComponent;
        }
      }

    }
    this.pendingCnt = nscount - scount;
    if (this.screeningService.caseFlagType === this.common.NEWCASE) {
      const compData = this.fileSubmission.get("screeningComponent").value;

      if (scount == nscount) {
        this.breadcrumbFlags.btnSaveDisabled = false;
      } else {
        this.breadcrumbFlags.btnSaveDisabled = true;
      }
      this.btnlabel = "Save & Submit";
      return "Save & Submit";
    } else {
      if (scount == nscount) {
        this.breadcrumbFlags.btnSave = true;
        this.btnlabel = "Save & Submit";
        if (this.getPaymentFlag()) {
          this.btnlabel = "Submit & Pay";
          this.paymenFlag =
            this.screeningDetails1.candidate.paymentBeforeCandidateFlag;
        }
        return this.btnlabel;
      } else {
        this.breadcrumbFlags.btnSave = false;
        this.btnlabel = "Save";
        return "Save";

      }
    }
  }
  getPaymentFlag() {
    return (
      this.screeningDetails1 &&
      this.screeningDetails1.candidate &&
      this.screeningDetails1.candidate.paymentBeforeCandidateFlag === true &&
      this.userData.applicationId === 3
    );
  }
  openDialogDeleteOrder() {
    this.cancelReason.setValue("");
    this.dialog.open(this.cancelOrder, { width: "700px", disableClose: true });
  }
  deleteOrder() {
    if (this.cancelReason.valid) {
      const popupData = {
        action: this.common.DELETECONFIRMATION,
        headerText: "Alert",
        bodyText:
          "Do you want to cancel the order, Once you cancel, you will logged out.",
      };
      const dialogRef = this.dialog.open(CommonAlertsComponent, {
        width: "320px",
        data: popupData,
        disableClose: true,
      });
      if (dialogRef) {
        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            const action = String(result.type);
            if (action === this.common.DELETECONFIRMATION) {
              this.deleteCancel();
            }
          }
        });
      }
    }
  }
  deleteCancel() {
    this.authService
      .DeletePaymentBeforeCandidateCase(
        this.userData.userId,
        this.cancelReason.value
      )
      .subscribe((res) => {
        if (res) {
          this.showNotification(
            "success",
            "Success Message",
            "Order Deleted Successfully"
          );
          this.logout();
          this.dialogClose();
          this.cancelReason.reset();
        }
      });
  }
  showalert() {
    const popupData = {
      action: this.common.ALERT,
      headerText: "CONFIRMATION",
      bodyText:
        "Thank you for submitting the online application for background verification!" +
        (this.getPaymentFlag()
          ? " Next you will be move to payment for ₹ " + this.price
          : ""),
    };
    const dialogRef = this.dialog.open(CommonAlertsComponent, {
      width: "320px",
      data: popupData,
      disableClose: true,
    });
    if (dialogRef) {
      dialogRef.afterClosed().subscribe((result) => {
        if (this.getPaymentFlag()) {

        } else {
          this.logout();
        }
      });
    }
  }
  logout() {
    const home = JSON.parse(sessionStorage.getItem("user_data"));
    this.authService.LogOut(home.userId, home.logId).subscribe(
      (res) => {
        if (res.success) {
          sessionStorage.removeItem("user_data");
          sessionStorage.clear();
          this.router.navigate(["/"]);
          this.shared.clientApprovalUrl = "";
        }
      },
      (err) => { },
      () => { }
    );
  }

  getClientDetails() {    
  // VTS2-2024-CRT-0206 - Need to set condition in period of stay from date field based on DOB - By Naveen
    this.common.dob ='';
    this.common.dob = this.fileSubmission.get('candidate')?.get('dob')?.value;

    this.btnDownLoad = false;
    if (this.screeningService.screeningId > 0) {
      this.submissionService.getClientDetails(this.caseNo).subscribe((clientResponse) => {
        if (clientResponse) {
          this.bindClientDetails(clientResponse);
        }
      })
    }
  }

  clearFormArray = (formArray: UntypedFormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }
  getScreeningCompDetails(data: any) {
    this.CurData = data;
    if (data.compName !== this.common.EMPLOYMENT_HR &&data.compName !== this.common.CURRENT_EMPLOYMENT_HR &&data.compName !== this.common.PREVIOUS_EMPLOYMENT_HR && data.compName !== this.common.EDUCATION) {
      this.getScreeningComponentStatusDetails(data.compId);
    }
    this.clearFormArray((this.fileSubmission.get('screeningComponent') as UntypedFormArray));
    this.screeningService.formFlag = false;
    this.screeningService.screeningId = this.fileSubmission.get('candidate.screeningId')?.value == 0 ? this.screeningService.screeningId : this.fileSubmission.get('candidate.screeningId')?.value
    if (this.screeningService.screeningId > 0) {
      this.componentName = data.compName;
      this.submissionService.getScreeningCompDetails(this.screeningService.screeningId, data.compId, true).subscribe((resp) => {
        if (resp) {
          if (resp.compId == 18){
            this.common.allEmpComponent = resp.component;
          }
          if (resp.compId == 15){
            this.common.allEduComponent = resp.component;
          }
          this.bindScreeningDetail(resp, data.compId);
        }
      })
    }

  }
  getSaveScreeningCompIdDetails(data: any) {
    this.CurData = data;
    if (data.compName !== this.common.EMPLOYMENT_HR && data.compName !== this.common.EDUCATION) {
      this.getScreeningComponentStatusDetails(data.compId);
    }
    this.screeningService.screeningId = this.fileSubmission.get('candidate.screeningId')?.value == 0 ? this.screeningService.screeningId : this.fileSubmission.get('candidate.screeningId')?.value
    if (this.screeningService.screeningId > 0) {
      this.submissionService.getScreeningCompDetails(this.screeningService.screeningId, data.compId, true).subscribe((resp) => {
        if (resp) {
          if (resp.compId == 18){
            this.common.allEmpComponent = resp.component;
          }
          if (resp.compId == 15){
            this.common.allEduComponent = resp.component;
          }
          this.bindScreeningDetail(resp, data.compId);
        }
      })
    }

  }

  bindClientDetails(clientResponse: any) {
    clientResponse.caseReceivedDate = this.common.getTimezoneOffset(clientResponse.caseReceivedDate, false),
      clientResponse.caseInititationDate = this.common.getTimezoneOffset(clientResponse.caseInititationDate, false),
      clientResponse.clientDateOfJoining = this.common.getTimezoneOffset(clientResponse.clientDateOfJoining, false),
      this.fileSubmission.get('screening')?.patchValue(clientResponse);
    if (clientResponse.chargeCodeFlag != true) {
      this.fileSubmission.get("screening.chargeCode").clearValidators();
      this.fileSubmission.get("screening.chargeCode").updateValueAndValidity();
    }
    this.screeningService.screeningdata = clientResponse;
    this.viewClient.getCompSiteDetails();
  }
  getComponentDetail() {
  // VTS2-2024-CRT-0206 - Need to set condition in period of stay from date field based on DOB - By Naveen
    this.common.dob ='';
    this.common.dob = this.fileSubmission.get('candidate')?.get('dob')?.value;
    
    this.btnDownLoad = false;
    this.submissionService.getScreeningDetails(this.caseNo, true).subscribe((resp) => {
      if (resp) {
        this.screeningService.componentList = resp.screeningCaseComponentVm;
        const mergedComp = this.mergeIndPackComp(this.common.CloneObject(this.screeningService.componentList));
        this.screeningService.componentList = Object.assign([], this.common.CloneObject(mergedComp));
        this.screeningService.submiscomponentList = resp.fSScreeningCompInfoVm
        this.screeningService.componentList.map(e => e.active = false);
        this.screeningService.componentList.sort((a, b) => parseFloat(a.compId) - parseFloat(b.compId));
        const empflag = this.screeningService.componentList.filter(
          (f) =>
            f.compName.toLowerCase() === this.common.EMPLOYMENT_HR.toLowerCase()
        );

        const eduflag = this.screeningService.componentList.filter(
          (f) => f.compName.toLowerCase() === "education"
        );

        const gapreason = this.screeningService.componentList.filter(
          (f) => f.compName.toLowerCase() === "gap reason");
        if ((empflag.length > 0 || eduflag.length > 0) && gapreason.length == 0 && this.screeningService.invitationFlag === true && this.screeningService.caseFlagType === this.common.PREQCCASE) {

          this.screeningService.componentList.push({
            compDesc: "GapReason",
            compId: 0,
            compName: "Gap Reason",
            compType: "",
            componentCustomFields: [],
            criminalCheckCount: 1,
            currencyId: 0,
            cvValidationFields: [],
            deqcFlag: false,
            instruction: "",
            noOfComponent: 1,
            question: [],
            screeningSubComponent: [],
            caseSubComponent: [],
            subCompFlag: false,
            subCompId: 0,
          });

        }
        // this.fileSubmission.get('screeningComponent')?.patchValue(resp.screeningCaseComponentVm);
        if (this.statusgetFlag == true) {
          this.getstatus(resp.screeningCaseComponentVm);
        }
      }
    })
  }

  goToStep(selectedIndex, type) {
    if (type == 'nxt') {
      this.nxtFlag = true;
    } else if (type == 'previous') {
      this.nxtFlag = false;
    }
    switch (this.step1) {
      case 0: {
        if (this.fileSubmission.get('candidate')?.valid) {
          const docsave = this.fileSubmission.get('candidate')?.get('document')?.value;
          const bdocsave = this.bindScreeningDocument;
          if (this.fileSubmission.get('candidate')?.touched || this.fileSubmission.get('candidate')?.dirty || (bdocsave.length < docsave.length) || this.fileSubmission.get('candidate')?.get('screeningId')?.value == 0) {
            this.saveCandidateSubmission();
          }
          this.step1 = selectedIndex;
          this.goNextCall(selectedIndex);
        }
        else {
          this.fileSubmission.get('candidate')?.markAllAsTouched();
          this.step1 = this.step1;
          this.scroll.scrollToError();
        }
        this.stepperChange(this.step1);
        break;
      }
      case 1: {
        if (this.fileSubmission.get('screening')?.valid) {

          this.saveClientSubmission();

          this.step1 = selectedIndex;
          this.goNextCall(selectedIndex);
        } else {
          this.fileSubmission.get('screening')?.markAllAsTouched();
          this.step1 = this.step1
          this.scroll.scrollToError();
        }
        this.stepperChange(this.step1);
        break;
      } case 2: {
        if (this.fileSubmission.get('screeningComponent')?.touched) {
          if (this.fileSubmission.get('screeningComponent')?.valid) {
            if (this.nxtFlag) {
              this.saveScreeningFileSubmission();
            }
            else {
              this.componentName = "";
            }
          }
        } else {
          this.showNotification("warn", "Alert", "Please Save the Component");
        }

        this.step1 = selectedIndex;
        this.goNextCall(selectedIndex);
        this.stepperChange(this.step1);
        break;
      }
      case 3: {
        this.step1 = selectedIndex;
        this.goNextCall(selectedIndex);
        this.stepperChange(this.step1);
      }
    }
  }
  goToStepTab(selectedIndex, type) {
    if (type == 'nxt') {
      this.nxtFlag = true;
    } else if (type == 'previous') {
      this.nxtFlag = false;
    }
    switch (this.step1) {
      case 0: {
        if (this.fileSubmission.get('candidate')?.valid) {
          const docsave = this.fileSubmission.get('candidate')?.get('document')?.value;
          const bdocsave = this.bindScreeningDocument;
          if (this.fileSubmission.get('candidate')?.touched || this.fileSubmission.get('candidate')?.dirty || (bdocsave.length < docsave.length) || this.fileSubmission.get('candidate')?.get('screeningId')?.value == 0) {
            //  this.saveCandidateSubmission();
          }
          // Vignesh M - 10/20/2023 - Client Details Tab save issue
          if (this.screeningService.screeningId > 0) {
            if(selectedIndex ==2 && (this.screeningService.screeningdata == undefined || this.screeningService.screeningdata.caseStatusId == null)) {
              selectedIndex = selectedIndex -1;
            }
            this.step1 = selectedIndex;
            this.goNextCall(selectedIndex);
          }
        }
        else {
          this.fileSubmission.get('candidate')?.markAllAsTouched();
          this.step1 = this.step1;
          this.scroll.scrollToError();
        }
        this.stepperChange(this.step1);
        break;
      }
      case 1: {
        if (this.fileSubmission.get('screening')?.valid) {

          //this.saveClientSubmission();

          this.step1 = selectedIndex;
          this.goNextCall(selectedIndex);

        } else {
          this.fileSubmission.get('screening')?.markAllAsTouched();
          this.step1 = this.step1
          this.scroll.scrollToError();
        }
        this.stepperChange(this.step1);
        break;
      } case 2: {
        if (this.fileSubmission.get('screeningComponent')?.touched) {
          if (this.fileSubmission.get('screeningComponent')?.valid) {
            //this.saveScreeningFileSubmission();
          }
        } else {
          this.showNotification("warn", "Alert", "Please Save the Component");
        }

        this.step1 = selectedIndex;
        this.goNextCall(selectedIndex);
        this.stepperChange(this.step1);
        break;
      }
      case 3: {
        this.step1 = selectedIndex;
        this.goNextCall(selectedIndex);
        this.stepperChange(this.step1);
      }
    }
  }
  goNextCall(selectedIndex: any) {
    switch (selectedIndex) {
      case 0: {
        this.getCandidateDetails(this.screeningService.screenCaseId);
        break;
      }
      case 1: {
        this.getClientDetails();
        break;
      }
      case 2: {
        this.getComponentDetail();
        break;
      }
    }
  }

  goToStepcan(selectedIndex, type) {
    this.Address = this.screeningDetails = this.fileSubmission.getRawValue();

    this.compLength = this.screeningService.componentList.length;
    if (this.compLength === 1) {
      this.nxtstep = false;
    } else {
      this.nxtstep = true;
    }
    this.previewStep = false;
    const preStep = this.step1;
    this.step1 = selectedIndex;
    if (
      this.screeningService.caseFlagType === this.common.NEWCASE ||
      this.manualFilesubmissionRE
    ) {
      this.changeStepperManualCase(selectedIndex);
    } else {
      if (this.step1 === 0) {
        this.step1 = 0;
        this.stepperChange(0);
      }
      if (this.step1 !== 0) {
        if (preStep === 0 && this.fileSubmission.get("candidate").valid) {
          const submissionData = this.fileSubmission.getRawValue();
          this.screeningService.componentList.forEach((element, index) => {
            if (element.subCompFlag) {
              const subcomp = element.screeningSubComponent.find(
                (f) => f.subCompName === "Current Address"
              );
              if (subcomp) {
                const compIndex = submissionData.screeningComponent.findIndex(
                  (i) => i.compId === subcomp.compId
                );
                const subCombIndex = submissionData.screeningComponent[
                  compIndex
                ].component.findIndex(
                  (fi) =>
                    fi.screeningComponentInfo.subCompId === subcomp.subCompId
                );
                const screeningCompArray = this.fileSubmission.get(
                  "screeningComponent"
                ) as UntypedFormArray;
                const compArray = screeningCompArray.controls[compIndex].get(
                  "component"
                ) as UntypedFormArray;
                compArray.controls[subCombIndex]
                  .get("compRef.address")
                  .patchValue({
                    addressId: submissionData.candidate.address.addressId,
                    addLine1: submissionData.candidate.address.addLine1,
                    addLine2: submissionData.candidate.address.addLine2,
                    addLine3: submissionData.candidate.address.addLine3,
                    city: submissionData.candidate.address.city,
                    cityId: submissionData.candidate.address.cityId,
                    district: submissionData.candidate.address.district,
                    districtId: submissionData.candidate.address.districtId,
                    state: submissionData.candidate.address.state,
                    stateId: submissionData.candidate.address.stateId,
                    country: submissionData.candidate.address.country,
                    countryId: submissionData.candidate.address.countryId,
                    postalCode: submissionData.candidate.address.postalCode,
                    place: submissionData.candidate.address.place,
                    locationId: submissionData.candidate.address.locationId,
                  });
                compArray.controls[subCombIndex]
                  .get("compRef.periodOfStay")
                  .setValue(submissionData.candidate.periodOfStay);
                compArray.controls[subCombIndex]
                  .get("compRef.periodOfStayTo")
                  .setValue(submissionData.candidate.periodOfStayTo);
                compArray.controls[subCombIndex].get("active").setValue(true);

              }
            }
          });
        }
        if (this.step1 === 1) {
          if (this.fileSubmission.get("candidate").valid) {
            this.stepperChange(selectedIndex);
          } else {
            this.scroll.scrollToError();
            this.fileSubmission.get("candidate").markAllAsTouched();
            this.step1 = 0;
          }
        } else if (this.step1 === 2) {
          if (this.fileSubmission.get("candidate").valid) {
            this.stepperChange(selectedIndex);
          } else {
            this.scroll.scrollToError();
            this.fileSubmission.get("candidate").markAllAsTouched();
            this.step1 = 0;
            this.stepperChange(0);
          }
        } else if (this.step1 === 3) {
          if (this.fileSubmission.get("candidate").valid) {
            this.getReviewDetail();
            if (
              this.fileSubmission.get("candidate.consentLookupName").value ===
              "EConsent"
            ) {
              if (
                this.fileSubmission.get("candidate.iagreeFlag").value &&
                this.fileSubmission.get("candidate.consentSignature").value
              ) {
                this.stepperChange(selectedIndex);
              } else {
                this.showNotification(
                  "warn",
                  "Failure Message",
                  "Please accept authorization to process further."
                );
                this.step1 = 2;
              }
            } else {
              if (this.fileSubmission.get("document").value.length > 0) {
                this.stepperChange(selectedIndex);
              } else {
                this.showNotification(
                  "warn",
                  "Failure Message",
                  "Upload atleast one LOA document."
                );
                this.step1 = 2;
              }
            }
          }
        } else {
          this.scroll.scrollToError();
          this.fileSubmission.get("candidate").markAllAsTouched();
          this.step1 = 0;
          this.stepperChange(0);
        }
      }
    }
  }
  changeStepperManualCase(selectedIndex: any) {
    if (this.step1 === 0) {
      this.step1 = 0;
      this.stepperChange(0);
    }
    if (this.step1 !== 0) {
      if (this.step1 === 1 || this.step1 === 2) {
        if (
          this.fileSubmission.get("candidate").valid &&
          (this.fileSubmission.get("screening").valid || (this.fileSubmission.get("candidate.screeningId").valid && this.fileSubmission.get("candidate.clientRefNo").valid))
        ) {
          this.stepperChange(selectedIndex);
        } else {
          this.scroll.scrollToError();
          this.fileSubmission.get("candidate").markAllAsTouched();
          this.fileSubmission.get("screening").markAllAsTouched();
          this.step1 = 0;
        }
      }
    }
  }
  resetForm() {
    if (this.step1 === 0) {
      this.fileSubmission.get("candidate").reset();
    }

    if (this.step1 === 1) {
      this.fileSubmission.get("screening").reset();
    }
  }
  showNotification(severity1, summary1, message) {
    this.messageService.add({
      severity: severity1,
      summary: summary1,
      detail: message,
    });
  }
  createDocForm(formArray: UntypedFormArray, docData: any) {
    for (let e = 0; docData.length > e; e++) {
      formArray.push(this.initScreeningDocForm());
    }
  }
createCaseDocForm(formArray: UntypedFormArray, docData: any) {
    for (let e = 0; docData.length > e; e++) {
      formArray.push(this.initScreeningDocForm());
    }
  }
  createCustomFieldForm(formArray: UntypedFormArray, docData: any) {
    for (let c = 0; docData.length > c; c++) {
      formArray.push(this.initclientCustomFieldsForm(docData[c]));
    }
  }
  createMiscForm(formArray: UntypedFormArray, docData = []) {
    if (formArray) {
      if (docData && docData.length > 0) {
        while (formArray.length !== 0) {
          formArray.removeAt(0);
        }
        for (let i = 0; docData.length > i; i++) {
          const required = docData[i].defaultQuestionFlag ? true : false;
          formArray.push(
            new UntypedFormGroup({
              miscId: new UntypedFormControl(docData[i].miscId),
              miscQuestion: new UntypedFormControl(
                docData[i].miscQuestion,
                !required ? Validators.required : null
              ),
              miscAnswer: new UntypedFormControl(
                docData[i].miscAnswer,
                !required ? Validators.required : null
              ),
              defaultQuestionFlag: new UntypedFormControl(
                docData[i].defaultQuestionFlag
              ),
            })
          );
        }
      }
    }
  }
  createPosForm(formArray: UntypedFormArray, docData = []) {
    if (docData && docData.length > 0) {
      while (formArray.length !== 0) {
        formArray.removeAt(0);
      }
      if (docData && docData.length > 0) {
        for (let i = 0; docData.length > i; i++) {
          formArray.push(
            this.fb.group({
              screeningCompId: new UntypedFormControl(docData[i].screeningCompId),
              reportFlag: new UntypedFormControl(false),
              addressId: new UntypedFormControl(docData[i].addressId),
              periodOfStay: new UntypedFormControl(docData[i].periodOfStay),
              periodOfStayTo: new UntypedFormControl(docData[i].periodOfStayTo),
              addressPosId: new UntypedFormControl(docData[i].addressPosId),
              validationString: new UntypedFormControl(["NOT PROVIDED"]),
            })
          );
        }
      }
    }
  }
  removeMiscQues(index: any) {
    if (index > -1) {
      const removeMisc = this.fileSubmission
        .get("component")
        .get("miscQuestion") as UntypedFormArray;
      removeMisc.removeAt(index);
    }
  }
  clientChangeEmit(compId: any) {
    this.getCandidateComplist();
    const frmArray = this.fileSubmission.get("screeningComponent") as UntypedFormArray;

    const length = frmArray.length;
    let ind = length;
    if (frmArray.length > 0) {
      while (ind >= 0) {
        frmArray.removeAt(ind);
        ind--;
      }
    }
    const selectComp = this.screeningService.componentList.filter(s => s.compId == compId)
    // selectComp.forEach((e) => {
    //   if (e.subCompFlag != true) {
    //     e.compInitiationDate = this.fileSubmission.get("candidate.caseInititationDate").value != null ?
    //     this.common.getTimezoneOffset(this.fileSubmission.get("candidate.caseInititationDate").value, false) : this.common.getTimezoneOffset(new Date(), false);
    //   } else if (e.subCompFlag == true) {
    //     e.screeningSubComponent.forEach((el) => {
    //       el.compInitiationDate = this.fileSubmission.get("candidate.caseInititationDate").value != null ?
    //     this.common.getTimezoneOffset(this.fileSubmission.get("candidate.caseInititationDate").value, false) : this.common.getTimezoneOffset(new Date(), false);
    //     });
    //   }
    // })
    const tDate = new Date();
    for (
      let first = 0;
      selectComp.length > first;
      first++
    ) {
      frmArray.push(
        this.initcomponentFormGroup(selectComp[first])
      );
    }
    for (
      let first = 0;
      selectComp.length > first;
      first++
    ) {
      const arr = frmArray.controls[first] as UntypedFormGroup;
      const compId = selectComp[first].compId;
      const deqcFlag = selectComp[first].deqcFlag;
      const compfrmarr = arr.get("component") as UntypedFormArray;
      if (selectComp[first].subCompFlag) {
        for (
          let sec = 0;
          selectComp[first].screeningSubComponent
            .length > sec;
          sec++
        ) {
          for (
            let thr = 0;
            selectComp[first].screeningSubComponent[
              sec
            ].noOfComponent > thr;
            thr++
          ) {
            const comptype =
              selectComp[first].screeningSubComponent[
                sec
              ].packageCount >=
                thr + 1
                ? "Package"
                : "Individual";
            const subCompId =
              selectComp[first].screeningSubComponent[
                sec
              ].subCompId;
            const criminalCheckCount =
              selectComp[first].screeningSubComponent[
                sec
              ].criminalCheckCount;
            const currencyId =
              selectComp[first].screeningSubComponent[
                sec
              ].currencyId;
            const countryId =
              selectComp[first].screeningSubComponent[
                sec
              ].countryId;
            const priorityId =
              selectComp[first].screeningSubComponent[
                sec
              ].priorityId;
            const subCheckFlag =
              selectComp[first].screeningSubComponent[
                sec
              ].subCheckFlag;
            const compInitiationDate =
              selectComp[first].screeningSubComponent[
                sec
              ].compInitiationDate ? selectComp[first].screeningSubComponent[
                sec
              ].compInitiationDate : this.common.getTimezoneOffset(tDate, false);
            compfrmarr.push(
              this.initCommonFormGroup(
                true,
                comptype,
                compId,
                subCompId,
                criminalCheckCount,
                deqcFlag,
                false,
                currencyId,
                countryId,
                priorityId,
                thr,
                subCheckFlag,
                compInitiationDate
              )
            );
          }
        }
      } else {
        for (
          let fou = 0;
          selectComp[first].noOfComponent > fou;
          fou++
        ) {
          const comptype =
            selectComp[first].packageCount >= fou + 1
              ? "Package"
              : "Individual";

          const compInitiationDate =
            selectComp[first].compInitiationDate ? selectComp[first].compInitiationDate : this.common.getTimezoneOffset(tDate, false);
          compfrmarr.push(
            this.initCommonFormGroup(
              false,
              comptype,
              compId,
              null,
              selectComp[first].criminalCheckCount,
              deqcFlag,
              false,
              selectComp[first].currencyId,
              selectComp[first].countryId,
              selectComp[first].priorityId,
              fou,
              selectComp[first].subCheckFlag,
              compInitiationDate
            )
          );
        }
      }
    }
    for (let i = 0; selectComp.length > i; i++) {
      const comfrm = frmArray.controls[i] as UntypedFormGroup;
      const compArray = comfrm.get("component") as UntypedFormArray;
      let count = 0;
      let select = selectComp[i].compName.toUpperCase();
      // console.log(select)
      switch (selectComp[i].compName.toUpperCase()) {
        case this.common.PAN_CARD:
          if (selectComp[i].subCompFlag) {
          } else {
            for (
              let k = 0;
              k < selectComp[i].noOfComponent;
              k++
            ) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl("compRef", this.initPanForm());
              compRefGroup.addControl(
                "componentCustomFields",
                this.initclientCustomFieldsForm(
                  selectComp[i].componentCustomFields
                )
              );
              if (selectComp[i].question.length > 0) {
                compRefGroup.addControl(
                  "miscQuestion",
                  this.common.initMiscForm(
                    selectComp[i].question
                  )
                );
              }
            }
          }
          break;
        case this.common.CREDIT_VERIFICATION:
          if (selectComp[i].subCompFlag) {
          } else {
            for (
              let k = 0;
              k < selectComp[i].noOfComponent;
              k++
            ) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl("compRef", this.initCredForm());
              compRefGroup.addControl(
                "componentCustomFields",
                this.initclientCustomFieldsForm(
                  selectComp[i].componentCustomFields
                )
              );
              if (selectComp[i].question.length > 0) {
                compRefGroup.addControl(
                  "miscQuestion",
                  this.common.initMiscForm(
                    selectComp[i].question
                  )
                );
              }
            }
          }
          break;
        case this.common.EMPLOYMENT_UAN:
          if (selectComp[i].subCompFlag) {
          } else {
            for (
              let k = 0;
              k < selectComp[i].noOfComponent;
              k++
            ) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;

              compRefGroup.addControl("compRef", this.initUanForm());
              compRefGroup.addControl(
                "componentCustomFields",
                this.initclientCustomFieldsForm(
                  selectComp[i].componentCustomFields
                )
              );
              if (selectComp[i].question.length > 0) {
                compRefGroup.addControl(
                  "miscQuestion",
                  this.common.initMiscForm(
                    selectComp[i].question
                  )
                );
              }
            }
          }
          break;
        case this.common.SOCIAL_MEDIA:
          if (selectComp[i].subCompFlag) {
          } else {
            for (
              let k = 0;
              k < selectComp[i].noOfComponent;
              k++
            ) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl("compRef", this.initSocialMediaForm());
              compRefGroup.addControl(
                "componentCustomFields",
                this.initclientCustomFieldsForm(
                  selectComp[i].componentCustomFields
                )
              );
              if (selectComp[i].question.length > 0) {
                compRefGroup.addControl(
                  "miscQuestion",
                  this.common.initMiscForm(
                    selectComp[i].question
                  )
                );
              }
            }
          }
          break;
        case this.common.SOCIAL_MEDIA:
          if (selectComp[i].subCompFlag) {
          } else {
            for (
              let k = 0;
              k < selectComp[i].noOfComponent;
              k++
            ) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl("compRef", this.initSocialMediaForm());
              compRefGroup.addControl(
                "componentCustomFields",
                this.initclientCustomFieldsForm(
                  selectComp[i].componentCustomFields
                )
              );
              if (selectComp[i].question.length > 0) {
                compRefGroup.addControl(
                  "miscQuestion",
                  this.common.initMiscForm(
                    selectComp[i].question
                  )
                );
              }
            }
          }
          break;
        case this.common.OIG:
          if (selectComp[i].subCompFlag) {
          } else {
            for (
              let k = 0;
              k < selectComp[i].noOfComponent;
              k++
            ) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl("compRef", this.initOigForm());
              compRefGroup.addControl(
                "componentCustomFields",
                this.initclientCustomFieldsForm(
                  selectComp[i].componentCustomFields
                )
              );
            }
          }
          break;
        case this.common.MHCP:
          if (selectComp[i].subCompFlag) {
          } else {
            for (
              let k = 0;
              k < selectComp[i].noOfComponent;
              k++
            ) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl("compRef", this.initOigForm());
              compRefGroup.addControl(
                "componentCustomFields",
                this.initclientCustomFieldsForm(
                  selectComp[i].componentCustomFields
                )
              );
            }
          }
          break;
        case this.common.FACISLevel1:
          if (selectComp[i].subCompFlag) {
          } else {
            for (
              let k = 0;
              k < selectComp[i].noOfComponent;
              k++
            ) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl("compRef", this.initFACIS1Form());
              compRefGroup.addControl(
                "componentCustomFields",
                this.initclientCustomFieldsForm(
                  selectComp[i].componentCustomFields
                )
              );
            }
          }
          break;
        case this.common.FACISLevel2:
          if (selectComp[i].subCompFlag) {
          } else {
            for (
              let k = 0;
              k < selectComp[i].noOfComponent;
              k++
            ) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl("compRef", this.initFACIS2Form());
              compRefGroup.addControl(
                "componentCustomFields",
                this.initclientCustomFieldsForm(
                  selectComp[i].componentCustomFields
                )
              );
            }
          }
          break;
        case this.common.FACISLevel3:
          if (selectComp[i].subCompFlag) {
          } else {
            for (
              let k = 0;
              k < selectComp[i].noOfComponent;
              k++
            ) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl("compRef", this.initFACIS3Form());
              compRefGroup.addControl(
                "componentCustomFields",
                this.initclientCustomFieldsForm(
                  selectComp[i].componentCustomFields
                )
              );
            }
          }
          break;
        case this.common.FACIS1M:
          if (selectComp[i].subCompFlag) {
          } else {
            for (
              let k = 0;
              k < selectComp[i].noOfComponent;
              k++
            ) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl("compRef", this.initFACISMForm());
              compRefGroup.addControl(
                "componentCustomFields",
                this.initclientCustomFieldsForm(
                  selectComp[i].componentCustomFields
                )
              );
            }
          }
          break;
        case this.common.TENNESSEE:
          if (selectComp[i].subCompFlag) {
          } else {
            for (
              let k = 0;
              k < selectComp[i].noOfComponent;
              k++
            ) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl("compRef", this.initTENNESSEEForm());
              compRefGroup.addControl(
                "componentCustomFields",
                this.initclientCustomFieldsForm(
                  selectComp[i].componentCustomFields
                )
              );
            }
          }
          break;
        case this.common.ADDRESS:
        case this.common.ADDRESS_GEO:
          if (selectComp[i].subCompFlag) {
            count = 0;
            for (
              let a = 0;
              selectComp[i].screeningSubComponent
                .length > a;
              a++
            ) {
              for (
                let b = 0;
                selectComp[i].screeningSubComponent[a]
                  .noOfComponent > b;
                b++
              ) {
                const addGroup = compArray.controls[count] as UntypedFormGroup;
                addGroup.addControl("compRef", this.initAddressForm());
                addGroup.addControl(
                  "componentCustomFields",
                  this.initclientCustomFieldsForm(
                    selectComp[i].componentCustomFields
                  )
                );
                if (this.screeningService.ClientCategoryId == 4) {
                  if (
                    selectComp[i].question.length > 0
                  ) {
                    addGroup.addControl(
                      "miscQuestion",
                      this.common.initMiscForm(
                        selectComp[i].question
                      )
                    );
                    console.log(addGroup);
                  };
                }
                const addForm = addGroup.get("compRef.address.addressPos") as UntypedFormGroup;

                if (
                  this.applicationId !== 3) {
                  if (
                    (this.userData.subTeamName === "DEPreQC" ||
                      (this.userData.subTeamLeadFlag === true &&
                        this.userData.teamName === "CTS-SubmissionTeam" &&
                        this.userData.teamLeadFlag !== true)) &&
                    selectComp[i]
                      .screeningSubComponent[a].subCompName ===
                    "Current Address"
                  ) {
                    for (const field in addForm.controls) {

                      const addressPosControl = addForm.get(field) as UntypedFormGroup;
                      addressPosControl.get("periodOfStay").setValidators(this.validatedateInputStayFromwithBirt);
                      addressPosControl.addControl("periodOfStayTo", new UntypedFormControl("", this.validatedateInputwitTilldate));
                    }
                  }
                }
                count++;
              }
            }
          } else {
            for (
              let c = 0;
              selectComp[i].noOfComponent > c;
              c++
            ) {
              if (this.screeningService.ClientCategoryId == 4) {
                if (selectComp[i].question.length > 0) {
                  const compRefGroup = compArray.controls[c] as UntypedFormGroup;
                  compRefGroup.addControl(
                    "miscQuestion",
                    this.common.initMiscForm(
                      selectComp[i].question
                    )
                  );
                  console.log(compRefGroup)
                }
              }
            }
          }
          break;
        case this.common.NDOT_DRUG_SCREEN:
          if (selectComp[i].subCompFlag) {
          } else {
            for (
              let k = 0;
              k < selectComp[i].noOfComponent;
              k++
            ) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl("compRef", this.initNdotDrugForm());
              compRefGroup.addControl(
                "componentCustomFields",
                this.initclientCustomFieldsForm(
                  selectComp[i].componentCustomFields
                )
              );
            }
          }
          break;
        case this.common.DRUG_TEST:
          if (selectComp[i].subCompFlag) {
            count = 0;
            for (
              let a = 0;
              selectComp[i].screeningSubComponent
                .length > a;
              a++
            ) {
              for (
                let b = 0;
                selectComp[i].screeningSubComponent[a]
                  .noOfComponent > b;
                b++
              ) {
                const drugGroup = compArray.controls[count] as UntypedFormGroup;
                drugGroup.addControl("compRef", this.initDrugForm());
                drugGroup.addControl(
                  "componentCustomFields",
                  this.initclientCustomFieldsForm(
                    selectComp[i].componentCustomFields
                  )
                );
                count++;
              }
            }
          } else {
            for (
              let c = 0;
              selectComp[i].noOfComponent > c;
              c++
            ) { }
          }
          break;

        case this.common.NATIONAL_IDENTITY_CHECK:
          if (selectComp[i].subCompFlag) {
          } else {
            for (
              let k = 0;
              k < selectComp[i].noOfComponent;
              k++
            ) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl("compRef", this.initNiciForm());
              compRefGroup.addControl(
                "componentCustomFields",
                this.initclientCustomFieldsForm(
                  selectComp[i].componentCustomFields
                )
              );
            }
          }
          break;
        case this.common.DIRECTORSHIP:
          if (selectComp[i].subCompFlag) {
          } else {
            for (
              let k = 0;
              k < selectComp[i].noOfComponent;
              k++
            ) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl("compRef", this.initDirectorshipForm());
              compRefGroup.addControl(
                "componentCustomFields",
                this.initclientCustomFieldsForm(
                  selectComp[i].componentCustomFields
                )
              );
            }
          }
          break;
        case this.common.GSA:
          if (selectComp[i].subCompFlag) {
          } else {
            for (
              let k = 0;
              k < selectComp[i].noOfComponent;
              k++
            ) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl("compRef", this.initGsaForm());
              compRefGroup.addControl(
                "componentCustomFields",
                this.initclientCustomFieldsForm(
                  selectComp[i].componentCustomFields
                )
              );
            }
          }
          break;
        case this.common.FDA:
          if (selectComp[i].subCompFlag) {
          } else {
            for (
              let k = 0;
              k < selectComp[i].noOfComponent;
              k++
            ) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl("compRef", this.initFdaForm());
              compRefGroup.addControl(
                "componentCustomFields",
                this.initclientCustomFieldsForm(
                  selectComp[i].componentCustomFields
                )
              );
            }
          }
          break;
        case this.common.NSR:
          if (selectComp[i].subCompFlag) {
          } else {
            for (
              let k = 0;
              k < selectComp[i].noOfComponent;
              k++
            ) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl("compRef", this.initNsrForm());
              compRefGroup.addControl(
                "componentCustomFields",
                this.initclientCustomFieldsForm(
                  selectComp[i].componentCustomFields
                )
              );
            }
          }
          break;
        case this.common.CURRENT_EMPLOYMENT_HR:
        case this.common.PREVIOUS_EMPLOYMENT_HR:
        case this.common.EMPLOYMENT_HR:
        case this.common.EMPLOYMENT_INTERNATIONAL:
          if (selectComp[i].subCompFlag) {
            for (
              let a = 0;
              selectComp[i].screeningSubComponent
                .length > a;
              a++
            ) {
              for (
                let b = 0;
                selectComp[i].screeningSubComponent[a]
                  .noOfComponent > b;
                b++
              ) {
                const emp = comfrm.controls[b] as UntypedFormGroup;
                emp.addControl(
                  "compRef",
                  this.initEmployerForm(
                    b,
                    selectComp[i].screeningSubComponent[a].compId
                  )
                );
                if (
                  selectComp[i].question.length > 0
                ) {
                  emp.addControl(
                    "miscQuestion",
                    this.common.initMiscForm(
                      selectComp[i].question
                    )
                  );
                  console.log(emp);
                }
              }
            }
          } else {
            for (
              let k = 0;
              k < selectComp[i].noOfComponent;
              k++
            ) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl(
                "compRef",
                this.initEmployerForm(
                  k,
                  selectComp[i].compId
                )
              );
              compRefGroup.addControl("teamName", new UntypedFormControl(this.userData.team));
              const comprefGroup = compRefGroup.get("compRef") as UntypedFormGroup;
              if (this.screeningService.invitationFlag === true) {
                comprefGroup.addControl(
                  "supervisorDet",
                  this.initEmpSupervisorForm(true)
                );

              }
              compRefGroup.addControl(
                "componentCustomFields",
                this.initclientCustomFieldsForm(
                  selectComp[i].componentCustomFields
                )
              );

              if (selectComp[i].question.length > 0) {
                compRefGroup.addControl(
                  "miscQuestion",
                  this.common.initMiscForm(
                    selectComp[i].question
                  )
                );
                console.log(compRefGroup)
              }
            }
          }
          break;
        case this.common.EDUCATION:
        case this.common.EDUCATION_INTERNATIONAL:
          if (selectComp[i].subCompFlag) {
            for (
              let a = 0;
              selectComp[i].screeningSubComponent
                .length > a;
              a++
            ) {
              for (
                let b = 0;
                selectComp[i].screeningSubComponent[a]
                  .noOfComponent > b;
                b++
              ) {
                const edu = comfrm.controls[b] as UntypedFormGroup;

                if (
                  selectComp[i].question.length > 0
                ) {
                  edu.addControl(
                    "miscQuestion",
                    this.common.initMiscForm(
                      selectComp[i].question
                    )
                  );
                }
              }
            }
          } else {
            for (
              let k = 0;
              k < selectComp[i].noOfComponent;
              k++
            ) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl(
                "compRef",
                this.initEducationForm(
                  k,
                  selectComp[i].compId
                )
              );
              compRefGroup.addControl("teamName", new UntypedFormControl(this.userData.team));
              compRefGroup.addControl(
                "componentCustomFields",
                this.initclientCustomFieldsForm(
                  selectComp[i].componentCustomFields
                )
              );
              if (selectComp[i].question.length > 0) {
                compRefGroup.addControl(
                  "miscQuestion",
                  this.common.initMiscForm(
                    selectComp[i].question
                  )
                );
              }
            }
          }
          break;
        case this.common.ONLINE_CRC_INTERNAL:
        case this.common.ONLINE_CRC:
        case this.common.CRIMINAL_COURT_RECORD:
        case this.common.CriminalCheckGap:
          if (selectComp[i].subCompFlag) {
          } else {
            for (
              let k = 0;
              k < selectComp[i].noOfComponent;
              k++
            ) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl("compRef", this.initCrcForm());
              compRefGroup.addControl(
                "componentCustomFields",
                this.initclientCustomFieldsForm(
                  selectComp[i].componentCustomFields
                )
              );
            }
          }
          break;
        case this.common.LICENSE:
          if (selectComp[i].subCompFlag) {
          } else {
            for (
              let k = 0;
              k < selectComp[i].noOfComponent;
              k++
            ) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl("compRef", this.initLicenseForm());
              compRefGroup.addControl(
                "componentCustomFields",
                this.initclientCustomFieldsForm(
                  selectComp[i].componentCustomFields
                )
              );
            }
          }
          break;
        case this.common.PASSPORT:
          if (selectComp[i].subCompFlag) {
          } else {
            for (
              let k = 0;
              k < selectComp[i].noOfComponent;
              k++
            ) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl("compRef", this.initPassportForm());
              compRefGroup.addControl(
                "componentCustomFields",
                this.initclientCustomFieldsForm(
                  selectComp[i].componentCustomFields
                )
              );
            }
          }
          break;
        case this.common.VOTER_ID:
          if (selectComp[i].subCompFlag) {
          } else {
            const compRefGroup = compArray.controls[0] as UntypedFormGroup;
            compRefGroup.addControl("compRef", this.initVoterIdForm());
            compRefGroup.addControl(
              "componentCustomFields",
              this.initclientCustomFieldsForm(
                selectComp[i].componentCustomFields
              )
            );
          }
          break;
        case this.common.COMPANY_SITE_VISIT:
          if (selectComp[i].subCompFlag) {
          } else {
            for (
              let k = 0;
              k < selectComp[i].noOfComponent;
              k++
            ) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl(
                "compRef",
                this.initCompanySiteVisitForm()
              );
              compRefGroup.addControl(
                "componentCustomFields",
                this.initclientCustomFieldsForm(
                  selectComp[i].componentCustomFields
                )
              );
              if (selectComp[i].question.length > 0) {
                compRefGroup.addControl(
                  "miscQuestion",
                  this.common.initMiscForm(
                    selectComp[i].question
                  )
                );
              }
            }
          }
          break;
        case this.common.REFERENCE_CHECK:
          if (selectComp[i].subCompFlag) {
          } else {
            for (
              let k = 0;
              k < selectComp[i].noOfComponent;
              k++
            ) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl("compRef", this.initRefCheckForm());
              compRefGroup.addControl(
                "componentCustomFields",
                this.initclientCustomFieldsForm(
                  selectComp[i].componentCustomFields
                )
              );
              if (selectComp[i].question.length > 0) {
                compRefGroup.addControl(
                  "miscQuestion",
                  this.common.initMiscForm(
                    selectComp[i].question
                  )
                );
              }
            }
          }
          break;
        case this.common.REFERENCE_SELF_EMPLOYED:
          if (selectComp[i].subCompFlag) {
          } else {
            for (
              let k = 0;
              k < selectComp[i].noOfComponent;
              k++
            ) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl("compRef", this.initSelftEmpForm());
              compRefGroup.addControl(
                "componentCustomFields",
                this.initclientCustomFieldsForm(
                  selectComp[i].componentCustomFields
                )
              );
              if (selectComp[i].question.length > 0) {
                compRefGroup.addControl(
                  "miscQuestion",
                  this.common.initMiscForm(
                    selectComp[i].question
                  )
                );
              }
            }
          }
          break;
        case this.common.EMPLOYMENT_SUPERVISOR:
          if (selectComp[i].subCompFlag) {
          } else {
            for (
              let k = 0;
              k < selectComp[i].noOfComponent;
              k++
            ) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl(
                "compRef",
                this.initEmployeementSupForm(true)
              );
              const comprefGroup = compRefGroup.get("compRef") as UntypedFormGroup;
              compRefGroup.addControl(
                "componentCustomFields",
                this.initclientCustomFieldsForm(
                  selectComp[i].componentCustomFields
                )
              );
              if (selectComp[i].question.length > 0) {
                compRefGroup.addControl(
                  "miscQuestion",
                  this.common.initMiscForm(
                    selectComp[i].question
                  )
                );
              }
            }
          }
          break;
        case this.common.CRIMINAL_DATABASE:
        case this.common.OFAC_SDN:
          if (selectComp[i].subCompFlag) {
            count = 0;
            for (
              let a = 0;
              selectComp[i].screeningSubComponent
                .length > a;
              a++
            ) {
              for (
                let b = 0;
                selectComp[i].screeningSubComponent[a]
                  .noOfComponent > b;
                b++
              ) {
                const compRefGroup = compArray.controls[count] as UntypedFormGroup;
                compRefGroup.addControl(
                  "compRef",
                  this.initCriminalDatabaseForm(this.common.CRIMINAL_DATABASE)
                );
                compRefGroup.addControl(
                  "componentCustomFields",
                  this.initclientCustomFieldsForm(
                    selectComp[i].componentCustomFields
                  )
                );
                count++;
              }
            }
          } else {
            for (
              let k = 0;
              k < selectComp[i].noOfComponent;
              k++
            ) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl(
                "compRef",
                this.initCriminalDatabaseForm(
                  selectComp[i].compName.toUpperCase()
                )
              );
              compRefGroup.addControl(
                "componentCustomFields",
                this.initclientCustomFieldsForm(
                  selectComp[i].componentCustomFields
                )
              );
            }
          }
          break;
        case this.common.DATABASE_CONDUCT:  
          if (selectComp[i].subCompFlag) {
            count = 0;
            for (
              let a = 0;
              selectComp[i].screeningSubComponent
                .length > a;
              a++
            ) {
              for (
                let b = 0;
                selectComp[i].screeningSubComponent[a]
                  .noOfComponent > b;
                b++
              ) {
                const compRefGroup = compArray.controls[count] as UntypedFormGroup;
                compRefGroup.addControl(
                  "compRef",
                  this.initCriminalDatabaseForm(this.common.DATABASE_CONDUCT)
                );
                count++;
              }
            }
          } else {
            for (
              let k = 0;
              k < selectComp[i].noOfComponent;
              k++
            ) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl(
                "compRef",
                this.initCriminalDatabaseForm(
                  selectComp[i].compName.toUpperCase()
                )
              );
              compRefGroup.addControl(
                "componentCustomFields",
                this.initclientCustomFieldsForm(
                  selectComp[i].componentCustomFields
                )
              );
            }
          }
        break;
        case this.common.DATABASE_ADVERSE_MEDIA:  
        if (selectComp[i].subCompFlag) {
          count = 0;
          for (
            let a = 0;
            selectComp[i].screeningSubComponent
              .length > a;
            a++
          ) {
            for (
              let b = 0;
              selectComp[i].screeningSubComponent[a]
                .noOfComponent > b;
              b++
            ) {
              const compRefGroup = compArray.controls[count] as UntypedFormGroup;
              compRefGroup.addControl(
                "compRef",
                this.initCriminalDatabaseForm(this.common.DATABASE_ADVERSE_MEDIA)
              );
              count++;
            }
          }
        } else {
          for (
            let k = 0;
            k < selectComp[i].noOfComponent;
            k++
          ) {
            const compRefGroup = compArray.controls[k] as UntypedFormGroup;
            compRefGroup.addControl(
              "compRef",
              this.initCriminalDatabaseForm(
                selectComp[i].compName.toUpperCase()
              )
            );
            
          }
        }
      break;
        case this.common.CRIMINAL_CHECK_PCC1:
        case this.common.CRIMINAL_CHECK_PCC2:
          if (selectComp[i].subCompFlag) {
            count = 0;
            for (
              let a = 0;
              selectComp[i].screeningSubComponent
                .length > a;
              a++
            ) {
              for (
                let b = 0;
                selectComp[i].screeningSubComponent[a]
                  .noOfComponent > b;
                b++
              ) {
                const compRefGroup = compArray.controls[count] as UntypedFormGroup;
                compRefGroup.addControl(
                  "compRef",
                  this.initCriminalCheckPcc2Form()
                );
                compRefGroup.addControl(
                  "componentCustomFields",
                  this.initclientCustomFieldsForm(
                    selectComp[i].componentCustomFields
                  )
                );
                if (
                  selectComp[i].question.length > 0
                ) {
                  compRefGroup.addControl(
                    "miscQuestion",
                    this.common.initMiscForm(
                      selectComp[i].question
                    )
                  );
                }
                count++;
              }
            }
          } else {
            for (
              let k = 0;
              k < selectComp[i].noOfComponent;
              k++
            ) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl(
                "compRef",
                this.initCriminalCheckPcc2Form()
              );
              compRefGroup.addControl(
                "componentCustomFields",
                this.initclientCustomFieldsForm(
                  selectComp[i].componentCustomFields
                )
              );
              for (
                let a = 0;
                a < selectComp[i].criminalCheckCount;
                a++
              ) {
                const addRefGrp = compRefGroup.get("compRef") as UntypedFormGroup;
                addRefGrp.addControl(
                  "address" + a,
                  this.initCommonAddress(a === 0 ? true : false)
                );
                const addRefFrm = compRefGroup
                  .get("compRef")
                  .get("address" + a) as UntypedFormGroup;
                addRefFrm.addControl("addressTypeLookupId", new UntypedFormControl(0));
                addRefFrm.addControl("addressType", new UntypedFormControl(""));
              }
              if (selectComp[i].question.length > 0) {
                compRefGroup.addControl(
                  "miscQuestion",
                  this.common.initMiscForm(
                    selectComp[i].question
                  )
                );
              }
            }
          }
          break;
        case this.common.CRIMINAL_CHECK_PCC3:
        case this.common.CRIMINAL_CHECK_PCC3E:
          if (selectComp[i].subCompFlag) {
            count = 0;
            for (
              let a = 0;
              selectComp[i].screeningSubComponent
                .length > a;
              a++
            ) {
              for (
                let b = 0;
                selectComp[i].screeningSubComponent[a]
                  .noOfComponent > b;
                b++
              ) {
                const compRefGroup = compArray.controls[count] as UntypedFormGroup;
                compRefGroup.addControl("compRef", this.initAddressForm());
                count++;
              }
            }
          } else {
            for (
              let k = 0;
              k < selectComp[i].noOfComponent;
              k++
            ) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl(
                "compRef",
                this.initCriminalCheckPcc3Form()
              );
              compRefGroup.addControl(
                "componentCustomFields",
                this.initclientCustomFieldsForm(
                  selectComp[i].componentCustomFields
                )
              );
            }
          }
          break;
        case this.common.PAN_INDIA_ONLINE_COURT_RECORD_VERIFICATION:
          if (selectComp[i].subCompFlag) {
            count = 0;
            for (
              let a = 0;
              selectComp[i].screeningSubComponent
                .length > a;
              a++
            ) {
              for (
                let b = 0;
                selectComp[i].screeningSubComponent[a]
                  .noOfComponent > b;
                b++
              ) {
                const addGroup = compArray.controls[count] as UntypedFormGroup;
                addGroup.addControl("compRef", this.initAddressForm());
                addGroup.addControl(
                  "componentCustomFields",
                  this.initclientCustomFieldsForm(
                    selectComp[i].componentCustomFields
                  )
                );
                count++;
              }
            }
          } else {
            for (
              let c = 0;
              selectComp[i].noOfComponent > c;
              c++
            ) { }
          }
          break;
        case this.common.EMPHR_EMPSUP:
          if (selectComp[i].subCompFlag) {
          } else {
            for (
              let k = 0;
              k < selectComp[i].noOfComponent;
              k++
            ) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl(
                "compRef",
                this.initEmpHREmpSupForm(
                  k,
                  selectComp[i].compId
                )
              );
              const comprefGroup = compRefGroup.get("compRef") as UntypedFormGroup;
              comprefGroup.addControl(
                "supervisorDet",
                this.initsupervisorDetForm(false)
              );
              compRefGroup.addControl(
                "componentCustomFields",
                this.initclientCustomFieldsForm(
                  selectComp[i].componentCustomFields
                )
              );
              if (selectComp[i].question.length > 0) {
                compRefGroup.addControl(
                  "miscQuestion",
                  this.common.initMiscForm(
                    selectComp[i].question
                  )
                );
              }

            }

          }

          break;
        case this.common.GAP_VERIFICATION:
          if (selectComp[i].subCompFlag) {
          } else {
            for (
              let k = 0;
              k < selectComp[i].noOfComponent;
              k++
            ) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl(
                "compRef",
                this.initGapVerificationForm()
              );
              if (this.screeningService.ClientCategoryId == 4) {
                compRefGroup.addControl(
                  "gapDetails",
                  this.common.initGapForm(
                    selectComp[i].gapDetails, this.screeningService.ClientCategoryId
                  )
                );
              }
              compRefGroup.addControl(
                "componentCustomFields",
                this.initclientCustomFieldsForm(
                  selectComp[i].componentCustomFields
                )
              );
            }
          }
          break;
        case this.common.EMERGENCY_CONTACT_VERIFICATION:
          if (selectComp[i].subCompFlag) {
          } else {
            for (
              let k = 0;
              k < selectComp[i].noOfComponent;
              k++
            ) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl(
                "compRef",
                this.initEmergencyContactVerificationForm()
              );
              compRefGroup.addControl(
                "componentCustomFields",
                this.initclientCustomFieldsForm(
                  selectComp[i].componentCustomFields
                )
              );
              if (selectComp[i].question.length > 0) {
                compRefGroup.addControl(
                  "miscQuestion",
                  this.common.initMiscForm(
                    selectComp[i].question
                  )
                );
              }
            }
          }
          break;
        case this.common.JUDIS_COURT_RECORD:
          if (selectComp[i].subCompFlag) {
          } else {
            for (
              let k = 0;
              k < selectComp[i].noOfComponent;
              k++
            ) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl("compRef", this.initJudisCourtForm());
              compRefGroup.addControl(
                "componentCustomFields",
                this.initclientCustomFieldsForm(
                  selectComp[i].componentCustomFields
                )
              );
            }
          }
          break;
        case this.common.BANK_STATEMENT:
          if (selectComp[i].subCompFlag) {
          } else {
            for (
              let k = 0;
              k < selectComp[i].noOfComponent;
              k++
            ) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl("compRef", this.initBankStatementForm());
              compRefGroup.addControl(
                "componentCustomFields",
                this.initclientCustomFieldsForm(
                  selectComp[i].componentCustomFields
                )
              );
            }
          }
          break;

        case this.common.CV_VALIDATION:
          this.screeningService.cvValidateList =
            selectComp[i].cvValidationFields;
          if (selectComp[i].subCompFlag) {
          } else {
            for (
              let k = 0;
              k < selectComp[i].noOfComponent;
              k++
            ) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl("compRef", new UntypedFormArray([]));
              if (
                selectComp[i].cvValidationFields !==
                null
              ) {
                compRefGroup.addControl(
                  "compRefDetail",
                  this.initcvValidation(
                    selectComp[i].cvValidationFields
                  )
                );
              }
              this.createCvValidationForm(
                compRefGroup.get("compRefDetail") as UntypedFormGroup,
                selectComp[i].cvValidationFields,
                false
              );
              this.screeningService.cvValidateList =
                selectComp[i].cvValidationFields;
            }
          }
          break;

        case this.common.SSN_TRACE:
        case this.common.NATIONWIDE_SEX_OFFENDER_5_YEARS:
        case this.common.NATIONWIDE_SEX_OFFENDER:
        case this.common.CRIMINAL_SEARCH_STATEWIDE_10_YEARS:
        case this.common.CRIMINAL_FEDERAL_NATIONWIDE_5_YEARS:
        case this.common.CRIMINAL_FELONY_MISDEMEANOR_5_YEARS:
        case this.common.CRIMINAL_FEDERAL_NATIONWIDE_10_YEARS:
        case this.common.FEDERAL_DISTRICT_SEARCH_10_YEARS:

        case this.common.CRIMINAL_FELONY_MISDEMEANOR_10_YEARS:
        case this.common.NATIONAL_CRIMINAL_DATABASE_SEARCH_10_YEARS:
        case this.common.NATIONAL_CRIMINAL_LOCATOR:
        case this.common.CRIMINAL_SEARCH_OVERSEAS:
        case this.common.CREDIT_OVERSEAS:
        case this.common.MVR:
          if (selectComp[i].subCompFlag) {
          } else {
            for (
              let k = 0;
              k < selectComp[i].noOfComponent;
              k++
            ) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              let initform;
              if (selectComp[i].compName.toUpperCase() === this.common.SSN_TRACE) {
                initform = this.initSsn();
              } else if (selectComp[i].compName.toUpperCase() === this.common.CRIMINAL_FELONY_MISDEMEANOR_5_YEARS
                || selectComp[i].compName.toUpperCase() === this.common.CRIMINAL_FEDERAL_NATIONWIDE_5_YEARS) {
                initform = this.initAbroad();
              } else {
                initform = this.initNationCriminal();
              }
              compRefGroup.addControl("compRef", initform);
              compRefGroup.addControl(
                "componentCustomFields",
                this.initclientCustomFieldsForm(
                  selectComp[i].componentCustomFields
                )
              );
            }
          }
          break;
      }
    }

    this.screeningService.gapReason.forEach((element) => {
      const gapFormArray = this.fileSubmission.get("gapReason") as UntypedFormArray;
      gapFormArray.push(this.initGapReasonForm(element));
    });
  }
  getScreeningFormGroup(event: any) {
    this.changeCom = event;
    if (event.onInit) {
      this.formEnableDisable(event);
    } else {
      const formgrp = this.fileSubmission.get(
        "screeningComponent"
      ) as UntypedFormArray;
      const compList = this.screeningService.componentList;
      const index = compList.findIndex((f) => f.compName === event.type);
      const filtercomp = compList.find((f) => f.compName === event.type);
      if (filtercomp) {
        const compFormGroup = formgrp.controls[index] as UntypedFormGroup;
        const compFormarray = compFormGroup.get("component") as UntypedFormArray;
        const compindex = compFormarray.length;
        const crimeList = compFormarray.value.filter(
          (x) =>
            x.screeningComponentInfo.deqcFlag === true &&
            x.screeningComponentInfo.compId === event.compId
        );
        const deqcFlag = crimeList.length > 0 ? true : false;
        compFormarray.push(
          this.initCommonFormGroup(
            event.isSubComp,
            event.comptype,
            event.compId,
            event.subCompId,
            filtercomp.criminalCheckCount,
            deqcFlag,
            true,
            filtercomp.currencyId,
            filtercomp.countryId,
            filtercomp.priorityId,
            compindex,
            false,
            filtercomp.compInitiationDate
          )
        );
        const compRefGroup = compFormarray.controls[
          compFormarray.length - 1
        ] as UntypedFormGroup;
        switch (filtercomp.compName) {
          case this.common.ONLINE_CRC_INTERNAL:
          case this.common.ONLINE_CRC:
          case this.common.CRIMINAL_COURT_RECORD:
          case this.common.CriminalCheckGap:
            compRefGroup.addControl("compRef", this.initCrcForm());
            break;
          case this.common.DRUG_TEST:
            compRefGroup.addControl("compRef", this.initDrugForm());
            break;
          case this.common.NDOT_DRUG_SCREEN:
            compRefGroup.addControl("compRef", this.initNdotDrugForm());
            break;
          case this.common.EDUCATION:
          case this.common.EDUCATION_INTERNATIONAL:
            compRefGroup.addControl(
              "compRef",
              this.initEducationForm(compFormarray.length - 1, event.compId)
            );
            compRefGroup.addControl(
              "componentCustomFields",
              this.initclientCustomFieldsForm(filtercomp.componentCustomFields)
            );
            if (filtercomp.question.length > 0) {
              compRefGroup.addControl(
                "miscQuestion",
                this.common.initMiscForm(filtercomp.question)
              );
            }
            break;
          case this.common.EMPLOYMENT_HR:
          case this.common.CURRENT_EMPLOYMENT_HR:
          case this.common.PREVIOUS_EMPLOYMENT_HR:
          case this.common.EMPLOYMENT_INTERNATIONAL:
            compRefGroup.addControl(
              "compRef",
              this.initEmployerForm(compFormarray.length - 1, event.compId)
            );
            const compRef = compRefGroup.get("compRef") as UntypedFormGroup;
            compRefGroup.addControl(
              "componentCustomFields",
              this.initclientCustomFieldsForm(filtercomp.componentCustomFields)
            );
            if (this.screeningDetails1.invitationFlag === true) {
              compRef.addControl(
                "supervisorDet",
                this.initEmpSupervisorForm(true)
              );
            }
            if (filtercomp.question.length > 0) {
              compRefGroup.addControl(
                "miscQuestion",
                this.common.initMiscForm(filtercomp.question)
              );
              console.log(compRefGroup);

            }
            break;
          case this.common.EMPLOYMENT_UAN:
            compRefGroup.addControl(
              "compRef",
              this.initEmployerForm(compFormarray.length - 1, event.compId)
            );
            compRefGroup.addControl(
              "componentCustomFields",
              this.initclientCustomFieldsForm(filtercomp.componentCustomFields)
            );
            if (filtercomp.question.length > 0) {
              compRefGroup.addControl(
                "miscQuestion",
                this.common.initMiscForm(filtercomp.question)
              );
            }
            break;
          case this.common.SOCIAL_MEDIA:
            compRefGroup.addControl("compRef", this.initSocialMediaForm());
            if (filtercomp.question.length > 0) {
            }
            break;
          case this.common.ADDRESS_GEO:
            compRefGroup.addControl("compRef", this.initAddressForm());
            break;
          case this.common.ADDRESS:
            compRefGroup.addControl("compRef", this.initAddressForm());
            if (this.screeningService.ClientCategoryId == 4) {
              if (filtercomp.question.length > 0) {
                compRefGroup.addControl(
                  "miscQuestion",
                  this.common.initMiscForm(filtercomp.question)
                );
                console.log(compRefGroup);

              }
            }
            break;
          case this.common.EMPLOYMENT_SUPERVISOR:
            compRefGroup.addControl(
              "compRef",
              this.initEmployeementSupForm(true)
            );
            if (filtercomp.question.length > 0) {
              compRefGroup.addControl(
                "miscQuestion",
                this.common.initMiscForm(filtercomp.question)
              );
            }
            break;
          case this.common.CRIMINAL_CHECK_PCC1:
          case this.common.CRIMINAL_CHECK_PCC2:
            compRefGroup.addControl(
              "compRef",
              this.initCriminalCheckPcc2Form()
            );
            for (let a = 0; a < filtercomp.criminalCheckCount; a++) {
              const addRefGrp = compRefGroup.get("compRef") as UntypedFormGroup;
              addRefGrp.addControl(
                "address" + a,
                this.initCommonAddress(a === 0 ? true : false)
              );
              const addRefFrm = compRefGroup
                .get("compRef")
                .get("address" + a) as UntypedFormGroup;
              addRefFrm.addControl("periodOfStay", new UntypedFormControl(null));
              addRefFrm.addControl("addressTypeLookupId", new UntypedFormControl(0));
              addRefFrm.addControl("addressType", new UntypedFormControl(""));
            }
            if (filtercomp.question.length > 0) {
              compRefGroup.addControl(
                "miscQuestion",
                this.common.initMiscForm(filtercomp.question)
              );
            }
            break;
          case this.common.CRIMINAL_CHECK_PCC3:
          case this.common.CRIMINAL_CHECK_PCC3E:
            compRefGroup.addControl(
              "compRef",
              this.initCriminalCheckPcc3Form()
            );
            break;
          case this.common.PAN_INDIA_ONLINE_COURT_RECORD_VERIFICATION:
            compRefGroup.addControl("compRef", this.initAddressForm());
            break;
          case this.common.OIG:
            compRefGroup.addControl("compRef", this.initOigForm());
            break;
          case this.common.MHCP:
            compRefGroup.addControl("compRef", this.initOigForm());
            break;
          case this.common.FACISLevel1:
            compRefGroup.addControl("compRef", this.initFACIS1Form());
            break;
          case this.common.FACISLevel2:
            compRefGroup.addControl("compRef", this.initFACIS2Form());
            break;
          case this.common.FACISLevel3:
            compRefGroup.addControl("compRef", this.initFACIS3Form());
            break;
          case this.common.FACIS1M:
            compRefGroup.addControl("compRef", this.initFACISMForm());
            break;
          case this.common.TENNESSEE:
            compRefGroup.addControl("compRef", this.initTENNESSEEForm());
            break;
          case this.common.EMPHR_EMPSUP:
            compRefGroup.addControl(
              "compRef",
              this.initEmpHREmpSupForm(compFormarray.length + 1, event.compId)
            );
            if (filtercomp.question.length > 0) {
              compRefGroup.addControl(
                "miscQuestion",
                this.common.initMiscForm(filtercomp.question)
              );
            }
            break;
          case this.common.GAP_VERIFICATION:
            compRefGroup.addControl("compRef", this.initGapVerificationForm());
            if (this.screeningService.ClientCategoryId == 4) {
              compRefGroup.addControl(
                "gapDetails",
                this.common.initGapForm(
                  filtercomp.gapDetails, this.screeningService.ClientCategoryId
                )

              );
            }
            break;
          case this.common.EMERGENCY_CONTACT_VERIFICATION:
            compRefGroup.addControl(
              "compRef",
              this.initEmergencyContactVerificationForm()
            );
            if (filtercomp.question.length > 0) {
              compRefGroup.addControl(
                "miscQuestion",
                this.common.initMiscForm(filtercomp.question.length)
              );
            }
            break;
          case this.common.JUDIS_COURT_RECORD:
            compRefGroup.addControl("compRef", this.initJudisCourtForm());

            break;
          case this.common.BANK_STATEMENT:
            compRefGroup.addControl("compRef", this.initBankStatementForm());
            break;
          case this.common.COMPANY_SITE_VISIT:
            compRefGroup.addControl("compRef", this.initCompanySiteVisitForm());
            if (filtercomp.question.length > 0) {
              compRefGroup.addControl(
                "miscQuestion",
                this.common.initMiscForm(filtercomp.question.length)
              );
            }
            break;
          case this.common.REFERENCE_CHECK:
            compRefGroup.addControl("compRef", this.initRefCheckForm());
            if (filtercomp.question.length > 0) {
              compRefGroup.addControl(
                "miscQuestion",
                this.common.initMiscForm(filtercomp.question)
              );
            }
            break;
          case this.common.REFERENCE_SELF_EMPLOYED:
            compRefGroup.addControl("compRef", this.initSelftEmpForm());
            if (filtercomp.question.length > 0) {
              compRefGroup.addControl(
                "miscQuestion",
                this.common.initMiscForm(filtercomp.question)
              );
            }
            break;
          case this.common.CRIMINAL_DATABASE:
          case this.common.OFAC_SDN:
            compRefGroup.addControl(
              "compRef",
              this.initCriminalDatabaseForm(this.common.OFAC_SDN)
            );
            break;
          case this.common.DATABASE_CONDUCT:
            compRefGroup.addControl(
              "compRef",
              this.initCriminalDatabaseForm(this.common.DATABASE_CONDUCT)
            );
            break;
          case this.common.DATABASE_ADVERSE_MEDIA:
            compRefGroup.addControl(
              "compRef",
              this.initCriminalDatabaseForm(this.common.DATABASE_ADVERSE_MEDIA)
            );
            break;
          case this.common.LICENSE:
            compRefGroup.addControl("compRef", this.initLicenseForm());
            break;
          case this.common.CREDIT_VERIFICATION:
            compRefGroup.addControl("compRef", this.initCredForm());
            if (filtercomp.question.length > 0) {
              compRefGroup.addControl(
                "miscQuestion",
                this.common.initMiscForm(filtercomp.question.length)
              );
            }
            break;

          default:
            break;
        }
      }
    }
  }
  validateComp() {
    const compList = this.screeningService.componentList;
    compList.forEach((element, index) => {
      const formArray = this.fileSubmission.get(
        "screeningComponent"
      ) as UntypedFormArray;
      const compFormGroup = formArray.controls[index] as UntypedFormGroup;
      const compFormarray = compFormGroup.get("component") as UntypedFormArray;
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < compFormarray.length; i++) {
        const specFormGroup = compFormarray.controls[i] as UntypedFormGroup;
        if (specFormGroup.valid) {
          specFormGroup.get("active").setValue(true);
        } else {
          specFormGroup.get("active").setValue(false);
        }
      }
    });
  }
  getSearchComponents() {
    this.screeningService.getScreeningEntryDetails(2).subscribe((resp) => {
      if (resp) {
      }
    });
  }
  rejectScreeningFileSubmission() {
    if (this.rejectComments.valid) {
      this.dialog.closeAll();
      const formData = new FormData();
      const type = "Reject";
      this.preQCRejectVm.comments = this.rejectComments.value;
      this.preQCRejectVm.loggedIn = this.userData.userId;
      this.preQCRejectVm.screeningCompId =
        this.screeningCompId === 0 ? null : this.screeningCompId;
      this.preQCRejectVm.screeningId = this.screeningService.screeningId > 0 ? this.fileSubmission.get('candidate.screeningId')?.value : this.screeningService.screeningId;
      this.preQCRejectVm.type = this.singleCompReject
        ? "ScreeningComponent"
        : "Screening";
      formData.append("RejectDetails", JSON.stringify(this.preQCRejectVm));
      this.screeningService
        .addPreQCScreeningDetails(formData, type)
        .subscribe((resp) => {
          if (resp) {
            this.showNotification("success", "success", "Reject successfully");
            if (!this.singleCompReject) {
              this.backToList();
            } else {
              this.getScreeningCompDetails(this.CurData);
            }
          }
        });
    }
  }
  rejecrComp(data: any) {
    if (data && data.screeningComponentInfo.screeningCompId > 0) {
      this.singleCompReject = true;
      this.rejectedCommentsList = data.rejectComments;
      this.screeningCompId = data.screeningComponentInfo.screeningCompId;
      this.rejectPreQC();
    }
  }
  getLastId(e: any) {
    if (this.compLength === 1) {
      this.previewStep = false;
      this.nxtstep = false;
      return;
    }
    this.lastFlag = e;
    if (this.lastFlag === "last") {
      this.previewStep = true;
      this.nxtstep = false;
    } else if (this.lastFlag === "first") {
      this.previewStep = false;
      this.nxtstep = true;
    } else {
      this.previewStep = true;
      this.nxtstep = true;
    }
  }
  rejectPreQC() {
    this.dialog.open(this.dlgReject, { width: "700px", disableClose: true });
  }

  formEnableDisable(event?) {
    const formgrp = this.fileSubmission.get("screeningComponent") as UntypedFormArray;
    const fulldata = this.fileSubmission.getRawValue();
    const compList = this.screeningService.componentList.filter(s => s.compName == this.common.componentName);
    compList.forEach((com, index) => {
      const compFormGroup = formgrp.controls[0] as UntypedFormGroup;
      const compFormarray = compFormGroup.get("component") as UntypedFormArray;
      for (let i = 0; i < compFormarray.length; i++) {
        const spectFormGroup = compFormarray.controls[i] as UntypedFormGroup;
        const data = spectFormGroup.getRawValue();
        if (this.userData.applicationId !== 3) {
          if (
            this.screeningService.caseFlag ||
            this.screeningService.caseFlagType ===
            this.common.INSUFFCLEARANCE ||
            this.screeningService.caseFlagType === this.common.SUBCHECK ||
            (this.screeningService.caseFlagType === this.common.DASUBCHECK && data.submittedFlag === false)
          ) {
            if (data.screeningComponentInfo.notApplicableFlag === true) {
              if (data.screeningComponentInfo.screeningCompId > 0) {
                timer(0, 25).subscribe((x) => spectFormGroup.disable());
              } else {
                const screeningForm = spectFormGroup.get(
                  "screeningComponentInfo"
                );
                setTimeout(() => {
                  spectFormGroup.get("compRef").disable();
                  spectFormGroup.get("screeningInsufficiency").disable();
                  screeningForm.get("componentDocument").disable();
                  screeningForm.get("requestedDate").disable();
                  screeningForm.get("screenStatusId").disable();
                  screeningForm.get("screeningId").disable();
                  screeningForm.get("vendorId").disable();
                  screeningForm.get("currencyId").disable();
                }, 0);
              }
            } else if (data.submittedFlag) {
              if (
                this.userData.subTeamName === "DEPreQC" ||
                (this.userData.subTeamLeadFlag === true &&
                  this.userData.teamName === "CTS-SubmissionTeam" &&
                  this.userData.teamLeadFlag !== true) ||
                this.screeningService.caseFlagType === this.common.PREQCCASE
              ) {
                spectFormGroup.enable();
              } else {
                timer(0, 25).subscribe((x) => spectFormGroup.disable());
              }
            } else {
              if (
                this.userData.subTeamName === "DEPreQC" ||
                (this.userData.subTeamLeadFlag === true &&
                  this.userData.teamName === "CTS-SubmissionTeam" &&
                  this.userData.teamLeadFlag !== true) ||
                this.screeningService.caseFlagType === this.common.PREQCCASE
              ) {
                timer(0, 25).subscribe((x) => spectFormGroup.disable());
              } else {
                spectFormGroup.enable();
              }

              if (spectFormGroup.get("compRef.address")) {
                if (
                  spectFormGroup.get("compRef.address.countryId") &&
                  !spectFormGroup.get("compRef.address.countryId").value
                ) {
                  setTimeout(() => {
                    spectFormGroup.get("compRef.address.stateId").disable();
                    spectFormGroup.get("compRef.address.districtId").disable();
                    spectFormGroup.get("compRef.address.cityId").disable();
                    spectFormGroup.get("compRef.address.locationId").disable();
                  }, 0);
                }
              }
            }
          } else if (
            this.screeningService.caseFlagType === this.common.QCREJECT ||
            this.screeningService.caseFlagType === this.common.FRREJECT ||
            this.screeningService.caseFlagType === this.common.VEREJECT ||
            this.screeningService.caseFlagType === this.common.REOPEN
          ) {
            if (
              !data.preQCApproveFlag &&
              !data.preQCRejectFlag &&
              !data.submittedFlag
            ) {
              spectFormGroup.enable();
            }
          } else if (
            this.screeningService.caseFlagType === this.common.NEWCASE
          ) {
            spectFormGroup.enable();
          } else if (
            this.screeningService.caseFlagType === this.common.PREQCREJECT
          ) {
            if (
              data.preQCRejectFlag &&
              data.screeningComponentInfo.notApplicableFlag === false
            ) {
              spectFormGroup.enable();
            } else {
              timer(0, 25).subscribe((x) => spectFormGroup.disable());
            }
          } else if (
            this.screeningService.caseFlagType === this.common.PREQCCASE
          ) {
            if (
              data.submittedFlag &&
              data.preQCRejectFlag == false &&
              data.preQCApproveFlag == false
            ) {
              if (this.screeningService.invitationFlag === true) {
                if (
                  this.userData.subTeamName === "DEPreQC" ||
                  (this.userData.subTeamLeadFlag === true &&
                    this.userData.teamName === "CTS-SubmissionTeam" &&
                    this.userData.teamLeadFlag !== true) ||
                  this.screeningService.caseFlagType === this.common.PREQCCASE
                ) {
                  if (data.screeningComponentInfo.clientApprovalFlag !== true) {
                    timer(0, 25).subscribe((x) => spectFormGroup.disable());
                  } else {
                    spectFormGroup.enable();
                  }
                } else {
                  if (data.screeningComponentInfo.clientApprovalFlag === true) {
                    spectFormGroup.enable();
                  } else {
                    timer(0, 25).subscribe((x) => spectFormGroup.disable());
                  }
                }
              } else {
                if (data.submittedFlag && data.preQCApproveFlag == false) {
                  spectFormGroup.enable();
                } else {
                  timer(0, 25).subscribe((x) => spectFormGroup.disable());
                }
              }
            } else {
              if (this.screeningService.invitationFlag === true && data.screeningComponentInfo.notApplicableFlag != true && data.submittedFlag != true && data.preQCApproveFlag == false && this.screeningService.caseFlagType === this.common.PREQCCASE) {
                spectFormGroup.enable();
              } else {
                if (
                  (data.submittedFlag !== true &&
                    this.screeningService.caseFlagType ===
                    this.common.PREQCCASE &&
                    data.screeningComponentInfo.clientApprovalFlag === true &&
                    data.screeningComponentInfo.notApplicableFlag !== true) ||
                  (i > 0 &&
                    spectFormGroup.invalid &&
                    this.screeningService.caseFlagType ===
                    this.common.PREQCCASE &&
                    data.screeningComponentInfo.clientApprovalFlag !== true)
                ) {
                  timer(0, 25).subscribe((x) => spectFormGroup.disable());
                } else {
                  if (
                    data.submittedFlag !== true &&
                    this.screeningService.caseFlagType ===
                    this.common.PREQCCASE &&
                    (data.preQCApproveFlag == null ||
                      data.preQCApproveFlag == false)
                  ) {
                    timer(0, 25).subscribe((x) => spectFormGroup.disable());
                  } else if (
                    data.submittedFlag == true &&
                    this.screeningService.caseFlagType ===
                    this.common.PREQCCASE &&
                    (data.preQCApproveFlag == null ||
                      data.preQCApproveFlag == true)
                  ) {
                    timer(0, 25).subscribe((x) => spectFormGroup.disable());
                  } else if (
                    data.submittedFlag != true &&
                    this.screeningService.caseFlagType ===
                    this.common.PREQCCASE &&
                    data.screeningCompId == null
                  ) {
                    timer(0, 25).subscribe((x) => spectFormGroup.disable());
                  }
                }
              }
            }
          } else {
            if (data.preQCApproveFlag || data.preQCRejectFlag) {
              timer(0, 25).subscribe((x) => spectFormGroup.disable());
            } else if (data.submittedFlag) {
              spectFormGroup.enable();
            } else {
              timer(0, 25).subscribe((x) => spectFormGroup.disable());
            }
          }
        }
        if (spectFormGroup && com.compName === this.common.PASSPORT) {
          if (
            spectFormGroup["controls"]["compRef"]["controls"]["expiryDate"]
              .value
          ) {
            const val = new Date(
              spectFormGroup["controls"]["compRef"]["controls"][
                "expiryDate"
              ].value
            );
            spectFormGroup["controls"]["compRef"]["controls"][
              "expiryDate"
            ].setValue(new DatePipe("en-Us").transform(val, "dd/MMM/yyyy"));
            const val1 =
              spectFormGroup["controls"]["compRef"]["controls"][
                "expiryDate"
              ].value.toUpperCase();
            spectFormGroup["controls"]["compRef"]["controls"][
              "expiryDate"
            ].setValue(val1);
          }
        }
      }
    });

    if (event && event.compName) {
      const compIndex = compList.findIndex(
        (x) => x.compName.toUpperCase() === event.compName.toUpperCase()
      );
      const compFormGroup = formgrp.controls[compIndex] as UntypedFormGroup;
      const compFormarray = compFormGroup.get("component") as UntypedFormArray;
      for (let i = 0; i < compFormarray.length; i++) {
        const spectFormGroup = compFormarray.controls[i] as UntypedFormGroup;
      }
    }
  }

  compSelected(data: any, index: number) {
    if (this.viewScreeningComp) {
      this.viewScreeningComp.getComponentForm(data, index);
    }
  }

  ngOnDestroy() {
    this.common.addressflag = false;
    this.screeningService.screeningDetails = null;
    this.screeningService.screenCaseId = 0;
    this.screeningService.caseSubmissionList = null;
    this.screeningService.screeningDetail = null;
    this.previousTab = 0;
    this.screeningService.employerList = [];
    this.screeningService.institutionList = [];
    this.isdashboard = false;
    this.showGrid = true;
    this.screeningService.screeningCompId = 0;
    this.verification.screeningId = 0;
    this.verification.tempData = null;
    this.verification.isFinalReport = false;
    this.screeningService.componentList = [];
    this.screeningService.caseTypeList = [];
    this.screeningService.countryList = [];
    this.screeningService.newCollegeList = [];
    this.common.candidateName = "";
    this.screeningService.clientId = 0;
  }
  saveGapReason() {
    if (this.fileSubmission.get('gapReason')?.valid) {
      this.screeningDetails = this.fileSubmission.getRawValue();
      const gapReasonData = this.screeningDetails.gapReason;
      const formData = new FormData();
      for (let r = 0; r < gapReasonData.length; r++) {
        gapReasonData[r].candidateName = this.userData.firstName;
        gapReasonData[r].screeningId = this.fileSubmission.get('candidate.screeningId')?.value
        for (let s = 0; s < gapReasonData[r].reasonDoument.length; s++) {
          if (gapReasonData[r].reasonDoument[s].fileName) {
            formData.append('GapReasonDocument_' + gapReasonData[r].typeLookupId + '_' + s,
              gapReasonData[r].reasonDoument[s].document);
          }
        }
      }

      formData.append(
        "ScreeningDetails",
        JSON.stringify(this.screeningDetails.gapReason)
      );
      this.submissionService.saveGapReasonDetails(formData).subscribe(resp => {
        if (resp) {
          this.showNotification('success', 'Success Message', 'Save Successfully');
          this.goToStepcan(2, 'next')

        }
      });
    } else {
      this.fileSubmission.get('gapReason')?.markAsUntouched();
    }
  }
  getReviewDetail() {
    this.btnDownLoad = true;
    this.submissionService.getReviewClientDetail(this.caseNo, this.userData.userId).subscribe(resp => {
      if (resp) {
        resp.fsCandidateVm.dob = this.datePipe.transform(resp.fsCandidateVm.dob, "dd/MMM/yyyy");
        this.screeningDetails = resp;
        this.screeningDetails.candidate = resp.fsCandidateVm;
        this.screeningDetails.screening = resp.screening;
        this.screeningDetails.screeningCaseComponent = this.screeningService.componentList;
        this.screeningDetails.screeningComponent = resp.screeningComponent;
        this.screeningDetails.gapReason = resp.gapReason;
        this.screeningService.screeningDetails = this.screeningDetails;
        if (this.screeningDetails.screeningComponent.length > 0) {
          this.step1 = 3;
          this.stepperChange(this.step1);
        }

      }
    });
  }
  goToStepCom(data?: any) {
    const tets = this.viewScreeningComp.selectedComponent;
    if (!tets) { return; }
    this.screeningService.compName = tets.compName;
    const compList = this.screeningService.componentList;
    let noofComp = 0;
    if (tets.compName.toUpperCase() !== "GAP REASON") {
      const comindex = compList.findIndex(
        (f) => f.compName.toUpperCase() === tets.compName.toUpperCase()
      );
      const selectedChecks = compList.find(
        (f) => f.compName.toUpperCase() === tets.compName.toUpperCase()
      );
      if (!selectedChecks || comindex < 0) { return; }
      if (selectedChecks.subCompFlag && this.applicationId != 3) {
        noofComp = selectedChecks.screeningSubComponent.length;
      } else if (selectedChecks.subCompFlag && this.applicationId === 3) {
        noofComp = selectedChecks.screeningSubComponent.filter(
          (f) => f.subCompName !== "Current Address"
        ).length;
      } else {
        noofComp = selectedChecks.noOfComponent;
      }
      if (data === "nxt") {
        this.screenRespFlag = true;
        const type = compList[comindex].compName.toUpperCase();
        const formgroup = this.viewScreeningComp.getformGroup(
          type,
          this.viewScreeningComp.currentCompTabIndex
        ) as UntypedFormGroup;
        if (!formgroup) { return; }
        const docForm = formgroup.get(
          "screeningComponentInfo.componentDocument"
        ) as UntypedFormControl;

        if (type.toLowerCase() === this.common.EMPLOYMENT_HR.toLowerCase()) {
          this.fresherFlag = formgroup.get("compRef.fresherFlag").value;
        }

        if (formgroup.valid) {
          this.snFlag = true;
          const indexc = this.viewScreeningComp.currentCompTabIndex;
          const index = comindex;
          const indexs = index + 1;
          this.viewScreeningComp.submitComp(
            compList[index].compName,
            this.viewScreeningComp.currentCompTabIndex
          );
          this.popHide = false;
        } else if (formgroup.status == "DISABLED") {
          this.getReviewDetail();
        } else {
          formgroup.markAllAsTouched();
          formgroup.updateValueAndValidity();
        }

      }
    } else {
      this.snFlag = true;
      this.saveGapReason();
    }
  }
  public opengapAlertDialog(bodyText: any) {
    const popupData = {
      action: this.common.ALERT,
      headerText: "Component Remarks",
      bodyText,
    };
    const dialogRef = this.dialog.open(CommonAlertsComponent, {
      width: "320px",
      data: popupData,
      disableClose: true,
    });
  }

  drawerToggle() {
    this.drawer.toggle();
  }
  downloadSupportingDoc() {
    if (this.downloadflag === true) {
      const docList: any[] = [];
      this.data = this.screeningDetails1.screeningComponent[0];
      if (this.screeningDetails1.document.length > 0) {
        this.screeningDetails1.document.forEach((docele) => {
          if (docele.screeningDocId > 0) {
            docList.push(docele.screeningDocId);
          }
        });
      }
      if (this.screeningDetails1.screeningComponent[0].component.length > 0) {
        this.screeningDetails1.screeningComponent.forEach((ele) => {
          ele.component.forEach((el) => {
            if (el.screeningComponentInfo.componentDocument.length > 0) {
              el.screeningComponentInfo.componentDocument.forEach((docele) => {
                if (docele.screeningDocId > 0) {
                  docList.push(docele.screeningDocId);
                }
              });
            }
          });
        });
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < docList.length; i++) {
          this.screeningService
            .downloadScreeningDocument(docList[i])
            .subscribe((resp) => {
              setTimeout(() => {
                this.common.downloadDocument(0, resp.document, resp.fileName);
              }, 0);
            });
        }

      }
    }
  }
  GetcommonDetail() {
    this.screeningService
      .screeningStatusDetails(this.userData.applicationId)
      .subscribe((res) => {
        if (res) {
          this.screeningService.screeningDetail = res;
        }
      });
  }

}
