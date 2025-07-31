import { formatarDataExtenso } from "../../../Civil/functions/FormatarData";
import { DADOS_OFICIAL } from "../../lib/Constants";
import { templatesAverbacao } from '../ModeloAverbacao/templates'; // Importando os novos templates

// A interface continua a mesma
interface DadosAverbacao {
    tipoAverbacao: string;
    [key: string]: any;
}

const preencherDadosGerais = (template: string, ato: any): string => {
    let texto = template;
    texto = texto.replace(/\[\[LIVRO_.*?\]\]/g, ato.livro || '_______');
    texto = texto.replace(/\[\[FOLHA_.*?\]\]/g, ato.folha || '_______');
    texto = texto.replace(/\[\[TERMO_.*?\]\]/g, ato.termo || '_______');
    texto = texto.replace(/\[\[CIDADE_SERVENTIA\]\]/g, 'Goiânia');
    texto = texto.replace(/\[\[DATA_ATUAL_EXTENSO\]\]/g, formatarDataExtenso(new Date().toISOString()));
    texto = texto.replace(/\[\[NOME_OFICIAL\]\]/g, DADOS_OFICIAL.nome || 'Nome do Oficial');
    texto = texto.replace(/\[\[CARGO_OFICIAL\]\]/g, DADOS_OFICIAL.cargo || 'Oficial de Registro');
    return texto;
}

