import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpResponse,
} from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

import { Interceptor } from './interceptor';
import { AuthService } from './common-methods/services/auth.service';
import { SharedService } from './common-methods/services/shared.service';
import { CommonService } from './common-methods/services/common.service';

// Minimal config used in all URL-rewriting tests
const MOCK_CONFIG = {
  apiUrl: 'http://localhost:62414/api/',
  invoiceapiUrl: 'http://localhost:5003/api/',
  expressUrl: 'http://localhost:62414',
  documentUrl: 'http://localhost:62414/VtsDocument',
  redirectUri: 'http://localhost:4200/auth-callback',
};

describe('Interceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let shared: SharedService;
  let auth: AuthService;
  let router: Router;
  let loadingEmissions: any[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        SharedService,
        AuthService,
        MessageService,
        { provide: CommonService, useValue: {} },
        { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    shared = TestBed.inject(SharedService);
    auth = TestBed.inject(AuthService);
    router = TestBed.inject(Router);

    auth.config = { ...MOCK_CONFIG };
    auth.showLoader = false;

    loadingEmissions = [];
    shared.changeEmittedLoading$.subscribe(e => loadingEmissions.push(e));
  });

  afterEach(() => {
    sessionStorage.clear();
    httpMock.verify();
  });

  // ── bypass paths ──────────────────────────────────────────────────────────

  describe('config.json bypass', () => {
    it('should NOT emit showLoader for config.json requests', () => {
      http.get('./config.json').subscribe();
      httpMock.expectOne('./config.json').flush({});
      expect(loadingEmissions).toEqual([]);
    });

    it('should NOT add Authorization header for config.json', () => {
      sessionStorage.setItem('user_data', JSON.stringify({ auth_token: 'tok' }));
      http.get('./config.json').subscribe();
      const req = httpMock.expectOne('./config.json');
      expect(req.request.headers.has('Authorization')).toBeFalse();
      req.flush({});
    });
  });

  describe('/assets bypass', () => {
    it('should NOT emit showLoader for assets requests', () => {
      http.get('/assets/i18n/en.json').subscribe();
      httpMock.expectOne('/assets/i18n/en.json').flush({});
      expect(loadingEmissions).toEqual([]);
    });
  });

  // ── URL rewriting ─────────────────────────────────────────────────────────

  describe('URL rewriting', () => {
    it('prepends apiUrl for bare relative paths', () => {
      http.get('Login/login').subscribe();
      httpMock.expectOne('http://localhost:62414/api/Login/login').flush({});
    });

    it('prepends invoiceapiUrl for Invoice/ paths', () => {
      http.get('Invoice/GetList').subscribe();
      httpMock.expectOne('http://localhost:5003/api/Invoice/GetList').flush([]);
    });

    it('prepends expressUrl for paths starting with /', () => {
      http.get('/signalr/hub').subscribe();
      httpMock.expectOne('http://localhost:62414/signalr/hub').flush({});
    });

    it('passes absolute http URLs unchanged', () => {
      http.get('http://external.api.com/data').subscribe();
      httpMock.expectOne('http://external.api.com/data').flush({});
    });

    it('passes absolute https URLs unchanged', () => {
      http.get('https://secure.example.com/data').subscribe();
      httpMock.expectOne('https://secure.example.com/data').flush({});
    });

    it('passes documentUrl-prefixed paths unchanged', () => {
      const docUrl = 'http://localhost:62414/VtsDocument/file.docx';
      http.get(docUrl).subscribe();
      httpMock.expectOne(docUrl).flush(new ArrayBuffer(0));
    });
  });

  // ── Authorization header ──────────────────────────────────────────────────

  describe('Authorization header', () => {
    it('attaches Bearer token when user_data is in sessionStorage', () => {
      sessionStorage.setItem('user_data', JSON.stringify({ auth_token: 'my-jwt-123' }));
      http.get('User/GetList').subscribe();
      const req = httpMock.expectOne('http://localhost:62414/api/User/GetList');
      expect(req.request.headers.get('Authorization')).toBe('Bearer my-jwt-123');
      req.flush([]);
    });

    it('does NOT attach Authorization header when no user_data in sessionStorage', () => {
      http.get('User/GetList').subscribe();
      const req = httpMock.expectOne('http://localhost:62414/api/User/GetList');
      expect(req.request.headers.has('Authorization')).toBeFalse();
      req.flush([]);
    });
  });

  // ── Content-Type header ────────────────────────────────────────────────────

  describe('Content-Type header', () => {
    it('sets Content-Type to application/json for regular JSON requests', () => {
      http.post('User/Save', { name: 'Test' }).subscribe();
      const req = httpMock.expectOne('http://localhost:62414/api/User/Save');
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      req.flush({ id: 1 });
    });

    it('does NOT set Content-Type to application/json for FormData requests', () => {
      const form = new FormData();
      form.append('file', new Blob(['data'], { type: 'text/plain' }), 'test.txt');
      http.post('Document/Upload', form).subscribe();
      const req = httpMock.expectOne('http://localhost:62414/api/Document/Upload');
      // FormData branch skips the JSON Content-Type block
      expect(req.request.headers.get('Content-Type')).toBeNull();
      req.flush({ success: true });
    });
  });

  // ── document requests ─────────────────────────────────────────────────────

  describe('document requests (documentUrl prefix)', () => {
    it('sets responseType to arraybuffer', () => {
      const docPath = 'http://localhost:62414/VtsDocument/report.pdf';
      http.get(docPath).subscribe();
      const req = httpMock.expectOne(docPath);
      expect(req.request.responseType).toBe('arraybuffer');
      req.flush(new ArrayBuffer(8));
    });
  });

  // ── spinner lifecycle ──────────────────────────────────────────────────────

  describe('spinner (emitChangeLoading)', () => {
    it('emits showLoader:true on request and showLoader:false on successful response', () => {
      http.get('User/GetList').subscribe();
      const req = httpMock.expectOne('http://localhost:62414/api/User/GetList');

      expect(loadingEmissions[0]).toEqual({ showLoader: true });

      req.flush([]);

      expect(loadingEmissions[1]).toEqual({ showLoader: false });
    });

    it('emits showLoader:false on HTTP error', () => {
      http.get('User/GetList').subscribe({ error: () => {} });
      const req = httpMock.expectOne('http://localhost:62414/api/User/GetList');
      req.error(new ErrorEvent('NetworkError'));
      expect(loadingEmissions).toContain(jasmine.objectContaining({ showLoader: false }));
    });
  });

  // ── error handling ────────────────────────────────────────────────────────

  describe('HTTP error handling', () => {
    it('navigates to /login on 401 HttpErrorResponse', () => {
      const spy = spyOn(router, 'navigate');
      http.get('User/GetList').subscribe({ error: () => {} });
      const req = httpMock.expectOne('http://localhost:62414/api/User/GetList');
      req.flush({ error: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
      expect(spy).toHaveBeenCalledWith(['/login']);
    });

    it('does NOT navigate to /login for 404 errors', () => {
      const spy = spyOn(router, 'navigate');
      http.get('User/GetList').subscribe({ error: () => {} });
      const req = httpMock.expectOne('http://localhost:62414/api/User/GetList');
      req.flush({ error: 'Not Found' }, { status: 404, statusText: 'Not Found' });
      expect(spy).not.toHaveBeenCalled();
    });

    it('does NOT navigate to /login for 500 errors', () => {
      const spy = spyOn(router, 'navigate');
      http.get('User/GetList').subscribe({ error: () => {} });
      const req = httpMock.expectOne('http://localhost:62414/api/User/GetList');
      req.flush({ error: 'Internal Server Error' }, { status: 500, statusText: 'Internal Server Error' });
      expect(spy).not.toHaveBeenCalled();
    });

    it('clears session and navigates to / on 403 "Session overridden" error', (done) => {
      const spy = spyOn(router, 'navigate');
      sessionStorage.setItem('user_data', JSON.stringify({ auth_token: 'tok' }));

      http.get('User/GetList').subscribe({
        error: () => {
          // setTimeout inside the interceptor is 500 ms
          setTimeout(() => {
            expect(sessionStorage.getItem('user_data')).toBeNull();
            expect(spy).toHaveBeenCalledWith(['/']);
            done();
          }, 600);
        },
      });

      const req = httpMock.expectOne('http://localhost:62414/api/User/GetList');
      req.flush(
        { errorMessage: 'Session overridden by user' },
        { status: 403, statusText: 'Forbidden' },
      );
    });
  });

  // ── 200 body with embedded errorCode:401 triggers alert ───────────────────

  describe('200 response with embedded errorCode:401', () => {
    it('calls window.alert when body contains error + errorCode=401 (known raw alert bug)', () => {
      const alertSpy = spyOn(window, 'alert');
      http.get('User/GetList').subscribe();
      const req = httpMock.expectOne('http://localhost:62414/api/User/GetList');
      req.flush({ error: 'Token expired', errorCode: 401 });
      expect(alertSpy).toHaveBeenCalledWith('Token expired');
    });

    it('does NOT call alert when errorCode is not 401', () => {
      const alertSpy = spyOn(window, 'alert');
      http.get('User/GetList').subscribe();
      const req = httpMock.expectOne('http://localhost:62414/api/User/GetList');
      req.flush({ error: 'Something', errorCode: 403 });
      expect(alertSpy).not.toHaveBeenCalled();
    });
  });
});
