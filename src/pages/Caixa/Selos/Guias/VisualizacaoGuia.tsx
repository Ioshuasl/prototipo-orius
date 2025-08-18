import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, AlertTriangle, Loader2, FileText, CalendarDays, DollarSign, Package, XCircle, Trash2 } from 'lucide-react';

// --- IMPORTAÇÕES E DADOS REUTILIZÁVEIS ---
import { mockSealBatches } from '../../lib/Constants';
import tabelaEmolumentos from '../../../../../tabela-emolumentos.json';

// Interfaces para os dados da guia (usadas para tipar os dados gerados)
interface SeloUtilizado {
    descricao: string;
    quantidade: number;
    dataImportacaoLote: Date;
    valorEmolumentos: number;
    valorTaxaJudiciaria: number;
    valorFundoEstadual: number;
    valorFundoMunicipal: number;
}

interface SeloInutilizado {
    descricao: string;
    numeroSelo: string;
    dataCancelamento: Date;
    valorEmolumento: number;
    valorFundoEstadual: number;
    valorTaxaJudiciaria: number;
}

interface Guia {
    id: number;
    numeroGuia: string;
    decendio: string;
    mes: number;
    ano: number;
    valorTotalGuia: number;
    status: 'Paga' | 'Pendente' | 'Cancelada';
    taxaFuncomp: number;
    taxaFunemp: number;
    valorEmolumentosTotal: number;
    selosUtilizados: SeloUtilizado[];
    selosInutilizados: SeloInutilizado[];
}

const getSealValues = (tipoAtoSelo: number) => {
    const data = tabelaEmolumentos.find(item => item.id_selo === tipoAtoSelo);
    return {
        emolumentos: data?.valor_emolumento || 0,
        taxaJudiciaria: data?.valor_taxa_judiciaria || 0,
    };
};

const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

