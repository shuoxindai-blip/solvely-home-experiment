export function loadPodcastTranscriptBundle() {
  if (window.SOLVELY_PODCAST_TRANSCRIPTS) return Promise.resolve()
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = '/assets/podcasts/transcripts.js'
    script.onload = resolve
    script.onerror = () => reject(new Error('Podcast transcript bundle failed to load'))
    document.head.append(script)
  })
}
