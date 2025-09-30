import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Save, Loader2, ArrowLeft, Copy, X, Search, FileUp } from 'lucide-react';
import MainEditor from '../../../Components/MainEditor';
import { type ReciboTemplate, type TipoRecibo } from '../../types';
import emolumentosData from '../../../../../tabela-emolumentos.json';
import { mockHeaderFooterTemplates, mockReciboTemplates } from '../../lib/Constants';
import * as mammoth from 'mammoth';

const mmToPixels = (mm: number): number => {
    return (mm / 25.4) * 96;
};

// --- FUNÇÕES E ESTADO INICIAL ---
const updateNestedState = (prevState: any, path: string, value: any): any => {
    const keys = path.split('.');
    const newState = { ...prevState };
    let currentLevel: any = newState;
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        currentLevel[key] = { ...(currentLevel[key] ?? {}) };
        currentLevel = currentLevel[key];
    }
    currentLevel[keys[keys.length - 1]] = value;
    return newState;
};

const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const initialState: ReciboTemplate = {
    id: `REC-${Date.now()}`,
    titulo: '',
    descricao: '',
    id_selo: null,
    tipoRecibo: 'Segunda Via',
    cabecalhoPadraoId: null,
    rodapePadraoId: null,
    conteudo: '<p>Comece a editar o corpo do recibo aqui ou importe um arquivo .docx.</p>',
    margins: { top: '2.0', right: '2.0', bottom: '2.0', left: '2.0' },
    layout: { largura_mm: 210, altura_mm: 148 }
};

