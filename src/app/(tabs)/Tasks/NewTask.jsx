import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import HeaderCustom from "../../../components/HeaderCustom";
import { colors } from "../../../styles/color";
import { fontFamily } from "../../../styles/fontFamily";
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomButton from "../../../components/Form/CustomButtom";
import { useRouter, useLocalSearchParams } from "expo-router";
import { showToast } from "../../../helpers/showToast";
import { createTask, getChildren, getTask } from "../../../services/endpoints";
import { ChevronDown, MoveLeft } from "lucide-react-native";
import { enumCategory } from "../../../utils/enumCategory";
import OtherUserPhoto from "../../../components/UserPhoto/OtherUserPhoto";
import { useAuth } from "../../../contexts/AuthContext";

const schema = yup.object().shape({
    title: yup.string().required("O título é obrigatório").max(100),
    description: yup.string().required("A descrição é obrigatória").max(500),
    category: yup
        .number()
        .required("A categoria é obrigatória")
        .oneOf(
            [enumCategory.REWARD, enumCategory.PENALTY],
            "Categoria inválida"
        ),
    initialValue: yup.number().required("O valor inicial é obrigatório"),
    defaultIncrement: yup
        .number()
        .required("A recompensa padrão é obrigatória"),
    limitValue: yup.number().required("O limitValuee é obrigatório"),
    users: yup.array().min(1, "Selecione pelo menos um usuário"),
});

const categories = [
    { value: enumCategory.REWARD, label: "Recompensa" },
    { value: enumCategory.PENALTY, label: "Penalidade" },
];

