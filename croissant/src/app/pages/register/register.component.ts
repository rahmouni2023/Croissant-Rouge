import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  signupForm : FormGroup;
path:string;
test:boolean=false;

  constructor(private formBuilder: FormBuilder,
    private usersService :UsersService, private router:Router) { }

  ngOnInit() {
this.path=this.router.url;
    this.signupForm = this.formBuilder.group({
      firstName: ["",[Validators.required, Validators.minLength(2)]],
      lastName: ["", [Validators.required, Validators.minLength(2)]],
      email: ["",[Validators.email, Validators.required]],
      passWord: ["",[
        Validators.minLength(5),
        Validators.maxLength(16),
        Validators.required,
      ]],
      ConfirmPassWord: [""],
      
    
    });
  }


  signup(){

    if (this.path == "/register-donneur") {
      this.signupForm.value.role = "donneur";
    }else {(this.path == "/register-membre") 
      this.signupForm.value.role = "membre";
    } if (this.path == "/register-admin") {
      this.signupForm.value.role = "admin";
      
    }
      

console.log(this.signupForm.value);

this.usersService.signup(this.signupForm.value).subscribe((data)=>{

  console.log("here data Signup",data.message);

  if (data.message == "User already exists") {
        
    this.test = true;
  } else {
    this.router.navigate(["login"]);

  }




  
})

  }

}


