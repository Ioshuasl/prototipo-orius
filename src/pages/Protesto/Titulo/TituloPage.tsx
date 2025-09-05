import React, { useState, useEffect } from 'react';
import { FileText, Users, ListChecks, Save, XCircle, Calculator } from 'lucide-react';
import SeletorDePessoa from '../../Components/SeletorDePessoa';
import { type ITituloProtesto, type TPessoaTipo } from '../types';
import { calcularAtoCompletoProtesto, type IResultadoCalculoCompleto, type CondicaoPagamento } from '../../Functions/calculoCustas';
import { mockTitulosProtesto } from '../lib/Constants';

// --- Definição das Abas ---
const tabs = [
    { id: 'dadosTitulo', label: 'Dados do Título', icon: FileText },
    { id: 'partes', label: 'Partes Envolvidas', icon: Users },
    { id: 'controle', label: 'Controle e Prazos', icon: ListChecks },
];

// --- Componente Principal da Tela ---
export default function DetalhesTituloProtestoPage() {
    // Estado para o título, inicializado com um mock para demonstração
    const [titulo, setTitulo] = useState<ITituloProtesto>(mockTitulosProtesto[0]);
    const [activeTab, setActiveTab] = useState(tabs[0].id);
    
    // Estado para armazenar o resultado do cálculo de custas
    const [calculoCustas, setCalculoCustas] = useState<IResultadoCalculoCompleto | null>(null);

    // --- EFEITO REATIVO PARA CÁLCULO DE CUSTAS ---
    // Este useEffect observa mudanças em dados cruciais do título e recalcula as custas automaticamente.
    useEffect(() => {
        if (titulo.valor > 0 && titulo.devedores.length > 0) {
            const resultado = calcularAtoCompletoProtesto(titulo);
            setCalculoCustas(resultado);
        }
    }, [titulo.valor, titulo.tipoPagamento, titulo.devedores]);

    // --- Handlers para modificar o estado aninhado do título ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        // Lógica simples para atualização. Uma mais robusta seria necessária para produção.
        setTitulo(prev => ({ ...prev, [name]: value }));
    };

    const handleDevedorChange = (index: number, novosDados: Partial<TPessoaTipo>) => {
        setTitulo(prev => {
            const devedoresAtualizados = [...prev.devedores];
            devedoresAtualizados[index] = novosDados as TPessoaTipo;
            return { ...prev, devedores: devedoresAtualizados };
        });
    };
    
    const BlocoResultado = ({ titulo, dados }: { titulo: string; dados: IResultadoCalculoCompleto['cobrancaInicial']}) => (
        <div className="space-y-3">
             <h2 className="text-lg font-bold text-blue-800">{titulo}</h2>
            {Object.entries(dados.detalhes).map(([ato, detalhe]) => detalhe && (
                <div key={ato} className="bg-gray-50 p-2 rounded-lg border text-xs">
                    <h3 className="font-semibold text-gray-700 capitalize">{ato}</h3>
                    <div className="grid grid-cols-4 gap-2 mt-1">
                        <span>Selo: <span className="font-mono">{detalhe.selo.id_selo}</span></span>
                        <span>Emol: <span className="font-semibold">R$ {detalhe.valorEmolumento.toFixed(2)}</span></span>
                        <span>Taxas: <span className="font-semibold">R$ {detalhe.valorTaxaJudiciaria.toFixed(2)}</span></span>
                        <span>Total: <span className="font-bold">R$ {detalhe.valorTotal.toFixed(2)}</span></span>
                    </div>
                </div>
            ))}
             <div className="bg-blue-100 p-2 rounded-lg border border-blue-300 grid grid-cols-3 gap-2 text-center">
                <div><p className="text-xs text-blue-800">Total Emol.</p><p className="text-lg font-bold text-blue-900">R$ {dados.resumo.totalEmolumentos.toFixed(2)}</p></div>
                <div><p className="text-xs text-blue-800">Total Taxas</p><p className="text-lg font-bold text-blue-900">R$ {dados.resumo.totalTaxas.toFixed(2)}</p></div>
                <div className="border-l-2 border-blue-300"><p className="text-xs font-semibold text-blue-800">TOTAL</p><p className="text-lg font-bold text-blue-900">R$ {dados.resumo.valorTotalAto.toFixed(2)}</p></div>
            </div>
        </div>
    );
    
    return (
        <div className="p-6 bg-gray-50 font-sans">
            <header className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Título a Protestar</h1>
                    <p className="text-lg text-gray-500">Protocolo: <span className="font-mono">{titulo.protocolo}</span></p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300"><XCircle size={18} /> Cancelar</button>
                    <button className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700"><Save size={18} /> Salvar Alterações</button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Coluna Principal de Formulários */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-6">
                            {tabs.map(tab => (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'} whitespace-nowrap py-3 px-1 border-b-2 font-medium flex items-center gap-2`}>
                                    <tab.icon size={18} /> {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border">
                        {activeTab === 'dadosTitulo' && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-gray-700">Dados do Título</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div><label className="block text-sm font-medium">Espécie</label><input type="text" name="especieTitulo" value={titulo.especieTitulo} onChange={handleInputChange} className="mt-1 p-2 border rounded-md w-full" /></div>
                                    <div><label className="block text-sm font-medium">Nº do Título</label><input type="text" name="numeroTitulo" value={titulo.numeroTitulo} onChange={handleInputChange} className="mt-1 p-2 border rounded-md w-full" /></div>
                                    <div><label className="block text-sm font-medium">Valor (R$)</label><input type="number" name="valor" value={titulo.valor} onChange={(e) => setTitulo(t => ({...t, valor: parseFloat(e.target.value) || 0}))} className="mt-1 p-2 border rounded-md w-full" /></div>
                                    <div><label className="block text-sm font-medium">Data de Emissão</label><input type="date" name="dataEmissao" value={titulo.dataEmissao.toISOString().split('T')[0]} onChange={handleInputChange} className="mt-1 p-2 border rounded-md w-full" /></div>
                                    <div><label className="block text-sm font-medium">Data de Vencimento</label><input type="date" name="dataVencimento" value={titulo.dataVencimento.toISOString().split('T')[0]} onChange={handleInputChange} className="mt-1 p-2 border rounded-md w-full" /></div>
                                    <div><label className="block text-sm font-medium">Tipo de Pagamento</label><select name="tipoPagamento" value={titulo.tipoPagamento} onChange={(e) => setTitulo(t => ({...t, tipoPagamento: e.target.value as CondicaoPagamento}))} className="mt-1 p-2 border rounded-md w-full bg-white"><option value="COMUM">Comum</option><option value="POSTERIOR">Posterior</option><option value="DIFERIDO">Diferido</option></select></div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'partes' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Apresentante</h2>
                                    <SeletorDePessoa dados={titulo.apresentante} onDadosChange={(d) => setTitulo(t => ({...t, apresentante: d as TPessoaTipo}))} pathPrefix={['apresentante']} handleInputChange={()=>{}} handleAddressUpdate={()=>{}} handleCpfSearch={()=>{}} handleCnpjSearch={()=>{}} searchingCpf={null} searchingCnpj={null} onAddSocio={()=>{}} onRemoveSocio={()=>{}} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Devedor(es)</h2>
                                    <div className="space-y-4">
                                        {titulo.devedores.map((devedor, index) => (
                                            <SeletorDePessoa key={index} dados={devedor} onDadosChange={(d) => handleDevedorChange(index, d)} pathPrefix={['devedores', index]} handleInputChange={()=>{}} handleAddressUpdate={()=>{}} handleCpfSearch={()=>{}} handleCnpjSearch={()=>{}} searchingCpf={null} searchingCnpj={null} onAddSocio={()=>{}} onRemoveSocio={()=>{}} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'controle' && (
                            <div className="space-y-4 text-sm">
                                <h2 className="text-xl font-semibold text-gray-700">Controle e Prazos</h2>
                                <div><strong>Apontamento:</strong> {titulo.apontamento?.dataApontamento.toLocaleDateString('pt-BR')}</div>
                                <div><strong>Prazo Final para Pagamento:</strong> {titulo.dataPrazoFinal ? titulo.dataPrazoFinal.toLocaleDateString('pt-BR') : 'Ainda não intimado'}</div>
                                {titulo.protesto && <div><strong>Data do Protesto:</strong> {titulo.protesto.dataLavratura.toLocaleDateString('pt-BR')}</div>}
                                {titulo.cancelamento && <div><strong>Data do Cancelamento:</strong> {titulo.cancelamento.data.toLocaleDateString('pt-BR')}</div>}
                            </div>
                        )}
                    </div>
                </div>

                {/* Coluna Lateral de Custas */}
                <div className="lg:col-span-1">
                     <div className="bg-white p-4 rounded-xl shadow-sm border sticky top-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2"><Calculator size={20}/> Custas do Título (Cálculo em Tempo Real)</h2>
                        {calculoCustas ? (
                            <div className="space-y-4 animate-fade-in">
                                <p className="font-semibold bg-blue-50 text-blue-700 text-center px-2 py-1 rounded-full text-sm">{calculoCustas.regraPrincipal}</p>
                                <BlocoResultado titulo="Custas Iniciais" dados={calculoCustas.cobrancaInicial} />
                                {calculoCustas.cobrancaFinal && (
                                    <div className="border-t-2 border-dashed pt-4">
                                        <BlocoResultado titulo="Custas Finais (se liquidado)" dados={calculoCustas.cobrancaFinal} />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-500">Aguardando dados para calcular...</p>
                        )}
                     </div>
                </div>
            </div>
        </div>
    );
}