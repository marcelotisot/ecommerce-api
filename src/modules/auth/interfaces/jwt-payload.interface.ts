/*
* Payload con los datos que se van a firmar
*/
export interface JwtPayload {
  id: string;
  fullName: string;
  email: string;
  isActive: boolean;
  roles: string[];
}