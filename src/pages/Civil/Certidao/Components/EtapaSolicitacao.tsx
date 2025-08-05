import React from 'react';
import { BookOpen, ArrowLeft } from 'lucide-react';
import { certidaoPorAto } from '../../lib/Constants';
import BuscaAtoCertidao from './BuscaAtoCertidao';
import SeletorRequerente from './SeletorRequerente';

interface EtapaSolicitacaoProps {
    pedido: any;
    setPedido: React.Dispatch<React.SetStateAction<any>>;
    onConcluir: () => void;
    onRevisarAto: () => void;
    isSearching: boolean;
    handleSearch: (criteria: { tipo: 'protocolo' | 'termo' | 'livroFolha', valor?: string, livro?: string, folha?: string }) => void;
    onDesistir: () => void;
}

export default function EtapaSolicitacao({ pedido, setPedido, onConcluir, onRevisarAto, isSearching, handleSearch, onDesistir }: EtapaSolicitacaoProps) {
    const { atoEncontrado, requerente, configuracao } = pedido;

    const handleRequerenteChange = (field: string, value: any) => {
        setPedido((prev: any) => {
            if (field === 'tipo') {
                return { ...prev, requerente: { tipo: value } };
            }
            return { ...prev, requerente: { ...prev.requerente, [field]: value } };
        });
    };

    const handleConfiguracaoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = parseInt(e.target.value, 10);
        setPedido((prev: any) => ({
            ...prev,
            configuracao: { ...prev.configuracao, tipoCertidao: selectedId }
        }));
    };

    const handleVoltarClick = () => {
        if (window.confirm("Tem certeza que deseja desistir da emissão desta certidão? Todo o progresso será perdido.")) {
            onDesistir();
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-8">
            {/* ALTERADO: Cor do título da etapa */}
            <h2 className="text-xl font-semibold text-[#4a4e51] border-b pb-4">Etapa 1: Solicitação</h2>

            <BuscaAtoCertidao onSearch={handleSearch} isSearching={isSearching} />

            {atoEncontrado && (
                <div className="space-y-6 animate-fade-in">
                    {/* ALTERADO: Estilo do box de informação do ato encontrado */}
                    <div className="p-4 bg-[#dd6825]/10 border border-[#dd6825]/30 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="text-sm text-[#c25a1f]">Ato Encontrado:</p>
                            <p className="font-semibold text-[#dd6825]">{atoEncontrado.nomePrincipal} ({atoEncontrado.tipoAto})</p>
                        </div>
                        <button
                            type="button"
                            onClick={onRevisarAto}
                            className="flex items-center gap-2 text-sm bg-white border border-[#dd6825]/50 text-[#dd6825] px-3 py-1.5 rounded-md hover:bg-[#dd6825]/10 transition-colors"
                        >
                            <BookOpen size={16} />
                            Revisar Ato Completo
                        </button>
                    </div>

                    <SeletorRequerente requerente={requerente} onRequerenteChange={handleRequerenteChange} />

                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-300">
                        <h4 className="font-semibold text-gray-700 mb-3">3. Configuração da Certidão</h4>
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
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tipo de Certidão</label>
                                {/* ALTERADO: Estilo de foco do select */}
                                <select
                                    value={configuracao.tipoCertidao}
                                    onChange={handleConfiguracaoChange}
                                    className="mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]"
                                    disabled={!atoEncontrado.tipoAto}
                                >
                                    <option value="">Selecione...</option>
                                    {certidaoPorAto[atoEncontrado.tipoAto]?.map(option => (
                                        <option key={option.id} value={option.id}>
                                            {option.titulo_servico}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 text-right pt-4 justify-between">
                        <button
                            type="button"
                            onClick={handleVoltarClick}
                            className="flex items-center gap-2 bg-gray-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-gray-700 transition-colors"
                        >
                            <ArrowLeft size={16} />
                            Desistir
                        </button>
                        {/* ALTERADO: Cor do botão de ação principal */}
                        <button
                            onClick={onConcluir}
                            className="bg-[#dd6825] text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-[#c25a1f] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dd6825]"
                        >
                            Concluir Solicitação
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}