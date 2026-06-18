import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { EmailConfig } from 'src/app/common-methods/models/email-config';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, Validators, UntypedFormArray, AbstractControl } from '@angular/forms';
import { CommonService } from 'src/app/common-methods/services/common.service';

import { AgentEntryMasterService } from 'src/app/common-methods/services/agent-entry-master.service';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';
import { MatDialog } from '@angular/material/dialog';
import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { SharedService } from 'src/app/common-methods/services/shared.service';
import { ScreenAuth } from 'src/app/common-methods/models/screen-auth';
import { startWith, map } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { MatMenuTrigger } from '@angular/material/menu';
import { EmailDynamicControlsComponent } from 'src/app/common-methods/controls/email-dynamic-controls/email-dynamic-controls.component';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table'

@Component({
  standalone: false,
  selector: 'app-email-config',
  templateUrl: './email-config.component.html',
  styleUrls: ['./email-config.component.css']
})
export class EmailConfigComponent implements OnInit {
  itemperpage;
  clientNo: number;
  showFlag = false;
  isEdit: boolean;
  emailConfig: EmailConfig = new EmailConfig();
  emailConfigForm: UntypedFormGroup;
  emailAddressDet: UntypedFormArray;
  emailConfigTable: any[] = [];
  emailData = new BehaviorSubject([]);
 @ViewChild('appEmailDynamic', { static: true }) 
appEmailDynamic!: EmailDynamicControlsComponent;
  // contactFilter = ['To', 'Cc'];
  contactFilter = ['Primary Email', 'Secondary Email'];
  columns = [
    { field: 'emailGroupName', header: 'Email Group' },
    { field: 'emailCatName', header: 'Email Catogery' },
    { field: 'clientName', header: 'Client' },
    { field: 'templateName', header: 'Email Template' },
    { field: 'emailContactDet', header: 'Email Address' },
    { field: 'active', header: 'Active' },
  ];
  frozenCols = [
    { field: 'action', header: 'Action' },
  ];
  @ViewChild('global', { static: true }) global!: ElementRef;
  userData: any;
  pathParameters: string[];
  routePath = 'Configure / Mail Config / Email Config';
  totalpages: number;
   @ViewChild('dt', { static: false }) dt!: Table;
 @ViewChild('statusNameCtrlTrigger', { static: true }) statusNameCtrlTrigger!: MatMenuTrigger;
  statusListFilteredOptions: Observable<string[]>;
  statusListControl = new UntypedFormControl();
  currentPage = 1;
  tempCurrentPage = 1;
  typeOfAgreement: any;
  emailGroupList: any[] = [];
  emailGroupFilterList: any[] = [];
  emailCategoryList: any[] = [];
  emailCategoryFilterList: any[] = [];
  emailTempList: any[] = [];
  emailTempFilterList: any[] = [];
  clientList: any[] = [];
  clientFilterList: any[] = [];
  emailTypeList: any[] = [];
  rowCount = 1;
  emailDesttype: any;
  emailKey: any;
  breadcrumbFlags = new BreadcrumbFlags();
  screenAuth: ScreenAuth = new ScreenAuth();
  clientKeyup = false;
  emailDetList: any[] = [];
  index = -1;
  tooltipName = 'Add';
  dispalyTable = true;
  breadcrumbFlag = new BreadcrumbFlags();
  isAddFlag = false;
  confId: number;
  typeToFlag = false;
  validationFlag: boolean;
  filterToType: any;
  cloneEmailDet: any;
  testda: any;
  emailDetail: any;
  @ViewChild('statusDescCtrlTrigger', { static: true }) statusDescCtrlTrigger: MatMenuTrigger;
  statusDescFilteredOptions: Observable<string[]>;
  statusDescControl = new UntypedFormControl();
  @ViewChild('clientNameCtrlTrigger', { static: true }) clientNameCtrlTrigger: MatMenuTrigger;
  clientNameFilteredOptions: Observable<string[]>;
  clientNameControl = new UntypedFormControl();
  @ViewChild('templateNameCtrlTrigger', { static: true }) templateNameCtrlTrigger: MatMenuTrigger;
  templateNameFilteredOptions: Observable<string[]>;
  templateNameControl = new UntypedFormControl();
  @ViewChild('emailAddressDetCtrlTrigger', { static: true }) emailAddressDetCtrlTrigger: MatMenuTrigger;
  emailAddressDetFilteredOptions: Observable<string[]>;
  emailAddressDetControl = new UntypedFormControl();
  // emailData: EmailData = new EmailData();
  emailList: UntypedFormArray;
  emailtypeList: any;
  constructor(public common: CommonService, public agentEntryMasterService: AgentEntryMasterService,
    public master: MasterService, public dialog: MatDialog, private auth: AuthService,
    public formBuilder: UntypedFormBuilder, private saharedService: SharedService, private message: MessageService,
    private router: Router, ) { }

