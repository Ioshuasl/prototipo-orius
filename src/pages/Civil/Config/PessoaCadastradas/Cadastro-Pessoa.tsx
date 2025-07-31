import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    Save, Loader2, ArrowLeft, ListX, FileText, BookOpen, CalendarDays,
    Baby, HeartHandshake, Cross, BookMarked
} from 'lucide-react';
import SeletorDePessoa from '../../Components/SeletorDePessoa';
import { type TPessoaTipo, type IPessoaFisica, type IPessoaJuridica, type IEndereco, type ISocio } from '../../types';
import { mockPessoasCadastradas, mockAtosDatabase } from '../../lib/Constants';

const updateNestedState = (prevState: any, path: string, value: any): any => {
    const keys = path.split('.');

    const newState = { ...prevState };

    let currentLevel: any = newState;
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        currentLevel[key] = { ...currentLevel[key] };
        currentLevel = currentLevel[key];
    }

    currentLevel[keys[keys.length - 1]] = value;

    return newState;
};


const initialStatePF: Partial<IPessoaFisica> = {
    tipo: 'fisica',
    nome: '',
    cpf: '',
    dataNascimento: '',
    docIdentidadeTipo: '',
    docIdentidadeNum: '',
    profissao: '',
    nacionalidade: 'Brasileira',
    naturalidadeCidade: '',
    naturalidadeUF: '',
    endereco: { cep: '', tipoLogradouro: '', logradouro: '', numero: '', complemento: '', bairro: '', cidade: '', uf: '' },
    nomePai: '',
    nomeMae: '',
};

const getAtoIcon = (tipoAto: string) => {
    const commonProps = { size: 18, className: "text-gray-500 mr-2 flex-shrink-0" };

    switch (tipoAto.toLowerCase()) {
        case 'nascimento':
            return <Baby {...commonProps} />;
        case 'casamento':
            return <HeartHandshake {...commonProps} />;
        case 'óbito':
        case 'natimorto':
            return <Cross {...commonProps} />;
        case 'livro e':
            return <BookMarked {...commonProps} />;
        default:
            return <FileText {...commonProps} />;
    }
};

