import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { UntypedFormGroup, Validators, UntypedFormBuilder, UntypedFormControl } from '@angular/forms';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';

import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table'

@Component({
  standalone: false,
  selector: 'app-institution-fees',
  templateUrl: './institution-fees.component.html',
  styleUrls: ['./institution-fees.component.css']
})
export class InstitutionFeesComponent implements OnInit {
  itemperpage: any;
  institutefeeForm: UntypedFormGroup;
  breadcrumbFlags = new BreadcrumbFlags();
  userData: any;
  isEdit: boolean;
  showFlag = false;
  saveFlag = false;
  screenAuth: any = {};
  routePath = 'Configure / Institution / Institution Fees';
  institutionFilterList: any[] = [];
  institutionList: any[] = [];
  InstitutionFeeList: any[] = [];
  institutionkeyUp: boolean;
  currentPage = 1;
  tempCurrentPage = 1;
  totalpages: number;
  selSountry = '';
  institutionControl!: AutoCompleteDropDown;
  @Input() feesId: any;
  @Input() insId: any;
  @ViewChild('dt', { static: false }) dt!: Table;
  @ViewChild('global') global!: ElementRef;
  displayedColumns = [
    { field: 'institutionName', header: 'Institution Name' },
    { field: 'infavourof', header: 'In Favour of' },
    { field: 'payableAt', header: 'Payable At' },
    { field: 'bankName', header: 'Bank Name' },
    { field: 'ddamount', header: 'Cheque/DD Amount' },
    { field: 'additionalCharges', header: 'Additional Charges' },
    { field: 'remarks', header: 'Remarks' },
    { field: 'total', header: 'Total' },
    { field: 'effectFromDate', header: 'Effective Date' },
    { field: 'emailId', header: 'Email Id' },
    { field: 'contactPerson', header: 'Contact Person' },
    { field: 'institutionType', header: 'Institution Type' },
    // { field: 'designation', header: 'Remarks' },
    // { field: 'abroadfees', header: 'Country' },
    { field: 'designation', header: 'Designation' },
    // { field: 'contactNumber', header: 'Contact Number' },
    { field: 'country', header: 'Country' },
  ];
  frozenCols = [
    { field: 'action', header: 'Action' },
  ];
  @ViewChild('institutionNameTrigger') institutionNameTrigger!: MatMenuTrigger;
  institutionNameFilteredOptions!: Observable<string[]>;
  institutionNameControl = new UntypedFormControl();

  @ViewChild('infavourofTrigger') infavourofTrigger!: MatMenuTrigger;
  infavourofFilteredOptions!: Observable<string[]>;
  infavourofControl = new UntypedFormControl();

  @ViewChild('payableatTrigger') payableatTrigger!: MatMenuTrigger;
  payableatFilteredOptions!: Observable<string[]>;
  payableatControl = new UntypedFormControl();

  @ViewChild('bankNameTrigger') bankNameTrigger!: MatMenuTrigger;
  bankNameFilteredOptions!: Observable<string[]>;
  bankNameControl = new UntypedFormControl();

  @ViewChild('ddamountTrigger') ddamountTrigger!: MatMenuTrigger;
  ddamountFilteredOptions!: Observable<string[]>;
  ddamountControl = new UntypedFormControl();

  @ViewChild('additionalChargesTrigger') additionalChargesTrigger!: MatMenuTrigger;
  additionalChargesFilteredOptions!: Observable<string[]>;
  additionalChargesControl = new UntypedFormControl();

  @ViewChild('remarksTrigger') remarksTrigger!: MatMenuTrigger;
  remarksFilteredOptions!: Observable<string[]>;
  remarksControl = new UntypedFormControl();

  @ViewChild('totalTrigger') totalTrigger!: MatMenuTrigger;
  totalFilteredOptions!: Observable<string[]>;
  totalControl = new UntypedFormControl();

  @ViewChild('effectFromDateTrigger') effectFromDateTrigger!: MatMenuTrigger;
  effectFromDateFilteredOptions!: Observable<string[]>;
  effectFromDateControl = new UntypedFormControl();

  @ViewChild('emailIdTrigger') emailIdTrigger!: MatMenuTrigger;
  emailIdFilteredOptions!: Observable<string[]>;
  emailIdControl = new UntypedFormControl();

  @ViewChild('contactPersonTrigger') contactPersonTrigger!: MatMenuTrigger;
  contactPersonFilteredOptions!: Observable<string[]>;
  contactPersonControl = new UntypedFormControl();

