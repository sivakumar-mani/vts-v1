import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MasterService } from '../../services/master.service';
import { UntypedFormGroup, UntypedFormArray, UntypedFormControl, Validators, UntypedFormBuilder, ValidatorFn, AbstractControl } from '@angular/forms';
// import { MatChipInputEvent } from '@angular/material/dialog';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { CommonContact, Contact } from '../../models/contact';
import { CommonService } from '../../services/common.service';
import { MatChipsModule, MatChipInputEvent } from '@angular/material/chips';

@Component({
  standalone: false,
  selector: 'app-email-multi',
  templateUrl: './email-multi.component.html',
  styleUrls: ['./email-multi.component.css']
})
export class EmailMultiComponent implements OnInit, OnChanges {
  emailtypeList: any[] = [];
  @Input() contactForm: UntypedFormGroup;
  emailFormArray: UntypedFormArray;
  @Input() contactFilter: string[];
  @Input() formArrayName: string;
  @Input() commonContact: CommonContact[] = [];
  tempData: any[] = [];
  rowCount = 1;
  emailIds: any[] = [];
  filterOptionsList: any[] = [];
  seletected: any[] = [];
  objemail = {
    contactId: 0,
    transContactId: 0,
    contactData: '',
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
    this.getContactLookup();
    this.addItem();
  }
  createControls() {
    if (this.commonContact.length > 0) {
      this.emailFormArray = this.contactForm.get(this.formArrayName) as UntypedFormArray;
      this.emailFormArray.removeAt(0);
      for (let i = 0; this.commonContact.length > i; i++) {
        this.addItem();
        for (let j = 0; this.commonContact[i].contact.length > j; j++) {
          this.createemailcontrol(i);
        }
      }
      this.emailIds = this.commonContact;
      setTimeout(() => {
        this.contactForm.get(this.formArrayName).patchValue(this.emailIds);
      }, 0);
    }
  }
  getContactLookup() {
    this.masterService.GetContactLookup().subscribe(res => {
      if (res) {
        this.tempData = res;
        this.emailtypeList = this.tempData.filter(f => this.contactFilter.some(s => s === f.lookUpName));
      }
    });
  }
  initemailfrm(): UntypedFormGroup {
    return this.formBuilder.group({
      contact: new UntypedFormArray([]),
      lookupId: new UntypedFormControl(''),
      emailaddress: new UntypedFormControl('', Validators.compose(
        [Validators.pattern(this.common.EmailRegX), Validators.minLength(1)])),
    });
  }
  initcontact(): UntypedFormGroup {
    return this.formBuilder.group({
      contactId: new UntypedFormControl(0),
      transContactId: new UntypedFormControl(0),
      contactData: new UntypedFormControl(),
    });
  }
  addItem(): void {
    const objEmail = {
      lookupId: 0,
      contact: [],
    };
    this.emailFormArray = this.contactForm.get(this.formArrayName) as UntypedFormArray;
    if (this.contactFilter.length > this.emailFormArray.length) {
      this.emailIds.push(this.common.CloneObject(objEmail));
      this.emailFormArray.push(this.initemailfrm());
      this.rowCount = this.emailFormArray.length;
    }
    // this.filterOptions = this.emailtypeList
  }
  removecontrol(data: any) {
    const frmlength = this.emailFormArray.length;
    if (frmlength > 1) {
      // control refers to your formarray
      const control = this.contactForm.get(this.formArrayName) as UntypedFormArray;
      // remove the chosen row
      control.removeAt(data);
      this.emailIds.splice(data, 1);
      this.rowCount = control.length;
    }
  }
  add(event: MatChipInputEvent, index): void {
    const obj1 = {
      lookupId: 0,
      contact: [],
    };
    this.emailFormArray = this.contactForm.get(this.formArrayName) as UntypedFormArray;
    const frmgroup = this.emailFormArray.controls[index] as UntypedFormGroup;
    const control = frmgroup.get('emailaddress');
    if (control.valid) {
      const input = event.input;
      const value = event.value;

      if (this.emailIds[index].contact.some(s => s.contactData === control.value)) {
        control.setValidators(Validators.compose(
          [Validators.pattern(this.common.EmailRegX),
          Validators.minLength(1)]));
        control.setErrors({ alreadyExist: true });
      } else {
        // Add our email
        if ((value || '').trim()) {
          const objEmail = this.common.CloneObject(this.objemail);
          objEmail.contactData = value;
          const ggt = frmgroup.get('contact') as UntypedFormArray;
          ggt.push(this.initcontact());
          this.emailIds[index].contact.push(objEmail);
        }
        if (input) {
          input.value = '';
          control.setValue('');
        }
      }
      frmgroup.get('contact')?.setValue(this.emailIds[index].contact);
    } else {
      control.setValidators(Validators.compose(
        [Validators.pattern(this.common.EmailRegX),
        Validators.minLength(1)]));
      control.updateValueAndValidity();
      control.setErrors({ incorrect: true });
      control.markAsTouched();
    }
  }
  createemailcontrol(index: any) {
    this.emailFormArray = this.contactForm.get(this.formArrayName) as UntypedFormArray;
    const frmgroup = this.emailFormArray.controls[index] as UntypedFormGroup;
    const contactfrm = frmgroup.get('contact') as UntypedFormArray;
    contactfrm.push(this.initcontact());
  }
  remove(fruit, i): void {
    this.emailFormArray = this.contactForm.get(this.formArrayName) as UntypedFormArray;
    const frmgroup = this.emailFormArray.controls[i] as UntypedFormGroup;
    const ggt = frmgroup.get('contact') as UntypedFormArray;
    // ggt.push(this.initcontact());
    const contactindex = this.emailIds[i].contact.findIndex(f => f.contactData === fruit.contactData &&
      f.contactId === fruit.contactId && f.transContactId === fruit.transContactId);
    // const index = this.emailIds[i].contact.indexOf(fruit);
    if (contactindex >= 0) {
      ggt.removeAt(contactindex);
      this.emailIds[i].contact.splice(contactindex, 1);
    }
  }
  getContactFormGroup() {
    return (this.contactForm.get(this.formArrayName) as UntypedFormArray).controls;
  }
}
