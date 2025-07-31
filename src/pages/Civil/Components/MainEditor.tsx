import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

// 1. Define as propriedades que nosso componente vai receber
interface MainEditorProps {
    initialValue: string;
    onEditorChange: (content: string) => void;
    margins: {
        top: string;
        bottom: string;
        left: string;
        right: string;
    };
    size: {
        width: number;
        height: number;
    }
}

const MainEditor: React.FC<MainEditorProps> = ({ initialValue, onEditorChange, margins, size }) => {


    return (
        <Editor
            apiKey='sny4ncto4hf42akdz2eqss2tqd0loo439vfttpuydjc2kqpi'
            value={initialValue}
            onEditorChange={onEditorChange}
            init={{
                selector: 'textarea',
                width: size.width,
                height: size.height,
                menubar: false,
                browser_spellcheck: true,
                contextmenu: false,
                plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'fullscreen', 'insertdatetime',
                    'media', 'table', 'code', 'codesample', 'help', 'wordcount', 'autosave', 'quickbars',
                    'quickbars link', 'quickbars image editimage', 'pagebreak', 'nonbreaking', 'advlist', 'autolink'
                ],
                autosave_ask_before_unload: true,
                toolbar: 'undo redo styles removeformat  formatselect fontfamily fontsize forecolor link quickimage bold italic underline align bullist numlist outdent indent removeformat preview fullscreen searchreplace help code codesample quicktable pagebreak nonbreaking charmap customTemplates',
                formats: {
                    linhatopo: {
                        selector: 'div',
                        classes: 'borda-superior',
                    },
                    linhainferior: {
                        selector: 'div',
                        classes: 'borda-inferior',
                    }
                },

                style_formats: [
                    {
                        title: 'Estilos de Borda', items: [
                            { title: 'Linha Superior', format: 'linhatopo' },
                            { title: 'Linha Inferior', format: 'linhainferior' }
                        ]
                    }
                ],
                setup: (editor: any) => {
                    const customTemplates = [
                        {
                            title: 'Qualificação das Partes (Casamento)',
                            description: 'Insere o bloco de qualificação para contraentes.',
                            content: `<p><strong>QUALIFICAÇÃO DOS CONTRAENTES:</strong> Ele, brasileiro, solteiro, maior, [Profissão], portador da CI nº [RG], inscrito no CPF sob o nº [CPF], residente e domiciliado em [Endereço]. Ela, brasileira, solteira, maior, [Profissão], portadora da CI nº [RG], inscrita no CPF sob o nº [CPF], residente e domiciliada em [Endereço].</p><br>`
                        },
                        {
                            title: 'Cláusula de Regime de Bens',
                            description: 'Cláusula padrão de Comunhão Parcial de Bens.',
                            content: '<p>O regime de bens adotado é o da <strong>Comunhão Parcial de Bens</strong>, nos termos dos artigos 1.658 e seguintes do Código Civil brasileiro.</p><br>'
                        },
                        {
                            title: 'Cláusula de Encerramento (Selo)',
                            description: 'Texto final com espaço para o selo digital.',
                            content: '<p>O referido é verdade e dou fé. Emitida nesta data. Selo Digital de Fiscalização: [Número do Selo]</p>'
                        }
                    ];
                    editor.ui.registry.addMenuButton('customTemplates', {
                        text: 'Modelos', // O texto que aparecerá no botão
                        fetch: (callback: any) => {
                            const items = customTemplates.map(template => ({
                                type: 'menuitem',
                                text: template.title,
                                onAction: () => {
                                    // 3. Ação que acontece ao clicar no item do menu: insere o conteúdo
                                    editor.insertContent(template.content);
                                }
                            }));
                            callback(items);
                        }
                    });
                },
                quickbars_selection_toolbar: 'bold italic underline | fontfamily | fontsize | quicklink blockquote | quicklink',
                quickbars_insert_toolbar: 'bold italic underline fontfamily fontsize quicklink blockquote quicklink quickimage quicktable hr',
                quickbars_image_toolbar: 'alignleft aligncenter alignright | rotateleft rotateright | imageoptions',
                fontsize_formats: '4pt 5pt 6pt 7pt 8pt 9pt 10pt 12pt 14pt 16pt 18pt 20pt 22pt 24pt 26pt 28pt 30pt 32pt 34pt 36pt',
                font_family_formats: ` Times New Roman=Times New Roman, Times, serif; Arial=Arial, Helvetica, sans-serif; Calibri=Calibri, sans-serif; Courier New=Courier New, Courier, monospace; Georgia=Georgia, serif; Verdana=Verdana, Geneva, sans-serif;`,
                fullscreen_native: true,
                content_style: `
                  body {
                    font-family: 'Times New Roman', Times, serif;
                    font-size: 12pt;
                    background: #fff;
                    margin: ${margins.top}cm ${margins.right}cm ${margins.bottom}cm ${margins.left}cm;
                  }
                  .mce-pagebreak { /* Estiliza a linha da quebra de página no editor */
                    border-top: 1px dashed #bbb;
                    width: 100%;
                    margin-top: 15px;
                    cursor: default;
                  }

                  .borda-superior {
                    border-top: 1px solid #000;
                    padding-top: 5px;
                    margin-top: 5px;
                  }
                  .borda-inferior {
                    border-bottom: 1px solid #000;
                    padding-bottom: 5px;
                    margin-bottom: 5px;
                  }
                `
            }}
        />
    );
};

export default MainEditor;