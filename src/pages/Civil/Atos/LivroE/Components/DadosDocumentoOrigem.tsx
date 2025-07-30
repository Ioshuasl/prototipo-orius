import React from 'react';

interface DadosDocumentoOrigemProps {
    origem: 'sentenca' | 'escritura' | 'instrumentoParticular';
    dados: any;
    pathPrefix: string;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export default function DadosDocumentoOrigem({ origem, dados, pathPrefix, handleInputChange }: DadosDocumentoOrigemProps) {
    const commonInputClass = "mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500";
    const commonLabelClass = "block text-sm font-medium text-gray-700";

    if (origem === 'sentenca') {
        return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-5 border-t pt-5 mt-5">
                <div className="md:col-span-2">
                    <label htmlFor={`${pathPrefix}.dadosSentenca.juizo`} className={commonLabelClass}>Juízo (Vara e Comarca)</label>
                    <input type="text" name={`${pathPrefix}.dadosSentenca.juizo`} value={dados?.dadosSentenca?.juizo || ''} onChange={handleInputChange} className={commonInputClass} />
                </div>
                <div className="md:col-span-2">
                    <label htmlFor={`${pathPrefix}.dadosSentenca.nomeMagistrado`} className={commonLabelClass}>Nome do Magistrado</label>
                    <input type="text" name={`${pathPrefix}.dadosSentenca.nomeMagistrado`} value={dados?.dadosSentenca?.nomeMagistrado || ''} onChange={handleInputChange} className={commonInputClass} />
                </div>
                 <div>
                    <label htmlFor={`${pathPrefix}.dadosSentenca.dataSentenca`} className={commonLabelClass}>Data da Sentença</label>
                    <input type="date" name={`${pathPrefix}.dadosSentenca.dataSentenca`} value={dados?.dadosSentenca?.dataSentenca || ''} onChange={handleInputChange} className={commonInputClass} />
                </div>
                <div>
                    <label htmlFor={`${pathPrefix}.dadosSentenca.dataTransitoEmJulgado`} className={commonLabelClass}>Trânsito em Julgado (opcional)</label>
                    <input type="date" name={`${pathPrefix}.dadosSentenca.dataTransitoEmJulgado`} value={dados?.dadosSentenca?.dataTransitoEmJulgado || ''} onChange={handleInputChange} className={commonInputClass} />
                </div>
            </div>
        );
    }

    if (origem === 'escritura') {
        return (
             <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-5 border-t pt-5 mt-5">
                <div>
                    <label htmlFor={`${pathPrefix}.dadosEscritura.dataEscritura`} className={commonLabelClass}>Data da Escritura</label>
                     {/* ALTERAÇÃO: Adicionado acesso seguro com ?. e fallback || '' */}
                    <input type="date" name={`${pathPrefix}.dadosEscritura.dataEscritura`} value={dados?.dadosEscritura?.dataEscritura || ''} onChange={handleInputChange} className={commonInputClass} />
                </div>
                <div>
                    <label htmlFor={`${pathPrefix}.dadosEscritura.serventia`} className={commonLabelClass}>Serventia</label>
                    <input type="text" name={`${pathPrefix}.dadosEscritura.serventia`} value={dados?.dadosEscritura?.serventia || ''} onChange={handleInputChange} className={commonInputClass} />
                </div>
                 <div>
                    <label htmlFor={`${pathPrefix}.dadosEscritura.livro`} className={commonLabelClass}>Livro</label>
                    <input type="text" name={`${pathPrefix}.dadosEscritura.livro`} value={dados?.dadosEscritura?.livro || ''} onChange={handleInputChange} className={commonInputClass} />
                </div>
                 <div>
                    <label htmlFor={`${pathPrefix}.dadosEscritura.folha`} className={commonLabelClass}>Folha</label>
                    <input type="text" name={`${pathPrefix}.dadosEscritura.folha`} value={dados?.dadosEscritura?.folha || ''} onChange={handleInputChange} className={commonInputClass} />
                </div>
            </div>
        );
    }

    if (origem === 'instrumentoParticular') {
         return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-5 border-t pt-5 mt-5">
                <div>
                    <label htmlFor={`${pathPrefix}.dataInstrumentoParticular`} className={commonLabelClass}>Data do Instrumento</label>
                    <input type="date" name={`${pathPrefix}.dataInstrumentoParticular`} value={dados?.dataInstrumentoParticular || ''} onChange={handleInputChange} className={commonInputClass} />
                </div>
            </div>
        );
    }

    return null;
}