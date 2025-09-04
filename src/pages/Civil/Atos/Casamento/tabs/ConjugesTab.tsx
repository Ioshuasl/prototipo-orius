import React from 'react';
import PersonFields from '../../../../Components/PersonFields';
import { type ICasamentoFormData, type IEndereco } from '../../../types';

// Tipos das props que o componente recebe
interface ConjugesTabProps {
    formData: ICasamentoFormData;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleAddressUpdate: (path: (string | number)[], addressData: Partial<IEndereco>) => void;
    handleCpfSearch: (pathPrefix: (string | number)[], cpf: string) => void;
    searchingCpf: string | null;
    SectionTitle: React.FC<{ children: React.ReactNode }>;
    SubSectionTitle: React.FC<{ children: React.ReactNode }>;
}

export default function ConjugesTab({
    formData,
    handleInputChange,
    handleAddressUpdate,
    handleCpfSearch,
    searchingCpf,
    SectionTitle,
    SubSectionTitle
}: ConjugesTabProps) {

    const commonInputClass = "mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500";
    const commonLabelClass = "block text-sm font-medium text-gray-700";

    return (
        <fieldset className="space-y-10">
            <SectionTitle>Dados dos Cônjuges</SectionTitle>
            <div>
                <SubSectionTitle>1º Cônjuge</SubSectionTitle>
                <PersonFields
                    personData={formData.conjuge1}
                    pathPrefix={['conjuge1']}
                    handleInputChange={handleInputChange}
                    handleAddressUpdate={handleAddressUpdate}
                    handleCpfSearch={handleCpfSearch}
                    searchingCpf={searchingCpf}
                />
                <div className="mt-4">
                    <label htmlFor="conjuge1.nomeAposCasamento" className={commonLabelClass}>Nome a adotar após o casamento</label>
                    <input
                        type="text"
                        name="conjuge1.nomeAposCasamento"
                        id="conjuge1.nomeAposCasamento"
                        className={commonInputClass}
                        value={formData.conjuge1.nomeAposCasamento}
                        onChange={handleInputChange}
                    />
                </div>
            </div>
            <div>
                <SubSectionTitle>2º Cônjuge</SubSectionTitle>
                <PersonFields
                    personData={formData.conjuge2}
                    pathPrefix={['conjuge2']}
                    handleInputChange={handleInputChange}
                    handleAddressUpdate={handleAddressUpdate}
                    handleCpfSearch={handleCpfSearch}
                    searchingCpf={searchingCpf}
                />
                <div className="mt-4">
                    <label htmlFor="conjuge2.nomeAposCasamento" className={commonLabelClass}>Nome a adotar após o casamento</label>
                    <input
                        type="text"
                        name="conjuge2.nomeAposCasamento"
                        id="conjuge2.nomeAposCasamento"
                        className={commonInputClass}
                        value={formData.conjuge2.nomeAposCasamento}
                        onChange={handleInputChange}
                    />
                </div>
            </div>
        </fieldset>
    );
}