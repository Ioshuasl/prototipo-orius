import { type IPessoaFisica, type IPessoaJuridica, type CertidaoOption, type AverbacaoOption, type TPessoaTipo, type IPermissao, type ICargo, type IUsuario, type ILogAtividade, type ITemplate, type CertidaoTemplate, type AverbacaoTemplate, type ReciboTemplate, type ISeloAvulsoFormData } from "../types";
import { certidaoCasamentoHTML, certidaoInteiroTeorHTML, certidaoNascimentoHTML, certidaoObitoHTML } from '../Certidao/ModeloCertidao/templates';

export const ufs = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];
export const regimesDeBens = ['Comunhão Parcial de Bens', 'Comunhão Universal de Bens', 'Separação Total de Bens', 'Separação Obrigatória de Bens', 'Participação Final nos Aquestos', 'Não se aplica'];
export const nacionalidades = ['Brasileira', 'Estrangeira'];
export const livrosDisponiveis = ['A-101', 'A-102', 'A-103 (Especial)', 'B-05'];
export const tiposLogradouro = ['Rua', 'Avenida', 'Praça', 'Travessa', 'Alameda', 'Estrada', 'Rodovia', 'Viela', 'Largo', 'Quadra'];
export const mockPessoDatabase: { [key: string]: Omit<IPessoaFisica, 'endereco'> } = {
    "11111111111": { tipo: 'fisica', nome: "Fulano de Tal da Silva", cpf: "111.111.111-11", dataNascimento: "1990-01-15", docIdentidadeTipo: "RG", docIdentidadeNum: "1234567", estadoCivil: "Solteiro(a)", regimeBens: "", profissao: "Engenheiro(a)", nacionalidade: "Brasileira", naturalidadeCidade: "São Paulo", naturalidadeUF: "SP", nomePai: "Pai do Fulano", nomeMae: "Mãe do Fulano" },
    "22222222222": { tipo: 'fisica', nome: "Ciclana de Souza Oliveira", cpf: "222.222.222-22", dataNascimento: "1992-05-20", docIdentidadeTipo: "CNH", docIdentidadeNum: "9876543", estadoCivil: "Solteiro(a)", regimeBens: "", profissao: "Advogada", nacionalidade: "Brasileira", naturalidadeCidade: "Rio de Janeiro", naturalidadeUF: "RJ", nomePai: "Pai da Ciclana", nomeMae: "Mãe da Ciclana" }
};

