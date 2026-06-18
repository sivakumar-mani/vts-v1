import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { CancelRule } from 'src/app/common-methods/models/cancelRule';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { Observable } from 'rxjs';
import { startWith, map, min } from 'rxjs/operators';
import { Table, TableModule } from 'primeng/table';
import { AuthService } from '../../common-methods/services/auth.service';
import {  MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { CommonAlertsComponent } from '../../common-methods/common-alerts/common-alerts.component';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-cancellation-rule',
  templateUrl: './cancellation-rule.component.html',
  styleUrls: ['./cancellation-rule.component.css']
})
export class CancellationRuleComponent implements OnInit {
  itemperpage;
  clientCancelRuleDetails: any[] = [];
  showCancelRuleDetails = true;
  isEdit = false;
  agentCancelRuleDetail: any[] = [];
  fromConditionList: any[] = [];
  toConditionList: any[] = [];
  clientlist: any[] = [];
  CancelRuleForm: UntypedFormGroup;
  showsData = false;
  btnSave = false;
  btnReset = false;
  btnBack = false;
  btnAdd = true;
  btnResetTbl = true;
  btnAddDisabled = false;
  btnSaveDisabled = false;
  tooTip = 'Save';
  routePath = 'Client / Cancellation Rule';
  filednames: any[];
  displayedColumns = [
    { field: 'clientName', header: 'Client Name' },
    { field: 'description', header: 'Description' },
    { field: 'fromLookupName', header: 'From Condition' },
    { field: 'fromHours', header: 'From Hours' },
    { field: 'toLookupName', header: 'To Condition' },
    { field: 'toHours', header: 'To Hours' },
    { field: 'active', header: 'Active' },
    { field: 'percentage', header: 'Percentage' },
  ];
  frozenCols = [
    { field: 'action', header: 'Action' },
  ];
  userData: any;
  cancelRule: CancelRule;
  clientControl = new UntypedFormControl();
  clientListFilterOptions: Observable<string[]>;
  totalpages: number;
   @ViewChild('dt', { static: false }) dt!: Table;
  currentPage = 1;
  tempCurrentPage = 1;

 @ViewChild('clientNameTrigger', { static: true }) 
clientNameTrigger!: MatMenuTrigger;
  clientNameFilteredOptions: Observable<string[]>;
  clientNameControl = new UntypedFormControl();
  @ViewChild('fromLookupNameCtrlTrigger', { static: true }) fromLookupNameCtrlTrigger: MatMenuTrigger;
  fromLookupNameFilteredOptions: Observable<string[]>;
  fromLookupNameControl = new UntypedFormControl();
  @ViewChild('toLookupNameCtrlTrigger', { static: true }) toLookupNameCtrlTrigger: MatMenuTrigger;
  toLookupNameFilteredOptions: Observable<string[]>;
  toLookupNameControl = new UntypedFormControl();
  @ViewChild('descriptionCtrlTrigger', { static: true }) descriptionCtrlTrigger: MatMenuTrigger;
  @ViewChild('fromHoursCtrlTrigger', { static: true }) fromHoursCtrlTrigger: MatMenuTrigger;
  @ViewChild('toHoursCtrlTrigger', { static: true }) toHoursCtrlTrigger: MatMenuTrigger;
  @ViewChild('percentageCtrlTrigger', { static: true }) percentageCtrlTrigger: MatMenuTrigger;

  @ViewChild('global', { static: true }) global!: ElementRef;
  @ViewChild('fromhrCtl', { static: true }) fromhrCtl: ElementRef;
  @ViewChild('tohrCtl', { static: true }) tohrCtl: ElementRef;
  @ViewChild('percentageCtl', { static: true }) percentageCtl: ElementRef;

