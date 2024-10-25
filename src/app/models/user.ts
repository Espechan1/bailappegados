export interface User {
  id: number,
  name: string,
  description?: string,
  email: string,
  location?: string,
  birthday?: Date,
  password: string,
  genre: "male" | "female" | "others",
  role_id: number,
  image_custom?: string,
}

export interface UserLogged{
  isManager?: boolean;
  isLogged?: boolean; //raso
  isAdmin?: boolean;
}
