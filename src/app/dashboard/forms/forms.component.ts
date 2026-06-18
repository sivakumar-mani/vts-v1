import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, Input, OnDestroy, Optional, Self } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, ControlValueAccessor, NgControl, UntypedFormControl } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
// import { MatDialog, MatMenuTrigger, MatSnackBar } from '@angular/material/dialog';
import { CommonDialogComponent } from './common-dialog/common-dialog.component';
import { MessageService } from 'primeng/api';

import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { RouterModule, Routes, Router } from '@angular/router';
import { Position } from 'ngx-perfect-scrollbar';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { MatCheckboxModule } from "@angular/material/checkbox";
// import { FocusMonitor } from '@angular/cdk/a11y';
// import { coerceBooleanProperty } from '@angular/cdk/coercion';
// import { MatFormFieldControl } from '@angular/material/form-field';
// import { Subject } from 'rxjs';


export interface PeriodicElement {
  CandidateName: string;
  verifid: string;
  ServiceType: string;
  RefNumber: string;
  Active: string;
  ReportDate: string;
}

export interface Invoice {
  ClientName: string;
  sitegroupname: string;
  noofcandiate: string;
  batchno: string;
  invioceno: string;
  frmdate: string;
  tmdate: string;
  grandtot: string;
}

// const ELEMENT_DATA: Invoice[] = [
//     {
//         ClientName: 'Goodwin', sitegroupname: 'ACG-2525-2675', noofcandiate: 'DL', batchno: 'asw Co', invioceno: '01/12/2007', frmdate: 'asw Co', tmdate: '01/12/2007', grandtot: 'asw Co'
//     }
// ]

// export class MyTel {
//     constructor(public area: string, public exchange: string, public subscriber: string) { }
// }

const ELEMENT_DATA: PeriodicElement[] = [
  {
    CandidateName: 'Goodwin', verifid: 'ACG-2525-2675', ServiceType: 'DL', RefNumber: 'AC-125-589',
    Active: 'asw Co', ReportDate: '01/12/2007'
  },
  {
    CandidateName: 'Raman', verifid: 'ACG-2525-2563', ServiceType: 'Education', RefNumber: 'AC-125-223',
    Active: 'ABC Co', ReportDate: '01/12/2007',
  },
  {
    CandidateName: 'Arriya Dev', verifid: 'ACG-2525-2573', ServiceType: 'Employment', RefNumber: 'AC-125-745',
    Active: 'XYZ ', ReportDate: '01/12/2007'
  },
  {
    CandidateName: 'Balamurugan Kumaran', verifid: 'ACG-2525-2575', ServiceType: 'PAN', RefNumber: 'AC-125-784',
    Active: 'AB Company Pvt Ltd', ReportDate: '01/12/2007'
  },
  {
    CandidateName: 'Selvam', verifid: 'ACG-2525-1255', ServiceType: 'Address', RefNumber: 'AC-125-7896',
    Active: 'Tech Man', ReportDate: '01/12/2007'
  }
];

@Component({
  standalone: false,
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css'],
  // imports: [MatCheckboxModule]
})
export class FormsComponent implements OnInit, AfterViewInit {

  toppings = new UntypedFormControl();
  toppingList: string[] = ['Header One', 'Header Two', 'Header Three', 'Header Four', 'Header Five'];


  step1 = 0;
  showdSearch = true;
  show_Search = true;
  SearchCriFilter = false;
  showMorepackage = false;
  showMorepackagetwo = false;
  showSinglepackage = true;
  isShowTBL = false;
  isInsuf = true;
  isNotifica = true;

  @ViewChild('stepper1', { static: true }) stepper!: MatStepper;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  // @ViewChild('userNameTrigger', { static: true }): MatMenuTrigger;
  @ViewChild('userNameTrigger', { static: true })
  userNameTrigger!: MatMenuTrigger;

  firstFormGroup!: UntypedFormGroup;
  secondFormGroup!: UntypedFormGroup;
  // step1 = 1;
  prselectedColumns!: any[];
  prselectedColumnsInvoice!: any[];

