import { Injectable } from '@angular/core';
import { Observable, Observer, BehaviorSubject, Subject, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CaseCreationView, AssignScreeningOwnerVm, AssignDEView } from '../models/caseCreationView';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { validateBasis } from '@ngbracket/ngx-layout';
import { AutoCompleteDropDown } from '../models/autoComplete';
import { DashboardCountVm } from '../models/login';
import { ScreeningDetails } from '../models/screening-details';
import { SearchVm } from 'src/app/verification/verification-list/verification-list.component';
import { tap } from 'rxjs/operators';
import { CommonService } from './common.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ScreeningService {
  [x: string]: any;
  loaHtml: any;
  loaHtmlDoc: any;
  ladDefaultHtml: any;
  loaStaticFlag: boolean = false;
  screeningId: number = 0;
  formFlag = false;
  defaultAddressId: number;
  indianClientFlag: boolean = false;
  techmCatId = 4;
  IqcByPassFlag: boolean = false;
  enableNAFlag: boolean = false;
  fresherFlag: boolean = false;
  screeningdata: any;
  permnAddress: any;
  tempResetData: any;
  getdataFlag = false;
  currentflag = false;
  compName: any;
  drugKitList: any[] = [];
  degreeList: any;
  Institution: any;
  Dedata: any;
  compId: number;
  npReasonList: any;
  caseSearchFlag = false;
  dob: string;
  basicInfo = false;
  searchObj: any;
  componentList: any[] = [];
  fcomponentList: any[] = [];
  submiscomponentList: any[] = [];
  compFormArray: any;
  StatusDeFlag = false;
  countryList: any[] = [];
  institutionList: any[] = [];
  instituteList: any[] = [];
  newCollegeList: any[] = [];
  userData: any;
  compData: any;
  leveloneflag: boolean;
  srcnCommonData: any;
  screenCaseId = 0;
  screenCaseNo = 0;
  caseSubmissionList: any;
  baseDetail: any;
  private messageSource = new BehaviorSubject('default message');
  currentMessage = this.messageSource.asObservable();
  insuffDocList: any[] = [];
  caseFlag = true;
  caseFlagType = '';
  screeningDetails = new ScreeningDetails();
  employerList: any[] = [];
  employerSupList: any[] = [];
  companyList: any[] = [];
  profNameList: any[] = [];
  addressType: any[] = [];
  addressTypelst: any[] = [];
  EmpaddressTypelst: any[] = [];
  refselfEmployeList: any[] = [];
  vendorList: any[] = [];
  screeningDetail: any;
  addressTypeCheck: any[] = [];
  DatabaseType: any[] = [];
  invitationFlag: boolean = false;
  dAinvitationFlag: boolean = false;
  forResearchByPassFlag: boolean = false;
  // temp List
  tempInstnList: any[] = [];
  tempInstList: any[] = [];
  tempEmpHrCompList: any[] = [];
  tempEmpSupCompList: any[] = [];
  tempEmpHrList: any[] = [];
  tempEmpSupList: any[] = [];
  /////
  assignedflag = false;
  notassignedflag = false;
  loaapprovedflag = false;
  loapendingflag = false;
  countflag = false;
  historyFlag = false;
  preQcflag = false;
  preQcRejectflag = false;
  screeningCompId = 0;
  insuffClear = false;
  docList: any[] = [];
  isVerifiactionMode = false;
  screeningCompIdForVerifiactionMode = 0;
  raiseInsufficiencyScreeningDetails: any[] = [];
  gapVerificationTypeList: any[] = [];
  issuingAuthorityList: any[] = [];
  cvValidateList: any[] = [];
  verificationPage: boolean;
  insuffLevelList: any[] = [];
  insuffDetail: any;
  gapReason: any[] = [];
  caseCountryList: any[] = [];
  caseTypeList: any[] = [];
  dateTypeList: any[] = [];
  clientId: number;
  clientName: string;
  ClientCategoryId: number;
  candidateId:number;
  ctsflag: boolean;
  hide = true;
  flagType = true;
  notApplicableSub = new Subject();
  instypflag = false;
  eduCatflag = false;
  showClientSuspectFlag: boolean;

  enableMutiJcrFlag = false;  
  EnableClientDOJ: boolean;
  directorshipPANMandatory = false;
  
  constructor(private http: HttpClient, public common: CommonService, private auth: AuthService) {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
  }

  public addScreeningDetails(screeningDetails: FormData): Observable<any> {
    const url = 'Screening/InsertScreeningDetails';
    return this.http.post<any>(url, screeningDetails);
  }
  public addNewScreeningDetails(screeningDetails: FormData): Observable<any> {
    const url = 'Screening/AddNewScreeningDetails';
    return this.http.post<any>(url, screeningDetails);
  }
  public addPreQCScreeningDetails(
    screeningDetails: FormData, type: string): Observable<any> {
    const url = 'Screening/InsertPreQCDetails?type=' + type;
    return this.http.post<any>(url, screeningDetails);
  }
  public getScreeningCandidate(): Observable<any> {
    const url = 'Screening/GetScreeningCandidateDetails';
    return this.http.get<any>(url);
  }
  public getCandidateScreeningDetailsByFileNo(FileNo: number): Observable<any> {
    const url = 'Screening/GetCandidateScreeningDetailsByFileNo?FileNo=' + FileNo;
    return this.http.get<any>(url);
  }
  getAgentNames(): Observable<any> {
    const dataUrl = 'Screening/GetAgent';
    return this.http.get<any>(dataUrl);
  }
  public GetCandidateDetailByFileNo(FileNo: number): Observable<any> {
    const url = 'Screening/GetCandidateDetailByFileNo?FileNo=' + FileNo;
    return this.http.get<any>(url);
  }
  // getCasePriorityList() {
  //   const dataUrl = 'Screening/GetCasePriorityList';
  //   return this.http.get<any>(dataUrl);
  // }
  getClientList() {
    const dataUrl = 'Screening/GetClientList';
    return this.http.get<any>(dataUrl);
  }
  getAbroadClientList() {
    const dataUrl = 'Screening/GetAbroadComponentClientList';
    return this.http.get<any>(dataUrl);
  }
  getScreeningStatusList() {
    const dataUrl = 'Screening/GetAbroadComponentScreeningStatusList';
    return this.http.get<any>(dataUrl);
  }
  getScreeningClientDetails(clientId: any) {
    const dataUrl = 'Screening/GetScreeningClientDetails?clientId=' + clientId;
    return this.http.get<any>(dataUrl);
  }
  getScreeningColorCodeDetails(clientId: any) {
    const dataUrl = 'Screening/GetColorCodeList?clientId=' + clientId;
    return this.http.get<any>(dataUrl);
  }
  checkClientScreeningId(clientScreeningId, clientId) {
    const dataUrl = 'Screening/CheckClientScreeningId?clientScreeningId=' + clientScreeningId + '&clientId=' + clientId;
    return this.http.get<any>(dataUrl);
  }
  GetCliectCustomLoa(screeningId, clientId) {
    const dataUrl = 'FileSubmission/GetCliectCustomLoa?screeningId=' + screeningId + '&clientId=' + clientId;
    return this.http.get<any>(dataUrl);
  }
  // Case Creation Methods
  // getClientName(teamName: string, applicationId: number, clientId: string) {
  //   const dataUrl = 'Screening/GetClientName?teamName=' + teamName + '&applicationId='
  //     + applicationId + '&clientId=' + clientId;
  //   return this.http.get<any>(dataUrl);
  // }
  GetCaseHistoryDetails(userData: any) {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    const dataUrl = 'Screening/GetCaseHistoryDetails';
    return this.http.post<any>(dataUrl, userData ,{ observe: 'response' as 'body' });
  }


  GetDirectAppCaseHistoryDetails(userData: any) {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    const teamName = (userData.team === 'Admin Team' || userData.team === 'Super Admin Team') ? userData.team : userData.teamName;
    const dataUrl = 'Master/GetDirectAppCaseHistoryDetails';
    return this.http.post<any>(dataUrl, userData ,{ observe: 'response' as 'body' });
  }
  getClientName(data: any) {
    const dataUrl = 'Case/GetClientName';
    return this.http.post<any>(dataUrl, data);
  }
  getSiteNoByClientId(clientId: any) {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    const dataUrl = 'Case/GetSiteNoByClientId?clientId=' + clientId + '&applicationId=' + this.userData.applicationId + '&userId=' + this.userData.userId;
    return this.http.get<any>(dataUrl);
  }
  getDetailsByClientId(clientId: any) {
    const dataUrl = 'Case/GetDetailsByClientId?clientId=' + clientId;
    return this.http.get<any>(dataUrl);
  }
  getScopeCreationDetails(caseNo: any) {
    const dataUrl = 'Case/GetScopeCreationDetails?caseNo=' + caseNo;
    return this.http.get<any>(dataUrl);
  }
  addCaseCreation(caseDetails: any) {
    const dataUrl = 'Screening/AddCaseCreation';
    return this.http.post<any>(dataUrl, caseDetails);
  }
  AddCaseCreationScope(caseDetails: any) {
    const dataUrl = 'Screening/AddCaseCreationScope';
    return this.http.post<any>(dataUrl, caseDetails);
  }
  UpdateInvitation(caseCreationVm: any) {
    const dataUrl = 'Invitation/UpdateInvitation';
    return this.http.post<any>(dataUrl, caseCreationVm);
  }
  bindCaseCreation(clientId, siteId, applicationId) {
    const dataUrl = 'Case/LoadCaseCreation?clientId=' + clientId + '&siteId=' + siteId + '&applicationId=' + applicationId;
    return this.http.get<any>(dataUrl);
  }
  // getCaseCreationDetails(applicationId: number, teamId: number, userId: number) {
  //   const dataUrl = 'Screening/GetCaseCreationDetails?applicationId=' + applicationId + '&teamId=' + teamId
  //     + '&userId=' + userId;
  //   return this.http.get<any>(dataUrl);
  // }
  getCaseCreationDetails(data: any) {
    const dataUrl = 'Case/GetCaseCreationDetails';
    return this.http.post<any>(dataUrl, data, { observe: 'response' as 'body' });
  }
  getCaseReferenceDetails(caseNo: any) {
    const dataUrl = 'Screening/GetCaseReferenceDetails?caseNo=' + caseNo;
    return this.http.get<any>(dataUrl);
  }
  // Scope Creation
  addScopeCreation(caseDetails: any) {
    const dataUrl = 'Screening/AddScopeCreation';
    return this.http.post<any>(dataUrl, caseDetails);
  }
  searchScope(clientReferenceNo: string, teamName: string) {
    const dataUrl = 'Case/CaseCreationSearch?clientReferenceNo=' + clientReferenceNo + '&teamName=' +
      teamName;
    return this.http.get<any>(dataUrl);
  }

  downloadInfoceptCaseDocument(infoceptCaseDocId: number): Observable<any> {
    const dataUrl = 'Case/DownloadInfoceptCaseDocument?infoceptCaseDocId=' + infoceptCaseDocId;
    return this.http.get<any>(dataUrl);
  }
  getCrtCaseCreationDetails(crtCase: CaseCreationView) {
    const dataUrl = 'Case/GetCaseCreationView';
    return this.http.post<any>(dataUrl, crtCase);
  }
  getScreeningOwner(deptId: string, teamId: number, subTeamName: string) {
    const dataUrl = 'Screening/GetScreeningOwner?deptId=' + deptId + '&teamId=' +
      teamId + '&subTeamName=' + subTeamName;
    return this.http.get<any>(dataUrl);
  }
  getComponentByPackageId(packageId: number) {
    const dataUrl = 'Case/GetComponentByPackageId?packageId=' + packageId;
    return this.http.get<any>(dataUrl);
  }
  getCasePackageComponent(clientId: number, invitationFlag: boolean, siteId: number) {
    const dataUrl = 'Case/GetCasePackageComponent?clientId=' + clientId + '&invitationFlag=' + invitationFlag + '&siteId=' + siteId;
    return this.http.get<any>(dataUrl);
  }
  getClientSubComponent(clientId: number, compId: number) {
    const dataUrl = 'Case/GetClientSubComponent?clientId=' + clientId + '&compId=' + compId;
    return this.http.get<any>(dataUrl);
  }
  assignScreeningOwner(assignScreeningOwner: AssignScreeningOwnerVm) {
    const dataUrl = 'Case/AssignScreeningOwner';
    return this.http.post<any>(dataUrl, assignScreeningOwner);
  }
  GetScopeCaseEditDetails(caseNo: any) {
    const dataUrl = 'Screening/GetScopeCaseEditDetails?caseNo=' + caseNo;
    return this.http.get<any>(dataUrl);
  }
  UpdateScopeCaseDetails(data: any) {
    const dataUrl = 'Screening/UpdateScopeCaseDetails';
    return this.http.post<any>(dataUrl, data);
  }
  scopeHistory(userData: any): Observable<any> {
    const dataUrl = 'Screening/ScopeHistoryByLoggedId';
    return this.http.post<any>(dataUrl, userData, { observe: 'response' as 'body' });
    //return this.http.get<any>(dataUrl,searchVm);
  }
  // getSubmissionHistory(loggedId, flag) {
  //   const dataUrl = 'Screening/GetSubmissionHistory?loggedIn=' + loggedId + '&flag=' + flag;
  //   return this.http.get<any>(dataUrl);
  // }

  getSubmissionHistory(userData: any): Observable<any> {
    const dataUrl = 'Screening/GetSubmissionHistory';
    return this.http.post<any>(dataUrl, userData, { observe: 'response' as 'body' });
  }

  // End
  assignDEPreQCScreeningOwner(assignScreeningOwner: AssignScreeningOwnerVm) {
    const dataUrl = 'Screening/AssignDEPreQCScreeningOwner';
    return this.http.post<any>(dataUrl, assignScreeningOwner);
  }
  // create Invitation email validation - Screening Control
  checkValidEmailId(userId: number, emailId: string): Observable<any> {
    const dataUrl = 'User/CheckValidEmailId?userId=' + userId + '&emailId=' + emailId;
    return this.http.get<any>(dataUrl);
  }
  getInvitationClientName(data: any) {
    const dataUrl = 'Screening/GetInvitationClientName';
    return this.http.post<any>(dataUrl, data);
  }
  GetCaseCreationByCaseNo(caseNo: number) {
    const dataUrl = 'Case/GetCaseCreationByCaseNo?caseNo=' + caseNo;
    return this.http.get<any>(dataUrl);
  }
  CaseCreationDelete(caseNo: number, loggedId) {
    const dataUrl = 'Case/CaseCreationDelete?caseNo=' + caseNo + '&loggedId=' + loggedId;
    return this.http.get<any>(dataUrl);
  }
  CheckApplicantId(applicantId: string, clientId) {
    const dataUrl = 'Case/CheckApplicantId?applicantId=' + applicantId + '&clientId=' + clientId;
    return this.http.get<any>(dataUrl);
  }
  CheckClientRef(clientRef: string, clientId) {
    const dataUrl = 'Case/CheckClientRef?clientRef=' + clientRef + '&clientId=' + clientId;
    return this.http.get<any>(dataUrl);
  }
  GetLOAStatus(userId: number) {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    const dataUrl = 'Case/GetLOAStatus?userId=' + userId + '&tName=' + this.userData.teamName;
    return this.http.get<any>(dataUrl);
  }
  public getDocumentDetail(docId: number): Observable<any> {
    const dataUrl = 'Case/GetDocumentDetails?docId=' + docId;
    return this.http.get(dataUrl);
  }
  AddLOACreation(caseLOA: any) {
    const dataUrl = 'Case/AddLOACreation';
    return this.http.post<any>(dataUrl, caseLOA);
  }
  RejectLOACreation(loaStatusVm: any) {
    const dataUrl = 'Case/RejectLOACreation';
    return this.http.post<any>(dataUrl, loaStatusVm);
  }
  CheckReferenceNo(clientReferenceNo: string, clientId: number) {
    const dataUrl = 'Case/CheckReferenceNo?clientReferenceNo=' + clientReferenceNo + '&clientId=' + clientId;
    return this.http.get<any>(dataUrl);
  }
  CheckChargeCode(chargeCode: string, clientId: number) {
    const dataUrl = 'Case/CheckChargeCode?chargeCode=' + chargeCode + '&clientId=' + clientId;
    return this.http.get<any>(dataUrl);
  }
  getDashboardCount(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoard/GetDashboardCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  GetGraphCount(loginUserDetVm, method) {
    const dataUrl = 'Dashboard/' + method;
    return this.http.post<any>(dataUrl, loginUserDetVm);
  }
  getVerificationCompletedHistory(loginUserDetVm: any) {
    const dataUrl = 'DashBoard/GetVerificationCompletedHistory';
    return this.http.post<any>(dataUrl, loginUserDetVm, { observe: 'response' as 'body' });
  }

  GetCaseClosedByVEOwner(loginUserDetVm: any) {
    const dataUrl = 'DropDown/GetCaseClosedByVEOwner';
    if(this.common.ScreeningOwnerDDList.length > 0){
      return of (this.common.ScreeningOwnerDDList)
    }
   return this.http.post<any[]>(dataUrl, loginUserDetVm).pipe(
      tap((data) => {
        this.common.ScreeningOwnerDDList = data; // Cache the data
      })
    );
  }

  GetVerificationCompletedHistoryV1(loginUserDetVm: any) {
    const dataUrl = 'DashBoard/GetVerificationCompletedHistoryV1';
    return this.http.post<any>(dataUrl, loginUserDetVm, { observe: 'response' as 'body' });
  }

  // GetCaseCreationDetailsCount() {
  //   const dataUrl = 'Screening/GetCaseCreationDetailsCount';
  //   return this.http.get<any>(dataUrl);
  // }
  // GetScopeCreationDetailsCount() {
  //   const dataUrl = 'Screening/GetScopeCreationDetailsCount';
  //   return this.http.get<any>(dataUrl);
  // }
  getScreeningCaseDetails(caseNo: number, loggedIn: number, applicationId: number) {
    const dataUrl = 'Screening/GetScreeningCaseDetails?caseNo=' + caseNo + '&loggedIn=' + loggedIn + '&applicationId=' + applicationId;
    return this.http.get<any>(dataUrl);
  }
  getScreeningCompDetails(caseNo: number, loggedIn: number, compId: number, applicationId: number) {
    const dataUrl = 'Screening/GetScreeningCompDetails?caseNo=' + caseNo + '&loggedIn=' + loggedIn + '&compId=' + compId + '&applicationId=' + applicationId;
    return this.http.get<any>(dataUrl);
  }
  DownloadSupportingDocument(DocId: any) {
    const dataUrl = 'Screening/DownloadSupportingDocument?DocId=' + DocId;
    return this.http.get<any>(dataUrl);
  }
  getScreeningComponentDetails(userId: number) {
    const dataUrl = 'Screening/GetScreeningComponentDetails?userId=' + userId;
    return this.http.get<any>(dataUrl);
  }
  getAssignedCaseDetails(assignDE: AssignDEView) {
    const dataUrl = 'Case/GetAssignedCaseDetails';
    return this.http.post<any>(dataUrl, assignDE, { observe: 'response' as 'body' });
  }
  insertUpdateInvitation(invitation: any) {
    const dataUrl = 'Screening/insertUpdateInvitation';
    return this.http.post<any>(dataUrl, invitation);
  }
  getInvitationList() {
    const dataUrl = 'Screening/getInvitationList';
    return this.http.get<any>(dataUrl);
  }
  GetPendingStatusCount(userId: number) {
    const dataUrl = 'Screening/GetPendingStatusCount?userId=' + userId;
    return this.http.get<any>(dataUrl);
  }
  async SendCaseCreationMail(data: any) {
    const dataUrl = 'Screening/SendCaseCreationMail';
    return this.http.post<any>(dataUrl, data).toPromise();
  }
  screeningComponentStatusDetails(compId, depId, applicantId): Observable<any> {
    const dataUrl = 'Screening/GetScreeningComponentStatusDetails?compId=' + compId + '&depId=' + depId + '&applicationId=' + applicantId;
    return this.http.get<any>(dataUrl);
  }
  screeningStatusDetails(applicantId): Observable<any> {
    const dataUrl = 'Screening/GetScreeninStatusDetails?applicationId=' + applicantId;
    return this.http.get<any>(dataUrl);
  }
  getScreeningComponentEntryDetails(screeningCompId, loggedIn): Observable<any> {
    const dataUrl = 'Screening/GetScreeningComponentEntryDetails?screeningCompId=' + screeningCompId + '&loggedIn=' + loggedIn;
    return this.http.get<any>(dataUrl);
  }
  deleteScreeningComponent(screeningCompId, userId): Observable<any> {
    const dataUrl = 'Screening/DeleteScreeningComponent?screeningCompId=' + screeningCompId + '&loggedIn=' + userId;
    return this.http.get<any>(dataUrl);
  }
  GetInvitationExpiryDays(): Observable<any> {
    const dataUrl = 'Screening/getInvitationExpiryDays';
    return this.http.get<any>(dataUrl);
  }
  getExpiryDateLst(): Observable<any> {
    const dataUrl = 'Invitation/GetInvitationLookUp';
    return this.http.get<any>(dataUrl);
  }
  getCreateInvitationData(applicationId: number, teamId: number, userId: number): Observable<any> {
    const dataUrl = 'Invitation/GetCreateInvitationDetail?applicationId=' + applicationId + '&teamId=' + teamId
      + '&userId=' + userId;
    return this.http.get<any>(dataUrl);
  }
  GetInvitationByInvitationId(invitationId: any) {
    const dataUrl = 'Invitation/GetInvitationByInvitationId?invitationId=' + invitationId;
    return this.http.get<any>(dataUrl);
  }
  GetInvitationComponent(invitationId: any) {
    const dataUrl = 'Invitation/GetInvitationComponent?invitationId=' + invitationId;
    return this.http.get<any>(dataUrl);
  }
  getManageInvitationData(invitationDetailsVm): Observable<any> {
    const dataUrl = 'Invitation/GetInvitationDetail';
    return this.http.post<any>(dataUrl, invitationDetailsVm, { observe: 'response' as 'body' });
  }
  bulkInvitationResend(invitationStatusVm: any) {
    const dataUrl = 'Invitation/BulkInvitationResend';
    return this.http.post<any>(dataUrl, invitationStatusVm);
  }
  bulkInvitationopen(invitationStatusVm: any) {
    const dataUrl = 'Invitation/BulkInvitationReOpen';
    return this.http.post<any>(dataUrl, invitationStatusVm);
  }
  bulkInvitationReject(invitationStatusVm: any) {
    const dataUrl = 'Invitation/BulkInvitationStatusUpdate';
    return this.http.post<any>(dataUrl, invitationStatusVm);
  }
  getPackageAndComponentList(clientId, invitationFlag): Observable<any> {
    const dataUrl = 'Case/GetCasePackageComponent?clientId=' + clientId + '&invitationFlag' + invitationFlag + 'siteId= 0';
    return this.http.get<any>(dataUrl);
  }
  getComponentListByPackage(packageId: any) {
    const dataUrl = 'Case/GetComponentByPackageId?packageId=' + packageId;
    return this.http.get<any>(dataUrl);
  }
  getSubComponentList(clientId, compId): Observable<any> {
    const dataUrl = 'Case/GetClientSubComponent?clientId=' + clientId + '&compId=' + compId;
    return this.http.get<any>(dataUrl);
  }
  createInvitation(invitation: any) {
    const dataUrl = 'Screening/CreateInvitation';
    return this.http.post<any>(dataUrl, invitation);
  }
  getManageInviteView(invitationId): Observable<any> {
    const dataUrl = 'Invitation/InvitationView?invitationId=' + invitationId;
    return this.http.get<any>(dataUrl);
  }
  resentInvitation(invitationId, loggedId): Observable<any> {
    const dataUrl = 'Invitation/ResendInvitation?invitationId=' + invitationId + '&loggedId=' + loggedId;
    return this.http.get<any>(dataUrl);
  }
  cancelInvitation(invitationId, loggedId) {
    const dataUrl = 'Invitation/InvitationDelete?invitationId=' + invitationId + '&loggedId=' + loggedId;
    return this.http.get<any>(dataUrl);
  }
  getUserCaseScreeningDetails(userId): Observable<any> {
    const dataUrl = 'Screening/GetUserCaseScreeningDetails?userId=' + userId;
    return this.http.get<any>(dataUrl);
  }
  getScreeningEntryDetails(screeningCompId): Observable<any> {
    const dataUrl = 'Screening/GetScreeningEntryDetails?screeningCompId=' + screeningCompId;
    return this.http.get<any>(dataUrl);
  }
  // GetClearedDocList(insufficiencyId: number): Observable<any> {
  //   const dataUrl = 'Screening/GetClearedDocList?insufficiencyId=' + insufficiencyId;
  //   return this.http.get<any>(dataUrl);
  // }
  GetClearedDocList(insufficiencyId: number): Observable<any> {
    const dataUrl = 'Insufficiency/GetClearedDocList?insufficiencyId=' + insufficiencyId;
    return this.http.get<any>(dataUrl);
  }
  // getInsuffDetails(search: boolean): Observable<any> {
  //   const dataUrl = 'Screening/GetInsuffDetail?search=' + search;
  //   return this.http.get<any>(dataUrl);
  // }
  getInsuffDetails(search: boolean): Observable<any> {
    const dataUrl = 'Insufficiency/GetInsuffDetail?search=' + search;
    return this.http.get<any>(dataUrl);
  }
  getScreeningDocumentType(): Observable<any> {
    const dataUrl = 'Screening/GetScreeningDocumentType';
    return this.http.get<any>(dataUrl);
  }
  getMaritlStatus(): Observable<any> {
    const dataUrl = 'Screening/GetMaritalStatus';
    return this.http.get<any>(dataUrl);
  }
  getUniversity(): Observable<any> {
    const dataUrl = 'Screening/GetUniversity';
    return this.http.get<any>(dataUrl);
  }

  downloadEmpResearchDocument(ResearchDocTransId: number): Observable<any> {
    const dataUrl = 'Research/DownloadEmplResearchDocument?ResearchDocTransId=' + ResearchDocTransId;
    return this.http.get<any>(dataUrl);
  }
  downloadInstResearchDocument(ResearchDocTransId: number): Observable<any> {
    const dataUrl = 'Research/DownloadInstResearchDocument?ResearchDocTransId=' + ResearchDocTransId;
    return this.http.get<any>(dataUrl);
  }
  //Ajith:- VTS2-2024-CRT-0166 :- create a provisioning to send insufficiencies request raised at Level 1 and Level 2 for Direct App cases directly
  AddClearDirectAppClearInsuff(clearInsufficiencyValue: FormData) {
    const dataUrl = 'Insufficiency/DirectAppClearInsuff';
    return this.http.post<any>(dataUrl, clearInsufficiencyValue);
  }
  deleteResearchDocumentById(researchDocId, empFlag, logginId): Observable<any> {
    const dataUrl = 'Research/DeleteResearchDocumentById?researchDocId=' + researchDocId
      + '&empFlag=' + empFlag + '&logginId=' + logginId;
    return this.http.get<any>(dataUrl);
  }
  //VTS2-2024-EMP-0203 - FR Consolidated Document- by santhanalakshmi
  deleteResearchConsolidateDocument(empDocId, logginId): Observable<any> {
    const dataUrl = 'Research/DeleteResearchConsolidateDocument?empDocId=' + empDocId + '&logginId=' + logginId;
    return this.http.get<any>(dataUrl);
  }
  downloadScreeningDocument(ScreeningDocId: number): Observable<any> {
    const dataUrl = 'Screening/DownloadScreeningDocument?ScreeningDocId=' + ScreeningDocId;
    return this.http.get<any>(dataUrl);
  }
  //VTS2-2024-EMP-0203 - FR Consolidated Document- by santhanalakshmi
  downloadFrConDocument(ScreeningDocId: number): Observable<any> {
    const dataUrl = 'Screening/DownloadFrConDocument?ScreeningDocId=' + ScreeningDocId;
    return this.http.get<any>(dataUrl);
  }
  downloaDigiLockerDocument(digilockerDocumentId: number): Observable<any> {
    const dataUrl = 'Screening/DownloaDigiLockerDocument?digilockerDocumentId=' + digilockerDocumentId;
    return this.http.get<any>(dataUrl);
  }
  downloadDocument(countryId: number): Observable<any> {
    const dataUrl = 'User/DownLoad?countryId=' + countryId;
    return this.http.get<any>(dataUrl);
  }
  DownloadGapReasonDocument(gapReasonDocId: number): Observable<any> {
    const dataUrl = 'Screening/DownloadGapReasonDocument?gapReasonDocId=' + gapReasonDocId;
    return this.http.get<any>(dataUrl);
  }
  addInsuffDocument(insuffList: any) {
    const dataUrl = 'Screening/AddInsuffDocument';
    return this.http.post<any>(dataUrl, insuffList);
  }
  public getEducationTypeDetails(): Observable<any> {
    const dataUrl = 'Master/GetEducationTypeDetails';
    return this.http.get<any>(dataUrl);
  }
  getInsuffDocument(compId: number): Observable<any> {
    const dataUrl = 'Screening/GetInsuffDocument?compId=' + compId;
    return this.http.get<any>(dataUrl);
  }
  // tslint:disable-next-line:max-line-length
  // getInsuffSearch(clFlag: boolean, statusLookupId: number, levelLookupId: number, userId: number, teamName: any, InsuffStatus: any, loginUserDetVm: any): Observable<any> {
  //   // tslint:disable-next-line:max-line-length
  //   statusLookupId = statusLookupId === null ? 0 : statusLookupId; levelLookupId = levelLookupId === null ? 0 : levelLookupId;
  //   const dataUrl = 'Screening/getInsuffSearch?clFlag=' + clFlag + '&statusLookupId=' + statusLookupId
  //     + '&levelLookupId=' + levelLookupId + '&userId=' + userId + '&teamName=' + teamName + '&InsuffStatus=' + InsuffStatus;
  //   return this.http.post<any>(dataUrl, loginUserDetVm, { observe: 'response' as 'body' });
  // }

  // tslint:disable-next-line:max-line-length
  getInsuffSearch(clFlag: boolean, statusLookupId: number, levelLookupId: number, userId: number, teamName: any, InsuffStatus: any, loginUserDetVm: any): Observable<any> {
    // tslint:disable-next-line:max-line-length
    statusLookupId = statusLookupId === null ? 0 : statusLookupId; levelLookupId = levelLookupId === null ? 0 : levelLookupId;
    const dataUrl = 'Insufficiency/GetInsuffSearch?clFlag=' + clFlag + '&statusLookupId=' + statusLookupId
      + '&levelLookupId=' + levelLookupId + '&userId=' + userId + '&teamName=' + teamName + '&InsuffStatus=' + InsuffStatus;
    return this.http.post<any>(dataUrl, loginUserDetVm, { observe: 'response' as 'body' });
  }
  GetInsuffDocument(compId: number): Observable<any> {
    const dataUrl = 'Screening/GetInsuffDocument?compId=' + compId;
    return this.http.get<any>(dataUrl);
  }
  AddInsufficiency(insufficiency: any): Observable<any> {
    const dataUrl = 'Screening/AddInsufficiency';
    return this.http.post<any>(dataUrl, insufficiency);
  }
  // GetDetailsForAutomationInsuff(loginUserDetVm: any): Observable<any> {
  //   const dataUrl = 'Screening/GetDetailsForAutomationInsuff';
  //   return this.http.post<any>(dataUrl, loginUserDetVm);
  // }
  GetDetailsForAutomationInsuff(loginUserDetVm: any): Observable<any> {
    const dataUrl = 'Insufficiency/GetDetailsForAutomationInsuff';
    return this.http.post<any>(dataUrl, loginUserDetVm, { observe: 'response' as 'body' });
  }
  AddInsuffDocument(insufficiencyDoc: any): Observable<any> {
    const dataUrl = 'Screening/AddInsuffDocument';
    return this.http.post<any>(dataUrl, insufficiencyDoc);
  }
  AddRaiseInsufficiency(insufficiencyValue: any) {
    const dataUrl = 'Screening/AddRaiseInsufficiency';
    return this.http.post<any>(dataUrl, insufficiencyValue);
  }

  // AddClearInsufficiency(clearInsufficiencyValue: FormData) {
  //   const dataUrl = 'Screening/ClearInsuff';
  //   return this.http.post<any>(dataUrl, clearInsufficiencyValue);
  // }
  AddClearInsufficiency(clearInsufficiencyValue: FormData) {
    const dataUrl = 'Insufficiency/ClearInsuff';
    return this.http.post<any>(dataUrl, clearInsufficiencyValue);
  }
  CancelInsufficiency(insuffId, userId) {
    const dataUrl = 'Screening/CancelInsufficiency?insuffId=' + insuffId + '&userId=' + userId;
    return this.http.post<any>(dataUrl, null);
  }

  getStatus(loginUserDetVm: any) {
    const dataUrl = 'DropDown/componentStatus';
    return this.http.post<any>(dataUrl, loginUserDetVm);
	/*
    // If data already exists, return it without making the POST request
    if (this.common.statusDDList.length > 0) {
      return of(this.common.statusDDList); // Return cached data
    }
  
    // If no cached data, make the POST request and store the result
    return this.http.post<any[]>(dataUrl, loginUserDetVm).pipe(
      tap((data) => {
        this.common.statusDDList = data; // Cache the data
      })
    );
    */
  }
  getPriority(loginUserDetVm: any) {
    const dataUrl = 'DropDown/componentPriority';
    return this.http.post<any>(dataUrl, loginUserDetVm);
    
    /*

    // If data already exists, return it without making the POST request
    if (this.common.priorityDDList.length > 0) {
      return of(this.common.priorityDDList); // Return cached data
    }
  
    // If no cached data, make the POST request and store the result
    return this.http.post<any[]>(dataUrl, loginUserDetVm).pipe(
      tap((data) => {
        this.common.priorityDDList = data; // Cache the data
      })
    );
    */
  }
  getVendor(loginUserDetVm: any) {
    const dataUrl = 'DropDown/VendorName';
    return this.http.post<any>(dataUrl, loginUserDetVm);
    /*

    // If data already exists, return it without making the POST request
    if (this.common.vendorDDList.length > 0) {
      return of(this.common.vendorDDList); // Return cached data
    }
  
    // If no cached data, make the POST request and store the result
    return this.http.post<any[]>(dataUrl, loginUserDetVm).pipe(
      tap((data) => {
        this.common.vendorDDList = data; // Cache the data
      })
    );
    */
  }
  getComponents(loginUserDetVm: any) {
    const dataUrl = 'DropDown/deparmentComponents';
    return this.http.post<any>(dataUrl, loginUserDetVm);
    /*

    // If data already exists, return it without making the POST request
    if (this.common.componentDDList.length > 0) {
      return of(this.common.componentDDList); // Return cached data
    }
  
    // If no cached data, make the POST request and store the result
    return this.http.post<any[]>(dataUrl, loginUserDetVm).pipe(
      tap((data) => {
        this.common.componentDDList = data; // Cache the data
      })
    );
    */
  }
  getClients(loginUserDetVm: any) {
    const dataUrl = 'DropDown/teamClient';
    return this.http.post<any>(dataUrl, loginUserDetVm);
    /*

    // If data already exists, return it without making the POST request
    if (this.common.clientDDList.length > 0) {
      return of(this.common.clientDDList); // Return cached data
    }
  
    // If no cached data, make the POST request and store the result
    return this.http.post<any[]>(dataUrl, loginUserDetVm).pipe(
      tap((data) => {
        this.common.clientDDList = data; // Cache the data
      })
    );
    */
  }
  getInvoiceNo(loginUserDetVm: any) {
    const dataUrl = 'DropDown/GetInvoiceNo';
    return this.http.post<any>(dataUrl, loginUserDetVm);
  }
  GetFQCClosedUser(loginUserDetVm: any) {
    const dataUrl = 'DropDown/GetFQCClosedUser';
    return this.http.post<any>(dataUrl, loginUserDetVm);
  }
  GetFinalQCApprovedClientReferenceNumber(loginUserDetVm: any) {
    const dataUrl = 'DropDown/GetFinalQCApprovedClientReferenceNumber';
    return this.http.post<any>(dataUrl, loginUserDetVm);
  }
  GetSupplementaryClientReferenceNumber(loginUserDetVm: any) {
    const dataUrl = 'DropDown/GetSupplementaryClientReferenceNumber';
    return this.http.post<any>(dataUrl, loginUserDetVm);
  }
  //filter
  GetInstitutioInfo(request: any) {
    const dataUrl = 'DropDown/InstitutioInfo';
    return this.http.post<any>(dataUrl, request);
  }
  GetInstituteInfo(request: any) {
    const dataUrl = 'DropDown/InstituteInfo';
    return this.http.post<any>(dataUrl, request);
  }
  GetCompanyInfo(request: any) {
    const dataUrl = 'DropDown/GetCompanyInfo';
    return this.http.post<any>(dataUrl, request);
  }
  getVerificationId(loginUserDetVm: any) {
    const dataUrl = 'DropDown/GetVerficiationId';
    return this.http.post<any>(dataUrl, loginUserDetVm);
  }
  //Add ScreeningId For VE List Vignesh Pandian 13/10/2023
  getClientScreeningId(loginUserDetVm: any) {
    const dataUrl = 'DropDown/GetClientScreeningId';
    return this.http.post<any>(dataUrl, loginUserDetVm);
    /*

    // If data already exists, return it without making the POST request
    if (this.common.clientScreeningIdDDList.length > 0) {
      return of(this.common.clientScreeningIdDDList); // Return cached data
    }
  
    // If no cached data, make the POST request and store the result
    return this.http.post<any[]>(dataUrl, loginUserDetVm).pipe(
      tap((data) => {
        this.common.clientScreeningIdDDList = data; // Cache the data
      })
    );
    */
  }
  getScreeningOwnerList(loginUserDetVm: any) {
    const dataUrl = 'DropDown/GetVerficiationScreeningOwnerByDepartemnt';
    return this.http.post<any>(dataUrl, loginUserDetVm);
    /*

    // If data already exists, return it without making the POST request
    if (this.common.ScreeningOwnerDDList.length > 0) {
      return of(this.common.ScreeningOwnerDDList); // Return cached data
    }
  
    // If no cached data, make the POST request and store the result
    return this.http.post<any[]>(dataUrl, loginUserDetVm).pipe(
      tap((data) => {
        this.common.ScreeningOwnerDDList = data; // Cache the data
      })
    );
    */
  }
  getClientRef(loginUserDetVm: any) {
    const dataUrl = 'DropDown/GetVerficiationClientReferenceNumber';
    return this.http.post<any>(dataUrl, loginUserDetVm);
  }
  getCandidate(loginUserDetVm: any) {
    const dataUrl = 'DropDown/GetVerficiationCandidateName';
    return this.http.post<any>(dataUrl, loginUserDetVm);
    
    /*

    // If data already exists, return it without making the POST request
    if (this.common.candidateDDList.length > 0) {
      return of(this.common.candidateDDList); // Return cached data
    }
  
    // If no cached data, make the POST request and store the result
    return this.http.post<any[]>(dataUrl, loginUserDetVm).pipe(
      tap((data) => {
        this.common.candidateDDList = data; // Cache the data
      })
    );
    */
  }
  getQcCandidate(loginUserDetVm: any) {
    const dataUrl = 'DropDown/GetFQCCandidateName';
    return this.http.post<any>(dataUrl, loginUserDetVm);
  }
  // getComponents(depId): Observable<any> {
  //   const dataUrl = 'DropDown/components?applyPaging=' + false +'&depId=' + depId;
  //   return this.http.get<any>(dataUrl);
  // }
  // getClients(depId): Observable<any> {
  //   const dataUrl = 'DropDown/clients?applyPaging=' + false +'&depId=' + depId;
  //   return this.http.get<any>(dataUrl);
  // }
  GetInsuffByScreeningCompId(screeningCompId: number): Observable<any> {
    const dataUrl = 'Screening/GetInsuffByScreeningCompId?screeningCompId=' + screeningCompId;
    return this.http.get<any>(dataUrl);
  }

  // GetInsuffDetailsByScreenCompId(screeningCompId: number): Observable<any> {
  //   const dataUrl = 'Screening/GetInsuffDetailsByScreenCompId?screeningCompId=' + screeningCompId;
  //   return this.http.get<any>(dataUrl);
  // }
  GetInsuffDetailsByScreenCompId(screeningCompId: number): Observable<any> {
    const dataUrl = 'Insufficiency/GetInsuffDetailsByScreenCompId?screeningCompId=' + screeningCompId;
    return this.http.get<any>(dataUrl);
  }
  //Added by Megala - For VTS2-2024-CRT-0155
  GetReopenCommentsByScreenCompId(screeningCompId: number): Observable<any> {
    const dataUrl = 'Screening/GetReopenCommentsByScreenCompId?screeningCompId=' + screeningCompId;
    return this.http.get<any>(dataUrl);
  }
  // GetClearInsuffDocument(insuffId: number) {
  //   const dataUrl = 'Screening/GetClearInsuffDocument?insuffId=' + insuffId;
  //   return this.http.get<any>(dataUrl);
  // }
  GetClearInsuffDocument(insuffId: number) {
    const dataUrl = 'Insufficiency/GetClearInsuffDocument?insuffId=' + insuffId;
    return this.http.get<any>(dataUrl);
  }

  // Pre-Qc cases Count
  // preQcCasesCount(userId: number, deptId: number) {
  //   const dataUrl = 'Screening/PreQCScreeningCount?userId=' + userId + '&deptId=' + deptId;
  //   return this.http.get<any>(dataUrl);
  // }
  // Pre-Qc cases Count details
  getPreQCScreeningDetails(assignDE: any) {
    const dataUrl = 'Screening/GetPreQCScreeningDetails';
    return this.http.post<any>(dataUrl, assignDE, { observe: 'response' as 'body' });
  }

  // GetRaiseInsufficiencyScreeningCount
  getRaiseInsufficiencyScreeningCount(userId: number) {
    const dataUrl = 'Screening/GetRaiseInsufficiencyScreeningCount?userId=' + userId;
    return this.http.get<any>(dataUrl);
  }
  // // preQcRejectCount
  // preQcRejectCount(userId: number, deptId: number) {
  //   const dataUrl = 'Screening/PreQCScreeningRejectCount?userId=' + userId + '&deptId=' + deptId;
  //   return this.http.get<any>(dataUrl);
  // }
  // GetPreQCRejectScreeningDetails
  getPreQCRejectScreeningDetails(data: any) {
    const dataUrl = 'Screening/GetPreQCRejectScreeningDetails';
    return this.http.post<any>(dataUrl, data);
  }
  // getInsuffClearCount(userId: number) {
  //   const dataUrl = 'Screening/GetClearInsufficiencyCount?userId=' + userId;
  //   return this.http.get<any>(dataUrl);
  // }
  // Get Raise Insuff Details
  getRaiseInsufficiencyScreeningList(userData: any) {
    const dataUrl = 'Screening/GetRaiseInsufficiencyScreeningList';
    return this.http.post<any>(dataUrl, userData);
  }
  getTatInsufficiencyList(userData: any) {
    const dataUrl = 'Insufficiency/GetTATCrossedInsuff';
    return this.http.post<any>(dataUrl, userData);
    //return this.http.post<any>(dataUrl, userData, { observe: 'response' as 'body' });
  }
  // Get Clear Insuff Details
  getClearInsufficiencyList(userData: any) {
    // const dataUrl = 'Screening/GetClearInsufficiencyList?userId=' + userId;
    const dataUrl = 'Screening/GetClearInsufficiencyList';
    return this.http.post<any>(dataUrl, userData, { observe: 'response' as 'body' });
  }
  getGenderDetails() {
    const dataUrl = 'Screening/GetGenderDetails';
    return this.http.get<any>(dataUrl);
  }
  getPhoneCodeList() {
    const dataUrl = 'Master/GetPhoneCodeList';
    return this.http.get<any>(dataUrl);
  }
  getRefCheckReport() {
    const dataUrl = 'Screening/GetRefCheckReportDetails';
    return this.http.get<any>(dataUrl);
  }
  // getInsufficiencyDetailsCount(userId: number) {
  //   const dataUrl = 'Screening/GetInsufficiencyCount?userId=' + userId;
  //   return this.http.get<any>(dataUrl);
  // }
  openraiseInsuffDetails(screeningStatusId: number, userId: number) {
    const dataUrl = 'Screening/GetInsufficiencyList?userId=' + userId + '&screeningStatusId=' + screeningStatusId;
    return this.http.get<any>(dataUrl);
  }
  ReopenCancelledComponent(screeningCompId: number, loggedIn: number) {
    const dataUrl = 'Screening/ReopenCancelledComponent?screeningCompId=' + screeningCompId + '&loggedIn=' + loggedIn;
    return this.http.get<any>(dataUrl);
  }
  ApproveCandidateCase(invitationId, loggedIn) {
    const dataUrl = 'Screening/ApproveCandidateCase?invitationId=' + invitationId + '&loggedIn=' + loggedIn;
    return this.http.post<any>(dataUrl, null);
  }
  caseComponentAddedByCandidate(candidateAddedComponentVm: any) {
    const dataUrl = 'Screening/CaseComponentAddedByCandidate';
    return this.http.post<any>(dataUrl, candidateAddedComponentVm);
  }
  invitationReOpen(invitationId, loggedIn): Observable<any> {
    const dataUrl = 'Screening/InvitationReOpen?invitationId=' + invitationId + '&loggedIn=' + loggedIn;
    return this.http.post<any>(dataUrl, null);
  }
  getInvitationAuditDetails(invitationId: number): Observable<any> {
    const dataUrl = 'Screening/GetInvitationAuditDetails?invitationId=' + invitationId;
    return this.http.get<any>(dataUrl);
  }
  getScreeningQCRejectComponentDetails(userData: any): Observable<any> {
    const dataUrl = 'Screening/GetScreeningQCRejectComponentDetails';
    return this.http.post<any>(dataUrl, userData, { observe: 'response' as 'body' });
  }
  getScreeningVERejectComponentDetails(userData: any): Observable<any> {
    const dataUrl = 'Screening/GetScreeningVERejectComponentDetails';
    return this.http.post<any>(dataUrl, userData, { observe: 'response' as 'body' });
  }
  getScreeningFRRejectComponentDetails(userData: any): Observable<any> {
    const dataUrl = 'Screening/GetScreeningFRRejectComponentDetails';
    return this.http.post<any>(dataUrl, userData, { observe: 'response' as 'body' });
  }
  GetReopenComponentDetails(loginUserDetVm: any): Observable<any> {
    const dataUrl = 'Screening/GetReopenComponentDetails';
    return this.http.post<any>(dataUrl, loginUserDetVm, { observe: 'response' as 'body' });
  }
  getNotApplicapleComponentDetails(userData: any): Observable<any> {
    const dataUrl = 'Screening/GetNotApplicapleComponentDetails';
    return this.http.post<any>(dataUrl, userData, { observe: 'response' as 'body' });
  }
  getCandidateList(siteId: number): Observable<any> {
    const dataUrl = 'Screening/GetAbroadComponentCandidateList?siteId=' + siteId;
    return this.http.get<any>(dataUrl);
  }
  getComponentList(candidateId: number): Observable<any> {
    const dataUrl = 'Screening/GetAbroadComponentList?candidateId=' + candidateId;
    return this.http.get<any>(dataUrl);
  }
  getDigiLockerDocuments(candidateId:number): Observable<any> {
    const dataUrl = 'Verification/GetDigiLockerDocuments?candidateId=' + candidateId;
    return this.http.get<any>(dataUrl);
  }
  saveAbroadCompDetails(formData: FormData): Observable<any> {
    const dataUrl = 'Screening/SaveAbroadComponentSubmission';
    return this.http.post<any>(dataUrl, formData);
  }
  getCustomFieldTypeList() {
    const dataUrl = 'Screening/GetCustomFieldTypeList';
    return this.http.get<any>(dataUrl);
  }
  // getCVValidationFieldList() {
  //   const dataUrl = 'Screening/GetCVValidationFieldList';
  //   return this.http.get<any>(dataUrl);
  // }
  getClosedComponentDetails(userData: any): Observable<any> {
    const dataUrl = 'Screening/GetClosedComponentDetails';
    return this.http.post<any>(dataUrl, userData, { observe: 'response' as 'body' });
  }
  deleteInsuffList(data: any) {
    const dataUrl = 'Screening/DeleteInsufficiency';
    return this.http.post<any>(dataUrl, data);
  }
  TatOutMoveToInsufficiency(data: any) {
    const dataUrl = 'Insufficiency/TatOutMoveToInsufficiency';
    return this.http.post<any>(dataUrl, data);
  }
  getApprovedLOADoc(caseNo: number) {
    const dataUrl = 'Screening/GetApprovedDocOfLOA?caseNo=' + caseNo;
    return this.http.get<any>(dataUrl);
  }
  tatDelaylist(userData: any): Observable<any> {
    const dataUrl = 'Screening/GetTatDelaylist';
    return this.http.post<any>(dataUrl, userData, { observe: 'response' as 'body' });
  }
  caseCreationImport(data: FormData): Observable<any> {
    const dataUrl = 'Screening/CaseCreationImport';
    return this.http.post(dataUrl, data);
  }
  advanceSearchImport(data: FormData): Observable<any> {
    const dataUrl = 'Screening/UploadGlobalSerachExcel';
    return this.http.post(dataUrl, data, { observe: 'response' as 'body' });
  }
  invitationCaseCreationImport(obj: FormData): Observable<any> {
    const dataUrl = 'Master/InvitationCaseCreationImport';
    return this.http.post(dataUrl, obj);
  }
  getCaseImportTemplete(IqcByPassFlag = false, invitaitonFlag: boolean, scopeByPassFlag: boolean, refNoFlag: boolean, caseScopeNewFlag = false, techMFlag: boolean): Observable<any> {
    const dataUrl = 'Screening/GetCaseImportTemplete?invitaitonFlag=' + invitaitonFlag + '&scopeByPassFlag='
      + scopeByPassFlag + '&refNoFlag=' + refNoFlag + '&caseScopeNewFlag=' + caseScopeNewFlag + '&IqcByPassFlag=' + IqcByPassFlag + '&TechMFlag=' + techMFlag;
    return this.http.get(dataUrl);
  }
  getScreeningComponentDet(globalSearchVm): Observable<any> {
    const dataUrl = 'Screening/GetScreeningComponentDet';
    return this.http.post(dataUrl, globalSearchVm);
  }
  getClientCaseImportTemplete(): Observable<any> {
    const dataUrl = 'ClientBulkCaseCreation/GetClientCaseImportTemplete';
    return this.http.get(dataUrl);
  }
  getCasePriortiyList(): Observable<any> {
    const dataUrl = 'ClientBulkCaseCreation/GetCasePriortiyList';
    return this.http.get(dataUrl);
  }
  downloadClientCaseDocument(docId: number): Observable<any> {
    const dataUrl = 'ClientBulkCaseCreation/DownloadCaseDocument?DocId=' + docId;
    return this.http.get<any>(dataUrl);
  }
  downloadAllClientCaseDocument(candidateId: number): Observable<any> {
    const dataUrl = 'ClientBulkCaseCreation/DownloadAllCaseDocument?CandidateId=' + candidateId;
    return this.http.get<any>(dataUrl);
  }
  bulkClientCaseCreationImport(obj: FormData): Observable<any> {
    const dataUrl = 'ClientBulkCaseCreation/ValidateExcel';
    return this.http.post(dataUrl, obj);
  }
  bulkClientCaseSave(obj: FormData): Observable<any> {
    const dataUrl = 'ClientBulkCaseCreation/SaveBulkCases';
    return this.http.post(dataUrl, obj);
  }
  getAdvanceSearchDetails(globalSearchVm): Observable<any> {
    const dataUrl = 'Screening/GetAdvanceScreeningComponentDetails';
    return this.http.post(dataUrl, globalSearchVm ,{ observe: 'response' as 'body' });
  }
  getGlobalSearchType() {
    const dataUrl = 'Screening/GetGlobalSearchType';
    return this.http.get(dataUrl);
  }
  AddScreeningMasterData(data: any): Observable<any> {
    const dataUrl = (data != null && (data.type == 'Employer' || data.type == 'Institution')) ? 'Screening/AddScreeningEducationEmployerMasterData' : 'Screening/AddScreeningMasterData';
    return this.http.post(dataUrl, data);
  }
  AddScreeningNAAddressMasterData(data: any): Observable<any> {
    const dataUrl = (data != null && (data.type == 'Employer' || data.type == 'Institution')) ? 'Screening/AddScreeningNAAddressEducationEmployerMasterData' : 'Screening/AddScreeningMasterData';
    return this.http.post(dataUrl, data);
  }
  getClientRelatedInfo(clientId: any) {
    const dataUrl = 'Screening/GetClientRelatedInfo?clientId=' + clientId;
    return this.http.get<any>(dataUrl);
  }
  getByPassClientList(editFlag, logginId, applicationId) {
    const dataUrl = 'Screening/GetByPassClientList?editFlag=' + editFlag +
      '&logginId=' + logginId + '&applicationId=' + applicationId;
    return this.http.get<any>(dataUrl);
  }
  checkClientReferenceNo(clientReferenceNo, clientId, candidateId): Observable<any> {
    const dataUrl = 'Screening/CheckClientReferenceNo?clientReferenceNo=' + clientReferenceNo + '&clientId=' + clientId + '&candidateId=' + candidateId;
    return this.http.get<any>(dataUrl);
  }
  GetVerificationRejectRemarks(screeningCompId: any) {
    const dataUrl = 'Verification/GetVerificationRejectRemarks?screeningCompId=' + screeningCompId;
    return this.http.get<any>(dataUrl);
  }
  GetFrRejectRemarks(screeningCompId: any) {
    const dataUrl = 'Verification/GetFrRejectRemarks?screeningCompId=' + screeningCompId;
    return this.http.get<any>(dataUrl);
  }
  checkChargeCode(chargeCode, clientId, clientRefNo): Observable<any> {
    const dataUrl = 'Case/CheckChargeCode?chargeCode=' + chargeCode + '&clientId=' + clientId + '&clientRefNo=' + clientRefNo;
    return this.http.get<any>(dataUrl);
  }
  checkScreeningApplicantId(applicantId, clientId, clientRefNo): Observable<any> {
    const dataUrl = 'Screening/CheckScreeningApplicantId?applicantId=' + applicantId + '&clientId=' + clientId + '&clientRefNo=' + clientRefNo;
    return this.http.get<any>(dataUrl);
  }
  GetConsentType(): Observable<any> {
    const dataUrl = 'Screening/GetConsentType';
    return this.http.get<any>(dataUrl);
  }
  lOABGVView(caseNo: number) {
    const dataUrl = 'Screening/LOABGVView?caseNo=' + caseNo;
    return this.http.get<any>(dataUrl);
  }
  GetStopCheckCaseDetails(loginUserDetVm: any) {
    const dataUrl = 'Screening/GetStopCheckCaseDetails';
    return this.http.post<any>(dataUrl, loginUserDetVm);
  }
  InvitationStatusUpdate(invitationStatusVm: any) {
    const dataUrl = 'Invitation/InvitationStatusUpdate';
    return this.http.post<any>(dataUrl, invitationStatusVm);
  }
  getReportPendingCount() {
    const dataUrl = 'Screening/ReportPendingCount';
    return this.http.get<any>(dataUrl);
  }
  getReportPendingList(screeningstatusid: any) {
    const dataUrl = 'Screening/ReportPendingList?screeningstatusid=' + screeningstatusid;
    return this.http.get<any>(dataUrl);
  }
  getTatDelaylist(loginUserDetVm: any) {
    const dataUrl = 'DashBoard/GetTatDelaylist';
    return this.http.post<any>(dataUrl, loginUserDetVm, { observe: 'response' as 'body' });
  }
  GetAssignedSubCheckCaseDetails(assignDE: AssignDEView) {
    const dataUrl = 'Screening/GetAssignedSubCheckCaseDetails';
    return this.http.post<any>(dataUrl, assignDE);
  }
  GetAssignedDASubCheckCaseDetails(assignDE: AssignDEView) {
    const dataUrl = 'Screening/GetDAAssignedSubCheckCaseDetails';
    return this.http.post<any>(dataUrl, assignDE, { observe: 'response' as 'body' });
  }
  GetNotProvidedReasonList() {
    const dataUrl = 'Screening/GetNotProvidedReasonList';
    return this.http.get<any>(dataUrl);
  }
  GetCandidatePaymentList() {
    const dataUrl = 'Screening/GetCanididatePaymentList';
    return this.http.get<any>(dataUrl);
  }
  resAddress(addressId: number): Observable<any> {
    const dataUrl = 'Screening/DeleteResidentalAddress?addressId=' + addressId;
    return this.http.delete<any>(dataUrl)
  }
  getWTatlist(loginUserDetVm: any) {
    const dataUrl = 'DashBoard/GetWithinTatlist';
    return this.http.post<any>(dataUrl, loginUserDetVm, { observe: 'response' as 'body' });
  }
  getNTatlist(loginUserDetVm: any) {
    const dataUrl = 'DashBoard/GetNearstTatlist';
    return this.http.post<any>(dataUrl, loginUserDetVm, { observe: 'response' as 'body' });
  }
  getCTatlist(loginUserDetVm: any) {
    const dataUrl = 'DashBoard/GetCurrentTatlist';
    return this.http.post<any>(dataUrl, loginUserDetVm, { observe: 'response' as 'body' });
  }
  SendForResearchMail(forResearchVm: any) {
    const dataUrl = 'Research/SendForResearchReportMail';
    return this.http.post<any>(dataUrl, forResearchVm);
  }
  getScopeDetail(caseNo: any) {
    const dataUrl = 'Screening/GetScopeComponent?caseNo=' + caseNo;
    return this.http.get<any>(dataUrl);
  }
  CheckPincode(zipcode, clientRefNo, compId) {
    const dataUrl = 'Screening/CheckPincode?zipcode=' + zipcode + '&clientRefNo=' + clientRefNo + '&compId=' + compId;
    return this.http.get<any>(dataUrl);
  }
  removeScopeComponents(rmeScopeVm: any) {
    const dataUrl = 'Master/RemoveScopeComponent';
    return this.http.post<any>(dataUrl, rmeScopeVm);
  }
  getCandidateInfo(loginUserDetVm: any) {
    const dataUrl = 'DropDown/candidateInfo';
    return this.http.post<any>(dataUrl, loginUserDetVm);
  }
  getDatabaseType(): Observable<any> {
    const dataUrl = 'Screening/GetDatabaseType';
    return this.http.get<any>(dataUrl);
  }

  public addUpdateCandidateDetails(screeningDetailsVm): Observable<any> {
    const url = 'Screening/AddUpdateCandidateInfo';
    return this.http.post<any>(url, screeningDetailsVm);
  }
  public addupdateScreeningDetails(screeningDetailsVm): Observable<any> {
    const url = 'Screening/AddUpdateScreeningDetails';
    return this.http.post<any>(url, screeningDetailsVm);
  }
  public addupdateScreeningCompDetails(screeningDetailsVm): Observable<any> {
    const url = 'Screening/AddUpdateScreeningDetails';
    return this.http.post<any>(url, screeningDetailsVm);
  }
  CheckPostalcode(screeningId, postalCode) {
    const dataUrl = 'FileSubmission/GetComponetAddressDetails?screeningId=' + screeningId + '&postalCode=' + postalCode;
    return this.http.get<any>(dataUrl);
  }
  getScreeningAddressType(applicantId): Observable<any> {
    const dataUrl = 'Screening/GetScreeningAddressType?applicationId=' + applicantId;
    return this.http.get<any>(dataUrl);
  }

  //EmailCreationAPI
  getSiteById(clientid: any) {
    const dataUrl = 'EmailMaster/GetSite?clientId=' + clientid;
    return this.http.get<any>(dataUrl);
  }
  getEmailTemcat() {
    const dataUrl = 'EmailMaster/GetEmailTemplateCategory';
    return this.http.get<any>(dataUrl);
  }
  getEmailTemplate(catId: any) {
    const dataUrl = 'EmailMaster/GetEmailTemplate?TemplateCategoryId=' + catId;
    return this.http.get<any>(dataUrl);
  }
  public searchMailConfig(clientId, siteId, emailCatId, emailTempId): Observable<any> {
    const url = 'EmailMaster/GetAllEmailTemplate?clientId=' + clientId + '&siteId=' + siteId + '&emailTempId=' + emailTempId + '&emailCatId=' + emailCatId;
    return this.http.get<any>(url);
  }
  public addMailCreationDetails(mailDetailsVm): Observable<any> {
    const url = 'EmailMaster/LoadAllMailTemplate';
    return this.http.post<any>(url, mailDetailsVm);
  }
  public addupdateMailCreationDetails(mailDetailsVm): Observable<any> {
    const url = 'EmailMaster/SaveEmailTemplate';
    return this.http.post<any>(url, mailDetailsVm);
  }
  public getMailTemplatebyId(templateId): Observable<any> {
    const url = 'EmailMaster/GetEmailTemplateById?emailTempConfigId=' + templateId;
    return this.http.get<any>(url);
  }
  public deleteMailTemplatebyId(templateId, logId): Observable<any> {
    const url = 'EmailMaster/DeleteEmailTemplateById?emailTempConfigId=' + templateId + '&logginId=' + logId;
    return this.http.get<any>(url);
  }
  public getMailTemplateType(): Observable<any> {
    const url = 'EmailMaster/GetEmailType';
    return this.http.get<any>(url);
  }
  public getGetSendType(): Observable<any> {
    const url = 'EmailMaster/GetSendType';
    return this.http.get<any>(url);
  }
  // GetInsuffDropdownDetails(clFlag: boolean, statusLookupId: number, levelLookupId: number, userId: number, teamName: any, InsuffStatus: any) {
  //   statusLookupId = statusLookupId === null ? 0 : statusLookupId; levelLookupId = levelLookupId === null ? 0 : levelLookupId;
  //   const dataUrl = 'Screening/GetInsuffDropdownDetails?clFlag=' + clFlag + '&statusLookupId=' + statusLookupId
  //     + '&levelLookupId=' + levelLookupId + '&userId=' + userId + '&teamName=' + teamName + '&InsuffStatus=' + InsuffStatus;
  //   return this.http.get<any>(dataUrl);
  // }

  GetInsuffDropdownDetails(clFlag: boolean, statusLookupId: number, levelLookupId: number, userId: number, teamName: any, InsuffStatus: any) {
    statusLookupId = statusLookupId === null ? 0 : statusLookupId; levelLookupId = levelLookupId === null ? 0 : levelLookupId;
    const dataUrl = 'Insufficiency/GetInsuffDropdownDetails?clFlag=' + clFlag + '&statusLookupId=' + statusLookupId
      + '&levelLookupId=' + levelLookupId + '&userId=' + userId + '&teamName=' + teamName + '&InsuffStatus=' + InsuffStatus;
    return this.http.get<any>(dataUrl);
  }
  // dashboard count functionality - By Naveen - Start
  getInsufficiencyCAMCount(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/GetInsufficiencyCAMCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  automationInsuffCount(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/GetCountForAutomationInsuff';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  getClearCAMCount(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/GetClearedCountForCAM';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  getCaseHistorycount(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/GetCaseHistoryCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  getSubcheckCount(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/SubCheckCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  getPreQcCases(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/PreQCScreeningCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  getPreQcReject(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/PreQCScreeningRejectCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  getDAsubcheckCount(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/DASubCheckCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  getNotApplicableFlagCount(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/NotApplicableFlagCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  getSubmissionHistoryCount(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/SubmissionHistoryCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  getPreQcSubmHisCount(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/PreQcSubmissionHistoryCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  getVERejectCount(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/GetComponentVERejectCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  getFRRejectCount(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/GetComponentFRRejectCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  getReOpenChecksCount(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/ReOpenChecksCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  getSubmissionCount(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/SubmissionCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  // dashboard count functionality - By Naveen - End

  // Ve count start

  getAssignNotAssign(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/VerificationCaseCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
//Added by megala SRS -(sprint -22)VTS2-2024-CRT-0195 
GetCamRejetionCount(dashboardCountVm: DashboardCountVm) {
  const dataUrl = 'DashBoardCount/ClosureAdviceRejectedCount';
  return this.http.post<any>(dataUrl, dashboardCountVm);
}
GetClosureAdviceCount(dashboardCountVm: DashboardCountVm) {
  const dataUrl = 'DashBoardCount/ClosureAdviceApprovalCount';
  return this.http.post<any>(dataUrl, dashboardCountVm);
}
//ended by megala SRS -(sprint -22)VTS2-2024-CRT-0195 

  getClosedCheckcount(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/GetVerificationCompletedCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  GetReAssignedCheckCount(dashboardCountVm: DashboardCountVm) {

    const dataUrl = 'DashBoardCount/GetReAssignedCheckCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  GetCurrentEmploymentCount(dashboardCountVm: DashboardCountVm) {

    const dataUrl = 'DashBoardCount/GetCurrentEmploymentCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  CloseCancelledInternallyFlagCount(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/CloseCancelledInternallyFlagCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  GetPendingchecks(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/GetPendingchecks';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }

  GetSinglePendingchecks(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/GetSinglePendingchecks';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  GetReopencountchecks(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/GetReopencountchecks';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  GetBTCount(dashboardCountVm: DashboardCountVm): Observable<any> {
    const dataUrl = 'DashBoardCount/GetBTCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  GetNTCount(dashboardCountVm: DashboardCountVm): Observable<any> {
    const dataUrl = 'DashBoardCount/GetNTCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  GetCTCount(dashboardCountVm: DashboardCountVm): Observable<any> {
    const dataUrl = 'DashBoardCount/GetCTCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  GetWTCount(dashboardCountVm: DashboardCountVm): Observable<any> {
    const dataUrl = 'DashBoardCount/GetWTCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  GetNormalCount(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/GetNormalCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  GetRedcaseApproval(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/GetTeamLeadApprovedCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  GetSeventhdayReportCount(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/GetSeventhdayReportCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  PendingComponentCount(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/PendingComponentCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }

  GetClientCommentCaseCount(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/GetClientCommentCaseCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  GetPrioritylookup(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/GetPrioritylookup';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  // end
  // Start QC dashboard count methods
  GetComponentQcCount(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/GetComponentQcCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  GetQcSubCheckCount(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/GetQcSubCheckCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  GetFinalQcCount(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/GetFinalQcCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  GetQcApprovedRejectedCount(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/GetQcApprovedRejectedCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  GetIQCFinalCompCnt(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/GetIQCFinalCompCnt';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  GetComponentQcRejectCount(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/GetComponentQcRejectCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  GetDERejectCount(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/GetDERejectCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  GetQCRejectCount(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/GetQCRejectCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
GetIndividualQcApprovedCountAsync(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/GetIndividualQcApprovedCountAsync';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  GetIndividualQcApprovedTodayCountAsync(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/GetIndividualQcApprovedTodayCountAsync';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  GetIndividualQcRejectedCountAsync(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/GetIndividualQcRejectedCountAsync';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  GetFinalQcApprovedCountAsync(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/GetFinalQcApprovedCountAsync';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  GetFinalQcApprovedTodayCountAsync(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/GetFinalQcApprovedTodayCountAsync';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  GetFinalQcRejectedCountAsync(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/GetFinalQcRejectedCountAsync';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  GetFinalReportNotSentCountAsync(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/GetFinalReportNotSentCountAsync';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  // End QC dashboard count methods
  // Start CRT dashboard count methods
  getCaseCreationCount(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/CaseCreationCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  getOtherLoginFrCount(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/GetOtherLoginFrCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  getScopeCreationNotAssignedCount(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/ScopeCreationNotAssignedCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  getScopeCreationAssignedCount(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/ScopeCreationAssignedCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  getScopeCreationLoaApprovedCount(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/ScopeCreationLoaApprovedCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  getScopeCreationLoaPendingCount(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/ScopeCreationLoaPendingCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  getScopeHistoryCount(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/ScopeHistoryCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  GetFOCCount() {
    const dataUrl = 'DashBoardCount/GetFOCCount';
    return this.http.get<any>(dataUrl);
  }
  getMSPRateApprovalCount(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/MSPRateApprovalCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  getMSPRatePendingCount(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/MSPRatePendingCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  getMSPRateRejectedCount(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/MSPRateRejectedCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  getTATApprovalCount(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/TATApprovalCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  getTATPendingCount(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/TATPendingCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  getTATRejectedCount(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/TATRejectedCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  getLoaApprovedCount(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/LoaApprovalManagerCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  getLoaPendingCount(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/LoaPendingManagerCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  getLoaRejectedCount(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/LoaRejectedCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  getClientAgreementPendingCount(userId: any) {
    const dataUrl = 'DashBoardCount/GetClientAgreementPendingCount';
    return this.http.post<any>(dataUrl, userId);
  }
  getClientAgreementApprovedCount(userId: any) {
    const dataUrl = 'DashBoardCount/GetClientAgreementApprovedCount';
    return this.http.post<any>(dataUrl, userId);
  }
  GetStopCheckCount(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/GetStopCheckCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  GetDirectAppCaseHistoryCount(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/GetDirectAppCaseHistoryCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  // End CRT dashboard count methods

  // End CRT DE insuff level 1 dashboard count methods start
  GetLevelOneInsufficiencyRaiseCount(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/GetLevelOneInsufficiencyRaiseCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  GetLevelOneInsufficiencyClearCount(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/GetLevelOneInsufficiencyClearCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  GetLevelOneTATCrossedInsuffCount(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/GetLevelOneTATCrossedInsuffCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  // End CRT DE insuff level 1 dashboard count methods end
  // End CRT DE insuff level 2 dashboard count methods start
  GetLevelTwoInsufficiencyRaiseCount(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/GetLevelTwoInsufficiencyRaiseCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  GetLevelTwoInsufficiencyClearCount(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/GetLevelTwoInsufficiencyClearCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  GetLevelTwoTATCrossedInsuffCount(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/GetLevelTwoTATCrossedInsuffCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  // End CRT DE insuff level 2 dashboard count methods end

  getScreeningStatus() {
    const dataUrl = 'DashBoardCount/GetScreeningStatus';
    return this.http.get<any>(dataUrl);
  }
  getverificationCaseCount(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/GetVerificationCaseCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  GetSixMonthEmployerDetailsCount(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/GetSixMonthEmployerDetailsCount';
    return this.http.post(dataUrl, dashboardCountVm);
  }

  // emp and edu dept case details by naveen start

  getEmpForResearchPending(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/GetFREmpPendingCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  getEduForResearchPending(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/GetFREduPendingCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  getempClientSuspect(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/GetFREmpClientSuspectCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  geteduClientSuspect(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/GetFREduClientSuspectCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  getempFRUnderReview(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/GetFREmpUnderreviewCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  geteduFRUnderReview(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/GetFREduUnderreviewCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  getempFRApprovalPending(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/GetFREmpApprovalPendingCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  geteduFRApprovalPending(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/GetFREduApprovalPendingCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  getempFRReject(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/GetFREmpRejectedCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  geteduFRReject(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/GetFREduRejectedCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  getempFRVerified(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/GetFREmpVerifiedCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  geteduFRVerified(dashboardCountVm: DashboardCountVm) {
    const dataUrl = 'DashBoardCount/GetFREduVerifiedCount';
    return this.http.post<any>(dataUrl, dashboardCountVm);
  }
  //end
  getSiteName(clientId: any) {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    const dataUrl = 'Case/GetSiteNoByClientId?clientId=' + clientId + '&applicationId=' + this.userData.applicationId + '&userId=' + this.userData.userId;
    return this.http.get<any>(dataUrl);
  }
  verificationModeforscreeningComponent(compId): Observable<any> {
    const dataUrl = 'Screening/GetVerificationScreeninDetails?compId=' + compId 
    return this.http.get<any>(dataUrl);
  }
  GetDetailsFromOCR(formData: FormData, compName: any) {
    const ocrURL = this.auth.getOCRRoute(compName);
    return this.http.post(ocrURL, formData);
  }
  getmanageinvitationClient(lstClientId): Observable<any> {
    const dataUrl = 'Invoice/GetmanageinvitationClient';
    return this.http.post<any>(dataUrl, lstClientId);
  }
  checkDuplicate(payload: any): Observable<any> {
    const dataUrl = 'ClientBulkCaseCreation/check-duplicate';
    return this.http.post(dataUrl, payload);
  }
  postDACVFileUpload(postdata:any) {
     const dataUrl = 'Case/DACVFileUpload';
    return this.http.post(dataUrl, postdata);
  }
  downloadCVDocument(cvDocId: number): Observable<any> {
    const dataUrl = 'Screening/DownloadCVDocument?CVDocId=' + cvDocId;
    return this.http.get<any>(dataUrl);
  }
  // getClosureAdviceApprovalDetail() {
  //   const dataUrl = 'DashBoardCount/ClosureAdviceApprovalDetail';
  //   return this.http.get<any>(dataUrl);
  // }
  

}
