import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { VerificationDetails } from 'src/app/common-methods/models/verification';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { VerificationService } from 'src/app/common-methods/services/verification.service';

@Component({
  standalone: false,
  selector: 'app-global-search',
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.css']
})
export class GlobalSearchComponent implements OnInit, OnDestroy {
  //Added by Megala - for VTS2-2023-DEV-0141 (Comment History Added In Global Search)
  @ViewChild('history', { static: true }) history!: any;;
  historyFlag: boolean;
  routePath = 'Global Search';
  userData: any;
  searchForm: UntypedFormGroup;
  clientControl!: AutoCompleteDropDown;
  componentControl!: AutoCompleteDropDown;
  caseRefNoControl!: AutoCompleteDropDown;
  candidateControl!: AutoCompleteDropDown;
  statusControl!: AutoCompleteDropDown;
  verificationDetails: VerificationDetails = new VerificationDetails();
  itemPerPage = 5;
  page = 1;
  clientList: any[] = [];
  clientRefNoList: any[] = [];
  candidateList: any[] = [];
  componentList: any[] = [];
  searchValueArr: any[] = [];
  caseStatusList: any[] = [];
  count = 0;
  isDesc: boolean;
  column: any;
  direction: number;
  //Added by Megala - for VTS2-2023-DEV-0141 (Comment History Added In Global Search)
  compHistoryCommentList: any[] = [];
  dialogRef: any;
  addFeeList: any[] = [];
  constructor(public master: MasterService, public common: CommonService, public verificationService: VerificationService,public dialog: MatDialog,
    private router: Router) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.master.searchList.map(m => m.candidateFirstName = m.candidateFirstName + ' ' + m.candidateMiddleName + ' ' + m.candidateLastName);
   // this.master.searchList.map(m => m.componentName = (m.componentName !=null)?(this.common.getCompNameByIndex((m.componentName +
    //  (m.subCompName ? (' - ' + m.subCompName) : '')), m.compIndex, m.compMaxNo, m.subCompMaxNo)):'N/A');
    this.getLookUpValue();
    this.initControl();
    if (this.master.searchList.length > 0) {
      this.autocompleteData();
    }
  }
  showall(){
    this.itemPerPage= this.master.searchList.length;
  }
  initControl() {
    this.searchForm = new UntypedFormGroup({
      clientName: new UntypedFormControl(null),
      clientRefNo: new UntypedFormControl(null),
      candidateName: new UntypedFormControl(null),
      componentName: new UntypedFormControl(null),
      caseStatus: new UntypedFormControl(null)
    });
    this.initautoCompleteCtrl();
  }
  initautoCompleteCtrl() {
    this.componentControl = new AutoCompleteDropDown('Component Name', 'componentName', 'componentName',
      'componentName', this.componentList,
      '', this.searchForm, false, false, false, 'standard');
    this.clientControl = new AutoCompleteDropDown('Client Name', 'clientName', 'clientName', 'clientName', this.clientList,
      '', this.searchForm, false, false, false, 'standard');
    this.caseRefNoControl = new AutoCompleteDropDown('Client Ref No.', 'clientRefNo', 'clientRefNo', 'clientRefNo',
      this.clientRefNoList, '', this.searchForm, false, false, false, 'standard');
    this.candidateControl = new AutoCompleteDropDown('Candidate Name', 'candidateName', 'candidateFirstName',
      'candidateFirstName', this.candidateList, '', this.searchForm, false, false, false, 'standard');
    this.statusControl = new AutoCompleteDropDown('Case Status', 'caseStatus', 'caseStatus',
      'caseStatus', this.caseStatusList, '', this.searchForm, false, false, false, 'standard');
  }
  getcount(count: any) {
    this.count = count;
    return '';
  }
  sortBy(type: any) {
    this.isDesc = !this.isDesc;
    this.column = type;
    this.direction = this.isDesc ? 1 : -1;
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
      for (const ctrl in this.searchForm.controls) {
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
    // tslint:disable-next-line: forin
    this.searchValueArr.splice(index, 1);
    // tslint:disable-next-line: forin
    for (const ctrl in this.searchForm.controls) {
      if (ctrl === key) {
        this.searchForm.get(ctrl).setValue('');
      }
    }
  }
  getLookUpValue() {
    this.master.GetAllLookupValue(0).subscribe(res => {
      if (res.length > 0) {
        const wf = res.filter(x => x.lookupCatName === 'CaseWorkFlow');
        if (wf.length > 0) {
          const VEList = wf[0].lookupValue.filter(x => x.lookUpId === this.userData.workFlowLookupId && x.lookUpName === 'VE');
          if (VEList.length > 0) {
            this.common.VE = false;
          } else {
            this.common.VE = true;
          }
        }
      }
    });
  }
  openVerify(data: any) {
    if ((data.workFlow !== 'DE' && data.veRejectFlag !== true) || 
  (data.veRejectFlag === true && data.workFlow === 'DE')) {
      this.getLookUpValue();
      this.verificationDetails.screeningCompId = data.screeningCompId;
      this.verificationDetails.loginUserDetVm = JSON.parse(sessionStorage.getItem('user_data') as string);
      this.verificationService.getVerificationDetails(this.verificationDetails).subscribe(resp => {
        if (resp) {
          // if (this.common.VE === true) {
            this.verificationService.changeMessage(data.screeningCompId);
            this.verificationService.globalSearchFlag = true;
            this.verificationService.closedCheck = true;
            this.router.navigate(['dashboard/verification/verificationDetail']);
            this.common.backFlag = true;
          // }
        }
      });
    }
  }


  autocompleteData() {
    this.clientList = Array.from(new Map
      (this.master.searchList.map(x => ({ clientName: x.clientName }))
        .map(e => [e.clientName, e])).values());
    this.clientRefNoList = Array.from(new Map
      (this.master.searchList.map(x => ({ clientRefNo: x.clientRefNo }))
        .map(e => [e.clientRefNo, e])).values());
    this.candidateList = Array.from(new Map
      (this.master.searchList.map(x => ({ candidateFirstName: x.candidateFirstName }))
        .map(e => [e.candidateFirstName, e])).values());
    this.componentList = Array.from(new Map
      (this.master.searchList.map(x => ({ componentName: x.componentName }))
        .map(e => [e.componentName, e])).values());
    this.caseStatusList = Array.from(new Map
      (this.master.searchList.map(x => ({ caseStatus: x.caseStatus }))
        .map(e => [e.caseStatus, e])).values());
    this.initControl();
  }
  
  resetFilterSort() {
    this.searchForm.reset();
    this.searchValueArr = [];
  }
  backform() {
    this.master.searchList = [];
    this.common.VE = false;
    this.router.navigate(['dashboard/home']);
  }
  getPage(event: any) {
    this.page = event;
  }
  preventInfinite() {
    if (!this.itemPerPage) {
      this.itemPerPage = 1;
    }
  }
  ngOnDestroy(): void {
    this.master.searchList = [];
  }
//Added by Megala - for VTS2-2023-DEV-0141 (Comment History Added In Global Search)
openDialog(data,screeningCompId,screeningId,clientRefNo) {
  this.historyFlag = data;
  this.getComponentComments(screeningCompId,(screeningId>0)?screeningId:0,clientRefNo);
  this.dialogRef = this.dialog.open(this.history, {
    width: '900px',
    disableClose: true
  });
}
getComponentComments(screeningCompId,screeningId,clientRefNo) {
  this.verificationService.getComponentComments(screeningCompId,screeningId,clientRefNo).subscribe(resp => {
      if (resp) {
        this.compHistoryCommentList = resp;
        this.addFeeList = [];
        this.compHistoryCommentList.forEach(element => {
          if (element.subCompName) {
            element.compName = (element.compName) + ' - ' + (element.subCompName);
          }
          if (element.comments.includes('Additional Fees') || (element.comments.includes('Component Fees'))) {
            this.addFeeList.push(element);
          }
        });
      }
    });
}
//Ended by Megala -for VTS2-2023-DEV-0141 (Comment History Added In Global Search)

}
