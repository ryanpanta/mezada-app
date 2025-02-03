import { Tabs } from "expo-router";
import React from "react";

import HeaderCustom from "../../components/HeaderCustom";

export default function Layout() {
    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen name="index" options={{ headerShown: false }} />
            <Tabs.Screen
                name="Create"
                
                options={{
                    headerTitle: () => (
                        <HeaderCustom title="Criar grupo familiar" />
                    ),
                }}
            />
            <Tabs.Screen
                name="Join"
                options={{
                    headerTitle: () => (
                        <HeaderCustom title="Entrar em um grupo familiar" />
                    ),
                }}
            />
        </Tabs>
    );
}
