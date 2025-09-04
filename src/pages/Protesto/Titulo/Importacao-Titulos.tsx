import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Landmark, UploadCloud, FileText, Loader2, CheckCircle, XCircle, ChevronLeft, X, ShieldCheck, Eye } from 'lucide-react';
import { toast } from 'react-toastify';
import { type ITituloProtesto, type TPessoaTipo, type IEndereco, type IPessoaFisica, type IPessoaJuridica, type IBank } from '../types'; // Ajuste o caminho se necessário
import tabelaEmolumentos from '../../../../tabela-emolumentos.json';
import { mockEndereco1 } from '../lib/Constants';

type TStep = 'selection' | 'preview' | 'importing' | 'summary';

interface IEmolumento {
    descricao_selo: string;
    id_selo: number;
    sistema: string;
}
// Estrutura para os dados analisados do arquivo
interface IParsedData {
    tituloData: Partial<ITituloProtesto>;
    seloId: number;
}


// --- FUNÇÕES DE SIMULAÇÃO (Substituir pela sua lógica real) ---

/**
 * SIMULAÇÃO APRIMORADA: Analisa o arquivo e determina o ID do selo para CADA título.
 */
const parseCRAFile = async (fileContent: string): Promise<IParsedData[]> => {
    console.log("Simulando a leitura do arquivo CRA e determinando selo por título...");
    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockApresentante: IPessoaJuridica = { tipo: 'juridica', razaoSocial: 'Banco Exemplo S/A', cnpj: '12.345.678/0001-99', endereco: mockEndereco1, qsa: [{ nome: 'Diretor Exemplo', qualificacao: 'Diretor'}] };
    const mockDevedor1: IPessoaFisica = { tipo: 'fisica', nome: 'João da Silva (do TXT)', cpf: '123.456.789-00', endereco: { logradouro: 'Rua das Flores', numero: '123', bairro: 'Centro', cidade: 'Qualquer', uf: 'GO', cep: '74000-000' } as IEndereco, dataNascimento: '1980-01-01', docIdentidadeNum: '1234567', docIdentidadeTipo: 'RG', nacionalidade: 'Brasileira', naturalidadeCidade: 'Anápolis', naturalidadeUF: 'GO', profissao: 'Autônomo' };
    const mockDevedor2: IPessoaJuridica = { tipo: 'juridica', razaoSocial: 'Empresa MEI Exemplo (do TXT)', cnpj: '99.888.777/0001-66', endereco: { logradouro: 'Avenida Principal', numero: '456', bairro: 'Jardins', cidade: 'Qualquer', uf: 'GO', cep: '74001-001'} as IEndereco };
    const mockCedente: IPessoaJuridica = { tipo: 'juridica', razaoSocial: 'Fundo de Investimento Alfa', cnpj: '10.203.040/0001-05', endereco: mockEndereco1 };

    const titulosEncontrados: IParsedData[] = [
        {
            tituloData: { apresentante: mockApresentante, devedores: [mockDevedor1], valor: 1250.50, dataVencimento: new Date('2025-09-20'), especieTitulo: 'Duplicata Mercantil', numeroTitulo: 'FAT1020', banco: 341 },
            // SIMULAÇÃO: Este título usará o selo de pagamento posterior comum.
            seloId: 3116 
        },
        {
            tituloData: { apresentante: mockApresentante, devedores: [mockDevedor2], valor: 350.00, dataVencimento: new Date('2025-09-25'), especieTitulo: 'Duplicata Mercantil', numeroTitulo: 'FAT1021', cedente: mockCedente, banco: 341 },
            // SIMULAÇÃO: Este título, por ser de uma MEI, usará um selo de isenção.
            seloId: 3146
        },
    ];
    
    toast.success(`${titulosEncontrados.length} títulos reconhecidos no arquivo!`);
    return titulosEncontrados;
};

/**
 * SIMULAÇÃO: Gera um selo de apontamento com pagamento posterior.
 */
