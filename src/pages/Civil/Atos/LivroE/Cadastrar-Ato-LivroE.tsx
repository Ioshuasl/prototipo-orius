import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { BookText, FileSignature, Paperclip, Save, XCircle, History } from 'lucide-react';

// Tipos e Interfaces
import {
    type ILivroEFormData, type TipoAtoLivroE, type IEmancipacao, type IInterdicao, type IEndereco, type IPessoaFisica, type IAusencia, type IMortePresumida, type ITutela, type IGuarda, type IOpcaoNacionalidade, type IUniaoEstavel, type INascimentoPaisEstrangeiros, type ITrasladoExterior, type ITrasladoNascimentoData, type ITrasladoCasamentoData, type ITrasladoObitoData
} from '../../types';

// Constantes e Estados Iniciais
import { tiposDeAtoLivroE, mockPessoDatabase } from '../../lib/Constants';

// Componentes Reutilizáveis e de Formulário
import ControleAtoLivroE from './Components/ControleAtoLivroE';
import HistoricoModal from '../../Components/HistoricoModal';
import InfoModal from '../../Components/InfoModal';
import FormEmancipacao from './Components/FormEmancipacao';
import FormInterdicao from './Components/FormInterdicao';
import FormAusencia from './Components/FormAusencia';
import FormMortePresumida from './Components/FormMortePresumida';
import FormTutela from './Components/FormTutela';
import FormGuarda from './Components/FormGuarda';
import FormOpcaoNacionalidade from './Components/FormOpcaoNacionalidade';
import FormUniaoEstavel from './Components/FormUniaoEstavel';
import FormNascimentoPaisEstrangeiros from './Components/FormNascimentoPaisEstrangeiros';
import FormTrasladoExterior from './Components/FormTrasladoExterior';
import DocumentosAnexosTab from './Components/DocumentosAnexosTab';

const initialEnderecoState: IEndereco = {
    cep: '',
    tipoLogradouro: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: ''
};

const initialPersonState: Partial<IPessoaFisica> = {
    nome: '',
    cpf: '',
    dataNascimento: '',
    docIdentidadeTipo: '',
    docIdentidadeNum: '',
    estadoCivil: '',
    regimeBens: '',
    profissao: '',
    nacionalidade: 'Brasileira',
    naturalidadeCidade: '',
    naturalidadeUF: '',
    endereco: { ...initialEnderecoState },
    nomePai: '',
    nomeMae: '',
};

// --- ESTADO INICIAL E FUNÇÕES HELPERS ---
const initialStateLivroE: ILivroEFormData = {
    tipoAto: '',
    controleRegistro: { isLivroAntigo: false, dataRegistro: new Date().toISOString().split('T')[0], protocolo: '', dataLavratura: '', livro: 'Livro E', folha: '', numeroTermo: '' },
    dadosAto: {},
    documentosApresentados: [
        { descricao: 'Certidão de Nascimento do Requerente', arquivo: null }
    ],
    historico: [{ data: '2025-07-10T14:30:00Z', evento: 'Rascunho do ato criado no sistema.', usuario: 'automacao.sistema' }]
};

