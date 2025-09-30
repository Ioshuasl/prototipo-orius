// BalcaoPreview.tsx (COMPLETO E ATUALIZADO)
import React, { useMemo } from 'react';
import { type IBalcaoTemplate } from '../Types'; 
import { type TPessoaTipo } from '../../Types';
import { type DADOS_SERVENTIA } from '../lib/Constants'; 
import { type IPessoaSimples } from '../../Types';

interface BalcaoPreviewProps {
    template: IBalcaoTemplate;
    clientData: Partial<TPessoaTipo>;
    serventiaData: typeof DADOS_SERVENTIA;
    quantidade: number; 
    // NOVO: Lista de testemunhas
    testemunhas: Partial<IPessoaSimples>[]; 
}

const BalcaoPreview: React.FC<BalcaoPreviewProps> = ({
    template,
    clientData,
    serventiaData,
    quantidade, 
    testemunhas,
}) => {
    // Função auxiliar para formatar a qualificação da pessoa (nome, documento)
    const formatQualificacao = (pessoa: Partial<IPessoaSimples>) => {
        if (!pessoa.nome) return `(Não Registrado)`;
        
        const doc = pessoa.cpf || pessoa.docIdentidadeNum;
        const docText = doc ? `(CPF/RG: ${doc})` : '(Doc. Não Informado)';
        
        return `${pessoa.nome} ${docText}`;
    };

    // Função para substituir placeholders no conteúdo do template
    const renderedContent = useMemo(() => {
        let content = template.conteudo;

        // Dados Genéricos da Pessoa
        const nomePessoa = clientData.tipo === 'fisica' ? (clientData as any).nome : (clientData as any).razaoSocial;
        const cpfCnpj = clientData.tipo === 'fisica' ? (clientData as any).cpf : (clientData as any).cnpj;
        
        // Substituições Comuns
        content = content.replace(/\{\{\s*NOME_FIRMA\s*\}\}/g, nomePessoa || '____________');
        content = content.replace(/\{\{\s*CPF_CNPJ\s*\}\}/g, cpfCnpj || '____________');
        content = content.replace(/\{\{\s*DATA\s*\}\}/g, new Date().toLocaleDateString('pt-BR'));
        content = content.replace(/\{\{\s*HORA\s*\}\}/g, new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
        
        // Placeholders de Serventia
        content = content.replace(/\{\{\s*CNS\s*\}\}/g, serventiaData.cns);
        content = content.replace(/\{\{\s*CIDADE\s*\}\}/g, serventiaData.cidade);
        content = content.replace(/\{\{\s*UF\s*\}\}/g, serventiaData.uf);

        // PLACEHOLDER PARA QUANTIDADE
        content = content.replace(/\{\{\s*QUANTIDADE_ATOS\s*\}\}/g, String(quantidade));


        // --- Lógica de Participantes Adicionais ---

        // 1. Rogatário
        if (template.id === 'BALCAO-REC-001') {
            // Lógica original, que usa nomeMae como simulação de rogatário. 
            // Em uma implementação real, usaria a prop `rogatarioData` do ServiceState.
            const rogatario = (clientData as any).nomeMae || ''; 
            content = content.replace(/\{\{\s*NOME_ROGATARIO\s*\}\}/g, rogatario);
        }

        // 2. Testemunhas (NOVO)
        if (testemunhas.length > 0) {
            const listaTestemunhasHtml = testemunhas.map((t, index) => {
                return `<li>Testemunha ${index + 1}: ${formatQualificacao(t)}</li>`;
            }).join('');
            
            // Placeholder genérico para lista de testemunhas.
            content = content.replace(/\{\{\s*LISTA_TESTEMUNHAS\s*\}\}/g, `<div style="margin-top: 5px; font-style: italic;">Testemunhas:</div><ul style="margin-left: 20px;">${listaTestemunhasHtml}</ul>`);
        
            // Placeholders individuais
            content = content.replace(/\{\{\s*TESTEMUNHA_1_NOME\s*\}\}/g, testemunhas[0]?.nome || '____________');
            content = content.replace(/\{\{\s*TESTEMUNHA_2_NOME\s*\}\}/g, testemunhas[1]?.nome || '____________');
            
        } else {
             // Limpa o placeholder se não houver testemunhas
             content = content.replace(/\{\{\s*LISTA_TESTEMUNHAS\s*\}\}/g, 'Não houve intervenção de testemunhas.');
             content = content.replace(/\{\{\s*TESTEMUNHA_1_NOME\s*\}\}/g, '____________');
             content = content.replace(/\{\{\s*TESTEMUNHA_2_NOME\s*\}\}/g, '____________');
        }


        // Se for um template de Reconhecimento Autêntico (BALCAO-REC-002)
        if (template.id === 'BALCAO-REC-002') {
            const doc = (clientData as any).docIdentidadeNum || (clientData as any).cpf;
            content = content.replace(/\{\{\s*CPF_RG\s*\}\}/g, doc || 'não identificado');
        }

        return content;
    }, [template.conteudo, clientData, serventiaData, quantidade, testemunhas]); // 'testemunhas' como dependência

    // Estilos para simular o layout físico da etiqueta
    const previewStyle: React.CSSProperties = {
        width: `${template.layout.largura_mm}mm`,
        height: `${template.layout.altura_mm}mm`,
        padding: `${template.margins.top}mm ${template.margins.right}mm ${template.margins.bottom}mm ${template.margins.left}mm`,
        border: '1px solid #3b82f6', // Borda azul para destacar a etiqueta
        backgroundColor: '#fff',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        fontSize: '10pt',
        margin: '0 auto',
    };

    return (
        <div className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg">
            <p className="text-gray-500 mb-3 text-sm">Dimensões: {template.layout.largura_mm}mm x {template.layout.altura_mm}mm</p>
            <div style={previewStyle}>
                <div dangerouslySetInnerHTML={{ __html: renderedContent }} />
            </div>
            {template.id_selo && (
                <p className="mt-3 text-xs text-center text-gray-600">
                    Selo Digital: **{template.id_selo}** - **{quantidade}** Unidade(s)
                </p>
            )}
        </div>
    );
};

export default BalcaoPreview;