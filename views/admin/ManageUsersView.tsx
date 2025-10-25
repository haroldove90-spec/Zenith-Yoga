
import React from 'react';
import { useAppData } from '../../App';
import { User, Role } from '../../types';
import { ShieldCheck, UserCircle, ToggleLeft, ToggleRight } from 'lucide-react';

const ManageUsersView: React.FC = () => {
    const { users, setUsers } = useAppData();

    const toggleMembership = (userId: string) => {
        setUsers(users.map(user => 
            user.id === userId 
                ? { ...user, membership: user.membership === 'active' ? 'inactive' : 'active' }
                : user
        ));
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-stone-800">Gestionar Usuarios</h1>
                <p className="text-stone-500 mt-1">Ver y administrar los usuarios del estudio.</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-stone-600">
                        <thead className="text-xs text-stone-700 uppercase bg-stone-100">
                            <tr>
                                <th scope="col" className="px-6 py-3">Usuario</th>
                                <th scope="col" className="px-6 py-3">Email</th>
                                <th scope="col" className="px-6 py-3 text-center">Rol</th>
                                <th scope="col" className="px-6 py-3 text-center">Membresía</th>
                                <th scope="col" className="px-6 py-3 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="bg-white border-b hover:bg-stone-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full mr-4" />
                                            <span className="font-medium text-stone-900">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                                            user.role === Role.ADMIN ? 'bg-teal-100 text-teal-800' : 'bg-stone-100 text-stone-800'
                                        }`}>
                                            {user.role === Role.ADMIN ? <ShieldCheck className="w-3 h-3 mr-1" /> : <UserCircle className="w-3 h-3 mr-1" />}
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                         <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            user.membership === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {user.membership === 'active' ? 'Activa' : 'Inactiva'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button onClick={() => toggleMembership(user.id)} className="text-stone-500 hover:text-teal-600" title={user.membership === 'active' ? 'Desactivar membresía' : 'Activar membresía'}>
                                            {user.membership === 'active' ? <ToggleRight className="w-6 h-6 text-green-500"/> : <ToggleLeft className="w-6 h-6 text-red-500"/> }
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageUsersView;