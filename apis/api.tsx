import axios from 'axios';

const API_URL = 'http://localhost:5500';

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const login = async (email: string, password: string) => {
    try {
        const response = await axiosInstance.post(`/auth/login`, { email, password });
        return response.data;
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
};

export const signup = async (name: string, email: string, password: string) => {
    try {
        const response = await axiosInstance.post(`/auth/signup`, { name, email, password });
        return response.data;
    } catch (error) {
        console.error('Signup failed:', error);
        throw error;
    }
};

export const checkToken = async (user: any, refreshToken: string) => {
    try {
        const response = await axiosInstance.post(`/auth/token`, {
            user: user,
            refreshToken: refreshToken,
        });
        return response.data;
    } catch (error) {
        console.error('Check token failed:', error);
        throw error;
    }
};

export const logout = async (user_id: number) => {
    try {
        console.log(user_id);
        const response = await axiosInstance.post(`/auth/logout`, { user_id: user_id });
        return response.data;
    } catch (error) {
        console.error('Logout failed:', error);
        throw error;
    }
};

export const getList = async (id?: number) => {
    try {
        const response = await axiosInstance.get(`/list/${id}`);
        return response.data;
    } catch (error) {
        console.error('Get list failed:', error);
        throw error;
    }
};

export const getLists = async () => {
    try {
        const response = await axiosInstance.get(`/class/list`);
        return response.data;
    } catch (error) {
        console.error('Get list failed:', error);
        throw error;
    }
};

export const postList = async (title: string, body: string) => {
    try {
        const response = await axiosInstance.post(`/class/list`, { title, body });
        return response.data;
    } catch (error) {
        console.error('Post list failed:', error);
        throw error;
    }
};
