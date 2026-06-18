import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../common-methods/modules/material.module';
import { ToastModule } from 'primeng/toast';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { SharedModule } from '../common-methods/modules/shared.module';

import { CaseRoutingModule } from './case-routing.module';
import { CaseCreationComponent } from './case-creation/case-creation.component';
import { CRTCaseCreationComponent } from './crtcase-creation/crtcase-creation.component';
import { LOAStatusComponent } from './loastatus/loastatus.component';
import { StopCheckComponent } from './stop-check/stop-check.component';
import { ClientcommunicationComponent } from './clientcommunication/clientcommunication.component';
import { CasehistoryComponent } from './casehistory/casehistory.component';
import { ScopebypassCaseComponent } from './scopebypass-case/scopebypass-case.component';

@NgModule({
  declarations: [CaseCreationComponent, CRTCaseCreationComponent, LOAStatusComponent, StopCheckComponent,ClientcommunicationComponent, CasehistoryComponent, ScopebypassCaseComponent],
  imports: [
    CommonModule,
    MaterialModule,
    CaseRoutingModule,
    ToastModule,
    FlexLayoutModule,
    SharedModule,
  ]
})
export class CaseModule { }
