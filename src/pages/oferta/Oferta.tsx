import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoneyInput } from "@/components/ui/money-input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Smartphone, QrCode, Heart, ArrowLeft, AlertCircle } from "lucide-react";
import { ComprovanteOferta } from "@/components";
import { useNavigate, useSearchParams } from "react-router-dom";

const Oferta = () => {
  const [searchParams] = useSearchParams();
  const scope = (searchParams.get("scope") || "diocese").toLowerCase(); // "diocese" | "paroquia"
  const dioceseId = searchParams.get("dioceseId") || "1";
  const fixedParishId = searchParams.get("parishId") || "";
  const campanhaId = searchParams.get("campanhaId") || "";
  const campanhaNome = searchParams.get("campanhaNome") || "";
  const checkoutId = searchParams.get("checkoutId") || ""; // Novo parâmetro obrigatório
  const isEmbedded = searchParams.get("embed") === "true"; // Novo parâmetro para embed

  const [amount, setAmount] = useState("");
  const [offerType, setOfferType] = useState("comum");
  const [cpf, setCpf] = useState("");
  const [paroquia, setParoquia] = useState("");
  const [nomeBenfeitor, setNomeBenfeitor] = useState("");
  const dioceses = [
    { id: "1", name: "Diocese de Maringá" }
  ];
  const paroquiasPorDiocese: Record<string, { id: string; name: string }[]> = {
    "1": [
      { id: "1", name: "Catedral Nossa Senhora da Glória" },
      { id: "2", name: "Paróquia São José Operário" },
      { id: "3", name: "Paróquia Nossa Senhora do Carmo" },
      { id: "4", name: "Paróquia Nossa Senhora Aparecida" },
      { id: "5", name: "Paróquia Santa Rita de Cássia" },
      { id: "6", name: "Paróquia São Francisco de Assis" },
      { id: "7", name: "Paróquia São Pio X" }
    ]
  };

  const paroquias = useMemo(() => paroquiasPorDiocese[dioceseId] || [], [dioceseId]);
  const nomeDiocese = useMemo(() => dioceses.find(d => d.id === dioceseId)?.name || "", [dioceses, dioceseId]);
  const nomeParoquiaSelecionada = useMemo(() => paroquias.find(p => p.id === ((scope === "paroquia" || campanhaId) ? fixedParishId : paroquia))?.name || "", [paroquias, fixedParishId, paroquia, scope, campanhaId]);

  useEffect(() => {
    if (scope === "paroquia" && !checkoutId && !isEmbedded) {
      toast({
        title: "Erro",
        description: "ID de checkout não encontrado. Acesse através do link correto.",
        variant: "destructive",
      });
      setTimeout(() => navigate('/'), 3000);
      return;
    }

    
    if (fixedParishId) {
      setParoquia(fixedParishId);
    }
  }, [fixedParishId, checkoutId, scope]);

  useEffect(() => {
    return () => {
      setIsProcessing(false);
      setProcessStep('processing');
    };
  }, []);

  const [installments, setInstallments] = useState("1");
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [showPixModal, setShowPixModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState<'processing' | 'success' | 'comprovante'>('processing');
  const [metodoPagamentoAtual, setMetodoPagamentoAtual] = useState("");
  const [cardData, setCardData] = useState({
    number: "4111 1111 1111 1111",
    name: "USUARIO TESTE",
    expiry: "12/25",
    cvv: "123"
  });
  
  const [amountError, setAmountError] = useState(false);
  const [paroquiaError, setParoquiaError] = useState(false);
  const [cpfError, setCpfError] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();


  const formatCurrency = (value: string) => {
    const cleanValue = value.replace(/\D/g, "");
    
    if (!cleanValue) {
      return "";
    }

    const numberValue = parseFloat(cleanValue) / 100;

    return `R$ ${numberValue.toLocaleString("pt-BR", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const confirmarCheckout = async (checkoutId: string, valor: number) => {
    try {
      const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrYXl1eXB5eW54aWRzc3hhdG96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTI3MDExMSwiZXhwIjoyMDcwODQ2MTExfQ.Oy88LtGMXdl6zvw-9J1TYWck8tYHFcwc9SIiOZhNfAg';
      
      const response = await fetch(
        `https://bkayuypyynxidssxatoz.supabase.co/rest/v1/compras?id=eq.${checkoutId}`,
        {
          method: 'PATCH',
          headers: {
            'apikey': serviceRoleKey,
            'Authorization': `Bearer ${serviceRoleKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            confirmed: true, 
            valor: valor 
          })
        }
      );
      
      if (response.ok) {
        navigate(`/agradecimento?scope=${scope}`);
      } else {
        navigate(`/agradecimento?scope=${scope}`);
      }
    } catch (error) {
      navigate(`/agradecimento?scope=${scope}`);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value) {
      setAmount(formatCurrency(value));
      setAmountError(false); // Limpa erro quando valor é preenchido
    } else {
      setAmount("");
    }
  };

  const formatCPF = (value: string) => {
    const cleanValue = value.replace(/\D/g, "");
    return cleanValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 11) {
      setCpf(formatCPF(value));
      setCpfError(false); // Limpa erro quando CPF é preenchido
    }
  };

  const getNumericAmount = () => {
    if (!amount) return 0;
    const cleanAmount = amount.replace("R$ ", "").replace(/\./g, "").replace(",", ".");
    return parseFloat(cleanAmount) || 0;
  };

  const handlePayment = (method: string, installmentCount?: string) => {
    const numericAmount = getNumericAmount();
    if (!numericAmount) {
      toast({
        title: "Erro",
        description: "Por favor, insira o valor da oferta",
        variant: "destructive",
      });
      return;
    }

    if (scope === "paroquia" && !checkoutId) {
      toast({
        title: "Erro",
        description: "ID de checkout não encontrado. Acesse através do link correto.",
        variant: "destructive",
      });
      return;
    }

    setProcessStep('processing');
    setIsProcessing(true);
    setMetodoPagamentoAtual(method + (installmentCount ? ` em ${installmentCount}x` : ""));

    setTimeout(() => {
      setProcessStep('success');
      
      setTimeout(() => {
        setProcessStep('comprovante');
        
        if (scope === "paroquia" && checkoutId) {
          confirmarCheckout(checkoutId, numericAmount);
        } else {
          navigate(`/agradecimento?scope=${scope}`);
        }
      }, 2000);
    }, 2000);
  };

  const handleCreditPayment = () => {
    const numericAmount = getNumericAmount();
    let hasError = false;
    
    if (!numericAmount) {
      setAmountError(true);
      hasError = true;
    }
    
    if (scope === "paroquia" && !checkoutId) {
      toast({
        title: "Erro",
        description: "ID de checkout não encontrado. Acesse através do link correto.",
        variant: "destructive",
      });
      return;
    }
    
    if (hasError) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }
    
    setShowCreditModal(false);
    handlePayment("Cartão de Crédito", installments);
  };
  const handlePixPayment = () => {
    const numericAmount = getNumericAmount();
    let hasError = false;
    
    if (!numericAmount) {
      setAmountError(true);
      hasError = true;
    }
    
    if (scope === "paroquia" && !checkoutId) {
      toast({
        title: "Erro",
        description: "ID de checkout não encontrado. Acesse através do link correto.",
        variant: "destructive",
      });
      return;
    }
    
    if (hasError) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }
    
    setShowPixModal(true);
    
    setTimeout(() => {
      setShowPixModal(false);
      handlePayment("PIX");
    }, 3000);
  };

  const pixCode = "00020126360014BR.GOV.BCB.PIX0114+5511999999999520400005303986540" + getNumericAmount().toFixed(2) + "5802BR5913Igreja Matriz6009SAO PAULO62070503***6304";

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCode);
          toast({
        title: "Código copiado!",
        description: "Cole no seu app de pagamentos",
        variant: "success",
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* Background abstrato com cores - apenas quando não embedado */}
      {!isEmbedded && (
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-200 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-emerald-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-emerald-100 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-emerald-200 rounded-full blur-3xl"></div>
        </div>
      )}
      
      {/* Header com tarja e título */}
      <div className={`w-full bg-gradient-to-r from-emerald-100 to-emerald-200 ${isEmbedded ? 'p-3' : 'p-4'}`}>
        <div className={`${isEmbedded ? 'max-w-2xl' : 'max-w-md'} mx-auto text-center`}>
          <h1 className={`font-semibold text-emerald-700 flex items-center justify-center gap-3 ${isEmbedded ? 'text-lg' : 'text-xl'}`}>
            <div className="p-1.5 bg-emerald-200 rounded-full">
              <Heart className={`text-emerald-600 ${isEmbedded ? 'h-4 w-4' : 'h-5 w-5'}`} />
            </div>
            {campanhaId && campanhaNome ? "Contribuição para Campanha" : "Oferta"}
          </h1>
        </div>
      </div>
      
      {/* Título da Diocese fora do header */}
      <div className={`${isEmbedded ? 'max-w-2xl' : 'max-w-md'} mx-auto text-center ${isEmbedded ? 'p-2' : 'p-2'}`}>
        <div className="space-y-0">
          <h2 className={`font-bold text-gray-900 ${isEmbedded ? 'text-xl' : 'text-2xl'}`}>{nomeDiocese || "Diocese"}</h2>
          {nomeParoquiaSelecionada && (
            <h3 className={`text-gray-700 ${isEmbedded ? 'text-sm' : 'text-base'}`}>{nomeParoquiaSelecionada}</h3>
          )}
        </div>
      </div>
      
      {/* Separador visual */}
      <div className={`${isEmbedded ? 'max-w-2xl' : 'max-w-md'} mx-auto text-center mb-2`}>
        <div className="w-16 h-0.5 bg-gradient-to-r from-emerald-300 to-emerald-500 mx-auto rounded-full"></div>
      </div>
      {isProcessing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            {processStep === 'processing' ? (
              <>
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-lg font-medium text-gray-900">
                  {campanhaId && campanhaNome ? "Processando contribuição..." : "Processando oferta..."}
                </p>
                <p className="text-sm text-gray-500">Aguarde enquanto confirmamos sua transação</p>
              </>
            ) : processStep === 'success' ? (
              <>
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">✓</div>
                <p className="text-lg font-medium text-gray-900">
                  {campanhaId && campanhaNome ? "Contribuição confirmada!" : "Oferta confirmada!"}
                </p>
                <p className="text-sm text-gray-500">Sua contribuição foi processada com sucesso</p>
              </>
            ) : processStep === 'comprovante' ? (
              <ComprovanteOferta
                valor={amount}
                metodoPagamento={metodoPagamentoAtual}
                data={new Date().toLocaleDateString("pt-BR")}
                paroquia={nomeParoquiaSelecionada}
                tipoOferta={campanhaId && campanhaNome ? "Contribuição para Campanha" : (offerType === "comum" ? "Oferta Comum" : "Ação de Graças")}
                cpf={cpf}
                nomeBenfeitor={nomeBenfeitor}
                campanhaNome={campanhaNome}
                onClose={() => {
                  setIsProcessing(false);
                  setProcessStep('processing');
                  setCardData({ number: "", name: "", expiry: "", cvv: "" });
                  setInstallments("1");
                  setAmount("");
                  setCpf("");
                  setNomeBenfeitor("");
                  setShowCreditModal(false);
                  setShowPixModal(false);
                  setMetodoPagamentoAtual("");
                  
                  if (!campanhaId) {
                    setParoquia("");
                  }
                  
                  navigate('/agradecimento');
                }}
              />
            ) : null}
          </div>
        </div>
      )}
      <div className={`${isEmbedded ? 'max-w-2xl' : 'max-w-md'} mx-auto p-4`}>
        <div className="text-center mb-1 space-y-1">

          {/* Botão voltar - apenas quando não embedado */}
          {!isEmbedded && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => scope === "diocese" ? navigate('/') : navigate(-1)}
              className="absolute top-3 left-4 w-10 h-10 p-0 bg-gradient-to-br from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 border-2 border-emerald-200 hover:border-emerald-300 text-emerald-700 hover:text-emerald-800 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 rounded-full flex items-center justify-center backdrop-blur-sm"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          

        </div>

        <p className="text-sm text-muted-foreground mb-2 text-center">
          {campanhaId && campanhaNome 
            ? "Contribua para esta campanha específica" 
            : "Contribua com uma oferta anônima"
          }
        </p>

        {/* Card da Campanha */}
        {campanhaId && campanhaNome && (
          <Card className="mb-4 border-emerald-300 bg-emerald-50/70 shadow-md hover:shadow-lg transition-all">
            <CardContent className="p-3">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-200 px-1.5 py-0.5 rounded text-xs font-bold text-emerald-900">Campanha</span>
                  <span className="text-sm font-semibold text-emerald-800">{campanhaNome}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-200 px-1.5 py-0.5 rounded text-xs font-bold text-emerald-900">Paróquia</span>
                  <span className="text-sm font-semibold text-emerald-800">{nomeParoquiaSelecionada}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-200 px-1.5 py-0.5 rounded text-xs font-bold text-emerald-900">Referente</span>
                  <span className="text-sm font-semibold text-emerald-800">Contribuição para Campanha</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-200 px-1.5 py-0.5 rounded text-xs font-bold text-emerald-900">Data</span>
                  <span className="text-sm font-semibold text-emerald-800">{new Date().toLocaleDateString("pt-BR")}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Campo Nome do Benfeitor - Apenas para Campanhas */}
        {campanhaId && campanhaNome && (
          <Card className="mb-6 border-emerald-300 bg-white shadow-md hover:shadow-lg transition-all">
            <CardContent className="p-4">
              <div className="space-y-2">
                <Label htmlFor="nomeBenfeitor">Nome do Benfeitor</Label>
                <Input
                  id="nomeBenfeitor"
                  type="text"
                  placeholder="Digite seu nome completo"
                  value={nomeBenfeitor}
                  onChange={(e) => {
                    setNomeBenfeitor(e.target.value);
                    if (e.target.value.trim()) {
                    }
                  }}
                  className="text-base"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Card de configuração - Apenas para ofertas comuns (não campanhas) */}
        {!campanhaId && (
          <Card className="mb-4 border-emerald-300 bg-emerald-50/70 shadow-md hover:shadow-lg transition-all">
            <CardContent className="p-4">
              <div className="space-y-2">
                <Label>Tipo de oferta</Label>
                <RadioGroup value={offerType} onValueChange={setOfferType} className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div className="flex items-center space-x-2 border rounded-md p-3 bg-white">
                    <RadioGroupItem value="comum" id="oferta-comum" />
                    <Label htmlFor="oferta-acao" className="cursor-pointer">Oferta comum</Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-3 bg-white">
                    <RadioGroupItem value="acao" id="oferta-acao" />
                    <Label htmlFor="oferta-acao" className="cursor-pointer">Ação de graças</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF (opcional)</Label>
                <Input
                  id="cpf"
                  type="text"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={handleCPFChange}
                  className="text-base"
                  maxLength={14}
                />
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mb-6 space-y-2">
          <Label htmlFor="amount" className="block text-center text-sm text-muted-foreground">
            {campanhaId && campanhaNome 
              ? "Valor da contribuição para a campanha" 
              : "Valor da contribuição"
            }
          </Label>
          <MoneyInput
            id="amount"
            type="text"
            placeholder="R$ 0,00"
            value={amount}
            onChange={handleAmountChange}
            className={amountError ? 'border-red-500 bg-red-50' : ''}
          />
          {amountError && (
            <p className="text-sm text-red-600 mt-1 text-center flex items-center justify-center gap-1">
              <AlertCircle className="h-4 w-4" />
              Valor é obrigatório para continuar
            </p>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-center text-foreground">
            Escolha a forma de pagamento
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={handlePixPayment}
              className="w-full h-16 text-lg bg-blue-500 hover:bg-blue-600 text-white border-0 transition-colors duration-200"
              disabled={isProcessing}
            >
              <QrCode className="mr-3 h-6 w-6" />
              PIX
            </Button>
            <Button
              onClick={() => {
                const numericAmount = getNumericAmount();
                let hasError = false;
                
                if (!numericAmount) {
                  setAmountError(true);
                  hasError = true;
                }
                
                if (hasError) {
                  toast({
                    title: "Erro",
                    description: "Por favor, preencha todos os campos obrigatórios",
                    variant: "destructive",
                  });
                  return;
                }
                
                setShowCreditModal(true);
              }}
              className="w-full h-16 text-lg bg-blue-500 hover:bg-blue-600 text-white border-0 transition-colors duration-200"
              disabled={isProcessing}
            >
              <CreditCard className="mr-3 h-6 w-6" />
              Crédito
            </Button>
          </div>

          <Dialog open={showPixModal} onOpenChange={setShowPixModal}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Pagamento via PIX</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4 text-center">
                <div className="w-48 h-48 mx-auto bg-muted rounded-lg flex items-center justify-center">
                  <QrCode size={120} className="text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Escaneie o QR Code ou copie o código PIX
                  </p>
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-xs font-mono break-all">
                      {pixCode.substring(0, 50)}...
                    </p>
                  </div>
                  <Button onClick={copyPixCode} variant="outline" className="w-full">
                    Copiar código PIX
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Aguardando confirmação do pagamento...
                </p>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showCreditModal} onOpenChange={setShowCreditModal}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Dados do Cartão de Crédito</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Número do cartão</Label>
                  <Input
                    id="cardNumber"
                    placeholder="0000 0000 0000 0000"
                    value={cardData.number}
                    onChange={(e) => setCardData({...cardData, number: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardName">Nome no cartão</Label>
                  <Input
                    id="cardName"
                    placeholder={campanhaId && campanhaNome ? "Nome do benfeitor" : "Nome completo"}
                    value={campanhaId && campanhaNome ? nomeBenfeitor : cardData.name}
                    onChange={(e) => {
                      if (campanhaId && campanhaNome) {
                        setNomeBenfeitor(e.target.value);
                      } else {
                        setCardData({...cardData, name: e.target.value});
                      }
                    }}
                    disabled={!campanhaId} // Desabilita para ofertas (usa nome de teste)
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardExpiry">Validade</Label>
                    <Input
                      id="cardExpiry"
                      placeholder="MM/AA"
                      value={cardData.expiry}
                      onChange={(e) => setCardData({...cardData, expiry: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardCvv">CVV</Label>
                    <Input
                      id="cardCvv"
                      placeholder="000"
                      value={cardData.cvv}
                      onChange={(e) => setCardData({...cardData, cvv: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="installments">Número de parcelas</Label>
                  <select 
                    value={installments} 
                    onChange={(e) => setInstallments(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="1">1x de R$ {amount || "0,00"}</option>
                    <option value="2">2x de R$ {amount ? (getNumericAmount() / 2).toFixed(2).replace(".", ",") : "0,00"}</option>
                    <option value="3">3x de R$ {amount ? (getNumericAmount() / 3).toFixed(2).replace(".", ",") : "0,00"}</option>
                    <option value="4">4x de R$ {amount ? (getNumericAmount() / 4).toFixed(2).replace(".", ",") : "0,00"}</option>
                    <option value="5">5x de R$ {amount ? (getNumericAmount() / 5).toFixed(2).replace(".", ",") : "0,00"}</option>
                    <option value="6">6x de R$ {amount ? (getNumericAmount() / 6).toFixed(2).replace(".", ",") : "0,00"}</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowCreditModal(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleCreditPayment}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    Confirmar Pagamento
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            Sua oferta ajuda nossa comunidade
          </p>
        </div>
      </div>
    </div>
  );
};

export default Oferta;
