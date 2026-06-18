import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QualityCheckService {
  approveOrRejectType: string;
  userData: any;
  historyReportList: any[] = [];
  private messageSource = new BehaviorSubject(0);
  currentMessage = this.messageSource.asObservable();
  searchForm: any;
  searchArr: any[];
  assignControl: any;
  qcOrFqc: any;
  backFlag = false;
  constructor(private http: HttpClient) {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
  }
  changeMessage(message: number) {
    this.messageSource.next(message);
  }
  getFQcDetails(SearchData): Observable<any> {
    const dataUrl = 'Qc/GetFQcDetails';
    return this.http.post<any>(dataUrl, SearchData, { observe: 'response' as 'body' });
  }
  GetIQCFinalCompDet(loginUserDetVm): Observable<any> {
    const dataUrl = 'Qc/GetIQCFinalCompDet';
    return this.http.post<any>(dataUrl, loginUserDetVm, { observe: 'response' as 'body' });
  }
  // GetQcApprovedRejectedDetails(loginUserDetVm: any) {
  //   const dataUrl = 'Qc/GetQcApprovedRejectedDetails';
  //   return this.http.post<any>(dataUrl, loginUserDetVm);
  // }
  GetIQcApprovedList(loginUserDetVm): Observable<any> {
    const dataUrl = 'Qc/GetIQcApprovedList';
    return this.http.post<any>(dataUrl, loginUserDetVm, { observe: 'response' as 'body' });
  }
  GetIQcRejectedList(loginUserDetVm): Observable<any> {
    const dataUrl = 'Qc/GetIQcRejectedList';
    return this.http.post<any>(dataUrl, loginUserDetVm, { observe: 'response' as 'body' });
  }
  GetFQcApprovedList(loginUserDetVm): Observable<any> {
    const dataUrl = 'Qc/GetFQcApprovedList';
    return this.http.post<any>(dataUrl, loginUserDetVm, { observe: 'response' as 'body' });
  }
  GetFinalReportNotSentList(loginUserDetVm): Observable<any> {
    const dataUrl = 'Qc/GetFinalReportNotSentList';
    return this.http.post<any>(dataUrl, loginUserDetVm, { observe: 'response' as 'body' });
  }
  GetIQCPartialDetails(loginUserDetVm): Observable<any> {
    const dataUrl = 'Qc/GetIQCPartialDetails';
    return this.http.post<any>(dataUrl, loginUserDetVm);
  }
  GetFQcRejectedList(loginUserDetVm): Observable<any> {
    const dataUrl = 'Qc/GetFQcRejectedList';
    return this.http.post<any>(dataUrl, loginUserDetVm, { observe: 'response' as 'body' });
  }
  addQcOwner(verificationDetails: any) {
    const dataUrl = 'Qc/AssignQcOwner';
    return this.http.post<any>(dataUrl, verificationDetails);
  }
  QcApprove(QcApproveVm: any) {
    const dataUrl = 'Qc/QcApprove';
    return this.http.post<any>(dataUrl, QcApproveVm);
  }
  FinalQCApprovalSentToClientMail(QcApproveVm: any) {
    const dataUrl = 'Qc/FinalQCApprovalSentToClientMail';
    return this.http.post<any>(dataUrl, QcApproveVm);
  }
  QcApproveRemarks(QcApproveVm: any) {
    const dataUrl = 'Qc/QcApproveRemarks';
    return this.http.post<any>(dataUrl, QcApproveVm);
  }
  GetScreeningDocumentClientPolicy(screeningId, clientId, screeningCompId, finalQcFlag) {
    const dataUrl = 'Qc/GetScreeningDocumentClientPolicy?screeningId=' + screeningId + '&clientId='
      + clientId + '&screeningCompId=' + screeningCompId + '&finalQcFlag=' + finalQcFlag;
    return this.http.get<any>(dataUrl);
  }
  GetQcErrorType(): Observable<any> {
    const dataUrl = 'Qc/GetQcErrorType';
    return this.http.get<any>(dataUrl);
  }
  GetQcComponentHistory(screeningId: any) {
    const dataUrl = 'Qc/GetQcComponentHistory?screeningId=' + screeningId;
    return this.http.get<any>(dataUrl);
  }
  GetColorSatus(clientId: any) {
    const dataUrl ='Verification/GetClientColorStatus?ClientId=' +clientId;
    return this.http.get<any>(dataUrl);
  }
  GetRedColorComponent(screeningId: any) {
    const dataUrl = 'Qc/GetRedColorComponent?screeningId=' + screeningId;
    return this.http.get<any>(dataUrl);
  }
  UpdateRedColorCodeComp(editRedCompData: any) {
    const dataUrl = 'Qc/UpdateRedColorCodeComp';
    return this.http.post<any>(dataUrl,editRedCompData);
  }
  GetIndividualQCReportDocument(screeningCompId, loggedIn) {
    const dataUrl = 'Qc/GetIndividualQCApprovedReportDocument?screeningCompId=' + screeningCompId + '&loggedIn=' + loggedIn;
    return this.http.get<any>(dataUrl);
  }
  GetFinalQCReportDocument(screenName, screeningId, loggedIn) {
    const dataUrl = 'Qc/GetFinalQCApprovedReportDocument?screenName=' + screenName + '&screeningId=' + screeningId + '&loggedIn=' + loggedIn;
    return this.http.get<any>(dataUrl);
  }
  GetSRReportDocument(screenName, screeningId, loggedIn, reportDocId) {
    const dataUrl = 'Qc/GetSRReportDocument?screenName=' + screenName + '&screeningId=' + screeningId + '&loggedIn=' + loggedIn + '&reportDocId=' + reportDocId;
    return this.http.get<any>(dataUrl);
  }
  QcReject(qcReject: any) {
    const dataUrl = 'Qc/QcReject';
    return this.http.post<any>(dataUrl, qcReject);
  }
  RejectedCompQcApproval(screeningCompId: number, loggedIn: number) {
    const dataUrl = 'Qc/RejectedCompQcApproval?screeningCompId=' + screeningCompId + '&loggedIn=' + loggedIn;
    return this.http.post<any>(dataUrl, null);
  }
  // Individual QC Approved Report Details
  GetIndividualQCApprovedReportDetails(userData): Observable<any> {
    const dataUrl = 'Qc/GetIndividualQCApprovedReportDetails';
    return this.http.post<any>(dataUrl, userData, { observe: 'response' as 'body' });
  }
  GetFinalQCApprovedReportDetails(userData): Observable<any> {
    const dataUrl = 'Qc/GetFinalQCApprovedReportDetails';
    return this.http.post<any>(dataUrl, userData, { observe: 'response' as 'body' });
  }
  GetInterimReportDetails(userData): Observable<any> {
    const dataUrl = 'Qc/GetInterimReportDetails';
    return this.http.post<any>(dataUrl, userData, { observe: 'response' as 'body' });
  }
  GetSRReportDetails(logginId, applicationId): Observable<any> {
    const dataUrl = 'Qc/GetSRReportDetails?logginId=' + logginId + '&applicationId=' + applicationId;
    return this.http.get<any>(dataUrl);
  }
  GetSupplementaryReportDetails(userData: any) {
    const dataUrl = 'Qc/GetSupplementaryReportDetails';
    return this.http.post<any>(dataUrl, userData, { observe: 'response' as 'body' });
  }
  GetQcDetails(countData): Observable<any> {
    const dataUrl = 'DashBoard/GetDashBoardDetails';
    return this.http.post<any>(dataUrl, countData);
  }
  GetDaywiseActivityCount(dateRange: any) {
    const dataUrl = 'DashBoard/GetDaywiseActivityCount';
    return this.http.post<any>(dataUrl, dateRange);
  }
  GetDateWiseList(dateRange: any) {
    const dataUrl = 'DashBoard/GetDateWiseList';
    return this.http.post<any>(dataUrl, dateRange);
  }
  // VP
  GetReportGeneratedHistoryDetails(screeName: string, candidateId: number) {
    const dataUrl = 'QC/GetReportGeneratedHistoryDetails?screenName=' + screeName + '&candidateId=' + candidateId;
    return this.http.get<any>(dataUrl);
  }
  getIqcDetails(SearchData: any) {
    const dataUrl = 'Qc/GetIqcDetails';
    return this.http.post<any>(dataUrl, SearchData, { observe: 'response' as 'body' });
  }
  getSubCheckDetails(SearchData: any) {
    const dataUrl = 'Qc/GetQCSubCheckDetails';
    return this.http.post<any>(dataUrl, SearchData, { observe: 'response' as 'body' });
  }
  getIQcDropdownDetails(loginUserDetVm: any) {
    const dataUrl = 'Qc/GetIQcDropdownDetails';
    return this.http.post<any>(dataUrl, loginUserDetVm);
  }

  getSubCheckDropdownDetails(loginUserDetVm: any) {
    const dataUrl = 'Qc/GetSubCheckDropdownDetails';
    return this.http.post<any>(dataUrl, loginUserDetVm);
  }
  getFqcPendingDropdownDetails(loginUserDetVm: any) {
    const dataUrl = 'Qc/GetFqcPendingDropdownDetails';
    return this.http.post<any>(dataUrl, loginUserDetVm);
  }
  getIQCFinalCompDetDropDown(loginUserDetVm: any) {
    const dataUrl = 'DropDown/GetIQCFinalCompDetDropDown';
    return this.http.post<any>(dataUrl, loginUserDetVm);
  }
  GetQCHistoryReportDetails(screenName: string, id: number) {
    this.GetReportGeneratedHistoryDetails(screenName, id).subscribe(resp => {
      if (resp) {
        this.historyReportList = resp;
      }
    });
  }
  UpdateClosedDate(QCCloseDatevm: any) {
    const dataUrl = 'Qc/UpdateCloseDate';
    return this.http.post<any>(dataUrl, QCCloseDatevm);
  }
  GetAdditionalFeeDetails(screeningCompId: number, screeningId: number): Observable<any> {
    const dataUrl = 'Qc/GetAdditionalFeeDetails?screeningCompId=' + screeningCompId + '&screeningId=' + screeningId;
    return this.http.get<any>(dataUrl);
  }
  GetReportType(): Observable<any> {
    const dataUrl = 'Qc/GetReportType';
    return this.http.get<any>(dataUrl);
  }
  GetModifyInterimReportStatus(clientId?: number): Observable<any> {
    const dataUrl = 'Qc/GetModifyInterimReportStatus?clientId=' + clientId;
    return this.http.get<any>(dataUrl);
  }
}
