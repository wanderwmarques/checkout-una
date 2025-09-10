
export interface EclesialAuth {
  email: string;
  senha: string;
}

export interface EclesialAuthResponse {
  token: string;
  refresh_token?: string; // Adicionar refresh_token
  userData?: Record<string, unknown>;
  paroquia?: Record<string, unknown>;
  diocese?: Record<string, unknown>;
  usuarioNome?: string;
  usuarioLogin?: string;
  usuarioEmail?: string;
  dioceseId?: string;
  nomeDiocese?: string;
  dioceseIdDbCentral?: string;
  organismoNome?: string;
  hostName?: string;
  DbCentralHost?: string;
  dbCentralHost?: string;
  DbName?: string;
  dbName?: string;
  organismoCodigoExportacao?: string;
  organismoIdDbCentral?: string;
}

export interface TipoRecebimento {
  id: number;
  nome: string;
  descricao?: string;
  codigo?: string;
  ativo?: boolean;
  
  tipo?: number;
  bancoId?: number | null;
  banco?: {
    contaContabilId?: number | null;
    nomeBanco?: string;
    agencia?: string;
    digitoAgencia?: string | null;
    nomeAgencia?: string;
    tipoConta?: string | null;
    conta?: string;
    codigo?: number;
    digitoConta?: string | null;
    bancoId?: number;
    codigoIntegracao?: string | null;
    postoAgencia?: string | null;
    operacaoConta?: string | null;
    inativacao?: {
      cadastroAtivo?: number;
      data?: string | null;
      motivo?: string | null;
      motivoInativacaoId?: number | null;
      observacao?: string | null;
      usuario?: string | null;
      canUserEdit?: boolean;
    };
    recebimentoIntegracaoEclesial?: boolean;
    codigoFebraban?: string | null;
    chavePix?: string;
    origem?: number;
    organismoId?: number | null;
    dioceseId?: number | null;
    id?: number;
  } | null;
  isCaixa?: boolean;
  isBanco?: boolean;
  isBoleto?: boolean;
  isCartao?: boolean;
  isCartaoCredito?: boolean;
  isCieloDebito?: boolean;
  isCieloCredito?: boolean;
  isCielo?: boolean;
  isAnyCielo?: boolean;
  isAnyStone?: boolean;
  isStoneSemMaquina?: boolean;
  isStoneDebito?: boolean;
  isStoneCredito?: boolean;
  isStoneBoleto?: boolean;
  isSemMaquininha?: boolean;
  liberado?: boolean;
  mensagem?: string | null;
  visible?: boolean;
  maquinaId?: number | null;
  chavePix?: string | null;
  organismoId?: number | null;
  dioceseId?: number | null;
}

export interface Fiel {
  dizimistaId: number;
  id: number;
  nome: string;
  nomeComunidade: string;
  comunidadeId: number;
  comunidadeIdCentrosCustos: number;
  cnpjCpf: string | null;
  email: string | null;
}

export interface CentroCusto {
  id: number;
}

export interface Comunidade {
  contatos: Record<string, unknown>[];
  grupos: Record<string, unknown>[];
  id: number;
  nome: string;
  centroCusto: CentroCusto;
}

export interface ClassificacaoFinanceira {
  descricao: string;
  codigo: number;
  historicoQuitacaoId: number | null;
  complementoHistoricoQuitacao: string;
  destino: number;
  situacao: number;
  dioceseId: number | null;
  id: number;
}

export interface TipoOferta {
  id: number;
  nome: string;
  dataInicio: string | null;
  dataFinal: string | null;
  ativo: boolean;
  usaPeriodo: boolean;
  disponivelAplicativos: boolean;
  classificacaoFinanceira: ClassificacaoFinanceira;
  codigo: string | null;
}

export interface TipoOfertaLancamento {
  id: number;
  nome: string;
  dataInicio: string | null;
  dataFinal: string | null;
  ativo: boolean;
  usaPeriodo: boolean;
  disponivelAplicativos: boolean;
  classificacaoFinanceira: ClassificacaoFinanceira;
  codigo: string | null;
}

export interface DizimoPayload {
  cartaoStatus: string | null;
  anonima: boolean;
  data: string;
  tipoRecebimento: TipoRecebimento;
  isTotem: boolean;
  tipoOferta: TipoOferta | {};
  fiel: Fiel;
  servicoCemiterio: any;
  lancamentosPeriodo: any[];
  anoReferente: number;
  mesReferente: number;
  isLancamentoPeriodo: boolean;
  isOfertaAdicional: boolean;
  id: number;
  comunidade: Comunidade;
  valor: number;
  lancamentoViaPix: boolean;
}

export interface OfertaPayload {
  cartaoStatus: string | null;
  anonima: boolean;
  data: string;
  tipoRecebimento: TipoRecebimento;
  isTotem: boolean;
  tipoOferta: TipoOferta | {};
  fiel: {
    dizimistaId: number | null;
    id: number | null;
    nome: string;
    nomeComunidade: string;
    comunidadeId: number | null;
    comunidadeIdCentrosCustos: number | null;
    cnpjCpf: string;
    email: string;
  };
  servicoCemiterio: any;
  id: number;
  tipo: TipoOfertaLancamento | {};
  comunidade: Comunidade;
  valor: number;
  lancamentoViaPix: boolean;
}

export interface DizimoResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export interface OfertaResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export interface StoredUserData {
  token: string;
  refresh_token?: string; // Adicionar refresh_token
  nomeUsuario: string;
  nomeParoquia: string;
  nomeDiocese: string;
  comunidadeId: number;
  dioceseId: number;
  fielId: number;
  usuarioNome?: string;
  usuarioLogin?: string;
  usuarioEmail?: string;
  dioceseIdDbCentral?: string;
  organismoNome?: string;
  hostName?: string;
  DbCentralHost?: string;
  dbCentralHost?: string;
  DbName?: string;
  dbName?: string;
  organismoCodigoExportacao?: string;
  organismoIdDbCentral?: string;
}

export interface OrganismoSearchCriteria {
  property: string;
  condition: string;
  value: string | null;
}

export interface Organismo {
  id: string;
  codigo?: string; // Código da paróquia
  razaoSocial: string;
  nomeFantasia?: string;
  ativo: boolean;
  codigoExportacao?: string;
  dbCentralHost?: string;
  dbName?: string;
  dioceseId?: string;
  nomeDiocese?: string;
}

export interface ParoquiaSwitchResponse {
  success: boolean;
  message: string;
  data?: {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
    organismoId: string;
    organismoNome: string;
    nomeParoquia: string;
    nomeDiocese: string;
    dbCentralHost: string;
    dbName: string;
  };
}

export interface RefreshTokenRequest {
  token: string;
  newToken: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  data?: {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
  };
}

export interface QrCodePix {
  id?: number;
  qrCode: string; // Base64 da imagem do QR Code
  qrCodeText?: string; // Texto do QR Code para copiar
  textContent?: string; // Texto do QR Code para copiar (alias)
  valor: number;
  dataVencimento?: string;
  status?: 'pending' | 'confirmed' | 'expired' | 'error';
  mensagem?: string;
  transactionIdMatera?: string; // ID da transação na Matera
  origemTipo?: number; // Tipo de origem do lançamento
}

export interface DizimoDadosAdicionais {
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
}

export interface LancamentoResponse {
  id?: number;
  Id?: number;
  idLancamento?: number;
  origemId?: number;
  OrigemId?: number;
  origemTipo?: number;
  OrigemTipo?: number;
  success?: boolean;
  message?: string;
  data?: unknown;
  status?: string;
  Status?: string;
}
