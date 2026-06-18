// // import { Component, OnInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
// // import { MasterService } from 'src/app/common-methods/services/master.service';
// // import { Site } from 'src/app/common-methods/models/site';
// // import { AuthService } from 'src/app/common-methods/services/auth.service';
// // import { Router } from '@angular/router';
// // import { MatDialog } from '@angular/material/dialog';
// // import { MatMenuTrigger } from '@angular/material/menu';
// // import { CommonService } from 'src/app/common-methods/services/common.service';
// // import { SharedService } from 'src/app/common-methods/services/shared.service';
// // import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';
// // // import { DataTable, InputText, MessageService } from 'primeng/primeng';
// // import { Table, TableModule } from 'primeng/table';
// // import { InputTextModule } from 'primeng/inputtext';
// // import { ToastModule } from 'primeng/toast';

// // import { Observable } from 'rxjs';
// // import { UntypedFormControl } from '@angular/forms';
// // import { startWith, map } from 'rxjs/operators';
// // import { AccessClient } from 'src/app/common-methods/models/clientEntryMaster';
// // // import { MessageService } from 'primeng/api/messageservice';
// // import { MessageService } from 'primeng/api';

// import { Component, OnInit, ViewChild, OnDestroy, ElementRef, TemplateRef } from '@angular/core';
// import { MasterService } from 'src/app/common-methods/services/master.service';
// import { Site } from 'src/app/common-methods/models/site';
// import { AuthService } from 'src/app/common-methods/services/auth.service';
// import { Router } from '@angular/router';
// import { MatDialog } from '@angular/material/dialog';
// import { MatMenuTrigger } from '@angular/material/menu';
// import { CommonService } from 'src/app/common-methods/services/common.service';
// import { SharedService } from 'src/app/common-methods/services/shared.service';
// import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';

// import { Table, TableModule } from 'primeng/table';
// import { InputTextModule } from 'primeng/inputtext';
// import { ToastModule } from 'primeng/toast';
// import { MessageService } from 'primeng/api';

// import { Observable } from 'rxjs';
// import { UntypedFormControl } from '@angular/forms';
// import { startWith, map } from 'rxjs/operators';
// import { AccessClient } from 'src/app/common-methods/models/clientEntryMaster';

// @Component({
//   selector: 'app-site-list',
//   templateUrl: './site-list.component.html',
//   styleUrls: ['./site-list.component.css']
// })
// export class SiteListComponent implements OnInit {
//   itemperpage;
//   site: Site = new Site();
//   pathParameters: string[];
//   userdata: any;
//   routePath = 'Client / Site Creation';
//   sitelist: any[] = [];
//   frozenCols = [
//     { field: 'action', header: 'Action' }];
//   sitecols = [
//     { field: 'siteName', header: 'Site Name' },
//     { field: 'clientName', header: 'Client Name	' },
//     { field: 'siteNo', header: 'Site No' },
//     { field: 'contactPerson', header: 'Billing Person Name' },
//     { field: 'active', header: 'Active' }
//     // { field: 'actions', header: 'Actions' }
//   ];
//   dialogRef: any;
//   message: string;
//   siteNo: string;
//   cancelledBy: number;
//   btnAdd = true;
//   btnResetTbl = true;

//   totalpages: number;
 
//   @ViewChild('global') global!: ElementRef;

// @ViewChild('sitetab') sitetab!: Table;

// @ViewChild('siteNoCtrlTrigger') siteNoCtrlTrigger!: MatMenuTrigger;
// @ViewChild('siteNameCtrlTrigger') siteNameCtrlTrigger!: MatMenuTrigger;
// @ViewChild('contactPersonCtrlTrigger') contactPersonCtrlTrigger!: MatMenuTrigger;
// @ViewChild('clientNameCtrlTrigger') clientNameCtrlTrigger!: MatMenuTrigger;

//   currentPage = 1;
//   tempCurrentPage = 1;
//   siteNoFilteredOptions: Observable<string[]>;
//   siteNoControl = new UntypedFormControl();

//   siteNameFilteredOptions: Observable<string[]>;
//   siteNameControl = new UntypedFormControl();

