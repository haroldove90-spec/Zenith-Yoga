
import React, { useState } from 'react';
import { useAppData } from '../../App';
import { Promotion } from '../../types';
import { Tag, PlusCircle, Edit, Trash2 } from 'lucide-react';

const ManagePromotionsView: React.FC = () => {
    const { promotions, setPromotions } = useAppData();
    
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h1 className="text-3xl font-bold text-stone-800">Gestionar Promociones</h1>
                    <p className="text-stone-500 mt-1">Crea y administra descuentos y ofertas especiales.</p>
                </div>
                <button onClick={() => {}} className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg shadow-md hover:bg-teal-700 transition-colors" disabled>
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
                                <button className="p-2 text-stone-500 hover:text-teal-600 rounded-full hover:bg-stone-100" disabled><Edit className="w-4 h-4" /></button>
                                <button className="p-2 text-stone-500 hover:text-red-600 rounded-full hover:bg-stone-100" disabled><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManagePromotionsView;