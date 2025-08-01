export const certidaoNascimentoHTML = `
    <div class="certidao">
        <h2 style="text-align: center; font-size: 18pt; font-weight: bold; margin-bottom: 0px; color: #000;">CERTIDÃO DE NASCIMENTO</h2>
        <div style="display:flex; flex-direction: column;align-items: center; flex: 1;">
            <p style="margin: 0px;">Nome:</p>
            <input type="text" name="" id="" value="[[NOME_REGISTRADO]]"
                style="border: none; width: 100%; text-align: center;">
        </div>

        <div style="display:flex; flex-direction: column;align-items: center;">
            <p style="margin: 0px;">Número do CPF:</p>
            <input type="text" name="" id="" value="[[CPF]]"
                style="border: 1px solid #000000; width: 100%; text-align: center;">
        </div>

        <div style="display:flex; flex-direction: column;align-items: center; flex: 1;">
            <p style="margin: 0px;">Matrícula:</p>
            <input type="text" value="[[MATRICULA]]"
                style="border: none; width: 100%; text-align: center; font-size: 16px; font-weight: bold; margin-bottom: 10px;">
        </div>

        <div style="display: flex; gap: 20px; flex: 1;">
            <div style="display:flex; flex-direction: column; flex:3;">
                <p style="margin: 0px;">Data de nascimento por extenso:</p>
                <input type="text" value="[[DATA_NASCIMENTO_EXTENSO]]"
                    style="border: 1px solid #000000; width: 100%; text-align: center;">
            </div>

            <div style="display: flex; flex: 1; gap:20px;">
                <div style="display:flex; flex-direction: column; flex: 1; align-items: center">
                    <p style="margin: 0px;">Dia:</p>
                    <input type="text" value="[[DIA_NASC]]" style="border: 1px solid #000000; width: 100%; text-align: center;">
                </div>
                <div style="display:flex; flex-direction: column; flex: 1; align-items: center">
                    <p style="margin: 0px;">Mês:</p>
                    <input type="text" value="[[MES_NASC]]" style="border: 1px solid #000000; width: 100%; text-align: center;">
                </div>
                <div style="display:flex; flex-direction: column; flex: 1; align-items: center">
                    <p style="margin: 0px;">Ano:</p>
                    <input type="text" value="[[ANO_NASC]]" style="border: 1px solid #000000; width: 100%; text-align: center;">
                </div>
            </div>
        </div>

        <div style="display: flex; gap: 20px; flex: 1;">
            <div style="display: flex; flex-direction: column; flex: 1.2;">
                <p style="margin: 0px;">Horário de nascimento:</p>
                <input type="text" value="[[HORARIO_NASCIMENTO]] horas"
                    style="border: 1px solid #000000; width: 100%; text-align: center;">
            </div>

            <div style="display: flex; flex-direction: column; flex: 2;">
                <p style="margin: 0px;">Município da naturalidade</p>
                <input type="text" value="[[MUNICIPIO_NATURALIDADE]]"
                    style="border: 1px solid #000000; width: 100%; text-align: center;">
            </div>

            <div style="display: flex; flex-direction: column; flex: 0.3; align-items: center">
                <p style="margin: 0px;">UF:</p>
                <input type="text" value="[[UF_NATURALIDADE]]" style="border: 1px solid #000000; width: 100%; text-align: center;">
            </div>
        </div>

        <div style="display: flex; gap: 20px; flex: 1;">
            <div style="display: flex; flex-direction: column; flex: 2.5;">
                <p style="margin: 0px;">Local de nascimento:</p>
                <input type="text" value="[[LOCAL_NASCIMENTO]]"
                    style="border: 1px solid #000000; width: 100%; text-align: center;">
            </div>

            <div style="display: flex; flex-direction: column; flex: 2.5;">
                <p style="margin: 0px;">Município de nascimento:</p>
                <input type="text" value="[[MUNICIPIO_NASCIMENTO]]"
                    style="border: 1px solid #000000; width: 100%; text-align: center;">
            </div>

            <div style="display: flex; flex-direction: column; flex: 0.3; align-items: center">
                <p style="margin: 0px;">UF:</p>
                <input type="text" value="[[UF_NASCIMENTO]]" style="border: 1px solid #000000; width: 100%; text-align: center;">
            </div>

            <div style="display: flex; flex-direction: column; flex: 1;">
                <p style="margin: 0px;">Sexo:</p>
                <input type="text" value="[[SEXO]]" style="border: 1px solid #000000; width: 100%; text-align: center;">
            </div>

        </div>

        <div style="display: flex; gap: 20px; flex: 1;">
            <div style="display: flex; flex-direction: column; flex: 1.5;">
                <p style="margin: 0px;">Nome do(a) Genitor(a):</p>
                <input type="text" value="[[NOME_GENITOR_1]]" style="border: 1px solid #000000; width: 100%; text-align: center;">
            </div>

            <div style="display: flex; flex-direction: column; flex: 1;">
                <p style="margin: 0px;">Município de nascimento</p>
                <input type="text" value="Município de nascimento "
                    style="border: 1px solid #000000; width: 100%; text-align: center;">
            </div>

            <div style="display: flex; flex-direction: column; flex: 0.5; align-items: center">
                <p style="margin: 0px;">UF:</p>
                <input type="text" value="UF" style="border: 1px solid #000000; width: 100%; text-align: center;">
            </div>
        </div>

        <div style="display: flex; flex-direction: column; flex: 1;">
            <p style="margin: 0px;">Avô(ó)(s) respectivo(s):</p>
            <input type="text"
                value="[[AVOS_GENITOR_1]]"
                style="border: 1px solid #000000; width: 100%; text-align: center;">
        </div>

        <div style="display: flex; gap: 20px; flex: 1;">
            <div style="display: flex; flex-direction: column; flex: 1.5;">
                <p style="margin: 0px;">Genitor(a):</p>
                <input type="text" value="[[NOME_GENITOR_2]]" style="border: 1px solid #000000; width: 100%; text-align: center;">
            </div>

            <div style="display: flex; flex-direction: column; flex: 1;">
                <p style="margin: 0px;">Município de nascimento</p>
                <input type="text" value="Município de nascimento"
                    style="border: 1px solid #000000; width: 100%; text-align: center;">
            </div>

            <div style="display: flex; flex-direction: column; flex: 1; align-items: center; flex: 0.5;">
                <p style="margin: 0px;">UF:</p>
                <input type="text" value="UF" style="border: 1px solid #000000; width: 100%; text-align: center;">
            </div>
        </div>

        <div style="display: flex; flex-direction: column; flex: 1;">
            <p style="margin: 0px;">Avô(ó)(s) respectivo(s):</p>
            <input type="text"
                value="[[AVOS_GENITOR_2]]"
                style="border: 1px solid #000000; width: 100%; text-align: center;">
        </div>

        <div style="display: flex; flex-direction: column; flex: 1;">
            <p style="margin: 0px;">Gêmeo:</p>
            <input type="text"
                value="[[GEMEO_INFO]]"
                style="border: 1px solid #000000; width: 100%; text-align: center;">
        </div>

        <div style="display: flex; gap: 20px; flex: 1;">
            <div style="display: flex; flex-direction: column; flex: 1;">
                <p style="margin: 0px;">Data do Registro:</p>
                <input type="text" value="[[DATA_REGISTRO_EXTENSO]]"
                    style="border: 1px solid #000000; width: 100%; text-align: center;">
            </div>

            <div style="display: flex; flex-direction: column; flex: 1;">
                <p style="margin: 0px;">DNV:</p>
                <input type="text" value="[[DNV]]"
                    style="border: 1px solid #000000; width: 100%; text-align: center;">
            </div>
        </div>

        <div style="display: flex; flex-direction: column; flex: 1;">
            <p style="margin: 0px;">Anotações/Averbações:</p>
            <input type="text" value="[[ANOTACOES_AVERBACOES]]"
                style="border: 1px solid #000000; width: 100%; text-align: center;">
        </div>

        <div style="display: flex; flex-direction: column; flex: 1;">
            <p style="margin: 0px;">Anotações voluntárias de cadastro:</p>
            <input type="text" value="[[ANOTACOES_CADASTRO]] "
                style="border: 1px solid #000000; width: 100%; text-align: center;">
        </div>

    <!-- Rodapé -->
    <div style="display: flex; flex: 1; gap: 20px; font-size: 8pt; margin-top:15px;">
        <div style="display: flex; flex-direction: column; text-align: center; flex: 1;">
            <p style="margin: 0px;">CNS nº [[CNS_SERVENTIA]]</p>
            <p style="margin: 0px;"><strong>Oficial de Registro Civil de Pessoas Naturais</strong></p>
            <p style="margin: 0px;">[[CIDADE_SERVENTIA]] – [[UF_SERVENTIA]]</p>
            <br>
            <p style="margin: 0px;"><strong>[[NOME_OFICIAL]]</strong></p>
            <p style="margin: 0px;">[[CARGO_OFICIAL]]</p>
            <br>
            <p style="margin: 0px;">[[ENDERECO_SERVENTIA]]</p>
            <p style="margin: 0px;">[[CEP_SERVENTIA]] – [[CIDADE_SERVENTIA]] – [[UF_SERVENTIA]]</p>
        </div>
        <div style="display: flex; flex-direction: column; text-align: center; flex: 1;">
            <p style="margin: 0px;">O conteúdo da certidão é verdadeiro. Dou fé.</p>
            <br>
            <p style="margin: 0px;">[[CIDADE_SERVENTIA]] – [[UF_SERVENTIA]], [[DATA_ATUAL]].</p>
            <br>
            <p style="margin: 0px;"><strong>(assinatura)</strong></p>
            <p style="margin: 0px;"><strong>[[NOME_ESCREVENTE]]</strong></p>
            <p style="margin: 0px;">[[CARGO_ESCREVENTE]]</p>
        </div>
    </div>
</div>
`;

