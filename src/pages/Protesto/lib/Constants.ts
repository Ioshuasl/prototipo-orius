import { type IEndereco, type IPessoaFisica, type IPessoaJuridica, type ITituloProtesto, type StatusTitulo, type ILivroDeProtesto } from "../types";

export const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
export const nextWeek = new Date(); nextWeek.setDate(nextWeek.getDate() + 7);

export const mockEndereco1: IEndereco = { cep: '74000-001', logradouro: 'Av. Anhanguera', numero: '123', bairro: 'Centro', cidade: 'Goiânia', uf: 'GO', complemento: 'Sala 10', tipoLogradouro: 'Avenida' };
export const mockEndereco2: IEndereco = { cep: '74000-002', logradouro: 'Rua 82', numero: '456', bairro: 'Setor Sul', cidade: 'Goiânia', uf: 'GO', complemento: '', tipoLogradouro: 'Rua' };
export const mockEndereco3: IEndereco = { cep: '74230-010', logradouro: 'Av. T-63', numero: '1296', bairro: 'Setor Bueno', cidade: 'Goiânia', uf: 'GO', complemento: 'Andar 5', tipoLogradouro: 'Avenida' };
export const mockEndereco4: IEndereco = { cep: '74823-450', logradouro: 'Alameda das Rosas', numero: '789', bairro: 'Setor Oeste', cidade: 'Goiânia', uf: 'GO', complemento: 'Casa', tipoLogradouro: 'Alameda' };

export const carlosPereira: IPessoaFisica = { tipo: 'fisica', nome: 'Carlos Pereira da Silva', cpf: '111.111.111-11', dataNascimento: '1985-05-20', docIdentidadeTipo: 'RG', docIdentidadeNum: '123456 SSP/GO', profissao: 'Engenheiro Civil', nacionalidade: 'Brasileira', naturalidadeCidade: 'Anápolis', naturalidadeUF: 'GO', endereco: mockEndereco2, estadoCivil: 'Casado(a)', sexo: 'Masculino' };
export const anaJuliaMarques: IPessoaFisica = { tipo: 'fisica', nome: 'Ana Julia Marques', cpf: '444.444.444-44', dataNascimento: '1990-11-15', docIdentidadeTipo: 'CNH', docIdentidadeNum: '01234567890', profissao: 'Advogada', nacionalidade: 'Brasileira', naturalidadeCidade: 'Goiânia', naturalidadeUF: 'GO', endereco: mockEndereco1, estadoCivil: 'Solteiro(a)', sexo: 'Feminino' };
export const ricardoMartins: IPessoaFisica = { tipo: 'fisica', nome: 'Ricardo Martins Andrade', cpf: '555.555.555-55', dataNascimento: '1978-01-30', docIdentidadeTipo: 'RG', docIdentidadeNum: '654321 SSP/DF', profissao: 'Comerciante', nacionalidade: 'Brasileira', naturalidadeCidade: 'Brasília', naturalidadeUF: 'DF', endereco: mockEndereco4, estadoCivil: 'Divorciado(a)', sexo: 'Masculino' };
export const fernandoCosta: IPessoaFisica = { tipo: 'fisica', nome: 'Fernando Costa', cpf: '777.777.777-77', dataNascimento: '1992-03-12', docIdentidadeTipo: 'RG', docIdentidadeNum: '789123 SSP/GO', profissao: 'Programador', nacionalidade: 'Brasileira', naturalidadeCidade: 'Rio Verde', naturalidadeUF: 'GO', endereco: mockEndereco2, estadoCivil: 'Solteiro(a)', sexo: 'Masculino' };
export const marciaOliveira: IPessoaFisica = { tipo: 'fisica', nome: 'Marcia Oliveira', cpf: '888.888.888-88', dataNascimento: '1993-07-22', docIdentidadeTipo: 'CNH', docIdentidadeNum: '09876543210', profissao: 'Arquiteta', nacionalidade: 'Brasileira', naturalidadeCidade: 'Goiânia', naturalidadeUF: 'GO', endereco: mockEndereco2, estadoCivil: 'União Estável', sexo: 'Feminino' };
export const lucasMendes: IPessoaFisica = { tipo: 'fisica', nome: 'Lucas Mendes', cpf: '999.999.999-99', dataNascimento: '1995-02-18', docIdentidadeTipo: 'RG', docIdentidadeNum: '112233 SSP/SP', profissao: 'Designer', nacionalidade: 'Brasileira', naturalidadeCidade: 'São Paulo', naturalidadeUF: 'SP', endereco: mockEndereco4, estadoCivil: 'Solteiro(a)', sexo: 'Masculino' };

