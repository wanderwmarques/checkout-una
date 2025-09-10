import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { eclesialApi } from '@/services/eclesialApi';
import { EclesialAuth, StoredUserData, DizimoPayload, OfertaPayload } from '@/types/eclesial';
import { useEnvironment } from './EnvironmentContext';

const STORAGE_KEY = 'eclesial_user_data';

interface EclesialAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  userData: StoredUserData | null;
  error: string | null;
  login: (credentials: EclesialAuth) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  realizarDizimo: (payload: DizimoPayload) => Promise<{ success: boolean; data?: unknown; message?: string }>;
  realizarOferta: (valor: number, dizimistaId?: number, dadosAdicionais?: {
    tipoOferta?: unknown;
    dizimistaNome?: string;
    dizimistaCompleto?: {
      id: number;
      nome: string;
      dizimistaId?: number;
      nomeComunidade?: string;
      comunidadeId?: number;
      comunidadeIdCentrosCustos?: number;
      cnpjCpf?: string;
      email?: string;
      ativo?: boolean;
    };
  }) => Promise<{ success: boolean; data?: unknown; message?: string }>;
  buscarTiposOferta: () => Promise<unknown>;
  buscarComunidades: () => Promise<unknown>;
  buscarDizimistasAtivos: (dizimistaId?: number) => Promise<{success: boolean; data?: unknown; message?: string}>;
  buscarDizimistasPorNome: (nome: string) => Promise<{success: boolean; data?: unknown; message?: string}>;
  buscarTiposRecebimento: () => Promise<{success: boolean; data?: unknown; message?: string}>;
  obterQrCodePix: (idLancamento: number, codigoExportacao?: string, origemId?: number) => Promise<{success: boolean; data?: unknown; message?: string}>;
  clearError: () => void;
}

const EclesialAuthContext = createContext<EclesialAuthContextType | undefined>(undefined);

export const useEclesialAuth = () => {
  const context = useContext(EclesialAuthContext);
  if (context === undefined) {
    throw new Error('useEclesialAuth deve ser usado dentro de um EclesialAuthProvider');
  }
  return context;
};

interface EclesialAuthProviderProps {
  children: ReactNode;
}