  @ViewChild('institutionTypeTrigger') institutionTypeTrigger!: MatMenuTrigger;
  institutionTypeFilteredOptions!: Observable<string[]>;
  institutionTypeControl = new UntypedFormControl();

  @ViewChild('designationTrigger') designationTrigger!: MatMenuTrigger;
  designationFilteredOptions!: Observable<string[]>;
  designationControl = new UntypedFormControl();

  @ViewChild('contactNumberTrigger') contactNumberTrigger!: MatMenuTrigger;
  contactNumberFilteredOptions!: Observable<string[]>;
  contactNumberControl = new UntypedFormControl();

  @ViewChild('countryTrigger') countryTrigger!: MatMenuTrigger;
  countryFilteredOptions!: Observable<string[]>;
  countryControl = new UntypedFormControl();

  // tslint:disable-next-line: max-line-length
  constructor(private common: CommonService, private fb: UntypedFormBuilder, private router: Router, private authservice: AuthService, private masterService: MasterService, private messageService: MessageService, public dialog: MatDialog) { }

  ngOnInit() {
    this.itemperpage = 10;
    this.screenAuth = this.authservice.getScreenAuth(this.router.url);
    this.breadcrumbFlags = this.common.breadcrumbFlags(true);
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.getInstitution();
    this.getInstitutionFees();
  }
  initFormGroup() {
    this.institutefeeForm = this.fb.group(
      {
        feesId: [0],
        institutionId: ['', Validators.required],
        infavourof: ['', Validators.required],
        payableAt: ['', Validators.required],
        bankName: [''],
        ddamount: ['', Validators.required],
        createdUserId: [this.userData.userId],
        additionalCharges: [''],
        remarks: [''],
        abroadFee: [''],
        prevDdamount: [''],
      });
    this.institutionControl = new AutoCompleteDropDown('Institution Name', 'institutionId', 'institutionId', 'institutionName',
      this.institutionList, '', this.institutefeeForm, false, false, true);
  }
  addInstituteFee() {
    this.initFormGroup();
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.breadcrumbFlags.toolTip = 'Save';
    this.showFlag = !this.showFlag;
    this.isEdit = false;
  }
  showNotification(level: string, info: string, message: string) {
    this.messageService.add({ severity: level, summary: info, detail: message });
  }
  saveInstituteFee() {
    if (this.institutefeeForm.valid) {
      this.institutefeeForm.value.institutionId = this.institutefeeForm.get('institutionId')?.value;
      this.masterService.saveInstitutionFees(this.institutefeeForm.value).subscribe(res => {
        if (res.success === false) {
          this.showNotification('warn', 'Failure Message', 'Failed to save');
          this.common.feesValue = null;
        } else {
          if (this.institutefeeForm.get('feesId')?.value > 0) {
            this.isEdit = false;
            this.showNotification('success', 'Success Message', 'Updated Successfully');
          } else {
            this.showNotification('success', 'Success Message', 'Saved Successfully');
          }
          this.common.feesValue = this.institutefeeForm.value;
          this.common.feesValue.feesId = res.value;
          this.getInstitutionFees();
          if (!(this.insId > 0)) {
            this.closeForm();
          }
        }
      });
    } else {
      this.institutefeeForm.markAllAsTouched();
      this.common.feesValue = null;
    }
  }

  closeForm() {
    if (this.insId > 0) {
      this.router.navigate(['/dashboard/verification/verification']);
    } else {
      this.breadcrumbFlags.btnSave = true;
      this.breadcrumbFlags.btnReset = true;
      this.breadcrumbFlags = this.common.breadcrumbFlags();
      this.institutefeeForm.reset();
      this.showFlag = !this.showFlag;
      this.isEdit = false;
      this.common.tempResetData  = [];
      this.breadcrumbFlags.btnSave = false;
      this.breadcrumbFlags.btnReset = false;
    }
  }


