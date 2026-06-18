import { Component, OnInit, ViewChild, TemplateRef, Input } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ScreeningService } from '../../services/screening.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  standalone: false,
  selector: 'app-insuff-history',
  templateUrl: './insuff-history.component.html',
  styleUrls: ['./insuff-history.component.css']
})
export class InsuffHistoryComponent implements OnInit {
  @Input() screeningCompId: any;
  @ViewChild('history', { static: true }) history!: TemplateRef<any>;
  // @ViewChild('history', { static: true }) history!: TemplateRef<any>;
  historyData: any;
  @Input() isInsuffScreen: any;
  constructor(public common: CommonService, private screeningService: ScreeningService, public dialog: MatDialog) { }

  ngOnInit() {
    if (this.isInsuffScreen) {
      this.screeningCompId = this.common.getNuumberFromString(this.screeningCompId);
    }
  }
  // downloadDoc(screeningDocId, document, fileName) {
  //   this.common.downloadDocument(screeningDocId, document, fileName);
  // }
  
  downloadDoc(data: any) {
    this.screeningService.downloadScreeningDocument(data).subscribe(resp => {
      this.common.downloadDocument(data, resp.document, resp.fileName);
    });
  }
  openHistory() {
    let value: any[] = [];
    this.screeningService.GetInsuffDetailsByScreenCompId(this.screeningCompId).subscribe(res => {
      if (res) {
        this.historyData = res;
        this.historyData.forEach(ele => {
          ele.insuffDetail.forEach(element => {
            element.docReqFlag === true ? element.Document = element.comments : element.Information = element.comments;
          });
          if (ele.insuffDetail.length > 0 && ele.insuffReqType.toLowerCase() === this.common.INFO_DOCU.toLowerCase()) {
            value = ele.insuffDetail.filter(x => x.insuffStatus.toLowerCase() === this.common.RAISED.toLowerCase());
            // if (value.length > 0 && (value[0].infoReqFlag || value[0].docReqFlag)) {
            //   value[0].docReqFlag === true ? value[0].Information = value[1].Information : value[0].Document = value[1].Document;
            // }
            ele.insuffDetail = ele.insuffDetail.filter(x => x.insuffStatus.toLowerCase() !== this.common.RAISED.toLowerCase());
            ele.insuffDetail.unshift(value[0]);
          }
        });
        this.dialog.open(this.history, {
          width: '800px',
          disableClose: true
        });
      }
    });
  }
}
