import React from "react";
import { View } from "react-native";
import TabBarCustom from "../../components/TabBarCustom";
import { Slot, usePathname } from "expo-router";

export default function Layout() {
    const pathname = usePathname();
    const showTabBar = !pathname.includes("NewTask") && !pathname.includes("NewSuggestion") && !pathname.includes("GroupInformation") && !pathname.includes("CloseCycle");

    return (
        <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
            <Slot />
            {showTabBar && <TabBarCustom />}
        </View>
    );
}
