import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useWindowDimensions, ViewStyle, TextStyle } from 'react-native';
import { ResponsiveStyles, ConsistentStyles } from '@/app/styles/theme';
import { getResponsiveStyles } from '@/app/styles/responsive';

// Combined type for all styles
export type CompleteStyles = ResponsiveStyles & ConsistentStyles;

interface ResponsiveContextType {
  styles: CompleteStyles;
  isPhone: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  // Helper function to get responsive style based on device
  responsiveStyle: <T extends ViewStyle | TextStyle>(
    phone: T,
    tablet?: T,
    desktop?: T
  ) => T;
}

const ResponsiveContext = createContext<ResponsiveContextType | undefined>(undefined);

export const ResponsiveProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { width } = useWindowDimensions();
  const [styles, setStyles] = useState<CompleteStyles>(() => getResponsiveStyles());
  const [isPhone, setIsPhone] = useState(width <= 480);
  const [isTablet, setIsTablet] = useState(width > 480 && width <= 1024);
  const [isDesktop, setIsDesktop] = useState(width > 1024);

  // Handle window resize
  useEffect(() => {
    const newStyles = getResponsiveStyles();
    setStyles(newStyles);
    setIsPhone(width <= 480);
    setIsTablet(width > 480 && width <= 1024);
    setIsDesktop(width > 1024);
  }, [width]);

  // Helper function to get responsive style based on device
  const responsiveStyle = <T extends ViewStyle | TextStyle>(
    phone: T,
    tablet: T = phone,
    desktop: T = tablet || phone
  ): T => {
    if (isPhone) return phone;
    if (isTablet) return tablet;
    return desktop;
  };

  const value = {
    styles,
    isPhone,
    isTablet,
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

