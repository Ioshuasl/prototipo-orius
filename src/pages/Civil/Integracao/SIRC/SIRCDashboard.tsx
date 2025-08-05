// Salve como: src/pages/integracoes/SIRCDashboard.tsx

import { useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Send, type LucideIcon } from 'lucide-react';

// Importando os novos componentes SIRC que criaremos a seguir
import FilaDeEnvioSIRC, { type FilaItemSIRC } from './Components/FilaDeEnvioSIRC';
import HistoricoTransmissoesSIRC, { type LoteSIRC } from './Components/HistoricoTransmissoesSIRC';
import AcaoLoteSIRC from './AcaoLoteSIRC';
import DetalhesAtoModalSIRC from './Components/DetalhesAtoModalSIRC';

// --- CONFIGURAÇÃO DE STATUS VISUAL (Idêntica à do CRC) ---
type StatusType = 'success' | 'warning' | 'error';

interface StatusConfig {
    icon: LucideIcon;
    iconColor: string;
    bgColor: string;
    title: string;
    subtitle: string;
}

const statusConfig: Record<StatusType, StatusConfig> = {
    success: {
        icon: CheckCircle2,
        iconColor: 'text-green-700',
        bgColor: 'bg-green-100',
        title: 'Comunicação em dia',
        subtitle: 'Não há atos pendentes de envio para o SIRC.',
    },
    warning: {
        icon: AlertTriangle,
        iconColor: 'text-yellow-800',
        bgColor: 'bg-yellow-100',
        title: 'Envios Pendentes',
        subtitle: 'Existem atos na fila aguardando o envio para o SIRC.',
    },
    error: {
        icon: XCircle,
        iconColor: 'text-red-700',
        bgColor: 'bg-red-100',
        title: 'Falha no Envio',
        subtitle: 'Um ou mais atos foram rejeitados pelo SIRC e precisam de correção.',
    }
};

// --- MOCK DE DADOS PARA A FILA DO SIRC ---
// O foco é em Óbito, mas outros atos também são enviados
const initialQueueSIRC: FilaItemSIRC[] = [
    {
        id: 'O-101', tipoAto: 'Óbito', nomesReferencia: 'João da Silva', dataRegistro: '02/08/2025',
        status: 'Pronto'
    },
    {
        id: 'O-102', tipoAto: 'Óbito', nomesReferencia: 'Maria Antunes', dataRegistro: '01/08/2025',
        status: 'Erro de Envio',
        mensagemErro: "SIRC-401: Matrícula do registro informada não segue o padrão exigido."
    },
    {
        id: 'N-201', tipoAto: 'Nascimento', nomesReferencia: 'Pedro Pascal', dataRegistro: '01/08/2025',
        status: 'Pendente de Dados',
        mensagemErro: "CPF da mãe é obrigatório para envio ao SIRC e não foi informado."
    },
    {
        id: 'C-301', tipoAto: 'Casamento', nomesReferencia: 'José Alencar e Sofia Lima', dataRegistro: '01/08/2025',
        status: 'Pronto'
    },
];

// Mock para o histórico de lotes enviados ao SIRC
const mockHistorySIRC: LoteSIRC[] = [
    { id: 'LOTE-SIRC-20250802-1', status: 'Sucesso', dataEnvio: '02/08/2025 18:00', totalAtos: 15, tipoEnvio: 'Automático', atos: [] },
    { id: 'LOTE-SIRC-20250801-1', status: 'Sucesso', dataEnvio: '01/08/2025 17:30', totalAtos: 10, tipoEnvio: 'Manual', atos: [] },
];

export interface ErroItem {
    id: string; // ID do ato no seu sistema
    tipoAto: 'Nascimento' | 'Casamento' | 'Óbito' | 'Averbação' | 'Certidão';
    nomesReferencia: string;
    mensagemErro: string; // A mensagem de erro retornada pela CRC
}


