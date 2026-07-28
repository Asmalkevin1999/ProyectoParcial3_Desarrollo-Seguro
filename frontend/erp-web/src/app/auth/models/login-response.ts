export interface Role {

  id: string;

  name: string;

  description: string;

}

export interface LoginResponse {

  message: string;

  tempToken: string;

  roles: Role[];

}