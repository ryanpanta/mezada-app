import React, { useState, useEffect } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from "react-native";
import HeaderCustom from "../../../components/HeaderCustom";
import { colors } from "../../../styles/color";
import { fontFamily } from "../../../styles/fontFamily";
import PieChart from "../../../components/Charts/PieChart";
import BarChart from "../../../components/Charts/BarChart";
import LineChart from "../../../components/Charts/LineChart";
import { getCycleSummary, endCycle } from "../../../services/endpoints";
import { useAuth } from "../../../contexts/AuthContext";
import { showToast } from "../../../helpers/showToast";
import { useLoading } from "../../../contexts/LoadingContext";
import Loading from "../../../components/Helpers/Loading";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useRouter } from "expo-router";
import CustomButton from "../../../components/Form/CustomButtom";

export default function CloseCycle() {
    const { user } = useAuth();
    const [cycleSummary, setCycleSummary] = useState(null);
    const { isLoading, setIsLoading } = useLoading();
    const router = useRouter();

    async function fetchCycleSummary() {
        try {
            const response = await getCycleSummary(user?.familyGroupId);
            setCycleSummary(response.data);
        } catch (error) {
            console.error("Erro ao buscar o resumo do ciclo:", error);
            showToast(
                error.response?.data?.message ||
                    "Erro ao buscar o resumo do ciclo",
                "error"
            );
        }
    }

    useEffect(() => {
        fetchCycleSummary();
    }, []);

    const prepareMesadaDistributionData = () => {
        if (!cycleSummary?.childrenSummaries) return [];
        return cycleSummary.childrenSummaries.map((child, index) => ({
            name: child.childName,
            value: child.totalBalance,
            color: getChartColor(index),
            legendFontColor: "#7F7F7F",
            legendFontSize: 12,
        }));
    };

    const prepareRewardsPenaltiesData = () => {
        if (!cycleSummary?.childrenSummaries) {
            return { labels: [], datasets: [] };
        }

        const labels = cycleSummary.childrenSummaries.map(
            (child) => child.childName
        );
        const rewards = cycleSummary.childrenSummaries.map(
            (child) => Number(child.rewardBalance) || 0
        );
        const penalties = cycleSummary.childrenSummaries.map(
            (child) => Number(child.penaltyBalance) || 0
        );

        return {
            labels: labels,
            datasets: [
                {
                    data: rewards,
                    color: (opacity = 1) => `rgba(82, 167, 94, ${opacity})`, // Green for Recompensas
                    label: "Recompensas",
                },
                {
                    data: penalties,
                    color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`, // Pink for Penalidades
                    label: "Penalidades",
                },
            ],
            legend: ["Recompensas", "Penalidades"],
        };
    };

    const prepareBalanceHistoryData = () => {
        if (!cycleSummary?.childrenSummaries)
            return { labels: [], datasets: [] };

        const allDates = new Set();
        cycleSummary.childrenSummaries.forEach((child) => {
            child.balanceHistory.forEach((history) => {
                allDates.add(format(new Date(history.date), "dd/MM"));
            });
        });
        const sortedDates = Array.from(allDates).sort((a, b) => {
            const [dayA, monthA] = a.split("/").map(Number);
            const [dayB, monthB] = b.split("/").map(Number);
            return monthA === monthB ? dayA - dayB : monthA - monthB;
        });

        const colors = [
            (opacity = 1) => `rgba(82, 167, 94, ${opacity})`,
            (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
            (opacity = 1) => `rgba(54, 162, 235, ${opacity})`,
            (opacity = 1) => `rgba(255, 206, 86, ${opacity})`,
        ];

        return {
            labels: sortedDates,
            datasets: cycleSummary.childrenSummaries.map((child, index) => ({
                data: sortedDates.map((date) => {
                    const historyItem = child.balanceHistory.find(
                        (h) => format(new Date(h.date), "dd/MM") === date
                    );
                    return historyItem ? historyItem.balance : 0;
                }),
                color: colors[index % colors.length],
                label: child.childName,
            })),
        };
    };

    const prepareBonusData = () => {
        if (!cycleSummary?.childrenSummaries)
            return { labels: [], datasets: [] };
        return {
            labels: cycleSummary.childrenSummaries.map(
                (child) => child.childName
            ),
            datasets: [
                {
                    data: cycleSummary.childrenSummaries.map(
                        (child) => child.totalBonus
                    ),
                },
            ],
        };
    };

    const prepareTotalBalanceData = () => {
        if (!cycleSummary) return [];
        return [
            {
                name: "Positivo",
                value: cycleSummary.totalPositiveBalance,
                color: "#52A75E",
                legendFontColor: "#7F7F7F",
                legendFontSize: 12,
            },
            {
                name: "Negativo",
                value: Math.abs(cycleSummary.totalNegativeBalance),
                color: "#FF6384",
                legendFontColor: "#7F7F7F",
                legendFontSize: 12,
            },
        ];
    };

    const getChartColor = (index, opacity = 1) => {
        const colors = [
            `rgba(82, 167, 94, ${opacity})`,
            `rgba(255, 99, 132, ${opacity})`,
            `rgba(54, 162, 235, ${opacity})`,
            `rgba(255, 206, 86, ${opacity})`,
            `rgba(75, 192, 192, ${opacity})`,
        ];
        return colors[index % colors.length];
    };

    const handleEndCycle = async () => {
        try {
            setIsLoading(true);
            await endCycle(user?.familyGroupId);
            showToast("Ciclo encerrado com sucesso!", "success");
            router.push("/(tabs)/Home");
        } catch (error) {
            console.error("Erro ao encerrar o ciclo:", error);
            showToast(
                error.response?.data?.message || "Erro ao encerrar o ciclo",
                "error"
            );
        } finally {
            setIsLoading(false);
        }
    };

    if (cycleSummary === null) {
        return <Loading />;
    }

    return (
        <>
            {isLoading && <Loading />}
            <ScrollView style={styles.container}>
                <View style={{ marginBottom: 26 }}>
                    <HeaderCustom title="Encerrar o Ciclo" />
                </View>
                <Text style={styles.mainText}>
                    Ao encerrar o ciclo de mesada, todas as ações serão
                    contabilizadas. Nessa seção você pode visualizar gráficos de
                    desempenho ao longo do ciclo e uma sugestão de mesada com
                    base nos valores acumulados.
                </Text>

                <Text style={styles.sectionTitle}>Distribuição da Mesada</Text>
                <View style={styles.background}>
                    <PieChart
                        data={prepareMesadaDistributionData()}
                        legend="Distribuição por filho"
                    />
                </View>

                <Text style={styles.sectionTitle}>
                    Recompensas vs. Penalidades
                </Text>
                <View style={styles.background}>
                    <BarChart
                        data={prepareRewardsPenaltiesData()}
                        legend="Comparativo por filho"
                    />
                </View>

                <Text style={styles.sectionTitle}>Evolução do Saldo</Text>
                <View style={styles.background}>
                    <LineChart
                        data={prepareBalanceHistoryData()}
                        legend="Evolução por filho"
                    />
                </View>

                <Text style={styles.sectionTitle}>Bônus Acumulados</Text>
                <View style={styles.background}>
                    <BarChart
                        data={prepareBonusData()}
                        legend="Bônus por filho"
                    />
                </View>

                <Text style={styles.sectionTitle}>Balanço Total do Ciclo</Text>
                <View style={styles.background}>
                    <PieChart
                        data={prepareTotalBalanceData()}
                        legend="Distribuição total"
                    />
                </View>

                <Text style={styles.sectionTitle}>Recomendação de Mesada</Text>
                <View style={[styles.background, styles.lastBackground]}>
                    {cycleSummary?.childrenSummaries?.map((child, index) => (
                        <View key={index} style={styles.recommendationItem}>
                            <Text style={styles.childName}>
                                {child.childName}
                            </Text>
                            <Text style={styles.balanceText}>
                                Saldo Total: R$ {child.totalBalance}
                            </Text>
                            <Text style={styles.distributionText}>
                                Distribuição:{" "}
                                {(
                                    (child.totalBalance /
                                        cycleSummary.childrenSummaries.reduce(
                                            (acc, curr) =>
                                                acc + curr.totalBalance,
                                            0
                                        )) *
                                    100
                                ).toFixed(1)}
                                %
                            </Text>
                        </View>
                    ))}
                    <CustomButton
                        onPress={handleEndCycle}
                        style={styles.confirmButton}
                        fontSize={16}
                    >
                        Confirmar encerramento do ciclo
                    </CustomButton>
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
    mainText: {
        fontSize: 16,
        marginBottom: 26,
        fontFamily: fontFamily.roboto.regular,
        color: colors.gray[600],
        lineHeight: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: fontFamily.roboto.bold,
        marginBottom: 12,
        color: colors.black,
    },
    background: {
        marginTop: 10,
        padding: 20,
        backgroundColor: "rgba(82, 167, 94, 0.1)",
        borderRadius: 20,
        marginBottom: 30,
    },
     lastBackground: {
        marginBottom: 300,
    },
    recommendationItem: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: "rgba(82, 167, 94, 0.1)",
        borderRadius: 10,
    },
    childName: {
        fontSize: 16,
        fontFamily: fontFamily.roboto.bold,
        color: colors.black,
        marginBottom: 5,
    },
    balanceText: {
        fontSize: 14,
        fontFamily: fontFamily.roboto.regular,
        color: colors.gray[600],
        marginBottom: 3,
    },
    distributionText: {
        fontSize: 14,
        fontFamily: fontFamily.roboto.regular,
        color: colors.gray[600],
    },

    confirmButtonText: {
        color: colors.white,
        fontSize: 16,
        fontFamily: fontFamily.roboto.bold,
    },
});
