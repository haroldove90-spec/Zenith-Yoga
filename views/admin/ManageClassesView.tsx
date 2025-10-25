
import React, { useState, useCallback } from 'react';
import { useAppData } from '../../App';
import { YogaClass, Teacher, ClassStatus } from '../../types';
import { PlusCircle, Edit, Trash2, Users, Clock, List, Search, Sparkles, ChevronDown } from 'lucide-react';
import { generateClassDescription } from '../../services/geminiService';

// Reusable Modal Component
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white">
                    <h2 className="text-xl font-bold text-stone-700">{title}</h2>
                    <button onClick={onClose} className="text-stone-500 hover:text-stone-800">&times;</button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

// Form for adding/editing a class
interface ClassFormProps {
    onSave: (classData: Omit<YogaClass, 'id' | 'attendees' | 'waitlist' | 'status'> & { id?: string }) => void;
    onCancel: () => void;
    classData?: YogaClass | null;
}

const ClassForm: React.FC<ClassFormProps> = ({ onSave, onCancel, classData }) => {
    const { teachers } = useAppData();
    const [name, setName] = useState(classData?.name || '');
    const [description, setDescription] = useState(classData?.description || '');
    const [teacherId, setTeacherId] = useState(classData?.teacherId || (teachers.length > 0 ? teachers[0].id : ''));
    const [date, setDate] = useState(classData ? classData.startTime.toISOString().split('T')[0] : '');
    const [time, setTime] = useState(classData ? classData.startTime.toTimeString().substring(0, 5) : '');
    const [duration, setDuration] = useState(classData?.duration || 60);
    const [capacity, setCapacity] = useState(classData?.capacity || 15);
    const [price, setPrice] = useState(classData?.price || 25);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateDescription = async () => {
        if (!name) {
            alert("Please enter a class name first.");
            return;
        }
        setIsGenerating(true);
        const keywords = teachers.find(t => t.id === teacherId)?.bio.split(' ').slice(0, 5).join(', ') || "yoga, flow, strength";
        const newDescription = await generateClassDescription(name, keywords);
        setDescription(newDescription);
        setIsGenerating(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const startTime = new Date(`${date}T${time}`);
        onSave({
            id: classData?.id,
            name,
            description,
            teacherId,
            startTime,
            duration,
            capacity,
            price
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-stone-600">Class Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full border-stone-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-stone-600">Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="mt-1 block w-full border-stone-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"></textarea>
                <button type="button" onClick={handleGenerateDescription} disabled={isGenerating} className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-stone-400">
                    <Sparkles className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                    {isGenerating ? 'Generating...' : 'Generate with AI'}
                </button>
            </div>
            <div>
                <label className="block text-sm font-medium text-stone-600">Teacher</label>
                <select value={teacherId} onChange={e => setTeacherId(e.target.value)} className="mt-1 block w-full border-stone-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500">
                    {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-stone-600">Date</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 block w-full border-stone-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" required />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-stone-600">Time</label>
                    <input type="time" value={time} onChange={e => setTime(e.target.value)} className="mt-1 block w-full border-stone-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" required />
                </div>
            </div>
             <div className="grid grid-cols-3 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-stone-600">Duration (min)</label>
                    <input type="number" value={duration} onChange={e => setDuration(Number(e.target.value))} className="mt-1 block w-full border-stone-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-stone-600">Capacity</label>
                    <input type="number" value={capacity} onChange={e => setCapacity(Number(e.target.value))} className="mt-1 block w-full border-stone-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" required />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-stone-600">Price ($)</label>
                    <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} className="mt-1 block w-full border-stone-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" required />
                </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-stone-200 text-stone-700 rounded-md hover:bg-stone-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700">Save Class</button>
            </div>
        </form>
    );
};

// Main view component
const ManageClassesView: React.FC = () => {
    const { classes, setClasses, teachers } = useAppData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClass, setEditingClass] = useState<YogaClass | null>(null);

    const handleAddNew = () => {
        setEditingClass(null);
        setIsModalOpen(true);
    };
    
    const handleEdit = (cls: YogaClass) => {
        setEditingClass(cls);
        setIsModalOpen(true);
    };

    const handleDelete = (classId: string) => {
        if (window.confirm("Are you sure you want to delete this class?")) {
            setClasses(prev => prev.filter(c => c.id !== classId));
        }
    };

    const handleSaveClass = (classData: Omit<YogaClass, 'id' | 'attendees' | 'waitlist' | 'status'> & { id?: string }) => {
        if (classData.id) { // Editing
            setClasses(prev => prev.map(c => c.id === classData.id ? { ...c, ...classData } : c));
        } else { // Adding
            const newClass: YogaClass = {
                ...classData,
                id: `class-${Date.now()}`,
                attendees: [],
                waitlist: [],
                status: classData.startTime > new Date() ? ClassStatus.UPCOMING : ClassStatus.COMPLETED,
            };
            setClasses(prev => [newClass, ...prev]);
        }
        setIsModalOpen(false);
    };

    const getTeacherName = (teacherId: string) => teachers.find(t => t.id === teacherId)?.name || 'Unknown';

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h1 className="text-3xl font-bold text-stone-800">Manage Classes</h1>
                    <p className="text-stone-500 mt-1">Add, edit, or remove yoga classes from the schedule.</p>
                </div>
                <button onClick={handleAddNew} className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg shadow-md hover:bg-teal-700 transition-colors">
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Add New Class
                </button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-stone-600">
                        <thead className="text-xs text-stone-700 uppercase bg-stone-100">
                            <tr>
                                <th scope="col" className="px-6 py-3">Class</th>
                                <th scope="col" className="px-6 py-3">Time & Date</th>
                                <th scope="col" className="px-6 py-3">Teacher</th>
                                <th scope="col" className="px-6 py-3 text-center">Bookings</th>
                                <th scope="col" className="px-6 py-3 text-center">Status</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {classes.sort((a,b) => b.startTime.getTime() - a.startTime.getTime()).map(cls => (
                                <tr key={cls.id} className="bg-white border-b hover:bg-stone-50">
                                    <td className="px-6 py-4 font-medium text-stone-900">{cls.name}</td>
                                    <td className="px-6 py-4">
                                        <div>{cls.startTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                                        <div className="text-xs text-stone-500">{cls.startTime.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })} ({cls.duration} min)</div>
                                    </td>
                                    <td className="px-6 py-4">{getTeacherName(cls.teacherId)}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center space-x-2">
                                            <Users className="w-4 h-4 text-blue-500" />
                                            <span>{cls.attendees.length} / {cls.capacity}</span>
                                            {cls.waitlist.length > 0 && (
                                                <div className="flex items-center" title={`${cls.waitlist.length} on waitlist`}>
                                                   <List className="w-4 h-4 text-orange-500 ml-1" />
                                                   <span>{cls.waitlist.length}</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            cls.status === ClassStatus.UPCOMING ? 'bg-green-100 text-green-800' :
                                            cls.status === ClassStatus.COMPLETED ? 'bg-blue-100 text-blue-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {cls.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end space-x-2">
                                            <button onClick={() => handleEdit(cls)} className="p-2 text-stone-500 hover:text-teal-600 rounded-full hover:bg-stone-100"><Edit className="w-4 h-4" /></button>
                                            <button onClick={() => handleDelete(cls.id)} className="p-2 text-stone-500 hover:text-red-600 rounded-full hover:bg-stone-100"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingClass ? 'Edit Class' : 'Add New Class'}>
                <ClassForm 
                    onSave={handleSaveClass} 
                    onCancel={() => setIsModalOpen(false)} 
                    classData={editingClass}
                />
            </Modal>
        </div>
    );
};

export default ManageClassesView;
