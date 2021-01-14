import { Component, ChangeDetectorRef } from '@angular/core';
import { BottomNavItem } from 'ngx-bottom-nav';
import { MatDialog } from '@angular/material/dialog';
import { DialogContentComponent } from '../dialog/about-dialog/about-dialog.component';
import { Router } from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import { Languages } from '../Constants/languages';
@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent {
  items: BottomNavItem[];
  interval = localStorage.getItem('interval');
  language = localStorage.getItem('language');
  constructor(public dialog: MatDialog, private route: Router, private translate: TranslateService,
  private cdRef: ChangeDetectorRef) {
   this.checkSession();
   this.setupNavigation();
   this.getInterval();
   this.getProgramLanguage();
  }

  getHelp() {
    window.open('http://eluvium.info/Home/Faq', '_blank');
  }
  aboutDialog() {
    const dialogRef = this.dialog.open(DialogContentComponent);
    dialogRef.afterClosed();
  }
  intervalChanged(value) {
    localStorage.setItem('interval', value)
    const date = new Date();
    date.setMinutes(date.getMinutes() + value);
    localStorage.setItem('expire', date.toString())
  }

  languageChanged(value) {
    localStorage.setItem('language', value)
    this.translate.setDefaultLang(value);
    this. translate.use(value);
    this.setupNavigation();
    this.cdRef.detectChanges();
  }

  rateExtension() {
    window.open('https://chrome.google.com/webstore/detail/eluvium/knfgoejdefgibebmjpejljjbgiacphea', '_blank');
  }

  private checkSession() {
    const password = localStorage.getItem('password');
    if (password === null) {
      this.route.navigate(['login']);
    }
  }

  private setupNavigation() {
    let vault, generator, account, settings;
    this.translate.get('Navigation.Vault').subscribe(p => vault = p);
    this.translate.get('Navigation.Generator').subscribe(p => generator = p);
    this.translate.get('Navigation.Account').subscribe(p => account = p);
    this.translate.get('Navigation.Settings').subscribe(p => settings = p);

    this.items = [
        {icon: 'lock', label: vault, routerLink: '/dashboard'},
        {icon: 'refresh', label: generator, routerLink: '/generator'},
        {icon: 'account_circle', label: account, routerLink: '/account'},
        {icon: 'settings', label: settings, routerLink: '/setting'},
        {icon: 'security', label: settings, routerLink: '/privacy'}
      ];
  }
  private getInterval()  {
     if (this.interval === null) {
       this.interval = '0';
     }
  }
  private getProgramLanguage() {
    if (this.language === null) {
      localStorage.setItem('language', Languages.English);
      this.language = Languages.English;
    }
  }
}
