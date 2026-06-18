import { Component, OnInit } from '@angular/core';
import { DashboardCountVm } from '../../common-methods/models/login';
import { ScreeningService } from '../../common-methods/services/screening.service';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';

@Component({
  standalone: false,
  selector: 'app-pending-list-report',
  templateUrl: './pending-list-report.component.html',
  styleUrls: ['./pending-list-report.component.css']
})
export class PendingListReportComponent implements OnInit {
  routePath = 'Reports / Pending Reports / Pending List ';
  dashboardCountVm = new DashboardCountVm();
  pendingStatusValue: any[] = [];
  outputDataReportList: any;
  userData: any;
  screeningStatus: any;
  verificationCaseCount = 0;
  outputDataExcel: any[] = [];
  screenName: any;
  execeldata: any;
  constructor(public messageService: MessageService, private dateP: DatePipe, private screeningService: ScreeningService, public common: CommonService) { }
  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.getpendingstatus();
  }
  getExport(screeningstatusid: any) {
    this.screeningService.getReportPendingList(screeningstatusid).subscribe(res => {
      if (res) {
        // console.log(res);
        this.outputDataReportList = res;
        this.exportExcel();
      }
    });
  }
  showTopCenter(level: string, info: string, message: string) {
    this.messageService.add({ severity: level, summary: info, detail: message });
  }
  exportExcel() {
    this.execeldata = [];
    this.screenName = 'Pending_Verifications';
    let canName: any[] = [];
    let compName= [];
    const objd = this.common.ConvertKeysToLowerCase(this.outputDataReportList);
    if (objd) {
      this.outputDataExcel = objd;
    }
    if (this.outputDataExcel.length > 0) {
      this.outputDataExcel.forEach(ele => {
        let caname = (ele.CandidateFirstName + ele.CandidateMiddleName + ele.CandidateLastName);
        canName.push(caname);
        let comname = (ele.SubCompName !== null ? ele.ComponentName + ' - ' + ele.SubCompName :
          ele.ComponentName);
        compName.push(comname);
        this.execeldata.push({
          'Verification Id': ele.VerificationId,
          'Cliend Ref No': ele.ClientRefNo,
          'Candidate Name': caname,
          'Client Name': ele.ClientName,
          'Vendor Name': ele.VendorName,
          'Status': ele.ComponentStatus,
          'Component Name': comname,
          'Created Name': ele.CreatedName,
          'Screen Owner': ele.ScreeningOwnerName,
          'Requested Date': ele.RequestDate ?
            (this.dateP.transform(ele.RequestDate, 'dd-MM-yyyy')) : 'N/A',
        });
      });
      const ws = XLSX.utils.json_to_sheet(this.execeldata);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, this.screenName);
      XLSX.writeFile(wb, this.screenName + '.xlsx');
    } else {
      this.showTopCenter('warn', 'Failure Message', 'No Record Found');
    }
  }
  getpendingstatus() {
    this.screeningService.getReportPendingCount().subscribe(res => {
      if (res) {
        this.pendingStatusValue.push(res);
        // console.log(this.pendingStatusValue);
      }
    });
  }
}
