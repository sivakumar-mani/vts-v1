import { Component, OnInit, ViewChild, Input, } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { UserData } from 'src/app/common-methods/models/user';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
// import { MatMenuTrigge } from '@angular/material/dialog';
import { QualityCheckService } from 'src/app/common-methods/services/quality-check.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { VerificationService } from 'src/app/common-methods/services/verification.service';

import { A11yModule } from '@angular/cdk/a11y';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatMenuTrigger } from '@angular/material/menu';

export class AssignOwner {
  assignScreeningCompId: any[] = [];
  screeningOwnerId: number;
  loginUserDetVm: UserData;
  qcCompTransId: any[] = [];
  finalQcTransId: any[] = [];
  assignQcUserId: number;
  loggedIn: number;
  loginName: string;
  screeningOwnerName: string;
}
@Component({
  standalone: false,
  selector: 'app-qualitycheck-list',
  templateUrl: './qualitycheck-list.component.html',
  styleUrls: ['./qualitycheck-list.component.css'],
  providers: [DatePipe]
})
export class QualitycheckListComponent implements OnInit {
  @Input() filterLength: number;
  SearchCriFilter = false;
  qcSearchForm: UntypedFormGroup;
  selectall = new UntypedFormControl();
  screeningOwner = new UntypedFormControl('', Validators.required);
  userData: UserData;
  screenAuth: any = {};
  qcDetails: any;
  dialogRef: any;
  screeningOwnerName: string;
  filterOwnerName = new UntypedFormControl();
  @ViewChild('assignPopUp', { static: true }) assignPopUp!: any;;
  @ViewChild('verificationIdTrigger', { static: true }) 
verificationIdTrigger!: MatMenuTrigger;
  clientList: any;
  componentList: any;
  userList: any;
  componentControl!: AutoCompleteDropDown;
  clientNameControl!: AutoCompleteDropDown;
  userControl!: AutoCompleteDropDown;
  delayHoursControl!: AutoCompleteDropDown;
  verificationControl!: AutoCompleteDropDown;
  candidateControl!: AutoCompleteDropDown;
  clientRefControl!: AutoCompleteDropDown;
  caseRefNoControl!: AutoCompleteDropDown;
  assignedList: any;
  unAssignedList: any;
  assiginownerList: AssignOwner = new AssignOwner();
  verificationIdList: any;
  clientReferenceIdList: any;
  candidateList: any;
  showdSearch = true;
  // tslint:disable-next-line:variable-name
  assignControl = new UntypedFormControl('Not Assigned');
  qcOrFqc = new UntypedFormControl('QC');
  qualityCheckDetails: any;
  qualityCheckList: any[] = [];
  pageSize = 10;
  currentPage = 0;
  totalSize = 0;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  qualityCheckBindList: any;
  isDesc: boolean;
  column: any;
  direction: number;
  searchValueArr: any[] = [];
  itemPerPage;
  page = 1;
  shieveTotalCount = 0;
  shievePageNo = 1;
  shievePageSize = 10;
  owner: any;
  execeldata: any[] = [];
  juniorExecutive: any;
  seniorExecutive: any;
  qcDetail: any;
  qcColumn = [
    { field: 'candidateFullName', header: 'Candidate Name' },
    { field: 'clientName', header: 'Client Name' },
    { field: 'clientRefNo', header: 'Client Reference No' },
    { field: 'siteName', header: 'Site Name' },
    { field: 'receivedDate', header: 'Submitted Date & Time' },
    { field: 'status', header: 'Status' },
    { field: 'ownerName', header: 'Qc Owner' },
    { field: 'submittedBy', header: 'Submitted By' },
    { field: 'tatStatus', header: 'Tat Status' },
    { field: 'tatDays', header: 'Tat Days' },
    { field: 'inProgressDays', header: 'In Progress Days ' },
    { field: 'workFlow', header: 'WorkFlow' }];
  FqcClientno: any;
  fclientList: any;
  fcandidateList: any;
  iqcclientList: any;
  iqcClientno: any;
  iqccandidateList: any;
  finalclientList: any;
  finalClientno: any;
  finalcandidateList: any;
  fqcuserList: any;
  iqcuserList: any;
  excelFlag: boolean;
  outputExcelData: any[];
  fqcPersonList: any;
  iqcPersonList: any;
  finalcomponentList: any;
  iqccomponentList: any;
  finalPersonList: any;
  finalverificationIdList: any;
  iqcverificationIdList: any;
  applyPaging: boolean = true;
  // ctsQcTeamMember: any;
  constructor(public commonService: CommonService, public verification: VerificationService, private qualityCheckService: QualityCheckService, private router: Router,
    public dialog: MatDialog, private message: MessageService, public screeningService: ScreeningService,
     private dateP: DatePipe, private authService:AuthService) { }
  ngOnInit() {
    this.applyPaging = true;
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.screenAuth = this.authService.getScreenAuth(this.router.url);
    this.commonService.QUALITYCHECK_ROUTER = this.router.url;
    //this.screenAuth= this.screenAuth.getScreenAuth(this.router.url);
    this.initFormGroup();
    this.assignControl.setValue(((this.userData.teamLeadFlag === true || this.userData.subTeamName === 'SeniorExecutiveQC') ||
      this.userData.subTeamName === 'CRTCAMTeam' || this.userData.teamName === 'CTS-QCTeam' || this.userData.subTeamLeadFlag === true) ? 'Assigned' : 'Not Assigned');
    // if (this.commonService.qcOrFqcFlag === true) {
    //   this.qcOrFqc.setValue('QC');
    // } else if (this.commonService.qcOrFqcFlag === false) {
    //   this.qcOrFqc.setValue('FQC');
    // } else if (this.commonService.qcOrFqcFlag === null) {
    //   this.qcOrFqc.setValue('QC');
    // } else {
    //   this.qcOrFqc.setValue('FQC');
    // }
    this.qcOrFqc.setValue('QC');
    this.getQualityCheckDetails();
    this.itemPerPage = 10;
    if (this.qualityCheckService.backFlag === true) {
      this.qcOrFqc.setValue(this.qualityCheckService.qcOrFqc);
      this.assignControl.setValue(this.qualityCheckService.assignControl);
    }

  }
  ngOnDestroy() {
    this.commonService.qcOrFqcFlag = false;
    this.commonService.commonQcFlag = undefined;
    this.qualityCheckService.backFlag = false;
  }
  backToDashboard() {
    this.router.navigate(['dashboard/home']);
  }
  getFilterLen(c): string {
    this.filterLength = c;
    return 'listrow';
  }