export const ferragensXYZ: IPessoaJuridica = { tipo: 'juridica', razaoSocial: 'Comercial de Ferragens XYZ Ltda', cnpj: '11.111.111/0001-11', endereco: mockEndereco1, situacao_tributaria: 'Simples Nacional', nomeFantasia: 'Ferragista XYZ', qsa: [{ nome: 'João de Deus', qualificacao: 'Sócio-Administrador' }] };
export const bancoAlfa: IPessoaJuridica = { tipo: 'juridica', razaoSocial: 'Banco Alfa S/A', cnpj: '22.222.222/0001-22', endereco: mockEndereco3, situacao_tributaria: 'Outro', nomeFantasia: 'Banco Alfa', qsa: [{ nome: 'Maria Aparecida', qualificacao: 'Diretor Presidente' }] };
export const construtoraRocha: IPessoaJuridica = { tipo: 'juridica', razaoSocial: 'Construtora Rocha e Filhos Ltda - ME', cnpj: '33.333.333/0001-33', endereco: mockEndereco2, situacao_tributaria: 'Simples Nacional', nomeFantasia: 'Construtora Rocha', qsa: [{ nome: 'Pedro Rocha', qualificacao: 'Sócio-Administrador' }] };
export const distribuidoraJG: IPessoaJuridica = { tipo: 'juridica', razaoSocial: 'Distribuidora de Bebidas JG EIRELI', cnpj: '66.666.666/0001-66', endereco: mockEndereco3, situacao_tributaria: 'MEI', nomeFantasia: 'JG Bebidas', qsa: [{ nome: 'José Garcia', qualificacao: 'Titular Proprietário' }] };
export const imobiliariaNorte: IPessoaJuridica = { tipo: 'juridica', razaoSocial: 'Imobiliária Norte Sul Ltda', cnpj: '77.777.777/0001-77', endereco: mockEndereco1, situacao_tributaria: 'Outro', nomeFantasia: 'Norte Sul Imóveis', qsa: [{ nome: 'Mariana Rios', qualificacao: 'Sócia-Administradora' }] };


