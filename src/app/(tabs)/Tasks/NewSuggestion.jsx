import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    Pressable,
} from "react-native";
import HeaderCustom from "../../../components/HeaderCustom";
import { colors } from "../../../styles/color";
import { fontFamily } from "../../../styles/fontFamily";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomButton from "../../../components/Form/CustomButtom";
import { useRouter } from "expo-router";
import { showToast } from "../../../helpers/showToast";
import { postSuggestion } from "../../../services/endpoints";

const schema = yup.object().shape({
    message: yup.string().required("A mensagem é obrigatória").max(500),
});

export default function NewSuggestion() {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const router = useRouter();

    async function handleNewSuggestion(data) {
        try {
            const response = await postSuggestion(data);
            if (response.status === 201) {
                showToast("Sugestão enviada com sucesso!", "success");
                router.replace("/Tasks");
            }
        } catch (error) {
            console.log(error.response?.data);
            showToast(
                "Erro ao enviar sugestão, tente novamente mais tarde",
                "error"
            );
        }
    }

    return (
        <ScrollView style={styles.container}>
            <Pressable style={{ flex: 1 }}>
                <View style={{ marginBottom: 26 }}>
                    <HeaderCustom title="Sugerir ação" />
                </View>
                <Text style={styles.text}>Sugira aos pais atividades que considere interessantes. Escreva uma mensagem clara e objetiva com sua ideia.</Text>
                <View style={styles.formContainer}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Mensagem</Text>
                        <Controller
                            control={control}
                            name="message"
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    value={value}
                                    placeholder="Escreva a mensagem"
                                    multiline
                                    numberOfLines={4}
                                />
                            )}
                        />
                        {errors.message && (
                            <Text style={styles.errorText}>
                                {errors.message.message}
                            </Text>
                        )}
                    </View>

                    <View style={styles.buttonContainer}>
                        <CustomButton
                            height={40}
                            width={320}
                            fontSize={16}
                            onPress={handleSubmit(handleNewSuggestion)}
                        >
                            Sugerir Tarefa
                        </CustomButton>
                    </View>
                </View>
            </Pressable>
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
        borderColor: "#B2B2B2",
        borderRadius: 6,
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
    errorText: {
        color: "#ff375b",
        fontSize: 14,
        fontFamily: fontFamily.roboto.regular,
        marginTop: 4,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
    },
    text: {
        fontSize: 16,
        fontFamily: fontFamily.roboto.regular,
        color: "#232323",
        marginBottom: 20,
    },
});
