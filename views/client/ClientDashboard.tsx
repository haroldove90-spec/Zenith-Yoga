import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { Home, Calendar, Video, Tag, User, Info, CalendarCheck, MessageSquare } from 'lucide-react';
import ScheduleView from './ScheduleView';
import BookingsView from './BookingsView';
import OnDemandView from './OnDemandView';
import ProfileView from './ProfileView';
import ClientChatView from './ChatView';

const clientNavItems = [
    { name: 'Horario', icon: Calendar, viewId: 'schedule' },
    { name: 'Mis Reservas', icon: CalendarCheck, viewId: 'bookings' },
    { name: 'Videos', icon: Video, viewId: 'ondemand' },
    { name: 'Chat', icon: MessageSquare, viewId: 'chat' },
    { name: 'Perfil', icon: User, viewId: 'profile' },
];

const ClientDashboard: React.FC = () => {
    const [activeView, setActiveView] = useState('schedule');

    const renderView = () => {
        switch (activeView) {
            case 'schedule':
                return <ScheduleView />;
            case 'bookings':
                return <BookingsView />;
            case 'ondemand':
                return <OnDemandView />;
            case 'profile':
                return <ProfileView />;
            case 'chat':
                return <ClientChatView />;
            default:
                return <ScheduleView />;
        }
    };

    return (
        <Layout navItems={clientNavItems} activeView={activeView} setActiveView={setActiveView}>
            {renderView()}
        </Layout>
    );
};

export default ClientDashboard;