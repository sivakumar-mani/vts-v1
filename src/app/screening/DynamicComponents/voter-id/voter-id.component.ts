import { Component, OnInit, Input, ChangeDetectorRef, SimpleChanges, OnChanges } from '@angular/core';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { ScreeningComponentInfo } from 'src/app/common-methods/models/screening-details';
import { User } from 'src/app/common-methods/models/user';
import { BehaviorSubject } from 'rxjs';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';

@Component({
  standalone: false,
  selector: 'app-voter-id',
  templateUrl: './voter-id.component.html',
  styleUrls: ['./voter-id.component.css']
})
export class VoterIdComponent implements OnInit, OnChanges {
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
  constructor(private cd: ChangeDetectorRef, public screeningService: ScreeningService) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.showInsuff();
    this.getGenderDetails();
    if (this.mainForm.get('screeningComponentInfo')?.get('insuffRaisedFlag')?.value === true) {
      this.docdata = this.mainForm.get('screeningInsufficiency')?.get('insuffDocument')?.value;
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.compAddress) {
      this.checkAddress();
    }
  }
  checkAddress() {
    this.address.next(this.compAddress);
    this.cd.markForCheck();
  }
  getGenderDetails() {
    this.screeningService.getGenderDetails().subscribe(res => {
      if (res) {
        this.genderDetails = res;
        if (this.mainForm.get(this.formgroupName).get('genderLookupId')?.value === null) {
          const gender = this.genderDetails.find(x => x.lookUpName.toLowerCase() === 'male').lookUpId;
          this.mainForm.get(this.formgroupName).get('genderLookupId')?.setValue(gender);
        } else {
          this.mainForm.get(this.formgroupName).get('genderLookupId')?.
            setValue(this.mainForm.get(this.formgroupName).get('genderLookupId')?.value);
        }
      }
    });
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

  gendername(data: any) {
    if (data > 0) {
      const genderList = this.genderDetails.filter(x => x.lookUpId === data);
      if (genderList.length > 0) {
        this.mainForm.get(this.formgroupName).get('gender')?.setValue(genderList[0].lookUpName);
      } else {
        this.mainForm.get(this.formgroupName).get('gender')?.clearValidators();
        this.mainForm.get(this.formgroupName).get('gender')?.updateValueAndValidity();

      }
    }
  }

  notApplicable(event: any) {
    this.fileBtn = event.checked;
    this.nFlag = true;
  }
}