export const mockPessoasCadastradas: TPessoaTipo[] = [
    {
        tipo: 'fisica',
        nome: "Helena da Silva Santos",
        cpf: "11122233344",
        dataNascimento: "1990-01-15",
        docIdentidadeTipo: "RG",
        docIdentidadeNum: "1234567",
        profissao: "Engenheira",
        nacionalidade: "Brasileira",
        naturalidadeCidade: "Goiânia",
        naturalidadeUF: "GO",
        endereco: { cep: '74000-001', tipoLogradouro: 'Rua', logradouro: 'Rua das Flores', numero: '123', bairro: 'Centro', cidade: 'Goiânia', uf: 'GO' }
    },
    {
        tipo: 'juridica',
        razaoSocial: "Construtora Alfa Ltda.",
        nomeFantasia: "Alfa Construções",
        cnpj: "11222333000144",
        socioAdministrativo: "Arthur Pereira Rocha",
        endereco: { cep: '74000-002', tipoLogradouro: 'Avenida', logradouro: 'Avenida Anhanguera', numero: '456', bairro: 'Setor Sul', cidade: 'Goiânia', uf: 'GO' }
    },
    {
        tipo: 'fisica',
        nome: "Arthur Pereira Rocha",
        cpf: "44455566677",
        dataNascimento: "1985-05-20",
        docIdentidadeTipo: "CNH",
        docIdentidadeNum: "9876543",
        profissao: "Empresário",
        nacionalidade: "Brasileira",
        naturalidadeCidade: "Rio de Janeiro",
        naturalidadeUF: "RJ",
        endereco: { cep: '20000-001', tipoLogradouro: 'Rua', logradouro: 'Rua da Passagem', numero: '789', bairro: 'Botafogo', cidade: 'Rio de Janeiro', uf: 'RJ' }
    },
    {
        tipo: 'juridica',
        razaoSocial: "Software Solutions S.A.",
        cnpj: "55666777000188",
        nomeFantasia: "SoftSol",
        endereco: { cep: '01000-001', tipoLogradouro: 'Avenida', logradouro: 'Avenida Paulista', numero: '1000', bairro: 'Bela Vista', cidade: 'São Paulo', uf: 'SP' }
    },
    // Adicionando mais dados para teste de paginação e filtros
    ...Array.from({ length: 20 }, (_, i) => ({
        tipo: i % 2 === 0 ? 'fisica' : 'juridica',
        nome: `Pessoa Física Teste ${i + 1}`,
        razaoSocial: `Empresa Teste ${i + 1} S.A.`,
        cpf: `1234567${String(i).padStart(2, '0')}-00`,
        cnpj: `123456780001-${String(i).padStart(2, '0')}`,
        dataNascimento: '2000-01-01',
        profissao: 'Analista',
        nacionalidade: 'Brasileira',
        naturalidadeCidade: 'Curitiba',
        naturalidadeUF: 'PR',
        endereco: { cep: `80000-00${i}`, tipoLogradouro: 'Rua', logradouro: `Rua de Teste, ${i + 1}`, numero: `${i + 1}`, bairro: 'Centro', cidade: 'Curitiba', uf: 'PR' }
    } as IPessoaFisica | IPessoaJuridica))
];

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

export const mockPermissoes: IPermissao[] = [
    // Módulo de Pessoas
    { chave: 'pessoas:visualizar', nome: 'Visualizar Pessoas', modulo: 'Gerenciamento de Pessoas' },
    { chave: 'pessoas:criar', nome: 'Criar/Editar Pessoas', modulo: 'Gerenciamento de Pessoas' },

    // Módulo de Atos Civis
    { chave: 'atos:nascimento:criar', nome: 'Criar Registro de Nascimento', modulo: 'Registros Civis' },
    { chave: 'atos:casamento:criar', nome: 'Criar Registro de Casamento', modulo: 'Registros Civis' },
    { chave: 'atos:obito:criar', nome: 'Criar Registro de Óbito', modulo: 'Registros Civis' },
    { chave: 'atos:livro-e:criar', nome: 'Criar Registro do Livro E', modulo: 'Registros Civis' },
    { chave: 'atos:certidao:emitir', nome: 'Emitir Certidões', modulo: 'Registros Civis' },

    // Módulo de Administração
    { chave: 'admin:usuarios:visualizar', nome: 'Visualizar Usuários', modulo: 'Administração do Sistema' },
    { chave: 'admin:usuarios:gerenciar', nome: 'Criar/Editar/Excluir Usuários', modulo: 'Administração do Sistema' },
    { chave: 'admin:cargos:visualizar', nome: 'Visualizar Cargos e Permissões', modulo: 'Administração do Sistema' },
    { chave: 'admin:cargos:gerenciar', nome: 'Criar/Editar/Excluir Cargos', modulo: 'Administração do Sistema' },
];

// Lista de cargos já existentes
export const mockCargos: ICargo[] = [
    {
        id: 1,
        nome: 'Administrador',
        descricao: 'Acesso total a todas as funcionalidades do sistema.',
        permissoes: mockPermissoes.map(p => p.chave), // Todas as permissões
    },
    {
        id: 2,
        nome: 'Escrevente Chefe',
        descricao: 'Gerencia todos os atos civis e pode gerenciar pessoas.',
        permissoes: [
            'pessoas:visualizar', 'pessoas:criar',
            'atos:nascimento:criar', 'atos:casamento:criar', 'atos:obito:criar',
            'atos:livro-e:criar', 'atos:certidao:emitir'
        ],
    },
    {
        id: 3,
        nome: 'Escrevente Auxiliar',
        descricao: 'Apenas visualiza e emite certidões dos atos existentes.',
        permissoes: ['pessoas:visualizar', 'atos:certidao:emitir'],
    },
];

