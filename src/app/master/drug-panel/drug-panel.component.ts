import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { BreadcrumbFlags } from '../../common-methods/models/breadcrumb-flags';
import { AuthService } from '../../common-methods/services/auth.service';
import { CommonService } from '../../common-methods/services/common.service';
import { UntypedFormGroup, Validators, UntypedFormBuilder, UntypedFormControl } from '@angular/forms';
import { MasterService } from '../../common-methods/services/master.service';
import { MessageService } from 'primeng/api';
import { CommonAlertsComponent } from '../../common-methods/common-alerts/common-alerts.component';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { Table, TableModule } from 'primeng/table';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-drug-panel',
  templateUrl: './drug-panel.component.html',
  styleUrls: ['./drug-panel.component.css']
})
export class DrugPanelComponent implements OnInit {
  itemperpage;
  showDrugPanel = false;
  drugPanelList: any[] = [];
  drugList: any[] = [];
  drugLstFilter: any[] = [];
  panelList: any[] = [];
  panelLstFilter: any[] = [];
  screenAuth: any = {};
  userData: any;

  btnSave = false;
  btnReset = false;
  btnBack = false;
  btnAdd = true;
  btnResetTbl = true;
  btnAddDisabled = false;
  btnSaveDisabled = false;
  routePath = 'Configure / Case / Drug Panel';
  drugKeyup = false;
  panelKeyup = false;
  breadcrumbFlag = new BreadcrumbFlags();
  drugPanelFormgroup: UntypedFormGroup;
  PanelDisplayColumns = [
    { field: 'drugName', header: 'Drug Name' },
    { field: 'panelName', header: 'Drug Panel Name' },
    { field: 'active', header: 'Active' }];
  frozenCols = [
    { field: 'action', header: 'Action' },
  ];
  isEdit = false;
  @ViewChild('global', { static: true }) global!: ElementRef;
   @ViewChild('dt', { static: false }) dt!: Table;
  @ViewChild('panelNameTrigger', { static: true }) panelNameTrigger!: MatMenuTrigger;
  panelNameFilteredOptions: Observable<string[]>;
  panelNameControl = new UntypedFormControl();

  @ViewChild('drugNameTrigger', { static: true }) drugNameTrigger: MatMenuTrigger;
  drugNameFilteredOptions: Observable<string[]>;
  drugNameControl = new UntypedFormControl();
  totalpages: number;
  currentPage = 1;
  tempCurrentPage = 1;
  // tslint:disable-next-line: max-line-length
  constructor(private authService: AuthService, private common: CommonService, private fb: UntypedFormBuilder,
    private masterService: MasterService, private message: MessageService, public dialog: MatDialog, private router: Router, ) { }

  ngOnInit() {
    this.itemperpage = 10;
    this.screenAuth = this.authService.getScreenAuth(this.router.url);
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.initFormGroup();
    this.getDrugPanelList();
    this.getDrugPanelDetails();
  }
  initFormGroup() {
    this.drugPanelFormgroup = this.fb.group({
      drugPanelMappingId: [0],
      drugId: ['', Validators.required],
      subCompId: ['', Validators.required],
      // drugName: ['', Validators.required],
      active: [true],
      loggedIn: [this.userData.userId]
    });
  }

  getDrugPanelDetails() {
    this.masterService.getDrugPanelDetails().subscribe(res => {
      if (res) {
        this.drugList = res.drug,
          this.drugLstFilter = res.drug;
        this.panelList = res.panel;
        this.panelLstFilter = res.panel;
      }
    });
  }

