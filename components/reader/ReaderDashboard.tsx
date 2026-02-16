
import React, { useState, useRef, useEffect } from 'react';
import { MOCK_HOUSES, MOCK_READINGS } from '../../utils/mockData';
import { House, Reading, UserRole } from '../../types';
import HouseManagement from '../admin/HouseManagement';
import UserManagement from '../admin/UserManagement';
import ReadingValidation from '../admin/ReadingValidation';
import LeakManagement from '../admin/LeakManagement';
import IssuanceManagement from '../admin/IssuanceManagement';
import { 
  Camera, 
  MapPin, 
  CheckCircle, 
  Droplets, 
  Upload, 
  LayoutDashboard, 
  History, 
  AlertTriangle, 
  ArrowLeft, 
  Check, 
  X, 
  Search,
  Wifi,
  CloudUpload,
  User as UserIcon,
  Home,
  Play,
  FileText,
  MessageCircle,
  Settings,
  Smartphone,
  Send,
  Clock,
  Shield,
  ArrowRight,
  Database
} from '../common/Icons';

const ReaderDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'route' | 'houses' | 'users' | 'validation' | 'leaks' | 'issuance' | 'history'>('dashboard');
  const [activeStep, setActiveStep] = useState<'list' | 'capture'>('list');
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null);
  const [readingValue, setReadingValue] = useState('');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [turnoActive, setTurnoActive] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [offlineReadings, setOfflineReadings] = useState<Reading[]>([]);
  const [houses, setHouses] = useState<House[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastSubmittedReading, setLastSubmittedReading] = useState<any>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // PREÇO REAL POR METRO CÚBICO
  const PRICE_PER_M3 = 70; 
  const SUPPORT_CONTACT = "843307646";

  useEffect(() => {
    const storedHouses = localStorage.getItem('db_houses');
    const allHouses = storedHouses ? JSON.parse(storedHouses) : MOCK_HOUSES;
    setHouses(allHouses);

    const saved = localStorage.getItem('offline_readings');
    if (saved) {
      setOfflineReadings(JSON.parse(saved));
    }
    
    const savedTurno = localStorage.getItem('reader_turno_active');
    if (savedTurno) setTurnoActive(JSON.parse(savedTurno));
  }, []);

  useEffect(() => {
    if (activeStep === 'capture' && selectedHouse && !capturedPhoto) {
      startCamera();
    }
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [activeStep, selectedHouse]);

  const toggleTurno = () => {
    const newState = !turnoActive;
    setTurnoActive(newState);
    localStorage.setItem('reader_turno_active', JSON.stringify(newState));
  };

  const startCamera = async () => {
    setIsCameraActive(true);
    setCapturedPhoto(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setIsCameraActive(false);
    }
  };

  const captureSnapshot = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context?.drawImage(videoRef.current, 0, 0);
      const photoData = canvasRef.current.toDataURL('image/jpeg', 0.8);
      setCapturedPhoto(photoData);
      
      const stream = videoRef.current.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
      setIsCameraActive(false);
    }
  };

  const handleStartReading = (house: House) => {
    setSelectedHouse(house);
    setActiveStep('capture');
    setReadingValue('');
  };

  const handleSubmitReading = () => {
    if (!readingValue) return alert("Por favor, insira o valor actual do contador.");
    
    const current = parseFloat(readingValue);
    const previous = selectedHouse!.lastReading || 0;
    const consumption = current - previous;

    if (consumption < 0) {
      alert(`ERRO DE CONSISTÊNCIA:\nA leitura actual (${current} m³) não pode ser inferior à anterior (${previous} m³).`);
      return;
    }

    // CÁLCULOS FINANCEIROS REAIS (70 MZN/m3)
    const valorConsumo = consumption * PRICE_PER_M3;
    const saldoAnterior = 0; // Pode ser dinâmico no futuro
    const totalPagar = valorConsumo + saldoAnterior;
    
    // DATA LIMITE (10 DIAS)
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() + 10);
    const dateLimitStr = dateLimit.toLocaleDateString('pt-PT').replace(/\//g, '-');
    
    const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const currentMonthStr = meses[new Date().getMonth()];
    const currentYear = new Date().getFullYear();

    const newReading: Reading = {
      id: `READ-${Date.now()}`,
      houseId: selectedHouse!.id,
      previousValue: previous,
      currentValue: current,
      consumption: consumption,
      status: 'pending',
      date: new Date().toISOString(),
      readerId: 'A106-Staff',
      photoUrl: capturedPhoto || undefined
    };

    // Atualização de estados
    const updatedOffline = [newReading, ...offlineReadings];
    setOfflineReadings(updatedOffline);
    localStorage.setItem('offline_readings', JSON.stringify(updatedOffline));

    const updatedReadings = [newReading, ...JSON.parse(localStorage.getItem('db_readings') || '[]')];
    localStorage.setItem('db_readings', JSON.stringify(updatedReadings));

    const updatedHouses = houses.map(h => 
      h.id === selectedHouse!.id 
      ? { ...h, lastReading: current, lastReadingDate: new Date().toISOString().split('T')[0] } 
      : h
    );
    setHouses(updatedHouses);
    localStorage.setItem('db_houses', JSON.stringify(updatedHouses));

    // Dados para Notificação (TEMPLATE CLIENTE)
    setLastSubmittedReading({
      ...newReading,
      ownerName: selectedHouse!.ownerName,
      phoneNumber: selectedHouse!.phoneNumber,
      meterId: selectedHouse!.meterId,
      period: `${currentMonthStr}/${currentYear}`,
      valorConsumo: valorConsumo.toFixed(2),
      saldoAnterior: saldoAnterior.toFixed(2),
      totalPagar: totalPagar.toFixed(2),
      dataLimite: dateLimitStr
    });
    
    setShowSuccessModal(true);
    setActiveStep('list');
    setSelectedHouse(null);
    setReadingValue('');
    setCapturedPhoto(null);
  };

  const buildMessageTemplate = () => {
    if (!lastSubmittedReading) return "";
    return `Caro ${lastSubmittedReading.ownerName.toUpperCase()} (${lastSubmittedReading.houseId}/${lastSubmittedReading.meterId}), Receba os dados do consumo de ${lastSubmittedReading.period}: L.Anterior: ${lastSubmittedReading.previousValue}; L.Actual: ${lastSubmittedReading.currentValue}; Valor do consumo: ${lastSubmittedReading.valorConsumo} MZN; Saldo anterior: ${lastSubmittedReading.saldoAnterior} MZN; Total do Valor a pagar: ${lastSubmittedReading.totalPagar} MZN; Data Limite: ${lastSubmittedReading.dataLimite}. Evite o corte! Apoio ou Reclamações: ${SUPPORT_CONTACT}`;
  };

  const sendWhatsAppAlert = () => {
    if (!lastSubmittedReading) return;
    const msg = encodeURIComponent(buildMessageTemplate());
    const cleanPhone = lastSubmittedReading.phoneNumber.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
  };

  const sendSMSAlert = () => {
    if (!lastSubmittedReading) return;
    const template = buildMessageTemplate();
    // Simulação de gateway de SMS (em produção chamaria uma API como Twilio/Infobip)
    alert(`SMS ENVIADO PARA: ${lastSubmittedReading.phoneNumber}\n\nCONTEÚDO:\n${template}\n\n(Enviado via Gateway SMS Água Mali - 2026)`);
  };

  const handleSync = () => {
    if (offlineReadings.length === 0) return alert("Sem dados para sincronizar.");
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      alert("✓ SINCRONIZAÇÃO COMPLETA\nDados integrados na Nuvem Água Mali.");
    }, 1500);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return activeStep === 'list' ? (
          <DashboardView 
            pendingCount={offlineReadings.length}
            turnoActive={turnoActive}
            onToggleTurno={toggleTurno}
            onSync={handleSync}
            syncing={syncing}
            houses={houses}
            onSelectHouse={handleStartReading}
          />
        ) : (
          <CaptureView 
            house={selectedHouse!} 
            onBack={() => { setActiveStep('list'); setReadingValue(''); setCapturedPhoto(null); }}
            readingValue={readingValue}
            setReadingValue={setReadingValue}
            isCameraActive={isCameraActive}
            videoRef={videoRef}
            captureSnapshot={captureSnapshot}
            capturedPhoto={capturedPhoto}
            setCapturedPhoto={setCapturedPhoto}
            onUploadClick={() => fileInputRef.current?.click()}
            onSubmit={handleSubmitReading}
            pricePerM3={PRICE_PER_M3}
          />
        );
      case 'houses': return <HouseManagement />;
      case 'users': return <UserManagement />;
      case 'validation': return <ReadingValidation />;
      case 'leaks': return <LeakManagement />;
      case 'issuance': return <IssuanceManagement />;
      case 'history': return <HistoryView readings={offlineReadings} />;
      default: return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-32 px-4">
      <canvas ref={canvasRef} className="hidden"></canvas>
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
        if (e.target.files?.[0]) {
          const reader = new FileReader();
          reader.onload = (ev) => setCapturedPhoto(ev.target?.result as string);
          reader.readAsDataURL(e.target.files[0]);
        }
      }} />

      {renderContent()}

      {/* Pop-up de Confirmação e Envio Notificação */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-xl z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[3.5rem] shadow-2xl overflow-hidden border-4 border-white animate-in zoom-in-95 duration-500">
            <div className="bg-green-500 p-10 text-white text-center relative">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white/30">
                <Check className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black">Leitura Gravada!</h3>
              <p className="text-green-100 font-bold text-[10px] uppercase tracking-widest mt-2">Cálculo Real: {PRICE_PER_M3} MZN/m³</p>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="bg-gray-50 p-6 rounded-[2.5rem] border-2 border-gray-100 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Subtotal Consumo</span>
                  <span className="text-2xl font-black text-secondary">{lastSubmittedReading?.valorConsumo} MZN</span>
                </div>
                <div className="h-px bg-gray-200"></div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total a Pagar</span>
                  <span className="text-2xl font-black text-red-600">{lastSubmittedReading?.totalPagar} MZN</span>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-center text-[9px] font-black text-gray-400 uppercase tracking-widest">Enviar Fatura via:</p>
                <div className="grid grid-cols-1 gap-3">
                  <button 
                    onClick={sendWhatsAppAlert}
                    className="flex items-center justify-center bg-[#25D366] text-white py-5 rounded-[1.5rem] font-black text-[10px] tracking-widest uppercase hover:scale-105 transition-all shadow-lg"
                  >
                    <MessageCircle className="w-5 h-5 mr-3" /> WHATSAPP
                  </button>
                  <button 
                    onClick={sendSMSAlert}
                    className="flex items-center justify-center bg-secondary text-white py-5 rounded-[1.5rem] font-black text-[10px] tracking-widest uppercase hover:scale-105 transition-all shadow-lg"
                  >
                    <Smartphone className="w-5 h-5 mr-3" /> ENVIAR VIA SMS
                  </button>
                </div>
              </div>

              <button 
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-4 text-gray-400 font-black text-[10px] tracking-widest uppercase hover:text-secondary transition-colors"
              >
                Voltar à Rota
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reader Navigation */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-xl border-2 border-gray-100 flex items-center justify-around px-6 py-4 z-50 shadow-[0_20px_60px_rgba(0,0,0,0.1)] rounded-[2.5rem] w-[95%] max-w-4xl overflow-x-auto no-scrollbar">
        <NavButton active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setActiveStep('list'); }} icon={LayoutDashboard} label="Início" />
        <NavButton active={activeTab === 'houses'} onClick={() => setActiveTab('houses')} icon={Home} label="Casas" />
        <NavButton active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={UserIcon} label="Equipa" />
        <NavButton active={activeTab === 'validation'} onClick={() => setActiveTab('validation')} icon={Droplets} label="Validar" />
        <NavButton active={activeTab === 'leaks'} onClick={() => setActiveTab('leaks')} icon={AlertTriangle} label="Fugas" />
        <NavButton active={activeTab === 'issuance'} onClick={() => setActiveTab('issuance')} icon={MessageCircle} label="Avisos" />
        <NavButton active={activeTab === 'history'} onClick={() => setActiveTab('history')} icon={History} label="Envios" />
      </div>
    </div>
  );
};

