import { Injectable } from '@angular/core';
import { DynamicData } from '../models/dynamic-data';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class DynamicControlService {

  constructor() { }

  toFormGroup(questions: DynamicData<any>[] ) {
    const group: any = {};

    questions.forEach(question => {
      group[question.key] = question.required ? new UntypedFormControl(question.value || '', Validators.required)
                                              : new UntypedFormControl(question.value || '');
    });
    return new UntypedFormGroup(group);
  }
}
