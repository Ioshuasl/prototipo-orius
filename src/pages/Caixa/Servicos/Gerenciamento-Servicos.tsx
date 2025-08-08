import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, ChevronLeft, ChevronRight, FilterX, Loader2, ListX, SlidersHorizontal, ChevronUp, Wallet, Landmark, ReceiptText, BookMarked, CalendarDays, X, FileText } from 'lucide-react';
import MainEditor from '../../Components/MainEditor';
import { mockReciboTemplates } from '../../Civil/lib/Constants';
import { generateReciboHtml } from '../../Functions/replaceReciboHtml';

// --- ESTRUTURA DE TIPOS E DADOS SIMULADOS ---
type Sistemas = "Registro Civil" | "Registro de Imóveis" | "Tabelionato de Notas" | "Protesto de Títulos" | "RTD" | "Caixa"
type ServiceStatus = 'Pago' | 'Aguardando Pagamento' | 'Cancelado';
type serviceTypesExemplo = 'Certidão de Nascimento' | 'Escritura de Compra e Venda' | 'Protesto de Título' | 'Cópia Autenticada' | 'Reconhecimento de Firma';

export interface ServiceRecord {
    id: number;
    protocol: string;
    clientName: string;
    serviceType: serviceTypesExemplo;
    sistema: Sistemas
    registrationDate: Date;
    value: number;
    status: ServiceStatus;
    withSeal: boolean;
    sealNumber: string[]; // Alterado para um array de strings
}

const mockServiceRecords: ServiceRecord[] = [
    {
        id: 1,
        protocol: '2025-S-00001',
        clientName: 'Ana Clara Souza',
        serviceType: 'Certidão de Nascimento',
        sistema: 'Registro Civil',
        registrationDate: new Date(2025, 7, 1, 10, 30),
        value: 85.50,
        status: 'Pago',
        withSeal: true,
        sealNumber: ['SEL-00001', 'SEL-00002'], // Múltiplos selos
    },
    {
        id: 2,
        protocol: '2025-S-00002',
        clientName: 'Pedro Martins',
        serviceType: 'Escritura de Compra e Venda',
        sistema: 'Tabelionato de Notas',
        registrationDate: new Date(2025, 7, 1, 11, 45),
        value: 1250.00,
        status: 'Aguardando Pagamento',
        withSeal: true,
        sealNumber: ['SEL-00003'], // Um único selo
    },
    {
        id: 3,
        protocol: '2025-S-00003',
        clientName: 'Maria Silva',
        serviceType: 'Cópia Autenticada',
        sistema: 'Tabelionato de Notas',
        registrationDate: new Date(2025, 7, 2, 9, 15),
        value: 15.00,
        status: 'Pago',
        withSeal: false,
        sealNumber: [], // Sem selo
    },
    {
        id: 4,
        protocol: '2025-S-00004',
        clientName: 'João Oliveira',
        serviceType: 'Protesto de Título',
        sistema: 'Protesto de Títulos',
        registrationDate: new Date(2025, 7, 2, 14, 0),
        value: 150.75,
        status: 'Pago',
        withSeal: true,
        sealNumber: ['SEL-00004', 'SEL-00005', 'SEL-00006'], // Múltiplos selos
    },
    {
        id: 5,
        protocol: '2025-S-00005',
        clientName: 'Camila Rodrigues',
        serviceType: 'Reconhecimento de Firma',
        sistema: "Tabelionato de Notas",
        registrationDate: new Date(2025, 7, 3, 16, 30),
        value: 20.00,
        status: 'Pago',
        withSeal: false,
        sealNumber: [],
    },
    {
        id: 6,
        protocol: '2025-S-00006',
        clientName: 'Ricardo Almeida',
        serviceType: 'Escritura de Compra e Venda',
        sistema: "Tabelionato de Notas",
        registrationDate: new Date(2025, 7, 3, 11, 0),
        value: 980.00,
        status: 'Pago',
        withSeal: true,
        sealNumber: ['SEL-00007'],
    },
    {
        id: 7,
        protocol: '2025-S-00007',
        clientName: 'Julia Costa',
        serviceType: 'Certidão de Nascimento',
        sistema: "Registro Civil",
        registrationDate: new Date(2025, 7, 4, 8, 45),
        value: 85.50,
        status: 'Aguardando Pagamento',
        withSeal: true,
        sealNumber: ['SEL-00008', 'SEL-00009'],
    },
    {
        id: 8,
        protocol: '2025-S-00008',
        clientName: 'Fernando Pereira',
        serviceType: 'Protesto de Título',
        sistema: "Protesto de Títulos",
        registrationDate: new Date(2025, 7, 4, 17, 10),
        value: 150.75,
        status: 'Cancelado',
        withSeal: true,
        sealNumber: ['SEL-00010'],
    },
    {
        id: 9,
        protocol: '2025-S-00009',
        clientName: 'Luiza Lima',
        serviceType: 'Cópia Autenticada',
        sistema: "Tabelionato de Notas",
        registrationDate: new Date(2025, 7, 5, 10, 0),
        value: 25.00,
        status: 'Pago',
        withSeal: false,
        sealNumber: [],
    },
    {
        id: 10,
        protocol: '2025-S-00010',
        clientName: 'Carlos Eduardo',
        serviceType: 'Reconhecimento de Firma',
        sistema: "Tabelionato de Notas",
        registrationDate: new Date(2025, 7, 5, 12, 50),
        value: 20.00,
        status: 'Pago',
        withSeal: false,
        sealNumber: [],
    },
];

