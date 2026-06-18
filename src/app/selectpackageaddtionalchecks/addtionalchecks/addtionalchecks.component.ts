import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { CommonService } from 'src/app/common-methods/services/common.service';
import{Router} from '@angular/router'
import { MessageService } from 'primeng/api';
@Component({
  standalone: false,
  selector: 'app-addtionalchecks',
  templateUrl: './addtionalchecks.component.html',
  styleUrls: ['./addtionalchecks.component.css']
})
export class AddtionalchecksComponent implements OnInit {
  defaultCompList: any;
  userType: string;

  constructor(public authService: AuthService, public commonService: CommonService,public router:Router, private message: MessageService) { }

  ngOnInit() {
    // package screen hide start
    // if (this.authService.defaultSelectedPackageList.length === 0) {
    //   this.router.navigateByUrl('/Selectpackage-addtional-check')
    // }
    // package screen hide end
    this.GetACheckComps()
  }
  GetACheckComps() {
    this.authService.GetDefaultClientComponentDetails().subscribe(res => {
      if (res) {
        this.showTopCenter('success', 'Success', 'Registred Successfully');
        this.defaultCompList = res;
        // this.defaultCompList.forEach(element => {
        //   element.checked = false;
        //   element.packageSubComponent.forEach(ele => {
        //     ele.checked = false;
        //   });
        // });
      }
    });
  }
  getTotalOfComps() {
    let ret = 0;
    if (this.defaultCompList && this.defaultCompList.length > 0) {
      this.defaultCompList.forEach(element => {
        if (element.checked === true) {
          ret = ret + (element.noOfComponent * element.price);
        }
        element.packageSubComponent.forEach(ele => {
          if (ele.checked === true) {
            ret = ret + (ele.noOfComponent * ele.price);
          }
        });
      });
    }
    return ret;
  }
  getTotalTax() {
    // if(this.authService.defaultSelectedPackageList.length!==0){
      // package screen hide start
    // const total = this.authService.defaultSelectedPackageList[0].fees + this.getTotalOfComps();
    const total = this.getTotalOfComps(); // replace
        // package screen hide end
    const tax = total * (5/100);
    return tax;
   // }
    // else
    // {
    // this.router.navigateByUrl('/Selectpackage-addtional-check')
    // }
  }
  getCheckedComps() {
    let val = false;
    if (this.defaultCompList && this.defaultCompList.length > 0) {
      val = this.defaultCompList.some(x => x.checked === true) || this.defaultCompList.filter(x => x.packageSubComponent.some(y => y.checked === true)).length > 0;
    }
    return val;
  }
  goToRegistration() {
    if (this.defaultCompList && this.defaultCompList.length > 0) {
      this.authService.registerComps = this.defaultCompList.filter(x => x.checked === true || x.packageSubComponent.some(y => y.checked === true));
      if (this.authService.registerComps.length === 0) {
        this.showTopCenter('warn', 'Failure Message', 'Please select atleast one component');
        return;
      }
      this.authService.registerComps.forEach(element => {
        element.packageSubComponent = element.packageSubComponent.filter(x => x.checked === true);
      });
      // this.router.navigateByUrl('/canidateregistraion');
      /////
      const cases: any[] = [];
      this.authService.registerComps.forEach(element => {
        const caseComponent = {
          caseComponentId: 0,
          compId: element.compId,
          compName: element.compName,
          noOfComponent: element.noOfComponent,
          subCompFlag: (element.packageSubComponent && element.packageSubComponent.length > 0) ? true : false,
          active: element.active,
          caseSubComponent: [],
          maxNoOfComp: element.maxNoOfComp,
          currencyId: element.currencyId,
        };
        element.packageSubComponent.forEach(ele => {
          const caseSubComponent = {
            caseSubCompId: 0,
            subCompId: ele.subCompId,
            subCompName: ele.subCompName,
            noOfComponent: ele.noOfComponent,
            maxNoOfComp: ele.maxNoOfComp,
            active: element.active,
            currencyId: ele.currencyId,
            price: ele.price,
          };
          caseComponent.caseSubComponent.push(caseSubComponent);
        });
        cases.push(caseComponent);
      });
      this.authService.candidateRegisterFormValue.caseComponent = cases;
      this.authService.AddPaymentCandidateDetails(this.authService.candidateRegisterFormValue).subscribe(res => {
        if (res) {
        this.showTopCenter('success', 'Success', 'Candidate Created Successfully');
        // this.authService.candidateRegisterFormValue = this.candidateRegisterForm.getRawValue();
        // this.router.navigate(['/purchase/addtionalchecks']);
        this.userType = 'CANDIDATE';
        this.router.navigate(['/login']);
      }
    });
    ////
    }
  }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }
  additionalSelect(event, data) {
    if (event.checked === true) {
      data.noOfComponent = 1;
    } else {
      data.noOfComponent = 0;
    }
  }
  ngOnDestroy(): void {
    sessionStorage.setItem('userType', this.userType);
  }
}
