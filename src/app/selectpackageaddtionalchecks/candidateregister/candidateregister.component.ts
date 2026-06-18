import { Component, OnInit, SecurityContext } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonService } from "src/app/common-methods/services/common.service";


@Component({
  standalone: false,
  selector: 'app-candidateregister',
  templateUrl: './candidateregister.component.html',
  styleUrls: ['./candidateregister.component.css']
})
export class CandidateregisterComponent implements OnInit {
  isLinear = false;
  firstFormGroup:UntypedFormGroup;
  candidateRegisterForm: UntypedFormGroup;
  address = new BehaviorSubject(null);
  userType: string;
  hide = true;
  hide1 = true;
  isShow = false;
  uniqueflag = false;
  numberflag = false;
  charflag = false;
  minflag = false;

  constructor(public authService: AuthService, public sanitizer: DomSanitizer,
    private fb: UntypedFormBuilder, private messageService: MessageService, private router: Router,private common:CommonService) { }

  ngOnInit() {
    this.initFormGroup();
    this.candidateRegisterForm.get('confirmPassword')?.disable();
    // this.address = new BehaviorSubject(null);
    // console.log(this.authService.registerComps, 'registerComps');
  }
  initFormGroup() {
      // package screen hide start
    // if(this.authService.defaultSelectedPackageList.length!==0){
      // package screen hide start
    this.candidateRegisterForm = this.fb.group({
      clientId: new UntypedFormControl(this.authService.defaultSelectedPackageList.length > 0 ? this.authService.defaultSelectedPackageList[0].clientId : 0),
      clientName: new UntypedFormControl(''),
      packageId: new UntypedFormControl(this.authService.defaultSelectedPackageList.length > 0 ? this.authService.defaultSelectedPackageList[0].packageId : 0),
      name: new UntypedFormControl(''),
      userName: new UntypedFormControl(''),
      phoneNo: new UntypedFormControl('', (Validators.compose([Validators.required,
        Validators.minLength(10), Validators.pattern(/^[- 0-9]+$/)]))),
      emailId: new UntypedFormControl('', (Validators.compose([Validators.required, Validators.
        pattern(this.common.EmailRegX)]))),
      loggedId: new UntypedFormControl(0),
      caseComponent: new UntypedFormControl([]),
      siteId: new UntypedFormControl(0),
      address: new UntypedFormGroup({
        addressId: new UntypedFormControl(0),
        addLine1: new UntypedFormControl('', Validators.required),
        addLine2: new UntypedFormControl(''),
        addLine3: new UntypedFormControl(''),
        cityId: new UntypedFormControl(''),
        districtId: new UntypedFormControl(),
        stateId: new UntypedFormControl('', Validators.required),
        countryId: new UntypedFormControl('', Validators.required),
        postalCode: new UntypedFormControl('', Validators.required),
        locationId: new UntypedFormControl(),
        country: new UntypedFormControl(),
        state: new UntypedFormControl(),
        place: new UntypedFormControl(),
        district: new UntypedFormControl(),
        city: new UntypedFormControl()
      }),
      password: new UntypedFormControl(''),
      confirmPassword: new UntypedFormControl(''),
      agreeFlag: new UntypedFormControl(false)
    });
      // package screen hide start
  // }
  // else {
  //   this.router.navigate(['/Selectpackage-addtional-check'])
  // }
      // package screen hide start
}

  checkUserName() {
    this.authService.CheckUserName(this.candidateRegisterForm.get('userName')?.value).subscribe(res => {
      if (res) {
        this.candidateRegisterForm.get('userName')?.setErrors({ incorrect: true });
      } else {
        this.candidateRegisterForm.get('userName')?.setErrors(null);
      }
    });
  }
  // checkUserMaild() {
  //   this.authService.CheckMailid(this.candidateRegisterForm.get('emailId')?.value).subscribe(res => {
  //     if (res) {
  //       this.candidateRegisterForm.get('emailId')?.setErrors({ incorrect: true });
  //     } else {
     
  //     }
  //   });
  // }

