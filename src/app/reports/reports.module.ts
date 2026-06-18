import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsRoutingModule } from './reports-routing.module';
import { SharedModule } from '../common-methods/modules/shared.module';
import { FinalinterimReportComponent } from './finalinterim-report/finalinterim-report.component';
import { IndividualReportComponent } from './individual-report/individual-report.component';
import { SupplementryReportComponent } from './supplementry-report/supplementry-report.component';
import { CriminalCheckReportComponent } from './reportTracker/criminal-check-report/criminal-check-report.component';
import { EmployeementReportComponent } from './reportTracker/employeement-report/employeement-report.component';
import { NotAssignedCaseReportComponent } from './reportTracker/not-assigned-case-report/not-assigned-case-report.component';
import { ApprovalPendingReportComponent } from './reportTracker/approval-pending-report/approval-pending-report.component';
import { PendingComponentListComponent } from './reportTracker/pending-component-list/pending-component-list.component';
import { DynamicReportComponentComponent } from './reportTracker/dynamic-report-component/dynamic-report-component.component';
import { VendorCaseListComponent } from './reportTracker/vendor-case-list/vendor-case-list.component';
import { EmailBackupComponent } from './email-backup/email-backup.component';
import { SeventhDayReportComponent } from './seventh-day-report/seventh-day-report.component';
import { PendingListReportComponent } from './pending-list-report/pending-list-report.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { JCRFileDownloadComponent } from './reportTracker/jcr-filedownload/jcr-filedownload.component';
import { AllcasesComponent } from './allcases/allcases.component';
import { FileLevelTrackerComponent } from './file-level-tracker/file-level-tracker.component';
import { FileLevelTrackerMisComponent } from './file-level-tracker-mis/file-level-tracker-mis.component';

@NgModule({
    declarations: [FinalinterimReportComponent, IndividualReportComponent,
        SupplementryReportComponent, CriminalCheckReportComponent, EmployeementReportComponent,
        NotAssignedCaseReportComponent, ApprovalPendingReportComponent,
        PendingComponentListComponent,
        DynamicReportComponentComponent,
        VendorCaseListComponent,
        EmailBackupComponent,
        PendingListReportComponent,
        SeventhDayReportComponent,
        JCRFileDownloadComponent,
        StatisticsComponent,
        AllcasesComponent,
        FileLevelTrackerComponent,FileLevelTrackerMisComponent],
    imports: [
        CommonModule,
        ReportsRoutingModule,
        SharedModule
    ]
})
export class ReportsModule { }
