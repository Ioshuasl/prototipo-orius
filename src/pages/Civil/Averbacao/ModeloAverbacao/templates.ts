const averbacaoDivorcioHTML = `
<div style="font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.6; text-align: justify;">
    <p>
        À margem do termo de casamento de <strong>[[NOME_CONJUGE_1]]</strong> e <strong>[[NOME_CONJUGE_2]]</strong>,
        lavrado neste Serviço Registral no Livro [[LIVRO_CASAMENTO]], Folha [[FOLHA_CASAMENTO]], sob o número [[TERMO_CASAMENTO]],
        procedo à presente averbação, na data de hoje, para constar que, por mandado judicial expedido em [[DATA_MANDADO]],
        pelo Juízo de Direito da <strong>[[JUIZO]]</strong>, nos autos da Ação de Divórcio, processo nº [[NUMERO_PROCESSO]],
        foi decretado o divórcio do casal.
    </p>
    <p>
        Em consequência do divórcio, o(a) cônjuge varoa volta a usar o nome de solteira:
        <strong>[[NOME_SOLTEIRA_CONJUGE_MULHER]]</strong>.
    </p>
    <p>
        A sentença transitou em julgado em <strong>[[DATA_TRANSITO_EM_JULGADO]]</strong>.
        O referido é verdade e dou fé.
    </p>
    <p style="text-align: right; margin-top: 20px;">
        [[CIDADE_SERVENTIA]], [[DATA_ATUAL_EXTENSO]].
    </p>
    <p style="text-align: center; margin-top: 40px;">
        __________________________________________________<br>
        <strong>[[NOME_OFICIAL]]</strong><br>
        [[CARGO_OFICIAL]]
    </p>
</div>
`;

const averbacaoPaternidadeHTML = `
<div style="font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.6; text-align: justify;">
    <p>
        À margem do termo de nascimento de <strong>[[NOME_REGISTRADO_ORIGINAL]]</strong>,
        lavrado neste Serviço Registral no Livro [[LIVRO_NASCIMENTO]], Folha [[FOLHA_NASCIMENTO]], sob o número [[TERMO_NASCIMENTO]],
        procedo à presente averbação, para constar que o(a) mesmo(a) foi reconhecido(a) como filho(a) por
        <strong>[[NOME_NOVO_PAI]]</strong>, passando a ter também os avós paternos:
        <strong>[[AVOS_PATERNOS]]</strong>.
    </p>
    <p>
        Em virtude do reconhecimento, o(a) registrado(a) passa a assinar:
        <strong>[[NOME_NOVO_REGISTRADO]]</strong>.
    </p>
    <p>
        A presente averbação é feita nos termos do(a) [[INSTRUMENTO_RECONHECIMENTO]] apresentado(a).
        O referido é verdade e dou fé.
    </p>
    <p style="text-align: right; margin-top: 20px;">
        [[CIDADE_SERVENTIA]], [[DATA_ATUAL_EXTENSO]].
    </p>
    <p style="text-align: center; margin-top: 40px;">
        __________________________________________________<br>
        <strong>[[NOME_OFICIAL]]</strong><br>
        [[CARGO_OFICIAL]]
    </p>
</div>
`;

const averbacaoAlteracaoNomeHTML = `
<div style="font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.6; text-align: justify;">
    <p>
        À margem do termo de <strong>[[TIPO_ATO_ORIGINAL]]</strong> de <strong>[[NOME_ANTIGO]]</strong>,
        lavrado neste Serviço Registral no Livro [[LIVRO_ORIGINAL]], Folha [[FOLHA_ORIGINAL]], sob o número [[TERMO_ORIGINAL]],
        procedo à presente averbação para constar que, por força de [[MOTIVO_ALTERACAO]], o(a) registrado(a)
        passa a assinar e se chamar: <strong>[[NOME_NOVO]]</strong>.
    </p>
    <p>
        A presente averbação é feita nos termos da documentação apresentada.
        O referido é verdade e dou fé.
    </p>
    <p style="text-align: right; margin-top: 20px;">
        [[CIDADE_SERVENTIA]], [[DATA_ATUAL_EXTENSO]].
    </p>
    <p style="text-align: center; margin-top: 40px;">
        __________________________________________________<br>
        <strong>[[NOME_OFICIAL]]</strong><br>
        [[CARGO_OFICIAL]]
    </p>
</div>
`;

const averbacaoObitoHTML = `
<div style="font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.6; text-align: justify;">
    <p>
        À margem do termo de <strong>[[TIPO_ATO_ORIGINAL]]</strong> de <strong>[[NOME_REGISTRADO]]</strong>,
        lavrado neste Serviço Registral no Livro [[LIVRO_ORIGINAL]], Folha [[FOLHA_ORIGINAL]], sob o número [[TERMO_ORIGINAL]],
        procedo à presente averbação para constar o <strong>FALECIMENTO</strong> do(a) registrado(a), ocorrido em
        <strong>[[DATA_OBITO_EXTENSO]]</strong>, na cidade de [[LOCAL_OBITO]].
    </p>
    <p>
        O respectivo óbito foi registrado neste Serviço Registral no Livro C nº [[LIVRO_OBITO]], Folha [[FOLHA_OBITO]],
        sob o Termo nº [[TERMO_OBITO]]. O referido é verdade e dou fé.
    </p>
    <p style="text-align: right; margin-top: 20px;">
        [[CIDADE_SERVENTIA]], [[DATA_ATUAL_EXTENSO]].
    </p>
    <p style="text-align: center; margin-top: 40px;">
        __________________________________________________<br>
        <strong>[[NOME_OFICIAL]]</strong><br>
        [[CARGO_OFICIAL]]
    </p>
</div>
`;

