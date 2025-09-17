// Local: src/Components/BlocoResultado.tsx (ou onde seus componentes ficam)

import React, { useState } from 'react';
import { type IResultadoCalculoCompleto } from '../Functions/calculoCustas'; // Ajuste o caminho para seus tipos
import { HandCoins, BadgeX, XCircle } from 'lucide-react';

interface BlocoResultadoProps {
    calculo: IResultadoCalculoCompleto | null;
}

export default function BlocoResultado({ calculo }: BlocoResultadoProps) {
    const [simulacaoAtiva, setSimulacaoAtiva] = useState<'liquidacao' | 'cancelamento' | null>(null);

    if (!calculo) {
        return <p className="text-gray-500 text-center py-4">Aguardando dados para calcular...</p>;
    }

    const dadosIniciais = calculo.cobrancaInicial;
    const dadosFinais = calculo.cobrancaFinal;

    const simulacaoData = simulacaoAtiva === 'liquidacao'
        ? calculo.liquidacao
        : simulacaoAtiva === 'cancelamento'
        ? calculo.cancelamento
        : null;

    return (
        <div className="space-y-4 animate-fade-in">
            <p className="font-semibold bg-blue-50 text-blue-700 text-center px-2 py-1 rounded-full text-sm">{calculo.regraPrincipal}</p>

            {/* Seção de Custas Iniciais */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-blue-800">Custas Iniciais</h2>
                {Object.entries(dadosIniciais.detalhes).map(([ato, detalhe]) => detalhe && (
                    <div key={ato} className="bg-gray-50 p-3 rounded-lg border">
                        <h3 className="font-bold text-gray-700 capitalize mb-2">{ato}</h3>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                            <div><p className="text-sm text-gray-500">ID Selo</p><p className="font-mono font-semibold text-base">{detalhe.selo.id_selo}</p></div>
                            <div><p className="text-sm text-gray-500">Emolumentos</p><p className="font-semibold text-base">R$ {detalhe.valorEmolumento.toFixed(2)}</p></div>
                            <div><p className="text-sm text-gray-500">Taxas</p><p className="font-semibold text-base">R$ {detalhe.valorTaxaJudiciaria.toFixed(2)}</p></div>
                            <div><p className="text-sm text-gray-500">Subtotal</p><p className="font-bold text-lg">R$ {detalhe.valorTotal.toFixed(2)}</p></div>
                        </div>
                    </div>
                ))}
                <div className="bg-blue-100 p-4 rounded-lg border border-blue-300 grid grid-cols-3 gap-4 text-center">
                    <div><p className="text-sm text-blue-800">Total Emolumentos</p><p className="text-2xl font-bold text-blue-900">R$ {dadosIniciais.resumo.totalEmolumentos.toFixed(2)}</p></div>
                    <div><p className="text-sm text-blue-800">Total Taxas</p><p className="text-2xl font-bold text-blue-900">R$ {dadosIniciais.resumo.totalTaxas.toFixed(2)}</p></div>
                    <div className="border-l-2 border-blue-300"><p className="text-sm font-semibold text-blue-800">VALOR TOTAL</p><p className="text-3xl font-bold text-blue-900">R$ {dadosIniciais.resumo.valorTotalAto.toFixed(2)}</p></div>
                </div>
            </div>

            {/* Seção de Custas Finais (se aplicável) */}
            {dadosFinais && (
                <div className="border-t-2 border-dashed pt-4 mt-4 space-y-4">
                    <h2 className="text-xl font-bold text-blue-800">Custas Finais (Pag. Posterior)</h2>
                    {Object.entries(dadosFinais.detalhes).map(([ato, detalhe]) => detalhe && (
                        <div key={`final-${ato}`} className="bg-gray-50 p-3 rounded-lg border">
                            <h3 className="font-bold text-gray-700 capitalize mb-2">{ato}</h3>
                            <div className="grid grid-cols-4 gap-4 text-sm">
                                <div><p className="text-sm text-gray-500">ID Selo</p><p className="font-mono font-semibold text-base">{detalhe.selo.id_selo}</p></div>
                                <div><p className="text-sm text-gray-500">Emolumentos</p><p className="font-semibold text-base">R$ {detalhe.valorEmolumento.toFixed(2)}</p></div>
                                <div><p className="text-sm text-gray-500">Taxas</p><p className="font-semibold text-base">R$ {detalhe.valorTaxaJudiciaria.toFixed(2)}</p></div>
                                <div><p className="text-sm text-gray-500">Subtotal</p><p className="font-bold text-lg">R$ {detalhe.valorTotal.toFixed(2)}</p></div>
                            </div>
                        </div>
                    ))}
                    <div className="bg-blue-100 p-4 rounded-lg border border-blue-300 grid grid-cols-3 gap-4 text-center">
                        <div><p className="text-sm text-blue-800">Total Emolumentos</p><p className="text-2xl font-bold text-blue-900">R$ {dadosFinais.resumo.totalEmolumentos.toFixed(2)}</p></div>
                        <div><p className="text-sm text-blue-800">Total Taxas</p><p className="text-2xl font-bold text-blue-900">R$ {dadosFinais.resumo.totalTaxas.toFixed(2)}</p></div>
                        <div className="border-l-2 border-blue-300"><p className="text-sm font-semibold text-blue-800">VALOR TOTAL</p><p className="text-3xl font-bold text-blue-900">R$ {dadosFinais.resumo.valorTotalAto.toFixed(2)}</p></div>
                    </div>
                </div>
            )}

            {/* Seção de Simulação */}
            <div className="border-t-2 border-dashed pt-4 mt-4">
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Simular Custas Futuras</h3>
                <div className="flex items-center gap-3">
                    <button onClick={() => setSimulacaoAtiva('liquidacao')} disabled={!calculo.liquidacao} className="flex-1 flex items-center justify-center gap-2 bg-green-50 text-green-700 font-semibold px-4 py-2 rounded-lg border-2 border-green-200 hover:bg-green-100 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed">
                        <HandCoins size={18} /> Simular Liquidação
                    </button>
                    <button onClick={() => setSimulacaoAtiva('cancelamento')} disabled={!calculo.cancelamento} className="flex-1 flex items-center justify-center gap-2 bg-orange-50 text-orange-700 font-semibold px-4 py-2 rounded-lg border-2 border-orange-200 hover:bg-orange-100 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed">
                        <BadgeX size={18} /> Simular Cancelamento
                    </button>
                </div>
            </div>

            {/* Exibição do Resultado da Simulação */}
            {simulacaoAtiva && simulacaoData && (
                <div className="mt-4 bg-gray-50 p-4 rounded-lg border animate-fade-in">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-gray-700 capitalize">Resultado da Simulação de {simulacaoAtiva}</h3>
                        <button onClick={() => setSimulacaoAtiva(null)} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700">
                            <XCircle size={14} /> Fechar
                        </button>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                        <div><p className="text-sm text-gray-500">ID Selo</p><p className="font-mono font-semibold text-base">{simulacaoData.selo.id_selo}</p></div>
                        <div><p className="text-sm text-gray-500">Emolumentos</p><p className="font-semibold text-base">R$ {simulacaoData.valorEmolumento.toFixed(2)}</p></div>
                        <div><p className="text-sm text-gray-500">Taxas</p><p className="font-semibold text-base">R$ {simulacaoData.valorTaxaJudiciaria.toFixed(2)}</p></div>
                        <div className='border-l-2 pl-4'><p className="text-sm text-gray-500">Total do Ato</p><p className="font-bold text-lg text-blue-700">R$ {simulacaoData.valorTotal.toFixed(2)}</p></div>
                    </div>
                </div>
            )}
        </div>
    );
}