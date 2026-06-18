import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MasterRoutingModule } from './master-routing.module';
import { MaterialModule } from '../common-methods/modules/material.module';
import { StateComponent } from './state/state.component';
import { ToastModule } from 'primeng/toast';
import { VendorEntryComponent } from './vendor/vendor-entry/vendor-entry.component';
import { CountryComponent } from './country/country.component';
import { UserComponent } from './user/user.component';
import { ProfessionalDetailComponent } from './professional-detail/professional-detail.component';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { StatusListComponent } from './status-list/status-list.component';
import { InstituteComponent } from './institute/institute.component';
import { ProfessionalListComponent } from './professional-list/professional-list.component';
import { ScreeningQuestionComponent } from './screening-question/screening-question.component';
import { EmailQueueComponent } from './email-queue/email-queue.component';
import { AlertRulesComponent } from './alert-rules/alert-rules.component';
// tslint:disable-next-line:max-line-length
import { EmployerInstitutionentryListComponent } from './employer-institution/employer-institutionentry-list/employer-institutionentry-list.component';
// tslint:disable-next-line:max-line-length
import { CallChargesComponent } from './call-charges/call-charges.component';
// import { InstitutionFeesComponent } from './institution-fees/institution-fees.component';
import { SharedModule } from '../common-methods/modules/shared.module';
import { DepartmentComponentsComponent } from './department-components/department-components.component';
import { SalesClientMappingComponent } from './sales-client-mapping/sales-client-mapping.component';
import { SystemNotificationsComponent } from './system-notifications/system-notifications.component';
import { ComponentsDetailsComponent } from './components-details/components-details.component';
import { PredefinedRolesComponent } from './predefined-roles/predefined-roles.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { EmailConfigComponent } from './email-config/email-config.component';
import { SubcomponentDetailsComponent } from './subcomponent-details/subcomponent-details.component';
import { DepartmentDetailsComponent } from './department-details/department-details.component';
import { AuditingDetailsComponent } from './auditing-details/auditing-details.component';
import { DrugKitComponent } from './drug-kit/drug-kit.component';
import { DrugComponent } from './drug/drug.component';
import { DrugPanelComponent } from './drug-panel/drug-panel.component';
// import { EmpInsProfDetailComponent } from '../common-methods/components/emp-ins-prof-detail/emp-ins-prof-detail.component';
import { InstutionComponent } from './employer-institution/instution/instution.component';
import { InsForResearchComponent } from './ins-for-research/ins-for-research.component';
import { FakeEmployerComponent } from './fake-employer/fake-employer.component';
import { FakeInstitutionComponent } from './fake-institution/fake-institution.component';
import { MasterDataApprovalComponent } from './master-data-approval/master-data-approval.component';
import { TeamComponent } from './team/team.component';
import { TeamUsersComponent } from './team-users/team-users.component';
import { TeamsComponent } from './teams/teams.component';
import { PlaceComponent } from './place/place.component';
import { DistrictComponent } from './district/district.component';
import { CityComponent } from './city/city.component';
import { OrganizationInfoComponent } from './organization-info/organization-info.component';
import { CourseMasterComponent } from './course-master/course-master.component';
import { DataSetRecordCheckComponent } from './data-set-record-check/data-set-record-check.component';
import { OnlinerecordcheckComponent } from './onlinerecordcheck/onlinerecordcheck.component';
import { RecordCheckCategoryMappingComponent } from './record-check-category-mapping/record-check-category-mapping.component';
import { InsufficiencyDocumentComponent } from './insufficiency-document/insufficiency-document.component';
import { LookupCategoryComponent } from './lookup-category/lookup-category.component';
import { LookupComponent } from './lookup/lookup.component';
import { HoildayComponent } from './hoilday/hoilday.component';
import { InvoicetaxComponent } from './invoicetax/invoicetax.component';
import { ResearchEmpAnswerComponent } from './research-emp-answer/research-emp-answer.component';
import { ResearchInstQuesComponent } from './research-inst-ques/research-inst-ques.component';
import { ResearchInstAnsComponent } from './research-inst-ans/research-inst-ans.component';
import { ResearchQuesComponent } from './research-emp-ques/research-ques.component';
import { CommonAddEmpInsComponent } from './common-add-emp-ins/common-add-emp-ins.component';
import { ModuleComponent } from './module/module.component';
import { SubModuleComponent } from './sub-module/sub-module.component';
import { ScreenComponent } from './screen/screen.component';
import { QASubdetailComponent } from './qa-subdetail/qa-subdetail.component';
import { LicenseCreationComponent } from './license-creation/license-creation.component';
// tslint:disable-next-line:max-line-length
import { ResearchBusinessCategoryMappingComponent } from './research-business-category-mapping/research-business-category-mapping.component';
import { RecruiterDetailsComponent } from './recruiter details/recruiter details.component';
import { DojBulkuploadComponent } from './doj-bulkupload/doj-bulkupload.component';
import { VendorUserComponent } from './vendor-user/vendor-user.component';
import { EmpReVerifyComponent } from './emp-re-verify/emp-re-verify.component';
import { ModeOfVerificationComponentsComponent } from './mode-of-verification-components/mode-of-verification-components.component';
// import { InternationalBillingAmountComponent } from './international-billing-amount/international-billing-amount.component';

@NgModule({
  declarations: [
    CountryComponent,
    StateComponent,
    UserComponent,
    ProfessionalDetailComponent,
    StatusListComponent,
    InstituteComponent,
    VendorEntryComponent,
    ProfessionalListComponent,
    ScreeningQuestionComponent,
    EmailQueueComponent,
    InstituteComponent,
    AlertRulesComponent,
    EmployerInstitutionentryListComponent,
    CallChargesComponent,
    // InstitutionFeesComponent,
    DepartmentComponentsComponent,
    SystemNotificationsComponent,
    ComponentsDetailsComponent,
    PredefinedRolesComponent,
    SalesClientMappingComponent,
    EmailConfigComponent,
    SubcomponentDetailsComponent,
    DepartmentDetailsComponent,
    AuditingDetailsComponent,
    DrugKitComponent,
    DrugComponent,
    DrugPanelComponent,
    // EmpInsProfDetailComponent,
    InstutionComponent,
    InsForResearchComponent,
    FakeEmployerComponent,
    FakeInstitutionComponent,
    MasterDataApprovalComponent,
    TeamComponent,
    TeamUsersComponent,
    TeamsComponent,
    PlaceComponent,
    DistrictComponent,
    CityComponent,
    OrganizationInfoComponent,
    CourseMasterComponent,
    DataSetRecordCheckComponent,
    OnlinerecordcheckComponent,
    RecordCheckCategoryMappingComponent,
    InsufficiencyDocumentComponent,
    LookupCategoryComponent,
    LookupComponent,
    HoildayComponent,
    InvoicetaxComponent,
    // InternationalBillingAmountComponent,
    ResearchEmpAnswerComponent,
    ResearchInstQuesComponent,
    ResearchInstAnsComponent,
    ResearchQuesComponent,
    CommonAddEmpInsComponent,
    InvoicetaxComponent,
    ModuleComponent,
    SubModuleComponent,
    ScreenComponent,
    QASubdetailComponent,
    LicenseCreationComponent,
    ResearchBusinessCategoryMappingComponent,
    RecruiterDetailsComponent,
    DojBulkuploadComponent,
    VendorUserComponent,
    EmpReVerifyComponent,
    ModeOfVerificationComponentsComponent
  ],
  imports: [
    CommonModule,
    MasterRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    ToastModule,
    SharedModule,
    AngularEditorModule,
    ScrollingModule
  ],
})
export class MasterModule { }
