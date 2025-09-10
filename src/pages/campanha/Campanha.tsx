import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Heart, Construction, Calendar, User, Tag, Target, TrendingUp, FileText } from "lucide-react";

const Campanha = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Botão Voltar */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 z-50 bg-white/90 backdrop-blur-sm border border-gray-200 hover:bg-white hover:border-gray-300 text-gray-700 hover:text-gray-900 shadow-sm transition-all duration-200"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar
      </Button>

      {/* Banner Superior - 100% largura */}
      <div className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 h-48 relative overflow-hidden">
        {/* Elementos decorativos do banner */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute top-20 right-20 w-24 h-24 bg-white rounded-full"></div>
          <div className="absolute bottom-10 left-1/3 w-40 h-40 bg-white rounded-full"></div>
        </div>
        
        {/* Conteúdo do banner */}
        <div className="relative z-0 flex items-center justify-center h-full text-center text-white">
          <div className="space-y-3">
            <div className="w-16 h-16 bg-white/20 rounded-full mx-auto flex items-center justify-center backdrop-blur-sm">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold">Campanha #{id}</h1>
            <p className="text-emerald-100 text-lg">Detalhes da Campanha</p>
          </div>
        </div>
      </div>

             {/* Conteúdo Principal */}
       <div className="max-w-6xl mx-auto px-4 -mt-8 relative z-20">
                 {/* Grid de 2 colunas */}
         <div className="grid lg:grid-cols-2 gap-6 mb-8 mt-12">
          
          {/* Bloco Esquerdo - Dados da Campanha */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="bg-emerald-50 border-b border-emerald-100">
              <CardTitle className="flex items-center gap-2 text-emerald-800">
                <FileText className="h-5 w-5" />
                Informações da Campanha
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {/* Skeleton dos dados */}
              <div className="space-y-6">
                {/* Título */}
                <div className="space-y-2">
                  <div className="w-3/4 h-6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-1/2 h-4 bg-gray-100 rounded animate-pulse"></div>
                </div>

                {/* Descrição */}
                <div className="space-y-2">
                  <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-5/6 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-4/6 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>

                {/* Metadados */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="w-20 h-3 bg-gray-100 rounded animate-pulse"></div>
                    <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="w-24 h-3 bg-gray-100 rounded animate-pulse"></div>
                    <div className="w-28 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>

                {/* Progresso */}
                <div className="space-y-3">
                  <div className="w-24 h-3 bg-gray-100 rounded animate-pulse"></div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="w-3/4 h-full bg-emerald-500 rounded-full animate-pulse"></div>
                  </div>
                  <div className="w-32 h-3 bg-gray-100 rounded animate-pulse"></div>
                </div>

                {/* Categoria e Responsável */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="w-20 h-3 bg-gray-100 rounded animate-pulse"></div>
                    <div className="w-28 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="w-24 h-3 bg-gray-100 rounded animate-pulse"></div>
                    <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bloco Direito - Botão de Contribuição */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="bg-blue-50 border-b border-blue-100">
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Heart className="h-5 w-5" />
                Contribuir para a Campanha
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Ícone centralizado */}
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
                    <Heart className="h-10 w-10 text-blue-600" />
                  </div>
                </div>

                {/* Texto explicativo */}
                <div className="text-center space-y-3">
                  <h3 className="text-xl font-semibold text-gray-800">Faça sua Contribuição</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Sua doação é fundamental para o sucesso desta campanha. 
                    Cada contribuição, independentemente do valor, faz a diferença.
                  </p>
                </div>

                {/* Botão de Contribuição */}
                <div className="text-center">
                  <Button 
                    size="lg"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    onClick={() => navigate(`/oferta?scope=paroquia&parishId=1&campanhaId=${id}&campanhaNome=Campanha%20${id}`)}
                  >
                    <Heart className="h-5 w-5 mr-2" />
                    Contribuir Agora
                  </Button>
                </div>

                {/* Informações adicionais */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-center space-y-2">
                    <p className="text-blue-800 font-medium text-sm">
                      💳 Pagamento Seguro
                    </p>
                    <p className="text-blue-700 text-xs">
                      Aceitamos PIX e Cartão de Crédito
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        
      </div>
    </div>
  );
};

export default Campanha;
