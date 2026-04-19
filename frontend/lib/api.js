const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}, session = null) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    } else if (typeof window !== 'undefined') {
      // Fallback to localStorage for non-session requests
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async registerWithEmail(email) {
    return this.request('/auth/register-email', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async verifyEmail(email, verificationCode) {
    return this.request('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ email, verificationCode }),
    });
  }

  async setPassword(email, password) {
    return this.request('/auth/set-password', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async restaurantLogin(email, password) {
    return this.request('/restaurants/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async clothingLogin(email, password) {
    return this.request('/clothing/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async adminLogin(adminId, password) {
    return this.request('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ adminId, password }),
    });
  }

  // Restaurant endpoints
  async getRestaurants(query = {}, session = null) {
    const params = new URLSearchParams(query);
    return this.request(`/restaurants?${params}`, {}, session);
  }

  async getRestaurant(id, session = null) {
    return this.request(`/restaurants/${id}`, {}, session);
  }

  async createRestaurant(restaurantData, session = null) {
    return this.request('/restaurants', {
      method: 'POST',
      body: JSON.stringify(restaurantData),
    }, session);
  }

  // Clothing endpoints
  async getClothing(query = {}, session = null) {
    const params = new URLSearchParams(query);
    return this.request(`/clothing?${params}`, {}, session);
  }

  // Coupon endpoints
  async generateCoupon(couponData, session = null) {
    return this.request('/coupons/generate', {
      method: 'POST',
      body: JSON.stringify(couponData),
    }, session);
  }

  async validateCoupon(couponCode, orderAmount) {
    return this.request('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ couponCode, orderAmount }),
    });
  }

  async redeemCoupon(couponCode, usageNotes) {
    return this.request('/coupons/redeem', {
      method: 'POST',
      body: JSON.stringify({ couponCode, usageNotes }),
    });
  }

  async confirmCouponAsUser(code, session = null) {
    return this.request(`/coupons/${encodeURIComponent(code)}/confirm-user`, {
      method: 'PATCH',
    }, session);
  }

  async confirmCouponAsRestaurant(code) {
    return this.request(`/coupons/${encodeURIComponent(code)}/confirm-restaurant`, {
      method: 'PATCH',
    });
  }

  async getUserCoupons(query = {}, session = null) {
    const params = new URLSearchParams(query);
    return this.request(`/coupons/my-coupons?${params}`, {}, session);
  }

  async getRestaurantCoupons(query = {}) {
    const params = new URLSearchParams(query);
    return this.request(`/coupons/restaurant-coupons?${params}`);
  }

  async searchCoupons(query = {}) {
    const params = new URLSearchParams(query);
    return this.request(`/coupons/search?${params}`);
  }

  // Admin endpoints
  async getAllUsers(session = null) {
    return this.request('/users', {}, session);
  }

  async deleteUser(id, session = null) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    }, session);
  }

  async getAllRestaurants(session = null) {
    return this.request('/admin/restaurants', {}, session);
  }

  async deleteRestaurant(id, session = null) {
    return this.request(`/admin/restaurants/${id}`, {
      method: 'DELETE',
    }, session);
  }

  async deleteCoupon(id, session = null) {
    return this.request(`/admin/coupons/${id}`, {
      method: 'DELETE',
    }, session);
  }

  async getStats(session = null) {
    return this.request('/admin/stats', {}, session);
  }
}

export const apiService = new ApiService();
