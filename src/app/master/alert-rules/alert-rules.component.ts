import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormBuilder, UntypedFormControl } from '@angular/forms';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { MessageService } from 'primeng/api';
import { AlertRule } from 'src/app/common-methods/models/alert-rule';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { Table, TableModule } from 'primeng/table';
import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';
import { ScreenAuth } from 'src/app/common-methods/models/screen-auth';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { MatMenuTrigger } from '@angular/material/menu';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { runInThisContext } from 'vm';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-alert-rules',
  templateUrl: './alert-rules.component.html',
  styleUrls: ['./alert-rules.component.css']
})
export class AlertRulesComponent implements OnInit {
  itemperpage;
  alertForm: UntypedFormGroup;
  clientlist: any[] = [];
  displayedColumns = [
    { field: 'clientName', header: 'Client Name' },
    { field: 'componentName', header: 'Component Name' },
    { field: 'countryName', header: 'Country' },
    { field: 'callChargelimit', header: 'Call Charges Limit' },
    { field: 'univFeeAlert', header: 'University Fee Alert' },
    { field: 'callChargeAlert', header: 'Call Charges Alert' },
  ];
  frozenCols = [
    { field: 'action', header: 'Action' },
  ];
  alertRuleList: any[] = [];
  serviceList: any[] = [];
  countryList: any[] = [];
  agentList: any[] = [];
  alertRule: AlertRule = new AlertRule();
  serviceTypes: any;
  showFlag = false;
  routePath = 'Configure / Alert Rule';
  isEdit: boolean;
  serviceTypeList: any[] = [];
  userData: any;
  breadcrumbFlags = new BreadcrumbFlags();
  totalpages: number;
   @ViewChild('dt', { static: false }) dt!: Table;
 @ViewChild('amountCtl', { static: true }) 
amountCtl!: ElementRef<any>;
 @ViewChild('global', { static: true }) global!: ElementRef<any>;
  @ViewChild('univAmountCtl', { static: true }) univAmountCtl: ElementRef<any>;
  @ViewChild('alertAmountCtl', { static: true }) alertAmountCtl: ElementRef<any>;
  currentPage = 1;
  tempCurrentPage = 1;
  screenAuth = new ScreenAuth();
  clientControls!: AutoCompleteDropDown;

  @ViewChild('clientNameCtrlTrigger', { static: true }) clientNameCtrlTrigger: MatMenuTrigger;
  clientNameFilteredOptions: Observable<string[]>;
  clientNameControl = new UntypedFormControl();

 @ViewChild('componentNameCtrlTrigger', { static: true }) 
componentNameCtrlTrigger!: MatMenuTrigger;
  compFilteredOptions: Observable<string[]>;
  componentNameControl = new UntypedFormControl();

  @ViewChild('countryNameCtrlTrigger', { static: true }) countryNameCtrlTrigger: MatMenuTrigger;
  countryNameFilteredOptions: Observable<string[]>;
  countryNameControl = new UntypedFormControl();

  @ViewChild('callChargelimitCtrlTrigger', { static: true }) callChargelimitCtrlTrigger: MatMenuTrigger;
  @ViewChild('univFeeAlertCtrlTrigger', { static: true }) univFeeAlertCtrlTrigger: MatMenuTrigger;
  @ViewChild('callChargeAlertCtrlTrigger', { static: true }) callChargeAlertCtrlTrigger: MatMenuTrigger;
  constructor(private fb: UntypedFormBuilder, private messageService: MessageService, public common: CommonService,
    // tslint:disable-next-line:align
    private masterService: MasterService, private authService: AuthService, private router: Router, ) { }

