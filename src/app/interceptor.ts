import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AuthService } from './common-methods/services/auth.service';
import { SharedService } from '../app/common-methods/services/shared.service';
import { CommonService } from './common-methods/services/common.service';
import { MessageService } from 'primeng/api';

@Injectable()
export class Interceptor implements HttpInterceptor {
  constructor(private injector: Injector, private sharedService: SharedService, private route: ActivatedRoute,
    private common: CommonService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const message: MessageService = this.injector.get(MessageService);
    const router: Router = this.injector.get(Router);
    const authService: AuthService = this.injector.get(AuthService);
    if (req.url.indexOf('config.json') === -1 && req.url.indexOf('/assets') === -1) {
      const Url: string = authService.getApiUrl(req.url);
      const isDocument: boolean = Url.startsWith(authService.getConfig('documentUrl'));
      const ishttpUrls: boolean = Url.startsWith('http');
      let headers: HttpHeaders = new HttpHeaders();
      if (isDocument) {
        headers = headers.append('Access-Control-Allow-Origin', '*');
        headers = headers.append('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        headers = headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE');
        headers = headers.append('Access-Control-Allow-Header', 'origin, x-requested-with');
      }
      else if (ishttpUrls) {
        headers = headers.append('Access-Control-Allow-Origin', '*');
        headers = headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE');
        headers = headers.append('Access-Control-Allow-Header', 'origin, x-requested-with');
      }
      else {
        headers = headers.append('Access-Control-Allow-Origin', 'XMLHttpRequest');
      }
      // headers = headers.append('Access-Control-Allow-Origin', 'XMLHttpRequest');
      // headers = headers.append('X-Requested-With', 'XMLHttpRequest');
      if ((req.body instanceof FormData) || isDocument) {
        // const parsedata = new FormData();
        // let keyvalue: any;
        // const keys: any[] = [];
        // for (const k of req.body.keys()) {
        //     keys.push(k);
        // }
        // keys.forEach((key, index) => {
        //     const docKey = req.body.getAll(key);
        //     if (docKey[0] !== 'undefined' && docKey[0] !== undefined && !(docKey[0] instanceof File) && docKey[0] !== '') {
        //         // keyvalue = this.common.parseDate(JSON.parse(req.body.getAll(key)));
        //         keyvalue = JSON.parse(req.body.getAll(key));
        //         req.body.delete(key);
        //         req.body.append(key, JSON.stringify(keyvalue));
        //     }
        // });
      } else {
        // if (req.method === 'POST') {
        //     const keys: any[] = [];
        //     const data = JSON.stringify(req.body);
        //     const keyvalue = this.common.parseDate(JSON.parse(data));
        //     req = req.clone({
        //         body: keyvalue,
        //     });
        // }
        headers = headers.append('Content-Type', 'application/json');
        headers = headers.append('Accept', 'application/json');
      }
      const authToken = JSON.parse(sessionStorage.getItem('user_data') as string);
      if (authToken) {
        headers = headers.append('Authorization', `Bearer ${authToken.auth_token}`);
      }
      if (isDocument) {
        req = req.clone({
          url: Url,
          headers,
          responseType: 'arraybuffer' as 'json'
        });
      }
      else {
        req = req.clone({
          url: Url,
          headers
        });
      }
      this.sharedService.emitChangeLoading({
        showLoader: true,
      });
      authService.showLoader = true;
    }
    if (!authService.showLoader) {
      const urlreq = window.location;
      this.sharedService.clientApprovalUrl = JSON.parse(JSON.stringify(urlreq));
    }
    //console.log(`Request: ${req.urlWithParams}`);
    return next.handle(req)
      .pipe(
        tap(
          // Succeeds when there is a response; ignore other events
          (event => {
            if (event instanceof HttpResponse) {
              //console.log(`Response: ${event.status} ${event.statusText}`);
              this.sharedService.emitChangeLoading({
                showLoader: false,
              });
              // if (event.body == null) {
              //     this.sharedService.emitChangeLoading({
              //         showLoader: true,
              //     });
              // }
              // else if (event.body.length >0) {
              //     this.sharedService.emitChangeLoading({
              //         showLoader: false,
              //     });
              // }
              // else if(event.body.success==true||event.body.success==false){
              //     this.sharedService.emitChangeLoading({
              //         showLoader: false,
              //     });
              // }
              // else if(event.body!=null){
              //     this.sharedService.emitChangeLoading({
              //         showLoader: false,
              //     });
              // }
              if (event.status === 200) {
                // tslint:disable-next-line:no-string-literal
                if (event.body['error'] && event.body['errorCode'] && event.body['errorCode'] === 401) {
                  console.log(event);
                  // tslint:disable-next-line:no-string-literal
                  alert(event.body['error']);
                }
              }
            }
            return event;
          }),
          // Operation failed; error is an HttpErrorResponse
          error => {
            this.sharedService.emitChangeLoading({
              showLoader: false,
            });
            if (error instanceof HttpErrorResponse && error.status === 401) {
              router.navigate(['/login']);
            }
            // else if (error.name ==="HttpErrorResponse" && error.statusText==="Unknown Error"){
            //     router.navigate(['/pagemaintance']);
            // }
            else if (error.name === "HttpErrorResponse" && error.status === 403 && error.error.errorMessage === "Session overridden by user") {
              message.add({ severity: 'warn', summary: 'Exist', detail: 'This account is logged in by another user' });
              setTimeout(() => {
                sessionStorage.removeItem('user_data');
                sessionStorage.clear();
                router.navigate(['/']);
              }, 500);
            }
            // else

            // {
            //     router.navigate(['']);
            // }
          },
        ));
  }
}
