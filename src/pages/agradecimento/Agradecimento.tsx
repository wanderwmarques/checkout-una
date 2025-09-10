import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Heart, Home } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

const Agradecimento = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const scope = searchParams.get("scope") || "diocese";
  
  const isFromLink = scope === "paroquia";
  
  return (
    <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
      <div className="max-w-md w-full">
        <Card>
          <CardContent className="p-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">Obrigado pela sua contribuição!</h1>
              <p className="text-gray-600">
                Sua doação é muito importante para nossa comunidade.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm text-slate-600">
                {isFromLink 
                  ? "Você pode retornar ao chat do WhatsApp para continuar sua conversa com o assistente da paróquia."
                  : "Sua contribuição foi processada com sucesso. Obrigado por apoiar nossa comunidade!"
                }
              </p>
            </div>

            <Button
                onClick={() => isFromLink ? window.close() : navigate('/')}
                className="w-full gap-2"
              >
                {isFromLink ? (
                  <>
                    <MessageCircle className="w-4 h-4" />
                    Voltar ao WhatsApp
                  </>
                ) : (
                  <>
                    <Home className="w-4 h-4" />
                    Voltar à Página Inicial
                  </>
                )}
              </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Agradecimento;
