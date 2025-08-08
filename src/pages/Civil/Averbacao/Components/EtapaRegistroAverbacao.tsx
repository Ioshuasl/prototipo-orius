import { useState } from 'react';
import { toast } from 'react-toastify';
import QRCode from 'qrcode';
import { ArrowLeft, CheckCircle, Printer, ShieldCheck, HelpCircle, Move, Scaling, Eye } from 'lucide-react';
import { selo_teste } from '../../lib/Constants';
import { type ProcessoAverbacaoState } from '../EmissaoAverbacao';
import InfoModal from '../../Components/InfoModal';
import { infoFormatoAverbacao } from '../../lib/contextualInfo';
import PreviewModal from './PreviewModal';
import MainEditor from '../../../Components/MainEditor';

// --- Funções e Lógica (Inalteradas) ---
const getQrCodeStyle = (position: string, size: number): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
        position: 'absolute',
        width: `${size}px`,
        textAlign: 'center',
        pointerEvents: 'none',
    };

    switch (position) {
        case 'bottom-right':
            return { ...baseStyle, bottom: '15mm', right: '9mm' };
        case 'bottom-left':
        default:
            return { ...baseStyle, bottom: '15mm', left: '7mm' };
    }
};

interface EtapaRegistroAverbacaoProps {
    processo: ProcessoAverbacaoState;
    onConcluir: () => void;
    onVoltar: () => void;
}

const mmToPixels = (mm: number): number => {
    return (mm / 25.4) * 96;
};

