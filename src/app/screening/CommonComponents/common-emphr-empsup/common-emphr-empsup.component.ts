import { Component, OnInit, OnChanges, Input, ChangeDetectorRef, SimpleChanges, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ScreeningComponentInfo } from 'src/app/common-methods/models/screening-details';
import { User } from 'src/app/common-methods/models/user';
import { BehaviorSubject } from 'rxjs';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonAddNewComponent } from '../common-add-new/common-add-new.component';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { AutoCompleteComponent } from 'src/app/common-methods/controls/auto-complete/auto-complete.component';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { Contact } from 'src/app/common-methods/models/contact';
// import moment from 'moment';
import moment from 'moment';
import { DatePipe } from '@angular/common';

@Component({
  standalone: false,
  selector: 'app-common-emphr-empsup',
  templateUrl: './common-emphr-empsup.component.html',
  styleUrls: ['./common-emphr-empsup.component.css']
})
export class CommonEmphrEmpsupComponent implements OnInit, OnChanges {
  naFlag = false;
  nFlag = false;
  componentName = '';
  PanFormGroup: UntypedFormGroup;
  componentFormGroup: UntypedFormGroup;
  clientVendors: any[] = [];
  @Input() formgroupName: string;
  @Input() mainForm: UntypedFormGroup;
  @Input() selectedIndex: any;
  @Input() compBaseDetails: any;
  @Input() compAddress: any;
  @Input() fileBtn: boolean;
  @Input() docList: any;
  @Input() showNotApplicable: boolean;
  @Input() hiddenInsuff: boolean;
  docdata: any[] = [];
  screeningComponent = new ScreeningComponentInfo();
  empSupAdd = new BehaviorSubject(null);
  empHRAdd = new BehaviorSubject(null);
  baseInfo: any;
  empList: any[] = [];
  filterEmpList: any[] = [];
  empSupList: any[] = [];
  filterEmpsupList: any[] = [];
  empKeyup: boolean;
  userData = new User();
  isTech = false;
  showInSuff: false;
  applicationId: number;
  compKeyUp: boolean;
  empSupKeyup: boolean;
  setSupBlur = false;
  empHrAlertCount: number;
  empSupAlertCount: number;
  countryControls!: AutoCompleteDropDown;
  countryList: any[] = [];
  todateReadOnly = false;
  contactdetail = new Contact();
  maxDate = new Date();
  constructor(private cd: ChangeDetectorRef, public screeningService: ScreeningService, public fb: UntypedFormBuilder,
    private dialog: MatDialog, public common: CommonService, private master: MasterService) {
    this.maxDate = new Date(this.maxDate.setFullYear(this.maxDate.getFullYear()));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.mainForm != undefined) {
      if (changes.compBaseDetails) {
        this.baseInfo = this.compBaseDetails;
        this.empSupList = this.screeningService.employerSupList;
        this.setEmpsupItems('');
        this.mainForm.get(this.formgroupName)?.get('employmentSupervisor')?.get('professionalName')?.setValue(
          this.mainForm.get(this.formgroupName)?.get('employmentSupervisor')?.get('professionalName')?.value
        );
        this.mainForm.get(this.formgroupName)?.get('employmentSupervisor')?.get('professionalName')?.
          setValue(this.mainForm.get(this.formgroupName)?.get('employmentSupervisor')?.get('professionalName')?.value);
        this.empList = this.screeningService.employerList;
        this.setEmpItems('');
        this.mainForm.get(this.formgroupName)?.get('employmentHR')?.get('employerName')?.setValue(
          this.mainForm.get(this.formgroupName)?.get('employmentHR')?.get('employerName')?.value
        );
      }
      this.showInsuff();
    }
  }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.applicationId = this.userData.applicationId;
    if (this.mainForm != undefined) {
      if (this.screeningComponent.componentDocument.length == 0) {
        this.screeningComponent.componentDocument = this.mainForm.get('screeningComponentInfo')?.get('componentDocument')?.value;
      }
      this.empList = this.screeningService.employerList;
      this.empSupList = this.screeningService.employerSupList;
      this.countryControls =
        new AutoCompleteDropDown('Country', 'countryId', 'countryId', 'country', this.countryList,
          '', this.mainForm.get('compRef.employmentSupervisor') as UntypedFormGroup, false, false, false);
      this.getCountryList();
      if (this.mainForm.get('screeningComponentInfo')?.get('insuffRaisedFlag')?.value === true) {
        this.docdata = this.mainForm.get('screeningInsufficiency')?.get('insuffDocument')?.value;
      }
      this.setEmpItems('');
      this.setEmpsupItems('');
      this.chengeCurrentEmp();
      this.showInsuff();
      if (this.mainForm.get(this.formgroupName)?.get('employmentHR')?.get('employerId')?.value > 0) {
        this.setEmpHRName(this.mainForm.get(this.formgroupName)?.get('employmentHR')?.get('employerId')?.value);
      }
    }
  }
  getCountryList() {
    this.master.GetCountryList().subscribe(res => {
      if (res) {
        this.countryList = res;
        this.countryControls =
          new AutoCompleteDropDown('Country', 'countryId', 'countryId', 'country', this.countryList,
            '', this.mainForm.get('compRef.employmentSupervisor') as UntypedFormGroup, false, false, false);
      }
    });
  }
  chengeCurrentEmp() {
    const currentEmploye = this.mainForm.get(this.formgroupName)?.get('employmentHR')?.get('currentEmployerFlag')?.value;
    if (currentEmploye) {
      this.mainForm.get(this.formgroupName)?.get('employmentHR')?.get('validationString')?.setValue(['NOT PROVIDED', 'TILL DATE', 'Not Provided']);
      this.mainForm.get(this.formgroupName)?.get('employmentHR')?.get('toDate')?.setValue('TILL DATE');
      this.todateReadOnly = true;
      this.calcCurrentCompany();
    } else {
      this.mainForm.get(this.formgroupName)?.get('employmentHR')?.get('validationString')?.setValue(['NOT PROVIDED', 'Not Provided']);
      if (this.mainForm.get('screeningComponentInfo.insuffRaisedFlag')?.value) {
        if (this.screeningService.insuffLevelList.length > 0) {
          const levelLookupId = this.screeningService.insuffLevelList.find(f => f.lookUpName === 'Level-1')?.lookUpId;
          this.mainForm.get('screeningInsufficiency.levelLookupId')?.setValue(levelLookupId);
        }
      }
      if (this.mainForm.get(this.formgroupName)?.get('employmentHR')?.get('toDate')?.value === 'TILL DATE') {
        this.mainForm.get(this.formgroupName)?.get('employmentHR')?.get('toDate')?.setValue('');

      }
      this.todateReadOnly = false;
    }
  }
  calcCurrentCompany() {

    const employmentHR = this.mainForm.get(this.formgroupName)?.get('employmentHR');

    const fromDateValue = employmentHR?.get('fromDate')?.value;
    const toDateValue = employmentHR?.get('toDate')?.value;

    if (fromDateValue && toDateValue === 'TILL DATE') {

      const val = moment(); // current date
      const val1 = moment(fromDateValue, 'DD/MM/YYYY');

      if (val1.isValid() && val.isValid()) {

        if (val1.isAfter(val)) {
          employmentHR?.get('fromDate')?.setErrors({ incorrect: true });
          employmentHR?.get('fromDate')?.markAsTouched();
        } else {
          employmentHR?.get('fromDate')?.setErrors(null);
        }

      }
    }
  }
  dateCalc() {
    return this.fb.group({
      UntypedFormGroup: this.mainForm.get(this.formgroupName)?.get('employmentHR')
    },
      {
        validator: this.common.dateCompareFile('fromDate',
          'toDate')
      },
    );
  }
  changeDate(date, control) {
    this.mainForm.get(this.formgroupName)?.get('employmentHR')?.get(control)?.setValue(new DatePipe('en-Us').transform(date.value, 'dd/MMM/yyyy'))
    this.upperCase(this.mainForm.get(this.formgroupName)?.get('employmentHR')?.get(control)?.value, control);
    this.touchValidation(date.value, control);
  }
  upperCase(val, control) {
    val = val.toUpperCase();
    this.mainForm.get(this.formgroupName)?.get('employmentHR')?.get(control)?.setValue(val);
    if (val.includes('NOT PROVIDED') && control === "fromDate") {
      this.mainForm.get(this.formgroupName)?.get('fromDate')?.setValue('Not Provided');
    }
    if (val.includes('NOT PROVIDED') && control === "toDate") {
      this.mainForm.get(this.formgroupName)?.get('toDate')?.setValue('Not Provided');
    }
  }
  touchValidation(val, control) {
    if ((this.mainForm.get(this.formgroupName)?.get('employmentHR')?.get('fromDate')?.value && val) &&
      this.mainForm.get(this.formgroupName)?.get('employmentHR')?.get(control)?.value < this.mainForm.get(this.formgroupName)?.get('employmentHR')?.get('fromDate')?.value) {
      this.mainForm.get(this.formgroupName)?.get('employmentHR')?.get(control)?.markAsTouched();
    }
  }
  getOption(option: any) {
    return option.name + ' | ' + (option.commonPhoneDet && option.commonPhoneDet.length > 0 ? option.commonPhoneDet[0].contactData : '') + ' | ' +
      (option.commonPhoneDet && option.commonEmailDet.length > 0 ? option.commonEmailDet[0].contactData : '');
  }
  get Supervisor(): UntypedFormGroup {
    return this.mainForm.get(this.formgroupName + '.employmentSupervisor') as UntypedFormGroup;
  }
  empkeyUpFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      this.supervisornameChangr(null, true);
      if (value) {
        const data = this.filterEmpList.filter(e =>
          e.name.toLowerCase() === value.toLowerCase());
        if (data.length > 0) {
          this.supervisornameChangr(data[0], false);
          this.empKeyup = true;
        } else {
          this.empKeyup = true;
        }
      } else {
        this.empKeyup = false;
      }
    }
  }
  get displayempFn() {
    const dataNew = (data) => {
      if (data == null || data === undefined || data === '') {
        return null;
      } else {
        if (this.filterEmpList && this.filterEmpList.length > 0) {
          data = this.empList.find(x => x.name === data);
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

  // Resource ..
  setEmpItems(value: any) {
    if (!value) { this.assignResourceCopy(); }
    if (value) {
      this.filterEmpList = Object.assign([], this.empList).filter(
        item => ((item.name.toLowerCase().indexOf(value.toLowerCase()) > -1)));
    }

  }
  assignResourceCopy() {
    this.filterEmpList = Object.assign([], this.empList);
  }


  getHRAddressForm(): UntypedFormGroup {
    return this.mainForm.get(this.formgroupName)?.get('employmentHR') as UntypedFormGroup;
  }
  getSupAddressForm(): UntypedFormGroup {
    return this.mainForm.get(this.formgroupName)?.get('employmentSupervisor') as UntypedFormGroup;
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
  public openDialog(msg: string, header: string, type: string) {
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
        if (!result && header === 'Confirmation' && type === 'employmentHR') {
          this.mainForm.get(this.formgroupName)?.get('employmentHR')?.get('employerName')?.setValue('');
        } else if (!result && header === 'Confirmation' && type === 'employmentSupervisor') {
          this.mainForm.get(this.formgroupName)?.get('employmentSupervisor')?.get('professionalName')?.setValue('');
        }
      });
    }
  }
  changeEmployer() {
    setTimeout(() => {
      const employerName = this.mainForm.get(this.formgroupName)?.get('employmentHR')?.get('employerName')?.value;
      if (this.applicationId !== 3) {

        let msg = ''; let header = '';
        if (employerName) {
          const empObj = this.empList.find(x => x.name.toLowerCase() ===
            this.mainForm.get(this.formgroupName)?.get('employmentHR')?.get('employerName')?.value.toLowerCase());
          if (empObj && this.empHrAlertCount > 0) {
            this.setEmpHRName(empObj.empInsId);
            this.empHrAlertCount = 1;
          }
          if (empObj && this.empHrAlertCount === 0) {
            if (empObj.researchResultLookupName === 'Fake') {
              this.empHrAlertCount++;
              msg = 'Employer name is matching with Fake Employer list.';
              header = 'Alert';
              this.openDialog(msg, header, 'employmentHR');

            } else if (empObj.researchResultLookupName === null || empObj.researchResultLookupId === null) {
              this.empHrAlertCount++;
              msg = 'Employer name is under research verification process.';
              header = 'Alert';
              this.openDialog(msg, header, 'employmentHR');
            }
          } else {
            if (!empObj && employerName.trim() !== '') {
              this.mainForm.get(this.formgroupName)?.get('employmentHR')?.setErrors({ notmatch: true });
              this.mainForm.get(this.formgroupName)?.get('employmentHR')?.get('address')?.reset();
              this.mainForm.get(this.formgroupName)?.get('employmentHR')?.get('address')?.get('addressId')?.setValue(0);
            }

          }
          if (this.empList.filter(x => x.name.toLowerCase() === employerName.toLowerCase()).length === 1 && empObj) {
            this.empHRAdd = new BehaviorSubject(empObj.address);
            this.empHRAdd.next(empObj.address);
          }
        }
      }
    }, 300);

  }
  setEmpHRName(empInsId: any) {
    this.empHrAlertCount = 0;
    const instn = this.empList.find(x => x.empInsId === empInsId);
    if (instn) {
      this.mainForm.get(this.formgroupName)?.get('employmentHR')?.get('employerName')?.setValue(instn.name);
      if (instn.address) {
        this.empHRAdd = new BehaviorSubject(instn.address);
        this.empHRAdd.next(instn.address);
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
  empSupkeyUpFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      this.supervisornameChangr(null, true);
      if (value) {
        const data = this.filterEmpsupList.filter(e =>
          e.name.toLowerCase() === value.toLowerCase());
        if (data.length > 0) {
          this.supervisornameChangr(data[0], false);
          this.empSupKeyup = true;
        } else {
          this.empSupKeyup = true;
        }
      } else {
        this.empSupKeyup = false;
      }
    }
  }
  notProvidevalidation(val: any) {
    if ((this.userData.applicationId === 3) && (val === 'NOT PROVIDED')) {
      this.mainForm.get(this.formgroupName)?.get('employmentHR')?.get('fromDate')?.setErrors({ incorrect: true });
    }
    else if ((this.userData.applicationId !== 3) && (val === 'NOT PROVIDED')) {
      this.mainForm.get(this.formgroupName)?.get('employmentHR')?.get('fromDate')?.setErrors(null);
    }
  }
  notProvide(val: any) {
    if ((this.userData.applicationId === 3) && (val === 'NOT PROVIDED')) {
      this.mainForm.get(this.formgroupName)?.get('employmentHR')?.get('toDate')?.setErrors({ incorrect: true });
    }
    else if ((this.userData.applicationId !== 3) && (val === 'NOT PROVIDED')) {
      this.mainForm.get(this.formgroupName)?.get('employmentHR')?.get('toDate')?.setErrors(null);
    }
  }
  changeSupervisor() {
    setTimeout(() => {
      const professionalName = this.mainForm.get(this.formgroupName)?.get('employmentSupervisor')?.get('professionalName')?.value;
      if (this.applicationId !== 3) {
        let msg = ''; let header = '';
        if (professionalName) {
          const empObj = this.empSupList.find(x => x.name.toLowerCase() === professionalName.toLowerCase());
          if (empObj && this.empSupAlertCount > 0) {
            this.setSupName(empObj.id);
            this.empSupAlertCount = 1;
          }
          if (empObj && this.empSupAlertCount === 0) {
            if (empObj.approveStatusLookupName === 'Rejected') {
              this.empSupAlertCount++;
              msg = 'Supervisor name is matching with rejected supervisor list.';
              header = 'Alert';
              this.openDialog(msg, header, 'employmentSupervisor');

            } else if (empObj.approveStatusLookupName === 'For Research') {
              this.empSupAlertCount++;
              msg = 'Supervisor name is under research verification process.';
              header = 'Alert';
              this.openDialog(msg, header, 'employmentSupervisor');
            }
          } else {
            if (!empObj && professionalName.trim() !== '') {
              this.mainForm.get(this.formgroupName)?.get('employmentSupervisor')?.get('address')?.reset();
              this.mainForm.get(this.formgroupName)?.get('employmentSupervisor')?.get('address')?.get('addressId')?.setValue(0);
              msg = 'Do you want to get approval for ' + professionalName + ' ?';
              header = 'Confirmation';
              this.openDialog(msg, header, 'employmentSupervisor');
            }

          }
          if (this.empSupList.filter(x => x.name.toLowerCase() === professionalName.toLowerCase()).length === 1 && empObj) {
            this.empSupAdd = new BehaviorSubject(empObj.address);
            this.empSupAdd.next(empObj.address);
          }
        }
      }
    }, 300);
  }
  setSupName(id: any) {
    this.empSupAlertCount = 0;
    const prof = this.empSupList.find(x => x.id === id);
    if (prof) {
      this.mainForm.get(this.formgroupName)?.get('employmentSupervisor')?.get('professionalName')?.setValue(prof.name);
    }
  }
  notApplicable(event: any) {
    this.fileBtn = event.checked;
    this.nFlag = true;
  }
  supervisornameChangr(option?, reset = false) {
    if (option || reset === true) {
      this.mainForm.get(this.formgroupName)?.get('employmentSupervisor.professionalId')?.setValue(!reset ? option.id : 0);
      this.mainForm.get(this.formgroupName)?.get('employmentSupervisor.supervisorEmail')?.patchValue({
        transContactId: (!reset && option.commonEmailDet.length > 0) ? option.commonEmailDet[0].transContactId : 0,
        destLookupId: (!reset && option.commonEmailDet.length > 0) ? option.commonEmailDet[0].destLookupId : 0,
        destName: (!reset && option.commonEmailDet.length > 0) ? option.commonEmailDet[0].destName : '',
        contactId: (!reset && option.commonEmailDet.length > 0) ? option.commonEmailDet[0].contactId : 0,
        contactData: (!reset && option.commonEmailDet.length > 0) ? option.commonEmailDet[0].contactData : '',
        lookupId: (!reset && option.commonEmailDet.length > 0) ? option.commonEmailDet[0].lookupId : 0,
      });
      this.mainForm.get(this.formgroupName)?.get('employmentSupervisor.supervisorContactNo')?.patchValue({
        transContactId: (!reset && option.commonPhoneDet.length > 0) ? option.commonPhoneDet[0].transContactId : 0,
        destLookupId: (!reset && option.commonPhoneDet.length > 0) ? option.commonPhoneDet[0].destLookupId : 0,
        destName: (!reset && option.commonPhoneDet.length > 0) ? option.commonPhoneDet[0].destName : '',
        contactId: (!reset && option.commonPhoneDet.length > 0) ? option.commonPhoneDet[0].contactId : 0,
        contactData: (!reset && option.commonPhoneDet.length > 0) ? option.commonPhoneDet[0].contactData : '',
        lookupId: (!reset && option.commonPhoneDet.length > 0) ? option.commonPhoneDet[0].lookupId : 0,
      });
      this.mainForm.get(this.formgroupName)?.get('employmentSupervisor.supervisorDesignation')?.setValue(!reset ? option.designation1 : '');
      this.mainForm.get(this.formgroupName)?.get('employmentSupervisor.supervisorCompanyName')?.setValue(!reset ? option.companyName : '');
      this.mainForm.get(this.formgroupName)?.get('employmentSupervisor.countryId')?.setValue(!reset ? option.countryId : '');
      this.mainForm.get(this.formgroupName)?.get('employmentSupervisor.city')?.setValue(!reset ? option.city : '');
    }
  }
  public openAddNewMasterData() {
    const popupData = {
      action: 'Employer',
      headerText: 'Add New Employer',
      labelText: 'Employer Name ',
      bodyText: '',
      value: this.mainForm.get(this.formgroupName)?.get('employmentHR')?.get('employerName')?.value
    };
    const dialogRef = this.dialog.open(CommonAddNewComponent, {
      width: '720px',
      data: popupData,
      disableClose: true
    });
    if (dialogRef) {
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (result.Responds != null) {
            this.master.GetInstitutionAndEmpApprovedList(true, this.userData.deptId ? this.userData.deptId : 0).subscribe(resp => {
              this.empList = resp;
              this.screeningService.employerList = resp;
              const objins = this.empList.find(f => f.empInsId === result.Responds.educationEmployerId && f.address != null && f.address.addressId === result.Responds.addressId);
              this.mainForm.get(this.formgroupName)?.get('employmentHR')?.get('employerName')?.setValue(objins.name);
              if (objins) {
                this.empHRAdd.next(objins.address);
              }
              this.mainForm.get(this.formgroupName)?.get('employmentHR')?.get('address')?.disable();
            });
          }
        }
      });
    }
  }
}
