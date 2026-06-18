import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { ScreeningRoutingModule } from './screening-routing.module';
import { MaterialModule } from '../common-methods/modules/material.module';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { CandidateComponent } from './client-file-submission/candidate/candidate.component';
import { CandidateaddinfoComponent } from './candidateaddinfo/candidateaddinfo.component';
// import { HighlightPipe } from '../common-methods/pipes/highlightpipe';
import { LasttransactionComponent } from './lasttransaction/lasttransaction.component';
import { SharedModule } from '../common-methods/modules/shared.module';
import { EducationComponent } from './DynamicComponents/education/education.component';
import { EmploymentComponent } from './DynamicComponents/employment/employment.component';
import { CaseCreatedListComponent } from './case-created-list/case-created-list.component';
import { ClientFileSubmissionComponent } from './client-file-submission/client-file-submission.component';
import { ClientDetailsComponent } from './client-file-submission/client-details/client-details.component';
import { ScreeningComponentsComponent } from './client-file-submission/screening-components/screening-components.component';
import { PanComponent } from './DynamicComponents/pan/pan.component';
import { DrugTestComponent } from './DynamicComponents/drug-test/drug-test.component';
import { AddressGeoComponent } from './DynamicComponents/address-geo/address-geo.component';
import { NiciComponent } from './DynamicComponents/nici/nici.component';
import { BaseInfoComponent } from './DynamicComponents/base-info/base-info.component';
import { LicenseComponent } from './DynamicComponents/license/license.component';
import { PassportComponent } from './DynamicComponents/passport/passport.component';
import { VoterIdComponent } from './DynamicComponents/voter-id/voter-id.component';
import { CompanySiteVisitComponent } from './DynamicComponents/company-site-visit/company-site-visit.component';
// import { QuesAnsComponent } from './DynamicComponents/ques-ans/ques-ans.component';
import { EmployementSupComponent } from './DynamicComponents/employement-sup/employement-sup.component';
import { ReferenceCheckComponent } from './DynamicComponents/reference-check/reference-check.component';
import { RefSelfEmpComponent } from './DynamicComponents/ref-self-emp/ref-self-emp.component';
import { CrcComponent } from './DynamicComponents/crc/crc.component';
import { CriminalCheckPcc2Component } from './DynamicComponents/criminal-check-pcc2/criminal-check-pcc2.component';
import { RaiseInsuffListComponent } from './raise-insuff-list/raise-insuff-list.component';
import { CrminalCheckPcc3Component } from './DynamicComponents/crminal-check-pcc3/crminal-check-pcc3.component';
import { EmphrEmpsupComponent } from './DynamicComponents/emphr-empsup/emphr-empsup.component';
import { CustomFieldsComponent } from './DynamicComponents/custom-fields/custom-fields.component';
import { GapVerificationComponent } from './DynamicComponents/gap-verification/gap-verification.component';
import { EmergencyContactComponent } from './DynamicComponents/emergency-contact/emergency-contact.component';
import { JudisCourtRecordComponent } from './DynamicComponents/judis-court-record/judis-court-record.component';
import { SsnTraceComponent } from './DynamicComponents/ssn-trace/ssn-trace.component';
import { BankStatementComponent } from './DynamicComponents/bank-statement/bank-statement.component';
import { AbroadFileSubmissionComponent } from './abroad-file-submission/abroad-file-submission.component';
import { CvValidationComponent } from './DynamicComponents/cv-validation/cv-validation.component';
import { CallchargeLimitComponent } from './DynamicComponents/callcharge-limit/callcharge-limit.component';
import { AbroadComponent } from './DynamicComponents/abroad/abroad.component';
import { AddNewComponent } from './DynamicComponents/add-new/add-new.component';
import { GapReasonComponent } from './DynamicComponents/gap-reason/gap-reason.component';
import { CandidateLoaComponent } from './client-file-submission/candidate-loa/candidate-loa.component';
import { PreDataComponent } from './DynamicComponents/pre-data/pre-data.component';
import { EmpUanComponent } from './DynamicComponents/emp-uan/emp-uan.component';
import { DirectorshipComponent } from './DynamicComponents/directorship/directorship.component';
import { PaymentGatewayComponent } from '../common-methods/payment-gateway/payment-gateway.component';
import { IcertiscandidatesComponent } from '../icertiscandidates/icertiscandidates.component';
import { PaymenthistoryComponent } from '../paymenthistory/paymenthistory.component';
import { SocialMediaComponent } from './DynamicComponents/social-media/social-media.component';
import { OigComponent } from './DynamicComponents/oig/oig.component';
import { GsaComponent } from './DynamicComponents/gsa/gsa.component';
import { NsrComponent } from './DynamicComponents/nsr/nsr.component';
import { FdaComponent } from './DynamicComponents/fda/fda.component';
import { CandidateFileSubmissionComponent } from './candidate-file-submission/candidate-file-submission.component';
import { CcandidateComponent } from './candidate-file-submission/ccandidate/ccandidate.component';
import { CcandidateLoaComponent } from './candidate-file-submission/ccandidate-loa/ccandidate-loa.component';
import { CscreeningReviewComponent } from './candidate-file-submission/cscreening-review/cscreening-review.component';
import { CscreeningComponentsComponent } from './candidate-file-submission/cscreening-components/cscreening-components.component';
import { CscreeningDocumentsComponent } from './candidate-file-submission/cscreening-documents/cscreening-documents.component';

