import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutomationRoutingModule } from './automation-routing.module';
import { AutomationTriggerComponent } from './automation-trigger/automation-trigger.component';
import { SharedModule } from '../common-methods/modules/shared.module';
@NgModule({
  declarations: [AutomationTriggerComponent],
  imports: [
    CommonModule,
    AutomationRoutingModule,
    SharedModule
  ]
})
export class AutomationModule { }
