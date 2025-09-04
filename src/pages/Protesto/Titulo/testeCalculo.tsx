import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import SeletorDePessoa from '../../Components/SeletorDePessoa';
import { type IEndereco, type IPessoaFisica, type IPessoaJuridica, type ITituloProtesto, type TPessoaTipo } from '../types';
import tabelaEmolumentosProtesto from '../../../../tabela-emolumentos.json';

// --- DEFINIÇÃO DAS INTERFACES DO MOTOR DE CÁLCULO ---
type TipoAtoProtesto = 'APONTAMENTO' | 'PROTESTO' | 'INTIMACAO' | 'CANCELAMENTO_AVERBACAO' | 'LIQUIDACAO_DESISTENCIA' | 'CERTIDAO' | 'OUTROS';
type CondicaoPagamento = 'COMUM' | 'POSTERIOR' | 'DIFERIDO';
type CondicaoEspecial = 'MEI_EPP' | null;

interface IEmolumentoProtesto {
  id_selo: number;
  descricao_selo: string;
  valor_emolumento: number;
  valor_taxa_judiciaria: number;
  ato: TipoAtoProtesto;
  condicao_pagamento: CondicaoPagamento;
  condicao_especial: CondicaoEspecial | null;
  faixa_valor_inicio: number;
  faixa_valor_fim: number | null;
}

export interface IResultadoCalculo {
    selo: IEmolumentoProtesto;
    valorEmolumento: number;
    valorTaxaJudiciaria: number;
    valorTotal: number;
}

// --- MOTOR DE CÁLCULO DE CUSTAS (LÓGICA CORRIGIDA) ---
function calcularCustasProtesto(titulo: ITituloProtesto, tipoAto: TipoAtoProtesto): IResultadoCalculo | null {
    const devedorPrincipal = titulo.devedores[0];
    const isMEI = devedorPrincipal?.tipo === 'juridica' && devedorPrincipal.situacao_tributaria === 'MEI';

    const findRuleSet = (pagamento: CondicaoPagamento, especial: CondicaoEspecial | null) => {
        return (tabelaEmolumentosProtesto as IEmolumentoProtesto[])
            .filter(regra =>
                regra.ato === tipoAto &&
                regra.condicao_pagamento === pagamento &&
                regra.condicao_especial === especial
            )
            .sort((a, b) => a.faixa_valor_inicio - b.faixa_valor_inicio);
    };

    let regrasRelevantes: IEmolumentoProtesto[] = [];

    // Lógica de Hierarquia e Fallback:
    // 1. Tenta encontrar a regra mais específica primeiro (para MEI)
    if (isMEI) {
        regrasRelevantes = findRuleSet(titulo.tipoPagamento, 'MEI_EPP');
    }

    // 2. Se não encontrar uma regra específica para MEI (para aquele tipo de ato/pagamento),
    //    faz o "fallback" e procura a regra comum.
    if (regrasRelevantes.length === 0) {
        regrasRelevantes = findRuleSet(titulo.tipoPagamento, null);
    }

    if (regrasRelevantes.length === 0) {
        console.error("Nenhuma regra de emolumento encontrada para:", { tipoAto, tipoPagamento: titulo.tipoPagamento, isMEI });
        return null;
    }

    let regraSelecionada = regrasRelevantes.find(regra =>
        (regra.faixa_valor_fim === null && titulo.valor >= regra.faixa_valor_inicio) ||
        (titulo.valor >= regra.faixa_valor_inicio && titulo.valor <= (regra.faixa_valor_fim ?? Infinity))
    );

    // Se o valor for maior que a última faixa com valor, pega a última regra disponível.
    if (!regraSelecionada && regrasRelevantes.length > 0) {
        regraSelecionada = regrasRelevantes[regrasRelevantes.length - 1];
    }
    
    if (!regraSelecionada) {
        console.error("Não foi possível encontrar uma faixa de valor para o título:", titulo);
        return null;
    }

    return {
        selo: regraSelecionada,
        valorEmolumento: regraSelecionada.valor_emolumento,
        valorTaxaJudiciaria: regraSelecionada.valor_taxa_judiciaria,
        valorTotal: regraSelecionada.valor_emolumento + regraSelecionada.valor_taxa_judiciaria
    };
}

// --- DADOS DE EXEMPLO E COMPONENTE ---
const mockEndereco: IEndereco = { cep: '74000-000', logradouro: 'Rua Fictícia', numero: '123', bairro: 'Centro', cidade: 'Goiânia', uf: 'GO', tipoLogradouro: 'Rua' };
const mockPfComum: IPessoaFisica = { tipo: 'fisica', nome: 'Pessoa Física Comum', cpf: '111.111.111-11', endereco: mockEndereco, dataNascimento: '1990-01-01', docIdentidadeNum: '123', docIdentidadeTipo: 'RG', nacionalidade: 'Brasileira', naturalidadeCidade: 'Goiânia', naturalidadeUF: 'GO', profissao: 'Tester' };
const mockPjComum: IPessoaJuridica = { tipo: 'juridica', razaoSocial: 'Empresa Comum Ltda', cnpj: '11.111.111/0001-11', endereco: mockEndereco, situacao_tributaria: 'Simples Nacional' };
const mockPjMei: IPessoaJuridica = { tipo: 'juridica', razaoSocial: 'Microempreendedor Individual MEI', cnpj: '22.222.222/0001-22', endereco: mockEndereco, situacao_tributaria: 'MEI' };

