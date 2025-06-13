// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolViewProps, SymbolWeight } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, Text, View, type StyleProp, type TextStyle, type ViewStyle } from "react-native";

type IconMapping = Record<SymbolViewProps["name"], ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  "house.fill": "home",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "person.fill": "person",
  "bag.fill": "shopping-bag",
  sparkles: "auto-fix-high",
  "square.and.arrow.down": "save",
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({ name, size = 24, color, style }: { name: IconSymbolName; size?: number; color: string | OpaqueColorValue; style?: StyleProp<TextStyle>; weight?: SymbolWeight }) {
  // Check if the name exists in the mapping
  const iconName = MAPPING[name] || "help-outline"; // Fallback icon if mapping not found

  try {
    return <MaterialIcons color={color} size={size} name={iconName} style={style} />;
  } catch (error) {
    // Fallback in case of rendering error
    console.error("Error rendering icon:", error);
    return (
      <View style={[{ width: size, height: size, justifyContent: "center", alignItems: "center" } as ViewStyle, style as any]}>
        <Text style={{ color, fontSize: size / 2 }}>?</Text>
      </View>
    );
  }
}
