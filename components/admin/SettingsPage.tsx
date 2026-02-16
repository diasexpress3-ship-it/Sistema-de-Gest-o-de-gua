
import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  Save, 
  CheckCircle,
  HelpCircle,
  Building
} from '../common/Icons';

const SettingsPage: React.FC = () => {
  const [isSaved, setIsSaved] = useState(false);
  const SUPPORT_CONTACT = "843307646";

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Configurações do Sistema</h1>
          <p className="text-gray-500 font-medium italic">Gestão de Identidade e Suporte Água Mali.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-2 border-gray-50">
          <div className="flex items-center space-x-4 mb-8">
            <div className="bg-primary/10 p-4 rounded-2xl text-primary">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black">Apoio e Reclamações</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contacto Oficial de Suporte</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                <input type="text" defaultValue={SUPPORT_CONTACT} className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:border-secondary focus:bg-white rounded-2xl font-bold outline-none transition-all" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">E-mail de Atendimento</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                <input type="email" defaultValue="apoio@aguamali.co.mz" className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:border-secondary focus:bg-white rounded-2xl font-bold outline-none transition-all" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-2 border-gray-50">
          <div className="flex items-center space-x-4 mb-8">
            <div className="bg-secondary/10 p-4 rounded-2xl text-secondary">
              <Building className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black">Configurações Financeiras</h3>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tarifa por Metro Cúbico (MZN)</label>
                <input type="number" defaultValue="70" className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-secondary rounded-2xl font-black text-secondary outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Moeda do Sistema</label>
                <input type="text" defaultValue="Metical (MZN)" disabled className="w-full px-6 py-4 bg-gray-100 border-2 border-transparent rounded-2xl font-bold" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <button 
            type="submit"
            className="bg-[#0F172A] text-white px-12 py-5 rounded-3xl font-black shadow-2xl hover:scale-105 transition-all flex items-center space-x-4 uppercase text-xs tracking-widest border-4 border-white/10"
          >
            <Save className="w-5 h-5" />
            <span>Guardar Alterações 2026</span>
          </button>
          
          {isSaved && (
            <div className="flex items-center space-x-2 text-green-600 font-black text-xs uppercase tracking-widest animate-in fade-in zoom-in duration-300">
              <CheckCircle className="w-4 h-4" />
              <span>Actualizado com sucesso!</span>
            </div>
          )}
        </div>
      </form>

      <div className="pt-10 border-t-2 border-gray-100 text-center">
        <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">DIAS EXPRESS - CEO Vicente Dias</p>
      </div>
    </div>
  );
};

export default SettingsPage;
