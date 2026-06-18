import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators, UntypedFormBuilder, UntypedFormArray } from '@angular/forms';
import { VerificationService } from 'src/app/common-methods/services/verification.service';
// import { DataTable, MessageService } from 'primeng/primeng';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { AgentEntryMasterService } from 'src/app/common-methods/services/agent-entry-master.service';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
// import { LazyLoadEvent } from 'primeng/api';
import { MessageService } from 'primeng/api';

@Component({
  standalone: false,
  selector: 'app-contact-remarks',
  templateUrl: './contact-remarks.component.html',
  styleUrls: ['./contact-remarks.component.css']
})
export class ContactRemarksComponent implements OnInit {
  // tslint:disable-next-line: no-use-before-declare
  itemperpage;
  ContactRemarkTransVm = new ReportContactRemarkVm();
  clientVendorsControl!: AutoCompleteDropDown;
  statusColorControl!: AutoCompleteDropDown;
  clientControl!: AutoCompleteDropDown;
  confirmationTypeCtrl!: AutoCompleteDropDown;
  contactRemarkFormgroup: UntypedFormGroup;
  statusFrmCtrl = new UntypedFormControl(false);
  // tslint:disable-next-line: no-use-before-declare
  ClientNew = new ClientNew();
  remarksListColumn = [
    { field: 'remarks', header: 'Remarks' },
    { field: 'statusName', header: 'Status Type' },
    { field: 'active', header: 'Active' }
  ];
  clientCtrl = new UntypedFormControl();
  clientOptions: Observable<string[]>;
  @ViewChild('clientTrigger') clientTrigger!: MatMenuTrigger;

  colorCtrl = new UntypedFormControl();
  colorOptions!: Observable<string[]>;
  @ViewChild('colorTrigger') colorTrigger!: MatMenuTrigger;

  compCtrl = new UntypedFormControl();
  compOptions!: Observable<string[]>;
  @ViewChild('compTrigger') compTrigger!: MatMenuTrigger;

  remarksCtrl = new UntypedFormControl();
  remarksOptions!: Observable<string[]>;
  @ViewChild('remarksTrigger') remarksTrigger!: MatMenuTrigger;

