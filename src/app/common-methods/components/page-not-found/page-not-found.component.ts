import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {
  constructor(private route: Router) { }

  ngOnInit() {
  }
  backToHome() {
    sessionStorage.removeItem('user_data');
    sessionStorage.clear();
    this.route.navigate(['/']);
  }
}
