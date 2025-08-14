import { Flower } from 'lucide-react';
// import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="text-sidebar-primary-foreground dark:bg-primary flex aspect-square size-8 items-center justify-center rounded-md">
                <img src="/logo.png" alt="logo" className={`w-28`} />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold">{import.meta.env.VITE_APP_NAME}</span>
            </div>
        </>
    );
}
