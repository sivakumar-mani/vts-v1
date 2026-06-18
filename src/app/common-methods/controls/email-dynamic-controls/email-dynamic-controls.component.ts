import { Component, OnInit, SimpleChanges, Input } from '@angular/core';
import { MasterService } from '../../services/master.service';
import { UntypedFormArray, UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { Observable } from 'rxjs';
import { Contact } from '../../models/contact';

@Component({
  standalone: false,
  selector: 'app-email-dynamic-controls',
  templateUrl: './email-dynamic-controls.component.html',
  styleUrls: ['./email-dynamic-controls.component.css']
})
export class EmailDynamicControlsComponent implements OnInit {
  emailtypeList: any[] = [];
  @Input() contactForm: UntypedFormGroup;
  emailFormArray: UntypedFormArray;
  @Input() contactFilter: string[];
  @Input() formArrayNanme: string;
  index = -1;
  @Input() commonContact: Observable<Contact[]>;
  @Input() emailTypeData: any[];

  rowCount = 1;
  emailIds: any[] = [];
  filterOptionsList: any[] = [];
  emailValue: Contact[] = [];
  seletected: any[] = [];
  @Input() emailType = false;
  @Input() emailRequired = true;
  existItem: any[] = [];
  // contact: Contact = new Contact();
  constructor(private formBuilder: UntypedFormBuilder,private common:CommonService) { }
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      this.checkValueChanges();
    }
  }
  checkValueChanges() {
    if (this.commonContact) {
      this.commonContact.subscribe(data => {
        this.emailValue = data;
        this.emailFormArray = this.contactForm.get(this.formArrayNanme) as UntypedFormArray;
        const length = this.formArrayNanme.length;
        let ind = length;
        if (this.formArrayNanme.length > 0) {
          while (ind >= 0) {
            this.emailFormArray.removeAt(ind);
            ind--;
          }
        }
        if (this.emailValue && this.emailValue.length > 0) {
          for (let i = 0; this.emailValue.length > i; i++) {
            this.emailFormArray.push(this.initemailfrm());
            this.emailFormArray.controls[i].patchValue({
              contactId: this.emailValue[i].contactId,
              transContactId: this.emailValue[i].transContactId,
              contactData: this.emailValue[i].contactData,
              lookupId: this.emailValue[i].lookupId,
              active: this.emailValue[i].active,
              destLookupId: this.emailValue[i].destLookupId,
              destName: this.emailValue[i].destName
            });
          }
        } else {
          this.addItem(0, false);
        }
        this.rowCount = this.emailFormArray.length;
      });
    }
  }
  // ngOnChanges(changes: SimpleChanges): void {
  //   setTimeout(() => {
  //     if (changes.commonContact) {
  //       if (this.commonContact.length > 0) {
  //         console.log(this.commonContact, 'this.commonContact.contact');
  //         this.initemailfrm();
  //         const frmGrp = this.contactForm.get(this.formArrayNanme) as UntypedFormGroup;
  //         if (this.commonContact) {
  //           for (let i = 1; this.commonContact.length > i; i++) {
  //             this.addItem(0, false);
  //           }
  //           this.emailIds = this.commonContact;
  //           frmGrp.setValue(this.emailIds);
  //         }
  //       } else {

  //       }
  //     }
  //   }, 100);
  // }
  // createControls() {
  //   if (this.commonContact.length > 0) {
  //     this.emailFormArray = this.contactForm.get('formArrayName') as UntypedFormArray;
  //     this.emailFormArray.removeAt(0);
  //     for (let i = 0; this.commonContact.length > i; i++) {
  //       this.addItem();
  //       for (let j = 0; this.commonContact[i].contact.length > j; j++) {
  //         this.createemailcontrol(i);
  //       }
  //     }
  //     this.emailIds = this.commonContact;
  //     setTimeout(() => {
  //       this.contactForm.get('formArrayName')?.patchValue(this.emailIds);
  //     }, 0);
  //     console.log(this.emailIds, 'this.emailIds');
  //   }
  // }
  
  ngOnInit() {
    // this.getContactLookup();
  }

  initemailfrm(): UntypedFormGroup {
    return this.formBuilder.group({
      contactId: new UntypedFormControl(0),
      transContactId: new UntypedFormControl(0),
      contactData: new UntypedFormControl('', Validators.compose(
        [Validators.pattern(this.common.EmailRegX), this.emailRequired ? Validators.required : null])),
      active: new UntypedFormControl(true),
      lookupId: new UntypedFormControl(),
      destLookupId: new UntypedFormControl('', this.emailType ? Validators.required : null),
      destName: new UntypedFormControl(),
    });
  }
  removeControl(data: any) {
    const frmgroup = this.contactForm.get(this.formArrayNanme) as UntypedFormArray;
    frmgroup.removeAt(data);
    this.emailIds.splice(data);
    this.rowCount = this.emailFormArray.length;
    this.index = -1;
  }
  editEmail(index: any) {
    this.index = index;
    const frmgroup = this.contactForm.get(this.formArrayNanme) as UntypedFormArray;
    const control = frmgroup.get('emailaddress');
    frmgroup.get('destLookupId')?.setValue(this.emailIds[index].destLookupId);
    control.setValue(this.emailIds[index].contactData);
  }
  // addItem(): void {
  //   this.emailFormArray = this.contactForm.get(this.formArrayNanme) as UntypedFormArray;
  //   this.emailFormArray.push(this.initemailfrm());
  //   this.rowCount = this.formArrayNanme.length;
  // }
  checkValidEmail(ind, emailVal) {
    const formData = this.contactForm.value;
    this.emailFormArray = this.contactForm.get(this.formArrayNanme) as UntypedFormArray;
    const frmGroup = this.emailFormArray.controls[ind] as UntypedFormGroup;
    if (frmGroup.valid) {
      const contactData = frmGroup.get('contactData');
      if (frmGroup.valid) {
        const exist = formData[this.formArrayNanme].some((s, i) =>
          s.contactData === contactData.value && i !== ind);
        if (exist) {
          contactData.setErrors({ alreadyExist: true });
        } else {
          contactData.setErrors(null);
        }
      }
    }
  }
  addItem(index, value): void {
    const formData = this.contactForm.value;
    this.emailFormArray = this.contactForm.get(this.formArrayNanme) as UntypedFormArray;
    if (value) {
      const frmGroup = this.emailFormArray.controls[index] as UntypedFormGroup;
      if (frmGroup.valid) {
        const contactData = frmGroup.get('contactData');
        const destLookupId = frmGroup.get('destLookupId');
        const lookUp = frmGroup.get('lookupId');
        if (contactData.value) {
          const exist = formData[this.formArrayNanme].some((s, i) =>
            s.contactData === contactData.value && i !== index);
          if (exist) {
            contactData.setErrors({ alreadyExist: true });
          } else {
            this.emailFormArray.push(this.initemailfrm());
          }
        } else {
          contactData.setValidators([(this.emailRequired ? Validators.required : null),
             Validators.pattern(this.common.EmailRegX)]);
          contactData.markAsTouched();
          contactData.markAsDirty();
          contactData.updateValueAndValidity();
          destLookupId.setValidators(Validators.required);
          destLookupId.markAsTouched();
          destLookupId.markAsDirty();
          destLookupId.updateValueAndValidity();

          // lookUp.markAsTouched();
          // lookUp.markAsDirty();
          // lookUp.updateValueAndValidity();
        }
      }
    } else {
      this.emailFormArray.push(this.initemailfrm());
    }
    // if (emailType === true) {
    //   const frmGroupValue = this.emailFormArray.controls[index] as UntypedFormGroup;
    //   const destLookupId = frmGroupValue.get('destLookupId');
    //   const contactData = frmGroupValue.get('contactData');
    //   if (!destLookupId.value) {
    //     destLookupId.setValidators(Validators.required);
    //     destLookupId.markAsTouched();
    //     destLookupId.markAsDirty();
    //     destLookupId.updateValueAndValidity();
    //   }
    //   if (!contactData.value) {
    //     contactData.setValidators(Validators.required);
    //     contactData.markAsTouched();
    //     contactData.markAsDirty();
    //     contactData.updateValueAndValidity();
    //   }
    // }

    this.rowCount = this.emailFormArray.length;
  }
  emailValidation(index, emailType) {
    if (emailType === true) {
      const frmGroupValue = this.emailFormArray.controls[index] as UntypedFormGroup;
      const destLookupId = frmGroupValue.get('destLookupId');
      const contactData = frmGroupValue.get('contactData');
      if (!destLookupId.value) {
        destLookupId.setValidators(Validators.required);
        destLookupId.markAsTouched();
        destLookupId.markAsDirty();
        destLookupId.updateValueAndValidity();
      }
      if (!contactData.value) {
        contactData.setValidators(Validators.required);
        contactData.markAsTouched();
        contactData.markAsDirty();
        contactData.updateValueAndValidity();
      }
    }
    // if (emailType === true) {
    //   const frmGroupValue = this.emailFormArray.controls[index] as UntypedFormGroup;
    //   const destLookupId = frmGroupValue.get('destLookupId');
    //   if (destLookupId.valid) {
    //     destLookupId.setValidators(Validators.required);
    //     destLookupId.markAsTouched();
    //     destLookupId.markAsDirty();
    //     destLookupId.updateValueAndValidity();
    //   }
    // }
  }
  // if (this.phoneFormArray.length > this.phoneFormArray.length) {

  // }
  lookupChange(e: any) {
  const typeList =  this.emailTypeData.filter(x => x.lookUpId === e);
  const frmGroup = this.emailFormArray.controls[this.rowCount - 1] as UntypedFormGroup;
  frmGroup.get('destName')?.setValue(typeList[0].lookUpName);
  }
  getContactFormGroup() {
    return (this.contactForm.get(this.formArrayNanme) as UntypedFormArray).controls;
  }
}