//   contactPersonFilteredOptions: Observable<string[]>;
//   contactPersonControl = new UntypedFormControl();

//   clientNameFilteredOptions: Observable<string[]>;
//   clientNameControl = new UntypedFormControl();
//   screenAuth: any = {};

//   constructor(public master: MasterService, public auth: AuthService, private authService: AuthService,
//     public router: Router, public dialog: MatDialog,
//     private common: CommonService, private saharedService: SharedService, private messageService: MessageService) { }

//   ngOnInit() {
//     this.screenAuth = this.authService.getScreenAuth(this.router.url);
//     this.userdata = JSON.parse(sessionStorage.getItem('user_data') as string);
//     this.getSiteList();
//     this.itemperpage = 10;
//   }
//   getSiteList() {
//     const accessClient: AccessClient = {
//       loggedIn: this.userdata.userId,
//       clientId: this.userdata.clientId
//     };
//     this.master.GetSiteList(accessClient).subscribe(resp => {
//       if(resp: any) {
//         this.sitelist = resp;
//         this.currentPage = 1;
//         this.userTblAutoFilters();
//       }
//     });
//   }
//   addNewSite() {
//     this.auth.siteId = 0;
//     this.router.navigate(['/dashboard/client/siteentry']);
//   }
//   editSitedetails(data: any) {
//     if (data) {
//       this.auth.siteId = data;
//       this.router.navigate(['/dashboard/client/siteentry']);
//     }
//   }
//   public openDialog(data: any) {
//     const popupData = {
//       action: this.common.DELETECONFIRMATION,
//       headerText: 'Confirmation',
//       bodyText: 'Are you sure you want to delete this record?'
//     };
//     const dialogRef = this.dialog.open(CommonAlertsComponent, {
//       width: '320px',
//       data: popupData,
//       disableClose: true
//     });
//     if (dialogRef) {
//       dialogRef.afterClosed().subscribe(result => {
//         if (result) {
//           const action = String(result.type);
//           if (action === this.common.DELETECONFIRMATION) {
//             this.deleteSite(data);
//           }
//         }
//       });
//     }
//   }
//   deleteSite(data: any) {
//     const createdUserId = this.userdata.userId;
//     this.master.deleteSite(data.siteId, createdUserId).subscribe(resp => {
//       if (resp) {
//         this.showTopCenter('warn', 'Success Message', 'Deleted Successfully');
//         this.getSiteList();
//       }
//     });
//   }
//   showTopCenter(level: string, info: string, message: string) {
//     this.messageService.add({ severity: level, summary: info, detail: message });
//   }

//   getTotalPages(totalRecords, rows) {
//     this.totalpages = Math.ceil((totalRecords) / rows);
//     return Math.ceil((totalRecords) / rows);
//   }
//   navigateNxtPrevPage(pageNo, rows) {
//     this.currentPage = pageNo / rows;
//     this.tempCurrentPage = this.currentPage;
//   }
//   navigatePage(pageNo, rowscount) {
//     if (+pageNo > this.totalpages || +pageNo <= 0) {
//       this.currentPage = this.tempCurrentPage;
//     } else {
//       this.sitetab.onPageChange({ first: ((pageNo - 1) * rowscount), rows: rowscount });
//       this.tempCurrentPage = this.currentPage;
//     }
//   }
//   private userTblAutoFilters(): void {
//     this.siteNoFilteredOptions = this.siteNoControl.valueChanges.pipe(startWith(''),
//       map(value =>
//         (Array.from(new Set(this.sitelist.map(x => x.siteNo).filter(x => x))).sort())
//           .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

//     this.siteNameFilteredOptions = this.siteNameControl.valueChanges.pipe(startWith(''),
//       map(value =>
//         (Array.from(new Set(this.sitelist.map(x => x.siteName).filter(x => x))).sort())
//           .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

//     this.clientNameFilteredOptions = this.clientNameControl.valueChanges.pipe(startWith(''),
//       map(value =>
//         (Array.from(new Set(this.sitelist.map(x => x.clientName).filter(x => x))).sort())
//           .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

