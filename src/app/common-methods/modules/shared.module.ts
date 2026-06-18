// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { MaterialModule } from './material.module';
// import { NumberOnlyDirective, CopyDirective, DragdropDirective } from '../directive/number-only.directive';
// import { HighlightPipe } from '../pipes/highlightpipe';
// import { FlexLayoutModule } from '@angular/flex-layout';
// import { RouterModule } from '@angular/router';
// // ngx-perfect-scrollbar removed — not compatible with Angular 17 Ivy
// import { ToastModule } from 'primeng/toast';
// import { AddressComponent } from '../components/address/address.component';
// import { BreadcrumbComponent } from '../components/breadcrumb/breadcrumb.component';
// import { BulkExportImportComponent } from '../components/bulk-export-import/bulk-export-import.component';
// import { EmailMultiComponent } from '../controls/email-multi/email-multi.component';
// import { PhoneComponent } from '../controls/phone/phone.component';
// import { AutoCompleteComponent } from '../controls/auto-complete/auto-complete.component';
// import { EmailComponent } from '../controls/email/email.component';
// import { PageNotFoundComponent } from '../components/page-not-found/page-not-found.component';
// import { EmailTypeComponent } from '../controls/email-type/email-type.component';
// import { InvitationCreationComponent } from '../components/invitation-creation/invitation-creation.component';
// import { EmailDynamicControlsComponent } from '../controls/email-dynamic-controls/email-dynamic-controls.component';
// import { PhoneDynamicControlComponent } from '../controls/phone-dynamic-control/phone-dynamic-control.component';
// import { TextMultiComponent } from '../controls/text-multi/text-multi.component';
// import { InvitationManageComponent } from '../components/invitation-manage/invitation-manage.component';
// import { InsufficiencyComponent } from '../components/insufficiency/insufficiency.component';
// import { CaptchaComponentComponent } from '../components/captcha-component/captcha-component.component';
// import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
// import { ScreeningDocumentsComponent } from 'src/app/screening/client-file-submission/screening-documents/screening-documents.component';
// import { EmpInsProfListComponent } from '../components/emp-ins-prof-list/emp-ins-prof-list.component';
// import { EmpInsProfDetailComponent } from '../components/emp-ins-prof-detail/emp-ins-prof-detail.component';
// import { UserCreationComponent } from '../components/user-creation/user-creation.component';
// import { RaiseInsufficiencyComponent } from 'src/app/screening/DynamicComponents/raise-insufficiency/raise-insufficiency.component';
// import { ScreeingReviewComponent } from 'src/app/screening/client-file-submission/screeing-review/screeing-review.component';
// import { ImageCropperModule } from 'ngx-image-cropper';
// import { NgxPaginationModule } from 'ngx-pagination';
// import { SortPipe } from '../pipes/sort.pipe';
// import { MaskPipe } from '../pipes/textmask.pipe';
// import { MailMask } from '../pipes/mailmask.pipe';
// import { SearchPipe } from '../pipes/search.pipe';
// import { QuesAnsComponent } from 'src/app/screening/DynamicComponents/ques-ans/ques-ans.component';
// import { DatabaseQuesAnsComponent } from 'src/app/screening/DynamicComponents/database-ques-ans/database-ques-ans.component';
// import { ResponseDocumentComponent } from 'src/app/verification/response-document/response-document.component';
// import { InstitutionFeesComponent } from 'src/app/master/institution-fees/institution-fees.component';
// import { CounterComponent } from '../controls/counter/counter.component';
// import { MatDatepicker } from '@angular/material/datepicker';
// import { MAT_DATE_LOCALE, MAT_DATE_FORMATS, NativeDateAdapter, DateAdapter } from '@angular/material/core';
// // import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/dialog';
// import { AppDateAdapter, APP_DATE_FORMATS } from '../adapter/adapter';
// import { DynamicFormsComponent } from '../components/dynamic-forms/dynamic-forms.component';
// import { DynamicFormsControlsComponent } from '../components/dynamic-forms-controls/dynamic-forms-controls.component';
// import { NgxImageCompressService } from 'ngx-image-compress';
// import { NgxSpinnerModule } from 'ngx-spinner';
// import { GeneratePdfComponent } from 'src/app/verification/generate-pdf/generate-pdf.component';
// import { ScrollToErrorDirective } from '../directive/scroll-to-error.directive';
// import { AdditionalComponentComponent } from 'src/app/case/additional-component/additional-component.component';
// import { InsuffHistoryComponent } from '../components/insuff-history/insuff-history.component';
// import { BulkinvitationComponent } from '../components/bulkinvitation/bulkinvitation.component';
// import { InputsModule } from '@progress/kendo-angular-inputs';
// import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
// import { IntlModule } from '@progress/kendo-angular-intl';
// import { EmpClosedCasesComponent } from 'src/app/verification/emp-closed-cases/emp-closed-cases.component';
// // ng2-search-filter removed — not compatible with Angular 17 Ivy
// import { GridModule } from '@progress/kendo-angular-grid';
// import { DirectAppInvitationComponent } from '../components/direct-app-invitation/direct-app-invitation.component';
// import { MultipleInviteComponent } from '../components/multiple-invite/multiple-invite.component';
// import { GenerateInvoiceComponent } from 'src/app/invoice/generate-invoice/generate-invoice.component';
// import { InsufficiencyclearanceComponent } from '../components/insufficiencyclearance/insufficiencyclearance.component';
// import { AdditionalfeeHistoryComponent } from '../components/additionalfee-history/additionalfee-history.component';
// import { TechmResponseDocumentComponent } from '../../verification/techm-response-document/techm-response-document.component';
// @NgModule({
//   declarations: [NumberOnlyDirective, CopyDirective, DragdropDirective, HighlightPipe, SearchPipe, SortPipe, MaskPipe, MailMask,
//     AddressComponent, QuesAnsComponent,DatabaseQuesAnsComponent, GenerateInvoiceComponent,
//     BulkExportImportComponent, BreadcrumbComponent, EmailMultiComponent, PhoneComponent, EmailTypeComponent,
//     PageNotFoundComponent, AutoCompleteComponent, EmailComponent, InvitationCreationComponent,
//     EmailDynamicControlsComponent, TextMultiComponent,
//     PhoneDynamicControlComponent, InvitationManageComponent, InsufficiencyComponent, InsuffHistoryComponent,
//     CaptchaComponentComponent, ScreeningDocumentsComponent, RaiseInsufficiencyComponent, EmpInsProfListComponent,
//     EmpInsProfDetailComponent, UserCreationComponent, ScreeingReviewComponent, ResponseDocumentComponent,
//     InstitutionFeesComponent, CounterComponent, DynamicFormsComponent, DynamicFormsControlsComponent, GeneratePdfComponent,
//     ScrollToErrorDirective, AdditionalComponentComponent, DirectAppInvitationComponent, BulkinvitationComponent, EmpClosedCasesComponent,
//     MultipleInviteComponent, InsufficiencyclearanceComponent, AdditionalfeeHistoryComponent, TechmResponseDocumentComponent
//   ],
//   imports: [
//     MaterialModule,
//     CommonModule,
//     FlexLayoutModule,
//     RouterModule,
//     PerfectScrollbarModule,
//     ToastModule,
//     OwlDateTimeModule,
//     OwlNativeDateTimeModule,
//     ImageCropperModule,
//     NgxPaginationModule,
//     NgxSpinnerModule,
//     PDFExportModule,
//     InputsModule,
//     IntlModule,
//     Ng2SearchPipeModule,
//     GridModule,
//   ],
//   exports: [
//     FlexLayoutModule,
//     RouterModule,
//     PerfectScrollbarModule,
//     ToastModule,
//     OwlDateTimeModule,
//     OwlNativeDateTimeModule,
//     ImageCropperModule,
//     NgxPaginationModule,
//     CommonModule,
//     NgxSpinnerModule,
//     NumberOnlyDirective,
//     CopyDirective,
//     DragdropDirective,
//     MaterialModule,
//     HighlightPipe,
//     SearchPipe,
//     SortPipe,
//     MaskPipe,
//     MailMask,
//     AddressComponent,
//     GenerateInvoiceComponent,
//     BreadcrumbComponent,
//     EmailMultiComponent,
//     BulkExportImportComponent,
//     AutoCompleteComponent,
//     PhoneComponent,
//     EmailComponent,
//     PageNotFoundComponent,
//     EmailTypeComponent,
//     InvitationCreationComponent,
//     EmailDynamicControlsComponent,
//     PhoneDynamicControlComponent,
//     TextMultiComponent,
//     InvitationManageComponent,
//     InsufficiencyComponent,
//     InsufficiencyclearanceComponent,
//     InsuffHistoryComponent,
//     CaptchaComponentComponent,
//     ScreeningDocumentsComponent,
//     ScreeingReviewComponent,
//     RaiseInsufficiencyComponent,
//     EmpInsProfListComponent,
//     EmpInsProfDetailComponent,
//     UserCreationComponent,
//     QuesAnsComponent,
//     DatabaseQuesAnsComponent,
//     ResponseDocumentComponent,
//     TechmResponseDocumentComponent,
//     EmpClosedCasesComponent,
//     InstitutionFeesComponent,
//     CounterComponent,
//     DynamicFormsComponent,
//     DynamicFormsControlsComponent,
//     GeneratePdfComponent,
//     ScrollToErrorDirective,
//     AdditionalComponentComponent,
//     DirectAppInvitationComponent,
//     MultipleInviteComponent,
//     AdditionalfeeHistoryComponent,
//   ],
//   providers: [
//     {
//       provide: DateAdapter, useClass: AppDateAdapter
//     },
//     {
//       provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
//     },
//     {
//       provide: MAT_DATE_LOCALE,
//       useValue: 'en-us'
//     },
//     NgxImageCompressService,
//     ScrollToErrorDirective,
//   ],
// })
// export class SharedModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { NumberOnlyDirective, CopyDirective, DragdropDirective } from '../directive/number-only.directive';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { RouterModule } from '@angular/router';
// ngx-perfect-scrollbar removed — not compatible with Angular 17 Ivy

