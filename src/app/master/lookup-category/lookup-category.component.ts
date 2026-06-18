import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { MasterService } from 'src/app/common-methods/services/master.service';

import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table'

@Component({
  standalone: false,
  selector: 'app-lookup-category',
  templateUrl: './lookup-category.component.html',
  styleUrls: ['./lookup-category.component.css']
})
export class LookupCategoryComponent implements OnInit {
  itemperpage;
  showFlag = false;
  LookUpCategoryForm: UntypedFormGroup;
  breadcrumbFlags = new BreadcrumbFlags();
  userData: any;
  screenAuth: any = {};
  lookUpCategoryList: any;
  displayedColumns = [
    { field: 'lookupCatName', header: 'Category Name' },
    { field: 'lookupCatDesc', header: 'Category Description' },
    { field: 'active', header: 'Active' },
  ];
  totalpages: number;
  currentPage = 1;
  tempCurrentPage = 1;
   @ViewChild('dt', { static: false }) dt!: Table;
  @ViewChild('global', { static: true }) global!: ElementRef;

  constructor(private authservice: AuthService, public common: CommonService, private fb: UntypedFormBuilder,
    private master: MasterService, private message: MessageService, public dialog: MatDialog, private router: Router, ) { }

  ngOnInit() {
    this.screenAuth = this.authservice.getScreenAuth(this.router.url);
    this.breadcrumbFlags = this.common.breadcrumbFlags(true);
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.GetAllLookupCategory();
    this.itemperpage = 10;
  }
  addForm() {
    this.initFormGroup();
    this.breadcrumbFlags.toolTip = 'Save';
    this.backForm();
  }
  initFormGroup() {
    this.LookUpCategoryForm = this.fb.group({
      lookupCatName: ['', Validators.required],
      active: [true],
      loggedIn: [this.userData.userId],
      lookupCatDesc: ['', Validators.required],
      lookUpCatId: [0]
    });
  }
  GetAllLookupCategory() {
    this.master.GetAllLookupCategory().subscribe(resp => {
      if (resp) {
        this.lookUpCategoryList = resp;
        this.currentPage = 1;
      }
    });
  }
  saveForm() {
    if (this.LookUpCategoryForm.valid) {
      this.master.AddUpdateLookupCategory(this.LookUpCategoryForm.getRawValue()).subscribe(resp => {
        if (resp) {
          this.showTopCenter('success', 'Success Message', this.LookUpCategoryForm.value.lookUpCatId > 0
            ? 'Updated Successfully' : 'Saved Successfully');
          this.backForm();
          this.GetAllLookupCategory();
        }
      });
    } else {
      this.LookUpCategoryForm.markAllAsTouched();
    }
  }
  resetForm() {
    if (this.breadcrumbFlags.toolTip === 'Update') {
      this.LookUpCategoryForm.patchValue({
        lookupCatName: this.common.tempResetData.lookupCatName,
        active: this.common.tempResetData.active,
        lookupCatDesc: this.common.tempResetData.lookupCatDesc,
        lookUpCatId: this.common.tempResetData.lookUpCatId
      });
    } else {
      this.initFormGroup();
      this.LookUpCategoryForm.markAsPristine();
    }
  }
  backForm() {
    this.showFlag = !this.showFlag;
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.currentPage = 1;
  }
  resetTable() {
    this.global.nativeElement.value = '';
    this.dt.reset();
  }
  editForm(data: any) {
    this.initFormGroup();
    this.breadcrumbFlags.toolTip = 'Update';
    this.backForm();
    this.master.GetLookupCategoryById(data.lookUpCatId).subscribe(resp => {
      if (resp) {
        this.common.tempResetData = resp;
        this.LookUpCategoryForm.patchValue({
          lookupCatName: resp.lookupCatName,
          active: resp.active,
          lookupCatDesc: resp.lookupCatDesc,
          lookUpCatId: resp.lookUpCatId
        });
      }
    });
  }
  deleteForm(data: any) {
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
            this.DeleteLookupCategoryById(data);
          }
        }
      });
    }
  }
  DeleteLookupCategoryById(data: any) {
    this.master.DeleteLookupCategoryById(data.lookUpCatId, this.userData.userId).subscribe(resp => {
      if (resp) {
        this.showTopCenter('warn', 'Success Message', 'Deleted Successfully');
        this.GetAllLookupCategory();
      }
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
  showall() {
    if (this.lookUpCategoryList.length > 0) {
      this.itemperpage = this.lookUpCategoryList.length;
    }
  }
}
