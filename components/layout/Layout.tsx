
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, UserRole } from '../../types';
import { 
  LayoutDashboard, 
  Home, 
  UserPlus, 
  Droplets, 
  AlertTriangle, 
  History, 
  Settings, 
  LogOut,
  Menu,
  Bell,
  FileText,
  Search,
  CheckCircle,
  XCircle,
  Wifi,
  WifiOff,
  MapPin,
  MessageCircle
} from '../common/Icons';

interface LayoutProps {
  user: User;
  onLogout: () => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const adminMenu = [
    { name: 'Painel Geral', icon: LayoutDashboard, path: '/' },
    { name: 'Casas / Clientes', icon: Home, path: '/houses' },
    { name: 'Utilizadores', icon: UserPlus, path: '/users' },
    { name: 'Validação Leituras', icon: Droplets, path: '/readings' },
    { name: 'Fugas Notativas', icon: AlertTriangle, path: '/leaks' },
    { name: 'Emissão / Alertas', icon: FileText, path: '/issuance' },
  ];

  const clientMenu = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Minhas Facturas', icon: FileText, path: '/client/invoices' },
    { name: 'Reportar Fuga', icon: AlertTriangle, path: '/client/leak' },
    { name: 'Consumo Histórico', icon: History, path: '/client/consumption' },
  ];

  const readerMenu = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Casas / Clientes', icon: Home, path: '/houses' },
    { name: 'Utilizadores', icon: UserPlus, path: '/users' },
    { name: 'Validação', icon: Droplets, path: '/readings' },
    { name: 'Fugas', icon: AlertTriangle, path: '/leaks' },
    { name: 'Emissão', icon: MessageCircle, path: '/issuance' },
  ];

  const technicianMenu = [
    { name: 'Painel Técnico', icon: LayoutDashboard, path: '/' },
    { name: 'Casas / Clientes', icon: Home, path: '/houses' },
    { name: 'Utilizadores', icon: UserPlus, path: '/users' },
    { name: 'Fugas Notativas', icon: AlertTriangle, path: '/leaks' },
    { name: 'Emissão de Alertas', icon: FileText, path: '/issuance' },
  ];

  const getMenu = () => {
    switch(user.role) {
      case UserRole.ADMIN: return adminMenu;
      case UserRole.CLIENTE: return clientMenu;
      case UserRole.LEITOR: return readerMenu;
      case UserRole.TECNICO: return technicianMenu;
      default: return adminMenu;
    }
  };

  const menuItems = getMenu();
  const settingsPath = user.role === UserRole.CLIENTE ? '/client/settings' : '/settings';

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-secondary text-white transition-transform duration-300 transform lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-24 border-b border-white/10 px-4">
            <h1 className="text-2xl font-black tracking-tighter uppercase">ÁGUA <span className="text-primary">MALI</span></h1>
          </div>
          
          <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto no-scrollbar">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-5 py-4 rounded-2xl transition-all duration-300 ${
                  location.pathname === item.path 
                  ? 'bg-primary text-white shadow-lg shadow-orange-950/20' 
                  : 'hover:bg-white/5 text-blue-100/70 hover:text-white'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className={`w-5 h-5 mr-3 ${location.pathname === item.path ? 'scale-110' : ''}`} />
                <span className="font-bold text-xs uppercase tracking-widest">{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-white/10">
            <div className="bg-white/5 rounded-2xl p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Modo de Rede</span>
                <button 
                  onClick={() => setIsOnline(!isOnline)}
                  className={`p-1.5 rounded-lg transition-all ${isOnline ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}
                >
                  {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] font-bold text-white/40">
                {isOnline ? 'Sincronização Cloud Activa' : 'Trabalhando Offline'}
              </p>
            </div>
            <button 
              onClick={onLogout}
              className="flex items-center w-full px-5 py-4 text-red-300 hover:text-red-100 hover:bg-red-500/10 rounded-2xl transition-all font-black text-xs uppercase tracking-widest"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span>Sair do Sistema</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b flex items-center justify-between px-8 z-40">
          <div className="flex items-center">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-gray-600"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden md:flex items-center ml-4 bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-2">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input 
                type="text" 
                placeholder="Pesquisar no sistema..." 
                className="bg-transparent border-none outline-none text-sm w-64 font-medium"
              />
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className={`hidden md:flex items-center px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase border-2 ${isOnline ? 'bg-green-50 border-green-100 text-green-600' : 'bg-orange-50 border-orange-100 text-primary'}`}>
              <span className={`w-2 h-2 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-primary'}`}></span>
              {isOnline ? 'Online' : 'Offline'}
            </div>
            <button className="p-2.5 text-gray-400 hover:text-secondary relative transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
            </button>
            <button 
              onClick={() => navigate(settingsPath)}
              className="p-2.5 text-gray-400 hover:text-secondary transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
            <div className="flex items-center border-l pl-6 space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-gray-900 tracking-tight">{user.name}</p>
                <p className="text-[10px] text-primary font-black uppercase tracking-widest">{user.role}</p>
              </div>
              <div className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-gray-100 shadow-sm">
                <img 
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=FF7A00&color=fff`} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic View */}
        <main className="flex-1 overflow-y-auto p-8 bg-[#FAFAFA]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
