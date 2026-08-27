<template>
  <ElConfigProvider>
    <NConfigProvider :theme-overrides="themeOverrides">
      <SolvelyRuntimeBoundary>
        <RouterView />
      </SolvelyRuntimeBoundary>
    </NConfigProvider>
  </ElConfigProvider>
</template>

<script setup>
import { ElConfigProvider } from 'element-plus'
import { NConfigProvider } from 'naive-ui'

const themeOverrides = {
  common:{ primaryColor:'#2368f0', primaryColorHover:'#1b54ca' }
}
</script>
