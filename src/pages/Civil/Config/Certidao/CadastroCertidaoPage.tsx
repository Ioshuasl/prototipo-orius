// Salve como src/pages/CadastroCertidaoPage.tsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Save, Loader2, ArrowLeft, Copy, X, Search } from 'lucide-react';
import MainEditor from '../../Components/MainEditor';
import { type TipoAto, type CertidaoTemplate } from '../../types';
import { mockCertidaoTemplates, mockHeaderFooterTemplates } from '../../lib/Constants';
import emolumentosData from '../../../../../tabela-emolumentos.json'

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
    // Fator de conversão aproximado para uma tela de 96 DPI
    return (mm / 25.4) * 96;
};


const initialState: CertidaoTemplate = {
    id: `CERT-${Date.now()}`,
    titulo: '',
    descricao: '',
    id_selo: null,
    tipoAto: 'Nascimento',
    cabecalhoPadraoId: null,
    rodapePadraoId: null,
    conteudo: '<p>Comece a editar o corpo da certidão aqui...</p>',
    margins: { top: '2.5', right: '2.5', bottom: '2.5', left: '2.5' },
    layout: { largura_mm: 210, altura_mm: 297 }

};

const CadastroCertidaoPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [template, setTemplate] = useState<CertidaoTemplate>(initialState);
    const [isLoading, setIsLoading] = useState(!!id);
    const [isSaving, setIsSaving] = useState(false);
    const [margins, setMargins] = useState({
        top: '2.5',
        bottom: '2.5',
        left: '2.0',
        right: '2.0',
    });

    const [seloSearchTerm, setSeloSearchTerm] = useState('');
    const [isSeloDropdownOpen, setIsSeloDropdownOpen] = useState(false);
    const seloSearchRef = useRef<HTMLDivElement>(null);

    const selosRegistroCivil = useMemo(() => {
        return emolumentosData.filter(selo => selo.sistema === 'REGISTRO CIVIL');
    }, []);

    // Filtra os selos com base no termo de busca (ID ou descrição)
    const filteredSelos = useMemo(() => {
        if (!seloSearchTerm) return selosRegistroCivil;
        return selosRegistroCivil.filter(selo =>
            selo.descricao_selo.toLowerCase().includes(seloSearchTerm.toLowerCase()) ||
            String(selo.id_selo).includes(seloSearchTerm)
        );
    }, [seloSearchTerm, selosRegistroCivil]);

    // Obtém o selo atualmente selecionado para exibição
    const selectedSelo = useMemo(() => {
        return selosRegistroCivil.find(s => s.id_selo === template.id_selo) || null;
    }, [template.id_selo, selosRegistroCivil]);

    const handleMarginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setMargins(prevMargins => ({
            ...prevMargins,
            [name]: value
        }));
        console.log(margins)
    };

    useEffect(() => {
        if (id) {
            const templateExistente = mockCertidaoTemplates.find(t => t.id === id);
            if (templateExistente) {
                setTemplate(templateExistente);
            } else {
                toast.error("Modelo de certidão não encontrado.");
                navigate(-1);
            }
            setIsLoading(false);
        }
    }, [id, navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        console.log(e.target)
        setTemplate(prev => updateNestedState(prev, name, value));
        console.log(template)
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
        console.log("Salvando modelo de certidão:", template);
        toast.success("Modelo salvo com sucesso!");
        setTimeout(() => {
            setIsSaving(false);
            navigate(-1);
        }, 1500);
    };

    const pageTitle = id ? "Editar Modelo de Certidão" : "Criar Novo Modelo de Certidão";
    const abas: TipoAto[] = ["Nascimento", "Casamento", "Óbito", "Natimorto", "Livro E"];
    const allVariables = ['{{ MATRICULA }}', '{{ NOME_DO_REGISTRADO }}', '{{ DATA_DE_NASCIMENTO }}', '{{ HORA_DE_NASCIMENTO }}', '{{ NOME_DO_PAI }}', '{{ NOME_DA_MAE }}'];

    if (isLoading) {
        return <div className="flex justify-center p-10"><Loader2 className="animate-spin" size={32} /></div>;
    }

    return (
        <div className="mx-auto">
            <header className="mb-6 pb-4">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-4">
                    <ArrowLeft size={16} />
                    Voltar para a Lista
                </button>
                <h1 className="text-3xl font-bold text-gray-800">{pageTitle}</h1>
                {id && <p className="text-gray-500 mt-1">Modificando: {template.titulo}</p>}
            </header>

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* Seção 1: Identificação */}
                <div className="bg-white p-6 rounded-lg border border-gray-300">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Identificação</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">Título do Modelo*</label>
                            <input type="text" id="titulo" name="titulo" value={template.titulo} onChange={handleInputChange} className="mt-1 w-full border border-gray-300 rounded-md p-2" />
                        </div>
                        <div>
                            <label htmlFor="tipoAto" className="block text-sm font-medium text-gray-700">Tipo de Ato*</label>
                            <select id="tipoAto" name="tipoAto" value={template.tipoAto} onChange={handleInputChange} disabled={!!id} className="mt-1 w-full border border-gray-300 rounded-md p-2 bg-gray-50 disabled:cursor-not-allowed">
                                {abas.map(aba => <option key={aba} value={aba}>{aba}</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">Descrição</label>
                            <textarea id="descricao" name="descricao" value={template.descricao} onChange={handleInputChange} rows={3} className="mt-1 w-full border border-gray-300 rounded-md p-2" />
                        </div>
                    </div>
                </div>

                {/* --- SEÇÃO DE EMOLUMENTOS REORGANIZADA --- */}
                <div className="bg-white p-6 rounded-lg border border-gray-300">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Emolumentos e Valores</h2>
                    <div className="md:col-span-2" ref={seloSearchRef}>
                        <label htmlFor="selo" className="block text-sm font-medium text-gray-700">Selo de Emolumentos*</label>
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
                                        type="text"
                                        id="selo"
                                        value={seloSearchTerm}
                                        onChange={(e) => setSeloSearchTerm(e.target.value)}
                                        onFocus={() => setIsSeloDropdownOpen(true)}
                                        placeholder="Digite o ID ou a descrição do selo"
                                        className="w-full border border-gray-300 rounded-md p-2 pl-10"
                                        autoComplete="off"
                                    />
                                    {isSeloDropdownOpen && (
                                        <div className="absolute z-10 w-full bg-white border rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
                                            {filteredSelos.length > 0 ? filteredSelos.map(selo => (
                                                <div
                                                    key={selo.id_selo}
                                                    onClick={() => handleSeloSelect(selo)}
                                                    className="p-2 hover:bg-blue-50 cursor-pointer text-sm"
                                                >
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
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-600">Valor do Emolumento:</span>
                                <span className="font-mono text-gray-800">{formatCurrency(selectedSelo.valor_emolumento)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-600">Taxa Judiciária:</span>
                                <span className="font-mono text-gray-800">{formatCurrency(selectedSelo.valor_taxa_judiciaria)}</span>
                            </div>
                            <div className="pt-3 mt-3 flex justify-between items-center">
                                <span className="font-bold text-gray-800">Total:</span>
                                <span className="font-bold font-mono text-blue-600 text-base">{formatCurrency(selectedSelo.valor_emolumento + selectedSelo.valor_taxa_judiciaria)}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Seção 2: Templates Padrão */}
                <div className="bg-white p-6 rounded-lg border border-gray-300">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Templates Padrão</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="cabecalhoPadraoId" className="block text-sm font-medium text-gray-700">Cabeçalho</label>
                            <select id="cabecalhoPadraoId" name="cabecalhoPadraoId" value={template.cabecalhoPadraoId || ''} onChange={handleInputChange} className="mt-1 w-full border border-gray-300 rounded-md p-2">
                                <option value="">Nenhum</option>
                                {mockHeaderFooterTemplates.filter(t => t.tipo === 'cabecalho').map(t => (
                                    <option key={t.id} value={t.id}>{t.nome}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="rodapePadraoId" className="block text-sm font-medium text-gray-700">Rodapé</label>
                            <select id="rodapePadraoId" name="rodapePadraoId" value={template.rodapePadraoId || ''} onChange={handleInputChange} className="mt-1 w-full border border-gray-300 rounded-md p-2">
                                <option value="">Nenhum</option>
                                {mockHeaderFooterTemplates.filter(t => t.tipo === 'rodape').map(t => (
                                    <option key={t.id} value={t.id}>{t.nome}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Seção 3. Layout e Margens */}
                <div className="bg-white p-6 rounded-lg border border-gray-300">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Layout e Margens</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                            <label htmlFor="margin-top" className="block text-sm font-medium text-gray-700">Superior (cm)</label>
                            <input
                                type="number"
                                id="margin-top"
                                name="top"
                                value={margins.top}
                                onChange={handleMarginChange}
                                className="mt-1 w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label htmlFor="margins-bottom" className="block text-sm font-medium text-gray-700">Inferior (cm)</label>
                            <input
                                type="number"
                                id="margins-bottom"
                                name="bottom"
                                value={margins.bottom}
                                onChange={handleMarginChange}
                                className="mt-1 w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label htmlFor="margins-left" className="block text-sm font-medium text-gray-700">Esquerda (cm)</label>
                            <input
                                type="number"
                                id="margins-left"
                                name="left"
                                value={margins.left}
                                onChange={handleMarginChange}
                                className="mt-1 w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label htmlFor="margins-right" className="block text-sm font-medium text-gray-700">Direita (cm)</label>
                            <input
                                type="number"
                                id="margins-right"
                                name="right"
                                value={margins.right}
                                onChange={handleMarginChange}
                                className="mt-1 w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                    </div>
                </div>

                {/* Seção 4: Modelo de Conteúdo */}
                <div className="bg-white p-6 rounded-lg border border-gray-300">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Modelo de Conteúdo</h2>
                    <div className="flex justify-center">
                        <MainEditor
                            initialValue={template.conteudo}
                            onEditorChange={handleEditorChange}
                            size={{ 
                                width: mmToPixels(template.layout.largura_mm), 
                                height: mmToPixels(template.layout.altura_mm) 
                            }}
                            margins={margins}
                        />
                    </div>
                </div>

                {/* Seção de Variáveis (opcional, pode vir depois do editor) */}
                <div className="bg-white p-5 rounded-lg border border-gray-300">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Variáveis Dinâmicas Disponíveis</h3>
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
                <div>
                    <footer className="mt-2 pt-6 flex justify-end gap-4">
                        <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold">
                            Cancelar
                        </button>
                        <button type="submit" disabled={isSaving} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold flex items-center gap-2">
                            {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            Salvar Modelo
                        </button>
                    </footer>
                </div>
            </form>
        </div>
    );
};

export default CadastroCertidaoPage;