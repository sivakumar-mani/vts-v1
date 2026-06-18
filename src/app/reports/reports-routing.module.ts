import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FinalinterimReportComponent } from './finalinterim-report/finalinterim-report.component';
import { IndividualReportComponent } from './individual-report/individual-report.component';
import { SupplementryReportComponent } from './supplementry-report/supplementry-report.component';
import { CanactivateGuard } from '../common-methods/guards/canactivate.guard';
import { CriminalCheckReportComponent } from './reportTracker/criminal-check-report/criminal-check-report.component';
import { EmployeementReportComponent } from './reportTracker/employeement-report/employeement-report.component';
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


const routes: Routes = [
    {
        path: 'finalInterimReport', component: FinalinterimReportComponent,
        canActivate: [CanactivateGuard]
        // , data: { moduleName: 'Report', screenName: 'Final Report' }
    },
    {
        path: 'interimReport', component: FinalinterimReportComponent,
        canActivate: [CanactivateGuard]
        // , data: { moduleName: 'Report', screenName: 'Final Report' }
    },
    {
        path: 'SRReport', component: FinalinterimReportComponent,
        canActivate: [CanactivateGuard]
        // , data: { moduleName: 'Report', screenName: 'Final Report' }
    },
    {
        path: 'pendinglistReport', component: PendingListReportComponent,
      //  canActivate: [CanactivateGuard], data: { moduleName: 'Report', screenName: 'Pending List Report' }
    },
    {
        path: 'individualReport', component: IndividualReportComponent,
        canActivate: [CanactivateGuard]
        // , data: { moduleName: 'Report', screenName: 'Individual Report' }
    },
    {
        path: 'supplementryReport', component: SupplementryReportComponent,
        canActivate: [CanactivateGuard]
        // , data: { moduleName: 'Report', screenName: 'Supplementry Report' }
    },
    {
        path: 'employeementReport', component: DynamicReportComponentComponent,
        canActivate: [CanactivateGuard]
        // , data: { moduleName: 'Report', screenName: 'Employment - MIS' }
    },
    {
        path: 'criminalCheckReport', component: CriminalCheckReportComponent,
        canActivate: [CanactivateGuard]
        // , data: { moduleName: 'Report', screenName: 'Criminal Check - MIS' }
    },
    {
        path: 'criminalCheck', component: DynamicReportComponentComponent,
        canActivate: [CanactivateGuard]
        // , data: { moduleName: 'Report', screenName: 'Criminal Check - MIS' }
    },
    {
        path: 'identity', component: DynamicReportComponentComponent,
        canActivate: [CanactivateGuard]
        // , data: { moduleName: 'Report', screenName: 'Education - MIS' }
    },
    {
        path: 'pendingCompList', component: DynamicReportComponentComponent,
        canActivate: [CanactivateGuard]
        // , data: { moduleName: 'Report', screenName: 'Pending Component List' }
    },
    {
        path: 'submissionList', component: DynamicReportComponentComponent,
        canActivate: [CanactivateGuard]
        // , data: { moduleName: 'Report', screenName: 'Submission List' }
    },
    {
        path: 'closedChecksHistory', component: DynamicReportComponentComponent,
        canActivate: [CanactivateGuard]
        // , data: { moduleName: 'Report', screenName: 'Closed Checks History' }
    },
    {
        path: 'notAssignedCaseList', component: DynamicReportComponentComponent,
        canActivate: [CanactivateGuard]
        // , data: { moduleName: 'Report', screenName: 'FQC Not Assigned List' }
    },
    {
        path: 'approvedPendingList', component: DynamicReportComponentComponent,
        canActivate: [CanactivateGuard]
        // , data: { moduleName: 'Report', screenName: 'FQC Approved List' }
    },
    {
        path: 'qcrejecthistory', component: DynamicReportComponentComponent,
        canActivate: [CanactivateGuard]
        // , data: { moduleName: 'Report', screenName: 'QC Rejected History' }
    },
    {
        path: 'fqcPendingList', component: DynamicReportComponentComponent,
        canActivate: [CanactivateGuard]
        // , data: { moduleName: 'Report', screenName: 'FQC Pending List' }
    },
    {
        path: 'closureMIS', component: DynamicReportComponentComponent,
        canActivate: [CanactivateGuard]
        // , data: { moduleName: 'Report', screenName: 'Client Closure Report MIS' }
    },
    {
        path: 'iqcPendingList', component: DynamicReportComponentComponent,
        canActivate: [CanactivateGuard]
        // , data: { moduleName: 'Report', screenName: 'Individual QC Pending List' }
    },
    {
        path: 'cancelMIS', component: DynamicReportComponentComponent,
        canActivate: [CanactivateGuard]
        // , data: { moduleName: 'Report', screenName: 'FQC Pending List' }
    },
    {
        path: 'allQcPendingList', component: DynamicReportComponentComponent,
        canActivate: [CanactivateGuard]
        // , data: { moduleName: 'Report', screenName: 'FQC Pending List' }
    },
    {
        path: 'pre-QC&DACaseCompletionMIS', component: DynamicReportComponentComponent,
        canActivate: [CanactivateGuard]
        // , data: { moduleName: 'Report', screenName: 'FQC Pending List' }
    },
    {
        path: 'preFinalCases', component: DynamicReportComponentComponent,
        canActivate: [CanactivateGuard]
        // , data: { moduleName: 'Report', screenName: 'FQC Pending List' }
    },
    {
        path: 'insufficiencyhistory', component: DynamicReportComponentComponent,
        canActivate: [CanactivateGuard]
        // , data: { moduleName: 'Report', screenName: 'FQC Pending List' }
    },

    {
        path: 'closureReport', component: DynamicReportComponentComponent,
        canActivate: [CanactivateGuard]
        // , data: { moduleName: 'Report', screenName: 'FQC Pending List' }
    },
    {
        path: 'bgvreport', component: DynamicReportComponentComponent,
        canActivate: [CanactivateGuard]
        // , data: { moduleName: 'Report', screenName: 'FQC Pending List' }
    },
    {
        path: 'componentReport', component: DynamicReportComponentComponent,
        canActivate: [CanactivateGuard]
        // , data: { moduleName: 'Report', screenName: 'Address - MIS' }
    },
    {
        path: 'techMClientReport', component: DynamicReportComponentComponent,
        canActivate: [CanactivateGuard]
        // , data: { moduleName: 'Report', screenName: 'Tech - M Client Report' }
    },
    {
        path: 'techMFinalReport', component: DynamicReportComponentComponent,
        canActivate: [CanactivateGuard]
        // , data: { moduleName: 'Report', screenName: 'Tech - M Interim/Final Report' }
    },
    {
        path: 'techMClientSpecificReport', component: DynamicReportComponentComponent,
        canActivate: [CanactivateGuard]
        // , data: { moduleName: 'Report', screenName: 'Tech - M Client Specific Report' }
    },
    {
        path: 'techMApplicant', component: DynamicReportComponentComponent,
        canActivate: [CanactivateGuard]
        // , data: { moduleName: 'Report', screenName: 'Tech - M Applicant Details' }
    },
    {
        path: 'techMQcError', component: DynamicReportComponentComponent,
        canActivate: [CanactivateGuard]
        // , data: { moduleName: 'Report', screenName: 'Tech - M QC Error Details' }
    },
    // {
    //     path: 'techMCea', component: DynamicReportComponentComponent,
    //     canActivate: [CanactivateGuard]
    //     // , data: { moduleName: 'Report', screenName: 'Tech - M CEA Details' }
    // },
    {
        path: 'techMPendingComponentList', component: DynamicReportComponentComponent,
        canActivate: [CanactivateGuard]
        // , data: { moduleName: 'Report', screenName: 'Tech - M Pending Component List' }
    },
    {
        path: 'techMClosedChecksHistory', component: DynamicReportComponentComponent,
        canActivate: [CanactivateGuard]
        // , data: { moduleName: 'Report', screenName: 'TechM Closed Checks History' }
    },
    {
        path: 'notSentToQc', component: DynamicReportComponentComponent,
        canActivate: [CanactivateGuard]
        // , data: { moduleName: 'Report', screenName: 'Not Sent To Qc List' }
    },
    {
        path: 'qcRejectedHistory', component: DynamicReportComponentComponent,
        canActivate: [CanactivateGuard]
        // , data: { moduleName: 'Report', screenName: 'QC Rejected History List' }
    },
    {
        path: 'callBack', component: DynamicReportComponentComponent,
        canActivate: [CanactivateGuard]
        // , data: { moduleName: 'Report', screenName: 'Call Back Details' }
    },
    {
        path: 'vendorCaseList', component: DynamicReportComponentComponent,
        canActivate: [CanactivateGuard]
        // , data: { moduleName: 'Report', screenName: 'Vendor Case List' }
    },
    {
        path: 'finalReportGeneratedList', component: DynamicReportComponentComponent,
        canActivate: [CanactivateGuard]
        // , data: { moduleName: 'Report', screenName: 'Final Report Generated List' }
    },
    {
        path: 'toDayComments', component: DynamicReportComponentComponent,
        canActivate: [CanactivateGuard]
        // , data: { moduleName: 'Report', screenName: 'Today Comments' }
    },
    {
        path: 'clientCommentedCases', component: DynamicReportComponentComponent,
        canActivate: [CanactivateGuard]
        // , data: { moduleName: 'Report', screenName: 'Client Commented Cases' }
    },
    {
        path: 'fileleveltracker', component: DynamicReportComponentComponent,
        canActivate: [CanactivateGuard]
        // , data: { moduleName: 'Report', screenName: 'File Level Tracker' }
    },
    {
        path: 'emailHistory', component: EmailBackupComponent,
        canActivate: [CanactivateGuard]
        // , data: { moduleName: 'Report', screenName: 'Email History' }
    },
    // {
    //     path: 'seventhDayReport', component: SeventhDayReportComponent,
    //     canActivate: [CanactivateGuard]
    //     // , data: { moduleName: 'Report', screenName: 'File Level Tracker' }
    // },
    {
        path: 'seventhDayReport', component: FileLevelTrackerComponent,
        canActivate: [CanactivateGuard]
    },
    {
        path: 'fileLevelTrackerMIS', component: FileLevelTrackerMisComponent,
        canActivate: [CanactivateGuard]
    },
    {
        path: 'EducationMIS', component: DynamicReportComponentComponent,
        canActivate: [CanactivateGuard]
        // , data: { moduleName: 'Report', screenName: 'Education - MIS' }
    },
    {
        path: 'SubPendingList', component: DynamicReportComponentComponent,
        canActivate: [CanactivateGuard]
        // , data: { moduleName: 'Report', screenName: 'Submission Pending List' }
    },
    {
        path: 'SubQcPendingList', component: DynamicReportComponentComponent,
        canActivate: [CanactivateGuard]
        // , data: { moduleName: 'Report', screenName: 'Submission DE - QC Pending List' }
    },
    {
        path: 'InsuffPendingList', component: DynamicReportComponentComponent,
        canActivate: [CanactivateGuard]
        // , data: { moduleName: 'Report', screenName: 'Insufficiency Tracker' }
    },
    {
        path: 'IndQcApprovedList', component: DynamicReportComponentComponent,
        canActivate: [CanactivateGuard]
        // , data: { moduleName: 'Report', screenName: 'Individual QC Approved List' }
    },
    {
        path: 'dailyTrackerReport', component: DynamicReportComponentComponent,
        canActivate: [CanactivateGuard]
        // , data: { moduleName: 'Report', screenName: 'Daily Tracker Report' }
    },
    {
        path: 'jcrfiledownload', component: JCRFileDownloadComponent,
        canActivate: [CanactivateGuard]
        // , data: { moduleName: 'Report', screenName: 'JCR File Download' }
    },
    {
        path: 'statistics', component: StatisticsComponent,
        canActivate: [CanactivateGuard]
        // , data: { moduleName: 'Report', screenName: 'Statistics' }
    },
    {
        path: 'allcases', component: AllcasesComponent,
        canActivate: [CanactivateGuard]
        // , data: { moduleName: 'Report', screenName: 'Statistics' }
    },
    {
        path: 'monthlyFRCompleted', component:DynamicReportComponentComponent ,
        canActivate: [CanactivateGuard]
    },
    {
        path: 'monthlyChecksCreated', component:DynamicReportComponentComponent ,
        canActivate: [CanactivateGuard]
    },
    {
        path: 'componentsMonthlylist', component:DynamicReportComponentComponent ,
        canActivate: [CanactivateGuard]
    },
    //Addded By Megala 02-02-2024
    {
        path: 'monthlyCompletedCaseComponentList', component:DynamicReportComponentComponent ,
        canActivate: [CanactivateGuard]
    },
    {
        path: 'monthlySLAColorCode', component:DynamicReportComponentComponent ,
        canActivate: [CanactivateGuard]
    },
  {
    path: 'techmSubPendingList', component: DynamicReportComponentComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'frRejectHistory', component: DynamicReportComponentComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'pendingcomponenttracker', component: DynamicReportComponentComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'dailytracker', component: DynamicReportComponentComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'MISReportTracker', component: DynamicReportComponentComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'submissionPendingTracker', component: DynamicReportComponentComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'submissionDEQCPendingTracker', component: DynamicReportComponentComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'preQCDACompletionMIS', component: DynamicReportComponentComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'closedChecksHistoryMIS', component: DynamicReportComponentComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'qCRejectedHistoryMIS', component: DynamicReportComponentComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'individualQCApprovedMIS', component: DynamicReportComponentComponent,
    canActivate: [CanactivateGuard]
  },
{
    path: 'addressMISReport', component: DynamicReportComponentComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'criminalCheckMISReport', component: DynamicReportComponentComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'employeementMISReport', component: DynamicReportComponentComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'EducationMISReport', component: DynamicReportComponentComponent,
    canActivate: [CanactivateGuard]
  },
  {
    path: 'identityMISReport', component: DynamicReportComponentComponent,
    canActivate: [CanactivateGuard]
  },
    {
        path: 'clientSummary', component: DynamicReportComponentComponent,
        canActivate: [CanactivateGuard]
    },
    //Added By Megala - VTS2-2024-DEV-0197
    {
        path: 'tatReport', component: DynamicReportComponentComponent,
        canActivate: [CanactivateGuard]
        // , data: { moduleName: 'Report', screenName: 'Pending Component List' }
    },
    {
        path: 'preQCRejectedHistory', component: DynamicReportComponentComponent,
        canActivate: [CanactivateGuard]
        // , data: { moduleName: 'Report', screenName: 'QC Rejected History List' }
    },
    // Added By Megala - For (sprint -22) VTS2-2024-CRT-0195
    {
        path: 'colorCodeCAMApprovalTracker', component: DynamicReportComponentComponent,
        canActivate: [CanactivateGuard]
        // , data: { moduleName: 'Report', screenName: 'Color code CAM approval tracker' }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReportsRoutingModule { }
