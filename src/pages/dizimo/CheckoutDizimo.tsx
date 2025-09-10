import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEclesialAuth } from '@/contexts/EclesialAuthContext';
import { eclesialApi } from '@/services/eclesialApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { 
  Gift, 
  CreditCard, 
  Smartphone, 
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { TipoRecebimento, QrCodePix } from '@/types/eclesial';
import { signalRService, PaymentConfirmationResponse } from '@/services/signalrService';

interface ParametrosDizimo {
  tipoRecebimentoId: number;
  tipoRecebimentoNome: string;
  tipoRecebimentoCompleto?: TipoRecebimento;
}

interface DizimistaData {
  id: number;
  nome: string;
  cnpjCpf: string;
  email: string;
  comunidadeId: number;
  nomeComunidade: string;
}

interface CheckoutDizimoProps {
  isEmbedded?: boolean;
}

const CheckoutDizimo: React.FC<CheckoutDizimoProps> = ({ isEmbedded = false }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, buscarTiposRecebimento, userData } = useEclesialAuth();
  
  const [parametros, setParametros] = useState<ParametrosDizimo | null>(null);
  const [valor, setValor] = useState<string>('');
  const [cpf, setCpf] = useState<string>('');
  const [formaPagamento, setFormaPagamento] = useState<'pix' | 'credito'>('pix');
  const [isProcessando, setIsProcessando] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; data?: unknown } | null>(null);
  
  const [dizimista, setDizimista] = useState<DizimistaData | null>(null);
  const [isBuscandoDizimista, setIsBuscandoDizimista] = useState(false);
  const [dizimistaNaoEncontrado, setDizimistaNaoEncontrado] = useState(false);
  
  const [tiposRecebimento, setTiposRecebimento] = useState<TipoRecebimento[]>([]);
  const [tipoRecebimentoSelecionado, setTipoRecebimentoSelecionado] = useState<TipoRecebimento | null>(null);
  const [isLoadingTiposRecebimento, setIsLoadingTiposRecebimento] = useState(false);
  
  const [qrCodePix, setQrCodePix] = useState<QrCodePix | null>(null);
  const [isLoadingQrCode, setIsLoadingQrCode] = useState(false);
  const [showPixModal, setShowPixModal] = useState(false);
  const [pixStatus, setPixStatus] = useState<'pending' | 'confirmed' | 'error'>('pending');
  const [idLancamento, setIdLancamento] = useState<number | null>(null);

  useEffect(() => {
    const paramsEncoded = searchParams.get('params');
    
    if (paramsEncoded) {
      try {
        const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
        if (!base64Regex.test(paramsEncoded)) {
          throw new Error('String não é um base64 válido');
        }
        
        const paramsDecoded = JSON.parse(decodeURIComponent(atob(paramsEncoded)));
        setParametros(paramsDecoded);
      } catch (error) {
        if (!isEmbedded) {
          toast({
            title: "Erro nos parâmetros",
            description: `Erro ao decodificar parâmetros: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
            variant: "destructive",
          });
          navigate('/eclesial-test');
        }
      }
    } else {
      if (!isEmbedded) {
        toast({
          title: "Parâmetros não encontrados",
          description: "Esta página requer parâmetros válidos.",
          variant: "destructive",
        });
        navigate('/eclesial-test');
      }
    }
  }, [searchParams, navigate, isEmbedded]);

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Login necessário",
        description: "Você precisa fazer login para realizar dízimos.",
        variant: "destructive",
      });
    } else {
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const carregarTiposRecebimento = async () => {
      setIsLoadingTiposRecebimento(true);
      try {
        const response = await buscarTiposRecebimento();
        if (response.success && response.data) {
          const tipos = Array.isArray(response.data) ? response.data : [response.data];
          setTiposRecebimento(tipos);
          
          if (parametros?.tipoRecebimentoCompleto) {
            setTipoRecebimentoSelecionado(parametros.tipoRecebimentoCompleto);
          } else {
            const contaPixPadrao = tipos.find(tipo => 
              tipo.banco?.chavePix === 'ZZ123919' || 
              tipo.codigo === 'ZZ123919' ||
              tipo.nome?.toLowerCase().includes('pix')
            );
            
            if (contaPixPadrao) {
              setTipoRecebimentoSelecionado(contaPixPadrao);
            } else {
              if (tipos.length > 0) {
                setTipoRecebimentoSelecionado(tipos[0]);
              }
            }
          }
        }
      } catch (error) {
      } finally {
        setIsLoadingTiposRecebimento(false);
      }
    };

    if (isAuthenticated) {
      carregarTiposRecebimento();
    }
  }, [isAuthenticated, buscarTiposRecebimento, parametros]);

  const getNumericValue = (): number => {
    if (!valor) return 0;
    const cleanValue = valor.replace(/[^\d,.-]/g, '');
    const normalizedValue = cleanValue.replace(',', '.');
    return parseFloat(normalizedValue) || 0;
  };

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    const valorLimpo = valor.replace(/[^\d,.]/g, '');
    setValor(valorLimpo);
  };

  const formatCpf = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    
    return numbers.slice(0, 11).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatCpf(value);
    setCpf(formatted);
    
    setDizimista(null);
    setDizimistaNaoEncontrado(false);
  };

  const isValidCpf = (cpf: string): boolean => {
    const numbers = cpf.replace(/\D/g, '');
    return numbers.length === 11;
  };

  const buscarDizimista = async () => {
    if (!cpf || !isValidCpf(cpf)) {
      setResult({ success: false, message: 'Digite um CPF válido para buscar' });
      return;
    }

    setIsBuscandoDizimista(true);
    setDizimistaNaoEncontrado(false);
    setDizimista(null);

    try {
      const cpfLimpo = cpf.replace(/\D/g, '');
      const response = await eclesialApi.buscarDizimistaPorCpf(cpfLimpo);
      
      if (response.success && response.data) {
        const data = response.data as unknown;
        
        const items = (data as any)?.items || (data as any)?.data || data;
        
        if (items && Array.isArray(items) && items.length > 0) {
          const dizimistaEncontrado = items.find((item: unknown) => {
            const itemData = item as { cnpjCpf?: string; cpf?: string };
            const cnpjCpfItem = itemData.cnpjCpf || itemData.cpf || '';
            const cnpjCpfLimpo = cnpjCpfItem.replace(/\D/g, '');
            return cnpjCpfLimpo === cpfLimpo;
          });
          
          if (dizimistaEncontrado) {
            const dizimistaData = dizimistaEncontrado as DizimistaData;
            setDizimista({
              id: dizimistaData.id,
              nome: dizimistaData.nome || '',
              cnpjCpf: dizimistaData.cnpjCpf || cpfLimpo,
              email: dizimistaData.email || '',
              comunidadeId: dizimistaData.comunidadeId || 0,
              nomeComunidade: dizimistaData.nomeComunidade || ''
            });
          } else {
            setDizimistaNaoEncontrado(true);
            setResult({ 
              success: false, 
              message: 'CPF não encontrado. A oferta será anônima.' 
            });
          }
        } else {
          setDizimistaNaoEncontrado(true);
          setResult({ 
            success: false, 
            message: 'CPF não encontrado. A oferta será anônima.' 
          });
        }
      } else {
        setDizimistaNaoEncontrado(true);
        setResult({ 
          success: false, 
          message: 'CPF não encontrado. A oferta será anônima.' 
        });
      }
    } catch (error) {
      setDizimistaNaoEncontrado(true);
      setResult({ 
        success: false, 
        message: 'Erro ao buscar dizimista. A oferta será anônima.' 
      });
    } finally {
      setIsBuscandoDizimista(false);
    }
  };

  const handleGerarQrCodePix = async (lancamentoId: number, origemTipo: number) => {
    setIsLoadingQrCode(true);
    try {
      const codigoExportacao = userData?.organismoCodigoExportacao;
      
      const response = await eclesialApi.obterQrCodePix(lancamentoId, codigoExportacao, origemTipo);
      if (response.success && response.data) {
        const qrData = response.data as QrCodePix;
        setQrCodePix(qrData);
        setShowPixModal(true);
        setPixStatus('pending');
        
        await signalRService.initSignalR('pix-payment');
        signalRService.listenPaymentConfirmation(
          (data: PaymentConfirmationResponse) => {
            setPixStatus('confirmed');
            setResult({
              success: true,
              message: 'Pagamento PIX confirmado com sucesso!',
              data: data
            });
            setShowPixModal(false);
            setValor('');
            setCpf('');
            setDizimista(null);
            setDizimistaNaoEncontrado(false);
          },
          (error: Error | string) => {
            setPixStatus('error');
          }
        );
      } else {
        setResult({
          success: false,
          message: 'Erro ao gerar QR Code PIX'
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Erro ao gerar QR Code PIX'
      });
    } finally {
      setIsLoadingQrCode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const numericValue = getNumericValue();
    if (!numericValue || numericValue <= 0) {
      setResult({ success: false, message: 'Digite um valor válido' });
      return;
    }

    if (!cpf || !isValidCpf(cpf)) {
      setResult({ success: false, message: 'CPF é obrigatório e deve ser válido' });
      return;
    }

    if (!parametros) {
      setResult({ success: false, message: 'Parâmetros não encontrados' });
      return;
    }

    if (!tipoRecebimentoSelecionado) {
      setResult({ success: false, message: 'Selecione um tipo de recebimento antes de continuar' });
      return;
    }

    setIsProcessando(true);
    setResult(null);

    try {
      const agora = new Date();
      const mesReferente = agora.getMonth() + 1; // getMonth() retorna 0-11, então +1 para 1-12
      const anoReferente = agora.getFullYear();

      const payloadReal = {
        cartaoStatus: null,
        anonima: !dizimista, // Anônima apenas se não encontrar dizimista
        data: new Date().toLocaleDateString('pt-BR'),
        mesReferente: mesReferente,
        anoReferente: anoReferente,
        tipoRecebimento: tipoRecebimentoSelecionado ? {
          ...tipoRecebimentoSelecionado,
          chavePix: tipoRecebimentoSelecionado.chavePix || tipoRecebimentoSelecionado.banco?.chavePix || null,
          visible: true
        } : {},
        isTotem: false,
        fiel: dizimista ? {
          dizimistaId: dizimista.id,
          id: dizimista.id,
          nome: dizimista.nome,
          nomeComunidade: dizimista.nomeComunidade,
          comunidadeId: dizimista.comunidadeId,
          comunidadeIdCentrosCustos: dizimista.comunidadeId,
          cnpjCpf: dizimista.cnpjCpf,
          email: dizimista.email
        } : {
          dizimistaId: null,
          id: null,
          nome: "",
          nomeComunidade: "",
          comunidadeId: null,
          comunidadeIdCentrosCustos: null,
          cnpjCpf: cpf.replace(/\D/g, ''), // Usar o CPF digitado quando não encontrar dizimista
          email: ""
        },
        servicoCemiterio: {},
        id: 0,
        valor: getNumericValue(),
        lancamentoViaPix: formaPagamento === 'pix'
      };

      const response = await eclesialApi.realizarDizimo(payloadReal as unknown as import('../types/eclesial').DizimoPayload);
      
      if (response.success) {
        if (formaPagamento === 'pix' && response.data) {
          const lancamentoData = response.data as { 
            id?: number; 
            Id?: number; 
            origemTipo?: number; 
            OrigemTipo?: number; 
          };
          const lancamentoId = lancamentoData.id || lancamentoData.Id;
          const origemTipo = lancamentoData.origemTipo || lancamentoData.OrigemTipo;
          
          
          if (lancamentoId) {
            setIdLancamento(lancamentoId);
            await handleGerarQrCodePix(lancamentoId, origemTipo);
          } else {
            setResult({
              success: false,
              message: 'ID do lançamento não encontrado na resposta.'
            });
          }
          return; // Não mostrar resultado de sucesso ainda, aguardar confirmação PIX
        }
        
        setResult({
          success: true,
          message: `Dízimo parametrizado via ${formaPagamento.toUpperCase()} realizado com sucesso!`,
          data: response.data
        });
        
        setValor('');
        setCpf('');
        setDizimista(null);
        setDizimistaNaoEncontrado(false);
      } else {
        setResult({
          success: false,
          message: 'Erro na transação de dízimo'
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    } finally {
      setIsProcessando(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={`${isEmbedded ? 'p-4' : 'min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4'}`}>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-xl text-yellow-700">Login Necessário</CardTitle>
            <CardDescription>
              Você precisa fazer login para realizar dízimos parametrizados.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              onClick={() => navigate('/eclesial-test')}
              className="w-full"
            >
              Ir para Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!parametros) {
    if (isEmbedded) {
      const parametrosPadrao = {
        tipoRecebimentoId: 1,
        tipoRecebimentoNome: 'Dízimo Digital',
        paroquiaId: 1,
        checkoutId: 'dizimo-demo',
        amount: '100.00',
        theme: 'light'
      };
      setParametros(parametrosPadrao);
      return null; // Retorna null para que o useEffect seja executado
    } else {
      return (
        <div className={`${isEmbedded ? 'p-4' : 'min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4'}`}>
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Carregando parâmetros...</p>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  if (isEmbedded) {
    return (
      <>
        <Card className="w-full shadow-xl border-0 bg-white">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Gift className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800 mb-1">Dízimo Digital</CardTitle>
            <CardDescription className="text-gray-600">
              Complete sua contribuição de forma rápida e segura
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-6 pb-6">

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Campo de Valor */}
              <div className="space-y-2">
                <Label htmlFor="valor" className="text-base font-semibold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Valor do Dízimo
                </Label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 text-lg font-semibold">
                    R$
                  </div>
                  <Input
                    id="valor"
                    type="text"
                    inputMode="decimal"
                    placeholder="0,00"
                    value={valor}
                    onChange={handleValorChange}
                    className="pl-12 h-14 text-xl font-semibold border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 rounded-xl transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Campo de CPF para busca de dizimista */}
              <div className="space-y-2">
                <Label htmlFor="cpf" className="text-base font-semibold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  CPF do Dizimista *
                </Label>
                <div className="flex gap-3">
                  <Input
                    id="cpf"
                    type="text"
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={handleCpfChange}
                    className="h-14 text-lg flex-1 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl transition-all duration-200"
                    maxLength={14}
                  />
                  <Button
                    type="button"
                    onClick={buscarDizimista}
                    disabled={!cpf || !isValidCpf(cpf) || isBuscandoDizimista}
                    className="h-14 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isBuscandoDizimista ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      'Buscar'
                    )}
                  </Button>
                </div>
                {cpf && !isValidCpf(cpf) && (
                  <p className="text-sm text-red-600 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    CPF deve ter 11 dígitos
                  </p>
                )}
                
                {/* Status da busca */}
                {dizimista && (
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-green-800">Dizimista encontrado!</p>
                        <p className="text-sm text-green-700">{dizimista.nome}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {dizimistaNaoEncontrado && (
                  <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                        <AlertCircle className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-orange-800">CPF não encontrado</p>
                        <p className="text-sm text-orange-700">A oferta será processada como anônima</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Forma de Pagamento */}
              <div className="space-y-3">
                <Label className="text-base font-semibold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Forma de Pagamento
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant={formaPagamento === 'pix' ? 'default' : 'outline'}
                    onClick={() => setFormaPagamento('pix')}
                    className={`h-14 text-base font-semibold transition-all duration-200 rounded-xl ${
                      formaPagamento === 'pix' 
                        ? 'bg-blue-600 hover:bg-blue-700 shadow-lg text-white' 
                        : 'border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-blue-600'
                    }`}
                  >
                    PIX
                  </Button>
                  <Button
                    type="button"
                    variant={formaPagamento === 'credito' ? 'default' : 'outline'}
                    onClick={() => setFormaPagamento('credito')}
                    className={`h-14 text-base font-semibold transition-all duration-200 rounded-xl ${
                      formaPagamento === 'credito' 
                        ? 'bg-blue-600 hover:bg-blue-700 shadow-lg text-white' 
                        : 'border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-blue-600'
                    }`}
                  >
                    Crédito
                  </Button>
                </div>
                
                {/* Informação sobre PIX */}
                {formaPagamento === 'pix' && (
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Smartphone className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-blue-800 text-sm">Pagamento PIX</p>
                        <p className="text-xs text-blue-700 mt-1">
                          Você receberá um QR Code ou linha digital para pagamento instantâneo e seguro.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Botão de Submissão */}
              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 h-16 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={isProcessando || !valor || !tipoRecebimentoSelecionado || !cpf || !isValidCpf(cpf)}
                >
                  {isProcessando ? (
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span>Processando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Gift className="h-6 w-6" />
                      <span>Realizar Dízimo</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>

          </CardContent>
        </Card>

        {/* Modal PIX */}
      {showPixModal && qrCodePix && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border-0">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Smartphone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Pagamento PIX</h3>
              <p className="text-gray-600 mb-6">Escaneie o QR Code ou copie o código para pagar</p>
              
              {pixStatus === 'pending' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl border-2 border-gray-200">
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                      {qrCodePix.qrCode ? (
                        <img 
                          src={`data:image/png;base64,${qrCodePix.qrCode}`} 
                          alt="QR Code PIX" 
                          className="mx-auto max-w-full h-auto"
                          onError={(e) => {
                          }}
                        />
                      ) : (
                        <div className="text-center p-8">
                          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="h-8 w-8 text-gray-500" />
                          </div>
                          <p className="text-gray-600">QR Code não disponível</p>
                          <p className="text-sm text-gray-500 mt-2">
                            Dados recebidos: {JSON.stringify(qrCodePix, null, 2)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-base font-semibold text-gray-800">Código PIX:</Label>
                    <div className="flex gap-2">
                      <Input
                        value={qrCodePix.qrCodeText || qrCodePix.textContent || ''}
                        readOnly
                        className="text-sm font-mono border-2 border-gray-200 rounded-xl"
                      />
                      <Button
                        onClick={() => {
                          const codigo = qrCodePix.qrCodeText || qrCodePix.textContent || '';
                          navigator.clipboard.writeText(codigo);
                          toast({
                            title: "Código copiado!",
                            description: "Código PIX copiado para a área de transferência.",
                          });
                        }}
                        className="px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold"
                      >
                        Copiar
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Aguardando confirmação do pagamento...</span>
                  </div>
                </div>
              )}
              
              {pixStatus === 'confirmed' && (
                <div className="space-y-6">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="h-12 w-12 text-white" />
                  </div>
                  <div className="text-center">
                    <h4 className="text-2xl font-bold text-green-700 mb-2">Pagamento Confirmado!</h4>
                    <p className="text-gray-600">
                      Seu dízimo foi processado com sucesso.
                    </p>
                  </div>
                </div>
              )}
              
              <div className="mt-8 flex gap-3">
                <Button
                  onClick={() => setShowPixModal(false)}
                  variant="outline"
                  className="flex-1 h-12 border-2 border-gray-200 hover:border-gray-300 rounded-xl font-semibold"
                >
                  Cancelar
                </Button>
                {pixStatus === 'confirmed' && (
                  <Button
                    onClick={() => navigate('/agradecimento', { 
                      state: { 
                        tipo: 'dizimo',
                        valor: getNumericValue(),
                        formaPagamento: formaPagamento,
                        parametros: parametros
                      }
                    })}
                    className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold"
                  >
                    Ver Agradecimento
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-lg mx-auto pt-8">
        <Card className="w-full shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Gift className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800 mb-1">Dízimo Digital</CardTitle>
            <CardDescription className="text-gray-600">
              Complete sua contribuição de forma rápida e segura
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-6 pb-6">

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Campo de Valor */}
              <div className="space-y-2">
                <Label htmlFor="valor" className="text-base font-semibold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Valor do Dízimo
                </Label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 text-lg font-semibold">
                    R$
                  </div>
                  <Input
                    id="valor"
                    type="text"
                    inputMode="decimal"
                    placeholder="0,00"
                    value={valor}
                    onChange={handleValorChange}
                    className="pl-12 h-14 text-xl font-semibold border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 rounded-xl transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Campo de CPF para busca de dizimista */}
              <div className="space-y-2">
                <Label htmlFor="cpf" className="text-base font-semibold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  CPF do Dizimista *
                </Label>
                <div className="flex gap-3">
                  <Input
                    id="cpf"
                    type="text"
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={handleCpfChange}
                    className="h-14 text-lg flex-1 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl transition-all duration-200"
                    maxLength={14}
                  />
                  <Button
                    type="button"
                    onClick={buscarDizimista}
                    disabled={!cpf || !isValidCpf(cpf) || isBuscandoDizimista}
                    className="h-14 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isBuscandoDizimista ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      'Buscar'
                    )}
                  </Button>
                </div>
                {cpf && !isValidCpf(cpf) && (
                  <p className="text-sm text-red-600 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    CPF deve ter 11 dígitos
                  </p>
                )}
                
                {/* Status da busca */}
                {dizimista && (
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-green-800">Dizimista encontrado!</p>
                        <p className="text-sm text-green-700">{dizimista.nome}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {dizimistaNaoEncontrado && (
                  <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                        <AlertCircle className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-orange-800">CPF não encontrado</p>
                        <p className="text-sm text-orange-700">A oferta será processada como anônima</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Forma de Pagamento */}
              <div className="space-y-3">
                <Label className="text-base font-semibold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Forma de Pagamento
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant={formaPagamento === 'pix' ? 'default' : 'outline'}
                    onClick={() => setFormaPagamento('pix')}
                    className={`h-14 text-base font-semibold transition-all duration-200 rounded-xl ${
                      formaPagamento === 'pix' 
                        ? 'bg-blue-600 hover:bg-blue-700 shadow-lg text-white' 
                        : 'border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-blue-600'
                    }`}
                  >
                    PIX
                  </Button>
                  <Button
                    type="button"
                    variant={formaPagamento === 'credito' ? 'default' : 'outline'}
                    onClick={() => setFormaPagamento('credito')}
                    className={`h-14 text-base font-semibold transition-all duration-200 rounded-xl ${
                      formaPagamento === 'credito' 
                        ? 'bg-blue-600 hover:bg-blue-700 shadow-lg text-white' 
                        : 'border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-blue-600'
                    }`}
                  >
                    Crédito
                  </Button>
                </div>
                
                {/* Informação sobre PIX */}
                {formaPagamento === 'pix' && (
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Smartphone className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-blue-800 text-sm">Pagamento PIX</p>
                        <p className="text-xs text-blue-700 mt-1">
                          Você receberá um QR Code ou linha digital para pagamento instantâneo e seguro.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Botão de Submissão */}
              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 h-16 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={isProcessando || !valor || !tipoRecebimentoSelecionado || !cpf || !isValidCpf(cpf)}
                >
                  {isProcessando ? (
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span>Processando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Gift className="h-6 w-6" />
                      <span>Realizar Dízimo</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>

          </CardContent>
        </Card>
      </div>

      {/* Modal PIX */}
      {showPixModal && qrCodePix && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border-0">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Smartphone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Pagamento PIX</h3>
              <p className="text-gray-600 mb-6">Escaneie o QR Code ou copie o código para pagar</p>
              
              {pixStatus === 'pending' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl border-2 border-gray-200">
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                      {qrCodePix.qrCode ? (
                        <img 
                          src={`data:image/png;base64,${qrCodePix.qrCode}`} 
                          alt="QR Code PIX" 
                          className="mx-auto max-w-full h-auto"
                          onError={(e) => {
                          }}
                        />
                      ) : (
                        <div className="text-center p-8">
                          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="h-8 w-8 text-gray-500" />
                          </div>
                          <p className="text-gray-600">QR Code não disponível</p>
                          <p className="text-sm text-gray-500 mt-2">
                            Dados recebidos: {JSON.stringify(qrCodePix, null, 2)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-base font-semibold text-gray-800">Código PIX:</Label>
                    <div className="flex gap-2">
                      <Input
                        value={qrCodePix.qrCodeText || qrCodePix.textContent || ''}
                        readOnly
                        className="text-sm font-mono border-2 border-gray-200 rounded-xl"
                      />
                      <Button
                        onClick={() => {
                          const codigo = qrCodePix.qrCodeText || qrCodePix.textContent || '';
                          navigator.clipboard.writeText(codigo);
                          toast({
                            title: "Código copiado!",
                            description: "Código PIX copiado para a área de transferência.",
                          });
                        }}
                        className="px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold"
                      >
                        Copiar
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Aguardando confirmação do pagamento...</span>
                  </div>
                </div>
              )}
              
              {pixStatus === 'confirmed' && (
                <div className="space-y-6">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="h-12 w-12 text-white" />
                  </div>
                  <div className="text-center">
                    <h4 className="text-2xl font-bold text-green-700 mb-2">Pagamento Confirmado!</h4>
                    <p className="text-gray-600">
                      Seu dízimo foi processado com sucesso.
                    </p>
                  </div>
                </div>
              )}
              
              <div className="mt-8 flex gap-3">
                <Button
                  onClick={() => setShowPixModal(false)}
                  variant="outline"
                  className="flex-1 h-12 border-2 border-gray-200 hover:border-gray-300 rounded-xl font-semibold"
                >
                  Cancelar
                </Button>
                {pixStatus === 'confirmed' && (
                  <Button
                    onClick={() => navigate('/agradecimento', { 
                      state: { 
                        tipo: 'dizimo',
                        valor: getNumericValue(),
                        formaPagamento: formaPagamento,
                        parametros: parametros
                      }
                    })}
                    className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold"
                  >
                    Ver Agradecimento
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutDizimo;
