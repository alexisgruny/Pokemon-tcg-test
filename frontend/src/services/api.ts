import axios from 'axios';
import { API_BASE_URL, API_ROUTES, REQUEST_TIMEOUT } from '../constants/api';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: { msg?: string; message?: string }[];
}

/**
 * Centralized API service for all backend calls
 */
class ApiService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    timeout: REQUEST_TIMEOUT.DEFAULT,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  constructor() {
    // Add JWT token to requests
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle responses
    this.api.interceptors.response.use(
      (response) => response,
      (error: any) => {
        // Handle 401 - redirect to login
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * AUTH ENDPOINTS
   */
  async login(email: string, password: string): Promise<ApiResponse<{ token: string }>> {
    return this.post(API_ROUTES.AUTH.LOGIN, { email, password });
  }

  async register(data: {
    username: string;
    email: string;
    password: string;
    inGameName: string;
    friendCode: string;
  }): Promise<ApiResponse> {
    return this.post(API_ROUTES.AUTH.REGISTER, data);
  }

  async logout(): Promise<ApiResponse> {
    return this.get(API_ROUTES.AUTH.LOGOUT);
  }

  async googleLogin(idToken: string): Promise<ApiResponse<{ token: string }>> {
    return this.post(API_ROUTES.AUTH.GOOGLE_LOGIN, { idToken });
  }

  /**
   * CARD ENDPOINTS
   */
  async getCards(): Promise<ApiResponse<any[]>> {
    return this.get(API_ROUTES.CARDS.LIST);
  }

  async getCardDetails(cardId: string): Promise<ApiResponse> {
    return this.get(API_ROUTES.CARDS.DETAILS(cardId));
  }

  async addOrUpdateCard(cardId: string, quantity: number): Promise<ApiResponse> {
    return this.post(API_ROUTES.CARDS.ADD_OR_UPDATE, { cardId, quantity });
  }

  async removeCard(cardId: string): Promise<ApiResponse> {
    return this.post(API_ROUTES.CARDS.REMOVE, { cardId });
  }

  async filterCards(setName?: string, name?: string): Promise<ApiResponse<any[]>> {
    return this.get(API_ROUTES.CARDS.FILTER, { setName, name });
  }

  /**
   * SET ENDPOINTS
   */
  async getSets(): Promise<ApiResponse<any[]>> {
    return this.get(API_ROUTES.SETS.LIST);
  }

  async getSetDetails(setId: string): Promise<ApiResponse> {
    return this.get(API_ROUTES.SETS.DETAILS(setId));
  }

  async getSetCards(setId: string): Promise<ApiResponse<any[]>> {
    return this.get(API_ROUTES.SETS.CARDS(setId));
  }

  /**
   * USER ENDPOINTS
   */
  async searchUsers(username: string): Promise<ApiResponse> {
    return this.get(API_ROUTES.USERS.SEARCH, { username });
  }

  async getRandomUsers(): Promise<ApiResponse<any[]>> {
    return this.get(API_ROUTES.USERS.LIST_RANDOM);
  }

  async getUserProfile(username: string): Promise<ApiResponse> {
    return this.get(API_ROUTES.USERS.PROFILE(username));
  }

  /**
   * PROFILE ENDPOINTS
   */
  async getProfile(): Promise<ApiResponse> {
    return this.get(API_ROUTES.PROFILE.GET);
  }

  async updateProfile(data: Record<string, any>): Promise<ApiResponse> {
    return this.post(API_ROUTES.PROFILE.UPDATE, data);
  }

  async deleteProfile(): Promise<ApiResponse> {
    return this.post(API_ROUTES.PROFILE.DELETE);
  }

  /**
   * HELPER METHODS
   */
  private async get<T = any>(
    url: string,
    params?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.get<ApiResponse<T>>(url, { params });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async post<T = any>(
    url: string,
    data?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.post<ApiResponse<T>>(url, data);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: any): ApiResponse {
    if (error.response?.data) {
      return error.response.data;
    }
    return {
      success: false,
      error: error.message || 'Erreur réseau',
    };
  }
}

export default new ApiService();
