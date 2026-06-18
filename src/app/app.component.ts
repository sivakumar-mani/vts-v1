import { Component, AfterViewChecked, ChangeDetectorRef, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { AuthService } from './common-methods/services/auth.service';
import { SharedService } from '../app/common-methods/services/shared.service';
import { IdleService as BnNgIdleService } from './common-methods/services/idle.service';
import { Router, RouteConfigLoadStart, NavigationEnd, RouteConfigLoadEnd } from '@angular/router';
import { CommonService } from './common-methods/services/common.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonAlertsComponent } from './common-methods/common-alerts/common-alerts.component';
import { NgxSpinnerService } from 'ngx-spinner';
//import { NotificationService } from './common-methods/services/notification.service';
import { filter } from 'rxjs/operators';
import { TabPreventionService } from './tab-prevention.service';

@Component({
  standalone: false,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewChecked, OnInit {
  show = false;
  title = 'Vts';
  modalPromise: any;
  timeout: any;
  session = false;
  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload($event?: BeforeUnloadEvent) {
    if (sessionStorage.getItem('user_data')) {
      return false;
    }
  }

  constructor(public authService: AuthService, private router: Router, private common: CommonService,
    private sharedService: SharedService, private cdRef: ChangeDetectorRef,/* private notificationService: NotificationService,*/
    public dialog: MatDialog, private bnIdle: BnNgIdleService, private spinnerLoader: NgxSpinnerService, private tabPreventionService: TabPreventionService) {
    this.bnIdle.startWatching(1800).subscribe((res) => {
      if (res) {
        const userData = JSON.parse(sessionStorage.getItem('user_data') as string);
        if (userData && userData.userId > 0) {
          this.bnIdle.stopTimer();
          this.timeout = setTimeout(() => {
            this.common.removebutton.next('Hide');
          }, 90000);
          // this.bnIdle.resetTimer();
          this.removeLocalStoreage();
          if (this.session == false) {
            this.openDialog();
          }
        }
      }
    });
    this.sharedService.changeEmittedLoading$.subscribe(
      (element) => {
        this.show = element.showLoader;
        this.cdRef.detectChanges();
      });
  }
  ngOnInit() {
    // this.notificationService.createConnection();
    // this.notificationService.startConnection();
    // this.notificationService.registerOnServerEvents();

    this.onBeforeUnload();
    // Check if this is the first tab
    this.tabPreventionService.isFirstTab();
    // if (document.cookie.indexOf('_instance=true') === -1) {
    //   document.cookie = '_instance=true';
    //   window.onunload = (e) => {
    //     document.cookie = '_instance=true;expires=Thu, 01-Jan-1970 00:00:01 GMT';
    //   };
    // } else {
    //   alert('Security Alerts. You cannot open this site in multiple tabs. This window will now close.');
    //   window.open('about:blank', '_self');
    // }
    this.router.events.subscribe(event => {
      if (event instanceof RouteConfigLoadStart) {
        this.sharedService.emitChangeLoading({
          showLoader: true,
        });
      } else if (event instanceof RouteConfigLoadEnd) {
        this.sharedService.emitChangeLoading({
          showLoader: false,
        });
      }
    });

    // Loading progress
    this.spinnerLoader.show();
    // setTimeout(() => {
    // this.spinnerLoader.hide();
    // }, 2000);
    this.removeLocalStoreage();
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }
  public openDialog() {

    const popupData = {
      action: this.common.SESSIONOUT,
      headerText: 'Session Expiring!',
      bodyText: 'Your session is about to expire. please login again!'
    };
    const dialogRef = this.dialog.open(CommonAlertsComponent, {
      width: '400px',
      data: popupData,
      disableClose: true
    });
    // setTimeout(() => {
    //       this.dialog.closeAll();
    //       this.authService.userdata = [];
    //       sessionStorage.removeItem('user_data');
    //       sessionStorage.clear();
    //       this.router.navigate(['/login']);

    //     this.bnIdle.startWatching(600);

    //   clearTimeout(this.timeout);
    //   this.common.removebutton.next('Show');
    // }, 10000);

    if (dialogRef) {
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const action = String(result.type);
          if (action === this.common.SESSIONOUT) {
            // tslint:disable-next-line:no-unused-expression);
            this.dialog.closeAll();
            this.authService.userdata = [];
            sessionStorage.removeItem('user_data');
            sessionStorage.clear();
            this.router.navigate(['/login']);
          } else if (action === this.common.SESSIONSTAYTIME) {
            // const userData = JSON.parse(sessionStorage.getItem('user_data') as string);
          }
          this.bnIdle.startWatching(600);
        }
        clearTimeout(this.timeout);
        this.common.removebutton.next('Show');
      });
    }
  }

  removeLocalStoreage() {
    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const currentRoute = event.url;
        if (currentRoute === "/" || currentRoute === "/login") {
          sessionStorage.removeItem('user_data');
          return this.session = true;
        }
        else {
          return this.session = false
        }
      });
  }
}
