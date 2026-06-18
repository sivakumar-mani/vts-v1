import { Component, OnInit, SimpleChanges, ChangeDetectorRef, Input, OnChanges } from '@angular/core';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { ScreeningComponentInfo } from 'src/app/common-methods/models/screening-details';
import { User } from 'src/app/common-methods/models/user';
import { BehaviorSubject } from 'rxjs';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';
import { MatDialog } from '@angular/material/dialog';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { Contact } from 'src/app/common-methods/models/contact';

@Component({
  standalone: false,
  selector: 'app-ref-self-emp',
  templateUrl: './ref-self-emp.component.html',
  styleUrls: ['./ref-self-emp.component.css']
})
export class RefSelfEmpComponent implements OnInit, OnChanges {
  @Input() formgroupName: string;
  @Input() mainForm: UntypedFormGroup;
  @Input() compBaseDetails: any;
  @Input() fileBtn: boolean;
  @Input() compAddress: any;
  @Input() docList: any;
  @Input() showNotApplicable: boolean;
  @Input() hiddenInsuff: boolean;
  nFlag = false;
  docdata: any[] = [];
  genderDetails: any;
  screeningComponent = new ScreeningComponentInfo();
  userData = new User();
  address = new BehaviorSubject(null);
  showInSuff: boolean;
  empSupKeyup: boolean;
  docData: any;
  applicationId: number;
  empSupList: any[] = [];
  filterEmpsupList: any[] = [];
  setBlur: boolean;
  countryControls!: AutoCompleteDropDown;
  countryList: any[] = [];
  contactdetail = new  Contact();
  constructor(private cd: ChangeDetectorRef, public screeningService: ScreeningService,
    private common: CommonService, private dialog: MatDialog, private master: MasterService) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.applicationId = this.userData.applicationId;
    this.empSupList = this.screeningService.employerSupList;
    this.countryControls =
      new AutoCompleteDropDown('Country', 'countryId', 'countryId', 'country', this.countryList,
        '', this.mainForm.get('compRef') as UntypedFormGroup, false, false, false);
    this.getCountryList();
    this.setEmpsupItems('');
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
      this.empSupList = this.screeningService.employerSupList;
      this.setEmpsupItems('');
      this.mainForm.get(this.formgroupName).get('professionalName')?.
        setValue(this.mainForm.get(this.formgroupName).get('professionalName')?.value);
    }
  }
  getCountryList() {
    this.master.GetCountryList().subscribe(res => {
      if (res) {
        this.countryList = res;
        this.countryControls =
          new AutoCompleteDropDown('Country', 'countryId', 'countryId', 'country', this.countryList,
            '', this.mainForm.get('compRef') as UntypedFormGroup, false, false, false);
        // this.common.countryList = Object.assign([], this.countryList);
      }
    });
  }
  checkAddress() {
    this.address.next(this.compAddress);
    this.cd.markForCheck();
  }
  getAddressForm(): UntypedFormGroup {
    return this.mainForm.get(this.formgroupName) as UntypedFormGroup;
  }
  get displayEmpSupFn() {
    const dataNew = (data) => {
      if (data == null || data === undefined || data === '') {
        return null;
      } else {
        if (this.filterEmpsupList && this.filterEmpsupList.length > 0) {
          data = this.empSupList.find(x => x.name === data);
          if (data === undefined) {
            return null;
          }
          return data.name;
        } else {
          return null;
        }
      }
    };
    return dataNew;
  }
  getName(option: any) {
    return option.name + '  |  ' + option.address.country + ' | ' + option.address.state + ' | ' + option.address.district;
  }
  setEmpsupItems(value: any) {
    if (!value) { this.assignEmpsupResourceCopy(); }
    if (value) {
      this.filterEmpsupList = Object.assign([], this.empSupList).filter(
        item => ((item.name.toLowerCase().indexOf(value.toLowerCase()) > -1)));
    }
  }
  assignEmpsupResourceCopy() {
    this.filterEmpsupList = Object.assign([], this.empSupList);
  }
  empkeyUpFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      this.supervisornameChangr(null, true);
      // this.mainForm.get(this.formgroupName).get('professionalId')?.setValue(0);
      if (value) {
        const data = this.filterEmpsupList.filter(e =>
          (e.name.toLowerCase() ? e.name.toLowerCase() : '') === value.toLowerCase());
        if (data.length > 0) {
          this.supervisornameChangr(data[0], false);
          // this.mainForm.get(this.formgroupName).get('professionalId')?.setValue(data[0].id);
          this.empSupKeyup = true;
        } else {
          this.empSupKeyup = true;
        }
      } else {
        this.empSupKeyup = false;
      }
    }
  }
  public openDialog(msg: string, header: string) {
    const popupData = {
      action: header === 'Alert' ? this.common.ALERT : this.common.DELETECONFIRMATION,
      headerText: header,
      bodyText: msg
    };
    const dialogRef = this.dialog.open(CommonAlertsComponent, {
      width: '320px',
      data: popupData,
      disableClose: true
    });
    if (dialogRef) {
      dialogRef.afterClosed().subscribe(result => {
        if (!result && header === 'Confirmation') {
          this.mainForm.get(this.formgroupName).get('professionalName')?.setValue('');
        }
      });
    }
  }
  supervisornameChangr(option, reset = false) {
    if (option || reset === true) {
      this.mainForm.get(this.formgroupName).get('professionalId')?.setValue(!reset ? option.id : 0);
      this.mainForm.get(this.formgroupName).get('supervisorEmail')?.patchValue({
        transContactId: (!reset && option.commonEmailDet.length > 0) ? option.commonEmailDet[0].transContactId : 0,
        destLookupId: (!reset && option.commonEmailDet.length > 0) ? option.commonEmailDet[0].destLookupId : 0,
        destName: (!reset && option.commonEmailDet.length > 0) ? option.commonEmailDet[0].destName : '',
        contactId: (!reset && option.commonEmailDet.length > 0) ? option.commonEmailDet[0].contactId : 0,
        contactData: (!reset && option.commonEmailDet.length > 0) ? option.commonEmailDet[0].contactData : '',
        lookupId: (!reset && option.commonEmailDet.length > 0) ? option.commonEmailDet[0].lookupId : 0,
      });
      this.mainForm.get(this.formgroupName).get('supervisorContactNo')?.patchValue({
        transContactId: (!reset && option.commonPhoneDet.length > 0) ? option.commonPhoneDet[0].transContactId : 0,
        destLookupId: (!reset && option.commonPhoneDet.length > 0) ? option.commonPhoneDet[0].destLookupId : 0,
        destName: (!reset && option.commonPhoneDet.length > 0) ? option.commonPhoneDet[0].destName : '',
        contactId: (!reset && option.commonPhoneDet.length > 0) ? option.commonPhoneDet[0].contactId : 0,
        contactData: (!reset && option.commonPhoneDet.length > 0) ? option.commonPhoneDet[0].contactData : '',
        lookupId: (!reset && option.commonPhoneDet.length > 0) ? option.commonPhoneDet[0].lookupId : 0,
      });
      this.mainForm.get(this.formgroupName).get('supervisorDesignation')?.setValue(!reset ? option.designation1 : '');
      this.mainForm.get(this.formgroupName).get('supervisorCompanyName')?.setValue(!reset ? option.companyName : '');
      this.mainForm.get(this.formgroupName).get('countryId')?.setValue(!reset ? option.countryId : '');
      this.mainForm.get(this.formgroupName).get('city')?.setValue(!reset ? option.city : '');
    }
    this.setCountryName(this.mainForm.get(this.formgroupName).get('countryId')?.value);
  }
  getOption(option: any) {
    return option.name + ' | ' + (option.commonPhoneDet && option.commonPhoneDet.length > 0 ? option.commonPhoneDet[0].contactData : '') + ' | ' +
      (option.commonEmailDet && option.commonEmailDet.length > 0 ? option.commonEmailDet[0].contactData : '');
  }
  changeSupervisor() {
    setTimeout(() => {
      const professionalName = this.mainForm.get(this.formgroupName).get('professionalName')?.value;
      if (this.applicationId !== 3) {
        let msg = ''; let header = '';
        const empObj = this.empSupList.find(x => x.name ? x.name.toLowerCase() : '' === professionalName.toLowerCase());
        if (empObj) {
          if (empObj.approveStatusLookupName === 'Rejected') {
            msg = 'Supervisor name is matching with rejected supervisor list.';
            header = 'Alert';
            this.openDialog(msg, header);

          } else if (empObj.approveStatusLookupName === 'For Research') {
            msg = 'Supervisor name is under research verification process.';
            header = 'Alert';
            this.openDialog(msg, header);
          }
        } else {
          if (!this.setBlur && professionalName.trim() !== '') {
            // this.screeningService.tempEmpSupList = this.screeningService.tempEmpSupList.filter(x => x.id !== 0);
            // this.screeningService.tempEmpSupList.push({
            //   address: null,
            //   id: 0,
            //   name: professionalName,
            // });
            this.mainForm.get(this.formgroupName).get('address')?.reset();
            this.mainForm.get(this.formgroupName).get('address')?.get('addressId')?.setValue(0);
            msg = 'Do you want to get approval for ' + professionalName + ' ?';
            header = 'Confirmation';
            this.openDialog(msg, header);
          }

        }
        if (this.empSupList.filter(x => x.name.toLowerCase() === professionalName.toLowerCase()).length === 1 && empObj) {
          this.address = new BehaviorSubject(empObj.address);
          this.address.next(empObj.address);
        }
      }
    }, 100);

  }
  setSupName(id: any) {
    this.setBlur = false;
    const prof = this.empSupList.find(x => x.id === id);
    if (prof) {
      this.mainForm.get(this.formgroupName).get('professionalName')?.setValue(prof.name);
      this.mainForm.get(this.formgroupName).get('professionalId')?.setValue(id);
      // this.address = new BehaviorSubject(prof.address);
      // this.address.next(prof.address);
    }
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
  setCountryName(data: any) {
    const countrydata = this.countryList.find(f => f.countryId === data);
    if (countrydata) {
      this.mainForm.get('compRef.country')?.setValue(countrydata.country);
    }
  }
}
