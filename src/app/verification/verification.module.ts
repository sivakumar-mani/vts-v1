import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { VerificationRoutingModule } from './verification-routing.module';
import { VerificationListComponent } from './verification-list/verification-list.component';
import { SharedModule } from '../common-methods/modules/shared.module';
import { VerificationDetailsComponent } from './verification-details/verification-details.component';
import { CandidateDetailsComponent } from './candidate-details/candidate-details.component';
import { ScreeningDetailsComponent } from './screening-details/screening-details.component';
import { SupportingDocumentsComponent } from './supporting-documents/supporting-documents.component';
import { CommentsUpdatesComponent } from './comments-updates/comments-updates.component';
import { ReviewComponent } from './review/review.component';
import { ComponentsComponent } from './components/components.component';
import { AdditionalFeesComponent } from './additional-fees/additional-fees.component';
import { AdditionalFeeApprovalComponent } from './additional-fee-approval/additional-fee-approval.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DynamicComponentComponent } from './dynamic-component/dynamic-component.component';
import { AddressPvformComponent } from './address-pvform/address-pvform.component';
import { HeaderComponent } from './header/header.component';
import { PaymentDetailsComponent } from './payment-details/payment-details.component';
import { CommunicationDetailsComponent } from './communication-details/communication-details.component';
import { OverrideFeeComponent } from './override-fee/override-fee.component';
import { AnnexureCheckComponent } from './annexure-check/annexure-check.component';
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

@NgModule({
  declarations: [VerificationListComponent,
    VerificationDetailsComponent,
    CandidateDetailsComponent,
    ScreeningDetailsComponent,
    SupportingDocumentsComponent,
    CommentsUpdatesComponent,
    ReviewComponent,
    ComponentsComponent,
    AdditionalFeesComponent,
    AdditionalFeeApprovalComponent,
    DynamicComponentComponent,
    AddressPvformComponent,
    HeaderComponent,
    PaymentDetailsComponent,
    CommunicationDetailsComponent,
    OverrideFeeComponent,
    AnnexureCheckComponent,
    ScreenletterFaxComponent,
    DigitalAddressCheckComponent,
    DigitalCheckPvReportComponent,
    ClientCasesComponent,
    ReopenchecksComponent,
    RedCaseApprovalComponent,
    ModifyadditionalfeeComponent,
    ModifycomponentfeeComponent,
    EmployerFollowUpEmailComponent,
    ColorCodeApprovalComponent,
    HRContactDetailsComponent

  ],
  imports: [
    CommonModule,
    VerificationRoutingModule,
    SharedModule,
    RadioButtonModule,
    AngularEditorModule
  ]
})
export class VerificationModule { }
