-- Tabela principal que representa uma pessoa (física ou jurídica)
CREATE TABLE pessoa (
    id SERIAL PRIMARY KEY,
    tipo ENUM('fisica', 'juridica') NOT NULL,
    cep VARCHAR(10) NOT NULL,
    tipo_logradouro VARCHAR(50) NOT NULL,
    logradouro VARCHAR(100) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    complemento VARCHAR(100),
    bairro VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    uf CHAR(2) NOT NULL
);

-- Tabela com dados específicos da pessoa física
CREATE TABLE pessoa_fisica (
    pessoa_id INTEGER PRIMARY KEY REFERENCES pessoa(id) ON DELETE CASCADE,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    data_nascimento DATE NOT NULL,
    doc_identidade_tipo ENUM('', 'RG', 'CNH', 'Passaporte'),
    doc_identidade_num VARCHAR(50),
    profissao VARCHAR(100),
    nacionalidade VARCHAR(100),
    naturalidade_cidade VARCHAR(100),
    naturalidade_uf CHAR(2),
    sexo ENUM('Masculino', 'Feminino', 'Ignorado'),
    cor ENUM('Branca', 'Preta', 'Parda', 'Amarela', 'Indígena', 'Ignorada') NOT NULL,
    estado_civil VARCHAR(30),
    nome_pai VARCHAR(100),
    nome_mae VARCHAR(100),
    regime_bens VARCHAR(50)
);

-- Tabela com dados específicos da pessoa jurídica
CREATE TABLE pessoa_juridica (
    pessoa_id INTEGER PRIMARY KEY REFERENCES pessoa(id) ON DELETE CASCADE,
    razao_social VARCHAR(150) NOT NULL,
    nome_fantasia VARCHAR(150),
    cnpj VARCHAR(18) NOT NULL UNIQUE,
    situacao VARCHAR(50) NOT NULL
    socio_administrativo VARCHAR(150),
);

-- Tabela com os sócios da pessoa jurídica (QSA)
CREATE TABLE socio (
    id SERIAL PRIMARY KEY,
    pessoa_juridica_id INTEGER NOT NULL REFERENCES pessoa_juridica(pessoa_id) ON DELETE CASCADE,
    nome VARCHAR(150) NOT NULL,
    qualificacao VARCHAR(100)
);
