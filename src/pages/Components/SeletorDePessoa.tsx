import React from "react";
import PersonFields from "./PersonFields";
import PessoaJuridicaFields from "./PessoaJuridicaFields";
import {
  type IPessoaFisica,
  type IPessoaJuridica,
  type IEndereco,
  type TPessoaTipo,
  type ISocio,
} from "../Civil/types";
import {
  initialPersonState,
  initialPessoaJuridicaState,
} from '../utils/initialStates';

// INTERFACE DE PROPS ATUALIZADA (com handler unificado)
interface SeletorDePessoaProps {
  dados: Partial<TPessoaTipo>;
  pathPrefix: (string | number)[];
  
  // NOVO HANDLER UNIFICADO: Aceita o caminho completo e o valor
  handleStateUpdate: (path: (string | number)[], value: any) => void;

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
  handleStateUpdate, 
  handleCpfSearch,
  handleCnpjSearch,
  searchingCpf,
  searchingCnpj,
  onDadosChange,
  onAddSocio,
  onRemoveSocio,
}) => {
  const tipoEntidade = dados?.tipo || "fisica";
  
  // CRIAÇÃO DOS OBJETOS DE DADOS SEGUROS (RESOLVE O TypeError)
  // Isso garante que personData e dadosPessoaJuridica sempre terão um objeto
  // com as chaves mínimas do estado inicial para evitar a leitura de 'undefined'.
  
  const safePersonData: IPessoaFisica = {
    // 1. Inicia com o estado inicial completo
    ...(initialPersonState as IPessoaFisica),
    // 2. Sobrescreve com os dados parciais recebidos, se o tipo for 'fisica'
    ...(dados.tipo === 'fisica' ? dados : {}) as Partial<IPessoaFisica>
  } as IPessoaFisica; // O casting final é necessário devido ao uso de Partial

  const safeJuridicaData: IPessoaJuridica = {
    // 1. Inicia com o estado inicial completo
    ...(initialPessoaJuridicaState as IPessoaJuridica),
    // 2. Sobrescreve com os dados parciais recebidos, se o tipo for 'juridica'
    ...(dados.tipo === 'juridica' ? dados : {}) as Partial<IPessoaJuridica>
  } as IPessoaJuridica; // O casting final é necessário devido ao uso de Partial


  const handleTipoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const novoTipo = e.target.value as "fisica" | "juridica";

    if (novoTipo === "juridica") {
      onDadosChange(initialPessoaJuridicaState);
    } else {
      onDadosChange(initialPersonState);
    }
    // A atualização do estado 'tipo' é tratada implicitamente ao redefinir o estado.
  };

  /* --- HANDLERS DE TRADUÇÃO (BRIDGES) --- */
  
  // 1. TRADUÇÃO DE CAMPO SIMPLES (PF/PJ)
  const handleFieldChange = (field: keyof TPessoaTipo, value: any) => {
    // Comunica ao pai o caminho completo (ex: ['client', 'nome']) e o valor
    handleStateUpdate([...pathPrefix, field], value);
  };

  // 2. TRADUÇÃO DE ENDEREÇO (PF/PJ)
  const handleAddressChange = (addressData: Partial<IEndereco>) => {
    // Comunica ao pai o caminho do endereço (ex: ['client', 'endereco']) e o objeto completo
    handleStateUpdate([...pathPrefix, "endereco"], addressData);
  };
  
  // 3. TRADUÇÃO DE QSA (SÓCIOS) - ESPECÍFICO PJ
  const handleSocioChange = (index: number, field: keyof ISocio, value: string) => {
    // Comunica ao pai o caminho completo aninhado (ex: ['client', 'qsa', 0, 'nome'])
    handleStateUpdate([...pathPrefix, "qsa", index, field], value);
  };
  
  /* --- RENDERIZAÇÃO --- */

  return (
    <div className="p-4 border border-gray-200 rounded-lg">
      <div className="mb-4">
        <label
          htmlFor="tipoEntidade"
          className="block text-sm font-medium text-gray-700"
        >
          Tipo de Pessoa
        </label>
        <select
          id="tipoEntidade"
          value={tipoEntidade}
          onChange={handleTipoChange}
          className="mt-1 w-full md:w-1/3 border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="fisica">Pessoa Física</option>
          <option value="juridica">Pessoa Jurídica</option>
        </select>
      </div>

      <div className="pt-4">
        {tipoEntidade === "fisica" ? (
          <PersonFields
            // UTILIZA O OBJETO DE DADOS SEGURO
            personData={safePersonData} 
            pathPrefix={pathPrefix}
            searchingCpf={searchingCpf}
            
            // NOVO PROP: Comunicação simples para campos (nome, cpf, etc.)
            onFieldChange={handleFieldChange as (field: keyof IPessoaFisica, value: any) => void}
            // NOVO PROP: Comunicação simples para o objeto Endereço
            onAddressChange={handleAddressChange}
            
            handleCpfSearch={handleCpfSearch}
          />
        ) : (
          <PessoaJuridicaFields
            // UTILIZA O OBJETO DE DADOS SEGURO
            dadosPessoaJuridica={safeJuridicaData}
            pathPrefix={pathPrefix}
            searchingCnpj={searchingCnpj}
            
            // NOVO PROP: Comunicação simples para campos (razaoSocial, cnpj, etc.)
            onFieldChange={handleFieldChange as (field: keyof IPessoaJuridica, value: any) => void}
            // NOVO PROP: Comunicação simples para o objeto Endereço
            onAddressChange={handleAddressChange}
            // NOVO PROP: Comunicação simples para Sócios
            onSocioChange={handleSocioChange}
            
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