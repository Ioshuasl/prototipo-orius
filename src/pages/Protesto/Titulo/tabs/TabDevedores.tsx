import React from 'react';
import { type ITituloProtesto, type TPessoaTipo } from '../../types';
import SeletorDePessoa from '../../../Components/SeletorDePessoa';
import { PlusCircle, Trash2, Users } from 'lucide-react';

interface TabDevedoresProps {
    titulo: ITituloProtesto;
    onDevedorChange: (index: number, novosDados: Partial<TPessoaTipo>) => void;
    onAddDevedor: () => void;      // <-- Prop para receber a função de adicionar
    onRemoveDevedor: (index: number) => void; // <-- Prop para receber a função de remover
}

const TabDevedores: React.FC<TabDevedoresProps> = ({ 
    titulo, 
    onDevedorChange,
    onAddDevedor,
    onRemoveDevedor
}) => {
    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                    <Users size={22} />
                    {titulo.devedores.length == 1 ? 'Devedor' : `Devedores (${titulo.devedores.length})`}
                </h2>
                <button onClick={onAddDevedor} className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800">
                    <PlusCircle size={16} /> Adicionar Devedor
                </button>
            </div>
            <div className="space-y-4">
                {titulo.devedores.map((devedor, index) => (
                    <div key={index} className="relative border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold text-gray-600">Devedor {index + 1}</h3>
                            {titulo.devedores.length > 1 && ( 
                                // Este botão agora chama a função recebida via props
                                <button onClick={() => onRemoveDevedor(index)} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700">
                                    <Trash2 size={14} /> Remover
                                </button> 
                            )}
                        </div>
                        <SeletorDePessoa 
                            dados={devedor} 
                            onDadosChange={(d) => onDevedorChange(index, d)} 
                            pathPrefix={['devedores', index]}
                            handleInputChange={()=>{}} handleAddressUpdate={()=>{}} handleCpfSearch={()=>{}} handleCnpjSearch={()=>{}} searchingCpf={null} searchingCnpj={null} onAddSocio={()=>{}} onRemoveSocio={()=>{}} 
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TabDevedores;