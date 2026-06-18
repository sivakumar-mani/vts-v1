import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MasterService } from '../../services/master.service';
import { UntypedFormGroup, UntypedFormArray, UntypedFormControl, Validators, UntypedFormBuilder, ValidatorFn, AbstractControl } from '@angular/forms';
// import { MatChipInputEvent } from '@angular/material/dialog';
import { MatChipsModule, MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { CommonContact, Contact } from '../../models/contact';
import { CommonService } from '../../services/common.service';


@Component({
  standalone: false,
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit, OnChanges {
  emailtypeList: any[] = [];
  @Input() contactForm: UntypedFormGroup;
  emailFormArray: UntypedFormArray;
  @Input() contactFilter: string[];
  @Input() contactformGroupName: string;
  @Input() commonContact: any;
  emailIdList: any[] = [];
  index = -1;
  objemail = {
    contactId: 0,
    transContactId: 0,
    contactData: '',
    active: true,
    lookupId: 0
  };
  contact: Contact = new Contact();
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  constructor(private masterService: MasterService, private formBuilder: UntypedFormBuilder, private common: CommonService) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.commonContact) {
      const frmGrp = this.contactForm.get(this.contactformGroupName) as UntypedFormGroup;
      const contactfrmgrp = frmGrp.get('contact') as UntypedFormArray;
      const length = contactfrmgrp.length;
      let ind = length;
      if (contactfrmgrp.length > 0) {
        while (ind >= 0) {
          contactfrmgrp.removeAt(ind);
          this.emailIdList.splice(ind, 1);
          ind--;
        }
      // }
    // }
      // if (this.commonContact.length === 0) {
      //   const length = contactfrmgrp.length;
      //   let i = length;
      //   while (i >= 0) {
      //     contactfrmgrp.removeAt(i);
      //     this.emailIdList.splice(i, 1);
      //     console.log(i, 'remmove');
      //     i--;
      //   }
        // for (let i = contactfrmgrp.length; contactfrmgrp.length < i; i--) {
        //   contactfrmgrp.removeAt(i);
        //   this.emailIdList.splice(i, 1);
        // }
      // } else {
        if (this.commonContact.contact) {
          for (let i = 0; this.commonContact.contact.length > i; i++) {
            contactfrmgrp.push(this.initcontact());
          }
          this.emailIdList = this.commonContact.contact;
          contactfrmgrp.setValue(this.emailIdList);
        }
      } else {
        if (this.commonContact.contact) {
          for (let i = 0; this.commonContact.contact.length > i; i++) {
            contactfrmgrp.push(this.initcontact());
          }
          this.emailIdList = this.commonContact.contact;
          contactfrmgrp.setValue(this.emailIdList);
        }
      }
    }
  }
  ngOnInit() {
    this.initForm();
  }
  initForm() {
    const frmGrp = this.contactForm.get(this.contactformGroupName) as UntypedFormGroup;
    frmGrp.addControl('emailaddress', new UntypedFormControl('', Validators.compose(
      [Validators.pattern(this.common.EmailRegX), Validators.minLength(1)])));
    frmGrp.addControl('contact', this.formBuilder.array([]));
  }
  initcontact(): UntypedFormGroup {
    return this.formBuilder.group({
      contactId: new UntypedFormControl(0),
      transContactId: new UntypedFormControl(0),
      contactData: new UntypedFormControl(),
      active: new UntypedFormControl(true),
      lookupId: new UntypedFormControl(0)
    });
  }

  add(e): void {
    // this.emailFormArray = this.contactForm.get(this.contactformGroupName) as UntypedFormArray;
    const frmgroup = this.contactForm.get(this.contactformGroupName) as UntypedFormGroup;
    const control = frmgroup.get('emailaddress');
    const contactfrmgrp = frmgroup.get('contact') as UntypedFormArray;
    if (control.value) {
      if (control.valid) {
        const exist = this.emailIdList.some((s, index) =>
          s.contactData === control.value && index !== this.index);
        if (exist) {
          control.setErrors({ alreadyExist: true });
        } else {
          if (this.index > -1) {
            this.emailIdList[this.index].contactData = control.value;
          } else {
            const hjhd = this.common.CloneObject(this.objemail);
            hjhd.contactData = control.value;
            hjhd.lookupId = frmgroup.get('lookupId')?.value;
            this.emailIdList.push(hjhd);
            contactfrmgrp.push(this.initcontact());
          }
          contactfrmgrp.setValue(this.emailIdList);
          control.reset();
          this.index = -1;
          control.clearValidators();
          control.markAsTouched();
          control.updateValueAndValidity();
        }
      } else {
        control.setErrors({ incorrect: true });
      }
    } else {
      control.setValidators(Validators.compose(
        [Validators.pattern(this.common.EmailRegX), Validators.minLength(1), Validators.required]));
      control.markAsTouched();
      control.updateValueAndValidity();
    }
  }
  removecontrol(data: any) {
    const frmgroup = this.contactForm.get(this.contactformGroupName) as UntypedFormGroup;
    const contactfrmgrp = frmgroup.get('contact') as UntypedFormArray;
    contactfrmgrp.removeAt(data);
    this.emailIdList.splice(data);
    this.index = -1;
  }
  editemail(index: any) {
    this.index = index;
    const frmgroup = this.contactForm.get(this.contactformGroupName) as UntypedFormGroup;
    const control = frmgroup.get('emailaddress');
    control.setValue(this.emailIdList[index].contactData);
  }
}
