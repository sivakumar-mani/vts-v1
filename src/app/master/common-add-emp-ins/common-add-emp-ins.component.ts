import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ResearchCommonEmpIns } from 'src/app/common-methods/models/researchQuesAns';

@Component({
  standalone: false,
  selector: 'app-common-add-emp-ins',
  templateUrl: './common-add-emp-ins.component.html',
  styleUrls: ['./common-add-emp-ins.component.css']
})
export class CommonAddEmpInsComponent implements OnInit {
  @Input() researchQA: ResearchCommonEmpIns;
  @Output() researchEmit = new EventEmitter<ResearchCommonEmpIns>();
  constructor() { }

  ngOnInit() {
  }
  researchemit() {
  this.researchEmit.emit(this.researchQA);
  }
}
