import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CaseCreationComponent } from './case-creation/case-creation.component';
import { CanactivateGuard } from '../common-methods/guards/canactivate.guard';
import { CRTCaseCreationComponent } from './crtcase-creation/crtcase-creation.component';
import { LOAStatusComponent } from './loastatus/loastatus.component';
import { StopCheckComponent } from './stop-check/stop-check.component';
import { ClientcommunicationComponent } from './clientcommunication/clientcommunication.component';
import { CasehistoryComponent } from './casehistory/casehistory.component';
import { ScopebypassCaseComponent } from './scopebypass-case/scopebypass-case.component';
const routes: Routes = [
  {
    path: 'case-creation', component: CaseCreationComponent,
    canActivate: [CanactivateGuard], data: { moduleName: 'Screening', screenName: 'Case Creation' }
  },
  {
    path: 'scopeByPassCase', component: ScopebypassCaseComponent,
    canActivate: [CanactivateGuard], data: { moduleName: 'Screening', screenName: 'Case Creation' }
  },
  {
    path: 'crt-case-creation', component: CRTCaseCreationComponent,
    canActivate: [CanactivateGuard], data: { moduleName: 'Screening', screenName: 'Scope Creation' }
  },
  {
    path: 'subChecks', component: CRTCaseCreationComponent,
    canActivate: [CanactivateGuard], data: { moduleName: 'Screening', screenName: 'Sub Checks' }
  },
  {
    path: 'loastatus', component: LOAStatusComponent,
    canActivate: [CanactivateGuard], data: { moduleName: 'Screening', screenName: 'LOA Approval' }
  },
  {
    path: 'stopcheck', component: StopCheckComponent,
    canActivate: [CanactivateGuard], data: { moduleName: 'Screening', screenName: 'Stop Check' }
  },
  {
    path: 'clientcommunication', component: ClientcommunicationComponent,
    canActivate: [CanactivateGuard], data: { moduleName: 'Screening', screenName: 'Client Communication' }
  },
  {
    path: 'casehistory', component: CasehistoryComponent,
    canActivate: [CanactivateGuard], data: { moduleName: 'Screening', screenName: 'Case History' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CaseRoutingModule { }
