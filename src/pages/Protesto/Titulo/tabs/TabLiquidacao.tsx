import React from 'react';
import { type ITituloProtesto } from '../../types';
import { HandCoins } from 'lucide-react';

interface TabLiquidacaoProps {
    titulo: ITituloProtesto;
    setTitulo: React.Dispatch<React.SetStateAction<ITituloProtesto>>; // <-- Prop adicionada
}

const TabLiquidacao: React.FC<TabLiquidacaoProps> = ({ titulo, setTitulo }) => {
    const commonInputClass = "mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]";
    const commonLabelClass = "block text-sm font-medium text-gray-700";
    
    // Define se os campos são editáveis
    const isReadOnly = !titulo.isTituloAntigo && (titulo.status === 'Pago' || titulo.status === 'Retirado');
    const inputClass = isReadOnly ? `${commonInputClass} bg-gray-100 cursor-not-allowed` : commonInputClass;

    // Garante que o objeto exista para o formulário, mesmo que o título seja novo
    const liquidacaoData = titulo.liquidacaoOuDesistencia || { data: new Date(), tipo: 'LIQUIDACAO', seloLiquidacaoDesistencia: { numeroselo: '', codigo: 0 }};

    // Condição de renderização
    if (!titulo.liquidacaoOuDesistencia && !titulo.isTituloAntigo) {
        return <p className="text-gray-500">Esta etapa não se aplica a este título no momento.</p>;
    }

    return (
        <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2"><HandCoins size={20}/> Dados da Liquidação ou Desistência</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <label className={commonLabelClass}>Data</label>
                    <input 
                        type="date" 
                        value={new Date(liquidacaoData.data).toISOString().split('T')[0]} 
                        readOnly={isReadOnly} 
                        className={inputClass}
                        onChange={(e) => setTitulo(t => ({...t, liquidacaoOuDesistencia: {...t.liquidacaoOuDesistencia!, data: new Date(e.target.value)}}))}
                    />
                </div>
                <div>
                    <label className={commonLabelClass}>Tipo</label>
                    <select 
                        value={liquidacaoData.tipo} 
                        disabled={isReadOnly} 
                        className={inputClass}
                        onChange={(e) => setTitulo(t => ({...t, liquidacaoOuDesistencia: {...t.liquidacaoOuDesistencia!, tipo: e.target.value as 'LIQUIDACAO' | 'DESISTENCIA'}}))}
                    >
                        <option value="LIQUIDACAO">Liquidação</option>
                        <option value="DESISTENCIA">Desistência</option>
                    </select>
                </div>
                <div className="md:col-span-2">
                    <label className={commonLabelClass}>Selo</label>
                    <input 
                        type="text" 
                        value={liquidacaoData.seloLiquidacaoDesistencia.numeroselo} 
                        readOnly={isReadOnly} 
                        className={inputClass}
                        onChange={(e) => setTitulo(t => ({...t, liquidacaoOuDesistencia: {...t.liquidacaoOuDesistencia!, seloLiquidacaoDesistencia: {...t.liquidacaoOuDesistencia!.seloLiquidacaoDesistencia, numeroselo: e.target.value }}}))}
                    />
                </div>
            </div>
        </div>
    );
};

export default TabLiquidacao;