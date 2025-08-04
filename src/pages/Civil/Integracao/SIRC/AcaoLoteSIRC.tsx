// Salve em um novo arquivo, ex: src/components/integracoes/AcaoLote.tsx
import { useState, useRef, useEffect } from 'react';
import { Send, ChevronDown, FileDown, CheckSquare } from 'lucide-react';

interface AcaoLoteProps {
    itensSelecionados: number;
    onEnviarClick: () => void;
    onGerarXmlClick: () => void;
    onLimparSelecao: () => void;
}

export default function AcaoLoteSIRC({ 
    itensSelecionados, 
    onEnviarClick, 
    onGerarXmlClick,
    onLimparSelecao
}: AcaoLoteProps) {
    const [menuAberto, setMenuAberto] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Efeito para fechar o menu se clicar fora dele
    useEffect(() => {
        const handleClickFora = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuAberto(false);
            }
        };
        document.addEventListener("mousedown", handleClickFora);
        return () => document.removeEventListener("mousedown", handleClickFora);
    }, []);
    
    // Animação de entrada da barra
    if (itensSelecionados === 0) {
        return null; // Não mostra nada se nenhum item estiver selecionado
    }

    return (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-full max-w-md animate-fade-in-up z-30">
            <div className="bg-white p-3 rounded-xl shadow-2xl border flex items-center justify-between">
                <div className="ml-2">
                    <span className="font-bold text-blue-800">{itensSelecionados}</span>
                    <span className="text-sm font-semibold text-gray-600"> {itensSelecionados > 1 ? 'atos selecionados' : 'ato selecionado'}</span>
                </div>

                <div className="flex items-center rounded-lg shadow-sm">
                    {/* BOTÃO DE AÇÃO PRINCIPAL - AUTOMÁTICO */}
                    <button
                        onClick={onEnviarClick}
                        className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-l-lg hover:bg-blue-700 transition-colors h-full"
                    >
                        <Send size={16} />
                        Enviar Lote
                    </button>
                    
                    {/* BOTÃO DO MENU DROPDOWN */}
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setMenuAberto(!menuAberto)}
                            className="bg-blue-700 text-white p-2.5 rounded-r-lg hover:bg-blue-800 transition-colors h-full"
                            aria-haspopup="true"
                            aria-expanded={menuAberto}
                        >
                            <ChevronDown size={18} />
                        </button>

                        {/* O MENU SUSPENSO */}
                        {menuAberto && (
                            <div className="absolute bottom-full right-0 mb-2 w-64 bg-white rounded-lg shadow-xl border z-40 animate-fade-in-up-fast">
                                <ul className="p-1">
                                    <li className="p-1">
                                        <button onClick={() => { onGerarXmlClick(); setMenuAberto(false); }} className="w-full flex items-center gap-3 text-left p-2 rounded-md text-sm text-gray-700 hover:bg-gray-100">
                                            <FileDown size={16} className="text-gray-500" />
                                            <span>Gerar XML para Envio Manual...</span>
                                        </button>
                                    </li>
                                    <li className="p-1">
                                         <button onClick={() => { onLimparSelecao(); setMenuAberto(false); }} className="w-full flex items-center gap-3 text-left p-2 rounded-md text-sm text-gray-700 hover:bg-gray-100">
                                            <CheckSquare size={16} className="text-gray-500" />
                                            <span>Limpar Seleção</span>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}