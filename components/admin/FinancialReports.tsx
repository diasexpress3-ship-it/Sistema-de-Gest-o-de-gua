
import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  FileText, 
  ArrowLeft, 
  BarChart3, 
  Download,
  Calendar
} from '../common/Icons';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const FinancialReports: React.FC = () => {
  const navigate = useNavigate();

  const data = [
    { month: 'Jan', revenue: 650000, target: 600000 },
    { month: 'Fev', revenue: 720000, target: 650000 },
    { month: 'Mar', revenue: 680000, target: 700000 },
    { month: 'Abr', revenue: 850000, target: 750000 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/')}
            className="p-3 bg-white border-2 border-gray-100 rounded-2xl hover:border-primary transition-all shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Relatório Financeiro 2026</h1>
            <p className="text-gray-500 font-medium italic">Análise de Receita e Inadimplência - Santa Isabel</p>
          </div>
        </div>
        <button className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-xs tracking-widest uppercase flex items-center shadow-xl hover:scale-105 transition-all">
          <Download className="w-4 h-4 mr-3" />
          EXPORTAR PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border-2 border-gray-50">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Receita Total Acumulada</p>
          <h2 className="text-3xl font-black text-gray-900">2.900.000,00 <span className="text-sm font-bold text-gray-400">MZN</span></h2>
          <div className="mt-4 flex items-center text-green-600 font-bold text-xs">
            <TrendingUp className="w-4 h-4 mr-2" /> +15.4% vs 2025
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border-2 border-gray-50">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Facturas Pagas (Jan/Fev)</p>
          <h2 className="text-3xl font-black text-green-600">88.4%</h2>
          <div className="mt-4 text-xs font-medium text-gray-400 italic">Meta: 90% para o trimestre</div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border-2 border-gray-50">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Dívida Pendente (Total)</p>
          <h2 className="text-3xl font-black text-red-600">345.200,00 <span className="text-sm font-bold text-gray-400">MZN</span></h2>
          <div className="mt-4 flex items-center text-red-500 font-bold text-xs">
            <TrendingDown className="w-4 h-4 mr-2" /> -2.1% Inadimplência
          </div>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-2 border-gray-50">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center space-x-3">
            <div className="bg-primary/10 p-3 rounded-2xl">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-black">Curva de Arrecadação Mensal</h3>
          </div>
          <div className="flex space-x-2">
            <div className="flex items-center space-x-2 text-[10px] font-black text-gray-400 px-4 py-2 border rounded-xl">
              <span className="w-3 h-3 bg-primary rounded-full"></span>
              <span>REALIZADO</span>
            </div>
            <div className="flex items-center space-x-2 text-[10px] font-black text-gray-400 px-4 py-2 border rounded-xl">
              <span className="w-3 h-3 bg-gray-200 rounded-full"></span>
              <span>META</span>
            </div>
          </div>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0B4F6C" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#0B4F6C" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} dx={-10} />
              <Tooltip contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)'}} />
              <Area type="monotone" dataKey="revenue" stroke="#0B4F6C" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
              <Area type="monotone" dataKey="target" stroke="#E2E8F0" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default FinancialReports;
