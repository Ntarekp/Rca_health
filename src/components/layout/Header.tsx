
import { Search, Bell, Settings } from 'lucide-react';

const Header = () => {
    return (
        <header className="fixed top-0 right-0 bg-[var(--color-bg-sidebar)] border-b border-[var(--color-border-light)] z-40 flex items-center justify-between px-8"
            style={{
                height: 'var(--header-height)',
                left: 'calc(var(--sidebar-width))',
                width: 'calc(100% - var(--sidebar-width))'
            }}>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" size={18} />
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-[var(--radius-20)] pl-10 pr-4 py-1.5 text-[14px] focus:ring-1 focus:ring-[var(--color-primary)] transition-shadow"
                    />
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4 ml-4">
                <button className="p-2 text-[var(--color-text-secondary)] hover:bg-gray-100 rounded-full transition-colors relative">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>
                <button className="p-2 text-[var(--color-text-secondary)] hover:bg-gray-100 rounded-full transition-colors">
                    <Settings size={20} />
                </button>
                {/* Profile Avatar could go here */}
            </div>
        </header>
    );
};

export default Header;