const statusOptions: ServiceStatus[] = ['Pago', 'Aguardando Pagamento', 'Cancelado'];
const serviceOptions = [...new Set(mockServiceRecords.map(record => record.serviceType))];
const sistemaOptions = [...new Set(mockServiceRecords.map(record => record.sistema))];

const mmToPx = (mm: number): number => Math.floor(mm * 3.78);

export default function ServiceManagementPage() {
    const initialFilters = {
        searchTerm: '', status: 'Todos', serviceType: 'Todos',
        sistema: 'Todos', startDate: '', endDate: '', withSeal: 'Todos',
    };

    const [filters, setFilters] = useState(initialFilters);
    const [filteredRecords, setFilteredRecords] = useState<ServiceRecord[]>(mockServiceRecords);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [filtersVisible, setFiltersVisible] = useState(false);
    const recordsPerPage = 9;

    const [isTemplateSelectionModalOpen, setIsTemplateSelectionModalOpen] = useState(false);
    const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<ServiceRecord | null>(null);
    const [editorContent, setEditorContent] = useState('');
    const [editorMargins, setEditorMargins] = useState({ top: '2.0', right: '2.0', bottom: '2.0', left: '2.0' });
    const [editorSize, setEditorSize] = useState({ width: 794, height: 1123 });

    const [isSealsModalOpen, setIsSealsModalOpen] = useState(false);

    useEffect(() => {
        setIsLoading(true);

        const filterTimeout = setTimeout(() => {
            const results = mockServiceRecords.filter(record => {
                const searchTermMatch = filters.searchTerm ?
                    record.clientName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                    record.protocol.includes(filters.searchTerm) : true;

                const statusMatch = filters.status !== 'Todos' ? record.status === filters.status : true;

                const serviceTypeMatch = filters.serviceType !== 'Todos' ? record.serviceType === filters.serviceType : true;

                // --- CORREÇÃO DA LÓGICA DO FILTRO PARA "Possui Selo?" ---
                const withSealMatch =
                    filters.withSeal === 'Todos' ||
                    (filters.withSeal === 'Sim' && record.sealNumber.length > 0) ||
                    (filters.withSeal === 'Não' && record.sealNumber.length === 0);
                // --------------------------------------------------------

                const sistemaMatch = filters.sistema !== 'Todos' ? record.sistema === filters.sistema : true;

                const regStartDateMatch = filters.startDate ? record.registrationDate >= new Date(filters.startDate) : true;
                const regEndDateMatch = filters.endDate ? record.registrationDate <= new Date(filters.endDate + 'T23:59:59.999') : true;

                return searchTermMatch && statusMatch && serviceTypeMatch && withSealMatch && sistemaMatch && regStartDateMatch && regEndDateMatch;
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

    const handleOpenTemplateModal = (record: ServiceRecord) => {
        setSelectedRecord(record);
        setIsTemplateSelectionModalOpen(true);
    };

    const handleTemplateSelection = (templateId: string) => {
        const template = mockReciboTemplates.find(t => t.id === templateId);
        if (template && selectedRecord) {
            const initialHtml = generateReciboHtml(template, selectedRecord);
            setEditorContent(initialHtml);
            setEditorMargins(template.margins);
            setEditorSize({
                width: mmToPx(template.layout.largura_mm),
                height: mmToPx(template.layout.altura_mm)
            });
            setIsTemplateSelectionModalOpen(false);
            setIsEditorModalOpen(true);
        } else {
            alert('Template ou serviço não encontrado!');
        }
    };

    const handleCancelEditor = () => {
        setIsEditorModalOpen(false);
        setIsTemplateSelectionModalOpen(true);
    };

    const handleOpenSealsModal = (record: ServiceRecord) => {
        setSelectedRecord(record);
        setIsSealsModalOpen(true);
    };

    const handlePrintReceipt = () => {
        const printWindow = window.open('', '', 'height=600,width=800');
        if (printWindow) {
            printWindow.document.write('<html><head><title>Recibo</title>');
            printWindow.document.write('<style>body { font-family: sans-serif; }</style>');
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

    const ServiceCard = ({ record }: { record: ServiceRecord }) => {

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

                        {/* NOVO: Exibe a quantidade de selos e o botão para ver todos */}
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

                        <div className="flex items-start gap-2"><BookMarked className="h-4 w-4 mt-0.5 text-gray-400" /><div><p className="text-xs text-gray-500">Sistema</p><p className="font-medium text-gray-700">{record.sistema}</p></div></div>
                        <div className="flex items-start gap-2"><CalendarDays className="h-4 w-4 mt-0.5 text-gray-400" /><div><p className="text-xs text-gray-500">Data e Hora</p><p className="font-medium text-gray-700">{record.registrationDate.toLocaleString('pt-BR')}</p></div></div>
                    </div>

                    <div className="p-4 border-t border-gray-100 flex justify-end items-center">
                        <div className="flex items-center gap-2">
                            {record.sealNumber.length > 0 ? (
                                <button 
                                onClick={() => {handleOpenSealsModal(record)}} 
                                className="flex bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                                >
                                    Ver Selos
                                </button>
                            ): (
                                <div></div>
                            )}
                            <button
                                onClick={() => {handleOpenTemplateModal(record)}}
                                className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                            >
                                Emitir Recibo
                            </button>
                            <Link
                                to="/caixa/impressao/relatorio-servico-realizado"
                                className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                            >
                                Imprimir Relatório
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <title>Gerenciamento de Serviços</title>
            <div className="flex bg-gray-50 font-sans">
                <main className="flex-1">
                    <div className="mx-auto space-y-4">
                        <header className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-[#4a4e51]">Gerenciamento de Serviços Realizados</h1>
                                <p className="text-md text-gray-500 mt-1">Consulte e gerencie todos os serviços realizados pelo cartório.</p>
                            </div>
                            <Link to="/caixa/servicos/cadastrar" className="flex items-center gap-2 bg-[#dd6825] text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-[#c25a1f] transition-all duration-300 hover:scale-105">
                                <PlusCircle className="h-5 w-5" /> Registrar Novo Serviço
                            </Link>
                        </header>

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
                                            <div><label htmlFor="sistema" className="block text-sm font-medium text-gray-600 mb-1">Sistema</label><select id="sistema" name="sistema" value={filters.sistema} onChange={handleFilterChange} className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]"><option>Todos</option>{sistemaOptions.map(s => <option key={s}>{s}</option>)}</select></div>
                                            <div><label htmlFor="withSeal" className="block text-sm font-medium text-gray-600 mb-1">Possui Selo?</label><select id="withSeal" name="withSeal" value={filters.withSeal} onChange={handleFilterChange} className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]"><option>Todos</option><option>Sim</option><option>Não</option></select></div>
                                            <div><label htmlFor="serviceType" className="block text-sm font-medium text-gray-600 mb-1">Tipo de Serviço</label><select id="serviceType" name="serviceType" value={filters.serviceType} onChange={handleFilterChange} className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]"><option>Todos</option>{serviceOptions.map(b => <option key={b}>{b}</option>)}</select></div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div><label className="block text-sm font-medium text-gray-600 mb-1">Período do Serviço</label><div className="flex items-center gap-2"><input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]" /><span className="text-gray-500">até</span><input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]" /></div></div>
                                        </div>
                                        <div className="flex justify-end pt-4"><button type="button" onClick={handleClearFilters} className="flex items-center gap-2 bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"><FilterX className="h-5 w-5" />Limpar Filtros</button></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="min-h-[400px] relative">
                            {isLoading ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50 rounded-xl z-10"><Loader2 className="h-10 w-10 text-[#dd6825] animate-spin" /></div>
                            ) : paginatedRecords.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {paginatedRecords.map(record => (
                                        <ServiceCard key={record.id} record={record} />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center text-center text-gray-500 bg-white rounded-xl h-full border-2 border-dashed py-10">
                                    <ListX className="h-12 w-12 mb-4" />
                                    <h3 className="text-lg font-semibold">Nenhum serviço encontrado</h3>
                                    <p>Tente ajustar ou limpar os filtros para ver mais resultados.</p>
                                </div>
                            )}
                        </div>

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

            {/* --- MODAL DE VISUALIZAÇÃO DE SELOS --- */}
            {isSealsModalOpen && selectedRecord && (
                <div className="fixed inset-0 z-50 flex justify-center items-center p-4 animate-fade-in-fast bg-gray-900/50 backdrop-blur-sm">
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


            {/* --- MODAL DE SELEÇÃO DE TEMPLATE --- */}
            {isTemplateSelectionModalOpen && (
                <div className="fixed inset-0 z-50 flex justify-center items-center p-4 animate-fade-in-fast bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center p-4 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800">Selecione o Template de Recibo</h2>
                            <button onClick={() => setIsTemplateSelectionModalOpen(false)} className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-auto">
                            {mockReciboTemplates.map(template => (
                                <div
                                    key={template.id}
                                    className="bg-gray-50 border border-gray-200 rounded-lg p-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-[#dd6825]"
                                    onClick={() => handleTemplateSelection(template.id)}
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

            {/* --- MODAL DO EDITOR DE TEXTO --- */}
            {isEditorModalOpen && selectedRecord && (
                <div className="fixed inset-0 z-50 flex justify-center items-center p-4 animate-fade-in-fast bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center p-4 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800">Emitir Recibo - Protocolo: {selectedRecord.protocol}</h2>
                            <button onClick={() => setIsEditorModalOpen(false)} className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto p-4">
                            <MainEditor
                                initialValue={editorContent}
                                onEditorChange={setEditorContent}
                                margins={editorMargins}
                                size={editorSize}
                            />
                        </div>
                        <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
                            <button
                                onClick={handleCancelEditor}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                                Cancelar
                            </button>
                            <button onClick={handlePrintReceipt} className="bg-[#dd6825] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#c25a1f] transition-colors">
                                Imprimir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}