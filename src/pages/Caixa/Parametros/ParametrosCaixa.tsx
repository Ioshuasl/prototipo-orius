import React, { useState } from 'react';
import { Server, Landmark, FileText, Check, Cloud, HardDrive, CalendarClock } from 'lucide-react';

// --- Interfaces de Tipagem para o Estado ---
interface ServerConfig {
    type: 'local' | 'cloud';
    path: string;
    apiUrl: string;
}

interface RatesConfig {
    funcomp: number | null;
    funemp: number | null;
    fundesp: number | null;
}

interface CorregedoriaConfig {
    login: string;
    password: '';
    autoRedimensionamento: boolean;
    redimensionamentoTime: string;
    autoSealSend: boolean;
    sealFrequency: '2h' | '8h' | '24h' | '3d' | '5d';
}

interface SystemConfig {
    server: ServerConfig;
    rates: RatesConfig;
    corregedoria: CorregedoriaConfig;
}

// Valores iniciais para os parâmetros
const initialConfig: SystemConfig = {
    server: {
        type: 'local',
        path: '',
        apiUrl: '',
    },
    rates: {
        funcomp: null,
        funemp: null,
        fundesp: null,
    },
    corregedoria: {
        login: '',
        password: '',
        autoRedimensionamento: false,
        redimensionamentoTime: '18:00',
        autoSealSend: false,
        sealFrequency: '24h',
    },
};

