import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { User } from 'src/app/common-methods/models/user';
import { VerificationService } from 'src/app/common-methods/services/verification.service';
import { MessageService } from 'primeng/api';

@Component({
  standalone: false,
  selector: 'app-override-fee',
  templateUrl: './override-fee.component.html',
  styleUrls: ['./override-fee.component.css']
})
export class OverrideFeeComponent implements OnInit, OnChanges {
  @Input() screeningCompId: number;
  @Input() overrideFeeDetails: any;
  overrideForm: UntypedFormGroup;
  userData = new User();
  constructor(private verificationService: VerificationService, private messageService: MessageService) { }
  ngOnChanges(changes: SimpleChanges) {
    if (this.overrideFeeDetails) {
      this.bindOverideFee();
    }
  }
  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    if (!this.overrideForm) {
      this.initFormGroup();
    }
  }
  initFormGroup() {
    this.overrideForm = new UntypedFormGroup({
      screeningOverrideFeeId: new UntypedFormControl(0),
      feeFlag: new UntypedFormControl(false),
      callFlag: new UntypedFormControl(false),
      feeCharge: new UntypedFormControl(''),
      callCharge: new UntypedFormControl(''),
      loggedIn: new UntypedFormControl(this.userData.userId),
      screeningCompId: new UntypedFormControl(this.screeningCompId)
    });
  }
  saveOverrideFee() {
    this.verificationService.saveOverrideFee(this.overrideForm.value).subscribe(res => {
      if (res) {
        this.showNotification('success', 'Success', 'Saved successfully');
      }
    });
  }
  bindOverideFee() {
    this.initFormGroup();
    this.overrideForm.patchValue(this.overrideFeeDetails);
  }
  showNotification(severity1, summary1, message) {
    this.messageService.add({ severity: severity1, summary: summary1, detail: message });
  }
}
