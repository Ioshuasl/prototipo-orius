import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Upload, Search, X, CheckCircle, SlidersHorizontal, ChevronUp, FilterX } from 'lucide-react';
import { type Seal } from '../../types/types';
import tabelaEmolumentos from '../../../../../tabela-emolumentos.json';
import { mockSealBatches } from '../../lib/Constants';

type SealSituation = 'Disponível' | 'Utilizando' | 'Exportado' | 'Cancelado' | 'Redimensionado';
type TabelaEmolumentosItem = typeof tabelaEmolumentos[0];
type Decendio = 'Todos' | '1º Decêndio' | '2º Decêndio' | '3º Decêndio';

const getSituationBadgeStyles = (situation: SealSituation) => {
    switch (situation) {
        case 'Disponível': return 'bg-green-100 text-green-800 border-green-200';
        case 'Utilizando': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'Exportado': return 'bg-purple-100 text-purple-800 border-purple-200';
        case 'Cancelado': return 'bg-red-100 text-red-800 border-red-200';
        case 'Redimensionado': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

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


// --- COMPONENTE PRINCIPAL DA TELA ---
export default function ExportacaoSelos() {
    const navigate = useNavigate();

    const [filtersVisible, setFiltersVisible] = useState(false);
    const [filterPeriod, setFilterPeriod] = useState({
        decendio: 'Todos',
        mes: 'Todos',
        ano: 'Todos',
        startDate: '',
        endDate: ''
    });
    const [selectedSelo, setSelectedSelo] = useState<TabelaEmolumentosItem | null>(null);
    const [selectedSeals, setSelectedSeals] = useState<string[]>([]); // Novo estado para selos selecionados

    const allUtilizandoSeals = useMemo(() => {
        const seals: Seal[] = [];
        mockSealBatches.forEach(batch => {
            batch.seals.forEach(seal => {
                if (seal.sealSituation === 'Utilizando') {
                    seals.push(seal);
                }
            });
        });
        return seals;
    }, []);

    const filteredSeals = useMemo(() => {
        let filtered = allUtilizandoSeals;

        if (selectedSelo) {
            filtered = filtered.filter(seal => {
                const batch = mockSealBatches.find(b => b.seals.some(s => s.sealNumber === seal.sealNumber));
                return batch && batch.tipo_ato_selo === selectedSelo.id_selo;
            });
        }
        
        if (filterPeriod.decendio !== 'Todos' || filterPeriod.mes !== 'Todos' || filterPeriod.ano !== 'Todos') {
            filtered = filtered.filter(seal => {
                const sealDate = seal.resizingDate;
                if (!sealDate) return false;

                const day = sealDate.getDate();
                const month = sealDate.getMonth().toString();
                const year = sealDate.getFullYear().toString();

                const decendioMatch = filterPeriod.decendio === 'Todos' ||
                    (filterPeriod.decendio === '1º Decêndio' && day >= 1 && day <= 10) ||
                    (filterPeriod.decendio === '2º Decêndio' && day >= 11 && day <= 20) ||
                    (filterPeriod.decendio === '3º Decêndio' && day >= 21);
                
                const mesMatch = filterPeriod.mes === 'Todos' || month === filterPeriod.mes;
                const anoMatch = filterPeriod.ano === 'Todos' || year === filterPeriod.ano;

                return decendioMatch && mesMatch && anoMatch;
            });
        }
        
        if (filterPeriod.startDate || filterPeriod.endDate) {
            filtered = filtered.filter(seal => {
                const sealDate = seal.resizingDate;
                if (!sealDate) return false;
                
                const regStartDateMatch = filterPeriod.startDate ? sealDate >= new Date(filterPeriod.startDate) : true;
                const regEndDateMatch = filterPeriod.endDate ? sealDate <= new Date(filterPeriod.endDate + 'T23:59:59.999') : true;

                return regStartDateMatch && regEndDateMatch;
            });
        }

        return filtered;

    }, [selectedSelo, filterPeriod, allUtilizandoSeals]);

    // Lógica para o checkbox de seleção
    const handleToggleSeal = (sealNumber: string) => {
        setSelectedSeals(prev => {
            if (prev.includes(sealNumber)) {
                return prev.filter(num => num !== sealNumber);
            }
            return [...prev, sealNumber];
        });
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const allSealNumbers = filteredSeals.map(seal => seal.sealNumber);
            setSelectedSeals(allSealNumbers);
        } else {
            setSelectedSeals([]);
        }
    };
    
    // Verifica se todos os selos visíveis estão selecionados
    const isAllSelected = filteredSeals.length > 0 && filteredSeals.every(seal => selectedSeals.includes(seal.sealNumber));

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilterPeriod(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSeloSelect = (selo: TabelaEmolumentosItem) => {
        setSelectedSelo(selo);
    };

    const handleClearSelo = () => {
        setSelectedSelo(null);
    };

    const handleClearFilters = () => {
        setSelectedSelo(null);
        setSelectedSeals([]);
        setFilterPeriod({
            decendio: 'Todos',
            mes: 'Todos',
            ano: 'Todos',
            startDate: '',
            endDate: ''
        });
    };

    const handleExport = () => {
        if (selectedSeals.length === 0) {
            alert('Nenhum selo foi selecionado para exportação.');
            return;
        }
        
        const selosList = selectedSeals.join(', ');
        alert(`Simulando a exportação dos seguintes selos: ${selosList}`);
        
        handleClearSelo();
        setFilterPeriod({
            decendio: 'Todos',
            mes: 'Todos',
            ano: 'Todos',
            startDate: '',
            endDate: ''
        });
    };

    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const anos = ['2024', '2025', '2026'];

    return (
        <>
            <title>Exportação Manual de Selos</title>
            <div className="flex bg-gray-50 font-sans">
                <main className="flex-1">
                    <div className="mx-auto space-y-4">
                        <header className="flex items-center justify-between">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <ChevronLeft className="h-5 w-5" />
                                <h1 className="text-3xl font-bold text-[#4a4e51]">Exportação Manual de Selos</h1>
                            </button>
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
                                        <div className="grid grid-cols-1 gap-4">
                                            <div>
                                                <SeloSearchInput
                                                    selectedSeloId={selectedSelo ? selectedSelo.id_selo : null}
                                                    onSeloSelect={handleSeloSelect}
                                                    onClear={handleClearSelo}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            <div><label htmlFor="decendio" className="block text-sm font-medium text-gray-600 mb-1">Decêndio</label><select id="decendio" name="decendio" value={filterPeriod.decendio} onChange={handleFilterChange} className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]"><option>Todos</option><option>1º Decêndio</option><option>2º Decêndio</option><option>3º Decêndio</option></select></div>
                                            <div><label htmlFor="mes" className="block text-sm font-medium text-gray-600 mb-1">Mês</label><select id="mes" name="mes" value={filterPeriod.mes} onChange={handleFilterChange} className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]"><option value="Todos">Todos</option>{meses.map((m, index) => <option key={index} value={index}>{m}</option>)}</select></div>
                                            <div><label htmlFor="ano" className="block text-sm font-medium text-gray-600 mb-1">Ano</label><select id="ano" name="ano" value={filterPeriod.ano} onChange={handleFilterChange} className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]"><option>Todos</option>{anos.map(a => <option key={a}>{a}</option>)}</select></div>
                                            <div className="flex justify-end pt-4 md:pt-0"><button type="button" onClick={handleClearFilters} className="flex items-center gap-2 bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"><FilterX className="h-5 w-5" />Limpar Filtros</button></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => navigate(-1)}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleExport}
                                disabled={selectedSeals.length === 0}
                                className="bg-[#dd6825] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#c25a1f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Upload className="h-5 w-5 mr-2 inline-block" /> Confirmar Exportação ({selectedSeals.length})
                            </button>
                        </div>
                        
                        {filteredSeals.length > 0 && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-2">Selos Selecionados para Exportação ({selectedSeals.length} de {filteredSeals.length})</h3>
                                <div className="overflow-x-auto mt-4">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="w-10 px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                    <input
                                                        type="checkbox"
                                                        className="h-4 w-4 rounded border-gray-300 text-[#dd6825] focus:ring-[#dd6825]"
                                                        onChange={(e) => handleSelectAll(e.target.checked)}
                                                        checked={isAllSelected}
                                                    />
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Número do Selo</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Situação</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Valor Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredSeals.map(seal => (
                                                <tr key={seal.sealNumber}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <input
                                                            type="checkbox"
                                                            className="h-4 w-4 rounded border-gray-300 text-[#dd6825] focus:ring-[#dd6825]"
                                                            checked={selectedSeals.includes(seal.sealNumber)}
                                                            onChange={() => handleToggleSeal(seal.sealNumber)}
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{seal.sealNumber}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <span className={`inline-flex items-center gap-2 px-2.5 py-1 text-xs font-semibold rounded-full border ${getSituationBadgeStyles(seal.sealSituation)}`}>
                                                            <CheckCircle className="h-4 w-4 text-green-600" /> {seal.sealSituation}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ {seal.sealValue.total.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                        
                    </div>
                </main>
            </div>
        </>
    );
}