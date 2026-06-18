import { Component, OnInit, Output, EventEmitter, Input, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
import { CommonService } from '../services/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/common-methods/services/shared.service';
@Component({
  standalone: false,
  selector: 'app-common-alerts',
  templateUrl: './common-alerts.component.html',
  styleUrls: ['./common-alerts.component.css']
})
export class CommonAlertsComponent implements OnInit {
  @Output() ok = new EventEmitter();
  headerText: string;
  bodyText: string;
  popupData: any;
  action: string;
  actionbulk: string;
  btnstay= true;
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<CommonAlertsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public authService: AuthService, public commonservice: CommonService,private router:Router,private sharedService:SharedService) {
    this.headerText = data.headerText;
    this.bodyText = data.bodyText;
    this.action = data.action;
    this.actionbulk = data.action;
    this.commonservice.removebutton.subscribe((res: any) => {
      if(res){
        this.btnstay = res === 'Show' ? true : false;
      }
    })
  }

  ngOnInit() {
  }
  stay() {
    this.dialogRef.close({
      type: this.commonservice.SESSIONSTAYTIME,
    });
  }
  closeAll() {
    this.dialogRef.close({
      type: this.commonservice.SESSIONOUT,
    });
    this.logout()
  }
  stayCan() {
    this.dialogRef.close({
      type: this.commonservice.CANDIDATECONFIRM,
    });
  }
  closeAllCan() {
    this.dialogRef.close({
      type: this.commonservice.CANDIDATECONFIRMNO,
    });
  }
  delete(action) {
    this.dialogRef.close({
      type: action === this.commonservice.DELETECONFIRMATION ? this.commonservice.DELETECONFIRMATION : this.commonservice.APPROVE,
    });
  }
  navigate() {
    this.dialogRef.close({
      type: this.commonservice.OPEN_NAVIGATE,
    });
  }
  openCancellation() {
    this.dialogRef.close({
      type: this.commonservice.OPEN_ANOTHER,
    });
    
  }

  logout(){
    const home = JSON.parse(sessionStorage.getItem('user_data'));
    this.authService.LogOut(home.userId, home.logId).subscribe(res => {
      if (res.success) {
        this.dialog.closeAll();
        sessionStorage.removeItem('user_data');
        sessionStorage.clear();
        this.router.navigate(['/']);
        this.commonservice.insuffCountFlag = false;
        this.commonservice.caseFlag = false;
        this.commonservice.VeCountFlag = false;
        this.commonservice.qcCountFlag = false;
        this.sharedService.clientApprovalUrl = '';
        // this.notificationService.notificationCount = 0;
      }
    }, err => { }, () => { });
    }
}