  initFormGroup() {
    this.qcSearchForm = new UntypedFormGroup({
      clientName: new UntypedFormControl(null),
      verificationId: new UntypedFormControl(null),
      clientRefNo: new UntypedFormControl(null),
      candidateName: new UntypedFormControl(null),
      compName: new UntypedFormControl(null),
      ownerName: new UntypedFormControl(null),
      receivedFromDate: new UntypedFormControl(null),
      receivedToDate: new UntypedFormControl(null),
      assignStatus: new UntypedFormControl(null),
    });
    this.initautoCompleteCtrl();
  }
  getPropertyValue(event: any) {
    if (event.value !== '' && event.value !== null) {
      if (this.searchValueArr.length > 0) {
        if (this.searchValueArr.filter(x => x.propertyName === event.propertyName && x.value === event.value).length === 0) {
          if (this.searchValueArr.filter(x => x.propertyName === event.propertyName).length > 0) {
            const index = this.searchValueArr.findIndex(f => f.propertyName === event.propertyName);
            this.searchValueArr.splice(index, 1, { propertyName: event.propertyName, value: event.value });
          } else {
            this.searchValueArr.push({ propertyName: event.propertyName, value: event.value });
          }
        }
      } else {
        this.searchValueArr.push({ propertyName: event.propertyName, value: event.value });
      }
    } else {
      for (const ctrl in this.qcSearchForm.controls) {
        if (ctrl === event.propertyName) {
          const index = this.searchValueArr.findIndex(x => x.propertyName === ctrl);
          if (index > -1) {
            this.searchValueArr.splice(index, 1);
          }
        }
      }
    }
  }
  removeSearchValue(key, index) {
    this.searchValueArr.splice(index, 1);
    // tslint:disable-next-line: forin
    for (const ctrl in this.qcSearchForm.controls) {
      if (ctrl === key) {
        this.qcSearchForm.get(ctrl).setValue('');
      }
      if ((ctrl === 'receivedFromDate' && ctrl === key) || (ctrl === 'receivedToDate' && ctrl === key)) {
        this.qualityCheckList = this.commonService.CloneObject(this.qcDetails);
      }
    }
  }

