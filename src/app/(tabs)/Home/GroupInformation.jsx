import { View, Text, Button, StyleSheet, TextInput } from "react-native";
import HeaderCustom from "../../../components/HeaderCustom";
import { colors } from "../../../styles/color";
import { fontFamily } from "../../../styles/fontFamily";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import CustomButton from "../../../components/Form/CustomButtom";
import { useRouter } from "expo-router";

export default function GroupInformation() {
    return (
        <View style={styles.container}>
            <View style={{ marginBottom: 26 }}>
                <HeaderCustom title="Informações do Grupo" />
            </View>
            <Text style={styles.sectionTitle}>Informações Principais</Text>
            <View style={styles.background}>
                <Text style={styles.label}>Nome do Grupo</Text>
                <Text style={styles.groupName}>Família Rodrigues</Text>
                <Text style={styles.label}>Código do Grupo</Text>
                <CustomButton type="secondary" width={200} height={50}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 8,
                        }}
                    >
                        <Text
                            style={{
                                color: "#52A75E",
                                fontFamily: fontFamily.roboto.bold,
                                fontSize: 20,
                            }}
                        >
                            {" "}
                            #A34B80
                        </Text>{" "}
                        <CopyCheck color={colors.primary} />
                    </View>
                </CustomButton>
                <Text style={styles.infoTextCode}>
                    Este é o{" "}
                    <Text style={styles.infoTextCodeSpan}>código único</Text> do
                    seu <Text style={styles.infoTextCodeSpan}>grupo</Text>.
                    Compartilhe-o com sua família para que possam se juntar ao
                    grupo.{" "}
                    <Text style={styles.infoTextCodeSpan}>
                        Clique para copiar.
                    </Text>
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 30,
        paddingVertical: 50,
        maxWidth: 1500,
        width: "100%",
        backgroundColor: colors.background,
    },
    mainText: {
        fontSize: 18,
        marginBottom: 26,
        fontFamily: fontFamily.roboto.regular,
    },
    formContainer: {
        marginBottom: 30,
        gap: 20,
    },
    inputContainer: {
        gap: 4,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray[300],
    },
    input: {
        width: "90%",
        fontSize: 18,
        paddingVertical: 4,
        fontFamily: fontFamily.roboto.regular,
    },
    buttonContainer: {
        marginTop: 20,
    },
    questionContainer: {
        alignItems: "center",
        marginTop: 80,
    },
    questionText: {
        fontFamily: fontFamily.roboto.regular,
        fontSize: 18,
        textAlign: "center",
    },
    loginSpan: {
        color: colors.primary,
        fontFamily: fontFamily.roboto.bold,
        textDecorationLine: "underline",
    },
    errorText: {
        color: "#ff375b",
        fontSize: 14,
        fontFamily: fontFamily.roboto.regular,
        marginTop: 4,
    },
    infoTextCode: {
        textAlign: "center",
        fontSize: 16,
        fontFamily: fontFamily.roboto.regular,
        maxWidth: "90%",
    },
    infoTextCodeSpan: {
        fontFamily: fontFamily.roboto.bold,
        fontSize: 17,
    },
});
