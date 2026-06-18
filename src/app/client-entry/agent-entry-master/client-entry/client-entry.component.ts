import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AgentEntryMasterService } from '../../../common-methods/services/agent-entry-master.service';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { ClientMaster, ClientEntry, ClientName, ClientLogoTransVm } from '../../../common-methods/models/agentEntryMaster';
import { AgentEntryMasterComponent } from '../agent-entry-master.component';
import { Validators } from '@angular/forms';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { ScrollToErrorDirective } from 'src/app/common-methods/directive/scroll-to-error.directive';
import { MessageService } from 'primeng/api';
@Component({
  standalone: false,
  selector: 'app-client-entry',
  templateUrl: './client-entry.component.html',
  styleUrls: ['./client-entry.component.css']
})
export class ClientEntryComponent implements OnInit {
  @Output() nextStep = new EventEmitter<void>();
  acckeyup = false;
  clientMaster: ClientMaster;
  cliententry: ClientEntry;
  acclist: any;
  accmanager: any[] = [];
  panFlag = false;
  userData: any;
  accManagerControls!: AutoCompleteDropDown;
  constructor(public agentEntryMasterService: AgentEntryMasterService, public agent1: AgentEntryMasterComponent,
    // tslint:disable-next-line: align
    public masterService: MasterService, public common: CommonService, public scroll: ScrollToErrorDirective,
              private messageService: MessageService) {
  }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.accManagerControls = new AutoCompleteDropDown('Client Account Manager', 'clientAccountManager', 'userId', 'firstName',
      this.acclist, '', this.agentEntryMasterService.clientEntryForm, false, false, true);
    this.getClientMasterDetails();
    if (this.agentEntryMasterService.clientEntryForm.get('indianClientFlag')?.value === true) {
      this.agentEntryMasterService.clientEntryForm.get('formatFlag')?.enable();
    } else {
     this.agentEntryMasterService.clientEntryForm.get('formatFlag')?.disable();
    }
  }
  openLogoDoc(event, name) {
    let boole = this.logoType(name).includes('Signature');
    if (!name || (name && boole && !this.agentEntryMasterService.clientEntryForm.get('signatureLookUpId')?.value)) {
       this.showTopCenter('warn', 'Failure Message', 'Please Select ' + (boole ? 'Signature' : 'Document') + ' Type');
       return;
    }
    this.uploadLogoDoc(event);
  }
  uploadLogoDoc(event: any) {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < event.target.files.length; i++) {
      const clientLogo: ClientLogoTransVm = {
        logoTransId: 0,
        logoDocTransId: 0,
        logoLookupId: this.agentEntryMasterService.clientEntryForm.get('docType')?.value,
        isSignature: this.agentEntryMasterService.clientEntryForm.get('signatureLookUpId')?.value > 0 ? true : false,
        signatureLookupId: this.agentEntryMasterService.clientEntryForm.get('signatureLookUpId')?.value,
        fileName: event.target.files[i].name,
        filePath: '',
        document: event.target.files[i],
        active: true,
        loggedIn: this.userData.userId
      };
      const val = this.agentEntryMasterService.clientEntryForm.controls.clientLogo.value;
      let value;
      clientLogo.isSignature === true ? value = val.filter(x => x.signatureLookupId === clientLogo.signatureLookupId).length > 0 :
      value = val.filter(x => x.logoLookupId === clientLogo.logoLookupId).length > 0;
      if (value) {
        this.agentEntryMasterService.clientEntryForm.get('supportingDocument')?.setValue(null);
        this.showTopCenter('warn', 'Failure Message', ((clientLogo.isSignature === true ? 'Signature' : 'Document') + ' Type already exists'));
      } else {
        this.agentEntryMasterService.clientEntryForm.controls.clientLogo.value.push(clientLogo);
      }
    }
  }
  removeLogoDoc(index: any) {
    if (index > -1) {
      this.agentEntryMasterService.clientEntryForm.controls.clientLogo.value.splice(index, 1);
    }
  }
  downloadLogoDoc(data: any) {
    if (data.logoTransId > 0) {
      this.common.downloadDocument(data.logoTransId, data.document, data.fileName);
    } else {
      this.common.saveByteArray(data.fileName, data.document);
    }
  }
  showTopCenter(level: string, info: string, message: string) {
    this.messageService.add({ severity: level, summary: info, detail: message });
  }
  supDocTypeChange(event: any) {
    const value = this.agentEntryMasterService.clientEntryForm.controls.clientLogo.value;
    if (!(this.logoType(event.value).includes('Signature'))) {
      this.agentEntryMasterService.clientEntryForm.get('signatureLookUpId')?.setValue(0);
      // if (value && value.length > 0 && value.some(x => x.logoLookupId === event.value)) {
      //   this.showTopCenter('warn', 'Failure Message', 'Document Type already exists');
      // }
    }
  }
  signTypeChange(event: any) {
    // const value = this.agentEntryMasterService.clientEntryForm.controls.clientLogo.value;
    // if (value && value.length > 0 && value.some(x => x.signatureLookupId === event.value)) {
    //   this.showTopCenter('warn', 'Failure Message', 'Document Type already exists');
    // }
  }
  logoType(id: any) {
    if (this.clientMaster && this.clientMaster.logoType) {
    const value = id ? this.clientMaster.logoType.find(x => x.lookUpId === id).lookUpName : '';
    return value;
    }
  }
  signatureType(id: any) {
    if (this.clientMaster && this.clientMaster.signatureType) {
      const value = id ? this.clientMaster.signatureType.find(x => x.lookUpId === id).lookUpName : '';
      return value;
    }
  }
  scrollToTop() {
    setTimeout(() => {
      this.scroll.scrollToError();
    }, 50);
    this.agentEntryMasterService.clientEntryForm.markAllAsTouched();
    // const elements = document.querySelectorAll('mat-form-field.ng-invalid');
    // if (elements.length === 0) {
    //   const element = document.querySelectorAll('mat-form-field.ng-valid');
    //   element[0].scrollIntoView(false);
    // }
    // if (elements.length > 0) {
    //   elements[0].scrollIntoView(false);
    // }
  }
  getClientMasterDetails() {
    this.agentEntryMasterService.getClientMasterDetails(this.userData.teamId, this.userData.subTeamId).subscribe(res => {
      if (res) {
        this.clientMaster = res;
        if (this.agentEntryMasterService.clientid === 0) {
          this.agentEntryMasterService.clientEntryForm.get('billingRule')?.setValue(this.clientMaster.billingRule[0].lookUpId);
          this.billingRule(this.clientMaster.billingRule[0].lookUpId);
          this.agentEntryMasterService.clientEntryForm.get('billingCycle')?.setValue(this.clientMaster.billingCycle[0].lookUpId);
          this.billingCycle(this.clientMaster.billingCycle[0].lookUpId);
        }
        const val = this.agentEntryMasterService.clientEntryForm.value.clientColorStatus;
        if (val && val.length > 0) {
          // tslint:disable-next-line: prefer-const
          let compList: any[] = [];
          val.forEach(ele => {
            const dataList = this.clientMaster.colorStatus.find(x => x.lookUpId === ele.lookUpId);
            if (dataList) {
              dataList.contactId = ele.contactId;
              compList.push(dataList);
            }
          });
          this.agentEntryMasterService.clientEntryForm.get('clientColorStatus')?.setValue(compList);
        }
        this.acclist = this.clientMaster.accountManager;
        this.acclist.forEach(element => {
          element.firstName = element.lastName ? (element.firstName + ' ' + element.lastName) : element.firstName;
        });
        this.accManagerControls =
          new AutoCompleteDropDown('Client Account Manager', 'clientAccountManager', 'userId', 'firstName',
            this.acclist, '', this.agentEntryMasterService.clientEntryForm, false, false, true);
        this.agentEntryMasterService.clientCreationLookupValues = res.clientCreationLookupValues;
        // console.log(this.agentEntryMasterService.clientCreationLookupValues, 'this.clientMaster');
        this.indAbdValidation();
        this.addressValidation(false);
        // if (this.agentEntryMasterService.clientEntryForm.get('indianClientFlag')?.value === false) {
        //   this.onTypeChange();
        // }
        if (this.agentEntryMasterService.clientid > 0 && this.clientMaster.billingCycle.length > 0) {
          this.billingCycle(this.agentEntryMasterService.bcycleid);
        }
        if (this.agentEntryMasterService.clientid > 0 && this.clientMaster.billingType.length > 0) {
          this.billingType(this.agentEntryMasterService.btypeid);
        }
        if (this.agentEntryMasterService.clientid > 0 && this.clientMaster.billingRule.length > 0) {
          this.billingRule(this.agentEntryMasterService.bruleid);
        }
        // if (this.agentEntryMasterService.clientid > 0 && this.clientMaster.dssiOwner.length > 0) {
        //   this.ownerChange(this.agentEntryMasterService.ownerid);
        // }
        if (this.agentEntryMasterService.clientid > 0 && this.clientMaster.finalReportType.length > 0) {
          this.reportType(this.agentEntryMasterService.reportid);
        }
        if (this.agentEntryMasterService.clientid > 0 && this.clientMaster.accountManager.length > 0) {
          this.managerChange(this.agentEntryMasterService.clientEntryForm.get('clientAccountManager')?.value);
        }
      }
    }, err => {
      console.error(err);
    }, () => {
    });
  }
  checkValidValue() {
    const value = this.agentEntryMasterService.clientEntryForm.get('retentionPolicyDays')?.value;
    if (value === '' || value == null) {
    } else if (value < 90) {
      this.agentEntryMasterService.clientEntryForm.get('retentionPolicyDays')?.setErrors({ incorrect: true });
    } else {
      this.agentEntryMasterService.clientEntryForm.get('retentionPolicyDays')?.setErrors(null);
    }
  }
  billingCycle(e: any) {
    if (e) {
      const billingName = this.clientMaster.billingCycle.filter(x => x.lookUpId === e);
      if (billingName.length !== 0) {
        const billName = billingName[0].lookUpName;
        this.agentEntryMasterService.clientEntryForm.get('billingCycleName')?.setValue(billName);
      }
    }
  }
  billingRule(e: any) {
    if (e) {
      const billingRuleName = this.clientMaster.billingRule.filter(x => x.lookUpId === e);
      if (billingRuleName.length !== 0) {
        const billRuleName = billingRuleName[0].lookUpName;
        this.agentEntryMasterService.clientEntryForm.get('billingRuleName')?.setValue(billRuleName);
      } else {
        this.agentEntryMasterService.clientEntryForm.get('billingRule')?.setValue(null);
      }
    }
  }
  billingType(e: any) {
    if (e) {
      const billingTypeName = this.clientMaster.billingType.filter(x => x.lookUpId === e);
      const billTypeName = billingTypeName[0].lookUpName;
      this.agentEntryMasterService.clientEntryForm.get('billingTypeName')?.setValue(billTypeName);
    }
  }
  reportType(e: any) {
    if (e) {
      const reportTypeName = this.clientMaster.finalReportType.filter(x => x.lookUpId === e);
      const repTypeName = reportTypeName[0].lookUpName;
      this.agentEntryMasterService.clientEntryForm.get('reportTypeName')?.setValue(repTypeName);
    }
  }
  // ownerChange(e: any) {
  //   if (e) {
  //     const ownerName = this.clientMaster.dssiOwner.filter(x => x.userId === e);
  //     if (ownerName.length !== 0) {
  //     const owner = ownerName[0].firstName + ' ' + ownerName[0].lastName;
  //     this.agentEntryMasterService.clientEntryForm.get('ownerName')?.setValue(owner);
  //    }
  //   }
  // }
  managerChange(e: any) {
    if (e) {
      // this.acckeyup = false;
      // const managerName = this.clientMaster.accountManager.filter(x => x.userId === e);
      // if (managerName.length !== 0) {
      //   const manager = managerName[0].firstName + ' ' + managerName[0].lastName;
      //   this.agentEntryMasterService.clientEntryForm.get('managerName')?.setValue(manager);
      // }
      this.agentEntryMasterService.clientEntryForm.get('managerName')?.setValue(this.acclist.find(x => x.userId === e).firstName);
    }
  }
  checkClientName(value: any) {
    if (value) {
      const client = new ClientName();
      client.clientId = this.agentEntryMasterService.clientid;
      client.clientName = value;
      this.agentEntryMasterService.checkClientName(client).subscribe(res => {
        if (res) {
          this.agentEntryMasterService.clientEntryForm.get('clientName')?.setErrors({ incorrect: true });
        } else {
          this.agentEntryMasterService.clientEntryForm.get('clientName')?.setErrors(null);
        }
      });
    }
  }
  checkSite(event: any) {
    if (this.agentEntryMasterService.clientEntryForm.get('siteCreationFlag')?.value === false) {
      if (!this.agentEntryMasterService.clientEntryForm.get('gstNumber')?.value) {
        this.agentEntryMasterService.clientEntryForm.get('gstNumber')?.setValidators([Validators.minLength(15), Validators.required]);
        this.agentEntryMasterService.clientEntryForm.get('gstNumber')?.updateValueAndValidity();
      } else {
        this.agentEntryMasterService.clientEntryForm.get('gstNumber')?.clearValidators();
        this.agentEntryMasterService.clientEntryForm.get('gstNumber')?.updateValueAndValidity();
      }
    } else {
      this.agentEntryMasterService.clientEntryForm.get('gstNumber')?.clearValidators();
      this.agentEntryMasterService.clientEntryForm.get('gstNumber')?.updateValueAndValidity();
      this.agentEntryMasterService.clientEmailConfig = [];
    }
  }
  clientValidsubmit() {
    const controlNames = ['clientName', 'address1', 'country', 'state', 'city', 'zipCode', 'contactPerson', 'phoneNumber',
      'emailId', 'refNoPrefix', 'billingCycle', 'billingRule', 'billingType', 'retentionPolicyDays', 'applicantIdColumnName',
      'finalReportType', 'toEmailId', 'ccEmailID', 'accMobile', 'tatCount', 'clientAccountManager'];
    for (const ctrl in this.agentEntryMasterService.clientEntryForm.controls) {
      if (controlNames.indexOf(ctrl) > -1) {
        if (!this.agentEntryMasterService.clientEntryForm.get(ctrl).value) {
          this.agentEntryMasterService.clientEntryForm.get(ctrl).setValidators(Validators.required);
          this.agentEntryMasterService.clientEntryForm.get(ctrl).updateValueAndValidity();
        } else {
          this.agentEntryMasterService.clientEntryForm.get(ctrl).clearValidators();
          this.agentEntryMasterService.clientEntryForm.get(ctrl).updateValueAndValidity();
        }
      }
    }
  }
  checkClientRefPrefixNo(value: any) {
    if (value && this.agentEntryMasterService.clientEntryForm.get('refNoPrefix')?.valid) {
      this.agentEntryMasterService.checkClientRefPrefixNo(value, this.agentEntryMasterService.clientid).subscribe(res => {
        if (res) {
          this.agentEntryMasterService.clientEntryForm.get('refNoPrefix')?.setErrors({ incorrect: true });
        } else {
          this.agentEntryMasterService.clientEntryForm.get('refNoPrefix')?.setErrors(null);
        }
      });
    }
  }
  get displayaccFn() {
    const resourceaccNew = (acc) => {
      if (acc == null || acc === undefined) {
        return null;
      } else {
        if (acc && this.accmanager && this.accmanager.length > 0) {
          acc = this.accmanager.find(x => x.userId === acc);
          if (acc) {
            if (acc.firstName + ' ' + acc.lastName) {
              return acc.firstName + ' ' + acc.lastName;
            }
          }
        } else {
          return null;
        }
      }
    };
    return resourceaccNew;
  }
  selectacc(result: any): void {
    let accuserid = this.agentEntryMasterService.clientEntryForm.get('clientAccountManager')?.value;
    if (typeof result === 'number') {
      accuserid = result;
    } else {
      accuserid = result.accuserid;
    }
    if (accuserid) {
      this.acckeyup = false;
      const accNames = this.acclist.filter(x => x.userId === result);
      if (accNames.length !== 0) {
        const name = accNames[0].firstName + ' ' + accNames[0].lastName;
        const id = accNames[0].userId;
        this.agentEntryMasterService.clientEntryForm.get('clientAccountManager')?.setValue(id);
        this.agentEntryMasterService.clientEntryForm.get('managerName')?.setValue(name);
      }
    }
  }
  accItems(value: any) {
    if (!value) { this.assignResourceaccCopy(); }
    if (value) {
      this.accmanager = Object.assign([], this.acclist).filter(
        item => ((item.firstName.toLowerCase() + ' ' + item.lastName.toLowerCase()).indexOf(value.toLowerCase()) > -1) ||
          item.lastName.toLowerCase().indexOf(value.toLowerCase()) > -1 || item.firstName.toLowerCase().indexOf(value.toLowerCase()) > -1);
    }
  }
  assignResourceaccCopy() {
    this.accmanager = Object.assign([], this.acclist);
  }
  accKeyupFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        const resource = this.accmanager.filter(e =>
          e.firstName.toLowerCase() === value.toLowerCase() || e.lastName.toLowerCase() === value.toLowerCase());
        if (resource.length > 0) {
          this.acckeyup = false;
          this.selectacc(resource[0].userId);
        } else {
          this.acckeyup = true;
        }
      } else {
        this.acckeyup = false;
      }
    }
  }
  checkValidacc() {
    const value = this.agentEntryMasterService.clientEntryForm.get('clientAccountManager')?.value;
    if (value === '' || value == null) {
    } else if (this.acckeyup) {
      // tslint:disable-next-line:object-literal-key-quotes
      this.agentEntryMasterService.clientEntryForm.get('clientAccountManager')?.setErrors({ 'incorrect': true });
    } else {
      this.agentEntryMasterService.clientEntryForm.get('clientAccountManager')?.setErrors(null);
    }
  }
  onTypeChange(e: any) {
    this.agentEntryMasterService.clientEntryForm.get('retentionPolicyDays')?.setValue(null);
    this.agentEntryMasterService.clientEntryForm.get('applicantIdColumnName')?.setValue(null);
    this.agentEntryMasterService.clientEntryForm.get('refNoPrefix')?.setValue(null);
    if (this.agentEntryMasterService.clientEntryForm.get('siteCreationFlag')?.value === false) {
      this.agentEntryMasterService.clientEntryForm.get('gstNumber')?.setValue(null);
      // this.agentEntryMasterService.clientEntryForm.get('gstNumber')?.clearValidators();
      // this.agentEntryMasterService.clientEntryForm.get('gstNumber')?.updateValueAndValidity();
    }
    this.indAbdValidation();
    this.addressValidation(false);
    if (e !== true) {
      this.agentEntryMasterService.clientEntryForm.get('formatFlag')?.disable();
    } else {
      this.agentEntryMasterService.clientEntryForm.get('formatFlag')?.enable();
    }
  }
  addressValidation(flag: any) {
    if (flag === true) {
      this.agentEntryMasterService.clientEntryForm.get('address')?.markAllAsTouched();
    }
    if (this.agentEntryMasterService.clientEntryForm.get('indianClientFlag')?.value === true) {
      if (!this.agentEntryMasterService.clientEntryForm.get('address.postalCode')?.value) {
        this.agentEntryMasterService.clientEntryForm.get('address.postalCode')?.setValidators(Validators.required);
        this.agentEntryMasterService.clientEntryForm.get('address.postalCode')?.updateValueAndValidity();
      } else {
        if (this.agentEntryMasterService.clientEntryForm.get('address.postalCode')?.valid) {
          this.agentEntryMasterService.clientEntryForm.get('address.postalCode')?.clearValidators();
          this.agentEntryMasterService.clientEntryForm.get('address.postalCode')?.updateValueAndValidity();
        }
      }
    } else {
      this.agentEntryMasterService.clientEntryForm.get('address.postalCode')?.clearValidators();
      this.agentEntryMasterService.clientEntryForm.get('address.postalCode')?.updateValueAndValidity();
    }
  }
  indAbdValidation() {
    const controlNames = ['retentionPolicyDays', 'applicantIdColumnName', 'refNoPrefix'];
    for (const ctrl in this.agentEntryMasterService.clientEntryForm.controls) {
      if (controlNames.indexOf(ctrl) > -1) {
        if (this.agentEntryMasterService.clientEntryForm.get('indianClientFlag')?.value === true) {
          if (!this.agentEntryMasterService.clientEntryForm.get(ctrl).value) {
            // if (ctrl === 'retentionPolicyDays') {
            //   this.agentEntryMasterService.clientEntryForm.get(ctrl).setValidators(Validators.required);
            // } else if (ctrl === 'applicantIdColumnName') {
            //   this.agentEntryMasterService.clientEntryForm.get(ctrl).setValidators([Validators.minLength(3), Validators.required]);
            // } else if (ctrl === 'refNoPrefix') {
            //   this.agentEntryMasterService.clientEntryForm.get(ctrl).setValidators(Validators.
            //     compose([Validators.required, Validators.pattern(/^[A-Za-z]{2}[-]+[A-Za-z]{3}[-]$/), Validators.max(7)]));
            // }
            if (ctrl === 'applicantIdColumnName') {
              this.agentEntryMasterService.clientEntryForm.get(ctrl).setValidators([Validators.minLength(3), Validators.required]);
            } else {
              this.agentEntryMasterService.clientEntryForm.get(ctrl).setValidators(Validators.required);
            }
            this.agentEntryMasterService.clientEntryForm.get(ctrl).updateValueAndValidity();
          } else {
            // if (ctrl === 'retentionPolicyDays') {
            //   this.agentEntryMasterService.clientEntryForm.get(ctrl).setValidators(Validators.required);
            // } else if (ctrl === 'applicantIdColumnName') {
            //   this.agentEntryMasterService.clientEntryForm.get(ctrl).setValidators([Validators.minLength(3), Validators.required]);
            // } else if (ctrl === 'refNoPrefix') {
            //   this.agentEntryMasterService.clientEntryForm.get(ctrl).setValidators(Validators.
            //     compose([Validators.required, Validators.pattern(/^[A-Za-z]{2}[-]+[A-Za-z]{3}[-]$/), Validators.max(7)]));
            // }
            if (this.agentEntryMasterService.clientEntryForm.get(ctrl).valid) {
              this.agentEntryMasterService.clientEntryForm.get(ctrl).clearValidators();
              this.agentEntryMasterService.clientEntryForm.get(ctrl).updateValueAndValidity();
            }
          }
        } else {
          this.agentEntryMasterService.clientEntryForm.get(ctrl).clearValidators();
          this.agentEntryMasterService.clientEntryForm.get(ctrl).updateValueAndValidity();
        }
      }
    }
  }
  checkChange(e: any) {
    if (e === true) {
      this.agentEntryMasterService.clientEntryForm.get('refNoPrefix')?.setValidators(Validators.compose([Validators.required,
      Validators.pattern(/^[A-Za-z]{2}[-]+[A-Za-z]{3}[-]$/), Validators.max(7)]));
      this.agentEntryMasterService.clientEntryForm.get('refNoPrefix')?.updateValueAndValidity();
    } else {
      this.agentEntryMasterService.clientEntryForm.get('refNoPrefix')?.clearValidators();
      this.agentEntryMasterService.clientEntryForm.get('refNoPrefix')?.updateValueAndValidity();
    }
  }
}
