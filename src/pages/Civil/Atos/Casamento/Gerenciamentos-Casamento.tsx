import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, ChevronLeft, ChevronRight, BookKey, FilterX, Loader2, ListX, SlidersHorizontal, ChevronUp, MoreVertical, Fingerprint, CalendarDays, Heart } from 'lucide-react';

// --- ESTRUTURA DE TIPOS E DADOS SIMULADOS ---
type RecordStatus = 'Finalizado' | 'Rascunho' | 'Pendente Assinatura' | 'Cancelado';

interface MarriageRecord {
    id: number;
    protocol: string;
    groomName: string;
    brideName: string;
    cpfGroom: string;
    cpfBride: string;
    weddingDate: string;
    registrationDate: string;
    lavraturaDate: string;
    status: RecordStatus;
    isOldBook: boolean;
    livro: string;
}

const livrosCasamentoExemplo = ['C-201', 'C-202', 'D-15', 'E-22'];
const mockMarriageRecords: MarriageRecord[] = Array.from({ length: 28 }, (_, i) => {
    const registrationDate = new Date(2025, 6, 25 - i);
    const lavraturaDate = new Date(registrationDate.getTime() + (3 * 24 * 60 * 60 * 1000));
    const weddingDate = new Date(registrationDate.getTime() - (7 * 24 * 60 * 60 * 1000));

    return {
        id: i + 1,
        protocol: `2025-C-${String(23456 + i).padStart(5, '0')}`,
        groomName: `Noivo Exemplo Feliz ${i + 1}`,
        brideName: `Noiva Exemplo Radiante ${i + 1}`,
        cpfGroom: `987.654.321-${String(20 + i).padStart(2, '0')}`,
        cpfBride: `111.222.333-${String(30 + i).padStart(2, '0')}`,
        weddingDate: weddingDate.toLocaleDateString('pt-BR'),
        registrationDate: registrationDate.toLocaleDateString('pt-BR'),
        lavraturaDate: lavraturaDate.toLocaleDateString('pt-BR'),
        status: ['Finalizado', 'Rascunho', 'Pendente Assinatura'][i % 3] as RecordStatus,
        isOldBook: i % 4 === 0,
        livro: livrosCasamentoExemplo[(i + 1) % livrosCasamentoExemplo.length],
    };
});

const statusOptions: RecordStatus[] = ['Finalizado', 'Rascunho', 'Pendente Assinatura', 'Cancelado'];
const bookOptions = [...new Set(mockMarriageRecords.map(record => record.livro))];

// --- CORREÇÃO: Definindo estilos em um único lugar ---
const statusStyles: Record<RecordStatus, { text: string, bg: string, border: string, topBorder: string }> = {
    Finalizado: { text: 'text-green-800', bg: 'bg-green-100', border: 'border-green-200', topBorder: 'border-t-green-500' },
    Rascunho: { text: 'text-yellow-800', bg: 'bg-yellow-100', border: 'border-yellow-200', topBorder: 'border-t-yellow-500' },
    'Pendente Assinatura': { text: 'text-orange-800', bg: 'bg-orange-100', border: 'border-orange-200', topBorder: 'border-t-orange-500' },
    Cancelado: { text: 'text-red-800', bg: 'bg-red-100', border: 'border-red-200', topBorder: 'border-t-red-500' },
};


// --- COMPONENTE PRINCIPAL DA PÁGINA ---

