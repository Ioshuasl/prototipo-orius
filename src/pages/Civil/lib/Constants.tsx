import { type IPessoaFisica, type CertidaoOption } from "../types";

export const ufs = [ 'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO' ];
export const regimesDeBens = [ 'Comunhão Parcial de Bens', 'Comunhão Universal de Bens', 'Separação Total de Bens','Separação Obrigatória de Bens', 'Participação Final nos Aquestos', 'Não se aplica' ];
export const nacionalidades = ['Brasileira', 'Estrangeira'];
export const livrosDisponiveis = ['A-101', 'A-102', 'A-103 (Especial)', 'B-05'];
export const tiposLogradouro = ['Rua', 'Avenida', 'Praça', 'Travessa', 'Alameda', 'Estrada', 'Rodovia', 'Viela', 'Largo', 'Quadra'];
export const mockDatabase: { [key: string]: Omit<IPessoaFisica, 'endereco'> } = {
    "11111111111": { tipo: 'fisica',nome: "Fulano de Tal da Silva", cpf: "111.111.111-11", dataNascimento: "1990-01-15", docIdentidadeTipo: "RG", docIdentidadeNum: "1234567", estadoCivil: "Solteiro(a)", regimeBens: "", profissao: "Engenheiro(a)", nacionalidade: "Brasileira", naturalidadeCidade: "São Paulo", naturalidadeUF: "SP", nomePai: "Pai do Fulano", nomeMae: "Mãe do Fulano" },
    "22222222222": { tipo: 'fisica',nome: "Ciclana de Souza Oliveira", cpf: "222.222.222-22", dataNascimento: "1992-05-20", docIdentidadeTipo: "CNH", docIdentidadeNum: "9876543", estadoCivil: "Solteiro(a)", regimeBens: "", profissao: "Advogada", nacionalidade: "Brasileira", naturalidadeCidade: "Rio de Janeiro", naturalidadeUF: "RJ", nomePai: "Pai da Ciclana", nomeMae: "Mãe da Ciclana" }
};

export const dataAtualFormatada = () => new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

export const tiposDeAtoLivroE = [
    { value: 'emancipacao', label: 'Emancipação' },
    { value: 'interdicao', label: 'Interdição' },
    { value: 'ausencia', label: 'Declaração de Ausência' },
    { value: 'mortePresumida', label: 'Declaração de Morte Presumida' },
    { value: 'uniaoEstavel', label: 'União Estável (Reconhecimento ou Dissolução)' },
    { value: 'opcaoNacionalidade', label: 'Opção de Nacionalidade' },
    { value: 'tutela', label: 'Tutela' },
    { value: 'guarda', label: 'Guarda' },
    { value: 'nascimentoPaisEstrangeiros', label: 'Nascimento (Pais Estrangeiros a Serviço)' },
    { value: 'trasladoExterior', label: 'Traslado de Assento do Exterior' },
];

export const selo_teste = '03132412024883621400000'

export const atoOptions = [
    'Nascimento', 
    'Casamento', 
    'Óbito', 
    'Natimorto',
    'Livro E',
];

// ATUALIZAÇÃO: Constante refeita com os novos dados e códigos de tipo_ato
export const certidaoPorAto: Record<string, CertidaoOption[]> = {
    Nascimento: [
        { id: 1, tipo_ato: 3004, titulo_servico: 'Certidão de 1ª via' },
        { id: 2, tipo_ato: 3001, titulo_servico: 'Certidão de 2ª via' },
        { id: 3, tipo_ato: null, titulo_servico: 'Certidão de Inteiro Teor de Nascimento' },
    ],
    Casamento: [
        { id: 4, tipo_ato: 2993, titulo_servico: 'Certidão de 1ª via' },
        { id: 5, tipo_ato: 3001, titulo_servico: 'Certidão de 2ª via' },
        { id: 6, tipo_ato: null, titulo_servico: 'Certidão de Inteiro Teor de Casamento' },
    ],
    Obito: [
        { id: 7, tipo_ato: 3005, titulo_servico: 'Certidão de 1ª via' },
        { id: 8, tipo_ato: 3001, titulo_servico: 'Certidão de 2ª via' },
        { id: 9, tipo_ato: null, titulo_servico: 'Certidão de Inteiro Teor de Óbito' },
    ],
    Natimorto: [
        { id: 10, tipo_ato: 3005, titulo_servico: 'Certidão de 1ª via' },
        { id: 11, tipo_ato: 3001, titulo_servico: 'Certidão de 2ª via' },
        { id: 12, tipo_ato: null, titulo_servico: 'Certidão de Inteiro Teor de Natimorto' },
    ],
    'Livro E': [
        { id: 13, tipo_ato: 2997, titulo_servico: 'Certidão de Emancipação' },
        { id: 14, tipo_ato: null, titulo_servico: 'Certidão de Interdição' },
        { id: 15, tipo_ato: 2998, titulo_servico: 'Certidão de Ausência' },
        { id: 16, tipo_ato: null, titulo_servico: 'Certidão de Morte Presumida' },
        { id: 17, tipo_ato: null, titulo_servico: 'Certidão de União Estável' },
        { id: 18, tipo_ato: 2997, titulo_servico: 'Certidão de Opção de Nacionalidade Brasileira' },
        { id: 19, tipo_ato: 2998, titulo_servico: 'Certidão de Tutela' },
        { id: 20, tipo_ato: 2998, titulo_servico: 'Certidão de Guarda' },
        { id: 21, tipo_ato: 2997, titulo_servico: 'Certidão de Nascimento (Pais Estrangeiros)' },
        { id: 22, tipo_ato: 2997, titulo_servico: 'Certidão de Traslado Exterior de Nascimento' },
        { id: 23, tipo_ato: 2997, titulo_servico: 'Certidão de Traslado Exterior de Casamento' },
        { id: 24, tipo_ato: 2997, titulo_servico: 'Certidão de Traslado Exterior de Óbito' },
    ]
};

export const DADOS_SERVENTIA = {
    cns: '12.345-6',
    cidade: 'Goiânia',
    uf: 'GO',
    endereco: 'Av. Anhanguera, Qd. 1, Lt. 2, Centro',
    cep: '74013-010',
};

export const DADOS_OFICIAL = {
    nome: 'Beltrano de Tal',
    cargo: 'Oficial Titular do Registro Civil',
};

export const DADOS_ESCREVENTE = {
    nome: 'Fulana de Souza',
    cargo: 'Escrevente Autorizada',
};