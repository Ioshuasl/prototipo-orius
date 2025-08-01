import React, { useState } from 'react';
import { Search, Printer, Settings, ListX } from 'lucide-react';
import ModalConfiguracaoImpressao from './Components/ModalConfiguracaoImpressao';
import { mockLogsDatabase, mockUsuarios } from '../../lib/Constants'; // Importando os dados do arquivo de constantes
import brasao from '../../../../assets/logo-cartorio.png'
import {type ILogAtividade, type IUsuario} from '../../types'

export type TemplateCabecalhoId = 'modelo1' | 'modelo2' | 'modelo3' | 'modelo4';

export interface Colunas {
    protocolo: boolean;
    nome: boolean;
    termo: boolean;
    livro: boolean;
    folha: boolean;
}

export interface Configuracao {
    colunas: Colunas;
    templateCabecalho: TemplateCabecalhoId;
}

// Gera uma lista única de tipos de ação a partir dos dados para usar no filtro
const tiposDeAcaoUnicos = ['todos', ...new Set(mockLogsDatabase.map(log => log.acao))];

export default function RelatorioAtividadesPage() {
    const [filtros, setFiltros] = useState({
        usuarioId: 'todos',
        tipoAcao: 'todos',
        dataInicio: '',
        dataFim: '',
    });
    const [resultados, setResultados] = useState<ILogAtividade[]>([]);
    const [pesquisaFeita, setPesquisaFeita] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [configuracaoImpressao, setConfiguracaoImpressao] = useState<Configuracao>({
        colunas: { protocolo: true, nome: true, termo: true, livro: true, folha: true },
        templateCabecalho: 'modelo1',
    });

    const dadosCartorio = {
        nome: "Cartório de Registro Civil e Tabelionato de Notas",
        tabeliao: "Dr. João da Silva",
        endereco: "Avenida Principal, 1234, Centro",
        telefone: "(62) 99999-8888",
        brasaoUrl: brasao
    };

    const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFiltros(prev => ({ ...prev, [name]: value }));
    };

    const handlePesquisar = () => {
        let dadosFiltrados = mockLogsDatabase;

        if (filtros.usuarioId !== 'todos') {
            dadosFiltrados = dadosFiltrados.filter(log => log.userId === parseInt(filtros.usuarioId, 10));
        }
        if (filtros.tipoAcao !== 'todos') {
            dadosFiltrados = dadosFiltrados.filter(log => log.acao === filtros.tipoAcao);
        }
        if (filtros.dataInicio) {
            // Compara apenas a parte da data, ignorando a hora
            dadosFiltrados = dadosFiltrados.filter(log => log.dataHora.split(' ')[0] >= filtros.dataInicio);
        }
        if (filtros.dataFim) {
            dadosFiltrados = dadosFiltrados.filter(log => log.dataHora.split(' ')[0] <= filtros.dataFim);
        }

        setResultados(dadosFiltrados.sort((a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime())); // Ordena do mais recente para o mais antigo
        setPesquisaFeita(true);
    };

    const renderHeaderImpressao = () => {
        const template = configuracaoImpressao.templateCabecalho;
        const titulo = `Relatório de Atividades do Sistema`; // Título atualizado

        // Lógica de renderização do cabeçalho é a mesma
        switch (template) {
            // ... (casos dos modelos de cabeçalho)
            default:
                return (
                    <div className='text-center'>
                        <h2 className="text-xl font-bold">{titulo}</h2>
                        <p className="text-base font-semibold">{dadosCartorio.nome}</p>
                        <p className="text-sm">Tabelião: {dadosCartorio.tabeliao}</p>
                    </div>
                );
        }
    };
    
    // Função auxiliar para encontrar o nome do usuário pelo ID
    const getNomeUsuario = (userId: number) => {
        const usuario = mockUsuarios.find(u => u.id === userId);
        return usuario ? usuario.nome : `Usuário ID ${userId}`;
    };

    return (
        <>
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="print:hidden">
                    <h1 className="text-2xl font-bold text-gray-800">Relatório de Atividades</h1>
                    <p className="text-sm text-gray-500">Audite as ações realizadas no sistema.</p>
                </div>

                {/* Filtros de Pesquisa */}
                <fieldset className="border border-gray-200 rounded-lg p-5 print:hidden">
                    <legend className="text-lg font-medium text-gray-700 px-2">Filtros de Pesquisa</legend>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-4">
                        <div>
                            <label htmlFor="usuarioId" className="block text-sm text-gray-700 font-medium mb-1">Usuário</label>
                            <select name="usuarioId" id="usuarioId" value={filtros.usuarioId} onChange={handleFiltroChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="todos">Todos os Usuários</option>
                                {mockUsuarios.map((user: IUsuario) => (
                                    <option key={user.id} value={user.id}>{user.nome}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="tipoAcao" className="block text-sm text-gray-700 font-medium mb-1">Tipo de Ação</label>
                             <select name="tipoAcao" id="tipoAcao" value={filtros.tipoAcao} onChange={handleFiltroChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                                {tiposDeAcaoUnicos.map(acao => (
                                    <option key={acao} value={acao}>{acao === 'todos' ? 'Todas as Ações' : acao.replace(/_/g, ' ')}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="dataInicio" className="block text-sm text-gray-700 font-medium mb-1">Data Inicial</label>
                            <input type="date" name="dataInicio" id="dataInicio" value={filtros.dataInicio} onChange={handleFiltroChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white" />
                        </div>
                        <div>
                            <label htmlFor="dataFim" className="block text-sm text-gray-700 font-medium mb-1">Data Final</label>
                            <input type="date" name="dataFim" id="dataFim" value={filtros.dataFim} onChange={handleFiltroChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white" />
                        </div>
                    </div>
                    <div className="flex justify-end mt-5">
                        <button onClick={handlePesquisar} className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition">
                            <Search size={16} /> Pesquisar
                        </button>
                    </div>
                </fieldset>

                {/* Resultados */}
                {pesquisaFeita && (
                    <section>
                         <div className="flex justify-between items-center mb-4 print:hidden">
                            <h3 className="text-lg font-medium text-gray-700">{resultados.length} registro(s) encontrado(s)</h3>
                            {resultados.length > 0 && (
                                <div className='flex items-center gap-2'>
                                    <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gray-600 rounded-md hover:bg-gray-700 transition">
                                        <Settings size={16} /> Configurações
                                    </button>
                                    <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition">
                                        <Printer size={16} /> Imprimir Relatório
                                    </button>
                                </div>
                            )}
                        </div>

                        {resultados.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-200 print:hidden">
                                    <thead className='bg-gray-50'>
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data e Hora</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ação</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalhes</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {resultados.map(log => (
                                            <tr key={log.id} className='hover:bg-gray-50'>
                                                <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{new Date(log.dataHora).toLocaleString('pt-BR')}</td>
                                                <td className="px-4 py-3 text-sm text-gray-800 font-medium">{getNomeUsuario(log.userId)}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600"><span className="inline-block bg-gray-200 rounded-full px-2 py-0.5 text-xs font-semibold text-gray-700">{log.acao.replace(/_/g, ' ')}</span></td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{log.detalhes}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8 border border-dashed rounded-lg text-gray-500 bg-gray-50 print:hidden">
                                <ListX className="mx-auto mb-2 w-8 h-8" />
                                <p className="text-sm">Nenhum registro de atividade encontrado com os filtros aplicados.</p>
                            </div>
                        )}
                    </section>
                )}
            </div>

            {/* --- ÁREA DE IMPRESSÃO --- */}
            <style>
                {`
                @media print {
                    @page { size: A4; margin: 1cm; }
                    body * { visibility: hidden; }
                    #area-impressao-logs, #area-impressao-logs * { visibility: visible; }
                    #area-impressao-logs { position: absolute; left: 0; top: 0; width: 100%;}
                    .header-impressao { border-bottom: 2px solid #333; padding-bottom: 0.5rem; margin-bottom: 1rem; display: block; }
                    #tabela-impressao-logs { width: 100%; border-collapse: collapse; font-size: 9pt; }
                    #tabela-impressao-logs th, #tabela-impressao-logs td { padding: 6px 4px; border: 1px solid #ccc; text-align: left; word-break: break-word; }
                    #tabela-impressao-logs thead { display: table-header-group; }
                    #tabela-impressao-logs thead th { background-color: #f9fafb; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                }
                `}
            </style>
            <div id="area-impressao-logs" className="hidden print:block">
                 <div className="header-impressao">{renderHeaderImpressao()}</div>
                 <table id="tabela-impressao-logs">
                    <thead>
                       <tr>
                            <th>Data e Hora</th>
                            <th>Usuário</th>
                            <th>Ação</th>
                            <th>Detalhes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resultados.map(log => (
                             <tr key={log.id}>
                                <td>{new Date(log.dataHora).toLocaleString('pt-BR')}</td>
                                <td>{getNomeUsuario(log.userId)}</td>
                                <td>{log.acao.replace(/_/g, ' ')}</td>
                                <td>{log.detalhes}</td>
                            </tr>
                        ))}
                    </tbody>
                 </table>
            </div>
            
            <ModalConfiguracaoImpressao
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={(novaConfig) => {
                    setConfiguracaoImpressao(novaConfig);
                    setIsModalOpen(false);
                }}
                configuracaoAtual={configuracaoImpressao}
            />
        </>
    );
}