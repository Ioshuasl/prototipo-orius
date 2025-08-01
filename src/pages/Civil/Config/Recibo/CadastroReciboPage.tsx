// Salve como src/pages/CadastroReciboPage.tsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Save, Loader2, ArrowLeft, Copy, X, Search } from 'lucide-react';
import MainEditor from '../../Components/MainEditor'; // Supondo que o editor esteja neste caminho
import { type ReciboTemplate, type TipoRecibo } from '../../types';
import emolumentosData from '../../../../../tabela-emolumentos.json'; // Usando o mesmo JSON de emolumentos
import { mockHeaderFooterTemplates, mockReciboTemplates } from '../../lib/Constants';

const mmToPixels = (mm: number): number => {
    // Fator de conversão aproximado para uma tela de 96 DPI
    return (mm / 25.4) * 96;
};


// --- FUNÇÕES HELPER (Normalmente ficariam em um arquivo de utils) ---
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

// --- ESTADO INICIAL PARA UM NOVO RECIBO ---
const initialState: ReciboTemplate = {
    id: `REC-${Date.now()}`,
    titulo: '',
    descricao: '',
    id_selo: null,
    tipoRecibo: 'Segunda Via',
    cabecalhoPadraoId: null,
    rodapePadraoId: null,
    conteudo: '<p>Comece a editar o corpo do recibo aqui...</p>',
    margins: { top: '2.0', right: '2.0', bottom: '2.0', left: '2.0' },
    layout: { largura_mm: 210, altura_mm: 148 } // Tamanho A5
};

