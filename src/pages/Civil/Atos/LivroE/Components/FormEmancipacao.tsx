import React from 'react';
import PersonFields from '../../../Components/PersonFields';
import DadosDocumentoOrigem from '../Components/DadosDocumentoOrigem';
import { type IEmancipacao, type IEndereco, type IPersonData } from '../../../types';
import { infoEmancipacao } from '../../../lib/contextualInfo';
import SectionHeader from '../../../Components/SectionHeader';

interface FormProps {
    data: IEmancipacao;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleAddressUpdate: (path: (string | number)[], addressData: Partial<IEndereco>) => void;
    handleCpfSearch: (pathPrefix: (string | number)[], cpf: string) => void;
    searchingCpf: string | null;
    onOpenInfoModal: (title: string, content: React.ReactNode) => void;
}

export default function FormEmancipacao({ data, handleInputChange, handleAddressUpdate, handleCpfSearch, searchingCpf, onOpenInfoModal }: FormProps) {
    const commonInputClass = "mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500";

    const pathPrefix = ['dadosAto', 'emancipacao'];

    return (
        <div className="space-y-8">

            <div>
                {/* ALTERAÇÃO: Usando o novo cabeçalho com botão de info */}
                <SectionHeader
                    title="Origem do Ato"
                    infoContent={infoEmancipacao}
                    onOpenInfoModal={onOpenInfoModal}
                />
                <DadosDocumentoOrigem origem="sentenca" dados={data} pathPrefix={pathPrefix.join('.')} handleInputChange={handleInputChange} />
            </div>

            <div>
                <h4 className="font-bold text-gray-600 mb-3">Origem do Ato</h4>
                <select name={`${pathPrefix.join('.')}.origem`} value={data.origem} onChange={handleInputChange} className={commonInputClass}>
                    <option value="sentenca">Sentença Judicial</option>
                    <option value="escritura">Escritura Pública</option>
                </select>
                <DadosDocumentoOrigem origem={data.origem} dados={data} pathPrefix={pathPrefix.join('.')} handleInputChange={handleInputChange} />
            </div>

            <div>
                <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">Dados do Emancipado</h4>
                <PersonFields
                    personData={data.emancipado as IPersonData}
                    pathPrefix={[...pathPrefix, 'emancipado']}
                    handleInputChange={handleInputChange}
                    handleAddressUpdate={handleAddressUpdate}
                    handleCpfSearch={handleCpfSearch}
                    searchingCpf={searchingCpf}
                />
            </div>

            <div>
                <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">Responsáveis que Concederam a Emancipação</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nome do Pai</label>
                        <input type="text" name={`${pathPrefix.join('.')}.responsaveis.nomePai`} value={data.responsaveis?.nomePai || ''} onChange={handleInputChange} className={commonInputClass} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nome da Mãe</label>
                        <input type="text" name={`${pathPrefix.join('.')}.responsaveis.nomeMae`} value={data.responsaveis?.nomeMae || ''} onChange={handleInputChange} className={commonInputClass} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nome do Tutor (se aplicável)</label>
                        <input type="text" name={`${pathPrefix.join('.')}.responsaveis.nomeTutor`} value={data.responsaveis?.nomeTutor || ''} onChange={handleInputChange} className={commonInputClass} />
                    </div>
                </div>
            </div>
        </div>
    );
}