export default function MarriageRecordsManagementPage() {
    const initialFilters = {
        searchTerm: '', status: 'Todos', startDate: '', endDate: '',
        lavraturaStartDate: '', lavraturaEndDate: '', livro: 'Todos', isOldBook: 'Todos',
        weddingStartDate: '', weddingEndDate: '',
    };

    const [filters, setFilters] = useState(initialFilters);
    const [filteredRecords, setFilteredRecords] = useState<MarriageRecord[]>(mockMarriageRecords);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [filtersVisible, setFiltersVisible] = useState(false);
    const recordsPerPage = 9;

    useEffect(() => {
        setIsLoading(true);
        const parseDate = (dateString: string): Date | null => {
            if (!dateString) return null;
            const parts = dateString.split('/');
            if (parts.length !== 3) return null;
            const [day, month, year] = parts.map(Number);
            const date = new Date(year, month - 1, day);
            date.setHours(0, 0, 0, 0);
            return date;
        };

        const filterTimeout = setTimeout(() => {
            const results = mockMarriageRecords.filter(record => {
                const searchTermMatch = filters.searchTerm ? record.groomName.toLowerCase().includes(filters.searchTerm.toLowerCase()) || record.brideName.toLowerCase().includes(filters.searchTerm.toLowerCase()) || record.protocol.includes(filters.searchTerm) || record.cpfGroom.includes(filters.searchTerm) || record.cpfBride.includes(filters.searchTerm) : true;
                const statusMatch = filters.status !== 'Todos' ? record.status === filters.status : true;
                const isOldBookMatch = filters.isOldBook !== 'Todos' ? record.isOldBook === (filters.isOldBook === 'Sim') : true;
                const livroMatch = filters.livro !== 'Todos' ? record.livro === filters.livro : true;
                const registrationDate = parseDate(record.registrationDate);
                const regStartDateMatch = filters.startDate && registrationDate ? registrationDate >= new Date(filters.startDate + 'T00:00:00') : true;
                const regEndDateMatch = filters.endDate && registrationDate ? registrationDate <= new Date(filters.endDate + 'T23:59:59') : true;
                const lavraturaDate = parseDate(record.lavraturaDate);
                const lavraturaStartDateMatch = filters.lavraturaStartDate && lavraturaDate ? lavraturaDate >= new Date(filters.lavraturaStartDate + 'T00:00:00') : true;
                const lavraturaEndDateMatch = filters.lavraturaEndDate && lavraturaDate ? lavraturaDate <= new Date(filters.lavraturaEndDate + 'T23:59:59') : true;
                const weddingDate = parseDate(record.weddingDate);
                const weddingStartDateMatch = filters.weddingStartDate && weddingDate ? weddingDate >= new Date(filters.weddingStartDate + 'T00:00:00') : true;
                const weddingEndDateMatch = filters.weddingEndDate && weddingDate ? weddingDate <= new Date(filters.weddingEndDate + 'T23:59:59') : true;
                return searchTermMatch && statusMatch && isOldBookMatch && livroMatch && regStartDateMatch && regEndDateMatch && lavraturaStartDateMatch && lavraturaEndDateMatch && weddingStartDateMatch && weddingEndDateMatch;
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

    const handleClearFilters = () => {
        setFilters(initialFilters);
    };

    const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
    const paginatedRecords = filteredRecords.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

    const StatusBadge = ({ status }: { status: RecordStatus }) => {
        const style = statusStyles[status] || {};
        // --- CORREÇÃO: Usando notação de colchetes ---
        return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${style.text} ${style.bg} ${style.border}`}>{status}</span>;
    };

    const RecordCard = ({ record }: { record: MarriageRecord }) => {
        // --- CORREÇÃO: Usando a constante de estilo global ---
        const cardTopBorderStyle = statusStyles[record.status]?.topBorder || 'border-t-gray-200';
        const handleActionsClick = (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            alert(`Ações para o protocolo: ${record.protocol}`);
        };
        return (
            <Link to={`/registro-civil/casamento/${record.id}`} className="block group">
                <div className={`bg-white rounded-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:border-gray-300 overflow-hidden border-t-4 ${cardTopBorderStyle}`}>
                    <div className="p-4 border-b border-gray-100">
                        <div className="flex justify-between items-start gap-4">
                            <div><h3 className="font-bold text-gray-800 text-lg leading-tight group-hover:text-blue-600 transition-colors">{record.groomName} <span className="text-gray-400 font-normal">&</span> {record.brideName}</h3><p className="text-sm text-gray-500">{record.cpfGroom} | {record.cpfBride}</p></div>
                            <StatusBadge status={record.status} />
                        </div>
                    </div>
                    <div className="p-4 grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-start gap-2"><Fingerprint className="h-4 w-4 mt-0.5 text-gray-400" /><div><p className="text-xs text-gray-500">Protocolo</p><p className="font-medium text-gray-700">{record.protocol}</p></div></div>
                        <div className="flex items-start gap-2"><BookKey className="h-4 w-4 mt-0.5 text-gray-400" /><div><p className="text-xs text-gray-500">Livro</p><p className="font-medium text-gray-700">{record.livro}</p></div></div>
                        <div className="flex items-start gap-2"><Heart className="h-4 w-4 mt-0.5 text-gray-400" /><div><p className="text-xs text-gray-500">Data do Casamento</p><p className="font-medium text-gray-700">{record.weddingDate}</p></div></div>
                        <div className="flex items-start gap-2"><CalendarDays className="h-4 w-4 mt-0.5 text-gray-400" /><div><p className="text-xs text-gray-500">Registro: {record.registrationDate}</p><p className="text-xs text-gray-500">Lavratura: {record.lavraturaDate}</p></div></div>
                    </div>
                    <div className="p-4 border-t border-gray-100 flex justify-between items-center">
                        {record.isOldBook ? (<span className="text-xs font-semibold text-purple-700 bg-purple-100 px-2 py-1 rounded">LIVRO ANTIGO</span>) : (<span></span>)}
                        <button onClick={handleActionsClick} className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700"><MoreVertical className="h-5 w-5" /></button>
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <>
            <title>Gerenciamento de Atos de Casamento</title>
            <div className="flex bg-gray-50 min-h-screen font-sans">
                <main className="flex-1">
                    <div className="max-w-7xl mx-auto space-y-6">
                        <header className="flex items-center justify-between">
                            <div><h1 className="text-3xl font-bold text-gray-800">Gerenciamento de Casamentos</h1><p className="text-md text-gray-500 mt-1">Consulte e gerencie os registros de casamento.</p></div>
                            <Link to="/registro-civil/casamento/cadastrar" className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition-all duration-300 hover:scale-105"><PlusCircle className="h-5 w-5" /> Registrar Novo</Link>
                        </header>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                            <div className="flex justify-between items-center p-4 cursor-pointer" onClick={() => setFiltersVisible(!filtersVisible)}>
                                <div className="flex items-center gap-3"><SlidersHorizontal className="h-5 w-5 text-gray-600" /><h2 className="font-semibold text-gray-800 text-lg">Filtros de Busca</h2></div>
                                <button className="p-1 rounded-full hover:bg-gray-100"><ChevronUp className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${!filtersVisible && 'rotate-180'}`} /></button>
                            </div>
                            <div className={`grid transition-all duration-500 ease-in-out ${filtersVisible ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                <div className="overflow-hidden">
                                    <div className="p-5 space-y-2 pt-0">
                                        <div><label htmlFor="searchTerm" className="block text-sm font-medium text-gray-600 mb-1">Buscar por Protocolo, Nome ou CPF dos Cônjuges</label><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input id="searchTerm" type="text" name="searchTerm" value={filters.searchTerm} onChange={handleFilterChange} placeholder="Digite para buscar..." className="border border-gray-300 rounded-md pl-10 pr-4 py-2 w-full" /></div></div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div><label htmlFor="status" className="block text-sm font-medium text-gray-600 mb-1">Status do Ato</label><select id="status" name="status" value={filters.status} onChange={handleFilterChange} className="border border-gray-300 rounded-md px-3 py-2 w-full"><option>Todos</option>{statusOptions.map(s => <option key={s}>{s}</option>)}</select></div>
                                            <div><label htmlFor="livro" className="block text-sm font-medium text-gray-600 mb-1">Número do Livro</label><select id="livro" name="livro" value={filters.livro} onChange={handleFilterChange} className="border border-gray-300 rounded-md px-3 py-2 w-full"><option>Todos</option>{bookOptions.map(b => <option key={b}>{b}</option>)}</select></div>
                                            <div><label htmlFor="isOldBook" className="block text-sm font-medium text-gray-600 mb-1">Livro Antigo?</label><select id="isOldBook" name="isOldBook" value={filters.isOldBook} onChange={handleFilterChange} className="border border-gray-300 rounded-md px-3 py-2 w-full"><option>Todos</option><option>Sim</option><option>Não</option></select></div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                            <div><label className="block text-sm font-medium text-gray-600 mb-1">Período do Registro</label><div className="flex items-center gap-2"><input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="border border-gray-300 rounded-md px-3 py-2 w-full" /><span className="text-gray-500">até</span><input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="border border-gray-300 rounded-md px-3 py-2 w-full" /></div></div>
                                            <div><label className="block text-sm font-medium text-gray-600 mb-1">Período da Lavratura</label><div className="flex items-center gap-2"><input type="date" name="lavraturaStartDate" value={filters.lavraturaStartDate} onChange={handleFilterChange} className="border border-gray-300 rounded-md px-3 py-2 w-full" /><span className="text-gray-500">até</span><input type="date" name="lavraturaEndDate" value={filters.lavraturaEndDate} onChange={handleFilterChange} className="border border-gray-300 rounded-md px-3 py-2 w-full" /></div></div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                            <div><label className="block text-sm font-medium text-gray-600 mb-1">Período do Casamento</label><div className="flex items-center gap-2"><input type="date" name="weddingStartDate" value={filters.weddingStartDate} onChange={handleFilterChange} className="border border-gray-300 rounded-md px-3 py-2 w-full" /><span className="text-gray-500">até</span><input type="date" name="weddingEndDate" value={filters.weddingEndDate} onChange={handleFilterChange} className="border border-gray-300 rounded-md px-3 py-2 w-full" /></div></div>
                                            <div className="flex justify-end pt-4"><button type="button" onClick={handleClearFilters} className="flex items-center gap-2 bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"><FilterX className="h-5 w-5" />Limpar Filtros</button></div>
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
                                        <RecordCard key={record.id} record={record} />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center text-center text-gray-500 bg-white rounded-xl h-full border-2 border-dashed py-10">
                                    <ListX className="h-12 w-12 mb-4" />
                                    <h3 className="text-lg font-semibold">Nenhum registro encontrado</h3>
                                    <p>Tente ajustar ou limpar os filtros para ver mais resultados.</p>
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
                </main>
            </div>
        </>
    );
}