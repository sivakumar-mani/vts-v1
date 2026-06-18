import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { VerificationService } from 'src/app/common-methods/services/verification.service';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { MessageService } from 'primeng/api';

@Component({
  standalone: false,
  selector: 'app-dynamic-component',
  templateUrl: './dynamic-component.component.html',
  styleUrls: ['./dynamic-component.component.css']
})
export class DynamicComponentComponent implements OnInit {
  @Input() verificationForm: UntypedFormGroup;
  @Input() verificationComponentDet: UntypedFormGroup;
  compType: any;
  userData: any;
  // For Drug Result
  drugList: any[] = [];
  drugLookupList: any[] = [];
  drugColumns = [
    { field: 'drugShortCode', header: 'Drug Code' },
    { field: 'drugName', header: 'Drug Name' },
    { field: 'result', header: 'Result' }
  ];
  drugReportList: any[] = [];
  disableFlag: boolean;
  constructor(private verificationService: VerificationService, private message: MessageService, private commonService: CommonService) {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
  }

  ngOnInit() {
    this.compType = this.verificationForm.value.responseDocument.componentType;
    this.drugVericationStatus();
  }

  drugVericationStatus() {
    if (this.compType === 'drugTest') {
      const compRef = this.verificationComponentDet.value.component[0].compRef;
      this.verificationService.getDrugDetails(compRef.panelId, compRef.screeningDrugTestId).subscribe(res => {
        if (res) {
          this.drugList = res;
          this.checkDrugList();
        }
      });
      this.verificationService.getDrugLookupDetails().subscribe(res => {
        if (res) {
          this.drugLookupList = res;
        }
      });
    }
  }

  updateDrugStatus() {
    const compRef = this.verificationComponentDet.value.component[0].compRef;
    this.drugReportList = this.drugList.filter(x => x.drugTestResultLookupId !== null);
    this.drugReportList.forEach((ele) => {
      ele.screeningDrugTestResultRptId = ele.drugTestResultLookupId !== null ? ele.screeningDrugTestResultRptId : 0;
      ele.screeningDrugTestId = compRef.screeningDrugTestId;
      ele.loggedIn = this.userData.userId;
    });
    this.commonService.drugResultList = this.drugList;
    if (this.drugReportList.length > 0) {
      if (this.drugReportList.length === this.drugList.length) {
      this.verificationService.AddUpdateDrugTestResultDetails(this.drugReportList).subscribe(resp => {
        if (resp) {
          this.showTopCenter('success', 'Success Message', 'Updated Successfully');
          this.checkDrugList();
          this.commonService.drugResultList = [];
          this.disableFlag = true;
        }
      });
    } else {
      this.showTopCenter('warn', 'Alert Message', 'Fill all Drug Test Results');
    }
    } else {
      this.showTopCenter('warn', 'Alert Message', 'No Record was found in Drug Result');
    }
  }
  checkDrugList() {
    this.drugList.forEach((loop) => {
      if (loop.drugTestResultLookupId !== null) {
        this.verificationForm.get('drugVerifResult')?.setValue(true);
      } else {
        this.verificationForm.get('drugVerifResult')?.setValue(false);
        return;
      }
    });
  }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }

}
