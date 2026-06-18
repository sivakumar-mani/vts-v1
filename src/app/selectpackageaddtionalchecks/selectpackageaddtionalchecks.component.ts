import { Component, OnInit } from '@angular/core';
import { AuthService } from '../common-methods/services/auth.service';
import { QualityCheckService } from '../common-methods/services/quality-check.service';

@Component({
  standalone: false,
  selector: 'app-selectpackageaddtionalchecks',
  templateUrl: './selectpackageaddtionalchecks.component.html',
  styleUrls: ['./selectpackageaddtionalchecks.component.css']
})
export class SelectpackageaddtionalchecksComponent implements OnInit {
  defaultPackList: any;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.GetACheckPacks()
  }
  GetACheckPacks() {
    this.authService.GetDefaultClientPackageDetails().subscribe(res => {
      this.defaultPackList = res;
    });
  }
  selectPack(id: any) {
    this.authService.defaultSelectedPackageList = this.defaultPackList.filter(x => x.packageId === id);
  }
}
