import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'katex/dist/katex.min.css'
import './styles/tailwind.css'
import App from './App.vue'
import router from './router'
import SolvelyInternalUi from './internal-components'
import { loadPodcastTranscriptBundle } from './platform/runtimeAssets'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(SolvelyInternalUi)

loadPodcastTranscriptBundle()
  .catch(() => {})
  .finally(() => app.mount('#app'))
