import api from './api';

export const register = async (name, email, password) => {
    try {
        const response = await api.post('/api/auth/register', { name, email, password });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

export const loginUser = async (email, password) => {
    try {
        const response = await api.post('/api/auth/login', { email, password });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

// ainda falta desenvolver no backend
export const getUserProfile = async (token) => {
    try {
        const response = await api.get('/api/auth/profile', {
            headers: {
                Authorization: `Bearer ${token}`
            },
        });
        return response.data.user;
    } catch (error) {
        return error.response.data;
    }
}