import { tatcrossedInsuffListComponent } from './tat-crossed-insuff-list/tat-crossed-insuff-list.component';
//import { ClientAppComponent } from './client-app/client-app.component';
import { ClientAppSubmissionComponent } from './client-app-submission/client-app-submission.component';
import { DirectAppSubmissionComponent } from './direct-app-submission/direct-app-submission.component';
import { ClientAppCandidateDetailsComponent } from './client-app-submission/client-app-candidate-details/client-app-candidate-details.component';
import { ClientAppClientDetailsComponent } from './client-app-submission/client-app-client-details/client-app-client-details.component';
import { ClientAppDocumentUploadComponent } from './client-app-submission/client-app-document-upload/client-app-document-upload.component';
import { ClientAppScreeningComponentComponent } from './client-app-submission/client-app-screening-component/client-app-screening-component.component';
import { ClientAppScreeningReviewComponent } from './client-app-submission/client-app-screening-review/client-app-screening-review.component';
import { DirectAppCandidateDetailsComponent } from './direct-app-submission/direct-app-candidate-details/direct-app-candidate-details.component';
import { DirectAppScreeningComponentComponent } from './direct-app-submission/direct-app-screening-component/direct-app-screening-component.component';
import { DirectAppScreeningReviewComponent } from './direct-app-submission/direct-app-screening-review/direct-app-screening-review.component';
import { DirectAppLoaDocumentComponent } from './direct-app-submission/direct-app-loa-document/direct-app-loa-document.component';
import { CommonLicenseComponent } from './CommonComponents/common-license/common-license.component';
import { CommonVoderidComponent } from './CommonComponents/common-voderid/common-voderid.component';
import { CommonPancardComponent } from './CommonComponents/common-pancard/common-pancard.component';
import { CommonSocialMediaComponent } from './CommonComponents/common-social-media/common-social-media.component';
import { CommonBankComponent } from './CommonComponents/common-bank/common-bank.component';
import { CommonDirectorshipComponent } from './CommonComponents/common-directorship/common-directorship.component';
import { CommonOigComponent } from './CommonComponents/common-oig/common-oig.component';
import { CommonAddNewComponent } from './CommonComponents/common-add-new/common-add-new.component';
import { CommonNiciComponent } from './CommonComponents/common-nici/common-nici.component';
import { CommonPassportComponent } from './CommonComponents/common-passport/common-passport.component';
import { CommonAddressGeoComponent } from './CommonComponents/common-address-geo/common-address-geo.component';
import { CommonEmphrEmpsupComponent } from './CommonComponents/common-emphr-empsup/common-emphr-empsup.component';
import { CommonEmloyementComponent } from './CommonComponents/common-emloyement/common-emloyement.component';
import { CommonEducationComponent } from './CommonComponents/common-education/common-education.component';
import { CommonAbroadComponent } from './CommonComponents/common-abroad/common-abroad.component';
import { CommonCrcComponent } from './CommonComponents/common-crc/common-crc.component';
import { CommonGsaComponent } from './CommonComponents/common-gsa/common-gsa.component';
import { CommonRaiseInsufficiencyComponent } from './CommonComponents/common-raise-insufficiency/common-raise-insufficiency.component';
import { CommonPreDataComponent } from './CommonComponents/common-pre-data/common-pre-data.component';
import { CommonBaseInfoComponent } from './CommonComponents/common-base-info/common-base-info.component';
import { CommonCvValidationComponent } from './CommonComponents/common-cv-validation/common-cv-validation.component';
import { CommonCompSiteVisitComponent } from './CommonComponents/common-comp-site-visit/common-comp-site-visit.component';
import { CommonEmpUanComponent } from './CommonComponents/common-emp-uan/common-emp-uan.component';
import { CommonGapVerificationComponent } from './CommonComponents/common-gap-verification/common-gap-verification.component';
import { CommonCustomFieldsComponent } from './CommonComponents/common-custom-fields/common-custom-fields.component';
import { CommonCallchargeLimitComponent } from './CommonComponents/common-callcharge-limit/common-callcharge-limit.component';
import { CommonCriminalCheckPcc2Component } from './CommonComponents/common-criminal-check-pcc2/common-criminal-check-pcc2.component';
import { CommonCriminalCheckPcc3Component } from './CommonComponents/common-criminal-check-pcc3/common-criminal-check-pcc3.component';
import { CommonDrugTestComponent } from './CommonComponents/common-drug-test/common-drug-test.component';
import { CommonEmergencyContactComponent } from './CommonComponents/common-emergency-contact/common-emergency-contact.component';
import { CommonEmployementSupComponent } from './CommonComponents/common-employement-sup/common-employement-sup.component';
import { CommonFdaComponent } from './CommonComponents/common-fda/common-fda.component';
import { CommonGapReasonComponent } from './CommonComponents/common-gap-reason/common-gap-reason.component';
import { CommonJudisCourtRecordComponent } from './CommonComponents/common-judis-court-record/common-judis-court-record.component';
import { CommonNsrComponent } from './CommonComponents/common-nsr/common-nsr.component';
import { CommonQuesAnsComponent } from './CommonComponents/common-ques-ans/common-ques-ans.component';
import { CommonRefSelfEmpComponent } from './CommonComponents/common-ref-self-emp/common-ref-self-emp.component';
import { CommonSsnTraceComponent } from './CommonComponents/common-ssn-trace/common-ssn-trace.component';
import { CommonReferenceCheckComponent } from './CommonComponents/common-reference-check/common-reference-check.component';
import { CommonEducationInternationalComponent } from './CommonComponents/common-education-international/common-education-international.component';
import { CommonEmploymentInternationalComponent } from './CommonComponents/common-employment-international/common-employment-international.component';
import { CommonCurrentEmploymentComponent } from './CommonComponents/common-current-employment/common-current-employment.component';
import { CommonPreviousEmploymentComponent } from './CommonComponents/common-previous-employment/common-previous-employment.component';
import { CurrentEmploymentComponent } from './DynamicComponents/current-employment/current-employment.component';
import { PreviousEmploymentComponent } from './DynamicComponents/previous-employment/previous-employment.component';
import { CommonDatabaseComponent } from './CommonComponents/common-database/common-database.component';
import { CommonFileDatabaseComponent } from './CommonComponents/common-file-database/common-file-database.component';
import { CommonMhcpComponent } from './CommonComponents/common-mhcp/common-mhcp.component';
import { MhcpComponent } from './DynamicComponents/mhcp/mhcp.component';
import { CommonOcrUploadComponent } from './shared/common-ocr-upload/common-ocr-upload.component';
//import { DatabaseQuesAnsComponent } from './DynamicComponents/database-ques-ans/database-ques-ans.component';
import { ClientBulkCaseCreationComponent } from '../common-methods/components/client-bulk-case-creation/client-bulk-case-creation.component';

