import { View, TouchableOpacity, StyleSheet } from "react-native";
import { usePathname, useRouter } from "expo-router";
import { Home, ClipboardList, UserRound } from "lucide-react-native";
import { colors } from "../styles/color";
export default function TabBarCustom() {
    const pathname = usePathname();
    const router = useRouter();

    const tabs = [
        { name: "Home", icon: Home },
        { name: "Tasks", icon: ClipboardList },
        { name: "Profile", icon: UserRound },
    ];

    return (
        <View style={styles.container}>
            {tabs.map((tab, index) => {
                const Icon = tab.icon;
                const isActive = pathname === `/${tab.name}`;
                const buttonSize = 48; // 28 (icon) + 20 (padding)
                return (
                    <TouchableOpacity
                        key={index}
                        onPress={() => router.push(`/${tab.name}`)}
                        style={{
                            backgroundColor: isActive ? "#fff" : "transparent",
                            borderRadius: buttonSize / 2,
                            padding: 10,
                            width: buttonSize,
                            height: buttonSize,
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Icon
                            size={28}
                            color={isActive ? "#4CAF50" : colors.secondary}
                        />
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 40,
        width: "55%",
        backgroundColor: colors.primary,
        borderRadius: 40,
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        shadowColor: "#52A75E",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 12,
        elevation: 5,
    },
});