  frozenCols = [
    { field: 'CandidateName', header: 'Candidate Name' }
  ];
  // #d64083
  sampledrowdownbox = [
    { label: 'New York', value: { id: 1, name: 'New York', code: 'NY' } },
    { label: 'Rome', value: { id: 2, name: 'Rome', code: 'RM' } },
    { label: 'London', value: { id: 3, name: 'London', code: 'LDN' } },
    { label: 'Istanbul', value: { id: 4, name: 'Istanbul', code: 'IST' } },
    { label: 'Paris', value: { id: 5, name: 'Paris', code: 'PRS' } }
  ];
  ngmodelselection: any[] = [];
  displayColumns2 = [
    { field: 'userName', header: 'User Name', value: true, disabled: true },
    { field: 'firstName', header: 'First Name', value: true, disabled: true },
    { field: 'lastName', header: 'Last Name', value: true, disabled: true },
    { field: 'clientName', header: 'Client Name', value: true, disabled: true },
    { field: 'roleName', header: 'Role Name', value: true, disabled: true },
    { field: 'siteName', header: 'Site Name', value: true },
    { field: 'active', header: 'Is Active' },
  ];

  filedname = [
    { field: 'verifid', header: 'Verif ID' },
    { field: 'ServiceType', header: 'Service Type' },
    { field: 'RefNumber', header: 'Ref No' },
    { field: 'Active', header: 'Active' },
    { field: 'ReportDate', header: 'Report Date' },
    // { field: 'Action', header: 'Action' },
  ];

  invoiceCols = [
    //  ClientName: string;
    // sitegroupname: string;
    // noofcandiate: string;
    // batchno: string;
    // invioceno: string;
    // frmdate: string;
    // tmdate: string;
    // grandtot: string;

    { field: 'clientName', header: 'Client Name' },
    { field: 'sitegroupname', header: 'Site No.' },
    { field: 'noofcandiate', header: 'No of Candidate' },
    { field: 'batchno', header: 'Batch No' },
    { field: 'ReportDate', header: 'Report Date' },
    { field: 'invioceno', header: 'Invioce No' },
    { field: 'frmdate', header: 'From Date' },
    { field: 'tmdate', header: 'To Date' },
    { field: 'grandtot', header: 'Grand Total' },

    // { field: 'Action', header: 'Action' },
  ];



  Invoi = [
    {
      clientName: 'Skyup Design', sitegroupname: 'ACG-1221-2568', noofcandiate: '1500', batchno: 'B-899',
      ReportDate: '05/12/2018', invioceno: '10122018', frmdate: '05/12/2018', tmdate: '01/01/2019', grandtot: '1500.00'
    },
    {
      clientName: 'Creative Technologies', sitegroupname: 'ACG-1221-8989', noofcandiate: '5000', batchno: 'B-878',
      ReportDate: '12/02/2019', invioceno: '12022019', frmdate: '22/02/2019', tmdate: '11/03/2019', grandtot: '32500.00'
    }
  ];