export const certidaoCasamentoHTML = `
<div class="certidao">
    <h2 style="text-align: center; font-size: 15pt; margin-bottom: 0px; color: #000;">CERTIDÃO DE CASAMENTO</h2>

    <!-- Nome atual dos cônjuges -->
    <div style="display: flex; width: 100%; gap: 20px;">
        <div style="display:flex; flex-direction: column; width: 200%;">
            <p style="margin: 0px;">Nome atual dos cônjuges:</p>
            <input type="text" name="" id="" value="[[NOME_ATUAL_CONJUGE_1]]" style="border: 1px solid #000000; width: 100%;">
        </div>
        <div style="display:flex; flex-direction: column; width: 100%;">
            <p style="margin: 0px;">Número do CPF:</p>
            <input type="text" name="" id="" value="[[CPF_CONJUGE_1]]"
                style="border: 1px solid #000000; width: 100%; text-align: center;">
        </div>
    </div>

    <div style="display: flex; width: 100%; gap: 20px;">
        <div style="display:flex; flex-direction: column; margin-top: 10px; width: 200%;">
            <input type="text" name="" id="" value="[[NOME_ATUAL_CONJUGE_2]]" style="border: 1px solid #000000; width: 100%;">
        </div>
        <div style="display:flex; flex-direction: column; margin-top: 10px; width: 100%;">
            <input type="text" name="" id="" value="[[CPF_CONJUGE_2]]"
                style="border: 1px solid #000000; width: 100%; text-align: center;">
        </div>
    </div>

    <!-- Matrícula -->
    <div style="display:flex; flex-direction: column; align-items: center; margin-top: 10px;">
        <p style="margin: 0px;">Matrícula:</p>
        <input type="text" value="[[MATRICULA]]"
            style="border: none; width: 100%; text-align: center; font-size: 16px; font-weight: bold;">
    </div>

    <!-- 1º Cônjuge -->
    <div>
        <div style="display: flex; flex-direction: column;">
            <div style="display: flex; gap: 20px; flex: 1;">
                <div style="display:flex; flex-direction: column; flex:3;">
                    <p style="margin: 0px;"><strong>1º Cônjuge:</strong></p>
                    <input type="text" value="[[NOME_HABILITACAO_CONJUGE_1]]"
                        style="border: 1px solid #000000; width: 100%; text-align: center;">
                </div>

                <div style="display: flex; flex: 1; gap:20px;">
                    <div style="display:flex; flex-direction: column; flex: 1; align-items: center">
                        <p style="margin: 0px;">Dia:</p>
                        <input type="text" value="[[DIA_NASC_CONJUGE_1]]"
                            style="border: 1px solid #000000; width: 100%; text-align: center;">
                    </div>
                    <div style="display:flex; flex-direction: column; flex: 1; align-items: center">
                        <p style="margin: 0px;">Mês:</p>
                        <input type="text" value="[[MES_NASC_CONJUGE_1]]"
                            style="border: 1px solid #000000; width: 100%; text-align: center;">
                    </div>
                    <div style="display:flex; flex-direction: column; flex: 1; align-items: center">
                        <p style="margin: 0px;">Ano:</p>
                        <input type="text" value="[[ANO_NASC_CONJUGE_1]]"
                            style="border: 1px solid #000000; width: 100%; text-align: center;">
                    </div>
                </div>
            </div>

            <div style="display: flex; flex: 1; gap: 20px;">
                <div style="flex: 1;">
                    <p style="margin: 0px;">Nacionalidade:</p>
                    <input type="text" value="[[NACIONALIDADE_CONJUGE_1]]"
                        style="border: 1px solid #000000; width: 100%; text-align: center;">
                </div>
                <div style="flex: 1;">
                    <p style="margin: 0px;">Estado Civil:</p>
                    <input type="text" value="[[ESTADO_CIVIL_ANTERIOR_CONJUGE_1]]"
                        style="border: 1px solid #000000; width: 100%; text-align: center;">
                </div>
                <div style="flex: 1;">
                    <p style="margin: 0px;">Município de nascimento:</p>
                    <input type="text" value="[[MUNICIPIO_NASC_CONJUGE_1]]"
                        style="border: 1px solid #000000; width: 100%; text-align: center;">
                </div>
                <div style="flex: 0.23;">
                    <p style="margin: 0px;">UF:</p>
                    <input type="text" value="[[UF_NASC_CONJUGE_1]]" style="border: 1px solid #000000; width: 100%; text-align: center;">
                </div>
            </div>
            <div style="flex: 2;">
                <p style="margin: 0px;">Genitor(es):</p>
                <input type="text" value="[[GENITORES_CONJUGE_1]]"
                    style="border: 1px solid #000000; width: 100%; text-align: center;">
            </div>
            <div style="flex: 2;">
                <p style="margin: 0px;">Nome que passou a utilizar:</p>
                <input type="text" value="[[NOME_APOS_CASAMENTO_CONJUGE_1]]"
                    style="border: 1px solid #000000; width: 100%; text-align: center;">
            </div>
        </div>
    </div>

    <!-- 2º Cônjuge -->
    <div>
        <div style="display: flex; flex-direction: column;">
            <div style="display: flex; gap: 20px; flex: 1;">
                <div style="display:flex; flex-direction: column; flex:3;">
                    <p style="margin: 0px;"><strong>2º Cônjuge:</strong></p>
                    <input type="text" value="[[NOME_HABILITACAO_CONJUGE_2]]"
                        style="border: 1px solid #000000; width: 100%; text-align: center;">
                </div>

                <div style="display: flex; flex: 1; gap:20px;">
                    <div style="display:flex; flex-direction: column; flex: 1; align-items: center">
                        <p style="margin: 0px;">Dia:</p>
                        <input type="text" value="[[DIA_NASC_CONJUGE_2]]"
                            style="border: 1px solid #000000; width: 100%; text-align: center;">
                    </div>
                    <div style="display:flex; flex-direction: column; flex: 1; align-items: center">
                        <p style="margin: 0px;">Mês:</p>
                        <input type="text" value="[[MES_NASC_CONJUGE_2]]"
                            style="border: 1px solid #000000; width: 100%; text-align: center;">
                    </div>
                    <div style="display:flex; flex-direction: column; flex: 1; align-items: center">
                        <p style="margin: 0px;">Ano:</p>
                        <input type="text" value="[[ANO_NASC_CONJUGE_2]]"
                            style="border: 1px solid #000000; width: 100%; text-align: center;">
                    </div>
                </div>
            </div>

            <div style="display: flex; flex: 1; gap: 20px;">
                <div style="flex: 1;">
                    <p style="margin: 0px;">Nacionalidade:</p>
                    <input type="text" value="[[NACIONALIDADE_CONJUGE_2]]"
                        style="border: 1px solid #000000; width: 100%; text-align: center;">
                </div>
                <div style="flex: 1;">
                    <p style="margin: 0px;">Estado Civil:</p>
                    <input type="text" value="[[ESTADO_CIVIL_ANTERIOR_CONJUGE_2]]"
                        style="border: 1px solid #000000; width: 100%; text-align: center;">
                </div>
                <div style="flex: 1;">
                    <p style="margin: 0px;">Município de nascimento:</p>
                    <input type="text" value="[[MUNICIPIO_NASC_CONJUGE_2]]"
                        style="border: 1px solid #000000; width: 100%; text-align: center;">
                </div>
                <div style="flex: 0.23;">
                    <p style="margin: 0px;">UF:</p>
                    <input type="text" value="[[UF_NASC_CONJUGE_2]]" style="border: 1px solid #000000; width: 100%; text-align: center;">
                </div>
            </div>
            <div style="flex: 2;">
                <p style="margin: 0px;">Genitor(es):</p>
                <input type="text" value="[[GENITORES_CONJUGE_2]]"
                    style="border: 1px solid #000000; width: 100%; text-align: center;">
            </div>
            <div style="flex: 2;">
                <p style="margin: 0px;">Nome que passou a utilizar:</p>
                <input type="text" value="[[NOME_APOS_CASAMENTO_CONJUGE_2]]"
                    style="border: 1px solid #000000; width: 100%; text-align: center;">
            </div>
        </div>
    </div>

    <!-- Data da Celebração -->
    <div>
        <div style="display: flex; gap: 20px; flex: 1;">
            <div style="display:flex; flex-direction: column; flex:3;">
                <p style="margin: 0px;">Data da Celebração do casamento por extenso:</p>
                <input type="text" value="[[DATA_CELEBRACAO_EXTENSO]]"
                    style="border: 1px solid #000000; width: 100%; text-align: center;">
            </div>

            <div style="display: flex; flex: 1; gap:20px;">
                <div style="display:flex; flex-direction: column; flex: 1; align-items: center">
                    <p style="margin: 0px;">Dia:</p>
                    <input type="text" value="[[DIA_CELEBRACAO]]" style="border: 1px solid #000000; width: 100%; text-align: center;">
                </div>
                <div style="display:flex; flex-direction: column; flex: 1; align-items: center">
                    <p style="margin: 0px;">Mês:</p>
                    <input type="text" value="[[MES_CELEBRACAO]]" style="border: 1px solid #000000; width: 100%; text-align: center;">
                </div>
                <div style="display:flex; flex-direction: column; flex: 1; align-items: center">
                    <p style="margin: 0px;">Ano:</p>
                    <input type="text" value="[[ANO_CELEBRACAO]]" style="border: 1px solid #000000; width: 100%; text-align: center;">
                </div>
            </div>
        </div>
    </div>

    <!-- Regime de Bens -->
    <div>
        <p style="margin: 0px;">Regime de bens adotado:</p>
        <input type="text" value="[[REGIME_BENS]]"
            style="border: 1px solid #000000; width: 100%; text-align: center;">
    </div>

    <!-- Data de Registro -->
    <div>
        <div style="display: flex; gap: 20px; flex: 1;">
            <div style="display:flex; flex-direction: column; flex:3;">
                <p style="margin: 0px;">Data do Registro do casamento por extenso:</p>
                <input type="text" value="[[DATA_REGISTRO_EXTENSO]]"
                    style="border: 1px solid #000000; width: 100%; text-align: center;">
            </div>

            <div style="display: flex; flex: 1; gap:20px;">
                <div style="display:flex; flex-direction: column; flex: 1; align-items: center">
                    <p style="margin: 0px;">Dia:</p>
                    <input type="text" value="[[DIA_REGISTRO]]" style="border: 1px solid #000000; width: 100%; text-align: center;">
                </div>
                <div style="display:flex; flex-direction: column; flex: 1; align-items: center">
                    <p style="margin: 0px;">Mês:</p>
                    <input type="text" value="[[MES_REGISTRO]]" style="border: 1px solid #000000; width: 100%; text-align: center;">
                </div>
                <div style="display:flex; flex-direction: column; flex: 1; align-items: center">
                    <p style="margin: 0px;">Ano:</p>
                    <input type="text" value="[[ANO_REGISTRO]]" style="border: 1px solid #000000; width: 100%; text-align: center;">
                </div>
            </div>
        </div>
    </div>

    <!-- Anotações e Observações -->
    <div>
        <p style="margin: 0px;">Anotações/averbações registrais:</p>
        <textarea 
            rows="1" 
            style="border: 1px solid #000000; width: 100%; text-align: left; padding: 2px; resize: vertical; overflow-y: hidden;"
            oninput="this.style.height = 'auto'; this.style.height = (this.scrollHeight) + 'px';"
        >[[ANOTACOES_AVERBACOES]]</textarea>
    </div>
    <div>
        <p style="margin: 0px;">Anotações voluntárias de cadastro (só deve aparecer quando existir):</p>
        <textarea 
            rows="1" 
            style="border: 1px solid #000000; width: 100%; text-align: left; padding: 2px; resize: vertical; overflow-y: hidden;"
            oninput="this.style.height = 'auto'; this.style.height = (this.scrollHeight) + 'px';"
        >[[ANOTACOES_CADASTRO]]</textarea>
    </div>

    <!-- Rodapé -->
    <div style="display: flex; flex: 1; gap: 20px; font-size: 8pt; margin-top:15px;">
        <div style="display: flex; flex-direction: column; text-align: center; flex: 1;">
            <p style="margin: 0px;">CNS nº [[CNS_SERVENTIA]]</p>
            <p style="margin: 0px;"><strong>Oficial de Registro Civil de Pessoas Naturais</strong></p>
            <p style="margin: 0px;">[[CIDADE_SERVENTIA]] – [[UF_SERVENTIA]]</p>
            <br>
            <p style="margin: 0px;"><strong>[[NOME_OFICIAL]]</strong></p>
            <p style="margin: 0px;">[[CARGO_OFICIAL]]</p>
            <br>
            <p style="margin: 0px;">[[ENDERECO_SERVENTIA]]</p>
            <p style="margin: 0px;">[[CEP_SERVENTIA]] – [[CIDADE_SERVENTIA]] – [[UF_SERVENTIA]]</p>
        </div>
        <div style="display: flex; flex-direction: column; text-align: center; flex: 1;">
            <p style="margin: 0px;">O conteúdo da certidão é verdadeiro. Dou fé.</p>
            <br>
            <p style="margin: 0px;">[[CIDADE_SERVENTIA]] – [[UF_SERVENTIA]], [[DATA_ATUAL]].</p>
            <br>
            <p style="margin: 0px;"><strong>(assinatura)</strong></p>
            <p style="margin: 0px;"><strong>[[NOME_ESCREVENTE]]</strong></p>
            <p style="margin: 0px;">[[CARGO_ESCREVENTE]]</p>
        </div>
    </div>
</div>
`;

