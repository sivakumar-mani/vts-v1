import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';
import { CommonService } from 'src/app/common-methods/services/common.service';

import { AgentEntryMasterService } from 'src/app/common-methods/services/agent-entry-master.service';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  standalone: false,
  selector: 'app-system-notifications',
  templateUrl: './system-notifications.component.html',
  styleUrls: ['./system-notifications.component.css']
})
export class SystemNotificationsComponent implements OnInit {
  // editorText = '';
  // routePath = 'Configure / System Notifications';
  // breadcrumbFlags = new BreadcrumbFlags();

  // // editorConfig: AngularEditorConfig = {
  // //   editable: true,
  // //   spellcheck: true,
  // //   height: '25rem',
  // //   minHeight: '5rem',
  // //   placeholder: 'Enter text here...',
  // //   translate: 'no',
  // //   uploadUrl: 'v1/images', // if needed
  // //   customClasses: [ // optional
  // //     {
  // //       name: 'quote',
  // //       class: 'quote',
  // //     },
  // //     {
  // //       name: 'redText',
  // //       class: 'redText'
  // //     },
  // //     {
  // //       name: 'titleText',
  // //       class: 'titleText',
  // //       tag: 'h1',
  // //     },
  // //   ]
  // // };
  // constructor() { }

  // ngOnInit() {
  //   // this.breadcrumbFlags.toolTip = 'Save';
  //   // this.breadcrumbFlags.btnSave = true;
  //   // this.breadcrumbFlags.btnReset = true;
  // }
  // resetForm() {
  //   console.log('reset');
  // }
  // saveSysNotifications() {
  //   console.log('save');
  // }
  itemperpage;
  showFlag = false;
  emailConfigForm: UntypedFormGroup;
  emailTemplateList: any[] = [];
  editorText = '';
  columns = [
    { field: 'action', header: 'Action', value: true, disabled: true },
    { field: 'emailGroup', header: 'Email Group' },
    { field: 'emailCategory', header: 'Email Category' },
    { field: 'templateName', header: 'Template Name' },
    { field: 'clientName', header: 'Client Name' },
    { field: 'templateSubject', header: 'Subject' },
  ];
  frozenCols = [
    { field: 'action', header: 'Action' },
  ];
  userData: any;
  pathParameters: string[];
  routePath = 'Configure / Mail Config / Email Template';
  totalpages: number;
   @ViewChild('dt', { static: false }) dt!: Table;
  @ViewChild('global', { static: true }) global!: ElementRef;
 @ViewChild('amountCtl', { static: true }) 
amountCtl!: ElementRef<any>;
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
    // toolbarHiddenButtons: [
    //   {'bold'}, 
    //   {'italic'},
    //   {'fontSize'}
    // ]
  };
  constructor(public common: CommonService, public agentEntryMasterService: AgentEntryMasterService,
    public master: MasterService, public dialog: MatDialog, private auth: AuthService,
    private fb: UntypedFormBuilder, private messageService: MessageService, private router: Router, ) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.initFormGroup();
    this.breadcrumbFlags = this.common.breadcrumbFlags(true);
    this.screenAuth = this.auth.getScreenAuth(this.router.url);
    this.getEmailLookUp();
    this.getEmailTemplate();
    this.disableControl();
    this.itemperpage = 10;

  }
  disableControl() {
    this.emailConfigForm.get('emailGroupLookupId')?.disable();
    this.emailConfigForm.get('emailCatLookupId')?.disable();
    this.emailConfigForm.get('clientId')?.disable();
  }
  initFormGroup() {
    this.emailConfigForm = this.fb.group({
      emailEventId: [0],
      emailTemplateId: [0],
      emailGroupLookupId: ['', Validators.required],
      emailCatLookupId: ['', Validators.required],
      templateName: ['', Validators.required],
      clientId: ['', Validators.required],
      htmlTemplateBody: ['', Validators.required],
      templateSubject: ['', Validators.required],
      createdUserId: [this.userData.userId]
    });
    this.emailConfigForm.controls.templateName.disable();
  }

  clientKeyupFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        const client = this.clientfilterlist.filter(e =>
          e.clientName.toLowerCase() === value.toLowerCase());
        if (client.length > 0) {
          this.clientkeyUp = true;
        } else {
          this.clientkeyUp = true;
        }
      } else {
        this.clientkeyUp = false;
      }
    }
  }
  get displayclientFn() {
    const clientNew = (client) => {
      if (client == null || client === undefined) {
        return null;
      } else {
        if (client && this.clientfilterlist && this.clientfilterlist.length > 0) {
          client = this.clientfilterlist.find(x => x.clientId === client);
          return client.clientName;
        } else {
          return null;
        }
      }
    };
    return clientNew;
  }

  // Resource ..
  clientItems(value: any) {
    if (!value) { this.assignResourceCopy1(); }
    if (value) {
      this.clientfilterlist = Object.assign([], this.clientlist).filter(
        item => ((item.clientName.toLowerCase().indexOf(value.toLowerCase()) > -1)));
    }

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
        this.clientlist.splice(0, 0, {
          clientId: 'Default', clientName: 'Default',
          active: true,
        });
      } else {
        this.clientlist.push({
          clientId: 'Default', clientName: 'Default', active: true,
        });
      }
      this.clientItems('');
      this.emailCategoryItems('');
    });
  }
  emailCategoryItems(value: any) {
    if (!value) { this.assignResourceCopy(); }
    if (value) {
      this.categoryFilterList = Object.assign([], this.emailCategoryList).filter(
        item => ((item.lookUpName.toLowerCase().indexOf(value.toLowerCase()) > -1)));
    }

  }

  assignResourceCopy() {
    this.categoryFilterList = Object.assign([], this.emailCategoryList);
  }
  emailCatKeyUpFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        const emailCategory = this.categoryFilterList.filter(e =>
          e.lookUpName.toLowerCase() === value.toLowerCase());
        if (emailCategory.length > 0) {
          this.emailCatKeyUp = true;
        } else {
          this.emailCatKeyUp = true;
        }
      } else {
        this.emailCatKeyUp = false;
      }
    }
  }
  get displayemailCategoryFn() {
    const emailCategoryNew = (emailCategory) => {
      if (emailCategory == null || emailCategory === undefined) {
        return null;
      } else {
        if (emailCategory && this.categoryFilterList && this.categoryFilterList.length > 0) {
          emailCategory = this.categoryFilterList.find(x => x.lookUpId === emailCategory);
          return emailCategory.lookUpName ? emailCategory.lookUpName : '';
        } else {
          return null;
        }
      }
    };
    return emailCategoryNew;
  }
  getEmailTemplate() {
    this.master.getEmailTemplates().subscribe(resp => {
      this.emailTemplateList = resp;
      this.currentPage = 1;
      this.userTblAutoFilters();
    });
  }
  editEmailTemplate(id: number) {
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.showFlag = !this.showFlag;
    this.common.breadcrumbFlag.toolTip = 'Update';
    this.master.getEmailTemplateById(id).subscribe(resp => {
      this.common.tempResetData = resp;
      if (this.common.tempResetData.clientId !== 'Default') {
        this.common.tempResetData.clientId = + resp.clientId;
      }
      this.emailConfigForm.patchValue({
        emailEventId: this.common.tempResetData.emailEventId,
        emailCatLookupId: this.common.tempResetData.emailCatLookupId,
        emailGroupLookupId: this.common.tempResetData.emailGroupLookupId,
        emailTemplateId: this.common.tempResetData.emailTemplateId,
        templateName: this.common.tempResetData.templateName,
        clientId: this.common.tempResetData.clientId,
        htmlTemplateBody: this.common.tempResetData.htmlTemplateBody,
        templateSubject: this.common.tempResetData.templateSubject,
      });
    });
    this.emailConfigForm.controls.templateName.enable();
  }
  checkForTemplate() {
    if (this.emailConfigForm.controls.emailGroupLookupId.value > 0 && this.emailConfigForm.controls.emailCatLookupId.value > 0
      && (this.emailConfigForm.controls.clientId.value > 0 || this.emailConfigForm.controls.clientId.value === 'Default')) {
      this.emailConfigForm.controls.templateName.enable();
      this.emailConfigForm.controls.templateName.setValue('');
      this.emailConfigForm.controls.templateName.markAsUntouched();
    }
  }
  getTemplateValidation() {
    this.master.checkTemplateValidation(this.emailConfigForm.controls.emailCatLookupId.value,
      this.emailConfigForm.controls.emailGroupLookupId.value, '' + this.emailConfigForm.controls.clientId.value,
      this.emailConfigForm.controls.templateName.value).subscribe(resp => {
        if (resp) {
          if (resp.success === false) {
            this.showTopCenter('warn', 'Failure Message', 'This template is already available');
            this.emailConfigForm.controls.templateName.setValue('');
          }
        }
      });
  }
  public openDialog(data: any) {
    const popupData = {
      action: this.common.DELETECONFIRMATION,
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
            this.deleteEmailTemplate(data);
          }
        }
      });
    }
  }
  deleteEmailTemplate(rowData: any) {
    this.master.deleteEmailTemplate(rowData.emailTemplateId, this.userData.userId).subscribe(resp => {
      if (resp) {
        this.showTopCenter('error', 'Success Message', 'Deleted Successfully');
        this.getEmailTemplate();
      }
    });
  }
  addEmailConfig() {
    this.initFormGroup();
    this.common.breadcrumbFlag.toolTip = 'Save';
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.showFlag = !this.showFlag;
  }
  saveEmailConfig() {
    let formValueRaw = this.emailConfigForm.getRawValue();
    formValueRaw.clientId = '' + formValueRaw.clientId;
    if (this.emailConfigForm.valid) {
      this.master.saveEmailConfigTemplate(formValueRaw).subscribe(resp => {
        if (resp) {
          if (this.emailConfigForm.controls.emailTemplateId.value > 0) {
            this.isEdit = false;
            this.showTopCenter('success', 'Success Message', 'Updated Successfully');
          } else {
            this.showTopCenter('success', 'Success Message', 'Added Successfully');
          }
          this.getEmailTemplate();
          this.back();
        }
      });
    } else {
      this.emailConfigForm.markAllAsTouched();
    }
  }
  back() {
    this.emailConfigForm.reset();
    this.currentPage = 1;
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.showFlag = !this.showFlag;
    this.common.tempResetData = '';
    this.breadcrumbFlags.btnSave = false;
    this.breadcrumbFlags.btnReset = false;
  }
  reset() {
    if (this.emailConfigForm.controls.emailTemplateId.value > 0) {
      // this.getClient();
      this.emailConfigForm.patchValue({
        emailCatLookupId: this.common.tempResetData.emailCatLookupId,
        emailGroupLookupId: this.common.tempResetData.emailGroupLookupId,
        emailTemplateId: this.common.tempResetData.emailTemplateId,
        templateName: this.common.tempResetData.templateName,
        clientId: this.common.tempResetData.clientId,
        htmlTemplateBody: this.common.tempResetData.htmlTemplateBody,
        templateSubject: this.common.tempResetData.templateSubject,
      });
    } else {
      this.emailConfigForm.reset();
    }
  }
  showTopCenter(level: string, info: string, message: string) {
    this.messageService.add({ severity: level, summary: info, detail: message });
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
  private userTblAutoFilters(): void {
    this.templateNameFilteredOptions = this.templateNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.emailTemplateList.map(x => x.templateName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.compFilteredOptions = this.emailGroupControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.emailTemplateList.map(x => x.emailGroup).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.clientNameFilteredOptions = this.clientNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.emailTemplateList.map(x => x.clientName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.emailCategoryFilteredOptions = this.emailCategoryControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.emailTemplateList.map(x => x.emailCategory).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

  }
  resetTable() {
    this.dt.reset();
    this.global.nativeElement.value = '';
    this.amountCtl.nativeElement.value = '';
    this.templateNameControl.reset();
    this.emailGroupControl.reset();
    this.clientNameControl.reset();
    this.emailCategoryControl.reset();
    this.userTblAutoFilters();
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
  viewDetail(id: number) {
    this.showFlag = !this.showFlag;
    this.breadcrumbFlags.btnBack = true;
    this.breadcrumbFlags.btnReset = false;
    this.breadcrumbFlags.btnResetTbl = false;
    this.breadcrumbFlags.btnSave = false;
    this.breadcrumbFlags.btnAdd = false;
    this.master.getEmailTemplateById(id).subscribe(resp => {
      this.common.tempResetData = resp;
      if (this.common.tempResetData.clientId !== 'Default') {
        this.common.tempResetData.clientId = + resp.clientId;
      }
      this.emailConfigForm.patchValue({
        emailEventId: this.common.tempResetData.emailEventId,
        emailCatLookupId: this.common.tempResetData.emailCatLookupId,
        emailGroupLookupId: this.common.tempResetData.emailGroupLookupId,
        emailTemplateId: this.common.tempResetData.emailTemplateId,
        templateName: this.common.tempResetData.templateName,
        clientId: this.common.tempResetData.clientId,
        htmlTemplateBody: this.common.tempResetData.htmlTemplateBody,
        templateSubject: this.common.tempResetData.templateSubject,
      });
    });
    this.emailConfigForm.controls.templateName.enable();
  }
  showall() {
    if (this.emailTemplateList.length > 0) {
      this.itemperpage = this.emailTemplateList.length;
    }
  }
}

