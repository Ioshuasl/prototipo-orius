import { useState } from 'react';
import { Save, KeyRound, Clock, Power } from 'lucide-react';
import { toast } from 'react-toastify';

// Componente de Card para agrupar as configurações
const SettingsCard = ({ title, icon: Icon, children }: { title: string, icon: React.ElementType, children: React.ReactNode }) => (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm mt-6">
        <header className="p-4 border-b border-gray-200 flex items-center gap-3">
            <Icon className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        </header>
        <div className="p-6 space-y-6">
            {children}
        </div>
    </div>
);

// Componente para um campo de formulário
const FormField = ({ label, description, children }: { label: string, description?: string, children: React.ReactNode }) => (
    <div>
        <label className="block text-sm font-semibold text-gray-700">{label}</label>
        {children}
        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
    </div>
);

// --- COMPONENTE PRINCIPAL DA PÁGINA ---
export default function ConfiguracaoIntegracoes() {
    const [activeTab, setActiveTab] = useState<'crc' | 'sirc'>('crc');

    // Estados para os formulários (em um cenário real, viriam de uma API)
    const [crcConfig, setCrcConfig] = useState({
        habilitado: true,
        modo: 'automatico',
        horario: '22:00',
        usuario: 'cartorio_cidade_go',
        senha: '••••••••••'
    });

    const [sircConfig, setSircConfig] = useState({
        habilitado: true,
        modo: 'manual',
        horario: '23:00',
        codigoServentia: 'SIRC12345',
        senha: '••••••••••'
    });

    const handleSave = () => {
        // Lógica para salvar os dados da aba ativa
        console.log(`Salvando configurações para: ${activeTab.toUpperCase()}`);
        console.log(activeTab === 'crc' ? crcConfig : sircConfig);
        toast.success(`Configurações da ${activeTab.toUpperCase()} salvas com sucesso!`);
    };

    const tabStyle = "px-4 py-3 font-semibold text-center border-b-2 cursor-pointer transition-colors duration-200 w-full md:w-auto";
    const activeTabStyle = "border-blue-600 text-blue-600";
    const inactiveTabStyle = "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300";

    return (
        <div className="mx-auto">
            <header className="flex items-center justify-between mb-6 pb-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Configuração de Integrações</h1>
                    <p className="text-md text-gray-500 mt-1">Ajuste os parâmetros de comunicação com os serviços externos.</p>
                </div>
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700"
                >
                    <Save className="h-5 w-5" />
                    Salvar Alterações
                </button>
            </header>

            {/* Abas para alternar entre CRC e SIRC */}
            <nav className="flex mb-6 border-b border-gray-200">
                <button onClick={() => setActiveTab('crc')} className={`${tabStyle} ${activeTab === 'crc' ? activeTabStyle : inactiveTabStyle}`}>
                    CRC Nacional
                </button>
                <button onClick={() => setActiveTab('sirc')} className={`${tabStyle} ${activeTab === 'sirc' ? activeTabStyle : inactiveTabStyle}`}>
                    SIRC / INSS
                </button>
            </nav>

            {/* Conteúdo da Aba Ativa */}
            <div>
                {activeTab === 'crc' && (
                    <div className="animate-fade-in">
                        <SettingsCard title="Modo de Operação" icon={Power}>
                            <FormField label="Habilitar Integração com a CRC">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={crcConfig.habilitado} onChange={e => setCrcConfig({ ...crcConfig, habilitado: e.target.checked })} className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </FormField>
                            <FormField label="Modo de Envio Padrão">
                                <div className="flex gap-4 mt-2">
                                    <label><input type="radio" name="crc_modo" value="automatico" checked={crcConfig.modo === 'automatico'} onChange={e => setCrcConfig({ ...crcConfig, modo: e.target.value })} className="mr-2 text-blue-600 focus:ring-blue-500" /> Automático</label>
                                    <label><input type="radio" name="crc_modo" value="manual" checked={crcConfig.modo === 'manual'} onChange={e => setCrcConfig({ ...crcConfig, modo: e.target.value })} className="mr-2 text-blue-600 focus:ring-blue-500" /> Manual</label>
                                </div>
                            </FormField>
                        </SettingsCard>

                        <SettingsCard title="Parâmetros de Envio Automático" icon={Clock}>
                            <FormField label="Horário para Envio Diário" description="O sistema tentará enviar os atos pendentes neste horário.">
                                <input type="time" value={crcConfig.horario} onChange={e => setCrcConfig({ ...crcConfig, horario: e.target.value })} className="mt-1 block w-full md:w-1/3 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                            </FormField>
                        </SettingsCard>

                        <SettingsCard title="Credenciais de Acesso (Web Service)" icon={KeyRound}>
                            <FormField label="Usuário" description="Login fornecido pela CRC Nacional.">
                                <input type="text" value={crcConfig.usuario} onChange={e => setCrcConfig({ ...crcConfig, usuario: e.target.value })} className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                            </FormField>
                            <FormField label="Senha" description="Senha de acesso ao web service.">
                                <input type="password" value={crcConfig.senha} onChange={e => setCrcConfig({ ...crcConfig, senha: e.target.value })} className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                            </FormField>
                        </SettingsCard>
                    </div>
                )}

                {activeTab === 'sirc' && (
                    <div className="animate-fade-in">
                        {/* A estrutura para o SIRC é idêntica, apenas os campos mudam */}
                        <SettingsCard title="Modo de Operação" icon={Power}>
                            <FormField label="Habilitar Integração com a CRC">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={crcConfig.habilitado} onChange={e => setCrcConfig({ ...crcConfig, habilitado: e.target.checked })} className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </FormField>
                            <FormField label="Modo de Envio Padrão">
                                <div className="flex gap-4 mt-2">
                                    <label><input type="radio" name="crc_modo" value="automatico" checked={crcConfig.modo === 'automatico'} onChange={e => setCrcConfig({ ...crcConfig, modo: e.target.value })} className="mr-2 text-blue-600 focus:ring-blue-500" /> Automático</label>
                                    <label><input type="radio" name="crc_modo" value="manual" checked={crcConfig.modo === 'manual'} onChange={e => setCrcConfig({ ...crcConfig, modo: e.target.value })} className="mr-2 text-blue-600 focus:ring-blue-500" /> Manual</label>
                                </div>
                            </FormField>
                        </SettingsCard>
                        <SettingsCard title="Credenciais de Acesso (SIRC)" icon={KeyRound}>
                            <FormField label="Código da Serventia no SIRC" description="Código único fornecido pelo INSS/SIRC.">
                                <input type="text" value={sircConfig.codigoServentia} onChange={e => setSircConfig({ ...sircConfig, codigoServentia: e.target.value })} className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                            </FormField>
                            <FormField label="Senha" description="Senha de acesso para o envio de arquivos.">
                                <input type="password" value={sircConfig.senha} onChange={e => setSircConfig({ ...sircConfig, senha: e.target.value })} className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                            </FormField>
                        </SettingsCard>
                    </div>
                )}
            </div>
        </div>
    );
}