const generateSeloApontamento = async (seloId: number): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return `SELO-${seloId}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
};


export default function ImportacaoTitulosPage() {
    const [step, setStep] = useState<TStep>('selection');
    const [bancos, setBancos] = useState<IBank[]>([]);
    const [selectedBank, setSelectedBank] = useState<IBank | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [parsedData, setParsedData] = useState<IParsedData[]>([]);
    const [importedResult, setImportedResult] = useState<{ protocolo: string; selo: string; devedor: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSeloConfirmModalOpen, setIsSeloConfirmModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedTitleForPreview, setSelectedTitleForPreview] = useState<Partial<ITituloProtesto> | null>(null);

    // Lógica para o campo de busca de banco
    const [bancoSearch, setBancoSearch] = useState('');
    const [bancoSuggestions, setBancoSuggestions] = useState<IBank[]>([]);
    const [isBancoDropdownOpen, setIsBancoDropdownOpen] = useState(false);
    const bancoFilterRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchBancos = async () => {
             try {
                const response = await fetch('https://brasilapi.com.br/api/banks/v1');
                if (response.ok) {
                    const data: IBank[] = await response.json();
                    const sanitizedData = data.map(banco => ({
                        ...banco,
                        code: banco.code === null ? 0 : banco.code
                    }));
                    setBancos(sanitizedData);
                }
            } catch (error) {
                console.error("Erro ao buscar a lista de bancos:", error);
                toast.error("Não foi possível carregar a lista de bancos.");
            }
        };
        fetchBancos();
    }, []);

    useEffect(() => {
        if (bancoSearch) {
            const searchTerm = bancoSearch.toLowerCase();
            setBancoSuggestions(
                bancos.filter(b =>
                    (b.name && b.name.toLowerCase().includes(searchTerm)) ||
                    b.code.toString().includes(searchTerm)
                )
            );
        } else {
            setBancoSuggestions(bancos);
        }
    }, [bancoSearch, bancos]);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (bancoFilterRef.current && !bancoFilterRef.current.contains(event.target as Node)) {
                setIsBancoDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [bancoFilterRef]);

    const handleBankSelect = (banco: IBank) => {
        setSelectedBank(banco);
        setBancoSearch(`${banco.code} - ${banco.name}`);
        setIsBancoDropdownOpen(false);
    };

    const handleClearBanco = () => {
        setSelectedBank(null);
        setBancoSearch('');
        setIsBancoDropdownOpen(false);
    };

    const handleFileSelect = async (file: File | null) => {
        if (!file) return;
        if (!file.name.endsWith('.txt')) {
            toast.error("Por favor, selecione um arquivo .txt");
            return;
        }
        setSelectedFile(file);
        setIsLoading(true);

        const fileContent = await file.text();
        const data = await parseCRAFile(fileContent);
        setParsedData(data);
        setIsLoading(false);
        setStep('preview');
    };

    const handleOpenSeloConfirmModal = () => {
        setIsSeloConfirmModalOpen(true);
    };

    const handleFinalImport = async () => {
        setIsSeloConfirmModalOpen(false);
        setStep('importing');
        setIsLoading(true);

        const results = [];
        for (const item of parsedData) {
            const selo = await generateSeloApontamento(item.seloId);
            const protocolo = `2025-${Math.floor(10000 + Math.random() * 90000)}`;
            const devedor = item.tituloData.devedores?.[0];
            const devedorName = devedor ? (devedor.tipo === 'fisica' ? devedor.nome : devedor.razaoSocial) : 'N/A';
            results.push({ protocolo, selo, devedor: devedorName });
        }

        setImportedResult(results);
        setIsLoading(false);
        setStep('summary');
        toast.success("Títulos importados com sucesso!");
    };
    
    const handleReset = () => {
        setStep('selection');
        setSelectedBank(null);
        setSelectedFile(null);
        setParsedData([]);
        setImportedResult([]);
        handleClearBanco();
    };

    const handleOpenDetailsModal = (titulo: Partial<ITituloProtesto>) => {
        setSelectedTitleForPreview(titulo);
        setIsDetailsModalOpen(true);
    };

    const renderPartyDetails = (party: TPessoaTipo) => {
        if (party.tipo === 'fisica') {
            return (
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    <strong>Nome:</strong><span>{party.nome}</span>
                    <strong>CPF:</strong><span>{party.cpf}</span>
                    <strong>Endereço:</strong><span>{`${party.endereco.logradouro}, ${party.endereco.numero} - ${party.endereco.bairro}, ${party.endereco.cidade}/${party.endereco.uf}`}</span>
                </div>
            );
        }
        if (party.tipo === 'juridica') {
            return (
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    <strong>Razão Social:</strong><span>{party.razaoSocial}</span>
                    <strong>CNPJ:</strong><span>{party.cnpj}</span>
                    <strong>Endereço:</strong><span>{`${party.endereco.logradouro}, ${party.endereco.numero} - ${party.endereco.bairro}, ${party.endereco.cidade}/${party.endereco.uf}`}</span>
                </div>
            );
        }
        return null;
    };

    return (
        <>
            <title>Importação de Títulos (CRA)</title>
            <main className="flex-1 p-6 bg-gray-50 min-h-screen font-sans">
                <div className="max-w-4xl mx-auto">
                    <header className="mb-8">
                        <Link to="/protesto/titulos" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-2">
                            <ChevronLeft size={18} /> Voltar para o Gerenciamento
                        </Link>
                        <h1 className="text-3xl font-bold text-[#4a4e51]">Importação de Títulos (CRA)</h1>
                        <p className="text-md text-gray-500 mt-1">Siga as etapas para importar um arquivo de remessa (.txt).</p>
                    </header>

                    {/* ETAPA 1: SELEÇÃO */}
                    {step === 'selection' && (
                        <div className="bg-white p-8 rounded-xl shadow-sm border space-y-6 animate-fade-in">
                            <div>
                                <h2 className="font-semibold text-lg text-gray-800 flex items-center gap-2"><span className="flex items-center justify-center bg-blue-600 text-white rounded-full h-6 w-6 text-sm">1</span> Selecione o Banco</h2>
                                <div ref={bancoFilterRef} className="relative mt-2">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={bancoSearch}
                                            onChange={(e) => {
                                                setBancoSearch(e.target.value);
                                                setSelectedBank(null);
                                            }}
                                            onFocus={() => setIsBancoDropdownOpen(true)}
                                            placeholder="Digite o código ou nome do banco"
                                            className="border border-gray-300 rounded-md pl-3 pr-8 py-2 w-full focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]"
                                            disabled={bancos.length === 0}
                                        />
                                        {bancoSearch && (
                                            <button onClick={handleClearBanco} className="absolute inset-y-0 right-0 flex items-center pr-2">
                                                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                            </button>
                                        )}
                                    </div>
                                    {isBancoDropdownOpen && (
                                        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                                            {bancoSuggestions.length > 0 ? (
                                                bancoSuggestions.map(b => (
                                                    <li key={b.code} onClick={() => handleBankSelect(b)} className="px-3 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100">
                                                        {b.code} - {b.name}
                                                    </li>
                                                ))
                                            ) : ( <li className="px-3 py-2 text-sm text-gray-500">Nenhum banco encontrado</li> )}
                                        </ul>
                                    )}
                                </div>
                            </div>
                            <div>
                                <h2 className={`font-semibold text-lg flex items-center gap-2 ${!selectedBank ? 'text-gray-400' : 'text-gray-800'}`}><span className={`flex items-center justify-center rounded-full h-6 w-6 text-sm ${!selectedBank ? 'bg-gray-300 text-gray-500' : 'bg-blue-600 text-white'}`}>2</span> Selecione o Arquivo .txt</h2>
                                <div className={`mt-2 p-6 border-2 border-dashed rounded-lg text-center ${!selectedBank ? 'bg-gray-100 cursor-not-allowed' : 'border-gray-300 hover:border-blue-500'}`}>
                                    <UploadCloud className={`mx-auto h-12 w-12 ${!selectedBank ? 'text-gray-400' : 'text-gray-500'}`} />
                                    <label htmlFor="file-upload" className={`mt-2 text-sm font-semibold ${!selectedBank ? 'text-gray-400' : 'text-blue-600 cursor-pointer'}`}>
                                        <p>{selectedFile ? `Arquivo selecionado: ${selectedFile.name}` : 'Clique para selecionar o arquivo'}</p>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".txt" disabled={!selectedBank} onChange={(e) => handleFileSelect(e.target.files ? e.target.files[0] : null)} />
                                    </label>
                                    <p className={`mt-1 text-xs ${!selectedBank ? 'text-gray-400' : 'text-gray-500'}`}>Arquivo de remessa (.txt) baixado da CRA</p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* ETAPA 2: PRÉ-VISUALIZAÇÃO */}
                    {step === 'preview' && (
                         <div className="bg-white p-8 rounded-xl shadow-sm border animate-fade-in">
                            <h2 className="text-xl font-bold text-gray-800">Revisão dos Títulos</h2>
                            <p className="text-gray-600 mt-1">Foram reconhecidos <strong className="text-blue-600">{parsedData.length} títulos</strong> no arquivo <strong className="text-gray-800">{selectedFile?.name}</strong> para o <strong className="text-gray-800">{selectedBank?.name}</strong>.</p>
                            <div className="mt-4 max-h-[50vh] overflow-auto space-y-3 pr-2">
                                {parsedData.map((item, index) => {
                                    const devedor = item.tituloData.devedores?.[0];
                                    const devedorNome = devedor ? (devedor.tipo === 'fisica' ? devedor.nome : devedor.razaoSocial) : 'Devedor não identificado';
                                    return (
                                        <div key={index} className="border bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                                            <div className="flex items-center gap-4">
                                                <FileText className="h-8 w-8 text-gray-400"/>
                                                <div>
                                                    <p className="font-bold text-gray-800">{devedorNome}</p>
                                                    <p className="text-sm text-gray-600">
                                                        Valor: <span className="font-semibold">R$ {item.tituloData.valor?.toFixed(2)}</span> | 
                                                        Vencimento: <span className="font-semibold">{item.tituloData.dataVencimento?.toLocaleDateString('pt-BR')}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => handleOpenDetailsModal(item.tituloData)}
                                                className="flex items-center gap-2 text-sm font-semibold bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100"
                                            >
                                                <Eye size={16} /> Ver Detalhes
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button onClick={handleReset} className="font-semibold text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-1"><XCircle size={16} />Cancelar</button>
                                <button onClick={handleOpenSeloConfirmModal} className="font-bold text-white bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-1"><CheckCircle size={16} />Importar {parsedData.length} Títulos</button>
                            </div>
                        </div>
                    )}

                    {/* ETAPAS 3 e 4: IMPORTANDO E RESUMO */}
                    {(step === 'importing' || step === 'summary') && (
                        <div className="bg-white p-8 rounded-xl shadow-sm border text-center animate-fade-in">
                            {isLoading ? (
                                <><Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto" /><h2 className="text-xl font-bold text-gray-800 mt-4">Importando e Gerando Selos...</h2><p className="text-gray-600">Por favor, aguarde.</p></>
                            ) : (
                                <><CheckCircle className="h-12 w-12 text-green-500 mx-auto" /><h2 className="text-xl font-bold text-gray-800 mt-4">Importação Concluída!</h2><p className="text-gray-600"><strong className="text-green-600">{importedResult.length} títulos</strong> foram importados e selados com sucesso.</p>
                                <div className="mt-4 max-h-80 overflow-auto border rounded-lg text-left">
                                     <table className="w-full text-sm"><thead className="bg-gray-50"><tr><th className="px-4 py-2">Protocolo</th><th className="px-4 py-2">Selo de Apontamento</th><th className="px-4 py-2">Devedor</th></tr></thead>
                                        <tbody className="divide-y">{importedResult.map((r, i) => <tr key={i}><td className="px-4 py-2 font-mono">{r.protocolo}</td><td className="px-4 py-2 font-mono">{r.selo}</td><td className="px-4 py-2">{r.devedor}</td></tr>)}</tbody>
                                    </table>
                                </div>
                                <div className="flex justify-center gap-3 mt-6">
                                    <button onClick={handleReset} className="font-bold text-white bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700">Importar Outro Arquivo</button>
                                    <Link to="/protesto/titulos" className="font-semibold text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100">Ir para o Gerenciamento</Link>
                                </div></>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* MODAL DE CONFIRMAÇÃO DE SELO */}
            {isSeloConfirmModalOpen && (
                <div className="fixed inset-0 z-50 flex justify-center items-center p-4 animate-fade-in-fast bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center p-4 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="h-6 w-6 text-blue-600" />
                                <h2 className="text-xl font-bold text-gray-800">Confirmação de Geração de Selos</h2>
                            </div>
                            <button onClick={() => setIsSeloConfirmModalOpen(false)} className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700"><X className="h-6 w-6" /></button>
                        </div>
                        <div className="p-6 overflow-auto">
                            <p className="text-gray-600 text-center mb-4">
                                Os seguintes selos serão gerados para os <strong className="font-semibold text-gray-800">{parsedData.length} títulos</strong> importados. Por favor, confirme se as atribuições estão corretas.
                            </p>
                            <div className="border rounded-lg overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-600">Devedor</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-600">ID Selo</th>
                                            <th className="px-4 py-2 text-left font-semibold text-gray-600">Descrição do Selo</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {parsedData.map((item, index) => {
                                            const devedor = item.tituloData.devedores?.[0];
                                            const devedorNome = devedor ? (devedor.tipo === 'fisica' ? devedor.nome : devedor.razaoSocial) : 'N/A';
                                            const seloInfo = tabelaEmolumentos.find(s => s.id_selo === item.seloId);
                                            return (
                                                <tr key={index}>
                                                    <td className="px-4 py-2 font-medium text-gray-800">{devedorNome}</td>
                                                    <td className="px-4 py-2 font-mono text-blue-700">{item.seloId}</td>
                                                    <td className="px-4 py-2 text-gray-600">{seloInfo ? seloInfo.descricao_selo : 'Descrição não encontrada'}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 border-t flex justify-end gap-3">
                             <button onClick={() => setIsSeloConfirmModalOpen(false)} className="font-semibold text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100">Cancelar</button>
                            <button onClick={handleFinalImport} className="font-bold text-white bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700">Confirmar e Importar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL DE DETALHES DO TÍTULO */}
            {isDetailsModalOpen && selectedTitleForPreview && (
                 <div className="fixed inset-0 z-50 flex justify-center items-center p-4 animate-fade-in-fast bg-gray-900/50 backdrop-blur-sm" onClick={() => setIsDetailsModalOpen(false)}>
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center p-4 border-b">
                            <h2 className="text-xl font-bold text-gray-800">Detalhes do Título a ser Importado</h2>
                            <button onClick={() => setIsDetailsModalOpen(false)} className="p-1 rounded-full text-gray-400 hover:bg-gray-100"><X className="h-6 w-6" /></button>
                        </div>
                        <div className="p-6 overflow-auto space-y-4 text-gray-700">
                            <div>
                                <h3 className="font-semibold text-gray-500 text-sm border-b pb-1 mb-2">INFORMAÇÕES GERAIS</h3>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                                    <strong>Protocolo:</strong><span>A ser gerado na importação</span>
                                    <strong>Espécie:</strong><span>{selectedTitleForPreview.especieTitulo || 'N/A'}</span>
                                    <strong>Valor:</strong><span>R$ {selectedTitleForPreview.valor?.toFixed(2) || '0.00'}</span>
                                    <strong>Vencimento:</strong><span>{selectedTitleForPreview.dataVencimento?.toLocaleDateString('pt-BR') || 'N/A'}</span>
                                    <strong>Banco:</strong><span>{selectedTitleForPreview.banco ? `${selectedTitleForPreview.banco} - ${bancos.find(b => b.code === selectedTitleForPreview.banco)?.name}` : 'N/A'}</span>
                                </div>
                            </div>
                            {selectedTitleForPreview.apresentante && <div>
                                <h3 className="font-semibold text-gray-500 text-sm border-b pb-1 mb-2">APRESENTANTE</h3>
                                {renderPartyDetails(selectedTitleForPreview.apresentante)}
                            </div>}
                            {selectedTitleForPreview.cedente && <div>
                                <h3 className="font-semibold text-gray-500 text-sm border-b pb-1 mb-2">CEDENTE</h3>
                                {renderPartyDetails(selectedTitleForPreview.cedente)}
                            </div>}
                            <div>
                                <h3 className="font-semibold text-gray-500 text-sm border-b pb-1 mb-2">DEVEDOR(ES)</h3>
                                <div className="space-y-3">
                                    {selectedTitleForPreview.devedores?.map((devedor, index) => <div key={index}>{renderPartyDetails(devedor)}</div>)}
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 border-t flex justify-end">
                            <button onClick={() => setIsDetailsModalOpen(false)} className="font-semibold bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300">Fechar</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}