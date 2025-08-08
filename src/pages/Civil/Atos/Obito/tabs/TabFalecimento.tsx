import React from 'react';
import { type IObitoFormData, type IEndereco, type RuleKey, type TPessoaTipo, type IPessoaFisica } from '../../../types';
import AddressFields from '../../../Components/AddressFields';
import SeletorDePessoa from '../../../Components/SeletorDePessoa';

// A interface de Props agora inclui os componentes e estilos que serão recebidos
interface TabFalecimentoProps {
    formData: IObitoFormData;
    searchingCpf: string | null;
    searchingCnpj: string | null; // <-- Prop para o loading do CNPJ
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    handleCpfSearch: (pathPrefix: (string | number)[], cpf: string) => void;
    handleCnpjSearch: (pathPrefix: (string | number)[], cnpj: string) => void; // <-- Prop para a busca de CNPJ
    handleAddressUpdate: (path: (string | number)[], addressData: Partial<IEndereco>) => void;
    onDadosChange: (path: (string | number)[], novosDados: Partial<TPessoaTipo>) => void; // <-- Prop para a troca de tipo
    onAddSocio: () => void; // <-- Prop para adicionar sócio
    onRemoveSocio: (index: number) => void; // <-- Prop para remover sócio
    openInfoModal: (ruleKey: RuleKey) => void;
    SectionTitle: React.FC<{ children: React.ReactNode }>;
    SubSectionTitle: React.FC<{ children: React.ReactNode }>;
    InfoBox: React.FC<{ type?: 'info' | 'warning', children: React.ReactNode }>;
    HelpButton: React.FC<{ onClick: () => void }>;
    commonInputClass: string;
    commonLabelClass: string;
    requiredSpan: React.ReactNode;
}

