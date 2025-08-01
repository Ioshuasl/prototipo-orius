import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, ChevronLeft, ChevronRight, FileText, FilterX, Loader2, ListX, SlidersHorizontal, ChevronUp, MoreVertical, User, Download, Eye, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';

import { mockSelosAvulsos } from '../lib/Constants'; // Supondo que o mock está nesse caminho
import { type ISeloAvulsoFormData, type SeloAvulsoStatus, type AtoOriginalTipo } from '../types'; // Supondo que as interfaces estão nesse caminho

// --- DEFINIÇÕES DE STATUS PARA SELO AVULSO ---
const statusOptions: SeloAvulsoStatus[] = ['Em Aberto', 'Finalizado', 'Cancelado'];
const atoOptions: AtoOriginalTipo[] = ['Nascimento', 'Casamento', 'Óbito', 'Natimorto', 'Livro E'];

const statusStyles: Record<SeloAvulsoStatus, { text: string, bg: string, border: string, topBorder: string }> = {
    'Finalizado': { text: 'text-green-800', bg: 'bg-green-100', border: 'border-green-200', topBorder: 'border-t-green-500' },
    'Em Aberto': { text: 'text-orange-800', bg: 'bg-orange-100', border: 'border-orange-200', topBorder: 'border-t-orange-500' },
    'Cancelado': { text: 'text-red-800', bg: 'bg-red-100', border: 'border-red-200', topBorder: 'border-t-red-500' },
};

