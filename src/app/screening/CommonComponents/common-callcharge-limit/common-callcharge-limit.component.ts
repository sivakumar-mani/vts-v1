import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CommonService } from 'src/app/common-methods/services/common.service';

@Component({
  standalone: false,
  selector: 'app-common-callcharge-limit',
  templateUrl: './common-callcharge-limit.component.html',
  styleUrls: ['./common-callcharge-limit.component.css']
})

export class CommonCallchargeLimitComponent implements OnInit {
  alertForm: UntypedFormGroup;
  userData: any;
  constructor(private fb: UntypedFormBuilder, private messageService: MessageService, public common: CommonService) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.initFormGroup();
  }
  initFormGroup() {
    this.alertForm = this.fb.group({
      clientId: ['', Validators.required],
      alertRuleId: [0],
      compId: ['', Validators.required],
      countryName: ['', Validators.required],
      clientLimit: ['', Validators.required],
      callChargelimit: ['', Validators.required],
      univFeelimit: [{ value: '', disabled: true }],
      univFeeAlert: ['', Validators.required],
      callChargeAlert: ['', Validators.required],
      univFeeFlag: [true, Validators.required], // { value: true, disabled: true }
      createdUserId: [this.userData.userId]
    });
  }
  assignClientLt() {
    this.alertForm.controls.univFeelimit.setValue(this.alertForm.controls.clientLimit.value);
    this.checkValidValue('univFeeAlert');
  }
  checkValidValue(type): void {
    if (type === 'callChargeAlert') {
      let value = this.alertForm.get('callChargeAlert')?.value;
      if (value === '' || value == null) {
        value = 0;
      } else if (value > this.alertForm.get('callChargelimit')?.value) {
        this.alertForm.get('callChargeAlert')?.markAsTouched();
        this.alertForm.get('callChargeAlert')?.setErrors({ incorrect: true });
      } else {
        this.alertForm.get('callChargeAlert')?.setErrors(null);
      }
    }
    if (type === 'univFeeAlert') {
      let val = this.alertForm.get('univFeeAlert')?.value;
      if (val === '' || val == null) {
        val = 0;
      } else if (+val > +this.alertForm.get('clientLimit')?.value) {
        this.alertForm.get('univFeeAlert')?.markAsTouched();
        this.alertForm.get('univFeeAlert')?.setErrors({ incorrect: true });
      } else {
        this.alertForm.get('univFeeAlert')?.setErrors(null);
      }
    }
  }

  showTopCenter(level: string, info: string, message: string) {
    this.messageService.add({ severity: level, summary: info, detail: message });
  }
}
