import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface MainLayoutProps {
    children?: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
    return (
        <div className="flex min-h-screen bg-[var(--color-bg-primary)] font-[var(--font-secondary)]">
            <Sidebar />
            <Header />

            <main
                className="flex-1 p-8 mt-[var(--header-height)] ml-[var(--sidebar-width)] transition-all duration-300 overflow-x-hidden"
            >
                <div className="max-w-[1600px] mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
