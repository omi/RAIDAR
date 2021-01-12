export interface User {
  id: any;
  token: string;
  staff: boolean;
  student: boolean;
  alumni: boolean;
  registered: boolean;
  provider: string;
  email: string;
  name: string;
  photoUrl: string;
  firstName: string;
  lastName: string;
  authToken: string;
  idToken: string;
  authorizationCode: string;
}