const NavButton = ({ active, onClick, icon: Icon, label }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center min-w-[60px] group transition-all ${active ? 'text-primary scale-110' : 'text-gray-400 hover:text-secondary'}`}>
    <div className={`p-2.5 rounded-xl transition-all ${active ? 'bg-orange-50' : 'group-hover:bg-gray-50'}`}>
      <Icon className="w-5 h-5" />
    </div>
    <span className={`text-[8px] font-black uppercase tracking-widest mt-1 ${active ? 'opacity-100' : 'opacity-60'}`}>{label}</span>
  </button>
);

const DashboardView = ({ houses, onSelectHouse, pendingCount, turnoActive, onToggleTurno, onSync, syncing }: any) => (
  <div className="space-y-10 animate-in fade-in duration-500">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div>
        <h2 className="text-4xl font-black text-secondary tracking-tight uppercase">Operação de Campo</h2>
        <p className="text-gray-500 font-medium italic">Maputo - Santa Isabel | Fevereiro 2026</p>
      </div>
      <button 
        onClick={onToggleTurno}
        className={`px-10 py-5 rounded-[1.5rem] font-black text-[10px] tracking-[0.2em] uppercase shadow-2xl transition-all flex items-center border-4 border-white/20 w-full md:w-auto justify-center ${
          turnoActive ? 'bg-green-500 text-white shadow-green-200' : 'bg-gray-400 text-white'
        }`}
      >
        {turnoActive ? <><CheckCircle className="w-4 h-4 mr-3" /> TURNO ACTIVO</> : <><Play className="w-4 h-4 mr-3" /> INICIAR TURNO</>}
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-secondary p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
        <div className="relative z-10">
          <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest mb-4 opacity-70">Dados Pendentes</p>
          <h3 className="text-4xl font-black mb-10 tracking-tighter">{pendingCount} Leituras p/ Enviar</h3>
          <button onClick={onSync} disabled={syncing} className="bg-primary text-white px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl flex items-center hover:scale-105 transition-all disabled:opacity-50">
            {syncing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div> : <CloudUpload className="w-5 h-5 mr-3" />}
            SINCRONIZAR CLOUD
          </button>
        </div>
        <Wifi className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10 group-hover:scale-110 transition-transform" />
      </div>

      <div className="bg-white p-10 rounded-[3rem] shadow-xl border-2 border-gray-50 flex flex-col justify-center">
        <div className="flex items-center space-x-6">
          <div className="bg-orange-50 p-6 rounded-[2rem] text-primary shadow-inner"><Droplets className="w-10 h-10" /></div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Taxa de Consumo</p>
            <p className="text-2xl font-black text-secondary uppercase tracking-tight">70.00 MZN / m³</p>
          </div>
        </div>
      </div>
    </div>

    <div className="space-y-6">
      <div className="flex items-center justify-between px-4">
        <h3 className="text-2xl font-black text-secondary uppercase tracking-tight">Clientes em Rota</h3>
        <div className="bg-gray-100 px-6 py-2 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest">ID A106</div>
      </div>
      
      <div className="space-y-4">
        {houses.map((house: House) => (
          <div key={house.id} className="bg-white p-8 rounded-[3rem] shadow-xl border-2 border-transparent hover:border-primary/20 transition-all group flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-blue-50 rounded-[1.5rem] flex items-center justify-center mr-6 text-secondary group-hover:bg-primary/10 group-hover:text-primary transition-all">
                <Home className="w-8 h-8" />
              </div>
              <div>
                <p className="text-xl font-black text-gray-900">{house.ownerName}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{house.id} • {house.meterId}</p>
              </div>
            </div>
            <button 
              onClick={() => onSelectHouse(house)}
              className="p-5 bg-primary text-white rounded-[1.5rem] shadow-xl hover:scale-110 transition-all"
            >
              <Camera className="w-8 h-8" />
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const CaptureView = ({ house, onBack, readingValue, setReadingValue, isCameraActive, videoRef, captureSnapshot, capturedPhoto, setCapturedPhoto, onUploadClick, onSubmit, pricePerM3 }: any) => {
  const consumoEstimado = readingValue ? (parseFloat(readingValue) - (house.lastReading || 0)) : 0;
  const valorEstimado = consumoEstimado > 0 ? (consumoEstimado * pricePerM3).toFixed(2) : "0.00";

  return (
    <div className="space-y-8 animate-in slide-in-from-right-10 duration-500">
      <div className="flex items-center space-x-6">
        <button onClick={onBack} className="p-5 bg-white border-2 border-gray-100 rounded-2xl text-gray-400 hover:text-secondary shadow-sm transition-all"><ArrowLeft className="w-6 h-6" /></button>
        <div>
          <h3 className="text-3xl font-black text-secondary tracking-tight">{house.ownerName}</h3>
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{house.id}</p>
        </div>
      </div>

      <div className="bg-white p-6 md:p-10 rounded-[3rem] shadow-2xl border-4 border-white space-y-8">
        <div className="relative aspect-video bg-gray-900 rounded-[2rem] overflow-hidden flex items-center justify-center border-4 border-gray-50 shadow-inner">
          {capturedPhoto ? (
            <img src={capturedPhoto} className="w-full h-full object-cover" alt="Contador" />
          ) : isCameraActive ? (
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover"></video>
          ) : (
            <div className="text-white text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Aguardando Câmara...</div>
          )}

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-4 px-6 py-4 bg-black/60 backdrop-blur-2xl rounded-full border border-white/20 shadow-2xl">
            <button onClick={(e) => { e.stopPropagation(); onUploadClick(); }} className="p-3 text-white hover:text-primary transition-all"><Upload className="w-5 h-5" /></button>
            {!capturedPhoto ? (
              <button onClick={(e) => { e.stopPropagation(); captureSnapshot(); }} className="w-14 h-14 rounded-full border-4 border-white flex items-center justify-center bg-red-500 hover:scale-110 active:scale-90 transition-all shadow-xl">
                <div className="w-6 h-6 bg-white rounded-full"></div>
              </button>
            ) : (
              <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-white shadow-xl"><Check className="w-7 h-7" /></div>
            )}
            <button onClick={(e) => { e.stopPropagation(); setCapturedPhoto(null); }} className="p-3 text-white hover:text-red-400 transition-all"><X className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 p-8 rounded-[2.5rem] border-2 border-gray-100">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 text-center">Valor Actual do Contador (m³)</label>
            <input 
              type="number" 
              className="w-full bg-transparent border-none outline-none font-black text-6xl text-center text-secondary tracking-tighter placeholder:text-gray-200"
              placeholder="0000"
              value={readingValue}
              onChange={(e) => setReadingValue(e.target.value)}
            />
            <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between items-center">
              <div className="text-center flex-1 border-r border-gray-200">
                <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Anterior</p>
                <p className="font-black text-gray-600">{house.lastReading || 0} m³</p>
              </div>
              <div className="text-center flex-1">
                <p className="text-[9px] font-black text-primary uppercase mb-1">Cálculo 70 MZN</p>
                <p className="font-black text-primary text-xl">{valorEstimado} MZN</p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={onSubmit} 
            className="w-full bg-primary text-white py-8 rounded-[2rem] font-black text-sm tracking-widest uppercase shadow-2xl hover:scale-[1.02] active:scale-95 transition-all border-4 border-white/20 flex items-center justify-center space-x-4"
          >
            <Send className="w-6 h-6" />
            <span>GERAR FATURA & ENVIAR</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const HistoryView = ({ readings }: any) => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="flex justify-between items-center">
      <h3 className="text-3xl font-black text-secondary tracking-tight uppercase">Histórico de Hoje</h3>
      <div className="bg-primary/10 px-6 py-2 rounded-xl text-[10px] font-black text-primary uppercase tracking-widest">DEX-FIELD</div>
    </div>
    <div className="space-y-4">
      {readings.length === 0 ? (
        <div className="py-24 bg-white rounded-[3rem] border-4 border-dashed border-gray-100 text-center flex flex-col items-center justify-center">
          <History className="w-16 h-16 text-gray-200 mb-6" />
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Sem leituras registadas nesta sessão.</p>
        </div>
      ) : readings.map((r: any) => (
        <div key={r.id} className="bg-white p-6 rounded-[2rem] shadow-xl border-2 border-gray-50 flex justify-between items-center group">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mr-4"><CheckCircle className="w-6 h-6" /></div>
            <div>
              <p className="font-black text-gray-900">{r.houseId}</p>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{r.currentValue} m³ • {new Date(r.date).toLocaleTimeString()}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
             <span className="bg-blue-50 text-secondary text-[9px] font-black px-4 py-1.5 rounded-lg uppercase tracking-widest">SINCRONIZADO</span>
             <button className="p-3 bg-gray-50 rounded-xl text-primary"><ArrowRight className="w-4 h-4" /></button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ReaderDashboard;
