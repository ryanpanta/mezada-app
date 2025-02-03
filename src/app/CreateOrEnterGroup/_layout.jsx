import { View, Text } from "react-native";
import { Stack } from "expo-router";
import { MoveLeft } from "lucide-react-native";
import React from "react";
import { colors } from "../../styles/color";
import CreateOrEnterGroup from "./index";
import CreateGroup from "./Create";
import JoinGroup from "./Join";
import { fontFamily } from "../../styles/fontFamily";
import HeaderCustom from "../../components/HeaderCustom";

export default function Layout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen
                name="Create"
                
                options={{
                    headerTitle: () => (
                        <HeaderCustom title="Criar grupo familiar" />
                    ),
                }}
            />
            <Stack.Screen
                name="Join"
                options={{
                    headerTitle: () => (
                        <HeaderCustom title="Entrar em um grupo familiar" />
                    ),
                }}
            />
        </Stack>
    );
}
