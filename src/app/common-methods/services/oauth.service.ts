import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import { JwksValidationHandler } from 'angular-oauth2-oidc-jwks';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
// import { Configuration, PublicClientApplication } from "@azure/msal-browser";
// import { MsalService } from '@azure/msal-angular';

const authConfig: AuthConfig = {
  issuer: 'https://login.microsoftonline.com/aa6efdaa-26e2-4eaa-a2da-91654b9faeda/v2.0',
  redirectUri: window.location.origin +'/ssologin',
   postLogoutRedirectUri: 'http://localhost:4200/login' ,// Where to redirect after logout
  clientId: '9543fbb6-1c13-4cc7-9d46-9051f2cc4526',
  responseType: 'token id_token',
  scope: 'openid profile email',
  showDebugInformation: true,
  strictDiscoveryDocumentValidation: false,
  disableAtHashCheck: true,
};
// export const msalInstance: Configuration = {
//   auth: {
//     clientId: '8b6445da-c213-4e59-bf97-1a9216409d23',
//     authority: 'https://login.microsoftonline.com/156177ee-e0ac-4518-ad35-c4d064ab9a9b',
//     redirectUri: window.location.origin,
//   }
// };
@Injectable({ providedIn: 'root' })
export class AuthConfigService {
  loginform: UntypedFormGroup;
  
  constructor(private oauthService: OAuthService,private route: Router,private authService:AuthService, private http: HttpClient) {

  }
  public configure() {
    this.oauthService.configure(authConfig);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.loadDiscoveryDocumentAndTryLogin({
    customHashFragment: window.location.search // tell it to treat query params as hash
  }).then(() => {
      if (window.location.href.includes('/ssologin')) {
        console.log('if');        
         if (this.oauthService.hasValidAccessToken()) {
          const token = this.oauthService.getAccessToken();
          const claims: any = this.oauthService.getIdentityClaims();
          const ssoLoginEmail = claims.email;
        }
      } else {
        console.log('else');
        if (!this.oauthService.hasValidAccessToken()) {
          const token = this.oauthService.getAccessToken();
          console.log(token);  // Need to remove the log
          this.login();
        }
      }
    });
  }

  
  private handleLoginSuccess(): void {
    const accessToken = this.oauthService.getAccessToken();
    localStorage.setItem('access_token', accessToken);
  }
  login() {
    this.oauthService.initLoginFlow();
  }

  logout() {
    this.oauthService.logOut();
  }

  get accessToken() {
    return this.oauthService.getAccessToken();
  }

  get identityClaims() {
    return this.oauthService.getIdentityClaims();
  }

  get isLoggedIn() {
    return this.oauthService.hasValidAccessToken();
  }
  get isValidToken() {
    return this.oauthService.hasValidIdToken();
  }
}
