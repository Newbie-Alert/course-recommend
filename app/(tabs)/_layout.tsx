import TabLabel from "@/components/ui/TabLabel";
import { Tabs } from "expo-router";
import React from "react";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "transparent",
          elevation: 0,
          paddingBottom: 8,
          borderColor: "transparent",
        },
        tabBarIcon: () => null,
      }}>
      <Tabs.Screen
        name="workout"
        options={{
          tabBarLabel: ({ focused }) =>
            TabLabel({ labelName: "Workout", focused }),
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          tabBarLabel: ({ focused }) =>
            TabLabel({ labelName: "Feed", focused }),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarLabel: ({ focused }) =>
            TabLabel({ labelName: "Explore", focused }),
        }}
      />
    </Tabs>
  );
}
