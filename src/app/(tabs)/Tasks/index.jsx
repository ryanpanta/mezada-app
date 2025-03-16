import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    Modal,
    ActivityIndicator,
} from "react-native";
import React from "react";
import { colors } from "../../../styles/color";
import { fontFamily } from "../../../styles/fontFamily";
import HeaderCustom from "../../../components/HeaderCustom";
import CustomButton from "../../../components/Form/CustomButtom";
import { Ellipsis, Calendar, Target } from "lucide-react-native";
import { useRouter } from "expo-router";
import { TaskDetailModal } from "../../../components/TaskDetailModal/TaskDetailModal";
import { getTask, getTasks } from "../../../services/endpoints";
import { showToast } from "../../../helpers/showToast";
import { formatDate } from "../../../helpers/formatDate";
import { useLoading } from "../../../contexts/LoadingContext";
import Loading from "../../../components/Helpers/Loading";
import PorquinhoTriste from "../../../assets/porquinho-triste.svg";
import { useAuth } from "../../../contexts/AuthContext";
import { enumRole } from "../../../utils/enumRole";
import OtherUserPhoto from "../../../components/UserPhoto/OtherUserPhoto";

export default function Tasks() {
    const router = useRouter();
    const [active, setActive] = React.useState("");
    const [taskDetail, setTaskDetail] = React.useState(null);
    const [openModal, setOpenModal] = React.useState(false);
    const [tasks, setTasks] = React.useState(null);
    console.log("TASKS ", tasks);
    const { isLoading } = useLoading();
    const { user } = useAuth();

    React.useEffect(() => {
        async function fetchTasks() {
            try {
                const response = await getTasks(active);
                if (response.status === 200) {
                    setTasks(response.data);
                }
            } catch (error) {
                showToast("Erro ao carregar tarefas", "error");
                console.log(error);
            }
        }
        fetchTasks();
    }, [active]);

    function handlePress(task) {
        setTaskDetail(task);
        setOpenModal(true);
    }

    function getStatusLabel(status) {
        if (status === 1) {
            return {
                label: "Pendente",
                color: "#5F5C0F",
                backgroundColor: "#EAE793",
            };
        }
        if (status === 2) {
            return {
                label: "Aprovada",
                color: "#007F12",
                backgroundColor: "#7ED68A",
            };
        }
        if (status === 3) {
            return {
                label: "Rejeitada",
                color: "#720303",
                backgroundColor: "#F1A0A0",
            };
        }
    }
    console.log(isLoading ? "simmm" : "nao");
    return (
        <>
            {isLoading && <Loading />}
            <ScrollView style={styles.container}>
                <View style={styles.headerContent}>
                    <HeaderCustom title="Lista de Tarefas" />
                    {user?.role === enumRole.CHILD && (
                        <CustomButton
                            onPress={() => router.push("/Tasks/NewTask")}
                            width={110}
                            height={34}
                            fontSize={14}
                            type="secondary"
                        >
                            + Adicionar
                        </CustomButton>
                    )}
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
                        style={[
                            styles.filterButton,
                            active === "" ? styles.active : null,
                        ]}
                        onPress={() => setActive("")}
                    >
                        <Text style={styles.filterText}>Todas </Text>
                        {active === "" && (
                            <View style={styles.filterCount}>
                                <Text style={styles.filterCountText}>
                                    {tasks?.length}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            active === 1 ? styles.active : null,
                        ]}
                        onPress={() => setActive(1)}
                    >
                        <Text style={styles.filterText}>Pendentes</Text>
                        {active === 1 && (
                            <View style={styles.filterCount}>
                                <Text style={styles.filterCountText}>
                                    {tasks?.length}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            active === 2 ? styles.active : null,
                        ]}
                        onPress={() => setActive(2)}
                    >
                        <Text style={styles.filterText}>Aprovadas</Text>
                        {active === 2 && (
                            <View style={styles.filterCount}>
                                <Text style={styles.filterCountText}>
                                    {tasks?.length}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            active === 3 ? styles.active : null,
                        ]}
                        onPress={() => setActive(3)}
                    >
                        <Text style={styles.filterText}>Rejeitadas</Text>
                        {active === 3 && (
                            <View style={styles.filterCount}>
                                <Text style={styles.filterCountText}>
                                    {tasks?.length}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </ScrollView>

                <View style={{ gap: 16, paddingBottom: 140 }}>
                    {tasks && tasks.length > 0 ? (
                        tasks?.map((task, index) => (
                            <TouchableOpacity
                                onPress={() => handlePress(task)}
                                style={styles.itemContainer}
                                key={index}
                            >
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
                                        color={
                                            getStatusLabel(task.status).color
                                        }
                                        backgroundColor={
                                            getStatusLabel(task.status)
                                                .backgroundColor
                                        }
                                        height={24}
                                        width={100}
                                        fontSize={14}
                                    >
                                        {getStatusLabel(task.status).label}
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
                                                {formatDate(task.createdAt)}
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
                                        <OtherUserPhoto id={task.userId} />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))
                    ) : tasks !== null && tasks.length === 0 ? (
                        <View
                            style={{
                                alignItems: "center",
                                flex: 1,
                                justifyContent: "center",
                                height: 600,
                            }}
                        >
                            <PorquinhoTriste width={60} height={60} />
                            <Text style={{ marginTop: 10, fontSize: 16 }}>
                                Nenhuma tarefa cadastrada
                            </Text>
                        </View>
                    ) : null}
                </View>

                <Modal visible={openModal} transparent animationType="fade">
                    <TaskDetailModal
                        task={taskDetail}
                        setOpenModal={setOpenModal}
                    />
                </Modal>
            </ScrollView>
        </>
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
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.secondary,
        borderRadius: "50%",
        width: 20,
        height: 20,
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
