
import { Role, User, YogaClass, ClassStatus, Booking, OnDemandVideo, Promotion, Teacher, FinancialRecord, ChatMessage } from '../types';

export const mockUsers: User[] = [
  { id: 'user-admin-1', name: 'Alejandra Ríos', email: 'alejandra@zenithyoga.com', role: Role.ADMIN, avatarUrl: 'https://picsum.photos/seed/alex/100/100', membership: 'active' },
  { id: 'user-client-1', name: 'Benito Campos', email: 'benito@example.com', role: Role.CLIENT, avatarUrl: 'https://picsum.photos/seed/ben/100/100', membership: 'active' },
  { id: 'user-client-2', name: 'Carla Díaz', email: 'carla@example.com', role: Role.CLIENT, avatarUrl: 'https://picsum.photos/seed/chloe/100/100', membership: 'inactive' },
  { id: 'user-client-3', name: 'David Estrada', email: 'david@example.com', role: Role.CLIENT, avatarUrl: 'https://picsum.photos/seed/david/100/100', membership: 'active' },
  { id: 'user-client-4', name: 'Eva Fuentes', email: 'eva@example.com', role: Role.CLIENT, avatarUrl: 'https://picsum.photos/seed/eva/100/100', membership: 'active' },
];

export const mockTeachers: Teacher[] = [
    { id: 'teacher-1', name: 'Serena Montero', bio: 'Especialista en Vinyasa Flow y meditación mindfulness. Aporta calma y fuerza a cada clase.', avatarUrl: 'https://picsum.photos/seed/serena/100/100' },
    { id: 'teacher-2', name: 'Leo Chen', bio: 'Experto en Ashtanga y Power Yoga. Leo se enfoca en construir fuerza central y disciplina.', avatarUrl: 'https://picsum.photos/seed/leo/100/100' },
    { id: 'teacher-3', name: 'Maya Paredes', bio: 'Maya guía a los estudiantes a través del Yoga restaurativo y Yin, promoviendo relajación profunda y flexibilidad.', avatarUrl: 'https://picsum.photos/seed/maya/100/100' }
];

const now = new Date();
const getFutureDate = (days: number, hour: number) => {
    const date = new Date(now);
    date.setDate(date.getDate() + days);
    date.setHours(hour, 0, 0, 0);
    return date;
}

const getPastDate = (days: number, hour: number, minutes: number = 0) => {
    const date = new Date(now);
    date.setDate(date.getDate() - days);
    date.setHours(hour, minutes, 0, 0);
    return date;
}

export const mockClasses: YogaClass[] = [
  { id: 'class-1', name: 'Vinyasa Flow al Amanecer', description: 'Energiza tu mañana con un flujo dinámico para despertar el cuerpo y la mente.', teacherId: 'teacher-1', startTime: getFutureDate(1, 7), duration: 60, capacity: 2, attendees: ['user-client-1'], waitlist: ['user-client-3'], status: ClassStatus.UPCOMING, price: 350 },
  { id: 'class-2', name: 'Yoga Restaurativo Nocturno', description: 'Relájate y libera la tensión con posturas suaves y estiramientos profundos.', teacherId: 'teacher-3', startTime: getFutureDate(1, 19), duration: 75, capacity: 15, attendees: [], waitlist: [], status: ClassStatus.UPCOMING, price: 350 },
  { id: 'class-3', name: 'Power Ashtanga', description: 'Una práctica desafiante y vigorizante para construir fuerza y resistencia.', teacherId: 'teacher-2', startTime: getFutureDate(2, 18), duration: 90, capacity: 20, attendees: ['user-client-1', 'user-client-3'], waitlist: [], status: ClassStatus.UPCOMING, price: 400 },
  { id: 'class-4', name: 'Meditación Guiada', description: 'Cultiva la paz interior y el enfoque a través de técnicas de meditación guiada.', teacherId: 'teacher-1', startTime: getFutureDate(3, 12), duration: 45, capacity: 25, attendees: [], waitlist: [], status: ClassStatus.UPCOMING, price: 250 },
  { id: 'class-5', name: 'Hatha Yoga (Clase Pasada)', description: 'Una clase fundamental centrada en la alineación y la respiración.', teacherId: 'teacher-3', startTime: getPastDate(2, 9), duration: 60, capacity: 15, attendees: ['user-client-1', 'user-client-2'], waitlist: [], status: ClassStatus.COMPLETED, price: 300 },
  { id: 'class-6', name: 'Taller Cancelado', description: 'Este taller fue cancelado por circunstancias imprevistas.', teacherId: 'teacher-2', startTime: getPastDate(5, 14), duration: 120, capacity: 10, attendees: [], waitlist: [], status: ClassStatus.CANCELLED, price: 800 },
];

