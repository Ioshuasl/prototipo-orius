import { useState, useEffect, useMemo } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Book, Settings, BarChart2, type LucideIcon, ChevronsLeft, ChevronsRight, Home, ChevronLeft, FileText, FilePlus2, BookOpen, PrinterIcon, StampIcon, FolderSyncIcon, SlidersHorizontal } from 'lucide-react';
import logo from '../../../assets/logo-orius-sidebar.png'

type UserRole = 'admin' | 'oficial' | 'escrevente';

const mockCurrentUser = {
    name: 'Usuário Ativo',
    role: 'admin' as UserRole, 
};

export interface SubMenuItem {
    label: string;
    path: string;
    roles?: UserRole[]; 
}

export interface MenuItemConfig {
    title: string;
    icon: LucideIcon;
    path?: string;
    subItems?: SubMenuItem[];
    roles?: UserRole[]; 
}

export const menuConfig: MenuItemConfig[] = [
    {
        title: 'Início',
        icon: Home,
        path:'/home'
    },
    {
        title: 'Dashboard',
        icon: BarChart2,
        path: 'dashboard',
        roles: ['admin', 'oficial']
    },
    {
        title: 'Registros',
        icon: Book,
        roles: ['admin', 'oficial', 'escrevente'],
        subItems: [
            { label: 'Nascimento', path: 'nascimento' },
            { label: 'Casamento', path: 'casamento' },
            { label: 'Óbito', path: 'obito' },
            { label: 'Natimorto', path: 'natimorto' },
            { label: 'Livro E', path: 'livro-e', roles: ['admin', 'oficial'] },
        ]
    },
    {
        title: 'Certidões',
        icon: FileText,
        path: 'certidoes',
        roles: ['admin', 'oficial', 'escrevente']
    },
    {
        title: 'Averbações',
        icon: FilePlus2,
        path: 'averbacoes',
        roles: ['admin', 'oficial', 'escrevente']
    },
    {
        title: 'Selo Avulso',
        icon: StampIcon,
        path:'selo-avulso'
    },
    {
        title: 'Livros',
        icon: BookOpen,
        path: 'livros',
        roles: ['admin', 'oficial'],
    },
    {
        title: 'Integrações',
        icon: FolderSyncIcon,
        subItems: [
            { label: 'CRC', path: 'integracoes/crc'},
            { label: 'SIRC', path: 'integracoes/sirc'}
        ]
    },
    {
        title: 'Impressões',
        icon: PrinterIcon,
        subItems: [
            { label: 'Livro de Protocolo', path: 'impressao/livro-protocolo'},
            { label: 'Relatório de Atividades', path: 'impressao/relatorio-atividades'}
        ]
    },
    {
        title: 'Configurações',
        icon: Settings,
        roles: ['admin'],
        subItems: [
            { label: 'Cartório', path: 'config/cartorio' },
            { label: 'Certidão', path: 'config/certidao' },
            { label: 'Averbação', path: 'config/averbacao' },
            { label: 'Pessoas Cadastradas', path: 'config/pessoas'},
            { label: 'Usuários', path: 'config/users'},
            { label: 'Cargo e Permissões', path: 'config/roles-permissions'},
            { label: 'Cabeçalhos e Rodapés', path: 'config/templates-cabecalho-rodape'},
            { label: 'Recibo', path: 'config/recibo'},
            { label: 'Emolumentos', path: 'config/emolumentos'},
            { label: 'Integrações', path: 'config/integracoes'}
        ]
    },
    {
        title: 'Parâmetros do Sistema',
        icon: SlidersHorizontal,
        path: 'parametros'
    }
];

interface SidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

interface DirectLinkMenuItemProps {
    item: MenuItemConfig;
    isCollapsed: boolean;
}

