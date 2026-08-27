import { defineStore } from 'pinia'

export const useWorkspaceStore = defineStore('workspace', {
  state:() => ({ runtimeReady:false, activeWorkspace:'study' }),
  actions:{
    markRuntimeReady() { this.runtimeReady = true },
    setActiveWorkspace(workspace) { this.activeWorkspace = workspace }
  }
})
