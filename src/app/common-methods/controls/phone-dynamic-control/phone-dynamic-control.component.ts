import { Component, OnInit, Input, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { UntypedFormGroup, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { CommonContact, Contact } from '../../models/contact';
import { MasterService } from '../../services/master.service';
import { CommonService } from '../../services/common.service';
import { Observable } from 'rxjs';

@Component({
  standalone: false,
  selector: 'app-phone-dynamic-control',
  templateUrl: './phone-dynamic-control.component.html',
  styleUrls: ['./phone-dynamic-control.component.css']
})
export class PhoneDynamicControlComponent implements OnInit, OnChanges {
  phoneNumberList: any[] = [];
  @Input() contactForm: UntypedFormGroup;
  phoneFormArray: UntypedFormArray;
  @Input() contactPhoneFilter: string[];
  @Input() phoneFormArrayName: string;
  @Input() commonContact: Observable<Contact[]>;
  tempData: any[] = [];
  rowCount = 1;
  datavalue: Contact[] = [];
  constructor(private masterService: MasterService, private formBuilder: UntypedFormBuilder,
              private common: CommonService, private cd: ChangeDetectorRef) { }
  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      this.checkValueChanges();
    }
  }
  checkValueChanges() {
    if (this.commonContact) {
      this.commonContact.subscribe(data => {
        this.datavalue = data;
        this.phoneFormArray = this.contactForm.get(this.phoneFormArrayName) as UntypedFormArray;
        const length = this.phoneFormArray.length;
        let ind = length;
        if (this.phoneFormArray.length > 0) {
          while (ind >= 0) {
            this.phoneFormArray.removeAt(ind);
            ind--;
          }
        }
        if (this.datavalue.length > 0) {
          for (let i = 0; this.datavalue.length > i; i++) {
            this.phoneFormArray.push(this.initPhonefrm(true));
            this.phoneFormArray.controls[i].patchValue({
              contactId: this.datavalue[i].contactId,
              transContactId: this.datavalue[i].transContactId,
              contactData: this.datavalue[i].contactData,
              lookupId: this.datavalue[i].lookupId,
            });
          }
        } else {
          this.addItem(0, false);
        }
        this.rowCount = this.phoneFormArray.length;
        this.cd.markForCheck();
      });
    }
  }
  ngOnInit() {
    this.getContactLookup();
  }
  initPhonefrm(isreq): UntypedFormGroup {
    return this.formBuilder.group({
      contactId: new UntypedFormControl(0),
      transContactId: new UntypedFormControl(0),
      contactData: new UntypedFormControl('', isreq ? Validators.required : null),
      active: new UntypedFormControl(true),
      lookupId: new UntypedFormControl('', isreq ? Validators.required : null),
    });
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
  getContactFormGroup() {
    return (this.contactForm.get(this.phoneFormArrayName) as UntypedFormArray).controls;
  }
  addItem(index, fromButton): void {
    const formData = this.contactForm.value;
    this.phoneFormArray = this.contactForm.get(this.phoneFormArrayName) as UntypedFormArray;
    if (fromButton) {
      const frmGroup = this.phoneFormArray.controls[index] as UntypedFormGroup;
      if (frmGroup.valid) {
        const contactData = frmGroup.get('contactData');
        const lookUp = frmGroup.get('lookupId');
        if (lookUp.value && contactData.value) {
          const exist = formData[this.phoneFormArrayName].some((s, i) =>
            s.contactData === contactData.value && s.lookupId === lookUp.value && i !== index);
          if (exist) {
            contactData.setErrors({ alreadyExist: true });
          } else {
            this.phoneFormArray.push(this.initPhonefrm(true));
          }
        } else {
          contactData.setValidators([Validators.required, Validators.minLength(10)]);
          lookUp.setValidators(Validators.required);
          contactData.markAsTouched();
          contactData.markAsDirty();
          contactData.updateValueAndValidity();
          lookUp.markAsTouched();
          lookUp.markAsDirty();
          lookUp.updateValueAndValidity();
        }
      }
    } else {
      this.phoneFormArray.push(this.initPhonefrm(false));
    }
    // if (this.phoneFormArray.length > this.phoneFormArray.length) {
    this.rowCount = this.phoneFormArray.length;
    // }
  }
  removeControl(index: any) {
    if (this.phoneFormArray.length > 1) {
      this.phoneFormArray.removeAt(index);
    }
    this.rowCount = this.phoneFormArray.length;
  }

}