import { ToastModule } from 'primeng/toast';

import { AddressComponent } from '../components/address/address.component';
import { BreadcrumbComponent } from '../components/breadcrumb/breadcrumb.component';
import { BulkExportImportComponent } from '../components/bulk-export-import/bulk-export-import.component';
import { EmailMultiComponent } from '../controls/email-multi/email-multi.component';
import { PhoneComponent } from '../controls/phone/phone.component';
import { AutoCompleteComponent } from '../controls/auto-complete/auto-complete.component';
import { EmailComponent } from '../controls/email/email.component';
import { PageNotFoundComponent } from '../components/page-not-found/page-not-found.component';
import { EmailTypeComponent } from '../controls/email-type/email-type.component';
import { InvitationCreationComponent } from '../components/invitation-creation/invitation-creation.component';
import { EmailDynamicControlsComponent } from '../controls/email-dynamic-controls/email-dynamic-controls.component';
import { PhoneDynamicControlComponent } from '../controls/phone-dynamic-control/phone-dynamic-control.component';
import { TextMultiComponent } from '../controls/text-multi/text-multi.component';
import { InvitationManageComponent } from '../components/invitation-manage/invitation-manage.component';
import { InsufficiencyComponent } from '../components/insufficiency/insufficiency.component';
import { CaptchaComponentComponent } from '../components/captcha-component/captcha-component.component';

