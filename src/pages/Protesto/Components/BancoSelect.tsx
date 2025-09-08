import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import { type IBank } from '../types';

interface BancoSelectProps {
    label: string;
    selectedBankCode: number | undefined;
    onBankSelect: (banco: IBank | null) => void;
}

const BancoSelect: React.FC<BancoSelectProps> = ({ label, selectedBankCode, onBankSelect }) => {
    const [bancos, setBancos] = useState<IBank[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState<IBank[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const componentRef = useRef<HTMLDivElement>(null);
    const commonInputClass = "mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]";
    const commonLabelClass = "block text-sm font-medium text-gray-700";
    
    // Efeito para buscar os bancos na API (apenas uma vez)
    useEffect(() => {
        const fetchBancos = async () => {
             try {
                const response = await fetch('https://brasilapi.com.br/api/banks/v1');
                if (response.ok) {
                    const data: IBank[] = await response.json();
                    const sanitizedData = data.map(b => ({ ...b, code: b.code === null ? 0 : b.code }));
                    setBancos(sanitizedData);
                }
            } catch (error) { toast.error("Não foi possível carregar a lista de bancos."); }
        };
        fetchBancos();
    }, []);

    // Efeito para preencher o campo de busca quando um valor inicial é fornecido
    useEffect(() => {
        if (selectedBankCode !== undefined && bancos.length > 0) {
            const initialBank = bancos.find(b => b.code === selectedBankCode);
            if (initialBank) {
                setSearchTerm(`${initialBank.code} - ${initialBank.name}`);
            }
        } else {
            setSearchTerm('');
        }
    }, [selectedBankCode, bancos]);

    // Efeito para filtrar as sugestões conforme o usuário digita
    useEffect(() => {
        if (searchTerm) {
            const lowerCaseSearch = searchTerm.toLowerCase();
            setSuggestions(
                bancos.filter(b =>
                    (b.name && b.name.toLowerCase().includes(lowerCaseSearch)) ||
                    (b.code != null && b.code.toString().includes(lowerCaseSearch))
                )
            );
        } else {
            setSuggestions(bancos);
        }
    }, [searchTerm, bancos]);

    // Efeito para fechar o dropdown ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (componentRef.current && !componentRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [componentRef]);

    const handleSelect = (banco: IBank) => {
        setSearchTerm(`${banco.code} - ${banco.name}`);
        onBankSelect(banco);
        setIsDropdownOpen(false);
    };

    const handleClear = () => {
        setSearchTerm('');
        onBankSelect(null);
        setIsDropdownOpen(false);
    };

    return (
        <div ref={componentRef} className="relative">
            <label htmlFor="banco-select" className={commonLabelClass}>{label}</label>
            <div className="relative mt-1">
                <input
                    type="text"
                    id="banco-select"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        onBankSelect(null);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    placeholder="Digite o código ou nome"
                    className={commonInputClass}
                    disabled={bancos.length === 0}
                />
                {searchTerm && (
                    <button type="button" onClick={handleClear} className="absolute inset-y-0 right-0 flex items-center pr-2">
                        <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    </button>
                )}
            </div>
            {isDropdownOpen && (
                <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {suggestions.length > 0 ? (
                        suggestions.map(b => (
                            <li key={b.code} onClick={() => handleSelect(b)} className="px-3 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100">
                                {b.code} - {b.name}
                            </li>
                        ))
                    ) : ( <li className="px-3 py-2 text-sm text-gray-500">Nenhum banco encontrado</li> )}
                </ul>
            )}
        </div>
    );
};

export default BancoSelect;