  statusCtrl = new UntypedFormControl();
  statusOptions!: Observable<string[]>;
  @ViewChild('statusTrigger') statusTrigger!: MatMenuTrigger;
  contactList: any[] = [];
  totalpages: number;
  currentPage = 1;
  tempCurrentPage = 1;
  userData: any;
  routePath = 'Client / Contact Remarks';
  // @ViewChild('global', { static: true }) global!: ElementRef;
  @ViewChild('dt') dt!: Table;
  @ViewChild('dt1') dt1!: Table;
  breadcrumbFlag = new BreadcrumbFlags();
  showContactRemarksDetail: boolean;
  isEdit: boolean;
  contactRemarkDetails: any;
  CompList: any[] = [];
  clientList: any[] = [];
  colorList: any[] = [];
  rowCount = 1;
  confirmTypeList: any[] = [];
  filterConfirmTypeList: any[] = [];
  removedArray: any[] = [];
  editFlag = false;
  screenAuth: any = {};
  cloneColorList: any[] = [];
  filterContactList: any[] = [];
  contactRemarksDisplayColumns: { field: string; header: string; }[];
  // tslint:disable-next-line: max-line-length
  constructor(private verification: VerificationService, private auth: AuthService,
    public formBuilder: UntypedFormBuilder, private agentEntryMasterService: AgentEntryMasterService,
    private screeningService: ScreeningService, private common: CommonService, public verificationService: VerificationService,
    public dialog: MatDialog, private message: MessageService, private router: Router,) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.screenAuth = this.auth.getScreenAuth(this.router.url);
    this.initFormGroup();
    this.getContactRemarksDetailList();
    this.getContactRemarksCompNameList();
    this.itemperpage = 10;
  }

  initFormGroup() {
    this.contactRemarkFormgroup = this.formBuilder.group({
      contactRemarkId: new UntypedFormControl(0),
      compId: new UntypedFormControl('', Validators.required),
      compName: new UntypedFormControl(''),
      loggedIn: new UntypedFormControl(this.userData.userId),
      clientId: new UntypedFormControl('', Validators.required),
      clientName: new UntypedFormControl(),
      colorStatusLookUpId: new UntypedFormControl('', Validators.required),
      colorStatusName: new UntypedFormControl(),
      screeningStatusId1: new UntypedFormControl('', Validators.required),
      statusName1: new UntypedFormControl(''),
      active: new UntypedFormControl(true),
      statusFlag: new UntypedFormControl(false),
      deleteFlag: new UntypedFormControl(false),
      contactRemarkTrans: this.formBuilder.array([this.initRemarksform()]),
    });
    this.initautoCompleteCtrl();
  }
  initRemarksform(): UntypedFormGroup {
    return this.formBuilder.group({
      contactRemarkTransId: new UntypedFormControl(0),
      contactRemarkId: new UntypedFormControl(0),
      screeningStatusId: new UntypedFormControl(''),
      statusName: new UntypedFormControl(''),
      remarks: new UntypedFormControl('', Validators.required),
      active: new UntypedFormControl(true),
      deleteFlag: new UntypedFormControl(false)
    });
  }
  getformgroup() {
    return (this.contactRemarkFormgroup.get('contactRemarkTrans') as UntypedFormArray).controls;
  }
  statusChange(e: any) {
    if (e === false) {
      this.contactRemarkFormgroup.get('screeningStatusId')?.setValue('');
      this.contactRemarkFormgroup.get('compId')?.clearValidators();
      this.contactRemarkFormgroup.get('compId')?.updateValueAndValidity();
      this.contactRemarkFormgroup.get('screeningStatusId')?.clearValidators();
      this.contactRemarkFormgroup.get('screeningStatusId')?.updateValueAndValidity();
      this.clientVendorsControl =
        new AutoCompleteDropDown('Component Name', 'compId', 'compId', 'compName', this.CompList,
          '', this.contactRemarkFormgroup, false, false, false);
    } else {
      this.contactRemarkFormgroup.get('clientId')?.setValue('');
      this.contactRemarkFormgroup.get('colorStatusLookUpId')?.setValue('');
      this.clientVendorsControl =
        new AutoCompleteDropDown('Component Name', 'compId', 'compId', 'compName', this.CompList,
          '', this.contactRemarkFormgroup, false, false, true);
      this.contactRemarkFormgroup.get('clientId')?.clearValidators();
      this.contactRemarkFormgroup.get('clientId')?.updateValueAndValidity();
      this.contactRemarkFormgroup.get('colorStatusLookUpId')?.clearValidators();
      this.contactRemarkFormgroup.get('colorStatusLookUpId')?.updateValueAndValidity();
      const val = this.contactRemarkFormgroup.get('contactRemarkTrans') as UntypedFormArray;
      const frmGroup = val.controls[(this.contactRemarkFormgroup.get('contactRemarkTrans') as UntypedFormArray).controls.length - 1] as UntypedFormGroup;
      frmGroup.get('remarks')?.clearValidators();
      frmGroup.get('remarks')?.updateValueAndValidity();
    }
  }
  statusFrmChange(e: any) {
    this.dt.reset();
    if (e === true) {
      const listContact: any[] = [];
      const contactList = this.filterContactList.filter(x => x.statusFlag === true);
      contactList.forEach(element => {
        const remarksType: ReportContactRemarkVm = {
          contactRemarkId: element.contactRemarkId,
          statusFlag: element.statusFlag,
          compId: element.compId,
          compName: element.compName,
          clientId: element.clientId,
          clientName: element.clientName,
          colorStatusLookUpId: element.colorStatusLookUpId,
          colorStatusName: element.colorStatusName,
          active: element.active,
          deleteFlag: element.deleteFlag,
          loggedIn: element.loggedIn,
          contactRemarkTrans: element.contactRemarkTrans,
          contactRemarkTransId: element.contactRemarkTrans[0].contactRemarkTransId,
          screeningStatusId: element.contactRemarkTrans[0].screeningStatusId,
          statusName: element.contactRemarkTrans[0].statusName,
          remarks: element.contactRemarkTrans[0].remarks
        }
        listContact.push(remarksType);
      });
      this.contactList = listContact;
      this.contactRemarksDisplayColumns = [
        { field: 'compName', header: 'Component Name' },
        { field: 'statusName', header: 'Status Type' },
        { field: 'remarks', header: 'Remarks' },
      ];
    } else {
      this.contactList = this.filterContactList.filter(x => x.statusFlag === false);
      this.contactRemarksDisplayColumns = [
        { field: 'clientName', header: 'Client Name' },
        { field: 'colorStatusName', header: 'Status Color' },
        { field: 'compName', header: 'Component Name' }
      ];
    }
  }
  bindtNames(e, type) {
    if (type === 'client') {
      const cName = this.clientList.filter(x => x.clientId === e);
      this.contactRemarkFormgroup.get('clientName')?.setValue(cName[0].clientName);
      // if (e > 0) {
      //   this.colorList = this.cloneColorList.filter(x => x.contactId === e);
      // } else {
      this.colorList = this.cloneColorList;
      // }
    }
    if (type === 'comp') {
      const compName = this.CompList.filter(x => x.compId === e);
      this.contactRemarkFormgroup.get('compName')?.setValue(compName[0].compName);

      if (this.contactRemarkFormgroup.get('statusFlag')?.value === true &&
        this.contactRemarkFormgroup.get('screeningStatusId1')?.value > 0) {
        const trueList = this.contactList.filter(x => x.statusFlag === true);
        if (trueList.length > 0) {
          const dupList: any[] = [];
          trueList.forEach(element => {
            const dupValue = element.contactRemarkTrans.filter(m => m.screeningStatusId ===
              this.contactRemarkFormgroup.get('screeningStatusId1')?.value && element.compId === e);
            if (dupValue.length > 0) {
              dupList.push(dupValue[0]);
            }
          });
          if (dupList.length > 0) {
            this.showTopCenter('warn', 'Alert Message', 'This Component is Already exists for this Status');
          }
        }
      }

    }
    if (type === 'color') {
      const csName = this.colorList.filter(x => x.lookUpId === e);
      this.contactRemarkFormgroup.get('colorStatusName')?.setValue(csName[0].lookUpName);
    }
    if (type === 'confirm') {
      const ctName = this.confirmTypeList.filter(x => x.screeningStatusId === e);
      this.contactRemarkFormgroup.get('statusName1')?.setValue(ctName[0].statusName);

      if (this.contactRemarkFormgroup.get('statusFlag')?.value === true &&
        this.contactRemarkFormgroup.get('compId')?.value > 0) {
        const trueList = this.contactList.filter(x => x.statusFlag === true && x.compId ===
          this.contactRemarkFormgroup.get('compId')?.value);
        if (trueList.length > 0) {
          const dupList: any[] = [];
          trueList.forEach(element => {
            const dupValue = element.contactRemarkTrans.filter(m => m.screeningStatusId === e);
            if (dupValue.length > 0) {
              dupList.push(dupValue[0]);
            }
          });
          if (dupList.length > 0) {
            this.showTopCenter('warn', 'Alert Message', 'This Status is Already exists for this Component');
          }
        }
      }

    }
    if (type === 'confirm') {
      const ctName = this.confirmTypeList.filter(x => x.screeningStatusId === e);
      this.contactRemarkFormgroup.get('statusName1')?.setValue(ctName[0].statusName);
    }
    if (type === 'status') {
      const ctName = this.confirmTypeList.filter(x => x.screeningStatusId === e);
      const val = this.contactRemarkFormgroup.get('contactRemarkTrans') as UntypedFormArray;
      const frmGroup = val.controls[0] as UntypedFormGroup;
      frmGroup.get('statusName')?.setValue(ctName[0].statusName);
    }
    this.initautoCompleteCtrl();
  }
  addControl() {
    if (this.contactRemarkFormgroup.get('contactRemarkTrans')?.valid) {
      const addMisc = this.contactRemarkFormgroup.get('contactRemarkTrans') as UntypedFormArray;
      addMisc.push(this.initRemarksform());
      this.rowCount = (this.contactRemarkFormgroup.get('contactRemarkTrans') as UntypedFormArray).controls.length;
      this.editFlag = false;
    } else {
      this.contactRemarkFormgroup.get('contactRemarkTrans')?.markAllAsTouched();
    }
  }
  removeControl(index, data) {
    const cArray: any[] = [];
    if (index > -1) {
      const removeMisc = this.contactRemarkFormgroup.get('contactRemarkTrans') as UntypedFormArray;
      if (removeMisc.value.length > 1) {
        // removeMisc.value.forEach((element, i) => {
        //   if (element.contactRemarkTransId === 0) {
        //     removeMisc.removeAt(index);
        //   } else {
        if (index > -1) {
          if (data.value.contactRemarkTransId > 0) {
            data.value.deleteFlag = true;
            cArray.push(data.value);
            this.removedArray.push(cArray[0]);
          }
          removeMisc.removeAt(index);
        }
        //   }
        // });
        this.rowCount = (this.contactRemarkFormgroup.get('contactRemarkTrans') as UntypedFormArray).controls.length === 0 ? 1 :
          (this.contactRemarkFormgroup.get('contactRemarkTrans') as UntypedFormArray).controls.length;
      } else {
        this.showTopCenter('warn', 'Alert Message', 'Atleast 1 row has been required');
      }
    }
  }
  initautoCompleteCtrl() {
    this.clientControl =
      new AutoCompleteDropDown('Client Name', 'clientId', 'clientId', 'clientName', this.clientList,
        '', this.contactRemarkFormgroup, false, false, true);
    this.clientVendorsControl =
      new AutoCompleteDropDown('Component Name', 'compId', 'compId', 'compName', this.CompList,
        '', this.contactRemarkFormgroup, false, false, false);
    this.statusColorControl =
      new AutoCompleteDropDown('Status Colour', 'colorStatusLookUpId', 'lookUpId', 'lookUpName', this.colorList,
        '', this.contactRemarkFormgroup, false, false, true);
    this.confirmationTypeCtrl =
      new AutoCompleteDropDown('Status Type', 'screeningStatusId1', 'screeningStatusId', 'statusName', this.confirmTypeList,
        '', this.contactRemarkFormgroup, false, false, true);
  }

  getContactRemarksDetailList() {
    this.verification.getContactRemarksDetailList(0).subscribe(res => {
      if (res) {
        // this.contactList = res;
        this.filterContactList = res;
        this.TblAutoFilters();
        this.statusFrmChange(false);
      }
    });
  }
  getContactRemarksCompNameList() {
    this.agentEntryMasterService.getContactRemarksCompNameList().subscribe(res => {
      if (res) {
        this.CompList = res.componentRemarksVm;
        this.clientList = res.clientRemarksVm;
        const clientsObj: ClientNew = {
          active: true,
          clientId: 0,
          clientName: 'All Client'
        };
        this.clientList.push(clientsObj);
        // this.cloneColorList = this.common.CloneObject(res.lookupVm);
        this.cloneColorList = Array.from(this.common.CloneObject(res.lookupVm).
          reduce((m, t) => m.set(t.lookUpName, t), new Map()).values());

        this.confirmTypeList = res.status;
        this.initautoCompleteCtrl();
        // this.clientList.splice(0, 0, {
        //   clientId: 0, clientName: 'All Client',
        //   active: true,
        // });

      }
    });
  }
  // from close
  closeContactRemarksForm() {
    this.breadcrumbFlag.btnSave = false;
    this.breadcrumbFlag.btnBack = false;
    this.breadcrumbFlag.btnReset = false;
    this.breadcrumbFlag.btnAdd = true;
    this.breadcrumbFlag.btnResetTbl = true;
    this.contactRemarkFormgroup.reset();
    this.contactRemarkFormgroup.get('statusFlag')?.enable();
    this.contactRemarkFormgroup.get('loggedIn')?.setValue(this.userData.userId);
    this.showContactRemarksDetail = !this.showContactRemarksDetail;
    this.isEdit = false;
    this.statusFrmCtrl.setValue(false);
    this.getContactRemarksDetailList();
  }
  // form reset
  resetForm() {
    if (this.contactRemarkFormgroup.controls.contactRemarkId.value > 0) {
      this.contactRemarkFormgroup.patchValue({
        remarks: this.common.tempResetData.remarks,
        compId: this.common.tempResetData.compId,
        active: this.common.tempResetData.active,
        screeningRptContactRemarksId: this.common.tempResetData.screeningRptContactRemarksId
        // displayOrder: this.common.tempResetData.displayOrder,
      });
    } else {
      this.contactRemarkFormgroup.controls.contactRemarkId.setValue(0);
      const checkFlag = this.contactRemarkFormgroup.get('statusFlag')?.value;
      this.contactRemarkFormgroup.reset();
      this.contactRemarkFormgroup.get('statusFlag')?.setValue(checkFlag);
      this.contactRemarkFormgroup.get('loggedIn')?.setValue(this.userData.userId);
      this.contactRemarkFormgroup.markAsPristine();
      // this.initFormGroup();
    }
  }
  validationRemarks() {
    const controlNames1 = ['compId', 'screeningStatusId1'];
    const controlNames2 = ['clientId', 'colorStatusLookUpId'];
    if (this.contactRemarkFormgroup.get('statusFlag')?.value === true) {
      // tslint:disable-next-line:forin
      for (const ctrl in this.contactRemarkFormgroup.controls) {
        if (controlNames1.indexOf(ctrl) > -1) {
          if (!this.contactRemarkFormgroup.get(ctrl).value) {
            this.contactRemarkFormgroup.get(ctrl).setValidators(Validators.required);
            this.contactRemarkFormgroup.get(ctrl).markAsTouched();
            this.contactRemarkFormgroup.get(ctrl).updateValueAndValidity();
          } else {
            this.contactRemarkFormgroup.get(ctrl).clearValidators();
            this.contactRemarkFormgroup.get(ctrl).updateValueAndValidity();
          }
        }
        if (controlNames2.indexOf(ctrl) > -1) {
          this.contactRemarkFormgroup.get(ctrl).clearValidators();
          this.contactRemarkFormgroup.get(ctrl).updateValueAndValidity();
        }
      }
    } else {
      // tslint:disable-next-line:forin
      for (const ctrl in this.contactRemarkFormgroup.controls) {
        if (controlNames2.indexOf(ctrl) > -1) {
          if (!this.contactRemarkFormgroup.get(ctrl).value) {
            this.contactRemarkFormgroup.get(ctrl).setValidators(Validators.required);
            this.contactRemarkFormgroup.get(ctrl).markAsTouched();
            this.contactRemarkFormgroup.get(ctrl).updateValueAndValidity();
          } else {
            this.contactRemarkFormgroup.get(ctrl).clearValidators();
            this.contactRemarkFormgroup.get(ctrl).updateValueAndValidity();
          }
        }
        if (controlNames1.indexOf(ctrl) > -1) {
          this.contactRemarkFormgroup.get(ctrl).clearValidators();
          this.contactRemarkFormgroup.get(ctrl).updateValueAndValidity();
        }
      }
    }

    const val = this.contactRemarkFormgroup.get('contactRemarkTrans') as UntypedFormArray;
    const frmGroup = val.controls[(this.contactRemarkFormgroup.get('contactRemarkTrans') as UntypedFormArray).controls.length - 1] as UntypedFormGroup;
    if (this.contactRemarkFormgroup.get('statusFlag')?.value === false) {
      if (!frmGroup.get('remarks')?.value) {
        frmGroup.get('remarks')?.setValidators(Validators.required);
        frmGroup.get('remarks')?.markAsTouched();
        frmGroup.get('remarks')?.updateValueAndValidity();
      } else {
        frmGroup.get('remarks')?.clearValidators();
        frmGroup.get('remarks')?.updateValueAndValidity();
      }
    } else {
      frmGroup.get('screeningStatusId')?.clearValidators();
      frmGroup.get('screeningStatusId')?.updateValueAndValidity();
    }
  }
  // save
  saveContactRemarksDetail() {
    this.validationRemarks();
    if (this.contactRemarkFormgroup.valid) {
      const remarks: any[] = [];
      this.ContactRemarkTransVm = this.contactRemarkFormgroup.value;
      this.ContactRemarkTransVm.statusFlag = this.contactRemarkFormgroup.controls.statusFlag.value;
      if (this.ContactRemarkTransVm.statusFlag === true) {
        this.ContactRemarkTransVm.contactRemarkTrans[0].screeningStatusId = this.contactRemarkFormgroup.controls.screeningStatusId1.value;
        this.ContactRemarkTransVm.contactRemarkTrans[0].statusName = this.contactRemarkFormgroup.controls.statusName1.value;
        this.contactRemarkFormgroup.controls.screeningStatusId1.setValue(''),
          this.contactRemarkFormgroup.controls.statusName1.setValue('');
      }
      if (this.contactRemarkFormgroup.get('statusFlag')?.value === true) {
        this.ContactRemarkTransVm.statusFlag = this.contactRemarkFormgroup.get('statusFlag')?.value;
      } else {
        this.ContactRemarkTransVm.statusFlag = this.contactRemarkFormgroup.get('statusFlag')?.value;
      }
      if (this.removedArray.length > 0) {
        this.removedArray.forEach((element, i) => {
          remarks.push(element);
          this.ContactRemarkTransVm.contactRemarkTrans.push(remarks[i]);
        });
      }
      this.verification.saveContactRemarksDetail(this.ContactRemarkTransVm).subscribe(res => {
        if (res) {
          if (this.contactRemarkFormgroup.controls.contactRemarkId.value > 0) {
            this.showTopCenter('success', 'Success Message', 'Updated Successfully');

          } else {
            this.showTopCenter('success', 'Success Message', 'Saved Successfully');
          }
          // tslint:disable-next-line: no-use-before-declare
          this.ContactRemarkTransVm = new ReportContactRemarkVm();
          this.removedArray = [];
          this.getContactRemarksDetailList();
          this.closeContactRemarksForm();
        }
      });
    }
  }

  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }

  editContactRemarksDetail(screeningRptContactRemarksId, data) {
    this.initFormGroup();
    this.breadcrumbFlag.toolTip = 'Update';
    this.breadcrumbFlag.btnSave = true;
    this.breadcrumbFlag.btnBack = true;
    this.breadcrumbFlag.btnReset = true;
    this.breadcrumbFlag.btnAdd = false;
    this.breadcrumbFlag.btnResetTbl = false;
    if (data.clientId > 0 || data.statusFlag === true) {
      this.colorList = this.cloneColorList.filter(x => x.contactId === data.clientId);
    } else {
      this.colorList = this.cloneColorList;
    }
    this.initautoCompleteCtrl();
    data.contactRemarkTrans.forEach(element => {
      const addMisc = this.contactRemarkFormgroup.get('contactRemarkTrans') as UntypedFormArray;
      addMisc.push(this.initRemarksform());
      this.contactRemarkFormgroup.patchValue(data);
    });
    if (data.statusFlag === true) {
      if (data.contactRemarkTrans.length === 1) {
        this.contactRemarkFormgroup.controls.screeningStatusId1.setValue(data.contactRemarkTrans[0].screeningStatusId);
        this.contactRemarkFormgroup.controls.statusName1.setValue(data.contactRemarkTrans[0].status);
      }
    }
    this.bindtNames(data.clientId, 'client');
    this.rowCount = (this.contactRemarkFormgroup.get('contactRemarkTrans') as UntypedFormArray).controls.length;
    (this.contactRemarkFormgroup.get('contactRemarkTrans') as UntypedFormArray).controls.pop();
    this.contactRemarkFormgroup.controls.loggedIn.setValue(this.userData.userId);
    this.contactRemarkFormgroup.get('statusFlag')?.disable();
    this.common.tempResetData = data;
    this.editFlag = true;
    this.showContactRemarksDetail = !this.showContactRemarksDetail;
    this.isEdit = true;
    this.contactRemarkFormgroup.value.statusFlag = this.contactRemarkFormgroup.controls.statusFlag
      .value;
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
            this.deleteContactRemarksDetail(data);
          }
        }
      });
    }
  }
  // delete
  deleteContactRemarksDetail(ContactRemarkId: any) {
    this.verification.deleteContactRemarksDetail(ContactRemarkId, this.userData.userId).subscribe(resp => {
      if (resp) {
        this.showTopCenter('success', 'Success Message', 'Deleted Successfully');
        this.getContactRemarksDetailList();
        this.statusFrmCtrl.setValue(false);
      }
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
  openContactRemarksForm() {
    this.breadcrumbFlag.toolTip = 'Save';
    this.breadcrumbFlag.btnSave = true;
    this.breadcrumbFlag.btnBack = true;
    this.breadcrumbFlag.btnReset = true;
    this.breadcrumbFlag.btnAdd = false;
    this.breadcrumbFlag.btnResetTbl = false;
    this.breadcrumbFlag.btnSaveDisabled = false;
    this.initFormGroup();
    this.showContactRemarksDetail = !this.showContactRemarksDetail;
    this.isEdit = false;
    this.rowCount = 1;
  }
  resetTable() {

  }
  isExist(value: any) {
    const isExist = this.contactList.filter(x => x.remarks === value && x.compId === this.contactRemarkFormgroup.get('compId')?.value &&
      x.clientId === this.contactRemarkFormgroup.get('clientId')?.value &&
      x.lookUpId === this.contactRemarkFormgroup.get('lookUpId')?.value);
    if (isExist.length > 0) {
      this.contactRemarkFormgroup.get('remarks')?.setValue('');
      this.showTopCenter('warn', 'Exist', value + ' ' + 'already exist in ' + 'Remarks List');
      return;
    }
  }
  // this.confirmationTypeCtrl =
  //   new AutoCompleteDropDown('Status Type', frmGroup.controls.screeningStatusId, 'screeningStatusId', 'statusName', this.confirmTypeList,
  //     '', this.contactRemarkFormgroup, false, false, true);
  setCodeItems(value: any) {
    if (!value) { this.assigncodeResourceCopy(); }
    if (value) {
      this.filterConfirmTypeList = Object.assign([], this.confirmTypeList).filter(
        item => ((item.statusName.toLowerCase().indexOf(value.toLowerCase()) > -1)));
    }
  }
  assigncodeResourceCopy() {
    this.filterConfirmTypeList = Object.assign([], this.confirmTypeList);
  }

  codekeyUpFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        const data = this.filterConfirmTypeList.filter(e =>
          e.statusName.toLowerCase() === value.toLowerCase());
      }
    }
  }
  get displayCodeFn() {
    const dataNew = (data) => {
      if (data == null || data === undefined || data === '') {
        return null;
      } else {
        data = this.confirmTypeList.find(x => x.screeningStatusId === data);
        if (data === undefined) {
          return null;
        }
        return data.statusName;
      }
    };
    return dataNew;
  }
  private TblAutoFilters(): void {
    this.clientOptions = this.clientCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.contactList.map(x => x.clientName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.colorOptions = this.colorCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.contactList.map(x => x.colorStatusName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.compOptions = this.compCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.contactList.map(x => x.compName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
  }
  showall() {
    if (this.contactList.length > 0) {
      this.itemperpage = this.contactList.length;
    }
  }
  showpg() {
    this.itemperpage = 10;
  }
}

export class ReportContactRemarkVm {
  contactRemarkId: number;
  statusFlag: boolean;
  compId: number;
  compName: string;
  clientId: number;
  clientName: string;
  colorStatusLookUpId: number;
  colorStatusName: string;
  active: boolean;
  deleteFlag: boolean;
  loggedIn: number;
  contactRemarkTrans: ContactRemarkTransVm[] = [];
  contactRemarkTransId: number;
  screeningStatusId: number;
  statusName: string;
  remarks: string;
}
export class ContactRemarkTransVm {
  contactRemarkTransId: number;
  contactRemarkId: number;
  screeningStatusId: number;
  statusName: string;
  remarks: string;
  active: boolean;
  deleteFlag: boolean;
}
export class ClientNew {
  active: boolean;
  clientId: any;
  clientName: string;
}
