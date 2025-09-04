import { type IEndereco, type IPessoaFisica, type IPessoaJuridica, type ITituloProtesto, type StatusTitulo } from "../types";

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
        id: 1, protocolo: '2025-00001', status: 'Prazo Aberto', dataApontamento: new Date('2025-09-02T10:00:00Z'), dataPrazoFinal: new Date('2025-09-05T23:59:59Z'),
        apresentante: ferragensXYZ, devedores: [carlosPereira], especieTitulo: 'Duplicata Mercantil', numeroTitulo: 'DM-101', valor: 1500.00, dataEmissao: new Date('2025-08-01'), dataVencimento: new Date('2025-08-15'),
        selos: ['SELO-A1B2C3D4'],
        banco: 341, tipoPagamento: 'POSTERIOR'
    },
    {
        id: 2, protocolo: '2025-00002', status: 'Protestado', dataApontamento: new Date('2025-08-28T11:30:00Z'),
        apresentante: bancoAlfa, devedores: [construtoraRocha], especieTitulo: 'Cédula de Crédito Bancário', numeroTitulo: 'CCB-202', valor: 25000.00, dataEmissao: new Date('2025-07-10'), dataVencimento: new Date('2025-08-10'),
        banco: 237, tipoPagamento: 'COMUM'
    },
    {
        id: 3, protocolo: '2025-00003', status: 'Pago', dataApontamento: new Date('2025-09-01T14:00:00Z'),
        apresentante: anaJuliaMarques, devedores: [ricardoMartins], especieTitulo: 'Cheque', numeroTitulo: '000123', valor: 550.75, dataEmissao: new Date('2025-08-20'), dataVencimento: new Date('2025-08-20'),
        valorPago: 580.25,
        banco: 104, tipoPagamento: 'POSTERIOR'
    },
    {
        id: 4, protocolo: '2025-00004', status: 'Aguardando Qualificação', dataApontamento: new Date(), tipoPagamento: 'COMUM',
        apresentante: distribuidoraJG, devedores: [fernandoCosta, marciaOliveira], especieTitulo: 'Nota Promissória', numeroTitulo: 'NP-303', valor: 980.00, dataEmissao: new Date('2025-08-15'), dataVencimento: new Date('2025-08-30')
    },
    {
        id: 5, protocolo: '2025-00005', status: 'Cancelado', dataApontamento: new Date('2025-07-15T09:00:00Z'), tipoPagamento: 'POSTERIOR',
        apresentante: bancoAlfa, devedores: [anaJuliaMarques], cedente: ferragensXYZ, especieTitulo: 'Contrato de Aluguel', numeroTitulo: 'CTR-404', valor: 2200.00, dataEmissao: new Date('2025-06-01'), dataVencimento: new Date('2025-07-05'),
        selos: ['SELO-E5F6G7H8', 'SELO-I9J0K1L2']
    },
    {
        id: 6, protocolo: '2025-00006', status: 'Retirado', dataApontamento: new Date('2025-09-03T09:15:00Z'), tipoPagamento: 'COMUM',
        apresentante: carlosPereira, devedores: [distribuidoraJG], especieTitulo: 'Duplicata de Serviço', numeroTitulo: 'DS-505', valor: 730.00, dataEmissao: new Date('2025-08-10'), dataVencimento: new Date('2025-08-25'),
        banco: 1
    },
    {
        id: 7, protocolo: '2025-00007', status: 'Aguardando Intimação', dataApontamento: new Date('2025-09-04T15:00:00Z'), dataPrazoFinal: new Date('2025-09-09T23:59:59Z'), tipoPagamento: 'DIFERIDO',
        apresentante: imobiliariaNorte, devedores: [ricardoMartins, anaJuliaMarques, lucasMendes], especieTitulo: 'Contrato de Locação', numeroTitulo: 'LOC-606', valor: 3500.00, dataEmissao: new Date('2025-07-01'), dataVencimento: new Date('2025-08-05')

    }
];

export const statusOptions: StatusTitulo[] = [
    'Aguardando Qualificação', 'Recusado', 'Aguardando Intimação', 'Prazo Aberto',
    'Pago', 'Retirado', 'Sustado Judicialmente', 'Protestado', 'Cancelado'
];

export const especieOptions = [...new Set(mockTitulosProtesto.map(t => t.especieTitulo))];