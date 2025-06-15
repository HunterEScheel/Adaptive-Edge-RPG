/**
 * Responsive stylesheet utility for device-specific styling.
 * 
 * This file provides backward compatibility with the old responsive system.
 * New components should use the ResponsiveContext instead.
 */
import { ResponsiveStylesheet } from "./theme";
import { useResponsive } from "../contexts/ResponsiveContext";

// Re-export the ResponsiveStylesheet type
export type { ResponsiveStylesheet } from "./theme";

/**
 * Hook to get responsive styles that updates when dimensions change
 * @deprecated Use useResponsive() from '../contexts/ResponsiveContext' instead
 */
export const useResponsiveStyles = (): ResponsiveStylesheet => {
  const { styles } = useResponsive();
  return styles;
};

/**
 * Default export for components that can't use hooks
 * @deprecated Use useResponsive() from '../contexts/ResponsiveContext' instead
 */
export const cssStyle: ResponsiveStylesheet = {
  // This is a fallback and won't update with screen size changes
  // Components should use the ResponsiveContext instead
  ...useResponsive().styles,
  
  // Add any additional properties that might be needed for backward compatibility
  container: {},
  centered: {},
  row: {},
  // Add other style properties as needed
} as ResponsiveStylesheet;
