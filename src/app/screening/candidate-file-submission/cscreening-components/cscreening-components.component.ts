import { Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef, ElementRef, DebugElement } from '@angular/core';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormArray, UntypedFormControl, Validators } from '@angular/forms';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/common-methods/models/user';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { CandidateAddedComponent, ScreeningDetails } from 'src/app/common-methods/models/screening-details';
import { retry } from 'rxjs/operators';
import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { EmploymentComponent } from '../../DynamicComponents/employment/employment.component';
export class SubComp {
  comindex: number;
  name: string;
}

@Component({
  standalone: false,
  selector: 'app-cscreening-components',
  templateUrl: './cscreening-components.component.html',
  styleUrls: ['./cscreening-components.component.css']
})
export class CscreeningComponentsComponent implements OnInit {
  fresherFlag = false;
  Gflag = false;
  notApplicableFlag = false
  btnRemove = false;
  componentName = '';
  noofComponent = 0;
  demo1TabIndex = 0;
  screeningCompid = 0;
  // PanFormGroup: UntypedFormGroup;
  // componentFormGroup: UntypedFormGroup;
  clientVendors: any[] = [];
  count = 0;
  index = 0;
  comp: SubComp[] = [];
  objcomp: SubComp = new SubComp();
  candidateAddedComponent = new CandidateAddedComponent();
  @Input() formgroupName: string;
  @Input() mainForm: UntypedFormGroup;
  @Input() compBaseDetails: any;
  @Input() tabIndex = 0;
  @Output() emitSubmitComp = new EventEmitter<any>();
  @Output() emitRejectcomp = new EventEmitter<any>();
  @Output() emitAddnewComp = new EventEmitter<any>();
  @Output() emitCompId = new EventEmitter<any>();
  @Output() emitLastComp = new EventEmitter<any>();

  // @Output() CurAaddress :any
  @Input() cusAddress: any
  @Input() Paymentflag: any
  @Output() emitAddNewCV = new EventEmitter<any>();
  @ViewChild('rejectedComments', { static: true }) rejectedComments: TemplateRef<any>;
  clientVendorsControl!: AutoCompleteDropDown;
  vendorList: any[] = [];
  screeningPriority: any[] = [];
  screeningStatus: any[] = [];
  selectedComponent: any;
  // compBaseDetails: any;
  addressList: any[] = [];
  address = new BehaviorSubject(null);
  userdata = new User();
  fileBtnFlag: boolean;
  compFormvalue: any;
  compStatus = 'Open';
  rejectedCommentsList: any[] = [];
  btnSave = false;
  btnApprove = false;
  btnreject = false;
  peraddressObj: any
  btnRejectComment = false;
  insuffDocArr: any;
  ishideCompCount = false;
  isAddNewComp = false;
  isAddCompBtnFlag = false;
  disablesubmitebtn = false;
  showInsuff = false;
  perAddress = false
  showInvitationFieldsFlag = false;
  showscopebypassflag = false;
  compData = {
    isSubComp: null,
    subCompId: null,
    onInit: true,
    compName: ''
  };
  prevIndex = -1;
  empHRdata: any;
  currentTabIndex = 0;
  currentCompTabIndex = 0;
  screeningDetails = new ScreeningDetails();
  notApplicableBehavior = new BehaviorSubject(null);
  // @ViewChild('empHrComp', { static: true }) empHrComp: EmploymentComponent;
  // insuffDocArr: any[] = [];
  constructor(public master: MasterService, public screeningService: ScreeningService, public dialog: MatDialog, private el: ElementRef,
    public common: CommonService, public fb: UntypedFormBuilder, private messageService: MessageService) { }

