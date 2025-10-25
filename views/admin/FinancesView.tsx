import React, { useState, useMemo } from 'react';
import { useAppData } from '../../App';
import { FinancialRecord } from '../../types';
import { DollarSign, TrendingUp, TrendingDown, PlusCircle } from 'lucide-react';

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


// Form for adding a financial record
interface FinanceFormProps {
    onSave: (record: Omit<FinancialRecord, 'id'>) => void;
    onCancel: () => void;
}
const FinanceForm: React.FC<FinanceFormProps> = ({ onSave, onCancel }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState<'income' | 'expense'>('income');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalAmount = type === 'expense' ? -Math.abs(Number(amount)) : Math.abs(Number(amount));
        onSave({
            description,
            amount: finalAmount,
            type,
            date: new Date(date),
        });
    };
    
    return (
         <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-stone-600">Descripción</label>
                <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="mt-1 block w-full border-stone-300 rounded-md shadow-sm" required />
            </div>
             <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-stone-600">Monto (MXN)</label>
                    <input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} className="mt-1 block w-full border-stone-300 rounded-md shadow-sm" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-stone-600">Tipo</label>
                    <select value={type} onChange={e => setType(e.target.value as 'income' | 'expense')} className="mt-1 block w-full border-stone-300 rounded-md shadow-sm">
                        <option value="income">Ingreso</option>
                        <option value="expense">Gasto</option>
                    </select>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-stone-600">Fecha</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 block w-full border-stone-300 rounded-md shadow-sm" required />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-stone-200 text-stone-700 rounded-md hover:bg-stone-300">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700">Guardar Registro</button>
            </div>
        </form>
    );
};


const FinancesView: React.FC = () => {
    const { financialRecords, setFinancialRecords } = useAppData();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const summary = useMemo(() => {
        const income = financialRecords
            .filter(r => r.type === 'income')
            .reduce((sum, r) => sum + r.amount, 0);
        const expense = financialRecords
            .filter(r => r.type === 'expense')
            .reduce((sum, r) => sum + r.amount, 0);
        const balance = income + expense; // expense is negative
        return { income, expense, balance };
    }, [financialRecords]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
    };
    
    const handleSaveRecord = (record: Omit<FinancialRecord, 'id'>) => {
        const newRecord: FinancialRecord = {
            ...record,
            id: `fin-${Date.now()}`
        };
        setFinancialRecords(prev => [newRecord, ...prev]);
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-stone-800">Finanzas</h1>
                <p className="text-stone-500 mt-1">Revisa la salud financiera del estudio.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm flex items-center">
                    <div className="p-3 rounded-full bg-green-100 mr-4">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm text-stone-500">Ingresos Totales</p>
                        <p className="text-2xl font-bold text-stone-800">{formatCurrency(summary.income)}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm flex items-center">
                    <div className="p-3 rounded-full bg-red-100 mr-4">
                        <TrendingDown className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                        <p className="text-sm text-stone-500">Gastos Totales</p>
                        <p className="text-2xl font-bold text-stone-800">{formatCurrency(Math.abs(summary.expense))}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm flex items-center">
                    <div className="p-3 rounded-full bg-teal-100 mr-4">
                        <DollarSign className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                        <p className="text-sm text-stone-500">Balance Neto</p>
                        <p className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-stone-800' : 'text-red-600'}`}>
                            {formatCurrency(summary.balance)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
                 <div className="flex justify-between items-center mb-4 px-2">
                    <h2 className="text-xl font-bold text-stone-700">Transacciones</h2>
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg shadow-md hover:bg-teal-700 transition-colors">
                        <PlusCircle className="w-5 h-5 mr-2" />
                        Añadir Registro
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-stone-600">
                        <thead className="text-xs text-stone-700 uppercase bg-stone-100">
                            <tr>
                                <th scope="col" className="px-6 py-3">Fecha</th>
                                <th scope="col" className="px-6 py-3">Descripción</th>
                                <th scope="col" className="px-6 py-3 text-center">Tipo</th>
                                <th scope="col" className="px-6 py-3 text-right">Monto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {financialRecords.sort((a,b) => b.date.getTime() - a.date.getTime()).map(record => (
                                <tr key={record.id} className="bg-white border-b hover:bg-stone-50">
                                    <td className="px-6 py-4">{record.date.toLocaleDateString('es-MX')}</td>
                                    <td className="px-6 py-4 font-medium text-stone-900">{record.description}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            record.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {record.type === 'income' ? 'Ingreso' : 'Gasto'}
                                        </span>
                                    </td>
                                    <td className={`px-6 py-4 text-right font-semibold ${record.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                        {formatCurrency(record.amount)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

             <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Añadir Registro Financiero">
                <FinanceForm 
                    onSave={handleSaveRecord}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default FinancesView;