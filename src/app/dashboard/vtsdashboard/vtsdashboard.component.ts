import { Component, OnInit } from '@angular/core';
import { QualityCheckService } from 'src/app/common-methods/services/quality-check.service';
import { threadId } from 'worker_threads';

@Component({
  standalone: false,
  selector: 'app-vtsdashboard',
  templateUrl: './vtsdashboard.component.html',
  styleUrls: ['./vtsdashboard.component.css']
})
export class VtsdashboardComponent implements OnInit {
  routePath = 'VTS Dashboard';
  userData: any;
  // tslint:disable-next-line: no-use-before-declare
  countVm = new HomeVm();
  qcDetails: any[] = [];
  seniorExec: any;
  juniorExec: any;
  finalQCCount: number;
  individualCount: number;
  iqcApprovedCount: number;
  iqcRejectedCount: number;
  fqcApprovedCount: number;
  fqcRejectedCount: number;
  constructor(public QC: QualityCheckService) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.getQCCount();
  }
  getQCCount() {
    this.countVm.userId = this.userData.userId;
    this.countVm.deptId = this.userData.deptId;
    this.countVm.deptName = this.userData.deptName;
    this.countVm.applicationId = this.userData.applicationId;
    this.countVm.teamId = this.userData.teamId;
    this.countVm.subTeamId = this.userData.subTeamId;
    this.countVm.subTeamName = this.userData.subTeamName;
    this.countVm.teamName = this.userData.teamName;
    this.countVm.teamLeadFlag = this.userData.teamLeadFlag;
    this.countVm.subTeamLeadFlag = this.userData.subTeamLeadFlag;
    this.countVm.workFlowLookupId = this.userData.workFlowLookupId;
    this.countVm.siteId = this.userData.siteId;
    this.countVm.clientId = this.userData.clientId;
    this.QC.GetQcDetails(this.countVm).subscribe(resp => {
      if (resp) {
        this.qcDetails = resp.dashBoardDetail.getQcDetails;
        this.seniorExec = resp.dashBoardDetail.seniorExecutive;
        this.juniorExec = resp.dashBoardDetail.juniorExecutive;
        this.openFinalQCCount();
      }
    });
  }
  openFinalQCCount() {
    // FQC
    const finalCount = this.qcDetails.filter(x => x.finalQcFlag === true && x.approvedFlag === false && x.rejectFlag === false);
    finalCount.length > 0 ? this.finalQCCount = finalCount.length : this.finalQCCount = 0;
    // IQC
    const indCount = this.qcDetails.filter(x => x.finalQcFlag === false && x.approvedFlag === false && x.rejectFlag === false);
    indCount.length > 0 ? this.individualCount = indCount.length : this.individualCount = 0;
    // IQC Approved
    const iQCAppCount = this.qcDetails.filter(x => x.finalQcFlag === false && x.approvedFlag === true && x.rejectFlag === false);
    iQCAppCount.length > 0 ? this.iqcApprovedCount = iQCAppCount.length : this.iqcApprovedCount = 0;

    // FQC Approved
    const fQCAppCount = this.qcDetails.filter(x => x.finalQcFlag === true && x.approvedFlag === true && x.rejectFlag === false);
    fQCAppCount.length > 0 ? this.fqcApprovedCount = fQCAppCount.length : this.fqcApprovedCount = 0;

    if (iQCAppCount.length > 0) {
      // IQC Reject
      const irejectList = iQCAppCount.map(m => m.screeningCompId);
      if (irejectList.length > 0) {
        const irejectCount = this.qcDetails.filter(x => x.finalQcFlag === false && x.approvedFlag === false && x.rejectFlag === true
          && !irejectList.includes(x.screeningCompId));
        irejectCount.length > 0 ? this.iqcRejectedCount = irejectCount.length : this.iqcRejectedCount = 0;
      }
    }
    if (fQCAppCount.length > 0) {
      // FQC Reject
      const frejectList = fQCAppCount.map(m => m.screeningId);
      const frejectCount = this.qcDetails.filter(x => x.finalQcFlag === true && x.approvedFlag === false && x.rejectFlag === true
        && !frejectList.includes(x.screeningId));
      frejectCount.length > 0 ? this.fqcRejectedCount = frejectCount.length : this.fqcRejectedCount = 0;
    }
  }
}

export class HomeVm {
  userId: number;
  deptId: number;
  deptName: string;
  applicationId: number;
  teamId: number;
  subTeamId: number;
  subTeamName: number;
  teamName: string;
  clientId: any;
  teamLeadFlag: string;
  subTeamLeadFlag: string;
  workFlowLookupId: string;
  siteId: any;
}