  resetForm() {
    if (this.institutefeeForm.controls.feesId.value > 0) {
      this.institutefeeForm.patchValue({
        feesId: this.common.tempResetData.feesId,
        institutionId: this.common.tempResetData.institutionId,
        infavourof: this.common.tempResetData.infavourof,
        payableAt: this.common.tempResetData.payableAt,
        bankName: this.common.tempResetData.bankName,
        ddamount: this.common.tempResetData.ddamount,
        additionalCharges: this.common.tempResetData.additionalCharges,
        remarks: this.common.tempResetData.remarks,
        abroadFee: this.common.tempResetData.abroadFee,
        prevDdamount: this.common.tempResetData.prevDdamount,
      });
      // this.institutionItems('');
    } else {
      this.institutefeeForm.reset();
      this.institutefeeForm.markAsPristine();
      this.institutefeeForm.controls.feesId.setValue(0);
      this.institutefeeForm.controls.createdUserId.setValue(this.userData.userId);
    }
  }
  // institutionfeesItems(value: any) {
  //   if (!value) { this.assignResourceCopy(); }
  //   if (value) {
  //     this.institutionfeeFilterList = Object.assign([], this.institutionList).filter(
  //       item => ((item.institutionName.toLowerCase().indexOf(value.toLowerCase()) > -1)));
  //   }
  // }
  resettable() {
    this.dt.reset();
    this.institutionNameControl.reset();
    this.infavourofControl.reset();
    this.payableatControl.reset();
    this.bankNameControl = new UntypedFormControl();
    this.ddamountControl = new UntypedFormControl();
    this.additionalChargesControl = new UntypedFormControl();
    this.institutionfeesTblAutoFilters();
    this.global.nativeElement.value = '';
  }

  getInstitution() {
    this.masterService.getInstitution().subscribe(resp => {
      this.institutionList = resp;
      this.institutionControl = new AutoCompleteDropDown('Institution Name', 'institutionId', 'institutionId', 'institutionName',
        this.institutionList, '', this.institutefeeForm, false, false, true);
      if (this.feesId > 0 && resp) {
        this.editInstitutionFees(this.feesId, null);
        this.institutefeeForm.get('institutionId')?.disable();
      } else if (this.feesId === 0 && resp) {
        this.addInstituteFee();
        this.institutefeeForm.patchValue({ institutionId: this.insId });
        this.institutefeeForm.get('institutionId')?.disable();
      }
    });
  }

  // institutionItems(value: any) {
  //   if (!value) { this.assignResourceCopy(); }
  //   if (value) {
  //     this.institutionFilterList = Object.assign([], this.institutionList).filter(
  //       item => ((item.institutionName.toLowerCase().indexOf(value.toLowerCase()) > -1)));
  //   }
  // }

  // assignResourceCopy() {
  //   this.institutionFilterList = Object.assign([], this.institutionList);
  // }

  // get displayInstitutionFn() {
  //   const institutionNew = (institution) => {
  //     if (institution == null || institution === undefined) {
  //       return null;
  //     } else {
  //       if (institution && this.institutionFilterList && this.institutionFilterList.length > 0) {
  //         institution = this.institutionFilterList.find(x => x.institutionId === institution);
  //         return institution.institutionName;
  //       } else {
  //         return null;
  //       }
  //     }
  //   };
  //   return institutionNew;
  // }

  // institutionKeyupFunction(event, value) {
  //   if (event.key === 'Enter' || event.key === 'Tab') {
  //     event.preventDefault();
  //     return false;
  //   } else {
  //     if (value) {
  //       const institution = this.institutionFilterList.filter(e =>
  //         e.institutionName.toLowerCase() === value.toLowerCase());
  //       if (institution.length > 0) {
  //         this.institutionkeyUp = true;
  //       } else {
  //         this.institutionkeyUp = true;
  //       }
  //     } else {
  //       this.institutionkeyUp = false;
  //     }
  //   }
  // }

  instituteSelected() {
    const data = this.institutionList.filter(e => e.institutionId === +this.institutefeeForm.get('institutionId')?.value)[0];
    this.selSountry = data?.country?.toString()?.toLowerCase();
    if (this.selSountry !== 'india') {
      this.institutefeeForm.get('institutionId')?.setValidators(Validators.required);
      this.institutefeeForm.get('institutionId')?.updateValueAndValidity();
    } else {
      this.institutefeeForm.get('institutionId')?.clearValidators();
      this.institutefeeForm.get('institutionId')?.updateValueAndValidity();
    }
  }

  // checkValidValue(): void {
  //   const value = this.institutefeeForm.get('institutionId')?.value;
  //   if (value === '' || value == null) {
  //     this.institutefeeForm.get('institutionId')?.setValidators(Validators.required);
  //   } else if (this.institutionkeyUp) {
  //     this.institutefeeForm.get('institutionId')?.setErrors({ incorrect: true });
  //   } else {
  //     this.institutefeeForm.get('institutionId')?.setErrors(null);
  //   }
  // }

  getInstitutionFees() {
    this.masterService.getInstitutionFees().subscribe(resp => {
      this.InstitutionFeeList = resp;
      this.institutionfeesTblAutoFilters();
    });
  }

