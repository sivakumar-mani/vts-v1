import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';

import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators, UntypedFormArray } from '@angular/forms';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { Title } from '@angular/platform-browser';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table'

@Component({
  standalone: false,
  selector: 'app-insufficiency-document',
  templateUrl: './insufficiency-document.component.html',
  styleUrls: ['./insufficiency-document.component.css']
})
export class InsufficiencyDocumentComponent implements OnInit {
  itemperpage: any;
  breadcrumbFlags = new BreadcrumbFlags();
  userData: any;
  routePath = 'Configure / Insufficiency Document';
  screenAuth: any = {};
  @ViewChild('dt') dt!: Table;
  @ViewChild('sub') sub!: Table;
  @ViewChild('global') global!: ElementRef;
  @ViewChild('deleteConfirmation') deleteConfirmation!: TemplateRef<any>;

  data: any;
  dialogRef: any;
  currentPage = 1;
  tempCurrentPage = 1;
  totalpages: number;
  totalpagesSub: number;
  currentPageSub = 1;
  tempCurrentPageSub = 1;
  showFlag = false;
  insufficiencyForm: UntypedFormGroup;
  isEdit: boolean;
  serviceList: any[] = [];
  componentControls!: AutoCompleteDropDown;
  insufficiencydocumentList: any[] = [];
  displayedColumns = [
    { field: 'componetName', header: 'Component Name' },
  ];
  descriptionColumns = [
    { field: 'description', header: 'Document Type Name' },
    { field: 'active', header: 'active' }
  ];
  frozenCols = [
    { field: 'action', header: 'Action' }
  ];

  // tslint:disable-next-line: max-line-length
  constructor(private masterService: MasterService, private master: MasterService, public common: CommonService, private auth: AuthService, private message: MessageService, private fb: UntypedFormBuilder, public dialog: MatDialog,
    private router: Router,) { }

