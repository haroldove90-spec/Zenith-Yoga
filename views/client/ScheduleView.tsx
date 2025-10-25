
import React from 'react';
import { useAppData, useAuth } from '../../App';
import { YogaClass, ClassStatus } from '../../types';

const ClassCard: React.FC<{ yogaClass: YogaClass }> = ({ yogaClass }) => {
    const { teachers, setClasses } = useAppData();
    const { currentUser } = useAuth();
    const teacher = teachers.find(t => t.id === yogaClass.teacherId);
    
    if (!currentUser) return null;

    const isBooked = yogaClass.attendees.includes(currentUser.id);
    const isWaitlisted = yogaClass.waitlist.includes(currentUser.id);
    const isFull = yogaClass.attendees.length >= yogaClass.capacity;

    const handleBook = () => {
        setClasses(prev => prev.map(c => {
            if (c.id === yogaClass.id) {
                return { ...c, attendees: [...c.attendees, currentUser.id] };
            }
            return c;
        }));
    };
    
    const handleJoinWaitlist = () => {
         setClasses(prev => prev.map(c => {
            if (c.id === yogaClass.id) {
                return { ...c, waitlist: [...c.waitlist, currentUser.id] };
            }
            return c;
        }));
    };
    
    const handleCancel = () => {
        setClasses(prev => prev.map(c => {
            if (c.id === yogaClass.id) {
                // Si el usuario cancela, revisa la lista de espera
                const newAttendees = c.attendees.filter(id => id !== currentUser.id);
                let newWaitlist = [...c.waitlist];

                if (newWaitlist.length > 0) {
                    const nextUser = newWaitlist.shift();
                    if (nextUser) {
                      newAttendees.push(nextUser);
                    }
                }
                return { ...c, attendees: newAttendees, waitlist: newWaitlist };
            }
            return c;
        }));
    };

    const handleCancelWaitlist = () => {
        setClasses(prev => prev.map(c => {
            if (c.id === yogaClass.id) {
                return { ...c, waitlist: c.waitlist.filter(id => id !== currentUser.id) };
            }
            return c;
        }));
    };

    const renderActionButtons = () => {
        if (isBooked) {
            return <button onClick={handleCancel} className="w-full px-4 py-2 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition-colors">Cancelar Reserva</button>;
        }
        if (isWaitlisted) {
            return <button onClick={handleCancelWaitlist} className="w-full px-4 py-2 bg-orange-100 text-orange-700 font-semibold rounded-lg hover:bg-orange-200 transition-colors">Salir de Lista de Espera</button>;
        }
        if (isFull) {
            return <button onClick={handleJoinWaitlist} className="w-full px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors">Unirse a Lista de Espera</button>;
        }
        return <button onClick={handleBook} className="w-full px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors">Reservar Ahora</button>;
    };

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
            <div className="p-6 flex-grow">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-semibold text-teal-600">{yogaClass.startTime.toLocaleDateString('es-MX', { weekday: 'long' })}</p>
                        <h3 className="text-xl font-bold text-stone-800 mt-1">{yogaClass.name}</h3>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-bold text-stone-800">{yogaClass.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        <p className="text-sm text-stone-500">{yogaClass.duration} min</p>
                    </div>
                </div>
                
                <p className="text-stone-600 mt-3 text-sm">{yogaClass.description}</p>
                
                <div className="flex items-center mt-4 pt-4 border-t border-stone-100">
                    <img src={teacher?.avatarUrl} alt={teacher?.name} className="w-10 h-10 rounded-full mr-3"/>
                    <div>
                        <p className="font-semibold text-stone-700">{teacher?.name}</p>
                        <p className="text-xs text-stone-500">Instructor(a)</p>
                    </div>
                </div>
            </div>
            <div className="bg-stone-50 p-4">
                <div className="flex justify-between items-center text-sm mb-3">
                    <span className="font-semibold text-stone-600">
                        Lugares: {Math.max(0, yogaClass.capacity - yogaClass.attendees.length)}
                    </span>
                    <span className="font-bold text-xl text-emerald-600">${yogaClass.price}</span>
                </div>
                {renderActionButtons()}
            </div>
        </div>
    );
};

const ScheduleView: React.FC = () => {
    const { classes } = useAppData();
    const upcomingClasses = classes
        .filter(c => c.status === ClassStatus.UPCOMING)
        .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

    return (
        <div className="space-y-6">
             <div>
                <h1 className="text-3xl font-bold text-stone-800">Horario de Clases</h1>
                <p className="text-stone-500 mt-1">Encuentra tu próxima clase y reserva tu lugar.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {upcomingClasses.map(cls => (
                    <ClassCard key={cls.id} yogaClass={cls} />
                ))}
            </div>
        </div>
    );
};

export default ScheduleView;