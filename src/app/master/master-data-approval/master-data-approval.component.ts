import { Component, OnInit, ElementRef, ViewChild, TemplateRef } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { AutoCompleteDropDown } from '../../common-methods/models/autoComplete';

import { CommonService } from '../../common-methods/services/common.service';
import { AuthService } from '../../common-methods/services/auth.service';
import { MasterService } from '../../common-methods/services/master.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table'
@Component({
  standalone: false,
  selector: 'app-master-data-approval',
  templateUrl: './master-data-approval.component.html',
  styleUrls: ['./master-data-approval.component.css']
})
export class MasterDataApprovalComponent implements OnInit {
  itemperpage;
  routePath = 'Configure  / Master Data Approval';
  masterScreenList: any[] = [];
  masterApproval = new MasterApproval();
  dataListForApproval: any[] = [];
  masterDataFormGroup: UntypedFormGroup;
  masterdataLstControls!: AutoCompleteDropDown;
  // showGrid = false;
  totalpages: number;
  currentPage = 1;
  tempCurrentPage = 1;
  screenAuth: any = {};
  localUser: any;
  btnBack = false;
  rejectFlag = false;
  @ViewChild('invitetab') mdtab!: Table;
  @ViewChild('global', { static: true }) global!: ElementRef;
  frozenCols = [{ field: 'action', header: 'Action' }];
  masterScreencols = [
    { field: 'screenName', header: 'Screen Name' },
    { field: 'masterDataName', header: 'Master Data' }];
  constructor(private authService: AuthService, private masterService: MasterService,
    private messageService: MessageService, public common: CommonService, public dialog: MatDialog,
    private router: Router, ) { }

  ngOnInit() {
    this.screenAuth = this.authService.getScreenAuth(this.router.url);
    const userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.localUser = userData.userId;
    // this.showGrid = !this.showGrid;
    this.getMasterScreenList();
    this.itemperpage = 10;
  }
  getMasterScreenList() {
    this.masterService.getMasterScreenList().subscribe(res => {
      if (res) {
        this.masterScreenList = res;
        // console.log(this.masterScreenList, 'this.masterScreenList');
      }
    });
  }
  public openDialog(flag, data) {
    const popupData = {
      action: (flag === true ? this.common.APPROVE : this.common.DELETECONFIRMATION),
      headerText: 'Confirmation',
      bodyText: (flag === true ? 'Are you sure you want to approve this record?' : 'Are you sure you want to reject this record?')
    };
    const dialogRef = this.dialog.open(CommonAlertsComponent, {
      width: '320px',
      data: popupData,
      disableClose: true
    });
    if (dialogRef) {
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const action = String(result.type);
          if (action === (flag === true ? this.common.APPROVE : this.common.DELETECONFIRMATION)) {
            this.onApprovelClick(flag === true ? true : false, data);
          }
        }
      });
    }
  }
  onApprovelClick(approveFlag: boolean, rowData: MasterApproval) {
    this.masterApproval = new MasterApproval();
    if (rowData) {
      this.masterApproval = rowData;
      if (!approveFlag) {
        this.masterApproval.rejectFlag = true;
      } else {
        this.masterApproval.approveFlag = true;
      }
      this.masterService.approveRejectData(this.masterApproval).subscribe(res => {
        if (res.success) {
          this.closeForm();
          if (this.masterApproval.rejectFlag) {
            this.showTopCenter('warn', 'Success Message', 'Rejected Successfully');
          } else {
            this.showTopCenter('success', 'Success Message', 'Approved Successfully');
          }
        }
      });
    }
  }
  showTopCenter(level: string, info: string, message: string) {
    this.messageService.add({ severity: level, summary: info, detail: message });
  }
  closeForm() {
    // this.showGrid = !this.showGrid;
    // this.btnBack = !this.btnBack;
    this.getMasterScreenList();
  }
  getTotalPages(totalRecords, rows) {
    this.totalpages = Math.ceil((totalRecords) / rows);
    return Math.ceil((totalRecords) / rows);
  }
  navigateNxtPrevPage(pageNo, rows) {
    this.currentPage = pageNo / rows;
    this.tempCurrentPage = this.currentPage;
  }
  navigatePage(pageNo, rowscount) {
    if (+pageNo > this.totalpages || +pageNo <= 0) {
      this.currentPage = this.tempCurrentPage;
    } else {
      this.mdtab.onPageChange({ first: ((pageNo - 1) * rowscount), rows: rowscount });
      this.tempCurrentPage = this.currentPage;
    }
  }
  showall() {
    if (this.masterScreenList.length > 0) {
      this.itemperpage = this.masterScreenList.length;
    }
  }
}
export class MasterApproval {
  screenId: number;
  screenName: string;
  masterDataId: number;
  masterDataName: number;
  rejectFlag = false;
  approveFlag = false;
}
