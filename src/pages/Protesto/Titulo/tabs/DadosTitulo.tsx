import React from 'react';
import { type ITituloProtesto } from '../../types';
import { type IResultadoCalculoCompleto, type CondicaoPagamento } from '../../../Functions/calculoCustas';
import BancoSelect from '../../Components/BancoSelect';
import { Calculator, ChevronUp, AlertTriangle } from 'lucide-react';

// Props que este componente receberá do pai
interface TabDadosTituloProps {
    titulo: ITituloProtesto;
    setTitulo: React.Dispatch<React.SetStateAction<ITituloProtesto>>;
    calculoCustas: IResultadoCalculoCompleto | null;
    isCostVisible: boolean;
    setIsCostVisible: React.Dispatch<React.SetStateAction<boolean>>;
    BlocoResultado: React.FC<{ titulo: string; dados: any }>;
}

const TabDadosTitulo: React.FC<TabDadosTituloProps> = ({
    titulo,
    setTitulo,
    calculoCustas,
    isCostVisible,
    setIsCostVisible,
    BlocoResultado
}) => {
    const commonInputClass = "mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]";
    const commonLabelClass = "block text-sm font-medium text-gray-700";

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-700">Dados do Título</h2>
                <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 p-3 rounded-md">
                    <AlertTriangle className="h-6 w-6 text-yellow-600" />
                    <label htmlFor="isTituloAntigo" className="flex items-center gap-2 font-medium text-yellow-800 cursor-pointer">
                        <input
                            id="isTituloAntigo"
                            name="isTituloAntigo"
                            type="checkbox"
                            checked={titulo.isTituloAntigo || false}
                            onChange={(e) => setTitulo(t => ({...t, isTituloAntigo: e.target.checked}))}
                            className="h-5 w-5 text-yellow-600 rounded border-gray-300 focus:ring-yellow-500"
                        />
                        Este é um título antigo (preenchimento manual de todos os dados)
                    </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div><label className={commonLabelClass}>Espécie</label><input type="text" value={titulo.especieTitulo} onChange={(e) => setTitulo(t => ({...t, especieTitulo: e.target.value}))} className={commonInputClass} /></div>
                    <div><label className={commonLabelClass}>Nº do Título</label><input type="text" value={titulo.numeroTitulo} onChange={(e) => setTitulo(t => ({...t, numeroTitulo: e.target.value}))} className={commonInputClass} /></div>
                    <div><label className={commonLabelClass}>Valor (R$)</label><input type="number" value={titulo.valor} onChange={(e) => setTitulo(t => ({...t, valor: parseFloat(e.target.value) || 0}))} className={commonInputClass} /></div>
                    <div><label className={commonLabelClass}>Data de Emissão</label><input type="date" value={new Date(titulo.dataEmissao).toISOString().split('T')[0]} onChange={(e) => setTitulo(t => ({...t, dataEmissao: new Date(e.target.value)}))} className={commonInputClass} /></div>
                    <div><label className={commonLabelClass}>Data de Vencimento</label><input type="date" value={new Date(titulo.dataVencimento).toISOString().split('T')[0]} onChange={(e) => setTitulo(t => ({...t, dataVencimento: new Date(e.target.value)}))} className={commonInputClass} /></div>
                    <div><label className={commonLabelClass}>Tipo de Pagamento</label><select value={titulo.tipoPagamento} onChange={(e) => setTitulo(t => ({...t, tipoPagamento: e.target.value as CondicaoPagamento}))} className={commonInputClass}><option value="COMUM">Comum</option><option value="POSTERIOR">Posterior</option><option value="DIFERIDO">Diferido</option></select></div>
                    <div className="md:col-span-1">
                        <BancoSelect 
                            label="Banco"
                            selectedBankCode={titulo.banco}
                            onBankSelect={(banco) => {
                                setTitulo(prev => ({ ...prev, banco: banco ? banco.code : undefined }));
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className="border-t pt-6">
                <div className="bg-white rounded-xl">
                    <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsCostVisible(!isCostVisible)}>
                        <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                            <Calculator size={22}/> Custas e Valores
                        </h2>
                        <ChevronUp className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${!isCostVisible && 'rotate-180'}`} />
                    </div>
                    <div className={`grid transition-all duration-500 ease-in-out ${isCostVisible ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                        <div className="overflow-hidden">
                             <div className="pt-4">
                                {calculoCustas ? (
                                    <div className="space-y-4 animate-fade-in">
                                        <p className="font-semibold bg-blue-50 text-blue-700 text-center px-2 py-1 rounded-full text-sm">{calculoCustas.regraPrincipal}</p>
                                        <BlocoResultado titulo="Custas Iniciais" dados={calculoCustas.cobrancaInicial} />
                                        {calculoCustas.cobrancaFinal && (
                                            <div className="border-t-2 border-dashed pt-4 mt-4">
                                                <BlocoResultado titulo="Custas Finais (se liquidado)" dados={calculoCustas.cobrancaFinal} />
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-4">Aguardando dados para calcular...</p>
                                )}
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TabDadosTitulo