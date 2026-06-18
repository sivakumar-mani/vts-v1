import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import {MatChipInputEvent} from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { CommonDialogComponent } from '../common-dialog/common-dialog.component';
import { CommonService } from 'src/app/common-methods/services/common.service';

export interface Fruit {
  name: string;
}

@Component({
  standalone: false,
  selector: 'app-departteam',
  templateUrl: './departteam.component.html',
  styleUrls: ['./departteam.component.css']
})
export class DepartteamComponent implements OnInit {

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
 // readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  fruits: Fruit[] = [
    {name: 'Lemon'},
    {name: 'Lime'},
    {name: 'Apple'},
  ];
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.fruits.push({name: value.trim()});
    }
    if (input) {
      input.value = '';
    }
  }

  remove(fruit: Fruit): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }
  constructor(public dialog: MatDialog, public common: CommonService) { }

  ngOnInit() {
  }

  openDialog(): void {
    this.common.popupDialogDepartment = true; 
    // this.common.popupDialog = false;
    // this.common.popuptimeout = false; 
    // this.common.popupconfirmation = false;
    const dialogRef = this.dialog.open(CommonDialogComponent, {
        width: '850px',
    });
    dialogRef.afterClosed().subscribe(() => {
        // console.log('The dialog was closed');
    });
}
}
