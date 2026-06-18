import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import {  UntypedFormGroup, Validators } from '@angular/forms';
import { VerificationService } from 'src/app/common-methods/services/verification.service';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { AgentEntryMasterService } from 'src/app/common-methods/services/agent-entry-master.service';
import {  UntypedFormControl } from '@angular/forms';

@Component({
  standalone: false,
  selector: 'app-additional-fees',
  templateUrl: './additional-fees.component.html',
  styleUrls: ['./additional-fees.component.css']
})
export class AdditionalFeesComponent implements OnInit, OnDestroy {
  private insuffRaisedSub!: Subscription;
  dateMax = new Date();
  editCompFlag: boolean = false;
  @Input() additionalFeeList: any;
  @Input() verificationForm: any;
  additionalFeeForm!: UntypedFormGroup;
  compCurrencyForm!: UntypedFormGroup;
  cols = [
    { field: 'countryName', header: 'Country Type' },
    { field: 'feeDate', header: 'Fee Date' },
    { field: 'fee', header: 'Fee Amount' },
    { field: 'feeName', header: 'Fee Type' },
    { field: 'currencyName', header: 'Currency Type' },
    { field: 'feeDescription', header: 'Comments' },
  ];
  frozenCols = [
    { field: 'action', header: 'Action' },
  ];
  currentPage = 1;
  tempCurrentPage = 1;
  totalpages!: number;
  @ViewChild('invitetab') mdtab!: Table;
  country: any;
  feeTypeList: any;
  userData: any;
  compCurrencyList: any[] = [];
  closedFlag = false;
  screenAuth: any = {};
  // dateMax = new Date();
  // editCompFlag: boolean = false;
  // countryTypeControls: any;
  // CurrencyTypeControls: any;
  compCurrencyControls!: AutoCompleteDropDown;
  CurrencyTypeControls!: AutoCompleteDropDown;
  countryTypeControls!: AutoCompleteDropDown;

