import { type ITituloProtesto } from '../Protesto/types';
import tabelaEmolumentosProtesto from '../../../tabela-emolumentos.json';

export type TipoAtoProtesto = 'APONTAMENTO' | 'PROTESTO' | 'INTIMACAO' | 'CANCELAMENTO_AVERBACAO' | 'LIQUIDACAO_DESISTENCIA' | 'CERTIDAO' | 'OUTROS';
export type CondicaoPagamento = 'COMUM' | 'POSTERIOR' | 'DIFERIDO';
export type CondicaoEspecial = 'MEI_EPP' | null;

export interface IEmolumentoProtesto {
    id_selo: number;
    descricao_selo: string;
    valor_emolumento: number;
    valor_taxa_judiciaria: number;
    ato: TipoAtoProtesto;
    condicao_pagamento: CondicaoPagamento;
    condicao_especial: CondicaoEspecial | null;
    faixa_valor_inicio: number;
    faixa_valor_fim: number | null;
}

export interface IResultadoCalculoUnitario {
    selo: IEmolumentoProtesto;
    valorEmolumento: number;
    valorTaxaJudiciaria: number;
    valorTotal: number;
}

export interface IResultadoCalculoCancelamento {
    apontamento: IResultadoCalculoUnitario | null;
    intimacao: IResultadoCalculoUnitario | null;
    protesto: IResultadoCalculoUnitario | null;
    cancelamento: IResultadoCalculoUnitario | null;
}

export interface IResultadoCalculoLiquidacao {
    apontamento: IResultadoCalculoUnitario | null;
    intimacao: IResultadoCalculoUnitario | null;
    liquidacao: IResultadoCalculoUnitario | null;
}

export interface ISelo {

}

export interface IResultadoCalculoCompleto {
    cobrancaInicial: {
        detalhes: {
            apontamento: IResultadoCalculoUnitario | null;
            intimacao: IResultadoCalculoUnitario | null;
            protesto: IResultadoCalculoUnitario | null;
        };
        resumo: {
            totalEmolumentos: number;
            totalTaxas: number;
            valorTotalAto: number;
        };
    };
    cobrancaFinal: {
        detalhes: {
            apontamento: IResultadoCalculoUnitario | null;
            intimacao: IResultadoCalculoUnitario | null;
            protesto: IResultadoCalculoUnitario | null;
        };
        resumo: {
            totalEmolumentos: number;
            totalTaxas: number;
            valorTotalAto: number;
        };
    } | null;
    cancelamento: IResultadoCalculoUnitario | null;
    liquidacao: IResultadoCalculoUnitario | null;
    regraPrincipal: string;
}

// Calcula o custo de um único ato de protesto (ex: apenas a intimação).
export function calcularCustoAtoUnico(titulo: ITituloProtesto, tipoAto: TipoAtoProtesto): IResultadoCalculoUnitario | null {
    const devedorPrincipal = titulo.devedores[0];
    const isMEI = devedorPrincipal?.tipo === 'juridica' && devedorPrincipal.situacao_tributaria === 'MEI';
    const numeroDevedores = titulo.devedores.length;

    const findRuleSet = (pagamento: CondicaoPagamento, especial: CondicaoEspecial | null) => {
        return (tabelaEmolumentosProtesto as IEmolumentoProtesto[]).filter(regra =>
            regra.ato === tipoAto && regra.condicao_pagamento === pagamento && regra.condicao_especial === especial
        ).sort((a, b) => a.faixa_valor_inicio - b.faixa_valor_inicio);
    };

    let regrasRelevantes: IEmolumentoProtesto[] = [];
    if (isMEI) {
        regrasRelevantes = findRuleSet(titulo.tipoPagamento, 'MEI_EPP');
    }
    if (regrasRelevantes.length === 0) {
        regrasRelevantes = findRuleSet(titulo.tipoPagamento, null);
    }
    if (regrasRelevantes.length === 0) return null;

    let regraSelecionada = regrasRelevantes.find(regra =>
        (regra.faixa_valor_fim === null && titulo.valor >= regra.faixa_valor_inicio) ||
        (titulo.valor >= regra.faixa_valor_inicio && titulo.valor <= (regra.faixa_valor_fim ?? Infinity))
    );
    if (!regraSelecionada && regrasRelevantes.length > 0) {
        regraSelecionada = regrasRelevantes.some(r => r.faixa_valor_fim !== null) ? regrasRelevantes[regrasRelevantes.length - 1] : regrasRelevantes[0];
    }
    if (!regraSelecionada) return null;

    const emolumento = regraSelecionada.ato === 'INTIMACAO' ? regraSelecionada.valor_emolumento * numeroDevedores : regraSelecionada.valor_emolumento;
    const taxa = regraSelecionada.valor_taxa_judiciaria;

    return { selo: regraSelecionada, valorEmolumento: emolumento, valorTaxaJudiciaria: taxa, valorTotal: emolumento + taxa };
}

