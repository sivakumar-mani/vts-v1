import { Component, OnInit, Input, ViewChild, Output, TemplateRef } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, UntypedFormArray, UntypedFormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { EmpInsProfDetailComponent } from 'src/app/common-methods/components/emp-ins-prof-detail/emp-ins-prof-detail.component';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { ScreeningDocument } from 'src/app/common-methods/models/screening-details';
import { VerificationService } from 'src/app/common-methods/services/verification.service';
import { MessageService } from 'primeng/api';
import { InstitutionFeesComponent } from 'src/app/master/institution-fees/institution-fees.component';
import { MatDialog } from '@angular/material/dialog';
import { MatChipsModule, MatChipInputEvent } from '@angular/material/chips';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { base64StringToBlob } from 'blob-util';
import { DomSanitizer } from '@angular/platform-browser';
import { ComponentType } from 'src/app/common-methods/models/deptComponent';

@Component({
  standalone: false,
  selector: 'app-components',
  templateUrl: './components.component.html',
  styleUrls: ['./components.component.css'],
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
export class ComponentsComponent implements OnInit {
  @ViewChild('mailDialog', { static: true }) mailDialog: TemplateRef<any>;
  addMailCtrl: UntypedFormControl;
  checkFlag = true;
  ccFlag: boolean;
  addFlag: boolean;
  ccMailCtrl: UntypedFormControl;
  tovalue: any;
  ccvalue: any;
  toList: any[] = [];
  templateName: string = '';
  ccList: any[] = [];
  htmlContent: any;
  isMailIdSave = false;
  dateMax = new Date();
  removable = true;
  selectable = true;
  addOnBlur = true;
  SendCaseMailList: sendverification;
  socialMediaId: any;
  businessCatId;
  ResearchQuestAnsValue: ResearchQuestAns[] = [];
  BusinesscatName: any;
  FrConDocuments: any[] = [];
  currentPath = '';
  provalue = 0;
  countq = 0;
  counta = 0;
  colorvalue: string;
  proAnsvalue = 0;
  showcountq = false;
  SelectedOptionname: any;
  SelectedStatusOption: any;
  state: string = 'default';
  url: any;
  MailFlag: any;
  dir: string;
  imageSource: any;
  downldata: any;
  downid: any;
  imageChangedEvent: any = '';
  downname: any;
  downmethod: any;
  zoomval: number;
  rvalue: number;
  empInsName;
  empHrContact: any[] = [];
  @ViewChild('pdfDialog', { static: true }) pdfDialog!: TemplateRef<any>;
  @ViewChild('imgprDialog', { static: true }) imgprDialog: TemplateRef<any>;
  bgColor = 'grey';
  @Input() verificationComponentDet: UntypedFormGroup;
  @Input() displayCaption: UntypedFormGroup;
  @Input() empInsMasterDet: UntypedFormGroup;
  @Input() verificationTransBindDet: UntypedFormGroup;
  @Input() verificationForm: UntypedFormGroup;
  screeningDocument: ScreeningDocument[] = [];
  @ViewChild(EmpInsProfDetailComponent) empInsProfDetailComponent: EmpInsProfDetailComponent;
  @ViewChild(InstitutionFeesComponent) insFees: InstitutionFeesComponent;
  displayCaptionValue: any[] = [];
  @Output() refreshData: any;
  isEditMode = false;
  isEditShowButton = true;
  isVerification = true;
  componentContent: { header: string, value: string, dataType: string }[] = [];
  criminalContent: any[] = [];
  compType: string;
  isEditFeesMode = false;
  miscContent: any[] = [];
  addressPos: any[] = [];
  CourtDetails: any[] = [];
  compDocument: UntypedFormGroup;
  userData: any = {};
  policy: UntypedFormGroup;
  name: string;
  dialogRef: any;
  empFlag: boolean;
  ctsFlag: boolean;
  clientName: string;
  fresherFlag: boolean;
  @ViewChild('reject', { static: true }) reject;
  rejectComments = new UntypedFormControl();
  verificationRejectVM = new verificationRejectVM();
  researchStatusLookUpValue: any;
  closedFlag = false;
  empInsId;
  empInsAddressId;
  screencmpId;
  empEduFlag: boolean;
  empinsIDs: any;
  closedColorcompID: any;
  @ViewChild('verifiedList', { static: true }) verifiedList;
  businessCategory: any[] = [];
  clientRefNo;
  verificationIdList: any;
  clientCategoryId: any;
  screenAuth: any = {};

  constructor(
    private sanitizer: DomSanitizer,
    public screeningService: ScreeningService,
    public verificationService: VerificationService,
    public authService: AuthService,
    public common: CommonService,
    private fb: UntypedFormBuilder,
    private message: MessageService,
    public dialog: MatDialog,
    private router: Router,
    public masterService: MasterService,
    private datePipe: DatePipe
  ) {
    this.addMailCtrl = new UntypedFormControl(null, [Validators.pattern(this.common.EmailRegX)]);
    this.ccMailCtrl = new UntypedFormControl(null, [Validators.pattern(this.common.EmailRegX)]);
  }

  ngOnInit() {
    this.screenAuth = this.authService.getScreenAuth(this.common.VERIFICATION_ROUTER);
    this.fresherFlag = this.verificationService.tempData?.verificationComponentDet?.component?.[0]?.fresherFlag;
    this.socialMediaId = this.verificationForm.value.responseDocument.compId;
    this.compType = this.verificationForm.value.responseDocument.componentType;
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.closedFlag = this.verificationService.closedCheck;
    this.screencmpId = this.verificationForm.get('screeningCompId')?.value;
    this.empInsName = this.verificationForm.value.empInsMasterDet.name;
    this.ctsFlag = this.verificationForm.value.verificationScreeningDet.ctsFlag;
    this.clientName = this.verificationForm.value.verificationScreeningDet.clientName;
    this.clientCategoryId = this.verificationForm.value.verificationScreeningDet.clientCategoryId;
    this.clientRefNo = this.verificationForm.value.clientRefNo;
    this.businessCatId = this.verificationForm.value.empInsMasterDet.businessCategoryLookupId;
    this.empFlag = this.verificationForm.value.empInsMasterDet.empFlag;
    this.empInsId = this.verificationForm.value.empInsMasterDet.id;
    this.empInsAddressId = this.verificationForm.value.empInsMasterDet.empInsAddressId;

    if (this.empInsName) {
      this.masterService.getEmployerHrContacts(this.empInsName, this.empInsAddressId).subscribe(data => {
        if (data && Array.isArray(data)) {
          this.empHrContact = data.map(contact => ({
            employerName: this.empInsName || 'N/A',
            name: contact.name || 'N/A',
            contactNumber: contact.contactNumber || 'N/A',
            emailId: contact.emailId || 'N/A',
            updated: contact.updated || 'N/A',
            comments: contact.comments || 'N/A'
          }));
        }
      }, error => {
        console.error('Error fetching HR contact details:', error);
      });
    }

    if (this.verificationForm.value.responseDocument.componentName) {
      this.name = this.verificationForm.value.responseDocument.componentName;
    }

    this.authService.employerInstutionId = this.empInsMasterDet.value.id;
    this.authService.employerInstutionAddId = this.empInsMasterDet.value.address != null
      ? this.empInsMasterDet.value.address.addressId : 0;

    // Guard against undefined miscQuestion
    if (this.verificationComponentDet.value.component?.[0]?.miscQuestion) {
      this.miscContent = this.verificationComponentDet.value.component[0].miscQuestion;
    }

    // Guard against undefined compRef and address
    const component0 = this.verificationComponentDet.value.component?.[0];
    if (component0?.compRef?.address) {
      if (component0.compRef.address.addressPos !== null) {
        this.addressPos = component0.compRef.address.addressPos !== undefined
          ? component0.compRef.address.addressPos
          : component0.compRef.address[0]?.addressPos;
      }
    }

    if (component0?.compRef?.jCRCourctDetailsVm) {
      if (component0.compRef.jCRCourctDetailsVm !== null) {
        this.CourtDetails = component0.compRef.jCRCourctDetailsVm !== undefined
          ? component0.compRef.jCRCourctDetailsVm
          : component0.compRef.jCRCourctDetailsVm[0];
      }
    }

    this.authService.empInsProf = (this.empInsMasterDet.value.empFlag)
      ? this.common.SCRN_EMPLOYER_CREATION
      : this.common.SCRN_INSTITUTION_CREATION;

    if (this.authService.empInsProf === this.common.SCRN_EMPLOYER_CREATION) {
      this.isEditShowButton = false;
    }

    this.generateCaption();
    this.screeningDocument = component0?.screeningComponentInfo?.componentDocument ?? [];
    this.initDocument();
    this.initpolicyCommentForm();
    const compDocument = this.compDocument.get('document') as UntypedFormArray;
    this.createDocForm(compDocument, component0?.screeningComponentInfo?.componentDocument ?? []);
    this.compDocument.get('document')?.patchValue(component0?.screeningComponentInfo?.componentDocument ?? []);
    this.policy.patchValue({
      mainComment: this.empInsMasterDet.value.additionalInformation,
      subComment: this.empInsMasterDet.value.additionalInformationSub
    });
    this.eduempIdandFlag();
  }

  eduempIdandFlag() {
    this.closedColorcompID = this.verificationForm.value.responseDocument.compId;
    if (this.closedColorcompID === this.common.EMPLOYMENT_HRId || this.closedColorcompID === this.common.EDUCATIONId) {
      if (this.closedColorcompID === this.common.EMPLOYMENT_HRId) {
        this.empinsIDs = this.empInsId;
        this.empEduFlag = true;
      } else {
        this.empinsIDs = this.empInsId;
        this.empEduFlag = false;
      }
    }
  }

  bindInsFees() {
    setTimeout(() => {
      if (this.common.feesValue) {
        this.verificationForm.get('institutionFees')?.patchValue(this.common.feesValue);
        this.common.feesValue.feesId ? this.isEditFeesMode = false : this.isEditFeesMode = true;
      }
    }, 200);
  }

  initDocument() {
    this.compDocument = this.fb.group({
      screeningId: new UntypedFormControl(this.verificationForm.get('screeningId')?.value),
      screeningCompId: new UntypedFormControl(this.verificationForm.get('screeningCompId')?.value),
      candidateName: new UntypedFormControl(),
      createdUserId: new UntypedFormControl(this.userData.userId),
      document: new UntypedFormArray([])
    });
  }

  initverDocument() {
    return new UntypedFormGroup({
      screeningDocId: new UntypedFormControl(0),
      document: new UntypedFormControl([]),
      fileName: new UntypedFormControl(''),
      filePath: new UntypedFormControl(''),
      docTypeId: new UntypedFormControl(0),
      docSubTypeId: new UntypedFormControl(0),
      insuffDocTransId: new UntypedFormControl(0),
      responseConfirmationId: new UntypedFormControl(0),
    });
  }

  initpolicyCommentForm() {
    this.policy = new UntypedFormGroup({
      mainComment: new UntypedFormControl(''),
      subComment: new UntypedFormControl(''),
      screeningComment: new UntypedFormControl(''),
      countrySubComment: new UntypedFormControl(''),
      empFlag: new UntypedFormControl(this.verificationForm.value.empInsMasterDet.empFlag),
      empInsId: new UntypedFormControl(this.authService.employerInstutionId),
      screeningCompId: new UntypedFormControl(this.verificationForm.get('screeningCompId')?.value),
      createdUserId: new UntypedFormControl(this.userData.userId)
    });
  }

  getFlag(e: any) {
    this.isEditMode = false;
    this.generateCaption();
  }

  clearControls() { }

  generateCaption() {
    if (!this.displayCaption?.value) {
      return;
    }

    this.componentContent = [];
    this.compType = this.verificationForm.value.responseDocument.componentType;
    const componentName = this.verificationForm.value.responseDocument.componentName;
    let valueData = null;

    // Safely get compRef — guard against undefined component[0] or compRef
    const component0 = this.verificationComponentDet.value.component?.[0];
    if (!component0) {
      return;
    }
    const compRef = component0?.compRef;
    if (!compRef) {
      return;
    }

    switch (this.compType) {
      case 'address': {
        if (!compRef.address) break;
        compRef.address.periodOfStay = compRef.periodOfStay;
        compRef.address.periodOfStayTo = compRef.periodOfStayTo;
        valueData = [compRef, compRef.address].reduce(((r, c) => Object.assign(r, c)), {});
        this.bindComponent();
        const cRCData = (this.displayCaption.value).filter(e => e.key !== 'latitude' && e.key !== 'longitude');
        this.displayCaption.setValue(cRCData);
        break;
      }
      case 'voterId':
      case 'license':
      case 'drugTest':
      case 'companySiteVisit':
      case 'jcr': {
        if (!compRef.address) break;
        compRef.address.periodOfStay = compRef.periodOfStay;
        compRef.address.periodOfStayTo = compRef.periodOfStayTo;
        valueData = [compRef, compRef.address].reduce(((r, c) => Object.assign(r, c)), {});
        this.bindComponent();
        const cRCData = (this.displayCaption.value).filter(e => e.key !== 'overallStayYears');
        this.displayCaption.setValue(cRCData);
        break;
      }
      case 'referenceCheck':
      case 'employmentSupervisor': {
        if (!compRef.address) break;
        valueData = [compRef, compRef.address].reduce(((r, c) => Object.assign(r, c)), {});
        this.bindComponent();
        break;
      }
      case 'employee': {
        if (!compRef.supervisorDet) break;
        compRef.supervisorEmail = compRef.supervisorDet.supervisorEmail?.contactData;
        compRef.supervisorContactNo = compRef.supervisorDet.supervisorContactNo?.contactData;
        compRef.supervisorName = compRef.supervisorDet.supervisorName;
        compRef.supervisorCompanyName = compRef.supervisorDet.supervisorCompanyName;
        compRef.supervisorDesignation = compRef.supervisorDet.supervisorDesignation;
        compRef.hremail = compRef.hrEmail;
        compRef.hrcontactNo = compRef.hrContactNo;
        compRef.hrname = compRef.hrName;
        compRef.hrdesignation = compRef.hrDesignation;
        compRef.city = compRef.supervisorDet.city;
        compRef.country = compRef.supervisorDet.country;
        valueData = [compRef].reduce(((r, c) => Object.assign(r, c)), {});
        this.bindComponent();
        break;
      }
      case 'currentemployee': {
        if (!compRef.supervisorDet) break;
        compRef.supervisorEmail = compRef.supervisorDet.supervisorEmail?.contactData;
        compRef.supervisorContactNo = compRef.supervisorDet.supervisorContactNo?.contactData;
        compRef.supervisorName = compRef.supervisorDet.supervisorName;
        compRef.supervisorCompanyName = compRef.supervisorDet.supervisorCompanyName;
        compRef.supervisorDesignation = compRef.supervisorDet.supervisorDesignation;
        compRef.hremail = compRef.hrEmail;
        compRef.hrcontactNo = compRef.hrContactNo;
        compRef.hrname = compRef.hrName;
        compRef.hrdesignation = compRef.hrDesignation;
        compRef.city = compRef.supervisorDet.city;
        compRef.country = compRef.supervisorDet.country;
        valueData = [compRef].reduce(((r, c) => Object.assign(r, c)), {});
        this.bindComponent();
        break;
      }
      case 'previousemployee': {
        if (!compRef.supervisorDet) break;
        compRef.supervisorEmail = compRef.supervisorDet.supervisorEmail?.contactData;
        compRef.supervisorContactNo = compRef.supervisorDet.supervisorContactNo?.contactData;
        compRef.supervisorName = compRef.supervisorDet.supervisorName;
        compRef.supervisorCompanyName = compRef.supervisorDet.supervisorCompanyName;
        compRef.supervisorDesignation = compRef.supervisorDet.supervisorDesignation;
        compRef.hremail = compRef.hrEmail;
        compRef.hrcontactNo = compRef.hrContactNo;
        compRef.hrname = compRef.hrName;
        compRef.hrdesignation = compRef.hrDesignation;
        compRef.city = compRef.supervisorDet.city;
        compRef.country = compRef.supervisorDet.country;
        valueData = [compRef].reduce(((r, c) => Object.assign(r, c)), {});
        this.bindComponent();
        break;
      }
      case 'referenceSelfEmployed': {
        if (compRef.supervisorContactNo?.contactData === undefined || compRef.supervisorEmail?.contactData === undefined) {
          valueData = [compRef].reduce(((r, c) => Object.assign(r, c)), {});
        } else {
          compRef.supervisorContactNo = compRef.supervisorContactNo.contactData;
          compRef.supervisorEmail = compRef.supervisorEmail.contactData;
          valueData = [compRef].reduce(((r, c) => Object.assign(r, c)), {});
          this.bindComponent();
        }
        break;
      }
      case 'ndotComp':
      case 'nic':
      case 'uan':
      case 'pan':
      case 'directorship':
      case 'emergencyContactVerification':
      case 'abroadComp':
      case 'socialMedia':
      case 'Oig':
      case 'Mhcp':
      case 'facm':
      case 'faC1':
      case 'faC2':
      case 'faC3':
      case 'ten':
      case 'ssn':
      case 'passport': {
        if (!compRef.address) break;
        valueData = [compRef, compRef.address].reduce(((r, c) => Object.assign(r, c)), {});
        this.bindComponent();
        break;
      }
      case 'commonComp': {
        if (!compRef.address) break;
        valueData = [compRef, compRef.address].reduce(((r, c) => Object.assign(r, c)), {});
        this.bindData(valueData, this.displayCaption.value);
        break;
      }
      case 'employmentHrAndSupervisor': {
        if (!compRef.employmentSupervisor) break;
        compRef.employmentSupervisor.supervisorEmailId = compRef.employmentSupervisor.supervisorEmail?.contactData;
        compRef.employmentSupervisor.supervisorContactnumber = compRef.employmentSupervisor.supervisorContactNo?.contactData;
        valueData = [compRef.employmentHR, compRef.employmentSupervisor].reduce(((r, c) => Object.assign(r, c)), {});
        this.bindComponent();
        break;
      }
      case 'cRC': {
        if (!compRef.address) break;
        compRef.address.periodOfStay = compRef.periodOfStay ? compRef.periodOfStay : compRef.periodOfStayFrom;
        compRef.address.periodOfStayTo = compRef.periodOfStayTo;
        valueData = [compRef, compRef.permanentAddress].reduce(((r, c) => Object.assign(r, c)), {});
        this.bindComponent();
        break;
      }
      case 'criminalDatabase': {
        if (!compRef.address) break;
        compRef.address.periodOfStay = compRef.periodOfStay;
        compRef.address.periodOfStayTo = compRef.periodOfStayTo;
        valueData = [compRef, compRef.address.addressType].reduce(((r, c) => Object.assign(r, c)), {});
        this.bindComponent();
        break;
      }
      case 'panIndiaOCRV': {
        if (!compRef.address) break;
        compRef.address.periodOfStay = compRef.periodOfStay;
        compRef.address.periodOfStayTo = compRef.periodOfStayTo;
        valueData = [compRef, compRef.address.periodOfStay].reduce(((r, c) => Object.assign(r, c)), {});
        this.bindComponent();
        break;
      }
      case 'bankStatement': {
        if (compRef.statementFrom && compRef.statementTo) {
          compRef.statementFrom = this.common.getTimezoneOffset(compRef.statementFrom, false);
          compRef.statementTo = this.common.getTimezoneOffset(compRef.statementTo, false);
          compRef.statementFrom = new DatePipe('en-Us').transform(compRef.statementFrom, 'dd/MMM/yyyy').toUpperCase();
          compRef.statementTo = new DatePipe('en-Us').transform(compRef.statementTo, 'dd/MMM/yyyy').toUpperCase();
        }
        if (!compRef.address) break;
        valueData = [compRef, compRef.address].reduce(((r, c) => Object.assign(r, c)), {});
        this.bindComponent();
        break;
      }
      case 'criminalCheckPCC3PCC3E': {
        if (!compRef.address) break;
        compRef.address.periodOfStayTo = compRef?.periodOfStayTo;
        compRef.address.addressType = compRef?.addressType;
        valueData = [compRef, compRef.address].reduce(((r, c) => Object.assign(r, c)), {});
        this.bindComponent();
        break;
      }
      case 'criminalCheckPCC1PCC2': {
        this.criminalContent = component0?.compRef?.address ?? [];
        this.criminalContent.forEach(criminal => {
          Object.assign(criminal, {
            addressTypeCheckLookupName: component0?.compRef?.addressTypeCheckLookupName,
            periodOfStayFrom: component0?.compRef?.periodOfStayFrom,
            periodOfStayTo: component0?.compRef?.periodOfStayTo,
          });
        });
        this.bindComponent();
        break;
      }
      case 'education':
        if (this.ctsFlag === true) {
          this.bindEducationData(component0, this.displayCaption.value);
        }
        break;
      default: {
        valueData = compRef;
        break;
      }
    }

    if (this.compType as any === 'cRC') {
      const cRCData = (this.displayCaption.value).filter(e =>
        e.key !== 'fatherName' && e.key !== 'firstName' &&
        e.key !== 'middleName' && e.key !== 'lastName');
      this.bindCurrentAddress(component0?.compRef?.address, cRCData);
      return;
    }
    if (this.compType as any === 'education' && this.ctsFlag !== true) {
      const eduData = this.clientCategoryId === 4
        ? this.displayCaption.value
        : (this.displayCaption.value).filter(e => e.key !== 'yearOfPassing' && e.key !== 'gapReason');
      this.bindEducationData(component0, eduData);
      return;
    }
    if (this.compType as any === 'criminalDatabase') {
      this.bindCriminalDBData(valueData, this.displayCaption.value);
      return;
    }
    if (this.compType as any === 'creditVerification') {
      this.bindCreditData(valueData, this.displayCaption.value);
      return;
    }
    if (this.compType as any === 'panIndiaOCRV') {
      this.bindPanOCRVData(valueData, this.displayCaption.value);
      return;
    }
    if (this.compType as any === 'bankStatement') {
      this.bindBankStatemetData(valueData, this.displayCaption.value);
      return;
    }
    if (this.compType as any === 'jcr') {
      this.bindjcrData(valueData, this.displayCaption.value);
      return;
    }
    if (this.compType as any === 'criminalCheckPCC3PCC3E') {
      this.bindCriminalPCC3PCC3EData(valueData, this.displayCaption.value);
      return;
    }
    if (
      this.compType !== 'criminalDatabase' && this.compType !== 'panIndiaOCRV' &&
      this.compType !== 'bankStatement' && this.compType !== 'criminalCheckPCC1PCC2' &&
      this.compType !== 'criminalCheckPCC3PCC3E' && this.compType !== 'education' &&
      this.compType !== 'commonComp'
    ) {
      const EmpData = this.clientCategoryId != 4
        ? (this.displayCaption.value).filter(e => e.key !== 'gapReason')
        : this.displayCaption.value;
      this.bindData(valueData, EmpData);
      return;
    }
  }

  bindComponent() {
    if (this.verificationService.tempData.componentCustomFields &&
      this.verificationService.tempData.componentCustomFields.length > 0) {
      this.verificationService.tempData.componentCustomFields.forEach(element =>
        this.componentContent.push({
          header: element.fieldName,
          value: element.fieldType === 'Date'
            ? this.common.getTimezoneOffset(element.fieldValue, false)
            : element.fieldValue,
          dataType: element.fieldType,
        }));
    }
  }

  bindjcrData(valData, displayCaption) {
    for (let i = 0; i < displayCaption.length; i++) {
      if (displayCaption[i].key === 'addTypeLookName') {
        displayCaption.splice(i, 1);
      }
    }
    displayCaption.forEach(element => {
      const compRef = this.verificationComponentDet.value.component?.[0]?.compRef;
      if (!compRef?.address) return;
      valData = [compRef, compRef.address].reduce(((r, c) => Object.assign(r, c)), {});
      this.componentContent.push({
        header: element.caption,
        value: valData[element.key],
        dataType: '',
      });
    });
  }

  bindCriminalDBData(valData, displayCaption) {
    displayCaption.forEach(element => {
      if (element.key === 'addressType') {
        this.componentContent.push({
          header: element.caption,
          value: valData[element.key],
          dataType: '',
        });
      } else if (element.key === 'addressTypeCheck' && valData.addressTypeCheckLookupId > 0) {
        this.componentContent.push({
          header: element.caption,
          value: valData[element.key],
          dataType: '',
        });
      } else {
        const compRef = this.verificationComponentDet.value.component?.[0]?.compRef;
        if (!compRef?.address) return;
        valData = [compRef, compRef.address].reduce(((r, c) => Object.assign(r, c)), {});
        if (element.key !== 'addressTypeCheck') {
          this.componentContent.push({
            header: element.caption,
            value: valData[element.key],
            dataType: '',
          });
        }
      }
    });
  }

  bindPanOCRVData(valData, displayCaption) {
    displayCaption.forEach(element => {
      if (element.key === 'periodOfStay') {
        this.componentContent.push({
          header: element.caption,
          value: valData[element.key],
          dataType: '',
        });
      } else {
        const compRef = this.verificationComponentDet.value.component?.[0]?.compRef;
        if (!compRef?.address) return;
        valData = [compRef, compRef.address].reduce(((r, c) => Object.assign(r, c)), {});
        this.componentContent.push({
          header: element.caption,
          value: valData[element.key],
          dataType: ''
        });
      }
    });
  }

  bindCreditData(valData, displayCaption) {
    displayCaption.forEach(element => {
      if (element.key === 'pan') {
        this.componentContent.push({
          header: element.caption,
          value: valData[element.key],
          dataType: '',
        });
      } else {
        const compRef = this.verificationComponentDet.value.component?.[0]?.compRef;
        if (!compRef?.address) return;
        valData = [compRef, compRef.address].reduce(((r, c) => Object.assign(r, c)), {});
        this.componentContent.push({
          header: element.caption,
          value: valData[element.key],
          dataType: ''
        });
      }
    });
  }

  bindBankStatemetData(valData, displayCaption) {
    displayCaption.forEach(element => {
      const compRef = this.verificationComponentDet.value.component?.[0]?.compRef;
      if (!compRef?.address) return;
      valData = [compRef, compRef.address].reduce(((r, c) => Object.assign(r, c)), {});
      this.componentContent.push({
        header: element.caption,
        value: element.dataType === 'Date'
          ? this.common.getTimezoneOffset(valData[element.key], false)
          : valData[element.key],
        dataType: element.dataType,
      });
    });
  }

  bindCriminalPCC3PCC3EData(valData, displayCaption) {
    displayCaption.forEach(element => {
      if (element.key === 'periodOfStayFrom' || element.key === 'periodOfStayTo'
        || element.key === 'addressType' || element.key === 'addressTypeCheckLookupName') {
        this.componentContent.push({
          header: element.caption,
          value: valData[element.key],
          dataType: '',
        });
      } else {
        const compRef = this.verificationComponentDet.value.component?.[0]?.compRef;
        if (!compRef?.address) return;
        valData = [compRef, compRef.address].reduce(((r, c) => Object.assign(r, c)), {});
        this.componentContent.push({
          header: element.caption,
          value: valData[element.key],
          dataType: '',
        });
      }
    });
  }

  bindCurrentAddress(valData, displayCaption) {
    if (!valData || !displayCaption) return;
    displayCaption.forEach(element => {
      const compRef = this.verificationComponentDet.value.component?.[0]?.compRef;
      if (!compRef?.address) return;
      const merged = [compRef, compRef.address].reduce(((r, c) => Object.assign(r, c)), {});
      this.componentContent.push({
        header: element.caption,
        value: merged[element.key],
        dataType: element.dataType,
      });
    });
  }

  bindEducationData(Data, displayCaption) {
    if (!Data?.compRef) return;
    const compValue = Data.compRef;
    const address = (compValue.address?.addressId === this.screeningService.defaultAddressId)
      ? 'Not Provided'
      : (compValue.address?.addLine1 ? compValue.address.addLine1 : '')
      + (compValue.address?.addLine2 ? ', ' + compValue.address.addLine2 : '')
      + (compValue.address?.addLine3 ? ', ' + compValue.address.addLine3 : '')
      + (compValue.address?.place ? ', ' + compValue.address.place : '')
      + (compValue.address?.city ? ', ' + compValue.address.city : '')
      + (compValue.address?.district ? ',' + compValue.address.district : '')
      + (compValue.address?.state ? ',' + compValue.address.state : '')
      + (compValue.address?.country ? ', ' + compValue.address.country : '')
      + (compValue.address?.postalCode ? ' - ' + compValue.address.postalCode : '');

    displayCaption.forEach(element => {
      if (
        (element.key == 'institutionType' && !compValue.removeInstitutionTypeFlag) ||
        (element.key == 'educationCategoryName' && !compValue.removeInstitutionTypeFlag) ||
        (element.key == 'educationType' && !compValue.removeEducationCategoryFlag) ||
        (element.key !== 'institutionType' && element.key !== 'educationType' && element.key !== 'educationCategoryName')
      ) {
        this.componentContent.push({
          header: element.caption,
          value: element.caption == 'Institution Address' ? address : compValue[element.key],
          dataType: ''
        });
      }
    });

    if (Data.componentCustomFields && Data.componentCustomFields.length > 0) {
      Data.componentCustomFields.forEach(element =>
        this.componentContent.push({
          header: element.fieldName,
          value: element.fieldType === 'Date'
            ? this.common.getTimezoneOffset(element.fieldValue, false)
            : element.fieldValue,
          dataType: element.fieldType,
        }));
    }
  }

  bindData(valData, displayCaption) {
    if (!valData) return;
    const compValue = valData;
    const address = compValue.address
      ? (compValue.address.addressId === this.screeningService.defaultAddressId)
        ? 'Not Provided'
        : (compValue.address.addLine1 ? compValue.address.addLine1 : '')
        + (compValue.address.addLine2 ? ', ' + compValue.address.addLine2 : '')
        + (compValue.address.addLine3 ? ', ' + compValue.address.addLine3 : '')
        + (compValue.address.place ? ', ' + compValue.address.place : '')
        + (compValue.address.city ? ', ' + compValue.address.city : '')
        + (compValue.address.district ? ',' + compValue.address.district : '')
        + (compValue.address.state ? ',' + compValue.address.state : '')
        + (compValue.address.country ? ', ' + compValue.address.country : '')
        + (compValue.address.postalCode ? ' - ' + compValue.address.postalCode : '')
      : '';

    displayCaption.forEach(element => {
      this.componentContent.push({
        header: element.caption,
        value: (element.caption == 'Company Address' || element.caption == 'Address')
          ? address
          : (element.key == 'dob' || element.key == 'dateOfBirth')
            ? this.datePipe.transform(valData[element.key], 'dd/MMM/yyyy')
            : (element.dataType == 'Date')
              ? this.common.getTimezoneOffset(valData[element.key], false)
              : valData[element.key],
        dataType: ''
      });
    });
  }

  createDocForm(formArray: UntypedFormArray, docData: any) {
    if (!docData) return;
    for (let e = 0; docData.length > e; e++) {
      formArray.push(this.initverDocument());
    }
  }

  saveDocument(type: string) {
    const formData = new FormData();
    for (let i = 0; i < this.screeningDocument.length; i++) {
      if (this.screeningDocument[i].fileName) {
        formData.append('ScreeningComponentDocument_' + 0 + '_' + i, this.screeningDocument[i].document);
      }
    }
    this.compDocument.get('screeningCompId')?.setValue(
      this.verificationComponentDet.value.component?.[0]?.compRef?.screeningCompId
    );
    formData.append('VerificationDocument', JSON.stringify(this.compDocument.value));
    this.verificationService.addVerificationDocument(formData).subscribe(res => {
      if (res) {
        this.showTopCenter('success', 'Success Message', 'Updated Successfully');
      }
    }, err => { }, () => { });
  }

  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }

  updateComments() {
    this.verificationService.addComponentComments(this.policy.value).subscribe(res => {
      if (res) {
        this.showTopCenter('success', 'Success Message', 'Updated Successfully');
        this.empInsMasterDet.get('additionalInformation')?.setValue(this.policy.value.mainComment);
        this.empInsMasterDet.get('additionalInformationSub')?.setValue(this.policy.value.subComment);
      }
    }, err => { }, () => { });
  }

  openReject() {
    this.dialog.open(this.reject, { width: '700px', disableClose: true });
  }

  dialogClose() {
    this.dialog.closeAll();
  }

  moveDE() {
    this.verificationRejectVM.screeningId = this.verificationService.tempData.screeningId;
    this.verificationRejectVM.screeningCompId = this.verificationService.tempData.screeningCompId;
    this.verificationRejectVM.loggedIn = this.userData.userId;
    this.verificationRejectVM.comment = this.rejectComments.value;
    if (this.rejectComments.value) {
      this.verificationService.verificationReject(this.verificationRejectVM).subscribe(res => {
        if (res.success === true) {
          this.showTopCenter('success', 'Success Message', 'Moved to DE Successfully');
          this.router.navigate(['/dashboard/verification/verification']);
          this.verificationService.caseDetailFlag = false;
          this.dialog.closeAll();
        }
      });
    } else {
      this.rejectComments.markAsTouched();
    }
  }

  getBusinesscat(id: any) {
    if (id > 0) {
      this.masterService.GetBusinessCategoryLookUp().subscribe(res => {
        this.businessCategory = res.filter(x => x.lookUpId === id);
        this.BusinesscatName = this.businessCategory[0].lookUpName;
      });
    }
  }

  viewVerifiedList() {
    this.dialogRef = this.dialog.open(this.verifiedList, {
      width: '1000px',
      height: 'auto',
      disableClose: true
    });
    this.getBusinesscat(this.businessCatId);
    this.getVerifiedData();
  }

  getResearchLookUp() {
    this.masterService.getResearchLookUp().subscribe(researchStatusLookUpValue => {
      if (researchStatusLookUpValue) {
        this.researchStatusLookUpValue = researchStatusLookUpValue;
      }
    });
    if (this.empFlag === true) {
      this.masterService.GetEmployerScreeningCompId(this.empInsId, '', 0).subscribe(resp => {
        if (resp) {
          this.verificationIdList = resp;
        }
      });
    }
  }

  getVerifiedData() {
    this.masterService.getResearchQuestAnswer(
      this.empFlag, this.screencmpId, this.empInsId, this.businessCatId, this.empInsAddressId
    ).subscribe(res => {
      if (res) {
        this.ResearchQuestAnsValue = res;
        this.FrConDocuments = this.ResearchQuestAnsValue[0].frConDocument;
        this.getResearchLookUp();
        this.progresscalc();
      }
    });
  }

  getOpame(data, option) {
    this.SelectedOptionname = data.filter(x => x.optionId === option);
    return this.SelectedOptionname;
  }

  getValue(value: any) {
    let val = false;
    if (value && value > 0 && this.researchStatusLookUpValue) {
      val = this.researchStatusLookUpValue.underReview[0].lookupCatName.toLowerCase().includes(
        this.common.getNameById(this.researchStatusLookUpValue.researchResult, 'lookUpId', 'lookUpName', value).toLowerCase()
      );
    }
    return val;
  }

  getStatus(data, option) {
    if (option > 0) {
      this.SelectedStatusOption = data.filter(x => x.lookUpId === option);
    }
    return this.SelectedStatusOption;
  }

  base64ToArrayBuffer(base64: any) {
    const binaryString = window.atob(base64);
    const binaryLen = binaryString.length;
    const bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i++) {
      const ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  }

  saveByteArray(filename, byte) {
    const blob = new Blob([byte], { type: 'application/octet-stream' });
    if (window.navigator && (window.navigator as any).msSaveOrOpenBlob) {
      (window.navigator as any).msSaveOrOpenBlob(blob, filename);
    } else {
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display:none;');
      const csvUrl = URL.createObjectURL(blob);
      a.href = csvUrl;
      a.download = filename;
      a.click();
      a.remove();
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
      if (this.SendCaseMailList.ClientMailId.length > 0) {
        return returnVal = this.SendCaseMailList.ClientMailId.filter(e => e.emailType === 'To' && e.selected === false).length === 0;
      }
    }
    if (type === 'ToDec') {
      if (this.SendCaseMailList.ClientMailId.length > 0) {
        return returnVal = this.SendCaseMailList.ClientMailId.filter(e => e.emailType === 'To' && e.selected === true).length === 0;
      }
    }
    if (type === 'CCInc') {
      if (this.SendCaseMailList.ClientMailId.length > 0) {
        return returnVal = this.SendCaseMailList.ClientMailId.filter(e => e.emailType === 'CC' && e.selected === false).length === 0;
      }
    }
    if (type === 'CCDec') {
      if (this.SendCaseMailList.ClientMailId.length > 0) {
        return returnVal = this.SendCaseMailList.ClientMailId.filter(e => e.emailType === 'CC' && e.selected === true).length === 0;
      }
    }
    return returnVal;
  }

  mailChange(mail, assign) {
    this.SendCaseMailList.ClientMailId.filter(e => e.emailAddress === mail)[0].selected = assign;
  }

  getSupervisor() {
    this.getMailId();
    this.dialog.open(this.mailDialog, { width: '1400px', disableClose: true });
    this.verificationService.getSupervisorMail(this.verificationForm.value.screeningCompId).subscribe(dat => {
      if (dat != null) {
        this.SendCaseMailList.EmailTemplate = dat.htmlTemplateBody;
        this.templateName = dat.templateName;
        this.SendCaseMailList.Subject = dat.templateSubject;
        this.isMailIdSave = true;
      }
    });
  }

  getMailId() {
    this.SendCaseMailList = new sendverification();
    this.verificationService.getSupMail(this.verificationService.tempData.screeningCompId).subscribe(tat => {
      if (tat.length != 0) {
        this.SendCaseMailList.ClientMailId = tat;
        this.SendCaseMailList.ClientMailId.map(e => { e.selected = true; });
      }
    });
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
          if (input) input.value = '';
        } else {
          this.showTopCenter('warn', 'Failure Message', 'Please enter valid Email');
        }
        if (input) input.value = '';
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
        if (input) input.value = '';
      }
    }
  }

  async sendSupMail() {
    this.SendCaseMailList.LoggedIn = this.userData.userId;
    this.SendCaseMailList.TemplateName = this.templateName;
    this.SendCaseMailList.TeamName = this.userData.teamName;
    if (this.toList && this.toList.length > 0) {
      this.toList.forEach(ele => {
        this.SendCaseMailList.ClientMailId.push({ emailAddress: ele, emailType: 'To', selected: true });
      });
      this.toList = [];
    }
    if (this.ccList && this.ccList.length > 0) {
      this.ccList.forEach(ele => {
        this.SendCaseMailList.ClientMailId.push({ emailAddress: ele, emailType: 'CC', selected: true });
      });
      this.ccList = [];
    }
    if (this.SendCaseMailList.ClientMailId.length > 0) {
      const formData = new FormData();
      formData.append('sendverification', JSON.stringify(this.SendCaseMailList));
      this.verificationService.sendVerficationMail(formData).subscribe(res => {
        if (res.success == true) {
          this.showTopCenter('success', 'Success', 'Mail send Successfully');
          this.dialog.closeAll();
          this.isMailIdSave = false;
        } else {
          this.showTopCenter('warn', 'Info message', 'Something Went Wrong');
        }
      });
    } else {
      this.showTopCenter('warn', 'Info message', 'Please add MailId');
    }
  }

  preview(data, type) {
    this.pdftool('reset');
    this.rotateimg('reset');
    this.downldata = data;
    const ext = data.fileName.split('.').pop();
    if (ext === 'png' || ext === 'jpg' || ext === 'JPG' || ext === 'gif' || ext === 'jpeg' || ext === 'psd' || ext === 'bmp') {
      if (data.researchDocTransId == 0 && (type != 'Screening' || type != 'FRScreening')) {
        const blob = new Blob([data.document1], { type: 'image/jpeg;base64' });
        const reader = new FileReader();
        reader.onloadend = (e) => {
          this.imageChangedEvent = reader.result;
          this.imageSource = this.sanitizer.bypassSecurityTrustUrl(this.imageChangedEvent);
        };
        reader.readAsDataURL(blob);
      } else if (type == 'Screening') {
        this.screeningService.downloadScreeningDocument(data.docId).subscribe(resp => {
          this.imageSource = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + resp.document);
        });
      } else if (type == 'FRScreening') {
        this.screeningService.downloadFrConDocument(data.researchDocTransId).subscribe(resp => {
          this.imageSource = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + resp.document);
        });
      } else if (data.researchDocTransId > 0 && (type != 'Screening' || type != 'FRScreening')) {
        if (this.empFlag === true) {
          this.screeningService.downloadEmpResearchDocument(data.researchDocTransId).subscribe(resp => {
            this.imageSource = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + resp.document);
          });
        } else if (this.empFlag === false) {
          this.screeningService.downloadInstResearchDocument(data.researchDocTransId).subscribe(resp => {
            this.imageSource = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + resp.document);
          });
        }
      }
      this.dialog.open(this.imgprDialog, { panelClass: 'myClass', disableClose: true });
    } else if (ext == 'pdf' || ext === 'PDF') {
      if (data.researchDocTransId == 0 && (type != 'Screening' || type != 'FRScreening')) {
        const blob = new Blob([data.document1], { type: 'application/octet-stream' });
        if (window.navigator && (window.navigator as any).msSaveOrOpenBlob) {
          (window.navigator as any).msSaveOrOpenBlob(blob, data.fileName);
        } else {
          const a = document.createElement('a');
          document.body.appendChild(a);
          a.setAttribute('style', 'display:none;');
          const csvUrl = window.URL.createObjectURL(blob);
          this.url = csvUrl;
        }
      } else if (type == 'Screening') {
        this.screeningService.downloadScreeningDocument(data.docId).subscribe(resp => {
          const blob = base64StringToBlob(resp.document, 'application/octet-stream');
          this.url = window.URL.createObjectURL(blob);
        });
      } else if (type == 'FRScreening') {
        this.screeningService.downloadFrConDocument(data.researchDocTransId).subscribe(resp => {
          const blob = base64StringToBlob(resp.document, 'application/octet-stream');
          this.url = window.URL.createObjectURL(blob);
        });
      } else if (data.researchDocTransId > 0 && (type != 'Screening' || type != 'FRScreening')) {
        if (this.empFlag === true) {
          this.screeningService.downloadEmpResearchDocument(data.researchDocTransId).subscribe(resp => {
            this.url = window.URL.createObjectURL(base64StringToBlob(resp.document, 'application/octet-stream'));
          });
        } else if (this.empFlag === false) {
          this.screeningService.downloadInstResearchDocument(data.researchDocTransId).subscribe(resp => {
            this.url = window.URL.createObjectURL(base64StringToBlob(resp.document, 'application/octet-stream'));
          });
        }
      }
      this.dialog.open(this.pdfDialog, { panelClass: 'myClass', disableClose: true });
    } else {
      this.downloadDoc(this.downldata, type);
    }
  }

  downloadDoc(data, type) {
    if (type == 'FrScreening' || data.isFRDocument === true) {
      if (data.researchDocTransId > 0) {
        this.screeningService.downloadFrConDocument(data.researchDocTransId).subscribe(resp => {
          this.common.downloadDocument(data.docId, resp.document, resp.fileName);
        });
      } else {
        this.common.saveByteArray(data.fileName, data.document1);
      }
    } else {
      if (data.docId > 0 && data.researchDocTransId == 0) {
        this.screeningService.downloadScreeningDocument(data.docId).subscribe(resp => {
          this.common.downloadDocument(data.docId, resp.document, resp.fileName);
        });
      } else if (data.researchDocTransId > 0) {
        if (this.empFlag === true) {
          this.screeningService.downloadEmpResearchDocument(data.researchDocTransId).subscribe(resp => {
            this.common.downloadDocument(data.docId, resp.document, resp.fileName);
          });
        } else if (this.empFlag === false) {
          this.screeningService.downloadInstResearchDocument(data.researchDocTransId).subscribe(resp => {
            this.common.downloadDocument(data.docId, resp.document, resp.fileName);
          });
        }
      } else {
        this.common.saveByteArray(data.fileName, data.document1);
      }
    }
  }

  pdftool(type: any) {
    switch (type) {
      case 'right': this.rvalue += 90; break;
      case 'left': this.rvalue -= 90; break;
      case 'zoomin': this.zoomval += 0.1; break;
      case 'zoomout': this.zoomval -= 0.1; break;
      case 'reset': this.zoomval = 1; this.rvalue = 0; break;
      case 'download': this.downloadDoc(this.downldata, type); break;
      default: break;
    }
  }

  zoomin() {
    var myImg = document.getElementById('imgpre');
    var currWidth = myImg.clientWidth;
    if (currWidth == 1500) return false;
    else { myImg.style.width = (currWidth + 100) + 'px'; }
  }

  zoomout() {
    var myImg = document.getElementById('imgpre');
    var currWidth = myImg.clientWidth;
    if (currWidth == 100) return false;
    else { myImg.style.width = (currWidth - 100) + 'px'; }
  }

  rotateimg(route: any) {
    this.dir = route;
    this.state = (this.state === 'default' ? 'rotated' : this.dir);
  }

  progresscalc() {
    let ques: any[] = [];
    var rem = this.ResearchQuestAnsValue.length;
    this.ResearchQuestAnsValue.forEach(cn => { if (cn.remarks !== null) ques.push(cn); });
    this.countq = (ques.length / rem) * 100;
    this.provalue = Math.ceil(this.countq);
    this.colorvalue = 'red';
    this.progresscalcav();
  }

  progresscalcav() {
    let ques: any[] = [];
    var rem = this.ResearchQuestAnsValue.length;
    this.ResearchQuestAnsValue.forEach(cn => ques.push(cn));
    const quesAv = ques.filter(e =>
      e.selectedOption > 0 &&
      e.researchDocument?.researchDocumentTrans?.length > 0
    );
    this.counta = (quesAv.length / rem) * 100;
    this.proAnsvalue = Math.ceil(this.counta);
  }
}

