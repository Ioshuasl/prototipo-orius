import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, ChevronLeft, MoreVertical, ReceiptTextIcon, ChevronRight, FilterX, Loader2, ListX, SlidersHorizontal, ChevronUp, Wallet, Landmark, ReceiptText, CalendarDays, X, FileText, Printer, BookOpen } from 'lucide-react';
import MainEditor from '../../Components/MainEditor';
// Importa as interfaces e mocks necessários
import { mockBalcaoTemplates, mockTipoServicoBalcao, mockReciboTemplates } from '../lib/Constants';
// Importei a função de gerar recibo do seu Gerenciamento-Servicos.tsx para simular
//import { generateReciboHtml } from '../../Functions/replaceReciboHtml'; 

// --- ESTRUTURA DE TIPOS E DADOS SIMULADOS ---
// O tipo ServiceStatus é usado tanto para Balcão quanto para outros serviços
type ServiceStatus = 'Pago' | 'Aguardando Pagamento' | 'Cancelado';
// A interface que representa um serviço de balcão já realizado
export interface BalcaoServiceRecord {
    id: number;
    protocol: string;
    clientName: string;
    serviceType: string; // Ex: Reconhecimento, Autenticação
    registrationDate: Date;
    value: number;
    status: ServiceStatus;
    sealNumber: string[]; // Selo(s)
    templateId: string; // ID do modelo de etiqueta/termo utilizado
}

// Dados mockados filtrados para Tabelionato (MANTIDO O MESMO ARRAY, APENAS COPIADO POR CLAREZA)
const mockBalcaoServiceRecords: BalcaoServiceRecord[] = [
    {
        id: 101, protocol: '2025-N-00101', clientName: 'Felipe Souza', serviceType: 'Reconhecimento de Firma',
        registrationDate: new Date(2025, 8, 10, 10, 30), value: 25.00, status: 'Pago',
        sealNumber: ['N-123456'], templateId: 'BALCAO-REC-001'
    },
    {
        id: 102, protocol: '2025-N-00102', clientName: 'Laura Gomes', serviceType: 'Cópia Autenticada',
        registrationDate: new Date(2025, 8, 10, 11, 0), value: 15.00, status: 'Aguardando Pagamento',
        sealNumber: ['N-123457', 'N-123458'], templateId: 'BALCAO-AUT-001'
    },
    {
        id: 103, protocol: '2025-N-00103', clientName: 'Roberto Alves', serviceType: 'Abono de Firma',
        registrationDate: new Date(2025, 8, 11, 9, 0), value: 50.00, status: 'Pago',
        sealNumber: [], templateId: 'BALCAO-REC-001'
    },
    {
        id: 104, protocol: '2025-N-00104', clientName: 'Comercial Beta Ltda', serviceType: 'Reconhecimento de Firma',
        registrationDate: new Date(2025, 8, 11, 14, 0), value: 25.00, status: 'Cancelado',
        sealNumber: ['N-123459'], templateId: 'BALCAO-REC-002'
    },
    // Adicionar mais dados para paginação
    ...Array.from({ length: 15 }, (_, i) => ({
        id: 200 + i,
        protocol: `2025-N-${String(200 + i).padStart(5, '0')}`,
        clientName: `Cliente Teste ${i}`,
        serviceType: i % 2 === 0 ? 'Reconhecimento de Firma' : 'Cópia Autenticada',
        registrationDate: new Date(2025, 8, 12, 12, 0 + i),
        value: 20.00 + i,
        status: (i % 3 === 0 ? 'Pago' : 'Aguardando Pagamento') as ServiceStatus,
        sealNumber: i % 4 === 0 ? [] : [`N-${7000 + i}`],
        templateId: i % 2 === 0 ? 'BALCAO-REC-001' : 'BALCAO-AUT-001',
    } as BalcaoServiceRecord)),
];

const statusOptions: ServiceStatus[] = ['Pago', 'Aguardando Pagamento', 'Cancelado'];
// O filtro agora usa os Tipos de Serviço (ex: Reconhecimento, Autenticação)
const serviceTypeBalcaoOptions = [...new Set(mockBalcaoServiceRecords.map(record => record.serviceType))];

