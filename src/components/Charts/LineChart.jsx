import React from "react";
import { View, Dimensions, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { colors } from "../../styles/color";
import { fontFamily } from "../../styles/fontFamily";

const LineChartComponent = ({ data, legend }) => {
    const screenWidth = Dimensions.get("window").width - 100;

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
    };

    return (
        <View>
            <Text style={styles.legend}>{legend}</Text>
            <LineChart
                data={data}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={{
                    marginVertical: 8,
                    borderRadius: 16,
                }}
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
};

export default LineChartComponent;
