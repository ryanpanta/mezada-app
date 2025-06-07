import React from "react";
import { View, Text, Dimensions } from "react-native";
import Svg, { G, Path, Text as SvgText } from "react-native-svg";
import * as d3 from "d3";
import { colors } from "../../styles/color";
import { fontFamily } from "../../styles/fontFamily";

const PieChart = ({ data, legend: chartLegend }) => {
    if (!data || data.length === 0) return null;

    const width = Dimensions.get("window").width - 150;
    const height = width;
    const radius = Math.min(width, height) / 2;
    const centerX = width / 2;
    const centerY = height / 2;

    // Create pie generator
    const pie = d3
        .pie()
        .value((d) => d.value)
        .sort(null);

    // Create arc generator
    const arc = d3
        .arc()
        .innerRadius(radius * 0.4)
        .outerRadius(radius * 0.8);

    // Generate paths
    const paths = pie(data).map((d, i) => ({
        path: arc({
            startAngle: d.startAngle,
            endAngle: d.endAngle,
            padAngle: 0.02,
        }),
        color: data[i].color,
        name: data[i].name,
        value: data[i].value,
    }));

    // Renderizar a legenda
    const renderLegend = () => {
        return (
            <View style={styles.legendContainer}>
                {data.map((item, index) => (
                    <View key={index} style={styles.legendItem}>
                        <View
                            style={[
                                styles.legendColor,
                                { backgroundColor: item.color },
                            ]}
                        />
                        <Text style={styles.legendText}>
                            {item.name}: {item.value}
                        </Text>
                    </View>
                ))}
            </View>
        );
    };

    return (
        <View style={{ width: "100%" }}>
            <Text style={styles.legend}>{chartLegend}</Text>
            <View style={styles.chartContainer}>
                <Svg width={width} height={height}>
                    <G transform={`translate(${centerX}, ${centerY})`}>
                        {paths.map((item, index) => (
                            <Path
                                key={index}
                                d={item.path}
                                fill={item.color}
                                strokeWidth={2}
                            />
                        ))}
                    </G>
                </Svg>
                {renderLegend()}
            </View>
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
    chartContainer: {
        alignItems: "center",
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
};

export default PieChart;
