import React, { useState } from 'react';
import AddressFields from '../Components/AddressFields';
import { type IConfiguracaoCartorio, type IEndereco } from '../types';
import { IMaskInput } from 'react-imask';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ConfiguracaoCartorio: React.FC = () => {
    const [configData, setConfigData] = useState<IConfiguracaoCartorio>({
        serventia: {
            nome: '',
            cns: '',
            cnpj: '',
            telefone: '',
            email: '',
            endereco: {
                cep: '',
                tipoLogradouro: '',
                logradouro: '',
                numero: '',
                bairro: '',
                complemento: '',
                cidade: '',
                uf: '',
            },
        },
        oficial: {
            nome: 'Maria da Silva',
            funcao: 'Tabeliã Titular',
            subOficialNome: 'João Souza',
            subOficialFuncao: 'Tabelião Substituto',
        },
    });

    const commonLabelClass = "block text-sm font-medium text-gray-700 mb-1";
    const commonInputClass = "w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors";
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const keys = name.split('.');
        const [section, field, subField] = keys;

        if (subField) {
             setConfigData(prev => ({
                ...prev,
                [section]: {
                    ...(prev[section as keyof IConfiguracaoCartorio] as any),
                    [field]: {
                       ...((prev[section as keyof IConfiguracaoCartorio] as any)[field]),
                       [subField]: value
                    }
                },
            }));
        } else {
            setConfigData(prev => ({
                ...prev,
                [section]: {
                    ...(prev[section as keyof IConfiguracaoCartorio] as any),
                    [field]: value,
                },
            }));
        }
    };
    
    const handleAddressUpdate = (address: Partial<IEndereco>) => {
        setConfigData(prev => ({
            ...prev,
            serventia: {
                ...prev.serventia,
                endereco: {
                    ...prev.serventia.endereco,
                    ...address,
                },
            },
        }));
    };
    
    // Função de envio do formulário
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Dados a serem salvos:", configData);
        // MUDANÇA 3: Substituir o alert() por uma notificação de sucesso
        toast.success("Dados salvos com sucesso!");
    };

    return (
        <div className="bg-gray-50 min-h-screen p-2">
            <ToastContainer 
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <div className="mx-auto">
                <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow-md space-y-8">
                    
                    {/* Seção Dados da Serventia */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Dados da Serventia</h2>
                        <p className="text-sm text-gray-500 mb-6">Informações públicas de identificação e contato do cartório.</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                            <div className="md:col-span-2">
                                <label htmlFor="serventia.nome" className={commonLabelClass}>Nome da Serventia</label>
                                <input type="text" id="serventia.nome" name="serventia.nome" value={configData.serventia.nome} onChange={handleInputChange} className={commonInputClass} />
                            </div>
                            <div>
                                <label htmlFor="serventia.cns" className={commonLabelClass}>CNS da Serventia</label>
                                <IMaskInput
                                    mask="000000-0"
                                    id="serventia.cns"
                                    name="serventia.cns"
                                    value={configData.serventia.cns}
                                    onAccept={(value) => handleInputChange({ target: { name: 'serventia.cns', value } } as any)}
                                    placeholder="000000-0"
                                    className={commonInputClass}
                                />
                            </div>
                            <div>
                                <label htmlFor="serventia.cnpj" className={commonLabelClass}>CNPJ</label>
                                <IMaskInput
                                    mask="00.000.000/0000-00"
                                    id="serventia.cnpj"
                                    name="serventia.cnpj"
                                    value={configData.serventia.cnpj}
                                    onAccept={(value) => handleInputChange({ target: { name: 'serventia.cnpj', value } } as any)}
                                    placeholder="00.000.000/0000-00"
                                    className={commonInputClass}
                                />
                            </div>
                            <div>
                                <label htmlFor="serventia.telefone" className={commonLabelClass}>Nº de Telefone</label>
                                <IMaskInput
                                    mask={[
                                        { mask: '(00) 0000-0000' },
                                        { mask: '(00) 00000-0000' }
                                    ]}
                                    id="serventia.telefone"
                                    name="serventia.telefone"
                                    value={configData.serventia.telefone}
                                    onAccept={(value) => handleInputChange({ target: { name: 'serventia.telefone', value } } as any)}
                                    placeholder="(00) 00000-0000"
                                    className={commonInputClass}
                                />
                            </div>
                            <div>
                                <label htmlFor="serventia.email" className={commonLabelClass}>Email</label>
                                <input type="email" id="serventia.email" name="serventia.email" value={configData.serventia.email} onChange={handleInputChange} className={commonInputClass} />
                            </div>
                        </div>
                        
                        <AddressFields
                            addressData={configData.serventia.endereco}
                            namePrefix="serventia.endereco"
                            handleInputChange={handleInputChange}
                            handleAddressUpdate={handleAddressUpdate}
                        />
                    </div>
                    
                    {/* Seção Dados do Oficial */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Dados do Oficial</h2>
                        <p className="text-sm text-gray-500 mb-6">Informações sobre o responsável legal e seu substituto.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                            <div>
                                <label htmlFor="oficial.nome" className={commonLabelClass}>Nome do Oficial</label>
                                <input type="text" id="oficial.nome" name="oficial.nome" value={configData.oficial.nome} onChange={handleInputChange} className={commonInputClass} />
                            </div>
                             <div>
                                <label htmlFor="oficial.funcao" className={commonLabelClass}>Função do Oficial</label>
                                <input type="text" id="oficial.funcao" name="oficial.funcao" value={configData.oficial.funcao} onChange={handleInputChange} className={commonInputClass} />
                            </div>
                             <div>
                                <label htmlFor="oficial.subOficialNome" className={commonLabelClass}>Nome do Sub Oficial <span className="text-xs text-gray-400">(opcional)</span></label>
                                <input type="text" id="oficial.subOficialNome" name="oficial.subOficialNome" value={configData.oficial.subOficialNome} onChange={handleInputChange} className={commonInputClass} />
                            </div>
                             <div>
                                <label htmlFor="oficial.subOficialFuncao" className={commonLabelClass}>Função do Sub Oficial <span className="text-xs text-gray-400">(opcional)</span></label>
                                <input type="text" id="oficial.subOficialFuncao" name="oficial.subOficialFuncao" onChange={handleInputChange} className={commonInputClass} />
                            </div>
                        </div>
                    </div>
                    
                    {/* Ações do Formulário */}
                    <div className="pt-5 border-t">
                        <div className="flex justify-end">
                            <button 
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                            >
                                Salvar Alterações
                            </button>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default ConfiguracaoCartorio;