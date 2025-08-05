import React, { useState, useEffect } from 'react';
import { Heart, Users, Save, XCircle, BookKey, History, Gavel, Scale, Files } from 'lucide-react';
import { toast } from 'react-toastify';
import { type IEndereco, type IPessoaFisica, type ICasamentoFormData, type IConjugeData, type IPessoaJuridica, type TPessoaTipo } from '../../types';
import HistoricoModal from '../../Components/HistoricoModal';
import PactoAntenupcialModal from '../../Components/PactoAntenupcial';
import ControleAtoTab from './tabs/ControleAtoTab';
import CelebracaoRegimeTab from './tabs/CelebracaoRegimeTab';
import ConjugesTab from './tabs/ConjugesTab';
import FiliacaoTab from './tabs/FiliacaoTab';
import PartesAdicionaisTab from './tabs/PartesAdicionaisTab';
import DocumentosAnexosTab from './tabs/DocumentosAnexosTab';
import { livrosDisponiveis } from '../../lib/Constants';
import { mockPessoDatabase } from '../../lib/Constants';

// --- ESTADOS INICIAIS E LÓGICA (sem alteração) ---
const todayString = new Date().toISOString().split('T')[0];
const initialEnderecoState: IEndereco = { cep: '', tipoLogradouro: '', logradouro: '', numero: '', complemento: '', bairro: '', cidade: '', uf: '' };
const initialPersonState: IPessoaFisica = { tipo: 'fisica', nome: '', cpf: '', dataNascimento: '', docIdentidadeTipo: '', docIdentidadeNum: '', estadoCivil: 'Solteiro(a)', regimeBens: '', profissao: '', nacionalidade: 'Brasileira', naturalidadeCidade: '', naturalidadeUF: '', endereco: { ...initialEnderecoState }, nomePai: '', nomeMae: '', };
const initialConjugeState: IConjugeData = { ...initialPersonState, nomeAposCasamento: '' };
const initialParentState: IPessoaFisica = { ...initialPersonState, estadoCivil: '', regimeBens: '', cpf: '' };
const initialTestemunhaState: IPessoaFisica = { ...initialPersonState, estadoCivil: '', regimeBens: '', dataNascimento: '' };

const initialState: ICasamentoFormData = {
    controleRegistro: { isLivroAntigo: false, dataRegistro: todayString, protocolo: '', dataLavratura: '', livro: '', folha: '', numeroTermo: '' },
    conjuge1: { ...initialConjugeState },
    conjuge2: { ...initialConjugeState },
    filiacao: {
        paiConjuge1: { ...initialParentState },
        maeConjuge1: { ...initialParentState },
        paiConjuge2: { ...initialParentState },
        maeConjuge2: { ...initialParentState },
    },
    celebracao: {
        tipoCelebracao: 'Civil',
        dataPublicacaoProclamas: '',
        dataCelebracao: '',
        local: 'Cartório',
        juizDePaz: '',
        cultoReligioso: '',
        celebranteReligioso: '',
        qualidadeCelebrante: ''
    }, testemunhas: [{ ...initialTestemunhaState }, { ...initialTestemunhaState }],
    regimeBens: { tipo: 'Comunhão Parcial de Bens', pactoAntenupcial: null },
    casosEspeciais: {
        isConversaoUniaoEstavel: false, isPorProcuracao: false, conjuge1TemProcurador: false, conjuge2TemProcurador: false,
        procuradorConjuge1: { ...initialPersonState },
        procuradorConjuge2: { ...initialPersonState },
        conjuge1TeveCasamentoAnterior: false, conjuge2TeveCasamentoAnterior: false, temFilhosEmComum: false, filhosEmComum: [],
        temNubenteEstrangeiro: false, afastamentoCausaSuspensiva: false, dispensaProclamas: false, isMolestiaGrave: false,
        molestiaGraveComHabilitacao: false, isNuncupativo: false, suprirOmissaoTermoReligioso: false,
        nubenteNaoAssina: false, nomeRogatario: '', nubenteSurdoMudo: false, nomeInterpreteLibras: '',
        nubenteNaoFalaPortugues: false, nomeTradutorPublico: '', declaracaoDePobreza: false,
    }, documentosApresentados: [
        { descricao: 'Certidão de Nascimento do Cônjuge 1', arquivo: null },
        { descricao: 'Certidão de Nascimento do Cônjuge 2', arquivo: null }
    ],
    anexos: {},
    historico: [
        { data: '2025-07-04T15:01:10Z', evento: 'Emitida 2ª via da Certidão de Casamento.', usuario: 'escrevente.2' },
        { data: '2025-01-10T11:45:00Z', evento: 'Ato de casamento lavrado e registrado no Livro B-101, Folha 15, Termo 5890.', usuario: 'oficial.master' },
    ]
};


