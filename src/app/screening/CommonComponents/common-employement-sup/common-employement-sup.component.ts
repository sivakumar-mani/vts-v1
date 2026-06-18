import { Component, OnInit, Input, SimpleChanges, OnChanges, ChangeDetectorRef } from '@angular/core';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { ScreeningComponentInfo } from 'src/app/common-methods/models/screening-details';
import { User } from 'src/app/common-methods/models/user';
import { BehaviorSubject } from 'rxjs';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';
import { CommonAddNewComponent } from '../common-add-new/common-add-new.component';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
@Component({
  standalone: false,
  selector: 'app-common-employement-sup',
  templateUrl: './common-employement-sup.component.html',
  styleUrls: ['./common-employement-sup.component.css']
})
export class CommonEmployementSupComponent implements OnInit, OnChanges {
  compName: any;
  screeningComponent = new ScreeningComponentInfo();
  baseInfo: any;
  naFlag = false;
  nFlag = false
  empSupList: any[] = [];
  filterEmpsupList: any[] = [];
  @Input() formgroupName: string;
  @Input() mainForm: UntypedFormGroup;
  @Input() compBaseDetails: any;
  @Input() fileBtn: boolean;
  @Input() compAddress: any;
  @Input() docList: any;
  @Input() showNotApplicable: boolean;
  @Input() hiddenInsuff: boolean;
  @Input() employmentData: any;
  docdata: any[] = [];
  userData = new User();
  address = new BehaviorSubject(null);
  showInSuff: boolean;
  empSupKeyup: boolean;
  applicationId: number;
  setBlur: boolean;
  countryControls!: AutoCompleteDropDown;
  countryList: any[] = [];
  constructor(private cd: ChangeDetectorRef, public screeningService: ScreeningService,
    private dialog: MatDialog, public common: CommonService, private master: MasterService) { }
  ngOnChanges(changes: SimpleChanges) {

    if (changes.compAddress) {
      // this.checkAddress();
    }
    if (changes.compBaseDetails) {
      this.baseInfo = this.compBaseDetails;
      // this.empSupList = this.baseInfo !== undefined ? this.baseInfo.professionalReference : this.empSupList;
      this.empSupList = this.screeningService.employerSupList;
      if (this.userData.applicationId === 3) {
        this.addnewsupervisorname();
      }
      // if (this.screeningService.tempEmpSupList.length > 0) {
      //   this.empSupList = this.empSupList.filter(x => x.id !== 0);
      //   this.empSupList.push(this.screeningService.tempEmpSupList[0]);
      // }
      this.setEmpsupItems('');
      this.mainForm.get(this.formgroupName).get('professionalName')?.
        setValue(this.mainForm.get(this.formgroupName).get('professionalName')?.value);
    }
  }
  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.applicationId = this.userData.applicationId;
    //this.getCountryList();
    if(this.screeningComponent.componentDocument.length==0){               
      this.screeningComponent.componentDocument = this.mainForm.get('screeningComponentInfo')?.get('componentDocument')?.value;
      }
    this.empSupList = this.screeningService.employerSupList.length!=0?this.screeningService.employerSupList:[];
    
    if(this.screeningService.countryList.length > 0) {
      this.countryControls =
      new AutoCompleteDropDown('Country', 'countryId', 'countryId', 'country', this.screeningService.countryList,
        '', this.mainForm.get('compRef') as UntypedFormGroup, false, false, false);
    }
    else {
      this.master.GetCountryList().subscribe(res => {
        if (res) {
          this.countryList = res;
          this.countryControls =
            new AutoCompleteDropDown('Country', 'countryId', 'countryId', 'country', this.countryList,
              '', this.mainForm.get('compRef') as UntypedFormGroup, false, false, false);
        }
      });
    }
    
