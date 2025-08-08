import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Components/Sidebar';

export default function RegistroImoveisLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <>
      <title>Orius | Registro de Imóveis </title>
      <div className="relative flex bg-gray-50 min-h-screen font-sans">

        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={handleToggleSidebar}
        />

        <main className={`flex-1 p-8 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'ml-20' : 'ml-[250px]'}`}>
          <div>
            <Outlet />
          </div>
        </main>

      </div>
    </>
  );
}