import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Save, Loader2, ArrowLeft, Copy } from 'lucide-react';
import MainEditor from '../../Components/MainEditor';
import { type TipoAto, type CertidaoTemplate } from '../../types';
import { mockCertidaoTemplates, mockHeaderFooterTemplates } from '../../lib/Constants';

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


const initialState: CertidaoTemplate = {
    id: `CERT-${Date.now()}`,
    titulo: '',
    descricao: '',
    tipoAto: 'Nascimento',
    cabecalhoPadraoId: null,
    rodapePadraoId: null,
    conteudo: '<p>Comece a editar o corpo da certidão aqui...</p>',
    margins: { top: '2.5', right: '2.5', bottom: '2.5', left: '2.5' }

};

const CadastroCertidaoPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [template, setTemplate] = useState<CertidaoTemplate>(initialState);
    const [isLoading, setIsLoading] = useState(!!id);
    const [isSaving, setIsSaving] = useState(false);

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
        setTemplate(prev => updateNestedState(prev, name, value));
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
        <div className="max-w-7xl mx-auto p-6">
            <header className="mb-6 pb-4 border-b">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-4">
                    <ArrowLeft size={16} />
                    Voltar para a Lista
                </button>
                <h1 className="text-3xl font-bold text-gray-800">{pageTitle}</h1>
                {id && <p className="text-gray-500 mt-1">Modificando: {template.titulo}</p>}
            </header>

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* Seção 1: Identificação */}
                <div className="bg-white p-6 rounded-lg border">
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

                {/* Seção 2: Templates Padrão */}
                <div className="bg-white p-6 rounded-lg border">
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
                <div className="bg-white p-6 rounded-lg border">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Layout e Margens</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                            <label htmlFor="margins.top" className="block text-sm font-medium text-gray-700">Superior (cm)</label>
                            <input
                                type="text"
                                id="margins.top"
                                name="margins.top"
                                value={template.margins.top}
                                onChange={handleInputChange}
                                className="mt-1 w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label htmlFor="margins.bottom" className="block text-sm font-medium text-gray-700">Inferior (cm)</label>
                            <input
                                type="text"
                                id="margins.bottom"
                                name="margins.bottom"
                                value={template.margins.bottom}
                                onChange={handleInputChange}
                                className="mt-1 w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label htmlFor="margins.left" className="block text-sm font-medium text-gray-700">Esquerda (cm)</label>
                            <input
                                type="text"
                                id="margins.left"
                                name="margins.left"
                                value={template.margins.left}
                                onChange={handleInputChange}
                                className="mt-1 w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label htmlFor="margins.right" className="block text-sm font-medium text-gray-700">Direita (cm)</label>
                            <input
                                type="text"
                                id="margins.right"
                                name="margins.right"
                                value={template.margins.right}
                                onChange={handleInputChange}
                                className="mt-1 w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                    </div>
                </div>

                {/* Seção 4: Modelo de Conteúdo */}
                <div className="bg-white p-6 rounded-lg border">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Modelo de Conteúdo</h2>
                    <div className="flex justify-center">
                        <MainEditor
                            initialValue={template.conteudo}
                            onEditorChange={handleEditorChange}
                            size={{ width: 794, height: 1123 }}
                            margins={template.margins}
                        />
                    </div>
                </div>

                {/* Seção de Variáveis (opcional, pode vir depois do editor) */}
                <div className="bg-white p-5 rounded-lg border">
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
                    <footer className="mt-2 pt-6 border-t flex justify-end gap-4">
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