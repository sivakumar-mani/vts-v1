import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/common-methods/services/common.service';

@Component({
  standalone: false,
  selector: 'app-license-creation',
  templateUrl: './license-creation.component.html',
  styleUrls: ['./license-creation.component.css']
})
export class LicenseCreationComponent implements OnInit {

  constructor(public common: CommonService) { }

  ngOnInit() {
  }

}
