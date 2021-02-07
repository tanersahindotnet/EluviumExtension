import { Component } from '@angular/core'
import { OnePassService } from '../../services/onepass.service'
import { ApiRequestModel } from '../../models/api-request.model'
import { Guid } from 'guid-typescript'
import { TranslateService } from '@ngx-translate/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Router } from '@angular/router'
import { Languages } from '../../constants/languages'
@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent {
  code: number
  verifyButtonDisabled = false
  constructor (
    private router: Router,
    private snackBar: MatSnackBar,
    private onePassService: OnePassService,
    private translate: TranslateService
  ) {
    this.checkGuid()
  }
  verify () {
    this.verifyButtonDisabled = true
    const guid = Guid.parse(localStorage.getItem('guid'))
    const chromeVersion =
      'Web Browser ' + /Chrome\/([0-9.]+)/.exec(navigator.userAgent)[1]
    const apiRequestModel = this.getRequestModel()
    this.onePassService
      .Verify(apiRequestModel, guid, this.code, chromeVersion, 0)
      .subscribe(p => {
        if (p) {
          localStorage.removeItem('tempPass')
          this.router.navigate(['login'])
        } else {
          let wrongInfo, fail
          this.translate.get('Common.WrongInfo').subscribe(p => (wrongInfo = p))
          this.translate.get('Common.Fail').subscribe(p => (fail = p))
          this.snackBar.open(wrongInfo, fail, {
            duration: 2000
          })
          this.verifyButtonDisabled = false
        }
      })
  }
  resend () {
    const language = this.getProgramLanguage()
    const guid = Guid.create()
    localStorage.setItem('guid', guid.toString())
    const apiRequestModel = this.getRequestModel()
    this.onePassService
      .SendCode(apiRequestModel, guid, language)
      .subscribe(p => {
        if (p) {
          let success, codeSended
          this.translate
            .get('Verification.CodeSended')
            .subscribe(p => (codeSended = p))
          this.translate.get('Common.Success').subscribe(p => (success = p))
          this.snackBar.open(codeSended, success, {
            duration: 2000
          })
        } else {
          let fail, somethingWentWrong
          this.translate
            .get('Common.SomethingWrong')
            .subscribe(p => (somethingWentWrong = p))
          this.translate.get('Common.Fail').subscribe(p => (fail = p))
          this.snackBar.open(somethingWentWrong, fail, {
            duration: 2000
          })
        }
      })
  }
  back () {
    this.router.navigate(['firstLogin'])
  }
  private getProgramLanguage (): string {
    const lang = localStorage.getItem('language')
    if (lang === null) {
      localStorage.setItem('language', Languages.English)
    }
    return localStorage.getItem('language')
  }
  private getRequestModel (): ApiRequestModel {
    const apiRequestModel = new ApiRequestModel()
    apiRequestModel.password = localStorage.getItem('tempPass')
    apiRequestModel.deviceId = localStorage.getItem('deviceId')
    apiRequestModel.mail = localStorage.getItem('mail')
    apiRequestModel.token = localStorage.getItem('token')
    return apiRequestModel
  }
  private checkGuid () {
    const guid = localStorage.getItem('guid')
    if (guid === null) {
      const guidd = Guid.create()
      localStorage.setItem('guid', guidd.toString())
      this.resend()
    }
  }
}