export const certidaoObitoHTML = `
<div class="certidao">
    <h2 style="text-align: center; font-size: 18pt; margin-bottom: 0px; color: #000;">CERTIDÃO DE ÓBITO</h2>
    <div style="display:flex; flex-direction: column;align-items: center; flex: 1;">
        <p style="margin: 0px;">Nome:</p>
        <input type="text" name="" id="" value="[[NOME_FALECIDO]]" style="border: none; width: 100%; text-align: center;">
    </div>

    <div style="display:flex; flex-direction: column;align-items: center;">
        <p style="margin: 0px;">Número do CPF:</p>
        <input type="text" name="" id="" value="[[CPF_FALECIDO]]"
            style="border: 1px solid #000000; width: 100%; text-align: center;">
    </div>

    <div style="display:flex; flex-direction: column;align-items: center; flex: 1;">
        <p style="margin: 0px;">Matrícula:</p>
        <input type="text" value="[[MATRICULA]]"
            style="border: none; width: 100%; text-align: center; font-size: 16px; font-weight: bold; margin-bottom: 10px;">
    </div>

    <div style="display: flex; gap: 20px; flex: 1;">
        <div style="display:flex; flex-direction: column; flex:1;">
            <p style="margin: 0px;">Data de nascimento por extenso:</p>
            <input type="text" value="[[DATA_NASC_FALECIDO_EXTENSO]]"
                style="border: 1px solid #000000; width: 100%; text-align: center;">
        </div>

        <div style="display: flex; flex: 1; gap:20px;">
            <div style="display:flex; flex-direction: column; flex: 0.4; align-items: center; justify-content: center;">
                <p style="margin: 0px;">Dia:</p>
                <input type="text" value="[[DIA_NASC_FALECIDO]]" style="border: 1px solid #000000; width: 100%; text-align: center;">
            </div>
            <div style="display:flex; flex-direction: column; flex: 0.4; align-items: center">
                <p style="margin: 0px;">Mês:</p>
                <input type="text" value="[[MES_NASC_FALECIDO]]" style="border: 1px solid #000000; width: 100%; text-align: center;">
            </div>
            <div style="display:flex; flex-direction: column; flex: 0.4; align-items: center">
                <p style="margin: 0px;">Ano:</p>
                <input type="text" value="[[ANO_NASC_FALECIDO]]" style="border: 1px solid #000000; width: 100%; text-align: center;">
            </div>
            <div style="display: flex; flex-direction: column; flex: 1; align-items: center; justify-content: center;">
                <p style="margin: 0px; font-size: 6pt">Horário do Falecimento:</p>
                <input type="text" value="[[HORARIO_OBITO]] horas"
                    style="border: 1px solid #000000; width: 100%; text-align: center;">
            </div>
        </div>
    </div>

    <div style="display: flex; gap: 20px; flex: 1;">

        <div style="display: flex; flex-direction: column; flex: 2;">
            <p style="margin: 0px;">Local de falecimento</p>
            <input type="text" value="[[LOCAL_FALECIMENTO]]"
                style="border: 1px solid #000000; width: 100%; text-align: center;">
        </div>

        <div style="display: flex; flex-direction: column; flex: 1;">
            <p style="margin: 0px;">Município de falecimento</p>
            <input type="text" value="[[MUNICIPIO_FALECIMENTO]]"
                style="border: 1px solid #000000; width: 100%; text-align: center;">
        </div>

        <div style="display: flex; flex-direction: column; flex: 0.3; align-items: center">
            <p style="margin: 0px;">UF:</p>
            <input type="text" value="[[UF_FALECIMENTO]]" style="border: 1px solid #000000; width: 100%; text-align: center;">
        </div>
    </div>

    <div style="display: flex; gap: 20px; flex: 1;">
        <div style="display: flex; flex-direction: column; flex: 1;">
            <p style="margin: 0px;">Sexo:</p>
            <input type="text" value="[[SEXO]]" style="border: 1px solid #000000; width: 100%; text-align: center;">
        </div>

        <div style="display: flex; flex-direction: column; flex: 1;">
            <p style="margin: 0px;">Estado Civil:</p>
            <input type="text" value="[[ESTADO_CIVIL]]" style="border: 1px solid #000000; width: 100%; text-align: center;">
        </div>

        <div style="display: flex; flex-direction: column; flex: 2.5;">
            <p style="margin: 0px;">Nome do último cônjuge ou convivente:</p>
            <input type="text" value="[[ULTIMO_CONJUGE]]"
                style="border: 1px solid #000000; width: 100%; text-align: center;">
        </div>

    </div>

    <div style="display: flex; gap: 20px; flex: 1;">
        <div style="display: flex; flex-direction: column; flex: 0.5;">
            <p style="margin: 0px;">Idade:</p>
            <input type="text" value="[[IDADE_FALECIDO]] anos" style="border: 1px solid #000000; width: 100%; text-align: center;">
        </div>

        <div style="display:flex; flex-direction: column; flex: 0.4; align-items: center">
            <p style="margin: 0px;">Dia:</p>
            <input type="text" value="[[DIA_OBITO]]" style="border: 1px solid #000000; width: 100%; text-align: center;">
        </div>
        <div style="display:flex; flex-direction: column; flex: 0.4; align-items: center">
            <p style="margin: 0px;">Mês:</p>
            <input type="text" value="[[MES_OBITO]]" style="border: 1px solid #000000; width: 100%; text-align: center;">
        </div>
        <div style="display:flex; flex-direction: column; flex: 0.4; align-items: center">
            <p style="margin: 0px;">Ano:</p>
            <input type="text" value="[[ANO_OBITO]]" style="border: 1px solid #000000; width: 100%; text-align: center;">
        </div>

        <div style="display: flex; flex-direction: column; flex: 1;">
            <p style="margin: 0px;">Município de falecimento</p>
            <input type="text" value="[[MUNICIPIO_FALECIMENTO]]"
                style="border: 1px solid #000000; width: 100%; text-align: center;">
        </div>

        <div style="display: flex; flex-direction: column; flex: 0.3; align-items: center">
            <p style="margin: 0px;">UF:</p>
            <input type="text" value="[[UF_FALECIMENTO]]" style="border: 1px solid #000000; width: 100%; text-align: center;">
        </div>
    </div>

    <div style="display: flex; flex-direction: column; flex: 1;">
        <p style="margin: 0px;">Genitor(es) do falecido:</p>
        <input type="text" value="[[GENITORES_FALECIDO]]"
            style="border: 1px solid #000000; width: 100%; text-align: center;">
    </div>

    <div style="display: flex; gap: 20px; flex: 1;">
        <div style="display: flex; flex-direction: column; flex: 1.5;">
            <p style="margin: 0px;">Causa da Morte:</p>
            <input type="text" value="[[CAUSA_MORTE]]"
                style="border: 1px solid #000000; width: 100%; text-align: center;">
        </div>
    </div>

    <div style="display: flex; flex: 1; gap: 20px;">
        <div style="display: flex; flex-direction: column; flex: 1;">
            <p style="margin: 0px;">Nome do médico que atestou o óbito ou, se for o caso, das testemunhas:</p>
            <input type="text" value="[[NOME_MEDICO]]"
                style="border: 1px solid #000000; width: 100%; text-align: center;">
        </div>

        <div style="display: flex; flex-direction: column; flex: 0.5;">
            <p style="margin: 0px;">Número do Documento:</p>
            <input type="text" value="[[DOC_MEDICO]]" style="border: 1px solid #000000; width: 100%; text-align: center;">
        </div>
    </div>

    <div style="display: flex; gap: 20px; flex: 1;">

        <div style="display: flex; flex-direction: column; flex: 1;">
            <p style="margin: 0px;">Local de Sepultamento:</p>
            <input type="text" value="[[LOCAL_SEPULTAMENTO]]"
                style="border: 1px solid #000000; width: 100%; text-align: center;">
        </div>

        <div style="display:flex; flex-direction: column; flex: 1; align-items: center">
            <p style="margin: 0px;">Município:</p>
            <input type="text" value="[[MUNICIPIO_SEPULTAMENTO]]" style="border: 1px solid #000000; width: 100%; text-align: center;">
        </div>

        <div style="display:flex; flex-direction: column; flex: 0.2; align-items: center">
            <p style="margin: 0px;">UF:</p>
            <input type="text" value="[[UF_SEPULTAMENTO]]" style="border: 1px solid #000000; width: 100%; text-align: center;">
        </div>
    </div>

    <div style="display: flex; gap: 20px; flex: 1;">
        <div style="display: flex; flex-direction: column; flex: 3;">
            <p style="margin: 0px;">Data do Registro:</p>
            <input type="text" value="[[DATA_REGISTRO_EXTENSO]]"
                style="border: 1px solid #000000; width: 100%; text-align: center;">
        </div>

        <div style="display:flex; flex-direction: column; flex: 0.4; align-items: center">
            <p style="margin: 0px;">Dia:</p>
            <input type="text" value="[[DIA_REGISTRO]]" style="border: 1px solid #000000; width: 100%; text-align: center;">
        </div>
        <div style="display:flex; flex-direction: column; flex: 0.4; align-items: center">
            <p style="margin: 0px;">Mês:</p>
            <input type="text" value="[[MES_REGISTRO]]" style="border: 1px solid #000000; width: 100%; text-align: center;">
        </div>
        <div style="display:flex; flex-direction: column; flex: 0.4; align-items: center">
            <p style="margin: 0px;">Ano:</p>
            <input type="text" value="[[ANO_REGISTRO]]" style="border: 1px solid #000000; width: 100%; text-align: center;">
        </div>
    </div>

    <div style="display: flex; gap: 20px; flex: 1.5;">
        <div style="display: flex; flex-direction: column; flex: 1;">
            <p style="margin: 0px;">Nome do Declarante:</p>
            <input type="text" value="[[NOME_DECLARANTE]]"
                style="border: 1px solid #000000; width: 100%; text-align: center;">
        </div>

        <div style="display:flex; flex-direction: column; flex: 1; align-items: center">
            <p style="margin: 0px;">Existência de bens:</p>
            <input type="text" value="[[BENS]]" style="border: 1px solid #000000; width: 100%; text-align: center;">
        </div>
        <div style="display:flex; flex-direction: column; flex: 2; align-items: center">
            <p style="margin: 0px;">Existência de filhos:</p>
            <input type="text" value="[[FILHOS]]"
                style="border: 1px solid #000000; width: 100%; text-align: center;">
        </div>
    </div>

    <!-- Anotações e Observações -->
    <div>
        <p style="margin: 0px;">Anotações/averbações registrais:</p>
        <textarea 
            rows="1" 
            style="border: 1px solid #000000; width: 100%; text-align: left; padding: 2px; resize: vertical; overflow-y: hidden;"
            oninput="this.style.height = 'auto'; this.style.height = (this.scrollHeight) + 'px';"
        >[[ANOTACOES_AVERBACOES]]</textarea>
    </div>
    <div>
        <p style="margin: 0px;">Anotações voluntárias de cadastro (só deve aparecer quando existir):</p>
        <textarea 
            rows="1" 
            style="border: 1px solid #000000; width: 100%; text-align: left; padding: 2px; resize: vertical; overflow-y: hidden;"
            oninput="this.style.height = 'auto'; this.style.height = (this.scrollHeight) + 'px';"
        >[[ANOTACOES_CADASTRO]]</textarea>
    </div>

    <!-- Rodapé -->
    <div style="display: flex; flex: 1; gap: 20px; font-size: 8pt; margin-top:15px;">
        <div style="display: flex; flex-direction: column; text-align: center; flex: 1;">
            <p style="margin: 0px;">CNS nº [[CNS_SERVENTIA]]</p>
            <p style="margin: 0px;"><strong>Oficial de Registro Civil de Pessoas Naturais</strong></p>
            <p style="margin: 0px;">[[CIDADE_SERVENTIA]] – [[UF_SERVENTIA]]</p>
            <br>
            <p style="margin: 0px;"><strong>[[NOME_OFICIAL]]</strong></p>
            <p style="margin: 0px;">[[CARGO_OFICIAL]]</p>
            <br>
            <p style="margin: 0px;">[[ENDERECO_SERVENTIA]]</p>
            <p style="margin: 0px;">[[CEP_SERVENTIA]] – [[CIDADE_SERVENTIA]] – [[UF_SERVENTIA]]</p>
        </div>
        <div style="display: flex; flex-direction: column; text-align: center; flex: 1;">
            <p style="margin: 0px;">O conteúdo da certidão é verdadeiro. Dou fé.</p>
            <br>
            <p style="margin: 0px;">[[CIDADE_SERVENTIA]] – [[UF_SERVENTIA]], [[DATA_ATUAL]].</p>
            <br>
            <p style="margin: 0px;"><strong>(assinatura)</strong></p>
            <p style="margin: 0px;"><strong>[[NOME_ESCREVENTE]]</strong></p>
            <p style="margin: 0px;">[[CARGO_ESCREVENTE]]</p>
        </div>
    </div>
</div>
`;

