import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { VerificationService } from 'src/app/common-methods/services/verification.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';
import { SharedService } from 'src/app/common-methods/services/shared.service';
import { DatePipe } from '@angular/common';
import moment from 'moment';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-comments-updates',
  templateUrl: './comments-updates.component.html',
  styleUrls: ['./comments-updates.component.css']
})
export class CommentsUpdatesComponent implements OnInit {
  commentsFollowUpForm: UntypedFormGroup;
  @Input() commentsData;
  @Input() verificationForm;
  cols = [
    { field: 'comments', header: 'Comments' },
    { field: 'expectedDateClosure', header: 'Expected Date Closure' },
    { field: 'callBack', header: 'Call Back Date & Time' },
    { field: 'updatedToClient', header: 'Updated To Client' },
    { field: 'lastCalled', header: 'Last Called Date & Time' },
    { field: 'enteredBy', header: 'Entered By' }
  ];
  frozenCols = [
    { field: 'action', header: 'Action' },
  ];
  currentPage = 1;
  tempCurrentPage = 1;
  totalpages: number;
@ViewChild('commentstab')
commentstab!: Table;
  minDate = new Date();
  maxDate = new Date();
  userData: any;
  isDesc: boolean;
  column: any;
  direction: number;
  itemPerPage = 5;
  page = 1;
  screenAuth: any = {};
  @Input() filterLength: number;
  // tslint:disable-next-line: no-use-before-declare
  auditVm = new AuditVm();
  respFlag: any;
  constructor(public verificationService: VerificationService, private authService: AuthService, public datePipe: DatePipe,
    // tslint:disable-next-line:align
    private message: MessageService, public dialog: MatDialog, public commonService: CommonService, public sharedService: SharedService, private router: Router) { }