  tablerecords = [
    {
      CandidateName: 'Raman', verifid: 'ACG-2525-2563', ServiceType: 'Education', RefNumber: 'AC-125-223',
      Active: 'ABC Co', ReportDate: '01/12/2007',
    },
    {
      CandidateName: 'Arriya Dev', verifid: 'ACG-2525-2573', ServiceType: 'Employment', RefNumber: 'AC-125-745',
      Active: 'XYZ ', ReportDate: '01/12/2007'
    },
    {
      CandidateName: 'Balamurugan Kumaran', verifid: 'ACG-2525-2575', ServiceType: 'PAN', RefNumber: 'AC-125-784',
      Active: 'AB Company Pvt Ltd', ReportDate: '01/12/2007'
    },
    {
      CandidateName: 'Selvam', verifid: 'ACG-2525-1255', ServiceType: 'Address', RefNumber: 'AC-125-7896',
      Active: 'Tech Man', ReportDate: '01/12/2007'
    },
    {
      CandidateName: 'Steepan', verifid: 'ACG-8987-1255', ServiceType: 'Profisonal', RefNumber: 'AC-125-159',
      Active: 'ABC Co', ReportDate: '01/12/2007'
    },
    {
      CandidateName: 'Goodwin', verifid: 'ACG-2525-2675', ServiceType: 'DL', RefNumber: 'AC-125-589',
      Active: 'asw Co', ReportDate: '01/12/2007'
    },
    {
      CandidateName: 'Hery Malisas', verifid: 'ACG-2525-2763', ServiceType: 'Drug Test', RefNumber: 'AC-125-489',
      Active: 'esds Co', ReportDate: '01/12/2007'
    },
    {
      CandidateName: 'Peter', verifid: 'ACG-9985-1277', ServiceType: 'Aadhar card', RefNumber: 'AC-125-789',
      Active: 'epi Co', ReportDate: '01/12/2007'
    },
    {
      CandidateName: 'Suthan', verifid: 'ACG-2885-1265', ServiceType: 'Institute', RefNumber: 'AC-125-147 ',
      Active: 'sso Co', ReportDate: '01/12/2007'
    },
    {
      CandidateName: 'Karan', verifid: 'ACG-9985-1285', ServiceType: 'Institute/Emp', RefNumber: 'AC-125-125',
      Active: 'ABC Co', ReportDate: '01/12/2007'
    },
    {
      CandidateName: 'Raman', verifid: 'ACG-2525-2563', ServiceType: 'Education', RefNumber: 'AC-125-223',
      Active: 'ABC Co', ReportDate: '01/12/2007'
    },
    {
      CandidateName: 'Arriya Dev', verifid: 'ACG-2525-2573', ServiceType: 'Employment', RefNumber: 'AC-125-745',
      Active: 'XYZ ', ReportDate: '01/12/2007'
    },
    {
      CandidateName: 'Balamurugan Kumaran', verifid: 'ACG-2525-2575', ServiceType: 'PAN', RefNumber: 'AC-125-784',
      Active: 'AB Company Pvt Ltd', ReportDate: '01/12/2007'
    },
    {
      CandidateName: 'Selvam', verifid: 'ACG-2525-1255', ServiceType: 'Address', RefNumber: 'AC-125-7896',
      Active: 'Tech Man', ReportDate: '01/12/2007'
    },
    {
      CandidateName: 'Steepan', verifid: 'ACG-8987-1255', ServiceType: 'Profisonal', RefNumber: 'AC-125-159',
      Active: 'ABC Co', ReportDate: '01/12/2007'
    },
    {
      CandidateName: 'Goodwin', verifid: 'ACG-2525-2675', ServiceType: 'DL', RefNumber: 'AC-125-589',
      Active: 'asw Co', ReportDate: '01/12/2007'
    },
    {
      CandidateName: 'Hery Malisas', verifid: 'ACG-2525-2763', ServiceType: 'Drug Test', RefNumber: 'AC-125-489',
      Active: 'esds Co', ReportDate: '01/12/2007'
    },
    {
      CandidateName: 'Peter', verifid: 'ACG-9985-1277', ServiceType: 'Aadhar card', RefNumber: 'AC-125-789',
      Active: 'epi Co', ReportDate: '01/12/2007'
    },
    {
      CandidateName: 'Suthan', verifid: 'ACG-2885-1265', ServiceType: 'Institute', RefNumber: 'AC-125-147 ',
      Active: 'sso Co', ReportDate: '01/12/2007'
    },
    {
      CandidateName: 'Karan', verifid: 'ACG-9985-1285', ServiceType: 'Institute/Emp', RefNumber: 'AC-125-125',
      Active: 'ABC Co', ReportDate: '01/12/2007'
    }
  ];

  tableColumnsheaders: string[] = ['CandidateName', 'verifid', 'ServiceType', 'RefNumber', 'Active', 'ReportDate'];
  mattableSource = new MatTableDataSource(ELEMENT_DATA);

  constructor(public dialog: MatDialog, private messageService: MessageService,
    public snackBar: MatSnackBar, public common: CommonService,
    private router: Router) { }



  ngOnInit() {
    this.prselectedColumns = this.filedname;
    this.prselectedColumnsInvoice = this.invoiceCols;
    this.mattableSource.sort = this.sort;
  }
  ngAfterViewInit() {
    this.stepperChange(0);
  }

  stepperChange(index: number) {
    const data = document.getElementsByClassName('stpMenu');
    if (data) {
      data[index].classList.add('sm-a');
      for (let i = 0; i < data.length; i++) {
        if (index === i) {
        } else { data[i].classList.remove('sm-a'); }
      }
      // console.log(data);
    }
    // console.log(index);
  }

