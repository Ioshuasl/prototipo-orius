import React from 'react';
import PersonFields from '../../../../Components/PersonFields';
import DadosDocumentoOrigem from './DadosDocumentoOrigem';
import { type IAusencia, type IEndereco, type IPersonData } from '../../../types';
import { infoAusencia } from '../../../lib/contextualInfo';
import SectionHeader from '../../../Components/SectionHeader';

interface FormProps {
    data: IAusencia;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    handleAddressUpdate: (path: (string | number)[], addressData: Partial<IEndereco>) => void;
    handleCpfSearch: (pathPrefix: (string | number)[], cpf: string) => void;
    searchingCpf: string | null;
    onOpenInfoModal: (title: string, content: React.ReactNode) => void;
}

export default function FormAusencia({ data, handleInputChange, handleAddressUpdate, handleCpfSearch, searchingCpf, onOpenInfoModal }: FormProps) {
    const commonInputClass = "mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500";
    const commonLabelClass = "block text-sm font-medium text-gray-700";
    const pathPrefix = ['dadosAto', 'ausencia'];

    return (
        <div className="space-y-8">

            <div>
                {/* ALTERAÇÃO: Usando o novo cabeçalho com botão de info */}
                <SectionHeader
                    title="Dados da Sentença"
                    infoContent={infoAusencia}
                    onOpenInfoModal={onOpenInfoModal}
                />
                <DadosDocumentoOrigem origem="sentenca" dados={data} pathPrefix={pathPrefix.join('.')} handleInputChange={handleInputChange} />
            </div>

            <div>
                <h4 className="font-bold text-gray-600 mb-3">Dados da Sentença</h4>
                <DadosDocumentoOrigem origem="sentenca" dados={data} pathPrefix={pathPrefix.join('.')} handleInputChange={handleInputChange} />
            </div>

            <div>
                <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">Dados do Ausente</h4>
                <PersonFields
                    personData={data.ausente as IPersonData}
                    pathPrefix={[...pathPrefix, 'ausente']}
                    handleInputChange={handleInputChange}
                    handleAddressUpdate={handleAddressUpdate}
                    handleCpfSearch={handleCpfSearch}
                    searchingCpf={searchingCpf}
                />
            </div>

            <div>
                <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">Dados do Curador Nomeado</h4>
                <PersonFields
                    personData={data.curador as IPersonData}
                    pathPrefix={[...pathPrefix, 'curador']}
                    handleInputChange={handleInputChange}
                    handleAddressUpdate={handleAddressUpdate}
                    handleCpfSearch={handleCpfSearch}
                    searchingCpf={searchingCpf}
                />
            </div>

            <div>
                <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">Detalhes da Ausência</h4>
                <div className="grid grid-cols-1 gap-y-5">
                    <div>
                        <label htmlFor={`${pathPrefix}.causaAusencia`} className={commonLabelClass}>Causa da Ausência (declarada na sentença)</label>
                        <textarea name={`${pathPrefix}.causaAusencia`} value={data.causaAusencia || ''} onChange={handleInputChange} rows={3} className={commonInputClass}></textarea>
                    </div>
                    <div>
                        <label htmlFor={`${pathPrefix}.limitesCuratela`} className={commonLabelClass}>Limites da Curatela (poderes e deveres do curador)</label>
                        <textarea name={`${pathPrefix}.limitesCuratela`} value={data.limitesCuratela || ''} onChange={handleInputChange} rows={3} className={commonInputClass}></textarea>
                    </div>
                </div>
            </div>
        </div>
    );
}