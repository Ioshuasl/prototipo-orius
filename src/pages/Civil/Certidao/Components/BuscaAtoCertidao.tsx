import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

type TipoBusca = 'protocolo' | 'termo' | 'livroFolha';

interface BuscaAtoCertidaoProps {
    onSearch: (criteria: { tipo: TipoBusca; valor?: string; livro?: string; folha?: string }) => void;
    isSearching: boolean;
}

export default function BuscaAtoCertidao({ onSearch, isSearching }: BuscaAtoCertidaoProps) {
    const [tipoBusca, setTipoBusca] = useState<TipoBusca>('protocolo');
    const [valorBusca, setValorBusca] = useState('');
    const [livro, setLivro] = useState('');
    const [folha, setFolha] = useState('');

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (tipoBusca === 'livroFolha') {
            if (!livro || !folha) return;
            onSearch({ tipo: 'livroFolha', livro, folha });
        } else {
            if (!valorBusca) return;
            onSearch({ tipo: tipoBusca, valor: valorBusca });
        }
    };
    
    // Classes de estilização comuns para inputs e labels
    const commonInputClass = "mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825] h-10";
    const commonLabelClass = "block text-sm font-medium text-gray-700";

    return (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-300">
            <h4 className="font-semibold text-gray-700 mb-3">1. Localizar Ato Original</h4>
            
            <form onSubmit={handleFormSubmit} className="flex items-end gap-4">
                
                <div className="flex-grow-[1]">
                    <label className={commonLabelClass}>Buscar por</label>
                    <select
                        value={tipoBusca}
                        onChange={(e) => setTipoBusca(e.target.value as any)}
                        className={commonInputClass}
                    >
                        <option value="protocolo">Protocolo</option>
                        <option value="termo">Termo</option>
                        <option value="livroFolha">Livro e Folha</option>
                    </select>
                </div>

                {/* Renderização condicional dos campos de busca */}
                {tipoBusca === 'livroFolha' ? (
                    <>
                        <div className="flex-grow-[1]">
                            <label className={commonLabelClass}>Livro</label>
                            <input
                                type="text"
                                value={livro}
                                onChange={(e) => setLivro(e.target.value)}
                                className={commonInputClass}
                                placeholder="Ex: B-101"
                            />
                        </div>
                        <div className="flex-grow-[1]">
                            <label className={commonLabelClass}>Folha</label>
                            <input
                                type="text"
                                value={folha}
                                onChange={(e) => setFolha(e.target.value)}
                                className={commonInputClass}
                                placeholder="Ex: 15"
                            />
                        </div>
                    </>
                ) : (
                    <div className="flex-grow-[3]"> {/* Este campo ocupará mais espaço */}
                        <label className={commonLabelClass}>Número</label>
                        <input
                            type="text"
                            value={valorBusca}
                            onChange={(e) => setValorBusca(e.target.value)}
                            className={commonInputClass}
                        />
                    </div>
                )}
                
                {/* O botão fica no final da linha */}
                <div>
                    <button
                        type="submit"
                        disabled={isSearching}
                        className="h-10 px-6 inline-flex items-center justify-center gap-2 bg-[#4a4e51] text-white font-semibold rounded-lg shadow-sm hover:bg-[#3b3e40] transition-colors disabled:bg-[#4a4e51]/50 disabled:cursor-not-allowed"
                    >
                        {isSearching ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
                        <span>Buscar</span>
                    </button>
                </div>
            </form>
        </div>
    );
}