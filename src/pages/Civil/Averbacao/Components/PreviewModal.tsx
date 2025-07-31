import { X, Printer } from 'lucide-react';
import { toast } from 'react-toastify';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: any;
  previewType: 'a4' | 'etiqueta'; // Nova propriedade para definir o tipo de visualização
  title: string;                   // Nova propriedade para o título dinâmico
  isVerso?: boolean;                // Agora é opcional
}

export default function PreviewModal({ isOpen, onClose, content, previewType, title, isVerso = false }: PreviewModalProps) {
  if (!isOpen) {
    return null;
  }

  const isA4 = previewType === 'a4';
  
  // Define as dimensões e margens com base no tipo de preview
  const previewWidth = '180mm';
  const previewHeight = '100mm';
  const printMargin = '10mm';

  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) {
      toast.error("Não foi possível abrir a janela de impressão.");
      return;
    }
    
    printWindow.document.write(`
        <html><head><title>${title}</title>
        <style>
            @media print {
                @page { 
                    size: ${previewWidth} ${previewHeight};
                    margin: 0px
                }
                body { margin: 0; }
            }
            body { font-family: Arial, sans-serif; }
        </style>
        </head><body>${content}</body></html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-center p-4 animate-fade-in-fast bg-gray-900/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg">
          <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-3 py-1.5 rounded-md shadow-sm hover:bg-blue-700 text-sm"
            >
              <Printer size={16} />
              Imprimir
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 rounded-full hover:bg-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>
        <main className="p-8 overflow-y-auto bg-gray-100 flex justify-center">
          <div
            className="bg-white shadow-lg"
            style={{
              width: previewWidth,
              height: previewHeight,
              // --- ESTA É A CORREÇÃO ---
              // Adicionamos a 'âncora' de posicionamento que estava faltando.
              position: 'relative', 
              padding: '10px'
            }}
          >
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        </main>
      </div>
    </div>
  );
}