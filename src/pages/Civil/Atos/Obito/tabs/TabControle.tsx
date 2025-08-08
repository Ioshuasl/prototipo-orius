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
    const { dadosAto, naturezaRegistro, processoJudicial, justificativaRegistroTardio } = formData;
    const controlInputClass = `${commonInputClass} ${isControlReadOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`;

    return (
        <fieldset>
            <SectionTitle>Controle do Ato</SectionTitle>
            <div className="mb-6">
                <label htmlFor="naturezaRegistro" className={`${commonLabelClass} flex items-center`}>
                    Natureza do Registro {requiredSpan}
                    <HelpButton onClick={() => openInfoModal('naturezaRegistro')} />
                </label>
                <select name="naturezaRegistro" id="naturezaRegistro" className={commonInputClass} value={naturezaRegistro} onChange={handleInputChange}>
                    <option value="Comum">Óbito Comum</option>
                    <option value="Presumida">Morte Presumida (Sentença Judicial)</option>
                    <option value="Catastrofe">Desaparecimento em Catástrofe (Mandado Judicial)</option>
                </select>
            </div>

            {naturezaRegistro !== 'Comum' && (
                 <div className="p-4 border border-blue-300 rounded-lg bg-blue-50 mb-8 animate-fade-in">
                    <SubSectionTitle>Dados do Processo Judicial</SubSectionTitle>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                        <div><label htmlFor="processoJudicial.numero" className={commonLabelClass}>Nº do Processo {requiredSpan}</label><input type="text" name="processoJudicial.numero" className={commonInputClass} value={processoJudicial.numero} onChange={handleInputChange} /></div>
                        <div><label htmlFor="processoJudicial.varaComarca" className={commonLabelClass}>Vara / Comarca {requiredSpan}</label><input type="text" name="processoJudicial.varaComarca" className={commonInputClass} value={processoJudicial.varaComarca} onChange={handleInputChange} /></div>
                        <div><label htmlFor="processoJudicial.dataSentenca" className={commonLabelClass}>Data da Sentença/Mandado {requiredSpan}</label><input type="date" name="processoJudicial.dataSentenca" className={commonInputClass} value={processoJudicial.dataSentenca} onChange={handleInputChange} /></div>
                        <div><label htmlFor="processoJudicial.juiz" className={commonLabelClass}>Nome do Juiz {requiredSpan}</label><input type="text" name="processoJudicial.juiz" className={commonInputClass} value={processoJudicial.juiz} onChange={handleInputChange} /></div>
                    </div>
                    <InfoBox type="info">Na aba 'Documentos', anexe uma cópia digital da Sentença ou Mandado Judicial.</InfoBox>
                </div>
            )}

            <div className="flex items-center mb-5">
                <input type="checkbox" name="dadosAto.isLivroAntigo" id="dadosAto.isLivroAntigo" className="form-checkbox h-5 w-5 text-blue-600 rounded" checked={dadosAto.isLivroAntigo} onChange={handleInputChange} />
                <label htmlFor="dadosAto.isLivroAntigo" className="ml-3 font-medium text-gray-700">Transcrição de livro antigo?</label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <div><label htmlFor="dadosAto.dataRegistro" className={commonLabelClass}>Data do Registro {requiredSpan}</label><input type="date" name="dadosAto.dataRegistro" id="dadosAto.dataRegistro" className={controlInputClass} value={dadosAto.dataRegistro} onChange={handleInputChange} readOnly={isControlReadOnly} /></div>
                <div><label htmlFor="dadosAto.protocolo" className={commonLabelClass}>Nº do Protocolo {requiredSpan}</label><input type="text" name="dadosAto.protocolo" id="dadosAto.protocolo" className={controlInputClass} value={dadosAto.protocolo} onChange={handleInputChange} readOnly={isControlReadOnly} placeholder={isControlReadOnly ? 'Automático' : ''} /></div>
            </div>

            {isRegistroTardio && (
                <div className="mt-6 animate-fade-in">
                    <InfoBox type="warning">
                        O registro está sendo realizado fora do prazo legal. É obrigatório informar o motivo.
                        <HelpButton onClick={() => openInfoModal('registroTardio')} />
                    </InfoBox>
                    <label htmlFor="dadosAto.justificativaRegistroTardio" className={commonLabelClass}>Justificativa para o Registro Tardio {requiredSpan}</label>
                    <textarea name="dadosAto.justificativaRegistroTardio" id="dadosAto.justificativaRegistroTardio" rows={3} className={commonInputClass} value={justificativaRegistroTardio} onChange={handleInputChange}></textarea>
                </div>
            )}

            <div className="mt-6 pt-6">
                <h4 className="font-semibold text-gray-600 mb-3">Dados da Lavratura</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-5">
                    <div><label htmlFor="dadosAto.dataLavratura" className={commonLabelClass}>Data da Lavratura {requiredSpan}</label><input type="date" name="dadosAto.dataLavratura" id="dadosAto.dataLavratura" className={controlInputClass} value={dadosAto.dataLavratura} onChange={handleInputChange} readOnly={isControlReadOnly} /></div>
                    <div><label htmlFor="dadosAto.livro" className={commonLabelClass}>Livro {requiredSpan}</label><select name="dadosAto.livro" id="dadosAto.livro" className={controlInputClass} value={dadosAto.livro} onChange={handleInputChange} disabled={isControlReadOnly}><option value="">{isControlReadOnly ? 'Automático' : 'Selecione...'}</option>{livrosDisponiveis.map(livro => <option key={livro} value={livro}>{livro}</option>)}</select></div>
                    <div><label htmlFor="dadosAto.folha" className={commonLabelClass}>Folha {requiredSpan}</label><input type="text" name="dadosAto.folha" id="dadosAto.folha" className={controlInputClass} value={dadosAto.folha} onChange={handleInputChange} readOnly={isControlReadOnly} placeholder={isControlReadOnly ? 'Automático' : ''} /></div>
                    <div><label htmlFor="dadosAto.numeroTermo" className={commonLabelClass}>Nº do Termo {requiredSpan}</label><input type="text" name="dadosAto.numeroTermo" id="dadosAto.numeroTermo" className={controlInputClass} value={dadosAto.numeroTermo} onChange={handleInputChange} readOnly={isControlReadOnly} placeholder={isControlReadOnly ? 'Automático' : ''} /></div>
                </div>
                <div className="mt-6 pt-6 flex justify-end"><button type="button" onClick={handleLavrarAto} className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"><Award className="h-5 w-5" />Lavrar Ato</button></div>
            </div>
        </fieldset>
    );
}