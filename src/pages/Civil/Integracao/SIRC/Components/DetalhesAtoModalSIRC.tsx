// Salve como um novo arquivo, ex: src/components/integracoes/DetalhesAtoModal.tsx
import { X, Edit, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { type FilaItemSIRC } from './FilaDeEnvioSIRC'; // Importando as tipagens

// Objeto de configuração para o modal
const statusConfigModal = {
    'Pronto': { title: 'Ato Pronto para Envio', icon: CheckCircle, headerClass: 'bg-green-50 border-green-200', iconClass: 'text-green-600' },
    'Pendente de Dados': { title: 'Dados Pendentes', icon: AlertCircle, headerClass: 'bg-yellow-50 border-yellow-200', iconClass: 'text-yellow-600' },
    'Erro de Envio': { title: 'Erro de Envio', icon: AlertCircle, headerClass: 'bg-red-50 border-red-200', iconClass: 'text-red-600' },
    'Enviando': { title: 'Ato em Processo de Envio', icon: Clock, headerClass: 'bg-blue-50 border-blue-200', iconClass: 'text-blue-600' }
};

interface DetalhesAtoModalProps {
    item: FilaItemSIRC | null;
    onClose: () => void;
    onCorrigir: (id: string) => void;
}

export default function DetalhesAtoModal({ item, onClose, onCorrigir }: DetalhesAtoModalProps) {
    if (!item) return null;

    const config = statusConfigModal[item.status];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
                <header className="flex justify-between items-center p-5 border-b border-gray-200">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">Detalhes do Ato</h2>
                        <p className="text-sm text-gray-500">{item.nomesReferencia}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X size={24} /></button>
                </header>

                <div className="p-6">
                    <div className={`p-4 rounded-lg border ${config.headerClass}`}>
                        <div className="flex items-start gap-3">
                            <config.icon size={24} className={`${config.iconClass} flex-shrink-0 mt-1`} />
                            <div>
                                <h3 className="font-bold text-gray-800">{config.title}</h3>
                                { (item.status === 'Erro de Envio' || item.status === 'Pendente de Dados') &&
                                    <p className="text-sm text-gray-600 mt-1 font-mono">{item.mensagemErro}</p>
                                }
                                { item.status === 'Pronto' && <p className="text-sm text-gray-600 mt-1">Este ato passou em todas as validações e está pronto para ser incluído em um lote de envio.</p> }
                            </div>
                        </div>
                    </div>
                </div>
                
                <footer className="p-4 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border rounded-lg hover:bg-gray-100">
                        Fechar
                    </button>
                    {(item.status === 'Erro de Envio' || item.status === 'Pendente de Dados') && (
                        <button 
                            onClick={() => onCorrigir(item.id)}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm"
                        >
                            <Edit size={16} />
                            Corrigir Ato
                        </button>
                    )}
                </footer>
            </div>
        </div>
    );
}