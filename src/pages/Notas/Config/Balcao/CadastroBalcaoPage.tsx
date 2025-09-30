import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Save, Loader2, ArrowLeft, Copy, X, Search, FileUp } from 'lucide-react';
// IMPORTAÇÕES FINGIDAS (SUBSTITUA PELOS CAMINHOS REAIS)
import MainEditor from '../../../Components/MainEditor'; 
import { type IBalcaoTemplate } from '../../Types'; 
import { mockBalcaoTemplates, mockHeaderFooterTemplates, mockTipoServicoBalcao } from '../../lib/Constants';
import emolumentosData from '../../../../../tabela-emolumentos.json'; // Simulação de dados de emolumentos
import * as mammoth from 'mammoth';

// --- Funções Utilitárias (Mantidas do original) ---
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
    return Math.floor((mm / 25.4) * 96);
};

// --- Estado Inicial do Template de Balcão ---
const initialState: IBalcaoTemplate = {
    id: `BALCAO-${Date.now()}`,
    tipoServicoBalcaoId: mockTipoServicoBalcao[0]?.id || 1, // Default para 'Reconhecimento'
    titulo: '',
    descricao: '',
    id_selo: null,
    cabecalhoPadraoId: null,
    rodapePadraoId: null,
    conteudo: '<p>Escreva o modelo do seu documento aqui (etiqueta ou termo de autenticação). Por exemplo: Reconheço por semelhança a firma de {{ NOME_DA_FIRMA }}.</p>',
    margins: { top: '1.0', right: '1.0', bottom: '1.0', left: '1.0' },
    layout: { largura_mm: 70, altura_mm: 50 }, // Layout padrão para Etiqueta/Carimbo
    ativo: true,
    exigeFichaFirma: "Sim",
    documentosExigidos: null
};


