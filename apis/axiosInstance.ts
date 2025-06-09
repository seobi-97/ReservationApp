import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.0.124:5500';

export const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = AsyncStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        console.log('error:: ', error);
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = AsyncStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    const refreshResponse = await axiosInstance.post('/auth/token', {
                        refreshToken: refreshToken,
                    });
                    AsyncStorage.setItem('accessToken', refreshResponse.data.accessToken);
                    AsyncStorage.setItem('refreshToken', refreshResponse.data.refreshToken);

                    originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    // logout(user_id);
                    return Promise.reject(refreshError);
                }
            }
        }
        return Promise.reject(error);
    }
);
