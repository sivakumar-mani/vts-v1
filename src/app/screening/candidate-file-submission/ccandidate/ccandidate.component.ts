import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectorRef, AfterViewInit, AfterContentChecked, Output, EventEmitter, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ScreeningService } from '../../../common-methods/services/screening.service';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { BehaviorSubject } from 'rxjs';
import { ScreeningDocument } from 'src/app/common-methods/models/screening-details';
import { User } from 'src/app/common-methods/models/user';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
// import { DataTable, MessageService } from 'primeng/primeng';
import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { CandidateFileSubmissionComponent } from '../candidate-file-submission.component';
import { Table } from 'primeng/table';
import { LazyLoadEvent } from 'primeng/api';
import { MessageService } from 'primeng/api';

@Component({
  standalone: false,
  selector: 'app-ccandidate',
  templateUrl: './ccandidate.component.html',
  styleUrls: ['./ccandidate.component.css']
})
export class CcandidateComponent implements OnInit {
  // Reportoptions: string[] = ['One', 'Two', 'Three'];
  @Input() mainForm: UntypedFormGroup;
  @Input() formgroupName: string;
  @Input() screeningDocument: ScreeningDocument[] = [];
  @Input() compAddress: any;
  @Output() componentChange = new EventEmitter();
  @Input() manualFilesubmissionRE = false;
  address = new BehaviorSubject(null);
  candidateNameList: any[] = [];
  keyUp: boolean;
  candidateNameFilterList: any[] = [];
  fNamevalue: any;
  aFNameValue: any;
  applicationid: number
  maxDate = new Date();
  doctType: any[] = [];
  maritalStatus: any[] = [];
  genderDetails: any[] = [];
  phoneCodeList: any[] = [];
  filterCodeList: any[] = [];
  userData = new User();
  docHeader = 'Supporting Documents';
  points: any[] = [];
  signatureImage;
  clientControls!: AutoCompleteDropDown;
  siteControls!: AutoCompleteDropDown;
  componentControls!: AutoCompleteDropDown;
  clientList: any[] = [];
  filterCandidateList: any[] = [];
  candidateList: any[] = [];
  clientSite: any[] = [];
  subCompList: any[] = [];
  instKeyup: boolean;
  compList: any[] = [];
  subComp: any[] = [];
  alreadyEx = '';
  // addressForm: UntypedFormGroup;
  // periodofStayadd = new BehaviorSubject(null);
  subCompObj = {
    subCompId: 0,
    subCompShortName: null,
    subCompName: '',
    subCompDesc: '',
    currencyId: 0,
    deqcFlag: null,
    compId: 0,
    noOfComponent: 1,
    componentCustomFields: [],
  };
  compObj = {
    compDesc: '',
    compId: 0,
    compName: '',
    compType: '',
    currencyId: 0,
    componentCustomFields: [],
    criminalCheckCount: 1,
    cvValidationFields: [],
    deqcFlag: false,
    instruction: '',
    noOfComponent: 1,
    question: [],
    screeningSubComponent: [],
    caseSubComponent: [],
    subCompFlag: false,
  };
  // displayedColumns = [
  //   { field: 'address', header: 'Address' },
  //   { field: 'place', header: 'Place' },
  //   { field: 'district', header: 'District' },
  //   { field: 'state', header: 'State' },
  //   { field: 'city', header: 'City' },
  //   { field: 'country', header: 'Country' },
  //   { field: 'postalCode', header: 'Zip Code' },
  //   { field: 'periodOfStay', header: 'period Of Stay From - To' },
  //   { field: 'action', header: 'Action' }
  // ];
  // itemperpage = 10;
  // totalpages: number;
  //  @ViewChild('dt', { static: false }) dt!: Table;
  // currentPage = 1;
  // tempCurrentPage = 1;
  casePriorities: any[] = [];
  // tooltipName = 'Add Address';
  // rowIndex = -1;
  constructor(private cd: ChangeDetectorRef, public screeningService: ScreeningService, public common: CommonService,
    private fb: UntypedFormBuilder, private messageService: MessageService, private dialog: MatDialog, public clientFile: CandidateFileSubmissionComponent
  ) {
    this.maxDate = new Date(this.maxDate.setFullYear(this.maxDate.getFullYear() - 18));
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.compAddress) {
      this.checkAddress();
    }
  }
  ngAfterContentChecked(): void {
    if (this.userData.applicationId === 3) {
      if (this.mainForm.get(this.formgroupName + '.econsentFlag').value) {
        // this.agreeChange();
      }
      //   if (this.screeningService.caseSubmissionList) {
      //   const addressList = this.screeningService.caseSubmissionList.screeningCaseComponent.filter(x => x.compName.toLowerCase() ===
      //     this.common.ADDRESS.toLocaleLowerCase());
      //   if (addressList.length > 0) {
      //     this.hideFlag = true;
      //   } else {
      //     this.hideFlag = false;
      //   }
      // }
    }
  }
  checkAddress() {
    if (this.compAddress) {
      this.address.next(this.compAddress);
      this.cd.markForCheck();
    }
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes) {
  //     this.fNamevalue = this.mainForm.get(this.formgroupName).get('firstName')?.value;
  //     this.aFNameValue = this.mainForm.get(this.formgroupName).get('aliasFirstName')?.value;
  //     this.setItems('');
  //     setTimeout(() => {
  //       this.mainForm.get(this.formgroupName).get('firstName')?.setValue(this.fNamevalue);
  //       this.mainForm.get(this.formgroupName).get('aliasFirstName')?.setValue(this.aFNameValue);
  //     }, 100);
  //   }
  // }
  ngOnInit() {
    
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    // this.initcompref();

    this.getScreeningDocumentType();
    this.getMaritlStatus();
    this.getGenderDetails();
    const address = this.mainForm.get('candidate') as UntypedFormGroup;
    this.getPhoneCodeList();
    if (this.screeningService.caseFlagType === this.common.NEWCASE || this.manualFilesubmissionRE) {
      this.getByPassClientList();
      this.clientControls =
        new AutoCompleteDropDown('Client Name', 'clientId', 'clientId', 'clientName', this.clientList,
          '', this.mainForm.get('screening') as UntypedFormGroup, false, false, true);
      this.siteControls = new AutoCompleteDropDown('Site Name', 'siteName', 'siteName', 'siteName', this.clientSite,
        '', this.mainForm.get('screening') as UntypedFormGroup, false, true,
        (this.screeningService.caseFlagType === this.common.NEWCASE && this.clientSite.length > 0) ? true : false);
      this.componentControls = new AutoCompleteDropDown('Component', 'component', 'compId', 'compName', this.compList,
        '', this.mainForm.get('screening') as UntypedFormGroup, false, this.manualFilesubmissionRE, true);
    }
    if (this.userData.applicationId === 3) {
      this.address.next(address.getRawValue().address);
    }
    this.docHeader = this.userData.applicationId === 3 ? 'LOA Document' : 'Supporting Documents';
    if (this.mainForm.get('screening')?.get('clientId')?.value > 0 && this.screeningService.caseFlagType === this.common.NEWCASE || this.manualFilesubmissionRE) {
      this.getCandidateList(this.mainForm.get('screening')?.get('clientId')?.value);
    }
    // if (this.mainForm.get(this.formgroupName).get('periodOfStay')?.value &&
    //   this.mainForm.get(this.formgroupName).get('periodOfStayTo')?.value) {
    //   this.dateCalc();
    // }
    if (this.screeningService.caseFlagType === this.common.NEWCASE && this.mainForm.get(this.formgroupName).get('candidateId')?.value) {
      this.mainForm.get(this.formgroupName).get('candidateId')?.setValue(
        this.mainForm.get(this.formgroupName).get('aliasFirstName')?.value);
    }
    this.common.birthDate();
  }
  postalCodeValidation(list = []) {
    const country = (this.mainForm.get(this.formgroupName + '.address.countryId').value && list.length > 0) ? this.common.getNameById(list,
      'countryId', 'country', this.mainForm.get(this.formgroupName + '.address.countryId').value).toLowerCase() : '';
    // zip code validation
    if (country) {
      if (country === this.common.indiaCountry) {
        this.mainForm.get(this.formgroupName + '.address.postalCode').setValidators([Validators.required, Validators.pattern(/^[0-9]+$/)]);
      } else {
        this.mainForm.get(this.formgroupName + '.address.postalCode').clearValidators();
      }
      this.mainForm.get(this.formgroupName + '.address.postalCode').updateValueAndValidity();
    }
  }
  // initcompref() {
  //   this.addressForm = this.fb.group({
  //     screeningAddressId: new UntypedFormControl(0),
  //     screeningCompId: new UntypedFormControl(0),
  //     addressTypeId: new UntypedFormControl(0),
  //     periodOfStay: new UntypedFormControl('', this.validatedateInputStayFromwithBirt),
  //     periodOfStayTo: new UntypedFormControl('', this.validatedateInputwitTilldate ),
  //     address: this.initCommonAddress()
  //   });
  // }
  // dateCalc() {
  //   return this.fb.group({
  //     UntypedFormGroup: this.mainForm.get(this.formgroupName)
  //   },
  //     { validator: this.common.dateCompareFile('periodOfStay', 'periodOfStayTo') },
  //   );
  // }
  validateInputDate(c: UntypedFormControl) {
    const ddmmyyyyREGEX = /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
    const ddmmmyyyyREGEX = /^(0[1-9]|1\d|2\d|3[01])\/(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const mmmyyyyREGEX = /^(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const yyyyREGEX = /^(19|20)\d{2}$/;
    const sincebrithREGEX = /^(SINCE BIRTH)?$/;
    if (c.value) {
      const value = c.value.toUpperCase();
      return (sincebrithREGEX.test(value) || ddmmyyyyREGEX.test(value) ||
        ddmmmyyyyREGEX.test(value) || mmmyyyyREGEX.test(value) || yyyyREGEX.test(value)) ? null : {
          date: {
            invalidPattern: true
          }
        };
    }
  }
  validateTillDate(c: UntypedFormControl) {
    const ddmmyyyyREGEX = /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
    const ddmmmyyyyREGEX = /^(0[1-9]|1\d|2\d|3[01])\/(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const mmmyyyyREGEX = /^(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const tillDateREGEX = /^(TILL DATE)$/;
    const yyyyREGEX = /^(19|20)\d{2}$/;
    if (c.value) {
      const value = c.value.toUpperCase();
      return (tillDateREGEX.test(value) || ddmmyyyyREGEX.test(value) || ddmmmyyyyREGEX.test(value)
        || mmmyyyyREGEX.test(value) || yyyyREGEX.test(value)) ? null : {
          date: {
            invalidPattern: true
          }
        };
    }
  }
  initCommonAddress(): UntypedFormGroup {
    const candiadtevalidation = [this.validateInputDate];

    const date = [this.validateTillDate];

    return new UntypedFormGroup({
      addressId: new UntypedFormControl(0),
      addLine1: new UntypedFormControl('', Validators.required),
      addLine2: new UntypedFormControl(null),
      addLine3: new UntypedFormControl(null),
      cityId: new UntypedFormControl(null),
      districtId: new UntypedFormControl(null),
      stateId: new UntypedFormControl('', Validators.required),
      countryId: new UntypedFormControl('', Validators.required),
      postalCode: new UntypedFormControl('', Validators.required),
      locationId: new UntypedFormControl(null),
      country: new UntypedFormControl(''),
      state: new UntypedFormControl(''),
      district: new UntypedFormControl(''),
      city: new UntypedFormControl(''),
      place: new UntypedFormControl(''),
      addressPos: this.fb.array([
        this.fb.group({
          addressId: new UntypedFormControl(0),
          periodOfStay: new UntypedFormControl('', [Validators.required, this.validateInputDate]),
          periodOfStayTo: new UntypedFormControl('', [Validators.required, this.validateTillDate]),
          addressPosId: new UntypedFormControl(0),
          screeningCompId: new UntypedFormControl(0),
          reportFlag: new UntypedFormControl(false),
          validationString: new UntypedFormControl([
            "NOT PROVIDED",
            "Not Provided",
            "SINCE BIRTH",
            "TILL DATE",
          ]),
        }),
      ]),
    });
  }
  validatedateInputStayFromwithBirt(c: UntypedFormControl) {
    const ddmmyyyyREGEX = /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
    const ddmmmyyyyREGEX = /^(0[1-9]|1\d|2\d|3[01])\/(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const mmmyyyyREGEX = /^(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const yyyyREGEX = /^(19|20)\d{2}$/;
    const notProviedREGEX = /([Nn]){1}([Oo]){1}([Tt]){1}([ ]){1}([Pp]){1}([Rr]){1}([Oo]){1}([Vv]){1}([Ii]){1}([Dd]){1}([Ee]){1}([Dd]){1}?$/;
    const sincebrithREGEX = /^(SINCE BIRTH)?$/;
    if (c.value) {
      const value = c.value.toUpperCase();
      return (sincebrithREGEX.test(value) || notProviedREGEX.test(value) || ddmmyyyyREGEX.test(value) ||
        ddmmmyyyyREGEX.test(value) || mmmyyyyREGEX.test(value)) ? null : {
          date: {
            invalidPattern: true
          }
        };
    }
  }
  validatedateInputwitTilldate(c: UntypedFormControl) {
    const ddmmyyyyREGEX = /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
    const ddmmmyyyyREGEX = /^(0[1-9]|1\d|2\d|3[01])\/(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const mmmyyyyREGEX = /^(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const yyyyREGEX = /^(19|20)\d{2}$/;
    const notProviedREGEX = /^(NOT PROVIDED)$/;
    const tillDateREGEX = /^(TILL DATE)$/;
    if (c.value) {
      const value = c.value.toUpperCase();
      return (notProviedREGEX.test(value) || ddmmyyyyREGEX.test(value) || ddmmmyyyyREGEX.test(value)
        || mmmyyyyREGEX.test(value) || tillDateREGEX.test(value)) ? null : {
          date: {
            invalidPattern: true
          }
        };
    }
  }
  upperCase(val, controlName) {
    val = val.toUpperCase();
    this.mainForm.get(this.formgroupName).get(controlName).setValue(val);
    if (val.includes('NOT PROVIDED') && controlName === "periodOfStay") {
      this.mainForm.get(this.formgroupName).get('periodOfStay')?.setValue('Not Provided');
    }
    if (val.includes('NOT PROVIDED') && controlName === "periodOfStayTo") {
      this.mainForm.get(this.formgroupName).get('periodOfStayTo')?.setValue('Not Provided');
    }
  }
  getScreeningDocumentType() {
    this.screeningService.getScreeningDocumentType().subscribe(resp => {
      if (resp) {
        this.doctType = resp;
      }
    });
  }
  getByPassClientList() {
    this.screeningService.getByPassClientList(this.manualFilesubmissionRE,
      this.userData.userId, this.userData.applicationId).subscribe(resp => {
        if (resp) {
          this.clientList = resp;
          this.mainForm.get('screening.clientId')?.setValue(this.mainForm.get('screening.clientId')?.value);
          this.clientControls =
            new AutoCompleteDropDown('Client Name', 'clientId', 'clientId', 'clientName', this.clientList,
              '', this.mainForm.get('screening') as UntypedFormGroup, false, false, true);

          this.applicationid = this.userData.applicationId
          // setTimeout(() => {
          //   this.mainForm.get('screening.clientId')?.setValue(this.mainForm.get('screening.clientId')?.value);
          // }, 0);
        }
      });
  }
  getCandidateList(clientId: any) {
    this.screeningService.clientId = clientId;
    if (this.clientList.length > 0 && clientId > 0) {
      this.mainForm.get('screening.clientName')?.setValue(this.clientList.find(f => f.clientId === clientId).clientName);
    }

    this.screeningService.getClientRelatedInfo(clientId).subscribe(resp => {
      if (resp) {
        this.candidateList = resp.candidate;
        this.compList = resp.component;
        this.common.manualClientDetails = this.common.CloneObject(resp);
        this.clientSite = resp.site;
        this.screeningService.caseTypeList = resp.caseType ? resp.caseType : [];
        this.screeningService.countryList = resp.caseCountry ? resp.caseCountry : [];
        this.screeningService.dateTypeList = resp.dateType ? resp.dateType : [];
        this.clientSite.map(m => m.siteNameNO = m.siteName + ' - ' + m.siteNo);
        this.mainForm.get('screening.siteName')?.enable();
        const compid = this.mainForm.get('screening.component')?.value;
        if (compid > 0) {
          const compvalue = this.compList.find(f => f.compId === compid);
          if (compvalue && compvalue.subCompFlag) {
            this.mainForm.get('screening.subcompId')?.enable();
            this.subCompList = compvalue.subComponent;
          } else {
            this.mainForm.get('screening.subcompId')?.disable();
          }
        }
        // this.clientSite.forEach(ele => {
        //   ele.siteName = ele.siteName + ' - ' + ele.siteNo;
        // });
        // this.mainForm.get('screening.siteName')?.setValue('');
        // this.mainForm.get('screening.siteNo')?.setValue('');
        this.alreadyEx = resp.clientReferenceNo ? resp.clientReferenceNo : '';
        this.common.clientRefNoPrefix = this.alreadyEx;
        if (this.phoneCodeList.length > 0) {
          const list = this.phoneCodeList.find(x => x.countryId === resp.countryId);
          this.mainForm.get(this.formgroupName + '.countryId').setValue(list.countryId);
          this.mainForm.get(this.formgroupName + '.alternativeCountryId').setValue(list.countryId);
        }
        this.siteControls =
          new AutoCompleteDropDown('Site Name', 'siteName', 'siteName', 'siteNameNO', this.clientSite,
            '', this.mainForm.get('screening') as UntypedFormGroup, false, this.clientSite.length > 0 ? false : true,
            (this.screeningService.caseFlagType === this.common.NEWCASE && this.clientSite.length > 0) ? true : false);
        this.componentControls = new AutoCompleteDropDown('Component', 'component', 'compId', 'compName', this.compList,
          '', this.mainForm.get('screening') as UntypedFormGroup, false, this.manualFilesubmissionRE, true);
        if (this.manualFilesubmissionRE) {
          this.setCandidateItems('');
          this.candidateSelect(this.mainForm.get(this.formgroupName).get('candidateId')?.value);
          setTimeout(() => {
            this.mainForm.get(this.formgroupName).get('candidateId')?.setValue(
              this.mainForm.get(this.formgroupName).get('candidateId')?.value);
            // this.setCandidateItems();
          }, 0);
        }
      }
    });
    this.screeningService.getScreeningClientDetails(clientId).subscribe(resp => {
      if (resp) {
        this.casePriorities = resp.casePriority;
      }
    });
  }
  setSiteName(sitename: any) {
    const site = this.clientSite.find(f => f.siteName === sitename);
    if (site) {
      this.mainForm.get('screening.siteName')?.setValue(site.siteName);
      this.mainForm.get('screening.siteNo')?.setValue(site.siteNo);
    } else {
      this.mainForm.get('screening.siteName')?.setValue('');
      this.mainForm.get('screening.siteNo')?.setValue('');
    }
  }
  setSiteVlue() {
    this.mainForm.get('screening.siteName')?.setValue('');
    this.mainForm.get('screening.siteNo')?.setValue('');
    this.mainForm.get('screening.component')?.setValue([]);
    this.screeningService.componentList = [];
  }
  candidateSelect(value: any) {
    if (value > 0) {
      const candidate = this.candidateList.find(x => x.candidateId === value);

      if (candidate) {
        const tranValue = candidate.refNo ? candidate.refNo.replace(this.alreadyEx, '') : '';
        this.mainForm.get('screening.clientRefNo')?.setValue(tranValue);
        this.mainForm.get(this.formgroupName + '.countryId').setValue(candidate.countryId);
      }
    }
  }

  getMaritlStatus() {
    this.screeningService.getMaritlStatus().subscribe(resp => {
      if (resp) {
        this.maritalStatus = resp;

      }
    });
  }
  maritalStatusList(e: any) {
    if (e > 0) {
      const maritalList = this.maritalStatus.filter(x => x.lookUpId === e);
      if (maritalList.length > 0) {
        this.mainForm.get(this.formgroupName).get('maritalStatusLookupId')?.setValue(maritalList[0].lookUpId);
      }
    }
  }
  setSpouseValue(value: any) {
    if (value === this.common.UNMARRIED) {
      this.mainForm.get(this.formgroupName).get('spouseName')?.setValue('');
    } else {

    }
  }
  getPhoneCodeList() {
    this.screeningService.getPhoneCodeList().subscribe(resp => {
      this.mainForm.get(this.formgroupName).get('alternativeCountryId')?.setValue(92);
      if (resp) {
        this.phoneCodeList = resp;
        this.phoneCodeList.forEach(element => {
          element.country = element.country + ' - ' + element.countryCode;
        });
        if (this.mainForm.get('candidate.countryId')?.value !== 0) {
          // tslint:disable-next-line:no-unused-expression
          this.displayCodeFn;
        }
      }
    });
  }
  getGenderDetails() {
    this.screeningService.getGenderDetails().subscribe(resp => {
      if (resp) {
        this.genderDetails = resp;
      }
    });
  }
  scrollToTop() {
    const elements = document.querySelectorAll('mat-form-field.ng-invalid');
    if (elements.length === 0) {
      const element = document.querySelectorAll('mat-form-field.ng-valid');
      element[0].scrollIntoView(false);
    }
    if (elements.length > 0) {
      elements[0].scrollIntoView(false);
    }
  }
  showImage(data: any) {
    this.signatureImage = data;
  }
  setNames(type: any) {
    switch (type) {
      case 'FirstName':
        const fName = this.mainForm.get(this.formgroupName).get('firstName')?.value;
        this.mainForm.get(this.formgroupName).get('aliasFirstName')?.setValue(fName);
        break;
      case 'MiddleName':
        const mName = this.mainForm.get(this.formgroupName).get('middleName')?.value;
        this.mainForm.get(this.formgroupName).get('aliasMiddleName')?.setValue(mName);
        break;
      case 'LastName':
        const lName = this.mainForm.get(this.formgroupName).get('lastName')?.value;
        this.mainForm.get(this.formgroupName).get('aliasLastName')?.setValue(lName);
        break;
      default:
        break;
    }
  }
  candidateNameBind() {

    const fname = this.mainForm.get(this.formgroupName).get('aliasFirstName')?.value;
    const mname = this.mainForm.get(this.formgroupName).get('aliasMiddleName')?.value ? this.mainForm.get(this.formgroupName).get('aliasMiddleName')?.value : '';
    const lname = this.mainForm.get(this.formgroupName).get('aliasLastName')?.value ? this.mainForm.get(this.formgroupName).get('aliasLastName')?.value : '';
    if (this.mainForm.value.candidate.candidateId > 0) {
      const cList = this.filterCandidateList.filter(x => x.candidateId === this.mainForm.value.candidate.candidateId);
      if (cList.length > 0) {
        this.common.candidateName = cList[0].firstName + ' ' + cList[0].middleName + ' ' + cList[0].lastName;
      }
    } else {
      this.common.candidateName = this.mainForm.value.candidate.candidateId + ' ' + mname + ' ' + lname;
    }
  }
  public getPDFfile() {
    const options = {
      render: 'download', // force to download fix for IE
      embedLocalImages: true, // enable images in PDF
      filename: 'finalreport' // filename changed
    };
    const data = xepOnline.Formatter.Format(['report'], options);
    return data;

    // this.commonService.downloadDocument(0, this.verificationService.pdfvalue.document, this.verificationService.pdfvalue.fileName);
  }
  setCodeItems(value: any) {
    if (!value) { this.assigncodeResourceCopy(); }
    if (value) {
      this.filterCodeList = Object.assign([], this.phoneCodeList).filter(
        item => ((item.country.toLowerCase().indexOf(value.toLowerCase()) > -1)));
    }
  }
  assigncodeResourceCopy() {
    this.filterCodeList = Object.assign([], this.phoneCodeList);
  }

  codekeyUpFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        const data = this.filterCodeList.filter(e =>
          e.country.toLowerCase() === value.toLowerCase());
      }
    }
  }
  get displayCodeFn() {
    const dataNew = (data) => {
      if (data == null || data === undefined || data === '') {
        return null;
      } else {
        data = this.phoneCodeList.find(x => x.countryId === data);
        if (data === undefined) {
          return null;
        }
        return data.countryCode;
      }
    };
    return dataNew;
  }
  setCandidateItems(value: any) {
    if (!value) { this.assignCandidateResourceCopy(); }
    if (value) {
      this.filterCandidateList = Object.assign([], this.candidateList).filter(
        item => ((item.firstName ? item.firstName.toLowerCase().indexOf(value.toLowerCase()) > -1 : '')
          || (item.middleName ? item.middleName.toLowerCase().indexOf(value.toLowerCase()) > -1 : '') ||
          (item.lastName ? item.lastName.toLowerCase().indexOf(value.toLowerCase()) > -1 : '')));
    }

  }
  handleDateChange(date, controlName) {
    this.mainForm.get(this.formgroupName).get(controlName).setValue(new DatePipe('en-Us').transform(date.value, 'dd/MMM/yyyy'))
    this.upperCase(this.mainForm.get(this.formgroupName).get(controlName).value, controlName);
    //this.touchValidation(date.value, controlName);
  }
  touchValidation(val, controlName) {
    if ((this.mainForm.get(this.formgroupName).get('periodOfStay')?.value && val) &&
      this.mainForm.get(this.formgroupName).get(controlName).value < this.mainForm.get(this.formgroupName).get('periodOfStay')?.value) {
      this.mainForm.get(this.formgroupName).get(controlName).markAsTouched();
    }
  }
  assignCandidateResourceCopy() {
    this.filterCandidateList = Object.assign([], this.candidateList);
  }
  candikeyUpFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        const data = this.filterCandidateList.filter(e =>
          e.firstName ? e.firstName.toLowerCase() : '' === value.toLowerCase() ||
            e.middleName ? e.middleName.toLowerCase() : '' === value.toLowerCase() ||
              e.lastName ? e.lastName.toLowerCase() : '' === value.toLowerCase() ||
                e.refNo ? e.refNo.toLowerCase() : '' === value.toLowerCase());
        if (data.length > 0) {
          this.instKeyup = true;
        } else {
          this.instKeyup = true;
        }
      } else {
        this.instKeyup = false;
      }
    }
  }

  get displayCandidateFn() {
    const dataNew = (data) => {
      if (data == null || data === undefined || data === '') {
        return null;
      } else {
        if (isNaN(data)) {
          return data;
        } else {
          if (this.filterCandidateList && this.filterCandidateList.length > 0) {
            data = this.candidateList.find(x => x.candidateId === data);
            if (data === undefined) {
              return null;
            }
            return data.firstName;
          } else {
            return null;
          }
        }
      }
    };
    return dataNew;
  }

  assignResourceCopy() {
    this.filterCandidateList = Object.assign([], this.candidateList);
  }
  setInstnName(empInsId: any) {
    const instn = this.candidateList.find(x => x.candidateId === empInsId);
    if (instn) {
      this.mainForm.get(this.formgroupName).get('firstName')?.setValue(instn.firstName);
      this.mainForm.get(this.formgroupName).get('middleName')?.setValue(instn.middleName);
      this.mainForm.get(this.formgroupName).get('lastName')?.setValue(instn.lastName);
      this.mainForm.get(this.formgroupName).get('aliasFirstName')?.setValue(instn.firstName);
      this.mainForm.get(this.formgroupName).get('aliasMiddleName')?.setValue(instn.middleName);
      this.mainForm.get(this.formgroupName).get('aliasLastName')?.setValue(instn.lastName);
    } else {
      // this.mainForm.get(this.formgroupName).get('address')?.enable();
    }
  }
  changeCandidate(candidateId: any) {
    if (candidateId && candidateId > 0) {
      this.setInstnName(candidateId);
    } else {
      // this.mainForm.get(this.form groupName).get('candidateId')?.setValue(0);
      this.mainForm.get('screening.clientRefNo')?.setValue('');
      this.mainForm.get(this.formgroupName).get('firstName')?.setValue(candidateId);
      this.mainForm.get(this.formgroupName).get('aliasFirstName')?.setValue(candidateId);
    }
  }
  compSelectionChange(event: any) {
    const selectedCompo: any[] = [];
    const fdata: any[] = [];
    this.subCompList = [];
    const compvalue = this.compList.find(f => f.compId === event);
    selectedCompo.push(compvalue);
    this.subCompList = compvalue.subComponent;

    // selectedCompo = Object.assign([], event.value);
    if (selectedCompo.length > 0) {
      selectedCompo.map(element => {
        this.compObj = {
          compDesc: element.subCompFlag === true ? element.subCompDesc : element.compDesc,
          compId: element.compId,
          compName: element.compName,
          compType: '',
          componentCustomFields: element.componentCustomFields,
          criminalCheckCount: 1,
          currencyId: element.currencyId,
          cvValidationFields: [],
          deqcFlag: element.deqcFlag,
          instruction: '',
          noOfComponent: 1,
          question: element.question ? element.question : [],
          screeningSubComponent: [],
          caseSubComponent: [],
          subCompFlag: element.subCompFlag,
        };
        fdata.push(this.compObj);
        this.screeningService.componentList = fdata;
        if (!element.subCompFlag) {
          this.mainForm.get('screening.subcompId')?.disable();
          this.componentChange.emit();
        } else {
          this.mainForm.get('screening.subcompId')?.enable();
        }
        // fdata.push(this.compObj);
      });
    }
    // this.screeningService.componentList = fdata;
  }
  selectSubcomponent(event: any) {
    const subcomp: any[] = [];
    const subCompValue = this.subCompList.find(f => f.subCompId === event.value);
    if (subCompValue) {
      this.subCompObj = {
        subCompId: subCompValue.subCompId,
        subCompShortName: subCompValue.subCompShortName,
        subCompName: subCompValue.subCompName,
        currencyId: subCompValue.currencyId,
        subCompDesc: subCompValue.subCompDesc,
        deqcFlag: subCompValue.deqcFlag,
        compId: subCompValue.compId,
        componentCustomFields: subCompValue.componentCustomFields,
        noOfComponent: 1
      };
      subcomp.push(this.subCompObj);
      this.screeningService.componentList[0].caseSubComponent = subcomp;
      this.screeningService.componentList[0].screeningSubComponent = subcomp;
      this.componentChange.emit();
    }
  }
  isExist() {
    if (this.mainForm.get('screening')?.get('clientRefNo')?.valid) {
      this.screeningService.checkClientReferenceNo(this.alreadyEx + this.mainForm.get('screening')?.get('clientRefNo')?.value,
        this.mainForm.get('screening')?.get('clientId')?.value,
        this.mainForm.get(this.formgroupName).get('candidateId')?.value).subscribe(e => {
          if (!e.success) {
            this.mainForm.get('screening')?.get('clientRefNo')?.setErrors({ exist: true });
            // this.showTopCenter('warn', 'Exist', e.message);
          } else {
            this.mainForm.get('screening')?.get('clientRefNo')?.setValidators(Validators.required);
            // this.mainForm.get(this.formgroupName).get('clientRefNo')?.setValidators(Validators.pattern(/(^[A-Za-z1-9]$)/));
          }
        });
    }
  }
  checkRefNum(val: any) {
    if (val && this.common.clientRefNoPrefix) {
      this.mainForm.get('screening')?.get('clientRefNo')?.setValidators([Validators.pattern(/(^[1-9]\d{0,8}$)/), Validators.required]);
      this.mainForm.get('screening')?.get('clientRefNo')?.updateValueAndValidity();
    } else {
      this.mainForm.get('screening')?.get('clientRefNo')?.setValidators(Validators.required);
    }
  }
  // notApplicable(val: any) {
  //   if((this.userData.applicationId === 3) && (val === 'NOT PROVIDED')) {
  //     this.mainForm.get(this.formgroupName).get('dob')?.setErrors({incorrect : true});
  //   }
  //   else if((this.userData.applicationId !== 3) && (val === 'NOT PROVIDED')) {
  //     this.mainForm.get(this.formgroupName).get('dob')?.setErrors(null);
  //   }
  // }
  // notProvidevalidation(val: any) {
  //   if ((this.userData.applicationId === 3) && (val === 'NOTPROVIDED') || val === 'NOT PROVIDED') {
  //     this.mainForm.get(this.formgroupName).get('periodOfStay')?.setErrors({ incorrect: true });
  //   }
  // }
  // notProvide(val: any) {
  //   if ((this.userData.applicationId === 3) && (val === 'NOTPROVIDED') || val === 'NOT PROVIDED') {
  //     this.mainForm.get(this.formgroupName).get('periodOfStayTo')?.setErrors({ incorrect: true });
  //   }
  // }
  // navigateNxtPrevPage(pageNo, rows) {
  //   this.currentPage = pageNo / rows;
  //   this.tempCurrentPage = this.currentPage;
  // }
  // navigatePage(pageNo, rowscount) {
  //   if (+pageNo > this.totalpages || +pageNo <= 0) {
  //     this.currentPage = this.tempCurrentPage;
  //   } else {
  //     this.dt.onPageChange({ first: ((pageNo - 1) * rowscount), rows: rowscount });
  //     this.tempCurrentPage = this.currentPage;
  //   }
  // }
  // getTotalPages(totalRecords, rows) {
  //   this.totalpages = Math.ceil((totalRecords) / rows);
  //   return Math.ceil((totalRecords) / rows);
  // }
  // showall() {
  //   // if (this.placeList.length > 0) {
  //   //   this.itemperpage = this.placeList.length;
  // }
  // addUpdateAddress(action: any) {
  //   if (this.addressForm.valid) {
  //     if (this.rowIndex === -1) {
  //       this.mainForm.get(this.formgroupName + '.periodOfStayAddress').value.push(this.addressForm.value);
  //       // this.showNotification('success', 'Success Message', 'Approved Successfully');
  //     } else {
  //       this.mainForm.get(this.formgroupName + '.periodOfStayAddress').value[this.rowIndex] = this.addressForm.value;
  //     }
  //     this.reserAddressForm();
  //   } else {
  //     this.addressForm.markAllAsTouched();
  //   }
  // }
  // editAddress(rowData, index) {
  //   this.rowIndex = index;
  //   this.addressForm.patchValue(rowData);
  //   this.periodofStayadd.next(rowData.address);
  // }
  // reserAddressForm() {
  //   this.rowIndex = -1;
  //   this.addressForm.reset();
  //   this.addressForm.get('screeningAddressId')?.setValue(0);
  //   this.addressForm.get('address.addressId')?.setValue(0);
  // }
  showNotification(severity1, summary1, message) {
    this.messageService.add({ severity: severity1, summary: summary1, detail: message });
  }

}
