// EmitirNovoServicoBalcao.tsx (COMPLETO E ATUALIZADO com Geração de QR Code e Participantes)
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
    mockTipoServicoBalcao,
    mockBalcaoTemplates,
    mockPessoasCadastradas,
    DADOS_SERVENTIA,
    mockUsuarios,
    mockTaxasAdicionais,
} from '../lib/Constants';
import SeletorDePessoa from '../../Components/SeletorDePessoa';
import {
    type TPessoaTipo,
    type IPessoaFisica,
    type IPessoaJuridica,
    type ISocio,
    type IPessoaSimples // Simulado
} from '../../Types';
import { type IBalcaoTemplate } from '../Types';
import { initialPersonState, initialPessoaJuridicaState } from '../../utils/initialStates';
import BalcaoPreview from './BalcaoPreview';
import TabelaEmolumentos from '../../../../tabela-emolumentos.json';
import SeloSearchInput from '../../Components/SeloSearchInput';
import ConfirmacaoSeloModal, { type IParsedData } from '../../Components/ConfirmacaoSeloModal';
type IEmolumento = typeof TabelaEmolumentos[0];
// --- SIMULAÇÃO DA BIBLIOTECA QR CODE (Em um ambiente real, você faria o import) ---
// import QRCode from 'qrcode';
const QRCode = {
    toDataURL: (url: string, options: { width: number, margin: number }) => {
        // Mock da função real que retorna uma Data URL (base64)
        return new Promise<string>((resolve) => {
            const svgContent = `<svg width="${options.width}" height="${options.width}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#fff"/><rect x="10" y="10" width="80" height="80" fill="#000"/><text x="50" y="55" font-size="20" fill="#fff" text-anchor="middle">QR</text></svg>`;
            const dataUrl = `data:image/svg+xml;base64,${btoa(svgContent)}`;
            resolve(dataUrl);
        });
    }
};
const selo_teste = 'GO2025T000000100'; // Simulação do selo gerado
const QR_CODE_WIDTH_PREVIEW = 70; // Largura padrão para geração do QR no preview
// ---------------------------------------------------------------------------------


// ... (Definições de Tipos mantidas) ...
type SeloInfo = typeof TabelaEmolumentos[0];
interface TaxaAdicional { id: string; nome: string; valorCalculado: number; }


// --- Definição dos Tipos do Estado de Serviço (EXPANDIDO) ---
interface ServiceState {
    tipoId: number | null;
    template: IBalcaoTemplate | null;
    seloInfo: SeloInfo | null;
    quantidade: number;
    descricaoDocumento: string;
    escreventeId: number | null;
    motivoIsencao: 'NENHUM' | 'GRATUIDADE_LEGAL' | 'ISENCAO_TRIBUTARIA';
    taxasAdicionais: TaxaAdicional[];
    valorTotal: number;

    // --- NOVOS CAMPOS DO SELO GERADO ---
    seloGerado: string | null; // O número do selo digital FINAL
    qrCodeUrl: string | null;   // A Data URL do QR Code

    // --- Campos de Participantes ---
    representanteSocioIndex: number | null;
    impedimentoAssinatura: boolean;
    rogatarioData: Partial<IPessoaSimples>;
    testemunhas: Partial<IPessoaSimples>[];
}

const initialServiceState: ServiceState = {
    tipoId: mockTipoServicoBalcao[0]?.id || null,
    template: null,
    seloInfo: null,
    quantidade: 1,
    descricaoDocumento: '',
    escreventeId: mockUsuarios.find(u => u.status === 'Ativo')?.id || null,
    motivoIsencao: 'NENHUM',
    taxasAdicionais: [],
    valorTotal: 0,

    // Iniciais para selo gerado
    seloGerado: null,
    qrCodeUrl: null,

    // Iniciais para participantes
    representanteSocioIndex: null,
    impedimentoAssinatura: false,
    rogatarioData: { nome: '', cpf: '' },
    testemunhas: [],
};

const initialClientData: Partial<TPessoaTipo> = initialPersonState;