  stepClick(ev: any, step2: any, step3: any) {
    // this.review = false;
    if (ev.selectedIndex === 1 && !step2.interacted) {
      // this.validationDummy2 = 'valid';
    } else if (ev.selectedIndex === 2 && !step3.interacted) {
      // this.validationDummy3 = 'valid';
    }
    if (ev.selectedIndex === 3) {
      // this.validationDummy4 = 'valid';
    }
  }
  createView(n: any) {
    // console.log(n);
    this.step1 = n.selectedIndex;
    this.stepperChange(n.selectedIndex);
  }

  selectionChange(n: any) {
    if (n === 'next') {
      this.stepper.next();
    } else if (n === 'previous') {
      this.stepper.previous();
    }
  }
  openDialog(): void {
    this.common.popupDialog = true;
    this.common.popuptimeout = false;
    this.common.popupconfirmation = false;
    this.common.popCommonSearch = false;
    this.common.popupOTP = false;
    const dialogRef = this.dialog.open(CommonDialogComponent, {
      width: '850px',
      // disableClose: true   for data-backdrap = "static" in bootstrap by (for my notes)
    });
    dialogRef.afterClosed().subscribe(() => {
      // console.log('The dialog was closed');
    });
  }
  openConfirmDialog(): void {
    this.common.popupDialog = false;
    this.common.popuptimeout = false;
    this.common.popupconfirmation = true;
    this.common.popCommonSearch = false;
    this.common.popupOTP = false;

    const dialogRef = this.dialog.open(CommonDialogComponent, {
      width: '400px',
      data: 1
    });
    dialogRef.afterClosed().subscribe(() => {
      // console.log('The dialog was closed');
    });
  }
  openLoginDialog() {
    this.common.popupconfirmation = false;
    this.common.popupDialog = false;
    this.common.popuptimeout = true;
    this.common.popCommonSearch = false;
    this.common.popupOTP = false;
    const dialogRef = this.dialog.open(CommonDialogComponent, {
      width: '400px',
    });
    dialogRef.afterClosed().subscribe(() => {
      // console.log('The dialog was closed');
    });
  }
  openCommonSearch() {
    this.common.popupconfirmation = false;
    this.common.popupDialog = false;
    this.common.popuptimeout = false;
    this.common.popCommonSearch = true;
    this.common.popupOTP = false;
    const dialogRef = this.dialog.open(CommonDialogComponent, {
      width: '500px',
      position: { top: '0', right: '0' }
    });
    dialogRef.afterClosed().subscribe(() => {
      // console.log('The dialog was closed');
    });
  }
  otp_popup(): void {
    this.common.popupDialog = false;
    this.common.popuptimeout = false;
    this.common.popupconfirmation = false;
    this.common.popCommonSearch = false;
    this.common.popupOTP = true;

    const dialogRef = this.dialog.open(CommonDialogComponent, {
      width: '680px',
      data: 1
    });
    dialogRef.afterClosed().subscribe(() => {
      // console.log('The dialog was closed');
    });
  }
  // toast messages
  showSuccess() {
    this.messageService.add({
      key: 'success', severity: 'success', summary: 'Success Message',
      life: 2000000,
      detail: 'Everything is great! Just do your best'
    });
  }
  showInfo() {
    this.messageService.add({
      key: 'Info', severity: 'info', summary: 'Info Message',
      life: 2000000,
      detail: 'Info message, you should know this'
    });
  }
  showwarning() {
    this.messageService.add({
      key: 'warning', severity: 'warn', summary: 'Warning Message',
      life: 2000000,
      detail: 'Hmm, it’s not an error but you should check it'
    });
  }
  showError() {
    this.messageService.add({
      key: 'Error', severity: 'error', summary: 'Error Message',
      life: 2000000,
      detail: 'Something really getting bad'
    });
  }

  toggle(data: any) {
    this.show_Search = !this.show_Search;

    if (this.show_Search) {
      this.showdSearch = true;
    } else {
      this.showdSearch = false;
    }
  }


  // Chart Test

  title_Chart = 'Charts';
  LinechartSizeview = [900, 300];
  showAnnimation = true;
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'BGV Companies';
  yAxisLabel = 'Sales';
  xAxisLabelLine = 'BGV Companies';
  yAxisLabelLine = 'Sales';
  showYAxisLabel = true;
  timeline = true;
  showLabels = true;

