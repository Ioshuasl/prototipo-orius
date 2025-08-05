import React, { useState } from 'react';
import { Search, Printer, Settings, ListX } from 'lucide-react';
import ModalConfiguracaoImpressao from './Components/ModalConfiguracaoImpressao'; // Reutilizando o modal
import brasao from '../../../../assets/logo-cartorio.png'

// Tipos para os diferentes serviços de protocolo
type TipoServico = 'todos' | 'Ato Lavrado' | 'Certidão Emitida' | 'Averbação Emitida' | 'Selo Avulso Emitido';

export type TemplateCabecalhoId = 'modelo1' | 'modelo2' | 'modelo3' | 'modelo4';

export interface Colunas {
    protocolo: boolean;
    nome: boolean;
    termo: boolean;
    livro: boolean;
    folha: boolean;
}

export interface Margens {
    top: string;
    bottom: string;
    left: string;
    right: string;
}


// Define a estrutura da configuração completa, agora com o template do cabeçalho
export interface Configuracao {
    colunas: Colunas;
    templateCabecalho: TemplateCabecalhoId;
    margens: Margens;
}

interface ProtocoloBase {
    protocolo: number;
    data: string; // Formato YYYY-MM-DD
    tipoServico: TipoServico;
}

interface ProtocoloAto extends ProtocoloBase {
    tipoServico: 'Ato Lavrado';
    tipoAto: string;
    livro: string;
    folha: number;
    termo: string;
    nomeParte: string;
}

interface ProtocoloCertidao extends ProtocoloBase {
    tipoServico: 'Certidão Emitida';
    tipoCertidao: 'Nascimento' | 'Casamento' | 'Óbito';
}

interface ProtocoloAverbacao extends ProtocoloBase {
    tipoServico: 'Averbação Emitida';
    tipoAverbacao: 'Divórcio' | 'Retificação';
}

interface ProtocoloSelo extends ProtocoloBase {
    tipoServico: 'Selo Avulso Emitido';
    tipoSelo: 'Reconhecimento de Firma' | 'Autenticação';
}

type Protocolo = ProtocoloAto | ProtocoloCertidao | ProtocoloAverbacao | ProtocoloSelo;

// SIMULAÇÃO DE BANCO DE DADOS
const mockProtocolosDatabase: Protocolo[] = [
    { protocolo: 1001, data: '2025-07-15', tipoServico: 'Ato Lavrado', tipoAto: 'Nascimento', livro: 'A-10', folha: 25, termo: 'T-50', nomeParte: 'João da Silva' },
    { protocolo: 1002, data: '2025-07-15', tipoServico: 'Certidão Emitida', tipoCertidao: 'Nascimento' },
    { protocolo: 1003, data: '2025-07-16', tipoServico: 'Ato Lavrado', tipoAto: 'Casamento', livro: 'B-05', folha: 150, termo: 'T-300', nomeParte: 'Maria Oliveira e Pedro Costa' },
    { protocolo: 1004, data: '2025-07-17', tipoServico: 'Selo Avulso Emitido', tipoSelo: 'Reconhecimento de Firma' },
    { protocolo: 1005, data: '2025-07-18', tipoServico: 'Averbação Emitida', tipoAverbacao: 'Divórcio' },
    { protocolo: 1006, data: '2025-07-19', tipoServico: 'Certidão Emitida', tipoCertidao: 'Casamento' },
    { protocolo: 1007, data: '2025-07-20', tipoServico: 'Ato Lavrado', tipoAto: 'Óbito', livro: 'C-12', folha: 88, termo: 'T-176', nomeParte: 'Ana Souza' },
    { protocolo: 1008, data: '2025-07-21', tipoServico: 'Selo Avulso Emitido', tipoSelo: 'Autenticação' },
];

