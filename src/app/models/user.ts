import { Style } from './style';
import { Role } from './role';
import { Photo } from './photo';

export interface User {
  id: number;
  name: string;
  description?: string;
  email: string;
  location?: string;
  birthday?: Date;
  password: string;
  genre?: 'male' | 'female' | 'others';
  roles: Role[];
  images?: Photo[];
  styles?: Style[];
}

export interface UserLogged {
  roles?: number[];
  isManager?: boolean;
  isLogged?: boolean;
  isAdmin?: boolean;
  isTeacher?: boolean;
}

export interface UserOutput {
  id: number;
  name: string;
  description?: string;
  email: string;
  location?: string;
  birthday?: Date;
  password: string;
  genre?: 'male' | 'female' | 'others';
  roles: Role[];
  images?: Blob | string;
  styles?: Style[];
}