  ngOnInit() {
    this.itemperpage = 10;
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.breadcrumbFlags = this.common.breadcrumbFlags(true);
    this.screenAuth = this.auth.getScreenAuth(this.router.url);
    this.getInsufficiencyList();
    this.getServiceType();
  }
  getInsufficiencyList() {
    this.masterService.getInsuffDocumentList().subscribe(res => {
      if (res != null) {
        this.insufficiencydocumentList = res;
        this.currentPage = 1;
        this.currentPageSub = 1;
        this.insufficiencydocumentList.forEach((element, ind) => {
          element.logginId = ind;
        });
      }
    });
  }
  getServiceType() {
    this.master.getScreeningQuesServiceType().subscribe(resp => {
      if (resp) {
        this.serviceList = resp;
      }
    });
    this.componentControls = new AutoCompleteDropDown('Component Type', 'compId', 'componentId', 'compName',
      this.serviceList, '', this.insufficiencyForm, false, false, true);
  }
  initFormGroup(flag: any) {
    this.insufficiencyForm = this.fb.group({
      compId: ['', [Validators.required]],
      logginId: [this.userData.userId],
      singleEditFlag: [],
      description: this.fb.array(flag === true ? [this.initQuesForm()] : [])
    });
    this.componentControls = new AutoCompleteDropDown('Component Type', 'compId', 'componentId', 'compName',
      this.serviceList, '', this.insufficiencyForm, false, false, true);
  }
  initQuesForm(): UntypedFormGroup {
    return this.fb.group({
      insuffDocId: new UntypedFormControl(0),
      description: new UntypedFormControl('', Validators.required),
      active: new UntypedFormControl(true),
    });
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
  getTotalPagesSub(totalRecords, rows) {
    this.totalpagesSub = Math.ceil((totalRecords) / rows);
    return Math.ceil((totalRecords) / rows);
  }
  navigateNxtPrevPageSub(pageNo, rows) {
    this.currentPageSub = pageNo / rows;
    this.tempCurrentPageSub = this.currentPageSub;
  }
  navigatePageSub(pageNo, rowscount) {
    if (+pageNo > this.totalpagesSub || +pageNo <= 0) {
      this.currentPageSub = this.tempCurrentPageSub;
    } else {
      this.sub.onPageChange({ first: ((pageNo - 1) * rowscount), rows: rowscount });
      this.tempCurrentPageSub = this.currentPageSub;
    }
  }
  addinsuffdoc() {
    this.initFormGroup(true);
    this.breadcrumbFlags.toolTip = 'Save';
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.showFlag = !this.showFlag;
  }
  closeForm() {
    this.breadcrumbFlags.btnSave = true;
    this.breadcrumbFlags.btnReset = true;
    this.insufficiencyForm.reset();
    this.showFlag = !this.showFlag;
    this.isEdit = false;
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.currentPage = 1;
  }
  resetForm() {
    const editinsuffDocId = this.insufficiencyForm.controls.insuffDocId.value;
    this.insufficiencyForm.controls.insuffDocId.setValue(0);
    this.insufficiencyForm.reset();
    this.insufficiencyForm.markAsPristine();
    this.initFormGroup(false);
    if (this.isEdit) {
      this.insufficiencyForm.controls.insuffDocId.setValue(editinsuffDocId);
    }
  }
  resetTable() {
    this.global.nativeElement.value = '';
    this.dt.reset();
  }
  editInsuffDocument(src, id, mode: any) {
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.breadcrumbFlags.toolTip = 'Update';
    this.initFormGroup(false);
    this.master.getInsuffDocumentById(src.compId, id).subscribe(res => {
      if (res) {
        this.common.tempResetData = res;
        this.common.tempResetData.description.forEach(ele => {
          const adddescription = this.insufficiencyForm.get('description') as UntypedFormArray;
          adddescription.push(this.initQuesForm());
        });
        setTimeout(() => {
          this.insufficiencyForm.patchValue({
            compId: this.common.tempResetData.compId,
            description: this.common.tempResetData.description,
          });
        }, 1);
        if (mode === 'view') {
          this.breadcrumbFlags.btnSave = false;
          this.breadcrumbFlags.btnReset = false;
          this.insufficiencyForm.disable();
        } else if (mode === 'editSingle') {
          this.isEdit = true;
          this.insufficiencyForm.get('singleEditFlag')?.setValue(true);
        }
        this.insufficiencyForm.get('compId')?.disable();
      }
    });
    this.showFlag = !this.showFlag;
  }
  saveInsuffDoc() {
    if (this.insufficiencyForm.valid) {
      this.masterService.saveInsuffDocument(this.insufficiencyForm.getRawValue()).subscribe(res => {
        if (res) {
          if (res.success === false) {
            this.showTopCenter('warn', 'Failure Message', res.message);
          } else {
            this.showTopCenter('success', 'Success Message', this.breadcrumbFlags.toolTip + 'd Successfully');
          }
          this.getInsufficiencyList();
          this.closeForm();
        }
        if (!res) {
          this.showTopCenter('warn', 'Failure Message', 'Failed to save');
        }
      });
    } else {
      this.insufficiencyForm.markAllAsTouched();
    }
  }

  public openDialog(data, id, mode) {
    const deleteVm = new InsuffDocVm();
    deleteVm.logginId = this.userData.userId;
    if (mode === 'deleteMultiple') {
      deleteVm.insuffDocId = data.description.map(x => x.insuffDocId);
    } else {
      deleteVm.insuffDocId.push(id);
    }
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
            this.deleteInsuffDoc(deleteVm);
          }
        }
      });
    }
  }
  deleteInsuffDoc(src: any) {
    this.master.deleteInsuffDoc(src).subscribe(resp => {
      if (resp) {
        this.showTopCenter('success', 'Success Message', 'Deleted Successfully');
        this.getInsufficiencyList();
      }
    });
  }
  getformgroup() {
    return (this.insufficiencyForm.get('description') as UntypedFormArray).controls;
  }
  addControl(i: any) {
    if (this.insufficiencyForm.get('description')?.valid) {
      const adddescription = this.insufficiencyForm.get('description') as UntypedFormArray;
      adddescription.push(this.initQuesForm());
    } else {
      this.insufficiencyForm.get('description')?.markAllAsTouched();
    }
  }
  removeControl(i: any) {
    const removedescription = this.insufficiencyForm.get('description') as UntypedFormArray;
    removedescription.removeAt(i);
  }

  checkValidDocumentType() {
    // const documentType = this.insufficiencyForm.controls.description.value.replace(/^\s+|\s+$/g,'');
    // if (documentType === '' || documentType === null || documentType === undefined) {
    //   return;
    // }
    // const x = this.insufficiencydocumentList.filter(e => e.description.replace(/^\s+|\s+$/g,'') === documentType);
    // if (x.length !== 0) {
    //   this.insufficiencyForm.controls.description.setErrors({ incorrect: true });
    // }
  }


  showall() {
    if (this.insufficiencydocumentList.length > 0) {
      this.itemperpage = this.insufficiencydocumentList.length;
    }
  }
}

class InsuffDocVm {
  insuffDocId: any[] = [];
  logginId: number;
}

