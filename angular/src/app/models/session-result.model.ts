import { DevicesResult } from './device-list.model'

export class SessionResult {
  registerDate: Date
  productId: number
  expirationDate: string
  loginState: number
  twoStepAuth: boolean
  nameSurname: string
  deviceList: DevicesResult
}
