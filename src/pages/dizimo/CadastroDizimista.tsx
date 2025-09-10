import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, UserPlus } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

const COMUNIDADES = [
  { id: "1", name: "Comunidade São Francisco" },
  { id: "2", name: "Comunidade Nossa Senhora Aparecida" },
  { id: "3", name: "Comunidade São José" },
  { id: "4", name: "Comunidade Santa Rita" },
  { id: "5", name: "Comunidade Santo Antônio" }
];

const CadastroDizimista = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const scope = (searchParams.get("scope") || "diocese").toLowerCase();
  const dioceseId = searchParams.get("dioceseId") || "1";
  const fixedParishId = searchParams.get("parishId") || "";
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState<'processing' | 'success'>('processing');
  
  const [paroquia, setParoquia] = useState("");

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

  const paroquias = useMemo(() => PAROQUIAS_POR_DIOCESE[dioceseId] || [], [dioceseId]);
  const nomeDiocese = useMemo(() => DIOCESES.find(d => d.id === dioceseId)?.name || "", [dioceseId]);

  const getNomeParoquia = (paroquiaId: string) => {
    return paroquias.find(p => p.id === paroquiaId)?.name || "";
  };

  useEffect(() => {
    
    if (fixedParishId) {
      setParoquia(fixedParishId);
    }
  }, [fixedParishId]);
  
  const [formData, setFormData] = useState({
    nome: "NOVO DIZIMISTA",
    cpf: "000.000.000-00",
    dataNascimento: "1990-01-01",
    sexo: "M",
    email: "teste@teste.com",
    tipoContato: "celular",
    telefone: "(11) 99999-9999",
    comunidadeId: "1"
  });

  const formatCPF = (value: string) => {
    const cleanValue = value.replace(/\D/g, "");
    return cleanValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const formatPhone = (value: string) => {
    const cleanValue = value.replace(/\D/g, "");
    if (cleanValue.length === 11) {
      return cleanValue.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
    return cleanValue.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  };

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value;

    if (field === "cpf") {
      const cleanValue = value.replace(/\D/g, "");
      if (cleanValue.length <= 11) {
        formattedValue = formatCPF(cleanValue);
      } else {
        return;
      }
    }

    if (field === "telefone") {
      const cleanValue = value.replace(/\D/g, "");
      if (cleanValue.length <= 11) {
        formattedValue = formatPhone(cleanValue);
      } else {
        return;
      }
    }

    setFormData(prev => ({
      ...prev,
      [field]: formattedValue
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.cpf || !formData.dataNascimento || 
        !formData.sexo || !formData.email || !formData.tipoContato || 
        !formData.telefone || !formData.comunidadeId) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    setProcessStep('processing');
    setIsProcessing(true);

    setTimeout(() => {
      setProcessStep('success');
      
      setTimeout(() => {
        setIsProcessing(false);
        navigate(`/dizimo/dizimista/10?scope=paroquia&parishId=${paroquia}`);
      }, 2000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* Background abstrato com cores */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-slate-200 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-slate-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-slate-100 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-slate-200 rounded-full blur-3xl"></div>
      </div>
      
      {/* Header com tarja e título */}
      <div className="w-full bg-gradient-to-r from-slate-200 to-slate-300 p-4">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-xl font-semibold text-slate-800 flex items-center justify-center gap-3">
            <div className="p-1.5 bg-slate-300 rounded-full">
              <UserPlus className="h-5 w-5 text-slate-700" />
            </div>
            Novo Dizimista
          </h1>
        </div>
      </div>
      
      {/* Título da Diocese fora do header */}
      <div className="max-w-md mx-auto p-2 text-center">
        <div className="space-y-0">
          <h2 className="text-2xl font-bold text-gray-900">{nomeDiocese || "Diocese"}</h2>
          {paroquia && (
            <h3 className="text-base text-gray-700">{getNomeParoquia(paroquia)}</h3>
          )}
        </div>
      </div>
      
      {/* Separador visual */}
      <div className="max-w-md mx-auto text-center mb-2">
        <div className="w-16 h-0.5 bg-gradient-to-r from-slate-300 to-slate-500 mx-auto rounded-full"></div>
      </div>
      
      <div className="max-w-md mx-auto p-4">
        <div className="text-center mb-1 space-y-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => scope === "diocese" ? navigate('/') : navigate(-1)}
            className="absolute top-3 left-4 w-10 h-10 p-0 bg-gradient-to-br from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 border-2 border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-800 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 rounded-full flex items-center justify-center backdrop-blur-sm"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          

        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="bg-slate-50/70 border-slate-200">
            <CardContent className="space-y-4 p-6">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome completo</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => handleInputChange("nome", e.target.value)}
                  placeholder="Digite seu nome completo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) => handleInputChange("cpf", e.target.value)}
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                <Input
                  id="dataNascimento"
                  type="date"
                  value={formData.dataNascimento}
                  onChange={(e) => handleInputChange("dataNascimento", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Sexo</Label>
                <RadioGroup
                  value={formData.sexo}
                  onValueChange={(value) => handleInputChange("sexo", value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="M" id="sexo-m" />
                    <Label htmlFor="sexo-m">Masculino</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="F" id="sexo-f" />
                    <Label htmlFor="sexo-f">Feminino</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="seu@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label>Tipo de Contato</Label>
                <RadioGroup
                  value={formData.tipoContato}
                  onValueChange={(value) => handleInputChange("tipoContato", value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="celular" id="tipo-celular" />
                    <Label htmlFor="tipo-celular">Celular</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="residencial" id="tipo-residencial" />
                    <Label htmlFor="tipo-residencial">Residencial</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => handleInputChange("telefone", e.target.value)}
                  placeholder={formData.tipoContato === "celular" ? "(00) 00000-0000" : "(00) 0000-0000"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="comunidade">Comunidade</Label>
                <Select
                  value={formData.comunidadeId}
                  onValueChange={(value) => handleInputChange("comunidadeId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione sua comunidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMUNIDADES.map((comunidade) => (
                      <SelectItem key={comunidade.id} value={comunidade.id}>
                        {comunidade.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
            Cadastrar
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            Seus dados serão utilizados apenas para fins de identificação
          </p>
        </div>
      </div>
    </div>
  );
};

export default CadastroDizimista;
