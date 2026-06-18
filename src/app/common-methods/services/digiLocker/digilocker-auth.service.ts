import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { PKCEService } from './pkce.service';
import { ScreeningService } from '../screening.service';
import { AuthService } from '../auth.service';
import { Console } from 'console';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DigilockerAuthService {
    // private clientId = ''; // replace with your client ID
    //private redirectUri = 'http://localhost:62414/api/DigiLockerCallback';//'http://localhost:4200/auth-callback';
    private redirectUri: string;
    private authEndpoint = 'https://digilocker.meripehchaan.gov.in/public/oauth2/1/authorize';
    private tokenEndpoint = 'https://digilocker.meripehchaan.gov.in/public/oauth2/1/token';
    codeVerifier: any;
    codeChallenge: any;
    clientId: string;

    constructor(private http: HttpClient, private router: Router, private pkceService: PKCEService, public screeningDetails: ScreeningService, private authService: AuthService) {
        this.redirectUri = this.authService.getConfig('redirectUri');
    }
    async proceedVerification(candidateId: number) {
        // this.getCodeChallengeV1();
        try {
            await this.getClientId();
            // const result = this.GetPkceCode();
            this.GetPkceCode().subscribe(resp => {
                if (resp) {
                    console.log(resp);
                    this.codeVerifier = resp.item1;
                    this.codeChallenge = resp.item2;
                    let stateValue = candidateId + "$CAND$" + this.codeVerifier;
                    const authUrl = `${this.authEndpoint}?response_type=code&client_id=${this.clientId}&state=${stateValue}&redirect_uri=${encodeURIComponent(this.redirectUri)}&code_challenge=${this.codeChallenge}&code_challenge_method=S256&scope=openid`;
                    console.log(authUrl);
                    window.location.href = authUrl;
                }
            });
            console.log('Code Verifier:', this.codeVerifier);
            console.log('Code Challenge:', this.codeChallenge);
        } catch (error) {
            console.error('An error occurred:', error);
        }
        //this.openUrl(authUrl);
    }
    async login() {
        await this.getCodeChallenge();
        await this.getClientId();
        // const authUrl = `${this.authEndpoint}?response_type=code&client_id=${this.clientId}&redirect_uri=${encodeURIComponent(this.redirectUri)}&state=oidc_flow&code_challenge_method=S256`;
        // const authUrl = `${this.authEndpoint}?response_type=code&client_id=${this.clientId}&redirect_uri=${encodeURIComponent(this.redirectUri)}&state=${this.codeVerifier}&code_challenge=${this.codeChallenge}&code_challenge_method=S256&dl_flow=signin`;
        let stateValue = this.screeningDetails.candidateId + "$CAND$" + this.codeVerifier;
        const authUrl = `${this.authEndpoint}?response_type=code&client_id=${this.clientId}&state=${stateValue}&redirect_uri=${encodeURIComponent(this.redirectUri)}&code_challenge=${this.codeChallenge}&code_challenge_method=S256&scope=openid`;
        console.log(authUrl);
        this.openUrl(authUrl);

    }

    private async getClientId() {
        try {
            const response = await this.authService.getDigilockerClientId().toPromise();
            this.clientId = response; // Assuming response contains the client ID directly
            console.log('Client ID:', this.clientId);
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }


    // : Observable<any>
    GetCallBack(code, state) {
        const dataUrl = 'DigiLockerCallback?code=' + code + '&state=' + state;
        return this.http.get<any>(dataUrl);
    }
    private GetPkceCode() {
        const dataUrl = 'Verification/GetPkceCode';
        return this.http.get<any>(dataUrl);
    }
    private async getCodeChallenge() {
        try {
            const { codeVerifier, codeChallenge } = await this.pkceService.generatePKCE();
            this.codeVerifier = codeVerifier;
            this.codeChallenge = codeChallenge;
            console.log('Code Verifier:', this.codeVerifier);
            console.log('Code Challenge:', this.codeChallenge);
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }

    private getCodeChallengeV1() {
        try {
            // const result = this.GetPkceCode();
            this.GetPkceCode().subscribe(resp => {
                if (resp) {
                    console.log(resp);
                    this.codeVerifier = resp.item1;
                    this.codeChallenge = resp.item2;
                }
            });
            console.log('Code Verifier:', this.codeVerifier);
            console.log('Code Challenge:', this.codeChallenge);
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }

    openUrl(authUrl: string) {
        // window.open(authUrl, '_blank'); // Open in a new tab or window
        window.open(authUrl, '_blank', 'width=750,height=800,noopener,noreferrer,resizable,scrollbars');
    }
    // Open a URL in a new window with specific parameters
    openUrlInNewWindow(url: string) {
        // Open URL in a new window/tab with specific options
        window.open(url, '_blank', 'width=800,height=600,noopener,noreferrer');
    }
    async handleAuthCallback(code: string, codeVerifierReq: string) {
        console.log('handleAuthCallback: ' + this.codeVerifier)
        console.log('handleAuthCallbackReq: ' + codeVerifierReq)
        await this.getClientId();
        const body = new HttpParams()
            .set('grant_type', 'authorization_code')
            .set('code', code)
            .set('redirect_uri', this.redirectUri)
            .set('client_id', this.clientId)
            .set('code_verifier', codeVerifierReq); // Replace with actual code verifier

        return this.http.post(this.tokenEndpoint, body.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    }
}
