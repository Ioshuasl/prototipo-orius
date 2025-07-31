import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { BookKey, Feather, Users, HelpCircle, UserCheck, Paperclip, Save, XCircle, Award, History, PlusCircle, Trash2, UploadCloud } from 'lucide-react';
import { type INatimortoFormData, type IPessoaFisica, type IEndereco } from '../../types';
import PersonFields from '../../Components/PersonFields';
import HistoricoModal from '../../Components/HistoricoModal';
import { mockPessoDatabase } from '../../lib/Constants';
import InfoModal from '../../Components/InfoModal';


// --- ESTADO INICIAL PARA O FORMULÁRIO DE NATIMORTO ---
const todayString = new Date().toISOString().split('T')[0];
const initialAddressState: IEndereco = { cep: '', tipoLogradouro: '', logradouro: '', numero: '', complemento: '', bairro: '', cidade: '', uf: '' };
const initialPersonState: IPessoaFisica = { tipo: 'fisica', nome: '', cpf: '', dataNascimento: '', docIdentidadeTipo: 'RG', docIdentidadeNum: '', profissao: '', nacionalidade: 'Brasileira', naturalidadeCidade: '', naturalidadeUF: '', endereco: { ...initialAddressState }, sexo: 'Masculino', cor: 'Parda', estadoCivil: 'Solteiro(a)' };
const initialTestemunhaState: IPessoaFisica = { ...initialPersonState, estadoCivil: '', regimeBens: '', dataNascimento: '' };

const initialState: INatimortoFormData = {
    controleRegistro: {
        isLivroAntigo: false,
        dataRegistro: todayString,
        protocolo: '',
        dataLavratura: '',
        livro: 'Livro C-Auxiliar', // Pré-definido conforme a norma
        folha: '',
        numeroTermo: ''
    },
    natimorto: {
        localDoFato: '',
        dataDoFato: todayString,
        horaDoFato: '',
        sexo: '',
        nomeAtribuido: false,
        nomeCompleto: '',
        partoDuplo: false,
        causaMorteFetal: '',
        medicoAtestante: '',
        numeroDO: ''
    },
    filiacao: {
        mae: { ...initialPersonState },
        pai: { ...initialPersonState }
    },
    testemunhas: [
        { ...initialTestemunhaState },
        { ...initialTestemunhaState }
    ],
    documentosApresentados: [
        { descricao: 'Declaração de Óbito (DO)', arquivo: null, nomeArquivo: '' }
    ],
    historico: []
};


// --- DEFINIÇÃO DAS ABAS PARA O FORMULÁRIO DE NATIMORTO ---
const tabs = [
    { id: 'controle', label: 'Controle do Ato', icon: BookKey },
    { id: 'natimorto', label: 'Natimorto e Fato', icon: Feather },
    { id: 'filiacao', label: 'Filiação', icon: Users },
    { id: 'testemunhas', label: 'Testemunhas', icon: UserCheck },
    { id: 'documentos', label: 'Documentos/Anexos', icon: Paperclip },
];

