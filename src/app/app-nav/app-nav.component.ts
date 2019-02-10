import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './app-nav.component.html',
  styleUrls: ['./app-nav.component.css']
})
export class AppNavComponent implements OnInit {
  loggedIn = false;

  ngOnInit() {
    if (localStorage.getItem('token')) {
      this.loggedIn = true;
    }
  }

  logout() {
    localStorage.clear();
    window.location.reload();
  }
}
