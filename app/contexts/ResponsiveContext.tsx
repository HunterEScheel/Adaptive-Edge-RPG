import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useWindowDimensions, ViewStyle } from 'react-native';
import { ResponsiveStylesheet } from '@/app/styles/theme';
import { cssStyle as phoneStyles } from '@/app/styles/phone';
import { cssStyle as tabletStyles } from '@/app/styles/tablet';
import { cssStyle as desktopStyles } from '@/app/styles/desktop';

// Re-export the ResponsiveStylesheet type for convenience
export type { ResponsiveStylesheet } from '@/app/styles/theme';

interface ResponsiveContextType {
  styles: ResponsiveStylesheet;
  isPhone: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  // Helper function to get responsive style based on device
  responsiveStyle: <T extends ViewStyle>(
    phone: T,
    tablet?: T,
    desktop?: T
  ) => T;
}

const ResponsiveContext = createContext<ResponsiveContextType | undefined>(undefined);

export const ResponsiveProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { width } = useWindowDimensions();
  const [styles, setStyles] = useState<ResponsiveStylesheet>(() => getResponsiveStyles(width));
  const [isPhone, setIsPhone] = useState(width <= 480);
  const [isTablet, setIsTablet] = useState(width > 480 && width <= 1024);
  const [isDesktop, setIsDesktop] = useState(width > 1024);

  // Handle window resize
  useEffect(() => {
    const newStyles = getResponsiveStyles(width);
    setStyles(newStyles);
    setIsPhone(width <= 480);
    setIsTablet(width > 480 && width <= 1024);
    setIsDesktop(width > 1024);
  }, [width]);

  // Helper function to get responsive style based on device
  const responsiveStyle = <T extends ViewStyle>(
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

// Helper function to get styles based on width
function getResponsiveStyles(width: number): ResponsiveStylesheet {
  if (width <= 480) {
    return phoneStyles;
  } else if (width <= 1024) {
    return tabletStyles;
  } else {
    return desktopStyles;
  }
}
