
import React, { useState } from 'react';
import { User, UserRole, House } from '../../types';
import { MOCK_USERS, MOCK_HOUSES } from '../../utils/mockData';
import { Lock, Eye, EyeOff, AlertCircle, TabletSmartphone } from '../common/Icons';

interface LoginProps {
  onLogin: (user: User, house?: House) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState<'cliente' | 'colaborador'>('cliente');
  const [idValue, setIdValue] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      // Load latest users from storage for staff login
      const storedUsers: User[] = JSON.parse(localStorage.getItem('db_users') || '[]');
      const allUsers = storedUsers.length > 0 ? storedUsers : MOCK_USERS;

      if (activeTab === 'colaborador') {
        const staffMember = allUsers.find(u => 
          (u.phoneNumber === idValue || u.id === idValue) && 
          (u.role !== UserRole.CLIENTE)
        );

        if (staffMember) {
          const userPass = staffMember.password || (staffMember.id === 'A106' ? 'Sahombe13' : 'welcome');
          if (password === userPass) {
            onLogin(staffMember);
            setLoading(false);
            return;
          }
        }
      } else {
        const storedHouses = JSON.parse(localStorage.getItem('db_houses') || '[]');
        const allHouses = [...storedHouses, ...MOCK_HOUSES];
        
        const house = allHouses.find(h => h.id === idValue || h.meterId === idValue);
        if (house && password === (house.password || 'welcome')) {
          if (house.status === 'inactive') {
            setError('Esta conta de cliente está inativa. Contacte a administração.');
            setLoading(false);
            return;
          }
          
          const clientUser: User = {
            id: house.id,
            name: house.ownerName,
            email: `${house.id}@agua-mali.co.mz`,
            phoneNumber: house.phoneNumber,
            role: UserRole.CLIENTE,
            status: house.status,
            avatar: `https://ui-avatars.com/api/?name=${house.ownerName}&background=FF7A00&color=fff`,
            password: house.password
          };
          onLogin(clientUser, house);
          setLoading(false);
          return;
        }
      }

      setError('Credenciais inválidas ou conta não encontrada no sistema Água Mali.');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] p-4 font-sans text-[#1E293B]">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <h1 className="text-6xl font-black text-secondary tracking-tighter mb-1">
          ÁGUA <span className="text-primary">MALI</span>
        </h1>
        <p className="text-[#64748B] text-sm font-bold uppercase tracking-widest">Bairro Santa Isabel, Maputo</p>
      </div>

      {/* Login Card - Increased max-w from 440px to 560px for wider inputs */}
      <div className="w-full max-w-[560px] bg-white rounded-[3.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.08)] p-12 md:p-16 border border-white animate-in zoom-in-95 duration-500">
        
        {/* Tab Switcher */}
        <div className="bg-[#F1F5F9] p-1.5 rounded-2xl flex mb-12">
          <button 
            type="button"
            onClick={() => { setActiveTab('cliente'); setError(''); }}
            className={`flex-1 py-5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'cliente' ? 'bg-white text-primary shadow-sm' : 'text-[#64748B]'}`}
          >
            Portal Cliente
          </button>
          <button 
            type="button"
            onClick={() => { setActiveTab('colaborador'); setError(''); }}
            className={`flex-1 py-5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'colaborador' ? 'bg-white text-secondary shadow-sm' : 'text-[#64748B]'}`}
          >
            Staff Interno
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="block text-[11px] font-black text-[#94A3B8] uppercase tracking-[0.2em] px-2">
              {activeTab === 'cliente' ? 'ID Cliente ou Contador' : 'Identificação Staff (Username/ID)'}
            </label>
            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#94A3B8] group-focus-within:text-secondary transition-colors">
                <TabletSmartphone className="w-6 h-6" />
              </div>
              <input 
                type="text" 
                required
                placeholder={activeTab === 'cliente' ? "Ex: A113" : "Ex: A106"}
                className="w-full bg-[#F8FAFC] border-2 border-transparent focus:border-secondary/20 focus:bg-white rounded-[1.5rem] pl-16 pr-6 py-5 text-lg font-bold outline-none transition-all placeholder:text-[#CBD5E1]"
                value={idValue}
                onChange={(e) => setIdValue(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-[11px] font-black text-[#94A3B8] uppercase tracking-[0.2em] px-2">Palavra-Passe de Acesso</label>
            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#94A3B8] group-focus-within:text-secondary transition-colors">
                <Lock className="w-6 h-6" />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                required
                placeholder="••••••••"
                className="w-full bg-[#F8FAFC] border-2 border-transparent focus:border-secondary/20 focus:bg-white rounded-[1.5rem] pl-16 pr-14 py-5 text-lg font-bold outline-none transition-all placeholder:text-[#CBD5E1]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-secondary transition-colors"
              >
                {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-100 text-red-600 p-5 rounded-2xl flex items-center text-[12px] font-bold animate-in fade-in duration-200">
              <AlertCircle className="w-5 h-5 mr-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-black py-7 rounded-[1.5rem] shadow-2xl shadow-orange-100 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center tracking-[0.3em] uppercase text-sm border-4 border-white/20 mt-4"
          >
            {loading ? (
              <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : 'ENTRAR NO SISTEMA'}
          </button>
        </form>

        <div className="mt-12 text-center">
          <div className="h-px bg-[#F1F5F9] w-full mb-10"></div>
          
          <div className="space-y-2">
            <p className="text-[11px] font-black text-[#CBD5E1] uppercase tracking-[0.4em]">DIAS EXPRESS - MAPUTO</p>
            <p className="text-[12px] font-black text-secondary uppercase tracking-widest">DEX (DiasExpress)</p>
            <p className="text-[11px] text-[#94A3B8] font-bold">CEO e Founder: Vicente Dias</p>
          </div>

          <p className="mt-8 text-[11px] text-[#94A3B8] font-medium">
            Dificuldades no acesso? Recupere via <a href="https://wa.me/843307646" target="_blank" rel="noopener noreferrer" className="text-primary font-black hover:underline">WhatsApp Oficial</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
