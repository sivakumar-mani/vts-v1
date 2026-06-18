import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';
import { Validators, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';
import { Router } from '@angular/router';


@Component({
  standalone: false,
  selector: 'app-recruiter',
  templateUrl: './recruiter details.component.html',
  styleUrls: ['./recruiter details.component.css']
})
export class RecruiterDetailsComponent implements OnInit {
  recruiterForm: UntypedFormGroup;
  breadcrumbFlags = new BreadcrumbFlags();
  userData: any;
  screenAuth: any = {};
  recruiterList: any;
  displayedColumns = [
    { field: 'recruiterName', header: 'Recruiter Name' },
    { field: 'emailId', header: 'Email Id' },
    { field: 'active', header: 'Active' },
  ];
  totalpages: number;
  currentPage = 1;
  tempCurrentPage = 1;
   @ViewChild('dt', { static: false }) dt!: Table;
  @ViewChild('global', { static: true }) global!: ElementRef;
  constructor(private authservice: AuthService, public common: CommonService, private fb: UntypedFormBuilder,
    // tslint:disable-next-line: align
    private master: MasterService, private message: MessageService, public dialog: MatDialog, private router: Router, ) { }

  ngOnInit() {
    this.screenAuth = this.authservice.getScreenAuth(this.router.url);
    this.breadcrumbFlags = this.common.breadcrumbFlags(true);
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.getRecruiter();
  }
  getRecruiter() {
    this.master.GetRecruiterById(0).subscribe(res => {
      if (res) {
        this.recruiterList = res;
        this.currentPage = 1;
        this.dt.reset();
      }
    });
  }
  addForm() {
    this.initFormGroup();
    this.breadcrumbFlags.toolTip = 'Save';
    this.breadcrumbFlags = this.common.breadcrumbFlags();
  }
  initFormGroup() {
    this.recruiterForm = this.fb.group({
      recruiterId: [0],
      recruiterName: ['', Validators.required],
      emailId: [null, [Validators.required,
      Validators.pattern(this.common.EmailRegX),
      Validators.minLength(1)]],
      createdUserId: [this.userData.userId],
      active: [true],
    });
  }
  saveForm() {
    if (this.recruiterForm.valid) {
      this.master.AddRecruiter(this.recruiterForm.getRawValue()).subscribe(resp => {
        if (resp) {
          this.showTopCenter('success', 'Success Message',
            this.recruiterForm.value.recruiterId > 0 ? 'Updated Successfully' : 'Saved Successfully');
          this.breadcrumbFlags = this.common.breadcrumbFlags();
          this.getRecruiter();
        }
      });
    } else {
      this.recruiterForm.markAllAsTouched();
    }
  }
  resetForm() {
    if (this.recruiterForm.value.recruiterId > 0) {
      this.patchValue(this.common.tempResetData);
    } else {
      this.initFormGroup();
      this.recruiterForm.markAsPristine();
    }
  }
  patchValue(res: any) {
    setTimeout(() => {
      this.recruiterForm.patchValue({
        recruiterId: res.recruiterId,
        recruiterName: res.recruiterName,
        emailId: res.emailId,
        active: res.active,
      });
    }, 1);
  }
  resetTable() {
    this.global.nativeElement.value = '';
    this.dt.reset();
  }
  editForm(data: any) {
    this.initFormGroup();
    this.breadcrumbFlags.toolTip = 'Update';
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.common.tempResetData = null;
    this.master.GetRecruiterById(data.recruiterId).subscribe(resp => {
      if (resp) {
        this.common.tempResetData = resp[0];
        this.patchValue(resp[0]);
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
            this.DeleteRecruiter(data);
          }
        }
      });
    }
  }
  DeleteRecruiter(data: any) {
    this.master.DeleteRecruiter(data.RecruiterId, this.userData.userId).subscribe(resp => {
      if (resp) {
        this.showTopCenter('warn', 'Success Message', 'Deleted Successfully');
        this.getRecruiter();
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
}



