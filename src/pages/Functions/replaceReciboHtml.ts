import { type ReciboTemplate } from "../Civil/types";
// Usamos o tipo ServiceRecord como base, assumindo BalcaoServiceRecord é compatível
import { type ServiceRecord } from "../Caixa/Servicos/Gerenciamento-Servicos"; 

// --- DADOS MOCKADOS DE SISTEMA (ASSUMIMOS QUE ESTÃO EM CONSTANTS) ---
// Em um sistema real, estes viriam de um contexto ou API de configuração.
const DADOS_SERVENTIA = {
    nome: '1º Tabelionato de Notas e Registro Civil',
    cidade: 'Goiânia',
    uf: 'GO',
    endereco: 'Av. Exemplo, 1000, Centro',
};
const DADOS_OFICIAL = {
    nome: 'Beltrano de Tal',
    cargo: 'Oficial Designado',
};

// Combinamos ServiceRecord e BalcaoServiceRecord em uma única função, 
// pois elas compartilham as propriedades necessárias.
export function generateReciboHtml(template: ReciboTemplate, service: ServiceRecord): string {
    let htmlContent = template.conteudo;
    
    // Mapeamento completo de variáveis dinâmicas
    const variables = new Map<string, string>([
        // Variáveis de Serviço/Transação
        ['{{ SERVICO_PROTOCOLO }}', service.protocol],
        ['{{ CLIENTE_NOME }}', service.clientName],
        ['{{ SERVICO_TIPO }}', service.serviceType],
        ['{{ SERVICO_SISTEMA }}', service.sistema],
        ['{{ SERVICO_DATA_HORA }}', service.registrationDate.toLocaleString('pt-BR')],
        ['{{ SERVICO_DATA }}', service.registrationDate.toLocaleDateString('pt-BR')],
        ['{{ SERVICO_VALOR }}', `R$ ${service.value.toFixed(2)}`],
        ['{{ SERVICO_VALOR_EXTENSO }}', 'Duzentos e Cinquenta Reais (Simulado)'],
        ['{{ SERVICO_SELO }}', service.sealNumber.length > 0 ? service.sealNumber.join(', ') : 'Não possui'],
        // Variável de Exemplo (Mantida do original, deve ser preenchida externamente)
        ['{{ MATRICULA_CERTIDAO }}', '123456-01-2025-001234-56'], 

        // Variáveis do Sistema/Serventia (Dados Fixos)
        ['{{ SERVENTIA_NOME }}', DADOS_SERVENTIA.nome],
        ['{{ SERVENTIA_CIDADE }}', DADOS_SERVENTIA.cidade],
        ['{{ SERVENTIA_UF }}', DADOS_SERVENTIA.uf],
        ['{{ SERVENTIA_ENDERECO }}', DADOS_SERVENTIA.endereco],
        ['{{ OFICIAL_NOME }}', DADOS_OFICIAL.nome],
        ['{{ OFICIAL_CARGO }}', DADOS_OFICIAL.cargo],
    ]);
    
    // Iteração e Substituição
    variables.forEach((value, placeholder) => {
        // Usa a regex para substituir globalmente todas as ocorrências do placeholder
        const regex = new RegExp(placeholder.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
        htmlContent = htmlContent.replace(regex, value);
    });

    return htmlContent;
}