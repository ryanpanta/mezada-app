import React from "react";
import { View, Dimensions, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { colors } from "../../styles/color";
import { fontFamily } from "../../styles/fontFamily";

const LineChartComponent = ({ data, legend }) => {
    if (!data || !data.datasets || !data.labels) {
        return null;
    }

    const screenWidth = Dimensions.get("window").width - 100;

    // Ensure all data points are valid numbers
    const validatedData = {
        ...data,
        datasets: data.datasets.map((dataset) => ({
            ...dataset,
            data: dataset.data.map((value) => Number(value) || 0),
        })),
    };

    const chartConfig = {
        backgroundColor: "#ffffff",
        backgroundGradientFrom: "#ffffff",
        backgroundGradientTo: "#ffffff",
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(82, 167, 94, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: {
            borderRadius: 16,
        },
        propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: colors.primary,
        },
        propsForLabels: {
            fontSize: 10,
            fontFamily: fontFamily.roboto.regular,
        },
    };

    // Check if there's any non-zero data
    const hasData = validatedData.datasets.some((dataset) =>
        dataset.data.some((value) => value !== 0)
    );

    if (!hasData) {
        return (
            <View style={{ maxWidth: "100%", width: "100%" }}>
                <Text style={styles.legend}>{legend}</Text>
                <Text style={styles.noData}>Não há dados para exibir</Text>
            </View>
        );
    }

    console.log("validatedData lineChart");
    console.log(validatedData)

    // Create legend items
    const renderLegend = () => {
        return (
            <View style={styles.legendContainer}>
                {validatedData.datasets.map((dataset, index) => (
                    <View key={index} style={styles.legendItem}>
                        <View
                            style={[
                                styles.legendColor,
                                { backgroundColor: dataset.color(1) },
                            ]}
                        />
                        <Text style={styles.legendText}>{dataset.label}</Text>
                    </View>
                ))}
            </View>
        );
    };

    return (
        <View style={{ maxWidth: "100%", width: "100%" }}>
            <Text style={styles.legend}>{legend}</Text>
            <LineChart
                data={validatedData}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={{
                    marginVertical: 8,
                    borderRadius: 16,
                }}
                yAxisSuffix=""
            />
            {renderLegend()}
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
    legendContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
        flexWrap: "wrap",
    },
    legendItem: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 10,
        marginVertical: 5,
    },
    legendColor: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 5,
    },
    legendText: {
        fontSize: 12,
        fontFamily: fontFamily.roboto.regular,
        color: colors.gray[600],
    },
    noData: {
        fontSize: 14,
        fontFamily: fontFamily.roboto.regular,
        color: colors.gray[600],
        textAlign: "center",
        marginTop: 20,
    },
};

export default LineChartComponent;
