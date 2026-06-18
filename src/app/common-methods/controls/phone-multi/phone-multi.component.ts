import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MasterService } from '../../services/master.service';
// import { MatChipInputEvent } from '@angular/material/dialog';
import { MatChipsModule, MatChipInputEvent } from '@angular/material/chips';
import { Contact, CommonContact } from '../../models/contact';
import { CommonService } from '../../services/common.service';

@Component({
  standalone: false,
  selector: 'app-phone-multi',
  templateUrl: './phone-multi.component.html',
  styleUrls: ['./phone-multi.component.css']
})
export class PhoneMultiComponent implements OnInit, OnChanges {
  phoneNumberList: any[] = [];
  @Input() contactForm: UntypedFormGroup;
  phoneFormArray: UntypedFormArray;
  @Input() contactPhoneFilter: string[];
  @Input() formArrayName: string;
  @Input() commonContact: CommonContact[] = [];
  tempData: any[] = [];
  rowCount = 1;
  phoneNumber: any[] = [];
  existItem: any[] = [];
  objPhone = {
    contactId: 0,
    transContactId: 0,
    contactData: '',
    active: true,
  };
  contact: Contact = new Contact();
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  constructor(private masterService: MasterService, private formBuilder: UntypedFormBuilder, private common: CommonService) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.commonContact.firstChange) {
      this.createControls();
    }
  }

  ngOnInit() {
    // const obj1 = {
    //   lookupId: 0,
    //   contact: [],
    // };
    // this.contactPhoneFilter.map(m =>
    //   this.phoneNumber.push(this.common.CloneObject(obj1)));
    // if (this.commonContact.length > 0) {
    //   for (let i = 0; this.commonContact.length > i; i++) {
    //     this.addItem();
    //     for (let j = 0; this.commonContact[i].contact.length > j; j++) {
    //       this.createPhonecontrol(i);
    //     }
    //   }
    //   this.phoneNumber = this.commonContact;
    //   this.contactForm.get(this.formArrayName).setValue(this.commonContact);
    //   console.log(this.phoneNumber, 'this.phoneNumber');
    // } else {
    //   this.addItem();
    // }
    this.getContactLookup();
    this.addItem();
  }
  createControls() {
    if (this.commonContact.length > 0) {
      this.phoneFormArray = this.contactForm.get(this.formArrayName) as UntypedFormArray;
      this.phoneFormArray.removeAt(0);
      for (let i = 0; this.commonContact.length > i; i++) {
        this.addItem();
        for (let j = 0; this.commonContact[i].contact.length > j; j++) {
          this.createPhonecontrol(i);
        }
      }
      this.phoneNumber = this.commonContact;
      setTimeout(() => {
        this.contactForm.get(this.formArrayName).patchValue(this.phoneNumber);
      }, 0);
      // console.log(this.phoneNumber, 'this.phoneNumber');
    }
  }
  getContactLookup() {
    this.masterService.GetContactLookup().subscribe(res => {
      if (res) {
        this.tempData = res;
        this.phoneNumberList = this.tempData.filter(f => this.contactPhoneFilter.some(s => s === f.lookUpName));
        // console.log(this.phoneNumberList, 'this.phoneNumberList');
      }
    });
  }
  createPhonecontrol(index: any) {
    this.phoneFormArray = this.contactForm.get(this.formArrayName) as UntypedFormArray;
    const frmgroup = this.phoneFormArray.controls[index] as UntypedFormGroup;
    const ggt = frmgroup.get('contact') as UntypedFormArray;
    ggt.push(this.initcontact());
  }
  initemailfrm(): UntypedFormGroup {
    return this.formBuilder.group({
      contact: new UntypedFormArray([]),
      LookUpValue: new UntypedFormControl(),
      lookupId: new UntypedFormControl(''),
      phoneNumber: new UntypedFormControl(),
    });
  }
  initcontact(): UntypedFormGroup {
    return this.formBuilder.group({
      contactId: new UntypedFormControl(0),
      transContactId: new UntypedFormControl(0),
      contactData: new UntypedFormControl(),
      active: new UntypedFormControl(true),
    });
  }
  addItem(): void {
    const objEmail = {
      lookupId: 0,
      contact: [],
    };
    this.phoneFormArray = this.contactForm.get(this.formArrayName) as UntypedFormArray;
    if (this.contactPhoneFilter.length > this.phoneFormArray.length) {
      this.phoneNumber.push(this.common.CloneObject(objEmail));
      this.phoneFormArray.push(this.initemailfrm());
      this.rowCount = this.phoneFormArray.length;
    }

    // const objEmail = {
    //   lookupId: 0,
    //   contact: [],
    // };
    // this.phoneFormArray = this.contactForm.get(this.formArrayName) as UntypedFormArray;
    // this.phoneFormArray.push(this.initemailfrm());
    // this.rowCount = this.phoneFormArray.length;
  }
  removecontrol(data: any) {
    const frmlength = this.phoneFormArray.length;
    if (frmlength > 1) {
      // control refers to your formarray
      const control = this.contactForm.get(this.formArrayName) as UntypedFormArray;
      // remove the chosen row
      control.removeAt(data);
      this.phoneNumber[data] = [];
      this.rowCount = control.length;
    }
  }
  add(event: MatChipInputEvent, index): void {
    const obj1 = {
      lookupId: 0,
      contact: [],
    };
    this.phoneFormArray = this.contactForm.get(this.formArrayName) as UntypedFormArray;
    const frmgroup = this.phoneFormArray.controls[index] as UntypedFormGroup;
    const control = frmgroup.get('phoneNumber');
    if (control.valid) {
      // const input = event.input;
      const value = control.value;

      if (this.phoneNumber[index].contact.some(s => s.contactData === control.value)) {
        // control.setValidators(Validators.compose(
        //   [Validators.pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/),
        //   Validators.minLength(1)]));
        control.setErrors({ alreadyExist: true });
      } else {
        // Add our email
        if ((value || '').trim()) {
          const objEmail = this.common.CloneObject(this.objPhone);
          objEmail.contactData = value;
          const contactfrmArray = frmgroup.get('contact') as UntypedFormArray;
          contactfrmArray.push(this.initcontact());
          this.phoneNumber[index].contact.push(objEmail);
        }
        control.setValue('');
        // if (input) {
        //   input.value = '';
        //   control.setValue('');
        // }
      }
      frmgroup.get('contact')?.setValue(this.phoneNumber[index].contact);
    } else {
      control.setValidators(Validators.required);
      control.updateValueAndValidity();
      control.setErrors({ incorrect: true });
      control.markAsTouched();
    }
  }
  remove(contact, i): void {
    this.phoneFormArray = this.contactForm.get(this.formArrayName) as UntypedFormArray;
    const frmgroup = this.phoneFormArray.controls[i] as UntypedFormGroup;
    const ggt = frmgroup.get('contact') as UntypedFormArray;
    // ggt.push(this.initcontact());
    const contactindex = this.phoneNumber[i].contact.findIndex(f => f.contactData === contact.contactData &&
      f.contactId === contact.contactId && f.transContactId === contact.transContactId);
    // const index = this.emailIds[i].contact.indexOf(fruit);
    if (contactindex >= 0) {
      ggt.removeAt(contactindex);
      this.phoneNumber[i].contact.splice(contactindex, 1);
    }
  }

  // add(event: MatChipInputEvent, index): void {
  //   this.phoneFormArray = this.contactForm.get(this.formArrayName) as UntypedFormArray;
  //   const frmgroup = this.phoneFormArray.controls[index] as UntypedFormGroup;
  //   const control = frmgroup.get('phoneNumber');
  //   if (control.valid) {
  //     const input = event.input;
  //     const value = event.value;

  //     // Add our phone
  //     if ((value || '').trim()) {
  //       const jhd = this.common.CloneObject(this.obj);
  //       jhd.contactData = value;
  //       const ggt = frmgroup.get('contact') as UntypedFormArray;
  //       ggt.push(this.initcontact());
  //       this.phoneNumber[index].contact.push(jhd);
  //       console.log('this.phoneNumber', this.phoneNumber);
  //     }
  //     if (input) {
  //       input.value = '';
  //       control.setValue('');
  //     }
  //     frmgroup.get('contact')?.setValue(this.phoneNumber[index].contact);
  //   } else {
  //     control.setValidators(Validators.required);
  //     control.updateValueAndValidity();
  //     control.setErrors({ incorrect: true });
  //     control.markAsTouched();
  //   }
  // }
  // remove(fruit, i): void {
  //   const index = this.phoneNumber[i].indexOf(fruit);
  //   if (index >= 0) {
  //     this.phoneNumber[i].splice(index, 1);
  //   }
  // }
  selectionPhoneNumberList(e: any) {
    this.existItem = this.phoneNumberList.filter(item => item.lookupId === e);
    // if (this.existItem.length > 0) {
    //   alert('The Sub Component List has been already inserted');
    // } else {
    // }
  }
  getContactFormGroup() {
    return (this.contactForm.get(this.formArrayName) as UntypedFormArray).controls;
  }

}
