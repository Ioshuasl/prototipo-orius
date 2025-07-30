import React from 'react';
import { type IObitoFormData } from '../../../types';

// A interface de Props inclui os componentes e estilos que serão recebidos
interface TabBensProps {
    formData: IObitoFormData;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    // Props de UI
    SectionTitle: React.FC<{ children: React.ReactNode }>;
    InfoBox: React.FC<{ type?: 'info' | 'warning', children: React.ReactNode }>;
    commonInputClass: string;
    commonLabelClass: string;
    requiredSpan: React.ReactNode;
}

export default function TabBens({ 
    formData, 
    handleInputChange, 
    SectionTitle, 
    InfoBox, 
    commonInputClass,
    commonLabelClass,
    requiredSpan 
}: TabBensProps) {
    const { bens } = formData;

    return (
        <fieldset>
            <SectionTitle>Bens e Situações Especiais</SectionTitle>
            <div className="space-y-8">

                {/* Seção Deixou Bens */}
                <div className="p-4 bg-white rounded-md border border-gray-200">
                    <label className="block text-base font-semibold text-gray-800">O falecido deixou bens a inventariar? {requiredSpan}</label>
                    <p className="text-sm text-gray-500 mt-1 mb-3">Esta é uma informação declaratória para o futuro processo de inventário. Não é necessário listar os bens neste momento.</p>
                    <div className="flex gap-6">
                        <label className="flex items-center gap-2"><input type="radio" name="bens.deixouBens" value="true" checked={bens.deixouBens} onChange={handleInputChange} className="h-4 w-4"/> Sim</label>
                        <label className="flex items-center gap-2"><input type="radio" name="bens.deixouBens" value="false" checked={!bens.deixouBens} onChange={handleInputChange} className="h-4 w-4"/> Não</label>
                    </div>
                </div>

                {/* Seção Herdeiros Menores */}
                <div className="p-4 bg-white rounded-md border border-gray-200">
                    <label className="block text-base font-semibold text-gray-800">Existem herdeiros menores de idade ou interditados? {requiredSpan}</label>
                    <div className="flex gap-6 mt-3">
                        <label className="flex items-center gap-2"><input type="radio" name="bens.existemHerdeirosMenores" value="true" checked={bens.existemHerdeirosMenores} onChange={handleInputChange} className="h-4 w-4"/> Sim</label>
                        <label className="flex items-center gap-2"><input type="radio" name="bens.existemHerdeirosMenores" value="false" checked={!bens.existemHerdeirosMenores} onChange={handleInputChange} className="h-4 w-4"/> Não</label>
                    </div>
                    {bens.existemHerdeirosMenores && (
                        <InfoBox type="info">
                            A existência de herdeiros menores ou interditados torna obrigatória a participação do Ministério Público no processo de inventário para garantir a proteção de seus direitos.
                        </InfoBox>
                    )}
                </div>
                
                {/* Seção Testamento */}
                <div className="p-4 bg-white rounded-md border border-gray-200">
                    <label className="block text-base font-semibold text-gray-800">O falecido deixou testamento conhecido? {requiredSpan}</label>
                    <div className="flex gap-6 mt-3">
                        <label className="flex items-center gap-2"><input type="radio" name="bens.deixouTestamento" value="true" checked={bens.deixouTestamento} onChange={handleInputChange} className="h-4 w-4"/> Sim</label>
                        <label className="flex items-center gap-2"><input type="radio" name="bens.deixouTestamento" value="false" checked={!bens.deixouTestamento} onChange={handleInputChange} className="h-4 w-4"/> Não</label>
                    </div>
                    {bens.deixouTestamento && (
                        <div className="mt-4 animate-fade-in">
                            <label htmlFor="bens.infoTestamento" className={commonLabelClass}>Se sim, informe o cartório, livro e folha do registro do testamento (se souber)</label>
                            <input type="text" name="bens.infoTestamento" id="bens.infoTestamento" value={bens.infoTestamento || ''} onChange={handleInputChange} className={commonInputClass} placeholder="Ex: 2º Tabelionato de Notas de Goiânia, Livro 5-T, Folha 123"/>
                        </div>
                    )}
                </div>

                {/* Seção Pensionistas */}
                <div className="p-4 bg-white rounded-md border border-gray-200">
                    <label className="block text-base font-semibold text-gray-800">Deixou pensionistas junto à Previdência Social? {requiredSpan}</label>
                    <div className="flex gap-6 mt-3">
                        <label className="flex items-center gap-2"><input type="radio" name="bens.deixouPensionistas" value="true" checked={bens.deixouPensionistas} onChange={handleInputChange} className="h-4 w-4"/> Sim</label>
                        <label className="flex items-center gap-2"><input type="radio" name="bens.deixouPensionistas" value="false" checked={!bens.deixouPensionistas} onChange={handleInputChange} className="h-4 w-4"/> Não</label>
                    </div>
                </div>

            </div>
        </fieldset>
    );
}