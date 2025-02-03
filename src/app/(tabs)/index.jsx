import { View, Text, Image, StyleSheet, SafeAreaView } from "react-native";
import { colors } from "../../styles/color";
import { fontFamily } from "../../styles/fontFamily";
import CustomButton from "../../components/Form/CustomButtom";
import React from "react";
import { LayoutList } from "lucide-react-native";
import { Link } from "expo-router";

const DashBoard = () => {
    return (
        <View style={styles.container}>
            <View style={styles.welcome}>
                <Image
                    style={styles.avatarIcon}
                    source={{
                        uri: "https://ui-avatars.com/api/?name=Ryan+Rodrigues&background=52A75E&color=EEFFEE&size=36",
                    }}
                />
                <View style={{ gap: 1 }}>
                    <Text style={styles.welcomeText}>
                        Olá, <Text style={styles.spanText}>Ryan</Text>
                    </Text>
                    <Text style={styles.groupText}>Família Rodrigues</Text>
                </View>
            </View>
            <View style={styles.tasksContainer}>
                <Text style={styles.titleSection}>
                    Tarefas{" "}
                    <Link href="">
                        <Text
                            style={{
                                color: colors.primary,
                                fontSize: 12,
                                textTransform: "lowercase",
                                letterSpacing: 0,
                                fontFamily: fontFamily.roboto.bold,
                            }}
                        >
                            (ir para tarefas)
                        </Text>
                    </Link>
                </Text>

                <View style={styles.taskBackground}>
                    <View style={styles.totalContainer}>
                        <View style={styles.totalWrapper}>
                            <LayoutList color={"#434343"} />
                        </View>
                        <View>
                            <Text style={styles.countValue}>25</Text>
                            <Text style={styles.label}>Total</Text>
                        </View>
                    </View>
                    <View style={styles.waitingContainer}>
                        <View style={styles.totalWrapper}>
                            <LayoutList color={"#434343"} />
                        </View>
                        <View>
                            <Text style={styles.countValue}>25</Text>
                            <Text style={styles.label}>Total</Text>
                        </View>
                    </View>
                    <View style={styles.totalContainer}>
                        <View style={styles.totalWrapper}>
                            <LayoutList color={"#434343"} />
                        </View>
                        <View>
                            <Text style={styles.countValue}>25</Text>
                            <Text style={styles.label}>Total</Text>
                        </View>
                    </View>
                    <View style={styles.totalContainer}>
                        <View style={styles.totalWrapper}>
                            <LayoutList color={"#434343"} />
                        </View>
                        <View>
                            <Text style={styles.countValue}>25</Text>
                            <Text style={styles.label}>Total</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        fontFamily: fontFamily.roboto.regular,
        flex: 1,
        paddingTop: 80,
        paddingHorizontal: 30,
        backgroundColor: colors.background,
    },
    avatarIcon: {
        borderRadius: "50%",
        width: 36,
        height: 36,
    },
    welcome: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    welcomeText: {
        fontFamily: fontFamily.playfair.regular,
        fontSize: 26,
    },
    spanText: {
        fontFamily: fontFamily.playfair.bold,
        fontSize: 26,
    },
    groupText: {
        fontFamily: fontFamily.roboto.light,
        fontSize: 14,
    },
    titleSection: {
        fontFamily: fontFamily.roboto.regular,
        fontSize: 18,
        textTransform: "uppercase",
        letterSpacing: 1.3,
        color: colors.gray[600],
    },
    tasksContainer: {
        marginTop: 40,
    },
    taskBackground: {
        marginTop: 10,
        padding: 20,
        backgroundColor: "rgba(82, 167, 94, 0.2)",
        borderRadius: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 30,
        flexWrap: "wrap",
    },
    totalContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        gap: 10,
    },
    totalWrapper: {
        backgroundColor: "#BABABA",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        padding: 12,
    },
    countValue: {
        fontFamily: fontFamily.roboto.bold,
        fontSize: 22,
        color: colors.black,
    },
    label: {
        fontFamily: fontFamily.roboto.light,
        fontSize: 16,
        color: colors.gray[800],
    },
});

export default DashBoard;
