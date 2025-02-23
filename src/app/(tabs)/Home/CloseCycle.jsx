import React from "react";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import CustomButton from "../../../components/Form/CustomButtom";
import HeaderCustom from "../../../components/HeaderCustom";
import { colors } from "../../../styles/color";
import { fontFamily } from "../../../styles/fontFamily";
import { CopyCheck } from "lucide-react-native";
import PieChart from "../../../components/Charts/PieChart";
import BarChart from "../../../components/Charts/BarChart";

export default function CloseCycle() {
    return (
        <ScrollView style={styles.container}>
            <View style={{ marginBottom: 26 }}>
                <HeaderCustom title="Encerrar o Ciclo" />
            </View>
            <Text style={styles.mainText}>
                Ao encerrar o ciclo de mesada, todas as tarefas aprovadas serão
                contabilizadas. Você poderá visualizar gráficos de desempenho e
                sugerir um valor de mesada com base nos pontos acumulados.
            </Text>
            <Text style={styles.sectionTitle}>Relatório Gráficos</Text>
            <View style={styles.background}>
                <View style={{ gap: 30 }}>
                    <PieChart legend="Status tarefas" />
                    <BarChart legend="Maiores pontos" />
                </View>
            </View>
            <Text style={styles.sectionTitle}>Sugestão de Mesada</Text>
            <View style={styles.background}>
                <Text style={styles.label}>Filho(a)</Text>
                <Text style={styles.mainText}>Ryan Rodrigues</Text>
                <Text style={styles.label}>Pontos</Text>
                <Text style={styles.mainText}>23 pontos</Text>
            </View>
        </ScrollView>
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
