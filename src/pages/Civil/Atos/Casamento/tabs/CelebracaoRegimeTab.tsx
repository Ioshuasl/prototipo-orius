import React from 'react';
import { Info } from 'lucide-react';
import { type ICasamentoFormData } from '../../../types';

interface CelebracaoRegimeTabProps {
    formData: ICasamentoFormData;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onPactoModalOpen: () => void;
    SectionTitle: React.FC<{ children: React.ReactNode }>;
    SubSectionTitle: React.FC<{ children: React.ReactNode }>;
}

export default function CelebracaoRegimeTab({ formData, handleInputChange, onPactoModalOpen, SectionTitle, SubSectionTitle }: CelebracaoRegimeTabProps) {
    const { celebracao, regimeBens } = formData;
    
    const commonInputClass = "mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500";
    const commonLabelClass = "block text-sm font-medium text-gray-700";
    const requiredSpan = <span className="text-red-500">*</span>;

    return (
        <fieldset>
            <SectionTitle>Celebração e Regime de Bens</SectionTitle>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Card da Celebração */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <SubSectionTitle>Dados da Celebração</SubSectionTitle>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 mt-4">
                        <div className="sm:col-span-2">
                            <label htmlFor="celebracao.tipoCelebracao" className={commonLabelClass}>Tipo de Casamento {requiredSpan}</label>
                            <select name="celebracao.tipoCelebracao" id="celebracao.tipoCelebracao" value={celebracao.tipoCelebracao} onChange={handleInputChange} className={commonInputClass}>
                                <option value="Civil">Civil</option>
                                <option value="Religioso com Efeito Civil">Religioso com Efeito Civil</option>
                            </select>
                        </div>

                        {celebracao.tipoCelebracao === 'Civil' && (
                            <>
                                <div className="sm:col-span-2">
                                    <label htmlFor="celebracao.dataCelebracao" className={commonLabelClass}>Data da Celebração {requiredSpan}</label>
                                    <input type="date" name="celebracao.dataCelebracao" id="celebracao.dataCelebracao" value={celebracao.dataCelebracao} onChange={handleInputChange} className={commonInputClass} />
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="celebracao.local" className={commonLabelClass}>Local da Celebração</label>
                                    <select name="celebracao.local" id="celebracao.local" value={celebracao.local} onChange={handleInputChange} className={commonInputClass}>
                                        <option value="Cartório">Na Serventia (Cartório)</option>
                                        <option value="Edifício Particular">Em Edifício Particular</option>
                                    </select>
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="celebracao.juizDePaz" className={commonLabelClass}>Presidente do Ato {requiredSpan}</label>
                                    <input type="text" name="celebracao.juizDePaz" id="celebracao.juizDePaz" value={celebracao.juizDePaz} onChange={handleInputChange} className={commonInputClass} placeholder="Nome do Juiz de Paz" />
                                </div>
                            </>
                        )}

                        {celebracao.tipoCelebracao === 'Religioso com Efeito Civil' && (
                            <>
                                <div className="sm:col-span-2">
                                    <label htmlFor="celebracao.dataCelebracao" className={commonLabelClass}>Data da Celebração Religiosa {requiredSpan}</label>
                                    <input type="date" name="celebracao.dataCelebracao" id="celebracao.dataCelebracao" value={celebracao.dataCelebracao} onChange={handleInputChange} className={commonInputClass} />
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="celebracao.cultoReligioso" className={commonLabelClass}>Culto Religioso {requiredSpan}</label>
                                    <input type="text" name="celebracao.cultoReligioso" id="celebracao.cultoReligioso" value={celebracao.cultoReligioso || ''} onChange={handleInputChange} className={commonInputClass} placeholder="Ex: Igreja Católica, Igreja Batista" />
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="celebracao.celebranteReligioso" className={commonLabelClass}>Nome do Celebrante {requiredSpan}</label>
                                    <input type="text" name="celebracao.celebranteReligioso" id="celebracao.celebranteReligioso" value={celebracao.celebranteReligioso || ''} onChange={handleInputChange} className={commonInputClass} placeholder="Nome completo do celebrante" />
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="celebracao.qualidadeCelebrante" className={commonLabelClass}>Qualidade do Celebrante {requiredSpan}</label>
                                    <input type="text" name="celebracao.qualidadeCelebrante" id="celebracao.qualidadeCelebrante" value={celebracao.qualidadeCelebrante || ''} onChange={handleInputChange} className={commonInputClass} placeholder="Ex: Padre, Pastor, Rabino" />
                                </div>
                            </>
                        )}

                        <div className="sm:col-span-2 pt-5 mt-4 border-t border-gray-200">
                            <label htmlFor="celebracao.dataPublicacaoProclamas" className={commonLabelClass}>Data de Publicação dos Proclamas</label>
                            <input type="date" name="celebracao.dataPublicacaoProclamas" id="celebracao.dataPublicacaoProclamas" value={celebracao.dataPublicacaoProclamas} onChange={handleInputChange} className={commonInputClass} />
                        </div>
                    </div>
                </div>

                {/* Card do Regime de Bens */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <SubSectionTitle>Regime de Bens</SubSectionTitle>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 mt-4">
                        <div className="sm:col-span-2">
                            <label htmlFor="regimeBens.tipo" className={commonLabelClass}>Tipo de Regime {requiredSpan}</label>
                            <select name="regimeBens.tipo" id="regimeBens.tipo" value={regimeBens.tipo} onChange={handleInputChange} className={commonInputClass}>
                                <option>Selecione...</option>
                                <option>Comunhão Parcial de Bens</option>
                                <option>Comunhão Universal de Bens</option>
                                <option>Separação Total de Bens</option>
                                <option>Separação Obrigatória de Bens</option>
                                <option>Participação Final nos Aquestos</option>
                            </select>
                        </div>

                        {regimeBens.pactoAntenupcial && (
                            <div className="sm:col-span-2 mt-4 pt-5 border-t border-gray-200 animate-fade-in space-y-4">
                                <div className="flex items-center gap-2">
                                    <h5 className="font-semibold text-gray-700">Dados do Pacto Antenupcial {requiredSpan}</h5>
                                    <button type="button" onClick={onPactoModalOpen} className="text-blue-600 hover:text-blue-800 transition-colors" aria-label="Saiba mais sobre o Pacto Antenupcial">
                                        <Info className="h-5 w-5" />
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                                    <div>
                                        <label htmlFor="regimeBens.pactoAntenupcial.data" className={commonLabelClass}>Data</label>
                                        <input type="date" name="regimeBens.pactoAntenupcial.data" value={regimeBens.pactoAntenupcial.data} onChange={handleInputChange} className={commonInputClass} />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label htmlFor="regimeBens.pactoAntenupcial.serventia" className={commonLabelClass}>Serventia</label>
                                        <input type="text" name="regimeBens.pactoAntenupcial.serventia" value={regimeBens.pactoAntenupcial.serventia} onChange={handleInputChange} className={commonInputClass} placeholder="Ex: 1º Tabelionato de Notas de Goiânia-GO" />
                                    </div>
                                    <div>
                                        <label htmlFor="regimeBens.pactoAntenupcial.livro" className={commonLabelClass}>Livro</label>
                                        <input type="text" name="regimeBens.pactoAntenupcial.livro" value={regimeBens.pactoAntenupcial.livro} onChange={handleInputChange} className={commonInputClass} />
                                    </div>
                                    <div>
                                        <label htmlFor="regimeBens.pactoAntenupcial.folha" className={commonLabelClass}>Folha</label>
                                        <input type="text" name="regimeBens.pactoAntenupcial.folha" value={regimeBens.pactoAntenupcial.folha} onChange={handleInputChange} className={commonInputClass} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </fieldset>
    );
}