import React from 'react';
import { Award } from 'lucide-react';
import { type ICasamentoFormData } from '../../../types';

// Tipos das props que o componente recebe
interface ControleAtoTabProps {
    formData: ICasamentoFormData;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleLavrarAto: () => void;
    livrosDisponiveis: string[];
    SectionTitle: React.FC<{ children: React.ReactNode }>;
}

export default function ControleAtoTab({ formData, handleInputChange, handleLavrarAto, livrosDisponiveis, SectionTitle }: ControleAtoTabProps) {
    const { controleRegistro } = formData;
    const isControlReadOnly = !controleRegistro.isLivroAntigo;
    
    // ALTERADO: Classes de foco agora usam a cor laranja da marca.
    const commonInputClass = "mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]";
    const commonLabelClass = "block text-sm font-medium text-gray-700";
    const requiredSpan = <span className="text-red-500">*</span>;
    const controlInputClass = `${commonInputClass} ${isControlReadOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`;

    return (
        <fieldset>
            <SectionTitle>Controle do Ato</SectionTitle>
            <div className="flex items-center mb-5">
                {/* ALTERADO: Cor do checkbox para o laranja da marca. */}
                <input type="checkbox" name="controleRegistro.isLivroAntigo" id="controleRegistro.isLivroAntigo" className="form-checkbox h-5 w-5 text-[#dd6825] rounded" checked={controleRegistro.isLivroAntigo} onChange={handleInputChange} />
                <label htmlFor="controleRegistro.isLivroAntigo" className="ml-3 font-medium text-gray-700">Transcrição de livro antigo?</label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <div><label htmlFor="controleRegistro.dataRegistro" className={commonLabelClass}>Data do Registro {requiredSpan}</label><input type="date" name="controleRegistro.dataRegistro" id="controleRegistro.dataRegistro" className={controlInputClass} value={controleRegistro.dataRegistro} onChange={handleInputChange} readOnly={isControlReadOnly} /></div>
                <div><label htmlFor="controleRegistro.protocolo" className={commonLabelClass}>Nº do Protocolo {requiredSpan}</label><input type="text" name="controleRegistro.protocolo" id="controleRegistro.protocolo" className={controlInputClass} value={controleRegistro.protocolo} onChange={handleInputChange} readOnly={isControlReadOnly} placeholder={isControlReadOnly ? 'Automático' : ''} /></div>
            </div>
            <div className="mt-6 pt-6">
                <h4 className="font-semibold text-gray-600 mb-3">Dados da Lavratura</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-5">
                    <div><label htmlFor="controleRegistro.dataLavratura" className={commonLabelClass}>Data da Lavratura {requiredSpan}</label><input type="date" name="controleRegistro.dataLavratura" id="controleRegistro.dataLavratura" className={controlInputClass} value={controleRegistro.dataLavratura} onChange={handleInputChange} readOnly={isControlReadOnly} /></div>
                    <div><label htmlFor="controleRegistro.livro" className={commonLabelClass}>Livro {requiredSpan}</label><select name="controleRegistro.livro" id="controleRegistro.livro" className={controlInputClass} value={controleRegistro.livro} onChange={handleInputChange} disabled={isControlReadOnly}><option value="">{isControlReadOnly ? 'Automático' : 'Selecione...'}</option>{livrosDisponiveis.map(livro => <option key={livro} value={livro}>{livro}</option>)}</select></div>
                    <div><label htmlFor="controleRegistro.folha" className={commonLabelClass}>Folha {requiredSpan}</label><input type="text" name="controleRegistro.folha" id="controleRegistro.folha" className={controlInputClass} value={controleRegistro.folha} onChange={handleInputChange} readOnly={isControlReadOnly} placeholder={isControlReadOnly ? 'Automático' : ''} /></div>
                    <div><label htmlFor="controleRegistro.numeroTermo" className={commonLabelClass}>Nº do Termo {requiredSpan}</label><input type="text" name="controleRegistro.numeroTermo" id="controleRegistro.numeroTermo" className={controlInputClass} value={controleRegistro.numeroTermo} onChange={handleInputChange} readOnly={isControlReadOnly} placeholder={isControlReadOnly ? 'Automático' : ''} /></div>
                </div>
                <div className="mt-6 pt-6 flex justify-end">
                    {/* ALTERADO: Cor do botão de ação principal "Lavrar Ato" para o laranja da marca. */}
                    <button type="button" onClick={handleLavrarAto} className="flex items-center gap-2 bg-[#dd6825] text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-[#c25a1f] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dd6825]">
                        <Award className="h-5 w-5" />
                        Lavrar Ato
                    </button>
                </div>
            </div>
        </fieldset>
    );
}