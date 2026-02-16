
import React, { useState, useEffect } from 'react';
import { MOCK_HOUSES } from '../../utils/mockData';
import { House } from '../../types';
import { 
  MessageCircle, 
  FileText, 
  Search, 
  Send, 
  Check, 
  Phone, 
  History, 
  User as UserIcon, 
  X, 
  Settings, 
  Clock, 
  CheckCircle,
  TabletSmartphone,
  Smartphone
} from '../common/Icons';

const IssuanceManagement: React.FC = () => {
  const [houses, setHouses] = useState<House[]>([]);
  const [selectedHouse, setSelectedHouse] = useState<string>('all');
  const [messageType, setMessageType] = useState<'whatsapp' | 'sms'>('whatsapp');
  const [alertContent, setAlertContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [viewingHistory, setViewingHistory] = useState<string | null>(null);
  const SUPPORT_CONTACT = "843307646";

  useEffect(() => {
    const stored = localStorage.getItem('db_houses');
    setHouses(stored ? JSON.parse(stored) : MOCK_HOUSES);
  }, []);

  const sendAlert = () => {
    if (selectedHouse === 'all') {
      alert('ENVIANDO ALERTA GERAL: Todos os clientes serão notificados via ' + messageType.toUpperCase());
      return;
    }

    const house = houses.find(h => h.id === selectedHouse);
    if (!house) return;

    const finalMessage = alertContent || `🏠 ÁGUA MALI\n\nOlá ${house.ownerName},\n\nInformamos que sua fatura de Fevereiro/2026 já está disponível.\n\nApoio/Dúvidas: ${SUPPORT_CONTACT}`;

    if (messageType === 'whatsapp') {
      const msg = encodeURIComponent(finalMessage);
      const cleanPhone = house.phoneNumber.replace(/\D/g, '');
      window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
    } else {
      alert(`SMS ENVIADO PARA ${house.phoneNumber}:\n\n${finalMessage}`);
    }
  };

  const filteredHouses = houses.filter(h => 
    h.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    h.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Emissão & Alertas</h1>
          <p className="text-gray-500 font-medium italic">Comunicação multicanal (WhatsApp + SMS).</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] shadow-2xl border-2 border-gray-50 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest px-2">Cliente Destino</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Pesquisar ID/Nome..."
                  className="w-full pl-12 pr-6 py-4 border-2 border-gray-100 rounded-2xl mb-4 outline-none focus:border-secondary transition-all font-bold"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                className="w-full p-4 border-2 border-gray-100 rounded-2xl outline-none focus:border-secondary bg-gray-50 font-black text-sm text-gray-700"
                value={selectedHouse}
                onChange={(e) => setSelectedHouse(e.target.value)}
              >
                <option value="all">TODOS OS CLIENTES</option>
                {filteredHouses.map(h => (
                  <option key={h.id} value={h.id}>{h.id} - {h.ownerName}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-4">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest px-2">Canal de Envio</label>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setMessageType('whatsapp')}
                  className={`flex items-center justify-center p-5 rounded-2xl border-2 transition-all ${
                    messageType === 'whatsapp' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-gray-50 border-transparent text-gray-400'
                  }`}
                >
                  <MessageCircle className="w-6 h-6 mr-3" />
                  <span className="font-black text-xs">WHATSAPP</span>
                </button>
                <button 
                  onClick={() => setMessageType('sms')}
                  className={`flex items-center justify-center p-5 rounded-2xl border-2 transition-all ${
                    messageType === 'sms' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-gray-50 border-transparent text-gray-400'
                  }`}
                >
                  <Smartphone className="w-6 h-6 mr-3" />
                  <span className="font-black text-xs">SMS</span>
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest px-2">Mensagem do Alerta</label>
            <textarea 
              rows={6}
              className="w-full p-6 border-2 border-gray-50 rounded-[2rem] outline-none focus:border-secondary bg-gray-50 placeholder-gray-300 font-bold text-gray-700 resize-none"
              placeholder="Escreva a mensagem aqui..."
              value={alertContent}
              onChange={(e) => setAlertContent(e.target.value)}
            ></textarea>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              onClick={sendAlert}
              className={`flex items-center px-10 py-5 rounded-3xl font-black text-sm text-white shadow-2xl transition-all ${
                messageType === 'whatsapp' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              ENVIAR AGORA
              <Send className="w-5 h-5 ml-4" />
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-primary p-8 rounded-[3rem] text-white relative overflow-hidden shadow-2xl group">
            <div className="relative z-10">
              <h3 className="text-xl font-black mb-2 tracking-tight">Suporte Água Mali</h3>
              <p className="text-blue-100 text-xs mb-8 font-medium italic">Gestão do contacto de apoio: {SUPPORT_CONTACT}</p>
              <button 
                onClick={() => setShowSupportModal(true)}
                className="bg-white/10 hover:bg-white/20 border border-white/20 w-full py-4 rounded-2xl font-black text-[10px] tracking-widest transition-all uppercase"
              >
                EDITAR CONTACTO
              </button>
            </div>
            <Settings className="absolute -bottom-10 -right-10 w-40 h-40 opacity-10 group-hover:rotate-90 transition-transform duration-1000" />
          </div>
        </div>
      </div>

      {/* Support Settings Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[110] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 bg-primary text-white flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <Settings className="w-6 h-6" />
                <h3 className="text-xl font-black">Contacto de Apoio</h3>
              </div>
              <button onClick={() => setShowSupportModal(false)} className="bg-white/10 p-2 rounded-full"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Número Oficial (SMS/WhatsApp)</label>
                <input type="text" defaultValue={SUPPORT_CONTACT} className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl font-bold outline-none focus:border-secondary" />
              </div>
            </div>
            <div className="p-8 bg-gray-50 flex justify-end">
              <button onClick={() => setShowSupportModal(false)} className="bg-primary text-white px-10 py-4 rounded-2xl font-black shadow-xl uppercase text-xs tracking-widest">GUARDAR</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssuanceManagement;
