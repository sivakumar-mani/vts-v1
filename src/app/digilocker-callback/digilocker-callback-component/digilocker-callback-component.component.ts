import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { param } from 'jquery';
import { Candidate } from 'src/app/common-methods/models/filecreation';
import { DigilockerAuthService } from 'src/app/common-methods/services/digiLocker/digilocker-auth.service';

@Component({
  standalone: false,
  selector: 'app-digilocker-callback-component',
  templateUrl: './digilocker-callback-component.component.html',
  styleUrls: ['./digilocker-callback-component.component.css']
})
export class DigilockerCallbackComponentComponent implements OnInit {

  constructor(private route: ActivatedRoute, private digilockerAuth: DigilockerAuthService) { }
  candidateId: number;
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.candidateId = params['CandidateId'];
    });
  }
  async ProceedClick() {
    await this.digilockerAuth.proceedVerification(this.candidateId);
  }
}
