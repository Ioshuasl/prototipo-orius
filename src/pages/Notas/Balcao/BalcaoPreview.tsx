// BalcaoPreview.tsx (COMPLETO E ATUALIZADO com Geração de QR Code REAL)

import React, { useMemo, useState, useEffect } from 'react';
// Importação Real da Biblioteca
import QRCode from 'qrcode';
import { type IBalcaoTemplate } from '../Types'; 
import { type TPessoaTipo } from '../../Types';
import { type DADOS_SERVENTIA } from '../lib/Constants'; 
import { Scaling, Move } from 'lucide-react'; // Ícones para as configurações

// Simulação do tipo IPessoaSimples
interface IPessoaSimples {
    nome: string;
    cpf: string;
    docIdentidadeNum?: string;
}

interface BalcaoPreviewProps {
    template: IBalcaoTemplate;
    clientData: Partial<TPessoaTipo>;
    serventiaData: typeof DADOS_SERVENTIA;
    quantidade: number; 
    testemunhas: Partial<IPessoaSimples>[]; 
    // PROPS RECEBIDOS DO EMITIRNOVOSERVIÇOBALCAO.TSX
    seloGerado: string | null;
    // O qrCodeUrl não é mais recebido, é gerado aqui!
}

// URL DE CONSULTA PADRÃO (Constante)
const URL_CONSULTA_BASE = `https://see.tjgo.jus.br/buscas?codigo_selo=`;

// --- FUNÇÃO REUTILIZADA PARA POSICIONAMENTO DO QR CODE ---
const getQrCodeStyle = (position: string, size: number): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
        position: 'absolute',
        width: `${size}px`,
        textAlign: 'center',
        zIndex: 10,
    };

    switch (position) {
        case 'bottom-mid':
            return { ...baseStyle, bottom: '5mm', left: '50%', transform: 'translateX(-50%)' };
        case 'top-left':
            return { ...baseStyle, top: '5mm', left: '5mm' };
        case 'top-right':
            return { ...baseStyle, top: '5mm', right: '5mm' };
        case 'bottom-left':
            return { ...baseStyle, bottom: '5mm', left: '5mm' };
        case 'bottom-right':
        default:
            return { ...baseStyle, bottom: '5mm', right: '5mm' };
    }
};
// -----------------------------------------------------------------


