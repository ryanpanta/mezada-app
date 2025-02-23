import React from "react";
import { View, Text } from "react-native";
import { Svg, G, Path } from "react-native-svg";
import * as d3 from "d3";
import { fontFamily } from "../../styles/fontFamily";
import { colors } from "../../styles/color";

const data = [
    { label: "Aprovadas", value: 80, color: "#ff6384" },
    { label: "Pendentes", value: 10, color: "#36a2eb" },
    { label: "Rejeitadas", value: 10, color: "#ffce56" },
    /* { label: "D", value: 10, color: "#4bc0c0" }, */
];

const PieChart = ({ width = 160, height = 160, legend }) => {
    const radius = Math.min(width, height) / 2;

    // Gerador de fatias do gráfico de pizza
    const pieGenerator = d3.pie().value((d) => d.value);
    const arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);

    const pieData = pieGenerator(data);

    return (
        <View style={{
            justifyContent: "center",
            alignItems: "center",
        }}>
            <View
                style={{
                    flexDirection: "row",
                    gap: 20,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Svg width={width} height={height}>
                    <G transform={`translate(${width / 2},${height / 2})`}>
                        {pieData.map((slice, index) => (
                            <Path
                                key={index}
                                d={arcGenerator(slice)}
                                fill={data[index].color}
                            />
                        ))}
                    </G>
                </Svg>
                <View>
                    {data.map((item, index) => (
                        <Text
                            key={index}
                            style={{ color: item.color, fontWeight: "bold" }}
                        >
                            {item.label}: {item.value}%
                        </Text>
                    ))}
                </View>
            </View>
            <Text style={{marginTop: 14, fontFamily: fontFamily.roboto.light, color: colors.black, fontSize: 16}}>Legenda: <Text style={{marginTop: 14, fontFamily: fontFamily.roboto.medium, color: colors.black, fontSize: 16}}>{legend}</Text></Text>
        </View>
    );
};

export default PieChart;
