import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
// import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { Interceptor } from './interceptor';
import { LoginComponent } from './login/login.component';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './dashboard/home/home.component';
// import { FormsComponent } from './dashboard/forms/forms.component';
import { AuthService } from './common-methods/services/auth.service';
import { SearchCriteriaComponent } from './search-criteria/search-criteria.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// ngx-perfect-scrollbar removed — not compatible with Angular 17 Ivy
import { CommonDialogComponent } from './dashboard/forms/common-dialog/common-dialog.component';
// import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { LandingComponent } from './login/landing/landing.component';
import { CapsLockDirective } from './common-methods/directive/caps-lock.directive';
import { CommonAlertsComponent } from './common-methods/common-alerts/common-alerts.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { SharedModule } from './common-methods/modules/shared.module';
import { IconsComponent } from './dashboard/forms/icons/icons.component';
import { TreeconcComponent } from './dashboard/forms/treeconc/treeconc.component';
import { DatePipe } from '@angular/common';
import { StepperComponent } from './dashboard/stepper/stepper.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatTableDataSource } from '@angular/material/table';
import { PhoneFieldComponent } from './common-methods/controls/phone-field/phone-field.component';
import { IdleService as BnNgIdleService } from './common-methods/services/idle.service';
import { ChangePasswordDialogComponent } from './common-methods/components/change-password-dialog/change-password-dialog.component';
import { PhoneMultiComponent } from './common-methods/controls/phone-multi/phone-multi.component';
import { DepartteamComponent } from './dashboard/forms/departteam/departteam.component';
import { OWL_DATE_TIME_LOCALE } from '@danielmoncada/angular-datetime-picker';
import { DuplicateComponent } from './dashboard/forms/duplicate/duplicate.component';
import { DboardComponent } from './dashboard/dboard/dboard.component';
import { NotificationComponent } from './dashboard/notification/notification.component';
import { ReportDesignComponent } from './dashboard/forms/report-design/report-design.component';
import { VtsdashboardComponent } from './dashboard/vtsdashboard/vtsdashboard.component';
// import { CalendarModule } from 'primeng/primeng';
import { AddAddressDetailComponent } from './common-methods/components/add-address-detail/add-address-detail.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { CountdownComponent, COUNTDOWN_CONFIG } from 'ngx-countdown';
import { GlobalSearchComponent } from './dashboard/global-search/global-search.component';
import { DigitaladdressverficationComponent } from './digitaladdressverfication/digitaladdressverfication.component';
import { SelectpackageaddtionalchecksComponent } from './selectpackageaddtionalchecks/selectpackageaddtionalchecks.component';
import { AddtionalchecksComponent } from './selectpackageaddtionalchecks/addtionalchecks/addtionalchecks.component';
import { CandidateregisterComponent } from './selectpackageaddtionalchecks/candidateregister/candidateregister.component';
import { DeptChooseComponent } from './login/dept-choose/dept-choose.component';
import { UndermaintanceComponent } from './undermaintance/undermaintance.component';
// import { FocusInvalidInputDirective } from './focus-invalid-input.directive';
//import { ScannerComponent } from './liveCapture/scanner/scanner.component';
import { LocationComponent } from './liveCapture/location/location.component';
import { CaptureMainComponent } from './liveCapture/capture-main/capture-main.component';
import { NgxScannerQrcodeComponent } from 'ngx-scanner-qrcode';
import { GoogleMapsModule } from '@angular/google-maps';
import { SignatureComponent } from './liveCapture/signature/signature.component';
import { ImageComponent } from './liveCapture/image/image.component';
import { VideoComponent } from './liveCapture/video/video.component';
//import { WebcamModule } from 'ngx-webcam';
import { ShowImageDialogComponent } from './liveCapture/show-image-dialog/show-image-dialog.component';
import { TabPreventionService } from './tab-prevention.service';
import { DirectAppCandidateInsuffComponent } from './direct-app-candidate-insuff/direct-app-candidate-insuff.component';
import { AdvanceSearchComponent } from './dashboard/advancesearch/advance-search.component';
import { AuthCallbackComponent } from 'src/app/auth-callback/auth-callback.component';
import { DigilockerCallbackComponentComponent } from './digilocker-callback/digilocker-callback-component/digilocker-callback-component.component';
import { UrlExpiredComponent } from './common-methods/components/url-expired/url-expired.component';
import { OAuthModule } from 'angular-oauth2-oidc';
import { SsologinComponent } from './login/ssologin/ssologin.component';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { MaterialModule } from './common-methods/modules/material.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AngularEditorModule } from '@kolkov/angular-editor';


@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    DeptChooseComponent,
    LoginComponent,
    HomeComponent,
    DashboardComponent,
    // FormsComponent,
    CapsLockDirective,
    SearchCriteriaComponent,
    CommonDialogComponent,
    PrivacyPolicyComponent,
    CommonAlertsComponent,
    IconsComponent,
    TreeconcComponent,
    StepperComponent,
    PhoneFieldComponent,
    ChangePasswordDialogComponent,
    PhoneMultiComponent,
    DepartteamComponent,
    DuplicateComponent,
    DboardComponent,
    NotificationComponent,
    ReportDesignComponent,
    VtsdashboardComponent,
    AddAddressDetailComponent,
    GlobalSearchComponent,
    DigitaladdressverficationComponent,
    SelectpackageaddtionalchecksComponent,
    AddtionalchecksComponent,
    CandidateregisterComponent,
    UndermaintanceComponent,
    // FocusInvalidInputDirective,
    // ScannerComponent,
    LocationComponent,
    CaptureMainComponent,
    SignatureComponent,
    ImageComponent,
    VideoComponent,
    ShowImageDialogComponent,
    DirectAppCandidateInsuffComponent,
    AdvanceSearchComponent,
    AuthCallbackComponent,
    DigilockerCallbackComponentComponent,
    UrlExpiredComponent,
    SsologinComponent
  ],
  imports: [
    SharedModule,
    AppRoutingModule,
    HttpClientModule,
    FlexLayoutModule,
    RouterModule,
    BrowserModule,
      // CommonModule,
    BrowserAnimationsModule,
    ToastModule,
    CalendarModule,
    GridModule,
    CountdownComponent,
    NgxScannerQrcodeComponent,
     MaterialModule,
    AngularEditorModule,

     MatCheckboxModule,
    GoogleMapsModule,
OAuthModule.forRoot({
      resourceServer: {
        allowedUrls: [window.location.origin+ '/ssologin'],
        sendAccessToken: true
      }
    }),
  ],
  providers: [
    TabPreventionService,
    MessageService,
    BnNgIdleService,
    DatePipe,
    MatBottomSheet,
    {
      /*API interceptor should invoked here to attach with all http request */
      provide: HTTP_INTERCEPTORS,
      useClass: Interceptor,
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (authService: AuthService) => () => authService.load(),
      deps: [AuthService],
      multi: true,
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'en-GB'
    },
    {
      provide: OWL_DATE_TIME_LOCALE,
      useValue: 'en-au',
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline', floatLabel: 'always' }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
