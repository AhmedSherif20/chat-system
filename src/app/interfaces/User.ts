export interface User {
  id: string;
  email: string;
  role: string;
  token: string;
  validTO: string | Date;
}
