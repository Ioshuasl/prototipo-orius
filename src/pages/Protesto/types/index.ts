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

interface Historico {
    data: string;
    evento: string;
    usuario: string
}


export interface ITituloProtesto {
    id: number;
    isTituloAntigo: boolean;
    protocolo: string;
    status: StatusTitulo;
    dataPrazoFinal?: Date
    apresentante: TPessoaTipo; 
    devedores: TPessoaTipo[]; 
    cedente?: TPessoaTipo;
    especieTitulo: string;
    numeroTitulo: string;
    valor: number;
    tipoPagamento: 'COMUM' | 'POSTERIOR' | 'DIFERIDO'; 
    valorPago?: number;
    dataEmissao: Date;
    dataVencimento: Date;
    banco?: number;
    apontamento?:{
        dataApontamento: Date;
        selosApontamento?: ISelo[];
    };
    intimacao?: {
        data: Date;
        meio: 'Pessoal' | 'Postal' | 'Edital';
        detalhes: string;
        selosIntimacao?: ISelo[];
    };
    liquidacaoOuDesistencia?: {
        data: Date;
        tipo: 'LIQUIDACAO' | 'DESISTENCIA';
        seloLiquidacaoDesistencia: ISelo;
    };
    protesto?: {
        dataLavratura: Date;
        motivo: 'Falta de Pagamento' | 'Falta de Aceite' | 'Falta de Devolução';
        livro: string;
        folha: string;
        selosProtesto?: ISelo[];
    };
    cancelamento?: {
        data: Date;
        motivo: 'Ordem Judicial' | 'Anuência do Credor' | 'Pagamento';
        selosCancelamento?: ISelo;
    };
    motivoRecusa?: string;
    historico: Historico[]
}

export type StatusTitulo =
    | 'Aguardando Qualificação'
    | 'Recusado'
    | 'Aguardando Intimação'
    | 'Prazo Aberto'
    | 'Pago'
    | 'Retirado'
    | 'Sustado Judicialmente'
    | 'Protestado'
    | 'Cancelado';

export interface IBank {
    name: string;
    code: number;
    fullName: string;
}

export interface ILivroDeProtesto {
    id: string; // Ex: "PROTESTO-1"
    tipo: 'Livro de Protocolo' | 'Livro de Protesto';
    numero: number;
    situacao: 'Aberto' | 'Fechado';
    quantidadeFolhas: 200; // Valor fixo
    folhaAtual: number;
}