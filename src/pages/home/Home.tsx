import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Heart, Clock, ChevronDown, HeartHandshake, Church, Building2, Calendar, MapPin, ArrowLeft, User } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState, useEffect } from "react";

const PAROQUIAS = [
  { id: "1", name: "Catedral Nossa Senhora da Glória", 
    campanhas: [
      { id: "1", titulo: "Reforma do Altar", descricao: "Contribua para a renovação do nosso altar", meta: "R$ 50.000,00", progresso: 75, arrecadado: "R$ 37.500,00", dataInicio: "01/01/2025", dataFim: "31/12/2025", responsavel: "Pe. João Silva", categoria: "Infraestrutura" },
      { id: "2", titulo: "Cesta Básica", descricao: "Ajude famílias necessitadas com alimentos", meta: "R$ 10.000,00", progresso: 90, arrecadado: "R$ 9.000,00", dataInicio: "01/01/2025", dataFim: "31/12/2025", responsavel: "Pe. Maria Santos", categoria: "Ação Social" },
      { id: "3", titulo: "Projeto Música Sacra", descricao: "Apoie a aquisição de instrumentos musicais", meta: "R$ 25.000,00", progresso: 45, arrecadado: "R$ 11.250,00", dataInicio: "01/01/2025", dataFim: "31/12/2025", responsavel: "Pe. Carlos Oliveira", categoria: "Cultura" }
    ]
  },
  { id: "2", name: "Paróquia São José Operário",
    campanhas: [
      { id: "4", titulo: "Natal Solidário", descricao: "Doe para as famílias carentes neste Natal", meta: "R$ 15.000,00", progresso: 80, arrecadado: "R$ 12.000,00", dataInicio: "01/11/2025", dataFim: "25/12/2025", responsavel: "Pe. José Pereira", categoria: "Ação Social" },
      { id: "5", titulo: "Reforma da Igreja", descricao: "Ajude na manutenção da estrutura da igreja", meta: "R$ 40.000,00", progresso: 25, arrecadado: "R$ 10.000,00", dataInicio: "01/01/2025", dataFim: "31/12/2025", responsavel: "Pe. Antônio Costa", categoria: "Infraestrutura" },
      { id: "6", titulo: "Projeto Catequese", descricao: "Apoie a formação catequética das crianças", meta: "R$ 12.000,00", progresso: 70, arrecadado: "R$ 8.400,00", dataInicio: "01/01/2025", dataFim: "31/12/2025", responsavel: "Pe. Ana Maria", categoria: "Formação" }
    ]
  },
  { id: "3", name: "Paróquia Nossa Senhora do Carmo",
    campanhas: [
      { id: "7", titulo: "Reforma do Salão Paroquial", descricao: "Ajude na reforma do nosso espaço comunitário", meta: "R$ 30.000,00", progresso: 65, arrecadado: "R$ 19.500,00", dataInicio: "01/01/2025", dataFim: "31/12/2025", responsavel: "Pe. Francisco Lima", categoria: "Infraestrutura" },
      { id: "8", titulo: "Projeto Juventude", descricao: "Apoie atividades para jovens da paróquia", meta: "R$ 22.000,00", progresso: 35, arrecadado: "R$ 7.700,00", dataInicio: "01/01/2025", dataFim: "31/12/2025", responsavel: "Pe. Roberto Silva", categoria: "Juventude" },
      { id: "9", titulo: "Ação Social", descricao: "Contribua para projetos sociais da paróquia", meta: "R$ 16.000,00", progresso: 85, arrecadado: "R$ 13.600,00", dataInicio: "01/01/2025", dataFim: "31/12/2025", responsavel: "Pe. Lucia Santos", categoria: "Ação Social" }
    ]
  },
  { id: "4", name: "Paróquia Nossa Senhora Aparecida",
    campanhas: [
      { id: "10", titulo: "Projeto Social Juventude", descricao: "Apoie nossos jovens com atividades e formação", meta: "R$ 20.000,00", progresso: 50, arrecadado: "R$ 10.000,00", dataInicio: "01/01/2025", dataFim: "31/12/2025", responsavel: "Pe. Pedro Costa", categoria: "Juventude" },
      { id: "11", titulo: "Reforma da Igreja", descricao: "Contribua para a manutenção da igreja", meta: "R$ 38.000,00", progresso: 30, arrecadado: "R$ 11.400,00", dataInicio: "01/01/2025", dataFim: "31/12/2025", responsavel: "Pe. Marcos Silva", categoria: "Infraestrutura" },
      { id: "12", titulo: "Ação Caritativa", descricao: "Apoie ações de caridade da paróquia", meta: "R$ 15.000,00", progresso: 80, arrecadado: "R$ 12.000,00", dataInicio: "01/01/2025", dataFim: "31/12/2025", responsavel: "Pe. Teresa Lima", categoria: "Ação Social" }
    ]
  }
];

