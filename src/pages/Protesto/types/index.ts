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


export interface ITituloProtesto {
    id: number;
    protocolo: string;
    status: StatusTitulo;
    dataApontamento: Date;
    dataPrazoFinal?: Date
    selos?: string[];
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
    intimacao?: {
        data: Date;
        meio: 'Pessoal' | 'Postal' | 'Edital';
        detalhes: string;
    };
    protesto?: {
        dataLavratura: Date;
        motivo: 'Falta de Pagamento' | 'Falta de Aceite' | 'Falta de Devolução';
        livro: string;
        folha: string;
    };
    cancelamento?: {
        data: Date;
        motivo: 'Ordem Judicial' | 'Anuência do Credor' | 'Pagamento';
    };
    motivoRecusa?: string;
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
    code: number | string;
    fullName: string;
}