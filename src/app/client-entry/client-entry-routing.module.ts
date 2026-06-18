import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillingCycleComponent } from './billing-cycle/billing-cycle.component';
import { CancellationRuleComponent } from './cancellation-rule/cancellation-rule.component';
import { SiteEntryComponent } from './sites/site-entry/site-entry.component';
import { PackageCreationComponent } from './package-creation/package-creation.component';
import { GroupCreationComponent } from './group-creation/group-creation.component';
import { SiteListComponent } from './sites/site-list/site-list.component';
import { PackageCreationDetailComponent } from './package-creation-detail/package-creation-detail.component';
import { AgentEntryMasterComponent } from './agent-entry-master/agent-entry-master.component';
import { BillingRuleEntryComponent } from './billing-rule/billing-rule-entry.component';
import { ClientFeeApprovalComponent } from './client-fee-approval/client-fee-approval.component';
import { ClientUserComponent } from './client-user/client-user.component';
import { CanactivateGuard } from '../common-methods/guards/canactivate.guard';
import { ClientAgreementApprovalComponent } from './client-agreement-approval/client-agreement-approval.component';
import { PageNotFoundComponent } from '../common-methods/components/page-not-found/page-not-found.component';
import { ClientCustomFieldsComponent } from './client-custom-fields/client-custom-fields.component';
import { TatApprovalComponent } from './tat-approval/tat-approval.component';
import { ContactRemarksComponent } from '../master/contact-remarks/contact-remarks.component';
import { PackageFeeApprovalComponent } from './package-fee-approval/package-fee-approval.component';
import { ClientEntryMasterComponent } from './client-master/client-entry-master/client-entry-master.component';
import { MailCreationComponent } from './mail-creation/mail-creation.component';

const routes: Routes = [
  {
    path: 'billing-cycle', component: BillingCycleComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'cancellation-rule', component: CancellationRuleComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'billingrule', component: BillingRuleEntryComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'siteentry', component: SiteEntryComponent
  },
  {
    path: 'sitelist', component: SiteListComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'maillist', component: MailCreationComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'package', component: PackageCreationComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'group', component: GroupCreationComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'PackageCreationDetail', component: PackageCreationDetailComponent
  },
  // {
  //   path: 'agententrymaster', component: AgentEntryMasterComponent,
  //   canActivate: [CanactivateGuard], data: { moduleName: 'Client', screenName: 'Client Creation' }
  // },
  {
    path: 'agententrymaster', component: ClientEntryMasterComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'msp-nrp-FeeApproval', component: ClientFeeApprovalComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'clientAgreementApproval', component: ClientAgreementApprovalComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'clientUser', component: ClientUserComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'additionalinfo', component: ClientCustomFieldsComponent,
     canActivate: [CanactivateGuard]
  },
  {
    path: 'tatApproval', component: TatApprovalComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'contactRemarks', component: ContactRemarksComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'package-FeeApproval', component: PackageFeeApprovalComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: '**', component: PageNotFoundComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientEntryRoutingModule { }
