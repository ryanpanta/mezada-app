import { View, Text, StyleSheet, ScrollView } from "react-native";
import HeaderCustom from "../../../components/HeaderCustom";
import { colors } from "../../../styles/color";
import { fontFamily } from "../../../styles/fontFamily";
import React, { useEffect, useState } from "react";
import { getSuggestions } from "../../../services/endpoints";
import { showToast } from "../../../helpers/showToast";
import { useLoading } from "../../../contexts/LoadingContext";
import Loading from "../../../components/Helpers/Loading";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Suggestions() {
    const [suggestions, setSuggestions] = useState([]);
    const { isLoading } = useLoading();

    useEffect(() => {
        async function fetchSuggestions() {
            try {
                const response = await getSuggestions();
                if (response.status === 200) {
                    setSuggestions(response.data);
                }
            } catch (error) {
                console.log(error.response?.data);
                showToast(
                    "Erro ao buscar sugestões, tente novamente mais tarde",
                    "error"
                );
            }
        }
        fetchSuggestions();
    }, []);

    return (
        <>
            {isLoading && <Loading />}
            <ScrollView style={styles.container}>
                <View style={{ marginBottom: 26 }}>
                    <HeaderCustom title="Sugestões dos membros" />
                </View>

                <View style={styles.content}>
                    {suggestions.length === 0 ? (
                        <Text style={styles.emptyText}>
                            Nenhuma sugestão encontrada
                        </Text>
                    ) : (
                        suggestions.map((suggestion) => (
                            <View
                                key={suggestion.id}
                                style={styles.suggestionCard}
                            >
                                <View style={styles.header}>
                                    <Text style={styles.childName}>
                                        {suggestion.childName}
                                    </Text>
                                    <Text style={styles.date}>
                                        {format(
                                            new Date(suggestion.suggestedAt),
                                            "dd 'de' MMMM 'de' yyyy 'às' HH:mm",
                                            { locale: ptBR }
                                        )}
                                    </Text>
                                </View>
                                <Text style={styles.message}>
                                    {suggestion.message}
                                </Text>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
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
    content: {
        gap: 16,
    },
    suggestionCard: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: "#E9E9E9",
    },
    header: {
        marginBottom: 12,
    },
    childName: {
        fontSize: 18,
        fontFamily: fontFamily.roboto.bold,
        color: colors.black,
        marginBottom: 4,
    },
    date: {
        fontSize: 12,
        fontFamily: fontFamily.roboto.regular,
        color: "#6B6B6B",
    },
    message: {
        fontSize: 16,
        fontFamily: fontFamily.roboto.regular,
        color: colors.black,
        lineHeight: 24,
    },
    emptyText: {
        fontSize: 16,
        fontFamily: fontFamily.roboto.regular,
        color: "#6B6B6B",
        textAlign: "center",
        marginTop: 32,
    },
});
