
import { Role, User, YogaClass, ClassStatus, Booking, OnDemandVideo, Promotion, Teacher, FinancialRecord } from '../types';

export const mockUsers: User[] = [
  { id: 'user-admin-1', name: 'Alex Ray', email: 'alex@zenithyoga.com', role: Role.ADMIN, avatarUrl: 'https://picsum.photos/seed/alex/100/100', membership: 'active' },
  { id: 'user-client-1', name: 'Ben Carter', email: 'ben@example.com', role: Role.CLIENT, avatarUrl: 'https://picsum.photos/seed/ben/100/100', membership: 'active' },
  { id: 'user-client-2', name: 'Chloe Davis', email: 'chloe@example.com', role: Role.CLIENT, avatarUrl: 'https://picsum.photos/seed/chloe/100/100', membership: 'inactive' },
  { id: 'user-client-3', name: 'David Evans', email: 'david@example.com', role: Role.CLIENT, avatarUrl: 'https://picsum.photos/seed/david/100/100', membership: 'active' },
  { id: 'user-client-4', name: 'Eva Foster', email: 'eva@example.com', role: Role.CLIENT, avatarUrl: 'https://picsum.photos/seed/eva/100/100', membership: 'active' },
];

export const mockTeachers: Teacher[] = [
    { id: 'teacher-1', name: 'Serena Woods', bio: 'Specializes in Vinyasa Flow and mindful meditation, bringing a sense of calm and strength to every class.', avatarUrl: 'https://picsum.photos/seed/serena/100/100' },
    { id: 'teacher-2', name: 'Leo Chen', bio: 'An expert in Ashtanga and Power Yoga, Leo focuses on building core strength and discipline.', avatarUrl: 'https://picsum.photos/seed/leo/100/100' },
    { id: 'teacher-3', name: 'Maya Patel', bio: 'Maya guides students through restorative and Yin Yoga, promoting deep relaxation and flexibility.', avatarUrl: 'https://picsum.photos/seed/maya/100/100' }
];

const now = new Date();
const getFutureDate = (days: number, hour: number) => {
    const date = new Date(now);
    date.setDate(date.getDate() + days);
    date.setHours(hour, 0, 0, 0);
    return date;
}
const getPastDate = (days: number, hour: number) => {
    const date = new Date(now);
    date.setDate(date.getDate() - days);
    date.setHours(hour, 0, 0, 0);
    return date;
}

export const mockClasses: YogaClass[] = [
  { id: 'class-1', name: 'Sunrise Vinyasa Flow', description: 'Energize your morning with a dynamic flow to awaken the body and mind.', teacherId: 'teacher-1', startTime: getFutureDate(1, 7), duration: 60, capacity: 2, attendees: ['user-client-1'], waitlist: ['user-client-3'], status: ClassStatus.UPCOMING, price: 25 },
  { id: 'class-2', name: 'Evening Restorative Yoga', description: 'Unwind and release tension with gentle poses and deep stretches.', teacherId: 'teacher-3', startTime: getFutureDate(1, 19), duration: 75, capacity: 15, attendees: [], waitlist: [], status: ClassStatus.UPCOMING, price: 25 },
  { id: 'class-3', name: 'Power Ashtanga', description: 'A challenging and invigorating practice to build strength and endurance.', teacherId: 'teacher-2', startTime: getFutureDate(2, 18), duration: 90, capacity: 20, attendees: ['user-client-1', 'user-client-3'], waitlist: [], status: ClassStatus.UPCOMING, price: 30 },
  { id: 'class-4', name: 'Mindful Meditation', description: 'Cultivate inner peace and focus through guided meditation techniques.', teacherId: 'teacher-1', startTime: getFutureDate(3, 12), duration: 45, capacity: 25, attendees: [], waitlist: [], status: ClassStatus.UPCOMING, price: 15 },
  { id: 'class-5', name: 'Completed Hatha Yoga', description: 'A foundational class focusing on alignment and breath.', teacherId: 'teacher-3', startTime: getPastDate(2, 9), duration: 60, capacity: 15, attendees: ['user-client-1'], waitlist: [], status: ClassStatus.COMPLETED, price: 20 },
  { id: 'class-6', name: 'Cancelled Workshop', description: 'This workshop was cancelled due to unforeseen circumstances.', teacherId: 'teacher-2', startTime: getPastDate(5, 14), duration: 120, capacity: 10, attendees: [], waitlist: [], status: ClassStatus.CANCELLED, price: 50 },
];

export const mockBookings: Booking[] = [
  { id: 'booking-1', classId: 'class-1', userId: 'user-client-1', bookingTime: new Date(), status: 'confirmed' },
  { id: 'booking-2', classId: 'class-3', userId: 'user-client-1', bookingTime: new Date(), status: 'confirmed' },
  { id: 'booking-3', classId: 'class-5', userId: 'user-client-1', bookingTime: getPastDate(3, 10), status: 'confirmed' },
  { id: 'booking-4', classId: 'class-1', userId: 'user-client-3', bookingTime: new Date(), status: 'waitlisted' },
];

export const mockOnDemandVideos: OnDemandVideo[] = [
    { id: 'video-1', title: '15-Min Morning Stretch', description: 'A quick and effective routine to start your day.', thumbnailUrl: 'https://picsum.photos/seed/yoga1/400/225', duration: 15, teacherId: 'teacher-1' },
    { id: 'video-2', title: 'Core Power Flow', description: 'Strengthen your core with this challenging 30-minute flow.', thumbnailUrl: 'https://picsum.photos/seed/yoga2/400/225', duration: 30, teacherId: 'teacher-2' },
    { id: 'video-3', title: 'Bedtime Wind Down', description: 'Relax your body and mind for a restful night\'s sleep.', thumbnailUrl: 'https://picsum.photos/seed/yoga3/400/225', duration: 20, teacherId: 'teacher-3' },
    { id: 'video-4', title: 'Advanced Arm Balances', description: 'Learn the fundamentals of popular arm balances.', thumbnailUrl: 'https://picsum.photos/seed/yoga4/400/225', duration: 45, teacherId: 'teacher-2' }
];

export const mockPromotions: Promotion[] = [
    { id: 'promo-1', title: 'New Member Discount', description: 'Get 20% off your first month membership!', code: 'NEWZEN20', discount: 20 },
    { id: 'promo-2', title: 'Summer Special', description: 'Buy a 10-class pass and get 2 classes free.', code: 'SUMMERFUN', discount: 16.67 },
];

export const mockFinancialRecords: FinancialRecord[] = [
    { id: 'fin-1', date: getPastDate(1, 0), type: 'income', description: 'Class booking: Sunrise Vinyasa', amount: 25 },
    { id: 'fin-2', date: getPastDate(2, 0), type: 'income', description: 'Membership: Chloe Davis', amount: 150 },
    { id: 'fin-3', date: getPastDate(3, 0), type: 'expense', description: 'Yoga Mat Restock', amount: -250 },
    { id: 'fin-4', date: getPastDate(4, 0), type: 'income', description: 'On-demand video purchase', amount: 10 },
    { id: 'fin-5', date: getFutureDate(0, 0), type: 'expense', description: 'Instructor Payout: Serena Woods', amount: -500 },
];