export const mockBookings: Booking[] = [
  { id: 'booking-1', classId: 'class-1', userId: 'user-client-1', bookingTime: new Date(), status: 'confirmed' },
  { id: 'booking-2', classId: 'class-3', userId: 'user-client-1', bookingTime: new Date(), status: 'confirmed' },
  { id: 'booking-3', classId: 'class-5', userId: 'user-client-1', bookingTime: getPastDate(3, 10), status: 'confirmed' },
  { id: 'booking-4', classId: 'class-1', userId: 'user-client-3', bookingTime: new Date(), status: 'waitlisted' },
  { id: 'booking-5', classId: 'class-5', userId: 'user-client-2', bookingTime: getPastDate(3, 11), status: 'confirmed' },
];

export const mockOnDemandVideos: OnDemandVideo[] = [
    { id: 'video-1', title: 'Yoga para principiantes', description: 'Una rutina de 20 minutos ideal para empezar tu práctica de yoga.', thumbnailUrl: 'https://i.ytimg.com/vi/aeLlp--bDEY/hqdefault.jpg', duration: 20, teacherId: 'teacher-1', youtubeId: 'aeLlp--bDEY' },
    { id: 'video-2', title: 'Yoga para la mañana', description: 'Despierta tu cuerpo y mente con esta sesión energizante de 15 minutos.', thumbnailUrl: 'https://i.ytimg.com/vi/BmcMiBGNFU4/hqdefault.jpg', duration: 15, teacherId: 'teacher-2', youtubeId: 'BmcMiBGNFU4' },
    { id: 'video-3', title: 'Yoga para la espalda', description: 'Alivia la tensión y el dolor de espalda con esta práctica restaurativa.', thumbnailUrl: 'https://i.ytimg.com/vi/jb0eYBxaRR8/hqdefault.jpg', duration: 30, teacherId: 'teacher-3', youtubeId: 'jb0eYBxaRR8' },
    { id: 'video-4', title: 'Yoga para relajarse', description: 'Libera el estrés del día con esta secuencia calmante de 10 minutos.', thumbnailUrl: 'https://i.ytimg.com/vi/c63QWteF5Dc/hqdefault.jpg', duration: 10, teacherId: 'teacher-1', youtubeId: 'c63QWteF5Dc' }
];

export const mockPromotions: Promotion[] = [
    { id: 'promo-1', title: 'Descuento para Nuevos Miembros', description: '¡Obtén 20% de descuento en tu primer mes de membresía!', code: 'NUEVOZEN20', discount: 20 },
    { id: 'promo-2', title: 'Especial de Verano', description: 'Compra un pase de 10 clases y obtén 2 clases gratis.', code: 'VERANOZEN', discount: 16.67 },
];

export const mockFinancialRecords: FinancialRecord[] = [
    { id: 'fin-1', date: getPastDate(1, 0), type: 'income', description: 'Reserva de clase: Vinyasa Flow', amount: 350 },
    { id: 'fin-2', date: getPastDate(2, 0), type: 'income', description: 'Membresía: Carla Díaz', amount: 1500 },
    { id: 'fin-3', date: getPastDate(3, 0), type: 'expense', description: 'Compra de tapetes de yoga', amount: -2500 },
    { id: 'fin-4', date: getPastDate(4, 0), type: 'income', description: 'Venta de video on-demand', amount: 150 },
    { id: 'fin-5', date: getPastDate(0, 0), type: 'expense', description: 'Pago a instructora: Serena Montero', amount: -5000 },
    { id: 'fin-6', date: getPastDate(5, 0), type: 'income', description: 'Membresía: Benito Campos', amount: 1500 },
    { id: 'fin-7', date: getPastDate(6, 0), type: 'expense', description: 'Servicio de limpieza', amount: -1200 },
];

export const mockMessages: ChatMessage[] = [
    { id: 'msg-1', senderId: 'user-client-2', receiverId: 'user-admin-1', text: 'Hola, tengo una pregunta sobre mi membresía.', timestamp: getPastDate(1, 9), read: true },
    { id: 'msg-2', senderId: 'user-admin-1', receiverId: 'user-client-2', text: '¡Hola Carla! Claro, dime en qué puedo ayudarte.', timestamp: getPastDate(1, 9, 5), read: true },
    { id: 'msg-3', senderId: 'user-client-2', receiverId: 'user-admin-1', text: 'Veo que está inactiva, ¿cómo puedo reactivarla?', timestamp: getPastDate(1, 9, 7), read: false },
    { id: 'msg-4', senderId: 'user-client-4', receiverId: 'user-admin-1', text: '¿Tienen clases prenatales?', timestamp: getPastDate(0, 14), read: true },
    { id: 'msg-5', senderId: 'user-admin-1', receiverId: 'user-client-4', text: 'Hola Eva, por el momento no, pero estamos planeando agregarlas pronto. Te mantendremos informada.', timestamp: getPastDate(0, 14, 2), read: false },
];
