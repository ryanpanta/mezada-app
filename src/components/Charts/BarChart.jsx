import React from "react";
import { View, Dimensions, Text } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { colors } from "../../styles/color";
import { fontFamily } from "../../styles/fontFamily";

const BarChartComponent = ({ data, legend }) => {
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
        barPercentage: 0.7,
        propsForLabels: {
            fontSize: 12,
            fontFamily: fontFamily.roboto.regular,
        },
    };

    console.log("validatedData barChart");
    console.log(validatedData);

    // Create legend items
    const renderLegend = () => {
        if (!data.legend) return null;

        return (
            <View style={styles.legendContainer}>
                {data.legend.map((item, index) => (
                    <View key={index} style={styles.legendItem}>
                        <View
                            style={[
                                styles.legendColor,
                                {
                                    backgroundColor:
                                        index === 0
                                            ? "rgba(82, 167, 94, 1)"
                                            : "rgba(255, 99, 132, 1)",
                                },
                            ]}
                        />
                        <Text style={styles.legendText}>{item}</Text>
                    </View>
                ))}
            </View>
        );
    };

    return (
        <View style={{ maxWidth: "100%", width: "100%" }}>
            <Text style={styles.legend}>{legend}</Text>
            <BarChart
                data={validatedData}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                style={{
                    maxWidth: "100%",
                    width: "100%",
                    marginVertical: 8,
                    borderRadius: 16,
                }}
                showValuesOnTopOfBars
                fromZero
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

export default BarChartComponent;
