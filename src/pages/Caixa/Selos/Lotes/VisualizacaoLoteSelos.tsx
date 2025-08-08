import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Package, FileText, CalendarDays, Wallet, ReceiptText, User, Repeat, XCircle, Box, AlertTriangle, CheckCircle, Upload, Pencil, X, Loader2 } from 'lucide-react';
import { mockSealBatches } from './Gerenciamento-LotesSelos';

type SealSituation = 'Disponível' | 'Utilizando' | 'Exportado' | 'Cancelado' | 'Redimensionado';

interface SealValues {
    emolumentos: number;
    taxaJudiciaria: number;
    iss: number;
    total: number;
}

interface Seal {
    sealNumber: string;
    sealSituation: SealSituation;
    personName: string | null;
    sealValue: SealValues;
    exported: boolean;
    exportationDate: Date | null;
    resized: boolean;
    resizingDate: Date | null;
    linkedSeals: string[] | null;
}

interface SealBatch {
    id: number;
    protocoloCompra: string;
    dataCompra: Date;
    quantidade: number;
    intervaloNumeracao: string;
    status: 'Ativo' | 'Esgotado' | 'Baixado';
    descricao: string;
    tipo_ato_selo: number;
    seals: Seal[];
}

const getSituationBadgeStyles = (situation: SealSituation) => {
    switch (situation) {
        case 'Disponível':
            return 'bg-green-100 text-green-800 border-green-200';
        case 'Utilizando':
            return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'Exportado':
            return 'bg-purple-100 text-purple-800 border-purple-200';
        case 'Cancelado':
            return 'bg-red-100 text-red-800 border-red-200';
        case 'Redimensionado':
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

const getSituationIcon = (situation: SealSituation) => {
    switch (situation) {
        case 'Disponível':
            return <CheckCircle className="h-4 w-4 text-green-600" />;
        case 'Utilizando':
            return <Box className="h-4 w-4 text-blue-600" />;
        case 'Exportado':
            return <Upload className="h-4 w-4 text-purple-600" />;
        case 'Cancelado':
            return <XCircle className="h-4 w-4 text-red-600" />;
        case 'Redimensionado':
            return <Repeat className="h-4 w-4 text-yellow-600" />;
        default:
            return null;
    }
};

export default function VisualizacaoLoteSelos() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [lote, setLote] = useState<SealBatch | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editedSealData, setEditedSealData] = useState<Seal | null>(null);

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            const foundLote = mockSealBatches.find(b => b.id.toString() === id);
            setLote(foundLote || null);
            setIsLoading(false);
        }, 500);
    }, [id]);

    const getActionDate = (seal: Seal) => {
        if (seal.exportationDate) return seal.exportationDate.toLocaleString('pt-BR');
        if (seal.resizingDate) return seal.resizingDate.toLocaleString('pt-BR');
        return 'N/A';
    };

    const handleExportSeal = (sealNumber: string) => alert(`Simulando exportação do selo: ${sealNumber}`);
    const handleCancelSeal = (sealNumber: string) => alert(`Simulando cancelamento do selo: ${sealNumber}`);

    const handleEditSeal = (seal: Seal) => {
        setEditedSealData({ ...seal });
        setIsEditModalOpen(true);
    };

    const handleSaveEditedSeal = () => {
        alert(`Simulando salvamento das alterações para o selo: ${editedSealData?.sealNumber}`);
        setIsEditModalOpen(false);
    };
    
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Loader2 className="h-10 w-10 text-[#dd6825] animate-spin" />
            </div>
        );
    }

    if (!lote) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-gray-50 min-h-screen">
                <AlertTriangle className="h-16 w-16 text-yellow-500 mb-4" />
                <h1 className="text-3xl font-bold text-gray-800">Lote não encontrado</h1>
                <p className="text-md text-gray-600 mt-2">O lote de selo com o ID "{id}" não foi encontrado. Verifique se o ID está correto.</p>
                <button
                    onClick={() => navigate('/caixa/selos/lotes')}
                    className="mt-6 flex items-center gap-2 bg-[#dd6825] text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-[#c25a1f] transition-all duration-300"
                >
                    <ChevronLeft className="h-5 w-5" /> Voltar para Lotes
                </button>
            </div>
        );
    }

    return (
        <>
            <title>Visualização do Lote #{lote.id}</title>
            <div className="flex bg-gray-50 font-sans p-8">
                <main className="flex-1">
                    <div className="mx-auto space-y-4">
                        <header className="flex items-center justify-between">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <ChevronLeft className="h-5 w-5" />
                                <h1 className="text-3xl font-bold text-[#4a4e51]">Lote de Selo #{lote.id}</h1>
                            </button>
                        </header>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
                            <h2 className="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-2">Detalhes do Lote</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                <div className="flex items-center gap-2"><Package className="h-4 w-4 text-gray-400" /><div><p className="text-xs text-gray-500">Protocolo de Compra</p><p className="font-medium text-gray-700">{lote.protocoloCompra}</p></div></div>
                                <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-gray-400" /><div><p className="text-xs text-gray-500">Descrição do Selo</p><p className="font-medium text-gray-700">{lote.descricao}</p></div></div>
                                <div className="flex items-center gap-2"><ReceiptText className="h-4 w-4 text-gray-400" /><div><p className="text-xs text-gray-500">ID do Selo</p><p className="font-medium text-gray-700">{lote.tipo_ato_selo}</p></div></div>
                                <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-gray-400" /><div><p className="text-xs text-gray-500">Data da Compra</p><p className="font-medium text-gray-700">{lote.dataCompra.toLocaleDateString('pt-BR')}</p></div></div>
                                <div className="flex items-center gap-2"><Box className="h-4 w-4 text-gray-400" /><div><p className="text-xs text-gray-500">Quantidade de Selos</p><p className="font-medium text-gray-700">{lote.quantidade}</p></div></div>
                                <div className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-gray-400" /><div><p className="text-xs text-gray-500">Status do Lote</p><p className={`font-semibold px-2.5 py-1 text-xs rounded-full border ${lote.status === 'Ativo' ? 'bg-green-100 text-green-800' : lote.status === 'Esgotado' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{lote.status}</p></div></div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-800 p-6 border-b border-gray-200">Selos no Lote ({lote.seals.length})</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Número do Selo</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Situação</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Pessoa Vinculada</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Valor Total</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Data da Ação</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Selos Vinculados</th>
                                            <th scope="col" className="relative px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {lote.seals.map(seal => (
                                            <tr key={seal.sealNumber}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{seal.sealNumber}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <span className={`inline-flex items-center gap-2 px-2.5 py-1 text-xs font-semibold rounded-full border ${getSituationBadgeStyles(seal.sealSituation)}`}>
                                                        {getSituationIcon(seal.sealSituation)} {seal.sealSituation}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{seal.personName || 'N/A'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ {seal.sealValue.total.toFixed(2)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getActionDate(seal)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{seal.linkedSeals?.join(', ') || 'N/A'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    {/* --- Lógica para os botões de ação dinâmica --- */}
                                                    {seal.sealSituation === 'Utilizando' && (
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => handleExportSeal(seal.sealNumber)}
                                                                className="text-purple-500 hover:text-purple-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                                                                aria-label="Exportar Selo"
                                                                title="Exportar Selo"
                                                            >
                                                                <Upload className="h-5 w-5" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleEditSeal(seal)}
                                                                className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                                                                aria-label="Editar Selo"
                                                                title="Editar Selo"
                                                            >
                                                                <Pencil className="h-5 w-5" />
                                                            </button>
                                                        </div>
                                                    )}
                                                    {seal.sealSituation === 'Exportado' && (
                                                        <button
                                                            onClick={() => handleCancelSeal(seal.sealNumber)}
                                                            className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                                                            aria-label="Cancelar Selo"
                                                            title="Cancelar Selo"
                                                        >
                                                            <X className="h-5 w-5" />
                                                        </button>
                                                    )}
                                                    {seal.sealSituation === 'Redimensionado' && (
                                                        <button
                                                            onClick={() => handleCancelSeal(seal.sealNumber)}
                                                            className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                                                            aria-label="Cancelar Redimensionamento"
                                                            title="Cancelar Redimensionamento"
                                                        >
                                                            <X className="h-5 w-5" />
                                                        </button>
                                                    )}
                                                    {/* Selo 'Disponível' e 'Cancelado' não têm botões */}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* --- MODAL DE EDIÇÃO DO SELO --- */}
            {isEditModalOpen && editedSealData && (
                <div className="fixed inset-0 z-50 flex justify-center items-center p-4 animate-fade-in-fast bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center p-4 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800">Editar Selo: {editedSealData.sealNumber}</h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4 overflow-y-auto">
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label htmlFor="personName" className="block text-sm font-medium text-gray-700">Pessoa Vinculada</label>
                                    <input
                                        id="personName"
                                        type="text"
                                        value={editedSealData.personName || ''}
                                        onChange={(e) => setEditedSealData(prev => prev ? { ...prev, personName: e.target.value } : null)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="sealSituation" className="block text-sm font-medium text-gray-700">Situação</label>
                                    <select
                                        id="sealSituation"
                                        value={editedSealData.sealSituation}
                                        onChange={(e) => setEditedSealData(prev => prev ? { ...prev, sealSituation: e.target.value as SealSituation } : null)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    >
                                        <option value="Disponível">Disponível</option>
                                        <option value="Utilizando">Utilizando</option>
                                        <option value="Exportado">Exportado</option>
                                        <option value="Cancelado">Cancelado</option>
                                        <option value="Redimensionado">Redimensionado</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-4 p-4 bg-gray-100 rounded-md">
                                <h3 className="text-base font-semibold text-gray-800 mb-2">Valores (Somente Leitura)</h3>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <p><strong>Emolumentos:</strong> R$ {editedSealData.sealValue.emolumentos.toFixed(2)}</p>
                                    <p><strong>Taxa Judiciária:</strong> R$ {editedSealData.sealValue.taxaJudiciaria.toFixed(2)}</p>
                                    <p><strong>ISS:</strong> R$ {editedSealData.sealValue.iss.toFixed(2)}</p>
                                    <p><strong>Total:</strong> R$ {editedSealData.sealValue.total.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveEditedSeal}
                                className="bg-[#dd6825] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#c25a1f] transition-colors"
                            >
                                Salvar Alterações
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}