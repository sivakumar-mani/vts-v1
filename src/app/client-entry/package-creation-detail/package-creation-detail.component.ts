import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormArray, UntypedFormControl, UntypedFormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../common-methods/services/auth.service';
import { AgentEntryMasterService } from '../../common-methods/services/agent-entry-master.service';
import { Package, PackSubCompVm, PackComp, PackageDocument } from '../../common-methods/models/package';
import { Router } from '@angular/router';
import { MasterService } from '../../common-methods/services/master.service';
import { SharedService } from '../../common-methods/services/shared.service';
import { DatePipe } from '@angular/common';
import { CommonService } from '../../common-methods/services/common.service';

import { MatDialog } from '@angular/material/dialog';
import { MailTemplate, MailAttachment, MailData } from 'src/app/common-methods/mail-templates/mail-template';
import { PackageCheck } from 'src/app/common-methods/models/agentEntryMaster';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table'

@Component({
  standalone: false,
  selector: 'app-package-creation-detail',
  templateUrl: './package-creation-detail.component.html',
  styleUrls: ['./package-creation-detail.component.css'],
  // providers: [DatePipe]
})
export class PackageCreationDetailComponent implements OnInit {
  componentDetail: UntypedFormArray;
  packagefrmgroup: UntypedFormGroup;
  frmlenth = 1;
  yrFlag: boolean;
  componentfilterList: any[] = [];
  componentList: any[] = [];
  compKeyup = false;
  package: Package = new Package();
  userdata: any;
  clientlist: any[] = [];
  clientflterlist: any[] = [];
  disableFlag = true;
  clientname = new UntypedFormControl('', Validators.required);
  billingKeyup = false;
  packageList: any[] = [];
  clientId: number;
  today: Date;
  addOrEdit: string;
  btnSave = true;
  btnReset = true;
  btnBack = true;
  btnSaveDisabled = false;
  tooTip = 'Save';
  routePath = 'Client / Package Creation';
  subComponentList: any[] = [];
  subComponentfilterlist: any[] = [];
  subComponentkeyUp = false;
  componentFlag;
  columnName = [
    { field: 'componentName', header: 'Component' },
    { field: 'subComponentName', header: 'Sub Component' },
    { field: 'noOfComp', header: 'No of Components' },
    { field: 'tatDays', header: 'TAT Days' },
    { field: 'noofyear', header: 'No Of Year' },
  ];
  totalpages: number;
  @ViewChild('dt', { static: false }) dt!: Table;
  currentPage = 1;
  tempCurrentPage = 1;
  mspPrice = 0;
  nrpPrice = 0;
  discountMsp = 0;
  discountNrp: any;
  @ViewChild('feesConfirmation', { static: false }) feesConfirmation;
  dialogRef: any;
  flagFee: boolean;
  packageFeeDocumentList: any[] = [];
  packApproveList: any[] = [];
  fileNameList: any[] = [];
  mailDocList: any[];
  discountMsp1 = 0;
  existItem: any[] = [];
  siteList: [];
  constructor(private formBuilder: UntypedFormBuilder, public authService: AuthService, private agentEntryService: AgentEntryMasterService,
    private router: Router, private masterService: MasterService, private saharedService: SharedService,
    public screening: ScreeningService, public common: CommonService, private datePipe: DatePipe, public dialog: MatDialog, private messageService: MessageService) { }

  clearFormArray = (formArray: UntypedFormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }

  ngOnInit() {
    this.today = new Date();
    this.userdata = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.initform();
    this.getClient();
    this.GetComponetDetails(this.authService.packClientId);
    if (this.authService.packageId > 0) {
      this.getPackageDetailById(this.authService.packageId);
    }
    this.getToday();
    if (this.authService.addOrEdit) {
      this.addOrEdit = this.authService.addOrEdit;
      if (this.addOrEdit === 'Edit') {
        this.tooTip = 'Update';
      } else {
        this.tooTip = 'Save';
      }
    } else {
      this.addOrEdit = 'Add';
    }
  }

  public getSiteName(clientId: number) {
    this.siteList = [];
    this.screening.getSiteName(clientId).subscribe((res: any) => {
      if (res) {
        this.siteList = res;
        if (this.package != null && this.package.siteDetails.length > 0) {
          this.packagefrmgroup.controls.siteId.setValue(this.package.siteDetails);
        }
      }
    })
  }
  initform(): void {
    this.packagefrmgroup = this.formBuilder.group({
      packageId: new UntypedFormControl(0),
      clientId: new UntypedFormControl('', Validators.required),
      packageName: new UntypedFormControl(null, Validators.compose([Validators.required, Validators.minLength(3)])),
      fees: new UntypedFormControl('', Validators.required),
      effectiveDate: new UntypedFormControl(),
      effectiveReason: new UntypedFormControl(''),
      clientname: new UntypedFormControl(''),
      packComp: this.formBuilder.array([this.initconponentfrm()]),
      FileName: new UntypedFormControl(),
      tatDays: new UntypedFormControl('', Validators.required),
      packFeeStatusFlag: new UntypedFormControl(''),
      reason: new UntypedFormControl(''),
      packFeeApprovalFlag: new UntypedFormControl(''),
      componentFeeDocument: new UntypedFormControl(''),
      currentMSP: new UntypedFormControl(''),
      currentNRP: new UntypedFormControl(''),
      PackFeeId: new UntypedFormControl(0),
      nofoyear: new UntypedFormControl(),
      siteId: new UntypedFormControl(null),
    });
  }
  initdocfrm(): UntypedFormGroup {
    return this.formBuilder.group({
      fileName: new UntypedFormControl()
    });
  }
  initconponentfrm(): UntypedFormGroup {
    return this.formBuilder.group({
      packageId: new UntypedFormControl(0),
      componentId: new UntypedFormControl('', Validators.required),
      noOfComp: new UntypedFormControl(),
      noofyear: new UntypedFormControl(),
      packageCompId: new UntypedFormControl(0),
      packageSubCompId: new UntypedFormControl(0),
      subComponentId: new UntypedFormControl('', Validators.required),
      componentName: new UntypedFormControl(0),
      subComponentName: new UntypedFormControl(0),
      msp: new UntypedFormControl(),
      nrp: new UntypedFormControl(),
      tatDays: new UntypedFormControl('', Validators.required),
    });
  }

