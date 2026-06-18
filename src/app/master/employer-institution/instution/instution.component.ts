import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../common-methods/services/common.service';

@Component({
  standalone: false,
  selector: 'app-instution',
  templateUrl: './instution.component.html',
  styleUrls: ['./instution.component.css']
})
export class InstutionComponent implements OnInit {

  constructor(public common: CommonService) { }

  ngOnInit() {
  }

}
