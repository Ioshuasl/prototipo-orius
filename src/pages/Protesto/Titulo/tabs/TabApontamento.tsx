import React from 'react';
import { type ITituloProtesto } from '../../types';
import { Flag } from 'lucide-react';

interface TabApontamentoProps {
    titulo: ITituloProtesto;
    setTitulo: React.Dispatch<React.SetStateAction<ITituloProtesto>>; // <-- Prop adicionada
}

const TabApontamento: React.FC<TabApontamentoProps> = ({ titulo, setTitulo }) => {
    const commonInputClass = "mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]";
    const commonLabelClass = "block text-sm font-medium text-gray-700";

    // Define se os campos são editáveis
    const isReadOnly = !titulo.isTituloAntigo && !!titulo.apontamento;
    const inputClass = isReadOnly ? `${commonInputClass} bg-gray-100 cursor-not-allowed` : commonInputClass;
    
    // Garante que o objeto exista para o formulário
    const apontamentoData = titulo.apontamento || { dataApontamento: new Date() };

    return (
        <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2"><Flag size={20}/> Dados do Apontamento</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <label className={commonLabelClass}>Data do Apontamento</label>
                    <input 
                        type="date" 
                        value={new Date(apontamentoData.dataApontamento).toISOString().split('T')[0]} 
                        readOnly={isReadOnly} 
                        className={inputClass}
                        // --- Lógica de atualização adicionada ---
                        onChange={(e) => setTitulo(t => ({
                            ...t, 
                            apontamento: {
                                ...t.apontamento!, 
                                dataApontamento: new Date(e.target.value)
                            }
                        }))}
                    />
                </div>
                <div className="md:col-span-3">
                    <label className={commonLabelClass}>Selos Gerados</label>
                    <input 
                        type="text" 
                        value={titulo.apontamento?.selosApontamento?.map(s => s.numeroselo).join(', ') || ''} 
                        readOnly 
                        className={`${commonInputClass} bg-gray-100 cursor-not-allowed`}
                    />
                </div>
            </div>
        </div>
    );
};

export default TabApontamento;