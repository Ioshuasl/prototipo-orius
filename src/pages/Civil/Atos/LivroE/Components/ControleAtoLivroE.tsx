import React from 'react';
import { Award } from 'lucide-react';
import { type ILivroEFormData } from '../../../types';
import { tiposDeAtoLivroE } from '../../../lib/Constants';

interface ControleAtoProps {
    formData: ILivroEFormData;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleTipoAtoChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    handleLavrarAto: () => void;
}

export default function ControleAtoLivroE({ formData, handleInputChange, handleTipoAtoChange, handleLavrarAto }: ControleAtoProps) {
    // ALTERADO: Estilos de foco agora usam a cor laranja da marca.
    const commonInputClass = "mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]";
    const commonLabelClass = "block text-sm font-medium text-gray-700";
    const requiredSpan = <span className="text-red-500">*</span>;

    const isControlReadOnly = !formData.controleRegistro.isLivroAntigo;
    const controlInputClass = `${commonInputClass} ${isControlReadOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`;

    return (
        <div className="space-y-8">
            <div>
                <label htmlFor="tipo-ato" className="block text-lg font-semibold text-gray-800 mb-2">
                    1. Selecione o Tipo de Ato do Livro E {requiredSpan}
                </label>
                {/* ALTERADO: Estilos de foco no seletor principal. */}
                <select
                    id="tipo-ato"
                    value={formData.tipoAto}
                    onChange={handleTipoAtoChange}
                    className="mt-1 w-full border border-gray-300 rounded-md p-3 text-lg shadow-sm focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]"
                >
                    <option value="" disabled>Selecione um tipo de ato...</option>
                    {tiposDeAtoLivroE.map(ato => (
                        <option key={ato.value} value={ato.value}>{ato.label}</option>
                    ))}
                </select>
            </div>

            <div className="space-y-6">
                 <div className="flex items-center">
                    {/* ALTERADO: Cor do checkbox. */}
                    <input
                        type="checkbox"
                        name="controleRegistro.isLivroAntigo"
                        id="controleRegistro.isLivroAntigo"
                        className="form-checkbox h-5 w-5 text-[#dd6825] rounded"
                        checked={formData.controleRegistro.isLivroAntigo}
                        onChange={handleInputChange}
                    />
                    <label htmlFor="controleRegistro.isLivroAntigo" className="ml-3 font-medium text-gray-700">
                        É uma transcrição de livro antigo?
                    </label>
                </div>
                
                <div>
                    <h4 className="font-semibold text-gray-600 mb-3">Dados do Registro</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                        <div>
                            <label htmlFor="controleRegistro.dataRegistro" className={commonLabelClass}>Data do Registro {isControlReadOnly ? null : requiredSpan}</label>
                            <input type="date" name="controleRegistro.dataRegistro" id="controleRegistro.dataRegistro" className={controlInputClass} value={formData.controleRegistro.dataRegistro} onChange={handleInputChange} readOnly={isControlReadOnly} />
                        </div>
                        <div>
                            <label htmlFor="controleRegistro.protocolo" className={commonLabelClass}>Nº do Protocolo {isControlReadOnly ? null : requiredSpan}</label>
                            <input type="text" name="controleRegistro.protocolo" id="controleRegistro.protocolo" className={controlInputClass} value={formData.controleRegistro.protocolo} onChange={handleInputChange} readOnly={isControlReadOnly} placeholder={isControlReadOnly ? 'Automático' : ''} />
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="font-semibold text-gray-600 mb-3">Dados da Lavratura</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-5">
                        <div>
                            <label htmlFor="controleRegistro.dataLavratura" className={commonLabelClass}>Data da Lavratura {isControlReadOnly ? null : requiredSpan}</label>
                            <input type="date" name="controleRegistro.dataLavratura" id="controleRegistro.dataLavratura" className={controlInputClass} value={formData.controleRegistro.dataLavratura} onChange={handleInputChange} readOnly={isControlReadOnly} />
                        </div>
                        <div>
                            <label htmlFor="controleRegistro.livro" className={commonLabelClass}>Livro {requiredSpan}</label>
                             <input type="text" name="controleRegistro.livro" id="controleRegistro.livro" className={`${commonInputClass} bg-gray-100 cursor-not-allowed`} value={formData.controleRegistro.livro} readOnly />
                        </div>
                        <div>
                            <label htmlFor="controleRegistro.folha" className={commonLabelClass}>Folha {isControlReadOnly ? null : requiredSpan}</label>
                            <input type="text" name="controleRegistro.folha" id="controleRegistro.folha" className={controlInputClass} value={formData.controleRegistro.folha} onChange={handleInputChange} readOnly={isControlReadOnly} placeholder={isControlReadOnly ? 'Automático' : ''} />
                        </div>
                        <div>
                            <label htmlFor="controleRegistro.numeroTermo" className={commonLabelClass}>Nº do Termo {isControlReadOnly ? null : requiredSpan}</label>
                            <input type="text" name="controleRegistro.numeroTermo" id="controleRegistro.numeroTermo" className={controlInputClass} value={formData.controleRegistro.numeroTermo} onChange={handleInputChange} readOnly={isControlReadOnly} placeholder={isControlReadOnly ? 'Automático' : ''} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-8 pt-2 flex justify-end">
                {/* ALTERADO: Cor do botão de ação principal "Lavrar Ato". */}
                <button
                    type="button"
                    onClick={handleLavrarAto}
                    className="flex items-center gap-2 bg-[#dd6825] text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-[#c25a1f] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dd6825]"
                >
                    <Award className="h-5 w-5" />
                    Lavrar Ato
                </button>
            </div>
        </div>
    );
}