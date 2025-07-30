export const formatarDataExtenso = (dataString: string): string => {
    if (!dataString) return '';
    // CORREÇÃO: Apenas cria o objeto Date a partir da string ISO completa.
    const data = new Date(dataString);
    if (isNaN(data.getTime())) return 'Data Inválida'; // Retorna um aviso se a data for inválida
    
    return data.toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'
    });
};