  GetComponetDetails(clientId: any) {
    if (clientId > 0) {
      this.agentEntryService.GetPackageComponent(clientId).subscribe(res => {
        if (res) {
          this.componentList = res;
        }
      });
    }
  }
  clientKeyupFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        const client = this.componentfilterList.filter(e =>
          e.componentName.toLowerCase() === value.toLowerCase());
        if (client.length > 0) {
          this.compKeyup = true;
        } else {
          this.compKeyup = true;
        }
      } else {
        this.compKeyup = false;
      }
    }
  }
  get displayclientFn() {
    const clientNew = (comp) => {
      if (comp == null || comp === undefined) {
        return null;
      } else {
        if (comp && this.componentfilterList && this.componentfilterList.length > 0) {
          comp = this.componentfilterList.filter(x => x.componentId === comp);
          if (comp.length > 0) {
            return comp[0].componentName;
          }
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
      this.componentfilterList = Object.assign([], this.componentList).filter(
        item => ((item.componentName.toLowerCase().indexOf(value.toLowerCase()) > -1)));
    }
  }

 assignResourceCopy() {
  this.componentfilterList = Object.assign([], this.componentList);
  let data: any[] = [];

  if (this.subComponentList.length > 0) {
    data = ((this.packagefrmgroup.controls['packComp'] as UntypedFormArray).value)
      .filter(e => e.componentId === this.subComponentList[0].packageCompId);
  } else {
    this.subComponentList = [];
  }

  if (this.componentList && this.componentList.length > 0) {
    const selectedcomp: any[] = [];

    for (let index = 0; index < this.package.packComp.length; index++) {
      const a = this.package.packComp[index];
      const id = this.packagefrmgroup.get('packComp')['controls'][0]['controls']['componentId'].value;

      if (this.editRowIndex > -1 && id === a.componentId) { continue; }

      if (a.componentId !== null && a.componentId !== 0) {

        const matchedComponent = this.componentList.find(e => e['componentId'] === a.componentId);

        if (matchedComponent) {
          if (matchedComponent['subComponentCount'] > 0) {
            const matchedPackCount = this.package.packComp.filter(
              e => e['componentId'] === a.componentId
            ).length;

            if (matchedComponent['subComponentCount'] === matchedPackCount) {
              selectedcomp.push(a.componentId);
            }
          } else {
            selectedcomp.push(a.componentId);
          }
        }

      }
    }

    if (selectedcomp.length > 0) {
      this.componentfilterList = Object.assign([], this.componentList.filter(f =>
        selectedcomp ? selectedcomp.indexOf(f['componentId']) === -1 : ''));
    }
  }

  this.subComponentfilterlist = [];

  const val = this.packagefrmgroup.get('packComp') as UntypedFormArray;
  const frmGroup = val.controls[0] as UntypedFormGroup;

  frmGroup.get('noOfComp')?.setValue('');
  frmGroup.get('noOfComp')?.enable();
  frmGroup.get('subComponentId')?.setValue('');
  frmGroup.get('subComponentId')?.enable();
  frmGroup.get('tatDays')?.setValue('');
}

  assignResourceCopy1() {
    this.componentfilterList = Object.assign([], this.componentList);
    this.componentfilterList = Object.assign([], this.componentList);
    if (1 !== 1) {
      let data: any[] = [];
      if (this.subComponentList.length > 0) {
        data = ((this.packagefrmgroup.controls['packComp'] as UntypedFormArray).value)
          .filter(e => e.componentId === this.subComponentList[0].packageCompId);
      }
      // if (compId[0].componentId !== data.length) { return; }

      if (this.componentList || !this.componentList === undefined) {
        const selectedcomp: any[] = [];
        // this.package.packComp = this.packagefrmgroup.get('PackComp')?.value;
        this.package.packComp.map(a => {
          if (a.componentId !== null && a.componentId !== 0) {
            selectedcomp.push(a.componentId);
          }
        });
        if (this.subComponentList.length === data.length) {
          this.componentfilterList = Object.assign([], this.componentList.filter(f =>
            // tslint:disable-next-line:no-string-literal
            selectedcomp ? selectedcomp.indexOf(f['componentId']) === -1 : ''));
        }
      }
    }
  }

  removeControl(index: number) {
    if (this.componentDetail.length > 1) {
      // tslint:disable-next-line:no-string-literal
      const control = this.packagefrmgroup.controls['packComp'] as UntypedFormArray;
      // remove the chosen row
      control.removeAt(index);
      this.frmlenth = this.componentDetail.length;
    }
  }

  disableItem(event: any) {
  }

  getformgroup() {
    // tslint:disable-next-line:no-string-literal
    return this.packagefrmgroup.controls.packComp['controls'] as UntypedFormArray;
  }

  getpackList() {
    this.router.navigate(['dashboard/client/package']);
  }
  packageSave() {
    if (this.package["packComp"].length > 0) {
      this.removeValidators(this.packagefrmgroup.controls['packComp']['controls'][0] as UntypedFormGroup);
      if (this.packagefrmgroup.valid) {
        if (this.packagefrmgroup.get('fees')?.value < this.discountMsp) {
          if (this.clientlist.length > 0) {
            const clientList = this.clientlist.filter(x => x.clientId === this.packagefrmgroup.get('clientId')?.value);
            this.packagefrmgroup.get('clientname')?.setValue(clientList[0].clientName);
          }
          this.ShowDialog();
        } else {
          this.addUpdatepac();
        }
      } else {
        this.packagefrmgroup.markAllAsTouched();
      }
    } else {
      this.packagefrmgroup.markAllAsTouched();
      this.showTopCenter('warn', 'Failed to save', 'Add atleast one component to save');
    }
  }
  ShowDialog() {
    if (this.packagefrmgroup.get('fees')?.value > 0) {
      this.dialogRef = this.dialog.open(this.feesConfirmation, {
        width: '510px',
        disableClose: true
      });
    }
  }
  siteId: any[] = [];
  addUpdatepac() {
    if (this.package["packComp"].length > 0) {
      this.removeValidators(this.packagefrmgroup.controls['packComp']['controls'][0] as UntypedFormGroup);
      if (this.packagefrmgroup.valid) {
        const dummyPack = this.package;
        this.packagefrmgroup.get('currentMSP')?.setValue(this.discountMsp);
        this.packagefrmgroup.get('currentNRP')?.setValue(this.discountNrp);
        const packcomp = this.packagefrmgroup.value;
        this.package = packcomp;
        // this.package.site.forEach((ele: any) => {
        //   this.siteId.push(ele.siteId);
        // })
        // this.package.site = this.siteId;
        this.check(dummyPack, 'Add');
        this.package.clientId = this.packagefrmgroup.get('clientId')?.value;
        if (this.packagefrmgroup.get('effectiveDate')?.value) {
          this.package.effectiveDate = this.datePipe.transform(this.packagefrmgroup.get('effectiveDate')?.value, 'dd/MM/yyyy');
        }
        const formData = new FormData();
        this.package.createdUserId = this.userdata.userId;
        this.package.oldFees = this.authService.packPrice ? this.authService.packPrice : 0;
        formData.append('PackageFeeDetails', JSON.stringify(this.package));
        if (this.package.packFeeStatusFlag === true) {
          if (this.package.packFeeApprovalFlag === true) {
            for (let i = 0; i < this.packageFeeDocumentList.length; i++) {
              formData.append('PackFeeDocument_' + i, this.packageFeeDocumentList[i].document);
            }
          }
          // **Added for Nodemail** //
          // this.convertFileasBase64(this.packageFeeDocumentList);
        }
        this.masterService.AddPackageName(formData).subscribe(res => {
          if (res) {
            this.showNotification();
            this.getpackList();
            // **Added for Nodemail** //
            // if (this.package.packFeeStatusFlag === true) {
            //   this.sendPackageMailFeeApproval(this.package);
            // }
          }
        }, err => {
          this.btnSave = false;
          this.disableFlag = false;
          this.getpackList();
          this.showTopCenter('error', 'Failure Message', 'Failure to Add');
        }, () => {
        });
      } else {
        this.packagefrmgroup.markAllAsTouched();
      }
    } else {
      this.packagefrmgroup.markAllAsTouched();
      this.showTopCenter('warn', 'Failed to save', 'Add atleast one component to save');
    }
  }
  // **Added for Nodemail** //
  // convertFileasBase64(file: any) {
  //   if (file.length > 0) {
  //     this.mailDocList = [];
  //     // tslint:disable-next-line:prefer-for-of
  //     for (let i = 0; i < file.length; i++) {
  //       if (file[i].document) {
  //         const fileReader = new FileReader();
  //         fileReader.onloadend = (e) => {
  //           const mailAttachment = new MailAttachment();
  //           mailAttachment.fileName = file[i].document.name;
  //           mailAttachment.bufferDoc = fileReader.result;
  //           this.mailDocList.push(mailAttachment);
  //         };
  //         fileReader.readAsDataURL(file[i].document);
  //       }
  //     }
  //   }
  // }
  // sendPackageMailFeeApproval(data: any) {
  //   if (data.packFeeStatusFlag === true) {
  //     const emailTemplate = this.common.mailTemplates.find(x => x.templateName.toLowerCase() ===
  //       this.common.PACKAGE_FEE_APPROVAL).htmlTemplateBody;
  //     const mailTemp = new MailTemplate();
  //     mailTemp.mailbodyheader = 'Dear';
  //     mailTemp.clientName = data.clientname;
  //     mailTemp.packageName = data.packageName;
  //     mailTemp.mSPRate = data.currentMSP;
  //     mailTemp.requestedRate = data.fees;
  //     mailTemp.userName = this.userdata.userName;
  //     mailTemp.comments = data.reason;
  //     mailTemp.totalCaseDone = data.PackComp.length;
  //     mailTemp.tableData = data.PackComp.reduce((a, b) => {
  //       return a + '<tr><td align="left" valign="top" style="padding: 8px 5px;">' + b.componentName + " - " + b.subComponentName +
  //         '</a></td><td align="left" valign="top" style="padding: 8px 5px;">' +
  //         b.noOfComp + '</td></tr>';
  //     }, '');
  //     const mailData = new MailData();
  //     mailData.htmlTemplate = this.common.mailTemp(emailTemplate, mailTemp);
  //     if (data.packFeeApprovalFlag === true) {
  //       // tslint:disable-next-line:prefer-for-of
  //       for (let index = 0; index < this.mailDocList.length; index++) {
  //         mailData.fileAttachments.push({
  //           filename: this.mailDocList[index].fileName,
  //           path: this.mailDocList[index].bufferDoc
  //         });
  //       }
  //     }
  //     this.masterService.sendEmail(mailData).subscribe(resp => {
  //       this.showTopCenter('success', 'Success', resp['message']);
  //     });
  //   }
  // }
  saveFee() {
    const controlNames = ['packFeeApprovalFlag', 'reason'];
    for (const ctrl in this.packagefrmgroup.controls) {
      if (controlNames.indexOf(ctrl) > -1) {
        if (!this.packagefrmgroup.get(ctrl).value) {
          this.packagefrmgroup.get(ctrl).markAsTouched();
          this.packagefrmgroup.get(ctrl).setValidators(Validators.required);
          this.packagefrmgroup.get(ctrl).updateValueAndValidity();
        }
      } else {
        this.packagefrmgroup.get(ctrl).clearValidators();
        this.packagefrmgroup.get(ctrl).updateValueAndValidity();
      }
    }
    this.flagFee = this.packagefrmgroup.get('packFeeApprovalFlag')?.value;
    if (this.packagefrmgroup.get('packFeeApprovalFlag')?.valid
      && this.packagefrmgroup.get('reason')?.valid) {
      if (this.flagFee === true) {
        this.packagefrmgroup.get('packFeeStatusFlag')?.setValue(true);
        if (this.packageFeeDocumentList.length === 0) {
          this.packagefrmgroup.get('componentFeeDocument')?.setErrors({ incorrect: true });
        }
        if (this.packageFeeDocumentList.length > 0 && this.packagefrmgroup.get('componentFeeDocument')?.valid) {
          this.addUpdatepac();
          this.dialogRef.close();
        }
      }
      if (this.flagFee === false) {
        this.packagefrmgroup.get('packFeeStatusFlag')?.setValue(true);
        this.dialogRef.close();
        this.packagefrmgroup.get('componentFeeDocument')?.setErrors(null);
        this.addUpdatepac();
      }
    }
  }
  downloadFile(data, filename) {
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
  openUploadDoc(event: any) {
    let docArrayName: any[] = [];
    const packApp = new PackageDocument();
    packApp.document = event.target.files[0];
    packApp.fileName = event.target.files[0].name;
    this.fileNameList.push(packApp.fileName);
    docArrayName.push(packApp.fileName);
    this.packageFeeDocumentList.push(packApp);
    this.packagefrmgroup.get('FileName')?.setValue(this.fileNameList);
  }
  // remove document
  removeDocument(index: any) {
    this.packageFeeDocumentList.splice(index, 1);
  }
  close() {
    this.packagefrmgroup.get('packFeeApprovalFlag')?.clearValidators();
    this.packagefrmgroup.get('packFeeApprovalFlag')?.updateValueAndValidity();
    this.packagefrmgroup.get('reason')?.clearValidators();
    this.packagefrmgroup.get('reason')?.updateValueAndValidity();
    this.dialogRef.close();
  }

  getSub(e, i) {
    const subPrice = this.subComponentList.filter(x => x.subComponentId === e);
    const PackComp = this.packagefrmgroup.get('packComp')['controls'][i] as UntypedFormGroup;
    PackComp.controls['msp'].setValue(subPrice[0].msp);
    if (subPrice.length > 0) {
      PackComp.controls['subComponentName'].setValue(subPrice[0].subComponentName);
    }
    const subname = this.subComponentList.filter(x => x.subComponentId === e && x.noOfComp === 1);
    if (subname.length > 0) {
      // if (subname[0].subComponentName === this.common.CURRENT_ADDRESS || subname[0].subComponentName === this.common.PERMANENT_ADDRESS) {
      const val = this.packagefrmgroup.get('packComp') as UntypedFormArray;
      const frmGroup = val.controls[0] as UntypedFormGroup;
      frmGroup.get('noOfComp')?.setValue(subname[0].noOfComp);
      frmGroup.get('noOfComp')?.disable();
      frmGroup.value.noOfComp = frmGroup.controls.noOfComp.value;
    } else {
      const val = this.packagefrmgroup.get('packComp') as UntypedFormArray;
      const frmGroup = val.controls[0] as UntypedFormGroup;
      frmGroup.get('noOfComp')?.setValue('');
      frmGroup.get('noOfComp')?.enable();
    }
  }
  public removeValidators(form: UntypedFormGroup) {
    // tslint:disable-next-line:forin
    for (const key in form.controls) {
      form.get(key).clearValidators();
      form.get(key).updateValueAndValidity();
    }
  }

  showNotification() {
    if (this.authService.addOrEdit === 'Add') {
      this.showTopCenter('success', 'Success Message', 'Saved Successfully');
    } else {
      this.showTopCenter('success', 'Success Message', 'Updated Successfully');
    }

  }
  showTopCenter(level: string, info: string, message: string) {
    this.messageService.add({ severity: level, summary: info, detail: message });
  }
  showDelete(data: any) {
    const quantity = data.noOfComp;
    const count = Number(quantity);
    let packPercentMsp = 0;
    if (!data.subComponentName) {
      const mspVal = data.msp * count;
      packPercentMsp = mspVal * 10 / 100;
      const dmsp = mspVal - packPercentMsp;
      this.discountMsp = this.discountMsp - dmsp;
    } else {
      this.masterService.getPackageSubComponent(this.packagefrmgroup.get('clientId')?.value, data.componentId).subscribe(res => {
        this.subComponentList = res;
        if (res.length > 0) {
          const subList = this.subComponentList.filter(x => x.subComponentId === data.subComponentId);
          packPercentMsp = subList[0].msp * count * 10 / 100;
          const dmsp = subList[0].msp - packPercentMsp;
          this.discountMsp = this.discountMsp - dmsp;
        }
      });
    }
    this.showTopCenter('warn', 'Success Message', 'Deleted Successfully');
    if (this.package["packComp"].length === 0) {
      this.discountMsp = 0;
    }
  }
  resetForm() {
    if (this.packagefrmgroup.controls.packageId.value > 0) {
      this.packagefrmgroup.patchValue({
        packageId: this.common.tempResetData.packageId,
        clientId: this.common.tempResetData.clientId,
        siteId: this.common.tempResetData.siteDetails != null ? this.common.tempResetData.siteDetails : 0,
        packageName: this.common.tempResetData.packageName,
        fees: this.common.tempResetData.fees,
        effectiveDate: this.common.tempResetData.effectiveDate,
        effectiveReason: this.common.tempResetData.effectiveReason,
        // PackComp: this.formBuilder.array([this.initconponentfrm()])
      });
    } else {
      this.packagefrmgroup.controls.packageId.setValue(0);
      this.packagefrmgroup.reset();
      this.componentList = [];
      this.packagefrmgroup.markAsPristine();
      this.initform();
    }
  }

  getPackageDetailById(packageId: any) {
    this.masterService.GetPackageDetailById(packageId).subscribe((res: Package) => {
      if (res) {
        this.package = res;
        if (res.packComp.length) {
          res.packComp.map(e => {
            e.subComponent = e.subComponent.filter(r => r.subComponentId !== 0);
          });
          let packPercentMsp;
          res.packComp.forEach((element) => {
            let subCount = 0;
            let mainCount = 0;
            if (element.subComponent.length > 0) {
              element.subComponent.forEach(ele => {
                const count = ele.noOfComp;
                const mspVal = ele.msp * count;
                packPercentMsp = mspVal * 10 / 100;
                const SMsp = mspVal - packPercentMsp;
                subCount = subCount + SMsp;
              });
            }
            if (element.subComponent.length === 0) {
              const count = element.noOfComp;
              const mspVal = element.msp * count;
              packPercentMsp = mspVal * 10 / 100;
              const dMsp = mspVal - packPercentMsp;
              mainCount = mainCount + dMsp;
            }
            const finalVal = mainCount + subCount;
            this.discountMsp = this.discountMsp + finalVal;
          });
        }
        this.check(res, 'Edit');
        this.componentfilterList = Object.assign([], this.componentList);

        setTimeout(() => {
          this.packagefrmgroup.patchValue(this.package);
          this.packagefrmgroup.controls.tatDays.setValue(this.authService.packTatDays);
          this.packagefrmgroup.controls.packComp.patchValue(this.package.packComp);
          this.clearFormArrayOn();
        }, 0);
      }
    }, err => { }, () => {
      this.packagefrmgroup.controls['clientId'].disable();
    });
  }

  clientItemsddl(value: any) {
    if (!value) {
      this.assignClienteCopy();
    }
    if (value) {
      this.clientflterlist = Object.assign([], this.clientlist).filter(
        item => ((item.clientName.toLowerCase().indexOf(value.toLowerCase()) > -1)));
    }

  }

  assignClienteCopy() {
    this.clientflterlist = Object.assign([], this.clientlist);
    this.componentList = [];
  }

  clientddlKeyupFunction(event, value) {
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
      }
    }
  }

  checkValidValue() {
    const value = this.packagefrmgroup.get('clientId')?.value;
    if (value === '' || value == null) {
    } else if (this.billingKeyup) {
      this.packagefrmgroup.controls.clientId.setErrors({ incorrect: true });
    } else {
      this.packagefrmgroup.controls.clientId.setErrors(null);
    }
  }

  checVal() {
    const data: any = this.clientlist.filter(e => e.clientName.toLowerCase().trim() ===
      ('' + this.packagefrmgroup.get('clientId')?.value).toLowerCase().trim());
    if (data.length > 0) {
      this.packagefrmgroup.get('clientId')?.setValue(data[0].clientId);
      this.billingKeyup = false;
    }
    this.checkValidValue();

  }

  displayClientFn(id: any): string {
    if (!id) { return ''; }
    const clientName = this.clientlist.filter(res => res.clientId === id);
    return clientName ? clientName[0].clientName : '';
  }

  getClient() {
    const data = new PackClientVM();
    data.lstclientId = this.userdata.clientId;
    this.masterService.GetPackClient(data).subscribe(res => {
      if (res) {
        this.clientlist = res;
        this.clientItems('');
        if (this.clientId > 0) {
          this.packagefrmgroup.controls.clientId.setValue(this.clientId);
        }
      }
    });
  }

  getComponetDetailsByClient() {
    this.billingKeyup = false;
    this.componentList = [];
    const clientId = this.packagefrmgroup.get('clientId')?.value;
    this.authService.packClientId = clientId;
    this.GetComponetDetails(this.authService.packClientId);
  }

  getToday(): string {
    return new Date().toISOString().split('T')[0];
  }

  // SubComponent AC
  subComponentKeyupFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        const comp = this.subComponentList.filter(e =>
          e.subComponentName.toLowerCase() === value.toLowerCase());
        if (comp.length > 0) {
          this.subComponentkeyUp = true;
        } else {
          this.subComponentkeyUp = true;
        }
      } else {
        this.subComponentkeyUp = false;
      }
    }
  }

  // tslint:disable-next-line:member-ordering
  editRowIndex = -1;

  editCompDetails(rowData, editRowIndex1: number) {

    if (rowData.noofyear > 0) {
      this.yrFlag = true;
    } else {
      this.yrFlag = false;
    }
    const val = this.packagefrmgroup.get('packComp') as UntypedFormArray;
    const frmGroup = val.controls[0] as UntypedFormGroup;
    frmGroup.get('msp')?.setValue(rowData.msp);
    const quantity = rowData.noOfComp;
    const count = Number(quantity);
    const mspVal = frmGroup.get('msp')?.value * count;
    const packPercentMsp = mspVal * 10 / 100;
    const dMsp = mspVal - packPercentMsp;
    this.discountMsp1 = this.discountMsp - dMsp;
    this.assignResourceCopy();
    this.packagefrmgroup.get('packComp')['controls'][0]['controls']['subComponentId'].enable();
    this.packagefrmgroup.get('packComp')['controls'][0].get('subComponentId')?.setValue(rowData.subComponentId);
    if (rowData.subComponentId ? rowData.subComponentId > 0 : 0) {
      this.getSubComponent(rowData.componentId, 0, 'edit');
    }
    (this.packagefrmgroup.get('packComp')['controls'][0] as UntypedFormGroup).patchValue({
      componentId: rowData.componentId,
      subComponentId: rowData['subComponentId'] ? rowData.subComponentId :
        this.packagefrmgroup.get('packComp')['controls'][0]['controls']['subComponentId'].disable(),
      noOfComp: rowData.noOfComp,
      noofyear: rowData.noofyear,
      packageCompId: rowData.packageCompId,
      packageSubCompId: rowData.packageSubCompId,
      tatDays: rowData.tatDays
    });
    // setTimeout(() => {

    // }, 100);
    const value = this.componentList.find(x => x.componentId === rowData.componentId);
    this.clientItems(value.componentName);
    // this.clientItems('');
    this.editRowIndex = editRowIndex1;
    this.subComponentItems('');
  }


  clearFormArrayOn() {
    this.clearFormArray((this.packagefrmgroup.get('packComp') as UntypedFormArray));
    (this.packagefrmgroup.get('packComp') as UntypedFormArray).push(this.initconponentfrm());
    this.editRowIndex = -1;
  }
  checkTAT(e, val) {
    e = Number(e);
    if (e > 0) {
      val.get('tatDays')?.setErrors(null);
    } else {
      val.get('tatDays')?.setErrors({ incorrect: true });
    }
  }
  createControl() {
    const val = this.packagefrmgroup.get('packComp') as UntypedFormArray;
    const frmGroup = val.controls[0] as UntypedFormGroup;

    // const compValue = this.packagefrmgroup.get('PackComp')?.value[0];
    // if (this.package['packComp'].filter(e => e.componentId === compValue['componentId']
    //   && e.subComponentId === compValue['subComponentId']).length > 0) {
    //   this.showTopCenter('warn', 'Exist', `Component ${this.subComponentList.length > 0 ? 'and SubComponent' : ''} Already exist`);
    //   return;
    // }
    if (frmGroup.valid && Number(frmGroup.get('tatDays')?.value) > 0 && (frmGroup.get('noOfComp')?.valid || frmGroup.get('noOfComp')?.disabled)) {
      const componentName = this.componentList.filter(e => e['componentId'] ===
        this.packagefrmgroup.get('packComp')?.value[0]['componentId'])[0]['componentName'];

      const subComponentName = (this.subComponentList.length > 0) ? this.subComponentList.filter(e => e.subComponentId ===
        this.packagefrmgroup.get('packComp')?.value[0]['subComponentId'])[0].subComponentName : '';

      this.packagefrmgroup.get('packComp')['controls'][0]['controls']['componentName'].setValue(componentName);
      this.packagefrmgroup.get('packComp')['controls'][0]['controls']['subComponentName'].setValue(subComponentName);
      this.packagefrmgroup.value.packComp[0].noOfComp = this.packagefrmgroup.get('packComp')['controls'][0]['controls'].noOfComp.value;
      this.editRowIndex === -1 ? this.package['packComp'].push((this.packagefrmgroup.get('packComp') as UntypedFormArray).value[0]) :
        this.package['packComp'][this.editRowIndex] = (this.packagefrmgroup.get('packComp') as UntypedFormArray).value[0]

      if (frmGroup.get('msp')?.value > 0) {
        const quantity = frmGroup.get('noOfComp')?.value;
        const count = Number(quantity);
        const mspValue = frmGroup.get('msp')?.value * count;
        const packPercentMsp = mspValue * 10 / 100;
        const dMsp = mspValue - packPercentMsp;
        if (this.editRowIndex > -1) {
          this.discountMsp = this.discountMsp1 + dMsp;
        } else {
          this.discountMsp = this.discountMsp + dMsp;
        }
        // this.mspPrice = this.mspPrice + frmGroup.get('msp')?.value;
        // const quantity = frmGroup.get('noOfComp')?.value;
        // const count = Number(quantity);
        // const packPercentMsp = this.mspPrice * count * 10 / 100;
        // this.discountMsp = this.mspPrice - packPercentMsp;
        // this.nrpPrice = this.mspPrice + frmGroup.get('nrp')?.value;
        // const packPercentNrp = this.mspPrice * 10 / 100;
        // this.discountNrp = this.nrpPrice - packPercentNrp;
      }
      this.clearFormArrayOn();
    } else {
      frmGroup.setValidators(Validators.required);
      frmGroup.markAsTouched();
    }
    this.dt.reset();
  }
  get displaySubComponentFn() {
    const compNew = (comp) => {
      if (comp == null || comp === undefined) {
        return null;
      } else {
        if (comp && this.subComponentfilterlist && this.subComponentfilterlist.length > 0) {
          comp = this.subComponentfilterlist.find(x => x.subComponentId === comp);
          return comp.subComponentName;
        } else {
          return null;
        }
      }
    };
    return compNew;
  }

  subComponentItems(value: any) {
    if (!value) { this.assignSubComponentCopy(); }
    if (value) {
      this.subComponentfilterlist = Object.assign([], this.subComponentList).filter(
        item => ((item.subComponentName.toLowerCase().indexOf(value.toLowerCase()) > -1)));
    }
  }

  assignSubComponentCopy() {
    this.subComponentfilterlist = Object.assign([], this.subComponentList);
    if (this.subComponentList || !this.subComponentList === undefined) {
      const selectedSubComp: any[] = [];
      // tslint:disable-next-line:prefer-for-of
      for (let index = 0; index < this.package.packComp.length; index++) {
        const a = this.package.packComp[index];
        const id = this.packagefrmgroup.get('packComp')['controls'][0]['controls']['subComponentId'].value;
        if (this.editRowIndex > -1 && id === a.subComponentId) {
          continue;
        }
        if (a.subComponentId !== null && a.subComponentId !== 0) {
          selectedSubComp.push(a.subComponentId);
        }
      }
      // this.package.packComp.forEach(a => {
      //   if (this.editRowIndex === -1
      //     && this.packagefrmgroup.get('PackComp')['controls'][0].subComponentId === a.subComponentId) {
      //     continue;
      //   }
      //   if (a.subComponentId !== null && a.subComponentId !== 0) {
      //     selectedSubComp.push(a.subComponentId);
      //   }
      // });
      this.subComponentfilterlist = Object.assign([], this.subComponentList.filter(f =>
        selectedSubComp ? selectedSubComp.indexOf(f['subComponentId']) === -1 : ''));
    }
  }

  assignSubComponentCopy1() {
    this.subComponentfilterlist = Object.assign([], this.subComponentList);
  }

  // getSubComponent(value, index, type) {
  //   if (value > 0) {
  //     const price = this.componentList.filter(x => x.componentId === value);
  //     if(price: any) {
  //       this.yrFlag = price[0].daCompValidFlag;
  //     }
  //     if (type === 'add') {
  //       const PackComp = this.packagefrmgroup.get('packComp')['controls'][index] as UntypedFormGroup;
  //       if (price[0].subComponentCount === 0) {
  //         PackComp.controls['msp'].setValue(price[0].msp);
  //         PackComp.controls['nrp'].setValue(price[0].nrp);
  //         PackComp.controls['tatDays'].setValue(price[0].tatDays);
  //         // let mspList: any[] = [];
  //         // mspList.push({ msp: PackComp.controls['msp'].value });
  //       } else {
  //         PackComp.controls['msp'].setValue('');
  //       }
  //     }
  //     this.masterService.getPackageSubComponent(this.packagefrmgroup.get('clientId')?.value, value).subscribe(res => {
  //       this.subComponentList = res;
  //       if (res.length > 0) {
  //         this.subComponentItems('');
  //         const PackComp = this.packagefrmgroup.get('packComp')['controls'][index] as UntypedFormGroup;
  //         PackComp.controls['subComponentId'].enable();
  //       } else {
  //         const val = this.packagefrmgroup.get('packComp')['controls'][index] as UntypedFormGroup;
  //         val.controls['subComponentId'].disable();
  //       }
  //     });
  //     let singlecomp: any[] = [];
  //     if (price[0].subComponentCount === 0) {
  //       singlecomp = this.componentList.filter(x => x.noOfComp === 1 && x.componentId === value);
  //     } else {
  //       if (this.subComponentList.length > 0) {
  //         singlecomp = this.subComponentList.filter(x => x.noOfComp === 1 && x.subComponentId ===
  //           this.packagefrmgroup.get('packComp')['controls'][index].get('subComponentId')?.value);
  //       }
  //     }

  //     const val = this.packagefrmgroup.get('packComp') as UntypedFormArray;
  //     const frmGroup = val.controls[index] as UntypedFormGroup;
  //     if (singlecomp.length > 0) {
  //       const val1 = frmGroup.get('noOfComp')?.setValue(singlecomp[0].noOfComp);
  //       frmGroup.get('noOfComp')?.disable();
  //       frmGroup.value.noOfComp = frmGroup.controls.noOfComp.value;
  //     } else {
  //       frmGroup.get('noOfComp')?.enable();
  //       frmGroup.get('noOfComp')?.setValue('');
  //     }
  //   }
  //   const val = this.packagefrmgroup.get('packComp') as UntypedFormArray;
  //   const frmGroup = val.controls[0] as UntypedFormGroup;
  //   this.existItem = this.package.packComp.filter(x => x.componentId === value && !x.subComponentName);
  //   if (this.existItem.length > 0) {
  //     this.showTopCenter('warn', 'Failure Message', 'Component List has been already exist');
  //     frmGroup.get('componentId')?.enable();
  //     frmGroup.get('noOfComp')?.enable();

  //   }
  // }

  getSubComponent(value : any, index: any, type: any) {

    if (value > 0) {

      const price = this.componentList.filter(
        x => x.componentId === value
      );

      if (price && price.length > 0) {
        this.yrFlag = price[0].daCompValidFlag;
      }

      if (type === 'add') {

        const PackComp = this.packagefrmgroup
          .get('packComp')['controls'][index] as UntypedFormGroup;

        if (price[0]?.subComponentCount === 0) {

          PackComp.controls['msp'].setValue(price[0].msp);
          PackComp.controls['nrp'].setValue(price[0].nrp);
          PackComp.controls['tatDays'].setValue(price[0].tatDays);

        } else {

          PackComp.controls['msp'].setValue('');
        }
      }

      this.masterService
        .getPackageSubComponent(
          this.packagefrmgroup.get('clientId')?.value,
          value
        )
        .subscribe((res: any) => {

          this.subComponentList = res;

          if (res.length > 0) {

            this.subComponentItems('');

            const PackComp = this.packagefrmgroup
              .get('packComp')['controls'][index] as UntypedFormGroup;

            PackComp.controls['subComponentId'].enable();

          } else {

            const val = this.packagefrmgroup
              .get('packComp')['controls'][index] as UntypedFormGroup;

            val.controls['subComponentId'].disable();
          }
        });

      let singlecomp: any[] = [];

      if (price[0]?.subComponentCount === 0) {

        singlecomp = this.componentList.filter(
          x => x.noOfComp === 1 && x.componentId === value
        );

      } else {

        if (this.subComponentList.length > 0) {

          singlecomp = this.subComponentList.filter(
            x =>
              x.noOfComp === 1 &&
              x.subComponentId ===
              this.packagefrmgroup
                .get('packComp')
              ['controls'][index]
                .get('subComponentId')?.value
          );
        }
      }

      const val = this.packagefrmgroup.get('packComp') as UntypedFormArray;

      const frmGroup = val.controls[index] as UntypedFormGroup;

      if (singlecomp.length > 0) {

        frmGroup.get('noOfComp')?.setValue(singlecomp[0].noOfComp);

        frmGroup.get('noOfComp')?.disable();

        frmGroup.value.noOfComp = frmGroup.controls.noOfComp.value;

      } else {

        frmGroup.get('noOfComp')?.enable();

        frmGroup.get('noOfComp')?.setValue('');
      }
    }

    const val = this.packagefrmgroup.get('packComp') as UntypedFormArray;

    const frmGroup = val.controls[0] as UntypedFormGroup;

    this.existItem = this.package.packComp.filter(
      x => x.componentId === value && !x.subComponentName
    );

    if (this.existItem.length > 0) {

      this.showTopCenter(
        'warn',
        'Failure Message',
        'Component List has been already exist'
      );

      frmGroup.get('componentId')?.enable();

      frmGroup.get('noOfComp')?.enable();
    }
  }

  checkNoofComp() {
    const val = this.packagefrmgroup.get('packComp') as UntypedFormArray;
    const frmGroup = val.controls[0] as UntypedFormGroup;
    if (frmGroup.get('noOfComp')?.value === '0' || frmGroup.get('noOfComp')?.value === '00' || frmGroup.get('noOfComp')?.value === '000') {
      frmGroup.get('noOfComp')?.setErrors({ incorrect: true });
    } else {
      frmGroup.get('noOfComp')?.setErrors(null);
    }
  }
  validateComSubComponent() {

  }


  check(packageData: Package, type: 'Edit' | 'Add') {
    if (type === 'Add') {
      const dupvalues: number[] = [];
      // this.packagefrmgroup.controls.PackComp['controls'] as UntypedFormArray
      let compData = packageData['packComp'];
      compData.forEach(e => {
        if (!dupvalues.includes(e.componentId)) {
          // if (compData.filter(el => el.componentId === e.componentId).length > 1) 
          {
            const copydata: PackComp[] = compData.filter(r => r.componentId === e.componentId);
            compData = compData.filter(del => del.componentId !== e.componentId);
            let copydata1 = new PackComp();
            copydata.forEach((data, index) => {
              if (index === 0) {
                copydata1 = data;
                copydata1.subComponent = [];
                const d: PackSubCompVm = {
                  packageCompId: copydata1.componentId,
                  packageSubCompId: copydata1.packageSubCompId,
                  subComponentId: copydata1.subComponentId,
                  noOfComp: copydata[index].noOfComp,
                  noofyear: copydata[index].noofyear,
                  msp: copydata1.msp,
                  subComponentName: copydata1.subComponentName,
                  tatDays: copydata1.tatDays
                };
                if (!copydata1.subComponentId) {
                  copydata1.subComponent = null;
                } else {
                  copydata1.noOfComp = 0;
                  copydata1.subComponent.push(d);
                }
              } else {
                const d: PackSubCompVm = {
                  packageCompId: data.componentId,
                  packageSubCompId: data.packageSubCompId,
                  subComponentId: data.subComponentId,
                  noOfComp: copydata[index].noOfComp,
                  noofyear: copydata[index].noofyear,
                  msp: copydata1.msp,
                  subComponentName: copydata1.subComponentName,
                  tatDays: copydata1.tatDays
                };
                if (!copydata1.subComponentId) {
                  copydata1.subComponent = null;
                } else {
                  copydata1.noOfComp = 0;
                  copydata1.subComponent.push(d);
                }
              }
            });
            compData.push(copydata1);
          }
        }
        dupvalues.push(e.componentId);
      });
      this.package['packComp'] = compData;
    } else if (type === 'Edit') {
      const compData: PackComp[] = packageData['packComp'];
      const packCompData: PackComp[] = [];
      compData.forEach(e => {
        if (e.subComponent.length > 0) {
          e.subComponent.map(r => {
            const data1: PackComp = {
              componentId: e.componentId,
              noOfComp: r.noOfComp,
              noofyear: r.noofyear,
              packageCompId: r.packageCompId,
              packageSubCompId: r.packageSubCompId,
              subComponentId: r.subComponentId,
              subComponent: [],
              componentName: e.componentName,
              subComponentName: r['subComponentName'],
              msp: e.msp,
              tatDays: e.tatDays
            };
            packCompData.push(data1);
          });
        } else {
          packCompData.push(e);
        }
      });
      this.package.packComp = packCompData;
    }
    // let compData = ((this.packagefrmgroup.controls['PackComp'] as UntypedFormArray).value);
  }
  checkPackName(value: any) {
    const pack = new PackageCheck();
    pack.packageId = this.authService.packageId > 0 ? this.authService.packageId : 0;
    pack.packageName = value;
    if (this.packagefrmgroup.get('packageName')?.valid) {
      this.masterService.checkPackageName(pack).subscribe(res => {
        if (res === true) {
          this.packagefrmgroup.get('packageName')?.setErrors({ incorrect: true });
        } else {
          this.packagefrmgroup.get('packageName')?.setErrors(null);
        }
      });
    }
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
      this.dt.onPageChange({ first: ((pageNo - 1) * rowscount), rows: rowscount });
      this.tempCurrentPage = this.currentPage;
    }
  }
}

class packSubComp {
  packageSubCompId: number;
  packageCompId: number;
  subComponentId: number;
  subComponentName: string;
  noOfComp?: number;
  noofyear?: number;
  active?: number;
  tatDays: number;
}

class PackClientVM {
  lstclientId: string[];
  clientId: number;
}
