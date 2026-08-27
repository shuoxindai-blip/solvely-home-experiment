import katex from 'katex'

export function renderMath(expression, options = {}) {
  return katex.renderToString(expression, { throwOnError:false, ...options })
}

export async function loadRichTextToolkit() {
  const [{ EditorContent, useEditor }, { default:StarterKit }] = await Promise.all([
    import('@tiptap/vue-3'),
    import('@tiptap/starter-kit')
  ])
  return { EditorContent, useEditor, StarterKit }
}

export async function loadChartToolkit() {
  return import('echarts')
}
