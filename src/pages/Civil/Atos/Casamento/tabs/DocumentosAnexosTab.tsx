import React from 'react';
import { UploadCloud, Trash2, PlusCircle } from 'lucide-react';

// Ajuste o tipo para refletir a estrutura do documento
interface DocumentoApresentado {
    descricao: string;
    arquivo: File | null;
    nomeArquivo?: string;
}

// Tipos das props
interface DocumentosAnexosTabProps {
    documentos: DocumentoApresentado[];
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    handleFileChange: (path: (string | number)[], file: File | null) => void;
    handleAddDocumento: () => void;
    handleRemoveDocumento: (index: number) => void;
    SectionTitle: React.FC<{ children: React.ReactNode }>;
    SubSectionTitle: React.FC<{ children: React.ReactNode }>;
}

export default function DocumentosAnexosTab({
    documentos,
    handleInputChange,
    handleFileChange,
    handleAddDocumento,
    handleRemoveDocumento,
    SectionTitle,
    SubSectionTitle
}: DocumentosAnexosTabProps) {

    // ALTERADO: Classes de foco agora usam a cor laranja da marca.
    const commonInputClass = "mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]";
    const commonLabelClass = "block text-sm font-medium text-gray-700";

    return (
        <fieldset className="space-y-8">
            <SectionTitle>Documentação e Anexos</SectionTitle>
            <div>
                <SubSectionTitle>Documentos Apresentados e Anexos Digitais</SubSectionTitle>
                <p className="text-sm text-gray-500 mb-6">Liste os documentos apresentados e anexe a cópia digital de cada um.</p>

                <div className="space-y-4">
                    {documentos.map((doc, index) => (
                        <div key={index} className="flex flex-col md:flex-row items-start gap-4 p-4 rounded-lg border border-gray-300">
                            {/* Campo de Descrição */}
                            <div className="flex-grow w-full">
                                <label htmlFor={`doc-desc-${index}`} className={commonLabelClass}>
                                    Descrição do Documento
                                </label>
                                <input
                                    id={`doc-desc-${index}`}
                                    name={`documentosApresentados.${index}.descricao`}
                                    value={doc.descricao}
                                    onChange={handleInputChange}
                                    className={commonInputClass}
                                    placeholder="Ex: Certidão de Nascimento, Pacto Antenupcial..."
                                />
                            </div>

                            {/* Campo de Upload */}
                            <div className="w-full md:w-auto">
                                <label className={commonLabelClass}>Anexo Digital</label>
                                {/* ALTERADO: Cor do texto do botão de upload */}
                                <label htmlFor={`doc-file-${index}`} className="mt-1 cursor-pointer flex items-center justify-center gap-2 w-full md:w-56 px-4 py-2 bg-white text-[#dd6825] border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 transition">
                                    <UploadCloud size={18} />
                                    <span>{doc.nomeArquivo ? 'Trocar Arquivo' : 'Escolher Arquivo'}</span>
                                </label>
                                <input
                                    id={`doc-file-${index}`}
                                    type="file"
                                    className="sr-only"
                                    onChange={(e) => handleFileChange(['documentosApresentados', index, 'arquivo'], e.target.files?.[0] || null)}
                                />
                                {doc.nomeArquivo && (
                                    <p className="text-xs text-green-700 mt-1 truncate w-full md:w-56" title={doc.nomeArquivo}>
                                        Arquivo: {doc.nomeArquivo}
                                    </p>
                                )}
                            </div>

                            {/* Botão de Remover */}
                            <div className="w-full md:w-auto flex justify-end md:self-end">
                                <button
                                    type="button"
                                    onClick={() => handleRemoveDocumento(index)}
                                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ALTERADO: Cor do link "Adicionar Documento" */}
                <button
                    type="button"
                    onClick={handleAddDocumento}
                    className="mt-6 flex items-center gap-2 text-sm font-medium text-[#dd6825] hover:text-[#c25a1f]"
                >
                    <PlusCircle size={16} /> Adicionar Documento
                </button>
            </div>
        </fieldset>
    );
}