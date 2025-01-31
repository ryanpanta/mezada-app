import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../styles/color";
import { fontFamily } from "../styles/fontFamily";
import CustomButton from "../components/Form/CustomButtom";

export default function CreateOrEnterGroup() {
    async function getAvatar() {
        console.log(response);
        const data = await response.json();
        console.log(data);
    }

    React.useEffect(() => {
        getAvatar();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.welcome}>
                <Image
                    style={styles.avatarIcon}
                    source={{
                        uri: "https://ui-avatars.com/api/?name=Ryan+Rodrigues&background=52A75E&color=EEFFEE&size=40",
                    }}
                />
                <Text style={styles.welcomeText}>Olá, <Text style={styles.spanText}>Ryan</Text></Text>
            </View>
            <Text style={{fontSize: 18, marginTop: 30, marginBottom: 15 }}>Você ainda não faz parte de um grupo familiar. Escolha como deseja começar:</Text>
            <View style={[styles.optionContainer, styles.optionSon]}>
                <Text style={styles.titleOption}>Filho(a)</Text>
                <Text style={styles.descriptionOption}>Sou filho(a) e quero entrar em um grupo familiar para participar das tarefas.</Text>
                <CustomButton width="100%" height={40} onPress={() => {}} fontSize={18}>Entrar em um grupo</CustomButton>
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

    avatarIcon: {
        borderRadius: "50%",
        width: 40,
        height: 40,
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

    optionContainer: {
        backgroundColor: colors.secondary,
        borderWidth: 1,
        borderColor: colors.primary,
        borderRadius: 24,
        padding: 16,
        marginBottom: 20,
    },
    titleOption: {
        fontFamily: fontFamily.playfair.bold,
        fontSize: 20,
        marginBottom: 16,
    },
    descriptionOption: {
        fontSize: 16,
        marginBottom: 24,
    }
});
