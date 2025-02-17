import React from "react";
import { View } from "react-native";
import TabBarCustom from "../../components/TabBarCustom";
import { Slot } from "expo-router";

export default function Layout() {
    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Slot />
          <TabBarCustom />
        </View>
      );
}
