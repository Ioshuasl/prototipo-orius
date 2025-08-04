import React from 'react';
import PersonFields from './PersonFields';
import PessoaJuridicaFields from './PessoaJuridicaFields';
import { type IPessoaFisica, type IPessoaJuridica, type IEndereco, type TPessoaTipo } from '../types';

// ALTERAÇÃO: Estados iniciais declarados diretamente no arquivo.
const initialEnderecoState: IEndereco = {
    cep: '',
    tipoLogradouro: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: ''
};

const initialPersonState: Partial<IPessoaFisica> = {
    nome: '',
    cpf: '',
    dataNascimento: '',
    docIdentidadeTipo: '',
    docIdentidadeNum: '',
    estadoCivil: '',
    regimeBens: '',
    profissao: '',
    nacionalidade: 'Brasileira',
    naturalidadeCidade: '',
    naturalidadeUF: '',
    endereco: { ...initialEnderecoState },
    nomePai: '',
    nomeMae: '',
};

interface SeletorDePessoaProps {
    dados: Partial<TPessoaTipo>;
    pathPrefix: (string | number)[];
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleAddressUpdate: (path: (string | number)[], addressData: Partial<IEndereco>) => void;
    handleCpfSearch: (pathPrefix: (string | number)[], cpf: string) => void;
    handleCnpjSearch: (pathPrefix: (string | number)[], cnpj: string) => void;
    searchingCpf: string | null;
    searchingCnpj: string | null;
    onDadosChange: (novosDados: Partial<TPessoaTipo>) => void;
    onAddSocio: () => void;
    onRemoveSocio: (index: number) => void;
}

const SeletorDePessoa: React.FC<SeletorDePessoaProps> = ({
    dados,
    pathPrefix,
    handleInputChange,
    handleAddressUpdate,
    handleCpfSearch,
    handleCnpjSearch,
    searchingCpf,
    searchingCnpj,
    onDadosChange,
    onAddSocio,
    onRemoveSocio
}) => {
    
    const tipoEntidade = dados?.tipo || 'fisica';

    const handleTipoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const novoTipo = e.target.value as 'fisica' | 'juridica';

        if (novoTipo === 'juridica') {
            const initialStatePJ: Partial<IPessoaJuridica> = {
                tipo: 'juridica',
                razaoSocial: '',
                nomeFantasia: '',
                cnpj: '',
                qsa: [],
                endereco: { ...initialEnderecoState }
            };
            onDadosChange(initialStatePJ);
        } else {
             const initialStatePF: Partial<IPessoaFisica> = {
                ...initialPersonState,
                tipo: 'fisica',
            };
            onDadosChange(initialStatePF);
        }
    };

    return (
        <div className="p-4 border border-gray-200 rounded-lg">
            <div className="mb-4">
                <label htmlFor="tipoEntidade" className="block text-sm font-medium text-gray-700">
                    Tipo de Pessoa
                </label>
                <select
                    id="tipoEntidade"
                    value={tipoEntidade}
                    name={`${pathPrefix.join('.')}.tipo`}
                    onChange={(e) => {
                        handleTipoChange(e);
                        handleInputChange(e);
                    }}
                    className="mt-1 w-full md:w-1/3 border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="fisica">Pessoa Física</option>
                    <option value="juridica">Pessoa Jurídica</option>
                </select>
            </div>

            <div className="pt-4">
                {tipoEntidade === 'fisica' ? (
                    <PersonFields
                        personData={dados as IPessoaFisica}
                        pathPrefix={pathPrefix}
                        searchingCpf={searchingCpf}
                        handleInputChange={handleInputChange}
                        handleAddressUpdate={handleAddressUpdate}
                        handleCpfSearch={handleCpfSearch}
                    />
                ) : (
                    <PessoaJuridicaFields
                        dadosPessoaJuridica={dados as IPessoaJuridica}
                        pathPrefix={pathPrefix}
                        searchingCnpj={searchingCnpj}
                        handleInputChange={handleInputChange}
                        handleAddressUpdate={handleAddressUpdate}
                        handleCnpjSearch={handleCnpjSearch}
                        onAddSocio={onAddSocio}
                        onRemoveSocio={onRemoveSocio}
                    />
                )}
            </div>
        </div>
    );
};

export default SeletorDePessoa;