  screenAuth: any = {};
  clientControls!: AutoCompleteDropDown;
  constructor(private master: MasterService, private fb: UntypedFormBuilder, private authService: AuthService,
    private messageService: MessageService, public common: CommonService, private router: Router,
    public dialog: MatDialog) { }
  ngOnInit() {
    this.screenAuth = this.authService.getScreenAuth(this.router.url);
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.getClient();
    this.getLookUp();
    this.filednames = this.displayedColumns;
    this.getClientCancelRule();
    this.itemperpage = 10;
  }
  getClient() {
    this.master.GetClient().subscribe(res => {
      if (res) {
        this.clientlist = res;
        this.clientControls =
          new AutoCompleteDropDown('Client Name', 'clientId', 'clientId', 'clientName', this.clientlist,
            '', this.CancelRuleForm, false, false, true);
      }
    });
  }

  getClientCancelRule() {
    this.master.getClientCancelRule().subscribe(resp => {
      if (resp) {
        this.clientCancelRuleDetails = resp;
      }
      this.clientListFilterOptions = this.clientControl.valueChanges.pipe(startWith(''),
        map(value =>
          (Array.from(new Set(this.clientCancelRuleDetails.map(x => x.clientName).filter(x => x))).sort())
            .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
      this.currentPage = 1;
    }, err => { }, () => {
      this.cancelRuleTblAutoFilters();
    });
  }
  getLookUp() {
    this.master.getCancelRuleLookup().subscribe(resp => {
      if (resp) {
        this.fromConditionList = resp.fromCondition;
        this.toConditionList = resp.toCondition;
      }
    });
  }
  initFormGroup() {
    this.CancelRuleForm = this.fb.group({
      cancelRuleId: [0],
      clientId: ['', Validators.required],
      fromLookupId: ['', Validators.required],
      toLookupId: [''],
      fromHours: ['', Validators.required],
      toHours: [''],
      percentage: ['', [Validators.required, Validators.max(100)]],
      active: [true],
      description: ['', Validators.required],
      loggedId: [this.userData.userId]
    });
    this.clientControls =
      new AutoCompleteDropDown('Client Name', 'clientId', 'clientId', 'clientName', this.clientlist,
        '', this.CancelRuleForm, false, false, true);
  }
  saveCancelRule() {
    if (this.CancelRuleForm.valid) {
      this.master.saveAgentCancelRuleDetail(this.CancelRuleForm.value).subscribe(resp => {
        if (resp) {
          if (this.CancelRuleForm.controls.cancelRuleId.value > 0) {
            this.isEdit = false;
            this.showTopCenter('success', 'Success Message', 'Updated Successfully');
          } else {
            this.showTopCenter('success', 'Success Message', 'Saved Successfully');
          }
          this.getClientCancelRule();
          this.closeForm();
        }
      });
    } else {
      this.CancelRuleForm.markAllAsTouched();
    }
  }
  editAgentCancelRuleDetail(src: any) {
    this.initFormGroup();
    this.breacrumbFlags();
    this.tooTip = 'Update';
    this.master.getClientCancelRuleById(src.cancelRuleId).subscribe(res => {
      if (res) {
        this.common.tempResetData = res;
        setTimeout(() => {
          this.CancelRuleForm.patchValue({
            cancelRuleId: this.common.tempResetData.cancelRuleId,
            clientId: this.common.tempResetData.clientId, fromLookupId: this.common.tempResetData.fromLookupId,
            toLookupId: this.common.tempResetData.toLookupId, fromHours: this.common.tempResetData.fromHours,
            toHours: this.common.tempResetData.toHours, percentage: this.common.tempResetData.percentage,
            active: this.common.tempResetData.active, description: this.common.tempResetData.description
          });
        }, 0);
      }
    });
    this.showCancelRuleDetails = !this.showCancelRuleDetails;
    this.isEdit = true;
  }
  removeAgentCancelRuleDetail(cancelRuleId: any) {
    this.master.deleteAgentCancelRuleDetail(cancelRuleId, this.userData.userId).subscribe(resp => {
      if (resp) {
        this.showTopCenter('success', 'Success Message', 'Deleted Successfully');
        this.getClientCancelRule();
      }
    });
  }
  openForm() {
    this.tooTip = 'Save';
    this.breacrumbFlags();
    this.isEdit = false;
    this.initFormGroup();
    this.showCancelRuleDetails = !this.showCancelRuleDetails;
  }
  closeForm() {
    this.breacrumbFlags();
    this.CancelRuleForm.reset();
    this.showCancelRuleDetails = !this.showCancelRuleDetails;
    this.isEdit = false;
    this.currentPage = 1;
  }
  breacrumbFlags() {
    this.btnAdd = !this.btnAdd;
    this.btnResetTbl = !this.btnResetTbl;
    this.btnSave = !this.btnSave;
    this.btnReset = !this.btnReset;
    this.btnBack = !this.btnBack;
  }
  resetForm() {
    if (this.CancelRuleForm.controls.cancelRuleId.value > 0) {
      this.getClient();
      this.CancelRuleForm.patchValue({
        cancelRuleId: this.common.tempResetData.cancelRuleId,
        clientId: this.common.tempResetData.clientId, fromLookupId: this.common.tempResetData.fromLookupId,
        toLookupId: this.common.tempResetData.toLookupId, fromHours: this.common.tempResetData.fromHours,
        toHours: this.common.tempResetData.toHours, percentage: this.common.tempResetData.percentage,
        active: this.common.tempResetData.active, description: this.common.tempResetData.description
      });
    } else {
      const controlNames = ['clientId', 'percentage', 'fromLookupId', 'fromHours', 'description'];
      for (const ctrl in this.CancelRuleForm.controls) {
        if (controlNames.indexOf(ctrl) > -1) {
          this.CancelRuleForm.get(ctrl).clearValidators();
          this.CancelRuleForm.get(ctrl).updateValueAndValidity();
        }
      }
      this.CancelRuleForm.reset();
      this.CancelRuleForm.markAsPristine();
      this.CancelRuleForm.markAllAsTouched();
      this.CancelRuleForm.controls.cancelRuleId.setValue(0);
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
  private cancelRuleTblAutoFilters(): void {
    this.clientNameFilteredOptions = this.clientNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.clientCancelRuleDetails.map(x => x.clientName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.fromLookupNameFilteredOptions = this.fromLookupNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.clientCancelRuleDetails.map(x => x.fromLookupName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.toLookupNameFilteredOptions = this.toLookupNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.clientCancelRuleDetails.map(x => x.toLookupName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
  }
  resetTable() {
    this.dt.reset();
    this.clientNameControl.reset();
    this.fromLookupNameControl.reset();
    this.toLookupNameControl.reset();
    this.global.nativeElement.value = '';
    this.fromhrCtl.nativeElement.value = '';
    this.tohrCtl.nativeElement.value = '';
    this.percentageCtl.nativeElement.value = '';
    this.cancelRuleTblAutoFilters();
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
            this.removeAgentCancelRuleDetail(data);
          }
        }
      });
    }
  }
  showall() {
    if (this.clientCancelRuleDetails.length > 0) {
      this.itemperpage = this.clientCancelRuleDetails.length;
    }
  }
  closeMenu(col: any) {
    switch (col) {
      case 'clientName': this.clientNameTrigger.closeMenu(); break;
      case 'toLookupName': this.toLookupNameCtrlTrigger.closeMenu(); break;
      case 'fromLookupName': this.fromLookupNameCtrlTrigger.closeMenu(); break;
      case 'description': this.descriptionCtrlTrigger.closeMenu(); break;
      case 'fromHours': this.fromHoursCtrlTrigger.closeMenu(); break;
      case 'toHours': this.toHoursCtrlTrigger.closeMenu(); break;
      case 'percentage': this.percentageCtrlTrigger.closeMenu(); break;
      // case 'reqEffectiveDate': this.reqEffectiveDateCtrlTrigger.closeMenu(); break;
      default: break;
    }
  }
}
