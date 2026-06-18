import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';

@Component({
  standalone: false,
  selector: 'app-phone-field',
  templateUrl: './phone-field.component.html',
  styleUrls: ['./phone-field.component.css']
})
export class PhoneFieldComponent implements OnInit {
  parts: UntypedFormGroup;
  constructor(private formBuilder: UntypedFormBuilder, ) {
  }

  ngOnInit() {
    this.parts = this.formBuilder.group({
      area: '',
      exchange: '',
      subscriber: '',
    });
  }

}
