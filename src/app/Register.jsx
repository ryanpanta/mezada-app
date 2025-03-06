import React from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import Porquinho from "../assets/porquinho.svg";
import CustomButton from "../components/Form/CustomButtom";
import { Eye, EyeOff } from "lucide-react-native";
import { colors } from "../styles/color";
import { SafeAreaView } from "react-native-safe-area-context";
import { fontFamily } from "../styles/fontFamily";
import { Link } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";

const schema = yup.object().shape({
    /* name: yup.string().required("O nome é obrigatório"),
    email: yup
        .string()
        .email("E-mail inválido")
        .required("O e-mail é obrigatório"),
    password: yup
        .string()
        .min(6, "A senha deve ter pelo menos 6 caracteres")
        .required("A senha é obrigatória"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "As senhas não são iguais")
        .required("A confirmação de senha é obrigatória"), */
});

export default function Register() {
    const router = useRouter();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

    async function handleRegister(data) {
        const { ConfirmPassword, ...filteredData } = data;
        console.log("Dados enviados:", filteredData);
        try {
            const response = await fetch("http://192.168.0.108:5003/api/Users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(filteredData),
            });
            console.log("Status da resposta:", response.status);
            const responseData = await response.json();
            
        } catch (error) {
            console.error("Erro detalhado:", error);
        console.error("Mensagem:", error.message);
        console.error("Stack trace:", error.stack);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.iconContainer}>
                <Porquinho width={90} height={90} />
            </View>
            <Text style={styles.title}>Cadastro</Text>

            <View style={styles.formContainer}>
                {/* Nome */}
                <View>
                    <View style={styles.inputContainer}>
                        <Controller
                            control={control}
                            name="Name"
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
                                <TextInput
                                    style={styles.input}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    value={value}
                                    placeholder="Nome"
                                />
                            )}
                        />
                    </View>
                    {errors.name && (
                        <Text style={styles.errorText}>
                            {errors.name.message}
                        </Text>
                    )}
                </View>

                {/* E-mail */}
                <View>
                    <View style={styles.inputContainer}>
                        <Controller
                            control={control}
                            name="Email"
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
                                <TextInput
                                    style={styles.input}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    value={value}
                                    placeholder="E-mail"
                                    keyboardType="email-address"
                                />
                            )}
                        />
                    </View>

                    {errors.email && (
                        <Text style={styles.errorText}>
                            {errors.email.message}
                        </Text>
                    )}
                </View>

                {/* Senha */}
                <View>
                    <View style={styles.inputContainer}>
                        <Controller
                            control={control}
                            name="Password"
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
                                <View style={styles.passwordWrapper}>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        value={value}
                                        placeholder="Senha"
                                        secureTextEntry={!showPassword}
                                    />
                                    <TouchableOpacity
                                        style={styles.eyeIcon}
                                        onPress={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff
                                                size={24}
                                                color={colors.gray[400]}
                                            />
                                        ) : (
                                            <Eye
                                                color={colors.gray[400]}
                                                size={24}
                                            />
                                        )}
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                    </View>
                    {errors.password && (
                        <Text style={styles.errorText}>
                            {errors.password.message}
                        </Text>
                    )}
                </View>

                {/* Confirmação de Senha */}
                <View>
                    <View style={styles.inputContainer}>
                        <Controller
                            control={control}
                            name="ConfirmPassword"
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
                                <View style={styles.passwordWrapper}>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        value={value}
                                        placeholder="Confirmação de Senha"
                                        secureTextEntry={!showConfirmPassword}
                                    />
                                    <TouchableOpacity
                                        style={styles.eyeIcon}
                                        onPress={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff
                                                color={colors.gray[400]}
                                                size={24}
                                            />
                                        ) : (
                                            <Eye
                                                color={colors.gray[400]}
                                                size={24}
                                            />
                                        )}
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                    </View>
                    {errors.confirmPassword && (
                        <Text style={styles.errorText}>
                            {errors.confirmPassword.message}
                        </Text>
                    )}
                </View>
                {/* Botão de Cadastro */}
                <View style={styles.buttonContainer}>
                    <CustomButton
                        height={50}
                        fontSize={24}
                        onPress={handleSubmit(handleRegister)}
                    >
                        Cadastrar
                    </CustomButton>
                </View>

                {/* Link para Login */}
                <View style={styles.questionContainer}>
                    <Text style={styles.questionText}>
                        Você já tem uma conta? Faça o{" "}
                        <Link style={styles.loginSpan} href={"/Login"}>
                            login
                        </Link>
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 30,
        paddingVertical: 50,
        backgroundColor: colors.background,
    },
    title: {
        fontFamily: fontFamily.playfair.extraBold,
        fontSize: 36,
        marginTop: 20,
        color: colors.black,
    },
    formContainer: {
        marginVertical: 30,
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
    passwordWrapper: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    eyeIcon: {
        paddingRight: 10,
    },
});