import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';

import { ScreeningDocumentsComponent } from 'src/app/screening/client-file-submission/screening-documents/screening-documents.component';
import { EmpInsProfListComponent } from '../components/emp-ins-prof-list/emp-ins-prof-list.component';
import { EmpInsProfDetailComponent } from '../components/emp-ins-prof-detail/emp-ins-prof-detail.component';
import { UserCreationComponent } from '../components/user-creation/user-creation.component';
import { RaiseInsufficiencyComponent } from 'src/app/screening/DynamicComponents/raise-insufficiency/raise-insufficiency.component';
import { ScreeingReviewComponent } from 'src/app/screening/client-file-submission/screeing-review/screeing-review.component';

import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxPaginationModule } from 'ngx-pagination';
import { SortPipe } from '../pipes/sort.pipe';
import { MaskPipe } from '../pipes/textmask.pipe';
import { MailMask } from '../pipes/mailmask.pipe';
import { SearchPipe } from '../pipes/search.pipe';

import { QuesAnsComponent } from 'src/app/screening/DynamicComponents/ques-ans/ques-ans.component';
import { DatabaseQuesAnsComponent } from 'src/app/screening/DynamicComponents/database-ques-ans/database-ques-ans.component';

import { ResponseDocumentComponent } from 'src/app/verification/response-document/response-document.component';
import { InstitutionFeesComponent } from 'src/app/master/institution-fees/institution-fees.component';
import { CounterComponent } from '../controls/counter/counter.component';

import { MatDatepicker } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS, NativeDateAdapter, DateAdapter } from '@angular/material/core';

import { AppDateAdapter, APP_DATE_FORMATS } from '../adapter/adapter';

import { DynamicFormsComponent } from '../components/dynamic-forms/dynamic-forms.component';
import { DynamicFormsControlsComponent } from '../components/dynamic-forms-controls/dynamic-forms-controls.component';

import { NgxImageCompressService } from 'ngx-image-compress';
import { NgxSpinnerModule } from 'ngx-spinner';

import { GeneratePdfComponent } from 'src/app/verification/generate-pdf/generate-pdf.component';
import { ScrollToErrorDirective } from '../directive/scroll-to-error.directive';
import { AdditionalComponentComponent } from 'src/app/case/additional-component/additional-component.component';
import { InsuffHistoryComponent } from '../components/insuff-history/insuff-history.component';

import { BulkinvitationComponent } from '../components/bulkinvitation/bulkinvitation.component';

