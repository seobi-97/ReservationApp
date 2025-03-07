import axios from 'axios';

const API_URL = 'http://localhost:5500';

export const login = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
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

    
