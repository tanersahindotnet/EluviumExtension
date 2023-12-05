import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-warning',
  templateUrl: './warning.component.html',
  styleUrls: ['./warning.component.scss']
})
export class WarningComponent implements OnInit {
  constructor () {
    localStorage.removeItem('warning')
  }

  ngOnInit (): void {}
  getJsonFromUrl () {
    const query = location.search.substr(1)
    const result = {}
    query.split('&').forEach(part => {
      const item = part.split('=')
      result[item[0]] = decodeURIComponent(item[1])
    })
    return result
  }

  btn_safety () {
    window.history.go(-2)
  }

  btn_continue () {
    window.history.go(-1)
    return false
  }
  redirect () {
    window.location.href = 'https://www.google.com/'
  }
}
