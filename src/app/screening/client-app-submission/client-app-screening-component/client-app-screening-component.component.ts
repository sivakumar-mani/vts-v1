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
import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';
import { MasterService } from 'src/app/common-methods/services/master.service';
export class SubComp {
  comindex: number;
  name: string;
}

@Component({
  standalone: false,
  selector: 'app-client-app-screening-component',
  templateUrl: './client-app-screening-component.component.html',
  styleUrls: ['./client-app-screening-component.component.css']
})
export class ClientAppScreeningComponentComponent implements OnInit {
  fresherFlag = false;
  notApplicableFlag = false
  btnRemove = false;
  componentName = '';
  noofComponent = 0;
  demo1TabIndex = 0;
  screeningCompid = 0;
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
  @Output() emitgetGapComp = new EventEmitter<any>();
  @Output() emitAddnewComp = new EventEmitter<any>();
  @Output() emitgetComp = new EventEmitter<any>();
  @Output() emitCompId = new EventEmitter<any>();
  @Output() emitLastComp = new EventEmitter<any>();
  @Input() cusAddress: any
  @Input() Paymentflag: any
  @Output() emitAddNewCV = new EventEmitter<any>();
  @ViewChild('rejectedComments', { static: true }) rejectedComments: TemplateRef<any>;
  clientVendorsControl!: AutoCompleteDropDown;
  vendorList: any[] = [];
  screeningPriority: any[] = [];
  screeningStatus: any[] = [];
  selectedComponent: any;
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
  perAddress = false;
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
  allEduList: [];
  allEmpList: any[] = [];
  commonAlert: string;
  constructor(public master: MasterService, public screeningService: ScreeningService, public dialog: MatDialog, private el: ElementRef,
    public common: CommonService, public fb: UntypedFormBuilder, private messageService: MessageService) { }
  ngOnInit() {
    this.userdata = JSON.parse(sessionStorage.getItem('user_data') as string);
    if (this.gettotal(this.screeningService.componentList[0]) > 0) {
      this.getComponentForm(this.screeningService.componentList[0], 0);
    }
    this.buttonHidden();
    this.hideCompCount();
    this.showAddNewCompButton();
    //this.insuffHidden();


    this.screeningService.notApplicableSub.subscribe(res => {
      if (res) {
        this.changeNotapplicable(res);
      }
    });
  }