export default function LivroProtocoloPage() {
    const [filtros, setFiltros] = useState({
        tipoServico: 'todos' as TipoServico,
        dataInicio: '',
        dataFim: '',
        protocoloInicio: '',
        protocoloFim: '',
    });
    const [resultados, setResultados] = useState<Protocolo[]>([]);
    const [pesquisaFeita, setPesquisaFeita] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [configuracaoImpressao, setConfiguracaoImpressao] = useState<Configuracao>({
        colunas: { protocolo: true, nome: true, termo: true, livro: true, folha: true }, // Padrão, pode ser ajustado
        templateCabecalho: 'modelo1',
        margens: { top: '1.5', bottom: '1.5', left: '1', right: '1' },
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
        let dadosFiltrados = mockProtocolosDatabase;

        if (filtros.tipoServico !== 'todos') {
            dadosFiltrados = dadosFiltrados.filter(p => p.tipoServico === filtros.tipoServico);
        }
        if (filtros.dataInicio) {
            dadosFiltrados = dadosFiltrados.filter(p => p.data >= filtros.dataInicio);
        }
        if (filtros.dataFim) {
            dadosFiltrados = dadosFiltrados.filter(p => p.data <= filtros.dataFim);
        }
        if (filtros.protocoloInicio) {
            dadosFiltrados = dadosFiltrados.filter(p => p.protocolo >= parseInt(filtros.protocoloInicio, 10));
        }
        if (filtros.protocoloFim) {
            dadosFiltrados = dadosFiltrados.filter(p => p.protocolo <= parseInt(filtros.protocoloFim, 10));
        }

        setResultados(dadosFiltrados);
        setPesquisaFeita(true);
    };

    const renderHeaderImpressao = () => {
        const template = configuracaoImpressao.templateCabecalho;
        const titulo = `Livro de Protocolo`;

        // Lógica de renderização do cabeçalho copiada de Livro.tsx e adaptada
        switch (template) {
            case 'modelo4':
                return (
                    <div className="flex flex-col items-center gap-4">
                        <img src={dadosCartorio.brasaoUrl} alt="Brasão" className="w-32 h-24" />
                        <div className='text-left'>
                            <h2 className="text-xl font-bold">{titulo}</h2>
                            <p className="text-base font-semibold">{dadosCartorio.nome}</p>
                            <p className="text-sm">{dadosCartorio.endereco} - Tel: {dadosCartorio.telefone}</p>
                            <p className="text-sm">Tabelião: {dadosCartorio.tabeliao}</p>
                        </div>
                    </div>
                );
            case 'modelo2':
                return (
                    <div className='text-center'>
                        <h2 className="text-xl font-bold">{titulo}</h2>
                        <p className="text-base font-semibold">{dadosCartorio.nome}</p>
                        <p className="text-sm">{dadosCartorio.endereco} - Tel: {dadosCartorio.telefone}</p>
                        <p className="text-sm">Tabelião: {dadosCartorio.tabeliao}</p>
                    </div>
                );
            case 'modelo3':
                return (
                    <div className="flex items-center gap-4">
                        <img src={dadosCartorio.brasaoUrl} alt="Brasão" className="w-32 h-24" />
                        <div className='text-left'>
                            <h2 className="text-xl font-bold">{titulo}</h2>
                            <p className="text-base font-semibold">{dadosCartorio.nome}</p>
                            <p className="text-sm">{dadosCartorio.endereco} - Tel: {dadosCartorio.telefone}</p>
                            <p className="text-sm">Tabelião: {dadosCartorio.tabeliao}</p>
                        </div>
                    </div>
                );
            case 'modelo1':
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

    // Renderiza as células da tabela dinamicamente com base no tipo de serviço
    const renderLinhaProtocolo = (item: Protocolo) => {
        switch (item.tipoServico) {
            case 'Ato Lavrado':
                return (
                    <>
                        <td>{item.nomeParte}</td>
                        <td>{item.livro}</td>
                        <td>{item.folha}</td>
                        <td>{item.termo}</td>
                    </>
                );
            case 'Certidão Emitida':
                return <td colSpan={4}>{item.tipoCertidao}</td>;
            case 'Averbação Emitida':
                return <td colSpan={4}>{item.tipoAverbacao}</td>;
            case 'Selo Avulso Emitido':
                return <td colSpan={4}>{item.tipoSelo}</td>;
            default:
                return <td colSpan={4}></td>;
        }
    }


    return (
        <>
            <div className="mx-auto space-y-6">
                <div className="print:hidden">
                    <h1 className="text-2xl font-bold text-gray-800">Livro de Protocolo</h1>
                    <p className="text-sm text-gray-500">Pesquise os protocolos e gere o livro para impressão.</p>
                </div>

                {/* Filtros de Pesquisa */}
                <fieldset className="border border-gray-200 rounded-lg p-5 print:hidden">
                    <legend className="text-lg font-medium text-gray-700 px-2">Filtros de Pesquisa</legend>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-4">
                        <div>
                            <label htmlFor="tipoServico" className="block text-sm text-gray-700 font-medium mb-1">Tipo de Serviço</label>
                            <select name="tipoServico" id="tipoServico" value={filtros.tipoServico} onChange={handleFiltroChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="todos">Todos</option>
                                <option value="Ato Lavrado">Ato Lavrado</option>
                                <option value="Certidão Emitida">Certidão Emitida</option>
                                <option value="Averbação Emitida">Averbação Emitida</option>
                                <option value="Selo Avulso Emitido">Selo Avulso Emitido</option>
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
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label htmlFor="protocoloInicio" className="block text-sm text-gray-700 font-medium mb-1">Prot. Início</label>
                                <input type="number" name="protocoloInicio" id="protocoloInicio" value={filtros.protocoloInicio} onChange={handleFiltroChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white" />
                            </div>
                            <div>
                                <label htmlFor="protocoloFim" className="block text-sm text-gray-700 font-medium mb-1">Prot. Fim</label>
                                <input type="number" name="protocoloFim" id="protocoloFim" value={filtros.protocoloFim} onChange={handleFiltroChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white" />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end mt-5">
                        <button onClick={handlePesquisar} className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#dd6825] text-white text-sm font-medium rounded-md hover:bg-[#c25a1f] transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dd6825]">
                            <Search size={16} /> Pesquisar
                        </button>
                    </div>
                </fieldset>

                {/* Resultados */}
                {pesquisaFeita && (
                    <section>
                        <div className="flex justify-between items-center mb-4 print:hidden">
                            <h3 className="text-lg font-medium text-gray-700">{resultados.length} resultado(s) encontrado(s)</h3>
                            {resultados.length > 0 && (
                                <div className='flex items-center gap-2'>
                                    <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#4a4e51] rounded-md hover:bg-[#3b3e40] transition">
                                        <Settings size={16} /> Configurações
                                    </button>
                                    <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#dd6825] rounded-md hover:bg-[#c25a1f] transition">
                                        <Printer size={16} /> Imprimir Livro
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
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo de Serviço</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalhes (Nome/Tipo)</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Livro</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Folha</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Termo</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {resultados.map(item => (
                                            <tr key={item.protocolo} className='hover:bg-gray-50'>
                                                <td className="px-4 py-3 text-sm text-gray-800">{item.protocolo}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{new Date(item.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{item.tipoServico}</td>
                                                {renderLinhaProtocolo(item)}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8 border border-dashed rounded-lg text-gray-500 bg-gray-50 print:hidden">
                                <ListX className="mx-auto mb-2 w-8 h-8" />
                                <p className="text-sm">Nenhum protocolo encontrado com os filtros aplicados.</p>
                            </div>
                        )}
                    </section>
                )}
            </div>

            {/* --- ÁREA DE IMPRESSÃO --- */}
            <style>
                {`
                @media print {
                    @page {
                                    size: A4;
                                    margin: ${configuracaoImpressao.margens.top}cm ${configuracaoImpressao.margens.right}cm ${configuracaoImpressao.margens.bottom}cm ${configuracaoImpressao.margens.left}cm;

                                    @bottom-center {
                                        content: "Página " counter(page) " de " counter(pages);
                                        font-size: 10pt;
                                        color: #666;
                                    }
                                }
                    body * { visibility: hidden; }
                    #area-impressao-protocolo, #area-impressao-protocolo * { visibility: visible; }
                    #area-impressao-protocolo { position: absolute; left: 0; top: 0; width: 100%;}
                    .header-impressao { border-bottom: 2px solid #333; padding-bottom: 0.5rem; margin-bottom: 1rem; display: block; }
                    #tabela-impressao { width: 100%; border-collapse: collapse; font-size: 10pt; }
                    #tabela-impressao th, #tabela-impressao td { padding: 6px 4px; border: 1px solid #ccc; text-align: left; }
                    #tabela-impressao thead { display: table-header-group; } /* Repete o cabeçalho em cada página */
                    #tabela-impressao thead th { background-color: #f9fafb; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                }
                `}
            </style>
            <div id="area-impressao-protocolo" className="hidden print:block">
                <div className="header-impressao">{renderHeaderImpressao()}</div>
                <table id="tabela-impressao">
                    <thead>
                        <tr>
                            <th>Protocolo</th>
                            <th>Data</th>
                            <th>Tipo de Serviço</th>
                            <th>Detalhes (Nome/Tipo)</th>
                            <th>Livro</th>
                            <th>Folha</th>
                            <th>Termo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resultados.map(item => (
                            <tr key={item.protocolo}>
                                <td>{item.protocolo}</td>
                                <td>{new Date(item.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                                <td>{item.tipoServico}</td>
                                {renderLinhaProtocolo(item)}
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