//     this.contactPersonFilteredOptions = this.contactPersonControl.valueChanges.pipe(startWith(''),
//       map(value =>
//         (Array.from(new Set(this.sitelist.map(x => x.contactPerson).filter(x => x))).sort())
//           .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

//   }

//   closeMenu(col: any) {
//     switch (col) {
//       case 'siteName': this.siteNameCtrlTrigger.closeMenu(); break;
//       case 'siteNo': this.siteNoCtrlTrigger.closeMenu(); break;
//       case 'clientName': this.clientNameCtrlTrigger.closeMenu(); break;
//       case 'contactPerson': this.contactPersonCtrlTrigger.closeMenu(); break;
//       default: break;
//     }
//   }
//   tblReset() {
//     this.sitetab.reset();
//     this.siteNoControl.reset();
//     this.siteNameControl.reset();
//     this.clientNameControl.reset();
//     this.contactPersonControl.reset();
//     this.global.nativeElement.value = '';
//   }
//   showall() {
//     if (this.sitelist.length > 0) {
//       this.itemperpage = this.sitelist.length;
//     }
//   }
// }


import { Component, OnInit, ViewChild, OnDestroy, ElementRef, TemplateRef } from '@angular/core';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { Site } from 'src/app/common-methods/models/site';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { SharedService } from 'src/app/common-methods/services/shared.service';
import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';

