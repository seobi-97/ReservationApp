import { axiosInstance } from './axiosInstance';

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

export const getClasses = async () => {
    try {
        const response = await axiosInstance.get(`/class/list`);
        return response.data;
    } catch (error) {
        console.error('Get classes failed:', error);
        throw error;
    }
};

export const createClass = async (title: string, creator_id: number, start_date: string, description: string, status: string, capacity: number) => {
    try {
        const response = await axiosInstance.post(`/class/create`, { title, creator_id, start_date, description, status, capacity });
        return response.data;
    } catch (error) {
        console.error('Create class failed:', error);
        throw error;
    }
};

export const reserveClass = async (class_id: number, user_id: number) => {
    try {
        const response = await axiosInstance.post(`/class/reserve`, { class_id, user_id });
        return response.data;
    } catch (error) {
        console.error('Reserve class failed:', error);
        throw error;
    }
};

// 401 에러 시, 토큰 검증
export const checkToken = async (id: number) => {
    try {
        const response = await axiosInstance.post(`/auth/token`, { id: id });
        return response.data;
    } catch (error) {
        console.error('Check token failed:', error);
        throw error;
    }
};
