import { Injectable, EventEmitter } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  clientApprovalUrl: any;
 
  constructor() { }
  // Observable string sources
  private emitChangeSource = new Subject<any>();
  private loadingemitChange = new Subject<any>();
  private nameChange = new Subject<any>();
  // Observable string streams
  changeEmitted$ = this.emitChangeSource.asObservable();
  changeEmittedLoading$ = this.loadingemitChange.asObservable();
  chengesecDrawer = new EventEmitter();
  changesName = this.nameChange.asObservable();
  subsVar: Subscription;

  // Service message commands
  emitChange(action: any) {
    this.emitChangeSource.next(action);
  }

  // Service message commands
  emitChangeLoading(action: any) {
    this.loadingemitChange.next(action);
  }
  // tslint:disable-next-line: whitespace
  // tslint:disable-next-line: typedef-whitespace
  emitChengesecDrawer() {
    this.chengesecDrawer.emit();
  }
  emitNameChange(action: any){
    this.nameChange.next(action);
  }
}
