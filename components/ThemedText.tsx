import { Text, type TextProps } from "react-native";

import { useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextProps = TextProps & {
    lightColor?: string;
    darkColor?: string;
    type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({ style, lightColor, darkColor, type = "default", ...rest }: ThemedTextProps) {
    const cssStyle = useResponsiveStyles();
    const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

    return (
        <Text
            style={[
                { color },
                type === "default" ? cssStyle.themedTextDefault : undefined,
                type === "title" ? cssStyle.themedTextTitle : undefined,
                type === "defaultSemiBold" ? cssStyle.headerText : undefined,
                type === "subtitle" ? cssStyle.smallText : undefined,
                type === "link" ? cssStyle.themedTextLink : undefined,
                style,
            ]}
            {...rest}
        />
    );
}
