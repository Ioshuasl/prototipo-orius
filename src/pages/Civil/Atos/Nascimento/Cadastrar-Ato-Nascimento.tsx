import React, { useState, useEffect } from 'react';
import { Baby, UploadCloud, Users, FileText, Save, XCircle, BookKey, Award, PlusCircle, Trash2, Paperclip, Sparkles, History } from 'lucide-react';
import PersonFields from '../../Components/PersonFields';
import { toast } from 'react-toastify';
import { IMaskInput } from 'react-imask';
import { livrosDisponiveis, mockPessoDatabase } from '../../lib/Constants';
import { type INascimentoFormData, type IPessoaFisica, type IEndereco, type TPessoaTipo, type IPessoaJuridica } from '../../types';
import HistoricoModal from '../../Components/HistoricoModal';
import SeletorDePessoa from '../../Components/SeletorDePessoa';


// --- ESTADO INICIAL ---
const todayString = new Date().toISOString().split('T')[0];
const initialEnderecoState: IEndereco = { cep: '', tipoLogradouro: '', logradouro: '', numero: '', complemento: '', bairro: '', cidade: '', uf: '' };
const initialPersonState: IPessoaFisica = { tipo: 'fisica', nome: '', cpf: '', dataNascimento: '', docIdentidadeTipo: '', docIdentidadeNum: '', estadoCivil: '', regimeBens: '', profissao: '', nacionalidade: 'Brasileira', naturalidadeCidade: '', naturalidadeUF: '', endereco: { ...initialEnderecoState }, nomePai: '', nomeMae: '', };


const initialState: INascimentoFormData = {
    dadosAto: { isLivroAntigo: false, dataRegistro: todayString, protocolo: '', dataLavratura: '', livro: '', folha: '', numeroTermo: '' },
    nascimento: { dnv: '', dataNascimento: '', horaNascimento: '', localNascimento: '', isGemeo: false, semAssistenciaMedica: false },
    registrando: { prenome: '', sobrenome: '', sexo: '', naturalidade: '', cpf: '' },
    filiacao: { mae: { ...initialPersonState }, pai: { ...initialPersonState } },
    declarante: { ...initialPersonState },
    testemunhas: [],
    documentosApresentados: [
        { descricao: 'DNV', arquivo: null },
        { descricao: 'Documento da Mãe', arquivo: null },
        { descricao: 'Documento do Pai', arquivo: null },
    ],
    historico: [
        { data: '2025-07-04T15:01:10Z', evento: 'Emitida 2ª via da Certidão de Nascimento.', usuario: 'escrevente.2' },
        { data: '2025-01-10T11:45:00Z', evento: 'Averbação de reconhecimento de paternidade adicionada.', usuario: 'oficial.master' },
        { data: '2024-11-20T09:22:30Z', evento: 'Emitida 1ª via da Certidão de Nascimento.', usuario: 'escrevente.1' },
        { data: '2024-11-19T17:05:00Z', evento: 'Ato lavrado e registrado no Livro A-101, Folha 15, Termo 5890.', usuario: 'oficial.master' },
        { data: '2024-11-19T14:30:00Z', evento: 'Rascunho do ato salvo por Oficial Exemplo.', usuario: 'oficial.exemplo' },
        { data: '2024-11-19T14:00:00Z', evento: 'Rascunho do ato criado no sistema.', usuario: 'oficial.exemplo' },
    ]
};

// --- DEFINIÇÃO DAS ABAS ---
const tabs = [
    { id: 'controle', label: 'Controle do Ato', icon: BookKey },
    { id: 'nascido', label: 'Dados do Nascido', icon: Baby },
    { id: 'filiacao', label: 'Filiação', icon: Users },
    { id: 'partes', label: 'Partes Envolvidas', icon: FileText },
    { id: 'anexos', label: 'Anexos', icon: Paperclip },
];

const setNestedValue = (obj: any, path: (string | number)[], value: any): any => {
    // ... (Lógica interna permanece a mesma)
    const key = path[0];
    if (path.length === 1) { return { ...obj, [key]: value }; }
    const nextObj = (obj && typeof obj[key] === 'object' && obj[key] !== null) ? obj[key] : (typeof path[1] === 'number' ? [] : {});
    return { ...obj, [key]: setNestedValue(nextObj, path.slice(1), value) };
};


