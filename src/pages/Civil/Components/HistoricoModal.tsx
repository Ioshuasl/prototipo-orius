import React from 'react';
import { Award, BookKey, FileText, Save, XCircle } from 'lucide-react';

// Interface para os dados de um item do histórico
interface IHistoricoItem {
    data: string;
    evento: string;
    usuario: string;
}

// Interface para as props do componente
interface HistoricoModalProps {
    isOpen: boolean;
    onClose: () => void;
    historico: IHistoricoItem[];
}

// Função para determinar o ícone com base no evento
const getEventIcon = (evento: string) => {
    const eventoLower = evento.toLowerCase();
    if (eventoLower.includes('lavrado')) return <Award className="h-5 w-5 text-white" />;
    if (eventoLower.includes('salvo') || eventoLower.includes('rascunho')) return <Save className="h-5 w-5 text-white" />;
    if (eventoLower.includes('certidão')) return <FileText className="h-5 w-5 text-white" />;
    return <BookKey className="h-5 w-5 text-white" />;
};

const HistoricoModal: React.FC<HistoricoModalProps> = ({ isOpen, onClose, historico }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fade-in"
            onClick={onClose} // Fecha ao clicar no fundo
        >
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()} // Impede que o clique no modal feche-o
            >
                <header className="flex justify-between items-center p-5 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">Histórico do Ato</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800 transition-colors p-1 rounded-full"
                    >
                        <XCircle size={28} />
                    </button>
                </header>

                <main className="p-6 overflow-y-auto">
                    <div className="relative pl-6">
                        <div className="absolute left-4 top-0 -bottom-4 w-0.5 bg-gray-200"></div>
                        {historico.length > 0 ? (
                            historico.map((item, index) => (
                                <div key={index} className="relative mb-8">
                                    <div className="absolute -left-[1px] top-0.5 h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center ring-8 ring-white">
                                        {getEventIcon(item.evento)}
                                    </div>
                                    <div className="ml-12">
                                        <div className="font-semibold text-gray-800">{item.evento}</div>
                                        <div className="text-sm text-gray-500">
                                            {new Date(item.data).toLocaleString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <div className="text-sm text-gray-400">Usuário: {item.usuario}</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 py-8">Nenhum evento registrado no histórico.</p>
                        )}
                    </div>
                </main>

                <footer className="p-4 bg-gray-50 border-t text-right">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-gray-200 text-gray-800 font-semibold px-5 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Fechar
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default HistoricoModal;