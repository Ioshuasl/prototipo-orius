import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import {
    Skull, Users, Briefcase, FileText, BookKey, Save, XCircle, History, AlertTriangle, HelpCircle,
} from 'lucide-react'

// --- Importações e Estados Iniciais (Lógica inalterada) ---
import { type IObitoFormData, type IPessoaFisica, type IEndereco, type IPessoaJuridica, type TPessoaTipo } from '../../types'
import { livrosDisponiveis, ufs, mockPessoDatabase } from '../../lib/Constants'
import HistoricoModal from '../../Components/HistoricoModal';
import InfoModal from '../../../Components/InfoModal'
import TabControle from './tabs/TabControle'
import TabFalecidoFamilia from './tabs/TabFalecidoFamilia'
import TabBens from './tabs/TabBens'
import TabDocumentos from './tabs/TabDocumentos'
import TabFalecimento from './tabs/TabFalecimento'

const todayString = new Date().toISOString().split('T')[0]
const initialAddressState: IEndereco = { cep: '', tipoLogradouro: '', logradouro: '', numero: '', complemento: '', bairro: '', cidade: '', uf: '' }
const initialPersonState: IPessoaFisica = { tipo: 'fisica', nome: '', cpf: '', dataNascimento: '', docIdentidadeTipo: 'RG', docIdentidadeNum: '', profissao: '', nacionalidade: 'Brasileira', naturalidadeCidade: '', naturalidadeUF: '', endereco: { ...initialAddressState }, sexo: 'Masculino', cor: 'Parda', estadoCivil: 'Solteiro(a)' }

const initialState: IObitoFormData = {
    dadosAto: {
        isLivroAntigo: false, dataRegistro: todayString, protocolo: '', dataLavratura: '', livro: '', folha: '', numeroTermo: '',
    },
    naturezaRegistro: 'Comum',
    processoJudicial: { numero: '', varaComarca: '', dataSentenca: '', juiz: '' },
    justificativaRegistroTardio: '',
    falecimento: {
        dataFalecimento: todayString, horaFalecimento: '', localOcorrencia: 'Hospital', enderecoOcorrencia: { ...initialAddressState }, descricaoOutroLocal: '',
        destinacaoCorpo: 'Sepultamento',
        localDestinacao: '',
        isAposSepultamento: false,
        fonteDeclaracao: 'Atestado Médico',
        tipoMorte: 'Natural', causaMorte: '', atestante1: '', atestante2: '',
        autorizacaoCremacao: { tipo: 'NaoAplicavel', autorizacaoJudicial: '' },
    },
    falecido: {
        ...initialPersonState, eraEleitor: false, idade: '',
        documentos: { numeroDO: '', eraBeneficiarioInss: false },
        nascimentoVerificado: { status: 'NaoVerificado' },
    },
    familia: { pai: {}, mae: {}, eraCasado: false, conjugeNome: '', eraViuvo: false, cartorioCasamento: '', deixouFilhos: false, filhos: [] },
    bens: { deixouBens: false, existemHerdeirosMenores: false, deixouTestamento: false, deixouPensionistas: false, infoTestamento: '' },
    declarante: {
        ...initialPersonState, relacaoComFalecido: '',
        isAutoridade: false,
        tipoAutoridade: '',
        dadosAutoridade: { nome: '', cargo: '', lotacao: '', cnpj: '' }
    },
    documentosApresentados: [{ descricao: 'Declaração de Óbito (DO)', arquivo: null, nomeArquivo: '' }],
    historico: [
        { data: '2025-07-04T15:01:10Z', evento: 'Emitida 2ª via da Certidão de Casamento.', usuario: 'escrevente.2' },
        { data: '2025-01-10T11:45:00Z', evento: 'Ato de casamento lavrado e registrado no Livro B-101, Folha 15, Termo 5890.', usuario: 'oficial.master' },
    ]
}

