import { View, StyleSheet, Animated, Easing, Dimensions } from "react-native";
import React, { useEffect, useRef } from "react";
import Porquinho from "../../assets/porquinho.svg";

const { width, height } = Dimensions.get("window");

function Loading() {

    const translateY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(translateY, {
                    toValue: -15,
                    duration: 600,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: 0, 
                    duration: 600,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return (
        <View style={styles.overlay}>
            <Animated.View style={{ transform: [{ translateY }] }}>
                    <Porquinho width={70} height={70} />
                </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        width: width,
        height: height,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 100,
        pointerEvents: "none",
    },
});

export default Loading;
