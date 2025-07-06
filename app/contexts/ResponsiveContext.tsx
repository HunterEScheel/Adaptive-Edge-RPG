import { getResponsiveStyles } from "@/app/styles/responsive";
import { ConsistentStyles, ResponsiveStyles } from "@/app/styles/theme";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { TextStyle, useWindowDimensions, ViewStyle } from "react-native";

// Combined type for all styles
export type CompleteStyles = ResponsiveStyles & ConsistentStyles;

interface ResponsiveContextType {
    styles: CompleteStyles;
    isMobile: boolean;
    isDesktop: boolean;
    // Helper function to get responsive style based on device
    responsiveStyle: <T extends ViewStyle | TextStyle>(mobile: T, desktop?: T) => T;
}

const ResponsiveContext = createContext<ResponsiveContextType | undefined>(undefined);

export const ResponsiveProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { width } = useWindowDimensions();
    const [styles, setStyles] = useState<CompleteStyles>(() => getResponsiveStyles());
    const [isMobile, setIsMobile] = useState(width <= 1000);
    const [isDesktop, setIsDesktop] = useState(width > 1000);

    // Handle window resize
    useEffect(() => {
        const newStyles = getResponsiveStyles();
        setStyles(newStyles);
        setIsMobile(width <= 1000);
        setIsDesktop(width > 1000);
    }, [width]);

    // Helper function to get responsive style based on device
    const responsiveStyle = <T extends ViewStyle | TextStyle>(mobile: T, desktop: T = mobile): T => {
        return isMobile ? mobile : desktop;
    };

    const value = {
        styles,
        isMobile,
        isDesktop,
        responsiveStyle,
    };

    return <ResponsiveContext.Provider value={value}>{children}</ResponsiveContext.Provider>;
};

export const useResponsive = (): ResponsiveContextType => {
    const context = useContext(ResponsiveContext);
    if (!context) {
        throw new Error("useResponsive must be used within a ResponsiveProvider");
    }
    return context;
};

// Convenience hook that just returns the styles
export const useResponsiveStyles = (): CompleteStyles => {
    const { styles } = useResponsive();
    return styles;
};
