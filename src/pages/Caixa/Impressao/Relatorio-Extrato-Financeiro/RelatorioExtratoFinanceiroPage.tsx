import React, { useState, useEffect, useMemo } from 'react';
import { Search, Printer, Settings, ListX, TrendingUp, TrendingDown, DollarSign, FilterX } from 'lucide-react';
import { mockDespesas, mockReceitas } from '../../lib/Constants';
import brasao from '../../../../assets/logo-cartorio.png';
import ModalConfiguracaoImpressaoExtrato, { type ConfiguracaoExtrato } from './ModalConfiguracaoImpressao';
import { type FinancialTransaction } from '../../types';

// Combina e ordena as transações
const mockTransacoes: FinancialTransaction[] = [...mockReceitas, ...mockDespesas]
    .sort((a, b) => b.date.getTime() - a.date.getTime());

// Função para formatar uma data para o formato YYYY-MM-DD
const formatDateToYYYYMMDD = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Funções para obter o primeiro e último dia do mês atual
const getFirstDayOfMonth = (): string => {
    const now = new Date();
    return formatDateToYYYYMMDD(new Date(now.getFullYear(), now.getMonth(), 1));
};

const getLastDayOfMonth = (): string => {
    const now = new Date();
    return formatDateToYYYYMMDD(new Date(now.getFullYear(), now.getMonth() + 1, 0));
};

