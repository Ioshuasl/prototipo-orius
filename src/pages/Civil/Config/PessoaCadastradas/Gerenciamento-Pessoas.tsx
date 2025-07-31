import React, { useState, useEffect } from 'react';
import { IMask } from 'react-imask';
import { Link } from 'react-router-dom';
// Ícones reutilizados e novos para o contexto de pessoas
import { PlusCircle, Search, ChevronLeft, ChevronRight, User, Building, FilterX, Loader2, ListX, SlidersHorizontal, ChevronUp, MoreVertical, Edit, FileSearch, UserX, MapPin } from 'lucide-react';
import { ufs, mockPessoasCadastradas } from '../../lib/Constants';
import { toast } from 'react-toastify';
import { type TPessoaTipo } from '../../types';

// --- ESTRUTURA DE TIPOS E DADOS SIMULADOS PARA PESSOAS ---

// 1. Definindo um tipo para o tipo de pessoa
type TipoPessoa = 'Todos' | 'Pessoa Física' | 'Pessoa Jurídica';

// 2. Criando dados simulados para as Pessoas (Físicas e Jurídicas)
// Adicionando dados de endereço para consistência com as interfaces


// 3. Opções e Estilos para os tipos de pessoa
const tipoPessoaOptions: TipoPessoa[] = ['Todos', 'Pessoa Física', 'Pessoa Jurídica'];

const tipoPessoaStyles: Record<Exclude<TipoPessoa, 'Todos'>, { text: string, bg: string, border: string, icon: React.ReactNode }> = {
    'Pessoa Física': { text: 'text-sky-800', bg: 'bg-sky-100', border: 'border-sky-200', icon: <User size={12} /> },
    'Pessoa Jurídica': { text: 'text-amber-800', bg: 'bg-amber-100', border: 'border-amber-200', icon: <Building size={12} /> },
};

const formatarCpfCnpj = (valor: string): string => {
    if (!valor) return '';

    const apenasDigitos = valor.replace(/\D/g, '');
    let mascara = '';

    if (apenasDigitos.length <= 11) {
        mascara = '000.000.000-00';
    } else {
        mascara = '00.000.000/0000-00';
    }

    // Usa a lógica do IMask para formatar o valor com a máscara apropriada
    const mask = IMask.createMask({ mask: mascara });
    mask.resolve(apenasDigitos);
    return mask.value;
};

