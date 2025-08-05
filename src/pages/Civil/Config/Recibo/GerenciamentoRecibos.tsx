import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PlusCircle, Edit, Trash2, FileText } from 'lucide-react';
import { type ReciboTemplate, type TipoRecibo } from '../../types';
import { mockReciboTemplates } from '../../lib/Constants';

// --- SUBCOMPONENTE CARD ---
const ReciboCard = ({ template, onDelete }: {
    template: ReciboTemplate,
    onDelete: (id: string) => void
}) => {
    return (
        // ALTERADO: Cor da borda no hover
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col transition-all hover:shadow-xl hover:border-[#dd6825]/50">
            <Link to={`${template.id}`} className="flex-grow">
                <div className="p-5">
                    <h2 className="text-lg font-bold text-gray-800 pr-4">{template.titulo}</h2>
                    <p className="text-sm text-gray-500 mt-2 min-h-[40px]">{template.descricao}</p>
                </div>
            </Link>

            <div className="p-4 bg-gray-50/50 flex justify-end items-center gap-3">
                {/* ALTERADO: Cor do hover no botão de editar */}
                <Link to={`${template.id}`} className="p-2 text-gray-500 hover:text-[#dd6825] hover:bg-[#dd6825]/10 rounded-full" aria-label={`Editar ${template.titulo}`}>
                    <Edit size={20} />
                </Link>
                <button onClick={() => onDelete(template.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full" aria-label={`Excluir ${template.titulo}`}>
                    <Trash2 size={20} />
                </button>
            </div>
        </div>
    );
};

// --- COMPONENTE PRINCIPAL DA PÁGINA ---
const GerenciamentoRecibos: React.FC = () => {
    const [templates, setTemplates] = useState<ReciboTemplate[]>(mockReciboTemplates);
    const [activeTab, setActiveTab] = useState<TipoRecibo>('Segunda Via');

    const handleDelete = (id: string) => {
        if (window.confirm("Tem certeza que deseja excluir este modelo de recibo? Esta ação não pode ser desfeita.")) {
            setTemplates(prev => prev.filter(t => t.id !== id));
            toast.success("Modelo de recibo excluído com sucesso.");
        }
    };

    const filteredTemplates = useMemo(() => {
        return templates.filter(t => t.tipoRecibo === activeTab);
    }, [templates, activeTab]);

    const abas: TipoRecibo[] = ["Segunda Via", "Averbação", "Habilitação de Casamento", "Busca de Registro", "Apostilamento", "Outros"];
    const tabStyle = "px-4 py-3 font-semibold text-center border-b-2 cursor-pointer transition-colors duration-200 w-full md:w-auto";
    
    // ALTERADO: Cores da aba ativa e inativa
    const activeTabStyle = "border-[#dd6825] text-[#dd6825]";
    const inactiveTabStyle = "border-transparent text-gray-500 hover:text-[#dd6825] hover:border-[#dd6825]/30";

    return (
        <div className="mx-auto">
            <title>Modelos de Recibo | Orius Tecnologia</title>
            <header className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4">
                <div>
                    {/* ALTERADO: Cor do título principal */}
                    <h1 className="text-3xl font-bold text-[#4a4e51]">Modelos de Recibo</h1>
                    <p className="text-md text-gray-500 mt-1">Gerencie os modelos para emissão de recibos do Registro Civil.</p>
                </div>
                {/* ALTERADO: Cor do botão de ação principal */}
                <Link to="cadastrar" className="flex items-center gap-2 bg-[#dd6825] text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-[#c25a1f] mt-4 md:mt-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dd6825]">
                    <PlusCircle className="h-5 w-5" />
                    Novo Modelo
                </Link>
            </header>

            <nav className="flex mb-6 border-b border-gray-200 overflow-x-auto">
                {abas.map(aba => (
                    <button
                        key={aba}
                        onClick={() => setActiveTab(aba)}
                        className={`${tabStyle} ${activeTab === aba ? activeTabStyle : inactiveTabStyle}`}
                    >
                        {aba}
                    </button>
                ))}
            </nav>

            {filteredTemplates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTemplates.map(template => (
                        <ReciboCard
                            key={template.id}
                            template={template}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <FileText size={48} className="mx-auto text-gray-400" />
                    <h3 className="mt-4 text-lg font-semibold text-gray-700">Nenhum modelo encontrado</h3>
                    <p className="mt-1 text-sm text-gray-500">Não há modelos de recibo para o tipo "{activeTab}".</p>
                    {/* ALTERADO: Cor do link no estado de "nenhum modelo" */}
                    <Link to="cadastrar" className="mt-4 inline-block text-[#dd6825] font-semibold hover:underline">
                        Crie o primeiro modelo
                    </Link>
                </div>
            )}
        </div>
    );
};

export default GerenciamentoRecibos;