export default function RegistroNascimentoForm() {
    // ... (Toda a lógica de estado e handlers permanece a mesma)
    const [formData, setFormData] = useState<INascimentoFormData>(initialState);
    const [activeTab, setActiveTab] = useState(tabs[0].id);
    const [searchingCpf, setSearchingCpf] = useState<string | null>(null);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [searchingCnpj, setSearchingCnpj] = useState<string | null>(null);

    useEffect(() => {
        if (formData.dadosAto.isLivroAntigo) {
            setFormData(prev => ({ ...prev, dadosAto: { ...prev.dadosAto, dataRegistro: '', dataLavratura: '' } }));
        } else {
            const today = new Date().toISOString().split('T')[0];
            setFormData(prev => ({ ...prev, dadosAto: { ...prev.dadosAto, dataRegistro: today, protocolo: '', dataLavratura: '', livro: '', folha: '', numeroTermo: '' } }));
        }
    }, [formData.dadosAto.isLivroAntigo]);

    useEffect(() => {
        if (formData.nascimento.semAssistenciaMedica) {
            if (formData.testemunhas.length < 2) {
                const witnessesToAdd = 2 - formData.testemunhas.length;
                const newWitnesses = Array.from({ length: witnessesToAdd }, () => ({ ...initialPersonState }));
                setFormData(prev => ({ ...prev, testemunhas: [...prev.testemunhas, ...newWitnesses] }));
            }
        } else {
            if (formData.testemunhas.length > 0) {
                setFormData(prev => ({ ...prev, testemunhas: [] }));
            }
        }
    }, [formData.nascimento.semAssistenciaMedica, formData.testemunhas.length]);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
            return newState;
        });
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

    const handleCnpjSearch = async (pathPrefix: (string | number)[], cnpj: string) => {
        const cleanCnpj = cnpj.replace(/\D/g, ''); // Remove formatação
        if (cleanCnpj.length !== 14) {
            toast.warn("CNPJ inválido. Por favor, preencha os 14 dígitos.");
            return;
        }

        const currentPathKey = pathPrefix.join('.');
        setSearchingCnpj(currentPathKey); // Ativa o ícone de "carregando"

        try {
            const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`);

            if (!response.ok) {
                const errorData = await response.json();
                toast.error(`Erro ao buscar CNPJ: ${errorData.message || 'Não encontrado.'}`);
                return;
            }

            const data = await response.json();
            console.log(data)

            // Mapeia os dados da API para a nossa interface IPessoaJuridica
            const novosDadosPJ: Partial<IPessoaJuridica> = {
                tipo: 'juridica',
                razaoSocial: data.razao_social,
                nomeFantasia: data.nome_fantasia,
                cnpj: data.cnpj,
                endereco: {
                    cep: data.cep || '',
                    uf: data.uf || '',
                    cidade: data.municipio || '',
                    bairro: data.bairro || '',
                    logradouro: data.logradouro || '',
                    numero: data.numero || '',
                    complemento: data.complemento || '',
                    tipoLogradouro: '' // A API não fornece este dado, então mantemos vazio
                },
                // Mapeia o array QSA (Quadro de Sócios e Administradores) da API
                qsa: data.qsa?.map((socio: any) => ({
                    nome: socio.nome_socio,
                    qualificacao: socio.qualificacao_socio,
                })) || [], // Se a API não retornar QSA, inicializa como um array vazio
            };

            // Usa a nossa função segura para atualizar o estado de forma imutável
            setFormData(prev => setNestedValue(prev, pathPrefix as string[], novosDadosPJ));

            toast.success(`Dados de "${data.razao_social}" preenchidos!`);

        } catch (error) {
            console.error("Falha na requisição do CNPJ:", error);
            toast.error("Não foi possível conectar à API de busca de CNPJ.");
        } finally {
            setSearchingCnpj(null); // Desativa o ícone de "carregando" ao final
        }
    };
    
    const handleDadosChange = (path: (string | number)[], novosDados: Partial<TPessoaTipo>) => {
        setFormData(prev => {
            const newState = { ...prev };
            let currentLevel: any = newState;
            for (let i = 0; i < path.length - 1; i++) {
                currentLevel = currentLevel[path[i]];
            }
            // Substitui o objeto inteiro (ex: 'declarante') pelos novos dados
            currentLevel[path[path.length - 1]] = novosDados;
            return newState;
        });
    };
    
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log("Formulário Salvo:", formData);
        toast.success('Rascunho salvo com sucesso!');
    };

    const handleCancel = () => {
        if (window.confirm("Você tem certeza que deseja cancelar? Todos os dados preenchidos serão perdidos.")) {
            setFormData(initialState);
            toast.info("Operação cancelada. O formulário foi resetado.");
        }
    };

    const handleLavrarAto = () => {
        if (formData.nascimento.semAssistenciaMedica && formData.testemunhas.length < 2) {
            toast.warn("É obrigatório o registro de no mínimo 2 testemunhas.");
            setActiveTab('partes');
            return;
        }
        if (window.confirm("Atenção: Lavrar o ato é uma ação definitiva. Deseja continuar?")) {
            toast.promise(
                new Promise(resolve => setTimeout(resolve, 1500)),
                { pending: 'Processando e lavrando o ato...', success: 'Ato lavrado com sucesso!', error: 'Ocorreu um erro ao lavrar o ato.' }
            );
            console.log("Lavrando o ato com os seguintes dados:", formData);
        }
    };

    const handleAddTestemunha = () => {
        setFormData(prev => ({ ...prev, testemunhas: [...prev.testemunhas, { ...initialPersonState }] }));
        toast.info("Um novo campo para testemunha foi adicionado.");
    };

    const handleRemoveTestemunha = (indexToRemove: number) => {
        setFormData(prev => ({ ...prev, testemunhas: prev.testemunhas.filter((_, index) => index !== indexToRemove) }));
        toast.success(`Testemunha ${indexToRemove + 1} removida.`);
    };
    const handleAddSocio = () => {
        setFormData(prev => {
            // Garante que o declarante é tratado como PJ
            const declarantePJ = prev.declarante as IPessoaJuridica;
            // Cria um novo sócio em branco
            const novoSocio = { nome: '', qualificacao: '' };
            // Cria um novo array de sócios, garantindo que o array original exista
            const qsaAtualizado = [...(declarantePJ.qsa || []), novoSocio];

            // Retorna um novo estado com o declarante atualizado
            return {
                ...prev,
                declarante: {
                    ...declarantePJ,
                    qsa: qsaAtualizado,
                }
            };
        });
        toast.info("Campo para sócio adicionado.");
    };
    const handleRemoveSocio = (indexToRemove: number) => {
        setFormData(prev => {
            const declarantePJ = prev.declarante as IPessoaJuridica;
            // Cria um novo array, filtrando para remover o item no índice desejado
            const qsaAtualizado = declarantePJ.qsa?.filter((_, index) => index !== indexToRemove) || [];

            return {
                ...prev,
                declarante: {
                    ...declarantePJ,
                    qsa: qsaAtualizado,
                }
            };
        });
        toast.warn("Sócio removido.");
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
                    for (let i = 0; i < pathPrefix.length; i++) { currentLevel = currentLevel[pathPrefix[i]]; }
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

    const handleGenerateCpf = () => {
        toast.info("Gerando novo CPF...");
        setTimeout(() => {
            const randomPart = () => Math.floor(100 + Math.random() * 900);
            const randomEnd = () => Math.floor(10 + Math.random() * 90);
            const fakeCpf = `${randomPart()}${randomPart()}${randomPart()}${randomEnd()}`.padStart(11, '0');

            const fakeEvent = {
                target: { name: 'registrando.cpf', value: fakeCpf }
            } as React.ChangeEvent<HTMLInputElement>;

            handleInputChange(fakeEvent);
            toast.success("Novo CPF gerado e preenchido!");
        }, 1000);
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

    // ALTERADO: Classe de input comum agora usa as cores da marca para o foco.
    const commonInputClass = "mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]";
    const commonLabelClass = "block text-sm font-medium text-gray-700";
    const requiredSpan = <span className="text-red-500">*</span>;

    const isControlReadOnly = !formData.dadosAto.isLivroAntigo;
    const controlInputClass = `${commonInputClass} ${isControlReadOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`;
    const SectionTitle = ({ children }: { children: React.ReactNode }) => <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">{children}</h3>;
    const SubSectionTitle = ({ children }: { children: React.ReactNode }) => <h4 className="font-bold text-gray-600 mb-3 mt-4">{children}</h4>;



    return (
        <>
            <title>Registrar Nascimento</title>
            <div className="flex bg-gray-50 min-h-screen font-sans">
                <main className="flex-1 p-0">
                    <div className="mx-auto">
                        <header className="mb-6 flex justify-between items-center">
                            <div>
                                {/* ALTERADO: Cor do título principal para o cinza escuro da marca. */}
                                <h1 className="text-3xl font-bold text-[#4a4e51]">Registrar Novo Ato de Nascimento</h1>
                                <p className="text-md text-gray-500 mt-1">Preencha os dados abaixo para criar um novo ato.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsHistoryModalOpen(true)}
                                // ALTERADO: Cor do anel de foco do botão secundário.
                                className="flex items-center gap-2 bg-white text-gray-600 font-semibold px-4 py-2 rounded-lg border border-gray-300 shadow-sm hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dd6825]"
                            >
                                <History className="h-5 w-5" />
                                Ver Histórico
                            </button>
                        </header>

                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                                {tabs.map(tab => (
                                    // ALTERADO: Cor da aba ativa para o laranja da marca.
                                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`${activeTab === tab.id ? 'border-[#dd6825] text-[#dd6825]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}>
                                        <tab.icon className="h-5 w-5" /> {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-6">
                            <div className="tab-content">
                                {activeTab === 'controle' && (
                                    <fieldset><legend className="sr-only">Dados de Controle</legend><div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                        {/* ALTERADO: Cor do checkbox. */}
                                        <div className="flex items-center mb-5"><input type="checkbox" name="dadosAto.isLivroAntigo" id="dadosAto.isLivroAntigo" className="form-checkbox h-5 w-5 text-[#dd6825] rounded" checked={formData.dadosAto.isLivroAntigo} onChange={handleInputChange} /><label htmlFor="dadosAto.isLivroAntigo" className="ml-3 font-medium text-gray-700">Transcrição de livro antigo?</label></div>
                                        <div className="pt-5 ">
                                            <h4 className="font-semibold text-gray-600 mb-3">Dados do Registro</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                                <div><label htmlFor="dadosAto.dataRegistro" className={commonLabelClass}>Data do Registro {isControlReadOnly ? null : requiredSpan}</label><input type="date" name="dadosAto.dataRegistro" id="dadosAto.dataRegistro" className={controlInputClass} value={formData.dadosAto.dataRegistro} onChange={handleInputChange} readOnly={isControlReadOnly} /></div>
                                                <div><label htmlFor="dadosAto.protocolo" className={commonLabelClass}>Nº do Protocolo {isControlReadOnly ? null : requiredSpan}</label><input type="text" name="dadosAto.protocolo" id="dadosAto.protocolo" className={controlInputClass} value={formData.dadosAto.protocolo} onChange={handleInputChange} readOnly={isControlReadOnly} placeholder={isControlReadOnly ? 'Automático' : ''} /></div>
                                            </div>
                                        </div>
                                        <div className="mt-6 pt-6 ">
                                            <h4 className="font-semibold text-gray-600 mb-3">Dados da Lavratura</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-5">
                                                <div><label htmlFor="dadosAto.dataLavratura" className={commonLabelClass}>Data da Lavratura {isControlReadOnly ? null : requiredSpan}</label><input type="date" name="dadosAto.dataLavratura" id="dadosAto.dataLavratura" className={controlInputClass} value={formData.dadosAto.dataLavratura} onChange={handleInputChange} readOnly={isControlReadOnly} /></div>
                                                <div><label htmlFor="dadosAto.livro" className={commonLabelClass}>Livro {isControlReadOnly ? null : requiredSpan}</label><select name="dadosAto.livro" id="dadosAto.livro" className={controlInputClass} value={formData.dadosAto.livro} onChange={handleInputChange} disabled={isControlReadOnly}><option value="">{isControlReadOnly ? 'Automático' : 'Selecione...'}</option>{livrosDisponiveis.map(livro => <option key={livro} value={livro}>{livro}</option>)}</select></div>
                                                <div><label htmlFor="dadosAto.folha" className={commonLabelClass}>Folha {isControlReadOnly ? null : requiredSpan}</label><input type="text" name="dadosAto.folha" id="dadosAto.folha" className={controlInputClass} value={formData.dadosAto.folha} onChange={handleInputChange} readOnly={isControlReadOnly} placeholder={isControlReadOnly ? 'Automático' : ''} /></div>
                                                <div><label htmlFor="dadosAto.numeroTermo" className={commonLabelClass}>Nº do Termo {isControlReadOnly ? null : requiredSpan}</label><input type="text" name="dadosAto.numeroTermo" id="dadosAto.numeroTermo" className={controlInputClass} value={formData.dadosAto.numeroTermo} onChange={handleInputChange} readOnly={isControlReadOnly} placeholder={isControlReadOnly ? 'Automático' : ''} /></div>
                                            </div>
                                        </div>
                                        {/* ALTERADO: Cor do botão de ação principal "Lavrar Ato". */}
                                        <div className="mt-6 pt-6 flex justify-end"><button type="button" onClick={handleLavrarAto} className="flex items-center gap-2 bg-[#dd6825] text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-[#c25a1f] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dd6825]"><Award className="h-5 w-5" />Lavrar Ato</button></div>
                                    </div></fieldset>
                                )}
                                {activeTab === 'nascido' && (
                                    <fieldset><legend className="sr-only">Dados do Nascido</legend><div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-5">
                                            <div className="col-span-1 md:col-span-2"><label htmlFor="nascimento.dnv" className={commonLabelClass}>Nº da DNV {requiredSpan}</label><input type="text" name="nascimento.dnv" id="nascimento.dnv" className={commonInputClass} value={formData.nascimento.dnv} onChange={handleInputChange} /></div>
                                            <div className="col-span-1 md:col-span-2"></div>
                                            <div className="col-span-1 md:col-span-2"><label htmlFor="registrando.prenome" className={commonLabelClass}>Prenome {requiredSpan}</label><input type="text" name="registrando.prenome" id="registrando.prenome" className={commonInputClass} value={formData.registrando.prenome} onChange={handleInputChange} /></div>
                                            <div className="col-span-1 md:col-span-2"><label htmlFor="registrando.sobrenome" className={commonLabelClass}>Sobrenome</label><input type="text" name="registrando.sobrenome" id="registrando.sobrenome" className={commonInputClass} value={formData.registrando.sobrenome} onChange={handleInputChange} /></div>
                                            <div className="col-span-1"><label htmlFor="nascimento.dataNascimento" className={commonLabelClass}>Data de Nascimento {requiredSpan}</label><input type="date" name="nascimento.dataNascimento" id="nascimento.dataNascimento" className={commonInputClass} value={formData.nascimento.dataNascimento} onChange={handleInputChange} /></div>
                                            <div className="col-span-1"><label htmlFor="nascimento.horaNascimento" className={commonLabelClass}>Hora (opcional)</label><input type="time" name="nascimento.horaNascimento" id="nascimento.horaNascimento" className={commonInputClass} value={formData.nascimento.horaNascimento} onChange={handleInputChange} /></div>
                                            <div className="col-span-1"><label htmlFor="registrando.sexo" className={commonLabelClass}>Sexo</label><select name="registrando.sexo" id="registrando.sexo" className={commonInputClass} value={formData.registrando.sexo} onChange={handleInputChange}><option value="" disabled>Selecione...</option><option value="Masculino">Masculino</option><option value="Feminino">Feminino</option></select></div>
                                            <div className="col-span-1">
                                                <label htmlFor="registrando.cpf" className={commonLabelClass}>CPF {requiredSpan}</label>
                                                <div className="flex"><IMaskInput mask="000.000.000-00" name="registrando.cpf" id="registrando.cpf" value={formData.registrando.cpf} onAccept={(value) => handleInputChange({ target: { name: 'registrando.cpf', value } } as any)} className={commonInputClass} placeholder="000.000.000-00" />
                                                    {/* ALTERADO: Cor do ícone do botão de gerar CPF. */}
                                                    <button type="button" onClick={handleGenerateCpf} title="Gerar CPF para o nascido" className="ml-2 mt-1 px-3 bg-gray-200 hover:bg-gray-300 rounded-md flex items-center justify-center transition-colors"><Sparkles className="h-5 w-5 text-[#dd6825]" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="col-span-1 md:col-span-2"><label htmlFor="nascimento.localNascimento" className={commonLabelClass}>Local do Nascimento</label><input type="text" name="nascimento.localNascimento" id="nascimento.localNascimento" placeholder="Hospital, Casa, etc. e Cidade - UF" className={commonInputClass} value={formData.nascimento.localNascimento} onChange={handleInputChange} /></div>
                                            <div className="col-span-1 md:col-span-2"><label htmlFor="registrando.naturalidade" className={commonLabelClass}>Naturalidade do Registrando</label><select name="registrando.naturalidade" id="registrando.naturalidade" className={commonInputClass} value={formData.registrando.naturalidade} onChange={handleInputChange}><option value="" disabled>Selecione...</option><option value="Local do Parto">Município do Local do Parto</option><option value="Residência da Mãe">Município de Residência da Mãe</option></select></div>
                                            {/* ALTERADO: Cor dos checkboxes. */}
                                            <div className="md:col-span-4 flex gap-8 mt-2 pt-4 "><label className="flex items-center gap-2"><input type="checkbox" name="nascimento.isGemeo" className="form-checkbox h-4 w-4 text-[#dd6825]" checked={formData.nascimento.isGemeo} onChange={handleInputChange} /> Parto múltiplo (gêmeos)</label><label className="flex items-center gap-2"><input type="checkbox" name="nascimento.semAssistenciaMedica" className="form-checkbox h-4 w-4 text-[#dd6825]" checked={formData.nascimento.semAssistenciaMedica} onChange={handleInputChange} /> Nascimento sem assistência médica</label></div>
                                        </div>
                                    </div></fieldset>
                                )}
                                {activeTab === 'filiacao' && (
                                    <fieldset><legend className="sr-only">Filiação</legend><div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-10">
                                        <div><h4 className="font-bold text-black mb-4">Dados da Mãe</h4>
                                            <PersonFields
                                                personData={formData.filiacao.mae}
                                                pathPrefix={['filiacao', 'mae']}
                                                searchingCpf={searchingCpf}
                                                handleInputChange={handleInputChange}
                                                handleAddressUpdate={handleAddressUpdate}
                                                handleCpfSearch={handleCpfSearch}
                                            />
                                        </div>
                                        <div><h4 className="font-bold text-black mb-4">Dados do Pai</h4>
                                            <PersonFields
                                                personData={formData.filiacao.pai}
                                                pathPrefix={['filiacao', 'pai']}
                                                searchingCpf={searchingCpf}
                                                handleInputChange={handleInputChange}
                                                handleAddressUpdate={handleAddressUpdate}
                                                handleCpfSearch={handleCpfSearch}
                                            />
                                        </div>
                                    </div></fieldset>
                                )}
                                {activeTab === 'partes' && (
                                    <div className="space-y-6">
                                        <fieldset><legend className="sr-only">Dados do Declarante</legend><div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Dados do Declarante</h3>
                                            <SeletorDePessoa
                                                dados={formData.declarante}
                                                pathPrefix={['declarante']}
                                                handleInputChange={handleInputChange}
                                                handleAddressUpdate={handleAddressUpdate}
                                                handleCpfSearch={handleCpfSearch}
                                                handleCnpjSearch={handleCnpjSearch}
                                                searchingCpf={searchingCpf}
                                                searchingCnpj={searchingCnpj}
                                                onDadosChange={(novosDados) => handleDadosChange(['declarante'], novosDados)}
                                                onAddSocio={handleAddSocio}
                                                onRemoveSocio={handleRemoveSocio}
                                            />
                                        </div></fieldset>
                                        {formData.nascimento.semAssistenciaMedica && (
                                            <fieldset><legend className="sr-only">Testemunhas</legend><div className="bg-white p-6 rounded-xl border border-red-200 shadow-sm">
                                                <h3 className="text-xl font-semibold text-red-800 mb-4">Testemunhas (Mínimo de 2 Obrigatórias)</h3>
                                                <div className="space-y-10">
                                                    {formData.testemunhas.map((witness, index) => (
                                                        <div key={index} className="first:border-t-0 pt-6 first:pt-0">
                                                            <div className="flex justify-between items-center mb-4">
                                                                <h4 className="font-semibold text-gray-700">Dados da {index + 1}ª Testemunha</h4>{index >= 2 && (
                                                                    <button type="button" onClick={() => handleRemoveTestemunha(index)} className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800 font-semibold"><Trash2 className="h-4 w-4" />Remover</button>)}</div>
                                                            <PersonFields
                                                                personData={witness}
                                                                pathPrefix={['testemunhas', index]}
                                                                searchingCpf={searchingCpf}
                                                                handleInputChange={handleInputChange}
                                                                handleAddressUpdate={handleAddressUpdate}
                                                                handleCpfSearch={handleCpfSearch}
                                                            />
                                                        </div>
                                                    ))}
                                                    <div className="mt-6 flex justify-start pt-6 "><button type="button" onClick={handleAddTestemunha} className="flex items-center gap-2 bg-gray-100 text-gray-800 font-semibold px-4 py-2 rounded-lg shadow-sm border border-gray-300 hover:bg-gray-200 transition-colors"><PlusCircle className="h-5 w-5" />Adicionar Testemunha</button></div>
                                                </div>
                                            </div></fieldset>
                                        )}
                                    </div>
                                )}
                                {activeTab === 'anexos' && (
                                    <fieldset className="space-y-8">
                                        <SectionTitle>Documentação e Anexos</SectionTitle>
                                        <div>
                                            <SubSectionTitle>Documentos Apresentados e Anexos Digitais</SubSectionTitle>
                                            <p className="text-sm text-gray-500 mb-6">Liste os documentos apresentados e anexe a cópia digital de cada um.</p>

                                            <div className="space-y-4">
                                                {formData.documentosApresentados.map((doc, index) => (
                                                    <div key={index} className="flex flex-col md:flex-row items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-300">
                                                        <div className="flex-grow w-full">
                                                            <label htmlFor={`doc-desc-${index}`} className={commonLabelClass}>
                                                                Descrição do Documento
                                                            </label>
                                                            <input
                                                                id={`doc-desc-${index}`}
                                                                name={`documentosApresentados.${index}.descricao`}
                                                                value={doc.descricao}
                                                                onChange={handleInputChange}
                                                                className={commonInputClass}
                                                                placeholder="Ex: Certidão de Nascimento, Pacto Antenupcial..."
                                                            />
                                                        </div>

                                                        <div className="w-full md:w-auto">
                                                            <label htmlFor={`doc-file-${index}`} className={commonLabelClass}>
                                                                Anexo Digital
                                                            </label>
                                                             {/* ALTERADO: Cor do botão de upload. */}
                                                            <label htmlFor={`doc-file-${index}`} className="mt-1 cursor-pointer flex items-center justify-center gap-2 w-full md:w-56 px-4 py-2 bg-white text-[#dd6825] border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 transition">
                                                                <UploadCloud size={18} />
                                                                <span>{doc.nomeArquivo ? 'Trocar Arquivo' : 'Escolher Arquivo'}</span>
                                                            </label>
                                                            <input
                                                                id={`doc-file-${index}`}
                                                                type="file"
                                                                className="sr-only"
                                                                onChange={(e) => handleFileChange(['documentosApresentados', index, 'arquivo'], e.target.files?.[0] || null)}
                                                            />
                                                            {doc.nomeArquivo && (
                                                                <p className="text-xs text-green-700 mt-1 truncate w-full md:w-56" title={doc.nomeArquivo}>
                                                                    Arquivo: {doc.nomeArquivo}
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div className="w-full md:w-auto flex justify-end md:self-end">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveDocumento(index)}
                                                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"
                                                            >
                                                                <Trash2 size={20} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            
                                            {/* ALTERADO: Cor do link "Adicionar Documento". */}
                                            <button
                                                type="button"
                                                onClick={handleAddDocumento}
                                                className="mt-6 flex items-center gap-2 text-ml font-medium text-[#dd6825] hover:text-[#c25a1f]"
                                            >
                                                <PlusCircle size={20} /> Adicionar Documento
                                            </button>
                                        </div>
                                    </fieldset>
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
        </>
    );
}