export const mockUsuarios: IUsuario[] = [
    {
        id: 101,
        nome: 'Alice Admin',
        email: 'alice.admin@cartorio.com',
        cargoId: 1, // Administrador
        status: 'Ativo',
        senha: '123456'
    },
    {
        id: 102,
        nome: 'Bruno Chefe',
        email: 'bruno.chefe@cartorio.com',
        cargoId: 2, // Escrevente Chefe
        status: 'Ativo',
        senha: '12345'
    },
    {
        id: 103,
        nome: 'Carla Auxiliar',
        email: 'carla.aux@cartorio.com',
        cargoId: 3, // Escrevente Auxiliar
        status: 'Ativo',
        senha: '1234'
    },
    {
        id: 104,
        nome: 'Daniel Inativo',
        email: 'daniel.inativo@cartorio.com',
        cargoId: 3, // Escrevente Auxiliar
        status: 'Inativo',
        senha: '123'
    },
];

export const mockLogsDatabase: ILogAtividade[] = [
    { id: 1, userId: 101, dataHora: '2025-07-30 14:20:15', acao: 'LOGIN', detalhes: 'Login bem-sucedido a partir do IP 187.55.12.1' },
    { id: 2, userId: 102, dataHora: '2025-07-30 10:05:40', acao: 'CRIAÇÃO DE ATO', detalhes: 'Criou o registro de nascimento, protocolo N-12345.' },
    { id: 3, userId: 102, dataHora: '2025-07-30 09:30:11', acao: 'LOGIN', detalhes: 'Login bem-sucedido a partir do IP 200.10.20.30' },
    { id: 4, userId: 101, dataHora: '2025-07-29 18:00:00', acao: 'ATUALIZAÇÃO DE CARGO', detalhes: 'Editou as permissões do cargo "Escrevente Auxiliar".' },

    // NOVOS DADOS ADICIONADOS CONFORME SOLICITADO
    { 
        id: 5, 
        userId: 102, // Bruno Chefe
        dataHora: '2025-08-01 09:15:00', 
        acao: 'LAVROU_ATO', 
        detalhes: 'Lavrou o ato de Casamento, protocolo 2024-C-67890.' 
    },
    { 
        id: 6, 
        userId: 102, // Bruno Chefe
        dataHora: '2025-08-01 09:45:30', 
        acao: 'ALTEROU_ATO', 
        detalhes: 'Alterou dados (anotações) no registro de Óbito, protocolo 2025-O-54321.' 
    },
    { 
        id: 7, 
        userId: 103, // Carla Auxiliar
        dataHora: '2025-08-01 10:30:00', 
        acao: 'EMITIU_CERTIDAO', 
        detalhes: 'Emitiu certidão de 2ª via de Nascimento para o protocolo 2025-N-12345.' 
    },
    { 
        id: 8, 
        userId: 102, // Bruno Chefe
        dataHora: '2025-08-01 11:05:10', 
        acao: 'IMPRIMIU_LIVRO_PROTOCOLO', 
        detalhes: 'Imprimiu o Livro de Protocolo com filtros: Data de 2025-07-15 a 2025-07-21.' 
    },
    { 
        id: 9, 
        userId: 103, // Carla Auxiliar
        dataHora: '2025-08-01 14:22:00', 
        acao: 'EMITIU_SELO_AVULSO', 
        detalhes: 'Finalizou a solicitação de selo avulso, protocolo SA-2025-00103 (Apostilamento de Haia).' 
    },
    { 
        id: 10, 
        userId: 101, // Alice Admin
        dataHora: '2025-08-01 15:00:00', 
        acao: 'ALTEROU_TEMPLATE_CABECALHO', 
        detalhes: 'Modificou o template de cabeçalho "Cabeçalho Padrão com Brasão" (ID: 1).' 
    },
    { 
        id: 11, 
        userId: 101, // Alice Admin
        dataHora: '2025-08-01 15:10:25', 
        acao: 'ALTEROU_TEMPLATE_RODAPE', 
        detalhes: 'Modificou o template de rodapé "Rodapé Padrão com Endereço" (ID: 3).' 
    },
    { 
        id: 12, 
        userId: 101, // Alice Admin
        dataHora: '2025-08-01 16:00:00', 
        acao: 'ALTEROU_CONFIG_AVERBACAO', 
        detalhes: 'Modificou o modelo de averbação "Divórcio Consensual (Padrão)" (ID: AVRB-CAS-001).' 
    },
    { 
        id: 13, 
        userId: 101, // Alice Admin
        dataHora: '2025-08-01 16:30:00', 
        acao: 'ALTEROU_CONFIG_CERTIDAO', 
        detalhes: 'Modificou o modelo de certidão "Certidão de Casamento - Segunda Via" (ID: CERT-CAS-001).' 
    },
    { 
        id: 14, 
        userId: 101, // Alice Admin
        dataHora: '2025-08-01 17:00:00', 
        acao: 'ALTEROU_DADOS_SERVENTIA', 
        detalhes: 'Alterou os dados da serventia (CNS, Endereço e CEP).'
    }
];