export class verificationRejectVM {
  screeningId: number;
  screeningCompId: number;
  loggedIn: number;
  comment: string;
}

class ResearchQuestAns {
  empInsVerificationId: number;
  empInsVerifyId: number;
  empInsId: number;
  questionId: number;
  questionName: string;
  displayOrder: number;
  verifyStep: number;
  loggedId: number;
  researchResultId: number;
  selectedOption: number;
  options: ResearchOptionVm[];
  businessCategoryId: number;
  researchDocument: ResearchDocument;
  document: ResearchDocumentTrans[];
  frConDocument: ResearchDocumentTrans[];
  remarks: string;
  rejectedRemarks: string;
  mcaCompanyStatus: number;
  paidUpCaptial: string;
  lastAGMDate: Date;
  noOfEmployee: number;
  paymentDetailsId: number;
  employeeRecordId: number;
  domainCreatedDate: Date;
  domainExpireDate: Date;
  annualMeetingDate: Date;
  universityTypeLookUpId: number;
  disciplinaryRemarks: string;
  businessCategoryLookupId: number;
  underReviewLookupId: number;
  researchConclusion: string;
  caseComments: string;
  cancelReason: string;
  categoryLookupId: number;
  categoryFlag: any;
}

class ResearchOptionVm {
  optionId: number;
  optionName: string;
  progressBarValue: number;
  detAvailable: boolean;
  subDetail: LookUpValueRQA[];
}

class LookUpValueRQA {
  contactId: number;
  lookUpCatId: number;
  lookupCatName: string;
  lookUpId?: number;
  lookUpName: string;
  active: boolean;
  lookUpValue: string;
  lookUpDesc: string;
  displayOrder: number;
  disabled: boolean;
}

class ResearchDocument {
  researchDocumentId: number;
  empInsVerificationId: number;
  questionId: number;
  researchDocumentTrans: ResearchDocumentTrans[] = [];
}

class ResearchDocumentTrans {
  researchDocumentId: number;
  researchDocTransId: number;
  docId: number;
  fileName: string;
  document: string;
  active: boolean;
  DelFlag: boolean;
  document1;
}

class sendverification {
  ClientMailId: verficationMail[] = [];
  EmailTemplate: string;
  Subject: string;
  LoggedIn: number;
  TemplateName: string;
  TeamName: string;
  IsDisclose: boolean;
}

class verficationMail {
  emailType: string;
  emailAddress: string;
  selected = false;
}