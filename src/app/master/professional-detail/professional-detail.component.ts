import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormArray, UntypedFormControl, Validators, UntypedFormBuilder } from '@angular/forms';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { Observable } from 'rxjs';
@Component({
  standalone: false,
  selector: 'app-professional-detail',
  templateUrl: './professional-detail.component.html',
  styleUrls: ['./professional-detail.component.css']
})
export class ProfessionalDetailComponent implements OnInit, OnDestroy {
  orderForm: UntypedFormGroup;
  itemsarray: UntypedFormArray;
  professionalSearchFormGroup: UntypedFormGroup;
  professionalReferenceEditFlag = false;
  country: any[] = [];
  state: any[] = [];
  professionalDetails: any[] = [];
  addEmail1 = false;
  sKeyup = false;
  emailRowCount = 0;
  contactPersonFlagEnable = false;
  phoneRowCount = 0;
  contactPersonRowCount = 0;
  count = 0;
  addressRowCount = 0;
  pathParameters: string[];
  routePath = 'Client / Professional Details';
  countryList: any;
  filteredStates: Observable<any>;
  satefilterlist: any[] = [];
  contryfilterlist: any[] = [];
  stateKeyup = false;
  stateList: any[] = [];
  addressList: UntypedFormArray;
  contactPersonList: UntypedFormArray;
  phoneNumberList: UntypedFormArray;
  emailList: UntypedFormArray;
  contactFilter = ['Primary Email', 'Secondary Email'];
  contactPhoneFilter = ['Business Phone', 'Mobile Phone', 'Additional Phone'];
  emailData: any[] = [];
  phoneData: any[] = [];
  // phoneData = [{ LookUpValue: ['4646846545', '4646846545', '4646846545'], lookUpId: 50, },
  // { LookUpValue: ['4646846545', '4646846545'], lookUpId: 51, },
  // { LookUpValue: ['4646846545', '4646846545', '4646846545'], lookUpId: 211, }];
  // emailData = [
  //   { LookUpValue: ['aruvirat@gh.jd', 'aruna@gh.dl', 'viratkholi@hs.fdl'], lookUpId: 53, },
  //   { LookUpValue: ['virat@gh.wsr', 'virataruna@gfgs.dg'], lookUpId: 54, }];
  // tslint:disable-next-line:max-line-length
  constructor(public masterService: MasterService, private authService: AuthService, public dialog: MatDialog,
              private router: Router, private formBuilder: UntypedFormBuilder,
              private messageService: MessageService,
              public common: CommonService) { }
  ngOnInit() {
    this.initFormGroup();
    this.setBreadcrumbs();
    // this.getProfessionalReferenceDetails();
    // if (this.professionalReference.emailList.length === 0) {
    // }
    // if (this.professionalReference.phoneNumberList.length === 0) {
    // }
    // if (this.professionalReference.addressList.length === 0) {
    // }
    // const professionalId = this.authService.professionalId;
    // if (professionalId) {
    //   this.professionalReferenceEditFlag = true;
    //   this.getProfessionalDetailsByProfessionalID(professionalId);
    // }
  }
  initFormGroup(): void {
    this.professionalSearchFormGroup = this.formBuilder.group({
      professionalName: new UntypedFormControl(),
      professionalId: 0,
      additionalInformation: '',
      additionalInformationSub: '',
      contactPerson1: '',
      contactPerson2: '',
      designation1: '',
      designation2: '',
      department1: '',
      department2: '',
      address: new UntypedFormGroup({
        addressId: new UntypedFormControl(0),
        addLine1: new UntypedFormControl('', Validators.required),
        addLine2: new UntypedFormControl(''),
        addLine3: new UntypedFormControl(''),
        city: new UntypedFormControl('', Validators.required),
        stateId: new UntypedFormControl('', Validators.required),
        countryId: new UntypedFormControl('', Validators.required),
        postalCode: new UntypedFormControl('', Validators.required),
        locationId: new UntypedFormControl(),
      }),
      professionalEmail: this.formBuilder.array([]),
      professionalPhone: this.formBuilder.array([]),
      // phoneNumberList: this.formBuilder.array([this.createItem()]),
      // emailList: this.formBuilder.array([this.createEmailItem()]),
      contactPersonList: this.formBuilder.array([this.createContactPersonItem()]),
    });
  }
  initemailfrm(): UntypedFormGroup {
    return this.formBuilder.group({
      LookUpValue: new UntypedFormControl(),
      lookUpId: new UntypedFormControl(),
      emailaddress: new UntypedFormControl('', Validators.compose(
        [Validators.pattern(this.common.EmailRegX), Validators.minLength(1)])),
    });
  }
  createItem(): UntypedFormGroup {
    return this.formBuilder.group({
      phone: '',
    });
  }
  createEmailItem(): UntypedFormGroup {
    return this.formBuilder.group({
      professionalEmail: '',
    });
  }
  createAddressItem(): UntypedFormGroup {
    return this.formBuilder.group({
      address: '',
    });
  }
  createContactPersonItem(): UntypedFormGroup {
    return this.formBuilder.group({
      contactPerson: '',
      contactPersonDesg: '',
      contactPersonDept: '',
    });
  }
  addItem(): void {
    this.phoneNumberList = this.professionalSearchFormGroup.get('phoneNumberList') as UntypedFormArray;
    this.phoneNumberList.push(this.createItem());
  }
  createEmail(): void {
    this.emailList = this.professionalSearchFormGroup.get('emailList') as UntypedFormArray;
    this.emailList.push(this.createEmailItem());
  }
  createAddressItems(): void {
    this.addressList = this.professionalSearchFormGroup.get('addressList') as UntypedFormArray;
    this.addressList.push(this.createAddressItem());
  }
  createContactPerson() {
    this.contactPersonList = this.professionalSearchFormGroup.get('contactPersonList') as UntypedFormArray;
    this.contactPersonList.push(this.createContactPersonItem());
  }
  // removeItem(index: any) {
  //   (this.professionalSearchFormGroup.get('phoneNumberList') as UntypedFormArray).removeAt(index);
  // }
  // removeEmailItem(index: any) {
  //   (this.professionalSearchFormGroup.get('emailList') as UntypedFormArray).removeAt(index);
  // }
  // removeAddressItem(index: any) {
  //   (this.professionalSearchFormGroup.get('addressList') as UntypedFormArray).removeAt(index);
  // }
  removeCotactItem(index: any) {
    (this.professionalSearchFormGroup.get('contactPersonList') as UntypedFormArray).removeAt(index);
  }