const createInitialStateForAto = (tipo: TipoAtoLivroE) => {
    const dadosSentenca = { dataSentenca: '', juizo: '', nomeMagistrado: '', dataTransitoEmJulgado: '' };
    switch (tipo) {
        case 'emancipacao':
            return { origem: 'sentenca', emancipado: { ...initialPersonState }, responsaveis: { nomePai: '', nomeMae: '', nomeTutor: '' } } as IEmancipacao;
        case 'interdicao':
            return { dadosSentenca, interdito: { ...initialPersonState }, curador: { ...initialPersonState }, causaInterdicao: '', limitesCuratela: '' } as IInterdicao;
        case 'ausencia':
            return { dadosSentenca, ausente: { ...initialPersonState }, curador: { ...initialPersonState }, causaAusencia: '', limitesCuratela: '' } as IAusencia;
        case 'mortePresumida':
            return { dadosSentenca, ausente: { ...initialPersonState }, dataProvavelFalecimento: '' } as IMortePresumida;
        case 'tutela':
            return { dadosSentenca, tutelado: { ...initialPersonState }, tutor: { ...initialPersonState }, limitacoesTutela: '' } as ITutela;
        case 'guarda':
            return { dadosSentenca, menor: { ...initialPersonState }, guardiao: { ...initialPersonState } } as IGuarda;
        case 'opcaoNacionalidade':
            return { dadosSentenca, optante: { ...initialPersonState } } as IOpcaoNacionalidade;
        case 'uniaoEstavel':
            return { tipo: 'reconhecimento', origem: 'escritura', companheiro1: { ...initialPersonState }, companheiro2: { ...initialPersonState }, regimeBens: '', alteracaoNomeCompanheiro1: false, alteracaoNomeCompanheiro2: false } as IUniaoEstavel;
        case 'nascimentoPaisEstrangeiros':
            return {
                nascimento: { dnv: '', dataNascimento: '', horaNascimento: '', localNascimento: '', isGemeo: false },
                registrando: { prenome: '', sobrenome: '', sexo: '', naturalidade: '', cpf: '' },
                filiacao: { mae: { ...initialPersonState }, pai: { ...initialPersonState } },
                declarante: { ...initialPersonState },
                observacaoObrigatoria: 'O registrando não possui a nacionalidade brasileira, nos termos do art. 12, inciso I, alínea ‘a’ da Constituição da República Federativa do Brasil.'
            } as INascimentoPaisEstrangeiros;
        case 'trasladoExterior':
            return { tipoTraslado: '', requerente: { ...initialPersonState }, dadosCertidaoOrigem: { serventia: '', dataEmissao: '', matriculaOuReferencia: '' }, dadosAto: null } as ITrasladoExterior;
        default: return {};
    }
};

const createInitialStateForTraslado = (tipoTraslado: 'nascimento' | 'casamento' | 'obito') => {
    switch (tipoTraslado) {
        case 'nascimento':
            return {
                origemRegistro: 'consular', dadosNascimento: { nome: '', dataNascimento: '', localNascimento: '', sexo: '' },
                filiacao: { nomePai: '', nacionalidadePai: '', nomeMae: '', nacionalidadeMae: '' }, observacaoObrigatoria: "Brasileiro nato, conforme os termos da alínea c do inciso I do art. 12, in limine, da Constituição Federal."
            } as ITrasladoNascimentoData;
        case 'casamento':
            return {
                nubente1: { ...initialPersonState }, nubente2: { ...initialPersonState }, dataCasamento: '', localCasamento: '',
                regimeBens: '', nomeAdotadoNubente1: '', nomeAdotadoNubente2: '', pactoAntenupcial: { apresentado: false, detalhes: '' },
                observacaoObrigatoria: 'Aplica-se o disposto no art. 7º § 4º. do Decreto-Lei nº 4.657/1942'
            } as ITrasladoCasamentoData;
        case 'obito':
            return {
                falecido: { ...initialPersonState }, dataObito: '', localObito: '', causaMorte: '', localSepultamento: '',
                deixouBens: false, eraCasado: false, nomeConjuge: '', deixouFilhos: false, filhos: []
            } as ITrasladoObitoData;
        default:
            return null;
    }
};

const tabs = [
    { id: 'controle', label: 'Controle e Lavratura', icon: FileSignature },
    { id: 'dadosAto', label: 'Dados do Ato', icon: BookText },
    { id: 'anexos', label: 'Anexos', icon: Paperclip },
];