  private institutionfeesTblAutoFilters(): void {
    this.institutionNameFilteredOptions = this.institutionNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.InstitutionFeeList.map(x => x.institutionName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toString().toLowerCase().includes(value))));

    this.infavourofFilteredOptions = this.infavourofControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.InstitutionFeeList.map(x => x.infavourof).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toString().toLowerCase().includes(value))));

    this.payableatFilteredOptions = this.payableatControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.InstitutionFeeList.map(x => x.payableAt).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toString().toLowerCase().includes(value))));

    this.bankNameFilteredOptions = this.bankNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.InstitutionFeeList.map(x => x.bankName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toString().toLowerCase().includes(value))));

    this.ddamountFilteredOptions = this.ddamountControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.InstitutionFeeList.map(x => x.ddamount).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toString().toLowerCase().includes(value))));

    this.additionalChargesFilteredOptions = this.additionalChargesControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.InstitutionFeeList.map(x => x.additionalCharges).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toString().toLowerCase().includes(value))));

    this.remarksFilteredOptions = this.remarksControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.InstitutionFeeList.map(x => x.remarks).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toString().toLowerCase().includes(value))));

    this.totalFilteredOptions = this.totalControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.InstitutionFeeList.map(x => x.total).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toString().toLowerCase().includes(value))));

    this.effectFromDateFilteredOptions = this.effectFromDateControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.InstitutionFeeList.map(x => x.effectFromDate).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toString().toLowerCase().includes(value))));

    this.emailIdFilteredOptions = this.emailIdControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.InstitutionFeeList.map(x => x.emailId).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toString().toLowerCase().includes(value))));

    this.contactPersonFilteredOptions = this.contactPersonControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.InstitutionFeeList.map(x => x.contactPerson).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toString().toLowerCase().includes(value))));

    this.institutionTypeFilteredOptions = this.institutionTypeControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.InstitutionFeeList.map(x => x.institutionType).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toString().toLowerCase().includes(value))));

    this.designationFilteredOptions = this.designationControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.InstitutionFeeList.map(x => x.designation).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toString().toLowerCase().includes(value))));

    this.contactNumberFilteredOptions = this.contactNumberControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.InstitutionFeeList.map(x => x.contactNumber).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toString().toLowerCase().includes(value))));

    this.countryFilteredOptions = this.countryControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.InstitutionFeeList.map(x => x.country).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toString().toLowerCase().includes(value))));

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

  getTotalPages(totalRecords, rows) {
    this.totalpages = Math.ceil((totalRecords) / rows);
    return Math.ceil((totalRecords) / rows);
  }

  editInstitutionFees(rowData, mode: any) {
    this.initFormGroup();
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.breadcrumbFlags.toolTip = 'Update';
    this.masterService.getInstitutionFeesById(rowData).subscribe(resp => {
      if (resp) {
        this.common.tempResetData = resp[0];
        setTimeout(() => {
          this.institutefeeForm.patchValue({
            feesId: this.common.tempResetData.feesId,
            institutionId: this.common.tempResetData.institutionId,
            infavourof: this.common.tempResetData.infavourof,
            payableAt: this.common.tempResetData.payableAt,
            bankName: this.common.tempResetData.bankName,
            ddamount: this.common.tempResetData.ddamount,
            additionalCharges: this.common.tempResetData.additionalCharges,
            remarks: this.common.tempResetData.remarks,
            abroadFee: this.common.tempResetData.abroadFee,
            prevDdamount: this.common.tempResetData.prevDdamount,
          });
        }, 10);
        if (mode === 'view') {
          this.institutefeeForm.disable();
          this.breadcrumbFlags.btnSave = false;
          this.breadcrumbFlags.btnReset = false;
        }
      }
      this.instituteSelected();
    });
    // this.institutionItems('');
    this.showFlag = !this.showFlag;
    this.isEdit = true;
  }

  public openDialog(feesId: any) {
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
            this.deleteInstitionFees(feesId);
          }
        }
      });
    }
  }
  showall() {
    if (this.InstitutionFeeList.length > 0) {
      this.itemperpage = this.InstitutionFeeList.length;
    }
  }
  deleteInstitionFees(feesId: any) {
    this.masterService.deleteInstitutionFees(feesId, this.userData.userId).subscribe(res => {
      if (res) {
        this.showNotification('warn', 'Success Message', 'Deleted Successfully');
        this.getInstitutionFees();
      }
    });
  }
}
