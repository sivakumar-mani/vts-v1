import { Component, OnInit, Input, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { ScreeningComponentInfo } from 'src/app/common-methods/models/screening-details';
import { User } from 'src/app/common-methods/models/user';
import { ScreeningService } from '../../../common-methods/services/screening.service';
import { BehaviorSubject } from 'rxjs';
import { CommonService } from '../../../common-methods/services/common.service';

@Component({
  standalone: false,
  selector: 'app-drug-test',
  templateUrl: './drug-test.component.html',
  styleUrls: ['./drug-test.component.css']
})
export class DrugTestComponent implements OnInit {
  compName: any;
  @Input() formgroupName: string;
  @Input() mainForm: UntypedFormGroup;
  @Input() compAddress: any;
  @Input() fileBtn: boolean;
  @Input() compBaseDetails: any;
  @Input() docList: any;
  @Input() showNotApplicable: boolean;
  @Input() hiddenInsuff: boolean;
  authorityList: any[] = [];
  filterauthorityList: any[] = [];
  nFlag = false;
  docdata: any[] = [];
  panelList: any[] = [];
  drugControls!: AutoCompleteDropDown;
  screeningComponent = new ScreeningComponentInfo();
  drugKitList: any[];
  userData = new User();
  showInSuff: boolean;
  address = new BehaviorSubject(null);
  constructor(private cd: ChangeDetectorRef,private master: MasterService, 
    public common: CommonService,public screening: ScreeningService) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.getDrugKitList();
    if (this.mainForm.get('screeningComponentInfo')?.get('insuffRaisedFlag')?.value === true) {
      this.docdata = this.mainForm.get('screeningInsufficiency')?.get('insuffDocument')?.value;
    }
    this.showInsuff();
    this.setAuthItems('');
    let compNameList = this.screening.componentList.filter(x => x.compId === this.mainForm.value.screeningComponentInfo.compId);
    if (compNameList.length > 0) {
      this.compName = compNameList[0].compName;
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.compAddress) {
      this.checkAddress();
    }
    if (changes.compBaseDetails) {
      this.authorityList = this.screening.issuingAuthorityList;
      this.setAuthItems('');
    }
  }
  checkAddress() {
    this.address.next(this.compAddress);
    this.cd.markForCheck();
  }
  getAddressForm(): UntypedFormGroup {
    return this.mainForm.get(this.formgroupName) as UntypedFormGroup;
  }
  setAuthItems(value: any) {
    if (!value) { this.assignResourceCopy(); }
    if (value) {
      this.filterauthorityList = Object.assign([], this.authorityList).filter(
        item => ((item.name.toLowerCase().indexOf(value.toLowerCase()) > -1)));
    }
  }
  assignResourceCopy() {
    this.filterauthorityList = Object.assign([], this.authorityList);
  }
  getDrugKitList() {
    this.drugKitList= this.screening.drugKitList
    // this.master.GetDrugKitList().subscribe(resp => {
    //   this.drugKitList = resp;
    // });
  }
  notApplicable(event: any) {
    this.fileBtn = event.checked;
    this.nFlag = true;
  }
  drugKitChange(kitId: any) {
    const kit = this.drugKitList.find(f => f.kitId === kitId);
    if (kit) {
      this.mainForm.get(this.formgroupName).get('kitType')?.setValue(kit.kitName);
    }
  }
  showInsuff() {
    if (!this.hiddenInsuff) {
      this.showInSuff = this.mainForm.get('screeningComponentInfo')?.get('insuffRaisedFlag')?.value;
      // this.showInSuff = event.checked;
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
}
