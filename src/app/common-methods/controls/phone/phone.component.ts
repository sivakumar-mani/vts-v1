import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MasterService } from '../../services/master.service';
import { UntypedFormGroup, UntypedFormArray, UntypedFormControl, Validators, UntypedFormBuilder, ValidatorFn, AbstractControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { CommonContact, Contact } from '../../models/contact';
import { CommonService } from '../../services/common.service';


@Component({
  standalone: false,
  selector: 'app-phone',
  templateUrl: './phone.component.html',
  styleUrls: ['./phone.component.css']
})
export class PhoneComponent implements OnInit, OnChanges {
  phonetypeList: any[] = [];
  @Input() contactForm: UntypedFormGroup;
  emailFormArray: UntypedFormArray;
  @Input() contactPhoneFilter: string[];
  @Input() contactformGroupName: string;
  @Input() commonContact: any;
  tempData: any[] = [];
  phoneList: any[] = [];
  index = -1;
  objPhone = {
    lookupId: 0,
    contactId: 0,
    transContactId: 0,
    contactData: '',
    active: true
  };
  contact: Contact = new Contact();
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  constructor(private masterService: MasterService, private formBuilder: UntypedFormBuilder, private common: CommonService) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.commonContact) {
      const frmGrp = this.contactForm.get(this.contactformGroupName) as UntypedFormGroup;
      const contactfrmgrp = frmGrp.get('contact') as UntypedFormArray;
      for (let i = 0; this.commonContact.contact.length > i; i++) {
        contactfrmgrp.push(this.initcontact());
      }
      this.phoneList = this.commonContact.contact;
      contactfrmgrp.setValue(this.phoneList);
    }
  }

  ngOnInit() {
    this.getContactLookup();
    this.initForm();
  }
  initForm() {
    const frmGrp = this.contactForm.get(this.contactformGroupName) as UntypedFormGroup;
    frmGrp.addControl('phoneNumber', new UntypedFormControl(''));
    frmGrp.addControl('lookupId', new UntypedFormControl(''));
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
  getContactLookup() {
    this.masterService.GetContactLookup().subscribe(res => {
      if (res) {
        this.tempData = res;
        this.phonetypeList = this.tempData.filter(f => this.contactPhoneFilter.some(s => s === f.lookUpName));
      }
    });
  }
  add(): void {
    // this.emailFormArray = this.contactForm.get(this.contactformGroupName) as UntypedFormArray;
    const frmgroup = this.contactForm.get(this.contactformGroupName) as UntypedFormGroup;
    const control = frmgroup.get('phoneNumber');
    const contactfrmgrp = frmgroup.get('contact') as UntypedFormArray;
    if (frmgroup.get('lookupId')?.value) {
      if (control.value) {
        const exist = this.phoneList.some((s, index) =>
          s.contactData === control.value && index !== this.index);
        if (exist) {
          control.setErrors({ alreadyExist: true });
        } else {
          if (this.index > -1) {
            this.phoneList[this.index].contactData = control.value;
            this.phoneList[this.index].lookupId = frmgroup.get('lookupId')?.value;
          } else {
            const temobjPhone = this.common.CloneObject(this.objPhone);
            temobjPhone.contactData = control.value;
            temobjPhone.lookupId = frmgroup.get('lookupId')?.value;
            this.phoneList.push(temobjPhone);
            contactfrmgrp.push(this.initcontact());
          }
          contactfrmgrp.setValue(this.phoneList);
          control.reset();
          frmgroup.get('lookupId')?.setValue('');
          this.index = -1;
          frmgroup.get('lookupId')?.clearValidators();
          frmgroup.get('lookupId')?.markAsUntouched();
          frmgroup.get('lookupId')?.updateValueAndValidity();
          control.clearValidators();
          control.markAsUntouched();
          control.updateValueAndValidity();
        }
      } else {
        control.setValidators(Validators.required);
        control.markAsTouched();
        control.updateValueAndValidity();
      }
    } else {
      // this.contactForm.get(this.contactformGroupName['lookupId']).setValidators(Validators.required);
      frmgroup.get('lookupId')?.setValidators(Validators.required);
      frmgroup.get('lookupId')?.markAsTouched();
      frmgroup.get('lookupId')?.updateValueAndValidity();
    }
  }
  getphoneType(lookupId): string {
    const lookUp = this.phonetypeList.find(f => f.lookUpId === lookupId);
    if (lookUp) {
      return lookUp.lookUpName;
    } else {
      return '';
    }
  }
  editPhone(index: any) {
    this.index = index;
    const frmgroup = this.contactForm.get(this.contactformGroupName) as UntypedFormGroup;
    const control = frmgroup.get('phoneNumber');
    frmgroup.get('lookupId')?.setValue(this.phoneList[index].lookupId);
    control.setValue(this.phoneList[index].contactData);
  }
  removecontrol(data: any) {
    const frmgroup = this.contactForm.get(this.contactformGroupName) as UntypedFormGroup;
    const contactfrmgrp = frmgroup.get('contact') as UntypedFormArray;
    contactfrmgrp.removeAt(data);
    this.phoneList.splice(data);
    this.index = -1;
  }
}
