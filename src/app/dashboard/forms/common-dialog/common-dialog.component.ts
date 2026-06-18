import { Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { MasterService } from '../../../common-methods/services/master.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserComponent } from '../../../master/user/user.component';
import { MessageService } from 'primeng/api';
import { CommonService } from '../../../common-methods/services/common.service';
import { MatMenuTrigger } from '@angular/material/menu';
import {MatChipInputEvent} from '@angular/material/chips';

export interface Fruit {
  name: string;
}
 
@Component({
  standalone: false,
  selector: 'app-common-dialog',
  templateUrl: './common-dialog.component.html',
  styleUrls: ['./common-dialog.component.css']
})
export class CommonDialogComponent implements OnInit {

  @Input() addDesignation = false;
  @Input() bindingValue: string;
  @Input() userId: any;
  designationForm: UntypedFormGroup;
  @ViewChild('confirm', { static: true }) confirm!: MatMenuTrigger;
  action: any;


  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  //readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  fruits: Fruit[] = [
    {name: 'Lemon'},
    {name: 'Lime'},
    {name: 'Apple'},
  ];
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.fruits.push({name: value.trim()});
    }
    if (input) {
      input.value = '';
    }
  }

  remove(fruit: Fruit): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  
  constructor(private fb: UntypedFormBuilder, public masterService: MasterService, private messageService: MessageService,
    public dialogRef: MatDialogRef<UserComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public common: CommonService) {
    this.action = data;
    // console.log(this.action, 'this.action');
  }

  content = 0;
  ngOnInit() {
    if (this.addDesignation) {
      this.initFormGroup();
      this.designationForm.controls.designation.setValue(this.bindingValue);
    }

  }
  initFormGroup() {
    this.designationForm = this.fb.group({
      designation: ['', [Validators.required]],
      description: new UntypedFormControl(),
    });
  }
  onSubmit() {
    if (this.designationForm.get('designation')?.value) {
      this.masterService.saveDesignation(this.designationForm.controls.designation.value,
        this.designationForm.controls.description.value, this.userId).subscribe(resp => {
          if (resp.success) {
            // console.log(resp, 'dialoResp');
            this.showTopCenter('success', 'Success Message', 'Saved Successfully');
            this.common.newDesignation = resp.value;
            this.dialogRef.close();
          }
        });
    } else {
      this.designationForm.get('designation')?.setValidators(Validators.required);
    }
  }
  onCancel(): void {
    this.dialogRef.close();
  }
  // tslint:disable-next-line:adjacent-overload-signatures
  onSubmitFunction() {
    this.dialogRef.close({
      id: this.action,
    });
  }
  showTopCenter(level: string, info: string, message: string) {
    this.messageService.add({ severity: level, summary: info, detail: message });
  }
}
