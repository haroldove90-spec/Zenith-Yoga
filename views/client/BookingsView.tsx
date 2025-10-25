
import React from 'react';
import { useAppData, useAuth } from '../../App';
import { Booking, YogaClass, ClassStatus } from '../../types';
import { Calendar, Clock, User, CheckCircle, List, History } from 'lucide-react';

const BookingCard: React.FC<{ booking: Booking, yogaClass?: YogaClass, isUpcoming: boolean }> = ({ booking, yogaClass, isUpcoming }) => {
    const { teachers } = useAppData();
    if (!yogaClass) return null;

    const teacher = teachers.find(t => t.id === yogaClass.teacherId);

    const statusInfo = {
        confirmed: { text: 'Confirmada', icon: CheckCircle, color: 'text-green-600' },
        waitlisted: { text: 'En lista de espera', icon: List, color: 'text-orange-600' },
        cancelled: { text: 'Cancelada', icon: History, color: 'text-red-600' }
    };
    const currentStatus = statusInfo[booking.status];
    const Icon = currentStatus.icon;

    return (
        <div className={`bg-white rounded-lg shadow-sm p-5 border-l-4 ${isUpcoming ? 'border-teal-500' : 'border-stone-300'}`}>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold text-stone-800">{yogaClass.name}</h3>
                    <p className="text-sm text-stone-500">con {teacher?.name || 'Instructor Desconocido'}</p>
                </div>
                <div className={`flex items-center text-sm font-semibold ${currentStatus.color}`}>
                    <Icon className="w-4 h-4 mr-2" />
                    <span>{currentStatus.text}</span>
                </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-stone-600">
                <Calendar className="w-4 h-4 mr-2 text-stone-400" />
                <span>{yogaClass.startTime.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <Clock className="w-4 h-4 ml-4 mr-2 text-stone-400" />
                <span>{yogaClass.startTime.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
        </div>
    );
};

const BookingsView: React.FC = () => {
    const { bookings, classes } = useAppData();
    const { currentUser } = useAuth();

    if (!currentUser) return null;

    const myBookings = bookings.filter(b => b.userId === currentUser.id);

    const upcomingBookings = myBookings
        .map(b => ({ booking: b, yogaClass: classes.find(c => c.id === b.classId) }))
        .filter(item => item.yogaClass && item.yogaClass.startTime >= new Date())
        .sort((a, b) => a.yogaClass!.startTime.getTime() - b.yogaClass!.startTime.getTime());

    const pastBookings = myBookings
        .map(b => ({ booking: b, yogaClass: classes.find(c => c.id === b.classId) }))
        .filter(item => item.yogaClass && item.yogaClass.startTime < new Date())
        .sort((a, b) => b.yogaClass!.startTime.getTime() - a.yogaClass!.startTime.getTime());

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-stone-800">Mis Reservas</h1>
                <p className="text-stone-500 mt-1">Tu historial y próximas clases en Zenith Yoga.</p>
            </div>

            <section>
                <h2 className="text-2xl font-semibold text-stone-700 mb-4">Próximas Reservas</h2>
                {upcomingBookings.length > 0 ? (
                    <div className="space-y-4">
                        {upcomingBookings.map(({ booking, yogaClass }) => (
                           <BookingCard key={booking.id} booking={booking} yogaClass={yogaClass} isUpcoming={true} />
                        ))}
                    </div>
                ) : (
                    <p className="text-stone-500">No tienes ninguna clase reservada. ¡Anímate a explorar nuestro horario!</p>
                )}
            </section>

             <section>
                <h2 className="text-2xl font-semibold text-stone-700 mb-4">Historial de Clases</h2>
                 {pastBookings.length > 0 ? (
                    <div className="space-y-4">
                        {pastBookings.map(({ booking, yogaClass }) => (
                           <BookingCard key={booking.id} booking={booking} yogaClass={yogaClass} isUpcoming={false} />
                        ))}
                    </div>
                ) : (
                    <p className="text-stone-500">Aún no has completado ninguna clase.</p>
                )}
            </section>
        </div>
    );
};

export default BookingsView;
