import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { NotificationService } from 'src/app/common-methods/services/notification.service';
import { SharedService } from 'src/app/common-methods/services/shared.service';
import { CommonService } from 'src/app/common-methods/services/common.service';

@Component({
  standalone: false,
  selector: 'app-dept-choose',
  templateUrl: './dept-choose.component.html',
  styleUrls: ['./dept-choose.component.css']
})
export class DeptChooseComponent implements OnInit {
  userDepartment = new UntypedFormControl(null);
  @ViewChild('chooseDept', { static: true }) chooseDept!: TemplateRef<any>;
  userData: any;

  constructor(private router: Router,public common: CommonService, private shared: SharedService, public auth: AuthService,
    private messageService: MessageService, private notification: NotificationService) { }

    ngOnInit() {
      this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    }
    showTopCenter(level: string, info: string, message: string) {
      this.messageService.add({ severity: level, summary: info, detail: message });
    }
    openDashboard() {
      if (this.userDepartment.value) {
        this.userData.deptId = this.userDepartment.value;
        // sessionStorage.setItem('user_data', JSON.stringify(this.userData));
        // this.router.navigate(['/dashboard/home']);
        this.common.insuffCountFlag = false;
        this.common.caseFlag = false;
        this.common.VeCountFlag = false;
        this.common.qcCountFlag = false;
        this.common.caseHistoryFlag =false;
        this.login();

      } else {
        this.showTopCenter('warn', 'Failure Message', 'Please choose atleast one department');
        // this.userDepartment.setValidators(Validators.required);
        // this.userDepartment.markAsTouched();
      }
    }
    login() {
      this.auth.GetUserTeamDetails(this.userData.userId, this.userData.deptId).subscribe(resp => {
        if (resp) {
          this.getUserData(resp);
          sessionStorage.setItem('user_data', JSON.stringify(this.userData));
          this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
          this.auth.loadSessionData();
          this.auth.GetUserRolePermission(this.userData.userId, this.userData.applicationId, this.userData.deptId ,this.userData.subTeamId,this.userData.teamId).subscribe((res) => {
            if (res) {
              sessionStorage.setItem('user_roles', JSON.stringify(res));
              this.router.navigate(['/dashboard/home']);
              this.shared.clientApprovalUrl = '';
            }
          });
        }
      });
      //       (error) => {
      //   this.userNmae.nativeElement.focus();
      //   // tslint:disable-next-line:no-string-literal
      //   this.errorMessage = error.error['login_failure'];
      //   this.loginform.value.password = this.password;
      //   if (error.error.logInAttemptCount !== undefined) {
      //     this.logInAttemptCount = +error.error.logInAttemptCount[0];
      //     if (this.logInAttemptCount === 5) {
      //       this.showMaxAtmpt();
      //     }
      //   }
      // }
    }
    getUserData(resp: any) {
      this.userData.teamLeadFlag = resp.teamLeadFlag;
      this.userData.subTeamLeadFlag = resp.subTeamLeadFlag;
      this.userData.clientId = resp.clientId;
      this.userData.workFlowLookupId = resp.workFlowLookupId;
      this.userData.deptId = resp.deptId;
      this.userData.deptName = resp.deptName;
      this.userData.teamId = resp.teamId;
      this.userData.subTeamId = resp.subTeamId;
      this.userData.teamName = resp.teamName;
      this.userData.subTeamName = resp.subTeamName;
      this.userData.team = resp.team;
      this.userData.subTeam =  resp.subTeam;
      this.userData.infoceptUser=resp.infoceptUser;
    }
    logout() {
      if (this.auth.dashboardFlag === true) {
        this.router.navigate(['/dashboard/home']);
      } else {
        const home = JSON.parse(sessionStorage.getItem('user_data') as string);
        this.auth.LogOut(home.userId, home.logId).subscribe(res => {
          if (res.success) {
            sessionStorage.removeItem('user_data');
            sessionStorage.clear();
            this.router.navigate(['/']);
            this.shared.clientApprovalUrl = '';
            this.common.insuffCountFlag = false;
            this.common.caseFlag = false;
            this.common.VeCountFlag = false;
            this.common.qcCountFlag = false;
            this.notification.notificationCount = 0;
          }
        }, err => { }, () => { });
      }
    }
    ngOnDestroy() {
      this.auth.dashboardFlag = false;
    }
  }
