
import { Component, OnInit, ElementRef, ViewChild, TemplateRef } from '@angular/core';
import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';
// import { DataTable, Dialog, MessageService } from 'primeng/primeng';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { ResearchEmpQues, ResearchSubDetTransVm } from 'src/app/common-methods/models/researchQuesAns';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl, UntypedFormArray } from '@angular/forms';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { Router } from '@angular/router';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { ReviewComponent } from '../review/review.component';
import { VerificationService } from 'src/app/common-methods/services/verification.service';
import { MatDialog } from '@angular/material/dialog';
// import { MatChipsModule, MatChipInputEvent } from '@angular/material/chips';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { MatChipsModule, MatChipInputEvent } from '@angular/material/chips';
import { SelectItem } from 'primeng/api';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { VerificationToCAMApprovalVM } from '../review/review.component';

@Component({
  standalone: false,
  selector: 'app-color-code-approval',
  templateUrl: './color-code-approval.component.html',
  styleUrls: ['./color-code-approval.component.css']
})
export class ColorCodeApprovalComponent implements OnInit {
  screeningId: number = 0;
  selectValue = null;
  @ViewChild('reject', { static: true }) reject;
  candidateDet: any;
  rejectComments = new UntypedFormControl();
  @ViewChild('approveConfirm', { static: true }) approveConfirm: TemplateRef<any>;
  approveContent: string = '';
  @ViewChild('bulkApproveConfirm', { static: true }) bulkApproveConfirm: TemplateRef<any>;
  @ViewChild('rejectConfirm', { static: true }) rejectConfirm: TemplateRef<any>;
  @ViewChild('sentToClientConfirm', { static: true }) sentToClientConfirm: TemplateRef<any>;
  verificationToCAMApprovalVM = new VerificationToCAMApprovalVM();
  verificationCamApVm = new verificationCamApVM()
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    sanitize: false,
    toolbarPosition: 'top',

  };
  itemperpage: any;
  screeningCompId = 0;
  size: any;
  @ViewChild('mailDialog', { static: true }) mailDialog: TemplateRef<any>;
  EmailTemplate: any;
  templateName: string = '';
  addMailCtrl: UntypedFormControl;
  checkFlag = true;
  ccFlag: boolean;
  ccMailCtrl: UntypedFormControl;
  tovalue: any;
  ccvalue: any;
  toList: any[] = [];
  ccList: any[] = [];
  htmlContent: any
  isMailIdSave = false;
  pdfType = '';
  previewFlag: boolean = false;
  clientCategoryId: number = 0;
  getFinalReportFlag: boolean = false;
  isSuspicious: boolean = false;
  qcDetails: any;
  qcApproveForm: UntypedFormGroup;
  colorStatus: string;
  findEmpList: any[] = [];
  stopcolorCode: boolean = false;
  findCurrentEmpList: any[] = [];
  findPreviousEmpList: any[] = [];
  findcurrentEmpList: any;
  responseDatam: any;
  @ViewChild('review', { static: true }) reviewComp: ReviewComponent;
  breadcrumbFlags = new BreadcrumbFlags();
  routePath = 'Dashboard / Color Code Approval';
  userData: any;
  screenAuth: any = {};
  @ViewChild('dt', { static: false }) dt!: Table;
  @ViewChild('global', { static: true }) global!: ElementRef;
  displayedColumns = [
    { field: 'select', header: 'Select' },
    { field: 'clientRefNo', header: 'Client Ref No' },
    { field: 'verificationId', header: 'Verification ID' },
    { field: 'clientName', header: 'Client Name' },
    { field: 'siteName', header: 'Site Name' },
    { field: 'colorCode', header: 'Color Code' },
    { field: 'caseStatus', header: 'Case Status' },
    { field: 'submittedDate', header: 'Submitted Date' },
    { field: 'remarks', header: 'Remark' },
    { field: 'action', header: 'Action' },
  ];
  frozenCols = [
    { field: 'select', header: 'Select' }];
  totalpages: number;
  currentPage = 1;
  tempCurrentPage = 1;
  menubar = [{ menuName: 'RECEIVED FROM VE' }, { menuName: 'SEND TO CLIENT' }];
  showFlag = false;
  subDetails: any[] = [];
  tabIndex = 0;
  reserchEmpQues = new ResearchEmpQues();
  QAList: any = [];
  QAFormGroup: UntypedFormGroup;
  qaCheckFlag = new UntypedFormControl(true);
  questionControl!: AutoCompleteDropDown;
  optionControl!: AutoCompleteDropDown;
  addFlag: boolean;
  fullOptionList: any[] = [];
  ansQuesList: any[] = [];
  optionList: any[] = [];
  removable = true;
  addOnBlur = true;
  ClosureApprovalDetailVm: any;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  SendCaseMailList: sendverification;
  constructor(public verification: VerificationService, public master: MasterService, public screeningService: ScreeningService, public fb: UntypedFormBuilder, public common: CommonService, private message: MessageService,
    private authservice: AuthService, public dialog: MatDialog,
    private router: Router
  ) {
    this.addMailCtrl = new UntypedFormControl(null, [Validators.pattern(this.common.EmailRegX)]);
    this.ccMailCtrl = new UntypedFormControl(null, [Validators.pattern(this.common.EmailRegX)]);
  }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.SendCaseMailList = new sendverification();
    this.SendCaseMailList.discloseClientFlag = false;
    //Added By Megala -for enable /Disable icon flag getting -10/06/2024
    this.screenAuth = this.authservice.getScreenAuth(this.router.url);
    this.initpreviewFormGroup();
    this.getSubDetails();
    this.getQASubdetail();
    this.pdfType = this.authservice.getpdfType('pdfType');
    this.itemperpage = 10;
  }
  initFormGroup() {
    this.QAFormGroup = this.fb.group({
      questionId: [, Validators.required],
      options: this.fb.array([this.initOptionForm()]),
      active: [true],
      logginId: []
    });
    this.questionControl = new AutoCompleteDropDown('Question Name', 'questionId', 'questionId', 'questionName', this.ansQuesList,
      '', this.QAFormGroup, false, false, true);
    const val = this.QAFormGroup.get('options') as UntypedFormArray;
    const frmGroup = val.controls[0] as UntypedFormGroup;
  }
  initOptionForm(): UntypedFormGroup {
    return this.fb.group({
      answerId: [],
      answerName: [],
      optionId: [0],
      optionName: [''],
      progressBarValue: [],
      detAvailable: [],
      subDetId: [],
      subDetail: [null],
      displayOrder: [],
      active: [],
    });
  }
  getformgroup() {
    return (this.QAFormGroup.get('options') as UntypedFormArray).controls;
  }
  getSubDetails() {
    this.master.GetResearchSubDetailLookUp().subscribe(resp => {
      if (resp) {
        this.subDetails = resp;
      }
    });
  }
  getQASubdetail() {
    this.QAList = [];
    this.ansQuesList = [];
    if ((this.tabIndex === 0 && this.showFlag !== true)) {
      this.userData.camApprovalType = this.common.RECEIVED_FROM_VE;
      this.master.GetClosureAdviceApprovalDetail(this.userData).subscribe(resp => {
        if (resp) {
          this.QAList = resp;

        }
      });
    }
    if ((this.tabIndex === 1 && this.showFlag === false)) {
      this.userData.camApprovalType = this.common.SEND_TO_CLIENT;
      this.master.GetClosureAdviceApprovalDetail(this.userData).subscribe(resp => {
        if (resp) {
          this.QAList = resp;
        }
      });
    }
    //  this.questionControl = new AutoCompleteDropDown('Question Name', 'questionId', 'questionId', 'questionName', this.ansQuesList,
    //    '', this.QAFormGroup, false, false, true);
  }
  qaChange(ind: any) {
    this.tabIndex = ind;
    this.getQASubdetail();
  }
  addQA() {
    this.tabIndex = 0;
    this.initFormGroup();
    this.addFlag = true;
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.showFlag = !this.showFlag;
  }
  getOptions(e: any) {
    this.optionList = [];
    this.initFormGroup();
    this.QAFormGroup.get('questionId')?.setValue(e);
    if (e) {
      const quesList = this.QAList.filter(x => x.questionId === e);
      if (quesList[0].options !== null) {
        this.optionList = quesList[0].options;
        if (this.optionList.length > 0) {
          this.optionList.forEach((ele, i) => {
            const opt = this.QAFormGroup.get('options') as UntypedFormArray;
            opt.push(this.initOptionForm());
            const frmGroup = opt.controls[i] as UntypedFormGroup;
            frmGroup.get('answerName')?.setValue(ele.optionName);
            frmGroup.get('answerId')?.setValue(ele.answerId);
            frmGroup.get('optionId')?.setValue(ele.optionId);
            frmGroup.get('optionName')?.setValue(ele.optionName);
            frmGroup.get('progressBarValue')?.setValue(ele.progressBarValue);
            frmGroup.get('detAvailable')?.setValue(ele.detAvailable);
            frmGroup.get('subDetId')?.setValue(ele.subDetId);
            frmGroup.get('active')?.setValue(true);
            frmGroup.get('displayOrder')?.setValue(ele.displayOrder);
          });
          (this.QAFormGroup.get('options') as UntypedFormArray).controls.pop();
        }
      }
    }
  }
  typeChange() {
    this.initFormGroup();
  }

  saveQA() {
    this.QAFormGroup.value.options.forEach((element, i) => {
      const opt = this.QAFormGroup.get('options') as UntypedFormArray;
      const subfrmGroup = opt.controls[i] as UntypedFormGroup;
      subfrmGroup.removeControl('answerName');
      if (subfrmGroup.value.subDetail === null || subfrmGroup.value.subDetail.length === 0) {
        subfrmGroup.get('subDetail')?.setValidators(Validators.required);
        subfrmGroup.get('subDetail')?.updateValueAndValidity();
      }
    });
    const reserchQues = this.QAFormGroup.value;
    this.reserchEmpQues.logginId = this.userData.userId;
    if (this.QAFormGroup.valid) {
      if (reserchQues.options.length > 0 && reserchQues.options !== null) {
        reserchQues.options.forEach(ele => {
          let subList: any[] = [];
          if (ele.subDetail !== null && ele.subDetail.length > 0) {
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < ele.subDetail.length; i++) {
              const obj: ResearchSubDetTransVm = {
                subDetTransId: ele.subDetail[i].loggedIn,
                lookUpId: ele.subDetail[i].lookUpId,
                lookUpName: ele.subDetail[i].lookUpName,
                displayOrder: 0,
                active: ele.subDetail[i].active
              };
              subList.push(obj);
            }
            ele.subDetail = subList;
          }
        });
      }
      this.reserchEmpQues = reserchQues;
      if (this.qaCheckFlag.value === true) {
        this.master.AddEmployeeResearchQuestionAnswerSubDetail(this.reserchEmpQues).subscribe(resp => {
          if (resp === true) {
            this.showTopCenter('success', 'Success Message', 'Saved Successfully');
            this.getQASubdetail();
            this.closeForm();
          }
        });
      }
      if (this.qaCheckFlag.value === false) {
        this.master.AddInstitutionResearchQuestionAnswerSubDetail(this.reserchEmpQues).subscribe(resp => {
          if (resp === true) {
            this.showTopCenter('success', 'Success Message', 'Saved Successfully');
            this.getQASubdetail();
            this.closeForm();
          }
        });
      }
    } else {
      this.QAFormGroup.markAsTouched();
    }
  }
  editQA(data: any) {
    this.initFormGroup();
    this.optionList = [];
    this.qaCheckFlag.setValue(data.typeFlag);
    this.questionControl = new AutoCompleteDropDown('Question Name', 'questionId', 'questionId', 'questionName', this.ansQuesList,
      '', this.QAFormGroup, false, false, true);
    if (data.options !== null) {
      this.QAFormGroup.patchValue(data);
      if (data.questionId) {
        const quesList = this.QAList.filter(x => x.questionId === data.questionId);
        if (quesList[0].options !== null) {
          this.optionList = quesList[0].options;
          if (this.optionList.length > 0) {
            this.optionList.forEach((ele, i) => {
              const opt = this.QAFormGroup.get('options') as UntypedFormArray;
              opt.push(this.initOptionForm());
              const frmGroup = opt.controls[i] as UntypedFormGroup;
              let editList: any[] = [];
              if ((ele.subDetail && ele.subDetail.length > 0) || ele.subDetail !== null) {
                ele.subDetail.forEach((element) => {
                  const subEditList = element;
                  const dataList = this.subDetails.filter(x => x.lookUpName === subEditList.lookUpName);
                  if (dataList.length > 0) {
                    dataList[0].loggedIn = element.subDetTransId;
                    editList.push(dataList[0]);
                  }
                });
                frmGroup.get('subDetail')?.setValue(editList);
              }
              frmGroup.get('answerName')?.setValue(ele.optionName);
              frmGroup.get('answerId')?.setValue(ele.answerId);
              frmGroup.get('optionId')?.setValue(ele.optionId);
              frmGroup.get('optionName')?.setValue(ele.optionName);
              frmGroup.get('progressBarValue')?.setValue(ele.progressBarValue);
              frmGroup.get('detAvailable')?.setValue(ele.detAvailable);
              frmGroup.get('subDetId')?.setValue(ele.subDetId);
              frmGroup.get('active')?.setValue(true);
              frmGroup.get('displayOrder')?.setValue(ele.displayOrder);
            });
            (this.QAFormGroup.get('options') as UntypedFormArray).controls.pop();
          }
        }
      }
      this.addFlag = false;
      this.breadcrumbFlags = this.common.breadcrumbFlags();
      this.breadcrumbFlags.btnResetTbl = false;
      this.breadcrumbFlags.btnAdd = false;
      this.breadcrumbFlags.btnSave = true;
      this.breadcrumbFlags.btnReset = true;
      this.breadcrumbFlags.btnBack = true;
      this.showFlag = true;
    } else {
      this.showTopCenter('warn', 'Alert Message', 'It does not contain Answers');
    }
  }
  closeForm() {
    this.tabIndex = 0;
    this.previewFlag = false;
    this.qaCheckFlag.setValue(true);
    this.showFlag = false;
    this.addFlag = true;
    this.getQASubdetail();
    this.breadcrumbFlags.btnAdd = true;
    this.breadcrumbFlags.btnSave = false;
    this.breadcrumbFlags.btnReset = false;
    this.breadcrumbFlags.btnBack = false;
    this.breadcrumbFlags.btnResetTbl = true;
  }
  resetTbl() {
    this.dt.reset();
    this.global.nativeElement.value = '';
  }
  resetForm() {
    this.QAFormGroup.reset();
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
  initpreviewFormGroup() {
    this.qcApproveForm = this.fb.group({
      rejectFlag: [false],
      approvedFlag: [false],
      screeningCompId: [0],
      screeningId: [0],
      finalQcFlag: [false],
      qcCompTransId: [0],
      finalQcTransId: [1],
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
  getIndividualReprt(screeningId, screeningCompId, clientId, reportType, cliencatId, rowData) {

    this.clientCategoryId = cliencatId;
    this.screeningId = screeningId;
    this.screeningCompId = screeningCompId;
    this.findEmpList = [];
    this.selectValue = rowData;
    this.findCurrentEmpList = [];
    this.findPreviousEmpList = [];
    this.verification.reportType = reportType;
    this.findEmpList = [];
    this.findPreviousEmpList = [];
    this.verification.reportType = reportType;
    this.verification.GetResponseDocument(0, screeningCompId, 'preview').subscribe(res => {
      this.previewFlag = true;
      this.candidateDet = res.candidateDetail;
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
        // if (compId === this.common.EMPLOYMENT_HRId) {
        //   if (this.responseDatam[0].component[0].employeeApplicantDet.forResearchStatus ===
        //     this.common.suspicious) {
        //     this.isSuspicious = true;
        //   }

        // } else if (compId === this.common.CURRENT_EMPLOYMENT_HRId) {
        //   if (this.responseDatam[0].component[0].currentemployeeApplicantDet.forResearchStatus ===
        //     this.common.suspicious) {
        //     this.isSuspicious = true;
        //   }

        // }
        // else if (this.qcDetails.compId === this.common.PREVIOUS_EMPLOYMENT_HRId) {
        //   if (this.responseDatam[0].component[0].previousemployeeApplicantDet.forResearchStatus ===
        //     this.common.suspicious) {
        //     this.isSuspicious = true;
        //   }

        // }
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
  showall() {
    if (this.QAList.length > 0) {
      this.itemperpage = this.QAList.length;
    }
  }
  approveForm() {

  }

  openUploadDoc(event: any) {

    for (let i = 0; i < event.target.files.length; i++) {

      const mailDocumemtnVm: MailDocument = {
        fileName: event.target.files[i].name,
        document: event.target.files[i]
      }
      let size;
      this.size = event.target.files[i].size;
      this.SendCaseMailList.mailDocument.push(mailDocumemtnVm)
    }

  }
  removeDocument(data, index) {
    if (data.documentId === 0) {
      // this.model.clientFeeApproveDoc.splice(index, 1);
    }
  }

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
  removeControl(ind, type) {
    if (type === 'CC') {
      this.ccList.splice(ind, 1);
    }
    if (type === 'To') {
      this.toList.splice(ind, 1);
    }
  }
  checkIsExist(type: 'ToInc' | 'ToDec' | 'CCInc' | 'CCDec'): boolean {
    let returnVal = true;
    if (type === 'ToInc') {
      if (this.SendCaseMailList.ClientMailId != null && this.SendCaseMailList.ClientMailId != undefined && this.SendCaseMailList.ClientMailId.length > 0) {
        return returnVal = this.SendCaseMailList.ClientMailId.filter(e => e.emailType === 'To' && e.selected === false).length === 0;
      }
    }
    if (type === 'ToDec') {
      if (this.SendCaseMailList.ClientMailId != null && this.SendCaseMailList.ClientMailId != undefined && this.SendCaseMailList.ClientMailId.length > 0) {
        return returnVal = this.SendCaseMailList.ClientMailId.filter(e => e.emailType === 'To' && e.selected === true).length === 0;
      }
    }
    if (type === 'CCInc') {
      if (this.SendCaseMailList.ClientMailId != null && this.SendCaseMailList.ClientMailId != undefined && this.SendCaseMailList.ClientMailId.length > 0) {
        return returnVal = this.SendCaseMailList.ClientMailId.filter(e => e.emailType === 'CC' && e.selected === false).length === 0;
      }
    }
    if (type === 'CCDec') {
      if (this.SendCaseMailList.ClientMailId != null && this.SendCaseMailList.ClientMailId != undefined && this.SendCaseMailList.ClientMailId.length > 0) {
        return returnVal = this.SendCaseMailList.ClientMailId.filter(e => e.emailType === 'CC' && e.selected === true).length === 0;
      }
    }
    return returnVal;
  }
  mailChange(mail, assign) {
    this.SendCaseMailList.ClientMailId.filter(e => e.emailAddress === mail)[0].selected = assign;
  }

  sendMail() {

    this.SendCaseMailList.LoggedIn = this.userData.userId;
    this.SendCaseMailList.TemplateName = this.templateName;
    this.SendCaseMailList.TeamName = this.userData.teamName;
    this.SendCaseMailList.ScreeningCompId = this.screeningCompId;

    if (this.toList && this.toList.length > 0) {
      this.toList.forEach(ele => {
        const defaultMailList: verficationMail = {

          emailAddress: ele,
          emailType: 'To',
          selected: true
        };
        this.SendCaseMailList.ClientMailId.push(defaultMailList);
      });
      this.toList = [];
    }
    if (this.ccList && this.ccList.length > 0) {
      this.ccList.forEach(ele => {
        const defaultMailList: verficationMail = {
          emailAddress: ele,
          emailType: 'CC',
          selected: true
        };
        this.SendCaseMailList.ClientMailId.push(defaultMailList);
      });
      this.ccList = [];
    }

    if (this.SendCaseMailList.ClientMailId != null && this.SendCaseMailList.ClientMailId != undefined && this.SendCaseMailList.ClientMailId.length > 0) {
      const formData = new FormData();
      for (let i = 0; i < this.SendCaseMailList.mailDocument.length; i++) {
        if (this.SendCaseMailList.mailDocument[i].fileName) {
          const fileSize = this.fileSizeValidation(this.size);
          if (!fileSize) {
            this.showTopCenter('warn', 'Failure Message', 'the overall file size should be less than 5 MB');
            return;
          }
          else {
            formData.append('ScreeningComponentDocument_' + 0 + '_' + i, this.SendCaseMailList.mailDocument[i].document);
          }
        }
      }

      formData.append('SendClosureAdviceMail', JSON.stringify(this.SendCaseMailList));

      this.verification.sendCamAprvMail(formData).subscribe(res => {
        if (res.success == true) {

          this.showTopCenter('success', 'Success', 'Mail send Successfully');
          this.dialog.closeAll();
          //this.closeForm();
          this.isMailIdSave = false;
          this.getQASubdetail();
          this.previewFlag = false;
        }
        else {
          this.showTopCenter('warn', 'Info message', 'Something Went Wrong');
        }
      })
    } else {
      this.showTopCenter('warn', 'Info message', 'Please add MailId');
    }

  }
  GetClosureAdviceMailTemplate() {
    this.SendCaseMailList = new sendverification();
    this.SendCaseMailList.discloseClientFlag = false;
    this.verification.GetClosureAdviceMailTemplate(this.screeningCompId).subscribe(resp => {
      if (resp) {
        this.SendCaseMailList.EmailTemplate = resp.htmlTemplateBody;
        this.SendCaseMailList.Subject = resp.templateSubject;
        this.templateName = resp.templateName;
        this.SendCaseMailList.discloseClientFlag = resp.discloseClientFlag;
        this.SendCaseMailList.discloseEnableFlag = resp.discloseEnableFlag;
        this.toList = resp.toMail != null ? resp.toMail : [];
        this.ccList = resp.ccMail != null ? resp.ccMail : [];
        this.ccvalue = resp.ccMail != null ? resp.ccMail : [];
        this.isMailIdSave = true
        this.SendCaseMailList.ClientMailId = (resp.mailid != null) ? resp.mailid : [];
      }
    });
  }
  //Send Verfication Mail
  getScreenLetter() {
    this.SendCaseMailList = new sendverification();
    this.SendCaseMailList.discloseClientFlag = false;
    this.SendCaseMailList.ClientMailId = [];
    this.GetClosureAdviceMailTemplate();


    this.dialog.open(this.mailDialog, {
      width: '1400px',
      disableClose: true,
    });
  }
  openReject() {
    this.dialog.open(this.reject,
      { width: '700px', disableClose: true, });
  }
  public SelectAll(e): void {
    if (e === true) {
      this.QAList.forEach(x => {
        x.isSelected = true;
      });
    } else if (e === false) {
      this.QAList.forEach(x => {
        x.isSelected = false;
      });
    }
  }
  rejectcam() {
    this.verificationToCAMApprovalVM.screeningId = this.screeningId;
    this.verificationToCAMApprovalVM.screeningCompId = this.screeningCompId;
    this.verificationToCAMApprovalVM.loggedIn = this.userData.userId;
    this.verificationToCAMApprovalVM.remarks = this.rejectComments.value;
    if (this.rejectComments.value) {
      this.verification.camReject(this.verificationToCAMApprovalVM).subscribe(res => {
        if (res.success === true) {
          this.previewFlag = false;
          this.rejectComments.reset();
          this.showTopCenter('success', 'Success Message', 'Rejected Successfully');
          this.getQASubdetail();
          this.dialog.closeAll();
        }
      });
    } else {
      this.rejectComments.markAsTouched();
    }
  }
  assigCase(e, data) {
    if (e === true) {
      data.assignedCase = true;
    } else {
      data.assignedCase = false;
    }

  }
  ngOnDestroy() {
    this.verification.isFinalReport = false;
    this.previewFlag = false;
  }
  bulkapproveCase() {

    this.dialog.closeAll();
    this.previewFlag = false;

    const assignedCaseLst = this.QAList.filter(
      f => f.assignedCase === true
    );

    if (assignedCaseLst && assignedCaseLst.length > 0) {

      assignedCaseLst.map(e => {
        e.loggedIn = this.userData.userId;
      });

      this.verification
        .bulkCamApproval(assignedCaseLst)
        .subscribe({

          next: (res: any) => {

            if (res) {

              this.showTopCenter(
                'success',
                'Success Message',
                'Case has been approved successfully'
              );

              this.getQASubdetail();
            }
          },

          error: (err) => {

            this.showTopCenter(
              'error',
              'Error Message',
              'Bulk approval failed'
            );
          }
        });

    } else {

      this.showTopCenter(
        'warn',
        'Failure Message',
        'Please select atleast one case'
      );
    }
  }

  approveCase() {

    this.dialog.closeAll();
    this.previewFlag = false;

    this.selectValue.loggedIn = this.userData.userId;

    this.verification
      .camApproval(this.selectValue)
      .subscribe({

        next: (res: any) => {

          if (res) {

            this.getQASubdetail();

            this.previewFlag = false;

            this.showTopCenter(
              'success',
              'Success Message',
              'Case has been approved successfully'
            );
          }
        },

        error: (err) => {

          this.showTopCenter(
            'error',
            'Error Message',
            'Case approval failed'
          );
        }
      });
  }
  approveDialog() {
    this.dialog.open(this.approveConfirm, {
      width: '320px',

      disableClose: true
    });
  }
  rejectDialog() {
    this.dialog.open(this.rejectConfirm, {
      width: '320px',

      disableClose: true
    });
  }
  sentToClientDialog() {
    this.dialog.open(this.sentToClientConfirm, {
      width: '320px',

      disableClose: true
    });
  }
  bulkApproveDialog() {
    const assignedCaseLst = this.QAList.filter(f => f.assignedCase == true);
    if (assignedCaseLst != null && assignedCaseLst.length > 0) {
      let sltCase = assignedCaseLst.length
      this.approveContent = "Would you like to approve " + sltCase + " case(s)";
      this.dialog.open(this.bulkApproveConfirm, {
        width: '320px',

        disableClose: true
      });
    }
    else {
      this.showTopCenter('warn', 'Failure Message', 'Please select atleast one case');
    }
  }

  fileSizeValidation(size: any) {
    return this.bytesToSize(size);
  }
  bytesToSize(bytes: any) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = Math.floor(Math.log(bytes) / Math.log(1024));
    const total = Math.round(bytes / Math.pow(1024, i));
    if (i === 2) {
      return total > 5 ? false : true;
    } else if (i > 2) {
      return false;
    } else {
      return true;
    }
  }
}

export class sendverification {
  ClientMailId: verficationMail[] = [];
  EmailTemplate: string;
  Subject: string;
  TemplateName: string;
  TeamName: string
  discloseClientFlag: boolean;
  discloseEnableFlag: boolean;
  LoggedIn: number;
  ScreeningCompId: number;
  mailDocument: MailDocument[] = [];
}
export class MailDocument {
  fileName: string;
  document;
}
class verficationMail {
  emailType: string;
  emailAddress: string;
  selected = false;
}
export class verificationCamApVM {
  candidateName: string;
  screeningCompId: number;
  clientRefNo: string;
  clientId: number;
  clientName: string;
  loggedIn: number;
  screeningId: number;
  componentName: string;
  colorCode: string;

}