  ngOnInit() {
    this.screenAuth = this.authService.getScreenAuth(this.router.url);
    this.breadcrumbFlags = this.common.breadcrumbFlags(true);
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.getServiceTypeList();
    this.getAlertRules();
    this.itemperpage = 10;
  }
  initFormGroup() {
    this.alertForm = this.fb.group({
      clientId: ['', Validators.required],
      alertRuleId: [0],
      compId: ['', Validators.required],
      countryName: ['', Validators.required],
      clientLimit: ['', Validators.required],
      callChargelimit: ['', Validators.required],
      univFeelimit: [{ value: '', disabled: true }],
      univFeeAlert: ['', Validators.required],
      callChargeAlert: ['', Validators.required],
      univFeeFlag: [true, Validators.required], // { value: true, disabled: true }
      createdUserId: [this.userData.userId]
    });
    this.clientControls =
      new AutoCompleteDropDown('Client Name', 'clientId', 'clientId', 'clientName', this.clientlist,
        '', this.alertForm, false, false, true);
  }
  getAlertRules() {
    this.masterService.getAlertRules().subscribe(resp => {
      this.alertRuleList = resp;
      this.userTblAutoFilters();
      this.alertRuleList.filter(x => x.countryName === true).map(x => x.countryName = 'India');
      this.alertRuleList.filter(x => x.countryName === false).map(x => x.countryName = 'Abroad');
      // console.log(this.alertRuleList);
    });
  }
  getServiceTypeList() {
    this.masterService.getAlertRuleDetails().subscribe(res => {
      if (res) {
        this.serviceTypeList = res.component;
        this.clientlist = res.client;
        this.clientControls =
          new AutoCompleteDropDown('Client Name', 'clientId', 'clientId', 'clientName', this.clientlist,
            '', this.alertForm, false, false, true);
      }
    });
  }
  saveAlertRule() {

    if (this.alertForm.valid) {
      if (this.alertForm.controls.countryName.value === '1') {
        this.alertForm.controls.countryName.setValue(true);
      } else {
        this.alertForm.controls.countryName.setValue(false);
      }
      this.masterService.AddAlertRules(this.alertForm.value).subscribe(resp => {
        if (resp) {
          if (this.alertForm.controls.alertRuleId.value > 0) {
            this.isEdit = false;
            this.showTopCenter('success', 'Success Message', 'Updated Successfully');
          } else {
            this.showTopCenter('success', 'Success Message', 'Saved Successfully');
          }
          this.getAlertRules();
          this.closeForm();
        }
      });
    } else {
      this.alertForm.markAllAsTouched();
    }
  }
  editAlertRule(src, mode: any) {
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.breadcrumbFlags.toolTip = 'Update';
    this.initFormGroup();
    this.masterService.getAlertRulesById(src.alertRuleId).subscribe(res => {
      if (res) {
        this.common.tempResetData = res;
        if (this.common.tempResetData.countryName === true) {
          this.alertForm.controls.countryName.setValue('1');
          this.common.tempResetData.countryName = '1';
        } else {
          this.alertForm.controls.countryName.setValue('2');
          this.common.tempResetData.countryName = '2';
        }
        this.alertForm.patchValue({
          alertRuleId: this.common.tempResetData.alertRuleId,
          compId: this.common.tempResetData.compId,
          callChargeAlert: this.common.tempResetData.callChargeAlert,
          clientId: this.common.tempResetData.clientId,
          countryName: this.common.tempResetData.countryName,
          clientLimit: this.common.tempResetData.clientLimit,
          callChargelimit: this.common.tempResetData.callChargelimit,
          univFeeAlert: this.common.tempResetData.univFeeAlert,
          univFeeFlag: this.common.tempResetData.univFeeFlag
        });
        this.alertForm.controls.univFeelimit.setValue(this.alertForm.controls.clientLimit.value);
        if (mode === 'view') {
          this.breadcrumbFlags.btnSave = false;
          this.breadcrumbFlags.btnReset = false;
          this.alertForm.disable();
        }
      }
    });
    this.showFlag = !this.showFlag;
    this.isEdit = true;
  }
  deleteAlertRule(src: any) {
    this.masterService.deleteAlertRules(src.alertRuleId, this.userData.userId).subscribe(resp => {
      if (resp) {
        this.showTopCenter('success', 'Success Message', 'Deleted Successfully');
        this.getAlertRules();
      }
    });
  }
  assignClientLt() {
    this.alertForm.controls.univFeelimit.setValue(this.alertForm.controls.clientLimit.value);
    this.checkValidValue('univFeeAlert');
  }
  checkValidValue(type): void {
    if (type === 'callChargeAlert') {
      let value = this.alertForm.get('callChargeAlert')?.value;
      if (value === '' || value == null) {
        value = 0;
      } else if (value > this.alertForm.get('callChargelimit')?.value) {
        this.alertForm.get('callChargeAlert')?.markAsTouched();
        this.alertForm.get('callChargeAlert')?.setErrors({ incorrect: true });
      } else {
        this.alertForm.get('callChargeAlert')?.setErrors(null);
      }
    }
    if (type === 'univFeeAlert') {
      let val = this.alertForm.get('univFeeAlert')?.value;
      if (val === '' || val == null) {
        val = 0;
      } else if (+val > +this.alertForm.get('clientLimit')?.value) {
        this.alertForm.get('univFeeAlert')?.markAsTouched();
        this.alertForm.get('univFeeAlert')?.setErrors({ incorrect: true });
      } else {
        this.alertForm.get('univFeeAlert')?.setErrors(null);
      }
    }
  }
  addAlertRule() {
    this.initFormGroup();
    this.breadcrumbFlags.toolTip = 'Save';
    this.showFlag = !this.showFlag;
    this.breadcrumbFlags = this.common.breadcrumbFlags();
  }
  closeForm() {
    this.breadcrumbFlags.btnSave = true;
    this.breadcrumbFlags.btnReset = true;
    this.alertForm.reset();
    this.showFlag = !this.showFlag;
    this.isEdit = false;
    this.breadcrumbFlags = this.common.breadcrumbFlags();
  }
  resetForm() {
    if (this.alertForm.controls.alertRuleId.value > 0) {
      this.alertForm.patchValue({
        alertRuleId: this.common.tempResetData.alertRuleId,
        compId: this.common.tempResetData.compId,
        callChargeAlert: this.common.tempResetData.callChargeAlert,
        clientId: this.common.tempResetData.clientId,
        countryName: this.common.tempResetData.countryName,
        clientLimit: this.common.tempResetData.clientLimit,
        callChargelimit: this.common.tempResetData.callChargelimit,
        univFeeAlert: this.common.tempResetData.univFeeAlert,
        univFeeFlag: this.common.tempResetData.univFeeFlag
      });
      this.alertForm.controls.univFeelimit.setValue(this.alertForm.controls.clientLimit.value);
    } else {
      this.alertForm.reset();
      this.alertForm.markAsPristine();
      this.alertForm.controls.alertRuleId.setValue(0);
    }
  }
  resettable() {
    this.univAmountCtl.nativeElement.value = '';
    this.alertAmountCtl.nativeElement.value = '';
    this.global.nativeElement.value = '';
    this.amountCtl.nativeElement.value = '';
    this.dt.reset();
    this.componentNameControl.reset();
    this.clientNameControl.reset();
    this.countryNameControl.reset();
  }
  private userTblAutoFilters(): void {
    this.compFilteredOptions = this.componentNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.alertRuleList.map(x => x.componentName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.clientNameFilteredOptions = this.clientNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.alertRuleList.map(x => x.clientName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.countryNameFilteredOptions = this.countryNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.alertRuleList.map(x => x.countryName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

  }
  closeMenu(col: any) {
    switch (col) {
      case 'componentName': this.componentNameCtrlTrigger.closeMenu(); break;
      case 'clientName': this.clientNameCtrlTrigger.closeMenu(); break;
      case 'callChargelimit': this.callChargelimitCtrlTrigger.closeMenu(); break;
      case 'countryName': this.countryNameCtrlTrigger.closeMenu(); break;
      case 'univFeeAlert': this.univFeeAlertCtrlTrigger.closeMenu(); break;
      case 'callChargeAlert': this.callChargeAlertCtrlTrigger.closeMenu(); break;
      default: break;
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
  showall() {
    if (this.alertRuleList.length > 0) {
      this.itemperpage = this.alertRuleList.length;
    }
  }
}