  ngOnInit() {
    this.screeningService.currentflag = false;
    this.userdata = JSON.parse(sessionStorage.getItem('user_data') as string);
    for (let i = 0; this.screeningService.componentList.length > i; i++) {
      if (this.gettotal(this.screeningService.componentList[i]) > 0) {
        this.getComponentForm(this.screeningService.componentList[i], i);
        break;
      }
    }
    this.buttonHidden();
    this.hideCompCount();
    this.showAddNewCompButton();
    this.insuffHidden();
    this.showInvitationField();
    this.screeningService.notApplicableSub.subscribe(res => {
      if (res) {
        this.changeNotapplicable(res);
      }
    });
    // this.changeFresher({checked: this.fresherFlag});
  }
  screeningComponentStatusDetails(compId: any) {
    // if (this.screeningService.caseFlagType === this.common.NEWCASE && this.common.manualClientDetails) {
    //   this.common.manualClientDetails.component = this.screeningService.componentList.filter(x => x.compId === compId);
    // }
    // if (this.componentName === this.common.EDUCATION) {
    //       this.GetInstitutioInfo();
    //       this.getUniversity();
    //    this.getDegreeLkpList();
    //    this.GetNotProvidedReasonList();   
    //    this.common.getEducationType();                 
    //     }
    //     if (this.componentName === this.common.EMPLOYMENT_HR ||
    //       this.componentName === this.common.EMPHR_EMPSUP) {
    //      this.GetCompanyInfo();
    //     }
    if (this.componentName !== this.common.DRUG_TEST && this.componentName !== this.common.EDUCATION && this.componentName != this.common.CRIMINAL_DATABASE) {
      this.screeningService.screeningComponentStatusDetails(compId, this.userdata.deptId ? this.userdata.deptId : 0, this.userdata.applicationId).subscribe(res => {
        if (res) {
          this.emitCompId.emit(compId);
          this.compBaseDetails = res;
          //this.compBaseDetails.currency.map(m => m.currencyShortName = m.countryName + ' - ' + m.currencyShortName);
          this.screeningService.baseDetail = this.compBaseDetails;
          // if (this.componentName === this.common.EDUCATION) {
          //   //this.GetInstitutioInfo();
          //   // this.screeningService.institutionList = Object.assign([], this.compBaseDetails.institution);
          //   this.screeningService.instituteList = Object.assign([], this.compBaseDetails.institute);
          //   this.screeningService.instituteList = this.screeningService.instituteList.concat(this.screeningService.newCollegeList);
          // }

          if (this.componentName === this.common.COMPANY_SITE_VISIT) {
            this.screeningService.companyList = Object.assign([], this.compBaseDetails.company);
          }
          if (this.componentName === this.common.EMPLOYMENT_SUPERVISOR ||
            this.componentName === this.common.EMPHR_EMPSUP ||
            this.componentName === this.common.REFERENCE_SELF_EMPLOYED) {
            this.screeningService.employerSupList = Object.assign([], this.compBaseDetails.professionalReference);
          }
          if (this.componentName === this.common.REFERENCE_CHECK) {
            this.screeningService.profNameList = Object.assign([], this.compBaseDetails.professionalName);
          }
          if (this.componentName === this.common.GAP_VERIFICATION) {
            this.screeningService.gapVerificationTypeList = Object.assign([], this.compBaseDetails.gapVerificationType);
          }
          if (this.componentName === this.common.LICENSE) {
            this.screeningService.issuingAuthorityList = Object.assign([], this.compBaseDetails.issuingAuthorityName);
          }
          if (this.componentName === this.common.CRIMINAL_CHECK_PCC3
            || this.componentName === this.common.CRIMINAL_CHECK_PCC3E
            || this.componentName === this.common.CRIMINAL_CHECK_PCC1
            || this.componentName === this.common.CRIMINAL_CHECK_PCC2
            || this.componentName === this.common.CRIMINAL_DATABASE
            || this.componentName === this.common.OFAC_SDN
            || this.componentName === this.common.ONLINE_CRC
            || this.componentName === this.common.ONLINE_CRC_INTERNAL
            || this.componentName === this.common.CRIMINAL_COURT_RECORD
            || this.componentName === this.common.CriminalCheckGap) {
            this.screeningService.addressType = Object.assign([], this.compBaseDetails.addressType);
          }
          if (this.componentName === this.common.CRIMINAL_CHECK_PCC3
            || this.componentName === this.common.CRIMINAL_CHECK_PCC3E
            || this.componentName === this.common.CRIMINAL_DATABASE) {
            this.screeningService.addressTypeCheck = Object.assign([], this.compBaseDetails.addressTypeCheck);
          }

        }
      });
    }
    else {
      this.compBaseDetails = this.screeningService.screeningDetail
    }
  }
  GetInstitutioInfo() {
    if (this.componentName.toUpperCase() === this.common.EDUCATION) {
      const values = this.getPaginationValues();
      this.screeningService.GetInstitutioInfo(values).subscribe(resp => {
        if (resp) {
          this.screeningService.institutionList = Object.assign([], resp);
        }

      });
    }
  }
  GetCompanyInfo() {
    if (this.componentName.toUpperCase() === this.common.EMPLOYMENT_HR ||
      this.componentName.toUpperCase() === this.common.EMPHR_EMPSUP) {
      const values = this.getPaginationValues();
      this.screeningService.GetCompanyInfo(values).subscribe(resp => {
        if (resp) {
          this.screeningService.employerList = Object.assign([], resp);
        }
        this.compBaseDetails.employer = resp;
      });
    }
  }
  //education
  getDegreeLkpList() {
    this.master.getAllDegreeLookup().subscribe(res => {
      this.screeningService.degreeList = res;

    });

  }
  getUniversity() {
    this.screeningService.getUniversity().subscribe(resp => {
      if (resp) {
        this.screeningService.Institution = resp;
      }
    })
  }
  GetNotProvidedReasonList() {
    this.screeningService.GetNotProvidedReasonList().subscribe(res => {
      if (res) {
        this.screeningService.npReasonList = res;
      }
    });
  }
  getPaginationValues() {
    return {
      pageSize: 50,
      page: 1,
      filters: '',
      sorts: '-empInsId',
      applyPaging: true,
      empInsId: 0,
      needTotal: true,
      department: this.userdata.deptName,
      indianClientFlag: (this.screeningService.indianClientFlag || this.screeningService.ClientCategoryId == 1) ? true : false,
      techmFlag: this.screeningService.ClientCategoryId == 4 ? true : false,
      clientCategoryId: this.screeningService.ClientCategoryId
    };
  }
  getInsuffDoc(compId: any) {
    if (this.showInsuff !== true) {
      this.screeningService.getInsuffDocument(compId).subscribe(resp => {
        this.insuffDocArr = this.common.CloneObject(resp);
        this.screeningService.insuffDocList = Object.assign([], resp);
        // setTimeout(() => {
        //   this.mainForm.get(this.formgroupName + '.insuffDocument').
        //     setValue(this.mainForm.get(this.formgroupName + '.insuffDocument').value);
        // }, 0);
      });
    }
  }
  insuffHidden() {
    this.showInsuff = !(this.userdata.applicationId === 1 && (this.screeningService.caseFlagType !== this.common.NEWCASE)
      && !(this.mainForm.value.screeningComponent[0].component &&
        this.mainForm.value.screeningComponent[0].component[0].screeningComponentInfo.clientScreeningId
        && this.screeningService.caseFlagType === this.common.QCREJECT));
  }
  showInvitationField() {
    this.showInvitationFieldsFlag = this.mainForm.get('invitationFlag')?.value;
  }
  getAddressData() {
    const data = JSON.parse(JSON.stringify(this.mainForm.getRawValue()));
    if (this.userdata.applicationId === 3 || this.screeningService.caseFlagType === this.common.PREQCCASE) {
      this.screeningService.componentList.forEach((element, index) => {
        if (element.subCompFlag) {
          const subcomp = element.screeningSubComponent.find(f => f.subCompName === 'Current Address');
          if (subcomp) {
            const compIndex = data.screeningComponent.findIndex(i => i.compId === subcomp.compId);
            const subCombIndex = data.screeningComponent[compIndex].component
              .findIndex(fi => fi.screeningComponentInfo.subCompId === subcomp.subCompId);
            data.screeningComponent[compIndex].component.splice(subCombIndex, 1);
          }
        }
      });
    }
    this.addressList = data.screeningComponent;
  }
  getemploymentdata() {
    const empid = this.screeningService.componentList.find(f => f.compName.toUpperCase() === this.common.EMPLOYMENT_HR.toUpperCase());
    if (empid) {
      const data = JSON.parse(JSON.stringify(this.mainForm.getRawValue()));
      return data.screeningComponent.find(i => i.compId === empid.compId);
    } else {
      return null;
    }

  }
  getAddressStayTo(compName, frmindex): boolean {
    if ((this.userdata.teamName === 'DEPre-QC' || (this.userdata.subTeamLeadFlag === true &&
      this.userdata.teamName === 'CTS-SubmissionTeam')) && this.mainForm.get('invitationFlag')?.value === true) {
      const AddressFormgroup = this.getspecForm(compName, frmindex);
      const data = JSON.parse(JSON.stringify(AddressFormgroup.getRawValue()));
      const objComponent = this.screeningService.componentList.find(f => f.compName === compName);
      if (objComponent && objComponent.subCompFlag) {
        const subcomp = objComponent.screeningSubComponent.find(f => f.subCompName === 'Current Address');
        if (subcomp) {
          return data.screeningComponentInfo.subCompId === subcomp.subCompId ? true : false;
        } else {
          return false;
        }
      }
    } else {
      return false;
    }
  }
  getComponentForm(data: any, index) {
    this.screeningService.compName = data.compName
    if (this.prevIndex !== index || this.isAddNewComp) {
      this.currentTabIndex = 0;
      this.tabIndex = 0;
      this.isAddNewComp = false;
      this.prevIndex = index;
      this.getAddressData();
      let temp: any[] = [];
      this.comp = [];
      this.selectedComponent = [];
      this.selectedComponent = data;

      this.index = index;
      let count = 0;
      this.componentName = data.compName.toUpperCase();
      this.common.componentName = data.compName.toUpperCase();
      // if (data.compName === this.common.ADDRESS) {
      //   this.addressList = this.screeningService.caseSubmissionList.screeningComponent.find(f => f.compId === data.compId);
      // }
      if (data.compId > 0) {
        this.getInsuffDoc(data.compId);
        this.screeningComponentStatusDetails(data.compId);
        if (this.screeningService.caseFlagType === this.common.VEREJECT
          && this.mainForm.get('verificationRejectFlag')?.value) {
          this.screeningService.GetVerificationRejectRemarks(this.screeningService.screeningCompId).subscribe(res => {
            if (res) {
              this.rejectedCommentsList.push(res);
            }
          });
        } else if (this.screeningService.caseFlagType === this.common.FRREJECT) {
          this.screeningService.GetFrRejectRemarks(this.screeningService.screeningCompId).subscribe(res => {
            if (res) {
              this.rejectedCommentsList.push(res);
            }
          });

        }

      }
      this.screeningService.compData = data;
      this.screeningService.compFormArray = this.mainForm.get(this.formgroupName) as UntypedFormArray;
      if (data.subCompFlag) {
        let remarks = '';
        temp = data.screeningSubComponent;
        count = 0;
        let subcompRemarks = '';
        for (let a = 0; temp.length > a; a++) {
          for (let b = 0; temp[a].noOfComponent > b; b++) {
            if (this.userdata.applicationId === 3 ? temp[a].subCompName !== 'Current Address' : true) {
              this.objcomp = new SubComp();
              this.objcomp.comindex = count;
              this.objcomp.name = temp[a].noOfComponent > 1 ? temp[a].subCompName + ' ' + (b + 1) : temp[a].subCompName;
              this.comp.push(this.objcomp);
              count++;
            }
          }
          subcompRemarks = subcompRemarks + (temp[a].remarks !== null ? temp[a].remarks : '');
          remarks = remarks + '<b>' + temp[a].subCompName + ' </b><br>' + temp[a].remarks + '<br>';
        }
        // if (this.userdata.applicationId === 3 && subcompRemarks) {

        //   this.openRemarksDialog('Component Remarks', remarks);
        // }
        this.noofComponent = temp.reduce((a, b) => b.noOfComponent + a, 0);
        this.compData.compName = data.compName
      } else {
        this.comp = [];
        count = 0;
        // if (this.userdata.applicationId === 3 && this.selectedComponent.remarks) {
        //   this.openRemarksDialog('Component Remarks', this.selectedComponent.remarks);
        // }
        for (let k = 0; k < this.selectedComponent.noOfComponent; k++) {
          this.objcomp = new SubComp();
          this.objcomp.comindex = count;
          if (this.selectedComponent.noOfComponent === 1 || k === 0) {
            if (this.selectedComponent.compName.toUpperCase() === this.common.EDUCATION) {
              this.objcomp.name = 'HIGHEST EDUCATION';
            } else if (this.selectedComponent.compName.toUpperCase() === this.common.EMPLOYMENT_HR) {
              this.objcomp.name = 'CURRENT EMPLOYMENT(HR)';
            } else {
              this.objcomp.name = this.selectedComponent.noOfComponent > 1 ?
                this.selectedComponent.compName.toUpperCase() + ' ' + (k + 1) : this.selectedComponent.compName;
            }
          } else {
            this.objcomp.name = this.selectedComponent.noOfComponent > 1 ?
              this.selectedComponent.compName.toUpperCase() + ' ' + (k + 1) : this.selectedComponent.compName;
          }

          this.comp.push(this.objcomp);

          count++;
        }
        this.noofComponent = data.noOfComponent;
        this.compData.compName = data.compName;
      }

      if (data.compId > 0) {
        this.emitAddnewComp.emit(this.compData);
      }

    }
    this.currentCompTabIndex = 0;
    this.demo1TabIndex = 0;

  }
  getspecForm(type, i = 0) {
    this.screeningService.componentList.map(x => x.compName = x.compName.toUpperCase());
    const formgrp = this.mainForm.get(this.formgroupName) as UntypedFormArray;
    const compList = this.screeningService.componentList;
    const index = compList.findIndex(f => f.compName === type);
    const filtercomp = compList.find(f => f.compName === type);


    if (filtercomp) {
      const compFormGroup = formgrp.controls[index] as UntypedFormGroup;
      const compFormarray = compFormGroup.get('component') as UntypedFormArray;
      const spectFormGroup = compFormarray.controls[i] as UntypedFormGroup;
      if (spectFormGroup) {
        this.screeningCompid = spectFormGroup['controls']['screeningComponentInfo']['controls']['screeningCompId'] ?
          spectFormGroup['controls']['screeningComponentInfo']['controls']['screeningCompId'].value : 0;
      } else {
        this.screeningCompid = 0;
      }
      return spectFormGroup;
    }
  }
  getcrinalcheckForm(type): UntypedFormArray {
    this.screeningService.componentList.map(x => x.compName = x.compName.toUpperCase());
    const formgrp = this.mainForm.get(this.formgroupName) as UntypedFormArray;
    const compList = this.screeningService.componentList;
    const index = compList.findIndex(f => f.compName === type);
    const filtercomp = compList.find(f => f.compName === type);
    if (filtercomp) {
      const compFormGroup = formgrp.controls[index] as UntypedFormGroup;
      const compFormarray = compFormGroup.get('component') as UntypedFormArray;
      return compFormarray;
    }
  }
  notRaiseInsuff() {
    let flag = false;
    flag = this.getcrinalcheckForm(this.common.CRIMINAL_DATABASE).value.some(s => s.screeningComponentInfo.insuffRaisedFlag === true);
    return !flag;
  }
  getformGroup(type, i = 0, isClass = false): any {
    this.screeningService.componentList.map(x => x.compName = x.compName.toUpperCase());
    const formgrp = this.mainForm.get(this.formgroupName) as UntypedFormArray;
    const compList = this.screeningService.componentList;
    const index = compList.findIndex(f => f.compName === type);
    const filtercomp = compList.find(f => f.compName === type);
    const lastIndex = this.screeningService.caseSubmissionList ? this.screeningService.caseSubmissionList.screeningCaseComponent.length - 1 : -1;
    if (lastIndex > -1) {
      if (lastIndex === index) {
        this.emitLastComp.emit('last');
      }
      else if (index === 0) {
        this.emitLastComp.emit('first')
      }
      else {
        this.emitLastComp.emit('all');
      }
    }
    let ind = i;
    if (filtercomp) {
      const elmink = document.getElementsByClassName('mat-ink-bar');
      const elements = document.getElementsByClassName('mat-tab-label');
      const compFormGroup = formgrp.controls[index] as UntypedFormGroup;
      const compFormarray = compFormGroup.get('component') as UntypedFormArray;
      if (this.userdata.applicationId === 3 && filtercomp.subCompFlag) {
        const currentadd = filtercomp.screeningSubComponent.find(f => f.subCompName === 'Current Address');
        if (currentadd) {
          const arrayData = compFormarray.getRawValue();
          const currentAddIndex = arrayData.findIndex(f => f.screeningComponentInfo.subCompId === currentadd.subCompId);
          if (currentAddIndex > -1) {
            if (currentAddIndex <= i) {
              ind = ind + 1;
            }
          }
        }
      }
      const spectFormGroup = compFormarray.controls[ind] as UntypedFormGroup;
      if (spectFormGroup) {
        if (type.toLowerCase() === 'gap reason') {
          const compFormarray = this.mainForm.get('gapReason') as UntypedFormArray;
          if (!compFormarray.valid) {
            elements[i].classList.remove('mat-tab-label-completed');
            elements[i].classList.add('mat-tab-label-active');
            spectFormGroup.get('active')?.setValue(false)

          }
          else {
            elements[i].classList.remove('mat-tab-label-active');
            elements[i].classList.add('mat-tab-label-completed');
            spectFormGroup.get('active')?.setValue(true)

          }
        }
        const data = spectFormGroup.getRawValue();
        if (isClass) {
          if (type.toLowerCase() !== 'gap reason') {
            if (spectFormGroup.valid) { // && !spectFormGroup.disable
              if (!spectFormGroup.disabled && !data.active) {
                spectFormGroup.get('active')?.setValue(true);
              }
              // spectFormGroup.disable();
              if (elmink[0]) {
                elmink[0].classList.remove('mat-ink-bar-active');
                elmink[0].classList.add('mat-ink-bar-completed');
              }
              if (elements.length > 0 && elements) {
                if (elements[i]) {
                  elements[i].classList.remove('mat-tab-label-active');
                  elements[i].classList.add('mat-tab-label-completed');
                }

              }
              // return 'scrn-tab mat-accent';
            } else if (spectFormGroup.disabled) {
              if (elmink[0]) {
                elmink[0].classList.remove('mat-ink-bar-active');
                elmink[0].classList.add('mat-ink-bar-completed');
              }
              if (elements.length > 0 && elements) {
                if (elements[i]) {
                  elements[i].classList.remove('mat-tab-label-active');
                  elements[i].classList.add('mat-tab-label-completed');
                }

              }
            } else {
              if (spectFormGroup.disabled && data.active) {
                spectFormGroup.get('active')?.setValue(true);
              } else {
                spectFormGroup.get('active')?.setValue(false);
              }
              if (elmink[0]) {
                elmink[0].classList.remove('mat-ink-bar-completed');
                // elmink[0].classList.add('mat-ink-bar-active');
              }
              if (elements.length > 0 && elements) {
                if (elements[i]) {
                  elements[i].classList.remove('mat-tab-label-completed');
                  elements[i].classList.add('mat-tab-label-active');
                }
              }
            }
          }
          if (type.toLowerCase() === 'gap reason') {
            const compFormarrayg = this.mainForm.get('gapReason') as UntypedFormArray;
            if (compFormarrayg.valid) { // && !spectFormGroup.disable
              if (!spectFormGroup.disabled && !data.active) {
                spectFormGroup.get('active')?.setValue(true);
              }
              // spectFormGroup.disable();
              if (elmink[0]) {
                elmink[0].classList.remove('mat-ink-bar-active');
                elmink[0].classList.add('mat-ink-bar-completed');
              }
              if (elements.length > 0 && elements) {
                if (elements[i]) {
                  elements[i].classList.remove('mat-tab-label-active');
                  elements[i].classList.add('mat-tab-label-completed');
                }

              }
              // return 'scrn-tab mat-accent';
            }
          }

        } else {
          this.compStatus = this.screeningService.caseFlagType === this.common.REOPEN ? 'RE-OPEN' : (this.screeningService.caseFlagType === this.common.QCREJECT || data.preQCRejectFlag
            || (this.mainForm.get('verificationRejectFlag')?.value) || data.screeningComponentInfo.verificationRejectFlag || this.screeningService.caseFlagType === this.common.FRREJECT) ? 'REJECTED'
            : data.preQCApproveFlag ? 'APPROVED' : data.submittedFlag ? 'SUBMITTED' : (data.screeningComponentInfo.screeningCompId > 0 &&
              data.screeningComponentInfo.notApplicableFlag === true && this.screeningService.caseFlagType !== this.common.INSUFFCLEARANCE) ? 'CANCEL' : 'OPEN';
          // this.compFormvalue = spectFormGroup.value;
          if (this.userdata.applicationId !== 3) {
            if (this.screeningService.caseFlag
              || this.screeningService.caseFlagType === this.common.INSUFFCLEARANCE
              || this.screeningService.caseFlagType === this.common.SUBCHECK) {
              if (data.screeningComponentInfo.notApplicableFlag === true) {
                this.fileBtnFlag = true;
                if (data.screeningComponentInfo.screeningCompId > 0) {
                  if (this.screeningService.caseFlagType === this.common.INSUFFCLEARANCE) {
                    this.fileBtnFlag = false;
                    this.disablesubmitebtn = false;
                  }
                  else if (data.preQCApproveFlag || data.submittedFlag) {
                    this.fileBtnFlag = true;
                    this.disablesubmitebtn = true;
                  }
                  else if (data.preQCRejectFlag || this.screeningService.caseFlagType === this.common.INSUFFCLEARANCE) {
                    this.fileBtnFlag = false;
                    this.disablesubmitebtn = false;
                  } else {
                    this.fileBtnFlag = true;
                    this.disablesubmitebtn = true;
                  }
                  if (spectFormGroup.controls.compRef.disabled && data.submittedFlag !== null) {
                    this.fileBtnFlag = false;
                  }
                } else {
                  this.disablesubmitebtn = false;
                  // this.fileBtnFlag = false;
                }
              } else if (data.submittedFlag) {
                if (this.userdata.teamName === 'DEPre-QC' || (this.userdata.subTeamLeadFlag === true &&
                  this.userdata.teamName === 'CTS-SubmissionTeam')) {
                  this.fileBtnFlag = false;
                  this.disablesubmitebtn = false;
                } else {
                  this.fileBtnFlag = true;
                  this.disablesubmitebtn = true;
                }
              } else {
                this.fileBtnFlag = false;
                this.disablesubmitebtn = false;
              }
            } else if (this.screeningService.caseFlagType === this.common.NEWCASE ||
              this.screeningService.caseFlagType === this.common.QCREJECT) {
              this.fileBtnFlag = false;
              this.disablesubmitebtn = false;
              // } else if (this.screeningService.caseFlagType === this.common.QCREJECT) {
              //   if (!data.preQCApproveFlag && !data.preQCRejectFlag && !data.submittedFlag) {
              //   }
            } else if (this.screeningService.caseFlagType === this.common.PREQCREJECT) {
              this.fileBtnFlag = !data.preQCRejectFlag;
              this.disablesubmitebtn = !data.preQCRejectFlag;
            } else if (this.screeningService.caseFlagType === this.common.VEREJECT) {
              this.fileBtnFlag = false;
            } else if (this.screeningService.caseFlagType === this.common.FRREJECT) {
              this.fileBtnFlag = false;
            } else if (this.screeningService.caseFlagType === this.common.REOPEN) {
              this.fileBtnFlag = false;
            } else {
              // if (data.preQCApproveFlag || data.preQCRejectFlag || !data.screeningComponentInfo.deqcFlag) {
              if (data.preQCApproveFlag || data.preQCRejectFlag) {
                this.fileBtnFlag = true;
              } else if (data.submittedFlag && !spectFormGroup.disabled) {
                this.fileBtnFlag = false;
              } else if (!data.submittedFlag) {
                if (spectFormGroup.controls.compRef.disabled) {
                  this.fileBtnFlag = true;
                  this.disablesubmitebtn = false;
                } else {
                  this.fileBtnFlag = false;
                }
              }
              else {
                this.fileBtnFlag = true;
              }
              if (data.submittedFlag === true && data.compRef.fresherFlag === true && this.componentName.toLowerCase() === this.common.EMPLOYMENT_HR.toLowerCase()) {
                this.fileBtnFlag = false;
                this.disablesubmitebtn = false;
              }
            }
          } else {
            if (data.screeningComponentInfo.notApplicableFlag === true || data.screeningComponentInfo.clientApprovalFlag === true) {
              this.fileBtnFlag = true;
            } else {
              this.fileBtnFlag = false;
            }
          }
          return spectFormGroup;
        }
      }
    }
  }
  gettotal(data): number {
    if (this.userdata.applicationId === 3) {
      return data.subCompFlag ? data.screeningSubComponent.filter(f => f.subCompName !== 'Current Address')
        .reduce((a, b) => b.noOfComponent + a, 0) : data.noOfComponent;
    } else {
      return data.subCompFlag ? data.screeningSubComponent.reduce((a, b) => b.noOfComponent + a, 0) : data.noOfComponent;
    }
  }
  getPreQcOrNot(i: any) {
    const formgrp = this.mainForm.get(this.formgroupName) as UntypedFormArray;
    const frmarray = formgrp.controls[i].get('component') as UntypedFormArray;
    const data = frmarray.getRawValue();
    const ret = data.some(s => s.screeningComponentInfo.deqcFlag === true && s.preQCApproveFlag === false);
    return ret ? i : -1;
  }
  getValidorNot(index, compName): boolean {
    if (compName === "GAP REASON") {
      this.emitLastComp.emit('last')
    }

    this.common.fileSubmissionCom = this.mainForm;
    const formgrp = this.mainForm.get(this.formgroupName) as UntypedFormArray;
    const compForm = formgrp.controls[index] as UntypedFormGroup;
    const singleComp = compForm.controls.component as UntypedFormArray;
    if (compName === this.common.GAPREASON) {

      const reasonArray = this.mainForm.get('gapReason') as UntypedFormArray;

      if (!reasonArray.valid) {
        return false;
      }
      else {
        return true;
      }

    }

    if (compName === this.common.EMPLOYMENT_HR) {
      const frIndex = singleComp.getRawValue().findIndex(x => x.compRef && x.compRef.fresherFlag && x.compRef.fresherFlag === true);
      if (frIndex > -1) {
        const mainForm = singleComp.controls[frIndex] as UntypedFormGroup;
        if (this.userdata.applicationId === 3) {
          mainForm['controls']['screeningComponentInfo']['controls']['componentDocument'].clearValidators();
          mainForm['controls']['screeningComponentInfo']['controls']['componentDocument'].updateValueAndValidity();
        }
        mainForm['controls']['compRef'].disable();
        mainForm['controls']['screeningComponentInfo'].disable();
        mainForm['controls']['screeningInsufficiency'].disable();
       // mainForm['controls']['periodOfStayAddress'].disable();
        mainForm['controls']['componentCustomFields'].disable();
        mainForm['controls']['compRef']['controls']['fresherFlag'].enable();
        mainForm['controls']['componentCustomFields'].disable();
      }
    }
    // if (singleComp.controls.some(x => x.valid === true) && this.mainForm.get('invitationFlag')?.value === true) {
    //   if (compName === this.common.ADDRESS) {
    //     const originalAddressListCount = singleComp.getRawValue().filter(x => x.screeningComponentInfo && x.screeningComponentInfo.subCompId > 1).length;
    //     const validAddressListCount = singleComp.controls.filter(d => d.valid === true && d.value.screeningComponentInfo && d.value.screeningComponentInfo.subCompId > 1).length;
    //     formgrp.controls[index].clearValidators();
    //     formgrp.controls[index].updateValueAndValidity();
    //     return originalAddressListCount === validAddressListCount;
    //   } else {
    //     formgrp.controls[index].clearValidators();
    //     formgrp.controls[index].updateValueAndValidity();
    //     return formgrp.controls[index].valid;
    //   }
    // }
    if (singleComp.controls.some(x => x.disabled === true)) {
      if (!this.screeningService.caseFlag) {
        if (!singleComp.controls.some(x => x.get('submittedFlag')?.value === false)) {
          formgrp.controls[index].clearValidators();
          formgrp.controls[index].updateValueAndValidity();

          return formgrp.controls[index].valid;
        } else {
          return false;
        }
      } else {
        formgrp.controls[index].clearValidators();
        formgrp.controls[index].updateValueAndValidity();

        // formgrp.controls[index].markAsPristine();
        return formgrp.controls[index].valid;

      }
    } else {
      const data = singleComp.controls.filter(x => x.valid === true);
      if (compName === "ADDRESS") {
        if ((singleComp.controls.length === data.length) || (singleComp.controls.length - 1 === data.length)) {
          return true;
        } else {
          return false;
        }
      } else {

        if (singleComp.controls.length === data.length) {
          return true;
        } else {
          return false;
        }
      }
    }
  }
  getdata(i: any) {
    // this.address.next(this.addressList.component[i].compRef.address);
    return this.address;
  }

