import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Save, Loader2, ArrowLeft, Search, X, Copy } from 'lucide-react';
import MainEditor from '../../Components/MainEditor';
import { type TipoAto, type AverbacaoTemplate } from '../../types';
import { mockAverbacaoTemplates, mockHeaderFooterTemplates } from '../../lib/Constants';
import emolumentosData from '../../../../../tabela-emolumentos.json'

// --- Lógica e Estados Iniciais (Inalterados) ---
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
    conteudo: '<p>Comece a editar o texto da averbação aqui...</p>',
    margins: { top: '2.5', right: '2.0', bottom: '2.5', left: '2.0' },
    layout: { largura_mm: 210, altura_mm: 150 }
};

const CadastroAverbacaoPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [template, setTemplate] = useState<AverbacaoTemplate>(initialState);
    const [isLoading, setIsLoading] = useState(!!id);
    const [isSaving, setIsSaving] = useState(false);
    const [seloSearchTerm, setSeloSearchTerm] = useState('');
    const [isSeloDropdownOpen, setIsSeloDropdownOpen] = useState(false);
    const seloSearchRef = useRef<HTMLDivElement>(null);

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const isNumericId = name.includes('Id') || name.includes('id_selo');
        const finalValue = isNumericId && value ? parseInt(value, 10) : value;
        setTemplate(prev => updateNestedState(prev, name, finalValue));
    };

    const handleSeloSelect = (selo: typeof emolumentosData[0]) => {
        setTemplate(prev => ({...prev, id_selo: selo.id_selo}));
        setIsSeloDropdownOpen(false);
        setSeloSearchTerm('');
    };

    const handleCopyVariable = (variable: string) => {
        navigator.clipboard.writeText(variable);
        toast.success(`Variável "${variable}" copiada!`);
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
    
    const pageTitle = id ? "Editar Modelo de Averbação" : "Criar Novo Modelo de Averbação";
    const abas: TipoAto[] = ["Nascimento", "Casamento", "Óbito", "Natimorto", "Livro E"];
    const allVariables = ['{{ NOME_REGISTRADO }}', '{{ DATA_ATO }}', '{{ LIVRO_ATO }}', '{{ FOLHA_ATO }}', '{{ TERMO_ATO }}', '{{ MATRICULA }}'];

    // ALTERADO: Centralização dos estilos de formulário
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
                {/* ALTERADO: Cor do título principal */}
                <h1 className="text-3xl font-bold text-[#4a4e51]">{pageTitle}</h1>
                {id && <p className="text-gray-500 mt-1">Modificando: {template.titulo}</p>}
            </header>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Identificação</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">Título do Modelo*</label>
                            <input type="text" id="titulo" name="titulo" value={template.titulo} onChange={handleInputChange} className={commonInputClass} />
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
                                    <button type="button" onClick={() => setTemplate(prev => ({...prev, id_selo: null}))} className="text-gray-500 hover:text-red-600"><X size={16} /></button>
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
                                                // ALTERADO: Cor do hover no dropdown
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
                                {/* ALTERADO: Cor do valor total */}
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
                
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Texto da Averbação</h2>
                    <div className="flex justify-center">
                        <MainEditor initialValue={template.conteudo} onEditorChange={handleEditorChange} size={{ width: mmToPixels(template.layout.largura_mm), height: mmToPixels(template.layout.altura_mm) }} margins={template.margins} />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Variáveis Dinâmicas Disponíveis</h3>
                    <p className="text-sm text-gray-500 mb-4">Clique para copiar e cole no editor acima.</p>
                    <div className="flex flex-wrap gap-2">{allVariables.map(variable => (<button key={variable} type="button" onClick={() => handleCopyVariable(variable)} className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-mono px-2 py-1 rounded-md transition-colors">{variable}<Copy size={12} /></button>))}</div>
                </div>
                
                 <footer className="pt-6 flex justify-end gap-4">
                    <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300">Cancelar</button>
                    {/* ALTERADO: Cor do botão de ação principal */}
                    <button type="submit" disabled={isSaving} className="px-6 py-2 bg-[#dd6825] text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-[#c25a1f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dd6825]">
                        {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        Salvar Modelo
                    </button>
                </footer>
            </form>
        </div>
    );
};

export default CadastroAverbacaoPage;