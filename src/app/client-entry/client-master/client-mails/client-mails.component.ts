import { Component, OnInit, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { ClientService } from 'src/app/common-methods/services/client.service';
import { MatDialog } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { BehaviorSubject } from 'rxjs';
import { Table, TableModule } from 'primeng/table';
import { MasterService } from 'src/app/common-methods/services/master.service';

@Component({
  standalone: false,
  selector: 'app-client-mails',
  templateUrl: './client-mails.component.html',
  styleUrls: ['./client-mails.component.css']
})
export class ClientMailsComponent implements OnInit {
  clientMailIdForm: UntypedFormGroup;
  @Input() mainForm: UntypedFormGroup;
  @Input() bindData: any;
  index = -1;
  emailData = new BehaviorSubject([]);
  columns = [
    { field: 'categoryLookupId', header: 'Category' },
    { field: 'reportLookupId', header: 'Report' },
    { field: 'sendTypeLookupId', header: 'Send Type' },
    { field: 'mailNotification', header: 'Send Email' }
  ];
  emailColumns = [
    { field: 'destName', header: 'Email Dest.Type' },
    { field: 'contactData', header: 'Email Id' },
  ];
  totalpages: number;
   @ViewChild('dt', { static: false }) dt!: Table;
  currentPage = 1;
  tempCurrentPage = 1;
  reportType: any;
  @Output() deleteEvent = new EventEmitter<any>();

  constructor(public clientService: ClientService, public commonService: CommonService,
    // tslint:disable-next-line: align
    private fb: UntypedFormBuilder, private masterService: MasterService) { }

  ngOnInit() {
    this.initFormGroup();
  }
  initFormGroup() {
    this.clientMailIdForm = this.fb.group({
      notifyId: [0],
      categoryLookupId: [null],
      sendTypeLookupId: [],
      reportLookupId: [],
      mailNotification: [false],
      reportName: [''],
      commonEmailDet: this.fb.array([])
    });
  }
  categoryChange(value: any) {
    if (value) {
      const lookUpName = this.commonService.getNameById(this.bindData.emailCategoryType, 'lookUpId', 'lookUpName', value);
      this.getReportTypeByCatId(lookUpName);
      if (lookUpName === this.commonService.FINAL_REPORT.toLowerCase()) {
        this.validation(lookUpName, this.commonService.FINAL_REPORT, 'reportLookupId');
      } else if (lookUpName === this.commonService.INSUF_NOTIFICATION.toLowerCase()) {
        this.validation(lookUpName, this.commonService.INSUF_NOTIFICATION, 'reportLookupId');
        this.validation(lookUpName, this.commonService.INSUF_NOTIFICATION, 'sendTypeLookupId');
      } else {
        this.clientMailIdForm.get('reportLookupId')?.clearValidators();
        this.clientMailIdForm.get('reportLookupId')?.updateValueAndValidity();
        this.clientMailIdForm.get('sendTypeLookupId')?.clearValidators();
        this.clientMailIdForm.get('sendTypeLookupId')?.updateValueAndValidity();
      }
    }
  }
  validation(categoryName, categoryType, ctrl) {
    if (categoryName === categoryType.toLowerCase()) {
      this.clientMailIdForm.get(ctrl).setValidators(Validators.required);
    } else {
      this.clientMailIdForm.get(ctrl).setValue(null);
      this.clientMailIdForm.get(ctrl).clearValidators();
    }
    this.clientMailIdForm.get(ctrl).updateValueAndValidity();
  }
  getReportTypeByCatId(lookUpName: any) {
    if (lookUpName) {
      this.masterService.getReportTypeByCatId(lookUpName).subscribe(resp => {
        if (resp) {
          this.reportType = resp;
        }
      });
    }
  }
  addMailId() {
    if (this.clientMailIdForm.valid && this.clientMailIdForm.get('categoryLookupId')?.value) {
      // To Validation
      if (!(this.clientMailIdForm.getRawValue().commonEmailDet.some(x => x.destName.toLowerCase()
        === this.commonService.DEST_TYPE_TO.toLowerCase()))) {
        this.clientService.showTopCenter('warn', 'Failure Message', 'Select atleast one Email Type To');
        return;
      }
      // Same List Validation
      if (this.checkSameList(this.mainForm.get('clientEmailConfig')?.value, this.clientMailIdForm.getRawValue(), false) === true) {
        this.clientService.showTopCenter('warn', 'Failure Message', 'Email List has been already exist');
        return;
      }
      // Add Mail Id
      const reportName = this.commonService.getNameById(this.reportType, 'lookUpId', 'lookUpName',
        this.clientMailIdForm.value.reportLookupId);
      this.clientMailIdForm.get('reportName')?.setValue(reportName);
      const clientMailId = this.mainForm.get('clientEmailConfig')?.value;
      if (this.index > -1) {
        clientMailId[this.index] = this.clientMailIdForm.getRawValue();
      } else {
        clientMailId.push(this.clientMailIdForm.getRawValue());
      }
      this.mainForm.get('clientEmailConfig')?.setValue(clientMailId);
      this.clientService.showTopCenter('success', 'Success Message', (this.index > -1 ? 'Updated' : 'Saved') + ' Successfully');
      this.resetMailId();
    } else {
      this.clientMailIdForm.markAllAsTouched();
      this.clientMailIdForm.get('categoryLookupId')?.setValidators(Validators.required);
      this.clientMailIdForm.get('categoryLookupId')?.updateValueAndValidity();
    }
  }
  checkSameList(fullList, currentList, flag) {
    for (let i = 0; i < fullList.length; i++) {
      if (this.index > -1) {
        if (i !== this.index) {
          flag = this.checkSameListValidation(fullList[i], currentList);
        }
      } else {
        flag = this.checkSameListValidation(fullList[i], currentList);
      }
    }
    return flag;
  }
  checkSameListValidation(fullList, currentList) {
    if ((fullList.categoryLookupId === currentList.categoryLookupId) && (fullList.sendTypeLookupId === currentList.sendTypeLookupId)
      && (fullList.reportLookupId === currentList.reportLookupId)) {
      return true;
    }
  }
  resetMailId() {
    this.emailData.next([]);
    this.index = -1;
    this.dt.reset();
    this.initFormGroup();
  }
  editMailId(data, ind) {
    this.index = ind;
    this.commonService.goToTop();
    this.categoryChange(data.categoryLookupId);
    this.clientMailIdForm.patchValue(data);
  }
  openDialog(ind: any) {
    this.deleteEvent.emit({
      data: ind, hText: 'Confirmation', bText: 'Are you sure you want to delete this record?',
      method1: 'mailScreen', method2: 'deleteMailId', methodNo: null
    });
  }
  deleteMailId(ind: any) {
    this.mainForm.get('clientEmailConfig')?.value.splice(ind, 1);
    this.mainForm.get('clientEmailConfig')?.setValue(this.mainForm.get('clientEmailConfig')?.value);
    this.clientService.showTopCenter('warn', 'Success Message', 'Deleted Successfully');
    this.dt.reset();
    this.commonService.goToTop();
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
