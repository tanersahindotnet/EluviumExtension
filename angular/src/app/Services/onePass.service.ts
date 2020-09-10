import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constants } from '../Constants/Constants';
import { RegisterEnum } from '../Constants/registerEnum';
import { ApiRequestModel } from '../Models/apiRequestModel';
import { Injectable } from '@angular/core';
import { SessionResult } from '../Models/sessionResult'
import {OnePassDataResult} from '../Models/onePassDataResult'
import { CreditCard } from '../Models/creditCard';
import { WifiPassword } from '../Models/wifiPassword';
import { Server } from '../Models/server';
import { Password } from '../Models/password';
import { ApiUser } from '../Models/apiUser';
import { Guid } from 'guid-typescript';
@Injectable({
  providedIn: 'root',
})
export class OnePassService {
  private loginUser = 'LoginUser';
  private getOnePassDataByUserId = 'GetOnePassDataByUserId';
  private deletePassword = 'DeletePassword';
  private deleteServer = 'DeleteServer';
  private deleteCreditCard = 'DeleteCreditCard';
  private deleteWifiPassword = 'DeleteWifiPassword';
  private addOrUpdatePassword = 'AddOrUpdatePassword';
  private addOrUpdateServer = 'AddOrUpdateServer';
  private addOrUpdateWifiPassword = 'AddOrUpdateWifiPassword';
  private addOrUpdateCreditCard = 'AddOrUpdateCreditCard';
  private updateDesktopDeviceInfo = 'UpdateDesktopDeviceInfo';
  private updatePhoneDeviceInfo = 'UpdatePhoneDeviceInfo';
  private sendCode = 'SendCode';
  private updateBrowserToken = 'UpdateBrowserToken';
  private register = 'Register';
  private token = 'token';
  constructor(private http: HttpClient) {}
  LoginUser(model: ApiRequestModel, deviceName: string, type: number): Observable<SessionResult> {
    const requestedUrl =
      Constants.apiUrl +
      Constants.eluviumApiController +
      this.loginUser +
      '/' +
      model.mail +
      '/' +
      model.password +
      '/' +
      model.deviceId +
      '/' +
      deviceName +
      '/' +
      type;
    const reqHeader = new HttpHeaders({
      Authorization: 'Bearer ' + model.token,
      'Content-Type': 'application/json'
    });
    const result = this.http.get<SessionResult>(requestedUrl, { headers: reqHeader });
    return result;
  }
  GetOnePassDataByUserId(model: ApiRequestModel): Observable<OnePassDataResult> {
    const requestedUrl =
      Constants.apiUrl +
      Constants.eluviumOnePassApiController +
      this.getOnePassDataByUserId +
      '/' +
      model.mail +
      '/' +
      model.password +
      '/' +
      model.deviceId;
    const reqHeader = new HttpHeaders({
      Authorization: 'Bearer ' + model.token,
      'Content-Type': 'application/json'
    });
    const result = this.http.get<OnePassDataResult>(requestedUrl, { headers: reqHeader });
    return result;
  }

  DeletePassword(model: ApiRequestModel, id: number): Observable<boolean> {
    const requestedUrl =
      Constants.apiUrl +
      Constants.eluviumOnePassApiController +
      this.deletePassword +
      '/' +
      model.mail +
      '/' +
      model.password +
      '/' +
      model.deviceId;
    const reqHeader = new HttpHeaders({
      Authorization: 'Bearer ' + model.token,
      'Content-Type': 'application/json'
    });
    const result = this.http.post<boolean>(requestedUrl, id , { headers: reqHeader });
    return result;
  }

  DeleteServer(model: ApiRequestModel, id: number): Observable<boolean> {
    const requestedUrl =
      Constants.apiUrl +
      Constants.eluviumOnePassApiController +
      this.deleteServer +
      '/' +
      model.mail +
      '/' +
      model.password +
      '/' +
      model.deviceId;
    const reqHeader = new HttpHeaders({
      Authorization: 'Bearer ' + model.token,
      'Content-Type': 'application/json'
    });
    const result = this.http.post<boolean>(requestedUrl, id, { headers: reqHeader });
    return result;
  }

  DeleteCreditCard(model: ApiRequestModel, id: number): Observable<boolean> {
    const requestedUrl =
      Constants.apiUrl +
      Constants.eluviumOnePassApiController +
      this.deleteCreditCard +
      '/' +
      model.mail +
      '/' +
      model.password +
      '/' +
      model.deviceId;
    const reqHeader = new HttpHeaders({
      Authorization: 'Bearer ' + model.token,
      'Content-Type': 'application/json'
    });
    const result = this.http.post<boolean>(requestedUrl, id, { headers: reqHeader });
    return result;
  }

  DeleteWifiPassword(model: ApiRequestModel, id: number): Observable<boolean> {
    const requestedUrl =
      Constants.apiUrl +
      Constants.eluviumOnePassApiController +
      this.deleteWifiPassword +
      '/' +
      model.mail +
      '/' +
      model.password +
      '/' +
       model.deviceId;
    const reqHeader = new HttpHeaders({
      Authorization: 'Bearer ' + model.token,
      'Content-Type': 'application/json'
    });
    const result = this.http.post<boolean>(requestedUrl, id, { headers: reqHeader });
    return result;
  }

