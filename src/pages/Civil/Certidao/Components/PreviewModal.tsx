import { X, Printer } from 'lucide-react';
import {toast} from 'react-toastify';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: any; // O conteúdo da certidão em HTML
  isVerso: boolean; // Indica se é a versão do verso da certidão
}

export default function PreviewModal({ isOpen, onClose, content, isVerso }: PreviewModalProps) {
  if (!isOpen) {
    return null;
  }

  // Função para imprimir o conteúdo do modal
  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=800,height=600');
            if (!printWindow) {
                toast.error("Não foi possível abrir a janela de impressão.");
                return;
            }
    if (printWindow) {
      printWindow.document.write('<html><head><title>Imprimir Certidão</title>');
      // Opcional: Adicionar estilos CSS para a impressão
      printWindow.document.write('<style> body { width: 794px; height: 1123px; } </style>');
      printWindow.document.write('</head><body>');
      printWindow.document.write(content);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4 animate-fade-in-fast"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg">
          <h2 className="text-lg font-semibold text-gray-700">Visualização da Certidão ({isVerso ? 'Verso' : 'Frente'})</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-3 py-1.5 rounded-md shadow-sm hover:bg-blue-700 text-sm"
            >
              <Printer size={16} />
              Imprimir ({isVerso ? 'Verso' : 'Frente'})
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 rounded-full hover:bg-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>
        <main className="p-8 overflow-y-auto bg-gray-100">
          {/* Simulação da folha A4 */}
          {!isVerso ? (
            <div
              className="a4-sheet"
              style={{ width: '794px', height: '1123px' }}
            >
              {/* Renderiza o conteúdo HTML da certidão */}
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>

          ) : (
            <div
              className='a4-sheet-verso'
              style={{ width: '794px', height: '1123px' }}
            >
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}