import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Clock, MapPin } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

const HorarioMissa = () => {
  const [searchParams] = useSearchParams();
  const scope = (searchParams.get("scope") || "diocese").toLowerCase();
  const dioceseId = searchParams.get("dioceseId") || "1";
  const fixedParishId = searchParams.get("parishId") || "";
  const navigate = useNavigate();

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

  const horariosPorParoquia = {
    "1": {
      nome: "Catedral Nossa Senhora da Glória",
      horarios: [
        "Domingo: 7h, 9h, 11h, 18h", 
        "Segunda a Sexta: 7h, 18h", 
        "Sábado: 17h, 19h"
      ]
    },
    "2": {
      nome: "Paróquia São José Operário",
      horarios: [
        "Domingo: 8h, 10h, 18h", 
        "Segunda a Sexta: 7h, 18h", 
        "Sábado: 17h"
      ]
    },
    "3": {
      nome: "Paróquia Nossa Senhora do Carmo",
      horarios: [
        "Domingo: 7h, 9h, 19h", 
        "Segunda a Sexta: 6h30, 19h30", 
        "Sábado: 16h"
      ]
    }
  };

  useEffect(() => {
    
    if (fixedParishId) {
      setParoquia(fixedParishId);
    }
  }, [fixedParishId]);

  const paroquiaSelecionada = paroquia ? horariosPorParoquia[paroquia] : {
    nome: "Catedral Nossa Senhora da Glória",
    horarios: [
      "Domingo: 7h, 9h, 11h, 18h", 
      "Segunda a Sexta: 7h, 18h", 
      "Sábado: 17h, 19h"
    ]
  };

  return (
        <div className="min-h-screen bg-gray-100 relative">
      {/* Background abstrato com cores */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-blue-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-blue-100 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-blue-200 rounded-full blur-3xl"></div>
      </div>
      
      {/* Header com tarja e título */}
      <div className="w-full bg-gradient-to-r from-blue-100 to-blue-200 p-4">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-xl font-semibold text-blue-700 flex items-center justify-center gap-3">
            <div className="p-1.5 bg-blue-200 rounded-full">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            Horários de Missa
          </h1>
        </div>
      </div>
      
      {/* Título da Diocese fora do header */}
      <div className="max-w-md mx-auto p-2 text-center">
        <div className="space-y-0">
          <h2 className="text-2xl font-bold text-gray-900">{nomeDiocese || "Diocese"}</h2>
          {paroquiaSelecionada && (
            <h3 className="text-base text-gray-700">{paroquiaSelecionada.nome}</h3>
          )}
        </div>
      </div>
      
      {/* Separador visual */}
      <div className="max-w-md mx-auto text-center mb-2">
        <div className="w-16 h-0.5 bg-gradient-to-r from-blue-300 to-blue-500 mx-auto rounded-full"></div>
      </div>
      
      <div className="max-w-md mx-auto p-4">
        <div className="text-center mb-1 space-y-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => scope === "diocese" ? navigate('/') : navigate(-1)}
            className="absolute top-3 left-4 w-10 h-10 p-0 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-2 border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 rounded-full flex items-center justify-center backdrop-blur-sm"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          

        </div>

        {/* Card com horários da paróquia selecionada */}
        <Card className="border-blue-200 bg-blue-50/70 shadow-md hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              {paroquiaSelecionada.nome}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5">
              {paroquiaSelecionada.horarios.map((horario, horarioIndex) => (
                <div key={horarioIndex} className="p-2 bg-blue-100/50 rounded-md">
                  <p className="text-xs text-blue-700">{horario}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            Os horários podem sofrer alterações. Consulte a catedral ou sua paróquia.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HorarioMissa;
