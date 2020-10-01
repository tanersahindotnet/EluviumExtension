import { Component } from '@angular/core';
import { BottomNavItem } from 'ngx-bottom-nav';
import { OnePassService } from '../Services/onePass.service';
import { ApiRequestModel } from '../Models/apiRequestModel';
import { OnePassEncryptionService } from '../Services/onePassEncryption.service';
import { Password } from '../Models/password';
import { CreditCard } from '../Models/creditCard';
import { Server } from '../Models/server';
import { WifiPassword } from '../Models/wifiPassword';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoginResult } from '../Constants/loginResult';
import {MatDialog} from '@angular/material/dialog';
import { QuestionDialogComponent } from '../dialog/question-dialog/question-dialog.component';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  items: BottomNavItem[];
  passwords: Password[] = [];
  creditCards: CreditCard[] = [];
  servers: Server[] = [];
  wifiPasswords: WifiPassword[] = [];
  backUppasswords: Password[] = [];
  backUpcreditCards: CreditCard[] = [];
  backUpservers: Server[] = [];
  backUpwifiPasswords: WifiPassword[] = [];
  dashboardPanelIsHidden = false;
  passwordPanelIsHidden = true;
  wifiPanelIsHidden = true;
  serverPanelIsHidden = true;
  creditCardPanelIsHidden = true;
  data: any = null;
  activeTabs: Password[] = [];
  progress = true
  _password;
  tabIndex = 0;
  constructor(private onePassService: OnePassService, private decryptionService: OnePassEncryptionService,
  private snackBar: MatSnackBar, private router: Router, private dialog: MatDialog, private translate: TranslateService) {
    const token = localStorage.getItem('token');
    this._password = localStorage.getItem('password');
    if (this._password === null) {
      router.navigate(['login']);
    }
    if (token === null || !token) {
      this.setToken();
     } else {
      this.CheckSession();
     }
    this.setupNavigation();
    this.setActiveTab();
    this.getPosition();
  }
  addPassword(item: Password) {
    this.data = item;
    this.passwordPanelIsHidden = false;
    this.dashboardPanelIsHidden = true;
    this.wifiPanelIsHidden = true;
    this.serverPanelIsHidden = true;
    this.creditCardPanelIsHidden = true;
  }
  addWifi(item: WifiPassword) {
    this.data = item;
    this.wifiPanelIsHidden = false;
    this.passwordPanelIsHidden = true;
    this.dashboardPanelIsHidden = true;
    this.serverPanelIsHidden = true;
    this.creditCardPanelIsHidden = true;
  }
  addServer(item: Server) {
    this.data = item;
    this.dashboardPanelIsHidden = true;
    this.passwordPanelIsHidden = true;
    this.wifiPanelIsHidden = true;
    this.serverPanelIsHidden = false;
  }
  addCreditCard(item: CreditCard) {
    this.data = item;
    this.dashboardPanelIsHidden = true;
    this.passwordPanelIsHidden = true;
    this.wifiPanelIsHidden = true;
    this.serverPanelIsHidden = true;
    this.creditCardPanelIsHidden = false;
  }
  stateEmitterResult(result) {
    if (result) {
      this.dashboardPanelIsHidden = false;
      this.passwordPanelIsHidden = true;
      this.wifiPanelIsHidden = true;
      this.serverPanelIsHidden = true;
      this.creditCardPanelIsHidden = true;
    }
  }
  saveEmitterResult(result) {
    if (result) {
      this.getOnePassData();
    }
  }
  deletePassword(data: Password, event) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(QuestionDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
     if (result) {
      const request = this.returnRequestModel();
        this.onePassService.DeletePassword(request,data.id).subscribe(p => {
          let deleted, success, fail, somethingWrong;
          this.translate.get('Common.RecordDeleted').subscribe(p => deleted = p);
          this.translate.get('Common.Success').subscribe(p => success = p);
          this.translate.get('Common.Fail').subscribe(p => fail = p);
          this.translate.get('Common.SomethingWrong').subscribe(p => somethingWrong = p);
          if (p) {
            this.passwords = this.passwords.filter(obj => obj !== data);
            this.snackBar.open(deleted, success, {
              duration: 2000
            });
            this.saveLocalStorageItems();
          } else {
            this.snackBar.open(somethingWrong, fail, {
              duration: 2000
            });
          }
        });
     }
    });
  }
  deleteCreditCard(data: CreditCard, event ) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(QuestionDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const request = this.returnRequestModel();
          this.onePassService.DeleteCreditCard(request, data.id).subscribe(p => {
            let deleted, success, fail, somethingWrong;
            this.translate.get('Common.RecordDeleted').subscribe(p => deleted = p);
            this.translate.get('Common.Success').subscribe(p => success = p);
            this.translate.get('Common.Fail').subscribe(p => fail = p);
            this.translate.get('Common.SomethingWrong').subscribe(p => somethingWrong = p);
            if (p) {
              this.snackBar.open(deleted, success, {
                duration: 2000
              });
              this.creditCards = this.creditCards.filter(obj => obj !== data);
            } else {
              this.snackBar.open(somethingWrong, fail, {
                duration: 2000
              });
            }
          });
      }
    });
  }
  deleteServer(data: Server, event) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(QuestionDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      const request = this.returnRequestModel();
        this.onePassService.DeleteServer(request, data.id).subscribe(p => {
          let deleted, success, fail, somethingWrong;
          this.translate.get('Common.RecordDeleted').subscribe(p => deleted = p);
          this.translate.get('Common.Success').subscribe(p => success = p);
          this.translate.get('Common.Fail').subscribe(p => fail = p);
          this.translate.get('Common.SomethingWrong').subscribe(p => somethingWrong = p);
          if (p) {
            this.snackBar.open(deleted, success, {
              duration: 2000
            });
            this.servers = this.servers.filter(obj => obj !== data);
          } else {
            this.snackBar.open(somethingWrong, fail, {
              duration: 2000
            });
          }
        });
      }
    });
    }

    deleteWifi(data: WifiPassword, event) {
      event.stopPropagation();

      const dialogRef = this.dialog.open(QuestionDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
        const request = this.returnRequestModel();
        this.onePassService.DeleteWifiPassword(request, data.id).subscribe(p => {
          let deleted, success, fail, somethingWrong;
          this.translate.get('Common.RecordDeleted').subscribe(p => deleted = p);
          this.translate.get('Common.Success').subscribe(p => success = p);
          this.translate.get('Common.Fail').subscribe(p => fail = p);
          this.translate.get('Common.SomethingWrong').subscribe(p => somethingWrong = p);
          if (p) {
            this.snackBar.open(deleted, success, {
              duration: 2000
            });
            this.wifiPasswords = this.wifiPasswords.filter(obj => obj !== data);
          } else {
            this.snackBar.open(somethingWrong, fail, {
              duration: 2000
            });
          }
        });
      }
      });
    }

  autoFill(item) {
    const someJSON = { 'userName': item.userName, 'password': item.sitePassword};
    chrome.tabs.executeScript({
      code: '(' + function(params) {
          const inputs = document.getElementsByTagName('input');
          for (let i = 1; i < inputs.length; i++) {
              if (inputs[i].type === 'password') {
                  inputs[i - 1].value = params.userName;
                  inputs[i].value = params.password;
                  break;
              }
          }
          return {success: true, html: document.body.innerHTML};
          } + ')(' + JSON.stringify(someJSON) + ');'
      }, function() {
       window.close();
  });
  }
  copyText(data, itemName, event) {
    event.stopPropagation();
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', (data));
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
    this.snackBar.open(itemName + ' Copied', 'Success', {
      duration: 2000
    });
  }
  autoFillCreditCard(item: CreditCard, event) {
    event.stopPropagation();
  }

  onSearchChange(search: string) {
    if (search.length === 0) {
      this.creditCards = this.backUpcreditCards
      this.passwords = this.backUppasswords;
      this.servers = this.backUpservers;
      this.wifiPasswords = this.backUpwifiPasswords;
    } else {
      this.creditCards = this.backUpcreditCards.filter(p => p.title.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
      this.passwords = this.backUppasswords.filter(p => p.title.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
      this.servers = this.backUpservers.filter(p => p.title.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
      this.wifiPasswords = this.backUpwifiPasswords.filter(p => p.title.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
    }
  }
  setCurrentPosition(position) {
    localStorage.setItem('position', position);
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
private saveLocalStorageItems() {
  const urlList = this.passwords.map(({ url  }) => url);
  localStorage.setItem('urlList', JSON.stringify(urlList));
  localStorage.setItem('localPasswords', JSON.stringify(this.passwords));
}
private setActiveTab() {
  const localPasswords = JSON.parse(localStorage.getItem('localPasswords'));
  const url = localStorage.getItem('activeUrl');
  if (url) {
    this.activeTabs = localPasswords.filter(p => p.url.includes(url) || url.includes(p.url));
  } else {
    this.activeTabs = [];
  }
}
private getOnePassData() {
  const request = this.returnRequestModel();
  this.onePassService.GetOnePassDataByUserId(request).subscribe(p => {
    this.passwords = this.decryptionService.decryptPasswords(p.passwordData, this._password)
    this.creditCards = this.decryptionService.decryptCreditCards(p.creditCardData, this._password);
    this.servers = this.decryptionService.decryptServers(p.serverData, this._password);
    this.wifiPasswords = this.decryptionService.decryptWifiPasswords(p.wifiPassword, this._password);
    this.backUpcreditCards = this.creditCards
    this.backUppasswords = this.passwords;
    this.backUpservers = this.servers;
    this.backUpwifiPasswords = this.wifiPasswords;
    this.progress = false;
    this.saveLocalStorageItems();
  });
}
private returnRequestModel(): ApiRequestModel {
  const mail = localStorage.getItem('mail');
  const deviceId =  localStorage.getItem('deviceId');
  const token = localStorage.getItem('token');
  const password = localStorage.getItem('password');
  const request = new ApiRequestModel();
  request.mail = mail;
  request.deviceId = deviceId
  request.password = password;
  request.token = token;
  return request;
}

private CheckSession() {
  const request = this.returnRequestModel();
  request.password = localStorage.getItem('password');
  this.onePassService.LoginUser(request, 'Browser', 0).subscribe(p => {
    if (p.loginState === LoginResult.UserAuthenticated) {
      localStorage.setItem('desktopDeviceName', p.desktopDeviceName);
      localStorage.setItem('mobileDeviceName', p.mobileDeviceName);
      localStorage.setItem('productId', p.productId.toString());
      localStorage.setItem('registerDate', p.registerDate.toString());
      this.getOnePassData();
    } else {
      localStorage.removeItem('mail');
      localStorage.removeItem('accountPasswordHashed');
      localStorage.removeItem('onePassPasswordHashed');
      localStorage.removeItem('token');
      this.router.navigate(['firstLogin']);
    }
  })
}
private setToken() {
    const requestModel = new ApiRequestModel();
    requestModel.mail = localStorage.getItem('mail');
    requestModel.password =  localStorage.getItem('password');
    this.onePassService.GetToken(requestModel).subscribe( p => {
      localStorage.setItem('token', p);
      this.CheckSession();
    });
}
private getPosition() {
  const position = localStorage.getItem('position');
  if (position != null) {
    this.tabIndex = Number(position);
  } else {
    localStorage.setItem('position', '0');
  }
}
}
