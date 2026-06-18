import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ElementRef,
  SecurityContext,
} from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { AuthService } from '../common-methods/services/auth.service';
import { Router } from '@angular/router';
import { SharedService } from '../common-methods/services/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { CaptchaComponentComponent } from '../common-methods/components/captcha-component/captcha-component.component';
import { CommonService } from '../common-methods/services/common.service';
import { MessageService } from 'primeng/api';
import { CountdownComponent } from 'ngx-countdown';
import { EncryptDecryptService } from '../common-methods/services/encrypt-decrypt.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonAlertsComponent } from '../common-methods/common-alerts/common-alerts.component';
import { ScreeningService } from '../common-methods/services/screening.service';
@Component({
  standalone: false,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  CanidateVerifiyotpId: any;
 @ViewChild('userNmae', { static: true }) userNmae!: ElementRef;

  hide = true;
  loginform!: UntypedFormGroup;
  ForgetPwForm!: UntypedFormGroup;
  OtpSendPwForm!: UntypedFormGroup;
  errorMessage!: string;
  otpError!: string;
  mobileNo: any;
  iscapsOn = false;
  tempcapson = false;
  userdata: any;
  userType!: 'A-CHECK' | 'CANDIDATE' | 'CLIENT' | 'EMPTY';
  imagePath = '';
  otpResend = false
  @ViewChild('forgetConfirmation', { static: true }) forgetConfirmation!: TemplateRef<any>;
  @ViewChild('OtpVerification', { static: true }) OtpVerification!: TemplateRef<any>;
  @ViewChild('forgetMail', { static: true }) forgetMail!: TemplateRef<any>;
  // @ViewChild('CaptchaComponent', { static: true })
  // CaptchaComponent!: CaptchaComponentComponent;
  @ViewChild('CaptchaComponent')
CaptchaComponent!: CaptchaComponentComponent;
  @ViewChild('countDown')
  private countdown!: CountdownComponent;
  errormsg!: string;
  headerText = '';
  bodyText = '';
  userflag: any;
  candidateVerify: any
  ApplicationId = 1;
  isCaptchaValid = false;
  password!: string
  display: any;
  forgotpass!: boolean;
  config!: Object;

  constructor(
    private authService: AuthService,
    private router: Router,
    private shared: SharedService,
    private message: MessageService,
    public screeningService: ScreeningService,
    // tslint:disable-next-line: align
    public dialog: MatDialog,
    private common: CommonService,
    private encrypDecrypt: EncryptDecryptService,
    public sanitizer: DomSanitizer
  ) {

  }
  logInAttemptCount!: number;

  ngOnInit() {
    // this.Leavermethod()
    this.getLocation()
    this.userNmae?.nativeElement?.focus();
    this.userType = sessionStorage.getItem('userType') as any;
    if (this.userType === 'A-CHECK') {
      this.imagePath = 'assets/images/log-acheck.png';
      this.ApplicationId = 1;
    } else if (this.userType === 'CANDIDATE') {
      this.imagePath = 'assets/images/log-stud.png';
      this.ApplicationId = 3;
    } else if (this.userType === 'CLIENT') {
      this.imagePath = 'assets/images/log-client.png';
      this.ApplicationId = 2;
    }
    sessionStorage.clear();
    sessionStorage.setItem('userType', this.userType);
    this.initializeformGroup();
  }

  initializeformGroup() {

    this.loginform = new UntypedFormGroup({
      username: new UntypedFormControl(
        this.ApplicationId === 3 || this.ApplicationId === 2 ? this.common.userName : '',
        Validators.required
      ),
      password: new UntypedFormControl(
        this.ApplicationId === 3 || this.ApplicationId === 2 ? this.common.password : '',
        Validators.required
      ),
      exitOtherLogin: new UntypedFormControl(false),
      applicationId: new UntypedFormControl(this.ApplicationId),
      latitude: new UntypedFormControl(''),
      longitude: new UntypedFormControl(''),
      browserVersion: new UntypedFormControl('')
    });
    this.ForgetPwForm = new UntypedFormGroup({
      userNameOrMailId: new UntypedFormControl('', Validators.required),
    });
    this.OtpSendPwForm = new UntypedFormGroup({
      Candidateotp: new UntypedFormControl('', [
        Validators.minLength(6),
        Validators.required,
        Validators.pattern(/^[- 0-9]+$/),
      ]),
      mobileNo: new UntypedFormControl(''),
    });
  }
  onLoginSubmit(): void {
    this.loginform.controls.username.setValue(this.sanitizer.bypassSecurityTrustHtml(this.loginform.controls.username.value));
    this.loginform.controls.username.setValue(this.loginform.controls.username.value.changingThisBreaksApplicationSecurity);
    this.loginform.controls.password.setValue(this.sanitizer.sanitize(SecurityContext.HTML, this.loginform.controls.password.value));
    // if (this.userType === 'CANDIDATE') {
    this.CaptchaComponent.validateCaptcha();
    if (!this.isCaptchaValid) {
      //this.loginform.value.password = password;
      return;
    }
    else {
      this.password = this.loginform.value.password.trim();
      // this.user = this.loginform.value.password.replace(/\s/g, '')
      const encryptPassword = this.encrypDecrypt.encryptData(this.password);
      this.loginform.value.password = encryptPassword;
    }
    // }
    this.authService.login(this.loginform.value).subscribe(
      (resp) => {
        if (resp) {
          this.candidateVerify = resp;
          if (this.candidateVerify.haveOldSession === true) {
            this.openAlreadyLoggedInPopup();
          } else {
            this.finalLogin(resp);
          }
        }
      },
      (error) => {
        this.userNmae?.nativeElement?.focus();
        // tslint:disable-next-line:no-string-literal
        this.errorMessage = error.error['errorMessage'];
        this.loginform.value.password = this.password;
        if (error.error.logInAttemptCount !== undefined) {
          this.logInAttemptCount = +error.error.logInAttemptCount[0];
          if (this.logInAttemptCount === 5) {
            this.showMaxAtmpt();
          }
        }
      }
    );
  }
  getConfig(key: string): number {
    // return this.authService.config[key];
    return (this.authService.config as any)[key];
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

        // ----common otp enabled - 24-07-2025 start-----

        // if (this.ApplicationId === 2 && this.userdata.clientName === 'Altimetrik India Private Limited') {
        //   this.authService.GetUserRolePermission(this.userdata.userId, this.userdata.applicationId, this.userdata.deptId, this.userdata.subTeamId, this.userdata.teamId).subscribe((res) => {
        //     if (res) {
        //       sessionStorage.setItem('user_roles', JSON.stringify(res));
        //       this.router.navigate(['/dashboard/home']);
        //       this.shared.clientApprovalUrl = '';
        //     }
        //   });
        // }
        // else {
        //   sessionStorage.removeItem('user_data');
        //   this.onMailOtpVerfication();
        // }

        if (this.ApplicationId === 2 && this.userdata.clientName !== null && (this.userdata.clientName === 'Altimetrik India Private Limited' || this.userdata.clientName.includes('Ryan International'))) {
          this.authService.GetUserRolePermission(this.userdata.userId, this.userdata.applicationId, this.userdata.deptId, this.userdata.subTeamId, this.userdata.teamId).subscribe((res) => {
            if (res) {
              sessionStorage.setItem('user_roles', JSON.stringify(res));
              this.router.navigate(['/dashboard/home']);
              this.shared.clientApprovalUrl = '';
            }
          });
        } else if (this.ApplicationId === this.getConfig('candidate')) {
          sessionStorage.removeItem('user_data');
          this.onMailOtpVerfication();
        }
        else {
          if (this.ApplicationId === 1) {
            if (this.userdata.userDepartmentVm && this.userdata.userDepartmentVm.length > 1) {
              this.router.navigate(['/deptChoose']);
            } else {
              if (this.userdata.userDepartmentVm && this.userdata.userDepartmentVm.length === 1) {
                this.userdata.deptId = this.userdata.userDepartmentVm[0].departmentId;
                // sessionStorage.setItem('user_data', JSON.stringify(this.userdata));
              }
              // this.router.navigate(['/dashboard/home']);
              this.loginNew();
            }
          } else {
            sessionStorage.removeItem('user_data');
            this.onMailOtpVerfication();
          }
        }

        // ----common otp enabled end----

        // if (
        //   this.shared.clientApprovalUrl.pathname ===
        //   '/dashboard/client/clientAgreementApproval'
        // )
        //  {
        //   const params = new URLSearchParams(
        //     this.shared.clientApprovalUrl.search
        //   );
        //   const ClientId = params.get('ClientId');
        //   const AgreementId = params.get('AgreementId');
        //   this.router.navigate(
        //     [this.shared.clientApprovalUrl.pathname],
        //     { queryParams: { ClientId, AgreementId } }
        //   );
        // } else {
        //   if (this.ApplicationId === 3) {
        //     // this.onGetMobileno();
        //     // this.router.navigate(['dashboard/screening/india'])
        //     // this.openOtpDialog();
        //     sessionStorage.removeItem("user_data")
        //     this.authService.loadSessionData();

        //   } else {
        //     this.router.navigate(['/dashboard/home']);
        //     // this.router.navigate(['createinvitation']);
        //     // this.router.navigate(['/createinvitation']);
        //   }
        // }
        this.shared.clientApprovalUrl = '';
        // });
      }
    }
  }
  openAlreadyLoggedInPopup() {
    const popupData = {
      action: this.common.OPEN_NAVIGATE,
      id: 0,
      headerText: 'Confirmation',
      bodyText: 'Are you sure, do you want to continue this user account?, if yes already opened account will be closed automatically'
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
          if (action === this.common.OPEN_NAVIGATE) {
            dialogRef.close();
            this.loginform.controls.exitOtherLogin.setValue(true);
            this.onLoginSubmit();
          } else if (action === this.common.OPEN_ANOTHER) {
            dialogRef.close();
            this.router.navigate(['/']);
          }
        }
      });
    }
  }
  loginNew() {
    this.authService.GetUserTeamDetails(this.userdata.userId, this.userdata.deptId).subscribe(resp => {
      if (resp) {
        this.getUserData(resp);
        sessionStorage.setItem('user_data', JSON.stringify(this.userdata));
        this.userdata = JSON.parse(sessionStorage.getItem('user_data') as string);
        this.authService.userdata = this.userdata;
        this.authService.GetUserRolePermission(this.userdata.userId, this.userdata.applicationId, this.userdata.deptId, this.userdata.subTeamId, this.userdata.teamId).subscribe((res) => {
          if (res) {
            sessionStorage.setItem('user_roles', JSON.stringify(res));
            this.router.navigate(['/dashboard/home']);
            this.shared.clientApprovalUrl = '';
          }
          else {
            this.showTopCenter('warn', 'Failure Message', 'This user not assigned to any team');
          }
        });
      }
    });
  }
  getUserData(resp: any) {
    this.userdata.teamLeadFlag = resp.teamLeadFlag;
    this.userdata.subTeamLeadFlag = resp.subTeamLeadFlag;
    this.userdata.clientId = resp.clientId;
    this.userdata.workFlowLookupId = resp.workFlowLookupId;
    this.userdata.deptId = resp.deptId;
    this.userdata.deptName = resp.deptName;
    this.userdata.teamId = resp.teamId;
    this.userdata.subTeamId = resp.subTeamId;
    this.userdata.teamName = resp.teamName;
    this.userdata.subTeamName = resp.subTeamName;
    this.userdata.team = resp.team;
    this.userdata.subTeam = resp.subTeam;
    this.userdata.infoceptUser = resp.infoceptUser;
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
  checkcapsOn(event: any) {
    this.tempcapson = event;
  }
  checkcaps() {
    this.iscapsOn = this.tempcapson;
  }
  blur() {
    this.iscapsOn = false;
  }
  keypressevent(event: KeyboardEvent) {
    this.iscapsOn =
      event.getModifierState && event.getModifierState('CapsLock');
  }
  openForgetPwDialog() {
    this.forgotpass = true;
    this.dialog.open(this.forgetConfirmation, {
      width: '400px',
      disableClose: true,
    });
  }
  dialogClose(forget?: any) {
    this.forgotpass = false;
    this.loginform.value.password = this.password
    this.dialog.closeAll();
    this.OtpSendPwForm.reset();
    // if(forget===true){
    //   this.openForgetPwDialog()
    // }
  }

  sendMail(value: any) {
    value = this.sanitizer.sanitize(SecurityContext.HTML, value);
    if (this.ForgetPwForm.valid) {
      this.authService
        .forgetPassword(value, this.ApplicationId)
        .subscribe((res) => {
          if (res.success) {
            this.dialogClose();
            this.headerText = 'Success';
            this.bodyText =
              'Your new password and further instructions have been sent to your registered e-mail address.';
            this.dialog.open(this.forgetMail, {
              width: '320px',
              disableClose: true,
            });
          } else {
            this.errormsg = 'UserName / Email Address not exists';
          }
        });
    } else {
      this.ForgetPwForm.markAllAsTouched();
    }
  }
  disableError(event: any) {
    this.errormsg = '';
  }
  captchaIsValidS(e: any) {
    this.isCaptchaValid = e;
  }
  // GetMobileNo
  //  onGetMobileno() {
  //   this.authService.GetNumber(this.userflag.userId).subscribe(resn => {
  //     if (resn) {
  //       this.onOtpSend(resn);
  //     } else {
  //       this.showTopCenter('warn', 'Failure Message', 'Mobile Number Not Found');
  //     }
  //   })
  // }
  // SendOTP
  // onOtpSend(mobileNumber: any) {
  //   this.mobileNo = mobileNumber;
  //   // this.OtpSendPwForm.get('mobileNo')?.setValue(mobileNumber);
  //   this.authService.otpSend(this.mobileNo).subscribe(ares => {
  //     if (ares === "success") {
  //       this.ForgetPwForm.reset()
  //       this.openOtpDialog();
  //       this.showTopCenter('success', 'Success Message', 'OTP Send Succssfully');

  //     }
  //   })
  // }
  // Verifiy
  // onVerifyOtp(VerificationCode: any) {
  //     this.authService.otpVerification(this.mobileNo,VerificationCode).subscribe(res => {
  //       if (res === "OTP verified success") {
  //         this.showTopCenter('success', 'Success Message', 'OTP Verfied Succssfully');
  //         this.dialogClose();
  //          this.router.navigate(['dashboard/screening/india']);
  //       } else if (res === "Mobile no. already verified" || res === "OTP expired" || res==="OTP request invalid") {
  //         this.otpError = "OTP Expired OR Invalid Please Resend";
  //       }
  //     });
  //   }

  onMailOtpVerfication() {
    const lastName = this.userflag.lastName == null || this.userflag.lastName == undefined ? "" : this.userflag.lastName
    const UserName = this.userflag.firstName + " " + lastName;
    this.authService
      .mailVerification(this.userflag.userId, this.userflag.emailId, UserName, this.ApplicationId)
      .subscribe((res) => {
        if (res === null || res === 0 || res === undefined) {
          this.showTopCenter('warn', 'Failure Message', 'User Not Found');
        } else {
          this.showTopCenter(
            'success',
            'Success Message',
            'OTP Successfully Send Your Mail'
          );
          this.errorMessage = '';
          this.logInAttemptCount = 0
          this.otpCownDown(1)
          this.openOtpDialog();
        }
      });
  }

  onVerifyMailOtp(otpCode: any) {

    this.authService
      .verifyMailOtp(this.userflag.userId, otpCode)
      .subscribe((res) => {
        if (res != null) {
          if (
            res.canidateVerifiyotpId === null ||
            res.canidateVerifiyotpId === 0 ||
            res.canidateVerifiyotpId === undefined
          ) {
            this.showTopCenter('warn', 'Failure Message', 'Invalid OTP');
          } else {
            this.CanidateVerifiyotpId = res.canidateVerifiyotpId;
            sessionStorage.setItem('user_data', JSON.stringify(this.candidateVerify));
            this.dialogClose();
            this.authService.loadSessionData();
            this.showTopCenter(
              'success',
              'Success Message',
              'OTP Verified Successfully'
            );

            if (
              this.shared.clientApprovalUrl.pathname ===
              '/dashboard/client/clientAgreementApproval'
            ) {
              const params = new URLSearchParams(
                this.shared.clientApprovalUrl.search
              );
              const ClientId = params.get('ClientId');
              const AgreementId = params.get('AgreementId');
              this.router.navigate(
                [this.shared.clientApprovalUrl.pathname],
                { queryParams: { ClientId, AgreementId } }
              );
            }
            else {
              if (this.ApplicationId === 3) {
                this.screeningService.StatusDeFlag = true;
                this.router.navigate(['dashboard/screening/directapp'])
                this.screeningService.currentflag = true;

              }
              else {
                // this.router.navigate(['/dashboard/home']);
                // this.openDeptDialog();
                if (this.ApplicationId === 1) {
                  if (this.userdata.userDepartmentVm && this.userdata.userDepartmentVm.length > 1) {
                    this.router.navigate(['/deptChoose']);
                  } else {
                    // if (this.userdata.userDepartmentVm.length === 1) {
                    //   this.userdata.deptId = this.userdata.userDepartmentVm[0].departmentId;
                    //   sessionStorage.setItem('user_data', JSON.stringify(this.userdata));
                    // }
                    // this.router.navigate(['/dashboard/home']);
                    if (this.userdata.userDepartmentVm && this.userdata.userDepartmentVm.length === 1) {
                      this.userdata.deptId = this.userdata.userDepartmentVm[0].departmentId;
                    }
                    this.loginNew();
                  }
                } else {
                  this.authService.GetUserRolePermission(this.userdata.userId, this.userdata.applicationId, this.userdata.deptId, this.userdata.subTeamId, this.userdata.teamId).subscribe((res) => {
                    if (res) {
                      sessionStorage.setItem('user_roles', JSON.stringify(res));
                      this.router.navigate(['/dashboard/home']);
                      this.shared.clientApprovalUrl = '';
                    }
                  })

                }
              }
            }
            // this.router.navigate(['dashboard/screening/india']);
          }
        } else {
          this.showTopCenter('warn', 'Failure Message', 'Invalid OTP');
        }
      });
  }
  // UpdateMailPassword(){
  //   this.authService.UpdateMailOtp(this.userflag.userId,this.CanidateVerifiyotpId).subscribe(upres=>{
  //     console.log(upres)
  //   })
  // }
  openOtpDialog() {
    this.dialog.open(this.OtpVerification, {
      width: '400px',
      disableClose: true,
    });
  }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }
  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.loginform.get('latitude')?.setValue(position.coords.latitude.toString())
        this.loginform.get('longitude')?.setValue(position.coords.longitude.toString())
        //  this.loginform.get('latitude')?.setValue(position.coords.latitude)
        //  this.loginform.get('longitude')?.setValue(position.coords.longitude)
        // this.loginform.get('browserVersion')?.setValue(this.common.getBrowserVersion())
      });
    }

  }

  otpCownDown(minute?: any) {
    // let minute = 1;
    let seconds: number = minute * 180;
    let textSec: any = "0";
    let statSec: number = 60;

    const prefix = minute < 10 ? "0" : "";

    const timer = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = "0" + statSec;
      } else textSec = statSec;

      this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

      if (seconds == 0) {
        this.otpResend = true
        // console.log("finished");
        clearInterval(timer);
      }
    }, 1000);
  }

  //TestLeaver

  //   Leavermethod(){

  //    const studentDetails = {
  //      CanidateId:'d8d7749f-4c84-4d33-87875-513ebdcb254cf4',
  //       Name: 'Hari',
  //       MobileNumber: '96878458756',
  //       Emailid:'hmani@dssiindia.com',

  //     };
  // this.authService.Leaverapi(studentDetails).subscribe(data=>{

  // })
  //   }
}
