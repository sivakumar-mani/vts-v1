import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthCallbackComponent } from 'src/app/auth-callback/auth-callback.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent, GlobalSearch } from './dashboard/dashboard.component';
import { HomeComponent } from './dashboard/home/home.component';
// import { FormsComponent } from './dashboard/forms/forms.component';
import { LandingComponent } from './login/landing/landing.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { IconsComponent } from './dashboard/forms/icons/icons.component';
import { StepperComponent } from './dashboard/stepper/stepper.component';
import { CanactivateGuard } from './common-methods/guards/canactivate.guard';
import { PageNotFoundComponent } from './common-methods/components/page-not-found/page-not-found.component';
import { DepartteamComponent } from './dashboard/forms/departteam/departteam.component';
import { NotificationComponent } from './dashboard/notification/notification.component';
import { DboardComponent } from './dashboard/dboard/dboard.component';
import { ReportDesignComponent } from './dashboard/forms/report-design/report-design.component';
import { VtsdashboardComponent } from './dashboard/vtsdashboard/vtsdashboard.component';
import { GlobalSearchComponent } from './dashboard/global-search/global-search.component';
import { DigitaladdressverficationComponent } from './digitaladdressverfication/digitaladdressverfication.component';
import { SelectpackageaddtionalchecksComponent } from './selectpackageaddtionalchecks/selectpackageaddtionalchecks.component';
import { AddtionalchecksComponent } from './selectpackageaddtionalchecks/addtionalchecks/addtionalchecks.component';
import { CandidateregisterComponent } from './selectpackageaddtionalchecks/candidateregister/candidateregister.component';
import { DirectAppCandidateInsuffComponent } from './direct-app-candidate-insuff/direct-app-candidate-insuff.component';
import { DeptChooseComponent } from './login/dept-choose/dept-choose.component';
import { UndermaintanceComponent } from './undermaintance/undermaintance.component';
import { CaptureMainComponent } from './liveCapture/capture-main/capture-main.component';
import { AdvanceSearchComponent } from './dashboard/advancesearch/advance-search.component';
import { DigilockerCallbackComponentComponent } from './digilocker-callback/digilocker-callback-component/digilocker-callback-component.component';
import { UrlExpiredComponent } from './common-methods/components/url-expired/url-expired.component';
import { SsologinComponent } from './login/ssologin/ssologin.component';
const routes: Routes = [
  { path: 'ssologin', component: SsologinComponent },
  { path: '', component: LandingComponent },
  { path: 'pagemaintance', component: UndermaintanceComponent },
  { path: 'login', component: LoginComponent },
  { path: 'deptChoose', component: DeptChooseComponent },
  { path: 'auth-callback', component: AuthCallbackComponent },
  {
    path: 'dashboard', component: DashboardComponent,
    children: [
      {
        path: 'home', component: HomeComponent, canActivate: [CanactivateGuard],
        data: { moduleName: 'Dashboard', screenName: 'Dashboard' }
      },
      // { path: 'forms', component: FormsComponent },
      { path: 'departmentTeam', component: DepartteamComponent },
      { path: 'notification', component: NotificationComponent },
      { path: 'reportDesign', component: ReportDesignComponent },
      { path: 'globalSearch', component: GlobalSearchComponent },
      { path: 'advanceSearch', component: AdvanceSearchComponent },
      /*     UI  */
      { path: 'icons', component: IconsComponent },
      { path: 'stepper', component: StepperComponent },
      // { path: 'duplicate', component: Notification }, /*        UI  */
      // { path: 'searchcriteria', component: SearchCriteriaComponent },
      {
        path: 'master',
        loadChildren: () => import('./master/master.module').then(mod => mod.MasterModule)
      },
      {
        path: 'screening',
        loadChildren: () => import('./screening/screening.module').then(src => src.ScreeningModule)
      },
      {
        path: 'client',
        loadChildren: () => import('./client-entry/client-entry.module').then(clnt => clnt.ClientEntryModule)
      },
      {
        path: 'case',
        loadChildren: () => import('./case/case.module').then(c => c.CaseModule)
      },
      {
        path: 'verification',
        loadChildren: () => import('./verification/verification.module').then(ver => ver.VerificationModule)
      },
      {
        path: 'qc',
        loadChildren: () => import('./quality-check/quality-check.module').then(qc => qc.QualityCheckModule)
      },
      {
        path: 'reports',
        loadChildren: () => import('./reports/reports.module').then(rep => rep.ReportsModule)
      },
      {
        path: 'invoice',
        loadChildren: () => import('./invoice/invoice.module').then(inv => inv.InvoiceModule)
      },
      {
        path: 'automation',
        loadChildren: () => import('./automation/automation.module').then(auto => auto.AutomationModule)
      },
      {
        path: 'vtsdashboard', component: VtsdashboardComponent, canActivate: [CanactivateGuard],
        data: { moduleName: 'dashboard', screenName: 'VTS Dashboard' }
      }
    ],

  },

  { path: 'privacy', component: PrivacyPolicyComponent },
  { path: 'AddressVerification/:urlid', component: DigitaladdressverficationComponent },
  { path: 'DirectAppCandidateInsuff/:urlid', component: DirectAppCandidateInsuffComponent },
  { path: 'DigiLockerVerification/:urlid', component: DigilockerCallbackComponentComponent },
  { path: 'Selectpackage-addtional-check', component: SelectpackageaddtionalchecksComponent },
  { path: 'purchase/addtionalchecks', component: AddtionalchecksComponent },
  { path: 'canidateregistraion', component: CandidateregisterComponent },
  { path: 'urlexpired', component: UrlExpiredComponent },

  { path: '**', component: PageNotFoundComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    { scrollPositionRestoration: 'enabled' }
    // { preloadingStrategy: PreloadAllModules }
    // { enableTracing: true }
  )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
