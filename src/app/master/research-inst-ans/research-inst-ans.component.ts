import { Component, OnInit, Input } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-research-inst-ans',
  templateUrl: './research-inst-ans.component.html',
  styleUrls: ['./research-inst-ans.component.css']
})
export class ResearchInstAnsComponent implements OnInit {
  @Input() typeansFlag: boolean;
  constructor() { }

  ngOnInit() {
  }

}