    if (this.mainForm.get('screeningComponentInfo')?.get('insuffRaisedFlag')?.value === true) {
      this.docdata = this.mainForm.get('screeningInsufficiency')?.get('insuffDocument')?.value;
    }
    this.setEmpsupItems('');
    this.showInsuff();
    this.addnewsupervisorname();
    if (this.userData.applicationId === 3) {
      this.autobinddata();
    }
    let compNameList = this.screeningService.componentList.filter(x => x.compId === this.mainForm.value.screeningComponentInfo.compId);
    if (compNameList.length > 0) {
      this.compName = compNameList[0].compName;
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
  // checkAddress() {
  //   this.address.next(this.compAddress);
  //   this.cd.markForCheck();
  // }
  getAddressForm(): UntypedFormGroup {
    return this.mainForm.get(this.formgroupName) as UntypedFormGroup;
  }
  addnewsupervisorname() {
    if (this.employmentData && this.employmentData.data) {
      const supervisorname = this.employmentData.data.component[this.employmentData.index].compRef.supervisorDet ?
        this.employmentData.data.component[this.employmentData.index].compRef.supervisorDet.supervisorName : '';
      if (!this.screeningService.employerSupList.some(s => s.name === supervisorname)) {
        this.screeningService.employerSupList.push({
          additionalInformation: null,
          additionalInformationSub: null,
          address: {},
          addressTransId: 0,
          approveStatusLookupId: 0,
          approveStatusLookupName: 'For Research',
          cin: null,
          commonEmailDet: null,
          commonPhoneDet: null,
          contactPerson1: null,
          contactPerson2: null,
          dateOfRegistration: null,
          department1: null,
          department2: null,
          designation1: null,
          designation2: null,
          empFlag: false,
          forFakeFlag: false,
          forResearchFlag: false,
          id: 0,
          institutionTypeId: 0,
          loggedId: 0,
          modeId: 0,
          name: supervisorname,
          onlineUrl: null,
          pageType: 0,
          researchStatusId: 0,
          roc: null,
          screeningCompId: 0,
          type: null,
        });
      }
    }
  }
  autobinddata() {
    const srccompid = this.mainForm.get('screeningComponentInfo')?.get('screeningCompId')?.value;
    if (srccompid === 0) {
      if (!this.mainForm.get('compRef')?.get('professionalName')?.value) {
        if (this.employmentData && this.employmentData.data) {
          const supervisorname = this.employmentData.data.component[this.employmentData.index].compRef.supervisorDet.supervisorName;
          if (!this.screeningService.employerSupList.some(s => s.name === supervisorname)) {
            this.screeningService.employerSupList.push({
              additionalInformation: null,
              additionalInformationSub: null,
              address: {},
              addressTransId: 0,
              approveStatusLookupId: 0,
              approveStatusLookupName: 'For Research',
              cin: null,
              commonEmailDet: null,
              commonPhoneDet: null,
              contactPerson1: null,
              contactPerson2: null,
              dateOfRegistration: null,
              department1: null,
              department2: null,
              designation1: null,
              designation2: null,
              empFlag: false,
              forFakeFlag: false,
              forResearchFlag: false,
              id: 1,
              institutionTypeId: 0,
              loggedId: 0,
              modeId: 0,
              name: supervisorname,
              onlineUrl: null,
              pageType: 0,
              researchStatusId: 0,
              roc: null,
              screeningCompId: 0,
              type: null,
            });
          }
          if (this.employmentData.data.component[this.employmentData.index]) {
            this.mainForm.get(this.formgroupName).get('professionalName')?.setValue(supervisorname);
            const supervisorDet = this.employmentData.data.component[this.employmentData.index].compRef.supervisorDet;
            this.mainForm.get(this.formgroupName).get('professionalId')?.setValue(supervisorDet.id);
            this.mainForm.get(this.formgroupName).get('supervisorEmail')?.patchValue({
              transContactId: supervisorDet.transContactId,
              destLookupId: supervisorDet.supervisorEmail.destLookupId,
              destName: supervisorDet.supervisorEmail.destName,
              contactId: supervisorDet.supervisorEmail.contactId,
              contactData: supervisorDet.supervisorEmail.contactData,
              lookupId: supervisorDet.supervisorEmail.lookupId,
            });
            this.mainForm.get(this.formgroupName).get('supervisorContactNo')?.patchValue({
              transContactId: supervisorDet.supervisorContactNo.transContactId,
              destLookupId: supervisorDet.supervisorContactNo.destLookupId,
              destName: supervisorDet.supervisorContactNo.destName,
              contactId: supervisorDet.supervisorContactNo.contactId,
              contactData: supervisorDet.supervisorContactNo.contactData,
              lookupId: supervisorDet.supervisorContactNo.lookupId,
            });
            this.mainForm.get(this.formgroupName).get('supervisorDesignation')?.setValue(supervisorDet.supervisorDesignation);
            this.mainForm.get(this.formgroupName).get('countryId')?.setValue(supervisorDet.countryId);
            this.mainForm.get(this.formgroupName).get('city')?.setValue(supervisorDet.city);
            const countrydata = this.common.countryList.find(f => f.countryId === this.mainForm.get(this.formgroupName).get('countryId')?.value);
            this.employmentData.data.component[this.employmentData.index].compRef.supervisorDet.country = countrydata.country;
            this.mainForm.get(this.formgroupName).get('country')?.setValue(supervisorDet.country);
            // this.address.next(this.employmentData.data.component[this.employmentData.index].compRef.supervisorDet.address);
          }
        }
        // this.mainForm.get('compRef')?.get('professionalName')?.setValue()
      }
    }
  }
  supervisornameChangr(option?, reset = false) {
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
      this.mainForm.get(this.formgroupName).get('countryId')?.setValue(!reset ? option.countryId : '');
      this.mainForm.get(this.formgroupName).get('country')?.setValue(!reset ? option.country : '');
      this.mainForm.get(this.formgroupName).get('city')?.setValue(!reset ? option.city : '');
    }
    this.setCountryName(this.mainForm.get(this.formgroupName).get('countryId')?.value);
  }
  get Supervisor(): UntypedFormGroup {
    return this.mainForm.get(this.formgroupName) as UntypedFormGroup;
  }
  getName(option: any) {
    return option.name + '  |  ' + option.address.country + ' | ' + option.address.state + ' | ' + option.address.district;
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
        item => (((item.name ? item.name.toLowerCase() : '').indexOf(value.toLowerCase()) > -1)
          // || ((item.address.state ? item.address.state.toLowerCase() : '').indexOf(value.toLowerCase()) > -1) ||
          // ((item.address.district ? item.address.district.toLowerCase() : '').indexOf(value.toLowerCase()) > -1)
        ));
    }
  }
  assignEmpsupResourceCopy() {
    this.filterEmpsupList = Object.assign([], this.empSupList);
    if (!this.mainForm.get(this.formgroupName).get('professionalName')?.value) {
      this.mainForm.get(this.formgroupName).get('supervisorEmail')?.get('contactData')?.setValue('');
      this.mainForm.get(this.formgroupName).get('supervisorContactNo')?.get('contactData')?.setValue('');
      this.mainForm.get(this.formgroupName).get('supervisorDesignation')?.setValue('');
      this.mainForm.get(this.formgroupName).get('countryId')?.setValue('');
      this.mainForm.get(this.formgroupName).get('country')?.setValue('');
      this.mainForm.get(this.formgroupName).get('city')?.setValue('');
    }
  }
  empkeyUpFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      // this.supervisornameChangr(null, true);
      // this.mainForm.get(this.formgroupName).get('professionalId')?.setValue(0);
      if (value) {
        const data = this.filterEmpsupList.filter(e =>
          e.name ? e.name.toLowerCase() : '' === value.toLowerCase());
        if (data.length > 0) {
          // this.supervisornameChangr(data[0], false);
          // this.mainForm.get(this.formgroupName).get('professionalId')?.setValue(data[0].id);
          this.empSupKeyup = true;
        } else {
          // this.mainForm.get(this.formgroupName).get('professionalName')?.setErrors({ notfound: true });
          this.empSupKeyup = true;
        }
      } else {
        this.empSupKeyup = false;
      }
    }
  }
  // supervisornameChangr(id: any) {
  //   if (id) {
  //     this.mainForm.get(this.formgroupName).get('professionalId')?.setValue(id);
  //   }
  // }
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
  getOption(option: any) {
    return option.name + ' | ' + (option.commonPhoneDet && option.commonPhoneDet.length > 0 ? option.commonPhoneDet[0].contactData : '') + ' | ' +
      (option.commonEmailDet && option.commonEmailDet.length > 0 ? option.commonEmailDet[0].contactData : '');
  }

  changeSupervisor() {
    setTimeout(() => {
      const professionalName = this.mainForm.get(this.formgroupName).get('professionalName')?.value;
      if (this.applicationId !== 3) {
        let msg = ''; let header = '';
        const empObj = this.empSupList.find(x => x.name ? x.name.toLowerCase() : x.name === professionalName.toLowerCase());
        if (empObj) {
          this.address = new BehaviorSubject(empObj.address);
          this.address.next(empObj.address);
          // if (empObj.approveStatusLookupName === 'Rejected') {
          //   msg = 'Supervisor name is matching with rejected supervisor list.';
          //   header = 'Alert';
          //   this.openDialog(msg, header);

          // } else if (empObj.approveStatusLookupName === 'For Research') {
          //   msg = 'Supervisor name is under research verification process.';
          //   header = 'Alert';
          //   // this.openDialog(msg, header);
          // }
        } else {
          if (!this.setBlur && professionalName.trim() !== '') {
            this.mainForm.get(this.formgroupName).get('professionalName')?.setErrors({ notmatch: true });
            // this.screeningService.tempEmpSupList = this.screeningService.tempEmpSupList.filter(x => x.id !== 0);
            // this.screeningService.tempEmpSupList.push({
            //   address: null,
            //   id: 0,
            //   name: professionalName,
            // });
            this.mainForm.get(this.formgroupName).get('address')?.reset();
            this.mainForm.get(this.formgroupName).get('address')?.get('addressId')?.setValue(0);
            // msg = 'Do you want to get approval for ' + professionalName + ' ?';
            // header = 'Confirmation';
            // this.openDialog(msg, header);
          }

        }
        if (this.empSupList.filter(x => x.name ? x.name.toLowerCase() : x.name === professionalName.toLowerCase()).length === 1 && empObj) {
          this.address = new BehaviorSubject(empObj.address);
          this.address.next(empObj.address);
        }
      }
    }, 300);

  }
  setSupName(id: any) {
    this.setBlur = false;
    const prof = this.empSupList.find(x => x.id === id);
    if (prof) {
      this.mainForm.get(this.formgroupName).get('professionalName')?.setValue(prof.name);
      this.address = new BehaviorSubject(prof.address);
      this.address.next(prof.address);
    }
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
  setCountryName(data: any) {
    const countrydata = this.countryList.find(f => f.countryId === data);
    if (countrydata) {
      this.mainForm.get('compRef.country')?.setValue(countrydata.country);
    }
  }
  upperValue(val, control) {
    val = val.toUpperCase();
    this.mainForm.get(this.formgroupName).get(control).setValue(val);

    if (val.includes('NOT PROVIDED') && control === "contactNo") {
      this.mainForm.get(this.formgroupName).get('supervisorContactNo.contactData')?.setValue('Not Provided');
      this.common
    }
    if (val.includes('NOT PROVIDED') && control === "contactEmail") {
      this.mainForm.get(this.formgroupName).get('supervisorEmail.contactData')?.setValue('Not Provided');
    }

  }
  notprovidedco(val: any) {
    if (val === 'NOT PROVIDED') {
      this.mainForm.get(this.formgroupName).get('contactData')?.setErrors({ incorrect: true });
    }
  }
  notprovidedmail(val: any) {
    if (val === 'NOT PROVIDED') {
      this.mainForm.get(this.formgroupName).get('contactData')?.setErrors({ incorrect: true });
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
    this.naFlag = true;
  }
  public openAddNewMasterData() {
    // this.initFormGroup();
    const popupData = {
      action: 'ProfessionalReference',
      headerText: 'Add New Supervisor Name',
      labelText: 'Supervisor Name',
      bodyText: '',
    };
    const dialogRef = this.dialog.open(CommonAddNewComponent, {
      width: '720px',
      data: popupData,
      disableClose: true
    });
    if (dialogRef) {
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (result.Responds > 0) {
            this.master.GetProfessionalReferenceApprovedList().subscribe(resp => {
              this.empSupList = resp;
              this.screeningService.employerSupList = resp;
              // this.instnList = resp; this.screeningService.institutionList = resp;
              const objins = this.empSupList.find(f => f.id === result.Responds);
              this.mainForm.get(this.formgroupName).get('professionalName')?.setValue(objins.name);
              this.address.next(objins.address);
              this.mainForm.get(this.formgroupName).get('address')?.disable();
            });
          }
        }
        if (!result) {
          // this.mainForm.get(this.formgroupName).get('major')?.setValue('');
        }
      });
    }
  }
}
