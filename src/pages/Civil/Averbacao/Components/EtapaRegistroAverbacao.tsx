import { useState } from 'react';
import { toast } from 'react-toastify';
import QRCode from 'qrcode';
import { ArrowLeft, CheckCircle, Printer, ShieldCheck, HelpCircle, Move, Scaling, Eye } from 'lucide-react';
import { selo_teste } from '../../lib/Constants';
import { type ProcessoAverbacaoState } from '../EmissaoAverbacao';
import InfoModal from '../../Components/InfoModal';
import { infoFormatoAverbacao } from '../../lib/contextualInfo';
import PreviewModal from './PreviewModal';
import MainEditor from '../../Components/MainEditor';

const getQrCodeStyle = (position: string, size: number): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
        position: 'absolute',
        width: `${size}px`,
        textAlign: 'center',
        pointerEvents: 'none', // Permite interagir com o editor por baixo
    };

    switch (position) {
        case 'bottom-center':
            return { ...baseStyle, bottom: '5mm', left: '50%', transform: 'translateX(-50%)' };
        case 'bottom-right':
            return { ...baseStyle, bottom: '5mm', right: '5mm' };
        case 'bottom-left':
        default:
            return { ...baseStyle, bottom: '5mm', left: '5mm' };
    }
};


interface EtapaRegistroAverbacaoProps {
    processo: ProcessoAverbacaoState;
    onConcluir: () => void;
    onVoltar: () => void;
}

export default function EtapaRegistroAverbacao({ processo, onConcluir, onVoltar }: EtapaRegistroAverbacaoProps) {
    const { textoAverbacao } = processo;
    const [seloAto, setSeloAto] = useState<string | null>(null);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [qrCodeSize, setQrCodeSize] = useState(40); // Tamanho menor, ideal para etiquetas
    const [qrCodePosition, setQrCodePosition] = useState('bottom-left');
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [previewHtml, setPreviewHtml] = useState('');
    const [editorContent, setEditorContent] = useState(textoAverbacao); // Estado para o conteúdo do editor
    const [margins, setMargins] = useState({
        top: '1.5',
        bottom: '1.5',
        left: '1.0',
        right: '1.0',
    });
    const [size, setSize] = useState({
        width: 660,
        height: 540,
    });

    // Função para confirmar o registro e gerar o selo para o ato de averbação
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

    // Função para imprimir o termo, útil para anexar em livros físicos
    const handleImprimirEtiqueta = () => {
        const conteudo = document.getElementById('etiqueta-averbacao-preview');
        if (!conteudo) return toast.error("Conteúdo da etiqueta não encontrado.");

        const janela = window.open('', '', 'width=400,height=300');
        if (!janela) return toast.error("Não foi possível abrir a janela de impressão.");

        // Estilos de impressão para simular o tamanho da etiqueta
        janela.document.write(`
            <html><head><title>Imprimir Etiqueta de Averbação</title>
            <style>
                @media print {
                    @page { size: 90mm 50mm; margin: 3mm; }
                    body { margin: 0; }
                }
                body { font-family: Arial, sans-serif; font-size: 8pt; }
            </style>
            </head><body>${conteudo.innerHTML}</body></html>
        `);
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


    return (
        <>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-8">
                <h2 className="text-xl font-semibold text-green-700 border-b pb-4">Etapa 2: Revisão e Registro do Termo</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Coluna de Pré-visualização do Termo */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-2">
                            <label className="block text-sm font-medium text-gray-700">Pré-visualização do Termo de Averbação</label>
                            <button onClick={() => setIsInfoModalOpen(true)} className="text-blue-500 hover:text-blue-700">
                                <HelpCircle size={16} />
                            </button>
                        </div>
                        <div
                            id="etiqueta-averbacao-preview"
                            className="p-2 border rounded-md bg-gray-50 prose max-w-none overflow-hidden"
                            style={{
                                width: '180mm',
                                height: '150mm',
                                position: 'relative',
                                fontFamily: 'Arial, sans-serif',
                                fontSize: '8pt',
                                lineHeight: '1.4',
                                padding: '10px'
                            }}
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
                                    <img src={qrCodeUrl} alt="QR Code do Selo" style={{ width: `${qrCodeSize}px`, height: `${qrCodeSize}px` }} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Coluna de Ações */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h4 className="font-semibold text-blue-800 mb-4">Selagem da Averbação</h4>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="qr-size" className="flex items-center gap-2 text-sm font-medium"><Scaling size={14} /> Tamanho (px)</label>
                                        <input id="qr-size" type="number" value={qrCodeSize} onChange={(e) => setQrCodeSize(Number(e.target.value))} className="mt-1 w-full p-2 border rounded-md" />
                                    </div>
                                    <div>
                                        <label htmlFor="qr-pos" className="flex items-center gap-2 text-sm font-medium"><Move size={14} /> Posição</label>
                                        <select id="qr-pos" value={qrCodePosition} onChange={(e) => setQrCodePosition(e.target.value)} className="mt-1 w-full p-2 border rounded-md">
                                            <option value="bottom-left">Inferior Esquerdo</option>
                                            <option value="bottom-center">Inferior Central</option>
                                            <option value="bottom-right">Inferior Direito</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Número do Selo gerado</label>
                                    <input type="text" readOnly value={seloAto || 'Aguardando confirmação...'} className="mt-1 w-full p-2 border rounded-md bg-gray-100 cursor-not-allowed" />
                                </div>
                                <button onClick={handleConfirmarRegistro} disabled={!!seloAto} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 disabled:bg-blue-400">
                                    <ShieldCheck size={18} /> Confirmar e Registrar
                                </button>
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg border">
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
                    </div>
                </div>

                {/* Navegação */}
                <div className="text-right pt-6 border-t flex items-center justify-between">
                    <button type="button" onClick={onVoltar} className="flex items-center gap-2 bg-gray-200 text-gray-800 font-semibold px-6 py-3 rounded-lg hover:bg-gray-300">
                        <ArrowLeft size={18} /> Voltar
                    </button>
                    <button onClick={onConcluir} disabled={!seloAto} className="flex items-center gap-2 bg-green-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400">
                        <CheckCircle size={18} /> Avançar para Pagamento
                    </button>
                </div>
            </div>

            <InfoModal
                isOpen={isInfoModalOpen}
                onClose={() => setIsInfoModalOpen(false)}
                title={infoFormatoAverbacao.title}
            >
                {infoFormatoAverbacao.content}
            </InfoModal>

            <PreviewModal
                isOpen={isPreviewModalOpen}
                onClose={() => setIsPreviewModalOpen(false)}
                content={previewHtml}
                previewType="etiqueta" // <-- Adicione esta linha
                title="Visualização da Etiqueta de Averbação" // <-- Adicione esta linha
            />
        </>
    );
}