import { Component, OnInit, ViewChild, HostListener, TemplateRef, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { MatAccordion, MatExpansionPanel } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SharedService } from '../common-methods/services/shared.service';
import { CommonService } from '../common-methods/services/common.service';
import { AuthService } from '../common-methods/services/auth.service';
import { ChangePasswordDialogComponent } from '../common-methods/components/change-password-dialog/change-password-dialog.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MasterService } from '../common-methods/services/master.service';
import { NotificationService } from '../common-methods/services/notification.service';
import { Notification } from '../common-methods/models/notification';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AutoCompleteDropDown } from '../common-methods/models/autoComplete';
import { CaseCreationView } from '../common-methods/models/caseCreationView';
import { ScreeningService } from '../common-methods/services/screening.service';
import { VerificationService } from '../common-methods/services/verification.service';
import { AdvanceSearchComponent } from './advancesearch/advance-search.component';
import { OAuthService } from 'angular-oauth2-oidc';
@Component({
  standalone: false,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  candidateName: string;
  themechange = new ThemeChangeVM();
  Cldata: any[] = [];
  themeclrch: string;
  userdatas: any;
  themeclr: string;
  storedTheme: string;
 @ViewChild('search', { static: true }) search!: TemplateRef<any>;
  @ViewChild('secDrawer', { static: true }) secDrawer!: MatSidenav;
  @ViewChild(MatAccordion, { static: true }) accordion!: MatAccordion;
@ViewChild('logoutAlert', { static: true }) logoutAlert!: TemplateRef<any>;
@ViewChild('theme', { static: true }) theme!: TemplateRef<any>;
  // tslint:disable-next-line: no-use-before-declare
  globalSearch = new GlobalSearch();
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
  moreMenuList: any[] = [];
  menuItemsList: any[] = [];
  multi = false;
  displayMode = 'default';
  openState: boolean;
  scrnId: any;
  newId: number;
  isShow: boolean;
  notificationCount = 0;
  lstNotificationDetail: Notification[];
  topPosToStartShowing = 100;
  viewNotification: any[] = [];
  notificationDetail = '';
  showNotification = false;
  timeout: any;
  searchFormGroup: UntypedFormGroup;
  clientControls!: AutoCompleteDropDown;
  clients: any[] = [];
  categoryType: any;
  labelType: string;
  responseFlag: boolean;
  type: string;
  logoList: any;
  dtheme: string;

  constructor(public router: Router, private messageService: MessageService, public common: CommonService,
    public screeningService: ScreeningService, public verification: VerificationService,
    private sharedService: SharedService, public authService: AuthService, public dialog: MatDialog, public fb: UntypedFormBuilder,
    private _bottomSheet: MatBottomSheet, public master: MasterService, public notificationService: NotificationService,
    private oAuthService: OAuthService) {
  }
  isPageLoad = false;
  currentOpenId = 1;
  userData: any; userName = '';
  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
   // this.getusers();
    this.sharedService.changeEmitted$.subscribe(
      (element) => {
        this.messageService.add({ severity: element.severity, summary: element.summary, detail: element.detail });
      });
        this.notificationService.notification.subscribe(
      (element) => {
        this.notificationCount += 1;
        // this.notificationService.notificationCount += 1;
        this.notificationDetail = element.detail;
        this.showNotification = true;
        this.timeout = setTimeout(() => {
          this.showNotification = false;
        }, 6000);
        // this.messageService.add({ severity: element.severity, summary: element.summary, detail: element.detail });
      });
    this.showButtons = 'HIDE';
    this.opendDrawer(1);
    this.getMenuList();
    const name = this.userData.firstName + ' ' + this.userData.lastName;
    if (this.userData) {
      this.userName = (this.userData.lastName) ? this.userData.firstName.charAt(0).toUpperCase() +
        this.userData.lastName.charAt(0).toUpperCase() : this.userData.firstName.charAt(0).toUpperCase();
      // (name.split(' ').length - 1) > 0 ? name.split(' ')[0].charAt(0).toUpperCase() +
      //   name.split(' ')[1].charAt(0).toUpperCase() : name.charAt(0).toUpperCase();
      // comment by Rajesh below method for slow ness avoid
    //  this.getNotificationCount();
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
    if (this.userData.applicationId === 3) {
      this.screeningService.getUserCaseScreeningDetails(this.userData.userId).subscribe(resp => {
        if (resp) {
          this.candidateName = resp.candidate.firstName + ' ' + (resp.candidate.middleName ? resp.candidate.middleName : '')+' ' + (resp.candidate.lastName ? resp.candidate.lastName : '');
          this.logoList = resp;
          this.userName = (resp.candidate.lastName) ? resp.candidate.firstName.charAt(0).toUpperCase() +
          resp.candidate.lastName.charAt(0).toUpperCase() : resp.candidate.firstName.charAt(0).toUpperCase();
        }
      });
    }
    if(this.common.backFlag === true) {
      this.searchGlobal();
    }
  }
  initFormGroup() {
    this.searchFormGroup = this.fb.group({
      clientId: [''],
      refNo: [''],
      name: [''],
      address: [''],
      typeLookupId: [''],
      applicantId: [''],
      emailId:     [''],
    phoneNo:     ['']
    });
  }
  getusers() {
    this.master.getClientUser(this.userData.applicationId).subscribe(res => {
      if (res) {
        const ud: any[] = [];
        this.userdatas = res;
        this.userdatas.forEach((e) => {
          if (e.userId == this.userData.userId) {
            ud.push(e);
          }
        })
        this.Cldata = ud;
        ud.forEach((e) => {
          if (e.themeColor === null) {
            this.themeclr = "theme-default";
          } else {
            this.themeclr = e.themeColor;
          }
          this.setTheme(this.themeclr);
        });
      }
    });
  }
  setTheme(theme: string) {
    this.themechange.themeColor = theme;
    this.master.ThemeChange(this.userData.userId, this.themechange).subscribe(res => {
      this.storedTheme = theme;
    });
  }
  getClients() {
    const data = new CaseCreationView();
    data.teamId = this.userData.teamId;
    data.applicationId = this.userData.applicationId;
    data.clientId = this.userData.clientId;
    data.teamName = this.userData.teamName;
    this.screeningService.getClientName(data).subscribe(resp => {
      if (resp) {
        this.clients = resp;
        this.clientControls =
          new AutoCompleteDropDown('Client Name', 'clientId', 'clientId', 'clientName', this.clients,
            '', this.searchFormGroup, false, false, false);
      }
    });
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
    const accessToken = localStorage.getItem('access_token');
    if (accessToken !== null && accessToken !== "null") {
      this.oAuthService.logOut();
      localStorage.clear();    
      this.router.navigate(['/ssologin']);  
    }
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
        this.notificationService.notificationCount = 0;
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
    if (this.authorizedmenuHeadingList.length > 4) {
      this.moreMenuList = this.authorizedmenuHeadingList.slice(5, this.authorizedmenuHeadingList.length);
    }
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
            modObj.displayOrder = m.moduleDisplayOrder,
            modObj.routingUrl = m.routingUrl;
          this.menuHeading.push(modObj);
          // this.menuHeading = this.menuHeading.sort((a, b) => a.displayOrder - b.displayOrder);
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
    this.menuHeading = this.menuHeading.sort((a, b) => a.displayOrder - b.displayOrder);
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
      case 'Direct App':
        return 'icon-verification';
      case 'Invoice':
        return 'icon-invoice1';
      case 'Automation':
        return 'icon-disc';
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
    if (this.notificationService.notificationCount > 0) {
      this.getNotificationDetails();
      this._bottomSheet.open(temp);
    }
  }
  getAllEmailTemplates() {
    this.master.getEmailTemplates().subscribe(resp => {
      this.common.mailTemplates = resp;
    });
  }
  setScreenDetails(screenData: any) {
    sessionStorage.removeItem('curMenu_data');
    sessionStorage.setItem('curMenu_data', JSON.stringify(screenData));
  }
  getNotificationCount() {
    const userId = this.userData.userId;
    this.notificationService.notificationCount = 0;
    this.notificationService.getNotificationCount(userId).subscribe(resp => {
      if (resp) {
        this.notificationService.notificationCount = resp;
        this.notificationCount = resp;
      }
    });
  }
  getNotificationDetails() {
    const userId = this.userData.userId;
    this.notificationService.getNotificationDetails(userId).subscribe(resp => {
      if (resp) {
        this.lstNotificationDetail = resp;
        // this.filterNotification('read');
      }
    });
  }
  selectNotification(notify: any) {
    if (notify) {
      this.notificationService.notificationId = notify.notificationId;
      this.router.navigate(['dashboard/notification']);
    }
  }
  filterNotification(action: any) {
    if (action === 'unRead') {
      this.viewNotification = this.lstNotificationDetail.filter(f => f.readFlag === false);
    } else if (action === 'read') {
      this.viewNotification = this.lstNotificationDetail.filter(f => f.readFlag !== false);
    }
  }
  closeNotification() {
    this.showNotification = false;
  }
  notificationMouseOver() {
    clearTimeout(this.timeout);
  }
  notificationMouseOut() {
    this.timeout = setTimeout(() => {
      this.showNotification = false;
    }, 6000);
  }
  selectionChange(e: any) {
    if (e > 0) {
      const defaultType = this.categoryType.find(x => x.lookUpId === e);
      this.labelType = defaultType.lookUpName;
      if (this.searchFormGroup.controls.refNo.value || this.searchFormGroup.controls.clientId.value ||
        this.searchFormGroup.controls.address.value ||
        this.searchFormGroup.controls.clientId.value) {
        this.searchFormGroup.controls.refNo.setValue('');
        this.searchFormGroup.controls.clientId.setValue('');
        this.searchFormGroup.controls.address.setValue('');
        this.searchFormGroup.controls.clientId.setValue('');
      }
    }
  }
  valueCheck(val: any) {
    if (val === 'ref') {
      if (this.searchFormGroup.controls.clientId.value ||
        this.searchFormGroup.controls.name.value || this.searchFormGroup.controls.address.value ||
        this.searchFormGroup.controls.clientId.value) {
        this.searchFormGroup.controls.name.setValue('');
        this.searchFormGroup.controls.address.setValue('');
        this.searchFormGroup.controls.clientId.setValue('');
      }
    }
    if (val === 'candidate') {
      if (this.searchFormGroup.controls.refNo.value || this.searchFormGroup.controls.clientId.value ||
        this.searchFormGroup.controls.address.value ||
        this.searchFormGroup.controls.clientId.value) {
        this.searchFormGroup.controls.refNo.setValue('');
        this.searchFormGroup.controls.address.setValue('');
      }
    }
    if (val === 'address') {
      if (this.searchFormGroup.controls.refNo.value || this.searchFormGroup.controls.clientId.value
        || this.searchFormGroup.controls.name.value ||
        this.searchFormGroup.controls.clientId.value) {
        this.searchFormGroup.controls.refNo.setValue('');
        this.searchFormGroup.controls.name.setValue('');
      }
    }
    this.searchFormGroup.controls.name.clearValidators();
    this.searchFormGroup.controls.name.markAsTouched();
  }
  openChooseDept() {
    if (this.userData.userDepartmentVm && this.userData.userDepartmentVm.length > 1) {
      this.authService.dashboardFlag = true;
      this.router.navigate(['/deptChoose']);
    } else {
      if (this.userData.userDepartmentVm && this.userData.userDepartmentVm.length === 1) {
        this.showTopCenter('warn', 'Failure Message', 'You do not have multiple department access');
      }
    }
  }
  openAdvanceSearch() {  
    this.router.navigate(['dashboard/advanceSearch']);
  }
  openCommonSearch() {
    // this.router.navigate(['dashboard/globalSearch']);
    this.getClients();
    this.screeningService.getGlobalSearchType().subscribe(res => {
      this.categoryType = res;
      const defaultType = this.categoryType.find(x => x.lookUpName === 'Search by Candidate Name');
      this.searchFormGroup.controls.typeLookupId.setValue(defaultType.lookUpId);
      this.labelType = defaultType.lookUpName;
    });
    this.initFormGroup();
    this.clientControls =
      new AutoCompleteDropDown('Client Name', 'clientId', 'clientId', 'clientName', this.clients,
        '', this.searchFormGroup, false, false, false);
    const dialogRef = this.dialog.open(this.search, {
      width: '500px',
      position: { top: '0', right: '0' }
    });
    dialogRef.afterClosed().subscribe(() => {
    });
  }
  validationType(type: any) {
    if (type === 'refType') {
      if (this.searchFormGroup.controls.refNo.value && this.searchFormGroup.controls.refNo.valid) {
        this.responseFlag = true;
        this.searchFormGroup.controls.refNo.clearValidators();
        this.searchFormGroup.controls.refNo.updateValueAndValidity();
      } else {
        this.searchFormGroup.controls.refNo.setValidators(Validators.required);
        this.searchFormGroup.controls.refNo.updateValueAndValidity();
        // if (this.searchFormGroup.controls.clientId.value ||
        //   this.searchFormGroup.controls.name.value || this.searchFormGroup.controls.address.value) {
        //   this.searchFormGroup.controls.clientId.setValue('');
        //   this.searchFormGroup.controls.name.setValue('');
        //   this.searchFormGroup.controls.address.setValue('');
        // }
      }
    } else if (type === 'catType') {
      if (this.searchFormGroup.controls.typeLookupId.value && this.searchFormGroup.controls.name.value) {
        this.responseFlag = true;
        this.searchFormGroup.controls.name.clearValidators();
        this.searchFormGroup.controls.name.updateValueAndValidity();
        this.searchFormGroup.controls.refNo.clearValidators();
        this.searchFormGroup.controls.refNo.updateValueAndValidity();
      } else {
        this.searchFormGroup.controls.name.setValidators(Validators.required);
        this.searchFormGroup.controls.name.updateValueAndValidity();
        // if (this.searchFormGroup.controls.refNo.value || this.searchFormGroup.controls.address.value) {
        //   this.searchFormGroup.controls.refNo.setValue('');
        //   this.searchFormGroup.controls.address.setValue('');
        // }
      }
    } else if (type === 'addressType') {
      if (this.searchFormGroup.controls.address.value) {
        this.responseFlag = true;
        this.searchFormGroup.controls.address.clearValidators();
        this.searchFormGroup.controls.address.updateValueAndValidity();
      } else {
        this.searchFormGroup.controls.address.setValidators(Validators.required);
        this.searchFormGroup.controls.address.updateValueAndValidity();
        // if (this.searchFormGroup.controls.refNo.value || this.searchFormGroup.controls.name.value) {
        //   this.searchFormGroup.controls.refNo.setValue('');
        //   this.searchFormGroup.controls.name.setValue('');
        // }
      }
    } else if (type === 'app') {
      if (this.searchFormGroup.controls.applicantId.value) {
        this.responseFlag = true;
      }
    }
    else if (type === 'emailPhoneType') {
  if (this.searchFormGroup.controls.emailId.value || this.searchFormGroup.controls.phoneNo.value) {
    this.responseFlag = true;
    this.searchFormGroup.controls.emailId.clearValidators();
    this.searchFormGroup.controls.emailId.updateValueAndValidity();
    this.searchFormGroup.controls.phoneNo.clearValidators();
    this.searchFormGroup.controls.phoneNo.updateValueAndValidity();
  } 
}
  }
  searchGlobal() {
    if (this.searchFormGroup.controls.refNo.value && this.searchFormGroup.controls.refNo.valid) {
      this.type = 'refType';
    }
    if (this.searchFormGroup.controls.typeLookupId.value && (this.searchFormGroup.controls.name.value &&
      this.searchFormGroup.controls.name.valid) ||
      this.searchFormGroup.controls.clientId.value) {
      this.type = 'catType';
    }
    if (this.searchFormGroup.controls.address.value && this.searchFormGroup.controls.address.valid) {
      this.type = 'addressType';
    }
    if (this.searchFormGroup.controls.applicantId.value && this.searchFormGroup.controls.applicantId.valid) {
      this.type = 'app';
    }
    if (this.searchFormGroup.controls.emailId.value || this.searchFormGroup.controls.phoneNo.value) {
    this.type = 'emailPhoneType'; // ← combined type
  }
    if (this.type) {
      this.validationType(this.type);
    }
    if (this.responseFlag === true) {
      this.globalSearch.refNo = this.type === 'refType' ? this.searchFormGroup.controls.refNo.value : '';
      this.globalSearch.clientId = this.type === 'refType' || this.type === 'app' ? 0 : this.searchFormGroup.controls.clientId.value;
      this.globalSearch.typeLookupId = this.type === 'catType' ? this.searchFormGroup.controls.typeLookupId.value : 0;
      this.globalSearch.name = this.type === 'catType' ? this.searchFormGroup.controls.name.value : '';
      this.globalSearch.address = this.type === 'addressType' ? this.searchFormGroup.controls.address.value : '';
      this.globalSearch.applicantId = this.type === 'app' ? this.searchFormGroup.controls.applicantId.value : '';
      const searchVal = this.searchFormGroup.controls.name.value || '';
  const lowercaseLabel = this.labelType ? this.labelType.toLowerCase() : '';

  // Initialize all category fields to default/empty state
  this.globalSearch.name = '';
  this.globalSearch.emailId = '';
  this.globalSearch.phoneNo = '';

  if (this.type === 'catType') {
    if (lowercaseLabel.includes('email')) {
      this.globalSearch.emailId = searchVal; // Map statically to emailId property
    } else if (lowercaseLabel.includes('phone')) {
      this.globalSearch.phoneNo = searchVal; // Map statically to phoneNo property
    } else {
      this.globalSearch.name = searchVal;    // Fallback for Candidate Name or others
    }
  }
      this.globalSearch.teamId = this.userData.teamId;
      this.globalSearch.deptId = this.userData.deptId === null ? 0 : this.userData.deptId;
      this.globalSearch.applicationId = this.userData.applicationId;
      this.globalSearch.siteIds = this.userData.siteId;
      this.globalSearch.appClientId = this.userData.applicationId === 2 ? this.userData.clientId[0] : 0;
      this.common.globalList = this.globalSearch;
      this.screeningService.getScreeningComponentDet(this.globalSearch).subscribe(resp => {
        if (resp.length > 0) {
          this.master.searchList = resp;
          //To bind compname with subCompname and index
          this.master.searchList.map(m => m.componentName = (m.componentName !=null)?(this.common.getCompNameByIndex((m.componentName +
         (m.subCompName ? (' - ' + m.subCompName) : '')), m.compIndex, m.compMaxNo, m.subCompMaxNo)):'N/A');
          this.searchFormGroup.reset();
          this.type = '';
          this.responseFlag = false;
          this.router.navigate(['dashboard/globalSearch']);
          this.master.searchList.forEach(ele => {
            ele.ownerFirstName = ele.ownerFirstName ? (ele.ownerFirstName + (ele.ownerMiddleName ? (' ' + ele.ownerMiddleName) : '') +
              (ele.ownerLastName ? (' ' + ele.ownerLastName) : '')) : 'N/A';
            ele.scopeOwnerFName = ele.scopeOwnerFName ? (ele.scopeOwnerFName + (ele.scopeOwnerMName ? (' ' + ele.scopeOwnerMName) : '') +
              (ele.scopeOwnerLName ? (' ' + ele.scopeOwnerLName) : '')) : 'N/A';
            ele.submissionOwnerFName = ele.submissionOwnerFName ? (ele.submissionOwnerFName + (ele.submissionOwnerMName ?
              (' ' + ele.submissionOwnerMName) : '') + (ele.submissionOwnerLName ? (' ' + ele.submissionOwnerLName) : '')) : 'N/A';
            ele.cancelledUserFirstName = ele.cancelledUserFirstName ? (ele.cancelledUserFirstName + (ele.cancelledUserMiddleName ?
              (' ' + ele.cancelledUserMiddleName) : '') + (ele.cancelledUserLastName ? (' ' + ele.cancelledUserLastName) : '')) : 'N/A';
            ele.fqcByFN = ele.fqcByFN ? (ele.fqcByFN + (ele.fqcByMN ?
              (' ' + ele.fqcByMN) : '') + (ele.fqcByLN ? (' ' + ele.fqcByLN) : '')) : 'N/A';
            ele.deSubmittedFirstName = ele.deSubmittedFirstName ? (ele.deSubmittedFirstName + (ele.deSubmittedMiddleName ?
                (' ' + ele.deSubmittedMiddleName) : '') + (ele.deSubmittedLastName ? (' ' + ele.deSubmittedLastName) : '')) : 'N/A';  
            ele.dePreQCSubmittedFirstName = ele.dePreQCSubmittedFirstName ? (ele.dePreQCSubmittedFirstName + (ele.dePreQCSubmittedMiddleName ?
              (' ' + ele.dePreQCSubmittedMiddleName) : '') + (ele.dePreQCSubmittedLastName ? (' ' + ele.dePreQCSubmittedLastName) : '')) : 'N/A';
          });
          this.dialog.closeAll();
        } else {
          this.type = '';
          this.responseFlag = false;
          this.showTopCenter('warn', 'Failure Message', 'Your Search Result was Not Found');
        }
      });
    } else {
      if (this.searchFormGroup.controls.typeLookupId.value && !this.searchFormGroup.controls.refNo.value ||
        !this.searchFormGroup.controls.address.value && !this.searchFormGroup.controls.name.value) {
        this.searchFormGroup.controls.name.setValidators(Validators.required);
        this.searchFormGroup.controls.name.markAsTouched();
        this.searchFormGroup.controls.name.updateValueAndValidity();
      }
    }
  }
  showTopCenter(level: string, info: string, message: string) {
    this.messageService.add({ severity: level, summary: info, detail: message });
  }
  // @HostListener('window:beforeunload', ['$event'])
  // onBeforeUnload() {

  //   if (sessionStorage.length > 0) {
  //     this.logout()
  //   }

  // }

}
export class ThemeChangeVM {
  themeColor: string;
}
export class GlobalSearch {
  clientId: number;
  refNo: any;
  typeLookupId: number;
  name: string;
  address: string;
  applicantId: string;
  teamId: number;
  applicationId: number;
  appClientId: number;
  deptId: number;
  siteIds: any = [];
  emailId:string;
  phoneNo:string;
}