export interface IConfiguracaoCartorio {
    serventia: {
        nome: string;
        cns: string;
        cnpj: string;
        telefone: string;
        email: string;
        endereco: IEndereco;
    };
    oficial: {
        nome: string;
        funcao: string;
        subOficialNome?: string; // O '?' indica que o campo é opcional
        subOficialFuncao?: string;
    };
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
}

export type TPessoaTipo = IPessoaFisica | IPessoaJuridica;

export interface IAnexo {
    descricao: string;
    arquivo: File | null;
}

export interface IHistoricoEntry {
    data: string;
    evento: string;
    usuario: string;
}

export interface IDocumentoApresentado {
    descricao: string;
    arquivo: File | null;
    nomeArquivo?: string;
}

export interface INascimentoFormData {
    controleRegistro: { isLivroAntigo: boolean; dataRegistro: string; protocolo: string; dataLavratura: string; livro: string; folha: string; numeroTermo: string; };
    nascimento: { dnv: string; dataNascimento: string; horaNascimento: string; localNascimento: string; isGemeo: boolean; semAssistenciaMedica: boolean; };
    registrando: { prenome: string; sobrenome: string; sexo: 'Masculino' | 'Feminino' | ''; naturalidade: 'Local do Parto' | 'Residência da Mãe' | ''; cpf: string; };
    filiacao: { mae: IPessoaFisica; pai: IPessoaFisica; };
    declarante: Partial<TPessoaTipo>;
    testemunhas: IPessoaFisica[];
    documentosApresentados: IDocumentoApresentado[];
    historico: IHistoricoEntry[];
}

export interface IConjugeData extends IPessoaFisica {
    nomeAposCasamento: string;
}

interface IFilhoComum {
    nome: string;
    dataNascimento: string;
}

export interface ICasamentoFormData {
    controleRegistro: {
        isLivroAntigo: boolean;
        dataRegistro: string;
        protocolo: string;
        dataLavratura: string;
        livro: string;
        folha: string;
        numeroTermo: string;
    };
    conjuge1: IConjugeData;
    conjuge2: IConjugeData;
    filiacao: {
        paiConjuge1: IPessoaFisica;
        maeConjuge1: IPessoaFisica;
        paiConjuge2: IPessoaFisica;
        maeConjuge2: IPessoaFisica;
    };
    celebracao: {
        tipoCelebracao: 'Civil' | 'Religioso com Efeito Civil'; // NOVO CAMPO
        dataPublicacaoProclamas: string;
        dataCelebracao: string;
        local: 'Cartório' | 'Edifício Particular' | 'Religioso com Efeito Civil';
        juizDePaz: string;
        cultoReligioso?: string;
        celebranteReligioso?: string; // Será o "Nome do Celebrante"
        qualidadeCelebrante?: string;

    };
    testemunhas: IPessoaFisica[];
    regimeBens: {
        tipo: 'Comunhão Parcial de Bens' | 'Comunhão Universal de Bens' | 'Separação Total de Bens' | 'Participação Final nos Aquestos' | 'Separação Obrigatória de Bens';
        pactoAntenupcial: { data: string; serventia: string; livro: string; folha: string; } | null;
    };
    casosEspeciais: {
        // --- Já existentes ---
        isConversaoUniaoEstavel: boolean;
        dataInicioUniaoEstavel?: string;
        isPorProcuracao: boolean;
        conjuge1TemProcurador?: boolean;
        conjuge2TemProcurador?: boolean;
        procuradorConjuge1?: Partial<TPessoaTipo>;
        procuradorConjuge2?: Partial<TPessoaTipo>;
        conjuge1TeveCasamentoAnterior: boolean;
        conjuge2TeveCasamentoAnterior: boolean;
        infoCasamentoAnteriorConjuge1?: { nomePrecedente: string; dataDissolucao: string; };
        infoCasamentoAnteriorConjuge2?: { nomePrecedente: string; dataDissolucao: string; };
        temFilhosEmComum: boolean;
        filhosEmComum: IFilhoComum[];
        temNubenteEstrangeiro: boolean;
        documentosEstrangeiro?: { tipo: string; descricao: string }[];
        afastamentoCausaSuspensiva: boolean;
        justificativaAfastamentoCS?: string;
        dispensaProclamas: boolean;
        justificativaDispensaProclamas?: string;
        isMolestiaGrave: boolean;
        molestiaGraveComHabilitacao: boolean;
        isNuncupativo: boolean;
        mandadoNuncupativo?: { processo: string; juizo: string; };
        suprirOmissaoTermoReligioso: boolean;
        declaracaoSuprimento?: string;
        nubenteNaoAssina: boolean;
        nomeRogatario?: string;
        nubenteSurdoMudo: boolean;
        nomeInterpreteLibras?: string;
        nubenteNaoFalaPortugues: boolean;
        nomeTradutorPublico?: string;
        declaracaoDePobreza: boolean;
    };
    documentosApresentados: IDocumentoApresentado[];
    anexos: { [key: string]: File | null };
    historico: { data: string; evento: string; usuario: string; }[];
}

