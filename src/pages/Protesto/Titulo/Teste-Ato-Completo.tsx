import { useState, useEffect } from 'react';
import { Calculator, RefreshCw } from 'lucide-react';
import SeletorDePessoa from '../../Components/SeletorDePessoa';
import { type IEndereco, type IPessoaFisica, type IPessoaJuridica, type ITituloProtesto, type TPessoaTipo } from '../types';

// --- IMPORTAÇÃO DA LÓGICA DE CÁLCULO ---
// (Ajuste o caminho se o seu arquivo calculoCustas.ts estiver em outro local)
import {
    calcularAtoCompletoProtesto,
    calcularCustoAtoUnico,
    type IResultadoCalculoCompleto,
    type IResultadoCalculoUnitario,
    type CondicaoPagamento,
} from '../../Functions/calculoCustas';


// --- LÓGICA E INTERFACES DE CÁLCULO REMOVIDAS DESTE ARQUIVO ---
// Toda a definição de IEmolumentoProtesto, IResultadoCalculoUnitario, etc.,
// e as funções calcularCustoAtoUnico e calcularAtoCompletoProtesto
// agora vêm do arquivo importado.


// --- DADOS DE EXEMPLO E COMPONENTE ---
const mockEndereco: IEndereco = { cep: '74000-000', logradouro: 'Rua Fictícia', numero: '123', bairro: 'Centro', cidade: 'Goiânia', uf: 'GO', tipoLogradouro: 'Rua' };
const mockPfComum: IPessoaFisica = { tipo: 'fisica', nome: 'Pessoa Física Comum', cpf: '111.111.111-11', endereco: mockEndereco, dataNascimento: '1990-01-01', docIdentidadeNum: '123', docIdentidadeTipo: 'RG', nacionalidade: 'Brasileira', naturalidadeCidade: 'Goiânia', naturalidadeUF: 'GO', profissao: 'Tester' };
const mockPjComum: IPessoaJuridica = { tipo: 'juridica', razaoSocial: 'Empresa Comum Ltda', cnpj: '11.111.111/0001-11', endereco: mockEndereco, situacao_tributaria: 'Simples Nacional' };
const mockPjMei: IPessoaJuridica = { tipo: 'juridica', razaoSocial: 'Microempreendedor Individual MEI', cnpj: '22.222.222/0001-22', endereco: mockEndereco, situacao_tributaria: 'MEI' };
const initialDevedorState: TPessoaTipo = { tipo: 'fisica', nome: '', cpf: '', endereco: mockEndereco, dataNascimento: '', docIdentidadeNum: '', docIdentidadeTipo: '', nacionalidade: '', naturalidadeCidade: '', naturalidadeUF: '', profissao: ''};

