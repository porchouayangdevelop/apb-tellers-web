import type {
  LoginCredentials,
  AuthResponse,
  RefreshTokenResponse,
  User
} from "@/types/auths.ts";

import {authAxiosInstance} from "@/plugins/axios";

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await authAxiosInstance.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  }

  async logout(): Promise<void> {
    await authAxiosInstance.post("/auth/logout");
  }

  async refreshAccessToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await authAxiosInstance.post<RefreshTokenResponse>("/auth/refresh", {refreshToken});
    return response.data;
  }

  async getProfile(): Promise<User> {
    const response = await authAxiosInstance.get<User>("/auth/profile");
    return response.data;
  }

  async forgetPassword(email: string): Promise<void> {
    await authAxiosInstance.post("/auth/forget-password", {email});
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await authAxiosInstance.post("/auth/reset-password", {token, newPassword});
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await authAxiosInstance.post("/auth/change-password", {currentPassword, newPassword});
  }

  async verifyEmail(token: string): Promise<void> {
    await authAxiosInstance.post("/auth/verify-email", {token});
  }

  async mockLogin(credentials: LoginCredentials): Promise<AuthResponse | {
    user: {
      id: number;
      name: string;
      email: string;
      role: string;
      roles: string[];
      permissions: string[];
      avatar: string;
      status: string;
      lastLogin: string
    }
    accessToken: string;
    refreshToken: string;
    expiresIn: number
  }> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockUsers = {
      'admin@example.com': {
        id: 1,
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        roles: ['admin', 'user'],
        permissions: ['users.read', 'users.write', 'analytics.read', 'settings.write'],
        avatar: 'https://randomuser.me/api/portraits/men/85.jpg',
        status: 'active',
        lastLogin: new Date().toISOString()
      },
      'user@example.com': {
        id: 2,
        name: 'Regular User',
        email: 'user@example.com',
        role: 'user',
        roles: ['user'],
        permissions: ['analytics.read'],
        avatar: 'https://randomuser.me/api/portraits/women/85.jpg',
        status: 'active',
        lastLogin: new Date().toISOString()
      },
      'editor@example.com': {
        id: 3,
        name: 'Editor User',
        email: 'editor@example.com',
        role: 'editor',
        roles: ['editor', 'user'],
        permissions: ['users.read', 'analytics.read'],
        avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
        status: 'active',
        lastLogin: new Date().toISOString()
      }
    }

    const user = mockUsers[credentials.email as keyof typeof mockUsers];
    if (!user || credentials.password !== 'password123') {
      throw new Error('Invalid email or password');
    }
    return {
      user: user,
      accessToken: 'mockAccessToken',
      refreshToken: 'mockRefreshToken',
      expiresIn: 3600
    }
  }


}

export const authService = new AuthService();