import { Table } from 'primeng/table';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { Observable } from 'rxjs';
import { UntypedFormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { AccessClient } from 'src/app/common-methods/models/clientEntryMaster';

@Component({
  standalone: false,
  selector: 'app-site-list',
  templateUrl: './site-list.component.html',
  styleUrls: ['./site-list.component.css']
})
export class SiteListComponent implements OnInit {

  itemperpage: any;
  site: Site = new Site();
  pathParameters:any;
  userdata: any;
  routePath = 'Client / Site Creation';

  sitelist: any[] = [];
  frozenCols = [{ field: 'action', header: 'Action' }];
  sitecols = [
    { field: 'siteName', header: 'Site Name' },
    { field: 'clientName', header: 'Client Name' },
    { field: 'siteNo', header: 'Site No' },
    { field: 'contactPerson', header: 'Billing Person Name' },
    { field: 'active', header: 'Active' }
  ];

  dialogRef: any;
  message: string | undefined;
  siteNo: string | undefined;
  cancelledBy: number | undefined;

  btnAdd = true;
  btnResetTbl = true;

  totalpages: any;

  @ViewChild('global') global!: ElementRef;

  @ViewChild('sitetab') sitetab!: Table;

  @ViewChild('siteNoCtrlTrigger') siteNoCtrlTrigger!: MatMenuTrigger;
  @ViewChild('siteNameCtrlTrigger') siteNameCtrlTrigger!: MatMenuTrigger;
  @ViewChild('contactPersonCtrlTrigger') contactPersonCtrlTrigger!: MatMenuTrigger;
  @ViewChild('clientNameCtrlTrigger') clientNameCtrlTrigger!: MatMenuTrigger;

  currentPage = 1;
  tempCurrentPage = 1;

  siteNoFilteredOptions!: Observable<string[]>;
  siteNoControl = new UntypedFormControl();

  siteNameFilteredOptions!: Observable<string[]>;
  siteNameControl = new UntypedFormControl();

  contactPersonFilteredOptions!: Observable<string[]>;
  contactPersonControl = new UntypedFormControl();

  clientNameFilteredOptions!: Observable<string[]>;
  clientNameControl = new UntypedFormControl();

  screenAuth: any = {};

  constructor(
    public master: MasterService,
    public auth: AuthService,
    private authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    private common: CommonService,
    private saharedService: SharedService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.screenAuth = this.authService.getScreenAuth(this.router.url);
this.userdata = JSON.parse(sessionStorage.getItem('user_data') || '{}');
    this.getSiteList();
    this.itemperpage = 10;
  }

  getSiteList() {
    const accessClient: AccessClient = {
      loggedIn: this.userdata.userId,
      clientId: this.userdata.clientId
    };

    this.master.GetSiteList(accessClient).subscribe(resp => {
      if (resp) {
        this.sitelist = resp;
        this.currentPage = 1;
        this.userTblAutoFilters();
      }
    });
  }

  addNewSite() {
    this.auth.siteId = 0;
    this.router.navigate(['/dashboard/client/siteentry']);
  }

  editSitedetails(data: any) {
    if (data) {
      this.auth.siteId = data;
      this.router.navigate(['/dashboard/client/siteentry']);
    }
  }

  public openDialog(data: any) {
    const popupData = {
      action: this.common.DELETECONFIRMATION,
      headerText: 'Confirmation',
      bodyText: 'Are you sure you want to delete this record?'
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
          if (action === this.common.DELETECONFIRMATION) {
            this.deleteSite(data);
          }
        }
      });
    }
  }

  deleteSite(data: any) {
    const createdUserId = this.userdata.userId;

    this.master.deleteSite(data.siteId, createdUserId).subscribe(resp => {
      if (resp) {
        this.showTopCenter('warn', 'Success Message', 'Deleted Successfully');
        this.getSiteList();
      }
    });
  }

  showTopCenter(level: string, info: string, message: string) {
    this.messageService.add({ severity: level, summary: info, detail: message });
  }

  getTotalPages(totalRecords: number, rows: number) {
    this.totalpages = Math.ceil(totalRecords / rows);
    return this.totalpages;
  }

  navigateNxtPrevPage(pageNo: number, rows: number) {
    this.currentPage = pageNo / rows;
    this.tempCurrentPage = this.currentPage;
  }

  navigatePage(pageNo: number, rowscount: number) {
    if (+pageNo > this.totalpages || +pageNo <= 0) {
      this.currentPage = this.tempCurrentPage;
    } else {
      this.sitetab.onPageChange({ first: ((pageNo - 1) * rowscount), rows: rowscount });
      this.tempCurrentPage = this.currentPage;
    }
  }

  /* ================= AUTO FILTERS ================= */
  private userTblAutoFilters(): void {

    this.siteNoFilteredOptions = this.siteNoControl.valueChanges.pipe(
      startWith(''),
      map(value =>
        (Array.from(new Set(this.sitelist.map(x => x.siteNo).filter(x => x))).sort())
          .filter(option => option.toLowerCase().includes(value))
      )
    );

    this.siteNameFilteredOptions = this.siteNameControl.valueChanges.pipe(
      startWith(''),
      map(value =>
        (Array.from(new Set(this.sitelist.map(x => x.siteName).filter(x => x))).sort())
          .filter(option => option.toLowerCase().includes(value))
      )
    );

    this.clientNameFilteredOptions = this.clientNameControl.valueChanges.pipe(
      startWith(''),
      map(value =>
        (Array.from(new Set(this.sitelist.map(x => x.clientName).filter(x => x))).sort())
          .filter(option => option.toLowerCase().includes(value))
      )
    );

    this.contactPersonFilteredOptions = this.contactPersonControl.valueChanges.pipe(
      startWith(''),
      map(value =>
        (Array.from(new Set(this.sitelist.map(x => x.contactPerson).filter(x => x))).sort())
          .filter(option => option.toLowerCase().includes(value))
      )
    );
  }

  closeMenu(col: string) {
    switch (col) {
      case 'siteName': this.siteNameCtrlTrigger.closeMenu(); break;
      case 'siteNo': this.siteNoCtrlTrigger.closeMenu(); break;
      case 'clientName': this.clientNameCtrlTrigger.closeMenu(); break;
      case 'contactPerson': this.contactPersonCtrlTrigger.closeMenu(); break;
      default: break;
    }
  }

  tblReset() {
    this.sitetab.reset();
    this.siteNoControl.reset();
    this.siteNameControl.reset();
    this.clientNameControl.reset();
    this.contactPersonControl.reset();
    this.global.nativeElement.value = '';
  }

  showall() {
    if (this.sitelist.length > 0) {
      this.itemperpage = this.sitelist.length;
    }
  }
}