  ngOnInit() {
    this.screenAuth = this.auth.getScreenAuth(this.router.url);
    this.dispalyTable = true;
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.getDefaultData();
    this.getList();
    this.itemperpage = 10;
  }
  getDefaultData() {
    this.master.getEmailConfigLookupDet(true).subscribe(resp => {
      this.clientList = resp.client;
      this.emailCategoryList = resp.emailCategory;
      this.emailGroupList = resp.emailGroup;
      this.emailTempList = resp.emailTempleteDet;
      this.emailtypeList = resp.emailType;
    });
  }
  openForm() {
    this.isAddFlag = true;
    this.breadcrumbFlag.toolTip = 'Save';
    this.breadcrumbFlag.btnSave = true;
    this.breadcrumbFlag.btnBack = true;
    this.breadcrumbFlag.btnReset = true;
    this.breadcrumbFlag.btnAdd = false;
    this.breadcrumbFlag.btnResetTbl = false;
    this.breadcrumbFlag.btnSaveDisabled = false;
    this.dispalyTable = false;
    this.emailData.next([]);
    this.initFormGroup();
  }
  closeForm() {
    this.emailConfigForm.reset();
    this.dispalyTable = !this.dispalyTable;
    this.isEdit = false;
    this.breadcrumbFlag.btnSave = false;
    this.breadcrumbFlag.btnBack = false;
    this.breadcrumbFlag.btnReset = false;
    this.breadcrumbFlag.btnAdd = true;
    this.breadcrumbFlag.btnResetTbl = true;
  }
  initFormGroup() {
    this.emailConfigForm = this.formBuilder.group({
      emailConfigId: new UntypedFormControl(0),
      loggedIn: new UntypedFormControl(0),
      emailGroupLookupId: new UntypedFormControl('', Validators.required),
      emailCatLookupId: new UntypedFormControl('', Validators.required),
      clientId: new UntypedFormControl('', Validators.required),
      emailTemplateId: new UntypedFormControl('', Validators.required),
      active: new UntypedFormControl(true),
      emailContactDet: this.formBuilder.array([]),
      // emailAddressDet: new UntypedFormGroup({}),
      // emailType: new UntypedFormGroup({}),
    });
  }
  getEmailTableData() {
    this.master.getEmailConfig().subscribe(resp => {
      this.emailConfigTable = resp;
     // console.log(resp, 'this.emailDetList');
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
            this.editDelete(data);
          }
        }
      });
    }
  }
  editDelete(rowData: any) {
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    // this.breadcrumbFlags.toolTip = 'Update';
    const loggedIn = this.userData.userId;
    this.master.deleteEmailConfig(rowData.emailConfigId, loggedIn).subscribe(resp => {
      if (resp) {
        this.getEmailTableData();
      }
    });
  }

  addEmailConfig() {
    this.initFormGroup();
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.showFlag = !this.showFlag;
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
  emailGrpKeyupFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        const resource = this.emailGroupFilterList.filter(e =>
          e.lookUpName.toLowerCase() === value.toLowerCase());
        if (resource.length > 0) {
        } else {
        }
      } else {
      }
    }
  }
  get displayemailGrpFn() {
    const resourceNew = (lookUpName) => {
      if (lookUpName == null || lookUpName === undefined) {
        return null;
      } else {
        if (lookUpName && this.emailGroupFilterList && this.emailGroupFilterList.length > 0) {
          lookUpName = this.emailGroupFilterList.find(x => x.lookUpId === lookUpName);
          if (lookUpName) {
            return lookUpName.lookUpName;
          }

        } else {
          return null;
        }
      }
    };
    return resourceNew;
  }
  emailGrpItems(value: any) {
    if (!value) { this.assignemailGrpCopy(); }
    if (value) {
      this.emailGroupFilterList = Object.assign([], this.emailGroupList).filter(
        item => ((item.lookUpName.toLowerCase().indexOf(value.toLowerCase()) > -1)));
    }

  }
  assignemailGrpCopy() {
    this.emailGroupFilterList = Object.assign([], this.emailGroupList);
  }

  emailCategoryKeyupFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        const lookUpName = this.emailCategoryFilterList.filter(e =>
          e.lookUpName.toLowerCase() === value.toLowerCase());
        if (lookUpName.length > 0) {
        } else {
        }
      } else {
      }
    }
  }
  get displayemailCategoryFun() {
    const resourceNew = (lookUpName) => {
      if (lookUpName == null || lookUpName === undefined) {
        return null;
      } else {
        if (lookUpName && this.emailCategoryFilterList && this.emailCategoryFilterList.length > 0) {
          lookUpName = this.emailCategoryFilterList.find(x => x.lookUpId === lookUpName);
          return lookUpName.lookUpName;
        } else {
          return null;
        }
      }
    };
    return resourceNew;
  }

  emailCategoryItems(value: any) {
    if (!value) { this.assignemailCategoryCopy(); }
    if (value) {
      this.emailCategoryFilterList = Object.assign([], this.emailCategoryList).filter(
        item => ((item.lookUpName.toLowerCase().indexOf(value.toLowerCase()) > -1)));
    }

  }
  assignemailCategoryCopy() {
    this.emailCategoryFilterList = Object.assign([], this.emailCategoryList);
  }

  emailTempKeyupFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        const resource = this.emailTempFilterList.filter(e =>
          e.country.toLowerCase() === value.toLowerCase());
        if (resource.length > 0) {
        } else {
        }
      } else {
      }
    }
  }
  get displayemailTempFun() {
    const resourceNew = (country) => {
      if (country == null || country === undefined) {
        return null;
      } else {
        if (country && this.emailTempFilterList && this.emailTempFilterList.length > 0) {
          country = this.emailTempFilterList.find(x => x.emailTemplateId === country);
          return country.emailTempleteName;
        } else {
          return null;
        }
      }
    };
    return resourceNew;
  }

  emailTempItems(value: any) {
    if (!value) { this.assignemailTempCopy(); }
    if (value) {
      this.emailTempFilterList = Object.assign([], this.emailTempList).filter(
        item => ((item.emailTempleteName.toLowerCase().indexOf(value.toLowerCase()) > -1)));
    }

  }
  assignemailTempCopy() {
    this.emailTempFilterList = Object.assign([], this.emailTempList);
  }

  clientKeyupFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        const client = this.clientFilterList.filter(e =>
          e.clientName.toLowerCase() === value.toLowerCase());
        if (client.length > 0) {
          this.clientKeyup = true;
        } else {
          this.clientKeyup = true;
        }
      } else {
        this.clientKeyup = false;
      }
    }
  }
  get displayclientFn() {
    const clientNew = (client) => {
      this.clientNo = Number(client);
      if (client == null || client === undefined) {
        return null;
      } else {
        if (client && this.clientFilterList && this.clientFilterList.length > 0) {
          client = this.clientFilterList.find(x => x.clientId === this.clientNo);
          if (client) {
            return client.clientName;
          }
        } else {
          return null;
        }
      }
    };
    return clientNew;
  }

  // Resource ..
  clientItems(value: any) {
    if (!value) { this.assignclientCopy(); }
    if (value) {
      this.clientFilterList = Object.assign([], this.clientList.filter(f => f.clientName.toLowerCase().indexOf(value.toLowerCase()) > -1));
    }

  }
  assignclientCopy() {
    this.clientFilterList = Object.assign([], this.clientList);
  }
  displayClientFn(id: any): string {
    if (!id) { return ''; }
    const clientName = this.clientList.filter(res => res.clientId === id);
    return clientName ? clientName[0].clientName : '';
  }
  saveEmailConfig() {
    const value = this.userData.userId;
    this.emailConfigForm.get('loggedIn')?.setValue(value);
    const emailconfigId = this.emailConfigForm.get('emailConfigId')?.value;

    if (this.emailConfigForm.value.emailContactDet) {
      const contactValue = this.emailConfigForm.value.emailContactDet;
      this.emailConfigForm.value.emailContactDet = contactValue;
    }
    // if (emailconfigId > 0) {
    //   this.testda = this.common.setfalsedeleted(this.cloneEmailDet, this.emailConfigForm.value.emailContactDet, 'emailConfigTransId');
    //   this.emailConfigForm.value.emailContactDet = this.testda;
    // }
    // console.log(this.emailConfigForm.value, 'this.emailConfigForm.value');
    // tslint:disable-next-line:max-line-length
    if (this.emailConfigForm.valid && this.emailConfigForm.value.emailContactDet) {
      const toList = this.emailConfigForm.value.emailContactDet.filter(x => x.destName === 'To' && x.active === true);
      if (toList.length > 0) {
        this.master.saveEmailConfig(this.emailConfigForm.value).subscribe(res => {
          if (res) {
            if (emailconfigId === 0) {
              this.showTopCenter('success', 'Success Message', 'Added Successfully');
              // setTimeout(() => {
              this.dispalyTable = true;
              // }, 2500);
            } else {
              this.showTopCenter('success', 'Success Message', 'Updated Successfully');
              // setTimeout(() => {
              this.dispalyTable = true;
              // }, 2500);
            }
          }
        });
      } else {
        this.showTopCenter('warn', 'Failure Message', 'Please select atleast one emailType To');
      }
    } else {
      this.emailConfigForm.markAllAsTouched();
    }
  }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }
  showNotification(data: any) {
    this.saharedService.emitChange({
      severity: 'success',
      summary: 'Success Message',
      detail: data + ' Successfully'
    });
  }
  getList() {
    // if (data) {
    this.master.getEmailConfigDet().subscribe(resp => {
      this.emailDetList = resp;
      // console.log(this.emailDetList, 'this.emailDetListtablee');
    },
      err => { }, () => {
        this.autoTableFilters();
      });
    // }
  }
  private autoTableFilters() {
    this.statusListFilteredOptions = this.statusListControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.emailDetList.map(x => x.emailGroupName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
    this.statusDescFilteredOptions = this.statusDescControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.emailDetList.map(x => x.emailCatName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
    this.clientNameFilteredOptions = this.clientNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.emailDetList.map(x => x.clientName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
    this.templateNameFilteredOptions = this.templateNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.emailDetList.map(x => x.templateName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
    this.emailAddressDetFilteredOptions = this.emailAddressDetControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.emailDetList.map(x => x.emailContactDet.contactData).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
  }
  editEmailDet(id: number) {
    this.confId = id;
    this.isAddFlag = true;
    this.dispalyTable = false;
    this.breadcrumbFlag.toolTip = 'Update';
    this.breadcrumbFlag.btnSave = true;
    this.breadcrumbFlag.btnBack = true;
    this.breadcrumbFlag.btnReset = true;
    this.breadcrumbFlag.btnAdd = false;
    this.breadcrumbFlag.btnResetTbl = false;
    this.initFormGroup();
    this.master.GetEmailConfigById(id).subscribe(resp => {
      this.emailDetail = resp;
      this.common.emailCommonDate = resp;
      // this.emailConfigForm.patchValue(this.emailDetail);
      this.cloneEmailDet = resp.emailContactDet;
      // this.emailData = this.emailDetail.emailContactDet;
      this.emailData.next(this.emailDetail.emailContactDet);
      // console.log(this.emailData, 'this.emailData.contact');
      // console.log(this.emailConfigForm.value, 'this.emailConfigForm.valuesdfsfsdf');
      this.emailConfigForm.patchValue({
        emailCatName: this.emailDetail.emailCatName,
        emailCatType: this.emailDetail.emailCatType,
        emailConfigId: this.emailDetail.emailConfigId,
        emailCatLookupId: this.emailDetail.emailCatLookupId,
        emailGroupLookupId: this.emailDetail.emailGroupLookupId,
        clientId: Number(this.emailDetail.clientId),
        emailTemplateId: this.emailDetail.emailTemplateId,
        active: this.emailDetail.active,
      });

      this.emailGrpItems('');
      this.emailCategoryItems('');
      this.clientItems('');
      this.emailTempItems('');
      this.isEdit = true;
    });
  }
  resetTable() {
    this.global.nativeElement.value = '';
    this.dt.reset();
    this.statusDescControl.reset();
    this.clientNameControl.reset();
    this.templateNameControl.reset();
    this.statusListControl.reset();
    this.emailAddressDetControl.reset();
    this.autoTableFilters();
  }
  resetForm() {
    const emailconfigId = this.emailConfigForm.get('emailConfigId')?.value;
    if (emailconfigId > 0) {
      this.emailDetail = this.common.emailCommonDate;
      // this.emailData = this.emailDetail.emailContactDet;
      this.emailData.next(this.emailDetail.emailContactDet);
      this.emailConfigForm.patchValue(this.emailDetail);
      this.emailGrpItems('');
      this.emailCategoryItems('');
      this.clientItems('');
      this.emailTempItems('');
    } else {
      this.emailConfigForm.reset();
      this.emailConfigForm.markAsPristine();
      this.initFormGroup();
      this.getDefaultData();
      this.getList();
      this.emailData.next([]);
      this.dispalyTable = false;
    }
  }
  viewDetail(id: number) {
    this.confId = id;
    this.isAddFlag = true;
    this.dispalyTable = false;
    this.breadcrumbFlag.btnBack = true;
    this.breadcrumbFlag.btnReset = false;
    this.breadcrumbFlag.btnAdd = false;
    this.breadcrumbFlag.btnResetTbl = false;
    this.initFormGroup();
    this.master.GetEmailConfigById(id).subscribe(resp => {
      this.emailDetail = resp;
      this.common.emailCommonDate = resp;
      this.cloneEmailDet = resp.emailContactDet;
      this.emailData.next(this.emailDetail.emailContactDet);
      this.emailConfigForm.patchValue({
        emailCatName: this.emailDetail.emailCatName,
        emailCatType: this.emailDetail.emailCatType,
        emailConfigId: this.emailDetail.emailConfigId,
        emailCatLookupId: this.emailDetail.emailCatLookupId,
        emailGroupLookupId: this.emailDetail.emailGroupLookupId,
        clientId: Number(this.emailDetail.clientId),
        emailTemplateId: this.emailDetail.emailTemplateId,
        active: this.emailDetail.active,
      });
      this.emailGrpItems('');
      this.emailCategoryItems('');
      this.clientItems('');
      this.emailTempItems('');
      this.isEdit = true;
    });
  }
  showall() {
    if (this.emailDetList.length > 0) {
      this.itemperpage = this.emailDetList.length;
    }
  }
}
export class EmailData {
  contact: any[] = [];
}
