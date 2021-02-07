import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges
} from '@angular/core'
import { Password } from '../../../models/password.model'
import { FormGroup, Validators, FormControl } from '@angular/forms'
import { OnePassService } from '../../../services/onepass.service'
import { ApiRequestModel } from '../../../models/api-request.model'
import { MatSnackBar } from '@angular/material/snack-bar'
import { OnePassEncryptionService } from '../../../services/onepass-encryption.service'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.component.html',
  styleUrls: ['./edit-password.component.scss']
})
export class EditPasswordComponent implements OnChanges {
  @Input() data: Password
  @Input() password: string
  @Output() stateEmitter: EventEmitter<boolean> = new EventEmitter()
  @Output() saveEmitter: EventEmitter<boolean> = new EventEmitter()
  form: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    url: new FormControl('', Validators.required),
    notes: new FormControl('')
  })
  constructor (
    private onePassService: OnePassService,
    private snackBar: MatSnackBar,
    private encryptionService: OnePassEncryptionService,
    private route: Router,
    private translate: TranslateService
  ) {
    this.checkSession()
  }
  returnResult () {
    this.stateEmitter.emit(true)
  }
  ngOnChanges () {
    if (this.data !== null) {
      this.form.controls['title'].setValue(this.data.title)
      this.form.controls['username'].setValue(this.data.userName)
      this.form.controls['password'].setValue(this.data.sitePassword)
      this.form.controls['url'].setValue(this.data.url)
      this.form.controls['notes'].setValue(this.data.notes)
    } else {
      this.clearFormControls()
      const url = localStorage.getItem('activeUrl')
      this.form.controls['url'].setValue(url)
    }
  }
  onSubmit () {
    if (this.form.valid) {
      let password = new Password()
      const token = localStorage.getItem('token')
      const mail = localStorage.getItem('mail')
      const deviceId = localStorage.getItem('deviceId')
      const accountPasswordHashed = localStorage.getItem(
        'accountPasswordHashed'
      )
      const request = new ApiRequestModel()
      request.mail = mail
      if (this.data !== null) {
        request.password = this.password
        password = this.data
      } else {
        request.password = accountPasswordHashed
        password.id = 0
      }
      request.token = token
      request.deviceId = deviceId
      password.title = this.form.controls['title'].value
      password.userName = this.form.controls['username'].value
      password.sitePassword = this.form.controls['password'].value
      password.url = this.form.controls['url'].value
      password.notes = this.form.controls['notes'].value
      const encryptedPassword = this.encryptionService.encryptPassword(
        password,
        this.password
      )

      this.onePassService
        .AddOrUpdatePassword(request, encryptedPassword)
        .subscribe(p => {
          let success, fail, added, updated, somethingWrong
          this.translate.get('Common.Fail').subscribe(p => (fail = p))
          this.translate.get('Common.Success').subscribe(p => (success = p))
          this.translate.get('Common.RecordAdded').subscribe(p => (added = p))
          this.translate
            .get('Common.RecordUpdated')
            .subscribe(p => (updated = p))
          this.translate
            .get('Common.SomethingWrong')
            .subscribe(p => (somethingWrong = p))

          if (p) {
            if (this.data === null) {
              this.snackBar.open(added, success, {
                duration: 2000
              })
              this.form.reset()
              this.saveEmitter.emit(true)
            } else {
              this.snackBar.open(updated, success, {
                duration: 2000
              })
              this.saveEmitter.emit(true)
            }
          } else {
            this.snackBar.open(somethingWrong, fail, {
              duration: 2000
            })
          }
        })
    }
  }
  copyText (data) {
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', data)
      e.preventDefault()
      document.removeEventListener('copy', null)
    })
    document.execCommand('copy')
    this.snackBar.open('Data Copied', 'Success', {
      duration: 2000
    })
  }
  private checkSession () {
    const password = localStorage.getItem('password')
    if (password === null) {
      this.route.navigate(['login'])
    }
  }
  private clearFormControls () {
    this.form.controls['title'].setValue('')
    this.form.controls['username'].setValue('')
    this.form.controls['password'].setValue('')
    this.form.controls['url'].setValue('')
    this.form.controls['notes'].setValue('')
  }
}
