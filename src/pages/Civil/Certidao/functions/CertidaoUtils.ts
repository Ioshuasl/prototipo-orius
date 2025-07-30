import { templatesCertidao, templateVerso } from "../ModeloCertidao/templates";
import { formatarDataExtenso } from "../../../Civil/functions/FormatarData";
import { formatarHora } from "../../../Civil/functions/FormatarHora";
import { dataAtualFormatada, DADOS_OFICIAL, DADOS_SERVENTIA, DADOS_ESCREVENTE } from "../../lib/Constants";

export const preencherTemplateVerso = (ato: any) => {
    if (!ato) return '';

    let textoVerso = templateVerso;
    const dados = ato.dadosCompletos;

    // Substituições Globais
    textoVerso = textoVerso.replace(/\[\[MATRICULA_VERSO\]\]/g, ato.matricula || '');
    textoVerso = textoVerso.replace(/\[\[DATA_ATUAL\]\]/g, dataAtualFormatada());
    textoVerso = textoVerso.replace(/\[\[CIDADE_SERVENTIA\]\]/g, DADOS_SERVENTIA.cidade || '');
    textoVerso = textoVerso.replace(/\[\[UF_SERVENTIA\]\]/g, DADOS_SERVENTIA.uf || '');

    // Conteúdo Principal do Verso
    const anotacoes = dados?.anotacoesAverbacoes || 'Nenhuma.';
    textoVerso = textoVerso.replace(/\[\[ANOTACOES_AVERBACOES_VERSO\]\]/g, anotacoes);

    return textoVerso;
}

