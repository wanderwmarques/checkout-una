import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoneyInput } from "@/components/ui/money-input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Smartphone, QrCode, ArrowLeft, Heart, HeartHandshake, AlertCircle } from "lucide-react";
import { ComprovanteDizimo } from "@/components";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

type Dizimista = {
  id: string;
  cpf: string;
  name: string;
  email: string;
  referencia: string;
  paroquiaId: string;
  codigo: string;
};

const DIOCESES = [
  { id: "1", name: "Diocese de Maringá" }
];

const PAROQUIAS_POR_DIOCESE: Record<string, { id: string; name: string }[]> = {
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

const Dizimo = () => {
  const [searchParams] = useSearchParams();
  const scope = (searchParams.get("scope") || "diocese").toLowerCase(); // "diocese" | "paroquia"
  const dioceseId = searchParams.get("dioceseId") || "1";
  const fixedParishId = searchParams.get("parishId") || "";
  const checkoutId = searchParams.get("checkoutId") || ""; // Novo parâmetro obrigatório
  const isEmbedded = searchParams.get("embed") === "true"; // Detectar se está embedado

  const [paroquia, setParoquia] = useState("");
  const [cpf, setCpf] = useState("");
  const [dizimista, setDizimista] = useState<Dizimista | null>(null);
  const [amount, setAmount] = useState("");
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
  
  const [cpfError, setCpfError] = useState(false);
  const [amountError, setAmountError] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const isPreloaded = Boolean(id);


  const paroquias = useMemo(() => PAROQUIAS_POR_DIOCESE[dioceseId] || [], [dioceseId]);
  const nomeDiocese = useMemo(() => DIOCESES.find(d => d.id === dioceseId)?.name || "", [dioceseId]);

  const mockDizimistas: Dizimista[] = [
    { id: "10", cpf: "00000000000", name: "DIZIMISTA IMERSÃO", email: "teste@teste.com", referencia: "08/2025", paroquiaId: "1", codigo: "101" },
    { id: "11", cpf: "11111111111", name: "Wander Marques", email: "wander@theos.com.br", referencia: "08/2025", paroquiaId: "1", codigo: "102" },
    { id: "12", cpf: "22222222222", name: "Klayton Dias", email: "klayton@theos.com.br", referencia: "08/2025", paroquiaId: "2", codigo: "103" },
    { id: "13", cpf: "33333333333", name: "Paulo Costa", email: "paulo@theos.com.br", referencia: "08/2025", paroquiaId: "3", codigo: "104" },
    { id: "14", cpf: "44444444444", name: "Marcelo Barros", email: "marcelo@theos.com.br", referencia: "08/2025", paroquiaId: "1", codigo: "105" },
    { id: "15", cpf: "55555555555", name: "Everton Reis", email: "everton@theos.com.br", referencia: "08/2025", paroquiaId: "1", codigo: "106" }
  ];
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

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value) {
      setAmount(formatCurrency(value));
      setAmountError(false); // Limpa erro quando valor é preenchido
    } else {
      setAmount("");
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
        description: "Por favor, insira o valor do dízimo",
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
    
    if (!dizimista) {
      setCpfError(true);
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
    
    if (!cardData.number || !cardData.name || !cardData.expiry || !cardData.cvv) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os dados do cartão",
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
    
    if (!dizimista) {
      setCpfError(true);
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

  const getNomeParoquia = (paroquiaId: string) => {
    return paroquias.find(p => p.id === paroquiaId)?.name || "";
  };
  const dataAtualFormatada = new Date().toLocaleDateString("pt-BR");

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

  const consultarDizimista = () => {
    const cpfNumbers = cpf.replace(/\D/g, "");
    const found = mockDizimistas.find(d => d.cpf === cpfNumbers);
    
    if (found) {
      setDizimista(found);
      if (scope !== "paroquia") {
        toast({
          title: "Dizimista encontrado!",
          description: `Bem-vindo, ${found.name}`,
          variant: "success",
        });
      }
    } else {
      setDizimista(null);
      if (scope !== "paroquia") {
        toast({
          title: "Dizimista não encontrado",
          description: "CPF não cadastrado no sistema",
          variant: "destructive",
        });
      }
    }
  };

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

    if (id) {
      const foundById = mockDizimistas.find((d) => d.id === id);
      if (foundById) {
        setDizimista(foundById);
        setParoquia(foundById.paroquiaId);
      }
    } else {
      const cpfFromUrl = searchParams.get("cpf");
      const amountFromUrl = searchParams.get("amount");
      
      if (cpfFromUrl) {
        const cpfNumbers = cpfFromUrl.replace(/\D/g, "");
        setCpf(formatCPF(cpfNumbers));
        
        const found = mockDizimistas.find(d => d.cpf === cpfNumbers);
        if (found) {
          setDizimista(found);
          setParoquia(found.paroquiaId);
          if (scope !== "paroquia") {
            toast({
              title: "Dizimista encontrado!",
              description: `Bem-vindo, ${found.name}`,
              variant: "success",
            });
          }
        }
      }
      
      if (amountFromUrl) {
        setAmount(amountFromUrl);
      }
    }
  }, [id, searchParams.get("cpf"), searchParams.get("amount"), checkoutId, scope]);

  useEffect(() => {
    
    if (fixedParishId) {
      setParoquia(fixedParishId);
    }
  }, [fixedParishId, isEmbedded]);

  useEffect(() => {
    return () => {
      setIsProcessing(false);
      setProcessStep('processing');
    };
  }, []);
  return (
    <div className={`${isEmbedded ? 'min-h-screen' : 'min-h-screen'} bg-gray-100 relative`}>
      {/* Background abstrato com cores - apenas quando não embedado */}
      {!isEmbedded && (
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-red-200 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-red-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-red-100 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-red-200 rounded-full blur-3xl"></div>
        </div>
      )}
      
      {/* Header com tarja e título - ajustar quando embedado */}
      <div className={`w-full bg-gradient-to-r from-red-100 to-red-200 ${isEmbedded ? 'p-3' : 'p-4'}`}>
        <div className={`${isEmbedded ? 'max-w-2xl' : 'max-w-md'} mx-auto text-center`}>
          <h1 className={`font-semibold text-red-700 flex items-center justify-center gap-3 ${isEmbedded ? 'text-lg' : 'text-xl'}`}>
            <div className="p-1.5 bg-red-200 rounded-full">
              <HeartHandshake className={`text-red-600 ${isEmbedded ? 'h-4 w-4' : 'h-5 w-5'}`} />
            </div>
            Dízimo
          </h1>
        </div>
      </div>
      
      {/* Título da Diocese fora do header - ajustar quando embedado */}
      <div className={`${isEmbedded ? 'max-w-2xl' : 'max-w-md'} mx-auto text-center ${isEmbedded ? 'p-2' : 'p-2'}`}>
        <div className="space-y-0">
          <h2 className={`font-bold text-gray-900 ${isEmbedded ? 'text-xl' : 'text-2xl'}`}>{nomeDiocese || "Diocese"}</h2>
          {paroquia && (
            <h3 className={`text-gray-700 ${isEmbedded ? 'text-sm' : 'text-base'}`}>{getNomeParoquia(paroquia)}</h3>
          )}
        </div>
      </div>
      
      {/* Separador visual */}
      <div className={`${isEmbedded ? 'max-w-2xl' : 'max-w-md'} mx-auto text-center mb-2`}>
        <div className="w-16 h-0.5 bg-gradient-to-r from-red-300 to-red-500 mx-auto rounded-full"></div>
      </div>
      
      {/* Padrão abstrato de fundo - apenas quando não embedado */}
      {!isEmbedded && (
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-red-200 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-red-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-red-100 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-red-200 rounded-full blur-3xl"></div>
        </div>
      )}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            {processStep === 'processing' ? (
              <>
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-lg font-medium text-gray-900">Processando pagamento...</p>
                <p className="text-sm text-gray-500">Aguarde enquanto confirmamos sua transação</p>
              </>
            ) : processStep === 'success' ? (
              <>
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">✓</div>
                <p className="text-lg font-medium text-gray-900">Pagamento confirmado!</p>
                <p className="text-sm text-gray-500">Sua contribuição foi processada com sucesso</p>
              </>
            ) : processStep === 'comprovante' ? (
              <ComprovanteDizimo
                dizimista={{
                  name: dizimista!.name,
                  cpf: dizimista!.cpf,
                  codigo: dizimista!.codigo,
                  referencia: dizimista!.referencia
                }}
                valor={amount}
                metodoPagamento={metodoPagamentoAtual}
                data={dataAtualFormatada}
                paroquia={getNomeParoquia(paroquia)}
                onClose={() => {
                  setIsProcessing(false);
                  setProcessStep('processing');
                  setCardData({ number: "", name: "", expiry: "", cvv: "" });
                  setInstallments("1");
                  setAmount("");
                  setShowCreditModal(false);
                  setShowPixModal(false);
                  setMetodoPagamentoAtual("");
                  
                  if (scope === "paroquia") {
                    navigate('/agradecimento?scope=paroquia');
                  } else {
                    navigate('/agradecimento?scope=diocese');
                  }
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
              className="absolute top-3 left-4 w-10 h-10 p-0 bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 border-2 border-red-200 hover:border-red-300 text-red-700 hover:text-red-800 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 rounded-full flex items-center justify-center backdrop-blur-sm"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          


          {searchParams.get("newUser") === "true" && (
            <div className="mt-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-center text-green-800">
                  <span className="block text-lg font-semibold mb-1">Seja bem-vindo(a)!</span>
                  <span className="text-base">Agora você pode realizar sua contribuição</span>
                </p>
              </div>
            </div>
          )}
        </div>

        <p className="text-sm text-muted-foreground mb-2 text-center">Contribua com seu dízimo</p>

        {!isPreloaded && !searchParams.get("cpf") && (
          <Card className="mb-4 bg-white border-gray-200 shadow-md hover:shadow-lg transition-all">
            <CardContent className="space-y-4 p-4">
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF do Dizimista</Label>
                <div className="flex gap-2">
                  <Input
                    id="cpf"
                    type="text"
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={handleCPFChange}
                    className={`flex-1 transition-all duration-200 !bg-white ${
                      cpfError 
                        ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:border-red-400 focus:ring-red-400'
                    }`}
                  />
                  <Button 
                    onClick={consultarDizimista} 
                    disabled={cpf.length < 14}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Consultar
                  </Button>
                </div>
                {cpfError && (
                  <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    CPF é obrigatório para continuar
                  </p>
                )}
                {scope === "paroquia" && !searchParams.get("cpf") && (
                  <div className="flex justify-center mt-4">
                    <Button
                      variant="link"
                      className="text-sm text-muted-foreground hover:text-primary"
                      onClick={() => navigate(`/cadastro-dizimista?scope=paroquia&parishId=${paroquia}`)}
                    >
                      Não é dizimista? Cadastre-se aqui
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {dizimista && (
          <Card className="mb-4 bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-300 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-red-400 to-red-600"></div>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-shrink-0 w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                  <HeartHandshake className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-800">{dizimista.name}</p>
                  <p className="text-xs text-slate-600">Dizimista Confirmado</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="bg-slate-300 px-2 py-1 rounded text-xs font-bold text-slate-700 shadow-sm">Código</span>
                  <span className="text-slate-800 font-semibold text-sm">{dizimista.codigo}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-slate-300 px-2 py-1 rounded text-xs font-bold text-slate-700 shadow-sm">CPF</span>
                  <span className="text-slate-800 font-semibold text-sm">{formatCPF(dizimista.cpf)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-slate-300 px-2 py-1 rounded text-xs font-bold text-slate-700 shadow-sm">Referência</span>
                  <span className="text-slate-800 font-semibold text-sm">{dizimista.referencia}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-slate-300 px-2 py-1 rounded text-xs font-bold text-slate-700 shadow-sm">Data</span>
                  <span className="text-slate-800 font-semibold text-sm">{dataAtualFormatada}</span>
                </div>
                {paroquia && (
                  <div className="col-span-2 flex items-center gap-2 pt-2 border-t border-slate-300">
                    <span className="bg-slate-300 px-2 py-1 rounded text-xs font-bold text-slate-700 shadow-sm">Paróquia</span>
                    <span className="text-slate-800 font-semibold text-sm">{getNomeParoquia(paroquia)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        

                <div className="mb-6 space-y-2">
          <Label htmlFor="amount" className="block text-center text-sm text-muted-foreground">Valor da contribuição</Label>
          <MoneyInput
            id="amount"
            type="text"
            placeholder="R$ 0,00"
            value={amount}
            onChange={handleAmountChange}
            className={amountError ? 'border-red-500 bg-red-50' : 'bg-white'}
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
                  
                  if (!dizimista) {
                    setCpfError(true);
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
          </div>

        {/* Diálogos de pagamento */}

        {/* Modal do PIX */}
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
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={copyPixCode}
                  className="flex-1"
                >
                  Copiar Código
                </Button>
                <Button 
                  onClick={() => setShowPixModal(false)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Fechar
                </Button>
              </div>
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
                    placeholder="Nome completo"
                    value={cardData.name}
                    onChange={(e) => setCardData({...cardData, name: e.target.value})}
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
                  <Select value={installments} onValueChange={setInstallments}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione as parcelas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1x de R$ {amount || "0,00"}</SelectItem>
                      <SelectItem value="2">2x de R$ {amount ? (getNumericAmount() / 2).toFixed(2).replace(".", ",") : "0,00"}</SelectItem>
                      <SelectItem value="3">3x de R$ {amount ? (getNumericAmount() / 3).toFixed(2).replace(".", ",") : "0,00"}</SelectItem>
                      <SelectItem value="4">4x de R$ {amount ? (getNumericAmount() / 4).toFixed(2).replace(".", ",") : "0,00"}</SelectItem>
                      <SelectItem value="5">5x de R$ {amount ? (getNumericAmount() / 5).toFixed(2).replace(".", ",") : "0,00"}</SelectItem>
                      <SelectItem value="6">6x de R$ {amount ? (getNumericAmount() / 6).toFixed(2).replace(".", ",") : "0,00"}</SelectItem>
                    </SelectContent>
                  </Select>
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

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            Sua contribuição ajuda nossa comunidade
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dizimo;