// Orquestra o cálculo do custo total de um ato de protesto, considerando todas as suas etapas
export function calcularAtoCompletoProtesto(titulo: ITituloProtesto): IResultadoCalculoCompleto | null {
    const devedorPrincipal = titulo.devedores[0];
    const isMEI = devedorPrincipal?.tipo === 'juridica' && devedorPrincipal.situacao_tributaria === 'MEI';

    const calcularDetalhesEResumo = (pagamento: CondicaoPagamento) => {
        const detalhes = {
            apontamento: calcularCustoAtoUnico({ ...titulo, tipoPagamento: pagamento }, 'APONTAMENTO'),
            intimacao: calcularCustoAtoUnico({ ...titulo, tipoPagamento: pagamento }, 'INTIMACAO'),
            protesto: calcularCustoAtoUnico({ ...titulo, tipoPagamento: pagamento }, 'PROTESTO'),
        };
        const totalEmolumentos = (detalhes.apontamento?.valorEmolumento ?? 0) + (detalhes.intimacao?.valorEmolumento ?? 0) + (detalhes.protesto?.valorEmolumento ?? 0);
        const totalTaxas = (detalhes.apontamento?.valorTaxaJudiciaria ?? 0) + (detalhes.intimacao?.valorTaxaJudiciaria ?? 0) + (detalhes.protesto?.valorTaxaJudiciaria ?? 0);
        return {
            detalhes,
            resumo: { totalEmolumentos, totalTaxas, valorTotalAto: totalEmolumentos + totalTaxas }
        };
    };

    const calcularCobrancaFinal = (pagamento: CondicaoPagamento) => {
        const detalhes = {
            apontamento: calcularCustoAtoUnico({ ...titulo, tipoPagamento: pagamento }, 'APONTAMENTO'),
            intimacao: calcularCustoAtoUnico({ ...titulo, tipoPagamento: pagamento }, 'INTIMACAO'),
            protesto: calcularCustoAtoUnico({ ...titulo, tipoPagamento: pagamento }, 'PROTESTO'),
        };
        const totalEmolumentos = (detalhes.apontamento?.valorEmolumento ?? 0) + (detalhes.intimacao?.valorEmolumento ?? 0) + (detalhes.protesto?.valorEmolumento ?? 0);
        const totalTaxas = (detalhes.apontamento?.valorTaxaJudiciaria ?? 0) + (detalhes.intimacao?.valorTaxaJudiciaria ?? 0) + (detalhes.protesto?.valorTaxaJudiciaria ?? 0);
        return {
            detalhes,
            resumo: { totalEmolumentos, totalTaxas, valorTotalAto: totalEmolumentos + totalTaxas }
        };
    }

    const calcularCustoCancelamento = (pagamento: CondicaoPagamento) => {
        const cancelamento = calcularCustoAtoUnico({ ...titulo, tipoPagamento: pagamento }, 'CANCELAMENTO_AVERBACAO')
        return cancelamento
    }

    const calcularCustoLiquidacao = (pagamento: CondicaoPagamento) => {
        const liquidacao = calcularCustoAtoUnico({ ...titulo, tipoPagamento: pagamento }, 'LIQUIDACAO_DESISTENCIA')
        return liquidacao
    }


    let cobrancaInicial, cancelamento, liquidacao, cobrancaFinal = null;

    if (titulo.tipoPagamento === 'POSTERIOR' || titulo.tipoPagamento === 'DIFERIDO') {
        cobrancaInicial = calcularDetalhesEResumo(titulo.tipoPagamento);
        const tipoPagamentoFinal = titulo.tipoPagamento === 'POSTERIOR' ? 'COMUM' : 'DIFERIDO';
        cobrancaFinal = calcularCobrancaFinal(tipoPagamentoFinal);
        cancelamento = calcularCustoCancelamento(tipoPagamentoFinal)
        liquidacao = calcularCustoLiquidacao(tipoPagamentoFinal)
    } else {
        cobrancaInicial = calcularDetalhesEResumo('COMUM');
        cancelamento = calcularCustoCancelamento('COMUM')
        liquidacao = calcularCustoLiquidacao('COMUM')
    }

    if (!cobrancaInicial.detalhes.apontamento || !cobrancaInicial.detalhes.intimacao || !cobrancaInicial.detalhes.protesto) return null;

    return {
        cobrancaInicial,
        cobrancaFinal,
        cancelamento,
        liquidacao,
        regraPrincipal: `${isMEI ? 'Devedor MEI/EPP' : 'Devedor Comum'} com Pagamento ${titulo.tipoPagamento}`
    };
}

