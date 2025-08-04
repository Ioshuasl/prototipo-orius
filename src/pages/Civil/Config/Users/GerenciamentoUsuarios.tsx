// Salve como src/pages/GerenciamentoUsuarios.tsx
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Edit, Trash2, UserPlus, UserCircle, Briefcase } from 'lucide-react';

// Importando os mocks de usuários e cargos
import { mockUsuarios as initialUsuarios, mockCargos } from '../../lib/Constants';
import { type IUsuario } from '../../types';

const UserCard = ({ usuario, getCargoNome, onDelete }: {
    usuario: IUsuario,
    getCargoNome: (id: number) => string,
    onDelete: () => void
}) => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 flex flex-col transition-all hover:shadow-lg hover:border-blue-300">
            <Link to={`${usuario.id}`}>
            
            <div className="flex-grow">
                <div className="flex items-center gap-4">
                    <div className="flex-shrink-0"><UserCircle size={48} className="text-gray-300" /></div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">{usuario.nome}</h2>
                        <p className="text-sm text-gray-500 truncate">{usuario.email}</p>
                    </div>
                </div>
                <div className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center text-gray-700"><Briefcase size={16} className="text-gray-400 mr-2" /><span>{getCargoNome(usuario.cargoId)}</span></div>
                    <div><span className={`px-2 py-1 text-xs font-semibold rounded-full ${usuario.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>{usuario.status}</span></div>
                </div>
            </div>
            </Link>
            <div className="mt-6 pt-4 flex justify-end gap-3">
                {/* O botão de editar agora é um Link */}
                <Link to={`${usuario.id}`} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                    <Edit size={20} />
                </Link>
                <button onClick={onDelete} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors">
                    <Trash2 size={20} />
                </button>
            </div>
        </div>
    );
};


// --- COMPONENTE PRINCIPAL DA PÁGINA ---
const GerenciamentoUsuarios: React.FC = () => {
    const [usuarios, setUsuarios] = useState<IUsuario[]>(initialUsuarios);
    const [filtros, setFiltros] = useState({ searchTerm: '', cargoId: 'todos', status: 'todos' });

    const handleDelete = (usuarioId: number) => {
        if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
            setUsuarios(prev => prev.filter(u => u.id !== usuarioId));
            toast.success("Usuário excluído com sucesso!");
        }
    };

    const filteredUsuarios = useMemo(() => {
        return usuarios.filter(u => {
            const matchSearch = u.nome.toLowerCase().includes(filtros.searchTerm.toLowerCase()) || u.email.toLowerCase().includes(filtros.searchTerm.toLowerCase());
            const matchCargo = filtros.cargoId === 'todos' || u.cargoId === parseInt(filtros.cargoId);
            const matchStatus = filtros.status === 'todos' || u.status === filtros.status;

            return matchSearch && matchCargo && matchStatus;
        });
    }, [usuarios, filtros]);

    // Função para pegar o nome do cargo a partir do ID
    const getCargoNome = (cargoId: number) => mockCargos.find(c => c.id === cargoId)?.nome || 'Não definido';

    return (
        <>
            <div className="mx-auto">
                <header className="flex items-center justify-between mb-6 pb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Usuários do Sistema</h1>
                        <p className="text-md text-gray-500 mt-1">Adicione, edite e gerencie os usuários que podem acessar o sistema.</p>
                    </div>
                    <Link to="cadastrar" className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700">
                        <UserPlus className="h-5 w-5" />
                        Novo Usuário
                    </Link>
                </header>

                {/* Filtros */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Buscar por nome ou email..."
                        value={filtros.searchTerm}
                        onChange={(e) => setFiltros(prev => ({ ...prev, searchTerm: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md p-2"
                    />
                    <select
                        value={filtros.cargoId}
                        onChange={(e) => setFiltros(prev => ({ ...prev, cargoId: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md p-2"
                    >
                        <option value="todos">Todos os Cargos</option>
                        {mockCargos.map(cargo => (
                            <option key={cargo.id} value={cargo.id}>{cargo.nome}</option>
                        ))}
                    </select>
                    <select
                        value={filtros.status}
                        onChange={(e) => setFiltros(prev => ({ ...prev, status: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md p-2"
                    >
                        <option value="todos">Todos os Status</option>
                        <option value="Ativo">Ativo</option>
                        <option value="Inativo">Inativo</option>
                    </select>
                </div>

                {/* ÁREA DE VISUALIZAÇÃO ALTERADA PARA GRID DE CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredUsuarios.map(usuario => (
                        <UserCard
                            key={usuario.id}
                            usuario={usuario}
                            getCargoNome={getCargoNome}
                            onDelete={() => handleDelete(usuario.id)}
                        />
                    ))}
                </div>
            </div>
        </>
    );
};

export default GerenciamentoUsuarios;