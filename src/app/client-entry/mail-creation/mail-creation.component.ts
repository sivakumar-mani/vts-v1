import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl, UntypedFormArray } from '@angular/forms';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { AgentEntryMasterService } from 'src/app/common-methods/services/agent-entry-master.service';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Router } from '@angular/router';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { CaseCreationView } from 'src/app/common-methods/models/caseCreationView';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  standalone: false,
  selector: 'app-mail-creation',
  templateUrl: './mail-creation.component.html',
  styleUrls: ['./mail-creation.component.css']
})
export class MailCreationComponent implements OnInit {
  index = -1;
  emailIds: any[] = [];
  selectedType: any;
  emailFormArray: UntypedFormArray;
  emailConfig: UntypedFormArray;
  emailViewFlag: boolean = false;
  emailcategoryname: string;
  emailcatid: any;
  emaildest: any;
  emailTypeData: any[] = [];
  colorStatus: colorStatusVM[];
  commonRepertType: any;
  emailData = new BehaviorSubject([]);
  emailLookUp: 0;
  categoryName: string;
  tempData: any[] = [];
  contactFilter = ['Email'];
  emailrowCount = 1;
  rowCount = 1;
  clientList: any[] = [];
  emailcategory: any;
  reporttype: any;
  siteList: any[] = [];
  templateList: any[] = [];
  mailcatList: any[] = [];
  mailTemplateVM = new MailTemplate();
  emailTemplateDetailVm = new EmailTemplateDetail();
  mailCreationForm: UntypedFormGroup;
  itemperpage;
  searchValueArr: any[] = [];
  showFlag = false;
  emailConfigForm: UntypedFormGroup;
  emailTemplateList: any[] = [];
  clientName!: AutoCompleteDropDown;
  siteControl!: AutoCompleteDropDown;
  templateControl!: AutoCompleteDropDown;
  mailCatControl!: AutoCompleteDropDown;
  editorText = '';

  // ─── FIX: replaces formControlName="htmlTemplateBody" on the editor ───────
  // @kolkov/angular-editor calls writeValue() before its own ngAfterViewInit,
  // so textArea.nativeElement is undefined when bound via formControlName.
  // Using a plain class property + [(ngModel)] standalone avoids this timing bug.
  htmlTemplateBodyValue = '';
  // ─────────────────────────────────────────────────────────────────────────

  columns = [
    { field: 'clientName', header: 'Client Name' },
    { field: 'siteName', header: 'Site Name' },
    { field: 'templateName', header: 'Template Name' },
    { field: 'emailCategory', header: 'Email Category' },
  ];
  frozenCols = [{ field: 'action', header: 'Action' }];
  userData: any;
  pathParameters: string[];
  routePath = 'Client / Email Creation';
  totalpages: number;

  // static: false — all three live inside *ngIf blocks
  @ViewChild('dt', { static: false }) dt!: Table;
  @ViewChild('global', { static: false }) global!: ElementRef;
  @ViewChild('amountCtl', { static: false }) amountCtl!: ElementRef<any>;

  currentPage = 1;
  tempCurrentPage = 1;
  typeOfAgreement: any;
  emailGroup: any;
  emailKey: any;
  breadcrumbFlags = new BreadcrumbFlags();
  screenAuth: any = {};
  categoryFilterList: any[] = [];
  emailCategoryList: any[] = [];
  emailCategory: any[] = [];
  emailCatKeyUp: boolean;
  clientlist: any[] = [];
  clientfilterlist: any[] = [];
  clientkeyUp: boolean;
  isEdit: boolean;

  @ViewChild('templateNameCtrlTrigger', { static: true }) templateNameCtrlTrigger: MatMenuTrigger;
  templateNameFilteredOptions: Observable<string[]>;
  templateNameControl = new UntypedFormControl();

  @ViewChild('emailGroupCtrlTrigger', { static: true }) emailGroupCtrlTrigger: MatMenuTrigger;
  compFilteredOptions: Observable<string[]>;
  emailGroupControl = new UntypedFormControl();

  @ViewChild('emailCategoryCtrlTrigger', { static: true }) emailCategoryCtrlTrigger: MatMenuTrigger;
  emailCategoryFilteredOptions: Observable<string[]>;
  emailCategoryControl = new UntypedFormControl();

