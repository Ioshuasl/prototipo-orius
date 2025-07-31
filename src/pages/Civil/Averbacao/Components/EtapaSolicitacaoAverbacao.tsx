import React, { useState } from 'react';
import { BookOpen, ArrowLeft, FileSignature, HelpCircle } from 'lucide-react';
import { averbacaoPorAto } from '../../lib/Constants';
import BuscaAtoCertidao from './BuscaAtoCertidao';
import SeletorRequerente from './SeletorRequerente';
import { toast } from 'react-toastify';
import { type ProcessoAverbacaoState } from '../EmissaoAverbacao'; // Importando o tipo do orquestrador
import InfoModal from '../../Components/InfoModal';
import * as InfoContents from '../../lib/contextualInfo';

type InfoKey = keyof typeof InfoContents;

interface ModalInfoState {
    isOpen: boolean;
    title: string;
    content: React.ReactNode | null;
}

interface EtapaSolicitacaoAverbacaoProps {
    processo: ProcessoAverbacaoState;
    setProcesso: React.Dispatch<React.SetStateAction<ProcessoAverbacaoState>>;
    onConcluir: () => void;
    onRevisarAto: () => void;
    isSearching: boolean;
    handleSearch: (criteria: { tipo: 'protocolo' | 'termo' | 'livroFolha', valor?: string, livro?: string, folha?: string }) => void;
    onDesistir: () => void;
}

