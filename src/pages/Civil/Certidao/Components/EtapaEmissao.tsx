import React, { useState } from 'react';
import { Eye, Printer, Stamp, ArrowLeft, Move, Scaling } from 'lucide-react';
import { toast } from 'react-toastify';
import QRCode from 'qrcode';
import { selo_teste } from '../../lib/Constants';
import PreviewModal from './PreviewModal';

// --- Interface não muda ---
interface EtapaEmissaoProps {
    pedido: any;
    setPedido: React.Dispatch<React.SetStateAction<any>>;
    onConcluir: () => void;
    onVoltar: () => void;
}

// --- Nova Função Auxiliar para Estilos ---
// Esta função gera o objeto de estilo CSS para posicionar o QR Code
const getQrCodeStyle = (position: string, size: number): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
        position: 'absolute',
        width: `${size}px`,
        textAlign: 'center',
    };

    switch (position) {
        case 'bottom-mid':
            return { ...baseStyle, bottom: '25mm', left: '50%', transform: 'translateX(-50%)' };
        case 'top-left':
            return { ...baseStyle, top: '25mm', left: '30mm' };
        case 'top-right':
            return { ...baseStyle, top: '45mm', right: '20mm' };
        case 'bottom-left':
            return { ...baseStyle, bottom: '25mm', left: '30mm' };
        case 'bottom-right':
        default:
            return { ...baseStyle, bottom: '25mm', right: '30mm' };
    }
};


