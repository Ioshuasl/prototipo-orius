import React from "react";
import { Search, Loader2 } from "lucide-react";
import { IMaskInput } from "react-imask";
// Assumindo que estas constantes existem no projeto
import {
  ufs,
  regimesDeBens,
  nacionalidades,
} from "../Civil/lib/Constants";
import { TIPOS_DOCUMENTO, ESTADOS_CIVIS } from "../utils/constants";
// Importando tipos definidos
import { type IPessoaFisica, type IEndereco } from "../Civil/types";
import AddressFields from "./AddressFields";

// 1. INTERFACE DE PROPS SIMPLIFICADA
interface PersonFieldsProps {
  personData: IPessoaFisica;
  pathPrefix: (string | number)[]; // Mantido apenas para lógica de busca e endereço
  searchingCpf: string | null;
  
  // NOVA FUNÇÃO: Trata a mudança de qualquer campo simples
  onFieldChange: (field: keyof IPessoaFisica, value: any) => void;

  // NOVA FUNÇÃO: Trata a mudança do objeto Endereço
  onAddressChange: (addressData: Partial<IEndereco>) => void;
  
  // Função de busca (mantida como está para que o componente pai gerencie o path/estado)
  handleCpfSearch: (pathPrefix: (string | number)[], cpf: string) => void;
}

