import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from '../common-methods/components/page-not-found/page-not-found.component';
import { CaseCreatedListComponent } from './case-created-list/case-created-list.component';
import { InvitationCreationComponent } from '../common-methods/components/invitation-creation/invitation-creation.component';
import { ClientFileSubmissionComponent } from './client-file-submission/client-file-submission.component';
import { InvitationManageComponent } from '../common-methods/components/invitation-manage/invitation-manage.component';
import { InsufficiencyComponent } from '../common-methods/components/insufficiency/insufficiency.component';
import { CanactivateGuard } from '../common-methods/guards/canactivate.guard';
import { RaiseInsuffListComponent } from './raise-insuff-list/raise-insuff-list.component';
import { AbroadFileSubmissionComponent } from './abroad-file-submission/abroad-file-submission.component';
import { BulkinvitationComponent } from '../common-methods/components/bulkinvitation/bulkinvitation.component';
import { DirectAppInvitationComponent } from '../common-methods/components/direct-app-invitation/direct-app-invitation.component';
import { MultipleInviteComponent } from '../common-methods/components/multiple-invite/multiple-invite.component';
import { PaymentGatewayComponent } from '../common-methods/payment-gateway/payment-gateway.component';
import { IcertiscandidatesComponent } from '../icertiscandidates/icertiscandidates.component';
import { PaymenthistoryComponent } from '../paymenthistory/paymenthistory.component';
import { InsufficiencyclearanceComponent } from '../common-methods/components/insufficiencyclearance/insufficiencyclearance.component';
import { CandidateFileSubmissionComponent } from './candidate-file-submission/candidate-file-submission.component';
import { tatcrossedInsuffListComponent } from './tat-crossed-insuff-list/tat-crossed-insuff-list.component';
import { ClientAppSubmissionComponent } from './client-app-submission/client-app-submission.component';
import { DirectAppSubmissionComponent } from './direct-app-submission/direct-app-submission.component';
import { ClientBulkCaseCreationComponent } from '../common-methods/components/client-bulk-case-creation/client-bulk-case-creation.component';
const routes: Routes = [
  { path: 'india', component: ClientFileSubmissionComponent },
  { path: 'indiacan', component: CandidateFileSubmissionComponent },
  { path: 'clientapp', component: ClientAppSubmissionComponent },
  { path: 'directapp', component: DirectAppSubmissionComponent },
  { path: 'paymentGateway', component: PaymentGatewayComponent },
  { path: 'caselist', component: CaseCreatedListComponent },
  { path: 'insufflist', component: RaiseInsuffListComponent },
  { path: 'clientcreatebulkcase', component: ClientBulkCaseCreationComponent },
  {path: 'tatCrossedinsufflist',component:tatcrossedInsuffListComponent},
  { path: 'createinvitation', component: InvitationCreationComponent },
  // { path: 'createinvitation', component: DirectAppInvitationComponent },
  { path: 'multipleinvitation', component: MultipleInviteComponent },
  { path: 'abroad', component: AbroadFileSubmissionComponent },
  {
    path: 'Insufficiency', component: InsufficiencyComponent,
    canActivate: [CanactivateGuard]
    // , data: { moduleName: 'Screening', screenName: 'Insufficiency' }
  },
  {
    path: 'Insufficiencyclearance', component: InsufficiencyclearanceComponent,
    canActivate: [CanactivateGuard]
    // , data: { moduleName: 'Screening', screenName: 'Insufficiency' }
  },
  { path: 'manageinvitation', component: InvitationManageComponent },
  { path: 'bulkinvitation', component: BulkinvitationComponent },
  { path: 'icertiscandidates', component: IcertiscandidatesComponent },
  { path: 'individualcandidatepayment', component: PaymenthistoryComponent },
  {
    path: 'subCheckInvitation', component: InvitationCreationComponent,
    canActivate: [CanactivateGuard], data: { moduleName: 'Direct App', screenName: 'Sub Check Invitation' }
  },
  { path: '**', component: PageNotFoundComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScreeningRoutingModule { }
