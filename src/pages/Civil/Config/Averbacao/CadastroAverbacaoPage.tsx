import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Save, Loader2, ArrowLeft, Copy, X, Search, FileUp } from 'lucide-react';
import MainEditor from '../../Components/MainEditor';
import { type TipoAto, type AverbacaoTemplate } from '../../types';
import { mockAverbacaoTemplates, mockHeaderFooterTemplates } from '../../lib/Constants';
import emolumentosData from '../../../../../tabela-emolumentos.json';
import * as mammoth from 'mammoth';

// --- Funções Utilitárias ---
const updateNestedState = (prevState: any, path: string, value: any): any => {
    const keys = path.split('.');
    const newState = { ...prevState };
    let currentLevel: any = newState;
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        currentLevel[key] = { ...currentLevel[key] ?? {} };
        currentLevel = currentLevel[key];
    }
    currentLevel[keys[keys.length - 1]] = value;
    return newState;
};

const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const mmToPixels = (mm: number): number => {
    return (mm / 25.4) * 96;
};

const initialState: AverbacaoTemplate = {
    id: `AVRB-${Date.now()}`,
    titulo: '',
    descricao: '',
    tipoAto: 'Nascimento',
    averbacaoOptionId: 0,
    id_selo: null,
    cabecalhoPadraoId: null,
    rodapePadraoId: null,
    conteudo: '<p>Comece a editar o texto da averbação aqui ou importe um arquivo .docx.</p>',
    margins: { top: '2.5', right: '2.0', bottom: '2.5', left: '2.0' },
    layout: { largura_mm: 210, altura_mm: 150 }
};

