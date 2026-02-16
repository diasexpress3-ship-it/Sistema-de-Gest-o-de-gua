
import React, { useState } from 'react';
import { AlertTriangle, MapPin, CheckCircle, Clock, Smartphone, History, Hammer, Check, X } from '../common/Icons';

interface WorkOrder {
  id: string;
  title: string;
  description: string;
  location: string;
  status: 'pending' | 'in_progress' | 'completed';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timeStarted?: string;
  timeFinished?: string;
}

const TechnicianDashboard: React.FC = () => {
  const [orders, setOrders] = useState<WorkOrder[]>([
    {
      id: 'WO-2026-001',
      title: 'Ruptura Tubagem Pública',
      description: 'Fuga de grande porte detectada perto do Mercado Kampos. Prioridade máxima para evitar perdas.',
      location: 'Santa Isabel Norte, Travessa B',
      status: 'pending',
      severity: 'high'
    },
    {
      id: 'WO-2026-002',
      title: 'Substituição de Contador',
      description: 'Contador com sinais de adulteração na residência A113.',
      location: 'Rua da Dona Ana, Lote 45',
      status: 'pending',
      severity: 'medium'
    }
  ]);

  const handleStartRepair = (id: string) => {
    const time = new Date().toLocaleTimeString();
    setOrders(prev => prev.map(o => 
      o.id === id ? { ...o, status: 'in_progress', timeStarted: time } : o
    ));
    alert(`🔨 REPARO INICIADO\nOrdem: ${id}\nInício: ${time}\nA equipa técnica está agora activa neste local.`);
  };

  const handleFinishRepair = (id: string) => {
    const time = new Date().toLocaleTimeString();
    setOrders(prev => prev.map(o => 
      o.id === id ? { ...o, status: 'completed', timeFinished: time } : o
    ));
    alert(`✅ INTERVENÇÃO CONCLUÍDA\nOrdem: ${id}\nConclusão: ${time}\nRegisto enviado para a base de dados central.`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-secondary tracking-tight uppercase">Gestão de Campo</h1>
          <p className="text-gray-500 font-medium italic">Ordens de Serviço Técnicas - Santa Isabel 2026</p>
        </div>
        <div className="flex space-x-3">
          <div className="bg-white px-5 py-3 rounded-2xl border-2 border-gray-50 shadow-sm flex items-center text-[10px] font-black tracking-[0.2em] uppercase text-primary">
            <span className="w-2.5 h-2.5 bg-primary rounded-full mr-3 animate-pulse"></span>
            Técnico Online
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-secondary p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest mb-4 opacity-70">Desempenho Semanal</p>
            <h3 className="text-3xl font-black mb-8 tracking-tighter">12 Reparos Concluídos</h3>
            <div className="flex items-center text-[10px] font-black bg-white/10 w-fit px-4 py-2 rounded-xl backdrop-blur-md border border-white/10">
              <History className="w-4 h-4 mr-2" />
              <span>TEMPO MÉDIO: 45 MIN</span>
            </div>
          </div>
          <Hammer className="absolute -bottom-10 -right-10 w-48 h-48 opacity-5 group-hover:scale-110 transition-transform duration-1000" />
        </div>

        <div className="bg-white p-10 rounded-[3rem] shadow-xl border-2 border-gray-50 flex flex-col justify-center">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-red-50 p-4 rounded-2xl text-red-500"><AlertTriangle className="w-6 h-6" /></div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Atenção Prioritária</p>
              <p className="text-xl font-black text-secondary uppercase">2 Fugas Críticas</p>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-500 italic">Intervenções imediatas necessárias para evitar o desperdício em massa no bairro.</p>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-black text-gray-900 px-4">Ordens de Serviço Activas</h2>
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order) => (
            <div key={order.id} className={`bg-white p-8 rounded-[3.5rem] shadow-xl border-4 transition-all ${
              order.status === 'completed' ? 'border-green-100 bg-green-50/20' : 
              order.status === 'in_progress' ? 'border-primary/20 bg-orange-50/20' : 'border-white'
            }`}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="flex items-center space-x-4">
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${
                    order.status === 'completed' ? 'bg-green-600 text-white' :
                    order.status === 'in_progress' ? 'bg-primary text-white animate-pulse' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {order.status === 'completed' ? '✓ CONCLUÍDO' : 
                     order.status === 'in_progress' ? '🔨 EM PROGRESSO' : '⏳ PENDENTE'}
                  </div>
                  <span className="text-[10px] text-gray-400 font-black tracking-widest uppercase">{order.id}</span>
                </div>
                {order.timeStarted && (
                  <span className="text-[10px] text-primary font-black uppercase tracking-widest flex items-center">
                    <Clock className="w-3 h-3 mr-2" /> Início: {order.timeStarted}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="text-2xl font-black text-gray-900">{order.title}</h3>
                  <p className="text-gray-600 font-medium leading-relaxed">{order.description}</p>
                  <div className="flex items-center text-sm font-bold text-gray-500 bg-gray-50/50 p-4 rounded-2xl w-fit">
                    <MapPin className="w-5 h-5 mr-3 text-red-500" />
                    {order.location}
                  </div>
                </div>

                <div className="flex flex-col space-y-4">
                  {order.status === 'pending' && (
                    <button 
                      onClick={() => handleStartRepair(order.id)}
                      className="w-full bg-primary text-white py-5 rounded-[2rem] font-black text-xs tracking-[0.2em] uppercase shadow-xl hover:scale-105 transition-all"
                    >
                      INICIAR REPARO
                    </button>
                  )}
                  {order.status === 'in_progress' && (
                    <button 
                      onClick={() => handleFinishRepair(order.id)}
                      className="w-full bg-green-600 text-white py-5 rounded-[2rem] font-black text-xs tracking-[0.2em] uppercase shadow-xl hover:scale-105 transition-all"
                    >
                      FINALIZAR
                    </button>
                  )}
                  {order.status === 'completed' && (
                    <div className="text-center py-4 bg-green-100 rounded-[2rem] flex flex-col items-center">
                      <CheckCircle className="w-8 h-8 text-green-600 mb-2" />
                      <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">Sucesso em {order.timeFinished}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechnicianDashboard;
