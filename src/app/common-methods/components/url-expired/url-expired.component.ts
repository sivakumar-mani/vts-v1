import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-url-expired',
  templateUrl: './url-expired.component.html',
  styleUrls: ['./url-expired.component.css']
})
export class UrlExpiredComponent implements OnInit {

  constructor(private route : Router) { }

  ngOnInit() {
    
  }
  backToHome() {
    sessionStorage.removeItem('user_data');
    sessionStorage.clear();
    this.route.navigate(['/']);
  }
}
