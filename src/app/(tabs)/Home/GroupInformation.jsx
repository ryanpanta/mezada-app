import React from "react";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import CustomButton from "../../../components/Form/CustomButtom";
import HeaderCustom from "../../../components/HeaderCustom";
import { colors } from "../../../styles/color";
import { fontFamily } from "../../../styles/fontFamily";
import { CopyCheck } from "lucide-react-native";

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
                            #A34B80
                        </Text>
                        <CopyCheck color={colors.primary} />
                    </View>
                </CustomButton>
                <Text style={styles.infoTextCode}>
                    Este é o
                    <Text style={styles.infoTextCodeSpan}>código único</Text> do
                    seu <Text style={styles.infoTextCodeSpan}>grupo</Text>.
                    Compartilhe-o com sua família para que possam se juntar ao
                    grupo.{" "}
                    <Text style={styles.infoTextCodeSpan}>
                        Clique para copiar.
                    </Text>
                </Text>
            </View>
            <Text style={styles.sectionTitle}>Usuários</Text>
            <View style={styles.background}>
                <FlatList
                    data={[
                        { name: "João Pena", role: 2 },
                        { name: "Maria Lurder", role: 2 },
                        { name: "José Afonso", role: 2 },
                        { name: "Ryan Rodrigo", role: 1 },
                    ]}
                    renderItem={({ item }) => (
                        <Text style={styles.user}>
                            {item.name} -{" "}
                            {item.role === 1 ? "mãe/pai" : "filho(a)"}
                        </Text>
                    )}
                />
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
    sectionTitle: {
        fontSize: 18,
        fontFamily: fontFamily.roboto.bold,
        marginBottom: 12,
    },
    background: {
        marginTop: 10,
        padding: 20,
        backgroundColor: "rgba(82, 167, 94, 0.1)",
        borderRadius: 20,
        marginBottom: 30,
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
        marginTop: 10,
        fontSize: 16,
        fontFamily: fontFamily.roboto.regular,
        maxWidth: "90%",
        color: colors.gray[700],
    },
    infoTextCodeSpan: {
        fontFamily: fontFamily.roboto.bold,
        fontSize: 17,
    },
    label: {
        fontFamily: fontFamily.roboto.regular,
        fontSize: 14,
        textTransform: "uppercase",
        letterSpacing: 1.3,
        color: colors.gray[600],
        marginBottom: 4,
    },
    actionText: {
        fontFamily: fontFamily.roboto.regular,
        fontSize: 16,
        color: colors.black,
        maxWidth: "90%",
    },
    groupName: {
        fontFamily: fontFamily.roboto.medium,
        fontSize: 20,
        color: colors.black,
        marginBottom: 20,
    },
    user: {
        fontFamily: fontFamily.roboto.regular,
        fontSize: 18,
        color: colors.black,
        marginBottom: 6,
    },
});
