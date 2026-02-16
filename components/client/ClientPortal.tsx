
import React, { useState, useRef } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { House, Invoice } from '../../types';
import { MOCK_INVOICES } from '../../utils/mockData';
import { 
  FileText, 
  Wallet, 
  Check, 
  X, 
  AlertTriangle, 
  Download,
  Phone,
  Droplets,
  CheckCircle,
  MapPin,
  Plus,
  ArrowLeft,
  Smartphone,
  Building,
  Save,
  Bell,
  User as UserIcon,
  Smartphone as SmartphoneIcon,
  // Added missing MessageCircle icon import
  MessageCircle
} from '../common/Icons';
import { generateInvoicePDF } from '../../services/pdf';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface ClientPortalProps {
  house: House;
}

const ClientPortal: React.FC<ClientPortalProps> = ({ house }) => {
  return (
    <div className="max-w-6xl mx-auto py-6">
      <Routes>
        <Route path="invoices" element={<InvoicesList house={house} />} />
        <Route path="leak" element={<ReportLeak house={house} />} />
        <Route path="consumption" element={<ConsumptionHistory house={house} />} />
        <Route path="payment/:id" element={<PaymentSimulation house={house} />} />
        <Route path="settings" element={<ClientSettings house={house} />} />
      </Routes>
    </div>
  );
};

