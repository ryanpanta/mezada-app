import { View, Text, TouchableOpacity } from "react-native";
import { MoveLeft} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../styles/color";
import { fontFamily } from "../styles/fontFamily";

export default function HeaderCustom({ title }) {
    const navigation = useNavigation();

    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: colors.background,
                paddingTop: 8,
                
                maxWidth: "90%",
            }}
        >
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{ marginRight: 10, paddingRight: 10, paddingVertical: 4}}
            >
                <MoveLeft size={24} color={"#000"} />
            </TouchableOpacity>

            <Text
                style={{
                    fontSize: 24,
                    fontFamily: fontFamily.playfair.bold,
                    color: "#000",
                    lineHeight: 28,
                }}
            >
                {title}
            </Text>
        </View>
    );
}