export default function EtapaRegistroAverbacao({ processo, onConcluir, onVoltar }: EtapaRegistroAverbacaoProps) {
    const { textoAverbacao } = processo;
    const [seloAto, setSeloAto] = useState<string | null>(null);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [modeloSelo, setModeloSelo] = useState('qr');
    const [qrCodeSize, setQrCodeSize] = useState(40);
    const [qrCodePosition, setQrCodePosition] = useState('bottom-left');
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [previewHtml, setPreviewHtml] = useState('');
    const [editorContent, setEditorContent] = useState(textoAverbacao);
    const [margins, setMargins] = useState({ top: '1.5', bottom: '1.5', left: '1.0', right: '1.0' });
    const [size, setSize] = useState({ width: mmToPixels(210), height: mmToPixels(150) });

    const handleConfirmarRegistro = async () => {
        if (seloAto) return toast.warn("Este ato de averbação já foi confirmado.");
        try {
            const novoSelo = selo_teste;
            const urlConsulta = `https://see.tjgo.jus.br/buscas?codigo_selo=${novoSelo}`;
            const qrCodeDataUrl = await QRCode.toDataURL(urlConsulta, { width: qrCodeSize, margin: 1 });
            setQrCodeUrl(qrCodeDataUrl);
            setSeloAto(novoSelo);
            toast.success("Averbação confirmada e selo do ato gerado!");
        } catch (err) {
            toast.error("Falha ao gerar o QR Code. Verifique o console.");
        }
    };

    const handleImprimirEtiqueta = () => {
        const conteudo = document.getElementById('etiqueta-averbacao-preview');
        if (!conteudo) return toast.error("Conteúdo da etiqueta não encontrado.");
        const janela = window.open('', '', 'width=400,height=300');
        if (!janela) return toast.error("Não foi possível abrir a janela de impressão.");
        janela.document.write(`<html><head><title>Imprimir Etiqueta</title><style>@media print { @page { size: 90mm 50mm; margin: 3mm; } body { margin: 0; } } body { font-family: Arial, sans-serif; font-size: 8pt; }</style></head><body>${conteudo.innerHTML}</body></html>`);
        janela.document.close();
        janela.focus();
        janela.print();
        janela.close();
    };

    const handlePreview = () => {
        const div = document.getElementById('etiqueta-averbacao-preview');
        if (div) {
            setPreviewHtml(div.innerHTML);
            setIsPreviewModalOpen(true);
        } else {
            toast.error("Não foi possível encontrar o conteúdo da etiqueta.");
        }
    };

    const qrStyle = getQrCodeStyle(qrCodePosition, qrCodeSize);

    // ALTERADO: Estilos de formulário centralizados
    const commonInputClass = "mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#dd6825]/50 focus:border-[#dd6825]";

    return (
        <>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-8">
                {/* ALTERADO: Cor do título da etapa */}
                <h2 className="text-xl font-semibold text-[#4a4e51] border-b pb-4">Etapa 2: Revisão e Registro do Termo</h2>

                <div className="flex flex-col gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <label className="block text-sm font-medium text-gray-700">Pré-visualização do Termo de Averbação</label>
                            {/* ALTERADO: Cor do botão de ajuda */}
                            <button onClick={() => setIsInfoModalOpen(true)} className="text-[#dd6825] hover:text-[#c25a1f]">
                                <HelpCircle size={16} />
                            </button>
                        </div>
                        <div
                            id="etiqueta-averbacao-preview"
                            className="flex justify-center"
                        >
                            <MainEditor
                                initialValue={editorContent}
                                onEditorChange={(content) => setEditorContent(content)}
                                margins={margins}
                                size={size}
                            />

                            {/* QR CODE POSICIONADO DINAMICAMENTE */}
                            {seloAto && (
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
                                            <span style={{ fontWeight: 'bold' }}>{seloAto}</span>
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
                                                <strong>https://see.tjgo.jus.br/buscas?codigo_selo={seloAto}</strong>
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
                                                <strong>https://see.tjgo.jus.br/buscas?codigo_selo={seloAto}</strong>
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
                                            {seloAto}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-300 h-fit">
                            <h4 className="font-semibold text-gray-700 mb-4">Ações do Documento</h4>
                            <div className="flex flex-col gap-3">
                                <button onClick={handlePreview} className="flex-1 flex items-center justify-center gap-2 text-sm bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100">
                                    <Eye size={16} /> Visualizar Impressão
                                </button>
                                <button onClick={handleImprimirEtiqueta} className="flex-1 flex items-center justify-center gap-2 text-sm bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100">
                                    <Printer size={16} /> Imprimir Etiqueta
                                </button>
                            </div>
                        </div>

                        {/* ALTERADO: Estilo da seção de selagem */}
                        <div className="p-4 bg-[#dd6825]/10 border border-[#dd6825]/30 rounded-lg">
                            <h4 className="font-semibold text-[#c25a1f] mb-4">Selagem da Averbação</h4>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="qr-size" className="flex items-center gap-2 text-sm font-medium"><Scaling size={14} /> Tamanho (px)</label>
                                        <input id="qr-size" type="number" value={qrCodeSize} onChange={(e) => setQrCodeSize(Number(e.target.value))} className={commonInputClass} />
                                    </div>
                                    <div>
                                        <label htmlFor="qr-pos" className="flex items-center gap-2 text-sm font-medium"><Move size={14} /> Posição</label>
                                        <select id="qr-pos" value={qrCodePosition} onChange={(e) => setQrCodePosition(e.target.value)} className={commonInputClass}>
                                            <option value="bottom-left">Inferior Esquerdo</option>
                                            <option value="bottom-right">Inferior Direito</option>
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
                                    <label className="block text-sm font-medium">Número do Selo gerado</label>
                                    <input type="text" readOnly value={seloAto || 'Aguardando confirmação...'} className="mt-1 w-full p-2 border rounded-md bg-gray-100 cursor-not-allowed" />
                                </div>
                                {/* ALTERADO: Cor do botão de confirmar */}
                                <button onClick={handleConfirmarRegistro} disabled={!!seloAto} className="w-full flex items-center justify-center gap-2 bg-[#dd6825] text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-[#c25a1f] disabled:bg-[#dd6825]/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dd6825]">
                                    <ShieldCheck size={18} /> Confirmar e Registrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-right pt-6 flex items-center justify-between">
                    <button type="button" onClick={onVoltar} className="flex items-center gap-2 bg-gray-200 text-gray-800 font-semibold px-6 py-3 rounded-lg hover:bg-gray-300">
                        <ArrowLeft size={18} /> Voltar
                    </button>
                    {/* ALTERADO: Estilo de foco no botão de avançar */}
                    <button onClick={onConcluir} disabled={!seloAto} className="flex items-center gap-2 bg-green-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        <CheckCircle size={18} /> Avançar para Pagamento
                    </button>
                </div>
            </div>

            <InfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} title={infoFormatoAverbacao.title}>
                {infoFormatoAverbacao.content}
            </InfoModal>

            <PreviewModal isOpen={isPreviewModalOpen} onClose={() => setIsPreviewModalOpen(false)} content={previewHtml} previewType="etiqueta" title="Visualização da Etiqueta de Averbação" />
        </>
    );
}