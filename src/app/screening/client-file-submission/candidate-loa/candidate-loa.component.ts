import { AfterContentChecked, Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormArray } from '@angular/forms';
import { ScreeningDocument } from 'src/app/common-methods/models/screening-details';
import { User } from 'src/app/common-methods/models/user';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { DatePipe } from '@angular/common';
import { CommonService } from 'src/app/common-methods/services/common.service';
@Component({
  standalone: false,
  selector: 'app-candidate-loa',
  templateUrl: './candidate-loa.component.html',
  styleUrls: ['./candidate-loa.component.css']
})
export class CandidateLoaComponent implements OnInit{
  
  userData = new User();
  @Input() mainForm: UntypedFormGroup;
  @Input() formgroupName: string;
  @Input() screeningDocument: ScreeningDocument[] = [];
  doctType: any[] = [];
  constructor(public screeningService: ScreeningService,public datepipe:DatePipe,public common: CommonService) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.getScreeningDocumentType();
    if (this.userData.applicationId === 3) {
          if (this.mainForm.get(this.formgroupName + '.consentLookupName').value === 'EConsent') {
            this.agreeChange();
          }
        }
    
  }
  // ngAfterContentChecked(): void {
  //   if (this.userData.applicationId === 3) {
  //     if (this.mainForm.get(this.formgroupName + '.consentLookupName').value === 'EConsent') {
  //       
  //     }
  //   }
  // }
  agreeChange() {
    this.mainForm.get(this.formgroupName) as UntypedFormArray;
    if (this.mainForm.get(this.formgroupName + '.iagreeFlag').value) {      
       this.common.currentDateTime =this.datepipe.transform((new Date), 'dd/MM/yyyy h:mm a');
      this.mainForm.get(this.formgroupName + '.consentSignature').enable();
      const firstName=this.mainForm.get(this.formgroupName + '.aliasFirstName').value
      const middleName=this.mainForm.get(this.formgroupName + '.aliasMiddleName').value
      const lastName=this.mainForm.get(this.formgroupName + '.aliasLastName').value
      this.mainForm.get(this.formgroupName + '.consentSignature').setValue(firstName+middleName+lastName);
      this.mainForm.get(this.formgroupName + '.iagreeFlag').setValue(true);
      //this.mainForm.get(this.formgroupName + '.consentSignature').disable();
      //this.mainForm.get(this.formgroupName + '.iagreeFlag').setValue(false);

    } else {
      this.common.currentDateTime ='';
      this.mainForm.get(this.formgroupName + '.consentSignature').setValue('');
      this.mainForm.get(this.formgroupName + '.consentSignature').disable();
      this.mainForm.get(this.formgroupName + '.iagreeFlag').setValue(false);
    }
  }
  getScreeningDocumentType() {
    this.screeningService.getScreeningDocumentType().subscribe(resp => {
      if (resp) {
        this.doctType = resp;
      }
    });
  }
}