export const EclesialAuthProvider: React.FC<EclesialAuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<StoredUserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { setDetectedProduction } = useEnvironment();

  const getCodigoByFormaPagamento = (formaPagamento?: 'caixa' | 'pix' | 'credito') => {
    switch (formaPagamento) {
      case 'pix':
        return "ZZ123919";
      case 'credito':
        return "CREDITO";
      case 'caixa':
      default:
        return "00000000";
    }
  };

  useEffect(() => {
    const loadUserData = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsedData = JSON.parse(stored);
          setUserData(parsedData);
          setIsAuthenticated(true);
          
          eclesialApi.setToken(parsedData.token);
        } else {
        }
      } catch (error) {
        localStorage.removeItem(STORAGE_KEY);
      }
    };

    loadUserData();

    const handleParoquiaChanged = (event: CustomEvent) => {
      const { novosDados } = event.detail;
      
      
      if (!novosDados.token) {
        return; // Não atualizar se não tiver token
      }
      
      if (!novosDados.refresh_token) {
      }
      
      setUserData(novosDados);
      setIsAuthenticated(true);
      
      eclesialApi.setToken(novosDados.token);
      
    };

    window.addEventListener('eclesial_paroquia_changed', handleParoquiaChanged as EventListener);

    return () => {
      window.removeEventListener('eclesial_paroquia_changed', handleParoquiaChanged as EventListener);
    };
  }, []);

  const login = useCallback(async (credentials: EclesialAuth) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await eclesialApi.authenticate(credentials);
      
      
      
      if (response.hostName && response.hostName.toLowerCase().startsWith('producao')) {
        setDetectedProduction(response.hostName);
      } else {
        setDetectedProduction(null);
      }

      const userData: StoredUserData = {
        token: response.token,
        refresh_token: response.refresh_token || null, // Adicionar refresh_token
        nomeUsuario: response.userData?.nome || response.userData?.email || null,
        nomeParoquia: response.organismoNome || response.paroquia?.nome || response.paroquia?.descricao || null,
        nomeDiocese: response.nomeDiocese || response.diocese?.nome || response.diocese?.descricao || null,
        comunidadeId: response.paroquia?.id || response.paroquia?.comunidadeId || null,
        dioceseId: response.dioceseId || response.diocese?.id || response.diocese?.dioceseId || null,
        fielId: response.userData?.id || response.userData?.fielId || null,
        usuarioNome: response.usuarioNome || response.userData?.nome || null,
        usuarioLogin: response.usuarioLogin || response.userData?.login || null,
        usuarioEmail: response.usuarioEmail || response.userData?.email || null,
        dioceseIdDbCentral: response.dioceseIdDbCentral || null,
        organismoNome: response.organismoNome || null,
        hostName: response.hostName || null,
        dbCentralHost: response.DbCentralHost || response.dbCentralHost || null,
        dbName: response.DbName || response.dbName || null,
        organismoCodigoExportacao: response.organismoCodigoExportacao || null,
        organismoIdDbCentral: response.organismoIdDbCentral || null,
      };
      

      

      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
      }
      
      eclesialApi.setToken(response.token);
      
      setUserData(userData);
      setIsAuthenticated(true);
      
      
      
      window.dispatchEvent(new CustomEvent('eclesial_login_successful', {
        detail: { userData }
      }));
      
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro na autenticação';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    eclesialApi.clearToken();
    setUserData(null);
    setIsAuthenticated(false);
    setError(null);
    setDetectedProduction(null); // Limpar ambiente detectado
  }, [setDetectedProduction]);

  const realizarDizimo = useCallback(async (valor: number, dadosAdicionais?: {
    mesReferente?: number;
    anoReferente?: number;
    formaPagamento?: 'caixa' | 'pix' | 'credito';
    dizimistaCompleto?: {
      id: number;
      nome: string;
      dizimistaId?: number;
      nomeComunidade?: string;
      comunidadeId?: number;
      comunidadeIdCentrosCustos?: number;
      cnpjCpf?: string;
      email?: string;
      ativo?: boolean;
    };
  }) => {
    if (!userData) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const dizimistasResponse = await eclesialApi.buscarDizimistasAtivos();
      
      if (!dizimistasResponse.success) {
        throw new Error('Erro ao buscar dados dos dizimistas');
      }

      let dizimistaAtivo = null;
      
      if (dadosAdicionais?.dizimistaCompleto) {
        dizimistaAtivo = dadosAdicionais.dizimistaCompleto;
      } else {
        const dizimistasResponse = await eclesialApi.buscarDizimistasAtivos();
        
        if (!dizimistasResponse.success) {
          throw new Error('Erro ao buscar dados dos dizimistas');
        }

        
        let dizimistas: any[] = [];
        if (Array.isArray(dizimistasResponse.data)) {
          dizimistas = dizimistasResponse.data;
        } else if (dizimistasResponse.data && typeof dizimistasResponse.data === 'object') {
          const dataObj = dizimistasResponse.data as any;
          if (dataObj.data && Array.isArray(dataObj.data)) {
            dizimistas = dataObj.data;
          } else if (dataObj.items && Array.isArray(dataObj.items)) {
            dizimistas = dataObj.items;
          } else if (dataObj.result && Array.isArray(dataObj.result)) {
            dizimistas = dataObj.result;
          } else {
            throw new Error('Estrutura de dados dos dizimistas não reconhecida');
          }
        } else {
          throw new Error('Dados dos dizimistas não são válidos');
        }
        
        
        const dizimistaEncontrado = dizimistas.find(dizimista => 
          dizimista.dizimistaId && dizimista.id
        );

        if (!dizimistaEncontrado) {
          throw new Error('Nenhum dizimista ativo encontrado');
        }

        dizimistaAtivo = dizimistaEncontrado;
      }

      if (!dizimistaAtivo) {
        throw new Error('Nenhum dizimista válido disponível para o lançamento');
      }
      const dizimoPayload: DizimoPayload = {
        cartaoStatus: null,
        anonima: false,
        data: new Date().toLocaleDateString('pt-BR'),
        tipoRecebimento: dadosAdicionais?.tipoRecebimento || {
          tipo: 0,
          bancoId: null,
          banco: null,
          nome: dadosAdicionais?.formaPagamento === 'credito' ? "Cartão de Crédito" : 
                dadosAdicionais?.formaPagamento === 'pix' ? "PIX" : "Caixa",
          descricao: dadosAdicionais?.formaPagamento === 'credito' ? "Cartão de Crédito" : 
                    dadosAdicionais?.formaPagamento === 'pix' ? "PIX" : "Caixa",
          isCaixa: dadosAdicionais?.formaPagamento === 'caixa',
          isBanco: false,
          isBoleto: false,
          isCartao: dadosAdicionais?.formaPagamento === 'credito',
          isCartaoCredito: dadosAdicionais?.formaPagamento === 'credito',
          isCieloDebito: false,
          isCieloCredito: dadosAdicionais?.formaPagamento === 'credito',
          isCielo: dadosAdicionais?.formaPagamento === 'credito',
          isAnyCielo: dadosAdicionais?.formaPagamento === 'credito',
          isAnyStone: false,
          isStoneSemMaquina: false,
          isStoneDebito: false,
          isStoneCredito: false,
          isStoneBoleto: false,
          isSemMaquininha: false,
          liberado: true,
          mensagem: null,
          codigo: getCodigoByFormaPagamento(dadosAdicionais?.formaPagamento),
          visible: true,
          maquinaId: null,
          chavePix: dadosAdicionais?.formaPagamento === 'pix' ? "ZZ123919" : null,
          organismoId: null,
          dioceseId: null,
          id: 0
        },
        isTotem: false,
        tipoOferta: {}, // Campo obrigatório para dízimo
        fiel: {
          dizimistaId: dizimistaAtivo.dizimistaId || null,
          id: dizimistaAtivo.id || null,
          nome: dizimistaAtivo.nome || "",
          nomeComunidade: dizimistaAtivo.nomeComunidade || "",
          comunidadeId: dizimistaAtivo.comunidadeId || null,
          comunidadeIdCentrosCustos: dizimistaAtivo.comunidadeIdCentrosCustos || null,
          cnpjCpf: dizimistaAtivo.cnpjCpf || "",
          email: dizimistaAtivo.email || ""
        },
        servicoCemiterio: {},
        lancamentosPeriodo: [],
        anoReferente: dadosAdicionais?.anoReferente || new Date().getFullYear(),
        mesReferente: dadosAdicionais?.mesReferente || new Date().getMonth() + 1,
        isLancamentoPeriodo: false,
        isOfertaAdicional: false,
        id: 0,
        comunidade: {
          contatos: [],
          grupos: [],
          id: dizimistaAtivo.comunidadeId || userData.comunidadeId,
          nome: dizimistaAtivo.nomeComunidade || userData.nomeParoquia,
          centroCusto: {
            id: dizimistaAtivo.comunidadeIdCentrosCustos || 158610
          }
        },
        valor: valor,
        lancamentoViaPix: dadosAdicionais?.formaPagamento === 'pix'
      };
      const response = await eclesialApi.realizarDizimo(dizimoPayload);
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Erro na transação');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro na transação';
      setError(errorMessage);
      throw error;
    }
  }, [userData]);

  const realizarOferta = useCallback(async (valor: number, dizimistaId?: number, dadosAdicionais?: {
    tipoOferta?: unknown;
    formaPagamento?: 'caixa' | 'pix' | 'credito';
    dizimistaNome?: string;
    dizimistaCompleto?: {
      id: number;
      nome: string;
      dizimistaId?: number;
      nomeComunidade?: string;
      comunidadeId?: number;
      comunidadeIdCentrosCustos?: number;
      cnpjCpf?: string;
      email?: string;
      ativo?: boolean;
    };
  }) => {
    if (!userData) {
      throw new Error('Usuário não autenticado');
    }

    try {
      let fielData = null;
      
      if (dizimistaId || dadosAdicionais?.dizimistaNome || dadosAdicionais?.dizimistaCompleto) {
        if (dadosAdicionais?.dizimistaCompleto) {
          fielData = dadosAdicionais.dizimistaCompleto;
        } else if (dizimistaId) {
          const dizimistasResponse = await eclesialApi.buscarDizimistasAtivos(dizimistaId);
          
          if (!dizimistasResponse.success) {
            throw new Error('Erro ao buscar dados dos dizimistas');
          }
          
          fielData = dizimistasResponse.data;
        } else if (dadosAdicionais?.dizimistaNome) {
          const dizimistasResponse = await eclesialApi.buscarDizimistasPorNome(dadosAdicionais.dizimistaNome);
          
          if (!dizimistasResponse.success) {
            throw new Error('Erro ao buscar dados dos dizimistas por nome');
          }
          
          fielData = dizimistasResponse.data;
        }
        
        if (!fielData) {
          const searchTerm = dizimistaId || dadosAdicionais?.dizimistaNome;
          throw new Error(`Dizimista não encontrado: ${searchTerm}`);
        }
        
      }

      const ofertaPayload: OfertaPayload = {
        cartaoStatus: null,
        anonima: !(dizimistaId || dadosAdicionais?.dizimistaCompleto), // Anônima se não passar dizimistaId ou dados completos
        data: new Date().toLocaleDateString('pt-BR'),
        tipoRecebimento: {
          tipo: 0,
          bancoId: null,
          banco: null,
          nome: dadosAdicionais?.formaPagamento === 'credito' ? "Cartão de Crédito" : 
                dadosAdicionais?.formaPagamento === 'pix' ? "PIX" : "Caixa",
          descricao: dadosAdicionais?.formaPagamento === 'credito' ? "Cartão de Crédito" : 
                    dadosAdicionais?.formaPagamento === 'pix' ? "PIX" : "Caixa",
          isCaixa: dadosAdicionais?.formaPagamento === 'caixa',
          isBanco: false,
          isBoleto: false,
          isCartao: dadosAdicionais?.formaPagamento === 'credito',
          isCartaoCredito: dadosAdicionais?.formaPagamento === 'credito',
          isCieloDebito: false,
          isCieloCredito: dadosAdicionais?.formaPagamento === 'credito',
          isCielo: dadosAdicionais?.formaPagamento === 'credito',
          isAnyCielo: dadosAdicionais?.formaPagamento === 'credito',
          isAnyStone: false,
          isStoneSemMaquina: false,
          isStoneDebito: false,
          isStoneCredito: false,
          isStoneBoleto: false,
          isSemMaquininha: false,
          liberado: true,
          mensagem: null,
          codigo: getCodigoByFormaPagamento(dadosAdicionais?.formaPagamento),
          visible: true,
          maquinaId: null,
          chavePix: dadosAdicionais?.formaPagamento === 'pix' ? "ZZ123919" : null,
          organismoId: null,
          dioceseId: null,
          id: 0
        },
        isTotem: false,
        tipoOferta: dadosAdicionais?.tipoOferta || {},
        fiel: (dizimistaId || dadosAdicionais?.dizimistaCompleto) && fielData ? {
          dizimistaId: fielData.dizimistaId || null,
          id: fielData.id || null,
          nome: fielData.nome || "",
          nomeComunidade: fielData.nomeComunidade || "",
          comunidadeId: fielData.comunidadeId || null,
          comunidadeIdCentrosCustos: fielData.comunidadeIdCentrosCustos || null,
          cnpjCpf: fielData.cnpjCpf || "",
          email: fielData.email || ""
        } : {
          dizimistaId: null,
          id: null,
          nome: "",
          nomeComunidade: "",
          comunidadeId: null,
          comunidadeIdCentrosCustos: null,
          cnpjCpf: "",
          email: ""
        },
        servicoCemiterio: {},
        id: 0,
        tipo: dadosAdicionais?.tipoOferta || {}, // Campo principal para classificação financeira
        comunidade: {
          contatos: [],
          grupos: [],
          id: userData.comunidadeId,
          nome: userData.nomeParoquia,
          centroCusto: {
            id: 158610
          }
        },
        valor: valor,
        lancamentoViaPix: dadosAdicionais?.formaPagamento === 'pix'
      };
      const response = await eclesialApi.realizarOferta(ofertaPayload);
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Erro na transação');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro na transação';
      setError(errorMessage);
      throw error;
    }
  }, [userData]);

  const buscarTiposOferta = useCallback(async () => {
    if (!userData) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const response = await eclesialApi.buscarTiposOferta();
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar tipos de oferta';
      setError(errorMessage);
      throw error;
    }
  }, [userData]);

  const buscarComunidades = useCallback(async () => {
    if (!userData) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const response = await eclesialApi.buscarComunidades();
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar comunidades';
      setError(errorMessage);
      throw error;
    }
  }, [userData]);

  const buscarDizimistasAtivos = useCallback(async (dizimistaId?: number) => {
    if (!userData) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const response = await eclesialApi.buscarDizimistasAtivos(dizimistaId);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar dizimistas';
      setError(errorMessage);
      throw error;
    }
  }, [userData]);

  const buscarDizimistasPorNome = useCallback(async (nome: string) => {
    if (!userData) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const response = await eclesialApi.buscarDizimistasPorNome(nome);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar dizimistas por nome';
      setError(errorMessage);
      throw error;
    }
  }, [userData]);

  const buscarTiposRecebimento = useCallback(async () => {
    if (!userData) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const response = await eclesialApi.buscarTiposRecebimento();
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar tipos de recebimento';
      setError(errorMessage);
      throw error;
    }
  }, [userData]);

  const obterQrCodePix = useCallback(async (idLancamento: number, codigoExportacao?: string, origemId?: number) => {
    if (!userData) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const codigoExportacaoFinal = codigoExportacao || userData.organismoCodigoExportacao;
      const response = await eclesialApi.obterQrCodePix(idLancamento, codigoExportacaoFinal, origemId);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao obter QR Code do PIX';
      setError(errorMessage);
      throw error;
    }
  }, [userData]);

  const value: EclesialAuthContextType = {
    isAuthenticated,
    isLoading,
    userData,
    error,
    login,
    logout,
    realizarDizimo,
    realizarOferta,
    buscarTiposOferta,
    buscarComunidades,
    buscarDizimistasAtivos,
    buscarDizimistasPorNome,
    buscarTiposRecebimento,
    obterQrCodePix,
    clearError: () => setError(null)
  };

  return (
    <EclesialAuthContext.Provider value={value}>
      {children}
    </EclesialAuthContext.Provider>
  );
};
