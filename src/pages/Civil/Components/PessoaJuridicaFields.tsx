import React from 'react';
import { Search, Loader2, Trash2, PlusCircle } from 'lucide-react';
import { IMaskInput } from 'react-imask';
import { type IPessoaJuridica, type IEndereco } from '../types';
import AddressFields from './AddressFields';

interface PessoaJuridicaFieldsProps {
    dadosPessoaJuridica: Partial<IPessoaJuridica>; // Alterado para Partial para mais segurança
    pathPrefix: (string | number)[];
    searchingCnpj: string | null;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleAddressUpdate: (path: (string | number)[], addressData: Partial<IEndereco>) => void;
    handleCnpjSearch: (pathPrefix: (string | number)[], cnpj: string) => void;
    onAddSocio: () => void;
    onRemoveSocio: (index: number) => void;
}

const PessoaJuridicaFields: React.FC<PessoaJuridicaFieldsProps> = ({
    dadosPessoaJuridica,
    pathPrefix,
    searchingCnpj,
    handleInputChange,
    handleAddressUpdate,
    handleCnpjSearch,
    onAddSocio,
    onRemoveSocio
}) => {
    const commonInputClass = "mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500";
    const commonLabelClass = "block text-sm font-medium text-gray-700";
    const basePath = pathPrefix.join('.');
    const isSearching = searchingCnpj === basePath;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">

                <div>
                    <label className={commonLabelClass}>CNPJ</label>
                    <div className="flex items-center">
                        <IMaskInput
                            mask="00.000.000/0000-00"
                            name={`${basePath}.cnpj`}
                            value={dadosPessoaJuridica.cnpj || ''}
                            onAccept={(value) => handleInputChange({ target: { name: `${basePath}.cnpj`, value } } as any)}
                            className={commonInputClass}
                            placeholder="00.000.000/0000-00"
                        />
                        <button
                            type="button"
                            onClick={() => handleCnpjSearch(pathPrefix, dadosPessoaJuridica.cnpj || '')}
                            disabled={isSearching}
                            className="ml-2 mt-1 px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-md flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                        >
                            {isSearching ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5 text-gray-600" />}
                        </button>
                    </div>
                </div>

                <div >
                    <label className={commonLabelClass}>Razão Social</label>
                    <input
                        type="text"
                        name={`${basePath}.razaoSocial`}
                        value={dadosPessoaJuridica.razaoSocial || ''}
                        onChange={handleInputChange}
                        className={commonInputClass}
                    />
                </div>

                <div>
                    <label className={commonLabelClass}>Nome Fantasia (Opcional)</label>
                    <input
                        type="text"
                        name={`${basePath}.nomeFantasia`}
                        value={dadosPessoaJuridica.nomeFantasia || ''}
                        onChange={handleInputChange}
                        className={commonInputClass}
                    />
                </div>
            </div>

            <div className="md:col-span-4 mt-4">
                <h4 className="text-md font-semibold text-gray-800">Quadro de Sócios e Administradores (QSA)</h4>
            </div>
            <div className="space-y-4">
                {dadosPessoaJuridica.qsa?.map((socio, index) => (
                    <div key={index} className="flex items-end gap-4 p-3 bg-gray-100 rounded-md">
                        <div className="flex-grow">
                            <label className={commonLabelClass}>Nome do Sócio/Administrador</label>
                            <input type="text" name={`${basePath}.qsa.${index}.nome`} value={socio.nome} onChange={handleInputChange} className={commonInputClass} />
                        </div>
                        <div className="flex-grow">
                            <label className={commonLabelClass}>Qualificação</label>
                            <input type="text" name={`${basePath}.qsa.${index}.qualificacao`} value={socio.qualificacao} onChange={handleInputChange} className={commonInputClass} />
                        </div>
                        {/* Botão de remover agora chama o handler específico */}
                        <button type="button" onClick={() => onRemoveSocio(index)} className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"><Trash2 size={20} /></button>
                    </div>
                ))}
                 {/* Botão de adicionar agora chama o handler específico */}
                 <button type="button" onClick={onAddSocio} className="mt-2 flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800"><PlusCircle size={16} />Adicionar Sócio</button>
            </div>

            <div className="md:col-span-4 mt-4">
                <h4 className="text-md font-semibold text-gray-800">Endereço da Empresa</h4>
            </div>

            <AddressFields
                namePrefix={`${basePath}.endereco`}
                addressData={dadosPessoaJuridica.endereco ?? {
                    tipoLogradouro: '',
                    logradouro: '',
                    numero: '',
                    complemento: '',
                    bairro: '',
                    cidade: '',
                    uf: '',
                    cep: ''
                }}
                handleInputChange={handleInputChange}
                handleAddressUpdate={(data) => handleAddressUpdate([...pathPrefix, 'endereco'], data)}
            />
        </div>
    );
};

export default PessoaJuridicaFields;