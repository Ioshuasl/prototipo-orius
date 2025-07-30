import React from 'react';
import PersonFields from '../../../Components/PersonFields';
import { regimesDeBens } from '../../../lib/Constants';
import { type ITrasladoCasamentoData, type IEndereco, type IPersonData } from '../../../types';

interface SubFormProps {
    data: ITrasladoCasamentoData;
    pathPrefix: string;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    handleAddressUpdate: (path: (string | number)[], addressData: Partial<IEndereco>) => void;
    handleCpfSearch: (pathPrefix: (string | number)[], cpf: string) => void;
    searchingCpf: string | null;
}

export default function SubFormTrasladoCasamento({ data, pathPrefix, handleInputChange, handleAddressUpdate, handleCpfSearch, searchingCpf }: SubFormProps) {
    const commonInputClass = "mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500";
    const commonLabelClass = "block text-sm font-medium text-gray-700";

    return (
        <div className="space-y-8 pt-4 border-t mt-4">
            {/* Cônjuge 1 */}
            <div>
                <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">Dados do(a) Cônjuge 1</h4>
                <PersonFields
                    personData={data?.nubente1 as IPersonData}
                    pathPrefix={[pathPrefix, 'nubente1']}
                    handleInputChange={handleInputChange}
                    handleAddressUpdate={handleAddressUpdate}
                    handleCpfSearch={handleCpfSearch}
                    searchingCpf={searchingCpf}
                />
                <div className="mt-4">
                    <label className={commonLabelClass}>Nome adotado após o casamento (se houver)</label>
                    <input type="text" name={`${pathPrefix}.nomeAdotadoNubente1`} value={data.nomeAdotadoNubente1 || ''} onChange={handleInputChange} className={commonInputClass} />
                </div>
            </div>

            {/* Cônjuge 2 */}
            <div>
                <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">Dados do(a) Cônjuge 2</h4>
                <PersonFields
                    personData={data?.nubente2 as IPersonData}
                    pathPrefix={[pathPrefix, 'nubente2']}
                    handleInputChange={handleInputChange}
                    handleAddressUpdate={handleAddressUpdate}
                    handleCpfSearch={handleCpfSearch}
                    searchingCpf={searchingCpf}
                />
                 <div className="mt-4">
                    <label className={commonLabelClass}>Nome adotado após o casamento (se houver)</label>
                    <input type="text" name={`${pathPrefix}.nomeAdotadoNubente2`} value={data.nomeAdotadoNubente2 || ''} onChange={handleInputChange} className={commonInputClass} />
                </div>
            </div>

            {/* Detalhes do Casamento */}
            <div>
                <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">Detalhes do Casamento</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    <div>
                        <label className={commonLabelClass}>Data do Casamento</label>
                        <input type="date" name={`${pathPrefix}.dataCasamento`} value={data.dataCasamento || ''} onChange={handleInputChange} className={commonInputClass} />
                    </div>
                     <div >
                        <label className={commonLabelClass}>Local do Casamento (Cidade e País)</label>
                        <input type="text" name={`${pathPrefix}.localCasamento`} value={data.localCasamento || ''} onChange={handleInputChange} className={commonInputClass} />
                    </div>
                     <div>
                        <label className={commonLabelClass}>Regime de Bens</label>
                        <select name={`${pathPrefix}.regimeBens`} value={data.regimeBens || ''} onChange={handleInputChange} className={commonInputClass}>
                            <option value="">Selecione...</option>
                            {regimesDeBens.map(regime => (<option key={regime} value={regime}>{regime}</option>))}
                        </select>
                    </div>
                </div>
                 <div className="mt-4">
                     <label className="flex items-center gap-2">
                        <input type="checkbox" name={`${pathPrefix}.pactoAntenupcial.apresentado`} checked={data.pactoAntenupcial?.apresentado || false} onChange={handleInputChange} className="form-checkbox h-4 w-4 text-blue-600" />
                        Apresentou Pacto Antenupcial?
                     </label>
                     {data.pactoAntenupcial?.apresentado && (
                         <div className="mt-2">
                            <label className={commonLabelClass}>Detalhes do Registro do Pacto em Títulos e Documentos</label>
                            <input type="text" name={`${pathPrefix}.pactoAntenupcial.detalhes`} value={data.pactoAntenupcial.detalhes || ''} onChange={handleInputChange} className={commonInputClass} />
                         </div>
                     )}
                </div>
            </div>
             <div>
                 <h4 className="font-semibold text-red-800">Anotação Obrigatória</h4>
                 <textarea value={data.observacaoObrigatoria || ''} readOnly className="mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm bg-red-50 text-red-900 font-mono text-sm" rows={2}></textarea>
            </div>
        </div>
    )
}