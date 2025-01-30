import { View, Text, TextInput, StyleSheet } from "react-native";
import React from "react";
import Porquinho from "../assets/porquinho.svg";
import CustomButton from "../components/Form/CustomButtom";
import { colors } from "../styles/color";
import { SafeAreaView } from "react-native-safe-area-context";
import { fontFamily } from "../styles/fontFamily";
import { Link } from "expo-router";
export default function Register() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.iconContainer}>
                <Porquinho width={90} height={90} />
            </View>
            <Text style={styles.title}>Cadastro</Text>
            <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                    <TextInput style={styles.input} placeholder="Nome" />
                </View>
                <View style={styles.inputContainer}>
                    <TextInput style={styles.input} placeholder="E-mail" />
                </View>
                <View style={styles.inputContainer}>
                    <TextInput style={styles.input} placeholder="Senha" />
                </View>
                <View style={styles.inputContainer}>
                    <TextInput style={styles.input} placeholder="Confirmação de Senha" />
                </View>
                <View style={styles.buttonContainer}>
                    <CustomButton height={50} fontSize={24}>Cadastrar</CustomButton>
                </View>
                <View style={styles.questionContainer}>
                    <Text style={styles.questionText}>Você já tem uma conta? Faça o <Link style={styles.loginSpan} href={'/Login'}>login</Link></Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 30,
        paddingVertical: 50,
        backgroundColor: colors.background,
    },
    title: {
        fontFamily: fontFamily.playfair.extraBold,
        fontSize: 36,
        marginTop: 20,
        color: colors.black,
    },
    formContainer: {
        marginVertical: 30,
        gap: 20,
    },
    inputContainer: {
        gap: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray[300],
        paddingVertical: 4,
    },
    input: {
        fontSize: 18,
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
    }
});
