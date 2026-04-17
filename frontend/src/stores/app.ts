import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const isDark = ref(false)
  const sidebarCollapsed = ref(false)
  const loading = ref(false)
  const notification = ref<{ type: 'success' | 'error' | 'info'; message: string } | null>(null)

  function toggleDark() {
    isDark.value = !isDark.value
    document.documentElement.classList.toggle('dark', isDark.value)
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }

  function initTheme() {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      isDark.value = true
      document.documentElement.classList.add('dark')
    }
  }

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  function showNotification(type: 'success' | 'error' | 'info', message: string) {
    notification.value = { type, message }
    setTimeout(() => {
      notification.value = null
    }, 3000)
  }

  return {
    isDark,
    sidebarCollapsed,
    loading,
    notification,
    toggleDark,
    initTheme,
    toggleSidebar,
    showNotification,
  }
})
