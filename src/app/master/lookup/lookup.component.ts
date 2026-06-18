import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl, UntypedFormArray } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { Table, TableModule } from 'primeng/table';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',
  styleUrls: ['./lookup.component.css']
})
export class LookupComponent implements OnInit {
  itemperpage;
  showFlag = false;
  LookUpForm: UntypedFormGroup;
  breadcrumbFlags = new BreadcrumbFlags();
  userData: any;
  screenAuth: any = {};
  lookUpList: any;
  displayedColumns = [
    { field: 'lookupCatName', header: 'Category Name' },
    { field: 'lookupCatDesc', header: 'Category Description' },
    { field: 'active', header: 'Active' },
  ];
  subColumns = [
    { field: 'lookUpName', header: 'LookUp Name' },
    { field: 'lookUpDesc', header: 'LookUp Description' },
    { field: 'active', header: 'Active' },
  ];
  totalpages: number;
  currentPage = 1;
  tempCurrentPage = 1;
  totalpagesSub: number;
  currentPageSub = 1;
  tempCurrentPageSub = 1;
  @ViewChild('sub') sub!: Table;
  @ViewChild('dt') dt!: Table;
  @ViewChild('global') global!: ElementRef;
  categoryList: any;
  categoryControls!: AutoCompleteDropDown;
  isSingleEdit = false;

  constructor(private authservice: AuthService, public common: CommonService, private fb: UntypedFormBuilder,
    private master: MasterService, private message: MessageService, public dialog: MatDialog,
    private router: Router,) { }

  ngOnInit() {
    this.screenAuth = this.authservice.getScreenAuth(this.router.url);
    this.breadcrumbFlags = this.common.breadcrumbFlags(true);
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.GetAllLookupValue(0);
    this.itemperpage = 10;
  }
  addForm() {
    this.GetLookUp();
    this.initFormGroup(true, true);
    this.breadcrumbFlags.toolTip = 'Save';
    this.backForm();
  }
  initFormGroup(flag, singleEditFlag) {
    this.LookUpForm = this.fb.group({
      loggedIn: [this.userData.userId],
      lookupValue: this.fb.array(flag === true ? [this.initForm()] : []),
      lookUpCatId: [],
      singleEditFlag: [singleEditFlag]
    });
    this.categoryControls = new AutoCompleteDropDown('Category Name', 'lookUpCatId', 'lookUpCatId', 'lookupCatName',
      this.categoryList, '', this.LookUpForm, false, false, true);
  }
  initForm(): UntypedFormGroup {
    return this.fb.group({
      lookUpName: new UntypedFormControl(''),
      lookUpId: new UntypedFormControl(0),
      lookUpDesc: new UntypedFormControl('', Validators.required),
      active: new UntypedFormControl(true),
    });
  }
  getformgroup() {
    return (this.LookUpForm.get('lookupValue') as UntypedFormArray).controls;
  }
  GetLookUp() {
    this.master.GetAllLookupCategory().subscribe(resp => {
      if (resp) {
        this.categoryList = resp;
        this.categoryControls = new AutoCompleteDropDown('Category Name', 'lookUpCatId', 'lookUpCatId', 'lookupCatName',
          this.categoryList, '', this.LookUpForm, false, false, true);
      }
    });
  }
  addControl(i: any) {
    if (this.LookUpForm.get('lookupValue')?.valid) {
      const addQuestion = this.LookUpForm.get('lookupValue') as UntypedFormArray;
      addQuestion.push(this.initForm());
    } else {
      this.LookUpForm.get('lookupValue')?.markAllAsTouched();
    }
  }
  removeControl(i: any) {
    const removeQuetion = this.LookUpForm.get('lookupValue') as UntypedFormArray;
    removeQuetion.removeAt(i);
  }
  GetAllLookupValue(catId: any) {
    this.master.GetAllLookupValue(catId).subscribe(resp => {
      if (resp) {
        this.lookUpList = resp;
        this.currentPage = 1;
      }
    });
  }
  saveForm() {
    if (this.LookUpForm.valid) {
      this.master.AddUpdateLookupValue(this.LookUpForm.getRawValue()).subscribe(resp => {
        if (resp) {
          this.showTopCenter('success', 'Success Message', this.LookUpForm.value.lookupValue[0].lookUpId > 0
            ? 'Updated Successfully' : 'Saved Successfully');
          this.backForm();
          this.GetAllLookupValue(0);
        }
      });
    } else {
      this.LookUpForm.markAllAsTouched();
    }
  }
  resetForm() {
    if (this.breadcrumbFlags.toolTip === 'Update') {
      this.initFormGroup(false, true);
      this.getPatchValue(this.common.tempResetData);
    } else {
      this.initFormGroup(true, true);
      this.LookUpForm.markAsPristine();
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
  // getPatchValue(resp: any) {
  //   this.common.tempResetData = resp;
  //   this.common.tempResetData.lookupValue.forEach(ele => {
  //     const addQuestion = this.LookUpForm.get('lookupValue') as UntypedFormArray;
  //     addQuestion.push(this.initForm());
  //   });
  //   this.LookUpForm.patchValue({
  //     lookUpCatId: resp.lookUpCatId,
  //     lookupValue: resp.lookupValue
  //   });
  // }
  getPatchValue(resp: any) {
    this.common.tempResetData = resp;

    const lookupValues = resp?.lookupValue ?? [];  // ← safe fallback

    const addQuestion = this.LookUpForm.get('lookupValue') as UntypedFormArray;

    lookupValues.forEach(ele => {
      addQuestion.push(this.initForm());
    });

    this.LookUpForm.patchValue({
      lookUpCatId: resp.lookUpCatId,
      lookupValue: lookupValues
    });
  }

  editForm(data, mode) {
    this.GetLookUp();
    mode === true ? this.isSingleEdit = true : this.isSingleEdit = false;
    this.initFormGroup(false, this.isSingleEdit);
    this.breadcrumbFlags.toolTip = 'Update';
    this.backForm();
    if (mode === true) {
      this.master.GetLookupById(data.lookUpId).subscribe(resp => {
        if (resp) {
          this.getPatchValue(resp);
        }
      });
    } else {
      this.master.GetAllLookupValue(data.lookUpCatId).subscribe(resp => {
        if (resp) {
          this.getPatchValue(resp[0]);
        }
      });
    }
  }
  openDialog(data, mode) {
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
            if (mode === true) {
              this.deleteForm(data.lookUpId, 0);
            } else {
              this.deleteForm(0, data.lookupCatId);
            }
          }
        }
      });
    }
  }
  deleteForm(lookupId, lookupCatId) {
    this.master.DeleteLookupById(lookupId, lookupCatId, this.userData.userId).subscribe(resp => {
      if (resp) {
        this.showTopCenter('warn', 'Success Message', 'Deleted Successfully');
        this.GetAllLookupValue(0);
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
  showall() {
    if (this.lookUpList.length > 0) {
      this.itemperpage = this.lookUpList.length;
    }
  }
}
