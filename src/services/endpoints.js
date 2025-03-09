import api from "./api";

// export const getUsers = async () => {
//   try {
//     const response = await api.get('/Users');
//     return response.data; // Retorna os dados da resposta
//   } catch (error) {
//     throw error; // Erros são tratados no componente que chama
//   }
// };

export const registerUser = async (userData) => {
    try {
        const response = await api.post("/Users/register", userData);
        return response; 
    } catch (error) {
        throw error;
    }
};

export const loginUser = async (userData) => {
    try {
        const response = await api.post("/Users/login", userData);
        return response;
    } catch (error) {
        throw error; 
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await api.get("/Users/me");
        return response;
    } catch (error) {
        throw error;
    }
}
