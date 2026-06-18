import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

import { BehaviorSubject } from 'rxjs';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { ScreeningComponentInfo } from 'src/app/common-methods/models/screening-details';
import { User } from 'src/app/common-methods/models/user';
import { BaseInfoComponent } from '../base-info/base-info.component';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { MatDialog } from '@angular/material/dialog';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';
import moment from 'moment';
import { PreDataComponent } from '../pre-data/pre-data.component';
import { AddNewComponent } from '../add-new/add-new.component';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  standalone: false,
  selector: 'app-current-employment',
  templateUrl: './current-employment.component.html',
  styleUrls: ['./current-employment.component.css']
})
export class CurrentEmploymentComponent implements OnInit, OnChanges {
  CFflag = 0;
  Message: any;
  disableFlag: boolean;
  naFlag = false;
  nFlag = false;
  insvalueId = 0;
  cfilterInstnList: any[] = [];
  focudMe = false;
  @Input() formgroupName: string;
  @Input() mainForm: UntypedFormGroup;
  @Input() selectedIndex: any;
  @Input() compBaseDetails: any;
  @Input() compAddress: any;
  @Input() fileBtn: boolean;
  @Input() docList: any;
  @Input() showNotApplicable: boolean;
  @Input() hiddenInsuff: boolean;
  @Input() showEmpHRSupFields: boolean;
  @Input() predata: any[] = [];
  @Input() supervisorAddress: any;
  @Output() emitFresher = new EventEmitter<any>();
  @Input() invitationFlag = false;
  @Input() currentAddress: any
  @Input() notApplicableBehaviorInput: any;
  @Input() directAppAddressFlag = false;
  @Input() isSuspectFlag: boolean;
  isFakeEmployee: boolean;
  docdata: any[] = [];
  screeningComponent = new ScreeningComponentInfo();
  address = new BehaviorSubject(null);
  supaddress = new BehaviorSubject(null);
  baseInfo: any;
  empList: any[] = [];
  filterEmpList: any[] = [];
  empKeyup: boolean;
  userData = new User();
  isTech = false;
  showInSuff: boolean;
  showHRSupFieldsFlag = false;
  applicationId: number;
  setBlur: boolean;
  dropdown: any;
  todateReadOnly = false;
  minDate = new Date();
  maxDate = new Date();
  maxDate1 = new Date();
  mininitiationdate = new Date();
  miscHint = { qHint: '(Eg. Company ID.)', aHint: '(Eg. A3455DR)' };
  empAlertCount: number;
  dateofinitiation = new UntypedFormControl();
  countryControls!: AutoCompleteDropDown;
  countryList: any[] = [];
  npReasonList: any[] = [];
  showRemarks = false;
  sameCurrentadd = false;
  displayedColumns = [
    { field: 'action', header: 'Action' },
    { field: 'address', header: 'Address' },
    { field: 'place', header: 'Village/Town' },
    { field: 'district', header: 'District/City' },
    { field: 'state', header: 'State' },
    { field: 'city', header: 'Place/Location/Area' },
    { field: 'country', header: 'Country' },
    { field: 'postalCode', header: 'Zip Code' },
    { field: 'periodOfStay', header: 'period Of Stay From - To' }

  ];
  itemperpage = 10;
  totalpages: number;
   @ViewChild('dt', { static: false }) dt!: Table;
  currentPage = 1;
  tempCurrentPage = 1;
  // casePriorities: any[] = [];
  // tooltipName = 'Add Address';
  rowIndex = -1;
  addressForm: UntypedFormGroup;
  periodofStayadd = new BehaviorSubject(null);
  @ViewChild('keeponHold', { static: true }) keeponHold: TemplateRef<any>;
  @ViewChild('OverLabPopUp', { static: true }) OverLabPopUp: TemplateRef<any>;
  @ViewChild('FakeEmp', { static: true }) FakeEmp: TemplateRef<any>;
  @ViewChild(BaseInfoComponent) baseComp: BaseInfoComponent;
  addressWithoutForm: any;
  addcontrolflag: boolean;
  constructor(public screeningService: ScreeningService, public fb: UntypedFormBuilder,
    public dialog: MatDialog, public common: CommonService, private cd: ChangeDetectorRef, private message: MessageService,
    private master: MasterService) {
    this.maxDate = new Date(this.maxDate.setFullYear(this.maxDate.getFullYear()));
    this.maxDate1 = new Date(this.maxDate1.setMonth(this.maxDate1.getMonth() + 3));
    this.minDate = new Date(this.minDate.setFullYear(this.minDate.getFullYear() - 100));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.mainForm != undefined) {
      if (this.mainForm.get('screeningComponentInfo')?.get('notApplicableFlag')?.value === true && this.applicationId == 3) {
        // this.addressForm.disable();
        this.disableFlag = true;
      }
      else if (this.mainForm.get('screeningComponentInfo')?.get('notApplicableFlag')?.value != true && this.mainForm.get('compRef')?.get('fresherFlag')?.value != true && this.applicationId == 3) {
        this.addressForm.enable();
        this.disableFlag = false;
      }

      if (changes.compAddress) {
        this.checkAddress();
      }
      if (changes.notApplicableBehaviorInput) {
        this.notApplicableBehavior(changes.notApplicableBehaviorInput.currentValue.value);

      }
      if (changes.supervisorAddress) {
        this.checksupervisorAddress();
      }
      if (changes.compBaseDetails) {
        if (this.compBaseDetails) {
          this.baseInfo = this.compBaseDetails;
          this.dropdown = this.screeningService.EmpaddressTypelst ? this.screeningService.EmpaddressTypelst.filter(s => s.lookUpName == 'New Address') : [];
          this.empList = this.screeningService.employerList;
          this.setEmpItems('');
          this.mainForm.get(this.formgroupName).get('employerName')?.
            setValue(this.mainForm.get(this.formgroupName).get('employerName')?.value);
        }
      }
      if (changes.formgroupName) {
        this.addcontrolflag = true;
      }
    }
  }
  notApplicableBehavior(event: any) {
    if (event) {
      if (this.baseComp && this.mainForm.get('screeningComponentInfo.compIndex')?.value && this.mainForm.get('screeningComponentInfo.compIndex')?.value > 1) {
        this.baseComp.notApplicable(event);
      }
    }
  }
  checkAddress() {
    this.address.next(this.compAddress);
    this.cd.markForCheck();
  }
  checksupervisorAddress() {
    this.supaddress.next(this.supervisorAddress);
    this.cd.markForCheck();
  }
  ngOnInit() {
    if (this.mainForm != undefined) {
      if (this.userData.applicationId == 3) {
        this.screeningService.compData = { compName: "Address" }
      }
      if (this.screeningComponent.componentDocument.length == 0) {
        this.screeningComponent.componentDocument = this.mainForm.get('screeningComponentInfo')?.get('componentDocument')?.value;
      }
      this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
      this.CFflag = this.mainForm.get('screeningComponentInfo.compIndex')?.value
      this.applicationId = this.userData.applicationId;
      this.showHRSupFields();
      if (this.mainForm.get('screeningComponentInfo')?.get('notApplicableFlag')?.value === true && this.applicationId == 3) {
        // this.addressForm.disable();
        this.disableFlag = true;
      }
      this.fresherFlagMethod(this.mainForm['controls']['compRef']['controls']['fresherFlag'].value);
      this.empList = this.screeningService.employerList;
      if (this.screeningService.caseFlag != true || this.userData.applicationId === 3) {
        this.countryControls =
          new AutoCompleteDropDown('Country', 'countryId', 'countryId', 'country', this.countryList,
            '', this.mainForm.get('compRef.supervisorDet') as UntypedFormGroup, false, false, false);
        this.getCountryList();
      }


      if (this.mainForm.get('screeningComponentInfo')?.get('insuffRaisedFlag')?.value === true) {
        this.docdata = this.mainForm.get('screeningInsufficiency')?.get('insuffDocument')?.value;
      }
      const add = this.mainForm.get(this.formgroupName).get('address')?.value;

      if (add.addressId > 0) {
        this.addressWithoutForm = this.mainForm.get(this.formgroupName).get('address')?.value;

        this.address = new BehaviorSubject(this.mainForm.get(this.formgroupName).get('address')?.value);
        this.address.next(this.mainForm.get(this.formgroupName).get('address')?.value);

      }

      this.initcompref();
      this.showInsuff();

      this.chengeCurrentEmp();


    }
  }
  getInput(value: any) {
    if (value && value.length >= 4) {
      this.GetCompanyInfo(value);
    } else if (value === '') {
      this.addressWithoutForm = null;
      this.GetCompanyInfo(value);
    } else {
      this.setEmpItems(value);
    }

  }
  GetCompanyInfo(value, flag = false) {
    let values1;
    let values2;
    if (flag == true) {
      values1 = this.getPaginationMValues(value);
    } else {
      values2 = this.getPaginationValues(value);
    }
    this.screeningService.GetCompanyInfo((flag == true) ? values1 : values2).subscribe(resp => {
      if (resp) {
        this.empList = resp;
        this.compBaseDetails.employer = resp;
        if (flag == true) {
          this.setEmpItems(this.empList[0].empName);
        } else {
          this.setEmpItems(value);
        }
        if (flag === true) {
          this.mainForm.get(this.formgroupName).get('employerName')?.setValue(this.mainForm.get(this.formgroupName).get('employerName')?.value);

        }
      }
    });
  }

  getPaginationMValues(filterId: any) {
    return {
      pageSize: 1,
      page: 1,
      filters: '',
      sorts: '-empInsId',
      applyPaging: false,
      empInsId: 0,
      needTotal: true,

      indianClientFlag: (this.screeningService.indianClientFlag || this.screeningService.ClientCategoryId == 1) ? true : false,
      department: this.userData.deptName,
      techmFlag: this.screeningService.ClientCategoryId == 4 ? true : false,
      clientCategoryId: this.screeningService.ClientCategoryId
    };
  }

  getPaginationValues(filter: any) {
    return {
      pageSize: 20,
      indianClientFlag: (this.screeningService.indianClientFlag || this.screeningService.ClientCategoryId == 1) ? true : false,
      page: 1,
      filters: 'name @=' + (filter === null ? '' : filter),
      sorts: '-empInsId',
      applyPaging: true,
      empInsId: 0,
      needTotal: true,
      department: this.userData.deptName,
      techmFlag: this.screeningService.ClientCategoryId == 4 ? true : false,
      clientCategoryId: this.screeningService.ClientCategoryId
    };
  }
  fresherFlagMethod(fresherFlag: any) {
    if (fresherFlag === true) {
      this.disableFlag = true;
      // if (this.userData.applicationId === 3) {
      this.mainForm['controls']['screeningComponentInfo']['controls']['componentDocument'].clearValidators();
      this.mainForm['controls']['screeningComponentInfo']['controls']['componentDocument'].updateValueAndValidity();
      // }
      this.mainForm['controls']['compRef'].disable();

      this.mainForm['controls']['screeningComponentInfo'].disable();
      this.mainForm['controls']['screeningInsufficiency'].disable();
      // this.mainForm['controls']['periodOfStayAddress'].disable();
      this.mainForm['controls']['componentCustomFields'].disable();
      this.mainForm['controls']['compRef']['controls']['fresherFlag'].enable();
      this.mainForm['controls']['componentCustomFields'].disable();
    }
    else {
      if (this.userData.applicationId === 3) {
        this.mainForm['controls']['screeningComponentInfo']['controls']['componentDocument'].setValidators(Validators.required);
        this.mainForm['controls']['screeningComponentInfo']['controls']['componentDocument'].updateValueAndValidity();
      }
      this.mainForm['controls']['screeningComponentInfo']['controls']['componentDocument'].enable();
      this.mainForm['controls']['screeningComponentInfo']['controls']['componentDocument'].enable();
      this.mainForm['controls']['compRef'].enable();
      //this.addressForm.enable();
      this.disableFlag = false;
      this.mainForm['controls']['screeningComponentInfo'].enable();
      this.mainForm['controls']['screeningInsufficiency'].enable();
      //    this.mainForm['controls']['periodOfStayAddress'].enable();
      this.mainForm['controls']['componentCustomFields'].enable();
      this.mainForm['controls']['compRef']['controls']['fresherFlag'].enable();
      this.mainForm['controls']['componentCustomFields'].enable();
    }
  }
  getCountryList() {
    if (this.countryList.length > 0) {
      this.countryControls =
        new AutoCompleteDropDown('Country', 'countryId', 'countryId', 'country', this.countryList,
          '', this.mainForm.get('compRef.supervisorDet') as UntypedFormGroup, false, false, false);
    } else {
      this.master.GetCountryList().subscribe(res => {
        if (res) {
          this.countryList = res;
          this.countryControls =
            new AutoCompleteDropDown('Country', 'countryId', 'countryId', 'country', this.countryList,
              '', this.mainForm.get('compRef.supervisorDet') as UntypedFormGroup, false, false, false);
        }
      });
    }
  }
  GetNotProvidedReasonList() {
    this.screeningService.GetNotProvidedReasonList().subscribe(res => {
      if (res) {
        this.npReasonList = res;
      }
    });
  }
  get anReasonShow(): boolean {
    const fromdate = this.mainForm.get(this.formgroupName + '.fromDate').value;
    const toDate = this.mainForm.get(this.formgroupName + '.toDate').value;
    const showflag = this.invitationFlag ? (((fromdate ? fromdate.toUpperCase() : '') === 'NOT PROVIDED') ||
      ((toDate ? toDate.toUpperCase() : '') === 'NOT PROVIDED')) ? true : false : false;
    if (!showflag) {
      this.mainForm.get(this.formgroupName + '.npReasonLookupId').setValue('');
    }
    return showflag;
  }
  get otherReasonShow(): boolean {
    const npRason = this.mainForm.get(this.formgroupName + '.npReasonLookupId').value;
    if (this.npReasonList.length > 0) {
      const reasonObj = this.npReasonList.find(f => f.lookUpId === npRason);
      this.showRemarks = reasonObj ? reasonObj.lookUpName.toUpperCase() === 'OTHERS' ? true : false : false;
      if (!this.showRemarks) {
        this.mainForm.get(this.formgroupName + '.npRemarks').setValue('');
      }
    }
    return this.showRemarks;
  }
  get Supervisor(): UntypedFormGroup {
    return this.mainForm.get(this.formgroupName + '.supervisorDet') as UntypedFormGroup;
  }
  empkeyUpFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        const data = this.filterEmpList.filter(e =>
          e.name.toLowerCase() === value.toLowerCase() ||
          e.address.state.toLowerCase() === value.toLowerCase());
        if (data.length > 0) {
          this.empKeyup = true;
        } else {
          this.empKeyup = true;
        }
      } else {
        this.empKeyup = false;
      }
      this.disableAddByEmp();
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
  getName(option: any) {
    return (option.address.addressId === this.screeningService.defaultAddressId) ? option.name + '  | Not Provided ' : option.name + '  |  ' + option.address.country + ' | ' + option.address.state + ' | ' + option.address.district;
  }
  setEmpItems(value: any) {
    if (!value) { this.assignResourceCopy(); }
    if (value) {

      this.filterEmpList = Object.assign([], this.empList).filter(
        item => ((item.name.toLowerCase().indexOf(value.toLowerCase()) > -1) ||
          item.address.state.toLowerCase().indexOf(value.toLowerCase()) > -1));


    }
  }
  assignResourceCopy() {
    this.filterEmpList = Object.assign([], this.empList);
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
  showHRSupFields() {
    this.showHRSupFieldsFlag = (this.screeningService.dAinvitationFlag && (this.mainForm['controls']['compRef']['controls']['fresherFlag'].value != true && this.mainForm.get('screeningComponentInfo.notApplicableFlag')?.value != true)) ? true : false;
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
          this.mainForm.get(this.formgroupName).get('employerName')?.setValue('');
          this.getStatusDetails('genuine');

        } else {
          if (this.screeningService.caseFlagType !== this.common.NEWCASE) {
            const empObj = this.empList.find(x => x.name.toLowerCase() ===
              this.mainForm.get(this.formgroupName).get('employerName')?.value.toLowerCase());
            if (typeof empObj.researchStatus === 'number') {
              if (empObj.researchStatus != this.common.VERIFIEDNUM && this.screeningService.forResearchByPassFlag != true) {
                if (empObj.researchStatus == this.common.FORRESNUM) {
                  this.getStatusDetails('fake');
                  this.mainForm.get('screeningComponentInfo.screenStatusId')?.setValue(2);
                } else {
                  this.getStatusDetails('genuine');
                }
              }
            }
            else if (typeof empObj.researchStatus === 'string') {
              if (empObj.researchStatus != this.common.VERIFIEDNUM && this.screeningService.forResearchByPassFlag != true) {
                if (empObj.researchStatus == this.common.FOR_RE) {
                  this.getStatusDetails('fake');
                  this.mainForm.get('screeningComponentInfo.screenStatusId')?.setValue(2);
                } else {
                  this.getStatusDetails('genuine');
                }
              }
            }
          }
        }
      });
    }
  }
  changeEmployer() {

    setTimeout(() => {
      const employerName = this.mainForm.get(this.formgroupName).get('employerName')?.value;
      this.common.empdata = this.mainForm.get(this.formgroupName).get('employerName')?.value;
      if (this.applicationId === 3) {
        let msg = ''; let header = '';
        // const empObj = this.empList.find(x => x.name.toLowerCase() ===
        //   this.mainForm.get(this.formgroupName).get('employerName')?.value.toLowerCase());
        const empObj = this.empList.find(x => x.address.addressId ===
          this.mainForm.get(this.formgroupName).get('address')?.get('addressId')?.value);
        if (this.empList.filter(x => x.name.toLowerCase() === employerName.toLowerCase()).length === 1 && empObj) {
          this.addressWithoutForm = empObj.address;
          this.insvalueId = empObj.empInsId;
          this.address = new BehaviorSubject(empObj.address);
          this.address.next(empObj.address);
          setTimeout(() => {
            this.mainForm.get(this.formgroupName).get('address')?.setValue(empObj.address)
          }, 50);
        }
        if ((empObj.researchStatus === this.common.VERIFIEDNUM && empObj.isReverify && this.userData.applicationId == this.common.AcheckLoginId)) {
          this.mainForm.get(this.formgroupName).get('reverifyFlag')?.setValue(empObj.isReverify);
          const varn = this.mainForm;
          this.empAlertCount++;
          msg = 'The employer has been moved to Reverify concluded employer.';
          header = 'Alert';
          this.openDialog(msg, header);
        }
      }
      if (this.applicationId !== 3) {
        let msg = ''; let header = '';
        if (employerName) {
          // const empObj = this.empList.find(x => x.name.toLowerCase() ===
          //   this.mainForm.get(this.formgroupName).get('employerName')?.value.toLowerCase());
          const empObj = this.empList.find(x => x.address.addressId ===
            this.mainForm.get(this.formgroupName).get('address')?.get('addressId')?.value);
          if (empObj && this.empAlertCount > 0) {
            this.getmethod(empObj.empInsId, empObj.address.addressId, empObj.empInsAddressId);
            this.empAlertCount = 1;
          }
          if (empObj && this.empAlertCount === 0) {

            if (empObj.researchResultLookupName === 'Fake' && empObj.address.country === 'India' && this.screeningService.forResearchByPassFlag != true) {
              this.empAlertCount++;
              msg = 'Company name is matching with Fake Employer list.';
              header = 'Alert';
              this.openDialog(msg, header);
              this.getStatusDetails('genuine');

            } 
            else if ((empObj.researchStatus === this.common.VERIFIEDNUM || empObj.researchStatus === this.common.ReverifyFR )&& empObj.isReverify && this.userData.applicationId == this.common.AcheckLoginId) {
              const varn = this.mainForm;
              this.empAlertCount++;
              msg = 'The employer has been moved to Reverify concluded employer.';
              header = 'Alert';
              this.openDialog(msg, header);
            }
            else if ((empObj.researchStatus !=(this.common.VERIFIEDNUM || this.common.ReverifyFR)) && empObj.address.country === 'India') {
              let employmentForm = this.mainForm.get('compRef') as UntypedFormGroup;
              if (this.isSuspectFlag) {
                employmentForm.addControl('isClientSuspectFlag', new UntypedFormControl('true'))
              }
              this.isFakeEmployee = true;
              if (typeof empObj.researchStatus === 'number') {
                if (empObj.researchStatus != this.common.VERIFIEDNUM && this.screeningService.forResearchByPassFlag != true) {
                  this.empAlertCount++;
                  msg = 'Company name is under research verification process.';
                  header = 'Alert';
                  this.openDialog(msg, header);
                  if (empObj.researchStatus == this.common.FORRESNUM) {
                    this.getStatusDetails('fake');
                    this.mainForm.get('screeningComponentInfo.screenStatusId')?.setValue(2);
                  } else {
                    this.getStatusDetails('genuine');
                  }

                }
              }
              else if (typeof empObj.researchStatus === 'string') {
                if (empObj.researchStatus != this.common.VERIFIEDNUM && this.screeningService.forResearchByPassFlag != true) {
                  this.empAlertCount++;
                  msg = 'Company name is under research verification process.';
                  header = 'Alert';
                  this.openDialog(msg, header);

                  if (empObj.researchStatus == this.common.FOR_RE) {
                    this.getStatusDetails('fake');
                    this.mainForm.get('screeningComponentInfo.screenStatusId')?.setValue(2);
                  } else {
                    this.getStatusDetails('genuine');
                  }
                }
              }
            } else {
              let employmentForm = this.mainForm.get('compRef') as UntypedFormGroup;
              this.isFakeEmployee = false;
              if (this.isSuspectFlag) {
                employmentForm.removeControl('isClientSuspectFlag')
              }
              this.getStatusDetails('genuine');
            }
          } else {
            if (!empObj && employerName.trim() !== '') {
              this.mainForm.get(this.formgroupName).get('employerName')?.setErrors({ notmatch: true });
              this.mainForm.get(this.formgroupName).get('address')?.reset();
              this.mainForm.get(this.formgroupName).get('address')?.get('addressId')?.setValue(0);
            }

          }
          if (this.empList.filter(x => x.name.toLowerCase() === employerName.toLowerCase()).length !== 0 && empObj) {
            this.addressWithoutForm = empObj.address;
            delete empObj.address.addressPos;
            delete empObj.address.posDuration;
            this.address = new BehaviorSubject(empObj.address);
            this.address.next(empObj.address);
            setTimeout(() => {
              this.mainForm.get(this.formgroupName).get('address')?.setValue(empObj.address)
            }, 50);
          }
        }
        else {
          this.isFakeEmployee = false;
          let employmentForm = this.mainForm.get('compRef') as UntypedFormGroup;
          if (this.isSuspectFlag) {
            employmentForm.removeControl('isClientSuspectFlag')
          }
        }
      }
    }, 300);

  }
  getmethod(empInsId, addressId, empInsAddressId) {
    this.setBlur = false;
    this.empAlertCount = 0;
    // const instn = this.empList.find(x => x.empInsId === empInsId);
    const instn = this.empList.find(x => x.empInsId === empInsId && x.address.addressId === addressId && x.empInsAddressId == empInsAddressId);
    if (instn) {
      this.mainForm.get(this.formgroupName).get('employerName')?.setValue(instn.name);
      this.mainForm.get(this.formgroupName).get('companyId')?.setValue(instn.empInsId);
      this.mainForm.get(this.formgroupName).get('empInsAddressId')?.setValue(instn.empInsAddressId);
      this.mainForm.get(this.formgroupName).get('address')?.get('addressId')?.setValue(addressId);
      this.mainForm.get(this.formgroupName).get('reverifyFlag')?.setValue(instn.isReverify);
      this.addressWithoutForm = instn.address;
      this.address = new BehaviorSubject(instn.address);
      this.address.next(instn.address);
      this.disableAddByEmp();
    }

  }
  getStatusDetails(type: any) {
    const formValue = this.mainForm.getRawValue();
    if (type === 'fake' && this.screeningService.forResearchByPassFlag != true) {
      if (formValue.screeningComponentInfo.screeningCompId === 0) {
        this.setStatusValue(this.baseInfo.deScreeningStatus, this.common.FOR_RE);
      } else {
        this.setStatusValue(this.baseInfo.screeningStatus, this.common.FOR_RE);
      }
    } else {
      if (formValue.screeningComponentInfo.qcRejectFlag === true && this.common.instatusId != 2 && this.mainForm.get('screeningComponentInfo.screenStatusId')?.value !== 0) {
        this.mainForm.get('screeningComponentInfo.screenStatusId')?.setValue(this.common.instatusId);
      }
      else if (formValue.screeningComponentInfo.qcRejectFlag !== true) {
        if (this.mainForm.get('screeningComponentInfo.screenStatusId')?.value === 0) {
          this.setStatusValue(this.baseInfo.deScreeningStatus, 'open');
        } else {
          this.setStatusValue(this.baseInfo.screeningStatus, 'open');
        }
      }
    }
    this.setEmpItems(this.mainForm.get(this.formgroupName).get('employerName')?.value)
  }
  setStatusValue(list, status) {
    const statusId = list.find(x => x.screeningStatus.toLowerCase() === status.toLowerCase()).statusId;
    this.mainForm.get('screeningComponentInfo.screenStatusId')?.setValue(statusId);
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
  chengeCurrentEmp() {
    const currentEmploye = this.mainForm.get(this.formgroupName).get('currentEmployerFlag')?.value;
    if (currentEmploye) {
      this.mainForm.get(this.formgroupName).get('validationString')?.setValue(['NOT PROVIDED', 'TILL DATE', 'Not Provided']);
      this.mainForm.get(this.formgroupName).get('toDate')?.setValue('TILL DATE');
      this.todateReadOnly = true;
      this.calcCurrentCompany();
    } else {
      this.mainForm.get(this.formgroupName).get('validationString')?.setValue(['NOT PROVIDED', 'Not Provided']);
      if (this.mainForm.get('screeningComponentInfo.insuffRaisedFlag')?.value) {
        if (this.screeningService.insuffLevelList.length > 0) {
          const levelLookupId = this.screeningService.insuffLevelList.find(f => f.lookUpName === 'Level-1').lookUpId;
          this.mainForm.get('screeningInsufficiency.levelLookupId')?.setValue(levelLookupId);
        }
      }
      if (this.mainForm.get(this.formgroupName).get('toDate')?.value === 'TILL DATE') {
        this.mainForm.get(this.formgroupName).get('toDate')?.setValue('');

      }
      this.todateReadOnly = false;
    }
  }
  calcCurrentCompany() {
    if (this.mainForm.get(this.formgroupName).get('fromDate')?.value &&
      this.mainForm.get(this.formgroupName).get('toDate')?.value === 'TILL DATE') {
      const val = this.mainForm.get(this.formgroupName).get('toDate')?.value === 'TILL DATE' ?
        moment(new Date(), 'dd/MM/yyyy') : '';
      const val1 = moment(this.mainForm.get(this.formgroupName).get('fromDate')?.value, 'dd/MM/yyyy');
      if ((val1 && val1.isValid() === true) && (val && val.isValid() === true)) {
        if (val1 > val) {
          this.mainForm.get(this.formgroupName).get('fromDate')?.setErrors({ incorrect: true });
          this.mainForm.get(this.formgroupName).get('fromDate')?.markAsTouched();
        } else {
          this.mainForm.get(this.formgroupName).get('fromDate')?.setErrors(null);
        }
      }
    }
  }
  notApplicable(event: any) {
    this.fileBtn = event.checked;
    if (this.fileBtn) {
      this.nFlag = true;
    }
  }
  disableAddByEmp() {
    const empName = this.mainForm.get(this.formgroupName).get('employerName')?.value;
    if (empName) {
      const empData = this.empList.find(y => y.name.toLowerCase() === empName.toLowerCase());
      if (!empData) {
        this.mainForm.get(this.formgroupName).get('address')?.enable();
      }
    } else {
      this.mainForm.get(this.formgroupName).get('address')?.enable();
      this.mainForm.get(this.formgroupName).get('address')?.reset();
    }
  }
  public openDialogdata() {
    const popupData = {
      action: 'Company',
      headerText: 'Company Pre-Data',
      values: this.predata
    };
    const dialogRef = this.dialog.open(PreDataComponent, {
      width: '720px',
      data: popupData,
      disableClose: true
    });
    if (dialogRef) {
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.mainForm.get(this.formgroupName).get('employerName')?.setValue(result.rowdata.name);
          this.mainForm.get(this.formgroupName).get('companyId')?.setValue(result.rowdata.empInsId);
          this.mainForm.get(this.formgroupName).get('fromDate')?.setValue(result.rowdata.fromdate.replace(/\s+/g, ''));
          this.mainForm.get(this.formgroupName).get('toDate')?.setValue(result.rowdata.todate.replace(/\s+/g, ''));
          if (this.empList && result.rowdata.name) {
            const objemp = this.empList.find(x => x.name.toLowerCase() ===
              this.mainForm.get(this.formgroupName).get('employerName')?.value.toLowerCase());
            if (objemp) {
              this.changeEmployer();
            } else {
              this.openAddNewMasterData();
            }
          }
        }
      });
    }
  }
  public openAddNewMasterData() {
    this.screeningService.compData = { compName: "employment (hr)" }
    const popupData = {
      action: 'Employer',
      headerText: 'Add New Company',
      labelText: 'Company Name',
      bodyText: 'Company Name will goes under research verification process.',
      value: this.mainForm.get(this.formgroupName).get('employerName')?.value
    };
    const dialogRef = this.dialog.open(AddNewComponent, {
      width: '720px',
      data: popupData,
      disableClose: true
    });
    if (dialogRef) {
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (result.Responds != null) {
            this.insvalueId = 1;
            const values = this.getPaginationMValues(result.Responds.educationEmployerId);
            this.screeningService.GetCompanyInfo(values).subscribe(resp => {
              this.empList = resp;
              this.screeningService.employerList = resp;
              // const objins = this.empList.find(f => f.empInsId === result.Responds);
              const objins = this.empList.find(f => f.empInsId === result.Responds.educationEmployerId && f.address != null && f.address.addressId === result.Responds.addressId);
              this.filterEmpList = Object.assign([], this.empList).find(f => f.empInsId === result.Responds.educationEmployerId && f.address != null && f.address.addressId === result.Responds.addressId);
              this.mainForm.get(this.formgroupName).get('employerName')?.setValue(objins.name);
              this.common.empdata = objins.name;
              this.mainForm.get(this.formgroupName).get('companyId')?.setValue(objins.empInsId);
              this.mainForm.get(this.formgroupName).get('empInsAddressId')?.setValue(objins.empInsAddressId);
              this.mainForm.get(this.formgroupName).get('address')?.get('addressId')?.setValue(objins.address.addressId);
              this.addressWithoutForm = objins.address;
              delete objins.address.addressPos;
              delete objins.address.posDuration;
              this.getmethod(objins.empInsId, objins.address.addressId, objins.empInsAddressId);


              // this.GetCompanyInfo(objins.empInsId, true);

              this.address = new BehaviorSubject(objins.address);
              this.address.next(objins.address);
              setTimeout(() => {
                this.mainForm.get(this.formgroupName).get('address')?.setValue(objins.address)
              }, 50);
              if (this.applicationId !== 3 && objins.address.country === 'India') {
                this.getStatusDetails('fake');
              } else {
                this.getStatusDetails('genuine');
              }
            });
          }
        }

      });
    }
  }
  changeKeeponHold(event: any) {
    if (event.value) {
      this.dialog.open(this.keeponHold,
        { width: '450px', disableClose: true, });
      this.dateofinitiation.setValidators(Validators.required);
    } else {
      this.dateofinitiation.clearValidators();
      this.dateofinitiation.setValue(null);
      this.dateofinitiation.updateValueAndValidity();
    }
  }
  keeponHoldYes() {
    if (this.dateofinitiation.valid) {
      this.mainForm.get(this.formgroupName).get('empInitiationDate')?.setValue(this.dateofinitiation.value);
      this.dialog.closeAll();
    } else {

    }
  }
  keeponHoldNo() {
    this.mainForm.get(this.formgroupName).get('empInitiationDate')?.setValue(null);
    this.dialog.closeAll();
  }
  chengeFresherEmp(event: any) {
    this.emitFresher.emit(event);
    const currentEmploye = this.mainForm.get(this.formgroupName).get('currentEmployerFlag')?.value;
    if (currentEmploye == false) {
      this.fresherFlagMethod(event.checked);
    }
    else {
      this.showTopCenter(
        'warn',
        'Failure Message',
        'Please Select One Choice'
      );
      this.mainForm.get(this.formgroupName).get('fresherFlag')?.setValue(false);
    }
  }
  initcompref() {
    this.addressForm = this.fb.group({
      screeningAddressId: new UntypedFormControl(0),
      companyId: new UntypedFormControl(0),
      screeningCompId: new UntypedFormControl(0),
      addressTypeId: new UntypedFormControl(0),
      screeningEmployeeId: new UntypedFormControl(0),
      screeningCriminalCheckId: new UntypedFormControl(0),
      screeningPCC3ECompId: new UntypedFormControl(0),
      periodOfStay: new UntypedFormControl('', this.validatedateInputStayFromwithBirt),
      periodOfStayTo: new UntypedFormControl('', this.validatedateInputwitTilldate),
      addressTypeLookupId: new UntypedFormControl('', Validators.required),
      checkPermanentAddress: new UntypedFormControl(),
      validationString: new UntypedFormControl(['NOT PROVIDED', 'SINCE BIRTH', 'TILL DATE']),
      address: this.initCommonAddress()
    });
  }
  initCommonAddress(): UntypedFormGroup {
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
          periodOfStay: new UntypedFormControl('', this.validatedateInputStayFromwithBirt),
          periodOfStayTo: new UntypedFormControl('', this.validatedateInputwitTilldate),
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
    const sincebrithREGEX = /^(SINCE BIRTH)?$/;
    if (c.value) {
      const value = c.value.toUpperCase();
      return (sincebrithREGEX.test(value) || ddmmyyyyREGEX.test(value) ||
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
    const tillDateREGEX = /^(TILL DATE)$/;
    if (c.value) {
      const value = c.value.toUpperCase();
      return (ddmmyyyyREGEX.test(value) || ddmmmyyyyREGEX.test(value)
        || mmmyyyyREGEX.test(value) || tillDateREGEX.test(value)) ? null : {
        date: {
          invalidPattern: true
        }
      };
    }
  }
  navigateNxtPrevPage(pageNo, rows) {
    this.currentPage = pageNo / rows;
    this.tempCurrentPage = this.currentPage;
  }
  navigatePage(pageNo, rowscount) {
    if (+pageNo > this.totalpages || +pageNo <= 0) {
      this.currentPage = this.tempCurrentPage;
    } else {
      this.dt.onPageChange({ first: ((pageNo - 1) * rowscount), rows: rowscount });
      this.tempCurrentPage = this.currentPage;
    }
  }
  getTotalPages(totalRecords, rows) {
    this.totalpages = Math.ceil((totalRecords) / rows);
    return Math.ceil((totalRecords) / rows);
  }

  addUpdateAddress(action: any) {
    if (this.addressForm.valid) {
      if (this.rowIndex === -1) {
        this.addressForm.get('addressTypeId')?.setValue(this.addressForm.getRawValue().addressTypeLookupId);
        this.mainForm.get('periodOfStayAddress')?.value.push(this.addressForm.value);
      } else {
        this.mainForm.get('periodOfStayAddress').value[this.rowIndex] = this.addressForm.value;
      }
      this.reserAddressForm();
    } else {
      this.addressForm.markAllAsTouched();
    }
  }
  changeDate(date, control) {
    this.mainForm.get(this.formgroupName).get(control).setValue(new DatePipe('en-Us').transform(date.value, 'dd/MMM/yyyy'))
    this.upperValue(this.mainForm.get(this.formgroupName).get(control).value, control);

    if (control == 'periodOfStayTo' || control == 'periodOfStay') {
      this.touchSValidation(date.value, control);
    } else { this.touchValidation(date.value, control); }
  }
  handleDatechange(date, control) {
    this.addressForm.get(control).setValue(new DatePipe('en-Us').transform(date.value, 'dd/MMM/yyyy'))
    this.upperCase(this.addressForm.get(control).value, control);
    if (control == 'periodOfStayTo' || control == 'periodOfStay') {
      this.touchSValidation(date.value, control);
    } else { this.touchValidation(date.value, control); }
  }
  upperCase(val, control) {
    val = val.toUpperCase();
    this.addressForm.get(control).setValue(val);
    if (val.includes('NOT PROVIDED')) {
      this.mainForm.get(this.formgroupName).get('periodOfStay')?.setValue('Not Provided');
      this.mainForm.get(this.formgroupName).get('periodOfStayTo')?.setValue('Not Provided');
    }
  }
  fromDate(val, control) {
    if (!val.includes('NOT PROVIDED')) {
      let date1 = new Date();
      let date2 = this.common.convertDate(val);
      if (date2 > date1) {
        this.mainForm.get(this.formgroupName).get('fromDate')?.setErrors({ incorrectlimitf: true });
      }

    }
  }
  toDate(val, control) {
    if (!val.includes('NOT PROVIDED') && !val.toUpperCase().includes('TILL DATE')) {
      let date1 = new Date();
      let date2 = this.common.convertDate(val);
      if (this.CFflag != 1) {
        if (date2 > date1) {
          this.mainForm.get(this.formgroupName).get('toDate')?.setErrors({ incorrectlimit: true });
        }
      }
      if (this.CFflag == 1) {
        if (date2 > this.maxDate1) {
          this.mainForm.get(this.formgroupName).get('toDate')?.setErrors({ incorrectlimit: true });
        }
      }
    }
  }
  upperValue(val, control) {
    val = val.toUpperCase();
    this.mainForm.get(this.formgroupName).get(control).setValue(val);

    if (val.includes('NOT PROVIDED') && control === "fromDate") {
      this.mainForm.get(this.formgroupName).get('fromDate')?.setValue('Not Provided');
    }
    if (val.includes('NOT PROVIDED') && control === "contactNo") {
      this.mainForm.get(this.formgroupName).get('supervisorDet.supervisorContactNo.contactData')?.setValue('Not Provided');

    }
    if (val.includes('NOT PROVIDED') && control === "contactEmail") {
      this.mainForm.get(this.formgroupName).get('supervisorDet.supervisorEmail.contactData')?.setValue('Not Provided');
    }
    if (val.includes('NOT PROVIDED') && control === "toDate") {
      this.mainForm.get(this.formgroupName).get('toDate')?.setValue('Not Provided');
    }
  }
  touchValidation(val, control) {
    if ((this.mainForm.get(this.formgroupName).get('fromDate')?.value && val) && this.mainForm.get(this.formgroupName).get(control).value < this.mainForm.get(this.formgroupName).get('fromDate')?.value) {
      this.mainForm.get(this.formgroupName).get(control).markAsTouched();
    }
  }
  touchSValidation(val, control) {
    if ((this.addressForm.get('periodOfStay')?.value && val) &&
      this.addressForm.get(control).value < this.addressForm.get('periodOfStay')?.value) {
      this.addressForm.get(control).setErrors({ comparison: true });
      this.addressForm.get(control).markAsTouched();
    }
  }
  dateCalc(from, to) {
    return this.fb.group({
      UntypedFormGroup: this.mainForm.get(this.formgroupName)
    },
      {
        validator: this.common.dateCompareFile('fromDate',
          'toDate')
      },
    );
  }
  getDateCal(compId, index, fromdate, todate) {
    let startdate: any;
    let enddate: any;

    if (fromdate !== 'NOT PROVIDED' || todate !== 'NOT PROVIDED') {
      let compArr: any[] = [];
      const formRawValue = this.common.fileSubmissionCom.getRawValue();
      compArr = formRawValue.screeningComponent.find(x => x.compId ===
        compId).component;
      compArr.splice(index - 1, 1);
      if (fromdate != '') {
        startdate = this.common.convertDate(fromdate);
      }

      if (todate != '') {
        enddate = this.common.convertDate(todate);
      }


      if (todate.toUpperCase().includes('TILL DATE')) {
        let secondDate = new Date(new Date());
      }
      for (let i = 0; i <= (compArr.length - 1); i++) {

        if (compArr[i].compRef.toDate != null) {
          if (compArr[i].compRef.toDate.toUpperCase().includes('TILL DATE')) {
            var tlDate = new Date();

          }
          else {
            tlDate = null;
          }
          if (todate.toUpperCase().includes('TILL DATE')) {
            var totlDate = new Date();

          }
          else {
            totlDate = null;
          }
          if (compArr[i].compRef.fromDate != null && compArr[i].compRef.toDate != null) {
            var frompDate = new Date(fromdate);
            var topDate = totlDate != null ? totlDate : new Date(todate);
            var firstDate = new Date(compArr[i].compRef.fromDate);
            var secondate = tlDate != null ? tlDate : new Date(compArr[i].compRef.toDate)

            if ((frompDate >= firstDate) && (topDate <= secondate)) {
              this.Message = "Period of Employement for this Employement (HR) " + fromdate + " and " + todate + " is Overlapping with Previous Employement (HR) " + compArr[i].compRef.fromDate + " and " + compArr[i].compRef.toDate;
              this.openEmpDialog();
              return false;

            }
          }
        }

      }
    }
  }
  openEmpDialog() {
    const dialogRef = this.dialog.open(this.OverLabPopUp, {
      width: '350px',
      disableClose: true
    });
  }
  assignvalue(value: any) {
    this.common.empdata = value;
  }

  Empvalidation(event: any, autoValue) {
    if (event.relatedTarget && event.relatedTarget.tagName === 'MAT-OPTION') {

      return;
    }
    this.empList = this.screeningService.employerList;
    if (autoValue != "" && autoValue != undefined) {
      this.cfilterInstnList = this.empList.filter(s => s.name == autoValue)
      if (this.filterEmpList.length === 0 || this.cfilterInstnList.length === 0) {
        const dialogRef = this.dialog.open(this.FakeEmp, {
          width: '350px',
          disableClose: true
        });
      }
    }
  }

  Empcvalidation() {
    this.empList = this.compBaseDetails.employer;
    if (this.common.empdata != "" && this.common.empdata != undefined) {
      if (this.mainForm.get(this.formgroupName).get('fresherFlag')?.value != true) {
        if (this.filterEmpList.length == 0) {
          const dialogRef = this.dialog.open(this.FakeEmp, {
            width: '350px',
            disableClose: true
          });


        }
      }

    }
  }
  validatetype(type: any) {


    if (type == 'okay') {
      this.openAddNewMasterData();


    } else if (type === 'cancel') {

      this.mainForm.get(this.formgroupName).get('employerName')?.setValue('')



    }

  }


  editAddress(rowData, index) {
    this.addressForm.get('addressTypeLookupId')?.setValue(489);
    this.rowIndex = index;
    this.addressForm.patchValue(rowData);
    this.screeningService.compData = { compName: "Address" }
    this.periodofStayadd.next(rowData.address);
  }
  reserAddressForm() {
    this.rowIndex = -1;
    this.addressForm.reset();
    this.addressForm.get('screeningAddressId')?.setValue(0);
    this.addressForm.get('address.addressId')?.setValue(0);
    this.addressForm.get('screeningEmployeeId')?.setValue(0);
  }
  public deleteperiodofStayAdd(id, index) {
    const popupData = {
      action: this.common.DELETECONFIRMATION,
      headerText: 'Confirmation',
      bodyText: 'Are you sure you want to delete this Address?'
    };
    const dialogRef = this.dialog.open(CommonAlertsComponent, {
      width: '320px',
      data: popupData,
      disableClose: true
    });
    if (dialogRef) {
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const action = String(result.type);
          if (action === this.common.DELETECONFIRMATION) {
            this.mainForm.get('periodOfStayAddress')?.value.splice(index, 1);
            this.reserAddressForm();
            if (id > 0) {
              this.deleteAddress(id);
            }
          }
        }
      });
    }
  }
  deleteAddress(id: any) {
    this.screeningService.resAddress(id).subscribe((id) => {
    });
  }
  addtypeChange(data: any) {
    this.screeningService.compData = { compName: "Address" }
    const addressType = this.compBaseDetails.addressType.find(f => f.lookUpId === data);
    if (addressType) {
      this.addressForm.get('addressTypeLookupId')?.setValue(addressType.lookUpId);
      if (addressType.lookUpName === 'Current Address') {
        this.sameCurrentadd = false;
        this.periodofStayadd.next(this.currentAddress.candidate.address)
        this.addressForm.get('periodOfStay')?.setValue(this.currentAddress.candidate.periodOfStay)
        this.addressForm.get('periodOfStayTo')?.setValue(this.currentAddress.candidate.periodOfStayTo)
      }
      else if (addressType.lookUpName === "Permanent Address") {
        this.sameCurrentadd = true;
        this.addressForm.get('address')?.reset();
        this.addressForm.get('periodOfStay')?.setValue(null)
        this.addressForm.get('periodOfStayTo')?.setValue(null)
        this.addressForm.get('address')?.get('addressId')?.setValue(0);
        this.permanentaddressFetch();
      }
      else {
        this.sameCurrentadd = false;
        this.addressForm.get('address')?.reset();
        this.addressForm.get('periodOfStay')?.setValue(null)
        this.addressForm.get('periodOfStayTo')?.setValue(null)
        this.addressForm.get('address')?.get('addressId')?.setValue(0);
      }
    }
  }

  chengeAddress(daata: any) {
    if (daata.checked === true) {
      this.addressForm.get('checkPermanentAddress')?.setValue(daata.checked);
      this.periodofStayadd.next(this.currentAddress.candidate.address);
      this.addressForm.get('periodOfStay')?.setValue(this.currentAddress.candidate.periodOfStay)
      this.addressForm.get('periodOfStayTo')?.setValue(this.currentAddress.candidate.periodOfStayTo)
    } else {
      this.addressForm.get('checkPermanentAddress')?.setValue(daata.checked);
      this.addressForm.get('address')?.reset();
      this.addressForm.get('periodOfStay')?.setValue(null)
      this.addressForm.get('periodOfStayTo')?.setValue(null)
      this.addressForm.get('address')?.get('addressId')?.setValue(0);
      this.permanentaddressFetch();
    }
  }
  notProvidevalidation(val: any) {
    if ((this.userData.applicationId === 3) && (val === 'NOT PROVIDED')) {
      this.mainForm.get(this.formgroupName).get('fromDate')?.setErrors({ incorrect: true });
    } else if ((this.userData.applicationId !== 3) && (val === 'NOT PROVIDED')) {
      this.mainForm.get(this.formgroupName).get('fromDate')?.setErrors(null);
    }
  }
  notProvide(val: any) {
    if ((this.userData.applicationId === 3) && (val === 'NOT PROVIDED')) {
      this.mainForm.get(this.formgroupName).get('toDate')?.setErrors({ incorrect: true });
    }
    else if ((this.userData.applicationId !== 3) && (val === 'NOT PROVIDED')) {
      this.mainForm.get(this.formgroupName).get('toDate')?.setErrors(null);
    }
  }
  notprovidedco(val: any) {
    if ((this.userData.applicationId === 3) && (val === 'NOT PROVIDED')) {
      this.mainForm.get(this.formgroupName).get('contactData')?.setErrors({ incorrect: true });
    } else if ((this.userData.applicationId !== 3) && (val === 'NOT PROVIDED')) {
      this.mainForm.get(this.formgroupName).get('contactData')?.setErrors(null);
    }
  }
  notprovidedmail(val: any) {
    if ((this.userData.applicationId === 3) && (val === 'NOT PROVIDED')) {
      this.mainForm.get(this.formgroupName).get('contactData')?.setErrors({ incorrect: true });
    } else if ((this.userData.applicationId !== 3) && (val === 'NOT PROVIDED')) {
      this.mainForm.get(this.formgroupName).get('contactData')?.setErrors(null);
    }
  }
  dateCompare(from, to) {
    return this.fb.group({
      UntypedFormGroup: this.addressForm
    },
      {
        validator: this.common.dateCompareFile('periodOfStay',
          'periodOfStayTo')
      },
    );
  }
  checkCurrentEmp() {
    const fresherEmploye = this.mainForm.get(this.formgroupName).get('fresherFlag')?.value;
    if (fresherEmploye == false) {
      this.chengeCurrentEmp();
    }
    else {
      this.showTopCenter(
        'warn',
        'Failure Message',
        'Please Select One Choice'
      );
      this.mainForm.get(this.formgroupName).get('currentEmployerFlag')?.setValue(false);
    }
  }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }
  permanentaddressFetch() {
    let pList: any[] = [];
    const subList = this.screeningService.componentList ?
      this.screeningService.componentList.filter(x => x.screeningSubComponent.length > 0 && x.compName === this.common.ADDRESS || x.compName === this.common.ADDRESS_GEO) : [];
    if (subList.length > 0) {
      pList = subList[0].screeningSubComponent.filter(x => x.subCompName === 'Permanent Address');
    }
    if (pList.length > 0 && this.screeningService.compFormArray.value.length > 0) {
      this.screeningService.compFormArray.value.forEach(ele => {
        if (ele.compId === pList[0].compId) {
          ele.component.forEach(ee => {
            if (ee.screeningComponentInfo.subCompId === pList[0].subCompId) {
              this.periodofStayadd.next(ee.compRef.address);
              this.addressForm.get('periodOfStay')?.setValue(ee.compRef.periodOfStay)
              this.addressForm.get('periodOfStayTo')?.setValue(ee.compRef.periodOfStayTo)
            }
          });
        }
      });
    }
  }
}

