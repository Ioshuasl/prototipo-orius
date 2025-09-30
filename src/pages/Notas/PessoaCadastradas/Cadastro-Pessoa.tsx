import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Save, Loader2, ArrowLeft, Trash2, Pen, UserPlus } from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas'
import SeletorDePessoa from '../../Components/SeletorDePessoa';
import { type TPessoaTipo, type IPessoaFisica, type IPessoaJuridica, type IEndereco, type ISocio } from '../../Types';
import { mockPessoasCadastradas, mockAtosDatabase } from '../lib/Constants';

// Função para atualizar o estado aninhado
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
    endereco: {
        cep: '',
        tipoLogradouro: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        uf: ''
    },
    nomePai: '',
    nomeMae: '',
};

interface IAssinaturaDigital {
    dataRegistro: Date | null;
    assinaturaImagem: string | null;
    assinaturaARogo: {
        nome: string;
        cpf: string;
    } | null;
    testemunhas: {
        nome: string;
        cpf: string;
    }[] | null;
}

const initialFichaFirmaState: IAssinaturaDigital = {
    dataRegistro: null,
    assinaturaImagem: null,
    assinaturaARogo: null,
    testemunhas: [],
};

const CadastroPessoaPageNotas: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dados');
    const [isSaving, setIsSaving] = useState(false);
    const [dadosPessoa, setDadosPessoa] = useState<Partial<TPessoaTipo>>(initialStatePF);
    const [searchingCpf, setSearchingCpf] = useState<string | null>(null);
    const [searchingCnpj, setSearchingCnpj] = useState<string | null>(null);
    const [isLoadingAtos, setIsLoadingAtos] = useState(false);
    const [isLoading, setIsLoading] = useState(!!id);
    const [atos, setAtos] = useState<any[]>([]);
    const sigCanvas = useRef(null);

    const [fichaFirma, setFichaFirma] = useState<IAssinaturaDigital>({
        ...initialFichaFirmaState,
        testemunhas: [],
    });
    const [isAssinaturaARogo, setIsAssinaturaARogo] = useState(false);
    const [showTestemunhas, setShowTestemunhas] = useState(false);

    useEffect(() => {
        if (id) {
            setIsLoading(true);
            const pessoaExistente = mockPessoasCadastradas.find(p => (p.tipo === 'fisica' ? p.cpf : p.cnpj) === id);
            setTimeout(() => {
                if (pessoaExistente) {
                    setDadosPessoa(pessoaExistente);
                } else {
                    toast.error("Pessoa não encontrada.");
                    navigate(-1);
                }
                setIsLoading(false);
            }, 1000);
        }
    }, [id, navigate]);

    useEffect(() => {
        if (id && activeTab === 'atos') {
            setIsLoadingAtos(true);
            setAtos([]);
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
    }, [id, activeTab]);

    const handleFichaFirmaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFichaFirma(prevState => updateNestedState(prevState, name, value));
    };

    const handleAssinaturaCapture = () => {
        // Simulação da captura de assinatura. Em um app real, seria um componente de canvas ou uma API.
        const signatureDataUrl = 'https://placehold.co/300x150/E5E7EB/4B5563?text=Assinatura+Digital';
        setFichaFirma(prevState => ({
            ...prevState,
            assinaturaImagem: signatureDataUrl,
            assinaturaARogo: null,
        }));
        setIsAssinaturaARogo(false);
        toast.success("Assinatura capturada com sucesso!");
    };
    
    const handleAssinaturaClear = () => {
        setFichaFirma(prevState => ({
            ...prevState,
            assinaturaImagem: null,
        }));
        toast.info("Assinatura limpa.");
    };

    const handleAssinaturaARogoToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        setIsAssinaturaARogo(isChecked);
        if (isChecked) {
            setFichaFirma(prevState => ({
                ...prevState,
                assinaturaImagem: null,
            }));
        }
    };
    
    const handleAddTestemunha = () => {
        setFichaFirma(prevState => ({
            ...prevState,
            testemunhas: [...(prevState.testemunhas || []), { nome: '', cpf: '' }],
        }));
    };
    
    const handleRemoveTestemunha = (index: number) => {
        setFichaFirma(prevState => ({
            ...prevState,
            testemunhas: prevState.testemunhas?.filter((_, i) => i !== index) || [],
        }));
    };


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        const finalValue = type === 'checkbox' ? checked : value;
        setDadosPessoa(prevState => updateNestedState(prevState, name, finalValue));
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

    const handleDadosChange = (novosDados: Partial<TPessoaTipo>) => {
        setDadosPessoa(prev => ({ ...prev, ...novosDados }));
    };

    const onAddSocio = () => {
        if (dadosPessoa.tipo === 'juridica') {
            setDadosPessoa(prev => {
                const pj = prev as IPessoaJuridica;
                const newSocios = [...(pj.qsa || []), { nome: '', qualificacao: '' }];
                return { ...prev, qsa: newSocios };
            });
        }
    };

    const onRemoveSocio = (index: number) => {
        if (dadosPessoa.tipo === 'juridica') {
            setDadosPessoa(prev => {
                const pj = prev as IPessoaJuridica;
                const newSocios = pj.qsa?.filter((_, i) => i !== index);
                return { ...prev, qsa: newSocios };
            });
        }
    };

    const renderFichaFirmaTab = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-2">Ficha de Firma Digital</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Assinatura Digital</label>
                    <div className="border border-gray-300 rounded-md flex items-center justify-center bg-gray-50 overflow-hidden h-48">
                        {fichaFirma.assinaturaImagem ? (
                            <SignatureCanvas ref={sigCanvas} />
                        ) : (
                             <div className="w-full h-full flex items-center justify-center text-gray-400">
                                Por favor, clique em 'Capturar Assinatura'.
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2 mt-2">
                         <button
                            type="button"
                            onClick={handleAssinaturaCapture}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-[#dd6825] rounded-md font-semibold hover:bg-gray-200"
                        >
                            <Pen size={20} /> Capturar Assinatura
                        </button>
                        <button
                            type="button"
                            onClick={handleAssinaturaClear}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-md font-semibold hover:bg-gray-200"
                        >
                            <Trash2 size={20} /> Limpar
                        </button>
                    </div>
                </div>
                <div className="col-span-1 space-y-4">
                    <div>
                        <h4 className="text-md font-semibold text-gray-800">Opções Especiais</h4>
                        <div className="mt-2 space-y-2">
                            <label className="flex items-center space-x-2 text-sm text-gray-700">
                                <input
                                    type="checkbox"
                                    checked={isAssinaturaARogo}
                                    onChange={handleAssinaturaARogoToggle}
                                    className="rounded text-[#dd6825] focus:ring-[#dd6825]"
                                />
                                <span>Assinatura a Rogo (Para pessoas que não podem assinar)</span>
                            </label>
                            <label className="flex items-center space-x-2 text-sm text-gray-700">
                                <input
                                    type="checkbox"
                                    checked={showTestemunhas}
                                    onChange={(e) => setShowTestemunhas(e.target.checked)}
                                    className="rounded text-[#dd6825] focus:ring-[#dd6825]"
                                />
                                <span>Incluir Testemunhas (Duas)</span>
                            </label>
                        </div>
                    </div>
                    {isAssinaturaARogo && (
                        <div className="border border-dashed border-gray-300 rounded-md p-4 space-y-2">
                            <h5 className="font-medium text-gray-800">Dados do Assinante a Rogo</h5>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nome</label>
                                <input type="text" name="assinaturaARogo.nome" value={fichaFirma.assinaturaARogo?.nome || ''} onChange={handleFichaFirmaChange} className="mt-1 w-full border-gray-300 rounded-md p-2 shadow-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">CPF</label>
                                <input type="text" name="assinaturaARogo.cpf" value={fichaFirma.assinaturaARogo?.cpf || ''} onChange={handleFichaFirmaChange} className="mt-1 w-full border-gray-300 rounded-md p-2 shadow-sm" />
                            </div>
                        </div>
                    )}
                    {showTestemunhas && (
                        <div className="border border-dashed border-gray-300 rounded-md p-4 space-y-2">
                            <h5 className="font-medium text-gray-800">Testemunhas</h5>
                            {fichaFirma.testemunhas?.map((testemunha, index) => (
                                <div key={index} className="flex items-end gap-4 p-3 border border-gray-200 rounded-md">
                                    <div className="flex-grow">
                                        <label className="block text-sm font-medium text-gray-700">Nome da Testemunha</label>
                                        <input type="text" name={`testemunhas.${index}.nome`} value={testemunha.nome} onChange={handleFichaFirmaChange} className="mt-1 w-full border-gray-300 rounded-md p-2 shadow-sm" />
                                    </div>
                                    <div className="flex-grow">
                                        <label className="block text-sm font-medium text-gray-700">CPF da Testemunha</label>
                                        <input type="text" name={`testemunhas.${index}.cpf`} value={testemunha.cpf} onChange={handleFichaFirmaChange} className="mt-1 w-full border-gray-300 rounded-md p-2 shadow-sm" />
                                    </div>
                                    <button type="button" onClick={() => handleRemoveTestemunha(index)} className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"><Trash2 size={20} /></button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={handleAddTestemunha}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-blue-600 rounded-md font-semibold hover:bg-gray-200"
                            >
                                <UserPlus size={20} /> Adicionar Testemunha
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const renderTabs = () => {
        switch (activeTab) {
            case 'dados':
                return (
                    <SeletorDePessoa
                        dados={dadosPessoa}
                        pathPrefix={["dadosPessoa"]}
                        handleInputChange={handleInputChange}
                        handleAddressUpdate={handleAddressUpdate}
                        handleCpfSearch={handleCpfSearch}
                        handleCnpjSearch={handleCnpjSearch}
                        searchingCpf={searchingCpf}
                        searchingCnpj={searchingCnpj}
                        onDadosChange={handleDadosChange}
                        onAddSocio={onAddSocio}
                        onRemoveSocio={onRemoveSocio}
                    />
                );
            case 'ficha':
                return renderFichaFirmaTab();
            case 'atos':
                return (
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-800">Atos Vinculados</h3>
                        <p className="mt-2 text-gray-600">Nenhum ato encontrado para esta pessoa.</p>
                    </div>
                );
            default:
                return null;
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setTimeout(() => {
            console.log("Salvando pessoa e ficha:", dadosPessoa, fichaFirma);
            toast.success("Pessoa e Ficha de Firma salvas com sucesso!");
            setIsSaving(false);
            if (!id) {
                setDadosPessoa(initialStatePF);
                setFichaFirma(initialFichaFirmaState);
            }
        }, 1500);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-10 w-10 animate-spin text-[#dd6825]" />
                <p className="ml-4 text-lg text-gray-600">Carregando dados...</p>
            </div>
        );
    }

    return (
        <div className="flex bg-gray-50 font-sans">
            <div className="flex-1 p-8">
                <header className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-900 transition-colors">
                            <ArrowLeft size={24} />
                        </button>
                        <h1 className="text-2xl font-bold text-[#4a4e51]">{id ? 'Editar Cadastro' : 'Cadastrar Nova Pessoa'}</h1>
                    </div>
                </header>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
                            <button
                                onClick={() => setActiveTab('dados')}
                                className={`${activeTab === 'dados' ? 'border-[#dd6825] text-[#dd6825]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-sm transition-colors duration-200`}
                            >
                                Dados Pessoais
                            </button>
                            <button
                                onClick={() => setActiveTab('ficha')}
                                className={`${activeTab === 'ficha' ? 'border-[#dd6825] text-[#dd6825]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-sm transition-colors duration-200`}
                            >
                                Ficha de Firma Digital
                            </button>
                            {id && (
                                <button
                                    onClick={() => setActiveTab('atos')}
                                    className={`${activeTab === 'atos' ? 'border-[#dd6825] text-[#dd6825]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-sm transition-colors duration-200`}
                                >
                                    Atos Vinculados
                                </button>
                            )}
                        </nav>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="p-6">
                            {renderTabs()}
                        </div>
                        <footer className="pt-6 px-6 pb-6 flex justify-end gap-4">
                            <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold">Cancelar</button>
                            <button type="submit" disabled={isSaving} className="px-6 py-2 bg-[#dd6825] text-white rounded-lg hover:bg-[#c25a1f] font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dd6825]">
                                {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                Salvar
                            </button>
                        </footer>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CadastroPessoaPageNotas;
