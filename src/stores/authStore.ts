import type {AuthState, LoginCredentials} from "@/types/auths.ts";
import {authService} from "@/services/authService.ts";
import {deleteCookie, setCookie} from "@/utils/cookies.ts";

export const useAuthStore = defineStore('authStore', {
  state: () :AuthState => ({
    user: null,
    accessToken:localStorage.getItem("accessToken") || null,
    refreshToken: localStorage.getItem("refreshToken") || null,
    loading: false,
    isAuthenticated: false,
    permissions: [],
    roles: []
  }),
  getters:{
    isLoggedIn:(state)=>!!state.accessToken && state.isAuthenticated,
    userRole:(state) => state.user?.role || null,
    userPermissions:(state) => state.permissions || [],
    hasRole: (state) => (role: string) => state.roles.includes(role),
    hasPermission: (state) => (permission: string) => state.permissions.includes(permission),
    canAccess:(state)=>(requiredRole:string[]=[], requiredPermission:string[] = []) => {
      if(requiredRole.length > 0){
        const hasRequiredRole = requiredRole.some(role => state.roles.includes(role));
        if(!hasRequiredRole) return false;
      }

      if(requiredPermission.length > 0){
        const hasRequiredPermission = requiredPermission.some(permission => state.permissions.includes(permission));
        if(!hasRequiredPermission) return false;
      }
      return true;
    }
  },
  actions:{
    async login(credentials: LoginCredentials){
      this.loading = true;
      try {
        const response = await authService.login(credentials);

        this.accessToken = response.accessToken;
        this.refreshToken = response.refreshToken;
        this.user = response.user;
        this.roles = response.user.roles || [response.user.role];
        this.permissions = response.user.permissions || [];
        this.isAuthenticated = true;

        localStorage.setItem("accessToken", this.accessToken);
        localStorage.setItem("refreshToken", this.refreshToken);
        localStorage.setItem("user_data", JSON.stringify(this.user));

        setCookie("accessToken", this.accessToken, 1);
        setCookie("refreshToken", this.refreshToken, 7);

        return response;
      }catch (error) {
        this.clearAuth();
        throw error;
      }finally {
        this.loading = false;
      }
    },

    async logout() {
      this.loading = true
      try {
        if (this.accessToken) {
          await authService.logout()
        }
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.clearAuth()
        this.loading = false
      }
    },

    async refreshAccessToken() {
      if (!this.refreshToken) {
        this.clearAuth()
        return null
      }

      try {
        const response = await authService.refreshAccessToken(this.refreshToken)
        this.accessToken = response.accessToken
        this.refreshToken = response.refreshToken

        localStorage.setItem('accessToken', response.accessToken)
        localStorage.setItem('refreshToken', response.refreshToken)

        return response.accessToken
      } catch (error) {
        this.clearAuth()
        throw error
      }
    },

    async fetchUserProfile() {
      if (!this.accessToken) return null

      try {
        const user = await authService.getProfile()
        this.user = user
        this.roles = user.roles || [user.role]
        this.permissions = user.permissions || []
        this.isAuthenticated = true
        return user
      } catch (error) {
        this.clearAuth()
        throw error
      }
    },

    clearAuth() {
      this.user = null
      this.accessToken = null
      this.refreshToken = null
      this.isAuthenticated = false
      this.permissions = []
      this.roles = []

      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')

      deleteCookie("accessToken");
      deleteCookie("refreshToken");
    },

    async initializeAuth() {
      const token = localStorage.getItem('accessToken')
      if (token) {
        this.accessToken = token
        this.refreshToken = localStorage.getItem('refreshToken')

        try {
          await this.fetchUserProfile()
        } catch (error) {
          console.error('Failed to initialize auth:', error)
          this.clearAuth()
        }
      }
    }
  }

});
