import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Save, Loader2, ArrowLeft } from 'lucide-react';
import { mockHeaderFooterTemplates } from '../../lib/Constants';
import MainEditor from '../../../Components/MainEditor';

export interface ITemplate {
  id: number;
  nome: string;
  tipo: 'cabecalho' | 'rodape';
  conteudo: string;
  isPadrao: boolean;
  dataModificacao: string;
}

const initialState: ITemplate = {
    id: 0,
    nome: '',
    tipo: 'cabecalho',
    conteudo: '<p>Comece a editar aqui...</p>',
    isPadrao: false,
    dataModificacao: new Date().toISOString(),
};

const CadastroTemplatePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [template, setTemplate] = useState<ITemplate>(initialState);
    const [isLoading, setIsLoading] = useState(!!id);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (id) {
            const templateExistente = mockHeaderFooterTemplates.find(t => t.id === parseInt(id));
            if (templateExistente) {
                setTemplate(templateExistente);
            } else {
                toast.error("Template não encontrado.");
                navigate(-1);
            }
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }, [id, navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setTemplate(prev => ({ ...prev, [name]: checked }));
        } else {
            setTemplate(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleEditorChange = (content: string) => {
        setTemplate(prev => ({ ...prev, conteudo: content }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!template.nome) {
            toast.error("O nome do template é obrigatório.");
            return;
        }
        setIsSaving(true);
        console.log("Salvando template:", template);
        toast.success("Template salvo com sucesso!");
        setTimeout(() => {
            setIsSaving(false);
            navigate(-1);
        }, 1500);
    };

    const pageTitle = id ? "Editar Template" : "Criar Novo Template";

    // ALTERADO: Centralização dos estilos de formulário
    const commonInputClass = "mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]";

    if (isLoading) {
        // ALTERADO: Cor do loader
        return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-[#dd6825]" size={32} /></div>;
    }

    return (
        <div className="mx-auto p-6">
            <title>{pageTitle} | Orius Tecnologia</title>
            <header className="mb-6 pb-4">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-4">
                    <ArrowLeft size={16} />
                    Voltar para a Lista
                </button>
                {/* ALTERADO: Cor do título principal */}
                <h1 className="text-3xl font-bold text-[#4a4e51]">{pageTitle}</h1>
                {id && <p className="text-gray-500 mt-1">Modificando: {template.nome}</p>}
            </header>

            <form onSubmit={handleSubmit}>
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Configurações do Template</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome do Template*</label>
                            <input type="text" id="nome" name="nome" value={template.nome} onChange={handleInputChange} className={commonInputClass}/>
                        </div>
                        <div>
                            <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">Tipo de Template*</label>
                            <select id="tipo" name="tipo" value={template.tipo} onChange={handleInputChange} disabled={!!id} className={`${commonInputClass} disabled:bg-gray-100 disabled:cursor-not-allowed`}>
                                <option value="cabecalho">Cabeçalho</option>
                                <option value="rodape">Rodapé</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="flex items-center space-x-3 cursor-pointer">
                             {/* ALTERADO: Cor e foco do checkbox */}
                            <input
                                type="checkbox"
                                name="isPadrao"
                                checked={template.isPadrao}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-[#dd6825] border-gray-300 rounded focus:ring-[#dd6825]"
                            />
                            <span className="text-sm text-gray-700">Definir como template padrão para este tipo</span>
                        </label>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                     <h2 className="text-lg font-semibold text-gray-700 mb-4">Conteúdo</h2>
                     <div className="flex justify-center">
                        <MainEditor
                            initialValue={template.conteudo}
                            onEditorChange={handleEditorChange}
                            size={{ width: 800, height: 300 }}
                            margins={{ top: '1', bottom: '1', left: '1', right: '1' }}
                        />
                     </div>
                </div>

                <footer className="mt-8 pt-6 flex justify-end gap-4">
                    <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300">
                        Cancelar
                    </button>
                    {/* ALTERADO: Cor do botão de ação principal */}
                    <button type="submit" disabled={isSaving} className="px-6 py-2 bg-[#dd6825] text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-[#c25a1f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dd6825]">
                        {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        Salvar Template
                    </button>
                </footer>
            </form>
        </div>
    );
};

export default CadastroTemplatePage;