export const mockHeaderFooterTemplates: ITemplate[] = [
    {
        id: 1,
        nome: 'Cabeçalho Padrão com Brasão',
        tipo: 'cabecalho',
        conteudo: `<div style="text-align: center; padding-bottom: 5px;"><img src="https://www.gov.br/planalto/pt-br/conheca-a-presidencia/acervo/simbolos-nacionais/brasao-da-republica/brasao.png" alt="Brasão da República" width="50" /><p style="margin: 0; font-size: 10pt;"><strong>REPÚBLICA FEDERATIVA DO BRASIL</strong><br/>ESTADO DE GOIÁS</p></div>`,
        isPadrao: true,
        dataModificacao: '2025-07-25',
    },
    {
        id: 2,
        nome: 'Cabeçalho Simplificado',
        tipo: 'cabecalho',
        conteudo: `<div style="text-align: center; padding-bottom: 5px;"><p style="margin: 0; font-size: 12pt;"><strong>CARTÓRIO DE REGISTRO CIVIL</strong><br/>Comarca de Goiânia</p></div>`,
        isPadrao: false,
        dataModificacao: '2025-07-20',
    },
    {
        id: 3,
        nome: 'Rodapé Padrão com Endereço',
        tipo: 'rodape',
        conteudo: `<div style="text-align: center; border-top: 1px solid #000; padding-top: 5px; font-size: 9pt;"><p style="margin: 0;">Av. Anhanguera, Qd. 1, Lt. 2, Centro - Goiânia, GO - CEP: 74013-010</p><p style="margin: 0;">Página {{numero_pagina}}</p></div>`,
        isPadrao: true,
        dataModificacao: '2025-07-28',
    },
    {
        id: 4,
        nome: 'Rodapé Apenas com Selo',
        tipo: 'rodape',
        conteudo: `<div style="text-align: right; font-size: 10pt;"><p>Selo Digital: {{selo_digital}}</p></div>`,
        isPadrao: false,
        dataModificacao: '2025-06-15',
    }
];

