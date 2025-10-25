import React, { useState, useRef, useEffect } from 'react';
import { useAppData, useAuth } from '../../App';
import { ChatMessage } from '../../types';
import { Send } from 'lucide-react';

const ADMIN_USER_ID = 'user-admin-1';

const ClientChatView: React.FC = () => {
    const { users, messages, setMessages } = useAppData();
    const { currentUser } = useAuth();
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const adminUser = users.find(u => u.id === ADMIN_USER_ID);

    // Mark messages as read on view open
    useEffect(() => {
        if (currentUser) {
            setMessages(prev => 
                prev.map(m => 
                    (m.receiverId === currentUser.id && m.senderId === ADMIN_USER_ID && !m.read) 
                        ? { ...m, read: true } 
                        : m
                )
            );
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser?.id, setMessages]);


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentUser) return;
        
        const message: ChatMessage = {
            id: `msg-${Date.now()}`,
            senderId: currentUser.id,
            receiverId: ADMIN_USER_ID,
            text: newMessage.trim(),
            timestamp: new Date(),
            read: false,
        };
        setMessages([...messages, message]);
        setNewMessage('');
    };
    
    const conversation = messages
        .filter(msg => 
            (msg.senderId === ADMIN_USER_ID && msg.receiverId === currentUser?.id) || 
            (msg.senderId === currentUser?.id && msg.receiverId === ADMIN_USER_ID)
        )
        .sort((a,b) => a.timestamp.getTime() - b.timestamp.getTime());

    if (!currentUser || !adminUser) return (
        <div>
            <h1 className="text-3xl font-bold text-stone-800">Chat con Soporte</h1>
            <p className="text-stone-500 mt-2">No se pudo cargar la conversación. El administrador no fue encontrado.</p>
        </div>
    );

    return (
        <div className="flex flex-col h-[calc(100vh-10rem)] md:h-[calc(100vh-8rem)]">
             <div>
                <h1 className="text-3xl font-bold text-stone-800">Chat con Soporte</h1>
                <p className="text-stone-500 mt-1">Comunícate directamente con el estudio.</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm flex-grow flex flex-col overflow-hidden mt-6">
                <div className="p-4 border-b flex items-center shrink-0">
                    <img src={adminUser.avatarUrl} alt={adminUser.name} className="w-10 h-10 rounded-full mr-3" />
                    <h2 className="text-lg font-bold text-stone-800">{adminUser.name} (Admin)</h2>
                </div>
                <div className="flex-grow p-6 overflow-y-auto bg-stone-50">
                    {conversation.map(msg => (
                        <div key={msg.id} className={`flex mb-4 ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                            <div className={`rounded-lg px-4 py-2 max-w-sm ${msg.senderId === currentUser.id ? 'bg-teal-600 text-white' : 'bg-stone-200 text-stone-800'}`}>
                                <p className="break-words">{msg.text}</p>
                                <p className="text-xs opacity-75 mt-1 text-right">{msg.timestamp.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit'})}</p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <div className="p-4 bg-white border-t mt-auto shrink-0">
                    <form onSubmit={handleSendMessage} className="flex items-center">
                        <input 
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Escribe un mensaje..."
                            className="flex-grow min-w-0 bg-stone-100 border-stone-300 text-stone-900 placeholder-stone-500 rounded-full shadow-sm focus:ring-teal-500 focus:border-teal-500 pl-4 pr-12 py-2"
                        />
                        <button type="submit" className="ml-3 p-3 bg-teal-600 text-white rounded-full hover:bg-teal-700 disabled:bg-stone-300" disabled={!newMessage.trim()}>
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ClientChatView;