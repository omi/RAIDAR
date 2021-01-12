import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import {
  AuthService,
  GoogleLoginProvider,
  SocialUser,
} from "angularx-social-login";
import { HttpClient } from "@angular/common/http";

import { environment } from '../../environments/environment';
import { AppUserAuth } from "../app-user-auth/app-user-auth";
import { AppUser } from "../app-user/app-user";
import { LoginResponse } from "../login-response/login-response";
import { User } from "../user";

@Injectable({
  providedIn: "root",
})
export class LoginService {
  private socialUser: BehaviorSubject<SocialUser>;
  private loggedIn: BehaviorSubject<boolean>;
  private firstLogin: BehaviorSubject<boolean>;
  private hasAgreedTOS: BehaviorSubject<boolean>;
  private userId: BehaviorSubject<string>;
  private firstName: BehaviorSubject<string>;
  private lastName: BehaviorSubject<string>;
  private email: BehaviorSubject<string>;
  private isBerkleeUser: BehaviorSubject<string>;
  private loginObject: AppUserAuth = new AppUserAuth();
  private loginResponse: LoginResponse = new LoginResponse();
  private appUser: AppUser = new AppUser();

  private loggedInWithGoogle: boolean;
  private berkleeRegEx: RegExp;
  private devRegEx: RegExp;
  private genericRegEx: RegExp;
  private userLoginEndpoint: string = environment.apiUrl + "/login";

  constructor(private authService: AuthService, private http: HttpClient) {
    this.berkleeRegEx = new RegExp("");
    this.devRegEx = new RegExp("");
    this.genericRegEx = new RegExp("");
    this.socialUser = new BehaviorSubject<SocialUser>(null);
    this.loggedIn = new BehaviorSubject<boolean>(false);
    this.userId = new BehaviorSubject<string>(null);
    this.firstLogin = new BehaviorSubject<boolean>(true);
    this.email = new BehaviorSubject<string>("");
    this.firstName = new BehaviorSubject<string>("");
    this.lastName = new BehaviorSubject<string>("");
    this.hasAgreedTOS = new BehaviorSubject<boolean>(false);
    this.isBerkleeUser = new BehaviorSubject<string>("null");
  }

  public getSocialUser(): Observable<SocialUser> {
    return this.socialUser.asObservable();
  }
  public setSocialUser(newValue): void {
    this.socialUser.next(newValue);
  }

  public getLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }
  public setLoggedIn(newValue): void {
    this.loggedIn.next(newValue);
  }

  public getFirstLogin(): Observable<boolean> {
    return this.firstLogin.asObservable();
  }
  public setFirstLogin(newValue): void {
    this.firstLogin.next(newValue);
  }

  public getUserId(): Observable<string> {
    return this.userId;
  }
  public setUserId(newValue): void {
    this.userId.next(newValue);
  }

  public getFirstName(): Observable<string> {
    return this.firstName.asObservable();
  }
  public setFirstName(newvalue): void {
    this.firstName.next(newvalue);
  }

  public getLastName(): Observable<string> {
    return this.lastName.asObservable();
  }
  public setLastName(newvalue): void {
    this.lastName.next(newvalue);
  }

  public getEmail(): Observable<string> {
    return this.email.asObservable();
  }
  public setEmail(newvalue): void {
    this.email.next(newvalue);
  }

  public getHasAgreedTOS(): Observable<boolean> {
    return this.hasAgreedTOS.asObservable();
  }
  public setHasAgreedTOS(newValue): void {
    this.hasAgreedTOS.next(newValue);
  }

  public getIsBerkleeUser(): Observable<string> {
    return this.isBerkleeUser.asObservable();
  }
  public setIsBerkleeUser(newValue): void {
    this.isBerkleeUser.next(newValue);
  }

  public signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  public login() {
    this.authService.authState.subscribe((user) => {
      // Check login status via Google
      let isDev;
      let isGeneric;
      let isBerklee = user ? this.berkleeRegEx.test(user.email) : false;
      if (isBerklee) {
        this.setIsBerkleeUser("true");
      } else {
        isDev = user ? this.devRegEx.test(user.email) : false;
        isGeneric = user ? this.genericRegEx.test(user.email) : false;
        if (isDev || isGeneric) {
          this.setIsBerkleeUser("null");
        }
      }
      this.loggedInWithGoogle = (isBerklee || isDev || isGeneric ) ? user != null : false;

      // Set login status for the Raidar app
      if (this.loggedInWithGoogle) {
        this.appUser.email = user.email;
        this.appUser.oAuthToken = user.authToken;

        const params = {
          email: user.email,
          first_name: user.firstName,
          last_name: user.lastName,
        };

        this.http.post(this.userLoginEndpoint, params).subscribe((data) => {
          Object.assign(this.loginResponse, data);
          this.appUser.userId = this.loginResponse.user_id;
          this.appUser.firstLogin = this.loginResponse.first_time_login;
          this.appUser.hasAgreedTOS = this.loginResponse.tos_agreed;
          this.appUser.loggedIn = !!this.loginResponse.user_id;

          this.setLoginData(user, this.appUser);
        });
      } else {
        this.resetLoginData();
      }
    });
  }

  public logout(): void {
    this.resetLoginData();
    this.setIsBerkleeUser("null");
  }

  private setLoginData(su: SocialUser, entity: AppUser) {
    this.resetLoginData();
    Object.assign(this.loginObject, entity);

    // At this time, components only need access to the following data
    this.setSocialUser(su);
    this.setLoggedIn(this.loginObject.loggedIn);
    this.setUserId(this.loginObject.userId);
    this.setFirstLogin(this.loginObject.firstLogin);
    this.setEmail(this.loginObject.email);
    this.setFirstName(su.firstName);
    this.setLastName(su.lastName);
    this.setHasAgreedTOS(this.loginObject.hasAgreedTOS);
  }

  private resetLoginData(): void {
    this.loginObject.email = "";
    this.loginObject.oAuthToken = "";
    this.loginObject.userId = "";
    this.loginObject.loggedIn = false;
    this.loggedInWithGoogle = false;

    this.setSocialUser(null);
    this.setLoggedIn(false);
    this.setFirstLogin(true);
    this.setUserId(null);
    this.setHasAgreedTOS(false);
  }
}
