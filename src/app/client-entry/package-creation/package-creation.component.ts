import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MasterService } from '../../common-methods/services/master.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { UntypedFormControl, Validators, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../common-methods/services/auth.service';
import { CommonService } from '../../common-methods/services/common.service';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { CommonAlertsComponent } from '../../common-methods/common-alerts/common-alerts.component';
import { SharedService } from '../../common-methods/services/shared.service';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table'

@Component({
  standalone: false,
  selector: 'app-package-creation',
  templateUrl: './package-creation.component.html',
  styleUrls: ['./package-creation.component.css'],
  animations: [
    trigger('rowExpansionTrigger', [
      state('void', style({
        transform: 'translateX(-10%)',
        opacity: 0
      })),
      state('active', style({
        transform: 'translateX(0)',
        opacity: 1
      })),
      transition('* <=> *', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
  ]
})
export class PackageCreationComponent implements OnInit {
  frozenCols = [{ field: 'expand', header: '' }];
  filedname = [
    { field: 'packageName', header: 'Package Name' },
    { field: 'tatDays', header: 'TAT Days' },
    { field: 'fees', header: 'Fees' },
    // { field: 'action', header: 'Action' },
  ];
  colname = [
    { field: 'componentName', header: 'Component Name' },
    { field: 'noOfComp', header: 'No of Comp' },
  ];
  hiscolname = [
    { field: 'effectiveDate', header: 'Effective Date' },
    { field: 'originalFee', header: 'Prev.Pack.Cost' },
    { field: 'updatedFee', header: 'Revised Pack.Cost' },
    { field: 'reason', header: 'Effective Reason' },
    { field: 'userName', header: 'Updated By' },
    { field: 'action', header: 'Action' },
  ];
  packageNameFormCtrl = new UntypedFormControl();
  packageNameFilteredOptions: Observable<string[]>;
  @ViewChild('packageNameTrigger') packageNameTrigger!: MatMenuTrigger;
  @ViewChild('effectiveDialog', { static: true }) effectiveDialog!: TemplateRef<any>;
  @ViewChild('feesTrigger') feesTrigger!: MatMenuTrigger;
  @ViewChild('packtab') packtab!: Table;

  feesFormCtrl = new UntypedFormControl();
  feesFilteredOptions: Observable<string[]>;
  agentId: any;
  packageList: any[] = [];
  clientlist: any[] = [];
  clientflterlist: any[] = [];
  clientname = new UntypedFormControl();
  packagename = new UntypedFormControl();
  billingKeyup = false;
  userdata: any;
  clientId: number;
  routePath = 'Client / Package Creation';
  totalpages: number;
  currentPage = 1;
  tempCurrentPage = 1;
  screenAuth: any = {};
  btnAdd = true;
  btnResetTbl = true;
  btnAddDisabled = false;
  gridData: any[] = [];
  heading = '';


  packageListForm: UntypedFormGroup;
  clientNameControl!: AutoCompleteDropDown;
  packageNameControl!: AutoCompleteDropDown;
  packPriceControl!: AutoCompleteDropDown;

  clientNameList: any[] = [];
  packageNameList: any[] = [];
  packPriceList: any[] = [];
  searchValueArr: any[] = [];

  constructor(private masterService: MasterService, private router: Router, private authService: AuthService,
    // tslint:disable-next-line: align
    private commonService: CommonService, private messageService: MessageService, public dialog: MatDialog) { }

  ngOnInit() {
    this.screenAuth = this.authService.getScreenAuth(this.router.url);
    this.userdata = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.initForGroupForAutoComplete();
    this.getClient();
    if (this.clientId > 0) {
      this.authService.packClientId = 0;
      this.clientname.setValue(this.clientId);
    }
    this.getPackageByClientId();
  }
  initForGroupForAutoComplete() {
    this.packageListForm = new UntypedFormGroup({
      clientName: new UntypedFormControl(null),
      packageName: new UntypedFormControl(null),
      packPrice: new UntypedFormControl(null)
    });
    this.initautoCompleteCtrl();
  }
  initautoCompleteCtrl() {
    this.clientNameControl = new AutoCompleteDropDown('Client Name', 'clientName', 'clientName', 'clientName', this.clientNameList,
      '', this.packageListForm, false, false, false, 'standard');
    this.packageNameControl = new AutoCompleteDropDown('Package Name', 'packageName', 'packageName', 'packageName', this.packageNameList,
      '', this.packageListForm, false, false, false, 'standard');
    this.packPriceControl = new AutoCompleteDropDown('Pack Price', 'packPrice', 'fees',
      'fees', this.packPriceList, '', this.packageListForm, false, false, false, 'standard');
  }

  removeSearchValue(key, index) {
    // tslint:disable-next-line: forin
    this.searchValueArr.splice(index, 1);
    // tslint:disable-next-line: forin
    for (const ctrl in this.packageListForm.controls) {
      if (ctrl === key) {
        this.packageListForm.get(ctrl).setValue('');
      }
    }
  }
  autocompleteData() {

    this.clientNameList = Array.from(new Map
      (this.packageList.map(x => ({ clientName: x.clientName }))
        .map(e => [e.clientName, e])).values());
    this.packageNameList = Array.from(new Map
      (this.packageList.map(x => ({ packageName: x.packageName }))
        .map(e => [e.packageName, e])).values());
    this.packPriceList = Array.from(new Map
      (this.packageList.map(x => ({ fees: x.fees.toString() }))
        .map(e => [e.fees.toString(), e])).values());
    this.initautoCompleteCtrl();
  }

  getPropertyValue(event: any) {
    if (event.value !== '' && event.value !== null) {
      if (this.searchValueArr.length > 0) {
        if (this.searchValueArr.filter(x => x.propertyName === event.propertyName && x.value === event.value).length === 0) {
          if (this.searchValueArr.filter(x => x.propertyName === event.propertyName).length > 0) {
            const index = this.searchValueArr.findIndex(f => f.propertyName === event.propertyName);
            this.searchValueArr.splice(index, 1, { propertyName: event.propertyName, value: event.value });
          } else {
            this.searchValueArr.push({ propertyName: event.propertyName, value: event.value });
          }
        }
      } else {
        this.searchValueArr.push({ propertyName: event.propertyName, value: event.value });
      }
    } else {
      for (const ctrl in this.packageListForm.controls) {
        if (ctrl === event.propertyName) {
          const index = this.searchValueArr.findIndex(x => x.propertyName === ctrl);
          this.searchValueArr.splice(index, 1);
        }
      }
    }
  }

  getPackageByClientId() {
    this.billingKeyup = false;
    let clientId: any;
    clientId = this.clientname.value;
    if (this.userdata.applicationId === 2) {
      clientId = Number(this.userdata.clientId);
    }
    this.masterService.GetPackageByClientId(clientId ? clientId : 0, this.userdata.team).subscribe(res => {
      if (res) {
        this.packageList = res;
        this.currentPage = 1;
        // this.packageList.forEach(element => {
        //   if (element.packComp) {
        //     element.packComp.forEach(elementPackComp => {
        //       element.packComp.index0 = [1,2,3][4,5,6]

        //     });
        //   }
        // });

        // var size = 3;
        //  var arrayOfArrays: any[] = [];
        //  for (var i = 0; i < pack.packComp.length; i += size) {
        //   arrayOfArrays.push( pack.packComp.slice(i, i + size));
        // }
        // console.log(arrayOfArrays);
        for (const pack of this.packageList) {
          pack.showMorepackage = false;
          pack.packFees = pack.fees.toString();
        }
        this.autocompleteData();
      }
    });
  }
  packageChange(value: any) {
    if (value) {
      this.packageList = this.packageList.filter(x => x.packageId === value);
    } else {
      this.packageList = this.packageList;
    }
  }
  getClient() {
    const data = new PackClientVM();
    data.LstClientId = this.userdata.clientId;
    this.masterService.GetPackClient(data).subscribe(res => {
      if (res) {
        this.clientlist = res;
        this.clientItems('');
        if (this.clientId > 0) {
          this.clientname.setValue(this.clientId);
        }
      }
    });
  }
  private packageTblAutoFilters(): void {
    this.packageNameFilteredOptions = this.packageNameFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.packageList.map(x => x.packageName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
    this.feesFilteredOptions = this.feesFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.packageList.map(x => x.fees).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
  }
  clientKeyupFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        const client = this.clientflterlist.filter(e =>
          e.clientName.toLowerCase() === value.toLowerCase());
        if (client.length > 0) {
          this.billingKeyup = true;
        } else {
          this.billingKeyup = true;
        }
      } else {
        this.billingKeyup = false;
        this.getPackageByClientId();
      }
    }
  }
  get displayclientFn() {
    const clientNew = (client) => {
      if (client == null || client === undefined) {
        return null;
      } else {
        if (client && this.clientflterlist && this.clientflterlist.length > 0) {
          client = this.clientflterlist.find(x => x.clientId === client);
          return client.clientName;
        } else {
          return null;
        }
      }
    };
    return clientNew;
  }

  // Resource ..
  clientItems(value: any) {
    if (!value) { this.assignResourceCopy(); }
    if (value) {
      this.clientflterlist = Object.assign([], this.clientlist).filter(
        item => ((item.clientName.toLowerCase().indexOf(value.toLowerCase()) > -1)));
    }
  }
  assignResourceCopy() {
    this.clientflterlist = Object.assign([], this.clientlist);
  }
  editpackage(data, mode) {
    // if (this.clientname.valid) {
    this.commonService.tempResetData = data;
    this.authService.packageId = data.packageId;
    this.authService.packageEffective = mode === 'Effective' ? true : false;
    if (mode === 'Add') {
      this.authService.addOrEdit = mode;
      this.authService.packClientId = 0;
    } else {
      this.authService.addOrEdit = mode;
      this.authService.packClientId = data.clientId;
      this.authService.packPrice = data.fees;
      this.authService.packTatDays = data.tatDays;
    }
    this.router.navigate(['dashboard/client/PackageCreationDetail']);
    // } else {
    this.clientname.markAsTouched();
    this.clientname.setValidators(Validators.required);
    // }
  }
  checkValidValue() {
    const value = this.clientname.value;
    if (value === '' || value == null) {
    } else if (this.billingKeyup) {
      this.clientname.setErrors({ incorrect: true });
    } else {
      this.clientname.setErrors(null);
    }
  }
  public openDialog(data, type) {
    const popupData = {
      action: this.commonService.DELETECONFIRMATION,
      headerText: 'Confirmation',
      bodyText: 'Are you sure you want to delete this pacakage?'
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
          if (action === this.commonService.DELETECONFIRMATION) {
            if (type === 'history') {
              this.deletePackageHistory(data);
            } else {
              this.deletePackage(data);
            }
          }
          this.getPackageByClientId();
        }
      });
    }
  }
  deletePackage(data: any) {
    const createdUserId = this.userdata.userId;
    const clientId = this.clientname.value;
    this.masterService.DeletePackage(data.packageId, data.clientId, createdUserId).subscribe(resp => {
      if (resp) {
        const msg = 'Deleted Successfully';
        this.showTopCenter('success', 'Success Message', 'Deleted Successfully');
        this.getPackageByClientId();
      }
    });
  }
  deletePackageHistory(data: any) {
    const createdUserId = this.userdata.userId;
    this.masterService.DeletePackageHistory(data.packageHisId, createdUserId).subscribe(resp => {
      if (resp) {
        const msg = 'Deleted Successfully';
        this.showTopCenter('success', 'Success Message', 'Deleted Successfully');
        this.dialog.closeAll();
        this.getPackageByClientId();
      }
    });
  }
  showTopCenter(level: string, info: string, message: string) {
    this.messageService.add({ severity: level, summary: info, detail: message });
  }
  // showTopCenter(data: any, msg) {
  //   this.saharedService.emitChange({
  //     severity: 'warn',
  //     summary: 'Success Message',
  //     detail: msg
  //   });
  // }
  refresh() {
    this.authService.packClientId = 0;
    this.clientId = 0;
    this.clientname.reset();
    this.clientname.markAsPristine();
    this.packageList = [];
    this.getPackageByClientId();
    this.searchValueArr = [];
    this.packageListForm.reset();
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
      this.packtab.onPageChange({ first: ((pageNo - 1) * rowscount), rows: rowscount });
      this.tempCurrentPage = this.currentPage;
    }
  }

  openDialogWithTemplateRef(templateRef: TemplateRef<any>, gridData, heading) {
    this.gridData = gridData; this.heading = heading;
    this.dialog.open(templateRef, {
      width: '700px',
      height: '400px',
      // disableClose: true
    });
  }

}
class PackClientVM {
  LstClientId: string[];
  clientId: string;
}


