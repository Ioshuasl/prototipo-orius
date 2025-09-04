import React from 'react';
import PersonFields from '../../../../Components/PersonFields';
import { type ITrasladoObitoData, type IEndereco, type IPersonData } from '../../../types';
import { Trash2, PlusCircle } from 'lucide-react';

interface SubFormProps {
    data: ITrasladoObitoData;
    pathPrefix: string;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    handleAddressUpdate: (path: (string | number)[], addressData: Partial<IEndereco>) => void;
    handleCpfSearch: (pathPrefix: (string | number)[], cpf: string) => void;
    searchingCpf: string | null;
    addDynamicItem: (path: string) => void;
    removeDynamicItem: (path: string, index: number) => void;
}

export default function SubFormTrasladoObito({ data, pathPrefix, handleInputChange, handleAddressUpdate, handleCpfSearch, searchingCpf, addDynamicItem, removeDynamicItem }: SubFormProps) {
    const commonInputClass = "mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500";
    const commonLabelClass = "block text-sm font-medium text-gray-700";

    return (
        <div className="space-y-8 pt-4 border-t mt-4">
            {/* Dados do Falecido */}
            <div>
                <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">Dados do(a) Falecido(a)</h4>
                <PersonFields
                    personData={data?.falecido as IPersonData}
                    pathPrefix={[pathPrefix, 'falecido']}
                    handleInputChange={handleInputChange}
                    handleAddressUpdate={handleAddressUpdate}
                    handleCpfSearch={handleCpfSearch}
                    searchingCpf={searchingCpf}
                />
            </div>

            {/* Detalhes do Óbito */}
            <div>
                <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">Detalhes do Óbito</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    <div>
                        <label className={commonLabelClass}>Data do Óbito</label>
                        <input type="date" name={`${pathPrefix}.dataObito`} value={data?.dataObito || ''} onChange={handleInputChange} className={commonInputClass} />
                    </div>
                    <div>
                        <label className={commonLabelClass}>Local do Óbito (Cidade e País)</label>
                        <input type="text" name={`${pathPrefix}.localObito`} value={data?.localObito || ''} onChange={handleInputChange} className={commonInputClass} />
                    </div>
                    <div className="md:col-span-2">
                        <label className={commonLabelClass}>Causa da Morte</label>
                        <input type="text" name={`${pathPrefix}.causaMorte`} value={data?.causaMorte || ''} onChange={handleInputChange} className={commonInputClass} />
                    </div>
                    <div>
                        <label className={commonLabelClass}>Local de Sepultamento</label>
                        <input type="text" name={`${pathPrefix}.localSepultamento`} value={data?.localSepultamento || ''} onChange={handleInputChange} className={commonInputClass} />
                    </div>
                </div>
            </div>

            {/* Informações Adicionais */}
            <div>
                <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">Informações Adicionais</h4>
                 <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                        <label className="flex items-center gap-2"><input type="checkbox" name={`${pathPrefix}.eraCasado`} checked={data?.eraCasado || false} onChange={handleInputChange} className="form-checkbox h-4 w-4 text-blue-600" />Era casado(a)?</label>
                        <label className="flex items-center gap-2"><input type="checkbox" name={`${pathPrefix}.deixouBens`} checked={data?.deixouBens || false} onChange={handleInputChange} className="form-checkbox h-4 w-4 text-blue-600" />Deixou bens?</label>
                    </div>
                    {data?.eraCasado && (
                        <div className="pt-2"><label className={commonLabelClass}>Nome do Cônjuge</label><input type="text" name={`${pathPrefix}.nomeConjuge`} value={data.nomeConjuge || ''} onChange={handleInputChange} className={commonInputClass} /></div>
                    )}
                    <div className="pt-4">
                        <label className="flex items-center gap-2 mb-3"><input type="checkbox" name={`${pathPrefix}.deixouFilhos`} checked={data?.deixouFilhos || false} onChange={handleInputChange} className="form-checkbox h-4 w-4 text-blue-600" />Deixou filhos?</label>
                        
                        {data?.deixouFilhos && (
                            <div className="p-4 mt-2 border rounded-md bg-gray-50 space-y-4">
                                {data.filhos?.map((filho, index) => (
                                    <div key={index} className="flex items-end gap-4">
                                        <div className="flex-grow"><label className={commonLabelClass}>Nome do Filho(a)</label><input type="text" name={`${pathPrefix}.filhos.${index}.nome`} value={filho.nome} onChange={handleInputChange} className={commonInputClass} /></div>
                                        <div className="w-24"><label className={commonLabelClass}>Idade</label><input type="text" name={`${pathPrefix}.filhos.${index}.idade`} value={filho.idade} onChange={handleInputChange} className={commonInputClass} /></div>
                                        <button type="button" onClick={() => removeDynamicItem(`${pathPrefix}.filhos`, index)} className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"><Trash2 size={20} /></button>
                                    </div>
                                ))}
                                <button type="button" onClick={() => addDynamicItem(`${pathPrefix}.filhos`)} className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800"><PlusCircle size={16} />Adicionar Filho</button>
                            </div>
                        )}
                    </div>
                 </div>
            </div>
        </div>
    )
}