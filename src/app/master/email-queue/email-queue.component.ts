import { Component, OnInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-email-queue',
  templateUrl: './email-queue.component.html',
  styleUrls: ['./email-queue.component.css']
})
export class EmailQueueComponent implements OnInit {
  showFlag = false;
  EmailQueueForm: UntypedFormGroup;
  displayedColumns = [
    { field: 'emailAddress', header: 'Email Id' },
    { field: 'category', header: 'Category' },
    { field: 'priorityOrder', header: 'Priority' },
    { field: 'active', header: 'Active' },
    // { field: 'Actions', header: 'Action' },
  ];
  frozenCols = [
    { field: 'action', header: 'Action' },
  ];
  breadcrumbFlags = new BreadcrumbFlags();
  routePath = 'Configure / Mail Config / Email Queue';
  emailQueueList: any[] = [];
  lookUpValue: any[] = [];
  userData: any;
  isEdit: boolean;
  screenAuth: any = {};

  totalpages: number;
   @ViewChild('dt', { static: false }) dt!: Table;
  @ViewChild('global', { static: true }) global!: ElementRef;
  currentPage = 1;
  tempCurrentPage = 1;

  @ViewChild('emailAddressCtrlTrigger', { static: true }) 
emailAddressCtrlTrigger!: MatMenuTrigger;
  emailAddressFilteredOptions: Observable<string[]>;
  emailAddressControl = new UntypedFormControl();

  @ViewChild('categoryCtrlTrigger', { static: true }) categoryCtrlTrigger: MatMenuTrigger;
  categoryFilteredOptions: Observable<string[]>;
  categoryControl = new UntypedFormControl();

  @ViewChild('priorityOrderCtrlTrigger', { static: true }) priorityOrderCtrlTrigger: MatMenuTrigger;
  // tslint:disable-next-line: max-line-length
  constructor(public common: CommonService, private master: MasterService, private message: MessageService,
    private fb: UntypedFormBuilder, private authservice: AuthService, public dialog: MatDialog, private router: Router, ) { }

  ngOnInit() {
    this.breadcrumbFlags = this.common.breadcrumbFlags(true);
    this.screenAuth = this.authservice.getScreenAuth(this.router.url);
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.getEmailQueue();
  }
  initFormGroup() {
    this.EmailQueueForm = this.fb.group({
      categoryLookupId: ['', Validators.required],
      emailQueueId: [0],
      emailAddress: ['', (Validators.compose(
        [Validators.pattern(this.common.EmailRegX), Validators.minLength(1),
        Validators.required]))],
      password: ['', Validators.required],
      priorityOrder: ['', Validators.required],
      active: [false],
      createdUserId: [this.userData.userId]
    });
  }

  getEmailQueue() {
    this.master.getEmailQueueList().subscribe(resp => {
      if (resp) {
        this.emailQueueList = resp.emailQueueVm;
        this.lookUpValue = resp.lookUpValueVm;
        this.userTblAutoFilters();
        this.currentPage = 1;
      }
    });
  }
  saveEmailQueue() {

    if (this.EmailQueueForm.valid) {
      this.master.saveEmailQueue(this.EmailQueueForm.getRawValue()).subscribe(res => {
        if (res.success === false) {
          this.showTopCenter('warn', 'Failure Message', res.message);
        } else {
          if (this.EmailQueueForm.controls.emailQueueId.value > 0) {
            this.isEdit = false;
            this.showTopCenter('success', 'Success Message', 'Updated Successfully');
          } else {
            this.showTopCenter('success', 'Success Message', 'Saved Successfully');
          }
          this.getEmailQueue();
          this.closeForm();
        }
      });
    }
  }

  addEmailQueue() {
    this.breadcrumbFlags.toolTip = 'Save';
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.initFormGroup();
    this.showFlag = !this.showFlag;
  }

  editEmailQueue(src, mode: any) {
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.breadcrumbFlags.toolTip = 'Update';

    this.initFormGroup();
    this.master.getEmailQueueById(src.emailQueueId).subscribe(res => {
      if (res) {
        this.common.tempResetData = res;
        this.EmailQueueForm.patchValue({
          emailQueueId: this.common.tempResetData.emailQueueId,
          categoryLookupId: this.common.tempResetData.categoryLookupId,
          emailAddress: this.common.tempResetData.emailAddress,
          password: this.common.tempResetData.password,
          priorityOrder: this.common.tempResetData.priorityOrder,
          active: this.common.tempResetData.active
        });
        if (mode === 'view') {
          this.EmailQueueForm.disable();
          this.breadcrumbFlags.btnSave = false;
          this.breadcrumbFlags.btnReset = false;
        }
      }
    });
    this.showFlag = !this.showFlag;
    this.isEdit = true;
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
            this.deleteEmailQueue(data);
          }
        }
      });
    }
  }
  deleteEmailQueue(src: any) {
    const loggedIn = this.userData.userId;
    this.master.deleteEmailQueue(src.emailQueueId, loggedIn).subscribe(resp => {
      if (resp) {
        this.showTopCenter('success', 'Success Message', 'Deleted Successfully');
        this.getEmailQueue();
      }
    });
  }
  resetForm() {
    if (this.EmailQueueForm.controls.emailQueueId.value > 0) {
      this.EmailQueueForm.patchValue({
        emailQueueId: this.common.tempResetData.emailQueueId,
        categoryLookupId: this.common.tempResetData.categoryLookupId,
        emailAddress: this.common.tempResetData.emailAddress,
        password: this.common.tempResetData.password,
        priorityOrder: this.common.tempResetData.priorityOrder,
        active: this.common.tempResetData.active
      });
    } else {
      this.EmailQueueForm.controls.emailQueueId.setValue(0);
      this.EmailQueueForm.reset();
      this.EmailQueueForm.markAsPristine();
    }
  }
  private userTblAutoFilters(): void {
    this.emailAddressFilteredOptions = this.emailAddressControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.emailQueueList.map(x => x.emailAddress).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.categoryFilteredOptions = this.categoryControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.emailQueueList.map(x => x.category).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
  }
  closeForm() {
    this.breadcrumbFlags.btnSave = true;
    this.breadcrumbFlags.btnReset = true;
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.EmailQueueForm.reset();
    this.showFlag = !this.showFlag;
    this.isEdit = false;
    this.currentPage = 1;
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
  resettable() {
    this.dt.reset();
    this.global.nativeElement.value = '';
    this.categoryControl.reset();
    this.emailAddressControl.reset();
  }
  closeMenu(col: any) {
    switch (col) {
      case 'emailAddress': this.emailAddressCtrlTrigger.closeMenu(); break;
      case 'category': this.categoryCtrlTrigger.closeMenu(); break;
      case 'priorityOrderCtrlTrigger': this.priorityOrderCtrlTrigger.closeMenu(); break;
      default: break;
    }
  }
}
