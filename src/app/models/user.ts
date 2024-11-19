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
  styles?: Style[]; //Array de ids de estilos. Cada obj tiene su id y el nombre.
}

export interface UserLogged {
  isManager?: boolean;
  isLogged?: boolean; //raso
  isAdmin?: boolean;
  isTeacher?: boolean;
}
/* El tipo UserLogged se utiliza para representar el estado de autenticación del usuario en la aplicación. Contiene
propiedades booleanas que indican si el usuario es un administrador, un gestor o simplemente está logueado.
 */
