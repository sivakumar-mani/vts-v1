import { Component, OnInit, Input } from '@angular/core';
import { DynamicData, Dropdown, Textbox } from '../../models/dynamic-data';
import { UntypedFormGroup } from '@angular/forms';
import {DynamicControlService } from '../../services/dynamic-control.service';

@Component({
  standalone: false,
  selector: 'app-dynamic-forms',
  templateUrl: './dynamic-forms.component.html',
  styleUrls: ['./dynamic-forms.component.css']
})
export class DynamicFormsComponent implements OnInit {
  @Input() questions: DynamicData<any>[] = [];
  form: UntypedFormGroup;
  payLoad = '';

  constructor(private qcs: DynamicControlService) {  }

  ngOnInit() {
    this.questions = this.getQuestions();
    this.form = this.qcs.toFormGroup(this.questions);
  }

  onSubmit() {
    this.payLoad = JSON.stringify(this.form.value);
  }

  getQuestions() {

    const questions: DynamicData<any>[] = [

      new Dropdown({
        key: 'brave',
        label: 'Bravery Rating',
        options: [
          {key: 'solid',  value: 'Solid'},
          {key: 'great',  value: 'Great'},
          {key: 'good',   value: 'Good'},
          {key: 'unproven', value: 'Unproven'}
        ],
        order: 3
      }),

      new Textbox({
        key: 'firstName',
        label: 'First name',
        value: 'Bombasto',
        required: true,
        order: 1
      }),

      new Textbox({
        key: 'emailAddress',
        label: 'Email',
        type: 'email',
        order: 2
      })
    ];

    return questions.sort((a, b) => a.order - b.order);
  }

}
