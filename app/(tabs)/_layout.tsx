import { Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform, Text, View } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { CharacterHeader } from "@/components/Header/_Header";
import ProtectedRoute from "@/components/ProtectedRoute";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Removed error boundary to simplify the code

// Custom tab bar label component to ensure text is properly wrapped
function TabBarLabel({ label, focused, color }: { label: string; focused: boolean; color: string }) {
  return <Text style={{ color, fontSize: 12, marginTop: 2 }}>{label}</Text>;
}

function TabLayout() {
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);

  // Check if this is the first launch
  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem("app_first_launch");
        if (hasLaunched === null) {
          // This is the first launch
          setIsFirstLaunch(true);
          await AsyncStorage.setItem("app_first_launch", "false");
        }
      } catch (error) {
        console.error("Error checking first launch status:", error);
      }
    };

    checkFirstLaunch();
  }, []);
  return (
    <ProtectedRoute>
      <View style={{ overflowY: "scroll", backgroundColor: "#1a1a1a", height: "100%" }}>
        <CharacterHeader />
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors["dark"].tint,
            headerShown: false,
            tabBarButton: HapticTab,
            tabBarBackground: TabBarBackground,
            tabBarStyle: Platform.select({
              ios: {
                position: "absolute",
              },
              default: {
                backgroundColor: "#1a1a1a",
                borderTopColor: "#444",
              },
            }),
            tabBarLabelPosition: "below-icon",
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Character Home",
              tabBarLabel: ({ focused, color }) => <TabBarLabel label="Character" focused={focused} color={color} />,
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
            }}
          />
          <Tabs.Screen
            name="combat"
            options={{
              title: "Combat",
              tabBarLabel: ({ focused, color }) => <TabBarLabel label="Combat" focused={focused} color={color} />,
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
            }}
          />
          <Tabs.Screen
            name="inventory"
            options={{
              title: "Inventory",
              tabBarLabel: ({ focused, color }) => <TabBarLabel label="Inventory" focused={focused} color={color} />,
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="bag.fill" color={color} />,
            }}
          />
          <Tabs.Screen
            name="magic"
            options={{
              title: "Magic",
              tabBarLabel: ({ focused, color }) => <TabBarLabel label="Magic" focused={focused} color={color} />,
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="sparkles" color={color} />,
            }}
          />
          <Tabs.Screen
            name="notes"
            options={{
              title: "Notes",
              tabBarLabel: ({ focused, color }) => <TabBarLabel label="Notes" focused={focused} color={color} />,
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="note.text" color={color} />,
            }}
          />
        </Tabs>
      </View>
    </ProtectedRoute>
  );
}

export default TabLayout;