export const mockCertidaoTemplates: CertidaoTemplate[] = [
    {
        id: "CERT-NASC-001",
        tipoAto: "Nascimento",
        titulo: "Certidão de Nascimento - Segunda Via",
        descricao: "Modelo padrão para emissão de segundas vias de certidões de nascimento.",
        id_selo: 3001,
        cabecalhoPadraoId: "CAB-001",
        rodapePadraoId: "ROD-001",
        conteudo: certidaoNascimentoHTML,
        margins: { top: '2.5', right: '2.5', bottom: '2.5', left: '2.5' },
        layout: { largura_mm: 210, altura_mm: 297 }
    },
    {
        id: "CERT-NASC-002",
        tipoAto: "Nascimento",
        titulo: "Certidão de Nascimento - Inteiro Teor",
        descricao: "Modelo completo com todas as informações e averbações do registro.",
        id_selo: 3004,
        cabecalhoPadraoId: "CAB-001",
        rodapePadraoId: "ROD-001",
        conteudo: certidaoInteiroTeorHTML,
        margins: { top: '2.5', right: '2.5', bottom: '2.5', left: '2.5' },
        layout: { largura_mm: 210, altura_mm: 297 }
    },
    {
        id: "CERT-CAS-001",
        tipoAto: "Casamento",
        titulo: "Certidão de Casamento - Segunda Via",
        descricao: "Modelo padrão para segundas vias de certidões de casamento.",
        id_selo: 3001,
        cabecalhoPadraoId: "CAB-001",
        rodapePadraoId: "ROD-001",
        conteudo: certidaoCasamentoHTML,
        margins: { top: '2.5', right: '2.5', bottom: '2.5', left: '2.5' },
        layout: { largura_mm: 210, altura_mm: 297 }
    },
    {
        id: "CERT-OBITO-001",
        tipoAto: "Óbito",
        titulo: "Certidão de Óbito - Padrão",
        descricao: "Modelo padrão para emissão de certidões de óbito.",
        id_selo: 3005,
        cabecalhoPadraoId: "CAB-001",
        rodapePadraoId: "ROD-001",
        conteudo: certidaoObitoHTML,
        margins: { top: '2.5', right: '2.5', bottom: '2.5', left: '2.5' },
        layout: { largura_mm: 210, altura_mm: 297 }
    },
];

export const mockAverbacaoTemplates: AverbacaoTemplate[] = [
    {
        id: "AVRB-NASC-001",
        tipoAto: "Nascimento",
        averbacaoOptionId: 1,
        titulo: "Reconhecimento de Paternidade (Padrão)",
        descricao: "Modelo padrão para averbar o reconhecimento de paternidade/maternidade em registros de nascimento.",
        id_selo: 2999, // Averbação de Retificação, de separação, de divórcio, etc.
        cabecalhoPadraoId: null,
        rodapePadraoId: null,
        conteudo: "<p>Texto padrão para reconhecimento de paternidade...</p>",
        margins: { top: '2.5', right: '2.5', bottom: '2.5', left: '2.5' },
        layout: { largura_mm: 210, altura_mm: 150 }
    },
    {
        id: "AVRB-NASC-002",
        tipoAto: "Nascimento",
        averbacaoOptionId: 4,
        titulo: "Adoção Simples (Sentença Judicial)",
        descricao: "Modelo para averbação de adoção com base em sentença judicial.",
        id_selo: 2997, // Registro de adoção e de emancipação...
        cabecalhoPadraoId: null,
        rodapePadraoId: null,
        conteudo: "<p>Modelo para averbação de adoção...</p>",
        margins: { top: '2.5', right: '2.5', bottom: '2.5', left: '2.5' },
        layout: { largura_mm: 210, altura_mm: 150 }
    },
    {
        id: "AVRB-CAS-001",
        tipoAto: "Casamento",
        averbacaoOptionId: 10,
        titulo: "Divórcio Consensual (Padrão)",
        descricao: "Modelo padrão para averbação de divórcio em registros de casamento.",
        id_selo: 2999, // Averbação de Retificação, de separação, de divórcio, etc.
        cabecalhoPadraoId: null,
        rodapePadraoId: null,
        conteudo: "<p>Texto padrão para averbação de divórcio...</p>",
        margins: { top: '2.5', right: '2.5', bottom: '2.5', left: '2.5' },
        layout: { largura_mm: 210, altura_mm: 150 }
    },
];