export default function EtapaEmissao({ pedido, setPedido, onConcluir, onVoltar }: EtapaEmissaoProps) {
    const { selo, textoCertidao, textoCertidaoVerso } = pedido;

    // --- Estados Atualizados ---
    const [qrCodeSize, setQrCodeSize] = useState(60); // Tamanho em pixels
    const [qrCodePosition, setQrCodePosition] = useState('bottom-left'); // Novo estado para posição
    const [qrCodeUrl, setQrCodeUrl] = useState(''); // Estado para armazenar a URL da imagem do QR Code
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [previewHtml, setPreviewHtml] = useState('');
    const [modeloSelo, setModeloSelo] = useState('qr'); // valor padrão
    const [selarVerso, setSelarVerso] = useState('false');
    const [mostrarVerso, setMostrarVerso] = useState(false);

    const handleSelar = async () => {
        if (selo) {
            toast.warn("Esta certidão já foi selada.");
            return;
        }

        try {
            const novoSelo = selo_teste;
            const urlConsulta = `https://see.tjgo.jus.br/buscas?codigo_selo=${novoSelo}`;

            const qrCodeDataUrl = await QRCode.toDataURL(urlConsulta, {
                width: qrCodeSize,
                margin: 1,
            });

            // --- Lógica de Selagem Simplificada ---
            // 1. Armazena a URL do QR Code no estado local
            setQrCodeUrl(qrCodeDataUrl);

            // 2. Atualiza o estado do pai apenas com o número do selo.
            // NÃO MODIFICAMOS MAIS O textoCertidao.
            setPedido((prev: any) => ({
                ...prev,
                selo: novoSelo,
            }));

            toast.success("Certidão selada com sucesso!");

        } catch (err) {
            console.error("Falha ao gerar o QR Code:", err);
            toast.error("Falha ao gerar o QR Code da certidão. Verifique o console.");
        }
    };

    const handleImprimirRascunho = () => {

        let conteudo: any;

        if (!mostrarVerso) {
            conteudo = document.getElementById('certidao');
            if (!conteudo) {
                toast.error("Div de certidão não encontrada.");
            }
        } else {
            conteudo = document.getElementById('certidao-verso');
            if (!conteudo) {
                toast.error("Div de certidão não encontrada.");
            }
        }

        const janela = window.open('', '', 'width=800,height=600');
        if (!janela) {
            toast.error("Não foi possível abrir a janela de impressão.");
            return;
        }

        janela.document.write(`
        <html>
            <head>
                <title>Impressão da Certidão</title>
                <style>
                    @media print {
                        body {
                            margin: 0;
                            padding: 0;
                        }
                        .a4-sheet {
                            width: 210mm;
                            height: 297mm;
                            margin: auto;
                            box-sizing: border-box;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="a4-sheet">
                    ${conteudo.innerHTML}
                </div>
            </body>
        </html>
    `);
        janela.document.close();
        janela.focus();
        janela.print();
        janela.close();
    };

    // Gera o estilo dinâmico baseado no estado
    const qrStyle = getQrCodeStyle(qrCodePosition, qrCodeSize);

    const commonInputClass = "mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]";

    return (
        <>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-8">
                <h2 className="text-xl font-semibold text-[#4a4e51] border-b pb-4">Etapa 2: Emissão</h2>

                <div id='pre-visualizacao-certidao'>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pré-visualização da Certidão ({mostrarVerso ? 'Verso da Certidão' : 'Frente da Certidão'})</label>
                    <div className="a4-container">
                        {/* --- Nova Estrutura de Renderização --- */}
                        {!mostrarVerso ? (

                            <div id='certidao' className="a4-sheet" style={{ position: 'relative' }}> {/* 1. Contêiner de posicionamento */}

                                {/* 2. Conteúdo da certidão (intocado) */}
                                <div dangerouslySetInnerHTML={{ __html: textoCertidao }} />

                                {/* 3. QR Code renderizado separadamente, mas dentro do contêiner */}
                                {selo && (
                                    <div style={qrStyle}>
                                        {modeloSelo === 'qr' && qrCodeUrl && (
                                            <img
                                                src={qrCodeUrl}
                                                alt="QR Code"
                                                style={{
                                                    width: `${qrCodeSize}px`,
                                                    height: `${qrCodeSize}px`,
                                                }}
                                            />
                                        )}

                                        {modeloSelo === 'qr-numero' && qrCodeUrl && (
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                                fontFamily: 'Arial, sans-serif',
                                                fontSize: '12pt',
                                            }}>
                                                <img
                                                    src={qrCodeUrl}
                                                    alt="QR Code"
                                                    style={{
                                                        width: `${qrCodeSize}px`,
                                                        height: `${qrCodeSize}px`,
                                                    }}
                                                />
                                                <span style={{ fontWeight: 'bold' }}>{selo}</span>
                                            </div>
                                        )}

                                        {modeloSelo === 'qr-texto-lado' && qrCodeUrl && (
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: '12px',
                                                fontFamily: 'Arial, sans-serif',
                                                fontSize: '10pt',
                                                lineHeight: 1.4,
                                                maxWidth: '220px',
                                            }}>
                                                <img
                                                    src={qrCodeUrl}
                                                    alt="QR Code"
                                                    style={{
                                                        width: `${qrCodeSize}px`,
                                                        height: `${qrCodeSize}px`,
                                                    }}
                                                />
                                                <span>
                                                    Consulte este selo em:<br />
                                                    <strong>https://see.tjgo.jus.br/buscas?codigo_selo={selo}</strong>
                                                </span>
                                            </div>
                                        )}

                                        {modeloSelo === 'qr-texto-abaixo' && qrCodeUrl && (
                                            <div style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                textAlign: 'center',
                                                fontFamily: 'Arial, sans-serif',
                                                fontSize: '10pt',
                                                lineHeight: 1.4,
                                                marginTop: '4px',
                                            }}>
                                                <img
                                                    src={qrCodeUrl}
                                                    alt="QR Code"
                                                    style={{
                                                        width: `${qrCodeSize}px`,
                                                        height: `${qrCodeSize}px`,
                                                        marginBottom: '6px',
                                                    }}
                                                />
                                                <div>
                                                    Consulte este selo em:<br />
                                                    <strong>https://see.tjgo.jus.br/buscas?codigo_selo={selo}</strong>
                                                </div>
                                            </div>
                                        )}

                                        {modeloSelo === 'numero' && (
                                            <div style={{
                                                fontFamily: 'Arial, sans-serif',
                                                fontSize: '14pt',
                                                fontWeight: 'bold',
                                                textAlign: 'center',
                                            }}>
                                                {selo}
                                            </div>
                                        )}
                                    </div>
                                )}

                            </div>
                        ) : (
                            <div id='certidao-verso' className="a4-sheet-verso" style={{ position: 'relative' }}>
                                <div dangerouslySetInnerHTML={{ __html: textoCertidaoVerso }} />

                                {selo && selarVerso === 'true' && (
                                    <div style={qrStyle}>
                                        {modeloSelo === 'qr' && qrCodeUrl && (
                                            <img
                                                src={qrCodeUrl}
                                                alt="QR Code"
                                                style={{
                                                    width: `${qrCodeSize}px`,
                                                    height: `${qrCodeSize}px`,
                                                    marginBottom: '15mm',
                                                }}
                                            />
                                        )}

                                        {modeloSelo === 'qr-numero' && qrCodeUrl && (
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                                fontFamily: 'Arial, sans-serif',
                                                fontSize: '12pt',
                                                marginBottom: '15mm',
                                            }}>
                                                <img
                                                    src={qrCodeUrl}
                                                    alt="QR Code"
                                                    style={{
                                                        width: `${qrCodeSize}px`,
                                                        height: `${qrCodeSize}px`,
                                                    }}
                                                />
                                                <span style={{ fontWeight: 'bold' }}>{selo}</span>
                                            </div>
                                        )}

                                        {modeloSelo === 'qr-texto-lado' && qrCodeUrl && (
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: '12px',
                                                fontFamily: 'Arial, sans-serif',
                                                fontSize: '10pt',
                                                lineHeight: 1.4,
                                                maxWidth: '220px',
                                                marginBottom: '15mm',
                                            }}>
                                                <img
                                                    src={qrCodeUrl}
                                                    alt="QR Code"
                                                    style={{
                                                        width: `${qrCodeSize}px`,
                                                        height: `${qrCodeSize}px`,
                                                    }}
                                                />
                                                <span>
                                                    Consulte este selo em:<br />
                                                    <strong>https://see.tjgo.jus.br/buscas?codigo_selo={selo}</strong>
                                                </span>
                                            </div>
                                        )}

                                        {modeloSelo === 'qr-texto-abaixo' && qrCodeUrl && (
                                            <div style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                textAlign: 'center',
                                                fontFamily: 'Arial, sans-serif',
                                                fontSize: '10pt',
                                                lineHeight: 1.4,
                                                marginTop: '4px',
                                                marginBottom: '15mm',
                                            }}>
                                                <img
                                                    src={qrCodeUrl}
                                                    alt="QR Code"
                                                    style={{
                                                        width: `${qrCodeSize}px`,
                                                        height: `${qrCodeSize}px`,
                                                        marginBottom: '6px',
                                                    }}
                                                />
                                                <div>
                                                    Consulte este selo em:<br />
                                                    <strong>https://see.tjgo.jus.br/buscas?codigo_selo={selo}</strong>
                                                </div>
                                            </div>
                                        )}

                                        {modeloSelo === 'numero' && (
                                            <div style={{
                                                fontFamily: 'Arial, sans-serif',
                                                fontSize: '14pt',
                                                fontWeight: 'bold',
                                                textAlign: 'center',
                                                marginBottom: '15mm',
                                            }}>
                                                {selo}
                                            </div>
                                        )}
                                    </div>
                                )}

                            </div>
                        )}
                    </div>
                </div>

                <button
                    onClick={() => setMostrarVerso(!mostrarVerso)}
                    className="text-sm text-[#dd6825] hover:underline flex items-center justify-center gap-1 w-full"
                >
                    {mostrarVerso ? 'Ver Frente da Certidão' : 'Ver Verso da Certidão'}
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-300">
                        <h4 className="font-semibold text-gray-700 mb-4">Ações do Documento</h4>
                        <div className="flex flex-col gap-3">
                            <button onClick={() => { /* ... */ }} className="flex-1 flex items-center justify-center gap-2 text-sm bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100">
                                <Eye size={16} /> Visualizar Impressão
                            </button>
                            <button onClick={handleImprimirRascunho} className="flex-1 flex items-center justify-center gap-2 text-sm bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100">
                                <Printer size={16} /> Imprimir Certidão ({mostrarVerso ? 'Verso' : 'Frente'})
                            </button>
                        </div>
                    </div>
                    
                    {/* ALTERADO: Estilo da seção de selagem */}
                    <div className="p-4 bg-[#dd6825]/10 border border-[#dd6825]/30 rounded-lg">
                        <h4 className="font-semibold text-[#c25a1f] mb-4">Selagem da Certidão</h4>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="qr-size" className="flex items-center gap-2 text-sm font-medium text-gray-700"><Scaling size={14} /> Tamanho do selo (px)</label>
                                    <input id="qr-size" type="text" value={qrCodeSize} onChange={(e) => setQrCodeSize(Number(e.target.value))} className={commonInputClass} />
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
                            <div>
                                <label htmlFor="modelo-selo" className="flex items-center gap-2 text-sm font-medium text-gray-700">Modelo do Selo</label>
                                <select id="modelo-selo" value={modeloSelo} onChange={(e) => setModeloSelo(e.target.value)} className={commonInputClass}>
                                    <option value="qr">Somente QR Code</option>
                                    <option value="qr-numero">QR Code + Número</option>
                                    <option value="qr-texto-lado">QR Code + Texto (Lado)</option>
                                    <option value="qr-texto-abaixo">QR Code + Texto (Abaixo)</option>
                                    <option value="numero">Somente Número</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="selo-verso" className="flex items-center gap-2 text-sm font-medium text-gray-700">Selar Verso da Certidão?</label>
                                <select id="selo-verso" value={selarVerso} onChange={(e) => setSelarVerso(e.target.value)} className={commonInputClass}>
                                    <option value="false">Não</option>
                                    <option value="true">Sim</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Número do Selo Digital gerado</label>
                                <input type="text" readOnly value={selo || 'Aguardando selagem...'} className="mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm bg-gray-100 cursor-not-allowed" />
                            </div>
                            {/* ALTERADO: Cor do botão de selar */}
                            <button onClick={handleSelar} disabled={!!selo} className="w-full flex items-center justify-center gap-2 bg-[#dd6825] text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-[#c25a1f] disabled:bg-[#dd6825]/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dd6825]">
                                <Stamp size={18} /> Selar Certidão
                            </button>
                        </div>
                    </div>
                </div>

                <div className="text-right pt-6 flex items-center justify-end gap-4">
                    <button type="button" onClick={onVoltar} className="flex items-center gap-2 bg-gray-200 text-gray-800 font-semibold px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors">
                        <ArrowLeft size={18} /> Voltar
                    </button>
                    <button onClick={onConcluir} disabled={!selo} className="bg-green-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        Concluir Emissão
                    </button>
                </div>
            </div>

            {/* ATUALIZAÇÃO: Renderizando o novo modal de visualização */}
            <PreviewModal
                isOpen={isPreviewModalOpen}
                onClose={() => setIsPreviewModalOpen(false)}
                content={previewHtml}
                isVerso={mostrarVerso}
            />
        </>
    );
}