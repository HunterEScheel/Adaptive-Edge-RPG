export default {
    expo: {
        name: "adaptive_edge",
        slug: "adaptive_edge",
        version: "1.0.3",
        orientation: "portrait",
        icon: "./assets/images/icon.png",
        scheme: "Adaptive_Edge",
        userInterfaceStyle: "automatic",
        newArchEnabled: true,
        ios: {
            supportsTablet: true,
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./assets/images/adaptive-icon.png",
                backgroundColor: "#333",
            },
            edgeToEdgeEnabled: true,
            package: "com.hunteredward98.Adaptive_Edge",
        },
        web: {
            bundler: "metro",
            output: "static",
            favicon: "./assets/images/favicon.png",
        },
        plugins: [
            "expo-router",
            [
                "expo-splash-screen",
                {
                    image: "./assets/images/splash-icon.png",
                    imageWidth: 200,
                    resizeMode: "contain",
                    backgroundColor: "#333",
                },
            ],
        ],
        experiments: {
            typedRoutes: true,
        },
        extra: {
            router: {},
            eas: {
                projectId: "e3d9829d-5007-4f97-a246-6c21faf593af",
            },
            // API keys are now configured in-app via settings page
        },
    },
};