export const mockReciboTemplates: ReciboTemplate[] = [
    {
        id: 'REC-1',
        titulo: 'Recibo Padrão - 2ª Via de Nascimento',
        descricao: 'Modelo de recibo para emissão de segundas vias de certidões de nascimento.',
        tipoRecibo: 'Segunda Via',
        id_selo: 1001,
        cabecalhoPadraoId: 'CAB-1',
        rodapePadraoId: 'ROD-1',
        conteudo: '<p>Recibo referente à segunda via da certidão de nascimento de {{ NOME_REGISTRADO }}.</p>',
        margins: { top: '2.0', right: '2.0', bottom: '2.0', left: '2.0' },
        layout: { largura_mm: 210, altura_mm: 148 } // Tamanho A5
    },
    {
        id: 'REC-2',
        titulo: 'Recibo para Averbação de Divórcio',
        descricao: 'Recibo específico para os emolumentos cobrados na averbação de divórcio.',
        tipoRecibo: 'Averbação',
        id_selo: 2050,
        cabecalhoPadraoId: 'CAB-1',
        rodapePadraoId: null,
        conteudo: '<p>Recibo dos serviços de averbação de divórcio na matrícula {{ MATRICULA_CERTIDAO }}.</p>',
        margins: { top: '2.0', right: '2.0', bottom: '2.0', left: '2.0' },
        layout: { largura_mm: 210, altura_mm: 148 } // Tamanho A5
    },
    {
        id: 'REC-3',
        titulo: 'Recibo - 2ª Via de Casamento',
        descricao: 'Modelo de recibo para emissão de segundas vias de certidões de casamento.',
        tipoRecibo: 'Segunda Via',
        id_selo: 1002,
        cabecalhoPadraoId: 'CAB-1',
        rodapePadraoId: 'ROD-1',
        conteudo: '<p>Recibo referente à segunda via da certidão de casamento de {{ NOME_REGISTRADO }}.</p>',
        margins: { top: '2.0', right: '2.0', bottom: '2.0', left: '2.0' },
        layout: { largura_mm: 210, altura_mm: 148 } // Tamanho A5
    },
     {
        id: 'REC-4',
        titulo: 'Recibo para Busca de Registro',
        descricao: 'Recibo para o serviço de busca de registros nos livros do cartório.',
        tipoRecibo: 'Busca de Registro',
        id_selo: 4001,
        cabecalhoPadraoId: 'CAB-1',
        rodapePadraoId: 'ROD-1',
        conteudo: '<p>Recibo referente ao serviço de busca de atos de registro civil.</p>',
        margins: { top: '2.0', right: '2.0', bottom: '2.0', left: '2.0' },
        layout: { largura_mm: 210, altura_mm: 148 } // Tamanho A5
    }
];


