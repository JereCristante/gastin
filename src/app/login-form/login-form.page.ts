import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.page.html',
  styleUrls: ['./login-form.page.scss'],
})
export class LoginFormPage implements OnInit {

  constructor() { }
  email: string = "";
  password: string = "";
  ngOnInit() {
  }

}
