import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

export interface PaymentConfirmationResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}

export class SignalRService {
  private connection: HubConnection | null = null;
  private isConnecting = false;

  /**
   * Obtém a URL padrão do hub SignalR baseada no hostname atual
   */
  private getDefaultHubUrl(): string {
    const hostname = window.location.hostname;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'https://producao6.theos.com.br/EclesialPix/pixHub';
    }
    
    return `https://${hostname}/EclesialPix/pixHub`;
  }

  /**
   * Inicializa a conexão SignalR
   * @param key - Chave única para identificar a conexão (ID do lançamento + código de exportação)
   * @param baseUrl - URL base do hub SignalR (opcional, usa padrão se não fornecido)
   */
  public async initSignalR(key: string, baseUrl?: string): Promise<HubConnection> {
    if (this.connection && this.connection.state === 'Connected') {
      return this.connection;
    }

    if (this.isConnecting) {
      let attempts = 0;
      while (this.isConnecting && attempts < 50) {
        await new Promise(resolve => setTimeout(resolve, 200));
        attempts++;
      }
      if (this.connection) {
        return this.connection;
      }
    }

    this.isConnecting = true;

    try {
      const hubUrl = baseUrl || this.getDefaultHubUrl();
      

      const urlWithKey = `${hubUrl}?key=${encodeURIComponent(key)}`;
      
      this.connection = new HubConnectionBuilder()
        .withUrl(urlWithKey)
        .configureLogging(LogLevel.Information)
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: retryContext => {
            if (retryContext.previousRetryCount === 0) {
              return 0;
            }
            if (retryContext.previousRetryCount === 1) {
              return 2000;
            }
            if (retryContext.previousRetryCount === 2) {
              return 10000;
            }
            return 30000;
          }
        })
        .build();

      this.connection.onclose((error) => {
        this.isConnecting = false;
      });

      this.connection.onreconnecting((error) => {
      });

      this.connection.onreconnected((connectionId) => {
        this.isConnecting = false;
      });

      await this.connection.start();
      
      this.isConnecting = false;
      return this.connection;

    } catch (error) {
      this.isConnecting = false;
      throw error;
    }
  }

  /**
   * Escuta o evento de status do PIX (baseado no código AngularJS)
   * @param onPaymentConfirmed - Callback chamado quando o pagamento é confirmado
   * @param onError - Callback chamado em caso de erro
   */
  public listenPaymentConfirmation(
    onPaymentConfirmed: (response: PaymentConfirmationResponse) => void,
    onError: (error: Error | string) => void
  ): void {
    if (!this.connection) {
      onError(new Error('SignalR não está conectado'));
      return;
    }
    this.connection.on('OnConnectedHub', () => {
      
      try {
        this.connection!.on('ReceivePagamentoConfirmado', (response: unknown) => {
          
          if (response) {
            
            const paymentResponse: PaymentConfirmationResponse = {
              success: true,
              message: 'Pagamento confirmado',
              data: response
            };
            
            onPaymentConfirmed(paymentResponse);
            this.stop();
            return;
          }
          
          this.stop();
          onError('Não foi possível realizar a comunicação com nosso servidor. Tente novamente mais tarde.');
        });
        
        this.connection!.on('ReceivePdvStatus', (data: unknown) => {
        });
        
        this.connection!.onreconnecting(() => {
        });
        
        this.connection!.onreconnected(() => {
        });
        
      } catch (e) {
        this.stop();
        onError('Não foi possível realizar a comunicação com nosso servidor. Tente novamente mais tarde.');
      }
    });
  }

  /**
   * Para a conexão SignalR
   */
  public async stop(): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.stop();
      } catch (error) {
      } finally {
        this.connection = null;
        this.isConnecting = false;
      }
    }
  }

  /**
   * Verifica se está conectado
   */
  public isConnected(): boolean {
    return this.connection?.state === 'Connected';
  }

  /**
   * Obtém o estado da conexão
   */
  public getConnectionState(): string {
    return this.connection?.state || 'Disconnected';
  }
}

export const signalRService = new SignalRService();
