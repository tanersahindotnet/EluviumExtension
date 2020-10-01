import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BottomNavItem } from 'ngx-bottom-nav';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent {
  items: BottomNavItem[];
  constructor(private translate: TranslateService) { this.setupNavigation(); }
  blockAds;
  webRtc;
  fingerprint;
  clearCookies;
  disableFlash;
  spoofingScreen;
  browserProtection;
  private setupNavigation() {
    let vault;
    let generator;
    let account;
    let settings;
    let security;
    this.translate.get('Navigation.Vault').subscribe(p => vault = p);
    this.translate.get('Navigation.Generator').subscribe(p => generator = p);
    this.translate.get('Navigation.Account').subscribe(p => account = p);
    this.translate.get('Navigation.Settings').subscribe(p => settings = p);
    this.translate.get('Navigation.Security').subscribe(p => security = p);
    this.items = [
        {icon: 'lock', label: vault, routerLink: '/dashboard'},
        {icon: 'refresh', label: generator, routerLink: '/generator'},
        {icon: 'account_circle', label: account, routerLink: '/account'},
        {icon: 'settings', label: settings, routerLink: '/setting'},
        {icon: 'security', label: security, routerLink: '/privacy'}
      ];
  }
}
