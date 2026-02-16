
import React, { useState, useEffect } from 'react';
import { House, UserRole } from '../../types';
import { MOCK_HOUSES } from '../../utils/mockData';
import { db } from '../../services/firebase';
import { 
  Plus, Search, MoreVertical, Upload, CheckCircle, XCircle, Eye, Edit, Trash, X, Phone, User as UserIcon, Lock
} from '../common/Icons';

const HouseManagement: React.FC = () => {
  const [houses, setHouses] = useState<House[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState<House | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.CLIENTE);

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
      setUserRole(JSON.parse(storedUser).role);
    }

    // Carregar dados iniciais respeitando a persistência (não forçar Mocks se já houver sync)
    db.get('houses').then(data => {
      if (data) {
        setHouses(data);
      } else {
        setHouses(MOCK_HOUSES);
        db.save('houses', MOCK_HOUSES);
      }
    });

    const handleSync = () => {
      db.get('houses').then(data => { if (data) setHouses(data); });
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
    await db.save('houses', updatedHouses);
    
    setShowModal(false);
    setIsEditing(null);
    setFormData({ id: '', ownerName: '', phoneNumber: '', secondaryPhone: '', reference: '', meterId: '', password: 'welcome' });
  };

  const toggleHouseStatus = async (id: string) => {
    if (!isAdmin) return alert("Apenas Administradores podem alterar o estado.");
    const updated = houses.map(h => 
      h.id === id ? { ...h, status: h.status === 'active' ? 'inactive' : 'active' } as House : h
    );
    setHouses(updated);
    await db.save('houses', updated);
  };

  const deleteHouse = async (id: string) => {
    if (!isAdmin) return;
    if (window.confirm('Eliminar permanentemente este cliente e todos os seus dados?')) {
      const updated = houses.filter(h => h.id !== id);
      setHouses(updated);
      // Aqui forçamos a gravação do array filtrado na cloud imediatamente
      await db.save('houses', updated);
      setActiveMenu(null);
      alert("Cliente removido com sucesso de todos os dispositivos.");
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
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Gestão de Casas / Clientes</h1>
          <p className="text-gray-500 font-medium italic">Base de Dados Cloud Sincronizada 2026</p>
        </div>
        
        {isAdmin && (
          <button 
            onClick={() => { setIsEditing(null); setShowModal(true); }}
            className="flex items-center bg-primary text-white px-8 py-4 rounded-[1.5rem] font-black text-sm hover:scale-105 transition-all shadow-xl shadow-orange-100"
          >
            <Plus className="w-5 h-5 mr-3" />
            NOVA CASA
          </button>
        )}
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl border-2 border-gray-50 overflow-hidden">
        <div className="p-8 border-b flex flex-col md:flex-row gap-6 justify-between items-center bg-gray-50/30">
          <div className="relative w-full md:w-[35rem]">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Pesquisar por Nome, ID ou Contador..." 
              className="w-full pl-14 pr-6 py-4 border-2 border-gray-100 rounded-2xl outline-none focus:border-secondary transition-all font-bold text-sm bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white border-b text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="px-10 py-6">Identificação</th>
                <th className="px-10 py-6">Proprietário</th>
                <th className="px-10 py-6">Contacto</th>
                <th className="px-10 py-6">Estado</th>
                <th className="px-10 py-6 text-right">Acções</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredHouses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-10 py-24 text-center text-gray-400 font-medium italic">Nenhum registo ativo encontrado.</td>
                </tr>
              ) : filteredHouses.map((house) => (
                <tr key={house.id} className="hover:bg-blue-50/30 transition-all group">
                  <td className="px-10 py-7">
                    <div className="flex flex-col">
                      <span className="font-black text-secondary text-lg leading-none mb-1">{house.id}</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{house.meterId}</span>
                    </div>
                  </td>
                  <td className="px-10 py-7">
                    <span className="font-black text-gray-800">{house.ownerName}</span>
                  </td>
                  <td className="px-10 py-7">
                    <div className="flex items-center text-sm font-bold text-primary">
                      <Phone className="w-4 h-4 mr-2" /> {house.phoneNumber}
                    </div>
                  </td>
                  <td className="px-10 py-7">
                    <button 
                      onClick={() => toggleHouseStatus(house.id)}
                      disabled={!isAdmin}
                      className={`inline-flex items-center px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                        house.status === 'active' 
                        ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {house.status === 'active' ? '● Activo' : '○ Inativo'}
                    </button>
                  </td>
                  <td className="px-10 py-7 text-right relative">
                    <button 
                      onClick={() => setActiveMenu(activeMenu === house.id ? null : house.id)}
                      className="p-3 hover:bg-white rounded-xl border-2 border-transparent hover:border-gray-100 transition-all"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>
                    {activeMenu === house.id && isAdmin && (
                      <div className="absolute right-20 top-0 w-52 bg-white shadow-2xl rounded-2xl border-2 border-gray-50 z-50 py-3 animate-in fade-in slide-in-from-right-4 duration-200">
                        <button onClick={() => startEdit(house)} className="flex items-center w-full px-5 py-3 text-xs font-black text-gray-600 hover:bg-gray-50 transition-colors">
                          <Edit className="w-4 h-4 mr-3 text-orange-500" /> EDITAR DADOS
                        </button>
                        <div className="h-px bg-gray-50 my-2 mx-4"></div>
                        <button onClick={() => deleteHouse(house.id)} className="flex items-center w-full px-5 py-3 text-xs font-black text-red-600 hover:bg-red-50 transition-colors">
                          <Trash className="w-4 h-4 mr-3" /> ELIMINAR CLIENTE
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-2 sm:p-4 overflow-hidden animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-300 border-4 border-white">
            <div className="bg-secondary p-8 sm:p-10 text-white flex justify-between items-center shrink-0 rounded-t-[2.7rem]">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight">{isEditing ? 'Editar Registo' : 'Novo Cliente / Casa'}</h2>
                <p className="text-blue-100 text-xs font-bold uppercase tracking-[0.2em] mt-1">Configuração de Acesso e Infraestrutura</p>
              </div>
              <button onClick={() => setShowModal(false)} className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-8 sm:p-12 flex-1 overflow-y-auto space-y-8 no-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
                  <div className="space-y-8">
                    <div>
                      <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2">ID do Contrato / Casa</label>
                      <input type="text" required placeholder="Ex: A113" className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent focus:border-secondary focus:bg-white rounded-[1.5rem] outline-none font-black text-secondary transition-all" value={formData.id} disabled={!!isEditing} onChange={(e) => setFormData({...formData, id: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2">Nome do Proprietário Principal</label>
                      <input type="text" required placeholder="Nome Completo" className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent focus:border-secondary focus:bg-white rounded-[1.5rem] outline-none font-bold text-gray-700 transition-all" value={formData.ownerName} onChange={(e) => setFormData({...formData, ownerName: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2">Palavra-Passe de Acesso (Portal)</label>
                      <div className="relative group">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5 group-focus-within:text-primary transition-colors" />
                        <input 
                          type="text" 
                          required 
                          placeholder="Ex: Welcome2026" 
                          className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-[1.5rem] outline-none font-black text-primary transition-all" 
                          value={formData.password} 
                          onChange={(e) => setFormData({...formData, password: e.target.value})} 
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-8">
                    <div>
                      <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2">Número de Série do Contador</label>
                      <input type="text" required placeholder="Ex: CNT-999" className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent focus:border-secondary focus:bg-white rounded-[1.5rem] outline-none font-bold text-gray-700 transition-all" value={formData.meterId} onChange={(e) => setFormData({...formData, meterId: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2">Telefone de Contacto</label>
                      <input type="text" required placeholder="84 000 0000" className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent focus:border-secondary focus:bg-white rounded-[1.5rem] outline-none font-bold text-gray-700 transition-all" value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2">Referência / Localização Manual</label>
                      <textarea rows={2} required className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent focus:border-secondary focus:bg-white rounded-[1.5rem] outline-none font-bold text-gray-700 transition-all resize-none" placeholder="Perto da paragem..." value={formData.reference} onChange={(e) => setFormData({...formData, reference: e.target.value})}></textarea>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-8 sm:p-12 bg-gray-50 flex flex-col sm:flex-row justify-end items-center gap-4 shrink-0 border-t rounded-b-[2.7rem]">
                <button type="button" onClick={() => setShowModal(false)} className="w-full sm:w-auto px-10 py-5 font-black text-gray-400 uppercase tracking-widest text-[10px] hover:text-gray-600 transition-colors">CANCELAR</button>
                <button type="submit" className="w-full sm:w-auto bg-primary text-white px-16 py-5 rounded-[1.5rem] font-black shadow-2xl shadow-orange-200 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-[11px]">
                  {isEditing ? 'ACTUALIZAR REGISTO' : 'EFECTUAR CADASTRO'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HouseManagement;
