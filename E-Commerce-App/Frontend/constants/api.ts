import axios from 'axios'
import { Platform } from 'react-native'

const LOCAL_API_URL = Platform.select({
    android: "http://10.151.118.111:3000/api",
    ios: "http://10.151.118.111:3000/api",
    default: "http://localhost:3000/api",
});

const api = axios.create({
    baseURL: LOCAL_API_URL
});

export default api;