function DirectLinkMenuItem({ item, isCollapsed }: DirectLinkMenuItemProps) {
    const activeClass = "bg-white/10 text-[#eb6b22]"; 
    const defaultClass = "text-gray-300 hover:bg-white/10 hover:text-white"; 

    return (
        <li>
            <NavLink
                to={item.path!}
                className={({ isActive }) =>
                    `flex items-center p-3 rounded-md transition-colors group relative ${isActive ? activeClass : defaultClass} ${isCollapsed ? 'justify-center' : ''}`
                }
            >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className={`font-semibold ml-3 transition-opacity whitespace-nowrap ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>{item.title}</span>
                {isCollapsed && (
                    <div className="absolute left-full ml-4 px-2 py-1 bg-black/80 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        {item.title}
                    </div>
                )}
            </NavLink>
        </li>
    );
}

// --- SUB-COMPONENTE PARA ITENS COM SUBMENU (ACCORDION) ---
interface AccordionMenuItemProps {
    item: MenuItemConfig;
    isOpen: boolean;
    isCollapsed: boolean;
    onToggle: () => void;
}

function AccordionMenuItem({ item, isOpen, isCollapsed, onToggle }: AccordionMenuItemProps) {
    // ALTERADO: Cor do sub-item ativo usando o HEX do Laranja Orius diretamente.
    const activeSubItemClass = "bg-[#f3743b]/80 text-white";
    const defaultSubItemClass = "hover:bg-white/10";
    const location = useLocation();

    const isParentActive = item.subItems?.some(subItem => location.pathname.includes(subItem.path));

    return (
        <li>
            <button
                onClick={!isCollapsed ? onToggle : undefined}
                aria-expanded={isOpen && !isCollapsed}
                className={`w-full flex items-center p-3 rounded-md hover:bg-white/10 transition-colors group relative ${isCollapsed ? 'justify-center' : 'justify-between'} ${isParentActive && !isOpen ? 'bg-white/5' : ''}`}
            >
                <div className="flex items-center overflow-hidden">
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <h3 className={`font-semibold ml-3 whitespace-nowrap transition-opacity ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>{item.title}</h3>
                </div>
                {!isCollapsed && (
                    <ChevronLeft className={`h-5 w-5 transition-transform duration-300 flex-shrink-0 ${isOpen ? '-rotate-90' : ''}`} />
                )}
                {isCollapsed && (
                    <div className="absolute left-full ml-4 px-2 py-1 bg-black/80 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        {item.title}
                    </div>
                )}
            </button>
            <div className={`grid overflow-hidden transition-all duration-300 ease-in-out ${isOpen && !isCollapsed ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <ul className="pl-8 pr-2 mt-2 space-y-1 relative">
                        {item.subItems!.map(subItem => (
                            <li key={subItem.label}>
                                <NavLink
                                    to={subItem.path}
                                    className={({ isActive }) =>
                                        `relative font-semibold block p-2 text-sm rounded-md transition-colors ${isActive ? activeSubItemClass : defaultSubItemClass}`
                                    }
                                >
                                    {subItem.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </li>
    );
}

// --- COMPONENTE PRINCIPAL DA SIDEBAR ---
export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
    const [openItemTitle, setOpenItemTitle] = useState<string | null>(null);
    const [isHoverExpanded, setIsHoverExpanded] = useState(false);
    
    const location = useLocation();
    const isVisuallyExpanded = !isCollapsed || isHoverExpanded;

    const filteredMenu = useMemo(() => {
        const userRole = mockCurrentUser.role;
        return menuConfig.map(item => {
            if (item.roles && !item.roles.includes(userRole)) {
                return null;
            }
            if (item.subItems) {
                const visibleSubItems = item.subItems.filter(subItem => 
                    !subItem.roles || subItem.roles.includes(userRole)
                );
                if (visibleSubItems.length === 0) {
                    return null;
                }
                return { ...item, subItems: visibleSubItems };
            }
            return item;
        }).filter(Boolean) as MenuItemConfig[];
    }, [mockCurrentUser.role]);


    useEffect(() => {
        if (isVisuallyExpanded) {
            const currentItem = filteredMenu.find(item => 
                item.subItems?.some(subItem => location.pathname.startsWith(subItem.path))
            );
            if (currentItem) {
                setOpenItemTitle(currentItem.title);
            }
        }
    }, [location.pathname, isVisuallyExpanded, filteredMenu]);

    useEffect(() => {
        if (isCollapsed) {
            setOpenItemTitle(null);
        }
    }, [isCollapsed]);

    const handleToggleAccordion = (title: string) => {
        setOpenItemTitle(prevTitle => (prevTitle === title ? null : title));
    };

    const handleMouseEnter = () => {
        if (isCollapsed) {
            setIsHoverExpanded(true);
        }
    };

    const handleMouseLeave = () => {
        setIsHoverExpanded(false);
    };

    return (
        <aside 
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`bg-[#343c40] text-white p-4 flex flex-col h-screen fixed top-0 left-0 z-20 transition-all duration-300 ease-in-out ${isVisuallyExpanded ? 'w-[250px]' : 'w-20'}`}
        >
            <div className="flex-shrink-0 mb-6">
                <Link to="/home" className={`flex items-center gap-2 text-white hover:text-gray-300 ${!isVisuallyExpanded ? 'justify-center' : 'justify-center'}`}>
                    <img src={logo} alt="Orius Logo" className="flex-shrink-0"/>
                </Link>
            </div>
            
            <nav className={`flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-hide ${isVisuallyExpanded ? 'pr-2' : ''}`}>
                <ul className="space-y-2">
                    {filteredMenu.map(item => {
                        if (item.subItems) {
                            return (
                                <AccordionMenuItem 
                                    key={item.title} 
                                    item={item}
                                    isOpen={openItemTitle === item.title}
                                    isCollapsed={!isVisuallyExpanded}
                                    onToggle={() => handleToggleAccordion(item.title)} 
                                />
                            );
                        }
                        return (
                            <DirectLinkMenuItem 
                                key={item.title} 
                                item={item}
                                isCollapsed={!isVisuallyExpanded}
                            />
                        );
                    })}
                </ul>
            </nav>

            <div className="pt-4 mt-4">
                <button 
                    onClick={onToggle}
                    className="w-full flex items-center p-3 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                    <div className="flex-shrink-0">
                        {isCollapsed ? <ChevronsRight className="h-5 w-5" /> : <ChevronsLeft className="h-5 w-5" />}
                    </div>
                    <span className={`font-semibold ml-3 whitespace-nowrap transition-opacity duration-200 ${!isVisuallyExpanded ? 'opacity-0' : 'opacity-100'}`}>
                        {isCollapsed ? 'Expandir' : 'Recolher'}
                    </span>
                </button>
            </div>
        </aside>
    );
}