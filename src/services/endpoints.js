import api from "./api";

// export const getUsers = async () => {
//   try {
//     const response = await api.get('/Users');
//     return response.data; // Retorna os dados da resposta
//   } catch (error) {
//     throw error; // Erros são tratados no componente que chama
//   }
// };

// users
export const getUserById = async (id) => {
    try {
        const response = await api.get("/Users/" + id);
        return response;
    } catch (error) {
        throw error;
    }
};

export const getUsersByFamilyGroup = async (id) => {
    try {
        const response = await api.get("/Users/FamilyGroup" + id);
        return response;
    } catch (error) {
        throw error;
    }
};

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
};

// familygroups
export const createFamilyGroup = async (nameFamilyGroup) => {
    try {
        const response = await api.post(
            "/FamilyGroups/create",
            nameFamilyGroup
        );
        return response;
    } catch (error) {
        throw error;
    }
};

export const joinFamilyGroup = async (hashFamilyGroup) => {
    try {
        const response = await api.post("/FamilyGroups/join", hashFamilyGroup);
        return response;
    } catch (error) {
        throw error;
    }
};

export const getFamilyGroup = async (id) => {
    try {
        const response = await api.get("/FamilyGroups/" + id);
        return response;
    } catch (error) {
        throw error;
    }
};

export const getChildren = async (familyGroupId) => {
    try {
        const response = await api.get(
            "/FamilyGroups/" + familyGroupId + "/children"
        );
        return response;
    } catch (error) {
        throw error;
    }
};

export const getFamilyGroupInfo = async (familyGroupId) => {
    try {
        const response = await api.get(
            "/FamilyGroups/" + familyGroupId + "/info"
        );
        return response;
    } catch (error) {
        throw error;
    }
};

export const setAsParent = async (familyGroupId, newParentId) => {
    try {
        const response = await api.post(
            "/FamilyGroups/" + familyGroupId + "/set-admin",
            newParentId
        );
        return response;
    } catch (error) {
        throw error;
    }
};

// tasks
export const getTasks = async (filter, familyGroupId) => {
    try {
        const response = await api.get(
            `/Tasks?filter=${filter}&groupId=${familyGroupId}`
        );
        return response;
    } catch (error) {
        throw error;
    }
};

export const getFilters = async (familyGroupId) => {
    try {
        const response = await api.get("/Tasks/filters/" + familyGroupId);
        return response;
    } catch (error) {
        throw error;
    }
};

export const getTask = async (id) => {
    try {
        const response = await api.get("/Tasks/" + id);
        return response;
    } catch (error) {
        throw error;
    }
};

export const getHistory = async (id) => {
    try {
        const response = await api.get("/TaskHistory/" + id);
        return response;
    } catch (error) {
        throw error;
    }
};

export const revertHistory = async (id) => {
    try {
        const response = await api.post("/TaskHistory/revert", {
            historyId: id,
        });
        return response;
    } catch (error) {
        throw error;
    }
};
export const createTask = async (taskData) => {
    try {
        const response = await api.post("/Tasks", taskData);
        return response;
    } catch (error) {
        throw error;
    }
};

export const account = async (data) => {
    try {
        const response = await api.post("/Tasks/account-points", data);
        return response;
    } catch (error) {
        throw error;
    }
};
export const setAsApprovedTask = async (id) => {
    try {
        const response = await api.put("/Tasks/" + id + "/approve");
        return response;
    } catch (error) {
        throw error;
    }
};

export const setAsRejectedTask = async (id) => {
    try {
        const response = await api.put("/Tasks/" + id + "/reject");
        return response;
    } catch (error) {
        throw error;
    }
};

export const deleteTask = async (id) => {
    try {
        const response = await api.delete("/Tasks/" + id);
        return response;
    } catch (error) {
        throw error;
    }
};

export const removeUserFromTask = async (data) => {
    try {
        const response = await api.post("/Tasks/remove-child", data);
        return response;
    } catch (error) {
        throw error;
    }
};

export const getTaskStats = async (familyGroupId) => {
    try {
        const response = await api.get("/Tasks/stats/" + familyGroupId);
        return response;
    } catch (error) {
        throw error;
    }
};

// suggestion

export const postSuggestion = async (suggestion) => {
    try {
        const response = await api.post("/Suggestion", suggestion);
        return response;
    } catch (error) {
        throw error;
    }
};

export const getSuggestions = async () => {
    try {
        const response = await api.get("/Suggestion");
        return response;
    } catch (error) {
        throw error;
    }
};

export const getCycleSummary = async (familyGroupId) => {
    try {
        const response = await api.get("/Tasks/cycle-summary/" + familyGroupId);
        return response;
    } catch (error) {
        throw error;
    }
};