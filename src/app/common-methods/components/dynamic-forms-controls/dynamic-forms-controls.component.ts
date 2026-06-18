import { Component, OnInit, Input } from '@angular/core';
import {  DynamicData } from '../../models/dynamic-data';
import { UntypedFormGroup } from '@angular/forms';

@Component({
  standalone: false,
  selector: 'app-dynamic-forms-controls',
  templateUrl: './dynamic-forms-controls.component.html',
  styleUrls: ['./dynamic-forms-controls.component.css']
})
export class DynamicFormsControlsComponent {
  @Input() question: DynamicData<any>;
  @Input() form: UntypedFormGroup;
  get isValid() { return this.form.controls[this.question.key].valid; }
}
