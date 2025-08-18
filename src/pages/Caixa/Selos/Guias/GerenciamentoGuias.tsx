import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, SlidersHorizontal, ChevronUp, FilterX, AlertTriangle, FileText, Calendar, DollarSign, Eye, Loader2, ListX } from 'lucide-react';

// --- ESTRUTURA DE TIPOS E DADOS SIMULADOS ---
type Decendio = 'Todos' | '1º Decêndio' | '2º Decêndio' | '3º Decêndio';

interface Guia {
    id: number;
    numeroGuia: string;
    decendio: Decendio;
    mes: number; // 0-indexed (0=Janeiro, 1=Fevereiro, etc.)
    ano: number;
    valor: number;
    dataVencimento: Date;
    status: 'Paga' | 'Pendente' | 'Cancelada';
}

const mockGuias: Guia[] = [
    {
        id: 1,
        numeroGuia: '2025-08-01-A',
        decendio: '1º Decêndio',
        mes: 7,
        ano: 2025,
        valor: 1545.89,
        dataVencimento: new Date(2025, 7, 10),
        status: 'Paga',
    },
    {
        id: 2,
        numeroGuia: '2025-08-01-B',
        decendio: '1º Decêndio',
        mes: 7,
        ano: 2025,
        valor: 875.20,
        dataVencimento: new Date(2025, 7, 10),
        status: 'Pendente',
    },
    {
        id: 3,
        numeroGuia: '2025-07-03-A',
        decendio: '3º Decêndio',
        mes: 6,
        ano: 2025,
        valor: 2100.50,
        dataVencimento: new Date(2025, 6, 31),
        status: 'Paga',
    },
    {
        id: 4,
        numeroGuia: '2025-07-02-C',
        decendio: '2º Decêndio',
        mes: 6,
        ano: 2025,
        valor: 500.00,
        dataVencimento: new Date(2025, 6, 20),
        status: 'Cancelada',
    },
    {
        id: 5,
        numeroGuia: '2025-08-02-C',
        decendio: '2º Decêndio',
        mes: 7,
        ano: 2025,
        valor: 990.75,
        dataVencimento: new Date(2025, 7, 20),
        status: 'Pendente',
    },
];

const statusOptions = ['Paga', 'Pendente', 'Cancelada'];
const decendioOptions: Decendio[] = ['1º Decêndio', '2º Decêndio', '3º Decêndio'];
const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const anos = ['2024', '2025', '2026'];

export default function GerenciamentoGuias() {
    const navigate = useNavigate();
    const initialFilters = {
        decendio: 'Todos',
        mes: 'Todos',
        ano: 'Todos',
        status: 'Todos',
    };

    const [filters, setFilters] = useState(initialFilters);
    const [filteredGuias, setFilteredGuias] = useState<Guia[]>(mockGuias);
    const [isLoading, setIsLoading] = useState(false);
    const [filtersVisible, setFiltersVisible] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        const filterTimeout = setTimeout(() => {
            const results = mockGuias.filter(guia => {
                const decendioMatch = filters.decendio === 'Todos' || guia.decendio === filters.decendio;
                const mesMatch = filters.mes === 'Todos' || guia.mes.toString() === filters.mes;
                const anoMatch = filters.ano === 'Todos' || guia.ano.toString() === filters.ano;
                const statusMatch = filters.status === 'Todos' || guia.status === filters.status;
                
                return decendioMatch && mesMatch && anoMatch && statusMatch;
            });

            setFilteredGuias(results);
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

    const handleViewGuia = (id: number) => {
        navigate(`${id}`);
    };

    return (
        <>
            <title>Gerenciamento de Guias</title>
            <div className="flex bg-gray-50 font-sans">
                <main className="flex-1">
                    <div className="mx-auto space-y-4">
                        <header className="flex items-center justify-between">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <ChevronLeft className="h-5 w-5" />
                                <h1 className="text-3xl font-bold text-[#4a4e51]">Gerenciamento de Guias</h1>
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
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            <div><label htmlFor="decendio" className="block text-sm font-medium text-gray-600 mb-1">Decêndio</label><select id="decendio" name="decendio" value={filters.decendio} onChange={handleFilterChange} className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]"><option>Todos</option>{decendioOptions.map(d => <option key={d}>{d}</option>)}</select></div>
                                            <div><label htmlFor="mes" className="block text-sm font-medium text-gray-600 mb-1">Mês</label><select id="mes" name="mes" value={filters.mes} onChange={handleFilterChange} className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]"><option value="Todos">Todos</option>{meses.map((m, index) => <option key={index} value={index}>{m}</option>)}</select></div>
                                            <div><label htmlFor="ano" className="block text-sm font-medium text-gray-600 mb-1">Ano</label><select id="ano" name="ano" value={filters.ano} onChange={handleFilterChange} className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]"><option>Todos</option>{anos.map(a => <option key={a}>{a}</option>)}</select></div>
                                            <div><label htmlFor="status" className="block text-sm font-medium text-gray-600 mb-1">Status</label><select id="status" name="status" value={filters.status} onChange={handleFilterChange} className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]"><option>Todos</option>{statusOptions.map(s => <option key={s}>{s}</option>)}</select></div>
                                        </div>
                                        <div className="flex justify-end pt-4"><button type="button" onClick={handleClearFilters} className="flex items-center gap-2 bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"><FilterX className="h-5 w-5" />Limpar Filtros</button></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="min-h-[400px] relative">
                            {isLoading ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50 rounded-xl z-10"><Loader2 className="h-10 w-10 text-[#dd6825] animate-spin" /></div>
                            ) : filteredGuias.length > 0 ? (
                                <ul className="space-y-4">
                                    {filteredGuias.map(guia => (
                                        <Link to={`${guia.id}`}>
                                        <li key={guia.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex justify-between items-center transition-all duration-300 hover:shadow-lg">
                                            <div className="flex items-center gap-4">
                                                <FileText className="h-8 w-8 text-gray-400" />
                                                <div>
                                                    <h3 className="font-bold text-lg text-gray-800">Guia #{guia.numeroGuia}</h3>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        <span className="font-semibold">{guia.decendio}, {meses[guia.mes]} de {guia.ano}</span> - Vencimento: {guia.dataVencimento.toLocaleDateString('pt-BR')}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="text-xs text-gray-500">Valor Total</p>
                                                    <p className="font-bold text-xl text-gray-900">R$ {guia.valor.toFixed(2)}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleViewGuia(guia.id)}
                                                    className="bg-gray-100 text-[#dd6825] p-2 rounded-full hover:bg-gray-200 transition-colors"
                                                    title="Visualizar Guia"
                                                >
                                                    <Eye className="h-6 w-6" />
                                                </button>
                                            </div>
                                        </li>
                                        </Link>
                                    ))}
                                </ul>
                            ) : (
                                <div className="flex flex-col items-center justify-center text-center text-gray-500 bg-white rounded-xl h-full border-2 border-dashed py-10">
                                    <ListX className="h-12 w-12 mb-4" />
                                    <h3 className="text-lg font-semibold">Nenhuma guia encontrada</h3>
                                    <p>Tente ajustar ou limpar os filtros para ver mais resultados.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}