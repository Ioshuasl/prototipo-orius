import React from 'react';
import { HelpCircle } from 'lucide-react';

interface SectionHeaderProps {
    title: string;
    infoContent?: { title: string; content: React.ReactNode };
    onOpenInfoModal?: (title: string, content: React.ReactNode) => void;
}

export default function SectionHeader({ title, infoContent, onOpenInfoModal }: SectionHeaderProps) {
    return (
        <div className="flex items-center gap-2 mb-4 pb-2">
            <h4 className="font-bold text-gray-800">{title}</h4>
            {infoContent && onOpenInfoModal && (
                <button
                    type="button"
                    onClick={() => onOpenInfoModal(infoContent.title, infoContent.content)}
                    className="text-gray-400 hover:text-blue-500 transition-colors"
                    title={`Saber mais sobre ${infoContent.title}`}
                >
                    <HelpCircle size={18} />
                </button>
            )}
        </div>
    );
}