import { Component, OnInit } from "@angular/core";
import { LoginService } from "../../services/login.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  img;
  isBerkleeUser;
  imgLookup = {
    "true": "../assets/Berklee-Logo.png",
    "false": "../assets/lesley-logo.png",
    "null": "../assets/raidar-logo.jpg"
  };

  constructor(private loginService: LoginService) {
    this.loginService.getIsBerkleeUser().subscribe((value) => {
      this.isBerkleeUser = value;
      this.img = this.imgLookup[value];
    });
  }

  ngOnInit() {}
}
