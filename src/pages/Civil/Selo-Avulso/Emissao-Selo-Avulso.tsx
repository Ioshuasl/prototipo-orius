import React, { useState, useEffect, useMemo, useRef } from 'react';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, FileText, PlusCircle, Trash2, Search, X, ArrowLeft } from 'lucide-react';
import SeletorRequerente from './Components/SeletorRequerente'; 
import { type ISeloAvulsoFormData, type ISeloAvulsoItem, type AtoOriginalTipo } from '../types'; 
import TabelaEmolumentos from '../../../../tabela-emolumentos.json';
import { mockSelosAvulsos } from '../lib/Constants';

// --- Estado Inicial e Funções (Lógica inalterada) ---
const initialSeloAvulsoState: ISeloAvulsoFormData = {
    protocolo: `SA-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
    dataSolicitacao: new Date().toISOString().split('T')[0],
    status: 'Em Aberto',
    requerente: { tipo: 'fisica' },
    referenciaAto: {
        nomePartePrincipal: '',
        tipoAto: '',
        dataRegistro: '',
    },
    selosSolicitados: [],
    observacaoGeral: '',
    valores: { emolumentos: 0, fundos: 0, taxas: 0, total: 0 },
    pagamento: { metodo: '', status: 'pendente' },
};

const atoOptions: AtoOriginalTipo[] = ['Nascimento', 'Casamento', 'Óbito', 'Natimorto', 'Livro E'];

const selosRegistroCivil = TabelaEmolumentos.filter(selo =>
    selo.sistema === "REGISTRO CIVIL"
).sort((a, b) => a.descricao_selo.localeCompare(b.descricao_selo));

const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

interface SeloSearchInputProps {
    selectedSeloId: number | null;
    onSeloSelect: (selo: typeof TabelaEmolumentos[0]) => void;
    onClear: () => void;
}

const SeloSearchInput: React.FC<SeloSearchInputProps> = ({ selectedSeloId, onSeloSelect, onClear }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    const selectedSelo = useMemo(() => {
        return selosRegistroCivil.find(s => s.id_selo === selectedSeloId) || null;
    }, [selectedSeloId]);

    const filteredSelos = useMemo(() => {
        if (!searchTerm) return selosRegistroCivil;
        const term = searchTerm.toLowerCase();
        return selosRegistroCivil.filter(selo =>
            selo.descricao_selo.toLowerCase().includes(term) ||
            String(selo.id_selo).includes(term)
        );
    }, [searchTerm]);

    const handleSelect = (selo: typeof TabelaEmolumentos[0]) => {
        onSeloSelect(selo);
        setIsDropdownOpen(false);
        setSearchTerm('');
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={searchRef}>
            {selectedSelo ? (
                <div className="w-full border border-gray-300 rounded-md p-2 bg-gray-100 flex justify-between items-center">
                    <span className="text-sm text-gray-700"><strong>{selectedSelo.id_selo}:</strong> {selectedSelo.descricao_selo}</span>
                    <button type="button" onClick={onClear} className="text-gray-500 hover:text-red-600"><X size={16} /></button>
                </div>
            ) : (
                <>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-5 w-5 text-gray-400" /></div>
                    {/* ALTERADO: Estilo de foco no input de busca */}
                    <input
                        type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onFocus={() => setIsDropdownOpen(true)}
                        placeholder="Digite o ID ou a descrição do selo"
                        className="w-full border border-gray-300 rounded-md p-2 pl-10 text-sm focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]"
                        autoComplete="off"
                    />
                    {isDropdownOpen && (
                        <div className="absolute z-20 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
                            {filteredSelos.length > 0 ? filteredSelos.map(selo => (
                                // ALTERADO: Cor do hover no dropdown
                                <div key={selo.id_selo} onClick={() => handleSelect(selo)} className="p-2 hover:bg-[#dd6825]/10 cursor-pointer text-sm">
                                    <strong>{selo.id_selo}</strong> - {selo.descricao_selo}
                                </div>
                            )) : <div className="p-2 text-sm text-gray-500">Nenhum selo encontrado.</div>}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default function EmissaoSeloAvulso() {
    const { protocolo } = useParams<{ protocolo: string }>();
    const navigate = useNavigate();
    const [pedido, setPedido] = useState<ISeloAvulsoFormData>(initialSeloAvulsoState);
    const [etapa, setEtapa] = useState<'DADOS' | 'PAGAMENTO' | 'CONCLUIDO'>('DADOS');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (protocolo) {
            const seloExistente = mockSelosAvulsos.find(s => s.protocolo === protocolo);
            if (seloExistente) {
                setPedido(seloExistente);
                setIsEditing(true);
            } else {
                toast.error("Pedido de selo avulso não encontrado.");
                navigate('/selos/avulso');
            }
        }
    }, [protocolo, navigate]);

    useEffect(() => {
        const total = pedido.selosSolicitados.reduce((acc, item) => acc + item.valorTotal, 0);
        const emolumentos = pedido.selosSolicitados.reduce((acc, item) => {
            const seloInfo = TabelaEmolumentos.find(s => s.id_selo === item.id_selo);
            return acc + (seloInfo ? seloInfo.valor_emolumento * item.quantidade : 0);
        }, 0);
        const taxas = pedido.selosSolicitados.reduce((acc, item) => {
            const seloInfo = TabelaEmolumentos.find(s => s.id_selo === item.id_selo);
            return acc + (seloInfo ? seloInfo.valor_taxa_judiciaria * item.quantidade : 0);
        }, 0);
        setPedido(prev => ({ ...prev, valores: { emolumentos, taxas, fundos: 0, total } }));
    }, [pedido.selosSolicitados]);

    const handleRequerenteChange = (field: string, value: any) => {
        setPedido(prev => ({ ...prev, requerente: { ...prev.requerente, [field]: value } }));
    };

    const handleReferenciaAtoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPedido(prev => ({ ...prev, referenciaAto: { ...prev.referenciaAto, [name]: value } }));
    };

    const handleAddSelo = () => {
        const novoItem: ISeloAvulsoItem = { id: Date.now(), id_selo: 0, descricao: '', quantidade: 1, valorUnitario: 0, valorTotal: 0 };
        setPedido(prev => ({ ...prev, selosSolicitados: [...prev.selosSolicitados, novoItem] }));
    };

    const handleRemoveSelo = (id: number) => {
        setPedido(prev => ({ ...prev, selosSolicitados: prev.selosSolicitados.filter(item => item.id !== id) }));
    };

    const handleSeloItemUpdate = (id: number, seloInfo: typeof TabelaEmolumentos[0] | null) => {
        const novosItens = pedido.selosSolicitados.map(item => {
            if (item.id === id) {
                if (seloInfo) {
                    const valorUnitario = seloInfo.valor_emolumento + seloInfo.valor_taxa_judiciaria;
                    return { ...item, id_selo: seloInfo.id_selo, descricao: seloInfo.descricao_selo, valorUnitario, valorTotal: item.quantidade * valorUnitario };
                } else {
                    return { ...item, id_selo: 0, descricao: '', valorUnitario: 0, valorTotal: 0 };
                }
            }
            return item;
        });
        setPedido(prev => ({ ...prev, selosSolicitados: novosItens }));
    };

    const handleQuantidadeChange = (id: number, quantidade: number) => {
        const novosItens = pedido.selosSolicitados.map(item => {
            if (item.id === id) {
                const qtd = Math.max(1, quantidade);
                return { ...item, quantidade: qtd, valorTotal: qtd * item.valorUnitario };
            }
            return item;
        });
        setPedido(prev => ({ ...prev, selosSolicitados: novosItens }));
    };

    const handleAvancar = () => {
        if (!pedido.requerente.nome && !pedido.requerente.razaoSocial) { return toast.warn("Preencha os dados do requerente."); }
        if (!pedido.referenciaAto.nomePartePrincipal || !pedido.referenciaAto.tipoAto) { return toast.warn("Preencha os dados do ato de referência."); }
        if (pedido.selosSolicitados.length === 0 || pedido.selosSolicitados.some(s => !s.id_selo)) { return toast.warn("Adicione e selecione pelo menos um tipo de selo."); }
        setEtapa('PAGAMENTO');
    };

    const pageTitle = isEditing ? "Editar Emissão de Selo Avulso" : "Emissão de Selo Avulso";
    const commonInputClass = "mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]";

    if (etapa === 'CONCLUIDO') { /* ... (código inalterado) ... */ }
    if (etapa === 'PAGAMENTO') { /* ... (código inalterado) ... */ }

    return (
        <div className="mx-auto space-y-6 pb-24">
            <header className="mb-6">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-4">
                    <ArrowLeft size={16} /> Voltar
                </button>
                {/* ALTERADO: Cor do título principal */}
                <h1 className="text-3xl font-bold text-[#4a4e51]">{pageTitle}</h1>
                <p className="text-md text-gray-500 mt-1">{isEditing ? `Editando o protocolo: ${pedido.protocolo}` : "Preencha os dados abaixo para solicitar a emissão de selos."}</p>
            </header>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-8">
                <SeletorRequerente requerente={pedido.requerente as any} onRequerenteChange={handleRequerenteChange} />
                <div className="p-4 rounded-lg border border-gray-300">
                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2"><FileText size={18}/> 2. Dados do Ato de Referência</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Nome da Parte Principal</label>
                            {/* ALTERADO: Adicionado estilo de foco */}
                            <input type="text" name="nomePartePrincipal" value={pedido.referenciaAto.nomePartePrincipal} onChange={handleReferenciaAtoChange} className={commonInputClass} />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-gray-700">Data do Registro</label>
                             <input type="date" name="dataRegistro" value={pedido.referenciaAto.dataRegistro} onChange={handleReferenciaAtoChange} className={commonInputClass} />
                        </div>
                        <div className='md:col-span-1'>
                             <label className="block text-sm font-medium text-gray-700">Tipo de Ato</label>
                             <select name="tipoAto" value={pedido.referenciaAto.tipoAto} onChange={handleReferenciaAtoChange} className={commonInputClass}>
                                <option value="">Selecione...</option>
                                {atoOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                             </select>
                        </div>
                    </div>
                </div>

                <div className="p-4 rounded-lg border border-gray-300">
                     <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2"><PlusCircle size={18}/> 3. Selos Solicitados</h4>
                     <div className="space-y-4">
                        {pedido.selosSolicitados.map((item) => (
                            <div key={item.id} className="grid grid-cols-12 gap-4 items-start p-3 bg-white border border-gray-300 rounded-md">
                                <div className="col-span-12 md:col-span-6"><label className="text-xs font-medium text-gray-500">Tipo de Selo/Ato</label><SeloSearchInput selectedSeloId={item.id_selo} onSeloSelect={(selo) => handleSeloItemUpdate(item.id, selo)} onClear={() => handleSeloItemUpdate(item.id, null)} /></div>
                                <div className="col-span-4 md:col-span-1"><label className="text-xs font-medium text-gray-500">Qtd.</label><input type="number" min="1" value={item.quantidade} onChange={(e) => handleQuantidadeChange(item.id, parseInt(e.target.value))} className={commonInputClass} /></div>
                                <div className="col-span-4 md:col-span-2 text-center pt-1"><p className="text-xs font-medium text-gray-500">Valor Unit.</p><p className="font-semibold mt-2">{formatCurrency(item.valorUnitario)}</p></div>
                                <div className="col-span-4 md:col-span-2 text-center pt-1">
                                    <p className="text-xs font-medium text-gray-500">Subtotal</p>
                                    {/* ALTERADO: Cor do subtotal */}
                                    <p className="font-bold text-[#dd6825] mt-2">{formatCurrency(item.valorTotal)}</p>
                                </div>
                                <div className="col-span-12 md:col-span-1 flex justify-end items-start pt-4"><button onClick={() => handleRemoveSelo(item.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-full"><Trash2 size={18}/></button></div>
                            </div>
                        ))}
                        {/* ALTERADO: Cor do botão "Adicionar Selo" */}
                        <button onClick={handleAddSelo} className="flex items-center gap-2 text-sm bg-[#dd6825]/10 text-[#c25a1f] font-semibold px-4 py-2 rounded-lg hover:bg-[#dd6825]/20 transition-colors">
                           <PlusCircle size={16}/> Adicionar Selo
                        </button>
                     </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-300">
                    <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-gray-700">Valor Total do Pedido:</h4>
                        <p className="text-2xl font-bold text-green-700">{formatCurrency(pedido.valores.total)}</p>
                    </div>
                </div>

                <div className="text-right pt-6 flex items-center justify-end gap-4">
                    <button type="button" onClick={() => navigate('/selos/avulso')} className="bg-gray-200 text-gray-800 font-semibold px-6 py-3 rounded-lg hover:bg-gray-300">Cancelar</button>
                    {/* ALTERADO: Cor do botão de ação principal */}
                    <button onClick={handleAvancar} className="bg-[#dd6825] text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-[#c25a1f] flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dd6825]">
                        Avançar para Pagamento <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}