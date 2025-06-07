import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useAuth } from "../../../contexts/AuthContext";
import HeaderCustom from "../../../components/HeaderCustom";
import { colors } from "../../../styles/color";
import { fontFamily } from "../../../styles/fontFamily";
import { UserRound, Mail, Users, Star } from "lucide-react-native";
import { enumRole } from "../../../utils/enumRole";
import CustomButton from "../../../components/Form/CustomButtom";

export default function Profile() {
    const { user, logout } = useAuth();

    const profileItems = [
        {
            icon: UserRound,
            label: "Nome",
            value: user?.name,
        },
        {
            icon: Mail,
            label: "E-mail",
            value: user?.email,
        },
        {
            icon: Users,
            label: "Grupo Familiar",
            value: user?.familyGroupName,
        },
        {
            icon: Star,
            label: "Função",
            value: user?.role === enumRole.PARENT ? "Responsável" : "Filho",
        },
    ];

    return (
        <ScrollView style={styles.container}>
            <View style={{ marginBottom: 26 }}>
                <HeaderCustom title="Perfil" />
            </View>

            <Text style={styles.mainText}>
                Aqui você pode visualizar as informações da sua conta.
            </Text>

            <View style={styles.profileContainer}>
                {profileItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <View key={index} style={styles.profileItem}>
                            <View style={styles.iconContainer}>
                                <Icon size={24} color={colors.primary} />
                            </View>
                            <View style={styles.infoContainer}>
                                <Text style={styles.label}>{item.label}</Text>
                                <Text style={styles.value}>{item.value}</Text>
                            </View>
                        </View>
                    );
                })}

                <View style={styles.logoutContainer}>
                    <CustomButton
                        onPress={logout}
                        width="100%"
                        height={40}
                        fontSize={16}
                        color="#E75E5E"
                        backgroundColor="#FFFAFA"
                    >
                        Sair da conta
                    </CustomButton>
                </View>
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
        fontSize: 16,
        marginBottom: 26,
        fontFamily: fontFamily.roboto.regular,
        color: colors.gray[600],
        lineHeight: 24,
    },
    profileContainer: {
        backgroundColor: "rgba(82, 167, 94, 0.1)",
        borderRadius: 20,
        padding: 20,
        shadowColor: "rgba(82, 167, 94, 0.1)",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    profileItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(82, 167, 94, 0.1)",
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(82, 167, 94, 0.1)",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },
    infoContainer: {
        flex: 1,
    },
    label: {
        fontSize: 14,
        fontFamily: fontFamily.roboto.regular,
        color: colors.gray[600],
        marginBottom: 4,
    },
    value: {
        fontSize: 16,
        fontFamily: fontFamily.roboto.bold,
        color: colors.black,
    },
    logoutContainer: {
        marginTop: 20,
        paddingTop: 20,
    },
});
