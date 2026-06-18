import { Component, OnInit, Input, ViewChild, ElementRef, TemplateRef, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators, UntypedFormArray } from '@angular/forms';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { SharedService } from 'src/app/common-methods/services/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { VerificationService } from 'src/app/common-methods/services/verification.service';
@Component({
  standalone: false,
  selector: 'app-common-raise-insufficiency',
  templateUrl: './common-raise-insufficiency.component.html',
  styleUrls: ['./common-raise-insufficiency.component.css']
})

export class CommonRaiseInsufficiencyComponent implements OnInit, OnChanges, OnDestroy {
  @Input() formgroupName: string;
  @Input() mainForm: UntypedFormGroup;
  @Input() compBaseDetails: any;
  @Input() level: any;
  @Input() docdata: any[] = [];
  @ViewChild('doc', { static: true }) doc: ElementRef;
  @ViewChild('docAdd', { static: true }) docAdd: TemplateRef<any>;
  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  @Input() docList: any[] = [];
  statusList: any[] = [];
  levelList: any[] = [];
  insuffReqType: any[] = [];
  insuffDocArr: any[] = [];
  insuffDocList: any[] = [];
  feesList: any[] = [];
  selectedDoctID: any[] = [];
  userData: any;
  showEntry: boolean;
  docName = new UntypedFormControl('', Validators.required);
  showInsuffDoc = true;
  showInsuffinfo = false;
  maxdate = new Date();
  docString = 'Please provide the following documents:';
  dialogRef: any;

  constructor(public screeningService: ScreeningService, private messageService: MessageService, private common: CommonService,
    private shared: SharedService, public dialog: MatDialog,public verificationservice:VerificationService) {
  }
  ngOnDestroy(): void {
    const remarkDetail = this.mainForm.get('screeningInsufficiency.insuffDetail') as UntypedFormArray;
    if(remarkDetail.controls[0]){
      const frmGroup1 = remarkDetail.controls[0] as UntypedFormGroup;
      frmGroup1.get('comments')?.clearValidators();
      frmGroup1.get('comments')?.updateValueAndValidity();
    }
    if(remarkDetail.controls[1]){
      const frmGroup2 = remarkDetail.controls[1] as UntypedFormGroup;
      frmGroup2.get('comments')?.clearValidators();
      frmGroup2.get('comments')?.updateValueAndValidity();
    }
   }
  ngOnChanges(change: SimpleChanges) {
    if (change.docdata) {
      this.docdata.map(e => {
        this.selectedDoctID.push(e.insuffDocId);
      });
    }
    if (change.docList) {
      if (this.docList) {
        this.insuffDocArr = this.common.CloneObject(this.docList);
        this.select();
      }
    }
  }

  ngOnInit() {
    this.getInsuffDetails();
    this.docdata.map(e => {
      this.selectedDoctID.push(e.insuffDocId);
    });
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.mainForm.get('screeningInsufficiency.loggedIn')?.setValue(this.userData.userId);
  }

