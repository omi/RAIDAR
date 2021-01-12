import { Component, OnInit } from "@angular/core";
import { SocialUser } from "angularx-social-login";
import { LoginService } from "../../services/login.service";
import { faHome, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import {
  MatDialog,
  MatDialogRef,
  MatDialogConfig,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { CartComponent } from "../cart/cart.component";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  user: SocialUser;
  loggedIn: boolean;
  faHome = faHome;
  faCart = faShoppingCart;

  constructor(private loginService: LoginService, public cartDialog: MatDialog) {}

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
  }

  showCart(): void {
    const cartDialogConfig = new MatDialogConfig();
    cartDialogConfig.closeOnNavigation = true;
    cartDialogConfig.disableClose = false;
    cartDialogConfig.autoFocus = true;
    cartDialogConfig.width = "680px";
    cartDialogConfig.data = {
    };
    this.cartDialog.open(CartComponent, cartDialogConfig);
  }
}
