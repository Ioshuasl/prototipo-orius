export type SealBatchStatus = 'Ativo' | 'Esgotado' | 'Baixado';
export type Decendio = 'Todos' | '1º Decêndio' | '2º Decêndio' | '3º Decêndio';
export type SealSituation = 'Disponível' | 'Utilizando' | 'Exportado' | 'Cancelado' | 'Redimensionado';

export interface SealValues {
    emolumentos: number;
    taxaJudiciaria: number;
    iss: number;
    total: number;
}
// A interface principal para o selo
export interface Seal {
    sealNumber: string;
    sealSituation: SealSituation;
    personName: string | null;
    sealValue: SealValues;
    exported: boolean;
    exportationDate: Date | null;
    resized: boolean;
    resizingDate: Date | null;
    linkedSeals: string[] | null;
}

export interface SealBatch {
    id: number;
    protocoloCompra: string;
    dataCompra: Date;
    quantidade: number;
    intervaloNumeracao: string;
    status: 'Ativo' | 'Esgotado' | 'Baixado';
    descricao: string;
    tipo_ato_selo: number;
    seals: Seal[];
}

export interface Size {
    largura_mm: number;
    altura_mm: number;
}

export interface Margin {
    top: string;
    right: string;
    bottom: string;
    left: string;
}

export type TipoRecibo =
    "Segunda Via" |
    "Averbação" |
    "Habilitação de Casamento" |
    "Busca de Registro" |
    "Apostilamento" |
    "Outros";

// A estrutura principal do modelo de recibo
export type ReciboTemplate = {
    id: string;
    titulo: string;
    descricao: string;
    tipoRecibo: TipoRecibo;
    id_selo: number | null;
    cabecalhoPadraoId: string | null;
    rodapePadraoId: string | null;
    conteudo: string;
    margins: Margin;
    layout: Size;
};

export interface FinancialTransaction {
    id: number;
    description: string;
    value: number;
    type: 'Receita' | 'Despesa';
    date: Date;
    details?: any;
}

export interface IUsuario {
    id: number;
    nome: string;
    email: string;
    cargoId: number; // ID do cargo ao qual o usuário pertence
    status: 'Ativo' | 'Inativo';
    senha: string
}

export interface ILogAtividade {
    id: number;
    userId: number;
    dataHora: string;
    acao: string;
    detalhes: string;
}

export type Sistemas = "Registro Civil" | "Registro de Imóveis" | "Tabelionato de Notas" | "Protesto de Títulos" | "RTD" | "Caixa"
export type ServiceStatus = 'Pago' | 'Aguardando Pagamento' | 'Cancelado';
export type serviceTypesExemplo = 'Certidão de Nascimento' | 'Escritura de Compra e Venda' | 'Protesto de Título' | 'Cópia Autenticada' | 'Reconhecimento de Firma';

export interface ServiceRecord {
    id: number;
    protocol: string;
    clientName: string;
    serviceType: serviceTypesExemplo;
    sistema: Sistemas
    registrationDate: Date;
    value: number;
    status: ServiceStatus;
    withSeal: boolean;
    sealNumber: string[]; // Alterado para um array de strings
}