  submitComp(type, index) {
    const frmGroup = this.getformGroup(type, index) as UntypedFormGroup;
    this.screeningService.basicInfo = false;
    this.screeningService.StatusDeFlag = true;
    // if (type === this.common.CRIMINAL_DATABASE) {
    //   this.removeValidationForCB(frmGroup);
    // }
    this.notApplicableFlag = frmGroup.get('screeningComponentInfo.notApplicableFlag')?.value
    if (frmGroup.valid) {
      if (this.userdata.applicationId === 3 && this.mainForm.get('directAppAddressFlag')?.value === true && this.common.EMPLOYMENT_HR.toLowerCase() === type.toLowerCase() && frmGroup.controls
        .compRef.value.fresherFlag !== true && frmGroup.controls.screeningComponentInfo.value.notApplicableFlag !== true) {
        if (frmGroup.controls.periodOfStayAddress.value.length > 0) {
          const sendToQC = this.screeningService.caseFlagType === this.common.QCREJECT ? true : false;
          this.emitSubmitComp.emit({ formValue: frmGroup.getRawValue(), compName: type, sendToQC });
        } else {
          window.scrollTo(0, document.body.scrollHeight);
          this.showNotification('warn', 'Information', 'Please add atleast one Stay Residential Address');
          return;
        }
      } else {
        const sendToQC = this.screeningService.caseFlagType === this.common.QCREJECT ? true : false;
        this.emitSubmitComp.emit({ formValue: frmGroup.getRawValue(), compName: type, sendToQC });
      }
    } else {
      frmGroup.markAllAsTouched();   // Run any additional functionality if you need to.
      frmGroup.updateValueAndValidity();
      if (type.toLowerCase() === this.common.EMPLOYMENT_HR.toLowerCase()) {
        this.fresherFlag = frmGroup.get('compRef.fresherFlag')?.value;
      }
      if (type === this.common.EDUCATION) {
        const educationForm = frmGroup.get('compRef.institutionName') as UntypedFormControl;
        educationForm.markAllAsTouched();
        educationForm.updateValueAndValidity();
      }
      if (this.userdata.applicationId === 3 && this.notApplicableFlag != true && type && type !== 'Gap Reason' &&
        type !== 'Database' && type !== 'Address' && type !== 'Drug Test'
        && type !== 'Emergency Contact Verification' && type !== 'Employment (Supervisor)' &&
        type !== 'Gap Verification' && this.fresherFlag === false && type !== 'Reference Check' &&
        type !== 'Gap Check' && type !== 'GAP REASON' &&
        type !== 'DATABASE' && type !== 'ADDRESS' && type !== 'DRUG TEST'
        && type !== 'EMERGECY CONTACT VERIFICATION' && type !== 'EMPLOYEMENT (SUPERVISOR)' &&
        type !== 'GAP VERIFICATION' && this.fresherFlag === false && type !== 'REFERENCE CHECK' &&
        type !== 'GAP CHECK'

      ) {
        const docForm = frmGroup.get('screeningComponentInfo.componentDocument') as UntypedFormControl;
        if (docForm.value.length <= 0) {
          window.scrollTo(0, document.body.scrollHeight);
          this.showNotification('warn', 'Information', 'Please Upload Supporting Document');
        }
      }
    }
  }
  reject(type, index) {
    const frmGroup = this.getformGroup(type, index) as UntypedFormGroup;
    if (frmGroup.valid) {
      const data = frmGroup.value;
      this.emitRejectcomp.emit(data);
    } else {
      frmGroup.markAllAsTouched();
    }
  }
  getRejectedComments(type, index) {
    const frmGroup = this.getspecForm(type, index);
    const preqcvalue = frmGroup.get('rejectComments')?.value;
    const qcvalue = frmGroup.get('qcRejectComments')?.value;
    if (this.screeningService.caseFlagType !== this.common.VEREJECT && this.screeningService.caseFlagType !== this.common.FRREJECT) {
      this.rejectedCommentsList = preqcvalue.concat(qcvalue);
    }
    // const popupData = {
    //   action: this.common.ALERT,
    //   headerText: 'Rejected Comments',
    //   bodyText: value
    // };
    // const dialogRef = this.dialog.open(CommonAlertsComponent, {
    //   width: '400px',
    //   data: popupData,
    //   disableClose: true
    // });

    this.dialog.open(this.rejectedComments, {
      width: '550px', disableClose: true
    });
  }
  buttonHidden() {
    if (this.screeningService.caseFlag === true || this.screeningService.caseFlagType === this.common.PREQCREJECT || this.screeningService.caseFlagType === this.common.VEREJECT || this.screeningService.caseFlagType === this.common.FRREJECT
      || this.screeningService.caseFlagType === this.common.INSUFFCLEARANCE || this.screeningService.caseFlagType === this.common.SUBCHECK
      || this.screeningService.caseFlagType === this.common.REOPEN || this.userdata.applicationId === 3) {
      this.btnSave = true;
    }
    if ((this.screeningService.caseFlag === false && this.screeningService.caseFlagType === this.common.PREQCCASE)) {
      this.btnApprove = true;
      this.btnRemove = false;
      //this.btnreject=true;
      this.btnreject = !this.mainForm.get('invitationFlag')?.value;
    }
    if (this.screeningService.caseFlagType === this.common.QCREJECT) {
      this.btnApprove = true;
      this.btnRemove = true;
    }
    //if (this.mainForm.value.screening.ctsFlag === true  this.userdata.teamName === 'CTS-SubmissionTeam' && this.screeningService.caseFlagType !== this.common.PREQCCASE) {
    if (this.mainForm.value.screening.ctsFlag === true && this.userdata.teamName === 'CTS-SubmissionTeam' &&
      this.screeningService.caseFlagType !== this.common.PREQCCASE || this.userdata.applicationId === 3) {
      this.btnRemove = true;
    }
  }
  scrollTo(el: Element): void {
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
  scrollToError(): void {
    const firstElementWithError = document.querySelector('.ng-invalid');
    this.scrollTo(firstElementWithError);

  }

  async scrollIfFormHasErrors(form: UntypedFormGroup): Promise<any> {
    await form.invalid;
    this.scrollToError();
  }
  addNewComp(ctype, i, action) {
    const formgrp = this.mainForm.get(this.formgroupName) as UntypedFormArray;
    const compList = this.screeningService.componentList;
    const index = compList.findIndex(f => f.compName === ctype);
    const filtercomp = compList.find(f => f.compName === ctype);
    let data = {};
    let subcompname = '';
    let subIndex = -1;
    let currenAddIndex = -1;
    if (filtercomp) {
      this.candidateAddedComponent = new CandidateAddedComponent();
      const compFormGroup = formgrp.controls[index] as UntypedFormGroup;
      const compFormarray = compFormGroup.get('component') as UntypedFormArray;
      const cureentAddobj = filtercomp.subCompFlag ? filtercomp.screeningSubComponent.find(f => f.subCompName === 'Current Address') : null;
      let spectFormValue: any;
      if (cureentAddobj) {
        const FormValue = compFormarray.getRawValue().filter(f => f.screeningComponentInfo.subCompId !== cureentAddobj.subCompId);
        currenAddIndex = compFormarray.getRawValue().findIndex(f => f.screeningComponentInfo.subCompId === cureentAddobj.subCompId);
        spectFormValue = FormValue[i];
      } else {
        spectFormValue = compFormarray.controls[i].value;
      }
      //  = compFormarray.getRawValue().filter(f => f.);
      this.candidateAddedComponent.compId = filtercomp.compId;
      this.candidateAddedComponent.userId = this.userdata.userId;
      this.candidateAddedComponent.subCompFlag = filtercomp.subCompFlag;
      this.candidateAddedComponent.subCompId = 0;
      this.candidateAddedComponent.type = action;
      this.candidateAddedComponent.screeningCompId = spectFormValue.screeningComponentInfo.screeningCompId;
      this.candidateAddedComponent.caseNo = this.screeningService.screenCaseId;
      // if (compFormarray.valid) {
      if (filtercomp.subCompFlag) {
        subIndex = filtercomp.screeningSubComponent.filter(fl => fl.subCompName !== 'Current Address').findIndex(f =>
          f.subCompId === spectFormValue.screeningComponentInfo.subCompId);
        if (subIndex > -1) {
          // filtercomp.screeningSubComponent[subIndex].noOfComponent += 1;
          subcompname = filtercomp.screeningSubComponent.find(f => f.subCompId === spectFormValue.screeningComponentInfo.subCompId).subCompName;
        }
      }
      this.isAddNewComp = true;
      if (action === 'add') {
        // if (ctype === this.common.CRIMINAL_DATABASE) {
        //   compFormarray.controls.forEach(eleform => {
        //     this.removeValidationForCB(eleform);
        //   });
        // }
        if (compFormarray.valid || compFormarray.disabled) {
          if (filtercomp.subCompFlag) {
            // const subIndex = filtercomp.screeningSubComponent.findIndex(f =>
            //   f.subCompId === spectFormValue.screeningComponentInfo.subCompId);
            if (subIndex > -1) {
              if (this.userdata.applicationId === 3) {
                filtercomp.screeningSubComponent.find(f => f.subCompId === spectFormValue.screeningComponentInfo.subCompId).noOfComponent += 1;
                const noc = filtercomp.screeningSubComponent.find(f => f.subCompId === spectFormValue.screeningComponentInfo.subCompId);
                const snoc = this.selectedComponent.screeningSubComponent.find(f => f.subCompId === spectFormValue.screeningComponentInfo.subCompId);
                if (snoc.noOfComponent !== noc.noOfComponent) {
                  snoc.noOfComponent = noc.noOfComponent;
                }
              } else {
                filtercomp.screeningSubComponent[subIndex].noOfComponent += 1;
                if (this.selectedComponent.screeningSubComponent[subIndex].noOfComponent !== filtercomp.screeningSubComponent[subIndex].noOfComponent) {
                  this.selectedComponent.screeningSubComponent[subIndex].noOfComponent = filtercomp.screeningSubComponent[subIndex].noOfComponent;
                }
              }

              // subcompname = filtercomp.screeningSubComponent[subIndex].subCompName;
            }
            data = {
              isSubComp: filtercomp.subCompFlag, comptype: 'Individual', compId: filtercomp.compId,
              subCompId: filtercomp.subCompFlag ? spectFormValue.screeningComponentInfo.subCompId : null, type: ctype, index: i,
              onInit: false,
            };
            this.candidateAddedComponent.subCompId = spectFormValue.screeningComponentInfo.subCompId;
          } else {
            filtercomp.noOfComponent += 1;
            if (this.selectedComponent.noOfComponent !== filtercomp.noOfComponent) {
              this.selectedComponent.noOfComponent = filtercomp.noOfComponent;
            }
            data = {
              isSubComp: filtercomp.subCompFlag, comptype: 'Individual', compId: filtercomp.compId,
              subCompId: filtercomp.subCompFlag ? spectFormValue.screeningComponentInfo.subCompId : null, type: ctype, index: i,
              onInit: false,
            };
          }

          if (this.screeningService.caseFlagType === this.common.NEWCASE) {
            this.emitAddnewComp.emit(data);
            // this.selectedComponent.noOfComponent += 1;
            this.getComponentForm(this.selectedComponent, this.index);
          } else {
            // this.selectedComponent.noOfComponent += 1;
            this.screeningService.caseComponentAddedByCandidate(this.candidateAddedComponent).subscribe(res => {
              if (res) {
                this.emitAddnewComp.emit(data);
                if (this.mainForm.get('screening.scopeByPassFlag')?.value === true || this.mainForm.get('screening.ctsFlag')?.value === true
                  || this.userdata.teamName === 'CTS-SubmissionTeam' || this.screeningService.caseFlagType === "PREQCCASE") {
                  this.getComponentForm(filtercomp, this.index);
                }
                else {
                  this.getComponentForm(this.selectedComponent, this.index);
                }
              }
            });
          }

        } else {
          this.showNotification('info', 'Information', 'Please fill all ' + (filtercomp.subCompFlag ? subcompname : ctype) + ' component.');
        }
      } else if (action === 'remove') {
        if (i > -1) {
          if (filtercomp.subCompFlag) {
            const subCompId = spectFormValue.screeningComponentInfo.subCompId;
            this.candidateAddedComponent.subCompId = subCompId;
            subIndex = filtercomp.screeningSubComponent.findIndex(f => f.subCompId === subCompId);
            if (subIndex > -1) {
              filtercomp.screeningSubComponent[subIndex].noOfComponent -= 1;
              if (this.selectedComponent.screeningSubComponent[subIndex].noOfComponent !== filtercomp.screeningSubComponent[subIndex].noOfComponent) {
                this.selectedComponent.screeningSubComponent[subIndex].noOfComponent = filtercomp.screeningSubComponent[subIndex].noOfComponent;
              }
            }
          } else {
            filtercomp.noOfComponent -= 1;
            if (this.selectedComponent.noOfComponent !== filtercomp.noOfComponent) {
              this.selectedComponent.noOfComponent = filtercomp.noOfComponent;
            }
          }
          if (this.screeningService.caseFlagType === this.common.NEWCASE) {
            compFormarray.removeAt(i);
            this.resetcompIndex(compFormarray, i);
            this.getComponentForm(this.selectedComponent, this.index);
          } else {
            this.screeningService.caseComponentAddedByCandidate(this.candidateAddedComponent).subscribe(res => {
              if (res) {
                if (currenAddIndex > -1 && currenAddIndex < i) {
                  compFormarray.removeAt(i + 1);
                } else {
                  compFormarray.removeAt(i);
                }
                this.resetcompIndex(compFormarray, i);
                if (this.mainForm.get('screening.scopeByPassFlag')?.value === true || this.mainForm.get('screening.ctsFlag')?.value === true ||
                  this.userdata.teamName === 'CTS-SubmissionTeam' || this.screeningService.caseFlagType === "PREQCCASE") {
                  this.getComponentForm(filtercomp, this.index);
                } else {
                  this.getComponentForm(this.selectedComponent, this.index);
                }
              }
            });
          }
        }
      }
    }
  }
  resetcompIndex(frmArray: UntypedFormArray, startIndex) {
    for (let ind = startIndex; frmArray.length > ind; ind++) {
      const indForm = frmArray.controls[ind] as UntypedFormGroup;
      indForm.get('screeningComponentInfo.compIndex')?.setValue(indForm.get('screeningComponentInfo.compIndex')?.value - 1);
    }
  }
  getcount(): number {
    const previousAdd = this.comp.filter(f => f.name.toLowerCase().substr(0, 8) === 'previous');
    if (previousAdd.length > 1) {
      const numb = previousAdd[previousAdd.length - 1].name.match(/\d/g);
      return this.comp.findIndex(i => i.name === 'previous ' + numb[0]);
    } else if (previousAdd.length === 1) {
      return 0;
    }
  }
  showNotification(severity1, summary1, message) {
    this.messageService.add({ severity: severity1, summary: summary1, detail: message });
  }
  enableTab(ctype, i): boolean {
    let invalidCount = 0;
    const formgrp = this.mainForm.get(this.formgroupName) as UntypedFormArray;
    const compList = this.screeningService.componentList;
    const index = compList.findIndex(f => f.compName === ctype);
    const filtercomp = compList.find(f => f.compName === ctype);
    if (filtercomp) {
      this.candidateAddedComponent = new CandidateAddedComponent();
      const compFormGroup = formgrp.controls[index] as UntypedFormGroup;
      const compFormarray = compFormGroup.get('component') as UntypedFormArray;
      if (compFormarray.length > 0) {
        for (let j = 0; j < i; j++) {
          const sepcompFormGroup = compFormarray.controls[j] as UntypedFormGroup;
          if (sepcompFormGroup.invalid) {
            invalidCount++;
          }

        }
        return invalidCount > 0 ? true : false;
      } else {
        return true;
      }
    }
  }
  geticonClass(component): string {
    switch (component.toUpperCase()) {
      case this.common.PAN_CARD:
        return 'icon-pancard';
      case this.common.EMPLOYMENT_UAN:
        return 'icon-employement';
      case this.common.GSA:
        return 'icon-judiscourtrecord';
      case this.common.FDA:
        return 'icon-judiscourtrecord';
      case this.common.NSR:
        return 'icon-judiscourtrecord';
      case this.common.ADDRESS:
        return 'icon-address';
      case this.common.SOCIAL_MEDIA:
        return 'icon-employement';
      case this.common.DRUG_TEST:
        return 'icon-drugtest';
      case this.common.NATIONAL_IDENTITY_CHECK:
        return 'icon-id';
      case this.common.DIRECTORSHIP:
        return 'icon-employement';
      case this.common.EMPLOYMENT_HR:
        return 'icon-employement';
      case this.common.EDUCATION:
        return 'icon-education';
      case this.common.ONLINE_CRC:
        return 'icon-onlinecrc';
      case this.common.LICENSE:
        return 'icon-license';
      case this.common.PASSPORT:
        return 'icon-passport';
      case this.common.CREDIT_VERIFICATION:
        return 'icon-creditcardverification';
      case this.common.ADDRESS_GEO:
        return 'icon-address';
      case this.common.VOTER_ID:
        return 'icon-voterid';
      case this.common.COMPANY_SITE_VISIT:
        return 'icon-companyvisit';
      case this.common.REFERENCE_CHECK:
        return 'icon-referencecheck';
      case this.common.REFERENCE_SELF_EMPLOYED:
        return 'icon-referencecheck';
      case this.common.EMPLOYMENT_SUPERVISOR:
        return 'icon-employement';
      case this.common.CRIMINAL_DATABASE:
        return 'icon-criminaldb';
      case this.common.OFAC_SDN:
        return 'icon-ofacandsdn';
      case this.common.ONLINE_CRC_INTERNAL:
        return 'icon-onlinecrc';
      case this.common.CRIMINAL_CHECK_PCC1:
        return 'icon-criminalcheck';
      case this.common.CRIMINAL_CHECK_PCC2:
        return 'icon-criminalcheck';
      case this.common.ONLINE_CRC:
        return 'icon-onlinecrc';
      case this.common.CRIMINAL_COURT_RECORD:
        return 'icon-criminalcourt';
      case this.common.CRIMINAL_CHECK_PCC3:
        return 'icon-criminalcheck';
      case this.common.CRIMINAL_CHECK_PCC3E:
        return 'icon-criminalcheck';
      case this.common.PAN_INDIA_ONLINE_COURT_RECORD_VERIFICATION:
        return 'icon-pancard';
      case this.common.EMPHR_EMPSUP:
        return 'icon-employement';
      case this.common.GAP_VERIFICATION:
        return 'icon-verification';
      case this.common.JUDIS_COURT_RECORD:
        return 'icon-judiscourtrecord';
      case this.common.EMERGENCY_CONTACT_VERIFICATION:
        return 'icon-emergencycontact';
      case this.common.CV_VALIDATION:
        return 'icon-cvvalidation';
      case this.common.BANK_STATEMENT:
        return 'icon-bankstatement';
      case this.common.SSN_TRACE:
        return 'icon-ssntrace';
      case this.common.NATIONWIDE_SEX_OFFENDER_5_YEARS:
        return 'icon-sexoffender';
      case this.common.NDOT_DRUG_SCREEN:
        return 'icon-drugScreening';
      case this.common.CRIMINAL_FEDERAL_NATIONWIDE_5_YEARS:
        return 'icon-criminalcheck';
      case this.common.CRIMINAL_FELONY_MISDEMEANOR_5_YEARS:
        return 'icon-criminalcourt';
      case this.common.OIG:
        return 'icon-judiscourtrecord';
      case this.common.FACISLevel1:
        return 'icon-judiscourtrecord';
      case this.common.FACISLevel2:
        return 'icon-judiscourtrecord';
      case this.common.FACISLevel3:
        return 'icon-judiscourtrecord';
      case this.common.FACIS1M:
        return 'icon-judiscourtrecord';
      case this.common.TENNESSEE:
        return 'icon-criminalcourt';
      case this.common.CriminalCheckGap:
        return 'icon-onlinecrc';
    }
  }
  tabChange(componentName, event) {
    this.currentCompTabIndex = event.index;
    if (event) {
      this.currentTabIndex = event.index;
    }
    this.compData = {
      isSubComp: null,
      subCompId: null,
      onInit: true,
      compName: componentName ? componentName : ''
    };
    this.emitAddnewComp.emit(this.compData);
  }
  clickchange(componentName, demo1TabIndex, event) {
    if (demo1TabIndex > 0 && this.userdata.applicationId === 3) {
      const frmGroup = this.getformGroup(componentName, demo1TabIndex - 1) as UntypedFormGroup;
      const frmGroup1 = this.getformGroup(componentName, demo1TabIndex - 2) as UntypedFormGroup;
      if (frmGroup.valid || frmGroup.disabled) {
        this.compData = {
          isSubComp: null,
          subCompId: null,
          onInit: true,
          compName: componentName ? componentName : ''
        };
        this.emitAddnewComp.emit(this.compData);
      } else {
        if (demo1TabIndex > 1) {
          this.demo1TabIndex = demo1TabIndex - 1;
          if (frmGroup1.valid || frmGroup1.disabled) {
            this.demo1TabIndex;
          }
          else {
            this.demo1TabIndex--;
          }
        }
        else {
          this.demo1TabIndex--;
        }
        this.showNotification('info', 'Information', 'Please fill Previous Component Details and move to next Component');
      }
    }
  }
  hideCompCount() {
    if (this.screeningService.caseFlagType === this.common.QCREJECT
      || this.screeningService.caseFlagType === this.common.INSUFFCLEARANCE
      || this.screeningService.caseFlagType === this.common.NEWCASE) {
      this.ishideCompCount = true;
    } else {
      this.ishideCompCount = false;
    }
  }
  setRejectedClass(comp, index): boolean {
    const formgrp = this.mainForm.get(this.formgroupName) as UntypedFormArray;
    const compForm = formgrp.controls[index] as UntypedFormGroup;
    const componentFormArray = compForm.get('component') as UntypedFormArray;
    const data = componentFormArray.getRawValue();
    return data.some(s => s.preQCRejectFlag === true);
  }
  showAddNewCompButton() {
    if (this.userdata.applicationId === 3 && this.Paymentflag === true || this.screeningService.caseFlagType === this.common.PREQCCASE) {
      this.isAddCompBtnFlag = false;
    }
    else if ((this.mainForm.get('screening.scopeByPassFlag')?.value && this.screeningService.caseFlagType !== this.common.INSUFFCLEARANCE)) {
      this.isAddCompBtnFlag = true;
    }

    else {
      this.isAddCompBtnFlag = false;
    }
  }
  changeNotapplicable(event: any) {
    const compid = event.formdata ? event.formdata.screeningComponentInfo.compId : 0;
    const objcomp = this.screeningService.componentList.find(f => f.compId === compid);
    const empForm = this.getcrinalcheckForm(objcomp.compName);
    const empFormdata = empForm.getRawValue();
    if (objcomp.subCompFlag) {
      const subcomp = objcomp.screeningSubComponent.find(f => f.subCompName === 'Previous Address');
      const indices = empFormdata.map((e, i) => i > event.index && e.screeningComponentInfo.subCompId === subcomp.subCompId ? i : '').filter(String)
      if (indices && indices.length > 0) {
        empFormdata.forEach((f, index) => {
          if (indices.includes(index)) {
            empForm.controls[index].get('screeningComponentInfo.notApplicableFlag')?.setValue(event.checked);
          }
        });
      }

    }
  }
  changeFresher(event: any) {
    const empForm = this.getcrinalcheckForm(this.common.EMPLOYMENT_HR);
    const empFormdata = empForm.getRawValue();
    if (event.checked) {
      empFormdata.forEach((f, index) => {
        if (f.screeningComponentInfo.compIndex > 1) {
          if (f.screeningComponentInfo.compIndex === 2) {
            this.openRemarksDialog('Cancel Alert', 'Remaining employment components are cancelled automatically, if you check fresher field');
          }
          empForm.controls[index].get('screeningComponentInfo.notApplicableFlag')?.setValue(true);
          // this.empHrComp.baseComp.notApplicable({checked: event.checked});
          this.notApplicableBehavior = new BehaviorSubject({ checked: event.checked });
          this.notApplicableBehavior.next({ checked: event.checked });
          empForm.controls[index].get('screeningComponentInfo.notApplicableFlag')?.disable();
          empForm.controls[index].get('screeningComponentInfo.remark')?.setValue('Current employment is a fresher');
        }
      });
    } else {
      empFormdata.forEach((f, index) => {
        if (f.screeningComponentInfo.compIndex > 1) {
          empForm.controls[index].get('screeningComponentInfo.notApplicableFlag')?.setValue(false);
          // this.empHrComp.baseComp.notApplicable({checked: event.checked});
          this.notApplicableBehavior = new BehaviorSubject({ checked: event.checked });
          this.notApplicableBehavior.next({ checked: event.checked });
          empForm.controls[index].get('screeningComponentInfo.notApplicableFlag')?.enable();
          empForm.controls[index].get('screeningComponentInfo.remark')?.setValue('');
        }
      });
    }
  }

  getShowNotapplicable(type, index): boolean {
    const compo = this.getcrinalcheckForm(type);
    const data = compo.getRawValue();
    const cancel = data.filter(s => s.screeningComponentInfo.notApplicableFlag === false);
    const specdata = data[index].screeningComponentInfo.notApplicableFlag;
    if (data && data.length > 1) {
      let cnt = 0;
      for (let vars = 0; vars < data.length; vars++) {
        if (index !== vars) {
          const specdata1 = data[vars].screeningComponentInfo.notApplicableFlag;
          if (specdata1) {
            cnt++;
          }
        }
      }
      if (cnt === (data.length - 1)) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
  public openRemarksDialog(headerText, bodyText) {
    const popupData = {
      action: this.common.ALERT,
      headerText: headerText,
      bodyText: bodyText
    };
    const dialogRef = this.dialog.open(CommonAlertsComponent, {
      width: '320px',
      data: popupData,
      disableClose: true
    });
  }

  getData(event: any) {
    const data = JSON.parse(JSON.stringify(this.mainForm.getRawValue()));
    if (this.userdata.applicationId === 3) {
      this.screeningService.componentList.forEach((element, index) => {
        if (element.subCompFlag) {
          const subcomp = element.screeningSubComponent.find(f => f.subCompName === 'Permanent Address');
          if (subcomp) {
            const compIndex = data.screeningComponent.findIndex(i => i.compId === subcomp.compId);
            const subCombIndex = data.screeningComponent[compIndex].component
              .findIndex(fi => fi.screeningComponentInfo.subCompId === subcomp.subCompId);
            const address = data.screeningComponent[compIndex].component[subCombIndex].compRef
            this.perAddress = true
            if (this.perAddress === true) {
              this.peraddressObj = address
            }
            else {
              this.addressList = data.screeningComponent
            }
          }
        }
        this.addressList = data.screeningComponent
      });
    }
  }

}