@NgModule({
  declarations: [
    CandidateComponent,
    EmpUanComponent,
    GsaComponent,
    FdaComponent,
    NsrComponent,
    CandidateaddinfoComponent,
    // HighlightPipe,
    LasttransactionComponent,
    EducationComponent,
    EmploymentComponent,
    CaseCreatedListComponent,
    ClientFileSubmissionComponent,
    ClientDetailsComponent,
    // ScreeingReviewComponent,
    ScreeningComponentsComponent,
    PanComponent,
    DrugTestComponent,
    AddressGeoComponent,
    NiciComponent,
    BaseInfoComponent,
    LicenseComponent,
    PassportComponent,
    VoterIdComponent,
    CompanySiteVisitComponent,
    // QuesAnsComponent,
    EmployementSupComponent,
    ReferenceCheckComponent,
    RefSelfEmpComponent,
    CrcComponent,
    CriminalCheckPcc2Component,
    RaiseInsuffListComponent,
    CrminalCheckPcc3Component,
    // CommonReviewComponent,
    EmphrEmpsupComponent,
    CustomFieldsComponent,
    GapVerificationComponent,
    EmergencyContactComponent,
    JudisCourtRecordComponent,
    SsnTraceComponent,
    BankStatementComponent,
    AbroadFileSubmissionComponent,
    CvValidationComponent,
    CallchargeLimitComponent,
    AbroadComponent,
    AddNewComponent,
    GapReasonComponent,
    CandidateLoaComponent,
    PreDataComponent,
    DirectorshipComponent,
    PaymentGatewayComponent,
    IcertiscandidatesComponent,
    PaymenthistoryComponent,
    SocialMediaComponent,
    OigComponent,
    CommonOcrUploadComponent,
    ClientBulkCaseCreationComponent,
    CandidateFileSubmissionComponent,
    CcandidateComponent,
    CcandidateLoaComponent,
    CscreeningReviewComponent,
    CscreeningComponentsComponent,
    CscreeningDocumentsComponent,
    tatcrossedInsuffListComponent,
    //ClientAppComponent,
    ClientAppSubmissionComponent,
    DirectAppSubmissionComponent,
    ClientAppCandidateDetailsComponent,
    ClientAppClientDetailsComponent,
    ClientAppDocumentUploadComponent,
    ClientAppScreeningComponentComponent,
    ClientAppScreeningReviewComponent,
    DirectAppCandidateDetailsComponent,
    DirectAppScreeningComponentComponent,
    DirectAppScreeningReviewComponent,
    DirectAppLoaDocumentComponent,
    CommonLicenseComponent,
    CommonVoderidComponent,
    CommonPancardComponent,
    CommonSocialMediaComponent,
    CommonBankComponent,
    CommonDirectorshipComponent,
    CommonOigComponent,
    CommonAddNewComponent,
    CommonNiciComponent,
    CommonPassportComponent,
    CommonAddressGeoComponent,
    CommonEmphrEmpsupComponent,
    CommonEmloyementComponent,
    CommonEducationComponent,
    CommonAbroadComponent,
    CommonCrcComponent,
    CommonGsaComponent,
    CommonRaiseInsufficiencyComponent,
    CommonPreDataComponent,
    CommonBaseInfoComponent,
    CommonCvValidationComponent,
    CommonCompSiteVisitComponent,
    CommonEmpUanComponent,
    CommonGapVerificationComponent,
    CommonCustomFieldsComponent,
    CommonCallchargeLimitComponent,
    CommonCriminalCheckPcc2Component,
    CommonCriminalCheckPcc3Component,
    CommonDrugTestComponent,
    CommonEmergencyContactComponent,
    CommonEmployementSupComponent,
    CommonFdaComponent,
    CommonGapReasonComponent,
    CommonJudisCourtRecordComponent,
    CommonNsrComponent,
    CommonQuesAnsComponent,
    CommonRefSelfEmpComponent,
    CommonReferenceCheckComponent,
    CommonSsnTraceComponent,
    CommonEducationInternationalComponent,
    CommonEmploymentInternationalComponent,
    CommonCurrentEmploymentComponent,
    CommonPreviousEmploymentComponent,
    CurrentEmploymentComponent,
    PreviousEmploymentComponent,
    CommonDatabaseComponent,
    CommonFileDatabaseComponent,
    CommonMhcpComponent,
    MhcpComponent,
    //DatabaseQuesAnsComponent,
  ],
  imports: [
    CommonModule,
    ScreeningRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    SharedModule,
    ScrollingModule
  ]
})
export class ScreeningModule { }
