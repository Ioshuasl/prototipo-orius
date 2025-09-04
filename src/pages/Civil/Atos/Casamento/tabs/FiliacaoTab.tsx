import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import PersonFields from '../../../../Components/PersonFields';
import { type ICasamentoFormData, type IEndereco, type IPessoaFisica } from '../../../types';

// Tipos das props
interface FiliacaoTabProps {
    formData: ICasamentoFormData;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleAddressUpdate: (path: (string | number)[], addressData: Partial<IEndereco>) => void;
    handleCpfSearch: (pathPrefix: (string | number)[], cpf: string) => void;
    searchingCpf: string | null;
    SectionTitle: React.FC<{ children: React.ReactNode }>;
}

// O estado de 'collapse' agora vive dentro deste componente
type FiliacaoCollapseKeys = 'paiConjuge1' | 'maeConjuge1' | 'paiConjuge2' | 'maeConjuge2';

export default function FiliacaoTab({
    formData,
    handleInputChange,
    handleAddressUpdate,
    handleCpfSearch,
    searchingCpf,
    SectionTitle
}: FiliacaoTabProps) {
    const [filiacaoCollapseState, setFiliacaoCollapseState] = useState({
        paiConjuge1: true,
        maeConjuge1: true,
        paiConjuge2: true,
        maeConjuge2: true
    });

    const handleFiliacaoCollapseToggle = (filiacaoKey: FiliacaoCollapseKeys) => {
        setFiliacaoCollapseState(prev => ({
            ...prev,
            [filiacaoKey]: !prev[filiacaoKey]
        }));
    };

    // Helper para criar os cards, evitando repetição de código
    const renderParentCard = (key: FiliacaoCollapseKeys, title: string, personData: IPessoaFisica, pathPrefix: (string | number)[]) => (
        <div className="bg-white rounded-lg border border-gray-200 transition-all duration-300">
            <button
                type="button"
                className="w-full flex justify-between items-center p-5 cursor-pointer"
                onClick={() => handleFiliacaoCollapseToggle(key)}
            >
                <h4 className="font-bold text-gray-600">{title}</h4>
                {filiacaoCollapseState[key] ? <ChevronUp className="h-6 w-6 text-gray-600" /> : <ChevronDown className="h-6 w-6 text-gray-600" />}
            </button>
            {filiacaoCollapseState[key] && (
                <div className="px-5 pb-5 animate-fade-in">
                    <PersonFields
                        personData={personData}
                        pathPrefix={pathPrefix}
                        handleInputChange={handleInputChange}
                        handleAddressUpdate={handleAddressUpdate}
                        handleCpfSearch={handleCpfSearch}
                        searchingCpf={searchingCpf}
                    />
                </div>
            )}
        </div>
    );

    return (
        <fieldset>
            <SectionTitle>Dados da Filiação (Pais dos Cônjuges)</SectionTitle>
            <div className="grid grid-cols-1 gap-6">
                {renderParentCard(
                    'paiConjuge1',
                    `Pai de: ${formData.conjuge1.nome || "1º Cônjuge"}`,
                    formData.filiacao.paiConjuge1,
                    ['filiacao', 'paiConjuge1']
                )}
                {renderParentCard(
                    'maeConjuge1',
                    `Mãe de: ${formData.conjuge1.nome || "1º Cônjuge"}`,
                    formData.filiacao.maeConjuge1,
                    ['filiacao', 'maeConjuge1']
                )}
                {renderParentCard(
                    'paiConjuge2',
                    `Pai de: ${formData.conjuge2.nome || "2º Cônjuge"}`,
                    formData.filiacao.paiConjuge2,
                    ['filiacao', 'paiConjuge2']
                )}
                {renderParentCard(
                    'maeConjuge2',
                    `Mãe de: ${formData.conjuge2.nome || "2º Cônjuge"}`,
                    formData.filiacao.maeConjuge2,
                    ['filiacao', 'maeConjuge2']
                )}
            </div>
        </fieldset>
    );
}