  screeningComponentStatusDetails(compId: any) {
    if (this.screeningService.caseFlagType === this.common.NEWCASE && this.common.manualClientDetails) {
      this.common.manualClientDetails.component = this.screeningService.componentList.filter(x => x.compId === compId);
    }
    //For VTS2-2023-CRT-0131 - split emp -By Megala
    if ((this.componentName !== this.common.EMPLOYMENT_HR && this.componentName !== this.common.CURRENT_EMPLOYMENT_HR &&
      this.componentName !== this.common.PREVIOUS_EMPLOYMENT_HR &&
      this.componentName.toUpperCase() !== this.common.CRIMINAL_CHECK_PCC3E &&
      this.componentName.toUpperCase() !== this.common.CRIMINAL_CHECK_PCC1 &&
      this.componentName.toUpperCase() !== this.common.CRIMINAL_CHECK_PCC2 &&
      this.componentName.toUpperCase() !== this.common.ONLINE_CRC &&
      this.componentName.toUpperCase() !== this.common.ONLINE_CRC_INTERNAL &&
      this.componentName.toUpperCase() !== this.common.CRIMINAL_COURT_RECORD &&
      this.componentName !== this.common.ADDRESS && this.screeningService.caseFlag == true
      && this.componentName !== this.common.DRUG_TEST && this.componentName !== this.common.EDUCATION &&
      this.componentName !== this.common.CRIMINAL_DATABASE && this.componentName !== this.common.DATABASE_CONDUCT
      && this.componentName !== this.common.DATABASE_ADVERSE_MEDIA )
      || this.screeningService.caseFlag != true) {
      if (this.common.statuscFlag == true) {
        this.screeningService.screeningComponentStatusDetails(compId, this.userdata.deptId ? this.userdata.deptId : 0, this.userdata.applicationId).subscribe(res => {
          if (res) {
            this.emitCompId.emit(compId);
            this.compBaseDetails = res;
            this.compBaseDetails.screeningStatus = this.screeningService.screeningDetail.screeningStatus
            this.compBaseDetails.vendor = this.screeningService.screeningDetail.vendor
            this.compBaseDetails.dEScreeningStatus = this.screeningService.screeningDetail.dEScreeningStatus
            this.compBaseDetails.deScreeningStatus = this.screeningService.screeningDetail.deScreeningStatus
            this.compBaseDetails.currency = this.screeningService.screeningDetail.currency
            this.compBaseDetails.screeningPriority = this.screeningService.screeningDetail.screeningPriority
            this.screeningService.baseDetail = this.compBaseDetails;
            if (this.componentName === this.common.COMPANY_SITE_VISIT) {
              this.screeningService.companyList = Object.assign([], this.compBaseDetails.company);
            }
            if (this.componentName === this.common.EMPLOYMENT_SUPERVISOR ||
              this.componentName === this.common.EMPHR_EMPSUP ||
              this.componentName === this.common.REFERENCE_SELF_EMPLOYED) {
              this.screeningService.employerSupList = Object.assign([], this.compBaseDetails.professionalReference);
            }
            if (this.componentName.toUpperCase() === this.common.REFERENCE_CHECK) {
              this.screeningService.profNameList = Object.assign([], this.compBaseDetails.professionalName);
            }
            if (this.componentName.toUpperCase() === this.common.GAP_VERIFICATION) {
              this.screeningService.gapVerificationTypeList = Object.assign([], this.compBaseDetails.gapVerificationType);
            }
            if (this.componentName.toUpperCase() === this.common.LICENSE) {
              this.screeningService.issuingAuthorityList = Object.assign([], this.compBaseDetails.issuingAuthorityName);
            }
            if (
              this.componentName.toUpperCase() === this.common.CRIMINAL_DATABASE
              || this.componentName.toUpperCase() === this.common.DATABASE_CONDUCT
              || this.componentName === this.common.DATABASE_ADVERSE_MEDIA
              || this.componentName.toUpperCase() === this.common.OFAC_SDN
              || this.componentName.toUpperCase() === this.common.ONLINE_CRC
              || this.componentName.toUpperCase() === this.common.ONLINE_CRC_INTERNAL
              || this.componentName.toUpperCase() === this.common.CRIMINAL_COURT_RECORD
              || this.componentName.toUpperCase() === this.common.CriminalCheckGap) {
              this.screeningService.addressType = Object.assign([], this.compBaseDetails.addressType);
            }
            if (this.componentName.toUpperCase() === this.common.CRIMINAL_CHECK_PCC3
              || this.componentName.toUpperCase() === this.common.CRIMINAL_CHECK_PCC3E
            ) {
              this.screeningService.addressTypeCheck = Object.assign([], this.compBaseDetails.addressTypeCheck);
            }

          }
        });
      }
    } else {
      this.compBaseDetails = this.screeningService.screeningDetail;
      if (this.compBaseDetails != undefined) {
        this.compBaseDetails.addressType = this.screeningService.addressType;
        this.compBaseDetails.addressTypeCheck = this.screeningService.addressTypelst;
      }
    }

  }
  GetInstitutioInfo() {
    if (this.componentName.toUpperCase() === this.common.EDUCATION||this.componentName.toUpperCase() === this.common.EDUCATION_INTERNATIONAL) {
      const values = this.getPaginationValues();
      this.screeningService.GetInstitutioInfo(values).subscribe(resp => {
        if (resp) {
          this.screeningService.institutionList = Object.assign([], resp);
        }

      });
    }
  }
  GetInstituteInfo() {
    if (this.componentName.toUpperCase() === this.common.EDUCATION||this.componentName.toUpperCase() === this.common.EDUCATION_INTERNATIONAL) {
      const values = this.getPaginationValues();
      this.screeningService.GetInstituteInfo(values).subscribe(resp => {
        if (resp) {
          this.screeningService.instituteList = Object.assign([], resp);
          this.compBaseDetails.institute = Object.assign([], resp);
          this.screeningService.instituteList = Object.assign([], this.compBaseDetails.institute);
          this.screeningService.instituteList = this.screeningService.instituteList.concat(this.screeningService.newCollegeList);
        }

      });
    }
  }
  GetCompanyInfo() {
    if (this.componentName.toUpperCase() === this.common.EMPLOYMENT_HR || this.componentName.toUpperCase() === this.common.CURRENT_EMPLOYMENT_HR || this.componentName.toUpperCase() === this.common.PREVIOUS_EMPLOYMENT_HR) {  
      const values = this.getPaginationValues();
      this.screeningService.GetCompanyInfo(values).subscribe(resp => {
        if (resp) {
          this.screeningService.employerList = Object.assign([], resp);

        }
      });
    }
  }
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
      pageSize: 150,
      page: 1,
      filters: '',
      sorts: '-empInsId',
      applyPaging: false,
      needTotal: true,
      empInsId: 0,
      department: this.userdata.deptName,
techmFlag: this.screeningService.ClientCategoryId == 4 ? true : false,
       clientCategoryId: this.screeningService.ClientCategoryId
    };
  }
  // getInsuffDoc(compId: any) {
  //   this.screeningService.getInsuffDocument(compId).subscribe(resp => {
  //     this.insuffDocArr = this.common.CloneObject(resp);
  //     this.screeningService.insuffDocList = Object.assign([], resp);
  //   });
  // }
  insuffHidden() {
    this.showInsuff = !(this.userdata.applicationId === 1 && (this.screeningService.caseFlagType !== this.common.NEWCASE)
      && !(this.mainForm.value.screeningComponent[0].component &&
        this.mainForm.value.screeningComponent[0].component[0].screeningComponentInfo.clientScreeningId
        && this.screeningService.caseFlagType === this.common.QCREJECT));
  }

  getAddressData() {
    const data = JSON.parse(JSON.stringify(this.mainForm.getRawValue()));
    if (this.userdata.applicationId === 3) {
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
    this.common.statuscFlag == true;
    this.componentName = data.compName.toUpperCase();
    this.common.componentName = data.compName.toUpperCase();
    this.common.isAdditionalPos = data.isAdditionalPos;
    this.screeningService.compData = data;
    this.screeningComponentStatusDetails(data.compId);
    this.selectedComponent = [];
    this.selectedComponent = data;
    this.currentTabIndex = 0;
    this.tabIndex = 0;
    this.isAddNewComp = false;
    this.prevIndex = index;
    this.getAddressData();
    let temp: any[] = [];
    this.comp = [];
    this.screeningService.componentList.filter(e => {
      if (e.compId === data.compId) {
        e.active = true
      } else {
        e.active = false
      }
    })
    this.index = index;
    let count = 0;

    this.screeningService.compFormArray = this.mainForm.get(this.formgroupName) as UntypedFormArray;
    const data2 = {
      isSubComp: data.subCompFlag,
      comptype: 'Individual',
      compId: data.compId,
      compName: data.compName.toUpperCase()
    };
    if (data.compName == "GAP REASON") {
      this.emitgetGapComp.emit(data2);
    } else {
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

        this.noofComponent = temp.reduce((a, b) => b.noOfComponent + a, 0);
        this.compData.compName = data.compName
      } else {
        this.comp = [];
        count = 0;
        for (let k = 0; k < this.selectedComponent.noOfComponent; k++) {
          this.objcomp = new SubComp();
          this.objcomp.comindex = count;
          if (this.selectedComponent.noOfComponent === 1 || k === 0) {
            if (this.selectedComponent.compName.toUpperCase() === this.common.EDUCATION || this.selectedComponent.compName.toUpperCase() === this.common.EDUCATION_INTERNATIONAL) {
              this.objcomp.name = 'HIGHEST EDUCATION';
            } else if (this.selectedComponent.compName.toUpperCase() === this.common.EMPLOYMENT_HR || this.selectedComponent.compName.toUpperCase() === this.common.EMPLOYMENT_INTERNATIONAL) {
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
    }
    this.common.statuscFlag = true;
    this.currentCompTabIndex = 0;
    if (data2.compId > 0) {
      this.emitgetComp.emit(data2);

    }
  }
  getspecForm(type, i = 0) {
    if (this.screeningService.getdataFlag == true) {
      this.screeningService.componentList.map(x => x.compName = x.compName.toUpperCase());
      const formgrp = this.mainForm.get(this.formgroupName) as UntypedFormArray;
      const compList = this.screeningService.componentList;
      const index = compList.findIndex(f => f.compName === type);
      const filtercomp = compList.find(f => f.compName === type);


      if (filtercomp) {
        const compFormGroup = formgrp.controls[0] as UntypedFormGroup;
        if (compFormGroup != undefined) {
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
    }
  }
  getcrinalcheckForm(type): UntypedFormArray {
    this.screeningService.componentList.map(x => x.compName = x.compName.toUpperCase());
    const formgrp = this.mainForm.get(this.formgroupName) as UntypedFormArray;
    const compList = this.screeningService.componentList;
    const index = compList.findIndex(f => f.compName === type);
    const filtercomp = compList.find(f => f.compName === type);
    if (filtercomp) {
      const compFormGroup = formgrp.controls[0] as UntypedFormGroup;
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
    if (this.screeningService.getdataFlag == true) {
      this.screeningService.componentList.map(x => x.compName = x.compName.toUpperCase());
      const formgrp = this.mainForm.get(this.formgroupName) as UntypedFormArray;
      const compList = this.screeningService.componentList;

      const index = compList.findIndex(f => f.compName === type);
      const filtercomp = compList.find(f => f.compName === type);
      const lastIndex = this.screeningService.componentList ? this.screeningService.componentList.length - 1 : -1;
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
        const compFormGroup = formgrp.controls[0] as UntypedFormGroup;
        if (compFormGroup != undefined) {
          const compFormarray = compFormGroup.get('component') as UntypedFormArray;

          const spectFormGroup = compFormarray.controls[i] as UntypedFormGroup;
          this.common.fileSubmissionCom = spectFormGroup;
          if (spectFormGroup) {
            const data = spectFormGroup.getRawValue();
            if (isClass) {
              if (spectFormGroup.valid) {
                if (!spectFormGroup.disabled && !data.active) {
                  spectFormGroup.get('active')?.setValue(true);
                }
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
                }
                if (elements.length > 0 && elements) {
                  if (elements[i]) {
                    elements[i].classList.remove('mat-tab-label-completed');
                    elements[i].classList.add('mat-tab-label-active');
                  }
                }
              }

            } else {
              this.compStatus = this.screeningService.caseFlagType === this.common.REOPEN ? 'RE-OPEN' : (this.screeningService.caseFlagType === this.common.QCREJECT || data.preQCRejectFlag
                || (this.mainForm.get('verificationRejectFlag')?.value) || data.screeningComponentInfo.verificationRejectFlag || this.screeningService.caseFlagType === this.common.FRREJECT) ? 'REJECTED'
                : (data.preQCApproveFlag && data.submittedFlag && this.screeningService.caseFlagType !== this.common.INSUFFCLEARANCE) ? 'APPROVED' : data.submittedFlag ? 'SUBMITTED' : (data.screeningComponentInfo.screeningCompId > 0 &&
                  data.screeningComponentInfo.notApplicableFlag === true && this.screeningService.caseFlagType !== this.common.INSUFFCLEARANCE) ? 'CANCEL' : 'OPEN';

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
                      } else if (data.preQCApproveFlag || data.submittedFlag) {
                        this.fileBtnFlag = true;
                        this.disablesubmitebtn = true;
                      } else if (data.preQCRejectFlag || this.screeningService.caseFlagType === this.common.INSUFFCLEARANCE) {
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
                  if (data.preQCApproveFlag || data.preQCRejectFlag) {
                    this.fileBtnFlag = true;
                  } else if (data.submittedFlag && !spectFormGroup.disabled) {
                    this.fileBtnFlag = false;
                  } else if (!data.submittedFlag) {
                    if (this.mainForm.get('invitationFlag')?.value == true && data.submittedFlag != true && data.preQCApproveFlag != true && (this.screeningService.caseFlagType === this.common.PREQCCASE || this.screeningService.caseFlagType === this.common.DASUBCHECK)) {
                      this.fileBtnFlag = false;
                      this.disablesubmitebtn = false;
                    }
                    else {
                      if (spectFormGroup.controls.compRef.disabled) {
                        this.fileBtnFlag = true;
                        this.disablesubmitebtn = false;
                      } else {
                        this.fileBtnFlag = false;
                      }
                    }
                  } else {
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

            }
          }

          return spectFormGroup;
        }
      }
    }
  }
  gettotal(data): number {
    if (data != undefined) {
      return data.subCompFlag ? data.screeningSubComponent.reduce((a, b) => b.noOfComponent + a, 0) : data.noOfComponent;
    }

  }

  getValidorNot(index, data): boolean {


    if (data.compName === "GAP REASON") {
      this.emitLastComp.emit('last');
    }
    if (data.compName.toUpperCase() !== "GAP REASON") {
      if (this.selectedComponent != undefined) {
        if (data.compId == this.selectedComponent.compId) {
          if ((this.screeningService.fresherFlag == true && data.compId == this.common.EMPLOYMENT_HRId)||(this.screeningService.fresherFlag == true && data.compId == this.common.CURRENT_EMPLOYMENT_HRId)) {
            this.common.fileSubmissionCom = this.mainForm;
            const formgrp = this.mainForm.get(this.formgroupName) as UntypedFormArray;
            const compForm = formgrp.controls[0] as UntypedFormGroup;
            const singleComp = compForm.controls.component as UntypedFormArray;
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
          if (this.mainForm.get(this.formgroupName).valid) {
            return true;
          } else {
            return false;
          }
        } else {
          const SubData = this.screeningService.submiscomponentList;
          const noOfComp = data.subCompFlag ? data.screeningSubComponent.reduce((a, b) => b.noOfComponent + a, 0) : data.noOfComponent;
          if (data.subCompFlag == true) {
            const sData = SubData.filter(w => w.compId == data.compId)
            if (noOfComp == sData.length) {
              return true;
            } else {
              return false;
            }

          } else if (data.subCompFlag != true) {
            const sData = SubData.filter(w => w.compId == data.compId)
            if (noOfComp == sData.length) {
              return true;
            } else {
              return false;
            }
          }
        }
      }
    } else if (data.compName.toUpperCase() === "GAP REASON") {

      if (data.compName.toUpperCase() === this.selectedComponent.compName) {
        const Gdata = this.mainForm.get('gapReason')?.value;
        if (Gdata.length > 0 && this.mainForm.get('gapReason')?.valid) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }


    }

  }

  getdata(i: any) {
    return this.address;
  }

  submitComp(type, index) {
    const frmGroup = this.getformGroup(type, index) as UntypedFormGroup;
    this.common.statuscFlag = false;
    this.notApplicableFlag = frmGroup.get('screeningComponentInfo.notApplicableFlag')?.value;
    if (type === this.common.CRIMINAL_SEARCH_OVERSEAS) {
      let isCanadaOrUk = frmGroup.get('compRef.address')?.get('countryId')?.value
        && (frmGroup.get('compRef.address')?.get('countryId')?.value == 35 || frmGroup.get('compRef.address')?.get('countryId')?.value == 227) ? true : false;
      if (isCanadaOrUk) {
        let array = frmGroup.get('screeningComponentInfo.componentDocument')?.value;
        let dynamicName1;
        if (frmGroup.get('compRef.address')?.get('countryId')?.value == 35) {
          dynamicName1 = "Screening Application Form";
        } else {
          dynamicName1 = "Consent Form";
        }
        const doesNotIncludeDynamicName1 = array.some(e => !e.fileName.includes(dynamicName1));
        const includesOtherValue = array.some((element) => element.fileName.includes(dynamicName1));
        if (frmGroup.get('compRef.documentTypeLookupId')?.value != 0 && (!doesNotIncludeDynamicName1 || !includesOtherValue)) {
          this.showNotification('warn', 'Information', doesNotIncludeDynamicName1 ? 'Please Upload the Released Form Document'
            : 'Please Upload Supporting Document');
          return;
        } else if (frmGroup.get('compRef.documentTypeLookupId')?.value == 0 && (!includesOtherValue)) {
          this.showNotification('warn', 'Information', 'Please Upload the Released Form Document');
          return;
        }
      }
    }
    if (type == "SSN TRACE" || type == "NATIONWIDE SEX OFFENDER" ||
      type == "NATIONWIDE SEX OFFENDER 5 YEARS"
      || type == "CRIMINAL SEARCH STATEWIDE 10 YEARS" || type == 'CRIMINAL - FEDERAL NATIONWIDE 10 YEARS'
      || type == 'FEDERAL DISTRICT SEARCH 10 YEARS' || type == 'CRIMINAL - FELONY & MISDEMEANOR 10 YEARS'
      || type == 'NATIONAL CRIMINAL DATABASE SEARCH 10 YEARS' || type == 'NATIONAL CRIMINAL LOCATOR' || type == 'CREDIT - OVERSEAS' || type == 'MVR') {
      if (frmGroup.get('screeningComponentInfo.componentDocument')?.value.length == 0) {
        this.showNotification('warn', 'Information', 'Please Upload Supporting Document');
        return;
      }
    }
    if (frmGroup.valid) {
      const sendToQC = this.screeningService.caseFlagType === this.common.QCREJECT ? true : false;
      this.emitSubmitComp.emit({ formValue: frmGroup.getRawValue(), compName: type, sendToQC, commonSaveclick: true });
    } else {
      Object.keys(frmGroup.controls).forEach(key => {
        const control = frmGroup.get(key);
        if (control && control.valid) {
        } else if (control && control.invalid) {
          control.markAllAsTouched();
          control.updateValueAndValidity();
        }
      });
      if (type.toLowerCase() === this.common.EMPLOYMENT_HR.toLowerCase()) {
        this.fresherFlag = frmGroup.get('compRef.fresherFlag')?.value;
      }
      if (type === this.common.EDUCATION||type === this.common.EDUCATION_INTERNATIONAL) {
        const educationForm = frmGroup.get('compRef.institutionName') as UntypedFormControl;
        if (!educationForm.valid) {
          educationForm.markAllAsTouched();
          educationForm.updateValueAndValidity();
        }
      }
      if (this.userdata.applicationId === 3 && this.notApplicableFlag != true && type && type !== 'Gap Reason' &&
        type !== 'Database' && type !== 'Address' && type !== 'Drug Test'
        && type !== 'Emergency Contact Verification' && type !== 'Employment (Supervisor)' &&
        type !== 'Gap Verification' && this.fresherFlag === false && type !== 'Reference Check' &&
        type !== 'Gap Check' && type !== "SSN TRACE" && type !== "NATIONWIDE SEX OFFENDER" &&
        type !== "NATIONWIDE SEX OFFENDER 5 YEARS"
        && type !== "CRIMINAL SEARCH STATEWIDE 10 YEARS" && type !== 'CRIMINAL - FEDERAL NATIONWIDE 10 YEARS'
        && type !== 'FEDERAL DISTRICT SEARCH 10 YEARS' && type !== 'CRIMINAL - FELONY & MISDEMEANOR 10 YEARS'
        && type !== 'NATIONAL CRIMINAL DATABASE SEARCH 10 YEARS' && type !== 'NATIONAL CRIMINAL LOCATOR'
        && type !== 'CRIMINAL SEARCH - OVERSEAS' && type !== 'CREDIT - OVERSEAS' && type !== 'MVR') {
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
  checkRejectedComments(type, index): any {
    const frmGroup = this.getspecForm(type, index);
    const preqcvalue = frmGroup.get('rejectComments')?.value ? frmGroup.get('rejectComments')?.value : '';
    const qcvalue = frmGroup.get('qcRejectComments')?.value ? frmGroup.get('qcRejectComments')?.value : '';
    let data: any[] = [];
    if (this.screeningService.caseFlagType !== this.common.VEREJECT && this.screeningService.caseFlagType !== this.common.FRREJECT) {        
      if (preqcvalue != '') {
        data.push(preqcvalue);        
      }
      if (qcvalue != ''){
        data.push(qcvalue);
      }
      data.filter(x => x !== '');
    }
    return data;
  }

  getRejectedComments(type, index) {
    const frmGroup = this.getspecForm(type, index);
    const preqcvalue = frmGroup.get('rejectComments')?.value;
    const qcvalue = frmGroup.get('qcRejectComments')?.value;
    if (this.screeningService.caseFlagType !== this.common.VEREJECT && this.screeningService.caseFlagType !== this.common.FRREJECT) {
      let data: any[] = [];
      data = preqcvalue.concat(qcvalue);
      this.rejectedCommentsList = data.filter(x => x !== null);
    }
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
    // if ((this.screeningService.caseFlag === false && this.screeningService.caseFlagType === this.common.PREQCCASE)) {
    if (((this.screeningService.caseFlag === false && this.screeningService.caseFlagType === this.common.PREQCCASE) || (this.screeningService.caseFlagType === this.common.DASUBCHECK))) {
      this.btnApprove = true;
      if (this.mainForm.get('invitationFlag')?.value) {
        this.btnRemove = true;
      }
      else {
        this.btnRemove = false;
      }
      this.btnreject = !this.mainForm.get('invitationFlag')?.value;
    }
    if (this.screeningService.caseFlagType === this.common.QCREJECT) {
      this.btnApprove = true;
      this.btnRemove = false;
    }
    if (this.mainForm.value.screening.ctsFlag === true && this.screeningService.caseFlagType !== this.common.QCREJECT && this.userdata.teamName === 'CTS-SubmissionTeam' &&
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
      const compFormGroup = formgrp.controls[0] as UntypedFormGroup;
      const compFormarray = compFormGroup.get('component') as UntypedFormArray;
      const cureentAddobj = filtercomp.subCompFlag ? filtercomp.screeningSubComponent.find(f => f.subCompName === 'Current Address') : null;
      let spectFormValue: any;
      if (cureentAddobj) {
        const FormValue = compFormarray.getRawValue().filter(f => f.screeningComponentInfo.subCompId !== cureentAddobj.subCompId);
        currenAddIndex = compFormarray.getRawValue().findIndex(f => f.screeningComponentInfo.subCompId === cureentAddobj.subCompId);
        //spectFormValue = FormValue[i];
        this.index = i + 1;
        spectFormValue = compFormarray.controls[i].value;
      } else {
        spectFormValue = compFormarray.controls[i].value;
      }
      this.candidateAddedComponent.compId = filtercomp.compId;
      this.candidateAddedComponent.userId = this.userdata.userId;
      this.candidateAddedComponent.subCompFlag = filtercomp.subCompFlag;
      this.candidateAddedComponent.subCompId = 0;
      this.candidateAddedComponent.type = action;
      this.candidateAddedComponent.screeningCompId = spectFormValue.screeningComponentInfo.screeningCompId;
      this.candidateAddedComponent.caseNo = this.screeningService.screenCaseId;
      if (this.candidateAddedComponent.screeningCompId == undefined) {
        const component = this.common.CloneObject(this.screeningService.caseSubmissionList.screeningComponent[0].component);
        const screeningCompId = component[i].screeningComponentInfo.screeningCompId;
        this.candidateAddedComponent.screeningCompId = screeningCompId;

      }
      if (filtercomp.subCompFlag) {
        subIndex = filtercomp.screeningSubComponent.filter(fl => fl.subCompName !== 'Current Address').findIndex(f =>
          f.subCompId === spectFormValue.screeningComponentInfo.subCompId);
        if (subIndex > -1) {
          subcompname = filtercomp.screeningSubComponent.find(f => f.subCompId === spectFormValue.screeningComponentInfo.subCompId).subCompName;
        }
      }
      this.isAddNewComp = true;
      if (action === 'add') {
        if (compFormarray.valid || compFormarray.disabled) {
          if (filtercomp.subCompFlag) {
            const subIndex = filtercomp.screeningSubComponent.findIndex(f =>
              f.subCompId === spectFormValue.screeningComponentInfo.subCompId);
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
            this.getComponentForm(this.selectedComponent, this.index);
          } else {
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
        //For VTS2-2023-CRT-0131 - split emp -By Megala
      case this.common.CURRENT_EMPLOYMENT_HR:
      case this.common.PREVIOUS_EMPLOYMENT_HR:
      case this.common.EMPLOYMENT_HR:
      case this.common.EMPLOYMENT_INTERNATIONAL:
        return 'icon-employement';
      case this.common.EDUCATION:
        return 'icon-education';
      case this.common.EDUCATION_INTERNATIONAL:
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
      case this.common.DATABASE_CONDUCT:
      case this.common.DATABASE_ADVERSE_MEDIA:  
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
      case this.common.NATIONWIDE_SEX_OFFENDER:
        return 'icon-sexoffender';
      case this.common.NDOT_DRUG_SCREEN:
        return 'icon-drugScreening';
      case this.common.CRIMINAL_FEDERAL_NATIONWIDE_5_YEARS:
      case this.common.CRIMINAL_FEDERAL_NATIONWIDE_10_YEARS:
        return 'icon-criminalcheck';
      case this.common.CRIMINAL_FELONY_MISDEMEANOR_5_YEARS:
      case this.common.CRIMINAL_FELONY_MISDEMEANOR_10_YEARS:
        return 'icon-criminalcourt';
      case this.common.OIG:
        return 'icon-judiscourtrecord';
      case this.common.MHCP:
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
      case this.common.CRIMINAL_SEARCH_STATEWIDE_10_YEARS:
        return 'icon-clientsearch';
      case this.common.CREDIT_OVERSEAS:
        return 'icon-Credit-overseas';
      case this.common.CRIMINAL_SEARCH_OVERSEAS:
        return 'icon-criminal-search-overseas';
      case this.common.FEDERAL_DISTRICT_SEARCH_10_YEARS:
        return 'icon-federal-district-search';
      case this.common.MVR:
        return 'icon-motor-vehicle-record';
      case this.common.NATIONAL_CRIMINAL_DATABASE_SEARCH_10_YEARS:
        return 'icon-national-criminal-database';
      case this.common.NATIONAL_CRIMINAL_LOCATOR:
        return 'icon-national-criminal-locator';
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
      if (frmGroup.valid || frmGroup.disabled) {
        this.compData = {
          isSubComp: null,
          subCompId: null,
          onInit: true,
          compName: componentName ? componentName : ''
        };
        this.emitAddnewComp.emit(this.compData);
      } else {
        this.demo1TabIndex = demo1TabIndex - 1;
        this.demo1TabIndex--;
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
    const compList = this.screeningService.submiscomponentList.filter((c) => c.compId === comp.compId && c.preQCRejectFlag == true);

    return compList.length > 0 ? compList.some(s => s.preQCRejectFlag === true) : false;;
  }

  getPreQcOrNot(comp, i): boolean {
    const compList = this.screeningService.submiscomponentList.filter((c) => c.compId == comp.compId);
    return compList.length > 0 ? compList.some(s => (this.screeningService.invitationFlag ? (s.preQCApproveFlag !== true && s.notApplicableFlag !== true) : (s.deQcFlag === true || s.insuffRaisedFlag === true) && s.notApplicableFlag !== true && s.preQCApproveFlag !== true)) : false
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
        if (event.checked) {
          empFormdata.forEach((f, index) => {
            if (indices.includes(index)) {
              if (empForm.controls[index].get('screeningComponentInfo.notApplicableFlag')?.value != true) {
                empForm.controls[index].get('screeningComponentInfo.notApplicableFlag')?.setValue(event.checked);
              } else {
                empForm.controls[index].get('screeningComponentInfo.notApplicableFlag')?.setValue(false);
              }
            }
          });
          this.compData = {
            isSubComp: null,
            subCompId: null,
            onInit: true,
            compName: this.componentName ? this.componentName : "",
          };
          this.emitAddnewComp.emit(this.compData);

        } else {
          empFormdata.forEach((f, index) => {
            if (f.screeningComponentInfo.compIndex > 1) {
              empForm.controls[index].get('screeningComponentInfo.notApplicableFlag')?.setValue(false);
              this.notApplicableBehavior = new BehaviorSubject({ checked: event.checked });
              this.notApplicableBehavior.next({ checked: event.checked });
              empForm.controls[index].get('screeningComponentInfo.notApplicableFlag')?.enable();
              empForm.controls[index].get('screeningComponentInfo.remark')?.setValue('');
            }
          });
          this.compData = {
            isSubComp: null,
            subCompId: null,
            onInit: true,
            compName: this.componentName ? this.componentName : "",
          };
          this.emitAddnewComp.emit(this.compData);
        }

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
            const address = data.screeningComponent[compIndex].component[subCombIndex].compRef;
            this.perAddress = true;
            if (this.perAddress === true) {
              this.peraddressObj = address;
            } else {
              this.addressList = data.screeningComponent;
            }
          }
        }
        this.addressList = data.screeningComponent;
      });
    }
  }

}
