import React from 'react';
import PersonFields from '../../../../Components/PersonFields';
import { Sparkles } from 'lucide-react';
import { type INascimentoPaisEstrangeiros, type IEndereco, type IPersonData } from '../../../types';
import { toast } from 'react-toastify';
import { infoNascimentoPaisEstrangeiros } from '../../../lib/contextualInfo';
import SectionHeader from '../../../Components/SectionHeader';
import DadosDocumentoOrigem from './DadosDocumentoOrigem';

interface FormProps {
    data: INascimentoPaisEstrangeiros;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    handleAddressUpdate: (path: (string | number)[], addressData: Partial<IEndereco>) => void;
    handleCpfSearch: (pathPrefix: (string | number)[], cpf: string) => void;
    searchingCpf: string | null;
    onOpenInfoModal: (title: string, content: React.ReactNode) => void;
}

export default function FormNascimentoPaisEstrangeiros({ data, handleInputChange, handleAddressUpdate, handleCpfSearch, searchingCpf, onOpenInfoModal }: FormProps) {
    const commonInputClass = "mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500";
    const commonLabelClass = "block text-sm font-medium text-gray-700";
    const pathPrefix = ['dadosAto', 'nascimentoPaisEstrangeiros'];

    // Handler específico para o botão de gerar CPF do nascido
    const handleGenerateCpf = () => {
        toast.info("Gerando novo CPF...");
        setTimeout(() => {
            const randomPart = () => Math.floor(100 + Math.random() * 900);
            const randomEnd = () => Math.floor(10 + Math.random() * 90);
            const fakeCpf = `${randomPart()}${randomPart()}${randomPart()}${randomEnd()}`.padStart(11, '0');

            const fakeEvent = {
                target: { name: 'registrando.cpf', value: fakeCpf }
            } as React.ChangeEvent<HTMLInputElement>;

            handleInputChange(fakeEvent);
            toast.success("Novo CPF gerado e preenchido!");
        }, 1000);
    };

    return (
        <div className="space-y-8">

            <div>
                {/* ALTERAÇÃO: Usando o novo cabeçalho com botão de info */}
                <SectionHeader
                    title="Dados da Sentença"
                    infoContent={infoNascimentoPaisEstrangeiros}
                    onOpenInfoModal={onOpenInfoModal}
                />
                <DadosDocumentoOrigem origem="sentenca" dados={data} pathPrefix={pathPrefix.join('.')} handleInputChange={handleInputChange} />
            </div>

            {/* Seção Dados do Nascimento */}
            <div>
                <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">Dados do Nascimento</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
                    <div>
                        <label className={commonLabelClass}>Nº da DNV</label>
                        <input type="text" name={`${pathPrefix}.nascimento.dnv`} value={data.nascimento?.dnv || ''} onChange={handleInputChange} className={commonInputClass} />
                    </div>
                    <div>
                        <label className={commonLabelClass}>Data do Nascimento</label>
                        <input type="date" name={`${pathPrefix}.nascimento.dataNascimento`} value={data.nascimento?.dataNascimento || ''} onChange={handleInputChange} className={commonInputClass} />
                    </div>
                    <div>
                        <label className={commonLabelClass}>Hora (opcional)</label>
                        <input type="time" name={`${pathPrefix}.nascimento.horaNascimento`} value={data.nascimento?.horaNascimento || ''} onChange={handleInputChange} className={commonInputClass} />
                    </div>
                    <div className="md:col-span-3">
                        <label className={commonLabelClass}>Local do Nascimento</label>
                        <input type="text" name={`${pathPrefix}.nascimento.localNascimento`} value={data.nascimento?.localNascimento || ''} onChange={handleInputChange} className={commonInputClass} placeholder="Hospital, Cidade - UF" />
                    </div>
                    <div className="md:col-span-3">
                        <label className="flex items-center gap-2">
                            <input type="checkbox"
                                name={`${pathPrefix}.nascimento.isGemeo`}
                                checked={data.nascimento?.isGemeo || false}
                                onChange={handleInputChange}
                                className="form-checkbox h-4 w-4 text-blue-600" />
                            Parto múltiplo (gêmeos)?
                        </label>
                    </div>
                </div>
            </div>

            {/* Seção Dados do Registrando */}
            <div>
                <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">Dados do Registrando</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
                    <div className="md:col-span-2">
                        <label className={commonLabelClass}>Prenome</label>
                        <input type="text" name={`${pathPrefix}.registrando.prenome`} value={data.registrando?.prenome || ''} onChange={handleInputChange} className={commonInputClass} />
                    </div>
                    <div>
                        <label className={commonLabelClass}>Sobrenome</label>
                        <input type="text" name={`${pathPrefix}.registrando.sobrenome`} value={data.registrando?.sobrenome || ''} onChange={handleInputChange} className={commonInputClass} />
                    </div>
                    <div>
                        <label className={commonLabelClass}>Sexo</label>
                        <select name={`${pathPrefix}.registrando.sexo`} value={data.registrando?.sexo || ''} onChange={handleInputChange} className={commonInputClass}>
                            <option value="">Selecione...</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Feminino">Feminino</option>
                        </select>
                    </div>
                    <div>
                        <label className={commonLabelClass}>CPF</label>
                        <div className="flex">
                            <input type="text" name={`${pathPrefix}.registrando.cpf`} value={data.registrando?.cpf || ''} onChange={handleInputChange} className={commonInputClass} />
                            <button type="button" onClick={handleGenerateCpf} title="Gerar CPF para o nascido" className="ml-2 mt-1 px-3 bg-gray-200 hover:bg-gray-300 rounded-md flex items-center justify-center transition-colors">
                                <Sparkles className="h-5 w-5 text-yellow-500" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Seção de Filiação */}
            <div>
                <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">Filiação</h4>
                <div className="space-y-6">
                    <div>
                        <h5 className="font-semibold text-gray-700 mb-3">Dados da Mãe</h5>
                        <PersonFields personData={data.filiacao?.mae as IPersonData} pathPrefix={[...pathPrefix, 'filiacao', 'mae']} {...{ handleInputChange, handleAddressUpdate, handleCpfSearch, searchingCpf }} />
                    </div>
                    <div>
                        <h5 className="font-semibold text-gray-700 mb-3">Dados do Pai</h5>
                        <PersonFields personData={data.filiacao?.pai as IPersonData} pathPrefix={[...pathPrefix, 'filiacao', 'pai']} {...{ handleInputChange, handleAddressUpdate, handleCpfSearch, searchingCpf }} />
                    </div>
                </div>
            </div>

            {/* Seção do Declarante */}
            <div>
                <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">Dados do Declarante</h4>
                <PersonFields personData={data.declarante as IPersonData} pathPrefix={[...pathPrefix, 'declarante']} {...{ handleInputChange, handleAddressUpdate, handleCpfSearch, searchingCpf }} />
            </div>

            {/* Seção da Observação Obrigatória */}
            <div>
                <h4 className="font-bold text-red-800 mb-4 border-b border-red-200 pb-2">Observação Obrigatória</h4>
                <textarea value={data.observacaoObrigatoria || ''} readOnly className="mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm bg-red-50 text-red-900 font-mono text-sm" rows={3}></textarea>
            </div>
        </div>
    );
}