import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { VerificationService } from 'src/app/common-methods/services/verification.service';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { DatePipe } from '@angular/common';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { AuthService } from 'src/app/common-methods/services/auth.service';

@Component({
  standalone: false,
  selector: 'app-emp-closed-cases',
  templateUrl: './emp-closed-cases.component.html',
  styleUrls: ['./emp-closed-cases.component.css']
})
export class EmpClosedCasesComponent implements OnInit {
  viewList: PreviousClosedVm;
  cloneList: PreviousClosedVm;
  dialogRef: any;
  empEduName: any;
  empInsName: any;
  @ViewChild('view', { static: true }) view!: any;
  @Input() screeningCompId: any;
  @Input() empInsId: any;
  @Input() empEduFlag: any;
  @Input() clientCatID: any;
  @Input() name: any;
  @Input() isQc = false;
  isDesc: boolean;
  column: any;
  direction: number;
  itemPerPage;
  page = 1;
  searchText: any;
  searchValue1: string ;
  searchValue2: string ;
  userData: any;
  constructor(public verificationService: VerificationService, public dialog: MatDialog, private message: MessageService,
    public commonService: CommonService, public datePipe: DatePipe, public screen: ScreeningService,
    public authService: AuthService) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.itemPerPage = 5;
  }
  GetPreviousClosedcases(flag:any) {
    this.empEduName = this.empEduFlag ? "Employer Closed Color Code List" : "Education Closed Color Code List"
    this.empInsName = this.empEduFlag ? "Employer Name:" : "Institution Name:"
    this.verificationService.GetPreviousClosedcases(this.empInsId, this.empEduFlag, this.clientCatID).subscribe(resp => {
      this.viewList = resp;
      this.cloneList = this.commonService.CloneObject(this.viewList);
      if (!flag) {
        if (this.viewList.getPreviousClosedcasesVm && this.viewList.getPreviousClosedcasesVm.length > 0) {
          this.searchText = '';
          this.dialogRef = this.dialog.open(this.view, {
            width: '1093px',
            disableClose: true
          });
        } else {
          this.showTopCenter('warn', 'Failure Message', 'No closed cases found for this employer.');
        }
      }
    });
  }
  downloadDoc(data: any) {
    this.screen.downloadScreeningDocument(data).subscribe(resp => {
      this.commonService.downloadDocument(data, resp.document, resp.fileName);
    });
  }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }
  sortBy(type: any) {
    this.isDesc = !this.isDesc;
    this.column = type;
    this.direction = this.isDesc ? 1 : -1;
  }
  getPage(event: any) {
    this.page = event;
  }
  getTotalPage(): number {
    if (this.viewList.getPreviousClosedcasesVm.length) {
      return Math.ceil(this.viewList.getPreviousClosedcasesVm.length / this.itemPerPage);
    }
  }
  showall(){
    if(this.viewList.getPreviousClosedcasesVm.length > 0)
    {
      this.itemPerPage =  this.viewList.getPreviousClosedcasesVm.length;
    }
  }
  preventInfinite() {
    if (!this.itemPerPage) {
      this.itemPerPage = 1;
    }
  }
  getSearchList(value: any) {
    if (value) {
      this.viewList.getPreviousClosedcasesVm = Object.assign([], this.cloneList.getPreviousClosedcasesVm).filter(
        item => ((item.candidateName.toLowerCase().indexOf(value.toLowerCase()) > -1) ||
          (item.clientName.toLowerCase().indexOf(value.toLowerCase()) > -1) ||
          (item.colorCode.toLowerCase().indexOf(value.toLowerCase()) > -1) ||
          (item.caseOwner.toLowerCase().indexOf(value.toLowerCase()) > -1) ||
          (item.componentStatus.toLowerCase().indexOf(value.toLowerCase()) > -1) ||
          (item.screeningCompId.toLowerCase().indexOf(value.toLowerCase()) > -1) ||
          (item.annexure.some(x => x.fileName.toLowerCase().includes(value.toLowerCase()))) ||
          (this.datePipe.transform(item.closedDate, 'dd/MM/yyyy').indexOf(value.toLowerCase()) > -1) ||
          (item.clientRefNo.toLowerCase().indexOf(value.toLowerCase()) > -1)));
    }
  }
  getSearchLists(value1,value2){
    if ((value1 !== undefined && value1 !== "") && (value2 !== undefined && value2 !== "")) {
      this.viewList.getPreviousClosedcasesVm = Object.assign([], this.cloneList.getPreviousClosedcasesVm).filter(
        item => (
          (value1 !== undefined ? (item.colorCode.toString().toLowerCase().replace(/\s+/g, '').indexOf(value1.toString().toLowerCase().replace(/\s+/g, '')) > -1) : null) &&
          (value2 !== undefined ? (item.componentStatus.toString().toLowerCase().replace(/\s+/g, '').indexOf(value2.toString().toLowerCase().replace(/\s+/g, '')) > -1) : null)
        ));
    }
    else if((value1 !== undefined && value1 !== "") || (value2 !== undefined && value2 !== "")){
      this.viewList.getPreviousClosedcasesVm = Object.assign([], this.cloneList.getPreviousClosedcasesVm).filter(
        item => (
          ((value1 !== undefined && value1 !== "" ) ? (item.colorCode.toString().toLowerCase().replace(/\s+/g, '').indexOf(value1.toString().toLowerCase().replace(/\s+/g, '')) > -1) : null) ||
          ((value2 !== undefined && value2 !== "" ) ? (item.componentStatus.toString().toLowerCase().replace(/\s+/g, '').indexOf(value2.toString().toLowerCase().replace(/\s+/g, '')) > -1) : null)
        ));
    }
    else{
      this.showTopCenter('warn', 'Failure Message', 'Choose filter values to search.');
    }
  }
  reset(){
    this.searchValue1 ='';
    this.searchValue2 ='';
    this.GetPreviousClosedcases(true);
  }
  closeall(){
    this.searchValue1 ='';
    this.searchValue2 ='';
    this.dialogRef.close()
    this.itemPerPage = 5;
  }
}
export class PreviousClosedVm {
  getPreviousClosedcasesVm: any[] = [];
  redCount: number;
  greenCount: number;
  ambarCount: number;
  others: number;
}
