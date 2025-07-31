// 1. Emancipação
export const infoEmancipacao = {
    title: 'Registro de Emancipação (Art. 710)',
    content: (
        <div className="space-y-3">
            <p>O registro de emancipação torna uma pessoa menor de idade plenamente capaz para os atos da vida civil. Ele é feito no <strong>Livro E</strong> do cartório do domicílio do emancipado.</p>
            <p><strong>O que deve constar:</strong></p>
            <ul className="list-disc list-inside pl-4 space-y-1">
                <li>Data do registro no cartório.</li>
                <li>Origem: dados da escritura pública ou da sentença judicial que concedeu a emancipação.</li>
                <li>Qualificação completa da pessoa que foi emancipada.</li>
                <li>Nome dos pais ou do tutor responsáveis.</li>
            </ul>
        </div>
    )
};

// 2. Interdição
export const infoInterdicao = {
    title: 'Registro de Interdição (Art. 711)',
    content: (
        <div className="space-y-3">
            <p>Este ato dá publicidade à uma sentença judicial que declarou uma pessoa incapaz de praticar certos atos da vida civil, nomeando um curador para assisti-la.</p>
            <p><strong>O que deve constar:</strong></p>
            <ul className="list-disc list-inside pl-4 space-y-1">
                <li>Data do registro no cartório.</li>
                <li>Dados da Sentença (data, juízo e nome do magistrado).</li>
                <li>Qualificação completa do Interdito (pessoa declarada incapaz).</li>
                <li>A causa da interdição e os limites da curatela (quais atos a pessoa não pode praticar).</li>
                <li>Qualificação completa do Curador nomeado.</li>
            </ul>
        </div>
    )
};

// 3. Ausência
export const infoAusencia = {
    title: 'Declaração de Ausência (Art. 712)',
    content: (
        <div className="space-y-3">
            <p>O registro da sentença declaratória de ausência é lavrado no <strong>Livro E</strong> do cartório do domicílio anterior da pessoa desaparecida.</p>
            <p><strong>O que deve constar:</strong></p>
            <ul className="list-disc list-inside pl-4 space-y-1">
                <li>Data do registro.</li>
                <li>Dados da Sentença (data, juízo e nome do magistrado).</li>
                <li>Qualificação completa da pessoa declarada Ausente.</li>
                <li>A causa da ausência e os poderes do curador nomeado.</li>
                <li>Qualificação completa do Curador.</li>
            </ul>
        </div>
    )
};

// 4. Morte Presumida
export const infoMortePresumida = {
    title: 'Declaração de Morte Presumida (Art. 713)',
    content: (
        <div className="space-y-3">
            <p>Este registro é feito a partir de uma sentença judicial que declara a morte de uma pessoa ausente, quando há alta probabilidade do seu falecimento. É registrado no cartório do último domicílio do ausente.</p>
            <p><strong>O que deve constar:</strong></p>
            <ul className="list-disc list-inside pl-4 space-y-1">
                <li>Data do registro.</li>
                <li>Dados da Sentença (data, juízo e nome do magistrado).</li>
                <li>Qualificação completa da pessoa cuja morte foi presumida.</li>
                <li>A data provável do falecimento, conforme definido pelo juiz.</li>
            </ul>
        </div>
    )
};

// 5. União Estável
export const infoUniaoEstavel = {
    title: 'Registro de União Estável (Arts. 727 e 730)',
    content: (
        <div className="space-y-3">
            <p>Este ato registra o reconhecimento ou a dissolução de uma união estável, que pode ter sido formalizada por escritura pública, sentença judicial ou instrumento particular. O registro é facultativo.</p>
            <p><strong>O que deve constar:</strong></p>
            <ul className="list-disc list-inside pl-4 space-y-1">
                <li>Qualificação completa de ambos os companheiros.</li>
                <li>Dados do título que formalizou a união (escritura, sentença, etc.).</li>
                <li>Regime de bens adotado pelo casal.</li>
                <li>Informação sobre alteração de nome, se houver.</li>
            </ul>
        </div>
    )
};

// 6. Opção de Nacionalidade
export const infoOpcaoNacionalidade = {
    title: 'Registro de Opção de Nacionalidade (Art. 720)',
    content: (
        <div className="space-y-3">
            <p>Este registro formaliza a escolha pela nacionalidade brasileira por parte de pessoa que tem o direito a esta opção, conforme a Constituição. O ato é feito a partir de um mandado judicial.</p>
            <p><strong>O que deve constar:</strong></p>
            <ul className="list-disc list-inside pl-4 space-y-1">
                <li>Data do registro.</li>
                <li>Qualificação completa do Optante.</li>
                <li>Dados da Sentença (data, juízo, nome do magistrado e data do trânsito em julgado).</li>
            </ul>
        </div>
    )
};