export default function CadastrarAtoNatimortoForm() {
    const [formData, setFormData] = useState<INatimortoFormData>(initialState);
    const [activeTab, setActiveTab] = useState(tabs[0].id);
    const [searchingCpf, setSearchingCpf] = useState<string | null>(null);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const isControlReadOnly = !formData.controleRegistro.isLivroAntigo;
    const [modalContent, setModalContent] = useState<{ title: string; content: React.ReactNode } | null>(null);
    const openInfoModal = (title: string, content: React.ReactNode) => setModalContent({ title, content });
    const closeInfoModal = () => setModalContent(null);

    // --- FUNÇÕES DE MANIPULAÇÃO DE DADOS (Handlers) ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        const finalValue = type === 'checkbox' ? checked : value;
        const keys = name.split('.');

        setFormData(prev => {
            const newState = JSON.parse(JSON.stringify(prev));
            let currentLevel: any = newState;
            for (let i = 0; i < keys.length - 1; i++) {
                currentLevel = currentLevel[keys[i]];
            }
            currentLevel[keys[keys.length - 1]] = finalValue;

            if (name === 'natimorto.nomeAtribuido' && !finalValue) {
                newState.natimorto.nomeCompleto = '';
            }

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
                    const newState = JSON.parse(JSON.stringify(prev));
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

    const handleAddressUpdate = (path: (string | number)[], addressData: Partial<IEndereco>) => {
        setFormData(prev => {
            const newState = JSON.parse(JSON.stringify(prev));
            let currentLevel: any = newState;
            for (let i = 0; i < path.length; i++) {
                currentLevel = currentLevel[path[i]];
            }
            Object.assign(currentLevel, addressData);
            return newState;
        });
    };

    const handleFileChange = (path: (string | number)[], file: File | null) => {
        const index = path[1] as number;
        setFormData(prev => {
            const newDocs = [...prev.documentosApresentados];
            newDocs[index] = {
                ...newDocs[index],
                arquivo: file,
                nomeArquivo: file?.name || '',
            };
            return { ...prev, documentosApresentados: newDocs };
        });
        if (file) toast.info(`Arquivo "${file.name}" selecionado.`);
    };

    const handleAddTestemunha = () => {
        setFormData(prev => ({
            ...prev,
            testemunhas: [...prev.testemunhas, initialTestemunhaState]
        }));
        toast.info("Campo para testemunha adicional foi adicionado.");
    };

    const handleRemoveTestemunha = (indexToRemove: number) => {
        if (formData.testemunhas.length <= 2) {
            toast.warn("O registro de natimorto exige no mínimo 2 testemunhas.");
            return;
        }
        setFormData(prev => ({
            ...prev,
            testemunhas: prev.testemunhas.filter((_, index) => index !== indexToRemove)
        }));
        toast.warn("Testemunha removida.");
    };

    const handleAddDocumento = () => {
         setFormData(prev => ({
            ...prev,
            documentosApresentados: [...prev.documentosApresentados, { descricao: '', arquivo: null, nomeArquivo: '' }]
        }));
        toast.info("Campo para documento adicionado.");
    };

     const handleRemoveDocumento = (indexToRemove: number) => {
        if (formData.documentosApresentados.length <= 1) {
            toast.warn("É necessário ao menos um documento.");
            return;
        }
        setFormData(prev => ({
            ...prev,
            documentosApresentados: prev.documentosApresentados.filter((_, index) => index !== indexToRemove)
        }));
        toast.warn("Documento removido.");
    };

    const handleLavrarAto = () => {
        if (formData.testemunhas.length < 2) {
            toast.error("É obrigatório informar ao menos duas testemunhas.");
            setActiveTab('testemunhas');
            return;
        }

        if (window.confirm("Atenção: Lavrar o ato de natimorto é uma ação definitiva. Deseja continuar?")) {
            toast.promise(
                new Promise(resolve => setTimeout(resolve, 1500)),
                { pending: 'Processando e lavrando o ato...', success: 'Ato de Natimorto lavrado com sucesso!', error: 'Ocorreu um erro ao lavrar o ato.' }
            );
            console.log("Lavrando o ato de natimorto com os seguintes dados:", formData);
        }
    };


    // --- COMPONENTES E ESTILOS UTILITÁRIOS ---
    const SectionTitle = ({ children }: { children: React.ReactNode }) => <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-3 border-b border-gray-200">{children}</h3>;
    const SubSectionTitle = ({ children }: { children: React.ReactNode }) => <h4 className="font-bold text-gray-700 mb-4 mt-6">{children}</h4>;
    const commonInputClass = "mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500";
    const commonLabelClass = "block text-sm font-medium text-gray-700";
    const requiredSpan = <span className="text-red-500">*</span>;
    const controlInputClass = `${commonInputClass} ${isControlReadOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`;
    const InfoButton = ({ title, content }: { title: string, content: React.ReactNode }) => (
        <button type="button" onClick={() => openInfoModal(title, content)} className="ml-2 text-gray-400 hover:text-blue-500 transition-colors">
            <HelpCircle size={16} />
        </button>
    );

    return (
        <>
            <title>Registrar Ato de Natimorto</title>
            <div className="flex bg-gray-50 min-h-screen font-sans">
                <main className="flex-1 p-0">
                    <div className="max-w-7xl mx-auto">
                        <header className="mb-6 flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">Registrar Novo Ato de Natimorto</h1>
                                <p className="text-md text-gray-500 mt-1">Livro C-Auxiliar - Assento de Natimorto</p>
                            </div>
                            <button type="button" onClick={() => setIsHistoryModalOpen(true)} className="flex items-center gap-2 bg-white text-gray-600 font-semibold px-4 py-2 rounded-lg border border-gray-300 shadow-sm hover:bg-gray-100">
                                <History className="h-5 w-5" /> Ver Histórico
                            </button>
                        </header>

                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
                                {tabs.map(tab => (
                                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`${activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}>
                                        <tab.icon className="h-5 w-5" /> {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <form noValidate className="mt-6 space-y-6">
                            <div className="tab-content bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[500px]">

                                {/* --- Aba de Controle do Ato (CORRIGIDA) --- */}
                                {activeTab === 'controle' && (
                                    <fieldset>
                                        <SectionTitle>Controle do Ato</SectionTitle>
                                        <div className="flex items-center mb-5">
                                            <input type="checkbox" name="controleRegistro.isLivroAntigo" id="controleRegistro.isLivroAntigo" className="form-checkbox h-5 w-5 text-blue-600 rounded" checked={formData.controleRegistro.isLivroAntigo} onChange={handleInputChange} />
                                            <label htmlFor="controleRegistro.isLivroAntigo" className="ml-3 font-medium text-gray-700">Transcrição de livro antigo?</label>
                                        </div>
                                        <div className="pt-5">
                                            <h4 className="font-semibold text-gray-600 mb-3">Dados do Registro</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                                <div><label htmlFor="controleRegistro.dataRegistro" className={commonLabelClass}>Data do Registro {requiredSpan}</label><input type="date" name="controleRegistro.dataRegistro" id="controleRegistro.dataRegistro" className={controlInputClass} value={formData.controleRegistro.dataRegistro} onChange={handleInputChange} readOnly={isControlReadOnly} /></div>
                                                <div><label htmlFor="controleRegistro.protocolo" className={commonLabelClass}>Nº do Protocolo</label><input type="text" name="controleRegistro.protocolo" id="controleRegistro.protocolo" className={controlInputClass} value={formData.controleRegistro.protocolo} onChange={handleInputChange} readOnly={isControlReadOnly} placeholder={isControlReadOnly ? 'Automático' : ''} /></div>
                                            </div>
                                        </div>
                                        <div className="mt-6 pt-6">
                                            <h4 className="font-semibold text-gray-600 mb-3">Dados da Lavratura</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-5">
                                                <div><label htmlFor="controleRegistro.dataLavratura" className={commonLabelClass}>Data da Lavratura {requiredSpan}</label><input type="date" name="controleRegistro.dataLavratura" id="controleRegistro.dataLavratura" className={controlInputClass} value={formData.controleRegistro.dataLavratura} onChange={handleInputChange} readOnly={isControlReadOnly} /></div>
                                                <div>
                                                    <label htmlFor="controleRegistro.livro" className={`${commonLabelClass} flex items-center`}>
                                                        Livro {requiredSpan}
                                                        <InfoButton
                                                            title="Livro Específico para Natimorto"
                                                            content="O registro de natimorto não é lavrado no livro comum de óbitos (Livro C), mas sim em um livro próprio e exclusivo para este fim, o Livro C-Auxiliar."
                                                        />
                                                    </label>
                                                    <input type="text" name="controleRegistro.livro" id="controleRegistro.livro" className={`${commonInputClass} bg-gray-100 cursor-not-allowed`} value={formData.controleRegistro.livro} readOnly />
                                                </div>                                                <div><label htmlFor="controleRegistro.folha" className={commonLabelClass}>Folha {requiredSpan}</label><input type="text" name="controleRegistro.folha" id="controleRegistro.folha" className={controlInputClass} value={formData.controleRegistro.folha} onChange={handleInputChange} readOnly={isControlReadOnly} /></div>
                                                <div><label htmlFor="controleRegistro.numeroTermo" className={commonLabelClass}>Nº do Termo {requiredSpan}</label><input type="text" name="controleRegistro.numeroTermo" id="controleRegistro.numeroTermo" className={controlInputClass} value={formData.controleRegistro.numeroTermo} onChange={handleInputChange} readOnly={isControlReadOnly} /></div>
                                            </div>
                                        </div>
                                        <div className="mt-6 pt-6 flex justify-end"><button type="button" onClick={handleLavrarAto} className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"><Award className="h-5 w-5" />Lavrar Ato</button></div>
                                    </fieldset>
                                )}

                                {activeTab === 'natimorto' && (
                                    <fieldset>
                                        <SectionTitle>Dados do Fato e do Natimorto</SectionTitle>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6">
                                            <div className="md:col-span-2"><label htmlFor="natimorto.localDoFato" className={commonLabelClass}>Local do Fato {requiredSpan}</label><input type="text" name="natimorto.localDoFato" id="natimorto.localDoFato" value={formData.natimorto.localDoFato} onChange={handleInputChange} className={commonInputClass} placeholder="Hospital, residência, etc." /></div>
                                            <div><label htmlFor="natimorto.dataDoFato" className={commonLabelClass}>Data do Fato {requiredSpan}</label><input type="date" name="natimorto.dataDoFato" id="natimorto.dataDoFato" value={formData.natimorto.dataDoFato} onChange={handleInputChange} className={commonInputClass} /></div>
                                            <div><label htmlFor="natimorto.horaDoFato" className={commonLabelClass}>Hora do Fato</label><input type="time" name="natimorto.horaDoFato" id="natimorto.horaDoFato" value={formData.natimorto.horaDoFato} onChange={handleInputChange} className={commonInputClass} /></div>

                                            <div className="md:col-span-4 pt-2">
                                                <SubSectionTitle>Informações do Natimorto</SubSectionTitle>
                                            </div>

                                            <div><label htmlFor="natimorto.sexo" className={commonLabelClass}>Sexo {requiredSpan}</label><select name="natimorto.sexo" id="natimorto.sexo" value={formData.natimorto.sexo} onChange={handleInputChange} className={commonInputClass}><option value="">Selecione...</option><option value="Masculino">Masculino</option><option value="Feminino">Feminino</option><option value="Ignorado">Ignorado</option></select></div>

                                            <div className="md:col-span-3 grid grid-cols-2 gap-x-6">
                                                <div className="flex items-center justify-center self-end mb-2">
                                                    <input id="natimorto.nomeAtribuido" type="checkbox" name="natimorto.nomeAtribuido" checked={formData.natimorto.nomeAtribuido} onChange={handleInputChange} className="h-4 w-4 text-blue-600" />
                                                    <label htmlFor="natimorto.nomeAtribuido" className="ml-2 text-sm font-medium flex items-center">
                                                        Foi atribuído nome?
                                                        <InfoButton
                                                            title="Atribuição de Nome ao Natimorto"
                                                            content="Diferente do registro de nascimento, a atribuição de um nome (prenome e sobrenome) ao natimorto é uma faculdade dos pais, não uma obrigação. O oficial deve indagar sobre essa opção."
                                                        />
                                                    </label>
                                                </div>                                                <div className="flex items-center justify-center self-end mb-2"><input id="natimorto.partoDuplo" type="checkbox" name="natimorto.partoDuplo" checked={formData.natimorto.partoDuplo} onChange={handleInputChange} className="h-4 w-4 text-blue-600" /><label htmlFor="natimorto.partoDuplo" className="ml-2 text-sm font-medium">Houve parto duplo?</label></div>
                                            </div>

                                            {formData.natimorto.nomeAtribuido && (
                                                <div className="md:col-span-4 animate-fade-in mt-6"><label htmlFor="natimorto.nomeCompleto" className={commonLabelClass}>Nome Completo do Natimorto (Opcional)</label><input type="text" name="natimorto.nomeCompleto" id="natimorto.nomeCompleto" value={formData.natimorto.nomeCompleto || ''} onChange={handleInputChange} className={commonInputClass} /></div>
                                            )}

                                            <div className="md:col-span-4 pt-2">
                                                <SubSectionTitle>Atestado Médico</SubSectionTitle>
                                            </div>

                                            <div className="md:col-span-2"><label htmlFor="natimorto.causaMorteFetal" className={commonLabelClass}>Causa da Morte Fetal {requiredSpan}</label><input type="text" name="natimorto.causaMorteFetal" id="natimorto.causaMorteFetal" value={formData.natimorto.causaMorteFetal} onChange={handleInputChange} className={commonInputClass} /></div>
                                            <div><label htmlFor="natimorto.medicoAtestante" className={commonLabelClass}>Médico Atestante {requiredSpan}</label><input type="text" name="natimorto.medicoAtestante" id="natimorto.medicoAtestante" value={formData.natimorto.medicoAtestante} onChange={handleInputChange} className={commonInputClass} /></div>
                                            <div>
                                                <label htmlFor="natimorto.numeroDO" className={`${commonLabelClass} flex items-center`}>
                                                    Nº da Declaração de Óbito (DO) {requiredSpan}
                                                    <InfoButton
                                                        title="Documento Base para o Registro"
                                                        content="Para o registro de natimorto, é obrigatória a apresentação da Declaração de Óbito (DO), e não da Declaração de Nascido Vivo (DNV). O número da DO deve ser inserido no registro."
                                                    />
                                                </label>
                                                <input type="text" name="natimorto.numeroDO" id="natimorto.numeroDO" value={formData.natimorto.numeroDO} onChange={handleInputChange} className={commonInputClass} />
                                            </div>                                        </div>
                                    </fieldset>
                                )}

                                {activeTab === 'filiacao' && (
                                    <fieldset className="space-y-12">
                                        <div>
                                            <SectionTitle>Dados da Mãe</SectionTitle>
                                            <PersonFields personData={formData.filiacao.mae} pathPrefix={['filiacao', 'mae']} handleInputChange={handleInputChange} handleAddressUpdate={handleAddressUpdate} handleCpfSearch={handleCpfSearch} searchingCpf={searchingCpf} />
                                        </div>
                                        <div>
                                            <SectionTitle>Dados do Pai</SectionTitle>
                                            <PersonFields personData={formData.filiacao.pai} pathPrefix={['filiacao', 'pai']} handleInputChange={handleInputChange} handleAddressUpdate={handleAddressUpdate} handleCpfSearch={handleCpfSearch} searchingCpf={searchingCpf} />
                                        </div>
                                    </fieldset>
                                )}

                                {activeTab === 'testemunhas' && (
                                    <fieldset>
                                        <div className='flex items-center mb-6 pb-3 border-b border-gray-200'>
                                            <h3 className="text-xl font-semibold text-gray-800">Dados das Testemunhas</h3>
                                            <InfoButton
                                                title="Obrigatoriedade das Testemunhas"
                                                content="O Art. 706, inciso VI, exige a presença e a qualificação completa de duas testemunhas para a lavratura do assento de natimorto."
                                            />
                                        </div>
                                        <p className="text-sm text-gray-500 -mt-4 mb-6">Informe os dados das duas testemunhas obrigatórias. Se necessário, adicione mais.</p>
                                        <div className="space-y-12">
                                            {formData.testemunhas.map((witness, index) => (
                                                <div key={index} className="border-t first:border-t-0 pt-8 first:pt-0">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <h4 className="font-bold text-gray-700">Dados da {index + 1}ª Testemunha</h4>
                                                        {formData.testemunhas.length > 2 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveTestemunha(index)}
                                                                className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800 font-semibold"
                                                            >
                                                                <Trash2 className="h-4 w-4" />Remover Testemunha
                                                            </button>
                                                        )}
                                                    </div>
                                                    <PersonFields
                                                        personData={witness}
                                                        pathPrefix={['testemunhas', index]}
                                                        handleInputChange={handleInputChange}
                                                        handleAddressUpdate={handleAddressUpdate}
                                                        handleCpfSearch={handleCpfSearch}
                                                        searchingCpf={searchingCpf}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-6 flex justify-start pt-6 border-t">
                                            <button
                                                type="button"
                                                onClick={handleAddTestemunha}
                                                className="flex items-center gap-2 bg-gray-100 text-gray-800 font-semibold px-4 py-2 rounded-lg shadow-sm border border-gray-300 hover:bg-gray-200 transition-colors"
                                            >
                                                <PlusCircle className="h-5 w-5" />Adicionar Outra Testemunha
                                            </button>
                                        </div>
                                    </fieldset>
                                )}

                                {activeTab === 'documentos' && (
                                    <fieldset>
                                        <SectionTitle>Documentos Apresentados e Anexos Digitais</SectionTitle>
                                        <div className="space-y-4">
                                            {formData.documentosApresentados.map((doc, index) => (
                                                <div key={index} className="flex flex-col md:flex-row items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-300 shadow-sm">
                                                    <div className="flex-grow w-full"><label htmlFor={`doc-desc-${index}`} className={commonLabelClass}>Descrição do Documento</label><input id={`doc-desc-${index}`} name={`documentosApresentados.${index}.descricao`} value={doc.descricao} onChange={handleInputChange} className={commonInputClass} placeholder="Ex: Declaração de Óbito (DO)" /></div>
                                                    <div className="w-full md:w-auto"><label className={commonLabelClass}>Anexo Digital</label><label htmlFor={`doc-file-${index}`} className="mt-1 cursor-pointer flex items-center justify-center gap-2 w-full md:w-56 px-4 py-2 bg-white text-blue-600 border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 transition"><UploadCloud size={18} /><span>{doc.nomeArquivo ? 'Trocar Arquivo' : 'Escolher Arquivo'}</span></label><input id={`doc-file-${index}`} type="file" className="sr-only" onChange={(e) => handleFileChange(['documentosApresentados', index], e.target.files?.[0] || null)} />{doc.nomeArquivo && (<p className="text-xs text-green-700 mt-1 truncate w-full md:w-56" title={doc.nomeArquivo}>Arquivo: {doc.nomeArquivo}</p>)}</div>
                                                    {formData.documentosApresentados.length > 1 && (<div className="w-full md:w-auto flex justify-end md:self-end"><button type="button" onClick={() => handleRemoveDocumento(index)} className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"><Trash2 size={20} /></button></div>)}
                                                </div>
                                            ))}
                                        </div>
                                        <button type="button" onClick={handleAddDocumento} className="mt-6 flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800"><PlusCircle size={16} /> Adicionar Documento</button>
                                    </fieldset>
                                )}
                            </div>

                            <div className="flex justify-end pt-6 mt-8 gap-4">
                                <button type="button" onClick={() => setFormData(initialState)} className="flex items-center gap-2 bg-red-600 text-white font-semibold px-6 py-3 rounded-lg shadow-sm hover:bg-red-700"><XCircle className="h-5 w-5" /> Cancelar</button>
                                <button type="submit" className="flex items-center gap-2 bg-green-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-green-700"><Save className="h-5 w-5" /> Salvar Rascunho</button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>

            <InfoModal
              isOpen={modalContent !== null}
              onClose={closeInfoModal}
              title={modalContent?.title || ''}
            >
              {modalContent?.content}
            </InfoModal>

            <HistoricoModal isOpen={isHistoryModalOpen} onClose={() => setIsHistoryModalOpen(false)} historico={formData.historico} />
        </>
    );
}