export class LoginResponse {
  first_time_login: boolean = true;
  has_stripe: boolean = false;
  tos_agreed: boolean = false;
  user_id: string = "";
}
