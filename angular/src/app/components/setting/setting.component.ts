import { Component, ChangeDetectorRef } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { DialogContentComponent } from '../../dialog/about-dialog/about-dialog.component'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Languages } from '../../constants/languages'
@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent {
  interval = localStorage.getItem('interval')
  language = localStorage.getItem('language')
  autoSubmit = localStorage.getItem('autoSubmit') == "true" ? true : false;
  savePopup = localStorage.getItem('savePopup') == "true" ? true : false;
  constructor (
    public dialog: MatDialog,
    private route: Router,
    private translate: TranslateService,
    private cdRef: ChangeDetectorRef
  ) {
    this.checkSession()
    this.getInterval()
    this.getProgramLanguage()
    this.getAutoSubmit();
  }

  getHelp () {
    window.open('http://eluvium.info/Home/Faq', '_blank')
  }
  aboutDialog () {
    const dialogRef = this.dialog.open(DialogContentComponent)
    dialogRef.afterClosed()
  }
  intervalChanged (value) {
    localStorage.setItem('interval', value)
    const date = new Date()
    date.setMinutes(date.getMinutes() + value)
    localStorage.setItem('expire', date.toString())
  }

  languageChanged (value) {
    localStorage.setItem('language', value)
    this.translate.setDefaultLang(value)
    this.translate.use(value)
    this.cdRef.detectChanges()
  }

  autoSubmitChanged(value) {
    localStorage.setItem('autoSubmit', value)
    this.cdRef.detectChanges();
  }

  savePopupChanged(value) {
    localStorage.setItem('savePopup', value)
    this.cdRef.detectChanges();
  }

  rateExtension () {
    window.open(
      'https://chrome.google.com/webstore/detail/eluvium/knfgoejdefgibebmjpejljjbgiacphea',
      '_blank'
    )
  }

  private checkSession () {
    const password = localStorage.getItem('password')
    if (password === null) {
      this.route.navigate(['login'])
    }
  }

  private getInterval () {
    if (this.interval === null) {
      this.interval = '0'
    }
  }

  private getAutoSubmit () {
    if (this.autoSubmit === null) {
      localStorage.setItem('autoSubmit', "false")
      this.autoSubmit = false;
    }
  }

  private getProgramLanguage () {
    if (this.language === null) {
      localStorage.setItem('language', Languages.English)
      this.language = Languages.English
    }
  }
}