export const gerarTextoAverbacao = (atoOriginal: any, dadosAverbacao: DadosAverbacao): string => {
    if (!atoOriginal || !dadosAverbacao.tipoAverbacao) {
        return '<p style="color: red;">Dados insuficientes para gerar a averbação.</p>';
    }

    const template = templatesAverbacao[dadosAverbacao.tipoAverbacao];
    if (!template) {
        return `<p style="color: red;">Template para "${dadosAverbacao.tipoAverbacao}" não encontrado.</p>`;
    }

    // Preenche inicialmente os dados gerais que são comuns a todos.
    let textoFinal = preencherDadosGerais(template, atoOriginal);
    const dados = atoOriginal.dadosCompletos;

    // --- Lógica principal baseada no TIPO DE ATO ORIGINAL ---
    switch (atoOriginal.tipoAto) {

        case 'Nascimento':
            // Preenche os dados específicos do NASCIMENTO no template
            if (dados) {
                textoFinal = textoFinal.replace(/\[\[NOME_REGISTRADO\]\]/g, atoOriginal.nomePrincipal || '');
                textoFinal = textoFinal.replace(/\[\[NOME_REGISTRADO_ORIGINAL\]\]/g, atoOriginal.nomePrincipal || '');
                // ... outros campos de nascimento que possam existir no template
            }

            // Switch aninhado para tratar o TIPO DE AVERBAÇÃO dentro do Nascimento
            switch (dadosAverbacao.tipoAverbacao) {
                case 'Averbação de Reconhecimento de Paternidade':
                    textoFinal = textoFinal.replace(/\[\[NOME_NOVO_PAI\]\]/g, dadosAverbacao.nomeNovoPai || '_______');
                    textoFinal = textoFinal.replace(/\[\[AVOS_PATERNOS\]\]/g, dadosAverbacao.avosPaternos || 'Não informados');
                    textoFinal = textoFinal.replace(/\[\[NOME_NOVO_REGISTRADO\]\]/g, dadosAverbacao.nomeNovo || atoOriginal.nomePrincipal);
                    textoFinal = textoFinal.replace(/\[\[INSTRUMENTO_RECONHECIMENTO\]\]/g, dadosAverbacao.instrumento || 'instrumento particular');
                    break;
                case 'Averbação de Alteração de Nome':
                     textoFinal = textoFinal.replace(/\[\[NOME_ANTIGO\]\]/g, atoOriginal.nomePrincipal || '_______');
                     textoFinal = textoFinal.replace(/\[\[NOME_NOVO\]\]/g, dadosAverbacao.nomeNovo || '_______');
                     textoFinal = textoFinal.replace(/\[\[MOTIVO_ALTERACAO\]\]/g, dadosAverbacao.motivo || 'sentença judicial');
                    break;
                case 'Averbação de Óbito':
                     textoFinal = textoFinal.replace(/\[\[DATA_OBITO_EXTENSO\]\]/g, formatarDataExtenso(dadosAverbacao.dataObito) || '_______');
                     textoFinal = textoFinal.replace(/\[\[LOCAL_OBITO\]\]/g, dadosAverbacao.localObito || '_______');
                     textoFinal = textoFinal.replace(/\[\[LIVRO_OBITO\]\]/g, dadosAverbacao.livroObito || '_______');
                     textoFinal = textoFinal.replace(/\[\[FOLHA_OBITO\]\]/g, dadosAverbacao.folhaObito || '_______');
                     textoFinal = textoFinal.replace(/\[\[TERMO_OBITO\]\]/g, dadosAverbacao.termoObito || '_______');
                    break;
            }
            break;

        case 'Casamento':
            // Preenche os dados específicos do CASAMENTO no template
            if (dados) {
                textoFinal = textoFinal.replace(/\[\[NOME_CONJUGE_1\]\]/g, dados.conjuges?.[0]?.nomeAtual || 'Cônjuge 1');
                textoFinal = textoFinal.replace(/\[\[NOME_CONJUGE_2\]\]/g, dados.conjuges?.[1]?.nomeAtual || 'Cônjuge 2');
            }

            // Switch aninhado para tratar o TIPO DE AVERBAÇÃO dentro do Casamento
            switch (dadosAverbacao.tipoAverbacao) {
                case 'Averbação de Divórcio':
                    textoFinal = textoFinal.replace(/\[\[DATA_MANDADO\]\]/g, formatarDataExtenso(dadosAverbacao.dataMandado) || '_______');
                    textoFinal = textoFinal.replace(/\[\[JUIZO\]\]/g, dadosAverbacao.juizo || '_______');
                    textoFinal = textoFinal.replace(/\[\[NUMERO_PROCESSO\]\]/g, dadosAverbacao.numeroProcesso || '_______');
                    textoFinal = textoFinal.replace(/\[\[NOME_SOLTEIRA_CONJUGE_MULHER\]\]/g, dadosAverbacao.nomeSolteira || '_______');
                    textoFinal = textoFinal.replace(/\[\[DATA_TRANSITO_EM_JULGADO\]\]/g, formatarDataExtenso(dadosAverbacao.dataTransito) || '_______');
                    break;
            }
            break;
        
        case 'Livro E':
             // Preenche os dados específicos de um ato do LIVRO E
             if(dados){
                textoFinal = textoFinal.replace(/\[\[NOME_INTERDITADO\]\]/g, atoOriginal.nomePrincipal || '');
             }
             // Switch aninhado para tratar o TIPO DE AVERBAÇÃO dentro do Livro E
             switch (dadosAverbacao.tipoAverbacao) {
                case 'Averbação de Cancelamento de Interdição':
                    textoFinal = textoFinal.replace(/\[\[JUIZO_CANCELAMENTO\]\]/g, dadosAverbacao.juizoCancelamento || '_______');
                    textoFinal = textoFinal.replace(/\[\[NUMERO_PROCESSO_CANCELAMENTO\]\]/g, dadosAverbacao.processoCancelamento || '_______');
                    textoFinal = textoFinal.replace(/\[\[DATA_SENTENCA_CANCELAMENTO\]\]/g, formatarDataExtenso(dadosAverbacao.dataSentencaCancelamento) || '_______');
                    break;
             }
            break;

        default:
            // Caso para atos não previstos
            break;
    }

    // Limpa qualquer placeholder que não tenha sido preenchido
    textoFinal = textoFinal.replace(/\[\[.*?\]\]/g, '__________');

    return textoFinal;
};