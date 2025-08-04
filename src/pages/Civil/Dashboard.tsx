import { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Timer, PenSquare, DollarSign, Search, Loader2, ListChecks, Target, Check, History, Inbox } from 'lucide-react';


const getOficialStats = () => [
  { title: "Pendências Críticas", value: "2", icon: Timer, isCritical: true },
  { title: "Carga de Trabalho Total", value: "14", icon: ListChecks },
  { title: "Aguardando Decisão Superior", value: "4", icon: PenSquare },
  { title: "Faturamento do Dia", value: "R$ 4.350,00", icon: DollarSign },
];

const getEscreventeStats = () => [
  { title: "Minhas Tarefas do Dia", value: "5", icon: Target, isCritical: true },
  { title: "Atos Concluídos por Mim (Hoje)", value: "8", icon: Check },
  { title: "Aguardando Revisão", value: "3", icon: History },
  { title: "Novas Solicitações na Fila", value: "7", icon: Inbox },
];

const serviceTypes = ['Nascimento', 'Casamento', 'Óbito', 'Averbação', 'Natimorto', 'Livro E'];

const recentActivity = [
  { id: 'RC-12345', name: 'João da Silva', type: 'Nascimento', date: '30/06/2025', user: 'joao.civil' },
  { id: 'AVB-001', name: 'Maria Oliveira e Pedro Costa', type: 'Averbação de Divórcio', date: '30/06/2025', user: 'admin' },
];


export default function CivilRegistryDashboard() {
  const { user } = useAuth();

  const [selectedService, setSelectedService] = useState('');
  const [protocolNumber, setProtocolNumber] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const stats = useMemo(() => {
    if (user?.role === 'Administrador' || user?.role === 'Tabeliã') {
      return getOficialStats();
    }
    if (user?.role === 'Escrevente de Registro Civil') { 
      return getEscreventeStats();
    }
    return [];
  }, [user]);

  const handleSearch = (e: React.FormEvent) => {
    // ... (lógica da busca permanece a mesma) ...
  };

  return (
    <>
      <title>Dashboard | Registro Civil</title>
      {/* Layout principal */}

      <div className="flex bg-gray-50 font-sans">
        <main className="flex-1">
          <div className="mx-auto space-y-8">
            <header>
              <h1 className="text-4xl font-bold text-gray-900">Dashboard | Registro Civil</h1>
              {/* Mensagem de boas-vindas genérica e útil */}
              <p className="text-lg text-gray-600 mt-1">Bem-vindo(a), {user?.name}. Veja suas métricas e tarefas.</p>
            </header>

            {/* ===== CARDS DE INDICADORES ADAPTATIVOS ===== */}
            <section>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map(stat => (
                  <div key={stat.title} className="bg-white p-6 rounded-xl shadow-sm flex items-center gap-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <div className={`p-4 rounded-full ${stat.isCritical ? 'bg-red-100' : 'bg-blue-100'}`}>
                      <stat.icon className={`h-8 w-8 ${stat.isCritical ? 'text-red-600' : 'text-blue-600'}`} />
                    </div>
                    <div>
                      <p className="text-1xl font-bold text-gray-800">{stat.value}</p>
                      <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ===== 3. BUSCA RÁPIDA DE ATOS ===== */}
            <section className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
                <Search className="text-blue-600" /> Busca Rápida de Atos
              </h2>
              <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label htmlFor="service-type" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Serviço</label>
                  <select id="service-type" value={selectedService} onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition">
                    <option value="" disabled>Selecione...</option>
                    {serviceTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="protocol-number" className="block text-sm font-medium text-gray-700 mb-1">Protocolo</label>
                  <input type="text" id="protocol-number" placeholder="Digite o protocolo..." value={protocolNumber} onChange={(e) => setProtocolNumber(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition" />
                </div>
                <button type="submit" disabled={isSearching}
                  className="bg-gray-800 text-white font-semibold px-5 py-2 rounded-lg shadow-sm hover:bg-black transition-colors disabled:bg-gray-400 flex items-center justify-center h-11">
                  {isSearching ? <Loader2 className="animate-spin" /> : 'Buscar Ato'}
                </button>
              </form>
            </section>

            <section className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
                <ListChecks className="text-blue-600" /> Atividades Recentes
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className='bg-gray-50 text-sm text-gray-600 uppercase'>
                    <tr>
                      <th className="p-4 font-semibold">Matrícula/ID</th>
                      <th className="p-4 font-semibold">Nome(s)</th>
                      <th className="p-4 font-semibold">Tipo de Ato</th>
                      <th className="p-4 font-semibold">Data</th>
                      <th className="p-4 font-semibold">Usuário Responsável</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivity.map(activity => (
                      <tr key={activity.id} className="border-b hover:bg-gray-50">
                        <td className="p-4 text-sm text-gray-800 font-mono">{activity.id}</td>
                        <td className="p-4 text-sm text-gray-900 font-semibold">{activity.name}</td>
                        <td className="p-4 text-sm text-gray-600">{activity.type}</td>
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
    </>
  );
}