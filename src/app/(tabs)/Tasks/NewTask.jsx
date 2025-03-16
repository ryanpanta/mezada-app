import { View, Text, Button, StyleSheet, TextInput } from "react-native";
import HeaderCustom from "../../../components/HeaderCustom";
import { colors } from "../../../styles/color";
import { fontFamily } from "../../../styles/fontFamily";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomButton from "../../../components/Form/CustomButtom";
import { useRouter } from "expo-router";

const schema = yup.object().shape({
    title: yup.string().required("O título é obrigatório").max(100),
    description: yup.string().required("A descrição é obrigatória").max(500),
    points: yup.number().moreThan(0).required("Os pontos são obrigatórios").max(5),
});

export default function NewTask() {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const router = useRouter();

    function handleNewTask(data) {
        console.log(data);

        router.replace("/Tasks");
    }
    return (
        <View style={styles.container}>
            <View style={{ marginBottom: 26 }}>
                <HeaderCustom title="Adicionar Tarefa" />
            </View>
            <Text style={styles.mainText}>
                Cada tarefa deve ter uma pontuação entre 1 e 5. Essa pontuação
                será usada para calcular o seu progresso e recompensas no grupo.
            </Text>
            <View style={styles.formContainer}>
                <View>
                    <View style={styles.inputContainer}>
                        <Controller
                            control={control}
                            name="title"
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
                                <TextInput
                                    style={styles.input}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    value={value}
                                    placeholder="Título"
                                />
                            )}
                        />
                    </View>
                    {errors.title && (
                        <Text style={styles.errorText}>
                            {errors.title.message}
                        </Text>
                    )}
                </View>

                <View>
                    <View style={styles.inputContainer}>
                        <Controller
                            control={control}
                            name="description"
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
                                <TextInput
                                    style={styles.input}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    value={value}
                                    placeholder="Descrição"
                                />
                            )}
                        />
                    </View>
                </View>
                <View>
                    <View style={styles.inputContainer}>
                        <Controller
                            control={control}
                            name="points"
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
                                <TextInput
                                    style={styles.input}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    value={value}
                                    placeholder="Pontos (1 a 5)"
                                    keyboardType="numeric"
                                />
                            )}
                        />
                    </View>
                    {errors.points && (
                        <Text style={styles.errorText}>
                            {errors.points.message}
                        </Text>
                    )}
                </View>
                <View style={styles.buttonContainer}>
                    <CustomButton
                        height={40}
                        fontSize={22}
                        onPress={handleSubmit(handleNewTask)}
                    >
                        Salvar Tarefa
                    </CustomButton>
                </View>
            </View>
        </View>
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
        fontSize: 18,
        marginBottom: 26,
        fontFamily: fontFamily.roboto.regular,
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
});
