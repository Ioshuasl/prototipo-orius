import React from 'react';
import { type ITituloProtesto } from '../../types';
import { Mail, HandCoins, Gavel } from 'lucide-react';

interface TabIntimacaoProps {
    titulo: ITituloProtesto;
    setTitulo: React.Dispatch<React.SetStateAction<ITituloProtesto>>; // <-- Prop adicionada
    onLiquidar: () => void; // <-- Nova prop
    onProtestar: () => void; // <-- Nova prop
}

const TabIntimacao: React.FC<TabIntimacaoProps> = ({ titulo, setTitulo, onLiquidar, onProtestar }) => {
    const commonInputClass = "mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]";
    const commonLabelClass = "block text-sm font-medium text-gray-700";

    // Define se os campos são editáveis
    const isReadOnly = !titulo.isTituloAntigo && !!titulo.intimacao;
    const inputClass = isReadOnly ? `${commonInputClass} bg-gray-100 cursor-not-allowed` : commonInputClass;

    // Garante que o objeto exista para o formulário, mesmo que o título seja novo
    const intimacaoData = titulo.intimacao || { data: new Date(), meio: 'Pessoal', detalhes: '' };

    if (!titulo.intimacao && !titulo.isTituloAntigo) {
        return <p className="text-gray-500">Esta etapa não se aplica a este título no momento.</p>;
    }

    return (
        <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2"><Mail size={20}/> Dados da Intimação</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <label className={commonLabelClass}>Data</label>
                    <input 
                        type="date" 
                        value={new Date(intimacaoData.data).toISOString().split('T')[0]} 
                        readOnly={isReadOnly} 
                        className={inputClass}
                        onChange={(e) => setTitulo(t => ({...t, intimacao: {...t.intimacao!, data: new Date(e.target.value)}}))}
                    />
                </div>
                <div>
                    <label className={commonLabelClass}>Meio</label>
                    <select 
                        value={intimacaoData.meio} 
                        disabled={isReadOnly} 
                        className={inputClass}
                        onChange={(e) => setTitulo(t => ({...t, intimacao: {...t.intimacao!, meio: e.target.value as 'Pessoal' | 'Postal' | 'Edital'}}))}
                    >
                        <option value="Pessoal">Pessoal</option>
                        <option value="Postal">Postal (AR)</option>
                        <option value="Edital">Edital</option>
                    </select>
                </div>
                <div className="md:col-span-2">
                    <label className={commonLabelClass}>Detalhes</label>
                    <input 
                        type="text" 
                        value={intimacaoData.detalhes} 
                        readOnly={isReadOnly} 
                        className={inputClass}
                        onChange={(e) => setTitulo(t => ({...t, intimacao: {...t.intimacao!, detalhes: e.target.value}}))}
                        placeholder="Ex: N° do AR, nome do recebedor..."
                    />
                </div>
                <div className="md:col-span-4">
                    <label className={commonLabelClass}>Selos</label>
                    <input 
                        type="text" 
                        value={titulo.intimacao?.selosIntimacao?.map(s => s.numeroselo).join(', ') || ''} 
                        readOnly 
                        className={`${commonInputClass} bg-gray-100 cursor-not-allowed`}
                    />
                </div>
            </div>
            {['Aguardando Intimação', 'Prazo Aberto'].includes(titulo.status) && (
                 <footer className="mt-6 pt-4 border-t border-gray-200 flex justify-end gap-3">
                    <button 
                        onClick={onLiquidar}
                        className="flex items-center gap-2 bg-green-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <HandCoins size={18} />
                        Liquidar
                    </button>
                    <button 
                        onClick={onProtestar}
                        className="flex items-center gap-2 bg-red-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        <Gavel size={18} />
                        Protestar Título
                    </button>
                </footer>
            )}
        </div>
    );
};

export default TabIntimacao;