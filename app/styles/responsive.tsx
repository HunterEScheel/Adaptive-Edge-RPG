/**
 * Responsive stylesheet utility for device-specific styling.
 *
 * Automatically selects the appropriate stylesheet (phone, tablet, desktop)
 * based on device screen dimensions.
 */
import { Dimensions } from "react-native";
import { cssStyle as desktopStyles } from "./desktop";
import { cssStyle as generalStyles } from "./general";
import { cssStyle as phoneStyles } from "./phone";
import { cssStyle as tabletStyles } from "./tablet";
import { ConsistentStyles, ResponsiveStyles } from "./theme";

// Device breakpoints
const PHONE_MAX_WIDTH = 480;
const TABLET_MAX_WIDTH = 1024;

/**
 * Get the appropriate stylesheet based on current device dimensions
 */
export const getResponsiveStyles: () => ResponsiveStyles & ConsistentStyles = () => {
    const { width } = Dimensions.get("window");

    if (width <= PHONE_MAX_WIDTH) {
        return { ...phoneStyles, ...generalStyles };
    } else if (width <= TABLET_MAX_WIDTH) {
        return { ...tabletStyles, ...generalStyles };
    } else {
        return { ...desktopStyles, ...generalStyles };
    }
};

/**
 * Hook to get responsive styles that updates when dimensions change
 */
export const useResponsiveStyles = () => {
    return getResponsiveStyles();
};

// Export the responsive styles as default
export const cssStyle = getResponsiveStyles();