export const mockSelosAvulsos: ISeloAvulsoFormData[] = [
    {
        protocolo: 'SA-2025-00101',
        dataSolicitacao: '2025-07-28',
        status: 'Finalizado',
        requerente: {
            tipo: 'fisica',
            nome: 'Carlos Mendes de Oliveira',
            cpf: '123.456.789-00',
        },
        referenciaAto: {
            nomePartePrincipal: 'Carlos Mendes de Oliveira e Juliana Paes de Almeida',
            tipoAto: 'Casamento',
            dataRegistro: '2010-05-15',
        },
        selosSolicitados: [
            {
                id: 1,
                id_selo: 2999,
                descricao: 'Averbação de Divórcio',
                quantidade: 1,
                valorUnitario: 181.21,
                valorTotal: 181.21,
                numeroSeloGerado: '03132412025883621400123',
            }
        ],
        observacaoGeral: 'Referente à averbação de divórcio consensual conforme sentença.',
        valores: {
            emolumentos: 181.21,
            fundos: 0.00, 
            taxas: 0.00, 
            total: 181.21,
        },
        pagamento: {
            metodo: 'pix',
            status: 'pago',
        },
    },
    {
        protocolo: 'SA-2025-00102',
        dataSolicitacao: '2025-07-29',
        status: 'Em Aberto',
        requerente: {
            tipo: 'juridica',
            razaoSocial: 'Construtora Alfa Ltda.',
            cnpj: '11.222.333/0001-44',
        },
        referenciaAto: {
            nomePartePrincipal: 'Contrato Social da Construtora Alfa Ltda.',
            tipoAto: 'Nascimento',
            dataRegistro: '2018-01-20',
        },
        selosSolicitados: [
            {
                id: 1,
                id_selo: 2430,
                descricao: 'Reconhecimento de Firma por Autenticidade',
                quantidade: 3,
                valorUnitario: 7.11, 
                valorTotal: 21.33,
            },
            {
                id: 2,
                id_selo: 2433,
                descricao: 'Autenticação de Cópia de Documento',
                quantidade: 5,
                valorUnitario: 5.32, 
                valorTotal: 26.60,
            }
        ],
        observacaoGeral: 'Reconhecimento de firma dos sócios e autenticação de cópias do contrato social e do alvará.',
        valores: {
            emolumentos: 47.93,
            fundos: 0.00,
            taxas: 0.00,
            total: 47.93,
        },
        pagamento: {
            metodo: '',
            status: 'pendente',
        },
    },
    {
        protocolo: 'SA-2025-00103',
        dataSolicitacao: '2025-07-30',
        status: 'Finalizado',
        requerente: {
            tipo: 'fisica',
            nome: 'Mariana Costa e Silva',
            cpf: '987.654.321-00',
        },
        referenciaAto: {
            nomePartePrincipal: 'Helena da Silva Santos',
            tipoAto: 'Nascimento',
            dataRegistro: '2025-03-18',
        },
        selosSolicitados: [
            {
                id: 1,
                // CORREÇÃO: id_selo alterado de 3006 para 3007 (Apostilamento no Registro Civil)
                id_selo: 3007,
                descricao: 'Apostilamento de Haia em Certidão de Nascimento',
                quantidade: 1,
                valorUnitario: 71.04, 
                valorTotal: 71.04,
                numeroSeloGerado: '03132412025883621400456',
            }
        ],
        observacaoGeral: 'Apostilamento para fins de dupla cidadania (Itália).',
        valores: {
            emolumentos: 71.04,
            fundos: 0.00,
            taxas: 0.00,
            total: 71.04,
        },
        pagamento: {
            metodo: 'credito',
            status: 'pago',
        },
    },
    {
        protocolo: 'SA-2025-00104',
        dataSolicitacao: '2025-07-31',
        status: 'Cancelado',
        requerente: {
            tipo: 'fisica',
            nome: 'Ricardo Pereira Gomes',
            cpf: '555.444.333-22',
        },
        referenciaAto: {
            nomePartePrincipal: 'Roberto Almeida',
            tipoAto: 'Óbito',
            dataRegistro: '2025-07-21',
        },
        selosSolicitados: [
            {
                id: 1,
                // CORREÇÃO: id_selo alterado de 4001 para 3072 (Busca em livros)
                id_selo: 3072,
                descricao: 'Busca de Registro de Óbito',
                quantidade: 1,
                valorUnitario: 17.77, 
                valorTotal: 17.77,
            }
        ],
        observacaoGeral: 'Pedido cancelado a pedido do solicitante. Informou que já localizou o registro em outra serventia.',
        valores: {
            emolumentos: 17.77,
            fundos: 0.00,
            taxas: 0.00,
            total: 17.77,
        },
        pagamento: {
            metodo: '',
            status: 'pendente',
        },
    }
];