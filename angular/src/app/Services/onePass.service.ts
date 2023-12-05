import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { RegisterEnum } from '../enums/register.enum'
import { ApiRequestModel } from '../models/api-request.model'
import { Injectable } from '@angular/core'
import { SessionResult } from '../models/session-result.model'
import { OnePassDataResult } from '../models/onepass-data.model'
import { CreditCard } from '../models/credit-card.model'
import { WifiPassword } from '../models/wifi-password.model'
import { Server } from '../models/server.model'
import { Password } from '../models/password.model'
import { ApiUser } from '../models/api-user.model'
import { Guid } from 'guid-typescript'
import { OnePassUrlEnum } from '../enums/one-pass-url.enum'
import { environment } from 'src/environments/environment'
@Injectable({
  providedIn: 'root'
})
export class OnePassService {
  constructor (private http: HttpClient) {}
  LoginUser (
    model: ApiRequestModel,
    deviceName: string,
    type: number
  ): Observable<SessionResult> {
    const requestedUrl =
      environment.apiUrl +
      environment.eluviumApiController +
      OnePassUrlEnum.loginUser +
      '/' +
      model.mail +
      '/' +
      model.password +
      '/' +
      model.deviceId +
      '/' +
      deviceName +
      '/' +
      type
    const reqHeader = new HttpHeaders({
      Authorization: 'Bearer ' + model.token,
      'Content-Type': 'application/json'
    })
    const result = this.http.get<SessionResult>(requestedUrl, {
      headers: reqHeader
    })
    return result
  }
  GetOnePassDataByUserId (
    model: ApiRequestModel
  ): Observable<OnePassDataResult> {
    const requestedUrl =
    environment.apiUrl +
    environment.eluviumOnePassApiController +
      OnePassUrlEnum.getOnePassDataByUserId +
      '/' +
      model.mail +
      '/' +
      model.password +
      '/' +
      model.deviceId
    const reqHeader = new HttpHeaders({
      Authorization: 'Bearer ' + model.token,
      'Content-Type': 'application/json'
    })
    const result = this.http.get<OnePassDataResult>(requestedUrl, {
      headers: reqHeader
    })
    return result
  }

  DeletePassword (model: ApiRequestModel, id: number): Observable<boolean> {
    const requestedUrl =
    environment.apiUrl +
    environment.eluviumOnePassApiController +
      OnePassUrlEnum.deletePassword +
      '/' +
      model.mail +
      '/' +
      model.password +
      '/' +
      model.deviceId
    const reqHeader = new HttpHeaders({
      Authorization: 'Bearer ' + model.token,
      'Content-Type': 'application/json'
    })
    const result = this.http.post<boolean>(requestedUrl, id, {
      headers: reqHeader
    })
    return result
  }

  DeleteServer (model: ApiRequestModel, id: number): Observable<boolean> {
    const requestedUrl =
    environment.apiUrl +
    environment.eluviumOnePassApiController +
      OnePassUrlEnum.deleteServer +
      '/' +
      model.mail +
      '/' +
      model.password +
      '/' +
      model.deviceId
    const reqHeader = new HttpHeaders({
      Authorization: 'Bearer ' + model.token,
      'Content-Type': 'application/json'
    })
    const result = this.http.post<boolean>(requestedUrl, id, {
      headers: reqHeader
    })
    return result
  }

  DeleteCreditCard (model: ApiRequestModel, id: number): Observable<boolean> {
    const requestedUrl =
    environment.apiUrl +
    environment.eluviumOnePassApiController +
      OnePassUrlEnum.deleteCreditCard +
      '/' +
      model.mail +
      '/' +
      model.password +
      '/' +
      model.deviceId
    const reqHeader = new HttpHeaders({
      Authorization: 'Bearer ' + model.token,
      'Content-Type': 'application/json'
    })
    const result = this.http.post<boolean>(requestedUrl, id, {
      headers: reqHeader
    })
    return result
  }

  DeleteWifiPassword (model: ApiRequestModel, id: number): Observable<boolean> {
    const requestedUrl =
    environment.apiUrl +
    environment.eluviumOnePassApiController +
      OnePassUrlEnum.deleteWifiPassword +
      '/' +
      model.mail +
      '/' +
      model.password +
      '/' +
      model.deviceId
    const reqHeader = new HttpHeaders({
      Authorization: 'Bearer ' + model.token,
      'Content-Type': 'application/json'
    })
    const result = this.http.post<boolean>(requestedUrl, id, {
      headers: reqHeader
    })
    return result
  }

  AddOrUpdatePassword (
    model: ApiRequestModel,
    password: Password
  ): Observable<boolean> {
    const requestedUrl =
    environment.apiUrl +
    environment.eluviumOnePassApiController +
      OnePassUrlEnum.addOrUpdatePassword +
      '/' +
      model.mail +
      '/' +
      model.password +
      '/' +
      model.deviceId
    const reqHeader = new HttpHeaders({
      Authorization: 'Bearer ' + model.token,
      'Content-Type': 'application/json'
    })
    const result = this.http.post<boolean>(requestedUrl, password, {
      headers: reqHeader
    })
    return result
  }

