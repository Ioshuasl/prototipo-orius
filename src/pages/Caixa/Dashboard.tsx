import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { DollarSign, Search, Landmark, BookMarked, UploadIcon, BarChart2, CalendarClock } from 'lucide-react';
import { toast } from 'react-toastify';
// --- Funções e dados simulados (adaptados para o Caixa) ---

// Função para calcular os dias restantes para o fechamento do decêndio
const getDiasRestantesDecendio = (): { title: string, value: string, icon: any, isCritical: boolean } => {
    const today = new Date();
    const day = today.getDate();
    const year = today.getFullYear();
    const month = today.getMonth();

    let endOfDecendio: Date;

    if (day <= 10) {
        endOfDecendio = new Date(year, month, 10);
    } else if (day <= 20) {
        endOfDecendio = new Date(year, month, 20);
    } else {
        // Ultimo dia do mês
        endOfDecendio = new Date(year, month + 1, 0);
    }

    const diffInTime = endOfDecendio.getTime() - today.getTime();
    // Arredonda para cima para garantir que o dia atual seja contado como parte do período
    const diffInDays = Math.ceil(diffInTime / (1000 * 60 * 60 * 24));

    const isCritical = diffInDays <= 3;
    const value = `${diffInDays} dia${diffInDays !== 1 ? 's' : ''}`;

    return {
        title: "Dias para Fechar Decênio",
        value: value,
        icon: CalendarClock,
        isCritical: isCritical
    };
};

// Métricas para o perfil de Tabelião/Administrador
const getOficialStats = () => [
    { title: "Faturamento do Dia", value: "R$ 15.650,00", icon: DollarSign, isCritical: false },
    { title: "Selos Utilizados (Hoje)", value: "123", icon: UploadIcon, isCritical: false },
    getDiasRestantesDecendio(), // Nova métrica dinâmica
    { title: "Saldo da Conta do Cartório (EXEMPLO)", value: "R$ 250.300,00", icon: Landmark, isCritical: false },
];

// Métricas para o perfil de Escrevente/Caixa
const getCaixaStats = () => [
    { title: "Lançamentos do Dia", value: "32", icon: BookMarked, isCritical: false },
    { title: "Valor em Caixa", value: "R$ 1.250,00", icon: DollarSign, isCritical: false },
    { title: "Selos em Estoque", value: "850", icon: UploadIcon, isCritical: false },
    getDiasRestantesDecendio(), // Nova métrica dinâmica
];

// Dados simulados para a tabela de atividades recentes
const recentFinancialActivity = [
    { id: 23, type: 'Receita', value: 350.00, description: 'Protocolo RC-54321 - Certidão de Nascimento', date: '30/06/2025', user: 'ana.caixa' },
    { id: 24, type: 'Despesa', value: 1200.00, description: 'Compra de suprimentos de escritório', date: '30/06/2025', user: 'caixa.central' },
    { id: 25, type: 'Receita', value: 89.50, description: 'Protocolo AVB-002 - Averbação de Divórcio', date: '29/06/2025', user: 'ana.caixa' },
    { id: 26, type: 'Receita', value: 25.00, description: 'Lançamento avulso - taxa de reconhecimento de firma', date: '29/06/2025', user: 'caixa.central' },
];

interface DecenioModalProps {
    isOpen: boolean;
    onClose: () => void;
    onManualClose: () => void;
}

