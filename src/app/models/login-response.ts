import {JwtPayload} from 'jwt-decode';

export interface LoginResponse {
  token: string
}
export interface LoginDecodeResponse {
  userId: number;
  roles: number[];
  exp?: number;
}
export interface TokenDecodeResponse extends JwtPayload{
  userId: number;
  roles: {id: number}[];
}
