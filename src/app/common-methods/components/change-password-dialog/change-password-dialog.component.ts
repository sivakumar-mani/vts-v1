import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormControl, UntypedFormBuilder } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SharedService } from '../../services/shared.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from '../../services/common.service';
import { MessageService } from 'primeng/api';

@Component({
  standalone: false,
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.css']
})
export class ChangePasswordDialogComponent implements OnInit {
  changePasswordFormGroup: UntypedFormGroup;
  changeFlag = false;
  iscapsOn = false;
  tempcapson = false;
  headerText: string;
  bodyText: string;
  popupData: any;
  action: string;
  hide = true;
  hide1 = true;
  hide2 = true;
  validationFlag: boolean;
  numberflag = false;
  charflag = false;
  uniqueflag = false;
  minflag = false;
  isShow = false;
  newFlag = false;
  newFlagPsw = false;
  // tslint:disable-next-line:max-line-length
  constructor(public authService: AuthService, private formBuilder: UntypedFormBuilder, private shared: SharedService, public dialog: MatDialog, public dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public common: CommonService , private messageService: MessageService) {
    this.headerText = data.headerText;
    // this.bodyText = data.bodyText;
    this.action = data.action;
  }

  ngOnInit() {
    this.initializeformGroup();
    if (!this.changePasswordFormGroup.get('oldPassword')?.value) {
      this.changePasswordFormGroup.get('newPassword')?.disable();
      this.changePasswordFormGroup.get('confirmPassword')?.disable();
    } else {
      this.changePasswordFormGroup.get('newPassword')?.enable();
      this.changePasswordFormGroup.get('confirmPassword')?.enable();
    }
  }
  checkcapsOn(event: any) {
    this.tempcapson = event;
  }
  initializeformGroup() {
    this.changePasswordFormGroup = this.formBuilder.group({
      userName: new UntypedFormControl(),
      oldPassword: new UntypedFormControl('', Validators.required),
      newPassword: new UntypedFormControl('', Validators.required),
      confirmPassword: new UntypedFormControl('', Validators.required),
    },
      { validator: this.checkMatchingPasswords('newPassword', 'confirmPassword') },
    );

  }
  closeDialog(): void {
    this.dialogRef.close(null);
  }
  checkcaps() {
    this.iscapsOn = this.tempcapson;
  }
  passwordValidation() {
    this.iscapsOn = false;
    const newPsw = this.changePasswordFormGroup.get('newPassword')?.value;
    const oldPsw = this.changePasswordFormGroup.get('oldPassword')?.value;
    if (newPsw === oldPsw) {
      this.changePasswordFormGroup.get('newPassword')?.setErrors({ incorrect: true });
      this.newFlag = true;
    } else {
      this.changePasswordFormGroup.get('newPassword')?.setErrors(null);
      this.newFlag = false;
    }
    if (this.newFlag !== true) {
      if (this.changePasswordFormGroup.get('newPassword')?.value) {
        if (this.uniqueflag === false || this.numberflag === false || this.charflag === false || this.minflag === false) {
          this.changePasswordFormGroup.get('newPassword')?.setErrors({ incorrect: true });
          this.newFlagPsw = true;
          this.newFlag = false;
        }
        if (this.uniqueflag === true && this.numberflag === true && this.charflag === true && this.minflag === true) {
          this.newFlagPsw = false;
          this.newFlag = false;
          this.changePasswordFormGroup.get('newPassword')?.setErrors(null);
          this.changePasswordFormGroup.get('newPassword')?.clearValidators();
          this.changePasswordFormGroup.get('newPassword')?.updateValueAndValidity();
        }
      }
    }
  }
  keypressevent(event: KeyboardEvent, val) {
    this.iscapsOn = event.getModifierState && event.getModifierState('CapsLock');

  }
  ValidateRegControls(): boolean {
    let isvalid = true;
    const controlNames = ['newPassword', 'confirmPassword'];

    for (const ctrl in this.changePasswordFormGroup.controls) {
      if (this.changePasswordFormGroup.controls.hasOwnProperty(ctrl)) {
        if (controlNames.indexOf(ctrl) > -1) {
          if (!this.changePasswordFormGroup.get(ctrl).value) {
            isvalid = false;
            if (ctrl === 'newPassword') {
              this.changePasswordFormGroup.get(ctrl).setValidators([Validators.required]);
              this.changePasswordFormGroup.get(ctrl).markAsTouched();
              this.changePasswordFormGroup.get(ctrl).updateValueAndValidity();
            } else if (ctrl === 'confirmPassword') {
              this.changePasswordFormGroup.get(ctrl).setValidators([Validators.required]);
              this.changePasswordFormGroup.get(ctrl).markAsTouched();
              this.changePasswordFormGroup.get(ctrl).updateValueAndValidity();
            } else {
              this.changePasswordFormGroup.get(ctrl).markAsTouched();
              this.changePasswordFormGroup.get(ctrl).setValidators(Validators.required);
              this.changePasswordFormGroup.get(ctrl).updateValueAndValidity();
            }
          }
          // if (this.hide === true) {
          //   this.registerForm.get(ctrl).clearValidators();
          //   this.registerForm.get(ctrl).updateValueAndValidity();
          // }
        }
      }
    }
    for (const ctrl in this.changePasswordFormGroup.controls) {
      if (controlNames.indexOf(ctrl) > -1) {
        if (this.changePasswordFormGroup.get(ctrl).invalid) {
          isvalid = false;
        }
      }
    }
    return isvalid;
  }
  checkPassword() {
    const userNameValue = this.authService.userdata.userName;
    if (userNameValue) {
      this.changePasswordFormGroup.get('userName')?.setValue(userNameValue);
    }

    // this.changePasswordFormGroup.get('oldPassword')?.setValue(oldPasswordValue);
    const oldPasswordValue = this.changePasswordFormGroup.get('oldPassword')?.value;
    if (oldPasswordValue && oldPasswordValue !== '') {
      this.authService.checkPassword(this.changePasswordFormGroup.value).subscribe(resp => {
        if (resp.success === true) {
          this.changeFlag = false;
          this.changePasswordFormGroup.get('oldPassword')?.setErrors(null);
          this.changePasswordFormGroup.get('newPassword')?.enable();
        } else {
          this.changeFlag = true;
          // if (this.changeFlag) {
          this.changePasswordFormGroup.get('oldPassword')?.setErrors({ incorrect: true });
          this.changePasswordFormGroup.get('newPassword')?.disable();
          // }
        }
      });
    } else {
      this.changePasswordFormGroup.get('newPassword')?.setValue(null);
      this.changePasswordFormGroup.get('confirmPassword')?.setValue(null);
      this.changePasswordFormGroup.get('newPassword')?.disable();
      this.changePasswordFormGroup.get('confirmPassword')?.disable();
    }
  }
  confirmPswValidation() {
    this.iscapsOn = false;
    // const newPsw = this.changePasswordFormGroup.get('newPassword')?.value;
    // const confirmPsw = this.changePasswordFormGroup.get('confirmPassword')?.value;
    // if (newPsw === confirmPsw) {
    //   this.changePasswordFormGroup.get('confirmPassword')?.setErrors(null);
    // } else {
    //   this.changePasswordFormGroup.get('confirmPassword')?.setErrors({ incorrect: true });
    // }
  }
  checkMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: UntypedFormGroup) => {
      // tslint:disable-next-line:one-variable-per-declaration
      const passwordInput = group.controls[passwordKey],
        passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        if (passwordConfirmationInput.value) {
          this.changePasswordFormGroup.get('confirmPassword')?.setErrors({ notEquivalent: true, });
        } else {
          this.changePasswordFormGroup.get('confirmPassword')?.setValidators(Validators.required);
        }
      } else {
        return passwordConfirmationInput.setErrors(null);
      }
    };
  }
  insertChangePassword() {
    this.ValidateRegControls();
    if (this.changePasswordFormGroup.valid) {
      const userNameValue = this.authService.userdata.userName;
      this.changePasswordFormGroup.get('userName')?.setValue(userNameValue);
      const newPsw = this.changePasswordFormGroup.get('newPassword')?.value;
      const confirmPsw = this.changePasswordFormGroup.get('confirmPassword')?.value;
      if (newPsw === confirmPsw) {
        if (this.changeFlag === false) {
          this.authService.addChangePassword(this.changePasswordFormGroup.value).subscribe(res => {
            if (res.success) {
              this.showNotification('success', 'Success Message', 'Password Changed Successfully');
              setTimeout(() => {
                this.closeAll();
              }, 2500);
            }
          });
        }
      } else {
        this.changePasswordFormGroup.get('confirmPassword')?.setErrors({ incorrect: true });
        // this.changePasswordFormGroup.get('newPassword')?.setErrors({ incorrect: true });
      }
    }
  }
  // showNotification(level: string, info: string, message: string) {
  //   this.shared.emitChange({
  //     severity: level,
  //     summary: info,
  //     detail: message
  //   });
  // }
  showNotification(severity1, summary1, message) {
    this.messageService.add({ severity: severity1, summary: summary1, detail: message });
  }
  closeAll() {
    this.dialogRef.close({
      type: this.common.CHANGEPASSWORD,
    });
  }
  passwordChange(val: any) {
    const txt = val;
    const numb = txt.match(/\d/g);
    const specialchar = txt.match(/[!@#$%^&*(),.?":{}|<>]/g);
    const stringonly = txt.match(/[a-zA-z]/g);
    if (specialchar) {
      this.uniqueflag = true;
    } else if (!specialchar) {
      this.uniqueflag = false;
    }
    if (stringonly) {
      this.charflag = true;
    } else if (!stringonly) {
      this.charflag = false;
    }
    if (numb) {
      this.numberflag = true;
    } else if (!numb) {
      this.numberflag = false;
    }
    if ((val.length) >= 8) {
      this.minflag = true;
    } else {
      this.minflag = false;
    }
    if (this.uniqueflag === true && this.numberflag === true && this.charflag === true && this.minflag === true) {
      this.isShow = false;
      this.changePasswordFormGroup.get('confirmPassword')?.enable();
      this.changePasswordFormGroup.get('confirmPassword')?.clearValidators();
      this.changePasswordFormGroup.get('confirmPassword')?.updateValueAndValidity();
    } else {
      this.isShow = true;
      this.changePasswordFormGroup.get('confirmPassword')?.disable();
      this.changePasswordFormGroup.get('confirmPassword')?.reset();
    }
  }
}
