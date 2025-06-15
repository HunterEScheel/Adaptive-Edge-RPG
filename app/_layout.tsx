import rootReducer from "@/store/rootReducer";
import rootSaga from "@/store/sagas/_root.saga";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { configureStore } from "@reduxjs/toolkit";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform, Text, View } from "react-native";
import { Provider } from "react-redux";
import { ResponsiveProvider } from "./contexts/ResponsiveContext";
const createSagaMiddleware = require("redux-saga").default;

// Error boundary component to catch rendering errors
class ErrorBoundaryWrapper extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Error caught by ErrorBoundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text>Something went wrong. Please restart the app.</Text>
                </View>
            );
        }

        return this.props.children;
    }
}

// Custom wrapper for Stack.Screen to ensure proper text rendering
function SafeStackScreen(props: any) {
    return (
        <Stack.Screen
            {...props}
            options={{
                ...props.options,
                // Force contentStyle to ensure proper rendering
                contentStyle: {
                    ...(props.options?.contentStyle || {}),
                    // Add platform-specific styles for better text handling
                    ...(Platform.OS !== "web" ? { overflow: "hidden" } : {}),
                },
            }}
        />
    );
}

// Create the saga middleware and store ONCE at the top level
const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];
const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middleware),
});
sagaMiddleware.run(rootSaga);

export default function RootLayout() {
    const [loaded] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    });

    if (!loaded) {
        // Async font loading only occurs in development.
        return null;
    }

    return (
        <ErrorBoundaryWrapper>
            <Provider store={store}>
                <ThemeProvider value={DefaultTheme}>
                    <ResponsiveProvider>
                        <View style={{ flex: 1 }}>
                            <ErrorBoundaryWrapper>
                                <Stack
                                    screenOptions={{
                                        headerShown: false,
                                        animation: Platform.OS === "web" ? undefined : "fade",
                                        contentStyle: { flex: 1 },
                                    }}
                                >
                                    <SafeStackScreen name="(tabs)" options={{ headerShown: false }} />
                                    <SafeStackScreen name="welcome" />
                                    <SafeStackScreen
                                        name="+not-found"
                                        options={{
                                            headerShown: false,
                                            contentStyle: { backgroundColor: "white" },
                                        }}
                                    />
                                </Stack>
                                <StatusBar style="auto" />
                            </ErrorBoundaryWrapper>
                        </View>
                    </ResponsiveProvider>
                </ThemeProvider>
            </Provider>
        </ErrorBoundaryWrapper>
    );
}
