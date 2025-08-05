import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PlusCircle, Edit, Trash2, FileText, Upload } from 'lucide-react';
import { mockAverbacaoTemplates, averbacaoPorAto } from '../../lib/Constants';
import { type TipoAto, type AverbacaoTemplate } from '../../types';

// --- SUBCOMPONENTE CARD ---
const AverbacaoCard = ({ template, onDelete }: {
    template: AverbacaoTemplate,
    onDelete: (id: string) => void
}) => {
    const tipoServico = averbacaoPorAto[template.tipoAto]?.find(
        opt => opt.id === template.averbacaoOptionId
    )?.titulo_servico;

    return (
        // ALTERADO: Cor da borda no hover
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col transition-all hover:shadow-xl">
            <Link to={`${template.id}`}>
                <div className="p-5 flex-grow">
                    <div className="flex justify-between items-start">
                        <h2 className="text-lg font-bold text-gray-800 pr-4">{template.titulo}</h2>
                    </div>
                    {tipoServico && (
                        // ALTERADO: Cor do badge de tipo de serviço
                        <p className="text-xs font-semibold text-[#c25a1f] bg-[#dd6825]/10 rounded-full px-2 py-1 inline-block mt-2">
                            {tipoServico}
                        </p>
                    )}
                    <p className="text-sm text-gray-500 mt-2 h-12">{template.descricao}</p>
                </div>
            </Link>

            <div className="mt-auto p-4 bg-gray-50/50 flex justify-end items-center gap-3">
                {/* ALTERADO: Cor do hover no botão de editar */}
                <Link to={`${template.id}`} className="p-2 text-gray-500 hover:text-[#dd6825] hover:bg-[#dd6825]/10 rounded-full">
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
const GerenciamentoAverbacoes: React.FC = () => {
    const [templates, setTemplates] = useState<AverbacaoTemplate[]>(mockAverbacaoTemplates);
    const [activeTab, setActiveTab] = useState<TipoAto>('Nascimento');

    const handleDelete = (id: string) => {
        if (window.confirm("Tem certeza que deseja excluir este modelo de averbação?")) {
            setTemplates(prev => prev.filter(t => t.id !== id));
            toast.success("Modelo excluído com sucesso.");
        }
    };

    const filteredTemplates = useMemo(() => {
        return templates.filter(t => t.tipoAto === activeTab);
    }, [templates, activeTab]);

    const abas: TipoAto[] = ["Nascimento", "Casamento", "Óbito", "Natimorto", "Livro E"];
    const tabStyle = "px-4 py-3 font-semibold text-center border-b-2 cursor-pointer transition-colors duration-200 w-full md:w-auto";
    
    // ALTERADO: Cores da aba ativa e inativa
    const activeTabStyle = "border-[#dd6825] text-[#dd6825]";
    const inactiveTabStyle = "border-transparent text-gray-500 hover:text-[#dd6825] hover:border-[#dd6825]/30";

    return (
        <div className="mx-auto">
            <title>Modelos de Averbação | Orius Tecnologia</title>
            <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 pb-4">
                <div>
                    {/* ALTERADO: Cor do título principal */}
                    <h1 className="text-3xl font-bold text-[#4a4e51]">Modelos de Averbação</h1>
                    <p className="text-md text-gray-500 mt-1">Gerencie os textos padrão utilizados para as averbações nos registros.</p>
                </div>
                <div className='flex gap-4'>
                    {/* ALTERADO: Cor dos botões de ação principal */}
                    <Link to="cadastrar" className="flex items-center gap-2 bg-[#4a4e51] text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-[#3b3e40] transition-colors mt-4 md:mt-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4a4e51]">
                        <Upload className="h-5 w-5" />
                        Importar Modelo
                    </Link>
                    <Link to="cadastrar" className="flex items-center gap-2 bg-[#dd6825] text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-[#c25a1f] transition-colors mt-4 md:mt-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dd6825]">
                        <PlusCircle className="h-5 w-5" />
                        Novo Modelo
                    </Link>
                </div>
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
                        <AverbacaoCard
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
                    <p className="mt-1 text-sm text-gray-500">Não há modelos de averbação para o tipo de ato "{activeTab}".</p>
                </div>
            )}
        </div>
    );
};

export default GerenciamentoAverbacoes;