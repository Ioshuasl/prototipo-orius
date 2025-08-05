import React from 'react';
import { UploadCloud, Trash2, PlusCircle } from 'lucide-react';
import { type IObitoFormData } from '../../../types';

interface TabDocumentosProps {
    formData: IObitoFormData;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleFileChange: (path: (string | number)[], file: File | null) => void;
    handleAddDocumento: () => void;
    handleRemoveDocumento: (index: number) => void;
    SectionTitle: React.FC<{ children: React.ReactNode }>;
    commonInputClass: string;
    commonLabelClass: string;
}

export default function TabDocumentos({ 
    formData, 
    handleInputChange, 
    handleFileChange, 
    handleAddDocumento, 
    handleRemoveDocumento,
    SectionTitle,
    commonInputClass, // A classe de foco já vem do componente pai, o que é ótimo!
    commonLabelClass 
}: TabDocumentosProps) {
    const { documentosApresentados } = formData;
    
    return (
        <fieldset>
            <SectionTitle>Documentos Apresentados e Anexos Digitais</SectionTitle>
            <div className="space-y-4">
                {documentosApresentados.map((doc, index) => (
                    <div key={index} className="flex flex-col md:flex-row items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-300">
                        <div className="flex-grow w-full">
                            <label htmlFor={`doc-desc-${index}`} className={commonLabelClass}>Descrição do Documento</label>
                            <input id={`doc-desc-${index}`} name={`documentosApresentados.${index}.descricao`} value={doc.descricao} onChange={handleInputChange} className={commonInputClass} placeholder="Ex: Declaração de Óbito, RG do Falecido..." />
                        </div>
                        <div className="w-full md:w-auto">
                            <label className={commonLabelClass}>Anexo Digital</label>
                            {/* ALTERADO: Cor do texto do botão de upload para o laranja da marca. */}
                            <label htmlFor={`doc-file-${index}`} className="mt-1 cursor-pointer flex items-center justify-center gap-2 w-full md:w-56 px-4 py-2 bg-white text-[#dd6825] border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 transition">
                                <UploadCloud size={18} /><span>{doc.nomeArquivo ? 'Trocar Arquivo' : 'Escolher Arquivo'}</span>
                            </label>
                            <input id={`doc-file-${index}`} type="file" className="sr-only" onChange={(e) => handleFileChange(['documentosApresentados', index], e.target.files?.[0] || null)} />
                            {doc.nomeArquivo && (<p className="text-xs text-green-700 mt-1 truncate w-full md:w-56" title={doc.nomeArquivo}>Arquivo: {doc.nomeArquivo}</p>)}
                        </div>
                        <div className="w-full md:w-auto flex justify-end md:self-end">
                            <button type="button" onClick={() => handleRemoveDocumento(index)} className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {/* ALTERADO: Cor do link "Adicionar Documento". */}
            {/* CORREÇÃO: Simplificado o onClick. */}
            <button type="button" onClick={handleAddDocumento} className="mt-6 flex items-center gap-2 text-sm font-medium text-[#dd6825] hover:text-[#c25a1f]">
                <PlusCircle size={16} /> Adicionar Documento
            </button>
        </fieldset>
    );
}