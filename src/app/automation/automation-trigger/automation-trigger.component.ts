import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AutomationService } from 'src/app/common-methods/services/automation.service';
import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { DatePipe } from '@angular/common';
import { months } from 'moment';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
@Component({
  standalone: false,
  selector: 'app-automation-trigger',
  templateUrl: './automation-trigger.component.html',
  styleUrls: ['./automation-trigger.component.css']
})
export class AutomationTriggerComponent implements OnInit {
  breadcrumbFlags = new BreadcrumbFlags();
  month: any;
  incase: any;
  incheck: any;
  tcase: any;
  tcheck: any;
  ccase: any;
  ccheck: any;
  ocase: any;
  tocase: any;
  tocheck: any;
  routePath = 'Automation / Automation Trigger';
  execeldata: any;
  userData: any;
  outputExcel: any[] = [];
  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  EXCEL_EXTENSION = '.xlsx';
  selectedBindList: any[] = [];
  from: any;
  to: any;
  type: any;
  qcApprovedForm: UntypedFormGroup;
  showInfoceptTrigger = true;

  constructor(public common: CommonService, public dialog: MatDialog, private router: Router, public automation: AutomationService,
    public messageService: MessageService, public datepipe: DatePipe,public screeningService:ScreeningService) {

  }
  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    if (this.userData.infoceptUser === false && this.userData.teamName === 'CRTIndia') {
      this.showInfoceptTrigger = false;
    }
    this.initFormGroup();
  }
  showTopCenter(level: string, info: string, message: string) {
    this.messageService.add({ severity: level, summary: info, detail: message });
  }
  TatOutCloseInsufficiency() {
    this.automation.TatOutCloseInsufficiency(this.userData.userId).subscribe(res => {
      if (res) {
        if (res.success === true) {
          this.showTopCenter('success', 'Success Message', 'Close insufficiency status updated successfully');
        } else {
          this.showTopCenter('info', 'Information', res.message);
        }
      }
    });
  }
  DOJRemainderMail() {
    this.automation.DOJRemainderMail(this.userData.userId).subscribe(res => {
      if (res) {
        this.showTopCenter('success', 'Success Message', 'Date of joining recruiter mail send successfully');
      }
    });
  }
  SendInvitationReminderMail() {
    this.automation.SendInvitationReminderMail(this.userData.userId).subscribe(res => {
      if (res) {
        this.showTopCenter('success', 'Success Message', 'Invitation Reminder mail send successfully');
      }
    });
  }
  GetConsolidateInsuffMail(cumulative: any) {
    this.automation.GetConsolidateInsuffMail(cumulative).subscribe(res => {
      if (res.success) {
        this.showTopCenter('success', 'Success Message', 'Invitation Reminder mail send successfully');
      } else {
        this.showTopCenter('warn', 'Failure Message', 'No Record In Invitation Reminder mail ');
      }
    }, err => { }, () => {
      // this.showTopCenter('warn', 'Failure Message', 'Mail not sent');
    });
  }
  SendClientAgreementReminderMail() {
    this.automation.SendClientAgreementReminderMail().subscribe(res => {
      if (res) {
        this.showTopCenter('success', 'Success Message', 'Client Agreement Reminder mail send successfully');
      }
    });
  }
  ConsolidateCandidateCreateACK() {
    this.automation.ConsolidateDirectAppCandidateCreateACK().subscribe(res => {
      if (res) {
        this.showTopCenter('success', 'Success Message', 'Consolidate Candidate Create mail send successfully');
      }
    });
  }
  ConsolidateCandidateSubmissionACK() {
    this.automation.ConsolidateDirectAppCandidateSubmissionACK().subscribe(res => {
      if (res) {
        this.showTopCenter('success', 'Success Message', 'Consolidate Candidate Submission mail send successfully');
      }
    });
  }
  CalculateInprogressDays() {
    this.automation.CalculateInprogressDays(this.screeningService.screeningCompId).subscribe(res => {
      if (res) {
        this.showTopCenter('success', 'Success Message', 'Inprogress Days Created Successfully');
      }
    });
  }
  // Save Invitation Expiry Date
  SaveInvitationExpireDate() {
    this.automation.SaveInvitationExpireDate().subscribe(res => {
      if (res) {
        this.showTopCenter('success', 'Success Message', 'Invitation Expired Date updated successfully');
      }
    });
  }
  InfoceptApiCaseCreation() {
    this.automation.InfoceptCaseCreation().subscribe(res => {
      if (res.success === true) {
        this.showTopCenter('success', 'Success Message', 'Case created successfully')
      } else {
        this.showTopCenter('success', 'Success Message', res.message)
      }
    })
  }
  InfoceptApiFTP() {
    this.automation.InfoceptApiFTP().subscribe(res => {
      if (res.success === true) {
        this.showTopCenter('success', 'Success Message', 'File created successfully')
      } else {
        this.showTopCenter('success', 'Success Message', res.message)
      }
    })
  }
  Savetemplate() {
    this.automation.Savetemplate().subscribe(res => {
      if (res) {
        this.showTopCenter('success', 'Success Message', 'template  updated successfully');
      }
    });
  }
  //
  GetMonthWiseComponentCompletedList() {
    this.automation.GetMonthWiseComponentCompletedList().subscribe(res => {
      if (res) {
        this.selectedBindList = res;
        this.execeldata = [];
        this.outputExcel = this.selectedBindList
        this.outputExcel.forEach((ele, i) => {
          ele.sNo = i + 1;
          ele.screeningOwner = ele.screeningOwner.firstName + ' ' + ele.screeningOwner.middleName + ' ' + ele.screeningOwner.lastName
          ele.candidateName = ele.candidateName.firstName + ' ' + ele.candidateName.middleName + ' ' + ele.candidateName.lastName
        })

        const cols = [
          { field: 'sNo', header: 'S.No' },
          { field: 'candidateName', header: 'Candidate Name' },
          { field: 'checkDueDate', header: 'Check DueDate' },
          { field: 'clientName', header: 'Client Name' },
          { field: 'clientReferenceNo', header: 'Client Reference No' },
          { field: 'completedTATDays', header: ' Completed TAT Days' },
          { field: 'completedTATStatus', header: 'Completed TAT Status' },
          { field: 'componentName', header: 'Component Name' },
          { field: 'holidayandWeekendDays', header: 'Holiday and Weekend Days' },
          { field: 'initiatedDate', header: 'Initiated Date' },
          { field: 'insuffDays', header: 'Insuff Days' },
          { field: 'screeningOwner', header: 'Screening Owner' },
          { field: 'screeningStatus', header: 'Screening Status' },
          { field: 'tatDay', header: 'TAT Day' },
          { field: 'verificationID', header: 'Verification ID' }

        ];

        this.common.exportToExcel(cols, this.outputExcel, 'Month Wise Component Completed', true);
      }
    });
  }
  GetFileCompletedMonthlyDataList() {
    this.automation.GetFileCompletedMonthlyDataList().subscribe(res => {
      if (res) {
        let compName= [];
        let comp = ''
        this.selectedBindList = res;
        this.execeldata = [];
        this.outputExcel = this.selectedBindList

        this.outputExcel.forEach((element, i) => {
          element.componentName.forEach(ele => {
            const cName = ele.componentName;
            compName.push(cName);
          });
          element.componentName = compName.join('+');

          element.candidateName = element.candidateName.firstName + ' ' + element.candidateName.middleName + ' ' + element.candidateName.lastName
          element.sNo = i + 1;
        });

        const cols = [
          { field: 'sNo', header: 'S.No' },
          { field: 'candidateName', header: 'Candidate Name' },
          { field: 'caseCompletionDate', header: 'Case Completion Date' },
          { field: 'caseDueDate', header: 'Case Due Date' },
          { field: 'clientName', header: 'Client Name' },
          { field: 'clientReferanceNo', header: 'Client Reference Number' },
          { field: 'colorCode', header: 'Color Code' },
          { field: 'componentName', header: 'Component Name' },
          { field: 'finalReportGeneratedDate', header: 'Final Report Generate Date' },
          { field: 'lastComponentClosed', header: 'Last Component Closed' },
          { field: 'tatStatus', header: 'TAT Status' }
        ];

        this.common.exportToExcel(cols, this.outputExcel, 'File Completed Monthly Reports', true);
      }

    });
  }
  GetMonthlyStatisticsReports() {
    this.automation.GetMonthlyStatisticsReports().subscribe(res => {
      if (res) {
        this.selectedBindList = res;
        this.execeldata = [];
        this.outputExcel = this.selectedBindList
        this.outputExcel.forEach((ele, i) => {
          ele.sNo = i + 1;
        })

        const cols = [
          { field: 'sNo', header: 'S.No' },
          { field: 'componentsName', header: 'Component Name' },
          { field: 'casesComponentsClosedwithinTAT', header: 'Cases Components Closed Within TAT' },
          { field: 'closedUnVerified', header: 'Closed UnVerified' },
          { field: 'componentsClosedBeyondTAT', header: 'Components Closed Beyond TAT' },
          { field: 'componentsReceived', header: 'Components Received' },
          { field: 'componentsverified', header: 'components Verified' },
          { field: 'insuffLevelOne', header: 'Insuff Level One' },
          { field: 'insuffLevelTwo', header: 'Insuff Level Two' },
          { field: 'percentageofclosuresReceivedVsClosed', header: 'Percentage Of Closures Received Vs Closed' },
          { field: 'qcPassed', header: 'Qc Passed' },
          { field: 'qcRejected', header: 'Qc Rejected' },
          { field: 'stopCase', header: 'Stop Case' }

        ];

        this.common.exportToExcel(cols, this.outputExcel, 'Monthly Statistic Report', true);
      }

    });
  }

  GetCumulativeMonthlyCasesAndChecksReportList() {
    this.automation.GetCumulativeMonthlyCasesAndChecksReportList().subscribe(res => {
      if (res) {
        this.execeldata = [];
        const indcase: any[] = [];
        const indcheck: any[] = [];
        res.indianClientCountVms.forEach(element1 => {
          indcase.push(element1.caseCreatedCount);
          indcheck.push(element1.checksCreatedCount)
        })
        const cols = [
          { field: '', header: '' },
          { field: 'incase', header: 'Case Created' },
          { field: 'incheck', header: 'Check Created' },
          { field: 'tcase', header: 'Case Created' },
          { field: 'tcheck', header: 'Check Created' },
          { field: 'ccase', header: 'Case Created' },
          { field: 'ccheck', header: 'Check Created' },
          { field: 'ocase', header: 'Checks Created' },
          { field: 'tocase', header: 'Total Case Created' },
          { field: 'tocheck', header: 'Total Check Created' },
        ];
        let tabtext = '<table border="1px">';
        let j = 0;
        const header = cols;
        const lines = indcase.length;
        let headerColos = '';
        let PheaderColos = ''
        PheaderColos = '<tr><th bgcolor="#0E4872" style="font-size:15px;color:white" colspan="1"> </th><th bgcolor="#0E4872" style="font-size:15px;color:white" colspan="2">Indian Clients </th><th bgcolor="#0E4872" style="font-size:15px;color:white" colspan="2">TechM </th><th bgcolor="#0E4872" style="font-size:15px;color:white" colspan="2">CTS Client </th><th bgcolor="#0E4872" style="font-size:15px;color:white" colspan="1">Overseas </th><th bgcolor="#0E4872" style="font-size:15px;color:white" colspan="2">Total </th></tr>'
        header.forEach(h => {
          {
            headerColos = headerColos + '<th bgcolor="#0E4872" style="font-size:15px;color:white">' + h.header + '</th>';
          }
        });
        tabtext = tabtext + PheaderColos + '<tr>' + headerColos + '</tr>';
        var icaTotal = 0;
        var ichTotal = 0;
        var tcaTotal = 0;
        var tchTotal = 0;
        var ccaTotal = 0;
        var cchTotal = 0;
        var ocaTotal = 0;
        var tocaTotal = 0;
        var tochTotal = 0;
        for (j = 0; j < lines; j++) {
          headerColos = '';
          if (res.indianClientCountVms.length > 0) {
            if (Object.keys(res.indianClientCountVms[j]).length != 0) {
              this.month = res.indianClientCountVms[j].monthAndYear;
              this.incase = res.indianClientCountVms[j].caseCreatedCount ? res.indianClientCountVms[j].caseCreatedCount : '0';
              this.incheck = res.indianClientCountVms[j].checksCreatedCount ? res.indianClientCountVms[j].checksCreatedCount : '0';
              icaTotal += res.indianClientCountVms[j].caseCreatedCount;
              ichTotal += res.indianClientCountVms[j].checksCreatedCount;
            } else {
              this.month = 0;
              this.incase = 0;
              this.incheck = 0;
            }
          }
          else {
            this.month = 0;
            this.incase = 0;
            this.incheck = 0;
          }
          if (res.techMClientCountVm.length > 0) {
            if (Object.keys(res.techMClientCountVm[j]).length != 0) {
              this.tcase = res.techMClientCountVm[j].caseCreatedCount ? res.techMClientCountVm[j].caseCreatedCount : 0;
              this.tcheck = res.techMClientCountVm[j].checksCreatedCount ? res.techMClientCountVm[j].checksCreatedCount : 0;
              tcaTotal += res.techMClientCountVm[j].caseCreatedCount;
              tchTotal += res.techMClientCountVm[j].checksCreatedCount;
            } else {
              this.tcase = 0;
              this.tcheck = 0;
            }
          }
          else {
            this.tcase = 0;
            this.tcheck = 0;
          }
          if (res.cTSClientCountVm.length > 0) {
            if (Object.keys(res.cTSClientCountVm[j]).length != 0) {
              this.ccase = res.cTSClientCountVm[j].caseCreatedCount ? res.cTSClientCountVm[j].caseCreatedCount : 0;
              this.ccheck = res.cTSClientCountVm[j].checksCreatedCount ? res.cTSClientCountVm[j].checksCreatedCount : 0;
              ccaTotal += res.cTSClientCountVm[j].caseCreatedCount;
              cchTotal += res.cTSClientCountVm[j].checksCreatedCount;
            } else {
              this.ccase = 0;
              this.ccheck = 0;
            }
          }
          else {
            this.ccase = 0;
            this.ccheck = 0;
          }
          if (res.overseasClientCountVm.length > 0) {
            if (Object.keys(res.overseasClientCountVm[j]).length != 0) {
              this.ocase = res.overseasClientCountVm[j].caseCreatedCount ? res.overseasClientCountVm.caseCreatedCount : 0;
              ocaTotal += res.overseasClientCountVm[j].checksCreatedCount;
            } else {
              this.ocase = 0;
            }
          }
          else {
            this.ocase = 0;
          } if (res.monthWiseTotalCount.length > 0) {
            if (Object.keys(res.monthWiseTotalCount[j]).length != 0) {
              this.tocase = res.monthWiseTotalCount[j].totalCaseCount ? res.monthWiseTotalCount[j].totalCaseCount : 0;
              this.tocheck = res.monthWiseTotalCount[j].totalChecksCount ? res.monthWiseTotalCount[j].totalChecksCount : 0;
              tocaTotal += res.monthWiseTotalCount[j].totalCaseCount;
              tochTotal += res.monthWiseTotalCount[j].totalChecksCount;
            }
          }
          headerColos = headerColos + '<td>' + this.month + '</td><td style="font-size:12px";>' + this.incase + '</td><td>' + this.incheck + '</td><td>' + this.tcase + '</td><td>' + this.tcheck + '</td><td>' + this.ccase + '</td><td>' + this.ccheck + '</td><td>' + this.ocase + '</td><td>' + this.tocase + '</td><td>' + this.tocheck + '</td>';
          tabtext = tabtext + '<tr>' + headerColos + '</tr>';
        }
        const total = '<tfoot><tr><td>Total</td><td>' + icaTotal + '</td><td>' + ichTotal + '</td><td>' + tcaTotal + '</td><td>' + tchTotal + '</td><td>' + ccaTotal + '</td><td>' + cchTotal + '</td><td>' + ocaTotal + '</td><td>' + tocaTotal + '</td><td>' + tochTotal + '</td></tr><tfoot>'
        tabtext = tabtext + total;
        tabtext = tabtext + '</table>';
        tabtext = tabtext.replace(/<A[^>]*>|<\/A>/g, '');          // remove if u want links in your table
        tabtext = tabtext.replace(/<img[^>]*>/gi, '');             // remove if u want images in your table
        tabtext = tabtext.replace(/<input[^>]*>|<\/input>/gi, ''); // reomves input params
        const fileName = 'Cumulative Monthly Cases And Checks Report List.xls';
        const exceldata = new Blob([tabtext], { type: this.EXCEL_TYPE });
        if ((window.navigator as any).msSaveBlob) { // IE 10+
          (window.navigator as any).msSaveOrOpenBlob(exceldata, fileName);
        } else {
          const link = document.createElement('a'); // create link download file
          link.href = window.URL.createObjectURL(exceldata); // set url for link download
          link.setAttribute('download', fileName); // set attribute for link created
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    });
  }
  GetIQCPartialDetails() {

    this.automation.GetIQCPartialDetails(this.userData).subscribe(res => {
      if (res) {
        this.selectedBindList = res;
        this.execeldata = [];
        this.outputExcel = this.selectedBindList
        this.outputExcel.forEach((ele, i) => {
          ele.sno = i + 1;
          ele.firstName = ele.firstName + ' ' + ele.middleName + ' ' + ele.lastName
          ele.siteName = ele.siteName + ' - ' + ele.siteNo
        })

        const cols = [
          { field: 'sno', header: 'S.No' },
          { field: 'firstName', header: 'Candidate Name' },
          { field: 'clientName', header: 'Client Name' },
          { field: 'siteName', header: 'SiteName' },
          { field: 'caseInititationDate', header: 'Case Inititation Date' }

        ];

        this.common.exportToExcel(cols, this.outputExcel, 'Individual QC Partial Details', true);
      }

    });
  }

  GetMonthlySLAReportsList() {
    this.automation.GetMonthlySLAReportsList().subscribe(res => {
      if (res) {
        this.selectedBindList = res;
        this.execeldata = [];
        this.outputExcel = this.selectedBindList
        this.outputExcel.forEach((ele, i) => {
          ele.sNo = i + 1;
        })
        const cols = [
          { field: 'sNo', header: 'S.No' },
          { field: 'casesCompletedBeyondTAT', header: 'Cases Completed Beyond TAT' },
          { field: 'casesCompletedWithinTAT', header: 'Cases Completed Within TAT' },
          { field: 'clientName', header: 'Client Name' },
          { field: 'greenReports', header: 'Green Reports' },
          { field: 'insufficiency', header: 'Insufficiency' },
          { field: 'redReports', header: 'Red Reports' },
          { field: 'slaPercentage', header: 'SLA %' },
          { field: 'totalCasesCompleted', header: 'Total Cases Completed' },
          { field: 'yellowReports', header: 'Yellow Reports' },
        ];

        this.common.exportToExcel(cols, this.outputExcel, 'Monthly SLA Reports List', true);
      }

    });
  }
  initFormGroup() {
    this.qcApprovedForm = new UntypedFormGroup({
      from: new UntypedFormControl(null),
      to: new UntypedFormControl(null),
      type: new UntypedFormControl(null)
    });
  }
  approvedFileMoveToTempPath(from, to) {
    //let type = fqc;
    const fromDate = this.datepipe.transform(this.qcApprovedForm.value.from, 'yyyy-MM-dd');
    const toDate = this.datepipe.transform(this.qcApprovedForm.value.to, 'yyyy-MM-dd');

    // let fromDate: this.common.getTimezoneOffset(this.qcApprovedForm.value.from, false); // this.dateChange(this.pDateRange[0]
    // let toDate: this.common.getTimezoneOffset(this.qcApprovedForm.value.to, false);
    this.automation.approvedFileMoveToTempPath(fromDate, toDate, this.qcApprovedForm.value.type).subscribe(res => {
      if (res) {
        console.log(res);
      }
    });
  }
}
