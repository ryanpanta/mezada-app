import { View, Text, StyleSheet, TextInput } from "react-native";
import React from "react";
import CustomButton from "../../components/Form/CustomButtom";
import { fontFamily } from "../../styles/fontFamily";
import { colors } from "../../styles/color";
import HeaderCustom from "../../components/HeaderCustom";
import { CopyCheck } from "lucide-react-native";

function CreateGroup() {
    const [name, setName] = React.useState("");
    return (
        <View style={styles.container}>
            <HeaderCustom title="Criar grupo familiar" />
            <Text style={styles.mainText}>
                Crie seu grupo familiar para começar a gerenciar tarefas e
                mesadas. Compartilhe o código do grupo com seus familiares para
                que possam participar.
            </Text>
            <Text style={styles.infoText}>
                Escolha um nome fácil para identificar seu grupo, como “Família
                Silva” ou “Casa da Vovó”.
            </Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    onChangeText={setName}
                    value={name}
                    placeholder="Nome do grupo"
                />
            </View>
            <View style={styles.codeContainer}>
                <CustomButton type="secondary" width={200} height={50}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                        <Text style={{color: "#52A75E", fontFamily: fontFamily.roboto.bold, fontSize: 20}}> #A34B80</Text> <CopyCheck color={colors.primary} />
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
            <CustomButton width={"100%"} height={44}>
                Criar grupo
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
    codeContainer: {
        flex: 1,
        gap: 10,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
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

export default CreateGroup;
