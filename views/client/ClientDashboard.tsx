
import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { Home, Calendar, Video, Tag, User, Info } from 'lucide-react';
import ScheduleView from './ScheduleView';

const clientNavItems = [
    { name: 'Home', icon: Home, viewId: 'home' },
    { name: 'Schedule', icon: Calendar, viewId: 'schedule' },
    { name: 'My Bookings', icon: Calendar, viewId: 'bookings' },
    { name: 'On-Demand', icon: Video, viewId: 'ondemand' },
    { name: 'Profile', icon: User, viewId: 'profile' },
];

const ClientDashboard: React.FC = () => {
    const [activeView, setActiveView] = useState('schedule');

    const renderView = () => {
        switch (activeView) {
            case 'schedule':
                return <ScheduleView />;
            case 'home':
                return <div className="text-2xl font-bold">Client Home Coming Soon</div>;
            case 'bookings':
                return <div className="text-2xl font-bold">My Bookings Coming Soon</div>;
            case 'ondemand':
                return <div className="text-2xl font-bold">On-Demand Content Coming Soon</div>;
            case 'profile':
                return <div className="text-2xl font-bold">User Profile Coming Soon</div>;
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
