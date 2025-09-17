import { useState, useEffect, useMemo } from 'react';
import { FileText, Users, User, UserCheck, Save, XCircle, Flag, Mail, Gavel, BadgeX, HandCoins, History, ChevronLeft } from 'lucide-react';
import { type IEndereco, type IPessoaFisica, type ITituloProtesto, type TPessoaTipo, type StatusTitulo, type Historico } from '../types';
import { calcularAtoCompletoProtesto, calcularCustoCancelamento, calcularCustoLiquidacao, type IResultadoCalculoCompleto } from '../../Functions/calculoCustas';
import { mockTitulosProtesto } from '../lib/Constants';
import HistoricoModal from '../../Components/HistoricoModal';
import { Link, useParams, useNavigate } from 'react-router-dom';
import TabDadosTitulo from './tabs/DadosTitulo';
import TabApontamento from './tabs/TabApontamento';
import TabApresentante from './tabs/TabApresentante';
import TabCedente from './tabs/TabCedente';
import TabDevedores from './tabs/TabDevedores';
import TabIntimacao from './tabs/TabIntimacao';
import TabLiquidacao from './tabs/TabLiquidacao';
import TabProtesto from './tabs/TabProtesto';
import TabCancelamento from './tabs/TabCancelamento';
import { toast } from 'react-toastify';
import ConfirmacaoSeloModal, {type IParsedData} from '../../Components/ConfirmacaoSeloModal';
import tabelaEmolumentos from '../../../../tabela-emolumentos.json'


// --- NOVO TYPE PARA O ESTADO DO MODAL ---
type TModalAction = 'intimar' | 'liquidar' | 'protestar' | 'cancelar';

interface IConfirmationModalState {
    isOpen: boolean;
    action: TModalAction | null;
    data: IParsedData[];
    title: string;
}

const initialModalState: IConfirmationModalState = {
    isOpen: false,
    action: null,
    data: [],
    title: ''
};

const initialEnderecoState: IEndereco = { cep: '', tipoLogradouro: '', logradouro: '', numero: '', complemento: '', bairro: '', cidade: '', uf: '' };
const initialPersonState: IPessoaFisica = { tipo: 'fisica', nome: '', cpf: '', endereco: initialEnderecoState, dataNascimento: '1990-01-01', docIdentidadeNum: '123', docIdentidadeTipo: 'RG', nacionalidade: 'Brasileira', naturalidadeCidade: 'Goiânia', naturalidadeUF: 'GO', profissao: '' };


