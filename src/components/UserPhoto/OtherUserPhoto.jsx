import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { colors } from "../../styles/color";
import { getUserById } from "../../services/endpoints";

function OtherUserPhoto({id, width = 28, fontSize = 14}) {
    const [user, setUser] = React.useState(null);
    React.useEffect(() => {
        async function fetchUser() {
            try {
                const response = await getUserById(id);
                if (response.status === 200) {
                    setUser(response.data);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchUser();
    }, [id]);

    console.log(user);
    function getPhoto(name) {
        const names = name.split(" ");
        if (names.length > 1) {
            return names[0].charAt(0) + names[1].charAt(0);
        }
        return names.slice(0, 2).join("");
    }
    return (
        <View style={[styles.container, { width, height: width }]}>
            <Text style={[styles.textName, { fontSize }]}>
                {getPhoto(user?.name ?? "")}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: "50%",
        backgroundColor: colors.primary,
        justifyContent: "center",
        alignItems: "center",
    },

    textName: {
        color: colors.secondary,
    },
});

export default OtherUserPhoto;
