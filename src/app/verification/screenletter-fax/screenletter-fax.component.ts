import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { VerificationService } from 'src/app/common-methods/services/verification.service';

@Component({
  standalone: false,
  selector: 'app-screenletter-fax',
  templateUrl: './screenletter-fax.component.html',
  styleUrls: ['./screenletter-fax.component.css']
})
export class ScreenletterFaxComponent implements OnInit {
  btnBack = true;
  routePath = 'Screening Letter-Fax';
  todayDate = new Date();
  @ViewChild('emp', { static: true }) emp: ElementRef;
  @ViewChild('edu', { static: true }) edu: ElementRef;
  @ViewChild('comp', { static: true }) comp: ElementRef;
  refNum: any;
  constructor(private router: Router, public verification: VerificationService) { }

  ngOnInit() {
    if (this.verification.tempData) {
      this.refNum = this.verification.tempData.verificationId.replace(/\D/g, '');
    }
  }
  getWord(fileName: any) {
    const filename = fileName + '.doc';
    // tslint:disable-next-line:max-line-length
    const preHtml = '<html xmlns:o=\'urn:schemas-microsoft-com:office:office\' xmlns:w=\'urn:schemas-microsoft-com:office:word\' xmlns=\'http://www.w3.org/TR/REC-html40\'><body>';
    const postHtml = '</body></html>';
    let nElement = '';
    if (this.emp) {
      nElement = this.emp.nativeElement.innerHTML;
    } else if (this.edu) {
      nElement = this.edu.nativeElement.innerHTML;
    } else if (this.comp) {
      nElement = this.comp.nativeElement.innerHTML;
    }
    const html = (preHtml + nElement + postHtml).toString();
    const blob = new Blob(['\ufeff', html], {
      type: 'application/msword'
    });
    const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
    const downloadLink = document.createElement('a');

    document.body.appendChild(downloadLink);

    if ((navigator as any).msSaveOrOpenBlob) {
      (navigator as any).msSaveOrOpenBlob(blob, filename);
    } else {
      downloadLink.href = url;
      downloadLink.download = filename;
      downloadLink.click();
    }
    document.body.removeChild(downloadLink);
  }
  closeForm() {
    this.router.navigate(['dashboard/verification/verificationDetail']);
  }
}
