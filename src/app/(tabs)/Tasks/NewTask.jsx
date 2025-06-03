import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Pressable,
    Alert,
    Modal,
    Dimensions,
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
import {
    createTask,
    getChildren,
    getTask,
    account,
    deleteTask,
    removeUserFromTask,
    getHistory,
    revertHistory,
} from "../../../services/endpoints";
import { ChevronDown, MoveLeft, History } from "lucide-react-native";
import { enumCategory } from "../../../utils/enumCategory";
import OtherUserPhoto from "../../../components/UserPhoto/OtherUserPhoto";
import { useAuth } from "../../../contexts/AuthContext";
import Loading from "../../../components/Helpers/Loading";
import { useLoading } from "../../../contexts/LoadingContext";
import { enumRole } from "../../../utils/enumRole";
import * as d3 from "d3";
import Svg, { Path, G, Text as SvgText } from "react-native-svg";

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

const DonutChart = ({ limitValue, currentBalance, bonusBalance }) => {
    const width = Dimensions.get("window").width * 0.5;
    const height = width;
    const radius = Math.min(width, height) / 2;
    const centerX = width / 2;
    const centerY = height / 2;

    // Calculate values for the chart
    const totalBalance = currentBalance + bonusBalance;
    const remainingValue = Math.max(0, limitValue - totalBalance);

    // Create pie data with three segments
    const data = [
        { value: currentBalance, color: colors.primary, label: "Saldo Atual" },
        { value: bonusBalance, color: "#000080", label: "Bônus" },
        { value: remainingValue, color: "#ECECEC", label: "Restante" },
    ];

    // Create pie generator
    const pie = d3
        .pie()
        .value((d) => d.value)
        .sort(null);

    // Create arc generator
    const arc = d3
        .arc()
        .innerRadius(radius * 0.6)
        .outerRadius(radius * 0.8);

    // Generate paths
    const paths = pie(data).map((d, i) => ({
        path: arc({
            startAngle: d.startAngle,
            endAngle: d.endAngle,
            padAngle: 0.02,
        }),
        color: data[i].color,
        label: data[i].label,
        value: data[i].value,
    }));

    return (
        <View style={styles.chartContainer}>
            <Svg width={width} height={height}>
                <G transform={`translate(${centerX}, ${centerY})`}>
                    {paths.map((item, index) => (
                        <Path key={index} d={item.path} fill={item.color} />
                    ))}
                    <SvgText
                        x="-14"
                        y="-5"
                        fontSize="24"
                        fontFamily={fontFamily.roboto.bold}
                        fill={colors.black}
                        textAnchor="middle"
                        alignmentBaseline="middle"
                    >
                        R${totalBalance}
                    </SvgText>
                    <SvgText
                        x="-14"
                        y="20"
                        fontSize="14"
                        fontFamily={fontFamily.roboto.regular}
                        fill="#6B6B6B"
                        textAnchor="middle"
                        alignmentBaseline="middle"
                    >
                        de R${limitValue}
                    </SvgText>
                </G>
            </Svg>
            <View style={styles.legendContainer}>
                {data.map((item, index) => (
                    <View key={index} style={styles.legendItem}>
                        <View
                            style={[
                                styles.legendColor,
                                { backgroundColor: item.color },
                            ]}
                        />
                        <Text style={styles.legendText}>
                            {item.label}: {item.value}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

export default function NewTask() {
    const { isLoading } = useLoading();
    const { taskId } = useLocalSearchParams();
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showUsersDropdown, setShowUsersDropdown] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [userRewards, setUserRewards] = useState({});
    const [userBalances, setUserBalances] = useState({});
    const [selectedCategory, setSelectedCategory] = useState(categories[0]);
    const [users, setUsers] = useState([]);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [history, setHistory] = useState([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [bonusBalance, setBonusBalance] = useState(0);
    const [task, setTask] = useState(null);

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
            if (user?.role === enumRole.CHILD) return;

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

    const fetchTaskDetails = async () => {
        if (!taskId) return;

        try {
            const response = await getTask(taskId);
            if (response.status === 200) {
                const taskData = response.data;
                setTask(taskData);
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

                if (user?.role === enumRole.CHILD) {
                    // Find the current user's assignment
                    const userAssignment = taskData.children?.find(
                        (child) => child.childId === user.id
                    );
                    if (userAssignment) {
                        setUserBalances({
                            [user.id]: userAssignment.currentBalance.toString(),
                        });
                        // Store bonus balance in state
                        setBonusBalance(userAssignment.bonusBalance || 0);
                    }
                } else {
                    // Set selected users
                    setSelectedUsers(
                        taskData.children?.map((child) => ({
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
            }
        } catch (error) {
            showToast(
                error.response?.data?.message ||
                    "Erro ao carregar detalhes da tarefa",
                "error"
            );
            console.log(error.response?.data);
            console.log(error);
        }
    };

    useEffect(() => {
        fetchTaskDetails();
    }, [taskId]);

    const fetchHistory = async () => {
        setIsLoadingHistory(true);
        try {
            const response = await getHistory(taskId);
            if (response.status === 200) {
                setHistory(response.data);
            }
        } catch (error) {
            showToast(
                error.response?.data?.message || "Erro ao carregar histórico",
                "error"
            );
            console.log(error.response?.data);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    const handleRevertHistory = async (historyId) => {
        try {
            const response = await revertHistory(historyId);
            if (response.status === 200) {
                showToast("Histórico revertido com sucesso!", "success");
                await Promise.all([
                    fetchHistory(),
                    fetchTaskDetails(), // Refetch task details to update balances
                ]);
            }
        } catch (error) {
            showToast(
                error.response?.data?.message || "Erro ao reverter histórico",
                "error"
            );
            console.log(error.response?.data);
        }
    };

    async function handleNewTask(data) {
        try {
            const response = await createTask({
                ...data,
                id: taskId ?? null,
                children: selectedUsers?.map((user) => {
                    return {
                        childId: user.id,
                        customIncrement: userRewards[user.id],
                    };
                }),
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

    async function handleAccount(userId) {
        try {
            const response = await account({
                childId: userId,
                taskId: taskId,
            });

            if (response.status === 200) {
                showToast("Saldo atualizado com sucesso!", "success");

                setUserBalances((prev) => ({
                    ...prev,
                    [userId]:
                        selectedCategory.value === enumCategory.REWARD
                            ? String(
                                  Number(userBalances[userId]) +
                                      Number(userRewards[userId])
                              )
                            : String(
                                  Number(userBalances[userId]) -
                                      Number(userRewards[userId])
                              ),
                }));
            }
        } catch (error) {
            console.log(error.response.data);
        }
    }

    const handleDeleteTask = async (taskId) => {
        try {
            Alert.alert(
                "Excluir Tarefa",
                "Tem certeza que deseja excluir esta tarefa?",
                [
                    {
                        text: "Cancelar",
                        style: "cancel",
                    },
                    {
                        text: "Excluir",
                        onPress: async () => {
                            try {
                                await deleteTask(taskId);
                                showToast(
                                    "Tarefa excluída com sucesso!",
                                    "success"
                                );
                                router.replace("/Tasks");
                            } catch (error) {
                                console.log(error.response.data);
                                showToast(
                                    "Erro ao excluir tarefa, tente novamente mais tarde",
                                    "error"
                                );
                            }
                        },
                        style: "destructive",
                    },
                ]
            );
        } catch (error) {
            console.log(error.response.data);
            showToast(
                "Erro ao excluir tarefa, tente novamente mais tarde",
                "error"
            );
        }
    };

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
                [user.id]:
                    selectedCategory.value === enumCategory.PENALTY
                        ? watch("initialValue")
                        : "0",
            }));
        }
        setShowUsersDropdown(false); // Close dropdown after selection
    };

    const handleDeleteUser = async (userId) => {
        try {
            if (taskId) {
                // Modo edição - precisa remover do banco
                await removeUserFromTask({
                    taskId: taskId,
                    childId: userId,
                });

                // Remove do estado local
                setSelectedUsers(
                    selectedUsers.filter((user) => user.id !== userId)
                );

                // Remove dos estados de recompensas e saldos
                const newUserRewards = { ...userRewards };
                const newUserBalances = { ...userBalances };
                delete newUserRewards[userId];
                delete newUserBalances[userId];
                setUserRewards(newUserRewards);
                setUserBalances(newUserBalances);

                showToast("Usuário removido com sucesso!", "success");
            } else {
                // Modo criação - remove apenas do estado local
                setSelectedUsers(
                    selectedUsers.filter((user) => user.id !== userId)
                );

                // Remove dos estados de recompensas e saldos
                const newUserRewards = { ...userRewards };
                const newUserBalances = { ...userBalances };
                delete newUserRewards[userId];
                delete newUserBalances[userId];
                setUserRewards(newUserRewards);
                setUserBalances(newUserBalances);
            }
        } catch (error) {
            console.log(error.response?.data);
            showToast(
                "Erro ao remover usuário, tente novamente mais tarde",
                "error"
            );
        }
    };

    return (
        <>
            {isLoading && <Loading />}
            <ScrollView style={styles.container}>
                <Pressable
                    style={{ flex: 1 }}
                    onPress={() => {
                        setShowUsersDropdown(false);
                        setShowCategoryDropdown(false);
                    }}
                >
                    <View style={{ marginBottom: 26 }}>
                        <HeaderCustom
                            title={taskId ? "Editar Ação" : "Criar Ação"}
                        />
                    </View>

                    <View style={styles.formContainer}>
                        {user?.role === enumRole.PARENT && taskId && (
                            <View style={styles.historyButtonContainer}>
                                <CustomButton
                                    height={40}
                                    fontSize={16}
                                    type="secondary"
                                    onPress={() => {
                                        fetchHistory();
                                        setShowHistoryModal(true);
                                    }}
                                >
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            gap: 8,
                                        }}
                                    >
                                        <History
                                            size={20}
                                            color={colors.primary}
                                        />
                                        <Text style={{ color: colors.primary }}>
                                            Histórico
                                        </Text>
                                    </View>
                                </CustomButton>
                            </View>
                        )}

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Título</Text>
                            <Controller
                                control={control}
                                name="title"
                                render={({
                                    field: { onChange, onBlur, value },
                                }) => (
                                    <TextInput
                                        style={[
                                            styles.input,
                                            user?.role === enumRole.CHILD &&
                                                styles.disabledInput,
                                        ]}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        value={value}
                                        placeholder="Escreva o título da tarefa"
                                        editable={user?.role !== enumRole.CHILD}
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
                                render={({
                                    field: { onChange, onBlur, value },
                                }) => (
                                    <TextInput
                                        style={[
                                            styles.input,
                                            styles.textArea,
                                            user?.role === enumRole.CHILD &&
                                                styles.disabledInput,
                                        ]}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        value={value}
                                        placeholder="Uma descrição para a tarefa"
                                        multiline
                                        numberOfLines={3}
                                        editable={user?.role !== enumRole.CHILD}
                                    />
                                )}
                            />
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={styles.label}>Categoria</Text>
                                {user?.role === enumRole.CHILD ? (
                                    <Text
                                        style={[
                                            styles.input,
                                            styles.disabledInput,
                                        ]}
                                    >
                                        {selectedCategory.label}
                                    </Text>
                                ) : (
                                    <>
                                        <TouchableOpacity
                                            style={[
                                                styles.dropdown,
                                                taskId && styles.disabledInput,
                                            ]}
                                            onPress={() => {
                                                if (!taskId) {
                                                    setShowCategoryDropdown(
                                                        !showCategoryDropdown
                                                    );
                                                }
                                            }}
                                        >
                                            <Text
                                                style={[
                                                    styles.dropdownText,
                                                    taskId && { color: "#999" },
                                                ]}
                                            >
                                                {selectedCategory.label}
                                            </Text>
                                            <ChevronDown
                                                size={16}
                                                color={
                                                    taskId ? "#999" : "#D2D2D2"
                                                }
                                            />
                                        </TouchableOpacity>
                                        {!taskId && showCategoryDropdown && (
                                            <View
                                                style={styles.dropdownContent}
                                            >
                                                {categories?.map((category) => (
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
                                                            setSelectedCategory(
                                                                category
                                                            );
                                                            setShowCategoryDropdown(
                                                                false
                                                            );
                                                        }}
                                                    >
                                                        <Text>
                                                            {category.label}
                                                        </Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        )}
                                    </>
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
                                                (selectedCategory.value ===
                                                    enumCategory.REWARD ||
                                                    taskId ||
                                                    user?.role ===
                                                        enumRole.CHILD) &&
                                                    styles.disabledInput,
                                            ]}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            value={value}
                                            placeholder="0"
                                            keyboardType="numeric"
                                            editable={
                                                !(
                                                    selectedCategory.value ===
                                                        enumCategory.REWARD ||
                                                    taskId ||
                                                    user?.role ===
                                                        enumRole.CHILD
                                                )
                                            }
                                        />
                                    )}
                                />
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={styles.label}>
                                    {selectedCategory.value ===
                                    enumCategory.REWARD
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
                                            style={[
                                                styles.input,
                                                user?.role === enumRole.CHILD && styles.disabledInput
                                            ]}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            value={value}
                                            placeholder="10"
                                            keyboardType="numeric"
                                            editable={
                                                user?.role !== enumRole.CHILD
                                            }
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
                                                (selectedCategory.value ===
                                                    enumCategory.PENALTY ||
                                                user?.role === enumRole.CHILD) &&
                                                    styles.disabledInput,
                                            ]}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            value={value}
                                            placeholder="200"
                                            keyboardType="numeric"
                                            editable={
                                                selectedCategory.value !==
                                                    enumCategory.PENALTY &&
                                                user?.role !== enumRole.CHILD
                                            }
                                        />
                                    )}
                                />
                            </View>
                        </View>

                        {user?.role === enumRole.PARENT && (
                            <>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Usuários</Text>
                                    <TouchableOpacity
                                        style={styles.dropdown}
                                        onPress={() =>
                                            setShowUsersDropdown(
                                                !showUsersDropdown
                                            )
                                        }
                                    >
                                        <Text style={styles.dropdownText}>
                                            {selectedUsers?.length
                                                ? `${selectedUsers?.length} selecionados`
                                                : "Selecione os usuários"}
                                        </Text>
                                        <ChevronDown
                                            size={16}
                                            color="#D2D2D2"
                                        />
                                    </TouchableOpacity>
                                    {showUsersDropdown && (
                                        <View style={styles.dropdownContent}>
                                            {users?.map((user) => (
                                                <TouchableOpacity
                                                    key={user.id}
                                                    style={[
                                                        styles.dropdownItem,
                                                        selectedUsers.find(
                                                            (u) =>
                                                                u.id === user.id
                                                        ) &&
                                                            styles.selectedItem,
                                                    ]}
                                                    onPress={() =>
                                                        toggleUserSelection(
                                                            user
                                                        )
                                                    }
                                                >
                                                    <View
                                                        style={{
                                                            flexDirection:
                                                                "row",
                                                            alignItems:
                                                                "center",
                                                            gap: 10,
                                                        }}
                                                    >
                                                        <OtherUserPhoto
                                                            id={user.id}
                                                            size={24}
                                                        />
                                                        <Text
                                                            style={
                                                                styles.userName
                                                            }
                                                        >
                                                            {user.name}
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    )}
                                </View>

                                {selectedUsers?.map((user) => (
                                    <View
                                        key={user.id}
                                        style={styles.selectedUserContainer}
                                    >
                                        <View style={styles.userInfo}>
                                            <OtherUserPhoto
                                                id={user.id}
                                                size={24}
                                            />
                                            <Text style={styles.userName}>
                                                {user.name}
                                            </Text>
                                            <TouchableOpacity
                                                onPress={() =>
                                                    handleDeleteUser(user.id)
                                                }
                                            >
                                                <Text style={styles.removeText}>
                                                    remover
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.userControls}>
                                            <View
                                                style={styles.rewardContainer}
                                            >
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
                                            <View
                                                style={styles.balanceContainer}
                                            >
                                                <Text style={styles.label}>
                                                    Saldo
                                                </Text>
                                                <TextInput
                                                    style={styles.balanceInput}
                                                    value={
                                                        userBalances[user.id]
                                                    }
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
                                            {taskId && (
                                                <CustomButton
                                                    height={30}
                                                    fontSize={12}
                                                    type="secondary"
                                                    onPress={() =>
                                                        handleAccount(user.id)
                                                    }
                                                >
                                                    Contabilizar
                                                </CustomButton>
                                            )}
                                        </View>
                                    </View>
                                ))}

                                <View style={styles.buttonContainer}>
                                    <CustomButton
                                        height={40}
                                        fontSize={16}
                                        onPress={() => handleDeleteTask(taskId)}
                                        color="#FF0000"
                                        backgroundColor="#FFE5E5"
                                    >
                                        Excluir
                                    </CustomButton>
                                    <CustomButton
                                        height={40}
                                        width={180}
                                        fontSize={16}
                                        onPress={handleSubmit(handleNewTask)}
                                        style={styles.saveButton}
                                    >
                                        Salvar Tarefa
                                    </CustomButton>
                                </View>
                            </>
                        )}

                        {user?.role === enumRole.CHILD && (
                            <View style={styles.chartSection}>
                                <Text style={styles.chartTitle}>
                                    {selectedCategory.value ===
                                    enumCategory.REWARD
                                        ? "Progresso da Recompensa"
                                        : "Progresso da Penalidade"}
                                </Text>
                                <DonutChart
                                    limitValue={task?.limitValue}
                                    currentBalance={task?.currentBalance}
                                    bonusBalance={task?.bonusBalance}
                                />
                            </View>
                        )}
                    </View>
                </Pressable>
            </ScrollView>

            <Modal
                visible={showHistoryModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowHistoryModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                Histórico da Ação
                            </Text>
                            <TouchableOpacity
                                onPress={() => setShowHistoryModal(false)}
                                style={styles.closeButton}
                            >
                                <Text style={styles.closeButtonText}>×</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.historyList}>
                            {isLoadingHistory ? (
                                <Text style={styles.loadingText}>
                                    Carregando...
                                </Text>
                            ) : history.length > 0 ? (
                                history?.map((item) => (
                                    <View
                                        key={item.id}
                                        style={styles.historyItem}
                                    >
                                        <View style={styles.historyInfo}>
                                            <Text
                                                style={styles.historyChildName}
                                            >
                                                {item.childName}
                                            </Text>
                                            <Text style={styles.historyDetails}>
                                                Contabilizado por{" "}
                                                {item.accountedByName}
                                            </Text>
                                            <Text style={styles.historyDetails}>
                                                Valor: {item.value} pontos
                                            </Text>
                                            <Text style={styles.historyDate}>
                                                {new Date(
                                                    item.accountedAt
                                                ).toLocaleDateString("pt-BR", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </Text>
                                        </View>
                                        {!item.isReverted ? (
                                            <CustomButton
                                                height={30}
                                                fontSize={12}
                                                type="secondary"
                                                onPress={() =>
                                                    handleRevertHistory(item.id)
                                                }
                                            >
                                                Reverter
                                            </CustomButton>
                                        ) : (
                                            <Text style={styles.revertedText}>
                                                Revertido
                                            </Text>
                                        )}
                                    </View>
                                ))
                            ) : (
                                <Text style={styles.noHistoryText}>
                                    Nenhum histórico encontrado
                                </Text>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
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
        alignItems: "flex-end",
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
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 10,
    },
    removeText: {
        fontSize: 12,
        fontFamily: fontFamily.roboto.regular,
        color: "#f01",
        textDecorationLine: "underline",
    },
    historyButtonContainer: {
        alignItems: "flex-end",
        marginBottom: 20,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    modalContent: {
        backgroundColor: colors.white,
        borderRadius: 24,
        padding: 20,
        width: "100%",
        maxWidth: 500,
        maxHeight: "80%",
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ECECEC",
    },
    modalTitle: {
        fontSize: 20,
        fontFamily: fontFamily.roboto.bold,
        color: colors.black,
    },
    closeButton: {
        padding: 5,
    },
    closeButtonText: {
        fontSize: 24,
        color: "#6B6B6B",
    },
    historyList: {
        maxHeight: "90%",
    },
    historyItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#ECECEC",
    },
    historyInfo: {
        flex: 1,
    },
    historyChildName: {
        fontSize: 16,
        fontFamily: fontFamily.roboto.bold,
        color: colors.black,
        marginBottom: 4,
    },
    historyDetails: {
        fontSize: 14,
        fontFamily: fontFamily.roboto.regular,
        color: "#6B6B6B",
        marginBottom: 2,
    },
    historyDate: {
        fontSize: 12,
        fontFamily: fontFamily.roboto.regular,
        color: "#ADADAD",
    },
    noHistoryText: {
        textAlign: "center",
        fontSize: 16,
        fontFamily: fontFamily.roboto.regular,
        color: "#6B6B6B",
        marginTop: 20,
    },
    loadingText: {
        textAlign: "center",
        fontSize: 16,
        fontFamily: fontFamily.roboto.regular,
        color: "#6B6B6B",
        marginTop: 20,
    },
    revertedText: {
        fontSize: 12,
        fontFamily: fontFamily.roboto.regular,
        color: "#ADADAD",
    },
    chartSection: {
        marginTop: 10,
        alignItems: "center",
        paddingHorizontal: 20,
        marginBottom: 40,
    },
    chartTitle: {
        fontSize: 18,
        fontFamily: fontFamily.roboto.bold,
        color: colors.black,
        marginBottom: 20,
        textAlign: "center",
    },
    chartContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    legendContainer: {
        marginTop: 20,
        width: "100%",
    },
    legendItem: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 5,
    },
    legendColor: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    legendText: {
        fontSize: 14,
        fontFamily: fontFamily.roboto.regular,
        color: "#6B6B6B",
    },
});
