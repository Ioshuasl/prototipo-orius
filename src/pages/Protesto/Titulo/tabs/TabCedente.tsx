import React from 'react';
import { type ITituloProtesto, type TPessoaTipo } from '../../types';
import SeletorDePessoa from '../../../Components/SeletorDePessoa';
import { UserCheck } from 'lucide-react';

interface TabCedenteProps {
    titulo: ITituloProtesto;
    setTitulo: React.Dispatch<React.SetStateAction<ITituloProtesto>>;
}

const TabCedente: React.FC<TabCedenteProps> = ({ titulo, setTitulo }) => {
    // Esta verificação garante que o componente não tente renderizar se não houver um cedente.
    if (!titulo.cedente) {
        return <p className="text-gray-500">Não há cedente para este título.</p>;
    }

    return (
        <div className="animate-fade-in">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <UserCheck size={22} />
                Dados do Cedente (Credor Original)
            </h2>
            <SeletorDePessoa 
                dados={titulo.cedente} 
                onDadosChange={(d) => setTitulo(t => ({...t, cedente: d as TPessoaTipo}))} 
                pathPrefix={['cedente']}
                // As props abaixo são necessárias pelo SeletorDePessoa
                handleInputChange={()=>{}} 
                handleAddressUpdate={()=>{}} 
                handleCpfSearch={()=>{}} 
                handleCnpjSearch={()=>{}} 
                searchingCpf={null} 
                searchingCnpj={null} 
                onAddSocio={()=>{}} 
                onRemoveSocio={()=>{}} 
            />
        </div>
    );
};

export default TabCedente;