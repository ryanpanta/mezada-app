import React from "react";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { Slot } from "expo-router";
import {
    Roboto_300Light,
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
    Roboto_900Black,
} from "@expo-google-fonts/roboto";
import {
    PlayfairDisplay_400Regular,
    PlayfairDisplay_500Medium,
    PlayfairDisplay_700Bold,
    PlayfairDisplay_800ExtraBold,
} from "@expo-google-fonts/playfair-display";

export default function Layout() {
    const [fontsLoaded] = useFonts({
        Roboto_300Light,
        Roboto_400Regular,
        Roboto_500Medium,
        Roboto_700Bold,
        Roboto_900Black,
        PlayfairDisplay_400Regular,
        PlayfairDisplay_500Medium,
        PlayfairDisplay_700Bold,
        PlayfairDisplay_800ExtraBold,
    });

    if (!fontsLoaded) {
        return null;
    }

    return <Stack screenOptions={{ headerShown: false }} />;
}
