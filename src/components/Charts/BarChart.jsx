import React from "react";
import { View, Text } from "react-native";
import { Svg, Rect, G } from "react-native-svg";
import * as d3 from "d3";
import { fontFamily } from "../../styles/fontFamily";
import { colors } from "../../styles/color";

const data = [
    { label: "Tirei nota 10 em Matemática", value: 5, color: "#ff6384" },
    { label: "Finalizar projeto React Native", value: 5, color: "#36a2eb" },
    { label: "Estudar Redux", value: 4, color: "#ffce56" },
    { label: "Ler livro de JavaScript", value: 3, color: "#4bc0c0" },
];

const BarChart = ({ width = 300, height = 200, legend }) => {
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Escalas do D3
    const xScale = d3
        .scaleBand()
        .domain(data.map((d) => d.label))
        .range([0, chartWidth])
        .padding(0.2);

    const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.value)])
        .nice()
        .range([chartHeight, 0]);

    return (
        <View
            style={{
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <View style={{ alignItems: "center" }}>
                <Svg width={width} height={height}>
                    <G transform={`translate(${margin.left},${margin.top})`}>
                        {data.map((d, index) => (
                            <Rect
                                key={index}
                                x={xScale(d.label)}
                                y={yScale(d.value)}
                                width={xScale.bandwidth()}
                                height={chartHeight - yScale(d.value)}
                                fill={d.color}
                            />
                        ))}
                    </G>
                </Svg>
                <View style={{ marginTop: 0 }}>
                    {data.map((item, index) => (
                        <Text
                            key={index}
                            style={{ color: item.color, fontWeight: "bold" }}
                        >
                            {item.label}: {item.value}
                        </Text>
                    ))}
                </View>
            </View>
            <Text style={{marginTop: 14, fontFamily: fontFamily.roboto.light, color: colors.black, fontSize: 16}}>Legenda: <Text style={{marginTop: 14, fontFamily: fontFamily.roboto.medium, color: colors.black, fontSize: 16}}>{legend}</Text></Text>
        </View>
    );
};

export default BarChart;
