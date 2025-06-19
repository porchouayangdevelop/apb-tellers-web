

export const appStore =  defineStore('appStore',{
  state: () => ({
    sidebarOpen: false,
    drawer: true,
    isDarkMode: false,
    isMobile: false,
    isLoading: false,
    isAuthenticated: false,
    isRails: false,
    currentView: 'dashboard',
  }),
  getters: {
    isSidebarOpen: (state) => state.sidebarOpen,
  },
  actions:{

  }
})
