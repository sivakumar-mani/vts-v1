import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CanactivateGuard } from './canactivate.guard';
import { CommonService } from '../services/common.service';

const MOCK_COMMON = {
  screenName: '',
  ALERT: 'ALERT',
};

describe('CanactivateGuard', () => {
  let guard: CanactivateGuard;
  let router: Router;
  let dialog: MatDialog;
  let common: any;

  const route: any = { data: {} };
  const state = (url: string): any => ({ url });

  const withAuth = (extra: object = {}) =>
    JSON.stringify({ auth_token: 'valid-token', userId: 1, ...extra });

  const withRoles = (roles: object[]) =>
    JSON.stringify(roles);

  const homeRole = {
    routingUrl: '/dashboard/home',
    screenName: 'Home',
    addFlag: true,
    editFlag: true,
    deleteFlag: true,
    viewFlag: true,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatDialogModule],
      providers: [
        CanactivateGuard,
        { provide: CommonService, useValue: { ...MOCK_COMMON } },
      ],
    });
    guard = TestBed.inject(CanactivateGuard);
    router = TestBed.inject(Router);
    dialog = TestBed.inject(MatDialog);
    common = TestBed.inject(CommonService);
  });

  afterEach(() => sessionStorage.clear());

  // ── creation ──────────────────────────────────────────────────────────────

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  // ── no user_data in sessionStorage ────────────────────────────────────────

  describe('when sessionStorage has no user_data', () => {
    it('returns false', () => {
      expect(guard.canActivate(route, state('/dashboard/home'))).toBe(false);
    });

    it('removes user_data and clears session', () => {
      sessionStorage.setItem('user_roles', 'something');
      guard.canActivate(route, state('/dashboard/home'));
      expect(sessionStorage.getItem('user_data')).toBeNull();
      expect(sessionStorage.getItem('user_roles')).toBeNull();
    });

    it('navigates to /login (known bug: called twice when user_data is null)', () => {
      const spy = spyOn(router, 'navigate');
      guard.canActivate(route, state('/dashboard/home'));
      // Guard calls router.navigate(['/login']) twice — documented double-navigate bug
      expect(spy).toHaveBeenCalledWith(['/login']);
      expect(spy).toHaveBeenCalledTimes(2);
    });
  });

  // ── user_data present but no auth_token ───────────────────────────────────

  describe('when user_data has no auth_token', () => {
    beforeEach(() => sessionStorage.setItem('user_data', JSON.stringify({ userId: 1 })));

    it('returns false', () => {
      expect(guard.canActivate(route, state('/dashboard/home'))).toBe(false);
    });

    it('clears session and navigates to /login exactly once', () => {
      const spy = spyOn(router, 'navigate');
      guard.canActivate(route, state('/dashboard/home'));
      expect(spy).toHaveBeenCalledWith(['/login']);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(sessionStorage.getItem('user_data')).toBeNull();
    });
  });

  // ── authenticated: route matches user_roles ──────────────────────────────

  describe('when auth_token is present and route is in user_roles', () => {
    beforeEach(() => {
      sessionStorage.setItem('user_data', withAuth());
      sessionStorage.setItem('user_roles', withRoles([homeRole]));
    });

    it('returns true when at least one flag is set', () => {
      expect(guard.canActivate(route, state('/dashboard/home'))).toBe(true);
    });

    it('sets common.screenName from the matching role', () => {
      guard.canActivate(route, state('/dashboard/home'));
      expect(common.screenName).toBe('Home');
    });

    it('returns true with only viewFlag=true', () => {
      sessionStorage.setItem('user_roles', withRoles([{
        routingUrl: '/dashboard/reports',
        screenName: 'Reports',
        addFlag: false, editFlag: false, deleteFlag: false, viewFlag: true,
      }]));
      expect(guard.canActivate(route, state('/dashboard/reports'))).toBe(true);
    });

    it('returns false when all flags are false', () => {
      sessionStorage.setItem('user_roles', withRoles([{
        routingUrl: '/dashboard/home',
        screenName: 'Home',
        addFlag: false, editFlag: false, deleteFlag: false, viewFlag: false,
      }]));
      expect(guard.canActivate(route, state('/dashboard/home'))).toBe(false);
    });
  });

  // ── authenticated: route NOT in user_roles ────────────────────────────────

  describe('when auth_token is present but route is not in user_roles', () => {
    beforeEach(() => {
      sessionStorage.setItem('user_data', withAuth());
      sessionStorage.setItem('user_roles', withRoles([homeRole]));
    });

    it('returns false', () => {
      expect(guard.canActivate(route, state('/dashboard/master/sitelist'))).toBe(false);
    });

    it('opens CommonAlertsComponent dialog', () => {
      const spy = spyOn(dialog, 'open').and.callThrough();
      guard.canActivate(route, state('/dashboard/master/sitelist'));
      expect(spy).toHaveBeenCalled();
    });

    it('does NOT navigate to /login', () => {
      const spy = spyOn(router, 'navigate');
      guard.canActivate(route, state('/dashboard/master/sitelist'));
      expect(spy).not.toHaveBeenCalled();
    });
  });

  // ── null user_roles ───────────────────────────────────────────────────────

  describe('when user_roles is absent', () => {
    beforeEach(() => {
      sessionStorage.setItem('user_data', withAuth());
      sessionStorage.removeItem('user_roles');
    });

    it('returns false and opens dialog (filterdata=null branch)', () => {
      const spy = spyOn(dialog, 'open').and.callThrough();
      const result = guard.canActivate(route, state('/dashboard/home'));
      expect(result).toBe(false);
      expect(spy).toHaveBeenCalled();
    });
  });

  // ── openDialog ────────────────────────────────────────────────────────────

  describe('openDialog', () => {
    it('opens dialog with Authorization header text', () => {
      const spy = spyOn(dialog, 'open').and.callThrough();
      guard.openDialog();
      const args: any = spy.calls.mostRecent().args;
      expect(args[1].data.headerText).toBe('Authorization');
    });

    it('includes "don\'t have permission" in dialog bodyText', () => {
      const spy = spyOn(dialog, 'open').and.callThrough();
      guard.openDialog();
      const args: any = spy.calls.mostRecent().args;
      expect(args[1].data.bodyText).toContain("don't have permission");
    });

    it('opens at 320px width with disableClose=false', () => {
      const spy = spyOn(dialog, 'open').and.callThrough();
      guard.openDialog();
      const args: any = spy.calls.mostRecent().args;
      expect(args[1].width).toBe('320px');
      expect(args[1].disableClose).toBe(false);
    });
  });
});
