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

    function getPhoto(name) {
        const trimmedName = name.trim();
        
        const names = trimmedName.split(" ").filter(n => n);
        if (names.length > 1) {
            return names[0].charAt(0) + names[1].charAt(0);
        }
        return trimmedName.slice(0, 2).toUpperCase();
    }
    const color = user?.textColor ?? colors.secondary;
    const backgroundColor = user?.backgroundColor ?? colors.primary;
    return (
        <View style={[styles.container, { width, height: width, backgroundColor }]}>
            <Text style={[styles.textName, { fontSize, color }]}>
                {getPhoto(user?.name ?? "")}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: "50%",
        justifyContent: "center",
        alignItems: "center",
    },

});

export default OtherUserPhoto;
