import { View, Text, Image, StyleSheet, SafeAreaView } from "react-native";
import { colors } from "../../styles/color";
import { fontFamily } from "../../styles/fontFamily";
import CustomButton from "../../components/Form/CustomButtom";
import React from "react";
import { LayoutList, Hourglass, CircleCheck, Ban, UsersRound, ChartColumnIncreasing, ChevronRight } from "lucide-react-native";
import { Link } from "expo-router";

const DashBoard = () => {
    return (
        <View style={styles.container}>
            <View style={styles.welcome}>
                <Image
                    style={styles.avatarIcon}
                    source={{
                        uri: "https://ui-avatars.com/api/?name=Ryan+Rodrigues&background=52A75E&color=EEFFEE&size=36",
                    }}
                />
                <View style={{ gap: 1 }}>
                    <Text style={styles.welcomeText}>
                        Olá, <Text style={styles.spanText}>Ryan</Text>
                    </Text>
                    <Text style={styles.groupText}>Família Rodrigues</Text>
                </View>
            </View>
            <View style={styles.tasksContainer}>
                <Text style={styles.titleSection}>
                    Tarefas{" "}
                    <Link href="">
                        <Text
                            style={{
                                color: colors.primary,
                                fontSize: 12,
                                textTransform: "lowercase",
                                letterSpacing: 0,
                                fontFamily: fontFamily.roboto.bold,
                            }}
                        >
                            (ir para tarefas)
                        </Text>
                    </Link>
                </Text>

                <View style={styles.taskBackground}>
                    <View style={styles.itemContainer}>
                        <View style={[styles.totalWrapper, styles.wrapper]}>
                            <LayoutList color={"#434343"} />
                        </View>
                        <View>
                            <Text style={styles.countValue}>25</Text>
                            <Text style={styles.label}>Total</Text>
                        </View>
                    </View>
                    <View style={styles.itemContainer}>
                        <View style={[styles.waitingWrapper, styles.wrapper]}>
                            <Hourglass color={"#5F5C0F"} />
                        </View>
                        <View>
                            <Text style={styles.countValue}>25</Text>
                            <Text style={styles.label}>Pendentes</Text>
                        </View>
                    </View>
                    <View style={styles.itemContainer}>
                        <View style={[styles.approvedWrapper, styles.wrapper]}>
                            <CircleCheck color={"#008012"} />
                        </View>
                        <View>
                            <Text style={styles.countValue}>25</Text>
                            <Text style={styles.label}>Aprovadas</Text>
                        </View>
                    </View>
                    <View style={styles.itemContainer}>
                        <View style={[styles.rejectedWrapper, styles.wrapper]}>
                            <Ban color={"#BD0909"} />
                        </View>
                        <View>
                            <Text style={styles.countValue}>25</Text>
                            <Text style={styles.label}>Rejeitadas</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.actionsContainer}>
                <Text style={styles.titleSection}>
                    Ações
                </Text>
                <View style={styles.actionBackground}>
                    <View style={styles.itemContainerAction}>
                        <View style={[styles.approvedWrapper, styles.wrapper]}>
                            <UsersRound color={"#008012"} />
                        </View>
                        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                            <Text style={styles.actionText}>Ver informações do grupo familiar</Text>
                            <ChevronRight color={"#8B8B8B"} />
                        </View>
                    </View>
                    <View style={styles.itemContainerAction}>
                        <View style={[styles.approvedWrapper, styles.wrapper]}>
                            <ChartColumnIncreasing color={"#008012"} />
                        </View>
                        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", flex: 1}}>
                            <Text style={styles.actionText}>Encerrar o ciclo de mesada e consultar sugestão de valor</Text>
                            <ChevronRight color={"#8B8B8B"} />
                        </View>
                    </View>
                    
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        fontFamily: fontFamily.roboto.regular,
        flex: 1,
        paddingTop: 80,
        paddingHorizontal: 30,
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
    groupText: {
        fontFamily: fontFamily.roboto.light,
        fontSize: 14,
    },
    titleSection: {
        fontFamily: fontFamily.roboto.regular,
        fontSize: 18,
        textTransform: "uppercase",
        letterSpacing: 1.3,
        color: colors.gray[600],
    },
    tasksContainer: {
        marginTop: 40,
    },
    actionsContainer: {
        marginTop: 40,
    },
    taskBackground: {
        marginTop: 10,
        padding: 20,
        backgroundColor: "rgba(82, 167, 94, 0.1)",
        borderRadius: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 30,
        flexWrap: "wrap",
    },
    actionBackground: {
        marginTop: 10,
        padding: 20,
        backgroundColor: "rgba(82, 167, 94, 0.1)",
        borderRadius: 20,
        gap: 30,
        flexWrap: "wrap",
        maxWidth: "100%",
        
    },

    itemContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        gap: 10,
        
    },
    itemContainerAction: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,

    },
    wrapper: {
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        padding: 12,
        
    },
    totalWrapper: {
        backgroundColor: "#BABABA",
        boxShadow: "0px 4px 15px 4px rgba(186, 186, 186, 0.6)",
        
    },
    waitingWrapper: {
        backgroundColor: "#EAE793",
        boxShadow: "0px 4px 15px 4px rgba(234, 231, 147, 0.6)",

    },
    approvedWrapper: {
        backgroundColor: "#7ED68A",
        boxShadow: "0px 4px 15px 4px rgba(126, 214, 138, 0.6)",

    },
    rejectedWrapper: {
        backgroundColor: "#F1A0A0",
        boxShadow: "0px 4px 15px 4px rgba(241, 160, 160, 0.6)",

    },
    countValue: {
        fontFamily: fontFamily.roboto.bold,
        fontSize: 22,
        color: colors.black,
    },
    label: {
        fontFamily: fontFamily.roboto.light,
        fontSize: 16,
        color: colors.gray[800],
    },
    actionText: {
        fontFamily: fontFamily.roboto.regular,
        fontSize: 16,
        color: colors.black,
        maxWidth: "90%"
        
    }
});

export default DashBoard;
