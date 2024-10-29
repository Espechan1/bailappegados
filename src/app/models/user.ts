import {Style} from './style';

export interface User {
  id: number,
  name: string,
  description?: string,
  email: string,
  location?: string,
  birthday?: Date,
  password: string,
  genre: "male" | "female" | "others",
  role_id: number, //?
  image_custom?: string,
  styles: Style[]; //Array de ids de estilos. Cada obj tiene su id y el nombre.
}

export interface UserLogged{
  isManager?: boolean;
  isLogged?: boolean; //raso
  isAdmin?: boolean;
}
