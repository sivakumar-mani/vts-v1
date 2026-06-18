import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/common-methods/services/notification.service';
import { UntypedFormControl } from '@angular/forms';
import { User } from 'src/app/common-methods/models/user';
import { CommonService } from 'src/app/common-methods/services/common.service';

@Component({
  standalone: false,
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  itemPerPage = 10;
  page = 1;
  count = 0;
  notificationList: any[] = [];
  notificationCopyList: any[] = [];
  isDesc: boolean;
  column: any;
  direction: number;
  fromDate = new UntypedFormControl(new Date());
  toDate = new UntypedFormControl(new Date());
  userData = new User();
  maxDate = new Date();
  selectedNotification: any;
  constructor(public notificationService: NotificationService, public common: CommonService ) { }

  ngOnInit() {
    this.fromDate.setValue(new Date(this.toDate.value.getFullYear(), this.toDate.value.getMonth(), this.toDate.value.getDate() - 7));
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.getNotificationList();
  }
  exportToExcel() {
    const cols = [{field: 'notificationHeader', header: 'Header'}, {field: 'notificationContent', header: 'Content'}, {field:
    'createDate', header: 'Created Date'}, {field: 'readFlag', header: 'Read'}, {field: 'bodyContent', header: 'Notification Content'}];
    this.common.exportToExcel(cols, this.notificationList, 'Notification Details');
  }
  getNotificationList() {
    const currentDateTime = new Date();
    const fromDate = new Date(this.fromDate.value);
    fromDate.setHours(currentDateTime.getHours());
    fromDate.setMinutes(currentDateTime.getMinutes());
    fromDate.setSeconds(currentDateTime.getSeconds());
    const toDate = new Date(this.toDate.value);
    toDate.setHours(currentDateTime.getHours());
    toDate.setMinutes(currentDateTime.getMinutes());
    toDate.setSeconds(currentDateTime.getSeconds());
    const searchData = {
      userId: this.userData.userId,
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
    };
    this.notificationService.getNotificationDetailByDate(searchData).subscribe(res => {
      if (res) {
        this.notificationList = res;
        this.notificationCopyList = this.common.CloneObject(res);
        this.selectedNotification = this.notificationList.find(f => f.notificationId === this.notificationService.notificationId);
      }
    });
  }
  resetFilterSort(type: any) {
    this.itemPerPage = 10;
    this.page = 1;
    this.fromDate.setValue(new Date(this.toDate.value.getFullYear(), this.toDate.value.getMonth(), this.toDate.value.getDate() - 7));
    this.toDate.setValue(new Date());
    this.getNotificationList();
  }
  getcount(count: any) {
    this.count = count;
    return '';
  }
  getPage(event: any) {
    this.page = event;
  }
  getTotalPage(): number {
    if (this.notificationList.length) {
      return Math.ceil(this.notificationList.length / this.itemPerPage);
    }
  }
  sortBy(type: any) {
    this.isDesc = !this.isDesc;
    this.column = type;
    this.direction = this.isDesc ? 1 : -1;
  }
  filterOrSortBy(type: any) {
    // sort
    // this.notificationList.sort((a, b) => {
    //   return type === true ? b.readFlag - a.readFlag : a.readFlag - b.readFlag;
    // });
    // filter
    this.notificationList = this.notificationCopyList.filter(x => x.readFlag !== (type === null ? type : !type ));
  }
  updateNotification(notify: any) {
    if (!notify.readFlag) {
      const userId = this.userData.userId;
      notify.readFlag = true;
      notify.logginId = userId;
      this.notificationService.updateNotification(notify).subscribe(resp => {
        if (this.notificationService.notificationCount > 0) { this.notificationService.notificationCount -= 1; }      });
    }
  }

}
