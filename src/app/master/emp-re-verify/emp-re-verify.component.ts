import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
// import { DataTable, MessageService } from 'primeng/primeng';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { map, startWith } from 'rxjs/operators';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { DashboardCountVm } from '../../common-methods/models/login';
import { Table } from 'primeng/table';
// import { LazyLoadEvent } from 'primeng/api';
import { MessageService } from 'primeng/api';

@Component({
  standalone: false,
  selector: 'app-emp-re-verify',
  templateUrl: './emp-re-verify.component.html',
  styleUrls: ['./emp-re-verify.component.css']
})
export class EmpReVerifyComponent implements OnInit {
  itemperpage;
  displayedColumns = [
    { field: 'employerName', header: 'Employer Name' },
    { field: 'verificationId', header: 'Verification Id' },
    { field: 'refNo', header: 'Ref No' },
    { field: 'city', header: 'City' },
    { field: 'state', header: 'State' },
    { field: 'createdDate', header: 'Created Date' },
  ];
  totalpages: number;
  currentPage = 1;
  tempCurrentPage = 1;
   @ViewChild('dt', { static: false }) dt!: Table;
  @ViewChild('global', { static: true }) global!: ElementRef;
  oneYearEmployerList: any[] = [];
  selectedEmpList: any[] = [];
  userData: any;
  employerNameFormCtrl = new UntypedFormControl();
  employerNameFilteredOptions: Observable<string[]>;
  @ViewChild('employerNameTrigger', { static: true }) employerNameTrigger!: MatMenuTrigger;
  verificationIdFormCtrl = new UntypedFormControl();
  verificationIdFilteredOptions: Observable<string[]>;
  @ViewChild('verificationIdTrigger', { static: true }) 
verificationIdTrigger!: MatMenuTrigger;
  refNoFormCtrl = new UntypedFormControl();
  refNoFilteredOptions: Observable<string[]>;
  @ViewChild('refNoTrigger', { static: true }) refNoTrigger: MatMenuTrigger;
  cityFormCtrl = new UntypedFormControl();
  cityFilteredOptions: Observable<string[]>;
  @ViewChild('cityTrigger', { static: true }) cityTrigger: MatMenuTrigger;
  stateFormCtrl = new UntypedFormControl();
  stateFilteredOptions: Observable<string[]>;
  @ViewChild('stateTrigger', { static: true }) stateTrigger: MatMenuTrigger;
  dupList: any;
  fromDate = '';
  toDate = '';
  @ViewChild('createdDateTrigger', { static: true }) createdDateTrigger: MatMenuTrigger;
  LoginUseDetvm = new DashboardCountVm();

  constructor(public master: MasterService, public common: CommonService, private message: MessageService, private dateP: DatePipe) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.getOneYearEmployerDetails();
    this.itemperpage = 10;
  }
  getOneYearEmployerDetails() {
    this.LoginUseDetvm.applicationId = this.userData.applicationId;
    this.LoginUseDetvm.userId = this.userData.userId;
    this.LoginUseDetvm.deptId = this.userData.deptId;
    this.LoginUseDetvm.DeptName = this.userData.DeptName;
    this.LoginUseDetvm.teamName = this.userData.teamName;
    this.LoginUseDetvm.teamId = this.userData.teamId;
    this.LoginUseDetvm.subTeamId = this.userData.subTeamId;
    this.LoginUseDetvm.subTeamName = this.userData.subTeamName;
    this.LoginUseDetvm.clientId = this.userData.clientId;
    this.LoginUseDetvm.teamLeadFlag = this.userData.teamLeadFlag;
    this.LoginUseDetvm.subTeamLeadFlag = this.userData.subTeamLeadFlag;
    this.LoginUseDetvm.workFlowLookupId = this.userData.workFlowLookupId;
    this.LoginUseDetvm.siteId = this.userData.siteId;

    this.master.GetOneYearEmployerDetails(this.LoginUseDetvm).subscribe(res => {
      if (res) {
        this.oneYearEmployerList = res;
        this.dupList = this.common.CloneObject(res);
        this.resetTable();
      }
    });
  }
  getRecordBydate(fDate, tDate) {
    this.oneYearEmployerList = this.dupList;
    const FromDate = this.dateP.transform(fDate, 'yyyy-MM-dd');
    const ToDate = this.dateP.transform(tDate, 'yyyy-MM-dd');
    this.oneYearEmployerList.map(d => d.createdDate = this.dateP.transform(d.createdDate, 'yyyy-MM-dd'));
    this.oneYearEmployerList = this.dupList.filter(x => x.createdDate >= FromDate && x.createdDate <= ToDate);
  }
  resetDate() {
    this.fromDate = '';
    this.toDate = '';
    this.oneYearEmployerList = this.dupList;
  }
  private TblAutoFilters(): void {
    this.employerNameFilteredOptions = this.employerNameFormCtrl.valueChanges.pipe(startWith(''), map(value => (Array.from(new Set(this.oneYearEmployerList.map(x => x.employerName).filter(x => x))).sort())
      .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
    this.verificationIdFilteredOptions = this.verificationIdFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.oneYearEmployerList.map(x => x.verificationId).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
    this.refNoFilteredOptions = this.refNoFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.oneYearEmployerList.map(x => x.refNo).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
    this.cityFilteredOptions = this.cityFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.oneYearEmployerList.map(x => x.city).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
    this.stateFilteredOptions = this.stateFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.oneYearEmployerList.map(x => x.state).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
  }
  moveToFR(list: any) {
    if (list.length > 0) {
      list = list.map(x => x = x.employerId);
      this.master.MoveToForResearch({ employerId: list, loggedIn: this.userData.userId }).subscribe(resp => {
        if (resp) {
          this.showTopCenter('success', 'Success Message', 'Moved to For Research Successfully');
          this.getOneYearEmployerDetails();
        }
      });
    } else {
      this.showTopCenter('warn', 'Warning Message', 'Plese select atleast one case');
    }
  }
  resetTable() {
    this.global.nativeElement.value = '';
    this.employerNameFormCtrl.setValue('');
    this.refNoFormCtrl.setValue('');
    this.verificationIdFormCtrl.setValue('');
    this.cityFormCtrl.setValue('');
    this.stateFormCtrl.setValue('');
    this.resetDate();
    this.currentPage = 1;
    this.dt.reset();
    this.TblAutoFilters();
  }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
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
      this.dt.onPageChange({ first: ((pageNo - 1) * rowscount), rows: rowscount });
      this.tempCurrentPage = this.currentPage;
    }
  }
  showall() {
    if (this.oneYearEmployerList.length > 0) {
      this.itemperpage = this.oneYearEmployerList.length;
    }
  }
}
