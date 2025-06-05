import React from "react";
import { View, Dimensions, Text } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { colors } from "../../styles/color";
import { fontFamily } from "../../styles/fontFamily";

const PieChartComponent = ({ data, legend }) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
        return null;
    }

    const screenWidth = Dimensions.get("window").width - 60;

    // Ensure all values are valid numbers
    const validatedData = data.map((item) => ({
        ...item,
        value: Number(item.value) || 0,
    }));

    const chartConfig = {
        backgroundColor: "#ffffff",
        backgroundGradientFrom: "#ffffff",
        backgroundGradientTo: "#ffffff",
        color: (opacity = 1) => `rgba(82, 167, 94, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: {
            borderRadius: 16,
        },
    };

    // Check if all values are 0
    const hasNonZeroValues = validatedData.some((item) => item.value !== 0);
    if (!hasNonZeroValues) {
        return (
            <View style={{ maxWidth: "100%", width: "100%" }}>
                <Text style={styles.legend}>{legend}</Text>
                <Text style={styles.noData}>Não há dados para exibir</Text>
            </View>
        );
    }

    return (
        <View style={{ maxWidth: "100%", width: "100%" }}>
            <Text style={styles.legend}>{legend}</Text>
            <PieChart
                data={validatedData}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                accessor="value"
                backgroundColor="transparent"
                paddingLeft="10"
                absolute
            />
        </View>
    );
};

const styles = {
    legend: {
        fontSize: 14,
        fontFamily: fontFamily.roboto.bold,
        color: colors.black,
        marginBottom: 10,
    },
    noData: {
        fontSize: 14,
        fontFamily: fontFamily.roboto.regular,
        color: colors.gray[600],
        textAlign: "center",
        marginTop: 20,
    },
};

export default PieChartComponent;