export default function SIRCDashboard() {
    // --- GESTÃO DE ESTADO DO COMPONENTE ---
    const [queue, setQueue] = useState<FilaItemSIRC[]>(initialQueueSIRC);
    const [selecionados, setSelecionados] = useState<string[]>([]);
    const [itemParaDetalhes, setItemParaDetalhes] = useState<FilaItemSIRC | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [erros, setErros] = useState<ErroItem[]>([ // Mock de erros para visualização
            { id: 'C-001', tipoAto: 'Casamento', nomesReferencia: 'Arthur M. e Júlia A.', mensagemErro: "Código 504: CPF do cônjuge varão inválido." },
            { id: 'N-001', tipoAto: 'Nascimento', nomesReferencia: 'Helena da Silva', mensagemErro: "Código 610: DNV informada já foi utilizada em outro registro." },
        ]);

    // --- LÓGICA DE STATUS DINÂMICO ---
    const mainStatus: StatusType = queue.some(item => item.status === 'Erro de Envio') ? 'error' :
        queue.some(item => item.status === 'Pronto' || item.status === 'Pendente de Dados') ? 'warning' : 'success';
    const currentStatus = statusConfig[mainStatus];

    const mockMetrics = {
        pending: queue.filter(item => item.status === 'Pronto' || item.status === 'Pendente de Dados').length,
        sentToday: 12,
        errors: queue.filter(item => item.status === 'Erro de Envio').length + erros.length,
    };

    const handleSync = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setQueue([]); // Limpa a fila para simular o envio
        }, 2000);
    };

    // --- FUNÇÕES DE MANIPULAÇÃO (HANDLERS) ---
    const handleSelectionChange = (id: string) => {
        setSelecionados(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleSelectAll = (checked: boolean) => {
        const idsProntos = queue.filter(item => item.status === 'Pronto').map(item => item.id);
        setSelecionados(checked ? idsProntos : []);
    };

    const handleEnviarLote = () => {
            alert(`FLUXO AUTOMÁTICO:\nEnviando ${selecionados.length} atos...`);
    
            // --- SIMULAÇÃO DE RESPOSTA COM ERRO DA API ---
            const sucesso = false; // Mude para 'true' para simular sucesso
    
            if (sucesso) {
                // Lógica de sucesso...
            } else {
                // Lógica de falha:
                // 1. Identificar os itens que falharam (aqui simulamos com todos os selecionados)
                const itensComErro = queue.filter(item => selecionados.includes(item.id));
    
                // 2. Mapear para o formato ErroItem
                const novosErros: ErroItem[] = itensComErro.map(item => ({
                    id: item.id,
                    tipoAto: item.tipoAto,
                    nomesReferencia: item.nomesReferencia,
                    mensagemErro: "Erro simulado retornado pela API da CRC."
                }));
    
                // 3. Adicionar ao painel de erros
                setErros(prev => [...prev, ...novosErros]);
    
                // 4. Remover da fila de pendentes
                setQueue(prev => prev.filter(item => !selecionados.includes(item.id)));
    
                // 5. Limpar a seleção
                setSelecionados([]);
    
                alert("O envio falhou! Verifique o painel 'Ações Necessárias' para corrigir os erros.");
            }
        };

    const handleGerarXml = () => {
        alert(`FLUXO MANUAL:\nGerando arquivo para upload no portal do SIRC com ${selecionados.length} atos selecionados...`);
        // Aqui viria a lógica para gerar o arquivo e o modal de confirmação.
    };

    const handleCorrigirAto = (id: string) => {
        setItemParaDetalhes(null); // Fecha o modal antes de navegar
        alert(`NAVEGAÇÃO:\nLevando o usuário para a tela de edição do ato com ID: ${id} para correção dos dados do SIRC.`);
        // Ex: navigate(`/registros/obito/${id}`);
    };

    return (
        <div className="mx-auto space-y-4 pb-24">
            <header className="pb-4 border-b border-gray-200">
                <h1 className="text-3xl font-bold text-gray-800">Integração SIRC / INSS</h1>
                <p className="text-md text-gray-500 mt-1">
                    Gerencie o envio de registros de óbitos, nascimentos e casamentos para a base do INSS.
                </p>
            </header>

            {/* PAINEL DE STATUS GERAL E AÇÕES RÁPIDAS */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">

                {/* Lado Esquerdo: Indicador de Status Visual */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className={`p-3 rounded-full ${currentStatus.bgColor}`}>
                        <currentStatus.icon size={32} className={currentStatus.iconColor} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">{currentStatus.title}</h2>
                        <p className="text-sm text-gray-500">{currentStatus.subtitle}</p>
                    </div>
                </div>


                {/* Meio: Métricas Principais */}
                <div className="flex items-center gap-8 text-center border-t md:border-t-0 md:border-l md:border-r border-gray-200 px-0 md:px-8 py-4 md:py-0 w-full md:w-auto">
                    <div>
                        <p className="text-2xl font-bold text-blue-600">{mockMetrics.pending}</p>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Pendentes</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-800">{mockMetrics.sentToday}</p>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Enviados Hoje</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-red-600">{mockMetrics.errors}</p>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Erros</p>
                    </div>
                </div>

                {/* Lado Direito: Ações */}
                <div className="flex flex-col items-center md:items-end gap-2 w-full md:w-auto">
                    <button
                        onClick={handleSync}
                        disabled={isLoading}
                        className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Sincronizando...
                            </>
                        ) : (
                            <>
                                <Send size={16} />
                                Sincronizar Agora
                            </>
                        )}
                    </button>
                    <p className="text-xs text-gray-500">
                        Última sincronização: Hoje às 14:00 (Automática)
                    </p>
                </div>
            </div>

            <FilaDeEnvioSIRC
                items={queue}
                itensSelecionados={selecionados}
                onSelectionChange={handleSelectionChange}
                onSelectAll={handleSelectAll}
                onVerDetalhes={setItemParaDetalhes}
            />

            <HistoricoTransmissoesSIRC lotes={mockHistorySIRC} />

            <AcaoLoteSIRC
                itensSelecionados={selecionados.length}
                onEnviarClick={handleEnviarLote}
                onGerarXmlClick={handleGerarXml}
                onLimparSelecao={() => setSelecionados([])}
            />

            <DetalhesAtoModalSIRC
                item={itemParaDetalhes}
                onClose={() => setItemParaDetalhes(null)}
                onCorrigir={handleCorrigirAto}
            />
        </div>
    );
}