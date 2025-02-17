import { View, Text, StyleSheet, TextInput } from "react-native";
import React from "react";
import CustomButton from "../../components/Form/CustomButtom";
import { fontFamily } from "../../styles/fontFamily";
import { colors } from "../../styles/color";
import HeaderCustom from "../../components/HeaderCustom";
import { CopyCheck } from "lucide-react-native";

function JoinGroup() {
    const [code, setCode] = React.useState("");
    return (
        <View style={styles.container}>
            <View style={{ marginBottom: 26 }}>
                <HeaderCustom title="Entrar em um grupo familiar" />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={styles.mainText}>
                    Insira o código do grupo compartilhado por sua família para
                    participar.
                </Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        onChangeText={setCode}
                        value={code}
                        placeholder="Código do grupo 6 dígitos"
                    />
                </View>
            </View>
            <CustomButton width={"100%"} height={44}>
                Entrar no grupo
            </CustomButton>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 30,
        paddingVertical: 50,
        backgroundColor: colors.background,
    },
    mainText: {
        fontSize: 18,
        marginBottom: 26,
        fontFamily: fontFamily.roboto.regular,
    },
    infoText: {
        fontSize: 16,
        marginBottom: 20,
        fontFamily: fontFamily.roboto.regular,
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
});

export default JoinGroup;
