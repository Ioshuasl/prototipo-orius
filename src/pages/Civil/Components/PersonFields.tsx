import React from 'react';
import { Search, Loader2 } from 'lucide-react';
import { IMaskInput } from 'react-imask';
import { ufs, regimesDeBens, nacionalidades } from '../lib/Constants';
import { type IPessoaFisica, type IEndereco } from '../types';
import AddressFields from './AddressFields';

interface PersonFieldsProps {
    personData: IPessoaFisica;
    pathPrefix: (string | number)[];
    searchingCpf: string | null;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleAddressUpdate: (path: (string | number)[], addressData: Partial<IEndereco>) => void;
    handleCpfSearch: (pathPrefix: (string | number)[], cpf: string) => void;
    isWitness?: boolean;
}

const PersonFields: React.FC<PersonFieldsProps> = ({
    personData, pathPrefix, searchingCpf, handleInputChange, handleAddressUpdate, handleCpfSearch
}) => {
    const commonInputClass = "mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500";
    const commonLabelClass = "block text-sm font-medium text-gray-700";

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-5">
            <div className="md:col-span-2"><label className={commonLabelClass}>Nome Completo</label><input type="text" name={`${pathPrefix.join('.')}.nome`} value={personData.nome} onChange={handleInputChange} className={commonInputClass} /></div>
            <div>
                <label className={commonLabelClass}>CPF</label>
                <div className="flex">
                    <IMaskInput mask="000.000.000-00" name={`${pathPrefix.join('.')}.cpf`} value={personData.cpf} onAccept={(value) => handleInputChange({ target: { name: `${pathPrefix.join('.')}.cpf`, value } } as any)} className={commonInputClass} placeholder="000.000.000-00" />
                    <button type="button" onClick={() => handleCpfSearch(pathPrefix, personData.cpf)} disabled={searchingCpf === pathPrefix.join('.')} className="ml-2 mt-1 px-3 bg-gray-200 hover:bg-gray-300 rounded-md flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-50 transition-colors">
                        {searchingCpf === pathPrefix.join('.') ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5 text-gray-600" />}
                    </button>
                </div>
            </div>
            <div><label className={commonLabelClass}>Data de Nascimento</label><input type="date" name={`${pathPrefix.join('.')}.dataNascimento`} value={personData.dataNascimento} onChange={handleInputChange} className={commonInputClass} /></div>
            <div><label className={commonLabelClass}>Tipo de Documento</label><select name={`${pathPrefix.join('.')}.docIdentidadeTipo`} value={personData.docIdentidadeTipo} onChange={handleInputChange} className={commonInputClass}><option value="">Selecione</option><option>RG</option><option>CNH</option><option>Passaporte</option></select></div>
            <div className="md:col-span-1"><label className={commonLabelClass}>Nº do Documento</label><input type="text" name={`${pathPrefix.join('.')}.docIdentidadeNum`} value={personData.docIdentidadeNum} onChange={handleInputChange} className={commonInputClass} /></div>
            <div><label className={commonLabelClass}>Estado Civil</label><select name={`${pathPrefix.join('.')}.estadoCivil`} value={personData.estadoCivil} onChange={handleInputChange} className={commonInputClass}><option value="">Selecione</option><option>Solteiro(a)</option><option>Casado(a)</option><option>Divorciado(a)</option><option>Viúvo(a)</option><option>União Estável</option></select></div>
            <div><label className={commonLabelClass}>Regime de Bens</label><select name={`${pathPrefix.join('.')}.regimeBens`} value={personData.regimeBens} onChange={handleInputChange} className={commonInputClass}><option value="">Selecione...</option>{regimesDeBens.map(regime => <option key={regime} value={regime}>{regime}</option>)}</select></div>
            <div><label className={commonLabelClass}>Profissão</label><input type="text" name={`${pathPrefix.join('.')}.profissao`} value={personData.profissao} onChange={handleInputChange} className={commonInputClass} /></div>
            <div><label className={commonLabelClass}>Nacionalidade</label><select name={`${pathPrefix.join('.')}.nacionalidade`} value={personData.nacionalidade} onChange={handleInputChange} className={commonInputClass}>{nacionalidades.map(nac => <option key={nac} value={nac}>{nac}</option>)}</select></div>
            <div><label className={commonLabelClass}>Naturalidade (Cidade)</label><input type="text" name={`${pathPrefix.join('.')}.naturalidadeCidade`} value={personData.naturalidadeCidade} onChange={handleInputChange} className={commonInputClass} /></div>
            <div><label className={commonLabelClass}>UF</label><select name={`${pathPrefix.join('.')}.naturalidadeUF`} value={personData.naturalidadeUF} onChange={handleInputChange} className={commonInputClass}><option value="">Selecione...</option>{ufs.map(uf => <option key={uf} value={uf}>{uf}</option>)}</select></div>
            <AddressFields
                namePrefix={`${pathPrefix.join('.')}.endereco`}
                addressData={personData.endereco}
                handleInputChange={handleInputChange}
                handleAddressUpdate={(data) => handleAddressUpdate([...pathPrefix, 'endereco'], data)}
            />            {pathPrefix.includes('filiacao') && (
                <>
                    <div className="md:col-span-2 pt-4"><label className={`${commonLabelClass} text-gray-500`}>Nome do Pai da Pessoa</label><input type="text" name={`${pathPrefix.join('.')}.nomePai`} value={personData.nomePai} onChange={handleInputChange} className={commonInputClass} /></div>
                    <div className="md:col-span-2 pt-4"><label className={`${commonLabelClass} text-gray-500`}>Nome da Mãe da Pessoa</label><input type="text" name={`${pathPrefix.join('.')}.nomeMae`} value={personData.nomeMae} onChange={handleInputChange} className={commonInputClass} /></div>
                </>
            )}
        </div>
    );
};

export default PersonFields;