import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useWindowDimensions, ViewStyle, TextStyle } from 'react-native';
import { ResponsiveStyles, ConsistentStyles } from '@/app/styles/theme';
import { getResponsiveStyles } from '@/app/styles/responsive';

// Combined type for all styles
export type CompleteStyles = ResponsiveStyles & ConsistentStyles;

interface ResponsiveContextType {
  styles: CompleteStyles;
  isMobile: boolean;
  isDesktop: boolean;
  // Helper function to get responsive style based on device
  responsiveStyle: <T extends ViewStyle | TextStyle>(
    mobile: T,
    desktop?: T
  ) => T;
}

const ResponsiveContext = createContext<ResponsiveContextType | undefined>(undefined);

export const ResponsiveProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { width } = useWindowDimensions();
  const [styles, setStyles] = useState<CompleteStyles>(() => getResponsiveStyles());
  const [isMobile, setIsMobile] = useState(width <= 768);
  const [isDesktop, setIsDesktop] = useState(width > 768);

  // Handle window resize
  useEffect(() => {
    const newStyles = getResponsiveStyles();
    setStyles(newStyles);
    setIsMobile(width <= 768);
    setIsDesktop(width > 768);
  }, [width]);

  // Helper function to get responsive style based on device
  const responsiveStyle = <T extends ViewStyle | TextStyle>(
    mobile: T,
    desktop: T = mobile
  ): T => {
    return isMobile ? mobile : desktop;
  };

  const value = {
    styles,
    isMobile,
    isDesktop,
    responsiveStyle,
  };

  return (
    <ResponsiveContext.Provider value={value}>
      {children}
    </ResponsiveContext.Provider>
  );
};

export const useResponsive = (): ResponsiveContextType => {
  const context = useContext(ResponsiveContext);
  if (!context) {
    throw new Error('useResponsive must be used within a ResponsiveProvider');
  }
  return context;
};

// Convenience hook that just returns the styles
export const useResponsiveStyles = (): CompleteStyles => {
  const { styles } = useResponsive();
  return styles;
};

