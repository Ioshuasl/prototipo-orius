import { Clock, AlertCircle, CheckCircle, Info } from 'lucide-react';

// Tipagem unificada para o status de um ato na fila
export type AtoStatus = 'Pronto' | 'Pendente de Dados' | 'Erro de Envio' | 'Enviando';

// Tipagem para os itens da fila, incluindo status e mensagem de erro opcional
export interface FilaItem {
    id: string;
    tipoAto: 'Nascimento' | 'Casamento' | 'Óbito' | 'Averbação' | 'Certidão';
    nomesReferencia: string;
    dataRegistro: string;
    status: AtoStatus;
    mensagemErro?: string;
}

// Objeto de configuração para mapear o status para estilos e ícones
const statusConfig = {
    'Pronto': {
        rowClass: 'bg-white',
        icon: CheckCircle,
        iconClass: 'text-green-500',
        textClass: 'text-gray-700',
    },
    'Pendente de Dados': {
        rowClass: 'bg-yellow-50',
        icon: AlertCircle,
        iconClass: 'text-yellow-600',
        textClass: 'text-yellow-800 font-semibold',
    },
    'Erro de Envio': {
        rowClass: 'bg-red-50',
        icon: AlertCircle,
        iconClass: 'text-red-600',
        textClass: 'text-red-800 font-semibold',
    },
    'Enviando': {
        rowClass: 'bg-blue-50 animate-pulse',
        icon: Clock,
        iconClass: 'text-blue-600 animate-spin',
        textClass: 'text-blue-800 font-semibold',
    }
}

// Componente para os Badges de Tipo de Ato
const AtoBadge = ({ tipo }: { tipo: FilaItem['tipoAto'] }) => {
    const styles = {
        Nascimento: 'bg-blue-100 text-blue-800',
        Casamento: 'bg-green-100 text-green-800',
        Óbito: 'bg-gray-200 text-gray-800',
        Averbação: 'bg-purple-100 text-purple-800',
        Certidão: 'bg-orange-100 text-orange-800',
    };
    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[tipo]}`}>
            {tipo}
        </span>
    );
};

// Props do componente FilaDeEnvio
interface FilaDeEnvioProps {
    items: FilaItem[];
    itensSelecionados: string[];
    onSelectionChange: (id: string) => void;
    onSelectAll: (checked: boolean) => void;
    onVerDetalhes: (item: FilaItem) => void;
}

export default function FilaDeEnvio({ items, itensSelecionados, onSelectionChange, onSelectAll, onVerDetalhes }: FilaDeEnvioProps) {
    const selectableItems = items.filter(item => item.status === 'Pronto');
    const isAllSelected = selectableItems.length > 0 && itensSelecionados.length === selectableItems.length;

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-800">Atos Pendentes de Envio</h3>
                <p className="text-sm text-gray-500 mt-1">
                    Selecione os atos com status "Pronto" para incluir em um lote de envio. Atos com pendências precisam ser corrigidos.
                </p>
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="p-4">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:bg-gray-200 disabled:cursor-not-allowed"
                                    checked={isAllSelected}
                                    onChange={(e) => onSelectAll(e.target.checked)}
                                    disabled={selectableItems.length === 0}
                                    title={selectableItems.length === 0 ? "Nenhum ato pronto para seleção" : "Selecionar todos os atos prontos"}
                                />
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Tipo de Ato
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Nomes de Referência
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Data do Registro
                            </th>
                            <th scope="col" className="relative px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Ações
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {items.map((item) => {
                            const config = statusConfig[item.status];
                            const isSelected = itensSelecionados.includes(item.id);

                            return (
                                <tr 
                                    key={item.id} 
                                    className={`${isSelected ? 'bg-blue-50' : config.rowClass} transition-colors duration-200`}
                                >
                                    <td className="p-4">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:bg-gray-200 disabled:cursor-not-allowed"
                                            checked={isSelected}
                                            onChange={() => onSelectionChange(item.id)}
                                            disabled={item.status !== 'Pronto'}
                                            title={item.status !== 'Pronto' ? `Este ato precisa ser corrigido antes de ser enviado.` : 'Selecionar ato'}
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`flex items-center gap-2 text-sm ${config.textClass}`}>
                                            <config.icon size={16} className={config.iconClass} />
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <AtoBadge tipo={item.tipoAto} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{item.nomesReferencia}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{item.dataRegistro}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <button 
                                            onClick={() => onVerDetalhes(item)}
                                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                                            title="Ver detalhes do ato"
                                        >
                                            <Info size={18} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}