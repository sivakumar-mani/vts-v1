import { Component, OnInit, ViewChild, AfterViewInit, HostListener, TemplateRef, OnDestroy, ElementRef, ChangeDetectorRef } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators, UntypedFormBuilder, UntypedFormArray } from '@angular/forms';
import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { ScreeningService } from '../../common-methods/services/screening.service';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { Router, ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { timer } from "rxjs";
import {
  ScreeningDetails, ScreeningComponent, ScreeningDocument, ScreeningInsufficiency,
  InsuffDetail, PreQCRejectVm,
} from 'src/app/common-methods/models/screening-details';
import { MatSidenav } from '@angular/material/sidenav';
import { SharedService } from 'src/app/common-methods/services/shared.service';
import {  MatDialog } from '@angular/material/dialog';
import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { MessageService } from 'primeng/api';
import { CommonAddress } from 'src/app/common-methods/models/common-address';
import { QualityCheckService } from 'src/app/common-methods/services/quality-check.service';
import { User } from 'src/app/common-methods/models/user';
import { CscreeningComponentsComponent } from './cscreening-components/cscreening-components.component';
import { VerificationService } from 'src/app/common-methods/services/verification.service';
import { ScrollToErrorDirective } from 'src/app/common-methods/directive/scroll-to-error.directive';
import { InvoiceService } from 'src/app/common-methods/services/invoice.service';
import { DatePipe } from '@angular/common';

@Component({
  standalone: false,
  selector: 'app-candidate-file-submission',
  templateUrl: './candidate-file-submission.component.html',
  styleUrls: ['./candidate-file-submission.component.css']
})
export class CandidateFileSubmissionComponent implements OnInit, AfterViewInit, OnDestroy {
  snFlag = false
  stepperFlag = false
  fresherFlag = false;
  addressposFlag: boolean = false;
  compData = {
    isSubComp: null,
    subCompId: null,
    onInit: true,
    compName: ''
  };
  @ViewChild('alertTemplate', { static: true }) alertTemplate: TemplateRef<any>;
  checkList: any[] = [];
  screenRespFlag = false
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
  screeningDetails1 = new ScreeningDetails();
  screeningComponent: ScreeningComponent[];
  screeningDocument: ScreeningDocument[] = [];
  preQCRejectVm = new PreQCRejectVm();
  routePath = 'Screening / Clients File Submission / File Submission';
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
  paymenFlag: any
  compLength: any;
  paymentKey: any;
  @ViewChild('drawer', { static: true }) drawer: MatSidenav;
  @ViewChild('downloadData', { static: true }) downloadData: TemplateRef<any>;
  @ViewChild('generalIns', { static: true }) generalIns: TemplateRef<any>;
  @ViewChild('canGeneralIns', { static: true }) canGeneralIns: TemplateRef<any>;
  @ViewChild(CscreeningComponentsComponent) viewScreeningComp: CscreeningComponentsComponent;
  @ViewChild('dlgReject', { static: true }) dlgReject: TemplateRef<any>;
  @ViewChild('cancelOrder', { static: true }) cancelOrder: TemplateRef<any>;
  flag = false;
  isdashboard = false;
  rejectComments = new UntypedFormControl('', Validators.required);
  cancelReason = new UntypedFormControl('', Validators.required);
  screenningCompList: any[] = [];
  color: string;
  btnApprove: boolean;
  tipsFlag = true;
  singleCompReject: boolean;
  btnlabel = 'Save';
  screeningCompId = 0;
  miscDataForm: UntypedFormArray;
  compAddress: any;
  componentName = 'education';
  compBaseDetails: any;
  pdfType = '';
  tabIndex = 0;
  stepHiddenFlag = true;
  manualFilesubmissionRE: any;
  compSplRemarks = '';
  gapYears: any[] = [];
  changeCom;
  comstep = 0;
  previewStep = false;
  nxtstep = true;
  stperFlag = false
  @ViewChild('viewInvoice', { static: true }) viewInvoice: TemplateRef<any>;
  @ViewChild('pdf', { static: true }) pdf: any;
  demo1TabIndex = 0;

  constructor(public master: MasterService, public screeningService: ScreeningService, private fb: UntypedFormBuilder, public common: CommonService, private scroll: ScrollToErrorDirective,
    private authService: AuthService, private shared: SharedService, private dialog: MatDialog, private router: Router, private invoice: InvoiceService,
    private messageService: MessageService, private cdr: ChangeDetectorRef, public datePipe: DatePipe, private QcService: QualityCheckService, public verification: VerificationService,) {
  }
  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    window.scroll(0, 0);
    this.GetcommonDetail();
    this.caseNo = this.screeningService.screenCaseId;
    this.applicationId = this.userData.applicationId;
    this.breadcrumbFlags.btnBack = false;
    this.pdfType = this.authService.getpdfType('pdfType');
    this.shared.emitChengesecDrawer();
    this.initFormGroup();

    if (this.caseNo > 0) {
      this.downloadflag = true;
      this.btnDownLoad = true;
      this.TodayDate = this.extractedDate
    }
    //this.GetCandidateInprogressData();
    if (this.applicationId !== 3) {
      if (this.caseNo > 0) {
        this.isdashboard = true;
        this.breadcrumbFlags.btnBack = true;
        this.breadcrumbFlags.btnSave = true;
        this.breadcrumbFlags.btnReset = true;
        this.getAssignedCaseDetails(this.caseNo);
        if (this.screeningService.caseFlag === true || this.screeningService.caseFlagType === this.common.PREQCREJECT) {
          this.btnApprove = false;
          this.breadcrumbFlags.btnSave = true;
        } else {
          this.btnApprove = true;
          this.breadcrumbFlags.btnSave = false;
        }
        this.manualFilesubmissionRE = false;
      } else if (this.screeningService.screeningCompId > 0) {
        this.showFileSubmission(this.screeningService.screeningCompId);
      } else if (this.screeningService.caseFlagType === this.common.QCREJECT ||
        this.screeningService.caseFlagType === this.common.INSUFFCLEARANCE) {
        this.showGrid = false;
        this.showFileSubmission(this.screeningService.screeningCompId);
      } else if (this.screeningService.caseFlagType === this.common.NEWCASE) {
        this.breadcrumbFlags.btnBack = true;
        this.breadcrumbFlags.btnSave = true;
        this.showGrid = false;
        this.manualFilesubmissionRE = false;
      } else {
        this.isdashboard = true;
        this.showGrid = false;
        this.breadcrumbFlags.btnSave = true;
        this.screeningService.caseFlag = false;
        this.screeningService.caseFlagType = this.common.NEWCASE;
        this.manualFilesubmissionRE = false;
        this.initFormGroup();
      }
    } else {
      this.manualFilesubmissionRE = false;
      this.breadcrumbFlags.btnBack = false;
      this.breadcrumbFlags.btnSave = true;
      this.breadcrumbFlags.btnReset = true;
      this.routePath = 'File Submission';
      this.getCandidateCase();

    }
    this.getCandidateComplist();
  }
  // GetCandidateInprogressData() {
  // this.screeningService.GetCandidateInprogressData(this.userData.userId).subscribe(resp => {
  // if (resp) {
  //   console.log(resp, 'GetCandidateInprogressData');
  // }
  //});
  //}
  ngAfterContentChecked(): void {
  }
  openGeneralIns() {
    this.dialog.open(this.generalIns,
      { width: '700px', disableClose: true, });

  }
  opendownload() {
    this.dialog.open(this.downloadData,
      { width: '1000', disableClose: true, });
  }
  openCandidateGeneralIns() {
    this.screeningService.StatusDeFlag = false;
    this.dialog.open(this.canGeneralIns,
      { width: '700px', disableClose: true, });

  }
  GetcommonDetail() {
    this.screeningService.screeningStatusDetails(this.userData.applicationId).subscribe(res => {
      if (res) {
        this.screeningService.screeningDetail = res;
      }

    });

  }
  dialogClose() {
    this.dialog.closeAll();
  }
  getCompId(event: any) {
    if (this.caseSubmissionList && this.caseSubmissionList.screeningCaseComponent) {
      this.compSplRemarks = '';
      const component = this.caseSubmissionList.screeningCaseComponent.find(x => x.compId === event);
      this.componentName = component.compName;
      if (component.subCompFlag) {
        component.screeningSubComponent.forEach(f => {
          this.compSplRemarks = this.compSplRemarks + '<b>' + f.subCompName + ' </b><br>' + f.remarks + '<br><br>';
          this.drawerToggle()
        });
      } else {
        this.compSplRemarks = component.remarks;
        this.drawerToggle()
      }
    }
  }
  showFileSubmission(screeningCompId: any) {
    setTimeout(() => {
      this.goToStep(0);
    }, 0);
    this.screeningService.getScreeningComponentEntryDetails(screeningCompId, this.userData.userId).subscribe(resp => {
      if (resp) {
        this.common.Socialcompid = resp.screeningCaseComponent[0].compId;
        this.common.instatusId = resp.screeningComponent[0].component[0].screeningComponentInfo.eduEmpScreenStatusId;
        if (resp.screeningComponent[0].component && resp.screeningComponent[0].component[0].screeningComponentInfo.caseByPassFlag
          === true) {
          resp.screening.component = resp.screeningCaseComponent[0].compId;
          if (resp.screeningCaseComponent[0].subCompFlag) {

          }
          resp.screening.component = resp.screeningCaseComponent[0].compId;

          this.manualFilesubmissionRE = true;
        } else {
          this.manualFilesubmissionRE = false;
        }
        this.initFormGroup();
        this.bindCaseDetail(resp);
        this.showGrid = false;
        this.breadcrumbFlags.btnBack = true;
        if (!(this.screeningService.caseFlagType === this.common.QCREJECT)) {
          this.breadcrumbFlags.btnSave = true;
        }
        this.breadcrumbFlags.btnReset = true;
        this.btnApprove = false;

      }
    });

  }
  getCandidateComplist() {
    const clist = JSON.parse(JSON.stringify(this.screeningService.componentList));
    if (this.applicationId === 3) {
      clist.map(m => {
        if (m.subCompFlag === true) {
          m.screeningSubComponent = m.screeningSubComponent.filter(f => f.subCompName !== 'Current Address');
        }
      });
      const list = clist.filter(f => {
        if (f.subCompFlag === true) {
          return f.screeningSubComponent.length > 0 ? true : false;
        } else {
          return true;
        }
      });
      this.stepHiddenFlag = list.length > 0 ? true : false;
    } else {
      if (this.screeningService.caseFlagType === this.common.NEWCASE) {
        this.stepHiddenFlag = clist.length > 0 ? true : false;
      }
    }
  }
  backToList() {
    this.breadcrumbFlags.btnBack = false;
    this.breadcrumbFlags.btnSave = false;
    this.breadcrumbFlags.btnReset = false;
    this.btnApprove = false;
    if (this.screeningService.caseFlagType === this.common.NEWCASE) {
      this.router.navigate(['dashboard/home']);
    } else if (this.isdashboard || this.screeningService.caseFlagType === this.common.QCREJECT
      || this.screeningService.caseFlagType === this.common.FRREJECT || this.screeningService.caseFlagType === this.common.VEREJECT || this.screeningService.caseFlagType === this.common.REOPEN) {
      this.router.navigate(['dashboard/screening/caselist']);
    } else if (this.screeningService.screeningCompId > 0 && this.screeningService.insuffClear) {
      this.router.navigate(['dashboard/home']);
    } else if (this.screeningService.caseFlagType === this.common.INSUFFCLEARANCE) {
      this.router.navigate(['dashboard/screening/insufflist']);
    } else {
      this.showGrid = !this.showGrid;
    }
  }
  getAssignedCaseDetails(caseNo: any) {
    this.screeningService.getScreeningCaseDetails(caseNo, this.userData.userId, this.userData.applicationId).subscribe(resp => {
      if (resp) {
        if (this.screeningService.caseFlagType === this.common.PREQCCASE && !resp.invitationFlag) {
          resp.screeningCaseComponent = resp.screeningCaseComponent.sort((a, b) => {
            return b.deqcFlag - a.deqcFlag;
          });
          resp.screeningComponent = resp.screeningComponent.sort((a, b) => {
            return b.criminalCheckCount - a.criminalCheckCount;
          });
        }
        this.getstatus(resp);
        this.bindCaseDetail(resp);
        if (this.snFlag == true) {
          const tets = this.viewScreeningComp.selectedComponent;
          const compList = this.screeningService.componentList; let noofComp = 0;
          const comindex = compList.findIndex(f => f.compName.toUpperCase() === tets.compName.toUpperCase())
          const selectedChecks = compList.find(f => f.compName.toUpperCase() === tets.compName.toUpperCase())
          if (selectedChecks.subCompFlag && this.applicationId != 3) {
            noofComp = this.screeningService.compData.screeningSubComponent.length;

          } else if (selectedChecks.subCompFlag && this.applicationId === 3) {

            noofComp = this.screeningService.compData.screeningSubComponent.filter(f => f.subCompName !== 'Current Address').length;

          } else {
            noofComp = this.screeningService.compData.noOfComponent;
          }

          this.screenRespFlag = true;

          const type = compList[comindex].compName.toUpperCase();
          const formgroup = this.viewScreeningComp.getformGroup(type, this.viewScreeningComp.currentCompTabIndex) as UntypedFormGroup;
          const docForm = formgroup.get('screeningComponentInfo.componentDocument') as UntypedFormControl;
          if (type.toLowerCase() === this.common.EMPLOYMENT_HR.toLowerCase()) {
            this.fresherFlag = formgroup.get('compRef.fresherFlag')?.value;
          }

          const indexc = this.viewScreeningComp.currentCompTabIndex;
          if (noofComp <= (indexc + 1)) {
            const index = comindex
            const indexs = index + 1;

            if (this.screeningService.componentList[this.screeningService.componentList.length - 1].compName === compList[index].compName && noofComp
              === (indexc + 1)) {
              if (this.applicationId !== 3 && this.screeningService.caseFlagType !== this.common.NEWCASE && !this.manualFilesubmissionRE) {
                this.goToStep(this.step1 + 1);
              } else if (this.applicationId === 3 || this.screeningService.caseFlagType === this.common.NEWCASE || this.manualFilesubmissionRE) {
                this.goToStepcan(this.step1 + 1, "next")
              }
            }
            else {

              this.viewScreeningComp.getComponentForm(compList[index + 1], indexs);
              this.viewScreeningComp.getformGroup(type, indexs) as UntypedFormGroup;

            }

            this.popHide = false

          }
          else if (noofComp > (indexc + 1)) {
            const index = comindex
            const indexs = index + 1;

            this.viewScreeningComp.demo1TabIndex++;

          }

          window.scroll({ top: 0, left: 0, behavior: 'smooth' });
          this.snFlag = false;
        }
      }

    });
  }

  getCandidateCase() {
    this.showGrid = false;
    this.screeningService.getUserCaseScreeningDetails(this.userData.userId).subscribe(resp => {
      if (resp) {
        this.getstatus(resp);
        this.bindCaseDetail(resp);
        if (this.userData.applicationId === 3) {
          this.userData.firstName = resp.candidate.firstName + ' ' + (resp.candidate.middleName ? resp.candidate.middleName : '') + ' ' + (resp.candidate.lastName ? resp.candidate.lastName : '');
          if (this.step1 === 0) {
            this.openCandidateGeneralIns();
          }
        }
      }
    });

    if (this.snFlag == true) {
      const tets = this.viewScreeningComp.selectedComponent;
      for (let i = 0; i < this.screeningService.componentList.length; i++) {
        if (this.screeningService.componentList[i].compName.toUpperCase() === this.common.ADDRESS && this.screeningService.componentList[i].subCompFlag == true) {
          this.screeningService.componentList[i].screeningSubComponent = this.screeningService.componentList[i].screeningSubComponent.filter(s => s.subCompId !== this.common.CURRENT_ADDRESSID)
        }
      }
      const compList = this.screeningService.componentList.filter(s => (s.subCompFlag == true && s.screeningSubComponent.length > 0) || (s.subCompFlag != true))

      let noofComp = 0;
      const comindex = compList.findIndex(f => f.compName.toUpperCase() === tets.compName.toUpperCase())
      const selectedChecks = compList.find(f => f.compName.toUpperCase() === tets.compName.toUpperCase())
      if (selectedChecks.subCompFlag && this.applicationId != 3) {
        noofComp = this.screeningService.compData.screeningSubComponent.length;

      } else if (selectedChecks.subCompFlag && this.applicationId === 3) {

        // noofComp = this.screeningService.compData.screeningSubComponent.filter(f => f.subCompName !== 'Current Address').length;
        const sumBoys = this.screeningService.compData.screeningSubComponent.reduce((sum, ele) => {
          if (ele.subCompName !== 'Current Address') {
            return sum + ele.noOfComponent;
          }

          return sum;
        }, 0);

        noofComp = sumBoys;
      } else {
        noofComp = this.screeningService.compData.noOfComponent;
      }

      this.screenRespFlag = true;

      const type = compList[comindex].compName.toUpperCase();
      const formgroup = this.viewScreeningComp.getformGroup(type, this.viewScreeningComp.currentCompTabIndex) as UntypedFormGroup;
      const docForm = formgroup.get('screeningComponentInfo.componentDocument') as UntypedFormControl;
      if (type.toLowerCase() === this.common.EMPLOYMENT_HR.toLowerCase()) {
        this.fresherFlag = formgroup.get('compRef.fresherFlag')?.value;
      }

      const indexc = this.viewScreeningComp.currentCompTabIndex;

      if (noofComp <= (indexc + 1)) {
        const index = comindex
        const indexs = index + 1;

        if (this.screeningService.componentList[this.screeningService.componentList.length - 1].compName === compList[index].compName && noofComp
          === (indexc + 1)) {
          if (this.applicationId !== 3 && this.screeningService.caseFlagType !== this.common.NEWCASE && !this.manualFilesubmissionRE) {
            this.goToStep(this.step1 + 1);
          } else if (this.applicationId === 3 || this.screeningService.caseFlagType === this.common.NEWCASE || this.manualFilesubmissionRE) {
            this.goToStepcan(this.step1 + 1, "next")
          }
        }
        else {

          this.viewScreeningComp.getComponentForm(compList[index + 1], indexs);
          if (compList[index + 1].compName == 'Gap Reason') {
            this.viewScreeningComp.getformGroup('Gap Reason', indexs) as UntypedFormGroup;

          } else {
            this.viewScreeningComp.getformGroup(type, indexs) as UntypedFormGroup;
          }

        }

        this.popHide = false

      }
      else if (noofComp > (indexc + 1)) {
        const index = comindex
        const indexs = index + 1;

        this.viewScreeningComp.demo1TabIndex++;

      }

      window.scroll({ top: 0, left: 0, behavior: 'smooth' });
      this.snFlag = false;
    }
  }
  mergeIndPackComp(compData: any) {
    const sum: any[] = [];
    let subSum = [];
    let data: any;
    compData.screeningCaseComponent.forEach(el => {
      if (sum.length === 0) {
        if (el.subCompFlag) {
          el.screeningSubComponent.forEach(element => {
            if (el.compType === 'Package') {
              Object.assign(element, { packageCount: element.noOfComponent });

            } else {
              Object.assign(element, { individualCount: element.noOfComponent });
            }
          });
        } else {
          if (el.compType === 'Package') {
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
                data = sum[i].screeningSubComponent.concat(el.screeningSubComponent);
                data.forEach(x => {
                  if (subSum.length === 0) {
                    if (x.subCompType === 'Package') {
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
                      const subCompIndex = sum[i].screeningSubComponent.findIndex(f => f.subCompId === subcompId.subCompId);
                      sum[i].screeningSubComponent[subCompIndex].noOfComponent += x.noOfComponent;
                      if (x.subCompType === 'Package') {
                        Object.assign(sum[i].screeningSubComponent[subCompIndex], { packageCount: x.noOfComponent });

                      } else {
                        Object.assign(sum[i].screeningSubComponent[subCompIndex], { individualCount: x.noOfComponent });
                      }
                    } else {
                      if (x.subCompType === 'Package') {
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
                data.forEach(x => {
                  if (subSum) {
                    if (x.subCompType === 'Package') {
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
          if (el.compType === 'Package') {
            Object.assign(sum[i.id], { packageCount: el.noOfComponent });
          } else {
            Object.assign(sum[i.id], { individualCount: el.noOfComponent });
          }
        } else {
          if (sum.filter(x => x.compId === el.compId).length < 1) {
            if (el.compType === 'Package') {
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
  bindCaseDetail(resp: any) {
    this.common.addressflag = true;
    this.common.candidateData = resp.candidate;
    this.screeningService.gapReason  = [];
    if (resp.candidate.companySiteVisitFlag == true) {
      this.fileSubmission.get("candidate.genderLookupId").clearValidators();
    }
    if (!this.fileSubmission.get("screening.chargeCodeFlag").value) {
      this.fileSubmission.get("screening.chargeCode").clearValidators();
    }
    resp.candidate.dob = this.datePipe.transform(
      this.common.getTimezoneOffset(resp.candidate.dob, false),
      "dd/MMM/yyyy"
    );
    // resp.candidate.dob = moment(resp.candidate.dob).format("DD/MMM/YYYY");
    resp.screening.caseInititationDate = this.common.getTimezoneOffset(
      resp.screening.caseInititationDate,
      false
    );
    resp.screening.caseReceivedDate = this.common.getTimezoneOffset(
      resp.screening.caseReceivedDate,
      false
    );
    resp.gapReasonType = resp.gapReasonType ? resp.gapReasonType : [];
    if (
      resp.gapReasonType &&
      resp.gapReasonType.length > 0 &&
      (this.screeningService.caseFlagType === this.common.PREQCCASE ||
        this.userData.applicationId === 3)
    ) {
      resp.screeningCaseComponent.push({
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
      const gapreasonForm = this.fileSubmission.get("gapReason") as UntypedFormArray;
      if (gapreasonForm.controls.length > 0) {
        while (gapreasonForm.controls.length !== 0) {
          gapreasonForm.removeAt(0);
        }
      }
    }

    this.caseSubmissionList = resp;
    this.screeningDocument = resp.document;
    this.screeningDetails1.candidate = resp.candidate;
    this.screeningService.dob = this.screeningDetails1.candidate.dob
      ? this.screeningDetails1.candidate.dob
      : '';
    this.screeningDetails1.document = resp.document;
    this.screeningDetails1.screening = resp.screening;
    this.screeningDetails1.gapReason = resp.gapReason;
    this.screeningService.gapReason = resp.gapReasonType;
    this.screeningService.caseTypeList = resp.caseType ? resp.caseType : [];
    this.screeningService.countryList = resp.caseCountry
      ? resp.caseCountry
      : [];
    this.screeningDetails1.employerDet = resp.employerDet
      ? resp.employerDet
      : [];
    this.screeningDetails1.educationDet = resp.educationDet
      ? resp.educationDet
      : [];
    this.screeningDetails1.bulkCaseFlag = resp.bulkCaseFlag;
    this.screeningDetails1.invitationFlag = resp.invitationFlag;
    this.screeningDetails1.directAppAddressFlag = resp.directAppAddressFlag;
    this.screeningDetails1.ctsFlag = resp.screening.ctsFlag;
    this.screeningDetails1.screeningComponent = resp.screeningComponent;
    this.screeningService.caseSubmissionList = resp;
    this.pdfname =
      this.screeningService.caseSubmissionList.screening.clientRefNo + ".pdf";
    let price = 0;
    resp.screeningCaseComponent.forEach((el) => {
      if (el.compName.toLowerCase() !== "voter id" ||
        el.compName.toLowerCase() !== "passport" ||
        el.compName.toLowerCase() !== "license" ||
        el.compName.toLowerCase() !== "drug test" ||
        el.compName.toLowerCase() !== "education" ||
        el.compName.toLowerCase() !== "employment (hr)" ||
        el.compName.toLowerCase() !== "database") {
        this.addressposFlag = true;
      }
      el.subCheckFlag === false && !el.compInitiationDate
        ? (el.compInitiationDate = resp.screening.caseInititationDate)
        : (el.compInitiationDate = this.common.getTimezoneOffset(
          el.compInitiationDate,
          false
        ));

      if (el.fees) {
        price = price + el.noOfComponent * el.fees;
      }
      if (el.subCompFlag) {
        el.screeningSubComponent.forEach((e) => {
          e.compInitiationDate = el.compInitiationDate;
          if (e.fees) {
            price = price + e.noOfComponent * e.fees;
          }
        });
      }
    });
    if (
      resp.candidate.paymentBeforeCandidateFlag === true &&
      this.userData.applicationId === 3
    ) {
      this.price =
        (resp.candidate.packagePrice + price) * (5 / 100) +
        (resp.candidate.packagePrice + price);
    }
    const mergedComp = this.mergeIndPackComp(this.common.CloneObject(resp));
    this.screeningService.componentList = Object.assign(
      [],
      this.common.CloneObject(mergedComp)
    );
    if (this.step1 === 0) {
      this.screeningService.compData = { compName: "Address" };
    }
    if (this.caseSubmissionList.generalInstruction === null) {
      this.caseSubmissionList.generalInstruction = [];
      this.caseSubmissionList.generalInstruction.push(
        "General instruction is not available for " +
        this.caseSubmissionList.screening.clientName
      );
    }
    this.clientChangeEmit();
    const cunstomFiedFrom = this.fileSubmission.get("screening") as UntypedFormGroup;
    cunstomFiedFrom.addControl(
      "clientCustomFields",
      this.initclientCustomFieldsForm(
        this.screeningDetails1.screening.clientCustomFields
      )
    );
    const docFormGroup = this.fileSubmission.get("document") as UntypedFormArray;
    this.createDocForm(docFormGroup, this.caseSubmissionList.document);
    this.bindbulkcase();
    const candidatede = this.fileSubmission.get("candidate") as UntypedFormGroup;
    const canAddress = candidatede.get("address") as UntypedFormGroup;

    for (let i = 0; this.screeningService.componentList.length > i; i++) {
      const frmIndex = this.screeningDetails1.screeningComponent.findIndex(
        (f) => f.compId === this.screeningService.componentList[i].compId
      );
      const scrCompfrmArray = this.fileSubmission.get(
        "screeningComponent"
      ) as UntypedFormArray;
      if (frmIndex > -1) {
        const mainfrmGroup = scrCompfrmArray.controls[i] as UntypedFormGroup;
        const compFrmArray = mainfrmGroup.get("component") as UntypedFormArray;
        const compFrmArrayData = compFrmArray.getRawValue();

        this.screeningDetails1.screeningComponent[frmIndex].component.forEach(
          (elememnt, ei) => {
            if (elememnt.screeningComponentInfo) {
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

        if (this.screeningService.componentList[i].subCompFlag) {
          for (
            let k = 0;
            this.screeningService.componentList[i].screeningSubComponent
              .length > k;
            k++
          ) {
            const indexs: any[] = [];
            let subComp: any[] = [];

            compFrmArrayVal.map((f1, index) => {
              if (
                f1.screeningComponentInfo.subCompId ===
                this.screeningService.componentList[i].screeningSubComponent[k]
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
                this.screeningService.componentList[i].screeningSubComponent[k]
                  .subCompId
            );
            if (subComp.length > 0) {
              for (let l = 0; subComp.length > l; l++) {
                const ind = indexs[l];
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
                const subCompdata = subComp[l];
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
                    compInitiationDate: this.common.getTimezoneOffset(
                      subCompdata.screeningComponentInfo.compInitiationDate,
                      false
                    ),
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

                  if (subCompdata.compRef.address !== null) {
                    //addressPOSStart

                    const addressFrmGroup = compFrmGroup.get("compRef") as UntypedFormGroup;
                    const address = addressFrmGroup.get("address0") as UntypedFormGroup;
                    const address1 = addressFrmGroup.get("address") as UntypedFormGroup;

                    const scrCompInfo = compFrmGroup.get(
                      "screeningComponentInfo"
                    ) as UntypedFormGroup;
                    const scrInsuff = compFrmGroup.get(
                      "screeningInsufficiency"
                    ) as UntypedFormGroup;

                    //  if (this.addressposFlag) {

                    if (
                      this.screeningDetails1.screeningComponent[frmIndex].component[l].compRef.address != undefined && subCompdata.screeningComponentInfo.notApplicableFlag != true
                    ) {
                      if (this.screeningDetails1.screeningComponent[frmIndex].component[l].compRef.address != undefined) {

                        const addredata = this.screeningDetails1.screeningComponent[frmIndex].component[l].compRef.address[0] != undefined ? this.screeningDetails1.screeningComponent[frmIndex].component[l].compRef.address[0].addressPos :
                          this.screeningDetails1.screeningComponent[frmIndex].component[l].compRef.address.addressPos ? this.screeningDetails1.screeningComponent[frmIndex].component[l].compRef.address.addressPos : 0;
                        if (addredata.length == 0 ||
                          addredata.length == undefined || addredata.length > 0
                        ) {

                          if (this.screeningDetails1.screeningComponent[frmIndex].component[l].compRef.address.addTypeLookName == "Current Address") {
                            if (addredata.length > 0) {
                              canAddress.removeControl("addressPos");
                            }
                            // timer(0, 25).subscribe((x) => 
                            canAddress.addControl(
                              "addressPos",
                              this.common.initPosForm(
                                this.screeningDetails1.screeningComponent[frmIndex]
                                  .component[l].compRef.address[0] != undefined ? this.screeningDetails1.screeningComponent[frmIndex]
                                    .component[l].compRef.address[0].addressPos : this.screeningDetails1.screeningComponent[frmIndex]
                                      .component[l].compRef.address.addressPos
                              ))

                          }

                          if (address != null) {
                            if (addredata.length > 0) {
                              address.removeControl("addressPos");
                            }
                            // timer(0, 25).subscribe((x) => 
                            address.addControl(
                              "addressPos",
                              this.common.initPosForm(
                                this.screeningDetails1.screeningComponent[frmIndex]
                                  .component[l].compRef.address[0] != undefined ? this.screeningDetails1.screeningComponent[frmIndex]
                                    .component[l].compRef.address[0].addressPos : this.screeningDetails1.screeningComponent[frmIndex]
                                      .component[l].compRef.address.addressPos
                              ))
                            // );
                          } else if (address1 != null) {
                            if (addredata.length > 0) {
                              address1.removeControl("addressPos");
                            }
                            // timer(0, 25).subscribe((x) => 
                            address1.addControl(
                              "addressPos",
                              this.common.initPosForm(
                                this.screeningDetails1.screeningComponent[frmIndex]
                                  .component[l].compRef.address[0] != undefined ? this.screeningDetails1.screeningComponent[frmIndex]
                                    .component[l].compRef.address[0].addressPos : this.screeningDetails1.screeningComponent[frmIndex]
                                      .component[l].compRef.address.addressPos
                              )
                            )
                            //);
                          }
                        }

                      }

                    }

                    //       //addressPOSEnd
                    if (subCompdata.screeningComponentInfo.notApplicableFlag != true) {
                      compFrmGroup.patchValue({
                        active: false,
                        compRef: subCompdata.compRef,
                        submittedFlag: subCompdata.submittedFlag,
                        preQCApproveFlag: subCompdata.preQCApproveFlag,
                        preQCRejectFlag: subCompdata.preQCRejectFlag,
                        rejectComments: subCompdata.rejectComments,
                        qcRejectComments: subCompdata.qcRejectComments,
                        addedByCandidateFlag: subCompdata.addedByCandidateFlag,
                        componentCustomFields: subCompdata.componentCustomFields,
                      });
                    } else {
                      compFrmGroup.patchValue({
                        active: false,

                        submittedFlag: subCompdata.submittedFlag,
                        preQCApproveFlag: subCompdata.preQCApproveFlag,
                        preQCRejectFlag: subCompdata.preQCRejectFlag,
                        rejectComments: subCompdata.rejectComments,
                        qcRejectComments: subCompdata.qcRejectComments,
                        addedByCandidateFlag: subCompdata.addedByCandidateFlag,
                        componentCustomFields: subCompdata.componentCustomFields,
                      });
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

            if (
              this.screeningDetails1.screeningComponent[frmIndex].component[j].compRef.address != undefined && this.screeningDetails1.screeningComponent[frmIndex].component[j].screeningComponentInfo.notApplicableFlag != true
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
                    // timer(0, 25).subscribe((x) => 
                    address.addControl(
                      "addressPos",
                      this.common.initPosForm(
                        this.screeningDetails1.screeningComponent[frmIndex]
                          .component[j].compRef.address[0] != undefined ? this.screeningDetails1.screeningComponent[frmIndex]
                            .component[j].compRef.address[0].addressPos : this.screeningDetails1.screeningComponent[frmIndex]
                              .component[j].compRef.address.addressPos
                      ))
                    // );
                  } else if (address1 != null) {
                    if (addredata.length > 0) {
                      address1.removeControl("addressPos");
                    }
                    // timer(0, 25).subscribe((x) => 
                    address1.addControl(
                      "addressPos",
                      this.common.initPosForm(
                        this.screeningDetails1.screeningComponent[frmIndex]
                          .component[j].compRef.address[0] != undefined ? this.screeningDetails1.screeningComponent[frmIndex]
                            .component[j].compRef.address[0].addressPos : this.screeningDetails1.screeningComponent[frmIndex]
                              .component[j].compRef.address.addressPos
                      )
                    )
                    //);
                  }
                }

              }

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
                driectAppIndex: screeningComponentInfo.driectAppIndex,
                countryTypeLookUpId: screeningComponentInfo.countryTypeLookUpId,
                compInitiationDate: this.common.getTimezoneOffset(
                  screeningComponentInfo.compInitiationDate,
                  false
                ),
                reportSource: screeningComponentInfo.reportSource,
                caseTypeLookUpId: screeningComponentInfo.caseTypeLookUpId,
                screenStatusId: screeningComponentInfo.screenStatusId,
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
                qcRejectFlag: screeningComponentInfo.qcRejectFlag,
                verificationRejectFlag:
                  screeningComponentInfo.verificationRejectFlag,
                forResearchRejectFlag:
                  screeningComponentInfo.forResearchRejectFlag,
                clientScreeningId: screeningComponentInfo.clientScreeningId,
                clientApprovalFlag: screeningComponentInfo.clientApprovalFlag,
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

              if (
                this.screeningDetails1.screeningComponent[frmIndex].component[j]
                  .compRef.address === null
              ) {
                this.screeningDetails1.screeningComponent[frmIndex].component[
                  j
                ].compRef.address = "";
              }
              compFrmGroup.patchValue({
                active: false,
                compRef:
                  this.screeningDetails1.screeningComponent[frmIndex].component[
                    j
                  ].compRef,
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
                      locationId: addres[c].locationId,
                      addressPos: addres[c].addressPos,
                      addressTypeLookupId: addres[c].addressTypeLookupId,
                      addressType: addres[c].addressType,
                    });
                  }
                }
              }
            }
            if (
              this.screeningDetails1.screeningComponent[frmIndex].compId === 13
            ) {
              compFrmGroup.removeControl("compRefDetail");
              compFrmGroup.addControl(
                "compRefDetail",
                this.initcvValidation(
                  this.screeningDetails1.screeningComponent[frmIndex].component[
                    j
                  ].compRef
                )
              );
              this.createCvValidationForm(
                compFrmGroup.get("compRefDetail") as UntypedFormGroup,
                this.screeningDetails1.screeningComponent[frmIndex].component[j]
                  .compRef,
                true
              );
            }
          }
        }
      }
    }

    this.screeningDetails1.candidate.address = this.screeningDetails1.candidate.address === null ? new CommonAddress() : this.screeningDetails1.candidate.address;
    if (this.userData.applicationId === 3) {
      this.compAddress = this.screeningDetails1.candidate.address;
    }
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
              .setValue(this.screeningDetails1.screening.screeningId);
          }
        }
      }
      frmarr.patchValue(this.screeningDetails1.gapReason);
    }

    this.fileSubmission.patchValue({
      candidate: this.caseSubmissionList.candidate,
      screening: this.caseSubmissionList.screening,
      document: this.caseSubmissionList.document,
      preQCRejectApproveFlag:
        this.screeningService.caseFlagType === this.common.PREQCREJECT
          ? true
          : false,
      invitationFlag: this.caseSubmissionList.invitationFlag,
      directAppAddressFlag: this.caseSubmissionList.directAppAddressFlag,
      ctsFlag: this.caseSubmissionList.screening.ctsFlag,
      verificationRejectFlag: this.caseSubmissionList.verificationRejectFlag,
      forResearchRejectFlag: this.caseSubmissionList.forResearchRejectFlag,
      // panCompFlag: this.caseSubmissionList.panCompFlag,
      bulkCaseFlag: this.caseSubmissionList.bulkCaseFlag,
      educationDet: this.caseSubmissionList.educationDet,
      employerDet: this.caseSubmissionList.employerDet,
      gapReasonType: this.caseSubmissionList.gapReasonType,
    });
    this.validateComp();
    setTimeout(() => {
      this.formEnableDisable();
    }, 0);
  }
  bindbulkcase() {
    if (this.screeningDetails1.bulkCaseFlag) {
      const compFormarray = this.fileSubmission.get('screeningComponent') as UntypedFormArray;
      if (this.screeningService.componentList.some(s => s.compName.toUpperCase() === this.common.EMPLOYMENT_HR)) {
        const index = this.screeningService.componentList.findIndex(fi => fi.compName.toUpperCase() === this.common.EMPLOYMENT_HR);
        if (index > -1) {
          const empformgroup = compFormarray.controls[index] as UntypedFormGroup;
          const emparray = empformgroup.get('component') as UntypedFormArray;
        }

      }
    }
  }
  initFormGroup() {
    this.fileSubmission = this.fb.group({
      loggedIn: new UntypedFormControl(this.userData.userId),
      applicantId: new UntypedFormControl(this.applicationId),
      candidate: this.initCandidateForm(),
      screening: (this.screeningService.caseFlagType === this.common.NEWCASE || this.manualFilesubmissionRE) ?
        this.initmanualClientDetailForm() : this.initClientDetailForm(),
      screeningComponent: new UntypedFormArray([]),
      document: new UntypedFormArray([]),
      qcRejectFlag: new UntypedFormControl(false),
      // panCompFlag: new UntypedFormControl(false),
      preQCRejectApproveFlag: new UntypedFormControl(false),
      invitationFlag: new UntypedFormControl(false),
      directAppAddressFlag: new UntypedFormControl(false),
      verificationRejectFlag: new UntypedFormControl(this.screeningService.caseFlagType === this.common.VEREJECT ? true : false),
      forResearchRejectFlag: new UntypedFormControl(this.screeningService.caseFlagType === this.common.FRREJECT ? true : false),
      completeFlag: new UntypedFormControl(false),
      gapReason: new UntypedFormArray([]),
      bulkCaseFlag: new UntypedFormControl(false),
      educationDet: new UntypedFormControl([]),
      employerDet: new UntypedFormControl([]),
      gapReasonType: new UntypedFormControl([])
    });
  }
  initCommonFormGroup(isSubComp, comptype, compId, subCompId, criminalCheckCount,
    deqcFlag: boolean, addedByCandidateFlag: boolean, currencyId, compIndex, subCheckFlag, compInitiationDate): UntypedFormGroup {

    return new UntypedFormGroup({
      active: new UntypedFormControl(false),
      preQCApproveFlag: new UntypedFormControl(false),
      preQCRejectFlag: new UntypedFormControl(false),
      submittedFlag: new UntypedFormControl(false),
      compType: new UntypedFormControl(comptype),
      screeningComponentInfo: this.initComponentForm(compId, subCompId, deqcFlag, currencyId, compIndex, subCheckFlag, compInitiationDate),
      screeningInsufficiency: this.initInsufficiencyForm(compId, subCompId),
      rejectComments: new UntypedFormControl(''),
      qcRejectComments: new UntypedFormControl(''),
      criminalCheckCount: new UntypedFormControl(criminalCheckCount),
      addedByCandidateFlag: new UntypedFormControl(addedByCandidateFlag),
      periodOfStayAddress: new UntypedFormControl([])
    });
  }
  initcomponentFormGroup(component): UntypedFormGroup {

    return new UntypedFormGroup({
      compId: new UntypedFormControl(component.compId),
      component: new UntypedFormArray([])
    });
  }
  initCandidateForm(): UntypedFormGroup {
    const required = this.applicationId === 3 ? Validators.required : null;
    return this.fb.group({
      candidateId: new UntypedFormControl(),
      firstName: new UntypedFormControl('', Validators.compose([Validators.required, Validators.minLength(3)])),
      middleName: new UntypedFormControl(null),
      lastName: new UntypedFormControl(null),
      fatherName: new UntypedFormControl(null, required),
      dob: new UntypedFormControl(null, this.validatedate),
      candidateAliasId: new UntypedFormControl(0),
      aliasFirstName: new UntypedFormControl(null),
      aliasMiddleName: new UntypedFormControl(null),
      aliasLastName: new UntypedFormControl(null),
      countryId: new UntypedFormControl(null),
      alternativeCountryId: new UntypedFormControl(null),
      email: new UntypedFormControl('', Validators.compose(
        [Validators.email, Validators.pattern(this.common.EmailRegX), required])),
      phoneNo: new UntypedFormControl('', Validators.compose(
        [Validators.pattern(/^(0|[1-9][0-9]*)$/), required])),
      remarks: new UntypedFormControl(''),
      pan: new UntypedFormControl(null, this.validatePanCardInput),
      econsentFlag: new UntypedFormControl(false),
      iagreeFlag: new UntypedFormControl(false),
      consentLookupId: new UntypedFormControl(),
      consentLookupName: new UntypedFormControl(),
      consentSignature: new UntypedFormControl(),
      loadocumentHtml: new UntypedFormControl(''),
      address: this.initCommonAddress(true),
      genderLookupId: new UntypedFormControl(0, Validators.required),
      maritalStatusLookupId: new UntypedFormControl(),
      spouseName: new UntypedFormControl(),
      uan: new UntypedFormControl(),
      clientId: new UntypedFormControl(0),
      companySiteVisitFlag: new UntypedFormControl(false),
      // periodOfStay: new UntypedFormControl('', this.applicationId === 3 ? candiadtevalidation : othervalidation),
      // periodOfStayTo: new UntypedFormControl('', this.applicationId === 3 ? date : validation),
      alternativeContactNo: new UntypedFormControl('', Validators.compose(
        [Validators.pattern(/^(0|[1-9][0-9]*)$/)])),
      bestVisitAddress: new UntypedFormControl(''),
      //validationString: new UntypedFormControl(['NOT PROVIDED','Not Provided', 'SINCE BIRTH', 'TILL DATE']),
    });
  }

  initClientDetailForm(): UntypedFormGroup {
    const required = (this.applicationId !== 3) ? Validators.required : null;
    return new UntypedFormGroup({
      screeningId: new UntypedFormControl(0),
      siteName: new UntypedFormControl({ value: '', disabled: true }),
      siteNo: new UntypedFormControl(''),
      urlName: new UntypedFormControl(''),
      applicantId: new UntypedFormControl(null, required),
      applicantIdLabel: new UntypedFormControl('Applicant Id'),
      clientId: new UntypedFormControl(''),
      clientName: new UntypedFormControl(''),
      clientRefNo: new UntypedFormControl('', []),
      caseReceivedDate: new UntypedFormControl(null),
      caseInititationDate: new UntypedFormControl(null),
      flag: new UntypedFormControl(false),
      caseStatusId: new UntypedFormControl('', required),
      casePeriorityId: new UntypedFormControl('', required),
      chargeCode: new UntypedFormControl('', Validators.required),
      chargeCodeFlag: new UntypedFormControl(false),
      scopeByPassFlag: new UntypedFormControl(false),
      ctsFlag: new UntypedFormControl(false),
      component: new UntypedFormControl([]),
      subcompId: new UntypedFormControl('')
      // clientCustomFields: new UntypedFormArray([])
    });

  }
  initmanualClientDetailForm(): UntypedFormGroup {
    return new UntypedFormGroup({
      screeningId: new UntypedFormControl(0),
      siteName: new UntypedFormControl(''),
      siteNo: new UntypedFormControl(''),
      urlName: new UntypedFormControl(''),
      applicantId: new UntypedFormControl(null),
      applicantIdLabel: new UntypedFormControl('Applicant Id'),
      clientId: new UntypedFormControl('', Validators.required),
      clientName: new UntypedFormControl(''),
      clientRefNo: new UntypedFormControl('', Validators.required),
      caseReceivedDate: new UntypedFormControl(null),
      caseInititationDate: new UntypedFormControl(new Date()),
      flag: new UntypedFormControl(false),
      caseStatusId: new UntypedFormControl(),
      casePeriorityId: new UntypedFormControl(),
      chargeCode: new UntypedFormControl(),
      chargeCodeFlag: new UntypedFormControl(false),
      component: new UntypedFormControl('', Validators.required),
      subcompId: new UntypedFormControl(''),
      scopeByPassFlag: new UntypedFormControl(false),

      // clientCustomFields: new UntypedFormArray([])
    });

  }
  initComponentForm(compId, subCompId, deqcFlag, currencyId, compIndex, subCheckFlag, compInitiationDate): UntypedFormGroup {
    const required = this.applicationId !== 3 ? Validators.required : null;
    const min = this.applicationId !== 3 ? Validators.min(1) : null;
    let validFlag: any;
    if (this.screeningService.componentList.length > 0) {
      const subCompNameList = this.screeningService.componentList.filter(x => x.compId === compId && x.screeningSubComponent.length > 0);
      const compNameList = this.screeningService.componentList.filter(x => x.compId === compId);
      let subName: any[] = [];
      if (subCompNameList.length > 0) {
        subCompNameList.forEach(ele => {
          const currName = ele.screeningSubComponent.filter(x => x.subCompName === 'Current Address');

          subName.push(currName[0]);
        });
      }
      if (compNameList.length > 0) {
        if (this.userData.applicationId === 3 && compNameList[0].compName && compNameList[0].compName !== 'Gap Reason' &&
          compNameList[0].compName !== 'Database' && compNameList[0].compName !== 'Address' && compNameList[0].compName !== 'Drug Test'
          && compNameList[0].compName !== 'Emergency Contact Verification' && compNameList[0].compName !== 'Employment (Supervisor)' &&
          compNameList[0].compName !== 'Gap Verification' && compNameList[0].compName !== 'Reference Check' &&
          compNameList[0].compName !== 'Gap Check' && compNameList[0].compName !== 'GAP REASON' &&
          compNameList[0].compName !== 'DATABASE' && compNameList[0].compName !== 'ADDRESS' && compNameList[0].compName !== 'DRUG TEST'
          && compNameList[0].compName !== 'EMERGECY CONTACT VERIFICATION' && compNameList[0].compName !== 'EMPLOYEMENT (SUPERVISOR)' &&
          compNameList[0].compName !== 'GAP VERIFICATION' && this.fresherFlag === false && compNameList[0].compName !== 'REFERENCE CHECK' &&
          compNameList[0].compName !== 'GAP CHECK' && subName.length === 0) {
          validFlag = Validators.required;
        } else {
          validFlag = null;
        }
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
      screenStatusId: new UntypedFormControl(0, this.applicationId !== 3 ? [required, min] : required),
      priorityId: new UntypedFormControl(0, required),
      insuffRaisedFlag: new UntypedFormControl(false),
      notApplicableFlag: new UntypedFormControl(false),
      remark: new UntypedFormControl(),
      insuffRemark: new UntypedFormControl([]),
      insuffRaiseRemark: new UntypedFormControl([]),
      componentDocument: this.fb.array([], validFlag),
      currencyId: new UntypedFormControl(currencyId),
      compIndex: new UntypedFormControl(compIndex + 1),
      qcRejectFlag: new UntypedFormControl(false),
      compInitiationDate: new UntypedFormControl(compInitiationDate),
      reportSource: new UntypedFormControl(),
      caseTypeLookUpId: new UntypedFormControl(0),
      dateTypeLookupId: new UntypedFormControl(0),
      countryTypeLookUpId: new UntypedFormControl(0),
      clientScreeningId: new UntypedFormControl(null),
      caseByPassFlag: new UntypedFormControl(this.screeningService.caseFlagType === this.common.NEWCASE ? true : false),
      verificationRejectFlag: new UntypedFormControl(false),
      forResearchRejectFlag: new UntypedFormControl(false),
      completeFlag: new UntypedFormControl(false),
      subCheckFlag: new UntypedFormControl(subCheckFlag),
      clientApprovalFlag: new UntypedFormControl(false),
      driectAppIndex: new UntypedFormControl(null),
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
    frmArray.push(new UntypedFormGroup({
      insuffDetailId: new UntypedFormControl(0),
      insufficiencyId: new UntypedFormControl(0),
      insuffDate: new UntypedFormControl(null),
      comments: new UntypedFormControl(null),
      createdUserId: new UntypedFormControl(this.userData.userId),
      infoReqFlag: new UntypedFormControl(false),
      docReqFlag: new UntypedFormControl(true)
    }));
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
      array.push(new UntypedFormGroup({
        insuffDetailId: new UntypedFormControl(0),
        insufficiencyId: new UntypedFormControl(0),
        insuffDate: new UntypedFormControl(null),
        comments: new UntypedFormControl(null),
        createdUserId: new UntypedFormControl(this.userData.userId),
        infoReqFlag: new UntypedFormControl(false),
        docReqFlag: new UntypedFormControl(false)
      }));
    }
  }
  initPanForm(): UntypedFormGroup {

    const candiadtevalidation = [Validators.required, this.validatePanInput];
    const othervalidation = [Validators.required, this.validatePanCardInput];
    return new UntypedFormGroup({
      screeningCompId: new UntypedFormControl(),
      screeningPanId: new UntypedFormControl(0),
      pan: new UntypedFormControl('', this.applicationId === 3 ? candiadtevalidation : othervalidation),
      screeningCreditId: new UntypedFormControl(0)
    });
  }
  initCredForm(): UntypedFormGroup {
    const candiadtevalidation = [Validators.required, this.validatePanInput];
    const othervalidation = [Validators.required, this.validatePanCardInput];
    return new UntypedFormGroup({
      screeningCompId: new UntypedFormControl(),
      screeningPanId: new UntypedFormControl(0),
      address: this.initCommonAddress(true),
      pan: new UntypedFormControl('', this.applicationId === 3 ? candiadtevalidation : othervalidation),
      screeningCreditId: new UntypedFormControl(0)
    });
  }
  initUanForm(): UntypedFormGroup {
    return new UntypedFormGroup({
      screeningCompId: new UntypedFormControl(),
      screeningUanid: new UntypedFormControl(0),
      uan: new UntypedFormControl('', Validators.required),

    });
  }
  initGsaForm(): UntypedFormGroup {
    return new UntypedFormGroup({
      screeningCompId: new UntypedFormControl(),
      screeningGsaid: new UntypedFormControl(0),
      sourceused: new UntypedFormControl('', Validators.required),

    });
  }
  initFdaForm(): UntypedFormGroup {
    return new UntypedFormGroup({
      screeningCompId: new UntypedFormControl(),
      screeningFdaid: new UntypedFormControl(0),
      sourceused: new UntypedFormControl('', Validators.required),

    });
  }

  initNsrForm(): UntypedFormGroup {
    return new UntypedFormGroup({
      screeningCompId: new UntypedFormControl(),
      screeningNsrid: new UntypedFormControl(0),
      sourceused: new UntypedFormControl('', Validators.required),

    });
  }
  initNdotDrugForm(): UntypedFormGroup {
    return new UntypedFormGroup({
      screeningCompId: new UntypedFormControl(),
      kitId: new UntypedFormControl('', Validators.required),
      kitType: new UntypedFormControl(),
      screeningNDOTDrugScreenId: new UntypedFormControl(0),
    });
  }

  initCommonAddress(required): UntypedFormGroup {
    // const candiadtevalidation = [this.validateInputDate];

    // const date = [this.validateTillDate];

    return new UntypedFormGroup({
      addressId: new UntypedFormControl(0),
      addLine1: new UntypedFormControl('', Validators.required),
      addLine2: new UntypedFormControl(null),
      addLine3: new UntypedFormControl(null),
      cityId: new UntypedFormControl(null),
      districtId: new UntypedFormControl(null),
      stateId: new UntypedFormControl('', Validators.required),
      countryId: new UntypedFormControl('', Validators.required),
      // postalCode: new UntypedFormControl('', required ? Validators.required : null),
      postalCode: new UntypedFormControl(null),
      locationId: new UntypedFormControl(null),
      country: new UntypedFormControl(''),
      state: new UntypedFormControl(''),
      district: new UntypedFormControl(''),
      city: new UntypedFormControl(''),
      place: new UntypedFormControl(''),
      addressPos: this.fb.array([
        this.fb.group({
          periodOfStay: new UntypedFormControl(null, [Validators.required, this.validateInputDate]),
          periodOfStayTo: new UntypedFormControl(null, [Validators.required, this.validateTillDate]),
          addressPosId: new UntypedFormControl(0),
          addressId: new UntypedFormControl(0),
          screeningCompId: new UntypedFormControl(0),
          reportFlag: new UntypedFormControl(false),
          validationString: new UntypedFormControl([
            "SINCE BIRTH",
            "TILL DATE",
          ]),
        }),
      ]),
    });
  }
  initempeduCommonAddress(required = true): UntypedFormGroup {
    return new UntypedFormGroup({
      addressId: new UntypedFormControl(0),
      addTypeLookName: new UntypedFormControl(''),
      addTypeLookupId: new UntypedFormControl(0),
      addLine1: new UntypedFormControl(''),
      addLine2: new UntypedFormControl(''),
      addLine3: new UntypedFormControl(''),
      addressType: new UntypedFormControl(''),
      addressTypeLookupId: new UntypedFormControl(0),
      cityId: new UntypedFormControl(0),
      city: new UntypedFormControl(''),
      stateId: new UntypedFormControl(0),
      countryId: new UntypedFormControl(''),
      districtId: new UntypedFormControl(0),
      postalCode: new UntypedFormControl(''),
      place: new UntypedFormControl(),
      active: new UntypedFormControl(true),
      stateCode: new UntypedFormControl(0),
      phoneCode: new UntypedFormControl(0),
      locationName: new UntypedFormControl(''),
      createdUserId: new UntypedFormControl(this.userData.userId),
      locationId: new UntypedFormControl(0),
      country: new UntypedFormControl(''),
      clientId: new UntypedFormControl(0),
      periodOfStayTo: new UntypedFormControl(''),
      periodOfStay: new UntypedFormControl(''),
      state: new UntypedFormControl(''),
      district: new UntypedFormControl('')
    });
  }
  initAddressForm(): UntypedFormGroup {
    const candiadtevalidation = [this.validateInputDate];
    const othervalidation = [this.validatedateInputStayFromwithBirt];
    const date = [this.validateTillDate];
    const validation = [this.validatedateInputwitTilldate];
    return this.fb.group({
      address: this.initCommonAddress(true),
      screeningAddressId: new UntypedFormControl(0),
      screeningCriminalCheckId: new UntypedFormControl(0),
      // periodOfStay: new UntypedFormControl(''),
      screeningPanIndiaOCRVId: new UntypedFormControl(0),
      overallStayYears: new UntypedFormControl(''),
      // periodOfStay: new UntypedFormControl('', this.applicationId === 3 ? candiadtevalidation : othervalidation),
      // periodOfStayTo: new UntypedFormControl('', this.applicationId === 3 ? date : validation),
      //validationString: new UntypedFormControl(['NOT PROVIDED', 'Not Provided', 'SINCE BIRTH', 'TILL DATE']),
      checkPermanentAddress: new UntypedFormControl
    },
    );
  }

  initNiciForm(): UntypedFormGroup {
    return new UntypedFormGroup({
      screeningCompId: new UntypedFormControl(),
      aadhaarNumber: new UntypedFormControl('', Validators.compose(
        [Validators.pattern(/^(0|[1-9][0-9]*)$/), Validators.required])),
      screeningNICId: new UntypedFormControl(0),
    });
  }
  initDirectorshipForm(): UntypedFormGroup {
    return new UntypedFormGroup({
      screeningCompId: new UntypedFormControl(),
      identificationNumber: new UntypedFormControl('', Validators.compose(
        [Validators.pattern(/^(0|[1-9][0-9]*)$/), Validators.required])),
      organizationName: new UntypedFormControl('', Validators.required),
      screeningDirectorshipId: new UntypedFormControl(0),
    });
  }
  initEmpSupervisorForm(isrequired): UntypedFormGroup {
    const mailvalidation = [this.validateMailInput];
    const contactvalidation = [this.validateContactInput]
    return this.fb.group({
      supervisorId: new UntypedFormControl(0),
      supervisorName: new UntypedFormControl(''),
      supervisorEmail: this.initContactForm(Validators.compose(mailvalidation)),
      supervisorDesignation: new UntypedFormControl(),
      supervisorContactNo: this.initContactForm(Validators.compose(contactvalidation)),
      countryId: new UntypedFormControl(''),
      country: new UntypedFormControl(),
      city: new UntypedFormControl(),
      loggedIn: new UntypedFormControl(this.userData.userId)
    });
  }
  initEmployerForm(index, compId): UntypedFormGroup {
    const required = this.applicationId === 3 ? Validators.required : null;
    const candiadtevalidation = [Validators.required, this.validateInput];
    const othervalidation = [this.validatedateInput];
    const tilldatevalidation = [this.validatedateInputwitTilldate];
    const candidatetilldatevalidation = [Validators.required, this.validateTillDate];
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
      fromDate: new UntypedFormControl(null, this.applicationId === 3 ? candiadtevalidation : othervalidation),
      toDate: new UntypedFormControl(null, this.applicationId === 3 ? candidatetilldatevalidation : tilldatevalidation),
      ctc: new UntypedFormControl(null, Validators.required),
      rocRegistration: new UntypedFormControl(null),
      genuineDocFlag: new UntypedFormControl(true),
      remarks: new UntypedFormControl(null),
      officialName: new UntypedFormControl(null),
      holdFlag: new UntypedFormControl(null),
      empInitiationDate: new UntypedFormControl(null),
      validationString: new UntypedFormControl(['NOT PROVIDED', 'Not Provided']),
      fresherFlag: new UntypedFormControl(false),
      reasonForLeaving: new UntypedFormControl(''),
      hrName: new UntypedFormControl(''),
      hrEmail: new UntypedFormControl('', Validators.compose(
        [Validators.email, Validators.pattern(this.common.EmailRegX)])),
      hrContactNo: new UntypedFormControl('', Validators.compose(
        [Validators.pattern(/^(0|[1-9][0-9]*)$/), Validators.minLength(10), Validators.maxLength(10)])),
      npRemarks: new UntypedFormControl(),
      npReasonLookupId: new UntypedFormControl(),
      employmentNumber: new UntypedFormControl(null),
    },
    );
  }
  initsupervisorDetForm(isrequired): UntypedFormGroup {
    const mailvalidation = [this.validateMailInput];
    const contactvalidation = [this.validateContactInput]
    return this.fb.group({
      supervisorId: new UntypedFormControl(0),
      supervisorName: new UntypedFormControl('', isrequired ? Validators.required : null),
      supervisorEmail: this.initContactForm(mailvalidation),
      supervisorDesignation: new UntypedFormControl(),
      supervisorContactNo: this.initContactForm(contactvalidation),
      countryId: new UntypedFormControl(''),
      country: new UntypedFormControl(),
      city: new UntypedFormControl(),
      loggedIn: new UntypedFormControl(this.userData.userId)
    });
  }
  initContactForm(validators: Validators) {
    return this.fb.group({
      transContactId: new UntypedFormControl(0),
      destLookupId: new UntypedFormControl(0),
      destName: new UntypedFormControl(''),
      contactId: new UntypedFormControl(0),
      contactData: new UntypedFormControl('', validators),
      lookupId: new UntypedFormControl(0),

    });
  }
  initEducationForm(index, compId): UntypedFormGroup {
    const required = this.applicationId === 3 ? Validators.required : null;
    const candiadtevalidation = [Validators.required, this.validatedateInput];
    const othervalidation = [this.validatedateInput];

    return this.fb.group({
      screeningEducationId: new UntypedFormControl(0),
      institutionName: new UntypedFormControl('', Validators.required),
      institutionId: new UntypedFormControl(0),
      instituteName: new UntypedFormControl('', this.userData.applicationId !== 1 ? Validators.required : null),
      empInsAddressId: new UntypedFormControl(0),
      fakeinstitution: new UntypedFormControl(''),
      registrationNumber: new UntypedFormControl(null, required),
      rollNumber: new UntypedFormControl(null),
      degree: new UntypedFormControl('', Validators.required),
      major: new UntypedFormControl(null),
      courseCompletion: new UntypedFormControl(null, this.applicationId === 3 ? candiadtevalidation : othervalidation),
      certificateIssue: new UntypedFormControl(null, this.applicationId === 3 ? candiadtevalidation : othervalidation),
      gpa: new UntypedFormControl(null, required),
      higherEduFlag: new UntypedFormControl(false),
      educationTypeLookupId: new UntypedFormControl(0),
      universityTypeLookupId: new UntypedFormControl(''),
      institutionType: new UntypedFormControl(''),
      educationCategoryName: new UntypedFormControl(''),
      educationType: new UntypedFormControl(''),
      otherCertificationCourse: new UntypedFormControl(''),
      screeningCompId: new UntypedFormControl(0),
      address: this.initempeduCommonAddress(true),
      nameAsPerProof: new UntypedFormControl(null),
      insLocation: new UntypedFormControl(''),
      npRemarks: new UntypedFormControl(),
      npReasonLookupId: new UntypedFormControl(),
      npReason: new UntypedFormControl(),
      courseStart: new UntypedFormControl(null, this.applicationId === 3 ? candiadtevalidation : othervalidation),
      validationString: new UntypedFormControl(['NOT PROVIDED', 'Not Provided']),
    },
    );
  }
  initDrugForm(): UntypedFormGroup {
    return new UntypedFormGroup({
      screeningCompId: new UntypedFormControl(),
      kitId: new UntypedFormControl('', Validators.required),
      kitType: new UntypedFormControl(),
      screeningDrugTestId: new UntypedFormControl(0),
      address: this.initCommonNAddress(true)
    });
  }
  initLicenseForm(): UntypedFormGroup {
    const required = this.applicationId === 3 ? Validators.required : null;
    const candiadtevalidation = [Validators.required, this.validateInput];
    const othervalidation = [this.validatedateInput];

    return this.fb.group({
      address: this.initCommonNAddress(true),
      periodOfStay: new UntypedFormControl(''),
      screeningLicenseId: new UntypedFormControl(0),
      issuingAuthority: new UntypedFormControl('', Validators.required),
      licenseNo: new UntypedFormControl('', Validators.required),
      regNo: new UntypedFormControl(''),
      validFrom: new UntypedFormControl('', this.applicationId === 3 ? candiadtevalidation : othervalidation),
      validTo: new UntypedFormControl('', this.applicationId === 3 ? candiadtevalidation : othervalidation),
      validationString: new UntypedFormControl(['NOT PROVIDED', 'Not Provided']),
    },
    );
  }
  initVoterIdForm(): UntypedFormGroup {
    return new UntypedFormGroup({
      screeningVoterId: new UntypedFormControl(0),
      screeningCompId: new UntypedFormControl(),
      voterId: new UntypedFormControl('', [Validators.required, this.validateVoterIdInput]),
      voterName: new UntypedFormControl('', Validators.required),
      genderLookupId: new UntypedFormControl(0, Validators.required),
      gender: new UntypedFormControl(),
      address: this.initCommonNAddress(true)
    });
  }
  initEmployeementSupForm(required): UntypedFormGroup {
    const mailvalidation = [this.validateMailInput];
    const contactvalidation = [this.validateContactInput]
    return new UntypedFormGroup({
      screeningEmpSupervisorId: new UntypedFormControl(0),
      professionalId: new UntypedFormControl(0),
      screeningCompId: new UntypedFormControl(),
      professionalName: new UntypedFormControl('', Validators.required),
      // address: this.initCommonAddress(required)
      supervisorEmail: this.initContactForm(mailvalidation),
      supervisorDesignation: new UntypedFormControl('', Validators.required),
      supervisorContactNo: this.initContactForm(contactvalidation),
      supervisorCompanyName: new UntypedFormControl(),
      countryId: new UntypedFormControl(),
      country: new UntypedFormControl(),
      city: new UntypedFormControl()
    });
  }
  initScreeningDocForm() {
    return new UntypedFormGroup({
      screeningDocId: new UntypedFormControl(0),
      document: new UntypedFormControl([]),
      fileName: new UntypedFormControl(''),
      docName: new UntypedFormControl(''),
      filePath: new UntypedFormControl(''),
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
      address: this.initCommonNAddress(true),
      screeningPassportId: new UntypedFormControl(0),
      placeOfResidence: new UntypedFormControl(''),
      expiryDate: new UntypedFormControl(),
      passportNumber: new UntypedFormControl(''),
      //passportNumber: new UntypedFormControl('', this.applicationId === 3 ? candiadtevalidation : othervalidation),
      dateOfIssue: new UntypedFormControl('', this.applicationId === 3 ? date : validation),
      placeOfIssue: new UntypedFormControl('', Validators.required),
      machineReadableZone: new UntypedFormControl(''),
    },
    );
  }

  initCompanySiteVisitForm(): UntypedFormGroup {
    return new UntypedFormGroup({
      companyName: new UntypedFormControl('', Validators.required),
      screeningCompanySiteVisitId: new UntypedFormControl(0),
      address: this.initCommonAddress(true),
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
      sourceUsed: new UntypedFormControl()
    });
  }
  initFACIS1Form(): UntypedFormGroup {
    return new UntypedFormGroup({
      screeningFACIS1Id: new UntypedFormControl(0),
      sourceUsed: new UntypedFormControl()
    });
  }
  initFACIS2Form(): UntypedFormGroup {
    return new UntypedFormGroup({
      screeningFACIS2Id: new UntypedFormControl(0),
      sourceUsed: new UntypedFormControl()
    });
  }
  initFACIS3Form(): UntypedFormGroup {
    return new UntypedFormGroup({
      screeningFACIS3Id: new UntypedFormControl(0),
      sourceUsed: new UntypedFormControl()
    });
  }
  initFACISMForm(): UntypedFormGroup {
    return new UntypedFormGroup({
      screeningFACISMId: new UntypedFormControl(0),
      sourceUsed: new UntypedFormControl()
    });
  }
  initTENNESSEEForm(): UntypedFormGroup {
    return new UntypedFormGroup({
      screeningTENNESSEEId: new UntypedFormControl(0),
      sourceUsed: new UntypedFormControl()
    });
  }
  initRefCheckForm(): UntypedFormGroup {
    return new UntypedFormGroup({
      professionalName: new UntypedFormControl('', Validators.required),
      screeningRefCheckId: new UntypedFormControl(0),
      reportFlagLookupId: new UntypedFormControl(''),
      refPhoneNo: new UntypedFormControl(''),
      refEmail: new UntypedFormControl('', Validators.compose(
        [Validators.email, Validators.pattern(this.common.EmailRegX)])),
      refDesignation: new UntypedFormControl(),
      refCompanyName: new UntypedFormControl(),
      countryId: new UntypedFormControl(),
      city: new UntypedFormControl(),
      country: new UntypedFormControl()
      // address: this.initCommonAddress(true),
    });
  }
  initSelftEmpForm(): UntypedFormGroup {
    return new UntypedFormGroup({
      screeningRefSelfEmpId: new UntypedFormControl(0),
      screeningCompId: new UntypedFormControl(),
      professionalId: new UntypedFormControl(0),
      professionalName: new UntypedFormControl('', Validators.required),
      // address: this.initCommonAddress()
      supervisorEmail: this.initContactForm(Validators.compose(
        [Validators.email, Validators.pattern(this.common.EmailRegX)])),
      supervisorDesignation: new UntypedFormControl(),
      supervisorContactNo: this.initContactForm(Validators.compose(
        [Validators.pattern(/^(0|[1-9][0-9]*)$/)])),
      supervisorCompanyName: new UntypedFormControl(),
      countryId: new UntypedFormControl(''),
      city: new UntypedFormControl(),
      country: new UntypedFormControl(),
    });
  }
  initCriminalDatabaseForm(type, DbFlag): UntypedFormGroup {
    const required = (type === this.common.CRIMINAL_DATABASE ? Validators.required : null);
    const candiadtevalidation = [this.validateInputDate];
    const othervalidation = [this.validatedateInputStayFromwithBirt];
    const date = [this.validateTillDate];
    const validation = [this.validatedateInputwitTilldate];
    if (type === this.common.CRIMINAL_DATABASE || DbFlag === true) {
      return this.fb.group({
        screeningCriminalDatabaseId: new UntypedFormControl(0),
        addressTypeCheckLookupId: new UntypedFormControl('', null),
        sourceName: new UntypedFormControl(''),
      },
      );
    } else {
      return this.fb.group({
        screeningCriminalDatabaseId: new UntypedFormControl(0),
        address: this.initCommonAddress(true),
        addressTypeLookupId: new UntypedFormControl('', Validators.required),
        addressType: new UntypedFormControl(),
        addressTypeCheckLookupId: new UntypedFormControl('', null),
        sourceName: new UntypedFormControl(''),
        addressTypeCheckLookupName: new UntypedFormControl(),
        addressTypeCheck: new UntypedFormControl(),
        // periodOfStay: new UntypedFormControl('', this.applicationId === 3 ? candiadtevalidation : othervalidation),
        // periodOfStayTo: new UntypedFormControl('', this.applicationId === 3 ? date : validation),
        //validationString: new UntypedFormControl(['NOT PROVIDED', 'Not Provided', 'SINCE BIRTH', 'TILL DATE']),
        checkPermanentAddress: new UntypedFormControl()
      },
      );
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
      addresscheck: new UntypedFormControl(''),
      addressTypeCheckLookupId: new UntypedFormControl(''),
      addressTypeCheckLookupName: new UntypedFormControl(),
      address: this.initCommonAddress(true),
      // periodOfStayFrom: new UntypedFormControl('', this.applicationId === 3 ? candiadtevalidation : othervalidation),
      // periodOfStayTo: new UntypedFormControl('', this.applicationId === 3 ? date : validation),
      gapDuration: new UntypedFormControl(),
      checkPermanentAddress: new UntypedFormControl(),
      // validationString: new UntypedFormControl(['NOT PROVIDED', 'Not Provided', 'SINCE BIRTH', 'TILL DATE']),
    },
    );
  }
  initCriminalCheckPcc2Form(): UntypedFormGroup {
    const candiadtevalidation = [this.validateInputDate];
    const othervalidation = [this.validatedateInputStayFromwithBirt];
    const date = [this.validateTillDate];
    const validation = [this.validatedateInputwitTilldate];
    return this.fb.group({
      screeningCriminalCheckPCCId: new UntypedFormControl(0),
      screeningCompId: new UntypedFormControl(),
      addressTypeCheckLookupId: new UntypedFormControl('', Validators.required),
      addressTypeCheckLookupName: new UntypedFormControl(),
      address: new UntypedFormArray([]),
      // periodOfStayFrom: new UntypedFormControl('', this.applicationId === 3 ? candiadtevalidation : othervalidation),
      // periodOfStayTo: new UntypedFormControl('', this.applicationId === 3 ? date : validation),
      // validationString: new UntypedFormControl(['NOT PROVIDED', 'Not Provided', 'SINCE BIRTH', 'TILL DATE']),
      checkPermanentAddress: new UntypedFormControl()
    },
    );
  }

  initCriminalCheckPcc3Form(): UntypedFormGroup {
    const candiadtevalidation = [this.validateInputDate];
    const othervalidation = [this.validatedateInputStayFromwithBirt];
    const date = [this.validateTillDate];
    const validation = [this.validatedateInputwitTilldate];
    return this.fb.group({
      screeningCriminalCheckId: new UntypedFormControl(0),
      screeningCompId: new UntypedFormControl(),
      addressTypeCheckLookupId: new UntypedFormControl(''),
      addressTypeCheckLookupName: new UntypedFormControl(),
      addressTypeLookupId: new UntypedFormControl('', Validators.required),
      addressTypeCheck: new UntypedFormControl(),
      addressType: new UntypedFormControl(),
      // periodOfStayFrom: new UntypedFormControl('', this.applicationId === 3 ? candiadtevalidation : othervalidation),
      // periodOfStayTo: new UntypedFormControl('', this.applicationId === 3 ? date : validation),
      address: this.initCommonAddress(true),
      // validationString: new UntypedFormControl(['NOT PROVIDED', 'Not Provided', 'SINCE BIRTH', 'TILL DATE']),
      checkPermanentAddress: new UntypedFormControl()
    },
    );
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
      screeningGapVerifyId: new UntypedFormControl(0),
      screeningCompId: new UntypedFormControl(),
      gapTypeLookupId: new UntypedFormControl(null, Validators.required),
      gapType: new UntypedFormControl(),
      gapFrom: new UntypedFormControl(null, this.applicationId === 3 ? candiadtevalidation : othervalidation),
      gapTo: new UntypedFormControl(null, this.applicationId === 3 ? candiadtevalidation : othervalidation),
      //validationString: new UntypedFormControl(['NOT PROVIDED', 'Not Provided']),
    },
    );
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
    return this.fb.group({
      screeningJCRId: new UntypedFormControl(0),
      screeningCompId: new UntypedFormControl(),
      address: this.initCommonAddress(true),
      // periodOfStay: new UntypedFormControl('', this.validatedateInputStayFromwithBirt),
      // periodOfStayTo: new UntypedFormControl('', this.validatedateInputwitTilldate),
      //validationString: new UntypedFormControl(['NOT PROVIDED', 'Not Provided', 'SINCE BIRTH', 'TILL DATE']),
    },
      // { validator: this.dateCompare('periodOfStay', 'periodOfStayTo') },
    );
  }
  initBankStatementForm(): UntypedFormGroup {
    const candiadtevalidation = [this.validateInput];
    const othervalidation = [this.validatedateInput];
    return this.fb.group({
      screeningBankStatementId: new UntypedFormControl(0),
      screeningCompId: new UntypedFormControl(),
      employerId: new UntypedFormControl(null),
      employerName: new UntypedFormControl(null, Validators.required),
      fromDate: new UntypedFormControl('', this.applicationId === 3 ? candiadtevalidation : othervalidation),
      toDate: new UntypedFormControl('', this.applicationId === 3 ? candiadtevalidation : othervalidation),
      bankName: new UntypedFormControl(null, Validators.required),
      branchName: new UntypedFormControl(null, Validators.required),
      accountNo: new UntypedFormControl(null, Validators.required),
      statementFrom: new UntypedFormControl(null, Validators.required),
      statementTo: new UntypedFormControl(null, Validators.required),
      //validationString: new UntypedFormControl(['NOT PROVIDED', 'Not Provided']),
    },
      // { validator: this.dateCompare('fromDate', 'toDate') }
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
      fieldValue: new UntypedFormControl(data.fieldValue, data.mandatoryFlag ? Validators.required : null),
      screeningClientCustomFieldId: new UntypedFormControl(data.screeningClientCustomFieldId),
    });
  }
  cvValidationForm(field, isbind) {
    return new UntypedFormGroup({
      screeningCVId: new UntypedFormControl(isbind ? field.screeningCVId : 0),
      screeningCompId: new UntypedFormControl(isbind ? field.screeningCompId : 0),
      cvCatFieldMapId: new UntypedFormControl(field.cvCatFieldMapId),
      fieldValue: new UntypedFormControl(isbind ? field.fieldValue : '', field.mandatoryFlag ? Validators.required : null),
      cvFlag: new UntypedFormControl(isbind ? field.cvFlag : false),
      cvRemarks: new UntypedFormControl(isbind ? field.cvRemarks : ''),
      bgvFlag: new UntypedFormControl(isbind ? field.bgvFlag : false),
      bgvRemarks: new UntypedFormControl(isbind ? field.bgvRemarks : ''),
      supportDocFlag: new UntypedFormControl(isbind ? field.supportDocFlag : false),
      supportDocRemarks: new UntypedFormControl(isbind ? field.supportDocRemarks : ''),
      remaks: new UntypedFormControl(isbind ? field.remaks : ''),
      categoryName: new UntypedFormControl(field.categoryName),
      displayOrder: new UntypedFormControl(field.displayOrder),
      fieldName: new UntypedFormControl(field.fieldName),
      fieldType: new UntypedFormControl(field.fieldType)
    });
  }
  initAbroad() {
    return this.fb.group({
      screeningCompId: new UntypedFormControl(0),
      screeningAbroadCompId: new UntypedFormControl(0),
      informationSource: new UntypedFormControl('', Validators.required),
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
      data.map(m => {
        if (!cvList.some(s => s === m.categoryName)) {
          cvList.push(m.categoryName);
        }
      });
    }
    const group: any = {};
    cvList.forEach(question => {
      group[question] = new UntypedFormArray([]);
    });
    return new UntypedFormGroup(group) as UntypedFormGroup;
  }

  createCvValidationForm(form: UntypedFormGroup, data = [], isEdit) {
    const cvValidationList: any[] = [];
    const cvList: any[] = [];
    if (data) {
      data.map(m => {
        if (!cvList.some(s => s === m.categoryName)) {
          cvList.push(m.categoryName);
        }
      });
    }
    cvList.forEach(m => {
      const singlefrmArray = form.get(m) as UntypedFormArray;
      const dummy: any[] = [];
      const address = data.filter(f => f.categoryName === m);
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
    return (notProviedREGEX.test(value) || notREGEX.test(value)) ? null : {
      validateInput: {
        valid: false
      }
    };
  }
  PassportValidateInput(c: UntypedFormControl) {
    const notREGEX = /([A-Z]){1}([0-9]){7}?$/;
    const notProviedREGEX = /^(NOT PROVIDED)$/;
    if (c.value) {
      const value = c.value ? c.value.toUpperCase() : c.value;
      return (notProviedREGEX.test(value) || notREGEX.test(value)) ? null : {
        passportvalidate: {
          invalidPattern: true
        }
      };
    }
  }
  PassportInput(c: UntypedFormControl) {
    const notREGEX = /([A-Z]){1}([0-9]){7}?$/;
    if (c.value) {
      const value = c.value ? c.value.toUpperCase() : c.value;
      return (notREGEX.test(value)) ? null : {
        passportvalidate: {
          invalidPattern: true
        }
      };
    }
  }
  validatePanInput(c: UntypedFormControl) {
    const panREGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (c.value) {
      const value = c.value ? c.value.toUpperCase() : c.value;
      return (panREGEX.test(value)) ? null : {
        panvalidate: {
          invalidPattern: true
        }
      };
    }
  }
  validatePanCardInput(c: UntypedFormControl) {
    const panREGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const notProviedREGEX = /^(NOT PROVIDED)$/;
    if (c.value) {
      const value = c.value ? c.value.toUpperCase() : c.value;
      return (notProviedREGEX.test(value) || panREGEX.test(value)) ? null : {
        panvalidate: {
          invalidPattern: true
        }
      };
    }
  }
  validateVoterIdInput(c: UntypedFormControl) {
    const voterREGEX1 = /^[A-Z]{3}[0-9]{7}$/;
    const voterREGEX2 = /^([A-Z]){2}\/([0-9]{2})\/([0-9]{3})\/([0-9]{7})$/;
    if (c.value) {
      const value = c.value ? c.value.toUpperCase() : c.value;
      return (voterREGEX1.test(value) || voterREGEX2.test(value)) ? null : {
        voter: {
          invalidPattern: true
        }
      };
    }
  }
  validateInput(c: UntypedFormControl) {
    const ddmmyyyyREGEX = /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
    const ddmmmyyyyREGEX = /^(0[1-9]|1\d|2\d|3[01])\/(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const mmmyyyyREGEX = /^(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const yyyyREGEX = /^(19|20)\d{2}$/;
    if (c.value) {
      const value = c.value.toUpperCase();
      return (ddmmyyyyREGEX.test(value) || ddmmmyyyyREGEX.test(value.toUpperCase())
        || mmmyyyyREGEX.test(value.toUpperCase()) || yyyyREGEX.test(value.toUpperCase())) ? null : {
        date: {
          invalidPattern: true
        }
      };
    }
  }
  validateMailInput(c: UntypedFormControl) {
    const notProvidedREGX1 = /^(Not Provided)$/;
    const notProviedREGEX = /^(NOT PROVIDED)$/;
    const emailREGX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,100}$/;
    //const emailREGX = this.common.EmailRegX;

    if (c.value) {
      const value = c.value ? c.value.toUpperCase() : c.value;
      return (notProviedREGEX.test(value) || notProvidedREGX1.test(value) || emailREGX.test(value)) ? null : {
        panvalidate: {
          invalidPattern: true
        }
      };
    }
  }
  validateContactInput(c: UntypedFormControl) {
    const notProvidedREGX1 = /^(Not Provided)$/;
    const contREGEX = /^(0|[1-9][0-9]*)$/
    const notProviedREGEX = /^(NOT PROVIDED)$/;
    if (c.value) {
      const value = c.value ? c.value.toUpperCase() : c.value;
      return (notProviedREGEX.test(value) || notProvidedREGX1.test(value) || contREGEX.test(value)) ? null : {
        panvalidate: {
          invalidPattern: true
        }
      };
    }
  }
  validatedateInput(c: UntypedFormControl) {
    const ddmmyyyyREGEX = /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
    const ddmmmyyyyREGEX = /^(0[1-9]|1\d|2\d|3[01])\/(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const mmmyyyyREGEX = /^(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const notProvidedREGX1 = /^(Not Provided)$/;
    const yyyyREGEX = /^(19|20)\d{2}$/;
    const notProviedREGEX = /^(NOT PROVIDED)$/;

    if (c.value) {
      const value = c.value.toUpperCase();
      return (notProviedREGEX.test(value) || notProvidedREGX1.test(value) || ddmmyyyyREGEX.test(value) || ddmmmyyyyREGEX.test(value.toUpperCase())
        || mmmyyyyREGEX.test(value.toUpperCase()) || yyyyREGEX.test(value.toUpperCase())) ? null : {
        date: {
          invalidPattern: true
        }
      };
    }
  }
  validatedate(c: UntypedFormControl) {
    const ddmmyyyyREGEX = /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
    const ddmmmyyyyREGEX = /^(0[1-9]|1\d|2\d|3[01])\/(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    // const mmmyyyyREGEX = /^(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const yyyyREGEX = /^(19|20)\d{2}$/;
    if (c.value) {
      const value = c.value.toUpperCase();
      return (ddmmyyyyREGEX.test(value) || ddmmmyyyyREGEX.test(value.toUpperCase()) ||
        yyyyREGEX.test(value.toUpperCase())) ? null : {
        date: {
          invalidPattern: true
        }
      };
    }
  }
  validatedateInputwitTilldate(c: UntypedFormControl) {
    const ddmmyyyyREGEX = /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
    const ddmmmyyyyREGEX = /^(0[1-9]|1\d|2\d|3[01])\/(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const mmmyyyyREGEX = /^(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const yyyyREGEX = /^(19|20)\d{2}$/;
    const notProviedREGEX = /^(NOT PROVIDED)$/;
    const tillDateREGEX = /^(TILL DATE)$/;
    if (c.value) {
      const value = c.value.toUpperCase();
      return (notProviedREGEX.test(value) || tillDateREGEX.test(value) || ddmmyyyyREGEX.test(value) || ddmmmyyyyREGEX.test(value)
        || mmmyyyyREGEX.test(value) || yyyyREGEX.test(value)) ? null : {
        date: {
          invalidPattern: true
        }
      };
    }
  }
  validateTillDate(c: UntypedFormControl) {
    const ddmmyyyyREGEX = /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
    const ddmmmyyyyREGEX = /^(0[1-9]|1\d|2\d|3[01])\/(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const mmmyyyyREGEX = /^(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const tillDateREGEX = /^(TILL DATE)$/;
    const yyyyREGEX = /^(19|20)\d{2}$/;
    if (c.value) {
      const value = c.value.toUpperCase();
      return (tillDateREGEX.test(value) || ddmmyyyyREGEX.test(value) || ddmmmyyyyREGEX.test(value)
        || mmmyyyyREGEX.test(value) || yyyyREGEX.test(value)) ? null : {
        date: {
          invalidPattern: true
        }
      };
    }
  }
  validateInputDate(c: UntypedFormControl) {
    const ddmmyyyyREGEX = /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
    const ddmmmyyyyREGEX = /^(0[1-9]|1\d|2\d|3[01])\/(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const mmmyyyyREGEX = /^(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const yyyyREGEX = /^(19|20)\d{2}$/;
    const sincebrithREGEX = /^(SINCE BIRTH)?$/;
    if (c.value) {
      const value = c.value.toUpperCase();
      return (sincebrithREGEX.test(value) || ddmmyyyyREGEX.test(value) ||
        ddmmmyyyyREGEX.test(value) || mmmyyyyREGEX.test(value) || yyyyREGEX.test(value)) ? null : {
        date: {
          invalidPattern: true
        }
      };
    }
  }
  validatedateInputStayFromwithBirt(c: UntypedFormControl) {
    const ddmmyyyyREGEX = /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
    const ddmmmyyyyREGEX = /^(0[1-9]|1\d|2\d|3[01])\/(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const mmmyyyyREGEX = /^(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const yyyyREGEX = /^(19|20)\d{2}$/;
    const notProviedREGEX = /([Nn]){1}([Oo]){1}([Tt]){1}([ ]){1}([Pp]){1}([Rr]){1}([Oo]){1}([Vv]){1}([Ii]){1}([Dd]){1}([Ee]){1}([Dd]){1}?$/;
    const sincebrithREGEX = /^(SINCE BIRTH)?$/;
    // const yearsREGEX = /^([0-9]){2}( YEARS)?$/;
    // const yearREGEX = /^(([1])( YEAR)|[2-9]{2}( YEARS))?$/;
    if (c.value) {
      const value = c.value.toUpperCase();
      return (sincebrithREGEX.test(value) || notProviedREGEX.test(value) || ddmmyyyyREGEX.test(value) ||
        ddmmmyyyyREGEX.test(value) || mmmyyyyREGEX.test(value) || yyyyREGEX.test(value)) ? null : {
        date: {
          invalidPattern: true
        }
      };
    }
  }
  dateCompare(fromDate: string, toDate: string, index?: number, compId?: number) {
    return (form: any): { [key: string]: any } => {
      let startdate: any;
      let enddate: any;
      form = form.get('UntypedFormGroup') ? form.get('UntypedFormGroup') : form;
      const validationString = form.get('validationString')?.value;

      if (form.controls[fromDate].value && form.controls[toDate].value) {
        // if (form.controls[fromDate].value !== 'NOT PROVIDED') {
        if ((form.controls[fromDate].valid && !validationString.some(s => s ===
          (form.controls[fromDate].value ? form.controls[fromDate].value.toUpperCase() : form.controls[fromDate].value)))) {
          startdate = this.common.convertDate(form.controls[fromDate].value);
          if ((startdate !== 'Invalid Date' && startdate !== '' && Object.prototype.toString.call(startdate) === '[object Date]')) {
            // if (form.controls[toDate].value !== 'NOT PROVIDED') {
            if ((form.controls[toDate].valid || form.controls[toDate].errors.comparison === true) &&
              !validationString.some(s => s === form.controls[toDate].value)) {
              enddate = this.common.convertDate(form.controls[toDate].value);

              if (enddate !== 'Invalid Date' && enddate !== '' && Object.prototype.toString.call(enddate) === '[object Date]') {
                // it is a date
                if (isNaN(startdate.getTime())) {  // d.valueOf() could also work
                  // date is not valid
                  form.get(toDate).setErrors({ date: { invalidPattern: true } });
                  return { date: { invalidPattern: true } };
                } else {
                  // date is valid
                  if (startdate.setHours(0, 0, 0, 0) <= enddate.setHours(0, 0, 0, 0)) {
                    if (index > 0 && compId > 0) {
                      let compArr: any[] = [];
                      const formRawValue = this.fileSubmission.getRawValue();
                      compArr = formRawValue.screeningComponent.find(x => x.compId ===
                        compId).component;
                      for (let i = index; i >= 0; i--) {
                        if (i > 0) {
                          const validation = compArr[i - 1].compRef['validationString'];
                          const validstring = validation ? validation.some(s => s === compArr[i - 1].compRef[fromDate]) : '';
                          if (!validstring && compArr[i - 1].compRef[fromDate]) {
                            if (i > 0 && this.common.convertDate(compArr[i - 1].compRef[fromDate]) <=
                              this.common.convertDate(compArr[index].compRef[fromDate])) {
                              form.get(fromDate).setErrors(null);
                              form.get(fromDate).clearValidators();
                              form.get(fromDate).setErrors({ date: { overLap: true } });
                              return { date: { overLap: true } };
                            } else {
                              if (!isNaN(this.common.convertDate(compArr[i - 1].compRef[fromDate]).getTime())) {
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
            if (form.get(fromDate).value !== 'SINCE BIRTH') {
              form.get(fromDate).setErrors({ date: { invalidPattern: true } });
              return { date: { invalidPattern: true, overLap: null } };
            } else {
              form.get(fromDate).setErrors(null);
              return {};
            }
          }
        }
      } else if (index > 0 && compId > 0 && this.common.convertDate(form.controls[fromDate].value) !== 'Invalid date' &&
        Object.prototype.toString.call(this.common.convertDate(form.controls[fromDate].value)) === '[object Date]'
      ) {
        if (form.get(fromDate).value) {
          let compArr: any[] = [];
          const formRawValue = this.fileSubmission.getRawValue();
          compArr = formRawValue.screeningComponent.find(x => x.compId ===
            compId).component;
          for (let i = index; i >= 0; i--) {
            if (i > 0) {
              const validation = compArr[i - 1].compRef['validationString'];
              const validstring = validation.some(s => s === compArr[i - 1].compRef[fromDate]);
              if (!validstring && compArr[i - 1].compRef[fromDate]) {
                if (i > 0 && this.common.convertDate(compArr[i - 1].compRef[fromDate]) <=
                  this.common.convertDate(compArr[index].compRef[fromDate])) {
                  form.get(fromDate).setErrors({ date: { overLap: true } });
                  form.get(fromDate).markAllAsTouched();
                  return { date: { overLap: true } };
                } else {
                  if (!isNaN(this.common.convertDate(compArr[i - 1].compRef[fromDate]).getTime())) {
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

  // convertDate(datestring): any {
  //   let year = 0;
  //   let month: any;
  //   let date = 0;
  //   if ((typeof datestring === 'string') && (datestring.indexOf('/') > -1)) {
  //     const str = datestring.split('/');
  //     if (str.length === 3) {
  //       if (isNaN(Number(str[1]))) {
  //         if (this.common.month.findIndex(f => f === str[1]) > -1) {
  //           year = Number(str[2]);
  //           month = this.common.month.findIndex(f => f === str[1]);
  //           date = Number(str[0]);
  //           return new Date(year, month, date);
  //         } else {
  //           return 'Invalid date';
  //         }
  //       } else {
  //         if (Number(str[1]) > 12) {
  //           return 'Invalid date';
  //         } else {
  //           year = Number(str[2]);
  //           month = Number(str[1]);
  //           date = Number(str[0]);
  //           return new Date(year, month - 1, date);
  //         }
  //       }
  //     } else if (str.length === 2) {
  //       if (isNaN(Number(str[0]))) {
  //         if (this.common.month.findIndex(f => f === str[0]) > -1) {
  //           year = Number(str[1]);
  //           month = isNaN(Number(str[0])) ? this.common.month.findIndex(f => f === str[0]) : str[0];
  //           return new Date(year, month, 1);
  //         } else {
  //           return 'Invalid date';
  //         }
  //       }
  //       // else {
  //       //   if (Number(str[0]) > 12) {
  //       //     return 'Invalid date';
  //       //   } else {
  //       //     year = Number(str[1]);
  //       //     month = isNaN(Number(str[0])) ? this.common.month.findIndex(f => f === str[0]) : str[0];
  //       //     return new Date(year, month, 1);
  //       //   }
  //       // }
  //     }
  //   } else {
  //     if (isNaN(Number(datestring))) {
  //       return 'Invalid date';
  //     }
  //     return new Date(Number(datestring), 0, 1);
  //   }
  // }
  ngAfterViewInit() {
    this.stepperChange(0);
  }
  stepperChange(index: number) {
    const data = document.getElementsByClassName('list');
    if (data.length > 0) {
      data[index].classList.add('active');
      data[index].classList.add('completed');
      for (let i = 0; i < data.length; i++) {
        if (index === i) {
          data[i].classList.add('active');
        } else {
          data[i].classList.remove('active');

        }
      }
    }
    window.scrollTo(0, 0);
  }
  saveAndPaycase() {
    this.authService.getPaymentkey().subscribe(data => {
      this.paymentKey = data
      this.authService.AddUpdatePayment({ LoggedId: this.userData.userId, Amount: this.price }).subscribe(data => {
        if (data.value != null) {
          this.router.navigate(['dashboard/screening/paymentGateway']);
          this.authService.paymentDetails = {
            Paymentid: data.value, ApiKey: this.paymentKey, amount: this.price, prefill: {
              name: this.screeningDetails1.candidate.firstName,
              email: this.screeningDetails1.candidate.email, contact: this.screeningDetails1.candidate.phoneNo
            }
          };
        }
      })
    })
  }
  previewInvoice() {
    this.verification.getOrganizationLogo(this.screeningDetails1.screening.clientId).subscribe(resp => {
      if (resp) {
        this.invoice.getPaymentInvoice(this.caseSubmissionList, this.price);
        this.verification.fileLogo = resp;
        this.dialog.open(this.viewInvoice,
          { width: '1200px', disableClose: true, autoFocus: false });
      }
    });
  }
  saveSubmission() {
    // if (this.applicationId !== 3) {
    this.stepperFlag = true;
    if (this.fileSubmission.get('candidate')?.valid) {
      if (this.fileSubmission.get('screening')?.valid) {
        this.saveScreeningFileSubmission();
      } else {
        this.fileSubmission.get('screening')?.markAllAsTouched();
      }
    } else {
      this.fileSubmission.get('candidate')?.markAllAsTouched();
    }
    //}
  }
  savecase() {
    //Paymentflagcheck
    if (this.applicationId == 3 && this.userData.paymentFlag === true) {
      this.saveAndPaycase()
    }
    //--End--
    if (this.applicationId !== 3) {
      if (this.fileSubmission.get('candidate')?.valid) {
        if (this.fileSubmission.get('screening')?.valid) {
          this.saveScreeningFileSubmission();
        } else {
          this.fileSubmission.get('screening')?.markAllAsTouched();
        }
      } else {
        this.fileSubmission.get('candidate')?.markAllAsTouched();
      }
    } else if (this.applicationId === 3) {
      if (this.fileSubmission.valid && this.fileSubmission.get('gapReason')?.valid &&
        ((this.fileSubmission.get('candidate.consentLookupName')?.value === 'EConsent' &&
          this.fileSubmission.get('candidate.iagreeFlag')?.value === true && this.fileSubmission.get('candidate.consentSignature')?.value !== "") ||
          (this.fileSubmission.get('candidate.consentLookupName')?.value === 'Physical Consent' &&
            this.fileSubmission.get('document')?.value.length > 0))) {

        this.openconfirmationDialog('Thank you for submitting the online application for background verification!,Please review all the details entered by you, this cannot be undone. If you want to edit please click <strong> No </strong> and use the menu available in the right pane. If you want to submit please click <strong>Yes, Continue</strong>',
          this.getPaymentFlag());
      } else {
        let checkFlag: boolean;
        if (this.fileSubmission.get('candidate')?.valid) {
          let compLength = 0;
          let count = 0;
          this.checkList = [];
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < this.fileSubmission.value.screeningComponent.length; i++) {
            if (this.fileSubmission.value.screeningComponent[i].compId > 0 ||
              (this.fileSubmission.value.screeningComponent[i].compId === 0 &&
                this.fileSubmission.get('gapReason')?.valid)) {
              const rawvalues = this.fileSubmission.getRawValue();
              const compCount = rawvalues.screeningComponent[i].component.filter(x => x.active === true).length;
              compLength = compLength + compCount;
              count = count + this.fileSubmission.value.screeningComponent[i].component.length;
              this.validationExp(this.fileSubmission.value.screeningComponent[i].compId, i);
            }
          }

          const falseList = this.checkList.filter(x => x === false);
          if (falseList.length > 0) {
            checkFlag = false;
          } else {
            checkFlag = true;
          }
          if (compLength > 0 && (compLength !== count) && checkFlag === true ||
            ((compLength === count && (this.fileSubmission.get('candidate.consentLookupName')?.value === 'EConsent' &&
              this.fileSubmission.get('candidate.iagreeFlag')?.value && !!(this.fileSubmission.get('candidate.consentSignature')?.value)) ||
              this.fileSubmission.get('candidate.consentLookupName')?.value === 'Physical Consent' &&
              this.fileSubmission.get('document')?.value.length > 0))) {
            if (this.screeningService.gapReason.length > 0) {
              const educationIndex = this.screeningService.componentList.findIndex(f => f.compName.toUpperCase() === this.common.EDUCATION);
              const empHRIndex = this.screeningService.componentList.findIndex(f => f.compName.toUpperCase() === this.common.EMPLOYMENT_HR);
              const screeningcomp = this.fileSubmission.get('screeningComponent') as UntypedFormArray;
              if (educationIndex > -1 && empHRIndex > -1) {
                if (screeningcomp.controls[educationIndex].valid && screeningcomp.controls[empHRIndex].valid) {
                  this.fileSubmission.get('gapReason')?.markAllAsTouched();
                  if (this.fileSubmission.get('gapReason')?.invalid) {
                    const Educationdate = this.getGapinEduEmp(this.common.EDUCATION, 'courseStart', 'courseCompletion');
                    const Employmentdate = this.getGapinEduEmp(this.common.EMPLOYMENT_HR, 'fromDate', 'toDate');
                    // this.showNotification('warn', 'Failed to save', 'Please fill the reason for ' + Educationdate + 'period of gap.');
                    const alertdata = 'Please fill the reason for <b>' + Educationdate + '</br> ' + Employmentdate + '</b> period of gap.';
                    this.opengapAlertDialog(alertdata);
                    return false;
                  }
                }
              } else if (educationIndex > -1) {
                if (screeningcomp.controls[educationIndex].valid) {
                  if (this.fileSubmission.get('gapReason')?.invalid) {
                    const Educationdate = this.getGapinEduEmp(this.common.EDUCATION, 'courseStart', 'courseCompletion');
                    const alertdata = 'Please fill the reason for <b>' + Educationdate + '</b> period of gap.';
                    this.opengapAlertDialog(alertdata);
                    // this.showNotification('warn', 'Failed to save', 'Please fill the gap reason if any.');
                    return false;
                  }
                }
              } else if (empHRIndex > -1) {
                if (screeningcomp.controls[empHRIndex].valid) {
                  if (this.fileSubmission.get('gapReason')?.invalid) {
                    const Employmentdate = this.getGapinEduEmp(this.common.EMPLOYMENT_HR, 'fromDate', 'toDate');
                    const alertdata = 'Please fill the reason for <b>' + Employmentdate + '</b> period of gap.';
                    this.opengapAlertDialog(alertdata);
                    // this.showNotification('warn', 'Failed to save', 'Please fill the gap reason if any.');
                    return false;
                  }
                }
              }
            }
            const referenceComp = this.screeningService.componentList.find(s => s.compName === this.common.REFERENCE_CHECK);
            if (referenceComp) {
              const scrcompvalue = this.fileSubmission.get('screeningComponent')?.value;
              const referencecheckcompindex = scrcompvalue.findIndex(fi => fi.compId === referenceComp.compId);
              const refcompvalue = scrcompvalue.find(fi => fi.compId === referenceComp.compId);
              if (refcompvalue) {
                const validdata = refcompvalue.component.filter(f => f.active === true);
                const screeningComp = this.fileSubmission.get('screeningComponent') as UntypedFormArray;
                const validScreeningComp = screeningComp.controls.filter((fc, fi) => {
                  if (fi !== referencecheckcompindex && fc.valid) {
                    return true;
                  } else {
                    return false;
                  }
                });
                const rondupIndex = this.screeningService.gapReason.length > 0 ? 2 : 1;
                if (screeningComp.controls.length === (validScreeningComp.length + 1)) {
                  if (validdata.length >= 3 && this.popHide === true) {
                    this.saveScreeningFileSubmission();
                  } else {
                    this.showNotification('warn', 'Failed to save', 'At least three reference check should be enter data.');
                    return false;
                  }
                  // this.openconfirmationDialog('At leaset three reference check should be enter data.');
                } else {
                  this.saveScreeningFileSubmission();
                }
              }
            } else {
              this.saveScreeningFileSubmission();
            }
          } else {

            if (this.fileSubmission.get('gapReason')?.valid) {
              if (this.fileSubmission.get('screeningComponent')?.valid && checkFlag === true) {
                this.step1 = this.stepHiddenFlag ? 2 : 1;
                this.stepperChange(this.step1);
                this.showNotification('warn', 'Failed to save', this.fileSubmission.get('candidate.consentLookupName')?.value === 'EConsent' ?
                  'Please accept authorization to process further.' :
                  'Upload atleast one LOA document.');
                return false;
              }
            } else if (this.screeningService.gapReason.length > 0) {
              const educationIndex = this.screeningService.componentList.findIndex(f => f.compName.toUpperCase() === this.common.EDUCATION);
              const empHRIndex = this.screeningService.componentList.findIndex(f => f.compName.toUpperCase() === this.common.EMPLOYMENT_HR);
              const screeningcomp = this.fileSubmission.get('screeningComponent') as UntypedFormArray;
              if (educationIndex > -1 && empHRIndex > -1) {
                if (screeningcomp.controls[educationIndex].valid && screeningcomp.controls[empHRIndex].valid) {
                  this.fileSubmission.get('gapReason')?.markAllAsTouched();
                  if (this.fileSubmission.get('gapReason')?.invalid) {
                    const Educationdate = this.getGapinEduEmp(this.common.EDUCATION, 'courseStart', 'courseCompletion');
                    const Employmentdate = this.getGapinEduEmp(this.common.EMPLOYMENT_HR, 'fromDate', 'toDate');
                    // this.showNotification('warn', 'Failed to save', 'Please fill the reason for ' + Educationdate + 'period of gap.');
                    const alertdata = 'Please fill the reason for <b>' + Educationdate + '</br> ' + Employmentdate + '</b> period of gap.';
                    this.opengapAlertDialog(alertdata);
                    return false;
                  }
                }
              } else if (educationIndex > -1) {
                if (screeningcomp.controls[educationIndex].valid) {
                  if (this.fileSubmission.get('gapReason')?.invalid) {
                    const Educationdate = this.getGapinEduEmp(this.common.EDUCATION, 'courseStart', 'courseCompletion');
                    const alertdata = 'Please fill the reason for <b>' + Educationdate + '</b> period of gap.';
                    this.opengapAlertDialog(alertdata);
                    // this.showNotification('warn', 'Failed to save', 'Please fill the gap reason if any.');
                    return false;
                  }
                }
              } else if (empHRIndex > -1) {
                if (screeningcomp.controls[empHRIndex].valid) {
                  if (this.fileSubmission.get('gapReason')?.invalid) {
                    const Employmentdate = this.getGapinEduEmp(this.common.EMPLOYMENT_HR, 'fromDate', 'toDate');
                    const alertdata = 'Please fill the reason for <b>' + Employmentdate + '</b> period of gap.';
                    this.opengapAlertDialog(alertdata);
                    // this.showNotification('warn', 'Failed to save', 'Please fill the gap reason if any.');
                    return false;
                  }
                }
              } else if (this.fileSubmission.get('screeningComponent')?.valid && checkFlag === true) {
                this.step1 = this.stepHiddenFlag ? 2 : 1;
                this.stepperChange(this.step1);
                this.showNotification('warn', 'Failed to save', this.fileSubmission.get('candidate.consentLookupName')?.value === 'EConsent' ?
                  'Please accept authorization to process further.' :
                  'Upload atleast one LOA document.');
                return false;
              } else if (this.fileSubmission.get('gapReason')?.value?.length > 0) {
                if (this.fileSubmission.get('gapReason')?.invalid) {
                  return false;
                }
                if (!this.fileSubmission.get('screeningComponent')?.valid && this.fileSubmission.get('candidate')?.valid && this.btnlabel == 'Save & Exit') {

                  this.saveScreeningFileSubmission();
                }
              }
            } else {
              this.fileSubmission.markAllAsTouched();
            }
          }
        } else {
          this.fileSubmission.markAllAsTouched();
          return false;
        }
      }
    }
  }
  validationExp(compId, i) {
    let checkFlag: boolean;
    const compList = this.screeningService.caseSubmissionList && this.screeningService.caseSubmissionList.screeningCaseComponent.length > 0 ?
      this.screeningService.caseSubmissionList.screeningCaseComponent.filter(x => x.compId === compId && x.daCompValidYear > 0 &&
        x.screeningSubComponent.length === 0) : [];
    let dayList: any[] = [];
    const count1 = this.fileSubmission.value.screeningComponent[i].component.filter(x => x.active === true).length;
    const count2 = this.fileSubmission.value.screeningComponent[i].component.filter(x => x.active !== true).length;
    if (compList.length > 0) {
      let totCount = compList.map(x => x.daCompValidYear).reduce((a, b) => a + b, 0);
      this.fileSubmission['controls']['screeningComponent']['controls'][i]["controls"]["component"]["controls"].forEach((element, j) => {
        if (compList[0].compId === compId && element['controls']['active'].value === true) {
          if (element['controls']['compRef'] && element['controls']['compRef']['controls']) {
            if ((element['controls']['compRef']['controls']['periodOfStayFrom'] ? element['controls']['compRef']['controls']['periodOfStayFrom'].value :
              (element['controls']['compRef']['controls']['periodOfStay'] ? element['controls']['compRef']['controls']['periodOfStay'].value :
                (element['controls']['compRef']['controls']['fromDate'] ? element['controls']['compRef']['controls']['fromDate'].value : '')))) {

              const days = this.common.getDateCaluculationDiff(element['controls']['compRef']['controls']['periodOfStayFrom'] ?
                element['controls']['compRef']['controls']['periodOfStayFrom'].value : element['controls']['compRef']['controls']['periodOfStay'] ?
                  element['controls']['compRef']['controls']['periodOfStay'].value : element['controls']['compRef']['controls']['fromDate'].value,
                element['controls']['compRef']['controls']['periodOfStayTo'] ?
                  element['controls']['compRef']['controls']['periodOfStayTo'].value : element['controls']['compRef']['controls']['toDate'].value, this.fileSubmission.value.candidate.dob);
              dayList.push(days);
              if (days.includes('Years') || days.includes('year')) {
                const str = days.split(' ')[0];
                const year = str.replace(/\D/g, '');
                if (this.fileSubmission.value.screeningComponent[i].component.length === 1) {
                  if (totCount <= Number(year)) {
                    checkFlag = true;
                    this.checkList.push(checkFlag);
                  } else {
                    checkFlag = false;
                    this.checkList.push(checkFlag);
                    return this.showNotification('warn', 'Alert', 'Overall Experience is' + ' ' + totCount + ' ,' +
                      'kindly add remaining experience' + ' ' + compList[0].compName);
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
      } else if ((count1 >= 1 && dayList.length === count1 && count2 === 0)) {
        if (dayList.length > 0) {
          const dList = dayList.filter(x => x.includes('Years') || x.includes('year'));
          const numList: any[] = [];
          if (dList.length > 0) {
            dList.forEach(ele => {
              const str = ele.split(' ')[0];
              const year = str.replace(/\D/g, '');
              numList.push(year !== 'N/A' ? Number(year) : '');
            });
            const finalCount = numList.reduce((a, b) => a + b, 0);
            const remaingcount = totCount - finalCount;
            if (totCount <= finalCount) {
              this.checkList.push(checkFlag);
            } else {
              checkFlag = false;
              this.checkList.push(checkFlag);
              return this.showNotification('warn', 'Alert', 'Overall Experience is' + ' ' + totCount + ' ,' +
                'kindly add remaining experience' + ' ' + remaingcount + ' ' + compList[0].compName);
            }
          } else {
            checkFlag = false;
            this.checkList.push(checkFlag);
            return this.showNotification('warn', 'Alert', 'Overall Experience is' + ' ' + totCount + ' ,' +
              'kindly add remaining experience' + ' ' + compList[0].compName);
          }
        }
      } else {
        this.checkList.push(true);
      }

    } else {
      let subCompList: any[] = [];
      let copysubCompList: any[] = [];
      let aacount = 0;
      if (this.screeningService.caseSubmissionList && this.screeningService.caseSubmissionList.screeningCaseComponent.length > 0) {
        copysubCompList = this.screeningService.caseSubmissionList.screeningCaseComponent;
        copysubCompList.forEach(element => {
          const subComp = element.screeningSubComponent.filter(x => x.compId === compId && x.daCompValidYear > 0);
          if (subComp.length > 0) {
            subComp.forEach((el, i) => {
              subCompList.push(subComp[i]);
            });
          }

          const aList = element.screeningSubComponent.filter(x => (x.subCompDesc === this.common.ADDRESS && x.subCompName === 'Current Address') ||
            (element.compName === this.common.ADDRESS_GEO && x.subCompName === 'Current Address') ||
            (x.subCompDesc === this.common.PAN_INDIA_ONLINE_COURT_RECORD_VERIFICATION && x.subCompName === 'Current Address') && x.daCompValidYear > 0);
          if (aList.length > 0) {
            aacount = aacount + aList[0].daCompValidYear;
          }
        });
      }
      let subIdList: any[] = [];

      if (subCompList.length > 0) {
        // const yrList = subCompList.filter(m => m.subCompName === 'Previous Address' && m.daCompValidYear > 0);
        // if (yrList.length > 1) {
        //   const pcount = yrList.map(x => x.daCompValidYear).reduce((a, b) => a + b, 0);
        //   subCompList.forEach(el => {
        //     if (el.subCompName === 'Previous Address' && pcount > 0) {
        //       el.daCompValidYear = pcount;
        //     }
        //   });
        //   subCompList.filter((el, i, a) => i === a.indexOf(el))
        // }
        this.fileSubmission['controls']['screeningComponent']['controls'][i]["controls"]["component"]["controls"].forEach((element, j) => {
          subIdList = subCompList.filter(x => x.subCompId === element['controls']['screeningComponentInfo']['controls']['subCompId'].value);
          if (element['controls']['active'].value === true && subIdList.length > 0) {
            if (element['controls']['compRef'] && element['controls']['compRef']['controls']) {
              if (element['controls']['compRef']['controls']['periodOfStayFrom'] ? element['controls']['compRef']['controls']['periodOfStayFrom'].value :
                (element['controls']['compRef']['controls']['periodOfStay'] ? element['controls']['compRef']['controls']['periodOfStay'].value : '') &&
                  element['controls']['compRef']['controls']['periodOfStayTo'] ? element['controls']['compRef']['controls']['periodOfStayTo'].value : '') {
                this.fileSubmission['controls']['screeningComponent']['controls'][i]["controls"]["component"]["controls"][0]["controls"]["screeningComponentInfo"]["controls"]["subCompId"].value

                const days = this.common.getDateCaluculationDiff(element['controls']['compRef']['controls']['periodOfStayFrom'] ?
                  element['controls']['compRef']['controls']['periodOfStayFrom'].value :
                  element['controls']['compRef']['controls']['periodOfStay'].value,
                  element['controls']['compRef']['controls']['periodOfStayTo'].value, this.fileSubmission.value.candidate.dob);
                // dayList.push(days);
                dayList.push(
                  { days: days, id: subIdList[0].subCompId, name: subIdList[0].subCompName, year: subIdList[0].daCompValidYear, cname: subIdList[0].subCompDesc },
                );
                if (subIdList[0].subCompName === 'Current Address') {
                  if (days.includes('Years') || days.includes('year')) {
                    const str = days.split(' ')[0];
                    const year = str.replace(/\D/g, '');
                    if (aacount > 0 && aacount <= Number(year)) {
                      checkFlag = true;
                      this.checkList.push(checkFlag);
                    } else {
                      checkFlag = false;
                      this.checkList.push(checkFlag);
                      return this.showNotification('warn', 'Alert', 'Overall Experience is' + ' ' + subIdList[0].subCompName === 'Current Address' && aacount > 0 ? aacount : subIdList[0].daCompValidYear + ' ,' +
                        'kindly add remaining experience' + ' ' + subIdList[0].subCompDesc + ' - ' + subIdList[0].subCompName);
                    }
                  } else {
                    checkFlag = false;
                    this.checkList.push(checkFlag);
                    return this.showNotification('warn', 'Alert', 'Overall Experience is' + ' ' + subIdList[0].daCompValidYear + ' ,' +
                      'kindly add remaining experience' + ' ' + subIdList[0].subCompDesc + ' - ' + subIdList[0].subCompName);
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
          const count1 = this.fileSubmission.value.screeningComponent[i].component.filter(x => x.active === true && x.screeningComponentInfo.subCompId === subIdList[0].subCompId).length;
          const count2 = this.fileSubmission.value.screeningComponent[i].component.filter(x => x.active !== true && x.screeningComponentInfo.subCompId === subIdList[0].subCompId).length;

          if (count1 >= 1 && count2 > 0) {
            this.checkList.push(true);
          } else if ((count1 >= 1 && subIdList.length > 0)) {
            let prList: any[] = [];
            dayList.forEach(ee => {
              let peList: any[] = [];
              if (ee.name === 'Previous Address') {
                prList = this.fileSubmission.value.screeningComponent[i].component.filter(x => x.active === true && x.screeningComponentInfo.subCompId === ee.id);
              }
              if (ee.name === 'Permanent Address') {
                peList = this.fileSubmission.value.screeningComponent[i].component.filter(x => x.active === true && x.screeningComponentInfo.subCompId === ee.id);
              }
              if ((peList.length > 0 && peList.length === 1)) {
                if (ee.days.includes('Years') || ee.days.includes('year')) {
                  const str = ee.days.split(' ')[0];
                  const year = str.replace(/\D/g, '');
                  if (ee.year <= Number(year)) {
                    checkFlag = true;
                    this.checkList.push(checkFlag);
                  } else {
                    checkFlag = false;
                    this.checkList.push(checkFlag);
                    return this.showNotification('warn', 'Alert', 'Overall Experience is' + ' ' + ee.year + ' ,' +
                      'kindly add remaining experience' + ' ' + ee.cname + ' - ' + ee.name);
                  }
                } else {
                  checkFlag = false;
                  this.checkList.push(checkFlag);
                  return this.showNotification('warn', 'Alert', 'Overall Experience is' + ' ' + ee.year + ' ,' +
                    'kindly add remaining experience' + ' ' + ee.cname + ' - ' + ee.name);
                }
              }
            });
            let arrcount = 0;
            const preList = dayList.filter(x => x.name === 'Previous Address');
            if (preList.length > 0) {
              arrcount = this.fileSubmission.value.screeningComponent[i].component.filter(x => x.screeningComponentInfo.subCompId === preList[0].id).length;
            }
            if (prList.length > 0 && prList.length === arrcount) {
              const multiList = dayList.filter(x => x.id === prList[0].screeningComponentInfo.subCompId);
              const dList = multiList.filter(x => x.days.includes('Years') || x.days.includes('year'));
              const numList: any[] = [];
              if (dList.length > 0) {
                dList.forEach(ele => {
                  const str = ele.days.split(' ')[0];
                  const year = str.replace(/\D/g, '');
                  numList.push(year !== 'N/A' ? Number(year) : '');
                });
                const finalCount = numList.reduce((a, b) => a + b, 0);
                const remaingcount = subIdList[0].daCompValidYear - finalCount;
                if (dList[0].year <= finalCount) {
                  this.checkList.push(checkFlag);
                } else {
                  checkFlag = false;
                  this.checkList.push(checkFlag);
                  return this.showNotification('warn', 'Alert', 'Overall Experience is' + ' ' + dList[0].year + ' ,' +
                    'kindly add remaining experience' + ' ' + remaingcount + ' ' + dList[0].cname + ' - ' + dList[0].name);
                }
              } else {
                checkFlag = false;
                this.checkList.push(checkFlag);
                return this.showNotification('warn', 'Alert', 'Overall Experience is' + ' ' + multiList[0].year + ' ,' +
                  'kindly add remaining experience' + ' ' + ' ' + multiList[0].cnane + ' - ' + multiList[0].name);
              }
            } else {
              this.checkList.push(true);
            }
          }
        }
      }
    }
  }
  getGapinEducation() {
    let count = 0;
    const formArrayRawValue = this.fileSubmission.get('screeningComponent')?.value;
    const educationId = this.screeningService.componentList.find(f => f.compName === this.common.EDUCATION);
    const education = formArrayRawValue.find(f1 => f1.compId === educationId.compId);
    let i = education ? education.component.length - 1 : 0;
    // const gapReasonTypeData = this.fileSubmission.get('gapReasonType')?.value.find(f2 => f2.typeName === 'Gap between Education to Education');
    const educationgapyears: any[] = [];
    if (education) {
      while (i > -1) {
        const preIndex = (i - 1) > 0 ? (i - 1) : 0;
        const oneday = 24 * 60 * 60 * 1000;
        if (i !== preIndex) {
          const startDate = this.common.convertDate(education.component[i].compRef.courseCompletion);
          const endDate = this.common.convertDate(education.component[preIndex].compRef.courseStart);
          if (startDate !== 'Invalid Date' && endDate !== 'Invalid Date') {
            const absstartdate: any = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
            const absenddate: any = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
            const diffdays = Math.round(Math.abs((absstartdate - absenddate) / oneday));
            if (diffdays > 90) {
              count++;
              educationgapyears.push({
                gapStart: education.component[preIndex].compRef.courseStart,
                gapEnd: education.component[i].compRef.courseCompletion
              });
            }
          }
        }
        i--;
      }
    }
    return educationgapyears;
  }
  getGapinEduEmp(tyep, start, end) {
    let count = 0;
    const formArrayRawValue = this.fileSubmission.get('screeningComponent')?.value;
    const compId = this.screeningService.componentList.find(f => f.compName.toLowerCase() === tyep.toLowerCase());

    const compData = formArrayRawValue.find(f1 => f1.compId === compId.compId);
    let i = compData ? compData.component.length - 1 : 0;
    const educationgapyears: any[] = [];
    let data = '';
    if (compData) {
      while (i > -1) {
        const preIndex = (i - 1) > 0 ? (i - 1) : 0;
        const oneday = 24 * 60 * 60 * 1000;
        if (i !== preIndex) {
          let startDate: any;
          let endDate: any;
          if (compData.component[i] && compData.component[i].compRef && compData.component[preIndex].compRef) {
            startDate = this.common.convertDate(compData.component[i].compRef[end]);
            endDate = this.common.convertDate(compData.component[preIndex].compRef[start]);
          }
          if (startDate !== 'Invalid Date' && startDate !== undefined && startDate !== '' && endDate !== 'Invalid Date' && endDate !== undefined && endDate !== '') {
            const absstartdate: any = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
            const absenddate: any = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
            const diffdays = Math.round(Math.abs((absstartdate - absenddate) / oneday));
            if (diffdays > 90) {
              count++;
              educationgapyears.push({
                gapStart: compData.component[i].compRef[end],
                gapEnd: compData.component[preIndex].compRef[start]
              });
            }
          }
        }
        i--;
      }
    }
    if (educationgapyears.length > 0) {
      educationgapyears.forEach(f => {
        data = (data !== '' ? ', ' : '') + data + f.gapStart + '-' + f.gapEnd;
      });
    }
    return data;
  }
  public openconfirmationDialog(bodyText, flag) {
    const popupData = {
      action: this.common.DELETECONFIRMATION,
      headerText: 'Alert',
      bodyText: flag ? 'Do you want to submit the application?\n Once you submit, you will be navigate to Payment process.' : bodyText
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
            this.fileSubmission.get('completeFlag')?.setValue(true);
            this.saveScreeningFileSubmission();
          }
        }
      });
    }
  }
  saveScreeningFileSubmission() {

    this.screeningDetails = this.fileSubmission.getRawValue();
    this.screeningComponent = this.fileSubmission.get('screeningComponent')?.value;
    this.screeningDetails.document = this.screeningDocument;
    //     let GpFlag = false
    //    if(this.fileSubmission.get('screeningComponent')?.valid&&this.screeningDetails.gapReason!=null){

    //    const cnt =  this.screeningDetails.gapReason.filter(f => f.reasonFlag !== null).length;
    // if(cnt>0){
    //   GpFlag = false;
    // }
    // else{
    //   GpFlag = true;
    // }

    //    }else{
    //     GpFlag = true
    //    }
    if (this.screeningService.compName) {
      this.screeningDetails.gapReason = this.screeningDetails.gapReason.filter(f => f.reasonFlag !== null);
      if (this.userData.applicationId === 3 && this.fileSubmission.get('screeningComponent')?.valid || this.screeningService.compName.toLowerCase() === 'gap reason') {
        if (this.screeningDetails.gapReason.length > 0) {
          if (this.screeningService.gapReason.length > 0) {
            const educationIndex = this.screeningService.componentList.findIndex(f => f.compName.toUpperCase() === this.common.EDUCATION);
            const empHRIndex = this.screeningService.componentList.findIndex(f => f.compName.toUpperCase() === this.common.EMPLOYMENT_HR);
            const screeningcomp = this.fileSubmission.get('screeningComponent') as UntypedFormArray;
            if (educationIndex > -1 && empHRIndex > -1) {
              if (screeningcomp.controls[educationIndex].valid && screeningcomp.controls[empHRIndex].valid) {
                this.fileSubmission.get('gapReason')?.markAllAsTouched();
                if (this.fileSubmission.get('gapReason')?.invalid) {
                  const Educationdate = this.getGapinEduEmp(this.common.EDUCATION, 'courseStart', 'courseCompletion');
                  const Employmentdate = this.getGapinEduEmp(this.common.EMPLOYMENT_HR, 'fromDate', 'toDate');
                  // this.showNotification('warn', 'Failed to save', 'Please fill the reason for ' + Educationdate + 'period of gap.');
                  const alertdata = 'Please fill the reason for <b>' + Educationdate + '</br> ' + Employmentdate + '</b> period of gap.';
                  this.opengapAlertDialog(alertdata);
                  return false;
                }
              }
            } else if (educationIndex > -1) {
              if (screeningcomp.controls[educationIndex].valid) {
                if (this.fileSubmission.get('gapReason')?.invalid) {
                  const Educationdate = this.getGapinEduEmp(this.common.EDUCATION, 'courseStart', 'courseCompletion');
                  const alertdata = 'Please fill the reason for <b>' + Educationdate + '</b> period of gap.';
                  this.opengapAlertDialog(alertdata);
                  // this.showNotification('warn', 'Failed to save', 'Please fill the gap reason if any.');
                  return false;
                }
              }
            } else if (empHRIndex > -1) {
              if (screeningcomp.controls[empHRIndex].valid) {
                if (this.fileSubmission.get('gapReason')?.invalid) {
                  const Employmentdate = this.getGapinEduEmp(this.common.EMPLOYMENT_HR, 'fromDate', 'toDate');
                  const alertdata = 'Please fill the reason for <b>' + Employmentdate + '</b> period of gap.';
                  this.opengapAlertDialog(alertdata);
                  // this.showNotification('warn', 'Failed to save', 'Please fill the gap reason if any.');
                  return false;
                }
              }
            }
          }

        } else if (this.fileSubmission.get('gapReason')?.value?.length > 0) {
          if (this.fileSubmission.get('gapReason')?.invalid) {
            return false;
          }
        }
      }
    }

    if (this.fileSubmission.get('screeningComponent')?.valid) {
      this.screeningDetails.screening.flag = true;
      this.btnlabel = 'Save & Submit';
    } else {
      this.screeningDetails.screening.flag = false;
    }
    if (this.userData.applicationId === 3) {
      this.screeningService.componentList.forEach((element, index) => {
        if (element.subCompFlag) {
          const subcomp = element.screeningSubComponent.find(f => f.subCompName === 'Current Address');
          if (subcomp) {
            const compIndex = this.screeningDetails.screeningComponent.findIndex(i => i.compId === subcomp.compId);
            const subCombIndex = this.screeningDetails.screeningComponent[compIndex].component
              .findIndex(fi => fi.screeningComponentInfo.subCompId === subcomp.subCompId);

            this.screeningDetails.screeningComponent[compIndex].component[subCombIndex].compRef.address = this.screeningDetails.candidate.address;
            this.screeningDetails.screeningComponent[compIndex].component[subCombIndex].active = true;
          }
        }
      });
    }
    this.screeningDetails.gapReason = this.screeningDetails.gapReason.filter(f => f.reasonFlag !== null);
    this.screeningDetails.screeningComponent = this.screeningDetails.screeningComponent.filter(p =>
      p.component = p.compId > 0 && p.component !== undefined ? p.component.
        filter(s => {
          if (s.active === true || s.screeningComponentInfo.notApplicableFlag) {
            if (s.submittedFlag && !s.screeningComponentInfo.deqcFlag) {
              if (this.screeningService.caseFlagType === this.common.VEREJECT || this.screeningService.caseFlagType === this.common.FRREJECT || this.screeningService.
                caseFlagType === this.common.QCREJECT || this.screeningService.caseFlagType === this.common.REOPEN) {
                return true;
              } else {
                return this.userData.applicationId !== 3 ? false : true;
              }
            }
            if (s.screeningComponentInfo.notApplicableFlag) {
              // s.compRef = null;
              // s.compRefDetail = null;
              // s.screeningInsufficiency = null;
              return true;
            } else {
              if (this.screeningService.caseFlag) {
                if (this.applicationId === 3) {
                  return true;
                } else {
                  return s.submittedFlag === false && s.preQCApproveFlag === false ? true : false;
                }
              } else if (this.screeningService.caseFlagType === this.common.NEWCASE) {
                return true;
              } else {
                // return true;
                if (this.applicationId === 3) {
                  return true;
                } else {
                  return s.submittedFlag;
                }
              }
            }
          }
        }) : []).filter(f => f.component.length > 0);
    this.commonSave(true);

  }

  saveScreeningComp(event: any) {
    if (event) {
      if (this.screeningService.caseFlagType === this.common.QCREJECT) {
        this.fileSubmission.get('qcRejectFlag')?.setValue(true);
        this.fileSubmission.get('verificationRejectFlag')?.setValue(false);
        this.fileSubmission.get('forResearchRejectFlag')?.setValue(false);
        // this.rejectedCompQcApproval();
      } else if (this.screeningService.caseFlagType === this.common.VEREJECT) {
        this.fileSubmission.get('qcRejectFlag')?.setValue(false);
        this.fileSubmission.get('verificationRejectFlag')?.setValue(true);
        this.fileSubmission.get('forResearchRejectFlag')?.setValue(false);
      } else if (this.screeningService.caseFlagType === this.common.FRREJECT) {
        this.fileSubmission.get('qcRejectFlag')?.setValue(false);
        this.fileSubmission.get('verificationRejectFlag')?.setValue(false);
        this.fileSubmission.get('forResearchRejectFlag')?.setValue(true);
      } else {
        this.fileSubmission.get('qcRejectFlag')?.setValue(false);
        this.fileSubmission.get('verificationRejectFlag')?.setValue(false);
        this.fileSubmission.get('forResearchRejectFlag')?.setValue(false);
      }
      this.screeningDetails = this.fileSubmission.getRawValue();

      this.screeningComponent = this.fileSubmission.get('screeningComponent')?.value;
      this.screeningDetails.screeningComponent = this.screeningDetails.screeningComponent.
        filter(f => f.compId === event.formValue.screeningComponentInfo.compId);
      this.screeningDetails.document = this.screeningDocument;
      const empFresherFlag = event.compName.toLowerCase() === this.common.EMPLOYMENT_HR.toLowerCase() && event.formValue.compRef.
        fresherFlag === true && this.screeningDetails.screeningComponent[0].component.length > 1 && ((event.formValue.screeningComponentInfo.
          screeningCompId === 0 && this.userData.applicationId !== 3) || this.userData.applicationId === 3);
      if (empFresherFlag === true) {
        this.screeningDetails.screeningComponent[0].component= [];
        this.screeningDetails.screeningComponent[0].component.push(event.formValue);
        const cancelCompList = this.fileSubmission.getRawValue().screeningComponent.find(f => f.compId === event.formValue.screeningComponentInfo.compId)
          .component.filter(a => !(a.compRef && a.compRef.fresherFlag === true));
        // const cancelCompList = this.screeningComponent.find(f => f.compId === event.formValue.screeningComponentInfo.compId)
        // .component.filter(a => !(a.compRef && a.compRef.fresherFlag === true));
        // cancelCompList.map(m => m.screeningComponentInfo.notApplicableFlag = true);
        this.screeningDetails.screeningComponent[0].component.push(...cancelCompList);
      } else {
        this.screeningDetails.screeningComponent[0].component= [];
        this.screeningDetails.screeningComponent[0].component.push(event.formValue);
      }
      this.componentName = event.compName;
      if (this.screeningService.compName) {
        if (this.componentName == "GAP REASON") {
          if (this.userData.applicationId === 3 && this.fileSubmission.get('screeningComponent')?.valid || this.screeningService.compName.toLowerCase() === 'gap reason') {

            if (this.screeningDetails.gapReason.length > 0) {
              if (this.screeningService.gapReason.length > 0) {
                const gformarray = this.fileSubmission.get('gapReason') as UntypedFormArray;
                if (gformarray.invalid) {
                  const alertdata = 'Please fill the Gap Reason.';
                  this.opengapAlertDialog(alertdata);
                  return false;
                }
                const educationIndex = this.screeningService.componentList.findIndex(f => f.compName.toUpperCase() === this.common.EDUCATION);
                const empHRIndex = this.screeningService.componentList.findIndex(f => f.compName.toUpperCase() === this.common.EMPLOYMENT_HR);
                const screeningcomp = this.fileSubmission.get('screeningComponent') as UntypedFormArray;
                if (educationIndex > -1 && empHRIndex > -1) {
                  if (screeningcomp.controls[educationIndex].valid && screeningcomp.controls[empHRIndex].valid) {
                    this.fileSubmission.get('gapReason')?.markAllAsTouched();
                    if (this.fileSubmission.get('gapReason')?.invalid) {
                      const Educationdate = this.getGapinEduEmp(this.common.EDUCATION, 'courseStart', 'courseCompletion');
                      const Employmentdate = this.getGapinEduEmp(this.common.EMPLOYMENT_HR, 'fromDate', 'toDate');
                      // this.showNotification('warn', 'Failed to save', 'Please fill the reason for ' + Educationdate + 'period of gap.');
                      const alertdata = 'Please fill the reason for <b>' + Educationdate + '</br> ' + Employmentdate + '</b> period of gap.';
                      this.opengapAlertDialog(alertdata);
                      return false;
                    }
                  }
                } else if (educationIndex > -1) {
                  if (screeningcomp.controls[educationIndex].valid) {
                    if (this.fileSubmission.get('gapReason')?.invalid) {
                      const Educationdate = this.getGapinEduEmp(this.common.EDUCATION, 'courseStart', 'courseCompletion');
                      const alertdata = 'Please fill the reason for <b>' + Educationdate + '</b> period of gap.';
                      this.opengapAlertDialog(alertdata);
                      // this.showNotification('warn', 'Failed to save', 'Please fill the gap reason if any.');
                      return false;
                    }
                  }
                } else if (empHRIndex > -1) {
                  if (screeningcomp.controls[empHRIndex].valid) {
                    if (this.fileSubmission.get('gapReason')?.invalid) {
                      const Employmentdate = this.getGapinEduEmp(this.common.EMPLOYMENT_HR, 'fromDate', 'toDate');
                      const alertdata = 'Please fill the reason for <b>' + Employmentdate + '</b> period of gap.';
                      this.opengapAlertDialog(alertdata);
                      // this.showNotification('warn', 'Failed to save', 'Please fill the gap reason if any.');
                      return false;
                    }
                  }
                }
              }
            }
            else if (this.fileSubmission.get('gapReason')?.value?.length > 0) {
              if (this.fileSubmission.get('gapReason')?.invalid) {
                return false;
              }
            }
          }
        }
      }
      this.commonSave(false);

    }
  }
  commonSave(isMultiCompSubmit: any) {
    this.common.currentDateTime = this.datePipe.transform((new Date), 'dd/MM/yyyy h:mm a');
    const htmlstring = document.querySelectorAll('.loaclass');
    let inSuffCount = 0;
    let documentUploadCount = 0;
    if (this.screeningService.caseFlagType === this.common.NEWCASE) {
      this.screeningDetails.screening.CaseComponent = this.screeningService.componentList;
      this.screeningService.componentList.map(m => m.caseSubComponent = m.screeningSubComponent);
      this.screeningDetails.screening.clientRefNo = this.common.clientRefNoPrefix + this.screeningDetails.screening.clientRefNo;
      this.screeningDetails.screening.CaseComponent = this.screeningService.componentList.filter(f =>
        this.screeningDetails.screeningComponent.some(s => s.compId === f.compId));
      if (isNaN(this.screeningDetails.candidate.candidateId)) {
        this.screeningDetails.candidate.candidateId = 0;
      }
    }
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.screeningDetails.screeningComponent.length; i++) {
      // tslint:disable-next-line: prefer-for-of
      for (let j = 0; j < this.screeningDetails.screeningComponent[i].component.length; j++) {
        const compNameDet = this.screeningService.componentList
          .find(f => f.compId === this.screeningDetails.screeningComponent[i].compId);
        if (this.screeningDetails.screeningComponent[i].component[j].screeningInsufficiency
          && this.screeningDetails.screeningComponent[i].component[j].screeningInsufficiency.requiredLookupId === 226
          && this.screeningDetails.screeningComponent[i].component[j].screeningComponentInfo.insuffRaisedFlag) {
          inSuffCount++;
          if (this.screeningDetails.screeningComponent[i].component[j].screeningInsufficiency.insuffDocument.length > 0) {
            documentUploadCount++;
            // this.commonSave(false);
          } else {
            const insuffCompName = this.screeningService.componentList.
              find(x => x.compId === this.screeningDetails.screeningComponent[i].compId).compName;
            this.showNotification('warn', 'Failed to save', 'Please add  atleast one insufficiency document for '
              + insuffCompName + ' component');
          }
        }
      }

    }
    if (inSuffCount === documentUploadCount) {
      const formData = new FormData();
      for (let i = 0; i < this.screeningDetails.document.length; i++) {
        if (this.screeningDetails.document[i].fileName) {
          formData.append('ScreeningDocument_' + i, this.screeningDetails.document[i].document);
        }
      }
      for (let i = 0; this.screeningDetails.screeningComponent.length > i; i++) {
        for (let j = 0; this.screeningDetails.screeningComponent[i].component.length > j; j++) {
          if (this.screeningDetails.screeningComponent[i].component[j].criminalCheckCount > 0) {
            const count = this.screeningDetails.screeningComponent[i].component[j].criminalCheckCount;
            for (let c = 0; count > c; c++) {
              const paddress1 = this.screeningDetails.screeningComponent[i].component[j].compRef;
              if (paddress1 && paddress1.hasOwnProperty('address' + c)) {
                this.screeningDetails.screeningComponent[i].component[j].compRef.address.push(paddress1['address' + c]);
              }
            }
          }
        }
      }
      for (let i = 0; this.screeningDetails.screeningComponent.length > i; i++) {
        for (let j = 0; this.screeningDetails.screeningComponent[i].component.length > j; j++) {
          if (!this.screeningDetails.screeningComponent[i].component[j].screeningComponentInfo.insuffRaisedFlag) {
            this.screeningDetails.screeningComponent[i].component[j].screeningInsufficiency = null;
          }
          if (this.screeningDetails.screeningComponent[i].component[j].screeningComponentInfo.screeningCompId === 0 && this.screeningDetails1.pcC3ECount > 0 && this.screeningDetails.screeningComponent[i].component[j].screeningComponentInfo.compId === 11) {
            this.screeningDetails.screeningComponent[i].component[j].screeningComponentInfo.compIndex = this.screeningDetails1.pcC3ECount + 1;
          }
          if (this.screeningDetails.screeningComponent[i].component[j].screeningComponentInfo.screeningCompId !== 0 && this.screeningDetails1.pcC3ECount > 0 && this.screeningDetails.screeningComponent[i].component[j].screeningComponentInfo.compId === 11) {
            this.screeningDetails.screeningComponent[i].component[j].screeningComponentInfo.compIndex = this.screeningDetails.screeningComponent[i].component[j].screeningComponentInfo.driectAppIndex;
          }
          if (this.screeningDetails.screeningComponent[i].component[j].screeningComponentInfo.subCompId === 1) {
            this.screeningDetails.screeningComponent[i].component[j].compRef.address.addressPos = this.screeningDetails.candidate.address.addressPos;
            //this.screeningDetails.screeningComponent[i].component[j].compRef.periodOfStayTo = this.screeningDetails.candidate.periodOfStayTo;
          }
          const paddress1 = this.screeningDetails.screeningComponent[i].component[j].compRef;
          if (paddress1 && paddress1.hasOwnProperty('permanentAddress')) {
            const paddress = this.screeningDetails.screeningComponent[i].component[j].compRef.permanentAddress;
            if (paddress1.permanentAddress && !(paddress.addLine1 || paddress.postalCode || paddress.countryId)) {
              this.screeningDetails.screeningComponent[i].component[j].compRef.permanentAddress = null;
            } else {
              this.screeningDetails.screeningComponent[i].component[j].compRef.permanentAddress = paddress;
            }
          }
        }
      }
      const cvcomp = this.screeningDetails.screeningComponent.filter(f => f.compId === 13);
      cvcomp.forEach((element, index) => {
        const cvCompRef: any[] = [];
        const dummy: any[] = [];
        const cvContent = this.common.CloneObject(element.component[index].compRefDetail);
        const category = Object.keys(cvContent);
        for (let i = 0; category.length > i; i++) {
          // cvContent[category[i]]
          for (let j = 0; cvContent[category[i]].length > j; j++) {
            const data = cvContent[category[i]][j];
            for (let k = 0; data.length > k; k++) {
              cvCompRef.push(data[k]);
            }
          }
        }
        element.component[index].compRef = cvCompRef;
        // for (let i = 0; cvCompRef.length > i; i++) {
        //   // dummy.push(cvCompRef[i]);
        //   element.component[index].compRef.push(cvCompRef[i]);
        // }
      });
      let scrnCompData: any[] = [];
      // tslint:disable-next-line: prefer-for-of
      for (let j = 0; j < this.screeningDetails.screeningComponent.length; j++) {
        scrnCompData = this.screeningDetails.screeningComponent[j].component;
        // tslint:disable-next-line: prefer-for-of
        for (let k = 0; k < scrnCompData.length; k++) {
          if (scrnCompData[k].screeningComponentInfo.componentDocument && scrnCompData[k].screeningComponentInfo.componentDocument.length > 0) {
            let l = 0;
            for (l; l < scrnCompData[k].screeningComponentInfo.componentDocument.length; l++) {
              if (scrnCompData[k].screeningComponentInfo.componentDocument[l].fileName) {
                formData.append('ScreeningComponentDocument_' +
                  scrnCompData[k].screeningComponentInfo.compId + '_' + l,
                  scrnCompData[k].screeningComponentInfo.componentDocument[l].document);
              }
            }
          }
        }
      }
      const gapReasonData = this.screeningDetails.gapReason;

      for (let r = 0; r < gapReasonData.length; r++) {
        for (let s = 0; s < gapReasonData[r].reasonDoument.length; s++) {
          if (gapReasonData[r].reasonDoument[s].fileName) {
            formData.append('GapReasonDocument_' + gapReasonData[r].typeLookupId + '_' + s,
              gapReasonData[r].reasonDoument[s].document);
          }
        }
      }

      // console.log(this.fileSubmission,this.fileSubmission.get('gapReason')?.status)
      // if(this.fileSubmission.get('gapReason')?.status === "INVALID" ){

      //   const GPvalue = this.fileSubmission.get('gapReason')?.value
      //   for (let k = 0; GPvalue.length > k; k++) {
      //     GPvalue[k].reasonFlag =null;
      //     GPvalue[k].remarks = null;
      //   }
      //   this.fileSubmission.get('gapReason')?.setValue(GPvalue);

      // }
      this.screeningDetails.screeningComponent.map(m => m.component.map(m2 => {
        if (m2.screeningComponentInfo.notApplicableFlag) {
          m2.compRef = null;
          m2.compRefDetail = null;
          m2.screeningInsufficiency = null;
        }
      }));
      if (htmlstring.length > 0) {
        if (htmlstring[0].innerHTML.includes('signaturec')) {
          htmlstring[0].innerHTML = htmlstring[0].innerHTML.replace(/signaturec/g,
            this.screeningDetails.candidate.consentSignature ? this.screeningDetails.candidate.consentSignature : 'signaturec');
        }
        if (this.screeningDetails.candidate.consentSignature != "") {
          if (htmlstring[0].innerHTML.includes('datec')) {
            htmlstring[0].innerHTML = htmlstring[0].innerHTML.replace(/datec/g,
              this.common.currentDateTime ? this.common.currentDateTime : 'datec');
          }
        }
        if (htmlstring[0].innerHTML.includes('@@iagree ')) {

          htmlstring[0].innerHTML = htmlstring[0].innerHTML.replace(/@@iagree /g,
            this.screeningDetails.candidate.iagreeFlag ? '' : '');
          // this.screeningDetails.candidate.iagreeFlag ? 'Yes ' : 'No ');
        }
        this.screeningDetails.candidate.loadocumentHtml = htmlstring[0].innerHTML;
        this.screeningDetails.teamName = this.userData.team;
      }
      const cvalue = this.fileSubmission.get('candidate')?.get('address')?.value

      if (cvalue.addressPos[0].addressId != cvalue.addressId) {
        cvalue.addressPos[0].addressId = cvalue.addressId;
        cvalue.addressPos[0].addressPosId = this.common.candidateData.address.addressPos.length != 0 ? this.common.candidateData.address.addressPos[0].addressPosId : 0;
        cvalue.addressPos[0].screeningCompId = null;
        this.screeningDetails.candidate.address = cvalue;
      }

      this.screeningDetails.screening.caseNo = this.caseNo ? this.caseNo : this.screeningService.screenCaseNo;

      if (this.fileSubmission.get('gapReason')?.status === "INVALID") {

        const GPvalue = this.fileSubmission.get('gapReason')?.value
        for (let k = 0; GPvalue.length > k; k++) {
          GPvalue[k].reasonFlag = null;
          GPvalue[k].remarks = null;
        }
        this.screeningDetails.gapReason = GPvalue;

      }
      formData.append('ScreeningDetails', JSON.stringify(this.screeningDetails));
      if (this.screeningService.caseFlag === true || this.screeningService.caseFlagType === this.common.INSUFFCLEARANCE || this.screeningService.caseFlagType === this.common.FRREJECT || this.screeningService.caseFlagType === this.common.VEREJECT) {
        this.screeningService.addScreeningDetails(formData).subscribe(resp => {
          if (resp) {
            this.commonResp('case', isMultiCompSubmit, this.screeningDetails);

          }
        });
      } else if (this.screeningService.caseFlagType === this.common.NEWCASE) {
        this.screeningService.addNewScreeningDetails(formData).subscribe(resp => {
          if (resp) {
            this.commonResp('case', isMultiCompSubmit, this.screeningDetails);

          }
        });
      } else {
        this.screeningService.addPreQCScreeningDetails(formData, '').subscribe(resp => {
          if (resp) {
            this.commonResp('preQc', isMultiCompSubmit, this.screeningDetails);
          }
        });
      }
    }

  }
  rejectedCompQcApproval() {
    this.QcService.RejectedCompQcApproval(this.screeningService.screeningCompId, this.userData.userId).subscribe(resp => {
      if (resp) {
        this.showNotification('success', 'Success Message', 'Approved Successfully');
        this.router.navigate(['/dashboard/screening/caselist']);
      }
    });
  }
  public openDialog() {
    const popupData = {
      action: this.common.CANDIDATECONFIRM,
      headerText: 'Confirmation!',
      bodyText: 'Thank you for using our portal for online application for background verification,' +
        'You have pending components to submit to proceed your background verification,if you click <strong>Ok</strong> then session will be end or else click <strong>Stay</strong> to Continue the session.'
    };
    const dialogRef = this.dialog.open(CommonAlertsComponent, {
      width: '400px',
      data: popupData,
      disableClose: true
    });
    if (dialogRef) {
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const action = String(result.type);
          if (action === this.common.CANDIDATECONFIRMNO) {
            this.logout();
          } else if (action === this.common.CANDIDATECONFIRM) {
            this.getCandidateCase();
          }
        }
      });
    }
  }
  commonResp(fileSubmissionType, isMultiCompSubmit, details) {
    if (this.stepperFlag) {
      if (this.applicationId === 3) {
        this.getCandidateCase()
        this.showNotification('success', 'Success Message', 'Save Successfully');
      } else {
        const msg = (this.screeningService.caseFlagType === this.common.PREQCREJECT
          || fileSubmissionType === 'case'
          || this.screeningService.caseFlagType === this.common.INSUFFCLEARANCE
          || this.screeningService.caseFlagType === 'QCREJECT') ?
          'Submitted' : 'Approved';
        this.showNotification('success', 'Success Message', msg + ' Successfully');
        if (this.screeningService.caseFlagType === this.common.INSUFFCLEARANCE) {
          this.router.navigate(['dashboard/screening/insufflist']);
        } else if (this.screeningService.caseFlagType === 'QCREJECT') {
          this.getFinalReprt(this.screeningDetails1.screening.screeningId, this.screeningService.screeningCompId);
        } else if (this.screeningService.caseFlagType === this.common.FRREJECT || this.screeningService.caseFlagType === this.common.VEREJECT) {
          this.router.navigate(['/dashboard/screening/caselist']);
        } else if (this.screeningService.caseFlagType === this.common.REOPEN) {
          this.router.navigate(['/dashboard/screening/caselist']);
        }
        this.getAssignedCaseDetails(this.caseNo);
      }
      this.stepperFlag = false;

    } else {
      if (this.applicationId === 3) {
        this.showNotification('success', 'Success Message', 'Save Successfully');

        if (isMultiCompSubmit) {
          if (!this.fileSubmission.get('screeningComponent')?.valid) {
            if (this.popHide === true) {
              this.openDialog();
            }
            else if (this.popHide === false) {
              this.getCandidateCase()
              this.popHide = true
            }
            else {
              this.popHide = true
            }

          } else if (this.btnlabel === 'Submit & Pay' || (this.btnlabel === 'Save & Submit' && this.fileSubmission.get('screeningComponent')?.valid &&
            (this.fileSubmission.get('candidate.consentLookupName')?.value === 'EConsent' && this.fileSubmission.get('candidate.iagreeFlag')?.value &&
              this.fileSubmission.get('candidate.consentSignature')?.value != "") || (this.fileSubmission.get('candidate.consentLookupName')?.value === 'Physical Consent' &&
                this.fileSubmission.get('document')?.value.length > 0))) {

            this.showalert();
          }
          else if ((this.btnlabel === 'Save & Submit' && this.fileSubmission.get('screeningComponent')?.valid &&
            (this.fileSubmission.get('candidate.consentLookupName')?.value === 'EConsent' && this.fileSubmission.get('candidate.iagreeFlag')?.value !== true &&
              this.fileSubmission.get('candidate.consentSignature')?.value === "") || (this.fileSubmission.get('candidate.consentLookupName')?.value === 'Physical Consent' &&
                this.fileSubmission.get('document')?.value.length < 0))) {

            this.stepperChange(this.step1);
            this.showNotification('warn', 'Failed to save', this.fileSubmission.get('candidate.consentLookupName')?.value === 'EConsent' ?
              'Please accept authorization to process further.' :
              'Upload atleast one LOA document.');
            return false;
          }
        } else {
          this.getCandidateCase();

        }

      } else {
        const msg = (this.screeningService.caseFlagType === this.common.PREQCREJECT
          || fileSubmissionType === 'case'
          || this.screeningService.caseFlagType === this.common.INSUFFCLEARANCE
          || this.screeningService.caseFlagType === 'QCREJECT') ?
          'Submitted' : 'Approved';
        this.showNotification('success', 'Success Message', msg + ' Successfully');
        if (this.screeningService.caseFlagType === this.common.INSUFFCLEARANCE) {
          this.router.navigate(['dashboard/screening/insufflist']);
        } else if (this.screeningService.caseFlagType === 'QCREJECT') {
          this.getFinalReprt(this.screeningDetails1.screening.screeningId, this.screeningService.screeningCompId);
        } else if (this.screeningService.caseFlagType === this.common.FRREJECT || this.screeningService.caseFlagType === this.common.VEREJECT) {
          this.router.navigate(['/dashboard/screening/caselist']);
        } else if (this.screeningService.caseFlagType === this.common.REOPEN) {
          this.router.navigate(['/dashboard/screening/caselist']);
        } else {
          if (isMultiCompSubmit) {
            const scrCompfrmArray = this.fileSubmission.get('screeningComponent') as UntypedFormArray;
            let backList: any[] = [];
            for (let i = 0; i < scrCompfrmArray.length; i++) {
              if (scrCompfrmArray.controls.length > 0) {
                const mainfrmGroup = scrCompfrmArray.controls[i] as UntypedFormGroup;
                const compFrmArray = mainfrmGroup.get('component') as UntypedFormArray;
                const compFrmArrayData = compFrmArray.getRawValue();
                compFrmArrayData.forEach(ele => {
                  backList.push(ele);
                });
              }
            }
            const alertFlag = backList.some(x => x.active !== true);
            if (alertFlag !== true) {
              this.backToList();
            } else {
              this.openAlertDialog();
            }

          } else {
            if (!isMultiCompSubmit && !this.screenRespFlag) {

              this.getScreeningComponentStatusDetails(details.screeningComponent[0].compId);
            }
            this.getAssignedCaseDetails(this.caseNo);
          }
        }
      }
    }
  }
  openAlertDialog() {
    this.dialog.open(this.alertTemplate,
      {
        width: '400px',
        disableClose: true
      });
  }
  getFinalReprt(screeningId, screeningCompId) {
    this.verification.reportType = 'download';
    this.verification.
      GetResponseDocument(0, screeningCompId).subscribe(res => {
        this.verification.finalReportvalue = res;
        this.verification.isFinalReport = true;
        this.verification.screeningId = 0;
        this.verification.clientId = this.fileSubmission.get('screening.clientId')?.value;
        this.verification.tempData = { 'verificationScreeningDet': { 'screeningCompId': screeningCompId } };
      }, err => {
      }, () => {
        // this.verification.generatePdfDoc(this.fileSubmission.get('screening.clientId')?.value);
        this.verification.getOrganizationLogo(this.fileSubmission.get('screening.clientId')?.value).subscribe(resp => {
          if (resp) {
            this.verification.fileLogo = resp;
          }
        }, err => { }, () => {
          this.verification.isFinalReport = true; // reportType === 'preview';
        });
        setTimeout(() => {
          this.router.navigate(['/dashboard/screening/caselist']);
        }, 100);
      }
      );
  }

  getScreeningComponentStatusDetails(compId: any) {
    // if (this.componentName.toUpperCase() === this.common.EDUCATION) {
    //       this.GetInstitutioInfo();
    //     this.getUniversity();
    //    this.getDegreeLkpList();
    //    this.GetNotProvidedReasonList();
    //    this.common.getEducationType();
    //    }
    //     if (this.componentName.toUpperCase() === this.common.EMPLOYMENT_HR ||
    //       this.componentName.toUpperCase() === this.common.EMPHR_EMPSUP) {
    //     this.GetCompanyInfo() ;
    //    }
    if (this.componentName !== this.common.DRUG_TEST && this.componentName !== this.common.EDUCATION && this.componentName != this.common.CRIMINAL_DATABASE) {
      this.screeningService.screeningComponentStatusDetails(compId, this.userData.deptId ? this.userData.deptId : 0, this.userData.applicationId).subscribe(res => {
        if (res) {

          if (this.componentName.toUpperCase() === this.common.COMPANY_SITE_VISIT) {
            this.screeningService.companyList = Object.assign([], res.company);
          }
          if (this.componentName.toUpperCase() === this.common.EMPLOYMENT_SUPERVISOR ||
            this.componentName.toUpperCase() === this.common.EMPHR_EMPSUP ||
            this.componentName.toUpperCase() === this.common.REFERENCE_SELF_EMPLOYED) {
            this.screeningService.employerSupList = Object.assign([], res.professionalReference);
          }
          if (this.componentName.toUpperCase() === this.common.REFERENCE_CHECK) {
            this.screeningService.profNameList = Object.assign([], res.professionalName);
          }
          if (this.componentName.toUpperCase() === this.common.CRIMINAL_CHECK_PCC3
            || this.componentName.toUpperCase() === this.common.CRIMINAL_CHECK_PCC3E
            || this.componentName.toUpperCase() === this.common.CRIMINAL_CHECK_PCC1
            || this.componentName.toUpperCase() === this.common.CRIMINAL_CHECK_PCC2
            || this.componentName.toUpperCase() === this.common.CRIMINAL_DATABASE
            || this.componentName.toUpperCase() === this.common.OFAC_SDN
            || this.componentName.toUpperCase() === this.common.ONLINE_CRC ||
            this.componentName.toUpperCase() === this.common.ONLINE_CRC_INTERNAL ||
            this.componentName.toUpperCase() === this.common.CriminalCheckGap
          ) {
            this.screeningService.addressType = Object.assign([], res.addressType);
          }
          this.compBaseDetails = res;
        }
      });
    } else {
      this.compBaseDetails = this.screeningService.screeningDetail
    }
  }
  GetCompanyInfo() {

    const values = this.getPaginationValues();
    this.screeningService.GetCompanyInfo(values).subscribe(resp => {
      if (resp) {
        this.screeningService.employerList = Object.assign([], resp);
      }
      // this.compBaseDetails.employer = resp;
    });

  }
  GetInstituteInfo() {

    const values = this.getPaginationValues();
    this.screeningService.GetInstituteInfo(values).subscribe(resp => {
      if (resp) {
        this.screeningService.instituteList = Object.assign([], resp);
      }

    });

  }
  GetInstitutioInfo() {
    if (this.componentName.toUpperCase() === this.common.EDUCATION) {
      const values = this.getPaginationValues();
      this.screeningService.GetInstitutioInfo(values).subscribe(resp => {
        if (resp) {
          this.screeningService.institutionList = Object.assign([], resp);
        }

      });
    }
  }
  //education
  getDegreeLkpList() {
    this.master.getAllDegreeLookup().subscribe(res => {
      this.screeningService.degreeList = res;

    });

  }
  getUniversity() {
    this.screeningService.getUniversity().subscribe(resp => {
      if (resp) {
        this.screeningService.Institution = resp;
      }
    })
  }
  GetNotProvidedReasonList() {
    this.screeningService.GetNotProvidedReasonList().subscribe(res => {
      if (res) {
        this.screeningService.npReasonList = res;
      }
    });
  }

  getPaginationValues() {
    return {
      pageSize: 450,
      page: 1,
      filters: '',
      sorts: '-empInsId',
      applyPaging: false,
      empInsId: 0,
      needTotal: false,
      department: "Candidate Submission",
      indianClientFlag: (this.screeningService.indianClientFlag || this.screeningService.ClientCategoryId == 1) ? true : false,
      techmFlag: this.screeningService.ClientCategoryId == 4 ? true : false,
      clientCategoryId: this.screeningService.ClientCategoryId,
    };
  }
  buttonvalue(): string {
    if (this.screeningService.caseFlagType === this.common.NEWCASE) {
      const compData = this.fileSubmission.get('screeningComponent')?.value;
      if (this.fileSubmission.valid) {
        this.breadcrumbFlags.btnSaveDisabled = false;
      } else {
        this.breadcrumbFlags.btnSaveDisabled = true;
      }
      this.btnlabel = 'Save & Submit';
      return 'Save & Submit';
    } else {
      if ((this.applicationId !== 3 && this.fileSubmission.get('screeningComponent')?.valid) ||
        (this.applicationId === 3 && this.fileSubmission.get('screeningComponent')?.valid &&
          (this.fileSubmission.get('candidate.consentLookupName')?.value === 'EConsent' ||
            this.fileSubmission.get('document')?.value.length > 0))) {
        this.btnlabel = 'Save & Submit';
        if (this.getPaymentFlag()) {
          this.btnlabel = 'Submit & Pay';
          this.paymenFlag = this.screeningDetails1.candidate.paymentBeforeCandidateFlag
        }
        return this.btnlabel;
      } else {
        if (this.applicationId === 3) {
          this.btnlabel = 'Save & Exit';
          if (this.getPaymentFlag()) {
            this.btnlabel = 'Save & Pay';
            this.paymenFlag = this.screeningDetails1.candidate.paymentBeforeCandidateFlag
          }
          return this.btnlabel;
        } else {
          this.btnlabel = 'Save';
          return 'Save';
        }
      }
    }
  }
  getPaymentFlag() {
    return this.screeningDetails1 && this.screeningDetails1.candidate && this.screeningDetails1.
      candidate.paymentBeforeCandidateFlag === true && this.userData.applicationId === 3;
  }
  openDialogDeleteOrder() {
    this.cancelReason.setValue('');
    this.dialog.open(this.cancelOrder,
      { width: '700px', disableClose: true, });
  }
  deleteOrder() {
    if (this.cancelReason.valid) {
      const popupData = {
        action: this.common.DELETECONFIRMATION,
        headerText: 'Alert',
        bodyText: 'Do you want to cancel the order, Once you cancel, you will logged out.'
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
              this.deleteCancel();
            }
          }
        });
      }
    }
  }
  deleteCancel() {
    this.authService.DeletePaymentBeforeCandidateCase(this.userData.userId, this.cancelReason.value).subscribe(res => {
      if (res) {
        this.showNotification('success', 'Success Message', 'Order Deleted Successfully');
        this.logout();
        this.dialogClose();
        this.cancelReason.reset()
      }
    });
  }
  showalert() {
    const popupData = {
      action: this.common.ALERT,
      headerText: 'CONFIRMATION',
      bodyText: 'Thank you for submitting the online application for background verification!' +
        (this.getPaymentFlag() ? (' Next you will be move to payment for ₹ ' + this.price) : '')
    };
    const dialogRef = this.dialog.open(CommonAlertsComponent, {
      width: '320px',
      data: popupData,
      disableClose: true
    });
    if (dialogRef) {
      dialogRef.afterClosed().subscribe(result => {
        if (this.getPaymentFlag()) {
          this.saveAndPaycase();
          // setTimeout(() => {
          //   this.logout();            
          // }, 1200);
        } else {
          this.logout();
        }
      });
    }
  }
  logout() {
    const home = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.authService.LogOut(home.userId, home.logId).subscribe(res => {
      if (res.success) {
        sessionStorage.removeItem('user_data');
        sessionStorage.clear();
        this.router.navigate(['/']);
        this.shared.clientApprovalUrl = '';
      }
    }, err => { }, () => { });
  }

  goToStep(selectedIndex: any) {
    this.step1 = selectedIndex;
    if (this.step1 === 0) {
      this.step1 = 0;
      this.stepperChange(0);
    }
    if (this.step1 !== 0) {
      if (this.step1 === 1) {
        if (this.fileSubmission.get('candidate')?.valid) {
          this.stepperChange(selectedIndex);
        } else {
          this.scroll.scrollToError();
          this.fileSubmission.get('candidate')?.markAllAsTouched();
          this.step1 = 0;
        }
      } else if (this.step1 === 2) {
        if (this.fileSubmission.get('candidate')?.valid) {
          if (this.fileSubmission.get('screening')?.valid) {
            this.stepperChange(selectedIndex);
          } else {
            this.fileSubmission.get('screening')?.markAllAsTouched();
            this.step1 = 1;
            this.stepperChange(1);
            this.scroll.scrollToError();
          }
        } else {
          this.scroll.scrollToError();
          this.fileSubmission.get('candidate')?.markAllAsTouched();
          this.step1 = 0;
          this.stepperChange(0);
        }

      } else if (this.step1 === 3) {
        if (this.fileSubmission.get('candidate')?.valid) {
          if (this.fileSubmission.get('screening')?.valid) {
            if (!this.fileSubmission.get('screeningComponent')?.valid || this.fileSubmission.get('screeningComponent')?.valid) {
              const selectedComp = this.caseSubmissionList.screeningCaseComponent.findIndex(x => x.compName === this.componentName);

              this.tabIndex = this.tabIndex + 1;
              // this.step1 = 2;
              this.stepperChange(selectedIndex);
            } else {
              this.fileSubmission.get('screeningComponent')?.markAllAsTouched();
              this.step1 = 2;
              this.stepperChange(2);
            }
          } else {
            this.fileSubmission.get('screening')?.markAllAsTouched();
            this.step1 = 1;
            this.stepperChange(1);
          }
        } else {
          this.scroll.scrollToError();
          this.fileSubmission.get('candidate')?.markAllAsTouched();
          this.step1 = 0;
          this.stepperChange(0);
        }
      } else {
        this.scroll.scrollToError();
        this.fileSubmission.get('candidate')?.markAllAsTouched();
        this.step1 = 0;
        this.stepperChange(0);
      }

    }
  }
  goToStepcan(selectedIndex, type) {
    this.Address = this.screeningDetails = this.fileSubmission.getRawValue()
    this.compLength = this.screeningService.componentList.length;
    if (this.compLength === 1) {
      this.nxtstep = false
    }
    else {
      this.nxtstep = true
    }
    this.previewStep = false;
    const preStep = this.step1;
    this.step1 = selectedIndex;
    if (this.screeningService.caseFlagType === this.common.NEWCASE || this.manualFilesubmissionRE) {
      this.changeStepperManualCase(selectedIndex);
    } else {
      if (this.step1 === 0) {
      this.screeningService.compData = {compName:"Address"};     
        this.step1 = 0;
        this.stepperChange(0);
      }
      if (this.step1 !== 0) {
        if (preStep === 0) {
          const submissionData = this.fileSubmission.getRawValue();
          this.screeningService.componentList.forEach((element, index) => {
            if (element.subCompFlag) {
              const subcomp = element.screeningSubComponent.find(f => f.subCompName === 'Current Address');
              if (subcomp) {

                const compIndex = submissionData.screeningComponent.findIndex(i => i.compId === subcomp.compId);
                const subCombIndex = submissionData.screeningComponent[compIndex].component
                  .findIndex(fi => fi.screeningComponentInfo.subCompId === subcomp.subCompId);

                const subCombData = submissionData.screeningComponent[compIndex].component
                  .filter(fi => fi.screeningComponentInfo.subCompId === subcomp.subCompId);

                const screeningCompArray = this.fileSubmission.get('screeningComponent') as UntypedFormArray;
                const compArray = screeningCompArray.controls[compIndex].get('component') as UntypedFormArray;

                compArray.controls[subCombIndex].get('compRef.address')?.patchValue({
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
                  addressPos: submissionData.candidate.address.addressPos[0].addressPosId == 0 ? submissionData.candidate.address.addressPos : subCombData[0].compRef.address.addressPos
                });

                //compArray.controls[subCombIndex].get('compRef.address.addressPos')?.setValue(submissionData.candidate.address ? submissionData.candidate.address.addressPos as UntypedFormArray : submissionData.candidate.address0.addressPos as UntypedFormArray);

                compArray.controls[subCombIndex].get('active')?.setValue(true);
                // this.screeningDetails.screeningComponent[compIndex].component[subCombIndex].compRef.address = this.screeningDetails.candidate.address;
                // this.screeningDetails.screeningComponent[compIndex].component[subCombIndex].active = true;
              }
            }
          });
        }
        if (this.step1 === 1) {
          if (this.fileSubmission.get('candidate')?.valid) {
            // if (this.fileSubmission.get('candidate.econsentFlag')?.value) {
            //   if (this.fileSubmission.get('candidate.iagreeFlag')?.value &&
            //     this.fileSubmission.get('candidate.consentSignature')?.value) {
            //     this.stepperChange(selectedIndex);
            //   } else {
            //     this.showNotification('warn', 'Failure Message', 'Please accept authorization to process further.');
            //     this.step1 = 0;
            //   }
            // } else {
            //   if (this.fileSubmission.get('document')?.value.length > 0) {
            //     this.stepperChange(selectedIndex);
            //   } else {
            //     this.showNotification('warn', 'Failure Message', 'Upload atleast one LOA document.');
            //     this.step1 = 0;
            //   }
            // }
            this.stepperChange(selectedIndex);
          } else {
            this.scroll.scrollToError();
            this.fileSubmission.get('candidate')?.markAllAsTouched();
            this.step1 = 0;
          }
        } else if (this.step1 === 2) {
          if (this.fileSubmission.get('candidate')?.valid) {
            // if (this.fileSubmission.get('candidate.econsentFlag')?.value) {
            //   if (this.fileSubmission.get('candidate.iagreeFlag')? &&
            //     this.fileSubmission.get('candidate.consentSignature')) {
            //     this.stepperChange(selectedIndex);
            //   } else {
            //     this.showNotification('warn', 'Failure Message', 'Please accept authorization to process further.');
            //     this.step1 = 0;
            //   }
            // } else {
            //   if (this.fileSubmission.get('document')?.value.length > 0) {
            //     this.stepperChange(selectedIndex);
            //   } else {
            //     this.showNotification('warn', 'Failure Message', 'Upload atleast one ment.');
            //     this.step1 = 0;
            //   }
            // }
            if (this.userData.applicationId === 3 && type === 'next') {
              const popupData = {
                action: this.common.ALERT,
                headerText: 'CONFIRMATION',
                bodyText: 'This will be redirect to LOA Document Page!'
              };
              const dialogRef = this.dialog.open(CommonAlertsComponent, {
                width: '320px',
                data: popupData,
                disableClose: true
              });
              this.stepperChange(selectedIndex);
            } else {
              this.stepperChange(selectedIndex);
            }
          } else {
            this.scroll.scrollToError();
            this.fileSubmission.get('candidate')?.markAllAsTouched();
            this.step1 = 0;
            this.stepperChange(0);
          }

        } else if (this.step1 === 3) {
          if (this.fileSubmission.get('candidate')?.valid) {
            if (this.fileSubmission.get('candidate.consentLookupName')?.value === 'EConsent') {
              if (this.fileSubmission.get('candidate.iagreeFlag')?.value &&
                this.fileSubmission.get('candidate.consentSignature')?.value) {
                this.stepperChange(selectedIndex);
              } else {
                this.showNotification('warn', 'Failure Message', 'Please accept authorization to process further.');
                this.step1 = 2;
              }
            } else {
              if (this.fileSubmission.get('document')?.value.length > 0) {
                this.stepperChange(selectedIndex);
              } else {
                this.showNotification('warn', 'Failure Message', 'Upload atleast one LOA document.');
                this.step1 = 2;
              }
            }
            // this.stepperChange(selectedIndex);
          }
        } else {
          this.scroll.scrollToError();
          this.fileSubmission.get('candidate')?.markAllAsTouched();
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
        if (this.fileSubmission.get('candidate')?.valid && this.fileSubmission.get('screening')?.valid) {
          this.stepperChange(selectedIndex);
        } else {
          this.scroll.scrollToError();
          this.fileSubmission.get('candidate')?.markAllAsTouched();
          this.fileSubmission.get('screening')?.markAllAsTouched();
          this.step1 = 0;
        }
      }
    }
  }
  resetForm() {
    if (this.step1 === 0) {
      this.fileSubmission.get('candidate')?.reset();
    }

    if (this.step1 === 1) {
      this.fileSubmission.get('screening')?.reset();
    }
  }
  showNotification(severity1, summary1, message) {
    this.messageService.add({ severity: severity1, summary: summary1, detail: message });
  }
  createDocForm(formArray: UntypedFormArray, docData: any) {
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
      // const arr = this.fb.array([]);
      if (docData && docData.length > 0) {
        while (formArray.length !== 0) {
          formArray.removeAt(0);
        }
        for (let i = 0; docData.length > i; i++) {
          const required = docData[i].defaultQuestionFlag ? true : false;
          formArray.push(new UntypedFormGroup({
            miscId: new UntypedFormControl(docData[i].miscId),
            miscQuestion: new UntypedFormControl(docData[i].miscQuestion, !required ? Validators.required : null),
            miscAnswer: new UntypedFormControl(docData[i].miscAnswer, !required ? Validators.required : null),
            defaultQuestionFlag: new UntypedFormControl(docData[i].defaultQuestionFlag),
          }));
        }
      }
    }
  }
  removeMiscQues(index: any) {
    if (index > -1) {
      const removeMisc = this.fileSubmission.get('component')?.get('miscQuestion') as UntypedFormArray;
      removeMisc.removeAt(index);
    }
  }
  clientChangeEmit() {
    this.getCandidateComplist();
    const frmArray = this.fileSubmission.get('screeningComponent') as UntypedFormArray;
    const docfrmArray = this.fileSubmission.get('document') as UntypedFormArray;
    const length = frmArray.length;
    let ind = length;
    if (frmArray.length > 0) {
      while (ind >= 0) {
        frmArray.removeAt(ind);
        ind--;
      }
    }
    let doct = docfrmArray.length;
    if (docfrmArray.length > 0) {
      while (doct >= 0) {
        docfrmArray.removeAt(doct);
        doct--;
      }
    }
    // if (this.screeningDetails1.screeningComponent) {
    //   let compList: any[] = [];
    //   this.screeningDetails1.screeningComponent.forEach(ele => {
    //     if (ele.component) {
    //       ele.component.forEach(el => {
    //         if (el.screeningComponentInfo.subCompId > 0) {
    //         } else {
    //           this.screeningService.componentList.forEach(ee => {
    //             if (ee.compId === ele.compId && ee.subCompFlag !== true) {
    //               if (el.screeningComponentInfo.clientApprovalFlag === true) {
    //                const mainList = ee.filter(x => x.compId === ele.compId);
    //                compList.push(mainList);
    //               }
    //             }
    //           });
    //         }
    //       });
    //     }
    //   });
    //   this.screeningService.componentList = compList;
    // }
    for (let first = 0; this.screeningService.componentList.length > first; first++) {
      frmArray.push(this.initcomponentFormGroup(this.screeningService.componentList[first]));
    }
    for (let first = 0; this.screeningService.componentList.length > first; first++) {
      const arr = frmArray.controls[first] as UntypedFormGroup;
      // const compInitiationDate = this.screeningService.componentList[first].compInitiationDate;
      const compId = this.screeningService.componentList[first].compId;
      const deqcFlag = this.screeningService.componentList[first].deqcFlag;
      const compfrmarr = arr.get('component') as UntypedFormArray;
      if (this.screeningService.componentList[first].subCompFlag) {
        for (let sec = 0; this.screeningService.componentList[first].screeningSubComponent.length > sec; sec++) {
          for (let thr = 0; this.screeningService.componentList[first].screeningSubComponent[sec].noOfComponent > thr; thr++) {
            const comptype = this.screeningService.componentList[first].screeningSubComponent[sec].
              packageCount >= thr + 1 ? 'Package' : 'Individual';
            const subCompId = this.screeningService.componentList[first].screeningSubComponent[sec].subCompId;
            const criminalCheckCount = this.screeningService.componentList[first].screeningSubComponent[sec].criminalCheckCount;
            const currencyId = this.screeningService.componentList[first].screeningSubComponent[sec].currencyId;
            const subCheckFlag = this.screeningService.componentList[first].subCheckFlag;
            const compInitiationDate = this.screeningService.componentList[first].screeningSubComponent[sec].compInitiationDate;
            compfrmarr.push(this.initCommonFormGroup(true, comptype, compId, subCompId,
              criminalCheckCount, deqcFlag, false, currencyId, thr, subCheckFlag, compInitiationDate));
          }
        }
      } else {
        for (let fou = 0; this.screeningService.componentList[first].noOfComponent > fou; fou++) {
          const comptype = this.screeningService.componentList[first].packageCount >= fou + 1 ? 'Package' : 'Individual';
          const compInitiationDate = this.screeningService.componentList[first].compInitiationDate;
          compfrmarr.push(this.initCommonFormGroup(false, comptype, compId, null,
            this.screeningService.componentList[first].criminalCheckCount, deqcFlag, false,
            this.screeningService.componentList[first].currencyId, fou,
            this.screeningService.componentList[first].subCheckFlag, compInitiationDate));
        }
      }
    }
    for (let i = 0; this.screeningService.componentList.length > i; i++) {
      const comfrm = frmArray.controls[i] as UntypedFormGroup;
      const compArray = comfrm.get('component') as UntypedFormArray;
      let count = 0;
      switch (this.screeningService.componentList[i].compName.toUpperCase()) {
        case this.common.PAN_CARD:
          if (this.screeningService.componentList[i].subCompFlag) {

          } else {
            for (let k = 0; k < this.screeningService.componentList[i].noOfComponent; k++) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl('compRef', this.initPanForm());
              compRefGroup.addControl('componentCustomFields',
                this.initclientCustomFieldsForm(this.screeningService.componentList[i].componentCustomFields));
              if (this.screeningService.componentList[i].question.length > 0) {
                compRefGroup.addControl('miscQuestion', this.common.initMiscForm(this.screeningService.componentList[i].question));
              }
            }
          }
          break;
        case this.common.CREDIT_VERIFICATION:
          if (this.screeningService.componentList[i].subCompFlag) {

          } else {
            for (let k = 0; k < this.screeningService.componentList[i].noOfComponent; k++) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl('compRef', this.initCredForm());
              compRefGroup.addControl('componentCustomFields',
                this.initclientCustomFieldsForm(this.screeningService.componentList[i].componentCustomFields));
              if (this.screeningService.componentList[i].question.length > 0) {
                compRefGroup.addControl('miscQuestion', this.common.initMiscForm(this.screeningService.componentList[i].question));
              }
            }
          }
          break;
        case this.common.EMPLOYMENT_UAN:

          if (this.screeningService.componentList[i].subCompFlag) {

          } else {
            for (let k = 0; k < this.screeningService.componentList[i].noOfComponent; k++) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl('compRef', this.initUanForm());
              compRefGroup.addControl('componentCustomFields',
                this.initclientCustomFieldsForm(this.screeningService.componentList[i].componentCustomFields));
              if (this.screeningService.componentList[i].question.length > 0) {
                compRefGroup.addControl('miscQuestion', this.common.initMiscForm(this.screeningService.componentList[i].question));
              }
            }
          }
          break;
        case this.common.SOCIAL_MEDIA:

          if (this.screeningService.componentList[i].subCompFlag) {

          } else {
            for (let k = 0; k < this.screeningService.componentList[i].noOfComponent; k++) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl('compRef', this.initSocialMediaForm());
              compRefGroup.addControl('componentCustomFields',
                this.initclientCustomFieldsForm(this.screeningService.componentList[i].componentCustomFields));
              if (this.screeningService.componentList[i].question.length > 0) {
                compRefGroup.addControl('miscQuestion', this.common.initMiscForm(this.screeningService.componentList[i].question));
              }
            }
          }
          break;
        case this.common.SOCIAL_MEDIA:

          if (this.screeningService.componentList[i].subCompFlag) {

          } else {
            for (let k = 0; k < this.screeningService.componentList[i].noOfComponent; k++) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl('compRef', this.initSocialMediaForm());
              compRefGroup.addControl('componentCustomFields',
                this.initclientCustomFieldsForm(this.screeningService.componentList[i].componentCustomFields));
              if (this.screeningService.componentList[i].question.length > 0) {
                compRefGroup.addControl('miscQuestion', this.common.initMiscForm(this.screeningService.componentList[i].question));
              }
            }
          }
          break;
        case this.common.OIG:
          if (this.screeningService.componentList[i].subCompFlag) {
          } else {
            for (let k = 0; k < this.screeningService.componentList[i].noOfComponent; k++) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl('compRef', this.initOigForm());
              compRefGroup.addControl('componentCustomFields',
                this.initclientCustomFieldsForm(this.screeningService.componentList[i].componentCustomFields));
            }
          }
          break;
        case this.common.FACISLevel1:
          if (this.screeningService.componentList[i].subCompFlag) {
          } else {
            for (let k = 0; k < this.screeningService.componentList[i].noOfComponent; k++) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl('compRef', this.initFACIS1Form());
              compRefGroup.addControl('componentCustomFields',
                this.initclientCustomFieldsForm(this.screeningService.componentList[i].componentCustomFields));
            }
          }
          break;
        case this.common.FACISLevel2:
          if (this.screeningService.componentList[i].subCompFlag) {
          } else {
            for (let k = 0; k < this.screeningService.componentList[i].noOfComponent; k++) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl('compRef', this.initFACIS2Form());
              compRefGroup.addControl('componentCustomFields',
                this.initclientCustomFieldsForm(this.screeningService.componentList[i].componentCustomFields));
            }
          }
          break;
        case this.common.FACISLevel3:
          if (this.screeningService.componentList[i].subCompFlag) {
          } else {
            for (let k = 0; k < this.screeningService.componentList[i].noOfComponent; k++) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl('compRef', this.initFACIS3Form());
              compRefGroup.addControl('componentCustomFields',
                this.initclientCustomFieldsForm(this.screeningService.componentList[i].componentCustomFields));
            }
          }
          break;
        case this.common.FACIS1M:
          if (this.screeningService.componentList[i].subCompFlag) {
          } else {
            for (let k = 0; k < this.screeningService.componentList[i].noOfComponent; k++) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl('compRef', this.initFACISMForm());
              compRefGroup.addControl('componentCustomFields',
                this.initclientCustomFieldsForm(this.screeningService.componentList[i].componentCustomFields));
            }
          }
          break;
        case this.common.TENNESSEE:
          if (this.screeningService.componentList[i].subCompFlag) {
          } else {
            for (let k = 0; k < this.screeningService.componentList[i].noOfComponent; k++) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl('compRef', this.initTENNESSEEForm());
              compRefGroup.addControl('componentCustomFields',
                this.initclientCustomFieldsForm(this.screeningService.componentList[i].componentCustomFields));
            }
          }
          break;
        case this.common.ADDRESS:
        case this.common.ADDRESS_GEO:
          if (this.screeningService.componentList[i].subCompFlag) {
            count = 0;
            for (let a = 0; this.screeningService.componentList[i].screeningSubComponent.length > a; a++) {
              for (let b = 0; this.screeningService.componentList[i].screeningSubComponent[a].noOfComponent > b; b++) {
                const addGroup = compArray.controls[count] as UntypedFormGroup;
                addGroup.addControl('compRef', this.initAddressForm());
                addGroup.addControl('componentCustomFields',
                  this.initclientCustomFieldsForm(this.screeningService.componentList[i].componentCustomFields));
                const addForm = addGroup.get('compRef') as UntypedFormGroup;
                if (this.applicationId === 3 &&
                  this.screeningService.componentList[i].screeningSubComponent[a].subCompName === 'Current Address') {
                  // addForm.addControl('periodOfStayTo', new UntypedFormControl(''));
                } else {
                  if ((this.userData.teamName === 'DEPre-QC' || (this.userData.subTeamLeadFlag === true &&
                    this.userData.teamName === 'CTS-SubmissionTeam' && this.userData.teamLeadFlag !== true)) &&
                    this.screeningService.componentList[i].screeningSubComponent[a].subCompName === 'Current Address') {
                    // addForm.get('periodOfStay')?.setValidators(this.validatedateInputStayFromwithBirt);
                    // addForm.addControl('periodOfStayTo', new UntypedFormControl('', this.validatedateInputwitTilldate));
                  }
                }
                count++;
              }
            }
          } else {
            for (let c = 0; this.screeningService.componentList[i].noOfComponent > c; c++) {
            }
          }
          break;
        case this.common.NDOT_DRUG_SCREEN:
          if (this.screeningService.componentList[i].subCompFlag) {

          } else {
            for (let k = 0; k < this.screeningService.componentList[i].noOfComponent; k++) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl('compRef', this.initNdotDrugForm());
              compRefGroup.addControl('componentCustomFields',
                this.initclientCustomFieldsForm(this.screeningService.componentList[i].componentCustomFields));
            }
          }
          break;
        case this.common.DRUG_TEST:
          if (this.screeningService.componentList[i].subCompFlag) {
            count = 0;
            for (let a = 0; this.screeningService.componentList[i].screeningSubComponent.length > a; a++) {
              for (let b = 0; this.screeningService.componentList[i].screeningSubComponent[a].noOfComponent > b; b++) {
                const drugGroup = compArray.controls[count] as UntypedFormGroup;
                drugGroup.addControl('compRef', this.initDrugForm());
                drugGroup.addControl('componentCustomFields',
                  this.initclientCustomFieldsForm(this.screeningService.componentList[i].componentCustomFields));
                count++;
              }
            }
          } else {
            for (let c = 0; this.screeningService.componentList[i].noOfComponent > c; c++) {
            }
          }
          break;

        case this.common.NATIONAL_IDENTITY_CHECK:
          if (this.screeningService.componentList[i].subCompFlag) {

          } else {
            for (let k = 0; k < this.screeningService.componentList[i].noOfComponent; k++) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl('compRef', this.initNiciForm());
              compRefGroup.addControl('componentCustomFields',
                this.initclientCustomFieldsForm(this.screeningService.componentList[i].componentCustomFields));
            }
          }
          break;
        case this.common.DIRECTORSHIP:
          if (this.screeningService.componentList[i].subCompFlag) {

          } else {
            for (let k = 0; k < this.screeningService.componentList[i].noOfComponent; k++) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl('compRef', this.initDirectorshipForm());
              compRefGroup.addControl('componentCustomFields',
                this.initclientCustomFieldsForm(this.screeningService.componentList[i].componentCustomFields));
            }
          }
          break;
        case this.common.GSA:
          if (this.screeningService.componentList[i].subCompFlag) {

          } else {
            for (let k = 0; k < this.screeningService.componentList[i].noOfComponent; k++) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl('compRef', this.initGsaForm());
              compRefGroup.addControl('componentCustomFields',
                this.initclientCustomFieldsForm(this.screeningService.componentList[i].componentCustomFields));
            }
          }
          break;
        case this.common.FDA:
          if (this.screeningService.componentList[i].subCompFlag) {

          } else {
            for (let k = 0; k < this.screeningService.componentList[i].noOfComponent; k++) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl('compRef', this.initFdaForm());
              compRefGroup.addControl('componentCustomFields',
                this.initclientCustomFieldsForm(this.screeningService.componentList[i].componentCustomFields));
            }
          }
          break;
        case this.common.NSR:
          if (this.screeningService.componentList[i].subCompFlag) {

          } else {
            for (let k = 0; k < this.screeningService.componentList[i].noOfComponent; k++) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl('compRef', this.initNsrForm());
              compRefGroup.addControl('componentCustomFields',
                this.initclientCustomFieldsForm(this.screeningService.componentList[i].componentCustomFields));
            }
          }
          break;
        case this.common.EMPLOYMENT_HR:
          if (this.screeningService.componentList[i].subCompFlag) {
            for (let a = 0; this.screeningService.componentList[i].screeningSubComponent.length > a; a++) {
              for (let b = 0; this.screeningService.componentList[i].screeningSubComponent[a].noOfComponent > b; b++) {
                const emp = comfrm.controls[b] as UntypedFormGroup;
                emp.addControl('compRef', this.initEmployerForm(b, this.screeningService.componentList[i].screeningSubComponent[a].compId));
                if (this.screeningService.componentList[i].question.length > 0) {
                  emp.addControl('miscQuestion', this.common.initMiscForm(this.screeningService.componentList[i].question));
                }
              }
            }
          } else {
            for (let k = 0; k < this.screeningService.componentList[i].noOfComponent; k++) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl('compRef', this.initEmployerForm(k, this.screeningService.componentList[i].compId));
              const comprefGroup = compRefGroup.get('compRef') as UntypedFormGroup;
              // compRefGroup.addControl('periodOfStayAddress', new UntypedFormControl([]));
              if (this.screeningDetails1.invitationFlag === true) {
                comprefGroup.addControl('supervisorDet', this.initEmpSupervisorForm(true));
                // comprefGroup.addControl('supervisorDet', new UntypedFormGroup({
                //   supervisorId: new UntypedFormControl(0),
                //   supervisorName: new UntypedFormControl(),
                //   // tslint:disable-next-line: max-line-length
                //   // address: this.initCommonAddress(false)
                //   SupervisorDesignation: new UntypedFormControl(null),
                //   SupervisorCompanyName: new UntypedFormControl(null),
                // }));
              } else {
                // comprefGroup.addControl('supervisorDet', new UntypedFormControl(null));
              }
              compRefGroup.addControl('componentCustomFields',
                this.initclientCustomFieldsForm(this.screeningService.componentList[i].componentCustomFields));
              if (this.screeningService.componentList[i].question.length > 0) {
                compRefGroup.addControl('miscQuestion', this.common.initMiscForm(this.screeningService.componentList[i].question));
              }
              // if (this.screeningService.componentList[i].componentCustomFields.length > 0) {
              // }
            }
          }
          break;
        case this.common.EDUCATION:
          if (this.screeningService.componentList[i].subCompFlag) {
            for (let a = 0; this.screeningService.componentList[i].screeningSubComponent.length > a; a++) {
              for (let b = 0; this.screeningService.componentList[i].screeningSubComponent[a].noOfComponent > b; b++) {
                const edu = comfrm.controls[b] as UntypedFormGroup;
                if (this.screeningService.componentList[i].question.length > 0) {
                  edu.addControl('miscQuestion', this.common.initMiscForm(this.screeningService.componentList[i].question));
                }
              }
            }
          } else {
            for (let k = 0; k < this.screeningService.componentList[i].noOfComponent; k++) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl('compRef', this.initEducationForm(k, this.screeningService.componentList[i].compId));
              compRefGroup.addControl('componentCustomFields',
                this.initclientCustomFieldsForm(this.screeningService.componentList[i].componentCustomFields));
              if (this.screeningService.componentList[i].question.length > 0) {
                compRefGroup.addControl('miscQuestion', this.common.initMiscForm(this.screeningService.componentList[i].question));
              }
              // if (this.screeningService.componentList[i].componentCustomFields.length > 0) {
              //   compRefGroup.addControl('componentCustomFields',
              //     this.initclientCustomFieldsForm(this.screeningService.componentList[i].componentCustomFields));
              // }
            }
          }
          break;
        case this.common.ONLINE_CRC_INTERNAL:
        case this.common.ONLINE_CRC:
        case this.common.CRIMINAL_COURT_RECORD:
        case this.common.CriminalCheckGap:
          if (this.screeningService.componentList[i].subCompFlag) {
          } else {
            for (let k = 0; k < this.screeningService.componentList[i].noOfComponent; k++) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl('compRef', this.initCrcForm());
              compRefGroup.addControl('componentCustomFields',
                this.initclientCustomFieldsForm(this.screeningService.componentList[i].componentCustomFields));
            }
          }
          break;
        case this.common.LICENSE:
          if (this.screeningService.componentList[i].subCompFlag) {

          } else {
            for (let k = 0; k < this.screeningService.componentList[i].noOfComponent; k++) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl('compRef', this.initLicenseForm());
              compRefGroup.addControl('componentCustomFields',
                this.initclientCustomFieldsForm(this.screeningService.componentList[i].componentCustomFields));
            }
          }
          break;
        case this.common.PASSPORT:
          if (this.screeningService.componentList[i].subCompFlag) {

          } else {
            for (let k = 0; k < this.screeningService.componentList[i].noOfComponent; k++) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl('compRef', this.initPassportForm());
              compRefGroup.addControl('componentCustomFields',
                this.initclientCustomFieldsForm(this.screeningService.componentList[i].componentCustomFields));
            }
          }
          break;
        case this.common.VOTER_ID:
          if (this.screeningService.componentList[i].subCompFlag) {

          } else {
            const compRefGroup = compArray.controls[0] as UntypedFormGroup;
            compRefGroup.addControl('compRef', this.initVoterIdForm());
            compRefGroup.addControl('componentCustomFields',
              this.initclientCustomFieldsForm(this.screeningService.componentList[i].componentCustomFields));
          }
          break;
        case this.common.COMPANY_SITE_VISIT:
          if (this.screeningService.componentList[i].subCompFlag) {

          } else {
            for (let k = 0; k < this.screeningService.componentList[i].noOfComponent; k++) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl('compRef', this.initCompanySiteVisitForm());
              compRefGroup.addControl('componentCustomFields',
                this.initclientCustomFieldsForm(this.screeningService.componentList[i].componentCustomFields));
              if (this.screeningService.componentList[i].question.length > 0) {
                compRefGroup.addControl('miscQuestion', this.common.initMiscForm(this.screeningService.componentList[i].question));
              }
            }
          }
          break;
        case this.common.REFERENCE_CHECK:
          if (this.screeningService.componentList[i].subCompFlag) {

          } else {
            for (let k = 0; k < this.screeningService.componentList[i].noOfComponent; k++) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl('compRef', this.initRefCheckForm());
              compRefGroup.addControl('componentCustomFields',
                this.initclientCustomFieldsForm(this.screeningService.componentList[i].componentCustomFields));
              if (this.screeningService.componentList[i].question.length > 0) {
                compRefGroup.addControl('miscQuestion', this.common.initMiscForm(this.screeningService.componentList[i].question));
              }
            }
          }
          break;
        case this.common.REFERENCE_SELF_EMPLOYED:
          if (this.screeningService.componentList[i].subCompFlag) {

          } else {
            for (let k = 0; k < this.screeningService.componentList[i].noOfComponent; k++) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl('compRef', this.initSelftEmpForm());
              compRefGroup.addControl('componentCustomFields',
                this.initclientCustomFieldsForm(this.screeningService.componentList[i].componentCustomFields));
              if (this.screeningService.componentList[i].question.length > 0) {
                compRefGroup.addControl('miscQuestion', this.common.initMiscForm(this.screeningService.componentList[i].question));
              }
            }
          }
          break;
        case this.common.EMPLOYMENT_SUPERVISOR:
          if (this.screeningService.componentList[i].subCompFlag) {

          } else {
            for (let k = 0; k < this.screeningService.componentList[i].noOfComponent; k++) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl('compRef', this.initEmployeementSupForm(true));
              const comprefGroup = compRefGroup.get('compRef') as UntypedFormGroup;
              compRefGroup.addControl('componentCustomFields',
                this.initclientCustomFieldsForm(this.screeningService.componentList[i].componentCustomFields));
              // comprefGroup.addControl('supervisorDet', this.initsupervisorDetForm());
              if (this.screeningService.componentList[i].question.length > 0) {
                compRefGroup.addControl('miscQuestion', this.common.initMiscForm(this.screeningService.componentList[i].question));
              }
            }
          }
          break;
        case this.common.CRIMINAL_DATABASE:
        case this.common.OFAC_SDN:
          if (this.screeningService.componentList[i].subCompFlag) {
            count = 0;
            for (let a = 0; this.screeningService.componentList[i].screeningSubComponent.length > a; a++) {
              for (let b = 0; this.screeningService.componentList[i].screeningSubComponent[a].noOfComponent > b; b++) {
                const compRefGroup = compArray.controls[count] as UntypedFormGroup;
                compRefGroup.addControl('compRef', this.initCriminalDatabaseForm(this.common.CRIMINAL_DATABASE, true));
                compRefGroup.addControl('componentCustomFields',
                  this.initclientCustomFieldsForm(this.screeningService.componentList[i].componentCustomFields));
                count++;
              }
            }
          } else {
            for (let k = 0; k < this.screeningService.componentList[i].noOfComponent; k++) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl('compRef', this.initCriminalDatabaseForm(this.screeningService.componentList[i].compName.toUpperCase(), false));
              compRefGroup.addControl('componentCustomFields',
                this.initclientCustomFieldsForm(this.screeningService.componentList[i].componentCustomFields));
            }
          }
          break;

        case this.common.CRIMINAL_CHECK_PCC1:
        case this.common.CRIMINAL_CHECK_PCC2:
          if (this.screeningService.componentList[i].subCompFlag) {
            count = 0;
            for (let a = 0; this.screeningService.componentList[i].screeningSubComponent.length > a; a++) {
              for (let b = 0; this.screeningService.componentList[i].screeningSubComponent[a].noOfComponent > b; b++) {
                const compRefGroup = compArray.controls[count] as UntypedFormGroup;
                compRefGroup.addControl('compRef', this.initCriminalCheckPcc2Form());
                compRefGroup.addControl('componentCustomFields',
                  this.initclientCustomFieldsForm(this.screeningService.componentList[i].componentCustomFields));
                if (this.screeningService.componentList[i].question.length > 0) {
                  compRefGroup.addControl('miscQuestion', this.common.initMiscForm(this.screeningService.componentList[i].question));
                }
                count++;
              }
            }
          } else {
            for (let k = 0; k < this.screeningService.componentList[i].noOfComponent; k++) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl('compRef', this.initCriminalCheckPcc2Form());
              compRefGroup.addControl('componentCustomFields',
                this.initclientCustomFieldsForm(this.screeningService.componentList[i].componentCustomFields));
              for (let a = 0; a < this.screeningService.componentList[i].criminalCheckCount; a++) {

                const addRefGrp = compRefGroup.get('compRef') as UntypedFormGroup;
                addRefGrp.addControl('address' + a, this.initCommonAddress(a === 0 ? true : false));
                const addRefFrm = compRefGroup.get('compRef')?.get('address' + a) as UntypedFormGroup;
                // addRefFrm.addControl('periodOfStay', new UntypedFormControl(null, this.userData.applicationId === 3 ? Validators.required : null));
                addRefFrm.addControl('addressTypeLookupId', new UntypedFormControl(0));
                addRefFrm.addControl('addressType', new UntypedFormControl(''));
              }
              if (this.screeningService.componentList[i].question.length > 0) {
                compRefGroup.addControl('miscQuestion', this.common.initMiscForm(this.screeningService.componentList[i].question));
              }
            }
          }
          break;
        case this.common.CRIMINAL_CHECK_PCC3:
        case this.common.CRIMINAL_CHECK_PCC3E:
          if (this.screeningService.componentList[i].subCompFlag) {
            count = 0;
            for (let a = 0; this.screeningService.componentList[i].screeningSubComponent.length > a; a++) {
              for (let b = 0; this.screeningService.componentList[i].screeningSubComponent[a].noOfComponent > b; b++) {
                const compRefGroup = compArray.controls[count] as UntypedFormGroup;
                compRefGroup.addControl('compRef', this.initAddressForm());
                count++;
              }
            }
          } else {
            for (let k = 0; k < this.screeningService.componentList[i].noOfComponent; k++) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl('compRef', this.initCriminalCheckPcc3Form());
              compRefGroup.addControl('componentCustomFields',
                this.initclientCustomFieldsForm(this.screeningService.componentList[i].componentCustomFields));
            }
          }
          break;
        case this.common.PAN_INDIA_ONLINE_COURT_RECORD_VERIFICATION:
          if (this.screeningService.componentList[i].subCompFlag) {
            count = 0;
            for (let a = 0; this.screeningService.componentList[i].screeningSubComponent.length > a; a++) {
              for (let b = 0; this.screeningService.componentList[i].screeningSubComponent[a].noOfComponent > b; b++) {
                const addGroup = compArray.controls[count] as UntypedFormGroup;
                addGroup.addControl('compRef', this.initAddressForm());
                addGroup.addControl('componentCustomFields',
                  this.initclientCustomFieldsForm(this.screeningService.componentList[i].componentCustomFields));
                count++;
              }
            }
          } else {
            for (let c = 0; this.screeningService.componentList[i].noOfComponent > c; c++) {
            }
          }
          break;
        case this.common.EMPHR_EMPSUP:
          if (this.screeningService.componentList[i].subCompFlag) {
          } else {
            for (let k = 0; k < this.screeningService.componentList[i].noOfComponent; k++) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl('compRef', this.initEmpHREmpSupForm(k, this.screeningService.componentList[i].compId));
              const comprefGroup = compRefGroup.get('compRef') as UntypedFormGroup;
              comprefGroup.addControl('supervisorDet', this.initsupervisorDetForm(false));
              compRefGroup.addControl('componentCustomFields',
                this.initclientCustomFieldsForm(this.screeningService.componentList[i].componentCustomFields));
              if (this.screeningService.componentList[i].question.length > 0) {
                compRefGroup.addControl('miscQuestion', this.common.initMiscForm(this.screeningService.componentList[i].question));
              }
            }
          }
          break;
        case this.common.GAP_VERIFICATION:
          if (this.screeningService.componentList[i].subCompFlag) {

          } else {
            for (let k = 0; k < this.screeningService.componentList[i].noOfComponent; k++) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl('compRef', this.initGapVerificationForm());
              compRefGroup.addControl('componentCustomFields',
                this.initclientCustomFieldsForm(this.screeningService.componentList[i].componentCustomFields));
            }
          }
          break;
        case this.common.EMERGENCY_CONTACT_VERIFICATION:
          if (this.screeningService.componentList[i].subCompFlag) {

          } else {
            for (let k = 0; k < this.screeningService.componentList[i].noOfComponent; k++) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl('compRef', this.initEmergencyContactVerificationForm());
              compRefGroup.addControl('componentCustomFields',
                this.initclientCustomFieldsForm(this.screeningService.componentList[i].componentCustomFields));
              if (this.screeningService.componentList[i].question.length > 0) {
                compRefGroup.addControl('miscQuestion', this.common.initMiscForm(this.screeningService.componentList[i].question));
              }
            }
          }
          break;
        case this.common.JUDIS_COURT_RECORD:
          if (this.screeningService.componentList[i].subCompFlag) {

          } else {
            for (let k = 0; k < this.screeningService.componentList[i].noOfComponent; k++) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl('compRef', this.initJudisCourtForm());
              compRefGroup.addControl('componentCustomFields',
                this.initclientCustomFieldsForm(this.screeningService.componentList[i].componentCustomFields));
            }
          }
          break;
        case this.common.BANK_STATEMENT:
          if (this.screeningService.componentList[i].subCompFlag) {

          } else {
            for (let k = 0; k < this.screeningService.componentList[i].noOfComponent; k++) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl('compRef', this.initBankStatementForm());
              compRefGroup.addControl('componentCustomFields',
                this.initclientCustomFieldsForm(this.screeningService.componentList[i].componentCustomFields));
            }
          }
          break;

        case this.common.CV_VALIDATION:
          this.screeningService.cvValidateList = this.screeningService.componentList[i].cvValidationFields;
          if (this.screeningService.componentList[i].subCompFlag) {

          } else {
            for (let k = 0; k < this.screeningService.componentList[i].noOfComponent; k++) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl('compRef', new UntypedFormArray([]));
              if (this.screeningService.componentList[i].cvValidationFields !== null) {
                compRefGroup.addControl('compRefDetail',
                  this.initcvValidation(this.screeningService.componentList[i].cvValidationFields));
              }
              this.createCvValidationForm(compRefGroup.get('compRefDetail') as UntypedFormGroup,
                this.screeningService.componentList[i].cvValidationFields, false);
              this.screeningService.cvValidateList = this.screeningService.componentList[i].cvValidationFields;
            }
          }
          break;
        case this.common.SSN_TRACE:
        case this.common.NATIONWIDE_SEX_OFFENDER_5_YEARS:
        case this.common.CRIMINAL_FEDERAL_NATIONWIDE_5_YEARS:
        case this.common.CRIMINAL_FELONY_MISDEMEANOR_5_YEARS:

          if (this.screeningService.componentList[i].subCompFlag) {

          } else {
            for (let k = 0; k < this.screeningService.componentList[i].noOfComponent; k++) {
              const compRefGroup = compArray.controls[k] as UntypedFormGroup;
              compRefGroup.addControl('compRef', this.initAbroad());
              compRefGroup.addControl('componentCustomFields',
                this.initclientCustomFieldsForm(this.screeningService.componentList[i].componentCustomFields));
            }
          }
          break;
      }
    }
    this.screeningService.gapReason.forEach(element => {
      const gapFormArray = this.fileSubmission.get('gapReason') as UntypedFormArray;
      gapFormArray.push(this.initGapReasonForm(element));
    });
  }
  getstatus(value: any) {

    if (this.screeningService.StatusDeFlag !== true) {
      this.master.GetCountryList().subscribe(res => {
        if (res) {

          this.common.countryList = Object.assign([], res);

        }
      });
      this.master.GetStatesList(0).subscribe(res => {
        if (res) {
          this.common.stateList = Object.assign([], res);
        }
      })

      const eduflag = value.screeningCaseComponent.filter(f => f.compName.toLowerCase() === 'education');
      if (eduflag.length > 0) {
        this.GetInstitutioInfo();
        this.GetInstituteInfo()
        this.getDegreeLkpList();
        this.getUniversity();
        this.GetNotProvidedReasonList();
        this.common.getEducationType();

      }
      const empflag = value.screeningCaseComponent.filter(f => f.compName.toLowerCase() === this.common.EMPLOYMENT_HR.toLowerCase());
      if (empflag.length > 0) {
        this.GetCompanyInfo();

      }
      const databaseFlag = value.screeningCaseComponent.filter(f => f.compName.toLowerCase() === this.common.CRIMINAL_DATABASE.toLowerCase());
      if (databaseFlag.length > 0) {
        this.getDatabase()
        this.screeningService.StatusDeFlag = true;
      }

      const drugFlag = value.screeningCaseComponent.filter(f => f.compName.toLowerCase() === this.common.DRUG_TEST.toLowerCase());
      if (drugFlag.length > 0) {
        this.getdrugStatus()
        this.screeningService.StatusDeFlag = true;
      }
    }
  }
  getdrugStatus() {
    this.master.GetDrugKitList().subscribe(resp => {
      this.screeningService.drugKitList = resp;
    });

  }

  getDatabase() {
    this.screeningService.getDatabaseType().subscribe(res => {
      this.screeningService.DatabaseType = Object.assign([], res);
    });
  }
  getScreeningFormGroup(event: any) {
    this.changeCom = event;
    const formgrp = this.fileSubmission.get('screeningComponent') as UntypedFormArray;
    // if (formgrp.value) {
    //   const fList: any[] = [];
    //   formgrp.value.forEach(ele => {
    //   const newgrp =  ele.component.filter(x => x.screeningComponentInfo.clientApprovalFlag !== true);
    //   if(newgrp.length >0) {
    //   fList.push(newgrp[0]);
    //   }
    //   });
    // }
    if (event.onInit) {
      this.formEnableDisable(event);
    } else {
      const formgrp = this.fileSubmission.get('screeningComponent') as UntypedFormArray;
      const compList = this.screeningService.componentList;
      const index = compList.findIndex(f => f.compName === event.type);
      const filtercomp = compList.find(f => f.compName === event.type);
      if (filtercomp) {
        const compFormGroup = formgrp.controls[index] as UntypedFormGroup;
        const compFormarray = compFormGroup.get('component') as UntypedFormArray;
        const compindex = compFormarray.length;
        const crimeList = compFormarray.value.filter(x => x.screeningComponentInfo.deqcFlag === true && x.screeningComponentInfo.compId === event.compId);
        const deqcFlag = crimeList.length > 0 ? true : false;
        compFormarray.push(this.initCommonFormGroup(event.isSubComp, event.comptype, event.compId, event.subCompId,
          filtercomp.criminalCheckCount, deqcFlag, true, filtercomp.currencyId, compindex, false, filtercomp.compInitiationDate));
        const compRefGroup = compFormarray.controls[compFormarray.length - 1] as UntypedFormGroup;
        switch (filtercomp.compName) {
          case this.common.ONLINE_CRC_INTERNAL:
          case this.common.ONLINE_CRC:
          case this.common.CRIMINAL_COURT_RECORD:
          case this.common.CriminalCheckGap:
            compRefGroup.addControl('compRef', this.initCrcForm());
            break;
          case this.common.DRUG_TEST:
            compRefGroup.addControl('compRef', this.initDrugForm());
            break;
          case this.common.NDOT_DRUG_SCREEN:
            compRefGroup.addControl('compRef', this.initNdotDrugForm());
            break;
          case this.common.EDUCATION:
            compRefGroup.addControl('compRef', this.initEducationForm(compFormarray.length - 1, event.compId));
            compRefGroup.addControl('componentCustomFields',
              this.initclientCustomFieldsForm(filtercomp.componentCustomFields));
            if (filtercomp.question.length > 0) {
              compRefGroup.addControl('miscQuestion', this.common.initMiscForm(filtercomp.question));
            }
            break;
          case this.common.EMPLOYMENT_HR:
            compRefGroup.addControl('compRef', this.initEmployerForm(compFormarray.length - 1, event.compId));
            const compRef = compRefGroup.get('compRef') as UntypedFormGroup;
            compRefGroup.addControl('componentCustomFields',
              this.initclientCustomFieldsForm(filtercomp.componentCustomFields));
            if (this.screeningDetails1.invitationFlag === true) {
              compRef.addControl('supervisorDet', this.initEmpSupervisorForm(true));
            }
            if (filtercomp.question.length > 0) {
              compRefGroup.addControl('miscQuestion', this.common.initMiscForm(filtercomp.question));
            }
            break;
          case this.common.EMPLOYMENT_UAN:
            compRefGroup.addControl('compRef', this.initEmployerForm(compFormarray.length - 1, event.compId));
            compRefGroup.addControl('componentCustomFields',
              this.initclientCustomFieldsForm(filtercomp.componentCustomFields));
            if (filtercomp.question.length > 0) {
              compRefGroup.addControl('miscQuestion', this.common.initMiscForm(filtercomp.question));
            }
            break;
          case this.common.SOCIAL_MEDIA:
            compRefGroup.addControl('compRef', this.initSocialMediaForm());
            if (filtercomp.question.length > 0) {
            }
            break;
          case this.common.ADDRESS_GEO:
          case this.common.ADDRESS:
            compRefGroup.addControl('compRef', this.initAddressForm());
            break;
          case this.common.EMPLOYMENT_SUPERVISOR:
            compRefGroup.addControl('compRef', this.initEmployeementSupForm(true));
            if (filtercomp.question.length > 0) {
              compRefGroup.addControl('miscQuestion', this.common.initMiscForm(filtercomp.question));
            }
            break;
          case this.common.CRIMINAL_CHECK_PCC1:
          case this.common.CRIMINAL_CHECK_PCC2:
            compRefGroup.addControl('compRef', this.initCriminalCheckPcc2Form());
            for (let a = 0; a < filtercomp.criminalCheckCount; a++) {

              const addRefGrp = compRefGroup.get('compRef') as UntypedFormGroup;
              addRefGrp.addControl('address' + a, this.initCommonAddress(a === 0 ? true : false));
              const addRefFrm = compRefGroup.get('compRef')?.get('address' + a) as UntypedFormGroup;
              addRefFrm.addControl('periodOfStay', new UntypedFormControl(null));
              addRefFrm.addControl('periodOfStayTo', new UntypedFormControl(null));
              addRefFrm.addControl('addressTypeLookupId', new UntypedFormControl(0));
              addRefFrm.addControl('addressType', new UntypedFormControl(''));
            }
            // compRefGroup.addControl('periodOfStay', new UntypedFormControl(null));
            // compRefGroup.addControl('addressTypeLookupId', new UntypedFormControl(0));
            if (filtercomp.question.length > 0) {
              compRefGroup.addControl('miscQuestion', this.common.initMiscForm(filtercomp.question));
            }
            break;
          case this.common.CRIMINAL_CHECK_PCC3:
          case this.common.CRIMINAL_CHECK_PCC3E:
            compRefGroup.addControl('compRef', this.initCriminalCheckPcc3Form());
            break;
          case this.common.PAN_INDIA_ONLINE_COURT_RECORD_VERIFICATION:
            compRefGroup.addControl('compRef', this.initAddressForm());
            break;
          case this.common.OIG:
            compRefGroup.addControl('compRef', this.initOigForm());
            break;
          case this.common.FACISLevel1:
            compRefGroup.addControl('compRef', this.initFACIS1Form());
            break;
          case this.common.FACISLevel2:
            compRefGroup.addControl('compRef', this.initFACIS2Form());
            break;
          case this.common.FACISLevel3:
            compRefGroup.addControl('compRef', this.initFACIS3Form());
            break;
          case this.common.FACIS1M:
            compRefGroup.addControl('compRef', this.initFACISMForm());
            break;
          case this.common.TENNESSEE:
            compRefGroup.addControl('compRef', this.initTENNESSEEForm());
            break;
          case this.common.EMPHR_EMPSUP:
            compRefGroup.addControl('compRef', this.initEmpHREmpSupForm(compFormarray.length + 1, event.compId));
            if (filtercomp.question.length > 0) {
              compRefGroup.addControl('miscQuestion', this.common.initMiscForm(filtercomp.question));
            }
            break;
          case this.common.GAP_VERIFICATION:
            compRefGroup.addControl('compRef', this.initGapVerificationForm());
            break;
          case this.common.EMERGENCY_CONTACT_VERIFICATION:
            compRefGroup.addControl('compRef', this.initEmergencyContactVerificationForm());
            if (filtercomp.question.length > 0) {
              compRefGroup.addControl('miscQuestion', this.common.initMiscForm(filtercomp.question.length));
            }
            break;
          case this.common.JUDIS_COURT_RECORD:
            compRefGroup.addControl('compRef', this.initJudisCourtForm());
            break;
          case this.common.BANK_STATEMENT:
            compRefGroup.addControl('compRef', this.initBankStatementForm());
            break;
          case this.common.COMPANY_SITE_VISIT:
            compRefGroup.addControl('compRef', this.initCompanySiteVisitForm());
            if (filtercomp.question.length > 0) {
              compRefGroup.addControl('miscQuestion', this.common.initMiscForm(filtercomp.question.length));
            }
            break;
          case this.common.REFERENCE_CHECK:
            compRefGroup.addControl('compRef', this.initRefCheckForm());
            if (filtercomp.question.length > 0) {
              compRefGroup.addControl('miscQuestion', this.common.initMiscForm(filtercomp.question));
            }
            break;
          case this.common.REFERENCE_SELF_EMPLOYED:
            compRefGroup.addControl('compRef', this.initSelftEmpForm());
            if (filtercomp.question.length > 0) {
              compRefGroup.addControl('miscQuestion', this.common.initMiscForm(filtercomp.question));
            }
            break;
          case this.common.CRIMINAL_DATABASE:
            compRefGroup.addControl('compRef', this.initCriminalDatabaseForm(this.common.CRIMINAL_DATABASE, true));
          case this.common.OFAC_SDN:
            compRefGroup.addControl('compRef', this.initCriminalDatabaseForm(this.common.OFAC_SDN, false));
            break;
          case this.common.LICENSE:
            compRefGroup.addControl('compRef', this.initLicenseForm());
            break;
          case this.common.CREDIT_VERIFICATION:
            compRefGroup.addControl('compRef', this.initCredForm());
            if (filtercomp.question.length > 0) {
              compRefGroup.addControl('miscQuestion', this.common.initMiscForm(filtercomp.question.length));
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
      const formArray = this.fileSubmission.get('screeningComponent') as UntypedFormArray;
      const compFormGroup = formArray.controls[index] as UntypedFormGroup;
      const compFormarray = compFormGroup.get('component') as UntypedFormArray;
      // tslint:disable-next-line:prefer-for-of

      for (let i = 0; i < compFormarray.length; i++) {
        const specFormGroup = compFormarray.controls[i] as UntypedFormGroup;
        if (specFormGroup.valid) {
          specFormGroup.get('active')?.setValue(true);
        } else {
          specFormGroup.get('active')?.setValue(false);
        }

      }

    });
  }
  getSearchComponents() {
    this.screeningService.getScreeningEntryDetails(2).subscribe(resp => {
      if (resp) {
      }
    });
  }
  rejectScreeningFileSubmission() {
    if (this.rejectComments.valid) {
      this.dialog.closeAll();
      const formData = new FormData();
      const type = 'Reject';
      this.preQCRejectVm.comments = this.rejectComments.value;
      this.preQCRejectVm.loggedIn = this.userData.userId;
      this.preQCRejectVm.screeningCompId = this.screeningCompId === 0 ? null : this.screeningCompId;
      this.preQCRejectVm.screeningId = this.screeningDetails1.screening.screeningId;
      this.preQCRejectVm.type = this.singleCompReject ? 'ScreeningComponent' : 'Screening';
      formData.append('RejectDetails', JSON.stringify(this.preQCRejectVm));
      this.screeningService.addPreQCScreeningDetails(formData, type).subscribe(resp => {
        if (resp) {
          this.showNotification('success', 'success', 'Reject successfully');
          if (!this.singleCompReject) {
            this.backToList();
          } else {
            this.getAssignedCaseDetails(this.caseNo);
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
      this.previewStep = false
      this.nxtstep = false
      return
    }
    this.lastFlag = e;
    if (this.lastFlag === "last") {
      this.previewStep = true
      this.nxtstep = false
    }
    else if (this.lastFlag === "first") {
      this.previewStep = false
      this.nxtstep = true
    }
    else {
      this.previewStep = true
      this.nxtstep = true
    }
  }
  rejectPreQC() {
    this.dialog.open(this.dlgReject,
      { width: '700px', disableClose: true, });
  }
  formEnableDisable(event?) {
    const formgrp = this.fileSubmission.get('screeningComponent') as UntypedFormArray;
    const fulldata = this.fileSubmission.getRawValue();
    const compList = this.screeningService.componentList;

    compList.forEach((com, index) => {
      const compFormGroup = formgrp.controls[index] as UntypedFormGroup;
      const compFormarray = compFormGroup.get('component') as UntypedFormArray;
      for (let i = 0; i < compFormarray.length; i++) {

        const spectFormGroup = compFormarray.controls[i] as UntypedFormGroup;
        const data = spectFormGroup.getRawValue();
        if (this.userData.applicationId === 3) {
          if (data.screeningComponentInfo.notApplicableFlag === true) {
            if (data.screeningComponentInfo.screeningCompId > 0) {
              // if (!spectFormGroup.disabled) {
              spectFormGroup.get('active')?.setValue(true);
              const NspectFormGroup = spectFormGroup.get('screeningComponentInfo') as UntypedFormArray;
              setTimeout(() => {
                spectFormGroup.disable();
                NspectFormGroup.get('remark')?.enable();
                NspectFormGroup.get('notApplicableFlag')?.enable();

              }, 0);
              // }
            } else {
              // if (!spectFormGroup.disabled) {
              const screeningForm = spectFormGroup.get('screeningComponentInfo');
              setTimeout(() => {
                spectFormGroup.get('compRef')?.disable();
                spectFormGroup.get('screeningInsufficiency')?.disable();
                screeningForm.get('componentDocument')?.disable();
                screeningForm.get('requestedDate')?.disable();
                screeningForm.get('screenStatusId')?.disable();
                screeningForm.get('screeningId')?.disable();
                screeningForm.get('vendorId')?.disable();
                // screeningForm.get('remark')?.disable();
                screeningForm.get('currencyId')?.disable();
              }, 0);
              // }
            }

          }
        } else {
          const isFresher = this.componentName.toLowerCase() === this.common.EMPLOYMENT_HR.toLowerCase() && data.compRef && data.compRef.fresherFlag &&
            data.compRef.fresherFlag === true
          if (data.screeningComponentInfo.notApplicableFlag === true || (data.screeningComponentInfo.clientApprovalFlag === true) || (isFresher === true)) {
            const valList = this.common.CloneArray(this.screeningService.compFormArray);
            const screeningForm = spectFormGroup.get('screeningComponentInfo');
            // if (data.screeningComponentInfo.screeningCompId > 0) {
            setTimeout(() => {
              spectFormGroup.get('compRef')?.disable();
              if (isFresher === true) {
                spectFormGroup.get('compRef')?.get('fresherFlag')?.enable();
              }
              spectFormGroup.get('screeningInsufficiency')?.disable();
              screeningForm.get('componentDocument')?.disable();
              screeningForm.get('requestedDate')?.disable();
              screeningForm.get('screenStatusId')?.disable();
              screeningForm.get('screeningId')?.disable();
              screeningForm.get('vendorId')?.disable();
              if (data.screeningComponentInfo.notApplicableFlag !== true) {
                screeningForm.get('remark')?.disable();
              }
              screeningForm.get('currencyId')?.disable();
              // spectFormGroup.disable();
              this.screeningService.compFormArray = valList;
            }, 0);
            // }
          } else {
            spectFormGroup.enable();
          }
        }
        if (spectFormGroup && com.compName === this.common.PASSPORT) {
          if (spectFormGroup['controls']['compRef']['controls']['expiryDate'].value) {
            const val = new Date(spectFormGroup['controls']['compRef']['controls']['expiryDate'].value);
            spectFormGroup['controls']['compRef']['controls']['expiryDate'].setValue(new DatePipe('en-Us').transform(val, 'dd/MMM/yyyy'));
            const val1 = spectFormGroup['controls']['compRef']['controls']['expiryDate'].value.toUpperCase();
            spectFormGroup['controls']['compRef']['controls']['expiryDate'].setValue(val1);
          }
        }
      }
    });

    if (event && event.compName) {
      const compIndex = compList.findIndex(x => x.compName.toUpperCase() === event.compName.toUpperCase());
      const compFormGroup = formgrp.controls[compIndex] as UntypedFormGroup;
      const compFormarray = compFormGroup.get('component') as UntypedFormArray;
      for (let i = 0; i < compFormarray.length; i++) {
        const spectFormGroup = compFormarray.controls[i] as UntypedFormGroup;
        if (this.common.EDUCATION === event.compName) {
          const insValue = this.screeningService.institutionList.find(x => x.name ===
            spectFormGroup.get('compRef.institutionName')?.value);
          if (insValue) {
            setTimeout(() => {
              spectFormGroup.get('compRef.address')?.disable();
            }, 0);
          }
        }
        if (this.common.EMPLOYMENT_HR === event.compName) {
          const insValue = this.screeningService.employerList.find(x => x.name ===
            spectFormGroup.get('compRef.employerName')?.value);
          if (insValue) {
            setTimeout(() => {
              spectFormGroup.get('compRef.address')?.disable();
            }, 0);
          }
        }
      }
    }
  }
  compSelected(data: any, index: number) {
    if (this.viewScreeningComp) {
      this.viewScreeningComp.getComponentForm(data, index);
    }
  }

  initCommonNAddress(required = true): UntypedFormGroup {
    const othervalidation = [
      Validators.required,
      this.validatedateInputStayFromwithBirt,
    ];
    const validation = [Validators.required, this.validatedateInputwitTilldate];

    return new UntypedFormGroup({
      addressId: new UntypedFormControl(0),
      addLine1: new UntypedFormControl("", required ? Validators.required : null),
      addLine2: new UntypedFormControl(null),
      addLine3: new UntypedFormControl(null),
      cityId: new UntypedFormControl(null),
      districtId: new UntypedFormControl(null),
      stateId: new UntypedFormControl("", required ? Validators.required : null),
      countryId: new UntypedFormControl("", required ? Validators.required : null),
      // postalCode: new UntypedFormControl('', required ? Validators.required : null),
      postalCode: new UntypedFormControl(null),
      locationId: new UntypedFormControl(null),
      country: new UntypedFormControl(""),
      state: new UntypedFormControl(""),
      district: new UntypedFormControl(""),
      city: new UntypedFormControl(""),
      place: new UntypedFormControl(""),

    });
  }

  ngOnDestroy() {
    this.common.addressflag = false;
    this.screeningService.screenCaseId = 0;
    this.screeningService.compData = null;
    this.screeningService.caseSubmissionList = null;
    this.screeningService.screeningDetail = null;
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
    this.common.candidateName = '';
    // this.screeningService.caseFlagType = '';
    // this.screeningService.caseFlag = true;
  }

  goToStepCom(data?: any) {
    const tets = this.viewScreeningComp.selectedComponent;
    this.screeningService.compName = tets.compName;
    const compList = this.screeningService.componentList;
    let noofComp = 0;
    const comindex = compList.findIndex(f => f.compName.toUpperCase() === tets.compName.toUpperCase())
    const selectedChecks = compList.find(f => f.compName.toUpperCase() === tets.compName.toUpperCase())
    if (selectedChecks.subCompFlag && this.applicationId != 3) {
      noofComp = selectedChecks.screeningSubComponent.length;

    } else if (selectedChecks.subCompFlag && this.applicationId === 3) {

      noofComp = selectedChecks.screeningSubComponent.filter(f => f.subCompName !== 'Current Address').length;

    } else {
      noofComp = selectedChecks.noOfComponent;
    }
    if (data === 'nxt') {
      this.screenRespFlag = true;
      const type = compList[comindex].compName.toUpperCase();
      const formgroup = this.viewScreeningComp.getformGroup(type, this.viewScreeningComp.currentCompTabIndex) as UntypedFormGroup;
      const docForm = formgroup.get('screeningComponentInfo.componentDocument') as UntypedFormControl;

      if (type.toLowerCase() === this.common.EMPLOYMENT_HR.toLowerCase()) {
        this.fresherFlag = formgroup.get('compRef.fresherFlag')?.value;
      }

      if (formgroup.valid) {
        this.snFlag = true;
      }

      //if(formgroup.valid || formgroup.disabled ){
      const indexc = this.viewScreeningComp.currentCompTabIndex;
      const index = comindex
      const indexs = index + 1;
      this.viewScreeningComp.submitComp(compList[index].compName, this.viewScreeningComp.currentCompTabIndex)
      this.popHide = false

      // }

    }

  }
  createPosForm(formArray: UntypedFormArray, docData = []) {
    if (docData && docData.length > 0) {
      while (formArray.length !== 0) {
        formArray.removeAt(0);
      }
      if (docData && docData.length > 0) {
        for (let i = 0; i < docData.length; i++) {

          formArray.push(
            this.fb.group({
              screeningCompId: new UntypedFormControl(docData[i].screeningCompId),
              reportFlag: new UntypedFormControl(false),
              addressId: new UntypedFormControl(docData[i].addressId),
              periodOfStay: new UntypedFormControl(docData[i].periodOfStay),
              periodOfStayTo: new UntypedFormControl(docData[i].periodOfStayTo),
              addressPosId: new UntypedFormControl(docData[i].addressPosId),
              validationString: new UntypedFormControl([
                "NOT PROVIDED",
                "Not Provided",
                "SINCE BIRTH",
                "TILL DATE",
              ]),
            })
          );
        }
      }
    }
  }
  public opengapAlertDialog(bodyText: any) {
    const popupData = {
      action: this.common.ALERT,
      headerText: 'Component Remarks',
      bodyText
    };
    const dialogRef = this.dialog.open(CommonAlertsComponent, {
      width: '320px',
      data: popupData,
      disableClose: true
    });
  }

  drawerToggle() {
    this.drawer.toggle()
  }
  downloadSupportingDoc() {
    if (this.downloadflag === true) {
      const docList: any[] = [];
      this.data = this.screeningDetails1.screeningComponent[0];
      if (this.screeningDetails1.document.length > 0) {
        this.screeningDetails1.document.forEach(docele => {
          if (docele.screeningDocId > 0) {
            docList.push(docele.screeningDocId);
          }
        })
      }
      if (this.screeningDetails1.screeningComponent[0].component.length > 0) {
        this.screeningDetails1.screeningComponent.forEach(ele => {
          ele.component.forEach(el => {
            if (el.screeningComponentInfo.componentDocument.length > 0) {
              el.screeningComponentInfo.componentDocument.forEach(docele => {
                if (docele.screeningDocId > 0) {
                  docList.push(docele.screeningDocId);
                }
              });
            }
          });
        });
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < docList.length; i++) {
          this.screeningService.downloadScreeningDocument(docList[i]).subscribe(resp => {
            setTimeout(() => {
              this.common.downloadDocument(0, resp.document, resp.fileName);
            }, 0);
          });
        }
        // if (this.screeningDetails.document.length > 0) {
        //   this.screeningDetails.document.forEach((ele, i) => {
        //     this.screeningService.downloadScreeningDocument(ele.screeningDocId).subscribe(resp => {
        //       setTimeout(() => {
        //         this.common.downloadDocument(0, resp.document, resp.fileName);
        //         this.common.downloadDocument(ele.screeningDocId, ele.document, ele.fileName);
        //       });
        //     });
        //   });
        // }
      }
    }
  }
}