const BalcaoPreview: React.FC<BalcaoPreviewProps> = ({
    template,
    clientData,
    serventiaData,
    quantidade, 
    testemunhas,
    seloGerado,
}) => {
    // --- ESTADOS PARA CONFIGURAÇÃO DA VISUALIZAÇÃO DO SELO ---
    const [qrCodeSize, setQrCodeSize] = useState(50); 
    const [qrCodePosition, setQrCodePosition] = useState('bottom-right');
    const [modeloSelo, setModeloSelo] = useState('qr');
    // NOVO ESTADO: Para armazenar a URL de dados do QR Code gerado
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
    // ---------------------------------------------------------

    // 1. LÓGICA DE GERAÇÃO REAL DO QR CODE
    useEffect(() => {
        if (seloGerado) {
            const urlConsulta = `${URL_CONSULTA_BASE}${seloGerado}`;
            
            QRCode.toDataURL(urlConsulta, {
                width: qrCodeSize,
                margin: 1, // Margem conforme exemplo original
            })
            .then(url => {
                setQrCodeDataUrl(url);
            })
            .catch(err => {
                console.error("Falha ao gerar o QR Code:", err);
                setQrCodeDataUrl(null);
            });
        } else {
            setQrCodeDataUrl(null);
        }
    }, [seloGerado, qrCodeSize]); // Depende do selo final e do tamanho do preview

    // 2. Estilo do QR Code (Usa a função reutilizada)
    const qrStyle = useMemo(() => getQrCodeStyle(qrCodePosition, qrCodeSize), [qrCodePosition, qrCodeSize]);
    
    // 3. Processamento do Conteúdo
    const formatQualificacao = (pessoa: Partial<IPessoaSimples>) => {
        if (!pessoa.nome) return `(Não Registrado)`;
        const doc = pessoa.cpf || pessoa.docIdentidadeNum;
        const docText = doc ? `(CPF/RG: ${doc})` : '(Doc. Não Informado)';
        return `${pessoa.nome} ${docText}`;
    };

    const renderedContent = useMemo(() => {
        let content = template.conteudo;

        // Dados Genéricos
        const nomePessoa = clientData.tipo === 'fisica' ? (clientData as any).nome : (clientData as any).razaoSocial;
        const cpfCnpj = clientData.tipo === 'fisica' ? (clientData as any).cpf : (clientData as any).cnpj;
        
        // Substituições Comuns
        content = content.replace(/\{\{\s*NOME_FIRMA\s*\}\}/g, nomePessoa || '____________');
        content = content.replace(/\{\{\s*CPF_CNPJ\s*\}\}/g, cpfCnpj || '____________');
        content = content.replace(/\{\{\s*DATA\s*\}\}/g, new Date().toLocaleDateString('pt-BR'));
        content = content.replace(/\{\{\s*HORA\s*\}\}/g, new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
        
        // Placeholders de Serventia
        content = content.replace(/\{\{\s*CNS\s*\}\}/g, serventiaData.cns);
        content = content.replace(/\{\{\s*CIDADE\s*\}\}/g, serventiaData.cidade);
        content = content.replace(/\{\{\s*UF\s*\}\}/g, serventiaData.uf);

        // PLACEHOLDERS DE SELO (USAM DADOS REAIS GERADOS)
        content = content.replace(/\{\{\s*NUMERO_SELO\s*\}\}/g, seloGerado || 'Aguardando Selagem...');
        content = content.replace(/\{\{\s*URL_CONSULTA_SELO\s*\}\}/g, seloGerado ? `${URL_CONSULTA_BASE}${seloGerado}` : 'Aguardando Selagem...');
        
        // PLACEHOLDER PARA QUANTIDADE
        content = content.replace(/\{\{\s*QUANTIDADE_ATOS\s*\}\}/g, String(quantidade));


        // --- Lógica de Participantes Adicionais ---

        // 1. Rogatário
        if (template.id === 'BALCAO-REC-001') {
            const rogatario = (clientData as any).nomeMae || ''; 
            content = content.replace(/\{\{\s*NOME_ROGATARIO\s*\}\}/g, rogatario);
        }

        // 2. Testemunhas
        if (testemunhas.length > 0) {
            const listaTestemunhasHtml = testemunhas.map((t, index) => {
                return `<li>Testemunha ${index + 1}: ${formatQualificacao(t)}</li>`;
            }).join('');
            
            content = content.replace(/\{\{\s*LISTA_TESTEMUNHAS\s*\}\}/g, `<div style="margin-top: 5px; font-style: italic;">Testemunhas:</div><ul style="margin-left: 20px;">${listaTestemunhasHtml}</ul>`);
        
            content = content.replace(/\{\{\s*TESTEMUNHA_1_NOME\s*\}\}/g, testemunhas[0]?.nome || '____________');
            content = content.replace(/\{\{\s*TESTEMUNHA_2_NOME\s*\}\}/g, testemunhas[1]?.nome || '____________');
            
        } else {
             content = content.replace(/\{\{\s*LISTA_TESTEMUNHAS\s*\}\}/g, 'Não houve intervenção de testemunhas.');
             content = content.replace(/\{\{\s*TESTEMUNHA_1_NOME\s*\}\}/g, '____________');
             content = content.replace(/\{\{\s*TESTEMUNHA_2_NOME\s*\}\}/g, '____________');
        }


        // Se for um template de Reconhecimento Autêntico (BALCAO-REC-002)
        if (template.id === 'BALCAO-REC-002') {
            const doc = (clientData as any).docIdentidadeNum || (clientData as any).cpf;
            content = content.replace(/\{\{\s*CPF_RG\s*\}\}/g, doc || 'não identificado');
        }

        return content;
    }, [template.conteudo, clientData, serventiaData, quantidade, testemunhas, seloGerado]);

    // Estilos para simular o layout físico da etiqueta
    const previewStyle: React.CSSProperties = {
        width: `${template.layout.largura_mm}mm`,
        height: `${template.layout.altura_mm}mm`,
        padding: `${template.margins.top}mm ${template.margins.right}mm ${template.margins.bottom}mm ${template.margins.left}mm`,
        border: '1px solid #3b82f6', 
        backgroundColor: '#fff',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        overflow: 'visible', 
        fontSize: '10pt',
        margin: '0 auto',
        position: 'relative', 
    };
    
    const commonInputClass = "mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500";


    return (
        <div className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg">
            
            {/* --- CONFIGURAÇÕES DO SELO (Controles de Visualização) --- */}
            <div className="w-full max-w-lg bg-white p-4 rounded-lg shadow-md mb-4 border border-gray-200">
                <h4 className="text-md font-semibold text-gray-700 mb-3 border-b pb-2">Configuração do Selo Digital (Preview)</h4>
                
                <div className='mb-4'>
                    <label htmlFor="mock-selo" className="block text-sm font-medium text-gray-700">Número do Selo Digital</label>
                    <input id="mock-selo" type="text" readOnly value={seloGerado || 'Aguardando Geração...'} className={`${commonInputClass} ${seloGerado ? 'bg-green-50' : 'bg-gray-100'}`} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="qr-size" className="flex items-center gap-2 text-sm font-medium text-gray-700"><Scaling size={14} /> Tamanho do selo (px)</label>
                        <input id="qr-size" type="number" min="50" max="150" value={qrCodeSize} onChange={(e) => setQrCodeSize(Number(e.target.value))} className={commonInputClass} />
                    </div>
                    <div>
                        <label htmlFor="qr-pos" className="flex items-center gap-2 text-sm font-medium text-gray-700"><Move size={14} />Posição do selo</label>
                        <select id="qr-pos" value={qrCodePosition} onChange={(e) => setQrCodePosition(e.target.value)} className={commonInputClass}>
                            <option value="top-left">Canto Superior Esquerdo</option>
                            <option value="top-right">Canto Superior Direito</option>
                            <option value="bottom-left">Canto Inferior Esquerdo</option>
                            <option value="bottom-right">Canto Inferior Direito</option>
                            <option value="bottom-mid">Inferior Centro</option>
                        </select>
                    </div>
                </div>
                
                <div className='mt-4'>
                    <label htmlFor="modelo-selo" className="flex items-center gap-2 text-sm font-medium text-gray-700">Modelo do Selo</label>
                    <select id="modelo-selo" value={modeloSelo} onChange={(e) => setModeloSelo(e.target.value)} className={commonInputClass}>
                        <option value="qr">Somente QR Code</option>
                        <option value="qr-numero">QR Code + Número</option>
                        <option value="qr-texto-lado">QR Code + Texto (Lado)</option>
                        <option value="qr-texto-abaixo">QR Code + Texto (Abaixo)</option>
                        <option value="numero">Somente Número</option>
                    </select>
                </div>
            </div>
            {/* ----------------------------------------------------- */}

            <p className="text-gray-500 mb-3 text-sm">Dimensões: {template.layout.largura_mm}mm x {template.layout.altura_mm}mm</p>
            
            <div style={previewStyle}>
                <div dangerouslySetInnerHTML={{ __html: renderedContent }} />
                
                {/* --- RENDERIZAÇÃO DO SELO DIGITAL DINÂMICO (COM GERAÇÃO REAL) --- */}
                {seloGerado && qrCodeDataUrl && (
                    <div style={qrStyle}>
                        {/* Modelo 1: Somente QR Code */}
                        {modeloSelo === 'qr' && (
                            <img
                                src={qrCodeDataUrl}
                                alt="QR Code"
                                style={{ width: `${qrCodeSize}px`, height: `${qrCodeSize}px` }}
                            />
                        )}

                        {/* Modelo 2: QR Code + Número (Abaixo) */}
                        {modeloSelo === 'qr-numero' && (
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                fontFamily: 'Arial, sans-serif',
                                fontSize: '10pt',
                            }}>
                                <img
                                    src={qrCodeDataUrl}
                                    alt="QR Code"
                                    style={{ width: `${qrCodeSize}px`, height: `${qrCodeSize}px` }}
                                />
                                <span style={{ fontWeight: 'bold', marginTop: '4px' }}>{seloGerado}</span>
                            </div>
                        )}

                        {/* Modelo 3: QR Code + Texto (Lado) */}
                        {modeloSelo === 'qr-texto-lado' && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '8px',
                                fontFamily: 'Arial, sans-serif',
                                fontSize: '9pt',
                                lineHeight: 1.4,
                                maxWidth: '250px',
                            }}>
                                <img
                                    src={qrCodeDataUrl}
                                    alt="QR Code"
                                    style={{ width: `${qrCodeSize}px`, height: `${qrCodeSize}px` }}
                                />
                                <div style={{textAlign: 'left'}}>
                                    Consulte este selo em:<br />
                                    <strong style={{fontSize: '9pt', wordBreak: 'break-all'}}>{URL_CONSULTA_BASE}{seloGerado}</strong>
                                </div>
                            </div>
                        )}

                        {/* Modelo 4: QR Code + Texto (Abaixo) */}
                        {modeloSelo === 'qr-texto-abaixo' && (
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textAlign: 'center',
                                fontFamily: 'Arial, sans-serif',
                                fontSize: '9pt',
                                lineHeight: 1.4,
                            }}>
                                <img
                                    src={qrCodeDataUrl}
                                    alt="QR Code"
                                    style={{ width: `${qrCodeSize}px`, height: `${qrCodeSize}px`, marginBottom: '6px' }}
                                />
                                <div style={{maxWidth: `${qrCodeSize + 30}px`, wordBreak: 'break-all'}}>
                                    Consulte este selo em:<br />
                                    <strong>{URL_CONSULTA_BASE}{seloGerado}</strong>
                                </div>
                            </div>
                        )}
                        
                        {/* Modelo 5: Somente Número */}
                        {modeloSelo === 'numero' && (
                            <div style={{
                                fontFamily: 'Arial, sans-serif',
                                fontSize: '14pt',
                                fontWeight: 'bold',
                                textAlign: 'center',
                            }}>
                                {seloGerado}
                            </div>
                        )}
                    </div>
                )}

            </div>
            
            <p className="mt-3 text-xs text-center text-gray-600">
                Visualização do Selo Digital (Posição: {qrCodePosition} / Modelo: {modeloSelo}).
            </p>
        </div>
    );
};

export default BalcaoPreview;