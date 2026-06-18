import { Component, OnInit, ViewChild, HostListener, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { MatAccordion, MatExpansionPanel } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { SharedService } from 'src/app/common-methods/services/shared.service';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { ChangePasswordDialogComponent } from 'src/app/common-methods/components/change-password-dialog/change-password-dialog.component';


@Component({
  standalone: false,
  selector: 'app-dboard',
  templateUrl: './dboard.component.html',
  styleUrls: ['./dboard.component.css']
})
export class DboardComponent implements OnInit {

  @ViewChild('secDrawer', { static: true }) secDrawer!: MatSidenav;
 @ViewChild(MatAccordion, { static: true }) accordion!: MatAccordion;;
  @ViewChild('logoutAlert', { static: true }) logoutAlert: TemplateRef<any>;
  usermailId: string; lastLogIn: Date;
  sidenNavOpen = 0; selectId = 0;
  menuList: any[] = [];
  screenName: any[] = [];
  moduleName: any[] = [];
  subModuleName: any[] = [];
  menuHeading: any[] = [];
  showButtons: any;
  routePath: any;
  authorizedmenuList: any[] = [];
  authorizedmenuHeadingList: any[] = [];
  menuItemsList: any[] = [];
  multi = false;
  displayMode = 'default';
  openState: boolean;
  scrnId: any;
  newId: number;
  isShow: boolean;
  topPosToStartShowing = 100;
  notificationCount: any;
  lstNotificationDetail: any[] = [];
  constructor(public router: Router, private messageService: MessageService, public common: CommonService,
    private sharedService: SharedService, public authService: AuthService, public dialog: MatDialog,
    private _bottomSheet: MatBottomSheet, private master: MasterService) {
    this.sharedService.changeEmitted$.subscribe(
      (element) => {
        this.messageService.add({ severity: element.severity, summary: element.summary, detail: element.detail });
      });
  }
  isPageLoad = false;
  currentOpenId = 1;
  userData: any; userName = '';
  ngOnInit() {
    this.showButtons = 'HIDE';
    this.opendDrawer(1);
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.getMenuList();
    this.lastLogIn = new Date(this.userData.lastLogIn);
    const name = this.userData.firstName + ' ' + this.userData.lastName;
    if (this.userData) {
      this.userName = (this.userData.lastName) ? this.userData.firstName.charAt(0).toUpperCase() +
        this.userData.lastName.charAt(0).toUpperCase() : this.userData.firstName.charAt(0).toUpperCase();
      // (name.split(' ').length - 1) > 0 ? name.split(' ')[0].charAt(0).toUpperCase() +
      //   name.split(' ')[1].charAt(0).toUpperCase() : name.charAt(0).toUpperCase();
    }
    this.screenPermision();
    this.common.flagEvents$.subscribe(resp => {
      if (resp) {
        this.showButtons = resp[0];
        this.routePath = resp[1];
      }
    });
    // if (this.sharedService.subsVar === undefined) {
    //   this.sharedService.subsVar =
    this.sharedService.
      chengesecDrawer.subscribe(res => {
        this.colseDrawer();
      });
    // }
  }
  colseDrawer() {
    this.secDrawer.close();
    // this.sharedService.subsVar.unsubscribe();
  }
  opendDrawer(sidenNavOpen: any) {
    this.currentOpenId = sidenNavOpen;
    this.isPageLoad = true;
    this.sidenNavOpen = sidenNavOpen;
    if (sidenNavOpen > 0 || (this.currentOpenId > 0 && sidenNavOpen === 0)) {
      this.secDrawer.open();
    }
  }

  openLogoutDialog() {
    const dialog = this.dialog.open(this.logoutAlert, {
      width: '320px',
    });
  }
  logout() {
    const home = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.authService.LogOut(home.userId, home.logId).subscribe(res => {
      if (res.success) {
        this.dialog.closeAll();
        sessionStorage.removeItem('user_data');
        sessionStorage.clear();
        this.router.navigate(['/']);
        this.common.insuffCountFlag = false;
        this.common.caseFlag = false;
        this.common.VeCountFlag = false;
        this.common.qcCountFlag = false;
        this.sharedService.clientApprovalUrl = '';
      }
    }, err => { }, () => { });
  }

  addSingle() {
    this.messageService.add({ severity: 'success', summary: 'Service Message', detail: 'Via MessageService' });
  }

  screenPermision() {
    const permissionAvailable = JSON.parse(sessionStorage.getItem('user_roles'));
    const screenName: any[] = [];
    const moduleName: any[] = [];
    const subModuleName: any[] = [];
    let strScreenName = '';
    let subModuleNamestr = '';
    if (permissionAvailable) {
      permissionAvailable.map(m => {
        screenName.push(m.screenName.toUpperCase());
        if (moduleName.indexOf(m.moduleName.toUpperCase()) === -1) {
          moduleName.push(m.moduleName.toUpperCase());
        }
        if (subModuleName.indexOf(m.subModuleName.toUpperCase()) === -1) {
          if (m.subModuleName) {
            subModuleName.push(m.subModuleName.toUpperCase());
          }
        }
      });
    }
    this.authorizedmenuHeadingList = Object.assign([], this.menuHeading.filter(f =>
      moduleName.indexOf(f.menu.toUpperCase()) > -1));

    this.authorizedmenuList = Object.assign([], this.menuList.filter(f => {
      strScreenName = f.screenName ? f.screenName.toUpperCase() : '';
      subModuleNamestr = f.subModuleName ? f.subModuleName.toUpperCase() : '';
      if ((screenName.indexOf(strScreenName) > -1) || subModuleName.indexOf(subModuleNamestr) > -1) {
        return true;
      } else {
        return false;
      }
    }));
    this.authorizedmenuList = this.authorizedmenuList.filter(e => {
      if (e.subModuleName ? e.subModuleName.toUpperCase() : '') {
        e.children = e.children.filter(c => (screenName.indexOf(c.screenName.toUpperCase()) > -1));
        e = e;
        if (e.children.length > 0) { return true; }
      } else {
        return true;
      }
    });
  }
  hideMainModule(moduleName): boolean {
    return this.authorizedmenuHeadingList.some(f => f.menu.toUpperCase() === moduleName.toUpperCase());
    // return filter.length > 0 ? true : false;
  }
  public openDialog() {
    const popupData = {
      action: this.common.CHANGEPASSWORD,
      headerText: 'Change Password',
      bodyText: ''
    };
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
      width: '400px',
      data: popupData,
      disableClose: true
    });
    if (dialogRef) {
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const action = String(result.type);
          if (action === this.common.CHANGEPASSWORD) {
            this.router.navigate(['/login']);
          }
        }
      });
    }
  }

  moduleClick(screenId: any) {
    // this.authorizedmenuList.filter(e => e.)
    this.selectId = screenId;
    // selectId = menuVal.screenId;
  }

  getMenuList() {
    const screenName: any[] = [];
    const moduleName: any[] = [];
    const subModuleName: any[] = [];
    let dupList = JSON.parse(sessionStorage.getItem('user_roles'));
    dupList = dupList === null ? [] : dupList;
    if (dupList) {
      dupList.map(m => {
        screenName.push(m.screenName.toUpperCase());
        if (moduleName.indexOf(m.moduleName.toUpperCase()) === -1) {
          const modObj = { menu: '', moduleId: 0, screenId: 0, displayOrder: 0, routingUrl: '' };
          modObj.menu = m.moduleName,
            modObj.moduleId = m.moduleId,
            modObj.screenId = m.screenId,
            modObj.displayOrder = m.moduleId,
            modObj.routingUrl = m.routingUrl;
          this.menuHeading.push(modObj);
          this.menuHeading = this.menuHeading.sort((a, b) => a.displayOrder - b.displayOrder);
          moduleName.push(m.moduleName.toUpperCase());
        }
        if (subModuleName.indexOf(m.subModuleName.toUpperCase()) === -1) {
          const subObj = {
            visible: true,
            screenId: 0,
            moduleId: 0,
            subModuleId: 0,
            screenName: '',
            route: null,
            tooltip: '',
            moduleName: '',
            subModuleName: '',
            subModuleDisplayOrder: 0,
            routingUrl: '',
            children: [],
          };
          if (m.subModuleName) {
            subObj.moduleId = m.moduleId,
              subObj.subModuleId = m.subModuleId,
              subObj.moduleName = m.moduleName,
              subObj.subModuleName = m.subModuleName,
              subObj.subModuleDisplayOrder = m.subModuleDisplayOrder,
              subObj.routingUrl = m.routingUrl,
              this.menuList.push(subObj);
            this.menuList = this.menuList.sort((a, b) => a.subModuleDisplayOrder - b.subModuleDisplayOrder);
            subModuleName.push(m.subModuleName.toUpperCase());
          }
        }
      });
    }
    dupList.map(m => {
      const iobj = {
        visible: true,
        screenId: 0,
        moduleId: 0,
        subModuleId: 0,
        screenName: '',
        route: null,
        tooltip: '',
        moduleName: '',
        subModuleName: '',
        displayOrder: 0,
        routingUrl: '',
        children: []
      };
      if (m.subModuleId > 0) {
        if (this.menuList.filter(x => x.subModuleId === m.subModuleId).length > 0) {
          const x = this.menuList.findIndex(c => c.subModuleId === m.subModuleId);
          this.menuList[x].children.push(m);
          this.menuList.filter(q => q.children.length > 0).
            map(c => (c.children).sort((r, p) => r.displayOrder - p.displayOrder));
        }
      } else {
        iobj.children = [];
        iobj.moduleId = m.moduleId,
          iobj.subModuleId = m.subModuleId,
          iobj.screenId = m.screenId,
          iobj.screenName = m.screenName,
          iobj.route = null,
          iobj.tooltip = '',
          iobj.moduleName = m.moduleName,
          iobj.displayOrder = m.displayOrder,
          iobj.routingUrl = m.routingUrl,
          iobj.subModuleName = m.subModuleName;
        this.menuList.push(this.common.CloneObject(iobj));
        this.menuList = this.menuList.sort((a, b) => a.displayOrder - b.displayOrder);
        // this.menuList.filter(x => x.children.length > 0).
        //   map(x => (x.children).sort((l, p) => l.displayOrder - p.displayOrder));
      }
    });
    // console.log(this.menuList, 'MENULIST');
  }
  openAcc(val: any) {
    this.selectId = val;
  }
  setId(Id: any) {
    if (Id > 0) {
      this.newId = Id;
    } else {
      this.newId = 0;
    }

  }
  getIcons(menu: any) {
    switch (menu) {
      case 'Dashboard':
        return 'icon-speedometer';
      case 'Configure':
        return 'icon-equalizer';
      case 'Client':
        return 'icon-clientmeeting';
      case 'Screening':
        return 'icon-verification';
      case 'Verification':
        return 'icon-verification-1';
      case 'Quality Check':
        return 'icon-shield1';
      case 'Reports':
        return 'icon-report';
      case 'Report':
        return 'icon-report';
      case 'DirectApp':
        return 'icon-DirectApp';
      case 'Invoice':
        return 'icon-invoice1';
      case 'Automation':
        return 'icon-invoice1';
      default:
        break;
    }
  }

  @HostListener('window:scroll')
  checkScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (scrollPosition >= this.topPosToStartShowing) {
      this.isShow = true;
    } else {
      this.isShow = false;
    }
  }
  gotoTop() {
    window.scroll({ top: 0, left: 0, behavior: 'smooth' });
  }

  openBottomSheet(temp: TemplateRef<any>): void {
    this._bottomSheet.open(temp);
  }
  getAllEmailTemplates() {
    this.master.getEmailTemplates().subscribe(resp => {
      this.common.mailTemplates = resp;
      // console.log(this.common.mailTemplates, 'MailTemp');
    });
  }
  setScreenDetails(screenData: any) {
    sessionStorage.removeItem('curMenu_data');
    sessionStorage.setItem('curMenu_data', JSON.stringify(screenData));
  }
}
