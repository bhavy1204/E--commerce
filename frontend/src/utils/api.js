const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

class ApiClient {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            credentials: 'include',
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Request failed');
            }

            return data;
        } catch (error) {
            throw error;
        }
    }

    // Auth methods
    async register(userData) {
        return this.request('/users/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async login(email, password) {
        return this.request('/users/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    }

    async googleLogin(idToken) {
        return this.request('/auth/google', {
            method: 'POST',
            body: JSON.stringify({ idToken })
        });
    }


    async logout() {
        return this.request('/users/logout', {
            method: 'POST',
        });
    }

    async getCurrentUser() {
        return this.request('/users/me');
    }

    // Product methods
    async getProducts(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/products?${queryString}`);
    }

    async getProductById(id) {
        return this.request(`/products/${id}`);
    }

    async getCategories() {
        return this.request('/products/categories');
    }

    async createProduct(formData) {
        const url = `${this.baseURL}/products`;
        const config = {
            method: 'POST',
            headers: {},
            credentials: 'include',
            body: formData,
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Request failed');
            }

            return data;
        } catch (error) {
            throw error;
        }
    }

    async updateProduct(id, formData) {
        const url = `${this.baseURL}/products/${id}`;
        const config = {
            method: 'PUT',
            headers: {},
            credentials: 'include',
            body: formData,
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Request failed');
            }

            return data;
        } catch (error) {
            throw error;
        }
    }

    async deleteProduct(id) {
        return this.request(`/products/${id}`, {
            method: 'DELETE',
        });
    }

    // Order methods
    async createOrder(orderData) {
        return this.request('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData),
        });
    }

    async getUserOrders() {
        return this.request('/orders/my-orders');
    }

    async getOrderById(id) {
        return this.request(`/orders/${id}`);
    }

    async updateOrderStatus(id, status) {
        return this.request(`/orders/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
    }

    // Admin methods
    async getDashboardStats() {
        return this.request('/admin/dashboard');
    }

    async getTrafficStats(days = 30) {
        return this.request(`/admin/traffic?days=${days}`);
    }

    async getAllOrders(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/orders?${queryString}`);
    }

    // Site content
    async getSiteContent() {
        return this.request('/content');
    }

    async updateSiteContent(content) {
        return this.request('/content', {
            method: 'PUT',
            body: JSON.stringify(content),
        });
    }

    // download invoice
    async downloadInvoice(orderId) {
        const url = `${this.baseURL}/orders/${orderId}/invoice`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to download invoice');
            }

            return await response.blob(); // return file blob
        } catch (error) {
            throw error;
        }
    }
}

export const apiClient = new ApiClient();

