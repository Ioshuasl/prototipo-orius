import React from 'react';
import {
    Globe, FileWarning, BellOff, Siren, HelpingHand, HeartHandshake, UserCheck, Users2,
    PlusCircle, Trash2, History, BookKey, PenSquare, EarOff, Languages, FileBadge
} from 'lucide-react';
import { type ICasamentoFormData, type IEndereco, type TPessoaTipo } from '../../../types';
import PersonFields from '../../../../Components/PersonFields';
import TriagemCasoEspecialCard from '../../../Components/TriagemCasoEspecialCard';
import SeletorDePessoa from '../../../../Components/SeletorDePessoa';

interface PartesAdicionaisTabProps {
    formData: ICasamentoFormData;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    handleAddressUpdate: (path: (string | number)[], addressData: Partial<IEndereco>) => void;
    handleCpfSearch: (pathPrefix: (string | number)[], cpf: string) => void;
    searchingCpf: string | null;
    handleAddTestemunha: () => void;
    handleRemoveTestemunha: (index: number) => void;
    handleCnpjSearch: (pathPrefix: (string | number)[], cnpj: string) => void;
    searchingCnpj: string | null;
    onDadosChange: (path: (string|number)[], novosDados: Partial<TPessoaTipo>) => void;
    onAddSocio: (path: (string|number)[]) => void;
    onRemoveSocio: (path: (string|number)[], index: number) => void;
    handleAddFilho: () => void;
    handleRemoveFilho: (index: number) => void;
    SectionTitle: React.FC<{ children: React.ReactNode }>;
    SubSectionTitle: React.FC<{ children: React.ReactNode }>;
}

