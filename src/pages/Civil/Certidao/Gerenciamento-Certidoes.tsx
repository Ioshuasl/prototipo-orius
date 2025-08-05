import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, ChevronLeft, ChevronRight, FileText, FilterX, Loader2, ListX, SlidersHorizontal, ChevronUp, MoreVertical, User, Download, Edit, Send, XCircle } from 'lucide-react';
import { atoOptions, certidaoPorAto } from '../lib/Constants';
import { toast } from 'react-toastify';
import { type CertidaoRequest, type AtoOriginalTipo, type CertidaoStatus } from '../types';

// --- DADOS E LÓGICA (INALTERADOS) ---
const mockCertidaoRequests: CertidaoRequest[] = Array.from({ length: 40 }, (_, i) => {
    const dataSolicitacao = new Date(2025, 3, 20 - i);
    const tipoAto = atoOptions[i % atoOptions.length] as AtoOriginalTipo;
    const tiposDeCertidaoParaOAto = certidaoPorAto[tipoAto] || [];
    const tipoCertidao = tiposDeCertidaoParaOAto.length > 0 ? tiposDeCertidaoParaOAto[i % tiposDeCertidaoParaOAto.length].titulo_servico: '';

    return {
        id: i + 1,
        protocolo: `CERT-2025-${String(70000 + i).padStart(5, '0')}`,
        tipoAto: tipoAto,
        tipoCertidao: String(tipoCertidao),
        formato: (i % 2 === 0 ? 'Digital' : 'Física'),
        atoOriginal: {
            nomePrincipal: `Fulano de Tal & Ciclana de Souza ${i + 1}`,
            matricula: `123456015520241001015001234500000${i + 1}`.slice(0, 32),
        },
        solicitante: `Beltrano de Oliveira ${i + 1}`,
        dataSolicitacao: dataSolicitacao.toLocaleDateString('pt-BR'),
        dataEmissao: (i % 4 !== 1) ? new Date(dataSolicitacao.getTime() + (1 * 24 * 60 * 60 * 1000)).toLocaleDateString('pt-BR') : undefined,
        status: ['Emitida', 'Pendente', 'Retirada', 'Cancelada'][i % 4] as CertidaoStatus,
    };
});

const statusOptions: CertidaoStatus[] = ['Emitida', 'Pendente', 'Retirada', 'Cancelada'];

// ALTERADO: Status "Emitida" ajustado de azul para cinza para melhor harmonia com a paleta.
const statusStyles: Record<CertidaoStatus, { text: string, bg: string, border: string, topBorder: string }> = {
    Retirada: { text: 'text-gray-800', bg: 'bg-gray-100', border: 'border-gray-200', topBorder: 'border-t-gray-500' },
    Pendente: { text: 'text-orange-800', bg: 'bg-orange-100', border: 'border-orange-200', topBorder: 'border-t-orange-500' },
    Emitida: { text: 'text-green-800', bg: 'bg-green-100', border: 'border-green-200', topBorder: 'border-t-green-500' },
    Cancelada: { text: 'text-red-800', bg: 'bg-red-100', border: 'border-red-200', topBorder: 'border-t-red-500' },
};

