import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { of } from "rxjs";
import {
  AuthService,
  GoogleLoginProvider,
  SocialUser,
} from "angularx-social-login";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

import { environment } from '../../environments/environment';
import { AppUserAuth } from "../app-user-auth/app-user-auth";
import { AppUser } from "../app-user/app-user";
import { LoginService } from "../services/login.service";

@Injectable({
  providedIn: "root",
})
export class RegisterService {
  public loginObject: AppUserAuth = new AppUserAuth();
  public socialUser: SocialUser;
  isRegistered: boolean;
  private userRegisterEndpoint: string = environment.apiUrl + "/register";

  constructor(
    private loginService: LoginService,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  register(
    email: string,
    firstName: string,
    lastName: string,
    userType: string,
    agree: boolean
  ) {
    const params = {
      email: email,
      first_name: firstName,
      last_name: lastName,
      user_type: userType,
      tos: agree,
    };
    this.http.post(this.userRegisterEndpoint, params).subscribe((data) => {
      this.router.navigateByUrl("/education");
    });
  }
}