const CadastroBalcaoPage: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();

    const [template, setTemplate] = useState<IBalcaoTemplate>(initialState);
    const [isLoading, setIsLoading] = useState(!!id);
    const [isSaving, setIsSaving] = useState(false);
    
    const [seloSearchTerm, setSeloSearchTerm] = useState('');
    const [isSeloDropdownOpen, setIsSeloDropdownOpen] = useState(false);
    const seloSearchRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- Lógica de Emolumentos e Selo ---
    const emolumentosTabelionato = useMemo(() => {
        // Filtrar ou simular dados de Tabelionato de Notas (ajuste conforme seu JSON real)
        return emolumentosData.filter((e: any) => e.sistema === 'TABELIONATO DE NOTAS');
    }, []);

    const filteredSelos = useMemo(() => {
        if (!seloSearchTerm) return emolumentosTabelionato;
        return emolumentosTabelionato.filter(selo =>
            selo.descricao_selo.toLowerCase().includes(seloSearchTerm.toLowerCase()) ||
            String(selo.id_selo).includes(seloSearchTerm)
        );
    }, [seloSearchTerm, emolumentosTabelionato]);

    const selectedSelo = useMemo(() => {
        return emolumentosTabelionato.find(s=> s.id_selo === template.id_selo) || null;
    }, [template.id_selo, emolumentosTabelionato]);

    // --- Carregamento de Dados ---
    useEffect(() => {
        if (id) {
            const existingTemplate = mockBalcaoTemplates.find(t => t.id === id);
            if (existingTemplate) {
                setTemplate(existingTemplate);
            } else {
                toast.error("Modelo de Balcão não encontrado.");
                navigate(-1);
            }
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }, [id, navigate]);

    // --- Handlers ---
    const handleFieldChange = useCallback((path: string, value: any) => {
        setTemplate(prev => updateNestedState(prev, path, value));
    }, []);

    const handleSeloSelect = (selo: any) => {
        handleFieldChange('id_selo', selo.id_selo);
        setIsSeloDropdownOpen(false);
        setSeloSearchTerm('');
    };

    const handleEditorChange = (content: string) => {
        setTemplate(prev => ({ ...prev, conteudo: content }));
    };

    const handleCopyVariable = (variable: string) => {
        navigator.clipboard.writeText(variable);
        toast.info(`Variável "${variable}" copiada!`);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!template.titulo || !template.tipoServicoBalcaoId) {
            toast.error("O título e o tipo de serviço são obrigatórios.");
            return;
        }
        setIsSaving(true);
        console.log("Salvando modelo de serviço de balcão:", template);
        toast.success("Modelo salvo com sucesso!");
        setTimeout(() => {
            setIsSaving(false);
            navigate('/gerenciamento-balcao');
        }, 1500);
    };

    // Função para lidar com o upload de arquivos .docx
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
                    handleEditorChange(result.value);
                    toast.success("Modelo .docx importado com sucesso!");
                } catch (error) {
                    console.error("Erro ao converter o arquivo .docx:", error);
                    toast.error("Não foi possível ler o arquivo .docx.");
                }
            }
        };
        reader.readAsArrayBuffer(file);
    }, []);

    // Função para acionar o clique no input de arquivo escondido
    const triggerFileSelect = () => fileInputRef.current?.click();


    // --- Constantes para Renderização ---
    const pageTitle = id ? "Editar Modelo de Serviço de Balcão" : "Criar Novo Modelo de Serviço de Balcão";
    const commonInputClass = "mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]";
    
    // Variáveis comuns para Tabelionato de Notas (Reconhecimento/Autenticação)
    const allVariables = useMemo(() => ([
        '{{ DATA_POR_EXTENSO }}',
        '{{ NOME_DO_OFICIAL }}',
        '{{ NOME_DA_FIRMA }}',
        '{{ CPF_DA_FIRMA }}',
        '{{ NOME_DO_RECONHECEDOR }}',
        '{{ HORA_ATO }}',
        '{{ NUMERO_DO_SELO }}',
        '{{ DATA_DO_SELO }}',
    ]), []);


    if (isLoading) {
        return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-[#dd6825]" size={32} /></div>;
    }

    return (
        <>
        <title>{pageTitle} | Orius Tecnologia</title>
        <div className="mx-auto">
            <header className="mb-6">
                <button type="button" onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-4">
                    <ArrowLeft size={16} />
                    Voltar para a Lista
                </button>
                <h1 className="text-3xl font-bold text-[#4a4e51]">{pageTitle}</h1>
                {id && <p className="text-gray-500 mt-1">Modificando: {template.titulo}</p>}
            </header>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Seção de Identificação */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Identificação</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">Título do Modelo*</label>
                            <input type="text" id="titulo" name="titulo" value={template.titulo} onChange={(e) => handleFieldChange('titulo', e.target.value)} className={commonInputClass} required />
                        </div>
                        <div>
                            <label htmlFor="tipoServicoBalcaoId" className="block text-sm font-medium text-gray-700">Tipo de Serviço*</label>
                            <select 
                                id="tipoServicoBalcaoId" 
                                value={template.tipoServicoBalcaoId} 
                                onChange={(e) => handleFieldChange('tipoServicoBalcaoId', Number(e.target.value))} 
                                disabled={!!id} 
                                className={`${commonInputClass} disabled:bg-gray-100 disabled:cursor-not-allowed`}
                            >
                                {mockTipoServicoBalcao.map(tipo => <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">Descrição</label>
                            <textarea id="descricao" name="descricao" value={template.descricao} onChange={(e) => handleFieldChange('descricao', e.target.value)} rows={3} className={commonInputClass} />
                        </div>
                        <div className="md:col-span-2">
                            <div className="flex items-center">
                                <input
                                    id="ativo"
                                    type="checkbox"
                                    checked={template.ativo}
                                    onChange={(e) => handleFieldChange('ativo', e.target.checked)}
                                    className="h-4 w-4 text-[#dd6825] border-gray-300 rounded focus:ring-[#dd6825]"
                                />
                                <label htmlFor="ativo" className="ml-2 block text-sm font-medium text-gray-700">
                                    Modelo Ativo (Disponível para uso)
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Seção de Emolumentos */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Emolumentos e Valores</h2>
                    <div className="md:col-span-2" ref={seloSearchRef}>
                        <label htmlFor="selo" className="block text-sm font-medium text-gray-700">Selo de Emolumentos*</label>
                        <div className="relative mt-1">
                            {selectedSelo ? (
                                <div className="w-full border border-gray-300 rounded-md p-2 bg-gray-100 flex justify-between items-center">
                                    <span className="text-sm text-gray-700"><strong>{selectedSelo.id_selo}:</strong> {selectedSelo.descricao_selo}</span>
                                    <button type="button" onClick={() => handleFieldChange('id_selo', null)} className="text-gray-500 hover:text-red-600"><X size={16} /></button>
                                </div>
                            ) : (
                                <>
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-5 w-5 text-gray-400" /></div>
                                    <input
                                        type="text" id="selo" value={seloSearchTerm} onChange={(e) => setSeloSearchTerm(e.target.value)}
                                        onFocus={() => setIsSeloDropdownOpen(true)} placeholder="Digite o ID ou a descrição do selo"
                                        className={`${commonInputClass} pl-10`} autoComplete="off"
                                    />
                                    {isSeloDropdownOpen && (
                                        <div className="absolute z-10 w-full bg-white border rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
                                            {filteredSelos.length > 0 ? filteredSelos.map((selo: any) => (
                                                <div key={selo.id_selo} onClick={() => handleSeloSelect(selo)} className="p-2 hover:bg-[#dd6825]/10 cursor-pointer text-sm">
                                                    <strong>{selo.id_selo}</strong> - {selo.descricao_selo}
                                                </div>
                                            )) : <div className="p-2 text-sm text-gray-500">Nenhum selo de Tabelionato encontrado.</div>}
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

                {/* Seção de Templates Padrão */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Templates Padrão</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="cabecalhoPadraoId" className="block text-sm font-medium text-gray-700">Cabeçalho</label>
                            <select id="cabecalhoPadraoId" value={template.cabecalhoPadraoId || ''} onChange={(e) => handleFieldChange('cabecalhoPadraoId', e.target.value || null)} className={commonInputClass}>
                                <option value="">Nenhum</option>
                                {mockHeaderFooterTemplates.filter(t => t.tipo === 'cabecalho').map(t => (<option key={t.id} value={t.id}>{t.nome}</option>))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="rodapePadraoId" className="block text-sm font-medium text-gray-700">Rodapé</label>
                            <select id="rodapePadraoId" value={template.rodapePadraoId || ''} onChange={(e) => handleFieldChange('rodapePadraoId', e.target.value || null)} className={commonInputClass}>
                                <option value="">Nenhum</option>
                                {mockHeaderFooterTemplates.filter(t => t.tipo === 'rodape').map(t => (<option key={t.id} value={t.id}>{t.nome}</option>))}
                            </select>
                        </div>
                    </div>
                </div>
                
                {/* Seção de Layout e Margens */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Layout e Margens (Etiqueta/Carimbo)</h2>
                    <div className="grid grid-cols-2 gap-6 mb-2 pb-2">
                        <div><label htmlFor="layout-width" className="block text-sm font-medium text-gray-700">Largura (mm)</label><input type="number" id="layout-width" value={template.layout.largura_mm} onChange={(e) => handleFieldChange('layout.largura_mm', Number(e.target.value))} className={commonInputClass} /></div>
                        <div><label htmlFor="layout-height" className="block text-sm font-medium text-gray-700">Altura (mm)</label><input type="number" id="layout-height" value={template.layout.altura_mm} onChange={(e) => handleFieldChange('layout.altura_mm', Number(e.target.value))} className={commonInputClass} /></div>
                    </div>
                    <h3 className="text-md font-medium text-gray-700 mb-4">Margens (cm)</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div><label htmlFor="margin-top" className="block text-sm font-medium text-gray-700">Superior (cm)</label><input type="number" id="margin-top" value={template.margins.top} onChange={(e) => handleFieldChange('margins.top', e.target.value)} step="0.1" className={commonInputClass} /></div>
                        <div><label htmlFor="margins-bottom" className="block text-sm font-medium text-gray-700">Inferior (cm)</label><input type="number" id="margins-bottom" value={template.margins.bottom} onChange={(e) => handleFieldChange('margins.bottom', e.target.value)} step="0.1" className={commonInputClass} /></div>
                        <div><label htmlFor="margins-left" className="block text-sm font-medium text-gray-700">Esquerda (cm)</label><input type="number" id="margins-left" value={template.margins.left} onChange={(e) => handleFieldChange('margins.left', e.target.value)} step="0.1" className={commonInputClass} /></div>
                        <div><label htmlFor="margins-right" className="block text-sm font-medium text-gray-700">Direita (cm)</label><input type="number" id="margins-right" value={template.margins.right} onChange={(e) => handleFieldChange('margins.right', e.target.value)} step="0.1" className={commonInputClass} /></div>
                    </div>
                </div>

                {/* Seção do Modelo de Conteúdo */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-700">Modelo de Conteúdo</h2>
                        <div>
                            {/* Input de arquivo escondido */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                className="hidden"
                            />
                            {/* Botão que aciona o input de arquivo */}
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
                    <p className="text-sm text-gray-500 mb-4">O editor abaixo simula o tamanho da etiqueta/documento conforme as dimensões definidas acima.</p>
                    <div className="flex justify-center border-t border-gray-300 pt-6">
                        <MainEditor
                            key={JSON.stringify({ margins: template.margins, layout: template.layout })}
                            initialValue={template.conteudo}
                            onEditorChange={handleEditorChange}
                            size={{ width: mmToPixels(template.layout.largura_mm), height: mmToPixels(template.layout.altura_mm) }}
                            margins={template.margins}
                            isMinimal={true}
                        />
                    </div>
                </div>

                {/* Seção de Variáveis */}
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Variáveis Dinâmicas Disponíveis</h3>
                    <p className="text-sm text-gray-500 mb-4">Clique em uma variável para copiá-la e cole no editor acima. Estas variáveis serão preenchidas no momento do serviço.</p>
                    <div className="flex flex-wrap gap-2">
                        {allVariables.map(variable => (<button key={variable} type="button" onClick={() => handleCopyVariable(variable)} className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-mono px-2 py-1 rounded-md transition-colors">{variable}<Copy size={12} /></button>))}
                    </div>
                </div>

                {/* Ações do Formulário */}
                <footer className="mt-2 pt-6 flex justify-end gap-4">
                    <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300">Cancelar</button>
                    <button type="submit" disabled={isSaving} className="px-6 py-2 bg-[#dd6825] text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-[#c25a1f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dd6825] disabled:bg-opacity-60 disabled:cursor-not-allowed">
                        {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        Salvar Modelo
                    </button>
                </footer>
            </form>
        </div>
        </>
    );
};

export default CadastroBalcaoPage;