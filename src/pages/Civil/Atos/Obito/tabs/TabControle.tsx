import React from 'react';
import { Award } from 'lucide-react';
import { type IObitoFormData, type RuleKey } from '../../../types';

// A interface de Props agora inclui os componentes e estilos que serão recebidos
interface TabControleProps {
    formData: IObitoFormData;
    isControlReadOnly: boolean;
    isRegistroTardio: boolean;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    handleLavrarAto: () => void;
    openInfoModal: (ruleKey: RuleKey) => void;
    livrosDisponiveis: string[];
    // Props de UI
    SectionTitle: React.FC<{ children: React.ReactNode }>;
    SubSectionTitle: React.FC<{ children: React.ReactNode }>;
    InfoBox: React.FC<{ type?: 'info' | 'warning', children: React.ReactNode }>;
    HelpButton: React.FC<{ onClick: () => void }>;
    commonInputClass: string;
    commonLabelClass: string;
    requiredSpan: React.ReactNode;
}

export default function TabControle({
    formData,
    isControlReadOnly,
    isRegistroTardio,
    handleInputChange,
    handleLavrarAto,
    openInfoModal,
    livrosDisponiveis,
    SectionTitle,
    SubSectionTitle,
    InfoBox,
    HelpButton,
    commonInputClass,
    commonLabelClass,
    requiredSpan
}: TabControleProps) {
    const { controleRegistro } = formData;
    const controlInputClass = `${commonInputClass} ${isControlReadOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`;

    return (
        <fieldset>
            <SectionTitle>Controle do Ato</SectionTitle>
            <div className="mb-6">
                <label htmlFor="controleRegistro.naturezaRegistro" className={`${commonLabelClass} flex items-center`}>
                    Natureza do Registro {requiredSpan}
                    <HelpButton onClick={() => openInfoModal('naturezaRegistro')} />
                </label>
                <select name="controleRegistro.naturezaRegistro" id="controleRegistro.naturezaRegistro" className={commonInputClass} value={controleRegistro.naturezaRegistro} onChange={handleInputChange}>
                    <option value="Comum">Óbito Comum</option>
                    <option value="Presumida">Morte Presumida (Sentença Judicial)</option>
                    <option value="Catastrofe">Desaparecimento em Catástrofe (Mandado Judicial)</option>
                </select>
            </div>

            {controleRegistro.naturezaRegistro !== 'Comum' && (
                 <div className="p-4 border border-blue-300 rounded-lg bg-blue-50 mb-8 animate-fade-in">
                    <SubSectionTitle>Dados do Processo Judicial</SubSectionTitle>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                        <div><label htmlFor="controleRegistro.processoJudicial.numero" className={commonLabelClass}>Nº do Processo {requiredSpan}</label><input type="text" name="controleRegistro.processoJudicial.numero" className={commonInputClass} value={controleRegistro.processoJudicial.numero} onChange={handleInputChange} /></div>
                        <div><label htmlFor="controleRegistro.processoJudicial.varaComarca" className={commonLabelClass}>Vara / Comarca {requiredSpan}</label><input type="text" name="controleRegistro.processoJudicial.varaComarca" className={commonInputClass} value={controleRegistro.processoJudicial.varaComarca} onChange={handleInputChange} /></div>
                        <div><label htmlFor="controleRegistro.processoJudicial.dataSentenca" className={commonLabelClass}>Data da Sentença/Mandado {requiredSpan}</label><input type="date" name="controleRegistro.processoJudicial.dataSentenca" className={commonInputClass} value={controleRegistro.processoJudicial.dataSentenca} onChange={handleInputChange} /></div>
                        <div><label htmlFor="controleRegistro.processoJudicial.juiz" className={commonLabelClass}>Nome do Juiz {requiredSpan}</label><input type="text" name="controleRegistro.processoJudicial.juiz" className={commonInputClass} value={controleRegistro.processoJudicial.juiz} onChange={handleInputChange} /></div>
                    </div>
                    <InfoBox type="info">Na aba 'Documentos', anexe uma cópia digital da Sentença ou Mandado Judicial.</InfoBox>
                </div>
            )}

            <div className="flex items-center mb-5">
                <input type="checkbox" name="controleRegistro.isLivroAntigo" id="controleRegistro.isLivroAntigo" className="form-checkbox h-5 w-5 text-blue-600 rounded" checked={controleRegistro.isLivroAntigo} onChange={handleInputChange} />
                <label htmlFor="controleRegistro.isLivroAntigo" className="ml-3 font-medium text-gray-700">Transcrição de livro antigo?</label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <div><label htmlFor="controleRegistro.dataRegistro" className={commonLabelClass}>Data do Registro {requiredSpan}</label><input type="date" name="controleRegistro.dataRegistro" id="controleRegistro.dataRegistro" className={controlInputClass} value={controleRegistro.dataRegistro} onChange={handleInputChange} readOnly={isControlReadOnly} /></div>
                <div><label htmlFor="controleRegistro.protocolo" className={commonLabelClass}>Nº do Protocolo {requiredSpan}</label><input type="text" name="controleRegistro.protocolo" id="controleRegistro.protocolo" className={controlInputClass} value={controleRegistro.protocolo} onChange={handleInputChange} readOnly={isControlReadOnly} placeholder={isControlReadOnly ? 'Automático' : ''} /></div>
            </div>

            {isRegistroTardio && (
                <div className="mt-6 animate-fade-in">
                    <InfoBox type="warning">
                        O registro está sendo realizado fora do prazo legal. É obrigatório informar o motivo.
                        <HelpButton onClick={() => openInfoModal('registroTardio')} />
                    </InfoBox>
                    <label htmlFor="controleRegistro.justificativaRegistroTardio" className={commonLabelClass}>Justificativa para o Registro Tardio {requiredSpan}</label>
                    <textarea name="controleRegistro.justificativaRegistroTardio" id="controleRegistro.justificativaRegistroTardio" rows={3} className={commonInputClass} value={controleRegistro.justificativaRegistroTardio} onChange={handleInputChange}></textarea>
                </div>
            )}

            <div className="mt-6 pt-6">
                <h4 className="font-semibold text-gray-600 mb-3">Dados da Lavratura</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-5">
                    <div><label htmlFor="controleRegistro.dataLavratura" className={commonLabelClass}>Data da Lavratura {requiredSpan}</label><input type="date" name="controleRegistro.dataLavratura" id="controleRegistro.dataLavratura" className={controlInputClass} value={controleRegistro.dataLavratura} onChange={handleInputChange} readOnly={isControlReadOnly} /></div>
                    <div><label htmlFor="controleRegistro.livro" className={commonLabelClass}>Livro {requiredSpan}</label><select name="controleRegistro.livro" id="controleRegistro.livro" className={controlInputClass} value={controleRegistro.livro} onChange={handleInputChange} disabled={isControlReadOnly}><option value="">{isControlReadOnly ? 'Automático' : 'Selecione...'}</option>{livrosDisponiveis.map(livro => <option key={livro} value={livro}>{livro}</option>)}</select></div>
                    <div><label htmlFor="controleRegistro.folha" className={commonLabelClass}>Folha {requiredSpan}</label><input type="text" name="controleRegistro.folha" id="controleRegistro.folha" className={controlInputClass} value={controleRegistro.folha} onChange={handleInputChange} readOnly={isControlReadOnly} placeholder={isControlReadOnly ? 'Automático' : ''} /></div>
                    <div><label htmlFor="controleRegistro.numeroTermo" className={commonLabelClass}>Nº do Termo {requiredSpan}</label><input type="text" name="controleRegistro.numeroTermo" id="controleRegistro.numeroTermo" className={controlInputClass} value={controleRegistro.numeroTermo} onChange={handleInputChange} readOnly={isControlReadOnly} placeholder={isControlReadOnly ? 'Automático' : ''} /></div>
                </div>
                <div className="mt-6 pt-6 flex justify-end"><button type="button" onClick={handleLavrarAto} className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"><Award className="h-5 w-5" />Lavrar Ato</button></div>
            </div>
        </fieldset>
    );
}