export default function PartesAdicionaisTab({
    formData, handleInputChange, handleAddressUpdate, handleCpfSearch, searchingCpf,
    handleAddTestemunha, handleRemoveTestemunha, handleCnpjSearch, searchingCnpj,
    onDadosChange, onAddSocio, onRemoveSocio, handleAddFilho, handleRemoveFilho,
    SectionTitle, SubSectionTitle
}: PartesAdicionaisTabProps) {

    // ALTERADO: Classes de foco agora usam a cor laranja da marca.
    const commonInputClass = "mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]";
    const commonLabelClass = "block text-sm font-medium text-gray-700";

    const casosEspeciaisOptions = [
        // ... (conteúdo do array inalterado)
        { key: 'temNubenteEstrangeiro', icon: Globe, title: 'Nubente Estrangeiro', text: 'Um ou ambos os nubentes são de nacionalidade estrangeira.' },
        { key: 'conjuge1TeveCasamentoAnterior', icon: History, title: 'Cônjuge 1 Casado Anteriormente', text: 'O primeiro nubente já foi casado (divorciado, viúvo, etc).' },
        { key: 'conjuge2TeveCasamentoAnterior', icon: History, title: 'Cônjuge 2 Casado Anteriormente', text: 'O segundo nubente já foi casado (divorciado, viúvo, etc).' },
        { key: 'nubenteNaoAssina', icon: PenSquare, title: 'Nubente Não Assina', text: 'Um dos nubentes não pode ou não sabe assinar. Requer assinatura "a rogo".' },
        { key: 'nubenteNaoFalaPortugues', icon: Languages, title: 'Nubente Não Fala Português', text: 'Um dos noivos não compreende o idioma nacional. Requer tradutor público.' },
        { key: 'nubenteSurdoMudo', icon: EarOff, title: 'Nubente Surdo-Mudo', text: 'Um dos nubentes necessita de intérprete de Libras para expressar sua vontade.' },
        { key: 'temFilhosEmComum', icon: Users2, title: 'Filhos em Comum', text: 'Os nubentes possuem filhos em comum nascidos antes deste casamento.' },
        { key: 'isPorProcuracao', icon: UserCheck, title: 'Casamento por Procuração', text: 'Um ou ambos nubentes representados por procurador com poderes especiais.' },
        { key: 'declaracaoDePobreza', icon: FileBadge, title: 'Declaração de Pobreza', text: 'Isenção de emolumentos para habilitação, registro e 1ª certidão.' },
        { key: 'dispensaProclamas', icon: BellOff, title: 'Dispensa de Proclamas', text: 'A publicação dos editais de proclamas foi dispensada por motivo de urgência.' },
        { key: 'isMolestiaGrave', icon: HelpingHand, title: 'Moléstia Grave', text: 'Celebração devido a doença grave que impeça a locomoção de um dos noivos.' },
        { key: 'isNuncupativo', icon: Siren, title: 'Risco de Vida (Nuncupativo)', text: 'Casamento realizado em iminente risco de morte, com 6 testemunhas.' },
        { key: 'isConversaoUniaoEstavel', icon: HeartHandshake, title: 'Conversão de União Estável', text: 'Formaliza uma união estável já existente em casamento.' },
        { key: 'afastamentoCausaSuspensiva', icon: FileWarning, title: 'Afastamento de Causa Suspensiva', text: 'Comprovação para afastar impedimentos do Art. 1.523 do CC.' },
        ...(formData.celebracao.tipoCelebracao === 'Religioso com Efeito Civil' ? [{ key: 'suprirOmissaoTermoReligioso', icon: BookKey, title: 'Suprir Omissão em Termo Religioso', text: 'Suprir a falta de algum requisito no termo da cerimônia religiosa.' }] : [])
    ];

    return (
        <fieldset className="space-y-4">
            <SectionTitle>Partes Adicionais e Situações Específicas</SectionTitle>

            <div>
                <SubSectionTitle>Testemunhas do Casamento</SubSectionTitle>
                <p className="text-sm text-gray-500 mb-4">Mínimo de 2 testemunhas. Para casamentos em edifício particular, são necessárias 4 testemunhas.</p>
                {formData.testemunhas.map((testemunha, index) => (
                    <div key={index} className="mb-4 p-4 rounded-lg border border-gray-300">
                        <div className="flex justify-between items-center mb-2">
                             {/* ALTERADO: Cor do título da testemunha */}
                            <h5 className="font-semibold text-[#dd6825]">{index + 1}ª Testemunha</h5>
                            {index >= 2 && (
                                <button type="button" onClick={() => handleRemoveTestemunha(index)} className="text-red-600 hover:text-red-800">
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                        <PersonFields
                            personData={testemunha}
                            pathPrefix={['testemunhas', index]}
                            handleInputChange={handleInputChange}
                            handleAddressUpdate={handleAddressUpdate}
                            handleCpfSearch={handleCpfSearch}
                            searchingCpf={searchingCpf}
                            isWitness={true}
                        />
                    </div>
                ))}
                {/* ALTERADO: Cor do link "Adicionar Testemunha" */}
                <button type="button" onClick={handleAddTestemunha} className="mt-2 ml-2 flex items-center gap-2 text-sm font-medium text-[#dd6825] hover:text-[#c25a1f]">
                    <PlusCircle size={16} /> Adicionar Testemunha
                </button>
            </div>

            <div className="border-t border-gray-200 pt-4">
                <SubSectionTitle>Situações Específicas</SubSectionTitle>
                <p className="text-sm text-gray-500 mb-4">Selecione abaixo todas as situações que se aplicam a este ato de casamento. Os campos necessários aparecerão conforme a seleção.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {casosEspeciaisOptions.map(({ key, icon, title, text }) => {
                        const isActive = !!formData.casosEspeciais[key as keyof typeof formData.casosEspeciais];
                        return (
                            <TriagemCasoEspecialCard
                                key={key} icon={icon} title={title} text={text} isActive={isActive}
                                onClick={() => handleInputChange({ target: { name: `casosEspeciais.${key}`, checked: !isActive, type: 'checkbox' } } as any)}
                            />
                        );
                    })}
                </div>

                <div className="mt-8 space-y-6">
                    {formData.casosEspeciais.isPorProcuracao && (
                        <div className="p-5 bg-white border border-gray-300 rounded-lg animate-fade-in space-y-4">
                            <h4 className="font-bold text-gray-700 mb-3">Detalhes da Procuração</h4>
                            <div className="space-y-2">
                                {/* ALTERADO: Cor dos checkboxes */}
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" id="casosEspeciais.conjuge1TemProcurador" name="casosEspeciais.conjuge1TemProcurador" checked={formData.casosEspeciais.conjuge1TemProcurador} onChange={handleInputChange} className="h-4 w-4 text-[#dd6825] border-gray-300 rounded focus:ring-[#dd6825]" />
                                    <label htmlFor="casosEspeciais.conjuge1TemProcurador" className="font-medium text-gray-700">1º Cônjuge é representado por procurador?</label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" id="casosEspeciais.conjuge2TemProcurador" name="casosEspeciais.conjuge2TemProcurador" checked={formData.casosEspeciais.conjuge2TemProcurador} onChange={handleInputChange} className="h-4 w-4 text-[#dd6825] border-gray-300 rounded focus:ring-[#dd6825]" />
                                    <label htmlFor="casosEspeciais.conjuge2TemProcurador" className="font-medium text-gray-700">2º Cônjuge é representado por procurador?</label>
                                </div>
                            </div>
                            {formData.casosEspeciais.conjuge1TemProcurador && (
                                <div className="pt-4 border-t border-gray-200">
                                    {/* ALTERADO: Cor do título */}
                                    <h5 className="font-semibold text-[#dd6825] mb-2">Dados do Procurador(a) do 1º Cônjuge</h5>
                                    <SeletorDePessoa
                                        dados={formData.casosEspeciais.procuradorConjuge1!} pathPrefix={['casosEspeciais', 'procuradorConjuge1']}
                                        handleInputChange={handleInputChange} handleAddressUpdate={handleAddressUpdate} handleCpfSearch={handleCpfSearch} handleCnpjSearch={handleCnpjSearch}
                                        searchingCpf={searchingCpf} searchingCnpj={searchingCnpj} onDadosChange={(novosDados) => onDadosChange(['casosEspeciais', 'procuradorConjuge1'], novosDados)}
                                        onAddSocio={() => onAddSocio(['casosEspeciais', 'procuradorConjuge1'])} onRemoveSocio={(index) => onRemoveSocio(['casosEspeciais', 'procuradorConjuge1'], index)}
                                    />
                                </div>
                            )}
                             {formData.casosEspeciais.conjuge2TemProcurador && (
                                <div className="pt-4 border-t border-gray-200">
                                    {/* ALTERADO: Cor do título */}
                                    <h5 className="font-semibold text-[#dd6825] mb-2">Dados do Procurador(a) do 2º Cônjuge</h5>
                                    <SeletorDePessoa
                                        dados={formData.casosEspeciais.procuradorConjuge2!} pathPrefix={['casosEspeciais', 'procuradorConjuge2']}
                                        handleInputChange={handleInputChange} handleAddressUpdate={handleAddressUpdate} handleCpfSearch={handleCpfSearch} handleCnpjSearch={handleCnpjSearch}
                                        searchingCpf={searchingCpf} searchingCnpj={searchingCnpj} onDadosChange={(novosDados) => onDadosChange(['casosEspeciais', 'procuradorConjuge2'], novosDados)}
                                        onAddSocio={() => onAddSocio(['casosEspeciais', 'procuradorConjuge2'])} onRemoveSocio={(index) => onRemoveSocio(['casosEspeciais', 'procuradorConjuge2'], index)}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                    {formData.casosEspeciais.conjuge1TeveCasamentoAnterior && (
                        <div className="p-5 bg-white border border-gray-300 rounded-lg animate-fade-in">
                            <h4 className="font-bold text-gray-700 mb-3">Dados da Dissolução Anterior (1º Cônjuge)</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label htmlFor="casosEspeciais.infoCasamentoAnteriorConjuge1.nomePrecedente" className={commonLabelClass}>Nome de solteiro(a)</label><input type="text" name="casosEspeciais.infoCasamentoAnteriorConjuge1.nomePrecedente" id="casosEspeciais.infoCasamentoAnteriorConjuge1.nomePrecedente" value={formData.casosEspeciais.infoCasamentoAnteriorConjuge1?.nomePrecedente || ''} onChange={handleInputChange} className={commonInputClass} /></div>
                                <div><label htmlFor="casosEspeciais.infoCasamentoAnteriorConjuge1.dataDissolucao" className={commonLabelClass}>Data da Dissolução</label><input type="date" name="casosEspeciais.infoCasamentoAnteriorConjuge1.dataDissolucao" id="casosEspeciais.infoCasamentoAnteriorConjuge1.dataDissolucao" value={formData.casosEspeciais.infoCasamentoAnteriorConjuge1?.dataDissolucao || ''} onChange={handleInputChange} className={commonInputClass} /></div>
                            </div>
                        </div>
                    )}
                    {formData.casosEspeciais.conjuge2TeveCasamentoAnterior && (
                        <div className="p-5 bg-white border border-gray-300 rounded-lg animate-fade-in">
                            <h4 className="font-bold text-gray-700 mb-3">Dados da Dissolução Anterior (2º Cônjuge)</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label htmlFor="casosEspeciais.infoCasamentoAnteriorConjuge2.nomePrecedente" className={commonLabelClass}>Nome de solteiro(a)</label><input type="text" name="casosEspeciais.infoCasamentoAnteriorConjuge2.nomePrecedente" id="casosEspeciais.infoCasamentoAnteriorConjuge2.nomePrecedente" value={formData.casosEspeciais.infoCasamentoAnteriorConjuge2?.nomePrecedente || ''} onChange={handleInputChange} className={commonInputClass} /></div>
                                <div><label htmlFor="casosEspeciais.infoCasamentoAnteriorConjuge2.dataDissolucao" className={commonLabelClass}>Data da Dissolução</label><input type="date" name="casosEspeciais.infoCasamentoAnteriorConjuge2.dataDissolucao" id="casosEspeciais.infoCasamentoAnteriorConjuge2.dataDissolucao" value={formData.casosEspeciais.infoCasamentoAnteriorConjuge2?.dataDissolucao || ''} onChange={handleInputChange} className={commonInputClass} /></div>
                            </div>
                        </div>
                    )}
                    {formData.casosEspeciais.temFilhosEmComum && (
                        <div className="p-5 bg-white border border-gray-300 rounded-lg animate-fade-in">
                            <h4 className="font-bold text-gray-700 mb-3">Filhos em Comum</h4>
                            {formData.casosEspeciais.filhosEmComum.map((filho, index) => (
                                <div key={index} className="flex items-end gap-3 p-2 last:border-b-0">
                                    <div className="flex-grow"><label htmlFor={`casosEspeciais.filhosEmComum.${index}.nome`} className={commonLabelClass}>Nome do Filho(a)</label><input type="text" name={`casosEspeciais.filhosEmComum.${index}.nome`} value={filho.nome} onChange={handleInputChange} className={commonInputClass} /></div>
                                    <div className="flex-grow"><label htmlFor={`casosEspeciais.filhosEmComum.${index}.dataNascimento`} className={commonLabelClass}>Data de Nascimento</label><input type="date" name={`casosEspeciais.filhosEmComum.${index}.dataNascimento`} value={filho.dataNascimento} onChange={handleInputChange} className={commonInputClass} /></div>
                                    <button type="button" onClick={() => handleRemoveFilho(index)} className="text-red-500 hover:text-red-700 p-2 mb-1"><Trash2 size={18} /></button>
                                </div>
                            ))}
                             {/* ALTERADO: Cor do link "Adicionar Filho(a)" */}
                            <button type="button" onClick={handleAddFilho} className="mt-4 flex items-center gap-2 text-sm font-medium text-[#dd6825] hover:text-[#c25a1f]"><PlusCircle size={16} /> Adicionar Filho(a)</button>
                        </div>
                    )}
                    {formData.casosEspeciais.afastamentoCausaSuspensiva && (
                        <div className="p-5 bg-white border border-gray-300 rounded-lg animate-fade-in">
                            <h4 className="font-bold text-gray-700 mb-3">Detalhes do Afastamento de Causa Suspensiva</h4>
                            <label htmlFor="casosEspeciais.justificativaAfastamentoCS" className={commonLabelClass}>Justificativa / Documento Comprobatório</label>
                            <input type="text" name="casosEspeciais.justificativaAfastamentoCS" id="casosEspeciais.justificativaAfastamentoCS" value={formData.casosEspeciais.justificativaAfastamentoCS || ''} onChange={handleInputChange} className={commonInputClass} placeholder="Ex: Inventário negativo processo nº..." />
                        </div>
                    )}
                    {formData.casosEspeciais.nubenteNaoAssina && (
                        <div className="p-5 bg-white border border-gray-300 rounded-lg animate-fade-in">
                            <h4 className="font-bold text-gray-700 mb-3">Assinatura a Rogo</h4>
                            <label htmlFor="casosEspeciais.nomeRogatario" className={commonLabelClass}>Nome Completo de quem assina a rogo</label>
                            <input type="text" name="casosEspeciais.nomeRogatario" id="casosEspeciais.nomeRogatario" value={formData.casosEspeciais.nomeRogatario || ''} onChange={handleInputChange} className={commonInputClass} placeholder="Nome do rogatário" />
                        </div>
                    )}
                    {formData.casosEspeciais.nubenteNaoFalaPortugues && (
                        <div className="p-5 bg-white border border-gray-300 rounded-lg animate-fade-in">
                            <h4 className="font-bold text-gray-700 mb-3">Tradutor Público</h4>
                            <label htmlFor="casosEspeciais.nomeTradutorPublico" className={commonLabelClass}>Nome Completo do Tradutor Público</label>
                            <input type="text" name="casosEspeciais.nomeTradutorPublico" id="casosEspeciais.nomeTradutorPublico" value={formData.casosEspeciais.nomeTradutorPublico || ''} onChange={handleInputChange} className={commonInputClass} placeholder="Nome do tradutor" />
                        </div>
                    )}
                    {formData.casosEspeciais.nubenteSurdoMudo && (
                        <div className="p-5 bg-white border border-gray-300 rounded-lg animate-fade-in">
                            <h4 className="font-bold text-gray-700 mb-3">Intérprete de Libras</h4>
                            <label htmlFor="casosEspeciais.nomeInterpreteLibras" className={commonLabelClass}>Nome Completo do Intérprete de Libras</label>
                            <input type="text" name="casosEspeciais.nomeInterpreteLibras" id="casosEspeciais.nomeInterpreteLibras" value={formData.casosEspeciais.nomeInterpreteLibras || ''} onChange={handleInputChange} className={commonInputClass} placeholder="Nome do intérprete" />
                        </div>
                    )}
                </div>
            </div>
        </fieldset>
    );
}