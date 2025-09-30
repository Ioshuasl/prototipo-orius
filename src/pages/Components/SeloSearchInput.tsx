import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X } from 'lucide-react';

// Importar a tabela de dados
import TabelaEmolumentos from '../../../tabela-emolumentos.json';

// Definindo o tipo para os itens da tabela de emolumentos para clareza
type SeloInfo = typeof TabelaEmolumentos[0];

// --- Props do Componente Reutilizável (ATUALIZADAS) ---
interface SeloSearchInputProps {
    /** O ID do selo que está atualmente selecionado (para exibição). */
    selectedSeloId: number | null;
    /** O NOME DO SISTEMA pelo qual os selos devem ser filtrados (Ex: "REGISTRO CIVIL"). */
    sistemaFiltro: string; 
    /** Callback chamado quando um selo é selecionado. */
    onSeloSelect: (selo: SeloInfo) => void;
    /** Callback chamado quando a seleção é limpa. */
    onClear: () => void;
}

const SeloSearchInput: React.FC<SeloSearchInputProps> = ({ 
    selectedSeloId, 
    sistemaFiltro, // Nova prop
    onSeloSelect, 
    onClear 
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // --- LÓGICA DE FILTRAGEM DINÂMICA (useMemo) ---
    const selosFiltradosPorSistema = useMemo(() => {
        return TabelaEmolumentos.filter(selo =>
            // Utiliza a prop sistemaFiltro para filtrar a lista base
            selo.sistema === sistemaFiltro
        ).sort((a, b) => a.descricao_selo.localeCompare(b.descricao_selo));
    }, [sistemaFiltro]); // Recalcula se o sistema de filtro mudar

    // 1. Obter o selo completo com base no ID selecionado
    const selectedSelo = useMemo(() => {
        return selosFiltradosPorSistema.find(s => s.id_selo === selectedSeloId) || null;
    }, [selectedSeloId, selosFiltradosPorSistema]);

    // 2. Filtrar a lista de selos com base no termo de busca (usando a lista filtrada por sistema)
    const filteredSelos = useMemo(() => {
        if (!searchTerm) return selosFiltradosPorSistema;
        const term = searchTerm.toLowerCase();
        return selosFiltradosPorSistema.filter(selo =>
            selo.descricao_selo.toLowerCase().includes(term) ||
            String(selo.id_selo).includes(term)
        );
    }, [searchTerm, selosFiltradosPorSistema]);

    // 3. Lógica de Seleção (Mantida)
    const handleSelect = (selo: SeloInfo) => {
        onSeloSelect(selo); 
        setIsDropdownOpen(false);
        setSearchTerm(''); 
    };

    // 4. Fechar o dropdown ao clicar fora (Mantida)
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // 5. Renderização (Mantida)
    return (
        <div className="relative" ref={searchRef}>
            {selectedSelo ? (
                // --- Estado: Selo Selecionado ---
                <div className="w-full border border-gray-300 rounded-md p-2 bg-gray-100 flex justify-between items-center">
                    <span className="text-sm text-gray-700">
                        <strong>{selectedSelo.id_selo}:</strong> {selectedSelo.descricao_selo}
                    </span>
                    <button type="button" onClick={onClear} className="text-gray-500 hover:text-red-600">
                        <X size={16} />
                    </button>
                </div>
            ) : (
                // --- Estado: Em Busca ---
                <>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setIsDropdownOpen(true)}
                        placeholder={`Buscar selo (${sistemaFiltro})...`}
                        className="w-full border border-gray-300 rounded-md p-2 pl-10 text-sm focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]"
                        autoComplete="off"
                    />
                    {isDropdownOpen && (
                        <div className="absolute z-20 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
                            {filteredSelos.length > 0 ? (
                                filteredSelos.map(selo => (
                                    <div 
                                        key={selo.id_selo} 
                                        onClick={() => handleSelect(selo)} 
                                        className="p-2 hover:bg-[#dd6825]/10 cursor-pointer text-sm"
                                    >
                                        <strong>{selo.id_selo}</strong> - {selo.descricao_selo}
                                    </div>
                                ))
                            ) : (
                                <div className="p-2 text-sm text-gray-500">Nenhum selo encontrado para {sistemaFiltro}.</div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default SeloSearchInput;