export default function GerenciamentoCertidoesPage() {
    const initialFilters = { searchTerm: '', status: 'Todos', tipoAto: 'Todos', tipoCertidao: 'Todos', formato: 'Todos', startDate: '', endDate: '' };

    const [filters, setFilters] = useState(initialFilters);
    const [filteredRecords, setFilteredRecords] = useState<CertidaoRequest[]>(mockCertidaoRequests);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [filtersVisible, setFiltersVisible] = useState(false);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const recordsPerPage = 9;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (openMenuId !== null && !(event.target as Element).closest('.action-menu-container')) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openMenuId]);

    useEffect(() => {
        setFilters(prev => ({ ...prev, tipoCertidao: 'Todos' }));
    }, [filters.tipoAto]);

    useEffect(() => {
        setIsLoading(true);
        const filterTimeout = setTimeout(() => {
            const results = mockCertidaoRequests.filter(record => {
                const searchTermMatch = filters.searchTerm ?
                    record.protocolo.includes(filters.searchTerm) ||
                    record.solicitante.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                    record.atoOriginal.nomePrincipal.toLowerCase().includes(filters.searchTerm.toLowerCase())
                    : true;
                const statusMatch = filters.status !== 'Todos' ? record.status === filters.status : true;
                const formatoMatch = filters.formato !== 'Todos' ? record.formato === filters.formato : true;
                const tipoAtoMatch = filters.tipoAto !== 'Todos' ? record.tipoAto === filters.tipoAto : true;
                const tipoCertidaoMatch = filters.tipoCertidao !== 'Todos' ? record.tipoCertidao === filters.tipoCertidao : true;

                const parseDate = (dateString: string) => { const [d, m, y] = dateString.split('/'); return new Date(`${y}-${m}-${d}`); };
                const solicitationDate = parseDate(record.dataSolicitacao);
                const startDateMatch = filters.startDate && solicitationDate ? solicitationDate >= new Date(filters.startDate + 'T00:00:00') : true;
                const endDateMatch = filters.endDate && solicitationDate ? solicitationDate <= new Date(filters.endDate + 'T23:59:59') : true;

                return searchTermMatch && statusMatch && formatoMatch && startDateMatch && endDateMatch && tipoAtoMatch && tipoCertidaoMatch;
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

    const handleMenuAction = (action: string, recordId: number, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toast.info(`Ação: "${action}" para o registro ID: ${recordId}`);
        setOpenMenuId(null);
    };

    const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
    const paginatedRecords = filteredRecords.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

    const StatusBadge = ({ status }: { status: CertidaoStatus }) => {
        const style = statusStyles[status] || {};
        return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${style.text} ${style.bg} ${style.border}`}>{status}</span>;
    };

    const CertidaoCard = ({ record }: { record: CertidaoRequest }) => {
        const isMenuOpen = openMenuId === record.id;

        const toggleMenu = (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setOpenMenuId(isMenuOpen ? null : record.id);
        };

        return (
            <div className="relative">
                <Link to={`/registro-civil/certidoes/${record.id}`} className="block group">
                    <div className={`bg-white rounded-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:border-gray-300 overflow-hidden`}>
                        <div className="p-4 border-b border-gray-100">
                            <div className="flex justify-between items-start gap-2">
                                {/* ALTERADO: Cor do hover no título do card */}
                                <h3 className="font-bold text-gray-800 text-base leading-tight group-hover:transition-colors pr-8">
                                    {record.tipoCertidao}
                                </h3>
                            </div>

                            <p className="text-sm text-gray-500 truncate mt-2">
                                Ato Original ({record.tipoAto}): {record.atoOriginal.nomePrincipal}
                            </p>
                        </div>
                        <div className="pl-4 grid grid-cols-2 gap-2 text-sm bg-gray-50/50">
                            <div className="col-span-2 flex items-start gap-2"><FileText className="h-4 w-4 mt-0.5 text-gray-400" /><div><p className="text-xs text-gray-500">Protocolo da Certidão</p><p className="font-medium text-gray-700">{record.protocolo}</p></div></div>
                            <div className="col-span-2 flex items-start gap-2"><User className="h-4 w-4 mt-0.5 text-gray-400" /><div><p className="text-xs text-gray-500">Solicitante</p><p className="font-medium text-gray-700">{record.solicitante}</p></div></div>
                        </div>
                        <div className="p-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                            <span>Solicitado em: {record.dataSolicitacao}</span>
                            {record.dataEmissao && <span>Emitido em: {record.dataEmissao}</span>}
                        </div>
                        <div className="mb-4 ml-4">
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
                                <a href="#" onClick={(e) => handleMenuAction('Baixar PDF', record.id, e)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><Download size={16} /> Baixar certidão em PDF</a>
                                <a href="#" onClick={(e) => handleMenuAction('Editar', record.id, e)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><Edit size={16} /> Editar certidão</a>
                                <a href="#" onClick={(e) => handleMenuAction('Enviar via CRC', record.id, e)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><Send size={16} /> Enviar certidão CRC</a>
                                <div className="my-1 border-t border-gray-100"></div>
                                <a href="#" onClick={(e) => handleMenuAction('Cancelar', record.id, e)} className="flex items-center gap-3 px-4 py-2 text-sm text-red-700 hover:bg-red-50"><XCircle size={16} /> Cancelar certidão</a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <>
            <title>Gerenciamento de Certidões | Orius Tecnologia</title>
            <div className="mx-auto space-y-4">
                <header className="flex items-center justify-between">
                    {/* ALTERADO: Cor do título e do botão principal */}
                    <div><h1 className="text-3xl font-bold text-[#4a4e51]">Gerenciamento de Certidões</h1><p className="text-md text-gray-500 mt-1">Consulte e gerencie as solicitações de certidões.</p></div>
                    <Link to="/registro-civil/certidoes/emitir" className="flex items-center gap-2 bg-[#dd6825] text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-[#c25a1f] transition-all duration-300 hover:scale-105">
                        <PlusCircle className="h-5 w-5" /> Nova Solicitação
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
                                {/* ALTERADO: Estilos de foco nos inputs e selects */}
                                <div><label htmlFor="searchTerm" className="block text-sm font-medium text-gray-600 mb-1">Buscar por Protocolo, Solicitante ou Parte</label><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input id="searchTerm" type="text" name="searchTerm" value={filters.searchTerm} onChange={handleFilterChange} placeholder="Digite para buscar..." className="border border-gray-300 rounded-md pl-10 pr-4 py-2 w-full focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]" /></div></div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div>
                                        <label htmlFor="tipoAto" className="block text-sm font-medium text-gray-600 mb-1">Tipo de Ato Original</label>
                                        <select id="tipoAto" name="tipoAto" value={filters.tipoAto} onChange={handleFilterChange} className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]">
                                            <option>Todos</option>
                                            {atoOptions.map(s => <option key={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="tipoCertidao" className="block text-sm font-medium text-gray-600 mb-1">Tipo de Certidão</label>
                                        <select id="tipoCertidao" name="tipoCertidao" value={filters.tipoCertidao} onChange={handleFilterChange} className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]" disabled={filters.tipoAto === 'Todos'}>
                                            <option>Todos</option>
                                            {filters.tipoAto !== 'Todos' && certidaoPorAto[filters.tipoAto]?.map(s => (
                                                <option key={s.titulo_servico}>{s.titulo_servico}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="status" className="block text-sm font-medium text-gray-600 mb-1">Status do Pedido</label>
                                        <select id="status" name="status" value={filters.status} onChange={handleFilterChange} className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]">
                                            <option>Todos</option>
                                            {statusOptions.map(s => <option key={s}>{s}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className='flex items-end gap-4'>
                                    <div className='flex flex-col flex-1 gap-1'>
                                        <label className="block text-sm font-medium text-gray-600">Período da Solicitação</label>
                                        <div className="flex items-center gap-2">
                                            <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]" /><span className="text-gray-500">até</span>
                                            <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]" />
                                        </div>
                                    </div>
                                    <button type="button" onClick={handleClearFilters} className="flex items-center gap-2 bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors h-fit"><FilterX className="h-5 w-5" />Limpar Filtros</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="min-h-[400px] relative">
                    {/* ALTERADO: Cor do ícone de carregamento */}
                    {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50 rounded-xl z-10"><Loader2 className="h-10 w-10 text-[#dd6825] animate-spin" /></div>
                    ) : paginatedRecords.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                            {paginatedRecords.map(record => (
                                <CertidaoCard key={record.id} record={record} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center text-gray-500 bg-white rounded-xl h-full border-2 border-dashed py-10">
                            <ListX className="h-12 w-12 mb-4" /><h3 className="text-lg font-semibold">Nenhuma certidão encontrada</h3><p>Tente ajustar ou limpar os filtros para ver mais resultados.</p>
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