const mmToPx = (mm: number): number => Math.floor(mm * 3.78);

// Função mock para simular a substituição de variáveis no HTML do Modelo de Balcão
const generateBalcaoHtml = (template: any, record: BalcaoServiceRecord): string => {
    let content = template.conteudo;
    content = content.replace('{{ NOME_DA_FIRMA }}', record.clientName);
    content = content.replace('{{ NUMERO_DO_SELO }}', record.sealNumber.join(', ') || 'NÃO APLICÁVEL');
    content = content.replace('{{ DATA_POR_EXTENSO }}', record.registrationDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }));
    content = content.replace('{{ NOME_DO_OFICIAL }}', 'OFICIAL TESTE');
    return content;
};

// Nova função mock para simular a substituição de variáveis no HTML do Recibo
// *Substitua esta função pela sua 'generateReciboHtml' real*
const generateReciboHtml = (template: any, record: BalcaoServiceRecord): string => {
    let content = template.conteudo;
    content = content.replace('{{ CLIENTE_NOME }}', record.clientName);
    content = content.replace('{{ SERVICO_TIPO }}', record.serviceType);
    content = content.replace('{{ VALOR_TOTAL }}', `R$ ${record.value.toFixed(2)}`);
    content = content.replace('{{ PROTOCOLO }}', record.protocol);
    return content;
};


