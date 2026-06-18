import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanactivateGuard } from '../common-methods/guards/canactivate.guard';
import { AutomationTriggerComponent } from './automation-trigger/automation-trigger.component';

const routes: Routes = [{
  path: 'automationTrigger', component: AutomationTriggerComponent,
  canActivate: [CanactivateGuard], data: { moduleName: 'Automation', screenName: 'Automation Trigger' }}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AutomationRoutingModule { }
