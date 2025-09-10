# Integração SignalR para Pagamento PIX

## Visão Geral

Esta implementação adiciona suporte ao SignalR para escuta em tempo real de confirmações de pagamento PIX, similar ao método AngularJS `listenQrCodePayment` que você mencionou.

## Funcionalidades Implementadas

### 1. Serviço SignalR (`src/services/signalrService.ts`)

- **Conexão automática**: Estabelece conexão com o hub SignalR
- **Reconexão automática**: Implementa estratégia de reconexão com backoff
- **Gerenciamento de estado**: Controla estados de conexão e reconexão
- **Eventos de pagamento**: Escuta eventos `OnConnectedHub` e `ReceivePagamentoConfirmado`

### 2. Integração no Componente DizimoTest

- **Escuta em tempo real**: Inicia automaticamente quando QR Code PIX é gerado
- **Fallback por polling**: Mantém verificação por polling como backup
- **Fechamento automático**: Fecha modal automaticamente após confirmação (3 segundos)
- **Indicadores visuais**: Mostra status da conexão SignalR no modal

## Como Funciona

### Fluxo de Pagamento PIX

1. **Usuário solicita dízimo via PIX**
2. **Sistema gera QR Code PIX**
3. **Modal PIX é aberto com QR Code**
4. **SignalR conecta automaticamente** usando chave única: `{lancamentoId}{codigoExportacao}`
5. **Polling é desabilitado** - apenas SignalR escuta mudanças de status
6. **Sistema escuta eventos** `OnConnectedHub` e `ReceivePagamentoConfirmado`
7. **Quando pagamento é confirmado**:
   - Status muda para "confirmed"
   - Modal fecha automaticamente após 3 segundos
   - Formulário é limpo
   - Resultado de sucesso é exibido

### Chave de Conexão SignalR

A chave é construída da mesma forma que no AngularJS:
```typescript
const key = `${lancamentoId}${codigoExportacao}`;
```

### Eventos SignalR

- **`OnConnectedHub`**: Confirma que a conexão foi estabelecida
- **`ReceivePagamentoConfirmado`**: Recebe confirmação de pagamento PIX (exatamente como no AngularJS)

### Comportamento do Pagamento

- **`response` válido**: Pagamento confirmado com sucesso
- **`response` null/undefined**: Erro na comunicação
- **Timeout**: 10 segundos para conexão (não fecha modal)

## Configuração

### URL do Hub SignalR

A URL é construída dinamicamente baseada no hostname atual:

**Desenvolvimento (localhost)**:
```typescript
const hubUrl = 'https://producao6.theos.com.br/EclesialPix/pixHub';
```

**Produção (hostname dinâmico)**:
```typescript
const hostname = window.location.hostname; // ex: producao6.theos.com.br
const hubUrl = `https://${hostname}/EclesialPix/pixHub`;
```

**Exemplos de URLs de produção**:
- `https://producao6.theos.com.br/EclesialPix/pixHub`
- `https://producao7.theos.com.br/EclesialPix/pixHub`
- `https://producao8.theos.com.br/EclesialPix/pixHub`

**Endpoint de negociação**: `https://{hostname}/EclesialPix/pixHub/negotiate?key={lancamentoId}{codigoExportacao}&negotiateVersion=1`

Para usar uma URL customizada, modifique o parâmetro `baseUrl` na função `initSignalR()`.

### Timeout de Conexão

- **Timeout**: 10 segundos para conexão SignalR
- **Comportamento**: Se não conectar em 10 segundos, para tentativa de conexão
- **Modal**: NÃO fecha automaticamente - permanece aberto até confirmação ou cancelamento manual
- **Usuário**: Pode fechar manualmente clicando em "Fechar" ou aguardar confirmação do pagamento

### Estratégia de Reconexão

- **1ª tentativa**: Imediata (0s)
- **2ª tentativa**: 2 segundos
- **3ª tentativa**: 10 segundos
- **Demais tentativas**: 30 segundos

## Estados Visuais

### Modal PIX

- **Status de conexão**: Mostra se SignalR está conectado
- **Indicador em tempo real**: Ponto verde pulsante quando conectado
- **Mensagem de confirmação**: "Conectado em tempo real" quando ativo

### Polling Completamente Desabilitado

Em produção:
- **Polling foi completamente removido** - não há mais requisições para `/api/v1/pix/obterQrCode/`
- **Apenas SignalR escuta** mudanças de status
- **Zero tráfego de polling** - apenas conexão SignalR em tempo real
- **Resposta instantânea** quando pagamento é confirmado
- **Função `iniciarVerificacaoPix` desabilitada** - retorna imediatamente

### Tratamento de Erros

- **Erro de conexão**: Fallback para polling (apenas se SignalR falhar)
- **Erro de pagamento**: Modal fecha com mensagem de erro
- **Timeout**: Reconexão automática

## Comparação com AngularJS

| AngularJS | React/TypeScript |
|-----------|------------------|
| `this.qrCodeHubConnection = this.service.initSignalR(key)` | `await signalRService.initSignalR(key)` |
| `this.qrCodeHubConnection.on('OnConnectedHub')` | `signalRService.listenPaymentConfirmation()` |
| `this.qrCodeHubConnection.on('ReceivePagamentoConfirmado')` | Callback automático no listener |
| `modalContext.fechar(true)` | `handleClosePixModal(true)` |
| `setTimeout(() => modalContext.fechar(true), 3000)` | `setTimeout(() => handleClosePixModal(true), 3000)` |

## Benefícios da Implementação

1. **Tempo real**: Confirmação instantânea de pagamento
2. **Experiência do usuário**: Não precisa verificar manualmente
3. **Confiabilidade**: Fallback por polling se SignalR falhar
4. **Consistência**: Comportamento similar ao sistema AngularJS
5. **Indicadores visuais**: Usuário sabe que está conectado

## Limpeza de Recursos

- **Desmontagem do componente**: Para conexão SignalR automaticamente
- **Fechamento do modal**: Limpa todos os estados e conexões
- **Mudança de página**: Para conexões ativas

## Logs e Debug

O sistema gera logs detalhados para debug:
- `🔗 Iniciando conexão SignalR`
- `✅ SignalR conectado com sucesso`
- `💰 Pagamento confirmado via SignalR`
- `🚪 Fechando modal PIX`

## Próximos Passos

1. **Testar com servidor real**: Verificar se URL do hub está correta
2. **Ajustar timeout**: Modificar tempo de fechamento automático se necessário
3. **Adicionar métricas**: Implementar tracking de sucesso/falha de conexões
4. **Otimizar reconexão**: Ajustar estratégia baseada em uso real
