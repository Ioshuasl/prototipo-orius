// Salve em um novo arquivo, ex: src/components/integracoes/HistoricoTransmissoes.tsx
import { useState, useMemo } from 'react';
import { Search, Eye, CheckCircle, XCircle } from 'lucide-react';
import DetalhesLoteModal from './DetalhesLoteModal';

// Tipagem para os Lotes do histórico
export interface Lote {
    id: string;
    status: 'Sucesso' | 'Falha';
    dataEnvio: string;
    totalAtos: number;
    tipoEnvio: 'Automático' | 'Manual';
    mensagemErro?: string;
    atos: Array<{id: string, tipo: string, referencia: string}>;
}

// Componente para os Badges de Status (reutilizado internamente)
const StatusBadge = ({ status }: { status: 'Sucesso' | 'Falha' }) => {
    const isSuccess = status === 'Sucesso';
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${isSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>
            {isSuccess ? <CheckCircle size={14} /> : <XCircle size={14} />}
            {status}
        </span>
    );
};



interface HistoricoTransmissoesProps {
    lotes: Lote[];
}

export default function HistoricoTransmissoes({ lotes }: HistoricoTransmissoesProps) {
    const [filtroStatus, setFiltroStatus] = useState<'todos' | 'sucesso' | 'falha'>('todos');
    const [termoBusca, setTermoBusca] = useState('');
    const [loteSelecionado, setLoteSelecionado] = useState<Lote | null>(null);

    const lotesFiltrados = useMemo(() => {
        return lotes.filter(lote => {
            const statusMatch = filtroStatus === 'todos' || lote.status.toLowerCase() === filtroStatus;
            const buscaMatch = termoBusca === '' || lote.id.toLowerCase().includes(termoBusca.toLowerCase());
            return statusMatch && buscaMatch;
        });
    }, [lotes, filtroStatus, termoBusca]);

    const filtroBtnStyle = "px-3 py-1.5 text-sm font-semibold rounded-md transition-colors";
    const activeFiltroBtnStyle = "bg-blue-100 text-blue-800";
    const inactiveFiltroBtnStyle = "bg-gray-100 text-gray-700 hover:bg-gray-200";

    return (
        <>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800">Histórico de Transmissões</h3>
                    <p className="text-sm text-gray-500 mt-1">Consulte todos os lotes de atos enviados para a CRC Nacional.</p>
                </div>
                
                {/* BARRA DE FERRAMENTAS COM FILTROS */}
                <div className="p-4 flex flex-col md:flex-row items-center gap-4 bg-gray-50/50">
                    <div className="relative w-full md:w-1/3">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por ID do Lote..."
                            value={termoBusca}
                            onChange={(e) => setTermoBusca(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-600">Status:</span>
                        <button onClick={() => setFiltroStatus('todos')} className={`${filtroBtnStyle} ${filtroStatus === 'todos' ? activeFiltroBtnStyle : inactiveFiltroBtnStyle}`}>Todos</button>
                        <button onClick={() => setFiltroStatus('sucesso')} className={`${filtroBtnStyle} ${filtroStatus === 'sucesso' ? activeFiltroBtnStyle : inactiveFiltroBtnStyle}`}>Sucesso</button>
                        <button onClick={() => setFiltroStatus('falha')} className={`${filtroBtnStyle} ${filtroStatus === 'falha' ? activeFiltroBtnStyle : inactiveFiltroBtnStyle}`}>Falha</button>
                    </div>
                </div>

                {/* TABELA DE HISTÓRICO */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        {/* ... (código do thead igual ao da Fila de Envio, mas com colunas diferentes) ... */}
                        <tbody>
                            {lotesFiltrados.map((lote) => (
                                <tr key={lote.id}>
                                    <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={lote.status} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><span className="text-xs font-mono text-gray-600">{lote.id}</span></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-600">{lote.dataEnvio}</div></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center"><div className="text-sm font-semibold text-gray-800">{lote.totalAtos}</div></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-600">{lote.tipoEnvio}</div></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <button onClick={() => setLoteSelecionado(lote)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full">
                                            <Eye size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* RENDERIZAÇÃO DO MODAL */}
            <DetalhesLoteModal lote={loteSelecionado} onClose={() => setLoteSelecionado(null)} />
        </>
    );
}