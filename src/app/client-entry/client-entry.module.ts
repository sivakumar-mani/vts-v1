// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ClientEntryRoutingModule } from './client-entry-routing.module';
// import { BillingCycleComponent } from './billing-cycle/billing-cycle.component';
// import { FlexLayoutModule } from '@ngbracket/ngx-layout';
// import { MaterialModule } from '../common-methods/modules/material.module';
// import { CancellationRuleComponent } from './cancellation-rule/cancellation-rule.component';
// import { ToastModule } from 'primeng/toast';
// import { SiteListComponent } from './sites/site-list/site-list.component';
// import { SiteEntryComponent } from './sites/site-entry/site-entry.component';
// import { PackageCreationComponent} from './package-creation/package-creation.component';
// import { GroupCreationComponent } from './group-creation/group-creation.component';
// import { TreeTableModule } from 'primeng/treetable';
// import { PackageCreationDetailComponent } from './package-creation-detail/package-creation-detail.component';
// import { AgentEntryMasterComponent } from './agent-entry-master/agent-entry-master.component';
// import { ClientEntryComponent } from './agent-entry-master/client-entry/client-entry.component';
// import { AgreementDetailsComponent } from './agent-entry-master/agreement-details/agreement-details.component';
// import { ClientInstructionComponent } from './agent-entry-master/client-instruction/client-instruction.component';
// import { ClientMailIdsComponent } from './agent-entry-master/client-mail-ids/client-mail-ids.component';
// import { ComponentEntryComponent } from './agent-entry-master/component-entry/component-entry.component';
// // import { AutoCompleteComponent } from '../common-methods/field-templates/auto-complete/auto-complete.component';
// import { SharedModule } from '../common-methods/modules/shared.module';
// import { BillingRuleEntryComponent } from './billing-rule/billing-rule-entry.component';
// import { ClientFeeApprovalComponent } from './client-fee-approval/client-fee-approval.component';
// import { ClientUserComponent } from './client-user/client-user.component';
// import { ClientAgreementApprovalComponent } from './client-agreement-approval/client-agreement-approval.component';
// import { ClientCustomFieldsComponent } from './client-custom-fields/client-custom-fields.component';
// import { TatApprovalComponent } from './tat-approval/tat-approval.component';
// import { ContactRemarksComponent } from '../master/contact-remarks/contact-remarks.component';
// import { RemovewhitespacesPipe } from '../common-methods/directive/remove-whitespacedirective';
// import { AngularEditorModule } from '@kolkov/angular-editor';
// import { PackageFeeApprovalComponent } from './package-fee-approval/package-fee-approval.component';
// import { ClientReviewComponent } from './agent-entry-master/client-review/client-review.component';
// import { ClientEntryMasterComponent } from './client-master/client-entry-master/client-entry-master.component';
// import { ClientCreationComponent } from './client-master/client-creation/client-creation.component';
// import { ClientAgreementComponent } from './client-master/client-agreement/client-agreement.component';
// import { ClientComponentsComponent } from './client-master/client-components/client-components.component';
// import { ClientInstructionsComponent } from './client-master/client-instructions/client-instructions.component';
// import { ClientMailsComponent } from './client-master/client-mails/client-mails.component';
// import { ClientReviewsComponent } from './client-master/client-reviews/client-reviews.component';
// import { MailCreationComponent } from './mail-creation/mail-creation.component';

// @NgModule({
//   declarations: [
//     RemovewhitespacesPipe,
//     BillingCycleComponent,
//     CancellationRuleComponent,
//     BillingRuleEntryComponent,
//     SiteListComponent,
//     SiteEntryComponent,
//     PackageCreationComponent,
//     GroupCreationComponent,
//     SiteEntryComponent,
//     SiteListComponent,
//     PackageCreationDetailComponent,
//     AgentEntryMasterComponent,
//     ClientEntryComponent,
//     AgreementDetailsComponent,
//     ClientInstructionComponent,
//     ClientMailIdsComponent,
//     ComponentEntryComponent,
//     // AutoCompleteComponent,
//     ClientFeeApprovalComponent,
//     ClientReviewComponent,
//     ClientUserComponent,
//     ClientAgreementApprovalComponent,
//     ClientCustomFieldsComponent,
//     TatApprovalComponent,
//     ContactRemarksComponent,
//     PackageFeeApprovalComponent,
//     ClientEntryMasterComponent,
//     ClientCreationComponent,
//     ClientAgreementComponent,
//     ClientComponentsComponent,
//     ClientInstructionsComponent,
//     ClientMailsComponent,
//     ClientReviewsComponent,
//     MailCreationComponent
//   ],