const InvoicesList: React.FC<{ house: House }> = ({ house }) => {
  const invoices = MOCK_INVOICES.filter(inv => inv.houseId === house.id);
  const navigate = useNavigate();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-secondary tracking-tight">Gestão de Facturas</h2>
          <p className="text-gray-500 font-medium italic">Histórico completo de pagamentos e dívidas 2026.</p>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-2xl border-2 border-gray-50 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
            <tr>
              <th className="px-8 py-6">Ref. AM</th>
              <th className="px-8 py-6">Período Fiscal</th>
              <th className="px-8 py-6">Valor Total</th>
              <th className="px-8 py-6">Vencimento</th>
              <th className="px-8 py-6">Estado</th>
              <th className="px-8 py-6 text-right">Acções</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-8 py-20 text-center text-gray-400 italic">Nenhuma factura encontrada.</td>
              </tr>
            ) : invoices.map(inv => (
              <tr key={inv.id} className="hover:bg-blue-50/30 transition-all group">
                <td className="px-8 py-6 font-black text-secondary">{inv.invoiceNumber}</td>
                <td className="px-8 py-6 text-sm font-bold text-gray-500">{inv.month} {inv.year}</td>
                <td className="px-8 py-6 font-black text-primary text-lg">{inv.total.toFixed(2)} MZN</td>
                <td className="px-8 py-6 text-sm font-medium">{inv.dueDate}</td>
                <td className="px-8 py-6">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    inv.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {inv.status === 'paid' ? 'Liquidado' : 'Pendente'}
                  </span>
                </td>
                <td className="px-8 py-6 text-right space-x-3">
                  <button 
                    onClick={() => generateInvoicePDF(inv, house)}
                    className="p-3 bg-white border-2 border-gray-100 rounded-2xl text-gray-300 hover:text-primary hover:border-primary transition-all shadow-sm"
                    title="Baixar Recibo PDF"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  {inv.status !== 'paid' && (
                    <button 
                      onClick={() => navigate(`/client/payment/${inv.id}`)}
                      className="bg-primary text-white px-6 py-3 rounded-2xl text-[10px] font-black tracking-widest uppercase shadow-lg hover:scale-105 active:scale-95 transition-all"
                    >
                      LIQUIDAR
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PaymentSimulation: React.FC<{ house: House }> = ({ house }) => {
  const [method, setMethod] = useState<'mpesa' | 'emola' | 'bank'>('mpesa');
  const [phoneNumber, setPhoneNumber] = useState(house.phoneNumber);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        navigate('/client/invoices');
      }, 3000);
    }, 2000);
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-12 rounded-[3.5rem] shadow-[0_35px_100px_rgba(0,0,0,0.1)] border-4 border-white animate-in zoom-in-95 duration-500">
      <div className="text-center mb-12">
        <div className="bg-secondary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Wallet className="w-10 h-10 text-secondary" />
        </div>
        <h2 className="text-3xl font-black text-secondary tracking-tight">Pagamento Digital</h2>
        <p className="text-gray-400 font-medium">Maputo - Serviços Financeiros DEX</p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-12">
        <button 
          onClick={() => setMethod('mpesa')}
          className={`group flex flex-col items-center p-6 rounded-[2rem] border-4 transition-all ${method === 'mpesa' ? 'border-red-500 bg-red-50 scale-105 shadow-xl' : 'bg-gray-50 border-transparent opacity-40 hover:opacity-100'}`}
        >
          <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center text-white font-black text-xs mb-3 shadow-xl group-hover:rotate-12 transition-transform">M</div>
          <span className="text-[10px] font-black tracking-widest uppercase">M-PESA</span>
        </button>
        <button 
          onClick={() => setMethod('emola')}
          className={`group flex flex-col items-center p-6 rounded-[2rem] border-4 transition-all ${method === 'emola' ? 'border-orange-500 bg-orange-50 scale-105 shadow-xl' : 'bg-gray-50 border-transparent opacity-40 hover:opacity-100'}`}
        >
          <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center text-white font-black text-xs mb-3 shadow-xl group-hover:rotate-12 transition-transform">E</div>
          <span className="text-[10px] font-black tracking-widest uppercase">E-MOLA</span>
        </button>
        <button 
          onClick={() => setMethod('bank')}
          className={`group flex flex-col items-center p-6 rounded-[2rem] border-4 transition-all ${method === 'bank' ? 'border-secondary bg-blue-50 scale-105 shadow-xl' : 'bg-gray-50 border-transparent opacity-40 hover:opacity-100'}`}
        >
          <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center text-white font-black text-xs mb-3 shadow-xl group-hover:rotate-12 transition-transform">
            <Smartphone className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-black tracking-widest uppercase">BANCO</span>
        </button>
      </div>

      <div className="mb-10 p-8 bg-gray-50 rounded-[2rem] border-2 border-gray-100">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Dados da Instituição (DEX)</p>
        {method === 'bank' ? (
          <div className="space-y-2">
            <p className="text-sm font-black text-secondary uppercase">BIM: 123456789</p>
            <p className="text-sm font-black text-secondary uppercase">BCI: 987654321</p>
            <p className="text-[10px] font-medium text-gray-500 italic">DIAS EXPRESS - MAPUTO</p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm font-black text-secondary uppercase">CONTACTO: 84 123 4567</p>
            <p className="text-[10px] font-medium text-gray-500 italic">Use a opção "Transferência" no menu do operador.</p>
          </div>
        )}
      </div>

      <form onSubmit={handlePay} className="space-y-8">
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 px-2">Contacto para Débito ({method.toUpperCase()})</label>
          <div className="relative">
            <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
            <input 
              type="text" 
              required
              placeholder="84 / 86 000 0000"
              className="w-full pl-16 pr-8 py-6 bg-gray-50 border-2 border-transparent focus:border-secondary focus:bg-white rounded-2xl outline-none transition-all font-black text-xl"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
        </div>

        <div className="p-8 bg-primary/5 rounded-3xl text-center border-2 border-primary/10">
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">Valor Total a Pagar</p>
          <span className="text-4xl font-black text-primary tracking-tighter">585.00 <span className="text-lg">MZN</span></span>
        </div>

        <button 
          disabled={loading || isSuccess}
          className={`w-full py-6 rounded-[2rem] font-black text-sm tracking-widest uppercase text-white shadow-2xl transition-all hover:scale-[1.02] active:scale-95 flex justify-center items-center ${
            method === 'mpesa' ? 'bg-red-600' : method === 'emola' ? 'bg-orange-600' : 'bg-secondary'
          } ${loading || isSuccess ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : isSuccess ? 'PAGAMENTO CONFIRMADO ✓' : `LIQUIDAR VIA ${method.toUpperCase()}`}
        </button>
      </form>

      {isSuccess && (
        <div className="mt-10 bg-green-50 p-8 rounded-[2.5rem] flex items-center text-green-700 animate-in bounce-in duration-700 border-2 border-green-100 shadow-xl">
          <CheckCircle className="w-10 h-10 mr-6 text-green-600 shrink-0" />
          <div>
            <p className="font-black text-sm uppercase tracking-widest">Sucesso!</p>
            <p className="text-xs font-medium opacity-80 italic">A sua transacção foi processada com sucesso no sistema Água Mali.</p>
          </div>
        </div>
      )}
    </div>
  );
};

const ReportLeak: React.FC<{ house: House }> = ({ house }) => {
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fix: Explicitly type 'file' as 'File' to resolve 'unknown' type error in URL.createObjectURL
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map((file: File) => URL.createObjectURL(file));
      setSelectedPhotos(prev => [...prev, ...filesArray].slice(0, 5));
    }
  };

  const handleReport = () => {
    alert('REPORTE ENVIADO ✓\nProtocolo: AM-LK' + Math.floor(1000 + Math.random() * 9000));
    setSelectedPhotos([]);
  };

  return (
    <div className="space-y-10 bg-white p-12 rounded-[4rem] border-2 border-gray-50 shadow-2xl animate-in slide-in-from-bottom-6 duration-700">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-6">
          <div className="bg-red-50 p-6 rounded-[2rem] text-red-500 shadow-inner">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-secondary tracking-tight">Reportar Ocorrência</h2>
            <p className="text-gray-500 font-medium mt-1 italic">Resposta técnica prioritária em Santa Isabel.</p>
          </div>
        </div>
        <div className="hidden md:block bg-orange-50 px-6 py-3 rounded-2xl border-2 border-primary/10 font-black text-[10px] text-primary tracking-widest uppercase">
          GPS ACTIVO: MAPUTO
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 pt-6">
        <div className="space-y-10">
          <div className="space-y-4">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest px-2">Tipo de Fuga</label>
            <div className="flex space-x-6">
              <label className="flex-1 cursor-pointer">
                <input type="radio" name="leakType" className="hidden peer" defaultChecked />
                <div className="p-8 border-4 border-gray-50 rounded-[2.5rem] peer-checked:border-primary peer-checked:bg-orange-50/50 text-center font-black text-[10px] tracking-widest uppercase transition-all shadow-sm hover:border-gray-100">RESIDENCIAL</div>
              </label>
              <label className="flex-1 cursor-pointer">
                <input type="radio" name="leakType" className="hidden peer" />
                <div className="p-8 border-4 border-gray-50 rounded-[2.5rem] peer-checked:border-secondary peer-checked:bg-blue-50/50 text-center font-black text-[10px] tracking-widest uppercase transition-all shadow-sm hover:border-gray-100">VIA PÚBLICA</div>
              </label>
            </div>
          </div>
          
          <div className="space-y-4">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest px-2">Descrição Detalhada</label>
            <textarea 
              rows={6} 
              className="w-full p-8 bg-gray-50 border-4 border-transparent focus:border-secondary focus:bg-white rounded-[2.5rem] outline-none font-bold text-gray-700 placeholder-gray-300 resize-none transition-all leading-relaxed shadow-inner" 
              placeholder="Descreva aqui o local exacto e a intensidade da fuga..."
            ></textarea>
          </div>
        </div>

        <div className="space-y-10">
          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Evidências (Máx. 5)</label>
              <span className="text-[10px] font-bold text-primary">{selectedPhotos.length}/5 Fotos</span>
            </div>
            <div className="grid grid-cols-3 gap-6">
              {selectedPhotos.map((photo, i) => (
                <div key={i} className="aspect-square rounded-[2rem] overflow-hidden border-4 border-white shadow-xl group relative">
                  <img src={photo} className="w-full h-full object-cover" />
                  <button onClick={() => setSelectedPhotos(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {selectedPhotos.length < 5 && (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square bg-gray-50 border-4 border-dashed border-gray-200 rounded-[2rem] flex flex-col items-center justify-center text-gray-300 hover:text-primary hover:border-primary hover:bg-white transition-all group shadow-inner"
                >
                  <Plus className="w-10 h-10 mb-3 group-hover:scale-125 transition-transform" />
                  <span className="text-[10px] font-black tracking-widest uppercase">ADICIONAR</span>
                </button>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              multiple 
              onChange={handleFileChange} 
            />
          </div>
          
          <div className="bg-secondary/5 p-10 rounded-[3rem] border-4 border-white flex flex-col items-center text-center shadow-xl">
            <MapPin className="w-12 h-12 mb-6 text-red-500 animate-bounce" />
            <p className="text-[10px] font-black text-secondary tracking-widest uppercase mb-2">Localização Geográfica</p>
            <p className="text-xs font-bold text-gray-400 italic">As coordenadas GPS serão enviadas automaticamente para a equipa técnica em Maputo.</p>
          </div>
        </div>
      </div>
      
      <div className="pt-10 border-t-2 border-gray-50 flex justify-end">
        <button 
          onClick={handleReport}
          className="bg-primary text-white px-16 py-6 rounded-3xl font-black text-sm tracking-[0.2em] uppercase shadow-2xl hover:scale-105 active:scale-95 transition-all border-4 border-white/20"
        >
          ENVIAR REPORTE PRIORITÁRIO
        </button>
      </div>
    </div>
  );
};

const ConsumptionHistory: React.FC<{ house: House }> = ({ house }) => {
  const data = [
    { month: 'Set 25', consumption: 15 },
    { month: 'Out 25', consumption: 30 },
    { month: 'Nov 25', consumption: 25 },
    { month: 'Dez 25', consumption: 28 },
    { month: 'Jan 26', consumption: 20 },
    { month: 'Fev 26', consumption: 24 },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-secondary tracking-tight">Análise de Consumo</h2>
          <p className="text-gray-500 font-medium italic">Monitorização de m³ e comparação histórica 2026.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-12 rounded-[3.5rem] shadow-2xl border-2 border-gray-50">
          <div className="h-[450px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'black', fill: '#94a3b8'}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'black', fill: '#94a3b8'}} dx={-15} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}} 
                  contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', fontWeight: 'black'}} 
                />
                <Bar dataKey="consumption" fill="#0056D2" radius={[12, 12, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-primary p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
            <h3 className="text-xl font-black mb-4 relative z-10">Média do Bairro</h3>
            <p className="text-3xl font-black relative z-10">22.5 <span className="text-sm opacity-60">m³</span></p>
            <p className="text-xs font-medium mt-4 opacity-80 italic relative z-10">O seu consumo em Fevereiro está 6% acima da média de Santa Isabel.</p>
            <Droplets className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10 group-hover:scale-110 transition-transform" />
          </div>

          <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-2 border-gray-50">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Comparativo 2025/2026</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-600">Jan 25 vs Jan 26</span>
                <span className="text-red-500 font-black text-sm">+8%</span>
              </div>
              <div className="h-2 bg-gray-50 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{width: '65%'}}></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-600">Fev 25 vs Fev 26</span>
                <span className="text-green-500 font-black text-sm">-12%</span>
              </div>
              <div className="h-2 bg-gray-50 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{width: '45%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ClientSettings: React.FC<{ house: House }> = ({ house }) => {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-top-6 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-secondary tracking-tight">Configurações de Perfil</h2>
          <p className="text-gray-500 font-medium italic">Gira os seus contactos e preferências de notificação.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-10">
        <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border-2 border-gray-50">
          <div className="flex items-center space-x-6 mb-12">
            <div className="bg-secondary/10 p-4 rounded-2xl text-secondary">
              <UserIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-secondary">Identidade e Contacto</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Nome do Proprietário</label>
              <input type="text" defaultValue={house.ownerName} className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent focus:border-secondary focus:bg-white rounded-2xl font-black text-secondary outline-none transition-all" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Telefone Principal</label>
              <div className="relative">
                <SmartphoneIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                <input type="text" defaultValue={house.phoneNumber} className="w-full pl-16 pr-8 py-5 bg-gray-50 border-2 border-transparent focus:border-secondary focus:bg-white rounded-2xl font-black text-secondary outline-none transition-all" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border-2 border-gray-50">
          <div className="flex items-center space-x-6 mb-12">
            <div className="bg-orange-50 p-4 rounded-2xl text-primary">
              <Bell className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-secondary">Preferências de Notificação</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="flex items-center justify-between p-8 rounded-3xl bg-gray-50/50 border-2 border-transparent hover:border-primary/10 transition-all">
              <div className="flex items-center space-x-4">
                <MessageCircle className="w-6 h-6 text-green-500" />
                <span className="text-sm font-black text-secondary uppercase tracking-widest">Facturas via WhatsApp</span>
              </div>
              <input type="checkbox" defaultChecked className="w-6 h-6 rounded-lg accent-primary" />
            </div>
            <div className="flex items-center justify-between p-8 rounded-3xl bg-gray-50/50 border-2 border-transparent hover:border-primary/10 transition-all">
              <div className="flex items-center space-x-4">
                <SmartphoneIcon className="w-6 h-6 text-blue-500" />
                <span className="text-sm font-black text-secondary uppercase tracking-widest">Avisos via SMS</span>
              </div>
              <input type="checkbox" defaultChecked className="w-6 h-6 rounded-lg accent-primary" />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-6 pt-6">
          <button type="submit" className="bg-[#0F172A] text-white px-16 py-6 rounded-[2rem] font-black shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center space-x-6 uppercase text-sm tracking-widest border-4 border-white/10">
            <Save className="w-6 h-6" />
            <span>Actualizar Definições</span>
          </button>
          
          {isSaved && (
            <div className="flex items-center space-x-3 text-green-600 font-black text-xs uppercase tracking-widest animate-in fade-in zoom-in duration-300">
              <CheckCircle className="w-5 h-5" />
              <span>Perfil actualizado com sucesso!</span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default ClientPortal;