  getDrugPanelList() {
    this.masterService.getDrugPanelList().subscribe(res => {
      if (res) {
        this.drugPanelList = res;
      }
    }, err => { }, () => {
      this.drugPanelTblAutoFilters();
    });
  }
  openDrugForm() {
    this.breadcrumbFlag.toolTip = 'Save';
    this.breadcrumbFlag.btnSave = true;
    this.breadcrumbFlag.btnBack = true;
    this.breadcrumbFlag.btnReset = true;
    this.breadcrumbFlag.btnAdd = false;
    this.breadcrumbFlag.btnResetTbl = false;
    this.breadcrumbFlag.btnSaveDisabled = false;
    this.initFormGroup();
    this.showDrugPanel = !this.showDrugPanel;
    this.isEdit = false;
  }
  closeDrugForm() {
    this.breadcrumbFlag.btnSave = true;
    this.breadcrumbFlag.btnReset = true;
    this.breadcrumbFlag.btnSave = false;
    this.breadcrumbFlag.btnBack = false;
    this.breadcrumbFlag.btnReset = false;
    this.breadcrumbFlag.btnAdd = true;
    this.breadcrumbFlag.btnResetTbl = true;
    this.drugPanelFormgroup.reset();
    this.showDrugPanel = !this.showDrugPanel;
    this.isEdit = false;
  }
  resetForm() {
    if (this.drugPanelFormgroup.controls.drugPanelMappingId.value > 0) {
      this.drugPanelFormgroup.patchValue({
        drugId: this.common.tempResetData.drugId,
        subCompId: this.common.tempResetData.subCompId,
        active: this.common.tempResetData.active,
        drugPanelMappingId: this.common.tempResetData.drugPanelMappingId
      });
    } else {
      this.drugPanelFormgroup.controls.drugPanelMappingId.setValue(0);
      this.drugPanelFormgroup.reset();
      this.drugPanelFormgroup.markAsPristine();
      this.initFormGroup();
    }
  }
  saveDrugPanel() {
    if (this.drugPanelFormgroup.valid) {
      this.masterService.saveDrugPanel(this.drugPanelFormgroup.value).subscribe(res => {
        if (res) {
          if (this.drugPanelFormgroup.controls.drugPanelMappingId.value > 0) {
            this.showTopCenter('success', 'Success Message', 'Updated Successfully');
          } else {
            this.showTopCenter('success', 'Success Message', 'Saved Successfully');
          }
        } else {
          this.showTopCenter('warn', 'Failure Message', res.message);
        }
        this.getDrugPanelList();
        this.closeDrugForm();
      });
    } else {
      this.drugPanelFormgroup.markAllAsTouched();
    }
  }
  editDrugPanel(drugId, mode: any) {
    this.initFormGroup();
    this.breadcrumbFlag.toolTip = 'Update';
    this.breadcrumbFlag.btnSave = true;
    this.breadcrumbFlag.btnBack = true;
    this.breadcrumbFlag.btnReset = true;
    this.breadcrumbFlag.btnAdd = false;
    this.breadcrumbFlag.btnResetTbl = false;
    this.masterService.editDrugPanel(drugId).subscribe(resp => {
      if (resp) {
        this.drugPanelFormgroup.patchValue({
          drugPanelMappingId: resp.drugPanelMappingId,
          drugId: resp.drugId,
          subCompId: resp.subCompId,
          active: resp.active,
        });
        this.drugPanelFormgroup.controls.loggedIn.setValue(this.userData.userId);
        this.common.tempResetData = resp;
        if (mode === 'view') {
          this.drugPanelFormgroup.disable();
          this.breadcrumbFlag.btnSave = false;
          this.breadcrumbFlag.btnReset = false;
        }
      }
    });
    this.showDrugPanel = !this.showDrugPanel;
    this.isEdit = true;
  }
  deleteDrugPanel(drugPanelMappingId: any) {
    this.masterService.deleteDrugPanel(drugPanelMappingId, this.userData.userId).subscribe(resp => {
      if (resp) {
        this.showTopCenter('success', 'Success Message', 'Deleted Successfully');
        this.getDrugPanelList();
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
            this.deleteDrugPanel(data);
          }
        }
      });
    }
  }
  private drugPanelTblAutoFilters(): void {
    this.panelNameFilteredOptions = this.panelNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.drugPanelList.map(x => x.panelName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.drugNameFilteredOptions = this.drugNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.drugPanelList.map(x => x.drugName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
  }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }
  // drug name filter by enter value using keyup
  drugKeyupFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        const drugObj = this.drugList.filter(e =>
          e.drugName.toLowerCase().indexOf(value.toLowerCase())
        );

        if (drugObj.length > 0) {
          this.drugKeyup = true;
        } else {
          this.drugKeyup = true;
        }
      } else {
        this.drugKeyup = false;
      }
    }
  }
  // load drug list to drug filter autocomplete
  drugItems(value: any) {
    if (!value) { this.assignDrogCopy(); }
    if (value) {
      this.drugLstFilter = Object.assign([], this.drugList).filter(
        item => ((item.drugName.toLowerCase().indexOf(value.toLowerCase()) > -1)));
    }
  }
  assignDrogCopy() {
    this.drugLstFilter = Object.assign([], this.drugList);
  }
  // return drug name by drugId
  displaydrugFn(id: any): string {
    if (!id) { return ''; }
    const drugName = this.drugList.filter(res => res.drugId === id);
    return drugName ? drugName[0].drugName : '';
  }
  // panel name filter by enter value using keyup
  panelKeyupFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        const paneltObj = this.panelList.filter(e =>
          e.subCompName.toLowerCase().indexOf(value.toLowerCase())
        );

        if (paneltObj.length > 0) {
          this.panelKeyup = true;
        } else {
          this.panelKeyup = true;
        }
      } else {
        this.panelKeyup = false;
      }
    }
  }
  // load panel list to panelfilter autocomplete
  panelItems(value: any) {
    if (!value) { this.assignPanelCopy(); }
    if (value) {
      this.panelLstFilter = Object.assign([], this.panelList).filter(
        item => ((item.subCompName.toLowerCase().indexOf(value.toLowerCase()) > -1)));
    }
  }
  assignPanelCopy() {
    this.panelLstFilter = Object.assign([], this.panelList);
  }
  // return panel name by panelId
  displaypanelFn(id: any): string {
    if (!id) { return ''; }
    const subCompName = this.panelList.filter(res => res.subCompId === id);
    return subCompName ? subCompName[0].subCompName : '';
  }
  // check given drug valid
  checkValidDrugValue() {
    if (!this.isEdit) {
      const value = this.drugPanelFormgroup.get('drugId')?.value;
      if (value === '' || value == null) {
      } else if (this.drugKeyup) {
        this.drugPanelFormgroup.controls.drugId.setErrors({ incorrect: true });
      } else {
        this.drugPanelFormgroup.controls.drugId.setErrors(null);
      }
    }
  }

  drugValid() {
    if (!this.isEdit) {
      const data: any = this.drugList.filter(e => e.drugName.toLowerCase().trim() ===
        (this.drugPanelFormgroup.get('drugId')?.value).toLowerCase().trim());
      if (data.length > 0) {
        this.drugPanelFormgroup.get('drugId')?.setValue(data[0].drugId);
        this.drugKeyup = false;
      }
      this.checkValidDrugValue();
    }
  }
  // check given panel valid
  checkValidPanelValue() {
    if (!this.isEdit) {
      const value = this.drugPanelFormgroup.get('subCompId')?.value;
      if (value === '' || value == null) {
      } else if (this.panelKeyup) {
        this.drugPanelFormgroup.controls.subCompId.setErrors({ incorrect: true });
      } else {
        this.drugPanelFormgroup.controls.subCompId.setErrors(null);
      }
    }
  }
  panelValid() {
    if (!this.isEdit) {
      const data: any = this.panelList.filter(e => e.subCompName.toLowerCase().trim() ===
        (this.drugPanelFormgroup.get('subCompId')?.value).toLowerCase().trim());
      if (data.length > 0) {
        this.drugPanelFormgroup.get('subCompId')?.setValue(data[0].subCompId);
        this.panelKeyup = false;
      }
      this.checkValidPanelValue();
    }
  }
  // panel available check for given drug
  panelAvailabilityCheck() {
    if (this.drugPanelFormgroup.get('drugId')?.value) {
      this.masterService.panelAvailCheck(this.drugPanelFormgroup.get('drugId')?.value).subscribe(resp => {
        if (resp) {
          this.showTopCenter('warn', 'Failure Message', 'Panel already assigned to this drug');
          this.drugPanelFormgroup.controls.drugId.setValue('');
        }
      });
    }
  }
  resetTable() {
    this.dt.reset();
    this.panelNameControl.reset();
    this.drugNameControl.reset();
    this.global.nativeElement.value = '';
    this.drugPanelTblAutoFilters();
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
    if (this.drugPanelList.length > 0) {
      this.itemperpage = this.drugPanelList.length;
    }
  }
}
