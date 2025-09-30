export interface ISelo {
    numeroselo: string,
    codigo: number | undefined
}

export interface IEndereco {
    cep: string;
    tipoLogradouro: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    uf: string;
}

export interface IPessoaFisica {
    tipo: 'fisica';
    nome: string;
    cpf: string;
    dataNascimento: string;
    docIdentidadeTipo: '' | 'RG' | 'CNH' | 'Passaporte';
    docIdentidadeNum: string;
    profissao: string;
    nacionalidade: string;
    naturalidadeCidade: string;
    naturalidadeUF: string;
    endereco: IEndereco;
    sexo?: 'Masculino' | 'Feminino' | 'Ignorado';
    cor?: 'Branca' | 'Preta' | 'Parda' | 'Amarela' | 'Indígena' | 'Ignorada';
    estadoCivil?: string;
    nomePai?: string;
    nomeMae?: string;
    regimeBens?: string;
}

export interface ISocio {
    nome: string;
    qualificacao: string;
}

export interface IPessoaJuridica {
    tipo: 'juridica';
    razaoSocial: string;
    nomeFantasia?: string;
    cnpj: string;
    socioAdministrativo?: string;
    qsa?: ISocio[];
    endereco: IEndereco;
    situacao_tributaria?: 'MEI' | 'Simples Nacional' | 'Outro';
}

export type TPessoaTipo = IPessoaFisica | IPessoaJuridica;

export interface Historico {
    data: string;
    evento: string;
    usuario: string
}

export interface IPermissao {
    chave: string;       // Ex: 'usuarios:criar'
    nome: string;        // Ex: 'Criar Usuários'
    modulo: string;      // Ex: 'Usuários e Permissões'
}

// Interface para um Cargo
export interface ICargo {
    id: number;
    nome: string;
    descricao: string;
    permissoes: string[]; // Um array com as chaves das permissões associadas
}

export interface IUsuario {
    id: number;
    nome: string;
    email: string;
    cargoId: number; // ID do cargo ao qual o usuário pertence
    status: 'Ativo' | 'Inativo';
    senha: string
}

export interface ILogAtividade {
    id: number;
    userId: number;
    dataHora: string;
    acao: string;
    detalhes: string;
}

export interface ITemplate {
    id: number;
    nome: string; // Ex: "Cabeçalho Padrão com Brasão"
    tipo: 'cabecalho' | 'rodape';
    conteudo: string; // O HTML gerado pelo MainEditor
    isPadrao: boolean; // Indica se este é o template default para seu tipo
    dataModificacao: string;
}

export interface IPessoaSimples {
    nome: string;
    cpf: string;
    docIdentidadeTipo?: 'RG' | 'CNH' | 'Passaporte' | string;
    docIdentidadeNum?: string;
    profissao?: string;
    nacionalidade?: 'Brasileira' | 'Estrangeira' | string;
    estadoCivil?: 'Solteiro(a)' | 'Casado(a)' | 'Divorciado(a)' | 'Viúvo(a)' | 'União Estável';
    endereco?: Partial<IEndereco>;
}