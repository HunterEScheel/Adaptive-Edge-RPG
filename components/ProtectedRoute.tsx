import { ThemedText } from "@/components/ThemedText";
import { RootState } from "@/store/rootReducer";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Platform, View } from "react-native";
import { useSelector } from "react-redux";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isCharacterLoaded = useSelector((state: RootState) => state.characterAuth?.isCharacterLoaded ?? false);
  const router = useRouter();

  // Use effect to handle navigation to prevent rendering issues
  useEffect(() => {
    if (!isCharacterLoaded) {
      // Small timeout to ensure we're not in the middle of a render
      const timer = setTimeout(() => {
        router.replace("/welcome");
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [isCharacterLoaded, router]);

  // If not loaded, return null or a minimal loading view
  if (!isCharacterLoaded) {
    return Platform.OS === "web" ? null : <View style={{ flex: 1, backgroundColor: "#fff" }} />;
  }

  // Ensure all direct children that are strings are wrapped in ThemedText
  const wrappedChildren = React.Children.map(children, (child: React.ReactNode, index: number) => {
    if (child === null || child === undefined) {
      return null;
    }

    if (typeof child === "string" || typeof child === "number") {
      return <ThemedText key={`text-${index}`}>{String(child)}</ThemedText>;
    }

    if (Array.isArray(child)) {
      return child.map((c: React.ReactNode, i: number) => (typeof c === "string" || typeof c === "number" ? <ThemedText key={`text-${index}-${i}`}>{String(c)}</ThemedText> : c));
    }

    return child;
  });

  // Use a View wrapper for mobile to ensure proper layout
  return Platform.OS === "web" ? <>{wrappedChildren}</> : <View style={{ flex: 1 }}>{wrappedChildren}</View>;
}

export default ProtectedRoute;