export const mockTitulosProtesto: ITituloProtesto[] = [
    {
        id: 1,
        protocolo: '2025-00001',
        isTituloAntigo: false,
        status: 'Protestado',
        dataPrazoFinal: new Date('2025-08-15'),
        apresentante: bancoAlfa,
        devedores: [carlosPereira],
        especieTitulo: 'Duplicata Mercantil',
        numeroTitulo: 'DM-101',
        valor: 1500.00,
        tipoPagamento: 'COMUM',
        dataEmissao: new Date('2025-08-01'),
        dataVencimento: new Date('2025-08-08'),
        banco: 341,
        apontamento: {
            dataApontamento: new Date('2025-08-10'),
            selosApontamento: [{ codigo: 3080, numeroselo: 'SELO-AP-ABC123' }]
        },
        intimacao: {
            data: new Date('2025-08-11'),
            meio: 'Postal',
            detalhes: 'AR123456789BR',
            selosIntimacao: [{ codigo: 3093, numeroselo: 'SELO-INT-DEF456' }]
        },
        protesto: {
            dataLavratura: new Date('2025-08-16'),
            motivo: 'Falta de Pagamento',
            livro: '10-B',
            folha: '125',
            selosProtesto: [{ codigo: 3088, numeroselo: 'SELO-PROT-GHI789' }]
        },
        historico: [
            { data: '2025-08-16T10:00:00Z', evento: 'Protesto lavrado no Livro 10-B, Folha 125.', usuario: 'escrevente.1' },
            { data: '2025-08-11T14:30:00Z', evento: 'Intimação via AR enviada ao devedor.', usuario: 'escrevente.1' },
            { data: '2025-08-10T09:15:00Z', evento: 'Título apontado e protocolado no sistema.', usuario: 'oficial.master' }
        ]
    },
    {
        id: 2,
        protocolo: '2025-00002',
        isTituloAntigo: false,
        status: 'Cancelado',
        apresentante: construtoraRocha,
        devedores: [anaJuliaMarques],
        especieTitulo: 'Cheque',
        numeroTitulo: '000123',
        valor: 550.75,
        tipoPagamento: 'COMUM',
        valorPago: 585.50,
        dataEmissao: new Date('2025-08-20'),
        dataVencimento: new Date('2025-08-20'),
        banco: 104,
        apontamento: {
            dataApontamento: new Date('2025-08-22')
        },
        intimacao: {
            data: new Date('2025-08-23'),
            meio: 'Pessoal',
            detalhes: 'Recebido por Ana Julia Marques',
        },
        protesto: {
            dataLavratura: new Date('2025-08-27'),
            motivo: 'Falta de Pagamento',
            livro: '10-B',
            folha: '128',
        },
        cancelamento: {
            data: new Date('2025-09-01'),
            motivo: 'Anuência do Credor',
            selosCancelamento: { codigo: 3094, numeroselo: 'SELO-CANC-JKL012' }
        },
        historico: [
            { data: '2025-09-01T11:05:00Z', evento: 'Protesto cancelado mediante apresentação de carta de anuência.', usuario: 'escrevente.2' },
            { data: '2025-08-27T09:00:00Z', evento: 'Protesto lavrado por falta de pagamento.', usuario: 'oficial.master' },
            { data: '2025-08-23T10:15:00Z', evento: 'Intimação pessoal realizada com sucesso.', usuario: 'mensageiro.1' },
            { data: '2025-08-22T15:00:00Z', evento: 'Título apontado no sistema.', usuario: 'escrevente.2' }
        ]
    },
    {
        id: 3,
        protocolo: '2025-00003',
        isTituloAntigo: false,
        status: 'Aguardando Qualificação',
        apresentante: imobiliariaNorte,
        devedores: [
            ricardoMartins,
            anaJuliaMarques,
            lucasMendes
        ],
        especieTitulo: 'Contrato de Locação',
        numeroTitulo: 'LOC-606',
        valor: 3500.00,
        tipoPagamento: 'COMUM',
        dataEmissao: new Date('2025-08-01'),
        dataVencimento: new Date('2025-09-05'),
        apontamento: {
            dataApontamento: new Date()
        },
        historico: [
            { data: new Date().toISOString(), evento: 'Rascunho do título criado no sistema.', usuario: 'usuario.atual' }
        ]
    },
    {
        id: 4,
        protocolo: '2025-00004',
        isTituloAntigo: false,
        status: 'Pago',
        apresentante: bancoAlfa,
        devedores: [construtoraRocha],
        especieTitulo: 'Cédula de Crédito Bancário',
        numeroTitulo: 'CCB-202',
        valor: 25000.00,
        tipoPagamento: 'DIFERIDO',
        dataEmissao: new Date('2025-07-10'),
        dataVencimento: new Date('2025-08-10'),
        banco: 237,
        apontamento: {
            dataApontamento: new Date('2025-08-12')
        },
        intimacao: {
            data: new Date('2025-08-13'),
            meio: 'Edital',
            detalhes: 'Publicado no jornal local, ed. 1024',
        },
        liquidacaoOuDesistencia: {
            data: new Date('2025-08-15'),
            tipo: 'LIQUIDACAO',
            seloLiquidacaoDesistencia: { codigo: 3107, numeroselo: 'SELO-LIQ-MNO345'}
        },
        historico: [
            { data: '2025-08-15T16:20:00Z', evento: 'Título liquidado pelo devedor no tabelionato.', usuario: 'caixa.1' },
            { data: '2025-08-13T08:00:00Z', evento: 'Edital de intimação publicado.', usuario: 'escrevente.1' },
            { data: '2025-08-12T10:30:00Z', evento: 'Título apontado com pagamento diferido por ordem judicial.', usuario: 'escrevente.1' }
        ]
    }
];

export const statusOptions: StatusTitulo[] = [
    'Aguardando Qualificação', 'Recusado', 'Aguardando Intimação', 'Prazo Aberto',
    'Pago', 'Retirado', 'Sustado Judicialmente', 'Protestado', 'Cancelado'
];

export const especieOptions = [...new Set(mockTitulosProtesto.map(t => t.especieTitulo))];

export const livrosDeProtestoSimulados: ILivroDeProtesto[] = [
    {
        id: 'PROTOCOLO-1',
        tipo: 'Livro de Protocolo',
        numero: 1,
        situacao: 'Fechado',
        quantidadeFolhas: 200,
        folhaAtual: 200
    },
    {
        id: 'PROTOCOLO-2',
        tipo: 'Livro de Protocolo',
        numero: 2,
        situacao: 'Aberto',
        quantidadeFolhas: 200,
        folhaAtual: 157
    },
    {
        id: 'PROTESTO-A-1',
        tipo: 'Livro de Protesto',
        numero: 1,
        situacao: 'Fechado',
        quantidadeFolhas: 200,
        folhaAtual: 200
    },
    {
        id: 'PROTESTO-A-2',
        tipo: 'Livro de Protesto',
        numero: 2,
        situacao: 'Fechado',
        quantidadeFolhas: 200,
        folhaAtual: 200
    },
    {
        id: 'PROTESTO-A-3',
        tipo: 'Livro de Protesto',
        numero: 3,
        situacao: 'Aberto',
        quantidadeFolhas: 200,
        folhaAtual: 88
    }
];