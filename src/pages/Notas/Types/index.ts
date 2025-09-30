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

export interface ITipoServicoBalcao {
    id: number
    nome: string
}

export interface IAnexoExigido {
    nome: string;        // Ex: "Documento de Identidade (RG ou CNH)"
    obrigatorio: boolean; // Se o anexo é mandatório para o serviço
    detalhes?: string;   // Ex: "Válido e com foto recente"
}

export interface IBalcaoTemplate {
    id: string;
    tipoServicoBalcaoId: number; // Referência ao ID de 'ITipoServicoBalcao' (Reconhecimento, Autenticação, etc.)
    titulo: string;
    descricao: string;
    id_selo: number | null; // Selo de emolumento específico para o serviço
    cabecalhoPadraoId: string | null;
    rodapePadraoId: string | null;
    conteudo: string; // O HTML/texto do modelo (ex: texto de reconhecimento de firma)
    margins: Margin;
    layout: Size; // Pode ser um tamanho específico (ex: etiqueta 5x10cm)
    ativo: boolean;
    exigeFichaFirma: 'Sim' | 'Não' | 'Condicional';
    exigeTestemunhas: boolean;
    documentosExigidos: IAnexoExigido[] | null;
}


export interface ITemplate {
    id: number;
    nome: string; // Ex: "Cabeçalho Padrão com Brasão"
    tipo: 'cabecalho' | 'rodape';
    conteudo: string; // O HTML gerado pelo MainEditor
    isPadrao: boolean; // Indica se este é o template default para seu tipo
    dataModificacao: string;
}

export type TipoRecibo =
    "Segunda Via" |
    "Averbação" |
    "Habilitação de Casamento" |
    "Busca de Registro" |
    "Apostilamento" |
    "Outros";

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