const PersonFields: React.FC<PersonFieldsProps> = ({
  personData,
  pathPrefix,
  searchingCpf,
  onFieldChange,
  onAddressChange,
  handleCpfSearch,
}) => {
  const commonInputClass =
    "mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500";
  const commonLabelClass = "block text-sm font-medium text-gray-700";

  // Handler local simplificado
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    // Usamos o 'name' do input, mas isolamos apenas a chave (ex: 'nome', 'estadoCivil')
    // No caso de inputs simples, o name é definido no render (ex: name="nome")
    const fieldName = e.target.name as keyof IPessoaFisica;
    onFieldChange(fieldName, e.target.value);
  };
  
  // Este campo é para a busca, que ainda precisa do pathPrefix
  const fullCpfPath = pathPrefix.join(".");

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-5">
      <div className="md:col-span-2">
        <label className={commonLabelClass}>Nome Completo</label>
        <input
          type="text"
          // Agora o 'name' é apenas a chave, pois 'onFieldChange' resolve o path no pai
          name="nome"
          value={personData.nome}
          onChange={handleChange}
          className={commonInputClass}
        />
      </div>

      <div>
        <label className={commonLabelClass}>CPF</label>
        <div className="flex">
          <IMaskInput
            mask="000.000.000-00"
            // Não precisamos do name complexo, mas colocamos para o handleChange genérico se manter
            name="cpf" 
            value={personData.cpf}
            // 2. SIMPLIFICAÇÃO DO IMASKINPUT
            onAccept={(value) => onFieldChange("cpf", value)}
            className={commonInputClass}
            placeholder="000.000.000-00"
          />
          <button
            type="button"
            onClick={() => handleCpfSearch(pathPrefix, personData.cpf)}
            disabled={searchingCpf === fullCpfPath}
            className="ml-2 mt-1 px-3 bg-gray-200 hover:bg-gray-300 rounded-md flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          >
            {searchingCpf === fullCpfPath ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Search className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Outros campos seguem o mesmo padrão: name="dataNascimento", onChange={handleChange} */}
      
      <div>
        <label className={commonLabelClass}>Data de Nascimento</label>
        <input
          type="date"
          max={new Date().toISOString().split("T")[0]}
          name="dataNascimento"
          value={personData.dataNascimento}
          onChange={handleChange}
          className={commonInputClass}
        />
      </div>

      <div>
        <label className={commonLabelClass}>Tipo de Documento</label>
        <select
          name="docIdentidadeTipo"
          value={personData.docIdentidadeTipo}
          onChange={handleChange}
          className={commonInputClass}
        >
          <option value="">Selecione</option>
          {TIPOS_DOCUMENTO.map((doc) => (
            <option key={doc} value={doc}>
              {doc}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={commonLabelClass}>Nº do Documento</label>
        <input
          type="text"
          name="docIdentidadeNum"
          value={personData.docIdentidadeNum}
          onChange={handleChange}
          className={commonInputClass}
        />
      </div>

      <div>
        <label className={commonLabelClass}>Estado Civil</label>
        <select
          name="estadoCivil"
          value={personData.estadoCivil}
          onChange={handleChange}
          className={commonInputClass}
        >
          <option value="">Selecione</option>
          {ESTADOS_CIVIS.map((estado) => (
            <option key={estado} value={estado}>
              {estado}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={commonLabelClass}>Regime de Bens</label>
        <select
          name="regimeBens"
          value={personData.regimeBens}
          onChange={handleChange}
          className={commonInputClass}
        >
          <option value="">Selecione...</option>
          {regimesDeBens.map((regime) => (
            <option key={regime} value={regime}>
              {regime}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={commonLabelClass}>Profissão</label>
        <input
          type="text"
          name="profissao"
          value={personData.profissao}
          onChange={handleChange}
          className={commonInputClass}
        />
      </div>

      <div>
        <label className={commonLabelClass}>Nacionalidade</label>
        <select
          name="nacionalidade"
          value={personData.nacionalidade}
          onChange={handleChange}
          className={commonInputClass}
        >
          {nacionalidades.map((nac) => (
            <option key={nac} value={nac}>
              {nac}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={commonLabelClass}>Naturalidade (Cidade)</label>
        <input
          type="text"
          name="naturalidadeCidade"
          value={personData.naturalidadeCidade}
          onChange={handleChange}
          className={commonInputClass}
        />
      </div>

      <div>
        <label className={commonLabelClass}>UF</label>
        <select
          name="naturalidadeUF"
          value={personData.naturalidadeUF}
          onChange={handleChange}
          className={commonInputClass}
        >
          <option value="">Selecione...</option>
          {ufs.map((uf) => (
            <option key={uf} value={uf}>
              {uf}
            </option>
          ))}
        </select>
      </div>

      {/* 3. SIMPLIFICAÇÃO DO ADDRESSFIELDS */}
      <AddressFields
        // O namePrefix do endereço ainda precisa do caminho completo para os inputs internos
        namePrefix={`${pathPrefix.join(".")}.endereco`}
        addressData={personData.endereco}
        // O handleInputChange pode ser mantido para gerenciar os inputs internos do endereço
        handleInputChange={(e) => {
            // Este é um ponto de complexidade que pode ser resolvido no AddressFields
            // Para manter a simplicidade, deixamos o PersonFields repassar o handler principal
            // (Assumindo que o componente pai ainda precisa do formato original)
            // Alternativa: remover handleInputChange daqui e deixar AddressFields usar onAddressChange
            // Mas, como a prop está definida no AddressFields, a manteremos:
            // handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
            // Para não introduzir um novo tipo de input handler.
            // Aqui, é mais seguro que o PersonFields não saiba o que está sendo digitado no AddressFields
            
            // Portanto, a refatoração do AddressFields é que deve ser feita na sequência!
            // Para fins de PersonFields, podemos assumir que o AddressFields passará apenas onAddressChange
        }}
        // A função de atualização de endereço agora é a nova prop simplificada
        handleAddressUpdate={onAddressChange}
      />

      {pathPrefix.includes("filiacao") && (
        <>
          <div className="md:col-span-2 pt-4">
            <label className={`${commonLabelClass} text-gray-500`}>
              Nome do Pai da Pessoa
            </label>
            <input
              type="text"
              name="nomePai"
              value={personData.nomePai}
              onChange={handleChange}
              className={commonInputClass}
            />
          </div>
          <div className="md:col-span-2 pt-4">
            <label className={`${commonLabelClass} text-gray-500`}>
              Nome da Mãe da Pessoa
            </label>
            <input
              type="text"
              name="nomeMae"
              value={personData.nomeMae}
              onChange={handleChange}
              className={commonInputClass}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default PersonFields;