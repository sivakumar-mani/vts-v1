import { Component, OnInit, ViewChild, Inject, Injectable } from '@angular/core';
import {  MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ScreeningService } from '../../common-methods/services/screening.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  standalone: false,
  selector: 'app-lasttransaction',
  templateUrl: './lasttransaction.component.html',
  styleUrls: ['./lasttransaction.component.css']
})
export class LasttransactionComponent implements OnInit {
  displayedColumns: string[] = ['SNo', 'screeningID', 'referenceNo', 'serviceType', 'functionalEntity'];
  dataSource = new MatTableDataSource([]);
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  popupData: any;
  constructor(public dialogRef: MatDialogRef<LasttransactionComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
              public screeningService: ScreeningService) {
    this.popupData = data;
  }

  ngOnInit() {
    if (this.popupData.values) {
      this.getCandidateScreeningDetailsByFileNo();
    }
    this.dataSource.sort = this.sort;
  }
  getCandidateScreeningDetailsByFileNo() {
    this.screeningService.getCandidateScreeningDetailsByFileNo(this.popupData.values).subscribe(res => {
      if (res) {
        this.dataSource.data = res;
      }
    });
  }

}
