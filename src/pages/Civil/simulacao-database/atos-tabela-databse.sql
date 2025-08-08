CREATE TABLE base_ato (
    id SERIAL PRIMARY KEY,
    is_livro_antigo BOOLEAN NOT NULL,
    data_registro DATE NOT NULL,
    protocolo VARCHAR(50) NOT NULL,
    data_lavratura DATE NOT NULL,
    livro VARCHAR(50) NOT NULL,
    folha VARCHAR(50) NOT NULL,
    numero_termo VARCHAR(50) NOT NULL,

    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ato_documento_apresentado (
    id SERIAL PRIMARY KEY,
    base_ato_id INTEGER NOT NULL REFERENCES base_ato(id) ON DELETE CASCADE,
    descricao VARCHAR(255) NOT NULL,
    nome_arquivo VARCHAR(255)
);

CREATE TABLE ato_historico (
    id SERIAL PRIMARY KEY,
    base_ato_id INTEGER NOT NULL REFERENCES base_ato(id) ON DELETE CASCADE,
    data TIMESTAMP NOT NULL,
    evento TEXT NOT NULL,
    usuario VARCHAR(100) NOT NULL
);


CREATE TABLE ato_testemunha (
    id SERIAL PRIMARY KEY,
    base_ato_id INTEGER NOT NULL REFERENCES base_ato(id) ON DELETE CASCADE,
    pessoa_id INTEGER NOT NULL REFERENCES pessoa_fisica(pessoa_id)
);

CREATE TABLE ato_filho_comum (
    id SERIAL PRIMARY KEY,
    base_ato_id INTEGER NOT NULL REFERENCES base_ato(id) ON DELETE CASCADE,
    pessoa_id INTEGER NOT NULL REFERENCES pessoa_fisica(pessoa_id),
    observacao TEXT
);

CREATE TABLE ato_procurador (
    id SERIAL PRIMARY KEY,
    base_ato_id INTEGER NOT NULL REFERENCES base_ato(id) ON DELETE CASCADE,
    procurador_id INTEGER NOT NULL REFERENCES pessoa_fisica(pessoa_id),
    representando_id INTEGER NOT NULL REFERENCES pessoa_fisica(pessoa_id),
    observacao TEXT
);

CREATE TABLE ato_nascimento (
    id SERIAL PRIMARY KEY,
    base_ato_id INTEGER NOT NULL REFERENCES base_ato(id) ON DELETE CASCADE,
    dnv VARCHAR(50) NOT NULL,
    data_nascimento DATE NOT NULL,
    hora_nascimento TIME NOT NULL,
    local_nascimento VARCHAR(100) NOT NULL,
    is_gemeo BOOLEAN NOT NULL,
    sem_assistencia_medica BOOLEAN NOT NULL,
    prenome_registrando VARCHAR(50) NOT NULL,
    sobrenome_registrando VARCHAR(50) NOT NULL,
    sexo_registrando ENUM('Masculino', 'Feminino', '') NOT NULL,
    naturalidade_registrando ENUM('Local do Parto', 'Residência da Mãe', '') NOT NULL,
    cpf_registrando VARCHAR(14) NOT NULL UNIQUE,
    mae_id INTEGER REFERENCES pessoa_fisica(pessoa_id),
    pai_id INTEGER REFERENCES pessoa_fisica(pessoa_id),
    declarante_id INTEGER REFERENCES pessoa(id)
);

CREATE TABLE ato_casamento (
    id SERIAL PRIMARY KEY,
    base_ato_id INTEGER NOT NULL REFERENCES base_ato(id) ON DELETE CASCADE,

    -- Conjuges
    conjuge1_id INTEGER NOT NULL REFERENCES pessoa_fisica(pessoa_id),
    conjuge2_id INTEGER NOT NULL REFERENCES pessoa_fisica(pessoa_id),
    nome_apos_casamento_conjuge1 VARCHAR(150),
    nome_apos_casamento_conjuge2 VARCHAR(150),

    -- Filiação
    pai_conjuge1_id INTEGER REFERENCES pessoa_fisica(pessoa_id),
    mae_conjuge1_id INTEGER REFERENCES pessoa_fisica(pessoa_id),
    pai_conjuge2_id INTEGER REFERENCES pessoa_fisica(pessoa_id),
    mae_conjuge2_id INTEGER REFERENCES pessoa_fisica(pessoa_id),

    -- Celebração
    tipo_celebracao ENUM('Civil', 'Religioso com Efeito Civil') NOT NULL,
    data_publicacao_proclamas DATE NOT NULL,
    data_celebracao DATE NOT NULL,
    local_celebracao ENUM('Cartório', 'Edifício Particular', 'Religioso com Efeito Civil') NOT NULL,
    juiz_de_paz VARCHAR(100),
    culto_religioso VARCHAR(100),
    celebrante_religioso VARCHAR(100),
    qualidade_celebrante VARCHAR(100),

    -- Regime de bens
    tipo_regime_bens ENUM(
        'Comunhão Parcial de Bens',
        'Comunhão Universal de Bens',
        'Separação Total de Bens',
        'Participação Final nos Aquestos',
        'Separação Obrigatória de Bens'
    ),
    pacto_data DATE,
    pacto_serventia VARCHAR(100),
    pacto_livro VARCHAR(50),
    pacto_folha VARCHAR(50),

    -- Casos especiais (booleanos e relacionamentos)
    is_conversao_uniao_estavel BOOLEAN NOT NULL,
    data_inicio_uniao_estavel DATE,
    is_por_procuracao BOOLEAN NOT NULL,
    conjuge1_tem_procurador BOOLEAN,
    conjuge2_tem_procurador BOOLEAN,
    conjuge1_teve_casamento_anterior BOOLEAN,
    conjuge2_teve_casamento_anterior BOOLEAN,
    nome_precedente_conjuge1 VARCHAR(100),
    data_dissolucao_conjuge1 DATE,
    nome_precedente_conjuge2 VARCHAR(100),
    data_dissolucao_conjuge2 DATE,
    tem_filhos_em_comum BOOLEAN,
    tem_nubente_estrangeiro BOOLEAN,
    afastamento_causa_suspensiva BOOLEAN,
    justificativa_afastamento_cs TEXT,
    dispensa_proclamas BOOLEAN,
    justificativa_dispensa_proclamas TEXT,
    is_molestia_grave BOOLEAN,
    molestia_grave_com_habilitacao BOOLEAN,
    is_nuncupativo BOOLEAN,
    processo_nuncupativo VARCHAR(100),
    juizo_nuncupativo VARCHAR(100),
    suprir_omissao_termo_religioso BOOLEAN,
    declaracao_suprimento TEXT,
    nubente_nao_assina BOOLEAN,
    nome_rogatario VARCHAR(100),
    nubente_surdo_mudo BOOLEAN,
    nome_interprete_libras VARCHAR(100),
    nubente_nao_fala_portugues BOOLEAN,
    nome_tradutor_publico VARCHAR(100),
    declaracao_de_pobreza BOOLEAN
);

CREATE TABLE processo_judicial (
    id SERIAL PRIMARY KEY,
    numero VARCHAR(50),
    vara_comarca VARCHAR(100),
    data_sentenca DATE,
    juiz VARCHAR(100)
);

CREATE TABLE falecimento (
    id SERIAL PRIMARY KEY,
    data_falecimento DATE NOT NULL,
    hora_falecimento TIME NOT NULL,
    local_ocorrencia VARCHAR(30) NOT NULL, -- Hospital | Residência | Via Pública | Outro
    endereco_id INTEGER NOT NULL REFERENCES endereco(id),
    descricao_outro_local TEXT,
    tipo_morte VARCHAR(20), -- Natural | Violenta
    causa_morte TEXT,
    atestante_1 VARCHAR(100),
    atestante_2 VARCHAR(100),
    destinacao_corpo VARCHAR(30), -- Sepultamento | Cremacao | EstudoCientifico
    local_destinacao TEXT,
    is_apos_sepultamento BOOLEAN,
    fonte_declaracao VARCHAR(50), -- Atestado Médico | DeclaracaoTestemunhas
    autorizacao_cremacao_id INTEGER REFERENCES autorizacao_cremacao(id)
);

CREATE TABLE autorizacao_cremacao (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR(20), -- NaoAplicavel | VontadePropria | Familia
    autorizacao_judicial TEXT
);

CREATE TABLE documentacao_falecido (
    id SERIAL PRIMARY KEY,
    falecido_id INTEGER UNIQUE REFERENCES pessoa_fisica(pessoa_id) ON DELETE CASCADE,
    numero_do VARCHAR(50),
    pis_pasep VARCHAR(20),
    inscricao_inss VARCHAR(20),
    beneficio_inss VARCHAR(20),
    cpf VARCHAR(14),
    rg VARCHAR(20),
    rg_orgao_emissor VARCHAR(50),
    titulo_eleitor VARCHAR(20),
    registro_nascimento_casamento VARCHAR(50),
    carteira_trabalho VARCHAR(20),
    era_beneficiario_inss BOOLEAN
);

CREATE TABLE obito_familia (
    id SERIAL PRIMARY KEY,
    pai_id INTEGER REFERENCES pessoa_fisica(pessoa_id),
    mae_id INTEGER REFERENCES pessoa_fisica(pessoa_id),
    era_casado BOOLEAN,
    conjuge_nome VARCHAR(255),
    era_viuvo BOOLEAN,
    conjuge_pre_falecido_nome VARCHAR(255),
    cartorio_casamento TEXT,
    deixou_filhos BOOLEAN
);

CREATE TABLE obito_familia_filhos (
    id SERIAL PRIMARY KEY,
    familia_id INTEGER NOT NULL REFERENCES obito_familia(id) ON DELETE CASCADE,
    nome VARCHAR(255),
    idade VARCHAR(10)
);

CREATE TABLE obito_declarante (
    id SERIAL PRIMARY KEY,
    pessoa_id INTEGER REFERENCES pessoa_fisica(pessoa_id), -- declarante pode ser parcial
    relacao_com_falecido VARCHAR(255),
    is_autoridade BOOLEAN,
    tipo_autoridade VARCHAR(50), -- Policial | InstituicaoDeEnsino | ''
    dados_autoridade_id INTEGER REFERENCES autoridade(id)
);

CREATE TABLE autoridade (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255),
    cargo VARCHAR(100),
    lotacao VARCHAR(100),
    cnpj VARCHAR(20)
);