export const certidaoInteiroTeorHTML = `
<div class="certidao"">
    <h2 style="text-align: center; font-size: 18pt; margin-bottom: 0px; color: #000;">CERTIDÃO INTEIRO TEOR DE ...
    </h2>
    <div style="display:flex; flex-direction: column;align-items: center; flex: 1;">
        <p style="margin: 0px;">Nome:</p>
        <input type="text" name="" id="" value="NOME COMPLETO" style="border: none; width: 100%; text-align: center;">
    </div>

    <div style="display:flex; flex-direction: column;align-items: center;">
        <p style="margin: 0px;">Número do CPF:</p>
        <input type="text" name="" id="" value="000.000.000-00"
            style="border: 1px solid #000000; width: 100%; text-align: center;">
    </div>

    <div style="display:flex; flex-direction: column;align-items: center; flex: 1;">
        <p style="margin: 0px;">Matrícula:</p>
        <input type="text" value="000000 01 55 0000 1 00000 000 0000000 00"
            style="border: none; width: 100%; text-align: center; font-size: 16px; font-weight: bold; margin-bottom: 10px;">
    </div>

    <div style="display: flex; flex: 1;">
        <textarea style="flex: 1;" rows="6"></textarea>
    </div>

    <!-- Rodapé -->
    <div style="display: flex; flex: 1; gap: 20px; font-size: 8pt; margin-top:15px;">
        <div style="display: flex; flex-direction: column; text-align: center; flex: 1;">
            <p style="margin: 0px;">CNS nº [[CNS_SERVENTIA]]</p>
            <p style="margin: 0px;"><strong>Oficial de Registro Civil de Pessoas Naturais</strong></p>
            <p style="margin: 0px;">[[CIDADE_SERVENTIA]] – [[UF_SERVENTIA]]</p>
            <br>
            <p style="margin: 0px;"><strong>[[NOME_OFICIAL]]</strong></p>
            <p style="margin: 0px;">[[CARGO_OFICIAL]]</p>
            <br>
            <p style="margin: 0px;">[[ENDERECO_SERVENTIA]]</p>
            <p style="margin: 0px;">[[CEP_SERVENTIA]] – [[CIDADE_SERVENTIA]] – [[UF_SERVENTIA]]</p>
        </div>
        <div style="display: flex; flex-direction: column; text-align: center; flex: 1;">
            <p style="margin: 0px;">O conteúdo da certidão é verdadeiro. Dou fé.</p>
            <br>
            <p style="margin: 0px;">[[CIDADE_SERVENTIA]] – [[UF_SERVENTIA]], [[DATA_ATUAL]].</p>
            <br>
            <p style="margin: 0px;"><strong>(assinatura)</strong></p>
            <p style="margin: 0px;"><strong>[[NOME_ESCREVENTE]]</strong></p>
            <p style="margin: 0px;">[[CARGO_ESCREVENTE]]</p>
        </div>
    </div>
</div>
`;