export default function RelatorioExtratoFinanceiroPage() {
    const [filtros, setFiltros] = useState({
        tipo: 'Todos',
        descricao: '',
        startDate: getFirstDayOfMonth(), // Inicializado com o primeiro dia do mês
        endDate: getLastDayOfMonth(),     // Inicializado com o último dia do mês
    });
    const [resultados, setResultados] = useState<FinancialTransaction[]>([]);
    const [pesquisaFeita, setPesquisaFeita] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [configuracaoImpressao, setConfiguracaoImpressao] = useState<ConfiguracaoExtrato>({
        colunas: { data: true, tipo: true, descricao: true, valor: true },
        templateCabecalho: 'modelo1',
        margens: { top: '1.5', bottom: '1.5', left: '1.5', right: '1.5' }
    });

    const tiposUnicos = useMemo(() => ['Todos', ...new Set(mockTransacoes.map(t => t.type))], []);

    // Função de pesquisa
    const handlePesquisar = () => {
        let dadosFiltrados = mockTransacoes;

        if (filtros.tipo !== 'Todos') {
            dadosFiltrados = dadosFiltrados.filter(transacao => transacao.type === filtros.tipo);
        }

        if (filtros.descricao) {
            dadosFiltrados = dadosFiltrados.filter(transacao =>
                transacao.description.toLowerCase().includes(filtros.descricao.toLowerCase())
            );
        }

        if (filtros.startDate) {
            const startDate = new Date(filtros.startDate);
            dadosFiltrados = dadosFiltrados.filter(transacao => transacao.date >= startDate);
        }

        if (filtros.endDate) {
            const endDate = new Date(filtros.endDate);
            // Inclui o último dia completo
            endDate.setHours(23, 59, 59, 999);
            dadosFiltrados = dadosFiltrados.filter(transacao => transacao.date <= endDate);
        }

        setResultados(dadosFiltrados);
        setPesquisaFeita(true);
    };

    const handleClearFilters = () => {
        setFiltros({
            tipo: 'Todos',
            descricao: '',
            startDate: getFirstDayOfMonth(),
            endDate: getLastDayOfMonth()
        });
        setPesquisaFeita(false);
        setResultados([]);
    };
    
    // Calcula o saldo total dos resultados filtrados
    const saldoTotal = useMemo(() => {
        return resultados.reduce((total, transacao) => {
            return transacao.type === 'Receita' ? total + transacao.value : total - transacao.value;
        }, 0);
    }, [resultados]);

    const resumoFinanceiro = useMemo(() => {
        const receita = resultados.filter(t => t.type === 'Receita').reduce((acc, t) => acc + t.value, 0);
        const despesa = resultados.filter(t => t.type === 'Despesa').reduce((acc, t) => acc + t.value, 0);
        const saldo = receita - despesa;
        return { receita, despesa, saldo };
    }, [resultados]);

    const renderHeaderImpressao = () => {
        const template = configuracaoImpressao.templateCabecalho;
        const titulo = `Extrato Financeiro`;

        switch (template) {
            case 'modelo1':
                return (
                    <div className='text-center'>
                        <h2 className="text-xl font-bold">{titulo}</h2>
                        <p className="text-base font-semibold">{dadosCartorio.nome}</p>
                        <p className="text-sm">Tabelião: {dadosCartorio.tabeliao}</p>
                    </div>
                );
            case 'modelo2':
                return (
                    <div className='flex flex-col items-center justify-center text-sm'>
                        <p className="font-bold text-lg mb-1">{dadosCartorio.nome}</p>
                        <p>{dadosCartorio.endereco} - {dadosCartorio.telefone}</p>
                        <p className="font-semibold text-lg mt-2">{titulo}</p>
                    </div>
                );
            case 'modelo3':
                return (
                    <div className="flex items-center justify-center gap-4 text-sm">
                        <img src={brasao} alt="Brasão do Cartório" className="w-16 h-16" />
                        <div>
                            <p className="font-bold text-lg mb-1">{dadosCartorio.nome}</p>
                            <p>{dadosCartorio.endereco} - {dadosCartorio.telefone}</p>
                            <p className="font-semibold text-lg mt-2">{titulo}</p>
                        </div>
                    </div>
                );
            case 'modelo4':
                return (
                    <div className='flex flex-col items-center text-sm'>
                        <img src={brasao} alt="Brasão do Cartório" className="w-16 h-16 mb-2" />
                        <p className="font-bold text-lg mb-1">{dadosCartorio.nome}</p>
                        <p>{dadosCartorio.endereco} - {dadosCartorio.telefone}</p>
                        <p className="font-semibold text-lg mt-2">{titulo}</p>
                    </div>
                );
            default:
                return (
                    <div className='text-center'>
                        <h2 className="text-xl font-bold">{titulo}</h2>
                        <p className="text-base font-semibold">{dadosCartorio.nome}</p>
                        <p className="text-sm">Tabelião: {dadosCartorio.tabeliao}</p>
                    </div>
                );
        }
    };

    const dadosCartorio = {
        nome: "Cartório de Registro Civil e Tabelionato de Notas",
        tabeliao: "Dr. João da Silva",
        endereco: "Avenida Principal, 1234, Centro",
        telefone: "(62) 99999-8888",
    };

    const colunasParaExibir = Object.keys(configuracaoImpressao.colunas).filter(
        col => configuracaoImpressao.colunas[col as keyof ConfiguracaoExtrato['colunas']]
    );

    const columnTitles = {
        data: 'Data',
        tipo: 'Tipo',
        descricao: 'Descrição',
        valor: 'Valor',
    };

    return (
        <>
            <div className="mx-auto space-y-6 pb-24">
                <div className="print:hidden">
                    <h1 className="text-2xl font-bold text-gray-800">Relatório de Extrato Financeiro</h1>
                    <p className="text-sm text-gray-500">Gere e imprima um relatório detalhado das movimentações financeiras do cartório.</p>
                </div>

                {/* Filtros de Pesquisa */}
                <fieldset className="border border-gray-200 rounded-lg p-5 print:hidden">
                    <legend className="text-lg font-medium text-gray-700 px-2">Filtros de Pesquisa</legend>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-4">
                        <div>
                            <label htmlFor="tipo" className="block text-sm text-gray-700 font-medium mb-1">Tipo</label>
                            <select name="tipo" id="tipo" value={filtros.tipo} onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white">
                                {tiposUnicos.map(t => <option key={t}>{t}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="descricao" className="block text-sm text-gray-700 font-medium mb-1">Descrição</label>
                            <input type="text" name="descricao" id="descricao" value={filtros.descricao} onChange={(e) => setFiltros({ ...filtros, descricao: e.target.value })} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white" placeholder="Ex: Protocolo 2023-12345" />
                        </div>
                        <div>
                            <label htmlFor="startDate" className="block text-sm text-gray-700 font-medium mb-1">Data Inicial</label>
                            <input type="date" name="startDate" id="startDate" value={filtros.startDate} onChange={(e) => setFiltros({ ...filtros, startDate: e.target.value })} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white" />
                        </div>
                        <div>
                            <label htmlFor="endDate" className="block text-sm text-gray-700 font-medium mb-1">Data Final</label>
                            <input type="date" name="endDate" id="endDate" value={filtros.endDate} onChange={(e) => setFiltros({ ...filtros, endDate: e.target.value })} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white" />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-5">
                        <button onClick={handleClearFilters} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 transition">
                            <FilterX size={16} /> Limpar Filtros
                        </button>
                        <button onClick={handlePesquisar} className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#dd6825] text-white text-sm font-medium rounded-md hover:bg-[#c25a1f] transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dd6825]">
                            <Search size={16} /> Pesquisar
                        </button>
                    </div>
                </fieldset>

                {/* Resumo Financeiro */}
                {pesquisaFeita && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:hidden">
                        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                            <div className="flex items-center gap-2 text-gray-500"><TrendingUp className="h-5 w-5 text-green-500" /><p className="font-medium text-sm">Receita Total</p></div>
                            <p className="font-bold text-2xl text-green-600 mt-2">R$ {resumoFinanceiro.receita.toFixed(2)}</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                            <div className="flex items-center gap-2 text-gray-500"><TrendingDown className="h-5 w-5 text-red-500" /><p className="font-medium text-sm">Despesa Total</p></div>
                            <p className="font-bold text-2xl text-red-600 mt-2">R$ {resumoFinanceiro.despesa.toFixed(2)}</p>
                        </div>
                        <div className={`bg-white rounded-xl shadow-sm p-4 border border-gray-200`}>
                            <div className="flex items-center gap-2 text-gray-500"><DollarSign className="h-5 w-5" /><p className="font-medium text-sm">Saldo Líquido</p></div>
                            <p className={`font-bold text-2xl mt-2 ${resumoFinanceiro.saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>R$ {resumoFinanceiro.saldo.toFixed(2)}</p>
                        </div>
                    </div>
                )}

                {/* Resultados */}
                {pesquisaFeita && (
                    <section>
                        <div className="flex justify-between items-center mb-4 print:hidden">
                            <h3 className="text-lg font-medium text-gray-700">
                                {resultados.length} registro(s) encontrado(s)
                            </h3>
                            {resultados.length > 0 && (
                                <div className='flex items-center gap-2'>
                                    <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#4a4e51] rounded-md hover:bg-[#3b3e40] transition">
                                        <Settings size={16} /> Configurações
                                    </button>
                                    <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#dd6825] rounded-md hover:bg-[#c25a1f] transition">
                                        <Printer size={16} /> Imprimir Relatório
                                    </button>
                                </div>
                            )}
                        </div>

                        
                        {resultados.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-200 print:hidden">
                                    <thead className='bg-gray-50'>
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {resultados.map(transacao => (
                                            <tr key={transacao.id} className='hover:bg-gray-50'>
                                                <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{transacao.date.toLocaleDateString('pt-BR')}</td>
                                                <td className="px-4 py-3 text-sm font-medium text-gray-800">{transacao.type}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{transacao.description}</td>
                                                <td className={`px-4 py-3 text-sm font-bold ${transacao.type === 'Receita' ? 'text-green-600' : 'text-red-600'}`}>{`R$ ${transacao.value.toFixed(2)}`}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="bg-gray-300 font-bold">
                                            <td className="px-4 py-3" colSpan={colunasParaExibir.length - 1}>Receita Total:</td>
                                            <td className="px-4 py-3 text-green-600">{`R$ ${resumoFinanceiro.receita.toFixed(2)}`}</td>
                                        </tr>
                                        <tr className="bg-gray-300 font-bold">
                                            <td className="px-4 py-3" colSpan={colunasParaExibir.length - 1}>Despesa Total:</td>
                                            <td className="px-4 py-3 text-red-600">{`R$ ${resumoFinanceiro.despesa.toFixed(2)}`}</td>
                                        </tr>
                                        <tr className="bg-gray-300 font-bold">
                                            <td className="px-4 py-3" colSpan={colunasParaExibir.length - 1}>Saldo Líquido:</td>
                                            <td className={`px-4 py-3 ${resumoFinanceiro.saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>{`R$ ${resumoFinanceiro.saldo.toFixed(2)}`}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>

                            

                            
                        ) : (
                            <div className="text-center py-8 border border-dashed rounded-lg text-gray-500 bg-gray-50 print:hidden">
                                <ListX className="mx-auto mb-2 w-8 h-8" />
                                <p className="text-sm">Nenhuma transação encontrada com os filtros aplicados.</p>
                            </div>
                        )}
                    </section>
                )}
            </div>

            {/* --- ÁREA DE IMPRESSÃO --- */}
            <style>
                {`
                @media print {
                    @page { size: A4 portrait; margin: 1cm; }
                    body * { visibility: hidden; }
                    #area-impressao-extrato, #area-impressao-extrato * { visibility: visible; }
                    #area-impressao-extrato { position: absolute; left: 0; top: 0; width: 100%;}
                    .header-impressao { border-bottom: 2px solid #333; padding-bottom: 0.5rem; margin-bottom: 1rem; display: block; }
                    #tabela-impressao-extrato { width: 100%; border-collapse: collapse; font-size: 9pt; }
                    #tabela-impressao-extrato th, #tabela-impressao-extrato td { padding: 6px 4px; border: 1px solid #ccc; text-align: left; word-break: break-word; }
                    #tabela-impressao-extrato thead { display: table-header-group; }
                    #tabela-impressao-extrato thead th { background-color: #f9fafb; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    #tabela-impressao-extrato tfoot td { font-weight: bold; background-color: #f0f0f0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                }
                `}
            </style>
            <div id="area-impressao-extrato" className="hidden print:block">
                <div className="header-impressao">{renderHeaderImpressao()}</div>
                <table id="tabela-impressao-extrato">
                    <thead>
                        <tr>
                            {colunasParaExibir.map(col => (
                                <th key={col}>{columnTitles[col as keyof typeof columnTitles]}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {resultados.map(transacao => (
                            <tr key={transacao.id}>
                                {configuracaoImpressao.colunas.data && <td>{transacao.date.toLocaleDateString('pt-BR')}</td>}
                                {configuracaoImpressao.colunas.tipo && <td>{transacao.type}</td>}
                                {configuracaoImpressao.colunas.descricao && <td>{transacao.description}</td>}
                                {configuracaoImpressao.colunas.valor && <td>{`R$ ${transacao.value.toFixed(2)}`}</td>}
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={colunasParaExibir.length - 1} className="text-right">Receita Total:</td>
                            <td>{`R$ ${resumoFinanceiro.receita.toFixed(2)}`}</td>
                        </tr>
                        <tr>
                            <td colSpan={colunasParaExibir.length - 1} className="text-right">Despesa Total:</td>
                            <td>{`R$ ${resumoFinanceiro.despesa.toFixed(2)}`}</td>
                        </tr>
                        <tr>
                            <td colSpan={colunasParaExibir.length - 1} className="text-right">Saldo Líquido:</td>
                            <td>{`R$ ${resumoFinanceiro.saldo.toFixed(2)}`}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            
            <ModalConfiguracaoImpressaoExtrato
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={(novaConfig) => {
                    setConfiguracaoImpressao(novaConfig);
                    setIsModalOpen(false);
                }}
                configuracaoAtual={configuracaoImpressao}
            />
        </>
    );
}