CREATE TABLE ato_obito (
    id SERIAL PRIMARY KEY,
    base_ato_id INTEGER NOT NULL REFERENCES base_ato(id) ON DELETE CASCADE,
    natureza_registro VARCHAR(20) NOT NULL, -- Comum, Presumida, Catastrofe
    processo_judicial_id INTEGER REFERENCES processo_judicial(id),
    justificativa_registro_tardio TEXT,
    falecido_id INTEGER NOT NULL REFERENCES pessoa_fisica(pessoa_id),
    idade_falecido VARCHAR(10),
    era_eleitor BOOLEAN DEFAULT FALSE,
    nascimento_verificado VARCHAR(20), -- NaoVerificado | Registrado | NaoRegistrado
    falecimento_id INTEGER NOT NULL REFERENCES falecimento(id),
    familia_id INTEGER NOT NULL REFERENCES obito_familia(id),
    bens BOOLEAN NOT NULL,
    declarante_id INTEGER NOT NULL REFERENCES obito_declarante(id),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ato_natimorto_filiacao (
    id SERIAL PRIMARY KEY,
    natimorto_id INTEGER NOT NULL REFERENCES ato_natimorto(id) ON DELETE CASCADE,
    pessoa_id INTEGER NOT NULL REFERENCES pessoa_fisica(pessoa_id),
    tipo_filiacao ENUM('pai', 'mae') NOT NULL
);



CREATE TABLE ato_natimorto (
    id SERIAL PRIMARY KEY,
    base_ato_id INTEGER NOT NULL REFERENCES ato(id) ON DELETE CASCADE,
    local_do_fato TEXT NOT NULL,
    data_do_fato DATE NOT NULL,
    hora_do_fato TIME NOT NULL,
    sexo ENUM('Masculino', 'Feminino', 'Ignorado', '') NOT NULL,
    nome_atribuido BOOLEAN NOT NULL,
    nome_completo TEXT,
    parto_duplo BOOLEAN NOT NULL,
    causa_morte_fetal TEXT NOT NULL,
    medico_atestante TEXT NOT NULL,
    numero_do TEXT NOT NULL
);

CREATE TABLE ato_livro_e_emancipacao (
    id SERIAL PRIMARY KEY,
    ato_livro_e_id INTEGER NOT NULL UNIQUE REFERENCES ato_livro_e(id) ON DELETE CASCADE,
    origem TEXT NOT NULL CHECK (origem IN ('sentenca', 'escritura')),
    dados_sentenca_id INTEGER REFERENCES dados_sentenca(id),
    dados_escritura_id INTEGER REFERENCES dados_escritura_publica(id),
    emancipado_id INTEGER REFERENCES pessoa_fisica(pessoa_id),
    nome_pai TEXT,
    nome_mae TEXT,
    nome_tutor TEXT
);

CREATE TABLE ato_livro_e_interdicao (
    id SERIAL PRIMARY KEY,
    ato_livro_e_id INTEGER NOT NULL UNIQUE REFERENCES ato_livro_e(id) ON DELETE CASCADE,
    dados_sentenca_id INTEGER NOT NULL REFERENCES dados_sentenca(id),
    interdito_id INTEGER REFERENCES pessoa_fisica(pessoa_id),
    curador_id INTEGER REFERENCES pessoa_fisica(pessoa_id),
    causa_interdicao TEXT NOT NULL,
    limites_curatela TEXT NOT NULL
);

CREATE TABLE ato_livro_e_ausencia (
    id SERIAL PRIMARY KEY,
    ato_livro_e_id INTEGER NOT NULL UNIQUE REFERENCES ato_livro_e(id) ON DELETE CASCADE,
    dados_sentenca_id INTEGER NOT NULL REFERENCES dados_sentenca(id),
    ausente_id INTEGER REFERENCES pessoa_fisica(pessoa_id),
    curador_id INTEGER REFERENCES pessoa_fisica(pessoa_id),
    causa_ausencia TEXT NOT NULL,
    limites_curatela TEXT NOT NULL
);

CREATE TABLE ato_livro_e_morte_presumida (
    id SERIAL PRIMARY KEY,
    ato_livro_e_id INTEGER NOT NULL UNIQUE REFERENCES ato_livro_e(id) ON DELETE CASCADE,
    dados_sentenca_id INTEGER NOT NULL REFERENCES dados_sentenca(id),
    ausente_id INTEGER REFERENCES pessoa_fisica(pessoa_id),
    data_prob_falecimento DATE NOT NULL
);

CREATE TABLE ato_livro_e_opcao_nacionalidade (
    id SERIAL PRIMARY KEY,
    ato_livro_e_id INTEGER NOT NULL UNIQUE REFERENCES ato_livro_e(id) ON DELETE CASCADE,
    dados_sentenca_id INTEGER NOT NULL REFERENCES dados_sentenca(id),
    optante_id INTEGER REFERENCES pessoa_fisica(pessoa_id)
);

CREATE TABLE ato_livro_e_tutela (
    id SERIAL PRIMARY KEY,
    ato_livro_e_id INTEGER NOT NULL UNIQUE REFERENCES ato_livro_e(id) ON DELETE CASCADE,
    dados_sentenca_id INTEGER NOT NULL REFERENCES dados_sentenca(id),
    tutelado_id INTEGER REFERENCES pessoa_fisica(pessoa_id),
    tutor_id INTEGER REFERENCES pessoa_fisica(pessoa_id),
    limitacoes TEXT
);

CREATE TABLE ato_livro_e_guarda (
    id SERIAL PRIMARY KEY,
    ato_livro_e_id INTEGER NOT NULL UNIQUE REFERENCES ato_livro_e(id) ON DELETE CASCADE,
    dados_sentenca_id INTEGER NOT NULL REFERENCES dados_sentenca(id),
    menor_id INTEGER REFERENCES pessoa_fisica(pessoa_id),
    guardiao_id INTEGER REFERENCES pessoa_fisica(pessoa_id)
);

-- Demais tabelas para o Livro E
CREATE TABLE ato_nascimento_estrangeiro (
    id SERIAL PRIMARY KEY,
    base_ato_id INTEGER NOT NULL REFERENCES base_ato(id) ON DELETE CASCADE,
    dnv VARCHAR(50),
    data_nascimento DATE NOT NULL,
    hora_nascimento TIME NOT NULL,
    local_nascimento VARCHAR(100) NOT NULL,
    is_gemeo BOOLEAN NOT NULL,
    prenome_registrando VARCHAR(50) NOT NULL,
    sobrenome_registrando VARCHAR(50) NOT NULL,
    sexo_registrando VARCHAR(10) CHECK (sexo_registrando IN ('Masculino', 'Feminino', '')) NOT NULL,
    naturalidade_registrando TEXT NOT NULL,
    cpf_registrando VARCHAR(14) UNIQUE NOT NULL,
    mae_id INTEGER REFERENCES pessoa_fisica(pessoa_id),
    pai_id INTEGER REFERENCES pessoa_fisica(pessoa_id),
    declarante_id INTEGER REFERENCES pessoa(id),
    observacao_obrigatoria TEXT
);

CREATE TABLE ato_traslado_exterior (
    id SERIAL PRIMARY KEY,
    base_ato_id INTEGER NOT NULL REFERENCES base_ato(id) ON DELETE CASCADE,
    tipo_traslado VARCHAR(20) CHECK (tipo_traslado IN ('nascimento', 'casamento', 'obito')) NOT NULL,
    requerente_id INTEGER REFERENCES pessoa_fisica(pessoa_id),
    tipo_certidao_origem VARCHAR(20) CHECK (tipo_certidao_origem IN ('consular', 'estrangeira')),
    detalhes_certidao TEXT,
    serventia_certidao VARCHAR(100),
    data_emissao_certidao DATE,
    matricula_ou_referencia VARCHAR(100),
    observacao_obrigatoria TEXT
);

-- Tabela principal para atos do Livro E
CREATE TABLE ato_livro_e (
    id SERIAL PRIMARY KEY,
    base_ato_id INTEGER NOT NULL UNIQUE REFERENCES base_ato(id) ON DELETE CASCADE,
    tipo_ato ENUM('emancipacao', 'interdicao', 'ausencia', 'mortePresumida', 'uniaoEstavel', 'opcaoNacionalidade', 'tutela', 'guarda', 'nascimentoPaisEstrangeiros', 'trasladoExterior') NOT NULL
);

-- Tabela genérica para sentenças
CREATE TABLE dados_sentenca (
    id SERIAL PRIMARY KEY,
    data_sentenca DATE NOT NULL,
    juizo TEXT NOT NULL,
    nome_magistrado TEXT NOT NULL,
    data_transito_em_julgado DATE
);

-- Tabela genérica para escrituras
CREATE TABLE dados_escritura_publica (
    id SERIAL PRIMARY KEY,
    data_escritura DATE NOT NULL,
    serventia TEXT NOT NULL,
    livro TEXT NOT NULL,
    folha TEXT NOT NULL
);

-- Emancipação
CREATE TABLE ato_livro_e_emancipacao (
    id SERIAL PRIMARY KEY,
    ato_livro_e_id INTEGER NOT NULL UNIQUE REFERENCES ato_livro_e(id) ON DELETE CASCADE,
    origem ENUM('sentenca', 'escritura') NOT NULL,
    dados_sentenca_id INTEGER REFERENCES dados_sentenca(id),
    dados_escritura_id INTEGER REFERENCES dados_escritura_publica(id),
    emancipado_id INTEGER REFERENCES pessoa_fisica(pessoa_id),
    nome_pai TEXT,
    nome_mae TEXT,
    nome_tutor TEXT
);

-- Interdição
CREATE TABLE ato_livro_e_interdicao (
    id SERIAL PRIMARY KEY,
    ato_livro_e_id INTEGER NOT NULL UNIQUE REFERENCES ato_livro_e(id) ON DELETE CASCADE,
    dados_sentenca_id INTEGER NOT NULL REFERENCES dados_sentenca(id),
    interdito_id INTEGER REFERENCES pessoa_fisica(pessoa_id),
    curador_id INTEGER REFERENCES pessoa_fisica(pessoa_id),
    causa_interdicao TEXT NOT NULL,
    limites_curatela TEXT NOT NULL
);

-- Ausência
CREATE TABLE ato_livro_e_ausencia (
    id SERIAL PRIMARY KEY,
    ato_livro_e_id INTEGER NOT NULL UNIQUE REFERENCES ato_livro_e(id) ON DELETE CASCADE,
    dados_sentenca_id INTEGER NOT NULL REFERENCES dados_sentenca(id),
    ausente_id INTEGER REFERENCES pessoa_fisica(pessoa_id),
    curador_id INTEGER REFERENCES pessoa_fisica(pessoa_id),
    causa_ausencia TEXT NOT NULL,
    limites_curatela TEXT NOT NULL
);

-- Morte Presumida
CREATE TABLE ato_livro_e_morte_presumida (
    id SERIAL PRIMARY KEY,
    ato_livro_e_id INTEGER NOT NULL UNIQUE REFERENCES ato_livro_e(id) ON DELETE CASCADE,
    dados_sentenca_id INTEGER NOT NULL REFERENCES dados_sentenca(id),
    ausente_id INTEGER REFERENCES pessoa_fisica(pessoa_id),
    data_prob_falecimento DATE NOT NULL
);

-- Opção Nacionalidade
CREATE TABLE ato_livro_e_opcao_nacionalidade (
    id SERIAL PRIMARY KEY,
    ato_livro_e_id INTEGER NOT NULL UNIQUE REFERENCES ato_livro_e(id) ON DELETE CASCADE,
    dados_sentenca_id INTEGER NOT NULL REFERENCES dados_sentenca(id),
    optante_id INTEGER REFERENCES pessoa_fisica(pessoa_id)
);

-- Tutela
CREATE TABLE ato_livro_e_tutela (
    id SERIAL PRIMARY KEY,
    ato_livro_e_id INTEGER NOT NULL UNIQUE REFERENCES ato_livro_e(id) ON DELETE CASCADE,
    dados_sentenca_id INTEGER NOT NULL REFERENCES dados_sentenca(id),
    tutelado_id INTEGER REFERENCES pessoa_fisica(pessoa_id),
    tutor_id INTEGER REFERENCES pessoa_fisica(pessoa_id),
    limitacoes TEXT
);

-- Guarda
CREATE TABLE ato_livro_e_guarda (
    id SERIAL PRIMARY KEY,
    ato_livro_e_id INTEGER NOT NULL UNIQUE REFERENCES ato_livro_e(id) ON DELETE CASCADE,
    dados_sentenca_id INTEGER NOT NULL REFERENCES dados_sentenca(id),
    menor_id INTEGER REFERENCES pessoa_fisica(pessoa_id),
    guardiao_id INTEGER REFERENCES pessoa_fisica(pessoa_id)
);


-- Tabela Template
CREATE TABLE template (
    id INTEGER PRIMARY KEY,
    tipo_documento tipo_documento NOT NULL,
    tipo_ato tipo_ato NOT NULL,
    titulo TEXT NOT NULL,
    descricao TEXT,
    selo_id INTEGER REFERENCES tabela_emolumentos(id),
    cabecalho_padrao_id INTEGER REFERENCES bloco_template(id),
    rodape_padrao_id INTEGER REFERENCES bloco_template(id),
    conteudo TEXT NOT NULL,
    margin_top NUMERIC(6,2) NOT NULL,
    margin_right NUMERIC(6,2) NOT NULL,
    margin_bottom NUMERIC(6,2) NOT NULL,
    margin_left NUMERIC(6,2) NOT NULL,
    layout_largura_mm NUMERIC(6,2) NOT NULL,
    layout_altura_mm NUMERIC(6,2) NOT NULL,
    ativo BOOLEAN NOT NULL
    recibo_template_id INTEGER REFERENCES recibo_template(id)
);

-- Tabela: pedido
CREATE TABLE pedido (
    id INTEGER PRIMARY KEY,
    protocolo TEXT NOT NULL UNIQUE,
    tipo_documento ENUM('Certidão', 'Averbação') NOT NULL,
    status ENUM('PENDENTE', 'EM_ANALISE', 'CONCLUIDO', 'CANCELADO') NOT NULL,
    etapa_atual ENUM('SOLICITACAO', 'EMISSAO', 'PAGAMENTO') NOT NULL,
    ato_id INTEGER NOT NULL, -- Deve referenciar a tabela base_ato
    template_id INTEGER REFERENCES template(id),
    requerente_tipo TEXT CHECK (requerente_tipo IN ('fisica', 'juridica')) NOT NULL,
    requerente_nome TEXT,
    requerente_cpf TEXT,
    requerente_razao_social TEXT,
    requerente_cnpj TEXT,
    conteudo_final_html TEXT,
    conteudo_verso_html TEXT,
    selo_numero INTEGER,
    selo_data TIMESTAMP,
    data_emissao TIMESTAMP,
    emolumentos NUMERIC(10,2),
    fundos NUMERIC(10,2),
    taxa_judiciaria NUMERIC(10,2),
    valor_total NUMERIC(10,2),
    metodo_pagamento ENUM('dinheiro', 'credito', 'debito', 'pix', 'boleto', 'isento'),
    status_pagamento ENUM('pendente', 'pago'),
    data_pagamento TIMESTAMP,
    comprovante_url TEXT,
    motivo_cancelamento TEXT,
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_ultima_atualizacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para cabeçalho e rodapé 
CREATE TABLE bloco_template (
    id INTEGER PRIMARY KEY,
    nome TEXT NOT NULL,
    tipo ENUM('cabecalho', 'rodape') NOT NULL,
    conteudo TEXT NOT NULL
);

CREATE TABLE selo_avulso (
    id SERIAL PRIMARY KEY,
    protocolo VARCHAR(100) NOT NULL,
    data_solicitacao DATE NOT NULL,
    status status_selo_avulso NOT NULL,
    tipo_requerente tipo_requerente NOT NULL,
    nome_requerente VARCHAR(255),
    cpf VARCHAR(14),
    razao_social VARCHAR(255),
    cnpj VARCHAR(18),
    nome_parte_principal VARCHAR(255) NOT NULL,
    tipo_ato VARCHAR(100),
    data_registro DATE,
    observacao_geral TEXT,
    emolumentos NUMERIC(10,2) NOT NULL,
    fundos NUMERIC(10,2) NOT NULL,
    taxas NUMERIC(10,2) NOT NULL,
    valor_total NUMERIC(10,2) NOT NULL,
    metodo_pagamento ENUM('dinheiro', 'credito', 'debito', 'pix', 'boleto', 'isento'),
    status_pagamento ENUM('pendente', 'pago'),
);

CREATE TABLE selo_avulso_item (
    id SERIAL PRIMARY KEY,
    selo_avulso_id INTEGER NOT NULL REFERENCES selo_avulso(id) ON DELETE CASCADE,
    id_selo INTEGER NOT NULL REFERENCES tabela_emolumentos(id),
    descricao VARCHAR(255) NOT NULL,
    quantidade INTEGER NOT NULL,
    valor_unitario NUMERIC(10,2) NOT NULL,
    valor_total NUMERIC(10,2) NOT NULL,
    numero_selo_gerado VARCHAR(100)
);

CREATE TABLE tabela_emolumentos (
    id INTEGER PRIMARY KEY,
    tipo_ato_selo INTEGER 
    descricao VARCHAR(180)
    tipo ENUM('Registro de Imoveis','Tabelionato de Notas','Registro Civil','Registro de titulos e documentos','Protesto de titulo')
    emolumento NUMERIC(10,2),
    taxa_judiciaria NUMERIC(10,2),
    valor_total NUMERIC(10,2),
);

CREATE TABLE recibo_template (
    id UUID PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    conteudo TEXT NOT NULL,
    margin_top NUMERIC(6,2) NOT NULL,
    margin_right NUMERIC(6,2) NOT NULL,
    margin_bottom NUMERIC(6,2) NOT NULL,
    margin_left NUMERIC(6,2) NOT NULL,
    layout_largura_mm NUMERIC(6,2) NOT NULL,
    layout_altura_mm NUMERIC(6,2) NOT NULL,
    cabecalho_padrao_id INTEGER REFERENCES bloco_template(id),
    rodape_padrao_id INTEGER REFERENCES bloco_template(id),
);