export interface IProcessoJudicial {
    numero: string;
    varaComarca: string;
    dataSentenca: string;
    juiz: string;
}

export interface IAutorizacaoCremacao {
    tipo: 'NaoAplicavel' | 'VontadePropria' | 'Familia';
    autorizacaoJudicial: string;
}

export interface INascimentoVerificado {
    status: 'NaoVerificado' | 'Registrado' | 'NaoRegistrado';
}

export interface IDadosAutoridade {
    nome: string;
    cargo: string;
    lotacao: string;
    cnpj: string;
}

export interface IFalecimentoInfo {
    dataFalecimento: string;
    horaFalecimento: string;
    localOcorrencia: 'Hospital' | 'Residência' | 'Via Pública' | 'Outro';
    enderecoOcorrencia: IEndereco;
    descricaoOutroLocal: string;
    tipoMorte: 'Natural' | 'Violenta';
    causaMorte: string;
    atestante1: string;
    atestante2?: string;
    destinacaoCorpo: 'Sepultamento' | 'Cremacao' | 'EstudoCientifico';
    localDestinacao: string; // Cemitério, crematório, etc.
    isAposSepultamento: boolean;
    fonteDeclaracao: 'Atestado Médico' | 'DeclaracaoTestemunhas';
    autorizacaoCremacao: IAutorizacaoCremacao;
}

// Estrutura para os documentos do falecido
export interface IDocumentacaoFalecido {
    numeroDO: string;
    pisPasep?: string;
    inscricaoInss?: string;
    beneficioInss?: string;
    cpf?: string;
    rg?: string;
    rgOrgaoEmissor?: string;
    tituloEleitor?: string;
    registroNascimentoCasamento?: string;
    carteiraTrabalho?: string;
    eraBeneficiarioInss: boolean;
}

export interface IFamiliaInfo {
    pai: Partial<IPessoaFisica>;
    mae: Partial<IPessoaFisica>;
    eraCasado: boolean;
    conjugeNome: string;
    eraViuvo: boolean;
    conjugePreFalecidoNome?: string;
    cartorioCasamento?: string;
    deixouFilhos: boolean;
    filhos: { nome: string; idade: string }[];
}

export interface IBensInfo {
    deixouBens: boolean;
    existemHerdeirosMenores: boolean;
    deixouTestamento: boolean;
    deixouPensionistas: boolean;
    infoTestamento?: string; // Para armazenar detalhes do testamento, se houver.
}

// Interface principal do formulário de óbito
export interface IObitoFormData {
    controleRegistro: {
        isLivroAntigo: boolean;
        dataRegistro: string;
        protocolo: string;
        dataLavratura: string;
        livro: string;
        folha: string;
        numeroTermo: string;
        // --- CAMPOS NOVOS/ATUALIZADOS ---
        naturezaRegistro: 'Comum' | 'Presumida' | 'Catastrofe';
        processoJudicial: IProcessoJudicial;
        justificativaRegistroTardio: string;
    };
    falecimento: IFalecimentoInfo;
    falecido: IPessoaFisica & {
        eraEleitor: boolean;
        idade: string;
        documentos: IDocumentacaoFalecido;
        // --- CAMPO NOVO ---
        nascimentoVerificado: INascimentoVerificado;
    };
    familia: IFamiliaInfo;
    bens: IBensInfo;
    declarante: Partial<TPessoaTipo> & {
        relacaoComFalecido: string;
        isAutoridade: boolean;
        tipoAutoridade: 'Policial' | 'InstituicaoDeEnsino' | '';
        dadosAutoridade: IDadosAutoridade;
    };
    documentosApresentados: IDocumentoApresentado[];
    anexos: { [key: string]: File | null };
    historico: IHistoricoEntry[];
}

export type RuleKey = "naturezaRegistro" | "registroTardio" | "fonteDeclaracao" | "cremacao" | "menorNaoRegistrado";

export interface INatimortoFormData {
    controleRegistro: {
        isLivroAntigo: boolean;
        dataRegistro: string;
        protocolo: string;
        dataLavratura: string;
        livro: string; // Será pré-selecionado como "Livro C-Auxiliar"
        folha: string;
        numeroTermo: string;
    };
    natimorto: {
        localDoFato: string;
        dataDoFato: string;
        horaDoFato: string;
        sexo: 'Masculino' | 'Feminino' | 'Ignorado' | '';
        nomeAtribuido: boolean;
        nomeCompleto?: string;
        partoDuplo: boolean;
        causaMorteFetal: string;
        medicoAtestante: string;
        numeroDO: string; // Número da Declaração de Óbito
    };
    filiacao: {
        mae: IPessoaFisica;
        pai: IPessoaFisica;
    };
    testemunhas: IPessoaFisica[]; // Exatamente duas testemunhas
    documentosApresentados: IDocumentoApresentado[];
    historico: IHistoricoEntry[];
}

