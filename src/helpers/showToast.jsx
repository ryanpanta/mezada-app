import Toast from "react-native-toast-message";

export function showToast(message, type) {
    Toast.show({
        type: type,
        position: "top",
        text1: type === "success" ? "Sucesso" : "Erro",
        text2: message,
        visibilityTime: 4000,
        autoHide: true,
        textStyle: { fontSize: 28 },
    });
}