export default function TabFalecimento({
    formData,
    searchingCpf,
    searchingCnpj,
    handleInputChange,
    handleCpfSearch,
    handleCnpjSearch,
    handleAddressUpdate,
    onDadosChange,
    onAddSocio,
    onRemoveSocio,
    openInfoModal,
    SectionTitle,
    SubSectionTitle,
    InfoBox,
    HelpButton,
    commonInputClass,
    commonLabelClass,
    requiredSpan
}: TabFalecimentoProps) {
    // Desestruturando o formData para facilitar o acesso no JSX
    const { naturezaRegistro, falecimento, declarante, falecido } = formData;

    return (
        <fieldset className="space-y-12" disabled={naturezaRegistro !== 'Comum'}>
            <div>
                <SectionTitle>Dados do Falecimento</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div><label className={commonLabelClass}>Data do Falecimento{requiredSpan}</label><input type="date" name="falecimento.dataFalecimento" value={falecimento.dataFalecimento} onChange={handleInputChange} className={commonInputClass} /></div>
                    <div><label className={commonLabelClass}>Horário do Falecimento</label><input type="time" name="falecimento.horaFalecimento" value={falecimento.horaFalecimento} onChange={handleInputChange} className={commonInputClass} /></div>

                    <div className="lg:col-span-3">
                        <label className={`${commonLabelClass} flex items-center`}>Destinação do Corpo{requiredSpan} <HelpButton onClick={() => openInfoModal('cremacao')} /></label>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2">
                            <label className="flex items-center gap-2"><input type="radio" name="falecimento.destinacaoCorpo" value="Sepultamento" checked={falecimento.destinacaoCorpo === 'Sepultamento'} onChange={handleInputChange} /> Sepultamento</label>
                            <label className="flex items-center gap-2"><input type="radio" name="falecimento.destinacaoCorpo" value="Cremacao" checked={falecimento.destinacaoCorpo === 'Cremacao'} onChange={handleInputChange} /> Cremação</label>
                            <label className="flex items-center gap-2"><input type="radio" name="falecimento.destinacaoCorpo" value="EstudoCientifico" checked={falecimento.destinacaoCorpo === 'EstudoCientifico'} onChange={handleInputChange} /> Doação p/ Estudo Científico</label>
                        </div>
                    </div>

                    {falecimento.destinacaoCorpo !== 'EstudoCientifico' && (
                        <div className="lg:col-span-3"><label className={commonLabelClass}>Local do {falecimento.destinacaoCorpo === 'Cremacao' ? 'Crematório' : 'Sepultamento'}{requiredSpan}</label><input type="text" name="falecimento.localDestinacao" value={falecimento.localDestinacao} onChange={handleInputChange} className={commonInputClass} placeholder={falecimento.destinacaoCorpo === 'Cremacao' ? 'Nome do Crematório e Cidade' : 'Nome do Cemitério e Cidade'} /></div>
                    )}

                    {falecimento.destinacaoCorpo === 'Cremacao' && (
                        <div className="lg:col-span-3 p-4 border border-gray-300 rounded-md bg-gray-50/50 animate-fade-in">
                            <SubSectionTitle>Autorização para Cremação</SubSectionTitle>
                            {falecimento.tipoMorte === 'Violenta' && (
                                <InfoBox type="warning">Por se tratar de morte violenta, a cremação depende de <b>autorização judicial prévia</b>.</InfoBox>
                            )}
                            <div>
                                <label htmlFor="falecimento.autorizacaoCremacao.tipo" className={commonLabelClass}>Tipo de Autorização{requiredSpan}</label>
                                <select id="falecimento.autorizacaoCremacao.tipo" name="falecimento.autorizacaoCremacao.tipo" value={falecimento.autorizacaoCremacao.tipo} onChange={handleInputChange} className={commonInputClass}>
                                    <option value="NaoAplicavel">Selecione...</option>
                                    <option value="VontadePropria">Declaração de Vontade do Falecido (em vida)</option>
                                    <option value="Familia">Autorização da Família</option>
                                </select>
                            </div>
                            {falecimento.tipoMorte === 'Violenta' && (
                                <div className="mt-4"><label htmlFor="falecimento.autorizacaoCremacao.autorizacaoJudicial" className={commonLabelClass}>Nº da Autorização Judicial{requiredSpan}</label><input type="text" name="falecimento.autorizacaoCremacao.autorizacaoJudicial" value={falecimento.autorizacaoCremacao.autorizacaoJudicial} onChange={handleInputChange} className={commonInputClass} /></div>
                            )}
                        </div>
                    )}

                    <div className="lg:col-span-3"><label className={commonLabelClass}>Local da Ocorrência{requiredSpan}</label><select name="falecimento.localOcorrencia" value={falecimento.localOcorrencia} onChange={handleInputChange} className={commonInputClass}><option value="Hospital">Hospital</option><option value="Residência">Residência</option><option value="Via Pública">Via Pública</option><option value="Outro">Outro</option></select></div>
                    {falecimento.localOcorrencia === 'Residência' && <AddressFields namePrefix="falecimento.enderecoOcorrencia" addressData={falecimento.enderecoOcorrencia} handleInputChange={handleInputChange} handleAddressUpdate={(addressData) => handleAddressUpdate(['falecimento', 'enderecoOcorrencia'], addressData)} />}
                    {falecimento.localOcorrencia === 'Outro' && <div className="lg:col-span-3"><label className={commonLabelClass}>Descrição do Local</label><input type="text" name="falecimento.descricaoOutroLocal" value={falecimento.descricaoOutroLocal} onChange={handleInputChange} className={commonInputClass} /></div>}

                    <div className="lg:col-span-3"><label className={commonLabelClass}>Tipo de Morte{requiredSpan}</label><div className="flex gap-6 mt-2"><label className="flex items-center gap-2"><input type="radio" name="falecimento.tipoMorte" value="Natural" checked={falecimento.tipoMorte === 'Natural'} onChange={handleInputChange} /> Natural</label><label className="flex items-center gap-2"><input type="radio" name="falecimento.tipoMorte" value="Violenta" checked={falecimento.tipoMorte === 'Violenta'} onChange={handleInputChange} /> Violenta</label></div></div>
                    <div className="lg:col-span-3"><label className={commonLabelClass}>Causa da Morte Conhecida{requiredSpan}</label><input type="text" name="falecimento.causaMorte" value={falecimento.causaMorte} onChange={handleInputChange} className={commonInputClass} placeholder="Conforme atestado médico" /></div>

                    <div className="lg:col-span-3 space-y-4">
                        <div className="flex items-center gap-3"><input id="isAposSepultamento" type="checkbox" name="falecimento.isAposSepultamento" checked={falecimento.isAposSepultamento} onChange={handleInputChange} className="h-4 w-4" /><label htmlFor="isAposSepultamento" className="font-medium">Registro realizado após o sepultamento?</label></div>

                        <div>
                            <label className={`${commonLabelClass} flex items-center`}>Fonte da Declaração{requiredSpan} <HelpButton onClick={() => openInfoModal('fonteDeclaracao')} /></label>
                            <select name="falecimento.fonteDeclaracao" value={falecimento.fonteDeclaracao} onChange={handleInputChange} className={commonInputClass}>
                                <option value="Atestado Médico">Atestado Médico (DO)</option>
                                <option value="DeclaracaoTestemunhas">Declaração de Testemunhas (Morte sem Assistência)</option>
                            </select>
                        </div>

                        {falecimento.fonteDeclaracao === 'Atestado Médico' && (
                            <div className="animate-fade-in">
                                <label htmlFor="falecido.documentos.numeroDO" className={commonLabelClass}>Nº da Declaração de Óbito (DO){requiredSpan}</label>
                                <input type="text" id="falecido.documentos.numeroDO" name="falecido.documentos.numeroDO" value={falecido.documentos.numeroDO} onChange={handleInputChange} className={commonInputClass} />
                            </div>
                        )}

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <div><label className={commonLabelClass}>{falecimento.fonteDeclaracao === 'Atestado Médico' ? 'Atestante 1 (Médico)' : 'Testemunha 1'}{requiredSpan}</label><input type="text" name="falecimento.atestante1" value={falecimento.atestante1} onChange={handleInputChange} className={commonInputClass} /></div>
                            <div><label className={commonLabelClass}>{falecimento.fonteDeclaracao === 'Atestado Médico' ? 'Atestante 2 (Opcional)' : 'Testemunha 2'}{falecimento.fonteDeclaracao !== 'Atestado Médico' && requiredSpan}</label><input type="text" name="falecimento.atestante2" value={falecimento.atestante2 || ''} onChange={handleInputChange} className={commonInputClass} /></div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <SectionTitle>Dados do Declarante do Óbito</SectionTitle>
                <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-md">
                    <input
                        id="isAutoridade"
                        type="checkbox"
                        name="declarante.isAutoridade"
                        checked={declarante.isAutoridade}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="isAutoridade" className="font-medium text-gray-800">
                        A declaração está sendo feita por uma autoridade?
                    </label>
                </div>

                {declarante.isAutoridade ? (
                    // Se for autoridade, mostra os campos específicos
                    <div className="p-4 border border-gray-300 rounded-lg bg-gray-50/50 animate-fade-in">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                            <div>
                                <label className={commonLabelClass}>Tipo de Autoridade{requiredSpan}</label>
                                <select name="declarante.tipoAutoridade" value={declarante.tipoAutoridade} onChange={handleInputChange} className={commonInputClass}>
                                    <option value="">Selecione...</option>
                                    <option value="Policial">Autoridade Policial</option>
                                    <option value="InstituicaoDeEnsino">Instituição de Ensino/Saúde</option>
                                </select>
                            </div>
                            <div>
                                <label className={commonLabelClass}>Nome do Responsável/Autoridade{requiredSpan}</label>
                                <input type="text" name="declarante.dadosAutoridade.nome" value={declarante.dadosAutoridade.nome} onChange={handleInputChange} className={commonInputClass} />
                            </div>
                            {declarante.tipoAutoridade === 'Policial' && (
                                <>
                                    <div>
                                        <label className={commonLabelClass}>Cargo{requiredSpan}</label>
                                        <input type="text" name="declarante.dadosAutoridade.cargo" value={declarante.dadosAutoridade.cargo} onChange={handleInputChange} className={commonInputClass} />
                                    </div>
                                    <div>
                                        <label className={commonLabelClass}>Lotação/Delegacia{requiredSpan}</label>
                                        <input type="text" name="declarante.dadosAutoridade.lotacao" value={declarante.dadosAutoridade.lotacao} onChange={handleInputChange} className={commonInputClass} />
                                    </div>
                                </>
                            )}
                            {declarante.tipoAutoridade === 'InstituicaoDeEnsino' && (
                                <>
                                    <div>
                                        <label className={commonLabelClass}>Nome da Instituição{requiredSpan}</label>
                                        {/* Este campo usa a 'razaoSocial' do SeletorDePessoa, então vamos usar 'nome' de IPessoaFisica para consistência aqui */}
                                        <input type="text" name="declarante.nome" value={(declarante as IPessoaFisica).nome} onChange={handleInputChange} className={commonInputClass} />
                                    </div>
                                    <div>
                                        <label className={commonLabelClass}>CNPJ da Instituição{requiredSpan}</label>
                                        <input type="text" name="declarante.dadosAutoridade.cnpj" value={declarante.dadosAutoridade.cnpj} onChange={handleInputChange} className={commonInputClass} />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ) : (
                    // Se NÃO for autoridade, mostra o Seletor PF/PJ
                    <>
                        <SeletorDePessoa
                            dados={declarante}
                            pathPrefix={['declarante']}
                            handleInputChange={handleInputChange}
                            handleAddressUpdate={handleAddressUpdate}
                            handleCpfSearch={handleCpfSearch}
                            handleCnpjSearch={handleCnpjSearch}
                            searchingCpf={searchingCpf}
                            searchingCnpj={searchingCnpj}
                            onDadosChange={(novosDados) => onDadosChange(['declarante'], novosDados)}
                            onAddSocio={onAddSocio}
                            onRemoveSocio={onRemoveSocio}
                        />
                        {/* A relação com o falecido só faz sentido se o declarante for uma pessoa física comum */}
                        {declarante.tipo === 'fisica' && (
                            <div className="mt-4">
                                <label className={commonLabelClass}>Relação com o Falecido{requiredSpan}</label>
                                <input type="text" name="declarante.relacaoComFalecido" value={declarante.relacaoComFalecido} onChange={handleInputChange} className={commonInputClass} placeholder="Ex: Filho(a), Cônjuge, Médico..." />
                            </div>
                        )}
                    </>
                )}
            </div>
        </fieldset>
    );
}