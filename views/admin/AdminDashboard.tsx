
import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { BarChart, Calendar, Users, DollarSign, Tag, MessageSquare, Settings } from 'lucide-react';
import ManageClassesView from './ManageClassesView';

const adminNavItems = [
    { name: 'Dashboard', icon: BarChart, viewId: 'dashboard' },
    { name: 'Manage Classes', icon: Calendar, viewId: 'classes' },
    { name: 'Manage Users', icon: Users, viewId: 'users' },
    { name: 'Finances', icon: DollarSign, viewId: 'finances' },
    { name: 'Promotions', icon: Tag, viewId: 'promotions' },
    { name: 'Chat', icon: MessageSquare, viewId: 'chat' },
];

const AdminDashboard: React.FC = () => {
    const [activeView, setActiveView] = useState('classes');

    const renderView = () => {
        switch (activeView) {
            case 'classes':
                return <ManageClassesView />;
            case 'dashboard':
                 return <div className="text-2xl font-bold">Admin Dashboard Coming Soon</div>;
            case 'users':
                return <div className="text-2xl font-bold">User Management Coming Soon</div>;
            case 'finances':
                 return <div className="text-2xl font-bold">Finance Tracking Coming Soon</div>;
            case 'promotions':
                 return <div className="text-2xl font-bold">Promotions Management Coming Soon</div>;
            case 'chat':
                return <div className="text-2xl font-bold">Chat Feature Coming Soon</div>;
            default:
                return <ManageClassesView />;
        }
    };

    return (
        <Layout navItems={adminNavItems} activeView={activeView} setActiveView={setActiveView}>
            {renderView()}
        </Layout>
    );
};

export default AdminDashboard;
