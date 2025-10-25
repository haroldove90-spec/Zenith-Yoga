
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useAppData, useAuth } from '../../App';
import { ChatMessage, User } from '../../types';
import { mockMessages } from '../../data/mockData';
import { Send } from 'lucide-react';

const ChatView: React.FC = () => {
    const { users } = useAppData();
    const { currentUser } = useAuth();
    const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
    const [selectedUserId, setSelectedUserId] = useState<string>('user-client-2');
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, selectedUserId]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentUser) return;
        
        const message: ChatMessage = {
            id: `msg-${Date.now()}`,
            senderId: currentUser.id,
            receiverId: selectedUserId,
            text: newMessage.trim(),
            timestamp: new Date(),
            read: false,
        };
        setMessages([...messages, message]);
        setNewMessage('');
    };

    const contacts = useMemo(() => {
        const contactIds = new Set<string>();
        messages.forEach(msg => {
            if (msg.senderId !== currentUser?.id) contactIds.add(msg.senderId);
            if (msg.receiverId !== currentUser?.id) contactIds.add(msg.receiverId);
        });
        return users.filter(user => contactIds.has(user.id));
    }, [messages, users, currentUser]);

    const selectedConversation = useMemo(() => {
        return messages.filter(
            msg => (msg.senderId === selectedUserId && msg.receiverId === currentUser?.id) || (msg.senderId === currentUser?.id && msg.receiverId === selectedUserId)
        ).sort((a,b) => a.timestamp.getTime() - b.timestamp.getTime());
    }, [messages, selectedUserId, currentUser]);
    
    const selectedContact = users.find(u => u.id === selectedUserId);

    if(!currentUser) return null;

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col">
            <h1 className="text-3xl font-bold text-stone-800 mb-4 px-0">Chat</h1>
            <div className="bg-white rounded-lg shadow-sm flex-grow flex overflow-hidden">
                {/* Contacts List */}
                <div className="w-1/3 border-r border-stone-200 overflow-y-auto">
                    <div className="p-4 border-b">
                        <h2 className="text-lg font-bold">Conversaciones</h2>
                    </div>
                    <ul>
                        {contacts.map(contact => {
                            const lastMessage = messages
                                .filter(m => m.senderId === contact.id || m.receiverId === contact.id)
                                .sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
                            return (
                                <li key={contact.id} 
                                    onClick={() => setSelectedUserId(contact.id)}
                                    className={`p-4 flex items-center cursor-pointer border-l-4 ${selectedUserId === contact.id ? 'bg-teal-50 border-teal-500' : 'border-transparent hover:bg-stone-50'}`}>
                                    <img src={contact.avatarUrl} alt={contact.name} className="w-12 h-12 rounded-full mr-4" />
                                    <div className="flex-grow overflow-hidden">
                                        <p className="font-semibold text-stone-800">{contact.name}</p>
                                        <p className="text-sm text-stone-500 truncate">{lastMessage?.text}</p>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                {/* Chat Window */}
                <div className="w-2/3 flex flex-col">
                    {selectedContact ? (
                        <>
                            <div className="p-4 border-b flex items-center">
                                <img src={selectedContact.avatarUrl} alt={selectedContact.name} className="w-10 h-10 rounded-full mr-3" />
                                <h2 className="text-lg font-bold text-stone-800">{selectedContact.name}</h2>
                            </div>
                            <div className="flex-grow p-6 overflow-y-auto bg-stone-50">
                                {selectedConversation.map(msg => (
                                    <div key={msg.id} className={`flex mb-4 ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`rounded-lg px-4 py-2 max-w-sm ${msg.senderId === currentUser.id ? 'bg-teal-600 text-white' : 'bg-stone-200 text-stone-800'}`}>
                                            <p>{msg.text}</p>
                                            <p className="text-xs opacity-75 mt-1 text-right">{msg.timestamp.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit'})}</p>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                            <div className="p-4 bg-white border-t">
                                <form onSubmit={handleSendMessage} className="flex items-center">
                                    <input 
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Escribe un mensaje..."
                                        className="flex-grow border-stone-300 rounded-full shadow-sm focus:ring-teal-500 focus:border-teal-500 pl-4 pr-12 py-2"
                                    />
                                    <button type="submit" className="ml-3 p-3 bg-teal-600 text-white rounded-full hover:bg-teal-700 disabled:bg-stone-300" disabled={!newMessage.trim()}>
                                        <Send className="w-5 h-5" />
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-grow flex items-center justify-center text-stone-500">
                            <p>Selecciona una conversación para empezar a chatear.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatView;