
import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { BarChart, Calendar, Users, DollarSign, Tag, MessageSquare, Settings } from 'lucide-react';
import ManageClassesView from './ManageClassesView';
import ManageUsersView from './ManageUsersView';
import FinancesView from './FinancesView';
import ManagePromotionsView from './ManagePromotionsView';
import ChatView from './ChatView';

const adminNavItems = [
    { name: 'Clases', icon: Calendar, viewId: 'clases' },
    { name: 'Usuarios', icon: Users, viewId: 'usuarios' },
    { name: 'Finanzas', icon: DollarSign, viewId: 'finanzas' },
    { name: 'Promociones', icon: Tag, viewId: 'promociones' },
    { name: 'Chat', icon: MessageSquare, viewId: 'chat' },
];

const AdminDashboard: React.FC = () => {
    const [activeView, setActiveView] = useState('clases');

    const renderView = () => {
        switch (activeView) {
            case 'clases':
                return <ManageClassesView />;
            case 'usuarios':
                return <ManageUsersView />;
            case 'finanzas':
                 return <FinancesView />;
            case 'promociones':
                 return <ManagePromotionsView />;
            case 'chat':
                return <ChatView />;
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