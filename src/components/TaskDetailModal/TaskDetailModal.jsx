import {
    StyleSheet,
    Text,
    View,
    Pressable,
    TouchableWithoutFeedback,
    Alert,
} from "react-native";
import { fontFamily } from "../../styles/fontFamily";
import { colors } from "../../styles/color";
import CustomButton from "../Form/CustomButtom";
import React from "react";
import { X } from "lucide-react-native";
import { formatDate } from "../../helpers/formatDate";
import { useAuth } from "../../contexts/AuthContext";
import { enumRole } from "../../utils/enumRole";
import { showToast } from "../../helpers/showToast";
import { deleteTask, setAsApprovedTask, setAsRejectedTask } from "../../services/endpoints";
import { useRouter } from "expo-router";
export function TaskDetailModal({ task, setOpenModal }) {
    const { user } = useAuth();
    const modalRef = React.useRef(null);
    const router = useRouter();
    async function handleDeleteTask() {
        Alert.alert(
            "Confirmação",
            "Deseja realmente excluir esta tarefa?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const response = await deleteTask(task.id);
                            if (response.status === 204) {
                                showToast("Tarefa excluída com sucesso", "success");
                                setOpenModal(false);
                                router.replace("/Tasks"); // Garante atualização da página
                            }
                        } catch (error) {
                            showToast("Erro ao excluir tarefa", "error");
                            console.log(error);
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    }

    async function handleChangeApprovedTask() {
        Alert.alert(
            "Confirmação",
            "Deseja realmente aprovar esta tarefa?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Aprovar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const response = await setAsApprovedTask(task.id);
                            if (response.status === 204) {
                                showToast("Tarefa aprovada com sucesso", "success");
                                setOpenModal(false);
                                router.replace("/Tasks");
                            }
                        } catch (error) {
                            showToast("Erro ao aceitar tarefa", "error");
                            console.log(error);
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    }

    async function handleChangeRejectedTask() {
        Alert.alert(
            "Confirmação",
            "Deseja realmente rejeitar esta tarefa?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Rejeitar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const response = await setAsRejectedTask(task.id);
                            if (response.status === 204) {
                                showToast("Tarefa rejeitada com sucesso", "success");
                                setOpenModal(false);
                                router.replace("/Tasks");
                            }
                        } catch (error) {
                            showToast("Erro ao rejeitar tarefa", "error");
                            console.log(error);
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    }

    return (
        <TouchableWithoutFeedback onPress={() => setOpenModal(false)}>
            <View style={styles.container}>
                <View style={styles.modal}>
                    
                    <Pressable
                        style={{
                            position: "absolute",
                            right: 10,
                            top: 10,
                            padding: 10,
                        }}
                        onPress={() => setOpenModal(false)}
                    >
                        <X color={colors.gray[600]} size={20} />
                    </Pressable>
                    <Text style={styles.label}>Título</Text>
                    <Text style={styles.title}>{task?.title}</Text>
                    <Text style={styles.label}>Descrição</Text>
                    <Text style={styles.info}>{task?.description}</Text>
                    <View style={{ flexDirection: "row", gap: 80 }}>
                        <View>
                            <Text style={styles.label}>Pontos</Text>
                            <Text style={styles.info}>{task?.points}</Text>
                        </View>
                        <View>
                            <Text style={styles.label}>Data de criação</Text>
                            <Text style={styles.info}>
                                {formatDate(task?.createdAt)}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.containerButton}>
                        {user.role === enumRole.PARENT ? (
                            <>
                                <CustomButton
                                    fontSize={18}
                                    width={140}
                                    height={40}
                                    color="#E75E5E"
                                    backgroundColor="transparent"
                                    onPress={handleChangeRejectedTask}
                                >
                                    Rejeitar
                                </CustomButton>

                                <CustomButton
                                    fontSize={18}
                                    width={140}
                                    height={40}
                                    onPress={handleChangeApprovedTask}
                                >
                                    Aprovar
                                </CustomButton>
                            </>
                        ) : (
                            <CustomButton
                                    fontSize={16}
                                    width={120}
                                    height={40}
                                    color="#E75E5E"
                                    backgroundColor="#FFF2F2"
                                    onPress={handleDeleteTask}
                                >
                                    Excluir
                                </CustomButton>
                        )}
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
    },

    modal: {
        justifyContent: "center",
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingVertical: 26,
        width: "80%",
        borderRadius: 24,
        borderWidth: 1,
        borderColor: "#E9E9E9",
    },

    title: {
        fontSize: 20,
        fontFamily: fontFamily.roboto.medium,
        marginBottom: 24,
    },

    info: {
        fontSize: 16,
        marginBottom: 24,
    },

    passwordContainer: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 8,
        backgroundColor: "#eee",
        width: "90%",
    },

    password: {
        textAlign: "center",
        fontSize: 20,
        fontWeight: "bold",
    },

    containerButton: {
        width: "90%",
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },

    backButton: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        padding: 10,
    },

    saveButton: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        padding: 10,
        backgroundColor: "#392de9",
        borderRadius: 8,
    },
    label: {
        fontFamily: fontFamily.roboto.regular,
        fontSize: 12,
        textTransform: "uppercase",
        letterSpacing: 1.3,
        color: colors.gray[400],
    },
});
