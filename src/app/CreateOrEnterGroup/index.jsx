import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../styles/color";
import { fontFamily } from "../../styles/fontFamily";
import CustomButton from "../../components/Form/CustomButtom";
import { useRouter } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import { formatFirstName } from "../../helpers/formatFirstName";

function CreateOrEnterGroup() {

    const {user} = useAuth();
    const router = useRouter();

    if (user?.familyGroupId) {
         router.replace('/Home');
    }
    

    async function getAvatar() {
        
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
                        uri: "https://ui-avatars.com/api/?name=Ryan+Rodrigues&background=52A75E&color=EEFFEE&size=36",
                    }}
                />
                <Text style={styles.welcomeText}>Olá, <Text style={styles.spanText}>{formatFirstName(user.name)}</Text></Text>
            </View>
            <Text style={{fontSize: 18, marginTop: 30, marginBottom: 30 }}>Você ainda não faz parte de um grupo familiar. Escolha como deseja começar:</Text>
            <View style={[styles.optionContainer, styles.optionSon]}>
                <Text style={styles.titleOption}>Filho(a)</Text>
                <Text style={styles.descriptionOption}>Sou filho(a) e quero entrar em um grupo familiar para participar das tarefas.</Text>
                <CustomButton width="100%" height={40} onPress={() => router.push('/CreateOrEnterGroup/Join')}fontSize={18}>Entrar em um grupo</CustomButton>
            </View>
            <View style={[styles.optionContainer, styles.optionParent]}>
                <Text style={styles.titleOption}>Pai/mãe</Text>
                <Text style={styles.descriptionOption}>Sou pai/mãe e quero criar um grupo familiar para gerenciar mesadas e tarefas.</Text>
                <CustomButton color={"#EEF8FF"} backgroundColor={"#506BA6"} width="100%" height={40} onPress={() => router.push('/CreateOrEnterGroup/Create')} fontSize={18}>Criar um grupo</CustomButton>
            </View>
           
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        fontFamily: fontFamily.roboto.regular,
        flex: 1,
        paddingHorizontal: 30,
        paddingVertical: 50,
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

    optionContainer: {
        borderWidth: 1,
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
        color: colors.gray[700],
        fontSize: 16,
        marginBottom: 24,
    },
    optionSon: {
        backgroundColor: colors.secondary,
        borderColor: colors.primary,
    },
    optionParent: {
        backgroundColor: "#EEF8FF",
        borderColor: "#506BA6",
    },
    optionParentButtom: {
        backgroundColor: '#ffff',
    }

});

export default CreateOrEnterGroup;
