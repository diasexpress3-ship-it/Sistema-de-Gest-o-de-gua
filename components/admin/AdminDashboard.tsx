
import React from 'react';
import { 
  Home, 
  Droplets, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Plus,
  UserPlus,
  MessageCircle,
  BarChart3
} from '../common/Icons';
import { Link, useNavigate } from 'react-router-dom';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const stats = [
    { label: 'Total Casas', value: '1,245', icon: Home, color: 'bg-blue-50 text-secondary', trend: '+12%', trendUp: true },
    { label: 'Leituras Pendentes', value: '42', icon: Droplets, color: 'bg-orange-50 text-primary', trend: '-5%', trendUp: false },
    { label: 'Fugas Ativas', value: '08', icon: AlertTriangle, color: 'bg-red-50 text-red-600', trend: '+2', trendUp: true },
    { label: 'Faturas Pagas', value: '92%', icon: CheckCircle, color: 'bg-green-50 text-green-600', trend: '+3%', trendUp: true },
  ];

  const chartData = [
    { name: 'Jan 2026', consumption: 4200 },
    { name: 'Fev 2026', consumption: 3800 },
    { name: 'Mar 2026', consumption: 4500 },
    { name: 'Abr 2026', consumption: 4100 },
    { name: 'Mai 2026', consumption: 3900 },
    { name: 'Jun 2026', consumption: 4800 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Consola de Gestão</h1>
          <p className="text-gray-500 font-medium">Maputo - Santa Isabel | Ano Fiscal 2026</p>
        </div>
        <div className="bg-white px-5 py-3 rounded-2xl border-2 border-gray-50 shadow-sm flex items-center text-[10px] font-black tracking-[0.2em] uppercase text-primary">
          <span className="w-2.5 h-2.5 bg-primary rounded-full mr-3 animate-pulse"></span>
          Sistema Digital Activo
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-xl border-2 border-transparent hover:border-primary/10 transition-all group cursor-default">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-4 rounded-2xl ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center text-[10px] font-black tracking-widest uppercase ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                {stat.trendUp ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                {stat.trend}
              </div>
            </div>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">{stat.label}</p>
            <h3 className="text-4xl font-black text-gray-900 mt-2 tracking-tighter">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] shadow-2xl border-2 border-gray-50">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-black text-gray-900">Consumo de Água (m³) - 2026</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Dados Agregados do Bairro</p>
            </div>
            <select className="bg-gray-50 border-2 border-transparent focus:border-primary outline-none text-[10px] font-black uppercase tracking-widest rounded-xl px-5 py-2.5 transition-all">
              <option>Janeiro / Fevereiro</option>
              <option>Primeiro Semestre</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} dx={-10} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', fontWeight: 'bold', fontSize: '12px'}} />
                <Bar dataKey="consumption" fill="#FF7A00" radius={[14, 14, 0, 0]} barSize={42} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-secondary text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-3 tracking-tight">Faturamento 2026</h3>
              <p className="text-blue-100 text-sm mb-10 font-medium leading-relaxed italic opacity-80">Monitorização financeira em tempo real do sistema Água Mali.</p>
              <button 
                onClick={() => navigate('/reports')}
                className="inline-flex items-center bg-primary text-white px-10 py-5 rounded-2xl font-black text-[10px] tracking-widest uppercase hover:scale-105 transition-all shadow-xl group-hover:bg-primary-dark"
              >
                VER RELATÓRIO
                <ArrowRight className="w-5 h-5 ml-3" />
              </button>
            </div>
            <BarChart3 className="absolute -bottom-10 -right-10 w-48 h-48 text-white opacity-5 group-hover:scale-110 transition-transform duration-1000" />
          </div>

          <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-2 border-gray-50">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8">Atalhos Rápidos</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/houses" className="flex flex-col items-center justify-center p-6 rounded-[2rem] border-2 border-gray-50 hover:border-primary hover:bg-orange-50 transition-all group">
                <Plus className="w-6 h-6 text-primary mb-3 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Nova Casa</span>
              </Link>
              <Link to="/users" className="flex flex-col items-center justify-center p-6 rounded-[2rem] border-2 border-gray-50 hover:border-secondary hover:bg-blue-50 transition-all group">
                <UserPlus className="w-6 h-6 text-secondary mb-3 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Equipa</span>
              </Link>
              <Link to="/leaks" className="flex flex-col items-center justify-center p-6 rounded-[2rem] border-2 border-gray-50 hover:border-red-500 hover:bg-red-50 transition-all group">
                <AlertTriangle className="w-6 h-6 text-red-500 mb-3 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Fugas</span>
              </Link>
              <Link to="/issuance" className="flex flex-col items-center justify-center p-6 rounded-[2rem] border-2 border-gray-50 hover:border-primary hover:bg-orange-50 transition-all group">
                <MessageCircle className="w-6 h-6 text-primary mb-3 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Avisos</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;