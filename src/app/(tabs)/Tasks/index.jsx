import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    Modal,
} from "react-native";
import React from "react";
import { colors } from "../../../styles/color";
import { fontFamily } from "../../../styles/fontFamily";
import HeaderCustom from "../../../components/HeaderCustom";
import CustomButton from "../../../components/Form/CustomButtom";
import { Ellipsis, Calendar, Target } from "lucide-react-native";
import { useRouter } from "expo-router";
import { TaskDetailModal } from "../../../components/TaskDetailModal/TaskDetailModal";


export default function Tasks() {
    const router = useRouter();
    const [active, setActive] = React.useState("");
    const [taskDetail, setTaskDetail] = React.useState(null);
    const [openModal, setOpenModal] = React.useState(false);
    
    const tasks = [
        { id: 1, title: "Tirei nota 10 em Matemática", status: "Pendente", date: "12 Jan 2025", points: "3", description: "Estudei bastante para a prova e consegui tirar nota máxima." },
        { id: 2, title: "Finalizar projeto React Native", status: "Aprovada", date: "15 Fev 2025", points: "5", description: "Completei todas as funcionalidades do projeto." },
        { id: 3, title: "Estudar Redux", status: "Rejeitada", date: "20 Mar 2025", points: "2", description: "Não consegui entender bem os conceitos de Redux." },
        { id: 4, title: "Ler livro de JavaScript", status: "Pendente", date: "25 Abr 2025", points: "4", description: "Preciso ler o livro para melhorar minhas habilidades em JavaScript." },
        { id: 5, title: "Participar de hackathon", status: "Aprovada", date: "30 Mai 2025", points: "6", description: "Participei de um hackathon e nosso time ganhou o segundo lugar." },
        { id: 6, title: "Escrever artigo sobre React", status: "Pendente", date: "10 Jun 2025", points: "3", description: "Planejo escrever um artigo detalhado sobre React para o blog." },
    ];

    function handlePress(task){
        setTaskDetail(task);
        setOpenModal(true);
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerContent}>
                <HeaderCustom title="Lista de Tarefas" />
                <CustomButton
                    onPress={() => router.push("/Tasks/NewTask")}
                    width={110}
                    height={34}
                    fontSize={14}
                    type="secondary"
                >
                    + Adicionar
                </CustomButton>
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ height: 30, maxHeight: 30, marginBottom: 20 }}
                contentContainerStyle={{
                    flexDirection: "row",
                    gap: 10,
                    maxHeight: 30,
                }}
            >
                <TouchableOpacity
                    style={[styles.filterButton, (active === "todas" ||  active === "") ? styles.active : null]}
                    onPress={() => setActive("todas")}
                >
                    <Text style={styles.filterText}>Todas </Text>
                    {(active === "todas" || active === "") && (
                        <View style={styles.filterCount}>
                            <Text style={styles.filterCountText}>25</Text>
                        </View>
                    )}
                </TouchableOpacity>
                <TouchableOpacity style={[styles.filterButton, active === "pendentes" ? styles.active : null]}
                    onPress={() => setActive("pendentes")}>
                    <Text style={styles.filterText}>Pendentes</Text>
                    {active === "pendentes" && (
                        <View style={styles.filterCount}>
                            <Text style={styles.filterCountText}>25</Text>
                        </View>
                    )}
                </TouchableOpacity>
                <TouchableOpacity style={[styles.filterButton, active === "aprovadas" ? styles.active : null]}
                    onPress={() => setActive("aprovadas")}>
                    <Text style={styles.filterText}>Aprovadas</Text>
                    {active === "aprovadas" && (
                        <View style={styles.filterCount}>
                            <Text style={styles.filterCountText}>25</Text>
                        </View>
                    )}
                </TouchableOpacity>
                <TouchableOpacity style={[styles.filterButton, active === "rejeitadas" ? styles.active : null]}
                    onPress={() => setActive("rejeitadas")}>
                    <Text style={styles.filterText}>Rejeitadas</Text>
                    {active === "rejeitadas" && (
                        <View style={styles.filterCount}>
                            <Text style={styles.filterCountText}>25</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </ScrollView>
            <View style={{gap: 16, paddingBottom: 140}}>
            {tasks?.map((task, index) => (
                <TouchableOpacity onPress={() => handlePress(task)} style={styles.itemContainer} key={index}>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <Text style={styles.mainText}>
                            {task.title}
                        </Text>
                        <Ellipsis color="#ADADAD" />
                    </View>
                    <View>
                        <CustomButton
                            color="#5F5C0F"
                            backgroundColor="#EAE793"
                            height={24}
                            width={100}
                            fontSize={14}
                        >
                            {task.status}
                        </CustomButton>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                gap: 14,
                                alignItems: "center",
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    gap: 4,
                                    alignItems: "center",
                                }}
                            >
                                <Calendar color="#ADADAD" />
                                <Text style={{ color: "#6B6B6B" }}>
                                    {task.date}
                                </Text>
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    gap: 4,
                                    alignItems: "center",
                                }}
                            >
                                <Target color="#ADADAD" />
                                <Text style={{ color: "#6B6B6B" }}>
                                    {task.points} pontos
                                </Text>
                            </View>
                        </View>
                        <View>
                            <Image
                                style={styles.avatarIcon}
                                source={{
                                    uri: "https://ui-avatars.com/api/?name=Ryan+Rodrigues&background=52A75E&color=EEFFEE&size=36",
                                }}
                            />
                        </View>
                    </View>
                </TouchableOpacity>
            ))}
            </View>

            <Modal visible={openModal} transparent animationType="fade">
                <TaskDetailModal task={taskDetail} setOpenModal={setOpenModal} />
            </Modal>
            
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 30,
        paddingVertical: 50,
        maxWidth: 500,
        backgroundColor: colors.background,
    },
    headerContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 26,
    },
    mainText: {
        fontSize: 18,
        fontFamily: fontFamily.roboto.bold,
        color: colors.black,
    },
    filterContainer: {
        flexDirection: "row",
        gap: 10,
        paddingVertical: 8,
        height: 45,
        backgroundColor: "red",
    },
    infoText: {
        fontSize: 16,
        marginBottom: 20,
        fontFamily: fontFamily.roboto.regular,
    },
    inputContainer: {
        flexDirection: "row",
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
    filterButton: {
        backgroundColor: "#D0D0D0",
        color: colors.white,
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 24,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    filterText: {
        fontFamily: fontFamily.roboto.regular,
        fontSize: 14,
        color: colors.white,
    },
    active: {
        backgroundColor: colors.primary,
        paddingRight: 5,
    },
    filterCount: {
        backgroundColor: colors.secondary,
        borderRadius: 24,
        padding: 4,
        marginLeft: 4,
    },
    filterCountText: {
        fontFamily: fontFamily.roboto.bold,
        fontSize: 12,
        color: colors.primary,
    },
    itemContainer: {
        gap: 8,
        backgroundColor: colors.white,
        borderRadius: 24,
        borderColor: "#E9E9E9",
        borderWidth: 1,
        height: "auto",
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    avatarIcon: {
        borderRadius: "50%",
        width: 30,
        height: 30,
    },
});
