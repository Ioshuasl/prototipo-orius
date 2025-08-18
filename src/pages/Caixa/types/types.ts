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