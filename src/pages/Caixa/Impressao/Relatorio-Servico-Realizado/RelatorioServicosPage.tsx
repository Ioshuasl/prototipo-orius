import React, { useState } from 'react';
import { Search, Printer, Settings, ListX, FilterX } from 'lucide-react';
import ModalConfiguracaoImpressaoServicos, { type ConfiguracaoServico } from './ModalConfiguracaoImpressao';
import { mockServiceRecords } from '../../lib/Constants';
import { type ServiceRecord, type ServiceStatus, type Sistemas } from '../../types';
import brasao from '../../../../assets/logo-cartorio.png';

export default function RelatorioServicosPage() {
    const [filtros, setFiltros] = useState({
        termo: '',
        status: 'Todos',
        tipoServico: 'Todos',
        sistema: 'Todos', // Novo estado para o filtro de sistema
        dataInicio: '',
        dataFim: '',
        withSeal: 'Todos',
    });
    const [resultados, setResultados] = useState<ServiceRecord[]>([]);
    const [pesquisaFeita, setPesquisaFeita] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [configuracaoImpressao, setConfiguracaoImpressao] = useState<ConfiguracaoServico>({
        colunas: {
            protocolo: true,
            cliente: true,
            tipoServico: true,
            valor: true,
            status: true,
            data: true,
            selos: false,
            sistema: true, // Novo campo padrão
        },
        templateCabecalho: 'modelo1',
        margens: { top: '1.5', bottom: '1.5', left: '1', right: '1' },
    });

    const tiposDeServicoUnicos = ['Todos', ...new Set(mockServiceRecords.map(s => s.serviceType))];
    const statusUnicos = ['Todos', ...new Set(mockServiceRecords.map(s => s.status))];
    const sistemasUnicos = ['Todos', ...new Set(mockServiceRecords.map(s => s.sistema))]; // Novos dados de filtro

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
        let dadosFiltrados = mockServiceRecords;

        if (filtros.termo) {
            dadosFiltrados = dadosFiltrados.filter(record => 
                record.protocol.toLowerCase().includes(filtros.termo.toLowerCase()) || 
                record.clientName.toLowerCase().includes(filtros.termo.toLowerCase())
            );
        }
        if (filtros.status !== 'Todos') {
            dadosFiltrados = dadosFiltrados.filter(record => record.status === filtros.status as ServiceStatus);
        }
        if (filtros.tipoServico !== 'Todos') {
            dadosFiltrados = dadosFiltrados.filter(record => record.serviceType === filtros.tipoServico);
        }
        if (filtros.sistema !== 'Todos') {
            dadosFiltrados = dadosFiltrados.filter(record => record.sistema === filtros.sistema as Sistemas);
        }
        if (filtros.withSeal !== 'Todos') {
            const hasSeal = filtros.withSeal === 'Com Selo';
            dadosFiltrados = dadosFiltrados.filter(record => record.withSeal === hasSeal);
        }
        if (filtros.dataInicio) {
            dadosFiltrados = dadosFiltrados.filter(record => new Date(record.registrationDate) >= new Date(filtros.dataInicio));
        }
        if (filtros.dataFim) {
            dadosFiltrados = dadosFiltrados.filter(record => new Date(record.registrationDate) <= new Date(filtros.dataFim + 'T23:59:59.999'));
        }

        setResultados(dadosFiltrados.sort((a, b) => b.registrationDate.getTime() - a.registrationDate.getTime()));
        setPesquisaFeita(true);
    };

    const handleClearFilters = () => {
        setFiltros({ termo: '', status: 'Todos', tipoServico: 'Todos', sistema: 'Todos', dataInicio: '', dataFim: '', withSeal: 'Todos' });
        setPesquisaFeita(false);
        setResultados([]);
    };

    const renderHeaderImpressao = () => {
        const template = configuracaoImpressao.templateCabecalho;
        const titulo = `Relatório de Serviços`;

        switch (template) {
            case 'modelo1':
                return (
                    <div className='text-center'>
                        <h2 className="text-xl font-bold">{titulo}</h2>
                        <p className="text-base font-semibold">{dadosCartorio.nome}</p>
                        <p className="text-sm">Tabelião: {dadosCartorio.tabeliao}</p>
                    </div>
                );
            case 'modelo2':
                return (
                    <div className='flex flex-col items-center justify-center text-sm'>
                        <p className="font-bold text-lg mb-1">{dadosCartorio.nome}</p>
                        <p>{dadosCartorio.endereco} - {dadosCartorio.telefone}</p>
                        <p className="font-semibold text-lg mt-2">{titulo}</p>
                    </div>
                );
            case 'modelo3':
                return (
                    <div className="flex items-center justify-center gap-4 text-sm">
                        <img src={dadosCartorio.brasaoUrl} alt="Brasão do Cartório" className="w-16 h-16" />
                        <div>
                            <p className="font-bold text-lg mb-1">{dadosCartorio.nome}</p>
                            <p>{dadosCartorio.endereco} - {dadosCartorio.telefone}</p>
                            <p className="font-semibold text-lg mt-2">{titulo}</p>
                        </div>
                    </div>
                );
            case 'modelo4':
                return (
                    <div className='flex flex-col items-center text-sm'>
                        <img src={dadosCartorio.brasaoUrl} alt="Brasão do Cartório" className="w-16 h-16 mb-2" />
                        <p className="font-bold text-lg mb-1">{dadosCartorio.nome}</p>
                        <p>{dadosCartorio.endereco} - {dadosCartorio.telefone}</p>
                        <p className="font-semibold text-lg mt-2">{titulo}</p>
                    </div>
                );
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

    const colunasParaExibir = Object.keys(configuracaoImpressao.colunas).filter(
        col => configuracaoImpressao.colunas[col as keyof ConfiguracaoServico['colunas']]
    );

    const columnTitles = {
        protocolo: 'Protocolo',
        cliente: 'Cliente',
        tipoServico: 'Tipo de Serviço',
        valor: 'Valor',
        status: 'Status',
        data: 'Data',
        selos: 'Selos',
        sistema: 'Sistema' // Novo título de coluna
    };

    return (
        <>
            <div className="mx-auto space-y-6 pb-24">
                <div className="print:hidden">
                    <h1 className="text-2xl font-bold text-gray-800">Relatório de Serviços</h1>
                    <p className="text-sm text-gray-500">Gere e imprima um relatório detalhado dos serviços.</p>
                </div>

                {/* Filtros de Pesquisa */}
                <fieldset className="border border-gray-200 rounded-lg p-5 print:hidden">
                    <legend className="text-lg font-medium text-gray-700 px-2">Filtros de Pesquisa</legend>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-4">
                        <div>
                            <label htmlFor="termo" className="block text-sm text-gray-700 font-medium mb-1">Protocolo ou Cliente</label>
                            <input type="text" name="termo" id="termo" value={filtros.termo} onChange={handleFiltroChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white" placeholder="Ex: Protocolo 2023-12345 ou Nome do Cliente" />
                        </div>
                        <div>
                            <label htmlFor="status" className="block text-sm text-gray-700 font-medium mb-1">Status</label>
                            <select name="status" id="status" value={filtros.status} onChange={handleFiltroChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white">
                                {statusUnicos.map(s => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="tipoServico" className="block text-sm text-gray-700 font-medium mb-1">Tipo de Serviço</label>
                            <select name="tipoServico" id="tipoServico" value={filtros.tipoServico} onChange={handleFiltroChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white">
                                {tiposDeServicoUnicos.map(s => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="sistema" className="block text-sm text-gray-700 font-medium mb-1">Sistema</label>
                            <select name="sistema" id="sistema" value={filtros.sistema} onChange={handleFiltroChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white">
                                {sistemasUnicos.map(s => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="withSeal" className="block text-sm text-gray-700 font-medium mb-1">Com Selo</label>
                            <select name="withSeal" id="withSeal" value={filtros.withSeal} onChange={handleFiltroChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white">
                                <option>Todos</option>
                                <option value="Com Selo">Com Selo</option>
                                <option value="Sem Selo">Sem Selo</option>
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
                    <div className="flex justify-end gap-3 mt-5">
                        <button onClick={handleClearFilters} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 transition">
                            <FilterX size={16} /> Limpar Filtros
                        </button>
                        <button onClick={handlePesquisar} className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#dd6825] text-white text-sm font-medium rounded-md hover:bg-[#c25a1f] transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dd6825]">
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
                                    <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#4a4e51] rounded-md hover:bg-[#3b3e40] transition">
                                        <Settings size={16} /> Configurações
                                    </button>
                                    <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#dd6825] rounded-md hover:bg-[#c25a1f] transition">
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
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Protocolo</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sistema</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selos</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {resultados.map(servico => (
                                            <tr key={servico.id} className='hover:bg-gray-50'>
                                                <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{servico.protocol}</td>
                                                <td className="px-4 py-3 text-sm font-medium text-gray-800">{servico.clientName}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{servico.serviceType}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{servico.sistema}</td>
                                                <td className="px-4 py-3 text-sm font-bold">{`R$ ${servico.value.toFixed(2)}`}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{servico.status}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{new Date(servico.registrationDate).toLocaleDateString('pt-BR')}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{servico.withSeal ? 'Sim' : 'Não'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8 border border-dashed rounded-lg text-gray-500 bg-gray-50 print:hidden">
                                <ListX className="mx-auto mb-2 w-8 h-8" />
                                <p className="text-sm">Nenhum serviço encontrado com os filtros aplicados.</p>
                            </div>
                        )}
                    </section>
                )}
            </div>

            {/* --- ÁREA DE IMPRESSÃO --- */}
            <style>
                {`
                @media print {
                    @page { size: A4 portrait; margin: 1cm; }
                    body * { visibility: hidden; }
                    #area-impressao-servicos, #area-impressao-servicos * { visibility: visible; }
                    #area-impressao-servicos { position: absolute; left: 0; top: 0; width: 100%;}
                    .header-impressao { border-bottom: 2px solid #333; padding-bottom: 0.5rem; margin-bottom: 1rem; display: block; }
                    #tabela-impressao-servicos { width: 100%; border-collapse: collapse; font-size: 9pt; }
                    #tabela-impressao-servicos th, #tabela-impressao-servicos td { padding: 6px 4px; border: 1px solid #ccc; text-align: left; word-break: break-word; }
                    #tabela-impressao-servicos thead { display: table-header-group; }
                    #tabela-impressao-servicos thead th { background-color: #f9fafb; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                }
                `}
            </style>
            <div id="area-impressao-servicos" className="hidden print:block">
                <div className="header-impressao">{renderHeaderImpressao()}</div>
                <table id="tabela-impressao-servicos">
                    <thead>
                        <tr>
                            {colunasParaExibir.map(col => (
                                <th key={col}>{columnTitles[col as keyof typeof columnTitles]}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {resultados.map(servico => (
                            <tr key={servico.id}>
                                {configuracaoImpressao.colunas.protocolo && <td>{servico.protocol}</td>}
                                {configuracaoImpressao.colunas.cliente && <td>{servico.clientName}</td>}
                                {configuracaoImpressao.colunas.tipoServico && <td>{servico.serviceType}</td>}
                                {configuracaoImpressao.colunas.sistema && <td>{servico.sistema}</td>}
                                {configuracaoImpressao.colunas.valor && <td>{`R$ ${servico.value.toFixed(2)}`}</td>}
                                {configuracaoImpressao.colunas.status && <td>{servico.status}</td>}
                                {configuracaoImpressao.colunas.data && <td>{new Date(servico.registrationDate).toLocaleDateString('pt-BR')}</td>}
                                {configuracaoImpressao.colunas.selos && <td>{servico.withSeal ? servico.sealNumber.join(', ') : 'N/A'}</td>}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ModalConfiguracaoImpressaoServicos
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