const tabs = [
    { id: 'controle', label: 'Controle do Ato', icon: BookKey },
    { id: 'celebracao', label: 'Celebração & Regime', icon: Scale },
    { id: 'conjuges', label: 'Cônjuges', icon: Heart },
    { id: 'filiacao', label: 'Filiação', icon: Users },
    { id: 'partes', label: 'Partes Adicionais', icon: Gavel },
    { id: 'documentos', label: 'Documentos/Anexos', icon: Files },
];

const setNestedValue = (obj: any, path: (string | number)[], value: any): any => {
    // ...
    const key = path[0];
    if (path.length === 1) { return { ...obj, [key]: value }; }
    const nextObj = (obj && typeof obj[key] === 'object' && obj[key] !== null) ? obj[key] : (typeof path[1] === 'number' ? [] : {});
    return { ...obj, [key]: setNestedValue(nextObj, path.slice(1), value) };
};


export default function RegistroCasamentoForm() {
    // ... (Handlers e lógica de estado permanecem os mesmos)
    const [formData, setFormData] = useState<ICasamentoFormData>(initialState);
    const [activeTab, setActiveTab] = useState(tabs[0].id);
    const [isPactoModalOpen, setIsPactoModalOpen] = useState(false);
    const [searchingCpf, setSearchingCpf] = useState<string | null>(null);
    const [searchingCnpj, setSearchingCnpj] = useState<string | null>(null);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

    const handleFileChange = (path: (string | number)[], file: File | null) => {
        setFormData(prev => {
            const newState = { ...prev };
            let currentLevel: any = newState;
            for (let i = 0; i < path.length - 1; i++) {
                const key = path[i];
                if (Array.isArray(currentLevel[key])) {
                    currentLevel[key] = [...currentLevel[key]];
                } else {
                    currentLevel[key] = { ...currentLevel[key] };
                }
                currentLevel = currentLevel[key];
            }
            const finalPathKey = path[path.length - 1];
            const index = path[path.length - 2];

            if (typeof index === 'number') {
                const item = { ...currentLevel[index] };
                item[finalPathKey as keyof typeof item] = file;
                item['nomeArquivo'] = file?.name;
                currentLevel[index] = item;
            }
            return newState;
        });
        if (file) {
            toast.info(`Arquivo "${file.name}" selecionado.`);
        }
    };
    
    useEffect(() => {
        const getAge = (dateString: string) => {
            if (!dateString) return 0;
            const today = new Date();
            const birthDate = new Date(dateString);
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age;
        };
        const ageConjuge1 = getAge(formData.conjuge1.dataNascimento);
        const ageConjuge2 = getAge(formData.conjuge2.dataNascimento);
        if (ageConjuge1 < 16 || ageConjuge2 < 16) {
            toast.error("É proibido o casamento de menores de 16 anos!");
        }
    }, [formData.conjuge1.dataNascimento, formData.conjuge2.dataNascimento]);

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            conjuge1: { ...prev.conjuge1, nomeAposCasamento: prev.conjuge1.nomeAposCasamento || prev.conjuge1.nome },
            conjuge2: { ...prev.conjuge2, nomeAposCasamento: prev.conjuge2.nomeAposCasamento || prev.conjuge2.nome }
        }));
    }, [formData.conjuge1.nome, formData.conjuge2.nome]);

    useEffect(() => {
        const regime = formData.regimeBens.tipo;
        const needsPacto = regime === 'Comunhão Universal de Bens' || regime === 'Separação Total de Bens' || regime === 'Participação Final nos Aquestos';
        if (needsPacto && !formData.regimeBens.pactoAntenupcial) {
            setFormData(prev => ({ ...prev, regimeBens: { ...prev.regimeBens, pactoAntenupcial: { data: '', serventia: '', livro: '', folha: '' } } }));
        } else if (!needsPacto && formData.regimeBens.pactoAntenupcial) {
            setFormData(prev => ({ ...prev, regimeBens: { ...prev.regimeBens, pactoAntenupcial: null } }));
        }
    }, [formData.regimeBens.tipo]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        const finalValue = type === 'checkbox' ? checked : value;
        const keys = name.split('.');
        setFormData(prev => setNestedValue(prev, keys, finalValue));
    };

    const handleAddressUpdate = (path: (string | number)[], addressData: Partial<IEndereco>) => {
        setFormData(prev => {
            const newState = { ...prev };
            let currentPersonLevel: any = newState;
            for (let i = 0; i < path.length; i++) {
                currentPersonLevel = currentPersonLevel[path[i]];
            }
            currentPersonLevel.endereco = {
                ...currentPersonLevel.endereco,
                ...addressData
            };
            return newState;
        });
    };

    const handleCpfSearch = (pathPrefix: (string | number)[], cpf: string) => {
        const cleanCpf = cpf.replace(/\D/g, '');
        if (cleanCpf.length !== 11) {
            toast.warn("CPF inválido. Por favor, preencha os 11 dígitos.");
            return;
        }
        const currentPathKey = pathPrefix.join('.');
        setSearchingCpf(currentPathKey);
        setTimeout(() => {
            const personFromDb = mockPessoDatabase[cleanCpf];
            if (personFromDb) {
                setFormData(prev => {
                    const newState = { ...prev };
                    let currentLevel: any = newState;
                    for (let i = 0; i < pathPrefix.length; i++) {
                        currentLevel = currentLevel[pathPrefix[i]];
                    }
                    const oldAddress = currentLevel.endereco;
                    Object.assign(currentLevel, { ...personFromDb, endereco: oldAddress });
                    return newState;
                });
                toast.success(`Dados de ${personFromDb.nome} preenchidos!`);
            } else {
                toast.error("CPF não encontrado na base de dados.");
            }
            setSearchingCpf(null);
        }, 1500);
    };

    const handleCnpjSearch = async (pathPrefix: (string | number)[], cnpj: string) => {
        const cleanCnpj = cnpj.replace(/\D/g, '');
        if (cleanCnpj.length !== 14) {
            toast.warn("CNPJ inválido. Por favor, preencha os 14 dígitos.");
            return;
        }
        const currentPathKey = pathPrefix.join('.');
        setSearchingCnpj(currentPathKey);
        try {
            const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`);
            if (!response.ok) {
                const errorData = await response.json();
                toast.error(`Erro ao buscar CNPJ: ${errorData.message || 'Não encontrado.'}`);
                return;
            }
            const data = await response.json();
            const novosDadosPJ: Partial<IPessoaJuridica> = {
                tipo: 'juridica', razaoSocial: data.razao_social, nomeFantasia: data.nome_fantasia, cnpj: data.cnpj,
                endereco: { cep: data.cep || '', uf: data.uf || '', cidade: data.municipio || '', bairro: data.bairro || '', logradouro: data.logradouro || '', numero: data.numero || '', complemento: data.complemento || '', tipoLogradouro: '' },
                qsa: data.qsa?.map((socio: any) => ({ nome: socio.nome_socio, qualificacao: socio.qualificacao_socio, })) || [],
            };
            setFormData(prev => setNestedValue(prev, pathPrefix as string[], novosDadosPJ));
            toast.success(`Dados de "${data.razao_social}" preenchidos!`);
        } catch (error) {
            console.error("Falha na requisição do CNPJ:", error);
            toast.error("Não foi possível conectar à API de busca de CNPJ.");
        } finally {
            setSearchingCnpj(null);
        }
    };

    const handleDadosChange = (path: (string | number)[], novosDados: Partial<TPessoaTipo>) => {
        setFormData(prev => {
            const newState = { ...prev };
            let currentLevel: any = newState;
            for (let i = 0; i < path.length - 1; i++) {
                currentLevel = currentLevel[path[i]];
            }
            currentLevel[path[path.length - 1]] = novosDados;
            return newState;
        });
    };

    const handleAddTestemunha = () => {
        setFormData(prev => ({ ...prev, testemunhas: [...prev.testemunhas, { ...initialPersonState }] }));
        toast.info("Um novo campo para testemunha foi adicionado.");
    };

    const handleRemoveTestemunha = (indexToRemove: number) => {
        setFormData(prev => ({ ...prev, testemunhas: prev.testemunhas.filter((_, index) => index !== indexToRemove) }));
        toast.success(`Testemunha ${indexToRemove + 1} removida.`);
    };

    const handleAddSocio = (path: (string | number)[]) => {
        setFormData(prev => {
            const [keyCasosEspeciais, keyProcurador] = path as [string, keyof ICasamentoFormData['casosEspeciais']];
            const procuradorAtual = prev.casosEspeciais[keyProcurador] as IPessoaJuridica;
            const novoSocio = { nome: '', qualificacao: '' };
            const qsaAtualizado = [...(procuradorAtual.qsa || []), novoSocio];
            return {
                ...prev,
                casosEspeciais: { ...prev.casosEspeciais, [keyProcurador]: { ...procuradorAtual, qsa: qsaAtualizado, } }
            };
        });
        toast.info("Campo para sócio adicionado.");
    };

    const handleRemoveSocio = (path: (string | number)[], indexToRemove: number) => {
        setFormData(prev => {
            const [keyCasosEspeciais, keyProcurador] = path as [string, keyof ICasamentoFormData['casosEspeciais']];
            const procuradorAtual = prev.casosEspeciais[keyProcurador] as IPessoaJuridica;
            const qsaAtual = procuradorAtual.qsa || [];
            const qsaAtualizado = qsaAtual.filter((_, index) => index !== indexToRemove);
            return {
                ...prev,
                casosEspeciais: { ...prev.casosEspeciais, [keyProcurador]: { ...procuradorAtual, qsa: qsaAtualizado, } }
            };
        });
        toast.warn("Sócio removido.");
    };

    const handleAddFilho = () => {
        setFormData(prev => {
            const filhosAtuais = prev.casosEspeciais.filhosEmComum || [];
            const novoFilho = { nome: '', dataNascimento: '' };
            return { ...prev, casosEspeciais: { ...prev.casosEspeciais, filhosEmComum: [...filhosAtuais, novoFilho] } };
        });
        toast.info("Campo para filho(a) adicionado.");
    };

    const handleRemoveFilho = (indexToRemove: number) => {
        setFormData(prev => {
            const filhosAtuais = prev.casosEspeciais.filhosEmComum || [];
            return { ...prev, casosEspeciais: { ...prev.casosEspeciais, filhosEmComum: filhosAtuais.filter((_, index) => index !== indexToRemove) } };
        });
        toast.warn("Filho(a) removido(a).");
    };

    const handleAddDocumento = () => {
        setFormData(prev => ({
            ...prev,
            documentosApresentados: [...prev.documentosApresentados, { descricao: '', arquivo: null, nomeArquivo: '' }]
        }));
        toast.info("Campo para documento adicionado.");
    };

    const handleRemoveDocumento = (indexToRemove: number) => {
        setFormData(prev => ({
            ...prev,
            documentosApresentados: prev.documentosApresentados.filter((_, index) => index !== indexToRemove)
        }));
        toast.warn("Documento removido.");
    };

    const handleCancel = () => {
        if (window.confirm("Você tem certeza que deseja cancelar? Todos os dados preenchidos serão perdidos.")) {
            setFormData(initialState);
            toast.info("Operação cancelada. O formulário foi resetado.");
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log("Formulário de Casamento Salvo:", formData);
        toast.success('Rascunho do casamento salvo com sucesso!');
    };

    const handleLavrarAto = () => {
        // ... (lógica de validação permanece a mesma)
        if (!formData.conjuge1.nome || !formData.conjuge2.nome) {
            toast.warn("O nome de ambos os cônjuges é obrigatório.");
            setActiveTab('conjuges');
            return;
        }
        if (!formData.celebracao.dataCelebracao) {
            toast.warn("A data da celebração do casamento é obrigatória.");
            setActiveTab('celebracao');
            return;
        }
        if (formData.testemunhas.length < 2) {
            toast.warn("É obrigatório o registro de no mínimo 2 testemunhas.");
            setActiveTab('partes');
            return;
        }
        const regime = formData.regimeBens.tipo;
        const needsPacto = regime === 'Comunhão Universal de Bens' || regime === 'Separação Total de Bens' || regime === 'Participação Final nos Aquestos';
        if (needsPacto && (!formData.regimeBens.pactoAntenupcial || !formData.regimeBens.pactoAntenupcial.data)) {
            toast.warn(`Para o regime de "${regime}", os dados do Pacto Antenupcial são obrigatórios.`);
            setActiveTab('celebracao');
            return;
        }

        if (window.confirm("Atenção: Lavrar o ato de casamento é uma ação definitiva que gerará um registro oficial. Deseja continuar?")) {
            toast.promise(
                new Promise(resolve => setTimeout(() => {
                    const hoje = new Date();
                    const novoEventoHistorico = {
                        data: hoje.toISOString(),
                        evento: `Ato de casamento lavrado e registrado no Livro B-AUX, Folha 1, Termo 1.`,
                        usuario: 'oficial.master'
                    };
                    setFormData(prev => ({
                        ...prev,
                        controleRegistro: { ...prev.controleRegistro, dataLavratura: hoje.toISOString().split('T')[0], livro: 'B-AUX', folha: '1', numeroTermo: '1' },
                        historico: [novoEventoHistorico, ...prev.historico]
                    }));
                    resolve(true);
                }, 2000)),
                {
                    pending: 'Processando e lavrando o ato de casamento...',
                    success: 'Ato de casamento lavrado com sucesso! Registro gerado.',
                    error: 'Ocorreu um erro ao lavrar o ato.'
                }
            );
            console.log("Lavrando o ato de casamento com os seguintes dados:", formData);
        }
    };

    const SectionTitle = ({ children }: { children: React.ReactNode }) => <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">{children}</h3>;
    const SubSectionTitle = ({ children }: { children: React.ReactNode }) => <h4 className="font-bold text-gray-600 mb-3 mt-4">{children}</h4>;


    return (
        <>
            <title>Registrar Casamento | Orius Tecnologia</title>
            <div className="flex bg-gray-50 min-h-screen font-sans">
                <main className="flex-1 p-0">
                    <div className="mx-auto">
                        <header className="mb-6 flex justify-between items-center">
                            <div>
                                {/* ALTERADO: Cor do título principal */}
                                <h1 className="text-3xl font-bold text-[#4a4e51]">Registrar Novo Ato de Casamento</h1>
                                <p className="text-md text-gray-500 mt-1">Preencha os dados abaixo para lavrar o ato.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsHistoryModalOpen(true)}
                                // ALTERADO: Cor do anel de foco do botão
                                className="flex items-center gap-2 bg-white text-gray-600 font-semibold px-4 py-2 rounded-lg border border-gray-300 shadow-sm hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dd6825]"
                            >
                                <History className="h-5 w-5" />
                                Ver Histórico
                            </button>
                        </header>

                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
                                {tabs.map(tab => (
                                    // ALTERADO: Cor da aba ativa
                                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`${activeTab === tab.id ? 'border-[#dd6825] text-[#dd6825]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}>
                                        <tab.icon className="h-5 w-5" /> {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-6">
                            <div className="tab-content bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[500px] transition-opacity duration-300">
                                {activeTab === 'controle' && (
                                    <ControleAtoTab formData={formData} handleInputChange={handleInputChange} handleLavrarAto={handleLavrarAto} livrosDisponiveis={livrosDisponiveis} SectionTitle={SectionTitle} />
                                )}
                                {activeTab === 'celebracao' && (
                                    <CelebracaoRegimeTab formData={formData} handleInputChange={handleInputChange} onPactoModalOpen={() => setIsPactoModalOpen(true)} SectionTitle={SectionTitle} SubSectionTitle={SubSectionTitle} />
                                )}
                                {activeTab === 'conjuges' && (
                                    <ConjugesTab formData={formData} handleInputChange={handleInputChange} handleAddressUpdate={handleAddressUpdate} handleCpfSearch={handleCpfSearch} searchingCpf={searchingCpf} SectionTitle={SectionTitle} SubSectionTitle={SubSectionTitle} />
                                )}
                                {activeTab === 'filiacao' && (
                                    <FiliacaoTab formData={formData} handleInputChange={handleInputChange} handleAddressUpdate={handleAddressUpdate} handleCpfSearch={handleCpfSearch} searchingCpf={searchingCpf} SectionTitle={SectionTitle} />
                                )}
                                {activeTab === 'partes' && (
                                    <PartesAdicionaisTab
                                        formData={formData}
                                        handleInputChange={handleInputChange}
                                        handleAddressUpdate={handleAddressUpdate}
                                        handleCpfSearch={handleCpfSearch}
                                        searchingCpf={searchingCpf}
                                        handleAddTestemunha={handleAddTestemunha}
                                        handleRemoveTestemunha={handleRemoveTestemunha}
                                        handleCnpjSearch={handleCnpjSearch}
                                        searchingCnpj={searchingCnpj}
                                        onDadosChange={handleDadosChange}
                                        onAddSocio={handleAddSocio}
                                        onRemoveSocio={handleRemoveSocio}
                                        handleAddFilho={handleAddFilho}
                                        handleRemoveFilho={handleRemoveFilho}
                                        SectionTitle={SectionTitle} SubSectionTitle={SubSectionTitle}
                                    />
                                )}
                                {activeTab === 'documentos' && (
                                    <DocumentosAnexosTab
                                        documentos={formData.documentosApresentados}
                                        handleInputChange={handleInputChange}
                                        handleFileChange={handleFileChange}
                                        handleAddDocumento={handleAddDocumento}
                                        handleRemoveDocumento={handleRemoveDocumento}
                                        SectionTitle={SectionTitle} SubSectionTitle={SubSectionTitle}
                                    />
                                )}
                            </div>

                            <div className="flex justify-end pt-6 mt-8 gap-4">
                                <button type="button" onClick={handleCancel} className="flex items-center gap-2 bg-red-600 text-white font-semibold px-6 py-3 rounded-lg shadow-sm hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"><XCircle className="h-5 w-5" />Cancelar</button>
                                <button type="submit" className="flex items-center gap-2 bg-green-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"><Save className="h-5 w-5" />Salvar Rascunho</button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>

            <HistoricoModal
                isOpen={isHistoryModalOpen}
                onClose={() => setIsHistoryModalOpen(false)}
                historico={formData.historico}
            />

            <PactoAntenupcialModal
                isOpen={isPactoModalOpen}
                onClose={() => setIsPactoModalOpen(false)}
                // Você pode passar dados do pacto para o modal se necessário
                // pactoData={formData.regimeBens.pactoAntenupcial}
                // onSave={(pactoData) => handleInputChange({ target: { name: 'regimeBens.pactoAntenupcial', value: pactoData } } as any)}
            />
        </>
    );
}