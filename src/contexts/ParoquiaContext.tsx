import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Organismo } from '@/types/eclesial';
import { eclesialApi } from '@/services/eclesialApi';

interface ParoquiaContextType {
  paroquias: Organismo[];
  paroquiaAtiva: Organismo | null;
  isLoadingParoquias: boolean;
  errorParoquias: string | null;
  
  isSwitching: boolean;
  isGlobalLoading: boolean; // ← Loading global para toda a tela
  switchError: string | null;
  
  buscarParoquias: () => Promise<void>;
  alternarParoquia: (organismoId: string) => Promise<boolean>;
  limparErro: () => void;
  resetarBusca: () => void;
  definirParoquiaAtiva: (organismoId: string) => void;
  
  temMultiplasParoquias: boolean;
  paroquiaAtual: Organismo | null;
}

const ParoquiaContext = createContext<ParoquiaContextType | undefined>(undefined);

export const useParoquia = () => {
  const context = useContext(ParoquiaContext);
  if (context === undefined) {
    throw new Error('useParoquia deve ser usado dentro de um ParoquiaProvider');
  }
  return context;
};

interface ParoquiaProviderProps {
  children: ReactNode;
}

export const ParoquiaProvider: React.FC<ParoquiaProviderProps> = ({ children }) => {
  const [paroquias, setParoquias] = useState<Organismo[]>([]);
  const [paroquiaAtiva, setParoquiaAtiva] = useState<Organismo | null>(null);
  const [isLoadingParoquias, setIsLoadingParoquias] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [isGlobalLoading, setIsGlobalLoading] = useState(false); // ← Estado para loading global
  const [errorParoquias, setErrorParoquias] = useState<string | null>(null);
  
  const [switchError, setSwitchError] = useState<string | null>(null);

  const [hasAttemptedSearch, setHasAttemptedSearch] = useState(false);
  const [searchBlocked, setSearchBlocked] = useState(false);

  const buscarParoquias = async () => {
    if (searchBlocked) {
      return;
    }

    if (isLoadingParoquias) {
      return;
    }

    const userData = localStorage.getItem('eclesial_user_data');
    if (!userData) {
      return;
    }

    try {
      const parsedData = JSON.parse(userData);
      if (!parsedData.token) {
        return;
      }

      
      eclesialApi.setToken(parsedData.token);

      
      setIsLoadingParoquias(true);
      setErrorParoquias(null);
      
      const paroquiasEncontradas = await eclesialApi.buscarParoquias();
      
      
      setParoquias(paroquiasEncontradas);
      setHasAttemptedSearch(true);
      
      if (!paroquiaAtiva) {
        
        const userData = localStorage.getItem('eclesial_user_data');
        if (userData) {
          try {
            const parsedData = JSON.parse(userData);
            if (parsedData.organismoId) {
              const paroquiaDoUsuario = paroquiasEncontradas.find(p => p.id === parsedData.organismoId);
              if (paroquiaDoUsuario) {
                setParoquiaAtiva(paroquiaDoUsuario);
              }
            }
          } catch (error) {
          }
        }
      }
      
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao buscar paróquias';
      
      if (errorMessage.includes('401') || errorMessage.includes('não autorizado') || errorMessage.includes('unauthorized')) {
        setSearchBlocked(true);
        setErrorParoquias('Erro de autenticação (401). Faça login novamente.');
      } else {
        setErrorParoquias(errorMessage);
      }
    } finally {
      setIsLoadingParoquias(false);
    }
  };

  const alternarParoquia = async (organismoId: string): Promise<boolean> => {
    if (isSwitching || organismoId === paroquiaAtiva?.id) {
      return false;
    }

    
    setIsSwitching(true);
    setIsGlobalLoading(true); // ← Ativar loading global
    setSwitchError(null);
    
    try {
      const sessaoResponse = await eclesialApi.iniciarSessaoParoquia(organismoId);
      
      if (!sessaoResponse.success || !sessaoResponse.data) {
        throw new Error(sessaoResponse.message || 'Falha ao iniciar sessão');
      }
      
      
      const tokenAtual = localStorage.getItem('eclesial_user_data') ? 
        JSON.parse(localStorage.getItem('eclesial_user_data')!).token : null;
      
      if (!tokenAtual) {
        throw new Error('Token atual não encontrado no localStorage');
      }
      
      
      const refreshResponse = await eclesialApi.refreshToken(
        tokenAtual,                           // ← Token ATUAL (do localStorage)
        sessaoResponse.data.access_token      // ← Novo token recebido
      );
      
      if (!refreshResponse.success || !refreshResponse.data) {
        throw new Error(refreshResponse.message || 'Falha ao atualizar token');
      }
      
      
      const userData = localStorage.getItem('eclesial_user_data');
      if (userData) {
        const parsedData = JSON.parse(userData);
        
        const novaParoquia = paroquias.find(p => p.id === organismoId);
        
        const novosDados = {
          ...parsedData,
          token: sessaoResponse.data.access_token,           // ← Token da nova sessão
          refresh_token: parsedData.refresh_token,          // ← Manter refresh_token atual
          organismoId: organismoId,
          organismoNome: novaParoquia?.razaoSocial || novaParoquia?.nomeFantasia || 'N/A',
          nomeParoquia: novaParoquia?.razaoSocial || novaParoquia?.nomeFantasia || 'N/A',
          nomeDiocese: novaParoquia?.nomeDiocese || parsedData.nomeDiocese,
          dbCentralHost: novaParoquia?.dbCentralHost || parsedData.dbCentralHost,
          dbName: novaParoquia?.dbName || parsedData.dbName,
          organismoCodigoExportacao: novaParoquia?.codigoExportacao || parsedData.organismoCodigoExportacao, // ← Atualizar código de exportação da nova paróquia
        };
        
        
        
        localStorage.setItem('eclesial_user_data', JSON.stringify(novosDados));
        
        
        if (novaParoquia) {
          setParoquiaAtiva(novaParoquia);
        }
        
        window.dispatchEvent(new CustomEvent('eclesial_paroquia_changed', {
          detail: { novosDados }
        }));
        
      }
      
      return true;
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao alternar paróquia';
      setSwitchError(errorMessage);
      return false;
    } finally {
      setIsSwitching(false);
      setTimeout(() => {
        setIsGlobalLoading(false);
      }, 1000); // ← Aguardar 1 segundo para garantir sincronização
    }
  };

  const limparErro = () => {
    setErrorParoquias(null);
    setSwitchError(null);
  };

  const resetarBusca = () => {
    setSearchBlocked(false);
    setHasAttemptedSearch(false);
    setErrorParoquias(null);
    setParoquias([]);
    setParoquiaAtiva(null);
  };

  const definirParoquiaAtiva = (organismoId: string) => {
    const paroquia = paroquias.find(p => p.id === organismoId);
    if (paroquia) {
      setParoquiaAtiva(paroquia);
    } else {
    }
  };

  const temMultiplasParoquias = paroquias.length > 1;
  const paroquiaAtual = paroquiaAtiva;


  useEffect(() => {
    const userData = localStorage.getItem('eclesial_user_data');
    
    if (userData && !hasAttemptedSearch && !searchBlocked) {
      
      buscarParoquias().catch(error => {
      });
    }
  }, [hasAttemptedSearch, searchBlocked]); // Dependências para evitar loops

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'eclesial_user_data') {
        if (e.newValue) {
          if (!hasAttemptedSearch && !searchBlocked) {
            buscarParoquias().catch(error => {
            });
          }
        } else {
          resetarBusca();
        }
      }
    };

    const handleLoginSuccess = (event: CustomEvent) => {
      const { userData } = event.detail;
      
      setSearchBlocked(false);
      setHasAttemptedSearch(false);
      setErrorParoquias(null);
      
      setTimeout(async () => {
        try {
          await buscarParoquias();
          
          if (userData.organismoId) {
            definirParoquiaAtiva(userData.organismoId);
          }
        } catch (error) {
        }
      }, 500); // Pequeno delay para garantir que a API esteja pronta
    };

    window.addEventListener('storage', handleStorageChange);
    
    window.addEventListener('eclesial_login_successful', handleLoginSuccess as EventListener);
    
    const userData = localStorage.getItem('eclesial_user_data');
    if (userData && !hasAttemptedSearch && !searchBlocked) {
      buscarParoquias().catch(error => {
      });
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('eclesial_login_successful', handleLoginSuccess as EventListener);
    };
  }, [hasAttemptedSearch, searchBlocked, paroquias]); // Dependências para evitar loops

  useEffect(() => {
    const userData = localStorage.getItem('eclesial_user_data');
    
    if (userData && !hasAttemptedSearch && !searchBlocked) {
      
      const timer = setTimeout(() => {
        buscarParoquias().catch(error => {
        });
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, []); // Executar apenas uma vez quando o contexto for montado

  const value: ParoquiaContextType = {
    paroquias,
    paroquiaAtiva,
    isLoadingParoquias,
    errorParoquias,
    isSwitching,
    isGlobalLoading, // ← Adicionar loading global
    switchError,
    buscarParoquias,
    alternarParoquia,
    limparErro,
    resetarBusca,
    definirParoquiaAtiva, // ← Adicionar função para definir paróquia ativa
    temMultiplasParoquias,
    paroquiaAtual,
  };

  return (
    <ParoquiaContext.Provider value={value}>
      {children}
    </ParoquiaContext.Provider>
  );
};
