import React from 'react';
import PersonFields from '../../../../Components/PersonFields';
import DadosDocumentoOrigem from './DadosDocumentoOrigem';
import { type ITutela, type IEndereco, type IPersonData } from '../../../types';
import { infoTutela } from '../../../lib/contextualInfo';
import SectionHeader from '../../../Components/SectionHeader';

interface FormProps {
    data: ITutela;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    handleAddressUpdate: (path: (string | number)[], addressData: Partial<IEndereco>) => void;
    handleCpfSearch: (pathPrefix: (string | number)[], cpf: string) => void;
    searchingCpf: string | null;
    onOpenInfoModal: (title: string, content: React.ReactNode) => void;
}

export default function FormTutela({ data, handleInputChange, handleAddressUpdate, handleCpfSearch, searchingCpf, onOpenInfoModal }: FormProps) {
    const commonInputClass = "mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500";
    const commonLabelClass = "block text-sm font-medium text-gray-700";
    const pathPrefix = ['dadosAto', 'tutela'];

    return (
        <div className="space-y-8">

            <div>
                {/* ALTERAÇÃO: Usando o novo cabeçalho com botão de info */}
                <SectionHeader
                    title="Dados da Sentença"
                    infoContent={infoTutela}
                    onOpenInfoModal={onOpenInfoModal}
                />
                <DadosDocumentoOrigem origem="sentenca" dados={data} pathPrefix={pathPrefix.join('.')} handleInputChange={handleInputChange} />
            </div>

            <div>
                <h4 className="font-bold text-gray-600 mb-3">Dados do Mandado Judicial</h4>
                <DadosDocumentoOrigem origem="sentenca" dados={data} pathPrefix={pathPrefix.join('.')} handleInputChange={handleInputChange} />
            </div>

            <div>
                <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">Dados do Tutelado</h4>
                <PersonFields
                    personData={data.tutelado as IPersonData}
                    pathPrefix={[...pathPrefix, 'tutelado']}
                    handleInputChange={handleInputChange}
                    handleAddressUpdate={handleAddressUpdate}
                    handleCpfSearch={handleCpfSearch}
                    searchingCpf={searchingCpf}
                />
            </div>

            <div>
                <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">Dados do Tutor Nomeado</h4>
                <PersonFields
                    personData={data.tutor as IPersonData}
                    pathPrefix={[...pathPrefix, 'tutor']}
                    handleInputChange={handleInputChange}
                    handleAddressUpdate={handleAddressUpdate}
                    handleCpfSearch={handleCpfSearch}
                    searchingCpf={searchingCpf}
                />
            </div>

            <div>
                <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">Limitações da Tutela</h4>
                <div className="grid grid-cols-1 gap-y-5">
                    <div>
                        <label htmlFor={`${pathPrefix}.limitacoesTutela`} className={commonLabelClass}>
                            Existem limitações aos poderes do tutor? (se sim, especifique)
                        </label>
                        <textarea
                            id={`${pathPrefix}.limitacoesTutela`}
                            name={`${pathPrefix}.limitacoesTutela`}
                            value={data.limitacoesTutela || ''}
                            onChange={handleInputChange}
                            rows={3}
                            className={commonInputClass}
                            placeholder="Caso a sentença não estabeleça limitações, deixe este campo em branco."
                        ></textarea>
                    </div>
                </div>
            </div>
        </div>
    );
}