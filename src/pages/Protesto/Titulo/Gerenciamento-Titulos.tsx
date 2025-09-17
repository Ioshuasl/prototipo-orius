import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, ChevronLeft, ChevronRight, FilterX, Loader2, ListX, SlidersHorizontal, Book, ChevronUp, Landmark, Wallet, Briefcase, CalendarDays, AlertTriangle, FileText, Ban, Scale, HandCoins, BookCheck, Upload } from 'lucide-react';
import { type ITituloProtesto, type StatusTitulo } from '../types';
import { mockTitulosProtesto, statusOptions, especieOptions } from '../lib/Constants';
import BancoSelect from '../Components/BancoSelect';


export default function GerenciamentoTitulosPage() {
    const initialFilters = {
        searchTerm: '', status: 'Todos', especieTitulo: 'Todos',
        startDate: '', endDate: '', banco: 'Todos', isTituloAntigo: 'Todos'
    };
    const [filters, setFilters] = useState(initialFilters);
    const [filteredRecords, setFilteredRecords] = useState<ITituloProtesto[]>(mockTitulosProtesto);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [filtersVisible, setFiltersVisible] = useState(false);
    const recordsPerPage = 9;
    const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

    useEffect(() => {
        setIsLoading(true);
        const filterTimeout = setTimeout(() => {
            const results = mockTitulosProtesto.filter(record => {
                const searchTerm = filters.searchTerm.toLowerCase();
                const searchTermMatch = filters.searchTerm ?
                    record.protocolo.toLowerCase().includes(searchTerm) ||
                    record.numeroTitulo.toLowerCase().includes(searchTerm) ||
                    record.devedores.some(d => (d.tipo === 'fisica' ? d.nome : d.razaoSocial).toLowerCase().includes(searchTerm))
                    : true;

                const statusMatch = filters.status !== 'Todos' ? record.status === filters.status : true;
                const especieMatch = filters.especieTitulo !== 'Todos' ? record.especieTitulo === filters.especieTitulo : true;
                const bancoMatch = filters.banco !== 'Todos' ? record.banco === parseInt(filters.banco, 10) : true;
                const startDateMatch = filters.startDate ? record.apontamento && new Date(record.apontamento.dataApontamento) >= new Date(filters.startDate) : true;
                const endDateMatch = filters.endDate ? record.apontamento && new Date(record.apontamento.dataApontamento) <= new Date(filters.endDate + 'T23:59:59.999') : true;

                const isTituloAntigoMatch = filters.isTituloAntigo === 'Todos' ? true :
                    filters.isTituloAntigo === 'Antigos' ? record.isTituloAntigo === true :
                        !record.isTituloAntigo;

                return searchTermMatch && statusMatch && especieMatch && bancoMatch && startDateMatch && endDateMatch && isTituloAntigoMatch;
            });

            const sortedResults = results.sort((a, b) => (b.apontamento?.dataApontamento?.getTime() ?? 0) - (a.apontamento?.dataApontamento?.getTime() ?? 0));
            setFilteredRecords(sortedResults);
            setCurrentPage(1);
            setIsLoading(false);
        }, 300);
        return () => clearTimeout(filterTimeout);
    }, [filters]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleClearFilters = () => setFilters(initialFilters);

    const paginatedRecords = filteredRecords.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

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
            'Liquidado': 'bg-pink-100 text-pink-800 border-pink-200',
        };
        return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${styles[status]}`}>{status}</span>;
    };

    const TitleCard = ({ record }: { record: ITituloProtesto }) => {
        const presenterName = record.apresentante.tipo === 'fisica' ? record.apresentante.nome : record.apresentante.razaoSocial;

        const renderActions = () => {
            switch (record.status) {
                case 'Aguardando Qualificação': return <button className="ActionButton bg-cyan-600 hover:bg-cyan-700"><Scale className="h-4 w-4" />Analisar Título</button>;
                case 'Aguardando Intimação': return <button className="ActionButton bg-blue-600 hover:bg-blue-700"><FileText className="h-4 w-4" />Gerar Intimação</button>;
                case 'Prazo Aberto': return <button className="ActionButton bg-green-600 hover:bg-green-700"><HandCoins className="h-4 w-4" />Registrar Pagamento</button>;
                case 'Protestado': return <button className="ActionButton bg-pink-600 hover:bg-pink-700"><BookCheck className="h-4 w-4" />Registrar Cancelamento</button>;
                case 'Recusado': return <button className="ActionButton bg-gray-500 hover:bg-gray-600"><Ban className="h-4 w-4" />Ver Motivo</button>;
                default: return null;
            }
        };

        return (
            <div className="bg-white rounded-lg border border-gray-200 transition-shadow hover:shadow-xl flex flex-col">
                <Link to={`${record.id}`}>
                    <div className="p-4 border-b border-gray-300">
                        <div className="flex justify-between items-start gap-2">
                            <div>
                                <h3 className="font-bold text-gray-800 text-lg">
                                    Protocolo: {record.protocolo}
                                </h3>
                            </div>
                            <StatusBadge status={record.status} />
                        </div>
                        {record.isTituloAntigo && (
                            <div className="mt-2">
                                <span className="inline-flex items-center gap-1.5 bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                                    <Book size={12} />
                                    Livro Antigo
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="p-4 grid grid-cols-2 gap-4 text-sm flex-grow">
                        <div className="InfoItem"><Landmark className="Icon" /><div><p className="Label">Protocolo</p><p className="Value">{record.protocolo}</p></div></div>
                        <div className="InfoItem"><Wallet className="Icon" /><div><p className="Label">Valor</p><p className="Value">R$ {record.valor.toFixed(2)}</p></div></div>
                        <div className="InfoItem"><Briefcase className="Icon" /><div><p className="Label">Apresentante</p><p className="Value truncate">{presenterName}</p></div></div>
                        <div className="InfoItem"><FileText className="Icon" /><div><p className="Label">Espécie</p><p className="Value">{record.especieTitulo}</p></div></div>
                        <div className="InfoItem"><CalendarDays className="Icon" /><div><p className="Label">Apontamento</p><p className="Value">{record.apontamento?.dataApontamento.toLocaleDateString('pt-BR')}</p></div></div>
                        <div className="InfoItem"><AlertTriangle className="Icon text-red-500" /><div><p className="Label">Prazo Final</p><p className="Value font-bold text-red-600">{record.dataPrazoFinal ? record.dataPrazoFinal.toLocaleDateString('pt-BR') : 'N/A'}</p></div></div>
                    </div>
                </Link>

                <div className="p-3 bg-gray-50 border-t border-gray-300 flex justify-end items-center gap-2">
                    {renderActions()}
                </div>
            </div>
        );
    }

    return (
        <>
            <style>{`
                .InfoItem { display: flex; align-items: flex-start; gap: 0.5rem; }
                .Icon { height: 1rem; width: 1rem; margin-top: 0.125rem; color: #9ca3af; }
                .Label { font-size: 0.75rem; color: #6b7280; }
                .Value { font-weight: 500; color: #374151; }
                .ActionButton { display: flex; align-items: center; gap: 0.5rem; color: white; padding: 0.5rem 0.75rem; border-radius: 0.5rem; font-size: 0.875rem; font-weight: 600; transition: background-color 0.2s; }
            `}</style>
            <title>Gerenciamento de Títulos</title>
            <div className="flex bg-gray-50 min-h-screen font-sans">
                <main className="flex-1">
                    <div className="mx-auto space-y-4">
                        <header className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-[#4a4e51]">Gerenciamento de Títulos</h1>
                                <p className="text-md text-gray-500 mt-1">Consulte, gerencie e processe todos os títulos do tabelionato.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Link
                                    to="/protesto-titulos/importar-titulos"
                                    className="flex items-center gap-2 bg-gray-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-gray-700 transition-colors"
                                >
                                    <Upload className="h-5 w-5" />
                                    Importar Títulos (CRA)
                                </Link>
                                <Link
                                    to="novo"
                                    className="flex items-center gap-2 bg-[#dd6825] text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-[#c25a1f] transition-colors"
                                >
                                    <PlusCircle className="h-5 w-5" />
                                    Novo Apontamento
                                </Link>
                            </div>
                        </header>

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
                                    <div className="p-5 space-y-4 border-t border-gray-200">

                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-600 mb-1">Protocolo, Nº Título, Devedor</label>
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                    <input
                                                        id="searchTerm" type="text" name="searchTerm"
                                                        value={filters.searchTerm} onChange={handleFilterChange}
                                                        placeholder="Digite para buscar..."
                                                        className="border border-gray-300 rounded-md pl-10 pr-4 py-2 w-full focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label htmlFor="status" className="block text-sm font-medium text-gray-600 mb-1">Status do Título</label>
                                                <select
                                                    id="status" name="status"
                                                    value={filters.status} onChange={handleFilterChange}
                                                    className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]"
                                                >
                                                    <option value="Todos">Todos</option>
                                                    {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-1">Tipo de Título</label>
                                                <select name="isTituloAntigo" value={filters.isTituloAntigo} onChange={handleFilterChange} className="border border-gray-300 rounded-md px-3 py-2 w-full">
                                                    <option value="Todos">Todos</option>
                                                    <option value="Novos">Novos</option>
                                                    <option value="Antigos">Antigos</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* --- FILTROS EM GRADE --- */}
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                                            <div>
                                                <label htmlFor="especieTitulo" className="block text-sm font-medium text-gray-600 mb-1">Espécie do Título</label>
                                                <select
                                                    id="especieTitulo" name="especieTitulo"
                                                    value={filters.especieTitulo} onChange={handleFilterChange}
                                                    className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]"
                                                >
                                                    <option value="Todos">Todas</option>
                                                    {especieOptions.map(e => <option key={e} value={e}>{e}</option>)}
                                                </select>
                                            </div>

                                            {/* --- CAMPO DE BUSCA DE BANCO --- */}
                                            <div>
                                                <BancoSelect
                                                    label="Banco"
                                                    selectedBankCode={filters.banco === 'Todos' ? undefined : parseInt(filters.banco)}
                                                    onBankSelect={(banco) => {
                                                        setFilters(prev => ({ ...prev, banco: banco ? banco.code.toString() : 'Todos' }));
                                                    }}
                                                />
                                            </div>

                                            {/* --- PERÍODO DE APONTAMENTO --- */}
                                            <div>
                                                <label htmlFor="startDate" className="block text-sm font-medium text-gray-600 mb-1">Período de Apontamento</label>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="date" id="startDate" name="startDate"
                                                        value={filters.startDate} onChange={handleFilterChange}
                                                        className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]"
                                                    />
                                                    <span className="text-gray-500">até</span>
                                                    <input
                                                        type="date" name="endDate"
                                                        value={filters.endDate} onChange={handleFilterChange}
                                                        className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* --- BOTÃO DE LIMPAR --- */}
                                        <div className="flex justify-end pt-2">
                                            <button
                                                type="button" onClick={handleClearFilters}
                                                className="flex items-center gap-2 bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                                            >
                                                <FilterX className="h-5 w-5" />
                                                Limpar Filtros
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="min-h-[400px] relative">
                            {isLoading ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50 rounded-xl z-10"><Loader2 className="h-10 w-10 text-[#dd6825] animate-spin" /></div>
                            ) : paginatedRecords.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                                    {paginatedRecords.map(record => (
                                        <TitleCard key={record.id} record={record} />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center text-center text-gray-500 bg-white rounded-xl h-full border-2 border-dashed py-10">
                                    <ListX className="h-12 w-12 mb-4" />
                                    <h3 className="text-lg font-semibold">Nenhum título encontrado</h3>
                                    <p>Tente ajustar ou limpar os filtros para ver mais resultados.</p>
                                </div>
                            )}
                        </div>

                        <nav className="flex items-center justify-between pt-4">
                            <p className="text-sm text-gray-600">
                                Mostrando <span className="font-semibold">{paginatedRecords.length > 0 ? ((currentPage - 1) * recordsPerPage) + 1 : 0}</span> a <span className="font-semibold">{Math.min(currentPage * recordsPerPage, filteredRecords.length)}</span> de <span className="font-semibold">{filteredRecords.length}</span> títulos
                            </p>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1 || isLoading} className="p-2 rounded-md transition-colors bg-white border text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronLeft className="h-5 w-5" /></button>
                                <span className="text-sm font-semibold text-gray-700">Página {currentPage} de {totalPages > 0 ? totalPages : 1}</span>
                                <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0 || isLoading} className="p-2 rounded-md transition-colors bg-white border text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronRight className="h-5 w-5" /></button>
                            </div>
                        </nav>
                    </div>
                </main>
            </div>
        </>
    );
}