import api from './api';

export const getTasks = async () => {
    try {
        const response = await api.get('/api/tasks');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

export const createTask = async (title, description, status) => {
    try {
        const response = await api.post('/api/tasks', { title, description, status });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

export const updateTask = async (id, title, description, status) => {
    try {
        const response = await api.put(`/api/tasks/${id}`, { title, description, status });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const deleteTask = async (id) => {  
    try {
        const response = await api.delete(`/api/tasks/${id}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};