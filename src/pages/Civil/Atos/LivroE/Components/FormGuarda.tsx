import React from 'react';
import PersonFields from '../../../../Components/PersonFields';
import DadosDocumentoOrigem from './DadosDocumentoOrigem';
import { type IGuarda, type IEndereco, type IPersonData } from '../../../types';
import { infoGuarda } from '../../../lib/contextualInfo';
import SectionHeader from '../../../Components/SectionHeader';

interface FormProps {
    data: IGuarda;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    handleAddressUpdate: (path: (string | number)[], addressData: Partial<IEndereco>) => void;
    handleCpfSearch: (pathPrefix: (string | number)[], cpf: string) => void;
    searchingCpf: string | null;
    onOpenInfoModal: (title: string, content: React.ReactNode) => void;
}

export default function FormGuarda({ data, handleInputChange, handleAddressUpdate, handleCpfSearch, searchingCpf, onOpenInfoModal }: FormProps) {
    const pathPrefix = ['dadosAto', 'guarda'];

    return (
        <div className="space-y-8">

            <div>
                {/* ALTERAÇÃO: Usando o novo cabeçalho com botão de info */}
                <SectionHeader
                    title="Dados do Mandado Judicial"
                    infoContent={infoGuarda}
                    onOpenInfoModal={onOpenInfoModal}
                />
                <DadosDocumentoOrigem origem="sentenca" dados={data} pathPrefix={pathPrefix.join('.')} handleInputChange={handleInputChange} />
            </div>

            <div>
                <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">Dados do Menor</h4>
                <PersonFields
                    personData={data.menor as IPersonData}
                    pathPrefix={[...pathPrefix, 'menor']}
                    handleInputChange={handleInputChange}
                    handleAddressUpdate={handleAddressUpdate}
                    handleCpfSearch={handleCpfSearch}
                    searchingCpf={searchingCpf}
                />
            </div>

            <div>
                <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">Dados do Guardião Nomeado</h4>
                <PersonFields
                    personData={data.guardiao as IPersonData}
                    pathPrefix={[...pathPrefix, 'guardiao']}
                    handleInputChange={handleInputChange}
                    handleAddressUpdate={handleAddressUpdate}
                    handleCpfSearch={handleCpfSearch}
                    searchingCpf={searchingCpf}
                />
            </div>
        </div>
    );
}