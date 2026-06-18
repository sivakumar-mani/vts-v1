import { Component, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { VerificationService } from '../../services/verification.service';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
// kendo start
import { PageChangeEvent } from '@progress/kendo-angular-grid';
// end
@Component({
  standalone: false,
  selector: 'app-client-cases',
  templateUrl: './client-cases.component.html',
  styleUrls: ['./client-cases.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ClientCasesComponent implements OnInit {
  dataSource = new MatTableDataSource([]);
  columnsToDisplay = [
  'candidateName',
  'siteName',
  'clientRefNo',
  'applicantId',
  'caseStatus',
  'priority',
  'packageName',
  'requestDate',
  'requestorName',
];
  expandedElement: any | null;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  userData: any;
  verificationDet: any[] = [];
  userList: { userId: any; userName: string }[] = [];
selectedUsers: string[] = [];
private fullDataSet: any[] = [];
searchText: string = '';
selectedUserIds: any[] = [];
isSubmittedCase: boolean = false;

  // kendo start
  // data: any;
  // public skip = 0;
  // itemPerPage;
  // searchText: any;
  // end
  constructor(public verification: VerificationService, public router: Router, public common: CommonService) { }
  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.isSubmittedCase = this.userData.submittedCaseDetFlag === true;
       
    
    if (this.verification.commonCasesFlag === true) {
      this.getCaseList(true);
    } 
    else if (this.verification.commonCasesFlag === false && this.isSubmittedCase  === true) {
      this.getSubmittedCaseList();
    }
    else if (this.verification.commonCasesFlag === false) {
      this.getCaseList(false);
    } else {
      this.getList(this.verification.casePriorityLookupId);
    }
this.userData.submittedCaseDetFlag = false;
  sessionStorage.setItem('user_data', JSON.stringify(this.userData));

  }
  // kendo start
  // showOnlyBeveragesDetails(dataItem: any, index: number): boolean {
  //   return dataItem.verificationDet.screeningCompId === 1;
  // }
  // public onFilter(inputValue: string): void {
  //   const list: any[] = [];
  //    this.columnsToDisplay.forEach(element => {
  //     list.push({ field: element, operator: 'contains', value: inputValue });
  //   });
  //   this.data = process(this.data, { filter: { logic: 'or', filters: list } }).data;
  //  this.data = this.data;
  // }
  // showall() {
  //   if (this.data.length > 0) {
  //     this.itemPerPage = this.data.length;
  //     this.loadReport();
  //   }
  // }
  // pageChange({ skip, take }: PageChangeEvent): void {
  //   this.skip = skip;
  //   this.itemPerPage = take;
  //   this.loadReport();
  // }
  // private loadReport(): void {
  //   this.data = {
  //     data: this.data.slice(this.skip, this.skip + this.itemPerPage),
  //     total: this.data.length
  //   };
  // }
  // end
  getList(id: any) {
    // const verificationFilter = new VerificationDetFilterVm();
    this.userData.filters = id > 0 ? 'casePriorityLookupId==' + id : '';
    // verificationFilter.loginUserDetVm = this.userData;
    // verificationFilter.FilterVm = new FilterVm();
    this.verification.getVerificationSearchDetails(this.userData).subscribe(resp => {
      if (resp) {
        resp.clientVerificationDet.forEach(element => {
          element.candidateName = element.candidateFirstName ? (element.candidateFirstName + (element.candidateMiddleName ?
            (' ' + element.candidateMiddleName) : '') + (element.candidateLastName ? (' ' + element.candidateLastName) : '')) : 'N/A';
          element.requestorName     = element.createdUserName || 'N/A';
          element.priority          = element.priority || '';
          element.packageName       = element.packageName || '';
          element.packageComponent  = element.packageComponent || '';
        });
        // kendo start
        // this.data = resp.clientVerificationDet;
        // end
 this.fullDataSet = resp.clientVerificationDet;

      // Step 4: Build unique userList
      const seen = new Set<number>();
      this.userList = [];
      this.fullDataSet.forEach(element => {
        if (element.createdUserId && !seen.has(element.createdUserId)) {
          seen.add(element.createdUserId);
          this.userList.push({
            userId: element.createdUserId,
            userName: element.createdUserName
          });
        }
      });
      this.userList.sort((a, b) => a.userName.localeCompare(b.userName));

      // Step 5: Reset & bind
      this.selectedUserIds = [];

        
        this.dataSource = new MatTableDataSource(resp.clientVerificationDet);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }



  getSubmittedCaseList() {
    this.verification.GetCaseDetailsClient(this.userData).subscribe(resp => {
      if (resp) {
        resp.clientVerificationDet.forEach(element => {
          element.candidateName = element.candidateFirstName ? (element.candidateFirstName + (element.candidateMiddleName ?
            (' ' + element.candidateMiddleName) : '') + (element.candidateLastName ? (' ' + element.candidateLastName) : '')) : 'N/A';
          element.requestorName     = element.createdUserName || 'N/A';
          element.priority          = element.priority || '';
          element.packageName       = element.packageName || '';
          element.packageComponent  = element.packageComponent || '';
          });
          this.fullDataSet = resp.clientVerificationDet;

      // Step 4: Build unique userList
      const seen = new Set<number>();
      this.userList = [];
      this.fullDataSet.forEach(element => {
        if (element.createdUserId && !seen.has(element.createdUserId)) {
          seen.add(element.createdUserId);
          this.userList.push({
            userId: element.createdUserId,
            userName: element.createdUserName
          });
        }
      });
      this.userList.sort((a, b) => a.userName.localeCompare(b.userName));

      // Step 5: Reset & bind
      this.selectedUserIds = [];

        this.dataSource = new MatTableDataSource(resp.clientVerificationDet);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

getCaseList(flag) {
  this.verification.GetCaseDetailsClient(this.userData).subscribe(resp => {
    if (resp) {

      // Step 1: Filter by status
      resp.clientVerificationDet = flag === true
        ? resp.clientVerificationDet.filter(x => !(x.caseStatus && x.caseStatus.toLowerCase() === 'completed'))
        : resp.clientVerificationDet.filter(x => x.caseStatus && x.caseStatus.toLowerCase() === 'completed');

      // Step 2: Build candidateName
      resp.clientVerificationDet.forEach(element => {
        element.candidateName = element.candidateFirstName
          ? (element.candidateFirstName +
            (element.candidateMiddleName ? (' ' + element.candidateMiddleName) : '') +
            (element.candidateLastName  ? (' ' + element.candidateLastName)  : ''))
          : 'N/A';
          element.requestorName     = element.createdUserName || 'N/A';
          element.priority          = element.priority || '';
          element.packageName       = element.packageName || '';
          element.packageComponent  = element.packageComponent || '';
      });

      // Step 3: Store full data
      this.fullDataSet = resp.clientVerificationDet;

      // Step 4: Build unique userList
      const seen = new Set<number>();
      this.userList = [];
      this.fullDataSet.forEach(element => {
        if (element.createdUserId && !seen.has(element.createdUserId)) {
          seen.add(element.createdUserId);
          this.userList.push({
            userId: element.createdUserId,
            userName: element.createdUserName
          });
        }
      });
      this.userList.sort((a, b) => a.userName.localeCompare(b.userName));

      // Step 5: Reset & bind
      this.selectedUserIds = [];
      this.dataSource = new MatTableDataSource(this.fullDataSet);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  });
}
  ngOnDestroy() {
    this.verification.casePriorityLookupId = undefined;
    //this.verification.commonCasesFlag = undefined;
  }
  loadVerificationDetails(element: any) {
    console.log(element);
    this.verification.getVerificationCompDetails(element.clientRefNo).subscribe(resp => {
      if (resp) {
        this.verificationDet = resp;
      }
    });
    // this.http.get(apiUrl).subscribe((response) => { 
    //   // Handle the API response here console.log('API Response:', response);
    //    this.verificationDetails = response; // Store the API response }); 
    //   }
  }
  selectVerification(screeningCompId, functionalEntity): void {
    this.verification.changeMessage(screeningCompId);
    this.common.funcEntity = functionalEntity;
    this.verification.searchArray = this.verification.casePriorityLookupId;
    this.router.navigate(['/dashboard/verification/verificationDetail']);
  }
  applyFilter(event: Event) {
    this.searchText = (event.target as HTMLInputElement).value;
    this.applyUserFilter();
  }
  getHeader(col: any) {
    return col.split(/(?=[A-Z])/).join(' ').toUpperCase();
  }



// Check if a user is selected
isUserSelected(user: string): boolean {
  return this.selectedUsers.includes(user);
}

// Clear all selected users
clearUserFilter() {
  this.selectedUsers = [];
  this.applyUserFilter();
}


toggleSelectAll() {
  setTimeout(() => {
    const allIds = this.userList.map(u => u.userId);
    const allAlreadySelected = allIds.every(id => this.selectedUsers.includes(id));

    if (allAlreadySelected) {
      this.selectedUsers = [];
    } else {
      this.selectedUsers = ['all', ...allIds];
    }
    this.applyUserFilter();
  });
}
applyUserFilter() {
  if (!this.fullDataSet || this.fullDataSet.length === 0) return;

  const allUserIds = this.userList.map(u => u.userId);
  const allSelected = allUserIds.length > 0 &&
                      allUserIds.every(id => this.selectedUsers.includes(id));

  // Sync 'all' checkbox
  if (allSelected && !this.selectedUsers.includes('all')) {
    this.selectedUsers = ['all', ...this.selectedUsers];
  }
  if (!allSelected) {
    this.selectedUsers = this.selectedUsers.filter(u => u !== 'all');
  }

  let filtered = this.fullDataSet;
  const selectedUserIds = this.selectedUsers
    .filter(u => u !== 'all')
    .map(u => Number(u)); // ← fix type mismatch

  if (selectedUserIds.length > 0) {
    filtered = filtered.filter(x => selectedUserIds.includes(x.createdUserId));
  }

  if (this.searchText && this.searchText.trim() !== '') {
    const search = this.searchText.trim().toLowerCase();
    filtered = filtered.filter(x =>
      (x.candidateName && x.candidateName.toLowerCase().includes(search)) ||
      (x.siteName && x.siteName.toLowerCase().includes(search))        ||
      (x.clientRefNo   && x.clientRefNo.toLowerCase().includes(search))
    );
  }

  this.dataSource = new MatTableDataSource(filtered);
  this.dataSource.paginator = this.paginator;
  if (this.paginator) this.paginator.firstPage();
  this.dataSource.sort = this.sort;
}
isAllSelected(): boolean {
  return this.userList.length > 0 &&
    this.userList.every(u => this.selectedUsers.includes(u.userId));
}
getPriorityDisplay(priority: string): string {
  if (!priority) return 'N/A';
  const p = priority.toLowerCase().trim();
  if (p === 'normal case') return 'Standard';
  if (p === 'rush case') return 'High';
  return priority;
}
getPackageComponents(packageComponent: any): string[] {
  if (!packageComponent) return [];
  if (Array.isArray(packageComponent)) return packageComponent.map(c => String(c).trim()).filter(c => c);
  return String(packageComponent).split(',').map(c => c.trim()).filter(c => c);
}
}