  setPasswordBlur() {
    if(this.candidateRegisterForm.get('password')?.value) {
      this.passwordValidation(this.candidateRegisterForm.get('password')?.value);
      if(this.candidateRegisterForm.get('password')?.value) {
        this.candidateRegisterForm.get('confirmPassword')?.enable();
        this.confirmPasswordBlur();
      }
    } else {
      this.candidateRegisterForm.get('confirmPassword')?.setValue('');
      this.candidateRegisterForm.get('confirmPassword')?.disable();
    }
  }
  confirmPasswordBlur() {
    if(this.candidateRegisterForm.get('password')?.value && this.candidateRegisterForm.get('confirmPassword')?.value) {
      if(this.candidateRegisterForm.get('password')?.value === this.candidateRegisterForm.get('confirmPassword')?.value) {
        this.candidateRegisterForm.get('confirmPassword')?.setErrors(null);
      } else {
        this.candidateRegisterForm.get('confirmPassword')?.setErrors({ incorrect: true });
      }
    }
  }
  passwordValidation(val: any) {
    const txt = val;
    const numb = txt.match(/\d/g);
    const specialchar = txt.match(/[!@#$%^&*(),.?":{}|<>]/g);
    const stringonly = txt.match(/[a-zA-z]/g);
    if (specialchar) {
      this.uniqueflag = true;
    } else if (!specialchar) {
      this.uniqueflag = false;
    }
    if (stringonly) {
      this.charflag = true;
    } else if (!stringonly) {
      this.charflag = false;
    }
    if (numb) {
      this.numberflag = true;
    } else if (!numb) {
      this.numberflag = false;
    }
    if ((val.length) >= 8) {
      this.minflag = true;
    } else {
      this.minflag = false;
    }
    if (this.uniqueflag === true && this.numberflag === true && this.charflag === true && this.minflag === true) {
      this.isShow = false;
      this.candidateRegisterForm.get('password')?.setErrors(null);
    } else {
      this.isShow = true;
      this.candidateRegisterForm.get('password')?.setErrors({ incorrect: true });
    }
  }
  saveRegistration() {
    this.candidateRegisterForm.controls.userName.setValue(this.sanitizer.bypassSecurityTrustHtml(this.candidateRegisterForm.controls.userName.value));
    this.candidateRegisterForm.controls.userName.setValue(this.candidateRegisterForm.controls.userName.value.changingThisBreaksApplicationSecurity);
    this.candidateRegisterForm.controls.name.setValue(this.sanitizer.bypassSecurityTrustHtml(this.candidateRegisterForm.controls.name.value));
    this.candidateRegisterForm.controls.name.setValue(this.candidateRegisterForm.controls.name.value.changingThisBreaksApplicationSecurity);
    this.candidateRegisterForm.controls.emailId.setValue(this.sanitizer.bypassSecurityTrustHtml(this.candidateRegisterForm.controls.emailId.value));
    this.candidateRegisterForm.controls.emailId.setValue(this.candidateRegisterForm.controls.emailId.value.changingThisBreaksApplicationSecurity);
    
    this.candidateRegisterForm.controls.password.setValue(this.sanitizer.sanitize(SecurityContext.HTML,this.candidateRegisterForm.controls.password.value));
    this.candidateRegisterForm.controls.confirmPassword.setValue(this.sanitizer.sanitize(SecurityContext.HTML,this.candidateRegisterForm.controls.confirmPassword.value));
    this.candidateRegisterForm['controls']['address']['controls']['postalCode'].setValue(this.sanitizer.sanitize(SecurityContext.HTML,  this.candidateRegisterForm['controls']['address']['controls']['postalCode'].value));

  
    this.candidateRegisterForm['controls']['address']['controls']['addLine1'].setValue(this.sanitizer.sanitize(SecurityContext.HTML,  this.candidateRegisterForm['controls']['address']['controls']['addLine1'].value));
    this.candidateRegisterForm['controls']['address']['controls']['addLine2'].setValue(this.sanitizer.sanitize(SecurityContext.HTML,  this.candidateRegisterForm['controls']['address']['controls']['addLine2'].value));
    this.candidateRegisterForm['controls']['address']['controls']['addLine3'].setValue(this.sanitizer.sanitize(SecurityContext.HTML,  this.candidateRegisterForm['controls']['address']['controls']['addLine3'].value));
    if (this.candidateRegisterForm.valid) {
      // const cases: any[] = [];
      // this.authService.registerComps.forEach(element => {
      //   const caseComponent = {
      //     caseComponentId: 0,
      //     compId: element.compId,
      //     compName: element.compName,
      //     noOfComponent: element.noOfComponent,
      //     subCompFlag: (element.packageSubComponent && element.packageSubComponent.length > 0) ? true : false,
      //     active: element.active,
      //     caseSubComponent: [],
      //     maxNoOfComp: element.maxNoOfComp,
      //     currencyId: element.currencyId,
      //   };
      //   element.packageSubComponent.forEach(ele => {
      //     const caseSubComponent = {
      //       caseSubCompId: 0,
      //       subCompId: ele.subCompId,
      //       subCompName: ele.subCompName,
      //       noOfComponent: ele.noOfComponent,
      //       maxNoOfComp: ele.maxNoOfComp,
      //       active: element.active,
      //       currencyId: ele.currencyId,
      //       price: ele.price,
      //     };
      //     caseComponent.caseSubComponent.push(caseSubComponent);
      //   });
      //   cases.push(caseComponent);
      // });
      // this.candidateRegisterForm.get('caseComponent')?.setValue(cases);
      // this.authService.AddPaymentCandidateDetails(this.candidateRegisterForm.value).subscribe(res => {
      //   if (res) {
          this.showTopCenter('success', 'Success', 'Registred Successfully');

      
          this.authService.candidateRegisterFormValue = this.candidateRegisterForm.getRawValue();
          this.router.navigate(['/purchase/addtionalchecks']);
          // this.userType = 'CANDIDATE';
          // this.router.navigate(['/login']);
      //   }
      // });
    } else {
      this.candidateRegisterForm.markAllAsTouched();
    }
  }
  showTopCenter(level: string, info: string, message: string) {
    this.messageService.add({ severity: level, summary: info, detail: message });
  }
  // ngOnDestroy(): void {
  //   sessionStorage.setItem('userType', this.userType);
  // }
}
