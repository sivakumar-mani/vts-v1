import { Component, OnInit, ViewChild, OnDestroy, ElementRef, TemplateRef } from '@angular/core';
import { startWith, map, min } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UntypedFormControl, Validators, UntypedFormBuilder, UntypedFormGroup, UntypedFormArray } from '@angular/forms';
import { AgentEntryMasterService } from '../../common-methods/services/agent-entry-master.service';

import { CommonService } from 'src/app/common-methods/services/common.service';
import { ScreenAuth } from '../../common-methods/models/screen-auth';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { BreadcrumbFlags } from '../../common-methods/models/breadcrumb-flags';
import { MatDialog } from '@angular/material/dialog';
import { CommonAlertsComponent } from '../../common-methods/common-alerts/common-alerts.component';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table'

@Component({
  standalone: false,
  selector: 'app-components-details',
  templateUrl: './components-details.component.html',
  styleUrls: ['./components-details.component.css']
})
export class ComponentsDetailsComponent implements OnInit {

  displayedColumns = [
    { field: 'compName', header: 'Component Name' },
    { field: 'compShortName', header: 'Component Short Name' },
    { field: 'msp', header: 'MSP' },
    { field: 'nrp', header: 'NRP' },
    { field: 'currencyName', header: 'Currency' },
    { field: 'tat', header: 'TAT' },
    { field: 'beyondTat', header: 'BT' },
    { field: 'currentTat', header: 'CT' },
    { field: 'nearTat', header: 'NT' },
    { field: 'withInTat', header: 'WT' },
    { field: 'active', header: 'Active' },
  ];
  currencyControls!: AutoCompleteDropDown;
  componentList: any[] = [];
  componentListTemp: any[] = [];
  compoListControl = new UntypedFormControl();
  compoCodeControl = new UntypedFormControl();
  compoListFilteredOptions: Observable<string[]>;
  compoCodeFilteredOptions: Observable<string[]>;
  showClientGrid: boolean;
  totalpages: number;
   @ViewChild('dt', { static: false }) dt!: Table;
  @ViewChild('global', { static: true }) global!: ElementRef;
  @ViewChild('updateConfirmation', { static: true }) 
updateConfirmation!: TemplateRef<any>;
  currentPage = 1;
  tempCurrentPage = 1;
  routePath = 'Configure / Case / Components';
  ComponentForm: UntypedFormGroup;
  dispalyTable = true;
  compId = 0;
  isEdit: boolean;
  activeDisableFlag = false;
  breadcrumbFlag = new BreadcrumbFlags();
  screenAuth: ScreenAuth = new ScreenAuth();
  cyompoListFilteredOptions: Observable<any[]>;
  showAdvField: boolean;
  currencyLists: any;
  userData: any;
  showBt: boolean = false;
  showCt: boolean = false;
  showNt: boolean = false;
  showWt: boolean = false;
  dialogRef: any;
  @ViewChild('tatValidation', { static: true }) tatValidation;
  constructor(public masterService: AgentEntryMasterService, private common: CommonService, private agent: AgentEntryMasterService,
    private fb: UntypedFormBuilder, private message: MessageService, private authService: AuthService, public dialog: MatDialog,
    private router: Router,) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    // this.breadcrumbFlag = this.common.breadcrumbFlags(true);
    this.screenAuth = this.authService.getScreenAuth(this.router.url);
    this.dispalyTable = true;
    this.loadComponents();
  }
  openForm() {
    // this.breadcrumbFlag = this.common.breadcrumbFlags();
    this.breadcrumbFlag.toolTip = 'Save';
    this.breadcrumbFlag.btnSave = true;
    this.breadcrumbFlag.btnBack = true;
    this.breadcrumbFlag.btnReset = true;
    this.breadcrumbFlag.btnAdd = true;
    this.breadcrumbFlag.btnResetTbl = false;
    this.breadcrumbFlag.btnSaveDisabled = false;
    this.dispalyTable = false;
    this.initFormGroup();
    this.getCurrencyList();
    this.compId = 0;
  }
  closeForm() {
    this.breadcrumbFlag.btnSave = true;
    this.breadcrumbFlag.btnReset = true;
    this.ComponentForm.reset();
    this.dispalyTable = !this.dispalyTable;
    this.isEdit = false;
    this.breadcrumbFlag.btnSave = false;
    this.breadcrumbFlag.btnBack = false;
    this.breadcrumbFlag.btnReset = false;
    this.breadcrumbFlag.btnAdd = false;
    this.breadcrumbFlag.btnResetTbl = true;
    // this.breadcrumbFlag = this.common.breadcrumbFlags();
  }
  initFormGroup() {
    this.ComponentForm = this.fb.group({
      componentName: ['', Validators.required],
      componentShortName: ['', Validators.required],
      nrp: [null, [Validators.required, Validators.min(1)]],
      msp: [null, [Validators.required, Validators.min(1)]],
      clientComponentId: [0],
      isActive: [true],
      callChargeLimitFlag: [],
      isDirectAppComp: [],
      subCompFlag: [],
      abroadCompFlag: [],
      deqcFlag: [],
      InsTypFlag: [],
      EduCatFlag: [],
      maxNoOfComp: [''],
      tat: ['', [Validators.required, Validators.min(1)]],
      beyondTat: new UntypedFormControl('', [Validators.required]),
      currentTat: new UntypedFormControl('', [Validators.required]),
      nearTat: new UntypedFormControl('', [Validators.required]),
      withInTat: new UntypedFormControl('', [Validators.required]),
      currency: ['', [Validators.required]],
    });
    this.currencyControls = new AutoCompleteDropDown('Currency', 'currency', 'currencyId', 'currencyShortName', this.currencyLists,
      '', this.ComponentForm, false, false, true);
  }
  getCurrencyList() {
    this.agent.getCurrencyDetails().subscribe(res => {
      if (res) {
        this.currencyLists = res;
        this.currencyControls = new AutoCompleteDropDown('Currency', 'currency', 'currencyId', 'currencyShortName', this.currencyLists,
          '', this.ComponentForm, false, false, true);
      }
    });
  }
  loadComponents() {
    this.masterService.getComponentGridDetails().subscribe(res => {
      if (res) {
        this.componentList = res;
        this.componentListTemp = res;
      }
    },
      err => { }, () => {
        this.cyompoListFilteredOptions = this.compoListControl.valueChanges.pipe(startWith(''),
          map(value =>
            (Array.from(new Set(this.componentList.map(x => x.compName).filter(x => x))).sort())
              .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
        this.compoCodeFilteredOptions = this.compoCodeControl.valueChanges.pipe(startWith(''),
          map(value =>
            (Array.from(new Set(this.componentList.map(x => x.compShortName).filter(x => x))).sort())
              .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
      });
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

  addComponents() {
    if (this.dispalyTable) {
      this.onClickUpdateDialog();
    } else {
      const controlNames = ['componentName', 'componentShortName', 'nrp', 'msp', 'tat'];
      for (const ctrl in this.ComponentForm.controls) {
        if (controlNames.indexOf(ctrl) > -1) {
          if ((this.ComponentForm.get(ctrl).value && !this.ComponentForm.get(ctrl).valid) ||
            !this.ComponentForm.get(ctrl).value) {
            this.ComponentForm.get(ctrl).setValidators(Validators.required);
            this.ComponentForm.get(ctrl).markAsTouched();
          } else {
            this.ComponentForm.get(ctrl).clearValidators();
            this.ComponentForm.get(ctrl).updateValueAndValidity();
          }
        }
      }
      if (this.ComponentForm.valid) {
        const data: Componentclass = {
          compId: this.compId,
          compShortName: this.ComponentForm.controls['componentShortName'].value,
          compName: this.ComponentForm.controls['componentName'].value,
          compDesc: '',
          noOfAnnexure: 0,
          msp: this.ComponentForm.controls['msp'].value,
          nrp: this.ComponentForm.controls['nrp'].value,
          displayOrder: 0,
          cancelFlag: false,
          callChargeLimitFlag: this.ComponentForm.controls['callChargeLimitFlag'].value,
          isDirectAppComp: this.ComponentForm.controls['isDirectAppComp'].value,
          subCompFlag: this.ComponentForm.controls['subCompFlag'].value,
          active: this.ComponentForm.controls['isActive'].value,
          createdUserId: this.userData.userId,
          updatedUserId: this.userData.userId,
          tat: this.ComponentForm.controls['tat'].value,
          beyondTat: this.ComponentForm.controls['beyondTat'].value,
          currentTat: this.ComponentForm.controls['currentTat'].value,
          nearTat: this.ComponentForm.controls['nearTat'].value,
          withInTat: this.ComponentForm.controls['withInTat'].value,
          abroadCompFlag: this.ComponentForm.controls['abroadCompFlag'].value,
          deqcflag: this.ComponentForm.controls['deqcFlag'].value,
          InsTypFlag: this.ComponentForm.controls['InsTypFlag'].value,
          EduCatFlag: this.ComponentForm.controls['EduCatFlag'].value,
          maxNoOfComp: this.ComponentForm.controls['maxNoOfComp'].value,
          currencyId: this.ComponentForm.controls['currency'].value
        };
        this.masterService.AddComponent(data).subscribe(res => {
          if (res.success) {
            this.showTopCenter('success', 'Success Message',
              this.ComponentForm.controls.clientComponentId.value > 0 ? 'Updated Successfully' : 'Saved Successfully');
          } else {
            this.showTopCenter('error', 'Success Message', 'Failed to add');
          }
          this.loadComponents();
          this.closeForm();
        });
      } else {
        this.ComponentForm.markAllAsTouched();
      }
    }
  }

  GetComponentsById(id: number, mode: any) {
    this.breadcrumbFlag.toolTip = 'Update';
    this.breadcrumbFlag.btnSave = true;
    this.breadcrumbFlag.btnBack = true;
    this.breadcrumbFlag.btnReset = true;
    this.breadcrumbFlag.btnAdd = true;
    this.breadcrumbFlag.btnResetTbl = false;
    // this.breadcrumbFlag = this.common.breadcrumbFlags();
    this.initFormGroup();
    this.getCurrencyList();
    this.masterService.GetComponentsById(id).subscribe(res => {
      this.common.tempResetData = res;
      const data: Componentclass = res; this.compId = data.compId;
      this.activeDisableFlag = res.activeDisableFlag;
      this.ComponentForm.patchValue({
        clientComponentId: data.compId,
        componentShortName: data.compShortName,
        componentName: data.compName,
        msp: data.msp,
        nrp: data.nrp,
        isActive: data.active,
        callChargeLimitFlag: data.callChargeLimitFlag,
        isDirectAppComp: data.isDirectAppComp,
        subCompFlag: data.subCompFlag,
        tat: data.tat,
        beyondTat: data.beyondTat,
        currentTat: data.currentTat,
        nearTat: data.nearTat,
        withInTat: data.withInTat,
        abroadCompFlag: data.abroadCompFlag,
        maxNoOfComp: data.maxNoOfComp,
        deqcFlag: data.deqcflag,
        InsTypFlag: data.InsTypFlag,
        EduCatFlag: data.EduCatFlag,
        currency: data.currencyId
      });
      this.showBt = this.ComponentForm.get('tat')?.value ? true : false;
      this.showCt = this.ComponentForm.get('beyondTat')?.value ? true : false;
      this.showNt = this.ComponentForm.get('currentTat')?.value ? true : false;
      this.showWt = this.ComponentForm.get('nearTat')?.value ? true : false;
      this.getCompType({ checked: data.subCompFlag });
      if (mode === 'view') {
        this.breadcrumbFlag.btnSave = false;
        this.breadcrumbFlag.btnReset = false;
        this.ComponentForm.disable();
      }
    });
    this.dispalyTable = !this.dispalyTable;
    this.isEdit = true;
  }
  resetForm() {
    if (this.ComponentForm.controls.clientComponentId.value > 0) {
      this.ComponentForm.patchValue({
        componentShortName: this.common.tempResetData.compShortName,
        componentName: this.common.tempResetData.compName,
        msp: this.common.tempResetData.msp,
        nrp: this.common.tempResetData.nrp,
        isActive: this.common.tempResetData.isActive,
        callChargeLimitFlag: this.common.tempResetData.callChargeLimitFlag,
        isDirectAppComp: this.common.tempResetData.isDirectAppComp,
        subCompFlag: this.common.tempResetData.subCompFlag
      });
    } else {
      const controlNames = ['componentName', 'componentShortName', 'nrp', 'msp', 'tat'];
      for (const ctrl in this.ComponentForm.controls) {
        if (controlNames.indexOf(ctrl) > -1) {
          this.ComponentForm.get(ctrl).clearValidators();
          this.ComponentForm.get(ctrl).updateValueAndValidity();
        }
      }
      this.ComponentForm.controls.clientComponentId.setValue(0);
      this.ComponentForm.reset();
      this.ComponentForm.markAsPristine();
      this.ComponentForm.markAllAsTouched();
    }
  }
  resetTable() {
    this.dt.reset();
    this.showBt = false;
    this.showCt = false;
    this.showNt = false;
    this.showWt = false;
    this.global.nativeElement.value = '';
  }

  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }

  isComponentExist() {
    const data = this.ComponentForm.controls['componentName'].value.trim();
    if (!this.isEdit) {
      this.masterService.checkExistingComponent(data).subscribe(res => {
        if (res) {
          this.showTopCenter('error', 'Success Message', 'Component Name already exist');
          this.ComponentForm.controls['componentName'].setValue(undefined);
        }
      });
    } else {
      if (this.common.tempResetData.compName !== data) {
        this.masterService.checkExistingComponent(data).subscribe(res => {
          if (res) {
            this.showTopCenter('error', 'Success Message', 'Component Name already exist');
            this.ComponentForm.controls['componentName'].setValue(this.common.tempResetData.compName);
          }
        });
      }
    }
  }
  onRowReorder(rowData: any) {
    if (rowData) {
      if (rowData.dragIndex < rowData.dropIndex) {
        this.componentListTemp.filter(e => e.displayOrder > rowData.dragIndex && e.displayOrder <= rowData.dropIndex)
          .forEach(r => r.displayOrder = r.displayOrder - 1);
        this.componentListTemp[rowData.dropIndex - 1].displayOrder = rowData.dropIndex;
      } else {
        this.componentListTemp.filter(e => e.displayOrder >= rowData.dropIndex + 1 && e.displayOrder <= rowData.dragIndex + 1)
          .forEach(a => a.displayOrder = a.displayOrder + 1);
        this.componentListTemp[rowData.dropIndex].displayOrder = rowData.dropIndex + 1;
      }
      this.breadcrumbFlag.toolTip = 'Update';
      this.breadcrumbFlag.btnSave = true;
      this.breadcrumbFlag.btnBack = false;
      this.breadcrumbFlag.btnReset = false;
      this.breadcrumbFlag.btnAdd = true;
      this.breadcrumbFlag.btnResetTbl = true;
      if (!this.screenAuth.editFlag) {
        this.breadcrumbFlag.btnSaveDisabled = true;
      }
    }
  }
  // onClickUpdateDialog() {
  //   const popupData = {
  //     action: this.common.DELETECONFIRMATION,
  //     headerText: 'Confirmation',
  //     bodyText: 'Do you want to save re-ordered records..?'
  //   };
  //   const dialogRef = this.dialog.open(CommonAlertsComponent, {
  //     width: '400px',
  //     data: popupData,
  //     disableClose: true
  //   });
  //   if (dialogRef) {
  //     dialogRef.afterClosed().subscribe(result => {
  //       if (result) {
  //         const action = String(result.type);
  //         if (action === this.common.DELETECONFIRMATION) {
  //           this.onClickUpdateOk();
  //         }
  //       }
  //       this.breadcrumbFlag.btnSave = false;
  //       this.breadcrumbFlag.btnBack = false;
  //       this.breadcrumbFlag.btnReset = false;
  //       this.breadcrumbFlag.btnAdd = true;
  //       this.breadcrumbFlag.btnResetTbl = true;
  //       this.loadComponents();
  //     });
  //   }
  // }

  onClickUpdateOk() {
    this.masterService.updateComponentTblRows(this.componentListTemp).subscribe(res => {
      if (res.success) {
        this.showTopCenter('success', 'Success Message', 'Updated Successfully');
        this.loadComponents();
        this.dialog.closeAll();
        this.breadcrumbFlag.btnSave = false;
        this.breadcrumbFlag.btnBack = false;
        this.breadcrumbFlag.btnReset = false;
        this.breadcrumbFlag.btnAdd = true;
        this.breadcrumbFlag.btnResetTbl = true;
      }
    });
  }
  deleteComponent(ComponentId: any) {
    this.masterService.deleteComponent(ComponentId).subscribe(res => {
      if (res) {
        this.showTopCenter('warn', 'Success Message', 'Deleted Successfully');
        this.loadComponents();
      }
    });
  }
  public openDialog(data: any) {
    const popupData = {
      action: this.common.DELETECONFIRMATION,
      headerText: 'Confirmation',
      bodyText: 'Are you sure you want to delete this component?'
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
            this.deleteComponent(data);
          }
        }
      });
    }
  }

  onClickUpdateDialog() {
    this.dialog.open(this.updateConfirmation, {
      width: '320px',
      disableClose: true
    });

  }
  dialogClose() {
    this.dialog.closeAll();
    this.componentListTemp = [];
    this.loadComponents();
    this.breadcrumbFlag.btnSave = false;
    this.breadcrumbFlag.btnBack = false;
    this.breadcrumbFlag.btnReset = false;
    this.breadcrumbFlag.btnAdd = true;
    this.breadcrumbFlag.btnResetTbl = true;
  }
  getCompType(event: any) {
    if (event.checked) {
      this.showAdvField = true;
      this.ComponentForm.get('maxNoOfComp')?.setValue('');
      // this.ComponentForm.get('maxNoOfComp')?.clearValidators();
      // this.ComponentForm.get('maxNoOfComp')?.updateValueAndValidity();
    } else {
      this.showAdvField = false;
      // this.ComponentForm.get('maxNoOfComp')?.setErrors({ required: true });
    }
  }
  checkTat(eventValue, fieldName) {
    eventValue = Number(eventValue);
    let tatValue = this.ComponentForm.get('tat')?.value ? Number(this.ComponentForm.get('tat')?.value) : '';
    let beyondTatValue = this.ComponentForm.get('beyondTat')?.value ? Number(this.ComponentForm.get('beyondTat')?.value) : '';
    let currentTatValue = this.ComponentForm.get('currentTat')?.value ? Number(this.ComponentForm.get('currentTat')?.value) : '';
    let nearTatValue = this.ComponentForm.get('nearTat')?.value ? Number(this.ComponentForm.get('nearTat')?.value) : '';
    let withInTatValue = this.ComponentForm.get('withInTat')?.value ? Number(this.ComponentForm.get('withInTat')?.value) : '';
    if (fieldName === 'tat') {
      if (eventValue && this.ComponentForm.get('tat')?.valid) {
        if (eventValue > 0) {
          this.showBt = true;
        }
      }
      if (currentTatValue && nearTatValue && withInTatValue && beyondTatValue && tatValue === '') {
        this.makeEmptyField('tat');
      }
    } else if (fieldName === 'bt') {
      if (currentTatValue && nearTatValue && withInTatValue && beyondTatValue === '') {
        this.makeEmptyField('bt');
      }
      if (eventValue >= tatValue) {
        this.showCt = true;
      }
    } else if (fieldName === 'ct') {
      if (eventValue <= beyondTatValue) {
        this.showNt = true;
      }
    } else if (fieldName === 'nt') {
      if (eventValue <= currentTatValue) {
        this.showWt = true;
      }
    }
    this.validInputValues(beyondTatValue, tatValue, currentTatValue, nearTatValue, withInTatValue);
  }
  validInputValues(beyondTatValue, tatValue, currentTatValue, nearTatValue, withInTatValue) {
    if (beyondTatValue > tatValue && currentTatValue <= beyondTatValue && nearTatValue <= currentTatValue && withInTatValue <= nearTatValue) {
      // Valid values
      this.ComponentForm.get('beyondTat')?.setErrors(null);
      this.ComponentForm.get('nearTat')?.setErrors(null);
      this.ComponentForm.get('currentTat')?.setErrors(null);
      this.ComponentForm.get('withInTat')?.setErrors(null);
    } else {
      // Invalid values
      if (beyondTatValue <= tatValue) {
        this.ComponentForm.get('beyondTat')?.markAsTouched();
        this.ComponentForm.get('beyondTat')?.setErrors({ incorrect: true });
      }
      else
        this.ComponentForm.get('beyondTat')?.setErrors(null);
      if (currentTatValue > beyondTatValue)
        this.ComponentForm.get('currentTat')?.setErrors({ incorrect: true });
      else
        this.ComponentForm.get('currentTat')?.setErrors(null);
      if (nearTatValue > currentTatValue)
        this.ComponentForm.get('nearTat')?.setErrors({ incorrect: true });
      else
        this.ComponentForm.get('nearTat')?.setErrors(null);
      if (withInTatValue > nearTatValue)
        this.ComponentForm.get('withInTat')?.setErrors({ incorrect: true });
      else
        this.ComponentForm.get('withInTat')?.setErrors(null);
    }
  }
  makeEmptyField(field: any) {
    let value = field === 'tat' ? 'BT,' : '';
    this.dialogRef = this.dialog.open(this.tatValidation, {
      width: '450px',
      data: `${value} CT, NT, WT value is based on ${field.toUpperCase()}. If you remove ${field.toUpperCase()}, then dependent fields become empty`
    });
    this.dialogRef.afterClosed().subscribe((result) => {
      if (result === 'ok') {
        this.showBt = field === 'tat' ? false : true;
        this.showCt = false;
        this.showNt = false;
        this.showWt = false;
        this.ComponentForm.get('beyondTat')?.setValue('');
        this.ComponentForm.get('currentTat')?.setValue('');
        this.ComponentForm.get('nearTat')?.setValue('');
        this.ComponentForm.get('withInTat')?.setValue('');
      }
    })
  }
}

class Componentclass {
  compId: number;
  compShortName: string;
  compName: string;
  compDesc: string;
  noOfAnnexure?: number;
  msp?: number;
  nrp?: number;
  displayOrder?: number;
  cancelFlag?: boolean;
  callChargeLimitFlag?: boolean;
  isDirectAppComp?: boolean;
  subCompFlag?: boolean;
  active?: boolean;
  createdUserId?: number;
  updatedUserId?: number;
  tat: number;
  beyondTat: number;
  nearTat: number;
  currentTat: number;
  withInTat: number;
  abroadCompFlag: boolean;
  deqcflag: boolean;
  InsTypFlag: boolean;
  EduCatFlag: boolean;
  maxNoOfComp: number;
  currencyId: number;
}
