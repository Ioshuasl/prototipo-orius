import React from 'react';
import PersonFields from '../../../../Components/PersonFields';
import DadosDocumentoOrigem from './DadosDocumentoOrigem';
import { type IMortePresumida, type IEndereco, type IPersonData } from '../../../types';
import { infoMortePresumida } from '../../../lib/contextualInfo';
import SectionHeader from '../../../Components/SectionHeader';

interface FormProps {
    data: IMortePresumida;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleAddressUpdate: (path: (string | number)[], addressData: Partial<IEndereco>) => void;
    handleCpfSearch: (pathPrefix: (string | number)[], cpf: string) => void;
    searchingCpf: string | null;
    onOpenInfoModal: (title: string, content: React.ReactNode) => void;
}

export default function FormMortePresumida({ data, handleInputChange, handleAddressUpdate, handleCpfSearch, searchingCpf, onOpenInfoModal }: FormProps) {
    const commonInputClass = "mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500";
    const commonLabelClass = "block text-sm font-medium text-gray-700";
    const pathPrefix = ['dadosAto', 'mortePresumida'];

    return (
        <div className="space-y-8">

            <div>
                {/* ALTERAÇÃO: Usando o novo cabeçalho com botão de info */}
                <SectionHeader
                    title="Dados da Sentença"
                    infoContent={infoMortePresumida}
                    onOpenInfoModal={onOpenInfoModal}
                />
                <DadosDocumentoOrigem origem="sentenca" dados={data} pathPrefix={pathPrefix.join('.')} handleInputChange={handleInputChange} />
            </div>

            <div>
                <h4 className="font-bold text-gray-600 mb-3">Dados da Sentença</h4>
                <DadosDocumentoOrigem origem="sentenca" dados={data} pathPrefix={pathPrefix.join('.')} handleInputChange={handleInputChange} />
            </div>

            <div>
                <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">Dados do Ausente (cuja morte foi presumida)</h4>
                <PersonFields
                    personData={data.ausente as IPersonData}
                    pathPrefix={[...pathPrefix, 'ausente']}
                    handleInputChange={handleInputChange}
                    handleAddressUpdate={handleAddressUpdate}
                    handleCpfSearch={handleCpfSearch}
                    searchingCpf={searchingCpf}
                />
            </div>

            <div className="pt-4 border-t">
                <label htmlFor={`${pathPrefix}.dataProvavelFalecimento`} className={`${commonLabelClass} text-base font-semibold`}>
                    Data Provável do Falecimento (fixada na sentença)
                </label>
                <input
                    type="date"
                    id={`${pathPrefix}.dataProvavelFalecimento`}
                    name={`${pathPrefix}.dataProvavelFalecimento`}
                    value={data.dataProvavelFalecimento || ''}
                    onChange={handleInputChange}
                    className={commonInputClass}
                />
            </div>
        </div>
    );
}