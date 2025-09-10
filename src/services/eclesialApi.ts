import { 
  EclesialAuth, 
  EclesialAuthResponse, 
  DizimoPayload, 
  DizimoResponse,
  StoredUserData,
  OfertaPayload,
  Organismo,
  OrganismoSearchCriteria,
  ParoquiaSwitchResponse,
  RefreshTokenRequest,
  RefreshTokenResponse
} from '@/types/eclesial';

const getApiBaseUrl = (): string => {
  const detectedProduction = localStorage.getItem('eclesial_detected_production');
  if (detectedProduction) {
    const productionUrl = `https://${detectedProduction}.theos.com.br`;
    return productionUrl;
  }

  const selectedEnv = localStorage.getItem('eclesial_selected_environment');
  if (selectedEnv) {
    const environments: Record<string, string> = {
      'qa2': 'https://qa2.theos.com.br',
      'eclesial': 'https://eclesial.theos.com.br',
      'developer': 'https://developer.theos.com.br',
      'hotfix': 'https://hotfix.theos.com.br'
    };
    
    const baseUrl = environments[selectedEnv];
    if (baseUrl) {
      return baseUrl;
    } else {
    }
  }
  
  return 'https://qa2.theos.com.br';
};

class EclesialApiService {
  private token: string | null = null;

  getCurrentApiBaseUrl(): string {
    const currentUrl = getApiBaseUrl();
    return currentUrl;
  }

  updateApiBaseUrl(): void {
  }

