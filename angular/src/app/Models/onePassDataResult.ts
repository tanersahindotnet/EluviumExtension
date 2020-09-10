import { Password } from '../Models/password';
import { Server } from '../Models/server';
import { WifiPassword } from '../Models/wifiPassword';
import { CreditCard } from '../Models/creditCard';
export class OnePassDataResult {
passwordData: Password[];
serverData: Server[];
wifiPassword: WifiPassword[];
creditCardData: CreditCard[];
}
