/*
* Interfaz User: similar a JwtPayload 
* excluye el password
*/
interface User {
  id: string;
  fullName: string;
  email: string;
  isActive: boolean;
  roles: string[];
}

/*
* Response al hacer registro / login
*/
export interface AuthResponse {
  user: User;
  token: string;
}