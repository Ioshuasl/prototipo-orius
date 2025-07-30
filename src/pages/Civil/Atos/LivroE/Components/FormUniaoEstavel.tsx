import React from 'react';
import PersonFields from '../../../Components/PersonFields';
import DadosDocumentoOrigem from './DadosDocumentoOrigem';
import { type IUniaoEstavel, type IEndereco, type IPersonData } from '../../../types';
import { regimesDeBens } from '../../../lib/Constants'
import { infoUniaoEstavel } from '../../../lib/contextualInfo';
import SectionHeader from '../../../Components/SectionHeader';

interface FormProps {
    data: IUniaoEstavel;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleAddressUpdate: (path: (string | number)[], addressData: Partial<IEndereco>) => void;
    handleCpfSearch: (pathPrefix: (string | number)[], cpf: string) => void;
    searchingCpf: string | null;
    onOpenInfoModal: (title: string, content: React.ReactNode) => void;
}

export default function FormUniaoEstavel({ data, handleInputChange, handleAddressUpdate, handleCpfSearch, searchingCpf, onOpenInfoModal }: FormProps) {
    const commonInputClass = "mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500";
    const commonLabelClass = "block text-sm font-medium text-gray-700";
    const pathPrefix = ['dadosAto', 'uniaoEstavel'];

    return (

        <div className="space-y-8">

            <div>
                {/* ALTERAÇÃO: Usando o novo cabeçalho com botão de info */}
                <SectionHeader
                    title="Dados da Sentença"
                    infoContent={infoUniaoEstavel}
                    onOpenInfoModal={onOpenInfoModal}
                />
                <DadosDocumentoOrigem origem="sentenca" dados={data} pathPrefix={pathPrefix.join('.')} handleInputChange={handleInputChange} />
            </div>

            {/* Seção de Tipo e Origem */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <div>
                    <label className={commonLabelClass}>Tipo do Ato</label>
                    <select name={`${pathPrefix}.tipo`} value={data.tipo} onChange={handleInputChange} className={commonInputClass}>
                        <option value="reconhecimento">Reconhecimento</option>
                        <option value="dissolucao">Dissolução</option>
                    </select>
                </div>
                <div>
                    <label className={commonLabelClass}>Origem do Ato</label>
                    <select name={`${pathPrefix}.origem`} value={data.origem} onChange={handleInputChange} className={commonInputClass}>
                        <option value="sentenca">Sentença Judicial</option>
                        <option value="escritura">Escritura Pública</option>
                        <option value="instrumentoParticular">Instrumento Particular</option>
                    </select>
                </div>
            </div>
            <DadosDocumentoOrigem origem={data.origem} dados={data} pathPrefix={pathPrefix.join('.')} handleInputChange={handleInputChange} />

            {/* Seção de Companheiros */}
            <div>
                <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">Dados do(a) Companheiro(a) 1</h4>
                <PersonFields
                    personData={data.companheiro1 as IPersonData}
                    pathPrefix={[...pathPrefix, 'companheiro1']}
                    handleInputChange={handleInputChange}
                    handleAddressUpdate={handleAddressUpdate}
                    handleCpfSearch={handleCpfSearch}
                    searchingCpf={searchingCpf}
                />
            </div>
            <div>
                <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">Dados do(a) Companheiro(a) 2</h4>
                <PersonFields
                    personData={data.companheiro2 as IPersonData}
                    pathPrefix={[...pathPrefix, 'companheiro2']}
                    handleInputChange={handleInputChange}
                    handleAddressUpdate={handleAddressUpdate}
                    handleCpfSearch={handleCpfSearch}
                    searchingCpf={searchingCpf}
                />
            </div>

            {/* Seção de Detalhes da União */}
            <div>
                <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">Detalhes da União</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    <div>
                        <label className={commonLabelClass}>Regime de Bens</label>
                        <select name={`${pathPrefix}.regimeBens`} value={data.regimeBens} onChange={handleInputChange} className={commonInputClass}>
                            <option value="">Selecione...</option>
                            {regimesDeBens.map(regime => <option key={regime} value={regime}>{regime}</option>)}
                        </select>
                    </div>
                    <div className="flex flex-col justify-center pt-5 space-y-3">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" name={`${pathPrefix}.alteracaoNomeCompanheiro1`} checked={data.alteracaoNomeCompanheiro1} onChange={handleInputChange} className="form-checkbox h-4 w-4 text-blue-600" />
                            Houve alteração no nome do(a) Companheiro(a) 1?
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" name={`${pathPrefix}.alteracaoNomeCompanheiro2`} checked={data.alteracaoNomeCompanheiro2} onChange={handleInputChange} className="form-checkbox h-4 w-4 text-blue-600" />
                            Houve alteração no nome do(a) Companheiro(a) 2?
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}