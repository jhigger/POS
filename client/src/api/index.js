import axios from 'axios';

const api = axios.create(require('./config.json'));
// Item API
export const insertItem = (payload) => api.post(`/item`, payload);
export const getAllItems = () => api.get(`/items`);
export const getAllOutOfStock = () => api.get(`/items/unavailable`);
export const getAllInStock = () => api.get(`/items/available`);
export const updateItemById = (id, payload) => api.put(`/item/${id}`, payload);
export const deleteItemById = (id) => api.delete(`/item/${id}`);
export const getItemById = (id) => api.get(`/item/${id}`);
// Sale API
export const insertSale = (payload) => api.post(`/sale`, payload);
export const getAllSales = () => api.get(`/sales`);
export const updateSaleById = (id, payload) => api.put(`/sale/${id}`, payload);
export const deleteSaleById = (id) => api.delete(`/sale/${id}`);
export const getSaleById = (id) => api.get(`/sale/${id}`);
export const getLastReceiptNumber = () => api.get(`/sales/lastReceiptNumber`);
// User API
export const insertUser = (payload) => api.post(`/register`, payload);
export const logUserIn = (payload) => api.post(`/login`, payload);
export const getAllUsers = () => api.get(`/users`);
export const updateUserById = (id, payload) => api.put(`/user/${id}`, payload);
export const deleteUserById = (id) => api.delete(`/user/${id}`);
export const getUserById = (id) => api.get(`/user/${id}`);
export const getUserByUsername = (username) => api.get(`/user/u/${username}`);

const apis = {
	insertItem,
	getAllItems,
	getAllOutOfStock,
	getAllInStock,
	updateItemById,
	deleteItemById,
	getItemById,
	insertSale,
	getAllSales,
	updateSaleById,
	deleteSaleById,
	getSaleById,
	getLastReceiptNumber,
	insertUser,
	logUserIn,
	getAllUsers,
	updateUserById,
	deleteUserById,
	getUserById,
	getUserByUsername
};

export default apis;