// 7. Tutela
export const infoTutela = {
    title: 'Registro de Tutela (Art. 722)',
    content: (
        <div className="space-y-3">
            <p>A Tutela é registrada para dar proteção a menores cujos pais faleceram, foram declarados ausentes ou perderam o poder familiar. O registro é feito a partir de um mandado judicial.</p>
            <p><strong>O que deve constar:</strong></p>
            <ul className="list-disc list-inside pl-4 space-y-1">
                <li>Qualificação completa do Tutelado (menor).</li>
                <li>Qualificação completa do Tutor nomeado.</li>
                <li>Eventuais limitações aos poderes do tutor, se especificadas na sentença.</li>
            </ul>
        </div>
    )
};

// 8. Guarda
export const infoGuarda = {
    title: 'Registro de Guarda (Art. 724)',
    content: (
        <div className="space-y-3">
            <p>O registro de Guarda é feito quando a guarda de um menor é concedida por um juiz a uma pessoa que não detém o poder familiar. É formalizado a partir de um mandado judicial.</p>
            <p><strong>O que deve constar:</strong></p>
            <ul className="list-disc list-inside pl-4 space-y-1">
                <li>Qualificação completa do Menor.</li>
                <li>Qualificação completa do Guardião nomeado.</li>
            </ul>
             <p>A sentença definitiva de guarda será, posteriormente, averbada à margem deste registro.</p>
        </div>
    )
};

// 9. Nascimento de Estrangeiros
export const infoNascimentoPaisEstrangeiros = {
    title: 'Nascimento de Filho de Estrangeiros a Serviço',
    content: (
        <div className="space-y-3">
            <p>Este registro se aplica ao nascimento, em território brasileiro, de uma criança cujos pais são estrangeiros e pelo menos um deles está a serviço de seu país de origem.</p>
            <p>O registro conterá todos os dados de um nascimento comum, mas com uma observação obrigatória.</p>
             <p className="p-3 bg-red-50 text-red-900 rounded-md font-semibold">"O registrando não possui a nacionalidade brasileira, nos termos do art. 12, inciso I, alínea ‘a’ da Constituição da República Federativa do Brasil".</p>
        </div>
    )
};

// 10. Traslado
export const infoTrasladoExterior = {
    title: 'Traslado de Assento do Exterior (Res. 155 CNJ)',
    content: (
        <div className="space-y-3">
            <p>O traslado serve para dar validade e publicidade no Brasil a um registro de nascimento, casamento ou óbito de um brasileiro ocorrido no exterior.</p>
            <p>O registro pode ser feito a partir de:</p>
            <ul className="list-disc list-inside pl-4 space-y-1">
                <li>Uma <strong>certidão emitida por consulado brasileiro</strong>; ou</li>
                <li>Uma <strong>certidão emitida por órgão estrangeiro</strong> (neste caso, ela deve ser legalizada e traduzida por tradutor juramentado).</li>
            </ul>
            <p>O requerente deve apresentar a certidão original e declarar seu domicílio no Brasil.</p>
        </div>
    )
};

// 11. Formato da Averbação (Adicionado anteriormente)
export const infoFormatoAverbacao = {
    title: 'Formatos de Averbação: Etiqueta ou A4?',
    content: (
        <div className="space-y-4">
            <p className="font-semibold">Em resumo: o termo da averbação é registrado em formato de etiqueta ou digitalmente no livro. A folha A4 é usada para a nova certidão atualizada que se entrega ao cliente.</p>
            
            <div>
                <h3 className="font-bold text-gray-800 mb-2">1. O Ato de Averbar (No Livro do Cartório)</h3>
                <p>O ato de "averbar" significa anotar uma mudança na margem do registro original. Isso pode ser feito de duas formas principais:</p>
                <ul className="list-disc list-inside pl-4 mt-2 space-y-1">
                    <li><strong>Etiqueta Impressa (Livros Físicos):</strong> O texto do termo de averbação é impresso em uma etiqueta de segurança e colado diretamente na margem da folha do livro físico. Esta é a prática moderna mais comum.</li>
                    <li><strong>Registro Digital (Acervo Eletrônico):</strong> Em sistemas digitais, a averbação é um novo registro de texto vinculado eletronicamente ao registro original, sem alterar o dado antigo.</li>
                </ul>
            </div>

            <div>
                <h3 className="font-bold text-gray-800 mb-2">2. A Emissão da Certidão (Para o Cliente)</h3>
                <p>O formato A4 (em papel de segurança) é utilizado para o documento final que é entregue ao cliente: a <strong>Certidão</strong>.</p>
                <p className="mt-2">Quando um cliente solicita uma 2ª via atualizada, o sistema gera um novo documento A4 que combina os dados do registro original com o texto de todas as averbações existentes, apresentando-as no campo "Anotações e Averbações".</p>
            </div>
        </div>
    )
};