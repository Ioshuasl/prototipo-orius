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

    const handleConfiguracaoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = parseInt(e.target.value, 10);

        setPedido((prev: any) => ({
            ...prev,
            configuracao: {
                ...prev.configuracao,
                tipoCertidao: selectedId,
            }
        }));
    };

    const handleVoltarClick = () => {
        const confirmar = window.confirm("Tem certeza que deseja desistir da emissão desta certidão? Todo o progresso será perdido.");

        if (confirmar) {
            onDesistir();
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-8">
            <h2 className="text-xl font-semibold text-blue-700 border-b pb-4">Etapa 1: Solicitação</h2>

            <BuscaAtoCertidao onSearch={handleSearch} isSearching={isSearching} />

            {atoEncontrado && (
                <div className="space-y-6 animate-fade-in">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="text-sm text-blue-800">Ato Encontrado:</p>
                            <p className="font-semibold text-blue-900">{atoEncontrado.nomePrincipal} ({atoEncontrado.tipoAto})</p>
                        </div>
                        <button
                            type="button"
                            onClick={onRevisarAto}
                            className="flex items-center gap-2 text-sm bg-white border border-blue-300 text-blue-700 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors"
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
                                <select
                                    value={configuracao.tipoCertidao}
                                    onChange={handleConfiguracaoChange}
                                    className="mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm"
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

                    <div className="flex gap-4 text-right pt-4 justify-end">
                        <button
                            type="button"
                            onClick={handleVoltarClick}
                            className="flex items-center gap-2 bg-red-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-red-700 transition-colors"
                        >
                            <ArrowLeft size={16} />
                            Voltar
                        </button>
                        <button
                            onClick={onConcluir}
                            className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                        >
                            Concluir Solicitação
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}