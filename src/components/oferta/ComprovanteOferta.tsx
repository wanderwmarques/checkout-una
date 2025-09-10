import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Share } from "lucide-react";

interface ComprovanteOfertaProps {
  valor: string;
  metodoPagamento: string;
  data: string;
  paroquia: string;
  tipoOferta: string;
  cpf?: string;
  nomeBenfeitor?: string;
  campanhaNome?: string;
  onClose: () => void;
}

const ComprovanteOferta = ({
  valor,
  metodoPagamento,
  data,
  paroquia,
  tipoOferta,
  cpf,
  nomeBenfeitor,
  campanhaNome,
  onClose
}: ComprovanteOfertaProps) => {
  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const compartilharWhatsApp = () => {
    let texto = `*Comprovante de ${campanhaNome ? 'Contribuição para Campanha' : 'Oferta'}*\n\n`;
    
    if (campanhaNome) {
      texto += `*Campanha:* ${campanhaNome}\n`;
    }
    
    if (nomeBenfeitor) {
      texto += `*Benfeitor:* ${nomeBenfeitor}\n`;
    }
    
    texto += `*Tipo:* ${tipoOferta}\n` +
      `*Valor:* R$ ${valor}\n` +
      `*Forma de Pagamento:* ${metodoPagamento}\n` +
      `*Data:* ${data}\n` +
      `*Paróquia:* ${paroquia}` +
      (cpf ? `\n*CPF:* ${formatCPF(cpf)}` : "");

    const urlWhatsApp = `https://wa.me/?text=${encodeURIComponent(texto)}`;
    window.open(urlWhatsApp, '_blank');
  };

  const downloadComprovante = () => {
    let texto = `COMPROVANTE DE ${campanhaNome ? 'CONTRIBUIÇÃO PARA CAMPANHA' : 'OFERTA'}\n\n`;
    
    if (campanhaNome) {
      texto += `Campanha: ${campanhaNome}\n`;
    }
    
    if (nomeBenfeitor) {
      texto += `Benfeitor: ${nomeBenfeitor}\n`;
    }
    
    texto += `Tipo: ${tipoOferta}\n` +
      `Valor: R$ ${valor}\n` +
      `Forma de Pagamento: ${metodoPagamento}\n` +
      `Data: ${data}\n` +
      `Paróquia: ${paroquia}` +
      (cpf ? `\nCPF: ${formatCPF(cpf)}` : "");

    const blob = new Blob([texto], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comprovante_${campanhaNome ? 'campanha' : 'oferta'}_${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        <Card>
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-primary mb-2">
                Comprovante de {campanhaNome ? 'Contribuição para Campanha' : 'Oferta'}
              </h2>
              <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
            </div>

            <div className="space-y-4">
              {campanhaNome && (
                <div className="bg-emerald-50 p-4 rounded-lg space-y-2">
                  <p className="text-base"><span className="font-semibold">Campanha:</span> {campanhaNome}</p>
                  {nomeBenfeitor && (
                    <p className="text-sm text-emerald-700">
                      <span className="font-semibold">Benfeitor:</span> {nomeBenfeitor}
                    </p>
                  )}
                </div>
              )}
              
              <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                <p className="text-base"><span className="font-semibold">Tipo:</span> {tipoOferta}</p>
                {cpf && (
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold">CPF:</span> {formatCPF(cpf)}
                  </p>
                )}
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-lg font-semibold text-green-800">Valor: R$ {valor}</p>
                <p className="text-sm text-green-700">Forma de Pagamento: {metodoPagamento}</p>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>Data: {data}</p>
                <p>Paróquia: {paroquia}</p>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={downloadComprovante}
                  className="flex-1"
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button
                  onClick={compartilharWhatsApp}
                  className="flex-1"
                  variant="outline"
                >
                  <Share className="h-4 w-4 mr-2" />
                  Compartilhar
                </Button>
              </div>

              <Button
                onClick={onClose}
                className="w-full"
              >
                Concluir
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComprovanteOferta;
