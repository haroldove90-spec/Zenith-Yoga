
export enum Role {
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT',
}

export enum ClassStatus {
  UPCOMING = 'UPCOMING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl: string;
  membership: 'active' | 'inactive';
}

export interface Teacher {
    id: string;
    name: string;
    bio: string;
    avatarUrl: string;
}

export interface YogaClass {
  id: string;
  name: string;
  description: string;
  teacherId: string;
  startTime: Date;
  duration: number; // in minutes
  capacity: number;
  attendees: string[]; // array of user IDs
  waitlist: string[]; // array of user IDs
  status: ClassStatus;
  price: number;
}

export interface Booking {
  id:string;
  classId: string;
  userId: string;
  bookingTime: Date;
  status: 'confirmed' | 'waitlisted' | 'cancelled';
}

export interface OnDemandVideo {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    duration: number; // in minutes
    teacherId: string;
    youtubeId: string;
}

export interface Promotion {
    id: string;
    title: string;
    description: string;
    code: string;
    discount: number; // percentage
}

export interface FinancialRecord {
    id: string;
    date: Date;
    type: 'income' | 'expense';
    description: string;
    amount: number;
}

export interface ChatMessage {
    id: string;
    senderId: string;
    receiverId: string;
    text: string;
    timestamp: Date;
    read: boolean;
}
