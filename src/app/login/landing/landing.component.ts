import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit, OnDestroy {
  userType: 'KRYA' | 'CANDIDATE' | 'CLIENT' | 'EMPTY';
  applicationId = '';
  userName = '';
  password = '';
  constructor(private commonService: CommonService, private route: ActivatedRoute, private router: Router) {
    this.userType = 'EMPTY';
    this.route.queryParams.subscribe(params => {
      if (params) {
        this.applicationId = params['appId'];
        if (this.applicationId === '3') {
        this.userType = 'CANDIDATE';
        this.router.navigate(['/login']);
      }
        this.userName = params['uid'];
        this.password = params['pwd'];
        this.commonService.userName = this.userName;
        this.commonService.password = this.password;
      }
    });
  }

  ngOnInit() {
    if (this.applicationId && this.userName && this.password) {
      if (this.applicationId === '3') {
        this.userType = 'CANDIDATE';
      }
      else if(this.applicationId === '2')
      {
        this.userType = 'CLIENT';
      }
      
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy(): void {
    sessionStorage.setItem('userType', this.userType);
  }


}
