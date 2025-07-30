import React, { useEffect } from 'react';
import { type ITrasladoNascimentoData } from '../../../types';

interface SubFormProps {
    data: ITrasladoNascimentoData;
    pathPrefix: string;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

const observacaoConsular = "Brasileiro nato, conforme os termos da alínea c do inciso I do art. 12, in limine, da Constituição Federal.";
const observacaoEstrangeira = "Nos termos do artigo 12, inciso I, alínea 'c', in fine, da Constituição Federal, a confirmação da nacionalidade brasileira depende de residência no Brasil e de opção, depois de atingida a maioridade, em qualquer tempo, pela nacionalidade brasileira, perante a Justiça Federal.";

export default function SubFormTrasladoNascimento({ data, pathPrefix, handleInputChange }: SubFormProps) {
    const commonInputClass = "mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500";
    const commonLabelClass = "block text-sm font-medium text-gray-700";

    // Efeito para atualizar a observação obrigatória automaticamente
    useEffect(() => {
        const observacao = data.origemRegistro === 'consular' ? observacaoConsular : observacaoEstrangeira;
        if (data.observacaoObrigatoria !== observacao) {
            const fakeEvent = {
                target: {
                    name: `${pathPrefix}.observacaoObrigatoria`,
                    value: observacao
                }
            } as any;
            handleInputChange(fakeEvent);
        }
    }, [data.origemRegistro, data.observacaoObrigatoria, handleInputChange, pathPrefix]);

    return (
        <div className="space-y-6 pt-4 border-t mt-4">
            <div>
                <label className={commonLabelClass}>Origem da Certidão</label>
                <select name={`${pathPrefix}.origemRegistro`} value={data.origemRegistro || 'consular'} onChange={handleInputChange} className={commonInputClass}>
                    <option value="consular">Certidão Consular Brasileira</option>
                    <option value="estrangeiro">Certidão de Órgão Estrangeiro</option>
                </select>
            </div>
            
            <div>
                <h4 className="font-semibold text-gray-700">Dados do Nascido</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mt-3">
                    <div className="md:col-span-2">
                        <label className={commonLabelClass}>Nome Completo</label>
                        <input type="text" name={`${pathPrefix}.dadosNascimento.nome`} value={data.dadosNascimento?.nome || ''} onChange={handleInputChange} className={commonInputClass} />
                    </div>
                     <div>
                        <label className={commonLabelClass}>Data de Nascimento</label>
                        <input type="date" name={`${pathPrefix}.dadosNascimento.dataNascimento`} value={data.dadosNascimento?.dataNascimento || ''} onChange={handleInputChange} className={commonInputClass} />
                    </div>
                     <div>
                        <label className={commonLabelClass}>Sexo</label>
                        <select name={`${pathPrefix}.dadosNascimento.sexo`} value={data.dadosNascimento?.sexo || ''} onChange={handleInputChange} className={commonInputClass}>
                            <option value="">Selecione...</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Feminino">Feminino</option>
                            <option value="Ignorado">Ignorado</option>
                        </select>
                    </div>
                     <div className="md:col-span-2">
                        <label className={commonLabelClass}>Local de Nascimento (Cidade e País)</label>
                        <input type="text" name={`${pathPrefix}.dadosNascimento.localNascimento`} value={data.dadosNascimento?.localNascimento || ''} onChange={handleInputChange} className={commonInputClass} />
                    </div>
                </div>
            </div>

             <div>
                <h4 className="font-semibold text-gray-700">Filiação</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mt-3">
                     <div>
                        <label className={commonLabelClass}>Nome Completo do Pai</label>
                        <input type="text" name={`${pathPrefix}.filiacao.nomePai`} value={data.filiacao?.nomePai || ''} onChange={handleInputChange} className={commonInputClass} />
                    </div>
                     <div>
                        <label className={commonLabelClass}>Nacionalidade do Pai</label>
                        <input type="text" name={`${pathPrefix}.filiacao.nacionalidadePai`} value={data.filiacao?.nacionalidadePai || ''} onChange={handleInputChange} className={commonInputClass} />
                    </div>
                     <div>
                        <label className={commonLabelClass}>Nome Completo da Mãe</label>
                        <input type="text" name={`${pathPrefix}.filiacao.nomeMae`} value={data.filiacao?.nomeMae || ''} onChange={handleInputChange} className={commonInputClass} />
                    </div>
                     <div>
                        <label className={commonLabelClass}>Nacionalidade da Mãe</label>
                        <input type="text" name={`${pathPrefix}.filiacao.nacionalidadeMae`} value={data.filiacao?.nacionalidadeMae || ''} onChange={handleInputChange} className={commonInputClass} />
                    </div>
                </div>
            </div>
            <div>
                 <h4 className="font-semibold text-red-800">Observação Obrigatória</h4>
                 <textarea value={data.observacaoObrigatoria || ''} readOnly className="mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm bg-red-50 text-red-900 font-mono text-sm" rows={4}></textarea>
            </div>
        </div>
    );
}