
import { throwError as observableThrowError, Observable, from } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Login } from '../models/login';
import { ScreenAuth } from '../models/screen-auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // tslint:disable-next-line:ban-types
  config: Object;
  redirectUrl: string;
  userdata: any = {};
  showLoader = false;
  languageId = 1;
  helpData: any;
  vendorId: number;
  statusId: number;
  siteId: 0;
  billingRuleId: number;
  professionalId: number;
  confirmdelete = 'detele';
  employerInstutionId: number;
  employerInstutionAddId: number;
  researchMappingId: number;
  empInsProf: string;
  packClientId: number;
  packPrice: number;
  packTatDays: number;
  packageEffective = false;
  packageId = 0;
  ocrRoutes: { [key: string]: string };
  [key: string]: any;
  addOrEdit: string;
  cancelRuleClientId = 0;
  screenAuth: ScreenAuth;
  changePassword = false;
  manageInvitationObj: any;
  clientId = 0;
  pdfType = {};
  defaultSelectedPackageList: any[] = [];
  registerComps: any;
  paymentDetails: { Paymentid: number, ApiKey: string; amount: number; prefill: { name: string; email: string; contact: string; }; };
  candidateRegisterFormValue: any;
  dashboardFlag = false;
  constructor(private http: HttpClient) { }
  public static handleError(error: any) {
    return observableThrowError(error || 'Server error');
  }

  getApiUrl(apiMethods: string): string {
    if (apiMethods[0] === '/') {
      const baseUrl = this.getConfig('expressUrl');
      return baseUrl + apiMethods;
    }
    else if (apiMethods.startsWith(this.getConfig('documentUrl'))) {
      return apiMethods;
    }
    else if (apiMethods.startsWith('http')) {
      return apiMethods;
    }
    else if (apiMethods.startsWith('Invoice/')) {
      const baseUrl = this.getConfig('invoiceapiUrl');
      return baseUrl + apiMethods;
    }
    else {
      const baseUrl = this.getConfig('apiUrl');
      return baseUrl + apiMethods;
    }
  }
  getOCRRoute(key: string) {
   return this.ocrRoutes[key];
  }
  getConfig(key: string): string {
    return this.config[key];
    // return environment.apiUrl;
  }
  getpdfType(key: string): string {
    return this.pdfType[key];
  }
  GetUserTeamDetails(userId: number, deptId: number): Observable<any> {
    const dataUrl = 'User/GetUserTeamDetails?userId=' + userId + '&deptId=' + deptId;
    return this.http.get<any>(dataUrl);
  }
  public login(login: Login) {
    // const url = 'auth/login';
    const url = 'Login/login';
    return this.http.post(url, login).pipe(
      catchError(AuthService.handleError)
    );
  }
  // Pricing
  GetDefaultClientComponentDetails(): Observable<any> {
    const dataUrl = 'Auth/GetDefaultClientComponentDetails';
    return this.http.get<any>(dataUrl);
  }
  GetDefaultClientPackageDetails(): Observable<any> {
    const dataUrl = 'Auth/GetDefaultClientPackageDetails';
    return this.http.get<any>(dataUrl);
  }
  AddPaymentCandidateDetails(paymentCandidateVm: any): Observable<any> {
    const dataUrl = 'auth/AddPaymentCandidateDetails';
    return this.http.post<any>(dataUrl, paymentCandidateVm);
  }
  CheckUserName(userName: string,): Observable<any> {
    const dataUrl = 'auth/CheckUserName?userName=' + userName;
    return this.http.get<any>(dataUrl);
  }
  DeletePaymentBeforeCandidateCase(userId: number, remarks: string): Observable<any> {
    const dataUrl = 'auth/DeletePaymentBeforeCandidateCase?userId=' + userId + '&remarks=' + remarks;
    return this.http.get<any>(dataUrl);
  }
  //
  GetUserRolePermission(userId: number, applicationId: number, deptId, subTeamId, teamId): Observable<any> {
    deptId = deptId === null ? 0 : deptId;
    const dataUrl = 'User/GetUserRolePermission?userId=' + userId + '&applicationId=' + applicationId + '&deptId=' + deptId + '&subTeamId=' + subTeamId + '&teamId=' + teamId;
    return this.http.get<any>(dataUrl);
  }
  public addChangePassword(password: any): Observable<any> {
    const dataUrl = 'auth/ChangePassword';
    return this.http.post<any>(dataUrl, password);
  }
  public checkPassword(password: any): Observable<any> {
    const dataUrl = 'auth/CheckPassword';
    return this.http.post<any>(dataUrl, password);
  }
  // tslint:disable-next-line:ban-types
  load(): Promise<Object> {
    const promise = this.http.get('./config.json')?.toPromise();
    promise.then(config => this.config = config);

    this.http.get('./config.json')?.toPromise();
    promise.then(res => this.pdfType = res);
    promise.then(config => {
      //this.config = config;
      this.ocrRoutes = config["ocrRoutes"];  
      //this.pdfType = config["pdfType"] || {}; 
    });
    this.loadSessionData();
    return promise;
  }

  loadSessionData(): void {
    if (sessionStorage.getItem('user_data')) {
      this.userdata = JSON.parse(sessionStorage.getItem('user_data') as string);
    }
    if (sessionStorage.getItem('languageId')) {
      this.languageId = JSON.parse(sessionStorage.getItem('languageId'));
    }
  }
  getScreenAuth(routerurl: string): ScreenAuth {
    const unAuthorizatio: ScreenAuth = {
      addFlag: false,
      editFlag: false,
      deleteFlag: false,
      viewFlag: false,
      fullAccessFlag: false,
      approveFlag: false,
      moduleId: 0,
      subModuleId: 0,
      screenId: 0,
      screenName: null,
      moduleName: null,
      subModuleName: null,
    };
    const permissionAvailable = JSON.parse(sessionStorage.getItem('user_roles'));
    if (permissionAvailable) {
      this.screenAuth = permissionAvailable.find(f => f.routingUrl === routerurl);
      if (this.screenAuth) {
        return this.screenAuth;
      } else {
        return unAuthorizatio;
      }
    } else {
      return unAuthorizatio;
    }
  }

  LogOut(userId: number, logId: number): Observable<any> {
    const dataUrl = 'Login/LogOut?userId=' + userId + '&logId=' + this.userdata.logId;
    //const dataUrl = 'Auth/LogOut?userId=' + userId + '&logId=' + this.userdata.logId;
    return this.http.post(dataUrl, userId);
  }
  forgetPassword(data: string, applicationId: number): Observable<any> {
    const dataUrl = 'Auth/ForgetPassword?userNameOrMailId=' + data + '&applicationId=' + applicationId;
    return this.http.post(dataUrl, data);
  }
  resetpassword(userId: number): Observable<any> {
    const dataUrl = 'Auth/ResetPassword?userId=' + userId + '&loggedId=' + this.userdata.userId;
    return this.http.post(dataUrl, userId, this.userdata.userId);
  }
  passwordUnlock(userId: number): Observable<any> {
    const dataUrl = 'User/PasswordUnLock?userId=' + userId + '&loggedId=' + this.userdata.userId;
    return this.http.post(dataUrl, userId, this.userdata.userId);
  }
  public GetNumber(userId): Observable<any> {
    const dataUrl = 'auth/GetCandidateMobileNo?userId=' + userId;
    return this.http.get(dataUrl, userId).pipe(
      catchError(AuthService.handleError)
    );
  }
  public otpSend(MobileNumber): Observable<any> {
    const url = 'auth/SendOtpCandidate?MobileNumber=' + MobileNumber;
    return this.http.get(url).pipe(
      catchError(AuthService.handleError)
    );
  }
  public otpVerification(MobileNumber, OTP): Observable<any> {
    const dataUrl = 'auth/CandiateVerifyOtp?MobileNumber=' + MobileNumber + '&VerificationCode=' + OTP;
    return this.http.get(dataUrl).pipe(
      catchError(AuthService.handleError)
    );
  }

  // public ResendOtp(MobileNumber: Login):Observable<any> {
  //   const url = 'auth/ResendOtp';
  //   return this.http.post(url, MobileNumber).pipe(
  //     catchError(AuthService.handleError)
  //   );
  // }
  public mailVerification(userId, emailId, userName, applicationid): Observable<any> {
    const dataUrl = 'Login/SendMailOtpCandidate?UserId=' + userId + '&MailId=' + emailId + '&UserName=' + userName + '&Applicationid=' + applicationid
    return this.http.post(dataUrl, userId).pipe(
      catchError(AuthService.handleError)
    )
  }
  public verifyMailOtp(userId, Otpid): Observable<any> {
    const dataUrl = 'auth/MailVerifyOtp?UserId=' + userId + '&OtpId=' + Otpid
    return this.http.post(dataUrl, userId).pipe(
      catchError(AuthService.handleError)
    )
  }
  // public UpdateMailOtp(userId,Veriifyid):Observable<any>{
  //   const dataUrl='auth/UpdateMailOtpCandidate?UserId='+userId+'&OtpId='+Veriifyid 
  //   return this.http.post(dataUrl,userId).pipe(
  //     catchError(AuthService.handleError)
  //   )
  // }
  addDigitialAddressVerificaton(addressVerification: any) {
    const dataUrl = 'auth/DigitalAddressVerification';
    return this.http.post<any>(dataUrl, addressVerification);
  }

  //Ajith:- VTS2-2024-CRT-0166 :- create a provisioning to send insufficiencies request raised at Level 1 and Level 2 for Direct App cases directly
  getDirectAppInsuffDetails(ScreeningComid: any) {
    const dataUrl = 'auth/getDirectAppInsuffDetails?screeningCompId=' + ScreeningComid;
    return this.http.get<any>(dataUrl);
  }
  getDigitialAddressverification(ScreeningComid: any) {
    const dataUrl = 'auth/GetDigitalAddress?screeningCompId=' + ScreeningComid;
    return this.http.get<any>(dataUrl);
  }
  getUrlExpiryDate(ScreeningComid: any) {
    const dataUrl = 'auth/GetUrlExpiryDate?screeningCompId=' + ScreeningComid;
    return this.http.get<any>(dataUrl);
  }

  public getDigitialAddressType(): Observable<any> {
    const dataUrl = 'auth/GetDigitalAddressType';
    return this.http.get(dataUrl);
  }
  public Leaverapi(canidatedata: any) {
    const dataUrl = 'auth/leaverCanidate';
    return this.http.post(dataUrl, canidatedata);
  }
  public getLeaverCanidateDetails(clinetid): Observable<any> {
    const dataUrl = 'auth/GetLeaverCandidateDetails?clientId=' + clinetid;
    return this.http.get(dataUrl);
  }
  public AddUpdatePayment(paymentVm): Observable<any> {
    const dataUrl = 'auth/AddUpdatePayment';
    return this.http.post(dataUrl, paymentVm);
  }
  public getPaymentkey(): Observable<any> {
    const dataUrl = 'auth/PaymentIdGet';
    return this.http.get(dataUrl);
  }
  CheckMailid(mailid: string,): Observable<any> {
    const dataUrl = 'auth/CheckMailid?mailid=' + mailid;
    return this.http.get<any>(dataUrl);
  }
  public CheckClientBasedUserEmail(mailid, clientId): Observable<any> {
    const dataUrl = 'auth/CheckClientBasedUserEmail?mailid=' + mailid + '&clientId=' + clientId;
    return this.http.get<any>(dataUrl);
  }
  getDigilockerClientId(): Observable<string> {
    const dataUrl = 'auth/GetDigilockerClientId';
    return this.http.get<any>(dataUrl);
  }
  GetSSOUserDetails(applicationId: number, emailId: string): Observable<any> {
    const dataUrl = 'User/CheckValidEmailIdForSSO?applicationId=' + applicationId + '&emailId=' + emailId;
    return this.http.get<any>(dataUrl);
  }
  getUserName(credentialsVm): Observable<any> {
    const dataUrl = 'auth/GetUserName';
    return this.http.post<any>(dataUrl, credentialsVm);
  }
}