  getInsuffDetails() {
    this.screeningService.getInsuffDetails(false).subscribe(res => {
      if (res) {
        this.statusList = res.screeningStatus;
        this.levelList = res.insuffLevel;
        this.screeningService.insuffLevelList = this.levelList;
        this.insuffReqType = res.insuffReqType;
        if ( this.verificationservice.FeeApprovalFlag === true  && this.mainForm.get('screeningInsufficiency')?.value.insufficiencyId === 0) {
        this.verificationservice.getAdditionalFeesByScreeningCompId(this.mainForm.get(this.formgroupName).get('screeningCompId')?.value).subscribe(resp => {
          if (resp) {
            this.feesList = resp;
            if(this.feesList.filter(f => f.feeApprovalFlag === true)){
            const clientfeesList = this.feesList.filter(f => f.feeApprovalFlag === true);
            const val = (this.mainForm.get('screeningInsufficiency.insuffDetail') as UntypedFormArray).controls;
            val.forEach(element => {
              element.get('comments')?.setValue(clientfeesList[0].feeDescription);
            });
          
            this.mainForm.get('screeningInsufficiency.requiredLookupId')?.setValue(undefined);
            const infor = this.insuffReqType.find(x => x.lookUpName.toLowerCase() === this.common.INFO_REQ.toLowerCase()).lookUpId;
            if (this.mainForm.get('screeningInsufficiency.requiredLookupId')?.value === undefined) {
              this.mainForm.get('screeningInsufficiency.requiredLookupId')?.setValue(infor);
            }
          }
          }})
        }
      }
        const req = this.insuffReqType.find(x => x.lookUpName.toLowerCase() === this.common.DOCU_REQ.toLowerCase()).lookUpId;
        const docinforeq = this.insuffReqType.find(x => x.lookUpName.toLowerCase() === this.common.INFO_DOCU.toLowerCase()).lookUpId;
        if (this.mainForm.get('screeningInsufficiency')?.value.insufficiencyId === 0) {
          const val = (this.mainForm.get('screeningInsufficiency.insuffDetail') as UntypedFormArray).controls;
          val.forEach(element => {
            element.get('comments')?.setValue('');
          });
          this.mainForm.get('screeningInsufficiency.requiredLookupId')?.setValue(undefined);
        }
        if (this.mainForm.get('screeningInsufficiency.requiredLookupId')?.value === null ||
          this.mainForm.get('screeningInsufficiency.requiredLookupId')?.value === 0) {
          this.mainForm.get('screeningInsufficiency.requiredLookupId')?.setValue(req);
          this.showInsuffDoc = true;
          // this.getRequiredType();
        } else {
          if (this.mainForm.get(this.formgroupName + '.requiredLookupId').value === req) {
            this.showInsuffDoc = true;
          } else if (this.mainForm.get(this.formgroupName + '.requiredLookupId').value === docinforeq) {
            this.showInsuffDoc = true;
            this.showInsuffinfo = true;
          } else {
            this.showInsuffDoc = false;
            this.showInsuffinfo = false;
          }
        }
        if (this.mainForm.get('screeningInsufficiency.levelLookupId')?.value === null ||
          this.mainForm.get('screeningInsufficiency.levelLookupId')?.value === 0) {
          let levelType;
          if (this.level === 'Verification') {
            levelType = this.levelList.find(x => x.lookUpName.toLowerCase() === 'level-2').lookUpId;
          } else {
            if (this.mainForm.value.compRef.hasOwnProperty('currentEmployerFlag') &&
            this.mainForm.value.compRef.currentEmployerFlag &&
             this.mainForm.get('compRef.currentEmployerFlag')?.value === true) {
              levelType = this.levelList.find(x => x.lookUpName.toLowerCase() === 'ce').lookUpId;
            } else {
              levelType = this.levelList.find(x => x.lookUpName.toLowerCase() === 'level-1').lookUpId;
            }
          }
          this.mainForm.get('screeningInsufficiency.levelLookupId')?.setValue(levelType);
        } else {
          this.mainForm.get('screeningInsufficiency.levelLookupId')?.
            setValue(this.mainForm.get('screeningInsufficiency.levelLookupId')?.value);
        }
        if (this.mainForm.get('screeningInsufficiency.raisedDate')?.value === null) {
          this.mainForm.get(this.formgroupName + '.raisedDate').setValue(new Date());
        } else {
          this.mainForm.get('screeningInsufficiency.raisedDate')?.
            setValue(this.mainForm.get('screeningInsufficiency.raisedDate')?.value);
        }
      }
    )}
  isDocReq() {
    let ret = false;
    if (this.insuffReqType && this.insuffReqType.length > 0) {
      const req = this.insuffReqType.find(x => x.lookUpName.toLowerCase() === this.common.DOCU_REQ.toLowerCase()).lookUpId;
      ret = this.mainForm.get(this.formgroupName + '.requiredLookupId').value === req;
    }
    return ret;
  }
  saveInsuffDoc() {
    const value = this.doc.nativeElement.value;
    if ((this.insuffDocArr.length === 0 ||
      this.insuffDocArr.filter(x => x.description.toLowerCase().trim() === value.toLowerCase().trim()).length === 0)) {
      if (value.trim() !== '') {
        this.insuffDocList = [];
        this.insuffDocList.push({
          insuffDocId: 0, insuffDocTransId: 0, componentId: this.compBaseDetails.compId, description: value,
          createdUserId: this.userData.userId,
        });

        this.screeningService.addInsuffDocument(this.insuffDocList).subscribe(resp => {
          if (resp) {
            this.showTopCenter('success', 'Success', 'Added successfully');
            this.showEntry = false;
            this.doc.nativeElement.value = '';
            this.getInsuffDoc();
            this.dialogRef.close();
          }
        });
      } else {
        this.showTopCenter('warn', 'Failure Message', 'Failed to save. Please Provide a valid Insufficiency document Name');
        this.doc.nativeElement.value = '';
      }
    } else {
      this.showTopCenter('warn', 'Failure Message', 'Failed to save. Insufficiency document Name is already available');
      this.doc.nativeElement.value = '';
    }
  }
  screeningStatusList(e: any) {
    if (e > 0) {
      const statusList = this.statusList.filter(x => x.statusId === e);
      if (statusList.length > 0) {
        this.mainForm.get(this.formgroupName).get('screeningStatusId')?.setValue(statusList[0].statusId);
      }
    }
  }
  openDocDialog() {
    this.docName.setValue(null);
    this.dialogRef = this.dialog.open(this.docAdd, {
      width: '500px',
      disableClose: true
    });
  }
  inSuffRemarks() {
    return (this.mainForm.get('screeningInsufficiency.insuffDetail') as UntypedFormArray).controls;
  }
  getInsuffDoc() {
    this.screeningService.getInsuffDocument(this.compBaseDetails.compId).subscribe(resp => {
      this.insuffDocArr = resp;
      this.screeningService.insuffDocList = Object.assign([], this.insuffDocArr);
      this.docdata = Object.assign([], this.mainForm.get(this.formgroupName + '.insuffDocument').value);
      this.docdata.map(e => {
        this.selectedDoctID.push(e.insuffDocId);
      });
      this.select();
    });
  }
  showNotification(severity, summary, message) {
    this.shared.emitChange({
      severity,
      summary,
      detail: message
    });
  }
  showDocEntry() {
    this.showEntry = true;
  }
  showTopCenter(level: string, info: string, message: string) {
    this.messageService.add({ severity: level, summary: info, detail: message });
  }
  compare(c1: { insuffDocId: number }, c2: { insuffDocId: number }) {
    return c1 && c2 && c1.insuffDocId === c2.insuffDocId;
  }
  select() {
    setTimeout(() => {
      this.insuffDocArr.map(m => {
        if (this.selectedDoctID.includes(m.insuffDocId)) {
          const index = this.docdata.findIndex(f => f.insuffDocId === m.insuffDocId);
          m.insuffDocTransId = index > -1 ? this.docdata[index].insuffDocTransId : 0;
        }
      });
      this.mainForm.get(this.formgroupName + '.insuffDocument').setValue(this.docdata);
    }, 0);
  }
  getRequiredType(name: string) {
    const remarkDetail = this.mainForm.get('screeningInsufficiency.insuffDetail') as UntypedFormArray;
    if (remarkDetail.length > 1) {
      let ind = remarkDetail.length;
      while (ind >= 1) {
        remarkDetail.removeAt(ind);
        ind--;
      }
    }
    remarkDetail.updateValueAndValidity();
    const frmGroup = remarkDetail.controls[0] as UntypedFormGroup;
    if (name.toLowerCase() === this.common.DOCU_REQ.toLowerCase()) {
      this.mainForm.get('screeningInsufficiency.insuffDocument')?.setValue([]);
      this.showInsuffDoc = true;
      this.showInsuffinfo = false;
      this.addInsufDesc();
      frmGroup.get('infoReqFlag')?.setValue(false);
      frmGroup.get('docReqFlag')?.setValue(true);
    } else if (name.toLowerCase() === this.common.INFO_DOCU.toLowerCase()) {
      this.mainForm.get('screeningInsufficiency.insuffDocument')?.setValue([]);
      this.showInsuffDoc = true;
      this.showInsuffinfo = true;
      this.addInsufDesc();
      frmGroup.get('infoReqFlag')?.setValue(false);
      frmGroup.get('docReqFlag')?.setValue(true);
      // this.addInsuffDetailForm();
    } else {
      this.selectedDoctID = [];
      this.mainForm.get('screeningInsufficiency.insuffDocument')?.setValue([]);
      this.showInsuffDoc = false;
      this.showInsuffinfo = false;
      frmGroup.get('infoReqFlag')?.setValue(true);
      frmGroup.get('docReqFlag')?.setValue(false);
      frmGroup.get('comments')?.setValue('');
    }
  }
  addInsufDesc() {
    const frmGroup = (this.mainForm.get('screeningInsufficiency.insuffDetail') as UntypedFormArray).controls[0];
    const data = this.mainForm.get('screeningInsufficiency.insuffDocument')?.value;
   if (data.length > 0) {
      let insRemarksText = this.docString;
      data.forEach(e => { insRemarksText += '\n' + e.description + ','; });
      frmGroup.get('comments')?.setValue(insRemarksText);
    } else {
      frmGroup.get('comments')?.setValue('');
    }
  }
  remarkblur(formgrp: UntypedFormGroup, value) {
    formgrp.get('comments')?.setValue(value);
    formgrp.get('comments')?.updateValueAndValidity();
    this.mainForm.get('screeningInsufficiency.insuffDetail')?.updateValueAndValidity();
  }
  addInsuffDetailForm() {
    const inSuffRemarks = this.mainForm.get('screeningInsufficiency.insuffDetail') as UntypedFormArray;
    inSuffRemarks.controls.push(new UntypedFormGroup({
      insuffDetailId: new UntypedFormControl(0),
      insufficiencyId: new UntypedFormControl(0),
      insuffDate: new UntypedFormControl(null),
      comments: new UntypedFormControl('', Validators.required),
      createdUserId: new UntypedFormControl(this.userData.userId),
      infoReqFlag: new UntypedFormControl(true),
      docReqFlag: new UntypedFormControl(false)
    }));
  }

}

