import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { LoginComponent } from './login.component';
import { AuthService } from '../common-methods/services/auth.service';
import { SharedService } from '../common-methods/services/shared.service';
import { CommonService } from '../common-methods/services/common.service';
import { MessageService } from 'primeng/api';
import { EncryptDecryptService } from '../common-methods/services/encrypt-decrypt.service';
import { ScreeningService } from '../common-methods/services/screening.service';

// ─── helpers ─────────────────────────────────────────────────────────────────

function buildAuthSpy() {
  const spy = jasmine.createSpyObj<AuthService>('AuthService', [
    'login',
    'loadSessionData',
    'GetUserTeamDetails',
    'GetUserRolePermission',
    'forgetPassword',
    'mailVerification',
    'verifyMailOtp',
  ]);
  (spy as any).config = { apiUrl: 'http://localhost:62414/api/', candidate: 3, acheck: 1 };
  (spy as any).userdata = {};
  return spy;
}

const COMMON_MOCK = {
  userName: '',
  password: '',
  ALERT: 'ALERT',
  OPEN_NAVIGATE: 'OPEN_NAVIGATE',
  OPEN_ANOTHER: 'OPEN_ANOTHER',
};

const SHARED_MOCK = { clientApprovalUrl: '' };

// ─── spec ─────────────────────────────────────────────────────────────────────

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authSpy: jasmine.SpyObj<AuthService>;
  let encryptSpy: jasmine.SpyObj<EncryptDecryptService>;
  let messageSpy: jasmine.SpyObj<MessageService>;
  let router: Router;
  let dialog: MatDialog;

  beforeEach(async () => {
    authSpy = buildAuthSpy();
    encryptSpy = jasmine.createSpyObj('EncryptDecryptService', ['encryptData']);
    messageSpy = jasmine.createSpyObj('MessageService', ['add']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        MatDialogModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: SharedService, useValue: SHARED_MOCK },
        { provide: CommonService, useValue: COMMON_MOCK },
        { provide: MessageService, useValue: messageSpy },
        { provide: EncryptDecryptService, useValue: encryptSpy },
        {
          provide: ScreeningService,
          useValue: { StatusDeFlag: false, currentflag: false },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    router = TestBed.inject(Router);
    dialog = TestBed.inject(MatDialog);
  });

  beforeEach(() => {
    sessionStorage.clear();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    // Mock ViewChild that isn't rendered (NO_ERRORS_SCHEMA skips template)
    (component as any).CaptchaComponent = {
      validateCaptcha: jasmine.createSpy('validateCaptcha'),
    };
    fixture.detectChanges();
  });

  afterEach(() => sessionStorage.clear());

  // ── creation ──────────────────────────────────────────────────────────────

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // ── initializeformGroup ───────────────────────────────────────────────────

  describe('initializeformGroup', () => {
    it('creates loginform with username and password controls', () => {
      expect(component.loginform.get('username')).toBeTruthy();
      expect(component.loginform.get('password')).toBeTruthy();
    });

    it('loginform is invalid when empty', () => {
      expect(component.loginform.valid).toBeFalse();
    });

    it('loginform is valid with both username and password supplied', () => {
      component.loginform.patchValue({ username: 'user@example.com', password: 'Secret@1' });
      expect(component.loginform.valid).toBeTrue();
    });

    it('loginform username is required', () => {
      component.loginform.get('username')?.setValue('');
      expect(component.loginform.get('username')?.errors?.['required']).toBeTrue();
    });

    it('loginform password is required', () => {
      component.loginform.get('password')?.setValue('');
      expect(component.loginform.get('password')?.errors?.['required']).toBeTrue();
    });

    it('creates ForgetPwForm with required userNameOrMailId', () => {
      expect(component.ForgetPwForm.invalid).toBeTrue();
      component.ForgetPwForm.setValue({ userNameOrMailId: 'x@y.com' });
      expect(component.ForgetPwForm.valid).toBeTrue();
    });

    it('OtpSendPwForm rejects non-numeric OTP', () => {
      const ctrl = component.OtpSendPwForm.get('Candidateotp')!;
      ctrl.setValue('abcdef');
      expect(ctrl.errors?.['pattern']).toBeTruthy();
    });

    it('OtpSendPwForm rejects OTP shorter than 6 digits', () => {
      const ctrl = component.OtpSendPwForm.get('Candidateotp')!;
      ctrl.setValue('12345');
      expect(ctrl.errors?.['minlength']).toBeTruthy();
    });

    it('OtpSendPwForm accepts exactly 6 numeric digits', () => {
      const ctrl = component.OtpSendPwForm.get('Candidateotp')!;
      ctrl.setValue('123456');
      expect(ctrl.valid).toBeTrue();
    });
  });

  // ── ngOnInit — userType branch ────────────────────────────────────────────

  describe('ngOnInit — userType routing', () => {
    function reinit(userType: string) {
      sessionStorage.setItem('userType', userType);
      component.ngOnInit();
    }

    it('sets imagePath and ApplicationId=1 for A-CHECK', () => {
      reinit('A-CHECK');
      expect(component.imagePath).toContain('log-acheck');
      expect(component.ApplicationId).toBe(1);
    });

    it('sets imagePath and ApplicationId=3 for CANDIDATE', () => {
      reinit('CANDIDATE');
      expect(component.imagePath).toContain('log-stud');
      expect(component.ApplicationId).toBe(3);
    });

    it('sets imagePath and ApplicationId=2 for CLIENT', () => {
      reinit('CLIENT');
      expect(component.imagePath).toContain('log-client');
      expect(component.ApplicationId).toBe(2);
    });

    it('clears sessionStorage and preserves userType after ngOnInit', () => {
      sessionStorage.setItem('someOtherKey', 'data');
      reinit('A-CHECK');
      expect(sessionStorage.getItem('someOtherKey')).toBeNull();
      expect(sessionStorage.getItem('userType')).toBe('A-CHECK');
    });
  });

  // ── onLoginSubmit ─────────────────────────────────────────────────────────

  describe('onLoginSubmit', () => {
    function fillForm() {
      component.loginform.patchValue({
        username: 'test@example.com',
        password: 'Secret@1',
      });
    }

    it('returns without calling authService.login when captcha is invalid', () => {
      fillForm();
      component.isCaptchaValid = false;
      component.onLoginSubmit();
      expect(authSpy.login).not.toHaveBeenCalled();
    });

    it('calls authService.login when captcha is valid', () => {
      fillForm();
      component.isCaptchaValid = true;
      encryptSpy.encryptData.and.returnValue('enc-pass');
      authSpy.login.and.returnValue(of({
        haveOldSession: false, active: true, loginAttemptExceed: false,
        userDepartmentVm: [], applicationId: 1,
      }));
      authSpy.loadSessionData.and.callFake(() => {
        (authSpy as any).userdata = {
          userId: 1, active: true, applicationId: 1,
          userDepartmentVm: [], deptId: 1, subTeamId: 0, teamId: 1,
        };
      });
      authSpy.GetUserTeamDetails.and.returnValue(of({ deptId: 1, teamId: 1, subTeamId: 0 }));
      authSpy.GetUserRolePermission.and.returnValue(of([]));

      component.onLoginSubmit();

      expect(authSpy.login).toHaveBeenCalled();
    });

    it('sets errorMessage from error.error.errorMessage on login failure', () => {
      fillForm();
      component.isCaptchaValid = true;
      encryptSpy.encryptData.and.returnValue('enc');
      authSpy.login.and.returnValue(
        throwError({ error: { errorMessage: 'Invalid credentials' } }),
      );

      component.onLoginSubmit();

      expect(component.errorMessage).toBe('Invalid credentials');
    });

    it('parses logInAttemptCount and calls showMaxAtmpt at count=5', () => {
      fillForm();
      component.isCaptchaValid = true;
      encryptSpy.encryptData.and.returnValue('enc');
      authSpy.login.and.returnValue(
        throwError({ error: { errorMessage: 'Locked', logInAttemptCount: ['5'] } }),
      );
      const maxSpy = spyOn(component, 'showMaxAtmpt');

      component.onLoginSubmit();

      expect(component.logInAttemptCount).toBe(5);
      expect(maxSpy).toHaveBeenCalled();
    });

    it('opens already-logged-in popup when haveOldSession=true', () => {
      fillForm();
      component.isCaptchaValid = true;
      encryptSpy.encryptData.and.returnValue('enc');
      authSpy.login.and.returnValue(of({ haveOldSession: true }));
      const popupSpy = spyOn(component, 'openAlreadyLoggedInPopup');

      component.onLoginSubmit();

      expect(popupSpy).toHaveBeenCalled();
    });
  });

  // ── finalLogin ────────────────────────────────────────────────────────────

  describe('finalLogin', () => {
    const successResp = {
      auth_token: 'jwt-token',
      loginAttemptExceed: false,
      active: true,
      userDepartmentVm: [{ departmentId: 5 }],
      applicationId: 1,
    };

    beforeEach(() => {
      authSpy.loadSessionData.and.callFake(() => {
        (authSpy as any).userdata = {
          userId: 1,
          active: true,
          applicationId: 1,
          userDepartmentVm: [{ departmentId: 5 }],
          deptId: 5,
          subTeamId: 0,
          teamId: 1,
        };
      });
    });

    it('stores resp in sessionStorage as user_data', () => {
      authSpy.GetUserTeamDetails.and.returnValue(of({ deptId: 5, teamId: 1, subTeamId: 0 }));
      authSpy.GetUserRolePermission.and.returnValue(of([]));

      component.finalLogin(successResp);

      const stored = JSON.parse(sessionStorage.getItem('user_data')!);
      expect(stored.auth_token).toBe('jwt-token');
    });

    it('calls showMaxAtmpt when loginAttemptExceed=true', () => {
      const spy = spyOn(component, 'showMaxAtmpt');
      component.finalLogin({ auth_token: 'tok', loginAttemptExceed: true });
      expect(spy).toHaveBeenCalled();
    });

    it('sets errorMessage and does not navigate when user is inactive', () => {
      authSpy.loadSessionData.and.callFake(() => {
        (authSpy as any).userdata = { active: false, userDepartmentVm: [] };
      });
      const navSpy = spyOn(router, 'navigate');

      component.finalLogin({ auth_token: 'tok', loginAttemptExceed: false });

      expect(component.errorMessage).toContain('Invalid username or password');
      expect(navSpy).not.toHaveBeenCalled();
    });

    it('navigates to /deptChoose when user has multiple departments', () => {
      authSpy.loadSessionData.and.callFake(() => {
        (authSpy as any).userdata = {
          userId: 1, active: true, applicationId: 1,
          userDepartmentVm: [{ departmentId: 1 }, { departmentId: 2 }],
        };
      });
      const navSpy = spyOn(router, 'navigate');

      component.finalLogin(successResp);

      expect(navSpy).toHaveBeenCalledWith(['/deptChoose']);
    });

    it('calls loginNew() for ApplicationId=1 with a single department', () => {
      authSpy.loadSessionData.and.callFake(() => {
        (authSpy as any).userdata = {
          userId: 1, active: true, applicationId: 1,
          userDepartmentVm: [{ departmentId: 5 }],
          deptId: 5, subTeamId: 0, teamId: 1,
        };
      });
      authSpy.GetUserTeamDetails.and.returnValue(of({ deptId: 5, teamId: 1, subTeamId: 0 }));
      authSpy.GetUserRolePermission.and.returnValue(of([]));
      const loginNewSpy = spyOn(component, 'loginNew').and.callThrough();

      component.finalLogin(successResp);

      expect(loginNewSpy).toHaveBeenCalled();
    });
  });

  // ── sendMail ──────────────────────────────────────────────────────────────

  describe('sendMail', () => {
    it('marks ForgetPwForm touched when form is invalid', () => {
      const touchSpy = spyOn(component.ForgetPwForm, 'markAllAsTouched');
      component.sendMail('');
      expect(touchSpy).toHaveBeenCalled();
    });

    it('does NOT call authService when ForgetPwForm is invalid', () => {
      component.sendMail('');
      expect(authSpy.forgetPassword).not.toHaveBeenCalled();
    });

    it('calls authService.forgetPassword when form is valid', () => {
      component.ForgetPwForm.setValue({ userNameOrMailId: 'user@example.com' });
      authSpy.forgetPassword.and.returnValue(of({ success: true }));
      spyOn(component, 'dialogClose');

      component.sendMail('user@example.com');

      expect(authSpy.forgetPassword).toHaveBeenCalled();
    });

    it('shows success dialog when forgetPassword returns success', () => {
      component.ForgetPwForm.setValue({ userNameOrMailId: 'user@example.com' });
      authSpy.forgetPassword.and.returnValue(of({ success: true }));
      const dialogSpy = spyOn(dialog, 'open').and.callThrough();
      spyOn(component, 'dialogClose');

      component.sendMail('user@example.com');

      expect(dialogSpy).toHaveBeenCalled();
    });

    it('sets errormsg when forgetPassword returns success=false', () => {
      component.ForgetPwForm.setValue({ userNameOrMailId: 'bad@example.com' });
      authSpy.forgetPassword.and.returnValue(of({ success: false }));

      component.sendMail('bad@example.com');

      expect(component.errormsg).toBe('UserName / Email Address not exists');
    });
  });

  // ── captchaIsValidS ───────────────────────────────────────────────────────

  describe('captchaIsValidS', () => {
    it('sets isCaptchaValid to true', () => {
      component.isCaptchaValid = false;
      component.captchaIsValidS(true);
      expect(component.isCaptchaValid).toBeTrue();
    });

    it('sets isCaptchaValid to false', () => {
      component.isCaptchaValid = true;
      component.captchaIsValidS(false);
      expect(component.isCaptchaValid).toBeFalse();
    });
  });

  // ── dialogClose ───────────────────────────────────────────────────────────

  describe('dialogClose', () => {
    it('sets forgotpass to false', () => {
      component.forgotpass = true;
      spyOn(dialog, 'closeAll');
      component.dialogClose();
      expect(component.forgotpass).toBeFalse();
    });

    it('calls dialog.closeAll()', () => {
      const closeSpy = spyOn(dialog, 'closeAll');
      component.dialogClose();
      expect(closeSpy).toHaveBeenCalled();
    });

    it('resets OtpSendPwForm', () => {
      component.OtpSendPwForm.patchValue({ Candidateotp: '123456' });
      spyOn(dialog, 'closeAll');
      component.dialogClose();
      expect(component.OtpSendPwForm.get('Candidateotp')?.value).toBeNull();
    });
  });

  // ── disableError ──────────────────────────────────────────────────────────

  describe('disableError', () => {
    it('clears errormsg', () => {
      component.errormsg = 'some error';
      component.disableError({});
      expect(component.errormsg).toBe('');
    });
  });

  // ── CapsLock detection ────────────────────────────────────────────────────

  describe('CapsLock detection', () => {
    it('keypressevent sets iscapsOn when CapsLock modifier is active', () => {
      const event = new KeyboardEvent('keypress', { key: 'A' });
      spyOn(event, 'getModifierState').and.returnValue(true);
      component.keypressevent(event);
      expect(component.iscapsOn).toBeTrue();
    });

    it('keypressevent sets iscapsOn=false when CapsLock is not active', () => {
      const event = new KeyboardEvent('keypress', { key: 'a' });
      spyOn(event, 'getModifierState').and.returnValue(false);
      component.keypressevent(event);
      expect(component.iscapsOn).toBeFalse();
    });

    it('blur sets iscapsOn to false', () => {
      component.iscapsOn = true;
      component.blur();
      expect(component.iscapsOn).toBeFalse();
    });

    it('checkcapsOn stores cap state in tempcapson', () => {
      component.checkcapsOn(true);
      expect(component.tempcapson).toBeTrue();
    });

    it('checkcaps promotes tempcapson into iscapsOn', () => {
      component.tempcapson = true;
      component.checkcaps();
      expect(component.iscapsOn).toBeTrue();
    });
  });

  // ── otpCownDown ───────────────────────────────────────────────────────────

  describe('otpCownDown', () => {
    it('starts countdown display in MM:SS format', fakeAsync(() => {
      component.otpCownDown(1);
      tick(1000);
      expect(component.display).toMatch(/^\d{2}:\d{2}$/);
      // Stop the timer by fast-forwarding all remaining time (1 min * 180 seconds)
      tick(180 * 1000);
    }));

    it('sets otpResend=true when countdown reaches zero', fakeAsync(() => {
      component.otpResend = false;
      component.otpCownDown(1);
      tick(180 * 1000 + 1000);
      expect(component.otpResend).toBeTrue();
    }));
  });

  // ── getUserData ───────────────────────────────────────────────────────────

  describe('getUserData', () => {
    it('merges team data from API response into userdata', () => {
      component.userdata = { userId: 1 } as any;
      const resp = {
        teamLeadFlag: true, subTeamLeadFlag: false, clientId: 5,
        workFlowLookupId: 10, deptId: 2, deptName: 'HR',
        teamId: 3, subTeamId: 0, teamName: 'Screening',
        subTeamName: '', team: 'T', subTeam: '', infoceptUser: false,
      };

      component.getUserData(resp);

      expect(component.userdata.teamLeadFlag).toBeTrue();
      expect(component.userdata.clientId).toBe(5);
      expect(component.userdata.deptName).toBe('HR');
    });
  });

  // ── showMaxAtmpt ──────────────────────────────────────────────────────────

  describe('showMaxAtmpt', () => {
    it('sets headerText and bodyText then opens the forgetMail dialog template', () => {
      const openSpy = spyOn(dialog, 'open').and.callThrough();
      component.showMaxAtmpt();
      expect(component.headerText).toBe('Alert');
      expect(component.bodyText).toContain('maximum number');
      expect(openSpy).toHaveBeenCalled();
    });
  });
});
