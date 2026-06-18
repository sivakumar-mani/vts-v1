import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { VerificationService } from 'src/app/common-methods/services/verification.service';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { User } from 'src/app/common-methods/models/user';
import { MessageService } from 'primeng/api';

@Component({
  standalone: false,
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.css']
})
export class PaymentDetailsComponent implements OnInit, OnChanges {
  maxDate = new Date();
  paymentModeList: any[] = [];
  paymentDetailForm: UntypedFormGroup;
  userData = new User();
  formName: string;
  @Input() screeningCompId: number;
  @Input() paymentDetails: any;
  @Input() paymentList: any[] = [];
  closedFlag = false;
  constructor(private verification: VerificationService, private messageService: MessageService) { }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.paymentList) {
      this.paymentModeList = this.paymentList;
    }
    if (this.paymentDetails) {
      this.getFormGroupName(this.paymentDetails.paymentModeLookupId);
      this.bindPaymentDetails();
    }
    if (this.verification.paymentId > 0 && !this.verification.tempData.payment) {
      this.getFormGroupName(this.verification.paymentId);
      this.bindPaymentDetails();
    }
  }
  ngOnInit() {
    console.log(this.paymentList, 'payment-details')
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    if (!this.paymentDetailForm) {
      this.initPaymentForm();
    }
    this.closedFlag = this.verification.closedCheck;
  }
  initPaymentForm() {
    this.paymentDetailForm = new UntypedFormGroup({
      screeningPaymentId: new UntypedFormControl(0),
      paymentModeLookupId: new UntypedFormControl(null, Validators.required),
      ddCheckForm: new UntypedFormGroup({
        favourOf: new UntypedFormControl('', Validators.required),
        chqDDNo: new UntypedFormControl('', Validators.required),
        chqDDDate: new UntypedFormControl('', Validators.required),
        chqDDAmount: new UntypedFormControl('', Validators.required),
        chqDDCommision: new UntypedFormControl('', Validators.required),
        bankName: new UntypedFormControl('', Validators.required),
        payableAt: new UntypedFormControl('', Validators.required),
      }),
      cashForm: new UntypedFormGroup({
        chqDDAmount: new UntypedFormControl('', Validators.required),
      }),
      miscChargesForm: new UntypedFormGroup({
        miscCharges: new UntypedFormControl(null, Validators.required),
        miscDesc: new UntypedFormControl(null, Validators.required),
      }),
      wireTransferForm: new UntypedFormGroup({
        screeningPaymentId: new UntypedFormControl(0),
        chqDDDate: new UntypedFormControl(null, Validators.required),
        chqDDNo: new UntypedFormControl('', Validators.required),
        chqDDAmount: new UntypedFormControl('', Validators.required), // univ
        chqDDCommision: new UntypedFormControl(10, Validators.required),
      })
    });
  }
  // getPaymentMode() {
  //   this.verification.getPaymentModeList().subscribe(resp => {
  //     this.paymentModeList = resp;
  //   });
  // }
  savePaymentDetails() {
    if (this.paymentDetailForm.get('paymentModeLookupId')?.valid) {
      if (this.paymentDetailForm.get(this.formName).valid) {
        const fromGrp = this.paymentDetailForm.get(this.formName) as UntypedFormGroup;
        fromGrp.addControl('screeningPaymentId',
          new UntypedFormControl(this.paymentDetailForm.get('screeningPaymentId')?.value));
        fromGrp.addControl('paymentModeLookupId',
          new UntypedFormControl(this.paymentDetailForm.get('paymentModeLookupId')?.value));
        fromGrp.addControl('loggedIn',
          new UntypedFormControl(this.userData.userId)),
          fromGrp.addControl('screeningCompId', new UntypedFormControl(this.screeningCompId));
        this.verification.paymentClass = this.paymentDetailForm.get(this.formName).value;
        this.verification.savePaymentDetails(this.paymentDetailForm.get(this.formName).value).subscribe(resp => {
          if (resp) {
            this.showNotification('success', 'Success', 'Saved successfully');
          }
        })
      } else {
        this.paymentDetailForm.get(this.formName).markAsTouched();
      }
    } else {
      this.paymentDetailForm.get('paymentModeLookupId')?.markAsTouched();
    }
  }
  bindPaymentDetails() {
    this.initPaymentForm();
    if (this.verification.paymentId > 0 && !this.verification.tempData.payment) {
      this.paymentDetailForm.get('paymentModeLookupId')?.setValue(this.verification.paymentId);
      this.paymentDetailForm.get(this.formName).patchValue(this.verification.paymentClass);
    } else {
      this.paymentDetailForm.get('paymentModeLookupId')?.setValue(this.paymentDetails.paymentModeLookupId);
      this.paymentDetailForm.get('screeningPaymentId')?.setValue(this.paymentDetails.screeningPaymentId);
      this.paymentDetailForm.get(this.formName).patchValue(this.paymentDetails);
    }
  }
  getFormGroupName(value): string {
    this.verification.paymentId = value;
    const data = this.paymentModeList.find(x => x.lookUpId === value);
    if (data) {
      switch (data.lookUpName.toLowerCase()) {
        case 'cheque':
        case 'dd':
          this.formName = 'ddCheckForm';
          return 'ddCheckForm';
        case 'cash':
          this.formName = 'cashForm';
          return 'cashForm';
        case 'misc. charges':
          this.formName = 'miscChargesForm';
          return 'miscChargesForm';
        case 'wire transfer':
          this.formName = 'wireTransferForm';
          return 'wireTransferForm';
        default:
          this.formName = '';
      }
    } else {
      this.formName = '';
    }
  }
  showNotification(severity1, summary1, message) {
    this.messageService.add({ severity: severity1, summary: summary1, detail: message });
  }
}
