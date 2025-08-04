import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Save, Loader2, ArrowLeft, Clock, KeyRound } from 'lucide-react';
import { type IUsuario, type ILogAtividade } from '../../types';
import { mockUsuarios, mockCargos, mockLogsDatabase } from '../../lib/Constants';
import PasswordInput from '../../../Components/PasswordInput';

const initialState: IUsuario = {
    id: 0,
    nome: '',
    email: '',
    cargoId: 0,
    status: 'Ativo',
    senha: ''
};

const CadastroUsuarioPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState<IUsuario>(initialState);
    const [activeTab, setActiveTab] = useState<'dados' | 'logs'>('dados');
    const [logs, setLogs] = useState<ILogAtividade[]>([]);
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [isLoading, setIsLoading] = useState(!!id);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoadingLogs, setIsLoadingLogs] = useState(false);

    // Efeito para carregar dados do usuário (modo edição)
    useEffect(() => {
        if (id) {
            const usuarioExistente = mockUsuarios.find(u => u.id === parseInt(id));
            if (usuarioExistente) {
                const { senha, ...dadosSemSenha } = usuarioExistente;
                setUsuario(dadosSemSenha as IUsuario);
            }
            setIsLoading(false);
        }
    }, [id]);

    // Efeito para carregar logs quando a aba é selecionada
    useEffect(() => {
        if (id && activeTab === 'logs') {
            setIsLoadingLogs(true);
            setTimeout(() => {
                const userLogs = mockLogsDatabase.filter(log => log.userId === parseInt(id));
                setLogs(userLogs);
                setIsLoadingLogs(false);
            }, 1000);
        }
    }, [id, activeTab]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const finalValue = name === 'cargoId' ? parseInt(value) : value;
        setUsuario(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // 2. VALIDAÇÃO DA SENHA
        if (usuario.senha || !id) { // Valida se a senha foi digitada ou se é um novo cadastro
            if (usuario.senha !== confirmarSenha) {
                toast.error("As senhas não coincidem.");
                return;
            }
            if (!id && !usuario.senha) { // Senha é obrigatória no cadastro
                 toast.error("O campo de senha é obrigatório para novos usuários.");
                return;
            }
        }
        
        setIsSaving(true);
        toast.info("Salvando dados do usuário...");
        console.log("Dados a serem salvos (senha não deve ser logada em produção):", usuario);

        setTimeout(() => {
            setIsSaving(false);
            toast.success("Usuário salvo com sucesso!");
            navigate(-1);
        }, 1500);
    };

    const pageTitle = id ? 'Editar Usuário' : 'Convidar Novo Usuário';

    if (isLoading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin" size={32} /></div>;

    return (
        <div className="mx-auto">
            <header className="pb-4">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-4">
                    <ArrowLeft size={16} /> Voltar para a Lista
                </button>
                <h1 className="text-3xl font-bold text-gray-800">{pageTitle}</h1>
                {id && <p className="text-gray-500 mt-1">Modificando o cadastro de: {usuario.nome}</p>}
            </header>

            {id && (
                <nav className="flex mb-6 border-b border-gray-200">
                    <button onClick={() => setActiveTab('dados')} className={`px-4 py-3 font-semibold text-center border-b-2 ${activeTab === 'dados' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:border-gray-300'}`}>
                        Dados Cadastrais
                    </button>
                    <button onClick={() => setActiveTab('logs')} className={`px-4 py-3 font-semibold text-center border-b-2 ${activeTab === 'logs' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:border-gray-300'}`}>
                        Logs de Atividade
                    </button>
                </nav>
            )}

            {/* Renderização condicional do conteúdo da aba */}
            {activeTab === 'dados' ? (
                <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border">
                    <div>
                        <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome Completo*</label>
                        <input type="text" id="nome" name="nome" value={usuario.nome} onChange={handleInputChange} className="mt-1 w-full border border-gray-300 rounded-md p-2" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email*</label>
                        <input type="email" id="email" name="email" value={usuario.email} onChange={handleInputChange} className="mt-1 w-full border border-gray-300 rounded-md p-2" />
                    </div>
                    <div>
                        <label htmlFor="cargoId" className="block text-sm font-medium text-gray-700">Cargo*</label>
                        <select id="cargoId" name="cargoId" value={usuario.cargoId} onChange={handleInputChange} className="mt-1 w-full border border-gray-300 rounded-md p-2">
                            <option value={0}>Selecione um cargo...</option>
                            {mockCargos.map(cargo => (
                                <option key={cargo.id} value={cargo.id}>{cargo.nome}</option>
                            ))}
                        </select>
                    </div>

                    {/* 3. CAMPOS DE SENHA ADICIONADOS AO FORMULÁRIO */}
                    <div className="pt-6 border-t">
                         <div className="flex items-center gap-2 mb-4">
                            <KeyRound className="text-gray-400" size={20}/>
                            <h3 className="text-lg font-semibold text-gray-700">Credenciais de Acesso</h3>
                         </div>
                         {id && <p className="text-sm text-gray-500 mb-4">Deixe os campos de senha em branco para não alterá-la.</p>}
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="senha" className="block text-sm font-medium text-gray-700">Senha{!id && '*'}</label>
                                <PasswordInput
                                    id="senha"
                                    name="senha"
                                    value={usuario.senha || ''}
                                    onChange={handleInputChange}
                                    autoComplete="new-password"
                                />
                            </div>
                             <div>
                                <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700">Confirmar Senha{!id && '*'}</label>
                                <PasswordInput
                                     id="confirmarSenha"
                                     name="confirmarSenha"
                                     value={confirmarSenha}
                                     onChange={(e) => setConfirmarSenha(e.target.value)}
                                     autoComplete="new-password"
                                />
                            </div>
                         </div>
                    </div>

                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                        <select id="status" name="status" value={usuario.status} onChange={handleInputChange} className="mt-1 w-full border border-gray-300 rounded-md p-2">
                            <option>Ativo</option>
                            <option>Inativo</option>
                        </select>
                    </div>

                    <footer className="pt-6 flex justify-end gap-4">
                        <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold">Cancelar</button>
                        <button type="submit" disabled={isSaving} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold flex items-center gap-2">
                            {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} Salvar
                        </button>
                    </footer>
                </form>
            ) : (
                <div className="bg-white p-6 rounded-lg border">
                    {isLoadingLogs ? <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div> : (
                        <ul className="space-y-4">
                            {logs.map(log => (
                                <li key={log.id} className="flex items-start gap-4">
                                    <div className="bg-gray-100 p-2 rounded-full mt-1"><Clock size={18} className="text-gray-500" /></div>
                                    <div>
                                        <p className="font-semibold text-gray-800">{log.acao}</p>
                                        <p className="text-sm text-gray-600">{log.detalhes}</p>
                                        <p className="text-xs text-gray-400 mt-1">{new Date(log.dataHora).toLocaleString('pt-BR')}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default CadastroUsuarioPage;