const regrasDeNegocio = {
    // ... (Regras de negócio inalteradas)
    naturezaRegistro: {
        title: 'Regra: Natureza do Registro',
        content: (
            <>
                <p className="mb-4">A natureza do registro define como o ato de óbito deve ser lavrado, especialmente em casos que fogem ao padrão de um corpo presente com atestado médico.</p>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>Óbito Comum:</strong> Procedimento padrão para falecimento com corpo e atestado de óbito (DO) ou declaração de testemunhas.</li>
                    <li><strong>Morte Presumida:</strong> Aplicável a pessoas ausentes há muito tempo. O registro só pode ser feito mediante uma <strong>sentença judicial</strong> que declara a morte.</li>
                    <li><strong>Desaparecimento em Catástrofe:</strong> Para vítimas de desastres (naufrágio, incêndio, enchente) cujo corpo não foi localizado. O registro depende de um <strong>mandado judicial</strong> após justificação.</li>
                </ul>
            </>
        )
    },
    registroTardio: {
        title: 'Regra: Registro Tardio de Óbito',
        content: (
            <>
                <p className="mb-4">O prazo legal para registro de óbito é de <strong>24 horas</strong> após o falecimento. O Código de Normas prevê exceções:</p>
                <ul className="list-disc list-inside space-y-2">
                    <li>O prazo pode ser estendido para até <strong>15 dias</strong> para a generalidade dos casos.</li>
                    <li>Em locais distantes mais de 30 quilômetros da sede da serventia, o prazo pode ser estendido para até <strong>3 meses</strong>.</li>
                    <li>O registro após o sepultamento exige a assinatura do declarante e de duas testemunhas do funeral.</li>
                </ul>
                <p className="mt-4 font-semibold">É fundamental que qualquer registro fora do prazo de 24 horas seja devidamente justificado.</p>
            </>
        )
    },
    fonteDeclaracao: {
        title: 'Regra: Fonte da Declaração de Óbito',
        content: (
            <>
                <p className="mb-4">A base para o registro do óbito pode variar conforme a situação do falecimento:</p>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>Atestado Médico (DO):</strong> É o documento padrão, emitido por um médico. Preencha o campo "Nº da Declaração de Óbito (DO)" com o número deste documento.</li>
                    <li><strong>Declaração de Testemunhas:</strong> Ocorre quando a morte se deu <strong>sem assistência médica</strong>. Neste caso, o atestado é substituído pela declaração de duas pessoas qualificadas que presenciaram ou verificaram o óbito. Ambos os campos de testemunha se tornam obrigatórios.</li>
                </ul>
            </>
        )
    },
    cremacao: {
        title: 'Regra: Cremação de Cadáver',
        content: (
            <>
                <p className="mb-4">A cremação possui regras específicas para ser autorizada:</p>
                <ul className="list-disc list-inside space-y-2">
                    <li>A vontade deve ter sido manifestada em vida pelo falecido, através de um documento público ou particular com firma reconhecida.</li>
                    <li>Na ausência de tal documento, a autorização pode ser dada pela família (cônjuge, ascendentes, descendentes e irmãos maiores de idade), com firma reconhecida.</li>
                    <li className="font-bold">Em caso de Morte Violenta: A cremação só será possível com autorização judicial prévia.</li>
                </ul>
            </>
        )
    },
    menorNaoRegistrado: {
        title: 'Regra: Óbito de Menor de 1 Ano Não Registrado',
        content: (
            <p>
                A lei determina que, antes de se lavrar o assento de óbito de criança com menos de 1 (um) ano, o oficial de registro deve verificar se o nascimento já foi registrado.
                <br /><br />
                Caso o nascimento não tenha sido registrado, <strong>ele deverá ser feito previamente ao registro de óbito.</strong> Este procedimento visa garantir o direito ao nome e à existência civil da criança, mesmo que falecida.
            </p>
        )
    }
}


const tabs = [
    { id: 'controle', label: 'Controle do Ato', icon: BookKey },
    { id: 'falecimento', label: 'Falecimento e Declarante', icon: Skull },
    { id: 'falecidoFamilia', label: 'Falecido e Família', icon: Users },
    { id: 'bens', label: 'Bens e Situações', icon: Briefcase },
    { id: 'documentos', label: 'Documentos e Anexos', icon: FileText },
]

