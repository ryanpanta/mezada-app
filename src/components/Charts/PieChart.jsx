import React from "react";
import { View, Dimensions, Text } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { colors } from "../../styles/color";
import { fontFamily } from "../../styles/fontFamily";

const PieChartComponent = ({ data, legend }) => {
    const screenWidth = Dimensions.get("window").width - 60;

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

    return (
        <View style={{ maxWidth: "100%", width: "100%"}}>
            <Text style={styles.legend}>{legend}</Text>
            <PieChart
                data={data}
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
};

export default PieChartComponent;
