/** @type {import('tailwindcss').Config} */
export default {
  content:['./index.html', './src/**/*.{vue,js,ts}'],
  corePlugins:{ preflight:false },
  theme:{
    extend:{
      colors:{ solvely:{ 50:'#edf4ff', 600:'#2368f0', 700:'#1b54ca' } }
    }
  },
  plugins:[]
}
