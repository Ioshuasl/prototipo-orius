import React from "react";
import { Search, Loader2, Trash2, PlusCircle } from "lucide-react";
import { IMaskInput } from "react-imask";
import { type IPessoaJuridica, type IEndereco, type ISocio } from "../Civil/types"; // Importamos ISocio
import AddressFields from "./AddressFields";

interface SocioFieldsProps {
    socio: { nome: string; qualificacao: string };
    index: number;
    onSocioChange: (index: number, field: 'nome' | 'qualificacao', value: string) => void; 
    onRemoveSocio: (index: number) => void;
}

const SocioFields: React.FC<SocioFieldsProps> = ({ 
    socio, 
    index, 
    onSocioChange, 
    onRemoveSocio 
}) => {
    const commonInputClass =
        "mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500";
    const commonLabelClass = "block text-sm font-medium text-gray-700";

    return (
        <div className="flex items-end gap-4 p-3 border border-gray-300 rounded-md">
            <div className="flex-grow">
                <label className={commonLabelClass}>Nome do Sócio/Administrador</label>
                <input
                    type="text"
                    name={`qsa.${index}.nome`} // Name pode ser mantido para fins de debug, mas não será usado pelo handler
                    value={socio.nome}
                    // CHAMADA SIMPLIFICADA
                    onChange={(e) => onSocioChange(index, 'nome', e.target.value)}
                    className={commonInputClass}
                />
            </div>
            <div className="flex-grow">
                <label className={commonLabelClass}>Qualificação</label>
                <input
                    type="text"
                    name={`qsa.${index}.qualificacao`} // Name pode ser mantido para fins de debug
                    value={socio.qualificacao}
                    // CHAMADA SIMPLIFICADA
                    onChange={(e) => onSocioChange(index, 'qualificacao', e.target.value)}
                    className={commonInputClass}
                />
            </div>
            <button
                type="button"
                onClick={() => onRemoveSocio(index)}
                aria-label={`Remover sócio ${socio.nome || index + 1}`}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"
            >
                <Trash2 size={20} />
            </button>
        </div>
    );
};


// 2. INTERFACE DE PROPS DO COMPONENTE PRINCIPAL (MAIS SIMPLES)
interface PessoaJuridicaFieldsProps {
    dadosPessoaJuridica: Partial<IPessoaJuridica>;
    pathPrefix: (string | number)[]; // Mantido apenas para busca e prefixo de AddressFields
    searchingCnpj: string | null;

    // NOVA FUNÇÃO: Trata a mudança de qualquer campo simples da PJ
    onFieldChange: (field: keyof IPessoaJuridica, value: any) => void;

    // NOVA FUNÇÃO: Trata a mudança do objeto Endereço
    onAddressChange: (addressData: Partial<IEndereco>) => void;

    // NOVA FUNÇÃO: Trata a mudança de um Sócio específico
    onSocioChange: (index: number, field: keyof ISocio, value: string) => void;

    // Funções mantidas
    handleCnpjSearch: (pathPrefix: (string | number)[], cnpj: string) => void;
    onAddSocio: () => void;
    onRemoveSocio: (index: number) => void;
}


const PessoaJuridicaFields: React.FC<PessoaJuridicaFieldsProps> = ({
    dadosPessoaJuridica,
    pathPrefix,
    searchingCnpj,
    onFieldChange,
    onAddressChange,
    onSocioChange,
    handleCnpjSearch,
    onAddSocio,
    onRemoveSocio,
}) => {
    const commonInputClass =
        "mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500";
    const commonLabelClass = "block text-sm font-medium text-gray-700";
    const fullCnpjPath = pathPrefix.join(".");
    const isSearching = searchingCnpj === fullCnpjPath;

    // Handler local para campos simples (funciona para input e select)
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const fieldName = e.target.name as keyof IPessoaJuridica;
        onFieldChange(fieldName, e.target.value);
    };

    // Objeto de endereço padrão para evitar erro se for undefined
    const defaultAddress = {
        tipoLogradouro: '', logradouro: '', numero: '', complemento: '',
        bairro: '', cidade: '', uf: '', cep: ''
    };


    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                <div>
                    <label className={commonLabelClass}>CNPJ</label>
                    <div className="flex items-center">
                        <IMaskInput
                            mask="00.000.000/0000-00"
                            name="cnpj"
                            value={dadosPessoaJuridica.cnpj || ""}
                            // 3. SIMPLIFICAÇÃO DO IMASKINPUT
                            onAccept={(value) => onFieldChange("cnpj", value)}
                            className={commonInputClass}
                            placeholder="00.000.000/0000-00"
                        />
                        <button
                            type="button"
                            onClick={() =>
                                handleCnpjSearch(pathPrefix, dadosPessoaJuridica.cnpj || "")
                            }
                            disabled={isSearching}
                            className="ml-2 px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-md flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                        >
                            {isSearching ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <Search className="h-5 w-5 text-gray-600" />
                            )}
                        </button>
                    </div>
                </div>

                <div>
                    <label className={commonLabelClass}>Razão Social</label>
                    <input
                        type="text"
                        name="razaoSocial"
                        value={dadosPessoaJuridica.razaoSocial || ""}
                        onChange={handleChange}
                        className={commonInputClass}
                    />
                </div>

                <div>
                    <label className={commonLabelClass}>Nome Fantasia</label>
                    <input
                        type="text"
                        name="nomeFantasia"
                        value={dadosPessoaJuridica.nomeFantasia || ""}
                        onChange={handleChange}
                        className={commonInputClass}
                    />
                </div>
            </div>

            <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">QSA</h4>
                <div className="space-y-3">
                    {(dadosPessoaJuridica.qsa || []).map((socio, index) => (
                        <SocioFields
                            key={index}
                            socio={socio}
                            index={index}
                            // Agora SocioFields usa a função específica, sem o path prefix
                            onSocioChange={onSocioChange}
                            onRemoveSocio={onRemoveSocio}
                        />
                    ))}
                </div>
                <button
                    type="button"
                    onClick={onAddSocio}
                    className="mt-3 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                    <PlusCircle size={20} /> Adicionar Sócio
                </button>
            </div>

            <AddressFields
                // O prefixo ainda é necessário aqui para os inputs internos do AddressFields
                namePrefix={`${fullCnpjPath}.endereco`}
                addressData={dadosPessoaJuridica.endereco ?? defaultAddress}
                // Repassa o handler de input genérico se o AddressFields precisar (será refatorado depois)
                handleInputChange={(e) => { 
                    // Se o AddressFields for refatorado, esta prop pode ser removida!
                }}
                // 4. SIMPLIFICAÇÃO DO ADDRESSUPDATE
                handleAddressUpdate={onAddressChange}
            />

            {dadosPessoaJuridica.situacao_tributaria && (
                <div>
                    <label className={commonLabelClass}>Situação Tributária</label>
                    <input
                        type="text"
                        name="situacao_tributaria"
                        value={dadosPessoaJuridica.situacao_tributaria}
                        onChange={handleChange}
                        className={commonInputClass}
                        readOnly
                    />
                </div>
            )}
        </div>
    );
};

export default PessoaJuridicaFields;