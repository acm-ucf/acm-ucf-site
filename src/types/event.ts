export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  startsAt?: string;
  endsAt?: string;
  location?: string;
  image?: string;
  link?: string;
}

export interface CheckIn {
  firstName: string;
  lastName: string;
  email: string;
  eventId: string;
  graduationYear: string;
  studentId?: string;
  major?: string;
}
