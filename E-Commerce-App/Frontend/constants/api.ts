import axios from 'axios'

const api = axios.create({
    baseURL: "https://ecom-native-app-server-nu.vercel.app/api"
});

export default api;