export const preencherTemplate = (ato: any, config: any) => {
    // 1. Validação e Seleção do Template
    if (!ato || !config.tipoCertidao) return '';
    const template = templatesCertidao[config.tipoCertidao];
    if (!template) {
        return '<p style="color: red; text-align: center;">Modelo de certidão não encontrado para este serviço.</p>';
    }

    let textoFinal = template;
    const dados = ato.dadosCompletos;

    // 2. Substituições Globais (servem para todos os templates)
    textoFinal = textoFinal.replace(/\[\[MATRICULA\]\]/g, ato.matricula || '');
    textoFinal = textoFinal.replace(/\[\[DATA_ATUAL\]\]/g, dataAtualFormatada());

    // DADOS DA SERVENTIA (usando a constante importada)
    textoFinal = textoFinal.replace(/\[\[CNS_SERVENTIA\]\]/g, DADOS_SERVENTIA.cns || '');
    textoFinal = textoFinal.replace(/\[\[CIDADE_SERVENTIA\]\]/g, DADOS_SERVENTIA.cidade || '');
    textoFinal = textoFinal.replace(/\[\[UF_SERVENTIA\]\]/g, DADOS_SERVENTIA.uf || '');
    textoFinal = textoFinal.replace(/\[\[ENDERECO_SERVENTIA\]\]/g, DADOS_SERVENTIA.endereco || '');
    textoFinal = textoFinal.replace(/\[\[CEP_SERVENTIA\]\]/g, DADOS_SERVENTIA.cep || '');


    // DADOS DO OFICIAL (usando a constante importada)
    textoFinal = textoFinal.replace(/\[\[NOME_OFICIAL\]\]/g, DADOS_OFICIAL.nome || '');
    textoFinal = textoFinal.replace(/\[\[CARGO_OFICIAL\]\]/g, DADOS_OFICIAL.cargo || '');

    // DADOS DO ESCREVENTE (usando a constante importada)
    textoFinal = textoFinal.replace(/\[\[NOME_ESCREVENTE\]\]/g, DADOS_ESCREVENTE.nome || '');
    textoFinal = textoFinal.replace(/\[\[CARGO_ESCREVENTE\]\]/g, DADOS_ESCREVENTE.cargo || '');

    // 3. Substituições Específicas por Tipo de Ato
    if (ato.tipoAto === 'Nascimento' && dados) {
        const dataNasc = new Date(dados.dataNascimento);

        textoFinal = textoFinal.replace(/\[\[NOME_REGISTRADO\]\]/g, ato.nomePrincipal || '');
        textoFinal = textoFinal.replace(/\[\[CPF\]\]/g, dados.cpf || 'Não informado');
        textoFinal = textoFinal.replace(/\[\[DATA_NASCIMENTO_EXTENSO\]\]/g, formatarDataExtenso(dados.dataNascimento));
        textoFinal = textoFinal.replace(/\[\[HORARIO_NASCIMENTO\]\]/g, formatarHora(dados.dataNascimento));

        if (!isNaN(dataNasc.getTime())) {
            textoFinal = textoFinal.replace(/\[\[DIA_NASC\]\]/g, String(dataNasc.getUTCDate()).padStart(2, '0'));
            textoFinal = textoFinal.replace(/\[\[MES_NASC\]\]/g, String(dataNasc.getUTCMonth() + 1).padStart(2, '0'));
            textoFinal = textoFinal.replace(/\[\[ANO_NASC\]\]/g, String(dataNasc.getUTCFullYear()));
        }

        textoFinal = textoFinal.replace(/\[\[LOCAL_NASCIMENTO\]\]/g, dados.localNascimento || '');
        textoFinal = textoFinal.replace(/\[\[MUNICIPIO_NATURALIDADE\]\]/g, dados.municipioNascimento || '');
        textoFinal = textoFinal.replace(/\[\[UF_NATURALIDADE\]\]/g, dados.ufNascimento || '');
        textoFinal = textoFinal.replace(/\[\[SEXO\]\]/g, dados.sexo || '');
        textoFinal = textoFinal.replace(/\[\[DATA_REGISTRO_EXTENSO\]\]/g, formatarDataExtenso(dados.dataRegistro));
        textoFinal = textoFinal.replace(/\[\[DNV\]\]/g, dados.dnv || '');
        textoFinal = textoFinal.replace(/\[\[ANOTACOES_AVERBACOES\]\]/g, dados.anotacoesAverbacoes || 'Nenhuma.');

        // NOVO: Adicionando informações de gêmeos (condicionalmente)
        if (dados.gemeo && dados.gemeo.nome && dados.gemeo.matricula) {
            textoFinal = textoFinal.replace(/\[\[GEMEO_INFO\]\]/g, `Sim, gêmeo(a) ${dados.gemeo.nome}, matrícula ${dados.gemeo.matricula}`);
        } else {
            textoFinal = textoFinal.replace(/\[\[GEMEO_INFO\]\]/g, 'Não há informações sobre gêmeos.');
        }

        // NOVO: Adicionando anotações de cadastro
        textoFinal = textoFinal.replace(/\[\[ANOTACOES_CADASTRO\]\]/g, dados.anotacoesCadastro || '');

        if (dados.filiacao && dados.filiacao[0]) {
            const genitor1 = dados.filiacao[0];
            textoFinal = textoFinal.replace(/\[\[NOME_GENITOR_1\]\]/g, genitor1.nome || '');
            textoFinal = textoFinal.replace(/\[\[MUNICIPIO_NASC_GENITOR_1\]\]/g, genitor1.naturalidade || '');
            textoFinal = textoFinal.replace(/\[\[UF_NASC_GENITOR_1\]\]/g, genitor1.ufNaturalidade || '');
            textoFinal = textoFinal.replace(/\[\[AVOS_GENITOR_1\]\]/g, genitor1.avos?.map((a: any) => a.nome).join('; ') || '');
        }
        if (dados.filiacao && dados.filiacao[1]) {
            const genitor2 = dados.filiacao[1];
            textoFinal = textoFinal.replace(/\[\[NOME_GENITOR_2\]\]/g, genitor2.nome || '');
            textoFinal = textoFinal.replace(/\[\[MUNICIPIO_NASC_GENITOR_2\]\]/g, genitor2.naturalidade || '');
            textoFinal = textoFinal.replace(/\[\[UF_NASC_GENITOR_2\]\]/g, genitor2.ufNaturalidade || '');
            textoFinal = textoFinal.replace(/\[\[AVOS_GENITOR_2\]\]/g, genitor2.avos?.map((a: any) => a.nome).join('; ') || '');
        }
    }

    if (ato.tipoAto === 'Casamento' && dados) {
        // Preenche os dados do primeiro cônjuge
        if (dados.conjuges && dados.conjuges[0]) {
            const conjuge1 = dados.conjuges[0];
            textoFinal = textoFinal.replace(/\[\[NOME_ATUAL_CONJUGE_1\]\]/g, conjuge1.nomeAtual || '');
            textoFinal = textoFinal.replace(/\[\[CPF_CONJUGE_1\]\]/g, conjuge1.cpf || '');
            textoFinal = textoFinal.replace(/\[\[NOME_HABILITACAO_CONJUGE_1\]\]/g, conjuge1.nomeHabilitacao || '');
            textoFinal = textoFinal.replace(/\[\[DATA_NASC_CONJUGE_1\]\]/g, formatarDataExtenso(conjuge1.dataNascimento));

            const dataNascConjuge1 = new Date(conjuge1.dataNascimento);

            if (!isNaN(dataNascConjuge1.getTime())) {
                textoFinal = textoFinal.replace(/\[\[DIA_NASC_CONJUGE_1\]\]/g, String(dataNascConjuge1.getUTCDate()).padStart(2, '0'));
                textoFinal = textoFinal.replace(/\[\[MES_NASC_CONJUGE_1\]\]/g, String(dataNascConjuge1.getUTCMonth() + 1).padStart(2, '0'));
                textoFinal = textoFinal.replace(/\[\[ANO_NASC_CONJUGE_1\]\]/g, String(dataNascConjuge1.getUTCFullYear()));
            }

            textoFinal = textoFinal.replace(/\[\[NACIONALIDADE_CONJUGE_1\]\]/g, conjuge1.nacionalidade || 'Brasileira');
            textoFinal = textoFinal.replace(/\[\[ESTADO_CIVIL_ANTERIOR_CONJUGE_1\]\]/g, conjuge1.estadoCivilAnterior || '');
            textoFinal = textoFinal.replace(/\[\[MUNICIPIO_NASC_CONJUGE_1\]\]/g, conjuge1.municipioNascimento || '');
            textoFinal = textoFinal.replace(/\[\[UF_NASC_CONJUGE_1\]\]/g, conjuge1.ufNascimento || '');
            textoFinal = textoFinal.replace(/\[\[GENITORES_CONJUGE_1\]\]/g, conjuge1.genitores?.map((p: any) => p.nome).join('; ') || '');
            textoFinal = textoFinal.replace(/\[\[NOME_APOS_CASAMENTO_CONJUGE_1\]\]/g, conjuge1.nomeAtual || '');
        }

        // Preenche os dados do segundo cônjuge
        if (dados.conjuges && dados.conjuges[1]) {
            const conjuge2 = dados.conjuges[1];
            textoFinal = textoFinal.replace(/\[\[NOME_ATUAL_CONJUGE_2\]\]/g, conjuge2.nomeAtual || '');
            textoFinal = textoFinal.replace(/\[\[CPF_CONJUGE_2\]\]/g, conjuge2.cpf || '');
            textoFinal = textoFinal.replace(/\[\[NOME_HABILITACAO_CONJUGE_2\]\]/g, conjuge2.nomeHabilitacao || '');
            textoFinal = textoFinal.replace(/\[\[DATA_NASC_CONJUGE_2\]\]/g, formatarDataExtenso(conjuge2.dataNascimento));

            const dataNascConjuge2 = new Date(conjuge2.dataNascimento);

            if (!isNaN(dataNascConjuge2.getTime())) {
                textoFinal = textoFinal.replace(/\[\[DIA_NASC_CONJUGE_2\]\]/g, String(dataNascConjuge2.getUTCDate()).padStart(2, '0'));
                textoFinal = textoFinal.replace(/\[\[MES_NASC_CONJUGE_2\]\]/g, String(dataNascConjuge2.getUTCMonth() + 1).padStart(2, '0'));
                textoFinal = textoFinal.replace(/\[\[ANO_NASC_CONJUGE_2\]\]/g, String(dataNascConjuge2.getUTCFullYear()));
            }

            textoFinal = textoFinal.replace(/\[\[NACIONALIDADE_CONJUGE_2\]\]/g, conjuge2.nacionalidade || 'Brasileira');
            textoFinal = textoFinal.replace(/\[\[ESTADO_CIVIL_ANTERIOR_CONJUGE_2\]\]/g, conjuge2.estadoCivilAnterior || '');
            textoFinal = textoFinal.replace(/\[\[MUNICIPIO_NASC_CONJUGE_2\]\]/g, conjuge2.municipioNascimento || '');
            textoFinal = textoFinal.replace(/\[\[UF_NASC_CONJUGE_2\]\]/g, conjuge2.ufNascimento || '');
            textoFinal = textoFinal.replace(/\[\[GENITORES_CONJUGE_2\]\]/g, conjuge2.genitores?.map((p: any) => p.nome).join('; ') || '');
            textoFinal = textoFinal.replace(/\[\[NOME_APOS_CASAMENTO_CONJUGE_2\]\]/g, conjuge2.nomeAtual || '');
        }

        // Preenche os dados gerais do casamento
        textoFinal = textoFinal.replace(/\[\[DATA_CELEBRACAO_EXTENSO\]\]/g, formatarDataExtenso(dados.dataCelebracao));
        textoFinal = textoFinal.replace(/\[\[REGIME_BENS\]\]/g, dados.regimeBens || '');
        textoFinal = textoFinal.replace(/\[\[DATA_REGISTRO_EXTENSO\]\]/g, formatarDataExtenso(dados.dataRegistro));
        textoFinal = textoFinal.replace(/\[\[ANOTACOES_AVERBACOES\]\]/g, dados.anotacoesAverbacoes || 'Nenhuma.');
        textoFinal = textoFinal.replace(/\[\[ANOTACOES_CADASTRO\]\]/g, dados.anotacoesCadastro || 'Nenhuma.');
    }

    if (ato.tipoAto === 'Obito' && dados) {
        textoFinal = textoFinal.replace(/\[\[NOME_FALECIDO\]\]/g, ato.nomePrincipal || '');
        textoFinal = textoFinal.replace(/\[\[CPF_FALECIDO\]\]/g, dados.cpf || 'Não informado');
        textoFinal = textoFinal.replace(/\[\[IDADE_FALECIDO\]\]/g, dados.idade || '');
        textoFinal = textoFinal.replace(/\[\[SEXO\]\]/g, dados.sexo || '');
        textoFinal = textoFinal.replace(/\[\[ESTADO_CIVIL\]\]/g, dados.estadoCivil || '');
        textoFinal = textoFinal.replace(/\[\[ULTIMO_CONJUGE\]\]/g, dados.ultimoConjuge || 'Não se aplica');
        textoFinal = textoFinal.replace(/\[\[DATA_OBITO_EXTENSO\]\]/g, formatarDataExtenso(dados.dataObito));
        textoFinal = textoFinal.replace(/\[\[DATA_NASC_FALECIDO_EXTENSO\]\]/g, formatarDataExtenso(dados.dataNascimento));

        const dataNascFalecido = new Date(dados.dataNascimento);

        if (!isNaN(dataNascFalecido.getTime())) {
            textoFinal = textoFinal.replace(/\[\[DIA_NASC_FALECIDO\]\]/g, String(dataNascFalecido.getUTCDate()).padStart(2, '0'));
            textoFinal = textoFinal.replace(/\[\[MES_NASC_FALECIDO\]\]/g, String(dataNascFalecido.getUTCMonth() + 1).padStart(2, '0'));
            textoFinal = textoFinal.replace(/\[\[ANO_NASC_FALECIDO\]\]/g, String(dataNascFalecido.getUTCFullYear()));
        }

        const dataObito = new Date(dados.dataObito);

        if (!isNaN(dataObito.getTime())) {
            textoFinal = textoFinal.replace(/\[\[DIA_OBITO\]\]/g, String(dataObito.getUTCDate()).padStart(2, '0'));
            textoFinal = textoFinal.replace(/\[\[MES_OBITO\]\]/g, String(dataObito.getUTCMonth() + 1).padStart(2, '0'));
            textoFinal = textoFinal.replace(/\[\[ANO_OBITO\]\]/g, String(dataObito.getUTCFullYear()));
        }

        textoFinal = textoFinal.replace(/\[\[HORARIO_OBITO\]\]/g, formatarHora(dados.dataObito));
        textoFinal = textoFinal.replace(/\[\[LOCAL_FALECIMENTO\]\]/g, dados.localFalecimento || '');
        textoFinal = textoFinal.replace(/\[\[MUNICIPIO_FALECIMENTO\]\]/g, dados.municipioFalecimento || '');
        textoFinal = textoFinal.replace(/\[\[UF_FALECIMENTO\]\]/g, dados.ufFalecimento || '');
        textoFinal = textoFinal.replace(/\[\[CAUSA_MORTE\]\]/g, dados.causaMorte?.join(', ') || '');

        if (dados.medico) {
            textoFinal = textoFinal.replace(/\[\[NOME_MEDICO\]\]/g, dados.medico.nome || '');
            textoFinal = textoFinal.replace(/\[\[DOC_MEDICO\]\]/g, dados.medico.documento || '');
        }

        textoFinal = textoFinal.replace(/\[\[LOCAL_SEPULTAMENTO\]\]/g, dados.localSepultamento || '');
        textoFinal = textoFinal.replace(/\[\[MUNICIPIO_SEPULTAMENTO\]\]/g, dados.municipioSepultamento || '');
        textoFinal = textoFinal.replace(/\[\[UF_SEPULTAMENTO\]\]/g, dados.ufSepultamento || '');
        textoFinal = textoFinal.replace(/\[\[DATA_REGISTRO_EXTENSO\]\]/g, formatarDataExtenso(dados.dataRegistro));

        const dataRegistro = new Date(dados.dataRegistro);

        if (!isNaN(dataRegistro.getTime())) {
            textoFinal = textoFinal.replace(/\[\[DIA_REGISTRO\]\]/g, String(dataRegistro.getUTCDate()).padStart(2, '0'));
            textoFinal = textoFinal.replace(/\[\[MES_REGISTRO\]\]/g, String(dataRegistro.getUTCMonth() + 1).padStart(2, '0'));
            textoFinal = textoFinal.replace(/\[\[ANO_REGISTRO\]\]/g, String(dataRegistro.getUTCFullYear()));
        }

        textoFinal = textoFinal.replace(/\[\[NOME_DECLARANTE\]\]/g, dados.declarante || '');
        textoFinal = textoFinal.replace(/\[\[BENS\]\]/g, dados.bens || 'Não informado');
        textoFinal = textoFinal.replace(/\[\[FILHOS\]\]/g, dados.filhos?.map((f: any) => `${f.nome} (${f.idade} anos)`).join('; ') || 'Não deixou filhos.');
        textoFinal = textoFinal.replace(/\[\[GENITORES_FALECIDO\]\]/g, dados.genitores?.map((p: any) => p.nome).join('; ') || '');
        textoFinal = textoFinal.replace(/\[\[ANOTACOES_AVERBACOES\]\]/g, dados.anotacoesAverbacoes || 'Nenhuma.');
    }


    textoFinal = textoFinal.replace(/\[\[(?!SELO_E_QRCODE).*?\]\]/g, '');

    return textoFinal;
};