// --- COMPONENTE PRINCIPAL DA PÁGINA ---
const CadastroReciboPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [template, setTemplate] = useState<ReciboTemplate>(initialState);
    const [isLoading, setIsLoading] = useState(!!id);
    const [isSaving, setIsSaving] = useState(false);
    const [margins, setMargins] = useState({ top: '2.0', bottom: '2.0', left: '2.0', right: '2.0' });
    const [isSeloDropdownOpen, setIsSeloDropdownOpen] = useState(false);
    const seloSearchRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const seloSearchTerm = useRef('');

    const selosRegistroCivil = useMemo(() => emolumentosData.filter(selo => selo.sistema === 'REGISTRO CIVIL'), []);
    const filteredSelos = useMemo(() => {
        if (!seloSearchTerm.current) return selosRegistroCivil;
        const searchTermLower = seloSearchTerm.current.toLowerCase();
        return selosRegistroCivil.filter(selo =>
            selo.descricao_selo.toLowerCase().includes(searchTermLower) ||
            String(selo.id_selo).includes(seloSearchTerm.current)
        );
    }, [seloSearchTerm.current, selosRegistroCivil]);
    const selectedSelo = useMemo(() => selosRegistroCivil.find(s => s.id_selo === template.id_selo) || null, [template.id_selo, selosRegistroCivil]);

    useEffect(() => {
        if (id) {
            const templateExistente = mockReciboTemplates.find(t => t.id === id);
            if (templateExistente) {
                setTemplate(templateExistente);
                if (templateExistente.margins) {
                    setMargins(templateExistente.margins);
                }
            } else {
                toast.error("Modelo de recibo não encontrado.");
                navigate('/admin/recibos');
            }
        }
        setIsLoading(false);
    }, [id, navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        let finalValue: string | number | null = value;

        if (type === 'number') {
            finalValue = value === '' ? 0 : parseFloat(value);
        }
        
        const isNumericId = name.includes('Id') || name.includes('id_selo');
        if (isNumericId && value) {
            finalValue = value === '' ? null : parseInt(value, 10);
        }

        setTemplate(prev => updateNestedState(prev, name, finalValue));
    };

    const handleMarginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setMargins(prevMargins => ({ ...prevMargins, [name]: value }));
    };

    const handleSeloSelect = (selo: typeof emolumentosData[0]) => {
        setTemplate(prev => ({ ...prev, id_selo: selo.id_selo }));
        setIsSeloDropdownOpen(false);
        seloSearchTerm.current = '';
    };

    const handleEditorChange = (content: string) => {
        setTemplate(prev => ({ ...prev, conteudo: content }));
    };

    const handleCopyVariable = (variable: string) => {
        navigator.clipboard.writeText(variable);
        toast.success(`Variável "${variable}" copiada!`);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!template.titulo) {
            toast.error("O título do modelo é obrigatório.");
            return;
        }
        setIsSaving(true);
        console.log("Salvando modelo de recibo:", { ...template, margins });
        setTimeout(() => {
            setIsSaving(false);
            toast.success("Modelo salvo com sucesso!");
            navigate('/admin/recibos');
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

    const pageTitle = id ? "Editar Modelo de Recibo" : "Criar Novo Modelo de Recibo";
    const abas: TipoRecibo[] = ["Segunda Via", "Averbação", "Habilitação de Casamento", "Busca de Registro", "Apostilamento", "Outros"];
    const allVariables = ['{{ NOME_SOLICITANTE }}', '{{ CPF_SOLICITANTE }}', '{{ NOME_REGISTRADO }}', '{{ MATRICULA_CERTIDAO }}', '{{ TIPO_ATO_REGISTRAL }}', '{{ DATA_DO_ATO }}', '{{ DESCRICAO_SERVICO_PRESTADO }}', '{{ TABELA_DE_ITENS }}', '{{ VALOR_TOTAL_NUMERICO }}', '{{ VALOR_TOTAL_EXTENSO }}', '{{ DATA_EMISSAO_RECIBO }}'];

    const commonInputClass = "mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]";

    if (isLoading) {
        return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-[#dd6825]" size={32} /></div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <title>{pageTitle} | Orius Tecnologia</title>
            <header className="mb-6 pb-4">
                <button onClick={() => navigate('/admin/recibos')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-4">
                    <ArrowLeft size={16} />
                    Voltar para a Lista
                </button>
                <h1 className="text-3xl font-bold text-[#4a4e51]">{pageTitle}</h1>
                {id && <p className="text-gray-500 mt-1">Modificando: {template.titulo}</p>}
            </header>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Identificação do Modelo</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">Título do Modelo*</label>
                            <input type="text" id="titulo" name="titulo" value={template.titulo} onChange={handleInputChange} className={commonInputClass} required />
                        </div>
                        <div>
                            <label htmlFor="tipoRecibo" className="block text-sm font-medium text-gray-700">Tipo de Recibo*</label>
                            <select id="tipoRecibo" name="tipoRecibo" value={template.tipoRecibo} onChange={handleInputChange} disabled={!!id} className={`${commonInputClass} disabled:bg-gray-100 disabled:cursor-not-allowed`}>
                                {abas.map(aba => <option key={aba} value={aba}>{aba}</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">Descrição</label>
                            <textarea id="descricao" name="descricao" value={template.descricao} onChange={handleInputChange} rows={3} className={commonInputClass} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Emolumentos e Valores (Opcional)</h2>
                    <div ref={seloSearchRef}>
                        <label htmlFor="selo" className="block text-sm font-medium text-gray-700">Vincular a um Ato/Selo de Emolumentos</label>
                        <div className="relative mt-1">
                            {selectedSelo ? (
                                <div className="w-full border border-gray-300 rounded-md p-2 bg-gray-100 flex justify-between items-center">
                                    <span className="text-sm text-gray-700"><strong>{selectedSelo.id_selo}:</strong> {selectedSelo.descricao_selo}</span>
                                    <button type="button" onClick={() => setTemplate(prev => ({ ...prev, id_selo: null }))} className="text-gray-500 hover:text-red-600"><X size={16} /></button>
                                </div>
                            ) : (
                                <>
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-5 w-5 text-gray-400" /></div>
                                    <input type="text" id="selo" defaultValue={seloSearchTerm.current} onChange={(e) => seloSearchTerm.current = e.target.value} onFocus={() => setIsSeloDropdownOpen(true)}
                                        placeholder="Digite o ID ou a descrição do selo" className={`${commonInputClass} pl-10`} autoComplete="off" />
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
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Templates Padrão</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><label htmlFor="cabecalhoPadraoId" className="block text-sm font-medium text-gray-700">Cabeçalho</label><select id="cabecalhoPadraoId" name="cabecalhoPadraoId" value={template.cabecalhoPadraoId || ''} onChange={handleInputChange} className={commonInputClass}><option value="">Nenhum</option>{mockHeaderFooterTemplates.filter(t => t.tipo === 'cabecalho').map(t => (<option key={t.id} value={t.id}>{t.nome}</option>))}</select></div>
                        <div><label htmlFor="rodapePadraoId" className="block text-sm font-medium text-gray-700">Rodapé</label><select id="rodapePadraoId" name="rodapePadraoId" value={template.rodapePadraoId || ''} onChange={handleInputChange} className={commonInputClass}><option value="">Nenhum</option>{mockHeaderFooterTemplates.filter(t => t.tipo === 'rodape').map(t => (<option key={t.id} value={t.id}>{t.nome}</option>))}</select></div>
                    </div>
                </div>

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
                        <h2 className="text-lg font-semibold text-gray-700">Editor de Conteúdo do Recibo</h2>
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
                        <MainEditor key={JSON.stringify({ margins, layout: template.layout })} initialValue={template.conteudo} onEditorChange={handleEditorChange} size={{ width: mmToPixels(template.layout.largura_mm), height: mmToPixels(template.layout.altura_mm) }} margins={margins} />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Variáveis Dinâmicas para Recibos</h3>
                    <p className="text-sm text-gray-500 mb-4">Clique em uma variável para copiá-la e cole no editor acima.</p>
                    <div className="flex flex-wrap gap-2">{allVariables.map(variable => (<button key={variable} type="button" onClick={() => handleCopyVariable(variable)} className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-mono px-2 py-1 rounded-md transition-colors">{variable}<Copy size={12} /></button>))}</div>
                </div>

                <footer className="mt-2 pt-6 flex justify-end gap-4">
                    <button type="button" onClick={() => navigate('/admin/recibos')} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300">Cancelar</button>
                    <button type="submit" disabled={isSaving} className="px-6 py-2 bg-[#dd6825] text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-[#c25a1f] disabled:bg-[#dd6825]/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dd6825]">
                        {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        Salvar Modelo
                    </button>
                </footer>
            </form>
        </div>
    );
};

export default CadastroReciboPage;