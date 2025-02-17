import {
    StyleSheet,
    Text,
    View,
    Modal,
    Pressable,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from "react-native";
import { fontFamily } from "../../styles/fontFamily";
import { colors } from "../../styles/color";
import CustomButton from "../Form/CustomButtom";
import React from "react";
import { X } from "lucide-react-native";
export function TaskDetailModal({ task, setOpenModal }) {
    console.log(task);
    const modalRef = React.useRef(null);
    return (
        <TouchableWithoutFeedback onPress={() => setOpenModal(false)}>
            <View style={styles.container}>
                <View style={styles.modal}>
                    {/* create a touchablebutton like a X, that setOpenModal false */}
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
                    <Text style={styles.title}>{task.title}</Text>
                    <Text style={styles.label}>Descrição</Text>
                    <Text style={styles.info}>{task.description}</Text>
                    <View style={{ flexDirection: "row", gap: 80 }}>
                        <View>
                            <Text style={styles.label}>Pontos</Text>
                            <Text style={styles.info}>{task.points}</Text>
                        </View>
                        <View>
                            <Text style={styles.label}>Data de criação</Text>
                            <Text style={styles.info}>{task.date}</Text>
                        </View>
                    </View>
                    <View style={styles.containerButton}>
                        <CustomButton
                            fontSize={18}
                            width={140}
                            height={40}
                            color="#E75E5E"
                            backgroundColor="transparent"
                        >
                            Rejeitar
                        </CustomButton>

                        <CustomButton fontSize={18} width={140} height={40}>
                            Aprovar
                        </CustomButton>
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
