import { type ReciboTemplate } from "../Civil/types";
import { type ServiceRecord } from "../Caixa/Servicos/Gerenciamento-Servicos";

export function generateReciboHtml(template: ReciboTemplate, service: ServiceRecord): string {
    let htmlContent = template.conteudo;
    
    const variables = {
        '{{ SERVICO_PROTOCOLO }}': service.protocol,
        '{{ CLIENTE_NOME }}': service.clientName,
        '{{ SERVICO_TIPO }}': service.serviceType,
        '{{ SERVICO_SISTEMA }}': service.sistema,
        '{{ SERVICO_DATA_HORA }}': service.registrationDate.toLocaleString('pt-BR'),
        '{{ SERVICO_VALOR }}': `R$ ${service.value.toFixed(2)}`,
        '{{ SERVICO_SELO }}': service.sealNumber.length > 0 ? service.sealNumber.join(', ') : 'Não possui',
        '{{ MATRICULA_CERTIDAO }}': '123456-01-2025-001234-56'
    };
    
    for (const placeholder in variables) {
        const regex = new RegExp(placeholder, 'g');
        htmlContent = htmlContent.replace(regex, (variables as any)[placeholder]);
    }

    return htmlContent;
}