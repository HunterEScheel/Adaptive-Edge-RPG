import React from 'react';
import { useResponsive } from '@/app/contexts/ResponsiveContext';

interface ResponsiveComponentProps<T> {
    DesktopComponent: React.ComponentType<T>;
    MobileComponent: React.ComponentType<T>;
}

export function createResponsiveComponent<T extends {}>(
    DesktopComponent: React.ComponentType<T>,
    MobileComponent: React.ComponentType<T>
) {
    return function ResponsiveComponent(props: T) {
        const { isDesktop } = useResponsive();
        
        if (isDesktop) {
            return <DesktopComponent {...props} />;
        }
        
        return <MobileComponent {...props} />;
    };
}

// Utility component for inline responsive rendering
export function ResponsiveView<T extends {}>({ 
    desktop, 
    mobile, 
    ...props 
}: ResponsiveComponentProps<T> & T) {
    const { isDesktop } = useResponsive();
    
    const Component = isDesktop ? desktop : mobile;
    return <Component {...props} />;
}