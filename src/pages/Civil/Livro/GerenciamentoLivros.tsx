import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, ChevronLeft, ChevronRight, FilterX, Loader2, ListX, SlidersHorizontal, ChevronUp, Lock, PrinterIcon } from 'lucide-react';

// --- ESTRUTURA DE TIPOS E DADOS SIMULADOS PARA OS LIVROS ---
type LivroStatus = 'Aberto' | 'Fechado';
type LivroTipo = 'Nascimento' | 'Casamento' | 'Óbito' | 'Livro E';

interface Livro {
    id: number;
    numero: string;
    tipo: LivroTipo;
    status: LivroStatus;
    dataAbertura: string;
    dataFechamento?: string;
    folhaAtual: number;
    folhasTotais: number;
}

const mockLivros: Livro[] = Array.from({ length: 25 }, (_, i) => {
    const dataAbertura = new Date(2024 - Math.floor(i / 5), i % 12, 15);
    const isFechado = i % 2 === 0;
    return {
        id: i + 1,
        numero: `${String(101 + i).padStart(3, '0')}`,
        tipo: ['Nascimento', 'Casamento', 'Óbito', 'Livro E'][i % 4] as LivroTipo,
        status: isFechado ? 'Fechado' : 'Aberto',
        dataAbertura: dataAbertura.toLocaleDateString('pt-BR'),
        dataFechamento: isFechado ? new Date(dataAbertura.getFullYear(), 11, 31).toLocaleDateString('pt-BR') : undefined,
        folhaAtual: Math.floor(Math.random() * 200) + 1, // de 1 a 200
        folhasTotais: 200,
    };
});

const statusOptions: LivroStatus[] = ['Aberto', 'Fechado'];
const tipoOptions: LivroTipo[] = ['Nascimento', 'Casamento', 'Óbito', 'Livro E'];

// --- OBJETO DE ESTILOS PARA O STATUS DO LIVRO ---
const statusStyles: Record<LivroStatus, { text: string, bg: string, border: string, topBorder: string }> = {
    Aberto: { text: 'text-green-800', bg: 'bg-green-100', border: 'border-green-200', topBorder: 'border-t-green-500' },
    Fechado: { text: 'text-red-800', bg: 'bg-red-100', border: 'border-red-200', topBorder: 'border-t-red-500' },
};


