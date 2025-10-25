import React, { useState } from 'react';
import { useAppData } from '../../App';
import { Promotion } from '../../types';
import { Tag, PlusCircle, Trash2 } from 'lucide-react';

// Modal Component
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
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-stone-700">{title}</h2>
                    <button onClick={onClose} className="text-stone-500 hover:text-stone-800 text-2xl font-bold">&times;</button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
};

// Promotion Form
interface PromotionFormProps {
    onSave: (promo: Omit<Promotion, 'id'>) => void;
    onCancel: () => void;
}
const PromotionForm: React.FC<PromotionFormProps> = ({ onSave, onCancel }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [code, setCode] = useState('');
    const [discount, setDiscount] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            title,
            description,
            code: code.toUpperCase(),
            discount: Number(discount)
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-stone-600">Título</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full border-stone-300 rounded-md shadow-sm" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-stone-600">Descripción</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="mt-1 block w-full border-stone-300 rounded-md shadow-sm"></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-stone-600">Código</label>
                    <input type="text" value={code} onChange={e => setCode(e.target.value)} className="mt-1 block w-full border-stone-300 rounded-md shadow-sm" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-stone-600">Descuento (%)</label>
                    <input type="number" value={discount} onChange={e => setDiscount(e.target.value)} className="mt-1 block w-full border-stone-300 rounded-md shadow-sm" required />
                </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-stone-200 text-stone-700 rounded-md hover:bg-stone-300">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700">Guardar Promoción</button>
            </div>
        </form>
    );
};

const ManagePromotionsView: React.FC = () => {
    const { promotions, setPromotions } = useAppData();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSavePromo = (promo: Omit<Promotion, 'id'>) => {
        const newPromo: Promotion = {
            ...promo,
            id: `promo-${Date.now()}`
        };
        setPromotions(prev => [newPromo, ...prev]);
        setIsModalOpen(false);
    };

    const handleDeletePromo = (promoId: string) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar esta promoción?")) {
            setPromotions(prev => prev.filter(p => p.id !== promoId));
        }
    };
    
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h1 className="text-3xl font-bold text-stone-800">Gestionar Promociones</h1>
                    <p className="text-stone-500 mt-1">Crea y administra descuentos y ofertas especiales.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg shadow-md hover:bg-teal-700 transition-colors">
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Crear Promoción
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {promotions.map(promo => (
                    <div key={promo.id} className="bg-white rounded-lg shadow-sm p-6 flex flex-col justify-between">
                        <div>
                            <div className="flex items-start justify-between">
                                <h2 className="text-xl font-bold text-stone-800">{promo.title}</h2>
                                <div className="flex items-center bg-teal-100 text-teal-800 text-sm font-bold px-3 py-1 rounded-full">
                                    <Tag className="w-4 h-4 mr-2"/>
                                    <span>{promo.code}</span>
                                </div>
                            </div>
                            <p className="text-stone-600 mt-2">{promo.description}</p>
                        </div>
                        <div className="flex justify-between items-end mt-4 pt-4 border-t border-stone-100">
                            <p className="text-2xl font-bold text-emerald-600">{promo.discount}% OFF</p>
                             <div className="flex space-x-2">
                                <button onClick={() => handleDeletePromo(promo.id)} className="p-2 text-stone-500 hover:text-red-600 rounded-full hover:bg-stone-100"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
             <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Crear Nueva Promoción">
                <PromotionForm 
                    onSave={handleSavePromo}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default ManagePromotionsView;