
import React, { useMemo } from 'react';
import { useAuth, useAppData } from '../../App';
import { User, Booking, ClassStatus } from '../../types';
import { Mail, Shield, Award, BarChart2, CalendarCheck, Clock, Star } from 'lucide-react';

const ProfileView: React.FC = () => {
    const { currentUser } = useAuth();
    const { bookings, classes } = useAppData();

    const userStats = useMemo(() => {
        if (!currentUser) return { attendedClasses: 0, totalMinutes: 0 };

        const myBookings = bookings.filter(b => b.userId === currentUser.id && b.status === 'confirmed');
        const attendedClasses = myBookings.reduce((count, booking) => {
            const yogaClass = classes.find(c => c.id === booking.classId);
            if (yogaClass && yogaClass.status === ClassStatus.COMPLETED) {
                return count + 1;
            }
            return count;
        }, 0);

        const totalMinutes = myBookings.reduce((minutes, booking) => {
             const yogaClass = classes.find(c => c.id === booking.classId);
             if (yogaClass && yogaClass.status === ClassStatus.COMPLETED) {
                return minutes + yogaClass.duration;
            }
            return minutes;
        }, 0);

        return { attendedClasses, totalMinutes };
    }, [currentUser, bookings, classes]);

    if (!currentUser) {
        return <div>Cargando perfil...</div>;
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-stone-800">Mi Perfil</h1>
                <p className="text-stone-500 mt-1">Tu espacio personal en Zenith Yoga.</p>
            </div>
            
            {/* Profile Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-24 h-24 rounded-full border-4 border-teal-500" />
                <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold text-stone-800">{currentUser.name}</h2>
                    <p className="text-stone-600 flex items-center justify-center md:justify-start mt-1">
                        <Mail className="w-4 h-4 mr-2 text-stone-400"/>
                        {currentUser.email}
                    </p>
                    <div className="mt-2">
                        <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${
                            currentUser.membership === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                            Membresía {currentUser.membership === 'active' ? 'Activa' : 'Inactiva'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div>
                 <h2 className="text-2xl font-semibold text-stone-700 mb-4">Mis Estadísticas</h2>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm flex items-center">
                        <div className="p-3 rounded-full bg-teal-100 mr-4">
                            <CalendarCheck className="w-6 h-6 text-teal-600" />
                        </div>
                        <div>
                            <p className="text-sm text-stone-500">Clases Asistidas</p>
                            <p className="text-2xl font-bold text-stone-800">{userStats.attendedClasses}</p>
                        </div>
                    </div>
                     <div className="bg-white p-6 rounded-lg shadow-sm flex items-center">
                        <div className="p-3 rounded-full bg-emerald-100 mr-4">
                            <Clock className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-sm text-stone-500">Minutos de Práctica</p>
                            <p className="text-2xl font-bold text-stone-800">{userStats.totalMinutes}</p>
                        </div>
                    </div>
                     <div className="bg-white p-6 rounded-lg shadow-sm flex items-center">
                        <div className="p-3 rounded-full bg-amber-100 mr-4">
                            <Star className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm text-stone-500">Instructor Favorito</p>
                            <p className="text-xl font-bold text-stone-800">Serena Montero</p>
                        </div>
                    </div>
                 </div>
            </div>

        </div>
    );
};

export default ProfileView;
