import { Photo } from './photo';

export interface Event {
  id?: number;
  name: string;
  opening?: Date;
  expiration?: Date;
  dance_instructors: string;
  dj: string;
  capacity?: number;
  price?: number;
  premise_id: number;
  style_id: number;
  images?: Photo[];
}

export interface EventOutput {
  id?: number;
  name: string;
  opening?: Date;
  expiration?: Date;
  dance_instructors: string;
  dj: string;
  capacity?: number;
  price?: number;
  premise_id: number;
  style_id: number;
  images?: Blob | string;
}
