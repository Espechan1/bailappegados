export interface Premise {
  id: number;
  name: string;
  email: string;
  address: string;
  schedule?: Schedule;
  phone_number: string;
  web?: string;
  person_contact?: string;
  created_at: Date;
  updated_at?: Date;
}

interface Schedule {
  Monday?: string;
  Tuesday?: string;
  Wednesday?: string;
  Thursday?: string;
  Friday?: string;
  Saturday?: string;
  Sunday?: string;
}
