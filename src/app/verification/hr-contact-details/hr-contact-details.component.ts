import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';

@Component({
  standalone: false,
  selector: 'app-hr-contact-details',
  templateUrl: './hr-contact-details.component.html',
  styleUrls: ['./hr-contact-details.component.css']
})
export class HRContactDetailsComponent implements OnInit {

  userData: any;
  routePath = 'Verification/HR Contact Details';
  btnExcelExport = true;
  btnUpload = true;
  btnBack = true;
  showBulkUpload = false;
  isEditMode = false;
  showEmpHrHistoryView = false;
  currentEditData: any;
  breadcrumbFlag = new BreadcrumbFlags();
  employerHrContactDetail = new employerHrContact();
   @ViewChild('dt', { static: false }) dt!: Table;
  @ViewChild('history', { static: true }) history!: TemplateRef<any>;
  HrContactDetailsFormGroup: UntypedFormGroup;
  displayedImportCol = [
    { field: 'action', header: 'Action' },
    { field: 'empName', header: 'Employer Name' },
    { field: 'name', header: 'HR Name' },
    { field: 'contactNumber', header: 'HR Contact Number' },
    { field: 'emailId', header: 'Email ID' },
    { field: 'updated', header: 'Last Updated Date' },
    { field: 'comments', header: 'Comments' }
  ];
  historyCol = [
    { field: 'empName', header: 'Employer Name' },
    { field: 'name', header: 'HR Name' },
    { field: 'contactNumber', header: 'HR Contact Number' },
    { field: 'emailId', header: 'Email ID' },
    { field: 'comments', header: 'Comments' },
    { field: 'isImport', header: 'Modified' },
    { field: 'updated', header: 'Modified Date and Time' },
    { field: 'userName', header: 'Modified BY' },
  ];
  frozenCols = [
    { field: 'action', header: 'Action' },
  ];
  docErrorList: any[] = [];
  hrContactHistoryList: any[] = [];
  totalpages: number;
  currentPage = 1;
  tempCurrentPage = 1;
  viewError: any;
  screenAuth:any;
  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  EXCEL_EXTENSION = '.xlsx';
  constructor(public screening: ScreeningService, private message: MessageService, public commonService: CommonService,
    public dialog: MatDialog, private router: Router ,private authService:AuthService, private fb: UntypedFormBuilder,private master: MasterService, ) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.screenAuth = this.authService.getScreenAuth(this.router.url);
    this.initFormGroup();
    this.getAllEmployerHrContacts();
    if(this.screenAuth.editFlag == false)
    {
      this.btnExcelExport = false;
      this.btnUpload = false;
    }
  }

  initFormGroup() {
    this.HrContactDetailsFormGroup = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      contactNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/), Validators.min(1000000000), Validators.max(9999999999)]],
      emailId: ['', [Validators.required, Validators.pattern(this.commonService.EmailRegX), Validators.maxLength(100)]],
      comments: ['', Validators.maxLength(1000)],
    });
}

