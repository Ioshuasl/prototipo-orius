export const recibo_simples = `
            <div style="font-family: sans-serif; padding: 20px;">
                <h3 style="text-align: center; font-size: 20px; color: #555; margin-bottom: 30px;">Recibo de Serviço</h3>
                
                <div style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                    <p><strong>Protocolo:</strong> {{ SERVICO_PROTOCOLO }}</p>
                    <p><strong>Cliente:</strong> {{ CLIENTE_NOME }}</p>
                    <p><strong>Serviço:</strong> {{ SERVICO_TIPO }}</p>
                    <p><strong>Data e Hora:</strong> {{ SERVICO_DATA_HORA }}</p>
                </div>
                
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; text-align: right; margin-bottom: 30px;">
                    <p style="margin: 0; font-size: 18px; color: #333;"><strong>Valor Total:</strong> <span style="font-size: 22px; font-weight: bold; color: #dd6825;">{{ SERVICO_VALOR }}</span></p>
                </div>
            </div>
        `
export const recibo_averbacao = `
            <div style="font-family: sans-serif; padding: 20px;">
                <h3 style="text-align: center; font-size: 20px; color: #555; margin-bottom: 30px;">Recibo para Averbação de Divórcio</h3>
                
                <p>Recibo dos serviços de averbação de divórcio na matrícula {{ MATRICULA_CERTIDAO }}.</p>
                
                <div style="font-size: 16px; line-height: 1.6; margin-top: 20px;">
                    <p><strong>Protocolo:</strong> {{ SERVICO_PROTOCOLO }}</p>
                    <p><strong>Data e Hora:</strong> {{ SERVICO_DATA_HORA }}</p>
                    <p><strong>Selo:</strong> {{ SERVICO_SELO }}</p>
                </div>

                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; text-align: right; margin-top: 30px;">
                    <p style="margin: 0; font-size: 18px; color: #333;"><strong>Valor Total:</strong> <span style="font-size: 22px; font-weight: bold; color: #dd6825;">{{ SERVICO_VALOR }}</span></p>
                </div>
            </div>
        `