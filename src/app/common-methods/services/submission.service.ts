import { Injectable } from '@angular/core';
import { Observable, Observer, BehaviorSubject, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EndPointConstants } from '../CommonConstants/EndPointConstants';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {
  constructor(private http: HttpClient) {
  }
  getCandidateDetail(userId): Observable<any> {
    // GetCandidateAndScreeningDet
    const dataUrl = EndPointConstants.FSGetCandidateDetails + userId;
    return this.http.get<any>(dataUrl);
  }
  saveCandidateDetail(screeningDetails: FormData): Observable<any> {
    const dataUrl = EndPointConstants.FSSaveCandidateDetails;
    return this.http.post<any>(dataUrl, screeningDetails);
  }
  saveCurrentAddressDetail(loginUserId, reportSource): Observable<any> {
    const dataUrl = EndPointConstants.FSCurrentAddressDetails + loginUserId + '&reportSource=' + reportSource;
    return this.http.get<any>(dataUrl);
  } getCandidateClientDetails(caseNo): Observable<any> {
    const dataUrl = EndPointConstants.FSGetCandidateClientDetails + caseNo;
    return this.http.get<any>(dataUrl);
  }
  saveCandidateClientDetails(screeningDetails: FormData): Observable<any> {
    const dataUrl = EndPointConstants.FSSaveCandidateClientDetails;
    return this.http.post<any>(dataUrl, screeningDetails);
  }
  //screening
  getScreeningComDetails(screeningId, compId, preQcFlag): Observable<any> {
    const dataUrl = 'FileSubmission/GetAllComponentDetails?screeningId=' + screeningId + '&compId=' + compId + '&preQcFlag=' + preQcFlag;
    return this.http.get<any>(dataUrl);
  }
  getClientDetails(caseNo): Observable<any> {
    const dataUrl = EndPointConstants.FSGetClientScreeningDetails + '?caseNo=' + caseNo;
    return this.http.get<any>(dataUrl);
  }
  addClientDetails(clientDetails): Observable<any> {
    const dataUrl = EndPointConstants.FSSaveClientScreeningDetails
    return this.http.post<any>(dataUrl, clientDetails);
  }

  //screeningComponent
  getScreeningDetails(caseNo, preQcFlag): Observable<any> {
    const dataUrl = EndPointConstants.FSGetScreeningDetails + '?caseNo=' + caseNo + '&preQcFlag=' + preQcFlag;
    return this.http.get<any>(dataUrl);
  }
  getScreeningCompDetails(screeningId, compId, preQcFlag): Observable<any> {
    const dataUrl = 'FileSubmission/GetAllComponentDetails?screeingId=' + screeningId + '&compId=' + compId + '&preQcFlag=' + preQcFlag;
    return this.http.get<any>(dataUrl);
  }
  addScreeningCompDetails(screeningCompDetails: FormData, type): Observable<any> {
    const dataUrl = 'FileSubmission/' + type
    return this.http.post<any>(dataUrl, screeningCompDetails);
  }
  getLoaDetail(caseNo): Observable<any> {
    // GetCandidateAndScreeningDet
    const dataUrl = EndPointConstants.FSGetLoaDocumentDetails + caseNo;
    return this.http.get<any>(dataUrl);
  }
  saveLoaDetails(fSLoaDocument: FormData): Observable<any> {
    const dataUrl = EndPointConstants.FSSaveLoaDocumentDetails;
    return this.http.post<any>(dataUrl, fSLoaDocument);
  }
  saveInvitationDetail(fSLoaDocument): Observable<any> {
    const dataUrl = EndPointConstants.FSSaveInvitationDetail;
    return this.http.post<any>(dataUrl, fSLoaDocument);
  }
  getReviewDetail(caseNo, userId): Observable<any> {
    // GetCandidateAndScreeningDet
    const dataUrl = 'FileSubmission/GetReview?caseNo=' + caseNo + '&loggedIn=' + userId;
    return this.http.get<any>(dataUrl);
  }
  getReviewClientDetail(caseNo, userId): Observable<any> {
    // GetCandidateAndScreeningDet
    const dataUrl = 'FileSubmission/GetReviewClient?caseNo=' + caseNo + '&loggedIn=' + userId;
    return this.http.get<any>(dataUrl);
  }
  getGapReasonDetail(screeningId): Observable<any> {
    const dataUrl = EndPointConstants.FSGetGapReasonDetails + screeningId;
    return this.http.get<any>(dataUrl);
  }

  saveGapReasonDetails(screeningCompDetails: FormData): Observable<any> {
    const dataUrl = 'FileSubmission/SaveGapReason'
    return this.http.post<any>(dataUrl, screeningCompDetails);
  }
  getEduGapReasonDetail(screeningId, compId): Observable<any> {
    const dataUrl = EndPointConstants.FSGetGapEduReasonDetails + screeningId + '&compId=' + compId;
    return this.http.get<any>(dataUrl);
  }
  getEmpGapReasonDetail(screeningId, compId): Observable<any> {
    const dataUrl = EndPointConstants.FSGetGapEmpReasonDetails + screeningId + '&compId=' + compId;
    return this.http.get<any>(dataUrl);
  }
  saveDirectAppAutoCreateComponents(formAddressData): Observable<any> {
    const dataUrl = EndPointConstants.FSDirectAppAutoCreateComponents ;
    return this.http.post<any>(dataUrl,formAddressData);
  }

}
