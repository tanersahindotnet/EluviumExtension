import { Password } from '../Models/password';
import { StringEncryptionService } from './stringEncryption.service';
import { CreditCard } from '../Models/creditCard';
import { Server } from '../Models/server';
import { WifiPassword } from '../Models/wifiPassword';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class OnePassEncryptionService {
  constructor(private encryptionService: StringEncryptionService) {}
  public decryptPasswords(passwords: Password[], password: string): Password[] {
    const passwordList: Password[] = [];
    passwords.forEach(element => {
      passwordList.push({
        id:  element.id,
        userId:  element.userId,
        notes: this.encryptionService.decryptAES(element.notes, password),
        url: this.encryptionService.decryptAES(element.url, password),
        sitePassword:  this.encryptionService.decryptAES(element.sitePassword, password),
        title: this.encryptionService.decryptAES(element.title, password),
        userName: this.encryptionService.decryptAES(element.userName, password)
      });
    });
    return passwordList;
 }
 public decryptCreditCards(passwords: CreditCard[], password: string): CreditCard[] {
   const creditCardList: CreditCard[] = [];
   passwords.forEach(element => {
     creditCardList.push({
       id:  element.id,
       userId:  element.userId,
       notes: this.encryptionService.decryptAES(element.notes, password),
       title: this.encryptionService.decryptAES(element.title, password),
       cardholderName: this.encryptionService.decryptAES(element.cardholderName, password),
       code: this.encryptionService.decryptAES(element.code, password),
       expMonth: this.encryptionService.decryptAES(element.expMonth, password),
       expYear: this.encryptionService.decryptAES(element.expYear, password),
       number: this.encryptionService.decryptAES(element.number, password),
     });
   });
   return creditCardList;
}
public decryptServers(passwords: Server[], password: string): Server[] {
 const serverList: Server[] = [];
 passwords.forEach(element => {
   serverList.push({
     id:  element.id,
     userId:  element.userId,
     notes: this.encryptionService.decryptAES(element.notes, password),
     title: this.encryptionService.decryptAES(element.title, password),
     hostName: this.encryptionService.decryptAES(element.hostName, password),
     password: this.encryptionService.decryptAES(element.password, password),
     userName: this.encryptionService.decryptAES(element.userName, password),
   });
 });
 return serverList;
}
public decryptWifiPasswords(wifiPasswords: WifiPassword[], password: string): WifiPassword[] {
 const wifiPasswordList: WifiPassword[] = [];
 wifiPasswords.forEach(element => {
   wifiPasswordList.push({
     id:  element.id,
     userId:  element.userId,
     notes: this.encryptionService.decryptAES(element.notes, password),
     title: this.encryptionService.decryptAES(element.title, password),
     password: this.encryptionService.decryptAES(element.password, password),
     ssid: this.encryptionService.decryptAES(element.ssid, password)
   });
 });
 return wifiPasswordList;
}

public encryptCreditCards(creditCard: CreditCard, password: string): CreditCard {
  const creditCardList: CreditCard = new CreditCard();
  creditCardList.id =  creditCard.id,
  creditCardList.userId =  creditCard.userId,
  creditCardList.notes = this.encryptionService.encryptAES(creditCard.notes, password),
  creditCardList.title = this.encryptionService.encryptAES(creditCard.title, password),
  creditCardList.cardholderName = this.encryptionService.encryptAES(creditCard.cardholderName, password),
  creditCardList.code = this.encryptionService.encryptAES(creditCard.code, password),
  creditCardList.expMonth = this.encryptionService.encryptAES(creditCard.expMonth, password),
  creditCardList.expYear = this.encryptionService.encryptAES(creditCard.expYear, password),
  creditCardList.number = this.encryptionService.encryptAES(creditCard.number, password)
  return creditCardList;
}

public encryptPassword(passwordItem: Password, password: string): Password {
  const passwordData: Password = new Password();
  passwordData.id =  passwordItem.id,
  passwordData.userId =  passwordItem.userId,
  passwordData.notes = this.encryptionService.encryptAES(passwordItem.notes, password),
  passwordData.title = this.encryptionService.encryptAES(passwordItem.title, password),
  passwordData.sitePassword = this.encryptionService.encryptAES(passwordItem.sitePassword, password),
  passwordData.url = this.encryptionService.encryptAES(passwordItem.url, password),
  passwordData.userName = this.encryptionService.encryptAES(passwordItem.userName, password)
  return passwordData;
}

public encryptServer(server: Server, password: string): Server {
  const serverData: Server = new Server();
  serverData.id =  server.id,
  serverData.userId =  server.userId,
  serverData.notes = this.encryptionService.encryptAES(server.notes, password),
  serverData.title = this.encryptionService.encryptAES(server.title, password),
  serverData.userName = this.encryptionService.encryptAES(server.userName, password)
  serverData.hostName = this.encryptionService.encryptAES(server.hostName, password)
  serverData.password = this.encryptionService.encryptAES(server.password, password)
  return serverData;
}
public encryptWifi(wifiPassword: WifiPassword, password: string): WifiPassword {
  const wifiData: WifiPassword = new WifiPassword();
  wifiData.id =  wifiPassword.id,
  wifiData.userId =  wifiPassword.userId,
  wifiData.notes = this.encryptionService.encryptAES(wifiPassword.notes, password),
  wifiData.title = this.encryptionService.encryptAES(wifiPassword.title, password),
  wifiData.password = this.encryptionService.encryptAES(wifiPassword.password, password),
  wifiData.ssid = this.encryptionService.encryptAES(wifiPassword.ssid, password)
  return wifiData;
}
}
