import { Component, OnInit, OnChanges, Input, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { UntypedFormGroup, UntypedFormArray, UntypedFormControl, Validators, UntypedFormBuilder } from '@angular/forms';
import { ScreeningComponentInfo } from 'src/app/common-methods/models/screening-details';
import { User } from 'src/app/common-methods/models/user';
import { BehaviorSubject } from 'rxjs';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { CommonService } from 'src/app/common-methods/services/common.service';

@Component({
  standalone: false,
  selector: 'app-common-comp-site-visit',
  templateUrl: './common-comp-site-visit.component.html',
  styleUrls: ['./common-comp-site-visit.component.css']
})
export class CommonCompSiteVisitComponent implements OnInit, OnChanges {

  nFlag = false;
  @Input() formgroupName: string;
  @Input() mainForm: UntypedFormGroup;
  @Input() compBaseDetails: any;
  @Input() fileBtn: boolean;
  @Input() compAddress: any;
  @Input() docList: any;
  @Input() showNotApplicable: boolean;
  @Input() hiddenInsuff: boolean;
  baseInfo: any;
  docdata: any[] = [];
  genderDetails: any;
  screeningComponent = new ScreeningComponentInfo();
  userData = new User();
  address = new BehaviorSubject(null);
  showInSuff: boolean;
  docData: any;
  companyList: any[] = [];
  filterCompanyList: any[] = [];
  compKeyUp: boolean;
  constructor(private cd: ChangeDetectorRef, public screeningService: ScreeningService, private common: CommonService) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    if(this.screeningComponent.componentDocument.length==0){               
      this.screeningComponent.componentDocument = this.mainForm.get('screeningComponentInfo')?.get('componentDocument')?.value;
      }
    this.companyList = this.screeningService.companyList;
    if (this.mainForm.get('screeningComponentInfo')?.get('insuffRaisedFlag')?.value === true) {
      this.docdata = this.mainForm.get('screeningInsufficiency')?.get('insuffDocument')?.value;
    }
    this.showInsuff();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.compAddress) {
      this.checkAddress();
    }
    if (changes.compBaseDetails) {
      this.baseInfo = this.compBaseDetails;
      this.companyList = this.baseInfo !== undefined ? this.baseInfo.company : this.companyList;
      this.setCompanyList('');
      this.mainForm.get(this.formgroupName).get('companyName')?.setValue(this.mainForm.get(this.formgroupName).get('companyName')?.value);
    }
  }
  checkAddress() {
    this.address.next(this.compAddress);
    this.cd.markForCheck();
  }
  getAddressForm(): UntypedFormGroup {
    return this.mainForm.get(this.formgroupName) as UntypedFormGroup;
  }
  showInsuff() {
    if (!this.hiddenInsuff) {
      this.showInSuff = this.mainForm.get('screeningComponentInfo')?.get('insuffRaisedFlag')?.value;
    } else {
      this.showInSuff = false;
    }
    if (this.mainForm.get('screeningInsufficiency')?.get('screeningStatusId')?.value === 0) {
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

  get displayEmpSupFn() {
    const dataNew = (data) => {
      if (data == null || data === undefined || data === '') {
        return null;
      } else {
        if (this.filterCompanyList && this.filterCompanyList.length > 0) {
          data = this.companyList.find(x => x === data);
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
  setCompanyList(value: any) {
    if (!value) { this.assignEmpsupResourceCopy(); }
    if (value) {
      this.filterCompanyList = Object.assign([], this.companyList).filter(
        item => ((item.toLowerCase().indexOf(value.toLowerCase()) > -1)));
    }
  }
  assignEmpsupResourceCopy() {
    this.filterCompanyList = Object.assign([], this.companyList);
  }
  empkeyUpFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        const data = this.filterCompanyList.filter(e =>
          e.toLowerCase() === value.toLowerCase());
        if (data.length > 0) {
          this.compKeyUp = true;
        } else {
          this.compKeyUp = true;
        }
      } else {
        this.compKeyUp = false;
      }
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
  notApplicable(event: any) {
    this.fileBtn = event.checked;
    this.nFlag = true;
  }
}