export default function ParametrosCaixa() {
    const [activeTab, setActiveTab] = useState<'server' | 'rates' | 'corregedoria'>('server');
    const [config, setConfig] = useState<SystemConfig>(initialConfig);

    const handleServerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setConfig(prev => ({
            ...prev,
            server: {
                ...prev.server,
                [name]: value,
            },
        }));
    };

    const handleRatesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setConfig(prev => ({
            ...prev,
            rates: {
                ...prev.rates,
                [name]: value ? parseFloat(value) : null,
            },
        }));
    };

    const handleCorregedoriaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setConfig(prev => ({
            ...prev,
            corregedoria: {
                ...prev.corregedoria,
                [name]: type === 'checkbox' ? checked : value,
            },
        }));
    };

    const handleSave = () => {
        // Lógica para enviar as configurações para o backend
        console.log('Configurações a serem salvas:', config);
        alert('Configurações salvas com sucesso!');
    };

    return (
        <div className="flex bg-gray-50 font-sans min-h-screen">
            <main className="flex-1">
                <div className="mx-auto space-y-4">
                    <header>
                        <h1 className="text-4xl font-bold text-[#4a4e51]">Parâmetros do Sistema</h1>
                        <p className="text-lg text-gray-600 mt-1">Defina as configurações gerais do sistema.</p>
                    </header>

                    {/* Navegação por abas */}
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            <button
                                onClick={() => setActiveTab('server')}
                                className={`${activeTab === 'server' ? 'border-[#dd6825] text-[#dd6825]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2`}
                            >
                                <Server size={18} /> Servidor
                            </button>
                            <button
                                onClick={() => setActiveTab('rates')}
                                className={`${activeTab === 'rates' ? 'border-[#dd6825] text-[#dd6825]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2`}
                            >
                                <FileText size={18} /> Taxas
                            </button>
                            <button
                                onClick={() => setActiveTab('corregedoria')}
                                className={`${activeTab === 'corregedoria' ? 'border-[#dd6825] text-[#dd6825]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2`}
                            >
                                <Landmark size={18} /> Corregedoria/SEE
                            </button>
                        </nav>
                    </div>

                    {/* Conteúdo das abas */}
                    <div className="mt-6">
                        {activeTab === 'server' && (
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-300">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Configurações do Servidor</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Servidor</label>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center">
                                                <input
                                                    id="local-server"
                                                    name="type"
                                                    type="radio"
                                                    value="local"
                                                    checked={config.server.type === 'local'}
                                                    onChange={handleServerChange}
                                                    className="h-4 w-4 text-[#dd6825] border-gray-300 focus:ring-[#dd6825]"
                                                />
                                                <label htmlFor="local-server" className="ml-2 block text-sm text-gray-900 flex items-center gap-1">
                                                    <HardDrive size={16} /> Local
                                                </label>
                                            </div>
                                            <div className="flex items-center">
                                                <input
                                                    id="cloud-server"
                                                    name="type"
                                                    type="radio"
                                                    value="cloud"
                                                    checked={config.server.type === 'cloud'}
                                                    onChange={handleServerChange}
                                                    className="h-4 w-4 text-[#dd6825] border-gray-300 focus:ring-[#dd6825]"
                                                />
                                                <label htmlFor="cloud-server" className="ml-2 block text-sm text-gray-900 flex items-center gap-1">
                                                    <Cloud size={16} /> Nuvem
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {config.server.type === 'local' ? (
                                        <div>
                                            <label htmlFor="server-path" className="block text-sm font-medium text-gray-700 mb-1">Caminho do Servidor</label>
                                            <input
                                                type="text"
                                                id="server-path"
                                                name="path"
                                                value={config.server.path}
                                                onChange={handleServerChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#dd6825] transition"
                                                placeholder="Ex: C:/servidor/app/data"
                                            />
                                        </div>
                                    ) : (
                                        <div>
                                            <label htmlFor="api-url" className="block text-sm font-medium text-gray-700 mb-1">Link da API</label>
                                            <input
                                                type="url"
                                                id="api-url"
                                                name="apiUrl"
                                                value={config.server.apiUrl}
                                                onChange={handleServerChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#dd6825] transition"
                                                placeholder="Ex: https://api.cartorio-nuvem.com"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'rates' && (
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-300">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Configurações de Taxas</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="funcomp" className="block text-sm font-medium text-gray-700 mb-1">Taxa FUNCOMP (%)</label>
                                        <input
                                            type="number"
                                            id="funcomp"
                                            name="funcomp"
                                            value={config.rates.funcomp ?? ''}
                                            onChange={handleRatesChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#dd6825] transition"
                                            placeholder="Ex: 2.5"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="funemp" className="block text-sm font-medium text-gray-700 mb-1">Taxa FUNEMP (%)</label>
                                        <input
                                            type="number"
                                            id="funemp"
                                            name="funemp"
                                            value={config.rates.funemp ?? ''}
                                            onChange={handleRatesChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#dd6825] transition"
                                            placeholder="Ex: 1.5"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="fundesp" className="block text-sm font-medium text-gray-700 mb-1">Taxa FUNDESP (%)</label>
                                        <input
                                            type="number"
                                            id="fundesp"
                                            name="fundesp"
                                            value={config.rates.fundesp ?? ''}
                                            onChange={handleRatesChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#dd6825] transition"
                                            placeholder="Ex: 3.0"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'corregedoria' && (
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-300">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Configurações Corregedoria/SEE</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="login" className="block text-sm font-medium text-gray-700 mb-1">Login da API</label>
                                        <input
                                            type="text"
                                            id="login"
                                            name="login"
                                            value={config.corregedoria.login}
                                            onChange={handleCorregedoriaChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#dd6825] transition"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Senha da API</label>
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            value={config.corregedoria.password}
                                            onChange={handleCorregedoriaChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#dd6825] transition"
                                        />
                                    </div>

                                    {/* Redimensionamento automático */}
                                    <div className="flex items-center gap-2 pt-2">
                                        <input
                                            id="auto-redimensionamento"
                                            name="autoRedimensionamento"
                                            type="checkbox"
                                            checked={config.corregedoria.autoRedimensionamento}
                                            onChange={handleCorregedoriaChange}
                                            className="h-4 w-4 text-[#dd6825] border-gray-300 rounded focus:ring-[#dd6825]"
                                        />
                                        <label htmlFor="auto-redimensionamento" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                            <CalendarClock size={16} /> Redimensionamento Automático no último dia do decênio
                                        </label>
                                    </div>
                                    {config.corregedoria.autoRedimensionamento && (
                                        <div className="pl-6">
                                            <label htmlFor="redimensionamento-time" className="block text-sm font-medium text-gray-700 mb-1">Horário do Redimensionamento</label>
                                            <input
                                                type="time"
                                                id="redimensionamento-time"
                                                name="redimensionamentoTime"
                                                value={config.corregedoria.redimensionamentoTime}
                                                onChange={handleCorregedoriaChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#dd6825] transition"
                                            />
                                        </div>
                                    )}

                                    {/* Envio automático de selo */}
                                    <div className="flex items-center gap-2 pt-2">
                                        <input
                                            id="auto-seal-send"
                                            name="autoSealSend"
                                            type="checkbox"
                                            checked={config.corregedoria.autoSealSend}
                                            onChange={handleCorregedoriaChange}
                                            className="h-4 w-4 text-[#dd6825] border-gray-300 rounded focus:ring-[#dd6825]"
                                        />
                                        <label htmlFor="auto-seal-send" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                            <Check size={16} /> Envio Automático de Selo
                                        </label>
                                    </div>
                                    {config.corregedoria.autoSealSend && (
                                        <div className="pl-6">
                                            <label htmlFor="seal-frequency" className="block text-sm font-medium text-gray-700 mb-1">Frequência</label>
                                            <select
                                                id="seal-frequency"
                                                name="sealFrequency"
                                                value={config.corregedoria.sealFrequency}
                                                onChange={handleCorregedoriaChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#dd6825] transition"
                                            >
                                                <option value="2h">A cada 2 horas</option>
                                                <option value="8h">A cada 8 horas</option>
                                                <option value="24h">A cada 24 horas</option>
                                                <option value="3d">A cada 3 dias</option>
                                                <option value="5d">A cada 5 dias</option>
                                            </select>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button 
                            onClick={handleSave} 
                            className="px-6 py-2 text-base font-medium text-white bg-[#dd6825] rounded-md hover:bg-[#c25a1f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dd6825]"
                        >
                            Salvar Parâmetros
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}