export default function GerenciamentoPessoasPage() {
    const initialFilters = { searchTerm: '', tipoPessoa: 'Todos' as TipoPessoa, uf: 'Todos', cidade: '' };

    const [filters, setFilters] = useState(initialFilters);
    const [filteredRecords, setFilteredRecords] = useState<TPessoaTipo[]>(mockPessoasCadastradas);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [filtersVisible, setFiltersVisible] = useState(false);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null); // Usar CPF/CNPJ como ID único
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
        setIsLoading(true);
        const filterTimeout = setTimeout(() => {
            const results = mockPessoasCadastradas.filter(record => {
                const searchTermLower = filters.searchTerm.toLowerCase();
                const searchTermMatch = filters.searchTerm ?
                    (record.tipo === 'fisica' && (record.nome.toLowerCase().includes(searchTermLower) || record.cpf.includes(searchTermLower))) ||
                    (record.tipo === 'juridica' && (record.razaoSocial.toLowerCase().includes(searchTermLower) || record.cnpj.includes(searchTermLower)))
                    : true;

                const tipoPessoaMatch = filters.tipoPessoa !== 'Todos' ? (record.tipo === 'fisica' && filters.tipoPessoa === 'Pessoa Física') || (record.tipo === 'juridica' && filters.tipoPessoa === 'Pessoa Jurídica') : true;

                const ufMatch = filters.uf !== 'Todos' ? record.endereco.uf === filters.uf : true;
                
                const cidadeMatch = filters.cidade ? record.endereco.cidade.toLowerCase().includes(filters.cidade.toLowerCase()) : true;

                return searchTermMatch && tipoPessoaMatch && ufMatch && cidadeMatch;
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
        toast.info(`Ação: "${action}" para o registro ID: ${recordId}`);
        setOpenMenuId(null);
    };

    const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
    const paginatedRecords = filteredRecords.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

    const TipoPessoaBadge = ({ tipo }: { tipo: Exclude<TipoPessoa, 'Todos'> }) => {
        const style = tipoPessoaStyles[tipo] || {};
        return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${style.text} ${style.bg} ${style.border}`}>
                {style.icon}
                {tipo}
            </span>
        );
    };

    const PessoaCard = ({ record }: { record: TPessoaTipo }) => {
        const recordId = record.tipo === 'fisica' ? record.cpf : record.cnpj;
        const isMenuOpen = openMenuId === recordId;

        const toggleMenu = (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setOpenMenuId(isMenuOpen ? null : recordId);
        };

        const renderInfo = () => {
            if (record.tipo === 'fisica') {
                return (
                    <>
                        <h3 className="font-bold text-gray-800 text-base leading-tight group-hover:text-blue-600 transition-colors pr-8">
                            {record.nome}
                        </h3>
                        <p className="text-sm text-gray-500 truncate mt-1">CPF: {formatarCpfCnpj(record.cpf)}</p>
                    </>
                );
            }
            return ( // Pessoa Jurídica
                <>
                    <h3 className="font-bold text-gray-800 text-base leading-tight group-hover:text-blue-600 transition-colors pr-8">
                        {record.razaoSocial}
                    </h3>
                    <p className="text-sm text-gray-500 truncate mt-1">CNPJ: {formatarCpfCnpj(record.cnpj)}</p>
                </>
            );
        };
        
        const cardTopBorderStyle = record.tipo === 'fisica' ? 'border-t-sky-500' : 'border-t-amber-500';

        return (
            <div className="relative">
                <Link to={`${recordId}`} className="block group">
                    <div className={`bg-white rounded-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:border-gray-300 overflow-hidden border-t-4 ${cardTopBorderStyle}`}>
                        <div className="p-4 border-b border-gray-100">
                            <div className='mb-3'>
                                <TipoPessoaBadge tipo={record.tipo === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'} />
                            </div>
                            {renderInfo()}
                        </div>
                        <div className="p-4 bg-gray-50/50">
                            <div className="flex items-start gap-3 text-sm">
                                <MapPin className="h-4 w-4 mt-0.5 text-gray-400 flex-shrink-0" />
                                <div>
                                    <p className="font-medium text-gray-700">{`${record.endereco.logradouro}, ${record.endereco.numero}`}</p>
                                    <p className="text-gray-500">{`${record.endereco.bairro} - ${record.endereco.cidade}, ${record.endereco.uf}`}</p>
                                </div>
                            </div>
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
                                <a href="#" onClick={(e) => handleMenuAction('Editar Cadastro', recordId, e)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><Edit size={16} /> Editar Cadastro</a>
                                <a href="#" onClick={(e) => handleMenuAction('Ver Atos Vinculados', recordId, e)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><FileSearch size={16} /> Ver Atos Vinculados</a>
                                <div className="my-1 border-t border-gray-100"></div>
                                <a href="#" onClick={(e) => handleMenuAction('Inativar', recordId, e)} className="flex items-center gap-3 px-4 py-2 text-sm text-red-700 hover:bg-red-50"><UserX size={16} /> Inativar Cadastro</a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <>
            <title>Gerenciamento de Pessoas</title>
            <div className="max-w-7xl mx-auto space-y-6">
                <header className="flex items-center justify-between">
                    <div><h1 className="text-3xl font-bold text-gray-800">Gerenciamento de Pessoas</h1><p className="text-md text-gray-500 mt-1">Consulte, cadastre e gerencie pessoas físicas e jurídicas.</p></div>
                    <Link to="./cadastrar" className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition-all duration-300 hover:scale-105">
                        <PlusCircle className="h-5 w-5" /> Nova Pessoa
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
                                <div><label htmlFor="searchTerm" className="block text-sm font-medium text-gray-600 mb-1">Buscar por Nome, Razão Social, CPF ou CNPJ</label><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input id="searchTerm" type="text" name="searchTerm" value={filters.searchTerm} onChange={handleFilterChange} placeholder="Digite para buscar..." className="border border-gray-300 rounded-md pl-10 pr-4 py-2 w-full" /></div></div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div>
                                        <label htmlFor="tipoPessoa" className="block text-sm font-medium text-gray-600 mb-1">Tipo de Pessoa</label>
                                        <select id="tipoPessoa" name="tipoPessoa" value={filters.tipoPessoa} onChange={handleFilterChange} className="border border-gray-300 rounded-md px-3 py-2 w-full">
                                            {tipoPessoaOptions.map(s => <option key={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="uf" className="block text-sm font-medium text-gray-600 mb-1">UF do Endereço</label>
                                        <select id="uf" name="uf" value={filters.uf} onChange={handleFilterChange} className="border border-gray-300 rounded-md px-3 py-2 w-full">
                                            <option>Todos</option>
                                            {ufs.map(uf => <option key={uf}>{uf}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="cidade" className="block text-sm font-medium text-gray-600 mb-1">Cidade do Endereço</label>
                                        <input id="cidade" type="text" name="cidade" value={filters.cidade} onChange={handleFilterChange} placeholder="Digite o nome da cidade..." className="border border-gray-300 rounded-md px-4 py-2 w-full" />
                                    </div>
                                </div>
                                <div className='flex justify-end'>
                                    <button type="button" onClick={handleClearFilters} className="flex items-center gap-2 bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"><FilterX className="h-5 w-5" />Limpar Filtros</button>
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
                                <PessoaCard key={record.tipo === 'fisica' ? record.cpf : record.cnpj} record={record} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center text-gray-500 bg-white rounded-xl h-full border-2 border-dashed py-10">
                            <ListX className="h-12 w-12 mb-4" /><h3 className="text-lg font-semibold">Nenhuma pessoa encontrada</h3><p>Tente ajustar ou limpar os filtros para ver mais resultados.</p>
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