allowOnlyNumbers(event: KeyboardEvent) {
  const charCode = event.which ? event.which : event.keyCode;
  
  if (charCode < 48 || charCode > 57) { 
    event.preventDefault(); // Block non-numeric characters
  }
} 
  showBulk() {
    this.showBulkUpload = true;
    this.showEmpHrHistoryView = false;
  }
  navigateURL() {
    this.showBulkUpload = !this.showBulkUpload;
    this.showEmpHrHistoryView = false;
    this.getAllEmployerHrContacts();
  }

  exportAsExcelFile() {
    const filteredColumns = this.displayedImportCol.filter(col =>
      col.field !== 'action' && col.field !== 'updated');
    const pinCodeCol = { field: 'postalCode', header: 'Pin Code' };
    const insertIndex = filteredColumns.findIndex(col => col.field === 'empName') + 1;
    filteredColumns.splice(insertIndex, 0, pinCodeCol);
    this.commonService.exportToExcel(filteredColumns, this.docErrorList, 'EmployerHrContact');
  }

  getAllEmployerHrContacts(): void {
    this.master.getAllEmployerHrContacts().subscribe(data => {
      this.docErrorList = data;
    }, error => {
      console.error('Error fetching HR contact details:', error);
    });
  }
  getEmployerHrContactHistory(hrContactId: any) {
    if(hrContactId)
    {
      this.showEmpHrHistoryView = true;
      this.btnExcelExport = false;
      this.btnUpload = false;
      this.master.getEmployerHrContactHistory(hrContactId).subscribe(data => {
        this.hrContactHistoryList = data;
      }, error => {
        console.error('Error fetching :', error);
      });
  }
  }
  
    closeSearch() {
    if(this.isEditMode)
    {
      this.isEditMode = false;
      this.HrContactDetailsFormGroup.reset();
      this.breadcrumbFlag.btnSave = false;
      this.breadcrumbFlag.btnReset = false;
      this.btnExcelExport = true;
      this.btnUpload = true;
    }
    else if(this.showEmpHrHistoryView)
    {
      this.showEmpHrHistoryView = !this.showEmpHrHistoryView;
      if(this.screenAuth.editFlag == true)
      {
        this.btnExcelExport = true;
        this.btnUpload = true;
      }
    }
    else{
      this.router.navigate(['dashboard/home']);
    }
  }

  editEmployerHrContactDetail(data: any) {
    this.initFormGroup();
    this.isEditMode = true;
    this.breadcrumbFlag.toolTip = 'Update';
    this.breadcrumbFlag.btnSave = true;
    this.breadcrumbFlag.btnReset = true;
    this.btnExcelExport = false;
    this.btnUpload = false;
    //this.btnValidate = false;
    this.currentEditData = data;
    this.HrContactDetailsFormGroup.patchValue(data);
  }

  saveHrContactDetails() {
    if (this.HrContactDetailsFormGroup.valid) {
      this.employerHrContactDetail.empAddressId = this.currentEditData.empAddressId;
      this.employerHrContactDetail.name = this.HrContactDetailsFormGroup.controls.name.value;
      this.employerHrContactDetail.contactNumber = this.HrContactDetailsFormGroup.controls.contactNumber.value;
      this.employerHrContactDetail.emailId = this.HrContactDetailsFormGroup.controls.emailId.value;
      this.employerHrContactDetail.comments = this.HrContactDetailsFormGroup.controls.comments.value;
      this.employerHrContactDetail.updatedUserId = this.userData.userId;
      this.master.addEmployerHrContacts(this.employerHrContactDetail).subscribe(resp => {
        if (resp.success === true) {
          this.showTopCenter('success', 'success Message', 'Updated Successfully');
        Object.assign(this.currentEditData, this.employerHrContactDetail);
        this.isEditMode = false;
        this.breadcrumbFlag.btnSave = false;
        
        this.breadcrumbFlag.btnReset = false;
        this.btnExcelExport = true;
        this.btnUpload = true;
        //this.btnValidate = true;
        this.currentEditData.lastUpdatedDate = new Date().toISOString().split('T')[0];
        }
        else if (resp.success === false) {
          this.showTopCenter('error', 'Failed', 'Failed to Add');
        }
      }, error => {
        console.error('Error updating HR contact details:', error);
      });
    }
  }

  cancelEdit() {
    this.isEditMode = false;
    this.HrContactDetailsFormGroup.reset();
  }

  openEdetails(error: any) {
    this.viewError = error
    this.dialog.open(this.history, {
      width: '800px',
      disableClose: true
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
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }
}
export class HrContactDetailsUploadDoc {
  fileName: string;
  teamSystemName: string;
  clientId: number;
  loggedId: number;
  bulkUploadDoc: any;
  uploadStatus: boolean;
  empflag: boolean;
  genflag: boolean;
  verflag: boolean;
  depId: number;
}

export class employerHrContact {
  hrContactId: number;
  empAddressId: number;
  name: string;
  contactNumber: string;
  emailId: string;
  comments: string;
  active: boolean;
  deleteFlag: boolean;
  createdUserId: number;
  created: Date;
  updatedUserId?: number | null;
  updated?: Date | null;
}