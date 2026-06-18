import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ClientService } from 'src/app/common-methods/services/client.service';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';

@Component({
  standalone: false,
  selector: 'app-client-instructions',
  templateUrl: './client-instructions.component.html',
  styleUrls: ['./client-instructions.component.css']
})
export class ClientInstructionsComponent implements OnInit {
  instructionForm: UntypedFormGroup;
  @Input() mainForm: UntypedFormGroup;
  @Input() bindData: any;
  // isDesc: boolean;
  // column: any;
  // direction: number;
  itemPerPage = 10;
  page = 1;
  @Input() filterLength: number;
  index = -1;
  @Output() deleteEvent = new EventEmitter<any>();
  compList: any;

  constructor(public clientService: ClientService, public commonService: CommonService, private fb: UntypedFormBuilder) { }

  ngOnInit() {
    this.instructionForm = this.initFormGroup();
    this.compList = this.bindData.component.filter(o1 => this.mainForm.value.componentEntry.some(o2 => o1.serviceId  === o2.componentId));
    this.compList = this.compList.filter((el, i, a) => i === a.indexOf(el));
  }
  initFormGroup() {
    return this.fb.group({
      clientPolicyId: new UntypedFormControl(0),
      instructionTypeId: new UntypedFormControl(null),
      componentId: new UntypedFormControl(null),
      instruction: new UntypedFormControl('', Validators.required)
    });
  }
  AddInstruction() {
    if (this.instructionForm.valid && this.instructionForm.get('instructionTypeId')?.value) {
      const clientInstruction = this.mainForm.get('clientInstruction')?.value;
      if (this.index > -1) {
        clientInstruction[this.index] = this.instructionForm.getRawValue();
      } else {
        clientInstruction.push(this.instructionForm.getRawValue());
      }
      this.mainForm.get('clientInstruction')?.setValue(clientInstruction);
      this.clientService.showTopCenter('success', 'Success Message', (this.index > -1 ? 'Updated' : 'Saved') + ' Successfully');
      this.resetInstruction();
    } else {
      this.instructionForm.markAllAsTouched();
      this.instructionForm.get('instructionTypeId')?.setValidators(Validators.required);
      this.instructionForm.get('instructionTypeId')?.updateValueAndValidity();
    }
  }
  resetInstruction() {
    this.index = -1;
    this.instructionForm = this.initFormGroup();
  }
  instructionChange(value: any) {
    const val = this.commonService.getNameById(this.bindData.instructionType, 'lookUpId', 'lookUpName', value);
    if (val.toLowerCase() === this.commonService.GEN_INS.toLowerCase()) {
      this.instructionForm.get('componentId')?.setValue(null);
      this.instructionForm.get('componentId')?.clearValidators();
    } else {
      this.instructionForm.get('componentId')?.setValidators(Validators.required);
    }
    this.instructionForm.get('componentId')?.updateValueAndValidity();
  }
  checkLength(editor: any) {
    if (editor?.textArea?.nativeElement?.innerText) {
      return editor?.textArea?.nativeElement?.innerText?.length;
    }
  }
  textChanged(event, editor) {
    const maxLength = editor.textArea.nativeElement.innerText.length;
    if (maxLength && maxLength > 3000 && event.key) {
      event.preventDefault();
      return false;
    }
  }
  editInstruction(data, ind) {
    this.index = ind;
    this.commonService.goToTop();
    this.instructionForm.patchValue(data);
  }
  public openDialog(ind: any) {
    this.deleteEvent.emit({
      data: ind, hText: 'Confirmation', bText: 'Are you sure you want to delete this record?',
      method1: 'instructionScreen', method2: 'deleteInstruction', methodNo: null
    });
  }
  deleteInstruction(ind: any) {
    this.mainForm.get('clientInstruction')?.value.splice(ind, 1);
    this.mainForm.get('clientInstruction')?.setValue(this.mainForm.get('clientInstruction')?.value);
    this.clientService.showTopCenter('warn', 'Success Message', 'Deleted Successfully');
    this.commonService.goToTop();
  }
  getFilterLen(c): string {
    this.filterLength = c;
    return 'listrow';
  }
  // sortBy(type: any) {
  //   this.isDesc = !this.isDesc;
  //   this.column = type;
  //   this.direction = this.isDesc ? 1 : -1;
  // }
  getPage(event: any) {
    this.page = event;
  }
  preventInfinite() {
    if (!this.itemPerPage) {
      this.itemPerPage = 1;
    }
  }
}