const EVENTOS_DIOCESANOS = [
  {
    id: "1",
    titulo: "Encontro de Jovens da Diocese",
    descricao: "Retiro espiritual para jovens de todas as paróquias da diocese, com momentos de oração, formação e confraternização.",
    data: "15-17 de Março, 2025",
    local: "Centro de Retiros São José"
  },
  {
    id: "2",
    titulo: "Celebração do Crisma",
    descricao: "Cerimônia de confirmação dos jovens que completaram a catequese, presidida pelo Bispo Diocesano.",
    data: "29 de Março, 2025",
    local: "Catedral Nossa Senhora da Glória"
  },
  {
    id: "3",
    titulo: "Peregrinação Diocesana",
    descricao: "Rompia anual da diocese ao Santuário de Nossa Senhora Aparecida, com missa e momentos de devoção.",
    data: "12 de Abril, 2025",
    local: "Santuário Nacional"
  }
];

const Home = () => {
  const navigate = useNavigate();
  const [paroquiaSelecionada, setParoquiaSelecionada] = useState<string | null>(null);
  const [campanhaAtual, setCampanhaAtual] = useState(0);
  const [eventoAtual, setEventoAtual] = useState(0);
  const [paroquiaSearch, setParoquiaSearch] = useState("");
  const [showTrocarParoquiaModal, setShowTrocarParoquiaModal] = useState(false);
  const [modalParoquiaSearch, setModalParoquiaSearch] = useState("");
  const [isSkeletonMode, setIsSkeletonMode] = useState(false);
  const [selectedParoquiaIndex, setSelectedParoquiaIndex] = useState(-1);
  const campanhas = paroquiaSelecionada ? PAROQUIAS.find(p => p.id === paroquiaSelecionada)?.campanhas || [] : [];
  
  const modalFilteredParoquias = PAROQUIAS.filter(paroquia => {
    const searchTerm = modalParoquiaSearch.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''); // Remove acentos
    
    const paroquiaName = paroquia.name.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''); // Remove acentos
    
    return paroquiaName.includes(searchTerm);
  });
  
  const filteredParoquias = PAROQUIAS.filter(paroquia => {
    const searchTerm = paroquiaSearch.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''); // Remove acentos
    
    const paroquiaName = paroquia.name.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''); // Remove acentos
    
    return paroquiaName.includes(searchTerm);
  });

  useEffect(() => {
    const paroquiaSalva = localStorage.getItem('paroquiaSelecionada');
    const timestamp = localStorage.getItem('paroquiaSelecionadaTimestamp');
    
    if (paroquiaSalva && timestamp) {
      const agora = Date.now();
      const tempoSelecao = parseInt(timestamp);
      const diferencaHoras = (agora - tempoSelecao) / (1000 * 60 * 60);
      
      if (diferencaHoras < 24) {
        setParoquiaSelecionada(paroquiaSalva);
      } else {
        localStorage.removeItem('paroquiaSelecionada');
        localStorage.removeItem('paroquiaSelecionadaTimestamp');
      }
    }
  }, []);

  useEffect(() => {
    if (!paroquiaSelecionada) {
      setIsSkeletonMode(true); // Ativar modo skeleton
      setShowTrocarParoquiaModal(true); // Abrir modal automaticamente
    } else {
      setIsSkeletonMode(false); // Desativar modo skeleton
      setShowTrocarParoquiaModal(false); // Fechar modal
    }
  }, [paroquiaSelecionada]);

  const proximaCampanha = () => {
    setCampanhaAtual((prev) => (prev + 1) % campanhas.length);
  };

  const campanhaAnterior = () => {
    setCampanhaAtual((prev) => (prev - 1 + campanhas.length) % campanhas.length);
  };

  const proximoEvento = () => {
    setEventoAtual((prev) => (prev + 1) % EVENTOS_DIOCESANOS.length);
  };

  const eventoAnterior = () => {
    setEventoAtual((prev) => (prev - 1 + EVENTOS_DIOCESANOS.length) % EVENTOS_DIOCESANOS.length);
  };

  const handleParoquiaChange = (paroquiaId: string) => {
    setParoquiaSelecionada(paroquiaId);
    localStorage.setItem('paroquiaSelecionada', paroquiaId);
    localStorage.setItem('paroquiaSelecionadaTimestamp', Date.now().toString());
    setCampanhaAtual(0); // Reset para primeira campanha
  };

  const handleParoquiaSelect = (paroquiaId: string) => {
    setParoquiaSelecionada(paroquiaId);
    setParoquiaSearch(""); // Limpar busca
    localStorage.setItem('paroquiaSelecionada', paroquiaId);
    localStorage.setItem('paroquiaSelecionadaTimestamp', Date.now().toString());
    setCampanhaAtual(0); // Reset para primeira campanha
  };

  const handleModalParoquiaSelect = (paroquiaId: string) => {
    setParoquiaSelecionada(paroquiaId);
    setShowTrocarParoquiaModal(false); // Fechar modal
    setModalParoquiaSearch(""); // Limpar busca da modal
    setSelectedParoquiaIndex(-1); // Reset índice selecionado
    localStorage.setItem('paroquiaSelecionada', paroquiaId);
    localStorage.setItem('paroquiaSelecionadaTimestamp', Date.now().toString());
    setCampanhaAtual(0); // Reset para primeira campanha
  };

  const handleModalKeyDown = (e: React.KeyboardEvent) => {
    if (!modalFilteredParoquias.length) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedParoquiaIndex(prev => 
          prev < modalFilteredParoquias.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedParoquiaIndex(prev => 
          prev > 0 ? prev - 1 : modalFilteredParoquias.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedParoquiaIndex >= 0 && selectedParoquiaIndex < modalFilteredParoquias.length) {
          handleModalParoquiaSelect(modalFilteredParoquias[selectedParoquiaIndex].id);
        }
        break;
      case 'Escape':
        if (paroquiaSelecionada) {
          e.preventDefault();
          setShowTrocarParoquiaModal(false);
          setModalParoquiaSearch("");
          setSelectedParoquiaIndex(-1);
        }
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-400 to-slate-600 relative">
      <div className="relative min-h-screen flex flex-col">
        {/* Link direto para Dízimo */}
        <div className="absolute top-4 right-4">
          <div
                                    onClick={() => navigate(`/dizimo?cpf=11111111111&scope=paroquia&parishId=${paroquiaSelecionada || '1'}&checkoutId=60`)}
            className="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-white/10 rounded-full transition-colors"
            style={{ pointerEvents: paroquiaSelecionada ? 'auto' : 'none', opacity: paroquiaSelecionada ? 0 : 0 }}
          >
            <User className="h-5 w-5 text-white" />
          </div>
        </div>
        


        {/* Headers - Sempre visíveis, mas com estado skeleton quando não há paróquia */}
        {(() => true)() && (
          <>
            {/* Header Mobile - Largura Total da Tela - Otimizado */}
            <div className="md:hidden mb-6">
              <div className="bg-slate-800/95 backdrop-blur-sm shadow-xl py-3 px-4 text-white border-b border-slate-600/30 w-full">
                <div className="max-w-7xl mx-auto px-4">
                  {/* Nome da Diocese e Paróquia + Botão Trocar Paróquia - Lado a Lado */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                        <Church className="h-4 w-4 text-white" />
            </div>
                      <div>
                        <h1 className="text-base font-semibold text-white mb-0">DIOCESE DE MARINGÁ</h1>
                        <p className="text-sm text-white/80 font-medium -mt-1">
                          {paroquiaSelecionada 
                            ? PAROQUIAS.find(p => p.id === paroquiaSelecionada)?.name
                            : "Selecione uma paróquia"
                          }
              </p>
            </div>
          </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowTrocarParoquiaModal(true)}
                      className={`h-10 w-10 p-0 rounded-lg border transition-all duration-300 ${
                        paroquiaSelecionada
                          ? 'text-white/70 hover:text-white hover:bg-white/20 border-white/20'
                          : 'text-white/50 border-white/10 bg-white/5'
                      }`}
                      title={paroquiaSelecionada ? 'Trocar Paróquia' : 'Selecionar Paróquia'}
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                    </Button>
        </div>

                  {/* SELECT ANTERIOR - PRESERVADO PARA USO FUTURO */}
                  {/* 
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <Select value={paroquiaSelecionada} onValueChange={handleParoquiaChange}>
                        <SelectTrigger className="h-10 text-sm border-white/20 focus:border-white/40 focus:ring-white/40 bg-white/10 text-white placeholder:text-white/70 rounded-lg w-full">
                          <SelectValue placeholder="Escolher paróquia..." />
                        </SelectTrigger>
                        <SelectContent>
                          {PAROQUIAS.map((paroquia) => (
                            <SelectItem key={paroquia.id} value={paroquia.id}>
                              <div className="flex items-center gap-2">
                      <Church className="h-4 w-4 text-blue-600" />
                                <span>{paroquia.name}</span>
                        </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                          
                          <Button
                      variant="ghost"
                            size="sm"
                            onClick={() => {
                        setParoquiaSelecionada(null);
                              localStorage.removeItem('paroquiaSelecionada');
                              localStorage.removeItem('paroquiaSelecionadaTimestamp');
                              setCampanhaAtual(0);
                            }}
                      className="h-10 w-10 p-0 text-white/70 hover:text-white hover:bg-white/20 rounded-lg flex-shrink-0"
                          >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                          </Button>
                        </div>
                  */}
                          </div>
                            </div>
                        </div>
                        
            {/* Header Desktop - Largura Total da Tela - Mantém Texto */}
            <div className="hidden md:block mb-6">
              <div className="bg-slate-800/95 backdrop-blur-sm shadow-xl py-4 px-6 text-white border-b border-slate-600/30 w-full">
                <div className="max-w-7xl mx-auto px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                        <Church className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h1 className="text-xl font-semibold text-white mb-0">DIOCESE DE MARINGÁ</h1>
                        <p className="text-sm text-white/80 -mt-1">
                          {paroquiaSelecionada 
                            ? PAROQUIAS.find(p => p.id === paroquiaSelecionada)?.name
                            : "Selecione uma paróquia"
                          }
                        </p>
                      </div>
                  </div>
                  
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowTrocarParoquiaModal(true)}
                      className={`h-10 px-4 rounded-lg border transition-all duration-300 ${
                        paroquiaSelecionada
                          ? 'text-white/70 hover:text-white hover:bg-white/20 border-white/20'
                          : 'text-white/50 border-white/10 bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                        {paroquiaSelecionada ? 'Trocar Paróquia' : 'Selecionar Paróquia'}
                      </div>
                    </Button>

                    {/* SELECT ANTERIOR - PRESERVADO PARA USO FUTURO */}
                    {/* 
                    <div className="flex gap-3 items-center">
                      <Select value={paroquiaSelecionada} onValueChange={handleParoquiaChange}>
                        <SelectTrigger className="h-10 text-sm border-white/20 focus:border-white/40 focus:ring-white/40 bg-white/10 text-white placeholder:text-white/70 min-w-[240px] rounded-lg">
                          <SelectValue placeholder="Escolher paróquia..." />
                        </SelectTrigger>
                        <SelectContent>
                          {PAROQUIAS.map((paroquia) => (
                            <SelectItem key={paroquia.id} value={paroquia.id}>
                              <div className="flex items-center gap-2">
                                <Church className="h-4 w-4 text-blue-600" />
                                <span>{paroquia.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                        <Button
                        variant="ghost"
                          size="sm"
                          onClick={() => {
                                                  setParoquiaSelecionada(null);
                            localStorage.removeItem('paroquiaSelecionada');
                            localStorage.removeItem('paroquiaSelecionadaTimestamp');
                            setCampanhaAtual(0);
                          }}
                        className="h-10 w-10 p-0 text-white/70 hover:text-white hover:bg-white/20 rounded-lg"
                        >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        </Button>
                      </div>
                    */}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Layout Principal - Sistema de Navegação Intuitivo */}
        <div className="max-w-7xl mx-auto w-full px-4 md:px-6 mb-8">
          
          {/* Mobile Layout - Portal Compacto - Otimizado */}
          <div className="md:hidden space-y-4">

            {/* Módulos Disponíveis da Paróquia - Mobile - Otimizado */}
            {(() => true)() && (
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 p-3">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-1.5 rounded-t-lg -mt-3 -mx-3 mb-4"></div>
                <h3 className="text-base font-semibold text-slate-800 mb-3 text-center flex items-center justify-center gap-2">
                  <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  Módulos Disponíveis da Paróquia
                </h3>
                
                {/* Grid 2x2 para melhor aproveitamento do espaço */}
                <div className="grid grid-cols-2 gap-3">
                  <Card 
                    className={`group relative overflow-hidden border-0 bg-gradient-to-br from-red-50 to-red-100 shadow-sm transition-all duration-300 ${
                      !isSkeletonMode 
                        ? 'cursor-pointer hover:from-red-100 hover:to-red-200 hover:shadow-md hover:-translate-y-1' 
                        : 'cursor-not-allowed opacity-60'
                    }`}
                    onClick={!isSkeletonMode ? () => navigate(`/dizimo?parishId=${paroquiaSelecionada}`) : undefined}>
                    <CardContent className="p-3">
                      <div className="text-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-500 rounded-xl flex items-center justify-center group-hover:from-red-500 group-hover:to-red-600 transition-all duration-300 shadow-lg mx-auto mb-2">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </div>
                        <h4 className="font-bold text-red-700 text-sm mb-1">Dízimo</h4>
                        <p className="text-xs text-red-600/80 leading-tight">Contribuição mensal</p>
                  </div>
                </CardContent>
              </Card>

                      <Card 
                    className={`group relative overflow-hidden border-0 bg-gradient-to-br from-emerald-50 to-emerald-100 shadow-sm transition-all duration-300 ${
                      !isSkeletonMode 
                        ? 'cursor-pointer hover:from-emerald-100 hover:to-emerald-200 hover:shadow-md hover:-translate-y-1' 
                        : 'cursor-not-allowed opacity-60'
                    }`}
                    onClick={!isSkeletonMode ? () => navigate(`/oferta?parishId=${paroquiaSelecionada}`) : undefined}>
                    <CardContent className="p-3">
                      <div className="text-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl flex items-center justify-center group-hover:from-emerald-500 group-hover:to-emerald-600 transition-all duration-300 shadow-lg mx-auto mb-2">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                          </svg>
                        </div>
                        <h4 className="font-bold text-emerald-700 text-sm mb-1">Oferta</h4>
                        <p className="text-xs text-emerald-600/80 leading-tight">Doação voluntária</p>
                      </div>
                        </CardContent>
                      </Card>

                      <Card 
                    className={`group relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-blue-100 shadow-sm transition-all duration-300 ${
                      !isSkeletonMode 
                        ? 'cursor-pointer hover:from-blue-100 hover:to-blue-200 hover:shadow-md hover:-translate-y-1' 
                        : 'cursor-not-allowed opacity-60'
                    }`}
                    onClick={!isSkeletonMode ? () => navigate(`/horario-missa?parishId=${paroquiaSelecionada}`) : undefined}>
                    <CardContent className="p-3">
                      <div className="text-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center group-hover:from-blue-500 group-hover:to-blue-600 transition-all duration-300 shadow-lg mx-auto mb-2">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h4 className="font-bold text-blue-700 text-sm mb-1">Horários</h4>
                        <p className="text-xs text-blue-600/80 leading-tight">Missas e eventos</p>
                      </div>
                        </CardContent>
                      </Card>

                      <Card 
                    className={`group relative overflow-hidden border-0 bg-gradient-to-br from-slate-50 to-slate-100 shadow-sm transition-all duration-300 ${
                      !isSkeletonMode 
                        ? 'cursor-pointer hover:from-slate-100 hover:to-slate-200 hover:shadow-md hover:-translate-y-1' 
                        : 'cursor-not-allowed opacity-60'
                    }`}
                    onClick={!isSkeletonMode ? () => navigate(`/cadastro-dizimista?parishId=${paroquiaSelecionada}`) : undefined}>
                    <CardContent className="p-3">
                      <div className="text-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-slate-400 to-slate-500 rounded-xl flex items-center justify-center group-hover:from-slate-500 group-hover:to-slate-600 transition-all duration-300 shadow-lg mx-auto mb-2">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <h4 className="font-bold text-slate-700 text-sm mb-1">Cadastro</h4>
                        <p className="text-xs text-slate-600/80 leading-tight">Torne-se dizimista</p>
                      </div>
                        </CardContent>
                      </Card>
                </div>
              </div>
            )}

            {/* Campanhas Ativas - Mobile - Otimizado */}
            {(() => true)() && (
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 p-3">
                <h3 className="text-base font-semibold text-slate-800 mb-2 text-center flex items-center justify-center gap-2">
                  <div className="w-4 h-4 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-lg flex items-center justify-center">
                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </div>
                  Campanhas Ativas
                </h3>
                <p className="text-slate-600 text-center mb-2 text-sm">Projetos que precisam do seu apoio</p>
                
                <div className="space-y-2">
                  {campanhas.slice(0, 3).map((campanha) => (
                      <Card 
                      key={campanha.id}
                      className="cursor-pointer border-0 bg-gradient-to-r from-emerald-50 to-white hover:from-emerald-100 hover:shadow-md transition-all duration-300 group"
                                                  onClick={() => {
                              if (paroquiaSelecionada) {
                                navigate(`/campanha/${campanha.id}?parishId=${paroquiaSelecionada}`);
                              } else {
                                navigate(`/campanha/${campanha.id}?parishId=1`);
                              }
                            }}>
                      <CardContent className="p-2">
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-emerald-700 text-xs mb-1">{campanha.titulo}</h4>
                            <p className="text-xs text-slate-600 line-clamp-1 leading-tight">{campanha.descricao}</p>
                          </div>
                          <div className="w-5 h-5 bg-emerald-200 rounded-full flex items-center justify-center group-hover:bg-emerald-300 transition-colors self-center">
                            <svg className="w-2.5 h-2.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                        </CardContent>
                      </Card>
                  ))}
                  
                  {campanhas.length > 3 && (
                    <Button 
                      variant="outline" 
                      className="w-full text-sm h-10 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                      onClick={() => paroquiaSelecionada ? navigate(`/campanhas?parishId=${paroquiaSelecionada}`) : undefined}
                    >
                      Ver todas ({campanhas.length})
                    </Button>
                  )}
                    </div>
                  </div>
            )}

            {/* Agenda da Semana - Mobile - Otimizado */}
            {(() => true)() && (
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 p-3">
                <h3 className="text-base font-semibold text-slate-800 mb-2 text-center flex items-center justify-center gap-2">
                  <div className="w-4 h-4 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  Agenda da Semana
                </h3>
                <p className="text-slate-600 text-center mb-2 text-sm">Participe das atividades da comunidade</p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-indigo-50">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-lg flex items-center justify-center shadow-md">
                      <span className="text-xs font-bold text-white">D</span>
                </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-indigo-800">Missa Dominical</p>
                      <p className="text-xs text-indigo-600">10:00 - Igreja Principal</p>
                  </div>
                </div>
                  
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-indigo-50">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-lg flex items-center justify-center shadow-md">
                      <span className="text-xs font-bold text-white">T</span>
            </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-indigo-800">Catequese</p>
                      <p className="text-xs text-indigo-600">19:00 - Salão Paroquial</p>
          </div>
        </div>

                  <div className="flex items-center gap-2 p-2 rounded-lg bg-indigo-50">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-lg flex items-center justify-center shadow-md">
                      <span className="text-xs font-bold text-white">S</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-indigo-800">Missa Vespertina</p>
                      <p className="text-xs text-indigo-600">18:00 - Igreja Principal</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Desktop Layout - Portal Completo */}
          <div className="hidden md:block">

            {/* Dashboard de Contribuições */}
            {(() => true)() && (
              <div className="grid grid-cols-12 gap-6 auto-rows-fr">
                 
                {/* Coluna 1: Módulos Disponíveis da Paróquia */}
                <div className="col-span-5">
                  <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-0 h-full">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-t-lg"></div>
                    <CardHeader className="pb-6">
                      <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-3">
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                      </div>
                        Módulos Disponíveis da Paróquia
                      </CardTitle>
                      <p className="text-slate-600">Acesse os serviços e funcionalidades disponíveis</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Card 
                        className="cursor-pointer group relative overflow-hidden border-0 bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                        onClick={() => paroquiaSelecionada ? navigate(`/dizimo?parishId=${paroquiaSelecionada}`) : undefined}>
                        <CardContent className="p-5">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-red-400 to-red-500 rounded-xl flex items-center justify-center group-hover:from-red-500 group-hover:to-red-600 transition-all duration-300 shadow-lg">
                              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-red-700 text-lg mb-1">Dízimo</h4>
                              <p className="text-sm text-red-600/80">Contribuição mensal para manter a paróquia e suas atividades</p>
                            </div>
                            <div className="w-8 h-8 bg-red-200 rounded-full flex items-center justify-center group-hover:bg-red-300 transition-colors">
                              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card 
                        className="cursor-pointer group relative overflow-hidden border-0 bg-gradient-to-br from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                        onClick={() => paroquiaSelecionada ? navigate(`/oferta?parishId=${paroquiaSelecionada}`) : undefined}>
                        <CardContent className="p-5">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl flex items-center justify-center group-hover:from-emerald-500 group-hover:to-emerald-600 transition-all duration-300 shadow-lg">
                              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                              </svg>
                    </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-emerald-700 text-lg mb-1">Oferta</h4>
                              <p className="text-sm text-emerald-600/80">Doação voluntária para campanhas e projetos especiais</p>
                            </div>
                            <div className="w-8 h-8 bg-emerald-200 rounded-full flex items-center justify-center group-hover:bg-emerald-300 transition-colors">
                              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card 
                        className="cursor-pointer group relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                        onClick={() => paroquiaSelecionada ? navigate(`/horario-missa?parishId=${paroquiaSelecionada}`) : undefined}>
                        <CardContent className="p-5">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center group-hover:from-blue-500 group-hover:to-blue-600 transition-all duration-300 shadow-lg">
                              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-blue-700 text-lg mb-1">Horários</h4>
                              <p className="text-sm text-blue-600/80">Missas, eventos e atividades da comunidade</p>
                            </div>
                            <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center group-hover:bg-blue-300 transition-colors">
                              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card 
                        className="cursor-pointer group relative overflow-hidden border-0 bg-gradient-to-br from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                        onClick={() => paroquiaSelecionada ? navigate(`/cadastro-dizimista?parishId=${paroquiaSelecionada}`) : undefined}>
                        <CardContent className="p-5">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-slate-400 to-slate-500 rounded-xl flex items-center justify-center group-hover:from-slate-500 group-hover:to-slate-600 transition-all duration-300 shadow-lg">
                              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-slate-700 text-lg mb-1">Cadastro</h4>
                              <p className="text-sm text-slate-600/80">Torne-se um dizimista e participe da comunidade</p>
                            </div>
                            <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center group-hover:bg-slate-300 transition-colors">
                              <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </CardContent>
                  </Card>
                      </div>
                      
                {/* Coluna 2: Informações da Comunidade */}
                <div className="col-span-7">
                  <div className="space-y-6">
                    
                    {/* Campanhas Ativas */}
                    <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-0">
                      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 h-2 rounded-t-lg"></div>
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                          <div className="w-5 h-5 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-lg flex items-center justify-center">
                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                          </div>
                          Campanhas Ativas
                        </CardTitle>
                        <p className="text-slate-600">Projetos que precisam do seu apoio</p>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {campanhas.slice(0, 4).map((campanha) => (
                          <Card 
                            key={campanha.id}
                            className="cursor-pointer border-0 bg-gradient-to-r from-emerald-50 to-white hover:from-emerald-100 hover:shadow-md transition-all duration-300 group"
                            onClick={() => {
                              if (paroquiaSelecionada) {
                                navigate(`/campanha/${campanha.id}?parishId=${paroquiaSelecionada}`);
                              } else {
                                navigate(`/campanha/${campanha.id}?parishId=1`);
                              }
                            }}>
                            <CardContent className="p-3">
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                  </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-emerald-700 text-sm mb-1">{campanha.titulo}</h4>
                                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{campanha.descricao}</p>
                                </div>
                                <div className="w-6 h-6 bg-emerald-200 rounded-full flex items-center justify-center group-hover:bg-emerald-300 transition-colors self-center">
                                  <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                        
                        {campanhas.length > 4 && (
                      <Button 
                        variant="outline" 
                            className="w-full text-sm h-10 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                            onClick={() => paroquiaSelecionada ? navigate(`/campanhas?parishId=${paroquiaSelecionada}`) : undefined}
                      >
                            Ver todas ({campanhas.length})
                      </Button>
                        )}
            </CardContent>
          </Card>

                    {/* Agenda da Semana */}
                    <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-0">
                      <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-2 rounded-t-lg"></div>
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                          <div className="w-5 h-5 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                            <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          Agenda da Semana
                        </CardTitle>
                        <p className="text-slate-600">Participe das atividades da comunidade</p>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-indigo-50">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-lg flex items-center justify-center shadow-md">
                            <span className="text-sm font-bold text-white">D</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-indigo-800">Missa Dominical</p>
                            <p className="text-xs text-indigo-600">10:00 - Igreja Principal</p>
        </div>
            </div>

                        <div className="flex items-center gap-3 p-3 rounded-lg bg-indigo-50">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-lg flex items-center justify-center shadow-md">
                            <span className="text-sm font-bold text-white">T</span>
                      </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-indigo-800">Catequese</p>
                            <p className="text-xs text-indigo-600">19:00 - Salão Paroquial</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-indigo-50">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-lg flex items-center justify-center shadow-md">
                            <span className="text-sm font-bold text-white">S</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-indigo-800">Missa Vespertina</p>
                            <p className="text-xs text-indigo-600">18:00 - Igreja Principal</p>
                          </div>
                    </div>
                  </CardContent>
                </Card>
                  </div>
            </div>
          </div>
        )}

            {/* Estado sem paróquia selecionada - Card Moderno - REMOVIDO */}
            {(() => false)() && (
              <div className="flex items-center justify-center min-h-screen px-4">
                <div className="relative max-w-lg w-full">
                  {/* Card Principal com Design Moderno */}
                  <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20 text-center relative overflow-hidden">
                    {/* Elementos Decorativos de Fundo */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500"></div>
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-60"></div>
                    <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-full opacity-40"></div>
                    
                    {/* Conteúdo Principal */}
                    <div className="relative z-10">
                      {/* Ícone com Design Glassmorphism */}
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg backdrop-blur-sm border border-white/20">
                        <Church className="h-10 w-10 text-white" />
                      </div>
                      
                      {/* Título com Gradiente */}
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                        Diocese de Maringá
                      </h2>
                      
                      {/* Subtítulo */}
                      <p className="text-slate-600 text-lg leading-relaxed mb-6">
                        Para acessar os módulos de contribuição, pesquise e selecione sua paróquia:
                      </p>
                      
                      {/* Campo de Busca Moderno */}
                      <div className="space-y-4">
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-all duration-300 ease-out transform group-focus-within:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                    </div>
                          <input
                            type="text"
                            placeholder="Digite o nome da sua paróquia..."
                            value={paroquiaSearch}
                            onChange={(e) => setParoquiaSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 placeholder-slate-400 bg-white/80 backdrop-blur-sm transition-all duration-300 ease-out hover:border-slate-300 transform hover:scale-[1.02] focus:scale-[1.02]"
                          />
                          {/* Indicador de foco animado */}
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                        </div>
                        
                        {/* Lista de Paróquias Filtradas com Design Moderno e Animações Fluidas */}
                        <div className={`transition-all duration-500 ease-out transform ${
                          paroquiaSearch ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                        }`}>
                          {paroquiaSearch && (
                            <div className="max-h-64 overflow-y-auto border-2 border-slate-200 rounded-xl bg-white/90 backdrop-blur-sm shadow-lg animate-in slide-in-from-top-2 duration-300">
                              {filteredParoquias.length > 0 ? (
                                <div className="space-y-0.5 p-2">
                                  {filteredParoquias.map((paroquia, index) => (
                                    <button
                                      key={paroquia.id}
                                      onClick={() => handleParoquiaSelect(paroquia.id)}
                                      onMouseEnter={(e) => e.currentTarget.classList.add('ring-2', 'ring-blue-200', 'ring-opacity-50')}
                                      onMouseLeave={(e) => e.currentTarget.classList.remove('ring-2', 'ring-blue-200', 'ring-opacity-50')}
                                      className="w-full text-left p-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all duration-300 flex items-center gap-3 group border border-transparent hover:border-blue-200 hover:shadow-md animate-in slide-in-from-left-2 duration-300 cursor-pointer"
                                      style={{
                                        animationDelay: `${index * 50}ms`,
                                        animationFillMode: 'both'
                                      }}
                                    >
                                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 ease-out">
                                        <Church className="h-5 w-5 text-white" />
                      </div>
                                      <div className="flex-1">
                                        <p className="font-semibold text-slate-800 group-hover:text-blue-700 transition-all duration-300">{paroquia.name}</p>
                      </div>
                                      <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                    </div>
                                    </button>
                                  ))}
                                </div>
                              ) : (
                                <div className="p-6 text-center text-slate-500 animate-in fade-in duration-500">
                                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 animate-in zoom-in duration-500">
                                    <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                                    </svg>
                                  </div>
                                  <p className="font-medium animate-in slide-in-from-bottom-2 duration-500">Nenhuma paróquia encontrada</p>
                                  <p className="text-sm mt-1 animate-in slide-in-from-bottom-2 duration-500" style={{animationDelay: '100ms'}}>Tente digitar de outra forma</p>
                                </div>
                              )}
                            </div>
                          )}
                  </div>
                  
                        {/* Mensagem de Ajuda com Design Moderno */}
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-3 border border-blue-100">
                          <div className="flex items-start gap-2">
                            <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-xs">💡</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-slate-600 font-medium">
                                Digite o nome da sua paróquia para encontrá-la na lista
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal para Trocar Paróquia */}
        {showTrocarParoquiaModal && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onKeyDown={handleModalKeyDown}
            tabIndex={-1}
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[85vh] overflow-hidden">
              {/* Header da Modal */}
              <div className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200 p-5 relative">
                <div className="flex items-center justify-center mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-sm">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h2 className="text-lg font-semibold text-slate-800">
                      {!paroquiaSelecionada ? "Portal da Diocese de Maringá" : "Buscar Paróquia"}
                    </h2>
                  </div>
                </div>
                {paroquiaSelecionada && (
                  <button
                    onClick={() => {
                      setShowTrocarParoquiaModal(false);
                      setModalParoquiaSearch("");
                    }}
                    className="absolute top-4 right-4 w-7 h-7 bg-white/80 hover:bg-white rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-sm"
                  >
                    <svg className="w-3.5 h-3.5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                <p className="text-slate-600 text-sm text-center">
                  {!paroquiaSelecionada 
                    ? "Acesse os módulos de contribuições da sua paróquia"
                    : "Selecione uma nova paróquia para acessar seus módulos"
                  }
                </p>
              </div>

                              {/* Conteúdo da Modal */}
                <div className="p-5">
                  {/* Campo de Busca */}
                  <div className="space-y-4">
                  {!paroquiaSelecionada && (
                    <div className="text-center mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <h3 className="text-sm font-semibold text-slate-800 mb-1">
                        Encontre sua paróquia
                      </h3>
                    </div>
                  )}
                  
                                      <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder="Digite o nome da paróquia..."
                        value={modalParoquiaSearch}
                        onChange={(e) => {
                          setModalParoquiaSearch(e.target.value);
                          setSelectedParoquiaIndex(-1);
                        }}
                        className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-700 placeholder-slate-400 bg-white hover:border-blue-400 transition-all duration-200"
                        autoFocus
                      />
                    </div>
                    
                  {/* Lista de Paróquias Filtradas */}
                  <div className={`transition-all duration-500 ease-out transform ${
                    modalParoquiaSearch ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                  }`}>
                    {modalParoquiaSearch && (
                                                                      <div className="max-h-56 overflow-y-auto border border-slate-200 rounded-xl bg-gradient-to-br from-white to-slate-50 shadow-lg">
                          {modalFilteredParoquias.length > 0 ? (
                            <div className="space-y-2 p-3">
                              {modalFilteredParoquias.map((paroquia, index) => (
                                <button
                                  key={paroquia.id}
                                  onClick={() => handleModalParoquiaSelect(paroquia.id)}
                                  className={`w-full text-left p-3 rounded-xl transition-all duration-300 flex items-center gap-3 border cursor-pointer group ${
                                    index === selectedParoquiaIndex
                                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 shadow-md ring-2 ring-blue-200/50'
                                      : 'border-transparent hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-indigo-50/80 hover:border-blue-200 hover:shadow-md'
                                  }`}
                                >
                                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                                    index === selectedParoquiaIndex
                                      ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg'
                                      : 'bg-gradient-to-br from-blue-100 to-indigo-100 group-hover:from-blue-200 group-hover:to-indigo-200'
                                  }`}>
                                    <Church className={`h-4 w-4 transition-colors duration-300 ${
                                      index === selectedParoquiaIndex ? 'text-white' : 'text-blue-600'
                                    }`} />
                  </div>
                                  <div className="flex-1">
                                    <p className={`font-semibold text-sm transition-colors duration-300 ${
                                      index === selectedParoquiaIndex ? 'text-blue-800' : 'text-slate-800'
                                    }`}>{paroquia.name}</p>
            </div>
                                  <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
                                    index === selectedParoquiaIndex
                                      ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md'
                                      : 'bg-blue-200 group-hover:bg-blue-300'
                                  }`}>
                                    <svg className={`w-2.5 h-2.5 transition-colors duration-300 ${
                                      index === selectedParoquiaIndex ? 'text-white' : 'text-blue-600'
                                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                      </div>
                                </button>
                              ))}
                            </div>
                                                  ) : (
                            <div className="p-6 text-center text-slate-500">
                              <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                                <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                                </svg>
                              </div>
                              <p className="font-semibold text-base text-slate-700">Nenhuma paróquia encontrada</p>
                              <p className="text-sm mt-2 text-slate-500">Tente digitar de outra forma ou verifique a grafia</p>
                            </div>
                          )}
                      </div>
                    )}
                  </div>

                  {/* Mensagem de Ajuda */}
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <div className="flex items-start gap-2.5">
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs">💡</span>
                        </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-700 font-medium">
                          {!paroquiaSelecionada 
                            ? "Portal de contribuições: Dízimo e Oferta"
                            : "Trocar paróquia para acessar módulos"
                          }
                        </p>
                        </div>
                      </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto pb-8 text-center">
          <p className="text-sm text-white/80 mb-2">
            Sua contribuição fortalece nossa comunidade
          </p>
          
          {/* Botão para simular primeiro acesso - útil para desenvolvimento e testes */}
          <button
            onClick={() => {
              localStorage.removeItem('paroquiaSelecionada');
              localStorage.removeItem('paroquiaSelecionadaTimestamp');
              setParoquiaSelecionada(null);
              setCampanhaAtual(0);
              setIsSkeletonMode(true); // Ativar modo skeleton
            }}
            className="text-xs text-white/40 hover:text-white/60 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10 border border-white/20 hover:border-white/30"
            title="Simular primeiro acesso (limpa localStorage)"
          >
            🆕 Primeiro Acesso
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