  setBreadcrumbs() {
    this.pathParameters = [this.common.SHOW, this.routePath];
    this.common.FlagEvent(this.pathParameters);
    this.common.eventSubscription = this.common.events$.subscribe(resp => {
      if (resp === this.common.SAVE) {
        this.addUpdateProfessionalReference();
      }
      if (resp === this.common.RESET) {
        this.resetFunction();
      }
      if (resp === this.common.BACK) {
        this.back();
      }
      // if (resp === this.common.ADD) {
      //   this.openBillingCycle();
      // }
    });
  }
  back() {
    this.router.navigate(['/dashboard/master/professionallist']);
  }
  // countryItems(value: any) {
  //   if (!value) { this.assignResourceCopy(); }
  //   if (value) {
  //     this.contryfilterlist = Object.assign([], this.countryList).filter(
  //       item => ((item.countryName.toLowerCase().indexOf(value.toLowerCase()) > -1)));
  //   }
  // }
  // assignResourceCopy() {
  //   this.contryfilterlist = Object.assign([], this.countryList);
  // }

  // countryKeyupFunction(event, value) {
  //   if (event.key === 'Enter' || event.key === 'Tab') {
  //     event.preventDefault();
  //     return false;
  //   } else {
  //     if (value) {
  //       const resource = this.contryfilterlist.filter(e =>
  //         e.countryName.toLowerCase() === value.toLowerCase());
  //       if (resource.length > 0) {
  //         this.stateKeyup = false;
  //         // this.selectcontry(resource[0]);
  //       } else {
  //         this.stateKeyup = true;
  //       }
  //     } else {
  //       this.stateKeyup = false;
  //       this.satefilterlist = [];
  //       this.stateList = [];
  //       // this.professionalSearchFormGroup.get('state')?.setValue(null);
  //       // this.professionalSearchFormGroup.get('state')?.disable();
  //       // this.dt.reset();
  //     }
  //   }
  // }
  // selectcontry(result: any): void {
  //   let countryId = this.professionalSearchFormGroup.get('country')?.value;
  //   if (typeof result === 'number') {
  //     countryId = result;
  //   } else {
  //     countryId = result.countryId;
  //   }
  //   if (countryId) {
  //     this.stateKeyup = false;
  //     this.professionalSearchFormGroup.get('country')?.setValue(result);
  //     // this.professionalSearchFormGroup.get('countryName')?.setValue(name);
  //     this.masterService.GetStatesList(countryId).subscribe(res => {
  //       if (res) {
  //         this.stateList = res;
  //         this.stateItems('');
  //         if (this.stateList) {
  //           setTimeout(() => {
  //             const valueStateName = this.professionalSearchFormGroup.get('state')?.value;
  //             if (valueStateName) {
  //               this.selectState(valueStateName);
  //             }
  //           }, 0);
  //         }
  //         setTimeout(() => {
  //           const value1 = this.professionalSearchFormGroup.get('state')?.value;
  //           const value = this.professionalSearchFormGroup.get('state')?.patchValue(value1);
  //           this.selectState(value);
  //         }, 0);
  //       }
  //     });
  //   } else {
  //   }
  // }
  // selectState(result: any) {
  //   if (result) {
  //     const stateName = this.stateList.filter(x => x.stateId === result);
  //     const name = stateName[0].stateName;
  //     const id = stateName[0].stateId;
  //     this.professionalSearchFormGroup.get('state')?.setValue(id);
  //     // this.professionalSearchFormGroup.get('stateName')?.setValue(name);
  //   }
  // }
  // get displayclientFn() {
  //   const resourceNew = (country) => {
  //     if (country == null || country === undefined) {
  //       return null;
  //     } else {
  //       if (country && this.contryfilterlist && this.contryfilterlist.length > 0) {
  //         country = this.contryfilterlist.find(x => x.countryId === country);
  //         if (country) {
  //           if (country.countryName) {
  //             return country.countryName;
  //           }
  //         }
  //       } else {
  //         return null;
  //       }
  //     }
  //   };
  //   return resourceNew;
  // }
  // checkValidValues(): void {
  //   const value = this.professionalSearchFormGroup.get('country')?.value;
  //   if (value === '' || value == null) {
  //   } else if (this.stateKeyup) {
  //     // tslint:disable-next-line:object-literal-key-quotes
  //     this.professionalSearchFormGroup.get('country')?.setErrors({ 'incorrect': true });
  //     this.stateList = [];
  //   } else {
  //     this.professionalSearchFormGroup.get('country')?.setErrors(null);
  //   }
  // }
  // checkValidState(): void {
  //   const value = this.professionalSearchFormGroup.get('state')?.value;
  //   if (value === '' || value == null) {
  //   } else if (this.sKeyup) {
  //     // tslint:disable-next-line:object-literal-key-quotes
  //     this.professionalSearchFormGroup.get('state')?.setErrors({ 'incorrect': true });
  //   } else {
  //     this.professionalSearchFormGroup.get('state')?.setErrors(null);
  //   }
  // }
  // stateItems(value: any) {
  //   if (!value) { this.assignsateCopy(); }
  //   if (value) {
  //     this.satefilterlist = Object.assign([], this.stateList).filter(
  //       item => ((item.stateName.toLowerCase().indexOf(value.toLowerCase()) > -1)));
  //   }
  // }
  // assignsateCopy() {
  //   this.satefilterlist = Object.assign([], this.stateList);
  // }

