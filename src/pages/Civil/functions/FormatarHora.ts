export const formatarHora = (dataString: string): string => {
    if (!dataString) return '';
    const data = new Date(dataString);
    if (isNaN(data.getTime())) return '';
    
    return data.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC'
    });
}