import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { ClientCustomFields } from 'src/app/common-methods/models/clientCustField';
import { ScreenAuth } from 'src/app/common-methods/models/screen-auth';
import { AuthService } from 'src/app/common-methods/services/auth.service';

import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table'
@Component({
  standalone: false,
  selector: 'app-client-custom-fields',
  templateUrl: './client-custom-fields.component.html',
  styleUrls: ['./client-custom-fields.component.css']
})
export class ClientCustomFieldsComponent implements OnInit {
  itemperpage;
  allList: any;
  clientList: any[] = [];
  componentList: any[] = [];
  customfieldList: any[] = [];
  fieldtypelist: any[] = [];
  showField = false;
  isEdit = false;
  routePath = 'Client / Client Custom Fields';
  clientfieldFormGroup: UntypedFormGroup;
  breadcrumbFlag = new BreadcrumbFlags();
  clientNameControls!: AutoCompleteDropDown;
  componentNameControls!: AutoCompleteDropDown;
  fieldNameControls!: AutoCompleteDropDown;
  customFieldVm = new ClientCustomFields();
  userData: any;
  screenAuth: ScreenAuth = new ScreenAuth();
  fieldList: any;
   @ViewChild('dt', { static: false }) dt!: Table;
  @ViewChild('global', { static: true }) global!: ElementRef;
  displayedColumns = [
    { field: 'clientName', header: 'Client' },
    { field: 'compName', header: 'Component' },
    { field: 'fieldName', header: 'Field Name' },
    { field: 'fieldType', header: 'Field Type' },
    { field: 'fieldDesc', header: 'Field Description' },
    { field: 'active', header: 'Active' },
  ];
  frozenCols = [
    { field: 'action', header: 'Action' },
  ];
  clientCtrl = new UntypedFormControl();
  clientOptions: Observable<string[]>;
  @ViewChild('clientTrigger', { static: true }) clientTrigger: MatMenuTrigger;
  componentCtrl = new UntypedFormControl();
  componentOptions: Observable<string[]>;
  @ViewChild('componentTrigger', { static: true }) componentTrigger: MatMenuTrigger;
  fieldnameCtrl = new UntypedFormControl();
  fieldnameOptions: Observable<string[]>;
  @ViewChild('fieldnameTrigger', { static: true }) fieldnameTrigger: MatMenuTrigger;
  fieldtypeCtrl = new UntypedFormControl();
  fieldtypeOptions: Observable<string[]>;
  @ViewChild('fieldtypeTrigger', { static: true }) fieldtypeTrigger: MatMenuTrigger;
  fielddescCtrl = new UntypedFormControl();
  fielddescOptions: Observable<string[]>;
  @ViewChild('fielddescTrigger', { static: true }) fielddescTrigger: MatMenuTrigger;
  siteCtrl = new UntypedFormControl();
  siteFormCtrlFilteredOptions: Observable<string[]>;
  totalpages: number;
  currentPage = 1;
  tempCurrentPage = 1;
  constructor(private fb: UntypedFormBuilder, private auth: AuthService, public master: MasterService, public common: CommonService,
    public screening: ScreeningService, private router: Router,
    private message: MessageService, public dialog: MatDialog) { }