const AtoCard = ({ ato }: { ato: any }) => {
    return (
        <Link to={`ato/${ato.protocolo}`} className="block group ">
            <div className="border bg-white rounded-lg p-3 hover:shadow-md transition-shadow duration-200">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center text-sm">

                    {/* Coluna 1: Protocolo */}
                    <div className="flex items-center text-gray-700">
                        <FileText size={16} className="text-gray-400 mr-2 flex-shrink-0" />
                        <span className="font-semibold">{ato.protocolo}</span>
                    </div>

                    {/* Coluna 2: Tipo de Ato */}
                    <div className="flex items-center">
                        {getAtoIcon(ato.tipoAto)}
                        <span>{ato.tipoAto}</span>
                    </div>

                    {/* Coluna 3: Livro e Folha */}
                    <div className="flex items-center text-gray-600">
                        <BookOpen size={16} className="text-gray-400 mr-2 flex-shrink-0" />
                        <span>{`L: ${ato.livro}, Fl: ${ato.folha}`}</span>
                    </div>

                    {/* Coluna 4: Termo */}
                    <div className="flex items-center text-gray-600">
                        <CalendarDays size={16} className="text-gray-400 mr-2 flex-shrink-0" />
                        <span>Termo: {ato.termo}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

const CadastroPessoaPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // ESTADOS GLOBAIS DA PÁGINA
    const [activeTab, setActiveTab] = useState<'dados' | 'atos'>('dados');
    const [dadosPessoa, setDadosPessoa] = useState<Partial<TPessoaTipo>>(initialStatePF);
    const [isLoading, setIsLoading] = useState(!!id);
    const [isSaving, setIsSaving] = useState(false);

    // ESTADOS DO FORMULÁRIO (ABA DE DADOS)
    const [searchingCpf, setSearchingCpf] = useState<string | null>(null);
    const [searchingCnpj, setSearchingCnpj] = useState<string | null>(null);

    // ESTADOS DA ABA DE ATOS
    const [atos, setAtos] = useState<any[]>([]);
    const [isLoadingAtos, setIsLoadingAtos] = useState(false);

    useEffect(() => {
        if (id) {
            setIsLoading(true);
            const pessoaExistente = mockPessoasCadastradas.find(p => (p.tipo === 'fisica' ? p.cpf : p.cnpj) === id);
            setTimeout(() => {
                if (pessoaExistente) {
                    setDadosPessoa(pessoaExistente);
                } else {
                    toast.error("Pessoa não encontrada.");
                    navigate('/pessoas');
                }
                setIsLoading(false);
            }, 1000);
        }
    }, [id, navigate]);

    // Efeito para carregar os atos vinculados QUANDO a aba for selecionada
    useEffect(() => {
        if (id && activeTab === 'atos') {
            setIsLoadingAtos(true);
            setAtos([]); // Limpa os resultados anteriores
            console.log(`Buscando atos para a pessoa com ID: ${id}`);

            setTimeout(() => {
                const pessoa = mockPessoasCadastradas.find(p => (p.tipo === 'fisica' ? p.cpf : p.cnpj) === id);
                if (!pessoa) {
                    setAtos([]);
                    setIsLoadingAtos(false);
                    return;
                }

                const nomePessoa = pessoa.tipo === 'fisica' ? pessoa.nome.split(' ')[0] : pessoa.razaoSocial.split(' ')[0];
                const atosEncontrados = mockAtosDatabase.filter(ato =>
                    ato.nomePrincipal.toLowerCase().includes(nomePessoa.toLowerCase())
                );
                setAtos(atosEncontrados);
                setIsLoadingAtos(false);
            }, 1500);
        }
    }, [id, activeTab]); // Dispara quando o ID ou a aba ativa mudam

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setDadosPessoa(prev => updateNestedState(prev, name, value));
    };

    const handleAddressUpdate = (path: (string | number)[], addressData: Partial<IEndereco>) => {
        const pathString = path.join('.');
        const currentAddress = path.reduce((obj, key) => (obj as any)?.[key], dadosPessoa) || {};
        const updatedAddress = { ...currentAddress, ...addressData };
        setDadosPessoa(prev => updateNestedState(prev, pathString, updatedAddress));
    };

    const handleCpfSearch = async (pathPrefix: (string | number)[], cpf: string) => {
        const pathString = pathPrefix.join('.');
        setSearchingCpf(pathString);
        toast.info(`Buscando dados para o CPF: ${cpf}...`);

        await new Promise(resolve => setTimeout(resolve, 1500));

        const pessoaEncontrada = mockPessoasCadastradas.find(p => p.tipo === 'fisica' && p.cpf === cpf.replace(/\D/g, ''));

        if (pessoaEncontrada) {
            setDadosPessoa(prev => updateNestedState(prev, pathString, pessoaEncontrada));
            toast.success("Dados da pessoa física preenchidos!");
        } else {
            toast.warn("Nenhum cadastro encontrado para este CPF.");
        }
        setSearchingCpf(null);
    };

    const handleCnpjSearch = async (pathPrefix: (string | number)[], cnpj: string) => {
        const pathString = pathPrefix.join('.');
        setSearchingCnpj(pathString);
        toast.info(`Buscando dados para o CNPJ: ${cnpj}...`);

        await new Promise(resolve => setTimeout(resolve, 1500));

        const pessoaEncontrada = mockPessoasCadastradas.find(p => p.tipo === 'juridica' && p.cnpj === cnpj.replace(/\D/g, ''));

        if (pessoaEncontrada) {
            setDadosPessoa(prev => updateNestedState(prev, pathString, pessoaEncontrada));
            toast.success("Dados da pessoa jurídica preenchidos!");
        } else {
            toast.warn("Nenhum cadastro encontrado para este CNPJ.");
        }
        setSearchingCnpj(null);
    };

    const onAddSocio = () => {
        const pjData = dadosPessoa as Partial<IPessoaJuridica>;
        const qsaAtual = pjData.qsa || [];
        const novoQsa: ISocio[] = [...qsaAtual, { nome: '', qualificacao: '' }];
        setDadosPessoa(prev => ({ ...prev, qsa: novoQsa }));
    };

    const onRemoveSocio = (index: number) => {
        const pjData = dadosPessoa as Partial<IPessoaJuridica>;
        const qsaAtual = pjData.qsa || [];
        const novoQsa = qsaAtual.filter((_, i) => i !== index);
        setDadosPessoa(prev => ({ ...prev, qsa: novoQsa }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        toast.info("Salvando dados...");
        console.log("Dados a serem salvos:", dadosPessoa);

        setTimeout(() => {
            setIsSaving(false);
            toast.success("Cadastro salvo com sucesso!");
            navigate(-1);
        }, 2000);
    };

    const pageTitle = id ? `Editar Cadastro de ${dadosPessoa.tipo === 'fisica' ? (dadosPessoa as IPessoaFisica).nome : (dadosPessoa as IPessoaJuridica).razaoSocial || '...'}` : "Cadastrar Nova Pessoa";
    const nomePessoaHeader = id && dadosPessoa.tipo ? (dadosPessoa.tipo === 'fisica' ? (dadosPessoa as IPessoaFisica).nome : (dadosPessoa as IPessoaJuridica).razaoSocial) : '...';

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                <p className="ml-4 text-lg text-gray-600">Carregando dados...</p>
            </div>
        );
    }

    const tabStyle = "px-4 py-3 font-semibold text-center border-b-2 cursor-pointer transition-colors duration-200";
    const activeTabStyle = "border-blue-600 text-blue-600";
    const inactiveTabStyle = "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300";

    // Função para renderizar o conteúdo da aba de Atos
    const renderAtosTab = () => {
        if (isLoadingAtos) {
            return <div className="flex flex-col items-center justify-center py-10"><Loader2 className="h-8 w-8 mb-4 animate-spin text-blue-600" /><h3 className="text-lg font-semibold">Buscando atos...</h3></div>;
        }
        if (atos.length === 0) {
            return <div className="flex flex-col items-center justify-center text-center text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed py-10"><ListX className="h-12 w-12 mb-4 text-gray-400" /><h3 className="text-lg font-semibold">Nenhum ato encontrado</h3></div>;
        }
        return <div className="space-y-4">{atos.map(ato => <AtoCard key={ato.protocolo} ato={ato} />)}</div>;
    };

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg">
            <header className="mb-6 pb-4 border-b">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-4"><ArrowLeft size={16} />Voltar</button>
                <h1 className="text-3xl font-bold text-gray-800">{pageTitle}</h1>
                {id && <p className="text-gray-500 mt-1">Visualizando: {nomePessoaHeader}</p>}
            </header>

            {id && (
                <nav className="flex mb-6 border-b border-gray-200">
                    <div onClick={() => setActiveTab('dados')} className={`${tabStyle} ${activeTab === 'dados' ? activeTabStyle : inactiveTabStyle}`}>Dados da Pessoa</div>
                    <div onClick={() => setActiveTab('atos')} className={`${tabStyle} ${activeTab === 'atos' ? activeTabStyle : inactiveTabStyle}`}>Atos Vinculados</div>
                </nav>
            )}

            {/* Conteúdo condicional baseado na aba ativa */}
            <div className="mt-4">
                {activeTab === 'dados' ? (
                    <form onSubmit={handleSubmit}>
                        <SeletorDePessoa
                            dados={dadosPessoa}
                            pathPrefix={[]}
                            handleInputChange={handleInputChange}
                            handleAddressUpdate={handleAddressUpdate}
                            handleCpfSearch={handleCpfSearch}
                            handleCnpjSearch={handleCnpjSearch}
                            searchingCpf={searchingCpf}
                            searchingCnpj={searchingCnpj}
                            onDadosChange={setDadosPessoa}
                            onAddSocio={onAddSocio}
                            onRemoveSocio={onRemoveSocio}
                        />
                        <footer className="mt-8 pt-6 border-t flex justify-end gap-4">
                            <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold">Cancelar</button>
                            <button type="submit" disabled={isSaving} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                Salvar Alterações
                            </button>
                        </footer>
                    </form>
                ) : (
                    renderAtosTab()
                )}
            </div>
        </div>
    );
};

export default CadastroPessoaPage;