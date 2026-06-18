import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UntypedFormControl, Validators, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { AgentEntryMasterService } from '../../common-methods/services/agent-entry-master.service';

import { CommonService } from '../../common-methods/services/common.service';
import { MasterService } from '../../common-methods/services/master.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../common-methods/services/auth.service';
import { ScreenAuth } from '../../common-methods/models/screen-auth';
import { BreadcrumbFlags } from '../../common-methods/models/breadcrumb-flags';
import { CommonAlertsComponent } from '../../common-methods/common-alerts/common-alerts.component';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  standalone: false,
  selector: 'app-subcomponent-details',
  templateUrl: './subcomponent-details.component.html',
  styleUrls: ['./subcomponent-details.component.css']
})
export class SubcomponentDetailsComponent implements OnInit {
  displayedColumns = [
    { field: 'compName', header: 'Component Name' },
    { field: 'subCompName', header: 'SubComponent Name' },
    { field: 'subCompDesc', header: 'SubComponent Desc' },
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
  componentList: any[] = [];
  comptList: any[] = [];
  componentListTemp: any[] = [];
  compoListControl = new UntypedFormControl();
  compoCodeControl = new UntypedFormControl();
  compoListFilteredOptions: Observable<string[]>;
  compoCodeFilteredOptions: Observable<string[]>;

  totalpages: number;
   @ViewChild('dt', { static: false }) dt!: Table;
  @ViewChild('updateConfirmation', { static: true }) 
updateConfirmation!: TemplateRef<any>;
  currentPage = 1;
  tempCurrentPage = 1;
  pathParameters: string[];
  routePath = 'Configure / Case / Sub Component';
  ComponentForm: UntypedFormGroup;
  dispalyTable = true;
  compId = 0;
  isEdit: boolean;
  activeDisableFlag = false;
  compontList: compont[] = [];
  compfilterlist: any[] = [];
  compkeyUp = false;
  breadcrumbFlag = new BreadcrumbFlags();
  screenAuth: ScreenAuth = new ScreenAuth();
  currencyLists: any;
  currencyControls!: AutoCompleteDropDown;
  userData: any;
  showBt: boolean = false;
  showCt: boolean = false;
  showNt: boolean = false;
  showWt: boolean = false;
  dialogRef: any;
  @ViewChild('tatValidation', { static: true }) tatValidation;
  constructor(public masterService: MasterService, private common: CommonService, private authService: AuthService,
    private fb: UntypedFormBuilder, private message: MessageService, public dialog: MatDialog,
    public agentMasterService: AgentEntryMasterService, private router: Router,) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.screenAuth = this.authService.getScreenAuth(this.router.url);
    this.dispalyTable = true;
    this.loadSubComponents();
    this.GetComponentList();
    // this.setBreadcrumbs();
  }
  getCurrencyList() {
    this.agentMasterService.getCurrencyDetails().subscribe(res => {
      if (res) {
        this.currencyLists = res;
        this.currencyControls = new AutoCompleteDropDown('Currency', 'currency', 'currencyId', 'currencyShortName', this.currencyLists,
          '', this.ComponentForm, false, false, true);
      }
    });
  }
  openForm() {
    this.breadcrumbFlag.toolTip = 'Save';
    this.breadcrumbFlag.btnSave = true;
    this.breadcrumbFlag.btnBack = true;
    this.breadcrumbFlag.btnReset = true;
    this.breadcrumbFlag.btnAdd = false;
    this.breadcrumbFlag.btnResetTbl = false;
    this.breadcrumbFlag.btnSaveDisabled = false;
    this.dispalyTable = false;
    this.initFormGroup();
    this.getCurrencyList();
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
    this.breadcrumbFlag.btnAdd = true;
    this.breadcrumbFlag.btnResetTbl = true;
  }

  initFormGroup() {
    this.ComponentForm = this.fb.group({
      compId: ['', Validators.required],
      subCompName: ['', Validators.required],
      subCompDesc: ['', Validators.required],
      nrp: ['', Validators.required],
      msp: ['', Validators.required],
      subComponentId: [0],
      active: [true],
      tat: ['', Validators.required],
      beyondTat: new UntypedFormControl('', [Validators.required]),
      currentTat: new UntypedFormControl('', [Validators.required]),
      nearTat: new UntypedFormControl('', [Validators.required]),
      withInTat: new UntypedFormControl('', [Validators.required]),
      abroadCompFlag: [{ value: '', disabled: true }],
      deqcFlag: [{ value: '', disabled: true }],
      maxNoOfComp: [''],
      currency: ['', [Validators.required]],
    });
    this.currencyControls = new AutoCompleteDropDown('Currency', 'currency', 'currencyId', 'currencyShortName', this.currencyLists,
      '', this.ComponentForm, false, false, true);
  }

