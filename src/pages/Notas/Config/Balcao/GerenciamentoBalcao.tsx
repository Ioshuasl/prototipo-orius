import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PlusCircle, Edit, Trash2, FileText, Upload } from 'lucide-react';
import { mockBalcaoTemplates, mockTipoServicoBalcao } from '../../lib/Constants';
import { type IBalcaoTemplate, type ITipoServicoBalcao } from '../../Types'

// Componente de Card
const BalcaoCard = ({ template, onDelete }: {
    template: IBalcaoTemplate,
    onDelete: (id: string) => void
}) => {
    // Busca o nome do serviço para exibição no card
    const tipoServico = mockTipoServicoBalcao.find(t => t.id === template.tipoServicoBalcaoId);

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col transition-all hover:shadow-xl">
            <Link to={`${template.id}`}>
                <div className="p-5 flex-grow">
                    <span className="text-xs font-semibold text-[#dd6825] bg-[#dd6825]/10 px-2 py-1 rounded-full">{tipoServico?.nome || 'Serviço Desconhecido'}</span>
                    <h2 className="text-lg font-bold text-gray-800 pr-4 mt-2">{template.titulo}</h2>
                    <p className="text-sm text-gray-500 mt-2 h-12">{template.descricao}</p>
                    <div className="mt-3 text-xs text-gray-400">
                        Layout: {template.layout.largura_mm}x{template.layout.altura_mm} mm
                    </div>
                </div>
            </Link>

            <div className="p-4 bg-gray-50/50 flex justify-end items-center gap-3">
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


const GerenciamentoBalcao: React.FC = () => {
    const [templates, setTemplates] = useState<IBalcaoTemplate[]>(mockBalcaoTemplates);
    // Estado para a aba ativa: usa o ID do tipo de serviço, ou 0 para 'Todos'
    const [activeTabId, setActiveTabId] = useState<number>(1); // Inicia em 'Reconhecimento' (ID 1)

    const handleDelete = (id: string) => {
        if (window.confirm("Tem certeza que deseja excluir este modelo de serviço de balcão?")) {
            setTemplates(prev => prev.filter(t => t.id !== id));
            toast.success("Modelo de serviço de balcão excluído com sucesso.");
        }
    };

    const filteredTemplates = useMemo(() => {
        // Filtra por ID do tipo de serviço
        if (activeTabId === 0) return templates;
        return templates.filter(t => t.tipoServicoBalcaoId === activeTabId);
    }, [templates, activeTabId]);

    // Prepara a lista de abas, incluindo uma opção 'Todos'
    const abas: (ITipoServicoBalcao & { id: number })[] = [
        // { id: 0, nome: "Todos" }, // Removido para simplificar, como no GerenciamentoCertidoes
        ...mockTipoServicoBalcao
    ];
    
    const tabStyle = "px-4 py-3 font-semibold text-center border-b-2 cursor-pointer transition-colors duration-200 w-full md:w-auto";
    const activeTabStyle = "border-[#dd6825] text-[#dd6825]";
    const inactiveTabStyle = "border-transparent text-gray-500 hover:text-[#dd6825] hover:border-[#dd6825]/30";

    return (
        <div className="mx-auto">
            <title>Modelos de Serviços de Balcão | Orius Tecnologia</title>
            <header className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#4a4e51]">Modelos de Serviços de Balcão</h1>
                    <p className="text-md text-gray-500 mt-1">Gerencie os modelos utilizados para etiquetas, carimbos e comprovantes de serviços de Tabelionato de Notas.</p>
                </div>
                <div className='flex gap-4'>
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
                        key={aba.id}
                        onClick={() => setActiveTabId(aba.id)}
                        className={`${tabStyle} ${activeTabId === aba.id ? activeTabStyle : inactiveTabStyle}`}
                    >
                        {aba.nome}
                    </button>
                ))}
            </nav>

            {filteredTemplates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTemplates.map(template => (
                        <BalcaoCard
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
                    <p className="mt-1 text-sm text-gray-500">Não há modelos de serviço para o tipo "{mockTipoServicoBalcao.find(a => a.id === activeTabId)?.nome || 'Selecionado'}".</p>
                </div>
            )}
        </div>
    );
};

export default GerenciamentoBalcao;