import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Share } from "lucide-react";

interface ComprovanteDizimoProps {
  dizimista: {
    name: string;
    cpf: string;
    codigo: string;
    referencia: string;
  };
  valor: string;
  metodoPagamento: string;
  data: string;
  paroquia: string;
  onClose: () => void;
}

const ComprovanteDizimo = ({
  dizimista,
  valor,
  metodoPagamento,
  data,
  paroquia,
  onClose
}: ComprovanteDizimoProps) => {
  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const compartilharWhatsApp = () => {
    const texto = `*Comprovante de Dízimo*\n\n` +
      `*Dizimista:* ${dizimista.name}\n` +
      `*CPF:* ${formatCPF(dizimista.cpf)}\n` +
      `*Código:* ${dizimista.codigo}\n` +
      `*Referência:* ${dizimista.referencia}\n` +
      `*Valor:* R$ ${valor}\n` +
      `*Forma de Pagamento:* ${metodoPagamento}\n` +
      `*Data:* ${data}\n` +
      `*Paróquia:* ${paroquia}`;

    const urlWhatsApp = `https://wa.me/?text=${encodeURIComponent(texto)}`;
    window.open(urlWhatsApp, '_blank');
  };

  const downloadComprovante = () => {
    const texto = `COMPROVANTE DE DÍZIMO\n\n` +
      `Dizimista: ${dizimista.name}\n` +
      `CPF: ${formatCPF(dizimista.cpf)}\n` +
      `Código: ${dizimista.codigo}\n` +
      `Referência: ${dizimista.referencia}\n` +
      `Valor: R$ ${valor}\n` +
      `Forma de Pagamento: ${metodoPagamento}\n` +
      `Data: ${data}\n` +
      `Paróquia: ${paroquia}`;

    const blob = new Blob([texto], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comprovante_dizimo_${dizimista.codigo}.txt`;
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
              <h2 className="text-2xl font-bold text-primary mb-2">Comprovante de Dízimo</h2>
              <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                <p className="text-base"><span className="font-semibold">Dizimista:</span> {dizimista.name}</p>
                <p className="text-sm text-muted-foreground"><span className="font-semibold">CPF:</span> {formatCPF(dizimista.cpf)}</p>
                <p className="text-sm text-muted-foreground"><span className="font-semibold">Código:</span> {dizimista.codigo}</p>
                <p className="text-sm text-muted-foreground"><span className="font-semibold">Referência:</span> {dizimista.referencia}</p>
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

export default ComprovanteDizimo;
