import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { MatDialog } from '@angular/material/dialog'
import { AccountPromptDialogComponent } from '../../dialog/account-prompt-dialog/account-prompt-dialog.component'
import { OnePassService } from '../../services/onepass.service'
import { StringEncryptionService } from '../../services/string-encryption.service'
import { ApiRequestModel } from '../../models/api-request.model'
import { MatSnackBar } from '@angular/material/snack-bar'
import { TranslateService } from '@ngx-translate/core'
import { DevicesResult } from '../../models/device-list.model'
import { CsvData } from 'src/app/models/chrome-csv-model'
import { Password } from 'src/app/models/password.model'
import { OnePassEncryptionService } from 'src/app/services/onepass-encryption.service'
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {
  items
  devices: DevicesResult[] = JSON.parse(localStorage.getItem('devices'))
  mail = localStorage.getItem('mail')
  productId = localStorage.getItem('productId')
  registerDate = new Date(localStorage.getItem('registerDate')).toDateString()
  fullName = localStorage.getItem('fullName')
  deviceId = localStorage.getItem('deviceId')
  onlineDevice: DevicesResult = this.devices.filter(p=>p.deviceId === this.deviceId)[0]
  constructor (
    private route: Router,
    private dialog: MatDialog,
    private onePassService: OnePassService,
    private stringEncryptionService: StringEncryptionService,
    private onePassEncryptionService: OnePassEncryptionService,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {
    this.checkSession()
  }
  lock () {
    localStorage.removeItem('password')
    this.route.navigate(['login'])
  }
  logout () {
    localStorage.clear()
    this.route.navigate(['firstLogin'])
  }
  manageMyAccount () {
    window.open('http://eluvium.info/', '_blank')
  }
  disconnectDevice (deviceId) {
    const dialogRef = this.dialog.open(AccountPromptDialogComponent)
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let success, fail, disconnect, wrongInfo
        this.translate.get('Common.WrongInfo').subscribe(p => (wrongInfo = p))
        this.translate.get('Common.Success').subscribe(p => (success = p))
        this.translate.get('Common.Fail').subscribe(p => (fail = p))
        this.translate
          .get('Account.Disconnected')
          .subscribe(p => (disconnect = p))
        const accountPasswordHashed = localStorage.getItem(
          'accountPasswordHashed'
        )
        const mail = localStorage.getItem('mail')
        const token = localStorage.getItem('token')
        const hashedPassword = this.stringEncryptionService.encryptSha(result)
        if (accountPasswordHashed === hashedPassword) {
          const request = new ApiRequestModel()
          request.mail = mail
          request.password = result
          request.token = token
          request.deviceId = deviceId
          this.onePassService.DeleteDevice(request).subscribe(p => {
            if (p) {
              this.devices = this.devices.filter(x => x.deviceId !== deviceId)
              localStorage.setItem('devices', JSON.stringify(this.devices))
              this.snackBar.open(disconnect, success, {
                duration: 2000
              })
            } else {
              this.snackBar.open(wrongInfo, fail, {
                duration: 2000
              })
            }
          })
        } else {
          this.snackBar.open(wrongInfo, fail, {
            duration: 2000
          })
        }
      }
    })
  }

  onFileSelected(event: any, type: string) {
    const file: File = event.target.files[0];
    if (file && file.type === 'text/csv') {
      const reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        const csv: string = reader.result as string;
        let csvList: CsvData[]  = [] 
        
        if(type == "other")
        csvList = this.parseCsvData(csv);

        else
        csvList = this.parseCsvDataForFirefox(csv);

        const dialogRef = this.dialog.open(AccountPromptDialogComponent)
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            let success, fail, disconnect, wrongInfo
            this.translate.get('Common.WrongInfo').subscribe(p => (wrongInfo = p))
            this.translate.get('Common.Success').subscribe(p => (success = p))
            this.translate.get('Common.Fail').subscribe(p => (fail = p))
            this.translate
              .get('Account.Disconnected')
              .subscribe(p => (disconnect = p))
            const accountPasswordHashed = localStorage.getItem(
              'accountPasswordHashed'
            )
            const hashedPassword = this.stringEncryptionService.encryptSha(result)
            if (accountPasswordHashed === hashedPassword) {
              let passwordList: Password[] = [];
              for (let index = 0; index < csvList.length; index++) {
                let password = new Password();
                password.userName =  csvList[index].username;
                password.url =  csvList[index].url;
                password.sitePassword =  csvList[index].password;
                password.notes = csvList[index].note;
                password.title = csvList[index].name;
                password.id = 0 //New Record
                const encryptedPassword = this.onePassEncryptionService.encryptPassword(password, result)
                passwordList.push(encryptedPassword);
              }

              const token = localStorage.getItem('token')
              const mail = localStorage.getItem('mail')
              const deviceId = localStorage.getItem('deviceId')
              const accountPasswordHashed = localStorage.getItem(
                'accountPasswordHashed'
              );

              const request = new ApiRequestModel()
              request.mail = mail
              request.password = accountPasswordHashed
              request.token = token
              request.deviceId = deviceId

              this.onePassService
              .AddPasswords(request, passwordList)
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
                    this.snackBar.open(added, success, {
                      duration: 2000
                    })  
                  } else {
                    this.snackBar.open(somethingWrong, fail, {
                      duration: 2000
                    })
                  }
              })
            
            } else {
              this.snackBar.open(wrongInfo, fail, {
                duration: 2000
              })
            }
          }
        })

      };
    } else {
      let fail = "";
      let wrongFile = "";
      this.translate.get('Common.Fail').subscribe(p => (fail = p))
      this.translate.get('Common.WrongFile').subscribe(p => (wrongFile = p))
      this.snackBar.open(wrongFile, fail, {
        duration: 2000
      })
    }
  }

  parseCsvDataForFirefox(csv: string): CsvData[] {
    const csvLines = csv.trim().split('\n');
    const headers = csvLines[0].split(',').map(header => header.replace(/"/g, '').trim());

    const csvList: CsvData[] = [];

    for (let i = 1; i < csvLines.length; i++) {
      const values = csvLines[i].split(',');

      if (values.length === headers.length) {
        const data: { [key: string]: string } = {};

        for (let j = 0; j < headers.length; j++) {
          const key = headers[j];
          const value = values[j].replace(/"/g, '').trim();
          data[key] = value;
        }

        const csvData = new CsvData();
        csvData.name= data['url'];
        csvData.note= "";
        csvData.password = data['password'];
        csvData.url = data['url'];
        csvData.username = data['username'];
        csvList.push(csvData);
      }
    }

    return csvList;
  }

  private parseCsvData(csv: string): CsvData[] {
    let csvList: CsvData[] = [];
    const lines: string[] = csv.split('\n');
    const headers: string[] = lines[0].split(',');
  
    for (let i = 1; i < lines.length; i++) {
      const values: string[] = lines[i].split(',');
  
      if (values.length === headers.length) {
        const csvData: CsvData = {
          name: values[0]?.trim() || '',
          url: values[1]?.trim() || '',
          username: values[2]?.trim() || '',
          password: values[3]?.trim() || '',
          note: values[4]?.trim() || ''
        };
        csvList.push(csvData);
      } 
    }
    return csvList;
  }

  private checkSession () {
    const password = localStorage.getItem('password')
    if (password === null) {
      this.route.navigate(['login'])
    }
  }
}
