import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { InvoiceService } from 'src/app/common-methods/services/invoice.service';
import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';
import { MessageService } from 'primeng/api';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
// import {  MatDialog } from "@angular/material";
import { MatDialog } from '@angular/material/dialog';
import { CommonAlertsComponent } from "src/app/common-methods/common-alerts/common-alerts.component";
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-package-selection',
  templateUrl: './package-selection.component.html',
  styleUrls: ['./package-selection.component.css']
})
export class PackageSelectionComponent implements OnInit {
  checkPackVm = new CheckPackVm();
  SearchCriFilter = false;
  clientRefNum = new UntypedFormControl();
  packageIdCtrl = new UntypedFormControl(null, Validators.required);
  individualIdCtrl=new UntypedFormControl();
  agentvalue: any[] = [];
  packageInvoiceList: any[] = [];
  routePath = 'Invoice  / Choose Package';
  userData: any;
  ind = 0;
  packFlag: boolean;
  packCompList: any[] = [];
  packForm: UntypedFormGroup;
  breadcrumbFlags = new BreadcrumbFlags();
  // tslint:disable-next-line: no-use-before-declare
  UpdatePackVm = new UpdatePackVm();
  clientControls!: AutoCompleteDropDown;
  screenAuth:any;
  constructor(public invoiceService: InvoiceService, private message: MessageService,private dialog: MatDialog,
    private auth:AuthService,private router:Router
  ) { }
  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.screenAuth = this.auth.getScreenAuth(this.router.url);
    this.breadcrumbFlags.btnSave = true;
    this.breadcrumbFlags.toolTip = 'Update';
    this.initGroup();
    this.getInvoiceClient();
    this.clientControls = new AutoCompleteDropDown('Client', 'clientId', 'clientId', 'clientName', this.agentvalue,
      '', this.packForm, false, false, false);
     
  }
  initGroup() {
    this.packForm = new UntypedFormGroup({
      clientId: new UntypedFormControl()
    });
  }
  getInvoiceClient() {
    this.invoiceService.getInvoiceClient(this.userData.clientId).subscribe(res => {
      this.agentvalue = res;
      this.clientControls = new AutoCompleteDropDown('Client', 'clientId', 'clientId', 'clientName', this.agentvalue,
        '', this.packForm, false, false, false, 'standard');
      // console.log(res);
    });
  }
  search(){

  }
  searchInvoice() {
    if (this.clientRefNum.value) {
      this.invoiceService.getInvoicePackageList(0, this.clientRefNum.value ? this.clientRefNum.value : '',0).
        subscribe(res => {
          if (res) {
            this.packageInvoiceList = res;
            this.ind = 0;
            this.packCompList = [];
            this.packFlag = false;
            this.changePackage(this.packageInvoiceList[0].packageId, this.packageInvoiceList[0].packageList)
            this.packageIdCtrl.setValue(this.packageInvoiceList[0].packageId);
            // console.log(res, 'reslist');
          }
        });
      this.packageIdCtrl.clearValidators();
      this.packageIdCtrl.updateValueAndValidity();
    }else{
      this.showTopCenter('warn', 'Failure Message', 'Please Enter values to search');

    }
  }
  
  goToTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
  changePackage(value, data) {
    if (value > 0) {
      this.packFlag = true;
      const packComp = data.filter(x => x.packageId === value);
      this.packCompList = packComp[0].packComp;
    } else {
      this.packFlag = false;
      this.packageIdCtrl.setValue('');
      this.packCompList = [];
    }
  }
  getRows(i: any) {
    this.ind = i;
    this.packageIdCtrl.setValue('');
    this.packageIdCtrl.clearValidators();
    this.packageIdCtrl.updateValueAndValidity();
    this.packCompList = [];
    this.packFlag = false;
    this.goToTop();
  }
  resetInvoice() {
    this.packageInvoiceList = [];
    this.packForm.reset();
    this.clientRefNum.reset();
  }
  asssignscmp(e, data){
    if (e.checked === true) {
      data.selectFlag = true;
    } else {
      data.selectFlag = false;
      
    }
  }
  asssignPackcmp(e, data){
    if (e.checked === true) {
      data.indtoPackSelectFlag = true;
    } else {
      data.indtoPackSelectFlag = false;
    }
  }
  
  checkMatchpackcomp() {
    if (this.packageIdCtrl.valid) {
      // const selectPack = this.packageInvoiceList[this.ind].packageList.filter(f=>f.packageId ==this.packageIdCtrl.valid).packComp;
      let isCompValid =true;
      const individualList = this.packageInvoiceList[this.ind].screeningDetail.filter(m => m.rptType === 'Individual' && m.selectFlag == true);
      const selectedPackageList = this.packageInvoiceList[this.ind].screeningDetail.filter(m => m.rptType === 'Package' && m.selectFlag == true);
      const allPackageList = this.packageInvoiceList[this.ind].screeningDetail.filter(m => m.rptType === 'Package');

      const packToIndList=this.packageInvoiceList[this.ind].screeningDetail.filter(m => m.rptType === 'Package' && m.indtoPackSelectFlag == true);
      let compId = individualList.map(o => o.compId);
      let subCompId =individualList.map(o => o.subCompId);
      
      let allCompInPackage;
      if(this.packageInvoiceList[this.ind].packageList.filter(f=>f.packageId ==this.packageIdCtrl.value).length>0)
      {
        allCompInPackage= this.packageInvoiceList[this.ind].packageList.filter(f=>f.packageId ==this.packageIdCtrl.value)[0].packComp;
      }
      
     
      if(allCompInPackage!==undefined)
      {

        if(selectedPackageList.length>0){
          if(selectedPackageList.length!==allPackageList.length && this.packageIdCtrl.value!==this.packageInvoiceList[this.ind].packageId)
          {
            // this.showTopCenter('warn', 'Information', 'Please select all package components to move to another package');
            this.showTopCenter('warn', 'Information', 'Please select current package');
            return;
          }
        }
        if(individualList.length>0){
          if(this.packageIdCtrl.value!==this.packageInvoiceList[this.ind].packageId)
          {
            if(selectedPackageList.length!==allPackageList.length){
          // this.showTopCenter('warn', 'Information', 'Please select all package components to move to another package');
          this.showTopCenter('warn', 'Information', 'Please select current package');
          return;
          }
          }
        }
        //Start of Seperating Component and SubComponent
          const compInPack=allCompInPackage.filter(f=>f.subComponent.length===0);
          const subCompInPack=allCompInPackage.filter(f=>f.subComponent.length>0);
        //End of Seperating Component and SubComponent
         //Start of Getting All SubComponent to single object
      let subComp: any[] = [];
      subCompInPack.forEach((element)=>{
        element.subComponent.forEach((ele)=>{
          subComp.push(ele);
        })
      })
      //End of Getting All SubComponent to single object
      //Start of Getting Missing Components and Sub components in Selected Package
      const notInPackComp= individualList.filter(obj => !compInPack.map(m=>m.componentId).includes(obj.compId)&&obj.subCompId===0);
      let notInPackSubComp;
      //if(subComp.length>0)
      notInPackSubComp=individualList.filter(obj =>obj.subCompId!=0 && !subComp.map(m=>m.subComponentId).includes(obj.subComponentId));
      let missingComponents='';
      if(notInPackComp!==undefined && notInPackComp.length>0)
      missingComponents= Array.prototype.map.call(notInPackComp, s => s.compName).toString();
      if(notInPackSubComp!==undefined && notInPackSubComp.length>0)
      missingComponents+=','+ Array.prototype.map.call(notInPackSubComp, s =>s.compName).toString();
      //missingComponents+=','+ Array.prototype.map.call(notInPackSubComp, s =>s.componentName+ '-'+ s.subComponentName).toString();
      // End of  Getting Missing Components and Sub components in Selected Package
        missingComponents='The component(s) '+missingComponents+' is not available in the package, do you still want to convert into package?';
      if(subCompId.length>0){
        subCompId =  subCompId.filter(val => val !== 0);
      }
      this.checkPackVm.compId = compId;
      this.checkPackVm.subCompId = subCompId;
      this.checkPackVm.packageId = this.packageIdCtrl.value;
      this.checkPackVm.screeningId = this.packageInvoiceList[this.ind].screeningId ;
    if(individualList.length>0||selectedPackageList.length>0)
    {
      if((notInPackComp!==undefined&&notInPackComp.length>0)||(notInPackSubComp!==undefined&&notInPackSubComp.length>0)){
        isCompValid=false;
        this.openconfirmationDialog(missingComponents,false);
       }else{
        this.updatePackage();
       }
    }
      }else if(individualList.length>0||selectedPackageList.length>0){
        this.showTopCenter('warn', 'Information', 'Package is required');
      }
       if(packToIndList.length>0 && isCompValid)
      {
        this.updatePackage();
      }
     
      // if(packageList.length>0){
      //   this.showTopCenter('warn', 'Information', 'This Reference number already submited');
      // }else{
      // if (individualList.length > 0) {
        
      // this.invoiceService.CheckCaseIndivdualCompMatchPackComp(this.checkPackVm).subscribe(resp => {
      //     if (resp.success===true) {
      //       this.updatePackage();
      //     } else {
            
      //       this.showTopCenter('warn', 'Information', 'Your Package & Individual Component does not match');
      //     }
      //   });
      // } 
      // else {
      //   this.showTopCenter('warn', 'Information', 'Atleast One Individual Component have this Reference number');
      // }
      // }
    } else {
      this.packageIdCtrl.markAsTouched();
    }
  }
  

  updatePackage() {
    const compId = this.packageInvoiceList[this.ind].screeningDetail.filter(m => m.rptType === 'Individual'&&m.selectFlag == true).map(m => m.screeningCompId);
    const selectedPackageScreeningComp = this.packageInvoiceList[this.ind].screeningDetail.filter(m => m.rptType === 'Package'&&m.selectFlag == true).map(m => m.screeningCompId);
    const totalPackageScreeningComp= this.packageInvoiceList[this.ind].screeningDetail.filter(m => m.rptType === 'Package').map(m => m.screeningCompId);
    const packageToIndScreeningCompId=this.packageInvoiceList[this.ind].screeningDetail.filter(m => m.rptType === 'Package' && m.indtoPackSelectFlag == true).map(m=>m.screeningCompId);
    if(packageToIndScreeningCompId.length===totalPackageScreeningComp.length)
    this.UpdatePackVm.isAllPackageComponent=true;

    this.UpdatePackVm.screeningCompId = compId;
    this.UpdatePackVm.packageScreeningCompId = selectedPackageScreeningComp;
    this.UpdatePackVm.packageToIndScreeningCompId=packageToIndScreeningCompId;
    this.UpdatePackVm.loggedIn = this.userData.userId;
    this.UpdatePackVm.packageId = this.packageIdCtrl.value?this.packageIdCtrl.value:0;
    this.invoiceService.UpdateComponentFeeType(this.UpdatePackVm).subscribe(resp => {
      if (resp === true) {
        this.packageIdCtrl.setValue('');
        this.packageIdCtrl.clearValidators();
        this.packageIdCtrl.updateValueAndValidity();
        this.showTopCenter('success', 'Success Message', 'Saved Successfully');
        this.packForm.reset();
        this.packageInvoiceList = [];
        this.searchInvoice();
      }
    });
  }
  public openconfirmationDialog(bodyText, flag) {
    const popupData = {
      action: 'DELETECONFIRMATION',
      headerText: "Alert",
      bodyText: bodyText,
    };
    const dialogRef = this.dialog.open(CommonAlertsComponent, {
      width: "320px",
      data: popupData,
      disableClose: true,
    });
    if (dialogRef) {
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          const action = String(result.type);
          if (action === 'DELETECONFIRMATION') {
            this.updatePackage();
          }
        }
      });
    }
  }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }
}
export class UpdatePackVm {
  screeningCompId: any[] = [];
  packageScreeningCompId: any[] = [];
  packageToIndScreeningCompId: any[] = [];
  loggedIn: number;
  packageId: number;
  isAllPackageComponent:boolean=false;
  isConvertToIndividuval:boolean=false;
}
export class CheckPackVm {
  compId: any[] = [];
  subCompId: any[] = [];
  screeningId: number;
  packageId: number;
}
