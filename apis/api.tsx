import axios from 'axios';

const API_URL = 'http://localhost:5500';

export const login = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, { email, password });
        return response.data;
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
};

export const signup = async (name: string, email: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/auth/signup`, { name, email, password });
        return response.data;
    } catch (error) {
        console.error('Signup failed:', error);
        throw error;
    }
};

export const checkToken = async (user: any, refreshToken: string) => {
    try {
        const response = await axios.post(
            `${API_URL}/auth/token`,
            {
                user: user,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    refreshToken: refreshToken,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Check token failed:', error);
        throw error;
    }
};

export const logout = async (user_id: number) => {
    try {
        console.log(user_id);
        const response = await axios.post(
            `${API_URL}/auth/logout`,
            { user_id: user_id },
            {
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error) {
        console.error('Logout failed:', error);
        throw error;
    }
};
