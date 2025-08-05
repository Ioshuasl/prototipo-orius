import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export type TemplateCabecalhoId = 'modelo1' | 'modelo2' | 'modelo3' | 'modelo4';

// Define a estrutura do objeto de colunas para ser reutilizável
export interface Colunas {
    protocolo: boolean;
    nome: boolean;
    termo: boolean;
    livro: boolean;
    folha: boolean;
}

// Define a estrutura da configuração completa, agora com o template do cabeçalho
export interface Configuracao {
    colunas: Colunas;
    templateCabecalho: TemplateCabecalhoId;
}

// Define as props que o modal receberá
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (config: Configuracao) => void;
    configuracaoAtual: Configuracao;
}

export default function ModalConfiguracaoImpressao({ isOpen, onClose, onSave, configuracaoAtual }: ModalProps) {
    // Estado temporário para as configurações dentro do modal
    const [tempConfig, setTempConfig] = useState<Configuracao>(configuracaoAtual);

    // Sincroniza o estado interno se a prop externa mudar enquanto o modal estiver aberto
    useEffect(() => {
        if (isOpen) {
            setTempConfig(configuracaoAtual);
        }
    }, [configuracaoAtual, isOpen]);

    if (!isOpen) {
        return null;
    }

    const handleColumnChange = (coluna: keyof Colunas) => {
        setTempConfig(prev => ({
            ...prev,
            colunas: {
                ...prev.colunas,
                [coluna]: !prev.colunas[coluna],
            }
        }));
    };

    const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTempConfig(prev => ({
            ...prev,
            templateCabecalho: e.target.value as TemplateCabecalhoId,
        }));
    };

    const handleSaveClick = () => {
        onSave(tempConfig);
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center p-4 animate-fade-in-fast bg-gray-900/50 backdrop-blur-sm" aria-modal="true" role="dialog">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Configurações de Impressão</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
                        <X size={20} />
                    </button>
                </div>

                {/* Seção de Seleção de Cabeçalho */}
                <fieldset className="border border-gray-200 rounded-lg p-4">
                    <legend className="text-sm font-medium text-gray-700 px-2">Modelo de Cabeçalho</legend>
                    <div className="mt-2">
                        <label htmlFor="templateCabecalho" className="sr-only">Escolha o modelo de cabeçalho</label>
                        <select
                            id="templateCabecalho"
                            value={tempConfig.templateCabecalho}
                            onChange={handleTemplateChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="modelo1">Modelo 1: Título e Nomes</option>
                            <option value="modelo2">Modelo 2: Completo (sem brasão)</option>
                            <option value="modelo3">Modelo 3: Completo (com brasão)</option>
                            <option value="modelo4">Modelo 4: Completo (Brasão por cima)</option>
                        </select>
                    </div>
                </fieldset>

                {/* Seção de Seleção de Colunas */}
                <fieldset className="border border-gray-200 rounded-lg p-4">
                    <legend className="text-sm font-medium text-gray-700 px-2">Colunas para Imprimir</legend>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        {(Object.keys(tempConfig.colunas) as Array<keyof Colunas>).map(col => (
                            <label key={col} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={tempConfig.colunas[col]}
                                    onChange={() => handleColumnChange(col)}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-800 capitalize">{col}</span>
                            </label>
                        ))}
                    </div>
                </fieldset>

                <div className="flex justify-end gap-3 pt-4">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                        Cancelar
                    </button>
                    <button onClick={handleSaveClick} className="px-4 py-2 text-sm font-medium text-white bg-[#dd6825] rounded-md hover:bg-[#c25a1f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dd6825]">
                        Salvar Configurações
                    </button>
                </div>
            </div>
        </div>
    );
}