//Livro E

export interface IDadosSentenca {
    dataSentenca: string;
    juizo: string; // Vara e Comarca
    nomeMagistrado: string;
    dataTransitoEmJulgado?: string;
}

export interface IDadosEscrituraPublica {
    dataEscritura: string;
    serventia: string;
    livro: string;
    folha: string;
}

export type TipoAtoLivroE =
    | ''
    | 'emancipacao'
    | 'interdicao'
    | 'ausencia'
    | 'mortePresumida'
    | 'uniaoEstavel'
    | 'opcaoNacionalidade'
    | 'tutela'
    | 'guarda'
    | 'nascimentoPaisEstrangeiros'
    | 'trasladoExterior';

export interface IEmancipacao {
    origem: 'sentenca' | 'escritura';
    dadosSentenca?: IDadosSentenca;
    dadosEscritura?: IDadosEscrituraPublica;
    emancipado: Partial<IPessoaFisica>;
    responsaveis: {
        nomePai?: string;
        nomeMae?: string;
        nomeTutor?: string;
    };
}

export interface IInterdicao {
    dadosSentenca: IDadosSentenca;
    interdito: Partial<IPessoaFisica>;
    curador: Partial<IPessoaFisica>;
    causaInterdicao: string;
    limitesCuratela: string;
}

export interface IAusencia {
    dadosSentenca: IDadosSentenca;
    ausente: Partial<IPessoaFisica>;
    curador: Partial<IPessoaFisica>;
    causaAusencia: string;
    limitesCuratela: string;
}

export interface IMortePresumida {
    dadosSentenca: IDadosSentenca;
    ausente: Partial<IPessoaFisica>;
    dataProvavelFalecimento: string;
}

export interface IUniaoEstavel {
    tipo: 'reconhecimento' | 'dissolucao';
    origem: 'sentenca' | 'escritura' | 'instrumentoParticular';
    dadosSentenca?: IDadosSentenca;
    dadosEscritura?: IDadosEscrituraPublica;
    dataInstrumentoParticular?: string;
    companheiro1: Partial<IPessoaFisica>;
    companheiro2: Partial<IPessoaFisica>;
    regimeBens: string;
    alteracaoNomeCompanheiro1: boolean;
    alteracaoNomeCompanheiro2: boolean;
}

export interface IOpcaoNacionalidade {
    dadosSentenca: IDadosSentenca;
    optante: Partial<IPessoaFisica>;
}

export interface ITutela {
    dadosSentenca: IDadosSentenca; // O mandado judicial deriva de uma sentença
    tutelado: Partial<IPessoaFisica>;
    tutor: Partial<IPessoaFisica>;
    limitacoesTutela?: string;
}

export interface IGuarda {
    dadosSentenca: IDadosSentenca; // O mandado judicial deriva de uma sentença
    menor: Partial<IPessoaFisica>;
    guardiao: Partial<IPessoaFisica>;
}

export interface ITrasladoNascimentoData {
    origemRegistro: 'consular' | 'estrangeiro';
    dadosNascimento: { // Dados do nascido
        nome: string;
        dataNascimento: string;
        localNascimento: string; // Cidade e país
        sexo: '' | 'Masculino' | 'Feminino' | 'Ignorado';
    };
    filiacao: {
        nomePai?: string;
        nacionalidadePai?: string;
        nomeMae?: string;
        nacionalidadeMae?: string;
    };
    observacaoObrigatoria: string; // Campo para a observação sobre opção de nacionalidade
}

export interface INascimentoPaisEstrangeiros {
    // A lei exige os mesmos dados de um nascimento comum,
    // então reutilizamos as estruturas do INascimentoFormData.
    nascimento: {
        dnv: string;
        dataNascimento: string;
        horaNascimento: string;
        localNascimento: string;
        isGemeo: boolean;
    };
    registrando: {
        prenome: string;
        sobrenome: string;
        sexo: 'Masculino' | 'Feminino' | '';
        naturalidade: string; // Diferente do nascimento comum, aqui é um campo de texto
        cpf: string;
    };
    filiacao: {
        mae: Partial<IPessoaFisica>;
        pai: Partial<IPessoaFisica>;
        avosPaternos: { nome: string };
        avosMaternos: { nome: string };
    };
    declarante: Partial<TPessoaTipo>;
    observacaoObrigatoria: string; // Campo para o texto exigido pela Constituição.
}

