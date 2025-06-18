import { Link, Stack } from "expo-router";

import { useResponsiveStyles } from "@/app/contexts/ResponsiveContext";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function NotFoundScreen() {
    const cssStyle = useResponsiveStyles();
    return (
        <>
            <Stack.Screen options={{ title: "Oops!" }} />
            <ThemedView style={cssStyle.container}>
                <ThemedText type="title">This screen does not exist.</ThemedText>
                <Link href="/" style={cssStyle.themedTextLink}>
                    <ThemedText type="link">Go to home screen!</ThemedText>
                </Link>
            </ThemedView>
        </>
    );
}
