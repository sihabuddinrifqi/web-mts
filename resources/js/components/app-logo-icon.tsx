import { SVGAttributes } from 'react';

interface AppLogoIconProps extends SVGAttributes<HTMLImageElement> {
    className?: string;
}

export default function AppLogoIcon({ className }: AppLogoIconProps) {
    return <img src="/logo.png" alt="logo" className={`${className}`} />;
}