  ngOnInit() {
    this.breadcrumbFlag = this.common.breadcrumbFlags(true);
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.screenAuth = this.auth.getScreenAuth(this.router.url);
    this.GetclientFieldList();
    this.itemperpage = 10;
  }
  initFormGroup() {
    this.clientfieldFormGroup = this.fb.group({
      clientCustomFieldId: [0],
      clientId: ['', Validators.required],
      compId: [''],
      fieldName: [''],
      fieldTypeLookupId: [''],
      fieldDesc: [''],
      active: [true],
      mandatoryFlag: [''],
      loggedIn: ['']
    });

    this.clientNameControls = new AutoCompleteDropDown('Client Name', 'clientId', 'clientId', 'clientName', this.clientList, '',
      this.clientfieldFormGroup, false, false, true);
    this.componentNameControls = new AutoCompleteDropDown('Component Name', 'compId', 'compId', 'compName', this.componentList, '',
      this.clientfieldFormGroup, false, false, false);
    this.fieldNameControls = new AutoCompleteDropDown('Field Type Name', 'fieldTypeLookupId', 'lookUpId', 'lookUpName',
      this.fieldtypelist, '', this.clientfieldFormGroup, false, false, true);
  }
  GetclientFieldList() {
    this.master.getClientcustomlist().subscribe(resp => {
      if (resp) {
        this.customfieldList = resp;
        this.TblAutoFilters();
      }
    });
  }
  getClientCustomComponent(event: any) {
    this.master.GetClientCustomComponent(event).subscribe(resp => {
      if (resp) {
        this.componentList = resp;
      }
      this.componentNameControls = new AutoCompleteDropDown('Component Name', 'compId', 'compId', 'compName', this.componentList, '',
        this.clientfieldFormGroup, false, false, false);
    });
  }
  GetClientCustominfo() {
    this.master.getClientcustominfo().subscribe(resp => {
      if (resp) {
        this.allList = resp;
        this.clientList = this.allList.client;
        // this.componentList = this.allList.component;
        this.fieldtypelist = this.allList.fieldType;
        this.fieldNameControls = new AutoCompleteDropDown('Field Type Name', 'fieldTypeLookupId', 'lookUpId', 'lookUpName',
          this.fieldtypelist, '', this.clientfieldFormGroup, false, false, true);
        this.clientNameControls = new AutoCompleteDropDown('Client Name', 'clientId', 'clientId', 'clientName', this.clientList, '',
          this.clientfieldFormGroup, false, false, true);
      }
    });
  }
  filterGlobal(value: any) {
    this.dt['filterGlobal'](value, 'contains');
  }
  addForm() {
    this.breadcrumbFlag.toolTip = 'Save';
    this.breadcrumbFlag = this.common.breadcrumbFlags();
    this.showField = !this.showField;
    this.initFormGroup();
    this.GetClientCustominfo();
  }
  validationCustomField() {
    const controlNames = ['clientId', 'fieldName', 'fieldType', 'fieldDesc'];
    for (const ctrl in this.clientfieldFormGroup.controls) {
      if (controlNames.indexOf(ctrl) > -1) {
        if (!this.clientfieldFormGroup.get(ctrl).value) {
          this.clientfieldFormGroup.get(ctrl).setValidators(Validators.required);
          this.clientfieldFormGroup.get(ctrl).markAsTouched();
          this.clientfieldFormGroup.get(ctrl).updateValueAndValidity();
        } else {
          this.clientfieldFormGroup.get(ctrl).clearValidators();
          this.clientfieldFormGroup.get(ctrl).updateValueAndValidity();
        }
      }
    }
  }
  saveClientField() {
    this.validationCustomField();
    this.clientfieldFormGroup.get('loggedIn')?.setValue(this.userData.userId);
    this.customFieldVm = this.clientfieldFormGroup.value;
    if (this.clientfieldFormGroup.valid) {
      this.master.CheckDuplicateClientCustomField(this.customFieldVm).subscribe(res => {
        if (res === false) {
          this.master.addClientCustomfields(this.customFieldVm).subscribe(resp => {
            if (resp) {
              if (this.clientfieldFormGroup.get('clientCustomFieldId')?.value > 0) {
                this.showTopCenter('success', 'Success Message', 'Updated Successfully');
              } else {
                this.showTopCenter('success', 'Success Message', 'Saved Successfully');
              }
              this.GetclientFieldList();
              this.closeForm();
              this.showField = false;
            }
          });
        } else {
          this.showTopCenter('warn', 'Failure Message', 'Field Name is already exist.');
        }
      });
    }
  }
  editCustomField(data: any) {
    this.breadcrumbFlag = this.common.breadcrumbFlags();
    this.showField = true;
    this.initFormGroup();
    this.GetClientCustominfo();
    this.breadcrumbFlag.toolTip = 'Update';
    this.master.getFieldList(data.clientCustomFieldId).subscribe(resp => {
      if (resp) {
        this.fieldList = resp;
        this.clientfieldFormGroup.patchValue({
          clientCustomFieldId: this.fieldList.clientCustomFieldId,
          clientId: this.fieldList.clientId,
          compId: this.fieldList.compId,
          fieldName: this.fieldList.fieldName,
          fieldTypeLookupId: this.fieldList.fieldTypeLookupId,
          fieldDesc: this.fieldList.fieldDesc,
          active: this.fieldList.active,
          mandatoryFlag: this.fieldList.mandatoryFlag
        });
        this.getClientCustomComponent(this.clientfieldFormGroup.value.clientId);
      }
    });
  }

  public deleteCustomField(data: any) {
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
            this.removeCustomField(data);
          }
        }
      });
    }
  }
  removeCustomField(data: any) {
    this.master.deleteCustomField(data.clientCustomFieldId, this.userData.userId).subscribe(resp => {
      if (resp) {
        this.showTopCenter('success', 'success Message', 'Deleted Successfully');
        this.GetclientFieldList();
      }
    });
  }
  closeForm() {
    this.breadcrumbFlag = this.common.breadcrumbFlags();
    this.showField = !this.showField;
  }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }
  resetForm() {
    if (this.clientfieldFormGroup.controls.clientCustomFieldId.value > 0) {
      this.clientfieldFormGroup.patchValue({
        clientId: this.fieldList.clientId,
        compId: this.fieldList.compId,
        fieldName: this.fieldList.fieldName,
        fieldType: this.fieldList.fieldType,
        fieldDesc: this.fieldList.fieldDesc,
        active: this.fieldList.active,
        mandatoryFlag: this.fieldList.mandatoryFlag
      });

    } else {
      this.clientfieldFormGroup.controls.clientCustomFieldId.setValue(0);
      this.clientfieldFormGroup.reset();
      this.clientfieldFormGroup.markAsPristine();
      this.initFormGroup();
    }
  }
  resetTable() {
    this.dt.reset();
    this.global.nativeElement.value = '';
    this.TblAutoFilters();
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
  private TblAutoFilters(): void {
    this.clientOptions = this.clientCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.customfieldList.map(x => x.clientName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
    this.componentOptions = this.componentCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.customfieldList.map(x => x.compName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
    this.fieldnameOptions = this.fieldnameCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.customfieldList.map(x => x.fieldName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
    this.fieldtypeOptions = this.fieldtypeCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.customfieldList.map(x => x.fieldType).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
    this.fielddescOptions = this.fielddescCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.customfieldList.map(x => x.fieldDesc).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
  }
  showall() {
    if (this.customfieldList.length > 0) {
      this.itemperpage = this.customfieldList.length;
    }
  }
}