const averbacaoRetificacaoHTML = `
<div style="font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.6; text-align: justify;">
    <p>
        À margem do termo de <strong>[[TIPO_ATO_ORIGINAL]]</strong> de <strong>[[NOME_REGISTRADO]]</strong>,
        lavrado neste Serviço Registral no Livro [[LIVRO_ORIGINAL]], Folha [[FOLHA_ORIGINAL]], sob o número [[TERMO_ORIGINAL]],
        procedo à presente averbação para <strong>RETIFICAR</strong> [[CAMPO_CORRIGIDO]], para que, onde se lia
        "[[DADO_INCORRETO]]", leia-se corretamente: "<strong>[[DADO_CORRETO]]</strong>".
    </p>
    <p>
        A presente retificação é feita nos termos de [[MOTIVO_RETIFICACAO]].
        O referido é verdade e dou fé.
    </p>
    <p style="text-align: right; margin-top: 20px;">
        [[CIDADE_SERVENTIA]], [[DATA_ATUAL_EXTENSO]].
    </p>
    <p style="text-align: center; margin-top: 40px;">
        __________________________________________________<br>
        <strong>[[NOME_OFICIAL]]</strong><br>
        [[CARGO_OFICIAL]]
    </p>
</div>
`;

const averbacaoCancelamentoInterdicaoHTML = `
<div style="font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.6; text-align: justify;">
    <p>
        À margem do termo de INTERDIÇÃO de <strong>[[NOME_INTERDITADO]]</strong>,
        lavrado neste Serviço Registral no Livro [[LIVRO_ORIGINAL]], Folha [[FOLHA_ORIGINAL]], sob o número [[TERMO_ORIGINAL]],
        procedo à presente averbação para constar o <strong>CANCELAMENTO</strong> da referida interdição,
        restabelecendo-se a capacidade civil plena do(a) anteriormente interditado(a).
    </p>
    <p>
        A presente averbação é feita em cumprimento ao mandado judicial expedido pelo Juízo de Direito da
        <strong>[[JUIZO_CANCELAMENTO]]</strong>, extraído dos autos do processo nº [[NUMERO_PROCESSO_CANCELAMENTO]],
        com sentença proferida em <strong>[[DATA_SENTENCA_CANCELAMENTO]]</strong>.
        O referido é verdade e dou fé.
    </p>
    <p style="text-align: right; margin-top: 20px;">
        [[CIDADE_SERVENTIA]], [[DATA_ATUAL_EXTENSO]].
    </p>
    <p style="text-align: center; margin-top: 40px;">
        __________________________________________________<br>
        <strong>[[NOME_OFICIAL]]</strong><br>
        [[CARGO_OFICIAL]]
    </p>
</div>
`;

const averbacaoDissolucaoUniaoEstavelHTML = `
<div style="font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.6; text-align: justify;">
    <p>
        À margem do termo de registro de UNIÃO ESTÁVEL de <strong>[[NOME_CONVIVENTE_1]]</strong> e
        <strong>[[NOME_CONVIVENTE_2]]</strong>, lavrado neste Serviço Registral no Livro [[LIVRO_ORIGINAL]],
        Folha [[FOLHA_ORIGINAL]], sob o número [[TERMO_ORIGINAL]], procedo à presente averbação para constar a
        <strong>DISSOLUÇÃO</strong> da referida união estável.
    </p>
    <p>
        A dissolução foi formalizada por meio de [[INSTRUMENTO_DISSOLUCAO]].
    </p>
    <p>[[INFO_ALTERACAO_NOME]]</p> <p>
        O referido é verdade e dou fé.
    </p>
    <p style="text-align: right; margin-top: 20px;">
        [[CIDADE_SERVENTIA]], [[DATA_ATUAL_EXTENSO]].
    </p>
    <p style="text-align: center; margin-top: 40px;">
        __________________________________________________<br>
        <strong>[[NOME_OFICIAL]]</strong><br>
        [[CARGO_OFICIAL]]
    </p>
</div>
`;


export const templatesAverbacao: Record<string, string> = {
    1: averbacaoPaternidadeHTML,
    8: averbacaoDivorcioHTML,
    2: averbacaoAlteracaoNomeHTML,
    9: averbacaoObitoHTML,
    3: averbacaoRetificacaoHTML,
    21: averbacaoCancelamentoInterdicaoHTML,
    24: averbacaoDissolucaoUniaoEstavelHTML,
};