  async authenticate(credentials: EclesialAuth): Promise<EclesialAuthResponse> {
    try {
      
      const formData = new FormData();
      formData.append('email', credentials.email);
      formData.append('senha', credentials.senha);
      
      
      
      const response = await fetch(`${this.getCurrentApiBaseUrl()}/EclesialIdentityHub/api/v1/Authentication`, {
        method: 'POST',
        headers: {
          'accept': '*/*',
        },
        body: formData,
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro na autenticação: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      this.token = data.result?.access_Token || data.token || data.access_token || data.accessToken;
      
      if (!this.token) {
        throw new Error('Token não encontrado na resposta da API');
      }

      
      return { 
        token: this.token,
        refresh_token: data.result?.refresh_token || data.refresh_token || data.refreshToken || null, // Adicionar refresh_token
        userData: data.result?.user || data.user || null,
        paroquia: data.result?.paroquia || data.paroquia || null,
        diocese: data.result?.diocese || data.diocese || null,
        usuarioNome: data.result?.usuarioNome || data.usuarioNome || data.result?.user?.nome || data.user?.nome || null,
        usuarioLogin: data.result?.usuarioLogin || data.usuarioLogin || data.result?.user?.login || data.user?.login || null,
        usuarioEmail: data.result?.usuarioEmail || data.usuarioEmail || data.result?.user?.email || data.user?.email || null,
        dioceseId: data.result?.dioceseId || data.dioceseId || null,
        nomeDiocese: data.result?.nomeDiocese || data.nomeDiocese || null,
        dioceseIdDbCentral: data.result?.dioceseIdDbCentral || data.dioceseIdDbCentral || null,
        organismoNome: data.result?.organismoNome || data.organismoNome || null,
        hostName: data.result?.hostName || data.hostName || null,
        dbCentralHost: data.result?.DbCentralHost || data.DbCentralHost || data.result?.dbCentralHost || data.dbCentralHost || null,
        dbName: data.result?.DbName || data.dbName || data.result?.dbName || data.dbName || null,
        organismoCodigoExportacao: data.result?.organismoCodigoExportacao || data.organismoCodigoExportacao || null
      };
    } catch (error) {
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
      }
      
      throw error;
    }
  }

  setToken(token: string): void {
    this.token = token;
  }

  clearToken(): void {
    this.token = null;
  }

  async buscarTiposOferta(): Promise<unknown> {
    try {
      
      const url = `${this.getCurrentApiBaseUrl()}/EclesialParoquia/api/v1/ofertaTipo/searchNotInativos`;
      
      const payload = [{"property":"Nome","condition":1,"value":""}];
      
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao buscar tipos de oferta: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async buscarComunidades(): Promise<unknown> {
    try {
      
      const url = `${this.getCurrentApiBaseUrl()}/EclesialParoquia/api/v1/comunidade/search`;
      const payload = [{"property":"Nome","condition":1,"value":""}]; // Payload padrão para buscar todas as comunidades
      
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao buscar comunidades: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async buscarDizimistasAtivos(dizimistaId?: number): Promise<{success: boolean; data?: unknown; message?: string}> {
    try {
      
      const url = dizimistaId 
        ? `${this.getCurrentApiBaseUrl()}/EclesialParoquia/api/v1/fiel/searchPaged/${dizimistaId}`
        : `${this.getCurrentApiBaseUrl()}/EclesialParoquia/api/v1/fiel/searchPaged`;
      
      const payload = dizimistaId ? { id: dizimistaId } : {};
      
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao buscar dizimistas ativos: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Erro desconhecido' };
    }
  }

  async buscarDizimistasPorNome(nome: string): Promise<{success: boolean; data?: unknown; message?: string}> {
    try {
      
      const url = `${this.getCurrentApiBaseUrl()}/EclesialParoquia/api/v1/fiel/searchPaged`;
      const payload = { nome: nome };
      
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao buscar dizimistas por nome: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Erro desconhecido' };
    }
  }

  async buscarDizimistaPorCpf(cpf: string): Promise<{success: boolean; data?: unknown; message?: string}> {
    try {
      
      const url = `${this.getCurrentApiBaseUrl()}/EclesialParoquia/api/v1/fiel/searchPaged`;
      const payload = {
        page: 1,
        pageSize: 1000,
        filter: [{
          property: "cpf",
          condition: 1,
          conditionStart: cpf,
          conditionEnd: null,
          textCondition: `CPF contenha ${cpf}`
        }]
      };
      
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao buscar dizimista por CPF: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Erro desconhecido' };
    }
  }

  async buscarTiposRecebimento(): Promise<{success: boolean; data?: unknown; message?: string}> {
    try {
      
      const response = await fetch(`${this.getCurrentApiBaseUrl()}/EclesialParoquia/api/v1/tipoRecebimento/tipos`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar tipos de recebimento: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Erro desconhecido' };
    }
  }

  async realizarDizimo(payload: DizimoPayload): Promise<{success: boolean; data?: unknown; message?: string}> {
    try {
      
      const response = await fetch(`${this.getCurrentApiBaseUrl()}/EclesialParoquia/api/v1/dizimo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return { 
          success: false, 
          message: `Erro na transação de dízimo: ${response.status} - ${errorText}` 
        };
      }

      const data = await response.json();
      
      return { 
        success: true, 
        data: data,
        message: 'Dízimo realizado com sucesso!'
      };
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Erro inesperado na transação de dízimo'
      };
    }
  }

  async realizarOferta(payload: OfertaPayload): Promise<{success: boolean; data?: unknown; message?: string}> {
    try {
      
      const response = await fetch(`${this.getCurrentApiBaseUrl()}/EclesialParoquia/api/v1/ofertaLancamento`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return { 
          success: false, 
          message: `Erro na transação de oferta: ${response.status} - ${errorText}` 
        };
      }

      const data = await response.json();
      
      return { 
        success: true, 
        data: data,
        message: 'Oferta realizada com sucesso!'
      };
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Erro inesperado na transação de oferta'
      };
    }
  }

  async obterQrCodePix(idLancamento: number, codigoExportacao?: string, origemId?: number): Promise<{success: boolean; data?: unknown; message?: string}> {
    try {
      
      let url = `${this.getCurrentApiBaseUrl()}/EclesialParoquia/api/v1/pix/obterQrCode/${idLancamento}`;
      if (codigoExportacao) {
        url += `/${codigoExportacao}`;
      }
      if (origemId) {
        url += `/${origemId}`;
      }
      
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao obter QR Code PIX: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Erro desconhecido' };
    }
  }

  /**
   * Busca paróquias disponíveis para o usuário
   */
  async buscarParoquias(): Promise<Organismo[]> {
    try {
      const url = `${this.getCurrentApiBaseUrl()}/EclesialParoquia/api/v1/organismo/search`;
      
      const payload: OrganismoSearchCriteria[] = [
        {
          property: "RazaoSocial",
          condition: "1",
          value: null
        },
        {
          property: "Ativo",
          value: "1",
          condition: "1"
        }
      ];
      if (!this.token) {
        throw new Error('Token não configurado na API service. Faça login primeiro.');
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      if (Array.isArray(data) && data.length > 0) {
      }
      
      return data || [];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Inicia nova sessão para uma paróquia específica
   */
  async iniciarSessaoParoquia(organismoId: string): Promise<ParoquiaSwitchResponse> {
    try {
      const refreshToken = this.getStoredRefreshToken();
      
      if (!refreshToken) {
        throw new Error('Refresh token não encontrado. Faça login novamente.');
      }
      
      const url = `${this.getCurrentApiBaseUrl()}/EclesialParoquia/api/v1/security/token?organismoId=${organismoId}`;
      
      const payload = new URLSearchParams({
        'grant_type': 'refresh_token',
        'refresh_token': refreshToken
      });
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: payload.toString()
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        message: 'Sessão iniciada com sucesso',
        data: data
      };
    } catch (error) {
      return {
        success: false,
        message: `Erro ao iniciar sessão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Atualiza o token de autenticação
   */
  async refreshToken(token: string, newToken: string): Promise<RefreshTokenResponse> {
    try {
      const url = 'https://eclesial.theos.com.br/EclesialIdentityHub/api/v1/Authentication/refreshtoken';
      
      const payload: RefreshTokenRequest = {
        token,
        newToken
      };
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const responseText = await response.text();
      
      let data;
      if (responseText.trim()) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          data = { message: responseText };
        }
      } else {
        data = { message: 'Resposta vazia da API' };
      }
      
      return {
        success: true,
        message: 'Token atualizado com sucesso',
        data: data
      };
    } catch (error) {
      return {
        success: false,
        message: `Erro ao atualizar token: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Obtém o token armazenado
   */
  private getStoredToken(): string {
    const userData = localStorage.getItem('eclesial_user_data');
    if (userData) {
      const parsedData = JSON.parse(userData);
      return parsedData.token || '';
    }
    return '';
  }

  /**
   * Obtém o refresh token armazenado
   */
  private getStoredRefreshToken(): string {
    const userData = localStorage.getItem('eclesial_user_data');
    if (userData) {
      const parsedData = JSON.parse(userData);
      return parsedData.refresh_token || '';
    }
    return '';
  }
}

export const eclesialApi = new EclesialApiService();
