/**
 * Responsive stylesheet utility for device-specific styling.
 *
 * Automatically selects the appropriate stylesheet (mobile or desktop)
 * based on device screen dimensions.
 */
import { Dimensions } from "react-native";
import { cssStyle as desktopStyles } from "./desktop";
import { cssStyle as generalStyles } from "./general";
import { cssStyle as phoneStyles } from "./phone";
import { ConsistentStyles, ResponsiveStyles } from "./theme";

// Device breakpoint
const MOBILE_MAX_WIDTH = 768;

/**
 * Get the appropriate stylesheet based on current device dimensions
 */
export const getResponsiveStyles: () => ResponsiveStyles & ConsistentStyles = () => {
    const { width } = Dimensions.get("window");

    if (width <= MOBILE_MAX_WIDTH) {
        return { ...phoneStyles, ...generalStyles };
    } else {
        return { ...desktopStyles, ...generalStyles };
    }
};

// Export the responsive styles as default (for backwards compatibility)
export const cssStyle = getResponsiveStyles();
