import React, { forwardRef } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { fontFamily } from "../../styles/fontFamily";

const CustomButton = forwardRef(({ width, height, type = "primary", onPress, children, fontSize }, ref) => {
    const isPrimary = type === "primary";

    return (
        <TouchableOpacity
            ref={ref}
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
            <Text
                style={[
                    styles.text,
                    {
                        color: isPrimary ? "#EEFFEE" : "#52A75E",
                        fontSize: fontSize || 20,
                    },
                ]}
            >
                {children}
            </Text>
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    button: {
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 40,
        paddingHorizontal: 16,
    },
    text: {
        fontFamily: fontFamily.roboto.bold,
    },
});

export default CustomButton;
