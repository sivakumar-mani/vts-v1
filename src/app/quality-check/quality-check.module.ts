// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';

// import { QualityCheckRoutingModule } from './quality-check-routing.module';
// import { QualitycheckListComponent } from './qualitycheck-list/qualitycheck-list.component';
// import { QualitycheckDetailsComponent } from './qualitycheck-details/qualitycheck-details.component';
// import { SharedModule } from '../common-methods/modules/shared.module';
// import { ToggleButtonModule } from 'primeng/primeng';
// import { QcApprovedRejectedDetailsComponent } from './qc-approved-rejected-details/qc-approved-rejected-details.component';
// import { finalqccheckListComponent } from './finalqccheck-list/finalqccheck-list.component';
// @NgModule({
//   declarations: [QualitycheckListComponent, QualitycheckDetailsComponent, QcApprovedRejectedDetailsComponent, finalqccheckListComponent],
//   imports: [
//     CommonModule,
//     QualityCheckRoutingModule,
//     SharedModule,
//     ToggleButtonModule
//   ]
// })
// export class QualityCheckModule { }


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QualityCheckRoutingModule } from './quality-check-routing.module';
import { QualitycheckListComponent } from './qualitycheck-list/qualitycheck-list.component';
import { QualitycheckDetailsComponent } from './qualitycheck-details/qualitycheck-details.component';

import { SharedModule } from '../common-methods/modules/shared.module';

import { ToggleButtonModule } from 'primeng/togglebutton';

import { QcApprovedRejectedDetailsComponent } from './qc-approved-rejected-details/qc-approved-rejected-details.component';
import { finalqccheckListComponent } from './finalqccheck-list/finalqccheck-list.component';

@NgModule({
  declarations: [
    QualitycheckListComponent,
    QualitycheckDetailsComponent,
    QcApprovedRejectedDetailsComponent,
    finalqccheckListComponent
  ],
  imports: [
    CommonModule,
    QualityCheckRoutingModule,
    SharedModule,
    ToggleButtonModule
  ]
})
export class QualityCheckModule { }