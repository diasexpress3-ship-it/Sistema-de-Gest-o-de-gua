
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../../types';
import { MOCK_USERS } from '../../utils/mockData';
import { 
  UserPlus, Search, Edit, Trash, CheckCircle, X, Mail, Phone, Shield, Lock, Smartphone, Eye, EyeOff 
} from '../common/Icons';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState<User | null>(null);
  const [showStaffPassword, setShowStaffPassword] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.CLIENTE);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    username: '',
    password: '',
    role: UserRole.LEITOR
  });

  useEffect(() => {
    const storedAuth = localStorage.getItem('auth_user');
    if (storedAuth) {
      setUserRole(JSON.parse(storedAuth).role);
    }

    const stored = localStorage.getItem('db_users');
    if (stored) {
      setUsers(JSON.parse(stored));
    } else {
      // Add default passwords to mock users if they don't have them
      const usersWithPass = MOCK_USERS.map(u => ({
        ...u,
        password: u.id === 'A106' ? 'Sahombe13' : 'welcome'
      }));
      setUsers(usersWithPass);
      localStorage.setItem('db_users', JSON.stringify(usersWithPass));
    }
  }, []);

  const isAdmin = userRole === UserRole.ADMIN;

  const saveToStorage = (updatedUsers: User[]) => {
    if (!isAdmin) return;
    setUsers(updatedUsers);
    localStorage.setItem('db_users', JSON.stringify(updatedUsers));
  };

  const handleOpenAdd = () => {
    if (!isAdmin) return;
    setIsEditing(null);
    setShowStaffPassword(false);
    setFormData({ name: '', email: '', phoneNumber: '', username: '', password: '', role: UserRole.LEITOR });
    setShowModal(true);
  };

  const handleOpenEdit = (u: User) => {
    if (!isAdmin) return;
    setIsEditing(u);
    setShowStaffPassword(false);
    setFormData({
      name: u.name,
      email: u.email,
      phoneNumber: u.phoneNumber,
      username: u.id,
      password: u.password || 'welcome',
      role: u.role
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (!isAdmin) return;
    if (id === 'A106') {
      alert('O Administrador Master não pode ser removido.');
      return;
    }
    if (window.confirm('Eliminar acesso deste colaborador?')) {
      const updated = users.filter(u => u.id !== id);
      saveToStorage(updated);
    }
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    let updatedUsers: User[];

    if (isEditing) {
      updatedUsers = users.map(u => 
        u.id === isEditing.id 
          ? { 
              ...u, 
              name: formData.name, 
              email: formData.email, 
              phoneNumber: formData.phoneNumber,
              role: formData.role,
              password: formData.password
            } 
          : u
      );
    } else {
      const newUser: User = {
        id: formData.username || `u${Date.now()}`,
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        role: formData.role,
        status: 'active',
        password: formData.password
      };
      updatedUsers = [...users, newUser];
    }

    saveToStorage(updatedUsers);
    setShowModal(false);
  };

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Equipa Água Mali</h1>
          <p className="text-gray-500 font-medium italic">Lista de Colaboradores e Níveis de Acesso</p>
        </div>
        
        {isAdmin && (
          <button 
            onClick={handleOpenAdd}
            className="w-full md:w-auto bg-primary text-white px-8 py-4 rounded-[1.5rem] font-black text-sm flex items-center justify-center shadow-xl hover:scale-105 transition-all"
          >
            <UserPlus className="w-5 h-5 mr-3" />
            NOVO STAFF
          </button>
        )}
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl border-2 border-gray-50 overflow-hidden">
        <div className="p-6 border-b flex flex-col md:flex-row justify-between items-center bg-gray-50/50 gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Filtrar por nome..." 
              className="w-full pl-12 pr-6 py-3.5 border-2 border-gray-100 rounded-2xl outline-none focus:border-secondary transition-all font-medium text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="px-4 py-2 bg-white rounded-xl border font-black text-[10px] text-gray-400 uppercase tracking-widest">
            Total Staff: <span className="text-secondary">{filteredUsers.length}</span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white border-b text-gray-400 text-[10px] font-black uppercase tracking-widest">
                <th className="px-8 py-6">Colaborador</th>
                <th className="px-8 py-6">Contacto</th>
                <th className="px-8 py-6">Papel / Acesso</th>
                <th className="px-8 py-6">Estado</th>
                <th className="px-8 py-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-blue-50/20 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center">
                      <div className="w-11 h-11 rounded-2xl overflow-hidden mr-4 border-2 border-primary/10 shadow-sm shrink-0">
                        <img src={u.avatar || `https://ui-avatars.com/api/?name=${u.name}&background=0056D2&color=fff`} className="w-full h-full object-cover" alt={u.name} />
                      </div>
                      <div>
                        <p className="font-black text-gray-900 text-sm">{u.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase truncate max-w-[150px]">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center text-sm font-bold text-gray-600">
                      <Phone className="w-4 h-4 mr-2 text-primary shrink-0" />
                      {u.phoneNumber}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase ${
                      u.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-700' : 
                      u.role === UserRole.TECNICO ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      <Shield className="w-3 h-3 mr-2" />
                      {u.role}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="flex items-center text-green-600 text-[10px] font-black uppercase tracking-widest">
                      <CheckCircle className="w-3 h-3 mr-1.5" /> Ativo
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right space-x-2">
                    {isAdmin ? (
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => handleOpenEdit(u)}
                          className="p-2.5 text-gray-400 hover:text-primary transition-all bg-white border border-gray-100 rounded-xl"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(u.id)}
                          className="p-2.5 text-gray-400 hover:text-red-500 transition-all bg-white border border-gray-100 rounded-xl"
                        >
                          <Trash className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-gray-300 font-black uppercase italic">Consulta</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Modal - Responsive Adjustments */}
      {showModal && isAdmin && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-2 sm:p-4 overflow-hidden">
          <div className="bg-white w-full max-w-2xl rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 sm:p-8 bg-secondary text-white flex justify-between items-center relative shrink-0">
              <div className="relative z-10">
                <h3 className="text-xl sm:text-2xl font-black">{isEditing ? 'Editar Colaborador' : 'Adicionar Staff'}</h3>
                <p className="text-blue-100 text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-1">Configuração de Acesso</p>
              </div>
              <button onClick={() => setShowModal(false)} className="hover:rotate-90 transition-all bg-white/10 p-2 rounded-full text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSaveStaff} className="flex flex-col flex-1 overflow-hidden">
              {/* Scrollable Content Area */}
              <div className="p-6 sm:p-10 flex-1 overflow-y-auto space-y-6 sm:space-y-8 no-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2">Nome Completo</label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl outline-none focus:border-secondary transition-all font-bold text-sm" 
                      placeholder="Ex: João da Silva"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2">E-mail Corporativo</label>
                    <input 
                      type="email" 
                      required
                      className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl outline-none focus:border-secondary transition-all font-bold text-sm" 
                      placeholder="email@diasexpress.co.mz" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2">ID Acesso (Username)</label>
                    <div className="relative">
                      <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                      <input 
                        type="text" 
                        required
                        disabled={!!isEditing}
                        className={`w-full pl-12 pr-5 py-4 border-2 border-gray-100 rounded-2xl outline-none focus:border-secondary transition-all font-bold text-sm ${isEditing ? 'bg-gray-50 opacity-60' : ''}`} 
                        placeholder="joao.dex" 
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2">Papel / Função</label>
                    <select 
                      className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl outline-none focus:border-secondary transition-all font-bold text-sm bg-white"
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value as UserRole})}
                    >
                      <option value={UserRole.LEITOR}>Leitor</option>
                      <option value={UserRole.TECNICO}>Técnico</option>
                      <option value={UserRole.ADMIN}>Administrador</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2">Palavra-passe</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                      <input 
                        type={showStaffPassword ? "text" : "password"} 
                        required
                        className="w-full pl-12 pr-12 py-4 border-2 border-gray-100 rounded-2xl outline-none focus:border-secondary transition-all font-bold text-sm" 
                        placeholder="••••••••" 
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                      />
                      <button 
                        type="button"
                        onClick={() => setShowStaffPassword(!showStaffPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-secondary transition-colors"
                      >
                        {showStaffPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2">Telefone</label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl outline-none focus:border-secondary transition-all font-bold text-sm" 
                      placeholder="840000000" 
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Sticky Footer */}
              <div className="p-6 sm:p-10 bg-gray-50 flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 shrink-0 border-t">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="w-full sm:w-auto px-8 py-4 font-black text-gray-400 uppercase text-[10px] tracking-widest"
                >
                  CANCELAR
                </button>
                <button 
                  type="submit" 
                  className="w-full sm:w-auto bg-primary text-white px-12 py-4 rounded-2xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all uppercase text-[10px] tracking-widest"
                >
                  {isEditing ? 'ACTUALIZAR' : 'GUARDAR STAFF'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
