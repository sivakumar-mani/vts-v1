import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { ClientMailID, ClientEmailConfig, CommonEmailVm } from 'src/app/common-methods/models/agentEntryMaster';
import { AgentEntryMasterService } from 'src/app/common-methods/services/agent-entry-master.service';
import { UntypedFormGroup, UntypedFormArray, Validators } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';
import { SharedService } from 'src/app/common-methods/services/shared.service';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { BehaviorSubject } from 'rxjs';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table'

@Component({
  standalone: false,
  selector: 'app-client-mail-ids',
  templateUrl: './client-mail-ids.component.html',
  styleUrls: ['./client-mail-ids.component.css']
})
export class ClientMailIdsComponent implements OnInit {
  @Output() nextStep = new EventEmitter<void>();
  @Output() previousStep = new EventEmitter<void>();
  @ViewChild('clientFeeDocument', { static: true }) clientFeeDocument;
  dialogRef: any;
  public clientMailIdForm: UntypedFormGroup;
  clientMailID = new ClientMailID();
  clientmail: ClientEmailConfig;
  emailCategory: string;
  ename: string;
  index = -1;
  emailCategoryType: any[] = [];
  reportType: any[] = [];
  sendType: any[] = [];
  typeOfAgreement: any[] = [];
  data: any;
  columns = [
    { field: 'categoryName', header: 'Category' },
    { field: 'sendTypeName', header: 'Send Type' },
    { field: 'reportName', header: 'Report' },
    { field: 'mailNotification', header: 'Send Email' }
  ];
  emailColumn = [
    { field: 'destName', header: 'Email Dest.Type' },
    { field: 'contactData', header: 'Email Id' },
  ];
  totalpages: number;
   @ViewChild('dt', { static: false }) dt!: Table;
  currentPage = 1;
  tempCurrentPage = 1;
  tooltip = false;
  errormsg = '';
  addMail = false;
  emailFlag = true;
  notifyId: any;
  emailDetail: UntypedFormArray;
  emailcategory: any;
  emaildest: any;
  sendtype: any;
  reporttype: any;
  commonEmailVm: CommonEmailVm[] = [];
  emailData = new BehaviorSubject([]);
  categoryName: string;
  updateCatValue: any;
  addFlag = true;
  updateSendValue: any;
  updateReportValue: any;

  constructor(public agentEntryMasterService: AgentEntryMasterService, public common: CommonService, private message: MessageService,
              public dialog: MatDialog, public sharedService: SharedService, public masterService: MasterService) { }

  ngOnInit() {
    this.getClientMailIdDetails();
    this.agentEntryMasterService.clientMailIdForm.reset();
    this.agentEntryMasterService.initemailListFormGroup();
  }

  getClientMailIdDetails() {
    this.agentEntryMasterService.GetClientAndSiteLookup().subscribe(res => {
      this.emailCategoryType = res.emailCategoryType;
      // this.reportType = res.reportType;
      this.sendType = res.sendType;
      this.typeOfAgreement = res.typeOfAgreement;
      if (this.agentEntryMasterService.clientid > 0) {
        // tslint:disable-next-line:no-shadowed-variable
        this.agentEntryMasterService.clientEmailConfig.forEach(element => {
          const categoryName = this.emailCategoryType.filter(x => x.lookUpId ===
            element.categoryLookupId);
          element.categoryName = categoryName[0].lookUpName;
          this.getReportType(element.categoryLookupId);
          // if (element.emailLookupId) {
          //   const emailtypeName = this.typeOfAgreement.filter(x => x.lookUpId ===
          //     element.emailLookupId);
          //   element.typeName = emailtypeName[0].lookUpName;
          // }
          // if (element.reportLookupId) {
          //   const reportName = this.reportType.filter(x => x.lookUpId ===
          //     element.reportLookupId);
          //   element.reportName = reportName[0].lookUpName;
          // }
        });
      }
    }, err => {
      console.error(err);
    }, () => {
    });
  }
  categoryChange(event: any) {
    // const list = this.agentEntryMasterService.clientEmailConfig.filter(x => x.categoryLookupId === event);
    // if (list.length > 0) {
    //   if (this.index === -1) {
    //     this.showTopCenter('warn', 'Failure Message', 'Category type already exist');
    //     this.agentEntryMasterService.clientMailIdForm.get('categoryLookupId')?.setValue(null);
    //   } else {
    //     if (this.updateCatValue !== event) {
    //       this.showTopCenter('warn', 'Failure Message', 'Category type already exist');
    //       this.agentEntryMasterService.clientMailIdForm.get('categoryLookupId')?.setValue(null);
    //     }
    //   }
    // } else {
    // this.getReportType(event);
    // }
    this.getReportType(event);

  }
  getReportType(lookUpId: any) {
    if (lookUpId) {
      const val = this.emailCategoryType.find(x => x.lookUpId === lookUpId);
      this.categoryName = val.lookUpName;
      if (val) {
        this.masterService.getReportTypeByCatId(val.lookUpName).subscribe(resp => {
          setTimeout(() => {
            if (resp) {
              this.reportType = resp;
            }
          }, 10);
        });
      }
    }
  }
  addEmailCtrl(index: any) {
    const frmArray = this.agentEntryMasterService.clientMailIdForm.get('commonEmail') as UntypedFormArray;
    const frmGroup = frmArray.controls[index] as UntypedFormGroup;
    const controlNames = ['contactData', 'emailDestLookupId'];
    for (const ctrl in frmGroup.controls) {
      if (controlNames.indexOf(ctrl) > -1) {
        if (!frmGroup.get(ctrl).value) {
          frmGroup.get(ctrl).setValidators(Validators.required);
          frmGroup.get(ctrl).updateValueAndValidity();
        } else {
          frmGroup.get(ctrl).clearValidators();
          frmGroup.get(ctrl).updateValueAndValidity();
        }
      }
    }
    // const frmGroup = frmArray.controls[ind] as UntypedFormGroup;
    // frmGroup.get('subCompFlag')?.setValue(true);
    if (frmGroup.valid) {
      this.emailDetail = this.agentEntryMasterService.clientMailIdForm.get('commonEmail') as UntypedFormArray;
      this.emailDetail.push(this.agentEntryMasterService.initEmailForm());
      this.agentEntryMasterService.formLength = this.emailDetail.length;
      this.emailData.next([]);
    }
  }
  removeEmailCtrl(index: any) {
    if (this.emailDetail.length > 1) {
      // tslint:disable-next-line:no-string-literal
      const control = this.agentEntryMasterService.clientMailIdForm.controls['commonEmail'] as UntypedFormArray;
      control.removeAt(index);
      this.agentEntryMasterService.formLength = this.emailDetail.length;
    }
  }
  addMailIdContent() {
    this.addValidation();
    this.addFlag = true;
    if (this.agentEntryMasterService.clientMailIdForm.valid) {
      this.commonEmailVm = [];
      const arrayForm = this.agentEntryMasterService.clientMailIdForm.get('commonEmailDet')?.value;
      arrayForm.forEach(elem => {
        this.commonEmailVm.push({
          contactData: elem.contactData,
          destLookupId: elem.destLookupId,
          transContactId: elem.transContactId ? elem.transContactId : 0,
          contactId: elem.contactId ? elem.contactId : 0,
          active: true,
          destName: elem.destName,
          lookupId: elem.lookupId ? elem.lookupId : 478
        });
      });
      const clientemail: ClientEmailConfig = {
        notifyId: this.notifyId ? this.notifyId : 0,
        clientId: this.agentEntryMasterService.clientid,
        categoryLookupId: this.agentEntryMasterService.clientMailIdForm.get('categoryLookupId')?.value,
        reportLookupId: this.agentEntryMasterService.clientMailIdForm.get('reportLookupId')?.value,
        sendTypeLookupId: this.agentEntryMasterService.clientMailIdForm.get('sendTypeLookupId')?.value,
        mailNotification: this.agentEntryMasterService.clientMailIdForm.get('mailNotification')?.value,
        active: null,
        commonEmailDet: this.commonEmailVm,
        categoryName: '',
        reportName: '',
        sendTypeName: ''
      };
      if (clientemail.categoryLookupId) {
        const cName = this.emailCategoryType.filter(x => x.lookUpId ===
          clientemail.categoryLookupId);
        clientemail.categoryName = cName[0].lookUpName;
      }
      if (clientemail.sendTypeLookupId) {
        const tName = this.sendType.filter(x => x.lookUpId ===
          clientemail.sendTypeLookupId);
        clientemail.sendTypeName = tName[0].lookUpName;
      }
      this.getReportType(clientemail.categoryLookupId);
      setTimeout(() => {
        if (clientemail.reportLookupId) {
          const rName = this.reportType.filter(x => x.lookUpId ===
            clientemail.reportLookupId);
          clientemail.reportName = rName[0].lookUpName;
        }
      }, 100);
      if (clientemail.commonEmailDet) {
        clientemail.commonEmailDet.forEach(ele => {
          if (ele.destLookupId) {
            const rName = this.typeOfAgreement.filter(x => x.lookUpId ===
              ele.destLookupId);
            ele.destName = rName[0].lookUpName;
          }
        });
      }
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.agentEntryMasterService.clientEmailConfig.length; i++) {
        if (this.index > -1) {
          if (i !== this.index) {
            if ((this.agentEntryMasterService.clientEmailConfig[i].categoryLookupId === clientemail.categoryLookupId)
              && (this.agentEntryMasterService.clientEmailConfig[i].sendTypeLookupId === clientemail.sendTypeLookupId)
              && (this.agentEntryMasterService.clientEmailConfig[i].reportLookupId === clientemail.reportLookupId)) {
              this.showTopCenter('warn', 'Failure Message', 'Email List has been already exist');
              return this.addFlag = false;
            }
          }
        } else {
          if ((this.agentEntryMasterService.clientEmailConfig[i].categoryLookupId === clientemail.categoryLookupId)
            && (this.agentEntryMasterService.clientEmailConfig[i].sendTypeLookupId === clientemail.sendTypeLookupId)
            && (this.agentEntryMasterService.clientEmailConfig[i].reportLookupId === clientemail.reportLookupId)) {
            this.showTopCenter('warn', 'Failure Message', 'Email List has been already exist');
            return this.addFlag = false;
          }
        }
      }
      // this.agentEntryMasterService.clientEmailConfig.forEach(element1 => {
      //   if ((element1.categoryLookupId === clientemail.categoryLookupId) && (element1.sendTypeLookupId === clientemail.sendTypeLookupId)
      //     && (element1.reportLookupId === clientemail.reportLookupId)) {
      //       this.showTopCenter('warn', 'Failure Message', 'Email List has been already exist');
      //       return this.addFlag = false;
      //   }
      // });
      if (this.addFlag === true) {
        if (clientemail.commonEmailDet) {
          const some = clientemail.commonEmailDet.some(x => x.destName === this.common.DEST_TYPE_TO);
          if (some) {
            if (this.index > -1) {
              this.agentEntryMasterService.clientEmailConfig[this.index] = clientemail;
              this.showTopCenter('success', 'Success Message', 'Updated Successfully');
              this.notifyId = 0;
              this.index = -1;
              this.tooltip = false;
            } else {
              this.agentEntryMasterService.clientEmailConfig.push(clientemail);
              this.showTopCenter('success', 'Success Message', 'Saved Successfully');
            }
            this.dt.reset();
            this.agentEntryMasterService.clientMailIdForm.reset();
            this.emailData.next([]);
            this.agentEntryMasterService.initemailListFormGroup();
          } else {
            this.showTopCenter('warn', 'Failure Message', 'Please select atleast one Email Type To');
          }
        }
      }
    }
  }
  filterEmailConfigNames(type, id) {
    let emailcategory;
    switch (type) {
      case 'categoryLookupId':
        emailcategory = this.emailcategory.find(f => f.lookUpId === id);
        break;
      case 'emailDestLookupId':
        emailcategory = this.emaildest.find(f => f.lookUpId === id);
        break;
      case 'sendTypeLookupId':
        emailcategory = this.sendtype.find(f => f.lookUpId === id);
        break;
      case 'reportLookupId':
        // if (this.reporttype) {
        emailcategory = this.reporttype.find(f => f.lookUpId === id);
        // }
        break;
      default: return 'N/A';
      // break;
    }
    return emailcategory ? emailcategory.lookUpName : '';
  }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }
  validators(ctrl: any) {
    if (this.agentEntryMasterService.clientMailIdForm.get(ctrl).value) {
      this.clearValidators(ctrl);
    } else {
      this.setValidators(ctrl);
    }
  }
  setValidators(ctrl: any) {
    this.agentEntryMasterService.clientMailIdForm.get(ctrl).setValidators(Validators.required);
    this.agentEntryMasterService.clientMailIdForm.get(ctrl).updateValueAndValidity();
  }
  clearValidators(ctrl: any) {
    this.agentEntryMasterService.clientMailIdForm.get(ctrl).clearValidators();
    this.agentEntryMasterService.clientMailIdForm.get(ctrl).updateValueAndValidity();
  }
  addValidation() {
    if (this.agentEntryMasterService.clientMailIdForm.get('categoryLookupId')?.value) {
      this.agentEntryMasterService.clientMailIdForm.get('categoryLookupId')?.clearValidators();
      this.agentEntryMasterService.clientMailIdForm.get('categoryLookupId')?.updateValueAndValidity();
      if (this.categoryName === this.common.INSUF_NOTIFICATION) {
        const controlNames = ['sendTypeLookupId', 'reportLookupId'];
        for (const ctrl in this.agentEntryMasterService.clientMailIdForm.controls) {
          if (controlNames.indexOf(ctrl) > -1) {
            this.validators(ctrl);
          }
        }
      } else {
          const controlNames = ['sendTypeLookupId', 'reportLookupId'];
          for (const ctrl in this.agentEntryMasterService.clientMailIdForm.controls) {
            if (controlNames.indexOf(ctrl) > -1) {
              this.clearValidators(ctrl);
            }
          }
      }
      if (this.categoryName === this.common.FINAL_REPORT) {
        const controlNames = ['reportLookupId'];
        for (const ctrl in this.agentEntryMasterService.clientMailIdForm.controls) {
          if (controlNames.indexOf(ctrl) > -1) {
            this.validators(ctrl);
          }
        }
      } else {
        if (this.categoryName !== this.common.INSUF_NOTIFICATION) {
          const controlNames = ['sendTypeLookupId'];
          for (const ctrl in this.agentEntryMasterService.clientMailIdForm.controls) {
            if (controlNames.indexOf(ctrl) > -1) {
              this.clearValidators(ctrl);
            }
          }
        }
      }
      if (this.categoryName === this.common.ACKNOW_NOTIFI || this.categoryName === this.common.DIR_APP_COMP_NOTIFICATION) {
        const controlNames = ['reportLookupId', 'sendTypeLookupId'];
        for (const ctrl in this.agentEntryMasterService.clientMailIdForm.controls) {
          if (controlNames.indexOf(ctrl) > -1) {
            this.clearValidators(ctrl);
          }
        }
      }
    } else {
      this.agentEntryMasterService.clientMailIdForm.get('categoryLookupId')?.setValidators(Validators.required);
      this.agentEntryMasterService.clientMailIdForm.get('categoryLookupId')?.updateValueAndValidity();
    }
    this.agentEntryMasterService.clientMailIdForm.get('commonEmailDet')?.markAllAsTouched();
    // const formArray = this.agentEntryMasterService.clientMailIdForm.get('commonEmailDet') as UntypedFormArray;
    // const formGroup = formArray.controls[0] as UntypedFormGroup;
    // if (formGroup.get('destLookupId')?.value) {
    //   formGroup.get('destLookupId')?.clearValidators();
    //   formGroup.get('destLookupId')?.updateValueAndValidity();
    // } else {
    //   formGroup.get('destLookupId')?.setValidators(Validators.required);
    //   formGroup.get('destLookupId')?.updateValueAndValidity();
    // }
    // if (formGroup.get('contactData')?.value) {
    //   formGroup.get('contactData')?.clearValidators();
    //   formGroup.get('contactData')?.updateValueAndValidity();
    // } else {
    //   formGroup.get('contactData')?.setValidators(Validators.required);
    //   formGroup.get('contactData')?.updateValueAndValidity();
    // }
    this.errormsg = 'Please add atleast one Client-Email';
  }
  clear() {
    const controlNames = ['categoryLookupId', 'emailLookupId', 'reportLookupId', 'emailId'];
    for (const ctrl in this.agentEntryMasterService.clientMailIdForm.controls) {
      if (controlNames.indexOf(ctrl) > -1) {
        this.agentEntryMasterService.clientMailIdForm.get(ctrl).clearValidators();
        this.agentEntryMasterService.clientMailIdForm.get(ctrl).updateValueAndValidity();
      }
    }
    this.agentEntryMasterService.clientMailIdForm.reset();
    this.index = -1;
  }
  editDelete(data, mode) {
    this.index = this.agentEntryMasterService.clientEmailConfig.indexOf(data);
    if (mode === 'Edit') {
      this.getReportType(data.categoryLookupId);
      this.emailDetail = this.agentEntryMasterService.clientMailIdForm.get('commonEmail') as UntypedFormArray;
      // if (data.commonEmail) {
      //   for (let i = 1; data.commonEmail.length > i; i++) {
      //     this.emailDetail.push(this.agentEntryMasterService.initEmailForm());
      //   }
      //   this.agentEntryMasterService.formLength = this.emailDetail.length;
      // }
      this.tooltip = true;
      // setTimeout(() => {
      this.agentEntryMasterService.clientMailIdForm.patchValue({
        categoryLookupId: data.categoryLookupId,
        sendTypeLookupId: data.sendTypeLookupId,
        mailNotification: data.mailNotification,
        reportLookupId: data.reportLookupId,
        // commonEmailDet: data.commonEmailDet
      });
      // }, 100);
      const val = this.emailCategoryType.find(x => x.lookUpId === data.categoryLookupId);
      this.categoryName = val.lookUpName;
      // this.categoryChange(data.categoryLookupId);
      this.updateCatValue = data.categoryLookupId;
      this.updateReportValue = data.categoryLookupId;
      this.updateSendValue = data.sendTypeLookupId;
      this.emailData.next(this.common.CloneObject(data.commonEmailDet));
      this.notifyId = data.notifyId;
    }
    this.dt.reset();
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
  openConfirmDialog(data): void {
    this.data = data;
    this.dialogRef = this.dialog.open(this.clientFeeDocument, {
      width: '320px',
      disableClose: true
    });
  }
  dialogClose() {
    this.dialogRef.close();
  }
  deleteClientMail(data: any) {
    this.index = this.agentEntryMasterService.clientEmailConfig.indexOf(this.data);
    if (this.index > -1) {
      this.agentEntryMasterService.clientEmailConfig.splice(this.index, 1);
      this.showNotification('warn', 'Success Message', 'Deleted Successfully');
      this.agentEntryMasterService.clientMailIdForm.reset();
      // this.dialogRef.close();
    }
    this.dt.reset();
    this.index = -1;
  }
  showNotification(level: string, info: string, message: string) {
    this.sharedService.emitChange({
      severity: level,
      summary: info,
      detail: message
    });
  }
  public openDialog(data: any) {
    this.data = data;
    const popupData = {
      action: this.common.DELETECONFIRMATION,
      headerText: 'Confirmation',
      bodyText: 'Are you sure you want to delete this record?'
    };
    const dialogRef = this.dialog.open(CommonAlertsComponent, {
      width: '330px',
      data: popupData,
      disableClose: true
    });
    if (dialogRef) {
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const action = String(result.type);
          if (action === this.common.DELETECONFIRMATION) {
            this.deleteClientMail(this.data);
          }
        }
      });
    }
  }
}
