import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanactivateGuard } from '../common-methods/guards/canactivate.guard';
import { VerificationListComponent } from './verification-list/verification-list.component';
import { VerificationDetailsComponent } from './verification-details/verification-details.component';
import { AdditionalFeeApprovalComponent } from './additional-fee-approval/additional-fee-approval.component';
import { ResponseDocumentComponent } from './response-document/response-document.component';
import { AddressPvformComponent } from './address-pvform/address-pvform.component';
import { GeneratePdfComponent } from './generate-pdf/generate-pdf.component';
import { ScreenletterFaxComponent } from './screenletter-fax/screenletter-fax.component';
import { DigitalAddressCheckComponent } from './digital-address-check/digital-address-check.component';
import { DigitalCheckPvReportComponent } from './digital-check-pv-report/digital-check-pv-report.component';
import { ClientCasesComponent } from '../common-methods/components/client-cases/client-cases.component';
import { ReopenchecksComponent } from './reopenchecks/reopenchecks.component';
import { RedCaseApprovalComponent } from './red-case-approval/red-case-approval.component';
import { ModifyadditionalfeeComponent } from './modifyadditionalfee/modifyadditionalfee.component';
import { ModifycomponentfeeComponent } from './modifycomponentfee/modifycomponentfee.component';
import {EmployerFollowUpEmailComponent} from './employer-follow-up-email/employer-follow-up-email.component';
import { ColorCodeApprovalComponent } from './color-code-approval/color-code-approval.component';
import { HRContactDetailsComponent } from './hr-contact-details/hr-contact-details.component';
const routes: Routes = [
  {
    path: 'verification', component: VerificationListComponent,
    canActivate: [CanactivateGuard]
    // , data: { moduleName: 'verification', screenName: 'verification' }
  },
  {
    path: 'addressTagging', component: VerificationListComponent,
    canActivate: [CanactivateGuard]
    // , data: { moduleName: 'verification', screenName: 'Address Tagging & Status Upload' }
  },
  {
    path: 'verificationDetail', component: VerificationDetailsComponent,
    // canActivate: [CanactivateGuard], data: { moduleName: 'verification', screenName: 'verification' }
  },
  {
    path: 'additionalFeeApproval', component: AdditionalFeeApprovalComponent,
    canActivate: [CanactivateGuard]
    // , data: { moduleName: 'verification', screenName: 'Additional Fee Approval' }
  },
  {
    path: 'response', component: ResponseDocumentComponent,
    // canActivate: [CanactivateGuard], data: { moduleName: 'verification', screenName: 'verification' }
  },
  {
    path: 'generatePdf', component: GeneratePdfComponent,
    // canActivate: [CanactivateGuard], data: { moduleName: 'verification', screenName: 'verification' }
  },
  {
    path: 'addresspvform', component: AddressPvformComponent,
    //  data: { moduleName: 'verification', screenName: 'verification' }
  },
  {
    path: 'screeningLetter', component: ScreenletterFaxComponent,
    //  data: { moduleName: 'verification', screenName: 'verification' }
  },
  {
    path: 'digitaladdresscheck', component: DigitalAddressCheckComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'redcaseapproval', component: RedCaseApprovalComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'digitaladdresscheckpvReport', component: DigitalCheckPvReportComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'clientCases', component: ClientCasesComponent,
  },
  {
    path: 'reopensearch', component: ReopenchecksComponent,
  },
  {
    path: 'modifyadditionalfee', component: ModifyadditionalfeeComponent,
  },
  {
    path: 'modifycomponentfee', component: ModifycomponentfeeComponent,
  },
  {
    path: 'employerfollowupemail', component: EmployerFollowUpEmailComponent,
  },
  {
    path: 'candidateDocumentUpload', component: VerificationListComponent,
    canActivate: [CanactivateGuard]
    // , data: { moduleName: 'verification', screenName: 'Address Tagging & Status Upload' }
  },
   // Added By Megala - For (sprint -22) VTS2-2024-CRT-0195
  {
    path: 'colorCodeApproval', component: ColorCodeApprovalComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path:'hrContactDetails',component: HRContactDetailsComponent,
    canActivate: [CanactivateGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerificationRoutingModule { }
