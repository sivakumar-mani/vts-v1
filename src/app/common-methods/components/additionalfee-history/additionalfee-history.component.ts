import { Component, OnInit, ViewChild, TemplateRef, Input } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ScreeningService } from '../../services/screening.service';
import { MatDialog } from '@angular/material/dialog';
import { QualityCheckService } from '../../services/quality-check.service';

@Component({
  standalone: false,
  selector: 'app-additionalfee-history',
  templateUrl: './additionalfee-history.component.html',
  styleUrls: ['./additionalfee-history.component.css']
})
export class AdditionalfeeHistoryComponent implements OnInit {
  @Input() screeningCompId: any;
  @Input() screeningId: any;
  @Input() finalQcFlag: any;
  // @ViewChild('history', { static: true }) history!: TemplateRef<any>;
  // @ViewChild('history', { static: true })
  @ViewChild('history', { static: true }) history!: TemplateRef<any>;
  // history!: TemplateRef<any>;
  historyData: any;
  @Input() isHistoryScreen: any;
  constructor(public common: CommonService, private screeningService: ScreeningService, private qualityCheckService: QualityCheckService, public dialog: MatDialog) { }

  ngOnInit() {
    if (this.isHistoryScreen) {
      this.screeningCompId = this.common.getNuumberFromString(this.screeningCompId);
    }
  }
  openHistory() {
    if (this.finalQcFlag === true) {
      this.screeningCompId = 0;
    }
    else {
      this.screeningId = 0;
    }
    this.qualityCheckService.GetAdditionalFeeDetails(this.screeningCompId, this.screeningId).subscribe(res => {
      if (res) {
        this.historyData = res;
        this.historyData.forEach((ele: any, i: number) => {
          ele.approvedBy = ele.approvedBy.firstName + (ele.approvedBy.middleName ? ' ' + ele.approvedBy.middleName : ' ') + ele.approvedBy.lastName;
          ele.raisedBy = ele.raisedBy.firstName + (ele.raisedBy.middleName ? ' ' + ele.raisedBy.middleName : ' ') + ele.raisedBy.lastName;
          if (ele.feeAmount.length > 1) {
            ele.feeAmount = ele.feeAmount[i];
          }
        })
        this.dialog.open(this.history, {
          width: '800px',
          disableClose: true
        });
      }
    });
  }
}