export default function EtapaSolicitacaoAverbacao({ processo, setProcesso, onConcluir, onRevisarAto, isSearching, handleSearch, onDesistir }: EtapaSolicitacaoAverbacaoProps) {
    const { atoEncontrado, requerente, dadosAverbacao } = processo;
    const [modalInfo, setModalInfo] = useState<ModalInfoState>({
        isOpen: false,
        title: '',
        content: null,
    });

    const handleOpenHelpModal = () => {
        let infoKey: InfoKey | undefined;
        // Mapeia o ID da averbação para a chave do objeto de informação
        switch (dadosAverbacao.tipoAverbacao) {
            case '21': // ID de Cancelamento de Interdição
                infoKey = 'infoInterdicao';
                break;
            case '24': // ID de Dissolução de União Estável
                infoKey = 'infoUniaoEstavel';
                break;
            // Adicione outros mapeamentos aqui conforme necessário
            default:
                toast.info("Não há informações de ajuda para este tipo de averbação.");
                return;
        }

        if (infoKey) {
            const info = InfoContents[infoKey]; // Agora esta linha funciona sem erros!
            if (info) {
                setModalInfo({ isOpen: true, title: info.title, content: info.content });
            }
        }
    };

    // Handler para atualizar qualquer campo do processo
    const handleProcessoChange = (secao: 'requerente' | 'dadosAverbacao', field: string, value: any) => {
        setProcesso(prev => {
            // Limpa os dados específicos se o tipo de averbação mudar
            if (field === 'tipoAverbacao') {
                return {
                    ...prev,
                    dadosAverbacao: { tipoAverbacao: value }
                };
            }
            return {
                ...prev,
                [secao]: {
                    ...prev[secao],
                    [field]: value,
                }
            };
        });
    };

    const handleRequerenteChange = (field: string, value: any) => {
        setProcesso((prev: any) => {

            if (field === 'tipo') {
                return {
                    ...prev,
                    requerente: { tipo: value }
                };
            }
            return {
                ...prev,
                requerente: {
                    ...prev.requerente,
                    [field]: value,
                }
            };
        });
    };

    const handleDesistirClick = () => {
        if (window.confirm("Tem certeza que deseja desistir do processo de averbação? Todo o progresso será perdido.")) {
            onDesistir();
        }
    };


    const RenderCamposAverbacao = () => {
        // O switch agora usa os IDs numéricos (como strings)
        switch (dadosAverbacao.tipoAverbacao) {
            case '8': // Averbação de Divórcio
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Data da Sentença</label>
                            <input type="date" value={dadosAverbacao.dataSentenca || ''} onChange={(e) => handleProcessoChange('dadosAverbacao', 'dataSentenca', e.target.value)} className="mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm" />
                        </div>
                        {/* ... outros campos de divórcio ... */}
                    </>
                );

            case '1': // Averbação de Reconhecimento de Paternidade
                return (
                    <>
                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700">Nome Completo do Pai</label>
                            <input type="text" value={dadosAverbacao.nomeNovoPai || ''} onChange={(e) => handleProcessoChange('dadosAverbacao', 'nomeNovoPai', e.target.value)} className="mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm" />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700">Avós Paternos (separados por ponto e vírgula)</label>
                            <input type="text" value={dadosAverbacao.avosPaternos || ''} onChange={(e) => handleProcessoChange('dadosAverbacao', 'avosPaternos', e.target.value)} className="mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm" />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700">Novo Nome Completo do(a) Registrado(a)</label>
                            <input type="text" value={dadosAverbacao.nomeNovo || ''} onChange={(e) => handleProcessoChange('dadosAverbacao', 'nomeNovo', e.target.value)} className="mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Instrumento de Reconhecimento</label>
                            <input type="text" value={dadosAverbacao.instrumento || ''} onChange={(e) => handleProcessoChange('dadosAverbacao', 'instrumento', e.target.value)} className="mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm" placeholder="Ex: Escritura Pública..." />
                        </div>
                    </>
                );

            case '3': // Averbação de Retificação de Registro
                return (
                    <>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Campo a ser corrigido</label>
                            <input type="text" value={dadosAverbacao.campoCorrigido || ''} onChange={(e) => handleProcessoChange('dadosAverbacao', 'campoCorrigido', e.target.value)} className="mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm" placeholder="Ex: o nome da mãe" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Dado Incorreto (como está no registro)</label>
                            <input type="text" value={dadosAverbacao.dadoIncorreto || ''} onChange={(e) => handleProcessoChange('dadosAverbacao', 'dadoIncorreto', e.target.value)} className="mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Dado Correto (como deve ser)</label>
                            <input type="text" value={dadosAverbacao.dadoCorreto || ''} onChange={(e) => handleProcessoChange('dadosAverbacao', 'dadoCorreto', e.target.value)} className="mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Motivo/Fundamento da Retificação</label>
                            <input type="text" value={dadosAverbacao.motivoRetificacao || ''} onChange={(e) => handleProcessoChange('dadosAverbacao', 'motivoRetificacao', e.target.value)} className="mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm" placeholder="Ex: Despacho judicial de..." />
                        </div>
                    </>
                );

            default:
                return <p className="text-sm text-gray-500 md:col-span-3">Selecione um tipo de averbação para ver os campos necessários.</p>;
        }
    };

    return (
        <>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-8">
                <h2 className="text-xl font-semibold text-blue-700 border-b pb-4">Etapa 1: Solicitação da Averbação</h2>

                {/* Componente reutilizado para buscar o ato */}
                <BuscaAtoCertidao onSearch={handleSearch} isSearching={isSearching} />

                {atoEncontrado && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="text-sm text-blue-800">Ato a ser averbado:</p>
                                <p className="font-semibold text-blue-900">{atoEncontrado.nomePrincipal} ({atoEncontrado.tipoAto})</p>
                            </div>
                            <button type="button" onClick={onRevisarAto} className="flex items-center gap-2 text-sm bg-white border border-blue-300 text-blue-700 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors">
                                <BookOpen size={16} /> Revisar Ato Completo
                            </button>
                        </div>

                        {/* Componente reutilizado para os dados do requerente */}
                        <SeletorRequerente requerente={requerente} onRequerenteChange={handleRequerenteChange} />

                        {/* Nova seção para os dados da averbação */}
                        <div className="p-4 bg-gray-50 rounded-lg border">
                            <div className="flex items-center gap-2 mb-3">
                                <h4 className="font-semibold text-gray-700">3. Dados da Averbação</h4>
                                {/* BOTÃO DE AJUDA - visível apenas quando um tipo é selecionado */}
                                {dadosAverbacao.tipoAverbacao && (
                                    <button onClick={handleOpenHelpModal} className="text-blue-500 hover:text-blue-700">
                                        <HelpCircle size={16} />
                                    </button>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tipo de Ato</label>
                                    <input
                                        type="text"
                                        readOnly
                                        value={atoEncontrado.tipoAto || ''}
                                        className="mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm bg-gray-100 cursor-not-allowed"
                                    />
                                </div>
                                <div className="md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700">Tipo de Averbação</label>
                                    <select
                                        value={dadosAverbacao.tipoAverbacao}
                                        onChange={(e) => handleProcessoChange('dadosAverbacao', 'tipoAverbacao', e.target.value)}
                                        className="mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm"
                                    >
                                        <option value="">Selecione...</option>
                                        {/* usamos o 'id' como o valor da opção */}
                                        {averbacaoPorAto[atoEncontrado.tipoAto]?.map(option => (
                                            <option key={option.id} value={option.id}>
                                                {option.titulo_servico}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <RenderCamposAverbacao />
                            </div>
                        </div>

                        <div className="flex gap-4 text-right pt-4 border-t justify-between">
                            <button type="button" onClick={handleDesistirClick} className="flex items-center gap-2 bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                                <ArrowLeft size={16} /> Desistir
                            </button>
                            <button onClick={onConcluir} className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors">
                                <FileSignature size={18} /> Gerar Termo e Avançar
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Renderização do Modal de Ajuda */}
            <InfoModal
                isOpen={modalInfo.isOpen}
                onClose={() => setModalInfo({ ...modalInfo, isOpen: false })}
                title={modalInfo.title}
            >
                {modalInfo.content}
            </InfoModal>
        </>
    );
}