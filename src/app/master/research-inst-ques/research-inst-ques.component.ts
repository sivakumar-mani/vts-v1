import { Component, OnInit, Input } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-research-inst-ques',
  templateUrl: './research-inst-ques.component.html',
  styleUrls: ['./research-inst-ques.component.css']
})
export class ResearchInstQuesComponent implements OnInit {
  @Input() streamFlag: boolean;
  constructor() { }

  ngOnInit() {
  }

}