export default function GerenciamentoBalcaoServicos() {
    // ALTERADO: Removido o filtro 'sistema'
    const initialFilters = {
        searchTerm: '', status: 'Todos', serviceType: 'Todos', // serviceType agora é o tipo de balcão
        startDate: '', endDate: '', withSeal: 'Todos',
    };

    const [filters, setFilters] = useState(initialFilters);
    const [filteredRecords, setFilteredRecords] = useState<BalcaoServiceRecord[]>(mockBalcaoServiceRecords);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [filtersVisible, setFiltersVisible] = useState(false);
    const recordsPerPage = 9;

    const [isTemplateSelectionModalOpen, setIsTemplateSelectionModalOpen] = useState(false);
    const [isReciboTemplateSelectionModalOpen, setIsReciboTemplateSelectionModalOpen] = useState(false); // NOVO
    const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);

    const [selectedRecord, setSelectedRecord] = useState<BalcaoServiceRecord | null>(null);
    const [editorContent, setEditorContent] = useState('');
    const [editorMargins, setEditorMargins] = useState({ top: '1.0', right: '1.0', bottom: '1.0', left: '1.0' });
    const [editorSize, setEditorSize] = useState({ width: 70 * 3.78, height: 50 * 3.78 });
    const [isModelPrint, setIsModelPrint] = useState(true); // Controla se estamos imprimindo Modelo de Balcão (true) ou Recibo (false)

    const [isSealsModalOpen, setIsSealsModalOpen] = useState(false);

    // --- Lógica de Filtragem (Mantida e ajustada) ---
    useEffect(() => {
        setIsLoading(true);

        const filterTimeout = setTimeout(() => {
            const results = mockBalcaoServiceRecords.filter(record => {
                const searchTermMatch = filters.searchTerm ?
                    record.clientName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                    record.protocol.includes(filters.searchTerm) : true;

                const statusMatch = filters.status !== 'Todos' ? record.status === filters.status : true;

                // ALTERADO: Filtra pelo tipo de serviço de balcão
                const serviceTypeMatch = filters.serviceType !== 'Todos' ? record.serviceType === filters.serviceType : true;

                const withSealMatch =
                    filters.withSeal === 'Todos' ||
                    (filters.withSeal === 'Sim' && record.sealNumber.length > 0) ||
                    (filters.withSeal === 'Não' && record.sealNumber.length === 0);

                const regStartDateMatch = filters.startDate ? record.registrationDate >= new Date(filters.startDate) : true;
                const regEndDateMatch = filters.endDate ? record.registrationDate <= new Date(filters.endDate + 'T23:59:59.999') : true;

                return searchTermMatch && statusMatch && serviceTypeMatch && withSealMatch && regStartDateMatch && regEndDateMatch;
            });

            const sortedResults = results.sort((a, b) => b.registrationDate.getTime() - a.registrationDate.getTime());

            setFilteredRecords(sortedResults);
            setCurrentPage(1);
            setIsLoading(false);
        }, 300);

        return () => clearTimeout(filterTimeout);
    }, [filters]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleClearFilters = () => {
        setFilters(initialFilters);
    };

    // --- Fluxo de Emissão/Impressão do MODELO DE BALCÃO ---
    const handleOpenModelTemplateModal = (record: BalcaoServiceRecord) => {
        setSelectedRecord(record);
        setIsModelPrint(true);
        setIsTemplateSelectionModalOpen(true);
    };

    const handleModelTemplateSelection = (templateId: string) => {
        const template = mockBalcaoTemplates.find((t: any) => t.id === templateId);
        if (template && selectedRecord) {
            const initialHtml = generateBalcaoHtml(template, selectedRecord);
            setEditorContent(initialHtml);
            setEditorMargins(template.margins);

            const minHeightPx = 200;
            setEditorSize({
                width: mmToPx(template.layout.largura_mm),
                height: Math.max(mmToPx(template.layout.altura_mm), minHeightPx)
            });

            setIsTemplateSelectionModalOpen(false);
            setIsEditorModalOpen(true);
        } else {
            alert('Modelo ou serviço não encontrado!');
        }
    };

    // --- Fluxo de Emissão do RECIBO ---
    const handleOpenReciboTemplateModal = (record: BalcaoServiceRecord) => {
        setSelectedRecord(record);
        setIsModelPrint(false);
        setIsReciboTemplateSelectionModalOpen(true);
    };

    const handleReciboTemplateSelection = (templateId: string) => {
        const template = mockReciboTemplates.find((t: any) => t.id === templateId);
        if (template && selectedRecord) {
            const initialHtml = generateReciboHtml(template, selectedRecord);
            setEditorContent(initialHtml);
            setEditorMargins(template.margins);

            // Recibos costumam ser A4 ou A5. Usamos o layout do template.
            setEditorSize({
                width: mmToPx(template.layout.largura_mm),
                height: mmToPx(template.layout.altura_mm)
            });

            setIsReciboTemplateSelectionModalOpen(false);
            setIsEditorModalOpen(true);
        } else {
            alert('Modelo de recibo ou serviço não encontrado!');
        }
    };

    // --- Funções de Modal e Impressão (Ajustadas) ---

    const handleOpenSealsModal = (record: BalcaoServiceRecord) => {
        setSelectedRecord(record);
        setIsSealsModalOpen(true);
    };

    const handleCancelEditor = () => {
        setIsEditorModalOpen(false);
        // Opcional: Reabrir a tela de seleção de templates, se necessário.
        // if (isModelPrint) { setIsTemplateSelectionModalOpen(true); } else { setIsReciboTemplateSelectionModalOpen(true); }
    };

    const handlePrint = () => {
        const title = isModelPrint ? 'Modelo de Balcão' : 'Recibo';
        const printWindow = window.open('', '', 'height=600,width=800');
        if (printWindow) {
            printWindow.document.write(`<html><head><title>${title}</title>`);
            // Estilos para impressão: margem zero para que o conteúdo do editor com suas margens CSS domine
            printWindow.document.write('<style>body { font-family: sans-serif; margin: 0; padding: 0; } @page { size: auto; margin: 0; }</style>');
            printWindow.document.write('</head><body>');
            printWindow.document.write(editorContent);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
        }
    };

    const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
    const paginatedRecords = filteredRecords.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

    const StatusBadge = ({ status }: { status: ServiceStatus }) => {
        const styles: Record<ServiceStatus, string> = {
            Pago: 'bg-green-100 text-green-800 border-green-200',
            'Aguardando Pagamento': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            Cancelado: 'bg-red-100 text-red-800 border-red-200',
        };
        return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${styles[status]}`}>{status}</span>;
    };

    const BalcaoServiceCard = ({ record }: { record: BalcaoServiceRecord }) => {
        const templateUsed = mockBalcaoTemplates.find((t: any) => t.id === record.templateId);
        const templateName = templateUsed ? templateUsed.titulo : 'Modelo Padrão';

        return (
            <div className="block group">
                <div className="bg-white rounded-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:border-gray-300 overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                        <div className="flex justify-between items-start gap-4">
                            <div>
                                <h3 className="font-bold text-gray-800 text-lg leading-tight">{record.clientName}</h3>
                                <p className="text-sm text-gray-500">{record.serviceType}</p>
                            </div>
                            <StatusBadge status={record.status} />
                        </div>
                    </div>

                    <div className="p-4 grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-start gap-2"><Landmark className="h-4 w-4 mt-0.5 text-gray-400" /><div><p className="text-xs text-gray-500">Protocolo</p><p className="font-medium text-gray-700">{record.protocol}</p></div></div>
                        <div className="flex items-start gap-2"><Wallet className="h-4 w-4 mt-0.5 text-gray-400" /><div><p className="text-xs text-gray-500">Valor Total</p><p className="font-medium text-gray-700">R$ {record.value.toFixed(2)}</p></div></div>

                        <div className="flex items-start gap-2">
                            <ReceiptText className="h-4 w-4 mt-0.5 text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500">Selo(s)</p>
                                {record.sealNumber.length > 0 ? (
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium text-gray-700">{record.sealNumber.length} selo(s)</p>
                                    </div>
                                ) : (
                                    <p className="font-medium text-gray-700">Não possui</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-start gap-2"><BookOpen className="h-4 w-4 mt-0.5 text-gray-400" /><div><p className="text-xs text-gray-500">Modelo Usado</p><p className="font-medium text-gray-700 truncate">{templateName}</p></div></div>
                        <div className="flex items-start gap-2"><CalendarDays className="h-4 w-4 mt-0.5 text-gray-400" /><div><p className="text-xs text-gray-500">Data e Hora</p><p className="font-medium text-gray-700">{record.registrationDate.toLocaleString('pt-BR')}</p></div></div>
                    </div>

                    <div className="p-4 border-t border-gray-100 flex justify-end items-center">
                        <div className="flex items-center gap-2">
                            {record.sealNumber.length > 0 && (
                                <button
                                    onClick={() => { handleOpenSealsModal(record) }}
                                    className="flex bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                                >
                                    Ver Selos
                                </button>
                            )}

                            {/* NOVO: Botão Emitir Recibo */}
                            <button
                                onClick={() => handleOpenReciboTemplateModal(record)}
                                className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-1"
                            >
                                <Printer size={16} /> Recibo
                            </button>

                            {/* Re-imprimir Modelo (Etiqueta/Termo) */}
                            <button
                                onClick={() => handleOpenModelTemplateModal(record)}
                                className="bg-[#dd6825]/10 text-[#dd6825] px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-[#dd6825]/20 transition-colors flex items-center gap-1"
                            >
                                <Printer size={16} /> Etiqueta
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const BalcaoServiceCardV2 = ({ record, handleOpenSealsModal, handleOpenReciboTemplateModal, handleOpenModelTemplateModal }: { record: BalcaoServiceRecord, handleOpenSealsModal: (record: BalcaoServiceRecord) => void, handleOpenReciboTemplateModal: (record: BalcaoServiceRecord) => void, handleOpenModelTemplateModal: (record: BalcaoServiceRecord) => void }) => {
        // ESTADO PARA CONTROLAR O DROPDOWN
        const [isDropdownOpen, setIsDropdownOpen] = useState(false);

        // Função utilitária do seu GerenciamentoBalcaoServicos.tsx para o Badge
        const StatusBadge = ({ status }: { status: ServiceStatus }) => {
            const styles: Record<ServiceStatus, string> = {
                Pago: 'bg-green-100 text-green-800 border-green-200',
                'Aguardando Pagamento': 'bg-yellow-100 text-yellow-800 border-yellow-200',
                Cancelado: 'bg-red-100 text-red-800 border-red-200',
            };
            return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${styles[status]}`}>{status}</span>;
        };

        const templateUsed = mockBalcaoTemplates.find((t: any) => t.id === record.templateId);
        const templateName = templateUsed ? templateUsed.titulo : 'Modelo Padrão';

        return (
            <div className="block group">
                <div className="bg-white rounded-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:border-gray-300 overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                        <div className="flex justify-between items-start gap-4">
                            <div>
                                <h3 className="font-bold text-gray-800 text-lg leading-tight">{record.clientName}</h3>
                                <p className="text-sm text-gray-500">{record.serviceType}</p>
                            </div>
                            <StatusBadge status={record.status} />
                        </div>
                    </div>

                    <div className="p-4 grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-start gap-2"><Landmark className="h-4 w-4 mt-0.5 text-gray-400" /><div><p className="text-xs text-gray-500">Protocolo</p><p className="font-medium text-gray-700">{record.protocol}</p></div></div>
                        <div className="flex items-start gap-2"><Wallet className="h-4 w-4 mt-0.5 text-gray-400" /><div><p className="text-xs text-gray-500">Valor Total</p><p className="font-medium text-gray-700">R$ {record.value.toFixed(2)}</p></div></div>

                        <div className="flex items-start gap-2">
                            <ReceiptTextIcon className="h-4 w-4 mt-0.5 text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500">Selo(s)</p>
                                <p className="font-medium text-gray-700">{record.sealNumber.length} selo(s)</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-2"><CalendarDays className="h-4 w-4 mt-0.5 text-gray-400" /><div><p className="text-xs text-gray-500">Data e Hora</p><p className="font-medium text-gray-700">{record.registrationDate.toLocaleString('pt-BR')}</p></div></div>
                    </div>

                    {/* --- AÇÕES COMPACTADAS EM UM BOTÃO DROPDOwN --- */}
                    <div className="border-gray-100 flex justify-end relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="p-2 rounded-full text-gray-700 hover:bg-gray-100 transition-colors relative"
                        >
                            <MoreVertical size={20} />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-4 bottom-12 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-20 overflow-hidden">
                                <div className="py-1">
                                    <button
                                        onClick={() => { setIsDropdownOpen(false); handleOpenModelTemplateModal(record); }}
                                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-[#dd6825] hover:bg-[#dd6825]/10"
                                    >
                                        <Printer size={16} /> Re-imprimir Etiqueta
                                    </button>
                                    <button
                                        onClick={() => { setIsDropdownOpen(false); handleOpenReciboTemplateModal(record); }}
                                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        <FileText size={16} /> Emitir Recibo
                                    </button>
                                    {record.sealNumber.length > 0 && (
                                        <button
                                            onClick={() => { setIsDropdownOpen(false); handleOpenSealsModal(record); }}
                                            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <ReceiptText size={16} /> Ver Selos
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Overlay para fechar o menu ao clicar fora */}
                    {isDropdownOpen && <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>}
                </div>
            </div>
        );
    };

    return (
        <>
            <title>Gerenciamento de Serviços de Balcão | Tabelionato</title>
            <div className="flex bg-gray-50 font-sans">
                <main className="flex-1">
                    <div className="mx-auto space-y-4">
                        <header className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-[#4a4e51]">Serviços de Balcão Realizados</h1>
                                <p className="text-md text-gray-500 mt-1">Consulte, filtre e reimprima termos/etiquetas do Tabelionato de Notas.</p>
                            </div>
                            <Link to="cadastrar" className="flex items-center gap-2 bg-[#dd6825] text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-[#c25a1f] transition-all duration-300 hover:scale-105">
                                <PlusCircle className="h-5 w-5" /> Registrar Novo Serviço
                            </Link>
                        </header>

                        {/* --- FILTROS --- */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                            <div className="flex justify-between items-center p-4 cursor-pointer" onClick={() => setFiltersVisible(!filtersVisible)}>
                                <div className="flex items-center gap-3">
                                    <SlidersHorizontal className="h-5 w-5 text-gray-600" />
                                    <h2 className="font-semibold text-gray-800 text-lg">Filtros de Busca</h2>
                                </div>
                                <button className="p-1 rounded-full hover:bg-gray-100">
                                    <ChevronUp className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${!filtersVisible && 'rotate-180'}`} />
                                </button>
                            </div>

                            <div className={`grid transition-all duration-500 ease-in-out ${filtersVisible ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                <div className="overflow-hidden">
                                    <div className="p-5 space-y-2 pt-0">
                                        <div>
                                            <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-600 mb-1">Buscar por Protocolo, Cliente ou Tipo de Serviço</label>
                                            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input id="searchTerm" type="text" name="searchTerm" value={filters.searchTerm} onChange={handleFilterChange} placeholder="Digite para buscar..." className="border border-gray-300 rounded-md pl-10 pr-4 py-2 w-full focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]" /></div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <div><label htmlFor="status" className="block text-sm font-medium text-gray-600 mb-1">Status do Serviço</label><select id="status" name="status" value={filters.status} onChange={handleFilterChange} className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]"><option>Todos</option>{statusOptions.map(s => <option key={s}>{s}</option>)}</select></div>

                                            {/* ALTERADO: Filtro por Tipo de Serviço de Balcão */}
                                            <div><label htmlFor="serviceType" className="block text-sm font-medium text-gray-600 mb-1">Tipo de Serviço de Balcão</label><select id="serviceType" name="serviceType" value={filters.serviceType} onChange={handleFilterChange} className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]"><option>Todos</option>{serviceTypeBalcaoOptions.map(b => <option key={b}>{b}</option>)}</select></div>

                                            <div><label htmlFor="withSeal" className="block text-sm font-medium text-gray-600 mb-1">Possui Selo?</label><select id="withSeal" name="withSeal" value={filters.withSeal} onChange={handleFilterChange} className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]"><option>Todos</option><option>Sim</option><option>Não</option></select></div>

                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div><label className="block text-sm font-medium text-gray-600 mb-1">Período do Serviço</label><div className="flex items-center gap-2"><input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]" /><span className="text-gray-500">até</span><input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]" /></div></div>
                                        </div>
                                        <div className="flex justify-end pt-4"><button type="button" onClick={handleClearFilters} className="flex items-center gap-2 bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"><FilterX className="h-5 w-5" />Limpar Filtros</button></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* --- LISTAGEM DE CARDS --- */}
                        <div className="min-h-[400px] relative">
                            {isLoading ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50 rounded-xl z-10"><Loader2 className="h-10 w-10 text-[#dd6825] animate-spin" /></div>
                            ) : paginatedRecords.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {paginatedRecords.map(record => (
                                        <BalcaoServiceCardV2 // ALTERADO AQUI
                                            key={record.id}
                                            record={record}
                                            handleOpenModelTemplateModal={handleOpenModelTemplateModal}
                                            handleOpenReciboTemplateModal={handleOpenReciboTemplateModal}
                                            handleOpenSealsModal={handleOpenSealsModal}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center text-center text-gray-500 bg-white rounded-xl h-full border-2 border-dashed py-10">
                                    <ListX className="h-12 w-12 mb-4" />
                                    <h3 className="text-lg font-semibold">Nenhum serviço de balcão encontrado</h3>
                                    <p>Tente ajustar ou limpar os filtros para ver mais resultados.</p>
                                </div>
                            )}
                        </div>

                        {/* --- PAGINAÇÃO --- */}
                        <nav className="flex items-center justify-between pt-4">
                            <p className="text-sm text-gray-600">
                                Mostrando <span className="font-semibold">{paginatedRecords.length > 0 ? ((currentPage - 1) * recordsPerPage) + 1 : 0}</span> a <span className="font-semibold">{Math.min(currentPage * recordsPerPage, filteredRecords.length)}</span> de <span className="font-semibold">{filteredRecords.length}</span> serviços
                            </p>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1 || isLoading} className="p-2 rounded-md transition-colors bg-white border text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronLeft className="h-5 w-5" /></button>
                                <span className="text-sm font-semibold text-gray-700">Página {currentPage} de {totalPages > 0 ? totalPages : 1}</span>
                                <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages || isLoading} className="p-2 rounded-md transition-colors bg-white border text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronRight className="h-5 w-5" /></button>
                            </div>
                        </nav>
                    </div>
                </main>
            </div>

            {/* --- MODAL DE VISUALIZAÇÃO DE SELOS --- (MANTIDO) */}
            {isSealsModalOpen && selectedRecord && (
                <div className="fixed inset-0 z-50 flex justify-center items-center p-4 animate-fade-in-fast bg-gray-900/50 backdrop-blur-sm">
                    {/* ... (Conteúdo do modal de selos) ... */}
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-sm max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center p-4 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800">Selos do Protocolo: {selectedRecord.protocol}</h2>
                            <button onClick={() => setIsSealsModalOpen(false)} className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="p-4 overflow-auto">
                            <ul className="space-y-2">
                                {selectedRecord.sealNumber.map((seal, index) => (
                                    <li key={index} className="bg-gray-100 p-2 rounded-md text-sm font-medium text-gray-700">
                                        {seal}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="p-4 border-t border-gray-200 flex justify-end">
                            <button onClick={() => setIsSealsModalOpen(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* --- MODAL DE SELEÇÃO DE TEMPLATE (MODELO DE BALCÃO) --- */}
            {isTemplateSelectionModalOpen && isModelPrint && (
                <div className="fixed inset-0 z-50 flex justify-center items-center p-4 animate-fade-in-fast bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center p-4 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800">Selecione o Modelo de Balcão</h2>
                            <button onClick={() => setIsTemplateSelectionModalOpen(false)} className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-auto">
                            {mockBalcaoTemplates.map((template: any) => (
                                <div
                                    key={template.id}
                                    className="bg-gray-50 border border-gray-200 rounded-lg p-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-[#dd6825]"
                                    onClick={() => handleModelTemplateSelection(template.id)}
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <FileText className="h-6 w-6 text-[#dd6825]" />
                                        <h3 className="font-semibold text-lg text-gray-800">{template.titulo}</h3>
                                    </div>
                                    <p className="text-sm text-gray-600">{template.descricao}</p>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t border-gray-200 flex justify-end">
                            <button onClick={() => setIsTemplateSelectionModalOpen(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- NOVO: MODAL DE SELEÇÃO DE TEMPLATE (RECIBO) --- */}
            {isReciboTemplateSelectionModalOpen && !isModelPrint && (
                <div className="fixed inset-0 z-50 flex justify-center items-center p-4 animate-fade-in-fast bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center p-4 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800">Selecione o Template de Recibo</h2>
                            <button onClick={() => setIsReciboTemplateSelectionModalOpen(false)} className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-auto">
                            {mockReciboTemplates.map((template: any) => (
                                <div
                                    key={template.id}
                                    className="bg-gray-50 border border-gray-200 rounded-lg p-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-[#dd6825]"
                                    onClick={() => handleReciboTemplateSelection(template.id)}
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <FileText className="h-6 w-6 text-[#dd6825]" />
                                        <h3 className="font-semibold text-lg text-gray-800">{template.titulo}</h3>
                                    </div>
                                    <p className="text-sm text-gray-600">{template.descricao}</p>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t border-gray-200 flex justify-end">
                            <button onClick={() => setIsReciboTemplateSelectionModalOpen(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* --- MODAL DO EDITOR DE TEXTO (IMPRESSÃO FINAL) --- */}
            {isEditorModalOpen && selectedRecord && (
                <div className="fixed inset-0 z-50 flex justify-center items-center p-4 animate-fade-in-fast bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center p-4 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800">{isModelPrint ? 'Re-imprimir Modelo' : 'Emitir Recibo'} - Protocolo: {selectedRecord.protocol}</h2>
                            <button onClick={() => setIsEditorModalOpen(false)} className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto p-4 flex flex-col items-center">
                            <MainEditor
                                initialValue={editorContent}
                                onEditorChange={setEditorContent}
                                margins={editorMargins}
                                size={editorSize}
                                isMinimal={isModelPrint} // Usa o modo minimalista para Etiquetas (Modelos de Balcão)
                            />
                            <p className="text-xs text-gray-500 mt-2">O documento será impresso no tamanho do modelo selecionado (largura {editorSize.width / 3.78}mm, altura {editorSize.height / 3.78}mm).</p>
                        </div>
                        <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
                            <button
                                onClick={handleCancelEditor}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                                Cancelar
                            </button>
                            <button onClick={handlePrint} className="bg-[#dd6825] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#c25a1f] transition-colors flex items-center gap-1">
                                <Printer size={18} /> Imprimir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}