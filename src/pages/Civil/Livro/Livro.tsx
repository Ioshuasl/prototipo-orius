import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, PlusCircle, BookOpen, ListX, FileText, Printer, Settings } from 'lucide-react';
import clsx from 'clsx';
import ModalConfiguracaoImpressao, { type Configuracao } from './ModalConfiguracaoImpressao';
import brasao from '../../../assets/logo-cartorio.png'

type LivroTipo = 'Nascimento' | 'Casamento' | 'Óbito' | 'Livro E';

interface Ato {
    id: number;
    nome: string;
    folha: number;
    termo: string;
    numeroLivro: string;
}

interface Livro {
    id?: number;
    tipo: LivroTipo;
    numero: string;
    dataAbertura: string;
    dataFechamento?: string;
    folhasTotais: number;
    folhaAtual: number;
    livroAntigo: boolean;
    atos?: Ato[];
}

const tipoOptions: LivroTipo[] = ['Nascimento', 'Casamento', 'Óbito', 'Livro E'];

export default function LivroFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [abaAtiva, setAbaAtiva] = useState<'dados' | 'atos'>('dados');
    const [livro, setLivro] = useState<Livro>({
        tipo: 'Nascimento',
        numero: '',
        dataAbertura: '',
        folhasTotais: 200,
        folhaAtual: 1,
        livroAntigo: false,
        atos: [],
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [configuracaoImpressao, setConfiguracaoImpressao] = useState<Configuracao>({
        colunas: {
            protocolo: true,
            nome: true,
            termo: true,
            livro: true,
            folha: true,
        },
        templateCabecalho: 'modelo1',
    });

    const dadosCartorio = {
        nome: "Cartório de Registro Civil e Tabelionato de Notas",
        tabeliao: "Dr. João da Silva",
        endereco: "Avenida Principal, 1234, Centro",
        telefone: "(62) 99999-8888",
        brasaoUrl: brasao
    };

    useEffect(() => {
        if (id) {
            setTimeout(() => {
                setLivro({
                    id: parseInt(id),
                    tipo: 'Óbito',
                    numero: '123',
                    dataAbertura: '2024-05-10',
                    dataFechamento: '2024-12-31',
                    folhasTotais: 200,
                    folhaAtual: 123,
                    livroAntigo: false,
                    atos: [
                        { id: 1, nome: 'João Silva', folha: 101, termo: 'T001', numeroLivro: '123' },
                        { id: 2, nome: 'Maria Oliveira', folha: 105, termo: 'T002', numeroLivro: '123' },
                        { id: 3, nome: 'Pedro Santos', folha: 110, termo: 'T003', numeroLivro: '123' },
                        { id: 4, nome: 'Ana Costa', folha: 115, termo: 'T004', numeroLivro: '123' },
                        { id: 5, nome: 'Lucas Pereira', folha: 120, termo: 'T005', numeroLivro: '123' },
                        { id: 1, nome: 'João Silva', folha: 101, termo: 'T001', numeroLivro: '123' },
                        { id: 2, nome: 'Maria Oliveira', folha: 105, termo: 'T002', numeroLivro: '123' },
                        { id: 3, nome: 'Pedro Santos', folha: 110, termo: 'T003', numeroLivro: '123' },
                        { id: 4, nome: 'Ana Costa', folha: 115, termo: 'T004', numeroLivro: '123' },
                        { id: 5, nome: 'Lucas Pereira', folha: 120, termo: 'T005', numeroLivro: '123' },
                        { id: 1, nome: 'João Silva', folha: 101, termo: 'T001', numeroLivro: '123' },
                        { id: 2, nome: 'Maria Oliveira', folha: 105, termo: 'T002', numeroLivro: '123' },
                        { id: 3, nome: 'Pedro Santos', folha: 110, termo: 'T003', numeroLivro: '123' },
                        { id: 4, nome: 'Ana Costa', folha: 115, termo: 'T004', numeroLivro: '123' },
                        { id: 5, nome: 'Lucas Pereira', folha: 120, termo: 'T005', numeroLivro: '123' },
                        { id: 1, nome: 'João Silva', folha: 101, termo: 'T001', numeroLivro: '123' },
                        { id: 2, nome: 'Maria Oliveira', folha: 105, termo: 'T002', numeroLivro: '123' },
                        { id: 3, nome: 'Pedro Santos', folha: 110, termo: 'T003', numeroLivro: '123' },
                        { id: 4, nome: 'Ana Costa', folha: 115, termo: 'T004', numeroLivro: '123' },
                        { id: 5, nome: 'Lucas Pereira', folha: 120, termo: 'T005', numeroLivro: '123' },
                        { id: 1, nome: 'João Silva', folha: 101, termo: 'T001', numeroLivro: '123' },
                        { id: 2, nome: 'Maria Oliveira', folha: 105, termo: 'T002', numeroLivro: '123' },
                        { id: 3, nome: 'Pedro Santos', folha: 110, termo: 'T003', numeroLivro: '123' },
                        { id: 4, nome: 'Ana Costa', folha: 115, termo: 'T004', numeroLivro: '123' },
                        { id: 5, nome: 'Lucas Pereira', folha: 120, termo: 'T005', numeroLivro: '123' },
                        { id: 1, nome: 'João Silva', folha: 101, termo: 'T001', numeroLivro: '123' },
                        { id: 2, nome: 'Maria Oliveira', folha: 105, termo: 'T002', numeroLivro: '123' },
                        { id: 3, nome: 'Pedro Santos', folha: 110, termo: 'T003', numeroLivro: '123' },
                        { id: 4, nome: 'Ana Costa', folha: 115, termo: 'T004', numeroLivro: '123' },
                        { id: 5, nome: 'Lucas Pereira', folha: 120, termo: 'T005', numeroLivro: '123' },
                        { id: 1, nome: 'João Silva', folha: 101, termo: 'T001', numeroLivro: '123' },
                        { id: 2, nome: 'Maria Oliveira', folha: 105, termo: 'T002', numeroLivro: '123' },
                        { id: 3, nome: 'Pedro Santos', folha: 110, termo: 'T003', numeroLivro: '123' },
                        { id: 4, nome: 'Ana Costa', folha: 115, termo: 'T004', numeroLivro: '123' },
                        { id: 5, nome: 'Lucas Pereira', folha: 120, termo: 'T005', numeroLivro: '123' },
                        { id: 1, nome: 'João Silva', folha: 101, termo: 'T001', numeroLivro: '123' },
                        { id: 2, nome: 'Maria Oliveira', folha: 105, termo: 'T002', numeroLivro: '123' },
                        { id: 3, nome: 'Pedro Santos', folha: 110, termo: 'T003', numeroLivro: '123' },
                        { id: 4, nome: 'Ana Costa', folha: 115, termo: 'T004', numeroLivro: '123' },
                        { id: 5, nome: 'Lucas Pereira', folha: 120, termo: 'T005', numeroLivro: '123' },
                        { id: 1, nome: 'João Silva', folha: 101, termo: 'T001', numeroLivro: '123' },
                        { id: 2, nome: 'Maria Oliveira', folha: 105, termo: 'T002', numeroLivro: '123' },
                        { id: 3, nome: 'Pedro Santos', folha: 110, termo: 'T003', numeroLivro: '123' },
                        { id: 4, nome: 'Ana Costa', folha: 115, termo: 'T004', numeroLivro: '123' },
                        { id: 5, nome: 'Lucas Pereira', folha: 120, termo: 'T005', numeroLivro: '123' },
                        { id: 1, nome: 'João Silva', folha: 101, termo: 'T001', numeroLivro: '123' },
                        { id: 2, nome: 'Maria Oliveira', folha: 105, termo: 'T002', numeroLivro: '123' },
                        { id: 3, nome: 'Pedro Santos', folha: 110, termo: 'T003', numeroLivro: '123' },
                        { id: 4, nome: 'Ana Costa', folha: 115, termo: 'T004', numeroLivro: '123' },
                        { id: 5, nome: 'Lucas Pereira', folha: 120, termo: 'T005', numeroLivro: '123' },
                        { id: 1, nome: 'João Silva', folha: 101, termo: 'T001', numeroLivro: '123' },
                        { id: 2, nome: 'Maria Oliveira', folha: 105, termo: 'T002', numeroLivro: '123' },
                        { id: 3, nome: 'Pedro Santos', folha: 110, termo: 'T003', numeroLivro: '123' },
                        { id: 4, nome: 'Ana Costa', folha: 115, termo: 'T004', numeroLivro: '123' },
                        { id: 5, nome: 'Lucas Pereira', folha: 120, termo: 'T005', numeroLivro: '123' },
                        { id: 1, nome: 'João Silva', folha: 101, termo: 'T001', numeroLivro: '123' },
                        { id: 2, nome: 'Maria Oliveira', folha: 105, termo: 'T002', numeroLivro: '123' },
                        { id: 3, nome: 'Pedro Santos', folha: 110, termo: 'T003', numeroLivro: '123' },
                        { id: 4, nome: 'Ana Costa', folha: 115, termo: 'T004', numeroLivro: '123' },
                        { id: 5, nome: 'Lucas Pereira', folha: 120, termo: 'T005', numeroLivro: '123' },
                        { id: 1, nome: 'João Silva', folha: 101, termo: 'T001', numeroLivro: '123' },
                        { id: 2, nome: 'Maria Oliveira', folha: 105, termo: 'T002', numeroLivro: '123' },
                        { id: 3, nome: 'Pedro Santos', folha: 110, termo: 'T003', numeroLivro: '123' },
                        { id: 4, nome: 'Ana Costa', folha: 115, termo: 'T004', numeroLivro: '123' },
                        { id: 5, nome: 'Lucas Pereira', folha: 120, termo: 'T005', numeroLivro: '123' },
                        { id: 1, nome: 'João Silva', folha: 101, termo: 'T001', numeroLivro: '123' },
                        { id: 2, nome: 'Maria Oliveira', folha: 105, termo: 'T002', numeroLivro: '123' },
                        { id: 3, nome: 'Pedro Santos', folha: 110, termo: 'T003', numeroLivro: '123' },
                        { id: 4, nome: 'Ana Costa', folha: 115, termo: 'T004', numeroLivro: '123' },
                        { id: 5, nome: 'Lucas Pereira', folha: 120, termo: 'T005', numeroLivro: '123' },
                    ]
                });
            }, 300);
        }
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setLivro(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = () => {
        if (id) {
            alert('Alterações salvas com sucesso!');
        } else {
            alert('Livro criado com sucesso!');
        }
        navigate('/livros');
    };


    const handleSaveConfig = (novaConfig: Configuracao) => {
        setConfiguracaoImpressao(novaConfig);
        setIsModalOpen(false);
    };

    const renderHeaderImpressao = () => {
        const template = configuracaoImpressao.templateCabecalho;
        const titulo = `Relatório de Atos do Livro`;

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

    return (
        <>
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex items-center justify-between print:hidden">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            {id ? 'Editar Livro' : 'Novo Livro'}
                        </h1>
                        <p className="text-sm text-gray-500">Gerencie os dados do livro e os atos vinculados.</p>
                    </div>
                    <button onClick={() => window.history.back()} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300">
                        <ArrowLeft size={16} /> Voltar
                    </button>
                </div>

                <div className="flex border-b text-sm font-medium text-gray-600 print:hidden">
                    <button onClick={() => setAbaAtiva('dados')} className={clsx('px-4 py-2 -mb-px border-b-2', abaAtiva === 'dados' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-blue-500')}>
                        Dados do Livro
                    </button>
                    <button onClick={() => setAbaAtiva('atos')} className={clsx('px-4 py-2 -mb-px border-b-2', abaAtiva === 'atos' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-blue-500')}>
                        Atos Vinculados
                    </button>
                </div>

                {abaAtiva === 'dados' ? (
                    <div className="space-y-6">
                        <fieldset className="border border-gray-200 rounded-lg p-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                                <div className="flex items-center gap-3">
                                    <input type="checkbox" name="livroAntigo" checked={livro.livroAntigo} onChange={handleInputChange} id="livroAntigo" className="accent-blue-600 w-5 h-5" />
                                    <label htmlFor="livroAntigo" className="text-sm text-gray-700 font-medium">Livro Antigo</label>
                                </div>
                                <div>
                                    <label htmlFor="tipo" className="block text-sm text-gray-700 font-medium mb-1">Tipo de Ato</label>
                                    <select name="tipo" id="tipo" value={livro.tipo} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        {tipoOptions.map(tipo => (<option key={tipo} value={tipo}>{tipo}</option>))}
                                    </select>
                                </div>
                                <div className="md:col-span-1">
                                    <label htmlFor="numero" className="block text-sm text-gray-700 font-medium mb-1">Número do Livro</label>
                                    <input name="numero" id="numero" type="text" value={livro.numero} onChange={handleInputChange} readOnly={!livro.livroAntigo && !id} className={`w-full border rounded-md px-3 py-2 text-sm ${!livro.livroAntigo && !id ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'}`} placeholder={livro.livroAntigo ? 'Digite o número' : 'Será preenchido automaticamente'} />
                                </div>
                                <div className="md:col-span-1">
                                    <label htmlFor="dataAbertura" className="block text-sm text-gray-700 font-medium mb-1">Data de Abertura</label>
                                    <input type="date" name="dataAbertura" id="dataAbertura" value={livro.dataAbertura} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="md:col-span-1">
                                    <label htmlFor="folhasTotais" className="block text-sm text-gray-700 font-medium mb-1">Total de Folhas</label>
                                    <input type="number" name="folhasTotais" id="folhasTotais" value={livro.folhasTotais} onChange={handleInputChange} min={1} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="md:col-span-1">
                                    <label htmlFor="folhaAtual" className="block text-sm text-gray-700 font-medium mb-1">Folha Atual</label>
                                    <input type="number" name="folhaAtual" id="folhaAtual" value={livro.folhaAtual} onChange={handleInputChange} min={1} max={livro.folhasTotais} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                        </fieldset>
                        <div className="flex justify-end pt-4"><button onClick={handleSubmit} className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition">{id ? <><Save size={16} /> Salvar Alterações</> : <><PlusCircle size={16} /> Criar Livro</>}</button></div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <style>
                            {`
                            @media print {
                                @page {
                                    size: A4;
                                    margin: 0cm 0.5cm 1cm 0.5cm;

                                    @bottom-center {
                                        content: "Página " counter(page) " de " counter(pages);
                                        font-size: 10pt;
                                        color: #666;
                                    }
                                }

                                body * { visibility: hidden; }
                                #area-impressao-atos, #area-impressao-atos * { visibility: visible; }
                                #area-impressao-atos { position: absolute; left: 0; top: 0; width: 100%;}
                                
                                .header-impressao {
                                    border-bottom: 2px solid #333;
                                    padding-bottom: 0.5rem;
                                    margin-bottom: 1rem;
                                    display: block; /* Garante que o header seja exibido */
                                }

                                #tabela-atos { width: 100%; border-collapse: collapse; font-size: 10pt; }
                                #tabela-atos th, #tabela-atos td { padding: 8px 4px; border-bottom: 1px solid #ccc; text-align: left; }
                                #tabela-atos thead { display: table-header-group; }
                                #tabela-atos thead th { border-top: 1px solid #ccc; background-color: #white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                            }
                        `}
                        </style>
                        <section>
                            <div className="flex justify-between items-center mb-4 print:hidden">
                                <h3 className="text-lg font-medium text-gray-700">Atos Registrados no Livro</h3>
                                {livro.atos && livro.atos.length > 0 && (
                                    <div className='flex items-center gap-2'>
                                        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gray-600 rounded-md hover:bg-gray-700 transition">
                                            <Settings size={16} />
                                            Configurações de Impressão
                                        </button>

                                        <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gray-600 rounded-md hover:bg-gray-700 transition">
                                            <Printer size={16} />
                                            Imprimir Livro
                                        </button>
                                    </div>
                                )}
                            </div>

                            {livro.atos && livro.atos.length > 0 ? (
                                <div>
                                    <ul className="space-y-3 print:hidden">
                                        {livro.atos.sort((a, b) => a.folha - b.folha).map((ato, index) => (
                                            <li key={index} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                                    <div>
                                                        <h4 className="text-sm font-semibold text-gray-800">{ato.nome}</h4>
                                                        <p className="text-xs text-gray-500 mt-0.5">Termo nº {ato.termo}</p>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                                        <div className="flex items-center gap-1">
                                                            <BookOpen size={14} className="text-gray-400" />
                                                            Livro {ato.numeroLivro}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <FileText size={14} className="text-gray-400" />
                                                            Folha {ato.folha}
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>

                                    <div id="area-impressao-atos" className="hidden print:block">
                                        <table id="tabela-atos">
                                            <thead>
                                                <tr>
                                                    <th colSpan={5} style={{ textAlign: 'center', padding: '16px 0' }}>
                                                        <div>
                                                            {renderHeaderImpressao()}
                                                            <p className="text-sm mt-2">Livro Nº: {livro.numero} - Tipo: {livro.tipo}</p>
                                                        </div>
                                                    </th>
                                                </tr>
                                                <tr>
                                                    {configuracaoImpressao.colunas.protocolo && <th>Protocolo</th>}
                                                    {configuracaoImpressao.colunas.nome && <th>Nome</th>}
                                                    {configuracaoImpressao.colunas.termo && <th>Termo</th>}
                                                    {configuracaoImpressao.colunas.livro && <th>Livro</th>}
                                                    {configuracaoImpressao.colunas.folha && <th>Folha</th>}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {livro.atos?.sort((a, b) => a.folha - b.folha).map((ato) => (
                                                    <tr key={ato.id}>
                                                        {configuracaoImpressao.colunas.protocolo && <td>{ato.id}</td>}
                                                        {configuracaoImpressao.colunas.nome && <td>{ato.nome}</td>}
                                                        {configuracaoImpressao.colunas.termo && <td>{ato.termo}</td>}
                                                        {configuracaoImpressao.colunas.livro && <td>{ato.numeroLivro}</td>}
                                                        {configuracaoImpressao.colunas.folha && <td>{ato.folha}</td>}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8 border border-dashed rounded-lg text-gray-500 bg-gray-50 print:hidden">
                                    <ListX className="mx-auto mb-2 w-8 h-8" />
                                    <p className="text-sm">Nenhum ato vinculado.</p>
                                </div>
                            )}
                        </section>
                    </div>
                )}
            </div>

            <ModalConfiguracaoImpressao
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveConfig}
                configuracaoAtual={configuracaoImpressao}
            />
        </>
    );
}