import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  login:any={};
  loginForm:FormGroup;
  
  
  constructor(private usersService:UsersService, private router:Router, private formBuilder:FormBuilder) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: [''],
      passWord: ['']
      })

  }
  validateLogin() {
    this.usersService.signIn(this.login.email, this.login.passWord);
    
    }

}
