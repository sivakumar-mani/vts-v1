import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';

import {  MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { Observable } from 'rxjs';
import { UntypedFormControl, UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { map, startWith } from 'rxjs/operators';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table'


@Component({
  standalone: false,
  selector: 'app-record-check-category-mapping',
  templateUrl: './record-check-category-mapping.component.html',
  styleUrls: ['./record-check-category-mapping.component.css']
})
export class RecordCheckCategoryMappingComponent implements OnInit {
  itemperpage;
  breadcrumbFlags = new BreadcrumbFlags();
  userData: any;
  routePath = 'Configure / Record Check Mapping';
  screenAuth: any = {};
   @ViewChild('dt', { static: false }) dt!: Table;
  @ViewChild('global', { static: true }) global!: ElementRef;
  data: any;
  dialogRef: any;
  @ViewChild('deleteConfirmation', { static: true }) deleteConfirmation!: TemplateRef<any>;;

  @ViewChild('recordCheckNameTrigger', { static: true }) recordCheckNameTrigger!: MatMenuTrigger;
  recordCheckNameShortFilteredOptions: Observable<string[]>;
  recordCheckNameControl = new UntypedFormControl();

  @ViewChild('recordCheckCategoryNameTrigger', { static: true }) 
recordCheckCategoryNameTrigger!: MatMenuTrigger;
  recordCheckCategoryNameFilteredOptions: Observable<string[]>;
  recordCheckCategoryNameControl = new UntypedFormControl();

 @ViewChild('clientNameTrigger', { static: true }) 
clientNameTrigger!: MatMenuTrigger;
  clientNameTriggerFilteredOptions: Observable<string[]>;
  clientNameTriggerControl = new UntypedFormControl();

  currentPage = 1;
  tempCurrentPage = 1;
  totalpages: number;
  showFlag = false;
  recordCheckCategoryForm: UntypedFormGroup;

  isEdit: boolean;
  recordCheckMappingList: any[] = [];
  displayColumns = [
    { field: 'recordCheckName', header: 'Record Check Name' },
    { field: 'recordCheckCategoryName', header: 'Record Check Category' },
    { field: 'clientName', header: 'Client Name' },
    { field: 'active', header: 'Active' },
  ];
  frozenCols = [
    { field: 'action', header: 'Action' }
  ];
  recordCheckDrpDwn: any[] = [];
  recordCheckCategoryDrpDwn: any[] = [];
  clientNameDrpDwn: any[] = [];
  clientflterlist: any[] = [];
  rCheckflterlist: any[] = [];
  rCheckCatgryflterlist: any[] = [];

  clientKeyUp = false;
  rChkKeyUp = false;
  rChkCgryKeyUp = false;


  // tslint:disable-next-line: max-line-length
  constructor(public common: CommonService, private masterService: MasterService, private auth: AuthService,
    private message: MessageService, private fb: UntypedFormBuilder, public dialog: MatDialog,
    private cd: ChangeDetectorRef, private router: Router, ) { }

  ngOnInit() {
    this.breadcrumbFlags = this.common.breadcrumbFlags(true);
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.screenAuth = this.auth.getScreenAuth(this.router.url);
    this.getDrpDwnDatas();
    this.initFormGroup();
    this.getRecordCheckMapList();
    this.itemperpage = 10;
  }

  getRecordCheckMapList() {
    this.masterService.getAllRecordCheckMapping().subscribe(res => {
      if (res != null) {
        this.recordCheckMappingList = res;
        this.drugTblAutoFilters();
      }
    });
  }

  getDrpDwnDatas() {
    this.masterService.getAllLookUpRecordCheckMapping().subscribe(res => {
      if (res != null) {
        this.recordCheckDrpDwn = res.recordCheckList;
        this.recordCheckCategoryDrpDwn = res.recordCheckCategoryList;
        this.clientNameDrpDwn = res.clientList;
        // this.clientControls =
        // new AutoCompleteDropDown('Client Name', 'clientId', 'clientId', 'clientName', this.clientNameDrpDwn,
        //   '', this.recordCheckCategoryForm, false, false, true);
      }
    });
  }

  initFormGroup() {
    this.recordCheckCategoryForm = this.fb.group({
      recordCheckCatMapid: new UntypedFormControl(0),
      recordCheckId: new UntypedFormControl('', Validators.required),
      recordCheckCategoryId: new UntypedFormControl('', Validators.required),
      clientId: new UntypedFormControl('', Validators.required),
      active: new UntypedFormControl(false),
      createdUserId: new UntypedFormControl(this.userData.userId)
    });
    // this.clientControls =
    // new AutoCompleteDropDown('Client Name', 'clientId', 'clientId', 'clientName', this.clientNameDrpDwn,
    //   '', this.recordCheckCategoryForm, false, false, true);
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

  addRecordCheckMapping() {
    this.initFormGroup();
    this.breadcrumbFlags.toolTip = 'Save';
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.showFlag = !this.showFlag;
  }
  closeForm() {
    this.breadcrumbFlags.btnSave = true;
    this.breadcrumbFlags.btnReset = true;
    this.recordCheckCategoryForm.reset();
    this.showFlag = !this.showFlag;
    this.isEdit = false;
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.currentPage = 1;
  }
  resetForm() {
    const editrecordCheckCatMapid = this.recordCheckCategoryForm.controls.recordCheckCatMapid.value;
    this.recordCheckCategoryForm.controls.recordCheckCatMapid.setValue(0);
    this.recordCheckCategoryForm.controls.clientId.setValue('');
    this.clientItems('');
    this.recordCheckItems('');
    this.recordCheckCatGryItems('');
    this.recordCheckCategoryForm.reset();
    this.recordCheckCategoryForm.markAsPristine();
    this.initFormGroup();
    if (this.isEdit) {
      this.recordCheckCategoryForm.controls.recordCheckCatMapid.setValue(editrecordCheckCatMapid);
    }
  }
  resetTable() {
    this.dt.reset();
    this.global.nativeElement.value = '';
    this.drugTblAutoFilters();
  }



  clientItems(value: any) {
    const clientIds: any[] = [];
    if (!value) { this.assignclientCopy(clientIds); }
    if (value) {
      this.clientflterlist = Object.assign([], this.clientNameDrpDwn.filter(f =>
        clientIds.indexOf(Number(f.clientId)) === -1)).filter(
          item => ((item.clientName.toLowerCase().indexOf(value.toLowerCase()) > -1)));
    }
  }
  assignclientCopy(clientIds: any) {
    this.clientflterlist = Object.assign([], this.clientNameDrpDwn.filter(f =>
      clientIds.indexOf(Number(f.clientId)) === -1));
  }
  displayClientFn(id: any): string {
    if (!id) { return ''; }
    const clientName = this.clientNameDrpDwn.filter(res => Number(res.clientId) === id);
    return clientName ? clientName[0].clientName : '';
  }

  clientKeyupFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        const client = this.clientflterlist.filter(e =>
          e.clientName.toLowerCase() === value.toLowerCase());
        if (client.length > 0) {
          this.clientKeyUp = true;
        } else {
          this.clientKeyUp = true;
        }
      } else {
        this.clientKeyUp = false;
      }
    }
  }
  get displayclientFn() {
    const clientNew = (client) => {
      if (client == null || client === undefined) {
        return null;
      }
      if (client && this.clientflterlist && this.clientflterlist.length > 0) {
        client = this.clientflterlist.find(x => Number(x.clientId) === Number(client));
        return client.clientName;
      } else {
        if (client === 0 && this.clientflterlist && this.clientflterlist.length > 0) {
          client = this.clientflterlist.find(x => Number(x.clientId) === Number(client));
          return client.clientName;
        } else { return null; }

      }

    };
    return clientNew;
  }

  recordCheckItems(value: any) {
    const rCheckIds: any[] = [];
    if (!value) { this.assignRecordCheckCopy(rCheckIds); }
    if (value) {
      this.rCheckflterlist = Object.assign([], this.recordCheckDrpDwn.filter(f =>
        rCheckIds.indexOf(f.recordCheckId) === -1)).filter(
          item => ((item.recordCheckName.toLowerCase().indexOf(value.toLowerCase()) > -1)));
    }
  }
  assignRecordCheckCopy(rCheckIds: any) {
    this.rCheckflterlist = Object.assign([], this.recordCheckDrpDwn.filter(f =>
      rCheckIds.indexOf(f.recordCheckId) === -1));
  }

  displayRcheckFn(id: any): string {
    if (!id) { return ''; }
    const rChkName = this.recordCheckDrpDwn.filter(res => res.recordCheckId === id);
    return rChkName ? rChkName[0].recordCheckName : '';
  }


  getComponetDetailsByClient(cntrl: any) {
    if (cntrl === 'clientName') { this.clientKeyUp = false; }
    if (cntrl === 'rCheckName') { this.rChkKeyUp = false; }
    if (cntrl === 'rCheckCtgryName') { this.rChkCgryKeyUp = false; }
  }

  rCheckKeyupFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        const rCheck = this.rCheckflterlist.filter(e =>
          e.recordCheckName.toLowerCase() === value.toLowerCase());
        if (rCheck.length > 0) {
          this.rChkKeyUp = true;
        } else {
          this.rChkKeyUp = true;
        }
      } else {
        this.rChkKeyUp = false;
      }
    }
  }

  get displayrcheckFn() {
    const rChkNewret = (recCheck) => {
      if (recCheck == null || recCheck === undefined) {
        return null;
      } else {
        if (recCheck && this.rCheckflterlist && this.rCheckflterlist.length > 0) {
          recCheck = this.rCheckflterlist.find(x => x.recordCheckId === recCheck);
          return recCheck.recordCheckName;
        } else {
          return null;
        }
      }
    };
    return rChkNewret;
  }



  recordCheckCatGryItems(value: any) {
    const rCheckCatGryIds: any[] = [];
    if (!value) { this.assignRecordCheckCatGryCopy(rCheckCatGryIds); }
    if (value) {
      this.rCheckCatgryflterlist = Object.assign([], this.recordCheckCategoryDrpDwn.filter(f =>
        rCheckCatGryIds.indexOf(f.recordCheckCategoryId) === -1)).filter(
          item => ((item.recordCheckCategoryName.toLowerCase().indexOf(value.toLowerCase()) > -1)));
    }
  }
  assignRecordCheckCatGryCopy(rCheckCatGryIds: any) {
    this.rCheckCatgryflterlist = Object.assign([], this.recordCheckCategoryDrpDwn.filter(f =>
      rCheckCatGryIds.indexOf(f.recordCheckCategoryId) === -1));
  }




  displayRcheckCatGryFn(id: any): string {
    if (!id) { return ''; }
    const rChkNameCatGry = this.recordCheckCategoryDrpDwn.filter(res => res.recordCheckCategoryId === id);
    return rChkNameCatGry ? rChkNameCatGry[0].recordCheckCategoryName : '';
  }







  rCheckCatGryKeyupFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        const rCheckCgry = this.rCheckCatgryflterlist.filter(e =>
          e.recordCheckCategoryName.toLowerCase() === value.toLowerCase());
        if (rCheckCgry.length > 0) {
          this.rChkCgryKeyUp = true;
        } else {
          this.rChkCgryKeyUp = true;
        }
      } else {
        this.rChkCgryKeyUp = false;
      }
    }
  }




  get displayrcheckCatGryFn() {
    const rChkCatGryNewret = (recCheckCatGry) => {
      if (recCheckCatGry == null || recCheckCatGry === undefined) {
        return null;
      } else {
        if (recCheckCatGry && this.rCheckCatgryflterlist && this.rCheckCatgryflterlist.length > 0) {
          recCheckCatGry = this.rCheckCatgryflterlist.find(x => x.recordCheckCategoryId === recCheckCatGry);
          return recCheckCatGry.recordCheckCategoryName;
        } else {
          return null;
        }
      }
    };
    return rChkCatGryNewret;
  }

  checkValidValue(cntrl): void {
    if (cntrl === 'clientName') {
      const value = this.recordCheckCategoryForm.controls.clientId.value;
      if (value === '' || value == null) {
        this.recordCheckCategoryForm.get('clientId')?.setValidators(Validators.required);
      } else if (this.clientKeyUp) {
        this.recordCheckCategoryForm.get('clientId')?.setErrors({ incorrect: true });
      } else {
        this.recordCheckCategoryForm.get('clientId')?.setErrors(null);
      }
    }

    if (cntrl === 'rCheckName') {
      const value = this.recordCheckCategoryForm.controls.recordCheckId.value;
      if (value === '' || value == null) {
        this.recordCheckCategoryForm.get('recordCheckId')?.setValidators(Validators.required);
      } else if (this.rChkKeyUp) {
        this.recordCheckCategoryForm.get('recordCheckId')?.setErrors({ incorrect: true });
      } else {
        this.recordCheckCategoryForm.get('recordCheckId')?.setErrors(null);
      }
    }

    if (cntrl === 'rCheckCtgryName') {
      const value = this.recordCheckCategoryForm.controls.recordCheckCategoryId.value;
      if (value === '' || value == null) {
        this.recordCheckCategoryForm.get('recordCheckCategoryId')?.setValidators(Validators.required);
      } else if (this.rChkCgryKeyUp) {
        this.recordCheckCategoryForm.get('recordCheckCategoryId')?.setErrors({ incorrect: true });
      } else {
        this.recordCheckCategoryForm.get('recordCheckCategoryId')?.setErrors(null);
      }
    }
  }
  private drugTblAutoFilters(): void {
    this.recordCheckNameControl = new UntypedFormControl();
    this.recordCheckCategoryNameControl = new UntypedFormControl();
    this.clientNameTriggerControl = new UntypedFormControl();

    this.recordCheckNameShortFilteredOptions = this.recordCheckNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.recordCheckMappingList.map(x => x.recordCheckName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.recordCheckCategoryNameFilteredOptions = this.recordCheckCategoryNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.recordCheckMappingList.map(x => x.recordCheckCategoryName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.clientNameTriggerFilteredOptions = this.clientNameTriggerControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.recordCheckMappingList.map(x => x.clientName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
  }

  openConfirmDialog(data): void {
    this.data = data;
    this.dialogRef = this.dialog.open(this.deleteConfirmation, {
      width: '320px',
      disableClose: true
    });
  }

  editRecordChkMap(data: any, mode: any) {
    this.initFormGroup();
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.breadcrumbFlags.toolTip = 'Update';
    this.recordCheckCategoryForm.patchValue(data);
    this.recordCheckCategoryForm.controls.createdUserId.setValue(this.userData.userId);
    this.clientItems('');
    this.recordCheckItems('');
    this.recordCheckCatGryItems('');
    this.showFlag = !this.showFlag;
    this.isEdit = true;
    if (mode === 'view') {
      this.breadcrumbFlags.btnSave = false;
      this.breadcrumbFlags.btnReset = false;
      this.recordCheckCategoryForm.disable();
    }
  }
  saveRecordCheckMapping() {
    if (!this.recordCheckCategoryForm.valid) {
      return;
    }
    this.masterService.saveRecordCheckMappingDetails(this.recordCheckCategoryForm.getRawValue()).subscribe(res => {
      if (res.success) {
        if (res.message !== 'Sucess') {
          this.showTopCenter('info', 'Failure Message', res.message);
          if (this.isEdit) {
            this.getRecordCheckMapList();
            this.closeForm();
          }
          return;
        }
        if (this.isEdit) {
          this.showTopCenter('success', 'Success Message', 'Updated Successfully');
          this.isEdit = false;
        } else {
          this.showTopCenter('success', 'Success Message', 'Saved Successfully');
        }
        this.getRecordCheckMapList();
        this.closeForm();
      }
      if (!res.success) {
        this.showTopCenter('warn', 'Failure Message', 'Failed to save');
      }
    });
  }

  deleteRecordCheckMap() {
    this.masterService.deleteRecordCheckMapping(this.data.recordCheckCatMapid, this.userData.userId).subscribe(resp => {
      if (resp) {
        this.showTopCenter('warn', 'Success Message', 'Deleted Successfully');
        this.dialogRef.close();
        this.getRecordCheckMapList();
      }
    });
  } showall() {
    if (this.recordCheckMappingList.length > 0) {
      this.itemperpage = this.recordCheckMappingList.length;
    }
  }

}
