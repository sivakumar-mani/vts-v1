import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AgentEntryMasterService } from 'src/app/common-methods/services/agent-entry-master.service';
import { AgreementDetails, AgreementDocument, SaveClientEntry } from 'src/app/common-methods/models/agentEntryMaster';
import { Validators } from '@angular/forms';
import { LookUpModel } from 'src/app/common-methods/models/common';
import { MatDatepicker } from '@angular/material/datepicker';
// import { MatDatepicker } from '@angular/material/datepicker/typings/datepicker';
import { MessageService } from 'primeng/api';
import { CommonService } from 'src/app/common-methods/services/common.service';

@Component({
  standalone: false,
  selector: 'app-agreement-details',
  templateUrl: './agreement-details.component.html',
  styleUrls: ['./agreement-details.component.css']
})
export class AgreementDetailsComponent implements OnInit {
  LookUpModel = new LookUpModel();
  @Output() nextStep = new EventEmitter<void>();
  @Output() previousStep = new EventEmitter<void>();
  agreementDetails = new AgreementDetails();
  otherShowFlag: boolean;
  cos: any[] = [];
  expiry = true;
  agreementAvailability = [
    { mode: 'Yes', value: true },
    { mode: 'No', value: false }
  ];
  typeOfAgreementName: string;

  constructor(public agentEntryMasterService: AgentEntryMasterService, public commonService: CommonService,
              private message: MessageService) {
    // this.agentEntryMasterService.initagreementDetailsFormGroup();
  }
  scrollToTop() {
    const elements = document.querySelectorAll('mat-form-field.ng-invalid');
    if (elements.length === 0) {
      const element = document.querySelectorAll('mat-form-field.ng-valid');
      element[0].scrollIntoView(false);
    }
    if (elements.length > 0) {
      elements[0].scrollIntoView(false);
    }
  }
  ngOnInit() {
    this.GetAgreementDetails();
    // console.log(this.agentEntryMasterService.agreementDocumentList, 'agentEntryMasterService.agreementDocumentList');
  }
  openDate(Date1: MatDatepicker<Date>) {
    Date1.open();
  }
  GetAgreementDetails() {
    this.agentEntryMasterService.getAgreementDetails().subscribe(res => {
      this.agreementDetails = res;
      this.agreementDetails.typeOfAgreement = this.agreementDetails.typeOfAgreement;
      // if (this.agentEntryMasterService.clientid > 0 && this.agreementDetails.typeOfAgreement.length > 0) {
      //   this.typeOfAgreement(this.agentEntryMasterService.typeOfAgreement);
      // }
      // if (this.agentEntryMasterService.clientid > 0 && this.agreementDetails.reminderforRenewal.length > 0) {
      //   this.reminderChange(this.agentEntryMasterService.reminder);
      // }
    }, err => {
      console.error(err);
    }, () => {
    });
  }
  typeOfAgreement(value: any) {
    if (value) {
      // if (value === 44) {
      //   this.otherShowFlag = true;
      // } else {
      //   this.agentEntryMasterService.agreementDetailsForm.get('remarks')?.reset();
      //   this.otherShowFlag = false;
      // }
      const agreement = this.agreementDetails.typeOfAgreement.filter(x => x.lookUpId === value);
      // console.log(agreement, 'agreement');
      const agreementnew = agreement[0].lookUpName;
      this.typeOfAgreementName = agreementnew;
      if (this.typeOfAgreementName === this.commonService.OTHERS) {
        this.otherShowFlag = true;
      } else {
        this.agentEntryMasterService.agreementDetailsForm.get('remarks')?.reset();
        this.otherShowFlag = false;
      }
      // console.log(agreementnew, 'agreementnew');
      this.agentEntryMasterService.agreementDetailsForm.get('agreementName')?.setValue(agreementnew);
    }
  }
  renewalChange(eve: any) {
    if (!eve) {
      this.agentEntryMasterService.agreementDetailsForm.get('autoRenewelPeriod')?.reset();
    }
  }
  reminderChange(e: any) {
    if (e) {
      const rem = this.agreementDetails.reminderforRenewal.filter(x => x.lookUpId === e);
      const remName = rem[0].lookUpName;
      this.agentEntryMasterService.agreementDetailsForm.get('reminderName')?.setValue(remName);
    }
  }
  applyValidation(selectIndex: any) {
    this.cos = this.agreementAvailability.filter(x => x.value === selectIndex);
    const newmode = this.cos[0].value;
    const ctrls = ['typeOfAgreement', 'dateOfAgreement', 'validity', 'autoRenewel', 'reminder',
      'remarks', 'autoRenewelPeriod', 'dateOfExpiry', 'reminderForRenewel'];
    if (newmode) {
      for (const ctrl in this.agentEntryMasterService.agreementDetailsForm.controls) {
        if (ctrls.indexOf(ctrl) > -1) {
          this.agentEntryMasterService.agreementDetailsForm.get(ctrl).clearValidators();
          this.agentEntryMasterService.agreementDetailsForm.get(ctrl).updateValueAndValidity();
          this.agentEntryMasterService.agreementDetailsForm.get('reasonForNonAvailability')?.reset();
        }
      }
    } else {
      for (const ctrl in this.agentEntryMasterService.agreementDetailsForm.controls) {
        if (ctrls.indexOf(ctrl) > -1) {
          this.agentEntryMasterService.agreementDetailsForm.get('reasonForNonAvailability')?.clearValidators();
          this.agentEntryMasterService.agreementDetailsForm.get('reasonForNonAvailability')?.updateValueAndValidity();
          this.agentEntryMasterService.agreementDetailsForm.get(ctrl).reset();
        }
      }
    }
    this.detail();
  }
  //     for (const ctrl in this.agentEntryMasterService.agreementDetailsForm.controls) {
  //       if (ctrls.indexOf(ctrl) > -1) {
  //         if (!this.agentEntryMasterService.agreementDetailsForm.get(ctrl).valid) {
  //           this.agentEntryMasterService.agreementDetailsForm.get('reasonForNonAvailability')?.clearValidators();
  //           this.agentEntryMasterService.agreementDetailsForm.get('reasonForNonAvailability')?.updateValueAndValidity();
  //           this.agentEntryMasterService.agreementDetailsForm.get(ctrl).setValidators(Validators.required);
  //           this.agentEntryMasterService.agreementDetailsForm.get(ctrl).updateValueAndValidity();
  //         }
  //       }
  //     }
  //   } else {
  //     const ctrlname = ['reasonForNonAvailability'];
  //     for (const ctrl in this.agentEntryMasterService.agreementDetailsForm.controls) {
  //       if (ctrlname.indexOf(ctrl) > -1) {
  //         if (!this.agentEntryMasterService.agreementDetailsForm.get(ctrl).valid) {
  //           this.agentEntryMasterService.agreementDetailsForm.get(ctrl).setValidators(Validators.required);
  //           this.agentEntryMasterService.agreementDetailsForm.get(ctrl).updateValueAndValidity();
  //         }
  //       }
  //     }
  //     const ctrlsnew = ['typeOfAgreement', 'dateOfAgreement', 'validity', 'autoRenewel', 'dateOfExpiry', 'reminderForRenewel'];
  //     for (const ctrl in this.agentEntryMasterService.agreementDetailsForm.controls) {
  //       if (ctrlsnew.indexOf(ctrl) > -1) {
  //         if (!this.agentEntryMasterService.agreementDetailsForm.get(ctrl).valid) {
  //           this.agentEntryMasterService.agreementDetailsForm.get(ctrl).clearValidators();
  //           this.agentEntryMasterService.agreementDetailsForm.get(ctrl).updateValueAndValidity();
  //         }
  //       }
  //     }
  //   }
  //   // this.detail();
  // }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }
  openUploadDoc(event: any) {
    // if (this.agentEntryMasterService.agreementDocumentList.filter( x => x.fileName === event.target.files[0].name).length > 0) {
    //   this.showTopCenter('warn', 'Failure Message', 'File Name has been already exist');
    // } else {
    //   const agreementDocument = new AgreementDocument();
    //   agreementDocument.agreementDocId = 0;
    //   agreementDocument.fileName = event.target.files[0].name;
    //   agreementDocument.document = event.target.files[0];
    //   this.agentEntryMasterService.agreementDocumentList.push(agreementDocument);
    // }

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < event.target.files.length; i++) {
      const agreementDocument = new AgreementDocument();
      agreementDocument.fileName = event.target.files[i].name;
      agreementDocument.document = event.target.files[i];
      agreementDocument.agreementDocId = 0;
      agreementDocument.type = 'clientAgreement';
      if (this.agentEntryMasterService.agreementDocumentList.filter(x => x.fileName === agreementDocument.fileName).length > 0) {
        this.showTopCenter('warn', 'Failure Message', 'File already exists');
      } else {
        this.agentEntryMasterService.agreementDocumentList.push(agreementDocument);
      }
    }
  }

  base64ToArrayBuffer(base64: any) {
    const binaryString = window.atob(base64);
    const binaryLen = binaryString.length;
    const bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i++) {
      const ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  }
  saveByteArray(filename, byte) {
    const blob = new Blob([byte], { type: 'application/octet-stream' });
    if (window.navigator && (window.navigator as any).msSaveOrOpenBlob) { // for IE
      (window.navigator as any).msSaveOrOpenBlob(blob, filename);
    } else { // for Non-IE (chrome, firefox etc.)
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display:none;');
      const csvUrl = URL.createObjectURL(blob);
      a.href = csvUrl;
      a.download = filename;
      a.click();
      a.remove();
    }
  }
  downloadFile(data, filename, docId) {
    if (docId > 0) {
      this.agentEntryMasterService.getDocumentDetail(docId).subscribe(resp => {
        if (resp.document) {
          const sampleArr = this.base64ToArrayBuffer(resp.document);
          this.saveByteArray(filename, sampleArr);
        } else {
          alert('file does not exists');
        }
      });
    } else {
      const blob = new Blob([data.document], { type: 'application/octet-stream' });
      if (window.navigator && (window.navigator as any).msSaveOrOpenBlob) { // for IE
        (window.navigator as any).msSaveOrOpenBlob(blob, filename);
      } else { // for Non-IE (chrome, firefox etc.)
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display:none;');
        const csvUrl = URL.createObjectURL(blob);
        a.href = csvUrl;
        a.download = filename;
        a.click();
        a.remove();
      }
    }
  }
  detail() {
    if (this.agentEntryMasterService.agreementDetailsForm.get('agreementAvailability')?.value === true) {
      const ctrls = ['typeOfAgreement', 'dateOfAgreement', 'validity', 'reminder', 'autoRenewel', 'dateOfExpiry', 'reminderForRenewel'];
      for (const ctrl in this.agentEntryMasterService.agreementDetailsForm.controls) {
        if (ctrls.indexOf(ctrl) > -1) {
          this.agentEntryMasterService.agreementDetailsForm.get('reasonForNonAvailability')?.clearValidators();
          this.agentEntryMasterService.agreementDetailsForm.get('reasonForNonAvailability')?.updateValueAndValidity();
          if (!this.agentEntryMasterService.agreementDetailsForm.get(ctrl).value) {
            this.agentEntryMasterService.agreementDetailsForm.get(ctrl).setValidators(Validators.required);
            this.agentEntryMasterService.agreementDetailsForm.get(ctrl).updateValueAndValidity();
          }
          if (ctrl === 'typeOfAgreement') {
            if (this.typeOfAgreementName === this.commonService.OTHERS) {
              this.agentEntryMasterService.agreementDetailsForm.get('remarks')?.setValidators(Validators.required);
              this.agentEntryMasterService.agreementDetailsForm.get('remarks')?.updateValueAndValidity();
            } else {
              this.agentEntryMasterService.agreementDetailsForm.get('remarks')?.clearValidators();
              this.agentEntryMasterService.agreementDetailsForm.get('remarks')?.updateValueAndValidity();
            }
          }
          if (ctrl === 'autoRenewel') {
            if (this.agentEntryMasterService.agreementDetailsForm.get(ctrl).value === true) {
              this.agentEntryMasterService.agreementDetailsForm.get('autoRenewelPeriod')?.setValidators(Validators.required);
              this.agentEntryMasterService.agreementDetailsForm.get('autoRenewelPeriod')?.updateValueAndValidity();
            } else {
              this.agentEntryMasterService.agreementDetailsForm.get('autoRenewelPeriod')?.clearValidators();
              this.agentEntryMasterService.agreementDetailsForm.get('autoRenewelPeriod')?.updateValueAndValidity();
            }
          }
        }
      }
    }
    if (this.agentEntryMasterService.agreementDetailsForm.get('agreementAvailability')?.value === false) {
      const ctrlname = ['reasonForNonAvailability'];
      for (const ctrl in this.agentEntryMasterService.agreementDetailsForm.controls) {
        if (ctrlname.indexOf(ctrl) > -1) {
          if (!this.agentEntryMasterService.agreementDetailsForm.get(ctrl).value) {
            this.agentEntryMasterService.agreementDetailsForm.get(ctrl).setValidators(Validators.required);
            this.agentEntryMasterService.agreementDetailsForm.get(ctrl).updateValueAndValidity();
            // return;
          }
        }
      }
      const ctrls = ['typeOfAgreement', 'remarks', 'dateOfAgreement', 'validity', 'reminder',
        'autoRenewel', 'dateOfExpiry', 'autoRenewelPeriod', 'reminderForRenewel'];
      for (const ctrl in this.agentEntryMasterService.agreementDetailsForm.controls) {
        if (ctrls.indexOf(ctrl) > -1) {
          if (!this.agentEntryMasterService.agreementDetailsForm.get(ctrl).valid) {
            this.agentEntryMasterService.agreementDetailsForm.get(ctrl).clearValidators();
            this.agentEntryMasterService.agreementDetailsForm.get(ctrl).updateValueAndValidity();
            // return;
          }
        }
      }
    }
  }
  removeDocument(index: any) {
    this.agentEntryMasterService.agreementDocumentList.splice(index, 1);
    // this.agentEntryMasterService.agreementDetailsForm.removeControl('supportingDocument');
  }
}
export class AgreementDoc {
  fileName: string;
  document1: File;
}