export default function CadastrarAtoLivroE() {
    // ALTERAÇÃO: A aba inicial agora é 'controle'
    const [activeTab, setActiveTab] = useState(tabs[0].id);
    const [formData, setFormData] = useState<ILivroEFormData>(initialStateLivroE);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [searchingCpf, setSearchingCpf] = useState<string | null>(null);
    const [modalInfo, setModalInfo] = useState({ isOpen: false, title: '', content: null as React.ReactNode });

    const handleOpenInfoModal = (title: string, content: React.ReactNode) => {
        setModalInfo({ isOpen: true, title, content });
    };

    const handleCloseInfoModal = () => {
        setModalInfo({ isOpen: false, title: '', content: null });
    };

    // Efeito para lidar com a lógica do checkbox 'isLivroAntigo'
    useEffect(() => {
        if (formData.controleRegistro.isLivroAntigo) {
            setFormData(prev => ({ ...prev, controleRegistro: { ...prev.controleRegistro, dataRegistro: '', protocolo: '' } }));
        } else {
            const today = new Date().toISOString().split('T')[0];
            setFormData(prev => ({ ...prev, controleRegistro: { ...prev.controleRegistro, dataRegistro: today } }));
        }
    }, [formData.controleRegistro.isLivroAntigo]);

    const addDynamicItem = (path: string) => {
        const keys = path.split('.');

        // Define o objeto inicial com base no caminho
        let initialStateSlice: any;
        if (path.includes('filhos')) {
            initialStateSlice = { nome: '', idade: '' };
        } else {
            // Pode ser expandido para outras listas no futuro
            toast.error("Tipo de lista dinâmica não reconhecido.");
            return;
        }

        setFormData(prev => {
            const newState = JSON.parse(JSON.stringify(prev)); // Usar uma cópia profunda para segurança
            let currentLevel = newState;
            for (let i = 0; i < keys.length - 1; i++) {
                currentLevel = currentLevel[keys[i]];
            }
            const currentArray = currentLevel[keys[keys.length - 1]] || [];
            currentLevel[keys[keys.length - 1]] = [...currentArray, initialStateSlice];
            return newState;
        });
        toast.info("Novo item adicionado à lista.");
    };

    const removeDynamicItem = (path: string, indexToRemove: number) => {
        const keys = path.split('.');
        setFormData(prev => {
            const newState = JSON.parse(JSON.stringify(prev));
            let currentLevel = newState;
            for (let i = 0; i < keys.length - 1; i++) {
                currentLevel = currentLevel[keys[i]];
            }
            const currentArray = currentLevel[keys[keys.length - 1]];
            currentLevel[keys[keys.length - 1]] = currentArray.filter((_: any, index: number) => index !== indexToRemove);
            return newState;
        });
        toast.warn("Item removido da lista.");
    };

    // --- HANDLERS ---
    const handleTipoAtoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const novoTipo = e.target.value as TipoAtoLivroE;
        toast.info(`Formulário para "${tiposDeAtoLivroE.find(t => t.value === novoTipo)?.label}" iniciado.`);
        setFormData(prev => ({
            ...prev, // Mantém os dados de controle já preenchidos
            tipoAto: novoTipo,
            dadosAto: {
                [novoTipo]: createInitialStateForAto(novoTipo)
            }
        }));
        // Sugestão: Mudar para a aba de dados do ato após a seleção
        setActiveTab('dadosAto');
    };

    const setNestedValue = (obj: any, path: string[], value: any): any => {
        const key = path[0];
        if (path.length === 1) {
            return { ...obj, [key]: value };
        }
        const nextObj = (obj && typeof obj[key] === 'object' && obj[key] !== null) ? obj[key] : {};
        return {
            ...obj,
            [key]: setNestedValue(nextObj, path.slice(1), value)
        };
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const keys = name.split('.');
        const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

        setFormData(prev => {
            // Primeiro, atualiza o valor do campo que foi alterado
            const stateAfterValueUpdate = setNestedValue(prev, keys, finalValue);

            // Se o campo alterado for o seletor de tipo de traslado, faz uma segunda atualização
            // para inicializar o sub-estado `dadosAto` do traslado.
            if (name === 'dadosAto.trasladoExterior.tipoTraslado') {
                const tipoTraslado = value as 'nascimento' | 'casamento' | 'obito';
                const initialSubState = createInitialStateForTraslado(tipoTraslado);

                return setNestedValue(stateAfterValueUpdate, ['dadosAto', 'trasladoExterior', 'dadosAto'], initialSubState);
            }

            // Para todos os outros campos, retorna apenas a primeira atualização.
            return stateAfterValueUpdate;
        });
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

    const handleFileChange = (path: (string | number)[], file: File | null) => {
        setFormData(prev => {
            const newState = { ...prev };
            let currentLevel: any = newState;

            // Navega até o penúltimo nível do caminho
            for (let i = 0; i < path.length - 1; i++) {
                const key = path[i];
                if (Array.isArray(currentLevel[key])) {
                    currentLevel[key] = [...currentLevel[key]]; // Cria uma nova cópia do array
                } else {
                    currentLevel[key] = { ...currentLevel[key] }; // Cria uma nova cópia do objeto
                }
                currentLevel = currentLevel[key];
            }

            // Atualiza o objeto final no array
            const finalPathKey = path[path.length - 1];
            const index = path[path.length - 2];

            if (typeof index === 'number') {
                const item = { ...currentLevel[index] }; // Cópia do item específico
                item[finalPathKey as keyof typeof item] = file;
                item['nomeArquivo'] = file?.name; // Guarda o nome do arquivo
                currentLevel[index] = item;
            }

            return newState;
        });
        if (file) {
            toast.info(`Arquivo "${file.name}" selecionado.`);
        }
    };

    // FUNÇÃO DE LAVRAR ATO ADICIONADA AQUI
    const handleLavrarAto = () => {
        if (!formData.tipoAto) {
            toast.warn("Por favor, selecione um tipo de ato antes de lavrar.");
            setActiveTab('controle');
            return;
        }

        if (window.confirm("Atenção: Lavrar o ato é uma ação definitiva que gerará um registro oficial. Deseja continuar?")) {
            toast.promise(
                new Promise(resolve => setTimeout(resolve, 1500)),
                {
                    pending: 'Processando e lavrando o ato...',
                    success: 'Ato lavrado com sucesso!',
                    error: 'Ocorreu um erro ao lavrar o ato.'
                }
            );
            console.log("Lavrando o ato com os seguintes dados:", formData);
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log("Rascunho do Ato (Livro E) Salvo:", formData);
        toast.success('Rascunho salvo com sucesso!');
    };

    const handleCancel = () => {
        if (window.confirm("Você tem certeza que deseja cancelar?")) {
            setFormData(initialStateLivroE);
            setActiveTab('controle');
            toast.info("Operação cancelada.");
        }
    };

    const SectionTitle = ({ children }: { children: React.ReactNode }) => <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">{children}</h3>;
        const SubSectionTitle = ({ children }: { children: React.ReactNode }) => <h4 className="font-bold text-gray-600 mb-3 mt-4">{children}</h4>;

    // --- RENDERIZAÇÃO ---
    const renderFormByTipoAto = () => {
        const tipoAto = formData.tipoAto;
        const commonProps = { handleInputChange, handleAddressUpdate, handleCpfSearch, searchingCpf, addDynamicItem, removeDynamicItem, onOpenInfoModal: handleOpenInfoModal };

        if (!tipoAto) {
            return (
                <div className="text-center text-gray-500 py-10">
                    <p>Por favor, selecione o tipo de ato na aba "Controle e Lavratura" para continuar.</p>
                </div>
            );
        }

        switch (tipoAto) {
            case 'emancipacao':
                return <FormEmancipacao data={formData.dadosAto.emancipacao!} {...commonProps} />;
            case 'interdicao':
                return <FormInterdicao data={formData.dadosAto.interdicao!} {...commonProps} />;
            case 'ausencia':
                return <FormAusencia data={formData.dadosAto.ausencia!} {...commonProps} />;
            case 'mortePresumida':
                return <FormMortePresumida data={formData.dadosAto.mortePresumida!} {...commonProps} />;
            case 'tutela':
                return <FormTutela data={formData.dadosAto.tutela!} {...commonProps} />;
            case 'guarda':
                return <FormGuarda data={formData.dadosAto.guarda!} {...commonProps} />;
            case 'opcaoNacionalidade':
                return <FormOpcaoNacionalidade data={formData.dadosAto.opcaoNacionalidade!} {...commonProps} />;
            case 'uniaoEstavel':
                return <FormUniaoEstavel data={formData.dadosAto.uniaoEstavel!} {...commonProps} />;
            case 'nascimentoPaisEstrangeiros':
                return <FormNascimentoPaisEstrangeiros data={formData.dadosAto.nascimentoPaisEstrangeiros!} {...commonProps} />;
            case 'trasladoExterior':
                return <FormTrasladoExterior data={formData.dadosAto.trasladoExterior!} {...commonProps} />;
            default:
                return <div className="text-center text-gray-500 py-10">Formulário para "{tiposDeAtoLivroE.find(t => t.value === tipoAto)?.label}" ainda não implementado.</div>;
        }
    };

    return (
        <>
            <title>Registrar Ato - Livro E</title>
            <main className="flex-1 p-0">
                <div className="max-w-7xl mx-auto">
                    <header className="mb-6 flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Registrar Ato do Livro E</h1>
                            <p className="text-md text-gray-500 mt-1">Preencha os dados de controle e do ato para realizar o registro.</p>
                        </div>
                        <button type="button" onClick={() => setIsHistoryModalOpen(true)} className="flex items-center gap-2 bg-white text-gray-600 font-semibold px-4 py-2 rounded-lg border border-gray-300 shadow-sm hover:bg-gray-100 transition-colors">
                            <History className="h-5 w-5" /> Ver Histórico
                        </button>
                    </header>

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                                {tabs.map(tab => (<button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`${activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}><tab.icon className="h-5 w-5" /> {tab.label}</button>))}
                            </nav>
                        </div>

                        <div className="mt-6">
                            {/* Aba de Controle */}
                            {activeTab === 'controle' && (
                                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                    <ControleAtoLivroE
                                        formData={formData}
                                        handleInputChange={handleInputChange}
                                        handleTipoAtoChange={handleTipoAtoChange}
                                        handleLavrarAto={handleLavrarAto}
                                    />
                                </div>
                            )}

                            {/* Aba de Dados do Ato */}
                            {activeTab === 'dadosAto' && (
                                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                    {renderFormByTipoAto()}
                                </div>
                            )}

                            {/* Aba de Anexos */}
                            {activeTab === 'anexos' && (
                                <DocumentosAnexosTab documentos={formData.documentosApresentados} handleInputChange={handleInputChange} handleFileChange={handleFileChange} addDynamicItem={() => addDynamicItem('documentosApresentados')} removeDynamicItem={(index) => removeDynamicItem('documentosApresentados', index)} SectionTitle={SectionTitle} SubSectionTitle={SubSectionTitle} />
                            )}
                        </div>

                        <div className="flex justify-end pt-6 mt-8 gap-4">
                            <button type="button" onClick={handleCancel} className="flex items-center gap-2 bg-red-600 text-white font-semibold px-6 py-3 rounded-lg shadow-sm hover:bg-red-700"> <XCircle className="h-5 w-5" /> Cancelar </button>
                            <button type="submit" className="flex items-center gap-2 bg-green-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-green-700"> <Save className="h-5 w-5" /> Salvar Rascunho </button>
                        </div>
                    </form>
                </div>
            </main>

            <HistoricoModal isOpen={isHistoryModalOpen} onClose={() => setIsHistoryModalOpen(false)} historico={formData.historico} />

            <InfoModal
                isOpen={modalInfo.isOpen}
                onClose={handleCloseInfoModal}
                title={modalInfo.title}
            >
                {modalInfo.content}
            </InfoModal>

        </>
    );
}