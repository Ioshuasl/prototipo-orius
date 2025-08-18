import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { SlidersHorizontal, ChevronUp, ChevronLeft, PlusCircle, FileText, CalendarDays, TrendingUp, TrendingDown, DollarSign, ListX, X, FilterX, Search, PrinterIcon } from 'lucide-react';
import { mockSealBatches } from '../lib/Constants';

// Interfaces para os dados de transação
interface FinancialTransaction {
    id: number;
    description: string;
    value: number;
    type: 'Receita' | 'Despesa';
    date: Date;
    details?: any;
}

// Gerando despesas simuladas
const mockDespesas: FinancialTransaction[] = [
    { id: 101, description: 'Salários - Agosto', value: 15000.00, type: 'Despesa', date: new Date(2025, 7, 5) },
    { id: 102, description: 'Aluguel do escritório', value: 3500.00, type: 'Despesa', date: new Date(2025, 7, 10) },
    { id: 103, description: 'Energia Elétrica', value: 450.00, type: 'Despesa', date: new Date(2025, 7, 15) },
];
const mockReceitas: FinancialTransaction[] = mockSealBatches.flatMap(batch => 
    batch.seals.filter(seal => seal.sealSituation === 'Utilizando').map((seal) => ({
        id: parseInt(`${batch.id}${seal.sealNumber.replace('-', '')}`),
        description: `Serviço de ${batch.descricao.split(' - ')[0]}`,
        value: seal.sealValue.total,
        type: 'Receita',
        date: seal.resizingDate || new Date(),
    }))
);

// Combina e ordena as transações
const mockTransacoes: FinancialTransaction[] = [...mockReceitas, ...mockDespesas]
    .sort((a, b) => b.date.getTime() - a.date.getTime());


