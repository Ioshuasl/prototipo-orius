import React from 'react';
import PersonFields from '../../../../Components/PersonFields';
import { type ITrasladoExterior, type IEndereco, type IPersonData, type ITrasladoNascimentoData, type ITrasladoCasamentoData, type ITrasladoObitoData } from '../../../types';
import SubFormTrasladoNascimento from './SubFormTrasladoNascimento';
import SubFormTrasladoCasamento from './SubFormTrasladoCasamento';
import SubFormTrasladoObito from './SubFormTrasladoObito';
import { infoTrasladoExterior } from '../../../lib/contextualInfo';
import SectionHeader from '../../../Components/SectionHeader';
import DadosDocumentoOrigem from './DadosDocumentoOrigem';

interface FormProps {
    data: ITrasladoExterior;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    handleAddressUpdate: (path: (string | number)[], addressData: Partial<IEndereco>) => void;
    handleCpfSearch: (pathPrefix: (string | number)[], cpf: string) => void;
    searchingCpf: string | null;
    addDynamicItem: (path: string) => void;
    removeDynamicItem: (path: string, index: number) => void;
    onOpenInfoModal: (title: string, content: React.ReactNode) => void;
}

export default function FormTrasladoExterior({ data, handleInputChange, handleAddressUpdate, handleCpfSearch, searchingCpf, addDynamicItem, removeDynamicItem, onOpenInfoModal }: FormProps) {
    const commonInputClass = "mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500";
    const commonLabelClass = "block text-sm font-medium text-gray-700";
    const pathPrefix = ['dadosAto', 'trasladoExterior'];
    const commonPersonProps = { handleInputChange, handleAddressUpdate, handleCpfSearch, searchingCpf, addDynamicItem, removeDynamicItem };

    return (
        <div className="space-y-8">

            <div>
                {/* ALTERAÇÃO: Usando o novo cabeçalho com botão de info */}
                <SectionHeader
                    title="Dados da Sentença"
                    infoContent={infoTrasladoExterior}
                    onOpenInfoModal={onOpenInfoModal}
                />
                <DadosDocumentoOrigem origem="sentenca" dados={data} pathPrefix={pathPrefix.join('.')} handleInputChange={handleInputChange} />
            </div>

            {/* Seção do Requerente */}
            <div>
                <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">Dados do Requerente do Traslado</h4>
                <PersonFields
                    personData={data.requerente as IPersonData}
                    pathPrefix={[...pathPrefix, 'requerente']}
                    handleInputChange={handleInputChange}
                    handleAddressUpdate={handleAddressUpdate}
                    handleCpfSearch={handleCpfSearch}
                    searchingCpf={searchingCpf}
                />
            </div>

            {/* Seção da Certidão de Origem */}
            <div>
                <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">Dados da Certidão Original (do Exterior)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
                    <div className="md:col-span-2">
                        <label className={commonLabelClass}>Serventia de Origem (Consulado ou Órgão Estrangeiro)</label>
                        <input type="text" name={`${pathPrefix}.dadosCertidaoOrigem.serventia`} value={data.dadosCertidaoOrigem?.serventia || ''} onChange={handleInputChange} className={commonInputClass} />
                    </div>
                    <div>
                        <label className={commonLabelClass}>Data de Emissão da Certidão</label>
                        <input type="date" name={`${pathPrefix}.dadosCertidaoOrigem.dataEmissao`} value={data.dadosCertidaoOrigem?.dataEmissao || ''} onChange={handleInputChange} className={commonInputClass} />
                    </div>
                    <div className="md:col-span-3">
                        <label className={commonLabelClass}>Matrícula Consular ou Nº de Referência</label>
                        <input type="text" name={`${pathPrefix}.dadosCertidaoOrigem.matriculaOuReferencia`} value={data.dadosCertidaoOrigem?.matriculaOuReferencia || ''} onChange={handleInputChange} className={commonInputClass} />
                    </div>
                </div>
            </div>

            {/* Seletor do Tipo de Traslado */}
            <div className="pt-6 border-t">
                <label htmlFor={`${pathPrefix.join('.')}.tipoTraslado`} className="block text-lg font-semibold text-gray-800 mb-2">
                    Qual tipo de assento será trasladado?
                </label>
                <select
                    id={`${pathPrefix.join('.')}.tipoTraslado`}
                    name={`${pathPrefix.join('.')}.tipoTraslado`}
                    value={data.tipoTraslado}
                    onChange={handleInputChange}
                    className="mt-1 w-full border border-gray-300 rounded-md p-3 text-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="" disabled>Selecione um tipo de traslado...</option>
                    <option value="nascimento">Nascimento</option>
                    <option value="casamento">Casamento</option>
                    <option value="obito">Óbito</option>
                </select>
            </div>

            {/* Renderização Condicional dos Sub-Formulários */}
            {data.dadosAto && (
                <>
                    {data.tipoTraslado === 'nascimento' && (
                        <SubFormTrasladoNascimento data={data.dadosAto as ITrasladoNascimentoData} pathPrefix={`${pathPrefix.join('.')}.dadosAto`} {...commonPersonProps} />
                    )}
                    {data.tipoTraslado === 'casamento' && (
                        <SubFormTrasladoCasamento data={data.dadosAto as ITrasladoCasamentoData} pathPrefix={`${pathPrefix.join('.')}.dadosAto`} {...commonPersonProps} />
                    )}
                    {data.tipoTraslado === 'obito' && (
                        <SubFormTrasladoObito data={data.dadosAto as ITrasladoObitoData} pathPrefix={`${pathPrefix.join('.')}.dadosAto`} {...commonPersonProps} />
                    )}
                </>
            )}
        </div>
    );
}