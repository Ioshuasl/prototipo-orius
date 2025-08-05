import React, { useState, useMemo, useRef } from 'react';
import { Book, Search, Upload } from 'lucide-react';
import { toast } from 'react-toastify';
import initialEmolumentosData from '../../../../../tabela-emolumentos.json';

// --- Funções e Lógica (Inalteradas) ---
const formatCurrency = (value: number) => {
    if (typeof value !== 'number') return 'N/A';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export default function TabelaEmolumentosPage() {
    const [emolumentosData, setEmolumentosData] = useState(initialEmolumentosData);
    const [searchTerm, setSearchTerm] = useState('');
    const [sistemaFilter, setSistemaFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 15;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const sistemas = useMemo(() => {
        const allSistemas = emolumentosData.map(item => item.sistema);
        return [...new Set(allSistemas)].sort();
    }, [emolumentosData]); // Dependência adicionada para robustez

    const filteredData = useMemo(() => {
        return emolumentosData.filter(item => {
            const searchMatch = searchTerm === '' ||
                item.descricao_selo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                String(item.id_selo).includes(searchTerm);
            const sistemaMatch = sistemaFilter === '' || item.sistema === sistemaFilter;
            return searchMatch && sistemaMatch;
        });
    }, [searchTerm, sistemaFilter, emolumentosData]); // Dependência adicionada

    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [currentPage, filteredData]);

    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, sistemaFilter]);

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const newData = JSON.parse(content);
                if (Array.isArray(newData) && newData.length > 0 && 'id_selo' in newData[0]) {
                    setEmolumentosData(newData);
                    toast.success(`Tabela de emolumentos importada com sucesso! ${newData.length} itens carregados.`);
                } else {
                    toast.error("O arquivo JSON parece ser inválido ou não tem o formato esperado.");
                }
            } catch (error) {
                toast.error("Erro ao ler ou processar o arquivo JSON.");
                console.error("Erro na importação do JSON:", error);
            }
        };
        reader.readAsText(file);
        if(event.target) event.target.value = '';
    };

    // ALTERADO: Estilo de foco para os campos de formulário
    const commonFocusStyle = "focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]";

    return (
        <div className="mx-auto">
            <title>Tabela de Emolumentos | Orius Tecnologia</title>
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} accept=".json" />
            <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 pb-4">
                <div>
                    {/* ALTERADO: Cor do título principal */}
                    <h1 className="text-3xl font-bold text-[#4a4e51]">Tabela de Emolumentos</h1>
                    <p className="text-md text-gray-500 mt-1">Consulte todos os selos e valores cadastrados no sistema.</p>
                </div>
                 {/* ALTERADO: Cor do botão de ação principal */}
                <button 
                    onClick={handleImportClick}
                    className="flex items-center gap-2 bg-[#dd6825] text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-[#c25a1f] mt-4 md:mt-0 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dd6825]"
                >
                    <Upload className="h-5 w-5" />
                    Importar JSON
                </button>
            </header>

            <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex-grow">
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Buscar por ID ou Descrição</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-5 w-5 text-gray-400" /></div>
                        {/* ALTERADO: Estilo de foco */}
                        <input
                            type="text" id="search"
                            className={`w-full border border-gray-300 rounded-md p-2 pl-10 ${commonFocusStyle}`}
                            placeholder="Digite para buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex-grow md:max-w-xs">
                    <label htmlFor="sistema" className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Sistema</label>
                    {/* ALTERADO: Estilo de foco */}
                    <select
                        id="sistema"
                        className={`w-full border border-gray-300 rounded-md p-2 ${commonFocusStyle}`}
                        value={sistemaFilter} onChange={(e) => setSistemaFilter(e.target.value)}
                    >
                        <option value="">Todos os Sistemas</option>
                        {sistemas.map(sys => (<option key={sys} value={sys}>{sys}</option>))}
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm">
                <table className="min-w-full divide-y divide-gray-200 table-fixed">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="w-24 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Selo</th>
                            <th scope="col" className="w-2/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                            <th scope="col" className="w-48 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sistema</th>
                            <th scope="col" className="w-32 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Emolumento</th>
                            <th scope="col" className="w-32 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Taxa Jud.</th>
                            <th scope="col" className="w-32 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedData.length > 0 ? paginatedData.map((item) => (
                            <tr key={item.id_selo} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.id_selo}</td>
                                <td className="px-6 py-4 text-sm text-gray-600 break-words">{item.descricao_selo}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{item.sistema}</td>
                                <td className="px-6 py-4 text-sm text-right font-mono">{formatCurrency(item.valor_emolumento)}</td>
                                <td className="px-6 py-4 text-sm text-right font-mono">{formatCurrency(item.valor_taxa_judiciaria)}</td>
                                {/* ALTERADO: Cor do valor total */}
                                <td className="px-6 py-4 text-sm text-right font-bold text-[#dd6825] font-mono">{formatCurrency(item.valor_emolumento + item.valor_taxa_judiciaria)}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={6} className="text-center py-12">
                                    <Book size={48} className="mx-auto text-gray-400" />
                                    <h3 className="mt-2 text-lg font-semibold text-gray-700">Nenhum resultado encontrado</h3>
                                    <p className="mt-1 text-sm text-gray-500">Ajuste os filtros ou o termo de busca.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                 <div className="flex items-center justify-between mt-6">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Anterior</button>
                    <span className="text-sm text-gray-700">Página {currentPage} de {totalPages}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Próxima</button>
                </div>
            )}
        </div>
    );
};