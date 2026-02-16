
import React, { useState, useEffect } from 'react';
import { House, UserRole } from '../../types';
import { MOCK_HOUSES } from '../../utils/mockData';
import { db } from '../../services/firebase';
import { 
  Plus, Search, MoreVertical, Upload, CheckCircle, XCircle, Eye, Edit, Trash, X, Phone, User as UserIcon
} from '../common/Icons';

const HouseManagement: React.FC = () => {
  const [houses, setHouses] = useState<House[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState<House | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.CLIENTE);

  // Form states
  const [formData, setFormData] = useState({
    id: '',
    ownerName: '',
    phoneNumber: '',
    secondaryPhone: '',
    reference: '',
    meterId: '',
    password: 'welcome'
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserRole(user.role);
    }

    db.get('houses').then(data => {
      setHouses(data.length > 0 ? data : MOCK_HOUSES);
    });

    const handleSync = () => {
      db.get('houses').then(setHouses);
    };
    window.addEventListener('sync-complete', handleSync);
    return () => window.removeEventListener('sync-complete', handleSync);
  }, []);

  const isAdmin = userRole === UserRole.ADMIN;

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    
    let updatedHouses: House[];
    if (isEditing) {
      updatedHouses = houses.map(h => h.id === isEditing.id ? { ...isEditing, ...formData } : h);
    } else {
      const newHouse: House = {
        ...formData,
        status: 'active'
      };
      updatedHouses = [...houses, newHouse];
    }
    
    setHouses(updatedHouses);
    await db.save('houses', updatedHouses); // Sincroniza com a nuvem (Resolve Mobile -> Laptop)
    
    setShowModal(false);
    setIsEditing(null);
    setFormData({ id: '', ownerName: '', phoneNumber: '', secondaryPhone: '', reference: '', meterId: '', password: 'welcome' });
  };

  const toggleHouseStatus = async (id: string) => {
    if (!isAdmin) return alert("Apenas Administradores podem alterar o estado de ativação.");
    const updated = houses.map(h => 
      h.id === id ? { ...h, status: h.status === 'active' ? 'inactive' : 'active' } as House : h
    );
    setHouses(updated);
    await db.save('houses', updated);
  };

  const deleteHouse = async (id: string) => {
    if (!isAdmin) return;
    if (window.confirm('Tem certeza que deseja eliminar este cliente?')) {
      const updated = houses.filter(h => h.id !== id);
      setHouses(updated);
      await db.save('houses', updated);
      setActiveMenu(null);
    }
  };

  const startEdit = (house: House) => {
    if (!isAdmin) return;
    setIsEditing(house);
    setFormData({
      id: house.id,
      ownerName: house.ownerName,
      phoneNumber: house.phoneNumber,
      secondaryPhone: house.secondaryPhone || '',
      reference: house.reference,
      meterId: house.meterId,
      password: house.password || 'welcome'
    });
    setShowModal(true);
    setActiveMenu(null);
  };

  const filteredHouses = houses.filter(h => 
    h.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    h.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Gestão de Casas / Clientes</h1>
          <p className="text-gray-500">Base de dados centralizada - Santa Isabel 2026</p>
        </div>
        
        {isAdmin && (
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => { setIsEditing(null); setShowModal(true); }}
              className="flex items-center bg-primary text-white px-6 py-3 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              NOVA CASA
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl border-2 border-gray-50 overflow-hidden">
        <div className="p-6 border-b flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/30">
          <div className="relative w-full md:w-[30rem]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Pesquisar por Nome ou ID A106..." 
              className="w-full pl-12 pr-6 py-3.5 border-2 border-gray-100 rounded-2xl outline-none focus:border-secondary transition-all font-medium text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white border-b text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="px-8 py-5">ID / Contador</th>
                <th className="px-8 py-5">Proprietário</th>
                <th className="px-8 py-5">Contactos</th>
                <th className="px-8 py-5">Estado</th>
                <th className="px-8 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredHouses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-gray-400 italic">Nenhum cliente encontrado.</td>
                </tr>
              ) : filteredHouses.map((house) => (
                <tr key={house.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="font-black text-gray-900 text-lg">{house.id}</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{house.meterId}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="font-bold text-gray-800">{house.ownerName}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col text-sm">
                      <div className="flex items-center text-primary font-bold">
                        <Phone className="w-3 h-3 mr-1" /> {house.phoneNumber}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <button 
                      onClick={() => toggleHouseStatus(house.id)}
                      disabled={!isAdmin}
                      className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                        house.status === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {house.status === 'active' ? 'Ativo' : 'Inativo'}
                    </button>
                  </td>
                  <td className="px-8 py-6 text-right relative">
                    <button 
                      onClick={() => setActiveMenu(activeMenu === house.id ? null : house.id)}
                      className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-gray-200 transition-all shadow-sm"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>
                    {activeMenu === house.id && isAdmin && (
                      <div className="absolute right-16 top-0 w-48 bg-white shadow-2xl rounded-2xl border-2 border-gray-50 z-50 py-2">
                        <button onClick={() => startEdit(house)} className="flex items-center w-full px-4 py-3 text-xs font-black text-gray-600 hover:bg-gray-50">
                          <Edit className="w-4 h-4 mr-3 text-orange-500" /> EDITAR
                        </button>
                        <button onClick={() => deleteHouse(house.id)} className="flex items-center w-full px-4 py-3 text-xs font-black text-red-600 hover:bg-red-50">
                          <Trash className="w-4 h-4 mr-3" /> ELIMINAR
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && isAdmin && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-2 sm:p-4 overflow-hidden">
          <div className="bg-white w-full max-w-3xl rounded-[2.5rem] shadow-2xl flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-300">
            <div className="bg-primary p-6 sm:p-8 text-white flex justify-between items-center shrink-0">
              <h2 className="text-xl sm:text-2xl font-black">{isEditing ? 'Editar Cliente' : 'Novo Cliente'}</h2>
              <button onClick={() => setShowModal(false)} className="bg-white/10 p-2 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 sm:p-10 flex-1 overflow-y-auto space-y-6 sm:space-y-8 no-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">ID da Casa</label>
                      <input type="text" required className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-secondary focus:bg-white rounded-2xl outline-none font-bold text-sm" value={formData.id} disabled={!!isEditing} onChange={(e) => setFormData({...formData, id: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Nome Proprietário</label>
                      <input type="text" required className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-secondary focus:bg-white rounded-2xl outline-none font-bold text-sm" value={formData.ownerName} onChange={(e) => setFormData({...formData, ownerName: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">ID Contador</label>
                      <input type="text" required className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-secondary focus:bg-white rounded-2xl outline-none font-bold text-sm" value={formData.meterId} onChange={(e) => setFormData({...formData, meterId: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Telefone</label>
                      <input type="text" required className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-secondary focus:bg-white rounded-2xl outline-none font-bold text-sm" value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 sm:p-10 bg-gray-50 flex flex-col sm:flex-row justify-end items-center gap-3 sm:gap-4 shrink-0 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="w-full sm:w-auto px-8 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px]">CANCELAR</button>
                <button type="submit" className="w-full sm:w-auto bg-primary text-white px-12 py-4 rounded-2xl font-black shadow-xl uppercase tracking-widest text-[10px]">GUARDAR DADOS</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HouseManagement;
