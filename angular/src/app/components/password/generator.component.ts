import { Component } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.scss']
})
export class GeneratorComponent {
  protected _id: string
  inputLength = 12
  password = ''
  lowercase = true
  uppercase = true
  numbers = true
  symbols = true
  constructor (
    private snackBar: MatSnackBar,
    private route: Router,
    private translate: TranslateService
  ) {
    this.checkSession()
    this.generatePassword()
  }
  generatePassword () {
    const numberChars = '0123456789'
    const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lowerChars = 'abcdefghiklmnopqrstuvwxyz'
    const symbolChars = '!+%&/()=?_->£#$½{[]}|'
    const allChars: string = numberChars + upperChars + lowerChars + symbolChars
    let randPasswordArray = Array(this.inputLength)
    randPasswordArray.push(numberChars)
    randPasswordArray.push(upperChars)
    randPasswordArray.push(lowerChars)
    randPasswordArray.push(symbolChars)
    randPasswordArray = randPasswordArray.fill(allChars, 3)
    const result = this.shuffleArray(
      randPasswordArray.map(function (x) {
        return x[Math.floor(Math.random() * x.length)]
      })
    ).join('')
    this.password = result
  }
  copyText () {
    let success
    let textCopied
    this.translate.get('Common.Success').subscribe(p => (success = p))
    this.translate
      .get('Generator.PasswordCopied')
      .subscribe(p => (textCopied = p))
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', this.password)
      e.preventDefault()
      document.removeEventListener('copy', null)
    })
    document.execCommand('copy')
    this.snackBar.open(textCopied, success, {
      duration: 2000
    })
  }
  private shuffleArray (array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const temp = array[i]
      array[i] = array[j]
      array[j] = temp
    }
    return array
  }
  private checkSession () {
    const password = localStorage.getItem('password')
    if (password === null) {
      this.route.navigate(['login'])
    }
  }
}