  AddOrUpdatePassword(model: ApiRequestModel, password: Password): Observable<boolean> {
    const requestedUrl =
      Constants.apiUrl +
      Constants.eluviumOnePassApiController +
      this.addOrUpdatePassword +
      '/' +
      model.mail +
      '/' +
      model.password +
      '/' +
      model.deviceId;
    const reqHeader = new HttpHeaders({
      Authorization: 'Bearer ' + model.token,
      'Content-Type': 'application/json'
    });
    const result = this.http.post<boolean>(requestedUrl, password, { headers: reqHeader });
    return result;
  }

  AddOrUpdateServer(model: ApiRequestModel, server: Server): Observable<boolean> {
    const requestedUrl =
      Constants.apiUrl +
      Constants.eluviumOnePassApiController +
      this.addOrUpdateServer +
      '/' +
      model.mail +
      '/' +
      model.password +
      '/' +
      model.deviceId;
    const reqHeader = new HttpHeaders({
      Authorization: 'Bearer ' + model.token,
      'Content-Type': 'application/json'
    });
    const result = this.http.post<boolean>(requestedUrl, server, { headers: reqHeader });
    return result;
  }

  AddOrUpdateWifiPassword(model: ApiRequestModel, wifiPassword: WifiPassword): Observable<boolean> {
    const requestedUrl =
      Constants.apiUrl +
      Constants.eluviumOnePassApiController +
      this.addOrUpdateWifiPassword +
      '/' +
      model.mail +
      '/' +
      model.password +
      '/' +
      model.deviceId;
    const reqHeader = new HttpHeaders({
      Authorization: 'Bearer ' + model.token,
      'Content-Type': 'application/json'
    });
    const result = this.http.post<boolean>(requestedUrl, wifiPassword , { headers: reqHeader });
    return result;
  }

  AddOrUpdateCreditCard(model: ApiRequestModel, creditCard: CreditCard): Observable<boolean> {
    const requestedUrl =
      Constants.apiUrl +
      Constants.eluviumOnePassApiController +
      this.addOrUpdateCreditCard +
      '/' +
      model.mail +
      '/' +
      model.password +
      '/' +
      model.deviceId;
    const reqHeader = new HttpHeaders({
      Authorization: 'Bearer ' + model.token,
      'Content-Type': 'application/json'
    });
    const result = this.http.post<boolean>(requestedUrl, creditCard, { headers: reqHeader });
    return result;
  }
  GetToken(model: ApiRequestModel): Observable<string> {
    const requestedUrl =
      Constants.apiUrl +
      Constants.eluviumTokenController +
      this.token +
      '/' +
      model.mail +
      '/' +
      model.password;
    const result = this.http.post(requestedUrl, null, {responseType: 'text'});
    return result;
  }

  LogoutPhoneDevice(model: ApiRequestModel): Observable<boolean> {
    const requestedUrl =
      Constants.apiUrl +
      Constants.eluviumApiController +
      this.updatePhoneDeviceInfo +
      '/' +
      model.deviceId +
      '/' +
      model.mail +
      '/' +
      model.password;
    const reqHeader = new HttpHeaders({
      Authorization: 'Bearer ' + model.token,
      'Content-Type': 'application/json'
    });
    const result = this.http.post<boolean>(requestedUrl, model, { headers: reqHeader });
    return result;
  }

  LogoutDesktopDevice(model: ApiRequestModel): Observable<boolean> {
    const requestedUrl =
      Constants.apiUrl +
      Constants.eluviumApiController +
      this.updateDesktopDeviceInfo +
      '/' +
      model.deviceId +
      '/' +
      model.mail +
      '/' +
      model.password;
    const reqHeader = new HttpHeaders({
      Authorization: 'Bearer ' + model.token,
      'Content-Type': 'application/json'
    });
    const result = this.http.post<boolean>(requestedUrl, model, { headers: reqHeader });
    return result;
  }
  SendCode(model: ApiRequestModel, guid: Guid, language: string): Observable<boolean> {
    const requestedUrl =
      Constants.apiUrl +
      Constants.eluviumApiController +
      this.sendCode +
      '/' +
      guid +
      '/' +
      language +
      '/' +
      model.mail +
      '/'
      + model.password;
    const reqHeader = new HttpHeaders({
      Authorization: 'Bearer ' + model.token,
      'Content-Type': 'application/json'
    });
    const result = this.http.post<boolean>(requestedUrl, model, { headers: reqHeader });
    return result;
  }

  UpdateBrowserToken(model: ApiRequestModel, guid: Guid, code: number): Observable<boolean> {
    const requestedUrl =
      Constants.apiUrl +
      Constants.eluviumApiController +
      this.updateBrowserToken +
      '/' +
      model.deviceId +
      '/' +
      model.mail +
      '/' +
      model.password +
      '/' +
      code +
      '/' +
      guid;
    const reqHeader = new HttpHeaders({
      Authorization: 'Bearer ' + model.token,
      'Content-Type': 'application/json'
    });
    const result = this.http.post<boolean>(requestedUrl, model, { headers: reqHeader });
    return result;
  }

  Register(model: ApiUser): Observable<RegisterEnum> {
    const requestedUrl =
      Constants.apiUrl +
      Constants.eluviumApiController +
      this.register;
      const result = this.http.post<RegisterEnum>(requestedUrl, model);
      return result;
  }
}
