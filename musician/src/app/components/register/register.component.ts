import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";
import { User } from "../../user";
import { LoginService } from "../../services/login.service";
import { RegisterService } from "../../services/register.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {
  private user: SocialUser;
  private loggedIn: boolean;
  regData: FormGroup;
  userType: string;
  terms: any;
  agreedTOS: boolean;
  email: string;
  firstName: string;
  lastName: string;

  constructor(
    private authService: AuthService,
    private _formBuilder: FormBuilder,
    private loginService: LoginService,
    private registerService: RegisterService,
    private router: Router
  ) {}

  userTypes: string[] = ["Student", "Alumni"];

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = user != null;
    });
    this.regData = this._formBuilder.group({
      userType: ["", Validators.required],
    });
    this.loginService.getHasAgreedTOS().subscribe((value) => {
      this.agreedTOS = value;
    });
    this.loginService.getFirstName().subscribe((value) => {
      this.firstName = value;
    });
    this.loginService.getLastName().subscribe((value) => {
      this.lastName = value;
    });
    this.loginService.getEmail().subscribe((value) => {
      this.email = value;
    });

    this.loginService.login();
  }

  submitRegistration() {
    let formData = this.regData.value;
    this.userType = formData["userType"];
    this.registerService.register(
      this.email,
      this.firstName,
      this.lastName,
      this.userType,
      true
    );
  }
}