  colorScheme = {
    domain: [
      '#9370DB', '#87CEFA', '#0b0350', '#ff4400', '#90EE90', '#d60aa4',
      '#19070B', '#8A0829', '#FF0040', '#FA5882', '#F5A9BC', '#F8E0E6',
      '#0B3B17', '#088A4B', '#00FF80', '#A9F5D0', '#CEF6E3', '#E0F8EC',
      '#D7DF01', '#868A08', '#393B0B', '#8A4B08', '#FE9A2E', '#F5A9A9',
    ]
  };
  // tslint:disable-next-line: member-ordering
  public single = [
    {
      name: 'DSSI',
      value: 1250055
    },
    {
      name: 'ACG',
      value: 1126000
    },
    {
      name: 'Infosys',
      value: 296215
    },
    {
      name: 'CTS',
      value: 257363
    },
    {
      name: 'TCS',
      value: 196750
    },
    {
      name: 'IBM',
      value: 204617
    },

    {
      name: 'DSSI1',
      value: 1250051
    },
    {
      name: 'ACG1',
      value: 11260020
    },
    {
      name: 'Infosys1',
      value: 296215
    },
    {
      name: 'CTS1',
      value: 257363
    },
    {
      name: 'TCS1',
      value: 196750
    },
    {
      name: 'IBM1',
      value: 204617
    },

    {
      name: 'DSSI2',
      value: 1250055
    },
    {
      name: 'ACG2',
      value: 1126000
    },
    {
      name: 'Infosys2',
      value: 296215
    },
    {
      name: 'CTS2',
      value: 257363
    },
    {
      name: 'TCS2',
      value: 196750
    },
    {
      name: 'IBM2',
      value: 204617
    },

    {
      name: 'DSSI3',
      value: 1250055
    },
    {
      name: 'ACG3',
      value: 1126000
    },
    {
      name: 'Infosys3',
      value: 296215
    },
    {
      name: 'CTS3',
      value: 257363
    },
    {
      name: 'TCS3',
      value: 196750
    },
    {
      name: 'IBM3',
      value: 204617
    }

  ];


  // tslint:disable-next-line:member-ordering
  public linechart = [
    {
      name: 'DSSI',
      series: [
        {
          value: 4844,
          name: '2016'
        },
        {
          value: 6313,
          name: '2017'
        },
        {
          value: 6387,
          name: '2018'
        },
        {
          value: 4564,
          name: '2019'
        },
        {
          value: 2973,
          name: '2020'
        }
      ]
    },
    {
      name: 'ACG',
      series: [
        {
          value: 5634,
          name: '2016'
        },
        {
          value: 4754,
          name: '2017'
        },
        {
          value: 6871,
          name: '2018'
        },
        {
          value: 2209,
          name: '2019'
        },
        {
          value: 5621,
          name: '2020'
        }
      ]
    },
    {
      name: 'CTS',
      series: [
        {
          value: 3832,
          name: '2016'
        },
        {
          value: 6725,
          name: '2017'
        },
        {
          value: 6186,
          name: '2018'
        },
        {
          value: 2843,
          name: '2019'
        },
        {
          value: 4232,
          name: '2020'
        }
      ]
    },
    {
      name: 'Infosys',
      series: [
        {
          value: 1211,
          name: '2016'
        },
        {
          value: 2323,
          name: '2017'
        },
        {
          value: 4343,
          name: '2018'
        },
        {
          value: 5445,
          name: '2019'
        },
        {
          value: 5533,
          name: '2020'
        }
      ]
    },
    {
      name: 'IBM',
      series: [
        {
          value: 1211,
          name: '2016'
        },
        {
          value: 2323,
          name: '2017'
        },
        {
          value: 4343,
          name: '2018'
        },
        {
          value: 5445,
          name: '2019'
        },
        {
          value: 5533,
          name: '2020'
        }
      ]
    }
  ];


  // Chart Test End



  showDiv(data: any) {

    if (data === 'insufrecords') {
      this.isShowTBL = true;
      this.isInsuf = false;
    }
    if (data === 'goback') {
      this.isShowTBL = false;
      this.isInsuf = true;
    }
    if (data === 'notifi') {
      // console.log(data);
      this.isNotifica = false;
    }
  }

  // buttonAction() {
  //   alert("IE browser Ation Button Test.....")
  // }


  buttonAction() {
    // alert('fdsfdsdsf');
    this.router.navigate(['/login']);
  }

}



