import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthConfigService } from 'src/app/common-methods/services/oauth.service';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { SharedService } from 'src/app/common-methods/services/shared.service';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
const authConfig: AuthConfig = {
  issuer: 'https://login.microsoftonline.com/aa6efdaa-26e2-4eaa-a2da-91654b9faeda/v2.0',
  redirectUri: window.location.origin + '/ssologin',
  postLogoutRedirectUri: window.location.origin + '/ssologin',// Where to redirect after logout
  clientId: '9543fbb6-1c13-4cc7-9d46-9051f2cc4526',
  responseType: 'token id_token',
  scope: 'openid profile email',
  showDebugInformation: true,
  strictDiscoveryDocumentValidation: false,
  disableAtHashCheck: true,
  silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',
  useSilentRefresh: true
};
@Component({
  standalone: false,
  selector: 'app-ssologin',
  templateUrl: './ssologin.component.html',
  styleUrls: ['./ssologin.component.css']
})
export class SsologinComponent implements OnInit {  
  ssoEmailId: string;
  userName: string;
  password: string;
  loginform: UntypedFormGroup;
  credentialsVm = new UserCredentialsVm();
  userdata: any;
  userflag: any;
  errorMessage: string;
  ApplicationId = 2;
  headerText = '';
  bodyText = '';
  public dialog: MatDialog;
  @ViewChild('forgetMail', { static: true }) forgetMail!: TemplateRef<any>;

  constructor(private oAuth: AuthConfigService, private shared: SharedService, private router: ActivatedRoute, private route: Router, private oauthService: OAuthService, private authService:AuthService) { }

  ngOnInit() {
    const currentUrl = window.location.href;
    if (currentUrl.includes('/ssologin')) {
      console.log('Navigated to SSO login route', currentUrl);
      //this.oAuth.configure();
      this.oauthService.configure(authConfig);

      this.oauthService.loadDiscoveryDocumentAndTryLogin({
        customHashFragment: window.location.search // tell it to treat query params as hash
      }).then(() => {
        this.oauthService.setupAutomaticSilentRefresh();
        if (this.oauthService.hasValidAccessToken()) {
          const token = this.oauthService.getAccessToken();
          const claims: any = this.oauthService.getIdentityClaims();
          localStorage.setItem('access_token', token);
          this.ssoEmailId = claims.email;
          this.getUserName(this.ssoEmailId);
        } else {
          localStorage.setItem('access_token', null);
          console.log('Silent login failed or no session found.');
          this.oauthService.initLoginFlow(); // Optional: fallback to interactive login
        }
      }).catch(err => {
        console.error('Silent login error:', err);
        localStorage.setItem('access_token', null);
      });
    } else {
      console.log('Not an SSO route');
      //this.router.navigate(['/']);
      this.route.navigate(['/login']);
    }
  }

  getUserName(ssoLoginEmail: any) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.credentialsVm.Latitude = position.coords.latitude.toString();
        this.credentialsVm.Longitude = position.coords.longitude.toString();
      });
    }
    this.credentialsVm.emailId = ssoLoginEmail;
    this.credentialsVm.applicationId = 2;
    this.credentialsVm.browserVersion = "";
    this.credentialsVm.Latitude;
    this.credentialsVm.Longitude;
    this.authService.getUserName(this.credentialsVm).subscribe(
      (resp) => {
          if (resp.registeredUserForSSO === false) {
            window.alert('You are not registered in Krya. Please contact administrator.');
            localStorage.clear();
            this.route.navigate(['/']);
          } else {
            this.finalLogin(resp);
          }
      },
    );
  }
  getConfig(key: string): number {
    return this.authService.config[key];
  }
  showMaxAtmpt() {
    this.headerText = 'Alert';
    this.bodyText =
      'Your account has been locked because you have reached the maximum number' +
      ' ' +
      'invalid of logon attempts. Please forget the password.';
    this.dialog.open(this.forgetMail, {
      width: '320px',
      disableClose: true,
    });
  }
  finalLogin(resp: any) {
    // const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(resp), 'MAKV2SPBNI99212').toString();
    // const bytes = CryptoJS.AES.decrypt(ciphertext, 'MAKV2SPBNI99212');
    // const originalText = bytes.toString(CryptoJS.enc.Utf8);
    //   if(this.ApplicationId!==3){
    sessionStorage.setItem('user_data', JSON.stringify(resp));
    this.userflag = JSON.parse(sessionStorage.getItem('user_data') as string);
    // }
    if (this.userflag.loginAttemptExceed) {
      this.showMaxAtmpt();
    } else {
      this.authService.loadSessionData();
      this.userdata = this.authService.userdata;
      if (!this.userdata.active) {
        this.errorMessage =
          'Invalid username or password. Please verify your information.';
        return;
      } else {
        // this.authService
        //   .GetUserRolePermission(this.userdata.userId, this.ApplicationId)
        //   .subscribe((res) => {
        //     sessionStorage.setItem('user_roles', JSON.stringify(res));

        // if (this.ApplicationId === 3 ||this.ApplicationId===1 ||this.ApplicationId===2) // If need all login otp autheciation enable this code 
        if (this.ApplicationId === this.getConfig('acheck')) // this one directapp otp autheciation
        {
          sessionStorage.removeItem('user_data');
          //this.onMailOtpVerfication();
        }
        else if (this.ApplicationId === this.getConfig('candidate')) {
          sessionStorage.removeItem('user_data');
          //this.onMailOtpVerfication();
        }
        else {
          // this.router.navigate(['/dashboard/home']);
          // this.openDeptDialog();
          if (this.ApplicationId === 1) {
            if (this.userdata.userDepartmentVm && this.userdata.userDepartmentVm.length > 1) {
              this.route.navigate(['/deptChoose']);
            } else {
              if (this.userdata.userDepartmentVm && this.userdata.userDepartmentVm.length === 1) {
                this.userdata.deptId = this.userdata.userDepartmentVm[0].departmentId;
                // sessionStorage.setItem('user_data', JSON.stringify(this.userdata));
              }
              // this.router.navigate(['/dashboard/home']);
              //this.loginNew();
            }
          } else {
            this.authService.GetUserRolePermission(this.userdata.userId, this.userdata.applicationId, this.userdata.deptId,this.userdata.subTeamId,this.userdata.teamId).subscribe((res) => {
              if (res) {
                sessionStorage.setItem('user_roles', JSON.stringify(res));
                this.route.navigate(['/dashboard/home']);
                this.shared.clientApprovalUrl = '';
              }
            });
          }
        }
        
        this.shared.clientApprovalUrl = '';
      }
    }
  }
}
export class UserCredentialsVm {
  emailId: string;
  applicationId: number;
  browserVersion: string;
  Latitude: string;
  Longitude: string;
  RegisteredUserForSSO: boolean;
}