  initDefaultData() {
    if (this.commonService.qcOrFqcFlag !== null) {
      // if (this.commonService.Fqc) {
      //   this.qualityCheckService.getFqcPendingDropdownDetails(this.userData).subscribe(res => {
      //     if (res) {
      //       this.FqcClientno = res.clientRefID;
      //       this.fclientList = res.clientName;
      //       this.fcandidateList = res.candidateName;
      //       this.fqcPersonList = res.qcPersonName;

      //     }
      //   });
      // }
      // else {
      this.qualityCheckService.getIQcDropdownDetails(this.userData).subscribe(res => {
        if (res) {
          this.iqcClientno = res.clientRefID;
          this.iqcclientList = res.clientName;
          this.iqccandidateList = res.candidateName;
          this.iqcPersonList = res.qcPersonName;
          this.iqccomponentList = res.componentName;
          this.iqcverificationIdList = res.verifcationId;
        }
      });
      // }
    }
    else {
      if (this.commonService.commonQcFlag === 'subCheckQc') {
        this.qualityCheckService.getSubCheckDropdownDetails(this.userData).subscribe(res => {
          if (res) {
            this.finalClientno = res.clientRefID;
            this.finalclientList = res.clientName;
            this.finalcandidateList = res.candidateName;
            this.finalcomponentList = res.componentName;
            this.finalPersonList = res.qcPersonName;
            this.finalverificationIdList = res.verifcationId;
          }
        });
      }
      else {
        this.qualityCheckService.getIQCFinalCompDetDropDown(this.userData).subscribe(res => {
          if (res) {
            this.finalClientno = res.clientRefIdList;
            this.finalclientList = res.clientNameList;
            this.finalcandidateList = res.candiadateList;
            this.finalcomponentList = res.componentNameList;
            this.finalPersonList = res.qcPersonNameList;
            this.finalverificationIdList = res.vaerificationIdList;
          }
        });
      }

    }
  }
  // initDefaultData() {
  //   if (this.commonService.qcOrFqcFlag !== null) {
  //     if (this.commonService.Fqc) {
  //       this.qualityCheckService.getFqcPendingDropdownDetails(this.userData).subscribe(res => {
  //         if (res) {
  //           this.FqcClientno = res.clientRefID;
  //           this.fclientList = res.clientName;
  //           this.fcandidateList = res.candidateName;
  //           this.fqcPersonList = res.qcPersonName;

  //         }
  //       });
  //     }
  //     else {
  //       this.qualityCheckService.getIQcDropdownDetails(this.userData).subscribe(res => {
  //         if (res) {
  //           this.iqcClientno = res.clientRefID;
  //           this.iqcclientList = res.clientName;
  //           this.iqccandidateList = res.candidateName;
  //           this.iqcPersonList = res.qcPersonName;
  //           this.iqccomponentList = res.componentName;
  //           this.iqcverificationIdList = res.verifcationId;
  //         }
  //       });
  //     }
  //   }
  //   else {
  //     this.qualityCheckService.getIQCFinalCompDetDropDown(this.userData).subscribe(res => {
  //       if (res) {
  //         this.finalClientno = res.clientRefIdList;
  //         this.finalclientList = res.clientNameList;
  //         this.finalcandidateList = res.candiadateList;
  //         this.finalcomponentList = res.componentNameList;
  //         this.finalPersonList = res.qcPersonNameList;
  //         this.finalverificationIdList = res.vaerificationIdList;
  //       }
  //     });

