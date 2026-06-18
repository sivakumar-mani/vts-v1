import { Component, OnInit, Input, ChangeDetectorRef, SimpleChanges, OnChanges } from '@angular/core';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { ScreeningComponentInfo } from 'src/app/common-methods/models/screening-details';
import { User } from 'src/app/common-methods/models/user';
import { BehaviorSubject } from 'rxjs';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { MasterService } from 'src/app/common-methods/services/master.service';

@Component({
  standalone: false,
  selector: 'app-reference-check',
  templateUrl: './reference-check.component.html',
  styleUrls: ['./reference-check.component.css']
})
export class ReferenceCheckComponent implements OnInit, OnChanges {
  compName: any;
  naFlag = false;   
  nFlag = false;   
  @Input() formgroupName: string;
  @Input() mainForm: UntypedFormGroup;
  @Input() compBaseDetails: any;
  @Input() fileBtn: boolean;
  @Input() compAddress: any;
  @Input() docList: any;
  @Input() showNotApplicable: boolean;
  @Input() hiddenInsuff: boolean;
  docdata: any[] = [];
  genderDetails: any;
  screeningComponent = new ScreeningComponentInfo();
  userData = new User();
  address = new BehaviorSubject(null);
  showInSuff: boolean;
  docData: any;
  refCheckReport: any[] = [];
  baseInfo: any;
  professionalList: any[] = [];
  filterprofessionalList: any[] = [];
  profKeyUp: boolean;
  applicationId: number;
  countryControls!: AutoCompleteDropDown;
  countryList: any[] = [];
  constructor(private cd: ChangeDetectorRef, public screeningService: ScreeningService, public common: CommonService,
    private master: MasterService) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.showInsuff();
    this.getRefReport();
    this.countryControls =
      new AutoCompleteDropDown('Country', 'countryId', 'countryId', 'country', this.countryList,
        '', this.mainForm.get('compRef') as UntypedFormGroup, false, false, true);
    this.getCountryList();
    if (this.mainForm.get('screeningComponentInfo')?.get('insuffRaisedFlag')?.value === true) {
      this.docdata = this.mainForm.get('screeningInsufficiency')?.get('insuffDocument')?.value;
    }
    let compNameList = this.screeningService.componentList.filter(x => x.compId === this.mainForm.value.screeningComponentInfo.compId);
    if (compNameList.length > 0) {
      this.compName = compNameList[0].compName;
     }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.compAddress) {
      this.checkAddress();
    }
    if (changes.compBaseDetails) {
      this.baseInfo = this.compBaseDetails;
      this.professionalList = this.baseInfo !== undefined ? this.baseInfo.professionalName : this.professionalList;
      this.setEmpsupItems('');
      this.mainForm.get(this.formgroupName).get('professionalName')?.
        setValue(this.mainForm.get(this.formgroupName).get('professionalName')?.value);
    }
  }
  checkAddress() {
    this.address.next(this.compAddress);
    this.cd.markForCheck();
  }
  getCountryList() {
    this.master.GetCountryList().subscribe(res => {
      if (res) {
        this.countryList = res;
        this.countryControls =
          new AutoCompleteDropDown('Country', 'countryId', 'countryId', 'country', this.countryList,
            '', this.mainForm.get('compRef') as UntypedFormGroup, false, false, true);
      }
    });
  }
  getRefReport() {
    this.screeningService.getRefCheckReport().subscribe(resp => {
      this.refCheckReport = resp;
    });
  }
  getAddressForm(): UntypedFormGroup {
    return this.mainForm.get(this.formgroupName) as UntypedFormGroup;
  }

  get displayEmpSupFn() {
    const dataNew = (data) => {
      if (data == null || data === undefined || data === '') {
        return null;
      } else {
        if (this.filterprofessionalList && this.filterprofessionalList.length > 0) {
          data = this.professionalList.find(x => x === data);
          if (data === undefined) {
            return null;
          }
          return data;
        } else {
          return null;
        }
      }
    };
    return dataNew;
  }
  setEmpsupItems(value: any) {
    if (!value) { this.assignEmpsupResourceCopy(); }
    if (value) {
      this.filterprofessionalList = Object.assign([], this.professionalList).filter(
        item => ((item.toLowerCase().indexOf(value.toLowerCase()) > -1)));
    }
  }
  assignEmpsupResourceCopy() {
    this.filterprofessionalList = Object.assign([], this.professionalList);
  }
  empkeyUpFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        const data = this.filterprofessionalList.filter(e =>
          e.toLowerCase() === value.toLowerCase());
        if (data.length > 0) {
          this.profKeyUp = true;
        } else {
          this.profKeyUp = true;
        }
      } else {
        this.profKeyUp = false;
      }
    }
  }

  // changeEmpProfessional(supervisorName: any) {
  //   setTimeout(() => {
  //     if (supervisorName && this.applicationId !== 3) {
  //       const empObj = this.professionalList.find(x => x.name.toLowerCase() === supervisorName.toLowerCase());
  //       if (this.professionalList.filter(x => x.name.toLowerCase() === supervisorName.toLowerCase()).length === 1 && empObj) {
  //         this.address = new BehaviorSubject(empObj.address);
  //         this.address.next(empObj.address);
  //       }
  //     }
  //   }, 100);
  // }
  // getSelected(id: any) {
  //   const emp = this.professionalList.find(x => x.id === id);
  //   if (emp) {
  //     this.mainForm.get(this.formgroupName).get('professionalName')?.setValue(emp.name);
  //     this.address = new BehaviorSubject(emp.address);
  //     this.address.next(emp.address);
  //   }
  // }

  showInsuff() {
    if (!this.hiddenInsuff) {
      this.showInSuff = this.mainForm.get('screeningComponentInfo')?.get('insuffRaisedFlag')?.value;
    } else {
      this.showInSuff = false;
    }
    if(this.mainForm.get('screeningInsufficiency')?.get('screeningStatusId')?.value === 0) {
      this.mainForm.get('screeningInsufficiency')?.get('screeningStatusId')?.setValue(null);
    }
    if (this.showInSuff) {
      this.mainForm.get('screeningInsufficiency')?.get('requiredLookupId')?.setValidators(Validators.required);
      this.mainForm.get('screeningInsufficiency')?.get('requiredLookupId')?.updateValueAndValidity();
      this.mainForm.get('screeningInsufficiency')?.get('screeningStatusId')?.setValidators(Validators.required);
      this.mainForm.get('screeningInsufficiency')?.get('screeningStatusId')?.updateValueAndValidity();
    } else {
      this.mainForm.get('screeningInsufficiency')?.get('requiredLookupId')?.clearValidators();
      this.mainForm.get('screeningInsufficiency')?.get('requiredLookupId')?.updateValueAndValidity();
      this.mainForm.get('screeningInsufficiency')?.get('levelLookupId')?.setValue(null);
      this.mainForm.get('screeningInsufficiency')?.get('raisedDate')?.setValue(null);
      this.mainForm.get('screeningInsufficiency')?.get('screeningStatusId')?.clearValidators();
      this.mainForm.get('screeningInsufficiency')?.get('screeningStatusId')?.updateValueAndValidity();
    }
  }
  createMisc() {
    if (this.mainForm.contains('miscQuestion')) {
      if (this.mainForm.get('miscQuestion')?.value.length === 0) {
        this.mainForm.removeControl('miscQuestion');
      }
    }
    const question = [{
      miscId: 0,
      miscQuestion: '',
      miscAnswer: '',
      defaultQuestionFlag: false,
    }];
    this.mainForm.addControl('miscQuestion', this.common.initMiscForm(question));
  }
  notprovidedco(val: any) {
    if ((this.userData.applicationId === 3) && (val === 'NOT PROVIDED')) {
     this.mainForm.get(this.formgroupName).get('refPhoneNo')?.setErrors({ incorrect: true });
   }
 }

 upperValue(val, control) {
  val = val.toUpperCase();
  this.mainForm.get(this.formgroupName).get(control).setValue(val);
  
  if (val.includes('NOT PROVIDED') && control === "refPhoneNo") {
    this.mainForm.get(this.formgroupName).get('refPhoneNo')?.setValue('Not Provided');
    this.common
  }
  
}
  notApplicable(event: any) {
    this.fileBtn = event.checked;
    this.naFlag = true;
  }
  setCountryName(data: any) {
    const countrydata = this.countryList.find(f => f.countryId === data);
    if (countrydata) {
      this.mainForm.get('compRef.country')?.setValue(countrydata.country);
    }
  }
}