export const certidaoVersoHTML = `
<div class="certidao"font-family: Arial, sans-serif; color: #000;">
    <h2 style="text-align: center; font-size: 16pt; font-weight: bold; margin-bottom: 20px;">
        VERSO - ANOTAÇÕES E AVERBAÇÕES
    </h2>

    <div style="text-align: left; font-size: 11pt; line-height: 1.6;">
        <p style="margin-top: 20px;">
            <strong>Continuação das Anotações e Averbações do registro de matrícula[[MATRICULA_VERSO]]:</strong>
        </p>
        <div style="border: 1px solid #ccc; padding: 15px; min-height: 400px; border-radius: 4px;">
            <p>[[ANOTACOES_AVERBACOES_VERSO]]</p>
        </div>
    </div>

    <div style="margin-top: 50px; text-align: center; font-size: 9pt;">
        <p>Este verso é parte integrante da certidão emitida na frente.</p>
        <p>O conteúdo da certidão é verdadeiro. Dou fé.</p>
        <br>
        <p>[[CIDADE_SERVENTIA]] – [[UF_SERVENTIA]], [[DATA_ATUAL]].</p>
    </div>
</div>
`;

export const templatesCertidao: Record<number, string> = {
    // Nascimento
    1: certidaoNascimentoHTML, // 1ª via
    2: certidaoNascimentoHTML, // 2ª via
    3: certidaoInteiroTeorHTML,

    // Casamento
    4: certidaoCasamentoHTML, // 1ª via
    5: certidaoCasamentoHTML, // 2ª via
    6: certidaoInteiroTeorHTML,


    // Óbito e Natimorto
    7: certidaoObitoHTML, // 1ª via Óbito
    8: certidaoObitoHTML, // 2ª via Óbito
    9: certidaoInteiroTeorHTML,
    14: certidaoObitoHTML, // 1ª via Natimorto
    15: certidaoObitoHTML, // 2ª via Natimorto

    // Livro E (usando um placeholder genérico por enquanto)
    16: `<h2 style="text-align: center;"><strong>CERTIDÃO DO LIVRO E</strong></h2><p>Ato: Emancipação de [[NOME_PRINCIPAL]]</p>`,
    17: `<h2 style="text-align: center;"><strong>CERTIDÃO DO LIVRO E</strong></h2><p>Ato: Interdição de [[NOME_PRINCIPAL]]</p>`,
    18: `<h2 style="text-align: center;"><strong>CERTIDÃO DO LIVRO E</strong></h2><p>Ato: Ausência de [[NOME_PRINCIPAL]]</p>`,
    // ... e assim por diante para os demais atos do Livro E.
};

export const templateVerso = certidaoVersoHTML