const DecenioModal = ({ isOpen, onClose, onManualClose }: DecenioModalProps) => {
    const [hasAgreed, setHasAgreed] = useState(false); // Novo estado para o checkbox

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center p-4 animate-fade-in-fast bg-gray-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full relative">
                <div className="text-center">
                    <CalendarClock className="mx-auto h-12 w-12 text-[#dd6825]" />
                    <h3 className="mt-4 text-xl font-semibold text-gray-900">Fechamento de Decênio</h3>
                    <p className="mt-2 text-sm text-gray-500">
                        O dia do fechamento do decênio é hoje! Por favor, feche todos os lotes e guias para o fechamento. Você pode fazer isso manualmente agora ou <strong>o sistema irá fechar automaticamente às 18:00</strong>.
                    </p>
                </div>
                
                {/* Checkbox de aceitação */}
                <div className="mt-4 flex items-center justify-center">
                    <input 
                        id="agree-checkbox" 
                        type="checkbox" 
                        checked={hasAgreed} 
                        onChange={(e) => setHasAgreed(e.target.checked)} 
                        className="h-4 w-4 text-[#dd6825] border-gray-300 rounded focus:ring-[#dd6825]"
                    />
                    <label htmlFor="agree-checkbox" className="ml-2 block text-sm text-gray-900">
                        Li e aceito os termos.
                    </label>
                </div>

                <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row-reverse gap-3">
                    <button
                        type="button"
                        disabled={!hasAgreed}
                        className={`mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:text-[#dd6825] hover:border-[#dd6825] focus:outline-none focus:ring-2 sm:mt-0 sm:w-auto sm:text-sm ${!hasAgreed && 'cursor-not-allowed opacity-50'} ${hasAgreed && 'hover:cursor-pointer'}`}
                        onClick={onManualClose}
                    >
                        Fechar Decênio Manualmente
                    </button>
                    <button
                        type="button"
                        disabled={!hasAgreed}
                        className={`mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:text-[#dd6825] hover:border-[#dd6825] focus:outline-none focus:ring-2 sm:mt-0 sm:w-auto sm:text-sm ${!hasAgreed && 'cursor-not-allowed opacity-50'} ${hasAgreed && 'hover:cursor-pointer'}`}
                        onClick={onClose}
                    >
                        Fechar Decêndio Automático (18:00)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function CaixaDashboard() {
    const { user } = useAuth();
    const [sealNumber, setSealNumber] = useState('')
    const [isDecenioModalOpen, setIsDecenioModalOpen] = useState(false); // Novo estado para o modal


    const stats = useMemo(() => {
        if (user?.role === 'Administrador' || user?.role === 'Tabeliã') {
            return getOficialStats();
        }
        if (user?.role === 'Escrevente de Registro Civil') {
            return getCaixaStats();
        }
        return [];
    }, [user]);

    useEffect(() => {
        const decenioStats = getDiasRestantesDecendio();
        // Simula a lógica de fechamento: dias restantes === 0
        if (decenioStats.value === '0 dias') {
            setIsDecenioModalOpen(true);
        }

        // Lógica de agendamento automático às 18:00 seria implementada no backend
        // Exemplo: um cron job no servidor que aciona uma API para fechar o decênio
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (sealNumber) {
            const url = `https://see.tjgo.jus.br/buscas?codigo_selo=${sealNumber}`;
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    const handleAutomaticRedimensionamento = () => {
        toast.success(`Configurando o redirecionamento automático as 18:00`);
        setIsDecenioModalOpen(false);
    };

    const handleManualRedimensionamento = () => {
        toast.success(`Redimensionamento deve ser feito manualmente`);
        setIsDecenioModalOpen(false);
    };

    return (
        <>
            <title>Dashboard do Caixa | Cartório</title>
            <div className="flex bg-gray-50 font-sans">
                <main className="flex-1">
                    <div className="mx-auto space-y-8">
                        <header>
                            <h1 className="text-4xl font-bold text-[#4a4e51]">Dashboard do Caixa</h1>
                            <p className="text-lg text-gray-600 mt-1">Bem-vindo(a), {user?.name}. Visualize o resumo financeiro.</p>
                        </header>

                        <section>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {stats.map(stat => (
                                    <div key={stat.title} className="bg-white p-6 rounded-xl shadow-sm flex items-center gap-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-300">
                                        <div className={`p-4 rounded-full ${stat.isCritical ? 'bg-red-100' : 'bg-[#dd6825]/10'}`}>
                                            <stat.icon className={`h-8 w-8 ${stat.isCritical ? 'text-red-600' : 'text-[#dd6825]'}`} />
                                        </div>
                                        <div>
                                            <p className="text-1xl font-bold text-gray-800">{stat.value}</p>
                                            <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-300">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
                                <Search className="text-[#dd6825]" /> Busca Rápida de Selo
                            </h2>
                            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                                <div>
                                    <label htmlFor="seal-number" className="block text-sm font-medium text-gray-700 mb-1">Número do Selo</label>
                                    <input
                                        type="text"
                                        id="seal-number"
                                        placeholder="Digite o número do selo..."
                                        value={sealNumber}
                                        onChange={(e) => setSealNumber(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#dd6825] transition"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={!sealNumber}
                                    className= {`bg-[#4a4e51] text-white font-semibold px-5 py-2 rounded-lg shadow-sm hover:bg-[#3b3e40] transition-colors disabled:bg-[#4a4e51]/50 flex items-center justify-center h-11 ${sealNumber && 'hover:cursor-pointer'}`}
                                >
                                    Consultar
                                </button>
                            </form>
                        </section>

                        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-300">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
                                <BarChart2 className="text-[#dd6825]" /> Atividade Financeira do Dia
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className='bg-gray-50 text-sm text-gray-600 uppercase'>
                                        <tr>
                                            <th className="p-4 font-semibold">Tipo</th>
                                            <th className="p-4 font-semibold">Valor</th>
                                            <th className="p-4 font-semibold">Descrição</th>
                                            <th className="p-4 font-semibold">Data</th>
                                            <th className="p-4 font-semibold">Usuário Responsável</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentFinancialActivity.map(activity => (
                                            <tr key={activity.id} className="border-b border-gray-300 hover:bg-gray-50">
                                                <td className={`p-4 text-sm font-semibold ${activity.type === 'Receita' ? 'text-green-600' : 'text-red-600'}`}>{activity.type}</td>
                                                <td className="p-4 text-sm font-semibold">{`R$ ${activity.value.toFixed(2)}`}</td>
                                                <td className="p-4 text-sm text-gray-600">{activity.description}</td>
                                                <td className="p-4 text-sm text-gray-600">{activity.date}</td>
                                                <td className="p-4 text-sm text-gray-600">{activity.user}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>
                </main>
            </div>

            {/* Modal de aviso de fechamento do decênio */}
            <DecenioModal
                isOpen={isDecenioModalOpen}
                onClose={handleAutomaticRedimensionamento}
                onManualClose={handleManualRedimensionamento}
            />
        </>
    );
}