const initialDevedorState: TPessoaTipo = { tipo: 'fisica', nome: '', cpf: '', endereco: mockEndereco, dataNascimento: '', docIdentidadeNum: '', docIdentidadeTipo: '', nacionalidade: '', naturalidadeCidade: '', naturalidadeUF: '', profissao: ''};
const initialApresentanteState: TPessoaTipo = { tipo: 'juridica', razaoSocial: '', cnpj: '', endereco: mockEndereco };

export default function TesteCalculoCustasPage() {
    const [devedor, setDevedor] = useState<TPessoaTipo>(initialDevedorState);
    const [apresentante, setApresentante] = useState<TPessoaTipo>(initialApresentanteState);
    const [valorTitulo, setValorTitulo] = useState<number>(1000.00);
    const [tipoPagamento, setTipoPagamento] = useState<CondicaoPagamento>('COMUM');
    const [tipoAto, setTipoAto] = useState<TipoAtoProtesto>('PROTESTO');
    
    const [resultado, setResultado] = useState<IResultadoCalculo | null>(null);
    const [erro, setErro] = useState<string>('');

    const handleCalcular = () => {
        setResultado(null);
        setErro('');

        if (!devedor || (devedor.tipo === 'fisica' ? !devedor.cpf : !devedor.cnpj)) {
            setErro("Por favor, preencha os dados do devedor.");
            return;
        }

        const tituloParaTeste: ITituloProtesto = {
            id: 1, protocolo: 'TESTE-001', status: 'Aguardando Qualificação', dataApontamento: new Date(),
            apresentante: apresentante, devedores: [devedor], especieTitulo: 'Duplicata Mercantil',
            numeroTitulo: 'DM-TESTE', valor: valorTitulo, dataEmissao: new Date(), dataVencimento: new Date(),
            tipoPagamento: tipoPagamento
        };

        const calculo = calcularCustasProtesto(tituloParaTeste, tipoAto);

        if (calculo) {
            setResultado(calculo);
        } else {
            setErro("Não foi encontrada uma regra de emolumento aplicável para as condições informadas. Verifique o console para mais detalhes.");
        }
    };

    return (
        <div className="p-6 bg-gray-50 font-sans min-h-screen">
            <div className="max-w-5xl mx-auto space-y-6">
                <header>
                    <h1 className="text-3xl font-bold text-[#4a4e51]">Ferramenta de Teste de Cálculo de Custas</h1>
                    <p className="text-md text-gray-500 mt-1">Simule cenários para validar o motor de cálculo de emolumentos do protesto.</p>
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
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">2. Apresentante (Opcional para teste)</h2>
                        <SeletorDePessoa dados={apresentante} onDadosChange={(novosDados) => setApresentante(novosDados as TPessoaTipo)} pathPrefix={['apresentante']} handleInputChange={() => {}} handleAddressUpdate={() => {}} handleCpfSearch={() => {}} handleCnpjSearch={() => {}} searchingCpf={null} searchingCnpj={null} onAddSocio={() => {}} onRemoveSocio={() => {}} />
                    </div>

                    <div className="p-4 border rounded-md">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">3. Dados do Título e do Ato</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="tipoAto" className="block text-sm font-medium text-gray-600 mb-1">Tipo de Ato a Calcular</label>
                                <select id="tipoAto" value={tipoAto} onChange={e => setTipoAto(e.target.value as any)} className="border border-gray-300 rounded-md p-2 w-full bg-white">
                                    <option value="APONTAMENTO">Apontamento</option>
                                    <option value="INTIMACAO">Intimação</option>
                                    <option value="PROTESTO">Protesto</option>
                                    <option value="CERTIDAO">Certidão</option>
                                    <option value="CANCELAMENTO_AVERBACAO">Cancelamento</option>
                                    <option value="LIQUIDACAO_DESISTENCIA">Liquidação/Desistência</option>
                                </select>
                            </div>
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
                            <Calculator /> Calcular Custas e Selos
                        </button>
                    </div>
                </div>
                
                {resultado && (
                    <div className="bg-white p-6 rounded-xl shadow-md border border-green-200 animate-fade-in">
                        <h2 className="text-xl font-bold text-green-700 mb-4">✅ Resultado do Cálculo</h2>
                        <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                            <div className="bg-green-50 p-3 rounded-md">
                                <p className="text-sm text-green-800">Emolumentos</p>
                                <p className="text-2xl font-bold text-green-900">R$ {resultado.valorEmolumento.toFixed(2)}</p>
                            </div>
                            <div className="bg-green-50 p-3 rounded-md">
                                <p className="text-sm text-green-800">Taxa Judiciária</p>
                                <p className="text-2xl font-bold text-green-900">R$ {resultado.valorTaxaJudiciaria.toFixed(2)}</p>
                            </div>
                             <div className="bg-green-100 p-3 rounded-md border border-green-300">
                                <p className="text-sm font-semibold text-green-800">TOTAL</p>
                                <p className="text-2xl font-bold text-green-900">R$ {resultado.valorTotal.toFixed(2)}</p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Regra/Selo Selecionado:</h3>
                            <pre className="bg-gray-800 text-white p-4 rounded-md text-xs overflow-x-auto">
                                {JSON.stringify(resultado.selo, null, 2)}
                            </pre>
                        </div>
                    </div>
                )}
                {erro && (
                     <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl shadow-md animate-fade-in">
                        <h2 className="text-xl font-bold mb-2">❌ Erro no Cálculo</h2>
                        <p>{erro}</p>
                    </div>
                )}
            </div>
        </div>
    );
}