  ngOnInit() {
    this.maxDate = new Date(this.maxDate.setDate(this.minDate.getDate() + 6));
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.screenAuth = this.authService.getScreenAuth(this.commonService.VERIFICATION_ROUTER);
    this.initCommentFollowUpForm();
    if ((this.verificationForm.controls.responseDocument.value.componentName.toLowerCase())
      === (this.commonService.CRIMINAL_CHECK_PCC3.toLowerCase())
      || (this.verificationForm.controls.responseDocument.value.componentName.toLowerCase())
      === (this.commonService.CRIMINAL_CHECK_PCC3E.toLowerCase())) {
      this.commentsFollowUpForm.get('updatedToClientFlag')?.disable();
      this.commentsFollowUpForm.get('lastCalledFlag')?.disable();
    } else {
      this.commentsFollowUpForm.get('updatedToClientFlag')?.enable();
      this.commentsFollowUpForm.get('lastCalledFlag')?.enable();
    }
    this.GetComponentComments(this.verificationService.tempData.screeningCompId);
    if (this.verificationService.tempData.verificationScreeningDet.auditLookupStatusId > 0) {
      this.verificationForm.controls.verificationScreeningDet.controls.
        auditStatusLookupId.setValue(this.verificationService.tempData.verificationScreeningDet.auditLookupStatusId);
      this.verificationForm.controls.verificationScreeningDet.controls.auditUserId.disable();
      this.verificationForm.controls.verificationScreeningDet.controls.auditStatusLookupId.disable();
    }
  }
  initCommentFollowUpForm() {
    this.commentsFollowUpForm = new UntypedFormGroup({
      transactionId: new UntypedFormControl(0),
      screeningCompId: new UntypedFormControl(0),
      screeningId: new UntypedFormControl(this.verificationService.tempData.ScreeningId),
      comments: new UntypedFormControl(''),
      callDuration: new UntypedFormControl(0),
      callCharge: new UntypedFormControl(0),
      statusDate: new UntypedFormControl(new Date()),
      callBack: new UntypedFormControl(),
      updatedToClient: new UntypedFormControl(),
      updatedToClientFlag: new UntypedFormControl(false),
      lastCalledFlag: new UntypedFormControl(false),
      lastCalled: new UntypedFormControl(),
      receivedClientUpdate: new UntypedFormControl(),
      sendNotificationToClient: new UntypedFormControl(false),
      receivedClientUpdateFlag: new UntypedFormControl(false),
      dismissal: new UntypedFormControl(false),
      clientNotificationFlag: new UntypedFormControl(false),
      clientUpdateFlag: new UntypedFormControl(false),
      expectedDateClosure: new UntypedFormControl(),
      createdUserId: new UntypedFormControl(this.authService.userdata.userId),
    });
  }
  resetForm() {
    this.getControlEnable();
    this.commentsFollowUpForm.reset();
    this.initCommentFollowUpForm();
  }
  bindCost(event: any) {
    if (event) {
      this.commentsFollowUpForm.get('callCharge')?.setValue(event *
        (this.verificationForm.get('verificationTransBindDet')?.value.domesticCallChargesLookupId));
    }
  }
  bindLastCalled(checked, type: string) {
    if (type === 'Last') {
      if (checked) {
        this.commentsFollowUpForm.get('lastCalled')?.setValue(new Date());
      } else {
        this.commentsFollowUpForm.get('lastCalled')?.setValue(null);
      }
    } else if (type === 'Updated') {
      if (checked) {
        this.commentsFollowUpForm.get('updatedToClient')?.setValue(new Date());
      } else {
        this.commentsFollowUpForm.get('updatedToClient')?.setValue(null);
      }
    }
    //else if (type === 'Received') {
    //   if (checked) {
    //     this.commentsFollowUpForm.get('receivedClientUpdate')?.setValue(new Date());
    //   } else {
    //     this.commentsFollowUpForm.get('receivedClientUpdate')?.setValue(null);
    //   }
    // }
  }
  saveCommentsFollowUp() {
    if (this.commentsFollowUpForm.get('comments')?.value) {
      this.commentsFollowUpForm.get('comments')?.clearValidators();
    } else {
      this.commentsFollowUpForm.get('comments')?.setValidators(Validators.required);
    }
    this.commentsFollowUpForm.get('comments')?.updateValueAndValidity();
    if (this.commentsFollowUpForm.valid) {
      this.commentsFollowUpForm.get('screeningCompId')?.setValue(this.verificationService.tempData.screeningCompId);
      this.commentsFollowUpForm.get('screeningId')?.setValue(this.verificationService.tempData.screeningId);
      // this.commentsFollowUpForm.get('callBack')?.setValue(this.commonService.getTimezoneOffset(this.commentsFollowUpForm.value.callBack, false));
      // this.commentsFollowUpForm.get('expectedDateClosure')?.setValue(this.commonService.getTimezoneOffset(this.commentsFollowUpForm.value.expectedDateClosure, false));

      this.verificationService.addVerificationComments(this.commentsFollowUpForm.getRawValue()).subscribe(res => {
        if (res.success) {
          if (this.commentsFollowUpForm.controls.transactionId.value > 0) {
            this.showTopCenter('success', 'Success Message', 'Updated Successfully');
          } else {
            this.showTopCenter('success', 'Success Message', 'Saved Successfully');
          }
          this.commonService.changeLastUpdatedUser(this.verificationForm);
          this.GetComponentComments(this.commentsFollowUpForm.get('screeningCompId')?.value);
          this.resetForm();
        }
      }, err => { }, () => {
      });
    }
  }
  //ClientRefNo added By Megala - for VTS2-2023-DEV-0141 (Comment History Added In Global Search)
  GetComponentComments(screeningCompId: any) {
    this.verificationService.getComponentComments(screeningCompId, this.verificationService.tempData.screeningId, null).subscribe(resp => {
      if (resp) {
        this.commentsData = resp;
        // To change callBack, expectedDateClosure, lastCalled, receivedClientUpdate, updatedToClient dates to utc dates.
        this.commentsData.forEach(element => {
          // element.callBack = element.callBack ? (this.commonService.getTimezoneOffset(element.callBack, false)) : element.callBack;
          // element.expectedDateClosure = element.expectedDateClosure ?
          //   (this.commonService.getTimezoneOffset(element.expectedDateClosure, false)) : element.expectedDateClosure;
          // element.lastCalled = element.lastCalled ? (this.commonService.getTimezoneOffset(element.lastCalled, false)) : element.lastCalled;
          element.receivedClientUpdate = element.receivedClientUpdate ?
            (this.commonService.getTimezoneOffset(element.receivedClientUpdate, false)) : element.receivedClientUpdate;
          // element.updatedToClient = element.updatedToClient ?
          // (this.commonService.getTimezoneOffset(element.updatedToClient, false)) : element.updatedToClient;
          // VTS2-2023-CRT-0106 - In comments and followup in VE side comment binding
          element.clearedDate = this.commonService.getTimezoneOffset(element.clearedDate, false);
          element.clearedDate = moment(element.clearedDate).format("DD/MM/yyyy hh:mm A");
          element.comments = element.clearedStatus ?
            ((element.clearedStatus ? (element.clearedStatus + ' - ') : '') + (element.comments ? element.comments : 'Not Provided') + (element.clearedDate ? (' / ' + element.clearedDate) : '')) : element.comments;
        });
        this.verificationService.tempData.commentsFollowUp = this.commentsData;
        if (this.verificationService.tempData.commentsFollowUp.length > 0) {
          this.sharedService.emitNameChange({ name: this.verificationService.tempData.commentsFollowUp[0].enteredBy });
        }
        this.verificationForm.get('commentsFollowUp')?.setValue(resp);
      }
    }, err => { }, () => {
    });
    // this.commentstab.reset();
  }
  getControlDisable() {
    this.commentsFollowUpForm.get('updatedToClientFlag')?.disable();
    this.commentsFollowUpForm.get('lastCalledFlag')?.disable();
    this.commentsFollowUpForm.get('receivedClientUpdateFlag')?.disable();
    this.commentsFollowUpForm.get('sendNotificationToClient')?.disable();
    this.commentsFollowUpForm.get('dismissal')?.disable();
    this.commentsFollowUpForm.get('callDuration')?.disable();
    this.commentsFollowUpForm.get('expectedDateClosure')?.disable();
    this.commentsFollowUpForm.get('callBack')?.disable();
  }
  getControlEnable() {
    this.commentsFollowUpForm.get('updatedToClientFlag')?.enable();
    this.commentsFollowUpForm.get('lastCalledFlag')?.enable();
    this.commentsFollowUpForm.get('receivedClientUpdateFlag')?.enable();
    this.commentsFollowUpForm.get('sendNotificationToClient')?.enable();
    this.commentsFollowUpForm.get('dismissal')?.enable();
    this.commentsFollowUpForm.get('callDuration')?.enable();
    this.commentsFollowUpForm.get('expectedDateClosure')?.enable();
    this.commentsFollowUpForm.get('callBack')?.enable();
  }
  editCommentsFollowUp(data: any) {
    this.commonService.goToTop();
    this.commentsFollowUpForm.patchValue(data);
    this.getControlDisable();
    if (this.commentsFollowUpForm.get('lastCalled')?.value) {
      this.commentsFollowUpForm.get('lastCalledFlag')?.setValue(true);
    } else {
      this.commentsFollowUpForm.get('lastCalledFlag')?.setValue(false);
    }
    if (this.commentsFollowUpForm.get('updatedToClient')?.value) {
      this.commentsFollowUpForm.get('updatedToClientFlag')?.setValue(true);
    } else {
      this.commentsFollowUpForm.get('updatedToClientFlag')?.setValue(false);
    }
    if (this.commentsFollowUpForm.get('receivedClientUpdate')?.value) {
      this.commentsFollowUpForm.get('receivedClientUpdateFlag')?.setValue(true);
    } else {
      this.commentsFollowUpForm.get('receivedClientUpdateFlag')?.setValue(false);
    }
    // this.bindCost(this.commentsFollowUpForm.controls.callDuration.value);
  }
  public openDialog(data: any) {
    const popupData = {
      action: this.commonService.DELETECONFIRMATION,
      id: data,
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
          if (action === this.commonService.DELETECONFIRMATION) {
            this.deleteCommentsFollowUp(data);
          }
        }
      });
    }
  }
  deleteCommentsFollowUp(data: any) {
    this.verificationService.deleteVerificationComments(data.transactionId, this.authService.userdata.userId).subscribe(res => {
      if (res.success) {
        this.showTopCenter('warn', 'Success Message', 'Deleted Successfully');
        this.GetComponentComments(data.screeningCompId);
        this.resetForm();
        this.commonService.goToTop();
      }
    });
  }
  auditChange() {
    this.verificationForm.controls.verificationScreeningDet.controls.auditUserId.enable();
    this.verificationForm.controls.verificationScreeningDet.controls.auditStatusLookupId.enable();
  }
  auditSave() {
    if ((this.verificationForm.controls.verificationScreeningDet.controls.auditUserId.value &&
      this.verificationForm.controls.verificationScreeningDet.controls.auditUserId.valid) &&
      (this.verificationForm.controls.verificationScreeningDet.controls.auditStatusLookupId.value &&
        this.verificationForm.controls.verificationScreeningDet.controls.auditStatusLookupId.valid)) {
      this.auditVm.screeningCompId = this.verificationForm.value.screeningCompId;
      this.auditVm.auditUserId = this.verificationForm.controls.verificationScreeningDet.controls.auditUserId.value;
      this.auditVm.auditStatusLookupId = this.verificationForm.controls.verificationScreeningDet.controls.auditStatusLookupId.value;
      this.auditVm.logginId = this.userData.userId;
      this.verificationService.AddAuditUser(this.auditVm).subscribe(resp => {
        if (resp === true) {
          this.respFlag = resp;
          this.showTopCenter('success', 'Success Message', 'Saved Successfully');
          this.verificationForm.controls.verificationScreeningDet.controls.auditUserId.disable();
          this.verificationForm.controls.verificationScreeningDet.controls.auditStatusLookupId.disable();
        }
      });
    } else {
      this.verificationForm.controls.verificationScreeningDet.controls.auditUserId.markAsTouched();
      this.verificationForm.controls.verificationScreeningDet.controls.auditStatusLookupId.markAsTouched();
    }
  }
  excelExport() {
    const cols = [

      { field: 'enteredBy', header: 'Entered By' },
      { field: 'statusDate', header: 'Date Of Comments' },
      { field: 'comments', header: 'Comments' },

    ];

    this.commonService.exportToExcel(cols, this.commentsData, 'Comments & Follows List', true);

  }

  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }
  navigateNxtPrevPage(pageNo, rows) {
    this.currentPage = pageNo / rows;
    this.tempCurrentPage = this.currentPage;
  }
  navigatePage(pageNo, rowscount) {
    if (+pageNo > this.totalpages || +pageNo <= 0) {
      this.currentPage = this.tempCurrentPage;
    } else {
      this.commentstab.onPageChange({ first: ((pageNo - 1) * rowscount), rows: rowscount });
      this.tempCurrentPage = this.currentPage;
    }
  }
  getTotalPages(totalRecords, rows) {
    this.totalpages = Math.ceil((totalRecords) / rows);
    return Math.ceil((totalRecords) / rows);
  }

  getFilterLen(c): string {
    this.filterLength = c;
    return 'listrow';
  }
  sortBy(type: any) {
    this.isDesc = !this.isDesc;
    this.column = type;
    this.direction = this.isDesc ? 1 : -1;
  }
  getPage(event: any) {
    this.page = event;
  }
  getTotalPage(): number {
    if (this.commentsData.length) {
      return Math.ceil(this.commentsData.length / this.itemPerPage);
    }
  }
  preventInfinite() {
    if (!this.itemPerPage) {
      this.itemPerPage = 1;
    }
  }
}
export class AuditVm {
  screeningCompId: number;
  auditUserId: number;
  auditStatusLookupId: number;
  logginId: number;
}