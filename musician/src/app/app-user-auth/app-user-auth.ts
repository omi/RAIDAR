export class AppUserAuth {
  email: string = "";
  oAuthToken: string = "";
  loggedIn: boolean = false;
  userId: string = "";
  firstLogin: boolean;
  hasStripe: boolean = false;
  hasAgreedTOS: false;
}