// --- COMPONENTE PRINCIPAL DA PÁGINA ---
const CadastroReciboPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [template, setTemplate] = useState<ReciboTemplate>(initialState);
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
            const templateExistente = mockReciboTemplates.find(t => t.id === id);
            if (templateExistente) {
                setTemplate(templateExistente);
            } else {
                toast.error("Modelo de recibo não encontrado.");
                navigate('/admin/recibos');
            }
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }, [id, navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTemplate(prev => ({ ...prev, [name]: value }));
    };

    // ** LÓGICA CORRIGIDA PARA AS MARGENS **
    // Atualiza diretamente o objeto aninhado 'margins' no estado 'template'.
    const handleMarginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTemplate(prev => updateNestedState(prev, `margins.${name}`, value));
    };

    const handleSeloSelect = (selo: typeof emolumentosData[0]) => {
        setTemplate(prev => ({ ...prev, id_selo: selo.id_selo }));
        setIsSeloDropdownOpen(false);
        setSeloSearchTerm('');
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
        console.log("Salvando modelo de recibo:", template); // O objeto 'template' terá as margens corretas
        toast.success("Modelo salvo com sucesso!");
        setTimeout(() => {
            setIsSaving(false);
            navigate('/admin/recibos');
        }, 1500);
    };

    const pageTitle = id ? "Editar Modelo de Recibo" : "Criar Novo Modelo de Recibo";
    const abas: TipoRecibo[] = ["Segunda Via", "Averbação", "Habilitação de Casamento", "Busca de Registro", "Apostilamento", "Outros"];
    const allVariables = ['{{ NOME_SOLICITANTE }}', '{{ CPF_SOLICITANTE }}', '{{ NOME_REGISTRADO }}', '{{ MATRICULA_CERTIDAO }}', '{{ TIPO_ATO_REGISTRAL }}', '{{ DATA_DO_ATO }}', '{{ DESCRICAO_SERVICO_PRESTADO }}', '{{ TABELA_DE_ITENS }}', '{{ VALOR_TOTAL_NUMERICO }}', '{{ VALOR_TOTAL_EXTENSO }}', '{{ DATA_EMISSAO_RECIBO }}'];

    if (isLoading) {
        return <div className="flex justify-center p-10"><Loader2 className="animate-spin" size={32} /></div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <header className="mb-6 pb-4 border-b">
                <button onClick={() => navigate('/admin/recibos')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-4">
                    <ArrowLeft size={16} />
                    Voltar para a Lista
                </button>
                <h1 className="text-3xl font-bold text-gray-800">{pageTitle}</h1>
                {id && <p className="text-gray-500 mt-1">Modificando: {template.titulo}</p>}
            </header>

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* Seção 1: Identificação */}
                <div className="bg-white p-6 rounded-lg border">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Identificação do Modelo</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">Título do Modelo*</label>
                            <input type="text" id="titulo" name="titulo" value={template.titulo} onChange={handleInputChange} className="mt-1 w-full border border-gray-300 rounded-md p-2" required/>
                        </div>
                        <div>
                            <label htmlFor="tipoRecibo" className="block text-sm font-medium text-gray-700">Tipo de Recibo*</label>
                            <select id="tipoRecibo" name="tipoRecibo" value={template.tipoRecibo} onChange={handleInputChange} disabled={!!id} className="mt-1 w-full border border-gray-300 rounded-md p-2 bg-gray-50 disabled:cursor-not-allowed">
                                {abas.map(aba => <option key={aba} value={aba}>{aba}</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">Descrição</label>
                            <textarea id="descricao" name="descricao" value={template.descricao} onChange={handleInputChange} rows={3} className="mt-1 w-full border border-gray-300 rounded-md p-2" />
                        </div>
                    </div>
                </div>

                {/* Seção 2: Emolumentos e Valores */}
                <div className="bg-white p-6 rounded-lg border">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Emolumentos e Valores (Opcional)</h2>
                    <div ref={seloSearchRef}>
                        <label htmlFor="selo" className="block text-sm font-medium text-gray-700">Vincular a um Ato/Selo de Emolumentos</label>
                        <div className="relative mt-1">
                            {selectedSelo ? (
                                <div className="w-full border border-gray-300 rounded-md p-2 bg-gray-100 flex justify-between items-center">
                                    <span className="text-sm text-gray-700">
                                        <strong>{selectedSelo.id_selo}:</strong> {selectedSelo.descricao_selo}
                                    </span>
                                    <button type="button" onClick={() => setTemplate(prev => ({ ...prev, id_selo: null }))} className="text-gray-500 hover:text-red-600">
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text" id="selo" value={seloSearchTerm}
                                        onChange={(e) => setSeloSearchTerm(e.target.value)}
                                        onFocus={() => setIsSeloDropdownOpen(true)}
                                        placeholder="Digite o ID ou a descrição do selo"
                                        className="w-full border border-gray-300 rounded-md p-2 pl-10" autoComplete="off"
                                    />
                                    {isSeloDropdownOpen && (
                                        <div className="absolute z-10 w-full bg-white border rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
                                            {filteredSelos.length > 0 ? filteredSelos.map(selo => (
                                                <div key={selo.id_selo} onClick={() => handleSeloSelect(selo)} className="p-2 hover:bg-blue-50 cursor-pointer text-sm">
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
                            <div className="pt-3 mt-3 flex justify-between items-center border-t"><span className="font-bold text-gray-800">Total:</span><span className="font-bold font-mono text-blue-600 text-base">{formatCurrency(selectedSelo.valor_emolumento + selectedSelo.valor_taxa_judiciaria)}</span></div>
                        </div>
                    )}
                </div>

                {/* Seção 3: Templates Padrão */}
                <div className="bg-white p-6 rounded-lg border">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Templates Padrão</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="cabecalhoPadraoId" className="block text-sm font-medium text-gray-700">Cabeçalho</label>
                            <select id="cabecalhoPadraoId" name="cabecalhoPadraoId" value={template.cabecalhoPadraoId || ''} onChange={handleInputChange} className="mt-1 w-full border border-gray-300 rounded-md p-2">
                                <option value="">Nenhum</option>
                                {mockHeaderFooterTemplates.filter(t => t.tipo === 'cabecalho').map(t => (<option key={t.id} value={t.id}>{t.nome}</option>))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="rodapePadraoId" className="block text-sm font-medium text-gray-700">Rodapé</label>
                            <select id="rodapePadraoId" name="rodapePadraoId" value={template.rodapePadraoId || ''} onChange={handleInputChange} className="mt-1 w-full border border-gray-300 rounded-md p-2">
                                <option value="">Nenhum</option>
                                {mockHeaderFooterTemplates.filter(t => t.tipo === 'rodape').map(t => (<option key={t.id} value={t.id}>{t.nome}</option>))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Seção 4: Layout e Margens */}
                <div className="bg-white p-6 rounded-lg border">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Layout e Margens</h2>
                    
                    <div className="grid grid-cols-2 gap-6 mb-2 pb-2">
                        <div>
                            <label htmlFor="layout-width" className="block text-sm font-medium text-gray-700">Largura (mm)</label>
                            <input
                                type="number"
                                id="layout-width"
                                name="layout.largura_mm"
                                value={template.layout.largura_mm}
                                onChange={handleInputChange}
                                className="mt-1 w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label htmlFor="layout-height" className="block text-sm font-medium text-gray-700">Altura (mm)</label>
                            <input
                                type="number"
                                id="layout-height"
                                name="layout.altura_mm"
                                value={template.layout.altura_mm}
                                onChange={handleInputChange}
                                className="mt-1 w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                    </div>

                    <h3 className="text-md font-medium text-gray-700 mb-4">Margens (cm)</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                            <label htmlFor="margin-top" className="block text-sm font-medium text-gray-700">Superior</label>
                            <input type="number" step="0.1" name="top" value={template.margins.top} onChange={handleMarginChange} className="mt-1 w-full border border-gray-300 rounded-md p-2" />
                        </div>
                        <div>
                            <label htmlFor="margin-bottom" className="block text-sm font-medium text-gray-700">Inferior</label>
                            <input type="number" step="0.1" name="bottom" value={template.margins.bottom} onChange={handleMarginChange} className="mt-1 w-full border border-gray-300 rounded-md p-2" />
                        </div>
                        <div>
                            <label htmlFor="margin-left" className="block text-sm font-medium text-gray-700">Esquerda</label>
                            <input type="number" step="0.1" name="left" value={template.margins.left} onChange={handleMarginChange} className="mt-1 w-full border border-gray-300 rounded-md p-2" />
                        </div>
                        <div>
                            <label htmlFor="margin-right" className="block text-sm font-medium text-gray-700">Direita</label>
                            <input type="number" step="0.1" name="right" value={template.margins.right} onChange={handleMarginChange} className="mt-1 w-full border border-gray-300 rounded-md p-2" />
                        </div>
                    </div>
                </div>

                {/* Seção 5: Modelo de Conteúdo */}
                <div className="bg-white p-6 rounded-lg border">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Editor de Conteúdo do Recibo</h2>
                    <div className="flex justify-center">
                        <MainEditor
                            initialValue={template.conteudo}
                            onEditorChange={handleEditorChange}
                            size={{ 
                                width: mmToPixels(template.layout.largura_mm), 
                                height: mmToPixels(template.layout.altura_mm) 
                            }}
                            margins={template.margins}
                        />
                    </div>
                </div>

                {/* Seção 6: Variáveis Dinâmicas */}
                <div className="bg-white p-5 rounded-lg border">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Variáveis Dinâmicas para Recibos</h3>
                    <p className="text-sm text-gray-500 mb-4">Clique em uma variável para copiá-la e cole no editor acima.</p>
                    <div className="flex flex-wrap gap-2">
                        {allVariables.map(variable => (
                            <button key={variable} type="button" onClick={() => handleCopyVariable(variable)} className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-mono px-2 py-1 rounded-md transition-colors">
                                {variable}
                                <Copy size={12} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Ações do Formulário */}
                <footer className="mt-2 pt-6 border-t flex justify-end gap-4">
                    <button type="button" onClick={() => navigate('/admin/recibos')} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300">
                        Cancelar
                    </button>
                    <button type="submit" disabled={isSaving} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-700 disabled:bg-blue-400">
                        {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        Salvar Modelo
                    </button>
                </footer>
            </form>
        </div>
    );
};

export default CadastroReciboPage;