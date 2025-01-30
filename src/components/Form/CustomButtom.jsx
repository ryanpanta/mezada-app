import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { fontFamily } from "../../styles/fontFamily";

export default function CustomButton({ width, height, type = "primary", onPress, children }) {
    const isPrimary = type === "primary";

    return (
        <TouchableOpacity
            style={[
                styles.button,
                {
                    width: width || "auto",
                    height: height || 50,
                    backgroundColor: isPrimary ? "#52A75E" : "#EEFFEE",
                    borderColor: "#52A75E",
                    borderWidth: isPrimary ? 0 : 1,
                },
            ]}
            onPress={onPress}
        >
            <Text style={[styles.text, { color: isPrimary ? "#EEFFEE" : "#52A75E" }]}>
                {children}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 40,
        paddingHorizontal: 16,
    },
    text: {
        fontSize: 20,
        fontFamily: fontFamily.roboto.bold,
    },
});
