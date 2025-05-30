import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { colors } from "../../styles/color";
import { getUserById } from "../../services/endpoints";

function UserPhoto({ width = 28, fontSize = 13 }) {
    const { user } = useAuth();
    const [colorsUser, setColorsUser] = React.useState({
        backgroundColor: colors.primary,
        color: colors.secondary,
    });

    React.useEffect(() => {
        async function fetchUser() {
            try {
                const response = await getUserById(user.userId);
                setColorsUser({
                    backgroundColor: response.data.backgroundColor,
                    color: response.data.color,
                });
            } catch (error) {
                console.log(error);
            }
        }
        fetchUser();
    }, [user]);

    function getPhoto(name) {
        if (!name) return "";
        const names = name.split(" ");
        if (names.length > 1) {
            return names[0].charAt(0) + names[1].charAt(0);
        }
        return name.slice(0, 2);
    }
    return (
        <View
            style={[
                styles.container,
                {
                    width,
                    height: width,
                    backgroundColor: colorsUser?.backgroundColor,
                    borderRadius: width / 2,
                },
            ]}
        >
            <Text
                style={[
                    styles.textName,
                    { fontSize, color: colorsUser?.color },
                ]}
            >
                {getPhoto(user?.name ?? "")}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
    },

    textName: {
        textTransform: "uppercase",
    },
});

export default UserPhoto;
