import { Component, OnInit } from '@angular/core'
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms'
import { PasswordAdvisorService } from '../../services/password-advisor.service'
import { PasswordCheckStrength } from '../../enums/password-strength.enum'
import { TranslateService } from '@ngx-translate/core'
import { OnePassService } from '../../services/onepass.service'
import { ApiUser } from '../../models/api-user.model'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Router } from '@angular/router'
import { ThemePalette } from '@angular/material/core'
import { ProgressBarMode } from '@angular/material/progress-bar'
import { RegisterEnum } from '../../enums/register.enum'
import { StringEncryptionService } from '../../services/string-encryption.service'
import { Guid } from 'guid-typescript'
import { UrlEnum } from 'src/app/enums/url.enum'
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  accountPassStrengthVisible = false
  accountPassStrength = 0
  accountPassStrengthText: string
  buttonDisabled = false
  color: ThemePalette = 'primary'
  mode: ProgressBarMode = 'determinate'
  bufferValue = 75
  form: UntypedFormGroup = new UntypedFormGroup({
    mail: new UntypedFormControl('', Validators.email),
    accountPassword: new UntypedFormControl('', Validators.required),
    fullName: new UntypedFormControl('', Validators.required)
  })
  constructor (
    private passwordAdvisorService: PasswordAdvisorService,
    private translate: TranslateService,
    private onePassService: OnePassService,
    private snackBar: MatSnackBar,
    private router: Router,
    private stringEncryption: StringEncryptionService
  ) {}

  onSubmit () {
    const mail = this.form.controls['mail']
    const fullName = this.form.controls['fullName']
    const accountPassword = this.form.controls['accountPassword']
    if (accountPassword.value.includes('/')) {
      return
    }
    if (this.accountPassStrength < 59) {
      let mailUsed, fail
      this.translate.get('Register.LowStrength').subscribe(p => (mailUsed = p))
      this.translate.get('Common.Fail').subscribe(p => (fail = p))
      this.snackBar.open(mailUsed, fail, {
        duration: 2000
      })
      return
    }
    const chromeVersion =
      'Web Browser ' + /Chrome\/([0-9.]+)/.exec(navigator.userAgent)[1]
    const apiUser = new ApiUser()
    const accountEncrypted = this.stringEncryption.encryptSha(
      accountPassword.value
    )
    apiUser.language = 'en-US'
    apiUser.mail = mail.value
    apiUser.fullName = fullName.value
    apiUser.password = accountPassword.value
    apiUser.deviceId = this.getDeviceId()
    apiUser.deviceName = chromeVersion
    apiUser.deviceType = 0
    this.buttonDisabled = true
    this.onePassService.Register(apiUser).subscribe(p => {
      if (p === RegisterEnum.Success) {
        localStorage.setItem('mail', mail.value)
        localStorage.setItem('accountPasswordHashed', accountEncrypted)
        localStorage.setItem('password', accountPassword.value)
        this.router.navigate([UrlEnum.DASHBOARD])
      }
      if (p === RegisterEnum.MailUsed) {
        let mailUsed, fail
        this.translate.get('Register.MailUsed').subscribe(p => (mailUsed = p))
        this.translate.get('Common.Fail').subscribe(p => (fail = p))
        this.snackBar.open(mailUsed, fail, {
          duration: 2000
        })
        this.buttonDisabled = false
      }
      if (p === RegisterEnum.Fail) {
        let wrongInfo, fail
        this.translate.get('Common.WrongInfo').subscribe(p => {
          return (wrongInfo = p)
        })
        this.translate.get('Common.Fail').subscribe(p => {
          return (fail = p)
        })
        this.snackBar.open(wrongInfo, fail, {
          duration: 2000
        })
        this.buttonDisabled = false
      }
    })
  }
  accountPassChanged (password: string) {
    if (password.length === 0) {
      this.accountPassStrengthVisible = false
    } else {
      this.accountPassStrengthVisible = true
    }
    if (password.length < 10) {
      this.translate
        .get('Register.Short')
        .subscribe(p => (this.accountPassStrengthText = p))
      this.accountPassStrength = 0
    }
    const result = this.passwordAdvisorService.checkPasswordStrength(password)
    if (result === PasswordCheckStrength.VeryWeak) {
      this.translate
        .get('Register.VeryWeak')
        .subscribe(p => (this.accountPassStrengthText = p))
      this.accountPassStrength = 10
    }
    if (result === PasswordCheckStrength.Weak) {
      this.translate
        .get('Register.Weak')
        .subscribe(p => (this.accountPassStrengthText = p))
      this.accountPassStrength = 25
    }
    if (result === PasswordCheckStrength.Good) {
      this.translate
        .get('Register.Good')
        .subscribe(p => (this.accountPassStrengthText = p))
      this.accountPassStrength = 60
    }
    if (result === PasswordCheckStrength.Strong) {
      this.translate
        .get('Register.Strong')
        .subscribe(p => (this.accountPassStrengthText = p))
      this.accountPassStrength = 80
    }
    if (result === PasswordCheckStrength.VeryStrong) {
      this.translate
        .get('Register.VeryStrong')
        .subscribe(p => (this.accountPassStrengthText = p))
      this.accountPassStrength = 100
    }
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
}