export default function NewTask() {
    const { taskId } = useLocalSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showUsersDropdown, setShowUsersDropdown] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [userRewards, setUserRewards] = useState({});
    const [userBalances, setUserBalances] = useState({});
    const [selectedCategory, setSelectedCategory] = useState(categories[0]);
    const [users, setUsers] = useState([]);

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            category: enumCategory.REWARD,
            initialValue: "0",
            defaultIncrement: "10",
            limitValue: "200",
        },
    });

    const router = useRouter();
    const currentCategory = watch("category");
    const defaultIncrementValue = watch("defaultIncrement");

    const { user } = useAuth();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getChildren(user.familyGroupId);
                setUsers(response.data);
            } catch (error) {
                showToast(
                    error.response?.data?.message || "Erro ao buscar usuários",
                    "error"
                );
                console.log(error.response.data);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        const category = categories.find((c) => c.value === currentCategory);
        if (category) {
            setSelectedCategory(category);

            if (category.value === enumCategory.REWARD) {
                setValue("initialValue", "0");
                setValue("limitValue", "200");
            } else if (category.value === enumCategory.PENALTY) {
                setValue("limitValue", "0");
            }
        }
    }, [currentCategory]);

    useEffect(() => {
        if (defaultIncrementValue && selectedUsers.length > 0) {
            const newUserRewards = {};
            selectedUsers.forEach((user) => {
                if (!userRewards[user.id]) {
                    newUserRewards[user.id] = defaultIncrementValue;
                }
            });
            setUserRewards((prev) => ({ ...prev, ...newUserRewards }));
        }
    }, [defaultIncrementValue]);

    useEffect(() => {
        const fetchTaskDetails = async () => {
            if (!taskId) return;

            setIsLoading(true);
            try {
                const response = await getTask(taskId);
                if (response.status === 200) {
                    const taskData = response.data;
                    console.log(taskData);

                    // Set form values
                    setValue("title", taskData.title);
                    setValue("description", taskData.description);
                    setValue(
                        "category",
                        taskData.category === "Reward"
                            ? enumCategory.REWARD
                            : enumCategory.PENALTY
                    );
                    setValue("initialValue", taskData.initialValue.toString());
                    setValue(
                        "defaultIncrement",
                        taskData.defaultIncrement.toString()
                    );
                    setValue("limitValue", taskData.limitValue.toString());

                    // Set selected users
                    setSelectedUsers(
                        taskData.children.map((child) => ({
                            id: child.childId,
                            name: child.childName,
                        }))
                    );

                    // Set rewards and balances from children data
                    const newUserRewards = {};
                    const newUserBalances = {};
                    taskData.children.forEach((child) => {
                        newUserRewards[child.childId] =
                            child.customIncrement.toString();
                        newUserBalances[child.childId] =
                            child.currentBalance.toString();
                    });
                    setUserRewards(newUserRewards);
                    setUserBalances(newUserBalances);
                }
            } catch (error) {
                showToast(
                    error.response?.data?.message ||
                        "Erro ao carregar detalhes da tarefa",
                    "error"
                );
                console.log(error.response?.data);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTaskDetails();
    }, [taskId]);

    async function handleNewTask(data) {
        try {
            const response = await createTask({
                ...data,
                childIds: selectedUsers.map((user) => user.id),
            });
            if (response.status === 201) {
                showToast("Tarefa criada com sucesso!", "success");
                router.replace("/Tasks");
            }
        } catch (error) {
            console.log(error.response.data);
            showToast(
                "Erro ao criar tarefa, tente novamente mais tarde",
                "error"
            );
        }
    }

    const toggleUserSelection = (user) => {
        if (selectedUsers.find((u) => u.id === user.id)) {
            setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
            // Remove user from rewards and balances
            const newUserRewards = { ...userRewards };
            const newUserBalances = { ...userBalances };
            delete newUserRewards[user.id];
            delete newUserBalances[user.id];
            setUserRewards(newUserRewards);
            setUserBalances(newUserBalances);
        } else {
            setSelectedUsers([...selectedUsers, user]);
            // Set default values for new user
            setUserRewards((prev) => ({
                ...prev,
                [user.id]: defaultIncrementValue,
            }));
            setUserBalances((prev) => ({
                ...prev,
                [user.id]: "0",
            }));
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={{ marginBottom: 26 }}>
                <HeaderCustom title={taskId ? "Editar Ação" : "Criar Ação"} />
            </View>

            <View style={styles.formContainer}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Título</Text>
                    <Controller
                        control={control}
                        name="title"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={styles.input}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                value={value}
                                placeholder="Escreva o título da tarefa"
                            />
                        )}
                    />
                    {errors.title && (
                        <Text style={styles.errorText}>
                            {errors.title.message}
                        </Text>
                    )}
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Descrição</Text>
                    <Controller
                        control={control}
                        name="description"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                value={value}
                                placeholder="Uma descrição para a tarefa"
                                multiline
                                numberOfLines={3}
                            />
                        )}
                    />
                </View>

                <View style={styles.row}>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={styles.label}>Categoria</Text>
                        <TouchableOpacity
                            style={styles.dropdown}
                            onPress={() =>
                                setShowCategoryDropdown(!showCategoryDropdown)
                            }
                        >
                            <Text style={styles.dropdownText}>
                                {selectedCategory.label}
                            </Text>
                            <ChevronDown size={16} color="#D2D2D2" />
                        </TouchableOpacity>
                        {showCategoryDropdown && (
                            <View style={styles.dropdownContent}>
                                {categories.map((category) => (
                                    <TouchableOpacity
                                        key={category.value}
                                        style={[
                                            styles.dropdownItem,
                                            selectedCategory.value ===
                                                category.value &&
                                                styles.selectedItem,
                                        ]}
                                        onPress={() => {
                                            setValue(
                                                "category",
                                                category.value
                                            );
                                            setSelectedCategory(category);
                                            setShowCategoryDropdown(false);
                                        }}
                                    >
                                        <Text>{category.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={styles.label}>Valor inicial</Text>
                        <Controller
                            control={control}
                            name="initialValue"
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
                                <TextInput
                                    style={[
                                        styles.input,
                                        selectedCategory.value ===
                                            enumCategory.REWARD &&
                                            styles.disabledInput,
                                    ]}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    value={value}
                                    placeholder="0"
                                    keyboardType="numeric"
                                    editable={
                                        selectedCategory.value !==
                                        enumCategory.REWARD
                                    }
                                />
                            )}
                        />
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={styles.label}>
                            {selectedCategory.value === enumCategory.REWARD
                                ? "Recompensa"
                                : "Penalidade"}{" "}
                            padrão
                        </Text>
                        <Controller
                            control={control}
                            name="defaultIncrement"
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
                                <TextInput
                                    style={styles.input}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    value={value}
                                    placeholder="10"
                                    keyboardType="numeric"
                                />
                            )}
                        />
                    </View>

                    <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={styles.label}>Limite</Text>
                        <Controller
                            control={control}
                            name="limitValue"
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
                                <TextInput
                                    style={[
                                        styles.input,
                                        selectedCategory.value ===
                                            enumCategory.PENALTY &&
                                            styles.disabledInput,
                                    ]}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    value={value}
                                    placeholder="200"
                                    keyboardType="numeric"
                                    editable={
                                        selectedCategory.value !==
                                        enumCategory.PENALTY
                                    }
                                />
                            )}
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Usuários</Text>
                    <TouchableOpacity
                        style={styles.dropdown}
                        onPress={() => setShowUsersDropdown(!showUsersDropdown)}
                    >
                        <Text style={styles.dropdownText}>
                            {selectedUsers.length
                                ? `${selectedUsers.length} selecionados`
                                : "Selecione os usuários"}
                        </Text>
                        <ChevronDown size={16} color="#D2D2D2" />
                    </TouchableOpacity>
                    {showUsersDropdown && (
                        <View style={styles.dropdownContent}>
                            {users.map((user) => (
                                <TouchableOpacity
                                    key={user.id}
                                    style={[
                                        styles.dropdownItem,
                                        selectedUsers.find(
                                            (u) => u.id === user.id
                                        ) && styles.selectedItem,
                                    ]}
                                    onPress={() => toggleUserSelection(user)}
                                >
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            gap: 10,
                                        }}
                                    >
                                        <OtherUserPhoto
                                            id={user.id}
                                            size={24}
                                        />
                                        <Text style={styles.userName}>
                                            {user.name}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                {selectedUsers.map((user) => (
                    <View key={user.id} style={styles.selectedUserContainer}>
                        <View style={styles.userInfo}>
                            <OtherUserPhoto id={user.id} size={24} />
                            <Text style={styles.userName}>{user.name}</Text>
                        </View>
                        <View style={styles.userControls}>
                            <View style={styles.rewardContainer}>
                                <Text style={styles.label}>
                                    {selectedCategory.value ===
                                    enumCategory.REWARD
                                        ? "Recompensa"
                                        : "Penalidade"}
                                </Text>
                                <TextInput
                                    style={styles.rewardInput}
                                    value={userRewards[user.id]}
                                    onChangeText={(value) =>
                                        setUserRewards({
                                            ...userRewards,
                                            [user.id]: value,
                                        })
                                    }
                                    placeholder="10"
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={styles.balanceContainer}>
                                <Text style={styles.label}>Saldo</Text>
                                <TextInput
                                    style={styles.balanceInput}
                                    value={userBalances[user.id]}
                                    onChangeText={(value) =>
                                        setUserBalances({
                                            ...userBalances,
                                            [user.id]: value,
                                        })
                                    }
                                    placeholder="40"
                                    keyboardType="numeric"
                                />
                            </View>
                            <CustomButton
                                height={30}
                                fontSize={12}
                                type="secondary"
                            >
                                Contabilizar
                            </CustomButton>
                        </View>
                    </View>
                ))}

                <CustomButton
                    height={40}
                    fontSize={16}
                    onPress={handleSubmit(handleNewTask)}
                    style={styles.saveButton}
                >
                    Salvar Tarefa
                </CustomButton>
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
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 26,
    },
    title: {
        marginLeft: 10,
        fontFamily: "Playfair Display",
        fontSize: 20,
        fontWeight: "700",
        color: "#000",
    },
    formContainer: {
        flex: 1,
        backgroundColor: "#FFF",
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: "#E9E9E9",
        marginBottom: 150,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 12,
        letterSpacing: 1.2,
        color: "#878787",
        marginBottom: 5,
        fontFamily: fontFamily.roboto.regular,
        textTransform: "uppercase",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ECECEC",
        borderRadius: 4,
        padding: 10,
        fontSize: 16,
        fontFamily: fontFamily.roboto.regular,
        color: "#232323",
        backgroundColor: "#F5F9F4",
    },
    textArea: {
        height: 85,
        textAlignVertical: "top",
    },
    row: {
        flexDirection: "row",
        gap: 20,
    },
    dropdown: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ECECEC",
        borderRadius: 4,
        padding: 10,
        backgroundColor: "#F5F9F4",
    },
    dropdownText: {
        fontSize: 16,
        fontFamily: fontFamily.roboto.regular,
        color: "#232323",
    },
    dropdownContent: {
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        backgroundColor: "#FFF",
        borderWidth: 1,
        borderColor: "#ECECEC",
        borderRadius: 4,
        zIndex: 1000,
        maxHeight: 200,
    },
    dropdownItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ECECEC",
        flexDirection: "row",
        alignItems: "center",
    },
    selectedItem: {
        backgroundColor: "#EEFFEE",
    },
    userAvatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "#D9D9D9",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    userInitials: {
        fontSize: 8,
        color: "#C6EEC5",
        fontFamily: "Inter",
    },
    selectedUserContainer: {
        borderTopWidth: 1,
        borderTopColor: "#ECECEC",
        paddingVertical: 15,
        marginBottom: 40,
    },
    userInfo: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        gap: 10,
    },
    userName: {
        fontSize: 12,
        fontFamily: fontFamily.roboto.regular,
        color: "#232323",
    },
    userControls: {
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: 10,
    },

    rewardInput: {
        fontFamily: fontFamily.roboto.regular,
        width: 80,
        borderWidth: 1,
        borderColor: "#ECECEC",
        borderRadius: 4,
        padding: 10,
        fontSize: 16,
        backgroundColor: "#F5F9F4",
    },
    balanceInput: {
        fontFamily: fontFamily.roboto.regular,
        width: 80,
        borderWidth: 1,
        borderColor: "#ECECEC",
        borderRadius: 4,
        padding: 10,
        fontSize: 16,
        backgroundColor: "#F5F9F4",
    },
    accountButton: {
        backgroundColor: "#EEFFEE",
        borderWidth: 1,
        borderColor: "#52A75E",
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 5,
    },
    accountButtonText: {
        fontSize: 10,
        fontFamily: fontFamily.roboto.bold,
        color: "#52A75E",
    },
    errorText: {
        color: "#ff375b",
        fontSize: 14,
        fontFamily: fontFamily.roboto.regular,
        marginTop: 4,
    },
    disabledInput: {
        backgroundColor: "#F5F5F5",
        color: "#999",
    },
});