export default function VisualizacaoGuia() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [guia, setGuia] = useState<Guia | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            const taxaFuncomp = 20;
            const taxaFunemp = 5;

            // Agrega os dados de todos os selos de mockSealBatches
            const processado = mockSealBatches.reduce((acc, batch) => {
                batch.seals.forEach(seal => {
                    const key = `${batch.tipo_ato_selo}-${batch.descricao}`;

                    if (seal.sealSituation === 'Utilizando') {
                        if (!acc.utilizados[key]) {
                            acc.utilizados[key] = {
                                descricao: batch.descricao,
                                quantidade: 0,
                                dataImportacaoLote: batch.dataCompra,
                                valorEmolumentos: 0,
                                valorTaxaJudiciaria: 0,
                                valorFundoEstadual: 0,
                                valorFundoMunicipal: 0,
                            };
                        }
                        acc.utilizados[key].quantidade += 1;
                        acc.utilizados[key].valorEmolumentos += seal.sealValue.emolumentos;
                        acc.utilizados[key].valorTaxaJudiciaria += seal.sealValue.taxaJudiciaria;
                        acc.utilizados[key].valorFundoEstadual += (seal.sealValue.emolumentos * (taxaFuncomp / 100));
                        acc.utilizados[key].valorFundoMunicipal += (seal.sealValue.emolumentos * (taxaFunemp / 100));
                    } else if (seal.sealSituation === 'Cancelado' || seal.sealSituation === 'Redimensionado') {
                        acc.inutilizados.push({
                            descricao: batch.descricao,
                            numeroSelo: seal.sealNumber,
                            dataCancelamento: seal.exportationDate || seal.resizingDate || new Date(),
                            valorEmolumento: seal.sealValue.emolumentos,
                            valorFundoEstadual: seal.sealValue.emolumentos * (taxaFuncomp / 100),
                            valorTaxaJudiciaria: seal.sealValue.taxaJudiciaria,
                        });
                    }
                });
                return acc;
            }, { utilizados: {} as { [key: string]: SeloUtilizado }, inutilizados: [] as SeloInutilizado[] });

            const selosUtilizadosArray = Object.values(processado.utilizados);
            const selosInutilizadosArray = processado.inutilizados;
            const valorEmolumentosTotal = selosUtilizadosArray.reduce((acc, s) => acc + s.valorEmolumentos, 0);
            const valorTotalTaxasEFundos = selosUtilizadosArray.reduce((acc, s) => acc + s.valorTaxaJudiciaria + s.valorFundoEstadual + s.valorFundoMunicipal, 0);
            const valorTotalGuia = valorEmolumentosTotal + valorTotalTaxasEFundos;
            
            // Simulação de duas guias para fins de teste
            const guias: Guia[] = [
                {
                    id: 1, // ID fixo, para demonstrar o uso do useParams
                    numeroGuia: '2025-08-01-GERAL',
                    decendio: '1º Decêndio',
                    mes: 7, // Agosto
                    ano: 2025,
                    valorTotalGuia: valorTotalGuia,
                    status: 'Pendente',
                    taxaFuncomp: taxaFuncomp,
                    taxaFunemp: taxaFunemp,
                    valorEmolumentosTotal: valorEmolumentosTotal,
                    selosUtilizados: selosUtilizadosArray,
                    selosInutilizados: selosInutilizadosArray,
                },
                {
                    id: 2,
                    numeroGuia: '2025-07-03-GERAL',
                    decendio: '3º Decêndio',
                    mes: 6,
                    ano: 2025,
                    valorTotalGuia: 1250.75,
                    status: 'Paga',
                    taxaFuncomp: 20,
                    taxaFunemp: 5,
                    valorEmolumentosTotal: 1000,
                    selosUtilizados: [{
                        descricao: 'Exemplo de Serviço Pago',
                        quantidade: 2,
                        dataImportacaoLote: new Date(2025, 6, 25),
                        valorEmolumentos: 800,
                        valorTaxaJudiciaria: 100,
                        valorFundoEstadual: 100,
                        valorFundoMunicipal: 50,
                    }],
                    selosInutilizados: [],
                }
            ];

            const foundGuia = guias.find(g => g.id.toString() === id);
            setGuia(foundGuia || null);
            setIsLoading(false);
        }, 500);
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Loader2 className="h-10 w-10 text-[#dd6825] animate-spin" />
            </div>
        );
    }

    if (!guia) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-gray-50 min-h-screen">
                <AlertTriangle className="h-16 w-16 text-yellow-500 mb-4" />
                <h1 className="text-3xl font-bold text-gray-800">Guia não encontrada</h1>
                <p className="text-md text-gray-600 mt-2">A guia com o ID "{id}" não foi encontrada. Verifique se o ID está correto.</p>
                <button
                    onClick={() => navigate('/caixa/guias')}
                    className="mt-6 flex items-center gap-2 bg-[#dd6825] text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-[#c25a1f] transition-all duration-300"
                >
                    <ChevronLeft className="h-5 w-5" /> Voltar para Guias
                </button>
            </div>
        );
    }

    const getStatusStyles = (status: Guia['status']) => {
        switch(status) {
            case 'Paga': return 'bg-green-100 text-green-800';
            case 'Pendente': return 'bg-yellow-100 text-yellow-800';
            case 'Cancelada': return 'bg-red-100 text-red-800';
        }
    };

    return (
        <>
            <title>Visualização da Guia #{guia.id}</title>
            <div className="flex bg-gray-50 font-sans p-8">
                <main className="flex-1">
                    <div className="mx-auto space-y-6">
                        <header className="flex items-center justify-between">
                            <button
                                onClick={() => navigate('/caixa/guias')}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <ChevronLeft className="h-5 w-5" />
                                <h1 className="text-3xl font-bold text-[#4a4e51]">Visualização da Guia #{guia.numeroGuia}</h1>
                            </button>
                        </header>

                        {/* SEÇÃO 1: INFORMAÇÕES GERAIS */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
                            <h2 className="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-2">Informações Gerais</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                <div>
                                    <p className="text-xs text-gray-500">Decêndio e Mês</p>
                                    <p className="font-medium text-gray-700">{guia.decendio}, {meses[guia.mes]} de {guia.ano}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Status</p>
                                    <p className={`font-semibold px-2.5 py-1 text-xs rounded-full border inline-block ${getStatusStyles(guia.status)}`}>{guia.status}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Taxa FUNCOMP</p>
                                    <p className="font-medium text-gray-700">{guia.taxaFuncomp.toFixed(2)}%</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Taxa FUNEMP</p>
                                    <p className="font-medium text-gray-700">{guia.taxaFunemp.toFixed(2)}%</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Valor Total em Emolumentos</p>
                                    <p className="font-medium text-gray-700">R$ {guia.valorEmolumentosTotal.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Valor Total da Guia</p>
                                    <p className="font-bold text-lg text-gray-800">R$ {guia.valorTotalGuia.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>

                        {/* SEÇÃO 2: SELOS UTILIZADOS NA GUIA */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-800 p-6 border-b border-gray-200">Lotes de Selos Utilizados</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Descrição do Selo</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Quantidade</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Data de Importação</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Emolumentos (Total)</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Taxa Judiciária (Total)</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Fundo Estadual (Total)</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Fundo Municipal (Total)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {guia.selosUtilizados.length > 0 ? (
                                            guia.selosUtilizados.map((selo, index) => (
                                                <tr key={index}>
                                                    <td className="px-6 py-4 text-sm text-gray-900">{selo.descricao}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{selo.quantidade}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{selo.dataImportacaoLote.toLocaleDateString('pt-BR')}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ {selo.valorEmolumentos.toFixed(2)}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ {selo.valorTaxaJudiciaria.toFixed(2)}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ {selo.valorFundoEstadual.toFixed(2)}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ {selo.valorFundoMunicipal.toFixed(2)}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">Nenhum selo utilizado neste decêndio.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* SEÇÃO 3: SELOS INUTILIZADOS */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-800 p-6 border-b border-gray-200">Selos Inutilizados no Decêndio</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Descrição do Selo</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Número do Selo</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Data do Cancelamento</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Valor Emolumento</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Fundo Estadual</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Taxa Judiciária</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {guia.selosInutilizados.length > 0 ? (
                                            guia.selosInutilizados.map((selo, index) => (
                                                <tr key={index}>
                                                    <td className="px-6 py-4 text-sm text-gray-900">{selo.descricao}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{selo.numeroSelo}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{selo.dataCancelamento.toLocaleDateString('pt-BR')}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ {selo.valorEmolumento.toFixed(2)}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ {selo.valorFundoEstadual.toFixed(2)}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ {selo.valorTaxaJudiciaria.toFixed(2)}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">Nenhum selo inutilizado neste decêndio.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}