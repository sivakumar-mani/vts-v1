import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DigilockerAuthService } from '../common-methods/services/digiLocker/digilocker-auth.service';

@Component({
  standalone: false,
  selector: 'app-auth-callback',
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.css']
  //template: '<p>Authenticating with DigiLocker...</p>'
})
export class AuthCallbackComponent implements OnInit {
  constructor(private route: ActivatedRoute, private authService: DigilockerAuthService) { }
  processSteps: string;
  ngOnInit() {
    this.processSteps = "Authenticating with DigiLocker...";
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      const codeVerifierReq = params['state'];
      if (code) {
        console.log(code);
        console.log(codeVerifierReq);
        this.authService.GetCallBack(code, codeVerifierReq).subscribe(response => {
          if (response) {
            console.log(response);
            this.processSteps = (response != null && response.isSuccess) ? response.message : "";
          }
        });
      }
      console.log('callback succeeded!!');
    });
  }
}
