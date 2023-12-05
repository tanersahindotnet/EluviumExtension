import { Password } from './password.model'
import { Server } from './server.model'
import { WifiPassword } from './wifi-password.model'
import { CreditCard } from './credit-card.model'
export class OnePassDataResult {
  passwordData: Password[]
  serverData: Server[]
  wifiPassword: WifiPassword[]
  creditCardData: CreditCard[]
}
