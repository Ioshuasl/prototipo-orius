import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { IMaskInput } from 'react-imask';
import { toast } from 'react-toastify';
import { ufs, tiposLogradouro } from '../lib/Constants';
import { type IEndereco } from '../types/index';

interface AddressFieldsProps {
    addressData: IEndereco;
    namePrefix: string;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleAddressUpdate: (address: Partial<IEndereco>) => void;
}

const AddressFields: React.FC<AddressFieldsProps> = ({ addressData, namePrefix, handleInputChange, handleAddressUpdate }) => {
    
    const [isSearchingCep, setIsSearchingCep] = useState(false);
    
    const commonInputClass = "mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500";
    const commonLabelClass = "block text-sm font-medium text-gray-700";

    const handleCepSearch = async (cepValue: string) => {
        const cep = cepValue.replace(/\D/g, '');
        if (cep.length !== 8) {
            return;
        }

        setIsSearchingCep(true);
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
            
            if (data.erro) {
                toast.error('CEP não encontrado.');
                handleAddressUpdate({
                    logradouro: '',
                    bairro: '',
                    cidade: '',
                    uf: '',
                    complemento: '',
                });
                return;
            }
            
            toast.success('Endereço encontrado e preenchido!');
            handleAddressUpdate({
                logradouro: data.logradouro,
                bairro: data.bairro,
                cidade: data.localidade,
                uf: data.uf,
                complemento: data.complemento,
            });

        } catch (error) {
            console.error("Erro ao buscar CEP:", error);
            toast.error('Não foi possível buscar o CEP. Verifique a conexão.');
        } finally {
            setIsSearchingCep(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-6 gap-x-6 gap-y-5 md:col-span-4 border-t pt-5 mt-4">
            <div className="md:col-span-2">
                <label htmlFor={`${namePrefix}.cep`} className={commonLabelClass}>CEP</label>
                <div className="relative">
                    <IMaskInput
                        mask="00000-000"
                        id={`${namePrefix}.cep`}
                        name={`${namePrefix}.cep`}
                        value={addressData.cep}
                        onAccept={(value) => handleInputChange({ target: { name: `${namePrefix}.cep`, value } } as any)}
                        onComplete={handleCepSearch}
                        placeholder="00000-000"
                        className={commonInputClass}
                        disabled={isSearchingCep}
                    />
                    {isSearchingCep && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
                        </div>
                    )}
                </div>
            </div>
            <div className="md:col-span-4">
                <label htmlFor={`${namePrefix}.tipoLogradouro`} className={commonLabelClass}>Tipo de Logradouro</label>
                <select name={`${namePrefix}.tipoLogradouro`} value={addressData.tipoLogradouro} onChange={handleInputChange} className={commonInputClass}>
                    <option value="">Selecione...</option>
                    {tiposLogradouro.map(tipo => <option key={tipo} value={tipo}>{tipo}</option>)}
                </select>
            </div>
            <div className="md:col-span-4">
                <label htmlFor={`${namePrefix}.logradouro`} className={commonLabelClass}>Logradouro (Rua, Av., etc.)</label>
                <input type="text" name={`${namePrefix}.logradouro`} value={addressData.logradouro} onChange={handleInputChange} className={commonInputClass} />
            </div>
            <div className="md:col-span-2">
                <label htmlFor={`${namePrefix}.numero`} className={commonLabelClass}>Número</label>
                <input type="text" name={`${namePrefix}.numero`} value={addressData.numero} onChange={handleInputChange} className={commonInputClass} />
            </div>
            <div className="md:col-span-3">
                <label htmlFor={`${namePrefix}.bairro`} className={commonLabelClass}>Bairro</label>
                <input type="text" name={`${namePrefix}.bairro`} value={addressData.bairro} onChange={handleInputChange} className={commonInputClass} />
            </div>
            <div className="md:col-span-3">
                <label htmlFor={`${namePrefix}.complemento`} className={commonLabelClass}>Complemento (opcional)</label>
                <input type="text" name={`${namePrefix}.complemento`} value={addressData.complemento} onChange={handleInputChange} className={commonInputClass} />
            </div>
            <div className="md:col-span-4">
                <label htmlFor={`${namePrefix}.cidade`} className={commonLabelClass}>Cidade</label>
                <input type="text" name={`${namePrefix}.cidade`} value={addressData.cidade} onChange={handleInputChange} className={commonInputClass} />
            </div>
            <div className="md:col-span-2">
                <label htmlFor={`${namePrefix}.uf`} className={commonLabelClass}>Estado (UF)</label>
                <select name={`${namePrefix}.uf`} value={addressData.uf} onChange={handleInputChange} className={commonInputClass}>
                    <option value="">Selecione...</option>
                    {ufs.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                </select>
            </div>
        </div>
    );
};

export default AddressFields;