export default function DetalhesTituloProtestoPage() {
    const { tituloId } = useParams();
    const navigate = useNavigate();
    const [titulo, setTitulo] = useState<ITituloProtesto>(mockTitulosProtesto[6]);
    const [activeTab, setActiveTab] = useState('dadosTitulo');
    const [calculoCustas, setCalculoCustas] = useState<IResultadoCalculoCompleto | null>(null);
    const [isCostVisible, setIsCostVisible] = useState(true);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [confirmationModal, setConfirmationModal] = useState<IConfirmationModalState>(initialModalState);


    const visibleTabs = useMemo(() => {
        const baseTabs = [
            { id: 'dadosTitulo', label: 'Dados do Título', icon: FileText },
            { id: 'apresentante', label: 'Apresentante', icon: User },
            { id: 'devedores', label: 'Devedor(es)', icon: Users },
        ];

        if (titulo.cedente) {
            baseTabs.push({ id: 'cedente', label: 'Cedente', icon: UserCheck });
        }
        if (titulo.apontamento) {
            baseTabs.push({ id: 'apontamento', label: 'Apontamento', icon: Flag });
        }
        if (titulo.intimacao) {
            baseTabs.push({ id: 'intimacao', label: 'Intimação', icon: Mail });
        }
        if (titulo.liquidacaoOuDesistencia) {
            baseTabs.push({ id: 'liquidacao', label: 'Liquidação/Desistência', icon: HandCoins });
        }
        if (titulo.protesto) {
            baseTabs.push({ id: 'protesto', label: 'Protesto', icon: Gavel });
        }
        if (titulo.cancelamento) {
            baseTabs.push({ id: 'cancelamento', label: 'Cancelamento', icon: BadgeX });
        }
        return baseTabs;
    }, [titulo]);

    useEffect(() => {
        if (tituloId) {
            // Em uma aplicação real, aqui você faria uma chamada à API:
            // fetch(`/api/titulos/${tituloId}`).then(...)

            // Como estamos usando dados simulados, vamos encontrá-lo na nossa constante:
            const idNumerico = parseInt(tituloId, 10);
            const tituloEncontrado = mockTitulosProtesto.find(t => t.id === idNumerico);

            if (tituloEncontrado) {
                setTitulo(tituloEncontrado);
            } else {
                // Se não encontrar o título, redireciona de volta para a lista
                alert("Título não encontrado!");
                navigate('/protesto/titulos');
            }
        }
    }, [tituloId, navigate]);

    useEffect(() => {
        if (titulo && titulo.valor > 0 && titulo.devedores.length > 0) {
            const resultado = calcularAtoCompletoProtesto(titulo);

            setCalculoCustas(resultado);
        }
    }, [titulo]);

    useEffect(() => {
        if (titulo.valor > 0 && titulo.devedores.length > 0) {
            const resultado = calcularAtoCompletoProtesto(titulo);

            setCalculoCustas(resultado);
        }
    }, [titulo.valor, titulo.tipoPagamento, titulo.devedores]);

    const handleDevedorChange = (index: number, novosDados: Partial<TPessoaTipo>) => {
        setTitulo(prev => {
            const devedoresAtualizados = [...prev.devedores];
            devedoresAtualizados[index] = novosDados as TPessoaTipo;
            return { ...prev, devedores: devedoresAtualizados };
        });
    };

    const handleAddDevedor = () => {
        setTitulo(prev => ({ ...prev, devedores: [...prev.devedores, { tipo: 'fisica', nome: '', cpf: '', endereco: {} } as IPessoaFisica] }));
    };

    const handleRemoveDevedor = (indexToRemove: number) => {
        if (titulo.devedores.length <= 1) {
            alert("É necessário manter pelo menos um devedor.");
            return;
        }
        setTitulo(prev => ({ ...prev, devedores: prev.devedores.filter((_, index) => index !== indexToRemove) }));
    };

    const StatusBadge = ({ status }: { status: StatusTitulo }) => {
        const styles: Record<StatusTitulo, string> = {
            'Aguardando Qualificação': 'bg-cyan-100 text-cyan-800 border-cyan-200',
            'Recusado': 'bg-gray-100 text-gray-800 border-gray-200',
            'Aguardando Intimação': 'bg-blue-100 text-blue-800 border-blue-200',
            'Prazo Aberto': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'Pago': 'bg-green-100 text-green-800 border-green-200',
            'Retirado': 'bg-purple-100 text-purple-800 border-purple-200',
            'Sustado Judicialmente': 'bg-orange-100 text-orange-800 border-orange-200',
            'Protestado': 'bg-red-100 text-red-800 border-red-200',
            'Cancelado': 'bg-pink-100 text-pink-800 border-pink-200',
            'Liquidado': 'bg-pink-100 text-pink-800 border-pink-200',
        };
        return <span className={`px-3 py-1 text-sm font-bold rounded-full border ${styles[status] || 'bg-gray-100'}`}>{status}</span>;
    };

    const criarRegistroHistorico = (evento: string): Historico => ({
        data: new Date().toISOString(), // Converte o objeto Date para uma string no formato ISO 8601
        evento: evento, // A chave agora é 'evento' para corresponder à interface
        usuario: 'Usuário do Sistema', // Em um sistema real, viria do contexto de autenticação
    });

    const handleIntimar = () => {
        const seloInfo = calculoCustas?.cobrancaInicial?.detalhes?.intimacao?.selo;
        if (!seloInfo) {
            toast.error("Selo de intimação não encontrado no cálculo.");
            return;
        }
        setConfirmationModal({
            isOpen: true,
            action: 'intimar',
            title: 'Confirmar Intimação',
            data: [{
                label: `Intimação para ${titulo.devedores[0]}`,
                seloId: seloInfo.id_selo,
                tituloData: titulo
            }]
        });
    };

    const handleLiquidar = () => {
        const calculoLiquidacao = calcularCustoLiquidacao(titulo);

        if (!calculoLiquidacao) {
            toast.error("Não foi possível calcular o custo do cancelamento.");
            return;
        }

        // --- LÓGICA ADAPTADA PARA MÚLTIPLOS SELOS ---
        const selosParaConfirmar: IParsedData[] = [];

        if ('liquidacao' in calculoLiquidacao) {
            if (calculoLiquidacao.apontamento) {
                selosParaConfirmar.push({ label: 'Apontamento', seloId: calculoLiquidacao.apontamento.selo.id_selo, tituloData: titulo });
            }
            if (calculoLiquidacao.intimacao) {
                selosParaConfirmar.push({ label: 'Intimação', seloId: calculoLiquidacao.intimacao.selo.id_selo, tituloData: titulo });
            }
            if (calculoLiquidacao.liquidacao) {
                selosParaConfirmar.push({ label: 'Liquidação', seloId: calculoLiquidacao.liquidacao.selo.id_selo, tituloData: titulo });
            }
        } else {
            // Caso simples: Pagamento Comum
            selosParaConfirmar.push({
                label: `Liquidação`,
                seloId: calculoLiquidacao.selo.id_selo,
                tituloData: titulo
            });
        }

        if (selosParaConfirmar.length === 0) {
            toast.error("Nenhum selo foi encontrado para a operação de liquidação.");
            return;
        }

        setConfirmationModal({
            isOpen: true,
            action: 'liquidar',
            title: 'Confirmar Liquidação e Geração de Selos',
            data: selosParaConfirmar // Passa a lista de todos os selos para o modal
        });
    };

    const handleProtestar = () => {
        const seloInfo = calculoCustas?.cobrancaInicial?.detalhes?.protesto?.selo;
        if (!seloInfo) {
            toast.error("Selo de protesto não encontrado no cálculo.");
            return;
        }
        setConfirmationModal({
            isOpen: true,
            action: 'protestar',
            title: 'Confirmar Protesto de Título',
            data: [{
                label: `Protesto`,
                seloId: seloInfo.id_selo,
                tituloData: titulo
            }]
        });
    };
    
    const handleCancelar = () => {
        const calculoCancelamento = calcularCustoCancelamento(titulo);

        if (!calculoCancelamento) {
            toast.error("Não foi possível calcular o custo do cancelamento.");
            return;
        }

        // --- LÓGICA ADAPTADA PARA MÚLTIPLOS SELOS ---
        const selosParaConfirmar: IParsedData[] = [];

        if ('cancelamento' in calculoCancelamento) {
            if (calculoCancelamento.apontamento) {
                selosParaConfirmar.push({ label: 'Apontamento', seloId: calculoCancelamento.apontamento.selo.id_selo, tituloData: titulo });
            }
            if (calculoCancelamento.intimacao) {
                selosParaConfirmar.push({ label: 'Intimação', seloId: calculoCancelamento.intimacao.selo.id_selo, tituloData: titulo });
            }
            if (calculoCancelamento.protesto) {
                selosParaConfirmar.push({ label: 'Protesto', seloId: calculoCancelamento.protesto.selo.id_selo, tituloData: titulo });
            }
            if (calculoCancelamento.cancelamento) {
                selosParaConfirmar.push({ label: 'Cancelamento', seloId: calculoCancelamento.cancelamento.selo.id_selo, tituloData: titulo });
            }
        } else {
            // Caso simples: Pagamento Comum
            selosParaConfirmar.push({
                label: `Cancelamento`,
                seloId: calculoCancelamento.selo.id_selo,
                tituloData: titulo
            });
        }

        if (selosParaConfirmar.length === 0) {
            toast.error("Nenhum selo foi encontrado para a operação de cancelamento.");
            return;
        }

        setConfirmationModal({
            isOpen: true,
            action: 'cancelar',
            title: 'Confirmar Cancelamento e Geração de Selos',
            data: selosParaConfirmar // Passa a lista de todos os selos para o modal
        });
    };

    const executeConfirmedAction = () => {
        const { action } = confirmationModal;

        switch (action) {
            case 'intimar': {
                const seloInfo = calculoCustas!.cobrancaInicial.detalhes.intimacao!.selo;
                setTitulo(prev => ({ ...prev, status: 'Aguardando Intimação', intimacao: { data: new Date(), meio: 'Pessoal', detalhes: '', selosIntimacao: [{ numeroselo: `GERADO-${seloInfo.id_selo}`, codigo: seloInfo.id_selo }] }, historico: [...(prev.historico || []), criarRegistroHistorico('Título enviado para intimação.')] }));
                setActiveTab('intimacao');
                toast.success("Título enviado para intimação!");
                break;
            }
            case 'liquidar': {
                const calculoLiquidacao = calcularCustoLiquidacao(titulo);

                if (!calculoLiquidacao) {
                    toast.error("Falha ao re-calcular o custo do cancelamento.");
                    setConfirmationModal(initialModalState);
                    return;
                }

                if ('liquidacao' in calculoLiquidacao) {
                    // Caso complexo: Atualiza o título com TODOS os selos devidos
                    const seloApontamento = calculoLiquidacao.apontamento?.selo;
                    const seloIntimacao = calculoLiquidacao.intimacao?.selo;
                    const seloCancelamento = calculoLiquidacao.liquidacao?.selo;

                    if (!seloCancelamento) { // Checagem mínima
                         toast.error("Selo de cancelamento não encontrado.");
                         setConfirmationModal(initialModalState);
                         return;
                    }

                    setTitulo(prev => ({
                        ...prev,
                        status: 'Liquidado',
                        apontamento: seloApontamento ? { ...prev.apontamento!, selosApontamento: [...(prev.apontamento?.selosApontamento || []), { numeroselo: `PAGO-${seloApontamento.id_selo}`, codigo: seloApontamento.id_selo }] } : prev.apontamento,
                        intimacao: seloIntimacao ? { ...prev.intimacao!, selosIntimacao: [...(prev.intimacao?.selosIntimacao || []), { numeroselo: `PAGO-${seloIntimacao.id_selo}`, codigo: seloIntimacao.id_selo }] } : prev.intimacao,
                        liquidacaoOuDesistencia: {
                            data: new Date(),
                            tipo: 'LIQUIDACAO',
                            seloLiquidacaoDesistencia: { numeroselo: `GERADO-${seloCancelamento.id_selo}`, codigo: seloCancelamento.id_selo }
                        },
                        historico: [...(prev.historico || []), criarRegistroHistorico('Protesto cancelado com quitação de custas posteriores.')]
                    }));

                } else {
                    // Caso simples: Lógica original para pagamento comum
                    const seloInfo = calculoLiquidacao.selo;
                    setTitulo(prev => ({
                        ...prev,
                        status: 'Liquidado',
                        cancelamento: {
                            data: new Date(),
                            motivo: 'Anuência do Credor',
                            selosCancelamento: { numeroselo: `GERADO-${seloInfo.id_selo}`, codigo: seloInfo.id_selo }
                        },
                        historico: [...(prev.historico || []), criarRegistroHistorico('Titulo Liquidado.')]
                    }));
                }

                setActiveTab('liquidacao');
                toast.info("Titulo Liquidado com sucesso!");
                break;
            }
            case 'protestar': {
                const seloInfo = calculoCustas!.cobrancaInicial.detalhes.protesto!.selo;
                setTitulo(prev => ({ ...prev, status: 'Protestado', protesto: { dataLavratura: new Date(), motivo: 'Falta de Pagamento', livro: 'Livro de Protesto - Nº 1', folha: '123', selosProtesto: [{ numeroselo: `GERADO-${seloInfo.id_selo}`, codigo: seloInfo.id_selo }] }, historico: [...(prev.historico || []), criarRegistroHistorico('Título protestado por falta de pagamento.')] }));
                setActiveTab('protesto');
                toast.warn("Título protestado!");
                break;
            }
            case 'cancelar': {
                const calculoCancelamento = calcularCustoCancelamento(titulo);
                if (!calculoCancelamento) {
                    toast.error("Falha ao re-calcular o custo do cancelamento.");
                    setConfirmationModal(initialModalState);
                    return;
                }

                // --- LÓGICA DE EXECUÇÃO ADAPTADA PARA MÚLTIPLOS SELOS ---
                if ('cancelamento' in calculoCancelamento) {
                    // Caso complexo: Atualiza o título com TODOS os selos devidos
                    const seloApontamento = calculoCancelamento.apontamento?.selo;
                    const seloIntimacao = calculoCancelamento.intimacao?.selo;
                    const seloProtesto = calculoCancelamento.protesto?.selo;
                    const seloCancelamento = calculoCancelamento.cancelamento?.selo;

                    if (!seloCancelamento) { // Checagem mínima
                         toast.error("Selo de cancelamento não encontrado.");
                         setConfirmationModal(initialModalState);
                         return;
                    }

                    setTitulo(prev => ({
                        ...prev,
                        status: 'Cancelado',
                        // Adiciona os selos de pagamento posterior aos seus respectivos atos
                        apontamento: seloApontamento ? { ...prev.apontamento!, selosApontamento: [...(prev.apontamento?.selosApontamento || []), { numeroselo: `PAGO-${seloApontamento.id_selo}`, codigo: seloApontamento.id_selo }] } : prev.apontamento,
                        intimacao: seloIntimacao ? { ...prev.intimacao!, selosIntimacao: [...(prev.intimacao?.selosIntimacao || []), { numeroselo: `PAGO-${seloIntimacao.id_selo}`, codigo: seloIntimacao.id_selo }] } : prev.intimacao,
                        protesto: seloProtesto ? { ...prev.protesto!, selosProtesto: [...(prev.protesto?.selosProtesto || []), { numeroselo: `PAGO-${seloProtesto.id_selo}`, codigo: seloProtesto.id_selo }] } : prev.protesto,
                        // Cria a seção de cancelamento com seu selo
                        cancelamento: {
                            data: new Date(),
                            motivo: 'Anuência do Credor',
                            selosCancelamento: { numeroselo: `GERADO-${seloCancelamento.id_selo}`, codigo: seloCancelamento.id_selo }
                        },
                        historico: [...(prev.historico || []), criarRegistroHistorico('Protesto cancelado com quitação de custas posteriores.')]
                    }));

                } else {
                    // Caso simples: Lógica original para pagamento comum
                    const seloInfo = calculoCancelamento.selo;
                    setTitulo(prev => ({
                        ...prev,
                        status: 'Cancelado',
                        cancelamento: {
                            data: new Date(),
                            motivo: 'Anuência do Credor',
                            selosCancelamento: { numeroselo: `GERADO-${seloInfo.id_selo}`, codigo: seloInfo.id_selo }
                        },
                        historico: [...(prev.historico || []), criarRegistroHistorico('Protesto do título foi cancelado.')]
                    }));
                }

                setActiveTab('cancelamento');
                toast.info("Protesto cancelado com sucesso!");
                break;
            }
        }
        
        // Fecha o modal após a ação
        setConfirmationModal(initialModalState);
    };

    if (!titulo) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Carregando dados do título...</p>
            </div>
        );
    }

    return (
        <>
            <div className="bg-gray-50 font-sans">
                <header className="rounded-xl mb-6">
                    <div className="flex justify-between items-center">
                        <div className='flex items-center'>
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800"
                            >
                                <ChevronLeft size={30} />
                            </button>
                            <h1 className="text-2xl font-bold text-gray-800">Título {titulo.protocolo}</h1>
                            <div className='ml-4'>
                                <StatusBadge status={titulo.status} />
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsHistoryModalOpen(true)}
                            className="flex items-center gap-2 bg-white text-gray-600 font-semibold px-4 py-2 rounded-lg border border-gray-300 shadow-sm hover:bg-gray-100 transition-colors"
                        >
                            <History className="h-5 w-5" />
                            Visualizar Histórico
                        </button>
                    </div>
                </header>

                <div className="space-y-6">
                    <div className="space-y-6">
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-6 overflow-x-auto">
                                {visibleTabs.map(tab => (
                                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'} whitespace-nowrap py-3 px-1 border-b-2 font-medium flex items-center gap-2`}>
                                        <tab.icon size={18} /> {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border">
                            {activeTab === 'dadosTitulo' && <TabDadosTitulo titulo={titulo} setTitulo={setTitulo} calculoCustas={calculoCustas} isCostVisible={isCostVisible} setIsCostVisible={setIsCostVisible}/>}
                            {activeTab === 'apresentante' && <TabApresentante setTitulo={setTitulo} titulo={titulo} />}
                            {activeTab === 'devedores' && (<TabDevedores titulo={titulo} onAddDevedor={handleAddDevedor} onRemoveDevedor={handleRemoveDevedor} onDevedorChange={handleDevedorChange} />)}
                            {activeTab === 'cedente' && titulo.cedente && <TabCedente titulo={titulo} setTitulo={setTitulo} />}
                            {activeTab === 'apontamento' && <TabApontamento titulo={titulo} setTitulo={setTitulo} onIntimar={handleIntimar} />}
                            {activeTab === 'intimacao' && <TabIntimacao titulo={titulo} setTitulo={setTitulo} onLiquidar={handleLiquidar} onProtestar={handleProtestar} />}
                            {activeTab === 'liquidacao' && <TabLiquidacao titulo={titulo} setTitulo={setTitulo} />}
                            {activeTab === 'protesto' && <TabProtesto titulo={titulo} setTitulo={setTitulo} onCancelar={handleCancelar} />}
                            {activeTab === 'cancelamento' && <TabCancelamento titulo={titulo} setTitulo={setTitulo} />}
                        </div>
                    </div>
                </div>
            </div>

            <footer className="mt-8 pt-6 border-t flex justify-end items-center gap-3">
                <button className="flex items-center gap-2 bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300">
                    <XCircle size={18} /> Cancelar
                </button>
                <button className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700">
                    <Save size={18} /> Salvar Alterações
                </button>
            </footer>

            <ConfirmacaoSeloModal
                isOpen={confirmationModal.isOpen}
                onClose={() => setConfirmationModal(initialModalState)}
                onConfirm={executeConfirmedAction}
                parsedData={confirmationModal.data}
                emolumentos={tabelaEmolumentos}
                title={confirmationModal.title}
            />

            <HistoricoModal
                isOpen={isHistoryModalOpen}
                onClose={() => setIsHistoryModalOpen(false)}
                historico={titulo.historico || []}
            />
        </>
    );
}