export interface ITrasladoCasamentoData {
    nubente1: Partial<IPessoaFisica>;
    nubente2: Partial<IPessoaFisica>;
    dataCasamento: string;
    localCasamento: string; // Cidade e país
    regimeBens: string;
    nomeAdotadoNubente1?: string;
    nomeAdotadoNubente2?: string;
    pactoAntenupcial: {
        apresentado: boolean;
        detalhes?: string; // Para info de registro em Títulos e Documentos
    };
    observacaoObrigatoria: string; // Para a anotação do Decreto-Lei
}

export interface IFilhoInfo {
    nome: string;
    idade: string;
}

export interface ITrasladoObitoData {
    falecido: Partial<IPessoaFisica>;
    dataObito: string;
    localObito: string; // Cidade e país
    causaMorte?: string;
    localSepultamento?: string; // Novo campo
    deixouBens: boolean;
    eraCasado: boolean;
    nomeConjuge?: string;
    deixouFilhos: boolean;
    filhos?: IFilhoInfo[]; // Novo campo para a lista de filhos
}

export interface ITrasladoExterior {
    tipoTraslado: "" | "nascimento" | "casamento" | "obito";
    requerente: Partial<IPessoaFisica>;
    dadosCertidaoOrigem: {
        tipo: '' | 'consular' | 'estrangeira';
        detalhes: string;
        serventia: string;
        dataEmissao: string;
        matriculaOuReferencia: string;
    };
    dadosAto: ITrasladoNascimentoData | ITrasladoCasamentoData | ITrasladoObitoData | null;
}

export interface ILivroEFormData {
    tipoAto: TipoAtoLivroE;
    controleRegistro: {
        isLivroAntigo: boolean;
        dataRegistro: string;
        protocolo: string;
        dataLavratura: string;
        livro: string; // Fixo como "Livro E"
        folha: string;
        numeroTermo: string;
    };
    dadosAto: {
        emancipacao?: IEmancipacao;
        interdicao?: IInterdicao;
        ausencia?: IAusencia;
        mortePresumida?: IMortePresumida;
        uniaoEstavel?: IUniaoEstavel;
        opcaoNacionalidade?: IOpcaoNacionalidade;
        tutela?: ITutela;
        guarda?: IGuarda;
        nascimentoPaisEstrangeiros?: INascimentoPaisEstrangeiros;
        trasladoExterior?: ITrasladoExterior;
    };
    documentosApresentados: IDocumentoApresentado[];
    historico: IHistoricoEntry[];
}

//interfaces e tipos para certidão

export type CertidaoStatus = 'Emitida' | 'Pendente' | 'Retirada' | 'Cancelada';
export type AtoOriginalTipo = 'Nascimento' | 'Casamento' | 'Óbito' | 'Natimorto' | 'Livro E'; 
export interface CertidaoRequest {
    id: number;
    protocolo: string;
    tipoAto: AtoOriginalTipo;
    tipoCertidao: string;
    formato: 'Física' | 'Digital';
    atoOriginal: {
        nomePrincipal: string;
        matricula: string;
    };
    solicitante: string;
    dataSolicitacao: string;
    dataEmissao?: string;
    status: CertidaoStatus;
}

export type CertidaoOption = {
    id: number;
    tipo_ato: number | null; // Chave (código do ato) para a tabela de emolumentos
    titulo_servico: string;    // Texto exibido para o usuário
};

export type AverbacaoOption = {
    id: number;
    tipo_ato: number | null; // Chave (código do ato) para a tabela de emolumentos
    titulo_servico: string;    // Texto exibido para o usuário
};

export type Etapa = 'SOLICITACAO' | 'EMISSAO' | 'PAGAMENTO';
export type StatusPedido = 'Montagem' | 'Solicitacao' | 'Emitido' | 'Pagamento Pendente' | 'Finalizado' | 'Cancelado';

export interface PedidoState {
    etapa: Etapa;
    status: StatusPedido;
    atoEncontrado: any | null;
    requerente: { tipo: 'fisica' | 'juridica'; nome?: string; cpf?: string; razaoSocial?: string; cnpj?: string; };
    configuracao: { tipoCertidao: number | ''; formato: 'Física (Papel de Segurança)' | 'Digital (PDF)'; valores: { emolumentos: number; fundos: number; taxas: number; total: number; }; };
    textoCertidao: string;
    textoCertidaoVerso: string;
    selo: string | null;
    pagamento: {
        metodo: 'dinheiro' | 'credito' | 'debito' | 'pix' | 'boleto' | 'caixa' | '';
        status: 'pendente' | 'pago';
        comprovante: File | null;
    };
    motivoCancelamento?: string;
}