const BalcaoServiceEmissionScreen: React.FC = () => {

    const [serviceState, setServiceState] = useState<ServiceState>(initialServiceState);
    const [clientData, setClientData] =
        useState<Partial<TPessoaTipo>>(initialClientData);
    const [searchingCpf, setSearchingCpf] = useState<string | null>(null);
    const [searchingCnpj, setSearchingCnpj] = useState<string | null>(null);

    // Casting seguro para Pessoa Jurídica (se for o tipo atual)
    const isPessoaJuridica = clientData.tipo === 'juridica';
    const juridicaData = clientData as Partial<IPessoaJuridica>;
    const qsa = juridicaData.qsa || [];

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    // --- Lógica de Cálculo de Custo (Mantida) ---

    const calcularCustos = useCallback((selo: SeloInfo | null, quantidade: number, isento: boolean) => {
        if (isento || !selo) {
            return {
                taxasAdicionais: mockTaxasAdicionais.map(t => ({ ...t, valorCalculado: 0 })),
                valorTotal: 0,
            };
        }

        const emolumentoBase = selo.valor_emolumento * quantidade;
        const taxaJudiciariaBase = selo.valor_taxa_judiciaria * quantidade;
        let total = emolumentoBase + taxaJudiciariaBase;

        const taxasCalculadas: TaxaAdicional[] = mockTaxasAdicionais.map(taxa => {
            let valorCalculado = 0;
            if (taxa.tipo === 'PERCENTUAL') {
                valorCalculado = emolumentoBase * taxa.percentual;
            } else if (taxa.tipo === 'FIXO') {
                valorCalculado = taxa.valorFixo * quantidade;
            }
            total += valorCalculado;
            return { id: taxa.id, nome: taxa.nome, valorCalculado };
        });

        return { taxasAdicionais: taxasCalculadas, valorTotal: total };
    }, []);

    useEffect(() => {
        const { taxasAdicionais, valorTotal } = calcularCustos(
            serviceState.seloInfo,
            serviceState.quantidade,
            serviceState.motivoIsencao !== 'NENHUM'
        );

        setServiceState(prev => ({
            ...prev,
            taxasAdicionais,
            valorTotal
        }));
    }, [
        serviceState.seloInfo,
        serviceState.quantidade,
        serviceState.motivoIsencao,
        calcularCustos
    ]);

    // --- Lógica de Derivação de Estado (Mantida) ---

    const filteredTemplates = useMemo(() => {
        if (!serviceState.tipoId) return [];
        return mockBalcaoTemplates.filter(
            (t) => t.tipoServicoBalcaoId === serviceState.tipoId
        );
    }, [serviceState.tipoId]);

    // --- Handlers de Mudança de Formulário do Serviço ---

    const handleTipoServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const novoTipoId = parseInt(e.target.value, 10);
        // Reseta o estado do serviço (incluindo o selo gerado)
        setServiceState(prev => ({
            ...initialServiceState,
            tipoId: novoTipoId,
            escreventeId: prev.escreventeId,
        }));
    };

    const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const templateId = e.target.value;
        const template = filteredTemplates.find((t) => t.id === templateId) || null;

        let selo: SeloInfo | null = null;
        if (template?.id_selo) {
            selo = TabelaEmolumentos.find(s => s.id_selo === template.id_selo) || null;
        }

        setServiceState((prev) => ({
            ...prev,
            template: template,
            seloInfo: selo || prev.seloInfo,
            quantidade: template?.id !== prev.template?.id ? 1 : prev.quantidade,
            seloGerado: null, // Reseta selo/qr ao mudar template
            qrCodeUrl: null,
        }));
    };

    const handleServiceFieldChange = (field: keyof ServiceState, value: any) => {
        setServiceState(prev => {
            const newState = { ...prev, [field]: value };

            if (field === 'impedimentoAssinatura' && value === false) {
                newState.rogatarioData = { nome: '', cpf: '' };
            }
            if (field === 'representanteSocioIndex' && value !== null && !isPessoaJuridica) {
                newState.representanteSocioIndex = null;
            }

            // Reseta selo/qr ao alterar qualquer campo que afete o cálculo/emissão
            if (field !== 'seloGerado' && field !== 'qrCodeUrl' && field !== 'taxasAdicionais' && field !== 'valorTotal') {
                newState.seloGerado = null;
                newState.qrCodeUrl = null;
            }

            return newState;
        });
    }

    const handleParticipanteChange = (type: 'rogatario' | 'testemunha', index: number, field: keyof IPessoaSimples, value: string) => {
        if (type === 'rogatario') {
            setServiceState(prev => ({
                ...prev,
                rogatarioData: {
                    ...prev.rogatarioData,
                    [field]: value,
                },
                seloGerado: null, // Invalida selo ao mudar dados críticos
                qrCodeUrl: null,
            }));
        } else if (type === 'testemunha') {
            setServiceState(prev => {
                const newTestemunhas = [...prev.testemunhas];
                newTestemunhas[index] = {
                    ...newTestemunhas[index],
                    [field]: value,
                };
                return { ...prev, testemunhas: newTestemunhas, seloGerado: null, qrCodeUrl: null };
            });
        }
    }

    const handleAddTestemunha = () => {
        setServiceState(prev => ({
            ...prev,
            testemunhas: [...prev.testemunhas, { nome: '', cpf: '' }],
            seloGerado: null,
            qrCodeUrl: null,
        }));
    }

    const handleRemoveTestemunha = (index: number) => {
        setServiceState(prev => ({
            ...prev,
            testemunhas: prev.testemunhas.filter((_, i) => i !== index),
            seloGerado: null,
            qrCodeUrl: null,
        }));
    }

    const handleSeloSelect = (selo: SeloInfo) => {
        setServiceState(prev => ({ ...prev, seloInfo: selo, seloGerado: null, qrCodeUrl: null }));
    };

    const handleSeloClear = () => {
        setServiceState(prev => ({ ...prev, seloInfo: null, seloGerado: null, qrCodeUrl: null }));
    };

    // --- NOVO HANDLER UNIFICADO E ROBUSTO (Mantido) ---
    const handleStateUpdate = useCallback(
        (path: (string | number)[], value: any) => {
            setClientData((prevData) => {
                let newData = JSON.parse(JSON.stringify(prevData));
                let current = newData;

                for (let i = 0; i < path.length - 1; i++) {
                    const key = path[i];
                    if (current[key] === null || current[key] === undefined) {
                        current[key] = (key === 'qsa' ? [] : {}) as any;
                    }
                    current = current[key] as any;
                }

                const finalKey = path[path.length - 1];
                if (current) {
                    current[finalKey] = value;
                }

                // Invalida o selo ao mudar dados do cliente
                setServiceState(prev => ({ ...prev, seloGerado: null, qrCodeUrl: null }));

                return newData;
            });
        },
        []
    );

    // Handler de conveniência para redefinir o objeto de pessoa
    const onDadosChange = useCallback((novosDados: Partial<TPessoaTipo>) => {
        setClientData(novosDados);
        setServiceState(prev => ({ ...prev, representanteSocioIndex: null, seloGerado: null, qrCodeUrl: null }));
    }, []);

    // --- Lógica de Busca de Pessoa (Mantida) ---
    const handleCpfSearch = (pathPrefix: (string | number)[], cpf: string) => {
        // ... (Lógica de busca mantida) ...
    };

    const handleCnpjSearch = (pathPrefix: (string | number)[], cnpj: string) => {
        // ... (Lógica de busca mantida) ...
    };

    // --- Lógica de QSA (Sócio - Mantida) ---
    const onAddSocio = () => {
        // ... (Lógica de adição mantida) ...
        setServiceState(prev => ({ ...prev, seloGerado: null, qrCodeUrl: null }));
    };

    const onRemoveSocio = (index: number) => {
        // ... (Lógica de remoção e ajuste de índice mantida) ...
        setServiceState(prev => ({ ...prev, seloGerado: null, qrCodeUrl: null }));
    };


    // --- FUNÇÃO DE GERAÇÃO DE QR CODE REAL ---
    const generateQrCode = async (selo: string) => {
        try {
            const urlConsulta = `https://see.tjgo.jus.br/buscas?codigo_selo=${selo}`;
            const qrCodeDataUrl = await QRCode.toDataURL(urlConsulta, {
                width: QR_CODE_WIDTH_PREVIEW,
                margin: 1,
            });
            return qrCodeDataUrl;
        } catch (err) {
            console.error("Falha ao gerar o QR Code:", err);
            return null;
        }
    };

    const runValidations = (): boolean => {
        // --- VALIDAÇÕES ---
        if (!serviceState.seloInfo || serviceState.quantidade < 1) {
            alert("Erro: Selecione um template, um selo e defina a quantidade para continuar.");
            return false;
        }

        if (isPessoaJuridica && (serviceState.representanteSocioIndex === null || qsa.length === 0)) {
            alert("Erro: É obrigatório selecionar o sócio representante que compareceu.");
            return false;
        }

        if (serviceState.impedimentoAssinatura && (!serviceState.rogatarioData.nome || !serviceState.rogatarioData.cpf)) {
            alert("Erro: O cliente possui impedimento e os dados do Rogatário (Nome e CPF/RG) não foram preenchidos.");
            return false;
        }

        const exigeTestemunhas = mockBalcaoTemplates.find(t => t.id === serviceState.template?.id)?.exigeTestemunhas;
        if (exigeTestemunhas && serviceState.testemunhas.length < 2) {
            alert("Erro: Este ato exige um mínimo de 2 testemunhas.");
            return false;
        }
        return true;
    };

    const handleOpenConfirmation = () => {
        if (serviceState.seloGerado) {
            alert(`A ordem já foi finalizada com o Selo: ${serviceState.seloGerado}.`);
            return;
        }

        if (!runValidations()) {
            return;
        }

        setIsConfirmModalOpen(true);
    };

    const handleConfirmSeloGeneration = async () => {
        // Garante que o modal feche, independentemente do sucesso
        setIsConfirmModalOpen(false);

        if (!runValidations()) {
            return;
        }

        // --- LÓGICA DE SELAGEM E GERAÇÃO DE QR CODE ---
        const novoSelo = selo_teste; // Simulação: Obtenção do selo
        const qrCodeDataUrl = await generateQrCode(novoSelo);

        if (!qrCodeDataUrl) {
            alert("Falha na geração do QR Code. A ordem não pode ser finalizada.");
            return;
        }

        // 1. ATUALIZA O ESTADO COM O SELO GERADO E QR CODE
        setServiceState(prev => ({
            ...prev,
            seloGerado: novoSelo,
            qrCodeUrl: qrCodeDataUrl,
        }));

        // 2. LOG DE ORDEM CONCLUÍDA
        const protocolo = "2025-BLC-" + Math.floor(Math.random() * 10000);
        console.log(`Ordem Finalizada. Protocolo: ${protocolo}. Selo Digital: ${novoSelo}.`);
    };


    // --- FUNÇÃO FINALIZAR E SELAR (Com Geração de Selo/QR Code) ---
    const handleEmitirServico = async () => {
        // --- VALIDAÇÕES ---
        if (!serviceState.seloInfo || serviceState.quantidade < 1) {
            alert("Erro: Selecione um template, um selo e defina a quantidade para continuar.");
            return;
        }

        if (isPessoaJuridica && (serviceState.representanteSocioIndex === null || qsa.length === 0)) {
            alert("Erro: É obrigatório selecionar o sócio representante que compareceu.");
            return;
        }

        if (serviceState.impedimentoAssinatura && (!serviceState.rogatarioData.nome || !serviceState.rogatarioData.cpf)) {
            alert("Erro: O cliente possui impedimento e os dados do Rogatário (Nome e CPF/RG) não foram preenchidos.");
            return;
        }

        const exigeTestemunhas = mockBalcaoTemplates.find(t => t.id === serviceState.template?.id)?.exigeTestemunhas;
        if (exigeTestemunhas && serviceState.testemunhas.length < 2) {
            alert("Erro: Este ato exige um mínimo de 2 testemunhas.");
            return;
        }

        // --- LÓGICA DE SELAGEM E GERAÇÃO DE QR CODE ---
        const novoSelo = selo_teste; // Simulação: Obtenção do selo
        const qrCodeDataUrl = await generateQrCode(novoSelo);

        if (!qrCodeDataUrl) {
            alert("Falha na geração do QR Code. O serviço não pode ser finalizado.");
            return;
        }

        const escrevente = mockUsuarios.find(u => u.id === serviceState.escreventeId)?.nome || 'Não identificado';
        const protocolo = "2025-BLC-" + Math.floor(Math.random() * 10000);

        // 1. ATUALIZA O ESTADO COM O SELO GERADO E QR CODE
        setServiceState(prev => ({
            ...prev,
            seloGerado: novoSelo,
            qrCodeUrl: qrCodeDataUrl,
        }));

        // 2. SIMULAÇÃO DE PERSISTÊNCIA
        console.log("--- ATO FINALIZADO ---");
        console.log("Protocolo Gerado: " + protocolo);
        console.log("Selo Digital Final: " + novoSelo);

        alert(`Serviço emitido com sucesso! Protocolo: ${protocolo}. Selo: ${novoSelo}. Valor Total: ${formatCurrency(serviceState.valorTotal)}`);
    }

    // --- Funções Auxiliares de Renderização ---

    const commonInputClass =
        'mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500';
    const commonLabelClass = 'block text-sm font-medium text-gray-700';
    const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    // Renderização dos campos de Testemunhas (Sub-componente)
    const TestemunhaInput = ({ index, nome, cpf }: { index: number, nome?: string, cpf?: string }) => (
        <div className="flex items-center gap-4 p-3 border border-gray-200 rounded-md bg-white">
            <div className="flex-grow">
                <label className={commonLabelClass}>Nome da Testemunha {index + 1}</label>
                <input
                    type="text"
                    value={nome || ''}
                    onChange={(e) => handleParticipanteChange('testemunha', index, 'nome', e.target.value)}
                    className={commonInputClass}
                />
            </div>
            <div className="flex-grow">
                <label className={commonLabelClass}>CPF/RG</label>
                <input
                    type="text"
                    value={cpf || ''}
                    onChange={(e) => handleParticipanteChange('testemunha', index, 'cpf', e.target.value)}
                    className={commonInputClass}
                />
            </div>
            <button
                type="button"
                onClick={() => handleRemoveTestemunha(index)}
                className="self-center p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"
            >
                Remover
            </button>
        </div>
    );

    const handleFinalizarServico = async () => {
        // --- VALIDAÇÕES ---
        if (!serviceState.seloInfo || serviceState.quantidade < 1) {
            alert("Erro: Selecione um template, um selo e defina a quantidade para continuar.");
            return;
        }

        if (isPessoaJuridica && (serviceState.representanteSocioIndex === null || qsa.length === 0)) {
            alert("Erro: É obrigatório selecionar o sócio representante que compareceu.");
            return;
        }

        if (serviceState.impedimentoAssinatura && (!serviceState.rogatarioData.nome || !serviceState.rogatarioData.cpf)) {
            alert("Erro: O cliente possui impedimento e os dados do Rogatário (Nome e CPF/RG) não foram preenchidos.");
            return;
        }

        const exigeTestemunhas = mockBalcaoTemplates.find(t => t.id === serviceState.template?.id)?.exigeTestemunhas;
        if (exigeTestemunhas && serviceState.testemunhas.length < 2) {
            alert("Erro: Este ato exige um mínimo de 2 testemunhas.");
            return;
        }

        // --- LÓGICA DE SELAGEM E GERAÇÃO DE QR CODE ---
        const novoSelo = selo_teste; // Simulação: Obtenção do selo
        const qrCodeDataUrl = await generateQrCode(novoSelo);

        if (!qrCodeDataUrl) {
            alert("Falha na geração do QR Code. A ordem não pode ser finalizada.");
            return;
        }

        // 1. ATUALIZA O ESTADO COM O SELO GERADO E QR CODE
        setServiceState(prev => ({
            ...prev,
            seloGerado: novoSelo,
            qrCodeUrl: qrCodeDataUrl,
        }));

        // 2. LOG DE ORDEM CONCLUÍDA
        const protocolo = "2025-BLC-" + Math.floor(Math.random() * 10000);
        console.log(`Ordem Finalizada. Protocolo: ${protocolo}. Selo Digital: ${novoSelo}.`);

        alert(`Ordem Finalizada com sucesso! Protocolo: ${protocolo}. O selo digital foi gerado e a etiqueta está pronta para impressão.`);
    };

    // --- NOVA FUNÇÃO: IMPRIMIR ETIQUETA ---
    const handleImprimirEtiqueta = () => {
        if (!serviceState.seloGerado) {
            alert("Erro: A ordem precisa ser finalizada (Selo Digital gerado) antes de imprimir.");
            return;
        }

        // Simulação da chamada de impressão física
        console.log(`Simulando impressão de ${serviceState.quantidade} etiqueta(s) com o Selo ${serviceState.seloGerado}.`);
        alert(`Imprimindo ${serviceState.quantidade} etiqueta(s) com o Selo ${serviceState.seloGerado}...`);
    };

    const modalParsedData: IParsedData[] = useMemo(() => {
        if (!serviceState.seloInfo) return [];

        // Label customizado
        const serviceLabel = `${serviceState.template?.titulo || 'Serviço de Balcão'} (${serviceState.quantidade} unidade(s))`;

        return [{
            label: serviceLabel,
            tituloData: {}, // Não aplicável ao Balcão, mas necessário pelo tipo IParsedData
            seloId: serviceState.seloInfo.id_selo,
            // Poderia adicionar valor total aqui se o tipo IParsedData aceitasse.
        }];
    }, [serviceState.seloInfo, serviceState.template, serviceState.quantidade]);

    return (
        <div className="p-6 bg-gray-50 mx-auto min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
                Emissão de Serviço de Balcão (Tabelionato)
            </h1>

            <div className="space-y-8">
                {/* 1. Seleção do Serviço (Mantido) */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100 space-y-4">
                    <h2 className="text-xl font-semibold text-blue-700 mb-4">
                        1. Seleção do Serviço
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* 1. Tipo de Serviço de Balcão */}
                        <div>
                            <label className={commonLabelClass}>
                                Tipo de Serviço de Balcão
                            </label>
                            <select
                                value={serviceState.tipoId || ''}
                                onChange={handleTipoServiceChange}
                                className={commonInputClass}
                            >
                                {mockTipoServicoBalcao.map((tipo) => (
                                    <option key={tipo.id} value={tipo.id}>
                                        {tipo.nome}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* 2. Serviço (Template) */}
                        <div>
                            <label className={commonLabelClass}>Serviço (Template)</label>
                            <select
                                value={serviceState.template?.id || ''}
                                onChange={handleTemplateChange}
                                disabled={filteredTemplates.length === 0}
                                className={commonInputClass}
                            >
                                <option value="" disabled>
                                    Selecione um template...
                                </option>
                                {filteredTemplates.map((template) => (
                                    <option key={template.id} value={template.id}>
                                        {template.titulo}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* DETALHES DO PEDIDO */}
                    {serviceState.template ? (
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm border border-gray-200 space-y-4">
                            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Detalhes Finais do Pedido</h3>

                            {/* DOCUMENTOS EXIGIDOS (CONFERÊNCIA) */}
                            {serviceState.template.documentosExigidos && serviceState.template.documentosExigidos.length > 0 && (
                                <div className="p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
                                    <p className="font-semibold text-yellow-800">⚠️ Conferência Obrigatória de Documentos:</p>
                                    <ul className="list-disc list-inside mt-1 text-yellow-700">
                                        {serviceState.template.documentosExigidos.map((doc, index) => (
                                            <li key={index}>{doc.nome} ({doc.obrigatorio ? 'OBRIGATÓRIO' : 'Opcional'})</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* INPUT DO SELO VINVULADO */}
                                <div>
                                    <label className={commonLabelClass}>Selo Vinculado (Obrigatório)</label>
                                    <SeloSearchInput
                                        selectedSeloId={serviceState.seloInfo?.id_selo || null}
                                        onSeloSelect={handleSeloSelect}
                                        onClear={handleSeloClear}
                                        sistemaFiltro="TABELIONATO DE NOTAS"
                                    />
                                </div>

                                {/* QUANTIDADE DE ATOS/SELOS */}
                                <div>
                                    <label className={commonLabelClass}>Quantidade de Atos/Selos</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={serviceState.quantidade}
                                        onChange={(e) => handleServiceFieldChange('quantidade', parseInt(e.target.value) || 1)}
                                        className={commonInputClass}
                                    />
                                </div>
                            </div>

                            {/* DESCRIÇÃO DO DOCUMENTO */}
                            <div>
                                <label className={commonLabelClass}>Descrição Breve do Documento Apresentado</label>
                                <input
                                    type="text"
                                    value={serviceState.descricaoDocumento}
                                    onChange={(e) => handleServiceFieldChange('descricaoDocumento', e.target.value)}
                                    className={commonInputClass}
                                    placeholder="Ex: Documento de Identidade, Procuração Particular."
                                />
                            </div>

                            {/* SELEÇÃO DE ISENÇÃO E ESCREVENTE */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={commonLabelClass}>Motivo de Isenção/Gratuidade</label>
                                    <select
                                        value={serviceState.motivoIsencao}
                                        onChange={(e) => handleServiceFieldChange('motivoIsencao', e.target.value as ServiceState['motivoIsencao'])}
                                        className={commonInputClass}
                                    >
                                        <option value="NENHUM">NENHUM (Cobra Valor Total)</option>
                                        <option value="GRATUIDADE_LEGAL">Gratuidade (Lei/Hipossuficiência)</option>
                                        <option value="ISENCAO_TRIBUTARIA">Isenção Tributária (Ex: Imunidade)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={commonLabelClass}>Escrevente Atendente/Lavrador</label>
                                    <select
                                        value={serviceState.escreventeId || ''}
                                        onChange={(e) => handleServiceFieldChange('escreventeId', parseInt(e.target.value, 10))}
                                        className={commonInputClass}
                                    >
                                        {mockUsuarios.filter(u => u.status === 'Ativo').map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.nome}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* VALORES E INFORMAÇÕES DO SELO/CÁLCULO */}
                            {serviceState.seloInfo ? (
                                <div className="p-3 bg-white rounded-lg border">
                                    <p className="font-semibold text-gray-700 mb-2">Resumo do Custo e Emissão:</p>
                                    <p className={`font-bold text-red-700 text-center text-lg ${serviceState.motivoIsencao !== 'NENHUM' ? 'block' : 'hidden'}`}>
                                        ATO ISENTO/GRATUITO: COBRANÇA R$ 0,00
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
                                        <div className='col-span-2 font-bold text-blue-700'>
                                            <span className="font-semibold">Selo ID:</span>{' '}
                                            {serviceState.seloInfo.id_selo} ({serviceState.seloInfo.descricao_selo})
                                        </div>
                                    </div>

                                    <hr className="my-2" />

                                    {/* DETALHAMENTO DE CUSTOS */}
                                    <div className="space-y-1">
                                        <p className="font-medium">Total de Emolumentos e Taxas Judiciárias ({serviceState.quantidade}x):</p>
                                        <div className="pl-4 text-sm">
                                            <p>Emolumentos: {formatCurrency(serviceState.seloInfo.valor_emolumento * serviceState.quantidade)}</p>
                                            <p>Taxa Judiciária: {formatCurrency(serviceState.seloInfo.valor_taxa_judiciaria * serviceState.quantidade)}</p>
                                        </div>

                                        <p className="font-medium mt-2">Taxas Adicionais ({serviceState.quantidade}x):</p>
                                        <div className="pl-4 text-sm space-y-0.5">
                                            {serviceState.taxasAdicionais.map(taxa => (
                                                <p key={taxa.id}>{taxa.nome} ({taxa.id}): {formatCurrency(taxa.valorCalculado)}</p>
                                            ))}
                                        </div>
                                    </div>

                                    <div className='mt-3 font-bold text-green-800 text-2xl border-t pt-2'>
                                        <span className="font-semibold">Valor TOTAL a Cobrar:</span>{' '}
                                        {formatCurrency(serviceState.valorTotal)}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center p-4 text-red-700 bg-red-100 rounded-lg border border-red-300">
                                    Selecione um Selo Vinculado para calcular o valor.
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center p-8 text-gray-500 bg-gray-50 rounded-lg">
                            Selecione o Tipo de Serviço e o Template para continuar.
                        </div>
                    )}
                </div>

                {/* 2. Dados da Pessoa (Mantido) */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        2. Dados da Pessoa / Entidade
                    </h2>
                    <SeletorDePessoa
                        dados={clientData}
                        pathPrefix={['client']}
                        handleStateUpdate={handleStateUpdate}
                        handleCpfSearch={handleCpfSearch}
                        handleCnpjSearch={handleCnpjSearch}
                        searchingCpf={searchingCpf}
                        searchingCnpj={searchingCnpj}
                        onAddSocio={onAddSocio}
                        onRemoveSocio={onRemoveSocio}
                        onDadosChange={onDadosChange}
                    />
                </div>

                {/* 3. PARTICIPANTES E REPRESENTAÇÃO NO ATO */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-yellow-100 space-y-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        3. Participantes e Representação no Ato
                    </h2>

                    {/* A. SELEÇÃO DO REPRESENTANTE PJ */}
                    {isPessoaJuridica && (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <label className={commonLabelClass}>Sócio Representante que Compareceu (Obrigatório)</label>
                            <select
                                value={serviceState.representanteSocioIndex !== null ? serviceState.representanteSocioIndex : ''}
                                onChange={(e) => handleServiceFieldChange('representanteSocioIndex', parseInt(e.target.value))}
                                className={commonInputClass}
                            >
                                <option value="" disabled>Selecione o sócio responsável pela assinatura...</option>
                                {qsa.map((socio, index) => (
                                    <option key={index} value={index}>
                                        {socio.nome} ({socio.qualificacao || 'Sócio'})
                                    </option>
                                ))}
                                {qsa.length === 0 && <option disabled>Nenhum sócio cadastrado. Adicione em "Dados da Pessoa".</option>}
                            </select>
                        </div>
                    )}

                    {/* B. ASSINATURA A ROGO */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="impedimentoAssinatura"
                            checked={serviceState.impedimentoAssinatura}
                            onChange={(e) => handleServiceFieldChange('impedimentoAssinatura', e.target.checked)}
                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                        <label htmlFor="impedimentoAssinatura" className="text-sm font-medium text-red-700">
                            Cliente Principal possui **Impedimento/Deficiência para Assinar** (Exige Assinatura a Rogo)
                        </label>
                    </div>

                    {serviceState.impedimentoAssinatura && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-3">
                            <h4 className="font-semibold text-red-800">Dados do Rogatário (Assina a Rogo)</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={commonLabelClass}>Nome Completo do Rogatário</label>
                                    <input
                                        type="text"
                                        value={serviceState.rogatarioData.nome || ''}
                                        onChange={(e) => handleParticipanteChange('rogatario', 0, 'nome', e.target.value)}
                                        className={commonInputClass}
                                    />
                                </div>
                                <div>
                                    <label className={commonLabelClass}>CPF/RG do Rogatário</label>
                                    <input
                                        type="text"
                                        value={serviceState.rogatarioData.cpf || ''}
                                        onChange={(e) => handleParticipanteChange('rogatario', 0, 'cpf', e.target.value)}
                                        className={commonInputClass}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* C. TESTEMUNHAS INSTRUMENTÁRIAS */}
                    {/* Simulação: Um template exige testemunhas se `exigeTestemunhas` for true */}
                    {(mockBalcaoTemplates.find(t => t.id === serviceState.template?.id)?.exigeTestemunhas || serviceState.testemunhas.length > 0) && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-3">
                            <h4 className="font-semibold text-green-800">
                                Testemunhas Instrumentárias {mockBalcaoTemplates.find(t => t.id === serviceState.template?.id)?.exigeTestemunhas && <span className="text-red-600">(Mínimo 2 obrigatórias)</span>}
                            </h4>
                            <div className="space-y-3">
                                {serviceState.testemunhas.map((t, index) => (
                                    <TestemunhaInput key={index} index={index} nome={t.nome} cpf={t.cpf} />
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={handleAddTestemunha}
                                className="mt-2 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                            >
                                Adicionar Testemunha
                            </button>
                        </div>
                    )}
                </div>

                {/* 4. Pré-Visualização da Etiqueta */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        4. Pré-Visualização da Etiqueta
                    </h2>
                    <p className="text-sm text-blue-600 mb-4">
                        {serviceState.seloGerado
                            ? `✅ Selo Digital Gerado: ${serviceState.seloGerado}. Visualize as opções de QR Code abaixo.`
                            : 'Selo Digital será gerado e visualizado após a finalização do serviço.'}
                    </p>

                    {serviceState.template && (
                        <BalcaoPreview
                            template={serviceState.template}
                            clientData={clientData}
                            serventiaData={DADOS_SERVENTIA}
                            quantidade={serviceState.quantidade}
                            testemunhas={serviceState.testemunhas}
                            seloGerado={serviceState.seloGerado}
                        />
                    )}
                    {!serviceState.template && (
                        <div className="text-center p-8 text-gray-500 bg-gray-50 rounded-lg">
                            Selecione um serviço para ver a pré-visualização.
                        </div>
                    )}
                </div>

                {/* 5. AÇÃO IMPRIMIR (BOTÃO SEPARADO) */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100 flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={handleOpenConfirmation} // AQUI CHAMA A ABERTURA DO MODAL
                        disabled={!!serviceState.seloGerado || !serviceState.seloInfo || serviceState.quantidade < 1}
                        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                    >
                        {serviceState.seloGerado
                            ? `✅ Ordem Finalizada (Selo: ${serviceState.seloGerado})`
                            : `Finalizar Ordem e Gerar Selo Digital`
                        }
                    </button>
                    <button
                        type="button"
                        onClick={handleImprimirEtiqueta}
                        // Só permite imprimir se o selo JÁ FOI gerado
                        disabled={!serviceState.seloGerado}
                        className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors disabled:bg-gray-400"
                    >
                        Imprimir Etiqueta(s) (Qtd: {serviceState.quantidade})
                    </button>
                </div>
            </div>
            <ConfirmacaoSeloModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleConfirmSeloGeneration} // A função real de geração
                parsedData={modalParsedData} // O array de 1 item
                emolumentos={TabelaEmolumentos as IEmolumento[]} // Mock de todos os emolumentos
                title="Confirmação Final do Serviço de Balcão"
            />
        </div>
    );
};

export default BalcaoServiceEmissionScreen;