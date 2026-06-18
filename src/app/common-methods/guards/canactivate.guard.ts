import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';


@Injectable({
  providedIn: 'root'
})
export class CanactivateGuard implements CanActivate {
  constructor(private common: CommonService, public dialog: MatDialog, private router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const authToken = JSON.parse(sessionStorage.getItem('user_data') as string);
    if (authToken) {
      if (authToken.auth_token) {
        let userroles: any[] = [];
        userroles = JSON.parse(sessionStorage.getItem('user_roles'));
        const routerData = route.data;
        const filterdata = userroles ? userroles.find(f => f.routingUrl === state.url) : null;
        if (filterdata) {
          this.common.screenName = filterdata.screenName;
          return (filterdata.addFlag || filterdata.deleteFlag || filterdata.editFlag || filterdata.viewFlag) ? true : false;
        } else {
          this.openDialog();
          return false;
        }
      } else {
        sessionStorage.removeItem('user_data');
        sessionStorage.clear();
        this.router.navigate(['/login']);
        return false;
      }
    } else {
      sessionStorage.removeItem('user_data');
      sessionStorage.clear();
      this.router.navigate(['/login']);
      this.router.navigate(['/login']);
      return false;
    }
  }
  public openDialog() {
    const popupData = {
      action: this.common.ALERT,
      headerText: 'Authorization',
      bodyText: 'You don' + '\'' + 't have permission for this screen, Please contact your Admin.'
    };
    this.dialog.open(CommonAlertsComponent, {
      width: '320px',
      data: popupData,
      disableClose: false
    });
  }
}
