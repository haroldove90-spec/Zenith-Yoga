import React, { useState, createContext, useContext, useMemo } from 'react';
import { User, Role, YogaClass, Booking, OnDemandVideo, Promotion, Teacher, FinancialRecord, ChatMessage } from './types';
import { mockUsers, mockClasses, mockBookings, mockOnDemandVideos, mockPromotions, mockTeachers, mockFinancialRecords, mockMessages } from './data/mockData';
import AdminDashboard from './views/admin/AdminDashboard';
import ClientDashboard from './views/client/ClientDashboard';
import { Hash, Users, Calendar, Video, Tag, UserCircle, LogIn, Sun, Moon } from 'lucide-react';
import usePersistentState from './hooks/usePersistentState';

// --- UTILS ---
const dateFields = ['startTime', 'bookingTime', 'date', 'timestamp'];
function reviveDates(key: string, value: any) {
  if (dateFields.includes(key) && typeof value === 'string') {
    return new Date(value);
  }
  return value;
}

function parseWithDates<T>(jsonString: string | null): T | null {
  if (!jsonString) return null;
  return JSON.parse(jsonString, reviveDates);
}

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
  financialRecords: FinancialRecord[];
  setFinancialRecords: React.Dispatch<React.SetStateAction<FinancialRecord[]>>;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
};

const AppDataContext = createContext<AppDataContextType | null>(null);
export const useAppData = () => {
    const context = useContext(AppDataContext);
    if (!context) throw new Error("useAppData debe usarse dentro de un AppDataProvider");
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
    if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider");
    return context;
};


// --- AUTH PROVIDER ---
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = usePersistentState<User | null>('currentUser', null);
    const { users } = useAppData();

    const login = (userId: string) => {
        const user = users.find(u => u.id === userId);
        if (user) {
            setCurrentUser(user);
        } else {
            console.error("Usuario no encontrado");
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
    const [users, setUsers] = usePersistentState<User[]>('users', mockUsers);
    const [classes, setClasses] = usePersistentState<YogaClass[]>('classes', mockClasses, reviveDates);
    const [bookings, setBookings] = usePersistentState<Booking[]>('bookings', mockBookings, reviveDates);
    const [videos, setVideos] = useState<OnDemandVideo[]>(mockOnDemandVideos); // Videos are static for now
    const [promotions, setPromotions] = usePersistentState<Promotion[]>('promotions', mockPromotions);
    const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers); // Teachers are static
    const [financialRecords, setFinancialRecords] = usePersistentState<FinancialRecord[]>('financialRecords', mockFinancialRecords, reviveDates);
    const [messages, setMessages] = usePersistentState<ChatMessage[]>('messages', mockMessages, reviveDates);

    const contextValue = useMemo(() => ({
        users, setUsers, classes, setClasses, bookings, setBookings, videos, promotions, setPromotions, teachers, financialRecords, setFinancialRecords, messages, setMessages
    }), [users, classes, bookings, videos, promotions, teachers, financialRecords, messages]);

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
                    <p className="text-stone-500 mt-2">Bienvenido de nuevo a tu santuario.</p>
                </div>
                
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-stone-600 text-center">Selecciona tu rol para continuar</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button onClick={() => login('user-admin-1')} className="flex flex-col items-center justify-center p-6 bg-teal-50 hover:bg-teal-100 rounded-lg border-2 border-teal-200 hover:border-teal-400 transition-all duration-300 transform hover:scale-105">
                            <Users className="w-10 h-10 text-teal-600 mb-2"/>
                            <span className="font-bold text-teal-800">Administrador</span>
                        </button>
                        <button onClick={() => login('user-client-1')} className="flex flex-col items-center justify-center p-6 bg-emerald-50 hover:bg-emerald-100 rounded-lg border-2 border-emerald-200 hover:border-emerald-400 transition-all duration-300 transform hover:scale-105">
                            <UserCircle className="w-10 h-10 text-emerald-600 mb-2"/>
                            <span className="font-bold text-emerald-800">Cliente</span>
                        </button>
                    </div>
                </div>

                 <p className="text-xs text-stone-400 text-center pt-4">Esto es una demostración. Selecciona un rol para iniciar sesión como un usuario preconfigurado.</p>
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