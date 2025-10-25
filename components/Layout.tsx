import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useAuth, useAppData } from '../App';
import { User, LogOut, ChevronDown, ChevronUp, Menu, X, MessageSquare } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
    navItems: { name: string; icon: React.ElementType; viewId: string }[];
    activeView: string;
    setActiveView: (viewId: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, navItems, activeView, setActiveView }) => {
    const { currentUser, logout } = useAuth();
    const { messages } = useAppData();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const prevMessagesCount = useRef(messages.length);

    // --- NOTIFICATION LOGIC ---
    const hasUnreadMessages = useMemo(() => {
        if (!currentUser) return false;
        return messages.some(m => m.receiverId === currentUser.id && !m.read);
    }, [messages, currentUser]);

    const playNotificationSound = () => {
        // Function to play a sound without needing an audio file
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        if (!audioContext) return; // AudioContext not supported
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5 note
        gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);

        // Fade out
        gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.5);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    };

     useEffect(() => {
        if (messages.length > prevMessagesCount.current) {
            const latestMessage = messages[messages.length - 1];
            if (latestMessage.receiverId === currentUser?.id) {
                // It's a new incoming message
                playNotificationSound();
            }
        }
        // Update the count for the next check
        prevMessagesCount.current = messages.length;
    }, [messages, currentUser?.id]);
    
    interface NavLinkProps {
        item: { name: string; icon: React.ElementType; viewId: string };
    }
    const NavLink: React.FC<NavLinkProps> = ({ item }) => {
        const isActive = activeView === item.viewId;
        const Icon = item.icon;
        return (
            <button
                onClick={() => {
                    setActiveView(item.viewId);
                    setIsMobileMenuOpen(false);
                }}
                className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive
                        ? 'bg-teal-600 text-white shadow-md'
                        : 'text-stone-300 hover:bg-teal-800 hover:text-white'
                }`}
            >
                <Icon className="w-5 h-5 mr-3" />
                <span>{item.name}</span>
            </button>
        );
    };
    
    const gridColsClass = navItems.length === 4 ? 'grid-cols-4' : 'grid-cols-5';

    return (
        <div className="flex h-screen bg-stone-100">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-teal-900 text-white">
                <div className="flex items-center justify-center h-20 border-b border-teal-800">
                    <h1 className="text-2xl font-bold tracking-wider">Zenith Yoga</h1>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                    {navItems.map((item) => <NavLink key={item.viewId} item={item} />)}
                </nav>
                <div className="p-4 border-t border-teal-800">
                     <div className="flex items-center mb-4">
                        <img src={currentUser?.avatarUrl} alt={currentUser?.name} className="w-10 h-10 rounded-full mr-3 border-2 border-teal-500" />
                        <div>
                            <p className="font-semibold text-white">{currentUser?.name}</p>
                            <p className="text-xs text-stone-300">{currentUser?.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg bg-teal-800 hover:bg-red-600 transition-colors duration-200"
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </aside>
            
            {/* Mobile Experience */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="md:hidden flex items-center justify-between h-16 bg-white shadow-md px-4 shrink-0">
                     <h1 className="text-xl font-bold text-teal-700">Zenith Yoga</h1>
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </header>

                {/* Mobile Menu Content */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-teal-900 text-white p-4 absolute top-16 left-0 right-0 z-20 shadow-lg">
                        <nav className="space-y-2 mb-4">
                            {navItems.map((item) => <NavLink key={item.viewId} item={item} />)}
                        </nav>
                         <div className="flex items-center mb-4">
                            <img src={currentUser?.avatarUrl} alt={currentUser?.name} className="w-10 h-10 rounded-full mr-3 border-2 border-teal-500" />
                            <div>
                                <p className="font-semibold text-white">{currentUser?.name}</p>
                                <p className="text-xs text-stone-300">{currentUser?.role}</p>
                            </div>
                        </div>
                        <button onClick={logout} className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg bg-teal-800 hover:bg-red-600">
                            <LogOut className="w-5 h-5 mr-3" /> Cerrar Sesión
                        </button>
                    </div>
                )}
                
                {/* Main Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-24 md:pb-8">
                    {children}
                    <footer className="pt-8 text-center">
                        <a href="https://www.yogaalliance.org/" target="_blank" rel="noopener noreferrer" className="inline-block" title="Registered Yoga School with Yoga Alliance">
                            <img 
                                src="https://appdesignmex.com/yogaalliance.png" 
                                alt="Yoga Alliance Registered Yoga School" 
                                className="h-20 md:h-24 mx-auto"
                            />
                        </a>
                    </footer>
                </main>

                 {/* Mobile Bottom Bar */}
                <nav className={`md:hidden grid ${gridColsClass} gap-1 p-2 bg-white border-t border-stone-200 fixed bottom-0 w-full z-10`}>
                    {navItems.slice(0, 5).map(item => {
                         const isActive = activeView === item.viewId;
                         const Icon = item.icon;
                        return (
                             <button
                                key={item.viewId}
                                onClick={() => setActiveView(item.viewId)}
                                className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${isActive ? 'bg-teal-100 text-teal-700' : 'text-stone-500 hover:bg-teal-50'}`}
                             >
                                <Icon className="w-6 h-6 mb-1"/>
                                <span className="text-xs text-center">{item.name}</span>
                             </button>
                        )
                    })}
                </nav>
            </div>

            {/* --- FLOATING CHAT BUTTON --- */}
            <button
                onClick={() => setActiveView('chat')}
                className="fixed bottom-20 right-5 md:bottom-8 md:right-8 z-30 bg-teal-600 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center hover:bg-teal-700 transition-transform transform hover:scale-110"
                aria-label="Abrir chat"
            >
                <MessageSquare className="w-8 h-8" />
                {hasUnreadMessages && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></span>
                )}
            </button>
        </div>
    );
};

export default Layout;