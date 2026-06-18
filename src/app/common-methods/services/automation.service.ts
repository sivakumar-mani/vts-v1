import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { data } from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class AutomationService {

  constructor(private http: HttpClient) { }
  userData = JSON.parse(sessionStorage.getItem('user_data') as string);

  // Automation
  TatOutCloseInsufficiency(userId: number) {
    const dataUrl = 'AutomationTrigger/TatOutCloseInsufficiency?logginId=' + userId;
    return this.http.post<any>(dataUrl, null);
  }
  DOJRemainderMail(userId: number) {
    const dataUrl = 'AutomationTrigger/DOJRemainderMail?logginId=' + userId;
    return this.http.post<any>(dataUrl, null);
  }
  SendInvitationReminderMail(loggedIn: number) {
    const dataUrl = 'AutomationTrigger/SendInvitationReminderMail?loggedIn=' + loggedIn;
    return this.http.get<any>(dataUrl);
  }
  GetConsolidateInsuffMail(cumulative: boolean) {
    const dataUrl = 'AutomationTrigger/GetConsolidateInsuffMail?cumulative=' + cumulative;
    return this.http.get<any>(dataUrl);
  }
  SendClientAgreementReminderMail() {
    const dataUrl = 'AutomationTrigger/SendClientAgreementReminderMail';
    return this.http.get<any>(dataUrl);
  }
  ConsolidateDirectAppCandidateCreateACK() {
    const dataUrl = 'AutomationTrigger/ConsolidateDirectAppCandidateCreateACK';
    return this.http.get<any>(dataUrl);
  }
  ConsolidateDirectAppCandidateSubmissionACK() {
    const dataUrl = 'AutomationTrigger/ConsolidateDirectAppCandidateSubmissionACK';
    return this.http.get<any>(dataUrl);
  }
  // CalculateInprogress() {
  //   const dataUrl = 'AutomationTrigger/CalculateInprogressDays';
  //   return this.http.post<any>(dataUrl, null)
  // }
  SaveInvitationExpireDate() {
    const dataUrl = 'AutomationTrigger/SaveInvitationExpireDate';
    return this.http.post<any>(dataUrl, null);
  }
  //Added By Megala -20/04/2024
  CalculateInprogressDays(screeningCompId: number) {
    const dataUrl = 'AutomationTrigger/CalculateInprogressDays' + ((screeningCompId != null && screeningCompId != undefined && screeningCompId != 0) ? '?screeningCompId=' + screeningCompId : '');
    return this.http.post<any>(dataUrl, null);
  }
  InfoceptCaseCreation() {
    const dataUrl = 'InfoceptApi/CaseCreation';
    return this.http.post<any>(dataUrl, null);
  }
  InfoceptApiFTP() {
    const dataUrl = 'InfoceptApi/InfoceptFtp';
    return this.http.get<any>(dataUrl);
  }
  Savetemplate() {
    const dataUrl = 'EmailMaster/UpdateAllMailTemplate';
    return this.http.post<any>(dataUrl, null);
  }
  //
  GetMonthWiseComponentCompletedList() {
    const dataUrl = 'Report/GetMonthWiseComponentCompletedList';
    return this.http.get<any>(dataUrl);
  }
  GetFileCompletedMonthlyDataList() {
    const dataUrl = 'Report/GetFileCompletedMonthlyDataList';
    return this.http.get<any>(dataUrl);
  }
  GetMonthlySLAReportsList() {
    const dataUrl = 'Report/GetMonthlySLAReportsList';
    return this.http.get<any>(dataUrl);
  }
  GetIQCPartialDetails(loginUserDetVm: any) {
    const dataUrl = 'Qc/GetIQCPartialDetails';
    return this.http.post<any>(dataUrl, loginUserDetVm);
  }
  GetMonthlyStatisticsReports() {
    const dataUrl = 'Report/GetMonthlyStatisticsReports';
    return this.http.get<any>(dataUrl);
  }
  GetCumulativeMonthlyCasesAndChecksReportList() {
    const dataUrl = 'Report/GetCumulativeMonthlyCasesAndChecksReportList';
    return this.http.get<any>(dataUrl);
  }
  approvedFileMoveToTempPath(fromDate, toDate, type): Observable<any> {
    const dataUrl = 'AutomationTrigger/ApprovedFileMoveToTempPath?fromDate=' + fromDate + '&toDate=' + toDate +
      '&type=' + type;
    return this.http.post<any>(dataUrl, null);
  }

}
