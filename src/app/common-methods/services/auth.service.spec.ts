import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthService } from './auth.service';

const MOCK_CONFIG = {
  apiUrl: 'http://localhost:62414/api/',
  invoiceapiUrl: 'http://localhost:5003/api/',
  expressUrl: 'http://localhost:62414',
  documentUrl: 'http://localhost:62414/VtsDocument',
  redirectUri: 'http://localhost:4200/auth-callback',
  pdfType: '1',
  ocrRoutes: { scan: '/ocr/scan', extract: '/ocr/extract' },
  acheck: 1,
  candidate: 3,
};

const ALL_ROLES = [
  {
    routingUrl: '/dashboard/home',
    screenName: 'Home',
    moduleName: 'Dashboard',
    subModuleName: '',
    addFlag: true,
    editFlag: true,
    deleteFlag: true,
    viewFlag: true,
    fullAccessFlag: false,
    approveFlag: false,
    moduleId: 1,
    subModuleId: 0,
    screenId: 1,
  },
  {
    routingUrl: '/dashboard/reports',
    screenName: 'Reports',
    moduleName: 'Reports',
    subModuleName: '',
    addFlag: false,
    editFlag: false,
    deleteFlag: false,
    viewFlag: true,
    fullAccessFlag: false,
    approveFlag: false,
    moduleId: 2,
    subModuleId: 0,
    screenId: 5,
  },
];

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    service.config = { ...MOCK_CONFIG };
  });

  afterEach(() => {
    sessionStorage.clear();
    httpMock.verify();
  });

  // ── creation ──────────────────────────────────────────────────────────────

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ── getConfig ─────────────────────────────────────────────────────────────

  describe('getConfig', () => {
    it('returns the value for a known key', () => {
      expect(service.getConfig('apiUrl')).toBe('http://localhost:62414/api/');
      expect(service.getConfig('expressUrl')).toBe('http://localhost:62414');
    });

    it('returns undefined for an unknown key', () => {
      expect(service.getConfig('unknownKey' as any)).toBeUndefined();
    });
  });

  // ── getApiUrl ─────────────────────────────────────────────────────────────

  describe('getApiUrl', () => {
    it('prepends expressUrl when path starts with /', () => {
      expect(service.getApiUrl('/health')).toBe('http://localhost:62414/health');
      expect(service.getApiUrl('/signalr/hub')).toBe('http://localhost:62414/signalr/hub');
    });

    it('prepends invoiceapiUrl when path starts with Invoice/', () => {
      expect(service.getApiUrl('Invoice/GetList')).toBe('http://localhost:5003/api/Invoice/GetList');
      expect(service.getApiUrl('Invoice/Save')).toBe('http://localhost:5003/api/Invoice/Save');
    });

    it('passes through absolute http URLs unchanged', () => {
      expect(service.getApiUrl('http://external.com/data')).toBe('http://external.com/data');
    });

    it('passes through absolute https URLs unchanged', () => {
      expect(service.getApiUrl('https://secure.com/data')).toBe('https://secure.com/data');
    });

    it('prepends apiUrl for all other relative paths', () => {
      expect(service.getApiUrl('Login/login')).toBe('http://localhost:62414/api/Login/login');
      expect(service.getApiUrl('User/GetList')).toBe('http://localhost:62414/api/User/GetList');
      expect(service.getApiUrl('Auth/ForgetPassword')).toBe('http://localhost:62414/api/Auth/ForgetPassword');
    });

    it('returns documentUrl-prefixed paths unchanged', () => {
      const docPath = 'http://localhost:62414/VtsDocument/file.pdf';
      expect(service.getApiUrl(docPath)).toBe(docPath);
    });
  });

  // ── getOCRRoute ───────────────────────────────────────────────────────────

  describe('getOCRRoute', () => {
    it('returns the route for a known key', () => {
      service.ocrRoutes = { scan: '/ocr/scan', extract: '/ocr/extract' };
      expect(service.getOCRRoute('scan')).toBe('/ocr/scan');
      expect(service.getOCRRoute('extract')).toBe('/ocr/extract');
    });

    it('returns undefined for an unknown key when ocrRoutes is set', () => {
      service.ocrRoutes = { scan: '/ocr/scan' };
      expect(service.getOCRRoute('nonexistent')).toBeUndefined();
    });

    it('throws when ocrRoutes is undefined — known bug: config.json missing ocrRoutes key', () => {
      service.ocrRoutes = undefined as any;
      expect(() => service.getOCRRoute('scan')).toThrow();
    });
  });

  // ── getpdfType ────────────────────────────────────────────────────────────

  describe('getpdfType', () => {
    it('returns undefined on an unset key when pdfType is default empty object', () => {
      expect(service.getpdfType('anything')).toBeUndefined();
    });

    it('returns value when pdfType is set to full config object (bug: load() assigns full config)', () => {
      // load() runs: promise.then(res => this.pdfType = res)
      // so pdfType becomes the full config — getpdfType('pdfType') returns the scalar '1'
      service.pdfType = { ...MOCK_CONFIG } as any;
      expect(service.getpdfType('pdfType')).toBe('1');
      expect(service.getpdfType('apiUrl')).toBe('http://localhost:62414/api/');
    });

    it('does NOT return the intended pdfType scalar when accessed via its proper key', () => {
      // Demonstrates the bug: the correct value is MOCK_CONFIG.pdfType = '1',
      // but after load() the entire config is assigned; there is no pdfType['0'] index.
      service.pdfType = { ...MOCK_CONFIG } as any;
      expect(service.getpdfType('0')).toBeUndefined(); // not the string '1'
    });
  });

  // ── getScreenAuth ─────────────────────────────────────────────────────────

  describe('getScreenAuth', () => {
    it('returns matching screen auth for a known route URL', () => {
      sessionStorage.setItem('user_roles', JSON.stringify(ALL_ROLES));
      const auth = service.getScreenAuth('/dashboard/home');
      expect(auth.screenName).toBe('Home');
      expect(auth.addFlag).toBe(true);
      expect(auth.viewFlag).toBe(true);
    });

    it('returns unAuthorized zeroed object when route URL not in user_roles', () => {
      sessionStorage.setItem('user_roles', JSON.stringify(ALL_ROLES));
      const auth = service.getScreenAuth('/dashboard/master/sitelist');
      expect(auth.addFlag).toBe(false);
      expect(auth.viewFlag).toBe(false);
      expect(auth.screenId).toBe(0);
      expect(auth.screenName).toBeNull();
    });

    it('returns unAuthorized object when user_roles is absent from sessionStorage', () => {
      sessionStorage.removeItem('user_roles');
      const auth = service.getScreenAuth('/dashboard/home');
      expect(auth.addFlag).toBe(false);
      expect(auth.moduleId).toBe(0);
    });

    it('returns view-only auth for /dashboard/reports', () => {
      sessionStorage.setItem('user_roles', JSON.stringify(ALL_ROLES));
      const auth = service.getScreenAuth('/dashboard/reports');
      expect(auth.screenName).toBe('Reports');
      expect(auth.viewFlag).toBe(true);
      expect(auth.addFlag).toBe(false);
    });
  });

  // ── loadSessionData ───────────────────────────────────────────────────────

  describe('loadSessionData', () => {
    it('populates userdata from sessionStorage user_data', () => {
      const userData = { userId: 42, firstName: 'Test', auth_token: 'token-abc' };
      sessionStorage.setItem('user_data', JSON.stringify(userData));
      service.loadSessionData();
      expect(service.userdata.userId).toBe(42);
      expect(service.userdata.firstName).toBe('Test');
    });

    it('leaves userdata as empty object when user_data is absent', () => {
      service.userdata = {};
      service.loadSessionData();
      expect(service.userdata).toEqual({});
    });

    it('reads languageId from sessionStorage', () => {
      sessionStorage.setItem('languageId', '2');
      service.loadSessionData();
      expect(service.languageId).toBe(2);
    });

    it('keeps default languageId (1) when languageId is absent from sessionStorage', () => {
      service.languageId = 1;
      service.loadSessionData();
      expect(service.languageId).toBe(1);
    });
  });

  // ── load ──────────────────────────────────────────────────────────────────

  describe('load', () => {
    it('GETs ./config.json and stores result in this.config', fakeAsync(() => {
      let resolved = false;
      service.load().then(() => (resolved = true));

      // The method issues at least one config.json request
      const reqs = httpMock.match('./config.json');
      expect(reqs.length).toBeGreaterThanOrEqual(1);
      reqs.forEach(r => r.flush(MOCK_CONFIG));
      tick();

      expect(service.config).toEqual(MOCK_CONFIG);
      expect(resolved).toBeTrue();
    }));

    it('assigns ocrRoutes from config', fakeAsync(() => {
      service.load();
      const reqs = httpMock.match('./config.json');
      reqs.forEach(r => r.flush(MOCK_CONFIG));
      tick();

      expect(service.ocrRoutes).toEqual(MOCK_CONFIG.ocrRoutes);
    }));

    it('known bug: pdfType is set to full config object instead of config["pdfType"]', fakeAsync(() => {
      service.load();
      const reqs = httpMock.match('./config.json');
      reqs.forEach(r => r.flush(MOCK_CONFIG));
      tick();

      // Bug: `promise.then(res => this.pdfType = res)` assigns the full config
      expect(service.pdfType).toEqual(MOCK_CONFIG);  // NOT just '1'
    }));
  });

  // ── login ─────────────────────────────────────────────────────────────────

  describe('login', () => {
    it('POSTs to Login/login with the supplied credentials', () => {
      const creds = { username: 'test@example.com', password: 'enc-pass', applicationId: 1 };
      let response: any;
      service.login(creds as any).subscribe(r => (response = r));

      const req = httpMock.expectOne('http://localhost:62414/api/Login/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(creds);
      req.flush({ auth_token: 'jwt-abc', userId: 1, active: true });

      expect(response.auth_token).toBe('jwt-abc');
    });

    it('propagates HTTP errors via catchError', () => {
      let errorResult: any;
      service.login({ username: 'bad' } as any).subscribe({
        error: err => (errorResult = err),
      });

      const req = httpMock.expectOne('http://localhost:62414/api/Login/login');
      req.flush({ errorMessage: 'Invalid credentials' }, { status: 400, statusText: 'Bad Request' });

      expect(errorResult).toBeTruthy();
    });
  });

  // ── LogOut ────────────────────────────────────────────────────────────────

  describe('LogOut', () => {
    beforeEach(() => {
      service.userdata = { logId: 99 };
    });

    it('POSTs to Login/LogOut with correct userId and logId query params', () => {
      service.LogOut(5, 99).subscribe();

      const req = httpMock.expectOne(r => r.url.includes('Login/LogOut'));
      expect(req.request.method).toBe('POST');
      expect(req.request.url).toContain('userId=5');
      expect(req.request.url).toContain('logId=99');
      req.flush({ success: true });
    });
  });

  // ── GetUserRolePermission ─────────────────────────────────────────────────

  describe('GetUserRolePermission', () => {
    it('GETs with all required query params', () => {
      service.GetUserRolePermission(1, 1, 2, 3, 4).subscribe();

      const req = httpMock.expectOne(r => r.url.includes('GetUserRolePermission'));
      expect(req.request.url).toContain('userId=1');
      expect(req.request.url).toContain('applicationId=1');
      expect(req.request.url).toContain('deptId=2');
      expect(req.request.url).toContain('subTeamId=3');
      expect(req.request.url).toContain('teamId=4');
      req.flush([]);
    });

    it('coerces null deptId to 0', () => {
      service.GetUserRolePermission(1, 1, null as any, 0, 0).subscribe();

      const req = httpMock.expectOne(r => r.url.includes('GetUserRolePermission'));
      expect(req.request.url).toContain('deptId=0');
      req.flush([]);
    });
  });

  // ── forgetPassword ────────────────────────────────────────────────────────

  describe('forgetPassword', () => {
    it('POSTs to Auth/ForgetPassword with correct query params', () => {
      service.forgetPassword('user@example.com', 1).subscribe();

      const req = httpMock.expectOne(r => r.url.includes('ForgetPassword'));
      expect(req.request.method).toBe('POST');
      expect(req.request.url).toContain('userNameOrMailId=user%40example.com');
      expect(req.request.url).toContain('applicationId=1');
      req.flush({ success: true });
    });
  });

  // ── GetUserTeamDetails ────────────────────────────────────────────────────

  describe('GetUserTeamDetails', () => {
    it('GETs with userId and deptId params', () => {
      service.GetUserTeamDetails(10, 2).subscribe();

      const req = httpMock.expectOne(r => r.url.includes('GetUserTeamDetails'));
      expect(req.request.url).toContain('userId=10');
      expect(req.request.url).toContain('deptId=2');
      req.flush({ teamId: 3, subTeamId: 0 });
    });
  });

  // ── CheckUserName ─────────────────────────────────────────────────────────

  describe('CheckUserName', () => {
    it('GETs with userName query param', () => {
      service.CheckUserName('testuser').subscribe();

      const req = httpMock.expectOne(r => r.url.includes('CheckUserName'));
      expect(req.request.url).toContain('userName=testuser');
      req.flush({ exists: false });
    });
  });

  // ── handleError (static) ──────────────────────────────────────────────────

  describe('handleError', () => {
    it('wraps the error in an observable that errors', (done) => {
      AuthService.handleError('test-error').subscribe({
        error: (err) => {
          expect(err).toBe('test-error');
          done();
        },
      });
    });

    it('uses "Server error" fallback when error is falsy', (done) => {
      AuthService.handleError(null).subscribe({
        error: (err) => {
          expect(err).toBe('Server error');
          done();
        },
      });
    });
  });
});
