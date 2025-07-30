import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, ArrowLeft, CheckCircle, Info, Store } from 'lucide-react';

interface EtapaPagamentoProps {
    pedido: any;
    setPedido: React.Dispatch<React.SetStateAction<any>>;
    onConfirmarPagamento: () => void;
    onVoltar: () => void;
}

const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export default function EtapaPagamento({ pedido, setPedido, onConfirmarPagamento, onVoltar }: EtapaPagamentoProps) {
    const [isDetalhesOpen, setIsDetalhesOpen] = useState(false);
    const { configuracao, pagamento } = pedido;
    const { valores } = configuracao;
    const navigate = useNavigate();

    const handleLocalPagamentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const local = e.target.value as 'agora' | 'caixa';
        setPedido((prev: any) => ({
            ...prev,
            pagamento: {
                ...prev.pagamento,
                metodo: local === 'caixa' ? 'caixa' : '',
            }
        }));
    };

    const handleMetodoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const metodo = e.target.value;
        setPedido((prev: any) => ({
            ...prev,
            pagamento: {
                ...prev.pagamento,
                metodo: metodo,
            }
        }));
    };

    const isConfirmacaoDisabled = !pagamento.metodo;

    if (pagamento.status === 'pago') {
        return (
            <div className="bg-white p-8 rounded-xl border border-green-300 shadow-sm text-center animate-fade-in">
                <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-green-800">Pagamento Confirmado!</h2>
                <p className="text-gray-600 mt-2">O pedido da certidão foi finalizado com sucesso.</p>
                <p className="text-sm text-gray-500 mt-4">Selo: <strong>{pedido.selo}</strong></p>
                <div className='flex items-center justify-center gap-4'>
                    <button
                        onClick={() => navigate('/registro-civil/certidoes')}
                        className="mt-6 bg-gray-400 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gray-500 transition-colors"
                    >
                        Voltar para a Página Inicial
                    </button>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                    >
                        Iniciar Novo Pedido
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-8">
            <h2 className="text-xl font-semibold text-purple-700 border-b pb-4">Etapa 3: Pagamento</h2>

            {/* Seção de Valores */}
            <div className="p-4 bg-gray-50 rounded-lg border">
                <h4 className="font-semibold text-gray-800 mb-3">Resumo de Valores</h4>
                <div className="flex justify-between items-center text-lg">
                    <span className="text-gray-600">Valor Total:</span>
                    <span className="font-bold text-purple-800">{formatCurrency(valores.total)}</span>
                </div>
                <button
                    onClick={() => setIsDetalhesOpen(!isDetalhesOpen)}
                    className="text-sm text-blue-600 hover:underline mt-2 flex items-center gap-1"
                >
                    <Info size={14} />
                    {isDetalhesOpen ? 'Ocultar detalhes' : 'Ver detalhes'}
                </button>
                {isDetalhesOpen && (
                    <div className="mt-4 border-t pt-3 space-y-2 text-sm animate-fade-in">
                        <div className="flex justify-between"><span className="text-gray-500">Emolumentos:</span> <span>{formatCurrency(valores.emolumentos)}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Fundos (FUNSEG/FUNGEP):</span> <span>{formatCurrency(valores.fundos)}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Taxas Administrativas:</span> <span>{formatCurrency(valores.taxas)}</span></div>
                    </div>
                )}
            </div>

            {/* Seção de Opções de Pagamento */}
            <div className="p-4 rounded-lg border">
                <h4 className="font-semibold text-gray-800 mb-4">Opções de Pagamento</h4>
                <div className="space-y-4">
                    {/* Escolha do Local de Pagamento */}
                    <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <legend className="sr-only">Local de Pagamento</legend>
                        <label className={`p-4 border rounded-lg flex items-center gap-3 cursor-pointer transition-all ${pagamento.metodo !== 'caixa' ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-300' : 'bg-white'}`}>
                            <input type="radio" name="localPagamento" value="agora" checked={pagamento.metodo !== 'caixa'} onChange={handleLocalPagamentoChange} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300" />
                            <DollarSign className="text-blue-700" />
                            <span className="font-semibold text-gray-700">Pagar agora</span>
                        </label>
                        <label className={`p-4 border rounded-lg flex items-center gap-3 cursor-pointer transition-all ${pagamento.metodo === 'caixa' ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-300' : 'bg-white'}`}>
                            <input type="radio" name="localPagamento" value="caixa" checked={pagamento.metodo === 'caixa'} onChange={handleLocalPagamentoChange} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300" />
                            <Store className="text-blue-700" />
                            <span className="font-semibold text-gray-700">Pagar no caixa</span>
                        </label>
                    </fieldset>

                    {/* Seletor de Forma de Pagamento (condicional) */}
                    {pagamento.metodo !== 'caixa' && (
                        <div className="animate-fade-in">
                            <label htmlFor="metodoPagamento" className="block text-sm font-medium text-gray-700">Forma de Pagamento</label>
                            <select
                                id="metodoPagamento"
                                value={pagamento.metodo || ''}
                                onChange={handleMetodoChange}
                                className="mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm"
                            >
                                <option value="">Selecione...</option>
                                <option value="dinheiro">Dinheiro</option>
                                <option value="credito">Cartão de Crédito</option>
                                <option value="debito">Cartão de Débito</option>
                                <option value="pix">PIX</option>
                                <option value="boleto">Boleto</option>
                            </select>
                        </div>
                    )}
                </div>
            </div>

            {/* Botões de Navegação */}
            <div className="text-right pt-6 border-t flex items-center justify-between">
                <button type="button" onClick={onVoltar} className="flex items-center gap-2 bg-gray-200 text-gray-800 font-semibold px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors">
                    <ArrowLeft size={18} />
                    Voltar
                </button>
                <button
                    onClick={onConfirmarPagamento}
                    disabled={isConfirmacaoDisabled}
                    className="bg-purple-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    <CheckCircle size={18} />
                    Confirmar Pagamento
                </button>
            </div>
        </div>
    );
}