  // sateKeyupFunction(event, value) {
  //   if (event.key === 'Enter' || event.key === 'Tab') {
  //     event.preventDefault();
  //     return false;
  //   } else {
  //     if (value) {
  //       const resource = this.satefilterlist.filter(e =>
  //         e.stateName.toLowerCase() === value.toLowerCase());
  //       if (resource.length > 0) {
  //         this.sKeyup = false;
  //         this.selectState(resource[0].stateId);
  //       } else {
  //         this.sKeyup = true;
  //       }
  //     } else {
  //       this.sKeyup = false;
  //     }
  //   }
  // }
  // get displaysateFn() {
  //   const resourceNew = (state) => {
  //     if (state == null || state === undefined) {
  //       return null;
  //     } else {
  //       if (state && this.satefilterlist && this.satefilterlist.length > 0) {
  //         state = this.satefilterlist.find(x => x.stateId === state);
  //         if (state) {
  //           if (state.stateName) {
  //             return state.stateName;
  //           }
  //         }
  //       } else {
  //         return null;
  //       }
  //     }
  //   };
  //   return resourceNew;
  // }
  addUpdateProfessionalReference() {
    const controlNames = ['professionalName', 'country', 'city'];
    for (const ctrl in this.professionalSearchFormGroup.controls) {
      if (this.professionalSearchFormGroup.controls.hasOwnProperty(ctrl)) {
        if (controlNames.indexOf(ctrl) > -1) {
          if (this.professionalSearchFormGroup.get(ctrl).valid) {
            if (!this.professionalSearchFormGroup.get(ctrl).value) {
              this.professionalSearchFormGroup.get(ctrl).markAsTouched();
              this.professionalSearchFormGroup.get(ctrl).setValidators(Validators.required);
              this.professionalSearchFormGroup.get(ctrl).updateValueAndValidity();
            } else {
              this.professionalSearchFormGroup.get(ctrl).clearValidators();
              this.professionalSearchFormGroup.get(ctrl).updateValueAndValidity();
            }
          }
        }
      }
    }
    // this.contactPersonList.value.forEach(element => {
    //   if (this.count === 0) {
    //     this.professionalSearchFormGroup.get('contactPerson1')?.setValue(element.contactPerson);
    //     this.professionalSearchFormGroup.get('designation1')?.setValue(element.contactPersonDesg);
    //     this.professionalSearchFormGroup.get('department1')?.setValue(element.contactPersonDept);
    //   } else if (this.count === 1) {
    //     this.professionalSearchFormGroup.get('contactPerson2')?.setValue(element.contactPerson);
    //     this.professionalSearchFormGroup.get('designation2')?.setValue(element.contactPersonDesg);
    //     this.professionalSearchFormGroup.get('department2')?.setValue(element.contactPersonDept);
    //   }
    //   this.count++;
    // });
    if (this.professionalSearchFormGroup.valid) {
      // console.log(this.professionalSearchFormGroup.value, 'this.professionalSearchFormGroup.value');
      this.masterService.addUpdateProfessionalReference(this.professionalSearchFormGroup.value).subscribe(resp => {
        if (resp) {
          const profId = this.professionalSearchFormGroup.get('professionalId')?.value;
          // console.log(profId, 'profId');
          if (profId > 0) {
            this.showTopCenter('success', 'success', 'Success Message', 'Updated Successfully');
          } else {
            this.showTopCenter('success', 'success', 'Success Message', 'Saved Successfully');
          }
        }
      });
    }
    this.pathParameters = [this.common.SHOW, this.routePath];
    this.common.FlagEvent(this.pathParameters);
  }
  showTopCenter(success: string, level: string, info: string, message: string) {
    this.messageService.add({ key: success, severity: level, summary: info, detail: message });
  }
  // getProfessionalReferenceDetails() {
  //   this.masterService.getProfessionalReferenceDetails().subscribe(resp => {
  //     if (resp) {
  //       this.professionalDetails = resp;
  //     }
  //   });
  // }
  resetFunction() {
    this.professionalSearchFormGroup.reset();
    this.pathParameters = [this.common.SHOW, this.routePath];
    this.common.FlagEvent(this.pathParameters);
  }
  // getProfessionalDetailsByProfessionalID(profId: any) {
  //   this.professionalReferenceEditFlag = true;
  //   this.masterService.getProfessionalDetailsByProfessionalID(profId).subscribe(resp => {
  //     if (resp) {
  //       this.professionalReference = resp;
  //       if (this.professionalReference.emailList) {
  //       }
  //       if (this.professionalReference.phoneNumberList) {
  //       }
  //       if (this.professionalReference.contactPersonList) {
  //         for (let i = 0; i < this.professionalReference.contactPersonList.length; i++) {
  //           this.contactPersonRowCount = i;
  //         }
  //       }
  //     }
  //   });
  // }

  contactPersonFlag() {
    this.contactPersonFlagEnable = true;
  }
  getPhoneNumberControls() {
    return (this.professionalSearchFormGroup.get('phoneNumberList') as UntypedFormArray).controls;
  }
  getEmailControls() {
    return (this.professionalSearchFormGroup.get('emailList') as UntypedFormArray).controls;
  }
  getAddressControls() {
    return (this.professionalSearchFormGroup.get('addressList') as UntypedFormArray).controls;
  }
  getContactPersonControls() {
    return (this.professionalSearchFormGroup.get('contactPersonList') as UntypedFormArray).controls;
  }
  ngOnDestroy() {
    this.common.eventSubscription.unsubscribe();
  }
}
