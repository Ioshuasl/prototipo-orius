import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Edit, Trash2, Users } from 'lucide-react';
import { toast } from 'react-toastify';
import { mockCargos as initialCargos } from '../../../lib/Constants';
import { type ICargo } from '../../../types';

const GerenciamentoCargos: React.FC = () => {
    const [cargos, setCargos] = useState<ICargo[]>(initialCargos);
    const [searchTerm, setSearchTerm] = useState('');

    const handleDelete = (cargoId: number) => {
        if (window.confirm("Tem certeza que deseja excluir este cargo? Esta ação não pode ser desfeita.")) {
            setCargos(prev => prev.filter(c => c.id !== cargoId));
            toast.success("Cargo excluído com sucesso!");
        }
    };

    const filteredCargos = cargos.filter(c =>
        c.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="mx-auto">
            <title>Cargos e Permissões | Orius Tecnologia</title>
            <header className="flex items-center justify-between pb-4">
                <div>
                    {/* ALTERADO: Cor do título principal */}
                    <h1 className="text-3xl font-bold text-[#4a4e51]">Cargos e Permissões</h1>
                    <p className="text-md text-gray-500 mt-1">Gerencie os cargos e o que cada um pode acessar no sistema.</p>
                </div>
                 {/* ALTERADO: Cor do botão de ação principal */}
                <Link to="cadastrar" className="flex items-center gap-2 bg-[#dd6825] text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-[#c25a1f] transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dd6825]">
                    <PlusCircle className="h-5 w-5" />
                    Novo Cargo
                </Link>
            </header>

            <div className="mb-6">
                {/* ALTERADO: Estilo de foco do input de busca */}
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por nome do cargo..."
                    className="w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCargos.map(cargo => (
                    // ALTERADO: Adicionado 'group' e hover na borda do card
                    <div key={cargo.id} className="group bg-white rounded-lg border border-gray-200 shadow-sm p-5 flex flex-col justify-between transition-all hover:shadow-lg hover:border-[#dd6825]/50">
                        <Link to={`${cargo.id}`}>
                            <div>
                                {/* ALTERADO: Efeito de hover no título */}
                                <h2 className="text-xl font-bold text-gray-800 transition-colors">{cargo.nome}</h2>
                                <p className="text-gray-600 mt-2 text-sm h-16">{cargo.descricao}</p>
                                {/* ALTERADO: Cor do texto de contagem de usuários */}
                                <div className="mt-4 text-sm text-[#dd6825] font-medium flex items-center gap-2">
                                    <Users size={16} />
                                    <span>{cargo.id * 2} usuários neste cargo</span>
                                </div>
                            </div>
                        </Link>
                        <div className="mt-6 flex justify-end gap-3">
                            {/* ALTERADO: Cor do hover no botão de editar */}
                            <Link to={`${cargo.id}`} className="p-2 text-gray-500 hover:text-[#dd6825] hover:bg-[#dd6825]/10 rounded-full transition-colors">
                                <Edit size={20} />
                            </Link>
                            <button onClick={() => handleDelete(cargo.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GerenciamentoCargos;