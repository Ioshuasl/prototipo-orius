import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export type TemplateCabecalhoId = 'modelo1' | 'modelo2' | 'modelo3' | 'modelo4';

export interface ColunasExtrato {
    data: boolean;
    tipo: boolean;
    descricao: boolean;
    valor: boolean;
}
export interface Margens {
    top: string;
    bottom: string;
    left: string;
    right: string;
}

// Define a estrutura da configuração completa, agora com o template do cabeçalho
export interface ConfiguracaoExtrato {
    colunas: ColunasExtrato;
    templateCabecalho: TemplateCabecalhoId;
    margens: Margens;
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (config: ConfiguracaoExtrato) => void;
    configuracaoAtual: ConfiguracaoExtrato;
}

export default function ModalConfiguracaoImpressaoExtrato({ isOpen, onClose, onSave, configuracaoAtual }: ModalProps) {
    const [tempConfig, setTempConfig] = useState<ConfiguracaoExtrato>(configuracaoAtual);

    useEffect(() => {
        if (isOpen) {
            setTempConfig(configuracaoAtual);
        }
    }, [configuracaoAtual, isOpen]);

    if (!isOpen) {
        return null;
    }

    const handleColumnChange = (coluna: keyof ColunasExtrato) => {
        setTempConfig(prev => ({
            ...prev,
            colunas: {
                ...prev.colunas,
                [coluna]: !prev.colunas[coluna],
            }
        }));
    };

    const handleMarginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTempConfig(prev => ({
            ...prev,
            margens: {
                ...prev.margens,
                [name]: value,
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

                <fieldset className="border border-gray-200 rounded-lg p-4">
                    <legend className="text-sm font-medium text-gray-700 px-2">Modelo de Cabeçalho</legend>
                    <div className="mt-2">
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

                {/* --- NOVO: Seção de Configuração de Margens --- */}
                <fieldset className="border border-gray-200 rounded-lg p-4">
                    <legend className="text-sm font-medium text-gray-700 px-2">Margens da Página (em cm)</legend>
                    <div className="grid grid-cols-4 gap-4 mt-2">
                        <div>
                            <label htmlFor="top" className="block text-xs text-gray-600 mb-1">Superior</label>
                            <input
                                type="number"
                                id="top"
                                name="top"
                                value={tempConfig.margens.top}
                                onChange={handleMarginChange}
                                className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm"
                                step="0.1"
                            />
                        </div>
                         <div>
                            <label htmlFor="bottom" className="block text-xs text-gray-600 mb-1">Inferior</label>
                            <input
                                type="number"
                                id="bottom"
                                name="bottom"
                                value={tempConfig.margens.bottom}
                                onChange={handleMarginChange}
                                className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm"
                                step="0.1"
                            />
                        </div>
                         <div>
                            <label htmlFor="left" className="block text-xs text-gray-600 mb-1">Esquerda</label>
                            <input
                                type="number"
                                id="left"
                                name="left"
                                value={tempConfig.margens.left}
                                onChange={handleMarginChange}
                                className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm"
                                step="0.1"
                            />
                        </div>
                         <div>
                            <label htmlFor="right" className="block text-xs text-gray-600 mb-1">Direita</label>
                            <input
                                type="number"
                                id="right"
                                name="right"
                                value={tempConfig.margens.right}
                                onChange={handleMarginChange}
                                className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm"
                                step="0.1"
                            />
                        </div>
                    </div>
                </fieldset>

                <fieldset className="border border-gray-200 rounded-lg p-4">
                    <legend className="text-sm font-medium text-gray-700 px-2">Colunas para Imprimir</legend>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        {(Object.keys(tempConfig.colunas) as Array<keyof ColunasExtrato>).map(col => (
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