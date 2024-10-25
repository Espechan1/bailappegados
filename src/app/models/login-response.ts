import {JwtPayload} from 'jwt-decode';

export interface LoginResponse {
  token: string
}
export interface LoginDecodeResponse {
  user: number;
  roles: number[];
  exp?: number;
}
export interface TokenDecodeResponse extends JwtPayload{
  user: number;
  roles: {id: number}[];
}
