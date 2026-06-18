import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { UntypedFormGroup, UntypedFormArray, Validators, UntypedFormControl, UntypedFormBuilder } from '@angular/forms';
import { Contact } from '../../models/contact';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MasterService } from '../../services/master.service';
import { CommonService } from '../../services/common.service';

@Component({
  standalone: false,
  selector: 'app-email-type',
  templateUrl: './email-type.component.html',
  styleUrls: ['./email-type.component.css']
})
export class EmailTypeComponent implements OnInit {
  emailtypeList: any[] = [];
  @Input() contactForm: UntypedFormGroup;
  emailFormArray: UntypedFormArray;
  @Input() contactFilter: string[];
  @Input() formGroupNanme: string;
  index = -1;
  @Input() commonContact: any;
  tempData: any[] = [];
  rowCount = 1;
  emailIds: any[] = [];
  filterOptionsList: any[] = [];
  seletected: any[] = [];
  objemail = {
    lookupId: 478,
    contactId: 0,
    emailConfigTransId: 0,
    contactData: '',
    active: true,
    emailDestLookupId: 0,
    emailDestName: '',
    createdUserId: 0,
  };
  existItem: any[] = [];
  contact: Contact = new Contact();
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  constructor(private masterService: MasterService, private formBuilder: UntypedFormBuilder, private common: CommonService) { }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges(changes: SimpleChanges): void {
    setTimeout(() => {
      if (changes.commonContact) {
        if (this.commonContact) {
          // console.log(this.commonContact.contact, 'this.commonContact.contact');
          this.initForm();
          const frmGrp = this.contactForm.get(this.formGroupNanme) as UntypedFormGroup;
          const contactfrmgrp = frmGrp.get('contact') as UntypedFormArray;
          if (this.commonContact.contact) {
            for (let i = 0; this.commonContact.contact.length > i; i++) {
              contactfrmgrp.push(this.initcontact());
            }
          }
          if (this.commonContact.contact) {
            this.emailIds = this.commonContact.contact;
            contactfrmgrp.setValue(this.emailIds);
          }
        }
      }
    }, 100);

  }

  ngOnInit() {
    this.getContactLookup();
    this.initForm();
    // this.addItem();
  }
  initForm() {
    const frmGrp = this.contactForm.get(this.formGroupNanme) as UntypedFormGroup;
    frmGrp.addControl('emailaddress', new UntypedFormControl(''));
    frmGrp.addControl('emailDestLookupId', new UntypedFormControl(''));
    frmGrp.addControl('contact', this.formBuilder.array([]));
  }
  initcontact(): UntypedFormGroup {
    return this.formBuilder.group({
      contactId: new UntypedFormControl(0),
      emailConfigTransId: new UntypedFormControl(0),
      contactData: new UntypedFormControl(),
      active: new UntypedFormControl(true),
      lookupId: new UntypedFormControl(478),
      emailDestLookupId: new UntypedFormControl(),
      emailDestName: new UntypedFormControl(),
      createdUserId: new UntypedFormControl(0)
    });
  }
  getContactLookup() {
    this.masterService.getEmailDestination().subscribe(res => {
      if (res) {
        this.tempData = res;
        this.emailtypeList = res;
      }
    });
  }
  add(): void {
    // this.emailFormArray = this.contactForm.get(this.contactformGroupName) as UntypedFormArray;
    const frmgroup = this.contactForm.get(this.formGroupNanme) as UntypedFormGroup;
    const control = frmgroup.get('emailaddress');
    const contactfrmgrp = frmgroup.get('contact') as UntypedFormArray;
    if (frmgroup.get('emailDestLookupId')?.value) {
      if (control.value) {
        const exist = this.emailIds.some((s, index) =>
          s.contactData === control.value && index !== this.index);
        if (exist) {
          control.setErrors({ alreadyExist: true });
        } else {
          if (this.index > -1) {
            this.emailIds[this.index].contactData = control.value;
            this.emailIds[this.index].emailDestLookupId = frmgroup.get('emailDestLookupId')?.value;
          } else {
            const temobjPhone = this.common.CloneObject(this.objemail);
            temobjPhone.contactData = control.value;
            temobjPhone.emailDestLookupId = frmgroup.get('emailDestLookupId')?.value;
            this.emailIds.push(temobjPhone);
            contactfrmgrp.push(this.initcontact());
          }
          contactfrmgrp.setValue(this.emailIds);
          control.reset();
          frmgroup.get('emailDestLookupId')?.setValue('');
          this.index = -1;
          frmgroup.get('emailDestLookupId')?.clearValidators();
          frmgroup.get('emailDestLookupId')?.markAsUntouched();
          frmgroup.get('emailDestLookupId')?.updateValueAndValidity();
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
      frmgroup.get('emailDestLookupId')?.setValidators(Validators.required);
      frmgroup.get('emailDestLookupId')?.markAsTouched();
      frmgroup.get('emailDestLookupId')?.updateValueAndValidity();
    }
  }
  getEmailType(lookupId): string {
    const lookUp = this.emailtypeList.find(f => f.lookUpId === lookupId);
    if (lookUp) {
      return lookUp.lookUpName;
    } else {
      return '';
    }
  }
  editEmail(index: any) {
    this.index = index;
    const frmgroup = this.contactForm.get(this.formGroupNanme) as UntypedFormGroup;
    const control = frmgroup.get('emailaddress');
    frmgroup.get('emailDestLookupId')?.setValue(this.emailIds[index].emailDestLookupId);
    control.setValue(this.emailIds[index].contactData);
  }
  removeControl(data: any) {
    const frmgroup = this.contactForm.get(this.formGroupNanme) as UntypedFormGroup;
    const contactfrmgrp = frmgroup.get('contact') as UntypedFormArray;
    contactfrmgrp.removeAt(data);
    this.emailIds.splice(data);
    this.index = -1;
  }
}
