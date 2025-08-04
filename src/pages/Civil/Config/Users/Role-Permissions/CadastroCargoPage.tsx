// Salve como src/pages/CadastroCargoPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Save, Loader2, ArrowLeft } from 'lucide-react';
import { mockPermissoes, mockCargos } from '../../../lib/Constants';
import { type ICargo, type IPermissao } from '../../../types';

const initialCargoState: ICargo = {
    id: 0,
    nome: '',
    descricao: '',
    permissoes: [],
};

const CadastroCargoPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [cargo, setCargo] = useState<ICargo>(initialCargoState);
    const [isLoading, setIsLoading] = useState(!!id);
    const [isSaving, setIsSaving] = useState(false);

    // Agrupa as permissões por módulo para exibição na tela
    const permissoesAgrupadas = useMemo(() => {
        return mockPermissoes.reduce((acc, permissao) => {
            (acc[permissao.modulo] = acc[permissao.modulo] || []).push(permissao);
            return acc;
        }, {} as Record<string, IPermissao[]>);
    }, []);

    useEffect(() => {
        if (id) {
            const cargoExistente = mockCargos.find(c => c.id === parseInt(id, 10));
            if (cargoExistente) {
                setCargo(cargoExistente);
            }
            setIsLoading(false);
        }
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCargo(prev => ({ ...prev, [name]: value }));
    };
    
    const handlePermissionChange = (permissaoChave: string, isChecked: boolean) => {
        setCargo(prev => {
            const permissoesAtuais = prev.permissoes;
            if (isChecked) {
                return { ...prev, permissoes: [...permissoesAtuais, permissaoChave] };
            } else {
                return { ...prev, permissoes: permissoesAtuais.filter(p => p !== permissaoChave) };
            }
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!cargo.nome) {
            toast.error("O nome do cargo é obrigatório.");
            return;
        }
        setIsSaving(true);
        console.log("Salvando cargo:", cargo);
        toast.success("Cargo salvo com sucesso!");
        setTimeout(() => {
            setIsSaving(false);
            navigate(-1); // Rota da página de listagem
        }, 1000);
    };

    const pageTitle = id ? "Editar Cargo" : "Criar Novo Cargo";
    
    if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="mx-auto p-6">
            <header className="mb-6 pb-4">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-4">
                    <ArrowLeft size={16} />
                    Voltar para a Lista de Cargos
                </button>
                <h1 className="text-3xl font-bold text-gray-800">{pageTitle}</h1>
                {id && <p className="text-gray-500 mt-1">Modificando o cargo: {cargo.nome}</p>}
            </header>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Seção de Identificação do Cargo */}
                <div className="p-6 bg-white rounded-lg border border-gray-300">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Identificação</h2>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome do Cargo*</label>
                            <input type="text" id="nome" name="nome" value={cargo.nome} onChange={handleInputChange} className="mt-1 w-full border border-gray-300 rounded-md p-2"/>
                        </div>
                        <div>
                            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">Descrição</label>
                            <textarea id="descricao" name="descricao" value={cargo.descricao} onChange={handleInputChange} rows={3} className="mt-1 w-full border border-gray-300 rounded-md p-2"/>
                        </div>
                    </div>
                </div>

                {/* Seção da Matriz de Permissões */}
                <div className="p-6 bg-white rounded-lg border border-gray-300">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Permissões do Cargo</h2>
                    <div className="space-y-6">
                        {Object.entries(permissoesAgrupadas).map(([modulo, permissoes]) => (
                            <div key={modulo}>
                                <h3 className="font-semibold text-gray-600 mb-3">{modulo}</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {permissoes.map(permissao => (
                                        <label key={permissao.chave} className="flex items-center space-x-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={cargo.permissoes.includes(permissao.chave)}
                                                onChange={(e) => handlePermissionChange(permissao.chave, e.target.checked)}
                                                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                            />
                                            <span className="text-sm text-gray-700">{permissao.nome}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <footer className="pt-6 flex justify-end gap-4">
                    <button type="button" onClick={() => navigate('/admin/cargos')} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold">
                        Cancelar
                    </button>
                    <button type="submit" disabled={isSaving} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold flex items-center gap-2">
                        {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        Salvar
                    </button>
                </footer>
            </form>
        </div>
    );
};

export default CadastroCargoPage;