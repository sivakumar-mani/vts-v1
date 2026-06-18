import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/common-methods/models/user';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { CommonAddNewComponent } from '../common-add-new/common-add-new.component';

@Component({
  standalone: false,
  selector: 'app-common-pre-data',
  templateUrl: './common-pre-data.component.html',
  styleUrls: ['./common-pre-data.component.css']
})
export class CommonPreDataComponent implements OnInit {

  headerText: string;
  labelText: string;
  action: string;
  values: any[] = []; gridvalue: any[] = [];
  userData = new User();
  predatacolumns: any[] = [];
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<CommonPreDataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: UntypedFormBuilder,
    private screeningService: ScreeningService) {
    this.headerText = data.headerText;
    this.labelText = data.labelText;
    this.action = data.action;
    this.values = data.values;
    }

  ngOnInit() {
    const dadta: any[] = [];
    this.predatacolumns = [
      { field: 'type', header: 'Type' },
      { field: 'name', header: this.action === 'Employer' ? 'Employer Name' : 'Institution Name' },
      { field: 'fromdate', header: 'From Date' },
      { field: 'todate', header: 'To Date' },
    ];
    this.values.forEach(el => {
      const splidata = el.lookUpValue.split(',');
      const splitdata1 = splidata ? splidata[1].split('to') : '';
      this.gridvalue.push({ type: el.lookUpName, name: splidata[0], fromdate: splitdata1[0], todate: splitdata1[1] });
    });
  }
  rowselect(rowdata, index) {
    this.dialogRef.close({
      rowdata,
      index
    });
  }

}
