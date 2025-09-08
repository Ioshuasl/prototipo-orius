import React from 'react';
import { type ITituloProtesto, type TPessoaTipo } from '../../types';
import SeletorDePessoa from '../../../Components/SeletorDePessoa';
import { User } from 'lucide-react';

interface TabApresentanteProps {
    titulo: ITituloProtesto;
    setTitulo: React.Dispatch<React.SetStateAction<ITituloProtesto>>;
}

const TabApresentante: React.FC<TabApresentanteProps> = ({ titulo, setTitulo }) => {
    return (
        <div className="animate-fade-in">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <User size={22} />
                Dados do Apresentante
            </h2>
            <SeletorDePessoa 
                dados={titulo.apresentante} 
                onDadosChange={(d) => setTitulo(t => ({...t, apresentante: d as TPessoaTipo}))} 
                pathPrefix={['apresentante']} 
                // As props abaixo são necessárias pelo SeletorDePessoa, mesmo que não usadas aqui
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

export default TabApresentante;