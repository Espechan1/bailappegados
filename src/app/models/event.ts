import {Image} from './image';

export interface Event {
  id: number
  name: string
  opening?: Date
  expiration?: Date
  dance_instructors: string
  dj: string
  price?: number
  premise_id: number
  style_id: number
  images: Image[]
} // Seguramente poniendo que es un objeto no será suficiente. Mirar apuntes TS: formatDate

