import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MasterService } from '../../services/master.service';
import { SharedService } from '../../services/shared.service';
@Component({
  standalone: false,
  selector: 'app-captcha-component',
  templateUrl: './captcha-component.component.html',
  styleUrls: ['./captcha-component.component.css']
})
export class CaptchaComponentComponent implements OnInit {

  captchaValue = new Captcha();
  @Output() isCaptchaValid = new EventEmitter<boolean>();

  constructor(private masterService: MasterService, private sharedService: SharedService) { }

  ngOnInit() {
    this.bindCaptcha();
  }

  // bindCaptcha() {
  //   this.masterService.getCaptcha().subscribe((res) => {
  //     this.captchaValue = res as any;
  //   }, err => { console.error(err); }, () => {
  //     document.getElementById("captchaId")['src'] = "data:image/png;base64," + this.captchaValue.captchaDoc;
  //   });
  // }

  bindCaptcha() {
  this.masterService.getCaptcha().subscribe((res) => {
    this.captchaValue = res as any;
  }, err => { console.error(err); }, () => {
    const captchaEl = document.getElementById("captchaId");
    if (captchaEl) {                                          // ← guard
      (captchaEl as HTMLImageElement).src = 
        "data:image/png;base64," + this.captchaValue.captchaDoc;
    }
  });
}

  validateCaptcha() {
    if (!this.captchaValue.captchaInput) {
      this.isCaptchaValid.emit(false);
      return;
    }
    const captcha = this.captchaValue.captchaInput === this.captchaValue.captchaCode;
    if (!captcha) {
      this.bindCaptcha(); return;
    } else {
      this.isCaptchaValid.emit(captcha);
    }
  }
}

class Captcha {
  captchaCode: string;
  captchaDoc: any[];
  captchaInput = '';
}