//   imports: [
//     CommonModule,
//     ClientEntryRoutingModule,
//     FlexLayoutModule,
//     ToastModule,
//     TreeTableModule,
//     MaterialModule,
//     SharedModule,
//     AngularEditorModule
//   ],
// })
// export class ClientEntryModule { }


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientEntryRoutingModule } from './client-entry-routing.module';

import { BillingCycleComponent } from './billing-cycle/billing-cycle.component';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { MaterialModule } from '../common-methods/modules/material.module';
import { CancellationRuleComponent } from './cancellation-rule/cancellation-rule.component';

import { ToastModule } from 'primeng/toast';
import { TreeTableModule } from 'primeng/treetable';

import { SiteListComponent } from './sites/site-list/site-list.component';
import { SiteEntryComponent } from './sites/site-entry/site-entry.component';
import { PackageCreationComponent } from './package-creation/package-creation.component';
import { GroupCreationComponent } from './group-creation/group-creation.component';
import { PackageCreationDetailComponent } from './package-creation-detail/package-creation-detail.component';
import { AgentEntryMasterComponent } from './agent-entry-master/agent-entry-master.component';
import { ClientEntryComponent } from './agent-entry-master/client-entry/client-entry.component';
import { AgreementDetailsComponent } from './agent-entry-master/agreement-details/agreement-details.component';
import { ClientInstructionComponent } from './agent-entry-master/client-instruction/client-instruction.component';
import { ClientMailIdsComponent } from './agent-entry-master/client-mail-ids/client-mail-ids.component';
import { ComponentEntryComponent } from './agent-entry-master/component-entry/component-entry.component';

import { SharedModule } from '../common-methods/modules/shared.module';
import { BillingRuleEntryComponent } from './billing-rule/billing-rule-entry.component';
import { ClientFeeApprovalComponent } from './client-fee-approval/client-fee-approval.component';
import { ClientUserComponent } from './client-user/client-user.component';
import { ClientAgreementApprovalComponent } from './client-agreement-approval/client-agreement-approval.component';
import { ClientCustomFieldsComponent } from './client-custom-fields/client-custom-fields.component';
import { TatApprovalComponent } from './tat-approval/tat-approval.component';
import { ContactRemarksComponent } from '../master/contact-remarks/contact-remarks.component';

import { RemovewhitespacesPipe } from '../common-methods/directive/remove-whitespacedirective';
import { AngularEditorModule } from '@kolkov/angular-editor';

import { PackageFeeApprovalComponent } from './package-fee-approval/package-fee-approval.component';
import { ClientReviewComponent } from './agent-entry-master/client-review/client-review.component';
import { ClientEntryMasterComponent } from './client-master/client-entry-master/client-entry-master.component';
import { ClientCreationComponent } from './client-master/client-creation/client-creation.component';
import { ClientAgreementComponent } from './client-master/client-agreement/client-agreement.component';
import { ClientComponentsComponent } from './client-master/client-components/client-components.component';
import { ClientInstructionsComponent } from './client-master/client-instructions/client-instructions.component';
import { ClientMailsComponent } from './client-master/client-mails/client-mails.component';
import { ClientReviewsComponent } from './client-master/client-reviews/client-reviews.component';
import { MailCreationComponent } from './mail-creation/mail-creation.component';

@NgModule({
  declarations: [
    RemovewhitespacesPipe,
    BillingCycleComponent,
    CancellationRuleComponent,
    BillingRuleEntryComponent,
    SiteListComponent,
    SiteEntryComponent,
    PackageCreationComponent,
    GroupCreationComponent,
    PackageCreationDetailComponent,
    AgentEntryMasterComponent,
    ClientEntryComponent,
    AgreementDetailsComponent,
    ClientInstructionComponent,
    ClientMailIdsComponent,
    ComponentEntryComponent,
    ClientFeeApprovalComponent,
    ClientReviewComponent,
    ClientUserComponent,
    ClientAgreementApprovalComponent,
    ClientCustomFieldsComponent,
    TatApprovalComponent,
    ContactRemarksComponent,
    PackageFeeApprovalComponent,
    ClientEntryMasterComponent,
    ClientCreationComponent,
    ClientAgreementComponent,
    ClientComponentsComponent,
    ClientInstructionsComponent,
    ClientMailsComponent,
    ClientReviewsComponent,
    MailCreationComponent
  ],

  imports: [
    CommonModule,
    ClientEntryRoutingModule,
    FlexLayoutModule,
    ToastModule,
    TreeTableModule,
    MaterialModule,
    SharedModule,
    AngularEditorModule
  ],
})
export class ClientEntryModule { }
