// Salve como src/pages/integracoes/CRCDashboard.tsx
import { useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Send, type LucideIcon } from 'lucide-react';
import FilaDeEnvio, { type FilaItem } from './Components/FilaDeEnvio';
import HistoricoTransmissoes from './Components/HistoricoTransmissoes';
import { type Lote } from './Components/HistoricoTransmissoes';
import AcaoLote from './AcaoLote';
import DetalhesAtoModal from './Components/DetalhesAtoModal';

// 1. DEFINIÇÃO DOS ESTADOS VISUAIS
//    Isso centraliza a lógica de estilo e facilita a manutenção.
//    Baseado no padrão de cores que identificamos nos seus arquivos.
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
        title: 'Tudo em dia',
        subtitle: 'Todos os atos foram enviados com sucesso para a CRC.',
    },
    warning: {
        icon: AlertTriangle,
        iconColor: 'text-yellow-800',
        bgColor: 'bg-yellow-100',
        title: 'Envios Pendentes',
        subtitle: 'Existem atos na fila aguardando a próxima sincronização.',
    },
    error: {
        icon: XCircle,
        iconColor: 'text-red-700',
        bgColor: 'bg-red-100',
        title: 'Falha na Comunicação',
        subtitle: 'Um ou mais lotes falharam. Verifique o histórico para detalhes.',
    }
};

export interface ErroItem {
    id: string; // ID do ato no seu sistema
    tipoAto: 'Nascimento' | 'Casamento' | 'Óbito' | 'Averbação' | 'Certidão';
    nomesReferencia: string;
    mensagemErro: string; // A mensagem de erro retornada pela CRC
}


const mockQueue: FilaItem[] = [
    {
        id: 'N-001', tipoAto: 'Nascimento', nomesReferencia: 'Helena da Silva Martins', dataRegistro: '03/08/2025',
        status: 'Pronto'
    },
    {
        id: 'C-001', tipoAto: 'Casamento', nomesReferencia: 'Arthur Martins e Júlia Andrade', dataRegistro: '03/08/2025',
        status: 'Erro de Envio',
        mensagemErro: "Código 504: CPF do cônjuge varão inválido."
    },
    {
        id: 'O-001', tipoAto: 'Óbito', nomesReferencia: 'Miguel Pereira', dataRegistro: '02/08/2025',
        status: 'Pendente de Dados',
        mensagemErro: "O número da D.O. (Declaração de Óbito) não foi informado."
    },
    {
        id: 'A-001', tipoAto: 'Averbação', nomesReferencia: 'Divórcio de Lucas e Beatriz', dataRegistro: '01/08/2025',
        status: 'Enviando'
    },
    {
        id: 'CERT-001', tipoAto: 'Certidão', nomesReferencia: '2ª Via de Helena da Silva', dataRegistro: '03/08/2025',
        status: 'Pronto'
    },
];

const mockHistory: Lote[] = [
    { id: 'LOTE-20250803-1400-001', status: 'Sucesso', dataEnvio: '03/08/2025 14:00:15', totalAtos: 8, tipoEnvio: 'Automático', atos: [{ id: 'N-001', tipo: 'Nascimento', referencia: 'Helena da Silva' }] },
    { id: 'LOTE-20250803-1200-001', status: 'Falha', dataEnvio: '03/08/2025 12:00:21', totalAtos: 5, tipoEnvio: 'Automático', mensagemErro: "Código 504: O campo 'numero_documento_genitor' é obrigatório para o ato [ID: C-008].", atos: [{ id: 'C-008', tipo: 'Casamento', referencia: 'Pedro e Maria' }] },
    { id: 'LOTE-20250802-1830-001', status: 'Sucesso', dataEnvio: '02/08/2025 18:30:05', totalAtos: 15, tipoEnvio: 'Manual', atos: [] },
    // ... adicione mais lotes para testar a paginação/scroll no futuro
];

// 3. COMPONENTE PRINCIPAL DA PÁGINA
export default function CRCDashboard() {
    const [queue, setQueue] = useState<FilaItem[]>(mockQueue);
    const [isLoading, setIsLoading] = useState(false);
    const [selecionados, setSelecionados] = useState<string[]>([]);
    const [erros, setErros] = useState<ErroItem[]>([ // Mock de erros para visualização
        { id: 'C-001', tipoAto: 'Casamento', nomesReferencia: 'Arthur M. e Júlia A.', mensagemErro: "Código 504: CPF do cônjuge varão inválido." },
        { id: 'N-001', tipoAto: 'Nascimento', nomesReferencia: 'Helena da Silva', mensagemErro: "Código 610: DNV informada já foi utilizada em outro registro." },
    ]);
    const [itemParaDetalhes, setItemParaDetalhes] = useState<FilaItem | null>(null);
    const getDashboardStatus = (): StatusType => {
        if (erros.length > 0 || queue.some(item => item.status === 'Erro de Envio')) return 'error';
        if (queue.some(item => item.status === 'Pronto' || item.status === 'Pendente de Dados')) return 'warning';
        return 'success';
    };
    const mainStatus = getDashboardStatus();
    const currentStatus = statusConfig[mainStatus];

    const mockMetrics = {
        pending: queue.filter(item => item.status === 'Pronto' || item.status === 'Pendente de Dados').length,
        sentToday: 12,
        errors: queue.filter(item => item.status === 'Erro de Envio').length + erros.length,
    };

    // --- LÓGICA DE SELEÇÃO E AÇÕES ---
    const handleSelectionChange = (id: string) => {
        setSelecionados(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };


    const handleSync = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setQueue([]); // Limpa a fila para simular o envio
        }, 2000);
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
        alert(`FLUXO MANUAL:\nGerando arquivo XML para download com ${selecionados.length} atos selecionados...`);
        // Aqui entraria a lógica para gerar o XML e iniciar o download
        // E depois, exibir o modal de "Marcar como enviado"
    };

    const handleCorrigirErro = (id: string) => {
        setItemParaDetalhes(null); // Fecha o modal
        alert(`NAVEGAÇÃO:\nLevando o usuário para a tela de edição do ato com ID: ${id}`);
    };


    return (
        <div className="mx-auto space-y-4 pb-24">
            {/* CABEÇALHO DA PÁGINA - Padrão de GerenciamentoTemplates.tsx */}
            <header className="pb-4 border-b border-gray-200">
                <h1 className="text-3xl font-bold text-gray-800">Integração CRC Nacional</h1>
                <p className="text-md text-gray-500 mt-1">
                    Monitore o status, envie pendências e consulte o histórico de comunicação.
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


            <FilaDeEnvio
                items={queue}
                itensSelecionados={selecionados}
                onSelectionChange={handleSelectionChange}
                onSelectAll={handleSelectAll}
                onVerDetalhes={setItemParaDetalhes} // Passa a função para abrir o modal

            />


            <HistoricoTransmissoes lotes={mockHistory} />

            {/* BARRA DE AÇÃO HÍBRIDA RENDERIZADA NO FINAL */}
            <AcaoLote
                itensSelecionados={selecionados.length}
                onEnviarClick={handleEnviarLote}
                onGerarXmlClick={handleGerarXml}
                onLimparSelecao={() => setSelecionados([])}
            />

            <DetalhesAtoModal
                item={itemParaDetalhes}
                onClose={() => setItemParaDetalhes(null)}
                onCorrigir={handleCorrigirErro}
            />

        </div>
    );
}