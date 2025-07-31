import React from 'react';
import { IMaskInput } from 'react-imask';

interface Requerente {
    tipo: 'fisica' | 'juridica';
    nome?: string;
    cpf?: string;
    razaoSocial?: string;
    cnpj?: string;
}

interface SeletorRequerenteProps {
    requerente: Requerente;
    onRequerenteChange: (field: keyof Requerente, value: string) => void;
}

export default function SeletorRequerente({ requerente, onRequerenteChange }: SeletorRequerenteProps) {
    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onRequerenteChange('tipo', e.target.value);
    };

    return (
        <div className="p-4 bg-gray-50 rounded-lg border">
            <h4 className="font-semibold text-gray-700 mb-3">2. Dados do Requerente</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tipo de Pessoa</label>
                    <select
                        value={requerente.tipo}
                        onChange={handleTypeChange}
                        className="mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm"
                    >
                        <option value="fisica">Pessoa Física</option>
                        <option value="juridica">Pessoa Jurídica</option>
                    </select>
                </div>
                {requerente.tipo === 'fisica' ? (
                    <>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
                            <input
                                type="text"
                                value={requerente.nome || ''}
                                onChange={(e) => onRequerenteChange('nome', e.target.value)}
                                className="mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">CPF</label>
                             <IMaskInput
                                mask="000.000.000-00"
                                value={requerente.cpf || ''}
                                onAccept={(value) => onRequerenteChange('cpf', value)}
                                className="mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm"
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Razão Social</label>
                            <input
                                type="text"
                                value={requerente.razaoSocial || ''}
                                onChange={(e) => onRequerenteChange('razaoSocial', e.target.value)}
                                className="mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">CNPJ</label>
                            <IMaskInput
                                mask="00.000.000/0000-00"
                                value={requerente.cnpj || ''}
                                onAccept={(value) => onRequerenteChange('cnpj', value)}
                                className="mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm"
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}