import { InputsModule } from '@progress/kendo-angular-inputs';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { IntlModule } from '@progress/kendo-angular-intl';

import { EmpClosedCasesComponent } from 'src/app/verification/emp-closed-cases/emp-closed-cases.component';
// ng2-search-filter removed — not compatible with Angular 17 Ivy
import { GridModule } from '@progress/kendo-angular-grid';

import { DirectAppInvitationComponent } from '../components/direct-app-invitation/direct-app-invitation.component';
import { MultipleInviteComponent } from '../components/multiple-invite/multiple-invite.component';

import { GenerateInvoiceComponent } from 'src/app/invoice/generate-invoice/generate-invoice.component';
import { InsufficiencyclearanceComponent } from '../components/insufficiencyclearance/insufficiencyclearance.component';
import { AdditionalfeeHistoryComponent } from '../components/additionalfee-history/additionalfee-history.component';
import { TechmResponseDocumentComponent } from '../../verification/techm-response-document/techm-response-document.component';
import { HighlightPipe } from '../pipes/highlightpipe';
import { FilterPipe } from '../pipes/filter.pipe';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    NumberOnlyDirective, CopyDirective, DragdropDirective,
    HighlightPipe, SearchPipe, SortPipe, MaskPipe, MailMask, FilterPipe,
    AddressComponent, QuesAnsComponent, DatabaseQuesAnsComponent,
    GenerateInvoiceComponent,
    BulkExportImportComponent, BreadcrumbComponent,
    EmailMultiComponent, PhoneComponent, EmailTypeComponent,
    PageNotFoundComponent, AutoCompleteComponent, EmailComponent,
    InvitationCreationComponent, EmailDynamicControlsComponent,
    TextMultiComponent, PhoneDynamicControlComponent,
    InvitationManageComponent, InsufficiencyComponent,
    InsuffHistoryComponent, CaptchaComponentComponent,
    ScreeningDocumentsComponent, RaiseInsufficiencyComponent,
    EmpInsProfListComponent, EmpInsProfDetailComponent,
    UserCreationComponent, ScreeingReviewComponent,
    ResponseDocumentComponent, InstitutionFeesComponent,
    CounterComponent, DynamicFormsComponent,
    DynamicFormsControlsComponent, GeneratePdfComponent,
    ScrollToErrorDirective, AdditionalComponentComponent,
    DirectAppInvitationComponent, BulkinvitationComponent,
    EmpClosedCasesComponent, MultipleInviteComponent,
    InsufficiencyclearanceComponent, AdditionalfeeHistoryComponent,
    TechmResponseDocumentComponent
  ],

  imports: [
    MaterialModule,
    CommonModule,
    FlexLayoutModule,
    RouterModule,
    ToastModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    ImageCropperModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    PDFExportModule,
    InputsModule,
    IntlModule,
    GridModule,
     ReactiveFormsModule,
  FormsModule
  ],

  exports: [
    FlexLayoutModule, RouterModule,
    ToastModule, OwlDateTimeModule, OwlNativeDateTimeModule,
    ImageCropperModule, NgxPaginationModule, CommonModule,
    NgxSpinnerModule, NumberOnlyDirective, CopyDirective,
    DragdropDirective, MaterialModule, HighlightPipe, SearchPipe,
    SortPipe, MaskPipe, MailMask, FilterPipe, AddressComponent,
    GenerateInvoiceComponent, BreadcrumbComponent,
    EmailMultiComponent, BulkExportImportComponent,
    AutoCompleteComponent, PhoneComponent, EmailComponent,
    PageNotFoundComponent, EmailTypeComponent,
    InvitationCreationComponent, EmailDynamicControlsComponent,
    PhoneDynamicControlComponent, TextMultiComponent,
    InvitationManageComponent, InsufficiencyComponent,
    InsufficiencyclearanceComponent, InsuffHistoryComponent,
    CaptchaComponentComponent, ScreeningDocumentsComponent,
    ScreeingReviewComponent, RaiseInsufficiencyComponent,
    EmpInsProfListComponent, EmpInsProfDetailComponent,
    UserCreationComponent, QuesAnsComponent,
    DatabaseQuesAnsComponent, ResponseDocumentComponent,
    TechmResponseDocumentComponent, EmpClosedCasesComponent,
    InstitutionFeesComponent, CounterComponent,
    DynamicFormsComponent, DynamicFormsControlsComponent,
    GeneratePdfComponent, ScrollToErrorDirective,
    AdditionalComponentComponent, DirectAppInvitationComponent,
    MultipleInviteComponent, AdditionalfeeHistoryComponent,
    
  ],

  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'en-us' },
    NgxImageCompressService,
    ScrollToErrorDirective,
  ],
})
export class SharedModule {}

