import React from 'react';
import { Heart, Baby, PlusCircle, Trash2 } from 'lucide-react';
import { type IObitoFormData, type IEndereco, type RuleKey } from '../../../types';
import PersonFields from '../../../Components/PersonFields';

interface TabFalecidoFamiliaProps {
    formData: IObitoFormData;
    isMenorDeUmAno: boolean;
    searchingCpf: string | null;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    handleCpfSearch: (pathPrefix: (string | number)[], cpf: string) => void;
    handleAddressUpdate: (path: (string | number)[], addressData: Partial<IEndereco>) => void;
    handleAddFilho: () => void;
    handleRemoveFilho: (index: number) => void;
    openInfoModal: (ruleKey: RuleKey) => void;
    SectionTitle: React.FC<{ children: React.ReactNode }>;
    SubSectionTitle: React.FC<{ children: React.ReactNode }>;
    InfoBox: React.FC<{ type?: 'info' | 'warning', children: React.ReactNode }>;
    HelpButton: React.FC<{ onClick: () => void }>;
    commonInputClass: string;
    commonLabelClass: string;
    requiredSpan: React.ReactNode;
    ufs: string[];
}

export default function TabFalecidoFamilia({ 
    formData, 
    isMenorDeUmAno, 
    searchingCpf,
    handleInputChange,
    handleCpfSearch,
    handleAddressUpdate,
    handleAddFilho,
    handleRemoveFilho,
    openInfoModal,
    SectionTitle,
    SubSectionTitle,
    InfoBox,
    HelpButton,
    commonInputClass,
    commonLabelClass,
    requiredSpan,
    ufs
}: TabFalecidoFamiliaProps) {
    const { falecido, familia, naturezaRegistro } = formData;
    
    return (
        <div className="space-y-12">
            <fieldset>
                <SectionTitle>Dados do Falecido</SectionTitle>
                <PersonFields 
                    personData={falecido} 
                    pathPrefix={['falecido']} 
                    handleInputChange={handleInputChange}
                    handleAddressUpdate={handleAddressUpdate}
                    handleCpfSearch={handleCpfSearch}
                    searchingCpf={searchingCpf === 'falecido' ? 'buscando' : null} 
                />
                
                {isMenorDeUmAno && (
                    <div className="p-4 my-6 border border-yellow-300 rounded-lg bg-yellow-50 animate-fade-in">
                        <SubSectionTitle>
                            Verificação de Nascimento (Menor de 1 Ano)
                            <HelpButton onClick={() => openInfoModal('menorNaoRegistrado')} />
                        </SubSectionTitle>
                        <p className="text-sm -mt-2 mb-4">Antes de registrar o óbito, verifique se o nascimento foi registrado.</p>
                        <div>
                            <label className={commonLabelClass}>O nascimento da criança já foi registrado?{requiredSpan}</label>
                            <div className="flex gap-6 mt-2">
                                <label className="flex items-center gap-2"><input type="radio" name="falecido.nascimentoVerificado.status" value="Registrado" checked={falecido.nascimentoVerificado.status === 'Registrado'} onChange={handleInputChange} /> Sim</label>
                                <label className="flex items-center gap-2"><input type="radio" name="falecido.nascimentoVerificado.status" value="NaoRegistrado" checked={falecido.nascimentoVerificado.status === 'NaoRegistrado'} onChange={handleInputChange} /> Não</label>
                            </div>
                        </div>
                        {falecido.nascimentoVerificado.status === 'NaoRegistrado' && (
                            <InfoBox type="warning">
                                <b>Atenção:</b> O registro de nascimento deverá ser feito previamente ao de óbito. Colete os dados necessários e realize o ato de nascimento primeiro.
                            </InfoBox>
                        )}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-5 pt-4">
                    <div className="md:col-span-1"><label htmlFor="falecido.idade" className={commonLabelClass}>Idade (declarada){requiredSpan}</label><input type="text" id="falecido.idade" name="falecido.idade" value={falecido.idade} onChange={handleInputChange} className={commonInputClass} placeholder="Ex: 80 anos" /></div>
                    <div className="md:col-span-1"><label htmlFor="falecido.cor" className={commonLabelClass}>Cor{requiredSpan}</label><select id="falecido.cor" name="falecido.cor" value={falecido.cor} onChange={handleInputChange} className={commonInputClass}><option value="Parda">Parda</option><option value="Branca">Branca</option><option value="Preta">Preta</option><option value="Amarela">Amarela</option><option value="Indígena">Indígena</option><option value="Ignorada">Ignorada</option></select></div>
                    <div className="md:col-span-1"><label htmlFor="falecido.sexo" className={commonLabelClass}>Sexo{requiredSpan}</label><select id="falecido.sexo" name="falecido.sexo" value={falecido.sexo} onChange={handleInputChange} className={commonInputClass}><option value="Masculino">Masculino</option><option value="Feminino">Feminino</option><option value="Ignorado">Ignorado</option></select></div>
                    <div className="flex items-center self-end mb-1"><input id="falecido.eraEleitor" type="checkbox" name="falecido.eraEleitor" checked={falecido.eraEleitor} onChange={handleInputChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" /><label htmlFor="falecido.eraEleitor" className="ml-2 text-sm font-medium text-gray-700">Era eleitor?</label></div>
                </div>

                <div className="mt-10">
                    <SubSectionTitle>Dados de Documentação do Falecido</SubSectionTitle>
                    <p className="text-sm text-gray-500 -mt-2 mb-4">Pelo menos um dos seguintes documentos deve ser informado.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="lg:col-span-2"><label htmlFor="falecido.documentos.registroNascimentoCasamento" className={commonLabelClass}>Nº Reg. Nasc/Casam. (Livro, Folha, Termo)</label><input type="text" id="falecido.documentos.registroNascimentoCasamento" name="falecido.documentos.registroNascimentoCasamento" value={falecido.documentos.registroNascimentoCasamento || ''} onChange={handleInputChange} className={commonInputClass} /></div>
                        {falecido.eraEleitor && (<div><label htmlFor="falecido.documentos.tituloEleitor" className={commonLabelClass}>Título de Eleitor</label><input type="text" id="falecido.documentos.tituloEleitor" name="falecido.documentos.tituloEleitor" value={falecido.documentos.tituloEleitor || ''} onChange={handleInputChange} className={commonInputClass} /></div>)}
                        <div className="lg:col-span-2"><label htmlFor="falecido.documentos.carteiraTrabalho" className={commonLabelClass}>Nº e Série da Carteira de Trabalho</label><input type="text" id="falecido.documentos.carteiraTrabalho" name="falecido.documentos.carteiraTrabalho" value={falecido.documentos.carteiraTrabalho || ''} onChange={handleInputChange} className={commonInputClass} /></div>
                        <div><label htmlFor="falecido.documentos.pisPasep" className={commonLabelClass}>PIS/PASEP</label><input type="text" id="falecido.documentos.pisPasep" name="falecido.documentos.pisPasep" value={falecido.documentos.pisPasep || ''} onChange={handleInputChange} className={commonInputClass} /></div>
                        <div className="lg:col-span-4"><div className="flex items-center gap-3"><input id="falecido.documentos.eraBeneficiarioInss" type="checkbox" name="falecido.documentos.eraBeneficiarioInss" checked={falecido.documentos.eraBeneficiarioInss} onChange={handleInputChange} className="h-4 w-4" /><label htmlFor="falecido.documentos.eraBeneficiarioInss" className="text-sm font-medium">Era beneficiário da Previdência Social?</label></div></div>
                        {falecido.documentos.eraBeneficiarioInss && (<><div className="lg:col-span-2"><label htmlFor="falecido.documentos.inscricaoInss" className={commonLabelClass}>Nº Inscrição INSS (Contr. Individual)</label><input type="text" id="falecido.documentos.inscricaoInss" name="falecido.documentos.inscricaoInss" value={falecido.documentos.inscricaoInss || ''} onChange={handleInputChange} className={commonInputClass} /></div><div className="lg:col-span-2"><label htmlFor="falecido.documentos.beneficioInss" className={commonLabelClass}>Nº Benefício INSS (NB)</label><input type="text" id="falecido.documentos.beneficioInss" name="falecido.documentos.beneficioInss" value={falecido.documentos.beneficioInss || ''} onChange={handleInputChange} className={commonInputClass} /></div></>)}
                    </div>
                </div>
            </fieldset>

            <fieldset disabled={naturezaRegistro !== 'Comum'}>
                <SectionTitle>Filiação e Dados Familiares</SectionTitle>
                <div className="space-y-10">
                    <div className="p-4 border border-gray-300 rounded-lg bg-gray-50/50">
                        <h4 className="font-bold pb-2 mb-4">Pai do Falecido</h4>
                        <div className="space-y-4">
                            <div><label htmlFor="familia.pai.nome" className={commonLabelClass}>Nome</label><input type="text" id="familia.pai.nome" name="familia.pai.nome" value={familia.pai.nome || ''} onChange={handleInputChange} className={commonInputClass} /></div>
                            <div><label htmlFor="familia.pai.profissao" className={commonLabelClass}>Profissão</label><input type="text" id="familia.pai.profissao" name="familia.pai.profissao" value={familia.pai.profissao || ''} onChange={handleInputChange} className={commonInputClass} /></div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2"><label htmlFor="familia.pai.naturalidadeCidade" className={commonLabelClass}>Naturalidade</label><input type="text" id="familia.pai.naturalidadeCidade" name="familia.pai.naturalidadeCidade" value={familia.pai.naturalidadeCidade || ''} onChange={handleInputChange} className={commonInputClass} placeholder="Cidade de Nascimento" /></div>
                                <div><label htmlFor="familia.pai.naturalidadeUF" className={commonLabelClass}>UF</label><select id="familia.pai.naturalidadeUF" name="familia.pai.naturalidadeUF" value={familia.pai.naturalidadeUF || ''} onChange={handleInputChange} className={commonInputClass}><option value="">...</option>{ufs.map(uf => <option key={uf} value={uf}>{uf}</option>)}</select></div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border border-gray-300 rounded-lg bg-gray-50/50">
                        <h4 className="font-bold pb-2 mb-4">Mãe do Falecido</h4>
                        <div className="space-y-4">
                            <div><label htmlFor="familia.mae.nome" className={commonLabelClass}>Nome</label><input type="text" id="familia.mae.nome" name="familia.mae.nome" value={familia.mae.nome || ''} onChange={handleInputChange} className={commonInputClass} /></div>
                            <div><label htmlFor="familia.mae.profissao" className={commonLabelClass}>Profissão</label><input type="text" id="familia.mae.profissao" name="familia.mae.profissao" value={familia.mae.profissao || ''} onChange={handleInputChange} className={commonInputClass} /></div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2"><label htmlFor="familia.mae.naturalidadeCidade" className={commonLabelClass}>Naturalidade</label><input type="text" id="familia.mae.naturalidadeCidade" name="familia.mae.naturalidadeCidade" value={familia.mae.naturalidadeCidade || ''} onChange={handleInputChange} className={commonInputClass} placeholder="Cidade de Nascimento" /></div>
                                <div><label htmlFor="familia.mae.naturalidadeUF" className={commonLabelClass}>UF</label><select id="familia.mae.naturalidadeUF" name="familia.mae.naturalidadeUF" value={familia.mae.naturalidadeUF || ''} onChange={handleInputChange} className={commonInputClass}><option value="">...</option>{ufs.map(uf => <option key={uf} value={uf}>{uf}</option>)}</select></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6 mt-10">
                    <div className="flex items-center gap-3">
                        <Heart className="h-5 w-5 text-gray-500" />
                        <label htmlFor="familia.eraCasado" className="font-medium text-gray-700">Era casado(a)?</label>
                        <input id="familia.eraCasado" type="checkbox" name="familia.eraCasado" checked={familia.eraCasado} onChange={handleInputChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    </div>

                    {familia.eraCasado && (
                        <div className="p-4 border border-gray-300 rounded-md bg-gray-50 space-y-4 animate-fade-in">
                            <div className="flex items-center gap-3"><input id="familia.eraViuvo" type="checkbox" name="familia.eraViuvo" checked={familia.eraViuvo} onChange={handleInputChange} className="h-4 w-4" /> <label htmlFor="familia.eraViuvo">Era viúvo(a)?</label></div>
                            {familia.eraViuvo ? (<div><label className={commonLabelClass}>Nome do Cônjuge Pré-falecido</label><input type="text" name="familia.conjugePreFalecidoNome" value={familia.conjugePreFalecidoNome || ''} onChange={handleInputChange} className={commonInputClass} /></div>) : (<div><label className={commonLabelClass}>Nome do Cônjuge Sobrevivente</label><input type="text" name="familia.conjugeNome" value={familia.conjugeNome} onChange={handleInputChange} className={commonInputClass} /></div>)}
                            <div><label className={commonLabelClass}>Cartório do Casamento</label><input type="text" name="familia.cartorioCasamento" value={familia.cartorioCasamento || ''} onChange={handleInputChange} className={commonInputClass} placeholder="Ex: Cartório de Registro Civil de Goiânia-GO" /></div>
                        </div>
                    )}

                    <div className="flex items-center gap-3 pt-2">
                        <Baby className="h-5 w-5 text-gray-500" />
                        <label htmlFor="familia.deixouFilhos" className="font-medium text-gray-700">Deixou filhos?</label>
                        <input id="familia.deixouFilhos" type="checkbox" name="familia.deixouFilhos" checked={familia.deixouFilhos} onChange={handleInputChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    </div>

                    {familia.deixouFilhos && (
                        <div className="p-4 border border-gray-300 rounded-md bg-gray-50 space-y-2 animate-fade-in">
                            {familia.filhos.map((filho, index) => (
                                <div key={index} className="flex items-end gap-3 p-2 last:border-b-0">
                                    <div className="flex-grow"><label className={commonLabelClass}>Nome do Filho(a)</label><input type="text" name={`familia.filhos.${index}.nome`} value={filho.nome} onChange={handleInputChange} className={commonInputClass} /></div>
                                    <div className="w-24"><label className={commonLabelClass}>Idade</label><input type="text" name={`familia.filhos.${index}.idade`} value={filho.idade} onChange={handleInputChange} className={commonInputClass} /></div>
                                    {/* ALTERAÇÃO: Chamando o handler específico handleRemoveFilho */}
                                    <button type="button" onClick={() => handleRemoveFilho(index)} className="text-red-500 hover:text-red-700 p-2 mb-1"><Trash2 size={18} /></button>
                                </div>
                            ))}
                            {/* ALTERAÇÃO: Chamando o handler específico handleAddFilho */}
                            <button type="button" onClick={handleAddFilho} className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800"><PlusCircle size={16} /> Adicionar Filho(a)</button>
                        </div>
                    )}
                </div>
            </fieldset>
        </div>
    );
}