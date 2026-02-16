
import React from 'react';
import { House } from '../../types';
import { MOCK_INVOICES } from '../../utils/mockData';
import { 
  Droplets, 
  FileText, 
  AlertTriangle, 
  TrendingUp, 
  Download,
  Wallet,
  ArrowRight
} from '../common/Icons';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { generateInvoicePDF } from '../../services/pdf';
import { useNavigate } from 'react-router-dom';

interface ClientDashboardProps {
  house: House;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ house }) => {
  const navigate = useNavigate();
  const invoices = MOCK_INVOICES.filter(inv => inv.houseId === house.id);
  const pendingInvoices = invoices.filter(inv => inv.status !== 'paid');
  const totalPending = pendingInvoices.reduce((acc, curr) => acc + curr.total, 0);

  const chartData = [
    { month: 'Set 25', value: 15 },
    { month: 'Out 25', value: 30 },
    { month: 'Nov 25', value: 25 },
    { month: 'Dez 25', value: 28 },
    { month: 'Jan 26', value: 20 },
    { month: 'Fev 26', value: 24 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-secondary tracking-tight">Olá, {house.ownerName}</h1>
          <p className="text-gray-500 font-medium">ID Cliente: <span className="font-black text-primary">{house.id}</span> | {house.reference}</p>
        </div>
        <div className="bg-white p-4 rounded-3xl border-2 border-gray-50 shadow-sm flex items-center space-x-4">
          <div className="bg-orange-50 p-3 rounded-2xl">
            <Droplets className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Leitura Actual</p>
            <p className="text-xl font-black text-secondary">{house.lastReading} m³</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Status Cards */}
        <div className="bg-gradient-to-br from-secondary to-blue-900 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-blue-100 text-[10px] font-black uppercase tracking-widest mb-2 opacity-80">Dívida Pendente</h3>
            <h2 className="text-4xl font-black mb-6 tracking-tighter">
              {totalPending.toFixed(2)} <span className="text-sm font-bold opacity-60 uppercase">MZN</span>
            </h2>
            <div className="flex items-center text-[10px] font-black bg-white/10 w-fit px-4 py-2 rounded-xl backdrop-blur-md border border-white/10">
              <TrendingUp className="w-3 h-3 mr-2 text-primary" />
              <span>CONSUMO ESTIMADO: +12%</span>
            </div>
          </div>
          <Wallet className="absolute -bottom-6 -right-6 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform duration-700" />
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border-2 border-gray-50 hover:border-secondary/10 transition-all group">
          <div className="flex justify-between items-start mb-6">
            <div className="bg-blue-50 p-4 rounded-2xl text-secondary group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Total Faturas: {invoices.length}</span>
          </div>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Faturas em Aberto</p>
          <h3 className="text-3xl font-black text-gray-900 mt-1">{pendingInvoices.length}</h3>
          <button 
            onClick={() => navigate('/client/invoices')}
            className="mt-6 text-primary font-black text-xs uppercase tracking-widest flex items-center group-hover:translate-x-2 transition-transform"
          >
            LIQUIDAR AGORA <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border-2 border-gray-50 hover:border-red-500/10 transition-all group">
          <div className="flex justify-between items-start mb-6">
            <div className="bg-red-50 p-4 rounded-2xl text-red-500 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Fugas Reportadas</p>
          <h3 className="text-3xl font-black text-gray-900 mt-1">0</h3>
          <button 
            onClick={() => navigate('/client/leak')}
            className="mt-6 text-red-500 font-black text-xs uppercase tracking-widest flex items-center group-hover:translate-x-2 transition-transform"
          >
            REPORTAR PROBLEMA <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Consumption Chart */}
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-2 border-gray-50">
          <h3 className="text-xl font-black text-secondary mb-8">Consumo Santa Isabel (m³)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF7A00" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#FF7A00" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#f8fafc" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} dx={-10} />
                <Tooltip 
                  contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)', fontWeight: 'black'}} 
                />
                <Area type="monotone" dataKey="value" stroke="#FF7A00" fillOpacity={1} fill="url(#colorValue)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-2 border-gray-50">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-secondary">Últimas Faturas</h3>
            <button onClick={() => navigate('/client/invoices')} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Ver Todas</button>
          </div>
          <div className="space-y-4">
            {invoices.length === 0 ? (
              <p className="text-center py-10 text-gray-400 font-medium italic">Sem faturas registadas.</p>
            ) : invoices.slice(0, 3).map(inv => (
              <div key={inv.id} className="flex items-center justify-between p-6 rounded-[2rem] border-2 border-gray-50 bg-gray-50/30 hover:bg-white hover:border-primary/20 transition-all cursor-pointer group shadow-sm">
                <div className="flex items-center">
                  <div className={`p-3 rounded-2xl mr-4 ${inv.status === 'paid' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-black text-gray-900">{inv.month} {inv.year}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{inv.invoiceNumber}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="font-black text-secondary">{inv.total.toFixed(2)} MZN</p>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${inv.status === 'paid' ? 'text-green-500' : 'text-red-500'}`}>
                      {inv.status === 'paid' ? 'Liquidado' : 'Pendente'}
                    </span>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); generateInvoicePDF(inv, house); }}
                    className="p-3 bg-white rounded-xl border-2 border-gray-100 text-gray-300 hover:text-primary hover:border-primary transition-all shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
