import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectorRef, Output, EventEmitter, getPlatform, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators, UntypedFormArray, UntypedFormBuilder, Form } from '@angular/forms';
import { MasterService } from '../../services/master.service';
import { AutoCompleteDropDown } from '../../models/autoComplete';
import { Observable } from 'rxjs';
import { AgentEntryMasterService } from '../../services/agent-entry-master.service';
import { CommonService } from '../../services/common.service';
import { MatDialog } from '@angular/material/dialog';
import { AddAddressDetailComponent } from '../add-address-detail/add-address-detail.component';
import { MessageService } from 'primeng/api';
import { SharedService } from '../../services/shared.service';
import { ScreeningService } from '../../services/screening.service';
// import { DataTable } from 'primeng/table';
import { User } from 'src/app/common-methods/models/user';
import { CommonAlertsComponent } from '../../common-alerts/common-alerts.component';
import { DatePipe } from '@angular/common';
import { Table } from 'primeng/table';
// ✅ Correct imports (Angular 11 / 12)
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  standalone: false,
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit, OnChanges {
  userdata = new User();
  AddFlag = false;
  itemperpage: number;
  addressPOSarray: UntypedFormArray;
  @Input() compBaseDetails: any;
  @Input() isCriminalDB: boolean;
  @Input() addressformgrp: UntypedFormGroup;
  @Input() formgroupName = 'address';
  @Input() countryControl = new UntypedFormControl();
  @Input() addressList: Observable<any>;
  @Output() eventValidation = new EventEmitter();
  @Input() compId: any;
  @Input() subcompId: any;
  @Input() ssn: boolean;
  countryList: any[] = [];
  stateList: any[] = [];
  districtList: any[] = [];
  countrySelect!: AutoCompleteDropDown;
  stateSelect!: AutoCompleteDropDown;
  countryfilterlist: any[] = [];
  statefilterlist: any[] = [];
  districtfilterlist: any[] = [];
  cityfilterlist: any[] = [];
  cityList: any[] = [];
  placefilterlist: any[] = [];
  zipCodefilterlist: any[] = [];
  placeList: any[] = [];
  zipCodeList: any[] = [];
  tempPlaceList = [
    { locationId: 1, locationName: 'Nikenbah', postalCode: '787870' },
    { locationId: 2, locationName: 'Clairview', postalCode: '458760' },
    { locationId: 3, locationName: 'Bonalbo', postalCode: '604897' },
    { locationId: 4, locationName: 'Gnarwarre', postalCode: '7841003' },
    { locationId: 5, locationName: 'North Carolina', postalCode: '656556' },
    { locationId: 6, locationName: 'South Carolina', postalCode: '658877' }];
  state: Observable<any[]>;
  siteFormGroup: UntypedFormGroup;
  maxDateValue: Date | null = null;
  stateKeyup = false;
  sKeyup = false;
  distKeyup = false;
  cityKeyup = false;
  placeKeyup = false;
  zipKeyup = false;
  datavalue: any;
  bindAddress: any;
  zipCodeBind = false;
  indianClient: boolean;
  addressDetailList: any[] = [];
  @ViewChild('addressTemplate', { static: true }) addressTemplate!: TemplateRef<any>;
  @ViewChild('PincodePopUp', { static: true }) PincodePopUp: any;
  @ViewChild('dtable', { static: true }) dtable!: Table;
  addressColumns = [
    { field: 'sno', header: 'S.No' },
    { field: 'postalCode', header: 'Zip Code' },
    { field: 'addLine1', header: 'Address' },
    { field: 'country', header: 'Country' },
    { field: 'state', header: 'State' },
    { field: 'district', header: 'District' },
  ];
  totalpages: number;
  currentPage = 1;
  tempCurrentPage = 1;
  dialogRef: any;
  Message: any;
  posFromDate: Date;
  getcompName: string;
  // tslint:disable-next-line:max-line-length
  constructor(private masterService: MasterService, private cd: ChangeDetectorRef, private dialog: MatDialog, public screening: ScreeningService,
    public agentEntryMasterService: AgentEntryMasterService, private fb: UntypedFormBuilder, public common: CommonService, private message: MessageService, private sharedService: SharedService,
    private messageService: MessageService,) {
  }
  ngOnChanges(changes: SimpleChanges) {
    this.countryList = this.common.countryList;
    this.stateList = this.common.stateList;
    this.districtList = this.common.districtList;
    if (changes.addressList) {
      this.checkAddress();
    }
  }
  checkAddress() {
    this.zipCodeBind = false;
    if (this.addressList) {
      this.addressList.subscribe(data => {
        if (data) {
          this.datavalue = data;
          this.addressformgrp.get(this.formgroupName + '.addLine1')?.setValue(this.datavalue.addLine1);
          this.addressformgrp.get(this.formgroupName + '.addLine2')?.setValue(this.datavalue.addLine2);
          this.addressformgrp.get(this.formgroupName + '.addLine3')?.setValue(this.datavalue.addLine3);
          this.addressformgrp.get(this.formgroupName + '.postalCode')?.setValue(this.datavalue.postalCode);

          if (this.datavalue) {

            if (this.datavalue.countryId) {
              this.addressformgrp.get(this.formgroupName + '.countryId')?.setValue(this.datavalue.countryId);
            }
            this.setCountryName(this.datavalue.countryId);
            this.selectcountry();
            this.addressChange();
            if (this.common.addFlag === true) {
              this.getAddressDetailByZipCode(true);
            }
            if (this.datavalue.addressPos ? this.datavalue.addressPos.length : 0 > 0) {

              this.addressformgrp.get(this.formgroupName + '.addressPos')?.setValue(this.datavalue.addressPos);
            }
            this.common.addFlag = false;
          }
          this.cd.markForCheck();
        }
      });
    }
  }

  addressPos() {
    const dFlag = this.addressformgrp.get(this.formgroupName + '.postalCode') as UntypedFormControl;
    if (dFlag != null) {
      if (dFlag.status === 'DISABLED') {
        (this.addressformgrp.get(this.formgroupName + '.addressPos') as UntypedFormArray).controls.forEach(control => {
          control.disable();
        })
      }
    }
    return ((this.addressformgrp.get(this.formgroupName + '.addressPos')) as UntypedFormArray).controls;

  }

  validatedateInputwitTilldate(c: UntypedFormControl) {
    const ddmmyyyyREGEX =
      /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
    const ddmmmyyyyREGEX =
      /^(0[1-9]|1\d|2\d|3[01])\/(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const mmmyyyyREGEX =
      /^(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const yyyyREGEX = /^(19|20)\d{2}$/;
    const notProviedREGEX = /^(NOT PROVIDED)$/;
    const tillDateREGEX = /^(TILL DATE)$/;
    if (c.value) {
      const value = c.value.toUpperCase();
      return notProviedREGEX.test(value) ||
        tillDateREGEX.test(value) ||
        ddmmyyyyREGEX.test(value) ||
        ddmmmyyyyREGEX.test(value) ||
        mmmyyyyREGEX.test(value) ||
        yyyyREGEX.test(value)
        ? null
        : {
          date: {
            invalidPattern: true,
          },
        };
    }
  }
  validatedateInputStayFromwithBirt(c: UntypedFormControl) {
    const ddmmyyyyREGEX =
      /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
    const ddmmmyyyyREGEX =
      /^(0[1-9]|1\d|2\d|3[01])\/(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const mmmyyyyREGEX =
      /^(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
    const yyyyREGEX = /^(19|20)\d{2}$/;
    const notProviedREGEX =
      /([Nn]){1}([Oo]){1}([Tt]){1}([ ]){1}([Pp]){1}([Rr]){1}([Oo]){1}([Vv]){1}([Ii]){1}([Dd]){1}([Ee]){1}([Dd]){1}?$/;
    const sincebrithREGEX = /^(SINCE BIRTH)?$/;
    // const yearsREGEX = /^([0-9]){2}( YEARS)?$/;
    // const yearREGEX = /^(([1])( YEAR)|[2-9]{2}( YEARS))?$/;
    if (c.value) {
      const value = c.value.toUpperCase();
      return sincebrithREGEX.test(value) ||
        notProviedREGEX.test(value) ||
        ddmmyyyyREGEX.test(value) ||
        ddmmmyyyyREGEX.test(value) ||
        mmmyyyyREGEX.test(value) ||
        yyyyREGEX.test(value)
        ? null
        : {
          date: {
            invalidPattern: true,
          },
        };
    }
  }

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




  addPos() {

    let array = (this.addressformgrp.get(this.formgroupName + '.addressPos')) as UntypedFormArray;
    if (this.addressformgrp.get(this.formgroupName + '.addressPos').valid) {
      array.push(this.fb.group({
        addressId: new UntypedFormControl(0),
        periodOfStay: new UntypedFormControl("", this.userdata.applicationId != 3 ? [Validators.required, this.validatedateInputStayFromwithBirt] : [Validators.required, this.validateInputDate]),
        periodOfStayTo: new UntypedFormControl("", this.userdata.applicationId != 3 ? [Validators.required, this.validatedateInputwitTilldate] : [Validators.required, this.validateTillDate]),
        addressPosId: new UntypedFormControl(0),
        screeningCompId: new UntypedFormControl(0),
        reportFlag: new UntypedFormControl(false),
        validationString: new UntypedFormControl('NOT PROVIDED'),
      }))
    } else {
      this.addressformgrp.get(this.formgroupName + '.addressPos').markAllAsTouched();
    }

  }
  removePos(i: any) {
    if (i != 0) {
      let array = (this.addressformgrp.get(this.formgroupName + '.addressPos')) as UntypedFormArray;
      array.removeAt(i)

    }

  }
  handleDateChange(date, controlName, index) {
    let addPos = (this.addressformgrp.get(this.formgroupName + '.addressPos') as UntypedFormArray).at(index).get(controlName)
    addPos.setValue(new DatePipe('en-Us').transform(date.value, 'dd/MMM/yyyy'));
    this.upperCase(addPos.value, controlName, index);

    this.touchValidation(date.value, controlName, index);
  }


  touchValidation(val, controlName, index) {
    // let addPos = (this.addressformgrp.get(this.formgroupName + '.addressPos') as UntypedFormArray).at(index).get(controlName);
    let pos = (this.addressformgrp.get(this.formgroupName + '.addressPos') as UntypedFormArray).at(index).get('periodOfStay');
    let posTo = (this.addressformgrp.get(this.formgroupName + '.addressPos') as UntypedFormArray).at(index).get('periodOfStayTo');
    if (posTo.value && pos.value) {
      let startdate = this.common.convertDate(pos.value).setHours(0, 0, 0, 0);
      let enddate = this.common.convertDate(posTo.value).setHours(0, 0, 0, 0);
      if (controlName == 'periodOfStay' && startdate > enddate) {
        pos.setErrors({ comparison: true })
        pos.markAsTouched();
      } else if (controlName == 'periodOfStayTo' && enddate < startdate) {
        posTo.setErrors({ comparison: true })
        posTo.markAsTouched();
      } else {
        posTo.markAsUntouched();
        posTo.setErrors({ comparison: false })
        pos.markAsUntouched();
        pos.setErrors({ comparison: false });
        pos.clearValidators();
        posTo.clearValidators();
        pos.setErrors(null);
        posTo.setErrors(null);
      }
    }
  }
  checkDobValidation(val, controlName, index) {
    const dob = new Date(this.common.dob);
    const pos = new Date(val)
    if (dob > pos) {
      this.showNotification("warn", "Alert", "The given date cannot be before the Date of Birth");
      (this.addressformgrp.get(this.formgroupName + '.addressPos') as UntypedFormArray).at(index).get('periodOfStay')?.setValue('');

    }
  }
  showNotification(severity1, summary1, message) {
    this.messageService.add({
      severity: severity1,
      summary: summary1,
      detail: message,
    });
  }
  upperCase(val, controlName, index) {
    let addPos = (this.addressformgrp.get(this.formgroupName + '.addressPos') as UntypedFormArray).at(index).get(controlName)

    val = val.toUpperCase();

    addPos.setValue(val);

    if (val.includes('NOT PROVIDED') && controlName === "periodOfStay") {
      (this.addressformgrp.get(this.formgroupName + '.addressPos') as UntypedFormArray).at(index).get('periodOfStay')?.setValue('Not Provided');
    }
    else if (!val.includes('NOT PROVIDED') && controlName === "periodOfStay") {
      (this.addressformgrp.get(this.formgroupName + '.addressPos') as UntypedFormArray).at(index).get('periodOfStay')?.setValue(val);
    }
    if (val.includes('NOT PROVIDED') && controlName === "periodOfStayTo") {
      (this.addressformgrp.get(this.formgroupName + '.addressPos') as UntypedFormArray).at(index).get('periodOfStayTo')?.setValue('Not Provided');
    } else if (!val.includes('NOT PROVIDED') && controlName === "periodOfStayTo") {
      const values = (this.addressformgrp.get(this.formgroupName + '.addressPos') as UntypedFormArray).at(index).get('periodOfStayTo')?.value;
      (this.addressformgrp.get(this.formgroupName + '.addressPos') as UntypedFormArray).at(index).get('periodOfStayTo')?.setValue(val);
    }
    this.touchValidation(val, controlName, index);
  }
  dateCalc(i: any) {
    return this.fb.group({
      UntypedFormGroup: (this.addressformgrp.get(this.formgroupName + '.addressPos') as UntypedFormArray).at(i)
    },
      { validator: this.common.dateCompareFile('periodOfStay', 'periodOfStayTo') },
    );
  }
  notProvidevalidation(val, index) {
    // let np = (this.addressformgrp.get(this.formgroupName + '.addressPos') as UntypedFormArray).at(index)
    // if ((this.userdata.applicationId === 3) && (val === 'NOT PROVIDED')) {
    //   np.get('periodOfStay')?.setErrors({ incorrect: true });
    // }
    // else if ((this.userdata.applicationId !== 3) && (val === 'NOT PROVIDED')) {
    //   np.get('periodOfStay')?.setErrors(null);
    // }
  }
  notProvide(val, index) {
    // let np = (this.addressformgrp.get(this.formgroupName + '.addressPos') as UntypedFormArray).at(index)
    // if ((this.userdata.applicationId === 3) && (val === 'NOT PROVIDED')) {
    //   np.get('periodOfStayTo')?.setErrors({ incorrect: true });
    // }
    // else if ((this.userdata.applicationId !== 3) && (val === 'NOT PROVIDED')) {
    //   np.get('periodOfStayTo')?.setErrors(null);
    // }
  }

  addressChange() {
    this.placeList = [];
    const zipcode = this.addressformgrp.get(this.formgroupName + '.postalCode').value;
    if (zipcode) {
      this.addressformgrp.get(this.formgroupName + '.stateId').enable();
      this.addressformgrp.get(this.formgroupName + '.districtId').enable();
      this.addressformgrp.get(this.formgroupName + '.cityId').enable();
      this.addressformgrp.get(this.formgroupName + '.locationId').enable();
      this.masterService.getAddressDetailByZipCode(zipcode).subscribe(res => {
        if (res) {
          this.getDistricList(res);
          this.getStateList(res);
          this.cityList = res?.cityList;
          this.addressformgrp.get(this.formgroupName + '.countryId')?.setValue(res?.countryId);
          this.setCountryName(res?.countryId);
          this.addressformgrp.get(this.formgroupName + '.stateId')?.setValue(res?.stateId);
          this.setStateName(res?.stateId);
          this.addressformgrp.get(this.formgroupName + '.districtId')?.setValue(res?.districtId);
          this.setDistrictName(res?.districtId);
          this.addressformgrp.get(this.formgroupName + '.cityId')?.setValue(this.datavalue.cityId);
          this.setCityName(this.datavalue.cityId);
          this.addressformgrp.get(this.formgroupName + '.locationId')?.setValue(this.datavalue.locationId);
          this.setLocationName(this.datavalue.locationId);

          if (zipcode && this.datavalue.cityId) {
            const city = this.datavalue.cityId;
            this.placeList = res.locationList.filter(f => f.cityId === city && f.postalCode === zipcode);
            this.zipCodefilterlist = this.placeList;
            if (this.datavalue.locationId != 0) {
              this.setLocationName(this.datavalue.locationId);
            }

            this.addressformgrp.get(this.formgroupName + '.cityId')?.setValue(this.datavalue.cityId);

            this.addressformgrp.get(this.formgroupName + '.locationId')?.setValue(this.datavalue.locationId);
            this.setLocationName(this.addressformgrp.get(this.formgroupName + '.locationId').value);
            this.zipCodeItems('');
          }
          else {
            var cityres = this.common.cityRes;
            this.selectCity(false)
            if (cityres) {
              if (cityres.cityId) {
                this.addressformgrp.get(this.formgroupName + '.cityId')?.setValue(cityres?.cityId);
                this.setCityName(cityres.cityId)
              }
              if (cityres.locationId) {
                this.placeList = this.common.placeList;
                this.addressformgrp.get(this.formgroupName + '.locationId')?.setValue(cityres?.locationId);
                this.setLocationName(cityres.locationId);
              }
            }
          }
        }
      });
    }
  }
  ngOnInit() {
    // this.agentEntryMasterService.clientEntryForm.get('indianClientFlag')?.setValue(true);
    this.userdata = JSON.parse(sessionStorage.getItem('user_data'));
    // this.addressfrm = ((this.addressformgrp.get(this.formgroupName + '.addressPos')) as UntypedFormArray).controls;
    if (this.screening.componentList != undefined && this.screening.componentList.length > 0) {
      this.getcompName = this.screening.componentList.find(x => x.compId === this.compId).compName;
      const getData = this.screening.componentList.find(x => x.compId === this.compId);
      if (getData != null) {
        if (getData.compName == "CRIMINAL CHECK (PCC2)") {
          this.formgroupName = 'address0'
        }
      }
      if (getData != null) {
        this.AddFlag = getData ? getData.isAdditionalPos : false;
        if (this.screening.compData.subCompFlag != false && getData.screeningSubComponent != undefined) {
          const subdata = getData.screeningSubComponent.find(x => x.subCompId === this.subcompId && x.compId === this.compId);
          if (subdata != null) {
            this.AddFlag = subdata ? subdata.isAdditionalPos : false;
          }
        }
      }

    }
    this.getStateDetail();
    this.zipCodeBind = false;
    if (this.common.countryList != null) {
      this.countryList = this.common.countryList;
    }
    if (this.common.stateList != null) {
      this.stateList = this.common.stateList;
    }
    if (this.common.cityList != null) {
      this.cityList = this.common.cityList;
    }
    if (this.common.districtList != null) {

      this.districtList = this.common.districtList;
    }
    if (this.common.placeList != null) {
      this.placeList = this.common.placeList;
    }
    this.getCountryList();
    //this.checkAddress();
    // this.selectcountry();
    if (this.addressformgrp.get(this.formgroupName + '.countryId').value) {
      this.countryItems('');
      // this.addressformgrp.get(this.formgroupName + '.stateId').enable();
    } else {
      // setTimeout(() => {
      this.addressformgrp.get(this.formgroupName + '.stateId')?.disable();
      this.addressformgrp.get(this.formgroupName + '.districtId')?.disable();
      this.addressformgrp.get(this.formgroupName + '.cityId')?.disable();
      this.addressformgrp.get(this.formgroupName + '.locationId')?.disable();
      // }, 0);
    }
    // VTS2-2024-CRT-0206 - Need to set condition in period of stay from date field based on DOB - By Naveen
    this.disableDates();
    this.maxDateValue = new Date();
  }

  dateFlag() {

    return (this.screening.compData != undefined ? (this.screening.compData.compName.toLowerCase() !== "voter id" && this.screening.compData.compName.toLowerCase() !== "passport" && this.screening.compData.compName.toLowerCase() !== "license" && this.screening.compData.compName.toLowerCase() !== "drug test" && this.screening.compData.compName.toLowerCase() !== "education" && this.screening.compData.compName.toLowerCase() !== "employment (hr)" && this.screening.compData.compName.toLowerCase() !== "current-employment" && this.screening.compData.compName.toLowerCase() !== "previous-employment") : false);
  }
  //get dropdownlist

  getStateDetail() {
    const zipcode = this.addressformgrp.get(this.formgroupName + '.postalCode')?.value;
    if (zipcode != null && zipcode != "") {
      this.masterService.getAddressDetailByZipCode(zipcode).subscribe(res1 => {
        const value = this.addressformgrp.get(this.formgroupName + '.stateId')?.value;
        const disValue = this.addressformgrp.get(this.formgroupName + '.districtId')?.value;

        if (value) {
          this.masterService.GetDistrictList(value).subscribe(res => {
            if (res) {
              this.districtList = res;
              this.common.districtList = Object.assign([], this.districtList);
              this.districtfilterlist = res;
              this.setDistrictName(disValue);
            }
          });
        }

        this.cityList = res1?.cityList || [];
        this.common.cityList = res1?.cityList || [];
        this.cityfilterlist = res1?.cityList || [];
        const cityId = this.addressformgrp.get(this.formgroupName + '.cityId')?.value
        if (cityId > 0) {
          this.setCityName(cityId);
        }
        this.placeList = res1?.locationList;
        this.common.placeList = res1?.locationList;
        const locationId = this.addressformgrp.get(this.formgroupName + '.locationId')?.value;
        this.placefilterlist = res1?.locationList;
        if (locationId > 0) {
          this.setLocationName(locationId);
        }

      })
    }

  }
  // get country list for country Auto Complete
  getCountryList() {
    if (this.countryList.length > 0) {
      this.eventValidation.emit(this.countryList);
      this.zipCodeValidation(this.countryList);
      this.common.countryList = Object.assign([], this.countryList);
      this.countryItems('');
    } else {
      this.masterService.GetCountryList().subscribe(res => {
        if (res) {
          this.countryList = res;
          this.eventValidation.emit(this.countryList);
          this.zipCodeValidation(this.countryList);
          this.common.countryList = Object.assign([], this.countryList);
          this.countryItems('');
        }
      });
    }
  }
  // zip code validation
  zipCodeValidation(list = []) {
    if (this.userdata == null) {
      const country = (this.addressformgrp.get(this.formgroupName + '.countryId').value && list.length > 0) ? this.common.getNameById(list,
        'countryId', 'country', this.addressformgrp.get(this.formgroupName + '.countryId').value).toLowerCase() : '';
      if (country) {
        if (country === this.common.indiaCountry) {
          this.addressformgrp.get(this.formgroupName + '.postalCode').setValidators([Validators.required, Validators.pattern(/^[0-9]+$/)]);
        } else {
          this.addressformgrp.get(this.formgroupName + '.postalCode').clearValidators();
        }
        this.addressformgrp.get(this.formgroupName + '.postalCode').updateValueAndValidity();
      }
    }
    if (this.userdata != null) {
      if (this.userdata.applicationId !== 1) {
        const country = (this.addressformgrp.get(this.formgroupName + '.countryId').value && list.length > 0) ? this.common.getNameById(list,
          'countryId', 'country', this.addressformgrp.get(this.formgroupName + '.countryId').value).toLowerCase() : '';
        if (country) {
          if (country === this.common.indiaCountry) {
            this.addressformgrp.get(this.formgroupName + '.postalCode').setValidators([Validators.required, Validators.pattern(/^[0-9]+$/)]);
          } else {
            this.addressformgrp.get(this.formgroupName + '.postalCode').clearValidators();
          }
          this.addressformgrp.get(this.formgroupName + '.postalCode').updateValueAndValidity();
        }
      }
    }
  }
  // Country Functions -- get stateList by country
  selectcountry(): any {
    const value = this.addressformgrp.get(this.formgroupName + '.countryId').value;
    if (value) {
      this.eventValidation.emit(this.countryList);
      this.zipCodeValidation(this.countryList);
      this.setCountryName(value);
      this.stateKeyup = false;
      this.addressformgrp.get(this.formgroupName + '.stateId').enable();
      if (this.common.stateList.length > 0) {
        this.stateList = this.common.stateList.filter(s => s.countryId == value)
        this.stateItems('');
        if (this.datavalue) {
          if (this.datavalue.stateId) {
            this.addressformgrp.get(this.formgroupName + '.stateId')?.setValue(this.datavalue.stateId);
          }
          this.setStateName(this.datavalue.stateId);
          if (this.datavalue.countryId) {
            this.addressformgrp.get(this.formgroupName + '.countryId')?.setValue(this.datavalue.countryId);
          }
          // this.datavalue = null;
        }
        if (this.addressformgrp.get(this.formgroupName + '.stateId').value) {
          this.selectState(this.addressformgrp.get(this.formgroupName + '.addLine1')?.enabled);
          this.stateItems('');
        }

      } else {

        this.masterService.GetStatesList(value).subscribe(res => {
          if (res) {
            this.stateList = res;
            //this.stateList = Object.assign([], this.stateList);
            this.stateItems('');
            if (this.datavalue) {
              if (this.datavalue.stateId) {
                this.addressformgrp.get(this.formgroupName + '.stateId')?.setValue(this.datavalue.stateId);
              }
              this.setStateName(this.datavalue.stateId);
              if (this.datavalue.countryId) {
                this.addressformgrp.get(this.formgroupName + '.countryId')?.setValue(this.datavalue.countryId);
              }
              // this.datavalue = null;
            }
            if (this.addressformgrp.get(this.formgroupName + '.stateId').value) {
              this.selectState(this.addressformgrp.get(this.formgroupName + '.addLine1')?.enabled);
              this.stateItems('');
            }

          }

        });
      }
    } else {
      this.addressformgrp.get(this.formgroupName + '.stateId')?.disable();
    }
  }
  // check valid country
  checkValidValues(): void {
    const value = this.addressformgrp.get(this.formgroupName + '.countryId').value;
    if (value === '' || value == null) {
    } else if (this.stateKeyup) {
      this.addressformgrp.get(this.formgroupName + '.countryId')?.setValue('');
      this.addressformgrp.get(this.formgroupName + '.countryId').setErrors({ incorrect: true });
      this.stateList = [];
    } else { //to chevk whether the value is string - kuzhali - oct 10 2023
      let countryObj: any = this.countryfilterlist.filter(e =>
        e.country.toLowerCase() === value.toLowerCase());  // filters from original array by the given input value
      if (countryObj.length == 1) {
        this.addressformgrp.get(this.formgroupName + '.countryId')?.setValue(countryObj[0].countryId);
        this.addressformgrp.get(this.formgroupName + '.countryId').setErrors(null);
      } else {
        this.addressformgrp.get(this.formgroupName + '.countryId')?.setValue('');
        this.addressformgrp.get(this.formgroupName + '.countryId').setErrors({ incorrect: true });
      }

    }
  }
  // country list filter by enter value using Keyup
  countryKeyupFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        this.stateKeyup = false;
        const countryObj = this.countryfilterlist.filter(e =>
          e.country.toLowerCase() === value.toLowerCase());
        if (countryObj.length > 0) {
        } else {
          this.datavalue = null;
          this.stateKeyup = true;
          this.statefilterlist = [];
          this.stateList = [];
          this.placefilterlist = [];
          this.placeList = [];
          this.zipCodefilterlist = [];
          this.zipCodeList = [];
          this.addressformgrp.get(this.formgroupName + '.locationId')?.setValue(null);
          this.addressformgrp.get(this.formgroupName + '.locationId')?.disable();
          this.addressformgrp.get(this.formgroupName + '.place')?.setValue('');
          //this.addressformgrp.get(this.formgroupName + '.postalCode')?.setValue('');
          this.addressformgrp.get(this.formgroupName + '.stateId')?.setValue(null);
          this.addressformgrp.get(this.formgroupName + '.stateId')?.disable();
          this.addressformgrp.get(this.formgroupName + '.state')?.setValue('');
          this.addressformgrp.get(this.formgroupName + '.districtId')?.setValue(null);
          this.addressformgrp.get(this.formgroupName + '.districtId')?.disable();
          this.addressformgrp.get(this.formgroupName + '.district')?.setValue('');
          this.addressformgrp.get(this.formgroupName + '.cityId')?.setValue(null);
          this.addressformgrp.get(this.formgroupName + '.cityId')?.disable();
          this.addressformgrp.get(this.formgroupName + '.city')?.setValue('');

        }
      } else {
        this.datavalue = null;
        this.stateKeyup = false;
        this.statefilterlist = [];
        this.stateList = [];
        this.zipCodefilterlist = [];
        this.zipCodeList = [];
        this.addressformgrp.get(this.formgroupName + '.locationId')?.setValue(null);
        this.addressformgrp.get(this.formgroupName + '.locationId')?.disable();
        this.addressformgrp.get(this.formgroupName + '.place')?.setValue('');
        //this.addressformgrp.get(this.formgroupName + '.postalCode')?.setValue('');
        this.addressformgrp.get(this.formgroupName + '.stateId')?.setValue(null);
        this.addressformgrp.get(this.formgroupName + '.stateId')?.disable();
        this.addressformgrp.get(this.formgroupName + '.state')?.setValue('');
        this.addressformgrp.get(this.formgroupName + '.districtId')?.setValue(null);
        this.addressformgrp.get(this.formgroupName + '.districtId')?.disable();
        this.addressformgrp.get(this.formgroupName + '.district')?.setValue('');
        this.addressformgrp.get(this.formgroupName + '.cityId')?.setValue(null);
        this.addressformgrp.get(this.formgroupName + '.cityId')?.disable();
        this.addressformgrp.get(this.formgroupName + '.city')?.setValue('');
      }
    }
  }
  // display fuction for return country Name by country Id
  get displayCountryFn() {
    const resourceNew = (country) => {
      if (country == null || country === undefined) {
        return null;
      } else {
        if (country && this.countryList && this.countryList.length > 0) {
          country = this.countryList.find(x => x.countryId === country);
          return country.country;
        } else {
          return null;
        }
      }
    };
    return resourceNew;
  }

  // load country List to country filter list auto Complete
  countryItems(value: any) {
    if (!value) { this.assignResourceCopy(); }
    if (value) {
      const IndFlag = this.isNumber(this.addressformgrp.get(this.formgroupName + '.postalCode').value)
      if (value.toLowerCase() == 'india' && IndFlag != true) {
        this.addressformgrp.get(this.formgroupName + '.postalCode')?.setValue('');
      }
      this.countryfilterlist = Object.assign([], this.countryList).filter(
        item => ((item.country.toLowerCase().indexOf(value.toLowerCase()) > -1)));
    }

  }
  assignResourceCopy() {
    this.countryfilterlist = Object.assign([], this.countryList);
  }
  isNumber(n: any) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); }
  // State Functions -- get districtList by state
  selectState(isEnable): any {
    const value = this.addressformgrp.get(this.formgroupName + '.stateId').value;
    if (value) {
      this.sKeyup = false;
      this.setStateName(value);
      if (isEnable) {
        this.addressformgrp.get(this.formgroupName + '.districtId').enable();
      } else {
        this.addressformgrp.get(this.formgroupName + '.districtId')?.disable();
      }
      if (this.common.stateId == value.stateId) {
        this.districtItems('');
        if (this.datavalue) {
          this.addressformgrp.get(this.formgroupName + '.districtId')?.setValue(this.datavalue.districtId);
          this.setDistrictName(this.datavalue.districtId);
          if (this.datavalue.stateId) {
            this.addressformgrp.get(this.formgroupName + '.stateId')?.setValue(this.datavalue.stateId);
          }
          this.setStateName(this.datavalue.stateId);
          // this.datavalue = null;
        }
        if (this.addressformgrp.get(this.formgroupName + '.districtId').value && !this.zipCodeBind) {
          this.selectDistrict(this.addressformgrp.get(this.formgroupName + '.addLine1')?.enabled);
        }

      } else {
        this.masterService.GetDistrictList(value).subscribe(res => {
          if (res) {
            this.districtList = res;
            this.common.districtList = Object.assign([], this.districtList);
            this.districtItems('');
            if (this.datavalue) {
              this.addressformgrp.get(this.formgroupName + '.districtId')?.setValue(this.datavalue.districtId);
              this.setDistrictName(this.datavalue.districtId);
              if (this.datavalue.stateId) {
                this.addressformgrp.get(this.formgroupName + '.stateId')?.setValue(this.datavalue.stateId);
              }
              this.setStateName(this.datavalue.stateId);
              // this.datavalue = null;
            }
            if (this.addressformgrp.get(this.formgroupName + '.districtId').value && !this.zipCodeBind) {
              this.selectDistrict(this.addressformgrp.get(this.formgroupName + '.addLine1')?.enabled);
            }
          }
        });
      }
    } else {
      if (isEnable) {
        this.addressformgrp.get(this.formgroupName + '.districtId').enable();
      } else {
        this.addressformgrp.get(this.formgroupName + '.districtId')?.disable();
      }
    }
  }
  // state list filter by enter value using Keyup
  stateKeyupFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        this.sKeyup = false;
        const resource = this.statefilterlist.filter(e =>
          e.stateName.toLowerCase() === value.toLowerCase());
        if (resource.length > 0) {
        } else {

          this.datavalue = null;
          this.sKeyup = true;
          this.districtfilterlist = [];
          this.districtList = [];
          this.zipCodefilterlist = [];
          this.zipCodeList = [];
          this.placefilterlist = [];
          this.placeList = [];
          this.addressformgrp.get(this.formgroupName + '.locationId')?.setValue(null);
          this.addressformgrp.get(this.formgroupName + '.locationId')?.disable();
          this.addressformgrp.get(this.formgroupName + '.place')?.setValue('');
          //this.addressformgrp.get(this.formgroupName + '.postalCode')?.setValue('');
          this.addressformgrp.get(this.formgroupName + '.districtId')?.setValue(null);
          this.addressformgrp.get(this.formgroupName + '.districtId')?.disable();
          this.addressformgrp.get(this.formgroupName + '.district')?.setValue('');
          this.addressformgrp.get(this.formgroupName + '.cityId')?.setValue(null);
          this.addressformgrp.get(this.formgroupName + '.cityId')?.disable();
          this.addressformgrp.get(this.formgroupName + '.city')?.setValue('');
        }
      } else {
        this.datavalue = null;
        this.sKeyup = false;
        this.districtfilterlist = [];
        this.districtList = [];
        this.zipCodefilterlist = [];
        this.zipCodeList = [];
        this.placefilterlist = [];
        this.placeList = [];
        this.addressformgrp.get(this.formgroupName + '.locationId')?.setValue(null);
        this.addressformgrp.get(this.formgroupName + '.locationId')?.disable();
        this.addressformgrp.get(this.formgroupName + '.place')?.setValue('');
        //this.addressformgrp.get(this.formgroupName + '.postalCode')?.setValue('');
        this.addressformgrp.get(this.formgroupName + '.districtId')?.setValue(null);
        this.addressformgrp.get(this.formgroupName + '.districtId')?.disable();
        this.addressformgrp.get(this.formgroupName + '.district')?.setValue('');
        this.addressformgrp.get(this.formgroupName + '.cityId')?.setValue(null);
        this.addressformgrp.get(this.formgroupName + '.cityId')?.disable();
        this.addressformgrp.get(this.formgroupName + '.city')?.setValue('');
      }
    }
  }
  // display fuction for return state Name by stateId
  get displayStateFn() {
    const resourceNew = (state) => {
      if (state == null || state === undefined) {
        return null;
      } else {
        if (state && this.stateList && this.stateList.length > 0) {
          state = this.stateList.find(x => x.stateId === state);
          if (state) {
            return state.stateName;
          } else {
            return null;
          }

        } else {
          return null;
        }
      }
    };
    return resourceNew;
  }
  // chack state valid using blur
  checkValidState(): void {
    const value = this.addressformgrp.get(this.formgroupName + '.stateId').value;
    let state: any;
    if (value === '' || value === null) {
      this.addressformgrp.get(this.formgroupName + '.stateId').setErrors({ incorrect: true });
      this.districtList = [];
    } else {
      if (isNaN(value)) {//to chevk whether the value is string - kuzhali - oct 10 2023
        state = this.statefilterlist.filter(e =>
          e.stateName.toLowerCase() === value.toLowerCase()); // filters from original array by the given input value
        if (state.length == 1) {
          this.addressformgrp.get(this.formgroupName + '.stateId')?.setValue(state[0].stateId);
          this.setStateName(state[0].stateId);
          this.addressformgrp.get(this.formgroupName + '.stateId').setErrors(null);
        } else {
          this.addressformgrp.get(this.formgroupName + '.stateId')?.setValue('');
          this.addressformgrp.get(this.formgroupName + '.stateId').setErrors({ incorrect: true });
          this.districtList = [];
        }

      } else {
        state = this.statefilterlist.find(e =>
          e.stateId === value);
        this.addressformgrp.get(this.formgroupName + '.stateId')?.setValue(state.stateId);
        this.setStateName(state.stateId);
        this.addressformgrp.get(this.formgroupName + '.stateId').setErrors(null);
      }

    }
  }
  // load state List to state filter list auto Complete
  stateItems(value: any) {
    if (!value) { this.assignstateCopy(); }
    if (value) {
      this.statefilterlist = Object.assign([], this.stateList).filter(
        item => ((item.stateName.toLowerCase().indexOf(value.toLowerCase()) > -1)));

    }

  }
  assignstateCopy() {
    this.statefilterlist = Object.assign([], this.stateList);
  }

  // District Function -- get cityList by District
  selectDistrict(isEnable: any) {
    const value = this.addressformgrp.get(this.formgroupName + '.districtId').value;
    if (value) {
      this.setDistrictName(value);
      this.cityList = [];
      this.distKeyup = false;
      if (isEnable) {
        this.addressformgrp.get(this.formgroupName + '.cityId').enable();
      } else {
        this.addressformgrp.get(this.formgroupName + '.cityId')?.disable();
      }
      this.masterService.GetCityList(value).subscribe(res => {
        if (res) {
          this.addressformgrp.get(this.formgroupName + '.cityId')?.setValue('');
          this.addressformgrp.get(this.formgroupName + '.city')?.setValue('');
          this.addressformgrp.get(this.formgroupName + '.locationId')?.setValue('');
          this.addressformgrp.get(this.formgroupName + '.place')?.setValue('');
          this.cityList = res;
          this.common.cityList = Object.assign([], this.cityList);
          this.cityItems('');
          if (this.datavalue) {
            this.addressformgrp.get(this.formgroupName + '.cityId')?.setValue(this.datavalue.cityId);
            this.addressformgrp.get(this.formgroupName + '.districtId')?.setValue(this.datavalue.districtId);
            // this.datavalue = null;
          }
          if (this.addressformgrp.get(this.formgroupName + '.cityId').value && !this.zipCodeBind) {
            this.selectCity(this.addressformgrp.get(this.formgroupName + '.addLine1')?.enabled);
          }
        }
      });
    } else {
      this.addressformgrp.get(this.formgroupName + '.cityId')?.disable();
    }
  }
  // district list filter by enter value using Keyup
  districtKeyupFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        this.distKeyup = false;
        const resource = this.districtfilterlist.filter(e =>
          e.districtName.toLowerCase() === value.toLowerCase());
        if (resource.length > 0) {
        } else {
          this.datavalue = null;
          this.distKeyup = true;
          this.cityfilterlist = [];
          this.cityList = [];
          this.placeList = [];
          this.placefilterlist = [];
          this.zipCodefilterlist = [];
          this.zipCodeList = [];
          this.addressformgrp.get(this.formgroupName + '.locationId')?.setValue(null);
          this.addressformgrp.get(this.formgroupName + '.locationId')?.disable();
          this.addressformgrp.get(this.formgroupName + '.place')?.setValue('');
          this.addressformgrp.get(this.formgroupName + '.cityId')?.setValue(null);
          this.addressformgrp.get(this.formgroupName + '.cityId')?.disable();
          this.addressformgrp.get(this.formgroupName + '.city')?.setValue('');
        }
      } else {
        this.datavalue = null;
        this.distKeyup = false;
        this.cityfilterlist = [];
        this.cityList = [];
        this.placeList = [];
        this.placefilterlist = [];
        this.zipCodefilterlist = [];
        this.zipCodeList = [];
        this.addressformgrp.get(this.formgroupName + '.locationId')?.setValue(null);
        this.addressformgrp.get(this.formgroupName + '.locationId')?.disable();
        //this.addressformgrp.get(this.formgroupName + '.postalCode')?.setValue('');
        this.addressformgrp.get(this.formgroupName + '.cityId')?.setValue(null);
        this.addressformgrp.get(this.formgroupName + '.cityId')?.disable();
        this.addressformgrp.get(this.formgroupName + '.city')?.setValue('');
      }
    }
  }
  // display fuction for return Diastrict Name by districtId
  get displayDistrictFn() {
    const distNew = (dist) => {
      if (dist == null || dist === undefined) {
        return null;
      } else {
        if (dist && this.districtList && this.districtList.length > 0) {
          dist = this.districtList.find(x => x.districtId === dist);
          if (dist) {
            return dist.districtName;
          } else {
            return null;
          }

        } else {
          return null;
        }
      }
    };
    return distNew;
  }
  // load district List to districtfilterlist auto Complete
  districtItems(value: any) {
    if (!value) { this.assignDistrictCopy(); }
    if (value) {
      this.districtfilterlist = Object.assign([], this.districtList).filter(
        item => ((item.districtName.toLowerCase().indexOf(value.toLowerCase()) > -1)));
    }
  }
  assignDistrictCopy() {
    this.districtfilterlist = Object.assign([], this.districtList);
  }
  // chack district valid
  checkValidDistrict() {
    const value = this.addressformgrp.get(this.formgroupName + '.districtId').value;
    let district: any;
    if (value === '' || value === null) {
    } else {
      if (isNaN(value)) {//to chevk whether the value is string - kuzhali - oct 10 2023
        district = this.districtfilterlist.filter(e =>
          e.districtName.toLowerCase() === value.toLowerCase());
        if (district.length == 1) {
          this.addressformgrp.get(this.formgroupName + '.districtId')?.setValue(district[0].districtId);
          this.setDistrictName(district[0].districtId);
          this.addressformgrp.get(this.formgroupName + '.districtId').setErrors(null);
        } else {
          this.addressformgrp.get(this.formgroupName + '.districtId')?.setValue('');
          this.addressformgrp.get(this.formgroupName + '.districtId').setErrors({ incorrect: true });
          this.cityList = [];
        }

      } else {
        district = this.districtfilterlist.find(e =>
          e.districtId === value);
        this.addressformgrp.get(this.formgroupName + '.districtId')?.setValue(district.districtId);
        this.setDistrictName(district.districtId);
        this.addressformgrp.get(this.formgroupName + '.districtId').setErrors(null);
      }

    }
  }

  // City Functions -- get placeList
  selectCity(isEnable: any) {
    const city = this.addressformgrp.get(this.formgroupName + '.cityId').value;
    const zip = this.addressformgrp.get(this.formgroupName + '.postalCode').value;
    if (city) {

      this.setCityName(city);
      this.placeList = [];
      this.cityKeyup = false;
      if (isEnable) {
        this.addressformgrp.get(this.formgroupName + '.locationId').enable();
      } else {
        this.addressformgrp.get(this.formgroupName + '.locationId')?.disable();
      }
      // this.addressformgrp.get(this.formgroupName + '.locationId').enable();
      if (this.zipCodeBind || !this.zipCodeBind) {
        this.masterService.getPlaceList(city, zip).subscribe(res => {
          if (res) {
            this.addressformgrp.get(this.formgroupName + '.locationId')?.setValue('');
            this.addressformgrp.get(this.formgroupName + '.place')?.setValue('');
            this.placeList = res;
            this.zipCodeList = res;
            this.common.placeList = Object.assign([], this.placeList);
            this.placeItems('');
            if (this.datavalue) {
              this.addressformgrp.get(this.formgroupName + '.locationId')?.setValue(this.datavalue.locationId);
              this.setLocationName(this.datavalue.locationId);
            }
            if (this.addressformgrp.get(this.formgroupName + '.locationId').value && !this.zipCodeBind) {
              this.selectPlace();
            }
          }
        });
      } else {
        if (this.datavalue) {
          this.placeList = this.datavalue.locationList.filter(f => f.cityId === city);
          this.placeItems('');
        }
      }
    } else {
      if (isEnable) {
        this.addressformgrp.get(this.formgroupName + '.locationId').enable();
      } else {
        this.addressformgrp.get(this.formgroupName + '.locationId')?.disable();
      }
    }
  }
  // city list filter by enter value using Keyup
  cityKeyupFunction(event, value) {
    this.zipCodeBind = false;
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        this.cityKeyup = false;
        const cityobj = this.cityfilterlist.filter(e =>
          e.cityName.toLowerCase() === value.toLowerCase());
        if (cityobj.length > 0) {
        } else {
          this.datavalue = null;
          this.cityKeyup = true;
          this.placeList = [];
          this.placefilterlist = [];
          this.zipCodefilterlist = [];
          this.zipCodeList = [];
          this.addressformgrp.get(this.formgroupName + '.locationId')?.setValue('');
          this.addressformgrp.get(this.formgroupName + '.place')?.setValue('');
          // this.addressformgrp.get(this.formgroupName + '.postalCode')?.setValue('');
        }
      } else {
        this.datavalue = null;
        this.cityKeyup = false;
        this.placeList = [];
        this.placefilterlist = [];
        this.zipCodefilterlist = [];
        this.zipCodeList = [];
        this.addressformgrp.get(this.formgroupName + '.locationId')?.setValue('');
        this.addressformgrp.get(this.formgroupName + '.place')?.setValue('');
        // this.addressformgrp.get(this.formgroupName + '.postalCode')?.setValue('');
      }
    }
  }
  // load citylist to cityFilterList auto Complete
  cityItems(value: any) {
    if (!value) { this.assignCopy(); }
    if (value) {
      this.cityfilterlist = Object.assign([], this.cityList).filter(
        item => ((item.cityName.toLowerCase().indexOf(value.toLowerCase()) > -1)));
    }
  }
  assignCopy() {
    this.cityfilterlist = Object.assign([], this.cityList);
  }
  // check city valid
  checkValidCity(data): void {
    let value = this.addressformgrp.get(this.formgroupName + '.cityId').value;
    if (value === undefined) {
      value = data;
    }
    let city: any;
    if (value === '' || value === null) {
    } else {
      if (isNaN(value)) { //to chevk whether the value is string - kuzhali - oct 10 2023
        city = this.cityfilterlist.filter(e =>
          e.cityName.toLowerCase() === value.toLowerCase());
        if (city.length == 1) {
          this.addressformgrp.get(this.formgroupName + '.cityId')?.setValue(city[0].cityId);
          this.setCityName(city[0].cityId);
          this.addressformgrp.get(this.formgroupName + '.cityId').setErrors(null);
        }
        else {
          this.addressformgrp.get(this.formgroupName + '.cityId')?.setValue('');
          this.addressformgrp.get(this.formgroupName + '.cityId').setErrors({ incorrect: true });
        }

      } else {
        city = this.cityfilterlist.find(e => e.cityId === value);
        this.addressformgrp.get(this.formgroupName + '.cityId')?.setValue(city.cityId);
        this.setCityName(city.cityId);
        this.addressformgrp.get(this.formgroupName + '.cityId').setErrors(null);
      }

    }
  }
  // display fuction for return city Name by cityId
  get displaycityFn() {
    const cityNew = (city) => {
      if (city == null || city === undefined) {
        return null;
      } else {
        if (city && this.cityList && this.cityList.length > 0) {
          city = this.cityList.find(x => x.cityId === city);
          if (city) {
            return city.cityName;
          } else {
            return null;
          }

        } else {
          return null;
        }
      }
    };
    return cityNew;
  }
  // Bind country,State,District,City and place based on given ZipCode
  getAddressDetailByZipCode(isEnable: any) {
    if (this.addressformgrp.get(this.formgroupName + '.postalCode').valid) {
      const countryin = this.countryfilterlist
      const IndFlag = this.isNumber(this.addressformgrp.get(this.formgroupName + '.postalCode').value)
      if (this.addressformgrp.get(this.formgroupName + '.countryId').value != 0) {
        const Cnname = this.countryfilterlist[0].country;
        if (Cnname.toLowerCase() == 'india' && IndFlag != true) {
          this.addressformgrp.get(this.formgroupName + '.countryId')?.setValue(0);
          this.addressformgrp.get(this.formgroupName + '.stateId')?.setValue(0);
          this.addressformgrp.get(this.formgroupName + '.districtId')?.setValue(0);
          this.addressformgrp.get(this.formgroupName + '.cityId')?.setValue(0);
          this.addressformgrp.get(this.formgroupName + '.locationId')?.setValue(0);
        }
      }

      this.placeList = [];
      this.zipCodeBind = true;
      const zipcode = this.addressformgrp.get(this.formgroupName + '.postalCode').value;
      if (!zipcode) {
        this.zipCodeBind = false;
        this.zipCodeValidation(this.countryList);
      }
      if (zipcode) {
        this.masterService.getAddressDetailByZipCode(zipcode).subscribe(res => {
          if (res) {
            this.datavalue = res;
            if (this.datavalue.countryId) {
              this.addressformgrp.get(this.formgroupName + '.countryId')?.setValue(this.datavalue.countryId);
            }
            if (this.datavalue.stateId) {
              this.addressformgrp.get(this.formgroupName + '.stateId')?.setValue(this.datavalue.stateId);
            }
            if (this.datavalue.cityId) {
              this.addressformgrp.get(this.formgroupName + '.cityId')?.setValue(this.datavalue.cityId);
              this.setCityName(this.datavalue)
            }
            if (this.datavalue.locationId) {
              this.addressformgrp.get(this.formgroupName + '.locationId')?.setValue(this.datavalue.locationId);
              this.setLocationName(this.datavalue.locationId)
            }
            this.setStateName(this.datavalue.stateId);
            this.addressformgrp.get(this.formgroupName + '.districtId')?.setValue(this.datavalue.districtId);
            if (isEnable) {
              this.addressformgrp.get(this.formgroupName + '.stateId').enable();
              this.addressformgrp.get(this.formgroupName + '.cityId').enable();
            } else {
              this.addressformgrp.get(this.formgroupName + '.stateId')?.disable();
              this.addressformgrp.get(this.formgroupName + '.cityId')?.disable();
            }
            this.setStateName(this.datavalue.districtId);
            this.selectcountry();
            this.selectState(true);
            this.cityList = this.datavalue.cityList;
            this.cityfilterlist = this.datavalue.cityList;
            if (zipcode && this.addressformgrp.get(this.formgroupName + '.cityId').value) {
              const city = this.addressformgrp.get(this.formgroupName + '.cityId').value;
              this.placeList = this.datavalue.locationList.filter(f => f.cityId === city && f.postalCode === zipcode);
              this.zipCodefilterlist = this.placeList;
              this.zipCodeItems('');
            }
            if (this.screening.caseSubmissionList && this.compId) {
              this.screening.CheckPostalcode(this.screening.screeningId, zipcode).subscribe(resp => {
                if (resp && resp.length > 0) {
                  this.addressDetailList = resp;
                  this.itemperpage = 10;
                  if (this.userdata.applicationId !== 3) {
                    this.openAddressDialog();
                  }
                }
              });
            }
          } else {
            this.Message = "The entered Pincode is not found in our database, please enter the complete address.";
            this.dialogRef = this.dialog.open(this.PincodePopUp, {
              width: '350px',
              disableClose: true
            });
            //this.openPopup('The entered Pincode is not found in our database, please enter the complete address.');
          }
          if (this.addressformgrp.get(this.formgroupName + '.countryId').value) {
            if (this.addressformgrp.get('codeId')) {
              this.addressformgrp.get('codeId')?.setValue(this.addressformgrp.get(this.formgroupName + '.countryId').value);
            }
          }
        });
      }
    }
  }
  ok() {
    this.dialogRef.close();
  }

  openAddressDialog() {
    const dialogRef = this.dialog.open(this.addressTemplate, {
      width: '1200px',
      disableClose: true
    });
  }
  validatePincode(type: any) {
    if (type === 'yes') {
      this.dialog.closeAll();
    } else if (type === 'no') {
      this.dialog.closeAll();
      this.addressformgrp.get(this.formgroupName + '.postalCode')?.setValue('');
      this.addressformgrp.get(this.formgroupName + '.countryId')?.setValue('');
      this.addressformgrp.get(this.formgroupName + '.stateId')?.setValue('');
      this.addressformgrp.get(this.formgroupName + '.districtId')?.setValue('');
    }
  }
  getTotalPages(totalRecords, rows) {
    this.totalpages = Math.ceil((totalRecords) / rows);
    return Math.ceil((totalRecords) / rows);
  }
  navigateNxtPrevPage(pageNo, rows) {
    this.currentPage = pageNo / rows;
    this.tempCurrentPage = this.currentPage;
  }
  navigatePage(pageNo, rowscount) {
    if (+pageNo > this.totalpages || +pageNo <= 0) {
      this.currentPage = this.tempCurrentPage;
    } else {
      this.dtable.onPageChange({ first: ((pageNo - 1) * rowscount), rows: rowscount });
      this.tempCurrentPage = this.currentPage;
    }
  }
  // binding zipcode based on location
  selectPlace() {
    const value = this.addressformgrp.get(this.formgroupName + '.locationId').value;
    if (value && !this.addressformgrp.get(this.formgroupName + '.postalCode').value) {
      this.setLocationName(value);
      this.placeKeyup = false;
      const row = this.placefilterlist.filter(f => f.locationId === value);
      this.addressformgrp.get(this.formgroupName + '.postalCode')?.setValue(row[0].postalCode);
    } else {
      const loc = this.placefilterlist.filter(f => f.locationId === value);
      this.addressformgrp.get(this.formgroupName + '.cityId')?.setValue(loc[0].cityId);
      this.setCityName(loc[0].cityId);
    }
  }
  // location list filter by enter value using Keyup
  placeKeyupFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        this.placeKeyup = false;
        const locations = this.placefilterlist.filter(e =>
          e.locationName.toLowerCase().trim() === value.toLowerCase());
        if (locations.length > 0) {
        } else {
          this.placeKeyup = true;
          // this.addressformgrp.get(this.formgroupName + '.postalCode')?.setValue('');
        }
      } else {
        this.placeKeyup = false;
        // this.addressformgrp.get(this.formgroupName + '.postalCode')?.setValue('');
      }
    }
  }
  // load placeList to placefilterlist auto Complete
  placeItems(value: any) {
    if (!value) { this.assignPlaceCopy(); }
    if (value) {
      this.placefilterlist = Object.assign([], this.placeList).filter(
        item => ((item.locationName.toLowerCase().indexOf(value.toLowerCase()) > -1)));
    }
  }
  assignPlaceCopy() {
    this.placefilterlist = Object.assign([], this.placeList);
  }
  // check location name valid
  checkValidPlace(): void {
    const value = this.addressformgrp.get(this.formgroupName + '.locationId').value;
    let loc: any;
    if (value === '' || value === null) {
    } else {
      if (isNaN(value)) { //to chevk whether the value is string - kuzhali - oct 10 2023
        loc = this.placefilterlist.filter(e =>
          e.locationName.toLowerCase() === value.toLowerCase()); // filters from original array by the given input value
        if (loc.length == 1) { // if filter value is one
          this.addressformgrp.get(this.formgroupName + '.locationId')?.setValue(loc[0].locationId); // set corresponding id to the field
          this.setLocationName(loc[0].locationId);
          this.addressformgrp.get(this.formgroupName + '.locationId').setErrors(null);
        }
        else { // if filter value is greater than one 
          this.addressformgrp.get(this.formgroupName + '.locationId')?.setValue(''); // field will be empty
          this.addressformgrp.get(this.formgroupName + '.locationId').setErrors({ incorrect: true });
        }
      } else {
        loc = this.placefilterlist.find(e =>
          e.locationId === value);
        if (loc) {
          this.addressformgrp.get(this.formgroupName + '.locationId')?.setValue(loc.locationId);
          this.setLocationName(loc.locationId);
          this.addressformgrp.get(this.formgroupName + '.locationId').setErrors(null);
        }
      }
    }
  }
  // display fuction for return location Name by locationId
  get displayPlaceFn() {
    const placeNew = (pl) => {
      if (pl == null || pl === undefined) {
        return null;
      } else {
        if (pl && this.placeList && this.placeList.length > 0) {
          pl = this.placeList.find(x => x.locationId === pl);
          if (pl) {
            return pl.locationName;
          } else {
            return null;
          }

        } else {
          return null;
        }
      }
    };
    return placeNew;
  }
  // zipcode change event
  zipCodeChange() {
    this.datavalue = null;
    if (!this.addressformgrp.get(this.formgroupName + '.postalCode').value) {
      this.addressformgrp.get(this.formgroupName + '.locationId')?.setValue('');
      this.addressformgrp.get(this.formgroupName + '.locationId')?.disable();
      this.addressformgrp.get(this.formgroupName + '.cityId')?.setValue('');
    }
    if (!this.addressformgrp.get(this.formgroupName + '.locationId').value &&
      !this.addressformgrp.get(this.formgroupName + '.cityId').value) {
      this.addressformgrp.get(this.formgroupName + '.locationId')?.disable();
      this.zipCodeList = [];
      this.zipCodefilterlist = [];
    }
    this.zipCodeBind = false;
    if (this.addressformgrp.get(this.formgroupName + '.districtId').valid &&
      this.addressformgrp.get(this.formgroupName + '.districtId').value) {
      this.selectDistrict(false);
    }

  }
  // postalcode list filter by enter value using Keyup
  zipCodeKeyupFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        this.zipKeyup = false;
        const postCode = this.zipCodefilterlist.filter(p => p.postalCode === value);
        if (postCode.length > 0) {
        } else {
          this.zipKeyup = true;
          // this.zipCodeItems('');
        }
      } else {
        this.zipKeyup = true;
        // this.zipCodeItems('');
      }
    }
  }
  // load zipCodeList to zipCodefilterlist using focus
  zipCodeItems(value: any) {
    // if (!value) { this.assignZipCodeCopy(); }
    if (value) {

      // this.zipCodefilterlist = Object.assign([], this.zipCodeList).filter(
      //   (item, i, arr) => arr.findIndex(p => p.postalCode === item.postalCode) === i);

      this.zipCodefilterlist = Object.assign([], this.zipCodeList).filter(
        item => ((item.postalCode.indexOf(value) > -1)));
    }
  }
  // load zipcodelist to zipCodefilterlist
  assignZipCodeCopy() {
    this.zipCodefilterlist = Object.assign([], this.zipCodeList);
  }
  getStateList(value: any) {

    if (this.common.stateList.length > 0) {
      this.stateList = this.common.stateList.filter(s => s.countryId == value.countryId)
      this.stateItems('');
      this.addressformgrp.get(this.formgroupName + '.stateId')?.setValue(value.stateId);
      this.setStateName(value.stateId);
      this.addressformgrp.get(this.formgroupName + '.districtId')?.setValue(value.districtId);
      this.setDistrictName(value.districtId);
    } else {

      this.masterService.GetStatesList(value.countryId).subscribe(res => {
        if (res) {
          this.stateList = res;

          this.stateList = Object.assign([], this.stateList);
          this.stateItems('');
          this.addressformgrp.get(this.formgroupName + '.stateId')?.setValue(value.stateId);
          this.setStateName(value.stateId);
          this.addressformgrp.get(this.formgroupName + '.districtId')?.setValue(value.districtId);
          this.setDistrictName(value.districtId);
        }
      });
    }
  }
  getDistricList(value: any) {
    if (this.common.stateId == value.stateId) {
      this.districtItems('');
      this.addressformgrp.get(this.formgroupName + '.stateId')?.setValue(value.stateId);
      this.setStateName(value.stateId);
      this.addressformgrp.get(this.formgroupName + '.districtId')?.setValue(value.districtId);
      this.setDistrictName(value.districtId);
    } else {
      this.masterService.GetDistrictList(value.stateId).subscribe(res => {
        if (res) {
          this.common.stateId = value.stateId;
          this.districtList = res;
          this.common.districtList = this.common.CloneObject(this.districtList);
          this.districtItems('');
          this.addressformgrp.get(this.formgroupName + '.stateId')?.setValue(value.stateId);
          this.setStateName(value.stateId);
          this.addressformgrp.get(this.formgroupName + '.districtId')?.setValue(value.districtId);
          this.setDistrictName(value.districtId);
        }
      });
    }
  }

  setStateName(stateId: any) {
    if (stateId && this.stateList.length > 0) {
      const data = this.stateList.filter(e => e.stateId === stateId);
      if (data.length > 0) {
        this.addressformgrp.get(this.formgroupName + '.state')?.setValue(
          data[0].stateName);
      }
    }
  }

  setDistrictName(districtId: any) {
    if (districtId && this.districtList.length > 0) {
      const data = this.districtList.filter(e => e.districtId === districtId);
      if (data.length > 0) {
        this.addressformgrp.get(this.formgroupName + '.district')?.setValue(
          data[0].districtName);
      }
    }
  }

  setCityName(cityId: any) {
    if (cityId && this.cityList && this.cityList.length > 0) {
      const data = this.cityList.filter(e => e.cityId === cityId);
      if (data.length > 0) {
        this.addressformgrp.get(this.formgroupName + '.cityId')?.setValue(
          cityId);
        this.addressformgrp.get(this.formgroupName + '.city')?.setValue(
          data[0].cityName);
      }
    }
  }

  setLocationName(locationId: any) {
    if (locationId && this.placeList) {
      if (this.placeList.length > 0) {
        const data = this.placeList.filter(e => e.locationId === locationId);
        if (data.length > 0) {
          this.addressformgrp.get(this.formgroupName + '.locationId')?.setValue(
            locationId);
          this.addressformgrp.get(this.formgroupName + '.place')?.setValue(
            data[0].locationName);
        }
      }
    }
  }

  setCountryName(countryId: any) {
    if (countryId && this.countryList) {
      if (this.countryList.length > 0) {
        const data = this.countryList.filter(e => e.countryId === countryId);
        if (data.length > 0) {
          this.addressformgrp.get(this.formgroupName + '.country')?.setValue(
            data[0].country);
        }
      }
    }
  }

  public openAddNewMasterData(type, action) {
    // this.initFormGroup();
    const popupData = {
      // action: 'Institution',
      headerText: 'Add New ' + action,
      bodyText: 'msg',
      addressData: this.addressformgrp.get(this.formgroupName).value,
      type
    };
    const dialogRef = this.dialog.open(AddAddressDetailComponent, {
      width: '720px',
      data: popupData,
      disableClose: true
    });
    if (dialogRef) {
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.action === 'save') {
          result.data.cityId = this.addressformgrp.get(this.formgroupName + '.cityId').value;
          this.masterService.AddAddressDetails(result.data).subscribe(res => {
            if (res && res.responseVm && res.responseVm.success) {
              this.datavalue = res;
              this.common.cityRes = this.datavalue;
              if (type === 'districtName') {
                this.addressformgrp.get(this.formgroupName + '.districtId')?.setValue(res.districtId);
                this.selectState(true);
                setTimeout(() => {
                  this.addressformgrp.get(this.formgroupName + '.districtId')?.setValue(res.districtId);
                  this.addressformgrp.get(this.formgroupName + '.cityId')?.setValue(res.cityId);
                  this.addressformgrp.get(this.formgroupName + '.locationId')?.setValue(res.locationId);
                }, 100);
              } else if (type === 'cityName') {
                this.addressformgrp.get(this.formgroupName + '.cityId')?.setValue(res.cityId);
                this.addressformgrp.get(this.formgroupName + '.locationId')?.setValue(res.locationId);
                this.addressformgrp.get(this.formgroupName + '.postalCode')?.setValue(res.postalCode);
                this.selectDistrict(false);
                setTimeout(() => {
                  this.addressformgrp.get(this.formgroupName + '.cityId')?.setValue(res.cityId);
                  this.addressformgrp.get(this.formgroupName + '.postalCode')?.setValue(res.postalCode);
                }, 100);
              } else if (type === 'locationName') {
                this.addressformgrp.get(this.formgroupName + '.locationId')?.setValue(res.locationId);
                this.addressformgrp.get(this.formgroupName + '.postalCode')?.setValue(res.postalCode);
                this.selectCity(false);
                setTimeout(() => {
                  this.addressformgrp.get(this.formgroupName + '.locationId')?.setValue(res.locationId);
                  this.addressformgrp.get(this.formgroupName + '.postalCode')?.setValue(res.postalCode);
                }, 100);
              }
              this.showTopCenter('success', 'Success Message', action + ' ' + 'insert Successfully');
            }
          });
        }

        if (!result) {
          // this.mainForm.get(this.formgroupName).get('major')?.setValue('');
        }
      });
    }
  }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }

  // VTS2-2024-CRT-0206 - Need to set condition in period of stay from date field based on DOB - By Naveen
  disableDates() {
    if (this.common.dateRestrictionInPOS == true && (this.common.dob != null && this.common.dob != undefined)
      && (this.getcompName == this.common.CRIMINAL_CHECK_PCC1 || this.getcompName == this.common.CRIMINAL_CHECK_PCC2 ||
        this.getcompName == this.common.CRIMINAL_CHECK_PCC3 || this.getcompName == this.common.CRIMINAL_CHECK_PCC3E ||
        this.getcompName == this.common.ONLINE_CRC || this.getcompName == this.common.OFAC_SDN || this.getcompName == this.common.ADDRESS)) {
      // const date = new Date(this.common.dob);
      this.posFromDate = new Date(this.common.dob);
    }
  }
}

