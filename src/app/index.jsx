import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { colors } from "../styles/color";
import { fontFamily } from "../styles/fontFamily";
import { PorquinhoIndex } from "../assets/porquinho-home.svg";

export default function Home() {
    return (
        <View style={styles.container}>
            <View style={styles.containerText}>
                <Text style={styles.mainText}>
                    Um jeito <Text style={styles.highlightText}>fácil</Text> e{" "}
                    <Text style={styles.highlightText}>motivador</Text> de
                    gerenciar a <Text style={styles.highlightText}>mesada</Text>{" "}
                    e construir{" "}
                    <Text style={styles.highlightText}>valores.</Text>
                </Text>
                <PorquinhoIndex />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.black,
        paddingHorizontal: 30,
    },
    containerText: {
        marginTop: 150,
        maxWidth: "90%",
    },
    mainText: {
        fontFamily: fontFamily.playfair.medium,
        fontSize: 54,
        color: colors.white,
        lineHeight: 54,
        paddingVertical: 10,
    },
    highlightText: {
        color: colors.primary,
    },
});
