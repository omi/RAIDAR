import { Component, OnInit } from "@angular/core";
import { SocialUser } from "angularx-social-login";
import { LoginService } from "../../services/login.service";
import { faHome } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  user: SocialUser;
  loggedIn: boolean;
  faHome = faHome;

  constructor(private loginService: LoginService) {}

  ngOnInit(): void {
    this.loginService.login();

    // Listen for changes to the user's login status in the LoginService
    this.loginService.getSocialUser().subscribe((value) => {
      this.user = value;
    });
    this.loginService.getLoggedIn().subscribe((value) => {
      this.loggedIn = value;
    });
  }

  signInWithGoogle(): void {
    this.loginService.signInWithGoogle();
  }

  signOut(): void {
    this.loginService.logout();
    window.open('http://www.raidar.org');
  }
}
