import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';
import { UserData } from 'src/app/common-methods/models/user';
import { AgentEntryMasterService } from 'src/app/common-methods/services/agent-entry-master.service';
import { VerificationService } from 'src/app/common-methods/services/verification.service';
import { CommonService } from '../../common-methods/services/common.service';

@Component({
  standalone: false,
  selector: 'app-clientcommunication',
  templateUrl: './clientcommunication.component.html',
  styleUrls: ['./clientcommunication.component.css']
})
export class ClientcommunicationComponent implements OnInit {
  routePath = 'Screening / Client Communication';
  breadcrumbFlags = new BreadcrumbFlags();
  userData: UserData;
  // tslint:disable-next-line: no-use-before-declare
  LoginUserDetVm = new LoginUserDetVm();
  // tslint:disable-next-line: no-use-before-declare
  commentsVm = new CommentsVm();
  communicationList: any[] = [];
  ind = 0;
  comments: any[] = [];
  commentsCtrl = new UntypedFormControl('', Validators.required);
  dataList: any;
  constructor(public agent: AgentEntryMasterService, public verification: VerificationService,
    private message: MessageService,public common: CommonService) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.GetClientInteration();
  }
  GetClientInteration() {
    this.agent.GetClientInteration(this.userData).subscribe(resp => {
      this.communicationList = resp;
      this.comments = this.communicationList[this.ind].comments;
      this.dataList = this.communicationList[this.ind];
    });
  }
  getRows(i, data) {
    this.ind = i;
    this.dataList = data;
    this.comments = data.comments;
    this.goToTop();
  }
  sendMessage() {
    if (this.commentsCtrl.value && this.commentsCtrl.valid) {
      this.commentsVm.transactionId = 0;
      this.commentsVm.comments = this.commentsCtrl.value;
      this.commentsVm.clientInteractionFlag = this.userData.applicationId === 2 ? true : false;
      this.commentsVm.createdUserId = this.userData.userId;
      this.commentsVm.screeningId = this.dataList.screeningId;
      this.commentsVm.screeningCompId = this.dataList.screeningCompId;
      this.verification.addVerificationComments(this.commentsVm).subscribe(resp => {
        if (resp) {
          this.showTopCenter('success', 'Success Message', 'Updated Successfully');
          this.commentsCtrl.setValue('');
          this.commentsCtrl.clearValidators();
          this.commentsCtrl.updateValueAndValidity();
          this.GetClientInteration();
        }
      });
    } else {
      this.commentsCtrl.markAsTouched();
    }
  }
  searchValue(val: any) {
  const fv = this.communicationList.filter(x => x.clientRefNo === val.value);
  }
  goToTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }

}
export class LoginUserDetVm {
  userId: number;
  deptId: number;
  deptName: string;
  applicationId: number;
  teamId: number;
  subTeamId: number;
  subTeamName: string;
  teamName: string;
  clientId: any[];
  teamLeadFlag: boolean;
  subTeamLeadFlag: boolean;
  workFlowLookupId: number;
  siteId: any[];
}
export class CommentsVm {
  transactionId: number;
  screeningCompId: number;
  screeningId: number;
  comments: string;
  callDuration: number;
  callCharge: number;
  statusDate: any;
  callBack: any;
  updatedToClient: any;
  updatedToClientFlag: boolean;
  lastCalledFlag: boolean;
  lastCalled: any;
  sendNotificationToClient: boolean;
  receivedClientUpdateFlag: boolean;
  dismissal: boolean;
  expectedDateClosure: any;
  clientInteractionFlag: boolean;
  createdUserId: number;
}