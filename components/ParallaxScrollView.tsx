import type { PropsWithChildren, ReactElement } from "react";
import { View } from "react-native";
import Animated, { interpolate, useAnimatedRef, useAnimatedStyle, useScrollViewOffset } from "react-native-reanimated";

import { ThemedView } from "@/components/ThemedView";
import { useBottomTabOverflow } from "@/components/ui/TabBarBackground";
import { cssStyle } from "@/app/styles/responsive";

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
    headerImage: ReactElement;
    headerBackgroundColor: { dark: string; light: string };
}>;

export default function ParallaxScrollView({ children, headerImage, headerBackgroundColor }: Props) {
    // Simple implementation without try/catch to avoid syntax errors
    const colorScheme = "light";
    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const scrollOffset = useScrollViewOffset(scrollRef);
    const bottom = useBottomTabOverflow();
    const headerAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]),
                },
                {
                    scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
                },
            ],
        };
    });

    // Simplified return statement without try/catch
    return (
        <ThemedView style={cssStyle.parallaxContainer}>
            <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16} scrollIndicatorInsets={{ bottom }} contentContainerStyle={{ paddingBottom: bottom }}>
                <Animated.View style={[cssStyle.parallaxHeader, { backgroundColor: headerBackgroundColor[colorScheme] }, headerAnimatedStyle]}>
                    {/* Wrap headerImage in View to prevent text rendering issues */}
                    <View>{headerImage}</View>
                </Animated.View>
                <ThemedView style={cssStyle.parallaxContent}>
                    {/* Ensure children are properly wrapped */}
                    {children}
                </ThemedView>
            </Animated.ScrollView>
        </ThemedView>
    );
}
