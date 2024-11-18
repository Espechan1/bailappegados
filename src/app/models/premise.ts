import { Photo } from './photo';

export interface Premise {
  id?: number;
  name: string;
  email: string;
  address: string;
  schedule: Schedule | null;
  phone_number: string;
  web: string | null;
  person_contact: string | null;
  location?: Gps;
  images?: Photo[];
  // created_at: Date;
  // updated_at?: Date; hacer el hidden en el back
}

export interface Schedule {
  Monday: string | null;
  Tuesday: string | null;
  Wednesday: string | null;
  Thursday: string | null;
  Friday: string | null;
  Saturday: string | null;
  Sunday: string | null;
}

export interface Gps {
  lat: number;
  lng: number;
}
