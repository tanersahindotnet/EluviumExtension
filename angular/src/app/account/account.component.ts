import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AccountPromptDialogComponent } from '../dialog/account-prompt-dialog/account-prompt-dialog.component';
import { OnePassService } from '../Services/onePass.service'
import { StringEncryptionService } from '../Services/stringEncryption.service';
import { ApiRequestModel } from '../Models/apiRequestModel';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {
  items;
  desktopDeviceName = localStorage.getItem('desktopDeviceName').substring(0,30) + '...';
  mail = localStorage.getItem('mail');
  mobileDeviceName = localStorage.getItem('mobileDeviceName').substring(0,30) + '...';
  productId = localStorage.getItem('productId');
  registerDate = new Date(localStorage.getItem('registerDate')).toDateString();
  constructor(private route: Router, private dialog: MatDialog, private onePassService: OnePassService,
  private encryptionService: StringEncryptionService, private snackBar: MatSnackBar, private translate: TranslateService) {
    this.checkSession();
    this.setupNavigation();
    this.setProductType(this.productId);
  }
  lock() {
    localStorage.removeItem('password');
    this.route.navigate(['login']);
  }
  logout() {
    localStorage.clear();
    this.route.navigate(['firstLogin']);
  }
  manageMyAccount() {
    window.open('http://eluvium.info/', '_blank');
  }
  disconnectComputer() {
    const dialogRef = this.dialog.open(AccountPromptDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        let success, fail, disconnect, wrongInfo;
        this.translate.get('Common.WrongInfo').subscribe(p => wrongInfo = p);
        this.translate.get('Common.Success').subscribe(p => success = p);
        this.translate.get('Common.Fail').subscribe(p => fail = p);
        this.translate.get('Account.DisconnectedComputer').subscribe(p => disconnect = p);

        const accountPasswordHashed = localStorage.getItem('accountPasswordHashed');
        const mail = localStorage.getItem('mail');
        const token = localStorage.getItem('token');
        const deviceId = localStorage.getItem('deviceId');
        const hashedPassword = this.encryptionService.encryptSha(result);
        if (accountPasswordHashed === hashedPassword) {
          const request = new ApiRequestModel();
          request.mail = mail;
          request.password = result;
          request.token = token;
          request.deviceId = deviceId;
          this.onePassService.LogoutDesktopDevice(request).subscribe(p => {
            if (p) {
              this.snackBar.open(disconnect, success, {
                duration: 2000
              });
            } else {
              this.snackBar.open(wrongInfo, fail, {
                duration: 2000
              });
            }
          });
        } else {
          this.snackBar.open(wrongInfo, fail, {
            duration: 2000
          });
        }
      }
    });
  }
  disconnectPhone() {
    const dialogRef = this.dialog.open(AccountPromptDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        let success, fail, disconnect, wrongInfo;
        this.translate.get('Common.WrongInfo').subscribe(p => wrongInfo = p);
        this.translate.get('Common.Success').subscribe(p => success = p);
        this.translate.get('Common.Fail').subscribe(p => fail = p);
        this.translate.get('Account.DisconnectedPhone').subscribe(p => disconnect = p);

        const accountPasswordHashed = localStorage.getItem('accountPasswordHashed');
        const mail = localStorage.getItem('mail');
        const token = localStorage.getItem('token');
        const deviceId = localStorage.getItem('deviceId');
        const hashedPassword = this.encryptionService.encryptSha(result);
        if (accountPasswordHashed === hashedPassword) {
          const request = new ApiRequestModel();
          request.mail = mail;
          request.password = result;
          request.token = token;
          request.deviceId = deviceId;
          this.onePassService.LogoutPhoneDevice(request).subscribe(p => {
            if (p) {
              this.snackBar.open(disconnect, success, {
                duration: 2000
              });
            } else {
              this.snackBar.open(wrongInfo, fail, {
                duration: 2000
              });
            }
          });
        } else {
          this.snackBar.open(wrongInfo, fail, {
            duration: 2000
          });
        }
      }
    });
  }
  private checkSession() {
    const password = localStorage.getItem('password');
    if (password === null) {
      this.route.navigate(['login']);
    }
  }
  private setProductType(product) {
    if (product === '0') {
      this.productId = 'Eluvium Premium Trial';
    }
    if (product === '1') {
      this.productId = 'Eluvium Free';
    }
    if (product === '2') {
      this.productId = 'Eluvium Premium';
    }
    if (product === '3') {
      this.productId = 'Eluvium Business';
    }
  }
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
