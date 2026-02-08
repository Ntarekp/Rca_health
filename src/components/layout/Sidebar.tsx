
import { LayoutDashboard, Users, Activity, FileText, Settings, ClipboardList } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: ClipboardList, label: 'Consultations', path: '/consultations' },
    { icon: Users, label: 'Students', path: '/students' },
    { icon: Activity, label: 'Lab & History', path: '/lab' },
    { icon: FileText, label: 'Reports', path: '/report' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen bg-[var(--color-bg-sidebar)] border-r border-[var(--color-border-light)] z-50 transition-all duration-300" style={{ width: 'var(--sidebar-width)' }}>
      <div className="flex items-center px-6 h-[var(--header-height)] border-b border-[var(--color-border-light)]">
        {/* Logo Placeholder - simplified for now */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-900 rounded-md flex items-center justify-center text-white font-bold">R</div>
          <div className="flex flex-col">
            <span className="font-semibold text-[14px] leading-tight text-[var(--color-primary)]">Rwanda Coding</span>
            <span className="font-semibold text-[14px] leading-tight text-[var(--color-primary)]">Academy</span>
          </div>
        </div>
      </div>

      <nav className="mt-6 px-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-[var(--radius-10)] text-[14px] font-medium transition-colors ${isActive(item.path)
              ? 'bg-[var(--color-primary)] text-[var(--color-text-on-primary)]'
              : 'text-[var(--color-text-secondary)] hover:bg-gray-100 hover:text-[var(--color-primary)]'
              }`}
          >
            <item.icon size={20} strokeWidth={isActive(item.path) ? 2.5 : 2} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
