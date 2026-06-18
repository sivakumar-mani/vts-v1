import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { FSCandidateVm } from 'src/app/common-methods/models/screening-detail';
import { ScreeningComponent, ScreeningComponentInfo } from 'src/app/common-methods/models/screening-details';
import { User } from 'src/app/common-methods/models/user';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { ScreeningService } from "src/app/common-methods/services/screening.service";

@Component({
  standalone: false,
  selector: 'app-common-emp-uan',
  templateUrl: './common-emp-uan.component.html',
  styleUrls: ['./common-emp-uan.component.css']
})
export class CommonEmpUanComponent implements OnInit {
  @Input() formgroupName: string;
  @Input() mainForm: UntypedFormGroup;
  @Input() compBaseDetails: any;
  @Input() fileBtn: boolean;
  @Input() docList: any;
  @Input() showNotApplicable: boolean;
  @Input() hiddenInsuff: boolean;
  nFlag = false;
  docdata: any[] = [];
  screeningComponent = new ScreeningComponentInfo();
  userData = new User();
  showInSuff: boolean;
  docData: any;
  candidateInfo: FSCandidateVm;
  constructor(public common: CommonService , public screeningService: ScreeningService) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    if (this.mainForm.get('screeningComponentInfo')?.get('insuffRaisedFlag')?.value === true) {
      this.docdata = this.mainForm.get('screeningInsufficiency')?.get('insuffDocument')?.value;
    }
    // if(this.screeningComponent.componentDocument.length==0){               
    //   this.screeningComponent.componentDocument = this.mainForm.get('screeningComponentInfo')?.get('componentDocument')?.value;
    //   }
    this.clearValidation();
    this.showInsuff();
    // To reuse candidate info in components page for directapp 
    this.candidateInfo =this.common.getCandidateInfo();
    if(this.candidateInfo.firstName && this.userData.applicationId === 3){
        this.mainForm.get(this.formgroupName + '.fullName').setValue(this.candidateInfo.firstName);
        if (this.candidateInfo.uan != null && this.candidateInfo.uan != "") {
            this.mainForm.get(this.formgroupName + '.uan').setValue(this.candidateInfo.uan?this.candidateInfo.uan:'');
        }        
      }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      if (this.mainForm.get(this.formgroupName + '.uanAvailability').value === true) {
        this.mainForm.get(this.formgroupName + '.remarks').clearValidators();
        this.mainForm.get(this.formgroupName + '.remarks').updateValueAndValidity();
      }
    }
  }
  ngAfterViewInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    if (this.mainForm.get('screeningComponentInfo')?.get('insuffRaisedFlag')?.value === true) {
      this.docdata = this.mainForm.get('screeningInsufficiency')?.get('insuffDocument')?.value;
    }
    this.showInsuff();
  }

  NumbersOnlyAllowed(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      console.log('charCode restricted is ' + charCode);
      return false;
    }
    return true;
  }

  public clearValidation(): void {
    if (this.mainForm.get(this.formgroupName + '.uanAvailability').value === true) {
      this.mainForm.get(this.formgroupName + '.remarks').setValue('');
      this.mainForm.get(this.formgroupName + '.remarks').clearValidators();
      this.mainForm.get(this.formgroupName + '.remarks').updateValueAndValidity();
      this.mainForm.get(this.formgroupName + '.uan').setValidators([Validators.required, Validators.minLength(12)]);
      this.mainForm.get(this.formgroupName + '.uan').updateValueAndValidity();
      this.mainForm.get('screeningComponentInfo')?.get('componentDocument')?.clearValidators();
      this.mainForm.get('screeningComponentInfo')?.get('componentDocument')?.updateValueAndValidity();
    } else {
      this.mainForm.get(this.formgroupName + '.remarks').setValidators(Validators.required);
      this.mainForm.get(this.formgroupName + '.remarks').updateValueAndValidity();
    }
    if (this.mainForm.get(this.formgroupName + '.uanAvailability').value === false) {
      this.mainForm.get(this.formgroupName + '.uan').setValue('');
      this.mainForm.get(this.formgroupName + '.uan').clearValidators();
      this.mainForm.get(this.formgroupName + '.uan').updateValueAndValidity();
      this.mainForm.get(this.formgroupName + '.remarks').setValidators([Validators.required, Validators.minLength(15)]);
      this.mainForm.get(this.formgroupName + '.remarks').updateValueAndValidity();
      this.mainForm.get('screeningComponentInfo')?.get('remark')?.setValue('');
      this.mainForm.get('screeningComponentInfo')?.get('remark')?.updateValueAndValidity();
      this.mainForm.get('screeningComponentInfo')?.get('componentDocument')?.clearValidators();
      this.mainForm.get('screeningComponentInfo')?.get('componentDocument')?.updateValueAndValidity();
    } else {
      this.mainForm.get(this.formgroupName + '.uan').setValidators(Validators.required);
      this.mainForm.get(this.formgroupName + '.uan').updateValueAndValidity();
    }
  }

  showInsuff() {
    if (!this.hiddenInsuff) {
      this.showInSuff = this.mainForm.get('screeningComponentInfo')?.get('insuffRaisedFlag')?.value;
      // this.showInSuff = event.checked;
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
  notApplicable(event: any) {
    this.fileBtn = event.checked;
    this.nFlag = true;
  }

}

