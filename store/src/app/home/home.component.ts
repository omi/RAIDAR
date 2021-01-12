import { Component, OnInit } from "@angular/core";
import { AuthService } from "angularx-social-login";

import { RegisterService } from "../services/register.service";
import { LoginService } from "../services/login.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  loggedIn: boolean;
  firstLogin: boolean;
  hasStripe: boolean;
  hasAgreedTOS: boolean;

  constructor(private loginService: LoginService) {}

  ngOnInit() {
    // Listen for changes to the user's login status in the LoginService
    this.loginService.getFirstLogin().subscribe((value) => {
      this.firstLogin = value;
    });
    this.loginService.getLoggedIn().subscribe((value) => {
      this.loggedIn = value;
    });
    this.loginService.getHasAgreedTOS().subscribe((value) => {
      this.hasAgreedTOS = value;
    });
  }
}
