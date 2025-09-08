import React from 'react';
import { type ITituloProtesto } from '../../types';
import { Gavel } from 'lucide-react';
import { livrosDeProtestoSimulados } from '../../lib/Constants';

interface TabProtestoProps {
    titulo: ITituloProtesto;
    setTitulo: React.Dispatch<React.SetStateAction<ITituloProtesto>>;
}

const TabProtesto: React.FC<TabProtestoProps> = ({ titulo, setTitulo }) => {
    const commonInputClass = "mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]";
    const commonLabelClass = "block text-sm font-medium text-gray-700";
    const isReadOnly = !titulo.isTituloAntigo && titulo.status === 'Protestado';
    const inputClass = isReadOnly ? `${commonInputClass} bg-gray-100 cursor-not-allowed` : commonInputClass;

    if (!titulo.protesto && !titulo.isTituloAntigo) {
        return <p className="text-gray-500">Este título ainda não foi protestado.</p>;
    }

    const protestoData = titulo.protesto || { dataLavratura: new Date(), motivo: 'Falta de Pagamento', livro: '', folha: '' };

    // Filtra para mostrar apenas os livros de protesto que estão abertos
    const livrosAbertos = livrosDeProtestoSimulados.filter(
        livro => livro.tipo === 'Livro de Protesto' && livro.situacao === 'Aberto'
    );

    return (
        <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2"><Gavel size={20}/> Dados do Protesto</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <label className={commonLabelClass}>Data Lavratura</label>
                    <input 
                        type="date" 
                        value={new Date(protestoData.dataLavratura).toISOString().split('T')[0]} 
                        readOnly={isReadOnly} 
                        className={inputClass}
                        onChange={(e) => setTitulo(t => ({...t, protesto: {...t.protesto!, dataLavratura: new Date(e.target.value)}}))}
                    />
                </div>
                
                <div>
                    <label className={commonLabelClass}>Livro</label>
                    <select 
                        value={protestoData.livro} 
                        disabled={isReadOnly} 
                        className={inputClass}
                        onChange={(e) => setTitulo(t => ({...t, protesto: {...t.protesto!, livro: e.target.value}}))}
                    >
                        <option value="" disabled>Selecione um livro...</option>
                        {livrosAbertos.map(livro => (
                            <option key={livro.id} value={`${livro.tipo} - Nº ${livro.numero}`}>
                                Livro {livro.numero} (Folha Atual: {livro.folhaAtual})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className={commonLabelClass}>Folha</label>
                    <input 
                        type="text" 
                        value={protestoData.folha} 
                        readOnly={isReadOnly} 
                        className={inputClass}
                        onChange={(e) => setTitulo(t => ({...t, protesto: {...t.protesto!, folha: e.target.value}}))}
                    />
                </div>
                <div>
                    <label className={commonLabelClass}>Motivo</label>
                    <input 
                        type="text" 
                        value={protestoData.motivo} 
                        readOnly={isReadOnly} 
                        className={inputClass}
                        onChange={(e) => setTitulo(t => ({...t, protesto: {...t.protesto!, motivo: e.target.value as any}}))}
                    />
                </div>
                <div className="md:col-span-4">
                    <label className={commonLabelClass}>Selos</label>
                    <input 
                        type="text" 
                        value={titulo.protesto?.selosProtesto?.map(s => s.numeroselo).join(', ') || ''} 
                        readOnly 
                        className={`${commonInputClass} bg-gray-100 cursor-not-allowed`}
                    />
                </div>
            </div>
        </div>
    );
};

export default TabProtesto;