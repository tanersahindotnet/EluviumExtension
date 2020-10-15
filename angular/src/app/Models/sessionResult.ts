import { DevicesResult } from './deviceList';

export class SessionResult {
  registerDate: Date;
  productId: number;
  expirationDate: string;
  loginState: number;
  twoStepAuth: boolean;
  nameSurname: string;
  deviceList: DevicesResult;
}
