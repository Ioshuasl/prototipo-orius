// initialStates.ts
import { type IPessoaFisica, type IPessoaJuridica, type IEndereco } from '../Types';

export const initialEnderecoState: IEndereco = {
  cep: "",
  tipoLogradouro: "",
  logradouro: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  uf: "",
};

export const initialPersonState: Partial<IPessoaFisica> = {
  nome: "",
  cpf: "",
  dataNascimento: "",
  docIdentidadeTipo: "",
  docIdentidadeNum: "",
  estadoCivil: "",
  regimeBens: "",
  profissao: "",
  nacionalidade: "Brasileira",
  naturalidadeCidade: "",
  naturalidadeUF: "",
  endereco: { ...initialEnderecoState },
  nomePai: "",
  nomeMae: "",
  tipo: "fisica",
};

export const initialPessoaJuridicaState: Partial<IPessoaJuridica> = {
  tipo: "juridica",
  razaoSocial: "",
  nomeFantasia: "",
  cnpj: "",
  qsa: [],
  endereco: { ...initialEnderecoState },
};
