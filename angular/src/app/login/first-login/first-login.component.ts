import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiRequestModel } from '../../Models/apiRequestModel';
import { StringEncryptionService } from '../../Services/stringEncryption.service';
import { Router } from '@angular/router';
import { OnePassService } from '../../Services/onePass.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { LoginResult } from '../../Constants/loginResult';
import { Guid } from 'guid-typescript';
import { Languages } from '../../Constants/languages';
@Component({
  selector: 'app-first-login',
  templateUrl: './first-login.component.html',
  styleUrls: ['./first-login.component.scss'],
})
export class FirstLoginComponent {
  form: FormGroup = new FormGroup({
    mail: new FormControl('', Validators.email),
    accountPassword: new FormControl('', Validators.required),
  });
  disableLoginButton = false;
  constructor(
    private encryption: StringEncryptionService,
    private onePassService: OnePassService,
    private router: Router,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {
    localStorage.clear();
    this.disableBrowserProtectionForFirstUsage();
  }

  onSubmit() {
    const accountPassword = this.form.controls['accountPassword'];
    const mail = this.form.controls['mail'];
    if (mail.valid && accountPassword.valid) {
      if (localStorage.getItem('token') === null) {
        const requestModel = new ApiRequestModel();
        requestModel.mail = mail.value;
        requestModel.password = accountPassword.value;
        this.onePassService.GetToken(requestModel).subscribe((p) => {
          localStorage.setItem('token', p);
          this.disableLoginButton = true;
          this.checkPasswordBoxKey(mail.value, accountPassword.value);
          return;
        });
      }
      this.disableLoginButton = true;
      this.checkPasswordBoxKey(mail.value, accountPassword.value);
    }
  }
  private checkPasswordBoxKey(mail: string, accountPassword: string) {
    const accountPasswordHashed = this.encryption.encryptSha(accountPassword);
    const requestModel = new ApiRequestModel();
    requestModel.mail = mail;
    requestModel.deviceId = this.getDeviceId();
    requestModel.password = accountPassword;
    requestModel.token = localStorage.getItem('token');
    const chromeVersion = "Web Browser " + /Chrome\/([0-9.]+)/.exec(navigator.userAgent)[1];
    this.onePassService.LoginUser(requestModel, chromeVersion, 0).subscribe((p) => {
      console.log(p);
      if (
        p.loginState === LoginResult.WrongPassword ||
        p.loginState === LoginResult.WrongLicense
      ) {
        let wrongInfo, fail;
        this.translate
          .get('Common.WrongInfo')
          .subscribe((p) => (wrongInfo = p));
        this.translate.get('Common.Fail').subscribe((p) => (fail = p));
        this.snackBar.open(wrongInfo, fail, {
          duration: 2000,
        });
        this.disableLoginButton = false;
      }
      if (p.loginState === LoginResult.MailCodeSend) {
        localStorage.setItem('mail', mail);
        localStorage.setItem('accountPasswordHashed', accountPasswordHashed);
        localStorage.setItem('tempPass', accountPassword);
        this.sendMail();
      }
      if (p.loginState === LoginResult.UserAuthenticated || LoginResult.NoDevice ) {
        localStorage.setItem('mail', mail);
        localStorage.setItem('accountPasswordHashed', accountPasswordHashed);
        localStorage.setItem('password', accountPassword);
        this.setTimer();
        this.router.navigate(['dashboard']);
      }
    });
  }
  private setTimer() {
    const interval = localStorage.getItem('interval');
    if (interval !== null) {
      const date = new Date();
      date.setMinutes(date.getMinutes() + Number(interval));
      localStorage.setItem('expire', date.toString());
    }
  }
  private getProgramLanguage(): string {
    const lang = localStorage.getItem('language');
    if (lang === null) {
      localStorage.setItem('language', Languages.English);
    }
    return localStorage.getItem('language');
  }
  private sendMail() {
    const accountPassword = this.form.controls['accountPassword'].value;
    const mail = this.form.controls['mail'].value;
    const request = new ApiRequestModel();
    request.mail = mail;
    request.password = accountPassword;
    request.token = localStorage.getItem('token');
    const guid = Guid.create();
    const language = this.getProgramLanguage();
    localStorage.setItem('guid', guid.toString());
    this.onePassService.SendCode(request, guid, language).subscribe((p) => {
      if (p) {
        this.router.navigate(['verify']);
        this.disableLoginButton = false;
      } else {
        let fail, somethingWentWrong;
        this.translate
          .get('Common.SomethingWrong')
          .subscribe((p) => (somethingWentWrong = p));
        this.translate.get('Common.Fail').subscribe((p) => (fail = p));
        this.snackBar.open(somethingWentWrong, fail, {
          duration: 2000,
        });
        this.disableLoginButton = false;
      }
    });
  }
  private getDeviceId() {
    const deviceId = localStorage.getItem('deviceId');
    if (deviceId === null) {
      const newGuid = Guid.create().toString();
      localStorage.setItem('deviceId', newGuid);
      return newGuid;
    }
    return deviceId;
  }
  private disableBrowserProtectionForFirstUsage()
  {
    localStorage.setItem('blockAds','false')
    localStorage.setItem('webRtc','false')
    localStorage.setItem('fingerprint','false')
    localStorage.setItem('clearCookies','false')
    localStorage.setItem('disableFlash','false')
    localStorage.setItem('spoofingScreen','false')
  }
}
