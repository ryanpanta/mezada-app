import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { colors } from "../styles/color";
import { fontFamily } from "../styles/fontFamily";
import PorquinhoIndex from "../assets/porquinho-home.svg";
import CustomButton from "../components/Form/CustomButtom";
import { Link, useRouter } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
export default function Home() {
    const { isLogged, loading } = useAuth();

    if (loading) {
        return <Text>Carregando...</Text>;
    }

    const router = useRouter();

    React.useEffect(() => {
        if (isLogged) {
            router.replace("/CreateOrEnterGroup");
        }
    }, []);

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
            </View>
            <View style={styles.iconContainer}>
                <PorquinhoIndex />
            </View>
            <View style={styles.buttonContainer}>
                <Link href={"/Register"} asChild>
                    <CustomButton width={190} height={60}>
                        Login/Cadastrar
                    </CustomButton>
                </Link>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.black,
    },
    containerText: {
        marginTop: 150,
        maxWidth: "90%",
        paddingHorizontal: 30,
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
    iconContainer: {
        flex: 1,
        alignItems: "flex-end",
    },
    buttonContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
    },
});
