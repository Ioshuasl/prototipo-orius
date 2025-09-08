import React, { useState, useEffect, useMemo } from 'react';
import { FileText, Users, User, UserCheck, Save, XCircle, Flag, Mail, Gavel, BadgeX, HandCoins, History, ChevronLeft } from 'lucide-react';
import { type IEndereco, type IPessoaFisica, type ITituloProtesto, type TPessoaTipo, type StatusTitulo } from '../types';
import { calcularAtoCompletoProtesto, type IResultadoCalculoCompleto } from '../../Functions/calculoCustas';
import { mockTitulosProtesto } from '../lib/Constants';
import HistoricoModal from '../../Components/HistoricoModal';
import { useNavigate, Link } from 'react-router-dom';
import TabDadosTitulo from './tabs/DadosTitulo';
import TabApontamento from './tabs/TabApontamento';
import TabApresentante from './tabs/TabApresentante';
import TabCedente from './tabs/TabCedente';
import TabDevedores from './tabs/TabDevedores';
import TabIntimacao from './tabs/TabIntimacao';
import TabLiquidacao from './tabs/TabLiquidacao';
import TabProtesto from './tabs/TabProtesto';
import TabCancelamento from './tabs/TabCancelamento';

const initialEnderecoState: IEndereco = { cep: '', tipoLogradouro: '', logradouro: '', numero: '', complemento: '', bairro: '', cidade: '', uf: '' };
const initialPersonState: IPessoaFisica = { tipo: 'fisica', nome: '', cpf: '', endereco: initialEnderecoState, dataNascimento: '1990-01-01', docIdentidadeNum: '123', docIdentidadeTipo: 'RG', nacionalidade: 'Brasileira', naturalidadeCidade: 'Goiânia', naturalidadeUF: 'GO', profissao: '' };


export default function DetalhesTituloProtestoPage() {
    const [titulo, setTitulo] = useState<ITituloProtesto>(mockTitulosProtesto[0]);
    const [activeTab, setActiveTab] = useState('dadosTitulo');
    const [calculoCustas, setCalculoCustas] = useState<IResultadoCalculoCompleto | null>(null);
    const [isCostVisible, setIsCostVisible] = useState(true);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const navigate = useNavigate(); // Adicione esta linha

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
        if (titulo.valor > 0 && titulo.devedores.length > 0) {
            const resultado = calcularAtoCompletoProtesto(titulo);
            setCalculoCustas(resultado);
        }
    }, [titulo.valor, titulo.tipoPagamento, titulo.devedores]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setTitulo(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleDevedorChange = (index: number, novosDados: Partial<TPessoaTipo>) => {
        setTitulo(prev => {
            const devedoresAtualizados = [...prev.devedores];
            devedoresAtualizados[index] = novosDados as TPessoaTipo;
            return { ...prev, devedores: devedoresAtualizados };
        });
    };

    const handleAddDevedor = () => {
        console.log('clicando no botão de adicionar devedor')
        setTitulo(prev => ({ ...prev, devedores: [...prev.devedores, { tipo: 'fisica', nome: '', cpf: '', endereco: {} } as IPessoaFisica] }));
    };

    const handleRemoveDevedor = (indexToRemove: number) => {
        console.log('clicando no botão de remover devedor')
        if (titulo.devedores.length <= 1) {
            alert("É necessário manter pelo menos um devedor.");
            return;
        }
        setTitulo(prev => ({ ...prev, devedores: prev.devedores.filter((_, index) => index !== indexToRemove) }));
    };

    const BlocoResultado = ({ titulo, dados }: { titulo: string; dados: IResultadoCalculoCompleto['cobrancaInicial'] }) => (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-blue-800">{titulo}</h2>
            {Object.entries(dados.detalhes).map(([ato, detalhe]) => detalhe && (
                <div key={ato} className="bg-gray-50 p-3 rounded-lg border">
                    <h3 className="font-bold text-gray-700 capitalize mb-2">{ato}</h3>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                            <p className="text-sm text-gray-500">ID Selo</p>
                            <p className="font-mono font-semibold text-base">{detalhe.selo.id_selo}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Emolumentos</p>
                            <p className="font-semibold text-base">R$ {detalhe.valorEmolumento.toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Taxas</p>
                            <p className="font-semibold text-base">R$ {detalhe.valorTaxaJudiciaria.toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Subtotal</p>
                            <p className="font-bold text-lg">R$ {detalhe.valorTotal.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            ))}
            <div className="bg-blue-100 p-4 rounded-lg border border-blue-300 grid grid-cols-3 gap-4 text-center">
                <div>
                    <p className="text-sm text-blue-800">Total Emolumentos</p>
                    <p className="text-2xl font-bold text-blue-900">R$ {dados.resumo.totalEmolumentos.toFixed(2)}</p>
                </div>
                <div>
                    <p className="text-sm text-blue-800">Total Taxas</p>
                    <p className="text-2xl font-bold text-blue-900">R$ {dados.resumo.totalTaxas.toFixed(2)}</p>
                </div>
                <div className="border-l-2 border-blue-300">
                    <p className="text-sm font-semibold text-blue-800">VALOR TOTAL</p>
                    <p className="text-3xl font-bold text-blue-900">R$ {dados.resumo.valorTotalAto.toFixed(2)}</p>
                </div>
            </div>
        </div>
    );

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
        };
        return <span className={`px-3 py-1 text-sm font-bold rounded-full border ${styles[status] || 'bg-gray-100'}`}>{status}</span>;
    };

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
                            {activeTab === 'dadosTitulo' && <TabDadosTitulo titulo={titulo} setTitulo={setTitulo} calculoCustas={calculoCustas} isCostVisible={isCostVisible} setIsCostVisible={setIsCostVisible} BlocoResultado={BlocoResultado} />}
                            {activeTab === 'apresentante' && <TabApresentante setTitulo={setTitulo} titulo={titulo} />}
                            {activeTab === 'devedores' && ( <TabDevedores titulo={titulo} onAddDevedor={handleAddDevedor} onRemoveDevedor={handleRemoveDevedor} onDevedorChange={handleDevedorChange} />)}
                            {activeTab === 'cedente' && titulo.cedente && <TabCedente titulo={titulo} setTitulo={setTitulo} />}
                            {activeTab === 'apontamento' && <TabApontamento titulo={titulo} setTitulo={setTitulo} />}
                            {activeTab === 'intimacao' && <TabIntimacao titulo={titulo} setTitulo={setTitulo} />}
                            {activeTab === 'liquidacao' && <TabLiquidacao titulo={titulo} setTitulo={setTitulo} />}
                            {activeTab === 'protesto' && <TabProtesto titulo={titulo} setTitulo={setTitulo} />}
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

            <HistoricoModal
                isOpen={isHistoryModalOpen}
                onClose={() => setIsHistoryModalOpen(false)}
                historico={titulo.historico || []}
            />
        </>
    );
}