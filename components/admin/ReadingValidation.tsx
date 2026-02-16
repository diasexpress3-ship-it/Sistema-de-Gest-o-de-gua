
import React, { useState, useEffect } from 'react';
import { Reading } from '../../types';
import { MOCK_READINGS, MOCK_HOUSES } from '../../utils/mockData';
import { Eye, CheckCircle, Droplets, Camera, Trash, XCircle, X, MapPin } from '../common/Icons';

const ReadingValidation: React.FC = () => {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [showPhoto, setShowPhoto] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('db_readings');
    if (stored) {
      setReadings(JSON.parse(stored));
    } else {
      setReadings(MOCK_READINGS);
      localStorage.setItem('db_readings', JSON.stringify(MOCK_READINGS));
    }
  }, []);

  const saveToStorage = (updated: Reading[]) => {
    setReadings(updated);
    localStorage.setItem('db_readings', JSON.stringify(updated));
  };

  const validateReading = (id: string) => {
    const updated = readings.map(r => r.id === id ? { ...r, status: 'validated' } as Reading : r);
    saveToStorage(updated);
    alert('LEITURA VALIDADA ✓\nO sistema está agora a gerar a fatura para o cliente e a enviar o aviso via WhatsApp.');
  };

  const deleteReading = (id: string) => {
    if (window.confirm('Tem certeza que deseja eliminar este registo de leitura?')) {
      const updated = readings.filter(r => r.id !== id);
      saveToStorage(updated);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Validação de Leituras</h1>
          <p className="text-gray-500 font-medium">Verifique as evidências fotográficas antes da emissão de faturas.</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl border-2 border-gray-50 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
            <tr>
              <th className="px-8 py-6">ID Casa</th>
              <th className="px-8 py-6">Proprietário</th>
              <th className="px-8 py-6">Leitura Anterior</th>
              <th className="px-8 py-6">Leitura Actual</th>
              <th className="px-8 py-6">Consumo (m³)</th>
              <th className="px-8 py-6">Estado</th>
              <th className="px-8 py-6 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {readings.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-8 py-20 text-center text-gray-400 italic">Sem leituras pendentes de validação.</td>
              </tr>
            ) : readings.map((reading) => {
              const house = MOCK_HOUSES.find(h => h.id === reading.houseId);
              return (
                <tr key={reading.id} className="hover:bg-blue-50/30 transition-all group">
                  <td className="px-8 py-6">
                    <span className="font-black text-primary text-lg">{reading.houseId}</span>
                  </td>
                  <td className="px-8 py-6 font-bold text-gray-700">{house?.ownerName}</td>
                  <td className="px-8 py-6 text-sm text-gray-400 font-bold">{reading.previousValue} m³</td>
                  <td className="px-8 py-6 text-sm font-black text-gray-900">{reading.currentValue} m³</td>
                  <td className="px-8 py-6 font-black text-secondary text-lg">
                    <div className="flex items-center">
                      <Droplets className="w-4 h-4 mr-2" />
                      {reading.consumption}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      reading.status === 'validated' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {reading.status === 'validated' ? 'Validado ✓' : 'Pendente'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right flex justify-end space-x-2">
                    <button 
                      onClick={() => setShowPhoto('https://picsum.photos/seed/meter/1200/800')}
                      className="p-3 bg-white border-2 border-gray-100 rounded-2xl text-gray-400 hover:text-primary hover:border-primary transition-all shadow-sm"
                      title="Ver Evidência Fotográfica"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    {reading.status === 'pending' && (
                      <button 
                        onClick={() => validateReading(reading.id)}
                        className="bg-primary text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all"
                      >
                        VALIDAR
                      </button>
                    )}
                    <button 
                      onClick={() => deleteReading(reading.id)}
                      className="p-3 bg-white border-2 border-gray-100 rounded-2xl text-gray-300 hover:text-red-500 hover:border-red-500 transition-all shadow-sm"
                      title="Eliminar Registo"
                    >
                      <Trash className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showPhoto && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[150] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <button 
            onClick={() => setShowPhoto(null)} 
            className="absolute top-8 right-8 text-white/50 hover:text-white hover:rotate-90 transition-all"
          >
            <X className="w-10 h-10" />
          </button>
          
          <div className="relative max-w-5xl w-full group">
            <div className="absolute -top-14 left-0 text-white flex items-center space-x-4">
              <Camera className="w-6 h-6 text-primary" />
              <span className="font-black text-xl uppercase tracking-widest">Evidência de Campo - Santa Isabel</span>
            </div>
            
            <div className="relative rounded-[2.5rem] overflow-hidden border-4 border-white/10 shadow-2xl">
              <img src={showPhoto} alt="Foto do Contador" className="w-full h-auto" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-8 left-8 right-8 text-white backdrop-blur-md bg-white/10 p-8 rounded-3xl border border-white/10 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Leitor Responsável</p>
                    <p className="text-xl font-black">João Leitor (Z-02)</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Data e Hora</p>
                    <p className="text-sm font-bold">15 de Janeiro, 2026 - 14:32</p>
                  </div>
                </div>
                <div className="h-px bg-white/10 mb-4"></div>
                <div className="flex items-center text-xs font-bold text-blue-200">
                  <MapPin className="w-4 h-4 mr-2" />
                  Localização GPS Confirmada: Lat -25.9678, Long 32.5891
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadingValidation;