// --- Componente Principal ---
const CadastroAverbacaoPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [template, setTemplate] = useState<AverbacaoTemplate>(initialState);
    const [isLoading, setIsLoading] = useState(!!id);
    const [isSaving, setIsSaving] = useState(false);
    const [seloSearchTerm, setSeloSearchTerm] = useState('');
    const [isSeloDropdownOpen, setIsSeloDropdownOpen] = useState(false);
    const seloSearchRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null); // Ref para o input de arquivo
    const [margins, setMargins] = useState({ top: '2.5', bottom: '2.5', left: '2.0', right: '2.0' });

    const selosRegistroCivil = useMemo(() => {
        return emolumentosData.filter(selo => selo.sistema === 'REGISTRO CIVIL');
    }, []);

    const filteredSelos = useMemo(() => {
        if (!seloSearchTerm) return selosRegistroCivil;
        return selosRegistroCivil.filter(selo =>
            selo.descricao_selo.toLowerCase().includes(seloSearchTerm.toLowerCase()) ||
            String(selo.id_selo).includes(seloSearchTerm)
        );
    }, [seloSearchTerm, selosRegistroCivil]);

    const selectedSelo = useMemo(() => {
        return selosRegistroCivil.find(s => s.id_selo === template.id_selo) || null;
    }, [template.id_selo, selosRegistroCivil]);

    useEffect(() => {
        if (id) {
            const templateExistente = mockAverbacaoTemplates.find(t => t.id === id);
            if (templateExistente) { setTemplate(templateExistente); }
            else { toast.error("Modelo de averbação não encontrado."); navigate(-1); }
            setIsLoading(false);
        }
    }, [id, navigate]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (seloSearchRef.current && !seloSearchRef.current.contains(event.target as Node)) {
                setIsSeloDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // --- Handlers ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const isNumericId = name.includes('Id') || name.includes('id_selo');
        const finalValue = isNumericId && value ? parseInt(value, 10) : value;
        setTemplate(prev => updateNestedState(prev, name, finalValue));
    };

    const handleSeloSelect = (selo: typeof emolumentosData[0]) => {
        setTemplate(prev => ({ ...prev, id_selo: selo.id_selo }));
        setIsSeloDropdownOpen(false);
        setSeloSearchTerm('');
    };

    const handleCopyVariable = (variable: string) => {
        navigator.clipboard.writeText(variable);
        toast.success(`Variável "${variable}" copiada!`);
    };

    const handleMarginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setMargins(prevMargins => ({ ...prevMargins, [name]: value }));
    };

    const handleEditorChange = (content: string) => {
        setTemplate(prev => ({ ...prev, conteudo: content }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!template.id_selo) {
            toast.error("É obrigatório selecionar um selo de emolumentos.");
            return;
        }
        setIsSaving(true);
        console.log("Salvando modelo de averbação:", template);
        toast.success("Modelo salvo com sucesso!");
        setTimeout(() => {
            setIsSaving(false);
            navigate(-1);
        }, 1500);
    };

    const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            toast.error("Por favor, selecione um arquivo .docx válido.");
            return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            const arrayBuffer = e.target?.result as ArrayBuffer;
            if (arrayBuffer) {
                try {
                    const result = await mammoth.convertToHtml({ arrayBuffer });
                    setTemplate(prev => ({ ...prev, conteudo: result.value }));
                    toast.success("Modelo .docx importado com sucesso!");
                } catch (error) {
                    console.error("Erro ao converter o arquivo .docx:", error);
                    toast.error("Não foi possível ler o arquivo .docx.");
                }
            }
        };
        reader.readAsArrayBuffer(file);
    }, []);

    const triggerFileSelect = () => fileInputRef.current?.click();

    // --- Constantes para Renderização ---
    const pageTitle = id ? "Editar Modelo de Averbação" : "Criar Novo Modelo de Averbação";
    const abas: TipoAto[] = ["Nascimento", "Casamento", "Óbito", "Natimorto", "Livro E"];
    const allVariables = ['{{ NOME_REGISTRADO }}', '{{ DATA_ATO }}', '{{ LIVRO_ATO }}', '{{ FOLHA_ATO }}', '{{ TERMO_ATO }}', '{{ MATRICULA }}'];
    const commonInputClass = "mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]";

    if (isLoading) {
        return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-[#dd6825]" size={32} /></div>;
    }

    return (
        <div className="mx-auto">
            <title>{pageTitle} | Orius Tecnologia</title>
            <header className="mb-6 pb-4">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-4">
                    <ArrowLeft size={16} />
                    Voltar para a Lista
                </button>
                <h1 className="text-3xl font-bold text-[#4a4e51]">{pageTitle}</h1>
                {id && <p className="text-gray-500 mt-1">Modificando: {template.titulo}</p>}
            </header>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Identificação</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">Título do Modelo*</label>
                            <input type="text" id="titulo" name="titulo" value={template.titulo} onChange={handleInputChange} className={commonInputClass} required />
                        </div>
                        <div>
                            <label htmlFor="tipoAto" className="block text-sm font-medium text-gray-700">Ato Original*</label>
                            <select id="tipoAto" name="tipoAto" value={template.tipoAto} onChange={handleInputChange} disabled={!!id} className={`${commonInputClass} disabled:bg-gray-100 disabled:cursor-not-allowed`}>
                                {abas.map(aba => <option key={aba} value={aba}>{aba}</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">Descrição</label>
                            <textarea id="descricao" name="descricao" value={template.descricao} onChange={handleInputChange} rows={2} className={commonInputClass} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Emolumentos e Valores</h2>
                    <div className="md:col-span-2" ref={seloSearchRef}>
                        <label htmlFor="selo" className="block text-sm font-medium text-gray-700">Selo de Emolumentos*</label>
                        <div className="relative mt-1">
                            {selectedSelo ? (
                                <div className="w-full border border-gray-300 rounded-md p-2 bg-gray-100 flex justify-between items-center">
                                    <span className="text-sm text-gray-700"><strong>{selectedSelo.id_selo}:</strong> {selectedSelo.descricao_selo}</span>
                                    <button type="button" onClick={() => setTemplate(prev => ({ ...prev, id_selo: null }))} className="text-gray-500 hover:text-red-600"><X size={16} /></button>
                                </div>
                            ) : (
                                <>
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-5 w-5 text-gray-400" /></div>
                                    <input type="text" id="selo" value={seloSearchTerm} onChange={(e) => setSeloSearchTerm(e.target.value)} onFocus={() => setIsSeloDropdownOpen(true)}
                                        placeholder="Digite o ID ou a descrição do selo" className={`${commonInputClass} pl-10`} autoComplete="off"
                                    />
                                    {isSeloDropdownOpen && (
                                        <div className="absolute z-10 w-full bg-white border rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
                                            {filteredSelos.length > 0 ? filteredSelos.map(selo => (
                                                <div key={selo.id_selo} onClick={() => handleSeloSelect(selo)} className="p-2 hover:bg-[#dd6825]/10 cursor-pointer text-sm">
                                                    <strong>{selo.id_selo}</strong> - {selo.descricao_selo}
                                                </div>
                                            )) : <div className="p-2 text-sm text-gray-500">Nenhum selo encontrado.</div>}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                    {selectedSelo && (
                        <div className="mt-2 pt-4 space-y-3 text-sm">
                            <div className="flex justify-between items-center"><span className="font-medium text-gray-600">Valor do Emolumento:</span><span className="font-mono text-gray-800">{formatCurrency(selectedSelo.valor_emolumento)}</span></div>
                            <div className="flex justify-between items-center"><span className="font-medium text-gray-600">Taxa Judiciária:</span><span className="font-mono text-gray-800">{formatCurrency(selectedSelo.valor_taxa_judiciaria)}</span></div>
                            <div className="pt-3 mt-3 flex justify-between items-center">
                                <span className="font-bold text-gray-800">Total:</span>
                                <span className="font-bold font-mono text-[#dd6825] text-base">{formatCurrency(selectedSelo.valor_emolumento + selectedSelo.valor_taxa_judiciaria)}</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Cabeçalho e Rodapé (Opcional)</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="cabecalhoPadraoId" className="block text-sm font-medium text-gray-700">Cabeçalho</label>
                            <select id="cabecalhoPadraoId" name="cabecalhoPadraoId" value={template.cabecalhoPadraoId || ''} onChange={handleInputChange} className={commonInputClass}>
                                <option value="">Nenhum</option>
                                {mockHeaderFooterTemplates.filter(t => t.tipo === 'cabecalho').map(t => (<option key={t.id} value={String(t.id)}>{t.nome}</option>))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="rodapePadraoId" className="block text-sm font-medium text-gray-700">Rodapé</label>
                            <select id="rodapePadraoId" name="rodapePadraoId" value={template.rodapePadraoId || ''} onChange={handleInputChange} className={commonInputClass}>
                                <option value="">Nenhum</option>
                                {mockHeaderFooterTemplates.filter(t => t.tipo === 'rodape').map(t => (<option key={t.id} value={String(t.id)}>{t.nome}</option>))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Seção de Layout e Margens */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Layout e Margens</h2>
                    <div className="grid grid-cols-2 gap-6 mb-2 pb-2">
                        <div><label htmlFor="layout-width" className="block text-sm font-medium text-gray-700">Largura (mm)</label><input type="number" id="layout-width" name="layout.largura_mm" value={template.layout.largura_mm} onChange={handleInputChange} className={commonInputClass} /></div>
                        <div><label htmlFor="layout-height" className="block text-sm font-medium text-gray-700">Altura (mm)</label><input type="number" id="layout-height" name="layout.altura_mm" value={template.layout.altura_mm} onChange={handleInputChange} className={commonInputClass} /></div>
                    </div>
                    <h3 className="text-md font-medium text-gray-700 mb-4">Margens (cm)</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div><label htmlFor="margin-top" className="block text-sm font-medium text-gray-700">Superior (cm)</label><input type="number" id="margin-top" name="top" value={margins.top} onChange={handleMarginChange} step="0.1" className={commonInputClass} /></div>
                        <div><label htmlFor="margins-bottom" className="block text-sm font-medium text-gray-700">Inferior (cm)</label><input type="number" id="margins-bottom" name="bottom" value={margins.bottom} onChange={handleMarginChange} step="0.1" className={commonInputClass} /></div>
                        <div><label htmlFor="margins-left" className="block text-sm font-medium text-gray-700">Esquerda (cm)</label><input type="number" id="margins-left" name="left" value={margins.left} onChange={handleMarginChange} step="0.1" className={commonInputClass} /></div>
                        <div><label htmlFor="margins-right" className="block text-sm font-medium text-gray-700">Direita (cm)</label><input type="number" id="margins-right" name="right" value={margins.right} onChange={handleMarginChange} step="0.1" className={commonInputClass} /></div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-700">Texto da Averbação</h2>
                        <div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={triggerFileSelect}
                                className="px-4 py-2 bg-gray-600 text-white text-sm rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-700"
                            >
                                <FileUp size={16} />
                                Importar de .docx
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-center border-t border-gray-300 pt-6">
                        <MainEditor
                            key={JSON.stringify({ margins, layout: template.layout })}
                            initialValue={template.conteudo}
                            onEditorChange={handleEditorChange}
                            size={{ width: mmToPixels(template.layout.largura_mm), height: mmToPixels(template.layout.altura_mm) }}
                            margins={margins}
                        />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Variáveis Dinâmicas Disponíveis</h3>
                    <p className="text-sm text-gray-500 mb-4">Clique para copiar e cole no editor acima.</p>
                    <div className="flex flex-wrap gap-2">{allVariables.map(variable => (<button key={variable} type="button" onClick={() => handleCopyVariable(variable)} className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-mono px-2 py-1 rounded-md transition-colors">{variable}<Copy size={12} /></button>))}</div>
                </div>

                <footer className="pt-6 flex justify-end gap-4">
                    <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300">Cancelar</button>
                    <button type="submit" disabled={isSaving} className="px-6 py-2 bg-[#dd6825] text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-[#c25a1f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dd6825] disabled:bg-opacity-60 disabled:cursor-not-allowed">
                        {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        Salvar Modelo
                    </button>
                </footer>
            </form>
        </div>
    );
};

export default CadastroAverbacaoPage;