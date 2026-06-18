import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QualitycheckListComponent } from './qualitycheck-list/qualitycheck-list.component';
import { CanactivateGuard } from '../common-methods/guards/canactivate.guard';
import { QualitycheckDetailsComponent } from './qualitycheck-details/qualitycheck-details.component';
import { QcApprovedRejectedDetailsComponent } from './qc-approved-rejected-details/qc-approved-rejected-details.component';
import { finalqccheckListComponent } from './finalqccheck-list/finalqccheck-list.component';
const routes: Routes = [
  {
    path: 'qualitycheck', component: QualitycheckListComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path : 'FinalQcCheckDetail', component : finalqccheckListComponent
  },
  {
    path: 'qualityCheckDetail', component: QualitycheckDetailsComponent
  },
  {
    path: 'qcApprovedRejected', component: QcApprovedRejectedDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QualityCheckRoutingModule { }
