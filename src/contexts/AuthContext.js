import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUser, getCurrentUser } from "../services/endpoints.js";
import { showToast } from "../app/helpers/showToast.jsx";
import { useRouter } from "expo-router";
import { set } from "react-hook-form";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLogged, setIsLogged] = useState(false);
    const router = useRouter();

    useEffect(() => {
        async function loadUser() {
            const userId = await AsyncStorage.getItem("userId");
            if (userId) {
                try {
                    const userData = await getCurrentUser();
                    setUser(userData.data);
                    setIsLogged(true);
                } catch (error) {
                    console.error("Erro ao carregar usuário:", error);
                    await logout();
                }
            }
            setLoading(false);
        }
        loadUser();
    }, []);

    const login = async (data) => {
        try {
            const result = await loginUser(data);
            if (result.status === 200) {
                setIsLogged(true);
                await AsyncStorage.setItem("userId", result.data.userId);
                const userData = await getCurrentUser();
                setUser(userData.data);
                router.replace("/CreateOrEnterGroup");
            }
            
        } catch (error) {
            console.error(
                "Erro ao logar:",
                error.response?.data?.Message || error.message
            );
            showToast(error.response?.data?.Message || error.message, "error");
            throw error;
        }
    };

    const logout = async () => {
        await AsyncStorage.removeItem("userId");
        setIsLogged(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, isLogged }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth deve ser usado dentro de um AuthProvider");
    }
    return context;
}
