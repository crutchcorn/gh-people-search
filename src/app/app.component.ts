import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  allowed = false;
  accessToken = '';

  ngOnInit() {
    if (localStorage.getItem('token')) {
      this.allowed = true;
    }
  }

  saveToken() {
    localStorage.setItem('token', this.accessToken);
    window.location.reload();
  }
}
