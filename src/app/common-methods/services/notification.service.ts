import { EventEmitter, Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import * as signalR from '@aspnet/signalr';
import { Subject, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  messageReceived = new EventEmitter<any>();
  connectionEstablished = new EventEmitter<boolean>();
  private connectionIsEstablished = false;
  private hubConnection: HubConnection;
  private notificationSub = new Subject<any>();
  public notification = this.notificationSub.asObservable();
  userdata: any;
  notificationCount = 0;
  notificationId = 0;

  constructor(private authService: AuthService, private http: HttpClient) {
  }

  public createConnection() {
    const strurl = this.authService.getConfig('apiUrl');
    const url = strurl.slice(0, -4);
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(url + '/message', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .build();
  }

  startConnection(): void {
    this.hubConnection
      .start()
      .then(() => {
        this.connectionIsEstablished = true;
        // console.log('Hub connection started');
      })
      .catch(err => {
        // console.log('Error while establishing connection, retrying...');
        setTimeout(() => {
          this.startConnection();
        }, 5000);
      });
  }

  public registerOnServerEvents(): void {
    this.hubConnection.on('send', data => {
      this.userdata = JSON.parse(sessionStorage.getItem('user_data') as string);
      // console.log('Signalr Response', data);
      const user = data;
      if (this.userdata && user.receiverUserId && user.receiverUserId.some(s => s === this.userdata.userId)) {
        this.notificationSub.next({ severity: 'info', summary: 'Notification', detail: user.notificationContent });
        this.notificationCount += 1;
      }
    });
  }
  public getNotificationCount(userId: number): Observable<any> {
    const url = 'Message/GetNotificationCount?userId=' + userId;
    return this.http.get<any>(url);
  }
  public getNotificationDetails(userId: number): Observable<any> {
    const url = 'Message/GetNotificationDetails?userId=' + userId;
    return this.http.get<any>(url);
  }
  public updateNotification(Notification: any) {
    const url = 'Message/UpdateNotification';
    return this.http.post<any>(url, Notification);
  }
  public getNotificationDetailByDate(Notification: any) {
    const dataUrl = 'Message/GetNotificationDetailByDate';
    return this.http.post<any>(dataUrl, Notification);
  }
}