  //   }
  // }
  getQualityCheckDetails() {
    if (this.commonService.qcOrFqcFlag === null) {
      if (this.commonService.commonQcFlag === 'subCheckQc') {
        this.applyPagination();
        this.qualityCheckService.getSubCheckDetails(this.userData).subscribe(response => {
          if (response) {
            const res = response.body;
            // res.getQcDetails = res.getQcDetails.filter(x => x.subCheckFlag === true);
            this.shieveTotalCount = res.getQcDetails.length
            this.getResList(res);
          }
        });
      } else {
        this.applyPagination();
        this.qualityCheckService.GetIQCFinalCompDet(this.userData).subscribe(resp => {
          if (resp) {
            this.shieveTotalCount = resp.headers.get('X-Total-Count');
            const res = resp.body;
            this.getResList(res);
          }
        });
      }
    }
    else {
      // if (this.commonService.Fqc) {
      //   this.applyPagination();
      //   this.qualityCheckService.getFQcDetails(this.userData).subscribe(resp => {
      //     if (resp) {
      //       this.shieveTotalCount = resp.headers.get('X-Total-Count');
      //       const res = resp.body;
      //       this.getResList(res);
      //     }
      //   });
      // }
      // else {
      this.applyPagination();
      this.qualityCheckService.getIqcDetails(this.userData).subscribe(resp => {
        if (resp) {
          this.shieveTotalCount = resp.headers.get('X-Total-Count');
          const res = resp.body;
          this.getResList(res);
        }
      });
      //}
    }
    //this.initDefaultData();
  }
  isCamLogin() {
    return ((this.userData.teamName === 'CRTIndia' || this.userData.teamName === 'CRTTechMahindra' || this.userData.teamName === 'CRTAbroad' || this.userData.teamName === 'CTS-CRTTeam')
      && (this.userData.subTeamName === 'CRTCAMTeam' || this.userData.subTeamName === null)) && !(this.commonService.qcOrFqcFlag === null);
  }
  getResList(res: any) {
    if (res) {
      this.qcDetails = res.getQcDetails;
      if (res.clientCategoryId !== 4) {
        this.seniorExecutive = res.seniorExecutive;
        this.juniorExecutive = res.juniorExecutive;
      } else  {
        this.seniorExecutive = res.juniorExecutive;
        this.juniorExecutive = res.juniorExecutive;
      }
      // this.seniorExecutive = res.seniorExecutive;
      // this.juniorExecutive = res.juniorExecutive;
      // this.ctsQcTeamMember = res.ctsQcTeamMember === null ? [] :  res.ctsQcTeamMember;
      this.gridDataShowbyUserId(this.qcDetails, res.clientCategoryId);
      if (this.qualityCheckService.backFlag === true) {
        this.searchValueArr = this.qualityCheckService.searchArr;
        this.qcSearchForm.setValue(this.qualityCheckService.searchForm);
      }
    }
  }
  applyPagination() {
    let filter = this.userData.filters;
    if (this.qcSearchForm.value.clientName && this.qcSearchForm.get('clientName')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'clientName@=' + this.qcSearchForm.value.clientName;
    } if (this.qcSearchForm.value.clientRefNo && this.qcSearchForm.get('clientRefNo')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'clientRefNo@=' + this.qcSearchForm.value.clientRefNo;
    } if (this.qcSearchForm.value.verificationId && this.qcSearchForm.get('verificationId')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'verificationId@=' + this.qcSearchForm.value.verificationId;
    } if (this.qcSearchForm.value.compName && this.qcSearchForm.get('compName')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'ComponentName@=' + this.qcSearchForm.value.compName;
    } if (this.qcSearchForm.value.ownerName && this.qcSearchForm.get('ownerName')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'QcPersonFirstName @=' + this.qcSearchForm.value.ownerName;
    } if (this.qcSearchForm.value.candidateName && this.qcSearchForm.get('candidateName')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'firstName @=' + this.qcSearchForm.value.candidateName
    }
    this.userData.pageSize = this.shievePageSize;
    this.userData.page = this.shievePageNo;
    this.userData.filters = filter;
    this.userData.sorts = '';
    this.userData.applyPaging = this.applyPaging;
    this.userData.needTotal = true;
    if (((this.userData.teamLeadFlag === true || this.userData.subTeamLeadFlag === true || this.userData.subTeamName === 'SeniorExecutiveQC') && !(this.commonService.qcOrFqcFlag === null)) || (this.isCamLogin())) {
      this.userData.AssignedStatus = this.assignControl.value === 'Assigned' ? true : false;
    }
    else {
      this.userData.AssignedStatus = true;
    }

  }
  getFilterList(qcDetails: any) {
    qcDetails.map(m => m.status = m.rejectFlag === true ? 'Rejected' : m.approvedFlag === true ? 'Approved' : 'Received');
    qcDetails.map(m => m.componentName = (this.commonService.getCompNameByIndex((m.componentName +
      (m.subCompName ? (' - ' + m.subCompName) : '')), m.compIndex, m.compMaxNo, m.subCompMaxNo)));
    qcDetails.map(m => m.submittedBy = m.submittedByFirstName ? (m.submittedByFirstName + (m.submittedByMiddleName ?
      (' ' + m.submittedByMiddleName) : '') + (m.submittedByLastName ? (' ' + m.submittedByLastName) : '')) : null);
    qcDetails.map(m =>
      m.ownerName = m.qcPersonFirstName ? (m.qcPersonFirstName + (m.qcPersonMiddleName ? (' ' + m.qcPersonMiddleName) : '') +
        (m.qcPersonLastName ? (' ' + m.qcPersonLastName) : '')) : null);
    qcDetails.map(m =>
      m.candidateFullName = m.firstName + (m.middleName ? (' ' + m.middleName) : '') +
      (m.lastName ? (' ' + m.lastName) : ''));
    this.clientList = Array.from(new Map
      (qcDetails.map(x => ({ clientName: x.clientName }))
        .map(e => [e.clientName, e])).values());
    this.componentList = Array.from(new Map
      (qcDetails.map(x => ({ componentName: x.componentName })).filter(f => f.componentName !== null)
        .map(e => [e.componentName, e])).values());
    this.candidateList = Array.from(new Map
      (qcDetails.map(x => ({ candidateFullName: x.candidateFullName })).filter(f => f.candidateFullName !== null)
        .map(e => [e.candidateFullName, e])).values());
    this.verificationIdList = Array.from(new Map
      (qcDetails.map(x => ({ verificationId: x.verificationId })).filter(f => f.verificationId)
        .map(e => [e.verificationId, e])).values());
    this.clientReferenceIdList = Array.from(new Map
      (qcDetails.map(x => ({ clientRefNo: x.clientRefNo }))
        .map(e => [e.clientRefNo, e])).values());
    this.userList = Array.from(new Map
      (qcDetails.map(x => ({ ownerName: x.ownerName })).filter(f => f.ownerName !== null)
        .map(e => [e.ownerName, e])).values());
    this.initautoCompleteCtrl();
  }
  initautoCompleteCtrl() {
    if (this.commonService.qcOrFqcFlag === null) {
      this.componentControl = new AutoCompleteDropDown('Component Name', 'compName', 'id', 'name', this.finalcomponentList,
        '', this.qcSearchForm, false, false, false, 'standard');
      // this.clientNameControl = new AutoCompleteDropDown('Client Name', 'clientName', 'id', 'name', this.finalclientList,
      //   '', this.qcSearchForm, false, false, false, 'standard');
      // this.userControl = new AutoCompleteDropDown('QC Person Name', 'ownerName', 'id', 'name', this.finalPersonList,
      //   '', this.qcSearchForm, false, false, false, 'standard');
      // this.verificationControl = new AutoCompleteDropDown('Verification ID', 'verificationId', 'id', 'name',
      //   this.finalverificationIdList, '', this.qcSearchForm, false, false, false, 'standard');
      // this.caseRefNoControl = new AutoCompleteDropDown('Client Ref Number', 'clientRefNo', 'name', 'name', this.finalClientno,
      //   '', this.qcSearchForm, false, false, false, 'standard');
      // this.candidateControl = new AutoCompleteDropDown('Candidate Name', 'candidateName', 'id',
      //   'name', this.finalcandidateList, '', this.qcSearchForm, false, false, false, 'standard');
    } else {
      if (this.commonService.Fqc) {
        // this.clientNameControl = new AutoCompleteDropDown('Client Name', 'clientName', 'id', 'name', this.fclientList,
        //   '', this.qcSearchForm, false, false, false, 'standard');
        // this.userControl = new AutoCompleteDropDown('QC Person Name', 'ownerName', 'id', 'name', this.fqcPersonList,
        //   '', this.qcSearchForm, false, false, false, 'standard');
        // this.caseRefNoControl = new AutoCompleteDropDown('Client Ref Number', 'clientRefNo', 'name', 'name', this.FqcClientno,
        //   '', this.qcSearchForm, false, false, false, 'standard');
        // this.candidateControl = new AutoCompleteDropDown('Candidate Name', 'candidateName', 'id',
        //   'name', this.fcandidateList, '', this.qcSearchForm, false, false, false, 'standard');
      }
      else {
        this.componentControl = new AutoCompleteDropDown('Component Name', 'compName', 'id', 'name', this.iqccomponentList,
          '', this.qcSearchForm, false, false, false, 'standard');
        // this.clientNameControl = new AutoCompleteDropDown('Client Name', 'clientName', 'id', 'name', this.iqcclientList,
        //   '', this.qcSearchForm, false, false, false, 'standard');
        // this.userControl = new AutoCompleteDropDown('QC Person Name', 'ownerName', 'id', 'name', this.iqcPersonList,
        //   '', this.qcSearchForm, false, false, false, 'standard');
        // this.verificationControl = new AutoCompleteDropDown('Verification ID', 'verificationId', 'name', 'name',
        //   this.iqcverificationIdList, '', this.qcSearchForm, false, false, false, 'standard');
        // this.caseRefNoControl = new AutoCompleteDropDown('Client Ref Number', 'clientRefNo', 'name', 'name', this.iqcClientno,
        //   '', this.qcSearchForm, false, false, false, 'standard');
        // this.candidateControl = new AutoCompleteDropDown('Candidate Name', 'candidateName', 'id',
        //   'name', this.iqccandidateList, '', this.qcSearchForm, false, false, false, 'standard');
      }
    }
  }
  search() {
    if (this.qcSearchForm.value.clientName || this.qcSearchForm.value.clientRefNo || this.qcSearchForm.value.compName
      || this.qcSearchForm.value.candidateName || this.qcSearchForm.value.verificationId || this.qcSearchForm.value.ownerName ||
      this.qcSearchForm.value.fqcClosedUserFName || this.qcSearchForm.value.from || this.qcSearchForm.value.to) {
      this.shievePageNo = 1;
      this.userData.filters = '';
      this.getQualityCheckDetails();
    } else {
      this.showTopCenter('warn', 'Failure Message', 'Choose filter values to search');
    }
  }
  shieveFilter(ctrl: any) {
    if (this.qcSearchForm.get(ctrl).valid) {
      this.getQualityCheckDetails();
    }
  }
  removeValue(value: any) {
    if (value === '') {
      this.getQualityCheckDetails();
    }
  }
  shievePagination(event: any) {
    this.shievePageNo = event;
    this.getQualityCheckDetails();
  }
  shieveShowall() {
    if (this.shieveTotalCount > 0) {
      //this.shievePageSize = this.shieveTotalCount;
      this.applyPaging = false;
      this.getQualityCheckDetails();
    }
  }
  gridDataShowbyUserId(qualityCheckDetails, clientCategoryId?: any) {
    if (((this.userData.teamLeadFlag === true || this.userData.subTeamName === 'SeniorExecutiveQC') ||
      this.userData.subTeamName === 'CRTCAMTeam') || this.userData.subTeamLeadFlag === true) {
      if (((this.userData.teamLeadFlag === true || this.userData.subTeamLeadFlag === true || this.userData.subTeamName === 'SeniorExecutiveQC') ||
        this.userData.subTeamName === 'CRTCAMTeam') && !(this.commonService.qcOrFqcFlag === null) || clientCategoryId === 4) {
        this.assignedList = qualityCheckDetails.filter(x => x.qcUserId > 0);
        this.unAssignedList = qualityCheckDetails.filter(x => x.qcUserId === 0);
        if (this.assignControl.value === 'Not Assigned') {
          this.qualityCheckList = this.unAssignedList;
        } else if (this.assignControl.value === 'Assigned') {
          this.qualityCheckList = this.assignedList;
        } else {
          this.qualityCheckList = qualityCheckDetails;
        }
        this.toggleChange(this.qcOrFqc.value, clientCategoryId);
      } else {
        this.qualityCheckList = qualityCheckDetails;
        this.getFilterList(this.qualityCheckList);
      }
    } else {
      this.qualityCheckList = this.commonService.CloneObject(qualityCheckDetails);
      this.getFilterList(this.qualityCheckList);
    }
    this.page = 1;
  }
  selectTab(name: any) {
    // if (name === 'Assigned') {
    //   this.qualityCheckList = this.assignedList;
    // } else {
    //   this.qualityCheckList = this.unAssignedList;
    // }
    this.getQualityCheckDetails();
    this.toggleChange(this.qcOrFqc.value);
  }
  reset() {
    this.searchValueArr = [];
    this.qcSearchForm.reset();
    this.userData.filters = "";
    this.applyPaging = true;
    this.assignControl.setValue('Assigned');
    this.getQualityCheckDetails();
  }
  resetFilterSort(type: any) {
    //this.qcSearchForm.reset();
    this.searchValueArr = [];
    this.column = '';
    switch (type) {
      case 'tab':
        this.qualityCheckList = this.commonService.CloneObject(this.qualityCheckList);
        break;
      case 'reset':
        this.getQualityCheckDetails();
        break;
      default:
        break;
    }

  }
  selectAll(e: any) {
    if (e.checked === true) {
      this.qualityCheckList.forEach(vd => {
        vd.assignedOwner = true;
      });
    } else {
      this.qualityCheckList.forEach(vd => {
        vd.assignedOwner = false;
      });
    }
  }
  assignOwner(e, data, i) {
    if (e.checked === true) {
      data.assignedOwner = true;
    } else {
      data.assignedOwner = false;
      this.selectall.setValue(false);
    }
    const index = this.qualityCheckList.findIndex(x => x.assignedOwner === false);
    if (index > -1) {
      this.selectall.setValue(false);
    } else {
      this.selectall.setValue(true);
    }
  }
  opendialog() {
    this.screeningOwner.markAsUntouched();
    const index = this.qualityCheckList.findIndex(x => x.assignedOwner === true);
    if (index > -1) {
      this.dialogRef = this.dialog.open(this.assignPopUp, {
        width: '400px',
        disableClose: true
      });
    } else {
      this.showTopCenter('error', 'Failure Message', 'Choose atleast one Candidate');
    }
  }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }
  dialogClose() {
    this.dialogRef.close();
    this.screeningOwner.setValue('');
    this.selectall.setValue(false);
  }

  submitOwner(owner: any) {
    this.assiginownerList = new AssignOwner();
    if (this.screeningOwner.valid) {
      const ownerList = this.qualityCheckList.filter(x => x.assignedOwner === true);
      ownerList.forEach(item => {
        if (item.finalQcFlag === true) {
          this.assiginownerList.finalQcTransId.push(item.finalQcTransId);
           this.assiginownerList.qcCompTransId = [];
        } else if (item.finalQcFlag === false) {
          this.assiginownerList.qcCompTransId.push(item.qcCompTransId);
          this.assiginownerList.finalQcTransId = [];
        }
      });
      this.assiginownerList.assignQcUserId = owner.userId;
      this.assiginownerList.loggedIn = this.userData.userId;
      this.assiginownerList.loginName = this.userData.firstName + (this.userData.lastName == null ? '' : ' ' + this.userData.lastName);
      this.assiginownerList.screeningOwnerName = owner.name;
      this.qualityCheckService.addQcOwner(this.assiginownerList).subscribe(res => {
        if (res.success === true) {
          this.dialogClose();
          this.showTopCenter('success', 'Success Message', 'Assigned Successfully');
          owner.userId = 0;
          this.getQualityCheckDetails();
        }
      });
    }
  }

  selectQc(qcDetails: any) {
    this.qualityCheckService.changeMessage(qcDetails);
    this.qualityCheckService.searchForm = this.qcSearchForm.value;
    this.qualityCheckService.searchArr = this.searchValueArr;
    this.qualityCheckService.qcOrFqc = this.qcOrFqc.value;
    this.qualityCheckService.assignControl = this.assignControl.value;
    this.verification.showsnp = true;
    this.router.navigateByUrl("/dashboard/qc/qualityCheckDetail");
  }
  sortBy(type: any) {
    this.isDesc = !this.isDesc;
    this.column = type;
    this.direction = this.isDesc ? 1 : -1;
  }
  getPage(event: any) {
    this.page = event;
  }
  getTotalPage(): number {
    if (this.qualityCheckList.length) {
      return Math.ceil(this.qualityCheckList.length / this.itemPerPage);
    }
  }
  preventInfinite() {
    // if (!this.itemPerPage) {
    //   this.itemPerPage = 1;
    // }
    this.getQualityCheckDetails();
  }
  getRecordBydate(type: any) {
    if (this.qcSearchForm.get('receivedFromDate')?.value && this.qcSearchForm.get('receivedToDate')?.value) {
      const data: any[] = [];
      const FromDate = this.dateP.transform(this.qcSearchForm.get('receivedFromDate')?.value, 'yyyy-MM-dd');
      const ToDate = this.dateP.transform(this.qcSearchForm.get('receivedToDate')?.value, 'yyyy-MM-dd');
      this.qualityCheckList.map(d => d.receivedDate = this.dateP.transform(d.receivedDate, 'yyyy-MM-dd'));
      this.qualityCheckList = this.qualityCheckList.filter(x =>
        x.receivedDate >= FromDate && x.receivedDate <= ToDate);
      const ftDate = new DatePipe('en-GB');
      data.push({
        propertyName: 'receivedFromDate',
        value: ftDate.transform(this.qcSearchForm.get('receivedFromDate')?.value, 'dd/MM/yyyy')
      },
        {
          propertyName: 'receivedToDate',
          value: ftDate.transform(this.qcSearchForm.get('receivedToDate')?.value, 'dd/MM/yyyy')
        });
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < data.length; i++) {
        this.getPropertyValue(data[i]);
      }
    } else {
      for (const ctrl in this.qcSearchForm.controls) {
        if (ctrl === type) {
          const index = this.searchValueArr.findIndex(x => x.propertyName === ctrl);
          this.searchValueArr.splice(index, 1);
          this.qualityCheckList = this.commonService.CloneObject(this.qcDetails);
        }
      }
    }
  }
  toggleChange(event,  clientCategoryId?: any) {
    if ((this.userData.teamLeadFlag === true || this.userData.subTeamName === 'SeniorExecutiveQC')
      || this.userData.subTeamLeadFlag === true || this.userData.subTeamName === 'CRTCAMTeam') {
      if (!(this.commonService.qcOrFqcFlag === null) || (clientCategoryId === 4)) {
        this.owner = event === 'QC' ? this.juniorExecutive : this.seniorExecutive;
        // this.owner = this.userData.teamName === 'CTS-QCTeam' ? this.ctsQcTeamMember : (event === 'QC' ? this.juniorExecutive : this.seniorExecutive);
        if (this.assignControl.value === 'Assigned') {
          //if (event === 'QC') {
          this.qualityCheckList = this.assignedList.filter(x => x.workFlow === 'QC');
          // } else {
          //   this.qualityCheckList = this.assignedList.filter(x => x.workFlow !== 'QC' && x.finalQcFlag === true);
          // }
        } else {
          // if (event === 'FQC') {
          //   this.qualityCheckList = this.unAssignedList.filter(x => x.workFlow !== 'QC' && x.finalQcFlag === true);
          // } else {
          //this.qualityCheckList = this.unAssignedList.filter(x => x.workFlow === 'QC');
          this.qualityCheckList = this.unAssignedList?.filter(x => x.workFlow === 'QC');
          //}
        }
      }
    } else {
      // if (this.userData.teamName === 'CTS-QCTeam') {
      //   this.owner = this.ctsQcTeamMember;
      // } else {
      if (this.userData.subTeamName === 'JuniorExecutiveQC') {
        this.owner = this.juniorExecutive;
      } else if (this.userData.subTeamName === 'SeniorExecutiveQC') {
        this.owner = this.seniorExecutive;
      }
      // }
    }
    this.resetFilterSort('tab');
    this.getFilterList(this.qualityCheckList);
  }
  assignScrnOwner(data, index) {
    this.screeningOwner.setValue('');
    const ind = this.owner.findIndex(x => x.name === data.name);
    if (ind > -1) {
      this.screeningOwner.setValue(data);
      const ele = document.getElementsByClassName('ownven-list');
      const eleScroll = document.getElementsByClassName('scrollCls');
      if (eleScroll.length > 0) {
        eleScroll[0].scrollTop = 0;
      }
      [this.owner[0], this.owner[ind]] =
        [this.owner[ind], this.owner[0]];
      const indCls = this.owner.findIndex(x => x.name === data.name);
      if (ele.length > 0) {
        for (let i = 0; i < this.owner.length; i++) {
          if (index === i) {
            ele[i].classList.add('active');
          } else {
            if (ele[i]) {
              ele[i].classList.remove('active');
            }
          }
        }
      }
      this.owner = Object.assign([], this.owner);
    } else {
      this.showTopCenter('error', 'Choose Active User', 'Owner name is In-active');
    }
  }
  showall() {
    if (this.qualityCheckList.length > 0) {
      this.itemPerPage = this.qualityCheckList.length;
    }
  }
  exportToExcel() {
    this.applyPaging = false;
    this.applyPagination();
    if (this.commonService.qcOrFqcFlag === null) {
      if (this.commonService.commonQcFlag === 'subCheckQc') {
        this.qualityCheckService.getIqcDetails(this.userData).subscribe(res => {
          const outputExcelData = res.bod.getQcDetails.filter(x => x.subCheckFlag === true);
          this.getExcelResponse(outputExcelData);
        });
      } else {
        this.qualityCheckService.GetIQCFinalCompDet(this.userData).subscribe(resp => {
          if (resp) {
            this.shieveTotalCount = resp.headers.get('X-Total-Count');
            const outputExcelData = resp.body.getQcDetails;
            this.getExcelResponse(outputExcelData);
          }
        });
      }
    } else {
      if (this.commonService.Fqc) {
        this.qualityCheckService.getFQcDetails(this.userData).subscribe(resp => {
          if (resp) {
            this.shieveTotalCount = resp.headers.get('X-Total-Count');
            const outputExcelData = resp.body.getQcDetails;
            this.getExcelResponse(outputExcelData);
          }
        });
      }
      else {
        this.qualityCheckService.getIqcDetails(this.userData).subscribe(resp => {
          if (resp) {
            this.shieveTotalCount = resp.headers.get('X-Total-Count');
            const outputExcelData = resp.body.getQcDetails;
            this.getExcelResponse(outputExcelData);
          }
        });
      }
    }
  }
  getExcelResponse(outputExcelData: any) {
    outputExcelData.map(m =>
      m.candidateFullName = m.firstName + (m.middleName ? (' ' + m.middleName) : '') +
      (m.lastName ? (' ' + m.lastName) : ''));

    outputExcelData.map(m =>
      m.ownerName = m.qcPersonFirstName + (m.qcPersonMiddleName ? (' ' + m.qcPersonMiddleName) : '') +
      (m.qcPersonLastName ? (' ' + m.qcPersonLastName) : ''));

      outputExcelData.map(m =>
        m.submittedBy = m.submittedByFirstName + (m.submittedByMiddleName ? (' ' + m.submittedByMiddleName) : '') +
        (m.submittedByLastName ? (' ' + m.submittedByLastName) : ''));

        outputExcelData.map(m =>
          m.status = m.approvedFlag === false ? 'Received': 'Approved');

    ((this.userData.teamLeadFlag === true || this.userData.subTeamName === 'SeniorExecutiveQC')
      || this.userData.subTeamName === 'CRTCAMTeam') ? this.qcOrFqc.setValue(this.qcOrFqc.value)
      : this.qualityCheckList[0].finalQcFlag === true
        ? this.qcOrFqc.setValue('FQC') : this.qcOrFqc.setValue('QC');

    if (this.qcOrFqc.value === 'QC' && !this.qcColumn.some(x => x.field === 'componentName')) {
      this.qcColumn.push({ field: 'componentName', header: 'Component Name' },
        { field: 'functionalEntity', header: 'Functional Entity' }, { field: 'colourCode', header: 'Color Code' },
        { field: 'verificationId', header: 'Verification Id' });
    } else if (this.qcOrFqc.value === 'FQC' && this.qcColumn.some(x => x.field === 'componentName')) {
      this.qcColumn.pop(); this.qcColumn.pop();
    }
    const fileName = this.qcOrFqc.value + ' ' + ((((this.userData.teamLeadFlag === true || this.userData.subTeamName === 'SeniorExecutiveQC') || this.userData.subTeamName === 'CRTCAMTeam') || this.userData.subTeamLeadFlag === true)
      ? this.assignControl.value : '');
    this.commonService.exportToExcel(this.qcColumn, outputExcelData, this.commonService.qcOrFqcFlag === null ? 'Final Component' : fileName);
  }
}
