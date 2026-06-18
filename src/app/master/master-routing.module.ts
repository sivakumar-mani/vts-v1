import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StateComponent } from './state/state.component';
import { CountryComponent } from './country/country.component';
import { UserComponent } from './user/user.component';
import { StatusListComponent } from './status-list/status-list.component';
import { InstituteComponent } from './institute/institute.component';
import { VendorEntryComponent } from './vendor/vendor-entry/vendor-entry.component';
import { ProfessionalListComponent } from './professional-list/professional-list.component';
import { ProfessionalDetailComponent } from './professional-detail/professional-detail.component';
import { ScreeningQuestionComponent } from './screening-question/screening-question.component';
import { EmailQueueComponent } from './email-queue/email-queue.component';
// tslint:disable-next-line:max-line-length
import { EmployerInstitutionentryListComponent } from './employer-institution/employer-institutionentry-list/employer-institutionentry-list.component';
// tslint:disable-next-line:max-line-length
import { AlertRulesComponent } from './alert-rules/alert-rules.component';
import { CallChargesComponent } from './call-charges/call-charges.component';
import { InstitutionFeesComponent } from './institution-fees/institution-fees.component';
import { DepartmentComponentsComponent } from './department-components/department-components.component';
import { SystemNotificationsComponent } from './system-notifications/system-notifications.component';
import { ComponentsDetailsComponent } from './components-details/components-details.component';
import { PredefinedRolesComponent } from './predefined-roles/predefined-roles.component';
import { SalesClientMappingComponent } from './sales-client-mapping/sales-client-mapping.component';
import { CanactivateGuard } from '../common-methods/guards/canactivate.guard';
import { EmailConfigComponent } from './email-config/email-config.component';
import { SubcomponentDetailsComponent } from './subcomponent-details/subcomponent-details.component';
import { DepartmentDetailsComponent } from './department-details/department-details.component';
import { AuditingDetailsComponent } from './auditing-details/auditing-details.component';
import { DrugComponent } from './drug/drug.component';
import { DrugKitComponent } from './drug-kit/drug-kit.component';
import { DrugPanelComponent } from './drug-panel/drug-panel.component';
import { InstutionComponent } from './employer-institution/instution/instution.component';
import { EmpInsProfDetailComponent } from '../common-methods/components/emp-ins-prof-detail/emp-ins-prof-detail.component';
import { InsForResearchComponent } from './ins-for-research/ins-for-research.component';
import { FakeEmployerComponent } from './fake-employer/fake-employer.component';
import { FakeInstitutionComponent } from './fake-institution/fake-institution.component';
import { PageNotFoundComponent } from '../common-methods/components/page-not-found/page-not-found.component';
import { MasterDataApprovalComponent } from '../master/master-data-approval/master-data-approval.component';
import { TeamUsersComponent } from './team-users/team-users.component';
import { TeamComponent } from './team/team.component';
import { TeamsComponent } from './teams/teams.component';
import { ContactRemarksComponent } from './contact-remarks/contact-remarks.component';
import { DistrictComponent } from './district/district.component';
import { CityComponent } from './city/city.component';
import { PlaceComponent } from './place/place.component';
import { OrganizationInfoComponent } from './organization-info/organization-info.component';
import { CourseMasterComponent } from './course-master/course-master.component';
import { DataSetRecordCheckComponent } from './data-set-record-check/data-set-record-check.component';
import { OnlinerecordcheckComponent } from './onlinerecordcheck/onlinerecordcheck.component';
import { RecordCheckCategoryMappingComponent } from './record-check-category-mapping/record-check-category-mapping.component';
import { InsufficiencyDocumentComponent } from './insufficiency-document/insufficiency-document.component';
import { LookupComponent } from './lookup/lookup.component';
import { LookupCategoryComponent } from './lookup-category/lookup-category.component';
import { HoildayComponent } from './hoilday/hoilday.component';
import { InvoicetaxComponent } from './invoicetax/invoicetax.component';
import { ResearchQuesComponent } from './research-emp-ques/research-ques.component';
import { ResearchEmpAnswerComponent } from './research-emp-answer/research-emp-answer.component';
import { ResearchInstQuesComponent } from './research-inst-ques/research-inst-ques.component';
import { ResearchInstAnsComponent } from './research-inst-ans/research-inst-ans.component';
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
// import { InternationalBillingAmountComponent } from './international-billing-amount/international-billing-amount.component';
const routes: Routes = [
  {
    path: 'country', component: CountryComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'state', component: StateComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'district', component: DistrictComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'city', component: CityComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'place', component: PlaceComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'user', component: UserComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'institute', component: InstituteComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'status', component: StatusListComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'vendorentry', component: VendorEntryComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'vendoruser', component: VendorUserComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'drugkit', component: DrugKitComponent,
    canActivate: [CanactivateGuard]
  },
  { path: 'professionallist', component: ProfessionalListComponent },
  { path: 'professionaldetail', component: ProfessionalDetailComponent },
  {
    path: 'screeningquestion', component: ScreeningQuestionComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'emailqueue', component: EmailQueueComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'employerinstutionentrylist', component: EmployerInstitutionentryListComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'fakeemployer', component: FakeEmployerComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'fakeinstitution', component: FakeInstitutionComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'alertrules', component: AlertRulesComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'charges', component: CallChargesComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'instutitefee', component: InstitutionFeesComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'departments', component: DepartmentComponentsComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'notifications', component: SystemNotificationsComponent,
    canActivate: [CanactivateGuard]
  },
  {
    // ComponentsDetailsComponent SubcomponentDetailsComponent DepartmentDetailsComponent AuditingDetailsComponent
    path: 'components', component: ComponentsDetailsComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'roles', component: PredefinedRolesComponent,
    canActivate: [CanactivateGuard]
  },
  { path: 'clientroles', component: PredefinedRolesComponent },
  {
    path: 'saleclientmapping', component: SalesClientMappingComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'emailconfig', component: EmailConfigComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'subcomponents', component: SubcomponentDetailsComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'department', component: DepartmentDetailsComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'auditing', component: AuditingDetailsComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'drug', component: DrugComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'drugpanel', component: DrugPanelComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'institution', component: InstutionComponent,
    canActivate: [CanactivateGuard]
  },
  // {
  //   path: 'teamusers', component: TeamUsersComponent,
  //   canActivate: [CanactivateGuard], data: { moduleName: 'Configure', screenName: 'Department Team Users' }
  // },
  {
    path: 'clientTeam', component: TeamComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'team', component: TeamsComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'empInsProfDetail', component: EmpInsProfDetailComponent
  },

  {
    path: 'empRe-Verify', component: EmpReVerifyComponent
  },

  {
    path: 'empResearch',
    children: [{
      path: 'forresearch',
      component: InsForResearchComponent
    },
    {
      path: 'clientsuspect',
      component: InsForResearchComponent
    },
    {
      path: 'underreview',
      component: InsForResearchComponent
    },
    {
      path: 'approvalpending',
      component: InsForResearchComponent
    },
    {
      path: 'rejected',
      component: InsForResearchComponent
    },
    {
      path: 'verified',
      component: InsForResearchComponent
    },
    {
      path: 'reverify',
      component: InsForResearchComponent
    }]
  },
  {
    path: 'insResearch',
    children: [{
      path: 'forresearch',
      component: InsForResearchComponent
    },
    {
      path: 'clientsuspect',
      component: InsForResearchComponent
    },
    {
      path: 'underreview',
      component: InsForResearchComponent
    },
    {
      path: 'approvalpending',
      component: InsForResearchComponent
    },
    {
      path: 'rejected',
      component: InsForResearchComponent
    },
    {
      path: 'verified',
      component: InsForResearchComponent
    }]
  },
  {
    path: 'masterdataapproval', component: MasterDataApprovalComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'organizationInfo', component: OrganizationInfoComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'courseMaster', component: CourseMasterComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'recordcheck', component: DataSetRecordCheckComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'onlinerecordcheck', component: OnlinerecordcheckComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'recordCheckCategoryMapping', component: RecordCheckCategoryMappingComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'insufficiencydocument', component: InsufficiencyDocumentComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'lookupcategory', component: LookupCategoryComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'lookup', component: LookupComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'holiday', component: HoildayComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'invoicetax', component: InvoicetaxComponent,
    canActivate: [CanactivateGuard]
  },
  // {
  //   path: 'InternationalBilling', component: InternationalBillingAmountComponent,
   
  // },
  {
    path: 'mode-of-verification-components', component: ModeOfVerificationComponentsComponent,
  },
  {
    path: 'ResearchEmployeeQuestion', component: ResearchQuesComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'ResearchEmployeeAnswer', component: ResearchEmpAnswerComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'ResearchInstitutionQuestion', component: ResearchInstQuesComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'ResearchInstitutionAnswer', component: ResearchInstAnsComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'module', component: ModuleComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'subModule', component: SubModuleComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'screen', component: ScreenComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'ResearchQASubdetail', component: QASubdetailComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'license', component: LicenseCreationComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'recruiterdetails', component: RecruiterDetailsComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'dojlapsedupload', component: DojBulkuploadComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'ResearchBusinessCategoryMapping', component: ResearchBusinessCategoryMappingComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: '**', component: PageNotFoundComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRoutingModule {
}
