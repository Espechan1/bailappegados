export interface User {
  id: number,
  name: string,
  description: string,
  email: string,
  location: string,
  birthday: Date,
  password: string,
  genre: "male" | "female" | "others",
}
