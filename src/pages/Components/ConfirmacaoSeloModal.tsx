// src/components/ConfirmacaoSeloModal.tsx (versão ligeiramente modificada)

import { ShieldCheck, X } from 'lucide-react';
import { type ITituloProtesto } from '../Protesto/types'; // Ajuste o caminho

// A interface IParsedData agora pode conter um label customizado
export interface IParsedData {
    label: string; // Ex: Nome do Devedor, ou "Ação de Intimação"
    tituloData: Partial<ITituloProtesto>;
    seloId: number;
}

interface IEmolumento {
    descricao_selo: string;
    id_selo: number;
}

interface ConfirmacaoSeloModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    parsedData: IParsedData[];
    emolumentos: IEmolumento[];
    title?: string; // Título customizável para o modal
}

export default function ConfirmacaoSeloModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    parsedData, 
    emolumentos,
    title = "Confirmação de Geração de Selos" // Título padrão
}: ConfirmacaoSeloModalProps) {
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center p-4 animate-fade-in-fast bg-gray-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="h-6 w-6 text-blue-600" />
                        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                        <X className="h-6 w-6" />
                    </button>
                </div>
                <div className="p-6 overflow-auto">
                    <p className="text-gray-600 text-center mb-4">
                        O seguinte selo será gerado. Por favor, confirme se a atribuição está correta.
                    </p>
                    <div className="border rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 text-left font-semibold text-gray-600">Item</th>
                                    <th className="px-4 py-2 text-left font-semibold text-gray-600">ID Selo</th>
                                    <th className="px-4 py-2 text-left font-semibold text-gray-600">Descrição do Selo</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {parsedData.map((item, index) => {
                                    const seloInfo = emolumentos.find(s => s.id_selo === item.seloId);
                                    return (
                                        <tr key={index}>
                                            <td className="px-4 py-2 font-medium text-gray-800">{item.label}</td>
                                            <td className="px-4 py-2 font-mono text-blue-700">{item.seloId}</td>
                                            <td className="px-4 py-2 text-gray-600">{seloInfo ? seloInfo.descricao_selo : 'Descrição não encontrada'}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 border-t flex justify-end gap-3">
                     <button onClick={onClose} className="font-semibold text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100">Cancelar</button>
                    <button onClick={onConfirm} className="font-bold text-white bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700">Confirmar e Gerar Selo</button>
                </div>
            </div>
        </div>
    );
}