  constructor(public verificationService: VerificationService, public authService: AuthService, public master: MasterService,
    private message: MessageService, public dialog: MatDialog, public commonService: CommonService,
    private agentEntryMasterService: AgentEntryMasterService) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.screenAuth = this.authService.getScreenAuth(this.commonService.VERIFICATION_ROUTER);
    this.feeTypeList = this.verificationForm.value.verificationTransBindDet.feesType;
    this.country = this.getCountryId(this.verificationForm
      .value?.verificationComponentDet?.component?.[0]?.screeningComponentInfo?.currencyId);
    this.getCompCurrencyList();
    this.initAdditionialFeeForm(true);
    this.getFeeTypes(true);
    this.closedFlag = this.verificationService.closedCheck;
    this.insuffRaisedSub = this.verificationForm.get('insuffRaisedFlag')!.valueChanges.subscribe((val: boolean) => {
      const ctrl = this.additionalFeeForm.get('feeApprovalFlag');
      val ? ctrl?.disable() : ctrl?.enable();
    });
    if (this.verificationForm.get('insuffRaisedFlag')?.value === true) {
      this.additionalFeeForm.get('feeApprovalFlag')?.disable();
    }
  }

  ngOnDestroy() {
    this.insuffRaisedSub?.unsubscribe();
  }
  getCompCurrencyList() {
    this.agentEntryMasterService.getCurrencyDetails().subscribe(res => {
      if (res) {
        this.compCurrencyList = res;
        this.compCurrencyList.forEach(element => {
          element.currencyShortName = element.countryName + ' - ' + element.currencyShortName;
        });
        this.compCurrencyControls = new AutoCompleteDropDown('Component Currency', 'compCurrencyType', 'currencyId', 'currencyShortName',
          this.compCurrencyList, '', this.compCurrencyForm, false, false, true);
      }
    });
  }
  getCountryId(val: any) {
    return this.verificationForm.value.verificationTransBindDet.countryType.find(x => x.currencyId === val);
  }
  changeCountry(value: any) {
    const currency = this.verificationForm.value.verificationTransBindDet.currencyType.find(x => x.countryId === value);
    this.additionalFeeForm.get('currencyType')?.setValue(currency.currencyId);
  }
  initAdditionialFeeForm(CurrencyFlag: any) {
    this.additionalFeeForm = new UntypedFormGroup({
      screeningCompId: new UntypedFormControl(this.verificationService.tempData.screeningCompId),
      countryType: new UntypedFormControl(CurrencyFlag != true ? (this.verificationForm
        .value?.verificationComponentDet?.component?.[0]?.screeningComponentInfo?.currencyId ? this.country?.countryId : 0) : 0),
      currencyName: new UntypedFormControl(),
      fee: new UntypedFormControl('', (this.verificationService.tempData.verificationScreeningDet.manualFileSubmissionFlag !== true) ? Validators.min(1) : null),
      feeDate: new UntypedFormControl(''),
      feeType: new UntypedFormControl(),
      feeName: new UntypedFormControl(),
      currencyType: new UntypedFormControl({
        value: this.verificationForm.value?.verificationComponentDet?.component?.[0]
          ?.screeningComponentInfo?.currencyId ?? 0, disabled: true
      }),
      feeDescription: new UntypedFormControl(),
      createdUserId: new UntypedFormControl(this.authService.userdata.userId),
      screeningCompFeeId: new UntypedFormControl(0),
      feeApprovalFlag: new UntypedFormControl(false),
      funcEntity: new UntypedFormControl(this.commonService.funcEntity),
      modifyAdditionalFeeFlag: new UntypedFormControl(),
      modifyComponentFeeFlag: new UntypedFormControl(),
    });
    this.compCurrencyForm = new UntypedFormGroup({
      compCurrencyType: new UntypedFormControl(CurrencyFlag != true
        ? (this.verificationForm.value?.verificationComponentDet?.component?.[0]?.screeningComponentInfo?.currencyId ?? 0)
        : 0)
    });
    this.compCurrencyControls = new AutoCompleteDropDown('Component Currency', 'compCurrencyType', 'currencyId', 'currencyShortName',
      this.compCurrencyList, '', this.compCurrencyForm, false, false, true);
    this.countryTypeControls = new AutoCompleteDropDown('Country Type', 'countryType', 'countryId', 'countryName',
      this.verificationForm.value.verificationTransBindDet.countryType, '', this.additionalFeeForm, false, false, true);
    this.CurrencyTypeControls = new AutoCompleteDropDown('Currency Type', 'currencyType', 'currencyId', 'currencyShortName',
      this.verificationForm.value.verificationTransBindDet.currencyType, '', this.additionalFeeForm, false, true, true);
  }
  resetForm() {
    this.additionalFeeForm.reset();
    this.initAdditionialFeeForm(false);
  }
  saveCurrency() {
    if (this.compCurrencyForm.get('compCurrencyType')?.valid) {
      this.verificationService.UpdateScreeningComponentCurrency(this.verificationService.tempData.screeningCompId,
        this.compCurrencyForm.getRawValue().compCurrencyType, this.authService.userdata.userId).subscribe(res => {
          if ((res.message.toLowerCase()).includes('success')) {
            this.showTopCenter('success', 'Success Message', 'Currency Updated Successfully');
            this.verificationForm.getRawValue().verificationComponentDet.component[0].screeningComponentInfo.compFeeFlag = res.success;
            this.getFeeTypes(false);
            this.verificationForm.getRawValue().verificationComponentDet.component[0].screeningComponentInfo.currencyId
              = this.compCurrencyForm.getRawValue().compCurrencyType;
            const val = this.getCountryId(this.compCurrencyForm.getRawValue().compCurrencyType).countryId;
            this.additionalFeeForm.get('countryType')?.setValue(val);
            this.changeCountry(val);
          }
        });
    }
  }
  saveAddFee() {

    if (this.verificationService.tempData.verificationScreeningDet.manualFileSubmissionFlag !== true) {
      this.additionalFeeForm.get('feeDate')?.setValidators(Validators.required);
      this.additionalFeeForm.get('feeDate')?.updateValueAndValidity();
      this.additionalFeeForm.get('fee')?.setValidators(Validators.required);
      this.additionalFeeForm.get('fee')?.updateValueAndValidity();
    }

    this.verificationService.FeeApprovalFlag = this.additionalFeeForm.get('feeApprovalFlag')?.value;
    this.additionalFeeForm.get('modifyAdditionalFeeFlag')?.setValue(this.commonService.modifyAdditionalFeeFlag);
    this.additionalFeeForm.get('modifyComponentFeeFlag')?.setValue(this.commonService.modifyComponentFeeFlag);
    this.additionalFeeForm.get('createdUserId')?.setValue(this.authService.userdata.userId);
    this.additionalFeeForm.get('funcEntity')?.setValue(this.commonService.funcEntity);
    if (this.additionalFeeForm.valid && (this.additionalFeeForm.value.feeDate && this.additionalFeeForm.get('feeDate')?.valid ||
      this.additionalFeeForm.value.fee && this.additionalFeeForm.get('fee')?.valid)) {
      if (this.additionalFeeForm.get('fee')?.value == null || this.additionalFeeForm.get('fee')?.value == "")
        this.additionalFeeForm.get('fee')?.setValue(0)

      this.verificationService.addAdditionalFee(this.additionalFeeForm.getRawValue()).subscribe(res => {
        if (res.success) {
          this.editCompFlag = false;
          if (this.additionalFeeForm.getRawValue().feeApprovalFlag === true) {
            this.verificationForm.get('insuffRaisedFlag')?.setValue(true);
            if (this.verificationForm.get('showGenrateResponse')?.value === true) {
              this.verificationForm.get('showGenrateResponse')?.setValue(false);
            }
          }
          // added by Niranjana //
          // if (this.additionalFeeForm.getRawValue().feeApprovalFlag === true) {
          //   this.sendClientFeeEmail();
          // } else {
          this.showTopCenter('success', 'Success Message', 'Updated Successfully');
        }
        this.commonService.changeLastUpdatedUser(this.verificationForm);
        this.getAdditionalFeesByScreeningCompId(this.additionalFeeForm.value.screeningCompId);
        this.resetForm();
        // }
      }, err => { }, () => {
      });
    }
  }
  sendClientFeeEmail() {
    // const emailTemplate = this.commonService.mailTemplates.find(x => x.templateName.toLowerCase() ===
    //   this.commonService.CLIENT_FEE_REQ.toLowerCase()).htmlTemplateBody;
    // const mailTemp = new MailTemplate();
    // mailTemp.clientRefID = this.verificationForm.get('clientRefNo')?.value;
    // mailTemp.verificationId = this.verificationForm.get('verificationId')?.value;
    // const name = (this.verificationForm.get('screeningCandidateDet.firstName')?.value ?
    //   this.verificationForm.get('screeningCandidateDet.firstName')?.value : '') + ' ' + (this.verificationForm.
    //     get('screeningCandidateDet.middleName').value ? this.verificationForm.get('screeningCandidateDet.middleName')?.value : '') + ' ' +
    //   (this.verificationForm.get('screeningCandidateDet.lastName')?.value ? this.verificationForm
    //     .get('screeningCandidateDet.lastName')?.value : '') + ' ';
    // mailTemp.candidateName = name;
    // mailTemp.component = this.verificationForm.value.responseDocument.componentName;
    // mailTemp.funcEntity = this.commonService.funcEntity;
    // mailTemp.fees = this.additionalFeeForm.getRawValue().fee;
    // mailTemp.remarks = this.additionalFeeForm.getRawValue().feeDescription;
    // const mailData = new MailData();
    // mailData.htmlTemplate = this.commonService.mailTemp(emailTemplate, mailTemp);
    // this.master.sendEmail(mailData).subscribe(resp => {
    //   this.showTopCenter('success', 'Success Message', resp.message);
    // }, errmsg => {
    //   console.log(errmsg);
    // }
    // );
  }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }
  edit(rowData: any) {
    this.commonService.goToTop();
    if (rowData.feeName !== this.commonService.ADDI_FEE) {
      this.feeTypeList = this.verificationForm.value.verificationTransBindDet.feesType.filter(x => x.lookUpName
        !== this.commonService.ADDI_FEE);
      this.additionalFeeForm.get('countryType')?.disable();
      if (this.commonService.modifyComponentFeeFlag == true) {
        this.additionalFeeForm.get('countryType')?.enable();
      }
      this.compCurrencyForm.getRawValue().compCurrencyType
    }
    if (rowData.feeName == this.commonService.COMPON_FEE) {
      this.editCompFlag = true;
    } else {
      this.editCompFlag = false
    }
    rowData.feeDate = this.commonService.getTimezoneOffset(rowData.feeDate, false);
    this.additionalFeeForm.patchValue(rowData);
  }
  public openDialog(data: any) {
    const popupData = {
      action: this.commonService.DELETECONFIRMATION,
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
            this.deleteAdditionalFee(data);
          }
        }
      });
    }
  }
  // delete
  deleteAdditionalFee(data: any) {
    this.verificationService.deleteAdditionalFee(data.screeningCompFeeId, this.authService.userdata.userId).subscribe(resp => {
      if (resp.success) {
        this.showTopCenter('warn', 'Success Message', 'Deleted Successfully');
        this.getAdditionalFeesByScreeningCompId(data.screeningCompId);
        this.initAdditionialFeeForm(true);
        this.commonService.goToTop();
      }
    });
  }
  navigateNxtPrevPage(pageNo:any, rows:any) {
    this.currentPage = pageNo / rows;
    this.tempCurrentPage = this.currentPage;
  }
  navigatePage(pageNo:any, rowscount:any) {
    if (+pageNo > this.totalpages || +pageNo <= 0) {
      this.currentPage = this.tempCurrentPage;
    } else {
      this.mdtab.onPageChange({ first: ((pageNo - 1) * rowscount), rows: rowscount });
      this.tempCurrentPage = this.currentPage;
    }
  }
  getTotalPages(totalRecords:any, rows:any) {
    this.totalpages = Math.ceil((totalRecords) / rows);
    return Math.ceil((totalRecords) / rows);
  }
  getFeeTypes(currencyFlag: any) {
    if (this.verificationForm.value?.verificationComponentDet?.component?.[0]?.screeningComponentInfo?.
      compFeeFlag === true && (this.editCompFlag || !(this.additionalFeeList.some(x => x.feeName !== this.commonService.ADDI_FEE)))) {
      // this.feeTypeList = this.verificationForm.value.verificationTransBindDet.feesType;
      this.additionalFeeForm.get('countryType')?.disable();
      this.feeTypeList = this.verificationForm.value.verificationTransBindDet.feesType.filter(x => x.lookUpName
        !== this.commonService.ADDI_FEE);
      if (this.verificationForm.get('showGenrateResponse')?.value === true) {
        if (this.commonService.modifyComponentFeeFlag != true) {
          const val = this.verificationForm.value.verificationTransBindDet.status
            .find(x => x.statusName.toLowerCase() === 'open').screeningStatusId;
          this.verificationForm.get('screeningStatus.screeningStatusId')?.setValue(val);
          this.verificationService.updateScreeningStatus(this.verificationForm.get('screeningStatus')?.value).subscribe(res => {
            if (res.success === true) {
              this.verificationForm.get('showGenrateResponse')?.setValue(false);
              this.verificationService.screeningStatusId = this.verificationForm.get('screeningStatus.screeningStatusId')?.value;
            }
          });
        }
      }
    } else {
      this.additionalFeeForm.get('countryType')?.enable();
      this.feeTypeList = this.verificationForm.value.verificationTransBindDet.feesType.filter(x => x.lookUpName
        === this.commonService.ADDI_FEE);
    }
    if (this.additionalFeeList.some(x => x.feeName !== this.commonService.ADDI_FEE)) {
      this.compCurrencyForm.get('compCurrencyType')?.disable();
    } else {
      this.compCurrencyForm.get('compCurrencyType')?.enable();
    }
    this.additionalFeeForm.get('feeType')?.setValue(this.feeTypeList[0].lookUpId);
    if (this.feeTypeList[0].lookUpName === this.commonService.COMPON_FEE || this.feeTypeList[0].lookUpName === this.commonService.ADDI_FEE) {
      if (currencyFlag) {
        this.verificationService.getClientComponentFee(this.verificationService.tempData.screeningCompId).subscribe(res => {
          if (res) {

            this.compCurrencyForm.get('compCurrencyType')?.setValue(res.currencyType);
            this.additionalFeeForm.get('countryType')?.setValue(res.countryType);
            this.additionalFeeForm.get('currencyType')?.setValue(res.currencyType)
            if (this.feeTypeList[0].lookUpName === this.commonService.COMPON_FEE) {
              this.additionalFeeForm.get('fee')?.setValue(res.fee)
            }
          }
        })
      }

    }
  }
  getAdditionalFeesByScreeningCompId(screeningCompId: any) {
    this.verificationService.getAdditionalFeesByScreeningCompId(screeningCompId).subscribe(res => {
      if (res) {
        this.additionalFeeList = res;
        this.getFeeTypes(false);
        this.verificationForm.get('additionalFee')?.setValue(res);
      }
    }, err => { }, () => {
    });
  }
}
