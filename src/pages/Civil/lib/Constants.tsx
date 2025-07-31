import { type IPessoaFisica, type CertidaoOption, type AverbacaoOption } from "../types";

export const ufs = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];
export const regimesDeBens = ['Comunhão Parcial de Bens', 'Comunhão Universal de Bens', 'Separação Total de Bens', 'Separação Obrigatória de Bens', 'Participação Final nos Aquestos', 'Não se aplica'];
export const nacionalidades = ['Brasileira', 'Estrangeira'];
export const livrosDisponiveis = ['A-101', 'A-102', 'A-103 (Especial)', 'B-05'];
export const tiposLogradouro = ['Rua', 'Avenida', 'Praça', 'Travessa', 'Alameda', 'Estrada', 'Rodovia', 'Viela', 'Largo', 'Quadra'];
export const mockPessoDatabase: { [key: string]: Omit<IPessoaFisica, 'endereco'> } = {
    "11111111111": { tipo: 'fisica', nome: "Fulano de Tal da Silva", cpf: "111.111.111-11", dataNascimento: "1990-01-15", docIdentidadeTipo: "RG", docIdentidadeNum: "1234567", estadoCivil: "Solteiro(a)", regimeBens: "", profissao: "Engenheiro(a)", nacionalidade: "Brasileira", naturalidadeCidade: "São Paulo", naturalidadeUF: "SP", nomePai: "Pai do Fulano", nomeMae: "Mãe do Fulano" },
    "22222222222": { tipo: 'fisica', nome: "Ciclana de Souza Oliveira", cpf: "222.222.222-22", dataNascimento: "1992-05-20", docIdentidadeTipo: "CNH", docIdentidadeNum: "9876543", estadoCivil: "Solteiro(a)", regimeBens: "", profissao: "Advogada", nacionalidade: "Brasileira", naturalidadeCidade: "Rio de Janeiro", naturalidadeUF: "RJ", nomePai: "Pai da Ciclana", nomeMae: "Mãe da Ciclana" }
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

export const mockAtosDatabase: any[] = [
    // --- DADOS PARA CERTIDÃO DE NASCIMENTO ---
    {
        protocolo: '2025-N-12345',
        termo: '5890',
        livro: 'A-101',
        folha: '15',
        tipoAto: 'Nascimento',
        nomePrincipal: 'Helena da Silva Santos',
        matricula: '123456 01 55 2025 1 00101 015 0005890 10',
        dadosCompletos: {
            cpf: '111.222.333-44',
            dataNascimento: '2025-03-15T09:30:00',
            localNascimento: 'Hospital Materno Infantil',
            municipioNascimento: 'Goiânia',
            ufNascimento: 'GO',
            sexo: 'Feminino',
            filiacao: [
                {
                    nome: 'Marcos de Oliveira Santos',
                    naturalidade: 'Anápolis',
                    ufNaturalidade: 'GO',
                    avos: [
                        { nome: 'José Santos' },
                        { nome: 'Maria Aparecida de Oliveira' }
                    ]
                },
                {
                    nome: 'Ana Luíza da Silva',
                    naturalidade: 'Palmas',
                    ufNaturalidade: 'TO',
                    avos: [
                        { nome: 'Carlos da Silva' },
                        { nome: 'Joana Pereira da Silva' }
                    ]
                }
            ],
            gemeo: null, // ou { nome: '...', matricula: '...' }
            dataRegistro: '2025-03-18',
            dnv: '4589987-1',
            anotacoesAverbacoes: 'Nenhuma.',
            anotacoesCadastro: 'Documento de identidade do pai: 123456 SSP/GO.'
        }
    },
    // --- DADOS PARA CERTIDÃO DE CASAMENTO ---
    {
        protocolo: '2024-C-67890',
        termo: '1122',
        livro: 'B-AUX-05',
        folha: '112',
        tipoAto: 'Casamento',
        nomePrincipal: 'Arthur Pereira & Julia Martins',
        matricula: '987654 01 55 2024 2 00005 112 0001122 25',
        dadosCompletos: {
            dataCelebracao: '2024-11-20',
            dataRegistro: '2024-11-20',
            regimeBens: 'Comunhão Parcial de Bens',
            anotacoesAverbacoes: 'Alteração de regime de bens para Comunhão Universal, conforme pacto antenupcial lavrado no 2º Tabelionato de Notas.',
            anotacoesCadastro: null,
            conjuges: [
                {
                    nomeHabilitacao: 'Arthur Pereira Rocha',
                    nomeAtual: 'Arthur Pereira Rocha',
                    cpf: '444.555.666-77',
                    dataNascimento: '1995-05-10',
                    nacionalidade: 'Brasileira',
                    estadoCivilAnterior: 'Solteiro',
                    municipioNascimento: 'Rio de Janeiro',
                    ufNascimento: 'RJ',
                    genitores: [
                        { nome: 'Ricardo Pereira Rocha' },
                        { nome: 'Sandra Marques Pereira' }
                    ]
                },
                {
                    nomeHabilitacao: 'Julia Martins Costa',
                    nomeAtual: 'Julia Martins Costa Pereira',
                    cpf: '777.888.999-00',
                    dataNascimento: '1997-02-15',
                    nacionalidade: 'Brasileira',
                    estadoCivilAnterior: 'Solteira',
                    municipioNascimento: 'São Paulo',
                    ufNascimento: 'SP',
                    genitores: [
                        { nome: 'Fernando Costa' },
                        { nome: 'Beatriz Martins Costa' }
                    ]
                }
            ]
        }
    },
    // --- DADOS PARA CERTIDÃO DE ÓBITO ---
    {
        protocolo: '2025-O-54321',
        termo: '987',
        livro: 'C-22',
        folha: '250',
        tipoAto: 'Obito',
        nomePrincipal: 'Roberto Almeida',
        matricula: '543210 01 55 2025 3 00022 250 0000987 99',
        dadosCompletos: {
            cpf: '999.888.777-66',
            dataObito: '2025-07-20T14:00:00',
            dataNascimento: '1950-01-25',
            idade: '75 anos',
            sexo: 'Masculino',
            estadoCivil: 'Viúvo',
            ultimoConjuge: 'Maria Souza Almeida',
            localFalecimento: 'Hospital Santa Casa',
            municipioFalecimento: 'Goiânia',
            ufFalecimento: 'GO',
            causaMorte: ['Insuficiência respiratória', 'Pneumonia bacteriana'],
            medico: {
                nome: 'Dr. Carlos Andrade',
                documento: 'CRM/GO 12345'
            },
            localSepultamento: 'Cemitério Jardim das Palmeiras',
            municipioSepultamento: 'Goiânia',
            ufSepultamento: 'GO',
            dataRegistro: '2025-07-21',
            declarante: 'Fernanda Almeida (Filha)',
            bens: 'Sim, a inventariar.',
            filhos: [
                { nome: 'Fernanda Almeida', idade: '45' },
                { nome: 'Ricardo Almeida', idade: '42' }
            ],
            genitores: [
                { nome: 'João Almeida' },
                { nome: 'Catarina Pires de Almeida' }
            ],
            anotacoesAverbacoes: 'Nenhuma.',
            anotacoesCadastro: null,
        }
    },
    // --- DADOS PARA LIVRO E ---
    {
        protocolo: '2023-E-11111',
        termo: '203',
        livro: 'E-01',
        folha: '45',
        tipoAto: 'Livro E',
        nomePrincipal: 'Interdição de Maria Abadia',
        matricula: '111111 01 55 2023 4 00001 045 0000203 50',
        dadosCompletos: {
            tipoAtoLivroE: 'Interdição',
            interditado: {
                nome: 'Maria Abadia da Conceição',
                cpf: '123.456.789-00'
            },
            curador: {
                nome: 'João da Conceição (Filho)'
            },
            dataSentenca: '2023-10-05',
            juizo: 'Vara de Família e Sucessões da Comarca de Trindade - GO',
            anotacoesAverbacoes: 'Curatela provisória convertida em definitiva.'
        }
    },
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

export const averbacaoPorAto: Record<string, AverbacaoOption[]> = {
    Nascimento: [
        { id: 1, tipo_ato: 3004, titulo_servico: 'Averbação de Reconhecimento de Paternidade/Maternidade' },
        { id: 2, tipo_ato: 3001, titulo_servico: 'Averbação de Alteração de Nome (Ex: Inclusão de sobrenome familiar)' },
        { id: 3, tipo_ato: null, titulo_servico: 'Averbação de Retificação de Registro (Correção de erros)' },
        { id: 4, tipo_ato: 2993, titulo_servico: 'Averbação de Adoção' },
        { id: 5, tipo_ato: 3001, titulo_servico: 'Averbação de Perda ou Suspensão do Poder Familiar' },
        { id: 6, tipo_ato: null, titulo_servico: 'Averbação de Tutela ou Guarda' },
        { id: 7, tipo_ato: 3005, titulo_servico: 'Averbação de Casamento' },
        { id: 8, tipo_ato: 3001, titulo_servico: 'Averbação de Divórcio ou Separação' },
        { id: 9, tipo_ato: null, titulo_servico: 'Averbação de Óbito' },
    ],
    Casamento: [
        { id: 10, tipo_ato: 3004, titulo_servico: 'Averbação de Separação Judicial ou Divórcio' },
        { id: 11, tipo_ato: 3004, titulo_servico: 'Averbação de Nulidade ou Anulação de Casamento' },
        { id: 12, tipo_ato: 3004, titulo_servico: 'Averbação de Restabelecimento da Sociedade Conjugal' },
        { id: 13, tipo_ato: 3004, titulo_servico: 'Averbação de Alteração de Regime de Bens' },
        { id: 14, tipo_ato: 3004, titulo_servico: 'Averbação de Retificação de Registro (Correção de erros)' },
        { id: 15, tipo_ato: 3004, titulo_servico: 'Averbação de Óbito de um dos Cônjuges' },
    ],
    Óbito: [
        { id: 16, tipo_ato: 3004, titulo_servico: 'Averbação de Retificação de Registro (Correção de erros)' },
        { id: 17, tipo_ato: 3004, titulo_servico: 'Averbação de Cancelamento de Registro (Ex: Morte presumida e posterior aparecimento)' },
        { id: 18, tipo_ato: 3004, titulo_servico: 'Averbação para constar local de sepultamento' },
        { id: 19, tipo_ato: 3004, titulo_servico: 'Averbação para constar a existência de testamento' },
    ],
    Natimorto: [
        // Averbações em registro de natimorto são raras, mas a retificação é sempre possível.
        { id: 20, tipo_ato: 3004, titulo_servico: 'Averbação de Retificação de Registro (Correção de erros)' },
    ],
    'Livro E': [
        // Averbações no Livro E são específicas para cada ato registrado.
        { id: 21, tipo_ato: 3004, titulo_servico: 'Averbação de Levantamento/Cancelamento de Interdição' },
        { id: 22, tipo_ato: 3004, titulo_servico: 'Averbação de Substituição de Curador' },
        { id: 23, tipo_ato: 3004, titulo_servico: 'Averbação de Cessação ou Revogação de Emancipação' },
        { id: 24, tipo_ato: 3004, titulo_servico: 'Averbação de Dissolução de União Estável' },
        { id: 25, tipo_ato: 3004, titulo_servico: 'Averbação de Levantamento/Cancelamento de Tutela ou Guarda' },
        { id: 26, tipo_ato: 3004, titulo_servico: 'Averbação de Retificação de Registro' },
    ],
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