export default function ExtratoFinanceiro() {
    const navigate = useNavigate();
    
    const initialFilters = {
        tipo: 'Todos',
        descricao: '',
        startDate: '',
        endDate: '',
    };
    
    const initialExpenseForm = {
        description: '',
        value: '',
        date: new Date().toISOString().split('T')[0],
        type: 'Despesa' as 'Receita' | 'Despesa'
    };
    
    const [filters, setFilters] = useState(initialFilters);
    const [filteredTransacoes, setFilteredTransacoes] = useState<FinancialTransaction[]>(mockTransacoes);
    const [filtersVisible, setFiltersVisible] = useState(false);
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [expenseForm, setExpenseForm] = useState(initialExpenseForm);

    useEffect(() => {
        const results = mockTransacoes.filter(transacao => {
            const tipoMatch = filters.tipo === 'Todos' || transacao.type === filters.tipo;
            const descricaoMatch = filters.descricao === '' || transacao.description.toLowerCase().includes(filters.descricao.toLowerCase());
            
            const startDateMatch = filters.startDate ? transacao.date >= new Date(filters.startDate) : true;
            const endDateMatch = filters.endDate ? transacao.date <= new Date(filters.endDate + 'T23:59:59.999') : true;

            return tipoMatch && descricaoMatch && startDateMatch && endDateMatch;
        });

        setFilteredTransacoes(results);
    }, [filters]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleClearFilters = () => {
        setFilters(initialFilters);
    };

    const handleExpenseFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setExpenseForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSaveExpense = () => {
        if (!expenseForm.description || !expenseForm.value || !expenseForm.date) {
            alert('Por favor, preencha todos os campos da transação.');
            return;
        }
        
        const newTransaction: FinancialTransaction = {
            id: mockTransacoes.length + 100,
            description: expenseForm.description,
            value: parseFloat(expenseForm.value),
            type: expenseForm.type,
            date: new Date(expenseForm.date),
        };
        
        alert(`Simulando salvamento de nova transação: ${newTransaction.description} (R$ ${newTransaction.value})`);
        
        mockTransacoes.push(newTransaction);
        setExpenseForm(initialExpenseForm);
        setIsExpenseModalOpen(false);
        setFilteredTransacoes([...mockTransacoes].sort((a,b) => b.date.getTime() - a.date.getTime()));
    };

    const handleAction = (transacao: FinancialTransaction) => {
        alert(`Simulando ação para a transação de ${transacao.type} com ID: ${transacao.id}`);
    };

    const resumoFinanceiro = useMemo(() => {
        const receita = filteredTransacoes.filter(t => t.type === 'Receita').reduce((acc, t) => acc + t.value, 0);
        const despesa = filteredTransacoes.filter(t => t.type === 'Despesa').reduce((acc, t) => acc + t.value, 0);
        const saldo = receita - despesa;
        return { receita, despesa, saldo };
    }, [filteredTransacoes]);

    return (
        <>
            <title>Extrato Financeiro</title>
            <div className="flex bg-gray-50 font-sans">
                <main className="flex-1">
                    <div className="mx-auto space-y-4">
                        <header className="flex items-center justify-between">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <ChevronLeft className="h-5 w-5" />
                                <h1 className="text-3xl font-bold text-[#4a4e51]">Extrato Financeiro do Cartório</h1>
                            </button>
                            <div className='flex gap-4'>
                            <button
                                onClick={() => navigate('/caixa/impressao/relatorio-receita-depesa')}
                                className="flex items-center gap-2 bg-[#dd6825] text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-[#c25a1f] transition-all duration-300 hover:scale-105"
                            >
                                <PrinterIcon className="h-5 w-5" /> Imprimir Relatório
                            </button>
                            <button
                                onClick={() => setIsExpenseModalOpen(true)}
                                className="flex items-center gap-2 bg-[#dd6825] text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-[#c25a1f] transition-all duration-300 hover:scale-105"
                            >
                                <PlusCircle className="h-5 w-5" /> Adicionar Transação
                            </button>
                            </div>
                        </header>
                        
                        {/* SEÇÃO DE RESUMO FINANCEIRO */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                                <div className="flex items-center gap-2 text-gray-500">
                                    <TrendingUp className="h-5 w-5 text-green-500" />
                                    <p className="font-medium text-sm">Receita Total</p>
                                </div>
                                <p className="font-bold text-2xl text-green-600 mt-2">R$ {resumoFinanceiro.receita.toFixed(2)}</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                                <div className="flex items-center gap-2 text-gray-500">
                                    <TrendingDown className="h-5 w-5 text-red-500" />
                                    <p className="font-medium text-sm">Despesa Total</p>
                                </div>
                                <p className="font-bold text-2xl text-red-600 mt-2">R$ {resumoFinanceiro.despesa.toFixed(2)}</p>
                            </div>
                            <div className={`bg-white rounded-xl shadow-sm p-4 border border-gray-200`}>
                                <div className="flex items-center gap-2 text-gray-500">
                                    <DollarSign className="h-5 w-5" />
                                    <p className="font-medium text-sm">Saldo Líquido</p>
                                </div>
                                <p className={`font-bold text-2xl mt-2 ${resumoFinanceiro.saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>R$ {resumoFinanceiro.saldo.toFixed(2)}</p>
                            </div>
                        </div>

                        {/* FILTROS DE BUSCA */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                            <div className="flex justify-between items-center p-4 cursor-pointer" onClick={() => setFiltersVisible(!filtersVisible)}>
                                <div className="flex items-center gap-3">
                                    <SlidersHorizontal className="h-5 w-5 text-gray-600" />
                                    <h2 className="font-semibold text-gray-800 text-lg">Filtros de Busca</h2>
                                </div>
                                <button className="p-1 rounded-full hover:bg-gray-100">
                                    <ChevronUp className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${!filtersVisible && 'rotate-180'}`} />
                                </button>
                            </div>

                            <div className={`grid transition-all duration-500 ease-in-out ${filtersVisible ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                <div className="overflow-hidden">
                                    <div className="p-5 space-y-2 pt-0">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            <div>
                                                <label htmlFor="descricao" className="block text-sm font-medium text-gray-600 mb-1">Buscar por Descrição</label>
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                    <input
                                                        id="descricao"
                                                        name="descricao"
                                                        type="text"
                                                        value={filters.descricao}
                                                        onChange={handleFilterChange}
                                                        placeholder="Ex: Salários ou Energia"
                                                        className="border border-gray-300 rounded-md pl-10 pr-4 py-2 w-full focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]"
                                                    />
                                                </div>
                                            </div>
                                            <div><label htmlFor="tipo" className="block text-sm font-medium text-gray-600 mb-1">Tipo de Transação</label><select id="tipo" name="tipo" value={filters.tipo} onChange={handleFilterChange} className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]"><option>Todos</option><option>Receita</option><option>Despesa</option></select></div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div><label className="block text-sm font-medium text-gray-600 mb-1">De</label><input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]" /></div>
                                                <div><label className="block text-sm font-medium text-gray-600 mb-1">Até</label><input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]" /></div>
                                            </div>
                                        </div>
                                        <div className="flex justify-end pt-4"><button type="button" onClick={handleClearFilters} className="flex items-center gap-2 bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"><FilterX className="h-5 w-5" />Limpar Filtros</button></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* LISTA DE TRANSAÇÕES */}
                        <div className="min-h-[400px] relative">
                            {filteredTransacoes.length > 0 ? (
                                <div className="space-y-4">
                                    {filteredTransacoes.map(transacao => (
                                        <div key={transacao.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex justify-between items-center transition-all duration-300 hover:shadow-lg">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2 rounded-full ${transacao.type === 'Receita' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                    {transacao.type === 'Receita' ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg text-gray-800">{transacao.description}</h3>
                                                    <p className="text-sm text-gray-500 mt-1">{transacao.date.toLocaleString('pt-BR')}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className={`font-bold text-lg ${transacao.type === 'Receita' ? 'text-green-600' : 'text-red-600'}`}>R$ {transacao.value.toFixed(2)}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleAction(transacao)}
                                                    className="bg-gray-100 text-[#dd6825] p-2 rounded-full hover:bg-gray-200 transition-colors"
                                                    title="Visualizar Detalhes"
                                                >
                                                    <FileText className="h-6 w-6" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center text-center text-gray-500 bg-white rounded-xl h-full border-2 border-dashed py-10">
                                    <ListX className="h-12 w-12 mb-4" />
                                    <h3 className="text-lg font-semibold">Nenhuma transação encontrada</h3>
                                    <p>Tente ajustar ou limpar os filtros para ver mais resultados.</p>
                                </div>
                            )}
                        </div>
                        
                    </div>
                </main>
            </div>

            {/* MODAL DE CADASTRO DE DESPESA */}
            {isExpenseModalOpen && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800">Cadastrar Nova Transação</h2>
                            <button onClick={() => setIsExpenseModalOpen(false)} className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4 overflow-y-auto">
                             <div>
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Tipo de Transação</label>
                                <select
                                    id="type"
                                    name="type"
                                    value={expenseForm.type}
                                    onChange={handleExpenseFormChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-4 py-3 focus:ring-[#dd6825]/50 focus:border-[#dd6825] sm:text-sm"
                                >
                                    <option value="Despesa">Despesa</option>
                                    <option value="Receita">Receita</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição</label>
                                <input
                                    id="description"
                                    name="description"
                                    type="text"
                                    value={expenseForm.description}
                                    onChange={handleExpenseFormChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-4 py-3 focus:ring-[#dd6825]/50 focus:border-[#dd6825] sm:text-sm"
                                    placeholder="Ex: Salários ou Energia"
                                />
                            </div>
                            <div>
                                <label htmlFor="value" className="block text-sm font-medium text-gray-700">Valor</label>
                                <div className="relative mt-1 rounded-md shadow-sm">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <DollarSign className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="value"
                                        name="value"
                                        type="number"
                                        value={expenseForm.value}
                                        onChange={handleExpenseFormChange}
                                        className="block w-full rounded-md border-gray-300 pl-10 px-4 py-3 focus:border-[#dd6825] focus:ring-[#dd6825] sm:text-sm"
                                        placeholder="0,00"
                                        min="0"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700">Data</label>
                                <div className="relative mt-1 rounded-md shadow-sm">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <CalendarDays className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="date"
                                        name="date"
                                        type="date"
                                        value={expenseForm.date}
                                        onChange={handleExpenseFormChange}
                                        className="block w-full rounded-md border-gray-300 pl-10 px-4 py-3 focus:border-[#dd6825] focus:ring-[#dd6825] sm:text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
                            <button
                                onClick={() => setIsExpenseModalOpen(false)}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveExpense}
                                className="bg-[#dd6825] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#c25a1f] transition-colors"
                            >
                                Salvar Transação
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}