  @ViewChild('templateSubjectCtrlTrigger', { static: true }) templateSubjectCtrlTrigger: MatMenuTrigger;
  @ViewChild('clientNameCtrlTrigger', { static: true }) clientNameCtrlTrigger: MatMenuTrigger;
  clientNameFilteredOptions: Observable<string[]>;
  clientNameControl = new UntypedFormControl();

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
      { name: 'quote', class: 'quote' },
      { name: 'redText', class: 'redText' },
      { name: 'titleText', class: 'titleText', tag: 'h1' },
    ],
    uploadUrl: 'v1/image',
    sanitize: false,
    toolbarPosition: 'top',
  };

  formBuilder: any;
  frequencyList: any;
  templateName: string;

  constructor(
    public screenService: ScreeningService,
    public common: CommonService,
    public agentEntryMasterService: AgentEntryMasterService,
    public master: MasterService,
    public dialog: MatDialog,
    private auth: AuthService,
    private fb: UntypedFormBuilder,
    private messageService: MessageService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.getDataList();
    this.getsendtype();
    this.breadcrumbFlags = this.common.breadcrumbFlags(true);
    this.breadcrumbFlags.btnReset = false;
    this.screenAuth = this.auth.getScreenAuth(this.router.url);
    this.itemperpage = 10;
  }

  getDataList() {
    this.getmailcat();
    this.getClients();
    this.initmailFormGroup();
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
      for (const ctrl in this.mailCreationForm.controls) {
        if (ctrl === event.propertyName) {
          const index = this.searchValueArr.findIndex(x => x.propertyName === ctrl);
          this.searchValueArr.splice(index, 1);
        }
      }
    }
  }

  initmailFormGroup() {
    this.mailCreationForm = new UntypedFormGroup({
      clientName: new UntypedFormControl('', Validators.required),
      siteControl: new UntypedFormControl(''),
      mailCatControl: new UntypedFormControl(0),
      templateControl: new UntypedFormControl(0)
    });
  }

  searchValue() {
    if (this.mailCreationForm.valid) {
      this.mailTemplateVM.clientId = this.mailCreationForm.value.clientName;
      this.mailTemplateVM.siteId = this.mailCreationForm.value.siteControl > 0 ? this.mailCreationForm.value.siteControl : 0;
      this.mailTemplateVM.loggedIn = this.userData.userId;
      this.mailTemplateVM.emailCategoryId = this.mailCreationForm.value.mailCatControl > 0 ? this.mailCreationForm.value.mailCatControl : 0;
      this.mailTemplateVM.emailTempId = this.mailCreationForm.value.templateControl > 0 ? this.mailCreationForm.value.templateControl : 0;
      this.screenService.searchMailConfig(
        this.mailTemplateVM.clientId,
        this.mailTemplateVM.siteId,
        this.mailTemplateVM.emailCategoryId,
        this.mailTemplateVM.emailTempId
      ).subscribe(res => {
        if (res == null || res.length === 0) {
          this.openLoadDialog();
        } else {
          this.emailTemplateList = res;
          this.emailTemplateList.forEach(ele => { ele.siteName = ele.siteName + '-' + ele.siteNo; });
          this.userTblAutoFilters();
        }
      });
    } else {
      this.mailCreationForm.markAllAsTouched();
      this.showTopCenter('warn', 'Failure Message', 'Please fill the required field');
    }
  }

  resetform() {
    this.mailCreationForm.reset();
    this.initmailFormGroup();
    this.emailTemplateList = [];
    this.initautoCompleteCtrl();
  }

  initautoCompleteCtrl() {
    this.clientName = new AutoCompleteDropDown('Client Name', 'clientName', 'id', 'name',
      this.clientList, '', this.mailCreationForm, false, false, true, 'standard');
    this.mailCatControl = new AutoCompleteDropDown('Email Category Type', 'mailCatControl', 'lookUpId',
      'lookUpName', this.mailcatList, '', this.mailCreationForm, false, false, false, 'standard');
    if (this.siteList.length > 0) {
      this.siteControl = new AutoCompleteDropDown('Site Name', 'siteControl', 'siteId',
        'siteName', this.siteList, '', this.mailCreationForm, false, false, false, 'standard');
    }
    this.templateControl = new AutoCompleteDropDown('Mail Template Name', 'templateControl', 'emailTemplateId',
      'emailTempleteName', this.templateList, '', this.mailCreationForm, false, false, false, 'standard');
  }

  getClients() {
    const data = new CaseCreationView();
    data.teamId = this.userData.teamId;
    data.applicationId = this.userData.applicationId;
    data.clientId = this.userData.clientId;
    data.teamName = this.userData.teamName;
    this.screenService.getClients(this.userData).subscribe(res => {
      if (res) {
        this.clientList = res;
        this.clientName = new AutoCompleteDropDown('Client Name', 'clientName', 'id', 'name',
          this.clientList, '', this.mailCreationForm, false, false, true, 'standard');
      }
    });
  }

  getmailcat() {
    this.screenService.getEmailTemcat().subscribe(res => {
      if (res) {
        this.mailcatList = res;
        this.mailCatControl = new AutoCompleteDropDown('Email Category Type', 'mailCatControl', 'lookUpId',
          'lookUpName', this.mailcatList, '', this.mailCreationForm, false, false, false, 'standard');
      }
    });
  }

  getsites(data: any) {
    if (data.value > 0) {
      this.siteList = [];
      this.screenService.getSiteById(data.value).subscribe(res => {
        if (res) {
          this.siteList = res;
          if (this.siteList.length > 0) {
            this.siteList.forEach(ele => { ele.siteName = ele.siteName + ele.siteNo; });
            this.mailCreationForm.get('siteControl')?.setValidators(Validators.required);
          } else {
            this.mailCreationForm.get('siteControl')?.setValue(0);
            this.mailCreationForm.get('siteControl')?.clearValidators();
            this.mailCreationForm.get('siteControl')?.updateValueAndValidity();
          }
          this.siteControl = new AutoCompleteDropDown('Site Name', 'siteControl', 'siteId',
            'siteName', this.siteList, '', this.mailCreationForm, false, false, true, 'standard');
        }
      });
    }
  }

  getTemplate(data: any) {
    if (data.value > 0) {
      this.screenService.getEmailTemplate(data.value).subscribe(res => {
        if (res) {
          this.templateList = res;
          this.templateControl = new AutoCompleteDropDown('Mail Template Name', 'templateControl', 'emailTemplateId',
            'emailTempleteName', this.templateList, '', this.mailCreationForm, false, false, false, 'standard');
        }
      });
    }
  }

  loadMailTemplate() {
    this.mailTemplateVM.clientId = this.mailCreationForm.value.clientName;
    this.mailTemplateVM.siteId = this.mailCreationForm.value.siteControl;
    this.mailTemplateVM.loggedIn = this.userData.userId;
    this.mailTemplateVM.emailCategoryId = this.mailCreationForm.value.emailCategoryId !== undefined
      ? this.mailCreationForm.value.emailCategoryId : 0;
    this.screenService.addMailCreationDetails(this.mailTemplateVM).subscribe(res => {
      if (res) {
        this.showTopCenter('success', 'Success Message', 'Added Successfully');
        this.searchValue();
        this.currentPage = 1;
        this.userTblAutoFilters();
      }
    });
  }

  getContactLookup() {
    this.master.GetContactLookup().subscribe(res => {
      if (res) {
        this.tempData = res;
        const emailLookUp = this.tempData.filter(f => this.contactFilter.some(s => s === f.lookUpName));
        this.emailLookUp = emailLookUp[0].lookUpId;
        this.emailConfigForm.get('emailClientUser.lookupId')?.setValue(this.emailLookUp);
      }
    });
  }

  // htmlTemplateBody is kept in the form for validation tracking,
  // but the editor is bound via [(ngModel)] to htmlTemplateBodyValue instead.
  // syncEditorToForm() copies the ngModel value into the form control before save/validate.
  private syncEditorToForm() {
    this.emailConfigForm.get('htmlTemplateBody')?.setValue(this.htmlTemplateBodyValue);
  }

  initFormGroup(mailFlag, tempName) {
    this.emailConfigForm = this.fb.group({
      htmlTemplateBody: ['', Validators.required],   // value synced manually via syncEditorToForm()
      templateSubject: ['', Validators.required],
      emailCategory: [''],
      clientName: ['', Validators.required],
      templateName: ['', Validators.required],
      discloseClientFlag: [false],
      sendFlag: new UntypedFormControl(false),
      siteId: [0],
      siteName: [''],
      clientId: ['', Validators.required],
      emailCategoryId: [0],
      emailTemplateId: [0],
      emailTempConfigId: [0],
      logginId: [this.userData.userId],
      sendTypeVm: [[], tempName === this.common.CONSOLIDATE_AND_CUMULATIVE_INSUFFICIENCY ? Validators.required : null],
      emailClientUser: mailFlag ? this.fb.array([]) : this.fb.array([
        this.fb.group({
          emailConfigUserId: new UntypedFormControl(0),
          emailTempConfigId: new UntypedFormControl(0),
          emailAddress: new UntypedFormControl('', Validators.compose(
            [Validators.pattern(this.common.EmailRegX), Validators.required])),
          deleteFlag: new UntypedFormControl(false),
          lookupId: new UntypedFormControl('', Validators.required),
          destName: new UntypedFormControl()
        }),
      ]),
      emailReportLookupId: new UntypedFormControl('', Validators.required),
      emailFrequencies: new UntypedFormControl('', Validators.required),
      EmailConfigColorCodeId: new UntypedFormControl(''),
      emailConfig: new UntypedFormGroup({
        siteNotifyId: new UntypedFormControl(0),
        categoryLookupId: new UntypedFormControl(''),
        sendTypeLookupId: new UntypedFormControl(),
        reportLookupId: new UntypedFormControl(),
        sendFlag: new UntypedFormControl(false),
        checkDuplicateFlag: new UntypedFormControl(false),
      })
    });
  }

  initemailfrm(): UntypedFormGroup {
    return this.fb.group({
      siteNotifyId: new UntypedFormControl(0),
      categoryLookupId: new UntypedFormControl(''),
      sendTypeLookupId: new UntypedFormControl(),
      reportLookupId: new UntypedFormControl(),
      emailClientUser: new UntypedFormGroup({
        lookupId: new UntypedFormControl(this.emailLookUp),
      }),
      sendFlag: new UntypedFormControl(false),
      checkDuplicateFlag: new UntypedFormControl(false),
    });
  }

  addemailfrm(index: number, addcontrol: boolean, duplicate: boolean) {
    this.emailConfig = this.emailConfigForm.get('emailConfig') as UntypedFormArray;
    const frmgroup = this.emailConfig.controls[index] as UntypedFormGroup;
    const controlNames = ['categoryLookupId', 'sendTypeLookupId', 'reportLookupId', 'emailAddress'];
    for (const ctrl in frmgroup.controls) {
      if (frmgroup.controls.hasOwnProperty(ctrl)) {
        if (controlNames.indexOf(ctrl) > -1) {
          if (ctrl === 'emailAddress') {
            frmgroup.get(ctrl).setValidators(Validators.compose(
              [Validators.pattern(this.common.EmailRegX), Validators.minLength(1), Validators.required]));
            frmgroup.get(ctrl).updateValueAndValidity();
          }
          if (frmgroup.get(ctrl).valid) {
            frmgroup.get(ctrl).markAsTouched();
            frmgroup.get(ctrl).setValidators(Validators.required);
            frmgroup.get(ctrl).updateValueAndValidity();
          }
        }
      }
    }
    if (this.emailConfig.controls[index].valid && addcontrol) {
      this.emailConfig.push(this.initemailfrm());
      this.emailrowCount = this.emailConfig.length;
      if (duplicate) {
        const duplicatevalue = this.emailConfig.controls[index].value;
        duplicatevalue.siteNotifyId = 0;
        this.emailConfig.controls[index + 1].patchValue(duplicatevalue);
        this.emailConfig.controls[index + 1].get('checkDuplicateFlag')?.setValue(false);
        this.categoryType();
      }
    }
  }

  removefrmControl(index: number) {
    if (this.emailConfig.length > 1) {
      const control = this.emailConfigForm.controls['emailConfig'] as UntypedFormArray;
      control.removeAt(index);
      this.emailrowCount = this.emailConfig.length;
    }
  }

  categoryType(): void {
    const control = this.emailConfigForm.controls.emailConfig as UntypedFormGroup;
    control.get('categoryLookupId')?.setValue(this.emailcatid);
    if (control.get('categoryLookupId')?.value) {
      const value = this.emailcategory.find(x => x.lookUpId === control.get('categoryLookupId')?.value);
      this.categoryName = value.lookUpName;
    }
    const catVal = control.get('categoryLookupId')?.value;
    if (catVal === 0 || catVal === '0' || catVal === '' || catVal === null) {
      control.get('sendTypeLookupId')?.disable();
      control.get('reportLookupId')?.disable();
      control.get('sendTypeLookupId')?.setValue(null);
      control.get('reportLookupId')?.setValue(null);
    } else {
      control.get('sendTypeLookupId')?.enable();
      control.get('reportLookupId')?.enable();
    }
    if (catVal > 0) {
      const catId = this.emailcategory.find(x => x.lookUpId === catVal);
      this.getReportType(catId.lookUpName);
    }
  }

  categoryTypeforDropDown(data: any, value): void {
    if (data.emailCategory === this.common.FINAL_REPORT) {
      this.getReportType(data.emailCategory, value);
    }
  }

  getReportType(lookupName, value?: any) {
    this.master.getReportTypeByCatId(lookupName).subscribe(resp => {
      if (resp) {
        this.reporttype = resp;
        if (this.screenService.tempResetData.emailCategory === this.common.FINAL_REPORT) {
          if (value && value.length > 0) {
            const compList: any[] = [];
            value.forEach(ele => {
              const dataList = this.reporttype.find(x => x.lookUpId === ele);
              if (dataList) { dataList.emailReportLookupId = ele; compList.push(dataList); }
            });
            this.emailConfigForm.get('emailReportLookupId')?.setValue(compList);
          }
        }
        if (this.commonRepertType) {
          if (this.commonRepertType.length > 0) {
            if (this.commonRepertType[0].lookUpId !== resp[0].lookUpId) {
              this.commonRepertType = this.common.CloneObject(this.commonRepertType.concat(resp));
            }
          }
        } else {
          this.commonRepertType = this.common.CloneObject(resp);
        }
      }
    });
  }

  clientKeyupFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    }
    this.clientkeyUp = !!value;
  }

  get displayclientFn() {
    return (client) => {
      if (client == null || client === undefined) { return null; }
      if (client && this.clientfilterlist?.length > 0) {
        const found = this.clientfilterlist.find(x => x.clientId === client);
        return found?.clientName ?? null;
      }
      return null;
    };
  }

  clientItems(value: any) {
    if (!value) { this.assignResourceCopy1(); return; }
    this.clientfilterlist = Object.assign([], this.clientlist).filter(
      item => item.clientName.toLowerCase().indexOf(value.toLowerCase()) > -1);
  }

  assignResourceCopy1() {
    this.clientfilterlist = Object.assign([], this.clientlist);
  }

  getEmailLookUp() {
    this.master.getEmailConfigLookupDet(false).subscribe(resp => {
      if (resp) {
        this.emailGroup = resp.emailGroup;
        this.emailCategoryList = resp.emailCategory;
        this.clientlist = resp.client;
        this.clientlist.sort((a, b) => a.clientName.localeCompare(b.clientName));
        this.clientlist.splice(0, 0, { clientId: 'Default', clientName: 'Default', active: true });
      } else {
        this.clientlist.push({ clientId: 'Default', clientName: 'Default', active: true });
      }
      this.clientItems('');
      this.emailCategoryItems('');
    });
  }

  emailCategoryItems(value: any) {
    if (!value) { this.assignResourceCopy(); return; }
    this.categoryFilterList = Object.assign([], this.emailCategoryList).filter(
      item => item.lookUpName.toLowerCase().indexOf(value.toLowerCase()) > -1);
  }

  assignResourceCopy() {
    this.categoryFilterList = Object.assign([], this.emailCategoryList);
  }

  emailCatKeyUpFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    }
    this.emailCatKeyUp = !!value;
  }

  get displayemailCategoryFn() {
    return (emailCategory) => {
      if (emailCategory == null || emailCategory === undefined) { return null; }
      if (emailCategory && this.categoryFilterList?.length > 0) {
        const found = this.categoryFilterList.find(x => x.lookUpId === emailCategory);
        return found?.lookUpName ?? '';
      }
      return null;
    };
  }

  getsendtype() {
    this.screenService.getGetSendType().subscribe(resp => { this.colorStatus = resp; });
  }

  getEmailFrequency() {
    this.master.getFrequencyMas().subscribe(res => { if (res) { this.frequencyList = res; } });
  }

  editEmailTemplate(id: number, data?: any) {
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.breadcrumbFlags.btnSave = true;
    this.breadcrumbFlags.btnReset = false;
    this.common.breadcrumbFlag.toolTip = 'Update';

    this.screenService.getMailTemplatebyId(id).subscribe(resp => {
      this.emailViewFlag = resp.systemFlag;
      this.templateName = resp.templateName;

      // Single initFormGroup call with correct flags from response
      this.initFormGroup(resp.systemFlag, resp.templateName);

      this.screenService.tempResetData = resp;
      this.emailcategoryname = resp.emailCategory;

      this.categoryTypeforDropDown(data, this.screenService.tempResetData.emailReportLookupId);

      if ((resp.emailClientUser?.length ?? 0) > 0) {
        (this.emailConfigForm as UntypedFormGroup).removeControl('emailClientUser');
      }

      this.getMailType();

      if (this.templateName === this.common.Consolidated_pending_insufficiencies) {
        this.getEmailFrequency();
      }

      this.emailConfigForm.addControl(
        'emailClientUser',
        this.initMailIdsForm(resp.emailClientUser ?? [])
      );

      // Set editor editable for edit mode
      this.editorConfig = { ...this.editorConfig, editable: true };

      // Show the form first so the editor component mounts
      this.showFlag = true;

      // Defer all patchValue calls to next tick so the editor's ngAfterViewInit runs first.
      // htmlTemplateBody is set via htmlTemplateBodyValue (ngModel), NOT via patchValue,
      // which avoids the formControlName writeValue → textArea.nativeElement crash.
      setTimeout(() => {
        this.htmlTemplateBodyValue = resp.htmlTemplateBody || '';

        this.emailConfigForm.patchValue({
          // htmlTemplateBody intentionally omitted — editor uses ngModel
          sendTypeVm: this.screenService.tempResetData.sendTypeVm,
          templateSubject: this.screenService.tempResetData.templateSubject,
          emailCategory: this.screenService.tempResetData.emailCategory,
          templateName: this.screenService.tempResetData.templateName,
          siteName: this.screenService.tempResetData.siteName,
          discloseClientFlag: this.screenService.tempResetData.discloseClientFlag ?? false,
          siteId: this.screenService.tempResetData.siteId,
          clientId: this.screenService.tempResetData.clientId,
          clientName: this.screenService.tempResetData.clientName,
          emailCategoryId: this.screenService.tempResetData.emailCategoryId,
          emailTemplateId: this.screenService.tempResetData.emailTemplateId,
          emailTempConfigId: this.screenService.tempResetData.emailTempConfigId,
          sendFlag: this.screenService.tempResetData.sendFlag,
          logginId: this.userData.userId,
          emailReportLookupId: this.screenService.tempResetData.emailReportLookupId,
          emailFrequencies: this.screenService.tempResetData.emailFrequencies,
          emailConfigColorCodeId: this.screenService.tempResetData.emailConfigColorCodeId
        });

        this.emailFormArray = this.emailConfigForm.get('emailClientUser') as UntypedFormArray;
        this.rowCount = this.emailFormArray.length;

        if (this.screenService.tempResetData.emailCategory === this.common.INSUF_NOTIFICATION) {
          const val = this.screenService.tempResetData.sendTypeVm;
          if (val?.length > 0) {
            const compList: any[] = [];
            val.forEach(ele => {
              const dataList = this.colorStatus.find(x => x.sendTypeLookupId === ele.sendTypeLookupId);
              if (dataList) { dataList.attachmentId = ele.attachmentId; compList.push(dataList); }
            });
            this.emailConfigForm.get('sendTypeVm')?.setValue(compList);
          }
        }
      }, 0);
    });
  }

  getMailType() {
    this.screenService.getMailTemplateType().subscribe((resp: any) => {
      if (resp) { this.emailTypeData = resp; }
    });
  }

  initMailIdsForm(posData: any[]): UntypedFormArray {
    const arr = this.fb.array([]);
    if (posData?.length > 0) {
      posData.forEach(item => {
        arr.push(new UntypedFormGroup({
          emailConfigUserId: new UntypedFormControl(item.emailConfigUserId),
          emailTempConfigId: new UntypedFormControl(item.emailTempConfigId),
          emailAddress: new UntypedFormControl(item.emailAddress),
          lookupId: new UntypedFormControl(item.lookupId),
          deleteFlag: new UntypedFormControl(false),
        }));
      });
    }
    return arr;
  }

  checkForTemplate() {
    if (
      this.emailConfigForm.controls.emailGroupLookupId.value > 0 &&
      this.emailConfigForm.controls.emailCatLookupId.value > 0 &&
      (this.emailConfigForm.controls.clientId.value > 0 ||
        this.emailConfigForm.controls.clientId.value === 'Default')
    ) {
      this.emailConfigForm.controls.templateName.markAsUntouched();
    }
  }

  getTemplateValidation() {
    this.master.checkTemplateValidation(
      this.emailConfigForm.controls.emailCatLookupId.value,
      this.emailConfigForm.controls.emailGroupLookupId.value,
      '' + this.emailConfigForm.controls.clientId.value,
      this.emailConfigForm.controls.templateName.value
    ).subscribe(resp => {
      if (resp?.success === false) {
        this.showTopCenter('warn', 'Failure Message', 'This template is already available');
        this.emailConfigForm.controls.templateName.setValue('');
      }
    });
  }

  public openDialog(data: any) {
    const popupData = {
      action: this.common.DELETECONFIRMATION,
      headerText: 'Confirmation',
      bodyText: 'Are you sure you want to delete this Email Template?'
    };
    const dialogRef = this.dialog.open(CommonAlertsComponent, {
      width: '320px', data: popupData, disableClose: true
    });
    dialogRef?.afterClosed().subscribe(result => {
      if (result && String(result.type) === this.common.DELETECONFIRMATION) {
        this.deleteEmailTemplate(data);
      }
    });
  }

  deleteEmailTemplate(rowData: any) {
    this.screenService.deleteMailTemplatebyId(rowData.emailTempConfigId, this.userData.userId).subscribe(resp => {
      if (resp) {
        this.showTopCenter('error', 'Success Message', 'Deleted Successfully');
        this.searchValue();
      }
    });
  }

  public openLoadDialog() {
    const popupData = {
      action: this.common.DELETECONFIRMATION,
      headerText: 'Confirmation',
      bodyText: 'Select Yes,Continue to load all email template'
    };
    const dialogRef = this.dialog.open(CommonAlertsComponent, {
      width: '320px', data: popupData, disableClose: true
    });
    dialogRef?.afterClosed().subscribe(result => {
      if (result && String(result.type) === this.common.DELETECONFIRMATION) {
        this.loadMailTemplate();
      }
    });
  }

  addEmailConfig() {
    this.common.breadcrumbFlag.toolTip = 'Save';
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.showFlag = !this.showFlag;
  }

  onChange(e: any) {
    this.selectedType = e.value;
  }

  saveEmailConfig() {
    // Sync the editor's ngModel value into the form control before validation
    this.syncEditorToForm();

    let formValueRaw = this.emailConfigForm.getRawValue();

    if (this.templateName !== this.common.Consolidated_pending_insufficiencies) {
      this.emailConfigForm.get('emailFrequencies')?.clearValidators();
      this.emailConfigForm.get('emailFrequencies')?.updateValueAndValidity();
    } else {
      this.emailConfigForm.get('emailFrequencies')?.setValidators(Validators.required);
      this.emailConfigForm.get('emailFrequencies')?.updateValueAndValidity();
    }
    this.emailConfigForm.get('emailReportLookupId')?.clearValidators();
    this.emailConfigForm.get('emailReportLookupId')?.updateValueAndValidity();

    if (this.emailConfigForm.valid) {
      const list: any[] = [];
      formValueRaw.emailClientUser.forEach(ele1 => {
        const value = this.emailTypeData.find(x => x.lookUpId === ele1.lookupId);
        list.push(value.lookUpName);
      });

      const list1: any[] = [];
      formValueRaw.emailReportLookupId?.forEach(ele2 => {
        if (ele2 != null) { list1.push(ele2.lookUpId); }
      });
      if (list1?.length > 0) { formValueRaw.emailReportLookupId = list1; }

      if (formValueRaw.emailCategory === this.common.INSUF_NOTIFICATION) {
        if (formValueRaw.sendTypeVm != null) {
          formValueRaw.sendTypeVm = formValueRaw.sendTypeVm.reduce((acc, curr) => {
            return acc.find(item => item.sendTypeLookupId === curr.sendTypeLookupId)
              ? acc : acc.concat(curr);
          }, []);
        }
      }

      if (this.emailViewFlag || (!this.emailViewFlag && list.includes(this.common.DEST_TYPE_TO))) {
        formValueRaw.clientId = '' + formValueRaw.clientId;
        formValueRaw.emailClientUser.forEach(ele => {
          ele.emailTempConfigId = this.screenService.tempResetData.emailTempConfigId;
        });
        this.screenService.addupdateMailCreationDetails(formValueRaw).subscribe(resp => {
          if (resp) {
            if (this.emailConfigForm.controls.emailTempConfigId.value > 0) {
              this.isEdit = false;
              this.showTopCenter('success', 'Success Message', 'Updated Successfully');
            } else {
              this.showTopCenter('success', 'Success Message', 'Added Successfully');
            }
            this.emailConfigForm.reset();
            this.htmlTemplateBodyValue = '';
            this.searchValue();
            this.back();
          }
        });
      } else {
        this.showTopCenter('warn', 'Failure Message', 'Please select atleast one Email Type To');
      }
    } else {
      this.emailConfigForm.markAllAsTouched();
    }
  }

  back() {
    this.emailConfigForm?.reset();
    this.htmlTemplateBodyValue = '';
    this.currentPage = 1;
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.showFlag = false;
    this.screenService.tempResetData = '';
    this.breadcrumbFlags.btnSave = false;
    this.breadcrumbFlags.btnReset = false;
    this.editorConfig = { ...this.editorConfig, editable: true }; // reset for next open
  }

  reset() {
    if (this.emailConfigForm.controls.emailTempConfigId.value > 0) {
      this.htmlTemplateBodyValue = this.screenService.tempResetData.htmlTemplateBody || '';
      this.emailConfigForm.patchValue({
        emailCatLookupId: this.screenService.tempResetData.emailCatLookupId,
        emailGroupLookupId: this.screenService.tempResetData.emailGroupLookupId,
        emailTemplateId: this.screenService.tempResetData.emailTemplateId,
        templateName: this.screenService.tempResetData.templateName,
        siteName: this.screenService.tempResetData.siteName,
        clientId: this.screenService.tempResetData.clientId,
        templateSubject: this.screenService.tempResetData.templateSubject,
        emailCategory: this.screenService.tempResetData.emailCategory,
      });
    } else {
      this.htmlTemplateBodyValue = '';
      this.emailConfigForm.reset();
    }
  }

  showTopCenter(level: string, info: string, message: string) {
    this.messageService.add({ severity: level, summary: info, detail: message });
  }

  getTotalPages(totalRecords, rows) {
    this.totalpages = Math.ceil(totalRecords / rows);
    return this.totalpages;
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

  private userTblAutoFilters(): void {
    const unique = (arr: any[], key: string) =>
      (Array.from(new Set(arr.map(x => x[key]).filter(x => x))).sort() as string[]);

    this.templateNameFilteredOptions = this.templateNameControl.valueChanges.pipe(
      startWith(''), map(v => unique(this.emailTemplateList, 'templateName').filter(o => o.toLowerCase().includes(v))));
    this.compFilteredOptions = this.emailGroupControl.valueChanges.pipe(
      startWith(''), map(v => unique(this.emailTemplateList, 'emailGroup').filter(o => o.toLowerCase().includes(v))));
    this.clientNameFilteredOptions = this.clientNameControl.valueChanges.pipe(
      startWith(''), map(v => unique(this.emailTemplateList, 'clientName').filter(o => o.toLowerCase().includes(v))));
    this.emailCategoryFilteredOptions = this.emailCategoryControl.valueChanges.pipe(
      startWith(''), map(v => unique(this.emailTemplateList, 'emailCategory').filter(o => o.toLowerCase().includes(v))));
  }

  // Null guards for all three ViewChildren — they are inside *ngIf blocks
  // and may be undefined when resetTable() is called.
  resetTable() {
    if (this.dt) { this.dt.reset(); }
    if (this.global?.nativeElement) { this.global.nativeElement.value = ''; }
    if (this.amountCtl?.nativeElement) { this.amountCtl.nativeElement.value = ''; }
    this.templateNameControl.reset();
    this.emailGroupControl.reset();
    this.clientNameControl.reset();
    this.emailCategoryControl.reset();
    this.userTblAutoFilters();
    this.mailCreationForm.reset();
    this.initmailFormGroup();
    this.emailTemplateList = [];
    this.initautoCompleteCtrl();
  }

  closeMenu(col: any) {
    switch (col) {
      case 'emailGroup': this.emailGroupCtrlTrigger.closeMenu(); break;
      case 'templateName': this.templateNameCtrlTrigger.closeMenu(); break;
      case 'clientName': this.clientNameCtrlTrigger.closeMenu(); break;
      case 'requestedBy': this.emailCategoryCtrlTrigger.closeMenu(); break;
      case 'templateSubject': this.templateSubjectCtrlTrigger.closeMenu(); break;
      default: break;
    }
  }

  viewDetail(id: number, data: any) {
    this.breadcrumbFlags.btnBack = true;
    this.breadcrumbFlags.btnReset = false;
    this.breadcrumbFlags.btnResetTbl = false;
    this.breadcrumbFlags.btnSave = false;
    this.breadcrumbFlags.btnAdd = false;

    this.screenService.getMailTemplatebyId(id).subscribe(resp => {
      this.emailViewFlag = resp.systemFlag;

      // Single initFormGroup call
      this.initFormGroup(resp.systemFlag, resp.templateName);

      this.getMailType();
      this.screenService.tempResetData = resp;
      this.emailcategoryname = resp.emailCategory;

      this.categoryTypeforDropDown(data, this.screenService.tempResetData.emailReportLookupId);

      if ((resp.emailClientUser?.length ?? 0) > 0) {
        (this.emailConfigForm as UntypedFormGroup).removeControl('emailClientUser');
      }

      this.emailConfigForm.addControl(
        'emailClientUser',
        this.initMailIdsForm(resp.emailClientUser ?? [])
      );

      // Set editor to read-only for view mode
      this.editorConfig = { ...this.editorConfig, editable: false };

      // Show form before patching
      this.showFlag = true;

      // Defer patchValue — same reason as editEmailTemplate
      setTimeout(() => {
        this.htmlTemplateBodyValue = resp.htmlTemplateBody || '';

        this.emailConfigForm.patchValue({
          // htmlTemplateBody intentionally omitted — editor uses ngModel
          sendTypeVm: this.screenService.tempResetData.sendTypeVm,
          templateSubject: this.screenService.tempResetData.templateSubject,
          templateName: this.screenService.tempResetData.templateName,
          emailCategory: this.screenService.tempResetData.emailCategory,
          siteName: this.screenService.tempResetData.siteName,
          discloseClientFlag: this.screenService.tempResetData.discloseClientFlag ?? false,
          siteId: this.screenService.tempResetData.siteId,
          clientId: this.screenService.tempResetData.clientId,
          clientName: this.screenService.tempResetData.clientName,
          emailCategoryId: this.screenService.tempResetData.emailCategoryId,
          emailTemplateId: this.screenService.tempResetData.emailTemplateId,
          emailTempConfigId: this.screenService.tempResetData.emailTempConfigId,
          sendFlag: this.screenService.tempResetData.sendFlag,
          logginId: this.userData.userId,
          emailReportLookupId: this.screenService.tempResetData.emailReportLookupId,
          emailConfigColorCodeId: this.screenService.tempResetData.emailConfigColorCodeId
        });

        if (this.screenService.tempResetData.emailCategory === this.common.INSUF_NOTIFICATION) {
          const val = this.screenService.tempResetData.sendTypeVm;
          if (val?.length > 0) {
            const compList: any[] = [];
            val.forEach(ele => {
              const dataList = this.colorStatus.find(x => x.sendTypeLookupId === ele.sendTypeLookupId);
              if (dataList) { dataList.attachmentId = ele.attachmentId; compList.push(dataList); }
            });
            this.emailConfigForm.get('sendTypeVm')?.setValue(compList);
          }
        }

        this.emailFormArray = this.emailConfigForm.get('emailClientUser') as UntypedFormArray;
        this.rowCount = this.emailFormArray.length;
        this.emailConfigForm.disable();
      }, 0);
    });
  }

  showall() {
    if (this.emailTemplateList.length > 0) { this.itemperpage = this.emailTemplateList.length; }
  }

  lookupChange(e: any) {
    const typeList = this.emailTypeData.filter(x => x.lookUpId === e);
    const frmGroup = this.emailFormArray.controls[this.rowCount - 1] as UntypedFormGroup;
    frmGroup.get('destName')?.setValue(typeList[0].lookUpName);
  }

  getContactFormGroup() {
    return (this.emailConfigForm.get('emailClientUser') as UntypedFormArray).controls;
  }

  checkValidEmail(ind, emailVal) {
    const formData = this.emailConfigForm.get('emailClientUser')?.value;
    this.emailFormArray = this.emailConfigForm.get('emailClientUser') as UntypedFormArray;
    const frmGroup = this.emailFormArray.controls[ind] as UntypedFormGroup;
    if (frmGroup.valid) {
      const exist = formData.some((s, i) =>
        s.emailAddress === frmGroup.value.emailAddress && i !== ind);
      frmGroup.get('emailAddress')?.setErrors(exist ? { alreadyExist: true } : null);
    }
  }

  addItem(index, value): void {
    const formData = this.emailConfigForm.get('emailClientUser')?.value;
    this.emailFormArray = this.emailConfigForm.get('emailClientUser') as UntypedFormArray;

    const newRow = () => this.fb.group({
      emailConfigUserId: new UntypedFormControl(0),
      emailTempConfigId: new UntypedFormControl(0),
      emailAddress: new UntypedFormControl('', Validators.compose(
        [Validators.pattern(this.common.EmailRegX), Validators.required])),
      deleteFlag: new UntypedFormControl(false),
      lookupId: new UntypedFormControl('', Validators.required),
      destName: new UntypedFormControl()
    });

    if (value) {
      const frmGroup = this.emailFormArray.controls[index] as UntypedFormGroup;
      if (frmGroup.valid) {
        const exist = formData.some((s, i) => s.contactData === frmGroup.value && i !== index);
        if (exist) {
          frmGroup.get('emailAddress')?.setErrors({ alreadyExist: true });
        } else {
          this.emailFormArray.push(newRow());
        }
      } else {
        frmGroup.setValidators([Validators.required, Validators.pattern(this.common.EmailRegX)]);
        frmGroup.markAsTouched();
        frmGroup.markAsDirty();
        frmGroup.updateValueAndValidity();
      }
    } else {
      this.emailFormArray.push(newRow());
    }
    this.rowCount = this.emailFormArray.length;
  }

  emailValidation(index, emailType) {
    if (emailType === true) {
      const frmGroup = this.emailFormArray.controls[index] as UntypedFormGroup;
      if (!frmGroup.value) {
        frmGroup.setValidators(Validators.required);
        frmGroup.markAsTouched();
        frmGroup.markAsDirty();
        frmGroup.updateValueAndValidity();
      }
    }
  }

  removeControl(data: any) {
    const frmgroup = this.emailConfigForm.get('emailClientUser') as UntypedFormArray;
    if (frmgroup.controls[data].get('emailConfigUserId')?.value > 0) {
      frmgroup.controls[data].get('deleteFlag')?.setValue(true);
      this.rowCount = this.emailFormArray.length - 1;
    } else {
      frmgroup.removeAt(data);
      this.emailIds.splice(data);
      this.rowCount = this.emailFormArray.length;
    }
    this.index = -1;
  }
}

export class MailTemplate {
  siteId: number;
  clientId: number;
  emailCategoryId: number;
  emailTempId: number;
  loggedIn: number;
}

export class EmailTemplateDetail {
  htmlTemplateBody: string;
  templateSubject: string;
  siteId: number;
  clientId: number;
  loggedIn: number;
  discloseClientFlag: boolean;
  emailCategoryId: number;
  emailTemplateId: number;
  emailTempConfigId: number;
  sendFlag: boolean;
}

class colorStatusVM {
  attachmentId: number;
  sendTypeLookupId: number;
  active: boolean;
}