export function calcularCustoLiquidacao(titulo: ITituloProtesto): IResultadoCalculoLiquidacao | IResultadoCalculoUnitario | null {
    if (titulo.tipoPagamento === 'POSTERIOR' || titulo.tipoPagamento === 'DIFERIDO') {
        const tipoPagamentoFinal = titulo.tipoPagamento === 'POSTERIOR' ? 'COMUM' : 'DIFERIDO';
        const selos = {
            apontamento: calcularCustoAtoUnico({ ...titulo, tipoPagamento: tipoPagamentoFinal }, 'APONTAMENTO'),
            intimacao: calcularCustoAtoUnico({ ...titulo, tipoPagamento: tipoPagamentoFinal }, 'INTIMACAO'),
            liquidacao: calcularCustoAtoUnico({ ...titulo, tipoPagamento: tipoPagamentoFinal }, 'LIQUIDACAO_DESISTENCIA'),
        };
        return selos
    } else {
        return calcularCustoAtoUnico({ ...titulo, tipoPagamento: 'COMUM' }, 'LIQUIDACAO_DESISTENCIA');
    }
}

export function calcularCustoCancelamento(titulo: ITituloProtesto): IResultadoCalculoCancelamento | IResultadoCalculoUnitario | null {
    if (titulo.tipoPagamento === 'POSTERIOR' || titulo.tipoPagamento === 'DIFERIDO') {
        const tipoPagamentoFinal = titulo.tipoPagamento === 'POSTERIOR' ? 'COMUM' : 'DIFERIDO';
        const selos = {
            apontamento: calcularCustoAtoUnico({ ...titulo, tipoPagamento: tipoPagamentoFinal }, 'APONTAMENTO'),
            intimacao: calcularCustoAtoUnico({ ...titulo, tipoPagamento: tipoPagamentoFinal }, 'INTIMACAO'),
            protesto: calcularCustoAtoUnico({ ...titulo, tipoPagamento: tipoPagamentoFinal }, 'PROTESTO'),
            cancelamento: calcularCustoAtoUnico({ ...titulo, tipoPagamento: tipoPagamentoFinal }, 'CANCELAMENTO_AVERBACAO'),
        };
        return selos
    } else {
        return calcularCustoAtoUnico({ ...titulo, tipoPagamento: 'COMUM' }, 'CANCELAMENTO_AVERBACAO');
    }
}