  AddPasswords (
    model: ApiRequestModel,
    password: Password[]
  ): Observable<boolean> {
    const requestedUrl =
    environment.apiUrl +
    environment.eluviumOnePassApiController +
      OnePassUrlEnum.addPasswords +
      '/' +
      model.mail +
      '/' +
      model.password +
      '/' +
      model.deviceId
    const reqHeader = new HttpHeaders({
      Authorization: 'Bearer ' + model.token,
      'Content-Type': 'application/json'
    })
    const result = this.http.post<boolean>(requestedUrl, password, {
      headers: reqHeader
    })
    return result
  }

  AddOrUpdateServer (
    model: ApiRequestModel,
    server: Server
  ): Observable<boolean> {
    const requestedUrl =
    environment.apiUrl +
    environment.eluviumOnePassApiController +
      OnePassUrlEnum.addOrUpdateServer +
      '/' +
      model.mail +
      '/' +
      model.password +
      '/' +
      model.deviceId
    const reqHeader = new HttpHeaders({
      Authorization: 'Bearer ' + model.token,
      'Content-Type': 'application/json'
    })
    const result = this.http.post<boolean>(requestedUrl, server, {
      headers: reqHeader
    })
    return result
  }

  AddOrUpdateWifiPassword (
    model: ApiRequestModel,
    wifiPassword: WifiPassword
  ): Observable<boolean> {
    const requestedUrl =
    environment.apiUrl +
    environment.eluviumOnePassApiController +
      OnePassUrlEnum.addOrUpdateWifiPassword +
      '/' +
      model.mail +
      '/' +
      model.password +
      '/' +
      model.deviceId
    const reqHeader = new HttpHeaders({
      Authorization: 'Bearer ' + model.token,
      'Content-Type': 'application/json'
    })
    const result = this.http.post<boolean>(requestedUrl, wifiPassword, {
      headers: reqHeader
    })
    return result
  }

  AddOrUpdateCreditCard (
    model: ApiRequestModel,
    creditCard: CreditCard
  ): Observable<boolean> {
    const requestedUrl =
    environment.apiUrl +
    environment.eluviumOnePassApiController +
      OnePassUrlEnum.addOrUpdateCreditCard +
      '/' +
      model.mail +
      '/' +
      model.password +
      '/' +
      model.deviceId
    const reqHeader = new HttpHeaders({
      Authorization: 'Bearer ' + model.token,
      'Content-Type': 'application/json'
    })
    const result = this.http.post<boolean>(requestedUrl, creditCard, {
      headers: reqHeader
    })
    return result
  }
  GetToken (model: ApiRequestModel): Observable<string> {
    const requestedUrl =
    environment.apiUrl +
    environment.eluviumTokenController +
      OnePassUrlEnum.token +
      '/' +
      model.mail +
      '/' +
      model.password
    const result = this.http.post(requestedUrl, null, { responseType: 'text' })
    return result
  }
  DeleteDevice (model: ApiRequestModel): Observable<boolean> {
    const requestedUrl =
    environment.apiUrl +
    environment.eluviumApiController +
      OnePassUrlEnum.deleteDevice +
      '/' +
      model.deviceId +
      '/' +
      model.mail +
      '/' +
      model.password
    const reqHeader = new HttpHeaders({
      Authorization: 'Bearer ' + model.token,
      'Content-Type': 'application/json'
    })
    const result = this.http.post<boolean>(requestedUrl, model, {
      headers: reqHeader
    })
    return result
  }
  SendCode (
    model: ApiRequestModel,
    guid: Guid,
    language: string
  ): Observable<boolean> {
    const requestedUrl =
    environment.apiUrl +
    environment.eluviumApiController +
      OnePassUrlEnum.sendCode +
      '/' +
      guid +
      '/' +
      language +
      '/' +
      model.mail +
      '/' +
      model.password
    const reqHeader = new HttpHeaders({
      Authorization: 'Bearer ' + model.token,
      'Content-Type': 'application/json'
    })
    const result = this.http.post<boolean>(requestedUrl, model, {
      headers: reqHeader
    })
    return result
  }

  Verify (
    model: ApiRequestModel,
    guid: Guid,
    code: number,
    deviceName: string,
    deviceType: number
  ): Observable<boolean> {
    const requestedUrl =
    environment.apiUrl +
    environment.eluviumApiController +
      OnePassUrlEnum.verify +
      '/' +
      model.deviceId +
      '/' +
      model.mail +
      '/' +
      model.password +
      '/' +
      code +
      '/' +
      guid +
      '/' +
      deviceName +
      '/' +
      deviceType
    const reqHeader = new HttpHeaders({
      Authorization: 'Bearer ' + model.token,
      'Content-Type': 'application/json'
    })
    const result = this.http.post<boolean>(requestedUrl, model, {
      headers: reqHeader
    })
    return result
  }

  Register (model: ApiUser): Observable<RegisterEnum> {
    const requestedUrl =
    environment.apiUrl + environment.eluviumApiController + OnePassUrlEnum.register
    const result = this.http.post<RegisterEnum>(requestedUrl, model)
    return result
  }
}
