// Salve como src/pages/GerenciamentoTemplates.tsx
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PlusCircle, Edit, Trash2, Star, X, Eye } from 'lucide-react';
import { type ITemplate } from '../../types';
import { mockHeaderFooterTemplates } from '../../lib/Constants';

const PreviewModal = ({ template, onClose }: { template: ITemplate | null, onClose: () => void }) => {
    if (!template) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
                <header className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-bold text-gray-800">{template.nome}</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X size={24} /></button>
                </header>
                <div className="p-6 bg-gray-100">
                    <div 
                        className="bg-white shadow-lg p-8 mx-auto" 
                        style={{ width: '21cm', minHeight: '10cm' }} // Simula uma folha A4 na largura
                        dangerouslySetInnerHTML={{ __html: template.conteudo }}
                    />
                </div>
            </div>
        </div>
    );
};

const TemplateCard = ({ template, onSetDefault, onDelete, onPreview  }: {
    template: ITemplate,
    onSetDefault: (id: number, tipo: 'cabecalho' | 'rodape') => void,
    onDelete: (id: number) => void
    onPreview: (template: ITemplate) => void
}) => {
    return (
        <div className="p-5 bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col transition-all hover:shadow-xl hover:border-blue-300">
            <Link to={`${template.id}`}>
                <div className="flex-grow">
                    <div className="flex justify-between items-start">
                        <h2 className="text-lg font-bold text-gray-800 pr-4">{template.nome}</h2>
                        {template.isPadrao && (
                            <span className="flex-shrink-0 mt-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 flex items-center gap-1">
                                <Star size={12} /> Padrão
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Modificado em: {new Date(template.dataModificacao).toLocaleDateString('pt-BR')}</p>

                    {/* Preview Visual */}
                    <div className="mt-4 border rounded-md p-2 bg-gray-50 h-32 overflow-hidden relative">
                    <div
                        className="transform scale-[0.5] origin-top"
                        dangerouslySetInnerHTML={{ __html: template.conteudo }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-50 to-transparent"></div>
                </div>
                </div>
            </Link>

            <div className="p-4 bg-gray-50/50 flex justify-end items-center gap-3">
                {!template.isPadrao && (
                    <button onClick={() => onSetDefault(template.id, template.tipo)} className="text-sm font-semibold text-gray-600 hover:text-yellow-600 transition-colors">
                        Definir como Padrão
                    </button>
                )}
                <button onClick={() => onPreview(template)} className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full">
                    <Eye size={20} />
                </button>
                <Link to={`${template.id}`} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full">
                    <Edit size={20} />
                </Link>
                <button onClick={() => onDelete(template.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full">
                    <Trash2 size={20} />
                </button>
            </div>
        </div>
    );
};


// --- COMPONENTE PRINCIPAL DA PÁGINA ---
const GerenciamentoTemplates: React.FC = () => {
    const [templates, setTemplates] = useState<ITemplate[]>(mockHeaderFooterTemplates);
    const [activeTab, setActiveTab] = useState<'cabecalho' | 'rodape'>('cabecalho');
    const [templateParaVisualizar, setTemplateParaVisualizar] = useState<ITemplate | null>(null);

    const handleSetDefault = (id: number, tipo: 'cabecalho' | 'rodape') => {
        setTemplates(prev =>
            prev.map(t => {
                if (t.tipo === tipo) {
                    return { ...t, isPadrao: t.id === id };
                }
                return t;
            })
        );
        toast.success("Template definido como padrão!");
    };

    const handleDelete = (id: number) => {
        if (window.confirm("Tem certeza que deseja excluir este template?")) {
            setTemplates(prev => prev.filter(t => t.id !== id));
            toast.success("Template excluído com sucesso.");
        }
    };

    const filteredTemplates = useMemo(() => {
        return templates.filter(t => t.tipo === activeTab);
    }, [templates, activeTab]);

    const tabStyle = "px-4 py-3 font-semibold text-center border-b-2 cursor-pointer transition-colors duration-200 w-full md:w-auto";
    const activeTabStyle = "border-blue-600 text-blue-600";
    const inactiveTabStyle = "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300";

    return (
        <>
        
            <div className="max-w-7xl mx-auto p-6">
                <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 pb-4 border-b">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Cabeçalhos e Rodapés</h1>
                        <p className="text-md text-gray-500 mt-1">Crie e gerencie os modelos de cabeçalho e rodapé para os documentos.</p>
                    </div>
                    <Link to="cadastrar" className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 mt-4 md:mt-0">
                        <PlusCircle className="h-5 w-5" />
                        Criar Novo Template
                    </Link>
                </header>

                {/* Abas para filtrar entre Cabeçalho e Rodapé */}
                <nav className="flex mb-6 border-b border-gray-200">
                    <button onClick={() => setActiveTab('cabecalho')} className={`${tabStyle} ${activeTab === 'cabecalho' ? activeTabStyle : inactiveTabStyle}`}>
                        Cabeçalhos
                    </button>
                    <button onClick={() => setActiveTab('rodape')} className={`${tabStyle} ${activeTab === 'rodape' ? activeTabStyle : inactiveTabStyle}`}>
                        Rodapés
                    </button>
                </nav>

                {/* Grid de Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredTemplates.map(template => (
                        <TemplateCard
                            key={template.id}
                            template={template}
                            onSetDefault={handleSetDefault}
                            onDelete={handleDelete}
                            onPreview={setTemplateParaVisualizar} 
                        />
                    ))}
                </div>
            </div>

            {/* RENDERIZAÇÃO DO MODAL */}
            <PreviewModal 
                template={templateParaVisualizar} 
                onClose={() => setTemplateParaVisualizar(null)} 
            />
        </>
    );
};

export default GerenciamentoTemplates;