// EmitirNovoServicoBalcao.tsx (COMPLETO E ATUALIZADO V2)
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
    // Simulação do tipo de pessoa simples para testemunhas/rogatário
    type IPessoaSimples // Simulado
} from '../../Types'; 
import { type IBalcaoTemplate } from '../Types';
import { initialPersonState, initialPessoaJuridicaState } from '../../utils/initialStates';
import BalcaoPreview from './BalcaoPreview';
import TabelaEmolumentos from '../../../../tabela-emolumentos.json';
import SeloSearchInput from '../../Components/SeloSearchInput';

// Definindo o tipo para os itens da tabela de emolumentos (Mantido)
type SeloInfo = typeof TabelaEmolumentos[0]; 

// Tipo para as taxas adicionais calculadas (Mantido)
interface TaxaAdicional {
    id: string;
    nome: string;
    valorCalculado: number;
}

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
    
    // --- NOVOS CAMPOS DE PARTICIPANTES ---
    representanteSocioIndex: number | null; // Index do sócio que assina (se PJ)
    impedimentoAssinatura: boolean; // Se precisa de assinatura a rogo
    rogatarioData: Partial<IPessoaSimples>; // Dados do Rogatário (se a rogo)
    testemunhas: Partial<IPessoaSimples>[]; // Array de testemunhas (se exigido)
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
    
    // Iniciais para novos campos
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

    // --- Lógica de Cálculo de Custo (Mantida) ---

    const calcularCustos = useCallback((selo: SeloInfo | null, quantidade: number, isento: boolean) => {
        if (isento || !selo) {
            return {
                taxasAdicionais: mockTaxasAdicionais.map(t => ({ ...t, valorCalculado: 0 })),
                valorTotal: 0,
            };
        }

        // Calcula a base multiplicada pela quantidade
        const emolumentoBase = selo.valor_emolumento * quantidade;
        const taxaJudiciariaBase = selo.valor_taxa_judiciaria * quantidade;
        let total = emolumentoBase + taxaJudiciariaBase;
        
        // Calcula e soma as taxas adicionais
        const taxasCalculadas: TaxaAdicional[] = mockTaxasAdicionais.map(taxa => {
            let valorCalculado = 0;
            if (taxa.tipo === 'PERCENTUAL') {
                // Cálculo sobre o Emolumento
                valorCalculado = emolumentoBase * taxa.percentual;
            } else if (taxa.tipo === 'FIXO') {
                // Multiplica taxa fixa pela quantidade
                valorCalculado = taxa.valorFixo * quantidade; 
            }
            total += valorCalculado;
            return { id: taxa.id, nome: taxa.nome, valorCalculado };
        });

        return { taxasAdicionais: taxasCalculadas, valorTotal: total };
    }, []);

    // Atualiza o cálculo sempre que o selo, quantidade ou isenção mudar
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
        // Reseta o estado do serviço, mas mantém o escrevente
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
            // Busca real do selo na tabela
            selo = TabelaEmolumentos.find(s => s.id_selo === template.id_selo) || null;
        }

        setServiceState((prev) => ({
            ...prev,
            template: template,
            // Prioriza o selo do template se existir
            seloInfo: selo || prev.seloInfo, 
            // Garante que a quantidade é 1 ao selecionar um novo template
            quantidade: template?.id !== prev.template?.id ? 1 : prev.quantidade, 
        }));
    };
    
    // Handler para campos simples do ServiceState
    const handleServiceFieldChange = (field: keyof ServiceState, value: any) => {
        setServiceState(prev => {
            const newState = { ...prev, [field]: value };

            // Lógica de reset: Se desmarcar 'a rogo', limpa o rogatário
            if (field === 'impedimentoAssinatura' && value === false) {
                newState.rogatarioData = { nome: '', cpf: '' };
            }
            // Lógica de reset: Se mudar para PF, limpa o representante PJ
            if (field === 'representanteSocioIndex' && value !== null && !isPessoaJuridica) {
                newState.representanteSocioIndex = null;
            }

            return newState;
        });
    }

    // Handler específico para o Rogatário e Testemunhas (dados simples)
    const handleParticipanteChange = (type: 'rogatario' | 'testemunha', index: number, field: keyof IPessoaSimples, value: string) => {
        if (type === 'rogatario') {
            setServiceState(prev => ({
                ...prev,
                rogatarioData: {
                    ...prev.rogatarioData,
                    [field]: value,
                }
            }));
        } else if (type === 'testemunha') {
            setServiceState(prev => {
                const newTestemunhas = [...prev.testemunhas];
                newTestemunhas[index] = {
                    ...newTestemunhas[index],
                    [field]: value,
                };
                return { ...prev, testemunhas: newTestemunhas };
            });
        }
    }

    const handleAddTestemunha = () => {
        setServiceState(prev => ({
            ...prev,
            testemunhas: [...prev.testemunhas, { nome: '', cpf: '' }],
        }));
    }

    const handleRemoveTestemunha = (index: number) => {
        setServiceState(prev => ({
            ...prev,
            testemunhas: prev.testemunhas.filter((_, i) => i !== index),
        }));
    }
    
    // Seleção manual do Selo
    const handleSeloSelect = (selo: SeloInfo) => {
        setServiceState(prev => ({ ...prev, seloInfo: selo }));
    };
    
    // Limpar o Selo
    const handleSeloClear = () => {
        setServiceState(prev => ({ ...prev, seloInfo: null }));
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

                return newData;
            });
        },
        []
    );


    // Handler de conveniência para redefinir o objeto de pessoa
    const onDadosChange = useCallback((novosDados: Partial<TPessoaTipo>) => {
        setClientData(novosDados);
        // Garante que o índice do sócio é resetado se mudar para PF
        setServiceState(prev => ({ ...prev, representanteSocioIndex: null }));
    }, []);

    // --- Lógica de Busca de Pessoa (Mantida) ---
    const handleCpfSearch = (pathPrefix: (string | number)[], cpf: string) => {
        const cleanCpf = cpf.replace(/[.\-]/g, '');
        if (cleanCpf.length !== 11) return;

        setSearchingCpf(pathPrefix.join('.'));
        setTimeout(() => {
            const foundPerson = mockPessoasCadastradas.find(
                (p) => p.tipo === 'fisica' && (p as IPessoaFisica).cpf === cleanCpf
            ) as IPessoaFisica | undefined;

            if (foundPerson) {
                const updatedPersonData = { ...initialPersonState, ...foundPerson, tipo: 'fisica' } as IPessoaFisica;
                setClientData(updatedPersonData);
            }
            setSearchingCpf(null);
        }, 1000);
    };

    const handleCnpjSearch = (pathPrefix: (string | number)[], cnpj: string) => {
        const cleanCnpj = cnpj.replace(/[\.\/\-]/g, '');
        if (cleanCnpj.length !== 14) return;

        setSearchingCnpj(pathPrefix.join('.'));
        setTimeout(() => {
            const foundCompany = mockPessoasCadastradas.find(
                (p) => p.tipo === 'juridica' && (p as IPessoaJuridica).cnpj === cleanCnpj
            ) as IPessoaJuridica | undefined;

            if (foundCompany) {
                const updatedCompanyData = { ...initialPessoaJuridicaState, ...foundCompany, tipo: 'juridica' } as IPessoaJuridica;
                setClientData(updatedCompanyData);
            }
            setSearchingCnpj(null);
        }, 1000);
    };

    // --- Lógica de QSA (Sócio - Mantida) ---

    const onAddSocio = () => {
        setClientData((prevData) => {
            if (prevData.tipo !== 'juridica') return prevData;
            const currentJuridica = prevData as IPessoaJuridica;
            const newQsa = [
                ...(currentJuridica.qsa || []),
                { nome: '', qualificacao: '' } as ISocio, 
            ];
            return { ...prevData, qsa: newQsa };
        });
    };

    const onRemoveSocio = (index: number) => {
        setClientData((prevData) => {
            if (prevData.tipo !== 'juridica') return prevData;
            const currentJuridica = prevData as IPessoaJuridica;
            const newQsa = (currentJuridica.qsa || []).filter((_, i) => i !== index);
            return { ...prevData, qsa: newQsa };
        });
        // Ajusta o índice do sócio representante se ele foi removido
        setServiceState(prev => {
            if (prev.representanteSocioIndex === index) {
                return { ...prev, representanteSocioIndex: null };
            }
            if (prev.representanteSocioIndex !== null && prev.representanteSocioIndex > index) {
                return { ...prev, representanteSocioIndex: prev.representanteSocioIndex - 1 };
            }
            return prev;
        });
    };

    // --- Funções Auxiliares de Renderização e Finalização ---

    const commonInputClass =
        'mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500';
    const commonLabelClass = 'block text-sm font-medium text-gray-700';
    const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    
    // Simulação de exigência de testemunhas para fins de demonstração (Template BALCAO-REC-002 exige!)
    const exigeTestemunhas = serviceState.template?.id === 'BALCAO-REC-002';

    const handleEmitirServico = () => {
        // --- VALIDAÇÕES ADICIONAIS ---
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

        if (exigeTestemunhas && serviceState.testemunhas.length < 2) {
             alert("Erro: Este ato exige um mínimo de 2 testemunhas.");
            return;
        }

        // --- SIMULAÇÃO DE PERSISTÊNCIA ---
        const escrevente = mockUsuarios.find(u => u.id === serviceState.escreventeId)?.nome || 'Não identificado';
        const protocolo = "2025-BLC-" + Math.floor(Math.random() * 10000); 

        console.log("--- ATO FINALIZADO ---");
        console.log("Protocolo Gerado: " + protocolo);
        console.log("Escrevente: " + escrevente);
        console.log("Selo(s) Vinculado(s): " + serviceState.quantidade + "x Selo ID " + serviceState.seloInfo.id_selo);
        console.log("Valor Total Cobrado: " + formatCurrency(serviceState.valorTotal));
        console.log("Representante PJ (Sócio): " + (isPessoaJuridica ? qsa[serviceState.representanteSocioIndex || 0]?.nome : 'N/A'));
        console.log("Assinatura a Rogo: " + (serviceState.impedimentoAssinatura ? `Sim, Rogatário: ${serviceState.rogatarioData.nome}` : 'Não'));
        console.log("Testemunhas Registradas: " + serviceState.testemunhas.length);
        
        alert(`Serviço emitido com sucesso! Protocolo: ${protocolo}. Valor Total: ${formatCurrency(serviceState.valorTotal)}`);
    }

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

    return (
        <div className="p-6 bg-gray-50 mx-auto min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
                Emissão de Serviço de Balcão (Tabelionato)
            </h1>

            <div className="space-y-8">
                {/* 1. Seleção do Serviço */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100 space-y-4">
                    <h2 className="text-xl font-semibold text-blue-700 mb-4">
                        1. Seleção do Serviço
                    </h2>

                    {/* SELETORES */}
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

                    {/* DETALHES DO PEDIDO (Inclui o SeloSearchInput e os valores) */}
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

                {/* 2. Dados da Pessoa */}
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

                {/* 3. PARTICIPANTES E REPRESENTAÇÃO NO ATO (NOVA SEÇÃO) */}
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
                    {(exigeTestemunhas || serviceState.testemunhas.length > 0) && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-3">
                            <h4 className="font-semibold text-green-800">
                                Testemunhas Instrumentárias {exigeTestemunhas && <span className="text-red-600">(Mínimo 2 obrigatórias para este template)</span>}
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
                    {serviceState.template && (
                        <BalcaoPreview
                            template={serviceState.template}
                            clientData={clientData}
                            serventiaData={DADOS_SERVENTIA}
                            quantidade={serviceState.quantidade} 
                            testemunhas={serviceState.testemunhas}
                        />
                    )}
                    {!serviceState.template && (
                        <div className="text-center p-8 text-gray-500 bg-gray-50 rounded-lg">
                            Selecione um serviço para ver a pré-visualização.
                        </div>
                    )}
                </div>

                {/* 5. AÇÃO FINALIZAR */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100 flex justify-end">
                    <button
                        type="button"
                        onClick={handleEmitirServico}
                        disabled={!serviceState.seloInfo || serviceState.quantidade < 1}
                        className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors disabled:bg-gray-400"
                    >
                        Finalizar e Emitir Selo(s) (Total: {formatCurrency(serviceState.valorTotal)})
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BalcaoServiceEmissionScreen;