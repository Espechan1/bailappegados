import { Photo } from './photo';

export interface Classroom {
  id?: number;
  name: string;
  phone_number: string;
  opening?: Date;
  expiration?: Date;
  price?: number;
  premise_id: number;
  style_id: number;
  teacher_id: number;
  images?: Photo[];
}
