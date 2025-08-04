// Salve em um novo arquivo, ex: src/components/integracoes/DetalhesLoteModal.tsx
import { X, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { type LoteSIRC } from './HistoricoTransmissoesSIRC'; // Importaremos a tipagem do próximo arquivo

// Reutilizando o componente de Badge para consistência
const StatusBadge = ({ status }: { status: 'Sucesso' | 'Falha' }) => {
    const isSuccess = status === 'Sucesso';
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${isSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>
            {isSuccess ? <CheckCircle size={14} /> : <XCircle size={14} />}
            {status}
        </span>
    );
};

interface DetalhesLoteModalProps {
    lote: LoteSIRC | null;
    onClose: () => void;
}

export default function DetalhesLoteModal({ lote, onClose }: DetalhesLoteModalProps) {
    if (!lote) return null;

    return (
        // Estrutura do modal baseada no seu PreviewModal
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
                <header className="flex justify-between items-center p-5 border-b border-gray-200">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">Detalhes do Lote</h2>
                        <p className="text-sm font-mono text-gray-500">{lote.id}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X size={24} /></button>
                </header>

                <div className="p-6">
                    {/* SEÇÃO DE ERRO - MUITO IMPORTANTE */}
                    {lote.status === 'Falha' && (
                        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-bold text-red-800">Mensagem de Erro da CRC</h4>
                                    <p className="text-sm text-red-700 mt-1 font-mono">{lote.mensagemErro}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* DADOS GERAIS DO LOTE */}
                    <dl className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                        <div className="p-3 rounded-md bg-gray-50/70">
                            <dt className="text-sm font-semibold text-gray-500">Status</dt>
                            <dd className="mt-1"><StatusBadge status={lote.status} /></dd>
                        </div>
                        <div className="p-3 rounded-md bg-gray-50/70">
                            <dt className="text-sm font-semibold text-gray-500">Data do Envio</dt>
                            <dd className="mt-1 text-sm text-gray-800">{lote.dataEnvio}</dd>
                        </div>
                        <div className="p-3 rounded-md bg-gray-50/70">
                            <dt className="text-sm font-semibold text-gray-500">Tipo de Envio</dt>
                            <dd className="mt-1 text-sm text-gray-800">{lote.tipoEnvio}</dd>
                        </div>
                    </dl>

                    {/* LISTA DE ATOS NO LOTE */}
                    <div className="mt-6">
                        <h4 className="font-bold text-gray-800 mb-2">Atos Incluídos no Lote ({lote.atos.length})</h4>
                        <ul className="divide-y divide-gray-200 border rounded-lg max-h-60 overflow-y-auto">
                            {lote.atos.map(ato => (
                                <li key={ato.id} className="px-4 py-3 flex justify-between items-center text-sm">
                                    <span className="font-medium text-gray-700">{ato.tipo}</span>
                                    <span className="text-gray-500">{ato.referencia}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}