  loadSubComponents() {
    this.masterService.GetSubComponentList().subscribe(res => {
      if (res) {
        this.componentList = res;
        this.componentListTemp = res;
      }
    },
      err => { }, () => {
        this.compoListFilteredOptions = this.compoListControl.valueChanges.pipe(startWith(''),
          map(value =>
            (Array.from(new Set(this.componentList.map(x => x.rptType).filter(x => x))).sort())
              .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
        this.compoCodeFilteredOptions = this.compoCodeControl.valueChanges.pipe(startWith(''),
          map(value =>
            (Array.from(new Set(this.componentList.map(x => x.rptDesc).filter(x => x))).sort())
              .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
      });
  }

  GetComponentList() {
    this.masterService.GetComponentList().subscribe(res => {
      if (res) {
        this.compontList = res;
        this.compfilterlist = res;
      }
    });
  }

  addComponents() {
    if (this.dispalyTable) {
      this.onClickUpdateDialog();
    } else {
      const controlNames = ['compId', 'subCompName', 'subCompDesc', 'nrp', 'msp'];
      for (const ctrl in this.ComponentForm.controls) {
        if (controlNames.indexOf(ctrl) > -1) {
          if (!this.ComponentForm.get(ctrl).value) {
            this.ComponentForm.get(ctrl).setValidators(Validators.required);
            this.ComponentForm.get(ctrl).updateValueAndValidity();
          } else {
            this.ComponentForm.get(ctrl).clearValidators();
            this.ComponentForm.get(ctrl).updateValueAndValidity();
          }
        }
      }
      if (this.ComponentForm.valid) {
        const data: Componentclass = {
          compId: this.ComponentForm.controls['compId'].value,
          compShortName: '',
          compName: '',
          compDesc: '',
          noOfAnnexure: 0,
          msp: this.ComponentForm.controls['msp'].value,
          nrp: this.ComponentForm.controls['nrp'].value,
          tat: this.ComponentForm.controls['tat'].value,
          beyondTat: this.ComponentForm.controls['beyondTat'].value,
          currentTat: this.ComponentForm.controls['currentTat'].value,
          nearTat: this.ComponentForm.controls['nearTat'].value,
          withInTat: this.ComponentForm.controls['withInTat'].value,
          displayOrder: 0,
          cancelFlag: false,
          callChargeLimitFlag: false,
          subCompFlag: false,
          active: this.ComponentForm.controls['active'].value,
          createdUserId: this.userData.userId,
          updatedUserId: this.userData.userId,
          subCompDesc: this.ComponentForm.controls['subCompDesc'].value,
          subCompId: this.ComponentForm.controls['subComponentId'].value,
          subCompName: this.ComponentForm.controls['subCompName'].value,
          maxNoOfComp: this.ComponentForm.controls['maxNoOfComp'].value,
          abroadCompFlag: this.ComponentForm.controls['abroadCompFlag'].value,
          deqcflag: this.ComponentForm.controls['deqcFlag'].value,
          currencyId: this.ComponentForm.controls['currency'].value,
        };
        this.masterService.AddSubComponents(data).subscribe(res => {
          if (res.success) {
            if (this.ComponentForm.get('subComponentId')?.value > 0) {
              this.showTopCenter('success', 'Success Message', 'Updated Successfully');
            } else {
              this.showTopCenter('success', 'Success Message', 'Saved Successfully');
            }
          } else {
            this.showTopCenter('error', 'Failure Message', 'Field to add');
          }
          this.loadSubComponents();
          this.closeForm();
        });
        this.pathParameters = [this.common.SHOW, this.routePath];
        this.common.FlagEvent(this.pathParameters);
      } else {
        this.ComponentForm.markAllAsTouched();
      }
    }
  }

  GetSubComponentsById(id: number, mode: any) {
    this.breadcrumbFlag.toolTip = 'Update';
    this.breadcrumbFlag.btnSave = true;
    this.breadcrumbFlag.btnBack = true;
    this.breadcrumbFlag.btnReset = true;
    this.breadcrumbFlag.btnAdd = false;
    this.breadcrumbFlag.btnResetTbl = false;
    this.initFormGroup();
    this.getCurrencyList();
    this.masterService.GetSubComponentsById(id).subscribe(res => {
      this.common.tempResetData = res;
      const data: Componentclass = res;
      this.compId = data.compId;
      this.activeDisableFlag = res.activeDisableFlag;
      this.ComponentForm.patchValue({
        compId: data.compId,
        subCompDesc: data.subCompDesc,
        subCompName: data.subCompName,
        msp: data.msp,
        nrp: data.nrp,
        tat: data.tat,
        beyondTat: data.beyondTat,
        currentTat: data.currentTat,
        nearTat: data.nearTat,
        withInTat: data.withInTat,
        subComponentId: data.subCompId,
        active: data.active,
        maxNoOfComp: data.maxNoOfComp,
        abroadCompFlag: data.abroadCompFlag,
        deqcFlag: data.deqcflag,
        currency: data.currencyId
      });
      this.showBt = this.ComponentForm.get('tat')?.value ? true : false;
      this.showCt = this.ComponentForm.get('beyondTat')?.value ? true : false;
      this.showNt = this.ComponentForm.get('currentTat')?.value ? true : false;
      this.showWt = this.ComponentForm.get('nearTat')?.value ? true : false;
      this.getCompStatus({ option: { value: data.compId } });
      if (mode === 'view') {
        this.ComponentForm.disable();
        this.breadcrumbFlag.btnSave = false;
        this.breadcrumbFlag.btnReset = false;
      }
    });
    this.dispalyTable = !this.dispalyTable;
    this.isEdit = true;
    this.compItems('');
  }

  resetForm() {
    if (this.ComponentForm.controls['subComponentId'].value > 0) {
      this.ComponentForm.patchValue({
        compId: this.common.tempResetData.compId,
        subCompDesc: this.common.tempResetData.subCompDesc,
        subCompName: this.common.tempResetData.subCompName,
        msp: this.common.tempResetData.msp,
        nrp: this.common.tempResetData.nrp,
        tat: this.common.tempResetData.tat,
        subComponentId: this.common.tempResetData.subCompId,
        active: this.common.tempResetData.active
      });
      this.pathParameters = [this.common.UPDATE, this.routePath];
    } else {
      const controlNames = ['compId', 'subCompName', 'subCompDesc', 'nrp', 'msp', 'tat'];
      for (const ctrl in this.ComponentForm.controls) {
        if (controlNames.indexOf(ctrl) > -1) {
          this.ComponentForm.get(ctrl).clearValidators();
          this.ComponentForm.get(ctrl).updateValueAndValidity();
        }
      }
      this.ComponentForm.controls['subComponentId'].setValue(0);
      this.ComponentForm.reset();
      this.ComponentForm.markAsPristine();
      this.ComponentForm.markAllAsTouched();
      this.pathParameters = [this.common.SHOW, this.routePath];
      this.initFormGroup();
    }
    this.common.FlagEvent(this.pathParameters);
  }

  isSubComponentExist() {
    if (this.ComponentForm.controls['subCompName'].value) {
      this.masterService.GetValidationSubComp(this.ComponentForm.controls['compId'].value,
        this.ComponentForm.controls['subComponentId'].value,
        this.ComponentForm.controls['subCompName'].value).subscribe(res => {
          if (!res.success) {
            this.ComponentForm.controls['subCompName'].setValue('');
            this.showTopCenter('error', 'Failure Message', 'Subcomponent Name already exist');
          }
        });
    }
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

  // Component AC
  compKeyupFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        const comp = this.compontList.filter(e =>
          e.compName.toLowerCase() === value.toLowerCase());
        if (comp.length > 0) {
          this.compkeyUp = true;
        } else {
          this.compkeyUp = true;
        }
      } else {
        this.compkeyUp = false;
      }
    }
  }

  get displayCompFn() {
    const compNew = (comp) => {
      if (comp == null || comp === undefined) {
        return null;
      } else {
        if (comp && this.compfilterlist && this.compfilterlist.length > 0) {
          comp = this.compfilterlist.find(x => x.compId === comp);
          return comp.compName;
        } else {
          return null;
        }
      }
    };
    return compNew;
  }

  compItems(value: any) {
    if (!value) { this.assignCompCopy(); }
    if (value) {
      this.compfilterlist = Object.assign([], this.compontList).filter(
        item => ((item.compName.toLowerCase().indexOf(value.toLowerCase()) > -1)));
    }

  }

  assignCompCopy() {
    this.compfilterlist = Object.assign([], this.compontList);
  }

  onRowReorder(rowData, index) {
    if (this.checkComponent(rowData)) { return; }
    if (rowData) {
      if (rowData.dragIndex < rowData.dropIndex) {
        this.componentList.filter(f => f.compId === this.componentList[rowData.dragIndex].compId).forEach((e, ind) => {
          e.displayOrder = ind + 1;
        });
      } else {
        this.componentList.filter(f => f.compId === this.componentList[rowData.dragIndex].compId).forEach((e, ind) => {
          e.displayOrder = ind + 1;
        });
      }
    }
    this.componentListTemp = this.componentList;
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

  onClickUpdateDialog() {
    this.dialog.open(this.updateConfirmation, {
      width: '320px',
      disableClose: true
    });

  }

  checkComponent(rowData): boolean {
    let isOtherComp = false; let dragCompValue: any;
    let dragCompId = 0; let dropCompId = 0;
    if (rowData.dragIndex > rowData.dropIndex) {
      dragCompValue = this.componentList[rowData.dropIndex];
      dragCompId = dragCompValue.compId;
      dropCompId = this.componentList[rowData.dropIndex + 1].compId;
    } else {
      dragCompValue = this.componentList[rowData.dropIndex - 1];
      dragCompId = dragCompValue.compId;
      dropCompId = this.componentList[rowData.dropIndex].compId;
    }
    if (dragCompId !== dropCompId) {
      isOtherComp = true;
      this.componentList = this.componentList.filter(e => e !== dragCompValue);
      const data: any[] = [];
      this.componentList.forEach((e, index) => {
        if (index === rowData.dragIndex) { data.push(dragCompValue); }
        data.push(e);
      });
      this.componentList = this.common.CloneObject(data);
    }
    this.componentListTemp = this.common.CloneObject(this.componentList);
    return isOtherComp;
  }


  deleteComponent(ComponentId: any) {
    this.agentMasterService.deleteSubComponent(ComponentId).subscribe(res => {
      if (res) {
        this.showTopCenter('warn', 'Success Message', 'Deleted Successfully');
        this.loadSubComponents();
      }
    });
  }

  public openDialog(data: any) {
    const popupData = {
      action: this.common.DELETECONFIRMATION,
      headerText: 'Confirmation',
      bodyText: 'Are you sure you want to delete this sub-Component?'
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

  onClickUpdateOk() {
    this.masterService.updateSubComponentTblRows(this.componentListTemp).subscribe(res => {
      if (res.success) {
        this.showTopCenter('success', 'Success Message', 'Updated Successfully');
        this.loadSubComponents();
        this.dialog.closeAll();
        this.breadcrumbFlag.btnSave = false;
        this.breadcrumbFlag.btnBack = false;
        this.breadcrumbFlag.btnReset = false;
        this.breadcrumbFlag.btnAdd = true;
        this.breadcrumbFlag.btnResetTbl = true;
        this.loadSubComponents();
      }
    });
  }

  dialogClose() {
    this.dialog.closeAll();
    this.componentListTemp = [];
    this.loadSubComponents();
    this.breadcrumbFlag.btnSave = false;
    this.breadcrumbFlag.btnBack = false;
    this.breadcrumbFlag.btnReset = false;
    this.breadcrumbFlag.btnAdd = true;
    this.breadcrumbFlag.btnResetTbl = true;
  }
  checkValidCompValue() {
    if (!this.isEdit) {
      const value = this.ComponentForm.get('compId')?.value;
      if (value === '' || value == null) {
      } else if (this.compkeyUp) {
        this.ComponentForm.controls.compId.setErrors({ incorrect: true });
      } else {
        this.ComponentForm.controls.compId.setErrors(null);
      }
    }
  }

  compValid() {
    if (!this.isEdit) {
      const data: any = this.componentList.filter(e => e.compId ===
        (this.ComponentForm.get('compId')?.value));
      if (data.length > 0) {
        this.ComponentForm.get('compId')?.setValue(data[0].compId);
        this.compkeyUp = false;
      }
      this.checkValidCompValue();
    }
  }
  resetTable() {
    this.dt.reset();
    this.showBt = false;
    this.showCt = false;
    this.showNt = false;
    this.showWt = false;
  }
  getCompStatus(event: any) {
    const data = this.compontList.find(x => x.compId === event.option.value);
    if (data) {
      this.ComponentForm.get('abroadCompFlag')?.setValue(data.abroadCompFlag);
      this.ComponentForm.get('deqcFlag')?.setValue(data.deqcflag);
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
  subCompFlag?: boolean;
  active?: boolean;
  createdUserId?: number;
  updatedUserId?: number;
  subCompId: number;
  subCompDesc: string;
  subCompName: string;
  tat: number;
  beyondTat: number;
  nearTat: number;
  currentTat: number;
  withInTat: number;
  maxNoOfComp: number;
  abroadCompFlag: boolean;
  deqcflag: boolean;
  currencyId: number;
}
class compont {
  compId: number;
  compName: string;
  abroadCompFlag: boolean;
  deqcflag: boolean;
}