// --- COMPONENTE PRINCIPAL DA PÁGINA ---
export default function GerenciamentoLivrosPage() {
    const initialFilters = { numero: '', status: 'Todos', tipo: 'Todos', dataAbertura: '', dataFechamento: '' };

    const [filters, setFilters] = useState(initialFilters);
    const [filteredRecords, setFilteredRecords] = useState<Livro[]>(mockLivros);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [filtersVisible, setFiltersVisible] = useState(false);
    const recordsPerPage = 9;

    useEffect(() => {
        setIsLoading(true);
        const filterTimeout = setTimeout(() => {
            const results = mockLivros.filter(record => {
                const numeroMatch = filters.numero ? record.numero.toLowerCase().includes(filters.numero.toLowerCase()) : true;
                const statusMatch = filters.status !== 'Todos' ? record.status === filters.status : true;
                const tipoMatch = filters.tipo !== 'Todos' ? record.tipo === filters.tipo : true;

                const parseDate = (dateString: string) => { const [d, m, y] = dateString.split('/'); return new Date(`${y}-${m}-${d}`); };
                const aberturaDate = parseDate(record.dataAbertura);
                const dataAberturaMatch = filters.dataAbertura && aberturaDate ? aberturaDate >= new Date(filters.dataAbertura + 'T00:00:00') : true;
                const dataFechamentoMatch = filters.dataFechamento && record.dataFechamento ? parseDate(record.dataFechamento) <= new Date(filters.dataFechamento + 'T23:59:59') : true;

                return numeroMatch && statusMatch && tipoMatch && dataAberturaMatch && dataFechamentoMatch;
            });
            setFilteredRecords(results);
            setCurrentPage(1);
            setIsLoading(false);
        }, 300);

        return () => clearTimeout(filterTimeout);
    }, [filters]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFecharLivro = (id: number) => {
        const hoje = new Date();
        const dataFechamentoFormatada = hoje.toLocaleDateString('pt-BR');

        setFilteredRecords(prevRecords =>
            prevRecords.map(livro =>
                livro.id === id
                    ? {
                        ...livro,
                        status: 'Fechado',
                        dataFechamento: dataFechamentoFormatada
                    }
                    : livro
            )
        );
    };

    const handleClearFilters = () => setFilters(initialFilters);

    const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
    const paginatedRecords = filteredRecords.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

    const StatusBadge = ({ status }: { status: LivroStatus }) => {
        const style = statusStyles[status] || {};
        return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${style.text} ${style.bg} ${style.border}`}>{status}</span>;
    };

    const LivroCard = ({ record }: { record: Livro }) => {
        const cardTopBorderStyle = statusStyles[record.status]?.topBorder || 'border-t-gray-200';

        return (
            <Link
                to={`${record.id}`}
                className={`block bg-white rounded-lg border border-gray-200 transition-all duration-300 hover:shadow-lg overflow-hidden border-t-4 ${cardTopBorderStyle}`}
            >
                <div className="p-4">
                    <div className="flex justify-between items-start gap-4">
                        <div>
                            <h3 className="font-bold text-gray-800 text-lg leading-tight">{`${record.numero} - Livro de ${record.tipo}`}</h3>
                        </div>
                        <StatusBadge status={record.status} />
                    </div>
                </div>
                <div className="p-4 grid grid-cols-2 gap-4 text-sm bg-gray-50/50 border-t border-b border-gray-100">
                    <div>
                        <p className="text-xs text-gray-500">Data de Abertura</p>
                        <p className="font-medium text-gray-700">{record.dataAbertura}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Data de Fechamento</p>
                        <p className="font-medium text-gray-700">{record.dataFechamento || '—'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Páginas</p>
                        <p className="font-medium text-gray-700">{`${record.folhaAtual} / ${record.folhasTotais} (${((record.folhaAtual / record.folhasTotais) * 100).toFixed(1)}%)`}</p>
                    </div>
                </div>
                <div className="p-2 flex justify-end items-center gap-2">
                    <button
                        onClick={(e) => {
                            e.preventDefault(); // impede que o clique no botão redirecione
                            window.print(); // Imprime a página atual
                        }}
                        className="flex items-center gap-2 text-sm bg-gray-50 text-gray-700 font-semibold px-3 py-1.5 rounded-md hover:bg-gray-200 transition-colors"
                    >
                        <PrinterIcon size={14} /> Imprimir Livro
                    </button>
                    {record.status === 'Aberto' && (
                        <button
                            onClick={(e) => {
                                e.preventDefault(); // impede que o clique no botão redirecione
                                handleFecharLivro(record.id);
                            }}
                            className="flex items-center gap-2 text-sm bg-red-50 text-red-700 font-semibold px-3 py-1.5 rounded-md hover:bg-red-100 transition-colors"
                        >
                            <Lock size={14} /> Fechar Livro
                        </button>
                    )}
                </div>
            </Link>
        );
    };


    return (
        <>
            <title>Gerenciamento de Livros</title>
            <div className="mx-auto space-y-6">
                <header className="flex items-center justify-between">
                    <div><h1 className="text-3xl font-bold text-gray-800">Gerenciamento de Livros</h1><p className="text-md text-gray-500 mt-1">Consulte e gerencie os livros do cartório.</p></div>
                    <Link to="cadastrar" className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition-all duration-300 hover:scale-105">
                        <PlusCircle className="h-5 w-5" /> Abrir Novo Livro
                    </Link>
                </header>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center p-4 cursor-pointer" onClick={() => setFiltersVisible(!filtersVisible)}>
                        <div className="flex items-center gap-3"><SlidersHorizontal className="h-5 w-5 text-gray-600" /><h2 className="font-semibold text-gray-800 text-lg">Filtros de Busca</h2></div>
                        <button className="p-1 rounded-full hover:bg-gray-100"><ChevronUp className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${!filtersVisible && 'rotate-180'}`} /></button>
                    </div>
                    <div className={`grid transition-all duration-500 ease-in-out ${filtersVisible ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                        <div className="overflow-hidden">
                            <div className="p-5 space-y-4 border-t">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div><label htmlFor="tipo" className="block text-sm font-medium text-gray-600 mb-1">Tipo de Livro</label><select id="tipo" name="tipo" value={filters.tipo} onChange={handleFilterChange} className="border border-gray-300 rounded-md px-3 py-2 w-full"><option>Todos</option>{tipoOptions.map(s => <option key={s}>{s}</option>)}</select></div>
                                    <div><label htmlFor="status" className="block text-sm font-medium text-gray-600 mb-1">Situação</label><select id="status" name="status" value={filters.status} onChange={handleFilterChange} className="border border-gray-300 rounded-md px-3 py-2 w-full"><option>Todos</option>{statusOptions.map(s => <option key={s}>{s}</option>)}</select></div>
                                    <div><label htmlFor="numero" className="block text-sm font-medium text-gray-600 mb-1">Número do Livro</label><input id="numero" type="text" name="numero" value={filters.numero} onChange={handleFilterChange} placeholder="Ex: A-101" className="border border-gray-300 rounded-md px-3 py-2 w-full" /></div>
                                </div>
                                <div><label className="block text-sm font-medium text-gray-600 mb-1">Período (Abertura/Fechamento)</label><div className="flex items-center gap-2"><input type="date" name="dataAbertura" value={filters.dataAbertura} onChange={handleFilterChange} className="border border-gray-300 rounded-md px-3 py-2 w-full" /><span className="text-gray-500">até</span><input type="date" name="dataFechamento" value={filters.dataFechamento} onChange={handleFilterChange} className="border border-gray-300 rounded-md px-3 py-2 w-full" /></div></div>
                                <div className="flex justify-end pt-4"><button type="button" onClick={handleClearFilters} className="flex items-center gap-2 bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"><FilterX className="h-5 w-5" />Limpar Filtros</button></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="min-h-[400px] relative">
                    {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50 rounded-xl z-10"><Loader2 className="h-10 w-10 text-blue-600 animate-spin" /></div>
                    ) : paginatedRecords.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {paginatedRecords.map(record => (
                                <LivroCard key={record.id} record={record} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center text-gray-500 bg-white rounded-xl h-full border-2 border-dashed py-10">
                            <ListX className="h-12 w-12 mb-4" /><h3 className="text-lg font-semibold">Nenhum livro encontrado</h3><p>Tente ajustar ou limpar os filtros para ver mais resultados.</p>
                        </div>
                    )}
                </div>

                <nav className="flex items-center justify-between pt-4">
                    <p className="text-sm text-gray-600">Mostrando <span className="font-semibold">{paginatedRecords.length > 0 ? ((currentPage - 1) * recordsPerPage) + 1 : 0}</span> a <span className="font-semibold">{Math.min(currentPage * recordsPerPage, filteredRecords.length)}</span> de <span className="font-semibold">{filteredRecords.length}</span> registros</p>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1 || isLoading} className="p-2 rounded-md transition-colors bg-white border text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronLeft className="h-5 w-5" /></button>
                        <span className="text-sm font-semibold text-gray-700">Página {currentPage} de {totalPages > 0 ? totalPages : 1}</span>
                        <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages || isLoading} className="p-2 rounded-md transition-colors bg-white border text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronRight className="h-5 w-5" /></button>
                    </div>
                </nav>
            </div>
        </>
    );
}