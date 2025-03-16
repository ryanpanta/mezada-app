import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
    baseURL: "http://192.168.0.108:5003/api",
    headers: {
        "Content-Type": "application/json",
    },
});

let activeRequests = 0;
let setLoadingCallback = null;

export function setLoadingHandler(handler) {
  setLoadingCallback = handler;
}

const setLoading = (isLoading) => {
  if (setLoadingCallback) {
      setLoadingCallback(isLoading);
      console.log(`[API] Loading: ${isLoading}`);
  }
};

api.interceptors.request.use(
    async (config) => {
        activeRequests++;
        setLoading(true);
        const userId = await AsyncStorage.getItem("userId");
        if (userId) {
            config.headers["X-User-Id"] = userId;
        }
        console.log(
            `[API] Requisição: ${config.method.toUpperCase()} ${config.url}`
        );
        return config;
    },
    (error) => {
        activeRequests--;
        if (activeRequests === 0) setLoading(false);
        console.error("[API] Erro na requisição:", error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
  (response) => {
      activeRequests--;
      if (activeRequests === 0) setLoading(false); 
      return response;
  },
  (error) => {
      activeRequests--;
      if (activeRequests === 0) setLoading(false);
      return Promise.reject(error);
  }
);

export default api;