
import React, { useState, createContext, useContext, useMemo } from 'react';
import { User, Role, YogaClass, Booking, OnDemandVideo, Promotion, Teacher } from './types';
import { mockUsers, mockClasses, mockBookings, mockOnDemandVideos, mockPromotions, mockTeachers } from './data/mockData';
import AdminDashboard from './views/admin/AdminDashboard';
import ClientDashboard from './views/client/ClientDashboard';
import { Hash, Users, Calendar, Video, Tag, UserCircle, LogIn, Sun, Moon } from 'lucide-react';

// --- CONTEXTS ---
type AppDataContextType = {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  classes: YogaClass[];
  setClasses: React.Dispatch<React.SetStateAction<YogaClass[]>>;
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  videos: OnDemandVideo[];
  promotions: Promotion[];
  setPromotions: React.Dispatch<React.SetStateAction<Promotion[]>>;
  teachers: Teacher[];
};

const AppDataContext = createContext<AppDataContextType | null>(null);
export const useAppData = () => {
    const context = useContext(AppDataContext);
    if (!context) throw new Error("useAppData must be used within an AppDataProvider");
    return context;
};

type AuthContextType = {
  currentUser: User | null;
  login: (userId: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};


// --- AUTH PROVIDER ---
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const { users } = useAppData();

    const login = (userId: string) => {
        const user = users.find(u => u.id === userId);
        if (user) {
            setCurrentUser(user);
        } else {
            console.error("User not found");
        }
    };

    const logout = () => {
        setCurrentUser(null);
    };

    const authValue = useMemo(() => ({ currentUser, login, logout }), [currentUser, users]);

    return (
        <AuthContext.Provider value={authValue}>
            {children}
        </AuthContext.Provider>
    );
};

// --- APP DATA PROVIDER ---
const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [classes, setClasses] = useState<YogaClass[]>(mockClasses);
    const [bookings, setBookings] = useState<Booking[]>(mockBookings);
    const [videos, setVideos] = useState<OnDemandVideo[]>(mockOnDemandVideos);
    const [promotions, setPromotions] = useState<Promotion[]>(mockPromotions);
    const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers);

    const contextValue = useMemo(() => ({
        users, setUsers, classes, setClasses, bookings, setBookings, videos, promotions, setPromotions, teachers
    }), [users, classes, bookings, videos, promotions, teachers]);

    return (
        <AppDataContext.Provider value={contextValue}>
            {children}
        </AppDataContext.Provider>
    );
};

// --- LOGIN SCREEN ---
const LoginScreen = () => {
    const { login } = useAuth();
    const { users } = useAppData();
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-emerald-100 p-4">
            <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-teal-700 tracking-tight">Zenith Yoga</h1>
                    <p className="text-stone-500 mt-2">Welcome back to your sanctuary.</p>
                </div>
                
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-stone-600 text-center">Select your role to continue</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button onClick={() => login('user-admin-1')} className="flex flex-col items-center justify-center p-6 bg-teal-50 hover:bg-teal-100 rounded-lg border-2 border-teal-200 hover:border-teal-400 transition-all duration-300 transform hover:scale-105">
                            <Users className="w-10 h-10 text-teal-600 mb-2"/>
                            <span className="font-bold text-teal-800">Admin</span>
                        </button>
                        <button onClick={() => login('user-client-1')} className="flex flex-col items-center justify-center p-6 bg-emerald-50 hover:bg-emerald-100 rounded-lg border-2 border-emerald-200 hover:border-emerald-400 transition-all duration-300 transform hover:scale-105">
                            <UserCircle className="w-10 h-10 text-emerald-600 mb-2"/>
                            <span className="font-bold text-emerald-800">Client</span>
                        </button>
                    </div>
                </div>

                 <p className="text-xs text-stone-400 text-center pt-4">This is a demo. Select a role to log in as a pre-configured user.</p>
            </div>
        </div>
    );
};

// --- MAIN APP ---
const App: React.FC = () => {
    return (
        <AppDataProvider>
            <AuthProvider>
                <Main />
            </AuthProvider>
        </AppDataProvider>
    );
};

const Main: React.FC = () => {
    const { currentUser } = useAuth();
    
    if (!currentUser) {
        return <LoginScreen />;
    }

    return (
        <div className="min-h-screen bg-stone-100">
            {currentUser.role === Role.ADMIN ? <AdminDashboard /> : <ClientDashboard />}
        </div>
    );
}

export default App;
