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
import { getFilters, getTask, getTasks } from "../../../services/endpoints";
import { showToast } from "../../../helpers/showToast";
import { formatDate } from "../../../helpers/formatDate";
import { useLoading } from "../../../contexts/LoadingContext";
import Loading from "../../../components/Helpers/Loading";
import PorquinhoTriste from "../../../assets/porquinho-triste.svg";
import { useAuth } from "../../../contexts/AuthContext";
import { enumRole } from "../../../utils/enumRole";
import OtherUserPhoto from "../../../components/UserPhoto/OtherUserPhoto";
import { enumTaskStatus } from "../../../utils/enumTaskStatus";

export default function Tasks() {
    const router = useRouter();
    const [active, setActive] = React.useState("");
    const [taskDetail, setTaskDetail] = React.useState(null);
    const [openModal, setOpenModal] = React.useState(false);
    const [tasks, setTasks] = React.useState(null);
    const [filters, setFilters] = React.useState(null);
    const { isLoading } = useLoading();
    const { user } = useAuth();
    React.useEffect(() => {
        async function fetchTasks() {
            try {
                const response = await getTasks(active, user.familyGroupId);
                if (response.status === 200) {
                    setTasks(response.data);
                }
            } catch (error) {
                showToast("Erro ao carregar tarefas", "error");
                console.log(error.response.data);
            }
        }

        async function fetchFilters() {
            try {
                const response = await getFilters(user.familyGroupId);
                if (response.status === 200) {
                    setFilters(response.data);
                }
            } catch (error) {
                showToast("Erro ao carregar filtros", "error");
                console.log(error);
            }
        }

        fetchTasks();
        if (user?.role === enumRole.PARENT) {
            fetchFilters();
        }
    }, [active]);

    function handlePress(task) {
        router.push({
            pathname: "/Tasks/NewTask",
            params: { taskId: task.id },
        });
    }

    return (
        <>
            {isLoading && <Loading />}
            <ScrollView style={styles.container}>
                <View style={styles.headerContent}>
                    <HeaderCustom title="Central de Ações" />
                    {user?.role === enumRole.PARENT ? (
                        <CustomButton
                            onPress={() => router.push("/Tasks/NewTask")}
                            width={110}
                            height={34}
                            fontSize={14}
                            type="secondary"
                        >
                            + Adicionar
                        </CustomButton>
                    ) : (
                        <CustomButton
                            onPress={() => router.push("/Tasks/NewTask")}
                            width={110}
                            height={34}
                            fontSize={14}
                            type="secondary"
                        >
                            + Sugerir
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
                    {user?.role === enumRole.PARENT && (
                        <>
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
                            {filters?.map((filter, index) => (
                                <TouchableOpacity
                                    style={[
                                        styles.filterButton,
                                        active === filter.value
                                            ? styles.active
                                            : null,
                                    ]}
                                    key={index}
                                    onPress={() => setActive(filter.value)}
                                >
                                    <Text style={styles.filterText}>
                                        {filter.label}
                                    </Text>
                                    {active === filter.value && (
                                        <View style={styles.filterCount}>
                                            <Text
                                                style={styles.filterCountText}
                                            >
                                                {tasks?.length}
                                            </Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </>
                    )}
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
                                Nenhuma ação cadastrada
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
        borderRadius: 50,
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
        borderRadius: 50,
        width: 30,
        height: 30,
    },
});