// --- COMPONENTE PRINCIPAL DA PÁGINA ---
export default function GerenciamentoSelosAvulsosPage() {
    const initialFilters = { searchTerm: '', status: 'Todos', tipoAto: 'Todos', startDate: '', endDate: '' };

    const [filters, setFilters] = useState(initialFilters);
    const [filteredRecords, setFilteredRecords] = useState<ISeloAvulsoFormData[]>(mockSelosAvulsos);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [filtersVisible, setFiltersVisible] = useState(false);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null); // Usando protocolo (string) como ID
    const recordsPerPage = 9;

    // Efeito para fechar o menu se o usuário clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (openMenuId !== null && !(event.target as Element).closest('.action-menu-container')) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openMenuId]);

    // Efeito para filtrar os registros
    useEffect(() => {
        setIsLoading(true);
        const filterTimeout = setTimeout(() => {
            const results = mockSelosAvulsos.filter(record => {
                const searchTermMatch = filters.searchTerm ?
                    record.protocolo.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                    (record.requerente.nome || record.requerente.razaoSocial || '').toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                    record.referenciaAto.nomePartePrincipal.toLowerCase().includes(filters.searchTerm.toLowerCase())
                    : true;

                const statusMatch = filters.status !== 'Todos' ? record.status === filters.status : true;
                const tipoAtoMatch = filters.tipoAto !== 'Todos' ? record.referenciaAto.tipoAto === filters.tipoAto : true;

                // A data da solicitação no mock é YYYY-MM-DD, convertemos para comparação
                const parseDate = (dateString: string) => new Date(dateString + 'T00:00:00');
                const solicitationDate = parseDate(record.dataSolicitacao);
                const startDateMatch = filters.startDate ? solicitationDate >= new Date(filters.startDate + 'T00:00:00') : true;
                const endDateMatch = filters.endDate ? solicitationDate <= new Date(filters.endDate + 'T23:59:59') : true;

                return searchTermMatch && statusMatch && tipoAtoMatch && startDateMatch && endDateMatch;
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

    const handleClearFilters = () => setFilters(initialFilters);

    const handleMenuAction = (action: string, recordId: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toast.info(`Ação: "${action}" para o pedido: ${recordId}`);
        setOpenMenuId(null);
    };

    const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
    const paginatedRecords = filteredRecords.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

    // --- SUB-COMPONENTES DE UI ---
    const StatusBadge = ({ status }: { status: SeloAvulsoStatus }) => {
        const style = statusStyles[status] || {};
        return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${style.text} ${style.bg} ${style.border}`}>{status}</span>;
    };

    const SeloAvulsoCard = ({ record }: { record: ISeloAvulsoFormData }) => {
        const cardTopBorderStyle = statusStyles[record.status]?.topBorder || 'border-t-gray-200';
        const isMenuOpen = openMenuId === record.protocolo;
        const totalSelos = record.selosSolicitados.reduce((acc, selo) => acc + selo.quantidade, 0);

        const toggleMenu = (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setOpenMenuId(isMenuOpen ? null : record.protocolo);
        };

        return (
            <div className="relative">
                <Link to={`${record.protocolo}`} className="block group">
                    <div className={`bg-white rounded-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:border-gray-300 overflow-hidden border-t-4 ${cardTopBorderStyle}`}>
                        <div className="p-4 border-b border-gray-100">
                            <h3 className="font-bold text-gray-800 text-base leading-tight group-hover:text-blue-600 transition-colors pr-8">
                                Pedido de {totalSelos} Selo(s) Avulso(s)
                            </h3>
                            <p className="text-sm text-gray-500 truncate mt-2">
                                Ref. ao Ato de {record.referenciaAto.tipoAto}: {record.referenciaAto.nomePartePrincipal}
                            </p>
                        </div>
                        <div className="pl-4 py-3 grid grid-cols-2 gap-3 text-sm bg-gray-50/50">
                            <div className="col-span-2 flex items-start gap-2"><FileText className="h-4 w-4 mt-0.5 text-gray-400" /><div><p className="text-xs text-gray-500">Protocolo</p><p className="font-medium text-gray-700">{record.protocolo}</p></div></div>
                            <div className="col-span-2 flex items-start gap-2"><User className="h-4 w-4 mt-0.5 text-gray-400" /><div><p className="text-xs text-gray-500">Requerente</p><p className="font-medium text-gray-700">{record.requerente.nome || record.requerente.razaoSocial}</p></div></div>
                        </div>
                        <div className="p-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                            <span>Solicitado em: {new Date(record.dataSolicitacao + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
                            <StatusBadge status={record.status} />
                        </div>
                    </div>
                </Link>

                <div className="absolute top-3 right-3 action-menu-container">
                    <button onClick={toggleMenu} className="p-2 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-700">
                        <MoreVertical className="h-5 w-5" />
                    </button>
                    {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                            <div className="py-1">
                                <a href="#" onClick={(e) => handleMenuAction('Visualizar Detalhes', record.protocolo, e)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><Eye size={16} /> Visualizar Detalhes</a>
                                <a href="#" onClick={(e) => handleMenuAction('Gerar Recibo', record.protocolo, e)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><Download size={16} /> Gerar Recibo PDF</a>
                                <div className="my-1 border-t border-gray-100"></div>
                                <a href="#" onClick={(e) => handleMenuAction('Cancelar Pedido', record.protocolo, e)} className="flex items-center gap-3 px-4 py-2 text-sm text-red-700 hover:bg-red-50"><XCircle size={16} /> Cancelar Pedido</a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // --- RENDERIZAÇÃO PRINCIPAL ---
    return (
        <>
            <title>Gerenciamento de Selos Avulsos</title>
            <div className="max-w-7xl mx-auto space-y-6">
                <header className="flex items-center justify-between">
                    <div><h1 className="text-3xl font-bold text-gray-800">Gerenciamento de Selos Avulsos</h1><p className="text-md text-gray-500 mt-1">Consulte e gerencie as emissões de selos avulsos.</p></div>
                    <Link to="emitir" className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition-all duration-300 hover:scale-105">
                        <PlusCircle className="h-5 w-5" /> Nova Emissão Avulsa
                    </Link>
                </header>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center p-4 cursor-pointer" onClick={() => setFiltersVisible(!filtersVisible)}>
                        <div className="flex items-center gap-3"><SlidersHorizontal className="h-5 w-5 text-gray-600" /><h2 className="font-semibold text-gray-800 text-lg">Filtros de Busca</h2></div>
                        <button className="p-1 rounded-full hover:bg-gray-100"><ChevronUp className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${!filtersVisible && 'rotate-180'}`} /></button>
                    </div>
                    <div className={`grid transition-all duration-500 ease-in-out ${filtersVisible ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                        <div className="overflow-hidden">
                            <div className="p-5 space-y-4">
                                <div><label htmlFor="searchTerm" className="block text-sm font-medium text-gray-600 mb-1">Buscar por Protocolo, Requerente ou Parte Referente</label><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input id="searchTerm" type="text" name="searchTerm" value={filters.searchTerm} onChange={handleFilterChange} placeholder="Digite para buscar..." className="border border-gray-300 rounded-md pl-10 pr-4 py-2 w-full" /></div></div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="tipoAto" className="block text-sm font-medium text-gray-600 mb-1">Tipo de Ato de Referência</label>
                                        <select id="tipoAto" name="tipoAto" value={filters.tipoAto} onChange={handleFilterChange} className="border border-gray-300 rounded-md px-3 py-2 w-full">
                                            <option>Todos</option>
                                            {atoOptions.map(s => <option key={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="status" className="block text-sm font-medium text-gray-600 mb-1">Status do Pedido</label>
                                        <select id="status" name="status" value={filters.status} onChange={handleFilterChange} className="border border-gray-300 rounded-md px-3 py-2 w-full">
                                            <option>Todos</option>
                                            {statusOptions.map(s => <option key={s}>{s}</option>)}
                                        </select>
                                    </div>
                                </div>
                                
                                <div className='flex flex-wrap gap-4 items-end'>
                                    <div className='flex flex-col flex-1 gap-1 min-w-[300px]'>
                                        <label className="block text-sm font-medium text-gray-600">Período da Solicitação</label>
                                        <div className="flex items-center gap-2">
                                            <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="border border-gray-300 rounded-md px-3 py-2 w-full" /><span className="text-gray-500">até</span>
                                            <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="border border-gray-300 rounded-md px-3 py-2 w-full" />
                                        </div>
                                    </div>
                                    <div className="flex justify-end"><button type="button" onClick={handleClearFilters} className="flex items-center gap-2 bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"><FilterX className="h-5 w-5" />Limpar Filtros</button></div>
                                </div>
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
                                <SeloAvulsoCard key={record.protocolo} record={record} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center text-gray-500 bg-white rounded-xl h-full border-2 border-dashed py-10">
                            <ListX className="h-12 w-12 mb-4" /><h3 className="text-lg font-semibold">Nenhum pedido de selo avulso encontrado</h3><p>Tente ajustar ou limpar os filtros para ver mais resultados.</p>
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