export default function TesteAtoCompletoPage() {
    const [devedor, setDevedor] = useState<TPessoaTipo>(initialDevedorState);
    const [valorTitulo, setValorTitulo] = useState<number>(1000.00);
    const [tipoPagamento, setTipoPagamento] = useState<CondicaoPagamento>('COMUM');
    const [resultado, setResultado] = useState<IResultadoCalculoCompleto | null>(null);
    const [erro, setErro] = useState<string>('');
    const [acaoSimulada, setAcaoSimulada] = useState<string>('nenhuma');
    const [resultadoSimulacao, setResultadoSimulacao] = useState<IResultadoCalculoUnitario | null>(null);

    const handleCalcular = () => {
        setAcaoSimulada('nenhuma');
        setResultadoSimulacao(null);
        setResultado(null);
        setErro('');
        if (!devedor || (devedor.tipo === 'fisica' ? !devedor.cpf : !devedor.cnpj)) {
            setErro("Por favor, preencha os dados do devedor.");
            return;
        }
        const tituloParaTeste: ITituloProtesto = {
            id: 1, protocolo: 'TESTE-001', status: 'Aguardando Qualificação', 
            apresentante: mockPjComum, devedores: [devedor], especieTitulo: 'Duplicata Mercantil',
            numeroTitulo: 'DM-TESTE', valor: valorTitulo, dataEmissao: new Date(), dataVencimento: new Date(),
            tipoPagamento: tipoPagamento,
            apontamento: { dataApontamento: new Date() }
        };
        const calculo = calcularAtoCompletoProtesto(tituloParaTeste);
        if (calculo) {
            setResultado(calculo);
        } else {
            setErro("Não foi possível calcular o valor completo do ato. Verifique as regras e o console.");
        }
    };

    useEffect(() => {
        if (acaoSimulada === 'nenhuma' || !devedor) {
            setResultadoSimulacao(null);
            return;
        }
        
        const tituloParaTeste: ITituloProtesto = {
            id: 1, protocolo: 'TESTE-001', status: 'Aguardando Qualificação',
            apresentante: mockPjComum, devedores: [devedor], especieTitulo: 'Duplicata Mercantil',
            numeroTitulo: 'DM-TESTE', valor: valorTitulo, dataEmissao: new Date(), dataVencimento: new Date(),
            tipoPagamento: tipoPagamento,
            apontamento: { dataApontamento: new Date() }
        };

        const atoParaSimular = acaoSimulada === 'liquidacao' ? 'LIQUIDACAO_DESISTENCIA' : 'CANCELAMENTO_AVERBACAO';
        const calculoSimulado = calcularCustoAtoUnico(tituloParaTeste, atoParaSimular);
        setResultadoSimulacao(calculoSimulado);

    }, [acaoSimulada, devedor, valorTitulo, tipoPagamento]);

    
    const BlocoResultado = ({ titulo, dados }: { titulo: string; dados: IResultadoCalculoCompleto['cobrancaInicial']}) => (
        <div className="space-y-3">
             <h2 className="text-xl font-bold text-blue-800 flex items-center gap-2">{titulo}</h2>
            {Object.entries(dados.detalhes).map(([ato, detalhe]) => detalhe && (
                <div key={ato} className="bg-gray-50 p-3 rounded-lg border">
                    <h3 className="font-bold text-gray-700 capitalize">{ato}</h3>
                    <div className="grid grid-cols-4 gap-4 mt-2 text-sm">
                        <div><p className="text-xs text-gray-500">ID Selo</p><p className="font-mono font-semibold">{detalhe.selo.id_selo}</p></div>
                        <div><p className="text-xs text-gray-500">Emolumentos</p><p className="font-semibold">R$ {detalhe.valorEmolumento.toFixed(2)}</p></div>
                        <div><p className="text-xs text-gray-500">Taxas</p><p className="font-semibold">R$ {detalhe.valorTaxaJudiciaria.toFixed(2)}</p></div>
                        <div><p className="text-xs text-gray-500">Subtotal</p><p className="font-semibold">R$ {detalhe.valorTotal.toFixed(2)}</p></div>
                    </div>
                </div>
            ))}
             <div className="bg-blue-100 p-4 rounded-lg border border-blue-300 grid grid-cols-3 gap-4 text-center">
                <div><p className="text-sm text-blue-800">Total Emolumentos</p><p className="text-2xl font-bold text-blue-900">R$ {dados.resumo.totalEmolumentos.toFixed(2)}</p></div>
                <div><p className="text-sm text-blue-800">Total Taxas</p><p className="text-2xl font-bold text-blue-900">R$ {dados.resumo.totalTaxas.toFixed(2)}</p></div>
                <div className="border-l-2 border-blue-300"><p className="text-sm font-semibold text-blue-800">VALOR TOTAL</p><p className="text-2xl font-bold text-blue-900">R$ {dados.resumo.valorTotalAto.toFixed(2)}</p></div>
            </div>
        </div>
    );

    return (
        <div className="p-6 bg-gray-50 font-sans min-h-screen">
            <div className="max-w-5xl mx-auto space-y-6">
                <header>
                    <h1 className="text-3xl font-bold text-[#4a4e51]">Teste de Cálculo de Ato Completo</h1>
                    <p className="text-md text-gray-500 mt-1">Valide o cálculo consolidado (Apontamento + Intimação + Protesto).</p>
                </header>
                <div className="bg-white p-6 rounded-xl shadow-sm border space-y-8">
                    <div className="p-4 border rounded-md">
                         <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-700">1. Devedor</h2>
                            <div className="flex gap-2">
                                <button onClick={() => setDevedor(mockPfComum)} className="text-xs bg-gray-100 p-1 rounded hover:bg-gray-200">Usar PF Comum</button>
                                <button onClick={() => setDevedor(mockPjComum)} className="text-xs bg-gray-100 p-1 rounded hover:bg-gray-200">Usar PJ Comum</button>
                                <button onClick={() => setDevedor(mockPjMei)} className="text-xs bg-yellow-100 p-1 rounded hover:bg-yellow-200 font-semibold">Usar PJ (MEI)</button>
                            </div>
                        </div>
                        <SeletorDePessoa dados={devedor} onDadosChange={(novosDados) => setDevedor(novosDados as TPessoaTipo)} pathPrefix={['devedor']} handleInputChange={() => {}} handleAddressUpdate={() => {}} handleCpfSearch={() => {}} handleCnpjSearch={() => {}} searchingCpf={null} searchingCnpj={null} onAddSocio={() => {}} onRemoveSocio={() => {}} />
                    </div>
                    
                    <div className="p-4 border rounded-md">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">2. Condições do Título</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="valorTitulo" className="block text-sm font-medium text-gray-600 mb-1">Valor do Título (R$)</label>
                                <input id="valorTitulo" type="number" value={valorTitulo} onChange={e => setValorTitulo(parseFloat(e.target.value) || 0)} className="border border-gray-300 rounded-md p-2 w-full" />
                            </div>
                             <div>
                                <label htmlFor="tipoPagamento" className="block text-sm font-medium text-gray-600 mb-1">Forma de Pagamento</label>
                                <select id="tipoPagamento" value={tipoPagamento} onChange={e => setTipoPagamento(e.target.value as any)} className="border border-gray-300 rounded-md p-2 w-full bg-white">
                                    <option value="COMUM">Comum</option>
                                    <option value="POSTERIOR">Posterior</option>
                                    <option value="DIFERIDO">Diferido</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center pt-4">
                        <button onClick={handleCalcular} className="flex items-center gap-2 bg-blue-600 text-white font-bold px-8 py-3 rounded-lg shadow-sm hover:bg-blue-700 transition-colors text-lg">
                            <Calculator /> Calcular Ato Completo
                        </button>
                    </div>
                </div>
                
                {resultado && (
                    <div className="bg-white p-6 rounded-xl shadow-md border-2 border-green-200 animate-fade-in space-y-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-green-700 mb-1">✅ Cálculo do Ato Completo</h2>
                            <p className="font-semibold bg-green-50 text-green-700 inline-block px-3 py-1 rounded-full text-sm">{resultado.regraPrincipal}</p>
                        </div>
                        
                        <BlocoResultado titulo="Cobrança Inicial (no Apontamento)" dados={resultado.cobrancaInicial} />

                        {resultado.cobrancaFinal && (
                            <div className="border-t-2 border-dashed pt-6">
                                <BlocoResultado titulo="Cobrança Final (na Liquidação ou Cancelamento)" dados={resultado.cobrancaFinal} />
                            </div>
                        )}

                        <div className="border-t-2 border-dashed pt-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <RefreshCw size={22} />
                                    Simular Custos de Ações Alternativas
                                </h2>
                                <select 
                                    value={acaoSimulada}
                                    onChange={(e) => setAcaoSimulada(e.target.value)}
                                    className="border border-gray-300 rounded-md p-2 bg-white"
                                >
                                    <option value="nenhuma">Selecione uma ação...</option>
                                    <option value="liquidacao">Liquidação / Desistência (Antes de protestar)</option>
                                    <option value="cancelamento">Cancelamento (Após protestar)</option>
                                </select>
                            </div>
                            {resultadoSimulacao && (
                                <>
                                    <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 animate-fade-in">
                                        <h3 className="font-bold text-yellow-800 capitalize">
                                            Custo para: {acaoSimulada === 'liquidacao' ? 'Liquidação / Desistência' : 'Cancelamento'}
                                        </h3>
                                        <div className="grid grid-cols-4 gap-4 mt-2 text-sm">
                                            <div><p className="text-xs text-gray-500">ID Selo</p><p className="font-mono font-semibold">{resultadoSimulacao.selo.id_selo}</p></div>
                                            <div><p className="text-xs text-gray-500">Emolumentos</p><p className="font-semibold">R$ {resultadoSimulacao.valorEmolumento.toFixed(2)}</p></div>
                                            <div><p className="text-xs text-gray-500">Taxas</p><p className="font-semibold">R$ {resultadoSimulacao.valorTaxaJudiciaria.toFixed(2)}</p></div>
                                            <div><p className="text-xs text-gray-500">Custo da Ação</p><p className="font-semibold text-lg">R$ {resultadoSimulacao.valorTotal.toFixed(2)}</p></div>
                                        </div>
                                    </div>
                                    <div className="mt-4 p-4 bg-green-100 border-2 border-green-300 rounded-lg">
                                        <h3 className="text-lg font-bold text-green-800 text-center mb-2">Resumo Consolidado (Ato Protestado + Ação Simulada)</h3>
                                        <div className="grid grid-cols-3 gap-4 text-center">
                                            <div>
                                                <p className="text-sm text-green-700">Total Emolumentos</p>
                                                <p className="text-2xl font-bold text-green-900">
                                                    R$ {((resultado.cobrancaFinal?.resumo.totalEmolumentos ?? resultado.cobrancaInicial.resumo.totalEmolumentos) + resultadoSimulacao.valorEmolumento).toFixed(2)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-green-700">Total Taxas</p>
                                                <p className="text-2xl font-bold text-green-900">
                                                    R$ {((resultado.cobrancaFinal?.resumo.totalTaxas ?? resultado.cobrancaInicial.resumo.totalTaxas) + resultadoSimulacao.valorTaxaJudiciaria).toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="border-l-2 border-green-300">
                                                <p className="text-sm font-semibold text-green-800">VALOR FINAL TOTAL</p>
                                                <p className="text-3xl font-bold text-green-900">
                                                     R$ {((resultado.cobrancaFinal?.resumo.valorTotalAto ?? resultado.cobrancaInicial.resumo.valorTotalAto) + resultadoSimulacao.valorTotal).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {erro && ( <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl shadow-md animate-fade-in"><h2 className="text-xl font-bold mb-2">❌ Erro no Cálculo</h2><p>{erro}</p></div> )}
            </div>
        </div>
    );
}