
import React, { useState } from 'react';
import { Leak, User, UserRole } from '../../types';
import { MOCK_LEAKS, MOCK_USERS } from '../../utils/mockData';
import { AlertTriangle, MapPin, Clock, User as UserIcon, CheckCircle, MessageCircle, X, Check } from '../common/Icons';

const LeakManagement: React.FC = () => {
  const [leaks, setLeaks] = useState<Leak[]>(MOCK_LEAKS);
  const [selectedLeak, setSelectedLeak] = useState<Leak | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const technicians = MOCK_USERS.filter(u => u.role === UserRole.TECNICO);

  const handleAssign = (leakId: string, technicianId: string) => {
    setLeaks(prev => prev.map(l => 
      l.id === leakId ? { ...l, status: 'assigned', technicianId } : l
    ));
    setShowAssignModal(false);
    
    const tech = technicians.find(t => t.id === technicianId);
    alert(`Assistência Atribuída!\nO técnico ${tech?.name} foi notificado via SMS/WhatsApp para intervir no local.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Gestão Técnica de Fugas</h1>
          <p className="text-gray-500">Monitorização em tempo real do Bairro Santa Isabel (2026).</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {leaks.map((leak) => (
          <div key={leak.id} className="bg-white p-8 rounded-[2.5rem] shadow-xl border-2 border-transparent hover:border-red-500/10 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="flex justify-between items-start mb-6">
              <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                leak.severity === 'critical' ? 'bg-red-600 text-white' : 'bg-orange-100 text-orange-700'
              }`}>
                Gravidade {leak.severity}
              </div>
              <span className="text-[10px] text-gray-400 flex items-center font-bold tracking-widest uppercase">
                <Clock className="w-3 h-3 mr-2" /> {leak.reportedAt}
              </span>
            </div>

            <h3 className="text-2xl font-black text-gray-900 mb-2">
              {leak.type === 'public' ? 'Ruptura Via Pública' : 'Fuga Residencial'}
            </h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed font-medium">"{leak.description}"</p>
            
            <div className="flex items-center text-sm text-gray-700 mb-8 bg-gray-50 p-5 rounded-3xl border-2 border-gray-100/50">
              <MapPin className="w-5 h-5 mr-3 text-red-500" />
              <span className="font-bold">{leak.location}</span>
            </div>

            <div className="flex items-center justify-between pt-6 border-t-2 border-gray-50">
              <div className="flex items-center">
                {leak.technicianId ? (
                  <div className="flex items-center bg-green-50 px-4 py-2 rounded-2xl text-green-700 font-black text-[10px] tracking-widest uppercase border-2 border-green-100">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Atribuído a {technicians.find(t => t.id === leak.technicianId)?.name}
                  </div>
                ) : (
                  <div className="text-red-600 font-black text-[10px] tracking-widest uppercase flex items-center italic">
                    <AlertTriangle className="w-4 h-4 mr-2" /> Aguardando Técnico
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => { setSelectedLeak(leak); setShowAssignModal(true); }}
                className="bg-primary text-white px-6 py-3 rounded-2xl text-xs font-black tracking-widest uppercase shadow-lg hover:scale-105 transition-all"
              >
                ADD ATRIBUTO TÉCNICO
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Assignment Modal */}
      {showAssignModal && selectedLeak && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[110] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 bg-primary text-white relative">
              <h3 className="text-xl font-black">Designar Técnico</h3>
              <p className="text-blue-200 text-xs font-medium uppercase tracking-widest mt-1">Ocorrência Protocolo: {selectedLeak.id}</p>
              <button onClick={() => setShowAssignModal(false)} className="absolute top-6 right-6 hover:rotate-90 transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Técnicos de Campo Disponíveis:</p>
              {technicians.map(tech => (
                <button 
                  key={tech.id}
                  onClick={() => handleAssign(selectedLeak.id, tech.id)}
                  className="w-full flex items-center justify-between p-5 rounded-3xl border-2 border-gray-100 hover:border-secondary hover:bg-blue-50 transition-all text-left group"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black mr-4 group-hover:bg-primary group-hover:text-white transition-all">
                      {tech.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-gray-900 text-sm">{tech.name}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Equipa de Santa Isabel Norte</p>
                    </div>
                  </div>
                  <Check className="w-5 h-5 text-gray-100 group-hover:text-secondary transition-all" />
                </button>
              ))}
            </div>
            <div className="p-6 bg-gray-50 text-center">
              <p className="text-[10px] text-gray-400 font-medium">O técnico selecionado receberá um SMS com as coordenadas GPS do local.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeakManagement;
