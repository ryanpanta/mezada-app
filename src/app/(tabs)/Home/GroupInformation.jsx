import React, { useEffect, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import CustomButton from "../../../components/Form/CustomButtom";
import HeaderCustom from "../../../components/HeaderCustom";
import { colors } from "../../../styles/color";
import { fontFamily } from "../../../styles/fontFamily";
import { CopyCheck } from "lucide-react-native";
import { getFamilyGroupInfo, setAsParent } from "../../../services/endpoints";
import { showToast } from "../../../helpers/showToast";
import { useLoading } from "../../../contexts/LoadingContext";
import Loading from "../../../components/Helpers/Loading";
import { useAuth } from "../../../contexts/AuthContext";
import { enumRole } from "../../../utils/enumRole";
import * as Clipboard from 'expo-clipboard';

export default function GroupInformation() {

    const [groupInfo, setGroupInfo] = useState(null);
    const { isLoading } = useLoading();
    const { user } = useAuth();

    useEffect(() => {
        fetchGroupInfo();
    }, []);

    const fetchGroupInfo = async () => {
        try {
            const response = await getFamilyGroupInfo(user?.familyGroupId);
            if (response.status === 200) {
                setGroupInfo(response.data);
            }
        } catch (error) {
            console.log(error.response?.data);
            showToast(
                "Erro ao buscar informações do grupo, tente novamente mais tarde",
                "error"
            );
        }
    };

    const handleCopyHashCode = async () => {
        try {
            await Clipboard.setStringAsync(groupInfo.hashCode);
            showToast("Código copiado com sucesso!", "success");
        } catch (error) {
            showToast("Erro ao copiar código", "error");
        }
    };

    const handleSetAsParent = async (userId) => {
        const confirmPromotion = Alert.alert(
            "Confirmação",
            "Tem certeza que deseja promover este usuário a administrador?",
            [
                {
                    text: "Não",
                    style: "cancel"
                },
                {
                    text: "Sim",
                    onPress: () => {
                        return true;
                    }
                }
            ]
        );

        if (!confirmPromotion) {
            return;
        }

        try {
            const response = await setAsParent(user?.familyGroupId, userId);
            if (response.status === 200) {
                showToast("Usuário promovido a administrador com sucesso!", "success");
                fetchGroupInfo(); 
            }
        } catch (error) {
            console.log(error.response?.data);
            showToast(
                "Erro ao promover usuário a administrador, tente novamente mais tarde",
                "error"
            );
        }
    };

    return (
        <>
        {isLoading && <Loading />}
        <View style={styles.container}>
            <View style={{ marginBottom: 26 }}>
                <HeaderCustom title="Informações do Grupo" />
            </View>
            <Text style={styles.sectionTitle}>Informações Principais</Text>
            <View style={styles.background}>
                <Text style={styles.label}>Nome do Grupo</Text>
                <Text style={styles.groupName}>{groupInfo?.name}</Text>
                <Text style={styles.label}>{groupInfo?.hashCode}</Text>
                <CustomButton type="secondary" width={200} height={50} onPress={handleCopyHashCode}>
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
                    Este é o {""}
                    <Text style={styles.infoTextCodeSpan}>código único</Text> do
                    seu <Text style={styles.infoTextCodeSpan}>grupo</Text>.
                    Compartilhe-o com os membros para que possam se juntar ao
                    grupo.{" "}
                    <Text style={styles.infoTextCodeSpan}>
                        Clique para copiar.
                    </Text>
                </Text>
            </View>
            <Text style={styles.sectionTitle}>Usuários</Text>
            <View style={styles.background}>
                <FlatList
                    data={groupInfo?.users}
                    renderItem={({ item }) => (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                            <Text style={styles.user}>
                                {item.name} -{" "}
                                {item.role === enumRole.PARENT ? "mãe/pai" : "filho(a)"}
                            </Text>
                            {item.role === enumRole.CHILD && user?.role === enumRole.PARENT && (
                                <TouchableOpacity onPress={() => handleSetAsParent(item.id)} style={{ marginLeft: 10, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4 }}>
                                    <Text style={styles.buttonText}>+ administrador</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                />
            </View>
        </View>
        </>
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
        flexDirection: "row",
        alignItems: "center",
        fontFamily: fontFamily.roboto.regular,
        fontSize: 18,
        color: colors.black,
        marginBottom: 6,
    },
    buttonText: {
        fontFamily: fontFamily.roboto.regular,
        fontSize: 14,
        color: colors.primary,
        textDecorationLine: "underline",
    },
});
