import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, FilterX, Loader2, ListX, SlidersHorizontal, ChevronUp, Upload, AlertTriangle, Eye, X } from 'lucide-react';
import tabelaEmolumentos from '../../../../../tabela-emolumentos.json';
import { type SealBatch } from '../../types/types';
import { mockSealBatches } from '../../lib/Constants';

// --- ESTRUTURA DE TIPOS E DADOS SIMULADOS ---
type SealBatchStatus = 'Ativo' | 'Esgotado' | 'Baixado';
type Decendio = 'Todos' | '1º Decêndio' | '2º Decêndio' | '3º Decêndio';


const statusOptions: SealBatchStatus[] = ['Ativo', 'Esgotado', 'Baixado'];

// --- COMPONENTE DE BUSCA DE SELOS ---
type TabelaEmolumentosItem = typeof tabelaEmolumentos[0];

interface SeloSearchInputProps {
    selectedSeloId: number | null;
    onSeloSelect: (selo: TabelaEmolumentosItem) => void;
    onClear: () => void;
}

const SeloSearchInput: React.FC<SeloSearchInputProps> = ({ selectedSeloId, onSeloSelect, onClear }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    const selectedSelo = useMemo(() => {
        return tabelaEmolumentos.find(s => s.id_selo === selectedSeloId) || null;
    }, [selectedSeloId]);

    const filteredSelos = useMemo(() => {
        if (!searchTerm) return tabelaEmolumentos;
        const term = searchTerm.toLowerCase();
        return tabelaEmolumentos.filter(selo =>
            selo.descricao_selo.toLowerCase().includes(term) ||
            String(selo.id_selo).includes(term)
        );
    }, [searchTerm]);

    const handleSelect = (selo: TabelaEmolumentosItem) => {
        onSeloSelect(selo);
        setIsDropdownOpen(false);
        setSearchTerm('');
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        setIsDropdownOpen(true);
    };

    const handleClear = () => {
        onClear();
        setSearchTerm('');
        setIsDropdownOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={searchRef}>
            <label htmlFor="seloSearch" className="block text-sm font-medium text-gray-600 mb-1">Buscar por Selo</label>
            {selectedSelo ? (
                <div className="flex items-center justify-between border border-gray-300 rounded-md px-3 py-2 bg-gray-100">
                    <p className="text-sm text-gray-800 overflow-hidden text-ellipsis whitespace-nowrap pr-2">{selectedSelo.descricao_selo} (ID: {selectedSelo.id_selo})</p>
                    <button onClick={handleClear} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            ) : (
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        id="seloSearch"
                        type="text"
                        value={searchTerm}
                        onChange={handleInputChange}
                        onFocus={() => setIsDropdownOpen(true)}
                        placeholder="ID do Selo ou Descrição..."
                        className="border border-gray-300 rounded-md pl-10 pr-4 py-2 w-full focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]"
                    />
                </div>
            )}
            {isDropdownOpen && !selectedSelo && filteredSelos.length > 0 && (
                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
                    {filteredSelos.map(selo => (
                        <div
                            key={selo.id_selo}
                            onClick={() => handleSelect(selo)}
                            className="p-3 hover:bg-gray-100 cursor-pointer text-sm border-b border-gray-200 last:border-b-0"
                        >
                            {selo.descricao_selo} (ID: {selo.id_selo})
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


// --- COMPONENTE PRINCIPAL DA PÁGINA ---
export default function SealBatchManagementPage() {
    const navigate = useNavigate();
    const [selectedSelo, setSelectedSelo] = useState<TabelaEmolumentosItem | null>(null);

    const initialFilters = {
        status: 'Todos', startDate: '', endDate: '',
        decendio: 'Todos', mes: 'Todos', ano: 'Todos',
    };

    const [filters, setFilters] = useState(initialFilters);
    const [filteredBatches, setFilteredBatches] = useState<SealBatch[]>(mockSealBatches);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [filtersVisible, setFiltersVisible] = useState(false);
    const batchesPerPage = 10;
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDecendioWarningModalOpen, setIsDecendioWarningModalOpen] = useState(false);

    useEffect(() => {
        const today = new Date();
        const day = today.getDate();
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

        if ((day >= 8 && day <= 10) || (day >= 18 && day <= 20) || (day >= lastDayOfMonth -2 && day <= lastDayOfMonth)) {
             setIsDecendioWarningModalOpen(true);
        }

        setIsLoading(true);

        const filterTimeout = setTimeout(() => {
            const results = mockSealBatches.filter(batch => {
                const seloMatch = selectedSelo ? batch.tipo_ato_selo === selectedSelo.id_selo : true;

                const statusMatch = filters.status !== 'Todos' ? batch.status === filters.status : true;

                const batchDay = batch.dataCompra.getDate();
                const batchMonth = batch.dataCompra.getMonth().toString();
                const batchYear = batch.dataCompra.getFullYear().toString();

                const decendioMatch = filters.decendio === 'Todos' ||
                    (filters.decendio === '1º Decêndio' && batchDay >= 1 && batchDay <= 10) ||
                    (filters.decendio === '2º Decêndio' && batchDay >= 11 && batchDay <= 20) ||
                    (filters.decendio === '3º Decêndio' && batchDay >= 21);

                const mesMatch = filters.mes === 'Todos' || batchMonth === filters.mes;
                const anoMatch = filters.ano === 'Todos' || batchYear === filters.ano;

                const regStartDateMatch = filters.startDate ? batch.dataCompra >= new Date(filters.startDate) : true;
                const regEndDateMatch = filters.endDate ? batch.dataCompra <= new Date(filters.endDate + 'T23:59:59.999') : true;

                return seloMatch && statusMatch && decendioMatch && mesMatch && anoMatch && regStartDateMatch && regEndDateMatch;
            });

            const sortedResults = results.sort((a, b) => b.dataCompra.getTime() - a.dataCompra.getTime());

            setFilteredBatches(sortedResults);
            setCurrentPage(1);
            setIsLoading(false);
        }, 300);

        return () => clearTimeout(filterTimeout);
    }, [filters, selectedSelo]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleClearFilters = () => {
        setFilters(initialFilters);
        setSelectedSelo(null);
    };

    const handleSeloSelect = (selo: TabelaEmolumentosItem) => {
        setSelectedSelo(selo);
    };

    const handleClearSelo = () => {
        setSelectedSelo(null);
    };

    const handleViewDetails = (batch: SealBatch) => {
        navigate(`${batch.id}`);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        }
    };
    
    const handleConfirmImport = () => {
        if (!selectedFile) {
            alert('Por favor, selecione um arquivo XML para importar.');
            return;
        }

        if (selectedFile.type !== 'text/xml' && selectedFile.name.split('.').pop()?.toLowerCase() !== 'xml') {
            alert('O arquivo selecionado não é um arquivo XML.');
            return;
        }

        alert(`Simulando a importação do arquivo: ${selectedFile.name}`);

        setSelectedFile(null);
        setIsImportModalOpen(false);
    };

    const handleRedimensionarLotes = () => {
        alert('Simulando o redimensionamento dos lotes de selo. Esta funcionalidade será implementada para ajustar os selos do decêndio.');
        setIsDecendioWarningModalOpen(false);
    };

    const totalPages = Math.ceil(filteredBatches.length / batchesPerPage);
    const paginatedBatches = filteredBatches.slice((currentPage - 1) * batchesPerPage, currentPage * batchesPerPage);

    const StatusBadge = ({ status }: { status: SealBatchStatus }) => {
        const styles: Record<SealBatchStatus, string> = {
            Ativo: 'bg-green-100 text-green-800 border-green-200',
            Esgotado: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            Baixado: 'bg-red-100 text-red-800 border-red-200',
        };
        return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${styles[status]}`}>{status}</span>;
    };

    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const anos = ['2024', '2025', '2026'];

    return (
        <>
            <title>Gerenciamento de Lotes de Selos</title>
            <div className="flex bg-gray-50 font-sans">
                <main className="flex-1">
                    <div className="mx-auto space-y-4">
                        <header className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-[#4a4e51]">Gerenciamento de Lotes de Selos</h1>
                                <p className="text-md text-gray-500 mt-1">Gerencie os lotes de selos adquiridos e seus status.</p>
                            </div>
                            <div className='flex gap-4'>
                            <button
                                onClick={handleRedimensionarLotes}
                                className="bg-[#dd6825] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#c25a1f] transition-colors"
                            >
                                Redimensionar Lotes
                            </button>
                            <button
                                onClick={() => setIsImportModalOpen(true)}
                                className="flex items-center gap-2 bg-[#dd6825] text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-[#c25a1f] transition-all duration-300 hover:scale-105"
                            >
                                <Upload className="h-5 w-5" /> Importar Novo Lote
                            </button>
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
                                    <div className="p-5 space-y-2 pt-0">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <SeloSearchInput
                                                    selectedSeloId={selectedSelo ? selectedSelo.id_selo : null}
                                                    onSeloSelect={handleSeloSelect}
                                                    onClear={handleClearSelo}
                                                />
                                            </div>
                                            <div><label htmlFor="status" className="block text-sm font-medium text-gray-600 mb-1">Status</label><select id="status" name="status" value={filters.status} onChange={handleFilterChange} className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]"><option>Todos</option>{statusOptions.map(s => <option key={s}>{s}</option>)}</select></div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            <div><label htmlFor="decendio" className="block text-sm font-medium text-gray-600 mb-1">Decêndio</label><select id="decendio" name="decendio" value={filters.decendio} onChange={handleFilterChange} className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]"><option>Todos</option><option>1º Decêndio</option><option>2º Decêndio</option><option>3º Decêndio</option></select></div>
                                            <div><label htmlFor="mes" className="block text-sm font-medium text-gray-600 mb-1">Mês</label><select id="mes" name="mes" value={filters.mes} onChange={handleFilterChange} className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]"><option value="Todos">Todos</option>{meses.map((m, index) => <option key={index} value={index}>{m}</option>)}</select></div>
                                            <div><label htmlFor="ano" className="block text-sm font-medium text-gray-600 mb-1">Ano</label><select id="ano" name="ano" value={filters.ano} onChange={handleFilterChange} className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]"><option>Todos</option>{anos.map(a => <option key={a}>{a}</option>)}</select></div>
                                            <div className="flex justify-end pt-4 md:pt-0"><button type="button" onClick={handleClearFilters} className="flex items-center gap-2 bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"><FilterX className="h-5 w-5" />Limpar Filtros</button></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="min-h-[400px] relative">
                            {isLoading ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50 rounded-xl z-10"><Loader2 className="h-10 w-10 text-[#dd6825] animate-spin" /></div>
                            ) : paginatedBatches.length > 0 ? (
                                <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Data da Compra</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Descrição e ID do Selo</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Quantidade</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                                <th scope="col" className="relative px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Visualizar</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {paginatedBatches.map(batch => (
                                                <tr key={batch.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{batch.dataCompra.toLocaleDateString('pt-BR')}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs overflow-hidden text-ellipsis">{batch.descricao} (ID: {batch.tipo_ato_selo})</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{batch.quantidade}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><StatusBadge status={batch.status} /></td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <button
                                                            onClick={() => handleViewDetails(batch)}
                                                            className="text-gray-500 hover:text-[#dd6825] p-2 rounded-full hover:bg-gray-100 transition-colors"
                                                            aria-label="Visualizar Lote"
                                                        >
                                                            <Eye className="h-5 w-5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center text-center text-gray-500 bg-white rounded-xl h-full border-2 border-dashed py-10">
                                    <ListX className="h-12 w-12 mb-4" />
                                    <h3 className="text-lg font-semibold">Nenhum lote de selo encontrado</h3>
                                    <p>Tente ajustar ou limpar os filtros para ver mais resultados.</p>
                                </div>
                            )}
                        </div>

                        <nav className="flex items-center justify-between pt-4">
                            <p className="text-sm text-gray-600">
                                Mostrando <span className="font-semibold">{paginatedBatches.length > 0 ? ((currentPage - 1) * batchesPerPage) + 1 : 0}</span> a <span className="font-semibold">{Math.min(currentPage * batchesPerPage, filteredBatches.length)}</span> de <span className="font-semibold">{filteredBatches.length}</span> lotes
                            </p>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1 || isLoading} className="p-2 rounded-md transition-colors bg-white border text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronLeft className="h-5 w-5" /></button>
                                <span className="text-sm font-semibold text-gray-700">Página {currentPage} de {totalPages > 0 ? totalPages : 1}</span>
                                <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages || isLoading} className="p-2 rounded-md transition-colors bg-white border text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronRight className="h-5 w-5" /></button>
                            </div>
                        </nav>
                    </div>
                </main>
            </div>

            {/* --- MODAL DE AVISO DE DECÊNDIO --- */}
            {isDecendioWarningModalOpen && (
                <div className="fixed inset-0 z-50 flex justify-center items-center p-4 animate-fade-in-fast bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-sm max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center p-4 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800">Aviso de Decêndio!</h2>
                            <button onClick={() => setIsDecendioWarningModalOpen(false)} className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="p-6 text-center space-y-4">
                            <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto" />
                            <p className="text-gray-700">O período de apuração do decêndio está prestes a se encerrar. É recomendado redimensionar os lotes de selos para a próxima quinzena.</p>
                            <p className="text-xs text-gray-500">Esta é uma funcionalidade protótipo e não afeta os dados reais.</p>
                        </div>
                        <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
                            <button
                                onClick={() => setIsDecendioWarningModalOpen(false)} // Botão Entendo
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                            >
                                Entendo
                            </button>
                            <button
                                onClick={handleRedimensionarLotes}
                                className="bg-[#dd6825] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#c25a1f] transition-colors"
                            >
                                Redimensionar Lotes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- MODAL DE IMPORTAÇÃO DE LOTES --- */}
            {isImportModalOpen && (
                <div className="fixed inset-0 z-50 flex justify-center items-center p-4 animate-fade-in-fast bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center p-4 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800">Importar Novo Lote de Selos</h2>
                            <button onClick={() => setIsImportModalOpen(false)} className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="p-6">
                            <label htmlFor="file-input" className="block text-sm font-medium text-gray-700 mb-2">
                                Selecione o arquivo XML do lote de selos:
                            </label>
                            <input
                                id="file-input"
                                type="file"
                                accept=".xml"
                                onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])}
                                className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-violet-50 file:text-[#dd6825]
                                hover:file:bg-violet-100"
                            />
                            {selectedFile && (
                                <p className="mt-2 text-sm text-gray-600">Arquivo selecionado: <span className="font-semibold">{selectedFile.name}</span></p>
                            )}
                        </div>
                        <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setSelectedFile(null);
                                    setIsImportModalOpen(false);
                                }}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirmImport}
                                className="bg-[#dd6825] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#c25a1f] transition-colors"
                                disabled={!selectedFile}
                            >
                                Confirmar Importação
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}