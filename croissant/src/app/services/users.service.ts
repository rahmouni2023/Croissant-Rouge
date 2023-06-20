import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Subject } from "rxjs";
import{AuthData}from "c:/Users/ACHREF/Desktop/Backend/models/user"
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private userRole: string;
  private authStatusListener = new Subject<boolean>();
  public err = new BehaviorSubject<any>(null);
usersURL: string = "http://localhost:3000/users";


  constructor(private httpClient : HttpClient, private router: Router) { 
    var currentUser = localStorage.getItem("userId");
    if (currentUser === null) {
      this.isAuthenticated = false;
    } else {
      this.isAuthenticated = true;
    }
  
  }

signup(obj:any){

  return this.httpClient.post<{ message: string }>(
    this.usersURL+"/signup",
  obj);
}

getToken() {
  return this.token;
}
getIsAuth() {
  return this.isAuthenticated;
}
getUserId() {
  return this.userId;
}
getAuthStatusListener() {
  return this.authStatusListener.asObservable();
}

signIn(email: string, passWord: string) {
  const authData: AuthData = { email: email, passWord: passWord };
  this.httpClient
    .post<{
      token: string;
      expiresIn: number;
      userId: string;
      userRole: string;
    }>(`${this.usersURL}/login`, authData)
    .subscribe(
      (response) => {
        this.err.next(null);
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.userRole = response.userRole
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(
            now.getTime() + expiresInDuration * 1000
          );
          this.saveAuthData(token, expirationDate, this.userId);
          if (response.userRole === "admin") {
            this.router.navigate(["Admin"]);
            console.log('weeeeeeey el user role worked');
            
          } else {
            this.router.navigate(["/"]);
          }
        }
      },
      (err) => {
        this.err.next(err);
      }
    );
}
logout() {
  this.token = null;
  this.isAuthenticated = false;
  this.authStatusListener.next(false);
  clearTimeout(this.tokenTimer);
  this.clearAuthData();
  this.router.navigate(["Login"]);
}

autoAuthUser() {
  const authInformation = this.getAuthData();
  if (!authInformation) {
    return;
  }
  const now = new Date();
  const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
  if (expiresIn > 0) {
    this.token = authInformation.token;
    this.isAuthenticated = true;
    this.userId = authInformation.userId;
    this.userRole = authInformation.userRole;
    this.setAuthTimer(expiresIn / 1000);
    this.authStatusListener.next(true);
  }
}
private getAuthData() {
  const token = localStorage.getItem("token");
  const expirationDate = localStorage.getItem("expiration");
  const userId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("userRole")
  if (!token || !expirationDate) {
    return;
  }
  return {
    token: token,
    expirationDate: new Date(expirationDate),
    userId: userId,
    userRole: userRole
  };
}

private setAuthTimer(duration: number) {
  this.tokenTimer = setTimeout(() => {
    this.logout();
  }, duration * 1000);
}
private saveAuthData(token: string, expirationDate: Date, userId: string) {
  localStorage.setItem("token", token);
  localStorage.setItem("expiration", expirationDate.toISOString());
  localStorage.setItem("userId", userId);
  localStorage.setItem("userRole", this.userRole)
}

private clearAuthData() {
  localStorage.removeItem("token");
  localStorage.removeItem("expiration");
  localStorage.removeItem("userId");
  localStorage.removeItem("userRole")
}




}
