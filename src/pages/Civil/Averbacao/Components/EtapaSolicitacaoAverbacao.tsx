import React, { useState } from 'react';
import { BookOpen, ArrowLeft, FileSignature, HelpCircle } from 'lucide-react';
import { averbacaoPorAto } from '../../lib/Constants';
import BuscaAtoCertidao from './BuscaAtoCertidao';
import SeletorRequerente from './SeletorRequerente';
import { toast } from 'react-toastify';
import { type ProcessoAverbacaoState } from '../EmissaoAverbacao';
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
    const [modalInfo, setModalInfo] = useState<ModalInfoState>({ isOpen: false, title: '', content: null });

    // --- Lógica e Handlers (Inalterados) ---
    const handleOpenHelpModal = () => {
        let infoKey: InfoKey | undefined;
        switch (dadosAverbacao.tipoAverbacao) {
            case '21': infoKey = 'infoInterdicao'; break;
            case '24': infoKey = 'infoUniaoEstavel'; break;
            default:
                toast.info("Não há informações de ajuda para este tipo de averbação.");
                return;
        }
        if (infoKey) {
            const info = InfoContents[infoKey];
            if (info) {
                setModalInfo({ isOpen: true, title: info.title, content: info.content });
            }
        }
    };

    const handleProcessoChange = (secao: 'requerente' | 'dadosAverbacao', field: string, value: any) => {
        setProcesso(prev => {
            if (field === 'tipoAverbacao') {
                return { ...prev, dadosAverbacao: { tipoAverbacao: value } };
            }
            return { ...prev, [secao]: { ...prev[secao], [field]: value } };
        });
    };

    const handleRequerenteChange = (field: string, value: any) => {
        setProcesso((prev: any) => {
            if (field === 'tipo') {
                return { ...prev, requerente: { tipo: value } };
            }
            return { ...prev, requerente: { ...prev.requerente, [field]: value } };
        });
    };

    const handleDesistirClick = () => {
        if (window.confirm("Tem certeza que deseja desistir do processo de averbação? Todo o progresso será perdido.")) {
            onDesistir();
        }
    };
    
    // ALTERADO: Adicionada classe de foco nos inputs dos campos dinâmicos.
    const commonInputClass = "mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm";

    const RenderCamposAverbacao = () => {
        switch (dadosAverbacao.tipoAverbacao) {
            case '8': // Averbação de Divórcio
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Data da Sentença</label>
                            <input type="date" value={dadosAverbacao.dataSentenca || ''} onChange={(e) => handleProcessoChange('dadosAverbacao', 'dataSentenca', e.target.value)} className={commonInputClass} />
                        </div>
                    </>
                );

            case '1': // Averbação de Reconhecimento de Paternidade
                return (
                    <>
                        <div className="md:col-span-1"><label className="block text-sm font-medium text-gray-700">Nome Completo do Pai</label><input type="text" value={dadosAverbacao.nomeNovoPai || ''} onChange={(e) => handleProcessoChange('dadosAverbacao', 'nomeNovoPai', e.target.value)} className={commonInputClass} /></div>
                        <div className="md:col-span-1"><label className="block text-sm font-medium text-gray-700">Avós Paternos</label><input type="text" value={dadosAverbacao.avosPaternos || ''} onChange={(e) => handleProcessoChange('dadosAverbacao', 'avosPaternos', e.target.value)} className={commonInputClass} placeholder="Separados por ;" /></div>
                        <div className="md:col-span-1"><label className="block text-sm font-medium text-gray-700">Novo Nome Completo do(a) Registrado(a)</label><input type="text" value={dadosAverbacao.nomeNovo || ''} onChange={(e) => handleProcessoChange('dadosAverbacao', 'nomeNovo', e.target.value)} className={commonInputClass} /></div>
                        <div><label className="block text-sm font-medium text-gray-700">Instrumento de Reconhecimento</label><input type="text" value={dadosAverbacao.instrumento || ''} onChange={(e) => handleProcessoChange('dadosAverbacao', 'instrumento', e.target.value)} className={commonInputClass} placeholder="Ex: Escritura Pública..." /></div>
                    </>
                );

            case '3': // Averbação de Retificação de Registro
                return (
                    <>
                        <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700">Campo a ser corrigido</label><input type="text" value={dadosAverbacao.campoCorrigido || ''} onChange={(e) => handleProcessoChange('dadosAverbacao', 'campoCorrigido', e.target.value)} className={commonInputClass} placeholder="Ex: o nome da mãe" /></div>
                        <div><label className="block text-sm font-medium text-gray-700">Dado Incorreto</label><input type="text" value={dadosAverbacao.dadoIncorreto || ''} onChange={(e) => handleProcessoChange('dadosAverbacao', 'dadoIncorreto', e.target.value)} className={commonInputClass} /></div>
                        <div><label className="block text-sm font-medium text-gray-700">Dado Correto</label><input type="text" value={dadosAverbacao.dadoCorreto || ''} onChange={(e) => handleProcessoChange('dadosAverbacao', 'dadoCorreto', e.target.value)} className={commonInputClass} /></div>
                        <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700">Motivo/Fundamento</label><input type="text" value={dadosAverbacao.motivoRetificacao || ''} onChange={(e) => handleProcessoChange('dadosAverbacao', 'motivoRetificacao', e.target.value)} className={commonInputClass} placeholder="Ex: Despacho judicial de..." /></div>
                    </>
                );

            default:
                return <p className="text-sm text-gray-500 md:col-span-3">Selecione um tipo de averbação para ver os campos necessários.</p>;
        }
    };

    return (
        <>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-8">
                {/* ALTERADO: Cor do título da etapa */}
                <h2 className="text-xl font-semibold text-[#4a4e51] border-b pb-4">Etapa 1: Solicitação da Averbação</h2>

                <BuscaAtoCertidao onSearch={handleSearch} isSearching={isSearching} />

                {atoEncontrado && (
                    <div className="space-y-6 animate-fade-in">
                        {/* ALTERADO: Estilo do box de informação do ato encontrado */}
                        <div className="p-4 bg-[#dd6825]/10 border border-[#dd6825]/30 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="text-sm text-[#c25a1f]">Ato a ser averbado:</p>
                                <p className="font-semibold text-[#dd6825]">{atoEncontrado.nomePrincipal} ({atoEncontrado.tipoAto})</p>
                            </div>
                            <button type="button" onClick={onRevisarAto} className="flex items-center gap-2 text-sm bg-white border border-[#dd6825]/50 text-[#dd6825] px-3 py-1.5 rounded-md hover:bg-[#dd6825]/10 transition-colors">
                                <BookOpen size={16} /> Revisar Ato Completo
                            </button>
                        </div>

                        <SeletorRequerente requerente={requerente} onRequerenteChange={handleRequerenteChange} />

                        <div className="p-4 rounded-lg border border-gray-300">
                            <div className="flex items-center gap-2 mb-3">
                                <h4 className="font-semibold text-gray-700">3. Dados da Averbação</h4>
                                {dadosAverbacao.tipoAverbacao && (
                                    // ALTERADO: Cor do botão de ajuda
                                    <button onClick={handleOpenHelpModal} className="text-[#dd6825] hover:text-[#c25a1f]">
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
                                        className={commonInputClass}
                                    >
                                        <option value="">Selecione...</option>
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

                        <div className="flex gap-4 text-right pt-4 justify-between">
                            <button type="button" onClick={handleDesistirClick} className="flex items-center gap-2 bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                                <ArrowLeft size={16} /> Desistir
                            </button>
                            {/* ALTERADO: Cor do botão de ação principal */}
                            <button onClick={onConcluir} className="flex items-center gap-2 bg-[#dd6825] text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-[#c25a1f] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dd6825]">
                                <FileSignature size={18} /> Gerar Termo e Avançar
                            </button>
                        </div>
                    </div>
                )}
            </div>

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