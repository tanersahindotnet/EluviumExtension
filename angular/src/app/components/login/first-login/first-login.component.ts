import { Component } from '@angular/core'
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms'
import { ApiRequestModel } from '../../../models/api-request.model'
import { StringEncryptionService } from '../../../services/string-encryption.service'
import { Router } from '@angular/router'
import { OnePassService } from '../../../services/onepass.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { TranslateService } from '@ngx-translate/core'
import { LoginResult } from '../../../enums/login-result.enum'
import { Guid } from 'guid-typescript'
import { UrlEnum } from 'src/app/enums/url.enum'
@Component({
  selector: 'app-first-login',
  templateUrl: './first-login.component.html',
  styleUrls: ['./first-login.component.scss']
})
export class FirstLoginComponent {
  form: UntypedFormGroup = new UntypedFormGroup({
    mail: new UntypedFormControl('', Validators.email),
    accountPassword: new UntypedFormControl('', Validators.required)
  })
  disableLoginButton = false
  constructor (
    private encryption: StringEncryptionService,
    private onePassService: OnePassService,
    private router: Router,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {
    localStorage.clear()
    this.disableBrowserProtectionForFirstUsage()
  }

  onSubmit () {
    const accountPassword = this.form.controls['accountPassword']
    const mail = this.form.controls['mail']
    if (mail.valid && accountPassword.valid) {
      if (localStorage.getItem('token') === null) {
        const requestModel = new ApiRequestModel()
        requestModel.mail = mail.value
        requestModel.password = accountPassword.value
        this.onePassService.GetToken(requestModel).subscribe(p => {
          localStorage.setItem('token', p)
          this.checkPasswordBoxKey(mail.value, accountPassword.value)
          return
        })
      }
      this.checkPasswordBoxKey(mail.value, accountPassword.value)
    }
  }
  private checkPasswordBoxKey (mail: string, accountPassword: string) {
    const accountPasswordHashed = this.encryption.encryptSha(accountPassword)
    const requestModel = new ApiRequestModel()
    requestModel.mail = mail
    requestModel.deviceId = this.getDeviceId()
    requestModel.password = accountPassword
    requestModel.token = localStorage.getItem('token')
    const chromeVersion =
      'Web Browser ' + /Chrome\/([0-9.]+)/.exec(navigator.userAgent)[1]
    this.onePassService
      .LoginUser(requestModel, chromeVersion, 0)
      .subscribe(p => {
        if (
          p.loginState === LoginResult.WrongPassword ||
          p.loginState === LoginResult.WrongLicense
        ) {
          let wrongInfo, fail
          this.translate.get('Common.WrongInfo').subscribe(p => (wrongInfo = p))
          this.translate.get('Common.Fail').subscribe(p => (fail = p))
          this.snackBar.open(wrongInfo, fail, {
            duration: 2000
          })
          this.disableLoginButton = false
          return
        }
        if (p.loginState === LoginResult.MailCodeSend) {
          localStorage.setItem('mail', mail)
          localStorage.setItem('accountPasswordHashed', accountPasswordHashed)
          localStorage.setItem('tempPass', accountPassword)
          this.redirectCodePage()
          return
        }
        if (
          p.loginState === LoginResult.UserAuthenticated ||
          LoginResult.NoDevice
        ) {
          localStorage.setItem('mail', mail)
          localStorage.setItem('accountPasswordHashed', accountPasswordHashed)
          localStorage.setItem('password', accountPassword)
          this.setTimer()
          this.router.navigate([UrlEnum.DASHBOARD])
        }
      }
      )
  }
  private setTimer () {
    const interval = localStorage.getItem('interval')
    if (interval !== null) {
      const date = new Date()
      date.setMinutes(date.getMinutes() + Number(interval))
      localStorage.setItem('expire', date.toString())
    }
  }
  private redirectCodePage () {
    const accountPassword = this.form.controls['accountPassword'].value
    const mail = this.form.controls['mail'].value
    const request = new ApiRequestModel()
    request.mail = mail
    request.password = accountPassword
    request.token = localStorage.getItem('token')
    this.router.navigate([UrlEnum.VERIFY])
  }
  private getDeviceId () {
    const deviceId = localStorage.getItem('deviceId')
    if (deviceId === null) {
      const newGuid = Guid.create().toString()
      localStorage.setItem('deviceId', newGuid)
      return newGuid
    }
    return deviceId
  }
  private disableBrowserProtectionForFirstUsage () {
    localStorage.setItem('blockAds', 'false')
    localStorage.setItem('fingerprint', 'false')
    localStorage.setItem('clearCookies', 'false')
    localStorage.setItem('disableFlash', 'false')
    localStorage.setItem('spoofingScreen', 'false')
  }
}
