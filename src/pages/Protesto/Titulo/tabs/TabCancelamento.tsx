import React from 'react';
import { type ITituloProtesto } from '../../types';
import { BadgeX } from 'lucide-react';

interface TabCancelamentoProps {
    titulo: ITituloProtesto;
    setTitulo: React.Dispatch<React.SetStateAction<ITituloProtesto>>; // <-- Prop adicionada
}

const TabCancelamento: React.FC<TabCancelamentoProps> = ({ titulo, setTitulo }) => {
    const commonInputClass = "mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]";
    const commonLabelClass = "block text-sm font-medium text-gray-700";

    // Define se os campos são editáveis
    const isReadOnly = !titulo.isTituloAntigo && titulo.status === 'Cancelado';
    const inputClass = isReadOnly ? `${commonInputClass} bg-gray-100 cursor-not-allowed` : commonInputClass;

    // Garante que o objeto exista para o formulário
    const cancelamentoData = titulo.cancelamento || { data: new Date(), motivo: 'Anuência do Credor', selosCancelamento: { numeroselo: '', codigo: 0 } };

    if (!titulo.cancelamento && !titulo.isTituloAntigo) {
        return <p className="text-gray-500">Este protesto não foi cancelado.</p>;
    }

    return (
        <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2"><BadgeX size={20} /> Dados do Cancelamento</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <label className={commonLabelClass}>Data</label>
                    <input
                        type="date"
                        value={new Date(cancelamentoData.data).toISOString().split('T')[0]}
                        readOnly={isReadOnly}
                        className={inputClass}
                        onChange={(e) => setTitulo(t => ({ ...t, cancelamento: { ...t.cancelamento!, data: new Date(e.target.value) } }))}
                    />
                </div>
                <div className="md:col-span-2">
                    <label className={commonLabelClass}>Motivo</label>
                    <select
                        value={cancelamentoData.motivo}
                        disabled={isReadOnly}
                        className={inputClass}
                        onChange={(e) => setTitulo(t => ({ ...t, cancelamento: { ...t.cancelamento!, motivo: e.target.value as any } }))}
                    >
                        <option value="Anuência do Credor">Anuência do Credor</option>
                        <option value="Ordem Judicial">Ordem Judicial</option>
                        <option value="Pagamento">Pagamento</option>
                    </select>
                </div>
                <div>
                    <label className={commonLabelClass}>Selo</label>
                    <input
                        type="text"
                        value={cancelamentoData.selosCancelamento?.numeroselo || ''}
                        className={inputClass}
                    />
                </div>
            </div>
        </div>
    );
};

export default TabCancelamento;