const setNestedValue = (obj: any, path: (string | number)[], value: any): any => {
    // ... (lógica inalterada)
    const key = path[0];
    if (path.length === 1) { return { ...obj, [key]: value }; }
    const nextObj = (obj && typeof obj[key] === 'object' && obj[key] !== null) ? obj[key] : (typeof path[1] === 'number' ? [] : {});
    return { ...obj, [key]: setNestedValue(nextObj, path.slice(1), value) };
};


export default function AtoObitoForm() {
    // --- Lógica de estado e Handlers (inalterada) ---
    const [formData, setFormData] = useState<IObitoFormData>(initialState)
    const [activeTab, setActiveTab] = useState(tabs[0].id)
    const { dadosAto, falecimento, falecido } = formData;
    const isControlReadOnly = !dadosAto.isLivroAntigo;
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [searchingCpf, setSearchingCpf] = useState<string | null>(null);
    const [searchingCnpj, setSearchingCnpj] = useState<string | null>(null);
    const [isRegistroTardio, setIsRegistroTardio] = useState(false);
    const [isMenorDeUmAno, setIsMenorDeUmAno] = useState(false);
    const [modalState, setModalState] = useState({ isOpen: false, title: '', content: null as React.ReactNode });

    useEffect(() => {
        if (dadosAto.dataRegistro && falecimento.dataFalecimento) {
            const dataReg = new Date(dadosAto.dataRegistro);
            const dataFal = new Date(falecimento.dataFalecimento);
            const diffTime = dataReg.getTime() - dataFal.getTime();
            const diffDays = diffTime / (1000 * 3600 * 24);
            setIsRegistroTardio(diffDays > 15);
        }
        if (falecido.dataNascimento) {
            const dataNasc = new Date(falecido.dataNascimento);
            const hoje = new Date();
            if (dataNasc > hoje) {
                setIsMenorDeUmAno(false);
                return;
            }
            const idadeMs = hoje.getTime() - dataNasc.getTime();
            const idadeAnos = idadeMs / (1000 * 60 * 60 * 24 * 365.25);
            setIsMenorDeUmAno(idadeAnos < 1 && idadeAnos >= 0);
        } else {
            setIsMenorDeUmAno(false);
        }
    }, [dadosAto.dataRegistro, falecimento.dataFalecimento, falecido.dataNascimento]);

    const openInfoModal = (ruleKey: keyof typeof regrasDeNegocio) => {
        const { title, content } = regrasDeNegocio[ruleKey];
        setModalState({ isOpen: true, title, content });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        let finalValue = type === 'checkbox' ? checked : value;
        if (type === 'radio' && (value === 'true' || value === 'false')) {
            finalValue = value === 'true';
        }
        const keys = name.split('.');
        setFormData(prev => {
            const newState = JSON.parse(JSON.stringify(prev));
            let currentLevel: any = newState;
            for (let i = 0; i < keys.length - 1; i++) {
                if (!currentLevel[keys[i]]) currentLevel[keys[i]] = {};
                currentLevel = currentLevel[keys[i]];
            }
            currentLevel[keys[keys.length - 1]] = finalValue;
            if (name === 'bens.deixouTestamento' && !finalValue) {
                newState.bens.infoTestamento = '';
            }
            if (name === 'familia.eraCasado' && !finalValue) {
                newState.familia.conjugeNome = '';
                newState.familia.eraViuvo = false;
                newState.familia.cartorioCasamento = '';
            }
            if (name === 'familia.deixouFilhos' && !finalValue) {
                newState.familia.filhos = [];
            }
            if (name === 'falecimento.destinacaoCorpo' && finalValue !== 'Cremacao') {
                newState.falecimento.autorizacaoCremacao = { tipo: 'NaoAplicavel', autorizacaoJudicial: '' };
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
    const handleAddSocio = () => {
        setFormData(prev => {
            const declaranteAtual = prev.declarante as IPessoaJuridica & typeof prev.declarante;
            const qsaAtualizado = [...(declaranteAtual.qsa || []), { nome: '', qualificacao: '' }];
            return { ...prev, declarante: { ...declaranteAtual, qsa: qsaAtualizado } };
        });
        toast.info("Campo para sócio adicionado.");
    };

    const handleRemoveSocio = (indexToRemove: number) => {
        setFormData(prev => {
            const declaranteAtual = prev.declarante as IPessoaJuridica & typeof prev.declarante;
            const qsaAtualizado = declaranteAtual.qsa?.filter((_, i) => i !== indexToRemove) || [];
            return { ...prev, declarante: { ...declaranteAtual, qsa: qsaAtualizado } };
        });
        toast.warn("Sócio removido.");
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

    const handleAddressUpdate = (path: (string | number)[], addressData: Partial<IEndereco>) => {
        setFormData(prev => {
            const newState = JSON.parse(JSON.stringify(prev));
            let currentPersonLevel: any = newState;
            for (let i = 0; i < path.length; i++) {
                currentPersonLevel = currentPersonLevel[path[i]];
            }
            currentPersonLevel.endereco = { ...currentPersonLevel.endereco, ...addressData };
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

    const handleAddFilho = () => {
        setFormData(prev => ({ ...prev, familia: { ...prev.familia, filhos: [...prev.familia.filhos, { nome: '', idade: '' }] } }));
        toast.info("Campo para filho(a) adicionado.");
    };

    const handleRemoveFilho = (indexToRemove: number) => {
        setFormData(prev => ({ ...prev, familia: { ...prev.familia, filhos: prev.familia.filhos.filter((_, i) => i !== indexToRemove) } }));
        toast.warn("Filho(a) removido.");
    };

    const handleAddDocumento = () => {
        setFormData(prev => ({ ...prev, documentosApresentados: [...prev.documentosApresentados, { descricao: '', arquivo: null, nomeArquivo: '' }] }));
        toast.info("Campo para documento adicionado.");
    };

    const handleRemoveDocumento = (indexToRemove: number) => {
        setFormData(prev => ({ ...prev, documentosApresentados: prev.documentosApresentados.filter((_, index) => index !== indexToRemove) }));
        toast.warn("Documento removido.");
    };
    
    const handleLavrarAto = () => {
        if (window.confirm("Atenção: Lavrar o ato de óbito é uma ação definitiva que gerará um registro oficial. Deseja continuar?")) {
            toast.promise(
                new Promise(resolve => setTimeout(() => {
                    console.log("Ato de Óbito Lavrado:", formData);
                    resolve(true);
                }, 1500)),
                { pending: 'Processando e lavrando o ato de óbito...', success: 'Ato de óbito lavrado com sucesso!', error: 'Ocorreu um erro ao lavrar o ato.' }
            );
        }
    };

    // --- Componentes e Classes de Estilo Reutilizáveis ---
    const SectionTitle = ({ children }: { children: React.ReactNode }) => <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-3 border-b border-gray-200">{children}</h3>;
    const SubSectionTitle = ({ children }: { children: React.ReactNode }) => <h4 className="font-bold text-gray-700 mb-4 mt-6">{children}</h4>;
    
    // ALTERADO: Estilo do InfoBox para usar as cores da marca.
    const InfoBox = ({ type = 'info', children }: { type?: 'info' | 'warning', children: React.ReactNode }) => {
        const baseClasses = "p-4 my-4 rounded-md flex items-start gap-3";
        const typeClasses = { 
            info: "bg-[#dd6825]/10 border border-[#dd6825]/30 text-[#c25a1f]", 
            warning: "bg-yellow-50 border border-yellow-300 text-yellow-800" 
        };
        const Icon = type === 'info' ? AlertTriangle : AlertTriangle;
        return <div className={`${baseClasses} ${typeClasses[type]}`}><Icon size={20} className="flex-shrink-0 mt-0.5" /><div>{children}</div></div>;
    };
    
    // ALTERADO: Cor do hover do HelpButton.
    const HelpButton = ({ onClick }: { onClick: () => void }) => <button type="button" onClick={onClick} className="ml-2 text-gray-400 hover:text-[#dd6825] transition-colors"><HelpCircle size={16} /></button>;
    
    // ALTERADO: Cor do foco nos inputs.
    const commonInputClass = "mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]";
    const commonLabelClass = "block text-sm font-medium text-gray-700";
    const requiredSpan = <span className="text-red-500">*</span>;

    const commonUiProps = { SectionTitle, SubSectionTitle, InfoBox, HelpButton, commonInputClass, commonLabelClass, requiredSpan };


    return (
        <>
            <title>Registrar Óbito | Orius Tecnologia</title>
            <div className="flex bg-gray-50 min-h-screen font-sans">
                <main className="flex-1 p-0">
                    <div className="mx-auto">
                        <header className="mb-6 flex justify-between items-center">
                            <div>
                                {/* ALTERADO: Cor do título principal. */}
                                <h1 className="text-3xl font-bold text-[#4a4e51]">Registrar Novo Ato de Óbito</h1>
                                <p className="text-md text-gray-500 mt-1">Preencha os dados abaixo para lavrar o ato.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsHistoryModalOpen(true)}
                                // ALTERADO: Cor do foco do botão.
                                className="flex items-center gap-2 bg-white text-gray-600 font-semibold px-4 py-2 rounded-lg border border-gray-300 shadow-sm hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dd6825]"
                            >
                                <History className="h-5 w-5" />
                                Ver Histórico
                            </button>
                        </header>

                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
                                {tabs.map(tab => (
                                    // ALTERADO: Cor da aba ativa.
                                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`${activeTab === tab.id ? 'border-[#dd6825] text-[#dd6825]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}>
                                        <tab.icon className="h-5 w-5" /> {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <form noValidate className="mt-6 space-y-6">
                            <div className="tab-content bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[500px]">
                                {activeTab === 'controle' && <TabControle formData={formData} isControlReadOnly={isControlReadOnly} isRegistroTardio={isRegistroTardio} handleInputChange={handleInputChange} handleLavrarAto={handleLavrarAto} openInfoModal={openInfoModal} livrosDisponiveis={livrosDisponiveis} {...commonUiProps} />}
                                {activeTab === 'falecimento' && <TabFalecimento formData={formData} searchingCpf={searchingCpf} searchingCnpj={searchingCnpj} handleInputChange={handleInputChange} handleCpfSearch={handleCpfSearch} handleCnpjSearch={handleCnpjSearch} handleAddressUpdate={handleAddressUpdate} onDadosChange={handleDadosChange} onAddSocio={handleAddSocio} onRemoveSocio={handleRemoveSocio} openInfoModal={openInfoModal} {...commonUiProps} />}
                                {activeTab === 'falecidoFamilia' && <TabFalecidoFamilia formData={formData} isMenorDeUmAno={isMenorDeUmAno} searchingCpf={searchingCpf} handleInputChange={handleInputChange} handleCpfSearch={handleCpfSearch} handleAddressUpdate={handleAddressUpdate} handleAddFilho={handleAddFilho} handleRemoveFilho={handleRemoveFilho} openInfoModal={openInfoModal} ufs={ufs} {...commonUiProps} />}
                                {activeTab === 'bens' && <TabBens formData={formData} handleInputChange={handleInputChange} {...commonUiProps} />}
                                {activeTab === 'documentos' && <TabDocumentos formData={formData} handleInputChange={handleInputChange} handleFileChange={handleFileChange} handleAddDocumento={handleAddDocumento} handleRemoveDocumento={handleRemoveDocumento} {...commonUiProps} />}
                            </div>

                            <div className="flex justify-end pt-6 mt-8 gap-4">
                                {/* ALTERADO: Cores dos botões de rodapé para padrão (vermelho/verde). */}
                                <button type="button" onClick={() => setFormData(initialState)} className="flex items-center gap-2 bg-red-600 text-white font-semibold px-6 py-3 rounded-lg shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"><XCircle className="h-5 w-5" /> Cancelar</button>
                                <button type="submit" className="flex items-center gap-2 bg-green-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"><Save className="h-5 w-5" /> Salvar Rascunho</button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>

            <InfoModal
                isOpen={modalState.isOpen}
                onClose={() => setModalState({ isOpen: false, title: '', content: null })}
                title={modalState.title}
            >
                {modalState.content}
            </InfoModal>

            <HistoricoModal
                isOpen={isHistoryModalOpen}
                onClose={() => setIsHistoryModalOpen(false)}
                historico={formData.historico}
            />
        </>
    )
}